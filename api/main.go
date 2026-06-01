package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type Message struct {
	Type    string                 `json:"t"`
	UID     string                 `json:"uid,omitempty"`
	Code    string                 `json:"code,omitempty"`
	Name    string                 `json:"name,omitempty"`
	DeckIDs []string               `json:"deckIds,omitempty"`
	Votes   map[string]interface{} `json:"votes,omitempty"`
	Msg     string                 `json:"msg,omitempty"`
	Room    *PublicRoom            `json:"room,omitempty"`
}

type Member struct {
	Name   string `json:"name"`
	Done   bool   `json:"done"`
	Online bool   `json:"online"`
}

type Room struct {
	Code     string
	HostUID  string
	Status   string // "lobby", "voting", "results"
	DeckIDs  []string
	Members  map[string]*Member
	Votes    map[string]map[string]interface{}
	Sockets  map[*websocket.Conn]bool
	mu       sync.RWMutex
	sendMu   sync.Mutex // serializes all writes to this room's sockets
}

type PublicRoom struct {
	Code    string                         `json:"code"`
	HostUID string                         `json:"hostUid"`
	Status  string                         `json:"status"`
	DeckIDs []string                       `json:"deckIds"`
	Members map[string]*Member             `json:"members"`
	Votes   map[string]map[string]interface{} `json:"votes"`
}

const (
	ALPHA = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"
	PORT  = ":8787"
)

var (
	rooms     = make(map[string]*Room)
	roomsLock = sync.RWMutex{}
	upgrader  = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
)

func generateCode() string {
	for {
		code := ""
		for i := 0; i < 4; i++ {
			code += string(ALPHA[rand.Intn(len(ALPHA))])
		}
		roomsLock.RLock()
		_, exists := rooms[code]
		roomsLock.RUnlock()
		if !exists {
			return code
		}
	}
}

func generateUID() string {
	return fmt.Sprintf("%x", rand.Int63())
}

func (r *Room) Public() *PublicRoom {
	r.mu.RLock()
	defer r.mu.RUnlock()

	// Deep-copy the maps so the snapshot can be marshaled without holding the
	// lock — otherwise json.Marshal would read maps another goroutine may mutate.
	members := make(map[string]*Member, len(r.Members))
	for uid, m := range r.Members {
		copy := *m
		members[uid] = &copy
	}
	votes := make(map[string]map[string]interface{}, len(r.Votes))
	for uid, v := range r.Votes {
		inner := make(map[string]interface{}, len(v))
		for k, val := range v {
			inner[k] = val
		}
		votes[uid] = inner
	}

	return &PublicRoom{
		Code:    r.Code,
		HostUID: r.HostUID,
		Status:  r.Status,
		DeckIDs: append([]string(nil), r.DeckIDs...),
		Members: members,
		Votes:   votes,
	}
}

// writeJSON serializes a single write to one socket against all other writes
// in the room. gorilla/websocket forbids concurrent writes to a connection.
func (r *Room) writeJSON(ws *websocket.Conn, obj interface{}) {
	r.sendMu.Lock()
	defer r.sendMu.Unlock()
	if err := ws.WriteJSON(obj); err != nil {
		log.Printf("write error: %v", err)
	}
}

func (r *Room) Broadcast(obj interface{}) {
	data, _ := json.Marshal(obj)

	r.mu.RLock()
	sockets := make([]*websocket.Conn, 0, len(r.Sockets))
	for ws := range r.Sockets {
		sockets = append(sockets, ws)
	}
	r.mu.RUnlock()

	r.sendMu.Lock()
	defer r.sendMu.Unlock()
	for _, ws := range sockets {
		if err := ws.WriteMessage(websocket.TextMessage, data); err != nil {
			log.Printf("broadcast error: %v", err)
		}
	}
}

func (r *Room) RefreshStatus() {
	r.mu.Lock()
	defer r.mu.Unlock()

	if r.Status == "voting" {
		online := 0
		allDone := true
		for _, m := range r.Members {
			if m.Online {
				online++
				if !m.Done {
					allDone = false
				}
			}
		}
		if online > 0 && allDone {
			r.Status = "results"
		}
	}
}

func handleWS(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("upgrade error: %v", err)
		return
	}
	defer ws.Close()

	uid := generateUID()
	var room *Room

	// Send hello
	ws.WriteJSON(Message{Type: "hello", UID: uid})

	for {
		msg := Message{}
		if err := ws.ReadJSON(&msg); err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("read error: %v", err)
			}
			break
		}

		switch msg.Type {
		case "create":
			newCode := generateCode()
			newRoom := &Room{
				Code:    newCode,
				HostUID: uid,
				Status:  "lobby",
				DeckIDs: msg.DeckIDs,
				Members: make(map[string]*Member),
				Votes:   make(map[string]map[string]interface{}),
				Sockets: make(map[*websocket.Conn]bool),
			}
			name := strings.TrimSpace(msg.Name)
			if len(name) > 16 {
				name = name[:16]
			}
			if name == "" {
				name = "Ẩn danh"
			}
			newRoom.Members[uid] = &Member{Name: name, Done: false, Online: true}
			newRoom.Sockets[ws] = true

			roomsLock.Lock()
			rooms[newCode] = newRoom
			roomsLock.Unlock()

			room = newRoom
			room.writeJSON(ws, Message{Type: "joined", Code: newCode, UID: uid})
			room.Broadcast(Message{Type: "room", Room: room.Public()})

		case "join":
			joinCode := strings.ToUpper(strings.TrimSpace(msg.Code))
			if len(joinCode) < 4 {
				ws.WriteJSON(Message{Type: "error", Msg: "Mã phòng gồm 4 ký tự."})
				continue
			}

			roomsLock.RLock()
			r, exists := rooms[joinCode]
			roomsLock.RUnlock()

			if !exists {
				ws.WriteJSON(Message{Type: "error", Msg: "Không tìm thấy phòng này 🥲"})
				continue
			}

			r.mu.Lock()
			if _, exists := r.Members[uid]; !exists {
				name := strings.TrimSpace(msg.Name)
				if len(name) > 16 {
					name = name[:16]
				}
				if name == "" {
					name = "Ẩn danh"
				}
				r.Members[uid] = &Member{Name: name, Done: false, Online: true}
			} else {
				r.Members[uid].Online = true
			}
			r.Sockets[ws] = true
			r.mu.Unlock()

			room = r
			room.writeJSON(ws, Message{Type: "joined", Code: joinCode, UID: uid})
			room.Broadcast(Message{Type: "room", Room: room.Public()})

		case "start":
			if room == nil || room.HostUID != uid {
				continue
			}
			room.mu.Lock()
			room.Status = "voting"
			room.mu.Unlock()
			room.Broadcast(Message{Type: "room", Room: room.Public()})

		case "vote":
			if room == nil {
				continue
			}
			room.mu.Lock()
			room.Votes[uid] = msg.Votes
			if member, exists := room.Members[uid]; exists {
				member.Done = true
			}
			room.mu.Unlock()
			room.RefreshStatus()
			room.Broadcast(Message{Type: "room", Room: room.Public()})

		case "reset":
			if room == nil || room.HostUID != uid {
				continue
			}
			room.mu.Lock()
			room.Status = "lobby"
			room.Votes = make(map[string]map[string]interface{})
			for _, m := range room.Members {
				m.Done = false
			}
			room.mu.Unlock()
			room.Broadcast(Message{Type: "room", Room: room.Public()})
		}
	}

	// Handle disconnect
	if room != nil {
		room.mu.Lock()
		delete(room.Sockets, ws)
		if member, exists := room.Members[uid]; exists {
			member.Online = false
		}

		// Hand host crown to another online member
		if room.HostUID == uid {
			for u, m := range room.Members {
				if m.Online && u != uid {
					room.HostUID = u
					break
				}
			}
		}
		room.mu.Unlock()

		room.RefreshStatus()
		room.Broadcast(Message{Type: "room", Room: room.Public()})

		// Garbage collect empty rooms after 1 minute
		if len(room.Sockets) == 0 {
			go func(r *Room, c string) {
				time.Sleep(60 * time.Second)
				roomsLock.Lock()
				current, exists := rooms[c]
				if exists && len(current.Sockets) == 0 {
					delete(rooms, c)
				}
				roomsLock.Unlock()
			}(room, room.Code)
		}
	}
}

func handleStatic(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	fmt.Fprint(w, "TasteMatch realtime server is running.\nWebSocket endpoint: ws://localhost:8787\n")
}

func main() {
	// Go 1.20+ auto-seeds the global rand source; no manual seeding needed.
	port := os.Getenv("PORT")
	if port == "" {
		port = "8787"
	}

	http.HandleFunc("/ws", handleWS)
	http.HandleFunc("/", handleStatic)

	addr := fmt.Sprintf(":%s", port)
	log.Printf("\n  🍜  TasteMatch realtime server  →  ws+http on :%s\n", port)
	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatalf("listen error: %v", err)
	}
}

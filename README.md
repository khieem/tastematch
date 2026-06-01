# 🍜 TasteMatch

A Tinder-style **group decision app** — stop arguing about where to eat. Everyone swipes Like ♥ / Pass ✕ / Kill 💀 on a deck of options, and the group sees a ranked winner in ~2 minutes.

The repo has two independent parts:

| Folder | What it is | Stack | Port |
|--------|-----------|-------|------|
| [`ui/`](ui) | The app you actually click | Next.js 16 · React 19 · TypeScript · Tailwind v4 | `3000` |
| [`api/`](api) | Realtime WebSocket server | Go 1.23 · gorilla/websocket | `8787` |

> **Current status:** the UI runs as a **single-player demo** (all state lives in the browser). The Go server is a working realtime backend but is **not yet wired into the UI** — see [Roadmap](#roadmap).

---

## Quick start

You only need the UI to see the app working.

```bash
cd ui
npm install        # first time only
npm run dev        # http://localhost:3000
```

Other port: `npm run dev -- -p 3001`

Flow: **Home → Create/Join → Lobby → Start → swipe the deck → Results → New Round / Home**

---

## Running the Go server (optional)

The server compiles and runs, but the UI doesn't connect to it yet.

```bash
cd api
go mod tidy        # downloads deps + writes go.sum
go run main.go     # ws+http on :8787
```

Visit http://localhost:8787 → `TasteMatch realtime server is running.`

Configure the port with the `PORT` env var (default `8787`). WebSocket message contract is documented in [`api/README.md`](api/README.md).

---

## Project structure

```
tastematch/
├── api/
│   ├── main.go           # WebSocket server: rooms, voting, host transfer, GC
│   └── README.md         # WebSocket message protocol
└── ui/
    └── app/
        ├── page.tsx      # stateful container — switches between screens
        ├── layout.tsx    # root shell + viewport meta
        ├── globals.css   # custom CSS + Tailwind v4 @theme tokens
        ├── data.ts       # ITEMS — the deck to vote on
        ├── types.ts      # GameState, Player, Vote
        ├── screens/      # Home · Create · Join · Lobby · Swipe · Results
        └── components/   # Card · TopBar
```

### How the UI works

`app/page.tsx` is a single client component holding all state (`screen`, `name`, `code`, `room`, `myVotes`) and rendering the matching screen. The screen components in `app/screens/` are presentational — they receive props and callbacks. There is **no routing**; navigation is just state changes.

### Customize the deck

Edit the `ITEMS` array in [`ui/app/data.ts`](ui/app/data.ts) — swap emojis, names, descriptions, colors, and tags for restaurants, movies, activities, anything.

---

## Common tasks

```bash
# UI
cd ui
npm run dev          # dev server (Turbopack, hot reload)
npm run build        # production build + typecheck
npm run start        # serve the production build
npm run lint         # eslint

# API
cd api
go run main.go       # run
bash build.sh        # static linux binary -> ./server
docker build -t tastematch-api .   # container image
```

---

## Roadmap

The UI and server already speak similar concepts but use **different data models** (UI: `players[]` + `phase`; server: `Members` map + `status`). To go from single-player demo to real multiplayer:

1. Add a WebSocket client in the UI that connects to `ws://localhost:8787/ws`.
2. Map server `room` broadcasts → UI `GameState`.
3. Drive `create` / `join` / `start` / `vote` / `reset` through the socket instead of local state.

---

## Notes

- **Tech:** Next.js 16 has breaking changes vs. older versions — see [`ui/AGENTS.md`](ui/AGENTS.md) before editing UI code.
- This is a **fun demo**. The server keeps rooms in memory only (no database) and auto-deletes empty rooms after 1 minute.

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

Run both the UI and the API with one command (installs deps on first run):

```bash
./run.sh                  # UI on :3000, API on :8787 — Ctrl+C stops both
UI_PORT=3001 ./run.sh     # custom UI port
PORT=9000 ./run.sh        # custom API port
```

Open http://localhost:3000.

Flow: **Home → Create/Join → Lobby → Start → swipe the deck → Results → New Round / Home**

### UI only

You only need the UI to see the app working (it doesn't call the API yet — see [Roadmap](#roadmap)):

```bash
cd ui
npm install               # first time only
npm run dev               # http://localhost:3000  (or: -- -p 3001)
```

### API only

```bash
cd api
go mod tidy               # first run only — downloads deps + writes go.sum
go run main.go            # ws+http on :8787
```

Visit http://localhost:8787 → `TasteMatch realtime server is running.` Port is set by the `PORT` env var (default `8787`); the WebSocket message contract is in [`api/README.md`](api/README.md).

---

## Project structure

```
tastematch/
├── run.sh                # dev runner — starts API + UI together
├── api/
│   ├── main.go           # WebSocket server: rooms, voting, host transfer, GC
│   └── README.md         # WebSocket message protocol
└── ui/
    └── app/
        ├── layout.tsx    # root shell + viewport meta, wraps GameProvider
        ├── providers.tsx # GameProvider + useGame() — shared client state
        ├── globals.css   # Tailwind v4 @theme tokens + keyframes only
        ├── data.ts       # ITEMS — the deck to vote on
        ├── types.ts      # GameState, Player, Vote
        ├── page.tsx      # /         Home
        ├── create/       # /create
        ├── join/         # /join
        ├── lobby/        # /lobby
        ├── vote/         # /vote
        ├── result/       # /result
        └── components/   # Card · TopBar
```

### How the UI works

Standard Next.js **App Router** — each screen is its own route (`/create`, `/join`, `/lobby`, `/vote`, `/result`). Shared state (`name`, `code`, `room`, `myVotes`) lives in a React Context (`app/providers.tsx`, mounted in the layout), so it survives client-side navigation; pages read it via `useGame()` and navigate with `useRouter()`. Routes that need an active room redirect home if there isn't one (e.g. on a hard refresh).

Styling is **Tailwind v4** utility classes throughout. `globals.css` holds only the design tokens (`@theme`) and keyframes — there are no hand-written component classes.

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

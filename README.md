# Aerolog

A parental digital-wellness dashboard that tracks AirPods/Bluetooth usage across a child's iPhone and iPad, with per-app time limits, a real-time parent dashboard, and on-device "Nag Mode" alerts.

## Stack
- **Backend:** Node.js + Express, MongoDB Atlas, WebSockets
- **Frontend:** React (PWA)
- **Device client:** iOS Shortcuts (background automations)

## Project layout
- `backend/` — Express API, Mongoose models, auth + sync routes, WebSocket server
- `frontend/` — React PWA (parent dashboard)
- `ios-client/` — iOS Shortcuts build instructions + exported shortcut files

## Build roadmap

### Phase 0 — Setup
- [x] Confirm Node/npm/Git installed
- [x] Project folder + git init
- [ ] GitHub remote + first commit
- [ ] MongoDB Atlas free cluster

### Phase 1 — Backend core
- [ ] Express server skeleton
- [ ] DeviceData Mongoose schema
- [ ] Bundle ID → app name dictionary
- [ ] Magic link rate limiter
- [ ] Heartbeat / offline-flag logic
- [ ] Sync endpoint
- [ ] WebSocket server

### Phase 2 — Frontend core
- [ ] React PWA scaffold
- [ ] Auth screens (magic link + password)
- [ ] Parent dashboard (progress ring, charts, offline banner)
- [ ] Real-time updates via WebSocket

### Phase 3 — iOS Shortcuts
- [ ] Local heartbeat logger
- [ ] Batching/sync shortcut (10–15 min)
- [ ] Nag Mode local notification loop
- [ ] Now Playing app-focus detection

### Phase 4 — Deployment (after 6/14)
- [ ] Claim free custom domain
- [ ] Deploy backend + frontend
- [ ] Point Shortcut webhook at production URL
- [ ] HTTPS setup
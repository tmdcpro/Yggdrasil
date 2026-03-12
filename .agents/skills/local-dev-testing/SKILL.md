# Yggdrasil Local Development & Testing

## Dev Server Setup

### Dependencies
```bash
pnpm install
```

### Start Backend (NestJS on port 5000)
```bash
pnpm dev:backend
```
- Logs: "Yggdrasil API running on http://localhost:5000"
- Swagger docs: http://localhost:5000/api/docs
- Uses in-memory store when Neo4j is not configured (warning: "Neo4j not configured - using in-memory store")

### Start Frontend (Vite on port 3000)
```bash
pnpm dev:frontend
```
- Vite proxies `/api` requests to `http://localhost:5000`

### Start All Services
```bash
pnpm dev
```
Uses `concurrently` to run frontend + backend + extraction service.

## Frontend Navigation
- **Dashboard** (`/`): Shows stats (Total Items, Unique Tags, Content Types) and Recent Captures list
- **Capture** (`/capture`): Form with Content Type selector, Title, Content/URL, AI toggle, Tags, Submit button
- **Graph** (`/graph`): Knowledge graph visualization with node sidebar

## Key Testing Flows

### Capture Pipeline (Primary E2E Flow)
1. Start backend and frontend dev servers
2. Navigate to http://localhost:3000/capture
3. Select content type (e.g., "Page URL")
4. Enter title and URL
5. Optionally add tags or select AI-suggested tags
6. Click "Save to Yggdrasil"
7. Form resets on success; error banner appears on failure
8. Navigate to Dashboard to verify capture appears in Recent Captures
9. Navigate to Graph to verify node appears in sidebar

### API Verification
- Swagger UI at http://localhost:5000/api/docs
- Endpoint groups: capture, nodes, tags

## Browser Setup (Devin Environment)
- Chrome binary: `/opt/.devin/chrome/chrome/linux-137.0.7118.2/chrome-linux64/chrome`
- Display: Use `$DISPLAY` env var (typically `:0`)
- Launch flags: `--no-first-run --disable-session-crashed-bubble --no-default-browser-check --remote-debugging-port=29229 --no-sandbox --disable-dev-shm-usage`
- The `google-chrome` wrapper at `~/.local/bin/google-chrome` connects to CDP on port 29229

## Lint & Typecheck
```bash
pnpm lint          # ESLint for frontend + backend
pnpm typecheck     # TypeScript noEmit check
```

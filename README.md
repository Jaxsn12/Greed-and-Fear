# Market Indicator

Split into two independent apps — no business logic changed, only the presentation layer moved from static HTML/JS to Angular.

## backend/ (Node + Express + TypeScript — layered, same logic)
Rewritten in TypeScript with a standard enterprise-style layering, so adding a new API later is just "add a file in each folder":

```
src/
  config/          env/constants
  types/           shared TS interfaces (Run, Signal, Direction, ...)
  utils/           classify, httpGet, withRetry (unchanged algorithms)
  sources/         external data fetchers (NASDAQ/Dow, NSE VIX+breadth, GIFT Nifty) — unchanged
  services/        business logic: voteEngine.service.ts (scoring) + indicator.service.ts (orchestrator + persistence)
  store/           file-based persistence (history.jsonl reads/writes) — unchanged
  scheduler/       cron job that calls the indicator service — unchanged
  controllers/     req/res handlers, call services, shape the response
  routes/          maps HTTP verb+path -> controller method; routes/index.ts aggregates feature routers
  cli/             run-now.ts — one-off CLI run (`npm run run-now`)
  app.ts           Express app + middleware (cors, json) + mounts routes/ under /api
  server.ts        bootstraps app.ts, starts the scheduler
```

To add a new feature/API: create `services/<name>.service.ts`, `controllers/<name>.controller.ts`, `routes/<name>.routes.ts`, then register it with one line in `routes/index.ts`.

Every original algorithm (vote engine, classification thresholds, retry/backoff, source parsing, file-based store, cron schedule) was ported as-is — verified by the existing test suite (`npm test`, still 29/29 passing) and by diffing live API output against the old JS version before/after.

```
cd backend
npm install
npm run dev       # ts-node-dev, auto-reload — http://localhost:4173 (PORT env var to override)
npm run build      # compiles to dist/
npm start          # runs the compiled build (dist/server.js)
npm test           # runs the ported test suite via ts-node
npm run run-now    # one-off indicator run from the CLI
```

API (unchanged): `GET /api/latest`, `GET /api/history?limit=`, `POST /api/run-now`.

## frontend/ (Angular — new)
Faithful port of the old `public/index.html` + `app.js` + `style.css` dashboard: same markup structure, class names, CSS (copied verbatim into `src/styles.css`), icons, and rendering rules (hero ring/value, tiles, history table, theme toggle, refresh button), just expressed as Angular components/services instead of manual DOM manipulation.

```
cd frontend
npm install
npm start         # ng serve, http://localhost:4200
```

Points at the backend via `src/environments/environment.ts` (`apiBase: 'http://localhost:4173'` in dev, same-origin `''` in prod — set that to wherever the built frontend is served relative to the API in production).

Run both (`backend` on 4173, `frontend` on 4200) at the same time during development.

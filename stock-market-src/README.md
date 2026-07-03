# Stock Command Center — source

Source for the app deployed at `/stock-market/`. Reconstructed from the
production bundle (the original Vite project was never committed), so this is
now the canonical source: edit here, never patch the built bundle.

## Build

```sh
cd stock-market-src
npm install
npm run build   # writes hashed bundles + index.html into ../stock-market/
```

The build outputs straight into `../stock-market/` with `emptyOutDir` off, so
`data/`, `favicon.svg`, `icons.svg`, and the standalone root scripts survive.
Stale `assets/index-*.js|css` bundles are deleted automatically before each
build. Commit the rebuilt output together with the source change.

## Things to know

- `stock-market/stock-live-refresh.js` (manual-refresh shim that rewrites
  `stocks.json` fetches to the Cloudflare `refresh` function) and
  `stock-market/portfolio-tools.js` (holdings export/import) are standalone
  scripts loaded by `index.html`, not part of the Vite build.
- Data files are produced by `scripts/refresh_stock_market_data.mjs` via the
  `stock-market-refresh` GitHub Actions workflow.
- `/stock-market/assets/*` is served with a 1-year immutable cache — any asset
  change must go through the hashed-filename build, never an in-place edit.
- Holdings (share counts, cost basis) live only in visitors' localStorage by
  design; `data/portfolio.json` carries symbols only.

## Deliberate design decisions (not open TODOs)

- **Average-cost holdings, not transaction lots.** The dashboard is a research
  and monitoring surface; shares + avg cost cover P&L without turning it into
  accounting software. Realized P&L, lots, and dividends are out of scope.
- **Research text is hand-curated.** Theses/risks/catalysts refresh only when
  edited in `data/stocks.json`; automating them would require a paid LLM API
  in the pipeline, which conflicts with the free-tier constraint.
- **Alerts evaluate in-browser only.** There is no backend, so alerts check
  on each data refresh while a tab is open; the Notifications API covers
  background tabs. Push-when-closed would require a server.

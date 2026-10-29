# Site Overview (for defining logging)

> **Direction changed:** logging is now a small `?lab=`-gated logger for the real site: a browser snippet posts button clicks to a Cloudflare Pages Function (`/api/log`) that inserts rows into D1. See `plan.md` (v3). Notes below on other logging approaches are background only; the facts about the site itself still hold.

Snapshot of the repo on branch `Aakash/logging`. It is based on `src/`, `package.json`, `vite.config.ts` and the CI workflow.

## What it is

A personal portfolio site for Jayden G. McKenna (`jaydengmckenna.com`). It is a **fully static single-page app (SPA)**. There is **no backend, no API, no database, and no auth**. There is one **front-end-only contact form** on `/about` (added in PR #3) whose submission goes nowhere. Everything runs in the visitor's browser.

This matters for logging. There is no server process to log from. "Logging" here means one of two things:
1. **Client-side logging**: errors, page views and interaction events captured in the browser and shipped to an external service.
2. **Build/deploy logging**: CI and Cloudflare Pages build output.

## Tech stack

| Area | Choice |
|---|---|
| Language | TypeScript 5.6 (`strict: true`) |
| UI | React 18.3 (`React.StrictMode` on) |
| Routing | react-router-dom 7 (`BrowserRouter`, declarative `<Routes>`) |
| Bundler / dev server | Vite 6 with `@vitejs/plugin-react` (no custom config) |
| Icons | lucide-react |
| Styling | Plain CSS, no framework, split per component in `src/styles/` and imported through `src/styles.css` |
| Fonts | Google Fonts (DM Sans, DM Mono, Manrope), loaded from `index.html` |
| Package manager | npm (`package-lock.json`) |
| Node | 20+ |
| CI | GitHub Actions (`.github/workflows/ci.yml`): `npm install`, then `npm run build` (`tsc -b && vite build`) on PRs and pushes to `main` |
| Hosting | Cloudflare Pages: build `npm run build`, output `dist/`, auto-deploys on push to `main`, preview deploys for PRs |

Not present: tests, linter, formatter, env vars (`.env`), analytics, error tracking, a logging library, or a service worker.

## Architecture

```
index.html            -> mounts #root, loads /src/main.tsx
src/main.tsx          -> entry: ReactDOM.createRoot, StrictMode, BrowserRouter, <App>, <SiteNavigation>
src/routes/
  Home.tsx            -> landing page (333 lines)
  Projects.tsx        -> projects grid
  ProjectDetail.tsx   -> /projects/:slug
  About.tsx           -> about page with contact form (165 lines)
  Journal.tsx         -> EMPTY (0 lines), not routed
src/styles.css + src/styles/*.css
```

### Routes (defined in `src/main.tsx`)

| Path | Component | Notes |
|---|---|---|
| `/` | `Home` | One long page with in-page anchors (`#home`, `#about`, `#work`, `#contact`). It has its own `topbar` header, so the shared nav is hidden here. |
| `/about` | `About` | Three text blocks plus the contact form (see below). Shown with the shared nav. |
| `/projects` | `Projects` | Card grid linking to detail pages. Search box and filter pills are rendered **disabled** (placeholder for later). |
| `/projects/:slug` | `ProjectDetail` | Shows a title only. An unknown slug shows a "PROJECT NOT FOUND" state inside the page. |
| `*` | inline 404 | "Page not found" with a link home. |

`App` renders `<SiteNavigation>` on every route except `/`, using `useLocation()`.

### Data

All content is **hardcoded in the components**. There is no fetch and no data layer.
- `Home.tsx` has `highlighted_projects` (4 items).
- `Projects.tsx` has `projects` (4 items) and `categories`.
- `ProjectDetail.tsx` has a `projectTitles` slug->title map.

The same 4 projects are duplicated across three files. Their slugs are `canvas-lite`, `raft-key-value-store`, `cuda-k-means` and `world-cup-outcome-predictor`.

## How the site behaves at runtime

- **Navigation is client-side.** In-app `<Link>` clicks never hit the network and never reload the page. The router needs a single choke point (`useLocation` in `App`) to see every route change, which makes it the natural place for page-view logging.
- **Home page uses hash anchors** (`#about`, `#work`, `#contact`). These do not change `location.pathname`, but they do change `location.hash`.
- **External outbound links** all open in a new tab with `rel="noopener noreferrer"`:
  - GitHub repos for the public projects
  - GitHub, LinkedIn and Instagram profiles
  - `mailto:` links, which open the visitor's mail client and send nothing to the site
- **Private projects** (Raft KV Store, CUDA K-Means) show a "Private repository" notice instead of a link.
- **One form collects input but never sends it.** The `/about` contact form (name, email, phone, message) is held in React state and cleared on submit. The disabled search box on `/projects` is the only other `<input>`.
- **No persisted client state.** There is no `localStorage`, cookies or context providers. State is limited to the router.
- **SPA fallback matters for deploys.** Deep links such as `/projects/canvas-lite` rely on Cloudflare Pages serving `index.html` for unknown paths. There is no `_redirects` file in the repo (Pages handles SPA fallback by default when there is no top-level 404.html).

## Contact form (`src/routes/About.tsx`)

- Controlled form: fields `name`, `email` (required), `phone`, `message` (required), held in `useState`.
- `handleSubmit` (line 35) runs only after the browser's own validation passes. It calls `event.preventDefault()`, `setSubmitted(true)`, then resets the form. **No network call, no storage.**
- Success state is **inline, not a popup**: the form is replaced by a `role="status"` "Thanks for reaching out" message with a "Send another message" button that sets `submitted` back to false.
- This is the only place the site does something an agent could meaningfully "complete", so `handleSubmit` is the natural point for a "form submitted" signal.

## Logging-relevant observations

**Candidate events (the useful signal on a static portfolio):**
- Page view / route change (`pathname`, `hash`, referrer)
- Outbound link clicks (GitHub, LinkedIn, Instagram, `mailto:`). The `href` attributes are explicit and easy to target.
- "Get in touch" CTA and hero CTA clicks
- **Form submitted** (`handleSubmit` in `About.tsx`). Decided: a global flag set to true, calling the logging code directly from `handleSubmit`. Boolean only; no field values (see spec hard rule 12.1).
- Project card clicks (`slug`) and project-detail not-found hits
- 404 hits (the `*` route)
- Runtime errors: no React error boundary exists today, so an uncaught render error blanks the whole page. An error boundary around `<App>` plus `window.onerror` and `unhandledrejection` handlers would cover this.
- Web vitals / load performance
- Failed Google Fonts load (an external dependency)

**Where to hook in:**
- `src/main.tsx`: init the logger before `createRoot`, wrap `<App>` in an error boundary, and add a route-change effect in `App`.
- Planned: `src/lab-log.ts` (does not exist yet), imported once from `main.tsx`. It reports only `data-lab` clicks, so `Home.tsx` needs no edits. Error boundary, vitals and route-change logging are out of scope in v3.

**Constraints and decisions to settle:**
- **Flag alone is not enough for the Muse study**: a flag in source records that a submit happened but not who did it. Joining it to who did it relies on the D1 row's `trusted`, `in_viewport`, User-Agent and ASN fields (plan v3).
- **No backend**: shipping logs needs an endpoint. Decided in plan v3: a Cloudflare Pages Function (`functions/api/log.ts`) writing to D1.
- **Privacy**: the site is public and personal. Decide on cookie-less or anonymous logging, consent needs, and not logging IPs or PII. The contact email is a plain `mailto:` link, so log only the click, never content.
- **Dev vs prod**: `import.meta.env.DEV` / `PROD` (Vite built-ins) can switch between console output and remote shipping. No `.env` convention exists yet. Client-exposed vars must be prefixed `VITE_`.
- **StrictMode double-invokes effects in dev**, so page-view logging in `useEffect` will fire twice locally. Dedupe or only ship in prod.
- **Bundle size**: the site is tiny, so keep any logging dependency light.
- **CI** runs only type-check plus build. There are no tests to protect logging behavior.

## Known rough edges (not logging-specific)

- `README.md` says to replace the placeholder GitHub and LinkedIn links "in `src/main.tsx`", but the real links live in `Home.tsx`.
- Project data is triplicated across three files and could move to a shared module.
- `Journal.tsx` is an empty, unrouted stub. `ProjectDetail` is a title-only stub.
- `handleSubmit` has a stray blank line and the form has no spam protection or real submission path (expected for now).
- `Home.tsx` imports `createRoot` from `react-dom/client` and `React`, neither of which it uses.
- `highlighted_projects` is the only snake_case identifier; everything else is camelCase.

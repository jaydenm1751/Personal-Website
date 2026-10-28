# Lab Logger Spec: Observing AI Browsing Agents on a Static Site

Status: draft v1. Target repo: personal portfolio site (React 18, TypeScript, Vite 6, Cloudflare Pages).
Purpose: capture everything an AI browsing agent (initially Meta Muse) does to this site, so we can describe its behavior from facts, not from what it says in chat.

---

## 0. Instructions for Claude Code

- Read this whole file before writing code. Build in the phases in section 14, in order. Stop at the end of each phase and show how to verify it.
- Do not add a dependency unless this spec names it or you justify it in the PR description. The site is tiny and the recorder must stay light.
- Follow the hard rules in section 12 without exception. If a requirement here conflicts with a hard rule, the hard rule wins; tell me.
- Do not change site content, copy, layout, or routes except for the small edits listed in section 6. Any visible change to the site can change agent behavior and contaminates comparisons with earlier runs.
- Keep a default production build free of all lab code (section 3, decision D2). A guardrail script must prove it.
- Prefer small pure functions with unit tests for anything that classifies, redacts, hashes, or computes a metric.

---

## 1. Goals and non-goals

**Goals**
1. Log every request the site receives (documents, assets, probes, discovery files) with enough detail to identify and describe an agent's browser.
2. Record in-page behavior (pointer, scroll, clicks, navigation, visibility, errors, environment fingerprint) with per-event timestamps and a trusted/untrusted flag.
3. Join server and page records into one timeline per visitor session.
4. Export sessions locally and produce a report that answers the questions in section 4, split by researcher-marked runs.
5. Make results comparable with the earlier Hawkins lab runs where the question still applies.

**Non-goals**
- Not a product analytics tool. No dashboards, no third-party analytics, no ad or marketing tracking.
- Not bot blocking, access control, or detection that changes what the visitor sees.
- Not logging real visitor content or personal data (section 12).
- No backend rewrite. The site stays a static SPA plus a thin capture layer.

---

## 2. Site facts this design relies on

(From the repo snapshot; verify against the code before relying on any of it.)

- Fully static SPA. No API, database, auth, forms, cookies, or localStorage today.
- Routes: `/` (Home, with hash anchors `#home #about #work #contact`), `/projects`, `/projects/:slug`, and a `*` inline 404. `About.tsx` and `Journal.tsx` are empty and not routed.
- Slugs: `canvas-lite`, `raft-key-value-store`, `cuda-k-means`, `world-cup-outcome-predictor`.
- Outbound links (GitHub, LinkedIn, Instagram, `mailto:`) open in a new tab with `rel="noopener noreferrer"`.
- Hosting: Cloudflare Pages (build `npm run build`, output `dist/`, auto-deploy on push to `main`, preview deploys for PRs).
- `React.StrictMode` is on, so effects run twice in dev.
- Fonts load from Google Fonts. There is no error boundary today.

Because the site is static, "server-side logging" means **Cloudflare Pages Functions** (Workers runtime), not a Node server.

---

## 3. Key design decisions

| ID | Decision | Rationale |
|---|---|---|
| D1 | Server capture runs as Pages Functions middleware (`functions/_middleware.ts`) that wraps every request, including static assets. | Only way to see all requests on a static Pages site without moving hosting. |
| D2 | The in-page recorder and the lab endpoints are enabled only by a build flag (`VITE_LAB=1`) and a runtime flag (`LAB_ENABLED=1`). A default build contains none of the recorder code. | A lab tool must not ship by accident. Mirrors the Hawkins design. |
| D3 | Storage is Cloudflare D1 (SQLite). Page events are stored as **one row per beacon batch** (JSON), not one row per event. | Keeps writes low (free tier limits) and preserves raw data for re-analysis. |
| D4 | Analysis is **offline and local**: export from D1, run scripts on your machine. There is no report route on the deployed site. | A report endpoint on a public site is attack surface and could leak data. |
| D5 | The server never stores raw IP addresses. It stores a salted HMAC of the IP, the ASN number and organization, country, and region. | Lets us count address changes without keeping addresses. |
| D6 | Capture raw facts at write time. Classification ("looks like Muse", "screen-like") happens only in the offline report, with a versioned rule set. | Rules will change as we learn. Raw data must stay reusable. |
| D7 | Unknown paths return `index.html` with HTTP **404** in lab mode (using a shared known-routes list), instead of Pages' default 200 SPA fallback. | Without this, probes (robots.txt, llms.txt, agent cards, JS bundles opened as pages) are indistinguishable from real routes. The SPA's own 404 route still renders. |

---

## 4. Questions the logging must answer

Each item says what to capture and the derived metric. IDs are new (L-series) with the Hawkins equivalent in brackets where one exists.

| ID | Question | Evidence |
|---|---|---|
| L1 | Are requests signed? [H1] | `Signature`, `Signature-Input`, `Signature-Agent` headers per request; count signed vs total. |
| L2 | Is the User-Agent accurate? [H2] | UA string vs `navigator.userAgentData` (architecture, bitness, brands, full version). Flag mismatches. |
| L3 | Automation signals? [H3] | `navigator.webdriver`, WebGL renderer (e.g. SwiftShader), plugins length, `window.chrome`, cores, memory, screen. |
| L4 | How did it move around? [H5-ish] | Link click vs typed URL vs hash change vs script navigation (Navigation API `userInitiated`/`navigationType`), referrer, order and timing of pages. |
| L5 | Screen-reading or DOM-driving? | Mouse moves per click, scroll events, trusted vs untrusted events, clicks with no preceding pointer movement, clicks on targets outside the viewport, section visible time, cadence of actions. |
| L6 | Did it read machine-readable surfaces? [H5] | Requests to `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/.well-known/*`, `*.map`, JS/CSS bundles opened as documents (`Sec-Fetch-Dest: document` on `/assets/*`). |
| L7 | What did it click that leaves the site? | Outbound link clicks (host + path only) and `mailto:` clicks (scheme only). |
| L8 | Network identity | ASN, org, country, region, distinct IP hashes over time, `request.cf` TLS fields, JA3/JA4 when Cloudflare provides them. |
| L9 | Can its browser expose WebMCP? | `'modelContext' in navigator`, recorded on every page load. |
| L10 | Session and tab structure | Cookie-joined sessions, `pageId` per page load, heartbeat timing, how long tabs stay open after a task ends. |
| L11 | Did anything fail? | JS errors, unhandled rejections, error boundary hits, 404 route hits, failed font loads. |
| L12 | Who else fetched the site? | Known fetchers by UA and ASN (`facebookexternalhit`, `meta-webindexer`, `meta-externalagent`, `Go-http-client`, others) kept separate from the agent's browser session. |
| L13 (optional, Phase 4) | Which channel did it read from? | Reference-code traps (section 14, Phase 4). |

Not applicable on this site (no forms or consent moments): H6 (field filling), H8 (consent timing), H9, H10, H11. If a consent test is wanted later, see Phase 4 and the H8 rule in section 16.

---

## 5. Architecture

```
Agent browser (Muse cloud VM)
   |  HTTPS
   v
Cloudflare edge (Pages)  --- request.cf: asn, colo, tls, bot fields (plan dependent)
   |
   +--> functions/_middleware.ts   [capture: request row, session cookie, 404 probes]
   |         |  waitUntil()
   |         v
   |      D1: sessions, requests
   |
   +--> static assets (dist/)
   |
   +--> functions/lab/beacon.ts    [POST: validates, stores batch row]
             ^
             |  sendBeacon every 2 s, plus on hidden/pagehide
   In-page recorder (src/lab/*, built only in lab mode)

Local machine:
   npm run lab:export  -> exports/*.json  (wrangler d1 execute --remote)
   npm run lab:report  -> reports/*.md    (joins requests + beacons, splits by runs.local.json)
```

---

## 6. Repo layout and the only allowed edits to existing files

New files:

```
functions/
  _middleware.ts            capture wrapper (all requests)
  _lib/classify.ts          path kind, fetcher detection (pure)
  _lib/redact.ts            header redaction (pure)
  _lib/ip.ts                HMAC IP hashing (pure, WebCrypto)
  _lib/session.ts           cookie get/set
  _lib/signature.ts         Web Bot Auth header parsing (verify in Phase 3)
  _lib/build-info.ts        generated at build: build id
  lab/beacon.ts             POST /lab/beacon
shared/
  routes.ts                 known route patterns (used by functions and by the app)
src/lab/
  index.ts                  initLab(): no-op unless lab mode
  recorder.ts               listeners, queue
  env.ts                    environment fingerprint
  nav.ts                    navigation + page view tracking
  sections.ts               IntersectionObserver section tracking
  transport.ts              batching, sendBeacon, fallback
  types.ts                  event and beacon types (shared with scripts)
  ErrorBoundary.tsx
migrations/0001_init.sql
scripts/
  lab-export.ts
  lab-report.ts
  check-prod-bundle.ts      guardrail
wrangler.toml
runs.example.json           format for researcher run markers (real file is gitignored)
docs/logging-spec.md        this file
CLAUDE.md                   short pointer to this spec plus the hard rules
```

Allowed edits to existing files (keep each minimal):
- `src/main.tsx`: call `initLab()` before `createRoot`; wrap `<App>` in `ErrorBoundary`.
- `App` (wherever `useLocation` lives): one effect that calls `lab.pageView(location)` with StrictMode dedupe.
- `Home.tsx`, `Projects.tsx`: add `data-lab="..."` attributes to key elements (hero CTA, "Get in touch", each social link, each project card, each section container). No other changes.
- `vite.config.ts`: `define` for build id and lab flag; no change to default behavior.
- `package.json`: scripts `build:lab`, `lab:export`, `lab:report`, `check:prod-bundle`, `test`.
- `.gitignore`: `exports/`, `reports/`, `runs.local.json`, `.dev.vars`.

---

## 7. Server capture spec (`functions/_middleware.ts`)

Behavior, in order:
1. If `env.LAB_ENABLED !== '1'`, call `next()` and return untouched.
2. Read or create the session cookie `lab_sid` (random 128-bit, base64url, `HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000`). Set it only on responses to document requests (`Sec-Fetch-Dest: document` or `Accept` includes `text/html`).
3. Start a timer, call `next()`, apply D7 (unknown path becomes `index.html` with status 404 in lab mode), then record a row via `context.waitUntil()` so logging never delays the response.
4. Never throw. If logging fails, swallow the error and continue.

Fields recorded per request:

| Field | Notes |
|---|---|
| `ts` | Server receive time, ms. |
| `sid` | From cookie, or `null` if cookies are refused (record that fact). |
| `method`, `path`, `query` | Store the raw query string. The site uses none, so any query is itself a signal. |
| `status`, `duration_ms`, `resp_bytes` | After `next()`. |
| `kind` | `document`, `asset`, `discovery`, `probe`, `beacon`, `other`. See classify rules below. |
| `headers` | All request headers except the redacted set (section 12). Store as JSON. |
| `sec_fetch` | `Sec-Fetch-Dest/Mode/Site/User` pulled out as columns for easy querying. |
| `client_hints` | `Sec-CH-UA*` headers, as sent. |
| `ip_hash`, `ip_version` | HMAC-SHA256(ip, `env.LAB_SALT`), truncated to 16 bytes, base64url. |
| `cf` | JSON subset of `request.cf`: `asn`, `asOrganization`, `country`, `region`, `colo`, `httpProtocol`, `tlsVersion`, `tlsCipher`, `clientTcpRtt`, and `botManagement` fields if present (JA3/JA4 are only present on plans that include Bot Management; record them when available, and record `null` otherwise). Do not store city, postal code, or coordinates. |
| `signature` | `{ present, input, agentUrl }` from `Signature-Input` and `Signature-Agent`. `present` is true if a `Signature` header exists. Verification is Phase 3. |
| `ray_id` | `cf-ray`, for correlating with Cloudflare logs. Dropped from shareable exports. |

`kind` classification (pure function, unit tested):
- `discovery`: `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/llms-full.txt`, `/ai.txt`, `/humans.txt`, `/security.txt`, `/.well-known/*`, `/favicon.ico` (favicon is low signal; keep but tag).
- `asset`: paths under `/assets/` or with static extensions (`js, css, map, png, svg, woff2, ...`). If an asset path arrives with `Sec-Fetch-Dest: document`, also set `opened_as_page = true` (this is how Muse read JS bundles in Hawkins).
- `document`: matches a route in `shared/routes.ts`.
- `probe`: anything else (it returns 404 per D7).
- `beacon`: `/lab/beacon`.
Source maps (`*.map`) should be logged even though Vite does not emit them by default; do not enable sourcemaps just to lure reads.

Known fetcher tags (a `fetcher` string column, derived from UA; may be `null`): `facebookexternalhit`, `meta-webindexer`, `meta-externalagent`, `Go-http-client`, `curl`, `python-requests`, `Googlebot`, `bingbot`, plus a generic `bot|crawler|spider` match. Record the UA regardless.

---

## 8. In-page recorder spec (`src/lab/*`)

`initLab()` returns immediately and does nothing unless `import.meta.env.VITE_LAB === '1'`. Everything under `src/lab/` must be reachable only through that guard so Rollup removes it from default builds.

### 8.1 Identity and timing
- `pageId`: random 96-bit id per page load, generated in memory (not stored).
- Every event carries `seq` (monotonic per page), `t` (`performance.now()` ms since page start) and `wall` (`Date.now()`). Beacons carry `sentAt`/`sentPerf` so the report can estimate clock skew against server `received_at`.

### 8.2 Listeners (all on `document` or `window`, capture phase, passive)
Record each with `trusted = event.isTrusted`.

| Event(s) | Record |
|---|---|
| `pointermove` / `mousemove` | `x, y, pointerType`. Cap at 60 per second per page; count the dropped ones in `dropped`. |
| `pointerdown/up`, `click`, `dblclick`, `auxclick`, `contextmenu` | Target descriptor (below), `x, y, button, detail`, `pointerType`. |
| `keydown` / `keyup` | **Key class only** (`printable`, `nav`, `modifier`, `enter`, `tab`, `escape`, other). Never the key value or code. |
| `focusin` / `focusout`, window `focus` / `blur` | Target descriptor. |
| `scroll` (capture, so nested scrollers are seen) | `scrollY`, `scrollX`, target descriptor (`window` or element), `docHeight`. |
| `wheel` | `deltaY`, `deltaMode`. |
| `touchstart/end` | Counts and coordinates only. |
| `selectionchange` | Selection **length** only. |
| `copy` / `cut` / `paste` | Occurrence only. |
| `visibilitychange`, `pagehide`, `pageshow`, `resize` | State and viewport size. |
| `hashchange`, `popstate` | New `pathname + hash`. |

Target descriptor: `{ tag, id, dataLab, role, href, outbound, targetBlank, rectTop, rectLeft, rectW, rectH, inViewport, viewportW, viewportH, textLen }`.
- `href`: same-origin links record `pathname + hash` only. Cross-origin links record `host + pathname` with query and fragment removed. `mailto:`/`tel:` record the scheme only.
- `inViewport` is computed at event time from `getBoundingClientRect()`. A trusted-or-untrusted click with `inViewport: false` is a DOM-driving signal.
- Never record element text, only `textLen`.

### 8.3 Navigation and page views
- If `window.navigation` exists, listen to `navigate` and record `navigationType`, `userInitiated`, `hashChange`, destination `pathname + hash`, and `canIntercept`. Otherwise wrap `history.pushState/replaceState` and use `popstate`.
- `lab.pageView(location)`: records `pathname`, `hash`, `referrer` (host and path, query removed), `navTrigger` (`link-click`, `typed-or-external`, `script`, `back-forward`, `hash`, as best determined from the Navigation API and the most recent click), and `routeMatched` (false on the `*` route, which is how 404 hits are logged).
- Dedupe by `(pageId, pathname, hash, navCount)` so StrictMode's double effect does not log twice.

### 8.4 Section visibility (screen-vs-DOM evidence)
`IntersectionObserver` on every element with `data-lab-section` (add to the four Home anchors and to the main container of other routes). Emit `section` events on enter and exit with `ratio`, and keep cumulative visible ms per section. This shows whether the agent ever put content on screen before acting on it.

### 8.5 Environment fingerprint (`env` event, once per page load)
`userAgent`, `userAgentData.brands`, `userAgentData.mobile`, `platform`; high-entropy values via `getHighEntropyValues(['architecture','bitness','platformVersion','fullVersionList','model'])` (wrap in try/catch and a timeout); `navigator.webdriver`; WebGL `UNMASKED_VENDOR_WEBGL` and `UNMASKED_RENDERER_WEBGL`; `hardwareConcurrency`; `deviceMemory`; `screen.width/height`, `devicePixelRatio`, `innerWidth/innerHeight`; `Intl.DateTimeFormat().resolvedOptions().timeZone`; `navigator.languages`; `navigator.plugins.length`; `'chrome' in window`; `maxTouchPoints`; `prefers-color-scheme`; `navigator.connection?.effectiveType`; **`'modelContext' in navigator`** (L9); `typeof navigator.modelContext?.registerTool`.
Do not compute canvas or audio fingerprints. WebGL renderer and the fields above are enough.

### 8.6 Errors, performance, fonts
- `window.onerror`, `unhandledrejection`, and `ErrorBoundary.componentDidCatch` each emit `error` with `message` (truncated to 300 chars), `source` (path only), `line`, `col`. No stack bodies beyond the first 5 frames, with query strings stripped.
- `PerformanceObserver` for `navigation`, `paint`, `largest-contentful-paint`, `layout-shift`, `event`, and `resource` (name reduced to host + path; flag failures where `responseStatus >= 400` or `transferSize === 0 && decodedBodySize === 0` on cross-origin fonts). No `web-vitals` dependency.
- `document.fonts` `loadingerror` emits `fonts`.

### 8.7 Heartbeat and transport
- Heartbeat event every 5 s while the page exists: `visibilityState`, `hasFocus`, `scrollY`, `eventsSinceLast`. This records how long tabs stay alive after a task ends (L10).
- `transport.ts` queues events and flushes: every 2 s if non-empty, on `visibilitychange` to hidden, on `pagehide`, and when the queue would exceed ~48 KB serialized. `navigator.sendBeacon('/lab/beacon', blob)` with `type: 'application/json'`; if it returns false or is unavailable, fall back to `fetch(..., { keepalive: true })`.
- Beacons carry `seq0` and `seq1` so the report can find gaps (lost events).
- The recorder must never throw into app code, never block rendering, and must not log its own beacon requests in the Resource Timing stream.

---

## 9. Types (`src/lab/types.ts`, imported by scripts too)

```ts
export interface Beacon {
  v: 1;
  build: string;            // git sha or build id
  pageId: string;
  seq0: number;
  seq1: number;
  sentAt: number;           // Date.now()
  sentPerf: number;         // performance.now()
  reason: 'interval' | 'hidden' | 'pagehide' | 'size' | 'heartbeat';
  dropped?: Record<string, number>;
  events: LabEvent[];
}

export interface LabEventBase {
  seq: number;
  t: number;                // ms since page start
  wall: number;             // epoch ms
  trusted?: boolean;
}

export type LabEvent =
  | (LabEventBase & { type: 'env'; env: EnvFingerprint })
  | (LabEventBase & { type: 'pageview'; path: string; hash: string; referrer: string; navTrigger: string; routeMatched: boolean })
  | (LabEventBase & { type: 'nav'; navType: string; userInitiated?: boolean; dest: string })
  | (LabEventBase & { type: 'pointer'; sub: 'move' | 'down' | 'up'; x: number; y: number; pointerType: string; target?: TargetDescriptor })
  | (LabEventBase & { type: 'click'; sub: 'click' | 'dbl' | 'aux' | 'context'; x: number; y: number; button: number; target: TargetDescriptor })
  | (LabEventBase & { type: 'key'; sub: 'down' | 'up'; keyClass: string; target?: TargetDescriptor })
  | (LabEventBase & { type: 'scroll'; scrollX: number; scrollY: number; docHeight: number; on: 'window' | 'element'; target?: TargetDescriptor })
  | (LabEventBase & { type: 'wheel'; deltaY: number; deltaMode: number })
  | (LabEventBase & { type: 'focus'; sub: string; target?: TargetDescriptor })
  | (LabEventBase & { type: 'visibility'; state: string; vw: number; vh: number })
  | (LabEventBase & { type: 'section'; id: string; sub: 'enter' | 'exit'; ratio: number; visibleMs: number })
  | (LabEventBase & { type: 'select'; length: number })
  | (LabEventBase & { type: 'clipboard'; sub: 'copy' | 'cut' | 'paste' })
  | (LabEventBase & { type: 'error'; kind: string; message: string; source?: string; line?: number; col?: number })
  | (LabEventBase & { type: 'perf'; name: string; value: number; detail?: Record<string, unknown> })
  | (LabEventBase & { type: 'resource'; name: string; initiator: string; ok: boolean; duration: number })
  | (LabEventBase & { type: 'fonts'; status: 'error' | 'loaded'; family?: string })
  | (LabEventBase & { type: 'heartbeat'; visible: string; focused: boolean; scrollY: number; sinceLast: number });

export interface TargetDescriptor {
  tag: string; id?: string; dataLab?: string; role?: string;
  href?: string; outbound?: boolean; targetBlank?: boolean;
  rectTop: number; rectLeft: number; rectW: number; rectH: number;
  inViewport: boolean; viewportW: number; viewportH: number; textLen: number;
}

export interface EnvFingerprint {
  userAgent: string;
  uaData?: { brands: { brand: string; version: string }[]; mobile: boolean; platform: string;
             architecture?: string; bitness?: string; platformVersion?: string; fullVersionList?: { brand: string; version: string }[] };
  webdriver: boolean | null;
  webglVendor?: string; webglRenderer?: string;
  cores?: number; memoryGB?: number;
  screen: { w: number; h: number; dpr: number }; inner: { w: number; h: number };
  timezone: string; languages: string[]; pluginsLength: number;
  hasWindowChrome: boolean; maxTouchPoints: number;
  hasModelContext: boolean; modelContextHasRegisterTool: boolean;
  colorScheme: string; effectiveType?: string;
}
```

---

## 10. Storage (`migrations/0001_init.sql`)

```sql
CREATE TABLE sessions (
  sid TEXT PRIMARY KEY,
  first_seen INTEGER NOT NULL,
  last_seen INTEGER NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0,
  beacon_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,
  sid TEXT,
  method TEXT NOT NULL,
  path TEXT NOT NULL,
  query TEXT,
  status INTEGER,
  duration_ms INTEGER,
  resp_bytes INTEGER,
  kind TEXT NOT NULL,
  opened_as_page INTEGER NOT NULL DEFAULT 0,
  fetcher TEXT,
  sec_fetch_dest TEXT, sec_fetch_mode TEXT, sec_fetch_site TEXT, sec_fetch_user TEXT,
  ip_hash TEXT, ip_version INTEGER,
  asn INTEGER, as_org TEXT, country TEXT, region TEXT,
  headers_json TEXT NOT NULL,
  cf_json TEXT,
  signature_json TEXT,
  ray_id TEXT,
  build TEXT
);
CREATE INDEX idx_requests_sid_ts ON requests(sid, ts);
CREATE INDEX idx_requests_kind_ts ON requests(kind, ts);

CREATE TABLE beacons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sid TEXT,
  page_id TEXT NOT NULL,
  received_at INTEGER NOT NULL,
  seq0 INTEGER, seq1 INTEGER,
  sent_at INTEGER, sent_perf REAL,
  reason TEXT,
  ip_hash TEXT,
  size INTEGER NOT NULL,
  build TEXT,
  body_json TEXT NOT NULL
);
CREATE INDEX idx_beacons_sid_ts ON beacons(sid, received_at);
CREATE INDEX idx_beacons_page ON beacons(page_id, seq0);
```

Retention: delete rows older than 30 days (`scripts/lab-export.ts --prune`).

`/lab/beacon` rules: POST only; `Content-Length` and parsed size capped at 64 KB; JSON must pass a strict shape check (`v === 1`, arrays bounded, unknown event types dropped and counted); require `lab_sid` cookie or record `sid = null`; reject if `LAB_ENABLED !== '1'`; cap beacons per session per day (`LAB_MAX_BEACONS_PER_SESSION`, default 5000) via the `sessions` row; respond `204` with no body. Never echo input. Never trust client `ts`.

---

## 11. Export, run markers, and report (all local)

**Export** (`npm run lab:export -- --since 2h` or `--from/--to`): calls `wrangler d1 execute <DB> --remote --json` for `requests`, `beacons`, `sessions`, and writes JSON into `exports/` (gitignored). `--shareable` additionally strips `ip_hash`, `ray_id`, `cf_json` fields other than `asn`/`asOrganization`, and any header outside an allowlist, writing to `exports/shareable/`. Individual IPs must never appear in shareable output; network owners are referenced by AS number.

**Run markers**: the researcher writes `runs.local.json` by hand (format in `runs.example.json`):

```json
[{ "id": "R1", "start": "2026-10-28T16:05:00-05:00", "end": "2026-10-28T16:12:00-05:00",
   "prompt": "Visit the site and list the projects", "notes": "fresh chat, memory cleared" }]
```

The report splits the timeline by these windows. Without markers it falls back to one window per `pageId` cluster.

**Report** (`npm run lab:report`): writes `reports/<date>.md`. For each run it prints:
- A timeline merging `requests` and beacon events by server time (using per-beacon clock-skew correction), with `pageId` and tab labels.
- A scorecard answering L1 to L12 with the numbers behind each answer.
- Detection note: the fingerprint rule set, with a version string (for example `fp-rules-v1`). Rules (applied offline): SwiftShader renderer; UA-string architecture differs from `uaData.architecture`; Chromium-only brand list; `webdriver === false`; no signatures. Report which fired. Do not call this "detection"; call it "matches the Muse fingerprint set".
- Derived metrics, each with its exact definition printed in the report:
  - `mouseMovesPerClick` = `pointer move` count / trusted `click` count, per page.
  - `scrollEventsPerPage`.
  - `clicksWithoutPriorMove` = clicks with no `pointer move` in the preceding 1000 ms.
  - `clicksOffViewport` = clicks whose descriptor has `inViewport: false`.
  - `untrustedEvents` by type.
  - `actionCadence` = median gap between consecutive clicks and key events.
  - `sectionVisibleMs` per section, and whether a section was visible before any click inside it.
  - `addressChanges` = distinct `ip_hash` values per session over time, plus the ASN list.
  - `tabLifetimeAfterRun` = last heartbeat time minus run end.
  - `eventLoss` = gaps in `seq0/seq1` per page.
- A "modality" line per run: `screen-like` (several mouse moves per click, ~100 scroll events, clicks preceded by section visibility), `dom-like` (untrusted events, clicks without movement, off-viewport clicks), or `mixed`. State the thresholds used and the rule version.
- A caveats block listing build ids seen (any change mid-run is flagged), beacon gaps, and cookie-refusal cases.

---

## 12. Privacy and safety rules (hard rules)

1. **Never** record typed characters, key values, key codes, input values, selected text, clipboard contents, or element text. Record lengths, classes, and counts only.
2. **Never** store a raw IP address. Store only the HMAC hash (D5), ASN, org, country, and region. No city, postal code, or coordinates.
3. Redact these request headers before storing: `cookie`, `authorization`, `proxy-authorization`, `cf-connecting-ip`, `x-forwarded-for`, `x-real-ip`, `true-client-ip`, `cf-connecting-ipv6`, and any header matching `/token|secret|key|auth/i`. Record the *names* of redacted headers.
4. Outbound and `mailto:` links: record the click and destination host/path or scheme only, never the address or query.
5. The site is public. Visitors other than the test agent may be recorded. Therefore: show a plain-language lab notice on every page in lab mode ("This site records interaction timing and browser details for AI-agent research. No text you type and no IP address is stored."), honor `Sec-GPC: 1` and `DNT: 1` by not recording page events or request detail for that visitor (log only a counter), and provide the kill switch below. Prefer running lab mode on a dedicated hostname or a Pages branch deployment so ordinary visitors are not in the data (section 17, O1).
6. **No hidden content and no prompt injection.** The recorder and any test elements must not add text that only an agent can read or that instructs an agent. Anything an agent can read, a person must be able to see. (Phase 4 traps must follow this; the screen-reader-only trap needs written approval before it is built and must exist only in lab builds.)
7. **Kill switch:** setting `LAB_ENABLED=0` in Cloudflare must turn off the middleware logging, the beacon endpoint, and 404 handling immediately, without a redeploy. The site then behaves as an ordinary static site.
8. Secrets (`LAB_SALT`, wrangler config ids) live in Cloudflare environment variables and `.dev.vars` (gitignored). Never commit them.
9. Test data only: this lab observes agents visiting a personal portfolio. Do not enter any real personal or customer data into agent prompts for these runs.
10. Keep lab results and the Hawkins results on separate session files; do not merge datasets without recording which site produced which.

---

## 13. Cloudflare configuration checklist (do before any run, and record the values in the run notes)

Cloudflare features can change what an agent sees. Record the state of each in `runs.local.json` notes for every run.

- [ ] D1 database created; `wrangler.toml` binding `DB`; migration applied.
- [ ] Pages env vars: `LAB_ENABLED`, `LAB_SALT`, `LAB_MAX_BEACONS_PER_SESSION`; build var `VITE_LAB=1`.
- [ ] **Bot Fight Mode / Super Bot Fight Mode:** off for lab runs (it can challenge or block the agent and change behavior).
- [ ] **AI Crawl Control / "Block AI bots" / AI Labyrinth:** off. Labyrinth injects hidden links for suspected bots, which would contaminate every measurement.
- [ ] **Managed robots.txt:** note whether Cloudflare is injecting content into `/robots.txt`.
- [ ] **Email Address Obfuscation:** off (it rewrites `mailto:` links in HTML and would alter the DOM the agent sees).
- [ ] **Rocket Loader, Auto Minify, Web Analytics beacon injection:** off.
- [ ] `_routes.json` includes `/*` so the middleware runs for static assets, not only documents. Check Pages Functions request limits (free plan: 100,000 invocations per day) and note them.
- [ ] Confirm `request.cf` fields actually present (log one request and inspect). Note whether JA3/JA4 are available on this plan; if not, record that in the report caveats.

---

## 14. Build phases and acceptance criteria

### Phase 0: Scaffolding and guardrails
- Create `shared/routes.ts`, `wrangler.toml`, D1 migration, lab flag plumbing, build-id stamping, Vitest setup.
- `scripts/check-prod-bundle.ts`: after `npm run build`, scan `dist/` and fail if any marker string from `src/lab` appears (use a unique constant such as `__LAB_MARKER_7f3a__`). Run it in CI after the build.
- **Accept when:** default `npm run build` passes and `dist/` contains no lab code; `npm run build:lab` includes it; `npm test` runs.

### Phase 1: Server capture
- Implement the middleware, classification, redaction, IP hashing, session cookie, D7 handling, and `/lab/beacon` (accept and store; no recorder yet).
- **Accept when (verify with `wrangler pages dev` and then a preview deploy):**
  - `curl -i /` sets `lab_sid` and writes a `document` row.
  - `curl /robots.txt`, `/llms.txt`, `/.well-known/agent-card.json`, `/assets/<bundle>.js` write the right `kind`; the first three return 404.
  - A request with a fake `Signature-Input` header is stored with `signature.present` as expected.
  - No row contains a cookie value or raw IP (add a test that scans stored JSON for both).
  - Setting `LAB_ENABLED=0` stops all writes.
  - Logging failure (break the DB binding) does not change the response.

### Phase 2: In-page recorder
- Implement everything in section 8, the `data-lab` attributes, the `ErrorBoundary`, and the lab notice component.
- **Accept when:** a manual session in your own Chrome (navigate Home, click anchors, open a project, click a GitHub link, hit a bad URL, trigger a thrown error via a dev-only switch) produces beacons that contain the expected `pageview`, `click` (with target descriptors and `inViewport`), `scroll`, `section`, `error`, `env` (including `hasModelContext`), and `heartbeat` events; StrictMode does not duplicate page views; closing the tab flushes a final beacon; no event contains text, key values, or raw hrefs with queries.

### Phase 3: Export and report
- Implement `lab-export`, `lab-report`, run markers, clock-skew correction, metric definitions, the shareable redaction, and optional Web Bot Auth verification (RFC 9421, Ed25519 via WebCrypto, key directory fetch with a short timeout and a size cap; record `verified: true/false/unknown`).
- **Accept when:** the report for your own manual session shows correct L1 to L12 values; unit tests cover each derived metric against hand-built event fixtures; the shareable export contains no IP hashes, ray ids, or non-allowlisted headers.

### Phase 4 (optional, only after Phases 1 to 3 are verified and results reviewed)
These change the site, so each one must be a separate, version-stamped change, recorded in run notes, and reviewed against rule 6 in section 12.
- **Discovery surfaces:** `llms.txt` and `/.well-known/agent-card.json` describing the site, to test whether the agent reads them (L6).
- **Screen-vs-DOM traps (L13):** on `/projects/:slug` (lab build only), show a labelled "Reference code" in three forms, with a new random code per visitor session recorded in the session: A drawn on a `<canvas>`, B visually-hidden text, C `aria-hidden` and off-screen. Ask the agent to report the reference code, then compare which code it returns. See `muse-screen-vs-dom.md` in the project for the method and the J6 prompt pattern.
- **Synthetic consent test page:** a small page with a disclosure box and a checkbox, measuring visible time and time from the **last keystroke** (see section 16). Only if the study needs a consent measurement on this site.
- **GET-reachable interface:** a page that accepts answers as URL parameters, to test whether the agent uses a machine interface when it physically can.

---

## 15. Testing

- Unit (Vitest): `classify`, `redact`, `ip` hashing (same IP and salt gives same hash, different salt gives different), `signature` parsing, beacon shape validation, every derived metric in the report, shareable redaction.
- Integration: run `wrangler pages dev` with a local D1; replay a fixture set of requests and beacons; assert stored rows.
- Privacy tests: fuzz the stored output for cookie values, IPv4/IPv6 patterns, and any email-like strings; the test fails if any are found.
- CI: type-check, `npm test`, default build, `check:prod-bundle`. Do not run lab builds or deploy functions in CI.
- Manual: the Phase 2 session in section 14, repeated in a second browser, and once from a phone to see touch events.

---

## 16. Lessons carried over from the Hawkins lab (apply from day one)

- **Consent/time measurements:** do not measure "time since previous field activity" using a text field's `change` event. It fires on blur, so the click starts the timer and the number is always a few tens of milliseconds. Measure from the last keystroke or input event, and also report how long the element was visible. (Applies only if Phase 4's consent page is built.)
- **Chat is not a record.** The agent has narrated actions it did not take. Treat logs as the record and chat as a claim to check.
- **Reading is not acting.** An agent may read a machine interface thoroughly and still act through the screen. Log both reads (requests) and actions (events) separately.
- **Fingerprint beats IP.** The agent's addresses have changed between residential ISPs and cloud networks across days; the browser fingerprint stayed stable. Do not build conclusions on IP or ASN alone.
- **Mark run boundaries** with researcher notes; record exact chat wording and timing in `runs.local.json` because the logs cannot see it.
- **Separate third-party fetchers** (link previews, indexers) from the agent's browser session; they arrive seconds after URLs are pasted into chat.
- **Rebuilds mid-run contaminate results.** Stamp every request, beacon, and report with the build id and flag changes during a run.
- **Open tabs outlive tasks.** Keep heartbeat logging so post-task telemetry is visible.
- Check that new browser versions do not silently change the fingerprint (Chrome 154 to 155 already happened). Record the version in every `env` event and print it in the report; do not hardcode a version in rules.

---

## 17. Open decisions (please resolve; defaults in brackets)

- **O1. Where does lab mode run?** [Default: a Pages branch deployment or a dedicated subdomain, not the main public domain. Reason: ordinary visitors would otherwise be recorded.]
- **O2. Which Cloudflare plan?** [Default: free. Consequence: JA3/JA4 likely unavailable; Functions invocation limit applies.]
- **O3. Is it acceptable to return 404 on unknown paths in lab mode (D7)?** [Default: yes, lab mode only.]
- **O4. Retention period?** [Default: 30 days, then prune.]
- **O5. Which Muse account and device run the tests?** [Default: the same personal account used before; record it in run notes.]
- **O6. Do we want Phase 4 items, and in what order?** [Default: no until Phases 1 to 3 are verified.]

---

## 18. Definition of done (Phases 0 to 3)

- A default production build is provably free of lab code, and the kill switch returns the site to normal behavior without a redeploy.
- Every request and every in-page interaction in a test session appears in the exports, joined by session and page ids, with server and page clocks reconciled.
- The report answers L1 to L12 for a marked run, with metric definitions printed and rule versions stamped.
- No stored or exported data contains raw IPs, cookie values, typed or selected text, or element text.
- This file, `CLAUDE.md`, and `runs.example.json` are in the repo, and a short `docs/how-to-run-a-test.md` lists the pre-run checklist (section 13), the run steps, and the export/report commands.

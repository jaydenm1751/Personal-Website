# Implementation Plan: Lab Logger (Phases 0 to 3)

Source: `aakash-notes/logging-spec.md` (draft v1). Site context: `aakash-notes/site-overview.md`.
Scope: Phases 0 to 3 of the spec. Phase 4 is deferred (stub at the bottom).
Working branch: `Aakash/logging`.

## Decisions taken for this plan

| Spec ref | Decision | Status |
|---|---|---|
| O1 | Lab mode runs on a **public Pages branch deployment** (for example branch `lab`, URL `lab.<project>.pages.dev`), not on the main domain. It is publicly reachable so Muse can visit it. | Assumed from "must run on a public site". **Confirm:** if you mean the main domain `jaydengmckenna.com`, the plan still works, but hard rule 12.5 (notice, GPC/DNT, kill switch) becomes the only protection for ordinary visitors. |
| O2 | Cloudflare **free plan**. JA3/JA4 likely unavailable; 100k Functions invocations/day. | Spec default |
| O3 | Return 404 for unknown paths in lab mode only (D7). | Spec default |
| O4 | 30-day retention, pruned by `lab-export --prune`. | Spec default |
| O5 | Same personal Muse account as before; recorded in run notes. | Spec default |
| O6 | Phase 4 deferred. | Chosen |
| Access | You have Cloudflare access, so the plan includes creating D1 and setting env vars directly. | Chosen |

## Ground rules (from spec sections 0 and 12, apply to every phase)

- Stop at the end of each phase and show how to verify it.
- No new dependency unless the spec names it or the PR description justifies it. Expected dev dependencies: `vitest`, `wrangler`, `@cloudflare/workers-types`, and a TS runner for scripts (`tsx`). Each one is justified in the PR.
- A default build (no `VITE_LAB`) must contain **no** lab code. CI enforces this.
- No visible site change in non-lab builds. Visible changes are limited to the lab notice and `data-*` attributes (no visual effect).
- Never store raw IPs, cookie values, typed or selected text, element text, or clipboard contents.
- Pure functions plus unit tests for anything that classifies, redacts, hashes, or computes a metric.

## Pre-flight (before Phase 0)

1. Read the code that the spec says to "verify": `src/main.tsx`, `Home.tsx`, `Projects.tsx`, `ProjectDetail.tsx`. Notes already found:
   - `README.md` points to `src/main.tsx` for social links, but they are in `Home.tsx`. Not blocking.
   - The route list is hardcoded in `main.tsx`; `shared/routes.ts` must mirror it and be imported by both functions and the app, so they cannot drift.
2. Check the repo has no `functions/`, `wrangler.toml`, test runner, or `.env` today (true as of this snapshot).
3. Create the `lab` branch for deployment (separate from `Aakash/logging` and `main`; decide the merge strategy: **lab code merges to `main` guarded by flags**, and the `lab` branch only differs by Pages env vars, not code. This keeps one codebase).
4. Move or copy the spec to `docs/logging-spec.md` and add the short `CLAUDE.md` pointer, as listed in spec section 6.

---

## Phase 0: Scaffolding and guardrails

**Goal:** the lab flag plumbing, test setup and the prod-bundle guardrail exist, with no behavior change.

Tasks
1. `shared/routes.ts`: export known route patterns (`/`, `/projects`, `/projects/:slug`) plus a `matchRoute(path)` pure function. Add a unit test. Refactor nothing else yet; wiring `main.tsx` to it is optional and only if it is a no-op change.
2. `vite.config.ts`: add `define` for `__BUILD_ID__` (git sha, falls back to `dev`) and read `VITE_LAB`. Default behavior unchanged.
3. `src/lab/types.ts` (copied from spec section 9) and `src/lab/index.ts` with `initLab()` as a no-op guarded by `import.meta.env.VITE_LAB === '1'`. Include the unique marker constant `__LAB_MARKER_7f3a__` in a module reachable **only** through that guard.
4. `wrangler.toml` with the Pages config and `DB` D1 binding (ids come from Cloudflare env, not committed if sensitive).
5. `migrations/0001_init.sql` exactly as spec section 10.
6. Tooling: add `vitest`, `wrangler`, `@cloudflare/workers-types`, `tsx`. Scripts: `test`, `build:lab` (`VITE_LAB=1 npm run build`), `check:prod-bundle`, and placeholders for `lab:export` and `lab:report`.
7. `scripts/check-prod-bundle.ts`: scan `dist/` for the marker; exit 1 if found in a default build. Add a mode flag so the lab build can assert it **is** present.
8. `.gitignore`: `exports/`, `reports/`, `runs.local.json`, `.dev.vars`. Add `runs.example.json`.
9. `.github/workflows/ci.yml`: after the build step add `npm test` and `npm run check:prod-bundle`. Do not run lab builds or deploy functions in CI (spec section 15).
10. Extend the `tsconfig` setup so `functions/` and `scripts/` type-check (a separate `tsconfig.functions.json` with Workers types, to avoid pulling DOM and Workers types into one config).

**Accept when**
- `npm run build` passes and `check:prod-bundle` finds no marker in `dist/`.
- `npm run build:lab` produces a `dist/` where the guardrail (in "expect present" mode) finds the marker.
- `npm test` runs and passes.
- The default site renders identically to before (smoke check by running `npm run preview`).

**Risk:** tree-shaking must really remove the lab module. If a static import path leaks it, use a dynamic `import()` behind the flag. The guardrail is what proves this.

---

## Phase 1: Server capture

**Goal:** every request, including static assets, is recorded; `/lab/beacon` accepts and stores batches.

Tasks
1. Pure libs in `functions/_lib/`, each with unit tests written first:
   - `classify.ts`: `kind` (`document`, `asset`, `discovery`, `probe`, `beacon`, `other`), `opened_as_page`, `fetcher` tag from UA.
   - `redact.ts`: header redaction (explicit list plus the `/token|secret|key|auth/i` pattern), returns kept headers and the **names** of redacted ones.
   - `ip.ts`: HMAC-SHA256 with WebCrypto, truncated to 16 bytes, base64url; also `ip_version`.
   - `session.ts`: read/create `lab_sid` (128-bit, cookie flags per spec), set only on document responses.
   - `signature.ts`: parse `Signature`, `Signature-Input`, `Signature-Agent` into `{ present, input, agentUrl }`. Verification comes in Phase 3.
   - `build-info.ts`: generated at build, holds the build id.
2. `functions/_middleware.ts` following spec section 7 in order:
   - `LAB_ENABLED !== '1'` returns `next()` untouched (kill switch).
   - Honor `Sec-GPC: 1` and `DNT: 1`: increment a counter only; store no request detail.
   - Apply D7: unknown path gets `index.html` with status 404 in lab mode.
   - Write the row in `context.waitUntil()`; wrap everything in try/catch so logging never changes the response.
   - Store `cf` subset only (no city, postal code, coordinates); `null` for missing JA3/JA4.
3. `functions/lab/beacon.ts`: POST only; 64 KB cap on `Content-Length` and parsed size; strict shape check (`v === 1`, bounded arrays, unknown event types dropped and counted); sid from cookie or `null`; per-session daily cap via the `sessions` row; `204` with no body; reject when `LAB_ENABLED !== '1'`; never trust client timestamps.
4. `_routes.json` so the middleware also covers static assets (`/*`). Note the free-plan invocation limit in the run notes.
5. Privacy test: fuzz stored JSON for cookie values and IPv4/IPv6 patterns and email-like strings; fail if found.
6. Cloudflare setup (you have access):
   - Create the D1 database, apply `0001_init.sql` locally and remotely.
   - Set Pages env vars: `LAB_ENABLED`, `LAB_SALT` (random, secret), `LAB_MAX_BEACONS_PER_SESSION`; build var `VITE_LAB=1` **only** for the lab branch deployment.
   - Walk the spec section 13 checklist (Bot Fight Mode off, AI Labyrinth/AI bot blocking off, email obfuscation off, Rocket Loader/Auto Minify/Web Analytics off, managed robots.txt state noted) and record the values.

**Accept when** (verify with `wrangler pages dev`, then on the lab preview deploy)
- `curl -i /` sets `lab_sid` and writes a `document` row.
- `/robots.txt`, `/llms.txt`, `/.well-known/agent-card.json` write `discovery`/`probe` rows and return 404; `/assets/<bundle>.js` writes `asset`.
- A request with a fake `Signature-Input` header stores `signature.present` correctly.
- No stored row contains a cookie value or a raw IP (privacy test passes).
- Setting `LAB_ENABLED=0` in Cloudflare stops all writes without a redeploy.
- Breaking the DB binding does not change responses.
- One request is logged and `request.cf` inspected to record which fields exist on the free plan.

**Risk:** D7 changes status codes, so confirm the SPA's own `*` route still renders for unknown paths (the response body is still `index.html`).

---

## Phase 2: In-page recorder

**Goal:** browser-side events are captured and shipped, only in lab builds.

Tasks (all under `src/lab/`, reachable only through `initLab()`)
1. `transport.ts`: queue, flush every 2 s if non-empty, on `visibilitychange` hidden, on `pagehide`, and at ~48 KB; `sendBeacon` with `fetch(..., { keepalive: true })` fallback; beacons carry `seq0/seq1`, `sentAt`, `sentPerf`, `reason`, `dropped`. Never throws; excludes its own requests from Resource Timing.
2. `recorder.ts`: listeners from spec 8.2 (capture phase, passive), with the 60 moves/sec/page cap and `dropped` counts. Key events record **key class only**. Selection records length only.
3. Target descriptor builder (pure, unit tested): same-origin `pathname+hash`; cross-origin `host+pathname` with query/fragment stripped; `mailto:`/`tel:` scheme only; `inViewport` computed at event time; `textLen` only.
4. `nav.ts`: Navigation API listener with `pushState`/`popstate` fallback; `pageView(location)` with `navTrigger` and `routeMatched`; dedupe on `(pageId, pathname, hash, navCount)` for StrictMode.
5. `sections.ts`: `IntersectionObserver` on `[data-lab-section]` with enter/exit and cumulative visible ms.
6. `env.ts`: fingerprint per spec 8.5, high-entropy values under try/catch with a timeout; `hasModelContext` and `modelContextHasRegisterTool`; no canvas or audio fingerprinting.
7. Errors, performance, fonts (8.6): `onerror`, `unhandledrejection`, `PerformanceObserver` types listed, `document.fonts` `loadingerror`. No `web-vitals` dependency.
8. Heartbeat every 5 s (8.7).
9. `ErrorBoundary.tsx` and the lab notice component with the exact notice text from hard rule 12.5, shown on every page **in lab builds only**.
10. Allowed edits to existing files (keep each minimal):
    - `src/main.tsx`: `initLab()` before `createRoot`; wrap `<App>` in `ErrorBoundary`.
    - `App`: one effect calling `lab.pageView(location)`.
    - `Home.tsx`, `Projects.tsx`: `data-lab` and `data-lab-section` attributes only.
    - Confirm the `ErrorBoundary` wrapper and attributes cause no visible or layout change in a default build.
11. Dev-only switch to throw a test error, for the manual acceptance session. It must not exist in default builds (covered by the guardrail).

**Accept when**
- A manual session in Chrome (Home, anchors, a project, a GitHub link, a bad URL, the thrown error) produces beacons containing `pageview`, `click` (with descriptors and `inViewport`), `scroll`, `section`, `error`, `env` (including `hasModelContext`), and `heartbeat`.
- StrictMode does not duplicate page views.
- Closing the tab flushes a final beacon.
- No event contains text, key values, or hrefs with queries (add an automated scan of captured beacons).
- `check:prod-bundle` still passes on the default build.
- Repeat in a second browser and once from a phone (touch events).

**Risks**
- `sendBeacon` on `pagehide` can be dropped; the `seq0/seq1` gap metric exists to measure that.
- The recorder must not alter timing or layout enough to change agent behavior; keep listeners passive and work off the main interaction path.

---

## Phase 3: Export and report

**Goal:** local export plus a report that answers L1 to L12 for marked runs.

Tasks
1. `scripts/lab-export.ts`: `wrangler d1 execute <DB> --remote --json` for `requests`, `beacons`, `sessions` into `exports/`; flags `--since`, `--from/--to`, `--prune` (30-day retention), `--shareable` (strips `ip_hash`, `ray_id`, `cf_json` except `asn`/`asOrganization`, and non-allowlisted headers into `exports/shareable/`).
2. `scripts/lab-report.ts` writing `reports/<date>.md`:
   - Load `runs.local.json`; split by run windows; fall back to one window per `pageId` cluster.
   - Merge requests and beacon events into one timeline using per-beacon clock-skew correction (`sentAt/sentPerf` vs server `received_at`).
   - Scorecard for L1 to L12 with the numbers behind each answer.
   - Metrics with exact definitions printed: `mouseMovesPerClick`, `scrollEventsPerPage`, `clicksWithoutPriorMove` (1000 ms window), `clicksOffViewport`, `untrustedEvents` by type, `actionCadence`, `sectionVisibleMs`, `addressChanges`, `tabLifetimeAfterRun`, `eventLoss`.
   - Fingerprint rule set with a version string (`fp-rules-v1`), worded as "matches the Muse fingerprint set", not "detection".
   - Modality line (`screen-like` / `dom-like` / `mixed`) with thresholds and rule version printed.
   - Caveats block: build ids seen (flag changes mid-run), beacon gaps, cookie-refusal cases, plan-dependent fields missing (JA3/JA4).
3. Optional Web Bot Auth verification (RFC 9421, Ed25519 via WebCrypto): key directory fetch with a short timeout and a size cap; record `verified: true | false | unknown`.
4. Unit tests: each derived metric against hand-built event fixtures; shareable redaction; skew correction.
5. `docs/how-to-run-a-test.md`: pre-run checklist (spec 13), run steps, export and report commands.

**Accept when**
- The report for your own manual session shows correct L1 to L12 values.
- All metric tests pass; the shareable export contains no IP hashes, ray ids, or non-allowlisted headers.
- Definition of done (spec section 18) is met: default build provably lab-free; kill switch works without a redeploy; server and page records join by session and page id; no raw IPs, cookie values, typed text, or element text anywhere in stored or exported data; `CLAUDE.md`, `runs.example.json`, and `docs/how-to-run-a-test.md` exist.

---

## First live run (after Phase 3)

1. Confirm the lab deployment's Cloudflare settings against spec section 13 and write them in the run notes.
2. Hand-write the run entry in `runs.local.json` (exact prompt, time window, Cloudflare toggle state, Muse account/device).
3. Do not rebuild or redeploy during the run (build id changes contaminate results).
4. Export, report, and cross-check chat claims against the logs.

## Phase 4 (deferred, not planned in detail)

Discovery surfaces (`llms.txt`, agent card), screen-vs-DOM traps, a synthetic consent page, and a GET-reachable interface. Revisit only after Phases 1 to 3 are verified. Each is a separate version-stamped site change and needs a review against hard rule 12.6 (no hidden content or prompt injection; the screen-reader-only trap requires written approval).

## Open items to confirm

1. **Lab host:** branch deployment on `*.pages.dev` (assumed above) versus the main domain.
2. **Cloudflare plan:** confirm free, since JA3/JA4 and the invocation limit depend on it.
3. **Jayden's sign-off:** the spec's hard rule 12.5 says other visitors may be recorded. Because the repo and likely the domain belong to Jayden, confirm they agree to lab mode on any public deployment.
4. **Merge strategy:** lab code lands on `main` behind flags (assumed) versus living only on a long-lived `lab` branch.

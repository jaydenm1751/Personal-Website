# Implementation Plan v3: Pages Function + D1 logger (all on Cloudflare)

Replaces v2 (Node server + Cloudflare Tunnel) and the original heavy design (the old `lab/` folder, now deleted). `logging-spec.md` is **superseded for implementation**; only its privacy rules (section 12) still apply, with the honeypot exception below.

Branch: `Aakash/logging`. Status: **plan only, nothing built yet.**

## Goal

Find out how Meta Muse interacts with **the real site, jaydengmckenna.com**, by recording a small set of button clicks in a **D1 database** through a **Pages Function on the same domain**. For now that means:
1. the About form's **Submit** button,
2. a hidden **"No phone" honeypot button** that a human cannot see (so a click is strong evidence of an agent reading the DOM),
3. the "Send another message" button.

Not goals: analytics, per-visitor tracking, scroll/pointer streams, dashboards, request logs for ordinary visitors.

## Decisions

| Topic | Decision |
|---|---|
| Where logs go | A **D1 table** (`events`), written by a **Pages Function** at `/api/log`. No tunnel, no Node server, no separate subdomain, nothing that depends on your machine being on. |
| Hosting | Same Cloudflare Pages project as the site. `functions/` at the repo root deploys with every push to `main`. |
| Production | The snippet ships **inside the real site**. It is inert unless the URL carries `?lab=<run-id>`. |
| Gating | `?lab=R1` on the first URL -> run id stored in `sessionStorage` for the tab, so it survives in-app navigation (react-router drops query strings). Ordinary visitors send nothing. |
| What is captured | Clicks on elements with a `data-lab` attribute, plus one `start` event per run. Nothing else. |
| Honeypot | A "No phone" button next to the phone field, hidden for humans. **Explicit exception to spec hard rule 12.6** (no hidden agent-only content). Mitigations below. |
| Reading results | `wrangler d1 execute` against the remote database. No dashboard. |

## Architecture

```
Muse's browser --> https://jaydengmckenna.com/?lab=R1        (Cloudflare Pages)
   |  src/lab-log.ts: sees ?lab=R1, remembers it, reports only data-lab clicks
   |  navigator.sendBeacon("/api/log")                       (same origin, no CORS)
   v
functions/api/log.ts  (Pages Function)  -->  D1 database, table `events`
```

The site itself stays static. The function only receives events and inserts rows.

## Data model (`migrations/0001_events.sql`)

```sql
CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  t INTEGER NOT NULL,          -- server receive time, ms since epoch (clients are not trusted)
  run TEXT NOT NULL,           -- run id from ?lab=
  event TEXT NOT NULL,         -- 'start' | 'click'
  label TEXT,                  -- 'form-submit' | 'form-send-another' | 'honeypot-no-phone'
  path TEXT,
  trusted INTEGER,             -- 1 if event.isTrusted
  in_viewport INTEGER,         -- 1 if the element was on screen at click time
  x INTEGER, y INTEGER,
  ua TEXT,
  asn INTEGER, country TEXT,   -- from request.cf; never the IP
  env_json TEXT                -- 'start' only: {webdriver, modelContext}
);
CREATE INDEX idx_events_run_t ON events(run, t);
```

`t` is always the server's clock. Fields outside this list are dropped.

## Components

### 1. `functions/api/log.ts` (about 50 lines)
- `POST` only; anything else returns 405. Body capped at 4 KB, parsed as JSON even when sent as `text/plain`.
- Validate: `run` matches `^[A-Za-z0-9_-]{1,16}$`; `event` in `{start, click}`; `label` in a fixed list. Unknown values -> 400, nothing written.
- Per-run cap (for example 500 rows; checked with a `COUNT(*)`) so junk POSTs cannot fill the database.
- Reads `User-Agent`, `request.cf.asn` and `request.cf.country`. **Never stores the IP address or cookies.**
- Responds `204` with no body on success; never echoes input.
- Kill switch: if the env var `LAB_ENABLED` is not `1`, respond 404 and write nothing. Flip it in the Pages dashboard without redeploying.

### 2. `src/lab-log.ts` (about 60 lines; the only code added to the real bundle)
- On load: read `?lab=` from `location.search`; if valid, save to `sessionStorage`. No run id -> do nothing at all (no listeners, no requests).
- Send one `start` event (path, `navigator.webdriver`, `'modelContext' in navigator`).
- One capture-phase `click` listener: `event.target.closest('[data-lab]')`; if found, send `{label, path, trusted: event.isTrusted, inViewport, x, y}`. Clicks on anything else are ignored.
- `export function labLog(label)` for code that wants to log directly.
- Transport: `navigator.sendBeacon('/api/log', new Blob([json], {type:'text/plain'}))`, with a `fetch(..., {keepalive:true})` fallback. Failure is silent; the site never breaks if logging is down.
- Never reads field values, typed text or element text.

### 3. Edits to the real site
| File | Change |
|---|---|
| `src/main.tsx` | `import "./lab-log";` (one line) |
| `src/routes/About.tsx` | `labLog("form-submit")` in `handleSubmit`; `data-lab="form-submit"` on the Submit button; `data-lab="form-send-another"` on "Send another message"; new honeypot button after the phone field: `<button type="button" data-lab="honeypot-no-phone" tabIndex={-1} aria-hidden="true" className="hp-no-phone">No phone</button>` |
| `src/styles/contact-form.css` | `.hp-no-phone` hidden for humans (off-screen, no layout shift) |

The honeypot has **no instruction text** and does nothing when clicked beyond logging. It must never say anything addressed to an agent.

### 4. Cloudflare setup (one time)
1. `npx wrangler d1 create site-log` and note the database id.
2. Apply the schema: `npx wrangler d1 migrations apply site-log --remote`. (Needs a `wrangler` dev dependency and a minimal config, see open item 3.)
3. In the Pages project: Settings -> Bindings -> add a D1 binding named `DB`, and Variables -> `LAB_ENABLED=1`.
4. Push to `main`; Pages builds the site and deploys `functions/` together.

Local development: `npx wrangler pages dev dist --d1 DB=site-log` after `npm run build`, with a local D1 (`--local`).

## Phases

**Phase A: database and function.** Add the migration and `functions/api/log.ts`. *Accept when:* with `wrangler pages dev`, a `curl` of a good event inserts exactly one row; bad run id, unknown label, oversize body and wrong method are rejected with nothing written; the kill switch returns 404.

**Phase B: site snippet and honeypot.** Add `src/lab-log.ts`, the attributes, the honeypot and CSS. *Accept when:* `npm run build` passes; with no `?lab` the page makes **zero** extra requests; with `?lab=R1` a Submit click and a honeypot click each insert one row; the honeypot is not visible, not focusable by Tab, and causes no layout shift; typed form text never appears in any row.

**Phase C: Cloudflare setup and ship.** Do section 4 and merge to `main`. *Accept when:* opening `https://jaydengmckenna.com/?lab=R1` yourself and clicking Submit produces a row in the remote database.

**Phase D: Muse run.** Record the prompt and times in your own notes, give Muse the `?lab=<id>` URL (ideally on the first page it opens, for example `/about?lab=R1`), then read the results.

**Reading the log:**
```
npx wrangler d1 execute site-log --remote --command "select datetime(t/1000,'unixepoch') as at, label, trusted, in_viewport, path from events where run='R1' order by t"
```
A `honeypot-no-phone` click with `in_viewport = 0` or `trusted = 0` means the agent acted on the DOM, not the screen. A `form-submit` with no honeypot click is the baseline.

## Safety and privacy

- Visitors without `?lab=` are never logged and send nothing.
- Stored data is a button label, a run id, a path, booleans, coordinates, the User-Agent, ASN, country and server time. No IP, cookies, typed text or element text.
- The public endpoint accepts only allowlisted values, is size-capped, has a per-run row cap, and has a kill switch.
- **Rule 12.6 exception (honeypot):** you have chosen a button hidden from humans. Mitigations: neutral label "No phone", no instructions to agents, no effect when clicked, `aria-hidden` and out of the Tab order so assistive-technology users are not confused. Documented here and in a code comment.
- The D1 database and function live in the production Cloudflare account, so this edits Jayden's real site and needs their sign-off.

## Dropped from earlier designs

The old `lab/` folder (about 770 lines of functions, wrangler config, report scripts, IP hashing, separate Pages project), the Node server and tunnel (v2), beacon batching, pointer/scroll/section/perf/heartbeat tracking, fingerprinting, 404 and request logging for ordinary visitors. Note that **the production bundle now contains logging code** (`src/lab-log.ts`), kept inert by the `?lab=` gate and the server-side allowlist.

## Open items

1. **Jayden's sign-off:** this edits his production site and creates a D1 database and binding in the Cloudflare account that owns the Pages project.
2. **Who has account access** to create the D1 database and bind it.
3. **Wrangler config:** adding a `wrangler.toml` at the repo root makes Pages treat that file as the source of truth for bindings and variables. Decide whether to keep bindings in the dashboard (no root config; use `--config`-free local flags) or move them into `wrangler.toml`.
4. **Honeypot hiding method:** off-screen + `aria-hidden` + `tabIndex=-1` is assumed. An agent that reads the accessibility tree will not see an `aria-hidden` element; drop `aria-hidden` if you want those agents to see it (screen-reader users would then hear a "No phone" button).
5. **Optional `start` event** (webdriver, modelContext): included; remove if you want clicks only.
6. **Run id gating:** `?lab=` must be on the first URL Muse opens. If it navigates directly to `/about` without it, nothing is logged.
7. **Row retention:** nothing deletes old rows. Clear a run with `delete from events where run='R1'` when done.

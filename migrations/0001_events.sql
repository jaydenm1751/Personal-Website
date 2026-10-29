-- Lab logger: one row per logged button click or run start. See aakash-notes/plan.md.
-- Stores no IP address, cookies, typed text or element text.

CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  t INTEGER NOT NULL,          -- server receive time, ms since epoch (clients are not trusted)
  run TEXT NOT NULL,           -- run id from ?lab=
  event TEXT NOT NULL,         -- 'start' | 'click'
  label TEXT,                  -- 'form-submit' | 'form-send-another' | 'honeypot-no-phone'
  path TEXT,
  trusted INTEGER,             -- 1 if event.isTrusted
  in_viewport INTEGER,         -- 1 if the element was on screen at click time
  x INTEGER,
  y INTEGER,
  ua TEXT,
  asn INTEGER,                 -- from request.cf; never the IP
  country TEXT,
  env_json TEXT                -- 'start' only: {webdriver, modelContext}
);

CREATE INDEX idx_events_run_t ON events(run, t);

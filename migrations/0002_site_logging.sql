-- Tables written by the logging Pages Functions.

-- functions/api/log-hidden-field.ts: the About form's hidden no-phone checkbox was checked.
CREATE TABLE IF NOT EXISTS honeypot_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  field_id TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  ip TEXT,
  user_agent TEXT,
  referer TEXT,
  country TEXT,
  city TEXT,
  as_organization TEXT
);

-- functions/_middleware.ts: one row per page load that reaches the server.
CREATE TABLE IF NOT EXISTS site_visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT NOT NULL,
  ip TEXT,
  user_agent TEXT,
  referer TEXT,
  country TEXT,
  city TEXT,
  as_organization TEXT,
  asn INTEGER,
  method TEXT,
  path TEXT,
  query TEXT,
  accept_language TEXT,
  sec_ch_ua TEXT,
  sec_fetch_site TEXT,
  sec_fetch_mode TEXT,
  sec_fetch_dest TEXT,
  http_protocol TEXT,
  tls_version TEXT
);

CREATE INDEX IF NOT EXISTS idx_site_visits_ip_timestamp ON site_visits(ip, timestamp);

-- functions/api/log.ts: in-app page views, clicks, keyboard Tab focus, form submits.
CREATE TABLE IF NOT EXISTS interaction_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT NOT NULL,
  session_id TEXT NOT NULL,      -- random per browser tab, links one visitor's events
  type TEXT NOT NULL,            -- 'pageview' | 'click' | 'tab-focus' | 'form-submit'
  page TEXT NOT NULL,
  label TEXT,                    -- data-log value of the element, e.g. 'home:hero-explore-work'
  element TEXT,                  -- tag#id of the element, for unlabeled focus targets
  trusted INTEGER,               -- 1 if event.isTrusted (0 = dispatched by script)
  in_viewport INTEGER,           -- 1 if the element was on screen at the time
  x INTEGER,
  y INTEGER,
  click_detail INTEGER,          -- MouseEvent.detail; 0 = keyboard or programmatic click
  shift_key INTEGER,             -- tab-focus only: 1 = Shift+Tab
  ms_since_load INTEGER,
  webdriver INTEGER,             -- pageview only: navigator.webdriver
  meta_json TEXT,
  ip TEXT,
  user_agent TEXT,
  referer TEXT,
  country TEXT,
  city TEXT,
  as_organization TEXT,
  asn INTEGER
);

CREATE INDEX IF NOT EXISTS idx_interaction_events_session ON interaction_events(session_id, timestamp);

-- Removes the "lab logger" events table from 0001_events.sql, superseded by the
-- honeypot_events / site_visits / interaction_events tables in 0002_site_logging.sql.
-- See aakash-notes/plan.md: that v3 plan (`?lab=` gated logging) was never built on top of.

DROP TABLE IF EXISTS events;

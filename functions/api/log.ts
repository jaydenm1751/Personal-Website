import {
  type Env,
  type RequestWithCf,
  loggingEnabled,
  requestContext,
  truncate,
} from "../_shared/request-log";

// Receives interaction events from src/lib/interaction-log.ts: in-app page views,
// clicks on [data-log] elements, keyboard Tab focus, and contact form submits.

const EVENT_TYPES = new Set(["pageview", "click", "tab-focus", "form-submit"]);
const MAX_BODY_BYTES = 4096;
const SESSION_ID = /^[A-Za-z0-9-]{8,64}$/;
const LABEL = /^[a-z0-9:_./-]{1,80}$/;

function bool(value: unknown): number | null {
  return typeof value === "boolean" ? Number(value) : null;
}

function int(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? Math.round(value) : null;
}

function str(value: unknown, max: number): string | null {
  return typeof value === "string" ? truncate(value, max) : null;
}

export async function onRequestPost({
  request,
  env,
}: {
  request: RequestWithCf;
  env: Env;
}) {
  if (!loggingEnabled(env)) {
    return new Response(null, { status: 404 });
  }

  // sendBeacon posts as text/plain, so parse the raw text instead of trusting Content-Type.
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) {
    return new Response("Payload too large", { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return new Response("Invalid payload", { status: 400 });
  }

  const type = body.type;
  const sessionId = body.sessionId;
  const page = body.page;
  const label = body.label ?? null;

  if (
    typeof type !== "string" || !EVENT_TYPES.has(type) ||
    typeof sessionId !== "string" || !SESSION_ID.test(sessionId) ||
    typeof page !== "string" || !page.startsWith("/") ||
    (label !== null && (typeof label !== "string" || !LABEL.test(label)))
  ) {
    return new Response("Invalid payload", { status: 400 });
  }

  const meta = body.meta && typeof body.meta === "object" ? JSON.stringify(body.meta) : null;

  const entry = {
    ...requestContext(request),
    sessionId,
    type,
    page: truncate(page, 300),
    label,
    element: str(body.element, 120),
    trusted: bool(body.trusted),
    inViewport: bool(body.inViewport),
    x: int(body.x),
    y: int(body.y),
    clickDetail: int(body.clickDetail),
    shiftKey: bool(body.shiftKey),
    msSinceLoad: int(body.msSinceLoad),
    webdriver: bool(body.webdriver),
    meta: truncate(meta, 1024),
  };

  console.log(JSON.stringify({ event: `interaction.${type}`, ...entry }));

  if (env.DB) {
    try {
      await env.DB.prepare(
        `INSERT INTO interaction_events (
           timestamp, session_id, type, page, label, element, trusted, in_viewport,
           x, y, click_detail, shift_key, ms_since_load, webdriver, meta_json,
           ip, user_agent, referer, country, city, as_organization, asn
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
        .bind(
          entry.timestamp,
          entry.sessionId,
          entry.type,
          entry.page,
          entry.label,
          entry.element,
          entry.trusted,
          entry.inViewport,
          entry.x,
          entry.y,
          entry.clickDetail,
          entry.shiftKey,
          entry.msSinceLoad,
          entry.webdriver,
          entry.meta,
          entry.ip,
          entry.userAgent,
          entry.referer,
          entry.country,
          entry.city,
          entry.asOrganization,
          entry.asn,
        )
        .run();
    } catch (error) {
      console.error(JSON.stringify({ event: "interaction.d1_write_failed", error: String(error) }));
    }
  }

  return new Response(null, { status: 204 });
}

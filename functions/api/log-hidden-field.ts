import { type Env, type RequestWithCf, requestContext } from "../_shared/request-log";

export async function onRequestPost({
  request,
  env,
}: {
  request: RequestWithCf;
  env: Env;
}) {
  const body = await request.json().catch(() => null);
  const fieldId = body && typeof body === "object" && "fieldId" in body
    ? String((body as Record<string, unknown>).fieldId)
    : null;

  if (!fieldId) {
    return new Response("Invalid payload", { status: 400 });
  }

  const entry = { fieldId, ...requestContext(request) };

  console.warn(JSON.stringify({ event: "honeypot.triggered", ...entry }));

  if (!env.DB) {
    return new Response(null, { status: 204 });
  }

  try {
    await env.DB.prepare(
      `INSERT INTO honeypot_events (field_id, timestamp, ip, user_agent, referer, country, city, as_organization)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        entry.fieldId,
        entry.timestamp,
        entry.ip,
        entry.userAgent,
        entry.referer,
        entry.country,
        entry.city,
        entry.asOrganization,
      )
      .run();
  } catch (error) {
    console.error(JSON.stringify({ event: "honeypot.d1_write_failed", error: String(error) }));
  }

  return new Response(null, { status: 204 });
}

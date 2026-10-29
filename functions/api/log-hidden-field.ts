interface RequestWithCf extends Request {
  cf?: { country?: string; city?: string; asOrganization?: string };
}

interface D1PreparedStatement {
  bind: (...args: unknown[]) => D1PreparedStatement;
  run: () => Promise<unknown>;
}

interface D1Database {
  prepare: (query: string) => D1PreparedStatement;
}

interface Env {
  DB: D1Database;
}

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

  const entry = {
    fieldId,
    timestamp: new Date().toISOString(),
    ip: request.headers.get("cf-connecting-ip") ?? "unknown",
    userAgent: request.headers.get("user-agent") ?? "unknown",
    referer: request.headers.get("referer") ?? "unknown",
    country: request.cf?.country ?? "unknown",
    city: request.cf?.city ?? "unknown",
    asOrganization: request.cf?.asOrganization ?? "unknown",
  };

  console.warn(JSON.stringify({ event: "honeypot.triggered", ...entry }));

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

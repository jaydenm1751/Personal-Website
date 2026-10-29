export async function onRequestPost({ request }: { request: Request }) {
  const body = await request.json().catch(() => null);
  const fieldId = body && typeof body === "object" && "fieldId" in body
    ? String((body as Record<string, unknown>).fieldId)
    : null;

  if (!fieldId) {
    return new Response("Invalid payload", { status: 400 });
  }

  console.log(
    JSON.stringify({
      event: "hidden-field-triggered",
      fieldId,
      timestamp: new Date().toISOString(),
      ip: request.headers.get("cf-connecting-ip") ?? "unknown",
      userAgent: request.headers.get("user-agent") ?? "unknown",
    }),
  );

  return new Response(null, { status: 204 });
}

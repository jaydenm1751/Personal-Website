// Shared types and helpers for the logging Pages Functions. This module exports
// no onRequest handlers, so Cloudflare Pages does not turn it into a route.

export interface RequestWithCf extends Request {
  cf?: {
    country?: string;
    city?: string;
    asOrganization?: string;
    asn?: number;
    httpProtocol?: string;
    tlsVersion?: string;
  };
}

export interface D1PreparedStatement {
  bind: (...args: unknown[]) => D1PreparedStatement;
  run: () => Promise<unknown>;
}

export interface D1Database {
  prepare: (query: string) => D1PreparedStatement;
}

export interface Env {
  DB?: D1Database;
  // Set to "0" in the Pages dashboard to stop all logging without a redeploy.
  LOG_ENABLED?: string;
}

export function loggingEnabled(env: Env): boolean {
  return env.LOG_ENABLED !== "0";
}

// The visitor fields recorded for every logged request: who, from where, and with what.
export function requestContext(request: RequestWithCf) {
  const headers = request.headers;

  return {
    timestamp: new Date().toISOString(),
    ip: headers.get("cf-connecting-ip") ?? "unknown",
    userAgent: headers.get("user-agent") ?? "unknown",
    referer: headers.get("referer") ?? "unknown",
    country: request.cf?.country ?? "unknown",
    city: request.cf?.city ?? "unknown",
    asOrganization: request.cf?.asOrganization ?? "unknown",
    asn: request.cf?.asn ?? null,
    // Headers real browsers send and many crawlers and automation tools omit or fake.
    acceptLanguage: headers.get("accept-language"),
    secChUa: headers.get("sec-ch-ua"),
    secFetchSite: headers.get("sec-fetch-site"),
    secFetchMode: headers.get("sec-fetch-mode"),
    secFetchDest: headers.get("sec-fetch-dest"),
    httpProtocol: request.cf?.httpProtocol ?? null,
    tlsVersion: request.cf?.tlsVersion ?? null,
  };
}

export type RequestContext = ReturnType<typeof requestContext>;

export function truncate(value: string | null | undefined, max: number): string | null {
  if (value == null) return null;
  return value.length > max ? value.slice(0, max) : value;
}

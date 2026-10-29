import {
  type Env,
  type RequestWithCf,
  loggingEnabled,
  requestContext,
  truncate,
} from "./_shared/request-log";

// Logs every page load that reaches the server (first visit, refresh, deep link,
// crawler fetch). In-app navigation never reaches the server; the browser
// reports those to /api/log instead.

// Paths with a file extension are static assets (JS, CSS, images, robots.txt)
// and are not page loads. /api/* requests log themselves.
function isPageLoad(request: Request, url: URL): boolean {
  if (request.method !== "GET" && request.method !== "HEAD") return false;
  if (url.pathname.startsWith("/api/")) return false;
  if (/\.[a-z0-9]+$/i.test(url.pathname)) return false;
  return true;
}

export async function onRequest({
  request,
  env,
  next,
  waitUntil,
}: {
  request: RequestWithCf;
  env: Env;
  next: () => Promise<Response>;
  waitUntil: (promise: Promise<unknown>) => void;
}) {
  const url = new URL(request.url);

  if (!loggingEnabled(env) || !isPageLoad(request, url)) {
    return next();
  }

  const entry = {
    ...requestContext(request),
    method: request.method,
    path: truncate(url.pathname, 300),
    query: truncate(url.search, 500),
  };

  console.log(JSON.stringify({ event: "site.visit", ...entry }));

  if (env.DB) {
    // waitUntil lets the page be served without waiting for the database write.
    waitUntil(
      env.DB.prepare(
        `INSERT INTO site_visits (
           timestamp, ip, user_agent, referer, country, city, as_organization, asn,
           method, path, query, accept_language, sec_ch_ua, sec_fetch_site,
           sec_fetch_mode, sec_fetch_dest, http_protocol, tls_version
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
        .bind(
          entry.timestamp,
          entry.ip,
          entry.userAgent,
          entry.referer,
          entry.country,
          entry.city,
          entry.asOrganization,
          entry.asn,
          entry.method,
          entry.path,
          entry.query,
          entry.acceptLanguage,
          entry.secChUa,
          entry.secFetchSite,
          entry.secFetchMode,
          entry.secFetchDest,
          entry.httpProtocol,
          entry.tlsVersion,
        )
        .run()
        .catch((error) => {
          console.error(JSON.stringify({ event: "site.visit_d1_write_failed", error: String(error) }));
        }),
    );
  }

  return next();
}

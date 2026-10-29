// Reports in-app page views, clicks on [data-log] elements, keyboard Tab focus,
// and form submits to the Pages Function at functions/api/log.ts.
// Never reads input values, typed text, or element text.

type EventType = "pageview" | "click" | "tab-focus" | "form-submit";

interface LogEvent {
  type: EventType;
  label?: string | null;
  element?: string;
  trusted?: boolean;
  inViewport?: boolean;
  x?: number;
  y?: number;
  clickDetail?: number;
  shiftKey?: boolean;
  webdriver?: boolean;
  meta?: Record<string, unknown>;
}

const SESSION_KEY = "site-log-session";
// A focus change this soon after a Tab keydown is treated as Tab navigation.
const TAB_FOCUS_WINDOW_MS = 100;

function sessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "no-session-storage";
  }
}

function send(event: LogEvent) {
  const payload = JSON.stringify({
    ...event,
    sessionId: sessionId(),
    page: location.pathname,
    msSinceLoad: performance.now(),
  });

  // Best-effort: logging must never break the site.
  try {
    const blob = new Blob([payload], { type: "text/plain" });
    if (navigator.sendBeacon?.("/api/log", blob)) return;
    fetch("/api/log", { method: "POST", body: payload, keepalive: true }).catch(() => {});
  } catch {
    // Ignore.
  }
}

function describeElement(element: Element): string {
  const tag = element.tagName.toLowerCase();
  if (element.id) return `${tag}#${element.id}`;
  const name = element.getAttribute("name");
  return name ? `${tag}[name=${name}]` : tag;
}

function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.width > 1 &&
    rect.height > 1 &&
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < window.innerHeight &&
    rect.left < window.innerWidth
  );
}

let installed = false;
let lastTab: { time: number; shiftKey: boolean } | null = null;

export function installInteractionLogging() {
  if (installed) return;
  installed = true;

  document.addEventListener(
    "click",
    (event) => {
      const target = (event.target as Element | null)?.closest?.("[data-log]");
      if (!target) return;

      send({
        type: "click",
        label: target.getAttribute("data-log"),
        element: describeElement(target),
        trusted: event.isTrusted,
        inViewport: isInViewport(target),
        x: event.clientX,
        y: event.clientY,
        clickDetail: event.detail,
      });
    },
    { capture: true },
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Tab") {
        lastTab = { time: performance.now(), shiftKey: event.shiftKey };
      }
    },
    { capture: true },
  );

  document.addEventListener(
    "focusin",
    (event) => {
      const tab = lastTab;
      lastTab = null;
      if (!tab || performance.now() - tab.time > TAB_FOCUS_WINDOW_MS) return;

      const target = event.target as Element;
      send({
        type: "tab-focus",
        label: target.closest("[data-log]")?.getAttribute("data-log") ?? null,
        element: describeElement(target),
        trusted: event.isTrusted,
        inViewport: isInViewport(target),
        shiftKey: tab.shiftKey,
      });
    },
    { capture: true },
  );
}

let lastLoggedPath: string | null = null;

export function logPageView(path: string) {
  // React StrictMode runs effects twice in development; log each path change once.
  if (path === lastLoggedPath) return;
  const from = lastLoggedPath;
  lastLoggedPath = path;

  send({
    type: "pageview",
    webdriver: navigator.webdriver,
    meta: {
      from,
      navigation: from === null ? "initial" : "in-app",
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      screen: `${screen.width}x${screen.height}`,
      languages: navigator.languages?.length ?? 0,
      modelContext: "modelContext" in navigator,
    },
  });
}

export function logFormSubmit(label: string, meta: Record<string, unknown>) {
  send({ type: "form-submit", label, meta });
}

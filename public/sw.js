/*
 * Propaily — Service Worker (PWA Nivel 1).
 *
 * Mínimo a propósito: habilita la instalación y cachea SOLO assets estáticos
 * inmutables (`/_next/static/`, `/icons/`). NUNCA cachea HTML, respuestas de
 * API ni Server Actions:
 *  - El cache de un SW es global del origen, no por usuario → cachear HTML
 *    autenticado podría filtrar datos de un tenant a otro.
 *  - El modelo es server-rendered con RLS; las páginas deben ir siempre a red.
 */
const STATIC_CACHE = "propaily-static-v1";

self.addEventListener("install", () => {
  // Sin `skipWaiting()` automático: cuando hay una versión nueva, el SW queda
  // en estado "waiting" y la UI muestra el banner de actualización. El usuario
  // decide cuándo aplicarla. En la PRIMERA instalación (sin SW activo previo)
  // no hay fase de espera, así que el SW activa de inmediato igual.
});

// El banner de actualización (`service-worker-register.tsx`) envía este
// mensaje cuando el usuario hace click en "Actualizar".
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== STATIC_CACHE).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return; // nunca POST / Server Actions

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // solo mismo origen

  const isStatic =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/");
  if (!isStatic) return; // HTML, API, etc. → red directa, sin cache

  // Cache-first para assets inmutables.
  event.respondWith(
    caches.open(STATIC_CACHE).then(async (cache) => {
      const hit = await cache.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    }),
  );
});

const CACHE_NAME = "rifas-mantequilla-v2"; // Incrementar versión
const urlsToCache = ["/", "/manifest.json", "/favico.png"];

self.addEventListener("install", (event) => {
  self.skipWaiting(); // Forzar activación inmediata
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); // Limpiar cachés antiguos
          }
        })
      );
    })
  );
  self.clients.claim(); // Tomar control inmediato
});

self.addEventListener("fetch", (event) => {
  // No cachear rutas de navegación para evitar redirecciones incorrectas
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

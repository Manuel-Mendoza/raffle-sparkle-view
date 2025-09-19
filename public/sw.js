const CACHE_NAME = "rifas-v1.0.0";
const STATIC_CACHE = "rifas-static-v1";
const DYNAMIC_CACHE = "rifas-dynamic-v1";

// Recursos críticos para cachear
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/favico.png",
  "/src/assets/hero-motorcycle.jpg",
  "/manifest.json",
];

// URLs de API que NO deben cachearse
const NO_CACHE_URLS = [
  "/api/customers/buy-ticket",
  "/api/customers/upload-proof",
  "/api/admin/",
];

// Instalar Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activar Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Interceptar requests
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // No cachear APIs críticas
  if (NO_CACHE_URLS.some((path) => url.pathname.includes(path))) {
    return fetch(request);
  }

  // Estrategia Cache First para recursos estáticos
  if (
    request.destination === "image" ||
    request.destination === "style" ||
    request.destination === "script"
  ) {
    event.respondWith(
      caches
        .match(request)
        .then((response) => {
          return (
            response ||
            fetch(request).then((fetchResponse) => {
              return caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, fetchResponse.clone());
                return fetchResponse;
              });
            })
          );
        })
        .catch(() => {
          // Fallback para imágenes
          if (request.destination === "image") {
            return caches.match("/favico.png");
          }
        })
    );
    return;
  }

  // Estrategia Network First para HTML y API
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Solo cachear respuestas exitosas
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback a cache si no hay red
        return caches.match(request).then((response) => {
          return response || caches.match("/index.html");
        });
      })
  );
});

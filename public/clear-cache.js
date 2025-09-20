// Script para limpiar caché y service worker
(function () {
  "use strict";

  // Limpiar localStorage y sessionStorage
  if (typeof Storage !== "undefined") {
    localStorage.clear();
    sessionStorage.clear();
  }

  // Desregistrar service workers
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (let registration of registrations) {
        registration.unregister();
      }
    });
  }

  // Limpiar caché del navegador
  if ("caches" in window) {
    caches.keys().then(function (names) {
      for (let name of names) {
        caches.delete(name);
      }
    });
  }

  console.log("Caché limpiado completamente");
})();

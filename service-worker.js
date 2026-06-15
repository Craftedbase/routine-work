const CACHE_PREFIX = "mainichi-farm";
const STATIC_CACHE = `${CACHE_PREFIX}-static-v9`;
const RUNTIME_CACHE = `${CACHE_PREFIX}-runtime-v9`;

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/audio/bgm/bgm-main.mp3",
  "./assets/audio/se/se-all-clear.mp3",
  "./assets/audio/se/se-buy.mp3",
  "./assets/audio/se/se-complete.mp3",
  "./assets/audio/se/se-reward.mp3",
  "./assets/audio/se/se-stamp.mp3",
  "./assets/audio/se/se-tap.mp3",
  "./assets/audio/se/se-transition-01.mp3",
  "./assets/audio/se/se-transition-02.mp3",
  "./images/app-icon-192.png",
  "./images/app-icon-512.png",
  "./images/app-icon-maskable-192.png",
  "./images/app-icon-maskable-512.png",
  "./images/decor-barn.png",
  "./images/farm-empty.png",
  "./images/farm-bg-main.png",
  "./images/farm-bg-spring.png",
  "./images/farm-bg-summer.png",
  "./images/farm-bg-autumn.png",
  "./images/farm-bg-winter.png",
  "./images/farm-bg-night.png",
  "./images/farm-fence-front.png",
  "./images/icon-coin.png",
  "./images/icon-feed.png",
  "./images/icon-water.png",
  "./images/icon-health.png",
  "./images/icon-heart.png",
  "./images/item-feed.png",
  "./images/item-water.png",
  "./images/animal-cow-normal.png",
  "./images/animal-chicken-normal.png",
  "./images/animal-sheep-normal.png",
  "./images/animal-rabbit-normal.png",
  "./images/animal-goat-normal.png",
  "./images/animal-dog-normal.png",
  "./images/animal-pig-normal.png",
  "./images/animal-duck-normal.png",
  "./images/animal-horse-normal.png",
  "./images/animal-cat-normal.png",
  "./images/animal-alpaca-normal.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  const currentCaches = new Set([STATIC_CACHE, RUNTIME_CACHE]);
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key.startsWith(CACHE_PREFIX) && !currentCaches.has(key))
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (request.destination === "image" || url.pathname.includes("/images/")) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});

async function networkFirstNavigation(request) {
  const cache = await caches.open(STATIC_CACHE);
  try {
    const response = await fetch(request);
    if (isCacheable(response)) await cache.put("./index.html", response.clone());
    return response;
  } catch (error) {
    return (await cache.match("./index.html")) || Response.error();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (isCacheable(response)) await cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  const networkResponse = fetch(request)
    .then((response) => {
      if (isCacheable(response)) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);

  if (cached) return cached;
  return (await networkResponse) || Response.error();
}

function isCacheable(response) {
  return response && response.ok && response.type === "basic";
}

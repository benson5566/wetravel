const CACHE_NAME = 'wetravel-v15';
const ASSETS = [
  './index.html',
  './app.js?v=15',
  './manifest.json',
  'https://unpkg.com/vue@3/dist/vue.esm-browser.js',

  'https://unpkg.com/@phosphor-icons/web',
  'https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Noto+Sans+JP:wght@400;500;700;900&family=Noto+Sans+TC:wght@300;400;500;700&display=swap'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim()); // Take control of all clients immediately
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

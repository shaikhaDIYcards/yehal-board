// Keeps the app opening fast and working with a weak connection.
// Network first, so a weekly update shows up as soon as the phone is online.
const CACHE = 'yehal-v2';
const CORE = ['./', './index.html', './data.js', './manifest.webmanifest',
  './fonts/baloo-600-arabic.woff2', './fonts/baloo-600-latin.woff2', './fonts/readex-400-arabic.woff2', './fonts/readex-400-latin.woff2'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE))); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request)));
});

// Keeps the app opening fast and working with a weak connection.
// Network first, so a weekly update shows up as soon as the phone is online.
const CACHE = 'yehal-v4';
const CORE = ['./', './index.html', './data.js', './manifest.webmanifest',
  './fonts/marhey-arabic.woff2', './fonts/marhey-latin.woff2', './fonts/readex-400-arabic.woff2', './fonts/readex-400-latin.woff2'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE))); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  // ask the server every time (a cheap check), so the weekly update shows up straight away
  e.respondWith(fetch(e.request, {cache: 'no-cache'}).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request)));
});

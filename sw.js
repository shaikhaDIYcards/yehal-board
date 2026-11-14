// Keeps the app opening fast and working with a weak connection.
// Network first, so a weekly update shows up as soon as the phone is online.
const CACHE = 'yehal-v1';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './index.html', './data.js', './manifest.webmanifest']))); });
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request)));
});

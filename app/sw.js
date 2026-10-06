// LazForge service worker.
// The cache name comes from the registration URL (sw.js?v=<APP_VERSION>), so the version shown in
// the app and the cache name can never drift apart. Fallback only matters if registered bare.
const VERSION = new URL(self.location.href).searchParams.get('v') || 'dev';
const CACHE = 'lazforge-v' + VERSION;
const FONT_CACHE = 'lazforge-fonts';

// Everything here must exist in /app. Keep in sync with the repo layout.
const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k.startsWith('lazforge-') && k !== CACHE && k !== FONT_CACHE)
            .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;                       // never touch POSTs (Groq API calls)
  const url = new URL(req.url);

  // Google Fonts: cache after first load so the display face survives offline.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.open(FONT_CACHE).then(cache =>
        cache.match(req).then(hit => {
          const net = fetch(req).then(res => {
            if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
            return res;
          }).catch(() => hit);
          return hit || net;
        })
      )
    );
    return;
  }

  if (url.origin !== self.location.origin) return;        // everything else cross-origin (api.groq.com …) passes through

  // HTML: network-first so a deploy shows up on the next open; cached copy when offline.
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    e.respondWith(
      fetch(req).then(res => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() =>
        caches.match(req, { ignoreSearch: true })
          .then(hit => hit || caches.match('./index.html'))
          .then(hit => hit || caches.match('./'))
      )
    );
    return;
  }

  // Static assets: cache-first, fill on miss.
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }))
  );
});

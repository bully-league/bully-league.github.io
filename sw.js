/* Service worker: NETWORK-FIRST for everything same-origin, cache as the
   offline fallback only. The shell is ~30 KB on a fast CDN — always fetching
   fresh means every deploy is visible on the very next open, no double-refresh
   ritual. (v7 and earlier were cache-first, which showed the previous version
   on every load and could even refill the cache from the browser's HTTP cache;
   that's the bug this version retires.) `cache: "no-cache"` on every fetch
   forces revalidation past GitHub Pages' 10-minute HTTP cache too. */

const CACHE_NAME = "fo-shell-v8";

self.addEventListener("install", (event) => {
  // No precache list to go stale — the cache fills organically from real visits.
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== location.origin) return;

  // The Updates tab's week files (updates/<season-key>.json) are never kept: every key
  // ever opened, past seasons' included, would sit in the cache for good, and the only
  // thing an offline copy could do is show an old sync's list beside newer totals. The
  // tab says "couldn't load" offline instead (2026-10-16).
  const keep = !/\/updates\/[^/]+\.json$/.test(url.pathname);

  event.respondWith(
    fetch(new Request(event.request, { cache: "no-cache" }))
      .then((res) => {
        if (res.ok && keep) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(event.request).then((hit) => hit || caches.match("index.html")))
  );
});

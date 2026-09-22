const ASSET_CACHE = 'meishinkan-assets-v4';

function isAssetHost(hostname) {
  return (
    hostname === 'huggingface.co' ||
    hostname.endsWith('.huggingface.co') ||
    hostname === 'hf-mirror.com' ||
    hostname.endsWith('.hf-mirror.com') ||
    hostname === 'files.catbox.moe'
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== ASSET_CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  let url;
  try {
    url = new URL(request.url);
  } catch (e) {
    return;
  }
  if (!isAssetHost(url.hostname)) return;
  if (request.headers.has('Range')) return;

  event.respondWith((async () => {
    const cache = await caches.open(ASSET_CACHE);
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    const networkRequest = new Request(url.href, {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      redirect: 'follow',
    });
    const response = await fetch(networkRequest);
    if (response && response.ok && response.status !== 206) {
      try {
        await cache.put(networkRequest, response.clone());
      } catch (e) { /* quota */ }
    }
    return response;
  })());
});

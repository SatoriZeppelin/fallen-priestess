/* ========== resource/assetResolver.js ========== */
/**
 * 资源 URL：优先 Hugging Face（think-denim-frisk/FallenPriestess），
 * 映射见 assetMap.js（由 catbox_mirror_no_cg/manifest.json 生成）；无映射或加载失败时回退 Catbox。
 * 需在 assetMap.js 之后、业务脚本之前加载。
 */
(function (global) {
  const USE_HF = true;
  const HF_REPO = 'think-denim-frisk/FallenPriestess';
  const HF_BASE = `https://huggingface.co/${HF_REPO}/resolve/main/`;
  const CATBOX_RE = /^https:\/\/files\.catbox\.moe\//;

  /**
   * @param {string} relPath
   */
  function hfUrlFromRel(relPath) {
    return HF_BASE + relPath.split('/').map(encodeURIComponent).join('/');
  }

  /**
   * @param {string} catboxUrl
   * @returns {string|null}
   */
  function hfRelPathForCatbox(catboxUrl) {
    const map = global.__MEISHINKAN_ASSET_MAP__ || {};
    if (map[catboxUrl]) return map[catboxUrl];
    const id = catboxUrl.replace(CATBOX_RE, '');
    const idMap = global.__MEISHINKAN_ASSET_ID_MAP__ || {};
    return idMap[id] || null;
  }

  /**
   * HF 上部分资源在分类目录，部分仍停留在仓库根目录的 catboxId 文件名。
   * @param {string} catboxUrl
   * @returns {string[]}
   */
  function hfRelPathCandidates(catboxUrl) {
    const rel = hfRelPathForCatbox(catboxUrl);
    if (!rel) return [];
    const id = catboxUrl.replace(CATBOX_RE, '');
    /** @type {string[]} */
    const paths = [rel];
    if (id && id !== rel) paths.push(id);
    return paths;
  }

  /**
   * @param {string} catboxUrl
   */
  function resolveAssetUrl(catboxUrl) {
    if (!catboxUrl || typeof catboxUrl !== 'string') return catboxUrl;
    if (!USE_HF || !CATBOX_RE.test(catboxUrl)) return catboxUrl;
    const rel = hfRelPathForCatbox(catboxUrl);
    return rel ? hfUrlFromRel(rel) : catboxUrl;
  }

  /** @type {Map<string, string>} */
  const hfToCatbox = new Map();
  (function buildReverseMap() {
    const map = global.__MEISHINKAN_ASSET_MAP__ || {};
    for (const [catbox, rel] of Object.entries(map)) {
      hfToCatbox.set(hfUrlFromRel(rel), catbox);
      const id = catbox.replace(CATBOX_RE, '');
      if (id && id !== rel) hfToCatbox.set(hfUrlFromRel(id), catbox);
    }
  })();

  /**
   * @param {string} url
   * @returns {string}
   */
  function toCatboxUrl(url) {
    if (!url || typeof url !== 'string') return url;
    if (CATBOX_RE.test(url)) return url;
    return hfToCatbox.get(url) || url;
  }

  /**
   * @param {string} catboxUrl
   * @returns {string[]}
   */
  function assetUrlCandidates(catboxUrl) {
    const canonical = toCatboxUrl(catboxUrl);
    if (!canonical || typeof canonical !== 'string') return [catboxUrl];
    if (!USE_HF || !CATBOX_RE.test(canonical)) return [canonical];

    const rel = hfRelPathForCatbox(canonical);
    if (!rel) return [canonical];

    const urls = [hfUrlFromRel(rel)];
    const id = canonical.replace(CATBOX_RE, '');
    if (id && id !== rel) {
      const alt = hfUrlFromRel(id);
      if (!urls.includes(alt)) urls.push(alt);
    }
    if (!rel.startsWith('背景/') && !urls.includes(canonical)) urls.push(canonical);
    return urls;
  }

  /**
   * @param {string} catboxUrl
   */
  function isCatboxUrl(catboxUrl) {
    return typeof catboxUrl === 'string' && CATBOX_RE.test(catboxUrl);
  }

  /** @type {Map<object, Function>} */
  const nativeSrcSetters = new Map();

  /**
   * 绕过 src hook，直接写入浏览器原生 src。
   * @param {HTMLImageElement|HTMLVideoElement} el
   * @param {string} url
   */
  function setNativeSrc(el, url) {
    const nativeSet = nativeSrcSetters.get(Object.getPrototypeOf(el));
    if (nativeSet) nativeSet.call(el, url);
    else el.src = url;
  }

  /**
   * img / video：先 HF，error 时回退 catbox。
   * @param {HTMLImageElement|HTMLVideoElement} el
   * @param {string} catboxUrl
   */
  function setMediaSrcWithFallback(el, catboxUrl) {
    if (!el || !catboxUrl) return;
    const canonical = toCatboxUrl(catboxUrl);
    el.dataset.catboxSrc = canonical;
    delete el.dataset.assetPreferCatbox;
    el.onerror = null;

    if (!USE_HF) {
      setNativeSrc(el, canonical);
      return;
    }

    const urls = assetUrlCandidates(catboxUrl);
    let index = 0;
    /** @param {Event} ev */
    function onMediaError(ev) {
      if (ev.target !== el) return;
      index += 1;
      if (index >= urls.length) {
        el.removeEventListener('error', onMediaError);
        return;
      }
      const next = urls[index];
      if (isCatboxUrl(next)) {
        console.warn('[asset] HF 路径均失败，回退 catbox:', catboxUrl);
        el.dataset.assetPreferCatbox = '1';
      } else {
        console.warn('[asset] HF 分类路径失败，尝试备用路径:', next);
      }
      setNativeSrc(el, next);
    }

    el.addEventListener('error', onMediaError);
    setNativeSrc(el, urls[0]);
  }

  /**
   * CSS url()：优先 HF（无运行时回退）。
   * @param {string} catboxUrl
   */
  function resolveCssAssetUrl(catboxUrl) {
    return resolveAssetUrl(catboxUrl);
  }

  const ASSET_CACHE = 'meishinkan-assets-v4';

  function isRemoteAssetHost(url) {
    try {
      const host = new URL(url, location.href).hostname;
      return (
        host === 'huggingface.co' ||
        host.endsWith('.huggingface.co') ||
        host === 'hf-mirror.com' ||
        host.endsWith('.hf-mirror.com') ||
        host === 'files.catbox.moe'
      );
    } catch (e) {
      return false;
    }
  }

  function hasRangeHeader(headers) {
    if (!headers) return false;
    if (typeof Headers !== 'undefined' && headers instanceof Headers) return headers.has('Range');
    return !!(headers.Range || headers.range);
  }

  async function openAssetCache() {
    if (!('caches' in global)) return null;
    try {
      return await caches.open(ASSET_CACHE);
    } catch (e) {
      return null;
    }
  }

  function assetCacheLookupUrls(url) {
    const seen = new Set();
    const list = [];
    const add = (u) => {
      if (!u || typeof u !== 'string' || seen.has(u)) return;
      seen.add(u);
      list.push(u);
    };
    add(url);
    assetUrlCandidates(url).forEach(add);
    add(resolveAssetUrl(url));
    return list;
  }

  function isUsableAssetResponse(response) {
    if (!response || !response.ok || response.status === 206) return false;
    const type = String(response.headers.get('content-type') || '').toLowerCase();
    if (type.includes('text/html') || type.includes('application/json') || type.includes('text/plain')) return false;
    return true;
  }

  async function deleteAssetCache(url) {
    const cache = await openAssetCache();
    if (!cache || !url) return;
    for (const candidate of assetCacheLookupUrls(url)) {
      try { await cache.delete(candidate, { ignoreSearch: true }); } catch (e) { /* ignore */ }
    }
  }

  async function matchAssetCache(url) {
    const cache = await openAssetCache();
    if (!cache || !url) return null;
    for (const candidate of assetCacheLookupUrls(url)) {
      try {
        const hit = await cache.match(candidate, { ignoreSearch: true });
        if (hit && isUsableAssetResponse(hit)) return hit;
        if (hit) await cache.delete(candidate, { ignoreSearch: true });
      } catch (e) { /* ignore */ }
    }
    return null;
  }

  async function putAssetCache(url, response) {
    const cache = await openAssetCache();
    if (!cache || !url || !response || !response.ok || response.status === 206) return;
    try {
      await cache.put(url, response.clone());
    } catch (e) { /* quota */ }
  }

  async function cachedAssetSize(url) {
    const hit = await matchAssetCache(url);
    if (!hit) return 0;
    const len = parseInt(hit.headers.get('content-length') || '', 10);
    if (Number.isFinite(len) && len > 0) return len;
    try {
      const blob = await hit.clone().blob();
      return blob.size || 0;
    } catch (e) {
      return 0;
    }
  }

  async function blobUrlFromCache(url) {
    const hit = await matchAssetCache(url);
    if (!hit) return null;
    try {
      const blob = await hit.blob();
      if (!blob || blob.size < 32) {
        await deleteAssetCache(url);
        return null;
      }
      const type = String(blob.type || hit.headers.get('content-type') || '').toLowerCase();
      if (type.includes('text/html') || type.includes('application/json')) {
        await deleteAssetCache(url);
        return null;
      }
      return { url: URL.createObjectURL(blob), size: blob.size };
    } catch (e) {
      return null;
    }
  }

  async function seedAssetCacheFromDataUrl(url, dataUrl) {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) return;
    const dest = resolveAssetUrl(url);
    if (!dest || !isRemoteAssetHost(dest)) return;
    const cache = await openAssetCache();
    if (!cache) return;
    try {
      const existing = await cache.match(dest, { ignoreSearch: true });
      if (existing) return;
      const blob = await (await fetch(dataUrl)).blob();
      await cache.put(dest, new Response(blob, {
        headers: {
          'Content-Type': blob.type || 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      }));
    } catch (e) { /* ignore */ }
  }

  /**
   * fetch：Cache Storage 优先，未命中再 HF / catbox，成功后写入缓存。
   * @param {string} catboxUrl
   * @param {RequestInit} [init]
   */
  async function fetchAsset(catboxUrl, init) {
    init = init || {};
    const method = String(init.method || 'GET').toUpperCase();
    const skipCache = method !== 'GET' || hasRangeHeader(init.headers);
    if (!skipCache) {
      const cached = await matchAssetCache(catboxUrl);
      if (cached) return cached;
    }
    const urls = assetUrlCandidates(catboxUrl);
    let lastErr;
    for (const url of urls) {
      try {
        const res = await fetch(url, init);
        if (res.ok) {
          if (!skipCache) {
            await putAssetCache(url, res);
            if (urls[0] && urls[0] !== url) await putAssetCache(urls[0], res);
          }
          return res;
        }
        lastErr = new Error(`HTTP ${res.status} ${url}`);
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr || new Error('fetchAsset failed: ' + catboxUrl);
  }

  function registerAssetServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    try {
      const swUrl = new URL('sw.js', document.baseURI || location.href).href;
      navigator.serviceWorker.register(swUrl).catch(() => {});
    } catch (e) { /* ignore */ }
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().catch(() => {});
    }
  }

  /** 静态 HTML 中的 catbox 媒体元素 */
  function patchStaticDomMedia() {
    for (const el of document.querySelectorAll('img[src*="files.catbox.moe"], video[src*="files.catbox.moe"]')) {
      const raw = el.getAttribute('src');
      if (raw) setMediaSrcWithFallback(el, raw);
    }
  }

  function patchIntroFrame() {
    const el = document.querySelector('.intro-corner-decoration');
    if (!el) return;
    const url = resolveAssetUrl('https://files.catbox.moe/dtbqcz.png');
    if (url) el.style.setProperty('--intro-frame', `url("${url}")`);
  }

  function cssUrl(url) {
    return `url('${resolveAssetUrl(toCatboxUrl(url))}')`;
  }

  global.MeishinkanAssets = {
    USE_HF,
    HF_BASE,
    ASSET_CACHE,
    resolveAssetUrl,
    resolveCssAssetUrl,
    assetUrlCandidates,
    toCatboxUrl,
    isCatboxUrl,
    setMediaSrcWithFallback,
    setNativeSrc,
    fetchAsset,
    cssUrl,
    patchStaticDomMedia,
    matchAssetCache,
    putAssetCache,
    deleteAssetCache,
    cachedAssetSize,
    blobUrlFromCache,
    seedAssetCacheFromDataUrl,
  };

  registerAssetServiceWorker();

  // 兼容短名
  global.resolveAssetUrl = resolveAssetUrl;
  global.resolveCssAssetUrl = resolveCssAssetUrl;
  global.setMediaSrcWithFallback = setMediaSrcWithFallback;
  global.fetchAsset = fetchAsset;
  global.toCatboxUrl = toCatboxUrl;
  global.cssUrl = cssUrl;

  /** img / video 赋值 catbox 时自动 HF 优先 + 回退 */
  function hookMediaSrc(proto) {
    const desc = Object.getOwnPropertyDescriptor(proto, 'src');
    if (!desc || !desc.set) return;
    nativeSrcSetters.set(proto, desc.set);
    Object.defineProperty(proto, 'src', {
      configurable: true,
      enumerable: desc.enumerable,
      get: desc.get,
      set(value) {
        if (isCatboxUrl(value)) {
          if (this.dataset.assetPreferCatbox === '1' && this.dataset.catboxSrc === value) {
            desc.set.call(this, value);
            return;
          }
          setMediaSrcWithFallback(this, value);
          return;
        }
        desc.set.call(this, value);
      },
    });
  }

  if (typeof HTMLImageElement !== 'undefined') hookMediaSrc(HTMLImageElement.prototype);
  if (typeof HTMLVideoElement !== 'undefined') hookMediaSrc(HTMLVideoElement.prototype);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      patchStaticDomMedia();
      patchIntroFrame();
    });
  } else {
    patchStaticDomMedia();
    patchIntroFrame();
  }
})(typeof window !== 'undefined' ? window : globalThis);



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

    const relPaths = hfRelPathCandidates(canonical);
    if (relPaths.length === 0) return [canonical];

    /** @type {string[]} */
    const urls = relPaths.map(hfUrlFromRel);
    if (!urls.includes(canonical)) urls.push(canonical);
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

  /**
   * fetch：先 HF，失败再 catbox。
   * @param {string} catboxUrl
   * @param {RequestInit} [init]
   */
  async function fetchAsset(catboxUrl, init) {
    const urls = assetUrlCandidates(catboxUrl);
    let lastErr;
    for (const url of urls) {
      try {
        const res = await fetch(url, init);
        if (res.ok) return res;
        lastErr = new Error(`HTTP ${res.status} ${url}`);
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr || new Error('fetchAsset failed: ' + catboxUrl);
  }

  /** 静态 HTML 中的 catbox 媒体元素 */
  function patchStaticDomMedia() {
    for (const el of document.querySelectorAll('img[src*="files.catbox.moe"], video[src*="files.catbox.moe"]')) {
      const raw = el.getAttribute('src');
      if (raw) setMediaSrcWithFallback(el, raw);
    }
  }

  function cssUrl(url) {
    return `url('${resolveAssetUrl(toCatboxUrl(url))}')`;
  }

  global.MeishinkanAssets = {
    USE_HF,
    HF_BASE,
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
  };

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
    document.addEventListener('DOMContentLoaded', patchStaticDomMedia);
  } else {
    patchStaticDomMedia();
  }
})(typeof window !== 'undefined' ? window : globalThis);



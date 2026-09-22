/* ========== index.js ========== */
    // ========== 立绘资源（数据已迁移至 resource/game-assets.js，此处为统一 API 别名）==========
    const gameAssets = window.妹神官_gameAssets || {};
    const tolinaSprites = gameAssets.tolinaSprites || {};
    const rivalMaleSprites = gameAssets.rivalMaleSprites || {};
    // 统一 UI 资源读取（来自 game-assets）
    function uiUrl(key) {
      const ga = window.妹神官_gameAssets;
      return (ga && typeof ga.getUI === 'function') ? (ga.getUI(key) || '') : '';
    }

    // IndexedDB工具函数
    const storageUtils = {
      dbName: 'TolinaImageCache',
      dbVersion: 1,
      storeName: 'images',

      // 初始化IndexedDB
      async initDB() {
        return new Promise((resolve, reject) => {
          const request = indexedDB.open(this.dbName, this.dbVersion);

          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve(request.result);

          request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(this.storeName)) {
              db.createObjectStore(this.storeName);
            }
          };
        });
      },

      // 检查URL是否为SVG文件
      isSVG(url) {
        return url.toLowerCase().endsWith('.svg') || url.toLowerCase().includes('.svg?');
      },

      async readCachedDataUrl(key) {
        try {
          const db = await this.initDB();
          return await new Promise((resolve) => {
            const transaction = db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => resolve(null);
          });
        } catch (e) {
          return null;
        }
      },

      // Cache Storage 优先；旧 IndexedDB data URL 仅作迁移，不再把整包写成 base64
      async saveImageToStorage(url, key) {
        try {
          if (this.isSVG(url)) return url;

          if (typeof MeishinkanAssets?.matchAssetCache === 'function') {
            const hit = await MeishinkanAssets.matchAssetCache(url);
            if (hit) return typeof resolveAssetUrl === 'function' ? resolveAssetUrl(url) : url;
          }

          const cached = await this.readCachedDataUrl(key);
          if (cached && typeof cached === 'string' && cached.startsWith('data:')) {
            if (typeof MeishinkanAssets?.seedAssetCacheFromDataUrl === 'function') {
              MeishinkanAssets.seedAssetCacheFromDataUrl(url, cached);
            }
            return cached;
          }

          const response =
            typeof fetchAsset === 'function' && MeishinkanAssets?.isCatboxUrl?.(url)
              ? await fetchAsset(url, { mode: 'cors' })
              : await fetch(url, { mode: 'cors' });
          if (response && response.ok) {
            if (typeof MeishinkanAssets?.putAssetCache === 'function') {
              await MeishinkanAssets.putAssetCache(
                typeof resolveAssetUrl === 'function' ? resolveAssetUrl(url) : url,
                response
              );
            }
            return typeof resolveAssetUrl === 'function' ? resolveAssetUrl(url) : url;
          }
          return url;
        } catch (error) {
          warnWithTag('WARN', '保存图片到缓存失败:', error);
          return url;
        }
      },

      // 使用img+canvas方法转换图片（绕过CORS限制）
      async saveImageViaCanvas(url, key) {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous'; // 尝试允许跨域

          img.onload = async () => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0);

              // 转换为base64
              const base64 = canvas.toDataURL('image/png');
              try {
                // 存储到IndexedDB
                const db = await storageUtils.initDB();
                const transaction = db.transaction([storageUtils.storeName], 'readwrite');
                const store = transaction.objectStore(storageUtils.storeName);
                await new Promise((res, rej) => {
                  const putRequest = store.put(base64, key);
                  putRequest.onsuccess = () => res();
                  putRequest.onerror = () => rej(putRequest.error);
                });
                resolve(base64);
              } catch (e) {
                warnWithTag('WARN', 'IndexedDB存储失败，使用原始URL:', e);
                resolve(url);
              }
            } catch (canvasError) {
              // canvas转换失败（可能是CORS限制），返回原始URL
              warnWithTag('WARN', 'canvas转换失败，使用原始URL:', canvasError);
              resolve(url);
            }
          };

          img.onerror = () => {
            // 图片加载失败，返回原始URL
            warnWithTag('WARN', '图片加载失败，使用原始URL');
            resolve(url);
          };

          // 设置超时
          setTimeout(() => {
            if (!img.complete) {
              warnWithTag('WARN', '图片加载超时，使用原始URL');
              resolve(url);
            }
          }, 10000);

          img.src = url;
        });
      },

      // 从IndexedDB删除
      async removeFromStorage(key) {
        try {
          const db = await this.initDB();
          const transaction = db.transaction([this.storeName], 'readwrite');
          const store = transaction.objectStore(this.storeName);
          store.delete(key);
        } catch (error) {
          warnWithTag('WARN', '删除IndexedDB数据失败:', error);
        }
      },

      // 获取存储大小（字节）
      async getStorageSize() {
        try {
          const db = await this.initDB();
          const transaction = db.transaction([this.storeName], 'readonly');
          const store = transaction.objectStore(this.storeName);

          return new Promise((resolve) => {
            let total = 0;
            const request = store.openCursor();

            request.onsuccess = (event) => {
              const cursor = event.target.result;
              if (cursor) {
                const value = cursor.value;
                const key = cursor.key;
                if (typeof value === 'string') {
                  total += value.length;
                }
                if (typeof key === 'string') {
                  total += key.length;
                }
                cursor.continue();
              } else {
                resolve(total);
              }
            };

            request.onerror = () => resolve(0);
          });
        } catch (error) {
          warnWithTag('WARN', '获取IndexedDB大小失败:', error);
          return 0;
        }
      },

      // 存档数据库工具
      archivesDB: {
        dbName: 'TolinaArchives',
        dbVersion: 1,

        async initDB() {
          return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
              const db = event.target.result;
              if (!db.objectStoreNames.contains('archives')) {
                db.createObjectStore('archives', { keyPath: 'name' });
              }
            };
          });
        },

        async saveArchive(archiveName, data) {
          const db = await this.initDB();
          const transaction = db.transaction(['archives'], 'readwrite');
          const store = transaction.objectStore('archives');
          await new Promise((resolve, reject) => {
            const request = store.put({ name: archiveName, data: data, timestamp: new Date().toISOString() });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
          });
          db.close();
        },

        async loadArchive(archiveName) {
          const db = await this.initDB();
          const transaction = db.transaction(['archives'], 'readonly');
          const store = transaction.objectStore('archives');
          return new Promise((resolve, reject) => {
            const request = store.get(archiveName);
            request.onsuccess = () => {
              db.close();
              resolve(request.result);
            };
            request.onerror = () => reject(request.error);
          });
        },

        async getAllArchives() {
          const db = await this.initDB();
          const transaction = db.transaction(['archives'], 'readonly');
          const store = transaction.objectStore('archives');
          return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => {
              db.close();
              resolve(request.result);
            };
            request.onerror = () => reject(request.error);
          });
        },

        async deleteArchive(archiveName) {
          const db = await this.initDB();
          const transaction = db.transaction(['archives'], 'readwrite');
          const store = transaction.objectStore('archives');
          await new Promise((resolve, reject) => {
            const request = store.delete(archiveName);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
          });
          db.close();
        }
      }
    };

    // 全局资源列表（用于设置界面）
    let allResources = [];

    /** 启动时不预加载 CG 资源（仍保留 URL 注册，剧情触发时按需加载） */
    const SKIP_CG_PRELOAD = true;

    // ========================================
    // ERA (Efficient Rollback Architecture) 集成
    // 参考: https://github.com/RockingSisyphus/ERA-EfficientRollbackArchitecture
    // ========================================

    // ERA 状态管理
    // 简单的路径获取函数（替代 lodash 的 _.get）
    function getNestedValue(obj, path) {
      if (!obj || !path) return undefined;
      const keys = path.split('.');
      let result = obj;
      for (const key of keys) {
        if (result === null || result === undefined) return undefined;
        result = result[key];
      }
      return result;
    }

    // 简单的路径设置函数（替代 lodash 的 _.set）
    function setNestedValue(obj, path, value) {
      if (!obj || !path) return;
      const keys = path.split('.');
      const lastKey = keys.pop();
      let current = obj;
      for (const key of keys) {
        if (current[key] === null || current[key] === undefined || typeof current[key] !== 'object') {
          current[key] = {};
        }
        current = current[key];
      }
      current[lastKey] = value;
    }

    // 非破坏性合并：只把 src 中 target 缺失的路径补进 target（不覆盖已有值）
    function mergeMissing(target, src) {
      if (!src || typeof src !== 'object') return target;
      if (!target || typeof target !== 'object') return target;
      for (const key of Object.keys(src)) {
        const sv = src[key];
        const tv = target[key];
        if (tv === undefined) {
          target[key] = (sv && typeof sv === 'object') ? JSON.parse(JSON.stringify(sv)) : sv;
        } else if (sv && typeof sv === 'object' && !Array.isArray(sv) && tv && typeof tv === 'object' && !Array.isArray(tv)) {
          mergeMissing(tv, sv);
        }
      }
      return target;
    }

    // 深度合并：src 的值覆盖/补入 target（叶子覆盖，对象递归）
    function deepMerge(target, src) {
      if (!src || typeof src !== 'object') return target;
      if (!target || typeof target !== 'object') return target;
      for (const key of Object.keys(src)) {
        const sv = src[key];
        const tv = target[key];
        if (sv && typeof sv === 'object' && !Array.isArray(sv) && tv && typeof tv === 'object' && !Array.isArray(tv)) {
          deepMerge(tv, sv);
        } else {
          target[key] = (sv && typeof sv === 'object') ? JSON.parse(JSON.stringify(sv)) : sv;
        }
      }
      return target;
    }

    // ==================== ERA 变量存储（本地同步实现）====================
    // 说明：变量真值始终存放在「最后对话层快照」（ERA.currentVars 指向它）。
    // 本实现为纯本地同步操作，不依赖任何外部事件总线。
    const ERA = {
      // 当前变量状态（= 最后对话层快照，由 setvar/updatevar/recordDialogueLayer 维护）
      currentVars: null,
      // 是否已初始化
      initialized: false,
      // 缓存（cache.vars 与 currentVars 指向同一棵树，保留字段以兼容既有引用）
      cache: {
        vars: null,
        timestamp: 0,
        ttl: 1000,
        pendingQuery: null
      },

      // 默认变量（开局时使用，未定义的均初始化为 0）
      defaultVars: (function () {
        const src = window.妹神官_default_variables;
        if (src && src.data) {
          try {
            return JSON.parse(JSON.stringify(src.data));
          } catch (e) {}
        }
        return {};
      })(),

      init() {
        if (this.initialized) return;
        this.initialized = true;
        logWithTag('ERA', 'ERA 本地变量存储已初始化');
      },

      // 确保 currentVars 存在（无则用默认变量初始化）
      _ensureVars() {
        if (!this.currentVars) {
          this.currentVars = JSON.parse(JSON.stringify(this.defaultVars));
        }
        return this.currentVars;
      },

      // 插入变量（非破坏性，只写入不存在的路径）
      insertByObject(obj) {
        const target = this._ensureVars();
        mergeMissing(target, obj);
        this._syncCache();
      },

      // 更新变量（修改/新增路径）
      updateByObject(obj) {
        const target = this._ensureVars();
        deepMerge(target, obj);
        this._syncCache();
      },

      // 通过路径插入变量（不存在才写）
      insertByPath(path, value) {
        const target = this._ensureVars();
        if (getNestedValue(target, path) === undefined) {
          setNestedValue(target, path, value);
          this._syncCache();
        }
      },

      // 通过路径更新变量（支持 = 与 += 运算）
      updateByPath(path, value, operator = '=') {
        const target = this._ensureVars();
        if (operator === '+=') {
          const cur = parseFloat(getNestedValue(target, path)) || 0;
          setNestedValue(target, path, cur + (parseFloat(value) || 0));
        } else {
          setNestedValue(target, path, value);
        }
        this._syncCache();
      },

      // 删除变量
      deleteByPath(path) {
        const target = this._ensureVars();
        const keys = String(path).split('.');
        const lastKey = keys.pop();
        let cur = target;
        for (const k of keys) {
          if (cur == null || typeof cur !== 'object') return;
          cur = cur[k];
        }
        if (cur && typeof cur === 'object') {
          delete cur[lastKey];
          this._syncCache();
        }
      },

      // 同步缓存指针（cache.vars 与 currentVars 同树）
      _syncCache() {
        this.cache.vars = this.currentVars;
        this.cache.timestamp = Date.now();
      },

      // 获取当前变量（本地同步，保持 async 以兼容既有 await 调用）
      async getCurrentVars(forceRefresh = false) {
        return this._ensureVars();
      },

      // 获取指定消息密钥的快照（本地实现暂不支持 mk 检索，返回当前变量）
      async getSnapshotAtMk(mk) {
        return this._ensureVars();
      },

      // 通过路径获取变量值
      async getByPath(path) {
        const vars = this._ensureVars();
        return getNestedValue(vars, path);
      }
    };

    // 对话层系统（与 ERA 集成）
    let dialogueLayers = []; // 存储所有对话层
    let currentDialogueLayer = 0; // 当前对话层数（从1开始，奇数）
    let currentArchiveName = null;
    let isLoveRouteStart = false; // 与 stat_data.系统.模式 同步；存档 routeTitle 兼容旧档

    const GAME_MODE_PURE_LOVE = '纯爱';
    const GAME_MODE_NORMAL = '正常';

    // 兼容旧代码的 defaultMvuData
    const defaultMvuData = {
      stat_data: ERA.defaultVars
    };

    // 初始化变量（只使用 ERA）
    async function initializeDefaultMvu() {
      // 初始化 ERA
      ERA.init();

      try {
        if (window.妹神官_settings_variable) {
          if (typeof window.妹神官_settings_variable.init === 'function') {
            window.妹神官_settings_variable.init();
          }
          if (typeof window.妹神官_settings_variable.getData === 'function') {
            const packed = window.妹神官_settings_variable.getData();
            if (packed && typeof packed === 'object' && Object.keys(packed).length) {
              ERA.defaultVars = packed;
            }
          }
        }
        ERA.insertByObject(ERA.defaultVars);
        ERA.cache.vars = JSON.parse(JSON.stringify(ERA.defaultVars));
        stripSystemRequest(ERA.cache.vars);
        requestFlags = emptyRequestFlags();
        ERA.cache.timestamp = Date.now();
        ERA.currentVars = ERA.cache.vars;
        const openingMode = isLoveRouteStart ? GAME_MODE_PURE_LOVE : GAME_MODE_NORMAL;
        setNestedValue(ERA.currentVars, '系统.模式', openingMode);
        ERA.cache.vars = JSON.parse(JSON.stringify(ERA.currentVars));
        logWithTag('ERA', '默认变量已通过 ERA 初始化');
      } catch (e) {
        errorWithTag('INIT', 'ERA 初始化失败', e);
      }
    }

    // 构建资源列表（数据来自 resource/game-assets.js 单一数据源）
    function buildResourceList() {
      const ga = window.妹神官_gameAssets;
      if (!ga || !Array.isArray(ga.preloadList)) {
        warnWithTag('资源', 'game-assets 未就绪，返回空资源列表');
        return [];
      }
      return ga.preloadList.map(a => ({ url: a.url, name: a.name, category: a.category, type: a.type }));
    }

    // 初始化资源列表（不加载资源，只填充列表）
    function initializeResourceList() {
      const assets = buildResourceList();

      // 保存到全局变量
      allResources = assets.map((asset, index) => ({
        ...asset,
        id: `resource_${index}`,
        loaded: false,
        failed: false
      }));

      logWithTag('DEBUG', `资源列表已初始化，共 ${allResources.length} 个资源`);
    }

    function applyResolvedImageSrc(img, originalUrl, imageSrc) {
      if (imageSrc && (imageSrc.startsWith('data:') || imageSrc.startsWith('blob:'))) {
        img.src = imageSrc;
        return;
      }
      if (typeof setMediaSrcWithFallback === 'function' && MeishinkanAssets?.isCatboxUrl?.(originalUrl)) {
        setMediaSrcWithFallback(img, originalUrl);
        return;
      }
      img.src = imageSrc || originalUrl;
    }

    function isUsableImageDataUrl(cached) {
      if (typeof cached !== 'string' || !cached.startsWith('data:image/')) return false;
      const comma = cached.indexOf(',');
      if (comma < 0) return false;
      return cached.length - comma > 64;
    }

    async function resolveCachedImageSrc(url, storageKey) {
      if (storageUtils.isSVG(url)) {
        return { imageSrc: url, measured: 0, blobUrl: null };
      }

      if (typeof MeishinkanAssets?.blobUrlFromCache === 'function') {
        const fromCache = await MeishinkanAssets.blobUrlFromCache(url);
        if (fromCache) {
          return { imageSrc: fromCache.url, measured: fromCache.size, blobUrl: fromCache.url };
        }
      }

      try {
        const cached = await storageUtils.readCachedDataUrl(storageKey);
        if (isUsableImageDataUrl(cached)) {
          if (typeof MeishinkanAssets?.seedAssetCacheFromDataUrl === 'function') {
            MeishinkanAssets.seedAssetCacheFromDataUrl(url, cached);
          }
          return { imageSrc: cached, measured: 0, blobUrl: null };
        }
      } catch (e) { /* ignore */ }

      try {
        const response =
          typeof fetchAsset === 'function' && MeishinkanAssets?.isCatboxUrl?.(url)
            ? await fetchAsset(url, { mode: 'cors' })
            : await fetch(url, { mode: 'cors' });
        if (response && response.ok) {
          const blob = await response.blob();
          if (blob && blob.size >= 32) {
            const blobUrl = URL.createObjectURL(blob);
            return { imageSrc: blobUrl, measured: blob.size, blobUrl };
          }
        }
      } catch (e) { /* ignore */ }

      return { imageSrc: url, measured: 0, blobUrl: null };
    }

    // 全局loadImage函数（供设置界面使用）
    async function loadImageGlobal(url, assetName, assetId) {
      try {
        const storageKey = `img_${assetId}`;
        const resolved = await resolveCachedImageSrc(url, storageKey);

        return new Promise((resolve) => {
          const img = new Image();
          if (!storageUtils.isSVG(url)) {
            img.crossOrigin = 'anonymous';
          }

          img.onload = () => {
            if (resolved.blobUrl) URL.revokeObjectURL(resolved.blobUrl);
            const resource = allResources.find(r => r.id === assetId);
            if (resource) {
              resource.loaded = true;
              resource.failed = false;
            }
            resolve(true);
          };
          img.onerror = () => {
            if (resolved.blobUrl) URL.revokeObjectURL(resolved.blobUrl);
            warnWithTag('WARN', `图片资源加载失败: ${url}`);
            const resource = allResources.find(r => r.id === assetId);
            if (resource) {
              resource.loaded = false;
              resource.failed = true;
            }
            resolve(false);
          };
          applyResolvedImageSrc(img, url, resolved.imageSrc);
        });
      } catch (error) {
        warnWithTag('WARN', `加载图片失败: ${url}`, error);
        const resource = allResources.find(r => r.id === assetId);
        if (resource) {
          resource.loaded = false;
          resource.failed = true;
        }
        return false;
      }
    }

    // 加载所有素材
    function loadAllAssets() {
      return new Promise((resolve, reject) => {
        const loadingScreen = document.getElementById('loading-screen');
        const progressMask = document.getElementById('loading-progress-mask');
        const progressBar = document.getElementById('loading-progress-bar');
        const resourceName = document.getElementById('loading-resource-name');
        const loadingPct = document.getElementById('loading-pct');
        const loadingSize = document.getElementById('loading-size');
        const loadingLogoWrap = document.getElementById('loading-logo-wrap');
        const loadingTrack = document.getElementById('loading-track');

        const placeLoadingMascot = (percent) => {
          if (!loadingLogoWrap || !loadingTrack) return;
          const max = Math.max(0, loadingTrack.clientWidth - loadingLogoWrap.offsetWidth);
          loadingLogoWrap.style.left = `${Math.round(Math.max(0, Math.min(1, percent)) * max)}px`;
        };

        const formatBytes = (n) => {
          if (!Number.isFinite(n) || n < 0) return '--';
          const units = ['B', 'KB', 'MB', 'GB'];
          let i = 0;
          let v = n;
          while (v >= 1024 && i < units.length - 1) {
            v /= 1024;
            i += 1;
          }
          const digits = i === 0 ? 0 : (v >= 10 ? 1 : 2);
          return `${v.toFixed(digits)} ${units[i]}`;
        };

        const dataUrlBytes = (s) => {
          if (typeof s !== 'string' || !s.startsWith('data:')) return 0;
          const comma = s.indexOf(',');
          if (comma < 0) return 0;
          const payload = s.slice(comma + 1);
          const pad = payload.endsWith('==') ? 2 : (payload.endsWith('=') ? 1 : 0);
          return Math.max(0, Math.floor(payload.length * 3 / 4) - pad);
        };

        // 使用统一的资源列表构建函数
        const allAssets = buildResourceList();

        // 保存到全局变量（含 CG 元数据，供 getCGUrl 查找）
        allResources = allAssets.map((asset, index) => ({
          ...asset,
          id: `resource_${index}`,
          loaded: false,
          failed: false
        }));

        const assets = SKIP_CG_PRELOAD
          ? allAssets.filter(asset => asset.category !== 'CG')
          : allAssets;
        if (SKIP_CG_PRELOAD) {
          console.info(`[LOADING] 已跳过 ${allAssets.length - assets.length} 个 CG 资源的预加载`);
        }

        let loaded = 0;
        const total = assets.length;
        const failedAssets = []; // 记录加载失败的资源
        let downloadedBytes = 0;
        const sizeByUrl = new Map();
        const logoImg = loadingLogoWrap && loadingLogoWrap.querySelector('.loading-logo');
        if (logoImg) {
          logoImg.addEventListener('load', () => placeLoadingMascot(loaded / Math.max(1, total)));
        }
        window.addEventListener('resize', () => placeLoadingMascot(loaded / Math.max(1, total)));

        const estimatedTotalBytes = () => {
          let known = 0;
          sizeByUrl.forEach((v) => { known += v; });
          const counted = sizeByUrl.size;
          if (counted >= total) return known;
          if (counted === 0) return 0;
          return known + (known / counted) * (total - counted);
        };

        const renderSize = () => {
          if (!loadingSize) return;
          const totalEst = estimatedTotalBytes();
          loadingSize.textContent = `${formatBytes(downloadedBytes)} / ${totalEst > 0 ? formatBytes(totalEst) : '--'}`;
        };

        const creditDownload = (url, measured) => {
          const bytes = sizeByUrl.get(url) || measured || 0;
          if (bytes > 0 && !sizeByUrl.has(url)) sizeByUrl.set(url, bytes);
          downloadedBytes += bytes;
        };

        const probeCachedLength = async (url) => {
          if (!url || typeof MeishinkanAssets?.cachedAssetSize !== 'function') return 0;
          try {
            return await MeishinkanAssets.cachedAssetSize(url);
          } catch (_) {
            return 0;
          }
        };

        (async () => {
          const queue = assets.slice();
          const workers = Array.from({ length: Math.min(8, queue.length) }, async () => {
            while (queue.length) {
              const asset = queue.shift();
              if (!asset || sizeByUrl.has(asset.url)) continue;
              const n = await probeCachedLength(asset.url);
              if (n > 0 && !sizeByUrl.has(asset.url)) {
                sizeByUrl.set(asset.url, n);
                renderSize();
              }
            }
          });
          await Promise.all(workers);
          renderSize();
        })();

        const updateProgress = (currentAsset) => {
          const percent = loaded / total;
          const percentRounded = Math.round(percent * 100);

          // 使用遮罩控制显示范围（从右到左逐渐显示，平头效果）
          progressMask.style.clipPath = `inset(0 ${(1 - percent) * 100}% 0 0)`;

          // 动态颜色渐变：0-33.33%绿色，33.33-66.66%黄色，66.66-100%红色
          // 背景位置从100%（全绿）逐渐移动到0%（全红）
          let bgPosition;
          if (percent <= 0.3333) {
            // 绿色阶段：背景位置从100%到66.67%
            bgPosition = 100 - (percent / 0.3333) * 33.33;
          } else if (percent <= 0.6666) {
            // 黄色阶段：背景位置从66.67%到33.34%
            bgPosition = 66.67 - ((percent - 0.3333) / 0.3333) * 33.33;
          } else {
            // 红色阶段：背景位置从33.34%到0%
            bgPosition = 33.34 - ((percent - 0.6666) / 0.3334) * 33.34;
          }
          progressBar.style.backgroundPosition = `${bgPosition}% 0`;

          if (loadingPct) loadingPct.textContent = `${percentRounded}%`;
          placeLoadingMascot(percent);
          renderSize();
          if (resourceName) {
            resourceName.textContent = currentAsset && currentAsset.name ? currentAsset.name : '';
          }
        };

        const checkComplete = () => {
          if (loaded === total) {
            resourceName.textContent = '加载完成！';
            if (loadingPct) loadingPct.textContent = '100%';
            placeLoadingMascot(1);
            renderSize();
            playIntroBgm();
            setTimeout(() => {
              loadingScreen.classList.add('hidden');
              // 延迟一点再resolve，让淡出动画完成
              setTimeout(() => {
                // 如果有失败的资源，显示错误界面
                if (failedAssets.length > 0) {
                  showErrorOverlay(failedAssets);
                }
                resolve();
              }, 1000);
            }, 500);
          }
        };

        const loadVideo = async (url, assetName) => {
          let blobUrl = null;
          let measured = sizeByUrl.get(url) || 0;
          if (typeof MeishinkanAssets?.blobUrlFromCache === 'function') {
            const fromCache = await MeishinkanAssets.blobUrlFromCache(url);
            if (fromCache) {
              blobUrl = fromCache.url;
              measured = fromCache.size || measured;
            }
          }
          if (!blobUrl) {
            try {
              const response =
                typeof fetchAsset === 'function' && MeishinkanAssets?.isCatboxUrl?.(url)
                  ? await fetchAsset(url, { mode: 'cors' })
                  : await fetch(url, { mode: 'cors' });
              if (response && response.ok) {
                const blob = await response.blob();
                blobUrl = URL.createObjectURL(blob);
                measured = blob.size || measured;
              }
            } catch (e) { /* 回退到元素加载 */ }
          }
          return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'auto';
            video.oncanplaythrough = () => {
              if (blobUrl) URL.revokeObjectURL(blobUrl);
              resolve({ ok: true, bytes: measured });
            };
            video.onerror = () => {
              if (blobUrl) URL.revokeObjectURL(blobUrl);
              warnWithTag('WARN', `视频资源加载失败: ${url}`);
              failedAssets.push(assetName);
              resolve({ ok: false, bytes: 0 });
            };
            if (blobUrl) {
              video.src = blobUrl;
            } else if (typeof setMediaSrcWithFallback === 'function' && MeishinkanAssets?.isCatboxUrl?.(url)) {
              setMediaSrcWithFallback(video, url);
            } else {
              video.src = url;
            }
          });
        };

        const loadImage = async (url, assetName, assetId) => {
          try {
            const storageKey = `img_${assetId}`;
            const resolved = await resolveCachedImageSrc(url, storageKey);
            let measured = resolved.measured;
            if (!measured && resolved.imageSrc && resolved.imageSrc.startsWith('data:')) {
              measured = dataUrlBytes(resolved.imageSrc);
            }

            return new Promise((resolve) => {
              const img = new Image();
              if (!storageUtils.isSVG(url)) {
                img.crossOrigin = 'anonymous';
              }
              let retried = false;

              img.onload = () => {
                if (resolved.blobUrl) URL.revokeObjectURL(resolved.blobUrl);
                const resource = allResources.find(r => r.id === assetId);
                if (resource) resource.loaded = true;
                resolve({ ok: true, bytes: measured || sizeByUrl.get(url) || 0 });
              };
              img.onerror = () => {
                if (!retried) {
                  retried = true;
                  if (resolved.blobUrl) {
                    URL.revokeObjectURL(resolved.blobUrl);
                    resolved.blobUrl = null;
                  }
                  if (typeof MeishinkanAssets?.deleteAssetCache === 'function') {
                    MeishinkanAssets.deleteAssetCache(url);
                  }
                  if (typeof setMediaSrcWithFallback === 'function' && MeishinkanAssets?.isCatboxUrl?.(url)) {
                    setMediaSrcWithFallback(img, url);
                    return;
                  }
                }
                if (resolved.blobUrl) URL.revokeObjectURL(resolved.blobUrl);
                warnWithTag('WARN', `图片资源加载失败: ${url}`);
                failedAssets.push(assetName);
                const resource = allResources.find(r => r.id === assetId);
                if (resource) {
                  resource.loaded = false;
                  resource.failed = true;
                }
                resolve({ ok: false, bytes: 0 });
              };
              applyResolvedImageSrc(img, url, resolved.imageSrc);
            });
          } catch (error) {
            warnWithTag('WARN', `加载图片失败: ${url}`, error);
            failedAssets.push(assetName);
            const resource = allResources.find(r => r.id === assetId);
            if (resource) {
              resource.loaded = false;
              resource.failed = true;
            }
            return { ok: false, bytes: 0 };
          }
        };

        (async () => {
          const queue = assets.slice();
          const workers = Array.from({ length: Math.min(6, Math.max(1, queue.length)) }, async () => {
            while (queue.length) {
              const asset = queue.shift();
              if (!asset) continue;
              updateProgress(asset);
              let result = { ok: false, bytes: 0 };
              const resource = allResources.find(r => r.url === asset.url && r.name === asset.name);
              const assetId = resource ? resource.id : `resource_${assets.indexOf(asset)}`;
              if (asset.url.endsWith('.webm') || asset.type === 'video') {
                result = await loadVideo(asset.url, asset.name);
              } else {
                result = await loadImage(asset.url, asset.name, assetId);
              }
              loaded++;
              creditDownload(asset.url, result.bytes);
              updateProgress(asset);
              checkComplete();
            }
          });
          await Promise.all(workers);
        })();

        setTimeout(() => {
          if (loaded < total) {
            warnWithTag('WARN', '部分资源加载超时，继续进入游戏');
            loadingScreen.classList.add('hidden');
            resolve();
          }
        }, 120000);
      });
    }

    // 显示错误提示界面
    function showErrorOverlay(failedAssets) {
      const errorOverlay = document.getElementById('error-overlay');
      const errorListContainer = document.getElementById('error-list-container');

      if (!errorOverlay || !errorListContainer) return;

      // 清空列表
      errorListContainer.innerHTML = '';

      // 添加失败的资源项
      failedAssets.forEach(assetName => {
        const item = document.createElement('div');
        item.className = 'error-resource-item';
        item.textContent = assetName;
        errorListContainer.appendChild(item);
      });

      // 显示错误界面
      errorOverlay.classList.remove('hidden');
    }

    // 错误弹窗退出按钮
    const errorCloseBtn = document.getElementById('error-close-btn');
    if (errorCloseBtn) {
      errorCloseBtn.addEventListener('click', () => {
        const errorOverlay = document.getElementById('error-overlay');
        if (errorOverlay) {
          errorOverlay.classList.add('hidden');
        }
      });
    }

    // ========== 公共工具函数 ==========

    // 创建弹窗overlay
    function createDialogOverlay(id, zIndex = 20000) {
      const overlay = document.createElement('div');
      overlay.id = id;
      overlay.className = 'dialog-overlay';
      overlay.style.zIndex = String(zIndex);
      return overlay;
    }

    function createDialog(width = '600px', minHeight = '220px', maxWidth = null) {
      const dialog = document.createElement('div');
      dialog.className = 'dialog-content fp-panel';
      dialog.style.width = width;
      dialog.style.minHeight = minHeight;
      if (maxWidth) dialog.style.maxWidth = maxWidth;
      return dialog;
    }

    // 统一的弹窗显示函数
    function showDialog(options) {
      const {
        id,
        zIndex = 20000,
        width = '600px',
        minHeight = '300px',
        maxWidth = null,
        title = null,
        content = null,
        buttons = [],
        showCloseButton = true,
        onClose = null,
        customContent = null
      } = options;

      // 检查是否已有弹窗，如果有则先关闭
      const existingOverlay = document.getElementById(id);
      if (existingOverlay) {
        existingOverlay.remove();
      }

      const overlay = createDialogOverlay(id, zIndex);
      const dialog = createDialog(width, minHeight, maxWidth);
      const closeDialog = createCloseDialogFunction(overlay, dialog);

      // 添加关闭按钮
      if (showCloseButton) {
        const closeBtn = createCloseButton();
        closeBtn.addEventListener('click', () => {
          closeDialog();
          if (onClose) onClose();
        });
        dialog.appendChild(closeBtn);
      }

      // 添加半透明背景层
      const textBg = createTextBackground();
      dialog.appendChild(textBg);

      // 添加标题
      if (title) {
        const titleElement = createTextContent(title, '#fff', '20px');
        titleElement.style.marginBottom = '20px';
        titleElement.style.textAlign = 'left';
        dialog.appendChild(titleElement);
      }

      // 添加内容
      if (content) {
        const contentElement = createTextContent(content);
        dialog.appendChild(contentElement);
      }

      // 添加自定义内容
      if (customContent) {
        dialog.appendChild(customContent);
      }

      // 添加按钮
      if (buttons.length > 0) {
        const buttonContainer = createButtonContainer();
        buttons.forEach(btnConfig => {
          const { text, onClick, style = 'common' } = btnConfig;
          let btn;
          if (style === 'wood') {
            btn = createWoodButton(text, () => {
              closeDialog();
              if (onClick) onClick();
            });
          } else {
            btn = createCommonButton(text, () => {
              closeDialog();
              if (onClick) onClick();
            });
          }
          buttonContainer.appendChild(btn);
        });
        dialog.appendChild(buttonContainer);
      }

      // 点击背景关闭弹窗
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeDialog();
          if (onClose) onClose();
        }
      });

      overlay.appendChild(dialog);
      document.body.appendChild(overlay);

      return { overlay, dialog, closeDialog };
    }

    // 创建关闭按钮（右上角）
    function createCloseButton() {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'settings-close-btn';
      closeBtn.title = '关闭';
      closeBtn.type = 'button';
      return closeBtn;
    }

    function createTextBackground() {
      const textBg = document.createElement('div');
      textBg.className = 'fp-panel-frame';
      return textBg;
    }

    function createTextContent(text) {
      const textContent = document.createElement('div');
      textContent.className = 'fp-dialog-text';
      textContent.textContent = text;
      return textContent;
    }

    function createButtonContainer() {
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'fp-dialog-actions';
      return buttonContainer;
    }

    function createWoodButton(text, onClick) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = text;
      btn.className = 'fp-btn data-storage-wood-btn';
      if (onClick) btn.addEventListener('click', onClick);
      return btn;
    }

    function createCommonButton(text, onClick, options = {}) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = text;
      btn.className = 'fp-btn';
      if (options.marginTop) btn.style.marginTop = options.marginTop;
      if (onClick) btn.addEventListener('click', onClick);
      return btn;
    }

    // 创建关闭弹窗函数
    function createCloseDialogFunction(overlay, dialog) {
      return () => {
        overlay.classList.add('is-leaving');
        setTimeout(() => {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }, 280);
      };
    }

    // 创建DOM元素并设置样式
    function createElementWithStyle(tag, className, style, textContent) {
      const element = document.createElement(tag);
      if (className) element.className = className;
      if (style) element.style.cssText = style;
      if (textContent !== undefined) element.textContent = textContent;
      return element;
    }

    // ========== 设置界面功能 ==========

    // 当前菜单状态
    let currentMenuLevel = 'main'; // main, category, resource
    let currentCategory = null;
    let selectAllState = false; // false=未全选, true=已全选

    // 显示指定菜单（在资源列表界面内）
    function showResourceMenu(level) {
      const resourceMenu = document.getElementById('settings-resource-menu');
      const actions = document.getElementById('settings-actions');
      currentMenuLevel = level === 'category' ? 'resource' : level;
      if (resourceMenu) resourceMenu.classList.remove('hidden');
      if (actions) actions.classList.remove('hidden');
    }

    function switchSettingsTab(tab) {
      const nextTab = tab || 'resources';
      document.querySelectorAll('#settings-overlay .settings-tab').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.tab === nextTab);
      });
      document.querySelectorAll('#settings-overlay .settings-pane').forEach((pane) => {
        pane.classList.toggle('active', pane.dataset.pane === nextTab);
      });
      if (nextTab === 'resources') {
        const activeCat = document.querySelector('#pane-resources .settings-subtab.active')
          || document.querySelector('#pane-resources .settings-subtab');
        if (activeCat) {
          const category = activeCat.getAttribute('data-category');
          if (category) renderCategoryResourceList(category);
        }
        showResourceMenu('resource');
      }
      if (nextTab === 'system') {
        const cur = document.querySelector('#pane-system .settings-subtab.active');
        switchSystemSub((cur && cur.getAttribute('data-sub')) || 'api');
        if (window.妹神官_settings_api && typeof window.妹神官_settings_api.init === 'function') {
          window.妹神官_settings_api.init();
        }
        if (window.妹神官_settings_preset && typeof window.妹神官_settings_preset.init === 'function') {
          window.妹神官_settings_preset.init();
        }
        if (window.妹神官_settings_worldbook && typeof window.妹神官_settings_worldbook.init === 'function') {
          window.妹神官_settings_worldbook.init();
        }
        if (window.妹神官_settings_variable && typeof window.妹神官_settings_variable.init === 'function') {
          window.妹神官_settings_variable.init();
        }
      }
      if (nextTab === 'routes') {
        const cur = document.querySelector('#pane-routes .settings-subtab.active');
        switchRoutesSub((cur && cur.getAttribute('data-sub')) || 'default');
        if (window.妹神官_settings_api && typeof window.妹神官_settings_api.init === 'function') {
          window.妹神官_settings_api.init();
        }
        if (window.妹神官_settings_preset && typeof window.妹神官_settings_preset.init === 'function') {
          window.妹神官_settings_preset.init();
        }
      }
      if (nextTab === 'text-format') {
        initTextFormatControls();
        const typewriterEffectCheckbox = document.getElementById('typewriter-effect-checkbox');
        if (typewriterEffectCheckbox && typewriterEffectCheckbox.checked) {
          startTypewriterTest();
        }
      }
    }

    function openSettingsPanel(tab) {
      const settingsOverlay = document.getElementById('settings-overlay');
      if (!settingsOverlay) return;
      settingsOverlay.classList.remove('hidden');
      const current = document.querySelector('#settings-overlay .settings-tab.active');
      switchSettingsTab(tab || (current && current.dataset.tab) || 'resources');
    }

    // 显示指定菜单（在资源列表界面内）

    // 渲染指定分类的资源列表
    function renderCategoryResourceList(category) {
      const resourceList = document.getElementById('settings-resource-list');
      const menuTitle = document.getElementById('settings-resource-menu-title');
      if (!resourceList) return;

      resourceList.innerHTML = '';
      currentCategory = category;

      if (menuTitle) {
        menuTitle.textContent = `${category} 资源`;
      }

      const categoryResources = allResources.filter(r => r.category === category);
      logWithTag('DEBUG', `渲染 ${category} 资源列表:`, categoryResources.length, '个资源'); // 调试信息

      if (categoryResources.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.style.color = '#ccc';
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.padding = '20px';
        emptyMsg.textContent = '该分类暂无资源';
        resourceList.appendChild(emptyMsg);
        return;
      }

      const itemsContainer = document.createElement('div');
      itemsContainer.className = 'settings-resource-items';

      categoryResources.forEach(resource => {
        const item = document.createElement('div');
        item.className = 'settings-resource-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = resource.id;
        checkbox.checked = false;

        const label = document.createElement('label');
        label.htmlFor = resource.id;
        label.textContent = resource.name;
        if (resource.failed) {
          label.style.color = '#ff6b6b';
          label.textContent += ' (加载失败)';
        } else if (resource.loaded) {
          label.style.color = '#4ade80';
          label.textContent += ' (已加载)';
        }

        item.appendChild(checkbox);
        item.appendChild(label);
        item.addEventListener('click', (e) => {
          if (e.target === checkbox || e.target === label) return;
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        });
        itemsContainer.appendChild(item);
      });

      resourceList.appendChild(itemsContainer);
      selectAllState = false;
      updateSelectAllButtonState();

      // 确保在资源列表项上时也可以通过鼠标滚轮滚动
      // 在滚动容器和所有子元素上添加滚轮事件监听器
      const handleWheel = (e) => {
        // 检查是否到达边界
        const atTop = itemsContainer.scrollTop <= 0;
        const atBottom = itemsContainer.scrollTop + itemsContainer.clientHeight >= itemsContainer.scrollHeight - 1;

        // 如果到达边界且继续向边界方向滚动，阻止默认行为以避免页面滚动
        if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
          e.preventDefault();
        }
        // 否则允许滚动（默认行为）
      };

      // 增强滚轮滚动功能（替换原来的handleWheel）
      itemsContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        // 增强滚轮滚动，滚动更多距离
        const scrollAmount = e.deltaY * 2; // 增加滚动速度
        itemsContainer.scrollTop += scrollAmount;
      }, { passive: false });

      // 添加拖拽滚动功能
      let isDragging = false;
      let startY = 0;
      let startScrollTop = 0;

      // 开始拖拽
      const startDrag = (e) => {
        // 只有在空区域点击时才允许拖拽（避免干扰checkbox）
        if (e.target.closest('.settings-resource-item input[type="checkbox"], .settings-resource-item label')) {
          return; // 避免拖拽checkbox和label
        }

        isDragging = true;
        startY = e.clientY;
        startScrollTop = itemsContainer.scrollTop;

        // 设置拖拽样式
        itemsContainer.classList.add('dragging');
        document.body.style.userSelect = 'none';

        // 更新滚动指示器
        scrollIndicator.textContent = '拖拽中...';
        scrollIndicator.style.opacity = '1';

        logWithTag('DEBUG', '开始拖拽:', { startY, startScrollTop }); // 调试信息
        e.preventDefault();
      };

      // 拖拽移动
      const drag = (e) => {
        if (!isDragging) return;

        const deltaY = e.clientY - startY;
        const newScrollTop = startScrollTop - deltaY;

        // 边界检查
        const maxScroll = itemsContainer.scrollHeight - itemsContainer.clientHeight;
        logWithTag('DEBUG', '拖拽中:', {
          deltaY,
          newScrollTop,
          currentScrollTop: itemsContainer.scrollTop,
          maxScroll,
          containerHeight: itemsContainer.clientHeight,
          contentHeight: itemsContainer.scrollHeight,
          canScroll: maxScroll > 0
        }); // 调试信息

        if (newScrollTop >= 0 && newScrollTop <= maxScroll) {
          itemsContainer.scrollTop = newScrollTop;
        }

        e.preventDefault();
      };

      // 结束拖拽
      const endDrag = () => {
        if (!isDragging) return;

        isDragging = false;
        itemsContainer.classList.remove('dragging');
        document.body.style.userSelect = '';

        // 更新滚动指示器
        scrollIndicator.textContent = '可拖拽滚动';
        clearTimeout(scrollIndicator.hideTimer);
        scrollIndicator.hideTimer = setTimeout(() => {
          scrollIndicator.style.opacity = '0';
        }, 2000);
      };

      // 添加事件监听器
      itemsContainer.addEventListener('mousedown', startDrag);
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', endDrag);

      // 触摸事件支持（简化版）
      let touchStartY = 0;
      let touchStartScrollTop = 0;

      itemsContainer.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          const touch = e.touches[0];
          touchStartY = touch.clientY;
          touchStartScrollTop = itemsContainer.scrollTop;
        }
      }, { passive: true });

      itemsContainer.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) {
          const touch = e.touches[0];
          const deltaY = touch.clientY - touchStartY;
          const newScrollTop = touchStartScrollTop - deltaY;

          // 边界检查
          if (newScrollTop >= 0 && newScrollTop <= itemsContainer.scrollHeight - itemsContainer.clientHeight) {
            itemsContainer.scrollTop = newScrollTop;
          }
        }
      }, { passive: true });

      // 设置默认样式
      itemsContainer.classList.add('grabbable');

      // 根据内容高度动态调整容器高度
      const adjustContainerHeight = () => {
        const contentHeight = itemsContainer.scrollHeight;
        const maxAllowedHeight = Math.min(400, window.innerHeight * 0.6);

        logWithTag('DEBUG', '调整容器高度:', {
          contentHeight,
          maxAllowedHeight,
          containerHeight: itemsContainer.clientHeight,
          scrollHeight: itemsContainer.scrollHeight
        });

        if (contentHeight <= maxAllowedHeight) {
          // 内容不超出限制，设置为auto高度
          itemsContainer.style.maxHeight = 'none';
          itemsContainer.style.height = 'auto';
          logWithTag('DEBUG', '内容高度正常，无需滚动，设置为auto高度');
        } else {
          // 内容超出，限制高度并启用滚动
          itemsContainer.style.maxHeight = `${maxAllowedHeight}px`;
          itemsContainer.style.height = `${maxAllowedHeight}px`;
          logWithTag('DEBUG', '内容超出，限制高度并启用滚动:', maxAllowedHeight);
        }
      };

      // 初始调整（延迟执行，确保内容已渲染）
      setTimeout(adjustContainerHeight, 200);

      // 窗口大小改变时重新调整
      const handleResize = () => {
        setTimeout(adjustContainerHeight, 100);
      };
      window.addEventListener('resize', handleResize);

      // 添加视觉反馈，显示滚动状态
      const scrollIndicator = document.createElement('div');
      scrollIndicator.className = 'scroll-indicator';
      scrollIndicator.textContent = '可拖拽滚动';
      itemsContainer.style.position = 'relative';
      itemsContainer.appendChild(scrollIndicator);

      // 显示/隐藏滚动指示器
      const showScrollIndicator = () => {
        scrollIndicator.style.opacity = '1';
        clearTimeout(scrollIndicator.hideTimer);
        scrollIndicator.hideTimer = setTimeout(() => {
          scrollIndicator.style.opacity = '0';
        }, 2000);
      };

      const hideScrollIndicator = () => {
        clearTimeout(scrollIndicator.hideTimer);
        scrollIndicator.hideTimer = setTimeout(() => {
          scrollIndicator.style.opacity = '0';
        }, 500);
      };

      itemsContainer.addEventListener('mouseenter', showScrollIndicator);
      itemsContainer.addEventListener('mouseleave', hideScrollIndicator);
      itemsContainer.addEventListener('mousedown', showScrollIndicator);
      itemsContainer.addEventListener('wheel', showScrollIndicator);
    }

    // 显示/隐藏资源统计（切换功能）
    function toggleResourceStats() {
      const statsInfo = document.getElementById('settings-stats-info');
      const statsBtn = document.getElementById('settings-stats-btn');
      if (!statsInfo || !statsBtn) return;

      // 如果当前是隐藏状态，显示并更新内容
      if (statsInfo.classList.contains('hidden')) {
        const total = allResources.length;
        const loaded = allResources.filter(r => r.loaded).length;
        const failed = allResources.filter(r => r.failed).length;
        const successRate = total > 0 ? ((loaded / total) * 100).toFixed(2) : 0;
        const failRate = total > 0 ? ((failed / total) * 100).toFixed(2) : 0;

        // 计算存储大小
        const storageSize = storageUtils.getStorageSize();
        const storageSizeMB = (storageSize / 1024 / 1024).toFixed(2);
        const storageSizeKB = (storageSize / 1024).toFixed(2);
        const storageSizeText = storageSize > 1024 * 1024 ? `${storageSizeMB} MB` : `${storageSizeKB} KB`;

        statsInfo.innerHTML = `
          <div class="settings-stats-info-item"><strong>总资源数：</strong>${total}</div>
          <div class="settings-stats-info-item"><strong>已加载：</strong>${loaded} (${successRate}%)</div>
          <div class="settings-stats-info-item"><strong>加载失败：</strong>${failed} (${failRate}%)</div>
          <div class="settings-stats-info-item"><strong>浏览器缓存：</strong>${storageSizeText}</div>
        `;

        statsInfo.classList.remove('hidden');
        statsBtn.textContent = '隐藏资源统计';
      } else {
        // 如果当前是显示状态，隐藏
        statsInfo.classList.add('hidden');
        statsBtn.textContent = '查看资源统计';
      }
    }

    // 显示资源统计（仅更新内容，不切换显示状态）
    function updateResourceStats() {
      const statsInfo = document.getElementById('settings-stats-info');
      if (!statsInfo || statsInfo.classList.contains('hidden')) return;

      const total = allResources.length;
      const loaded = allResources.filter(r => r.loaded).length;
      const failed = allResources.filter(r => r.failed).length;
      const successRate = total > 0 ? ((loaded / total) * 100).toFixed(2) : 0;
      const failRate = total > 0 ? ((failed / total) * 100).toFixed(2) : 0;

      // 计算存储大小
      const storageSize = storageUtils.getStorageSize();
      const storageSizeMB = (storageSize / 1024 / 1024).toFixed(2);
      const storageSizeKB = (storageSize / 1024).toFixed(2);
      const storageSizeText = storageSize > 1024 * 1024 ? `${storageSizeMB} MB` : `${storageSizeKB} KB`;

      statsInfo.innerHTML = `
        <div class="settings-stats-info-item"><strong>总资源数：</strong>${total}</div>
        <div class="settings-stats-info-item"><strong>已加载：</strong>${loaded} (${successRate}%)</div>
        <div class="settings-stats-info-item"><strong>加载失败：</strong>${failed} (${failRate}%)</div>
        <div class="settings-stats-info-item"><strong>浏览器缓存：</strong>${storageSizeText}</div>
      `;
    }

    // 获取选中的资源
    function getSelectedResources() {
      const checkboxes = document.querySelectorAll('#settings-resource-list input[type="checkbox"]:checked');
      return Array.from(checkboxes).map(cb => {
        return allResources.find(r => r.id === cb.id);
      }).filter(r => r);
    }

    // 重载一次选中资源
    async function reloadSelectedOnce() {
      const selected = getSelectedResources();
      if (selected.length === 0) {
        alert('请先选择要重载的资源');
        return;
      }

      for (const resource of selected) {
        const storageKey = `img_${resource.id}`;
        // 删除缓存
        storageUtils.removeFromStorage(storageKey);
        resource.loaded = false;
        resource.failed = false;

        // 重新加载
        if (resource.type === 'image') {
          await loadImageGlobal(resource.url, resource.name, resource.id);
        }
      }

      if (currentCategory) {
        renderCategoryResourceList(currentCategory);
      }
      updateResourceStats(); // 更新统计信息
      alert(`已重载 ${selected.length} 个资源`);
    }

    // 重载选中直到载入完毕
    async function reloadSelectedUntilComplete() {
      const selected = getSelectedResources();
      if (selected.length === 0) {
        alert('请先选择要重载的资源');
        return;
      }

      let attempts = 0;
      const maxAttempts = 5;

      while (attempts < maxAttempts) {
        let allLoaded = true;

        for (const resource of selected) {
          if (!resource.loaded && !resource.failed) {
            const storageKey = `img_${resource.id}`;
            storageUtils.removeFromStorage(storageKey);

            if (resource.type === 'image') {
              const success = await loadImageGlobal(resource.url, resource.name, resource.id);
              if (!success) allLoaded = false;
            }
          } else if (resource.failed) {
            allLoaded = false;
          }
        }

        if (allLoaded) break;
        attempts++;
      }

      if (currentCategory) {
        renderCategoryResourceList(currentCategory);
      }
      updateResourceStats(); // 更新统计信息
      alert(`重载完成，尝试了 ${attempts} 次`);
    }

    // 删除选中资源
    function deleteSelectedResources() {
      const selected = getSelectedResources();
      if (selected.length === 0) {
        alert('请先选择要删除的资源');
        return;
      }

      if (!confirm(`确定要删除 ${selected.length} 个资源的缓存吗？`)) {
        return;
      }

      selected.forEach(resource => {
        const storageKey = `img_${resource.id}`;
        storageUtils.removeFromStorage(storageKey);
        resource.loaded = false;
      });

      if (currentCategory) {
        renderCategoryResourceList(currentCategory);
      }
      updateResourceStats(); // 更新统计信息
      alert(`已删除 ${selected.length} 个资源的缓存`);
    }

    // 全选/全不选功能
    function toggleSelectAll() {
      const checkboxes = document.querySelectorAll('#settings-resource-list input[type="checkbox"]');
      selectAllState = !selectAllState;

      checkboxes.forEach(cb => {
        cb.checked = selectAllState;
      });

      const selectAllBtn = document.getElementById('settings-select-all-btn');
      if (selectAllBtn) {
        selectAllBtn.textContent = selectAllState ? '全不选' : '全选';
      }
    }

    // 反转选择
    function invertSelection() {
      const checkboxes = document.querySelectorAll('#settings-resource-list input[type="checkbox"]');
      checkboxes.forEach(cb => {
        cb.checked = !cb.checked;
      });
      updateSelectAllButtonState();
    }

    // 更新全选按钮状态
    function updateSelectAllButtonState() {
      const checkboxes = document.querySelectorAll('#settings-resource-list input[type="checkbox"]');
      const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
      const selectAllBtn = document.getElementById('settings-select-all-btn');

      if (checkboxes.length === 0) {
        selectAllState = false;
      } else {
        selectAllState = checkedCount === checkboxes.length;
      }

      if (selectAllBtn) {
        selectAllBtn.textContent = selectAllState ? '全不选' : '全选';
      }
    }

    // Option按钮点击事件（打开设置菜单，原设置按钮功能）
    const optionBtn = document.getElementById('btn-option');
    if (optionBtn) {
      optionBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openSettingsPanel();
      });
    }

    // 资源列表按钮
    const resourceListBtn = document.getElementById('settings-resource-list-btn');
    if (resourceListBtn) {
      resourceListBtn.addEventListener('click', () => {
        switchSettingsTab('resources');
      });
    }

    // 正文格式按钮
    const textFormatBtn = document.getElementById('settings-text-format-btn');
    if (textFormatBtn) {
      textFormatBtn.addEventListener('click', () => {
        switchSettingsTab('text-format');
      });
    }

    // 数据存储按钮
    const dataStorageBtn = document.getElementById('settings-data-storage-btn');
    if (dataStorageBtn) {
      dataStorageBtn.addEventListener('click', () => {
        switchSettingsTab('data-storage');
      });
    }

    function switchSystemSub(subId) {
      const pane = document.getElementById('pane-system');
      if (!pane || !subId) return;
      pane.querySelectorAll('.settings-subtab').forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-sub') === subId);
      });
      pane.querySelectorAll('.settings-subpane').forEach((sub) => {
        sub.classList.toggle('active', sub.getAttribute('data-subpane') === subId);
      });
    }

    function switchRoutesSub(subId) {
      const pane = document.getElementById('pane-routes');
      if (!pane || !subId) return;
      pane.querySelectorAll('.settings-subtab').forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-sub') === subId);
      });
      pane.querySelectorAll('.settings-subpane').forEach((sub) => {
        sub.classList.toggle('active', sub.getAttribute('data-subpane') === subId);
      });
    }

    const systemTabBtn = document.getElementById('settings-system-btn');
    if (systemTabBtn) {
      systemTabBtn.addEventListener('click', () => {
        switchSettingsTab('system');
      });
    }

    const routesTabBtn = document.getElementById('settings-routes-btn');
    if (routesTabBtn) {
      routesTabBtn.addEventListener('click', () => {
        switchSettingsTab('routes');
      });
    }

    const systemSubnav = document.getElementById('settings-system-subnav');
    if (systemSubnav) {
      systemSubnav.addEventListener('click', (e) => {
        const btn = e.target.closest('.settings-subtab');
        if (!btn) return;
        switchSystemSub(btn.getAttribute('data-sub'));
      });
    }

    const routesSubnav = document.getElementById('settings-routes-subnav');
    if (routesSubnav) {
      routesSubnav.addEventListener('click', (e) => {
        const btn = e.target.closest('.settings-subtab');
        if (!btn) return;
        switchRoutesSub(btn.getAttribute('data-sub'));
      });
    }

    ['btn-regex-add'].forEach((id) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('click', () => {
        showArchiveNotification('该功能稍后接入', 'info');
      });
    });

    // 导出所有存档数据
    const dataStorageExportBtn = document.getElementById('data-storage-export-btn');
    if (dataStorageExportBtn) {
      dataStorageExportBtn.addEventListener('click', async () => {
        try {
          const archives = await storageUtils.archivesDB.getAllArchives();
          if (archives.length === 0) {
            showArchiveNotification('没有存档数据可导出', 'error');
            return;
          }

          // 创建导出数据对象
          const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            totalArchives: archives.length,
            archives: archives.map(archive => ({
              name: archive.name,
              timestamp: archive.timestamp,
              data: archive.data
            }))
          };

          // 转换为JSON字符串
          const jsonString = JSON.stringify(exportData, null, 2);

          // 创建Blob对象
          const blob = new Blob([jsonString], { type: 'application/json' });

          // 创建下载链接
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `存档数据_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          showArchiveNotification(`成功导出 ${archives.length} 个存档数据`, 'success');
        } catch (error) {
          errorWithTag('EXPORT', '导出存档数据失败', error);
          showArchiveNotification('导出存档数据失败，请查看控制台错误信息。', 'error');
        }
      });
    }

    let fpConfirmOnYes = null;

    function closeConfirmDialog() {
      const box = document.getElementById('fp-confirm');
      if (!box) return;
      box.classList.remove('open');
      box.setAttribute('aria-hidden', 'true');
      box.setAttribute('inert', '');
      fpConfirmOnYes = null;
    }

    function showConfirmDialog(message, onYes, options) {
      const box = document.getElementById('fp-confirm');
      const msg = document.getElementById('fp-confirm-msg');
      const yesBtn = document.getElementById('fp-confirm-yes');
      const noBtn = document.getElementById('fp-confirm-no');
      if (!box || !msg) {
        if (window.confirm(message)) onYes && onYes();
        return;
      }
      msg.textContent = message;
      if (yesBtn) yesBtn.textContent = (options && options.yesText) || '确定';
      if (noBtn) noBtn.textContent = (options && options.noText) || '取消';
      fpConfirmOnYes = onYes;
      box.classList.add('open');
      box.removeAttribute('inert');
      box.setAttribute('aria-hidden', 'false');
    }

    (function bindConfirmDialog() {
      const box = document.getElementById('fp-confirm');
      const yesBtn = document.getElementById('fp-confirm-yes');
      const noBtn = document.getElementById('fp-confirm-no');
      if (yesBtn) {
        yesBtn.addEventListener('click', () => {
          const fn = fpConfirmOnYes;
          closeConfirmDialog();
          if (fn) fn();
        });
      }
      if (noBtn) noBtn.addEventListener('click', closeConfirmDialog);
      if (box) {
        box.addEventListener('click', (e) => {
          if (e.target === box) closeConfirmDialog();
        });
      }
    })();

    function showDeleteAllArchivesConfirmDialog(archiveCount, onConfirm) {
      showConfirmDialog(
        `确定删除全部 ${archiveCount} 个存档？\n此操作不可恢复。`,
        onConfirm,
        { yesText: '删除', noText: '取消' }
      );
    }

    // 删除所有存档数据
    const dataStorageDeleteBtn = document.getElementById('data-storage-delete-btn');
    if (dataStorageDeleteBtn) {
      dataStorageDeleteBtn.addEventListener('click', async () => {
        try {
          const archives = await storageUtils.archivesDB.getAllArchives();
          if (archives.length === 0) {
            showArchiveNotification('没有存档数据可删除', 'error');
            return;
          }

          // 显示确认对话框
          showDeleteAllArchivesConfirmDialog(archives.length, async () => {
            try {
              // 删除所有存档
              let deletedCount = 0;
              for (const archive of archives) {
                try {
                  await storageUtils.archivesDB.deleteArchive(archive.name);
                  deletedCount++;
                } catch (error) {
                  errorWithTag('DELETE', `删除存档 ${archive.name} 失败`, error);
                }
              }

              // 清除当前选中状态
              currentArchiveName = null;

              // 刷新存档列表
              await renderSaveArchiveList();

              showArchiveNotification(`成功删除 ${deletedCount} 个存档数据`, 'success');
            } catch (error) {
              errorWithTag('DELETE', '删除所有存档数据失败', error);
              showArchiveNotification('删除存档数据失败，请查看控制台错误信息。', 'error');
            }
          });
        } catch (error) {
          errorWithTag('DELETE', '获取存档列表失败', error);
          showArchiveNotification('获取存档列表失败，请查看控制台错误信息。', 'error');
        }
      });
    }

    // 存储文本格式设置
    let textFormatSettings = {
      aiFontSize: 16,
      aiFontColor: '#ffffff',
      chatFont: 'Microsoft YaHei, 微软雅黑',
      typewriterEffect: false,
      typewriterSpeed: 10,
      lineHeight: 1.6,
      letterSpacing: 0,
      textShadow: true,
      textAlign: 'left',
      minSummaryFloor: 10,
      quickBtnSize: 40,
      toolbarLocked: true,
      hideToolbarInCg: true
    };

    // 从localStorage加载设置
    function loadTextFormatSettings() {
      const saved = localStorage.getItem('textFormatSettings');
      if (saved) {
        try {
          textFormatSettings = { ...textFormatSettings, ...JSON.parse(saved) };
        } catch (e) {
          warnWithTag('WARN', '加载文本格式设置失败:', e);
        }
      }
      applyTextFormatSettings();
    }

    // 保存设置到localStorage
    function saveTextFormatSettings() {
      localStorage.setItem('textFormatSettings', JSON.stringify(textFormatSettings));
      applyTextFormatSettings();
    }

    function refreshCgToolbarClass() {
      const parchment = document.getElementById('game-parchment');
      const cgLayer = document.getElementById('cg-layer');
      if (!parchment) return;
      const hide = textFormatSettings.hideToolbarInCg !== false && cgLayer && cgLayer.classList.contains('show');
      parchment.classList.toggle('is-cg-hide-toolbar', !!hide);
    }

    function applyToolbarSettings() {
      if (window.妹神官_toolbar && window.妹神官_toolbar.setLocked) {
        window.妹神官_toolbar.setLocked(textFormatSettings.toolbarLocked !== false);
      }
      refreshCgToolbarClass();
    }

    // 应用设置到GAL界面
    function applyTextFormatSettings() {
      applyToolbarSettings();
      const dialogueText = document.querySelector('.dialogue-text');
      if (!dialogueText) return;

      dialogueText.style.fontSize = `${textFormatSettings.aiFontSize}px`;
      dialogueText.style.color = textFormatSettings.aiFontColor;
      dialogueText.style.fontFamily = textFormatSettings.chatFont;
      dialogueText.style.lineHeight = textFormatSettings.lineHeight;
      dialogueText.style.letterSpacing = `${textFormatSettings.letterSpacing}px`;
      dialogueText.style.textAlign = textFormatSettings.textAlign;

      if (textFormatSettings.textShadow) {
        dialogueText.style.textShadow = `
          -1px -1px 0 #000,
          1px -1px 0 #000,
          -1px 1px 0 #000,
          1px 1px 0 #000,
          0 0 2px #000
        `;
      } else {
        dialogueText.style.textShadow = 'none';
      }

      const tbBtns = document.querySelectorAll('#gal-toolbar .gal-tb-btn');
      const btnSize = textFormatSettings.quickBtnSize || 40;
      tbBtns.forEach((btn) => {
        btn.style.height = `${btnSize}px`;
        if (!btn.classList.contains('gal-tb-text')) {
          btn.style.width = `${btnSize}px`;
        }
        const svg = btn.querySelector('svg');
        if (svg) {
          const iconSize = Math.round(btnSize * 0.65);
          svg.style.width = `${iconSize}px`;
          svg.style.height = `${iconSize}px`;
        }
      });

      if (window.妹神官_toolbar && window.妹神官_toolbar.layout) {
        window.妹神官_toolbar.layout();
      }
    }

    // 初始化控件值
    function initTextFormatControls() {
      const aiFontSizeSlider = document.getElementById('ai-font-size-slider');
      const aiFontSizeInput = document.getElementById('ai-font-size-input');
      const aiFontColorPicker = document.getElementById('ai-font-color-picker');
      const aiColorR = document.getElementById('ai-color-r');
      const aiColorG = document.getElementById('ai-color-g');
      const aiColorB = document.getElementById('ai-color-b');
      const chatFontSelect = document.getElementById('chat-font-select');
      const typewriterEffectCheckbox = document.getElementById('typewriter-effect-checkbox');
      const typewriterSpeedSlider = document.getElementById('typewriter-speed-slider');
      const typewriterSpeedInput = document.getElementById('typewriter-speed-input');
      const lineHeightSlider = document.getElementById('line-height-slider');
      const lineHeightInput = document.getElementById('line-height-input');
      const letterSpacingSlider = document.getElementById('letter-spacing-slider');
      const letterSpacingInput = document.getElementById('letter-spacing-input');
      const textShadowCheckbox = document.getElementById('text-shadow-checkbox');
      const textAlignSelect = document.getElementById('text-align-select');
      const minSummaryFloorInput = document.getElementById('min-summary-floor-input');
      const quickBtnSizeSlider = document.getElementById('quick-btn-size-slider');
      const quickBtnSizeInput = document.getElementById('quick-btn-size-input');
      const toolbarLockedCheckbox = document.getElementById('toolbar-locked-checkbox');
      const hideToolbarCgCheckbox = document.getElementById('hide-toolbar-cg-checkbox');

      // 设置初始值
      if (aiFontSizeSlider) aiFontSizeSlider.value = textFormatSettings.aiFontSize;
      if (aiFontSizeInput) aiFontSizeInput.value = textFormatSettings.aiFontSize;
      if (aiFontColorPicker) aiFontColorPicker.value = textFormatSettings.aiFontColor;
      if (chatFontSelect) chatFontSelect.value = textFormatSettings.chatFont;
      if (typewriterEffectCheckbox) typewriterEffectCheckbox.checked = textFormatSettings.typewriterEffect;
      if (typewriterSpeedSlider) typewriterSpeedSlider.value = textFormatSettings.typewriterSpeed;
      if (typewriterSpeedInput) typewriterSpeedInput.value = textFormatSettings.typewriterSpeed;
      if (lineHeightSlider) lineHeightSlider.value = textFormatSettings.lineHeight;
      if (lineHeightInput) lineHeightInput.value = textFormatSettings.lineHeight;
      if (letterSpacingSlider) letterSpacingSlider.value = textFormatSettings.letterSpacing;
      if (letterSpacingInput) letterSpacingInput.value = textFormatSettings.letterSpacing;
      if (textShadowCheckbox) textShadowCheckbox.checked = textFormatSettings.textShadow;
      if (textAlignSelect) textAlignSelect.value = textFormatSettings.textAlign;
      if (quickBtnSizeSlider) quickBtnSizeSlider.value = textFormatSettings.quickBtnSize || 48;
      if (quickBtnSizeInput) quickBtnSizeInput.value = textFormatSettings.quickBtnSize || 48;
      if (minSummaryFloorInput) minSummaryFloorInput.value = textFormatSettings.minSummaryFloor;
      if (toolbarLockedCheckbox) toolbarLockedCheckbox.checked = textFormatSettings.toolbarLocked !== false;
      if (hideToolbarCgCheckbox) hideToolbarCgCheckbox.checked = textFormatSettings.hideToolbarInCg !== false;

      // 显示/隐藏条件项
      updateConditionalItems();
    }

    // 更新条件显示项
    function updateConditionalItems() {
      const typewriterEffectCheckbox = document.getElementById('typewriter-effect-checkbox');
      const typewriterSpeedItem = document.getElementById('typewriter-speed-item');
      const typewriterTestItem = document.getElementById('typewriter-test-item');

      if (typewriterEffectCheckbox && typewriterSpeedItem && typewriterTestItem) {
        if (typewriterEffectCheckbox.checked) {
          typewriterSpeedItem.style.display = 'flex';
          typewriterTestItem.style.display = 'flex';
        } else {
          typewriterSpeedItem.style.display = 'none';
          typewriterTestItem.style.display = 'none';
        }
      }
    }

    // 打印机效果测试
    let typewriterTestTimer = null;
    function startTypewriterTest() {
      const testBox = document.getElementById('typewriter-test-box');
      const speedInput = document.getElementById('typewriter-speed-input');
      if (!testBox || !speedInput) return;

      const testText = '原作为BBQ大好き，如有能力请支持原作者';
      const speed = parseInt(speedInput.value) || 10;

      testBox.textContent = '';
      testBox.classList.add('typewriter-active');

      if (typewriterTestTimer) {
        clearInterval(typewriterTestTimer);
      }

      let index = 0;
      typewriterTestTimer = setInterval(() => {
        if (index < testText.length) {
          testBox.textContent = testText.substring(0, index + 1);
          index++;
        } else {
          clearInterval(typewriterTestTimer);
          typewriterTestTimer = null;
          testBox.classList.remove('typewriter-active'); // 移除光标效果
        }
      }, speed);
    }

    // 对话文本的打印机效果定时器
    let dialogueTypewriterTimer = null;

    let dialogueTypewriterResolve = null;

    // 应用打印机效果到对话文本
    function applyTypewriterToDialogue(text, targetElement) {
      return new Promise((resolve) => {
        if (!targetElement) {
          resolve();
          return;
        }

        if (dialogueTypewriterTimer) {
          clearInterval(dialogueTypewriterTimer);
          dialogueTypewriterTimer = null;
        }
        if (dialogueTypewriterResolve) {
          dialogueTypewriterResolve();
          dialogueTypewriterResolve = null;
        }

        if (!textFormatSettings.typewriterEffect) {
          targetElement.textContent = text;
          resolve();
          return;
        }

        const speed = textFormatSettings.typewriterSpeed || 10;
        targetElement.textContent = '';
        targetElement.classList.add('typewriter-active');
        dialogueTypewriterResolve = resolve;

        let index = 0;
        dialogueTypewriterTimer = setInterval(() => {
          if (index < text.length) {
            targetElement.textContent = text.substring(0, index + 1);
            index++;
          } else {
            clearInterval(dialogueTypewriterTimer);
            dialogueTypewriterTimer = null;
            targetElement.classList.remove('typewriter-active');
            const done = dialogueTypewriterResolve;
            dialogueTypewriterResolve = null;
            if (done) done();
          }
        }, speed);
      });
    }

    // 绑定事件监听器
    function bindTextFormatEvents() {
      // AI字体大小
      const aiFontSizeSlider = document.getElementById('ai-font-size-slider');
      const aiFontSizeInput = document.getElementById('ai-font-size-input');
      if (aiFontSizeSlider && aiFontSizeInput) {
        aiFontSizeSlider.addEventListener('input', (e) => {
          const value = parseInt(e.target.value);
          aiFontSizeInput.value = value;
          textFormatSettings.aiFontSize = value;
          saveTextFormatSettings();
        });
        aiFontSizeInput.addEventListener('input', (e) => {
          const value = Math.max(10, Math.min(30, parseInt(e.target.value) || 16));
          aiFontSizeSlider.value = value;
          aiFontSizeInput.value = value;
          textFormatSettings.aiFontSize = value;
          saveTextFormatSettings();
        });
      }

      // AI字体颜色
      const aiFontColorPicker = document.getElementById('ai-font-color-picker');
      if (aiFontColorPicker) {
        aiFontColorPicker.addEventListener('input', (e) => {
          textFormatSettings.aiFontColor = e.target.value;
          saveTextFormatSettings();
        });
      }

      // 聊天字体
      const chatFontSelect = document.getElementById('chat-font-select');
      if (chatFontSelect) {
        chatFontSelect.addEventListener('change', (e) => {
          textFormatSettings.chatFont = e.target.value;
          saveTextFormatSettings();
        });
      }

      // 打印机效果
      const typewriterEffectCheckbox = document.getElementById('typewriter-effect-checkbox');
      if (typewriterEffectCheckbox) {
        typewriterEffectCheckbox.addEventListener('change', (e) => {
          textFormatSettings.typewriterEffect = e.target.checked;
          updateConditionalItems();
          saveTextFormatSettings();
        });
      }

      // 打印机效果速度
      const typewriterSpeedSlider = document.getElementById('typewriter-speed-slider');
      const typewriterSpeedInput = document.getElementById('typewriter-speed-input');
      if (typewriterSpeedSlider && typewriterSpeedInput) {
        typewriterSpeedSlider.addEventListener('input', (e) => {
          const value = parseInt(e.target.value);
          typewriterSpeedInput.value = value;
          textFormatSettings.typewriterSpeed = value;
          saveTextFormatSettings();
          startTypewriterTest();
        });
        typewriterSpeedInput.addEventListener('input', (e) => {
          const value = Math.max(0, Math.min(25, parseInt(e.target.value) || 10));
          typewriterSpeedSlider.value = value;
          typewriterSpeedInput.value = value;
          textFormatSettings.typewriterSpeed = value;
          saveTextFormatSettings();
          startTypewriterTest();
        });
      }

      // 行间距
      const lineHeightSlider = document.getElementById('line-height-slider');
      const lineHeightInput = document.getElementById('line-height-input');
      if (lineHeightSlider && lineHeightInput) {
        lineHeightSlider.addEventListener('input', (e) => {
          const value = parseFloat(e.target.value);
          lineHeightInput.value = value;
          textFormatSettings.lineHeight = value;
          saveTextFormatSettings();
        });
        lineHeightInput.addEventListener('input', (e) => {
          const value = Math.max(1.0, Math.min(3.0, parseFloat(e.target.value) || 1.6));
          lineHeightSlider.value = value;
          lineHeightInput.value = value;
          textFormatSettings.lineHeight = value;
          saveTextFormatSettings();
        });
      }

      // 字间距
      const letterSpacingSlider = document.getElementById('letter-spacing-slider');
      const letterSpacingInput = document.getElementById('letter-spacing-input');
      if (letterSpacingSlider && letterSpacingInput) {
        letterSpacingSlider.addEventListener('input', (e) => {
          const value = parseFloat(e.target.value);
          letterSpacingInput.value = value;
          textFormatSettings.letterSpacing = value;
          saveTextFormatSettings();
        });
        letterSpacingInput.addEventListener('input', (e) => {
          const value = Math.max(-2, Math.min(5, parseFloat(e.target.value) || 0));
          letterSpacingSlider.value = value;
          letterSpacingInput.value = value;
          textFormatSettings.letterSpacing = value;
          saveTextFormatSettings();
        });
      }

      // 文本阴影
      const textShadowCheckbox = document.getElementById('text-shadow-checkbox');
      if (textShadowCheckbox) {
        textShadowCheckbox.addEventListener('change', (e) => {
          textFormatSettings.textShadow = e.target.checked;
          saveTextFormatSettings();
        });
      }

      // 文本对齐
      const textAlignSelect = document.getElementById('text-align-select');
      if (textAlignSelect) {
        textAlignSelect.addEventListener('change', (e) => {
          textFormatSettings.textAlign = e.target.value;
          saveTextFormatSettings();
        });
      }

      // 最低总结楼层
      const minSummaryFloorInput = document.getElementById('min-summary-floor-input');
      if (minSummaryFloorInput) {
        minSummaryFloorInput.addEventListener('input', (e) => {
          const value = Math.max(1, parseInt(e.target.value) || 10);
          minSummaryFloorInput.value = value;
          textFormatSettings.minSummaryFloor = value;
          saveTextFormatSettings();
        });
      }

      // 快捷按钮大小
      const quickBtnSizeSlider = document.getElementById('quick-btn-size-slider');
      const quickBtnSizeInput = document.getElementById('quick-btn-size-input');
      if (quickBtnSizeSlider && quickBtnSizeInput) {
        quickBtnSizeSlider.addEventListener('input', (e) => {
          const value = parseInt(e.target.value);
          quickBtnSizeInput.value = value;
          textFormatSettings.quickBtnSize = value;
          saveTextFormatSettings();
        });
        quickBtnSizeInput.addEventListener('input', (e) => {
          const value = Math.max(24, Math.min(80, parseInt(e.target.value) || 48));
          quickBtnSizeSlider.value = value;
          quickBtnSizeInput.value = value;
          textFormatSettings.quickBtnSize = value;
          saveTextFormatSettings();
        });
      }

      const toolbarLockedCheckbox = document.getElementById('toolbar-locked-checkbox');
      if (toolbarLockedCheckbox) {
        toolbarLockedCheckbox.addEventListener('change', (e) => {
          textFormatSettings.toolbarLocked = e.target.checked;
          saveTextFormatSettings();
        });
      }

      const hideToolbarCgCheckbox = document.getElementById('hide-toolbar-cg-checkbox');
      if (hideToolbarCgCheckbox) {
        hideToolbarCgCheckbox.addEventListener('change', (e) => {
          textFormatSettings.hideToolbarInCg = e.target.checked;
          saveTextFormatSettings();
        });
      }
    }

    // 初始化正文格式设置
    loadTextFormatSettings();
    bindTextFormatEvents();
    initTextFormatControls();

    // 分类按钮
    const categoryBtns = document.querySelectorAll('.settings-category-btn');
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');
        categoryBtns.forEach((item) => item.classList.toggle('active', item === btn));
        renderCategoryResourceList(category);
        showResourceMenu('resource');
      });
    });

    // 全选按钮
    const selectAllBtn = document.getElementById('settings-select-all-btn');
    if (selectAllBtn) {
      selectAllBtn.addEventListener('click', toggleSelectAll);
    }

    // 反转按钮
    const invertBtn = document.getElementById('settings-invert-btn');
    if (invertBtn) {
      invertBtn.addEventListener('click', invertSelection);
    }

    // 监听复选框变化，更新全选按钮状态
    document.addEventListener('change', (e) => {
      if (e.target.type === 'checkbox' && e.target.closest('#settings-resource-list')) {
        updateSelectAllButtonState();
      }
    });

    // 设置界面关闭按钮
    const settingsCloseBtn = document.getElementById('settings-close-btn');
    if (settingsCloseBtn) {
      settingsCloseBtn.addEventListener('click', () => {
        const settingsOverlay = document.getElementById('settings-overlay');
        if (settingsOverlay) {
          settingsOverlay.classList.add('hidden');
        }
      });
    }

    function bindOverlayDismiss(overlayId, closeBtnId) {
      const overlay = document.getElementById(overlayId);
      const closeBtn = document.getElementById(closeBtnId);
      if (!overlay) return;
      overlay.addEventListener('click', (e) => {
        if (e.target !== overlay) return;
        if (closeBtn) closeBtn.click();
        else overlay.classList.add('hidden');
      });
    }
    bindOverlayDismiss('settings-overlay', 'settings-close-btn');
    bindOverlayDismiss('save-overlay', 'save-close-btn');

    // 显示自定义弹窗（存档/读档提示）
    function showArchiveNotification(message, type = 'info') {
      let displayMessage = message;
      if (type === 'success' && message.includes('存档成功')) {
        displayMessage = message.replace(/^[\s\S]*存档成功[！!]?\s*/, '已保存').replace(/\n/g, ' · ') || '已保存';
        if (displayMessage === '已保存' || displayMessage.startsWith('已保存 ·')) {
          const nameMatch = message.match(/存档名[:：]\s*(.+)/);
          displayMessage = nameMatch ? `已保存「${nameMatch[1].split('\n')[0].trim()}」` : '已保存';
        }
      } else if (type === 'error' && message.includes('存档失败')) {
        displayMessage = '存档失败';
      } else if (type === 'success' && message.includes('读档成功')) {
        displayMessage = '已读取存档';
      } else if (type === 'error' && message.includes('读档失败')) {
        displayMessage = '读档失败';
      } else if (type === 'success' && message.includes('成功删除')) {
        displayMessage = '已删除';
      }

      let toast = document.getElementById('fp-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'fp-toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        document.body.appendChild(toast);
      }
      toast.textContent = displayMessage;
      toast.classList.remove('is-error', 'is-success', 'show');
      if (type === 'error') toast.classList.add('is-error');
      if (type === 'success') toast.classList.add('is-success');
      void toast.offsetWidth;
      toast.classList.add('show');
      clearTimeout(showArchiveNotification._timer);
      showArchiveNotification._timer = setTimeout(() => {
        toast.classList.remove('show');
      }, type === 'error' ? 2800 : 2200);
    }

    // 从snapshots中提取存档名称信息
    function extractArchiveNameFromSnapshots() {
      // 获取最新的snapshots（从最后一次对话记录中）
      let latestSnapshots = '';
      // 从对话层中查找最新的非空snapshots（使用最后对话层）
      const lastLayer = getLastDialogueLayer();
      if (lastLayer && lastLayer.snapshots) {
        latestSnapshots = lastLayer.snapshots.trim();
      }

      // 默认值
      let dayNum = '1';
      let weekDay = '';
      let timePeriod = '';
      let summary = '';

      if (latestSnapshots) {
        // 尝试使用逗号分隔格式解析（格式：天数,星期,时间段,时间,描述）
        const parts = latestSnapshots.split(',');
        if (parts.length >= 3) {
          // 使用逗号分隔格式
          dayNum = parts[0].trim();

          // 提取星期（可能包含"星期"或"周"）
          const weekText = parts[1].trim();
          if (weekText.includes('星期') || weekText.includes('周')) {
            weekDay = weekText.replace('星期', '周');
          } else {
            weekDay = weekText;
          }

          // 提取时间段（第3部分）
          if (parts.length >= 3) {
            timePeriod = parts[2].trim();
            // 如果时间段包含时间（如"早,08:00"），分离它们
            const timeMatch = timePeriod.match(/^(.+?)(?:\s+(\d{2}:\d{2}))?$/);
            if (timeMatch) {
              timePeriod = timeMatch[1].trim();
            }
          }

          // 提取描述（第5部分或之后的所有部分）
          if (parts.length >= 5) {
            summary = parts.slice(4).join(',').trim();
          } else if (parts.length >= 4) {
            // 如果只有4部分，第4部分可能是时间或描述
            const part4 = parts[3].trim();
            if (/\d{2}:\d{2}/.test(part4)) {
              // 第4部分是时间，没有描述
              summary = '';
            } else {
              // 第4部分是描述
              summary = part4;
            }
          }
        } else {
          // 兼容旧格式：使用正则表达式解析
          // 提取天数（第N天）
          const dayMatch = latestSnapshots.match(/第([一二三四五六七八九十\d]+)天/);
          if (dayMatch) {
            const dayText = dayMatch[1];
            // 转换中文数字
            const chineseToNumber = {
              '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
              '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
              '十一': 11, '十二': 12, '十三': 13, '十四': 14, '十五': 15,
              '十六': 16, '十七': 17, '十八': 18, '十九': 19, '二十': 20
            };
            if (chineseToNumber[dayText]) {
              dayNum = chineseToNumber[dayText].toString();
            } else if (/^\d+$/.test(dayText)) {
              dayNum = dayText;
            }
          }

          // 提取周几（周一、周二...周日）
          const weekMatch = latestSnapshots.match(/周([一二三四五六日天])/);
          if (weekMatch) {
            weekDay = `周${weekMatch[1]}`;
          }

          // 提取时间段（早、中、晚、上午、下午、晚上等）
          // 支持带时间的格式，如 "早,08:00" 或 "早"（兼容旧格式）
          const timePatterns = [
            { pattern: /(清晨|早上|早晨|早)(?:\s+\d{2}:\d{2})?/, value: '早' },
            { pattern: /(中午|正午|中)(?:\s+\d{2}:\d{2})?/, value: '中' },
            { pattern: /(下午)(?:\s+\d{2}:\d{2})?/, value: '下午' },
            { pattern: /(傍晚|黄昏)(?:\s+\d{2}:\d{2})?/, value: '傍晚' },
            { pattern: /(晚上|夜晚|晚)(?:\s+\d{2}:\d{2})?/, value: '晚' },
            { pattern: /(深夜|午夜)(?:\s+\d{2}:\d{2})?/, value: '深夜' }
          ];

          for (const timePattern of timePatterns) {
            if (timePattern.pattern.test(latestSnapshots)) {
              timePeriod = timePattern.value;
              break;
            }
          }

          // 提取简介（取snapshots的文本内容，去除已提取的信息）
          const summaryText = latestSnapshots
            .replace(/<[^>]+>/g, '') // 移除HTML标签
            .replace(/第[一二三四五六七八九十\d]+天/g, '') // 移除天数
            .replace(/周[一二三四五六日天]/g, '') // 移除周几
            .replace(/(清晨|早上|早晨|早|中午|正午|中|下午|傍晚|黄昏|晚上|夜晚|晚|深夜|午夜)(?:\s+\d{2}:\d{2})?/g, '') // 移除时间段和时间
            .replace(/\d{2}:\d{2}/g, '') // 移除单独的时间格式
            .replace(/\n+/g, ' ') // 换行符替换为空格
            .replace(/\s+/g, ' ') // 多个空格合并为一个
            .trim();

          // 取前30个字符作为简介
          if (summaryText) {
            summary = summaryText.substring(0, 30);
            if (summaryText.length > 30) {
              summary += '...';
            }
          }
        }

        // 清理summary中的多余逗号
        if (summary) {
          summary = summary.replace(/^,+|,+$/g, '').trim();
        }
      }

      // 生成存档名称：第N天 周X 早/中/晚 简介
      let archiveName = `第${dayNum}天`;

      if (weekDay) {
        archiveName += ` ${weekDay}`;
      }

      if (timePeriod) {
        archiveName += ` ${timePeriod}`;
      }

      if (summary) {
        archiveName += ` ${summary}`;
      }

      return archiveName;
    }

    // 自动存档功能（保存最后一个对话）
    async function autoSaveCurrentDialogue() {
      if (dialogueLayers.length === 0) {
        return; // 没有对话记录时不自动存档
      }

      const AUTO_SAVE_NAME = '自动存档';

      try {
        // 整理对话层数据（每个对话层已包含MVU数据）
        const archiveData = {
          dialogueLayers: dialogueLayers.map(layer => ({
            id: layer.id,
            layer: layer.layer,
            timestamp: layer.timestamp,
            maintext: layer.maintext,
            branches: layer.branches,
            snapshots: layer.snapshots,
            variables: layer.variables,
            // 增量快照：只存相对上一层的变动（存档体积小，回溯靠基准累加）
            varsDelta: layer.varsDelta || null,
            type: layer.type,
            playerInput: layer.playerInput
          })),
          currentDialogueLayer: currentDialogueLayer,
          currentDialogueIndex: currentDialogueIndex,
          totalLayers: dialogueLayers.length,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isAutoSave: true, // 标记为自动存档
          routeTitle: isLoveRouteStart ? '纯爱路线' : '游戏路线' // 隐藏标题：标注是否是纯爱开局
        };

        // 保存到IndexedDB
        await storageUtils.archivesDB.saveArchive(AUTO_SAVE_NAME, archiveData);
        logWithTag('AUTOSAVE', '自动存档成功');
      } catch (error) {
        errorWithTag('AUTOSAVE', '自动存档失败', error);
      }
    }

    // 存档功能
    async function saveCurrentDialogue() {
      if (dialogueLayers.length === 0) {
        showArchiveNotification('当前没有对话记录，无法存档', 'error');
        return;
      }

      // 使用数字序号生成存档名称（从1开始）
      let archiveName = '';
      try {
        // 获取所有现有存档
        const allArchives = await storageUtils.archivesDB.getAllArchives();

        // 找出所有"存档X"格式的存档，提取数字序号
        const archiveNumbers = [];
        allArchives.forEach(archive => {
          const name = archive.name || '';
          // 匹配"存档"后跟数字的格式（如"存档1"、"存档123"）
          const match = name.match(/^存档(\d+)$/);
          if (match) {
            const num = parseInt(match[1], 10);
            if (!isNaN(num)) {
              archiveNumbers.push(num);
            }
          }
        });

        // 找到下一个可用的序号
        let nextNumber = 1;
        if (archiveNumbers.length > 0) {
          const maxNumber = Math.max(...archiveNumbers);
          nextNumber = maxNumber + 1;
        }

        archiveName = `存档${nextNumber}`;
      } catch (error) {
        // 如果获取存档列表失败，使用序号1
        errorWithTag('SAVE', '获取存档列表失败，使用默认序号', error);
        archiveName = '存档1';
      }

      try {
        // 整理对话层数据（每个对话层已包含MVU数据）
        const archiveData = {
          dialogueLayers: dialogueLayers.map(layer => ({
            id: layer.id,
            layer: layer.layer,
            timestamp: layer.timestamp,
            maintext: layer.maintext,
            branches: layer.branches,
            snapshots: layer.snapshots,
            variables: layer.variables,
            // 增量快照：只存相对上一层的变动（存档体积小，回溯靠基准累加）
            varsDelta: layer.varsDelta || null,
            type: layer.type,
            playerInput: layer.playerInput
          })),
          currentDialogueLayer: currentDialogueLayer,
          currentDialogueIndex: currentDialogueIndex,
          totalLayers: dialogueLayers.length,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          routeTitle: isLoveRouteStart ? '纯爱路线' : '游戏路线' // 隐藏标题：标注是否是纯爱开局
        };

        // 保存到IndexedDB
        await storageUtils.archivesDB.saveArchive(archiveName, archiveData);
        logWithTag('SAVE', '存档成功:', archiveName);
        showArchiveNotification(`已保存「${archiveName}」`, 'success');

        currentArchiveName = archiveName;
        await renderSaveArchiveList();
      } catch (error) {
        errorWithTag('SAVE', '存档失败', error);
        showArchiveNotification('存档失败，请查看控制台错误信息。', 'error');
      }
    }

    function getArchiveDialogueLayer(archive) {
      const data = archive && archive.data ? archive.data : {};
      const layers = data.dialogueLayers || [];
      const want = data.currentDialogueLayer;
      if (want != null) {
        const found = layers.find((layer) => layer && layer.layer === want && layer.maintext);
        if (found) return found;
      }
      for (let i = layers.length - 1; i >= 0; i--) {
        const layer = layers[i];
        if (layer && layer.type !== 'player' && layer.layer % 2 === 1 && layer.maintext) return layer;
      }
      return null;
    }

    function lookupSaveResourceUrl(category, name) {
      if (!name) return '';
      const list = (allResources && allResources.length)
        ? allResources
        : (typeof buildResourceList === 'function' ? buildResourceList() : []);
      const exact = list.find((r) => r.category === category && r.name === name);
      if (exact && exact.url) return exact.url;
      const loose = list.find((r) => r.category === category && typeof r.name === 'string' && r.name.indexOf(name) !== -1);
      return loose && loose.url ? loose.url : '';
    }

    function getArchiveScene(archive) {
      const layer = getArchiveDialogueLayer(archive);
      if (!layer) return null;
      const data = archive.data || {};
      const layers = data.dialogueLayers || [];
      const parseFn = typeof parseTolinaDialogues === 'function' ? parseTolinaDialogues : null;
      const raw = String(layer.maintext || '');
      const dialogues = parseFn ? parseFn(raw) : [];
      if (!dialogues.length) {
        const text = raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        return { text, character: '', imageUrl: '', isCg: false };
      }
      let idx = typeof data.currentDialogueIndex === 'number' ? data.currentDialogueIndex : dialogues.length - 1;
      if (idx < 0) idx = 0;
      if (idx >= dialogues.length) idx = dialogues.length - 1;

      let background = null;
      let cg = null;
      if (parseFn) {
        const prior = layers
          .filter((item) => item && item.type !== 'player' && item.layer % 2 === 1 && item.maintext && item.layer < layer.layer)
          .sort((a, b) => a.layer - b.layer);
        prior.forEach((item) => {
          const lines = parseFn(String(item.maintext || ''));
          lines.forEach((line) => {
            if (line.background) background = line.background;
            if (line.cg) cg = line.cg.isStop ? null : line.cg;
          });
        });
      }
      for (let i = 0; i <= idx; i++) {
        const item = dialogues[i];
        if (item.background) background = item.background;
        if (item.cg) cg = item.cg.isStop ? null : item.cg;
      }

      const current = dialogues[idx] || {};
      let imageUrl = '';
      let isCg = false;
      if (cg) {
        imageUrl = (typeof getCGUrl === 'function' ? getCGUrl(cg.groupName, cg.cgName) : '') || lookupSaveResourceUrl('CG', `${cg.groupName}-${cg.cgName}`);
        isCg = !!imageUrl;
      }
      if (!imageUrl && background) {
        imageUrl = (typeof getBackgroundUrl === 'function' ? getBackgroundUrl(background) : '') || lookupSaveResourceUrl('背景', background);
      }
      if (imageUrl && typeof resolveAssetUrl === 'function') {
        imageUrl = resolveAssetUrl(imageUrl);
      }

      let spriteLayers = null;
      let spriteAlign = 'right';
      if (!isCg) {
        const varsSnapshot = getLayerVars(layer) || layer.mvuData || null;
        if (current.isOtherSpeaker && typeof getRivalMaleSpriteLayers === 'function') {
          spriteLayers = getRivalMaleSpriteLayers(current.character, !!current.withShadow);
          spriteAlign = 'left';
        } else if (current.character === '托莉娜' && typeof assembleTolinaSpriteLayers === 'function') {
          const status = getNestedValue(varsSnapshot, '托莉娜.基础.堕落阶段');
          const outfit = getNestedValue(varsSnapshot, '托莉娜.基础.服装');
          spriteLayers = assembleTolinaSpriteLayers(current, parseInt(status, 10) || 1, outfit || '常服');
          spriteAlign = 'right';
        }
      }

      return {
        text: String(current.dialogue || '').replace(/\s+/g, ' ').trim(),
        character: current.character || '',
        imageUrl,
        isCg,
        spriteLayers,
        spriteAlign
      };
    }

    function applySaveSpriteStack(el, layers, align) {
      if (!el || !layers) return;
      const pos = align === 'left' ? 'left bottom' : 'right bottom';
      const urls = [];
      if (layers.base || layers.shade) {
        if (layers.base) urls.push(layers.base);
        if (layers.shade) urls.push(layers.shade);
      } else {
        ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'].forEach((key) => {
          if (layers[key]) urls.push(layers[key]);
        });
      }
      if (!urls.length) return;
      const toCss = typeof cssUrl === 'function'
        ? cssUrl
        : (url) => `url(${JSON.stringify(typeof resolveAssetUrl === 'function' ? resolveAssetUrl(url) : url)})`;
      urls.reverse();
      el.style.backgroundImage = urls.map((url) => toCss(url)).join(', ');
      el.style.backgroundSize = urls.map(() => 'auto 100%').join(', ');
      el.style.backgroundPosition = urls.map(() => pos).join(', ');
      el.style.backgroundRepeat = 'no-repeat';
    }

    function fillSaveSceneThumb(el, archive, emptyLabel) {
      if (!el) return;
      el.innerHTML = '';
      el.classList.remove('has-scene');
      const scene = getArchiveScene(archive);
      const hasSprite = !!(scene && scene.spriteLayers && (scene.spriteLayers.L1 || scene.spriteLayers.base));
      if (!scene || (!scene.imageUrl && !hasSprite)) {
        const label = document.createElement('span');
        label.className = 'saves-preview-placeholder';
        label.textContent = emptyLabel || 'NO IMAGE';
        el.appendChild(label);
        return;
      }
      el.classList.add('has-scene');
      const root = document.createElement('div');
      root.className = 'saves-scene' + (scene.isCg ? ' is-cg' : '');
      if (scene.imageUrl) {
        const pic = document.createElement('div');
        pic.className = scene.isCg ? 'saves-scene-cg' : 'saves-scene-bg';
        pic.style.backgroundImage = `url(${JSON.stringify(scene.imageUrl)})`;
        root.appendChild(pic);
      }
      if (!scene.isCg && hasSprite) {
        const sp = document.createElement('div');
        sp.className = 'saves-scene-sprite' + (scene.spriteAlign === 'left' ? ' is-left' : ' is-right');
        applySaveSpriteStack(sp, scene.spriteLayers, scene.spriteAlign || 'right');
        root.appendChild(sp);
      }
      el.appendChild(root);
    }

    function archiveCommentText(archive) {
      const scene = getArchiveScene(archive);
      if (scene && scene.text) return scene.text;
      const data = archive && archive.data ? archive.data : {};
      const layers = data.dialogueLayers || [];
      const last = layers.length ? layers[layers.length - 1] : null;
      const raw = last && last.maintext ? String(last.maintext) : '';
      return raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || archive.name || '—';
    }

    function archiveDateText(archive) {
      const data = archive && archive.data ? archive.data : {};
      const createdAt = archive.timestamp || data.createdAt || data.updatedAt || '';
      return createdAt ? new Date(createdAt).toLocaleString('zh-CN') : '未知时间';
    }

    function archiveLayerNum(archive) {
      const data = archive && archive.data ? archive.data : {};
      return data.currentDialogueLayer || data.totalLayers || (data.dialogueLayers && data.dialogueLayers.length) || 0;
    }

    function refreshSaveActionButtons() {
      const loadBtn = document.getElementById('load-btn');
      const deleteBtn = document.getElementById('delete-btn');
      const has = !!currentArchiveName;
      const isAuto = currentArchiveName === '自动存档';
      if (loadBtn) {
        loadBtn.disabled = !has;
        loadBtn.textContent = isAuto ? '读取自动存档' : '读取选中存档';
      }
      if (deleteBtn) {
        deleteBtn.disabled = !has || isAuto;
        deleteBtn.textContent = isAuto ? '自动存档不可删除' : '删除选中存档';
      }
    }

    function updateSavePreview(archive, isAutoSave) {
      const dateEl = document.getElementById('saves-preview-date');
      const slotEl = document.getElementById('saves-preview-slot');
      const commentEl = document.getElementById('saves-preview-comment');
      const thumbEl = document.getElementById('saves-preview-thumb');
      if (!archive) {
        if (dateEl) dateEl.textContent = '—';
        if (slotEl) slotEl.textContent = '自动保存';
        if (commentEl) commentEl.textContent = '请选择存档，或点 + 新建';
        fillSaveSceneThumb(thumbEl, null, 'NO IMAGE');
        refreshSaveActionButtons();
        return;
      }
      if (dateEl) dateEl.textContent = archiveDateText(archive);
      if (slotEl) slotEl.textContent = isAutoSave ? '自动保存' : (archive.name || '手动存档');
      if (commentEl) commentEl.textContent = archiveCommentText(archive);
      fillSaveSceneThumb(thumbEl, archive, 'NO IMAGE');
      refreshSaveActionButtons();
    }

    function selectArchiveItem(item, archive, isAutoSave) {
      document.querySelectorAll('#save-archive-list .saves-slot').forEach((el) => {
        el.classList.remove('is-selected', 'active');
      });
      if (item) item.classList.add('is-selected', 'active');
      currentArchiveName = archive ? archive.name : null;
      updateSavePreview(archive, isAutoSave);
    }

    // 渲染存档列表
    async function renderSaveArchiveList() {
      const archiveList = document.getElementById('save-archive-list');
      if (!archiveList) {
        errorWithTag('SAVE', '存档列表容器不存在');
        return;
      }

      try {
        const archives = await storageUtils.archivesDB.getAllArchives();
        archiveList.innerHTML = '';

        const AUTO_SAVE_NAME = '自动存档';
        const autoSaveArchive = archives.find(a => a.name === AUTO_SAVE_NAME);
        const normalArchives = archives.filter(a => a.name !== AUTO_SAVE_NAME);

        if (autoSaveArchive) {
          archiveList.appendChild(createArchiveItem(autoSaveArchive, true));
        }

        normalArchives.sort((a, b) => {
          const timeA = new Date(a.timestamp || a.data?.createdAt || 0);
          const timeB = new Date(b.timestamp || b.data?.createdAt || 0);
          return timeB - timeA;
        });

        normalArchives.forEach((archive) => {
          archiveList.appendChild(createArchiveItem(archive, false));
        });

        const plus = document.createElement('button');
        plus.type = 'button';
        plus.className = 'saves-slot saves-slot--plus';
        plus.title = '新建存档（保存当前对话）';
        plus.setAttribute('aria-label', '新建存档');
        plus.innerHTML = '<span class="saves-plus-mark" aria-hidden="true">+</span>';
        plus.addEventListener('click', () => {
          const saveBtn = document.getElementById('save-btn');
          if (saveBtn) saveBtn.click();
        });
        archiveList.appendChild(plus);

        const selected = archiveList.querySelector('.saves-slot.is-selected');
        if (!selected) {
          if (autoSaveArchive) {
            currentArchiveName = AUTO_SAVE_NAME;
            const autoEl = archiveList.querySelector('.saves-slot--auto');
            if (autoEl) autoEl.classList.add('is-selected', 'active');
            updateSavePreview(autoSaveArchive, true);
          } else {
            currentArchiveName = null;
            updateSavePreview(null, false);
          }
        } else {
          refreshSaveActionButtons();
        }
      } catch (error) {
        errorWithTag('SAVE', '加载存档列表失败', error);
        archiveList.innerHTML = '<div class="save-archive-empty">加载存档列表失败: ' + error.message + '</div>';
        updateSavePreview(null, false);
      }
    }

    // 创建存档项元素
    function createArchiveItem(archive, isAutoSave) {
      const item = document.createElement('article');
      item.className = 'saves-slot save-archive-item' + (isAutoSave ? ' saves-slot--auto' : ' saves-slot--manual');
      if (isAutoSave) item.classList.add('autosave');
      if (archive.name === currentArchiveName) item.classList.add('is-selected', 'active');
      item.dataset.archiveName = archive.name;
      item.dataset.isAutoSave = isAutoSave ? 'true' : 'false';
      item.setAttribute('role', 'listitem');
      item.tabIndex = 0;
      item.title = isAutoSave ? '点击选择 / 读取自动存档' : '点击选择此存档';

      const layerNum = archiveLayerNum(archive);
      const dateStr = archiveDateText(archive);

      const head = document.createElement('div');
      head.className = 'saves-slot-head';
      head.textContent = isAutoSave ? '自动保存' : (archive.name || '手动存档');

      const thumb = document.createElement('div');
      thumb.className = 'saves-slot-thumb';
      fillSaveSceneThumb(thumb, archive, isAutoSave ? 'AUTO' : 'SAVE');

      const foot = document.createElement('div');
      foot.className = 'saves-slot-foot';
      const comment = document.createElement('div');
      comment.className = 'saves-slot-comment';
      comment.textContent = archiveCommentText(archive);
      const meta = document.createElement('div');
      meta.className = 'saves-slot-meta';
      const time = document.createElement('div');
      time.className = 'saves-slot-time';
      time.textContent = dateStr;
      const round = document.createElement('div');
      round.className = 'saves-slot-round';
      round.textContent = layerNum > 0 ? String(layerNum) : '';
      round.title = layerNum > 0 ? `${layerNum} 层对话` : '';
      meta.appendChild(time);
      meta.appendChild(round);
      foot.appendChild(comment);
      foot.appendChild(meta);

      item.appendChild(head);
      item.appendChild(thumb);
      item.appendChild(foot);

      item.addEventListener('click', () => {
        selectArchiveItem(item, archive, isAutoSave);
      });
      item.addEventListener('dblclick', async () => {
        selectArchiveItem(item, archive, isAutoSave);
        await loadArchive(archive.name);
      });

      return item;
    }

    // 读档功能
    async function loadArchive(archiveName) {
      try {
        logWithTag('LOAD', '========== 开始读档 ==========');
        logWithTag('LOAD', '存档名称:', archiveName);

        // 从IndexedDB加载存档
        const archive = await storageUtils.archivesDB.loadArchive(archiveName);
        if (!archive || !archive.data) {
          console.error('[LOAD] ❌ 存档不存在或已损坏');
          showArchiveNotification('存档不存在或已损坏', 'error');
          return;
        }

        const archiveData = archive.data;
        logWithTag('LOAD', '存档数据加载成功');

        // 恢复路线信息（如果存在）
        if (archiveData.routeTitle) {
          isLoveRouteStart = archiveData.routeTitle === '纯爱路线';
          logWithTag('LOAD', '路线信息:', archiveData.routeTitle);
        }

        // 先初始化游戏界面（确保所有DOM元素都已创建）
        logWithTag('LOAD', '初始化游戏界面...');
        // 设置读档标志，阻止 initGameInterface 显示预设对话
        window._isLoadingArchive = true;
        await initGameInterface();
        window._isLoadingArchive = false;
        logWithTag('LOAD', '✅ 游戏界面初始化完成');

        // 兼容旧存档格式（dialogueHistory）和新格式（dialogueLayers）
        let dialogueLayersFromArchive = [];
        if (archiveData.dialogueLayers && archiveData.dialogueLayers.length > 0) {
          // 新格式：使用对话层
          dialogueLayersFromArchive = archiveData.dialogueLayers;
          currentDialogueLayer = archiveData.currentDialogueLayer || 0;
          logWithTag('LOAD', '使用新格式，对话层数量:', dialogueLayersFromArchive.length);
        } else if (archiveData.dialogueHistory && archiveData.dialogueHistory.length > 0) {
          // 旧格式：转换为对话层格式（兼容旧存档）
          dialogueLayersFromArchive = archiveData.dialogueHistory.map((entry, index) => ({
            id: entry.id || crypto.randomUUID(),
            layer: (index + 1) * 2 - 1, // 转换为奇数层：1, 3, 5, 7...
            timestamp: entry.timestamp || new Date().toISOString(),
            maintext: entry.maintext || '',
            branches: entry.branches || '',
            snapshots: entry.snapshots || '',
            variables: entry.variables || '',
            varsSnapshot: archiveData.mvuData?.stat_data || archiveData.mvuData || null,
            type: undefined
          }));
          // 计算当前对话层
          const maxLayer = Math.max(...dialogueLayersFromArchive.map(l => l.layer));
          currentDialogueLayer = maxLayer;
          logWithTag('LOAD', '使用旧格式，已转换，对话层数量:', dialogueLayersFromArchive.length);
        }

        if (dialogueLayersFromArchive.length === 0) {
          console.error('[LOAD] ❌ 存档中没有对话记录');
          showArchiveNotification('存档中没有对话记录', 'error');
          return;
        }

        // 覆盖当前对话层
        dialogueLayers.length = 0; // 清空现有历史
        dialogueLayers.push(...dialogueLayersFromArchive);
        sanitizeDialogueLayers();
        // 旧存档（整树快照）迁移为增量快照
        migrateLegacySnapshotsToDelta();
        logWithTag('LOAD', '✅ 已加载', dialogueLayers.length, '个对话层到内存');

        // 打印所有对话层信息（用于调试）
        logWithTag('LOAD', '所有对话层信息:');
        dialogueLayers.forEach(layer => {
          if (layer.type !== 'player' && layer.layer % 2 === 1) {
            const round = Math.floor((layer.layer + 1) / 2);
            logWithTag('DEBUG', `  - 层 ${layer.layer} (第${round}轮): 内容长度 ${layer.maintext ? layer.maintext.length : 0}`);
          }
        });

        // 手动查找最后一轮对话（最高奇数层）
        let lastLayer = null;
        let maxOddLayer = 0;

        for (let i = dialogueLayers.length - 1; i >= 0; i--) {
          const layer = dialogueLayers[i];
          // 确保是奇数层（对话层）且不是玩家输入
          if (layer.type !== 'player' && layer.layer % 2 === 1) {
            if (layer.layer > maxOddLayer) {
              maxOddLayer = layer.layer;
              lastLayer = layer;
            }
          }
        }

        if (!lastLayer) {
          console.error('[LOAD] ❌ 存档中没有有效的对话层');
          showArchiveNotification('存档中没有有效的对话层', 'error');
          return;
        }

        const lastRound = Math.floor((lastLayer.layer + 1) / 2);
        logWithTag('LOAD', '✅ 找到最后一轮对话:');
        logWithTag('LOAD', '- 对话层:', lastLayer.layer);
        logWithTag('LOAD', '- 对话轮次:', lastRound);
        logWithTag('LOAD', '- 内容长度:', lastLayer.maintext ? lastLayer.maintext.length : 0);

        // 更新界面：加载最后对话层的内容
        if (lastLayer.maintext) {
          // 提前设置标志，防止其他代码覆盖对话
          window._isLoadingArchiveDialogue = true;
          logWithTag('LOAD', '已设置读档保护标志');

          logWithTag('LOAD', '开始解析对话文本...');
          // 解析对话
          const dialogues = parseTolinaDialogues(lastLayer.maintext);
          logWithTag('LOAD', '✅ 解析完成，共', dialogues.length, '段对话');

          // 恢复CG状态：遍历所有对话层，找到最后一个有效的CG标签
          // 清空CG状态
          Object.keys(cgState).forEach(key => delete cgState[key]);

          // 从最后一个对话层开始，向前遍历所有对话层，找到最后一个有效的CG
          for (let i = dialogueLayers.length - 1; i >= 0; i--) {
            const layer = dialogueLayers[i];
            if (layer.type !== 'player' && layer.layer % 2 === 1 && layer.maintext) {
              // 解析该层的对话，找到最后一个CG标签
              const layerDialogues = parseTolinaDialogues(layer.maintext);
              for (let j = layerDialogues.length - 1; j >= 0; j--) {
                const dialogue = layerDialogues[j];
                if (dialogue.cg && !dialogue.cg.isStop) {
                  // 找到最后一个有效的CG，恢复状态
                  cgState[dialogue.cg.groupName] = dialogue.cg.cgName;
                  logWithTag('LOAD', `[CG] 恢复CG状态: ${dialogue.cg.groupName} - ${dialogue.cg.cgName}`);
                  break;
                } else if (dialogue.cg && dialogue.cg.isStop) {
                  // 如果遇到stop标签，清除该CG组的状态
                  delete cgState[dialogue.cg.groupName];
                  logWithTag('LOAD', `[CG] 清除CG组: ${dialogue.cg.groupName}`);
                }
              }
              // 如果找到了CG，停止向前搜索
              if (Object.keys(cgState).length > 0) {
                break;
              }
            }
          }

          // 应用恢复的CG状态
          applyCGState();

          // 清空当前对话状态
          currentDialogues = [];
          currentDialogueIndex = 0;

          // 设置新的对话（恢复到存档当时那一句）
          currentDialogues = dialogues;
          let startIdx = typeof archiveData.currentDialogueIndex === 'number' ? archiveData.currentDialogueIndex : 0;
          if (startIdx < 0) startIdx = 0;
          if (startIdx >= dialogues.length) startIdx = Math.max(0, dialogues.length - 1);
          currentDialogueIndex = startIdx;

          logWithTag('LOAD', '开始显示对话，索引:', startIdx);
          await showDialogue(startIdx);
          logWithTag('LOAD', '✅ 已显示对话，当前索引:', currentDialogueIndex);
          logWithTag('LOAD', '当前对话总数:', currentDialogues.length);

          // 延迟多次检查，确保显示不被覆盖
          const checkAndRestoreDialogue = async () => {
            if (window._isLoadingArchiveDialogue && currentDialogues.length > 0) {
              const dialogueText = document.querySelector('.dialogue-text');
              const expected = currentDialogues[currentDialogueIndex] || currentDialogues[0];
              const expectedText = expected && expected.dialogue;

              if (dialogueText && expectedText && dialogueText.textContent !== expectedText) {
                logWithTag('LOAD', '⚠️ 检测到对话内容被改变，恢复存档对话');
                await showDialogue(currentDialogueIndex);
              }
            }
          };

          // 多次检查，确保显示不被覆盖
          setTimeout(checkAndRestoreDialogue, 500);
          setTimeout(checkAndRestoreDialogue, 800);
          setTimeout(checkAndRestoreDialogue, 1100);
          setTimeout(() => {
            window._isLoadingArchiveDialogue = false;
            logWithTag('LOAD', '✅ 读档对话显示完成，解除保护');
          }, 1500);

          // 等待DOM更新完成，然后滚动到对话文本的顶部
          setTimeout(() => {
            const dialogueText = document.querySelector('.dialogue-text');
            const dialogueBox = document.querySelector('.dialogue-box');

            if (dialogueText) {
              // 如果对话框容器可滚动，滚动到顶部
              if (dialogueBox && dialogueBox.scrollHeight > dialogueBox.clientHeight) {
                dialogueBox.scrollTop = 0;
              }

              // 滚动到对话文本元素（确保第一句话可见）
              dialogueText.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' });
            }

            // 处理分支选项
            if (lastLayer.branches) {
              // 检查是否还在对话中
              const isInDialogue = currentDialogues.length > 0 && currentDialogueIndex < currentDialogues.length - 1;
              if (!isInDialogue) {
                // 如果对话已经显示完毕，显示分支选项
                logWithTag('LOAD', '对话已显示完毕，显示分支选项');
                updateBranches(lastLayer.branches);
              } else {
                // 如果还在对话中，设置待显示的分支文本，等待用户点击完所有对话
                logWithTag('LOAD', '对话未显示完毕，设置待显示的分支文本');
                pendingBranchesText = lastLayer.branches;
              }
            } else {
              updateBranches('');
            }
          }, 300);
        } else {
          warnWithTag('LOAD', '⚠️ 最后一轮对话没有文本内容');
          await updateMainText('');
          // 如果没有对话文本，直接处理分支选项
          if (lastLayer.branches) {
            updateBranches(lastLayer.branches);
          } else {
            updateBranches('');
          }
        }

        // 更新快照
        if (lastLayer.snapshots) {
          updateSnapshots(lastLayer.snapshots);
        } else {
          updateSnapshots('');
        }

        // 恢复变量状态（只使用 ERA）
        const varsToRestore = getLayerVars(lastLayer) || lastLayer.mvuData?.stat_data || lastLayer.mvuData;

        if (varsToRestore) {
          migrateLegacyHstateTree(varsToRestore);
          if (lastLayer.requestFlags) adoptRequestFlags(lastLayer.requestFlags);
          recomputeDerivedHstateFields(varsToRestore);
          logWithTag('LOAD', '开始恢复变量快照...');
          try {
            // 使用 ERA 的 insertByObject 恢复变量（完全替换）
            ERA.insertByObject(varsToRestore);
            // 同时更新 ERA 缓存
            ERA.cache.vars = varsToRestore;
            ERA.cache.timestamp = Date.now();
            ERA.currentVars = varsToRestore;
            logWithTag('LOAD', '✅ 变量快照已通过 ERA 恢复');
          } catch (eraError) {
            console.error('[LOAD] ❌ ERA 恢复失败:', eraError);
          }
        } else if (lastLayer.variables) {
          // 如果没有变量快照，尝试使用 variables 字段
          try {
            await updateVariables(lastLayer.variables);
            logWithTag('LOAD', '✅ 已从 variables 字段恢复变量');
          } catch (varError) {
            console.error('[LOAD] ❌ 从 variables 字段恢复失败:', varError);
          }
        }

        try {
          await syncGameModeFromArchive(archiveData, varsToRestore);
        } catch (e) {
          console.error('[LOAD] ❌ 同步游戏模式失败:', e);
        }

        // 更新体力条和时间天气系统
        try {
          await updateStaminaBar();
          await updateTimeWeatherSystem();
        } catch (e) {
          console.error('[LOAD] ❌ 更新体力条和时间系统失败:', e);
        }

        // 读档后同步世界书（含模式 UID 33/43）
        try {
          await checkAndControlUIDs();
        } catch (e) {
          console.error('[LOAD] ❌ 读档后同步世界书失败:', e);
        }

        if (lastLayer.otherpov && lastLayer.otherpov.trim()) {
          currentLayerOtherPov = { maintext: lastLayer.maintext || '', otherpov: lastLayer.otherpov.trim() };
          showingOtherPov = false;
          savedMainDialogueIndex = 0;
          savedOtherPovDialogueIndex = 0;
        } else {
          currentLayerOtherPov = null;
          showingOtherPov = false;
        }
        updateOtherPovToggleVisibility();

        // 关闭存档界面
        const saveOverlay = document.getElementById('save-overlay');
        if (saveOverlay) {
          saveOverlay.classList.add('hidden');
        }

        logWithTag('LOAD', '========== 读档完成 ==========');
      } catch (error) {
        errorWithTag('LOAD', '读档失败', error);
        showArchiveNotification('读档失败，请查看控制台错误信息。', 'error');
      }
    }

    // 显示确认删除弹窗
    function showDeleteConfirmDialog(archiveName, onConfirm) {
      showConfirmDialog(
        `确定删除「${archiveName}」？\n此操作不可恢复。`,
        onConfirm,
        { yesText: '删除', noText: '取消' }
      );
    }

    // 渲染立绘到指定容器（用于画框内显示，使用canvas裁剪）
    async function renderSpriteToContainer(container, parsedTag) {
      if (!parsedTag || parsedTag.character !== '托莉娜') {
        return;
      }

      const layers = await buildTolinaSpriteLayers(parsedTag);
      if (!layers) return;

      // 原图尺寸
      const naturalWidth = 1440;
      const naturalHeight = 900;

      // 裁剪参数（从原图坐标系）
      const cropX = naturalWidth - 300;
      const cropY = naturalHeight - 594;
      const cropSize = 200;

      // 加载所有图层图片
      const layerImages = [];
      const layerOrder = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'];

      for (const layerKey of layerOrder) {
        if (layers[layerKey]) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = layers[layerKey];
          });
          layerImages.push(img);
        }
      }

      if (layerImages.length === 0) return;

      // 创建临时 canvas 来合成所有图层（原图尺寸）
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = naturalWidth;
      tempCanvas.height = naturalHeight;
      const tempCtx = tempCanvas.getContext('2d');

      // 按顺序绘制所有图层（L1在最下层，L6在最上层）
      for (const img of layerImages) {
        tempCtx.drawImage(img, 0, 0, naturalWidth, naturalHeight);
      }

      // 创建裁剪后的 canvas（200x200）
      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = cropSize;
      cropCanvas.height = cropSize;
      const cropCtx = cropCanvas.getContext('2d');

      // 从临时 canvas 裁剪指定区域到裁剪 canvas
      cropCtx.drawImage(
        tempCanvas,
        cropX, cropY, cropSize, cropSize,  // 源区域（原图坐标系）
        0, 0, cropSize, cropSize            // 目标区域（裁剪canvas）
      );

      // 将裁剪后的 canvas 转换为图片并显示在容器中
      const croppedImageUrl = cropCanvas.toDataURL('image/png');
      container.style.backgroundImage = `url('${croppedImageUrl}')`;
      container.style.backgroundSize = 'contain';
      container.style.backgroundPosition = 'center';
      container.style.backgroundRepeat = 'no-repeat';
    }

    // 显示当前对话轮消息弹窗
    // defaultView: 'branches' 默认显示选项, 'dialogue' 默认显示对话
    async function jumpToDialogueLayer(layer) {
      if (!layer) return false;
      dialogueLayers = dialogueLayers.filter(l => l.layer <= layer.layer);
      currentDialogueLayer = layer.layer;

      // 截断后失效后续缓存，并从基准 + delta 重建目标层完整树
      invalidateSnapshotCacheFrom(0);
      const restoredVars = getLayerVars(layer);
      if (restoredVars) {
        migrateLegacyHstateTree(restoredVars);
        try {
          ERA.cache.vars = restoredVars;
          ERA.cache.timestamp = Date.now();
          ERA.currentVars = restoredVars;
        } catch (eraError) {
          console.error('[JUMP] ERA 恢复失败:', eraError);
        }
      }

      if (layer.maintext) {
        const dialogues = parseTolinaDialogues(layer.maintext);
        if (dialogues.length > 0) {
          currentDialogues = dialogues;
          currentDialogueIndex = 0;
          await showDialogue(0);
        } else {
          await updateMainText(layer.maintext);
        }
      } else {
        await updateMainText('');
      }

      if (layer.branches) updateBranches(layer.branches);
      else updateBranches('');
      if (layer.snapshots) updateSnapshots(layer.snapshots);
      else updateSnapshots('');

      try {
        await updateStaminaBar();
        await updateTimeWeatherSystem();
      } catch (e) {
        console.error('[JUMP] 更新体力条和时间系统失败:', e);
      }
      return true;
    }

    function showCurrentDialogueLayer(defaultView = 'dialogue') {
      try {
        // 检查是否已有弹窗，如果有则先关闭
        const existingOverlay = document.getElementById('current-dialogue-overlay');
        if (existingOverlay) {
          existingOverlay.remove();
        }

        // 获取当前对话层（最后一个奇数层）
        const lastLayer = getLastDialogueLayer();

        logWithTag('QUEST', '获取到的对话层:', lastLayer);
        logWithTag('QUEST', 'dialogueLayers 总数:', dialogueLayers.length);

        if (!lastLayer && dialogueLayers.length === 0) {
          warnWithTag('QUEST', '没有找到对话层');
          // 显示提示信息
          alert('当前没有对话记录');
          return;
        }

        const overlay = createDialogOverlay('current-dialogue-overlay', 20000);
        overlay.classList.add('quest-overlay');
        const dialog = createDialog();
        dialog.classList.remove('fp-panel');
        dialog.classList.add('quest-panel');
        const isBranchesMode = defaultView === 'branches';
        dialog.classList.add(isBranchesMode ? 'quest-panel-branches' : 'quest-panel-log');
        dialog.style.width = '';
        dialog.style.maxWidth = '';
        dialog.style.minHeight = '';

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'quest-toolbar';

        const leftButtonGroup = document.createElement('div');
        leftButtonGroup.className = 'quest-toolbar-left';

        const currentBtn = document.createElement('button');
        currentBtn.id = 'quest-current-btn';
        currentBtn.className = 'quest-tab-btn';
        currentBtn.type = 'button';
        currentBtn.textContent = '对话';

        const historyBtn = document.createElement('button');
        historyBtn.id = 'quest-history-btn';
        historyBtn.className = 'quest-tab-btn';
        historyBtn.type = 'button';
        historyBtn.textContent = '历史';

        const updateButtonStyle = (activeBtn, ...inactiveBtns) => {
          activeBtn.classList.add('is-active');
          inactiveBtns.forEach(btn => btn.classList.remove('is-active'));
        };

        // 渲染分支选项内容
        const renderBranches = () => {
          contentContainer.innerHTML = '';
          title.textContent = '此刻可以做的事';

          const sendChoiceToAI = async (choiceText) => {
            try {
              recordPlayerInput(choiceText);

              const overlay = document.getElementById('current-dialogue-overlay');
              if (overlay) overlay.remove();

              await updateMainText(choiceText);

              const dialogueNameArea = document.querySelector('.dialogue-name-area');
              if (dialogueNameArea) {
                const nameplate = dialogueNameArea.querySelector('.nameplate');
                if (nameplate) {
                  const nameplateTop = nameplate.querySelector('.np-top');
                  const nameplateBottom = nameplate.querySelector('.np-bottom');
                  if (nameplateTop) nameplateTop.textContent = '';
                  if (nameplateBottom) nameplateBottom.textContent = '{{user}}';
                }
              }

              const content = await generateStoryRound(choiceText);
              currentStreamingContent = '';
              if (content) {
                await processMessage(content);
              }

              logWithTag('BRANCH', '✅ 分支选择已发送给AI');
            } catch (error) {
              setGalBusy(false);
              errorWithTag('BRANCH', '发送分支选择时出错', error);
              await updateMainText(`发送失败：${error.message}\n请重试或检查接口设置。`);
            }
          };

          let branchesText = lastLayer ? lastLayer.branches : null;
          if (!branchesText || !branchesText.trim()) {
            if (typeof pendingBranchesText !== 'undefined' && pendingBranchesText && pendingBranchesText.trim()) {
              branchesText = pendingBranchesText;
            }
          }

          mountBranchActionUI(contentContainer, branchesText || '', sendChoiceToAI);
        };

        // 创建标题（左上角显示"当前对话轮消息"）
        const title = document.createElement('div');
        title.id = 'quest-title';
        title.className = 'quest-title';
        title.textContent = '当前对话轮消息';

        // 创建内容容器
        const contentContainer = document.createElement('div');
        contentContainer.id = 'quest-content-container';
        contentContainer.className = 'current-dialogue-content-container';

        const fillCurrentLayer = (target) => {
          target.innerHTML = '';

          if (!lastLayer) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'quest-empty-msg';
            emptyMessage.textContent = '暂无当前对话记录';
            target.appendChild(emptyMessage);
            return;
          }

          if (!lastLayer.maintext) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'quest-empty-msg';
            emptyMessage.textContent = '当前对话层没有内容';
            target.appendChild(emptyMessage);
            return;
          }

          const dialogues = parseTolinaDialogues(lastLayer.maintext);
          logWithTag('QUEST', '解析到的对话数量:', dialogues.length);
          logWithTag('QUEST', '对话内容:', dialogues);

          if (dialogues.length === 0) {
            const rawTextEntry = document.createElement('div');
            rawTextEntry.className = 'quest-message-entry';

            const dialogueText = document.createElement('div');
            dialogueText.className = 'quest-dialogue-text';
            dialogueText.textContent = lastLayer.maintext;
            rawTextEntry.appendChild(dialogueText);
            target.appendChild(rawTextEntry);
          } else {
            dialogues.forEach((dialogue) => {
              const messageEntry = document.createElement('div');
              messageEntry.className = 'quest-message-entry';

              const frameContainer = document.createElement('div');
              frameContainer.className = 'quest-sprite-frame';

              const spriteContainer = document.createElement('div');
              spriteContainer.className = 'quest-sprite-frame-inner';

              renderSpriteToContainer(spriteContainer, dialogue).catch(err => {
                warnWithTag('QUEST', '渲染立绘失败:', err);
              });

              frameContainer.appendChild(spriteContainer);

              const dialogueText = document.createElement('div');
              dialogueText.className = 'quest-dialogue-text';
              dialogueText.textContent = dialogue.dialogue || '';

              messageEntry.appendChild(frameContainer);
              messageEntry.appendChild(dialogueText);
              target.appendChild(messageEntry);
            });
            logWithTag('QUEST', '已快速显示', dialogues.length, '条对话，立绘正在异步加载');
          }
        };

        const fillHistoryLayers = (target) => {
          target.innerHTML = '';

          // 获取所有奇数层（AI回复层）
          const oddLayers = dialogueLayers
            .filter(layer => layer.type !== 'player' && layer.layer % 2 === 1)
            .sort((a, b) => b.layer - a.layer); // 从新到旧排序

            if (oddLayers.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'quest-empty-msg';
            emptyMessage.textContent = '暂无历史对话记录';
            target.appendChild(emptyMessage);
            return;
          }

          // 为每个奇数层创建条目
          oddLayers.forEach((layer, index) => {
            const round = Math.floor((layer.layer + 1) / 2);

            // 从快照中提取描述（第5段及之后的内容）
            let description = '';
            if (layer.snapshots && layer.snapshots.trim()) {
              const parts = layer.snapshots.split(',');
              if (parts.length >= 5) {
                // 提取第5段及之后的所有内容作为描述
                description = parts.slice(4).join(',').trim();
              } else if (parts.length === 4) {
                // 如果只有4段，检查第4段是否是时间格式
                const part4 = parts[3].trim();
                if (!/\d{2}:\d{2}/.test(part4)) {
                  // 第4段不是时间，就是描述
                  description = part4;
                }
              }
            }

            // 如果没有描述，使用默认文本
            if (!description) {
              description = '暂无描述';
            }

            // 创建单框容器（左侧10%楼层，中间80%描述，右侧10%跳转按钮，可扩展占满宽度）
            const layerContainer = document.createElement('div');
            layerContainer.className = 'quest-layer-row';

            const layerNumber = document.createElement('div');
            layerNumber.className = 'quest-layer-num';
            layerNumber.textContent = layer.layer.toString();

            const descriptionText = document.createElement('div');
            descriptionText.className = 'quest-layer-desc';
            descriptionText.textContent = description;

            const jumpBtn = document.createElement('button');
            jumpBtn.className = 'quest-jump-btn';
            jumpBtn.textContent = '跳转';

            // 跳转功能
            jumpBtn.addEventListener('click', () => {
              // 显示确认弹窗
              const confirmOverlay = createDialogOverlay('jump-confirm-overlay', 30000);
              const confirmDialog = createDialog('50%', 'auto', '600px');
              const confirmTextBg = createTextBackground(0.5);

              const confirmTitle = document.createElement('div');
              confirmTitle.style.cssText = `
                position: relative;
                z-index: 2;
                color: #fff;
                font: 700 20px/1.4 "STKaiti", "KaiTi", "Kaiti SC", "Songti SC", "Noto Serif SC", "Source Han Serif SC", "SimSun", Georgia, serif;
                margin-bottom: 20px;
                text-align: center;
              `;
              confirmTitle.textContent = '确认跳转';

              const confirmContent = document.createElement('div');
              confirmContent.style.cssText = `
                position: relative;
                z-index: 2;
                color: #fff;
                font: 400 16px/1.6 "STKaiti", "KaiTi", "Kaiti SC", "Songti SC", "Noto Serif SC", "Source Han Serif SC", "SimSun", Georgia, serif;
                margin-bottom: 20px;
                text-align: center;
                padding: 10px;
              `;
              confirmContent.textContent = `是否跳转到层 ${layer.layer}？\n这将丧失此层之后已有的进度。`;

              const buttonContainer = document.createElement('div');
              buttonContainer.style.cssText = `
                display: flex;
                gap: 15px;
                justify-content: center;
                position: relative;
                z-index: 2;
              `;

              const confirmButton = document.createElement('button');
              confirmButton.textContent = '确认';
              confirmButton.style.cssText = `
                padding: 10px 20px;
                font: 700 16px/1.4 "STKaiti", "KaiTi", "Kaiti SC", "Songti SC", "Noto Serif SC", "Source Han Serif SC", "SimSun", Georgia, serif;
                color: #fff;
                background: #8B4513;
                border: 2px solid #654321;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
              `;

              const cancelButton = document.createElement('button');
              cancelButton.textContent = '取消';
              cancelButton.style.cssText = `
                padding: 10px 20px;
                font: 700 16px/1.4 "STKaiti", "KaiTi", "Kaiti SC", "Songti SC", "Noto Serif SC", "Source Han Serif SC", "SimSun", Georgia, serif;
                color: #fff;
                background: #654321;
                border: 2px solid #8B4513;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
              `;

              // 按钮悬停效果
              confirmButton.addEventListener('mouseenter', () => {
                confirmButton.style.background = '#A0522D';
              });
              confirmButton.addEventListener('mouseleave', () => {
                confirmButton.style.background = '#8B4513';
              });

              cancelButton.addEventListener('mouseenter', () => {
                cancelButton.style.background = '#A0522D';
              });
              cancelButton.addEventListener('mouseleave', () => {
                cancelButton.style.background = '#654321';
              });

              // 确认跳转
              confirmButton.addEventListener('click', async () => {
                try {
                  logWithTag('JUMP', `开始跳转到层 ${layer.layer}`);
                  await jumpToDialogueLayer(layer);

                  // 关闭确认弹窗
                  confirmOverlay.remove();

                  // 关闭历史对话层弹窗
                  const questOverlay = document.getElementById('current-dialogue-overlay');
                  if (questOverlay) {
                    questOverlay.remove();
                  }

                  logWithTag('JUMP', '✅ 跳转完成');
                } catch (error) {
                  console.error('[JUMP] ❌ 跳转失败:', error);
                  alert('跳转失败: ' + (error.message || String(error)));
                }
              });

              // 取消
              cancelButton.addEventListener('click', () => {
                confirmOverlay.remove();
              });

              buttonContainer.appendChild(confirmButton);
              buttonContainer.appendChild(cancelButton);

              const closeBtn = createCloseButton();
              const closeDialog = createCloseDialogFunction(confirmOverlay, confirmDialog);
              closeBtn.addEventListener('click', closeDialog);
              confirmOverlay.addEventListener('click', (e) => {
                if (e.target === confirmOverlay) {
                  closeDialog();
                }
              });

              confirmDialog.appendChild(closeBtn);
              confirmDialog.appendChild(confirmTextBg);
              confirmDialog.appendChild(confirmTitle);
              confirmDialog.appendChild(confirmContent);
              confirmDialog.appendChild(buttonContainer);
              confirmOverlay.appendChild(confirmDialog);
              document.body.appendChild(confirmOverlay);
            });

            // 组装单框布局
            layerContainer.appendChild(layerNumber);
            layerContainer.appendChild(descriptionText);
            layerContainer.appendChild(jumpBtn);

            target.appendChild(layerContainer);
          });
        };

        const closeBtn = createCloseButton();
        const closeDialog = createCloseDialogFunction(overlay, dialog);

        closeBtn.addEventListener('click', closeDialog);
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) {
            closeDialog();
          }
        });

        dialog.appendChild(closeBtn);

        if (isBranchesMode) {
          title.textContent = '此刻可以做的事';
          renderBranches();
          dialog.appendChild(title);
          dialog.appendChild(contentContainer);
        } else {
          leftButtonGroup.appendChild(currentBtn);
          leftButtonGroup.appendChild(historyBtn);
          buttonContainer.appendChild(leftButtonGroup);

          const stack = document.createElement('div');
          stack.className = 'quest-log-stack';

          const dialoguePane = document.createElement('div');
          dialoguePane.className = 'quest-log-pane is-active';

          const historyPane = document.createElement('div');
          historyPane.className = 'quest-log-pane';
          historyPane.inert = true;
          historyPane.setAttribute('aria-hidden', 'true');

          fillCurrentLayer(dialoguePane);
          fillHistoryLayers(historyPane);
          stack.append(dialoguePane, historyPane);

          const showLogTab = (which) => {
            const showDialogue = which === 'dialogue';
            title.textContent = showDialogue ? '此刻的对话' : '往日的篇章';
            updateButtonStyle(showDialogue ? currentBtn : historyBtn, showDialogue ? historyBtn : currentBtn);
            dialoguePane.classList.toggle('is-active', showDialogue);
            historyPane.classList.toggle('is-active', !showDialogue);
            dialoguePane.inert = !showDialogue;
            historyPane.inert = showDialogue;
            if (showDialogue) {
              dialoguePane.removeAttribute('aria-hidden');
              historyPane.setAttribute('aria-hidden', 'true');
            } else {
              historyPane.removeAttribute('aria-hidden');
              dialoguePane.setAttribute('aria-hidden', 'true');
            }
            stack.scrollTop = 0;
          };

          currentBtn.addEventListener('click', () => showLogTab('dialogue'));
          historyBtn.addEventListener('click', () => showLogTab('history'));
          showLogTab(defaultView === 'history' ? 'history' : 'dialogue');

          dialog.appendChild(buttonContainer);
          dialog.appendChild(title);
          dialog.appendChild(stack);
        }

        overlay.appendChild(dialog);

        // 添加到页面
        document.body.appendChild(overlay);

        logWithTag('QUEST', '历史消息弹窗已创建');
      } catch (error) {
        console.error('[QUEST] showCurrentDialogueLayer 错误:', error);
        alert('打开历史消息失败: ' + (error.message || String(error)));
      }
    }

    // 设置存档功能
    function setupSaveFunctionality() {
      const saveBtn = document.getElementById('save-btn');
      const loadBtn = document.getElementById('load-btn');
      const deleteBtn = document.getElementById('delete-btn');
      const saveOverlay = document.getElementById('save-overlay');
      const saveCloseBtn = document.getElementById('save-close-btn');

      // 存档按钮
      if (saveBtn) {
        saveBtn.addEventListener('click', async () => {
          await saveCurrentDialogue();
        });
      }

      // 读档按钮
      if (loadBtn) {
        loadBtn.addEventListener('click', async () => {
          if (!currentArchiveName) {
            showArchiveNotification('请先选择一个存档', 'error');
            return;
          }
          await loadArchive(currentArchiveName);
        });
      }

      // 删除按钮
      if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
          // 检查是否有选中的存档
          if (!currentArchiveName) {
            showArchiveNotification('请先选择一个存档', 'error');
            return;
          }

          // 检查是否是自动存档
          if (currentArchiveName === '自动存档') {
            showArchiveNotification('自动存档不可删除', 'error');
            return;
          }

          // 显示确认删除弹窗
          showDeleteConfirmDialog(currentArchiveName, async () => {
            try {
              await storageUtils.archivesDB.deleteArchive(currentArchiveName);
              logWithTag('DELETE', `已删除存档: ${currentArchiveName}`);

              // 清除当前选中状态
              currentArchiveName = null;

              // 刷新存档列表
              await renderSaveArchiveList();
            } catch (error) {
              errorWithTag('DELETE', '删除存档失败', error);
              showArchiveNotification('删除存档失败，请查看控制台错误信息。', 'error');
            }
          });
        });
      }

      // 打开存档界面时刷新列表
      if (saveOverlay) {
        const observer = new MutationObserver(async (mutations) => {
          for (const mutation of mutations) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
              if (!saveOverlay.classList.contains('hidden')) {
                // 确保显示所有历史存档
                await renderSaveArchiveList();
              }
            }
          }
        });
        observer.observe(saveOverlay, { attributes: true });

        // 如果存档界面初始状态是打开的，也加载存档列表
        if (!saveOverlay.classList.contains('hidden')) {
          renderSaveArchiveList();
        }
      }

      // 关闭按钮
      if (saveCloseBtn) {
        saveCloseBtn.addEventListener('click', () => {
          if (saveOverlay) {
            saveOverlay.classList.add('hidden');
          }
        });
      }
    }

    // 存档界面关闭按钮
    const saveCloseBtn = document.getElementById('save-close-btn');
    if (saveCloseBtn) {
      saveCloseBtn.addEventListener('click', () => {
        const saveOverlay = document.getElementById('save-overlay');
        if (saveOverlay) {
          saveOverlay.classList.add('hidden');
        }
      });
    }

    // 确保资源列表界面的统计按钮和操作按钮正常工作
    // 这些按钮的ID已经在资源列表界面中，不需要额外处理

    // 统计按钮（切换显示/隐藏）
    const statsBtn = document.getElementById('settings-stats-btn');
    if (statsBtn) {
      statsBtn.addEventListener('click', toggleResourceStats);
    }

    // 重载一次按钮
    const reloadOnceBtn = document.getElementById('settings-reload-once-btn');
    if (reloadOnceBtn) {
      reloadOnceBtn.addEventListener('click', reloadSelectedOnce);
    }

    // 重载直到完成按钮
    const reloadUntilBtn = document.getElementById('settings-reload-until-btn');
    if (reloadUntilBtn) {
      reloadUntilBtn.addEventListener('click', reloadSelectedUntilComplete);
    }

    // 删除按钮
    const deleteBtn = document.getElementById('settings-delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', deleteSelectedResources);
    }

    // 开局预设对话（纯爱/正常共用正文，仅 系统.模式 不同）
    function buildOpeningPresetDialogues(gameMode = GAME_MODE_PURE_LOVE) {
      const mode = gameMode === GAME_MODE_NORMAL ? GAME_MODE_NORMAL : GAME_MODE_PURE_LOVE;
      return `<imotoshinkan>
<imotoshinkan_maintext>
<背景|卧室>
<托莉娜|SockW-P1|Normal|||啊，哥哥……>
<托莉娜|SockW-P1|Happy|||……我回来了哦，托莉娜，回到家了呢！>
<托莉娜|SockW-P1|Sad|||……嗯，确实是，很久不见了呢……已经连续两年，没能够跟哥哥见面……>
<托莉娜|SockW-P1|Happy|||托莉娜一直也在期待着，能够回到哥哥身边的今天哦！>
<托莉娜|SockW-P1|Shy1|||……啊，对不起！>
<托莉娜|SockW-P1|Shy2|||托莉娜，又尝试向哥哥撒娇了呢……>
<托莉娜|SockW-P1|Normal|||托莉娜呢，在寄宿学校那边，也是好好地努力了一番了哦？>
<托莉娜|SockW-P1|Happy|||就算哥哥不在身边也好，也努力地交朋友，努力地学习……>
<托莉娜|SockW-P1|Smile|||虽然还只是见习，但也已经成为神官了哦！>
<托莉娜|SockW-P1|Shy3|||所以才会想让哥哥好好见证托莉娜成长了的地方……>
<托莉娜|SockW-P1|Shy1|||但是一见面就想用力抱紧哥哥，果然还是不太好……吧？>
<托莉娜|SockW-P1|Happy|Brush||……啊，呼呼……原来哥哥才是更想撒娇的那一个吗？诶嘿嘿……>
<托莉娜|SockW-P1|Shy4|||只是今日的话，可以的吧……毕竟，终于能如此相见了……>
<托莉娜|SockW-P1|Happy|||托莉娜也是久违地……所以……会绝不放手地抱紧哦……呼呼♡>
<托莉娜|SockW-P1|Shock1|||……嗯嗯？哥、哥哥？抱得有点久哦…？>
<托莉娜|SockW-P1|Smile|||……嗯，哥哥也，一直觉得很寂寞呢。>
<托莉娜|SockW-P1|Normal|||不过还请放心，托莉娜，还会在这里待上好一会儿哦！>
<托莉娜|SockW-P1|Happy|||就是……作为见习神官，在镇上的教会也试着帮忙一下呢！>
<托莉娜|SockW-P1|Normal|||当然，如果到更远的地方想必也有更多可以选的工作……>
<托莉娜|SockW-P1|Shy2|||但托莉娜也还是只是见习……>
<托莉娜|SockW-P1|Happy|||在、在有十全把握前，就让托莉娜在故乡的这个阿德林顿，作为神官努力吧！>
<托莉娜|SockW-P1|Smile|||……啊，房子的事，就交给托莉娜吧！>
<托莉娜|SockW-P1|Normal|||哥哥，因为合成术的工作挺繁忙的吧？>
<托莉娜|SockW-P1|Shy1|||家中的这处那处也，稍微有点凌乱呢……>
<托莉娜|SockW-P1|Happy|||就让我们二人再一次手牵手，一起打理这个家吧，哥哥♡>
</imotoshinkan_maintext>

<imotoshinkan_branches>亲密|轻轻抚摸托莉娜的头发
亲密|紧紧拥抱托莉娜
日常|询问寄宿学校的生活细节
日常|提议一起整理这个有点凌乱的家
移动|出门去镇上熟悉一下久违的环境
推荐|先让她休息，自己去准备早餐
观察或被动|安静地坐在一旁，看她忙碌的身影
快进时间|把时间拨到傍晚，看看她整理完房间后的样子</imotoshinkan_branches>

<imotoshinkan_snapshots>1|星期一|08:00|托莉娜结束两年的寄宿学校生活回到家中，与哥哥{{user}}久别重逢，表达了思念之情，并表示将在本地教会担任见习神官</imotoshinkan_snapshots>

<imotoshinkan_variables>
_.set('stat_data.系统.时间.当前时间', '早')
_.set('stat_data.系统.时间.小时', 8)
_.set('stat_data.系统.时间.分钟', 0)
_.set('stat_data.系统.时间.已经过天数', 0)
_.set('stat_data.系统.时间.星期', '星期一')
_.set('stat_data.系统.地点.当前地点', '家')
_.set('stat_data.系统.地点.托莉娜地点', '家')
_.set('stat_data.托莉娜.行程.同行状态', '同行')
_.set('stat_data.系统.模式', '${mode}')
</imotoshinkan_variables>
</imotoshinkan>`;
    }

    // 更新退出按钮位置
    function updateMenuExitBtnPosition() {
      const exitBtn = document.getElementById('game-menu-exit-btn');
      const menuContainer = document.getElementById('game-menu-container');
      if (!exitBtn || !menuContainer) return;

      // 等待一帧，确保容器宽度已更新
      requestAnimationFrame(() => {
        const screenWidth = window.innerWidth;
        const containerWidth = menuContainer.offsetWidth || parseFloat(menuContainer.style.width) || screenWidth;

        // 如果屏幕宽度大于图片宽度，显示在图片的右上角（相对于菜单容器）
        // 如果屏幕宽度小于图片宽度，显示在屏幕的右上角（相对于视口）
        if (screenWidth > containerWidth) {
          // 屏幕大于图片：使用absolute定位，相对于菜单容器
          exitBtn.style.position = 'absolute';
          exitBtn.style.top = '15px';
          exitBtn.style.right = '15px';
          exitBtn.style.left = 'auto';
          exitBtn.style.transform = 'none';
        } else {
          // 屏幕小于图片：使用fixed定位，相对于视口右上角
          exitBtn.style.position = 'fixed';
          exitBtn.style.top = '15px';
          exitBtn.style.right = '15px';
          exitBtn.style.left = 'auto';
          exitBtn.style.transform = 'none';
        }
      });
    }

    // 更新菜单界面托莉娜立绘（根据当前阶段）
    async function updateMenuTorinaSprite() {
      const torinaSprite = document.getElementById('game-menu-torina-sprite');
      logWithTag('菜单', '更新托莉娜立绘，元素:', torinaSprite);
      if (!torinaSprite) {
        warnWithTag('菜单', '托莉娜立绘元素不存在');
        return;
      }

      try {
        // 当前运行时值就是最后对话层快照，所以直接使用 ERA.currentVars 或最后对话层快照
        const lastLayer = getLastDialogueLayer();
        let varsSnapshot = null;

        if (lastLayer && getLayerVars(lastLayer)) {
          // 优先使用最后对话层的快照（它应该就是 ERA.currentVars）
          varsSnapshot = getLayerVars(lastLayer);
          logWithTag('菜单', '使用最后对话层快照（当前运行时值）');
        } else if (ERA.currentVars) {
          // 如果没有对话层，使用 ERA.currentVars
          varsSnapshot = ERA.currentVars;
          logWithTag('菜单', '使用 ERA.currentVars（当前运行时值）');
        } else {
          // 如果都没有，使用 getvar 获取（会尝试从 ERA 查询）
          const stage = await getvar('stat_data.托莉娜.基础.堕落阶段');
          const stageNum = parseInt(stage, 10) || 1;
          logWithTag('菜单', '从 getvar 获取阶段:', stageNum);
          updateTorinaSpriteByStage(torinaSprite, stageNum);
          return;
        }

        // 从变量快照中获取阶段
        // varsSnapshot 的结构是 { 托莉娜: { 基础: { 堕落阶段: 4 } } }（不包含 stat_data 前缀）
        const stage = getNestedValue(varsSnapshot, '托莉娜.基础.堕落阶段');
        const stageNum = parseInt(stage, 10) || 1;
        logWithTag('菜单', '从当前运行时值获取阶段:', stage, '->', stageNum);

        updateTorinaSpriteByStage(torinaSprite, stageNum);
      } catch (error) {
        warnWithTag('菜单', '获取托莉娜阶段失败，使用默认立绘:', error);
        // 使用默认阶段1的图片
        updateTorinaSpriteByStage(torinaSprite, 1);
      }
    }

      // ==================== Hstatus表界面 ====================
      // Hstatus 界面资源（数据来自 resource/game-assets.js）
      const HSTATUS_ASSETS = (window.妹神官_gameAssets && window.妹神官_gameAssets.hstatusAssets) || {};

      // 界面状态管理：纯爱头部界面 / 纯爱主界面 / 纯爱胸部界面 / 纯爱足部界面
      let hstatusViewMode = 'main'; // 'head' = 纯爱头部界面, 'main' = 纯爱主界面, 'chest' = 纯爱胸部界面, 'crotch' = 阴部界面, 'foot' = 纯爱足部界面
      let hstatusLayerMode = 'outer'; // 'outer' = 表, 'inner' = 里
      /** 打开 Hstatus 时使用的初始层/视图（调试用，用后清空） */
      let hstatusPendingOpenState = null;
      let hstatusResizeHandler = null; // 用于关闭时移除 resize 监听
      let hstatusPositionIntervalId = null; // 用于关闭时清除每秒监听
      let clothesMaskRafId = null;
      let clothesMaskTimerId = null;
      let hstatusSpritePhaseTimerId = null;
      let wombPopupFadeTimerId = null;
      let wombPopupHideTimerId = null;
      let hstatusLayerSwitchTimers = [];

      function clearHstatusLayerSwitchTimers() {
        hstatusLayerSwitchTimers.forEach(id => clearTimeout(id));
        hstatusLayerSwitchTimers = [];
      }

      function scheduleHstatusLayerSwitchTimer(fn, ms) {
        const id = setTimeout(fn, ms);
        hstatusLayerSwitchTimers.push(id);
        return id;
      }

      function getHstatusLayerCrossfadeMs() {
        const container = document.querySelector('.hstatus-table-container');
        if (!container) return 1000;
        const n = parseInt(getComputedStyle(container).getPropertyValue('--hstatus-layer-crossfade-ms'), 10);
        return Number.isFinite(n) ? n : 1000;
      }

      function setHstatusTableLayersVisible(instant = true) {
        const outerStack = document.getElementById('hstatus-outer-stack');
        const innerGroup = document.getElementById('hstatus-inner-group');
        const outerHighlight = document.getElementById('hstatus-outer-highlight');
        const isInner = hstatusLayerMode === 'inner';
        const apply = () => {
          if (outerStack) {
            outerStack.style.opacity = isInner ? '0' : '1';
            outerStack.style.pointerEvents = isInner ? 'none' : 'auto';
          }
          if (innerGroup) {
            innerGroup.style.opacity = isInner ? '1' : '0';
            innerGroup.classList.toggle('show', isInner);
            innerGroup.style.pointerEvents = isInner ? 'auto' : 'none';
          }
          if (outerHighlight) {
            outerHighlight.style.opacity = isInner ? '0' : '1';
            outerHighlight.style.visibility = isInner ? 'hidden' : 'visible';
          }
        };
        if (instant) {
          [outerStack, innerGroup, outerHighlight].forEach(el => {
            if (el) el.style.transition = 'none';
          });
          apply();
          requestAnimationFrame(() => {
            [outerStack, innerGroup, outerHighlight].forEach(el => {
              if (el) el.style.transition = '';
            });
          });
        } else {
          apply();
        }
      }

      function getHstatusHstatePrefix() {
        if (hstatusLayerMode === 'inner') return '托莉娜.Hstate正常.里';
        return isPureLoveMode() ? '托莉娜.Hstate纯爱.表' : '托莉娜.Hstate正常.表';
      }

      function isNormalOuterHstatus() {
        return hstatusLayerMode === 'outer' && !isPureLoveMode();
      }

      /** 正常模式·表/里：同步容器 class，用于里界面阴部镜头等样式 */
      function syncHstatusLayerContainerClass() {
        const container = document.querySelector('.hstatus-table-container');
        if (!container) return;
        const isInner = hstatusLayerMode === 'inner';
        container.classList.toggle('hstatus-layer-inner', isInner);
        container.classList.toggle('hstatus-layer-outer', !isInner);
      }

      /** 正常模式·表界面：左侧文字面板锚点（头部左上 / 胸足左中） */
      function applyNormalOuterLeftPanelAnchor(leftPanel) {
        if (!leftPanel) return;
        leftPanel.classList.remove('hstatus-normal-outer-head', 'hstatus-normal-outer-mid');
        if (!isNormalOuterHstatus()) return;
        if (hstatusViewMode === 'head') {
          leftPanel.classList.add('hstatus-normal-outer-head');
        } else if (hstatusViewMode === 'chest' || hstatusViewMode === 'crotch') {
          leftPanel.classList.add('hstatus-normal-outer-mid');
        }
      }

      /** 里界面：献出初夜的对象为空或「暂无」→处女，否则非处女 */
      function resolveInnerVirginStatusLabel(firstNightPartner) {
        const v = firstNightPartner == null ? '' : String(firstNightPartner).trim();
        return !v || v === '暂无' ? '处女' : '非处女';
      }

      /** 里界面堕落阶段行：始终读托莉娜.基础.堕落阶段 */
      function getBaseCorruptionStage(varsSnapshot) {
        if (!varsSnapshot) return 1;
        const stage = parseInt(getNestedValue(varsSnapshot, '托莉娜.基础.堕落阶段'), 10);
        return Number.isFinite(stage) ? stage : 1;
      }

      /** 表界面：纯爱启用服装镂空，正常禁用；里界面保持启用 */
      function shouldUseHstatusClothesMask() {
        if (hstatusLayerMode === 'inner') return true;
        return isPureLoveMode();
      }

      /** 纯爱模式禁止进入里 Hstatus */
      function canEnterHstatusInnerLayer() {
        return !isPureLoveMode();
      }

      function shouldShowHstatusOuterRightCursor() {
        return hstatusLayerMode === 'outer' && canEnterHstatusInnerLayer();
      }

      /** 子宫透视图：里界面始终可显示；表界面仅纯爱模式 */
      function shouldShowHstatusWombPopup() {
        if (hstatusViewMode !== 'crotch') return false;
        if (hstatusLayerMode === 'inner') return true;
        return isPureLoveMode();
      }

      // 根据屏幕宽高比更新左右文字面板边距
      const HSTATUS_FONT_MIN_PX = 14;
      const HSTATUS_FONT_MAX_PX = 20;
      /** 竖屏字号上限 */
      const HSTATUS_FONT_PORTRAIT_MAX_PX = 28;
      const HSTATUS_FONT_VW_RATIO = 0.018;
      const HSTATUS_FONT_VH_RATIO = 0.019;
      /** 竖屏参考宽度：窄于此宽度时按宽度反比继续放大 */
      const HSTATUS_PORTRAIT_REF_WIDTH_PX = 390;

      function computeHstatusTextFontPx(w, h) {
        const ratio = w / h;
        if (ratio >= 1) {
          return Math.min(HSTATUS_FONT_MAX_PX, Math.max(HSTATUS_FONT_MIN_PX, w * HSTATUS_FONT_VW_RATIO));
        }
        // 竖屏：基准跟高度走（不随宽度变窄而缩小），宽越窄再额外放大
        const baseFromHeight = Math.min(HSTATUS_FONT_MAX_PX, Math.max(HSTATUS_FONT_MIN_PX, h * HSTATUS_FONT_VH_RATIO));
        const aspectBoost = 1 + (1 - ratio) * 0.45;
        const widthBoost = Math.min(1.55, Math.max(1, HSTATUS_PORTRAIT_REF_WIDTH_PX / Math.max(w, 260)));
        return Math.min(
          HSTATUS_FONT_PORTRAIT_MAX_PX,
          Math.max(HSTATUS_FONT_MIN_PX, baseFromHeight * aspectBoost * widthBoost),
        );
      }

      function updateHstatusTextPanelPosition() {
        const container = document.querySelector('.hstatus-table-container');
        if (!container) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const ratio = w / h;
        const RATIO_WIDE = 16 / 9;
        const RATIO_NARROW = 9 / 16;
        const INSET_WIDE = 30;
        const INSET_NARROW = 10;
        let percent = INSET_WIDE;
        if (ratio <= RATIO_NARROW) {
          percent = INSET_NARROW;
        } else if (ratio < RATIO_WIDE) {
          percent = INSET_NARROW + (INSET_WIDE - INSET_NARROW) * (ratio - RATIO_NARROW) / (RATIO_WIDE - RATIO_NARROW);
        }
        container.style.setProperty('--hstatus-text-inset-percent', percent + '%');
        container.style.setProperty('--hstatus-text-font-size', `${computeHstatusTextFontPx(w, h)}px`);
        container.style.setProperty('--hstatus-head-arc-radius', `${Math.min(w, h) * 0.5}px`);
        container.style.setProperty('--hstatus-head-arc-center-x', `${w * HSTATUS_LEFT_ARC_CENTER_X_RATIO}px`);
        container.style.setProperty('--hstatus-head-arc-center-y', `${h * HSTATUS_LEFT_ARC_CENTER_Y_RATIO}px`);
        const leftContent = document.getElementById('hstatus-text-content-left');
        if (leftContent?.classList.contains('hstatus-left-text-arc')) {
          scheduleHstatusLeftArcLayout(leftContent);
        }
      }

      /** 左侧文字圆弧：圆心水平视口宽 40%、垂直居中；半径 min(宽,高)×50% */
      const HSTATUS_LEFT_ARC_CENTER_X_RATIO = 0.4;
      const HSTATUS_LEFT_ARC_CENTER_Y_RATIO = 0.5;
      /** 左侧字幕行左缘不得超出视口（px） */
      const HSTATUS_LEFT_ARC_MIN_LEFT_PX = 0;
      const HSTATUS_LEFT_ARC_LINE_HEIGHT_RATIO = 1.8;
      /** 上下留白，避免贴边 */
      const HSTATUS_LEFT_ARC_VERTICAL_MARGIN_RATIO = 0.03;
      const HSTATUS_LEFT_ARC_NARROW_RATIO = 16 / 9;
      /** 窄屏字号：与宽屏 clamp 上限一致，仅适度放大 */
      const HSTATUS_LEFT_ARC_MIN_FONT_PX = 14;
      const HSTATUS_LEFT_ARC_MAX_FONT_PX = 20;
      const HSTATUS_LEFT_ARC_NARROW_FONT_VW = 0.04;
      /** 里·头部 18 行台本时圆心行索引（最喜欢的口交对象是 / 空行 / 与你之外口交次数） */
      const HSTATUS_INNER_HEAD_ARC_CENTER_LINE_INDEX = 9;

      function clearHstatusLeftArcLayout(leftContent, leftPanel) {
        if (leftContent) {
          leftContent.classList.remove('hstatus-left-text-arc');
          delete leftContent.dataset.arcCenterIndex;
          leftContent.querySelectorAll('.hstatus-text-line').forEach(line => {
            line.style.position = '';
            line.style.left = '';
            line.style.top = '';
            line.style.width = '';
            line.style.removeProperty('font-size');
            line.style.removeProperty('line-height');
            line.style.removeProperty('height');
          });
          leftContent.style.removeProperty('font-size');
        }
        if (leftPanel) leftPanel.classList.remove('hstatus-left-text-arc-mode');
      }

      function resolveHstatusLeftArcCenterLineIndex(leftContent) {
        const custom = leftContent.dataset.arcCenterIndex;
        if (custom !== undefined && custom !== '') {
          const n = parseInt(custom, 10);
          if (Number.isFinite(n)) return n;
        }
        const lines = leftContent.querySelectorAll('.hstatus-text-line');
        return Math.max(0, Math.floor((lines.length - 1) / 2));
      }

      function resetHstatusLeftArcFontSize(leftContent) {
        if (!leftContent) return;
        leftContent.style.removeProperty('font-size');
        leftContent.querySelectorAll('.hstatus-text-line').forEach(line => {
          line.style.removeProperty('font-size');
          line.style.removeProperty('line-height');
          line.style.removeProperty('height');
        });
      }

      /** 窄屏：适度放大字号（有上限），若仍超高则按行数缩小至不越界 */
      function applyHstatusLeftArcFontSize(leftContent, lineCount) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const ratio = w / h;
        if (ratio >= HSTATUS_LEFT_ARC_NARROW_RATIO) {
          resetHstatusLeftArcFontSize(leftContent);
          return null;
        }

        const marginY = h * HSTATUS_LEFT_ARC_VERTICAL_MARGIN_RATIO;
        const availableH = h - marginY * 2;
        const fitFont = availableH / (lineCount * HSTATUS_LEFT_ARC_LINE_HEIGHT_RATIO);
        const arcMaxFontPx = ratio < 1 ? HSTATUS_FONT_PORTRAIT_MAX_PX : HSTATUS_LEFT_ARC_MAX_FONT_PX;
        const preferredFont = Math.min(
          arcMaxFontPx,
          Math.max(HSTATUS_LEFT_ARC_MIN_FONT_PX, computeHstatusTextFontPx(w, h)),
        );
        const portraitFitScale = ratio < 1
          ? Math.min(1.25, Math.max(1, HSTATUS_PORTRAIT_REF_WIDTH_PX / Math.max(w, 260)))
          : 1;
        const fontSize = Math.max(
          HSTATUS_LEFT_ARC_MIN_FONT_PX,
          Math.min(preferredFont, fitFont * portraitFitScale),
        );
        const fontPx = `${fontSize}px`;
        const lineHeightStr = String(HSTATUS_LEFT_ARC_LINE_HEIGHT_RATIO);
        const lineHeightPx = fontSize * HSTATUS_LEFT_ARC_LINE_HEIGHT_RATIO;

        leftContent.style.fontSize = fontPx;
        leftContent.querySelectorAll('.hstatus-text-line').forEach((line) => {
          line.style.fontSize = fontPx;
          line.style.lineHeight = lineHeightStr;
          if (!line.textContent?.trim()) {
            line.style.height = `${lineHeightPx}px`;
          } else {
            line.style.removeProperty('height');
          }
        });
        return lineHeightPx;
      }

      function positionHstatusLeftArcLines(lines, cx, cy, r, centerLineIndex, lineHeightPx) {
        lines.forEach((line, i) => {
          const yCenter = cy + (i - centerLineIndex) * lineHeightPx;
          const dy = yCenter - cy;
          let xLeft = cx;
          if (Math.abs(dy) <= r) {
            xLeft = cx - Math.sqrt(r * r - dy * dy);
          }
          xLeft = Math.max(HSTATUS_LEFT_ARC_MIN_LEFT_PX, xLeft);
          line.style.position = 'absolute';
          line.style.left = `${xLeft}px`;
          line.style.top = `${yCenter - lineHeightPx / 2}px`;
          line.style.textIndent = '0';
          line.style.margin = '0';
          line.style.width = 'max-content';
        });

        lines.forEach((line) => {
          const rect = line.getBoundingClientRect();
          if (rect.left < HSTATUS_LEFT_ARC_MIN_LEFT_PX) {
            const currentLeft = parseFloat(line.style.left) || 0;
            line.style.left = `${currentLeft + (HSTATUS_LEFT_ARC_MIN_LEFT_PX - rect.left)}px`;
          }
        });
      }

      function layoutHstatusLeftArcLines(leftContent) {
        if (!leftContent?.classList.contains('hstatus-left-text-arc')) return;
        const lines = leftContent.querySelectorAll('.hstatus-text-line');
        if (!lines.length) return;

        const cx = window.innerWidth * HSTATUS_LEFT_ARC_CENTER_X_RATIO;
        const cy = window.innerHeight * HSTATUS_LEFT_ARC_CENTER_Y_RATIO;
        const r = Math.min(window.innerWidth, window.innerHeight) * 0.5;
        const centerLineIndex = resolveHstatusLeftArcCenterLineIndex(leftContent);
        const h = window.innerHeight;
        const marginY = h * HSTATUS_LEFT_ARC_VERTICAL_MARGIN_RATIO;
        const isNarrow = window.innerWidth / h < HSTATUS_LEFT_ARC_NARROW_RATIO;

        let lineHeightPx = applyHstatusLeftArcFontSize(leftContent, lines.length);
        if (lineHeightPx === null) {
          const firstLine = lines[0];
          const computed = getComputedStyle(firstLine);
          lineHeightPx = firstLine.offsetHeight
            || parseFloat(computed.height)
            || parseFloat(computed.lineHeight)
            || 28;
        }

        positionHstatusLeftArcLines(lines, cx, cy, r, centerLineIndex, lineHeightPx);

        if (!isNarrow) return;

        for (let attempt = 0; attempt < 8; attempt++) {
          const firstTop = lines[0].getBoundingClientRect().top;
          const lastBottom = lines[lines.length - 1].getBoundingClientRect().bottom;
          if (firstTop >= marginY && lastBottom <= h - marginY) break;

          const currentFont = parseFloat(getComputedStyle(lines[0]).fontSize) || HSTATUS_LEFT_ARC_MIN_FONT_PX;
          if (currentFont <= HSTATUS_LEFT_ARC_MIN_FONT_PX) break;

          const nextFont = Math.max(HSTATUS_LEFT_ARC_MIN_FONT_PX, currentFont * 0.92);
          const fontPx = `${nextFont}px`;
          const nextLineHeight = nextFont * HSTATUS_LEFT_ARC_LINE_HEIGHT_RATIO;
          leftContent.style.fontSize = fontPx;
          lines.forEach((line) => {
            line.style.fontSize = fontPx;
            line.style.lineHeight = String(HSTATUS_LEFT_ARC_LINE_HEIGHT_RATIO);
            if (!line.textContent?.trim()) {
              line.style.height = `${nextLineHeight}px`;
            }
          });
          lineHeightPx = nextLineHeight;
          positionHstatusLeftArcLines(lines, cx, cy, r, centerLineIndex, lineHeightPx);
        }
      }

      function scheduleHstatusLeftArcLayout(leftContent) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => layoutHstatusLeftArcLines(leftContent));
        });
      }

      function enableHstatusLeftArcLayout(leftContent, leftPanel) {
        if (!leftContent) return;
        const lines = leftContent.querySelectorAll('.hstatus-text-line');
        if (!lines.length) return;
        if (hstatusLayerMode === 'inner' && hstatusViewMode === 'head') {
          leftContent.dataset.arcCenterIndex = String(HSTATUS_INNER_HEAD_ARC_CENTER_LINE_INDEX);
        }
        leftContent.classList.add('hstatus-left-text-arc');
        if (leftPanel) leftPanel.classList.add('hstatus-left-text-arc-mode');
        scheduleHstatusLeftArcLayout(leftContent);
      }

      // 打开Hstatus表界面
      function openHstatusTable() {
      // 检查是否已存在界面，如果存在则先移除
      let overlay = document.getElementById('hstatus-table-overlay');
      if (overlay) {
        overlay.remove();
      }

      // 创建全屏遮罩层
      overlay = document.createElement('div');
      overlay.className = 'hstatus-table-overlay';
      overlay.id = 'hstatus-table-overlay';

      // 创建容器
      const container = document.createElement('div');
      container.className = 'hstatus-table-container';

      // 创建Hstatus表组（包含三张图片的容器）
      const tableGroup = document.createElement('div');
      tableGroup.className = 'hstatus-table-group';
      tableGroup.id = 'hstatus-table-group';

      // 创建底图（最底层）
      const bgImage = document.createElement('img');
      bgImage.className = 'hstatus-table-bg';
      bgImage.id = 'hstatus-table-bg';
      bgImage.src = HSTATUS_ASSETS.outerBg;
      bgImage.alt = 'Hstatus表底图';

      // 创建表图（中间层）
      const mainImage = document.createElement('img');
      mainImage.className = 'hstatus-table-main';
      mainImage.id = 'hstatus-table-main';
      mainImage.src = HSTATUS_ASSETS.outerMain;
      mainImage.alt = 'Hstatus表表图';

      // 创建高光（最上层）
      const highlightImage = document.createElement('img');
      highlightImage.className = 'hstatus-table-highlight';
      highlightImage.id = 'hstatus-table-highlight';
      highlightImage.src = HSTATUS_ASSETS.outerHighlight;
      highlightImage.alt = 'Hstatus表高光';

      const outerStack = document.createElement('div');
      outerStack.className = 'hstatus-outer-stack';
      outerStack.id = 'hstatus-outer-stack';
      outerStack.appendChild(bgImage);
      outerStack.appendChild(mainImage);
      outerStack.appendChild(highlightImage);

      // 里 Hstatus 图层组（默认隐藏）
      const innerGroup = document.createElement('div');
      innerGroup.className = 'hstatus-inner-group';
      innerGroup.id = 'hstatus-inner-group';

      const innerBgImage = document.createElement('img');
      innerBgImage.className = 'hstatus-inner-bg';
      innerBgImage.id = 'hstatus-inner-bg';
      innerBgImage.src = HSTATUS_ASSETS.innerBg;
      innerBgImage.alt = 'Hstatus里底图';

      const innerFgImage = document.createElement('img');
      innerFgImage.className = 'hstatus-inner-fg';
      innerFgImage.id = 'hstatus-inner-fg';
      innerFgImage.src = HSTATUS_ASSETS.innerFg;
      innerFgImage.alt = 'Hstatus里表图';

      const innerHighlightImage = document.createElement('img');
      innerHighlightImage.className = 'hstatus-inner-highlight';
      innerHighlightImage.id = 'hstatus-inner-highlight';
      innerHighlightImage.src = HSTATUS_ASSETS.innerHighlight;
      innerHighlightImage.alt = 'Hstatus里高光';

      innerGroup.appendChild(innerBgImage);
      innerGroup.appendChild(innerFgImage);
      innerGroup.appendChild(innerHighlightImage);

      // 边框框体（表/里均叠在最上层）
      const frameImage = document.createElement('img');
      frameImage.className = 'hstatus-table-frame';
      frameImage.id = 'hstatus-table-frame';
      frameImage.src = HSTATUS_ASSETS.frame;
      frameImage.alt = 'Hstatus边框';

      // 创建退出按钮（右上角）
      const exitBtn = document.createElement('img');
      exitBtn.className = 'hstatus-table-exit-btn';
      exitBtn.id = 'hstatus-table-exit-btn';
      exitBtn.src = HSTATUS_ASSETS.exitBtn; // 使用通用退出按钮图片
      exitBtn.alt = '退出';
      exitBtn.title = '退出';

      // 退出按钮点击事件：关闭Hstatus表界面
      exitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeHstatusTable();
      });

      // 点击遮罩层（非图片区域）也可以关闭界面
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target === tableGroup) {
          closeHstatusTable();
        }
      });

      // 组装结构：将图片添加到Hstatus表组中
      tableGroup.appendChild(outerStack);
      tableGroup.appendChild(innerGroup);

      // 创建Hstatus立绘遮罩容器（外层固定遮罩，负责裁剪）
      const maskWrapper = document.createElement('div');
      maskWrapper.className = 'mask-wrapper';
      maskWrapper.id = 'hstatus-mask-wrapper';

      // 创建Hstatus立绘抖动容器（内层，应用抖动动画）
      const characterShake = document.createElement('div');
      characterShake.className = 'character-shake';
      characterShake.id = 'hstatus-character-shake';

      // 创建立绘图片容器（用于叠加body和clothes）
      const spriteImages = document.createElement('div');
      spriteImages.className = 'hstatus-sprite-images';
      spriteImages.id = 'hstatus-sprite-images';

      // 创建角色立绘（Body，最底层）
      const spriteBody = document.createElement('img');
      spriteBody.className = 'hstatus-sprite-body';
      spriteBody.id = 'hstatus-sprite-body';
      spriteBody.alt = 'Hstatus角色立绘';

      // 精液叠加层（在立绘之上、服装之下，不参与服装遮罩）
      const spriteCumChest = document.createElement('img');
      spriteCumChest.className = 'hstatus-sprite-cum hstatus-sprite-cum-chest';
      spriteCumChest.id = 'hstatus-sprite-cum-chest';
      spriteCumChest.alt = '胸部精液';
      const spriteCumBelly = document.createElement('img');
      spriteCumBelly.className = 'hstatus-sprite-cum hstatus-sprite-cum-belly';
      spriteCumBelly.id = 'hstatus-sprite-cum-belly';
      spriteCumBelly.alt = '腹部精液';
      const spriteCumLeg = document.createElement('img');
      spriteCumLeg.className = 'hstatus-sprite-cum hstatus-sprite-cum-leg';
      spriteCumLeg.id = 'hstatus-sprite-cum-leg';
      spriteCumLeg.alt = '腿部精液';

      // 创建角色服装（Clothes，叠加在立绘与精液层之上）
      const spriteClothes = document.createElement('img');
      spriteClothes.className = 'hstatus-sprite-clothes';
      spriteClothes.id = 'hstatus-sprite-clothes';
      spriteClothes.alt = 'Hstatus角色服装';

      // 将立绘与精液层、服装添加到图片容器中（顺序：body → cum → clothes，层级由 z-index 控制）
      spriteImages.appendChild(spriteBody);
      spriteImages.appendChild(spriteCumChest);
      spriteImages.appendChild(spriteCumBelly);
      spriteImages.appendChild(spriteCumLeg);
      spriteImages.appendChild(spriteClothes);

      // 立绘遮罩层（仅包裹立绘，子宫弹窗在抖动容器内但不在此层内，故不受最外层遮罩影响）
      const spriteMaskWrap = document.createElement('div');
      spriteMaskWrap.className = 'hstatus-sprite-mask-wrap';
      spriteMaskWrap.id = 'hstatus-sprite-mask-wrap';
      spriteMaskWrap.appendChild(spriteImages);
      characterShake.appendChild(spriteMaskWrap);
      // 子宫精液弹窗（与立绘同属 characterShake，抖动完全一致；不在 sprite-mask-wrap 内故不受径向遮罩影响）
      const wombPopup = document.createElement('img');
      wombPopup.className = 'hstatus-womb-popup';
      wombPopup.id = 'hstatus-womb-popup';
      wombPopup.alt = '子宫精液';
      characterShake.appendChild(wombPopup);

      // 将抖动容器添加到遮罩容器中
      maskWrapper.appendChild(characterShake);

      // 创建文字面板容器
      const textPanelsContainer = document.createElement('div');
      textPanelsContainer.className = 'hstatus-text-panels';
      textPanelsContainer.id = 'hstatus-text-panels';

      // 创建左侧文字面板
      const leftPanel = document.createElement('div');
      leftPanel.className = 'hstatus-text-panel-left';
      leftPanel.id = 'hstatus-text-panel-left';
      const leftContent = document.createElement('div');
      leftContent.className = 'hstatus-text-content';
      leftContent.id = 'hstatus-text-content-left';
      leftPanel.appendChild(leftContent);

      // 创建右侧文字面板
      const rightPanel = document.createElement('div');
      rightPanel.className = 'hstatus-text-panel-right';
      rightPanel.id = 'hstatus-text-panel-right';
      const rightContent = document.createElement('div');
      rightContent.className = 'hstatus-text-content';
      rightContent.id = 'hstatus-text-content-right';
      rightPanel.appendChild(rightContent);

      textPanelsContainer.appendChild(leftPanel);
      textPanelsContainer.appendChild(rightPanel);

      // 创建外层高光层（平行四边形遮罩从左往右移动）
      const outerHighlight = document.createElement('img');
      outerHighlight.className = 'hstatus-outer-highlight';
      outerHighlight.id = 'hstatus-outer-highlight';
      outerHighlight.src = HSTATUS_ASSETS.outerHighlight;
        outerHighlight.alt = 'Hstatus外层高光';

        // 重置界面状态（调试可指定里/头部等初始视图）
        if (hstatusPendingOpenState) {
          hstatusViewMode = hstatusPendingOpenState.view || 'main';
          hstatusLayerMode = hstatusPendingOpenState.layer || 'outer';
          hstatusPendingOpenState = null;
        } else {
          hstatusViewMode = 'main';
          hstatusLayerMode = 'outer';
        }
        syncHstatusLayerContainerClass();
        setHstatusTableLayersVisible();

      // 淡出文字和箭头的函数（立绘服装不消失）
      function fadeOutTextAndSprite() {
        const textPanels = document.getElementById('hstatus-text-panels');
        // 获取所有可能的箭头元素
        const cursorDownEl = document.getElementById('hstatus-cursor-down');
        const cursorRightEl = document.getElementById('hstatus-cursor-right');
        const cursorUpEl = document.getElementById('hstatus-cursor-up');
        const cursorUpMainEl = document.getElementById('hstatus-cursor-up-main');
        const cursorDownChestEl = document.getElementById('hstatus-cursor-down-chest');
        const cursorRightSubEl = document.getElementById('hstatus-cursor-right-sub');
        const cursorRightHeadEl = document.getElementById('hstatus-cursor-right-head');
        const cursorRightFootEl = document.getElementById('hstatus-cursor-right-foot');
        const cursorLeftEl = document.getElementById('hstatus-cursor-left');

        if (textPanels) {
          // 先移除所有淡入淡出类，重置状态，确保可以反复触发动画
          textPanels.classList.remove('hstatus-fade-out');
          textPanels.classList.remove('hstatus-fade-in');
          // 强制重排，确保状态重置
          void textPanels.offsetHeight;
          // 重新添加淡出类，触发动画
          textPanels.classList.add('hstatus-fade-out');
        }
        // 不淡出立绘（maskWrapper），保持立绘和服装显示
        // 淡出所有箭头（箭头也需要重置才能反复触发）
        const arrows = [cursorDownEl, cursorRightEl, cursorUpEl, cursorUpMainEl, cursorDownChestEl, cursorRightSubEl, cursorRightHeadEl, cursorRightFootEl, cursorLeftEl];
        arrows.forEach(arrow => {
          if (arrow) {
            arrow.classList.remove('hstatus-fade-out');
            void arrow.offsetHeight; // 强制重排
            arrow.classList.add('hstatus-fade-out');
          }
        });
      }

      // 只淡出文字的函数（不淡出箭头）
      function fadeOutTextOnly() {
        const textPanels = document.getElementById('hstatus-text-panels');
        if (textPanels) {
          // 先移除所有淡入淡出类，重置状态，确保可以反复触发动画
          textPanels.classList.remove('hstatus-fade-out');
          textPanels.classList.remove('hstatus-fade-in');
          // 强制重排，确保状态重置
          void textPanels.offsetHeight;
          // 重新添加淡出类，触发动画
          textPanels.classList.add('hstatus-fade-out');
        }
      }

      // 淡入文字的函数（反向执行淡出）
      function fadeInText() {
        const textPanels = document.getElementById('hstatus-text-panels');
        if (textPanels) {
          // 先移除所有淡入淡出类，重置状态，确保可以反复触发动画
          textPanels.classList.remove('hstatus-fade-out');
          textPanels.classList.remove('hstatus-fade-in');
          // 设置透明度为0作为起始状态
          textPanels.style.opacity = '0';
          // 强制重排，确保状态重置
          void textPanels.offsetHeight;
          // 重新添加淡入类，触发动画
          textPanels.classList.add('hstatus-fade-in');
        }
      }

      const HSTATUS_SPRITE_TRANSITION_MS = 2000;
      const HSTATUS_TEXT_REVEAL_DELAY_MS = 1500;

      function getHstatusTransitionTiming() {
        const container = document.querySelector('.hstatus-table-container');
        if (!container) {
          return { spriteMs: HSTATUS_SPRITE_TRANSITION_MS, textDelayMs: HSTATUS_TEXT_REVEAL_DELAY_MS };
        }
        const style = getComputedStyle(container);
        const parseMs = (value, fallback) => {
          const n = parseInt(String(value).trim(), 10);
          return Number.isFinite(n) ? n : fallback;
        };
        return {
          spriteMs: parseMs(style.getPropertyValue('--hstatus-sprite-transition-ms'), HSTATUS_SPRITE_TRANSITION_MS),
          textDelayMs: parseMs(style.getPropertyValue('--hstatus-text-reveal-delay-ms'), HSTATUS_TEXT_REVEAL_DELAY_MS),
        };
      }

      function setHstatusSpriteTransitioning(active) {
        const shake = document.getElementById('hstatus-character-shake');
        if (shake) shake.classList.toggle('hstatus-sprite-transitioning', active);
      }

      function clearHstatusSpriteViewClasses() {
        const spriteImages = document.getElementById('hstatus-sprite-images');
        if (spriteImages) {
          spriteImages.classList.remove('head-view', 'chest-view', 'crotch-view');
        }
      }

      const CLOTHES_MASK_PRESETS = {
        head: {
          viewMode: 'head',
          innerEnd: 10,
          outerEnd: 15,
          durationVar: '--hstatus-head-clothes-mask-ms',
          defaultDurationMs: 500,
        },
        chest: {
          viewMode: 'chest',
          innerEnd: 10,
          outerEnd: 15,
          durationVar: '--hstatus-chest-clothes-mask-ms',
          defaultDurationMs: 1000,
        },
        crotch: {
          viewMode: 'crotch',
          innerEnd: 10,
          outerEnd: 15,
          defaultDurationMs: 1000,
          durationVar: '--hstatus-crotch-clothes-mask-ms',
        },
      };

      function parseCssPercent(value, fallback) {
        const n = parseFloat(String(value).trim());
        return Number.isFinite(n) ? n : fallback;
      }

      /** 与 .hstatus-sprite-mask-wrap 可见圆心一致（界面坐标，非立绘局部） */
      function getViewportClothesMaskAnchorPercents() {
        const container = document.querySelector('.hstatus-table-container');
        if (!container) return { x: 50, y: 35.71 };
        const style = getComputedStyle(container);
        return {
          x: parseCssPercent(style.getPropertyValue('--hstatus-clothes-mask-anchor-x'), 50),
          y: parseCssPercent(style.getPropertyValue('--hstatus-clothes-mask-anchor-y'), 35.71),
        };
      }

      /**
       * 将 mask-wrap 坐标系（界面可见区）映射到服装层本地坐标。
       * 渐变圆心固定在 mask-wrap 的 50% / 35.71%，不随 head/chest/crotch transform 改变屏幕位置。
       */
      function resolveClothesMaskPlacement() {
        const maskWrap = document.getElementById('hstatus-sprite-mask-wrap');
        const clothes = document.getElementById('hstatus-sprite-clothes');
        if (!maskWrap || !clothes) return null;

        const anchor = getViewportClothesMaskAnchorPercents();
        const wrapRect = maskWrap.getBoundingClientRect();
        const clothesRect = clothes.getBoundingClientRect();
        const clothesW = clothes.offsetWidth;
        const clothesH = clothes.offsetHeight;
        if (!clothesW || !clothesH || !clothesRect.width || !clothesRect.height) return null;

        const scaleX = clothesRect.width / clothesW;
        const scaleY = clothesRect.height / clothesH;
        const maskLocalX = (wrapRect.left - clothesRect.left) / scaleX;
        const maskLocalY = (wrapRect.top - clothesRect.top) / scaleY;
        const maskLocalW = wrapRect.width / scaleX;
        const maskLocalH = wrapRect.height / scaleY;

        return {
          gradientCenter: `${anchor.x}% ${anchor.y}%`,
          maskSize: `${maskLocalW}px ${maskLocalH}px`,
          maskPosition: `${maskLocalX}px ${maskLocalY}px`,
        };
      }

      function buildClothesMaskGradient(center, innerVh, outerVh) {
        return `radial-gradient(circle at ${center}, transparent 0%, transparent ${innerVh}vh, white ${outerVh}vh, white 100%)`;
      }

      function applyClothesMask(preset, innerVh, outerVh) {
        if (!shouldUseHstatusClothesMask()) return;
        const clothes = document.getElementById('hstatus-sprite-clothes');
        if (!clothes) return;
        const placement = resolveClothesMaskPlacement();
        if (!placement) return;
        const gradient = buildClothesMaskGradient(placement.gradientCenter, innerVh, outerVh);
        clothes.style.maskImage = gradient;
        clothes.style.webkitMaskImage = gradient;
        clothes.style.maskSize = placement.maskSize;
        clothes.style.webkitMaskSize = placement.maskSize;
        clothes.style.maskPosition = placement.maskPosition;
        clothes.style.webkitMaskPosition = placement.maskPosition;
        clothes.style.maskRepeat = 'no-repeat';
        clothes.style.webkitMaskRepeat = 'no-repeat';
      }

      function clearClothesMaskStyles() {
        const clothes = document.getElementById('hstatus-sprite-clothes');
        if (!clothes) return;
        clothes.style.maskImage = '';
        clothes.style.webkitMaskImage = '';
        clothes.style.maskSize = '';
        clothes.style.webkitMaskSize = '';
        clothes.style.maskPosition = '';
        clothes.style.webkitMaskPosition = '';
        clothes.style.maskRepeat = '';
        clothes.style.webkitMaskRepeat = '';
      }

      function cancelClothesMaskAnimation() {
        if (clothesMaskRafId !== null) {
          cancelAnimationFrame(clothesMaskRafId);
          clothesMaskRafId = null;
        }
        if (clothesMaskTimerId !== null) {
          clearTimeout(clothesMaskTimerId);
          clothesMaskTimerId = null;
        }
        if (hstatusSpritePhaseTimerId !== null) {
          clearTimeout(hstatusSpritePhaseTimerId);
          hstatusSpritePhaseTimerId = null;
        }
      }

      function stopClothesMaskAnimation() {
        cancelClothesMaskAnimation();
        clearClothesMaskStyles();
      }

      function getClothesMaskTiming(preset) {
        const container = document.querySelector('.hstatus-table-container');
        if (!container) {
          return { delayMs: HSTATUS_SPRITE_TRANSITION_MS, durationMs: preset.defaultDurationMs };
        }
        const style = getComputedStyle(container);
        const parseMs = (value, fallback) => {
          const n = parseInt(String(value).trim(), 10);
          return Number.isFinite(n) ? n : fallback;
        };
        return {
          delayMs: parseMs(style.getPropertyValue('--hstatus-sprite-transition-ms'), HSTATUS_SPRITE_TRANSITION_MS),
          durationMs: parseMs(style.getPropertyValue(preset.durationVar), preset.defaultDurationMs),
        };
      }

      /** mask-image 无法用 CSS keyframes 插值，用 rAF 逐帧扩散服装镂空 */
      function startClothesMaskAnimation(viewKey, options = {}) {
        const preset = CLOTHES_MASK_PRESETS[viewKey];
        if (!preset) return;
        if (!shouldUseHstatusClothesMask()) {
          cancelClothesMaskAnimation();
          clearClothesMaskStyles();
          return;
        }
        cancelClothesMaskAnimation();
        const timing = getClothesMaskTiming(preset);
        const delayMs = options.delayMs ?? timing.delayMs;
        const durationMs = options.durationMs ?? timing.durationMs;
        clothesMaskTimerId = setTimeout(() => {
          clothesMaskTimerId = null;
          if (hstatusViewMode !== preset.viewMode) return;
          if (viewKey === 'crotch') {
            const lastLayer = getLastDialogueLayer();
            const snap = (lastLayer && getLayerVars(lastLayer))
              ? getLayerVars(lastLayer)
              : ERA.currentVars;
            scheduleWombPopupFadeIn(snap);
          }
          const start = performance.now();
          const tick = now => {
            if (hstatusViewMode !== preset.viewMode) return;
            const t = Math.min(1, (now - start) / durationMs);
            const eased = 1 - (1 - t) ** 3;
            applyClothesMask(preset, preset.innerEnd * eased, preset.outerEnd * eased);
            if (t < 1) {
              clothesMaskRafId = requestAnimationFrame(tick);
            } else {
              clothesMaskRafId = null;
            }
          };
          clothesMaskRafId = requestAnimationFrame(tick);
        }, delayMs);
      }

      /** 按当前表/里与游戏模式，立即应用或清除服装镂空 */
      function refreshHstatusClothesMaskForCurrentView() {
        const viewKey = hstatusViewMode;
        if (!CLOTHES_MASK_PRESETS[viewKey]) {
          clearClothesMaskStyles();
          return;
        }
        if (!shouldUseHstatusClothesMask()) {
          cancelClothesMaskAnimation();
          clearClothesMaskStyles();
          if (viewKey === 'crotch') hideWombPopupImmediate();
          return;
        }
        const preset = CLOTHES_MASK_PRESETS[viewKey];
        applyClothesMask(preset, preset.innerEnd, preset.outerEnd);
        if (viewKey === 'crotch') {
          const lastLayer = getLastDialogueLayer();
          const snap = (lastLayer && getLayerVars(lastLayer))
            ? getLayerVars(lastLayer)
            : ERA.currentVars;
          scheduleWombPopupFadeIn(snap);
        }
      }

      /**
       * 离开已有服装镂空的子界面：先逆向收拢遮罩，过半时再切换镜头；镜头结束后正向展开新界面遮罩（若有）。
       */
      function beginHstatusSubviewSwitchTransition({ fromViewKey, toViewKey, onSpriteEnter, scheduleTextReveal }) {
        fadeOutTextOnly();
        removeAllCursors();
        cancelClothesMaskAnimation();

        const fromPreset = CLOTHES_MASK_PRESETS[fromViewKey];
        const { spriteMs, textDelayMs } = getHstatusTransitionTiming();
        let spritePhaseStarted = false;

        const beginSpritePhase = () => {
          if (spritePhaseStarted) return;
          spritePhaseStarted = true;
          setHstatusSpriteTransitioning(true);
          requestAnimationFrame(() => {
            onSpriteEnter();
            if (scheduleTextReveal) scheduleTextReveal(textDelayMs);
          });
          hstatusSpritePhaseTimerId = setTimeout(() => {
            hstatusSpritePhaseTimerId = null;
            setHstatusSpriteTransitioning(false);
            if (toViewKey) {
              startClothesMaskAnimation(toViewKey, { delayMs: 0 });
            } else {
              clearClothesMaskStyles();
            }
          }, spriteMs);
        };

        const clothes = document.getElementById('hstatus-sprite-clothes');
        const hasActiveMask = shouldUseHstatusClothesMask()
          && clothes
          && (clothes.style.maskImage || clothes.style.webkitMaskImage);
        if (!fromPreset || !hasActiveMask) {
          beginSpritePhase();
          return;
        }

        const { durationMs: reverseDurationMs } = getClothesMaskTiming(fromPreset);
        const reverseStart = performance.now();
        const tick = now => {
          const t = Math.min(1, (now - reverseStart) / reverseDurationMs);
          const eased = 1 - (1 - t) ** 3;
          const shrink = 1 - eased;
          applyClothesMask(fromPreset, fromPreset.innerEnd * shrink, fromPreset.outerEnd * shrink);

          if (t >= 0.5 && !spritePhaseStarted) {
            beginSpritePhase();
          }

          if (t < 1) {
            clothesMaskRafId = requestAnimationFrame(tick);
          } else {
            clothesMaskRafId = null;
            clearClothesMaskStyles();
          }
        };
        clothesMaskRafId = requestAnimationFrame(tick);
      }

      function resetHstatusTextPanelsForFadeIn() {
        const textPanels = document.getElementById('hstatus-text-panels');
        if (textPanels) {
          textPanels.classList.remove('hstatus-fade-out');
          textPanels.classList.remove('hstatus-fade-in');
          textPanels.style.opacity = '0';
        }
      }

      function prepareChestSideTextPanels() {
        const leftContent = document.getElementById('hstatus-text-content-left');
        const rightContent = document.getElementById('hstatus-text-content-right');
        if (leftContent) leftContent.style.display = '';
        if (rightContent) {
          rightContent.textContent = '';
          rightContent.style.display = 'none';
        }
        resetHstatusTextPanelsForFadeIn();
      }

      function prepareMainSideTextPanels() {
        const leftContent = document.getElementById('hstatus-text-content-left');
        const rightContent = document.getElementById('hstatus-text-content-right');
        if (leftContent) leftContent.style.display = '';
        if (rightContent) rightContent.style.display = '';
        resetHstatusTextPanelsForFadeIn();
      }

      function scheduleHstatusTextReveal(textReady, textDelayMs, onAfterText) {
        setTimeout(async () => {
          await textReady;
          fadeInText();
          if (onAfterText) onAfterText();
        }, textDelayMs);
      }

      function beginHstatusSpriteTransition(onTransitionFrame, options = {}) {
        const clearMaskImmediately = options.clearMaskImmediately !== false;
        const clearMaskAtEnd = options.clearMaskAtEnd !== false;
        removeAllCursors();
        cancelClothesMaskAnimation();
        if (clearMaskImmediately) {
          clearClothesMaskStyles();
        }
        setHstatusSpriteTransitioning(true);
        const { spriteMs, textDelayMs } = getHstatusTransitionTiming();
        requestAnimationFrame(() => {
          onTransitionFrame({ spriteMs, textDelayMs });
          setTimeout(() => {
            if (clearMaskAtEnd) clearClothesMaskStyles();
            setHstatusSpriteTransitioning(false);
          }, spriteMs);
        });
      }

      function createViewCursorsForMode(mode = hstatusViewMode) {
        switch (mode) {
          case 'head':
            createHeadViewCursors();
            break;
          case 'chest':
            createChestViewCursors();
            break;
          case 'crotch':
            createCrotchViewCursors();
            break;
          default:
            createMainViewCursors();
        }
      }

      function switchHstatusLayer(targetMode) {
        if (hstatusLayerMode === targetMode) return;
        if (targetMode === 'inner' && !canEnterHstatusInnerLayer()) return;
        clearHstatusLayerSwitchTimers();
        removeAllCursors();

        const durationMs = getHstatusLayerCrossfadeMs();
        const halfMs = durationMs / 2;
        const goingInner = targetMode === 'inner';

        const outerStack = document.getElementById('hstatus-outer-stack');
        const innerGroup = document.getElementById('hstatus-inner-group');
        const maskWrapper = document.getElementById('hstatus-mask-wrapper');
        const textPanels = document.getElementById('hstatus-text-panels');
        const outerHighlight = document.getElementById('hstatus-outer-highlight');
        const characterShake = document.getElementById('hstatus-character-shake');
        const container = document.querySelector('.hstatus-table-container');
        if (!outerStack || !innerGroup) return;

        if (characterShake) characterShake.classList.add('hstatus-sprite-transitioning');
        if (container) container.classList.add('hstatus-layer-switching');
        innerGroup.classList.add('show');

        const linear = 'linear';
        outerStack.style.transition = `opacity ${durationMs}ms ${linear}`;
        innerGroup.style.transition = `opacity ${durationMs}ms ${linear}`;
        if (outerHighlight) outerHighlight.style.transition = `opacity ${durationMs}ms ${linear}`;
        if (maskWrapper) maskWrapper.style.transition = `opacity ${halfMs}ms ${linear}`;
        if (textPanels) {
          textPanels.classList.remove('hstatus-fade-in', 'hstatus-fade-out');
          textPanels.style.transition = `opacity ${halfMs}ms ${linear}`;
        }

        void outerStack.offsetHeight;

        requestAnimationFrame(() => {
          outerStack.style.opacity = goingInner ? '0' : '1';
          innerGroup.style.opacity = goingInner ? '1' : '0';
          if (outerHighlight) {
            outerHighlight.style.visibility = 'visible';
            outerHighlight.style.opacity = goingInner ? '0' : '1';
          }
          if (maskWrapper) maskWrapper.style.opacity = '0';
          if (textPanels) textPanels.style.opacity = '0';
        });

        scheduleHstatusLayerSwitchTimer(async () => {
          hstatusLayerMode = targetMode;
          syncHstatusLayerContainerClass();
          await updateHstatusText();
          resetHstatusTextPanelsForFadeIn();
          refreshHstatusClothesMaskForCurrentView();
        }, halfMs);

        scheduleHstatusLayerSwitchTimer(() => {
          if (maskWrapper) {
            maskWrapper.style.transition = `opacity ${halfMs}ms ${linear}`;
            maskWrapper.style.opacity = '1';
          }
          if (textPanels) {
            textPanels.style.transition = `opacity ${halfMs}ms ${linear}`;
            textPanels.style.opacity = '1';
          }
        }, halfMs);

        scheduleHstatusLayerSwitchTimer(() => {
          setHstatusTableLayersVisible(true);
          [outerStack, innerGroup, outerHighlight, maskWrapper, textPanels].forEach(el => {
            if (!el) return;
            el.style.transition = '';
          });
          if (textPanels) {
            textPanels.classList.remove('hstatus-fade-out', 'hstatus-fade-in');
            textPanels.style.opacity = '';
          }
          if (maskWrapper) maskWrapper.style.opacity = '';
          if (characterShake) characterShake.classList.remove('hstatus-sprite-transitioning');
          if (container) container.classList.remove('hstatus-layer-switching');
          createViewCursorsForMode();
          logWithTag('Hstatus', `${goingInner ? '进入里' : '返回表'}${hstatusViewMode}界面`);
        }, durationMs);
      }

      function bindHstatusCursorSwipe(el, onActivate, swipeCheck) {
        let touchStartX = 0;
        let touchStartY = 0;
        const minSwipeDistance = 50;
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onActivate();
        });
        el.addEventListener('touchstart', (e) => {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        });
        el.addEventListener('touchend', (e) => {
          const touchEndX = e.changedTouches[0].clientX;
          const touchEndY = e.changedTouches[0].clientY;
          const deltaX = touchEndX - touchStartX;
          const deltaY = touchEndY - touchStartY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          if (swipeCheck(deltaX, deltaY, distance, minSwipeDistance)) {
            e.preventDefault();
            onActivate();
          }
        });
      }

      function appendHstatusLeftCursor(container) {
        const cursorLeft = document.createElement('img');
        cursorLeft.className = 'hstatus-cursor-left';
        cursorLeft.id = 'hstatus-cursor-left';
        cursorLeft.src = HSTATUS_ASSETS.cursor;
        cursorLeft.alt = '指向箭头（向左）';
        bindHstatusCursorSwipe(cursorLeft, exitInnerToOuter, (deltaX, deltaY, distance, minDist) =>
          deltaX > 0 && Math.abs(deltaX) > Math.abs(deltaY) && distance > minDist
        );
        container.appendChild(cursorLeft);
      }

      function enterInnerFromOuter() {
        if (!canEnterHstatusInnerLayer()) return;
        switchHstatusLayer('inner');
      }

      function exitInnerToOuter() {
        switchHstatusLayer('outer');
      }

      /** 主界面 → 头部 */
      function enterHeadViewFromMain() {
        beginHstatusSpriteTransition(({ textDelayMs }) => {
          fadeOutTextOnly();
          hstatusViewMode = 'head';
          logWithTag('Hstatus', '进入纯爱头部界面');
          clearHstatusSpriteViewClasses();
          const spriteImages = document.getElementById('hstatus-sprite-images');
          if (spriteImages) spriteImages.classList.add('head-view');
          createViewCursorsForMode('head');
          startClothesMaskAnimation('head');
          scheduleHstatusTextReveal(updateHstatusText(), textDelayMs);
        }, { clearMaskAtEnd: false });
      }

      /** 头部 → 主界面 */
      function exitHeadViewToMain() {
        beginHstatusSubviewSwitchTransition({
          fromViewKey: 'head',
          onSpriteEnter: () => {
            hstatusViewMode = 'main';
            logWithTag('Hstatus', '返回纯爱主界面');
            const spriteImages = document.getElementById('hstatus-sprite-images');
            if (spriteImages) spriteImages.classList.remove('head-view');
            prepareMainSideTextPanels();
            createViewCursorsForMode('main');
          },
          scheduleTextReveal: textDelayMs => {
            scheduleHstatusTextReveal(updateHstatusText(), textDelayMs);
          },
        });
      }

      /** 主界面 → 胸部 */
      function enterChestViewFromMain() {
        beginHstatusSpriteTransition(({ textDelayMs }) => {
          fadeOutTextOnly();
          hstatusViewMode = 'chest';
          logWithTag('Hstatus', '进入纯爱胸部界面');
          prepareChestSideTextPanels();
          clearHstatusSpriteViewClasses();
          const spriteImages = document.getElementById('hstatus-sprite-images');
          if (spriteImages) spriteImages.classList.add('chest-view');
          createViewCursorsForMode('chest');
          startClothesMaskAnimation('chest');
          scheduleHstatusTextReveal(updateHstatusText(), textDelayMs);
        }, { clearMaskAtEnd: false });
      }

      /** 胸部 → 主界面 */
      function exitChestViewToMain() {
        beginHstatusSubviewSwitchTransition({
          fromViewKey: 'chest',
          onSpriteEnter: () => {
            hstatusViewMode = 'main';
            logWithTag('Hstatus', '返回纯爱主界面');
            const spriteImages = document.getElementById('hstatus-sprite-images');
            if (spriteImages) spriteImages.classList.remove('chest-view');
            prepareMainSideTextPanels();
            createViewCursorsForMode('main');
          },
          scheduleTextReveal: textDelayMs => {
            scheduleHstatusTextReveal(updateHstatusText(), textDelayMs);
          },
        });
      }

      /** 胸部 → 阴部 */
      function enterCrotchViewFromChest() {
        beginHstatusSubviewSwitchTransition({
          fromViewKey: 'chest',
          toViewKey: 'crotch',
          onSpriteEnter: () => {
            hstatusViewMode = 'crotch';
            logWithTag('Hstatus', '进入阴部界面');
            prepareChestSideTextPanels();
            const spriteImages = document.getElementById('hstatus-sprite-images');
            if (spriteImages) {
              spriteImages.classList.remove('chest-view');
              spriteImages.classList.add('crotch-view');
            }
            createViewCursorsForMode('crotch');
          },
          scheduleTextReveal: textDelayMs => {
            scheduleHstatusTextReveal(updateHstatusText(), textDelayMs);
          },
        });
      }

      /** 阴部 → 胸部 */
      function exitCrotchViewToChest() {
        fadeOutWombPopup(() => {
          beginHstatusSubviewSwitchTransition({
            fromViewKey: 'crotch',
            toViewKey: 'chest',
            onSpriteEnter: () => {
              hstatusViewMode = 'chest';
              logWithTag('Hstatus', '返回胸部界面');
              const spriteImages = document.getElementById('hstatus-sprite-images');
              if (spriteImages) {
                spriteImages.classList.remove('crotch-view');
                spriteImages.classList.add('chest-view');
              }
              prepareChestSideTextPanels();
              createViewCursorsForMode('chest');
            },
            scheduleTextReveal: textDelayMs => {
              scheduleHstatusTextReveal(updateHstatusText(), textDelayMs);
            },
          });
        });
      }

      /** 阴部 → 主界面 */
      function exitCrotchViewToMain() {
        fadeOutWombPopup(() => {
          beginHstatusSubviewSwitchTransition({
            fromViewKey: 'crotch',
            onSpriteEnter: () => {
              hstatusViewMode = 'main';
              logWithTag('Hstatus', '从阴部返回纯爱主界面');
              clearHstatusSpriteViewClasses();
              prepareMainSideTextPanels();
              createViewCursorsForMode('main');
            },
            scheduleTextReveal: textDelayMs => {
              scheduleHstatusTextReveal(updateHstatusText(), textDelayMs);
            },
          });
        });
      }

      // 创建纯爱主界面的箭头（向上、向右、向下）
      function createMainViewCursors() {
        const container = document.querySelector('.hstatus-table-container');
        if (!container) return;

        // 创建向上箭头（上方正中，旋转180度）- 进入纯爱头部界面
        const cursorUpMain = document.createElement('img');
        cursorUpMain.className = 'hstatus-cursor-up';
        cursorUpMain.id = 'hstatus-cursor-up-main';
        cursorUpMain.src = uiUrl('cursor');
        cursorUpMain.alt = '指向箭头（向上）';

        // 创建向下箭头（下方正中）- 进入纯爱胸部界面
        const cursorDown = document.createElement('img');
        cursorDown.className = 'hstatus-cursor-down';
        cursorDown.id = 'hstatus-cursor-down';
        cursorDown.src = uiUrl('cursor');
        cursorDown.alt = '指向箭头（下方）';

        // 创建向右箭头（右侧正中，逆时针旋转90度）
        const cursorRight = document.createElement('img');
        cursorRight.className = 'hstatus-cursor-right';
        cursorRight.id = 'hstatus-cursor-right';
        cursorRight.src = uiUrl('cursor');
        cursorRight.alt = '指向箭头（右侧）';

        // 触摸滑动处理（手机端）
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        const minSwipeDistance = 50;

        // 向上箭头：点击或向下滑动触发 - 进入纯爱头部界面
        cursorUpMain.addEventListener('click', (e) => {
          e.stopPropagation();
          enterHeadViewFromMain();
        });

        cursorUpMain.addEventListener('touchstart', (e) => {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        });

        cursorUpMain.addEventListener('touchend', (e) => {
          touchEndX = e.changedTouches[0].clientX;
          touchEndY = e.changedTouches[0].clientY;
          const deltaX = touchEndX - touchStartX;
          const deltaY = touchEndY - touchStartY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          if (deltaY > 0 && Math.abs(deltaY) > Math.abs(deltaX) && distance > minSwipeDistance) {
            e.preventDefault();
            enterHeadViewFromMain();
          }
        });

        // 下方箭头：点击或向上滑动触发 - 进入纯爱胸部界面
        cursorDown.addEventListener('click', (e) => {
          e.stopPropagation();
          enterChestViewFromMain();
        });

        cursorDown.addEventListener('touchstart', (e) => {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        });

        cursorDown.addEventListener('touchend', (e) => {
          touchEndX = e.changedTouches[0].clientX;
          touchEndY = e.changedTouches[0].clientY;
          const deltaX = touchEndX - touchStartX;
          const deltaY = touchEndY - touchStartY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          if (deltaY < 0 && Math.abs(deltaY) > Math.abs(deltaX) && distance > minSwipeDistance) {
            e.preventDefault();
            enterChestViewFromMain();
          }
        });

        // 右侧箭头：正常模式表界面进入里界面
        if (shouldShowHstatusOuterRightCursor()) {
          bindHstatusCursorSwipe(cursorRight, enterInnerFromOuter, (deltaX, deltaY, distance, minDist) =>
            deltaX < 0 && Math.abs(deltaX) > Math.abs(deltaY) && distance > minDist
          );
        }

        container.appendChild(cursorUpMain);
        container.appendChild(cursorDown);
        if (shouldShowHstatusOuterRightCursor()) {
          container.appendChild(cursorRight);
        } else if (hstatusLayerMode === 'inner') {
          appendHstatusLeftCursor(container);
        }
      }

      // 删除所有箭头的辅助函数
      function removeAllCursors() {
        const cursorIds = [
          'hstatus-cursor-down',
          'hstatus-cursor-right',
          'hstatus-cursor-up',
          'hstatus-cursor-up-main',
          'hstatus-cursor-down-chest',
          'hstatus-cursor-right-sub',
          'hstatus-cursor-right-head',
          'hstatus-cursor-right-foot',
          'hstatus-cursor-up-crotch',
          'hstatus-cursor-right-crotch',
          'hstatus-cursor-left'
        ];
        cursorIds.forEach(id => {
          const el = document.getElementById(id);
          if (el) el.remove();
        });
      }

      // 返回纯爱主界面的函数
      function returnToMainView() {
        if (hstatusViewMode === 'head') {
          exitHeadViewToMain();
          return;
        }
        if (hstatusViewMode === 'crotch') {
          exitCrotchViewToMain();
          return;
        }
        if (hstatusViewMode === 'chest') {
          exitChestViewToMain();
          return;
        }
        removeAllCursors();
        clearHstatusSpriteViewClasses();
        hstatusViewMode = 'main';
        logWithTag('Hstatus', '返回纯爱主界面');
        prepareMainSideTextPanels();
        createViewCursorsForMode('main');
        setTimeout(async () => {
          await updateHstatusText();
          fadeInText();
        }, 100);
      }

      // 创建纯爱头部界面的箭头（向下和向右）- 复制纯爱胸部界面的代码
      function createHeadViewCursors() {
        const container = document.querySelector('.hstatus-table-container');
        if (!container) return;

        // 创建向下箭头（下方正中）- 进入纯爱主界面
        const cursorDown = document.createElement('img');
        cursorDown.className = 'hstatus-cursor-down';
        cursorDown.id = 'hstatus-cursor-down';
        cursorDown.src = uiUrl('cursor');
        cursorDown.alt = '指向箭头（下方）';

        // 创建向右箭头（右侧正中，逆时针旋转90度）
        const cursorRightHead = document.createElement('img');
        cursorRightHead.className = 'hstatus-cursor-right';
        cursorRightHead.id = 'hstatus-cursor-right-head';
        cursorRightHead.src = uiUrl('cursor');
        cursorRightHead.alt = '指向箭头（右侧）';

        // 触摸滑动处理（手机端）
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        const minSwipeDistance = 50;

        // 向下箭头：点击或向上滑动触发 - 返回纯爱主界面
        cursorDown.addEventListener('click', (e) => {
          e.stopPropagation();
          exitHeadViewToMain();
        });

        cursorDown.addEventListener('touchstart', (e) => {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        });

        cursorDown.addEventListener('touchend', (e) => {
          touchEndX = e.changedTouches[0].clientX;
          touchEndY = e.changedTouches[0].clientY;
          const deltaX = touchEndX - touchStartX;
          const deltaY = touchEndY - touchStartY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          if (deltaY < 0 && Math.abs(deltaY) > Math.abs(deltaX) && distance > minSwipeDistance) {
            e.preventDefault();
            exitHeadViewToMain();
          }
        });

        // 向右箭头：正常模式表界面进入里界面
        if (shouldShowHstatusOuterRightCursor()) {
          bindHstatusCursorSwipe(cursorRightHead, enterInnerFromOuter, (deltaX, deltaY, distance, minDist) =>
            deltaX < 0 && Math.abs(deltaX) > Math.abs(deltaY) && distance > minDist
          );
        }

        container.appendChild(cursorDown);
        if (shouldShowHstatusOuterRightCursor()) {
          container.appendChild(cursorRightHead);
        } else if (hstatusLayerMode === 'inner') {
          appendHstatusLeftCursor(container);
        }
      }

      // 创建纯爱胸部界面的箭头（向上、向下、向右）
      function createChestViewCursors() {
        const container = document.querySelector('.hstatus-table-container');
        if (!container) return;

        // 创建向上箭头（上方正中，旋转180度）- 进入纯爱主界面
        const cursorUp = document.createElement('img');
        cursorUp.className = 'hstatus-cursor-up';
        cursorUp.id = 'hstatus-cursor-up';
        cursorUp.src = uiUrl('cursor');
        cursorUp.alt = '指向箭头（向上）';

        // 创建向下箭头（下方正中）- 进入纯爱足部界面
        const cursorDownChest = document.createElement('img');
        cursorDownChest.className = 'hstatus-cursor-down';
        cursorDownChest.id = 'hstatus-cursor-down-chest';
        cursorDownChest.src = uiUrl('cursor');
        cursorDownChest.alt = '指向箭头（下方）';

        // 创建向右箭头（右侧正中，逆时针旋转90度）
        const cursorRightSub = document.createElement('img');
        cursorRightSub.className = 'hstatus-cursor-right';
        cursorRightSub.id = 'hstatus-cursor-right-sub';
        cursorRightSub.src = uiUrl('cursor');
        cursorRightSub.alt = '指向箭头（右侧）';

        // 触摸滑动处理（手机端）
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        const minSwipeDistance = 50;

        // 向上箭头：点击或向下滑动触发 - 返回纯爱主界面
        cursorUp.addEventListener('click', (e) => {
          e.stopPropagation();
          exitChestViewToMain();
        });

        cursorUp.addEventListener('touchstart', (e) => {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        });

        cursorUp.addEventListener('touchend', (e) => {
          touchEndX = e.changedTouches[0].clientX;
          touchEndY = e.changedTouches[0].clientY;
          const deltaX = touchEndX - touchStartX;
          const deltaY = touchEndY - touchStartY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          if (deltaY > 0 && Math.abs(deltaY) > Math.abs(deltaX) && distance > minSwipeDistance) {
            e.preventDefault();
            exitChestViewToMain();
          }
        });

        // 向下箭头：点击或向上滑动触发 - 进入阴部界面
        cursorDownChest.addEventListener('click', (e) => {
          e.stopPropagation();
          enterCrotchViewFromChest();
        });

        cursorDownChest.addEventListener('touchstart', (e) => {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        });

        cursorDownChest.addEventListener('touchend', (e) => {
          touchEndX = e.changedTouches[0].clientX;
          touchEndY = e.changedTouches[0].clientY;
          const deltaX = touchEndX - touchStartX;
          const deltaY = touchEndY - touchStartY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          if (deltaY < 0 && Math.abs(deltaY) > Math.abs(deltaX) && distance > minSwipeDistance) {
            e.preventDefault();
            enterCrotchViewFromChest();
          }
        });

        // 向右箭头：正常模式表界面进入里界面
        if (shouldShowHstatusOuterRightCursor()) {
          bindHstatusCursorSwipe(cursorRightSub, enterInnerFromOuter, (deltaX, deltaY, distance, minDist) =>
            deltaX < 0 && Math.abs(deltaX) > Math.abs(deltaY) && distance > minDist
          );
        }

        container.appendChild(cursorUp);
        container.appendChild(cursorDownChest);
        if (shouldShowHstatusOuterRightCursor()) {
          container.appendChild(cursorRightSub);
        } else if (hstatusLayerMode === 'inner') {
          appendHstatusLeftCursor(container);
        }
      }

      // 创建阴部界面的箭头（向上返回胸部，向右已无效）
      function createCrotchViewCursors() {
        const container = document.querySelector('.hstatus-table-container');
        if (!container) return;

        const cursorUp = document.createElement('img');
        cursorUp.className = 'hstatus-cursor-up';
        cursorUp.id = 'hstatus-cursor-up-crotch';
        cursorUp.src = uiUrl('cursor');
        cursorUp.alt = '指向箭头（向上）';

        const cursorRightCrotch = document.createElement('img');
        cursorRightCrotch.className = 'hstatus-cursor-right';
        cursorRightCrotch.id = 'hstatus-cursor-right-crotch';
        cursorRightCrotch.src = uiUrl('cursor');
        cursorRightCrotch.alt = '指向箭头（右侧）';

        let touchStartX = 0, touchStartY = 0, touchEndX = 0, touchEndY = 0;
        const minSwipeDistance = 50;

        // 向上箭头：返回胸部界面
        cursorUp.addEventListener('click', (e) => {
          e.stopPropagation();
          exitCrotchViewToChest();
        });

        cursorUp.addEventListener('touchstart', (e) => {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        });
        cursorUp.addEventListener('touchend', (e) => {
          touchEndX = e.changedTouches[0].clientX;
          touchEndY = e.changedTouches[0].clientY;
          const deltaX = touchEndX - touchStartX;
          const deltaY = touchEndY - touchStartY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          if (deltaY > 0 && Math.abs(deltaY) > Math.abs(deltaX) && distance > minSwipeDistance) {
            e.preventDefault();
            exitCrotchViewToChest();
          }
        });

        // 向右箭头：正常模式表界面进入里界面
        if (shouldShowHstatusOuterRightCursor()) {
          bindHstatusCursorSwipe(cursorRightCrotch, enterInnerFromOuter, (deltaX, deltaY, distance, minDist) =>
            deltaX < 0 && Math.abs(deltaX) > Math.abs(deltaY) && distance > minDist
          );
        }

        container.appendChild(cursorUp);
        if (shouldShowHstatusOuterRightCursor()) {
          container.appendChild(cursorRightCrotch);
        } else if (hstatusLayerMode === 'inner') {
          appendHstatusLeftCursor(container);
        }
      }

      // 创建纯爱足部界面的箭头（向上，向右已无效）
      function createFootViewCursors() {
        const container = document.querySelector('.hstatus-table-container');
        if (!container) return;

        // 创建向上箭头（上方正中，旋转180度）- 进入纯爱胸部界面
        const cursorUp = document.createElement('img');
        cursorUp.className = 'hstatus-cursor-up';
        cursorUp.id = 'hstatus-cursor-up';
        cursorUp.src = uiUrl('cursor');
        cursorUp.alt = '指向箭头（向上）';

        // 创建向右箭头（右侧正中，逆时针旋转90度）
        const cursorRightFoot = document.createElement('img');
        cursorRightFoot.className = 'hstatus-cursor-right';
        cursorRightFoot.id = 'hstatus-cursor-right-foot';
        cursorRightFoot.src = uiUrl('cursor');
        cursorRightFoot.alt = '指向箭头（右侧）';

        // 触摸滑动处理（手机端）
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        const minSwipeDistance = 50;

        // 向上箭头：点击或向下滑动触发 - 进入纯爱胸部界面
        cursorUp.addEventListener('click', (e) => {
          e.stopPropagation();
          fadeOutTextAndSprite();
          setTimeout(() => {
            removeAllCursors();
            hstatusViewMode = 'chest';
            logWithTag('Hstatus', '进入纯爱胸部界面');
            createViewCursorsForMode('chest');
          }, 500);
        });

        cursorUp.addEventListener('touchstart', (e) => {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        });

        cursorUp.addEventListener('touchend', (e) => {
          touchEndX = e.changedTouches[0].clientX;
          touchEndY = e.changedTouches[0].clientY;
          const deltaX = touchEndX - touchStartX;
          const deltaY = touchEndY - touchStartY;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          if (deltaY > 0 && Math.abs(deltaY) > Math.abs(deltaX) && distance > minSwipeDistance) {
            e.preventDefault();
            fadeOutTextAndSprite();
            setTimeout(() => {
              removeAllCursors();
              hstatusViewMode = 'chest';
              logWithTag('Hstatus', '进入纯爱胸部界面（滑动）');
              createViewCursorsForMode('chest');
            }, 500);
          }
        });

        // 向右箭头：已设为无效
        cursorRightFoot.addEventListener('click', (e) => { e.stopPropagation(); });
        cursorRightFoot.addEventListener('touchstart', () => {});
        cursorRightFoot.addEventListener('touchend', () => {});

        container.appendChild(cursorUp);
        container.appendChild(cursorRightFoot);
      }

      function applyHstatusViewOnOpen() {
        const spriteImages = document.getElementById('hstatus-sprite-images');
        clearHstatusSpriteViewClasses();
        if (hstatusViewMode === 'head' && spriteImages) {
          spriteImages.classList.add('head-view');
        } else if (hstatusViewMode === 'chest') {
          prepareChestSideTextPanels();
          if (spriteImages) spriteImages.classList.add('chest-view');
        } else if (hstatusViewMode === 'crotch' && spriteImages) {
          spriteImages.classList.add('crotch-view');
        } else if (hstatusViewMode === 'main') {
          prepareMainSideTextPanels();
        }
        createViewCursorsForMode(hstatusViewMode);
        refreshHstatusClothesMaskForCurrentView();
      }

      // 将Hstatus表组、立绘遮罩容器、文字面板、外层高光层和退出按钮添加到容器中
      container.appendChild(tableGroup);
      container.appendChild(maskWrapper);
      container.appendChild(textPanelsContainer);
      container.appendChild(frameImage);
      container.appendChild(outerHighlight);
      container.appendChild(exitBtn);
      overlay.appendChild(container);

      // 添加到页面
      document.body.appendChild(overlay);

      // 按当前层/视图创建导航箭头并应用立绘与服装遮罩
      applyHstatusViewOnOpen();

      // 根据当前屏幕宽高比设置左右文字位置，监听 resize，并每秒再检测一次
      updateHstatusTextPanelPosition();
      hstatusResizeHandler = updateHstatusTextPanelPosition;
      window.addEventListener('resize', hstatusResizeHandler);
      hstatusPositionIntervalId = setInterval(updateHstatusTextPanelPosition, 1000);

      // 显示界面（添加show类触发动画）
      setTimeout(async () => {
        overlay.classList.add('show');
        // 更新立绘（根据当前阶段和服装）
        updateHstatusSprite();
        // 更新文字内容并淡入（prepare*SideTextPanels 已将 opacity 置 0）
        await updateHstatusText();
        fadeInText();
      }, 10);

      logWithTag('Hstatus', 'Hstatus表界面已打开');
    }

    // 关闭Hstatus表界面
    function closeHstatusTable() {
      if (clothesMaskRafId !== null) {
        cancelAnimationFrame(clothesMaskRafId);
        clothesMaskRafId = null;
      }
      if (clothesMaskTimerId !== null) {
        clearTimeout(clothesMaskTimerId);
        clothesMaskTimerId = null;
      }
      if (hstatusSpritePhaseTimerId !== null) {
        clearTimeout(hstatusSpritePhaseTimerId);
        hstatusSpritePhaseTimerId = null;
      }
      cancelWombPopupAnimation();
      hideWombPopupImmediate();
      clearHstatusLayerSwitchTimers();
      if (hstatusResizeHandler) {
        window.removeEventListener('resize', hstatusResizeHandler);
        hstatusResizeHandler = null;
      }
      if (hstatusPositionIntervalId !== null) {
        clearInterval(hstatusPositionIntervalId);
        hstatusPositionIntervalId = null;
      }
      const overlay = document.getElementById('hstatus-table-overlay');
      if (overlay) {
        hstatusLayerMode = 'outer';
        hstatusViewMode = 'main';
        overlay.classList.remove('show');
        // 等待动画完成后移除元素
        setTimeout(() => {
          if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
        }, 300); // 与CSS动画时间一致
        logWithTag('Hstatus', 'Hstatus表界面已关闭');
      }
    }

    // 根据精液状态变量更新 Hstatus 精液叠加层（阈值 5 和 30：<5 不显示，5-30 Little，>30 Much；层级低于服装，不参与服装遮罩）
    // 精液叠加层 / 子宫弹窗（数据来自 resource/game-assets.js）
    const CUM_URLS = (window.妹神官_gameAssets && window.妹神官_gameAssets.cumUrls) || {};
    const WOMB_POPUP_URLS = (window.妹神官_gameAssets && window.妹神官_gameAssets.wombPopupUrls) || [];
    function updateHstatusCumOverlays(varsSnapshot) {
      const chestEl = document.getElementById('hstatus-sprite-cum-chest');
      const bellyEl = document.getElementById('hstatus-sprite-cum-belly');
      const legEl = document.getElementById('hstatus-sprite-cum-leg');
      if (!chestEl || !bellyEl || !legEl) return;
      if (!isPureLoveMode()) {
        chestEl.removeAttribute('src');
        bellyEl.removeAttribute('src');
        legEl.removeAttribute('src');
        chestEl.style.display = 'none';
        bellyEl.style.display = 'none';
        legEl.style.display = 'none';
        return;
      }
      const snap = varsSnapshot || ERA.currentVars || (typeof ERA !== 'undefined' && ERA.defaultVars) || {};
      // 支持嵌套路径与旧版扁平路径，无值时用 defaultVars 的 114
      const get = (nestedPath, flatPath) => {
        let v = getNestedValue(snap, nestedPath);
        if (v === undefined || v === null) v = getNestedValue(snap, flatPath);
        if ((v === undefined || v === null) && typeof ERA !== 'undefined' && ERA.defaultVars)
          v = getNestedValue(ERA.defaultVars, nestedPath);
        const n = parseInt(v, 10);
        return isNaN(n) ? 0 : n;
      };
      const chest = get('托莉娜.Hstate纯爱.表.精液状态.当前胸部精液量', '托莉娜.Hstate纯爱.表.当前胸部精液量');
      const belly = get('托莉娜.Hstate纯爱.表.精液状态.当前腹部精液量', '托莉娜.Hstate纯爱.表.当前腹部精液量');
      const leg = get('托莉娜.Hstate纯爱.表.精液状态.当前腿部精液量', '托莉娜.Hstate纯爱.表.当前腿部精液量');
      const setCum = (el, value, littleUrl, muchUrl) => {
        if (value < 5) {
          el.removeAttribute('src');
          el.style.display = 'none';
        } else {
          el.src = value <= 30 ? littleUrl : muchUrl;
          el.style.display = 'block'; /* 显式 block 确保在容器内显示 */
        }
      };
      setCum(chestEl, chest, CUM_URLS.chestLittle, CUM_URLS.chestMuch);
      setCum(bellyEl, belly, CUM_URLS.bellyLittle, CUM_URLS.bellyMuch);
      setCum(legEl, leg, CUM_URLS.legLittle, CUM_URLS.legMuch);
    }

    function getWombPopupTiming() {
      const container = document.querySelector('.hstatus-table-container');
      const parseMs = (value, fallback) => {
        const n = parseInt(String(value).trim(), 10);
        return Number.isFinite(n) ? n : fallback;
      };
      if (!container) {
        return { fadeInMs: 500, fadeOutMs: 400, fadeInDelayMs: 350 };
      }
      const style = getComputedStyle(container);
      return {
        fadeInMs: parseMs(style.getPropertyValue('--hstatus-womb-fade-in-ms'), 500),
        fadeOutMs: parseMs(style.getPropertyValue('--hstatus-womb-fade-out-ms'), 400),
        fadeInDelayMs: parseMs(style.getPropertyValue('--hstatus-womb-fade-in-delay-ms'), 350),
      };
    }

    function resolveWombPopupImageIndex(varsSnapshot) {
      const snap = varsSnapshot || ERA.currentVars || (typeof ERA !== 'undefined' && ERA.defaultVars) || {};
      const layerPrefix = hstatusLayerMode === 'inner'
        ? '托莉娜.Hstate正常.里'
        : (isPureLoveMode() ? '托莉娜.Hstate纯爱.表' : '托莉娜.Hstate正常.表');
      const semenKey = hstatusLayerMode === 'inner' ? '子宫内精液量' : '子宫内你的精液量';
      let v = getNestedValue(snap, `${layerPrefix}.阴部.${semenKey}`);
      if ((v === undefined || v === null) && typeof ERA !== 'undefined' && ERA.defaultVars) {
        v = getNestedValue(ERA.defaultVars, `${layerPrefix}.阴部.${semenKey}`);
      }
      const n = Math.max(0, parseInt(v, 10) || 0);
      if (n >= 75) return 4;
      if (n >= 50) return 3;
      if (n >= 25) return 2;
      if (n >= 5) return 1;
      return 0;
    }

    function cancelWombPopupAnimation() {
      if (wombPopupFadeTimerId !== null) {
        clearTimeout(wombPopupFadeTimerId);
        wombPopupFadeTimerId = null;
      }
      if (wombPopupHideTimerId !== null) {
        clearTimeout(wombPopupHideTimerId);
        wombPopupHideTimerId = null;
      }
    }

    function hideWombPopupImmediate() {
      cancelWombPopupAnimation();
      const el = document.getElementById('hstatus-womb-popup');
      if (!el) return;
      el.classList.remove('hstatus-womb-visible');
      el.style.removeProperty('opacity');
      el.style.removeProperty('visibility');
      el.style.display = 'none';
    }

    /** 离开阴部前淡出；完成后再启动服装遮罩逆向 */
    function fadeOutWombPopup(onComplete) {
      const el = document.getElementById('hstatus-womb-popup');
      if (!el || el.style.display === 'none' || !el.classList.contains('hstatus-womb-visible')) {
        hideWombPopupImmediate();
        if (onComplete) onComplete();
        return;
      }
      cancelWombPopupAnimation();
      const { fadeOutMs } = getWombPopupTiming();
      el.classList.remove('hstatus-womb-visible');
      el.style.removeProperty('opacity');
      wombPopupHideTimerId = setTimeout(() => {
        wombPopupHideTimerId = null;
        hideWombPopupImmediate();
        if (onComplete) onComplete();
      }, fadeOutMs);
    }

    /** 服装遮罩开始正向扩散后再延迟淡入 */
    function scheduleWombPopupFadeIn(varsSnapshot) {
      cancelWombPopupAnimation();
      const el = document.getElementById('hstatus-womb-popup');
      if (!el || !shouldShowHstatusWombPopup()) {
        hideWombPopupImmediate();
        return;
      }
      const { fadeInDelayMs } = getWombPopupTiming();
      el.src = WOMB_POPUP_URLS[resolveWombPopupImageIndex(varsSnapshot)];
      el.style.display = 'block';
      el.style.visibility = 'hidden';
      el.style.removeProperty('opacity');
      el.classList.remove('hstatus-womb-visible');
      wombPopupFadeTimerId = setTimeout(() => {
        wombPopupFadeTimerId = null;
        if (!shouldShowHstatusWombPopup()) return;
        void el.offsetWidth;
        el.style.visibility = 'visible';
        el.style.removeProperty('opacity');
        el.classList.add('hstatus-womb-visible');
      }, fadeInDelayMs);
    }

    // 子宫精液弹窗：仅阴部界面显示，根据子宫内精液量选图；显示/隐藏走 scheduleWombPopupFadeIn / fadeOutWombPopup
    function updateWombPopup(varsSnapshot) {
      const el = document.getElementById('hstatus-womb-popup');
      if (!el) return;
      if (!shouldShowHstatusWombPopup()) {
        hideWombPopupImmediate();
        return;
      }
      el.src = WOMB_POPUP_URLS[resolveWombPopupImageIndex(varsSnapshot)];
      if (!el.classList.contains('hstatus-womb-visible') && el.style.display === 'none') {
        return;
      }
      if (el.style.display !== 'none') {
        el.style.display = 'block';
      }
    }

    // 更新Hstatus立绘（根据堕落阶段和服装，服装与堕落阶段分离）
    async function updateHstatusSprite() {
      const spriteBody = document.getElementById('hstatus-sprite-body');
      const spriteClothes = document.getElementById('hstatus-sprite-clothes');

      if (!spriteBody || !spriteClothes) {
        warnWithTag('Hstatus', '立绘元素不存在');
        return;
      }

      try {
        // 获取当前运行时值（最后对话层快照）
        const lastLayer = getLastDialogueLayer();
        let varsSnapshot = null;

        if (lastLayer && getLayerVars(lastLayer)) {
          varsSnapshot = getLayerVars(lastLayer);
        } else if (ERA.currentVars) {
          varsSnapshot = ERA.currentVars;
        } else {
          // 如果都没有，使用 getvar 获取
          const stage = await getvar('stat_data.托莉娜.基础.堕落阶段');
          const outfit = await getvar('stat_data.托莉娜.基础.服装');
          const stageNum = parseInt(stage, 10) || 1;
          const outfitValue = outfit || '常服';
          updateHstatusSpriteByStage(spriteBody, spriteClothes, stageNum, outfitValue);
          updateHstatusCumOverlays(ERA.currentVars);
          return;
        }

        // 从变量快照中获取阶段和服装
        const stage = getNestedValue(varsSnapshot, '托莉娜.基础.堕落阶段');
        const outfit = getNestedValue(varsSnapshot, '托莉娜.基础.服装');
        const stageNum = parseInt(stage, 10) || 1;
        const outfitValue = outfit || '常服';

        logWithTag('Hstatus', '更新立绘 - 阶段:', stageNum, '服装:', outfitValue);

        updateHstatusSpriteByStage(spriteBody, spriteClothes, stageNum, outfitValue);
        updateHstatusCumOverlays(varsSnapshot);
      } catch (error) {
        warnWithTag('Hstatus', '获取立绘信息失败，使用默认立绘:', error);
        // 使用默认阶段1的图片
        updateHstatusSpriteByStage(spriteBody, spriteClothes, 1, false);
        updateHstatusCumOverlays(ERA.currentVars);
      }
    }

    // 根据阶段和服装更新立绘图片（服装与堕落阶段分离）
    // 根据阶段和服装更新立绘图片（数据来自 resource/game-assets.js 穿搭矩阵）
    function updateHstatusSpriteByStage(bodyElement, clothesElement, stageNum, outfitValue) {
      const ga = window.妹神官_gameAssets;
      const outfit = (ga && typeof ga.getHstatusOutfit === 'function')
        ? ga.getHstatusOutfit(outfitValue, stageNum)
        : { body: '', clothes: '' };
      const bodyUrl = outfit.body || '';
      const clothesUrl = outfit.clothes || '';

      logWithTag('Hstatus', '设置立绘 - Body:', bodyUrl, 'Clothes:', clothesUrl, '服装:', outfitValue);

      bodyElement.src = bodyUrl;
      clothesElement.src = clothesUrl;
    }


    // 更新Hstatus文字内容
    async function updateHstatusText() {
      const leftContent = document.getElementById('hstatus-text-content-left');
      const rightContent = document.getElementById('hstatus-text-content-right');
      const leftPanel = document.getElementById('hstatus-text-panel-left');

      if (!leftContent || !rightContent) {
        warnWithTag('Hstatus', '文字面板元素不存在');
        return;
      }

      clearHstatusLeftArcLayout(leftContent, leftPanel);
      applyNormalOuterLeftPanelAnchor(leftPanel);

      try {
        // 获取当前运行时值（最后对话层快照）
        const lastLayer = getLastDialogueLayer();
        let varsSnapshot = null;

        if (lastLayer && getLayerVars(lastLayer)) {
          varsSnapshot = getLayerVars(lastLayer);
        } else if (ERA.currentVars) {
          varsSnapshot = ERA.currentVars;
        }

        if (varsSnapshot) recomputeDerivedHstateFields(varsSnapshot);

        // 获取左侧面板数据（游戏/角色统计）
        const getValue = (path) => {
          if (varsSnapshot) {
            const value = getNestedValue(varsSnapshot, path);
            return value !== null && value !== undefined ? value : 0;
          }
          return 0;
        };

        const hp = getHstatusHstatePrefix();
        const hget = (subpath) => getValue(`${hp}.${subpath}`);
        const isInnerLayer = hstatusLayerMode === 'inner';
        const isNormalOuter = isNormalOuterHstatus();

        const getStrValue = (path, fallback = '暂无') => {
          if (varsSnapshot) {
            const value = getNestedValue(varsSnapshot, path);
            if (value === null || value === undefined || value === '') return fallback;
            return value;
          }
          return fallback;
        };
        const hgetStr = (subpath, fallback = '暂无') => getStrValue(`${hp}.${subpath}`, fallback);

        const appendEmptyLine = (container, indentEm = '0') => {
          const el = document.createElement('div');
          el.className = 'hstatus-text-line';
          el.style.height = '1.8em';
          el.style.textIndent = indentEm;
          container.appendChild(el);
        };
        const appendTextLine = (container, indentEm, label, value, isStr = false) => {
          const line = document.createElement('div');
          line.className = 'hstatus-text-line';
          line.style.textIndent = indentEm;
          const display = isStr
            ? (value !== undefined && value !== null && value !== '' ? value : '暂无')
            : (value !== undefined && value !== null ? value : 0);
          line.textContent = `${label}：${display}`;
          container.appendChild(line);
        };
        /** 半角冒号 + 半角空格（表界面等） */
        const appendHalfTextLine = (container, indentEm, label, value) => {
          const line = document.createElement('div');
          line.className = 'hstatus-text-line';
          line.style.textIndent = indentEm;
          const display = value !== undefined && value !== null && value !== '' ? value : '暂无';
          line.textContent = `${label}: ${display}`;
          container.appendChild(line);
        };

        const currentMagic = hget('总表.现时魔力');
        const magicRequirement = hget('总表.现时魔力需求');
        const absorbCountFromUser = isNormalOuter ? hget('总表.总吸取魔力次数') : hget('总表.从你吸取魔力次数');
        const absorbTotalFromUser = isNormalOuter ? hget('总表.总吸取魔力量') : hget('总表.从你吸取魔力总量');
        const orgasmCount = isNormalOuter ? hget('总表.与你高潮次数') : hget('总表.与你高潮的次数');

        // 根据当前界面模式显示不同内容
        leftContent.innerHTML = '';

        // 头部界面：显示接吻和口交相关统计
        if (hstatusViewMode === 'head') {
          if (isInnerLayer) {
            const innerHeadRingLines = [
              ['亲吻次数最多对象', hgetStr('头部.亲吻次数最多对象'), true],
              ['最喜欢的接吻对象是', hgetStr('头部.最喜欢的接吻对象是'), true],
              null,
              ['与你之外接吻次数', hget('头部.与你之外接吻次数'), false],
              ['被强吻次数', hget('头部.被强吻次数'), false],
              ['接吻吸取魔力总量', hget('头部.接吻吸取魔力总量'), false],
              null,
              ['口交次数最多对象', hgetStr('头部.口交次数最多对象'), true],
              ['最喜欢的口交对象是', hgetStr('头部.最喜欢的口交对象是'), true],
              null,
              ['与你之外口交次数', hget('头部.与你之外口交次数'), false],
              ['被迫口交次数', hget('头部.被迫口交次数'), false],
              ['被深喉次数', hget('头部.被深喉次数'), false],
              ['被颜射次数', hget('头部.被颜射次数'), false],
              ['口交吸取魔力总量', hget('头部.口交吸取魔力总量'), false],
              null,
              ['口中精液量', hget('头部.口中精液量'), false],
              ['吞下的精液量', hget('头部.吞下的精液量'), false],
            ];
            innerHeadRingLines.forEach((entry) => {
              if (!entry) {
                appendEmptyLine(leftContent, '0');
                return;
              }
              const [label, value, isStr] = entry;
              appendTextLine(leftContent, '0', label, value, isStr);
            });
          } else if (isNormalOuter) {
            appendHalfTextLine(leftContent, '0', '与你亲吻次数', hget('头部.与你亲吻次数'));
            appendEmptyLine(leftContent);
            appendHalfTextLine(leftContent, '0', '与你口交次数', hget('头部.与你口交次数'));
          } else {
          const kissMagic = hget('头部.与你接吻获得的魔力量');
          const kissCount = hget('头部.与你接吻次数');
          const oralCount = hget('头部.与你口交次数');
          const deepThroatCount = hget('头部.被你深喉次数');
          const facialCount = hget('头部.被你颜射次数');
          const mouthSemen = hget('头部.口中你精液量');
          const swallowedSemen = hget('头部.吞下的你精液量');

          // 创建统计信息（按指定顺序和缩进）
          // （空两格）与你接吻次数:xxx
          const line1 = document.createElement('div');
          line1.className = 'hstatus-text-line';
          line1.style.textIndent = '1em'; // 空两格
          line1.textContent = `与你接吻次数:${kissCount}`;
          leftContent.appendChild(line1);

          // （空一格）与你通过嘴部获得的魔力量:xxx
          const line2 = document.createElement('div');
          line2.className = 'hstatus-text-line';
          line2.style.textIndent = '0.5em'; // 空一格
          line2.textContent = `通过嘴部获得你的魔力量:${kissMagic}`;
          leftContent.appendChild(line2);

          // 空行
          const empty1 = document.createElement('div');
          empty1.className = 'hstatus-text-line';
          empty1.style.height = '1.8em';
          leftContent.appendChild(empty1);

          // 与你口交次数:xxx
          const line3 = document.createElement('div');
          line3.className = 'hstatus-text-line';
          line3.style.textIndent = '0';
          line3.textContent = `与你口交次数:${oralCount}`;
          leftContent.appendChild(line3);

          // 被你深喉次数:xxx
          const line4 = document.createElement('div');
          line4.className = 'hstatus-text-line';
          line4.style.textIndent = '0';
          line4.textContent = `被你深喉次数:${deepThroatCount}`;
          leftContent.appendChild(line4);

          // 被你颜射次数:xxx
          const line5 = document.createElement('div');
          line5.className = 'hstatus-text-line';
          line5.style.textIndent = '0';
          line5.textContent = `被你颜射次数:${facialCount}`;
          leftContent.appendChild(line5);

          // 空行
          const empty2 = document.createElement('div');
          empty2.className = 'hstatus-text-line';
          empty2.style.height = '1.8em';
          leftContent.appendChild(empty2);

          // （空一格）口中你的精液量:xxx
          const line6 = document.createElement('div');
          line6.className = 'hstatus-text-line';
          line6.style.textIndent = '0.5em'; // 空一格
          line6.textContent = `现在口中你的精液量:${mouthSemen}`;
          leftContent.appendChild(line6);

          // （空两格）吞下的你的精液量:xxx
          const line7 = document.createElement('div');
          line7.className = 'hstatus-text-line';
          line7.style.textIndent = '1em'; // 空两格
          line7.textContent = `吞下你的精液量:${swallowedSemen}`;
          leftContent.appendChild(line7);
          }

          // 隐藏右侧文本
          rightContent.textContent = '';
          rightContent.style.display = 'none';
        } else if (hstatusViewMode === 'chest') {
          // 胸部界面：显示胸部相关统计
          // 确保左侧文本可见
          leftContent.style.display = '';
          if (isInnerLayer) {
            appendTextLine(leftContent, '0', '乳交次数最多对象', hgetStr('胸部.乳交次数最多对象'), true);
            appendTextLine(leftContent, '0', '最喜欢的乳交对象是', hgetStr('胸部.最喜欢的乳交对象是'), true);
            appendEmptyLine(leftContent);
            appendTextLine(leftContent, '0', '胸部被爱抚次数', hget('胸部.胸部被爱抚次数'));
            appendTextLine(leftContent, '0', '胸部高潮次数', hget('胸部.胸部高潮次数'));
            appendEmptyLine(leftContent);
            appendTextLine(leftContent, '0', '与你之外乳交次数', hget('胸部.与你之外乳交次数'));
            appendTextLine(leftContent, '0', '乳夹口交次数', hget('胸部.乳夹口交次数'));
            appendTextLine(leftContent, '0', '乳交吸取魔力总量', hget('胸部.乳交吸取魔力总量'));
          } else if (isNormalOuter) {
            appendHalfTextLine(leftContent, '0', '与你乳交次数', hget('胸部.与你乳交次数'));
          } else {
          const breastSexCount = hget('胸部.与你乳交次数');
          const breastCaressCount = hget('胸部.胸部被你爱抚次数');
          const breastOrgasmCount = hget('胸部.因为你胸部高潮次数');
          const breastOralCount = hget('胸部.为你乳夹口交次数');
          const breastMagicTotal = hget('胸部.乳交吸取你魔力总量');

          // 创建统计信息（按指定顺序和缩进）
          // （缩进一格）与你乳交次数:xxx
          const line1 = document.createElement('div');
          line1.className = 'hstatus-text-line';
          line1.style.textIndent = '0.5em'; // 缩进一格
          line1.textContent = `与你乳交次数:${breastSexCount}`;
          leftContent.appendChild(line1);

          // 空行
          const empty1 = document.createElement('div');
          empty1.className = 'hstatus-text-line';
          empty1.style.height = '1.8em';
          leftContent.appendChild(empty1);

          // 胸部被你爱抚次数:xxx
          const line2 = document.createElement('div');
          line2.className = 'hstatus-text-line';
          line2.style.textIndent = '0';
          line2.textContent = `胸部被你爱抚次数:${breastCaressCount}`;
          leftContent.appendChild(line2);

          // 因为你胸部高潮次数:xxx
          const line3 = document.createElement('div');
          line3.className = 'hstatus-text-line';
          line3.style.textIndent = '0';
          line3.textContent = `因为你胸部高潮次数:${breastOrgasmCount}`;
          leftContent.appendChild(line3);

          // 空行
          const empty2 = document.createElement('div');
          empty2.className = 'hstatus-text-line';
          empty2.style.height = '1.8em';
          leftContent.appendChild(empty2);

          // （缩进一格）为你乳夹口交次数:xxx
          const line4 = document.createElement('div');
          line4.className = 'hstatus-text-line';
          line4.style.textIndent = '0.5em'; // 缩进一格
          line4.textContent = `为你乳夹口交次数:${breastOralCount}`;
          leftContent.appendChild(line4);

          // （缩进2格）乳交吸取你魔力总量:xxx
          const line5 = document.createElement('div');
          line5.className = 'hstatus-text-line';
          line5.style.textIndent = '1em'; // 缩进2格
          line5.textContent = `乳交吸取你魔力总量:${breastMagicTotal}`;
          leftContent.appendChild(line5);
          }

          // 隐藏右侧文本
          rightContent.textContent = '';
          rightContent.style.display = 'none';
        } else if (hstatusViewMode === 'crotch') {
          // 阴部界面：左侧显示小穴/肛交/射精相关统计（按指定顺序与缩进：空N格 = 0.5em×N）
          leftContent.style.display = '';
          if (isInnerLayer) {
            appendTextLine(leftContent, '2.5em', '性交次数最多对象', hgetStr('阴部.性交次数最多对象'), true);
            appendTextLine(leftContent, '2em', '最喜欢的性交对象是', hgetStr('阴部.最喜欢的性交对象是'), true);
            appendTextLine(leftContent, '1.5em', '与你之外性交次数', hget('阴部.与你之外性交次数'));
            appendTextLine(leftContent, '1em', '小穴被爱抚次数', hget('阴部.小穴被爱抚次数'));
            appendTextLine(leftContent, '0.5em', '小穴高潮次数', hget('阴部.小穴高潮次数'));
            appendTextLine(leftContent, '0', '小穴吸取魔力总量', hget('阴部.小穴吸取魔力总量'));
            appendEmptyLine(leftContent);
            appendTextLine(leftContent, '0.5em', '肛交次数最多对象', hgetStr('阴部.肛交次数最多对象'), true);
            appendTextLine(leftContent, '0', '最喜欢的肛交对象是', hgetStr('阴部.最喜欢的肛交对象是'), true);
            appendTextLine(leftContent, '0', '与你之外肛交次数', hget('阴部.与你之外肛交次数'));
            appendTextLine(leftContent, '0', '屁穴被爱抚次数', hget('阴部.屁穴被爱抚次数'));
            appendTextLine(leftContent, '0', '屁穴高潮次数', hget('阴部.屁穴高潮次数'));
            appendTextLine(leftContent, '0.5em', '屁穴吸取魔力总量', hget('阴部.屁穴吸取魔力总量'));
            appendEmptyLine(leftContent);
            appendTextLine(leftContent, '1em', '群交经验次数', hget('阴部.群交经验次数'));
            appendTextLine(leftContent, '1.5em', '被双穴插入次数', hget('阴部.被双穴插入次数'));
            appendTextLine(leftContent, '2em', '被外射次数', hget('阴部.被外射次数'));
            appendTextLine(leftContent, '2.5em', '被内射次数', hget('阴部.被内射次数'));
            appendTextLine(leftContent, '3em', '被射入精液总量', hget('阴部.被射入精液总量'));
            appendTextLine(leftContent, '3em', '子宫内精液量', hget('阴部.子宫内精液量'));
            appendTextLine(leftContent, '3em', '直肠内精液量', hget('阴部.直肠内精液量'));
            rightContent.textContent = '';
            rightContent.style.display = 'none';
            const rightPanelInner = document.getElementById('hstatus-text-panel-right');
            if (rightPanelInner) rightPanelInner.classList.remove('hstatus-right-crotch-mode');
          } else if (isNormalOuter) {
            leftContent.style.display = '';
            appendHalfTextLine(leftContent, '0', '与你足交次数', hget('足部.与你足交次数'));
            rightContent.textContent = '';
            rightContent.style.display = 'none';
            const rightPanel = document.getElementById('hstatus-text-panel-right');
            if (rightPanel) rightPanel.classList.remove('hstatus-right-crotch-mode');
          } else {
          const vaginalSexCount = hget('阴部.与你性交次数');
          const vaginalCaressCount = hget('阴部.小穴被你爱抚次数');
          const vaginalOrgasmCount = hget('阴部.因你小穴高潮次数');
          const vaginalMagicTotal = hget('阴部.小穴吸取你的魔力总量');
          const analSexCount = hget('阴部.与你肛交次数');
          const analCaressCount = hget('阴部.屁穴被你爱抚次数');
          const analOrgasmCount = hget('阴部.因你屁穴高潮次数');
          const analMagicTotal = hget('阴部.屁穴吸取你的魔力总量');
          const externalEjacCount = hget('阴部.被你外射次数');
          const internalEjacCount = hget('阴部.被你内射次数');
          const totalSemenAmount = hget('阴部.被你射入精液总量');
          const uterusSemenAmount = hget('阴部.子宫内你的精液量');
          const rectalSemenAmount = hget('阴部.直肠内你的精液量');

          const emptyLine = () => {
            const el = document.createElement('div');
            el.className = 'hstatus-text-line';
            el.style.height = '1.8em';
            leftContent.appendChild(el);
          };
          const addLine = (indentEm, text, value) => {
            const line = document.createElement('div');
            line.className = 'hstatus-text-line';
            line.style.textIndent = indentEm;
            line.textContent = `${text}:${value !== undefined && value !== null ? value : 0}`;
            leftContent.appendChild(line);
          };
          // 第一组：小穴（空5格～空2格）→ 2.5em, 2em, 1.5em, 1em
          addLine('2.5em', '与你性交次数', vaginalSexCount);
          addLine('2em', '小穴被你爱抚次数', vaginalCaressCount);
          addLine('1.5em', '因你小穴高潮次数', vaginalOrgasmCount);
          addLine('1em', '小穴吸取你的魔力总量', vaginalMagicTotal);
          emptyLine();
          // 第二组：肛交（空1格、无、无、空1格）→ 0.5em, 0, 0, 0.5em
          addLine('0.5em', '与你肛交次数', analSexCount);
          addLine('0', '屁穴被你爱抚次数', analCaressCount);
          addLine('0', '因你屁穴高潮次数', analOrgasmCount);
          addLine('0.5em', '屁穴吸取你的魔力总量', analMagicTotal);
          emptyLine();
          // 第三组：射精（空2～空6格）→ 1em, 1.5em, 2em, 2.5em, 3em
          addLine('1em', '被你外射次数', externalEjacCount);
          addLine('1.5em', '被你内射次数', internalEjacCount);
          addLine('2em', '被你射入精液总量', totalSemenAmount);
          addLine('2.5em', '子宫内你的精液量', uterusSemenAmount);
          addLine('3em', '直肠内你的精液量', rectalSemenAmount);

          // 阴部界面右侧：足部四行（空2格、空2格、空1格、无缩进）；前两行整体以中轴线放在横中轴上
          const footSexCount = hget('足部.与你足交次数');
          const footEjacCount = hget('足部.被你足部射精次数');
          const footSemenNow = hget('足部.足部现时你的精液量');
          const footSemenTotal = hget('足部.总足部被你射精量');
          rightContent.innerHTML = '';
          rightContent.style.display = '';
          const rightPanel = document.getElementById('hstatus-text-panel-right');
          if (rightPanel) rightPanel.classList.add('hstatus-right-crotch-mode');
          const centerWrap = document.createElement('div');
          centerWrap.className = 'hstatus-crotch-right-center';
          const addRightLine = (indentEm, label, val) => {
            const line = document.createElement('div');
            line.className = 'hstatus-text-line';
            line.style.textIndent = indentEm;
            line.textContent = `${label}:${val !== undefined && val !== null ? val : 0}`;
            return line;
          };
          centerWrap.appendChild(addRightLine('1em', '与你足交次数', footSexCount));
          centerWrap.appendChild(addRightLine('1em', '被你足部射精次数', footEjacCount));
          rightContent.appendChild(centerWrap);
          const belowWrap = document.createElement('div');
          belowWrap.className = 'hstatus-crotch-right-below';
          belowWrap.appendChild(addRightLine('0.5em', '足部现时你的精液量', footSemenNow));
          belowWrap.appendChild(addRightLine('0', '总足部被你射精量', footSemenTotal));
          rightContent.appendChild(belowWrap);
          }
        } else {
          if (isInnerLayer) {
            const firstNightPartner = hgetStr('总表.献出初夜的对象', '暂无');
            const virginStatus = resolveInnerVirginStatusLabel(firstNightPartner);
            const corruptionStage = getBaseCorruptionStage(varsSnapshot);
            appendTextLine(leftContent, '0', '名字', `托莉娜 (${virginStatus})`, true);
            appendTextLine(leftContent, '0', '堕落阶段', corruptionStage);
            appendTextLine(leftContent, '0', '露出次数', hget('总表.露出次数'));
            appendTextLine(leftContent, '0', '卖春次数', hget('总表.卖春次数'));
            appendTextLine(leftContent, '0', '献出初夜的对象', hgetStr('总表.献出初夜的对象'), true);
            appendTextLine(leftContent, '0', '与你之外口交次数', hget('总表.与你之外口交次数'));
            appendTextLine(leftContent, '0', '与你之外乳交次数', hget('总表.与你之外乳交次数'));
            appendTextLine(leftContent, '0', '与你之外性交次数', hget('总表.与你之外性交次数'));
            appendTextLine(leftContent, '0', '与你之外肛交次数', hget('总表.与你之外肛交次数'));
            appendTextLine(leftContent, '0', '与你之外足交次数', hget('总表.与你之外足交次数'));
            appendEmptyLine(leftContent);
            appendTextLine(leftContent, '0', '与你之外高潮次数', hget('总表.与你之外高潮次数'));
            appendTextLine(leftContent, '0', '高潮最多次是和', hgetStr('总表.高潮最多次是和'), true);

            rightContent.innerHTML = '';
            rightContent.style.display = '';
            const rightPanelMain = document.getElementById('hstatus-text-panel-right');
            if (rightPanelMain) rightPanelMain.classList.remove('hstatus-right-crotch-mode');
            const manaTargets = [
              ['玛蒂亚斯', '总表.吸取玛蒂亚斯魔力总量'],
              ['埃德加', '总表.吸取埃德加魔力总量'],
              ['哈罗德', '总表.吸取哈罗德魔力总量'],
              ['约书亚', '总表.吸取约书亚魔力总量'],
              ['黎克', '总表.吸取黎克魔力总量'],
              ['镇民', '总表.吸取镇民魔力总量'],
            ];
            manaTargets.forEach(([label, path]) => {
              appendTextLine(rightContent, '0', `吸取${label}魔力总量`, hget(path));
            });
          } else {
          // 其他界面（主界面）：左侧行1～10，缩进按设定
          const line1 = document.createElement('div');
          line1.className = 'hstatus-text-line';
          line1.style.textIndent = '1.5em';
          line1.textContent = '『魔血的神官』';
          leftContent.appendChild(line1);

          const line2 = document.createElement('div');
          line2.className = 'hstatus-text-line';
          line2.style.textIndent = '1em';
          line2.textContent = `名字: 托莉娜`;
          leftContent.appendChild(line2);

          const empty1 = document.createElement('div');
          empty1.className = 'hstatus-text-line';
          empty1.style.height = '1.8em';
          leftContent.appendChild(empty1);

          const line3 = document.createElement('div');
          line3.className = 'hstatus-text-line';
          line3.style.textIndent = '0.5em';
          line3.textContent = `现时魔力: ${currentMagic}`;
          leftContent.appendChild(line3);

          const line4 = document.createElement('div');
          line4.className = 'hstatus-text-line';
          line4.style.textIndent = '0';
          line4.textContent = `现时魔力需求: ${magicRequirement}`;
          leftContent.appendChild(line4);

          const empty2 = document.createElement('div');
          empty2.className = 'hstatus-text-line';
          empty2.style.height = '1.8em';
          leftContent.appendChild(empty2);

          const line5 = document.createElement('div');
          line5.className = 'hstatus-text-line';
          line5.style.textIndent = '0';
          line5.textContent = `${isNormalOuter ? '总吸取魔力次数' : '从你吸取魔力次数'}: ${absorbCountFromUser}`;
          leftContent.appendChild(line5);

          const line6 = document.createElement('div');
          line6.className = 'hstatus-text-line';
          line6.style.textIndent = '0.5em';
          line6.textContent = `${isNormalOuter ? '总吸取魔力量' : '从你吸取魔力总量'}: ${absorbTotalFromUser}`;
          leftContent.appendChild(line6);

          const empty3 = document.createElement('div');
          empty3.className = 'hstatus-text-line';
          empty3.style.height = '1.8em';
          leftContent.appendChild(empty3);

          const line9 = document.createElement('div');
          line9.className = 'hstatus-text-line';
          line9.style.textIndent = '1em';
          line9.textContent = `${isNormalOuter ? '与你高潮次数' : '与你高潮的次数'}: ${orgasmCount}`;
          leftContent.appendChild(line9);

          rightContent.innerHTML = '';
          rightContent.style.display = '';
          const rightPanelOuterMain = document.getElementById('hstatus-text-panel-right');
          if (rightPanelOuterMain) rightPanelOuterMain.classList.remove('hstatus-right-crotch-mode');
          appendHalfTextLine(rightContent, '0', '年龄', '19');
          appendHalfTextLine(rightContent, '0', '身高', '158 cm');
          appendHalfTextLine(rightContent, '0', '体重', '44 kg');
          appendHalfTextLine(rightContent, '0', '胸围', 'H~I Cup');
          }
        }

        // 头部、胸部界面时隐藏右侧文本；阴部界面右侧已在上面填充足部四行
        if (hstatusViewMode === 'head' || hstatusViewMode === 'chest') {
          rightContent.textContent = '';
          rightContent.style.display = 'none';
          const rightPanel = document.getElementById('hstatus-text-panel-right');
          if (rightPanel) rightPanel.classList.remove('hstatus-right-crotch-mode');
        } else if (hstatusViewMode === 'crotch' && !isInnerLayer) {
          // 表阴部右侧足部统计已在上面填充
        }

        if (!(isNormalOuter && (hstatusViewMode === 'head' || hstatusViewMode === 'chest' || hstatusViewMode === 'crotch'))) {
          enableHstatusLeftArcLayout(leftContent, leftPanel);
        }

        logWithTag('Hstatus', '文字内容已更新');
      } catch (error) {
        warnWithTag('Hstatus', '获取文字数据失败，使用默认值:', error);
        // 使用默认值
        if (leftContent) {
          leftContent.innerHTML = '';

          // 使用相同的格式和缩进
          const defaultLines = [
            { indent: '1.5em', text: '『魔血的神官』' },
            { indent: '1em', text: '名字: 托莉娜' },
            { indent: '0', text: '', empty: true },
            { indent: '0.5em', text: '现时魔力: 0' },
            { indent: '0', text: '现时魔力需求: 0' },
            { indent: '0', text: '', empty: true },
            { indent: '0', text: '从你吸取魔力次数: 0' },
            { indent: '0.5em', text: '从你吸取魔力总量: 0' },
            { indent: '0', text: '', empty: true },
            { indent: '1em', text: '与你高潮的次数: 0' }
          ];

          defaultLines.forEach(item => {
            const line = document.createElement('div');
            line.className = 'hstatus-text-line';
            if (item.empty) {
              line.style.height = '1.8em';
            } else {
              line.style.textIndent = item.indent;
              line.textContent = item.text;
            }
            leftContent.appendChild(line);
          });
          enableHstatusLeftArcLayout(leftContent, leftPanel);
        }
        if (rightContent) {
          rightContent.textContent = '';
          rightContent.style.display = 'none';
        }
      }
    }

    // 更新堕落条位置（使其位于性欲条上方5px）
    function updateCorruptionBarPosition() {
      const corruptionBarContainer = document.getElementById('corruption-status-bar-container');
      const lustBarContainer = document.getElementById('lust-status-bar-container');

      if (!corruptionBarContainer || !lustBarContainer) {
        return;
      }

      // 获取性欲条容器的高度
      const lustBarHeight = lustBarContainer.offsetHeight || 0;
      const lustBarBottom = 20; // 性欲条容器的bottom值

      // 计算堕落条容器的bottom值：性欲条的bottom + 性欲条高度 + 5px间距
      const corruptionBarBottom = lustBarBottom + lustBarHeight + 5;

      corruptionBarContainer.style.bottom = `${corruptionBarBottom}px`;
    }

    // 更新堕落值变量条显示
    async function updateCorruptionValueBar() {
      const corruptionValueBar = document.getElementById('corruption-value-bar');
      if (!corruptionValueBar) {
        warnWithTag('菜单', '堕落值变量条元素不存在');
        return;
      }

      try {
        let currentCorruption = null;
        let maxCorruption = 100; // 默认上限100

        // 当前运行时值就是最后对话层快照，优先从最后对话层快照或 ERA.currentVars 获取
        const lastLayer = getLastDialogueLayer();
        let varsSnapshot = null;

        if (lastLayer && getLayerVars(lastLayer)) {
          // 优先使用最后对话层的快照（它应该就是 ERA.currentVars）
          varsSnapshot = getLayerVars(lastLayer);
          logWithTag('菜单', '使用最后对话层快照（当前运行时值）获取堕落值');
        } else if (ERA.currentVars) {
          // 如果没有对话层，使用 ERA.currentVars
          varsSnapshot = ERA.currentVars;
          logWithTag('菜单', '使用 ERA.currentVars（当前运行时值）获取堕落值');
        }

        if (varsSnapshot) {
          currentCorruption = getNestedValue(varsSnapshot, '托莉娜.基础.堕落值');
          if (currentCorruption !== undefined && currentCorruption !== null) {
            logWithTag('菜单', '从当前运行时值获取堕落值:', currentCorruption);
          }
        }

        // 如果还是没有，使用 getvar 获取（会尝试从 ERA 查询）
        if (currentCorruption === undefined || currentCorruption === null) {
          currentCorruption = await getvar('stat_data.托莉娜.基础.堕落值');
          if (currentCorruption !== undefined && currentCorruption !== null) {
            logWithTag('菜单', '从 getvar 获取堕落值:', currentCorruption);
          }
        }

        // 转换为数字
        currentCorruption = parseFloat(currentCorruption) || 0;
        maxCorruption = parseFloat(maxCorruption) || 100;

        // 计算百分比（0-100）
        const percentage = maxCorruption > 0 ? (currentCorruption / maxCorruption) * 100 : 0;
        const clampedPercentage = Math.max(0, Math.min(100, percentage)); // 限制在0-100之间

        logWithTag('菜单', '堕落值:', currentCorruption, '/', maxCorruption, '=', clampedPercentage + '%');

        // 使用clip-path来控制显示百分比
        // clip-path: inset(0 right 0 0) 表示从右边裁剪，显示左边的百分比
        const rightClip = 100 - clampedPercentage;
        corruptionValueBar.style.clipPath = `inset(0 ${rightClip}% 0 0)`;

      } catch (error) {
        warnWithTag('菜单', '获取堕落值失败:', error);
        // 默认显示0%
        corruptionValueBar.style.clipPath = 'inset(0 100% 0 0)';
      }
    }

    // 更新性欲值变量条显示
    async function updateLustValueBar() {
      const lustValueBar = document.getElementById('lust-value-bar');
      if (!lustValueBar) {
        warnWithTag('菜单', '性欲值变量条元素不存在');
        return;
      }

      try {
        let currentLust = null;
        let maxLust = 100; // 默认上限100

        // 当前运行时值就是最后对话层快照，优先从最后对话层快照或 ERA.currentVars 获取
        const lastLayer = getLastDialogueLayer();
        let varsSnapshot = null;

        if (lastLayer && getLayerVars(lastLayer)) {
          // 优先使用最后对话层的快照（它应该就是 ERA.currentVars）
          varsSnapshot = getLayerVars(lastLayer);
          logWithTag('菜单', '使用最后对话层快照（当前运行时值）获取性欲值');
        } else if (ERA.currentVars) {
          // 如果没有对话层，使用 ERA.currentVars
          varsSnapshot = ERA.currentVars;
          logWithTag('菜单', '使用 ERA.currentVars（当前运行时值）获取性欲值');
        }

        if (varsSnapshot) {
          currentLust = getNestedValue(varsSnapshot, '托莉娜.基础.性欲值');
          if (currentLust !== undefined && currentLust !== null) {
            logWithTag('菜单', '从当前运行时值获取性欲值:', currentLust);
          }
        }

        // 如果还是没有，使用 getvar 获取（会尝试从 ERA 查询）
        if (currentLust === undefined || currentLust === null) {
          currentLust = await getvar('stat_data.托莉娜.基础.性欲值');
          if (currentLust !== undefined && currentLust !== null) {
            logWithTag('菜单', '从 getvar 获取性欲值:', currentLust);
          }
        }

        // 转换为数字
        currentLust = parseFloat(currentLust) || 0;
        maxLust = parseFloat(maxLust) || 100;

        // 计算百分比（0-100）
        const percentage = maxLust > 0 ? (currentLust / maxLust) * 100 : 0;
        const clampedPercentage = Math.max(0, Math.min(100, percentage)); // 限制在0-100之间

        logWithTag('菜单', '性欲值:', currentLust, '/', maxLust, '=', clampedPercentage + '%');

        // 使用clip-path来控制显示百分比
        // clip-path: inset(0 right 0 0) 表示从右边裁剪，显示左边的百分比
        const rightClip = 100 - clampedPercentage;
        lustValueBar.style.clipPath = `inset(0 ${rightClip}% 0 0)`;

      } catch (error) {
        warnWithTag('菜单', '获取性欲值失败:', error);
        // 默认显示0%
        lustValueBar.style.clipPath = 'inset(0 100% 0 0)';
      }
    }

    // 根据阶段更新立绘图片（数据来自 resource/game-assets.js）
    function updateTorinaSpriteByStage(spriteElement, stageNum) {
      const ga = window.妹神官_gameAssets;
      const spriteUrl = (ga && typeof ga.getMenuSprite === 'function') ? (ga.getMenuSprite(stageNum) || '') : '';

      logWithTag('菜单', '设置托莉娜立绘:', spriteUrl, '阶段:', stageNum);
      spriteElement.style.backgroundImage = `url('${resolveAssetUrl(spriteUrl)}')`;
      spriteElement.style.display = 'block'; // 确保元素可见

      // 当堕落阶段为3或4时，向下移动20px（基础值向下移动，底部仍然贴底）
      if (stageNum === 3 || stageNum === 4) {
        // 使用 top 和 bottom 实现向下移动，保持底部贴底
        // top: 20px 使顶部向下移动20px，bottom: -20px 使底部仍然贴底
        spriteElement.style.top = '40px';
        spriteElement.style.bottom = '-40px'; // 负值使底部仍然贴底
        logWithTag('菜单', '阶段', stageNum, '：立绘向下移动40px（基础值）');
      } else {
        // 阶段1或2时，恢复原始位置
        spriteElement.style.top = '0';
        spriteElement.style.bottom = '0';
        logWithTag('菜单', '阶段', stageNum, '：立绘恢复原始位置');
      }

      // 验证背景图片是否设置成功
      const computedStyle = window.getComputedStyle(spriteElement);
      logWithTag('菜单', '立绘元素样式:', {
        backgroundImage: computedStyle.backgroundImage,
        width: computedStyle.width,
        height: computedStyle.height,
        top: computedStyle.top,
        display: computedStyle.display,
        zIndex: computedStyle.zIndex
      });
    }

    function isGameMenuOpen() {
      const overlay = document.getElementById('game-menu-overlay');
      return !!(overlay && overlay.classList.contains('show') && !overlay.classList.contains('hidden'));
    }

    function openGameMenu() {
      const overlay = document.getElementById('game-menu-overlay');
      if (!overlay) return;
      overlay.classList.remove('hidden');
      overlay.classList.remove('show');
      void overlay.offsetWidth;
      overlay.classList.add('show');
      updateMenuContainerWidth();
      updateMenuTorinaSprite();
      updateLustValueBar();
      updateCorruptionValueBar();
      setTimeout(updateCorruptionBarPosition, 100);
    }

    function closeGameMenu() {
      const overlay = document.getElementById('game-menu-overlay');
      if (overlay) overlay.classList.remove('show');
    }

    // 更新菜单容器宽度和背景图片尺寸（根据背景图片的宽高比）
    // 设计逻辑：
    // 1. 保持长宽比例不变
    // 2. 上部锁定贴着设备上边缘，下部锁定贴着下边缘
    // 3. 当左右宽度小于容器宽度的时候允许拉长左右到完全占满
    // 4. 当左右宽度大于容器宽度的时候，不允许缩小左右宽度，而是以中轴线为基准，允许左右超出屏幕范围
    function updateMenuContainerWidth() {
      const menuContainer = document.getElementById('game-menu-container');
      if (!menuContainer) return;

      const menuImageUrl = uiUrl('menuBg');
      const borderImageUrl = uiUrl('menuBorder');
      const img = new Image();
      const borderImg = new Image();

      // 加载背景图片
      img.onload = function() {
        const imageAspectRatio = img.width / img.height;
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        // 根据高度100vh计算保持比例时的宽度
        const calculatedWidth = viewportHeight * imageAspectRatio;

        if (calculatedWidth <= viewportWidth) {
          // 情况1：计算出的宽度小于等于屏幕宽度
          // 允许拉长左右到完全占满容器宽度，但保持高度为100vh
          // 这里需要拉伸宽度，但保持高度不变，所以会稍微变形
          // 但用户要求"允许拉长左右到完全占满"，所以使用100vw宽度（确保至少是屏幕宽度，避免裁剪立绘）
          menuContainer.style.width = '100vw';
          menuContainer.style.minWidth = '100vw'; // 确保最小宽度为视口宽度，防止立绘被裁剪
          menuContainer.style.backgroundSize = '100% 100%'; // 拉伸到完全占满
          menuContainer.style.backgroundPosition = 'center center';
        } else {
          // 情况2：计算出的宽度大于屏幕宽度
          // 不允许缩小左右宽度，以中轴线为基准，允许左右超出屏幕范围
          // 但最小宽度仍为100vw，确保立绘不被裁剪
          menuContainer.style.width = `${calculatedWidth}px`;
          menuContainer.style.minWidth = '100vw'; // 确保最小宽度为视口宽度，防止立绘被裁剪
          menuContainer.style.backgroundSize = 'auto 100%'; // 保持比例，高度填满
          menuContainer.style.backgroundPosition = 'center center'; // 以中轴线为基准
        }

        // 加载前景边框图片并应用相同的逻辑
        borderImg.onload = function() {
          const borderAspectRatio = borderImg.width / borderImg.height;
          const borderCalculatedWidth = viewportHeight * borderAspectRatio;

          // 使用CSS变量来设置前景边框的尺寸
          if (borderCalculatedWidth <= viewportWidth) {
            // 宽度小于等于屏幕宽度，拉伸到100%宽度
            menuContainer.style.setProperty('--border-bg-size', '100% 100%');
          } else {
            // 宽度大于屏幕宽度，保持比例，高度填满
            menuContainer.style.setProperty('--border-bg-size', 'auto 100%');
          }
        };
        borderImg.onerror = function() {
          warnWithTag('MENU', '前景边框图片加载失败');
        };
        borderImg.src = borderImageUrl;

        // 更新退出按钮位置
        updateMenuExitBtnPosition();
      };
      img.onerror = function() {
        // 如果图片加载失败，使用默认宽度，确保至少是屏幕宽度
        menuContainer.style.width = '100vw';
        menuContainer.style.minWidth = '100vw'; // 确保最小宽度为视口宽度，防止立绘被裁剪
        updateMenuExitBtnPosition();
      };
      img.src = menuImageUrl;
    }

    // 初始化游戏界面（相当于在纯爱路线点击了开始游戏）
    async function initGameInterface() {
      // 初始化默认MVU变量（开局时使用，不捕获酒馆变量）
      await initializeDefaultMvu();
      await setGameMode(isLoveRouteStart ? GAME_MODE_PURE_LOVE : GAME_MODE_NORMAL);

      // 隐藏加载界面
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        const bootVideo = loadingScreen.querySelector('.loading-bg-video');
        if (bootVideo) bootVideo.pause();
      }

      // 隐藏开始界面
      const introMask = document.getElementById('intro-mask');
      if (introMask) {
        introMask.style.display = 'none';
      }
      stopIntroBgm();

      // 隐藏路线选择界面
      const openingPanel = document.getElementById('opening-panel');
      if (openingPanel) {
        openingPanel.classList.remove('open');
        openingPanel.style.display = 'none';
      }

      // 隐藏错误和设置界面（如果显示）
      const errorOverlay = document.getElementById('error-overlay');
      const settingsOverlay = document.getElementById('settings-overlay');
      if (errorOverlay) errorOverlay.classList.add('hidden');
      if (settingsOverlay) settingsOverlay.classList.add('hidden');

      // 显示游戏内容区域
      const frame = document.querySelector('.frame');
      if (frame) {
        // 检查是否已经存在parchment，如果不存在则创建
        let parchment = frame.querySelector('.parchment');
        if (!parchment) {
          parchment = document.createElement('div');
          parchment.className = 'parchment';
          parchment.id = 'game-parchment';

          // 创建立绘区
          const stage = document.createElement('div');
          stage.className = 'stage';
          const sprite = document.createElement('div');
          sprite.className = 'sprite';
          stage.appendChild(sprite);

          // 创建CG层
          const cgLayer = document.createElement('div');
          cgLayer.className = 'cg-layer';
          cgLayer.id = 'cg-layer';
          const cgImage = document.createElement('img');
          cgImage.className = 'cg-image';
          cgImage.id = 'cg-image';
          cgImage.alt = 'CG';
          cgLayer.appendChild(cgImage);
          stage.appendChild(cgLayer);

          // 创建对话区
          const dialogue = document.createElement('div');
          dialogue.className = 'dialogue';

          // 创建名字区（独立于文本区，位于页面正中间）
          const dialogueNameArea = document.createElement('div');
          dialogueNameArea.className = 'dialogue-name-area';
          const dialogueNameplate = document.createElement('div');
          dialogueNameplate.className = 'nameplate';
          dialogueNameplate.innerHTML = '<div class="np-top"></div><div class="np-bottom"></div>';
          dialogueNameArea.appendChild(dialogueNameplate);

          // 创建文本区
          const dialogueBox = document.createElement('div');
          dialogueBox.className = 'dialogue-box';
          const dialogueText = document.createElement('div');
          dialogueText.className = 'dialogue-text';
          dialogueText.id = 'dialogue-text';

          // 创建点击区域
          const dialogueClickArea = document.createElement('div');
          dialogueClickArea.className = 'dialogue-click-area';
          const dialogueClickLeft = document.createElement('div');
          dialogueClickLeft.className = 'dialogue-click-left';
          const dialogueClickRight = document.createElement('div');
          dialogueClickRight.className = 'dialogue-click-right';
          dialogueClickArea.appendChild(dialogueClickLeft);
          dialogueClickArea.appendChild(dialogueClickRight);

          dialogueBox.appendChild(dialogueText);
          // 将点击区域附加到 dialogueBox，覆盖整个文本区背景图片
          dialogueBox.appendChild(dialogueClickArea);

          // 创建分支选项容器
          const branchesContainer = document.createElement('div');
          branchesContainer.className = 'branches-container';
          branchesContainer.id = 'branches-container';
          const branchesChoices = document.createElement('div');
          branchesChoices.className = 'branches-choices';
          branchesChoices.id = 'branches-choices';
          branchesContainer.appendChild(branchesChoices);

          dialogueBox.appendChild(branchesContainer);

          dialogue.appendChild(dialogueBox);

          // 创建全屏按钮
          const gameFullscreenBtn = document.createElement('img');
          gameFullscreenBtn.className = 'game-fullscreen-btn';
          gameFullscreenBtn.id = 'game-fullscreen-btn';
          gameFullscreenBtn.src = uiUrl('fullscreenBtn');
          gameFullscreenBtn.alt = '全屏';
          gameFullscreenBtn.title = '全屏';

          // 创建菜单按钮
          const gameMenuBtn = document.createElement('img');
          gameMenuBtn.className = 'game-menu-btn';
          gameMenuBtn.id = 'game-menu-btn';
          gameMenuBtn.src = uiUrl('menuBtn');
          gameMenuBtn.alt = '菜单';
          gameMenuBtn.title = '菜单';

          // 创建菜单界面
          const gameMenuOverlay = document.createElement('div');
          gameMenuOverlay.className = 'game-menu-overlay';
          gameMenuOverlay.id = 'game-menu-overlay';
          const gameMenuContainer = document.createElement('div');
          gameMenuContainer.className = 'game-menu-container';
          gameMenuContainer.id = 'game-menu-container';

          // 创建退出按钮（使用通用返回按钮）
          const gameMenuExitBtn = document.createElement('img');
          gameMenuExitBtn.className = 'game-menu-exit-btn';
          gameMenuExitBtn.id = 'game-menu-exit-btn';
          gameMenuExitBtn.src = uiUrl('menuExitBtn');
          gameMenuExitBtn.alt = '退出';
          gameMenuExitBtn.title = '退出';

          // 创建设置UI容器
          const gameMenuSettingsUIContainer = document.createElement('div');
          gameMenuSettingsUIContainer.className = 'game-menu-settings-ui-container';
          gameMenuSettingsUIContainer.id = 'game-menu-settings-ui-container';

          // 创建设置UI
          const gameMenuSettingsUI = document.createElement('img');
          gameMenuSettingsUI.className = 'game-menu-settings-ui';
          gameMenuSettingsUI.id = 'game-menu-settings-ui';
          gameMenuSettingsUI.src = uiUrl('menuSettingsUI');
          gameMenuSettingsUI.alt = '设置';
          gameMenuSettingsUI.title = '设置';

          // 创建设定字样
          const settingsLabel = document.createElement('img');
          settingsLabel.className = 'settings-label';
          settingsLabel.id = 'settings-label';
          settingsLabel.src = uiUrl('settingsLabel');
          settingsLabel.alt = '设定';

          // 创建Hstatus UI（在设置按钮左边）
          const gameMenuHstatusUI = document.createElement('img');
          gameMenuHstatusUI.className = 'game-menu-hstatus-ui';
          gameMenuHstatusUI.id = 'game-menu-hstatus-ui';
          gameMenuHstatusUI.src = uiUrl('menuHstatusUI');
          gameMenuHstatusUI.alt = 'Hstatus';
          gameMenuHstatusUI.title = 'Hstatus';

          // 创建Hstatus字样
          const hstatusLabel = document.createElement('img');
          hstatusLabel.className = 'hstatus-label';
          hstatusLabel.id = 'hstatus-label';
          hstatusLabel.src = uiUrl('hstatusLabel'); // Hstatus标签图片
          hstatusLabel.alt = 'Hstatus';

          // 创建地图 UI（在 Hstatus 按钮下方）
          const gameMenuMapUI = document.createElement('img');
          gameMenuMapUI.className = 'game-menu-map-ui';
          gameMenuMapUI.id = 'game-menu-map-ui';
          gameMenuMapUI.src = uiUrl('menuMapUI');
          gameMenuMapUI.alt = '地图';
          gameMenuMapUI.title = '地图';

          // 创建地图字样
          const mapLabel = document.createElement('img');
          mapLabel.className = 'map-label';
          mapLabel.id = 'map-label';
          mapLabel.src = uiUrl('mapLabel');
          mapLabel.alt = '地图';

          // 创建历史消息UI
          const gameMenuHistoryUI = document.createElement('img');
          gameMenuHistoryUI.className = 'game-menu-history-ui';
          gameMenuHistoryUI.id = 'game-menu-history-ui';
          gameMenuHistoryUI.src = uiUrl('menuHistoryUI');
          gameMenuHistoryUI.alt = '历史消息';
          gameMenuHistoryUI.title = '历史消息';

          // 创建历史消息字样
          const historyLabel = document.createElement('img');
          historyLabel.className = 'history-label';
          historyLabel.id = 'history-label';
          historyLabel.src = uiUrl('historyLabel'); // 历史消息标签图片
          historyLabel.alt = '历史消息';

          // 创建保存UI
          const gameMenuSaveUI = document.createElement('img');
          gameMenuSaveUI.className = 'game-menu-save-ui';
          gameMenuSaveUI.id = 'game-menu-save-ui';
          gameMenuSaveUI.src = uiUrl('menuSaveUI');
          gameMenuSaveUI.alt = '保存';
          gameMenuSaveUI.title = '保存';

          // 创建保存字样
          const saveLabel = document.createElement('img');
          saveLabel.className = 'save-label';
          saveLabel.id = 'save-label';
          saveLabel.src = uiUrl('saveLabel');
          saveLabel.alt = '保存';

          // 设置UI点击事件：打开设置界面（和开始界面一样）
          gameMenuSettingsUI.addEventListener('click', (e) => {
            e.stopPropagation();
            openSettingsPanel();
          });

          // 历史消息UI点击事件：打开当前对话轮消息弹窗
          gameMenuHistoryUI.addEventListener('click', (e) => {
            e.stopPropagation();
            showCurrentDialogueLayer();
          });

          // 添加别名 QUEST
          window.QUEST = gameMenuHistoryUI;

          // 保存UI点击事件：打开存档界面
          gameMenuSaveUI.addEventListener('click', async (e) => {
            e.stopPropagation();
            const saveOverlay = document.getElementById('save-overlay');
            if (saveOverlay) {
              saveOverlay.classList.remove('hidden');
              // 打开时刷新存档列表
              await renderSaveArchiveList();
            }
          });

          // 将设置UI、Hstatus UI、历史消息UI、保存UI、字样添加到容器中
          // DOM顺序：先添加设置按钮，再添加Hstatus按钮，然后历史消息按钮，然后保存按钮，最后添加所有标签（这样CSS选择器~才能正确工作）
          gameMenuSettingsUIContainer.appendChild(gameMenuSettingsUI);
          gameMenuSettingsUIContainer.appendChild(gameMenuHstatusUI);
          gameMenuSettingsUIContainer.appendChild(gameMenuMapUI);
          gameMenuSettingsUIContainer.appendChild(gameMenuHistoryUI);
          gameMenuSettingsUIContainer.appendChild(gameMenuSaveUI);
          // 标签放在最后，使CSS选择器能正确匹配
          gameMenuSettingsUIContainer.appendChild(hstatusLabel);
          gameMenuSettingsUIContainer.appendChild(mapLabel);
          gameMenuSettingsUIContainer.appendChild(historyLabel);
          gameMenuSettingsUIContainer.appendChild(settingsLabel);
          gameMenuSettingsUIContainer.appendChild(saveLabel);

          // 动态计算按钮和标签位置，防止重叠（紧密挨着，边界距离为0）
          function updateButtonAndLabelPositions() {
            const historyUI = document.getElementById('game-menu-history-ui');
            const settingsUI = document.getElementById('game-menu-settings-ui');
            const saveUI = document.getElementById('game-menu-save-ui');
            const container = gameMenuSettingsUIContainer;

            if (!historyUI || !settingsUI || !saveUI || !container) return;

            // 获取容器位置
            const containerRect = container.getBoundingClientRect();

            // 先重置所有margin，避免累积错误
            settingsUI.style.marginTop = '';
            settingsUI.style.marginBottom = '';
            saveUI.style.marginTop = '';
            saveUI.style.marginBottom = '';

            // 获取每个按钮的实际尺寸
            const settingsRect = settingsUI.getBoundingClientRect();
            const saveRect = saveUI.getBoundingClientRect();

            // 计算按钮相对于容器的位置
            const settingsTop = settingsRect.top - containerRect.top;
            const settingsBottom = settingsTop + settingsRect.height;
            const saveTop = saveRect.top - containerRect.top;

            // 动态计算设置按钮和保存按钮之间的间距，确保不重叠（紧密挨着，边界距离为0）
            const currentSpacingSettingsSave = saveTop - settingsBottom;
            const minSpacingSettingsSave = 0; // 边界距离为0，紧密挨着

            if (currentSpacingSettingsSave !== minSpacingSettingsSave) {
              // 调整保存按钮位置，使其紧贴设置按钮
              const neededMargin = minSpacingSettingsSave - currentSpacingSettingsSave;
              saveUI.style.marginTop = `${neededMargin}px`;
            }

            // 重新获取设置按钮位置（因为可能调整了margin）
            const settingsRect2 = settingsUI.getBoundingClientRect();
            const settingsTop2 = settingsRect2.top - containerRect.top;

            // 计算标签位置：标签的下边框紧贴设置按钮的上边框
            // hover时标签会translateY(-10px)向下移动，所以初始位置需要向上偏移10px
            // 这样hover后标签的下边框正好在settingsTop2位置，紧贴设置按钮上边框
            // 标签往下移动总设备高度的5%
            const labelHoverOffset = 10; // hover时标签向下移动10px
            const viewportHeight = window.innerHeight;
            const labelDownOffset = viewportHeight * 0.05; // 标签往下移动总设备高度的5%
            const labelBottomTarget = settingsTop2 + labelDownOffset; // 标签下边框目标位置（紧贴设置按钮上边框，并往下移动5%）

            // 获取标签的实际高度
            let labelHeight = 60; // 默认最大高度
            if (settingsLabel) {
              const labelRect = settingsLabel.getBoundingClientRect();
              if (labelRect.height > 0) {
                labelHeight = labelRect.height;
              }
            }

            // 标签初始位置：下边框在(settingsTop2 + labelDownOffset - labelHoverOffset)，这样hover后正好在(settingsTop2 + labelDownOffset)
            const labelBottomInitial = labelBottomTarget - labelHoverOffset;
            const labelTop = labelBottomInitial - labelHeight;

            // 设置所有标签的位置（统一在设置按钮上方，标签下边框紧贴设置按钮上边框，并往下移动总设备高度的5%）
            const hstatusLabel = document.getElementById('hstatus-label');
            const mapLabelEl = document.getElementById('map-label');
            [hstatusLabel, mapLabelEl, historyLabel, settingsLabel, saveLabel].forEach(label => {
              if (label) {
                label.style.top = `${labelTop}px`;
                label.style.left = '';
              }
            });
          }

          // 初始设置位置
          setTimeout(() => {
            updateButtonAndLabelPositions();
            // 延迟再次更新，确保图片加载完成
            setTimeout(updateButtonAndLabelPositions, 300);
          }, 100);

          // 监听窗口大小变化
          window.addEventListener('resize', updateButtonAndLabelPositions);

          // 监听图片加载完成，重新计算位置
          [gameMenuHstatusUI, gameMenuMapUI, gameMenuHistoryUI, gameMenuSettingsUI, gameMenuSaveUI, mapLabel].forEach(btn => {
            if (btn) {
              btn.addEventListener('load', updateButtonAndLabelPositions);
            }
          });

          // Hstatus按钮点击事件：打开Hstatus表界面
          gameMenuHstatusUI.addEventListener('click', (e) => {
            e.stopPropagation();
            openHstatusTable();
          });

          // 地图按钮点击事件：打开世界地图
          gameMenuMapUI.addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('game-menu-overlay')?.classList.add('hidden');
            if (typeof MeishinkanWorldMap !== 'undefined') {
              MeishinkanWorldMap.open();
            }
          });

          // 创建托莉娜立绘元素
          const gameMenuTorinaSprite = document.createElement('div');
          gameMenuTorinaSprite.className = 'game-menu-torina-sprite';
          gameMenuTorinaSprite.id = 'game-menu-torina-sprite';

          // 创建堕落值显示条容器
          const corruptionBarContainer = document.createElement('div');
          corruptionBarContainer.className = 'corruption-status-bar-container';
          corruptionBarContainer.id = 'corruption-status-bar-container';

          // 创建堕落值显示条外框
          const corruptionBar = document.createElement('img');
          corruptionBar.className = 'corruption-status-bar';
          corruptionBar.id = 'corruption-status-bar';
          corruptionBar.src = uiUrl('corruptionBar');
          corruptionBar.alt = '堕落值';
          corruptionBar.onload = function() {
            // 保持原始图像像素尺寸，不允许变化
            if (this.naturalWidth && this.naturalHeight) {
              this.style.width = this.naturalWidth + 'px';
              this.style.height = this.naturalHeight + 'px';
              this.style.minWidth = this.naturalWidth + 'px';
              this.style.maxWidth = this.naturalWidth + 'px';
              this.style.minHeight = this.naturalHeight + 'px';
              this.style.maxHeight = this.naturalHeight + 'px';
            }
            // 更新堕落条位置（使其位于性欲条上方5px）
            setTimeout(updateCorruptionBarPosition, 10);
          };

          // 创建堕落值变量条（位于外框内，从左上角开始算，W60px H8px为左上角位置）
          const corruptionValueBar = document.createElement('div');
          corruptionValueBar.className = 'corruption-value-bar';
          corruptionValueBar.id = 'corruption-value-bar';

          // 将外框和变量条添加到容器中
          corruptionBarContainer.appendChild(corruptionBar);
          corruptionBarContainer.appendChild(corruptionValueBar);

          // 创建性欲值显示条容器
          const lustBarContainer = document.createElement('div');
          lustBarContainer.className = 'lust-status-bar-container';
          lustBarContainer.id = 'lust-status-bar-container';

          // 创建性欲值显示条外框
          const lustBar = document.createElement('img');
          lustBar.className = 'lust-status-bar';
          lustBar.id = 'lust-status-bar';
          lustBar.src = uiUrl('lustBar');
          lustBar.alt = '性欲值';
          lustBar.onload = function() {
            // 保持原始图像像素尺寸，不允许变化
            if (this.naturalWidth && this.naturalHeight) {
              this.style.width = this.naturalWidth + 'px';
              this.style.height = this.naturalHeight + 'px';
              this.style.minWidth = this.naturalWidth + 'px';
              this.style.maxWidth = this.naturalWidth + 'px';
              this.style.minHeight = this.naturalHeight + 'px';
              this.style.maxHeight = this.naturalHeight + 'px';
            }
            // 更新堕落条位置（使其位于性欲条上方5px）
            setTimeout(updateCorruptionBarPosition, 10);
          };

          // 创建性欲值变量条（位于外框内，从左上角开始算，W60px H8px为左上角位置）
          const lustValueBar = document.createElement('div');
          lustValueBar.className = 'lust-value-bar';
          lustValueBar.id = 'lust-value-bar';

          // 将外框和变量条添加到容器中
          lustBarContainer.appendChild(lustBar);
          lustBarContainer.appendChild(lustValueBar);

          gameMenuContainer.appendChild(gameMenuExitBtn);
          gameMenuContainer.appendChild(corruptionBarContainer);
          gameMenuContainer.appendChild(lustBarContainer);
          gameMenuOverlay.appendChild(gameMenuContainer);
          gameMenuOverlay.appendChild(gameMenuSettingsUIContainer);
          gameMenuOverlay.appendChild(gameMenuTorinaSprite);

          // 退出按钮点击事件：关闭菜单
          gameMenuExitBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeGameMenu();
          });

          // 菜单按钮点击事件：打开/关闭菜单
          gameMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isGameMenuOpen()) closeGameMenu();
            else {
              openGameMenu();
              setTimeout(updateButtonAndLabelPositions, 50);
            }
          });

          // 窗口大小改变时也更新容器宽度和退出按钮位置
          window.addEventListener('resize', () => {
            if (isGameMenuOpen()) updateMenuContainerWidth();
          });

          // 点击菜单背景（容器）外部关闭菜单
          gameMenuOverlay.addEventListener('click', (e) => {
            if (e.target === gameMenuOverlay) closeGameMenu();
          });

          // 创建时间+天气系统显示区域
          const timeWeatherSystem = document.createElement('div');
          timeWeatherSystem.className = 'time-weather-system';
          timeWeatherSystem.id = 'time-weather-system';

          const timeBack = document.createElement('img');
          timeBack.className = 'time-back';
          timeBack.id = 'time-back';
          timeBack.src = uiUrl('timeBack');
          timeBack.alt = 'TimeBack';

          const timeImage = document.createElement('img');
          timeImage.className = 'time-image';
          timeImage.id = 'time-image';
          timeImage.alt = 'Time';

          timeWeatherSystem.appendChild(timeBack);
          timeWeatherSystem.appendChild(timeImage);

          // 创建 LeftCover（界面正中间，缩放比例跟随天气系统）
          const leftCover = document.createElement('img');
          leftCover.className = 'left-cover';
          leftCover.id = 'left-cover';
          leftCover.src = uiUrl('leftCover');
          leftCover.alt = 'LeftCover';

          // 创建体力进度条容器
          const staminaBarContainer = document.createElement('div');
          staminaBarContainer.className = 'stamina-bar-container';
          staminaBarContainer.id = 'stamina-bar-container';
          const staminaBar = document.createElement('div');
          staminaBar.className = 'stamina-bar';
          staminaBar.id = 'stamina-bar';
          staminaBarContainer.appendChild(staminaBar);

          // 创建体力数值显示
          const staminaText = document.createElement('div');
          staminaText.className = 'stamina-text';
          staminaText.id = 'stamina-text';
          staminaText.textContent = '100/100';

          // 创建时间信息显示
          const staminaTimeText = document.createElement('div');
          staminaTimeText.className = 'stamina-time-text';
          staminaTimeText.id = 'stamina-time-text';
          staminaTimeText.innerHTML = '<span id="stamina-time-day">第1天</span>  <span id="stamina-time-period">早晨</span>  <span id="stamina-time-weekday">星期一</span>';

          // 组装结构
          parchment.appendChild(stage);
          parchment.appendChild(dialogue);
          parchment.appendChild(dialogueNameArea); // 名字区独立于文本区
          ensureOtherPovToggle();
          parchment.appendChild(gameFullscreenBtn);
          parchment.appendChild(gameMenuBtn);
          parchment.appendChild(timeWeatherSystem);
          parchment.appendChild(leftCover);
          parchment.appendChild(staminaBarContainer);
          parchment.appendChild(staminaText);
          parchment.appendChild(staminaTimeText);

          // 插入到frame中
          frame.appendChild(parchment);
          if (window.妹神官_toolbar && window.妹神官_toolbar.mount) {
            window.妹神官_toolbar.mount(parchment);
          }

          // 将菜单界面添加到body（fixed定位需要添加到body）
          document.body.appendChild(gameMenuOverlay);

          // 绑定全屏按钮点击事件
          gameFullscreenBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFullScreen();
          });

          // 更新全屏按钮标题
          const updateGameFullscreenTitle = () => {
            const isFs = !!document.fullscreenElement;
            if (isFs) {
              gameFullscreenBtn.title = '退出全屏';
            } else {
              gameFullscreenBtn.title = '全屏';
            }
          };

          // 监听全屏状态变化
          document.addEventListener('fullscreenchange', updateGameFullscreenTitle);

          // 初始化提示状态
          updateGameFullscreenTitle();
        }

        if (window.妹神官_toolbar && window.妹神官_toolbar.mount) {
          window.妹神官_toolbar.mount(parchment);
        }
        applyTextFormatSettings();

        // 显示游戏界面（淡入动画）
        parchment.style.opacity = '0';
        parchment.classList.add('show');
        setTimeout(async () => {
          parchment.style.transition = 'opacity 0.5s ease-in';
          parchment.style.opacity = '1';

          // 新开局：注入预设对话（纯爱/正常共用，模式由 系统.模式 区分）
          if (!window._isLoadingArchive && !window._debugRivalMaleSprites && !window._debugHstatusInnerHead) {
            setTimeout(async () => {
              try {
                await processMessage(buildOpeningPresetDialogues(getGameMode()));
              } catch (e) {
                errorWithTag('GAME', '处理开局预设对话失败', e);
              }
            }, 600); // 等待淡入动画完成后再显示对话
          }

          // 初始化时间+天气系统（后续由变量刷新事件 refreshUIByVariablePath 驱动，无需轮询）
          try {
            await updateTimeWeatherSystem();
          } catch (e) {
            errorWithTag('TIME', '初始化时间天气系统失败', e);
          }

          // 初始化体力进度条（同上，事件驱动）
          try {
            await updateStaminaBar();
          } catch (e) {
            errorWithTag('STAMINA', '初始化体力条失败', e);
          }

          // 监听窗口大小变化，更新偏移量
          window.addEventListener('resize', () => {
            updateTimeImageOffset();
            updateLeftCoverPosition();
          });

          // 初始化 LeftCover 位置
          updateLeftCoverPosition();
        }, 100);
      }
    }

    const TITLE_BGM_BASE = 'https://huggingface.co/think-denim-frisk/FallenPriestess/resolve/main/audio/bgm/';
    const TITLE_BGM_PAIR = {
      nor: ['Title-yuuguredoki-Nor3', 'Title-yuuguredoki-Nor4'],
      sak: ['Title-yuuguredoki-Sak3', 'Title-yuuguredoki-Sak4']
    };

    function applyTitleBgmByStage(stage) {
      const pair = (stage === 3 || stage === 4) ? TITLE_BGM_PAIR.sak : TITLE_BGM_PAIR.nor;
      const stem = pair[Math.random() < 0.5 ? 1 : 0];
      const el = document.getElementById('intro-bgm');
      if (!el) return;
      const sources = el.querySelectorAll('source');
      if (sources[0]) sources[0].src = `${TITLE_BGM_BASE}${stem}.ogg`;
      if (sources[1]) sources[1].src = `${TITLE_BGM_BASE}${stem}.mp3`;
      el.load();
    }

    const TITLE_BGM_MUTE_KEY = 'meishinkan_title_bgm_muted';

    function isTitleBgmMuted() {
      try {
        return localStorage.getItem(TITLE_BGM_MUTE_KEY) === '1';
      } catch (_) {
        return false;
      }
    }

    function syncTitleBgmBtn() {
      const btn = document.getElementById('intro-bgm-btn');
      if (!btn) return;
      const off = isTitleBgmMuted();
      btn.classList.toggle('is-off', off);
      btn.setAttribute('aria-pressed', off ? 'false' : 'true');
    }

    function setTitleBgmMuted(muted) {
      try {
        localStorage.setItem(TITLE_BGM_MUTE_KEY, muted ? '1' : '0');
      } catch (_) {}
      const introBgm = document.getElementById('intro-bgm');
      if (muted) {
        if (introBgm) introBgm.pause();
      } else {
        playIntroBgm();
      }
      syncTitleBgmBtn();
    }

    function stopIntroBgm() {
      const introBgm = document.getElementById('intro-bgm');
      if (!introBgm) return;
      introBgm.pause();
      introBgm.currentTime = 0;
    }

    function playIntroBgm() {
      const introBgm = document.getElementById('intro-bgm');
      if (!introBgm || isTitleBgmMuted()) return;
      introBgm.volume = 0.45;
      const tryPlay = () => {
        if (isTitleBgmMuted()) return;
        introBgm.play().catch(() => {});
      };
      if (introBgm.readyState >= 2) tryPlay();
      else introBgm.addEventListener('canplay', tryPlay, { once: true });
      if (!playIntroBgm._unlockBound) {
        playIntroBgm._unlockBound = true;
        const unlock = () => {
          tryPlay();
          document.removeEventListener('pointerdown', unlock);
        };
        document.addEventListener('pointerdown', unlock);
      }
    }

    // 检查自动存档并更新加载图片（根据堕落阶段）
    async function checkAutoSaveAndUpdateLoadingImage() {
      let stageNum = 1;
      try {
        const AUTO_SAVE_NAME = '自动存档';
        const archive = await storageUtils.archivesDB.loadArchive(AUTO_SAVE_NAME);

        if (archive && archive.data && archive.data.dialogueLayers && archive.data.dialogueLayers.length > 0) {
          // 获取最后一条对话层
          const dialogueLayers = archive.data.dialogueLayers;
          // 找到最后一条对话层（奇数层，非玩家输入）
          let lastLayer = null;
          let maxOddLayer = 0;

          for (let i = dialogueLayers.length - 1; i >= 0; i--) {
            const layer = dialogueLayers[i];
            if (layer.type !== 'player' && layer.layer % 2 === 1) {
              if (layer.layer > maxOddLayer) {
                maxOddLayer = layer.layer;
                lastLayer = layer;
              }
            }
          }

          // 从存档原始层序列重建最后一层完整树（基准 + 逐层 delta，兼容旧整树档）
          let accTree = JSON.parse(JSON.stringify(ERA.defaultVars));
          for (const l of dialogueLayers) {
            if (l.varsDelta && typeof l.varsDelta === 'object') deepMerge(accTree, l.varsDelta);
            else if (l.varsSnapshot && typeof l.varsSnapshot === 'object') accTree = JSON.parse(JSON.stringify(l.varsSnapshot));
          }
          if (lastLayer) {
            // 获取堕落阶段
            const corruptionStage = getNestedValue(accTree, '托莉娜.基础.堕落阶段');
            const parsed = parseInt(corruptionStage, 10);
            if (parsed >= 1 && parsed <= 4) stageNum = parsed;

            // 如果堕落阶段为3或4，替换加载图片
            if (stageNum === 3 || stageNum === 4) {
              const loadingLogo = document.querySelector('.loading-logo');
              if (loadingLogo) {
                loadingLogo.src = uiUrl('loadingLogo');
                logWithTag('LOADING', '根据自动存档的堕落阶段，已更新加载图片');
              }
            }
          }
        }
      } catch (error) {
        // 如果检查失败，不影响正常加载流程
        warnWithTag('LOADING', '检查自动存档失败，使用默认加载图片:', error);
      }
      applyTitleBgmByStage(stageNum);
      return stageNum;
    }

    /** 调试模式：跳过加载界面与标题界面，直接进入世界地图（见 地图/README.md） */
    const DEBUG_SKIP_TO_WORLD_MAP = false;
    /** 调试模式：资源加载完成后跳过标题/开局，直接播放四名间男测试对话 */
    const DEBUG_RIVAL_MALE_SPRITES = false;
    /** 调试模式：资源加载完成后跳过标题/开局，直接打开里 Hstatus 头部界面 */
    const DEBUG_HSTATUS_INNER_HEAD = false;

    const RIVAL_MALE_DEBUG_TEXT = [
      '<背景|客厅>',
      '<哈罗德|这小妞还不赖……【间男立绘调试 1/4 · 哈罗德 · 仅本体】>',
      '<马蒂亚斯-阴影|哼，不过如此。【间男立绘调试 2/4 · 马蒂亚斯 · 本体+阴影】>',
      '<埃德加|欢迎光临，还要多瞧几眼吗？【间男立绘调试 3/4 · 埃德加】>',
      '<约书亚|哥哥不在的时候……【间男立绘调试 4/4 · 约书亚】>',
    ].join('\n');

    async function startHstatusInnerHeadDebug() {
      hideBootScreens();
      window._debugHstatusInnerHead = true;
      isLoveRouteStart = false;
      await initGameInterface();
      await new Promise(resolve => setTimeout(resolve, 400));
      hstatusPendingOpenState = { layer: 'inner', view: 'head' };
      openHstatusTable();
      window._debugHstatusInnerHead = false;
      logWithTag('DEBUG', '已打开里 Hstatus 头部界面（正常模式）');
    }

    async function startRivalMaleSpriteDebug() {
      hideBootScreens();
      window._debugRivalMaleSprites = true;
      await initGameInterface();
      await new Promise(resolve => setTimeout(resolve, 800));
      await updateMainText(RIVAL_MALE_DEBUG_TEXT);
      window._debugRivalMaleSprites = false;
      logWithTag('DEBUG', '间男立绘调试已启动：点击对话区右侧进入下一句，左侧回退');
    }

    function hideBootScreens() {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        const bootVideo = loadingScreen.querySelector('.loading-bg-video');
        if (bootVideo) bootVideo.pause();
      }
      stopIntroBgm();
      const introMask = document.getElementById('intro-mask');
      if (introMask) introMask.style.display = 'none';
      const openingPanel = document.getElementById('opening-panel');
      if (openingPanel) {
        openingPanel.classList.remove('open');
        openingPanel.style.display = 'none';
      }
    }

    // 页面加载完成后：先显示加载界面并加载资源，加载完成后再进入开始界面（新游戏/继续/选项）
    window.addEventListener('DOMContentLoaded', async () => {
      if (window.妹神官_settings_variable && typeof window.妹神官_settings_variable.init === 'function') {
        window.妹神官_settings_variable.init();
      }
      if (DEBUG_SKIP_TO_WORLD_MAP) {
        hideBootScreens();
        logWithTag('DEBUG', '跳过资源加载与开始界面');
        return;
      }

      // 初始化资源列表（用于设置界面）
      initializeResourceList();

      if (DEBUG_RIVAL_MALE_SPRITES) {
        try {
          await loadAllAssets();
          logWithTag('DEBUG', '资源加载完成，进入间男立绘调试');
          await startRivalMaleSpriteDebug();
        } catch (err) {
          console.error('[DEBUG] 间男立绘调试启动失败:', err);
        }
        return;
      }

      if (DEBUG_HSTATUS_INNER_HEAD) {
        try {
          await loadAllAssets();
          logWithTag('DEBUG', '资源加载完成，进入里 Hstatus 头部调试');
          await startHstatusInnerHeadDebug();
        } catch (err) {
          console.error('[DEBUG] 里 Hstatus 头部调试启动失败:', err);
        }
        return;
      }

      // 检查自动存档并更新加载图片
      await checkAutoSaveAndUpdateLoadingImage();

      // 先显示加载界面并等待所有资源加载完成（加载条与进度由 loadAllAssets 内部更新，完成后会自动隐藏加载界面）
      try {
        await loadAllAssets();
        logWithTag('DEBUG', '所有资源加载完成，进入开始界面');
        playIntroBgm();
      } catch (err) {
        console.error('资源加载出错:', err);
      }

      // 加载完成后不隐藏开始界面、不自动进入游戏；开始界面（intro-mask）保持显示，由用户点击「新游戏」「继续」「选项」再进入后续流程
    });

    // 全屏功能
    function toggleFullScreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen({ navigationUI: "hide" }).catch(err => {
          errorWithTag('FULLSCREEN', '进入全屏模式失败', err);
          alert(`进入全屏模式失败: ${err.message}`);
        });
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }

    const introBgmBtn = document.getElementById('intro-bgm-btn');
    if (introBgmBtn) {
      introBgmBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        setTitleBgmMuted(!isTitleBgmMuted());
      });
      syncTitleBgmBtn();
    }

    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFullScreen();
      });

      // 监听全屏状态变化，更新按钮提示
      const updateFullscreenTitle = () => {
        const isFs = !!document.fullscreenElement;
        fullscreenBtn.classList.toggle('is-fs', isFs);
        fullscreenBtn.title = isFs ? '退出全屏' : '全屏';
        fullscreenBtn.setAttribute('aria-label', fullscreenBtn.title);
      };

      // 监听全屏状态变化
      document.addEventListener('fullscreenchange', updateFullscreenTitle);

      // 初始化提示状态
      updateFullscreenTitle();
    }

    // 存储需要淡出/淡入的元素引用
    const decorativeElements = {
      introLogo: null,
      introCredits: null,
      introLicense: null,
      titleButtons: null,
      topRight: null
    };

    // 初始化元素引用
    decorativeElements.introLogo = document.querySelector('.intro-logo');
    decorativeElements.introCredits = document.querySelector('.intro-credits');
    decorativeElements.introLicense = document.querySelector('.intro-license');
    decorativeElements.titleButtons = document.querySelector('.title-buttons');
    decorativeElements.topRight = document.querySelector('.intro-top-right');

    // 淡出装饰元素
    function fadeOutDecorativeElements() {
      Object.values(decorativeElements).forEach(el => {
        if (el) {
          el.style.transition = 'opacity 0.5s ease-out';
          el.style.opacity = '0';
        }
      });
    }

    // 淡入装饰元素
    function fadeInDecorativeElements() {
      Object.values(decorativeElements).forEach(el => {
        if (el) {
          el.style.transition = 'opacity 0.5s ease-out';
          el.style.opacity = '1';
        }
      });
    }

    // NEW GAME：打开 Larimar 式开局选择
    document.getElementById('btn-newgame')?.addEventListener('click', (e) => {
      e.stopPropagation();
      fadeOutDecorativeElements();
      setTimeout(() => {
        if (window.妹神官_opening_select) window.妹神官_opening_select.open();
      }, 220);
    });

    window.妹神官_onOpeningClosed = function () {
      fadeInDecorativeElements();
    };

    window.妹神官_onOpeningPicked = async function (routeKey) {
      const isLoveRoute = routeKey === 'love';
      isLoveRouteStart = isLoveRoute;
      await setGameMode(isLoveRoute ? GAME_MODE_PURE_LOVE : GAME_MODE_NORMAL);

      try {
        await setvar('stat_data.系统.时间.小时', 8);
        await setvar('stat_data.系统.时间.分钟', 0);
        await setvar('stat_data.托莉娜.基础.服装', '常服');
        await setvar('stat_data.托莉娜.基础.堕落阶段', 1);
        logWithTag('GAME', '开局：已设置时间为 08:00，服装为常服，堕落阶段为1');
      } catch (err) {
        errorWithTag('GAME', '设置开局变量失败', err);
      }

      logWithTag('GAME', '开始游戏', isLoveRoute ? '(纯爱路线)' : '(游戏路线)');

      const introMask = document.getElementById('intro-mask');
      const openingPanel = document.getElementById('opening-panel');

      if (introMask) {
        introMask.style.transition = 'opacity 0.5s ease-out';
        introMask.style.opacity = '0';
        setTimeout(() => {
          if (introMask.parentNode) introMask.parentNode.removeChild(introMask);
        }, 500);
      }

      if (openingPanel) {
        openingPanel.classList.remove('open');
        openingPanel.style.transition = 'opacity 0.5s ease-out';
        openingPanel.style.opacity = '0';
        setTimeout(() => {
          openingPanel.style.display = 'none';
        }, 500);
      }

      setTimeout(async () => {
        await initGameInterface();
      }, 600);
    };

    // 继续按钮：打开存档界面
    document.getElementById('btn-continue')?.addEventListener('click', async (e) => {
      e.stopPropagation();
      logWithTag('GAME', '继续按钮被点击');

      // 打开存档界面
      const saveOverlay = document.getElementById('save-overlay');
      if (saveOverlay) {
        saveOverlay.classList.remove('hidden');
        // 打开时刷新存档列表
        await renderSaveArchiveList();
      }
    });

    // ============================================
    // 日志工具函数（带分类标签和错误样式）
    // ============================================
    const errorCache = new Set(); // 错误缓存，防止重复输出

    // ==================== 统一日志门面 ====================
    // 所有日志经 logWithTag/warnWithTag/errorWithTag 输出，带 [TAG] 前缀与级别。
    // 可通过 window.妹神官_setLogLevel('silent'|'error'|'warn'|'info'|'debug') 控制输出级别。
    const LOG_LEVELS = { silent: 0, error: 1, warn: 2, info: 3, debug: 4 };
    let currentLogLevel = LOG_LEVELS.info; // 默认输出 info 及以上（warn/error）

    function shouldLog(level) {
      return LOG_LEVELS[level] <= currentLogLevel;
    }

    function logWithTag(tag, message, ...args) {
      // 'DEBUG' 标签走 debug 通道（默认 info 级别下隐藏，调试时 setLogLevel('debug') 开启）
      const level = (tag === 'DEBUG') ? 'debug' : 'info';
      if (!shouldLog(level)) return;
      console.log(`[${tag}] ${message}`, ...args);
    }

    function warnWithTag(tag, message, ...args) {
      if (!shouldLog('warn')) return;
      console.warn(`[${tag}] ${message}`, ...args);
    }

    function errorWithTag(tag, message, error = null, ...args) {
      if (!shouldLog('error')) return;
      const errorKey = `${tag}:${message}`;
      if (errorCache.has(errorKey)) {
        return; // 已输出过，不再重复输出
      }
      errorCache.add(errorKey);

      // 使用红色样式输出错误
      console.error(`%c[ERROR][${tag}] ${message}`, 'color: red; font-weight: bold', error, ...args);

      // 如果错误有堆栈，也输出
      if (error && error.stack) {
        console.error(`%c[ERROR][${tag}] 错误堆栈:`, 'color: red; font-weight: bold', error.stack);
      }
    }

    // 暴露日志级别控制（便于调试时动态调整）
    window.妹神官_setLogLevel = function (level) {
      if (level in LOG_LEVELS) {
        currentLogLevel = LOG_LEVELS[level];
        console.log(`[LOG] 日志级别已切换为: ${level}`);
      } else {
        console.warn(`[LOG] 未知日志级别: ${level}，可选: ${Object.keys(LOG_LEVELS).join('/')}`);
      }
    };

    // 清除错误缓存（可选，用于重置错误状态）
    function clearErrorCache() {
      errorCache.clear();
    }

    // 全局变量：当前正在处理的消息内容
    let currentStreamingContent = '';
    let isStreamingActive = false;

    // 设置流式消息监听器
    const APPLY_STORY_HOOKS = false;

    /**
     * 模型常把托莉娜视角误写入 maintext；按标记尝试拆分到 otherpov
     * @param {string} maintext
     * @returns {{ maintext: string, otherpov: string }|null}
     */
    function trySplitLeakedOtherpov(maintext) {
      if (!maintext || /<imotoshinkan_otherpov>/i.test(maintext)) return null;
      const splitPatterns = [
        /\n【托莉娜视角】\s*/,
        /\n与此同时[，,]?\s*/,
        /\n(?:另一边|另一面)[，,]?\s*/,
        /\n(?:此时|楼下|楼上)[，,]?托莉娜/,
      ];
      for (const pattern of splitPatterns) {
        const match = maintext.match(pattern);
        if (!match || match.index == null || match.index < 40) continue;
        const otherpov = maintext.slice(match.index).trim().replace(/^【托莉娜视角】\s*/, '');
        const trimmedMain = maintext.slice(0, match.index).trim();
        if (trimmedMain.length >= 20 && otherpov.length >= 30) {
          return { maintext: trimmedMain, otherpov };
        }
      }
      return null;
    }

    /** @param {string} maintext @param {string} otherpov */
    function warnIfTorinaPovLeakedInMaintext(maintext, otherpov) {
      if (!maintext || otherpov?.trim()) return;
      if (/与此同时|另一边|另一面|【托莉娜视角】|\{\{user\}\}(?:并)?不知情|毫不知情|毫无察觉/.test(maintext)) {
        warnWithTag('MSG', '疑似托莉娜视角写在 maintext 内且未使用 otherpov');
        if (typeof toastr !== 'undefined') {
          toastr.warning('托莉娜视角可能写在正文中，未分离 otherpov', '', { timeOut: 5000 });
        }
      }
    }

    /** 移除 AI 写作过程残留的 HTML 注释（如 <!--Prism：...-->），避免被对话标签正则误匹配 */
    function stripAiHtmlComments(text) {
      if (!text || typeof text !== 'string') return text;
      return text.replace(/<!--[\s\S]*?-->/g, '').replace(/\n{3,}/g, '\n\n').trim();
    }

    // 捕获并解析标签内容（仅解析 <imotoshinkan>...</imotoshinkan> 内内容，忽略标签外一切）
    function parseTags(content) {
      const result = {
        maintext: '',
        otherpov: '',
        branches: '',
        snapshots: '',
        variables: '',
        hook: ''
      };

      const wrapMatch = content.match(/<imotoshinkan>([\s\S]*?)<\/imotoshinkan>/i);
      if (wrapMatch && wrapMatch[1]) {
        content = wrapMatch[1].trim();
      } else {
        content = ''; // 无外层 imotoshinkan 则忽略整段，不解析
      }

      // 捕获 maintext：原格式 + 全大写、全大写无下划线变体
      const maintextMatch = content.match(/<imotoshinkan_maintext>([\s\S]*?)<\/imotoshinkan_maintext>/);
      if (maintextMatch && maintextMatch[1].trim()) result.maintext = maintextMatch[1].trim();
      if (!result.maintext) {
        const m1 = content.match(/<IMOTOSHINKAN_MAINTEXT>([\s\S]*?)<\/IMOTOSHINKAN_MAINTEXT>/);
        if (m1 && m1[1].trim()) result.maintext = m1[1].trim();
      }
      if (!result.maintext) {
        const m2 = content.match(/<IMOTOSHINKANMAINTEXT>([\s\S]*?)<\/IMOTOSHINKANMAINTEXT>/);
        if (m2 && m2[1].trim()) result.maintext = m2[1].trim();
      }
      // 从 maintext 中拆出 otherpov：正文正常解析，otherpov 单独用于切换视角
      if (result.maintext) {
        const opMatch = result.maintext.match(/<imotoshinkan_otherpov>([\s\S]*?)<\/imotoshinkan_otherpov>/i)
          || result.maintext.match(/<IMOTOSHINKAN_OTHERPOV>([\s\S]*?)<\/IMOTOSHINKAN_OTHERPOV>/)
          || result.maintext.match(/<IMOTOSHINKANOTHERPOV>([\s\S]*?)<\/IMOTOSHINKANOTHERPOV>/);
        if (opMatch && opMatch[1].trim()) {
          result.otherpov = opMatch[1].trim();
          result.maintext = result.maintext
            .replace(/<imotoshinkan_otherpov>[\s\S]*?<\/imotoshinkan_otherpov>/gi, '')
            .replace(/<IMOTOSHINKAN_OTHERPOV>[\s\S]*?<\/IMOTOSHINKAN_OTHERPOV>/g, '')
            .replace(/<IMOTOSHINKANOTHERPOV>[\s\S]*?<\/IMOTOSHINKANOTHERPOV>/gi, '')
            .trim();
        }
        if (!result.otherpov && APPLY_STORY_HOOKS) {
          const split = trySplitLeakedOtherpov(result.maintext);
          if (split) {
            result.maintext = split.maintext;
            result.otherpov = split.otherpov;
            warnWithTag('MSG', '已从 maintext 自动拆分 otherpov（模型未使用标签）');
          }
        }
      }

      if (result.maintext) result.maintext = stripAiHtmlComments(result.maintext);
      if (result.otherpov) result.otherpov = stripAiHtmlComments(result.otherpov);

      // 捕获 branches：原格式 + 全大写、全大写无下划线变体
      const branchesMatch = content.match(/<imotoshinkan_branches>([\s\S]*?)<\/imotoshinkan_branches>/);
      if (branchesMatch && branchesMatch[1].trim()) result.branches = branchesMatch[1].trim();
      if (!result.branches) {
        const b1 = content.match(/<IMOTOSHINKAN_BRANCHES>([\s\S]*?)<\/IMOTOSHINKAN_BRANCHES>/);
        if (b1 && b1[1].trim()) result.branches = b1[1].trim();
      }
      if (!result.branches) {
        const b2 = content.match(/<IMOTOSHINKANBRANCHES>([\s\S]*?)<\/IMOTOSHINKANBRANCHES>/);
        if (b2 && b2[1].trim()) result.branches = b2[1].trim();
      }

      // 捕获 snapshots：原格式 + 全大写、全大写无下划线变体
      const snapshotsMatch = content.match(/<imotoshinkan_snapshots>([\s\S]*?)<\/imotoshinkan_snapshots>/);
      if (snapshotsMatch && snapshotsMatch[1].trim()) result.snapshots = snapshotsMatch[1].trim();
      if (!result.snapshots) {
        const s1 = content.match(/<IMOTOSHINKAN_SNAPSHOTS>([\s\S]*?)<\/IMOTOSHINKAN_SNAPSHOTS>/);
        if (s1 && s1[1].trim()) result.snapshots = s1[1].trim();
      }
      if (!result.snapshots) {
        const s2 = content.match(/<IMOTOSHINKANSNAPSHOTS>([\s\S]*?)<\/IMOTOSHINKANSNAPSHOTS>/);
        if (s2 && s2[1].trim()) result.snapshots = s2[1].trim();
      }

      // 从 UpdateVariable 类块内提取变量正文：优先取内层 imotoshinkan_variables（任意大小写），否则整块作为变量
      function extractVariablesFromUpdateBlock(innerText) {
        if (!innerText || !innerText.trim()) return '';
        const inner = innerText.trim();
        const nested = inner.match(/<imotoshinkan_variables>([\s\S]*?)<\/imotoshinkan_variables>/i)
          || inner.match(/<IMOTOSHINKAN_VARIABLES>([\s\S]*?)<\/IMOTOSHINKAN_VARIABLES>/)
          || inner.match(/<IMOTOSHINKANVARIABLES>([\s\S]*?)<\/IMOTOSHINKANVARIABLES>/);
        return nested ? nested[1].trim() : inner;
      }

      // 变量更新：多种标签格式，按顺序尝试，先匹配到的有效（保证捕获稳定）
      if (!result.variables) {
        const variablesMatch = content.match(/<imotoshinkan_variables>([\s\S]*?)<\/imotoshinkan_variables>/);
        if (variablesMatch && variablesMatch[1].trim()) result.variables = variablesMatch[1].trim();
      }
      if (!result.variables) {
        const updateVarMatch = content.match(/<UpdateVariable>([\s\S]*?)<\/UpdateVariable>/);
        if (updateVarMatch) {
          const extracted = extractVariablesFromUpdateBlock(updateVarMatch[1]);
          if (extracted) result.variables = extracted;
        }
      }
      if (!result.variables) {
        const bigMatch = content.match(/<IMOTOSHINKAN_VARIABLES>([\s\S]*?)<\/IMOTOSHINKAN_VARIABLES>/);
        if (bigMatch && bigMatch[1].trim()) result.variables = bigMatch[1].trim();
      }
      if (!result.variables) {
        const noUnderscoreMatch = content.match(/<IMOTOSHINKANVARIABLES>([\s\S]*?)<\/IMOTOSHINKANVARIABLES>/);
        if (noUnderscoreMatch && noUnderscoreMatch[1].trim()) result.variables = noUnderscoreMatch[1].trim();
      }
      if (!result.variables) {
        const updateBigMatch = content.match(/<UPDATEVARIABLE>([\s\S]*?)<\/UPDATEVARIABLE>/);
        if (updateBigMatch) {
          const extracted = extractVariablesFromUpdateBlock(updateBigMatch[1]);
          if (extracted) result.variables = extracted;
        }
      }
      if (!result.variables) {
        const updateUnderscoreMatch = content.match(/<UPDATE_VARIABLE>([\s\S]*?)<\/UPDATE_VARIABLE>/);
        if (updateUnderscoreMatch) {
          const extracted = extractVariablesFromUpdateBlock(updateUnderscoreMatch[1]);
          if (extracted) result.variables = extracted;
        }
      }

      const hookMatch = content.match(/<imotoshinkan_hook>([\s\S]*?)<\/imotoshinkan_hook>/i);
      if (hookMatch && hookMatch[1].trim()) result.hook = hookMatch[1].trim();

      return result;
    }

    /** @typedef {{ text: string, category: string, tags: Array<{ key: string, value: string }> }} BranchOption */

    /** 行动选项六大分类（AI 输出时每条须带分类前缀） */
    const BRANCH_CATEGORIES = ['亲密', '日常', '移动', '推荐', '观察或被动', '快进时间'];

    const BRANCH_CATEGORY_ALIASES = {
      观察: '观察或被动',
      被动: '观察或被动',
      快进: '快进时间',
    };

    function normalizeBranchCategory(raw) {
      if (!raw) return '推荐';
      const t = String(raw).trim();
      if (BRANCH_CATEGORIES.includes(t)) return t;
      return BRANCH_CATEGORY_ALIASES[t] || '推荐';
    }

    /** 解析单行：分类|行动文案，或 [分类] 段落后的纯文案行 */
    function parseBranchLine(line, fallbackCategory = null) {
      const trimmed = String(line).trim();
      if (!trimmed) return null;

      const catPrefix = trimmed.match(/^(亲密|日常|移动|推荐|观察或被动|快进时间|观察|被动|快进)[:：|｜](.+)$/);
      if (catPrefix) {
        return {
          text: catPrefix[2].trim(),
          category: normalizeBranchCategory(catPrefix[1]),
          tags: [],
        };
      }

      if (fallbackCategory) {
        return { text: trimmed, category: fallbackCategory, tags: [] };
      }

      const parts = trimmed.split('|').map(p => p.trim()).filter(Boolean);
      if (parts.length === 0) return null;
      /** @type {BranchOption} */
      const option = { text: parts[0], category: '推荐', tags: [] };
      for (let i = 1; i < parts.length; i++) {
        const m = parts[i].match(/^([^:：]+)[:：](.+)$/);
        if (m) option.tags.push({ key: m[1].trim(), value: m[2].trim() });
      }
      return option;
    }

    /** @param {BranchOption|string} option */
    function getBranchOptionText(option) {
      if (typeof option === 'string') return option;
      return option?.text || '';
    }

    /**
     * 解析 branches（数量不限，按六大分类）
     * 标准格式（换行，每行一条）：
     *   亲密|轻轻抚摸她的头发
     *   日常|一起整理房间
     *   移动|前往酒馆
     *   ……
     * 亦支持 [亲密] 段落标题 + 下方纯文案行
     * 兼容旧格式：单行 选项1|选项2|选项3 → 归入「推荐」
     */
    function parseBranchesOptions(branchesText) {
      if (!branchesText || !String(branchesText).trim()) return [];
      const raw = String(branchesText).trim();
      const lines = raw.split(/\n/).map(l => l.trim()).filter(Boolean);

      if (lines.length === 1) {
        const only = lines[0];
        const hasCategoryPrefix = /^(亲密|日常|移动|推荐|观察或被动|快进时间|观察|被动|快进)[:：|｜]/.test(only);
        const hasSectionHeader = /^\[(亲密|日常|移动|推荐|观察或被动|快进时间)\]$/.test(only);
        if (!hasCategoryPrefix && !hasSectionHeader) {
          const parts = only.split('|').map(p => p.trim()).filter(Boolean);
          const tagParts = parts.slice(1).filter(p => /^[^:：]+[:：]/.test(p));
          if (!(tagParts.length === parts.length - 1 && parts.length > 1)) {
            return parts.map(p => ({ text: p, category: '推荐', tags: [] }));
          }
        }
      }

      /** @type {BranchOption[]} */
      const options = [];
      let currentCategory = null;

      for (const line of lines) {
        const headerMatch = line.match(/^\[(亲密|日常|移动|推荐|观察或被动|快进时间)\]$/);
        if (headerMatch) {
          currentCategory = normalizeBranchCategory(headerMatch[1]);
          continue;
        }

        const prefixed = parseBranchLine(line);
        if (prefixed && /^(亲密|日常|移动|推荐|观察或被动|快进时间|观察|被动|快进)[:：|｜]/.test(line)) {
          options.push(prefixed);
          continue;
        }

        if (currentCategory) {
          const plain = parseBranchLine(line, currentCategory);
          if (plain) options.push(plain);
          continue;
        }

        if (prefixed) options.push(prefixed);
      }

      return options;
    }

    function groupBranchOptionsByCategory(options) {
      /** @type {Map<string, BranchOption[]>} */
      const groups = new Map(BRANCH_CATEGORIES.map(c => [c, []]));
      options.forEach(opt => {
        const cat = normalizeBranchCategory(opt.category);
        groups.get(cat).push(opt);
      });
      return groups;
    }

    function attachBranchCardEditHandlers(card, text, inputBox) {
      if (!inputBox || !text) return;
      card.addEventListener('contextmenu', e => {
        e.preventDefault();
        inputBox.value = text;
        inputBox.focus();
      });
      let pressTimer = null;
      card.addEventListener('touchstart', () => {
        pressTimer = setTimeout(() => {
          inputBox.value = text;
          inputBox.focus();
        }, 480);
      }, { passive: true });
      const clearPress = () => {
        if (pressTimer) {
          clearTimeout(pressTimer);
          pressTimer = null;
        }
      };
      card.addEventListener('touchend', clearPress);
      card.addEventListener('touchmove', clearPress);
      card.addEventListener('touchcancel', clearPress);
    }

    /** @param {BranchOption} option @param {() => void} onSelect @param {HTMLInputElement|null} inputBox */
    function createBranchActionCard(option, onSelect, inputBox) {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'branch-action-card';
      const mark = document.createElement('span');
      mark.className = 'branch-action-mark';
      mark.setAttribute('aria-hidden', 'true');
      const body = document.createElement('div');
      body.className = 'branch-action-body';
      const main = document.createElement('div');
      main.className = 'branch-action-main';
      main.textContent = option.text;
      body.appendChild(main);
      if (option.tags.length > 0) {
        const meta = document.createElement('div');
        meta.className = 'branch-action-meta';
        meta.textContent = option.tags.map(t => `${t.key}:${t.value}`).join(' · ');
        body.appendChild(meta);
      }
      card.appendChild(mark);
      card.appendChild(body);
      card.addEventListener('click', e => {
        e.stopPropagation();
        onSelect();
      });
      attachBranchCardEditHandlers(card, option.text, inputBox);
      return card;
    }

    /** @param {HTMLElement} container @param {string} branchesText @param {(text: string) => void|Promise<void>} onSelect */
    function mountBranchActionUI(container, branchesText, onSelect) {
      const options = parseBranchesOptions(branchesText);

      const panel = document.createElement('div');
      panel.className = 'branch-action-panel';

      const inputRow = document.createElement('div');
      inputRow.className = 'branch-action-input-row';
      const inputBox = document.createElement('input');
      inputBox.type = 'text';
      inputBox.className = 'branch-action-input';
      inputBox.id = 'quest-custom-input';
      inputBox.placeholder = '写下此刻的决定…';
      const sendBtn = document.createElement('button');
      sendBtn.type = 'button';
      sendBtn.className = 'branch-action-send-btn';
      sendBtn.textContent = '落笔';
      sendBtn.addEventListener('click', () => {
        const value = inputBox.value.trim();
        if (value) onSelect(value);
      });
      inputBox.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendBtn.click();
        }
      });
      inputRow.append(inputBox, sendBtn);

      if (options.length > 0) {
        const hint = document.createElement('div');
        hint.className = 'branch-action-hint';
        hint.textContent = '点选即行 · 右键或长按可改写后再落笔';
        const list = document.createElement('div');
        list.className = 'branch-action-list';
        const grouped = groupBranchOptionsByCategory(options);
        BRANCH_CATEGORIES.forEach(category => {
          const items = grouped.get(category);
          if (!items || items.length === 0) return;
          const section = document.createElement('section');
          section.className = 'branch-action-section';
          const sectionTitle = document.createElement('h3');
          sectionTitle.className = 'branch-action-section-title';
          sectionTitle.textContent = category;
          section.appendChild(sectionTitle);
          items.forEach(option => {
            section.appendChild(createBranchActionCard(option, () => onSelect(option.text), inputBox));
          });
          list.appendChild(section);
        });
        panel.append(hint, list, inputRow);
      } else {
        inputRow.classList.add('is-solo');
        panel.append(inputRow);
      }

      container.appendChild(panel);
    }

    // 将 snapshots 竖线格式转为逗号格式（天数|星期几|小时:分钟|总结 → 天数,星期几,小时:分钟,总结），供后续 addTimeToSnapshots 等使用
    function normalizeSnapshotsText(snapshotsText) {
      if (!snapshotsText || !String(snapshotsText).trim()) return snapshotsText || '';
      const s = String(snapshotsText).trim();
      if (!s.includes('|')) return s;
      return s.split('|').map(part => part.trim()).filter(part => part.length > 0).join(',');
    }

    // 获取变量值（使用JS-Slash-Runner标准API）
    // 获取变量值（只使用 ERA）
    async function getvar(path) {
      try {
        // 移除路径中的 'stat_data.' 前缀（如果存在）
        let actualPath = path;
        if (path.startsWith('stat_data.')) {
          actualPath = path.substring('stat_data.'.length);
        }

        // 优先从最后对话层快照读取（当前运行时值就是最后对话层快照）
        const lastLayer = getLastDialogueLayer();
        if (lastLayer && getLayerVars(lastLayer)) {
          const snapshotValue = getNestedValue(getLayerVars(lastLayer), actualPath);
          if (snapshotValue !== undefined) {
            return snapshotValue;
          }
        }

        // 如果最后对话层快照不存在，使用 ERA.currentVars（它应该就是最后对话层快照）
        let vars = ERA.currentVars || ERA.cache.vars;

        if (vars) {
          const cachedValue = getNestedValue(vars, actualPath);
          if (cachedValue !== undefined) {
            return cachedValue;
          }
        }

        // 缓存不存在或值未找到，尝试从 ERA 查询（使用缓存机制）
        if (ERA.initialized) {
          try {
            vars = await ERA.getCurrentVars();
            if (vars) {
              const eraValue = getNestedValue(vars, actualPath);
              if (eraValue !== undefined) {
                return eraValue;
              }
            }
          } catch (e) {
            // ERA 查询失败，使用默认值
          }
        }

        // 返回默认值
        return getNestedValue(ERA.defaultVars, actualPath);
      } catch (e) {
        return getNestedValue(ERA.defaultVars, actualPath);
      }
    }

    // AI 回复中的 _.set / _.add 禁止直接改动的路径（仅引擎内部 setvar 可改）
    const AI_LOCKED_VAR_PATHS = new Set([
      '托莉娜.基础.堕落阶段',
      '托莉娜.基础.堕落值',
      '托莉娜.Hstate纯爱.表.总表.现时魔力',
      '托莉娜.Hstate纯爱.表.总表.现时魔力需求',
      '托莉娜.Hstate正常.表.总表.现时魔力',
      '托莉娜.Hstate正常.表.总表.现时魔力需求',
      '托莉娜.Hstate正常.表.总表.总吸取魔力次数',
      '托莉娜.Hstate正常.里.头部.吞下的精液量',
      '托莉娜.Hstate正常.里.阴部.被射入精液总量',
      '系统.模式',
    ]);

    function getGameModeFromSnapshot(snapshot) {
      const raw = snapshot ? getNestedValue(snapshot, '系统.模式') : null;
      if (raw === GAME_MODE_PURE_LOVE || raw === '纯爱路线') return GAME_MODE_PURE_LOVE;
      return GAME_MODE_NORMAL;
    }

    function getHstateOuterTablePrefix(snapshot) {
      return getGameModeFromSnapshot(snapshot) === GAME_MODE_PURE_LOVE
        ? '托莉娜.Hstate纯爱.表'
        : '托莉娜.Hstate正常.表';
    }

    function pathBelongsToPureLoveHstate(path) {
      return typeof path === 'string' && path.startsWith('托莉娜.Hstate纯爱.');
    }

    function pathBelongsToNormalHstate(path) {
      return typeof path === 'string' && path.startsWith('托莉娜.Hstate正常.');
    }

    const DEFAULT_NORMAL_HSTATE_TABLE = {
      总表: {
        现时魔力: 100,
        现时魔力需求: 0,
        总吸取魔力次数: 0,
        总吸取魔力量: 0,
        与你高潮次数: 0,
      },
      头部: { 与你亲吻次数: 0, 与你口交次数: 0 },
      胸部: { 与你乳交次数: 0 },
      足部: { 与你足交次数: 0 },
    };

    function ensureNormalHstateTable(snapshot) {
      if (!snapshot?.托莉娜) return;
      if (!snapshot.托莉娜.Hstate正常) snapshot.托莉娜.Hstate正常 = {};
      if (!snapshot.托莉娜.Hstate正常.表) {
        snapshot.托莉娜.Hstate正常.表 = JSON.parse(JSON.stringify(DEFAULT_NORMAL_HSTATE_TABLE));
      }
    }

    function normalizeVarPath(path) {
      if (!path || typeof path !== 'string') return '';
      let p = path.trim();
      if (p.startsWith('stat_data.')) p = p.substring('stat_data.'.length);
      return p;
    }

    /** 旧路径托莉娜.Hstate.表/里 → 新路径 Hstate纯爱.表 / Hstate正常.里 */
    function remapLegacyHstatePath(path) {
      const p = normalizeVarPath(path);
      if (p.startsWith('托莉娜.Hstate.表.')) {
        return '托莉娜.Hstate纯爱.表.' + p.substring('托莉娜.Hstate.表.'.length);
      }
      if (p.startsWith('托莉娜.Hstate.里.')) {
        return '托莉娜.Hstate正常.里.' + p.substring('托莉娜.Hstate.里.'.length);
      }
      return p;
    }

    /** 读档/旧聊天变量：合并 legacy 托莉娜.Hstate 到 Hstate纯爱/Hstate正常 */
    function migrateLegacyHstateTree(snapshot) {
      if (!snapshot) return;
      if (snapshot.系统 && snapshot.系统.请求) {
        adoptRequestFlags(snapshot.系统.请求);
        delete snapshot.系统.请求;
      }
      stripSystemRequest(snapshot);
      if (!snapshot.托莉娜) return;
      const torina = snapshot.托莉娜;
      if (torina.Hstate) {
        const legacy = torina.Hstate;
        if (legacy.表) {
          if (!torina.Hstate纯爱) torina.Hstate纯爱 = {};
          if (!torina.Hstate纯爱.表) torina.Hstate纯爱.表 = legacy.表;
        }
        if (legacy.里) {
          if (!torina.Hstate正常) torina.Hstate正常 = {};
          if (!torina.Hstate正常.里) torina.Hstate正常.里 = legacy.里;
        }
        delete torina.Hstate;
      }
      ensureNormalHstateTable(snapshot);
    }

    function isAiLockedVarPath(path) {
      return AI_LOCKED_VAR_PATHS.has(remapLegacyHstatePath(path));
    }

    // 现时魔力 = 100 - 性欲值；现时魔力需求 = 性欲值（仅更新当前模式对应表树）
    function syncMagicFromLust(snapshot) {
      if (!snapshot) return;
      const lustRaw = getNestedValue(snapshot, '托莉娜.基础.性欲值');
      const lust = Math.max(0, Math.min(100, parseFloat(lustRaw) || 0));
      const prefix = getHstateOuterTablePrefix(snapshot);
      setNestedValue(snapshot, `${prefix}.总表.现时魔力`, 100 - lust);
      setNestedValue(snapshot, `${prefix}.总表.现时魔力需求`, lust);
    }

    // 从你吸取魔力次数 = 与你口交次数+与你足交次数+与你接吻次数+被你颜射次数+与你乳交次数+与你性交次数+与你肛交次数
    const ABSORB_COUNT_SOURCE_PATHS = [
      '托莉娜.Hstate纯爱.表.头部.与你口交次数',
      '托莉娜.Hstate纯爱.表.足部.与你足交次数',
      '托莉娜.Hstate纯爱.表.头部.与你接吻次数',
      '托莉娜.Hstate纯爱.表.头部.被你颜射次数',
      '托莉娜.Hstate纯爱.表.胸部.与你乳交次数',
      '托莉娜.Hstate纯爱.表.阴部.与你性交次数',
      '托莉娜.Hstate纯爱.表.阴部.与你肛交次数',
      '托莉娜.Hstate纯爱.表.总表.因为其他原因吸取你魔力次数'
    ];
    function recalcAbsorbCountFromSeven(snapshot) {
      if (!snapshot) return 0;
      let sum = 0;
      ABSORB_COUNT_SOURCE_PATHS.forEach(p => { sum += (parseFloat(getNestedValue(snapshot, p)) || 0); });
      setNestedValue(snapshot, '托莉娜.Hstate纯爱.表.总表.从你吸取魔力次数', sum);
      logWithTag('VAR', '自动计算：从你吸取魔力次数 = 口交+足交+接吻+颜射+乳交+性交+肛交+因为其他原因吸取你魔力次数 =', sum);
      return sum;
    }

    // 从你吸取魔力总量 = 接吻获得的魔力量 + 乳交吸取你魔力总量 + 小穴吸取你的魔力总量 + 屁穴吸取你的魔力总量 + 因为其他原因吸取你魔力
    const ABSORB_TOTAL_SOURCE_PATHS = [
      '托莉娜.Hstate纯爱.表.头部.与你接吻获得的魔力量',
      '托莉娜.Hstate纯爱.表.胸部.乳交吸取你魔力总量',
      '托莉娜.Hstate纯爱.表.阴部.小穴吸取你的魔力总量',
      '托莉娜.Hstate纯爱.表.阴部.屁穴吸取你的魔力总量',
      '托莉娜.Hstate纯爱.表.总表.因为其他原因吸取你魔力'
    ];
    function recalcAbsorbTotalFromSources(snapshot) {
      if (!snapshot) return 0;
      let sum = 0;
      ABSORB_TOTAL_SOURCE_PATHS.forEach(p => { sum += (parseFloat(getNestedValue(snapshot, p)) || 0); });
      setNestedValue(snapshot, '托莉娜.Hstate纯爱.表.总表.从你吸取魔力总量', sum);
      logWithTag('VAR', '自动计算：从你吸取魔力总量 = 接吻魔力量+乳交+小穴+屁穴+因为其他原因吸取你魔力 =', sum);
      return sum;
    }

    // 与你高潮的次数 = 因你小穴高潮次数 + 因你屁穴高潮次数 + 因为你胸部高潮次数 + 因为其他原因被你玩弄至高潮
    const ORGASM_COUNT_SOURCE_PATHS = [
      '托莉娜.Hstate纯爱.表.阴部.因你小穴高潮次数',
      '托莉娜.Hstate纯爱.表.阴部.因你屁穴高潮次数',
      '托莉娜.Hstate纯爱.表.胸部.因为你胸部高潮次数',
      '托莉娜.Hstate纯爱.表.总表.因为其他原因被你玩弄至高潮'
    ];
    function recalcOrgasmCountFromSources(snapshot) {
      if (!snapshot) return 0;
      let sum = 0;
      ORGASM_COUNT_SOURCE_PATHS.forEach(p => { sum += (parseFloat(getNestedValue(snapshot, p)) || 0); });
      setNestedValue(snapshot, '托莉娜.Hstate纯爱.表.总表.与你高潮的次数', sum);
      logWithTag('VAR', '自动计算：与你高潮的次数 = 因你小穴高潮+因你屁穴高潮+因为你胸部高潮+因为其他原因被你玩弄至高潮 =', sum);
      return sum;
    }

    const NORMAL_ABSORB_COUNT_SOURCE_PATHS = [
      '托莉娜.Hstate正常.表.头部.与你亲吻次数',
      '托莉娜.Hstate正常.表.头部.与你口交次数',
      '托莉娜.Hstate正常.表.胸部.与你乳交次数',
      '托莉娜.Hstate正常.表.足部.与你足交次数',
    ];
    function recalcNormalAbsorbCount(snapshot) {
      if (!snapshot) return 0;
      let sum = 0;
      NORMAL_ABSORB_COUNT_SOURCE_PATHS.forEach(p => { sum += (parseFloat(getNestedValue(snapshot, p)) || 0); });
      setNestedValue(snapshot, '托莉娜.Hstate正常.表.总表.总吸取魔力次数', sum);
      logWithTag('VAR', '自动计算：总吸取魔力次数 = 亲吻+口交+乳交+足交 =', sum);
      return sum;
    }

    const NORMAL_INNER_MOUTH_SEMEN_PATH = '托莉娜.Hstate正常.里.头部.口中精液量';
    const NORMAL_INNER_SWALLOWED_PATH = '托莉娜.Hstate正常.里.头部.吞下的精液量';
    const NORMAL_INNER_UTERUS_SEMEN_PATH = '托莉娜.Hstate正常.里.阴部.子宫内精液量';
    const NORMAL_INNER_RECTAL_SEMEN_PATH = '托莉娜.Hstate正常.里.阴部.直肠内精液量';
    const NORMAL_INNER_INJECTED_TOTAL_PATH = '托莉娜.Hstate正常.里.阴部.被射入精液总量';

    /** 正常·里：口中/子宫/直肠精液量 _.add 正向增量时同步累计派生量（负增量不同步） */
    function applyNormalInnerSemenSyncFromAdd(snapshot, sourcePath, increment) {
      if (!snapshot || getGameModeFromSnapshot(snapshot) !== GAME_MODE_NORMAL) return;
      const path = remapLegacyHstatePath(sourcePath);
      const delta = parseFloat(increment);
      if (!Number.isFinite(delta) || delta <= 0) return;
      if (path === NORMAL_INNER_MOUTH_SEMEN_PATH) {
        const cur = parseFloat(getNestedValue(snapshot, NORMAL_INNER_SWALLOWED_PATH)) || 0;
        setNestedValue(snapshot, NORMAL_INNER_SWALLOWED_PATH, cur + delta);
        logWithTag('VAR', '正常·里：吞下的精液量 +=', delta, '(口中精液量正向增量)');
      } else if (path === NORMAL_INNER_UTERUS_SEMEN_PATH || path === NORMAL_INNER_RECTAL_SEMEN_PATH) {
        const cur = parseFloat(getNestedValue(snapshot, NORMAL_INNER_INJECTED_TOTAL_PATH)) || 0;
        setNestedValue(snapshot, NORMAL_INNER_INJECTED_TOTAL_PATH, cur + delta);
        logWithTag('VAR', '正常·里：被射入精液总量 +=', delta, `(${path})`);
      }
    }

    function recomputeDerivedHstateFields(snapshot) {
      if (!snapshot) return;
      const mode = getGameModeFromSnapshot(snapshot);
      syncMagicFromLust(snapshot);
      if (mode === GAME_MODE_PURE_LOVE) {
        recalcAbsorbCountFromSeven(snapshot);
        recalcAbsorbTotalFromSources(snapshot);
        recalcOrgasmCountFromSources(snapshot);
      } else {
        recalcNormalAbsorbCount(snapshot);
      }
    }

    function triggerHstateRecalc(snapshot, actualPath) {
      if (!snapshot || !actualPath) return;
      const mode = getGameModeFromSnapshot(snapshot);
      if (actualPath === '托莉娜.基础.性欲值') {
        recomputeDerivedHstateFields(snapshot);
        return;
      }
      if (mode === GAME_MODE_PURE_LOVE) {
        if (!pathBelongsToPureLoveHstate(actualPath)) return;
        if (ABSORB_COUNT_SOURCE_PATHS.includes(actualPath)) recalcAbsorbCountFromSeven(snapshot);
        if (ABSORB_TOTAL_SOURCE_PATHS.includes(actualPath)) recalcAbsorbTotalFromSources(snapshot);
        if (ORGASM_COUNT_SOURCE_PATHS.includes(actualPath)) recalcOrgasmCountFromSources(snapshot);
      } else if (mode === GAME_MODE_NORMAL) {
        if (!pathBelongsToNormalHstate(actualPath)) return;
        if (NORMAL_ABSORB_COUNT_SOURCE_PATHS.includes(actualPath)) recalcNormalAbsorbCount(snapshot);
      }
    }

    // 设置变量值（只使用 ERA）
    async function setvar(path, value) {
      try {
        // 移除路径中的 'stat_data.' 前缀（如果存在）
        let actualPath = path;
        if (path.startsWith('stat_data.')) {
          actualPath = path.substring('stat_data.'.length);
        }
        actualPath = remapLegacyHstatePath(actualPath);

        // 使用 ERA 更新变量
        ERA.updateByPath(actualPath, value);

        // 获取或创建最后对话层，确保 varsSnapshot 存在
        const lastLayer = getLastDialogueLayer();
        if (!lastLayer) {
          // 如果没有对话层，初始化 ERA.currentVars
          if (!ERA.currentVars) {
            ERA.currentVars = JSON.parse(JSON.stringify(ERA.defaultVars));
          }
          if (!ERA.cache.vars) {
            ERA.cache.vars = JSON.parse(JSON.stringify(ERA.defaultVars));
          }
          // 更新缓存
          setNestedValue(ERA.currentVars, actualPath, value);
          setNestedValue(ERA.cache.vars, actualPath, value);

          triggerHstateRecalc(ERA.currentVars, actualPath);
          if (ERA.cache.vars !== ERA.currentVars) triggerHstateRecalc(ERA.cache.vars, actualPath);
          ERA.cache.timestamp = Date.now();
          return true;
        }

        // 获取最后对话层完整变量树（惰性重建 + 缓存）
        const varsSnapshot = getLayerVars(lastLayer);
        migrateLegacyHstateTree(varsSnapshot);
        const numValue = parseFloat(value) || 0;

        // 特殊处理：性欲值溢出到堕落值
        if (actualPath === '托莉娜.基础.性欲值') {
          // 限制性欲值上限为100
          if (numValue > 100) {
            const overflow = numValue - 100;
            const corruptionIncrease = Math.floor(overflow * 0.5); // 向下取整

            // 性欲值限制为100
            value = 100;

            // 获取当前堕落值
            let currentCorruption = getNestedValue(varsSnapshot, '托莉娜.基础.堕落值');
            currentCorruption = parseFloat(currentCorruption) || 0;

            // 增加堕落值（但不超过100）
            const newCorruption = Math.min(100, currentCorruption + corruptionIncrease);

            logWithTag('VAR', '性欲值溢出:', numValue, '-> 100, 堕落值增加:', corruptionIncrease, '->', newCorruption);

            // 先更新堕落值（如果达到100，会触发堕落阶段增加）
            await setvar('托莉娜.基础.堕落值', newCorruption);
          } else {
            // 如果性欲值不超过100，限制在0-100之间
            value = Math.max(0, Math.min(100, numValue));
          }
        }

        // 特殊处理：堕落值达到100时，清空一半的性欲值和全部堕落值，增加1堕落阶段
        if (actualPath === '托莉娜.基础.堕落值') {
          // 限制堕落值上限为100
          const clampedValue = Math.max(0, Math.min(100, numValue));

          if (clampedValue >= 100) {
            // 获取当前性欲值
            let currentLust = getNestedValue(varsSnapshot, '托莉娜.基础.性欲值');
            currentLust = parseFloat(currentLust) || 0;

            // 获取当前堕落阶段
            let currentStage = getNestedValue(varsSnapshot, '托莉娜.基础.堕落阶段');
            currentStage = parseInt(currentStage, 10) || 1;

            // 清空一半的性欲值和全部堕落值
            const newLust = Math.floor(currentLust / 2);
            const newCorruption = 0; // 全部清空堕落值

            // 增加1堕落阶段（但不超过4）
            const newStage = Math.min(4, currentStage + 1);

            logWithTag('VAR', '堕落值达到100，触发阶段提升:', {
              原性欲值: currentLust,
              新性欲值: newLust,
              原堕落值: 100,
              新堕落值: newCorruption,
              原阶段: currentStage,
              新阶段: newStage
            });

            // 先更新性欲值
            await setvar('托莉娜.基础.性欲值', newLust);

            // 更新堕落阶段
            await setvar('托莉娜.基础.堕落阶段', newStage);

            // 最后更新堕落值（设置为0）
            value = newCorruption;
          } else {
            // 如果堕落值不超过100，限制在0-100之间
            value = clampedValue;
          }
        }

        // 更新最后对话层的变量快照（这是当前运行时值的来源）
        setNestedValue(getLayerVars(lastLayer), actualPath, value);
        // 记录增量：该变动属于本层（AI 层为本轮增量容器）
        recordLayerDelta(lastLayer, actualPath, value);

        triggerHstateRecalc(getLayerVars(lastLayer), actualPath);
        // 同步更新 ERA.currentVars 和 cache.vars，使其与最后对话层快照保持一致
        // 让 ERA.currentVars 直接引用最后对话层的快照，避免多套平行值
        ERA.currentVars = getLayerVars(lastLayer);
        ERA.cache.vars = getLayerVars(lastLayer);
        ERA.cache.timestamp = Date.now();

        logWithTag('VAR', '已更新变量（当前运行时值 = 最后对话层快照）:', actualPath, '=', value);

        // 刷新相关界面元素
        refreshUIByVariablePath(actualPath).catch(e => {
          warnWithTag('VAR', '刷新界面元素失败:', e);
        });

        return true;
      } catch (e) {
        errorWithTag('VAR', '设置变量失败', e);
        return false;
      }
    }

    // 更新变量（增量更新，只使用 ERA）
    async function updatevar(path, increment) {
      try {
        // 移除路径中的 'stat_data.' 前缀（如果存在）
        let actualPath = path;
        if (path.startsWith('stat_data.')) {
          actualPath = path.substring('stat_data.'.length);
        }
        actualPath = remapLegacyHstatePath(actualPath);

        // 使用 ERA（支持 += 运算符）
        ERA.updateByPath(actualPath, increment, '+=');

        // 获取或创建最后对话层，确保 varsSnapshot 存在
        const lastLayer = getLastDialogueLayer();
        if (!lastLayer) {
          // 如果没有对话层，无法更新快照
          return true;
        }

        // 获取最后对话层完整变量树（惰性重建 + 缓存）
        const updSnap = getLayerVars(lastLayer);

        // 获取当前值并计算新值
        const currentValue = getNestedValue(updSnap, actualPath);
        let newValue = (parseFloat(currentValue) || 0) + parseFloat(increment);

        // 特殊处理：性欲值溢出到堕落值
        if (actualPath === '托莉娜.基础.性欲值') {
          // 如果性欲值超过100，将超出部分*0.5（向下取整）加到堕落值
          if (newValue > 100) {
            const overflow = newValue - 100;
            const corruptionIncrease = Math.floor(overflow * 0.5); // 向下取整

            // 性欲值限制为100
            newValue = 100;

            // 获取当前堕落值
            let currentCorruption = getNestedValue(getLayerVars(lastLayer), '托莉娜.基础.堕落值');
            currentCorruption = parseFloat(currentCorruption) || 0;

            // 增加堕落值（但不超过100）
            const newCorruption = Math.min(100, currentCorruption + corruptionIncrease);

            logWithTag('VAR', '性欲值溢出（增量）:', currentValue, '+', increment, '-> 100, 堕落值增加:', corruptionIncrease, '->', newCorruption);

            // 先更新堕落值（如果达到100，会触发堕落阶段增加）
            await setvar('托莉娜.基础.堕落值', newCorruption);
          } else {
            // 如果性欲值不超过100，限制在0-100之间
            newValue = Math.max(0, Math.min(100, newValue));
          }
        }

        // 特殊处理：堕落值达到100时，清空一半的性欲值和全部堕落值，增加1堕落阶段
        if (actualPath === '托莉娜.基础.堕落值') {
          // 限制堕落值上限为100
          const clampedValue = Math.max(0, Math.min(100, newValue));

          if (clampedValue >= 100) {
            // 获取当前性欲值
            let currentLust = getNestedValue(getLayerVars(lastLayer), '托莉娜.基础.性欲值');
            currentLust = parseFloat(currentLust) || 0;

            // 获取当前堕落阶段
            let currentStage = getNestedValue(getLayerVars(lastLayer), '托莉娜.基础.堕落阶段');
            currentStage = parseInt(currentStage, 10) || 1;

            // 清空一半的性欲值和全部堕落值
            const newLust = Math.floor(currentLust / 2);
            const newCorruption = 0; // 全部清空堕落值

            // 增加1堕落阶段（但不超过4）
            const newStage = Math.min(4, currentStage + 1);

            logWithTag('VAR', '堕落值达到100（增量），触发阶段提升:', {
              原性欲值: currentLust,
              新性欲值: newLust,
              原堕落值: 100,
              新堕落值: newCorruption,
              原阶段: currentStage,
              新阶段: newStage
            });

            // 先更新性欲值
            await setvar('托莉娜.基础.性欲值', newLust);

            // 更新堕落阶段
            await setvar('托莉娜.基础.堕落阶段', newStage);

            // 最后更新堕落值（设置为0）
            newValue = newCorruption;
          } else {
            // 如果堕落值不超过100，限制在0-100之间
            newValue = clampedValue;
          }
        }

        // 更新最后对话层的变量快照（这是当前运行时值的来源）
        setNestedValue(getLayerVars(lastLayer), actualPath, newValue);
        // 记录增量：该变动属于本层（AI 层为本轮增量容器）
        recordLayerDelta(lastLayer, actualPath, newValue);
        applyNormalInnerSemenSyncFromAdd(getLayerVars(lastLayer), actualPath, increment);

        triggerHstateRecalc(getLayerVars(lastLayer), actualPath);
        // 同步更新 ERA.currentVars 和 cache.vars，使其与最后对话层快照保持一致
        ERA.currentVars = getLayerVars(lastLayer);
        ERA.cache.vars = getLayerVars(lastLayer);
        ERA.cache.timestamp = Date.now();

        logWithTag('VAR', '已更新变量（增量，当前运行时值 = 最后对话层快照）:', actualPath, '=', currentValue, '+', increment, '=', newValue);

        // 刷新相关界面元素
        refreshUIByVariablePath(actualPath).catch(e => {
          warnWithTag('VAR', '刷新界面元素失败:', e);
        });

        return true;
      } catch (e) {
        errorWithTag('VAR', '更新变量失败', e);
        return false;
      }
    }

    // ==================== 根据变量路径刷新相关界面元素 ====================
    /** 游戏模式世界书：纯爱→UID33 开 / UID43 关；正常→UID43 开 / UID33 关 */
    const GAME_MODE_LORE_UID = { PURE_LOVE: 33, NORMAL: 43 };

    /** 堕落阶段相关世界书 UID（3/4 规则组 + 纯爱人设 12–15 + 正常人设 44–47） */
    const CORRUPTION_STAGE_LORE_UIDS = [3, 4, 12, 13, 14, 15, 44, 45, 46, 47];

    /** @returns {Set<number>} 当前应开启的堕落阶段相关 UID */
    function getCorruptionStageEnabledUIDs(stage, pureLoveMode) {
      const s = Math.min(4, Math.max(1, parseInt(stage, 10) || 1));
      const enabled = new Set();
      enabled.add(s <= 2 ? 3 : 4);
      if (pureLoveMode) {
        enabled.add(11 + s);
      } else {
        enabled.add(43 + s); // 正常模式：阶段1→44 … 阶段4→47
      }
      return enabled;
    }

    function syncLocalWorldbookUids(stage, outfitValue, pureLoveMode) {
      const wb = window.妹神官_settings_worldbook;
      if (!wb || typeof wb.applyEnabled !== 'function') return;
      const enabledStageUids = getCorruptionStageEnabledUIDs(stage, pureLoveMode);
      const updates = [];
      for (const uid of CORRUPTION_STAGE_LORE_UIDS) {
        updates.push({ uid, enabled: enabledStageUids.has(uid) });
      }
      const outfitUIDs = [8, 10, 9, 18, 17, 2];
      let targetUID = null;
      if (outfitValue === '常服') targetUID = 8;
      else if (outfitValue === '暴露常服') targetUID = 10;
      else if (outfitValue === '魅魔常服') targetUID = 9;
      else if (outfitValue === '魔王服') targetUID = 18;
      else if (outfitValue === '浴巾') targetUID = 17;
      else if (outfitValue === '女仆装') targetUID = 2;
      for (const uid of outfitUIDs) {
        updates.push({ uid, enabled: uid === targetUID });
      }
      updates.push({ uid: GAME_MODE_LORE_UID.PURE_LOVE, enabled: !!pureLoveMode });
      updates.push({ uid: GAME_MODE_LORE_UID.NORMAL, enabled: !pureLoveMode });
      wb.applyEnabled(updates);
    }

    // 检测并控制 UID 状态（根据堕落阶段和服装，同步本地世界书条目开关）
    async function checkAndControlUIDs() {
      try {
        // 获取当前堕落阶段和服装
        const corruptionStage = await getvar('stat_data.托莉娜.基础.堕落阶段');
        const outfit = await getvar('stat_data.托莉娜.基础.服装');

        const stage = parseInt(corruptionStage, 10) || 1;
        const outfitValue = outfit || '常服';
        const pureLoveMode = isPureLoveMode();
        syncLocalWorldbookUids(stage, outfitValue, pureLoveMode);
      } catch (e) {
        console.error('[UID] 检测和控制 UID 失败:', e);
      }
    }

    // ==================== UI 刷新批量合并 ====================
    // 问题：变量连发（一轮 AI 可能改 N 个变量）时，旧实现每个变量都 checkAndControlUIDs + 各自刷 UI，
    // 导致 N 次 UID 检测、N 次立绘重绘、N 次 Hstatus 重算。
    // 方案：把每条路径需要的 UI 副作用翻译成「待办标记」并入集合，下一帧统一执行一次。
    const _uiRefreshState = {
      pending: false,       // 是否已安排一帧后的统一刷新
      uid: false,           // 需要 checkAndControlUIDs
      galSprite: false,     // 需要重绘 gal 立绘
      menuSprite: false,    // 需要重绘菜单立绘
      hstatusSprite: false, // 需要重绘 Hstatus 立绘
      hstatusText: false,   // 需要重绘 Hstatus 文字
      corruptionBar: false, // 需要刷新堕落值条
      lustBar: false,       // 需要刷新性欲值条
      cumOverlays: false,   // 需要刷新精液叠加层
      wombPopup: false,     // 需要刷新子宫精液弹窗
      timeWeather: false,   // 需要刷新时间/天气
      stamina: false,       // 需要刷新体力条
      mapMarkers: false     // 需要刷新地图角色标记
    };

    // 把一条变量路径翻译成待办标记（不立即操作 DOM）
    function _collectUIRefreshFlags(path) {
      const s = _uiRefreshState;
      s.uid = true; // 任意变量变动都需要先检测 UID（统一做一次）
      if (path === '托莉娜.基础.堕落阶段') {
        s.galSprite = true; s.menuSprite = true; s.hstatusSprite = true; s.hstatusText = true;
      } else if (path === '托莉娜.基础.堕落值') {
        s.corruptionBar = true;
      } else if (path === '托莉娜.基础.性欲值') {
        s.lustBar = true; s.hstatusText = true;
      } else if (path && path.startsWith('托莉娜.Hstate纯爱.表.精液状态')) {
        s.cumOverlays = true;
      } else if (path === '托莉娜.Hstate纯爱.表.阴部.子宫内你的精液量') {
        s.wombPopup = true;
      } else if (path && path.startsWith('托莉娜.Hstate纯爱.表.足部')) {
        s.hstatusText = true;
      } else if (path === '托莉娜.Hstate正常.里.总表.献出初夜的对象') {
        s.hstatusText = true;
      } else if (path && path.startsWith('托莉娜.Hstate正常.表.')) {
        s.hstatusText = true;
      } else if (path === '托莉娜.基础.服装') {
        s.galSprite = true; s.menuSprite = true; s.hstatusSprite = true; s.hstatusText = true;
      } else if (path && (path.startsWith('系统.时间.') || path === '系统.天气')) {
        s.timeWeather = true;
      } else if (path === '系统.体力.当前体力值') {
        s.stamina = true;
      } else if (
        path === '系统.地点.当前地点' || path === '系统.地点.托莉娜地点' ||
        path === '地点.当前地点' || path === '地点.托莉娜地点' || path === '托莉娜.行程.同行状态'
      ) {
        s.mapMarkers = true;
      }
    }

    function _resetUIRefreshFlags() {
      const s = _uiRefreshState;
      s.pending = false;
      s.uid = s.galSprite = s.menuSprite = s.hstatusSprite = s.hstatusText = false;
      s.corruptionBar = s.lustBar = s.cumOverlays = s.wombPopup = false;
      s.timeWeather = s.stamina = s.mapMarkers = false;
    }

    // 统一执行收集到的所有 UI 副作用（每种只跑一次）
    async function _flushUIRefresh() {
      const s = _uiRefreshState;
      _resetUIRefreshFlags();
      try {
        if (s.uid) await checkAndControlUIDs();

        const menuOpen = (() => { const el = document.getElementById('game-menu-overlay'); return !!(el && el.classList.contains('show')); })();
        const hstatusOpen = (() => { const el = document.getElementById('hstatus-table-overlay'); return !!(el && el.classList.contains('show')); })();

        // gal 立绘（堕落阶段/服装共用同一重绘逻辑）
        if (s.galSprite) {
          const lastLayer = getLastDialogueLayer();
          if (lastLayer && lastLayer.maintext) {
            const dialogues = parseTolinaDialogues(lastLayer.maintext);
            if (dialogues.length > 0) {
              await renderDialogueSprite(dialogues[dialogues.length - 1]);
            }
          }
        }
        if (s.menuSprite && menuOpen) await updateMenuTorinaSprite();
        if (s.hstatusSprite && hstatusOpen) await updateHstatusSprite();
        if (s.hstatusText && hstatusOpen) await updateHstatusText();
        if (s.corruptionBar) {
          if (menuOpen) await updateCorruptionValueBar();
          updateCorruptionBarPosition();
        }
        if (s.lustBar && menuOpen) await updateLustValueBar();
        if (s.cumOverlays && hstatusOpen) {
          const lastLayer = getLastDialogueLayer();
          const snap = (lastLayer && getLayerVars(lastLayer)) ? getLayerVars(lastLayer) : ERA.currentVars;
          updateHstatusCumOverlays(snap);
        }
        if (s.wombPopup && hstatusOpen && hstatusViewMode === 'crotch') {
          const lastLayer = getLastDialogueLayer();
          const snap = (lastLayer && getLayerVars(lastLayer)) ? getLayerVars(lastLayer) : ERA.currentVars;
          updateWombPopup(snap);
        }
        if (s.timeWeather) await updateTimeWeatherSystem();
        if (s.stamina) await updateStaminaBar();
        if (s.mapMarkers && typeof MeishinkanWorldMap?.refreshActorMarkers === 'function') {
          await MeishinkanWorldMap.refreshActorMarkers();
        }
        logWithTag('刷新', '批量界面刷新完成');
      } catch (e) {
        console.error('[刷新] ❌ 批量刷新过程出错:', e);
      }
    }

    // 对外入口：收集路径并安排一次统一刷新（同一帧内多次调用只刷一次）
    async function refreshUIByVariablePath(path) {
      _collectUIRefreshFlags(path);
      if (_uiRefreshState.pending) return; // 已安排，等下一帧统一刷
      _uiRefreshState.pending = true;
      // 用 requestAnimationFrame（无则退化为 setTimeout 0）把本帧内所有变动合并成一次刷新
      const schedule = (typeof requestAnimationFrame === 'function')
        ? requestAnimationFrame
        : (cb) => setTimeout(cb, 0);
      schedule(() => { _flushUIRefresh(); });
    }


    // ==================== 控制台测试变量接口 ====================
    // 在浏览器控制台中使用：_.set('路径', 值), _.add('路径', 增量), _.help()
    window._ = {
      /**
       * 获取变量值（无需await，直接调用即可）
       * @param {string} path - 变量路径，例如 '托莉娜.基础.堕落值' 或 '系统.时间.当前时间'
       * @returns {Promise<any>} 变量值
       * @example
       * _.get('托莉娜.基础.堕落值')
       * _.get('系统.时间.当前时间')
       */
      get(path) {
        const promise = (async () => {
          try {
            const value = await getvar(path);
            logWithTag('_', `${path} =`, value);
            return value;
          } catch (e) {
            console.error(`[_] 获取失败: ${path}`, e);
            return undefined;
          }
        })();
        // 自动处理 Promise，无需 await
        promise.catch(() => {});
        return promise;
      },

      /**
       * 设置变量值（无需await，直接调用即可）
       * @param {string} path - 变量路径
       * @param {any} value - 要设置的值
       * @returns {Promise<boolean>} 是否成功
       * @example
       * _.set('托莉娜.基础.堕落值', 50)
       * _.set('托莉娜.基础.堕落阶段', 2)
       * _.set('系统.时间.当前时间', '晚')
       */
      set(path, value) {
        const promise = (async () => {
          try {
            const success = await setvar(path, value);
            if (success) {
              logWithTag('_', `✅ 已设置: ${path} =`, value);
            } else {
              warnWithTag('_', `⚠️ 设置失败: ${path}`);
            }
            return success;
          } catch (e) {
            console.error(`[_] ❌ 设置失败: ${path}`, e);
            return false;
          }
        })();
        // 自动处理 Promise，无需 await
        promise.catch(() => {});
        return promise;
      },

      /**
       * 增加变量值（允许负数，负数表示减少，无需await，直接调用即可）
       * @param {string} path - 变量路径
       * @param {number} amount - 增加的值（正数增加，负数减少）
       * @returns {Promise<boolean>} 是否成功
       * @example
       * _.add('托莉娜.基础.堕落值', 10)   // 增加10
       * _.add('托莉娜.基础.堕落值', -5)  // 减少5
       * _.add('系统.体力.当前体力值', -20) // 减少20体力
       */
      add(path, amount) {
        const promise = (async () => {
          try {
            const currentValue = await getvar(path);
            if (currentValue === undefined || currentValue === null) {
              warnWithTag('_', `⚠️ 变量不存在，无法更新: ${path}`);
              return false;
            }

            const newValue = (parseFloat(currentValue) || 0) + parseFloat(amount);
            const success = await setvar(path, newValue);
            if (success) {
              logWithTag('_', `✅ 已更新: ${path} = ${currentValue} ${amount >= 0 ? '+' : ''}${amount} = ${newValue}`);
            }
            return success;
          } catch (e) {
            console.error(`[_] ❌ 更新失败: ${path}`, e);
            return false;
          }
        })();
        // 自动处理 Promise，无需 await
        promise.catch(() => {});
        return promise;
      },

      /**
       * 批量设置变量（无需await，直接调用即可）
       * @param {Object} vars - 变量对象，键为路径，值为变量值
       * @returns {Promise<boolean>} 是否成功
       * @example
       * _.batch({
       *   '托莉娜.基础.堕落值': 50,
       *   '托莉娜.基础.堕落阶段': 2,
       *   '系统.时间.当前时间': '晚'
       * })
       */
      batch(vars) {
        const promise = (async () => {
          try {
            if (!vars || typeof vars !== 'object') {
              console.error('[_] ❌ batch() 需要传入一个对象');
              return false;
            }

            const results = await Promise.all(
              Object.entries(vars).map(([path, value]) => this.set(path, value))
            );

            const successCount = results.filter(r => r).length;
            logWithTag('_', `✅ 批量设置完成: ${successCount}/${Object.keys(vars).length} 成功`);
            return successCount === Object.keys(vars).length;
          } catch (e) {
            console.error('[_] ❌ 批量设置失败', e);
            return false;
          }
        })();
        // 自动处理 Promise，无需 await
        promise.catch(() => {});
        return promise;
      },

      /**
       * 显示所有变量（用于调试，无需await，直接调用即可）
       * @returns {Promise<Object>} 所有变量对象
       * @example
       * _.showAll()
       */
      showAll() {
        const promise = (async () => {
          try {
            const vars = ERA.currentVars || ERA.cache.vars || ERA.defaultVars;
            logWithTag('_', '📋 所有变量:', vars);
            return vars;
          } catch (e) {
            console.error('[_] ❌ 获取所有变量失败', e);
            return null;
          }
        })();
        // 自动处理 Promise，无需 await
        promise.catch(() => {});
        return promise;
      },

      /**
       * 显示所有变量的键和值（格式化输出，无需await，直接调用即可）
       * @returns {Promise<Object>} 所有变量对象
       * @example
       * _.show()
       */
      show() {
        const promise = (async () => {
          try {
            const vars = ERA.currentVars || ERA.cache.vars || ERA.defaultVars;

            // 递归函数，将嵌套对象转换为扁平化的键值对
            const flattenObject = (obj, prefix = '') => {
              const result = {};
              for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                  const newKey = prefix ? `${prefix}.${key}` : key;
                  if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                    // 递归处理嵌套对象
                    Object.assign(result, flattenObject(obj[key], newKey));
                  } else {
                    // 叶子节点，直接添加
                    result[newKey] = obj[key];
                  }
                }
              }
              return result;
            };

            const flattened = flattenObject(vars);

            console.group('[_] 📋 所有变量（键值对）');
            for (const [key, value] of Object.entries(flattened)) {
              logWithTag('DEBUG', `  ${key}:`, value);
            }
            console.groupEnd();

            return vars;
          } catch (e) {
            console.error('[_] ❌ 获取所有变量失败', e);
            return null;
          }
        })();
        // 自动处理 Promise，无需 await
        promise.catch(() => {});
        return promise;
      },

      /**
       * 显示帮助信息
       */
      help() {
        logWithTag('DEBUG', `
╔══════════════════════════════════════════════════════════════╗
║              控制台测试变量接口 - 使用说明                    ║
╚══════════════════════════════════════════════════════════════╝

📖 基本用法：

1️⃣  设置变量值：
   _.set('托莉娜.基础.堕落阶段', 2)
   _.set('托莉娜.基础.堕落值', 50)
   _.set('系统.时间.当前时间', '晚')
   _.set('托莉娜.基础.性欲值', 30)

2️⃣  增加/减少变量值（允许负数）：
   _.add('托莉娜.基础.堕落值', 10)   // 增加10
   _.add('托莉娜.基础.堕落值', -5)   // 减少5
   _.add('系统.体力.当前体力值', -20) // 减少20体力

3️⃣  获取变量值：
   _.get('托莉娜.基础.堕落值')
   _.get('系统.时间.当前时间')
   _.get('系统.体力.当前体力值')

4️⃣  批量设置变量：
   _.batch({
     '托莉娜.基础.堕落值': 50,
     '托莉娜.基础.堕落阶段': 2,
     '系统.时间.当前时间': '晚',
     '系统.体力.当前体力值': 80
   })

5️⃣  显示所有变量（原始对象）：
   _.showAll()

6️⃣  显示所有变量的键和值（格式化）：
   _.show()

7️⃣  查看帮助：
   _.help()

💡 提示：
- 所有方法都可以直接调用，无需 await
- 路径可以包含或不包含 'stat_data.' 前缀（会自动处理）
- 变量值会自动同步到 ERA 系统
- 使用 _.help() 可以随时查看此帮助信息

📝 常用变量路径示例：
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
托莉娜相关：
  • 托莉娜.基础.堕落值          (0-100)
  • 托莉娜.基础.堕落阶段        (1-4)
  • 托莉娜.基础.性欲值          (0-100)

系统时间：
  • 系统.时间.当前时间          ('早'/'中'/'晚'/'夜'/'午夜')
  • 系统.时间.已经过天数        (整数)
  • 系统.时间.星期              ('星期一'/'星期二'/...)
  • 系统.时间.小时              (0-23)
  • 系统.时间.分钟              (0-59)

系统体力：
  • 系统.体力.当前体力值        (0-上限)
  • 系统.体力.当前体力值上限    (通常为100)

系统其他：
  • 系统.天气                   ('晴'/'雨'/...)

H状态（表·总表/头部/胸部/阴部/精液状态）：
  • 托莉娜.Hstate纯爱.表.总表.现时魔力 / 现时魔力需求 / 从你吸取魔力次数·总量 / 与你高潮的次数
  • 托莉娜.Hstate纯爱.表.头部.与你口交次数 / 与你接吻次数 / 被你深喉·颜射次数 / 口中·吞下的你精液量 等
  • 托莉娜.Hstate纯爱.表.胸部.与你乳交次数 / 胸部被你爱抚次数 / 乳交吸取你魔力总量 等
  • 托莉娜.Hstate纯爱.表.阴部.与你性交·肛交次数 / 小穴·屁穴相关 / 被你外射·内射次数 / 子宫内·直肠内你的精液量 等
  • 托莉娜.Hstate纯爱.表.足部.与你足交次数 / 被你足部射精次数 / 足部现时你的精液量 / 总足部被你射精量
  • 托莉娜.Hstate纯爱.表.精液状态.当前胸部·腹部·腿部精液量

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 快速测试示例：
   // 设置堕落阶段为2
   _.set('托莉娜.基础.堕落阶段', 2)

   // 增加10点堕落值
   _.add('托莉娜.基础.堕落值', 10)

   // 查看当前堕落值
   _.get('托莉娜.基础.堕落值')

   // 减少20点体力
   _.add('系统.体力.当前体力值', -20)
        `);
      }
    };

    // 初始化时显示帮助提示
    logWithTag('DEBUG', '%c[测试变量]', 'color: #4CAF50; font-weight: bold; font-size: 14px;',
      '控制台测试变量接口已就绪！输入 _.help() 查看使用说明');

    // 默认游戏变量（根据[initvar].yaml定义）
    // 已移除：不再使用默认值，只从MVU读取

    // 时间图片映射（数据来自 resource/game-assets.js）
    const timeImageMap = (window.妹神官_gameAssets && window.妹神官_gameAssets.timeImageMap) || {};

    // 时间文本映射（用于显示）
    const timeTextMap = {
      '早': '早晨',
      '中': '中午',
      '晚': '黄昏',
      '夜': '晚上',
      '午夜': '午夜'
    };

    // 更新时间+天气系统显示
    async function updateTimeWeatherSystem() {
      const timeImage = document.getElementById('time-image');
      const timeBack = document.getElementById('time-back');
      if (!timeImage || !timeBack) return;

      // 读取时间和天气变量
      const time = await getvar('stat_data.系统.时间.当前时间');
      const weather = await getvar('stat_data.系统.天气'); // 天气变量如果不存在会返回null
      const day = await getvar('stat_data.系统.时间.已经过天数');
      const weekday = await getvar('stat_data.系统.时间.星期');
      const hour = await getvar('stat_data.系统.时间.小时');
      const minute = await getvar('stat_data.系统.时间.分钟');

      // 更新时间信息显示
      const timeDay = document.getElementById('stamina-time-day');
      const timePeriod = document.getElementById('stamina-time-period');
      const timeWeekday = document.getElementById('stamina-time-weekday');

      if (timeDay) {
        const dayNum = parseInt(day, 10) || 0;
        timeDay.textContent = `第${dayNum + 1}天`;
      }
      if (timePeriod) {
        // 显示具体时间：小时:分钟
        if (hour !== null && hour !== undefined && minute !== null && minute !== undefined) {
          const hourNum = parseInt(hour, 10);
          const minuteNum = parseInt(minute, 10);
          // 检查解析后的值是否有效（不是NaN）
          if (!isNaN(hourNum) && !isNaN(minuteNum)) {
            // 格式化时间：确保小时和分钟都是两位数
            const formattedHour = String(hourNum).padStart(2, '0');
            const formattedMinute = String(minuteNum).padStart(2, '0');
            timePeriod.textContent = `${formattedHour}:${formattedMinute}`;
          } else {
            // 如果解析失败，使用默认值或时间段
            const displayTime = timeTextMap[time] || timeTextMap['早'] || '早晨';
            timePeriod.textContent = displayTime;
          }
        } else {
          // 如果无法获取小时和分钟，使用默认值或时间段
          const displayTime = timeTextMap[time] || timeTextMap['早'] || '早晨';
          timePeriod.textContent = displayTime;
        }
      }
      if (timeWeekday) {
        timeWeekday.textContent = weekday || '星期一';
      }

      // 如果天气是雨，使用下雨图片
      const gaTW = window.妹神官_gameAssets;
      const rainDayUrl = (gaTW && gaTW.getWeatherImage) ? gaTW.getWeatherImage('rainDay') : null;
      const rainNightUrl = (gaTW && gaTW.getWeatherImage) ? gaTW.getWeatherImage('rainNight') : null;
      const morningUrl = (gaTW && gaTW.getTimeImage) ? gaTW.getTimeImage('早') : null;
      if (weather === '雨' || weather === 'rain') {
        if (time === '夜' || time === '午夜') {
          timeImage.src = rainNightUrl; // 夜和午夜使用晚上下雨图
        } else {
          timeImage.src = rainDayUrl; // 早中晚（含未读取到）使用白天下雨图
        }
        timeImage.classList.add('show');
      } else if (time && timeImageMap[time]) {
        // 如果天气不是雨，根据时间显示对应图片
        timeImage.src = timeImageMap[time];
        timeImage.classList.add('show');
      } else {
        // 如果时间未读取到，默认显示早晨图
        timeImage.src = morningUrl;
        timeImage.classList.add('show');
      }

      // 计算缩放比例并调整偏移量
      // 原始timeback图片宽度（需要根据实际图片大小调整，这里假设为某个值）
      // 由于我们不知道原始图片大小，我们可以通过实际渲染后的尺寸来计算
      // 或者使用一个固定的原始尺寸值
      // 假设原始timeback宽度为某个值（比如200px），我们需要根据实际渲染尺寸计算
      // 更简单的方法：使用CSS变量或者直接通过计算容器宽度与原始宽度的比例

      // 等待图片加载完成后计算偏移
      if (timeImage.complete && timeBack.complete) {
        updateTimeImageOffset();
        updateLeftCoverPosition();
      } else {
        timeImage.onload = () => {
          updateTimeImageOffset();
          updateLeftCoverPosition();
        };
        timeBack.onload = () => {
          updateTimeImageOffset();
          updateLeftCoverPosition();
        };
      }
    }

    // 更新时间图片的偏移量（基于缩放比例）
    function updateTimeImageOffset() {
      const timeImage = document.getElementById('time-image');
      const timeBack = document.getElementById('time-back');
      const timeWeatherSystem = document.getElementById('time-weather-system');

      if (!timeImage || !timeBack || !timeWeatherSystem) return;

      // 获取timeback的原始宽度（从图片的自然尺寸）
      // 如果图片已加载，使用naturalWidth
      const originalBackWidth = timeBack.naturalWidth || 200; // 如果无法获取，使用默认值200
      const currentBackWidth = timeBack.offsetWidth || timeWeatherSystem.offsetWidth;

      // 计算缩放比例
      const scale = currentBackWidth / originalBackWidth;

      // 原始偏移是2px，根据缩放比例调整
      const offsetX = 2 * scale;
      const offsetY = 2 * scale;

      // 应用偏移（向左和向下各偏移）
      timeImage.style.transform = `translate(calc(-50% - ${offsetX}px), calc(-50% + ${offsetY}px))`;
    }

    // 更新 LeftCover（体力系统）的位置
    // 左端与天气系统右端对齐，再往左偏移2%
    // 上下位置与天气系统中部对齐
    function updateLeftCoverPosition() {
      const leftCover = document.getElementById('left-cover');
      const staminaBarContainer = document.getElementById('stamina-bar-container');
      const timeWeatherSystem = document.getElementById('time-weather-system');

      if (!leftCover || !timeWeatherSystem) return;

      // 天气系统的位置和尺寸
      const weatherSystemLeft = 20; // 天气系统的 left 值
      const weatherSystemWidth = Math.max(window.innerWidth * 0.1, 60); // max(10vw, 60px)
      const weatherSystemRight = weatherSystemLeft + weatherSystemWidth; // 天气系统的右端位置

      // 获取天气系统的实际高度（用于计算中部位置）
      const weatherSystemHeight = timeWeatherSystem.offsetHeight || 0;
      const weatherSystemTop = 20; // 天气系统的 top 值
      const weatherSystemCenterY = weatherSystemTop + weatherSystemHeight / 2; // 天气系统的中部（垂直方向）

      // LeftCover 左端位置：天气系统右端 - 2% 视口宽度
      const leftOffset = window.innerWidth * 0.02; // 2% 视口宽度
      const leftCoverLeft = weatherSystemRight - leftOffset;

      // 获取 LeftCover 的实际尺寸
      const leftCoverWidth = leftCover.offsetWidth || Math.max(window.innerWidth * 0.2, 120);
      const leftCoverHeight = leftCover.offsetHeight || 0;

      // 设置 LeftCover 的位置
      leftCover.style.left = `${leftCoverLeft}px`;
      leftCover.style.top = `${weatherSystemCenterY}px`;
      leftCover.style.transform = 'translateY(-50%)'; // 垂直居中对齐

      // 设置体力进度条的位置和大小（体力系统的一部分）
      // 体力条的左右横轴与 leftcover 的横轴重叠
      // 体力条的左端点与天气系统右侧重叠
      // 体力条的右端为 leftcover 的右侧往左 5% leftcover 的宽度
      // 体力条的高度为 leftcover 的高度的 1/3
      const staminaBarHeight = leftCoverHeight / 3; // 高度为 leftcover 的 1/3
      if (staminaBarContainer) {
        const leftCoverRight = leftCoverLeft + leftCoverWidth; // LeftCover 的右端位置
        const leftOffset = leftCoverWidth * 0.05; // 5% leftcover 的宽度
        const staminaBarRight = leftCoverRight - leftOffset; // 体力条的右端位置
        const staminaBarWidth = staminaBarRight - weatherSystemRight; // 体力条宽度：从天气系统右侧到计算出的右端位置

        staminaBarContainer.style.left = `${weatherSystemRight}px`; // 左端点与天气系统右侧重叠
        staminaBarContainer.style.top = `${weatherSystemCenterY}px`; // 与 leftcover 横轴重叠
        staminaBarContainer.style.width = `${staminaBarWidth}px`; // 宽度：从天气系统右侧到 LeftCover 右端往左 5% 的位置
        staminaBarContainer.style.height = `${staminaBarHeight}px`; // 高度为 leftcover 的 1/3
        staminaBarContainer.style.transform = 'translateY(-50%)'; // 垂直居中对齐
      }

      // 设置体力数值显示的位置
      const staminaText = document.getElementById('stamina-text');
      if (staminaText) {
        // LeftCover的底部位置
        const leftCoverBottom = weatherSystemCenterY + leftCoverHeight / 2;

        // 左端与天气系统的右边齐平
        staminaText.style.left = `${weatherSystemRight}px`;
        // 高度是体力条的高度的两倍
        staminaText.style.height = `${staminaBarHeight * 2}px`;
        staminaText.style.lineHeight = `${staminaBarHeight * 2}px`; // 垂直居中文字
        // 顶部和leftcover的下端齐平
        staminaText.style.top = `${leftCoverBottom}px`;
      }

      // 设置时间信息显示的位置
      const staminaTimeText = document.getElementById('stamina-time-text');
      if (staminaTimeText) {
        const leftCoverTop = weatherSystemCenterY - leftCoverHeight / 2; // LeftCover的顶部位置
        const leftCoverRight = leftCoverLeft + leftCoverWidth; // LeftCover的右端位置
        const leftCoverCenterX = leftCoverLeft + leftCoverWidth / 2; // LeftCover的中轴位置

        // 下边和leftcover上边对齐
        // 字体大小14px，行高1.4，实际显示高度约20px
        const textHeight = 14 * 1.4; // 约20px
        staminaTimeText.style.top = `${leftCoverTop - textHeight}px`; // 下边和leftcover上边对齐
        staminaTimeText.style.left = `${weatherSystemRight}px`; // 第N天左侧与天气系统右侧对齐
        staminaTimeText.style.width = 'auto'; // 允许自动扩展
        staminaTimeText.style.minWidth = `${leftCoverRight - weatherSystemRight}px`; // 最小宽度从天气系统右侧到leftcover右侧
        staminaTimeText.style.maxWidth = `${window.innerWidth - weatherSystemRight - 20}px`; // 最大宽度不超过屏幕（留20px边距）
        staminaTimeText.style.height = `${textHeight}px`; // 设置高度
        staminaTimeText.style.lineHeight = `${textHeight}px`; // 行高等于高度，文字垂直居中

        // 设置各个span的位置（使用flex布局）
        const timeDay = document.getElementById('stamina-time-day');
        const timePeriod = document.getElementById('stamina-time-period');
        const timeWeekday = document.getElementById('stamina-time-weekday');

        if (timeDay) {
          // 第N天左侧与天气系统右侧对齐（已经在容器left中设置）
          timeDay.style.marginLeft = '0';
          timeDay.style.marginRight = '0';
        }
        if (timePeriod) {
          // 早与leftcover中轴对齐
          // 计算"早"应该的位置：leftCoverCenterX - weatherSystemRight - timeDay的宽度
          // 但由于timeDay的宽度是动态的，我们需要先测量
          const tempDiv = document.createElement('div');
          tempDiv.style.cssText = `
            position: absolute;
            visibility: hidden;
            font: 700 14px/1.4 "STKaiti", "KaiTi", "Kaiti SC", "Songti SC", "Noto Serif SC", "Source Han Serif SC", "SimSun", Georgia, serif;
            white-space: nowrap;
          `;
          if (timeDay) {
            tempDiv.textContent = timeDay.textContent || '第1天';
          }
          document.body.appendChild(tempDiv);
          const timeDayWidth = tempDiv.offsetWidth;
          document.body.removeChild(tempDiv);

          // 计算"早"应该的margin-left：使其中心与leftCoverCenterX对齐
          const targetCenterX = leftCoverCenterX - weatherSystemRight; // 相对于容器的位置
          const periodMarginLeft = targetCenterX - timeDayWidth - 8; // 减去gap的一半
          timePeriod.style.marginLeft = `${Math.max(8, periodMarginLeft)}px`; // 至少保持gap间距
          timePeriod.style.marginRight = '0';
        }
        if (timeWeekday) {
          // 星期几右侧和leftcover右侧对齐，使用margin-left: auto
          timeWeekday.style.marginLeft = 'auto';
          timeWeekday.style.marginRight = '0';
        }
      }
    }

    // 更新体力进度条
    async function updateStaminaBar() {
      const staminaBar = document.getElementById('stamina-bar');
      const staminaText = document.getElementById('stamina-text');
      if (!staminaBar) {
        errorWithTag('STAMINA', '体力条元素不存在');
        return;
      }

      // 读取体力值（使用getvar函数以支持各种数据类型）
      const currentStamina = await getvar('stat_data.系统.体力.当前体力值');
      const maxStamina = await getvar('stat_data.系统.体力.当前体力值上限');

      // 处理undefined值
      if (currentStamina === undefined || maxStamina === undefined) {
        errorWithTag('STAMINA', '体力值未定义，无法更新体力条');
        return;
      }

      // 转换为数字
      const current = parseFloat(currentStamina);
      const max = parseFloat(maxStamina);

      // 验证数值有效性
      if (isNaN(current) || isNaN(max)) {
        errorWithTag('STAMINA', '体力值不是有效数字', null, { current, max });
        return;
      }

      if (max <= 0) {
        errorWithTag('STAMINA', '体力上限无效', null, max);
        return;
      }

      // 计算百分比
      const percentage = Math.min(100, Math.max(0, (current / max) * 100));

      // 更新进度条宽度
      staminaBar.style.width = `${percentage}%`;

      // 更新体力数值显示
      if (staminaText) {
        staminaText.textContent = `${Math.round(current)}/${Math.round(max)}`;
      }
    }

    // 解析托莉娜对话标签
    // 格式：<托莉娜|底图|表情|杂项|阴影标志|对话内容>
    function parseTolinaDialogueTag(tagText) {
      const match = tagText.match(/<([^|]+)\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|([^>]*)>/);
      if (!match) return null;

      return {
        character: match[1].trim(),
        baseKey: match[2].trim(),      // 底图，如 SockW-Nude
        expression: match[3].trim(),    // 表情，如 Angry1
        special: match[4].trim(),      // 杂项，如 MouthHair
        shadowFlag: match[5].trim(),    // 阴影标志，如 "阴影" 或空
        dialogue: match[6].trim()       // 对话内容
      };
    }

    // 解析其他人对话标签（人名显示在名字位，已知间男显示左侧立绘）
    // 格式：<人名|对话内容> 仅本体；<人名-阴影|对话内容> 本体+阴影叠加
    function parseOtherPersonTag(tagText) {
      const m = tagText.match(/^<([^|]+)\|([\s\S]*)>$/);
      if (!m) return null;
      const rawName = m[1].trim();
      const content = (m[2] || '').trim();
      if (rawName === '背景' || rawName === 'CG' || rawName === '托莉娜') return null; // 交给原有解析
      const withShadow = /-阴影$/.test(rawName);
      const character = withShadow ? rawName.replace(/-阴影$/, '') : rawName;
      return { character, dialogue: content, isOtherSpeaker: true, withShadow };
    }

    // 根据状态组装立绘层
    // 辅助函数：获取对象的第一张图片（按key排序）
    function getFirstImageFromObject(obj) {
      if (!obj || typeof obj !== 'object') return null;
      const keys = Object.keys(obj).sort();
      return keys.length > 0 ? obj[keys[0]] : null;
    }

    function assembleTolinaSpriteLayers(parsedTag, statusNum, outfitValue) {
      if (!parsedTag || parsedTag.character !== '托莉娜') {
        return null;
      }

      statusNum = parseInt(statusNum, 10) || 1;
      outfitValue = outfitValue || '常服';

      const layers = {
        L1: null,  // 底图
        L2: null,  // 发色
        L3: null,  // 表情
        L4: null,  // 衣服
        L5: null,  // 杂项
        L6: null   // 阴影
      };

      // 判断阶段
      const isStage12 = (statusNum === 1 || statusNum === 2);
      const isStage34 = (statusNum === 3 || statusNum === 4);

      if (parsedTag.baseKey) {
        // 如果服装是女仆装，且底图不是女仆装相关的，需要特殊处理
        if (outfitValue === '女仆装') {
          // 女仆装：根据阶段选择对应的底图
          // 阶段1-2使用SockW-Maid或SockB-Maid，阶段3-4使用NudeLeg-Maid
          const isStage12 = (statusNum === 1 || statusNum === 2);
          if (isStage12) {
            // 优先使用传入的底图，如果没有或不是女仆装底图，使用默认女仆装底图
            if (parsedTag.baseKey.includes('Maid') && tolinaSprites.L1_base[parsedTag.baseKey]) {
              layers.L1 = tolinaSprites.L1_base[parsedTag.baseKey];
            } else {
              // 使用默认女仆装底图，如果不存在则使用第一张
              layers.L1 = tolinaSprites.L1_base['SockW-Maid'] ||
                         tolinaSprites.L1_base['SockB-Maid'] ||
                         getFirstImageFromObject(tolinaSprites.L1_base);
              if (layers.L1 && !tolinaSprites.L1_base[parsedTag.baseKey]) {
                warnWithTag('立绘', `未找到L1底图: ${parsedTag.baseKey}，使用回退图片`);
              }
            }
          } else {
            layers.L1 = tolinaSprites.L1_base['NudeLeg-Maid'] ||
                       (tolinaSprites.L1_base[parsedTag.baseKey] ? tolinaSprites.L1_base[parsedTag.baseKey] : getFirstImageFromObject(tolinaSprites.L1_base));
            if (layers.L1 && !tolinaSprites.L1_base[parsedTag.baseKey] && parsedTag.baseKey !== 'NudeLeg-Maid') {
              warnWithTag('立绘', `未找到L1底图: ${parsedTag.baseKey}，使用回退图片`);
            }
          }
        } else if (tolinaSprites.L1_base[parsedTag.baseKey]) {
          // 非女仆装：直接使用传入的底图
          layers.L1 = tolinaSprites.L1_base[parsedTag.baseKey];
        } else {
          layers.L1 = getFirstImageFromObject(tolinaSprites.L1_base);
          if (layers.L1) {
            warnWithTag('立绘', `未找到L1底图: ${parsedTag.baseKey}，使用回退图片`);
          }
        }
      }

      // L2: 发色
      if (isStage12) {
        layers.L2 = tolinaSprites.L2_hair.HairB; // 黄色
      } else if (isStage34) {
        layers.L2 = tolinaSprites.L2_hair.HairW; // 白色
      }

      // L3: 表情
      if (parsedTag.expression) {
        if (isStage12) {
          // P1系列
          if (tolinaSprites.L3_expression.P1[parsedTag.expression]) {
            layers.L3 = tolinaSprites.L3_expression.P1[parsedTag.expression];
          } else {
            // 如果找不到指定表情，使用P1系列的第一张
            layers.L3 = getFirstImageFromObject(tolinaSprites.L3_expression.P1);
            if (layers.L3) {
              warnWithTag('立绘', `未找到L3表情(P1): ${parsedTag.expression}，使用回退图片`);
            }
          }
        } else if (isStage34) {
          // P3系列
          if (tolinaSprites.L3_expression.P3[parsedTag.expression]) {
            layers.L3 = tolinaSprites.L3_expression.P3[parsedTag.expression];
          } else {
            // 如果找不到指定表情，使用P3系列的第一张
            layers.L3 = getFirstImageFromObject(tolinaSprites.L3_expression.P3);
            if (layers.L3) {
              warnWithTag('立绘', `未找到L3表情(P3): ${parsedTag.expression}，使用回退图片`);
            }
          }
        }
      }

      // L4: 衣服（根据服装变量，与堕落阶段分离）
      // outfitValue 已在L1部分定义

      // 服装映射：常服->P1, 暴露常服->P2, 魅魔常服->P3, 魔王服->P4, 女仆装->特殊处理, 浴巾->Bath
      if (outfitValue === '女仆装') {
        // 女仆装：根据阶段选择对应的底图，但L4层不显示（女仆装是特殊底图）
        // 这里不设置L4，让女仆装通过底图显示
        // L7: 女仆装特殊图层（L7Maid）
        if (tolinaSprites.L7_maid && tolinaSprites.L7_maid['L7Maid']) {
          layers.L7 = tolinaSprites.L7_maid['L7Maid'];
        }
      } else if (outfitValue === '浴巾') {
        // 浴巾：使用Bath资源
        if (tolinaSprites.L4_cloth['Bath']) {
          layers.L4 = tolinaSprites.L4_cloth['Bath'];
        } else {
          // 如果找不到Bath，使用第一张
          layers.L4 = getFirstImageFromObject(tolinaSprites.L4_cloth);
          if (layers.L4) {
            warnWithTag('立绘', `未找到L4衣服: Bath，使用回退图片`);
          }
        }
      } else {
        // 根据服装值选择对应的L4层
        let clothKey = null;
        if (outfitValue === '常服') {
          clothKey = 'P1';
        } else if (outfitValue === '暴露常服') {
          clothKey = 'P2';
        } else if (outfitValue === '魅魔常服') {
          clothKey = 'P3';
        } else if (outfitValue === '魔王服') {
          clothKey = 'P4';
        } else {
          // 默认使用常服
          clothKey = 'P1';
        }

        if (clothKey && tolinaSprites.L4_cloth[clothKey]) {
          layers.L4 = tolinaSprites.L4_cloth[clothKey];
        } else {
          // 如果找不到指定衣服，使用第一张
          layers.L4 = getFirstImageFromObject(tolinaSprites.L4_cloth);
          if (layers.L4) {
            warnWithTag('立绘', `未找到L4衣服: ${clothKey}，使用回退图片`);
          }
        }
      }

      // L5: 杂项
      if (parsedTag.special && parsedTag.special.trim()) {
        // 杂项直接使用传入的值（如MouthHair）
        if (tolinaSprites.L5_special[parsedTag.special]) {
          layers.L5 = tolinaSprites.L5_special[parsedTag.special];
        } else {
          // 如果找不到指定杂项，使用第一张
          layers.L5 = getFirstImageFromObject(tolinaSprites.L5_special);
          if (layers.L5) {
            warnWithTag('立绘', `未找到L5杂项: ${parsedTag.special}，使用回退图片`);
          }
        }
      }

      // L6: 阴影（判断MouthHair后面是否有"阴影"，根据服装变量选择）
      if (parsedTag.shadowFlag === '阴影') {
        // 根据服装值选择对应的阴影
        let shadowKey = null;
        if (outfitValue === '常服') {
          shadowKey = 'P1';
        } else if (outfitValue === '暴露常服') {
          shadowKey = 'P2';
        } else if (outfitValue === '魅魔常服') {
          shadowKey = 'P3';
        } else if (outfitValue === '魔王服') {
          shadowKey = 'P4';
        } else if (outfitValue === '浴巾') {
          // 浴巾：根据阶段选择阴影（与常服类似）
          if (isStage12) {
            shadowKey = 'P1';
          } else if (isStage34) {
            shadowKey = 'P3';
          }
        } else if (isStage12) {
          // 女仆装或其他：根据阶段选择
          shadowKey = 'P1';
        } else if (isStage34) {
          shadowKey = 'P3';
        }

        if (shadowKey && tolinaSprites.L6_shadow[shadowKey]) {
          layers.L6 = tolinaSprites.L6_shadow[shadowKey];
        } else {
          // 如果找不到指定阴影，使用第一张
          layers.L6 = getFirstImageFromObject(tolinaSprites.L6_shadow);
          if (layers.L6) {
            warnWithTag('立绘', `未找到L6阴影: ${shadowKey}，使用回退图片`);
          }
        }
      }

      return layers;
    }

    async function buildTolinaSpriteLayers(parsedTag) {
      if (!parsedTag || parsedTag.character !== '托莉娜') {
        return null;
      }
      const status = await getvar('stat_data.托莉娜.基础.堕落阶段');
      const outfit = await getvar('stat_data.托莉娜.基础.服装');
      return assembleTolinaSpriteLayers(parsedTag, parseInt(status, 10) || 1, outfit || '常服');
    }

    function getRivalMaleSpriteLayers(characterName, withShadow = false) {
      const def = rivalMaleSprites[characterName];
      if (!def) return null;
      return { base: def.base, shade: withShadow ? def.shade : null };
    }

    function clearGalSprite() {
      const sprite = document.querySelector('.sprite');
      if (!sprite) return;
      sprite.style.backgroundImage = '';
      sprite.style.backgroundSize = '';
      sprite.style.backgroundPosition = '';
      sprite.style.backgroundRepeat = '';
    }

    function renderNpcMaleSprite(layers) {
      const sprite = document.querySelector('.sprite');
      if (!sprite) return;

      sprite.style.backgroundImage = '';
      sprite.style.backgroundSize = '';
      sprite.style.backgroundPosition = '';

      const backgroundImages = [];
      const backgroundSizes = [];
      const backgroundPositions = [];
      const position = 'left bottom';

      if (layers.base) {
        backgroundImages.push(cssUrl(layers.base));
        backgroundSizes.push('auto 100%');
        backgroundPositions.push(position);
      }
      if (layers.shade) {
        backgroundImages.push(cssUrl(layers.shade));
        backgroundSizes.push('auto 100%');
        backgroundPositions.push(position);
      }

      if (backgroundImages.length === 0) {
        clearGalSprite();
        return;
      }

      backgroundImages.reverse();
      backgroundSizes.reverse();
      backgroundPositions.reverse();

      sprite.style.backgroundImage = backgroundImages.join(', ');
      sprite.style.backgroundSize = backgroundSizes.join(', ');
      sprite.style.backgroundPosition = backgroundPositions.join(', ');
      sprite.style.backgroundRepeat = 'no-repeat, '.repeat(backgroundImages.length - 1) + 'no-repeat';
    }

    async function renderDialogueSprite(dialogue) {
      if (!dialogue) {
        clearGalSprite();
        return;
      }

      if (dialogue.isOtherSpeaker) {
        const npcLayers = getRivalMaleSpriteLayers(dialogue.character, !!dialogue.withShadow);
        if (npcLayers) {
          renderNpcMaleSprite(npcLayers);
        } else {
          clearGalSprite();
        }
        return;
      }

      const layers = await buildTolinaSpriteLayers(dialogue);
      if (layers) {
        renderTolinaSprite(layers);
      } else {
        clearGalSprite();
      }
    }

    // 渲染托莉娜立绘
    function renderTolinaSprite(layers) {
      const sprite = document.querySelector('.sprite');
      if (!sprite) return;

      // 清空现有内容
      sprite.style.backgroundImage = '';
      sprite.style.backgroundSize = '';
      sprite.style.backgroundPosition = '';

      // 构建背景图片堆叠（从底层到顶层）
      // 注意：CSS background-image中，第一个图片显示在最上层，最后一个在最下层
      // 所以要按照L7, L6, L5, L4, L3, L2, L1的顺序添加，这样L1在最下面，L7在最上面
      const backgroundImages = [];
      const backgroundSizes = [];
      const backgroundPositions = [];

      // L1: 底图（最底层）
      if (layers.L1) {
        backgroundImages.push(cssUrl(layers.L1));
        backgroundSizes.push('auto 100%');
        backgroundPositions.push('right bottom');
      }
      // L2: 发色
      if (layers.L2) {
        backgroundImages.push(cssUrl(layers.L2));
        backgroundSizes.push('auto 100%');
        backgroundPositions.push('right bottom');
      }
      // L3: 表情
      if (layers.L3) {
        backgroundImages.push(cssUrl(layers.L3));
        backgroundSizes.push('auto 100%');
        backgroundPositions.push('right bottom');
      }
      // L4: 衣服
      if (layers.L4) {
        backgroundImages.push(cssUrl(layers.L4));
        backgroundSizes.push('auto 100%');
        backgroundPositions.push('right bottom');
      }
      // L5: 杂项
      if (layers.L5) {
        backgroundImages.push(cssUrl(layers.L5));
        backgroundSizes.push('auto 100%');
        backgroundPositions.push('right bottom');
      }
      // L6: 阴影
      if (layers.L6) {
        backgroundImages.push(cssUrl(layers.L6));
        backgroundSizes.push('auto 100%');
        backgroundPositions.push('right bottom');
      }
      // L7: 女仆装特殊图层（最顶层）
      if (layers.L7) {
        backgroundImages.push(cssUrl(layers.L7));
        backgroundSizes.push('auto 100%');
        backgroundPositions.push('right bottom');
      }

      if (backgroundImages.length > 0) {
        // 反转数组，使L1在最下层，L6在最上层
        // CSS background-image中，第一个图片在最上层，所以需要反转
        backgroundImages.reverse();
        backgroundSizes.reverse();
        backgroundPositions.reverse();

        sprite.style.backgroundImage = backgroundImages.join(', ');
        sprite.style.backgroundSize = backgroundSizes.join(', ');
        sprite.style.backgroundPosition = backgroundPositions.join(', ');
        sprite.style.backgroundRepeat = 'no-repeat, '.repeat(backgroundImages.length - 1) + 'no-repeat';
      }
    }

    // 存储对话列表和当前索引
    let currentDialogues = [];
    let currentDialogueIndex = 0;
    // 当前层若有其他视角：{ maintext, otherpov }，用于左侧切换键；无则为 null
    let currentLayerOtherPov = null;
    let showingOtherPov = false;
    // 切换视角时保留的句子索引：正文当前句、其他视角当前句
    let savedMainDialogueIndex = 0;
    let savedOtherPovDialogueIndex = 0;
    // 存储待显示的分支文本（在点击完最后一句对话后才显示）
    let pendingBranchesText = null;

    // 获取背景URL（根据背景名称，走统一资源 API）
    function getBackgroundUrl(backgroundName) {
      const ga = window.妹神官_gameAssets;
      if (ga && typeof ga.getBackground === 'function') return ga.getBackground(backgroundName);
      const bg = allResources.find(r => r.category === '背景' && r.name === backgroundName);
      return bg ? bg.url : null;
    }

    // 解析背景标签
    function parseBackgroundTag(tagText) {
      const match = tagText.match(/<背景\|([^>]+)>/);
      if (match) {
        return match[1].trim();
      }
      return null;
    }

    // 切换背景图片
    function changeBackground(backgroundName) {
      const stage = document.querySelector('.stage');
      if (!stage) return;

      const backgroundUrl = getBackgroundUrl(backgroundName);
      if (backgroundUrl) {
        stage.style.backgroundImage = typeof cssUrl === 'function' ? cssUrl(backgroundUrl) : `url('${backgroundUrl}')`;
        stage.style.backgroundSize = 'cover';
        stage.style.backgroundPosition = 'center center';
        stage.style.backgroundRepeat = 'no-repeat';
      } else {
        warnWithTag('WARN', `未找到背景: ${backgroundName}`);
      }
    }

    // ==================== CG系统 ====================
    // CG状态管理：记录每个CG组当前显示的CG
    const cgState = {};

    // 获取CG资源URL（根据CG组名和CG名称，走统一资源 API，含组内回退）
    function getCGUrl(groupName, cgName) {
      const ga = window.妹神官_gameAssets;
      if (ga && typeof ga.getCG === 'function') {
        const url = ga.getCG(groupName, cgName);
        if (!url) warnWithTag('CG', `未找到CG: ${groupName}-${cgName}`);
        return url;
      }
      const fullName = `${groupName}-${cgName}`;
      const cgResource = allResources.find(r => r.category === 'CG' && r.name === fullName);
      if (cgResource) return cgResource.url;
      const groupResources = allResources.filter(r => r.category === 'CG' && r.name.startsWith(`${groupName}-`));
      if (groupResources.length > 0) {
        groupResources.sort((a, b) => a.name.localeCompare(b.name));
        warnWithTag('CG', `未找到CG: ${groupName}-${cgName}，使用该组第一张图片: ${groupResources[0].name}`);
        return groupResources[0].url;
      }
      return null;
    }

    // 解析CG标签
    // 支持格式：
    // - <CG|组名|CG名称> - 显示指定CG组的CG
    // - <CG|组名|stop> - 停止显示指定CG组的CG
    function parseCGTag(tagText) {
      const match = tagText.match(/<CG\|([^>|]+)\|([^>]+)>/);
      if (match) {
        const groupName = match[1].trim();
        const cgName = match[2].trim();
        return {
          groupName: groupName,
          cgName: cgName,
          isStop: cgName.toLowerCase() === 'stop'
        };
      }
      return null;
    }

    // 清空当前所有CG显示（CG仅随对话切换，同一时间只显示一个；无CG的对话需清空）
    function clearAllCG() {
      const cgLayer = document.getElementById('cg-layer');
      const cgImage = document.getElementById('cg-image');
      if (!cgLayer || !cgImage) return;
      const hadHideSprite = ['乳交', 'Kiss全裸', 'Kiss着衣', '床上后背位', '地板后背位', '正常位'].some(g => cgState[g]);
      Object.keys(cgState).forEach(key => delete cgState[key]);
      cgLayer.classList.remove('show');
      cgImage.src = '';
      refreshCgToolbarClass();
      if (hadHideSprite) {
        const sprite = document.querySelector('.sprite');
        if (sprite) sprite.style.display = 'block';
      }
    }

    // 显示CG（指定CG组和CG名称）。CG不作为单独项解析，仅随对话显示；同一时间只占一个位置，新CG会替换旧CG
    function showCG(groupName, cgName) {
      const cgLayer = document.getElementById('cg-layer');
      const cgImage = document.getElementById('cg-image');

      if (!cgLayer || !cgImage) {
        warnWithTag('CG', 'CG层元素不存在');
        return;
      }

      const cgUrl = getCGUrl(groupName, cgName);
      if (!cgUrl) {
        warnWithTag('CG', `CG组 "${groupName}" 不存在任何CG资源`);
        return;
      }

      // 同一时间只显示一个CG：先清空再显示，避免不同CG组互相占据
      clearAllCG();

      cgState[groupName] = cgName;
      cgImage.src = cgUrl;
      setTimeout(() => {
        cgLayer.classList.add('show');
        refreshCgToolbarClass();
      }, 10);

      const hideSpriteGroups = ['乳交', 'Kiss全裸', 'Kiss着衣', '床上后背位', '地板后背位', '正常位'];
      if (hideSpriteGroups.includes(groupName)) {
        const sprite = document.querySelector('.sprite');
        if (sprite) {
          sprite.style.display = 'none';
          logWithTag('CG', `隐藏立绘（因为显示${groupName} CG）`);
        }
      }

      logWithTag('CG', `显示CG组 "${groupName}" 的CG: ${cgName}`);
    }

    // 隐藏指定CG组的CG
    function hideCG(groupName) {
      const cgLayer = document.getElementById('cg-layer');

      if (!cgLayer) {
        return;
      }

      // 检查是否有其他CG组正在显示
      let hasOtherCG = false;
      for (const [group, cgName] of Object.entries(cgState)) {
        if (group !== groupName && cgName) {
          hasOtherCG = true;
          break;
        }
      }

      // 如果这是最后一个CG组，隐藏CG层
      if (!hasOtherCG) {
        // 移除show类（触发淡出动画）
        cgLayer.classList.remove('show');
        refreshCgToolbarClass();

        // 等待动画完成后清空图片
        setTimeout(() => {
          const cgImage = document.getElementById('cg-image');
          if (cgImage) {
            cgImage.src = '';
          }
        }, 800); // 与CSS transition时间一致
      }

      // 清除该CG组的状态
      delete cgState[groupName];

      // 检查是否需要恢复立绘
      // 如果隐藏的是需要隐藏立绘的CG组，检查是否还有其他需要隐藏立绘的CG
      const hideSpriteGroups = ['乳交', 'Kiss全裸', 'Kiss着衣', '床上后背位', '地板后背位', '正常位'];
      if (hideSpriteGroups.includes(groupName)) {
        // 检查是否还有其他需要隐藏立绘的CG组正在显示
        let hasOtherHideSpriteCG = false;
        for (const [group, cgName] of Object.entries(cgState)) {
          if (hideSpriteGroups.includes(group) && cgName) {
            hasOtherHideSpriteCG = true;
            break;
          }
        }

        // 如果没有其他需要隐藏立绘的CG，恢复立绘显示
        if (!hasOtherHideSpriteCG) {
          const sprite = document.querySelector('.sprite');
          if (sprite) {
            sprite.style.display = 'block';
            logWithTag('CG', `恢复立绘显示（因为隐藏${groupName} CG且没有其他需要隐藏立绘的CG）`);
          }
        }
      }

      logWithTag('CG', `隐藏CG组 "${groupName}" 的CG`);
    }

    // 应用当前所有CG组的状态（用于恢复CG显示，例如读档后）
    function applyCGState() {
      const cgLayer = document.getElementById('cg-layer');
      const cgImage = document.getElementById('cg-image');

      if (!cgLayer || !cgImage) {
        return;
      }

      // 找到第一个有效的CG组
      let firstCGGroup = null;
      let firstCGName = null;
      for (const [groupName, cgName] of Object.entries(cgState)) {
        if (cgName) {
          firstCGGroup = groupName;
          firstCGName = cgName;
          break;
        }
      }

      if (firstCGName) {
        const cgUrl = getCGUrl(firstCGGroup, firstCGName);
        if (cgUrl) {
          cgImage.src = cgUrl;
          setTimeout(() => {
            cgLayer.classList.add('show');
          }, 10);

          // 如果恢复的是需要隐藏立绘的CG组，隐藏立绘
          const hideSpriteGroups = ['乳交', 'Kiss全裸', 'Kiss着衣', '床上后背位', '地板后背位', '正常位'];
          if (hideSpriteGroups.includes(firstCGGroup)) {
            const sprite = document.querySelector('.sprite');
            if (sprite) {
              sprite.style.display = 'none';
              logWithTag('CG', `恢复CG时隐藏立绘（因为${firstCGGroup} CG）`);
            }
          }

          logWithTag('CG', `恢复CG显示: ${firstCGGroup} - ${firstCGName}`);
        }
      } else {
        // 没有CG需要显示，确保隐藏
        cgLayer.classList.remove('show');
        cgImage.src = '';

        // 确保立绘显示（如果没有需要隐藏立绘的CG）
        const sprite = document.querySelector('.sprite');
        if (sprite) {
          sprite.style.display = 'block';
        }
      }
    }

    // 解析正文中的所有托莉娜对话标签、背景标签、CG标签、其他人对话标签
    function parseTolinaDialogues(text) {
      text = stripAiHtmlComments(text);
      const dialogues = [];
      let currentBackground = null;
      let currentCG = null; // 存储当前CG信息 { groupName, cgName, isStop }
      // 匹配：背景/CG/托莉娜 标签，或 其他人标签 <人名|对话内容>（人名不为 背景/CG/托莉娜）
      const allTagsRegex = /<(?:背景|CG|托莉娜)\|[^>]+>|<(?!(?:背景|CG|托莉娜)\|)([^|]+)\|([^>]*)>/g;
      let match;

      while ((match = allTagsRegex.exec(text)) !== null) {
        const tagText = match[0];
        const isOtherPerson = match[1] !== undefined; // 第二组有捕获则为其他人标签

        if (isOtherPerson) {
          const parsed = parseOtherPersonTag(tagText);
          if (parsed) {
            parsed.background = currentBackground;
            parsed.cg = currentCG;
            dialogues.push(parsed);
          }
          continue;
        }

        // 检查是否是背景标签
        const backgroundName = parseBackgroundTag(tagText);
        if (backgroundName) {
          currentBackground = backgroundName;
          continue;
        }

        const cgInfo = parseCGTag(tagText);
        if (cgInfo) {
          currentCG = cgInfo;
          continue;
        }

        const parsedTag = parseTolinaDialogueTag(tagText);
        if (parsedTag) {
          parsedTag.background = currentBackground;
          parsedTag.cg = currentCG;
          dialogues.push(parsedTag);
        }
      }

      return dialogues;
    }

    // 显示指定索引的对话
    async function showDialogue(index) {
      if (index < 0 || index >= currentDialogues.length) return;

      const dialogue = currentDialogues[index];
      const dialogueText = document.querySelector('.dialogue-text');
      if (!dialogueText) return;

      // 如果有背景切换，立即切换背景（不需要停顿）
      if (dialogue.background) {
        changeBackground(dialogue.background);
      }

      // CG 随对话显示：有 cg 则显示该 CG（会替换当前 CG）；无 cg 则清空，避免被上一段对话的 CG 占据
      if (dialogue.cg) {
        if (dialogue.cg.isStop) {
          hideCG(dialogue.cg.groupName);
        } else {
          showCG(dialogue.cg.groupName, dialogue.cg.cgName);
        }
      } else {
        clearAllCG();
      }

      // 组装并渲染立绘
      await renderDialogueSprite(dialogue);

      // 更新名牌（在名字区中）
      const dialogueNameArea = document.querySelector('.dialogue-name-area');
      if (dialogueNameArea) {
        const nameplate = dialogueNameArea.querySelector('.nameplate');
        if (nameplate) {
          const nameplateTop = nameplate.querySelector('.np-top');
          const nameplateBottom = nameplate.querySelector('.np-bottom');
          if (nameplateTop) nameplateTop.textContent = '';
          if (nameplateBottom) nameplateBottom.textContent = dialogue.character || '托莉娜';
        }
      }

      // 显示对话内容（应用打印机效果）
      await applyTypewriterToDialogue(dialogue.dialogue, dialogueText);

      // 更新当前索引
      currentDialogueIndex = index;
    }

    // 下一句对话
    async function nextDialogue() {
      if (currentDialogueIndex < currentDialogues.length - 1) {
        await showDialogue(currentDialogueIndex + 1);
      } else {
        // 已到达最后一段对话，打开quest界面并默认显示选项
        showCurrentDialogueLayer('branches');
      }
    }

    // 上一句对话
    async function prevDialogue() {
      if (currentDialogueIndex > 0) {
        await showDialogue(currentDialogueIndex - 1);
      }
    }

    let galAutoOn = false;
    let galAutoTimer = null;

    function galToast(msg) {
      if (typeof showArchiveNotification === 'function') {
        showArchiveNotification(msg, 'info');
        return;
      }
      console.info('[GAL]', msg);
    }

    function setGalBusy(on, label) {
      isStreamingActive = !!on;
      if (window.妹神官_toolbar && window.妹神官_toolbar.setGenerating) {
        window.妹神官_toolbar.setGenerating(!!on, label || '正在生成正文');
      }
    }

    function stopGalAuto() {
      galAutoOn = false;
      if (galAutoTimer) {
        clearTimeout(galAutoTimer);
        galAutoTimer = null;
      }
      if (window.妹神官_toolbar && window.妹神官_toolbar.refresh) {
        window.妹神官_toolbar.refresh();
      }
    }

    async function runGalAutoTick() {
      if (!galAutoOn) return;
      if (isStreamingActive) {
        galAutoTimer = setTimeout(runGalAutoTick, 400);
        return;
      }
      if (currentDialogueIndex < currentDialogues.length - 1) {
        await nextDialogue();
        if (!galAutoOn) return;
        galAutoTimer = setTimeout(runGalAutoTick, 900);
        return;
      }
      stopGalAuto();
      showCurrentDialogueLayer('branches');
    }

    function toggleGalAuto() {
      if (galAutoOn) {
        stopGalAuto();
        return;
      }
      galAutoOn = true;
      if (window.妹神官_toolbar && window.妹神官_toolbar.refresh) {
        window.妹神官_toolbar.refresh();
      }
      runGalAutoTick();
    }

    async function rewindThisRound() {
      stopGalAuto();
      if (currentDialogues.length) await showDialogue(0);
    }

    async function skipToChoices() {
      stopGalAuto();
      if (currentDialogues.length) {
        await showDialogue(currentDialogues.length - 1);
      }
      showCurrentDialogueLayer('branches');
    }

    async function rewindPrevRound() {
      stopGalAuto();
      if (isStreamingActive) {
        galToast('正在生成中…');
        return;
      }
      const layers = dialogueLayers
        .filter(l => l && l.type !== 'player' && l.layer % 2 === 1)
        .sort((a, b) => a.layer - b.layer);
      if (layers.length < 2) {
        galToast('已经是最早一轮');
        return;
      }
      await jumpToDialogueLayer(layers[layers.length - 2]);
      galToast('已回到上一轮开头');
    }

    async function regenerateCurrentRound() {
      stopGalAuto();
      if (isStreamingActive) {
        galToast('正在生成中…');
        return;
      }
      const lastAi = getLastDialogueLayer();
      const players = dialogueLayers.filter(l => l && l.type === 'player' && l.playerInput);
      const lastPlayer = players.length ? players[players.length - 1] : null;
      if (!lastAi || !lastPlayer || lastPlayer.layer < lastAi.layer - 1) {
        galToast('开局剧情无法重新生成');
        return;
      }
      dialogueLayers = dialogueLayers.filter(l => l.layer <= lastPlayer.layer);
      currentDialogueLayer = Math.max(0, lastPlayer.layer - 1);
      await sendBranchChoiceAndGenerate(lastPlayer.playerInput);
    }

    function openGalSave() {
      const saveOverlay = document.getElementById('save-overlay');
      if (!saveOverlay) {
        galToast('存档界面未就绪');
        return;
      }
      saveOverlay.classList.remove('hidden');
      if (typeof renderSaveArchiveList === 'function') renderSaveArchiveList();
    }

    function openGalSettings() {
      openSettingsPanel();
    }

    window.妹神官_gal = {
      toast: galToast,
      prev: function () { return prevDialogue(); },
      next: function () { return nextDialogue(); },
      rewind: rewindThisRound,
      skipToChoices: skipToChoices,
      rewindPrevRound: rewindPrevRound,
      regenerateCurrentRound: regenerateCurrentRound,
      openLog: function () { showCurrentDialogueLayer('dialogue'); },
      openBranches: function () { showCurrentDialogueLayer('branches'); },
      openHstatus: function () { openHstatusTable(); },
      openSave: openGalSave,
      openSettings: openGalSettings,
      setDefaultVars: function (next) {
        if (!next || typeof next !== 'object') return;
        ERA.defaultVars = JSON.parse(JSON.stringify(next));
      },
      toggleAuto: toggleGalAuto,
      stopAuto: stopGalAuto,
      isAuto: function () { return galAutoOn; },
      getToolbarLocked: function () { return textFormatSettings.toolbarLocked !== false; },
      setToolbarLocked: function (v) {
        textFormatSettings.toolbarLocked = !!v;
        saveTextFormatSettings();
        const box = document.getElementById('toolbar-locked-checkbox');
        if (box) box.checked = !!v;
      },
    };

    async function sendBranchChoiceAndGenerate(choiceText, closeOverlay) {
      try {
        recordPlayerInput(choiceText);
        closeOverlay?.();
        await updateMainText(choiceText);
        const dialogueNameArea = document.querySelector('.dialogue-name-area');
        if (dialogueNameArea) {
          const nameplate = dialogueNameArea.querySelector('.nameplate');
          if (nameplate) {
            const nameplateTop = nameplate.querySelector('.np-top');
            const nameplateBottom = nameplate.querySelector('.np-bottom');
            if (nameplateTop) nameplateTop.textContent = '';
            if (nameplateBottom) nameplateBottom.textContent = '{{user}}';
          }
        }
        const content = await generateStoryRound(choiceText);
        currentStreamingContent = '';
        if (content) {
          await processMessage(content);
        }
        logWithTag('BRANCH', '✅ 分支选择已发送给AI');
      } catch (error) {
        setGalBusy(false);
        errorWithTag('BRANCH', '发送分支选择时出错', error);
        await updateMainText(`发送失败：${error.message}\n请重试或检查接口设置。`);
      }
    }

    function showBranchesFromText(branchesText) {
      document.getElementById('branches-overlay')?.remove();

      const overlay = document.createElement('div');
      overlay.id = 'branches-overlay';
      overlay.className = 'branches-overlay';

      const panelWrap = document.createElement('div');
      panelWrap.className = 'branch-action-overlay-wrap';

      const titleRow = document.createElement('div');
      titleRow.className = 'branch-action-overlay-title';
      titleRow.textContent = '此刻可以做的事';

      const body = document.createElement('div');
      body.className = 'branch-action-overlay-body';

      const closeOverlay = () => overlay.remove();
      mountBranchActionUI(body, branchesText || '', choiceText => sendBranchChoiceAndGenerate(choiceText, closeOverlay));

      panelWrap.append(titleRow, body);
      overlay.appendChild(panelWrap);
      overlay.addEventListener('click', e => {
        if (e.target === overlay) closeOverlay();
      });
      document.body.appendChild(overlay);
    }

    function showBranches() {
      const preset = buildOpeningPresetDialogues(getGameMode());
      const branchesMatch = preset.match(/<imotoshinkan_branches>([\s\S]*?)<\/imotoshinkan_branches>/)
        || preset.match(/<IMOTOSHINKAN_BRANCHES>([\s\S]*?)<\/IMOTOSHINKAN_BRANCHES>/)
        || preset.match(/<IMOTOSHINKANBRANCHES>([\s\S]*?)<\/IMOTOSHINKANBRANCHES>/);
      if (branchesMatch) showBranchesFromText(branchesMatch[1].trim());
    }

    // 更新正文内容（支持托莉娜对话标签）
    async function updateMainText(text) {
      const dialogueText = document.querySelector('.dialogue-text');
      if (!dialogueText) return;

      text = stripAiHtmlComments(text);

      // 如果正在读档，阻止更新（防止覆盖读档的对话）
      if (window._isLoadingArchiveDialogue) {
        logWithTag('LOAD', '⚠️ 阻止 updateMainText 覆盖读档对话');
        return;
      }

      // 解析所有托莉娜对话标签
      const dialogues = parseTolinaDialogues(text);

      if (dialogues.length > 0) {
        // 有多段对话，存储并显示第一段
        currentDialogues = dialogues;
        currentDialogueIndex = 0;
        await showDialogue(0);
      } else {
        // 没有对话标签，直接显示文本（应用打印机效果）
        currentDialogues = [];
        currentDialogueIndex = 0;
        applyTypewriterToDialogue(text, dialogueText);
        clearGalSprite();
        // 清空名牌（在名字区中）
        const dialogueNameArea = document.querySelector('.dialogue-name-area');
        if (dialogueNameArea) {
          const nameplate = dialogueNameArea.querySelector('.nameplate');
          if (nameplate) {
            const nameplateTop = nameplate.querySelector('.np-top');
            const nameplateBottom = nameplate.querySelector('.np-bottom');
            if (nameplateTop) nameplateTop.textContent = '';
            if (nameplateBottom) nameplateBottom.textContent = '';
          }
        }
      }
    }

    // 其他视角切换：根据 showingOtherPov 显示正文或其他视角内容，并恢复上次的句子位置
    function ensureOtherPovToggle() {
      if (document.getElementById('otherpov-toggle-container')) return;
      const container = document.createElement('div');
      container.className = 'otherpov-toggle-container';
      container.id = 'otherpov-toggle-container';

      const btn = document.createElement('button');
      btn.className = 'otherpov-toggle-btn';
      btn.id = 'otherpov-toggle-btn';
      btn.type = 'button';
      btn.disabled = true;
      btn.title = '本层无额外视角';
      btn.setAttribute('aria-label', '额外视角');

      const icon = document.createElement('span');
      icon.className = 'otherpov-toggle-icon';
      icon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect x="3.5" y="5.5" width="9.5" height="13" rx="2" stroke="currentColor" stroke-width="1.7"/>
  <rect x="11" y="5.5" width="9.5" height="13" rx="2" stroke="currentColor" stroke-width="1.7" opacity="0.72"/>
  <path d="M8.2 12h7.6M11.2 9.2 8.2 12l3 2.8M12.8 14.8 15.8 12l-3-2.8" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

      const label = document.createElement('span');
      label.className = 'otherpov-toggle-label';
      label.textContent = '额外视角';

      btn.append(icon);
      btn.addEventListener('click', async e => {
        e.stopPropagation();
        if (!currentLayerOtherPov?.otherpov?.trim()) return;
        showingOtherPov = !showingOtherPov;
        await applyOtherPovSwitch();
        updateOtherPovToggleVisibility();
      });

      container.append(btn, label);
      document.body.appendChild(container);
      updateOtherPovToggleVisibility();
    }

    async function applyOtherPovSwitch() {
      if (!currentLayerOtherPov) return;
      if (showingOtherPov) {
        // 切到其他视角：先保存正文当前句索引，再按保存的其他视角索引显示
        savedMainDialogueIndex = currentDialogueIndex;
        const otherPovDialogues = parseTolinaDialogues(currentLayerOtherPov.otherpov);
        currentDialogues = otherPovDialogues;
        const idx = otherPovDialogues.length > 0
          ? Math.min(savedOtherPovDialogueIndex, otherPovDialogues.length - 1)
          : 0;
        currentDialogueIndex = idx;
        if (otherPovDialogues.length > 0) {
          await showDialogue(idx);
        } else {
          currentDialogues = [];
          currentDialogueIndex = 0;
          const dialogueText = document.querySelector('.dialogue-text');
          const dialogueNameArea = document.querySelector('.dialogue-name-area');
          if (dialogueText) applyTypewriterToDialogue(currentLayerOtherPov.otherpov, dialogueText);
          if (dialogueNameArea) {
            const npBottom = dialogueNameArea.querySelector('.nameplate .np-bottom');
            if (npBottom) npBottom.textContent = '额外视角';
          }
        }
      } else {
        // 切回正文：先保存其他视角当前句索引，再按保存的正文索引显示
        savedOtherPovDialogueIndex = currentDialogueIndex;
        const mainDialogues = parseTolinaDialogues(currentLayerOtherPov.maintext);
        currentDialogues = mainDialogues;
        const idx = mainDialogues.length > 0
          ? Math.min(savedMainDialogueIndex, mainDialogues.length - 1)
          : 0;
        currentDialogueIndex = idx;
        if (mainDialogues.length > 0) {
          await showDialogue(idx);
        } else {
          const dialogueText = document.querySelector('.dialogue-text');
          if (dialogueText) applyTypewriterToDialogue(currentLayerOtherPov.maintext, dialogueText);
        }
      }
    }

    // 左侧常驻「额外视角」切换键状态
    function updateOtherPovToggleVisibility() {
      const container = document.getElementById('otherpov-toggle-container');
      const btn = document.getElementById('otherpov-toggle-btn');
      if (!container || !btn) return;
      const hasOtherPov = !!(currentLayerOtherPov?.otherpov?.trim());
      btn.disabled = !hasOtherPov;
      container.classList.toggle('is-available', hasOtherPov);
      container.classList.toggle('is-active', hasOtherPov && showingOtherPov);
      const containerLabel = document.querySelector('#otherpov-toggle-container > .otherpov-toggle-label');
      const text = showingOtherPov ? '正文' : '额外视角';
      if (containerLabel) containerLabel.textContent = text;
      btn.title = !hasOtherPov
        ? '本层无额外视角'
        : showingOtherPov
          ? '返回正文视角'
          : '查看额外视角';
      btn.setAttribute('aria-label', btn.title);
    }

    // 更新分支选项（捕获到新的branch时，不再显示全屏分支选择界面，而是等待对话结束后打开quest界面）
    function updateBranches(branchesText) {
      // 先删除现有的全屏分支选择界面（如果存在）
      const existingOverlay = document.getElementById('branches-overlay');
      if (existingOverlay && existingOverlay.parentNode) {
        document.body.removeChild(existingOverlay);
      }

      // 清空对话框内的分支选项区域
      const branchesContainer = document.getElementById('branches-container');
      const branchesChoices = document.getElementById('branches-choices');
      if (branchesContainer && branchesChoices) {
        branchesChoices.innerHTML = '';
        branchesContainer.classList.remove('has-branches');
      }

      // 如果有新的分支文本，永久替换（直到被下一个新的branch替换）
      if (branchesText && branchesText.trim()) {
        // 永久替换待显示的分支文本
        pendingBranchesText = branchesText;

        // 检查是否还在对话中（有对话且未到达最后一句）
        const isInDialogue = currentDialogues.length > 0 && currentDialogueIndex < currentDialogues.length - 1;

        // 如果已经点击完最后一句，打开quest界面并默认显示选项
        // 如果还在对话中，等待点击完最后一句后由nextDialogue函数打开quest界面
        if (!isInDialogue) {
          // 检查quest界面是否已经打开
          const questOverlay = document.getElementById('current-dialogue-overlay');
          if (!questOverlay) {
            // 如果quest界面未打开，打开它并默认显示选项
            showCurrentDialogueLayer('branches');
          }
        }
        // 如果还在对话中，等待点击完最后一句后由nextDialogue函数打开quest界面（pendingBranchesText已更新）
      }
    }

    // 在snapshots中添加具体时间信息
    async function addTimeToSnapshots(snapshotsText) {
      if (!snapshotsText || !snapshotsText.trim()) {
        return snapshotsText;
      }

      try {
        // 获取当前时间段（早、中、晚等）
        const timePeriod = await getvar('stat_data.系统.时间.当前时间');

        // 获取小时和分钟
        let hour = await getvar('stat_data.系统.时间.小时');
        let minute = await getvar('stat_data.系统.时间.分钟');

        // 如果变量系统中没有小时和分钟，根据时间段计算
        if (hour === null || hour === undefined || minute === null || minute === undefined) {
          // 根据时间段设置默认时间
          const timeDefaults = {
            '早': { hour: 8, minute: 0 },
            '中': { hour: 12, minute: 0 },
            '晚': { hour: 18, minute: 0 },
            '夜': { hour: 21, minute: 0 },
            '午夜': { hour: 0, minute: 0 }
          };

          const defaultTime = timeDefaults[timePeriod] || timeDefaults['早'];
          hour = defaultTime.hour;
          minute = defaultTime.minute;
        }

        // 确保是数字类型
        hour = parseInt(hour, 10) || 0;
        minute = parseInt(minute, 10) || 0;

        // 格式化时间为两位数
        const hourStr = hour.toString().padStart(2, '0');
        const minuteStr = minute.toString().padStart(2, '0');
        const timeStr = `${hourStr}:${minuteStr}`;

        // 检查是否已经包含时间格式（避免重复添加）
        const hasTimeFormat = /\d{2}:\d{2}/.test(snapshotsText);
        if (hasTimeFormat) {
          return snapshotsText; // 如果已经有时间，直接返回
        }

        // 尝试使用逗号分隔格式解析（格式：天数,星期,时间段,时间,描述）
        const parts = snapshotsText.split(',');
        if (parts.length >= 3) {
          // 使用逗号分隔格式
          // 如果第3部分是时间段，且第4部分不存在或不是时间格式，则插入时间
          if (parts.length === 3) {
            // 只有3部分：天数,星期,时间段 - 需要添加时间和描述
            parts.push(timeStr);
            return parts.join(',');
          } else if (parts.length === 4) {
            // 有4部分：检查第4部分是否是时间
            const part4 = parts[3].trim();
            if (/\d{2}:\d{2}/.test(part4)) {
              // 第4部分是时间，已经有时间了
              return snapshotsText;
            } else {
              // 第4部分是描述，需要在时间段后插入时间
              const timePart = timeStr;
              const descPart = part4;
              parts[3] = timePart;
              parts.push(descPart);
              return parts.join(',');
            }
          } else {
            // 已经有5部分或更多，检查第4部分是否是时间
            const part4 = parts[3].trim();
            if (/\d{2}:\d{2}/.test(part4)) {
              // 第4部分是时间，已经有时间了
              return snapshotsText;
            } else {
              // 第4部分不是时间，需要在时间段后插入时间
              parts.splice(3, 0, timeStr);
              return parts.join(',');
            }
          }
        } else {
          // 兼容旧格式：使用正则表达式解析
          let result = snapshotsText;

          // 时间段匹配模式（按优先级排序，先匹配长的）
          // 注意：需要匹配时间段后可能已经存在的时间格式（空格或逗号分隔）
          const timePatterns = [
            { pattern: /(清晨|早上|早晨)(?:\s+|\s*,\s*)(\d{2}:\d{2})?(?![:\d\s,])/g, value: '早' },
            { pattern: /(中午|正午)(?:\s+|\s*,\s*)(\d{2}:\d{2})?(?![:\d\s,])/g, value: '中' },
            { pattern: /(下午)(?:\s+|\s*,\s*)(\d{2}:\d{2})?(?![:\d\s,])/g, value: '下午' },
            { pattern: /(傍晚|黄昏)(?:\s+|\s*,\s*)(\d{2}:\d{2})?(?![:\d\s,])/g, value: '傍晚' },
            { pattern: /(晚上|夜晚)(?:\s+|\s*,\s*)(\d{2}:\d{2})?(?![:\d\s,])/g, value: '晚' },
            { pattern: /(深夜|午夜)(?:\s+|\s*,\s*)(\d{2}:\d{2})?(?![:\d\s,])/g, value: '深夜' },
            { pattern: /(早)(?:\s+|\s*,\s*)(\d{2}:\d{2})?(?![:\d\s,])/g, value: '早' },
            { pattern: /(中)(?:\s+|\s*,\s*)(\d{2}:\d{2})?(?![:\d\s,])/g, value: '中' },
            { pattern: /(晚)(?:\s+|\s*,\s*)(\d{2}:\d{2})?(?![:\d\s,])/g, value: '晚' },
            { pattern: /(夜)(?:\s+|\s*,\s*)(\d{2}:\d{2})?(?![:\d\s,])/g, value: '夜' }
          ];

          let timeAdded = false;

          // 尝试匹配时间段并添加时间（使用逗号分隔）
          for (const timePattern of timePatterns) {
            if (timePattern.pattern.test(result)) {
              // 在匹配的时间段后添加时间（使用逗号分隔）
              result = result.replace(timePattern.pattern, (match) => {
                // 检查后面是否已经有时间格式
                if (!/\d{2}:\d{2}/.test(match)) {
                  // 如果时间段后没有时间，添加时间（使用逗号分隔）
                  return `${match.replace(/\s+\d{2}:\d{2}/, '').replace(/\s*,\s*\d{2}:\d{2}/, '')},${timeStr}`;
                }
                return match;
              });
              timeAdded = true;
              break; // 只添加一次
            }
          }

          // 如果没有找到时间段，但snapshots中有当前时间段，也添加时间
          if (!timeAdded && timePeriod) {
            const simplePattern = new RegExp(`(${timePeriod})(?:\\s+|\\s*,\\s*)(\\d{2}:\\d{2})?(?![\\s:\\d,])`, 'g');
            if (simplePattern.test(result)) {
              result = result.replace(simplePattern, (match) => {
                // 如果已经有时间格式，不重复添加
                if (!/\d{2}:\d{2}/.test(match)) {
                  // 使用逗号分隔
                  return `${match},${timeStr}`;
                }
                return match;
              });
              timeAdded = true;
            }
          }

          return result;
        }
      } catch (error) {
        warnWithTag('WARN', '添加时间到snapshots失败:', error);
        return snapshotsText; // 失败时返回原始文本
      }
    }

    // 更新快照（不显示快照消息，直接隐藏）
    async function updateSnapshots(snapshotsText, addTime = false) {
      const snapshotsContainer = document.getElementById('snapshots-container');
      const snapshotsContent = document.getElementById('snapshots-content');

      if (!snapshotsContainer || !snapshotsContent) return snapshotsText;

      // 如果需要添加时间信息，则添加
      let snapshotsWithTime = snapshotsText;
      if (addTime && snapshotsText) {
        snapshotsWithTime = await addTimeToSnapshots(snapshotsText);
      }

      // 清空并隐藏快照（不显示快照消息）
      snapshotsContent.textContent = '';
      snapshotsContainer.classList.remove('has-snapshots');

      // 返回snapshots（如果添加了时间则返回带时间的版本）
      return snapshotsWithTime;
    }

    // 更新变量（直接修改MVU，不显示变量更新）
    // 更新变量（优先使用 ERA，回退到 MVU）
    async function updateVariables(variablesText) {
      const variablesContainer = document.getElementById('variables-container');
      const variablesContent = document.getElementById('variables-content');

      if (variablesContainer && variablesContent) {
        // 清空并隐藏变量
        variablesContent.textContent = '';
        variablesContainer.classList.remove('has-variables');
      }

      // 如果没有变量文本，直接返回
      if (!variablesText || !variablesText.trim()) {
        return;
      }

      try {
        // 解析variables文本：支持每行一条或多条（按 ); 拆），格式为 _.set('路径', 值) / _.set('路径', 旧值, 新值) / _.add('路径', 值) 或 "路径: 值"
        const parsedVars = {};
        const variablePaths = []; // 保存变量路径，用于后续显示
        const addIncrements = []; // _.add 正向增量，用于正常·里精液派生同步
        const lines = variablesText.trim().split('\n');

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;
          // 同一行可能有多条 _.set/_.add（如 _.set('系统.时间.分钟',0,15);_.add('托莉娜.基础.性欲值', 2);），按 ); 拆成多条再解析
          const statements = trimmedLine.split(/\)\s*;\s*/).map(s => s.trim()).filter(Boolean);
          for (const rawStmt of statements) {
            const stmt = rawStmt.endsWith(')') ? rawStmt : rawStmt + ')';

          let path = null;
          let value = null;
          let isAdd = false; // 标记是否为 _.add 操作

          // 尝试匹配 _.set('路径', 值) / _.set('路径', 旧值, 新值) / _.add('路径', 值)；路径可带或不带 stat_data. 前缀（如 '系统.时间.分钟' 或 'stat_data.系统.时间.分钟'）
          const setMatch = stmt.match(/^_\.(set|add)\s*\(\s*['"]([^'"]+)['"]\s*,\s*(.+?)\s*\)\s*;?\s*$/);
          if (setMatch) {
            isAdd = setMatch[1] === 'add';
            path = setMatch[2].trim();
            let rawValue = setMatch[3].trim();
            // _.set('路径', 旧值, 新值) 三参数时，取最后一个参数作为要设置的值（与状态变量说明一致）
            if (setMatch[1] === 'set' && rawValue.includes(',')) {
              const parts = rawValue.split(',').map(s => s.trim());
              if (parts.length >= 2) rawValue = parts[parts.length - 1];
            }
            // 解析值（可能是字符串、数字、布尔值）
            if ((rawValue.startsWith('"') && rawValue.endsWith('"')) ||
                (rawValue.startsWith("'") && rawValue.endsWith("'"))) {
              // 字符串值，移除引号
              value = rawValue.slice(1, -1);
            } else if (rawValue === 'true') {
              value = true;
            } else if (rawValue === 'false') {
              value = false;
            } else {
              // 尝试解析为数字
              const numValue = parseFloat(rawValue);
              if (!isNaN(numValue) && isFinite(numValue)) {
                if (rawValue.includes('.') || rawValue.includes('e') || rawValue.includes('E')) {
                  value = numValue;
                } else {
                  value = parseInt(rawValue, 10);
                }
              } else {
                // 无法解析，作为字符串处理
                value = rawValue;
              }
            }
          } else {
            // 支持 "路径: 值" 或 "路径= 值" 格式
            const match = stmt.match(/^([^\s:]+(?:\.[^\s:]+)*)\s*[:=]\s*(.+)$/);
            if (match) {
              path = match[1].trim();
              const rawValue = match[2].trim();

              // 尝试转换值的类型
              const numValue = parseFloat(rawValue);
              if (!isNaN(numValue) && isFinite(numValue) && rawValue.trim() !== '') {
                if (rawValue.includes('.') || rawValue.includes('e') || rawValue.includes('E')) {
                  value = numValue;
                } else {
                  value = parseInt(rawValue, 10);
                }
              } else if (rawValue === 'true' || rawValue === 'false') {
                value = rawValue === 'true';
              } else if ((rawValue.startsWith('"') && rawValue.endsWith('"')) ||
                         (rawValue.startsWith("'") && rawValue.endsWith("'"))) {
                value = rawValue.slice(1, -1);
              } else {
                value = rawValue;
              }
            }
          }

          if (path && value !== null) {
            // 移除 stat_data. 前缀（ERA 使用纯净路径）
            if (path.startsWith('stat_data.')) {
              path = path.substring('stat_data.'.length);
            }
            // 兼容短路径：系统.分钟/小时/星期/已经过天数/当前时间 → 系统.时间.xxx（实际存储位置）
            const timePathAlias = {
              '系统.分钟': '系统.时间.分钟',
              '系统.小时': '系统.时间.小时',
              '系统.星期': '系统.时间.星期',
              '系统.已经过天数': '系统.时间.已经过天数',
              '系统.当前时间': '系统.时间.当前时间'
            };
            if (timePathAlias[path]) path = timePathAlias[path];

            if (isAiLockedVarPath(path)) {
              warnWithTag(
                'VAR',
                `AI 不可直接修改，已忽略: ${path}（堕落/魔力由引擎随性欲自动计算）`,
              );
              continue;
            }

            // 如果是 _.add 操作，需要先获取当前值
            let addDelta = null;
            if (isAdd) {
              addDelta = typeof value === 'number' ? value : parseFloat(value);
              // 获取当前变量快照（从最后对话层或ERA缓存）
              const lastLayer = getLastDialogueLayer();
              let currentVars = null;

              if (lastLayer && getLayerVars(lastLayer)) {
                currentVars = getLayerVars(lastLayer);
              } else if (ERA.currentVars) {
                currentVars = ERA.currentVars;
              } else if (ERA.cache.vars) {
                currentVars = ERA.cache.vars;
              }

              // 获取当前值
              const currentValue = currentVars ? getNestedValue(currentVars, path) : undefined;

              // 根据类型进行加法操作
              if (typeof value === 'number' && typeof currentValue === 'number') {
                // 数字相加
                value = currentValue + value;
              } else if (typeof value === 'string' && typeof currentValue === 'string') {
                // 字符串拼接
                value = currentValue + value;
              } else if (currentValue === undefined || currentValue === null) {
                // 如果当前值不存在，直接使用新值
                // value 保持不变
              } else {
                // 类型不匹配，尝试转换为数字相加
                const numCurrent = parseFloat(currentValue);
                const numNew = parseFloat(value);
                if (!isNaN(numCurrent) && !isNaN(numNew)) {
                  value = numCurrent + numNew;
                } else {
                  // 无法相加，使用新值（覆盖）
                  // value 保持不变
                }
              }
            }

            // 使用自定义的 set 方法构建嵌套对象结构
            setNestedValue(parsedVars, path, value);
            variablePaths.push(path); // 保存路径
            if (isAdd && addDelta !== null && Number.isFinite(addDelta)) {
              addIncrements.push({ path: remapLegacyHstatePath(path), delta: addDelta });
            }
          } else {
            warnWithTag('VAR', `无法解析变量行，已跳过: ${stmt}`);
          }
          }
        }

        if (Object.keys(parsedVars).length === 0) {
          warnWithTag('VAR', '没有有效的变量需要更新');
          return;
        }

        // 使用 ERA 的 updateByObject 更新变量（这是 ERA 的标准更新方式）
        if (!ERA.initialized) {
          warnWithTag('VAR', 'ERA 未初始化，尝试初始化...');
          ERA.init();
        }

        // 通过 ERA 事件系统更新变量
        ERA.updateByObject(parsedVars);
        logWithTag('ERA', `变量更新已通过 ERA 发送 (${Object.keys(parsedVars).length} 个变量):`, parsedVars);

        // 立即在本地合并 parsedVars，否则 getvar / 体力条 / 同步 仍会读到旧值
        (function applyParsedVarsLocally() {
          const lastLayer = getLastDialogueLayer();
          const targets = [];
          if (ERA.currentVars) targets.push(ERA.currentVars);
          else {
            ERA.currentVars = ERA.defaultVars ? JSON.parse(JSON.stringify(ERA.defaultVars)) : {};
            targets.push(ERA.currentVars);
          }
          if (ERA.cache && ERA.cache.vars) targets.push(ERA.cache.vars);
          else if (ERA.cache) {
            ERA.cache.vars = ERA.currentVars ? JSON.parse(JSON.stringify(ERA.currentVars)) : {};
            targets.push(ERA.cache.vars);
          }
          if (lastLayer && getLayerVars(lastLayer)) targets.push(getLayerVars(lastLayer));
          variablePaths.forEach(path => {
            const val = getNestedValue(parsedVars, path);
            if (val !== undefined) {
              targets.forEach(t => setNestedValue(t, path, val));
              // 记录增量到本层 delta
              if (lastLayer) recordLayerDelta(lastLayer, path, val);
            }
          });
          addIncrements.forEach(({ path, delta }) => {
            targets.forEach(t => applyNormalInnerSemenSyncFromAdd(t, path, delta));
          });
          targets.forEach(t => {
            migrateLegacyHstateTree(t);
            recomputeDerivedHstateFields(t);
          });
          if (ERA.cache) ERA.cache.timestamp = Date.now();
        })();

        // 等待变量更新完成后，从 ERA 系统读取当前值并显示在变量区域
        // 延迟一下确保变量已更新
        setTimeout(async () => {
          try {
            // 获取当前变量快照
            const lastLayer = getLastDialogueLayer();
            let varsSnapshot = null;

            if (lastLayer && getLayerVars(lastLayer)) {
              varsSnapshot = getLayerVars(lastLayer);
            } else if (ERA.currentVars) {
              varsSnapshot = ERA.currentVars;
            } else {
              varsSnapshot = ERA.defaultVars;
            }

            // 构建显示文本：显示变量路径和对应的值
            let displayText = '';
            for (const path of variablePaths) {
              const currentValue = getNestedValue(varsSnapshot, path);
              // 格式化显示：路径: 值
              displayText += `${path}: ${currentValue !== null && currentValue !== undefined ? currentValue : '(未定义)'}\n`;
            }

            // 更新变量区域显示
            if (variablesContainer && variablesContent) {
              variablesContent.textContent = displayText.trim();
              variablesContainer.classList.add('has-variables');
              logWithTag('VAR', '变量区域已更新显示');
            }
          } catch (error) {
            errorWithTag('VAR', '更新变量显示失败', error);
          }
        }, 100); // 延迟100ms确保变量已更新

      } catch (error) {
        errorWithTag('VAR', '更新变量失败', error);
      }
    }

    // ==================== 增量快照（delta snapshot）====================
    // 设计：每层只存「相对上一层的变量变动」varsDelta（{路径: 节点}），
    // 完整变量树 = 基准(defaultVars) + 逐层 delta 累加。
    // - 玩家层（偶数）作为该轮的增量容器：setvar/updatevar 的变动记入最后玩家层 varsDelta。
    // - AI 层（奇数）记录该轮 AI 输出的变量更新。
    // - 层上可缓存完整树 layer.varsSnapshot（内部用，存档时剥离，读档后重建）。

    // 把一条「点路径 -> 值」合并进 delta 树
    function applyDeltaEntry(deltaTree, path, value) {
      setNestedValue(deltaTree, path, (value && typeof value === 'object') ? JSON.parse(JSON.stringify(value)) : value);
    }

    // 把 src 的所有叶子路径以「点路径」形式展开并入 delta（用于整树差异）
    function flattenToDelta(src, prefix, out) {
      out = out || {};
      if (!src || typeof src !== 'object') return out;
      for (const key of Object.keys(src)) {
        const v = src[key];
        const p = prefix ? prefix + '.' + key : key;
        if (v && typeof v === 'object' && !Array.isArray(v)) {
          flattenToDelta(v, p, out);
        } else {
          out[p] = v;
        }
      }
      return out;
    }

    // 计算两个变量树的差异（newTree 相对 oldTree 的变动），返回 delta 树
    function diffVars(oldTree, newTree) {
      const oldFlat = flattenToDelta(oldTree || {});
      const newFlat = flattenToDelta(newTree || {});
      const delta = {};
      for (const p of Object.keys(newFlat)) {
        if (oldFlat[p] !== newFlat[p]) {
          applyDeltaEntry(delta, p, newFlat[p]);
        }
      }
      return delta;
    }

    // 判断 delta 是否为空
    function isEmptyDelta(delta) {
      return !delta || typeof delta !== 'object' || Object.keys(delta).length === 0;
    }

    // 记录一条变量变动到指定层的 varsDelta
    function recordLayerDelta(layer, path, value) {
      if (!layer) return;
      if (!layer.varsDelta) layer.varsDelta = {};
      applyDeltaEntry(layer.varsDelta, path, value);
    }

    // 获取某层的完整变量树（惰性重建 + 缓存）
    function getLayerVars(layer) {
      if (!layer) return ERA.currentVars || ERA.defaultVars;
      if (layer.varsSnapshot) return layer.varsSnapshot; // 已缓存完整树
      // 增量层：重建
      const idx = dialogueLayers.indexOf(layer);
      if (idx >= 0) {
        return rebuildLayerSnapshot(idx);
      }
      // 不在序列里（新层）：基于上一完整树 + 自身 delta
      const base = ERA.currentVars || ERA.defaultVars;
      const merged = JSON.parse(JSON.stringify(base));
      if (layer.varsDelta) deepMerge(merged, layer.varsDelta);
      layer.varsSnapshot = merged;
      return merged;
    }

    // 从基准累加 delta，重建第 index 层的完整变量树（并缓存到该层）
    function rebuildLayerSnapshot(index) {
      // 基准：defaultVars
      let tree = JSON.parse(JSON.stringify(ERA.defaultVars));
      for (let i = 0; i <= index && i < dialogueLayers.length; i++) {
        const l = dialogueLayers[i];
        if (l.varsDelta && !isEmptyDelta(l.varsDelta)) {
          deepMerge(tree, l.varsDelta);
        }
      }
      const layer = dialogueLayers[index];
      if (layer) layer.varsSnapshot = tree;
      return tree;
    }

    // 清空从某层起的快照缓存（回溯/截断后调用，强制下次重建）
    function invalidateSnapshotCacheFrom(index) {
      for (let i = index; i < dialogueLayers.length; i++) {
        if (dialogueLayers[i]) delete dialogueLayers[i].varsSnapshot;
      }
    }

    // 读档迁移：把旧格式（整树 varsSnapshot、无 varsDelta）的对话层转为增量格式。
    // 逐层计算 diff(上一层完整树, 本层完整树) 作为本层 varsDelta，并保留最后一层完整树作为运行时缓存。
    function migrateLegacySnapshotsToDelta() {
      if (!dialogueLayers || dialogueLayers.length === 0) return;
      let prevTree = JSON.parse(JSON.stringify(ERA.defaultVars));
      let migrated = 0;
      for (let i = 0; i < dialogueLayers.length; i++) {
        const layer = dialogueLayers[i];
        if (!layer) continue;
        // 已是增量格式（有 varsDelta）则只更新 prevTree
        if (layer.varsDelta && !isEmptyDelta(layer.varsDelta)) {
          const t = JSON.parse(JSON.stringify(prevTree));
          deepMerge(t, layer.varsDelta);
          prevTree = t;
          continue;
        }
        // 旧格式：有整树 varsSnapshot
        const full = layer.varsSnapshot || layer.mvuData?.stat_data || layer.mvuData;
        if (full && typeof full === 'object') {
          migrateLegacyHstateTree(full);
          layer.varsDelta = diffVars(prevTree, full);
          prevTree = JSON.parse(JSON.stringify(full));
          migrated++;
        }
        // 本层完整树缓存（最后一层作为运行时值，其余清空以省内存）
        layer.varsSnapshot = (i === dialogueLayers.length - 1) ? prevTree : undefined;
        if (layer.varsSnapshot === undefined) delete layer.varsSnapshot;
      }
      if (migrated > 0) {
        logWithTag('LOAD', `旧存档迁移为增量快照：${migrated} 层已转换`);
      }
    }

    // 记录对话层（AI回复，奇数层）- 集成 ERA
    async function recordDialogueLayer(parsed) {
      try {
        if (!parsed?.maintext || !String(parsed.maintext).trim()) {
          warnWithTag('HIST', 'AI 回复无正文，跳过记录对话层（避免产生空轮次）');
          return;
        }

        // 确保对话层永远是奇数（1, 3, 5, 7...）
        if (currentDialogueLayer === 0) {
          // 第一层：直接设置为 1
          currentDialogueLayer = 1;
        } else {
          // 后续层：每次+2，确保保持奇数
          currentDialogueLayer += 2;
        }

        // 验证层数是奇数（防御性检查）
        if (currentDialogueLayer % 2 === 0) {
          errorWithTag('HIST', `警告：对话层应该是奇数，但得到 ${currentDialogueLayer}，已修正`);
          currentDialogueLayer = currentDialogueLayer + 1; // 修正为奇数
        }

        // ============ 增量快照：计算本轮 delta，而非整树写出 ============
        // 本轮 AI 层的完整树 = 上一轮 + 本轮变动。
        // ERA.currentVars 此刻保存的是「应用了本轮所有变量更新后」的运行时树（由 setvar/updatevar 维护）。
        // 因此：本层 delta = diff(上一轮完整树, 当前 ERA.currentVars)；本层完整树 = 当前 ERA.currentVars。
        const runtimeTree = ERA.currentVars
          ? JSON.parse(JSON.stringify(ERA.currentVars))
          : JSON.parse(JSON.stringify(ERA.defaultVars));

        // 找到上一轮（最后一个已有层）的完整树作为 diff 基准
        const prevLayer = dialogueLayers.length > 0 ? dialogueLayers[dialogueLayers.length - 1] : null;
        const prevTree = prevLayer ? getLayerVars(prevLayer) : JSON.parse(JSON.stringify(ERA.defaultVars));

        // 计算本轮 delta（第一层相对默认变量的全量差异；后续层相对上一轮）
        const layerDelta = diffVars(prevTree, runtimeTree);

        const dialogueLayer = {
          id: crypto.randomUUID(),
          layer: currentDialogueLayer, // 对话层数（奇数）
          timestamp: new Date().toISOString(),
          maintext: parsed.maintext || '',
          otherpov: parsed.otherpov || '',
          branches: parsed.branches || '',
          snapshots: parsed.snapshots || '',
          variables: parsed.variables || '',
          // 增量：本轮相对上一轮的变量变动
          varsDelta: layerDelta,
          // 完整树（当前层缓存，也是当前运行时值）
          varsSnapshot: runtimeTree,
          requestFlags: Object.assign(emptyRequestFlags(), requestFlags),
        };
        if (dialogueLayer.varsSnapshot) stripSystemRequest(dialogueLayer.varsSnapshot);

        dialogueLayers.push(dialogueLayer);
        if (parsed.otherpov && parsed.otherpov.trim()) {
          currentLayerOtherPov = { maintext: parsed.maintext || '', otherpov: parsed.otherpov.trim() };
          showingOtherPov = false;
          savedMainDialogueIndex = 0;
          savedOtherPovDialogueIndex = 0;
        } else {
          currentLayerOtherPov = null;
          showingOtherPov = false;
        }

        // 更新 ERA.currentVars 使其指向新对话层的快照（当前运行时值 = 最后对话层快照）
        if (dialogueLayer.varsSnapshot) {
          ERA.currentVars = dialogueLayer.varsSnapshot;
          ERA.cache.vars = dialogueLayer.varsSnapshot;
          ERA.cache.timestamp = Date.now();
          logWithTag('HIST', '已更新 ERA.currentVars 指向新对话层快照（当前运行时值 = 最后对话层快照）');
        }
        logWithTag('HIST', `记录对话层 ${currentDialogueLayer}:`, dialogueLayer);
      } catch (error) {
        errorWithTag('HIST', '记录对话层失败', error);
      }
    }

    function isValidAiDialogueLayer(layer) {
      return !!(layer && layer.type !== 'player' && layer.maintext && String(layer.maintext).trim());
    }

    /** 取最后一次 AI 回复之后、尚未有有效 AI 跟进的玩家输入层 */
    function getPendingPlayerLayer() {
      const lastAi = [...dialogueLayers].reverse().find(isValidAiDialogueLayer);
      if (!lastAi) return null;
      const expectedPlayerLayer = lastAi.layer + 1;
      const hasAiAfter = dialogueLayers.some(
        l => l.type !== 'player' && l.layer === expectedPlayerLayer + 1 && isValidAiDialogueLayer(l),
      );
      if (hasAiAfter) return null;
      const candidates = dialogueLayers.filter(l => l.type === 'player' && l.layer === expectedPlayerLayer);
      return candidates.length ? candidates[candidates.length - 1] : null;
    }

    /**
     * 将对话层整理为「一轮 = 玩家输入 + AI 回复」配对。
     * 剔除无正文 AI 层、同层重复玩家输入，仅保留最新一条待回复玩家输入。
     */
    function getDialogueRoundPairs() {
      const sorted = [...dialogueLayers]
        .filter(l => l.type === 'player' || isValidAiDialogueLayer(l))
        .sort((a, b) => a.layer - b.layer);

      const deduped = [];
      const pendingPlayers = new Map();
      for (const layer of sorted) {
        if (layer.type === 'player') {
          pendingPlayers.set(layer.layer, layer);
          continue;
        }
        const player = pendingPlayers.get(layer.layer - 1);
        if (player) {
          deduped.push(player);
          pendingPlayers.delete(layer.layer - 1);
        }
        deduped.push(layer);
      }

      const maxAiLayer = deduped.reduce((max, l) => (l.type !== 'player' ? Math.max(max, l.layer) : max), 0);
      const orphanPlayers = [...pendingPlayers.values()]
        .filter(p => p.layer > maxAiLayer)
        .sort((a, b) => a.layer - b.layer);
      if (orphanPlayers.length) deduped.push(orphanPlayers[orphanPlayers.length - 1]);

      const pairs = [];
      for (let i = 0; i < deduped.length; i++) {
        const cur = deduped[i];
        if (cur.type !== 'player') {
          pairs.push({ player: null, ai: cur });
          continue;
        }
        const next = deduped[i + 1];
        if (next && next.type !== 'player') {
          pairs.push({ player: cur, ai: next });
          i++;
        } else {
          pairs.push({ player: cur, ai: null });
        }
      }

      while (pairs.length >= 2 && !pairs[pairs.length - 1].ai && !pairs[pairs.length - 2].ai) {
        pairs.splice(pairs.length - 2, 1);
      }

      return pairs;
    }

    /** 构建 prompt 用历史：跳过开局仅有 AI、尚无玩家输入的那一轮 */
    function getDialogueHistoryRoundPairs() {
      const pairs = getDialogueRoundPairs();
      if (pairs.length > 1 && pairs[0].ai && !pairs[0].player) {
        return pairs.slice(1);
      }
      return pairs;
    }

    function getCurrentDialogueRound() {
      return getDialogueHistoryRoundPairs().length;
    }

    /** 清理无效/重复对话层，并同步 currentDialogueLayer */
    function sanitizeDialogueLayers() {
      const pairs = getDialogueRoundPairs();
      const rebuilt = [];
      for (const pair of pairs) {
        if (pair.player) rebuilt.push(pair.player);
        if (pair.ai) rebuilt.push(pair.ai);
      }
      if (rebuilt.length !== dialogueLayers.length) {
        dialogueLayers.length = 0;
        dialogueLayers.push(...rebuilt);
        const lastAi = [...rebuilt].reverse().find(isValidAiDialogueLayer);
        currentDialogueLayer = lastAi ? lastAi.layer : 0;
        logWithTag('HIST', `已整理对话层：${rebuilt.length} 条（${pairs.length} 轮）`);
      }
    }

    // 记录玩家输入（偶数层，可选，用于完整历史记录）
    function recordPlayerInput(inputText) {
      sanitizeDialogueLayers();

      const pending = getPendingPlayerLayer();
      if (pending) {
        pending.playerInput = inputText;
        pending.timestamp = new Date().toISOString();
        logWithTag('HIST', `覆盖待回复的玩家输入层 ${pending.layer}:`, pending);
        return;
      }

      // 确保玩家输入层永远是偶数（2, 4, 6, 8...）
      // 玩家输入层 = 当前对话层 + 1（因为对话层是奇数，+1后是偶数）
      let playerLayerNum = currentDialogueLayer + 1;

      // 验证层数是偶数（防御性检查）
      if (playerLayerNum % 2 !== 0) {
        errorWithTag('HIST', `警告：玩家输入层应该是偶数，但得到 ${playerLayerNum}，已修正`);
        playerLayerNum = playerLayerNum + 1; // 修正为偶数
      }

      const playerLayer = {
        id: crypto.randomUUID(),
        layer: playerLayerNum, // 偶数层
        timestamp: new Date().toISOString(),
        playerInput: inputText,
        type: 'player'
      };
      dialogueLayers.push(playerLayer);
      logWithTag('HIST', `记录玩家输入层 ${playerLayer.layer}:`, playerLayer);
    }

    // 获取最后对话层（最高奇数层）
    function getLastDialogueLayer() {
      let lastLayer = null;
      let maxOddLayer = 0;

      for (let i = dialogueLayers.length - 1; i >= 0; i--) {
        const layer = dialogueLayers[i];
        // 确保是奇数层（对话层）且不是玩家输入
        if (layer.type !== 'player' && layer.layer % 2 === 1) {
          if (layer.layer > maxOddLayer) {
            maxOddLayer = layer.layer;
            lastLayer = layer;
          }
        }
      }

      // 验证返回的层是奇数（防御性检查）
      if (lastLayer && lastLayer.layer % 2 !== 1) {
        errorWithTag('HIST', `警告：最后对话层应该是奇数，但得到 ${lastLayer.layer}`);
      }

      return lastLayer;
    }

    // 处理接收到的消息内容
    async function processMessage(content) {
      // 在控制台输出解析信息（无论通过什么方式调用）
      logWithTag('DEBUG', '═══════════════════════════════════════════════════════');
      logWithTag('DEBUG', '📥 processMessage 被调用');
      logWithTag('DEBUG', '═══════════════════════════════════════════════════════');
      logWithTag('DEBUG', '原始内容:', content);
      logWithTag('DEBUG', '───────────────────────────────────────────────────────');

      const parsed = parseTags(content);
      logWithTag('DEBUG', '解析结果:', parsed);
      if (!APPLY_STORY_HOOKS) {
        warnWithTag('MSG', 'hook 解析已禁用：忽略 hook / 额外视角 / 选项 / 总结 / 数据变化，仅应用正文');
        parsed.hook = '';
        parsed.otherpov = '';
        parsed.branches = '';
        parsed.snapshots = '';
        parsed.variables = '';
        pendingBranchesText = null;
      }
      warnIfTorinaPovLeakedInMaintext(parsed.maintext, parsed.otherpov);
      logWithTag('DEBUG', '───────────────────────────────────────────────────────');

      // 如果正在读档，阻止 processMessage 覆盖读档对话
      if (window._isLoadingArchiveDialogue) {
        logWithTag('LOAD', '⚠️ 阻止 processMessage 覆盖读档对话');
        return;
      }

      if (parsed.maintext) {
        const dialogues = parseTolinaDialogues(parsed.maintext);
        logWithTag('DEBUG', `✅ 解析到 ${dialogues.length} 段对话:`);
        dialogues.forEach((dialogue, index) => {
          logWithTag('DEBUG', `  对话 ${index + 1}:`, {
            角色: dialogue.character,
            表情: dialogue.expression,
            对话: dialogue.dialogue,
            背景: dialogue.background,
            立绘标签: dialogue.baseKey
          });
        });
      } else {
        logWithTag('DEBUG', '⚠️ 没有对话文本 (maintext)');
      }

      if (parsed.branches) {
        logWithTag('DEBUG', '✅ 分支选项:', parsed.branches);
      }

      if (parsed.variables) {
        logWithTag('DEBUG', '✅ 变量更新:', parsed.variables);
      }

      if (parsed.snapshots) {
        logWithTag('DEBUG', '✅ 快照:', parsed.snapshots);
      }

      logWithTag('DEBUG', '═══════════════════════════════════════════════════════');

      // 捕获到AI回复后，检测并控制 UID
      await checkAndControlUIDs();

      // 更新正文
      if (parsed.maintext) {
        // 解析对话并处理CG
        const dialogues = parseTolinaDialogues(parsed.maintext);
        // 处理最后一个对话的CG（如果有）
        if (dialogues.length > 0) {
          const lastDialogue = dialogues[dialogues.length - 1];
          if (lastDialogue.cg) {
            if (lastDialogue.cg.isStop) {
              // 停止显示该CG组的CG
              hideCG(lastDialogue.cg.groupName);
            } else {
              // 显示指定CG组的CG
              showCG(lastDialogue.cg.groupName, lastDialogue.cg.cgName);
            }
          }
        }
        await updateMainText(parsed.maintext);
      }

      // 更新分支选项
      if (parsed.branches) {
        updateBranches(parsed.branches);
      } else {
        updateBranches('');
      }

      // 更新快照（添加时间信息）；支持竖线分隔格式（天数|星期几|小时:分钟|总结），会先规范为逗号分隔
      const normalizedSnapshots = normalizeSnapshotsText(parsed.snapshots || '');
      let snapshotsWithTime = normalizedSnapshots || '';
      if (normalizedSnapshots) {
        snapshotsWithTime = await updateSnapshots(normalizedSnapshots, true);
      } else {
        await updateSnapshots('', true);
      }

      // 更新变量
      if (parsed.variables) {
        await updateVariables(parsed.variables);
      } else {
        await updateVariables('');
      }

      // 记录对话层（用于存档，使用带时间的snapshots）
      const parsedWithTime = {
        ...parsed,
        snapshots: snapshotsWithTime
      };
      await recordDialogueLayer(parsedWithTime);

      // 自动存档（保存最后一个对话）
      try {
        await autoSaveCurrentDialogue();
      } catch (e) {
        errorWithTag('AUTOSAVE', '自动存档失败', e);
      }

      // 变量更新后的体力条/时间天气刷新，已由 refreshUIByVariablePath 批量合并统一处理，无需在此重复直调

      updateOtherPovToggleVisibility();

      logWithTag('MSG', '✅ 消息处理完成');
    }

    // 构建变量说明文本（包含所有变量及其含义、当前值）
    function buildVariablesDescription() {
      const vars = ERA.currentVars || ERA.defaultVars;
      let description = '## 游戏变量说明\n\n';

      // 计算当前对话轮次
      const currentRound = getCurrentDialogueRound();
      description += `**当前对话轮次：第${currentRound}轮对话**\n\n`;

      // 系统变量
      description += '### 系统变量\n';
      const systemVars = [
        { path: 'stat_data.系统.时间.已经过天数', name: '已经过天数', desc: '游戏已进行的天数（数字）', value: getNestedValue(vars, '系统.时间.已经过天数') },
        { path: 'stat_data.系统.时间.当前时间', name: '当前时间', desc: '当前时间段（"早"、"中"、"晚"、"夜"、"午夜"）', value: getNestedValue(vars, '系统.时间.当前时间') },
        { path: 'stat_data.系统.时间.小时', name: '小时', desc: '当前小时（0-23）', value: getNestedValue(vars, '系统.时间.小时') },
        { path: 'stat_data.系统.时间.分钟', name: '分钟', desc: '当前分钟（0-59）', value: getNestedValue(vars, '系统.时间.分钟') },
        { path: 'stat_data.系统.时间.星期', name: '星期', desc: '当前星期（"星期一"到"星期日"）', value: getNestedValue(vars, '系统.时间.星期') },
        { path: 'stat_data.系统.体力.当前体力值', name: '当前体力值', desc: '当前体力值（0-100）', value: getNestedValue(vars, '系统.体力.当前体力值') },
        { path: 'stat_data.系统.模式', name: '游戏模式', desc: '纯爱 | 正常（开局选定，引擎锁定）', value: getNestedValue(vars, '系统.模式') },
        { path: 'stat_data.系统.地点.当前地点', name: '当前地点', desc: '{{user}}所在（地图白名单地名）', value: getNestedValue(vars, '系统.地点.当前地点') ?? getNestedValue(vars, '地点.当前地点') },
        { path: 'stat_data.系统.地点.托莉娜地点', name: '托莉娜地点', desc: '托莉娜所在（地图白名单地名）', value: getNestedValue(vars, '系统.地点.托莉娜地点') ?? getNestedValue(vars, '地点.托莉娜地点') },
        { path: 'stat_data.托莉娜.行程.同行状态', name: '同行状态', desc: '同行|分开|待定', value: getNestedValue(vars, '托莉娜.行程.同行状态') }
      ];

      systemVars.forEach(v => {
        const valueStr = v.value !== null && v.value !== undefined ? String(v.value) : '未设置';
        description += `- \`${v.path}\` - ${v.desc} **当前值：${valueStr}**\n`;
      });
      description += '\n';

      // 托莉娜基础变量
      description += '### 托莉娜基础变量\n';
      const torinaBaseVars = [
        { path: 'stat_data.托莉娜.基础.性欲值', name: '性欲值', desc: '性欲值（0-100，超过100时溢出部分转换为堕落值）', value: getNestedValue(vars, '托莉娜.基础.性欲值') },
        { path: 'stat_data.托莉娜.基础.服装', name: '服装', desc: '当前服装（常服/暴露常服/魅魔常服/魔王服/女仆装/浴巾）', value: getNestedValue(vars, '托莉娜.基础.服装') }
      ];

      torinaBaseVars.forEach(v => {
        const valueStr = v.value !== null && v.value !== undefined ? String(v.value) : '未设置';
        description += `- \`${v.path}\` - ${v.desc} **当前值：${valueStr}**\n`;
      });
      description += '\n';

      // 托莉娜Hstate变量
      description += '### 托莉娜Hstate变量\n';
      const torinaHstateVars = [
        { path: 'stat_data.托莉娜.Hstate纯爱.表.总表.现时魔力', name: '现时魔力', desc: '当前魔力值（数字）', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.总表.现时魔力') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.总表.现时魔力需求', name: '现时魔力需求', desc: '当前魔力需求（数字）', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.总表.现时魔力需求') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.总表.从你吸取魔力次数', name: '从你吸取魔力次数', desc: '从玩家吸取魔力的次数（数字）', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.总表.从你吸取魔力次数') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.总表.从你吸取魔力总量', name: '从你吸取魔力总量', desc: '从玩家吸取的魔力总量（数字）', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.总表.从你吸取魔力总量') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.总表.与你高潮的次数', name: '与你高潮的次数', desc: '与玩家高潮的次数（数字）', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.总表.与你高潮的次数') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.总表.因为其他原因被你玩弄至高潮', name: '因为其他原因被你玩弄至高潮', desc: '除外：因你小穴/屁穴/胸部高潮等已有专项（不显示在 hstatus 主界面）', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.总表.因为其他原因被你玩弄至高潮') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.总表.因为其他原因吸取你魔力', name: '因为其他原因吸取你魔力', desc: '除外：接吻/乳交/小穴/屁穴吸取等已有专项（不显示在 hstatus 主界面）', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.总表.因为其他原因吸取你魔力') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.总表.因为其他原因吸取你魔力次数', name: '因为其他原因吸取你魔力次数', desc: '除外：口交/足交/接吻/颜射/乳交/性交/肛交等已有专项（不显示在 hstatus 主界面）', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.总表.因为其他原因吸取你魔力次数') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.头部.与你口交次数', name: '与你口交次数', desc: '与玩家口交次数（数字）', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.头部.与你口交次数') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.头部.与你接吻获得的魔力量', name: '与你接吻获得的魔力量', desc: '', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.头部.与你接吻获得的魔力量') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.头部.与你接吻次数', name: '与你接吻次数', desc: '', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.头部.与你接吻次数') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.头部.被你深喉次数', name: '被你深喉次数', desc: '', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.头部.被你深喉次数') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.头部.被你颜射次数', name: '被你颜射次数', desc: '', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.头部.被你颜射次数') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.头部.口中你精液量', name: '口中你精液量', desc: '', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.头部.口中你精液量') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.头部.吞下的你精液量', name: '吞下的你精液量', desc: '', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.头部.吞下的你精液量') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.胸部.与你乳交次数', name: '与你乳交次数', desc: '', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.胸部.与你乳交次数') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.胸部.胸部被你爱抚次数', name: '胸部被你爱抚次数', desc: '', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.胸部.胸部被你爱抚次数') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.胸部.因为你胸部高潮次数', name: '因为你胸部高潮次数', desc: '', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.胸部.因为你胸部高潮次数') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.胸部.为你乳夹口交次数', name: '为你乳夹口交次数', desc: '', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.胸部.为你乳夹口交次数') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.胸部.乳交吸取你魔力总量', name: '乳交吸取你魔力总量', desc: '', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.胸部.乳交吸取你魔力总量') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.阴部.与你性交次数', name: '与你性交次数', desc: '与玩家阴道性交次数', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.阴部.与你性交次数') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.阴部.小穴被你爱抚次数', name: '小穴被你爱抚次数', desc: '小穴被玩家爱抚次数', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.阴部.小穴被你爱抚次数') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.阴部.因你小穴高潮次数', name: '因你小穴高潮次数', desc: '因玩家小穴高潮次数', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.阴部.因你小穴高潮次数') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.阴部.小穴吸取你的魔力总量', name: '小穴吸取你的魔力总量', desc: '小穴吸取玩家魔力总量', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.阴部.小穴吸取你的魔力总量') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.阴部.与你肛交次数', name: '与你肛交次数', desc: '与玩家肛交次数', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.阴部.与你肛交次数') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.阴部.屁穴被你爱抚次数', name: '屁穴被你爱抚次数', desc: '屁穴被玩家爱抚次数', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.阴部.屁穴被你爱抚次数') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.阴部.因你屁穴高潮次数', name: '因你屁穴高潮次数', desc: '因玩家屁穴高潮次数', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.阴部.因你屁穴高潮次数') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.阴部.屁穴吸取你的魔力总量', name: '屁穴吸取你的魔力总量', desc: '屁穴吸取玩家魔力总量', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.阴部.屁穴吸取你的魔力总量') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.阴部.被你外射次数', name: '被你外射次数', desc: '被玩家外射次数', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.阴部.被你外射次数') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.阴部.被你内射次数', name: '被你内射次数', desc: '被玩家内射次数', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.阴部.被你内射次数') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.阴部.被你射入精液总量', name: '被你射入精液总量', desc: '被玩家射入精液总量', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.阴部.被你射入精液总量') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.阴部.子宫内你的精液量', name: '子宫内你的精液量', desc: '子宫内玩家精液量', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.阴部.子宫内你的精液量') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.阴部.直肠内你的精液量', name: '直肠内你的精液量', desc: '直肠内玩家精液量', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.阴部.直肠内你的精液量') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.足部.与你足交次数', name: '与你足交次数', desc: '与玩家足交次数', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.足部.与你足交次数') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.足部.被你足部射精次数', name: '被你足部射精次数', desc: '被玩家足部射精次数', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.足部.被你足部射精次数') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.足部.足部现时你的精液量', name: '足部现时你的精液量', desc: '足部当前玩家精液量', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.足部.足部现时你的精液量') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.足部.总足部被你射精量', name: '总足部被你射精量', desc: '足部累计被玩家射精量', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.足部.总足部被你射精量') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.精液状态.当前胸部精液量', name: '当前胸部精液量', desc: '当前胸部精液量（不显示在 hstatus）', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.精液状态.当前胸部精液量') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.精液状态.当前腹部精液量', name: '当前腹部精液量', desc: '当前腹部精液量（不显示在 hstatus）', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.精液状态.当前腹部精液量') },
        { path: 'stat_data.托莉娜.Hstate纯爱.表.精液状态.当前腿部精液量', name: '当前腿部精液量', desc: '当前腿部精液量（不显示在 hstatus）', value: getNestedValue(vars, '托莉娜.Hstate纯爱.表.精液状态.当前腿部精液量') }
      ];

      torinaHstateVars.forEach(v => {
        const valueStr = v.value !== null && v.value !== undefined ? String(v.value) : '未设置';
        description += `- \`${v.path}\` - ${v.desc} **当前值：${valueStr}**\n`;
      });
      description += '\n';

      // 变量更新格式说明
      description += '### 变量更新格式\n';
      description += '使用控制台指令格式更新变量：\n';
      description += '- `_.add(\'变量路径\', 数值)`: 用于数值增减（如性欲值、堕落值、体力值等）\n';
      description += '- `_.set(\'变量路径\', 值)`: 用于直接设置值（文本、布尔值、特定数值）\n';
      description += '示例：\n';
      description += '- `_.add(\'托莉娜.基础.性欲值\', 10)` - 性欲值增加10\n';
      description += '- `_.set(\'stat_data.系统.时间.当前时间\', \'早\')` - 设置时间为"早"\n\n';

      return description;
    }

    // 构建对话历史文本（按轮次倒序；严格一轮 = 玩家输入 + AI 回复）
    function getStoryParams() {
      if (window.妹神官_settings_api && typeof window.妹神官_settings_api.getRouteParams === 'function') {
        return window.妹神官_settings_api.getRouteParams('story') || {};
      }
      return {};
    }

    function buildWorldbookScanMessages() {
      const pairs = getDialogueRoundPairs();
      const msgs = [];
      pairs.forEach((pair) => {
        if (pair.player) {
          msgs.push({ name: '{{user}}', text: String(pair.player.playerInput || '') });
        }
        if (pair.ai) {
          let text = String(pair.ai.maintext || '');
          if (pair.ai.otherpov) text += '\n' + pair.ai.otherpov;
          msgs.push({ name: '托莉娜', text });
        }
      });
      return msgs;
    }

    function buildChatTurns() {
      sanitizeDialogueLayers();
      const pairs = getDialogueRoundPairs();
      const keepFull = Math.max(1, Math.round(Number(getStoryParams().summaryAfter) || 3));
      const total = pairs.length;
      const turns = [];
      for (let i = 0; i < pairs.length; i++) {
        const { player, ai } = pairs[i];
        const fromNewest = total - i;
        if (player && String(player.playerInput || '').trim()) {
          turns.push({ role: 'user', content: String(player.playerInput).trim() });
        }
        if (ai) {
          if (fromNewest > keepFull) {
            const snap = String(ai.snapshots || '').trim();
            if (snap) turns.push({ role: 'assistant', content: snap });
          } else {
            const parts = [];
            if (ai.maintext) parts.push(String(ai.maintext).trim());
            if (ai.snapshots) parts.push(String(ai.snapshots).trim());
            const text = parts.filter(Boolean).join('\n\n');
            if (text) turns.push({ role: 'assistant', content: text });
          }
        }
      }
      return turns;
    }

    function buildPromptMessages(userInput) {
      const userInputWithRequests = appendAutoRequestTags(userInput);
      const story = getStoryParams();
      const builder = window.妹神官_prompt_builder;
      if (!builder || typeof builder.build !== 'function') {
        return { text: userInputWithRequests, messages: [] };
      }
      return builder.build({
        route: 'story',
        userInput: userInputWithRequests,
        userName: '{{user}}',
        history: buildChatTurns(),
        scanMessages: buildWorldbookScanMessages(),
        storyPrompt: String(story.prompt || '').trim(),
        targetChars: Math.round(Number(story.targetChars) || 0),
        extras: {
          scenario: readStatFromPaths(['系统.地点.当前地点', '地点.当前地点']) || '',
          torinaLocation: readStatFromPaths(['系统.地点.托莉娜地点', '地点.托莉娜地点']) || '',
        },
        trigger: 'normal',
      });
    }

    function buildDialogueHistory() {
      sanitizeDialogueLayers();
      const pairs = getDialogueRoundPairs();

      if (!pairs.length) {
        return '## 对话历史\n\n暂无对话记录。\n\n';
      }

      const currentRound = pairs.length;

      const keepFull = Math.max(1, Math.round(Number(getStoryParams().summaryAfter) || 3));
      const total = pairs.length;

      let history = `## 对话历史\n\n`;
      history += `**当前对话轮次：第${currentRound}轮对话**\n\n`;
      history += '对话轮次说明：每轮对话包含玩家输入（偶数层）与 AI 回复（奇数层）；无 AI 回复的重复玩家输入仅保留最新一条。\n\n';

      for (let i = pairs.length - 1; i >= 0; i--) {
        const roundNum = i + 1;
        const { player, ai } = pairs[i];
        const fromNewest = total - i;

        history += `### 第${roundNum}轮对话\n\n`;

        if (player) {
          history += `**玩家输入：**\n${player.playerInput || '(无内容)'}\n\n`;
        }

        if (ai) {
          if (fromNewest > keepFull) {
            if (ai.snapshots) {
              history += `**总结：**\n${ai.snapshots}\n\n`;
            }
          } else {
            if (ai.maintext) {
              history += `**AI回复：**\n${ai.maintext}\n\n`;
            }
            if (ai.snapshots) {
              history += `**快照：**\n${ai.snapshots}\n\n`;
            }
          }
        }

        history += '---\n\n';
      }

      return history;
    }

    const HOME_LOCATION_NAME = '家';

    function getGameClockMinutes() {
      const hour = Number(readStatFromPaths(['系统.时间.小时']) ?? 8);
      const minute = Number(readStatFromPaths(['系统.时间.分钟']) ?? 0);
      return hour * 60 + minute;
    }

    function getGameDayIndex() {
      return Number(readStatFromPaths(['系统.时间.已经过天数']) ?? 0);
    }

    function isPlayerAtHome() {
      const loc = readStatFromPaths(['系统.地点.当前地点', '地点.当前地点']);
      return loc === HOME_LOCATION_NAME;
    }

    function getCurrentLustValue() {
      return Number(readStatFromPaths(['托莉娜.基础.性欲值']) ?? 0);
    }

    function emptyRequestFlags() {
      return {
        晚安亲亲天数: -1,
        回家请求天数: -1,
        越过性欲50: false,
        越过性欲80: false,
      };
    }

    let requestFlags = emptyRequestFlags();

    function stripSystemRequest(vars) {
      if (vars && vars.系统 && Object.prototype.hasOwnProperty.call(vars.系统, '请求')) {
        delete vars.系统.请求;
      }
    }

    function adoptRequestFlags(source) {
      if (!source) return;
      requestFlags = Object.assign(emptyRequestFlags(), source);
    }

    function persistRequestFlags() {
      const lastLayer = getLastDialogueLayer();
      if (lastLayer) lastLayer.requestFlags = Object.assign(emptyRequestFlags(), requestFlags);
    }

    /** 写入运行时变量快照（最后对话层 + ERA），供请求触发标记持久化 */
    function patchRuntimeVarsSnapshot(mutator) {
      const lastLayer = getLastDialogueLayer();
      if (lastLayer) {
        const tree = getLayerVars(lastLayer);
        const before = JSON.parse(JSON.stringify(tree));
        mutator(tree);
        // 记录整树差异到本层 delta
        const d = diffVars(before, tree);
        if (!isEmptyDelta(d)) {
          if (!lastLayer.varsDelta) lastLayer.varsDelta = {};
          deepMerge(lastLayer.varsDelta, d);
        }
        ERA.currentVars = tree;
        ERA.cache.vars = tree;
        return;
      }
      if (!ERA.currentVars) {
        ERA.currentVars = JSON.parse(JSON.stringify(ERA.defaultVars));
      }
      mutator(ERA.currentVars);
      ERA.cache.vars = ERA.currentVars;
      if (typeof ERA.insertByObject === 'function') {
        ERA.insertByObject(ERA.currentVars);
      }
    }

    /**
     * 按当前时间/地点/性欲自动追加 <request: …>
     * 触发记录不写入 stat_data。
     */
    function collectAutoRequestTags() {
      /** @type {string[]} */
      const tags = [];
      const minutes = getGameClockMinutes();
      const day = getGameDayIndex();
      const atHome = isPlayerAtHome();
      const lust = getCurrentLustValue();
      const atOrAfter18 = minutes >= 18 * 60;
      const atOrAfter20 = minutes >= 20 * 60;
      const lastLayer = getLastDialogueLayer();
      if (lastLayer && lastLayer.requestFlags) adoptRequestFlags(lastLayer.requestFlags);
      const req = requestFlags;

      if (lust < 50) req.越过性欲50 = false;
      if (lust < 80) req.越过性欲80 = false;

      if (Number(req.晚安亲亲天数) !== day) {
        if (atOrAfter20) {
          tags.push('<request: 托莉娜请求今天的晚安亲亲>');
          req.晚安亲亲天数 = day;
        } else if (atOrAfter18 && atHome) {
          tags.push('<request: 托莉娜请求今天的晚安亲亲>');
          req.晚安亲亲天数 = day;
        }
      }

      if (Number(req.回家请求天数) !== day && atOrAfter18 && !atHome) {
        tags.push('<request: 托莉娜因为时间过晚，请求回家>');
        req.回家请求天数 = day;
      }

      if (atHome && lust >= 50 && !req.越过性欲50) {
        tags.push('<request: 托莉娜请求立刻亲亲>');
        req.越过性欲50 = true;
      }

      if (!atHome && lust >= 80 && !req.越过性欲80) {
        tags.push('<request: 托莉娜请求立刻亲亲>');
        req.越过性欲80 = true;
      }

      persistRequestFlags();
      patchRuntimeVarsSnapshot(stripSystemRequest);

      if (tags.length) {
        logWithTag('REQUEST', '自动注入:', tags.join(' '));
      }
      return tags;
    }

    function appendAutoRequestTags(userInput = '') {
      const tags = collectAutoRequestTags();
      const base = (userInput || '').trim();
      if (!tags.length) return base;
      return base + tags.join('');
    }

    // 构建完整的提示词（按照优先级顺序：user input -> 对话历史）
    // 变量说明已移除，不再在 RP 时注入提示词（避免把整块变量列表输出给 AI）
    function logPromptBuild(built) {
      const prefix = (built && built.text) || '';
      logWithTag('DEBUG', '═══════════════════════════════════════════════════════');
      logWithTag('DEBUG', '📤 Chat Completion 提示词');
      logWithTag('DEBUG', '═══════════════════════════════════════════════════════');
      if (built && built.diag) {
        logWithTag('DEBUG', '顺序', built.diag.order);
        logWithTag('DEBUG', '预设', built.preset || '(默认)');
        logWithTag('DEBUG', '世界书', built.diag.worldbook);
      }
      if (built && built.messages) {
        built.messages.forEach(function (m, i) {
          logWithTag('' + i + '', '' + m.role + ' (' + String(m.content || '').length + ')');
        });
      }
      logWithTag('DEBUG', '───────────────────────────────────────────────────────');
      logWithTag('DEBUG', prefix);
      logWithTag('DEBUG', '═══════════════════════════════════════════════════════');
      return prefix;
    }

    function buildPromptPrefix(userInput = '') {
      return logPromptBuild(buildPromptMessages(userInput));
    }

    async function generateStoryRound(userInput) {
      await checkAndControlUIDs();
      const built = buildPromptMessages(userInput);
      logPromptBuild(built);
      currentStreamingContent = '';
      setGalBusy(true, '正在生成正文');
      try {
        const llm = window.妹神官_llm;
        const api = window.妹神官_settings_api;
        if (!llm || typeof llm.chat !== 'function') {
          throw new Error('接口未就绪');
        }
        const profile = api && typeof api.resolveProfile === 'function' ? api.resolveProfile('story') : null;
        if (!profile) throw new Error('请先配置接口');
        const story = getStoryParams();
        const messages =
          built && Array.isArray(built.messages) && built.messages.length
            ? built.messages
            : [{ role: 'user', content: (built && built.text) || String(userInput || '') }];
        const text = await llm.chat(profile, {
          messages: messages,
          maxTokens: story.maxTokens,
          temperature: story.temperature,
          topP: story.topP,
          topK: story.topK,
          stream: !!profile.stream,
          onDelta: function (full) {
            currentStreamingContent = full;
          },
        });
        return String(currentStreamingContent || text || '').trim();
      } finally {
        setGalBusy(false);
      }
    }

    // 设置对话点击区域监听器
    function setupDialogueClickListeners() {
      // 使用事件委托，监听整个文本区（包括背景图片）的点击
      document.addEventListener('click', (e) => {
        const dialogueBox = document.querySelector('.dialogue-box');
        if (!dialogueBox || !dialogueBox.contains(e.target)) return;

        // 检查是否点击在文本区域内（包括背景图片区域）
        const rect = dialogueBox.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // 检查点击是否在文本区域内
        if (clickX >= 0 && clickX <= rect.width && clickY >= 0 && clickY <= rect.height) {
          stopGalAuto();
          // 判断点击位置：左边30%回退上一句，右边70%进入下一句
          if (clickX < rect.width * 0.3) {
            // 左侧30%：上一句
            e.preventDefault();
            e.stopPropagation();
            (async () => {
              try {
                await prevDialogue();
              } catch (e) {
                errorWithTag('DIALOGUE', '切换到上一句对话失败', e);
              }
            })();
          } else {
            // 右侧70%：下一句
            e.preventDefault();
            e.stopPropagation();
            (async () => {
              try {
                await nextDialogue();
              } catch (e) {
                errorWithTag('DIALOGUE', '切换到下一句对话失败', e);
              }
            })();
          }
        }
      });
    }

    /** @param {string[]} paths */
    function readStatFromPaths(paths) {
      const lastLayer = getLastDialogueLayer();
      if (lastLayer) {
        for (const p of paths) {
          const v = getNestedValue(getLayerVars(lastLayer), p);
          if (v != null && String(v).trim()) return v;
        }
      }
      const vars = ERA.currentVars || ERA.cache.vars;
      if (vars) {
        for (const p of paths) {
          const v = getNestedValue(vars, p);
          if (v != null && String(v).trim()) return v;
        }
      }
      return null;
    }

    function readCompanionState() {
      return readStatFromPaths(['托莉娜.行程.同行状态']) || '同行';
    }

    function normalizeGameMode(raw) {
      if (raw === GAME_MODE_PURE_LOVE || raw === '纯爱路线') return GAME_MODE_PURE_LOVE;
      if (raw === GAME_MODE_NORMAL || raw === '游戏路线') return GAME_MODE_NORMAL;
      return null;
    }

    function getGameMode() {
      const vars = ERA.currentVars || ERA.cache?.vars;
      const fromRuntime = normalizeGameMode(getNestedValue(vars, '系统.模式'));
      if (fromRuntime === GAME_MODE_PURE_LOVE) return GAME_MODE_PURE_LOVE;
      if (isLoveRouteStart) return GAME_MODE_PURE_LOVE;
      if (fromRuntime === GAME_MODE_NORMAL) return GAME_MODE_NORMAL;
      return GAME_MODE_NORMAL;
    }

    function isPureLoveMode() {
      return getGameMode() === GAME_MODE_PURE_LOVE;
    }

    async function setGameMode(mode) {
      const normalized = normalizeGameMode(mode) ?? GAME_MODE_NORMAL;
      isLoveRouteStart = normalized === GAME_MODE_PURE_LOVE;
      if (ERA.currentVars) setNestedValue(ERA.currentVars, '系统.模式', normalized);
      if (ERA.cache?.vars) setNestedValue(ERA.cache.vars, '系统.模式', normalized);
      await setvar('stat_data.系统.模式', normalized);
      try {
        await checkAndControlUIDs();
      } catch (e) {
        warnWithTag('UID', 'setGameMode 后同步世界书（UID33/43）失败:', e);
      }
      return normalized;
    }

    /** 读档：从快照或旧版 routeTitle 恢复 系统.模式 */
    async function syncGameModeFromArchive(archiveData, varsSnapshot) {
      let mode = normalizeGameMode(getNestedValue(varsSnapshot || ERA.currentVars, '系统.模式'));
      if (!mode && archiveData?.routeTitle) {
        mode = archiveData.routeTitle === '纯爱路线' ? GAME_MODE_PURE_LOVE : GAME_MODE_NORMAL;
      }
      if (!mode) mode = GAME_MODE_NORMAL;
      await setGameMode(mode);
      logWithTag('LOAD', '游戏模式:', mode);
    }

    // 地图：选中地点后写变量并自动 generate
    async function travelToMapLocation(loc) {
      const companion = readCompanionState();
      await setvar('stat_data.系统.地点.当前地点', loc.name);

      if (companion === '同行') {
        await setvar('stat_data.系统.地点.托莉娜地点', loc.name);
      }

      if (typeof MeishinkanWorldMap?.refreshActorMarkers === 'function') {
        await MeishinkanWorldMap.refreshActorMarkers();
      }

      const torinaLoc =
        readStatFromPaths(['系统.地点.托莉娜地点', '地点.托莉娜地点']) || '未知';
      let userInput;
      if (companion === '同行') {
        userInput =
          `【系统】{{user}}与托莉娜一同移动到了：${loc.name}。请描写二人到达后的情景；场景须符合「${loc.name}」。maintext 仅限{{user}}视角。`;
      } else if (companion === '分开') {
        userInput =
          `【系统】{{user}}移动到了：${loc.name}。托莉娜当前在：${torinaLoc}（同行状态：分开）。请描写{{user}}到达后的情景；托莉娜不在场，勿让她凭空出现在 maintext。托莉娜独立戏份须写 <imotoshinkan_otherpov>，禁止写在 maintext。仅当有叙事重量的独立事件时才写 otherpov。`;
      } else {
        userInput =
          `【系统】{{user}}移动到了：${loc.name}（同行状态：待定）。请描写到达情景，并决定是否与托莉娜同行或分开，更新 托莉娜.行程.同行状态 与两地地点。maintext 仅限{{user}}视角；托莉娜独立戏份用 otherpov。`;
      }
      try {
        const content = await generateStoryRound(userInput);
        currentStreamingContent = '';
        if (content) {
          await processMessage(content);
        }
      } catch (error) {
        currentStreamingContent = '';
        console.error('[world-map] 前往地点时 generate 失败:', error);
      }
    }

    // 页面加载时初始化
    window.addEventListener('DOMContentLoaded', async () => {
      logWithTag('INIT', 'DOMContentLoaded 事件触发，开始初始化...');
      if (window.妹神官_settings_variable && typeof window.妹神官_settings_variable.init === 'function') {
        window.妹神官_settings_variable.init();
      }
      setupDialogueClickListeners();
      logWithTag('INIT', 'setupDialogueClickListeners 完成');
      setupSaveFunctionality();
      logWithTag('INIT', 'setupSaveFunctionality 完成');
      ensureOtherPovToggle();

      if (typeof MeishinkanWorldMap !== 'undefined') {
        MeishinkanWorldMap.init({
          onTravel: travelToMapLocation,
          getCurrentLocation: () =>
            readStatFromPaths(['系统.地点.当前地点', '地点.当前地点']) ??
            getvar('stat_data.系统.地点.当前地点'),
          getTorinaLocation: () => {
            const torina = readStatFromPaths(['系统.地点.托莉娜地点', '地点.托莉娜地点']);
            if (torina) return torina;
            if (readCompanionState() === '同行') {
              return readStatFromPaths(['系统.地点.当前地点', '地点.当前地点']);
            }
            return null;
          },
          getCorruptionStage: () => {
            const lastLayer = getLastDialogueLayer();
            if (lastLayer) {
              const v = getNestedValue(getLayerVars(lastLayer), '托莉娜.基础.堕落阶段');
              if (v != null) return Number(v);
            }
            const vars = ERA.currentVars || ERA.cache.vars;
            if (vars) {
              const v = getNestedValue(vars, '托莉娜.基础.堕落阶段');
              if (v != null) return Number(v);
            }
            return getvar('stat_data.托莉娜.基础.堕落阶段');
          },
        });
        logWithTag('INIT', 'MeishinkanWorldMap 已初始化');

        if (DEBUG_SKIP_TO_WORLD_MAP) {
          hideBootScreens();
          await MeishinkanWorldMap.open();
          logWithTag('DEBUG', '已直接打开世界地图');
        }
      }
    });

  

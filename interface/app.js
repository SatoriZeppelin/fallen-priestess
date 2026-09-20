/* ========== index.js ========== */
    // ========== 托莉娜立绘资源库 ==========
    const tolinaSprites = {
      // 第一层：底图（身体/服装底层）
      L1_base: {
        'SockW-Nude': 'https://files.catbox.moe/1pju7n.png',
        'SockW-P1': 'https://files.catbox.moe/l9c5wy.png',
        'SockW-P2': 'https://files.catbox.moe/wi07jf.png',
        'SockW-P3': 'https://files.catbox.moe/dncgjq.png',
        'BareLeg': 'https://files.catbox.moe/d876u2.png',
        'BareLegNude': 'https://files.catbox.moe/dola5y.png',
        'NudeLeg-Maid': 'https://files.catbox.moe/kapkqj.png',
        'SockB-Maid': 'https://files.catbox.moe/uz92b2.png',
        'SockB-Nude': 'https://files.catbox.moe/gk77d4.png',
        'SockB-P3': 'https://files.catbox.moe/7aonpg.png',
        'SockB-P4': 'https://files.catbox.moe/ahm5s7.png',
        'SockW-Maid': 'https://files.catbox.moe/56jazo.png'
      },

      // 第二层：发色
      L2_hair: {
        'HairB': 'https://files.catbox.moe/wa9pv2.png',  // 黄色
        'HairW': 'https://files.catbox.moe/x6ad8g.png'   // 白色
      },

      // 第三层：表情
      L3_expression: {
        // P1 系列（绿瞳）
        P1: {
          'msgk-noHeart': 'https://files.catbox.moe/hieebq.png',
          'Nervous': 'https://files.catbox.moe/qf4wfu.png',
          'Normal': 'https://files.catbox.moe/cu7vso.png',
          'Okay': 'https://files.catbox.moe/cby40r.png',
          'rebuke1': 'https://files.catbox.moe/w14swb.png',
          'rebuke2': 'https://files.catbox.moe/p92xhl.png',
          'Sad': 'https://files.catbox.moe/39pivr.png',
          'Shock1': 'https://files.catbox.moe/or5iqb.png',
          'Shock2': 'https://files.catbox.moe/ibd9at.png',
          'Shock3': 'https://files.catbox.moe/czs8ac.png',
          'Shock4': 'https://files.catbox.moe/y03ot3.png',
          'Angry1': 'https://files.catbox.moe/d0fokf.png',
          'Angry2': 'https://files.catbox.moe/3zr8ta.png',
          'appalling': 'https://files.catbox.moe/azi3jg.png',
          'Bitter': 'https://files.catbox.moe/61uspm.png',
          'Cry': 'https://files.catbox.moe/k4loi9.png',
          'Disappoint': 'https://files.catbox.moe/nq07tu.png',
          'Evade1': 'https://files.catbox.moe/kdq6og.png',
          'Evade2': 'https://files.catbox.moe/dfpftv.png',
          'Focus': 'https://files.catbox.moe/7w93ov.png',
          'Happy': 'https://files.catbox.moe/gu1ko4.png',
          'KissWaiting': 'https://files.catbox.moe/0rug96.png',
          'msgk': 'https://files.catbox.moe/scwi77.png',
          'Shy1': 'https://files.catbox.moe/alayor.png',
          'Shy2': 'https://files.catbox.moe/1wfgwq.png',
          'Shy3': 'https://files.catbox.moe/dyur1k.png',
          'Shy4': 'https://files.catbox.moe/dfbp51.png',
          'Sigh': 'https://files.catbox.moe/vech41.png',
          'Smile': 'https://files.catbox.moe/afuxch.png',
          'Speechless': 'https://files.catbox.moe/t4c2x5.png',
          'Stare': 'https://files.catbox.moe/qhjk23.png',
          'Unhappy': 'https://files.catbox.moe/gcjagn.png',
          'Worry1': 'https://files.catbox.moe/teuaif.png',
          'Worry2': 'https://files.catbox.moe/3ei6rz.png'
        },
        // P3 系列（异色瞳）
        P3: {
          'Angry1': 'https://files.catbox.moe/0d7roj.png',
          'Angry2': 'https://files.catbox.moe/6qs4uw.png',
          'appalling': 'https://files.catbox.moe/ksqj1f.png',
          'Bitter': 'https://files.catbox.moe/w6kl99.png',
          'Cry': 'https://files.catbox.moe/6u1d85.png',
          'Disappoint': 'https://files.catbox.moe/rv06e7.png',
          'Evade1': 'https://files.catbox.moe/04ogaf.png',
          'Evade2': 'https://files.catbox.moe/y2tb5y.png',
          'Focus': 'https://files.catbox.moe/yg6ln7.png',
          'Happy': 'https://files.catbox.moe/b4ahdb.png',
          'KissWaiting': 'https://files.catbox.moe/7f4voy.png',
          'msgk': 'https://files.catbox.moe/pqkdrc.png',
          'msgk-noHeart': 'https://files.catbox.moe/cvc21p.png',
          'Nervous': 'https://files.catbox.moe/hgsmob.png',
          'Normal': 'https://files.catbox.moe/a0u712.png',
          'Okay': 'https://files.catbox.moe/pwnsv0.png',
          'rebuke1': 'https://files.catbox.moe/sbcoj2.png',
          'rebuke2': 'https://files.catbox.moe/8sruf2.png',
          'Sad': 'https://files.catbox.moe/w2t420.png',
          'Shock1': 'https://files.catbox.moe/xnvgc6.png',
          'Shock2': 'https://files.catbox.moe/zye4l8.png',
          'Shock3': 'https://files.catbox.moe/d38pho.png',
          'Shock4': 'https://files.catbox.moe/s6ewh1.png',
          'Shy1': 'https://files.catbox.moe/box3th.png',
          'Shy2': 'https://files.catbox.moe/0wswm4.png',
          'Shy3': 'https://files.catbox.moe/r4ok5a.png',
          'Shy4': 'https://files.catbox.moe/8fn3a0.png',
          'Sigh': 'https://files.catbox.moe/3ms63a.png',
          'Smile': 'https://files.catbox.moe/db8kko.png',
          'Speechless': 'https://files.catbox.moe/wwu3jl.png',
          'Stare': 'https://files.catbox.moe/2lr5vl.png',
          'Unhappy': 'https://files.catbox.moe/vfo26g.png',
          'Worry1': 'https://files.catbox.moe/lzgogu.png',
          'Worry2': 'https://files.catbox.moe/wzn5zs.png'
        }
      },

      // 第四层：衣服
      L4_cloth: {
        'P1': 'https://files.catbox.moe/eq7ii3.png',
        'P2': 'https://files.catbox.moe/jpxfrs.png',
        'P3': 'https://files.catbox.moe/cpic5l.png',
        'P4': 'https://files.catbox.moe/xk684t.png',
        'Bath': 'https://files.catbox.moe/z5zas0.png'
      },

      // 第五层：杂项遮罩
      L5_special: {
        'BlackFace': 'https://files.catbox.moe/us2r9v.png',
        'Brush': 'https://files.catbox.moe/q801ld.png',
        'MouthHair': 'https://files.catbox.moe/v14c12.png',
        'Tear': 'https://files.catbox.moe/f1j6cg.png'
      },

      // 第六层：阴影
      L6_shadow: {
        'P1': 'https://files.catbox.moe/fw7xcp.png',
        'P2': 'https://files.catbox.moe/s0rj8s.png',
        'P3': 'https://files.catbox.moe/r7vrvy.png',
        'P4': 'https://files.catbox.moe/kuwlis.png'
      },

      // 第七层：女仆装特殊图层
      L7_maid: {
        'L7Maid': 'https://files.catbox.moe/wc6lrg.png'
      }
    };

    // ========== 间男角色立绘（左侧；对话格式 <人名|台词>）==========
    const rivalMaleSprites = {
      '哈罗德': {
        base: 'https://files.catbox.moe/7twll8.png',   // Guard-Left
        shade: 'https://files.catbox.moe/x8isar.png',  // Guard-Shade
      },
      '马蒂亚斯': {
        base: 'https://files.catbox.moe/b01so5.png',   // Prince-Left
        shade: 'https://files.catbox.moe/ebiiab.png',  // Prince-Shade
      },
      '埃德加': {
        base: 'https://files.catbox.moe/087jch.png',   // LEdgar-Left-Black
        shade: 'https://files.catbox.moe/jdrwzy.png', // LEdgar-Left-Shade
      },
      '约书亚': {
        base: 'https://files.catbox.moe/jnorft.png',   // LJoshua-Left-Base
        shade: 'https://files.catbox.moe/6grmtd.png',  // LJoshua-Left-Shade
      },
    };

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

      // 将图片转换为base64并存储到IndexedDB
      async saveImageToStorage(url, key) {
        try {
          // SVG文件有CORS限制，直接返回原始URL，不缓存
          if (this.isSVG(url)) {
            console.log('SVG文件跳过缓存，使用原始URL:', url);
            return url;
          }

          const db = await this.initDB();

          // 检查是否已存在
          const cached = await new Promise((resolve) => {
            const transaction = db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => resolve(null);
          });

          if (cached && cached.startsWith('data:')) {
            return cached; // 返回缓存的base64
          }

          // 方法1：尝试使用fetch（优先 Hugging Face，失败回退 catbox）
          try {
            const response =
              typeof fetchAsset === 'function' && MeishinkanAssets?.isCatboxUrl?.(url)
                ? await fetchAsset(url, { mode: 'cors' })
                : await fetch(url, { mode: 'cors' });
            if (response.ok) {
              const blob = await response.blob();
              // 转换为base64
              return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = async () => {
                  const base64 = reader.result;
                  try {
                    // 存储到IndexedDB
                    const transaction = db.transaction([this.storeName], 'readwrite');
                    const store = transaction.objectStore(this.storeName);
                    await new Promise((res, rej) => {
                      const putRequest = store.put(base64, key);
                      putRequest.onsuccess = () => res();
                      putRequest.onerror = () => rej(putRequest.error);
                    });
                    resolve(base64);
                  } catch (e) {
                    console.warn('IndexedDB存储失败，使用原始URL:', e);
                    resolve(url);
                  }
                };
                reader.onerror = () => {
                  resolve(storageUtils.saveImageViaCanvas(url, key));
                };
                reader.readAsDataURL(blob);
              });
            }
          } catch (fetchError) {
            // fetch失败（可能是CORS问题），尝试方法2
            console.log('fetch失败，尝试使用canvas方法:', fetchError.message);
            return storageUtils.saveImageViaCanvas(url, key);
          }
        } catch (error) {
          console.warn('保存图片到IndexedDB失败:', error);
          return url; // 失败时返回原始URL
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
                console.warn('IndexedDB存储失败，使用原始URL:', e);
                resolve(url);
              }
            } catch (canvasError) {
              // canvas转换失败（可能是CORS限制），返回原始URL
              console.warn('canvas转换失败，使用原始URL:', canvasError);
              resolve(url);
            }
          };

          img.onerror = () => {
            // 图片加载失败，返回原始URL
            console.warn('图片加载失败，使用原始URL');
            resolve(url);
          };

          // 设置超时
          setTimeout(() => {
            if (!img.complete) {
              console.warn('图片加载超时，使用原始URL');
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
          console.warn('删除IndexedDB数据失败:', error);
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
          console.warn('获取IndexedDB大小失败:', error);
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

    const ERA = {
      // 当前变量状态（从 ERA 同步）
      currentVars: null,
      // 是否已初始化
      initialized: false,
      // 事件回调队列
      queryCallbacks: new Map(),
      // 查询计数器（用于生成唯一ID）
      queryIdCounter: 0,
      // 缓存管理
      cache: {
        vars: null,           // 缓存的变量数据
        timestamp: 0,          // 缓存时间戳
        ttl: 1000,            // 缓存有效期（毫秒），1秒内不重复查询
        pendingQuery: null    // 正在进行的查询 Promise（避免重复查询）
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

      // 初始化 ERA 事件监听
      init() {
        if (this.initialized) return;

        // 监听 ERA 写入完成事件
        if (typeof eventOn === 'function') {
          eventOn('era:writeDone', (payload) => {
            logWithTag('ERA', '变量写入完成:', payload);
            if (payload && payload.stat) {
              this.currentVars = payload.stat;
              // 更新缓存
              this.cache.vars = payload.stat;
              this.cache.timestamp = Date.now();
            }
          });

          // 监听 ERA 查询结果事件
          eventOn('era:queryResult', (payload) => {
            // 查询结果静默处理，只在出错时输出
            if (payload && payload.error) {
              errorWithTag('ERA', '查询失败:', payload.error);
            }
            // 处理查询回调
            if (payload && payload.queryId && this.queryCallbacks.has(payload.queryId)) {
              const callback = this.queryCallbacks.get(payload.queryId);
              this.queryCallbacks.delete(payload.queryId);
              if (payload.error) {
                callback.reject(new Error(payload.error));
              } else {
                // 更新缓存
                if (payload.data) {
                  this.cache.vars = payload.data;
                  this.cache.timestamp = Date.now();
                  this.currentVars = payload.data;
                }
                callback.resolve(payload.data);
              }
            }
          });

          logWithTag('ERA', 'ERA 事件监听已初始化');
        } else {
          warnWithTag('ERA', 'eventOn 不可用，ERA 功能受限');
        }

        this.initialized = true;
      },

      // 发送 ERA 事件
      emit(eventName, detail) {
        if (typeof eventEmit === 'function') {
          eventEmit(eventName, detail);
          // 查询类操作静默处理，写入类操作输出日志
          const isQueryEvent = eventName.startsWith('era:get') || eventName === 'era:getCurrentVars';
          if (!isQueryEvent) {
            logWithTag('ERA', `发送事件 ${eventName}:`, detail);
          }
        } else {
          errorWithTag('ERA', 'eventEmit 不可用，无法发送 ERA 事件');
        }
      },

      // 插入变量（非破坏性，只写入不存在的路径）
      insertByObject(obj) {
        this.emit('era:insertByObject', { data: obj });
      },

      // 更新变量（修改已存在的变量）
      updateByObject(obj) {
        this.emit('era:updateByObject', { data: obj });
      },

      // 通过路径插入变量
      insertByPath(path, value) {
        this.emit('era:insertByPath', { path, value });
      },

      // 通过路径更新变量（支持 += 等运算）
      updateByPath(path, value, operator = '=') {
        this.emit('era:updateByPath', { path, value, operator });
      },

      // 删除变量
      deleteByPath(path) {
        this.emit('era:deleteByPath', { path });
      },

      // 获取当前变量（异步，通过事件，带缓存）
      async getCurrentVars(forceRefresh = false) {
        const now = Date.now();

        // 如果有缓存且未过期，直接返回缓存
        if (!forceRefresh && this.cache.vars && (now - this.cache.timestamp) < this.cache.ttl) {
          return this.cache.vars;
        }

        // 如果有正在进行的查询，等待它完成
        if (this.cache.pendingQuery) {
          return this.cache.pendingQuery;
        }

        // 创建新的查询
        const queryPromise = new Promise((resolve, reject) => {
          const queryId = `query_${++this.queryIdCounter}_${Date.now()}`;
          this.queryCallbacks.set(queryId, { resolve, reject });
          this.emit('era:getCurrentVars', { queryId });

          // 设置超时
          setTimeout(() => {
            if (this.queryCallbacks.has(queryId)) {
              this.queryCallbacks.delete(queryId);
              // 如果 ERA 不可用，回退到本地变量
              const fallbackVars = this.currentVars || this.defaultVars;
              // 更新缓存
              this.cache.vars = fallbackVars;
              this.cache.timestamp = Date.now();
              resolve(fallbackVars);
            }
          }, 3000);
        });

        // 保存查询 Promise
        this.cache.pendingQuery = queryPromise;

        // 查询完成后更新缓存并清除 pendingQuery
        queryPromise.then(vars => {
          if (vars) {
            this.cache.vars = vars;
            this.cache.timestamp = Date.now();
          }
          this.cache.pendingQuery = null;
        }).catch(() => {
          this.cache.pendingQuery = null;
        });

        return queryPromise;
      },

      // 获取指定消息密钥的快照
      async getSnapshotAtMk(mk) {
        return new Promise((resolve, reject) => {
          const queryId = `query_${++this.queryIdCounter}_${Date.now()}`;
          this.queryCallbacks.set(queryId, { resolve, reject });
          this.emit('era:getSnapshotAtMk', { queryId, mk });

          setTimeout(() => {
            if (this.queryCallbacks.has(queryId)) {
              this.queryCallbacks.delete(queryId);
              resolve(null);
            }
          }, 3000);
        });
      },

      // 通过路径获取变量值
      async getByPath(path) {
        const vars = await this.getCurrentVars();
        if (!vars) return undefined;
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

    // 构建资源列表（统一资源定义）
    function buildResourceList() {
      const assets = [];

      // 系统资源（原UI资源）
      assets.push({ url: 'https://files.catbox.moe/2d1g4v.webm', name: '背景视频', category: '系统', type: 'video' });
      assets.push({ url: 'https://files.catbox.moe/ycywe2.png', name: '标题Logo', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/6ov4dt.png', name: 'New Game按钮', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/w6x4qd.png', name: 'Continue按钮', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/1qixsh.png', name: 'Option按钮', category: '系统', type: 'image' });
      assets.push({ url: 'https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1', name: 'CC协议图标', category: '系统', type: 'image' });
      assets.push({ url: 'https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1', name: 'BY协议图标', category: '系统', type: 'image' });
      assets.push({ url: 'https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1', name: 'NC协议图标', category: '系统', type: 'image' });
      assets.push({ url: 'https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1', name: 'SA协议图标', category: '系统', type: 'image' });

      // 立绘资源
      if (typeof tolinaSprites !== 'undefined') {
        Object.entries(tolinaSprites.L1_base || {}).forEach(([key, url]) => {
          assets.push({ url, name: `托莉娜立绘-L1-${key}`, category: '立绘', type: 'image' });
        });
        Object.entries(tolinaSprites.L2_hair || {}).forEach(([key, url]) => {
          assets.push({ url, name: `托莉娜立绘-L2-${key}`, category: '立绘', type: 'image' });
        });
        Object.entries(tolinaSprites.L3_expression?.P1 || {}).forEach(([key, url]) => {
          assets.push({ url, name: `托莉娜立绘-L3-P1-${key}`, category: '立绘', type: 'image' });
        });
        Object.entries(tolinaSprites.L3_expression?.P3 || {}).forEach(([key, url]) => {
          assets.push({ url, name: `托莉娜立绘-L3-P3-${key}`, category: '立绘', type: 'image' });
        });
        Object.entries(tolinaSprites.L4_cloth || {}).forEach(([key, url]) => {
          assets.push({ url, name: `托莉娜立绘-L4-${key}`, category: '立绘', type: 'image' });
        });
        Object.entries(tolinaSprites.L5_special || {}).forEach(([key, url]) => {
          assets.push({ url, name: `托莉娜立绘-L5-${key}`, category: '立绘', type: 'image' });
        });
        Object.entries(tolinaSprites.L6_shadow || {}).forEach(([key, url]) => {
          assets.push({ url, name: `托莉娜立绘-L6-${key}`, category: '立绘', type: 'image' });
        });
        Object.entries(tolinaSprites.L7_maid || {}).forEach(([key, url]) => {
          assets.push({ url, name: `托莉娜立绘-L7-${key}`, category: '立绘', type: 'image' });
        });
      }
      if (typeof rivalMaleSprites !== 'undefined') {
        Object.entries(rivalMaleSprites).forEach(([name, layers]) => {
          if (layers.base) {
            assets.push({ url: layers.base, name: `间男立绘-${name}-本体`, category: '立绘', type: 'image' });
          }
          if (layers.shade) {
            assets.push({ url: layers.shade, name: `间男立绘-${name}-阴影`, category: '立绘', type: 'image' });
          }
        });
      }

      // 背景资源
      assets.push({ url: 'https://files.catbox.moe/dswunx.png', name: '白天露天废墟', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/qj6dcy.png', name: '白天露天长廊', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/y4spym.png', name: '草地', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/uzpt5x.png', name: '草地小路', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/el5ch1.png', name: '打开大门传送门走廊', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/mevkx3.png', name: '地下建筑内', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/rlv186.png', name: '毒沼泽', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/f9yq6v.png', name: '废墟', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/wp1iky.png', name: '关闭大门走廊', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/7pzktn.png', name: '旱地', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/2arfp5.png', name: '黑暗洞穴', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/myr71d.png', name: '黑森林', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ltnpnb.png', name: '荒地', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/fwuzgm.png', name: '荒芜草地', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/zyu55x.png', name: '黄昏露天长廊', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/o3rikj.png', name: '集市', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/35n6q8.png', name: '建筑内', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ylkodm.png', name: '矿坑', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/lx6625.png', name: '矿坑2', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ec996u.png', name: '矿坑3', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/g5834r.png', name: '魔界废土', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/lcuxzp.png', name: '木地板', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/np1np8.png', name: '熔岩地', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/8odtak.png', name: '沙漠', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/cc3k6f.png', name: '山路', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/dpbk63.png', name: '石制室内', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/37b3nb.png', name: '石制室内2', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/gungox.png', name: '树林小路', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/x2zkz3.png', name: '透光矿坑', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/crmevj.png', name: '晚上露天长廊', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/xwhu4i.png', name: '小镇路', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/cvh6io.png', name: '雪地', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/woqe7c.png', name: '岩浆地', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/rutz1i.png', name: '依山小路', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/bwwhmr.png', name: '阴天露天废墟', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/arv06v.png', name: '矿坑4', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/x73t54.png', name: '林中小径', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/g4auhb.png', name: '迷雾废墟', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/yec24e.png', name: '迷雾黑森林', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/wq3zhj.png', name: '明亮洞穴', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/hd5ruw.png', name: '荧光路', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/54ar1p.png', name: '云上', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ynxgez.png', name: '傍晚广场', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/l52u8s.png', name: '傍晚教廷门口', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/31a6mq.png', name: '城垛', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ahpe9q.png', name: '城墙外', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/4c2r5u.png', name: '房屋', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/bwxni5.png', name: '风暴海湾', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/n0e4jq.png', name: '海湾', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/e6glwy.png', name: '黄昏庄园门口', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/4rsj5z.png', name: '教堂', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/rf3kfk.png', name: '教堂讲台', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/31xlvk.png', name: '教堂门口', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/g0tnbr.png', name: '客厅', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/7cgt32.png', name: '客厅晚上', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/dkenm7.png', name: '石制走廊', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ct4o7h.png', name: '无光教堂', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/oa0wch.png', name: '夜晚房屋', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/03sg96.png', name: '夜晚广场', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/dmbv2v.png', name: '夜晚海湾', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ku7x1b.png', name: '夜晚教堂', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/fu80fn.png', name: '夜晚教堂门口', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/7lhf43.png', name: '夜晚酒馆', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/7fw6se.png', name: '树林', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/rjfcof.png', name: '水潭', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/j29gf4.png', name: '王宫花园', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/05h0qs.png', name: '王宫走廊', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/4vblqw.png', name: '王座厅', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/7fmmer.png', name: '卧室', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/emuhml.png', name: '卧室晚上', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/s0lzku.png', name: '夜晚庄园会客厅', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/t30w1k.png', name: '夜晚庄园门口', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/7ld24b.png', name: '阴暗大门', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/uirewc.png', name: '营地', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/al1jxf.png', name: '营地床铺', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/y7ein8.png', name: '营地晚上', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/sg26no.png', name: '庄园餐厅', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/87omvd.png', name: '庄园房间', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/5d1l3p.png', name: '庄园会客厅', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/2ne9c0.png', name: '庄园门口', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/msn1g0.png', name: '庄园室内花园', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/06iof0.png', name: '庄园书库', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/nyeozy.png', name: '庄园走廊', category: '背景', type: 'image' });

      // CG资源 - Kiss系列
      // Kiss全裸系列（资源名称格式：组名-CG名称）
      assets.push({ url: 'https://files.catbox.moe/zvpw3h.png', name: 'Kiss全裸-wink吐舌', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/eopylo.png', name: 'Kiss全裸-闭眼咧嘴笑', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/snrr2h.png', name: 'Kiss全裸-激烈亲吻', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/1z7v55.png', name: 'Kiss全裸-惊讶', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/kic175.png', name: 'Kiss全裸-亲吻', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/6snfuk.png', name: 'Kiss全裸-微笑', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/f30kbc.png', name: 'Kiss全裸-心形瞳孔吐舌', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/m6hyuh.png', name: 'Kiss全裸-睁眼抿嘴', category: 'CG', type: 'image' });
      // Kiss着衣系列（资源名称格式：组名-CG名称）
      assets.push({ url: 'https://files.catbox.moe/a68y5p.png', name: 'Kiss着衣-闭眼嘟嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/vm3uj3.png', name: 'Kiss着衣-闭眼抿嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/3i4q04.png', name: 'Kiss着衣-惊讶', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/q28gz4.png', name: 'Kiss着衣-亲吻', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/njly8i.png', name: 'Kiss着衣-无高光', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/wz63bi.png', name: 'Kiss着衣-睁眼嘟嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/5otlm5.png', name: 'Kiss着衣-睁眼咧嘴笑', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/snb9w9.png', name: 'Kiss着衣-睁眼微笑', category: 'CG', type: 'image' });
      // 乳交系列（资源名称格式：组名-CG名称）
      assets.push({ url: 'https://files.catbox.moe/sec9ke.png', name: '乳交-惊讶', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ee7s4m.png', name: '乳交-满脸精液', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/pwnu0p.png', name: '乳交-满脸精液闭眼舔舐龟头', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/d16gyo.png', name: '乳交-抿嘴笑', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/8tt5cx.png', name: '乳交-微笑上下乳交', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/5hddcc.png', name: '乳交-眼冒爱心满脸精液', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/xihgql.png', name: '乳交-眼冒爱心满脸精液咧嘴笑', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/mfob6a.png', name: '乳交-眼冒爱心上下乳交舔舐龟头', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/5etexr.png', name: '乳交-眼冒爱心射精上下乳交', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/3a9gi1.png', name: '乳交-眼冒心形上下乳交', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/phzm52.png', name: '乳交-wink对龟头哈气', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/x8c9r0.png', name: '乳交-wink舔舐龟头', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/m3fghf.png', name: '乳交-闭眼舔舐龟头上下乳交', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ft6spt.png', name: '乳交-嘟嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/8hyxry.png', name: '乳交-对龟头哈气', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ql9k8s.png', name: '乳交-近景', category: 'CG', type: 'image' });
      // 骑乘位系列（资源名称格式：组名-CG名称）
      // 骑乘位阶段12系列
      assets.push({ url: 'https://files.catbox.moe/k5c6fb.png', name: '骑乘位阶段12-插入', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/dii9nh.png', name: '骑乘位阶段12-插入破处', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/xskj6g.png', name: '骑乘位阶段12-抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/7a3oa7.png', name: '骑乘位阶段12-激烈抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/jmyndt.png', name: '骑乘位阶段12-素股微笑', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/c6aaw6.png', name: '骑乘位阶段12-素股张嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/pnihqh.png', name: '骑乘位阶段12-中出', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/oy0nez.png', name: '骑乘位阶段12-中出后温存', category: 'CG', type: 'image' });
      // 骑乘位阶段34系列
      assets.push({ url: 'https://files.catbox.moe/hn9a2w.png', name: '骑乘位阶段34-抱头插入', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/nplj5o.png', name: '骑乘位阶段34-抱头抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/f57x9e.png', name: '骑乘位阶段34-抱头抽插咬牙', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/0crgcj.png', name: '骑乘位阶段34-插入', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/iq4wxr.png', name: '骑乘位阶段34-揉胸揉阴蒂插入', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/mnutnj.png', name: '骑乘位阶段34-揉胸揉阴蒂嫌弃插入', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/jl2f3v.png', name: '骑乘位阶段34-素股', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/j2f8bc.png', name: '骑乘位阶段34-中出', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/u4jc7b.png', name: '骑乘位阶段34-中出后温存', category: 'CG', type: 'image' });
      // 骑乘位情趣内衣系列（资源名称格式：组名-CG名称）
      assets.push({ url: 'https://files.catbox.moe/hse095.png', name: '骑乘位情趣内衣-素股', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/mlpib9.png', name: '骑乘位情趣内衣-素股嘟嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/c0h3jq.png', name: '骑乘位情趣内衣-素股害羞', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/js3k50.png', name: '骑乘位情趣内衣-素股气呼呼', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/090601.png', name: '骑乘位情趣内衣-素股咬牙', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/vjupbz.png', name: '骑乘位情趣内衣-中出后害羞', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/cdpegn.png', name: '骑乘位情趣内衣-中出后温存', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/owrda8.png', name: '骑乘位情趣内衣-插入', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/svv08p.png', name: '骑乘位情趣内衣-抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/03h1yz.png', name: '骑乘位情趣内衣-抽插2', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/wnqliu.png', name: '骑乘位情趣内衣-抽插高潮中出', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/x1obo7.png', name: '骑乘位情趣内衣-抽插娇喘', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/jcsxco.png', name: '骑乘位情趣内衣-抽插惊讶', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/f6kbew.png', name: '骑乘位情趣内衣-抽插眯眼', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/5zfgnj.png', name: '骑乘位情趣内衣-抽插咬牙', category: 'CG', type: 'image' });
      // 床上后背位系列（资源名称格式：组名-CG名称）
      assets.push({ url: 'https://files.catbox.moe/3f8hkn.png', name: '床上后背位-插入', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ps7wxk.png', name: '床上后背位-射精翻白眼吐舌', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/22n1v8.png', name: '床上后背位-射精后翻白眼高潮', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/3s29nz.png', name: '床上后背位-射精后翻白眼剧烈高潮', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/anqy6t.png', name: '床上后背位-射精后翻白眼流泪', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/1vj1ub.png', name: '床上后背位-射精后高潮', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/24yv1q.png', name: '床上后背位-射精后剧烈高潮吐舌', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/87z8ye.png', name: '床上后背位-射精后睁大眼流泪', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/dsdzw1.png', name: '床上后背位-射精剧烈高潮翻白眼', category: 'CG', type: 'image' });
      // 地板后背位系列（资源名称格式：组名-CG名称）
      assets.push({ url: 'https://files.catbox.moe/7n7mox.png', name: '地板后背位-闭嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/lx6b98.png', name: '地板后背位-插入', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/wpfzoz.png', name: '地板后背位-插入翻白眼吐舌', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/n836u6.png', name: '地板后背位-插入预备闭嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/xrpigt.png', name: '地板后背位-插入预备张嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/4nefhd.png', name: '地板后背位-等待', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/j32anl.png', name: '地板后背位-等待舔嘴唇', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/b9q30c.png', name: '地板后背位-等待睁大眼', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/w6tpj6.png', name: '地板后背位-射精翻白眼', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/yujbr7.png', name: '地板后背位-射精后', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/5tmues.png', name: '地板后背位-射精后翻白眼吐舌', category: 'CG', type: 'image' });
      // 趴式后背位系列（资源名称格式：组名-CG名称）
      assets.push({ url: 'https://files.catbox.moe/a86uik.png', name: '趴式后背位-抽插心形瞳孔吐舌', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/s3yet2.png', name: '趴式后背位-抽插心形瞳孔吐舌中出', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/kk2gir.png', name: '趴式后背位-抽插心形瞳孔中出', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/0v0ap9.png', name: '趴式后背位-抽插张嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ca93w2.png', name: '趴式后背位-抽插睁单眼闭嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/oj5uan.png', name: '趴式后背位-中出往后看', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/984ara.png', name: '趴式后背位-插入睁单眼闭嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/m4ox30.png', name: '趴式后背位-抽插闭嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/fchm8c.png', name: '趴式后背位-抽插快感', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/o6p1h5.png', name: '趴式后背位-抽插心形瞳孔', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/w8uw2y.png', name: '趴式后背位-抽插心形瞳孔2', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/2nqn2p.png', name: '趴式后背位-抽插心形瞳孔闭嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/njv63z.png', name: '趴式后背位-抽插心形瞳孔翻白眼中出', category: 'CG', type: 'image' });
      // 侧入位系列（资源名称格式：组名-CG名称）
      assets.push({ url: 'https://files.catbox.moe/qovu68.png', name: '侧入位-翻白眼吐舌心形瞳孔抽插射精', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/2e4q0u.png', name: '侧入位-翻白眼吐舌心形眼抽插射满身', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/psnu9z.png', name: '侧入位-翻白眼吐舌心形眼抽插射满身中出', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ylopcn.png', name: '侧入位-翻白眼心形眼抽插射满身高潮', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/r4439a.png', name: '侧入位-往后看咬牙未插入精液溢出', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/utzpsw.png', name: '侧入位-无高光翻白眼吐舌未插入精液溢出', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/8ry8bs.png', name: '侧入位-心形眼吐舌高潮射满身抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/zltkn5.png', name: '侧入位-咬牙往后看插入前', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ob6uu9.png', name: '侧入位-咬牙笑往后看插入前', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/hup08d.png', name: '侧入位-睁大眼惊讶往后看射满身未插入', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/vba43b.png', name: '侧入位-睁单眼插入', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/3zzryd.png', name: '侧入位-睁单眼抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/e6jqjl.png', name: '侧入位-睁单眼抽插精液溢出', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/lv29gu.png', name: '侧入位-闭眼抽插精液溢出', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/co2o1g.png', name: '侧入位-闭眼高潮射身上未插入', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/mqhyso.png', name: '侧入位-闭眼高潮未插入', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/kqu0sv.png', name: '侧入位-闭眼咬牙中出', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/8sertn.png', name: '侧入位-抽插射满身闭眼咬牙中出', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ea7tjd.png', name: '侧入位-睁眼往后看舔嘴唇未插入射满身', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/imbo8o.png', name: '侧入位-睁眼往后看未插入射满身', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ih55mj.png', name: '侧入位-睁眼往后看笑抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/il4cxl.png', name: '侧入位-睁眼往后看笑猫嘴精液溢出', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/yrg1st.png', name: '侧入位-睁单眼射满身抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/dgrr3a.png', name: '侧入位-睁单眼往后看未插入射满身', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/c6isbd.png', name: '侧入位-睁单眼微笑插入', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/kyg00u.png', name: '侧入位-睁单眼心形瞳孔抽插精液溢出', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/2gyetw.png', name: '侧入位-睁眼往后看抽插精液溢出', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/tgcfzx.png', name: '侧入位-睁眼往后看猫唇未插入射满身', category: 'CG', type: 'image' });
      // 正常位系列（资源名称格式：组名-CG名称）
      assets.push({ url: 'https://files.catbox.moe/3oumcw.png', name: '正常位-振动棒振动', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/rx62oq.png', name: '正常位-中出后', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/8ycxeb.png', name: '正常位-掰穴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/b3d2fk.png', name: '正常位-抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/iiawfp.png', name: '正常位-高潮中出', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/o3f7of.png', name: '正常位-射精在脚上后', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/3tboew.png', name: '正常位-振动棒插入', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/20fhqf.png', name: '正常位-振动棒插入撸管', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/caa8fi.png', name: '正常位-振动棒插入撸管射精', category: 'CG', type: 'image' });
      // 骑乘位女仆装系列（资源名称格式：组名-CG名称）
      assets.push({ url: 'https://files.catbox.moe/zd8307.png', name: '骑乘位女仆装-表达爱意拔出', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/42lcpt.png', name: '骑乘位女仆装-表达爱意双手撑着抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/az8b9d.png', name: '骑乘位女仆装-颤抖拔出', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/13qmy7.png', name: '骑乘位女仆装-单手捂嘴单手撑着抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/xxwxje.png', name: '骑乘位女仆装-嘟嘴颤抖拔出手撑着', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/4y5jxl.png', name: '骑乘位女仆装-嘟嘴抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/m3s86f.png', name: '骑乘位女仆装-翻白眼咬牙精液溢出抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/irlh5q.png', name: '骑乘位女仆装-害羞单手捂嘴单手撑着抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/70u90l.png', name: '骑乘位女仆装-惊讶看外面插入', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/r717pn.png', name: '骑乘位女仆装-咬牙抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/gq9bz5.png', name: '骑乘位女仆装-咬牙激烈抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/9l7irr.png', name: '骑乘位女仆装-张口闭眼中出', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/dkkhsf.png', name: '骑乘位女仆装-张嘴闭眼中出', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/dca7wa.png', name: '骑乘位女仆装-张嘴抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/6io8cs.png', name: '骑乘位女仆装-张嘴害羞激烈抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/hrs1g6.png', name: '骑乘位女仆装-张嘴激烈抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/6n2w25.png', name: '骑乘位女仆装-张嘴精液溢出', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ern82i.png', name: '骑乘位女仆装-中出后拔出', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/rv5660.png', name: '骑乘位女仆装-中出后自己爱抚乳头和阴蒂', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/tjn869.png', name: '骑乘位女仆装-抱头插入', category: 'CG', type: 'image' });
      // 女仆装系列（资源名称格式：组名-CG名称）
      assets.push({ url: 'https://files.catbox.moe/c8co16.png', name: '女仆装-半开门探出抿嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/kowxno.png', name: '女仆装-半开门探出身体被抓住肩膀往后看惊讶', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ie94ge.png', name: '女仆装-半开门探出身体被抓住肩膀张嘴笑', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/pz01s1.png', name: '女仆装-半开门探出身体惊讶', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/mupl8t.png', name: '女仆装-半开门探出身体露齿笑', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/0zd9m0.png', name: '女仆装-半开门探出身体抿嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/zzjg7n.png', name: '女仆装-半开门探出身体说话', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/gbjemd.png', name: '女仆装-半开门探出身体往上看露齿笑', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/svbg8n.png', name: '女仆装-半开门探出身体小张嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/czah4z.png', name: '女仆装-半开门探出身体笑', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/paffmz.png', name: '女仆装-半开门探出身体眼神躲闪', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/5myhfa.png', name: '女仆装-半开门探出身体眼神躲闪害羞', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/9huleh.png', name: '女仆装-半开门探出身体眼神躲闪惊讶', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/y7e0q8.png', name: '女仆装-半开门探出身体用手臂遮住乳头闭眼张嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/fesnvu.png', name: '女仆装-半开门探出身体用手臂遮住乳头小张嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/brnrgy.png', name: '女仆装-半开门探出身体用手臂遮住乳头笑', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/6imv67.png', name: '女仆装-半开门探出身体张嘴笑', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/arwh1y.png', name: '女仆装-半开门探出身体嘴部阴毛向上看', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/h98dew.png', name: '女仆装-半开门探出身体嘴部阴毛眼神躲闪', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/u00wvo.png', name: '女仆装-半开门探出身体嘴部阴毛张嘴', category: 'CG', type: 'image' });
      // 女仆装早晨系列（资源名称格式：组名-CG名称）
      assets.push({ url: 'https://files.catbox.moe/jmpcry.png', name: '女仆装早晨-半开门探出身体小张嘴笑', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/rogbgv.png', name: '女仆装早晨-半开门探出身体心形眼颤抖', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/57jwoa.png', name: '女仆装早晨-半开门探出身体心形眼翻白眼高潮', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/7qzrld.png', name: '女仆装早晨-半开门探出身体眼神躲闪', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/baxz7a.png', name: '女仆装早晨-半开门探出身体眼神躲闪嘟嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/3pa9n9.png', name: '女仆装早晨-半开门探出身体眼神躲闪小张嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/zctz14.png', name: '女仆装早晨-半开门探出身体眼神躲闪张嘴笑', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/iftpio.png', name: '女仆装早晨-半开门探出身体张嘴笑', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/9q2ewq.png', name: '女仆装早晨-半开门探出身体闭眼张嘴高潮', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/pjgsz1.png', name: '女仆装早晨-半开门探出身体闭嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/odqh8t.png', name: '女仆装早晨-半开门探出身体咧嘴笑', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/utj509.png', name: '女仆装早晨-半开门探出身体抿嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/rivxke.png', name: '女仆装早晨-半开门探出身体抿嘴皱眉', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/jv7d6b.png', name: '女仆装早晨-半开门探出身体撇嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/exjh9u.png', name: '女仆装早晨-半开门探出身体平静', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/0pbp5m.png', name: '女仆装早晨-半开门探出身体微笑', category: 'CG', type: 'image' });
      // 早晨系列（资源名称格式：组名-CG名称）
      assets.push({ url: 'https://files.catbox.moe/uvuvd4.png', name: '早晨-半开门探出身体全裸惊讶用手臂遮住乳头', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/6sowym.png', name: '早晨-半开门探出身体全裸眯眼', category: 'CG', type: 'image' });
      // 浴室系列（资源名称格式：组名-CG名称）
      assets.push({ url: 'https://files.catbox.moe/t6zoeu.png', name: '浴室-开门露出乳头拔出手指淫液拉丝', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/qmqlhf.png', name: '浴室-开门露出乳头被拽乳头往后看张嘴被抠小穴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/aim2j3.png', name: '浴室-开门露出乳头被拽乳头往后看张嘴被抠小穴高潮', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/hxjcfv.png', name: '浴室-半开门探出上半身露出乳头闭眼抿嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/imzh14.png', name: '浴室-半开门探出上半身露出乳头张嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/3evydi.png', name: '浴室-半开门探出上半身抿嘴抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/9jvxi7.png', name: '浴室-半开门探出上半身撇嘴抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/5q58z4.png', name: '浴室-半开门探出上半身手臂遮住乳头抿嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/6mc1y8.png', name: '浴室-半开门探出上半身手臂遮住乳头笑', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/3nn7y3.png', name: '浴室-半开门探出上半身手臂遮住乳头眼神躲闪抿嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/shbyzx.png', name: '浴室-半开门探出上半身心形眼咬牙抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/i9mke8.png', name: '浴室-半开门探出上半身张嘴抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/maji6k.png', name: '浴室-半开门探出上半身张嘴娇喘心形眼翻白眼抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/r0h8uk.png', name: '浴室-半开门探出上半身张嘴眼神躲闪抽插', category: 'CG', type: 'image' });
      // 浴室透视系列（资源名称格式：组名-CG名称）
      assets.push({ url: 'https://files.catbox.moe/eudvrq.png', name: '浴室透视-隔着门露出乳头心形眼翻白眼张嘴抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/t182wb.png', name: '浴室透视-隔着门露出乳头心形眼张嘴抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/3wfqnf.png', name: '浴室透视-隔着门露出乳头眼睛躲闪闭嘴被揉胸', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/qukjca.png', name: '浴室透视-隔着门趴在门上', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/yyyueg.png', name: '浴室透视-隔着门全裸心形眼闭嘴往后看中出精液溢出', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/8cjs4w.png', name: '浴室透视-隔着门全裸心形眼翻白眼大张嘴吐舌淫叫抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/e7rw43.png', name: '浴室透视-隔着门全裸心形眼翻白眼咬牙淫叫被拽乳头中出', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/05f51t.png', name: '浴室透视-隔着门全裸心形眼张嘴精液溢出肉棒打屁股', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ak536s.png', name: '浴室透视-隔着门全裸心形眼张嘴淫叫精液溢出抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/a2xok5.png', name: '浴室透视-隔着门自己捂嘴露出乳头抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/hpyfpf.png', name: '浴室透视-隔着门露出乳头被拽乳头往后看捂嘴被抠小穴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/enwehz.png', name: '浴室透视-隔着门露出乳头被拽乳头捂嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/w4bpx7.png', name: '浴室透视-隔着门露出乳头被拽乳头眼睛往后看闭嘴生气', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/a69u8m.png', name: '浴室透视-隔着门露出乳头被拽乳头眼神无光捂嘴被抠小穴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/7ll4ua.png', name: '浴室透视-隔着门露出乳头闭眼张嘴抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ayqtqd.png', name: '浴室透视-隔着门露出乳头惊讶往后看被揉胸', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/yhb28g.png', name: '浴室透视-隔着门露出乳头心形眼闭嘴抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/p4batn.png', name: '浴室透视-隔着门露出乳头心形眼翻白眼大张嘴抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/jmx6rc.png', name: '浴室透视-隔着门露出乳头心形眼翻白眼大张嘴吐舌抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/y4cbw8.png', name: '浴室透视-半开门探出上半身露出乳头闭眼抿嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/gsd4n9.png', name: '浴室透视-半开门探出上半身露出乳头张嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/tmwckb.png', name: '浴室透视-半开门探出上半身抿嘴抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ilx312.png', name: '浴室透视-半开门探出上半身撇嘴抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/eb8xm2.png', name: '浴室透视-半开门探出上半身手臂遮住乳头抿嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/7zmky5.png', name: '浴室透视-半开门探出上半身手臂遮住乳头笑', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/u2p4i6.png', name: '浴室透视-半开门探出上半身手臂遮住乳头眼神躲闪抿嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/4h8qos.png', name: '浴室透视-半开门探出上半身心形眼咬牙抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/tha7xq.png', name: '浴室透视-半开门探出上半身张嘴抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/taeuil.png', name: '浴室透视-半开门探出上半身张嘴娇喘心形眼翻白眼抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/un2r5m.png', name: '浴室透视-半开门探出上半身张嘴眼神躲闪抽插', category: 'CG', type: 'image' });
      // 常服系列（资源名称格式：组名-CG名称）
      assets.push({ url: 'https://files.catbox.moe/740v4n.png', name: '常服-半开门探出上半身嘴角阴毛抿嘴眼神躲闪', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/co3muy.png', name: '常服-半开门探出上半身嘴角阴毛撇嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/vttzut.png', name: '常服-半开门探出上半身嘴角阴毛笑', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ra80of.png', name: '常服-半开门探出上半身嘴角阴毛眼神躲闪', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/h06uxu.png', name: '常服-半开门探出上半身抿嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/30qkxr.png', name: '常服-半开门探出上半身抿嘴笑', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/8whuzk.png', name: '常服-半开门探出上半身抿嘴笑往后看', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/g67sd2.png', name: '常服-半开门探出上半身撇嘴往后看', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/r53uyx.png', name: '常服-半开门探出上半身往后看小张嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ckvcx4.png', name: '常服-半开门探出上半身眼睛睁大惊讶', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ydf9at.png', name: '常服-半开门探出上半身眼神躲闪', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/m84qww.png', name: '常服-半开门探出上半身嘴角阴毛', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/povo4b.png', name: '常服-半开门探出上半身嘴角阴毛大张嘴闭眼', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/pg0qiy.png', name: '常服-半开门探出上半身嘴角阴毛抿嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/uj2bmo.png', name: '常服-半开门探出上身闭眼闭嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/73bmg2.png', name: '常服-半开门探出上身高兴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/n4xjap.png', name: '常服-半开门探出上身脸红', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/mbjos5.png', name: '常服-半开门探出上身抿嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/67v582.png', name: '常服-半开门探出上身往上看小张嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/yz5g5k.png', name: '常服-半开门探出上身往上看笑', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/knqqup.png', name: '常服-半开门探出上身笑', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/l4ir9d.png', name: '常服-半开门探出上身眼睛躲闪', category: 'CG', type: 'image' });
      // 通用门外视角系列（资源名称格式：组名-CG名称）
      assets.push({ url: 'https://files.catbox.moe/0eawea.png', name: '通用门外视角-铁门外无声', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/d6zssj.png', name: '通用门外视角-铁门外淫叫', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/3p1ct9.png', name: '通用门外视角-木门外无声', category: 'CG', type: 'image' });
      // 常服透视系列（资源名称格式：组名-CG名称）
      assets.push({ url: 'https://files.catbox.moe/bu6izc.png', name: '常服透视-隔着门胸部露出张大嘴吐舌头抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/2j5v65.png', name: '常服透视-隔着门胸部露出张大嘴往后看抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/pvwe7z.png', name: '常服透视-隔着门咬牙中出心形眼翻白眼', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/8389af.png', name: '常服透视-隔着门张大嘴娇喘插入', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/684n4l.png', name: '常服透视-隔着门张大嘴娇喘抽插心形眼', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/fvi2ez.png', name: '常服透视-隔着门往后看惊讶肉棒顶着屁股', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/xc9jq9.png', name: '常服透视-隔着门往后看撇嘴生气肉棒顶着屁股', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/rx3jxw.png', name: '常服透视-隔着门心形眼中出后', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/pr6o0r.png', name: '常服透视-隔着门胸部露出张大嘴抽插', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ei03kv.png', name: '常服透视-半开门探出上半身抿嘴', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/g8yrul.png', name: '常服透视-半开门探出上半身抿嘴笑往后看', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/9prqsd.png', name: '常服透视-半开门探出上半身撇嘴往后看', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/f0fo7u.png', name: '常服透视-半开门探出上半身往后看小张嘴肉棒顶着屁股', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/q6lf5v.png', name: '常服透视-半开门探出上半身眼睛睁大往后看肉棒顶着屁股', category: 'CG', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/o7zzmb.png', name: '常服透视-半开门探出上半身眼神躲闪小张嘴肉棒顶着屁股', category: 'CG', type: 'image' });

      // 时间+天气系统图片
      assets.push({ url: 'https://files.catbox.moe/g2x21l.png', name: 'Afternoon', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/p326lj.png', name: 'Midnight', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/m3l95j.png', name: 'Morning', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/1iepv7.png', name: 'Night', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/xnzc7c.png', name: 'Noon', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/d555se.png', name: 'rainDay', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/s66j1n.png', name: 'rainNight', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/t34ltk.png', name: 'LeftCover', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/buwqmc.png', name: 'TimeBack', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/exeh4l.png', name: 'Message_name', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/87622v.png', name: 'Message_Under', category: '系统', type: 'image' });

      // 游戏界面UI资源
      assets.push({ url: 'https://files.catbox.moe/ogteua.png', name: '菜单界面背景', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/gdyovq.png', name: '菜单界面前景边框', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/eu5cai.png', name: '金币背景框', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/knxts0.png', name: '堕落值变量条', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/40v6og.png', name: '性欲值变量条', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/dtbqcz.png', name: 'Intro遮罩背景', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/e5v3lc.png', name: '设置界面背景', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/hkgfil.png', name: '关闭按钮', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/8b71o8.png', name: '按钮通用背景', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/9kmauu.png', name: '存档项背景', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/j17ccs.png', name: '加载Logo', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/wj2c68.png', name: '全屏按钮', category: '系统', type: 'image' });

      // 系统资源（原CG资源）
      assets.push({ url: 'https://files.catbox.moe/z8wdof.png', name: '对话背景', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/0o6yij.png', name: 'CG画框', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/wcejcp.jpg', name: '纯爱路线', category: '系统', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/s0how3.jpg', name: '游戏路线', category: '系统', type: 'image' });

      // 背景资源
      assets.push({ url: 'https://files.catbox.moe/dswunx.png', name: '白天露天废墟', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/qj6dcy.png', name: '白天露天长廊', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/y4spym.png', name: '草地', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/uzpt5x.png', name: '草地小路', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/el5ch1.png', name: '打开大门传送门走廊', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/mevkx3.png', name: '地下建筑内', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/rlv186.png', name: '毒沼泽', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/f9yq6v.png', name: '废墟', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/wp1iky.png', name: '关闭大门走廊', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/7pzktn.png', name: '旱地', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/2arfp5.png', name: '黑暗洞穴', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/myr71d.png', name: '黑森林', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ltnpnb.png', name: '荒地', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/fwuzgm.png', name: '荒芜草地', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/zyu55x.png', name: '黄昏露天长廊', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/o3rikj.png', name: '集市', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/35n6q8.png', name: '建筑内', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ylkodm.png', name: '矿坑', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/lx6625.png', name: '矿坑2', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/ec996u.png', name: '矿坑3', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/g5834r.png', name: '魔界废土', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/lcuxzp.png', name: '木地板', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/np1np8.png', name: '熔岩地', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/8odtak.png', name: '沙漠', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/cc3k6f.png', name: '山路', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/dpbk63.png', name: '石制室内', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/37b3nb.png', name: '石制室内2', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/gungox.png', name: '树林小路', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/x2zkz3.png', name: '透光矿坑', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/crmevj.png', name: '晚上露天长廊', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/xwhu4i.png', name: '小镇路', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/cvh6io.png', name: '雪地', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/woqe7c.png', name: '岩浆地', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/rutz1i.png', name: '依山小路', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/bwwhmr.png', name: '阴天露天废墟', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/arv06v.png', name: '矿坑4', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/x73t54.png', name: '林中小径', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/g4auhb.png', name: '迷雾废墟', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/yec24e.png', name: '迷雾黑森林', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/wq3zhj.png', name: '明亮洞穴', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/hd5ruw.png', name: '荧光路', category: '背景', type: 'image' });
      assets.push({ url: 'https://files.catbox.moe/54ar1p.png', name: '云上', category: '背景', type: 'image' });

      return assets;
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

      console.log(`资源列表已初始化，共 ${allResources.length} 个资源`);
    }

    // 全局loadImage函数（供设置界面使用）
    async function loadImageGlobal(url, assetName, assetId) {
      try {
        const storageKey = `img_${assetId}`;
        let imageSrc = url;

        // SVG文件跳过IndexedDB缓存，直接使用原始URL
        if (storageUtils.isSVG(url)) {
          imageSrc = url;
        } else {
          // 尝试从IndexedDB加载
          try {
            const db = await storageUtils.initDB();
            const transaction = db.transaction([storageUtils.storeName], 'readonly');
            const store = transaction.objectStore(storageUtils.storeName);
            const cached = await new Promise((resolve) => {
              const request = store.get(storageKey);
              request.onsuccess = () => resolve(request.result);
              request.onerror = () => resolve(null);
            });

            if (cached && cached.startsWith('data:')) {
              imageSrc = cached;
            } else {
              // 保存到IndexedDB
              imageSrc = await storageUtils.saveImageToStorage(url, storageKey);
            }
          } catch (error) {
            console.warn('从IndexedDB加载失败，使用原始URL:', error);
            imageSrc = url;
          }
        }

        return new Promise((resolve) => {
          const img = new Image();
          // SVG文件不设置crossOrigin，避免CORS错误
          if (!storageUtils.isSVG(url)) {
            img.crossOrigin = 'anonymous';
          }

          img.onload = () => {
            // 更新资源状态
            const resource = allResources.find(r => r.id === assetId);
            if (resource) {
              resource.loaded = true;
              resource.failed = false;
            }
            resolve(true);
          };
          img.onerror = () => {
            console.warn(`图片资源加载失败: ${url}`);
            const resource = allResources.find(r => r.id === assetId);
            if (resource) {
              resource.loaded = false;
              resource.failed = true;
            }
            resolve(false);
          };
          if (typeof setMediaSrcWithFallback === 'function' && MeishinkanAssets?.isCatboxUrl?.(url)) {
            setMediaSrcWithFallback(img, url);
          } else if (imageSrc.startsWith('data:') || !/^https?:/i.test(imageSrc)) {
            img.src = imageSrc;
          } else if (typeof setMediaSrcWithFallback === 'function') {
            const catbox = MeishinkanAssets.toCatboxUrl(imageSrc);
            MeishinkanAssets.isCatboxUrl(catbox)
              ? setMediaSrcWithFallback(img, catbox)
              : (img.src = imageSrc);
          } else {
            img.src = imageSrc;
          }
        });
      } catch (error) {
        console.warn(`加载图片失败: ${url}`, error);
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

        const probeContentLength = async (url) => {
          if (!url) return 0;
          const fetchFn = (init) => (
            typeof fetchAsset === 'function' && MeishinkanAssets?.isCatboxUrl?.(url)
              ? fetchAsset(url, init)
              : fetch(url, init)
          );
          try {
            const head = await fetchFn({ method: 'HEAD', mode: 'cors' });
            const headLen = parseInt(head.headers.get('content-length') || '', 10);
            if (head.ok && Number.isFinite(headLen) && headLen > 0) return headLen;
          } catch (_) { /* HEAD 不可用时改试 Range */ }
          const controller = new AbortController();
          try {
            const ranged = await fetchFn({
              method: 'GET',
              mode: 'cors',
              headers: { Range: 'bytes=0-0' },
              signal: controller.signal
            });
            const cr = ranged.headers.get('content-range');
            const m = cr && /\/(\d+)\s*$/.exec(cr);
            if (m) return parseInt(m[1], 10);
            const len = parseInt(ranged.headers.get('content-length') || '', 10);
            if (Number.isFinite(len) && len > 0) return len;
          } catch (_) { /* 探测失败则交给实际下载体积 */ }
          finally {
            controller.abort();
          }
          return 0;
        };

        (async () => {
          const queue = assets.slice();
          const workers = Array.from({ length: Math.min(8, queue.length) }, async () => {
            while (queue.length) {
              const asset = queue.shift();
              if (!asset || sizeByUrl.has(asset.url)) continue;
              const n = await probeContentLength(asset.url);
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

        // 加载视频资源
        const loadVideo = (url, assetName) => {
          return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.preload = 'auto';
            video.oncanplaythrough = () => resolve({ ok: true, bytes: sizeByUrl.get(url) || 0 });
            video.onerror = () => {
              console.warn(`视频资源加载失败: ${url}`);
              failedAssets.push(assetName);
              resolve({ ok: false, bytes: 0 });
            };
            if (typeof setMediaSrcWithFallback === 'function' && MeishinkanAssets?.isCatboxUrl?.(url)) {
              setMediaSrcWithFallback(video, url);
            } else {
              video.src = url;
            }
          });
        };

        // 加载图片资源（使用IndexedDB）
        const loadImage = async (url, assetName, assetId) => {
          try {
            const storageKey = `img_${assetId}`;
            let imageSrc = url;
            let measured = 0;

            // SVG文件跳过IndexedDB缓存，直接使用原始URL
            if (storageUtils.isSVG(url)) {
              imageSrc = url;
            } else {
              // 尝试从IndexedDB加载
              try {
                const db = await storageUtils.initDB();
                const transaction = db.transaction([storageUtils.storeName], 'readonly');
                const store = transaction.objectStore(storageUtils.storeName);
                const cached = await new Promise((resolve) => {
                  const request = store.get(storageKey);
                  request.onsuccess = () => resolve(request.result);
                  request.onerror = () => resolve(null);
                });

                if (cached && cached.startsWith('data:')) {
                  imageSrc = cached;
                  measured = dataUrlBytes(cached);
                } else {
                  // 保存到IndexedDB
                  imageSrc = await storageUtils.saveImageToStorage(url, storageKey);
                  measured = dataUrlBytes(imageSrc);
                }
              } catch (error) {
                console.warn('从IndexedDB加载失败，使用原始URL:', error);
                imageSrc = url;
              }
            }

            return new Promise((resolve) => {
              const img = new Image();
              // SVG文件不设置crossOrigin，避免CORS错误
              if (!storageUtils.isSVG(url)) {
                img.crossOrigin = 'anonymous';
              }

              img.onload = () => {
                // 更新资源状态
                const resource = allResources.find(r => r.id === assetId);
                if (resource) resource.loaded = true;
                resolve({ ok: true, bytes: measured || sizeByUrl.get(url) || 0 });
              };
              img.onerror = () => {
                console.warn(`图片资源加载失败: ${url}`);
                failedAssets.push(assetName);
                const resource = allResources.find(r => r.id === assetId);
                if (resource) {
                  resource.loaded = false;
                  resource.failed = true;
                }
                resolve({ ok: false, bytes: 0 });
              };
              if (typeof setMediaSrcWithFallback === 'function' && MeishinkanAssets?.isCatboxUrl?.(url)) {
                setMediaSrcWithFallback(img, url);
              } else if (imageSrc.startsWith('data:') || !/^https?:/i.test(imageSrc)) {
                img.src = imageSrc;
              } else if (typeof setMediaSrcWithFallback === 'function') {
                const catbox = MeishinkanAssets.toCatboxUrl(imageSrc);
                MeishinkanAssets.isCatboxUrl(catbox)
                  ? setMediaSrcWithFallback(img, catbox)
                  : (img.src = imageSrc);
              } else {
                img.src = imageSrc;
              }
            });
          } catch (error) {
            console.warn(`加载图片失败: ${url}`, error);
            failedAssets.push(assetName);
            const resource = allResources.find(r => r.id === assetId);
            if (resource) {
              resource.loaded = false;
              resource.failed = true;
            }
            return { ok: false, bytes: 0 };
          }
        };

        // 依次加载资源
        (async () => {
          for (const asset of assets) {
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
        })();

        // 超时保护（30秒）
        setTimeout(() => {
          if (loaded < total) {
            console.warn('部分资源加载超时，继续进入游戏');
            loadingScreen.classList.add('hidden');
            resolve();
          }
        }, 30000);
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
      console.log(`渲染 ${category} 资源列表:`, categoryResources.length, '个资源'); // 调试信息

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

        console.log('开始拖拽:', { startY, startScrollTop }); // 调试信息
        e.preventDefault();
      };

      // 拖拽移动
      const drag = (e) => {
        if (!isDragging) return;

        const deltaY = e.clientY - startY;
        const newScrollTop = startScrollTop - deltaY;

        // 边界检查
        const maxScroll = itemsContainer.scrollHeight - itemsContainer.clientHeight;
        console.log('拖拽中:', {
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

        console.log('调整容器高度:', {
          contentHeight,
          maxAllowedHeight,
          containerHeight: itemsContainer.clientHeight,
          scrollHeight: itemsContainer.scrollHeight
        });

        if (contentHeight <= maxAllowedHeight) {
          // 内容不超出限制，设置为auto高度
          itemsContainer.style.maxHeight = 'none';
          itemsContainer.style.height = 'auto';
          console.log('内容高度正常，无需滚动，设置为auto高度');
        } else {
          // 内容超出，限制高度并启用滚动
          itemsContainer.style.maxHeight = `${maxAllowedHeight}px`;
          itemsContainer.style.height = `${maxAllowedHeight}px`;
          console.log('内容超出，限制高度并启用滚动:', maxAllowedHeight);
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
          console.warn('加载文本格式设置失败:', e);
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
            varsSnapshot: layer.varsSnapshot || layer.mvuData, // 兼容旧数据
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
            varsSnapshot: layer.varsSnapshot || layer.mvuData, // 兼容旧数据
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
        const varsSnapshot = layer.varsSnapshot || layer.mvuData || null;
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
        console.log('[LOAD] ========== 开始读档 ==========');
        console.log('[LOAD] 存档名称:', archiveName);

        // 从IndexedDB加载存档
        const archive = await storageUtils.archivesDB.loadArchive(archiveName);
        if (!archive || !archive.data) {
          console.error('[LOAD] ❌ 存档不存在或已损坏');
          showArchiveNotification('存档不存在或已损坏', 'error');
          return;
        }

        const archiveData = archive.data;
        console.log('[LOAD] 存档数据加载成功');

        // 恢复路线信息（如果存在）
        if (archiveData.routeTitle) {
          isLoveRouteStart = archiveData.routeTitle === '纯爱路线';
          console.log('[LOAD] 路线信息:', archiveData.routeTitle);
        }

        // 先初始化游戏界面（确保所有DOM元素都已创建）
        console.log('[LOAD] 初始化游戏界面...');
        // 设置读档标志，阻止 initGameInterface 显示预设对话
        window._isLoadingArchive = true;
        await initGameInterface();
        window._isLoadingArchive = false;
        console.log('[LOAD] ✅ 游戏界面初始化完成');

        // 兼容旧存档格式（dialogueHistory）和新格式（dialogueLayers）
        let dialogueLayersFromArchive = [];
        if (archiveData.dialogueLayers && archiveData.dialogueLayers.length > 0) {
          // 新格式：使用对话层
          dialogueLayersFromArchive = archiveData.dialogueLayers;
          currentDialogueLayer = archiveData.currentDialogueLayer || 0;
          console.log('[LOAD] 使用新格式，对话层数量:', dialogueLayersFromArchive.length);
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
          console.log('[LOAD] 使用旧格式，已转换，对话层数量:', dialogueLayersFromArchive.length);
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
        console.log('[LOAD] ✅ 已加载', dialogueLayers.length, '个对话层到内存');

        // 打印所有对话层信息（用于调试）
        console.log('[LOAD] 所有对话层信息:');
        dialogueLayers.forEach(layer => {
          if (layer.type !== 'player' && layer.layer % 2 === 1) {
            const round = Math.floor((layer.layer + 1) / 2);
            console.log(`  - 层 ${layer.layer} (第${round}轮): 内容长度 ${layer.maintext ? layer.maintext.length : 0}`);
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
        console.log('[LOAD] ✅ 找到最后一轮对话:');
        console.log('[LOAD]   - 对话层:', lastLayer.layer);
        console.log('[LOAD]   - 对话轮次:', lastRound);
        console.log('[LOAD]   - 内容长度:', lastLayer.maintext ? lastLayer.maintext.length : 0);

        // 更新界面：加载最后对话层的内容
        if (lastLayer.maintext) {
          // 提前设置标志，防止其他代码覆盖对话
          window._isLoadingArchiveDialogue = true;
          console.log('[LOAD] 已设置读档保护标志');

          console.log('[LOAD] 开始解析对话文本...');
          // 解析对话
          const dialogues = parseTolinaDialogues(lastLayer.maintext);
          console.log('[LOAD] ✅ 解析完成，共', dialogues.length, '段对话');

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
                  console.log(`[LOAD] [CG] 恢复CG状态: ${dialogue.cg.groupName} - ${dialogue.cg.cgName}`);
                  break;
                } else if (dialogue.cg && dialogue.cg.isStop) {
                  // 如果遇到stop标签，清除该CG组的状态
                  delete cgState[dialogue.cg.groupName];
                  console.log(`[LOAD] [CG] 清除CG组: ${dialogue.cg.groupName}`);
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

          console.log('[LOAD] 开始显示对话，索引:', startIdx);
          await showDialogue(startIdx);
          console.log('[LOAD] ✅ 已显示对话，当前索引:', currentDialogueIndex);
          console.log('[LOAD] 当前对话总数:', currentDialogues.length);

          // 延迟多次检查，确保显示不被覆盖
          const checkAndRestoreDialogue = async () => {
            if (window._isLoadingArchiveDialogue && currentDialogues.length > 0) {
              const dialogueText = document.querySelector('.dialogue-text');
              const expected = currentDialogues[currentDialogueIndex] || currentDialogues[0];
              const expectedText = expected && expected.dialogue;

              if (dialogueText && expectedText && dialogueText.textContent !== expectedText) {
                console.log('[LOAD] ⚠️ 检测到对话内容被改变，恢复存档对话');
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
            console.log('[LOAD] ✅ 读档对话显示完成，解除保护');
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
                console.log('[LOAD] 对话已显示完毕，显示分支选项');
                updateBranches(lastLayer.branches);
              } else {
                // 如果还在对话中，设置待显示的分支文本，等待用户点击完所有对话
                console.log('[LOAD] 对话未显示完毕，设置待显示的分支文本');
                pendingBranchesText = lastLayer.branches;
              }
            } else {
              updateBranches('');
            }
          }, 300);
        } else {
          console.warn('[LOAD] ⚠️ 最后一轮对话没有文本内容');
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
        const varsToRestore = lastLayer.varsSnapshot || lastLayer.mvuData?.stat_data || lastLayer.mvuData;

        if (varsToRestore) {
          migrateLegacyHstateTree(varsToRestore);
          if (lastLayer.requestFlags) adoptRequestFlags(lastLayer.requestFlags);
          recomputeDerivedHstateFields(varsToRestore);
          console.log('[LOAD] 开始恢复变量快照...');
          try {
            // 使用 ERA 的 insertByObject 恢复变量（完全替换）
            ERA.insertByObject(varsToRestore);
            // 同时更新 ERA 缓存
            ERA.cache.vars = varsToRestore;
            ERA.cache.timestamp = Date.now();
            ERA.currentVars = varsToRestore;
            console.log('[LOAD] ✅ 变量快照已通过 ERA 恢复');
          } catch (eraError) {
            console.error('[LOAD] ❌ ERA 恢复失败:', eraError);
          }
        } else if (lastLayer.variables) {
          // 如果没有变量快照，尝试使用 variables 字段
          try {
            await updateVariables(lastLayer.variables);
            console.log('[LOAD] ✅ 已从 variables 字段恢复变量');
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

        console.log('[LOAD] ========== 读档完成 ==========');
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

      if (layer.varsSnapshot) {
        migrateLegacyHstateTree(layer.varsSnapshot);
        try {
          ERA.insertByObject(layer.varsSnapshot);
          ERA.cache.vars = layer.varsSnapshot;
          ERA.cache.timestamp = Date.now();
          ERA.currentVars = layer.varsSnapshot;
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

        console.log('[QUEST] 获取到的对话层:', lastLayer);
        console.log('[QUEST] dialogueLayers 总数:', dialogueLayers.length);

        if (!lastLayer && dialogueLayers.length === 0) {
          console.warn('[QUEST] 没有找到对话层');
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
              if (!checkIfInIframe() || !checkTavernHelper()) {
                throw new Error('SillyTavern环境检查失败');
              }

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
              await updateMainText(`发送失败：${error.message}\n请重试或检查SillyTavern连接。`);
            }
          };

          let branchesText = lastLayer ? lastLayer.branches : null;
          if (!branchesText || !branchesText.trim()) {
            if (typeof pendingBranchesText !== 'undefined' && pendingBranchesText && pendingBranchesText.trim()) {
              branchesText = pendingBranchesText;
            } else {
              const emptyMessage = document.createElement('div');
              emptyMessage.className = 'quest-empty-msg';
              emptyMessage.textContent = '当前没有行动选项';
              contentContainer.appendChild(emptyMessage);
              return;
            }
          }

          mountBranchActionUI(contentContainer, branchesText, sendChoiceToAI);
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
          console.log('[QUEST] 解析到的对话数量:', dialogues.length);
          console.log('[QUEST] 对话内容:', dialogues);

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
                console.warn('[QUEST] 渲染立绘失败:', err);
              });

              frameContainer.appendChild(spriteContainer);

              const dialogueText = document.createElement('div');
              dialogueText.className = 'quest-dialogue-text';
              dialogueText.textContent = dialogue.dialogue || '';

              messageEntry.appendChild(frameContainer);
              messageEntry.appendChild(dialogueText);
              target.appendChild(messageEntry);
            });
            console.log('[QUEST] 已快速显示', dialogues.length, '条对话，立绘正在异步加载');
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
                  console.log(`[JUMP] 开始跳转到层 ${layer.layer}`);
                  await jumpToDialogueLayer(layer);

                  // 关闭确认弹窗
                  confirmOverlay.remove();

                  // 关闭历史对话层弹窗
                  const questOverlay = document.getElementById('current-dialogue-overlay');
                  if (questOverlay) {
                    questOverlay.remove();
                  }

                  console.log('[JUMP] ✅ 跳转完成');
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

        console.log('[QUEST] 历史消息弹窗已创建');
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
      console.log('[菜单] 更新托莉娜立绘，元素:', torinaSprite);
      if (!torinaSprite) {
        console.warn('[菜单] 托莉娜立绘元素不存在');
        return;
      }

      try {
        // 当前运行时值就是最后对话层快照，所以直接使用 ERA.currentVars 或最后对话层快照
        const lastLayer = getLastDialogueLayer();
        let varsSnapshot = null;

        if (lastLayer && lastLayer.varsSnapshot) {
          // 优先使用最后对话层的快照（它应该就是 ERA.currentVars）
          varsSnapshot = lastLayer.varsSnapshot;
          console.log('[菜单] 使用最后对话层快照（当前运行时值）');
        } else if (ERA.currentVars) {
          // 如果没有对话层，使用 ERA.currentVars
          varsSnapshot = ERA.currentVars;
          console.log('[菜单] 使用 ERA.currentVars（当前运行时值）');
        } else {
          // 如果都没有，使用 getvar 获取（会尝试从 ERA 查询）
          const stage = await getvar('stat_data.托莉娜.基础.堕落阶段');
          const stageNum = parseInt(stage, 10) || 1;
          console.log('[菜单] 从 getvar 获取阶段:', stageNum);
          updateTorinaSpriteByStage(torinaSprite, stageNum);
          return;
        }

        // 从变量快照中获取阶段
        // varsSnapshot 的结构是 { 托莉娜: { 基础: { 堕落阶段: 4 } } }（不包含 stat_data 前缀）
        const stage = getNestedValue(varsSnapshot, '托莉娜.基础.堕落阶段');
        const stageNum = parseInt(stage, 10) || 1;
        console.log('[菜单] 从当前运行时值获取阶段:', stage, '->', stageNum);

        updateTorinaSpriteByStage(torinaSprite, stageNum);
      } catch (error) {
        console.warn('[菜单] 获取托莉娜阶段失败，使用默认立绘:', error);
        // 使用默认阶段1的图片
        updateTorinaSpriteByStage(torinaSprite, 1);
      }
    }

      // ==================== Hstatus表界面 ====================
      const HSTATUS_ASSETS = {
        outerBg: 'https://files.catbox.moe/3jrv5v.png',
        outerMain: 'https://files.catbox.moe/iaar1p.png',
        outerHighlight: 'https://files.catbox.moe/e7e84g.png',
        frame: 'https://files.catbox.moe/lht9hm.png',
        innerBg: 'https://files.catbox.moe/92wfb8.png',
        innerFg: 'https://files.catbox.moe/lbxw3t.png',
        innerHighlight: 'https://files.catbox.moe/dm2rck.png',
        cursor: 'https://files.catbox.moe/dgdqmk.png',
        exitBtn: 'https://files.catbox.moe/fcyjir.png',
      };

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
            const snap = (lastLayer && lastLayer.varsSnapshot)
              ? lastLayer.varsSnapshot
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
          const snap = (lastLayer && lastLayer.varsSnapshot)
            ? lastLayer.varsSnapshot
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
          console.log(`[Hstatus] ${goingInner ? '进入里' : '返回表'}${hstatusViewMode}界面`);
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
          console.log('[Hstatus] 进入纯爱头部界面');
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
            console.log('[Hstatus] 返回纯爱主界面');
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
          console.log('[Hstatus] 进入纯爱胸部界面');
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
            console.log('[Hstatus] 返回纯爱主界面');
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
            console.log('[Hstatus] 进入阴部界面');
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
              console.log('[Hstatus] 返回胸部界面');
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
              console.log('[Hstatus] 从阴部返回纯爱主界面');
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
        cursorUpMain.src = 'https://files.catbox.moe/dgdqmk.png';
        cursorUpMain.alt = '指向箭头（向上）';

        // 创建向下箭头（下方正中）- 进入纯爱胸部界面
        const cursorDown = document.createElement('img');
        cursorDown.className = 'hstatus-cursor-down';
        cursorDown.id = 'hstatus-cursor-down';
        cursorDown.src = 'https://files.catbox.moe/dgdqmk.png';
        cursorDown.alt = '指向箭头（下方）';

        // 创建向右箭头（右侧正中，逆时针旋转90度）
        const cursorRight = document.createElement('img');
        cursorRight.className = 'hstatus-cursor-right';
        cursorRight.id = 'hstatus-cursor-right';
        cursorRight.src = 'https://files.catbox.moe/dgdqmk.png';
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
        console.log('[Hstatus] 返回纯爱主界面');
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
        cursorDown.src = 'https://files.catbox.moe/dgdqmk.png';
        cursorDown.alt = '指向箭头（下方）';

        // 创建向右箭头（右侧正中，逆时针旋转90度）
        const cursorRightHead = document.createElement('img');
        cursorRightHead.className = 'hstatus-cursor-right';
        cursorRightHead.id = 'hstatus-cursor-right-head';
        cursorRightHead.src = 'https://files.catbox.moe/dgdqmk.png';
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
        cursorUp.src = 'https://files.catbox.moe/dgdqmk.png';
        cursorUp.alt = '指向箭头（向上）';

        // 创建向下箭头（下方正中）- 进入纯爱足部界面
        const cursorDownChest = document.createElement('img');
        cursorDownChest.className = 'hstatus-cursor-down';
        cursorDownChest.id = 'hstatus-cursor-down-chest';
        cursorDownChest.src = 'https://files.catbox.moe/dgdqmk.png';
        cursorDownChest.alt = '指向箭头（下方）';

        // 创建向右箭头（右侧正中，逆时针旋转90度）
        const cursorRightSub = document.createElement('img');
        cursorRightSub.className = 'hstatus-cursor-right';
        cursorRightSub.id = 'hstatus-cursor-right-sub';
        cursorRightSub.src = 'https://files.catbox.moe/dgdqmk.png';
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
        cursorUp.src = 'https://files.catbox.moe/dgdqmk.png';
        cursorUp.alt = '指向箭头（向上）';

        const cursorRightCrotch = document.createElement('img');
        cursorRightCrotch.className = 'hstatus-cursor-right';
        cursorRightCrotch.id = 'hstatus-cursor-right-crotch';
        cursorRightCrotch.src = 'https://files.catbox.moe/dgdqmk.png';
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
        cursorUp.src = 'https://files.catbox.moe/dgdqmk.png';
        cursorUp.alt = '指向箭头（向上）';

        // 创建向右箭头（右侧正中，逆时针旋转90度）
        const cursorRightFoot = document.createElement('img');
        cursorRightFoot.className = 'hstatus-cursor-right';
        cursorRightFoot.id = 'hstatus-cursor-right-foot';
        cursorRightFoot.src = 'https://files.catbox.moe/dgdqmk.png';
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
            console.log('[Hstatus] 进入纯爱胸部界面');
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
              console.log('[Hstatus] 进入纯爱胸部界面（滑动）');
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

      console.log('[Hstatus] Hstatus表界面已打开');
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
        console.log('[Hstatus] Hstatus表界面已关闭');
      }
    }

    // 根据精液状态变量更新 Hstatus 精液叠加层（阈值 5 和 30：<5 不显示，5-30 Little，>30 Much；层级低于服装，不参与服装遮罩）
    const CUM_URLS = {
      chestLittle: 'https://files.catbox.moe/htr1dh.png',
      chestMuch: 'https://files.catbox.moe/sct15g.png',
      bellyLittle: 'https://files.catbox.moe/1qk8mk.png',
      bellyMuch: 'https://files.catbox.moe/iznrta.png',
      legLittle: 'https://files.catbox.moe/j8g4g4.png',
      legMuch: 'https://files.catbox.moe/ay6ljp.png'
    };
    const WOMB_POPUP_URLS = [
      'https://files.catbox.moe/q6u20q.png',  // 0: 0-5
      'https://files.catbox.moe/9nv2qy.png',  // 1: 5-25
      'https://files.catbox.moe/d166xy.png',  // 2: 25-50
      'https://files.catbox.moe/8blqgc.png',  // 3: 50-75
      'https://files.catbox.moe/p9r91i.png'   // 4: 75+
    ];
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
        console.warn('[Hstatus] 立绘元素不存在');
        return;
      }

      try {
        // 获取当前运行时值（最后对话层快照）
        const lastLayer = getLastDialogueLayer();
        let varsSnapshot = null;

        if (lastLayer && lastLayer.varsSnapshot) {
          varsSnapshot = lastLayer.varsSnapshot;
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

        console.log('[Hstatus] 更新立绘 - 阶段:', stageNum, '服装:', outfitValue);

        updateHstatusSpriteByStage(spriteBody, spriteClothes, stageNum, outfitValue);
        updateHstatusCumOverlays(varsSnapshot);
      } catch (error) {
        console.warn('[Hstatus] 获取立绘信息失败，使用默认立绘:', error);
        // 使用默认阶段1的图片
        updateHstatusSpriteByStage(spriteBody, spriteClothes, 1, false);
        updateHstatusCumOverlays(ERA.currentVars);
      }
    }

    // 根据阶段和服装更新立绘图片（服装与堕落阶段分离）
    function updateHstatusSpriteByStage(bodyElement, clothesElement, stageNum, outfitValue) {
      let bodyUrl = '';
      let clothesUrl = '';

      // 根据服装值选择对应的立绘
      if (outfitValue === '女仆装') {
        // 女仆装模式：根据阶段选择
        if (stageNum === 1 || stageNum === 2) {
          bodyUrl = 'https://files.catbox.moe/hbwlvs.png';
          clothesUrl = 'https://files.catbox.moe/42fqqz.png';
        } else if (stageNum === 3 || stageNum === 4) {
          bodyUrl = 'https://files.catbox.moe/2nisdk.png';
          clothesUrl = 'https://files.catbox.moe/y8qk8b.png';
        } else {
          bodyUrl = 'https://files.catbox.moe/hbwlvs.png';
          clothesUrl = 'https://files.catbox.moe/42fqqz.png';
        }
      } else if (outfitValue === '常服') {
        // 常服：根据阶段选择Body，Clothes使用P1
        switch (stageNum) {
          case 1:
            bodyUrl = 'https://files.catbox.moe/9og146.png';
            clothesUrl = 'https://files.catbox.moe/8dussi.png';
            break;
          case 2:
            bodyUrl = 'https://files.catbox.moe/330l0g.png';
            clothesUrl = 'https://files.catbox.moe/8dussi.png';
            break;
          case 3:
            bodyUrl = 'https://files.catbox.moe/l9h2lz.png';
            clothesUrl = 'https://files.catbox.moe/8dussi.png';
            break;
          case 4:
            bodyUrl = 'https://files.catbox.moe/6qamux.png';
            clothesUrl = 'https://files.catbox.moe/8dussi.png';
            break;
          default:
            bodyUrl = 'https://files.catbox.moe/9og146.png';
            clothesUrl = 'https://files.catbox.moe/8dussi.png';
        }
      } else if (outfitValue === '暴露常服') {
        // 暴露常服：根据阶段选择Body，Clothes使用P2
        switch (stageNum) {
          case 1:
            bodyUrl = 'https://files.catbox.moe/9og146.png';
            clothesUrl = 'https://files.catbox.moe/ft5fz7.png';
            break;
          case 2:
            bodyUrl = 'https://files.catbox.moe/330l0g.png';
            clothesUrl = 'https://files.catbox.moe/ft5fz7.png';
            break;
          case 3:
            bodyUrl = 'https://files.catbox.moe/l9h2lz.png';
            clothesUrl = 'https://files.catbox.moe/ft5fz7.png';
            break;
          case 4:
            bodyUrl = 'https://files.catbox.moe/6qamux.png';
            clothesUrl = 'https://files.catbox.moe/ft5fz7.png';
            break;
          default:
            bodyUrl = 'https://files.catbox.moe/9og146.png';
            clothesUrl = 'https://files.catbox.moe/ft5fz7.png';
        }
      } else if (outfitValue === '魅魔常服') {
        // 魅魔常服：根据阶段选择Body，Clothes使用P3
        switch (stageNum) {
          case 1:
            bodyUrl = 'https://files.catbox.moe/9og146.png';
            clothesUrl = 'https://files.catbox.moe/4uv97f.png';
            break;
          case 2:
            bodyUrl = 'https://files.catbox.moe/330l0g.png';
            clothesUrl = 'https://files.catbox.moe/4uv97f.png';
            break;
          case 3:
            bodyUrl = 'https://files.catbox.moe/l9h2lz.png';
            clothesUrl = 'https://files.catbox.moe/4uv97f.png';
            break;
          case 4:
            bodyUrl = 'https://files.catbox.moe/6qamux.png';
            clothesUrl = 'https://files.catbox.moe/4uv97f.png';
            break;
          default:
            bodyUrl = 'https://files.catbox.moe/9og146.png';
            clothesUrl = 'https://files.catbox.moe/4uv97f.png';
        }
      } else if (outfitValue === '魔王服') {
        // 魔王服：根据阶段选择Body，Clothes使用P4
        switch (stageNum) {
          case 1:
            bodyUrl = 'https://files.catbox.moe/9og146.png';
            clothesUrl = 'https://files.catbox.moe/goz9h9.png';
            break;
          case 2:
            bodyUrl = 'https://files.catbox.moe/330l0g.png';
            clothesUrl = 'https://files.catbox.moe/goz9h9.png';
            break;
          case 3:
            bodyUrl = 'https://files.catbox.moe/l9h2lz.png';
            clothesUrl = 'https://files.catbox.moe/goz9h9.png';
            break;
          case 4:
            bodyUrl = 'https://files.catbox.moe/6qamux.png';
            clothesUrl = 'https://files.catbox.moe/goz9h9.png';
            break;
          default:
            bodyUrl = 'https://files.catbox.moe/9og146.png';
            clothesUrl = 'https://files.catbox.moe/goz9h9.png';
        }
      } else if (outfitValue === '浴巾') {
        // 浴巾：根据阶段选择Body，Clothes使用Bath
        switch (stageNum) {
          case 1:
            bodyUrl = 'https://files.catbox.moe/9og146.png';
            clothesUrl = 'https://files.catbox.moe/z5zas0.png';
            break;
          case 2:
            bodyUrl = 'https://files.catbox.moe/330l0g.png';
            clothesUrl = 'https://files.catbox.moe/z5zas0.png';
            break;
          case 3:
            bodyUrl = 'https://files.catbox.moe/l9h2lz.png';
            clothesUrl = 'https://files.catbox.moe/z5zas0.png';
            break;
          case 4:
            bodyUrl = 'https://files.catbox.moe/6qamux.png';
            clothesUrl = 'https://files.catbox.moe/z5zas0.png';
            break;
          default:
            bodyUrl = 'https://files.catbox.moe/9og146.png';
            clothesUrl = 'https://files.catbox.moe/z5zas0.png';
        }
      } else {
        // 默认使用常服
        bodyUrl = 'https://files.catbox.moe/9og146.png';
        clothesUrl = 'https://files.catbox.moe/8dussi.png';
      }

      console.log('[Hstatus] 设置立绘 - Body:', bodyUrl, 'Clothes:', clothesUrl, '服装:', outfitValue);

      // 设置图片src
      bodyElement.src = bodyUrl;
      clothesElement.src = clothesUrl;
    }

    // 更新Hstatus文字内容
    async function updateHstatusText() {
      const leftContent = document.getElementById('hstatus-text-content-left');
      const rightContent = document.getElementById('hstatus-text-content-right');
      const leftPanel = document.getElementById('hstatus-text-panel-left');

      if (!leftContent || !rightContent) {
        console.warn('[Hstatus] 文字面板元素不存在');
        return;
      }

      clearHstatusLeftArcLayout(leftContent, leftPanel);
      applyNormalOuterLeftPanelAnchor(leftPanel);

      try {
        // 获取当前运行时值（最后对话层快照）
        const lastLayer = getLastDialogueLayer();
        let varsSnapshot = null;

        if (lastLayer && lastLayer.varsSnapshot) {
          varsSnapshot = lastLayer.varsSnapshot;
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

        console.log('[Hstatus] 文字内容已更新');
      } catch (error) {
        console.warn('[Hstatus] 获取文字数据失败，使用默认值:', error);
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
        console.warn('[菜单] 堕落值变量条元素不存在');
        return;
      }

      try {
        let currentCorruption = null;
        let maxCorruption = 100; // 默认上限100

        // 当前运行时值就是最后对话层快照，优先从最后对话层快照或 ERA.currentVars 获取
        const lastLayer = getLastDialogueLayer();
        let varsSnapshot = null;

        if (lastLayer && lastLayer.varsSnapshot) {
          // 优先使用最后对话层的快照（它应该就是 ERA.currentVars）
          varsSnapshot = lastLayer.varsSnapshot;
          console.log('[菜单] 使用最后对话层快照（当前运行时值）获取堕落值');
        } else if (ERA.currentVars) {
          // 如果没有对话层，使用 ERA.currentVars
          varsSnapshot = ERA.currentVars;
          console.log('[菜单] 使用 ERA.currentVars（当前运行时值）获取堕落值');
        }

        if (varsSnapshot) {
          currentCorruption = getNestedValue(varsSnapshot, '托莉娜.基础.堕落值');
          if (currentCorruption !== undefined && currentCorruption !== null) {
            console.log('[菜单] 从当前运行时值获取堕落值:', currentCorruption);
          }
        }

        // 如果还是没有，使用 getvar 获取（会尝试从 ERA 查询）
        if (currentCorruption === undefined || currentCorruption === null) {
          currentCorruption = await getvar('stat_data.托莉娜.基础.堕落值');
          if (currentCorruption !== undefined && currentCorruption !== null) {
            console.log('[菜单] 从 getvar 获取堕落值:', currentCorruption);
          }
        }

        // 转换为数字
        currentCorruption = parseFloat(currentCorruption) || 0;
        maxCorruption = parseFloat(maxCorruption) || 100;

        // 计算百分比（0-100）
        const percentage = maxCorruption > 0 ? (currentCorruption / maxCorruption) * 100 : 0;
        const clampedPercentage = Math.max(0, Math.min(100, percentage)); // 限制在0-100之间

        console.log('[菜单] 堕落值:', currentCorruption, '/', maxCorruption, '=', clampedPercentage + '%');

        // 使用clip-path来控制显示百分比
        // clip-path: inset(0 right 0 0) 表示从右边裁剪，显示左边的百分比
        const rightClip = 100 - clampedPercentage;
        corruptionValueBar.style.clipPath = `inset(0 ${rightClip}% 0 0)`;

      } catch (error) {
        console.warn('[菜单] 获取堕落值失败:', error);
        // 默认显示0%
        corruptionValueBar.style.clipPath = 'inset(0 100% 0 0)';
      }
    }

    // 更新性欲值变量条显示
    async function updateLustValueBar() {
      const lustValueBar = document.getElementById('lust-value-bar');
      if (!lustValueBar) {
        console.warn('[菜单] 性欲值变量条元素不存在');
        return;
      }

      try {
        let currentLust = null;
        let maxLust = 100; // 默认上限100

        // 当前运行时值就是最后对话层快照，优先从最后对话层快照或 ERA.currentVars 获取
        const lastLayer = getLastDialogueLayer();
        let varsSnapshot = null;

        if (lastLayer && lastLayer.varsSnapshot) {
          // 优先使用最后对话层的快照（它应该就是 ERA.currentVars）
          varsSnapshot = lastLayer.varsSnapshot;
          console.log('[菜单] 使用最后对话层快照（当前运行时值）获取性欲值');
        } else if (ERA.currentVars) {
          // 如果没有对话层，使用 ERA.currentVars
          varsSnapshot = ERA.currentVars;
          console.log('[菜单] 使用 ERA.currentVars（当前运行时值）获取性欲值');
        }

        if (varsSnapshot) {
          currentLust = getNestedValue(varsSnapshot, '托莉娜.基础.性欲值');
          if (currentLust !== undefined && currentLust !== null) {
            console.log('[菜单] 从当前运行时值获取性欲值:', currentLust);
          }
        }

        // 如果还是没有，使用 getvar 获取（会尝试从 ERA 查询）
        if (currentLust === undefined || currentLust === null) {
          currentLust = await getvar('stat_data.托莉娜.基础.性欲值');
          if (currentLust !== undefined && currentLust !== null) {
            console.log('[菜单] 从 getvar 获取性欲值:', currentLust);
          }
        }

        // 转换为数字
        currentLust = parseFloat(currentLust) || 0;
        maxLust = parseFloat(maxLust) || 100;

        // 计算百分比（0-100）
        const percentage = maxLust > 0 ? (currentLust / maxLust) * 100 : 0;
        const clampedPercentage = Math.max(0, Math.min(100, percentage)); // 限制在0-100之间

        console.log('[菜单] 性欲值:', currentLust, '/', maxLust, '=', clampedPercentage + '%');

        // 使用clip-path来控制显示百分比
        // clip-path: inset(0 right 0 0) 表示从右边裁剪，显示左边的百分比
        const rightClip = 100 - clampedPercentage;
        lustValueBar.style.clipPath = `inset(0 ${rightClip}% 0 0)`;

      } catch (error) {
        console.warn('[菜单] 获取性欲值失败:', error);
        // 默认显示0%
        lustValueBar.style.clipPath = 'inset(0 100% 0 0)';
      }
    }

    // 根据阶段更新立绘图片
    function updateTorinaSpriteByStage(spriteElement, stageNum) {
      let spriteUrl = '';
      if (stageNum === 1) {
        spriteUrl = 'https://files.catbox.moe/xrfvzg.png';
      } else if (stageNum === 2) {
        spriteUrl = 'https://files.catbox.moe/md0p61.png';
      } else if (stageNum === 3) {
        spriteUrl = 'https://files.catbox.moe/5utwfz.png';
      } else if (stageNum === 4) {
        spriteUrl = 'https://files.catbox.moe/4ro2io.png';
      } else {
        // 默认使用阶段1
        spriteUrl = 'https://files.catbox.moe/xrfvzg.png';
      }

      console.log('[菜单] 设置托莉娜立绘:', spriteUrl, '阶段:', stageNum);
      spriteElement.style.backgroundImage = `url('${resolveAssetUrl(spriteUrl)}')`;
      spriteElement.style.display = 'block'; // 确保元素可见

      // 当堕落阶段为3或4时，向下移动20px（基础值向下移动，底部仍然贴底）
      if (stageNum === 3 || stageNum === 4) {
        // 使用 top 和 bottom 实现向下移动，保持底部贴底
        // top: 20px 使顶部向下移动20px，bottom: -20px 使底部仍然贴底
        spriteElement.style.top = '40px';
        spriteElement.style.bottom = '-40px'; // 负值使底部仍然贴底
        console.log('[菜单] 阶段', stageNum, '：立绘向下移动40px（基础值）');
      } else {
        // 阶段1或2时，恢复原始位置
        spriteElement.style.top = '0';
        spriteElement.style.bottom = '0';
        console.log('[菜单] 阶段', stageNum, '：立绘恢复原始位置');
      }

      // 验证背景图片是否设置成功
      const computedStyle = window.getComputedStyle(spriteElement);
      console.log('[菜单] 立绘元素样式:', {
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

      const menuImageUrl = 'https://files.catbox.moe/ogteua.png';
      const borderImageUrl = 'https://files.catbox.moe/gdyovq.png';
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
          console.warn('[MENU] 前景边框图片加载失败');
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
          gameFullscreenBtn.src = 'https://files.catbox.moe/wj2c68.png';
          gameFullscreenBtn.alt = '全屏';
          gameFullscreenBtn.title = '全屏';

          // 创建菜单按钮
          const gameMenuBtn = document.createElement('img');
          gameMenuBtn.className = 'game-menu-btn';
          gameMenuBtn.id = 'game-menu-btn';
          gameMenuBtn.src = 'https://files.catbox.moe/fcyjir.png';
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
          gameMenuExitBtn.src = 'https://files.catbox.moe/hkgfil.png';
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
          gameMenuSettingsUI.src = 'https://files.catbox.moe/dykagy.png';
          gameMenuSettingsUI.alt = '设置';
          gameMenuSettingsUI.title = '设置';

          // 创建设定字样
          const settingsLabel = document.createElement('img');
          settingsLabel.className = 'settings-label';
          settingsLabel.id = 'settings-label';
          settingsLabel.src = 'https://files.catbox.moe/3fc4yw.png';
          settingsLabel.alt = '设定';

          // 创建Hstatus UI（在设置按钮左边）
          const gameMenuHstatusUI = document.createElement('img');
          gameMenuHstatusUI.className = 'game-menu-hstatus-ui';
          gameMenuHstatusUI.id = 'game-menu-hstatus-ui';
          gameMenuHstatusUI.src = 'https://files.catbox.moe/yayh3o.png';
          gameMenuHstatusUI.alt = 'Hstatus';
          gameMenuHstatusUI.title = 'Hstatus';

          // 创建Hstatus字样
          const hstatusLabel = document.createElement('img');
          hstatusLabel.className = 'hstatus-label';
          hstatusLabel.id = 'hstatus-label';
          hstatusLabel.src = 'https://files.catbox.moe/zj7251.png'; // Hstatus标签图片
          hstatusLabel.alt = 'Hstatus';

          // 创建地图 UI（在 Hstatus 按钮下方）
          const gameMenuMapUI = document.createElement('img');
          gameMenuMapUI.className = 'game-menu-map-ui';
          gameMenuMapUI.id = 'game-menu-map-ui';
          gameMenuMapUI.src = 'https://files.catbox.moe/n3kdfi.png';
          gameMenuMapUI.alt = '地图';
          gameMenuMapUI.title = '地图';

          // 创建地图字样
          const mapLabel = document.createElement('img');
          mapLabel.className = 'map-label';
          mapLabel.id = 'map-label';
          mapLabel.src = 'https://files.catbox.moe/vpyzz7.png';
          mapLabel.alt = '地图';

          // 创建历史消息UI
          const gameMenuHistoryUI = document.createElement('img');
          gameMenuHistoryUI.className = 'game-menu-history-ui';
          gameMenuHistoryUI.id = 'game-menu-history-ui';
          gameMenuHistoryUI.src = 'https://files.catbox.moe/v0cbzh.png';
          gameMenuHistoryUI.alt = '历史消息';
          gameMenuHistoryUI.title = '历史消息';

          // 创建历史消息字样
          const historyLabel = document.createElement('img');
          historyLabel.className = 'history-label';
          historyLabel.id = 'history-label';
          historyLabel.src = 'https://files.catbox.moe/y9656v.png'; // 历史消息标签图片
          historyLabel.alt = '历史消息';

          // 创建保存UI
          const gameMenuSaveUI = document.createElement('img');
          gameMenuSaveUI.className = 'game-menu-save-ui';
          gameMenuSaveUI.id = 'game-menu-save-ui';
          gameMenuSaveUI.src = 'https://files.catbox.moe/l143y2.png';
          gameMenuSaveUI.alt = '保存';
          gameMenuSaveUI.title = '保存';

          // 创建保存字样
          const saveLabel = document.createElement('img');
          saveLabel.className = 'save-label';
          saveLabel.id = 'save-label';
          saveLabel.src = 'https://files.catbox.moe/aiw7z8.png';
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
          corruptionBar.src = 'https://files.catbox.moe/fc42vd.png';
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
          lustBar.src = 'https://files.catbox.moe/g5wizu.png';
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
          timeBack.src = 'https://files.catbox.moe/buwqmc.png';
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
          leftCover.src = 'https://files.catbox.moe/t34ltk.png';
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

          // 初始化时间+天气系统
          try {
            await updateTimeWeatherSystem();
          } catch (e) {
            errorWithTag('TIME', '初始化时间天气系统失败', e);
          }

          // 定期更新时间+天气系统（每1秒检查一次）
          setInterval(async () => {
            try {
              await updateTimeWeatherSystem();
            } catch (e) {
              errorWithTag('TIME', '定期更新时间天气系统失败', e);
            }
          }, 1000);

          // 初始化体力进度条
          try {
            await updateStaminaBar();
          } catch (e) {
            errorWithTag('STAMINA', '初始化体力条失败', e);
          }

          // 定期更新体力进度条（每1秒检查一次）
          setInterval(async () => {
            try {
              await updateStaminaBar();
            } catch (e) {
              errorWithTag('STAMINA', '定期更新体力条失败', e);
            }
          }, 1000);

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

          if (lastLayer && lastLayer.varsSnapshot) {
            // 获取堕落阶段
            const corruptionStage = getNestedValue(lastLayer.varsSnapshot, '托莉娜.基础.堕落阶段');
            const parsed = parseInt(corruptionStage, 10);
            if (parsed >= 1 && parsed <= 4) stageNum = parsed;

            // 如果堕落阶段为3或4，替换加载图片
            if (stageNum === 3 || stageNum === 4) {
              const loadingLogo = document.querySelector('.loading-logo');
              if (loadingLogo) {
                loadingLogo.src = 'https://files.catbox.moe/39yn6v.png';
                console.log('[LOADING] 根据自动存档的堕落阶段，已更新加载图片');
              }
            }
          }
        }
      } catch (error) {
        // 如果检查失败，不影响正常加载流程
        console.warn('[LOADING] 检查自动存档失败，使用默认加载图片:', error);
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
      console.log('[DEBUG] 已打开里 Hstatus 头部界面（正常模式）');
    }

    async function startRivalMaleSpriteDebug() {
      hideBootScreens();
      window._debugRivalMaleSprites = true;
      await initGameInterface();
      await new Promise(resolve => setTimeout(resolve, 800));
      await updateMainText(RIVAL_MALE_DEBUG_TEXT);
      window._debugRivalMaleSprites = false;
      console.log('[DEBUG] 间男立绘调试已启动：点击对话区右侧进入下一句，左侧回退');
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
        console.log('[DEBUG] 跳过资源加载与开始界面');
        return;
      }

      // 初始化资源列表（用于设置界面）
      initializeResourceList();

      if (DEBUG_RIVAL_MALE_SPRITES) {
        try {
          await loadAllAssets();
          console.log('[DEBUG] 资源加载完成，进入间男立绘调试');
          await startRivalMaleSpriteDebug();
        } catch (err) {
          console.error('[DEBUG] 间男立绘调试启动失败:', err);
        }
        return;
      }

      if (DEBUG_HSTATUS_INNER_HEAD) {
        try {
          await loadAllAssets();
          console.log('[DEBUG] 资源加载完成，进入里 Hstatus 头部调试');
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
        console.log('所有资源加载完成，进入开始界面');
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
    // SillyTavern交互功能（参考简单示例）
    // ============================================

    // 检查是否在iframe中
    function checkIfInIframe() {
      return window.self !== window.top;
    }

    // 检查父窗口是否有TavernHelper
    function checkTavernHelper() {
      if (window.parent && window.parent.TavernHelper) {
        if (typeof window.parent.TavernHelper.generate === 'function') {
          return true;
        }
      }
      return false;
    }

    // ============================================
    // 日志工具函数（带分类标签和错误样式）
    // ============================================
    const errorCache = new Set(); // 错误缓存，防止重复输出

    function logWithTag(tag, message, ...args) {
      // 静默模式：不输出日志
    }

    function warnWithTag(tag, message, ...args) {
      // 静默模式：不输出警告
    }

    function errorWithTag(tag, message, error = null, ...args) {
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

    // 清除错误缓存（可选，用于重置错误状态）
    function clearErrorCache() {
      errorCache.clear();
    }

    // 全局变量：当前正在处理的消息内容
    let currentStreamingContent = '';
    let isStreamingActive = false;

    // 设置流式消息监听器
    function setupStreamListener() {
      if (window.eventOn && typeof window.eventOn === 'function') {
        window.eventOn('js_stream_token_received_incrementally', (chunk) => {
          // 如果正在流式传输，累积内容
          if (isStreamingActive) {
            currentStreamingContent += chunk;
          }
        });
        logWithTag('INIT', '✅ 流式消息监听器已设置');
      } else {
        warnWithTag('INIT', '⚠️ 警告：无法设置流式消息监听器（eventOn不存在）');
      }
    }

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
        console.warn('[MSG] 疑似托莉娜视角写在 maintext 内且未使用 otherpov');
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
        variables: ''
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
        if (!result.otherpov) {
          const split = trySplitLeakedOtherpov(result.maintext);
          if (split) {
            result.maintext = split.maintext;
            result.otherpov = split.otherpov;
            console.warn('[MSG] 已从 maintext 自动拆分 otherpov（模型未使用标签）');
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
      if (options.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'quest-empty-msg';
        empty.textContent = '当前没有行动选项';
        container.appendChild(empty);
        return;
      }

      const panel = document.createElement('div');
      panel.className = 'branch-action-panel';

      const hint = document.createElement('div');
      hint.className = 'branch-action-hint';
      hint.textContent = '点选即行 · 右键或长按可改写后再落笔';

      const list = document.createElement('div');
      list.className = 'branch-action-list';

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
      panel.append(hint, list, inputRow);
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
        if (lastLayer && lastLayer.varsSnapshot) {
          const snapshotValue = getNestedValue(lastLayer.varsSnapshot, actualPath);
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
      console.log('[VAR] 自动计算：从你吸取魔力次数 = 口交+足交+接吻+颜射+乳交+性交+肛交+因为其他原因吸取你魔力次数 =', sum);
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
      console.log('[VAR] 自动计算：从你吸取魔力总量 = 接吻魔力量+乳交+小穴+屁穴+因为其他原因吸取你魔力 =', sum);
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
      console.log('[VAR] 自动计算：与你高潮的次数 = 因你小穴高潮+因你屁穴高潮+因为你胸部高潮+因为其他原因被你玩弄至高潮 =', sum);
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
      console.log('[VAR] 自动计算：总吸取魔力次数 = 亲吻+口交+乳交+足交 =', sum);
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
        console.log('[VAR] 正常·里：吞下的精液量 +=', delta, '(口中精液量正向增量)');
      } else if (path === NORMAL_INNER_UTERUS_SEMEN_PATH || path === NORMAL_INNER_RECTAL_SEMEN_PATH) {
        const cur = parseFloat(getNestedValue(snapshot, NORMAL_INNER_INJECTED_TOTAL_PATH)) || 0;
        setNestedValue(snapshot, NORMAL_INNER_INJECTED_TOTAL_PATH, cur + delta);
        console.log('[VAR] 正常·里：被射入精液总量 +=', delta, `(${path})`);
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

        // 如果最后对话层没有 varsSnapshot，从 ERA.currentVars 或默认值创建
        if (!lastLayer.varsSnapshot) {
          lastLayer.varsSnapshot = ERA.currentVars ? JSON.parse(JSON.stringify(ERA.currentVars)) : JSON.parse(JSON.stringify(ERA.defaultVars));
        }
        migrateLegacyHstateTree(lastLayer.varsSnapshot);

        // 获取当前变量快照（用于检查当前值）
        const varsSnapshot = lastLayer.varsSnapshot;
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

            console.log('[VAR] 性欲值溢出:', numValue, '-> 100, 堕落值增加:', corruptionIncrease, '->', newCorruption);

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

            console.log('[VAR] 堕落值达到100，触发阶段提升:', {
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
        setNestedValue(lastLayer.varsSnapshot, actualPath, value);

        triggerHstateRecalc(lastLayer.varsSnapshot, actualPath);
        // 同步更新 ERA.currentVars 和 cache.vars，使其与最后对话层快照保持一致
        // 让 ERA.currentVars 直接引用最后对话层的快照，避免多套平行值
        ERA.currentVars = lastLayer.varsSnapshot;
        ERA.cache.vars = lastLayer.varsSnapshot;
        ERA.cache.timestamp = Date.now();

        console.log('[VAR] 已更新变量（当前运行时值 = 最后对话层快照）:', actualPath, '=', value);

        // 同步到 ST 聊天变量，供 prompt 中 {{get_chat_variable::stat_data.xxx}} 使用（防抖）
        syncVariablesToSTDebounced();

        // 刷新相关界面元素
        refreshUIByVariablePath(actualPath).catch(e => {
          console.warn('[VAR] 刷新界面元素失败:', e);
        });

        return true;
      } catch (e) {
        errorWithTag('VAR', '设置变量失败', e);
        return false;
      }
    }

    // 获取当前变量对象（用于同步到 SillyTavern 聊天变量，供 prompt 中 {{get_chat_variable::stat_data.xxx}} 使用）
    function getCurrentVarsForSync() {
      const lastLayer = getLastDialogueLayer();
      let statData;
      if (lastLayer && lastLayer.varsSnapshot) {
        statData = JSON.parse(JSON.stringify(lastLayer.varsSnapshot));
      } else if (ERA.currentVars) {
        statData = JSON.parse(JSON.stringify(ERA.currentVars));
      } else if (ERA.cache && ERA.cache.vars) {
        statData = JSON.parse(JSON.stringify(ERA.cache.vars));
      } else {
        statData = ERA.defaultVars ? JSON.parse(JSON.stringify(ERA.defaultVars)) : {};
      }
      migrateLegacyHstateTree(statData);
      recomputeDerivedHstateFields(statData);
      return statData;
    }

    // 将当前前端变量同步到 ST 聊天变量（与 char_card_1 一样，让 AI 在下次生成时能读到）
    let _syncVariablesToSTTimer = null;
    async function syncVariablesToST() {
      try {
        if (typeof window.insertOrAssignVariables !== 'function') {
          return;
        }
        const statData = getCurrentVarsForSync();
        await window.insertOrAssignVariables({ stat_data: statData }, { type: 'chat' });
        console.log('[VAR] 已同步变量到 ST 聊天变量（prompt 中可用 {{get_chat_variable::stat_data.xxx}}）');
      } catch (e) {
        console.warn('[VAR] 同步变量到 ST 失败', e);
      }
    }

    // 防抖：避免 setvar 连续调用时频繁同步
    function syncVariablesToSTDebounced() {
      if (_syncVariablesToSTTimer) clearTimeout(_syncVariablesToSTTimer);
      _syncVariablesToSTTimer = setTimeout(() => {
        _syncVariablesToSTTimer = null;
        syncVariablesToST();
      }, 300);
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

        // 如果最后对话层没有 varsSnapshot，从 ERA.currentVars 或默认值创建
        if (!lastLayer.varsSnapshot) {
          lastLayer.varsSnapshot = ERA.currentVars ? JSON.parse(JSON.stringify(ERA.currentVars)) : JSON.parse(JSON.stringify(ERA.defaultVars));
        }

        // 获取当前值并计算新值
        const currentValue = getNestedValue(lastLayer.varsSnapshot, actualPath);
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
            let currentCorruption = getNestedValue(lastLayer.varsSnapshot, '托莉娜.基础.堕落值');
            currentCorruption = parseFloat(currentCorruption) || 0;

            // 增加堕落值（但不超过100）
            const newCorruption = Math.min(100, currentCorruption + corruptionIncrease);

            console.log('[VAR] 性欲值溢出（增量）:', currentValue, '+', increment, '-> 100, 堕落值增加:', corruptionIncrease, '->', newCorruption);

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
            let currentLust = getNestedValue(lastLayer.varsSnapshot, '托莉娜.基础.性欲值');
            currentLust = parseFloat(currentLust) || 0;

            // 获取当前堕落阶段
            let currentStage = getNestedValue(lastLayer.varsSnapshot, '托莉娜.基础.堕落阶段');
            currentStage = parseInt(currentStage, 10) || 1;

            // 清空一半的性欲值和全部堕落值
            const newLust = Math.floor(currentLust / 2);
            const newCorruption = 0; // 全部清空堕落值

            // 增加1堕落阶段（但不超过4）
            const newStage = Math.min(4, currentStage + 1);

            console.log('[VAR] 堕落值达到100（增量），触发阶段提升:', {
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
        setNestedValue(lastLayer.varsSnapshot, actualPath, newValue);
        applyNormalInnerSemenSyncFromAdd(lastLayer.varsSnapshot, actualPath, increment);

        triggerHstateRecalc(lastLayer.varsSnapshot, actualPath);
        // 同步更新 ERA.currentVars 和 cache.vars，使其与最后对话层快照保持一致
        ERA.currentVars = lastLayer.varsSnapshot;
        ERA.cache.vars = lastLayer.varsSnapshot;
        ERA.cache.timestamp = Date.now();

        // 同步到 ST 聊天变量（防抖）
        syncVariablesToSTDebounced();

        console.log('[VAR] 已更新变量（增量，当前运行时值 = 最后对话层快照）:', actualPath, '=', currentValue, '+', increment, '=', newValue);

        // 刷新相关界面元素
        refreshUIByVariablePath(actualPath).catch(e => {
          console.warn('[VAR] 刷新界面元素失败:', e);
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

    /** @param {boolean} pureLoveMode */
    async function applyGameModeLoreUids(pureLoveMode, executeSlash) {
      await executeSlash(
        `/setpromptentry identifier=${GAME_MODE_LORE_UID.PURE_LOVE} ${pureLoveMode ? 'on' : 'off'}`,
      );
      await executeSlash(
        `/setpromptentry identifier=${GAME_MODE_LORE_UID.NORMAL} ${pureLoveMode ? 'off' : 'on'}`,
      );
    }

    /** @param {boolean} pureLoveMode @param {Array<{uid:number,enabled:boolean}>|undefined} entries */
    function collectGameModeLoreUidUpdates(pureLoveMode, entries) {
      const updates = [];
      const entry33 = entries?.find(e => e.uid === GAME_MODE_LORE_UID.PURE_LOVE);
      const entry43 = entries?.find(e => e.uid === GAME_MODE_LORE_UID.NORMAL);
      if (entry33 && entry33.enabled !== pureLoveMode) {
        updates.push({ uid: GAME_MODE_LORE_UID.PURE_LOVE, enabled: pureLoveMode });
      }
      if (entry43 && entry43.enabled !== !pureLoveMode) {
        updates.push({ uid: GAME_MODE_LORE_UID.NORMAL, enabled: !pureLoveMode });
      }
      return updates;
    }

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

    // 检测并控制 UID 状态（根据堕落阶段和服装）
    async function checkAndControlUIDs() {
      try {
        // 获取当前堕落阶段和服装
        const corruptionStage = await getvar('stat_data.托莉娜.基础.堕落阶段');
        const outfit = await getvar('stat_data.托莉娜.基础.服装');

        const stage = parseInt(corruptionStage, 10) || 1;
        const outfitValue = outfit || '常服';
        const pureLoveModeEarly = isPureLoveMode();
        syncLocalWorldbookUids(stage, outfitValue, pureLoveModeEarly);

        // 检查是否有可用的世界书 API
        if (typeof getCurrentCharPrimaryLorebook !== 'function' || typeof setLorebookEntries !== 'function') {
          console.warn('[UID] 世界书 API 不可用，尝试使用 slash command');
          // 回退到 slash command 方式
          const executeSlash = async (command) => {
            if (typeof triggerSlash === 'function') {
              try {
                await triggerSlash(command);
                console.log('[UID] 执行命令:', command);
              } catch (e) {
                console.warn('[UID] 执行命令失败:', command, e);
              }
            } else {
              console.warn('[UID] triggerSlash 函数不可用，无法执行:', command);
            }
          };

          const pureLoveMode = isPureLoveMode();
          const enabledStageUids = getCorruptionStageEnabledUIDs(stage, pureLoveMode);

          for (const uid of CORRUPTION_STAGE_LORE_UIDS) {
            await executeSlash(
              `/setpromptentry identifier=${uid} ${enabledStageUids.has(uid) ? 'on' : 'off'}`,
            );
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
            if (uid === targetUID) {
              await executeSlash(`/setpromptentry identifier=${uid} on`);
            } else {
              await executeSlash(`/setpromptentry identifier=${uid} off`);
            }
          }

          await applyGameModeLoreUids(pureLoveMode, executeSlash);
          const stageHint = pureLoveMode
            ? `纯爱 阶段${stage}→${[...enabledStageUids].sort((a, b) => a - b).join('+')}`
            : `正常 阶段${stage}→${[...enabledStageUids].sort((a, b) => a - b).join('+')}`;
          console.log('[UID] 已根据堕落阶段', stage, '和服装', outfitValue, `（${stageHint}）`, '更新 UID（slash）');
          return;
        }

        // 使用世界书 API 直接操作
        const lorebook = getCurrentCharPrimaryLorebook();
        if (!lorebook) {
          console.warn('[UID] 无法获取当前角色的世界书');
          return;
        }

        // 获取所有条目
        const entries = await getLorebookEntries(lorebook);

        // 需要更新的条目列表
        const updates = [];

        const pureLoveMode = isPureLoveMode();
        const enabledStageUids = getCorruptionStageEnabledUIDs(stage, pureLoveMode);

        // 1. 堕落阶段：纯爱 3/4+12–15；正常 3/4+44–47（12–15 全关）
        for (const uid of CORRUPTION_STAGE_LORE_UIDS) {
          const entry = entries.find(e => e.uid === uid);
          if (entry) {
            const shouldEnable = enabledStageUids.has(uid);
            if (entry.enabled !== shouldEnable) {
              updates.push({ uid, enabled: shouldEnable });
            }
          }
        }

        // 2. 根据服装控制服装相关 UID（8, 10, 9, 18, 17, 2）
        const outfitUIDs = [8, 10, 9, 18, 17, 2];
        let targetUID = null;
        if (outfitValue === '常服') targetUID = 8;
        else if (outfitValue === '暴露常服') targetUID = 10;
        else if (outfitValue === '魅魔常服') targetUID = 9;
        else if (outfitValue === '魔王服') targetUID = 18;
        else if (outfitValue === '浴巾') targetUID = 17;
        else if (outfitValue === '女仆装') targetUID = 2;

        for (const uid of outfitUIDs) {
          const entry = entries.find(e => e.uid === uid);
          if (entry) {
            const shouldEnable = uid === targetUID;
            if (entry.enabled !== shouldEnable) {
              updates.push({ uid: uid, enabled: shouldEnable });
            }
          }
        }

        updates.push(...collectGameModeLoreUidUpdates(pureLoveMode, entries));

        // 执行更新
        if (updates.length > 0) {
          await setLorebookEntries(lorebook, updates);
          console.log('[UID] 已根据堕落阶段', stage, '和服装', outfitValue, '更新', updates.length, '个世界书条目');
        } else {
          console.log('[UID] 所有世界书条目状态已正确，无需更新');
        }
      } catch (e) {
        console.error('[UID] 检测和控制 UID 失败:', e);
      }
    }

    async function refreshUIByVariablePath(path) {
      try {
        console.log('[刷新] 根据变量路径刷新界面:', path);

        // 在刷新界面之前检测并控制 UID
        await checkAndControlUIDs();

        // 根据变量路径判断需要刷新哪些界面元素
        if (path === '托莉娜.基础.堕落阶段') {
          // 刷新 gal 界面立绘和菜单界面立绘
          console.log('[刷新] 刷新堕落阶段相关界面...');

          // 1. 刷新 gal 界面立绘（主游戏界面）
          const lastLayer = getLastDialogueLayer();
          if (lastLayer && lastLayer.maintext) {
            // 解析最后对话层的对话，获取最后一个立绘标签
            const dialogues = parseTolinaDialogues(lastLayer.maintext);
            if (dialogues.length > 0) {
              // 使用最后一个对话的立绘信息重新渲染
              const lastDialogue = dialogues[dialogues.length - 1];
              await renderDialogueSprite(lastDialogue);
              console.log('[刷新] ✅ gal 界面立绘已刷新');
            }
          }

          // 2. 刷新菜单界面立绘（如果菜单已打开）
          const menuOverlay = document.getElementById('game-menu-overlay');
          if (menuOverlay && menuOverlay.classList.contains('show')) {
            await updateMenuTorinaSprite();
            console.log('[刷新] ✅ 菜单界面立绘已刷新');
          }

          // 3. 刷新Hstatus表立绘和文字（如果Hstatus表界面已打开）
          const hstatusOverlay = document.getElementById('hstatus-table-overlay');
          if (hstatusOverlay && hstatusOverlay.classList.contains('show')) {
            await updateHstatusSprite();
            await updateHstatusText();
            console.log('[刷新] ✅ Hstatus表立绘和文字已刷新');
          }
        } else if (path === '托莉娜.基础.堕落值') {
          // 刷新堕落值变量条
          console.log('[刷新] 刷新堕落值相关界面...');
          const menuOverlay = document.getElementById('game-menu-overlay');
          if (menuOverlay && menuOverlay.classList.contains('show')) {
            await updateCorruptionValueBar();
            console.log('[刷新] ✅ 堕落值变量条已刷新');
          }
          // 更新堕落条位置
          updateCorruptionBarPosition();
          console.log('[刷新] ✅ 堕落条位置已刷新');
        } else if (path === '托莉娜.基础.性欲值') {
          // 刷新性欲值条
          console.log('[刷新] 刷新性欲值相关界面...');
          const menuOverlay = document.getElementById('game-menu-overlay');
          if (menuOverlay && menuOverlay.classList.contains('show')) {
            await updateLustValueBar();
            console.log('[刷新] ✅ 性欲值条已刷新');
          }
          const hstatusOverlay = document.getElementById('hstatus-table-overlay');
          if (hstatusOverlay && hstatusOverlay.classList.contains('show')) {
            await updateHstatusText();
            console.log('[刷新] ✅ Hstatus 魔力/性欲文字已刷新');
          }
        } else if (path && path.startsWith('托莉娜.Hstate纯爱.表.精液状态')) {
          // 刷新 Hstatus 精液叠加层（仅当 Hstatus 已打开）
          const hstatusOverlay = document.getElementById('hstatus-table-overlay');
          if (hstatusOverlay && hstatusOverlay.classList.contains('show')) {
            const lastLayer = getLastDialogueLayer();
            const snap = (lastLayer && lastLayer.varsSnapshot) ? lastLayer.varsSnapshot : ERA.currentVars;
            updateHstatusCumOverlays(snap);
            console.log('[刷新] ✅ Hstatus 精液叠加层已刷新');
          }
        } else if (path === '托莉娜.Hstate纯爱.表.阴部.子宫内你的精液量') {
          // 刷新子宫精液弹窗（仅当 Hstatus 已打开且在阴部界面）
          const hstatusOverlay = document.getElementById('hstatus-table-overlay');
          if (hstatusOverlay && hstatusOverlay.classList.contains('show') && hstatusViewMode === 'crotch') {
            const lastLayer = getLastDialogueLayer();
            const snap = (lastLayer && lastLayer.varsSnapshot) ? lastLayer.varsSnapshot : ERA.currentVars;
            updateWombPopup(snap);
            console.log('[刷新] ✅ 子宫精液弹窗已刷新');
          }
        } else if (path && path.startsWith('托莉娜.Hstate纯爱.表.足部')) {
          // 刷新阴部界面右侧足部四行（仅当 Hstatus 已打开且在阴部界面）
          const hstatusOverlay = document.getElementById('hstatus-table-overlay');
          if (hstatusOverlay && hstatusOverlay.classList.contains('show') && hstatusViewMode === 'crotch') {
            await updateHstatusText();
            console.log('[刷新] ✅ Hstatus 足部右侧文字已刷新');
          }
        } else if (path === '托莉娜.Hstate正常.里.总表.献出初夜的对象') {
          const hstatusOverlay = document.getElementById('hstatus-table-overlay');
          if (hstatusOverlay && hstatusOverlay.classList.contains('show') && hstatusLayerMode === 'inner') {
            await updateHstatusText();
            console.log('[刷新] ✅ Hstatus 里界面处女状态文字已刷新');
          }
        } else if (path && path.startsWith('托莉娜.Hstate正常.表.')) {
          const hstatusOverlay = document.getElementById('hstatus-table-overlay');
          if (hstatusOverlay && hstatusOverlay.classList.contains('show') && hstatusLayerMode === 'outer') {
            await updateHstatusText();
            console.log('[刷新] ✅ Hstatus 正常表界面文字已刷新');
          }
        } else if (path === '托莉娜.基础.服装') {
          // 刷新 gal 界面立绘、菜单界面立绘和Hstatus表立绘
          console.log('[刷新] 刷新服装相关界面...');

          // 1. 刷新 gal 界面立绘（主游戏界面）
          const lastLayer = getLastDialogueLayer();
          if (lastLayer && lastLayer.maintext) {
            // 解析最后对话层的对话，获取最后一个立绘标签
            const dialogues = parseTolinaDialogues(lastLayer.maintext);
            if (dialogues.length > 0) {
              // 使用最后一个对话的立绘信息重新渲染
              const lastDialogue = dialogues[dialogues.length - 1];
              await renderDialogueSprite(lastDialogue);
              console.log('[刷新] ✅ gal 界面立绘已刷新');
            }
          }

          // 2. 刷新菜单界面立绘（如果菜单已打开）
          const menuOverlay = document.getElementById('game-menu-overlay');
          if (menuOverlay && menuOverlay.classList.contains('show')) {
            await updateMenuTorinaSprite();
            console.log('[刷新] ✅ 菜单界面立绘已刷新');
          }

          // 3. 刷新Hstatus表立绘和文字（如果Hstatus表界面已打开）
          const hstatusOverlay = document.getElementById('hstatus-table-overlay');
          if (hstatusOverlay && hstatusOverlay.classList.contains('show')) {
            await updateHstatusSprite();
            await updateHstatusText();
            console.log('[刷新] ✅ Hstatus表立绘和文字已刷新');
          }
        } else if (path.startsWith('系统.时间.') || path === '系统.天气') {
          // 刷新天气系统
          console.log('[刷新] 刷新时间/天气相关界面...');
          await updateTimeWeatherSystem();
          console.log('[刷新] ✅ 天气系统已刷新');
        } else if (path === '系统.体力.当前体力值') {
          // 刷新体力条
          console.log('[刷新] 刷新体力相关界面...');
          await updateStaminaBar();
          console.log('[刷新] ✅ 体力条已刷新');
        } else if (
          path === '系统.地点.当前地点' ||
          path === '系统.地点.托莉娜地点' ||
          path === '地点.当前地点' ||
          path === '地点.托莉娜地点' ||
          path === '托莉娜.行程.同行状态'
        ) {
          if (typeof MeishinkanWorldMap?.refreshActorMarkers === 'function') {
            await MeishinkanWorldMap.refreshActorMarkers();
            console.log('[刷新] ✅ 地图角色标记已刷新');
          }
        }

        console.log('[刷新] 界面刷新完成');
      } catch (e) {
        console.error('[刷新] ❌ 刷新过程出错:', e);
      }
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
            console.log(`[_] ${path} =`, value);
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
              console.log(`[_] ✅ 已设置: ${path} =`, value);
            } else {
              console.warn(`[_] ⚠️ 设置失败: ${path}`);
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
              console.warn(`[_] ⚠️ 变量不存在，无法更新: ${path}`);
              return false;
            }

            const newValue = (parseFloat(currentValue) || 0) + parseFloat(amount);
            const success = await setvar(path, newValue);
            if (success) {
              console.log(`[_] ✅ 已更新: ${path} = ${currentValue} ${amount >= 0 ? '+' : ''}${amount} = ${newValue}`);
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
            console.log(`[_] ✅ 批量设置完成: ${successCount}/${Object.keys(vars).length} 成功`);
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
            console.log('[_] 📋 所有变量:', vars);
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
              console.log(`  ${key}:`, value);
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
        console.log(`
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
    console.log('%c[测试变量]', 'color: #4CAF50; font-weight: bold; font-size: 14px;',
      '控制台测试变量接口已就绪！输入 _.help() 查看使用说明');

    // 默认游戏变量（根据[initvar].yaml定义）
    // 已移除：不再使用默认值，只从MVU读取

    // 时间图片映射
    const timeImageMap = {
      '早': 'https://files.catbox.moe/m3l95j.png',      // Morning
      '中': 'https://files.catbox.moe/xnzc7c.png',      // Noon
      '晚': 'https://files.catbox.moe/g2x21l.png',      // Afternoon
      '夜': 'https://files.catbox.moe/1iepv7.png',      // Night
      '午夜': 'https://files.catbox.moe/p326lj.png'     // Midnight
    };

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
      if (weather === '雨' || weather === 'rain') {
        if (time === '早' || time === '中' || time === '晚') {
          // 早中晚使用白天下雨图
          timeImage.src = 'https://files.catbox.moe/d555se.png'; // rainDay
          timeImage.classList.add('show');
        } else if (time === '夜' || time === '午夜') {
          // 夜和午夜使用晚上下雨图
          timeImage.src = 'https://files.catbox.moe/s66j1n.png'; // rainNight
          timeImage.classList.add('show');
        } else {
          // 如果时间未读取到，默认显示白天下雨图
          timeImage.src = 'https://files.catbox.moe/d555se.png'; // rainDay
          timeImage.classList.add('show');
        }
      } else if (time && timeImageMap[time]) {
        // 如果天气不是雨，根据时间显示对应图片
        timeImage.src = timeImageMap[time];
        timeImage.classList.add('show');
      } else {
        // 如果时间未读取到，默认显示早晨图
        timeImage.src = 'https://files.catbox.moe/m3l95j.png'; // Morning
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
                console.warn(`[立绘] 未找到L1底图: ${parsedTag.baseKey}，使用回退图片`);
              }
            }
          } else {
            layers.L1 = tolinaSprites.L1_base['NudeLeg-Maid'] ||
                       (tolinaSprites.L1_base[parsedTag.baseKey] ? tolinaSprites.L1_base[parsedTag.baseKey] : getFirstImageFromObject(tolinaSprites.L1_base));
            if (layers.L1 && !tolinaSprites.L1_base[parsedTag.baseKey] && parsedTag.baseKey !== 'NudeLeg-Maid') {
              console.warn(`[立绘] 未找到L1底图: ${parsedTag.baseKey}，使用回退图片`);
            }
          }
        } else if (tolinaSprites.L1_base[parsedTag.baseKey]) {
          // 非女仆装：直接使用传入的底图
          layers.L1 = tolinaSprites.L1_base[parsedTag.baseKey];
        } else {
          layers.L1 = getFirstImageFromObject(tolinaSprites.L1_base);
          if (layers.L1) {
            console.warn(`[立绘] 未找到L1底图: ${parsedTag.baseKey}，使用回退图片`);
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
              console.warn(`[立绘] 未找到L3表情(P1): ${parsedTag.expression}，使用回退图片`);
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
              console.warn(`[立绘] 未找到L3表情(P3): ${parsedTag.expression}，使用回退图片`);
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
            console.warn(`[立绘] 未找到L4衣服: Bath，使用回退图片`);
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
            console.warn(`[立绘] 未找到L4衣服: ${clothKey}，使用回退图片`);
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
            console.warn(`[立绘] 未找到L5杂项: ${parsedTag.special}，使用回退图片`);
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
            console.warn(`[立绘] 未找到L6阴影: ${shadowKey}，使用回退图片`);
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

    // 从 allResources 获取背景URL（根据背景名称）
    function getBackgroundUrl(backgroundName) {
      // 从 allResources 中查找背景资源
      const backgroundResource = allResources.find(r =>
        r.category === '背景' && r.name === backgroundName
      );
      return backgroundResource ? backgroundResource.url : null;
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
        stage.style.backgroundImage = `url('${backgroundUrl}')`;
        stage.style.backgroundSize = 'cover';
        stage.style.backgroundPosition = 'center center';
        stage.style.backgroundRepeat = 'no-repeat';
      } else {
        console.warn(`未找到背景: ${backgroundName}`);
      }
    }

    // ==================== CG系统 ====================
    // CG状态管理：记录每个CG组当前显示的CG
    const cgState = {};

    // 从 allResources 获取CG资源URL（根据CG组名和CG名称）
    function getCGUrl(groupName, cgName) {
      // 构建完整的资源名称：组名-CG名称
      const fullName = `${groupName}-${cgName}`;
      // 从 allResources 中查找CG资源
      const cgResource = allResources.find(r =>
        r.category === 'CG' && r.name === fullName
      );

      if (cgResource) {
        return cgResource.url;
      }

      // 如果找不到指定的CG，查找该CG组的第一张图片
      const groupResources = allResources.filter(r =>
        r.category === 'CG' && r.name.startsWith(`${groupName}-`)
      );

      if (groupResources.length > 0) {
        // 按名称排序，获取第一张图片
        groupResources.sort((a, b) => a.name.localeCompare(b.name));
        console.warn(`[CG] 未找到CG: ${groupName}-${cgName}，使用该组第一张图片: ${groupResources[0].name}`);
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
        console.warn('[CG] CG层元素不存在');
        return;
      }

      const cgUrl = getCGUrl(groupName, cgName);
      if (!cgUrl) {
        console.warn(`[CG] CG组 "${groupName}" 不存在任何CG资源`);
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
          console.log(`[CG] 隐藏立绘（因为显示${groupName} CG）`);
        }
      }

      console.log(`[CG] 显示CG组 "${groupName}" 的CG: ${cgName}`);
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
            console.log(`[CG] 恢复立绘显示（因为隐藏${groupName} CG且没有其他需要隐藏立绘的CG）`);
          }
        }
      }

      console.log(`[CG] 隐藏CG组 "${groupName}" 的CG`);
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
              console.log(`[CG] 恢复CG时隐藏立绘（因为${firstCGGroup} CG）`);
            }
          }

          console.log(`[CG] 恢复CG显示: ${firstCGGroup} - ${firstCGName}`);
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
      if (!checkIfInIframe() || !checkTavernHelper()) {
        galToast('酒馆未连接，无法重新生成');
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
        if (!checkIfInIframe() || !checkTavernHelper()) {
          throw new Error('SillyTavern环境检查失败');
        }
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
        await updateMainText(`发送失败：${error.message}\n请重试或检查SillyTavern连接。`);
      }
    }

    function showBranchesFromText(branchesText) {
      if (!branchesText || !branchesText.trim()) return;
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
      mountBranchActionUI(body, branchesText, choiceText => sendBranchChoiceAndGenerate(choiceText, closeOverlay));

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
        console.log('[LOAD] ⚠️ 阻止 updateMainText 覆盖读档对话');
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
        console.warn('添加时间到snapshots失败:', error);
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

              if (lastLayer && lastLayer.varsSnapshot) {
                currentVars = lastLayer.varsSnapshot;
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

        // 立即在本地合并 parsedVars，否则 getvar / 体力条 / 同步 仍会读到旧值（不依赖 era:writeDone 回包）
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
          if (lastLayer && lastLayer.varsSnapshot) targets.push(lastLayer.varsSnapshot);
          variablePaths.forEach(path => {
            const val = getNestedValue(parsedVars, path);
            if (val !== undefined) targets.forEach(t => setNestedValue(t, path, val));
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

        // 同步到 ST 聊天变量，供下次生成时 prompt 中 {{get_chat_variable::stat_data.xxx}} 使用（必须 await 确保在下次生成前已写入）
        await syncVariablesToST().catch(e => { console.warn('[VAR] 同步变量到 ST 失败', e); });

        // 等待变量更新完成后，从 ERA 系统读取当前值并显示在变量区域
        // 延迟一下确保变量已更新
        setTimeout(async () => {
          try {
            // 获取当前变量快照
            const lastLayer = getLastDialogueLayer();
            let varsSnapshot = null;

            if (lastLayer && lastLayer.varsSnapshot) {
              varsSnapshot = lastLayer.varsSnapshot;
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

        // 获取当前变量快照
        // 当前运行时值就是最后对话层快照，所以新对话层应该基于当前的 ERA.currentVars
        let currentVarsSnapshot = null;

        // 第一层使用默认变量
        if (currentDialogueLayer === 1) {
          currentVarsSnapshot = JSON.parse(JSON.stringify(ERA.defaultVars));
          logWithTag('HIST', '第一层使用默认变量数据');
        } else if (ERA.currentVars) {
          // 其他层：优先使用 ERA.currentVars（它应该就是最后对话层的快照）
          currentVarsSnapshot = JSON.parse(JSON.stringify(ERA.currentVars));
          logWithTag('HIST', '使用当前运行时值（最后对话层快照）作为新对话层快照');
        } else {
          // 如果 ERA.currentVars 不存在，尝试从 ERA 获取
          try {
            currentVarsSnapshot = await ERA.getCurrentVars();
            if (!currentVarsSnapshot) {
              // 如果 ERA 获取失败，使用默认值
              currentVarsSnapshot = JSON.parse(JSON.stringify(ERA.defaultVars));
            }
          } catch (e) {
            errorWithTag('HIST', '获取变量快照失败', e);
            currentVarsSnapshot = JSON.parse(JSON.stringify(ERA.defaultVars));
          }
        }

        // 创建新对话层后，更新 ERA.currentVars 使其指向新对话层的快照
        // 这样当前运行时值就始终等于最后对话层快照

        const dialogueLayer = {
          id: crypto.randomUUID(),
          layer: currentDialogueLayer, // 对话层数（奇数）
          timestamp: new Date().toISOString(),
          maintext: parsed.maintext || '',
          otherpov: parsed.otherpov || '',
          branches: parsed.branches || '',
          snapshots: parsed.snapshots || '',
          variables: parsed.variables || '',
          varsSnapshot: currentVarsSnapshot ? JSON.parse(JSON.stringify(currentVarsSnapshot)) : null,
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
      console.log('═══════════════════════════════════════════════════════');
      console.log('📥 processMessage 被调用');
      console.log('═══════════════════════════════════════════════════════');
      console.log('原始内容:', content);
      console.log('───────────────────────────────────────────────────────');

      const parsed = parseTags(content);
      console.log('解析结果:', parsed);
      warnIfTorinaPovLeakedInMaintext(parsed.maintext, parsed.otherpov);
      console.log('───────────────────────────────────────────────────────');

      // 如果正在读档，阻止 processMessage 覆盖读档对话
      if (window._isLoadingArchiveDialogue) {
        console.log('[LOAD] ⚠️ 阻止 processMessage 覆盖读档对话');
        return;
      }

      if (parsed.maintext) {
        const dialogues = parseTolinaDialogues(parsed.maintext);
        console.log(`✅ 解析到 ${dialogues.length} 段对话:`);
        dialogues.forEach((dialogue, index) => {
          console.log(`  对话 ${index + 1}:`, {
            角色: dialogue.character,
            表情: dialogue.expression,
            对话: dialogue.dialogue,
            背景: dialogue.background,
            立绘标签: dialogue.baseKey
          });
        });
      } else {
        console.log('⚠️ 没有对话文本 (maintext)');
      }

      if (parsed.branches) {
        console.log('✅ 分支选项:', parsed.branches);
      }

      if (parsed.variables) {
        console.log('✅ 变量更新:', parsed.variables);
      }

      if (parsed.snapshots) {
        console.log('✅ 快照:', parsed.snapshots);
      }

      console.log('═══════════════════════════════════════════════════════');

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

      // 变量更新后，更新体力条和时间天气系统
      try {
        await updateStaminaBar();
        await updateTimeWeatherSystem();
      } catch (e) {
        errorWithTag('MSG', '更新体力条和时间系统失败', e);
      }

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

    function collectActivatedWorldbookText(userInput) {
      const wb = window.妹神官_settings_worldbook;
      if (!wb) return '';
      const loc = readStatFromPaths(['系统.地点.当前地点', '地点.当前地点']) || '';
      const ctx = {
        userInput: userInput || '',
        userName: '{{user}}',
        messages: buildWorldbookScanMessages(),
        extras: { scenario: loc },
        trigger: 'normal',
      };
      let entries = [];
      if (typeof wb.scanAndActivate === 'function') {
        const result = wb.scanAndActivate(ctx);
        entries = (result && result.entries) || [];
      } else if (typeof wb.collectActivatedEntries === 'function') {
        entries = wb.collectActivatedEntries(ctx) || [];
      }
      if (!entries.length) return '';
      if (typeof wb.formatActivatedText === 'function') return wb.formatActivatedText(entries);
      return (
        '## 世界书\n' +
        entries
          .map((e) => '### ' + (e.comment || '条目') + '\n' + String(e.content || '').trim())
          .join('\n\n') +
        '\n\n'
      );
    }

    async function generateStoryRound(userInput) {
      await checkAndControlUIDs();
      const fullUserInput = buildPromptPrefix(userInput);
      currentStreamingContent = '';
      setGalBusy(true, '正在生成正文');
      try {
        const tavernGenerateFunc = window.parent.TavernHelper.generate;
        const aiResponse = await tavernGenerateFunc({
          user_input: fullUserInput,
          should_stream: true,
          disable_extras: true,
        });
        await new Promise((resolve) => setTimeout(resolve, 200));
        return currentStreamingContent.trim() || aiResponse || '';
      } finally {
        setGalBusy(false);
      }
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
        if (!lastLayer.varsSnapshot) {
          lastLayer.varsSnapshot = JSON.parse(JSON.stringify(ERA.currentVars || ERA.defaultVars));
        }
        mutator(lastLayer.varsSnapshot);
        ERA.currentVars = lastLayer.varsSnapshot;
        ERA.cache.vars = lastLayer.varsSnapshot;
        if (typeof ERA.insertByObject === 'function') {
          ERA.insertByObject(lastLayer.varsSnapshot);
        }
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
        console.log('[REQUEST] 自动注入:', tags.join(' '));
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
    function buildPromptPrefix(userInput = '') {
      const userInputWithRequests = appendAutoRequestTags(userInput);
      const dialogueHistory = buildDialogueHistory();
      const story = getStoryParams();
      const targetChars = Math.round(Number(story.targetChars) || 0);
      const storyPrompt = String(story.prompt || '').trim();

      let prefix = '';

      if (storyPrompt) {
        prefix += storyPrompt + '\n\n';
      }

      prefix += collectActivatedWorldbookText(userInput);

      // 1. 用户输入（D0位置，第一优先）
      if (userInputWithRequests && userInputWithRequests.trim()) {
        prefix += `## 用户输入（第一优先）\n\n${userInputWithRequests}\n\n`;
      }

      if (targetChars > 0) {
        prefix += `正文目标字数：${targetChars}\n\n`;
      }

      // 2. 对话历史
      prefix += dialogueHistory + '\n';

      // 如果已经有用户输入，就不需要"请继续对话"提示
      if (!userInputWithRequests || !userInputWithRequests.trim()) {
        prefix += '## 请继续对话\n\n';
      }

      // 在控制台输出构建的提示词（用于调试）
      console.log('═══════════════════════════════════════════════════════');
      console.log('📤 buildPromptPrefix 被调用 - 构建发送给AI的提示词');
      console.log('═══════════════════════════════════════════════════════');
      if (userInputWithRequests && userInputWithRequests.trim()) {
        console.log('【用户输入（第一优先，D0位置）】');
        console.log(userInputWithRequests);
        console.log('───────────────────────────────────────────────────────');
      }
      console.log('【对话历史】');
      console.log(dialogueHistory);
      console.log('───────────────────────────────────────────────────────');
      console.log('【完整提示词（发送给AI的完整内容）】');
      console.log(prefix);
      console.log('═══════════════════════════════════════════════════════');

      return prefix;
    }

    // 监听来自SillyTavern的消息
    function setupMessageListener() {
      // 监听流式消息事件
      if (window.eventOn && typeof window.eventOn === 'function') {
        let accumulatedContent = '';

        window.eventOn('js_stream_token_received_incrementally', async (chunk) => {
          accumulatedContent += chunk;
          // 流式传输时不更新UI，只累积内容（等待完整消息）
        });

        // 监听消息完成事件（如果有）
        if (window.eventOn) {
          window.eventOn('js_message_complete', async (fullContent) => {
            accumulatedContent = fullContent || '';

            // 在控制台输出捕获到的AI回复（展开显示）
            console.log('═══════════════════════════════════════════════════════');
            console.log('📥 捕获到AI回复');
            console.log('═══════════════════════════════════════════════════════');
            console.log('原始内容:', accumulatedContent);
            console.log('───────────────────────────────────────────────────────');

            // 解析标签
            const parsed = parseTags(accumulatedContent);
            console.log('解析结果:', parsed);
            console.log('───────────────────────────────────────────────────────');

            if (parsed.maintext) {
              const dialogues = parseTolinaDialogues(parsed.maintext);
              console.log(`✅ 解析到 ${dialogues.length} 段对话:`);
              dialogues.forEach((dialogue, index) => {
                console.log(`  对话 ${index + 1}:`, {
                  角色: dialogue.character,
                  表情: dialogue.expression,
                  对话: dialogue.dialogue,
                  背景: dialogue.background,
                  立绘标签: dialogue.baseKey
                });
              });
            } else {
              console.log('⚠️ 没有对话文本 (maintext)');
            }

            if (parsed.branches) {
              console.log('✅ 分支选项:', parsed.branches);
            }

            if (parsed.variables) {
              console.log('✅ 变量更新:', parsed.variables);
            }

            if (parsed.snapshots) {
              console.log('✅ 快照:', parsed.snapshots);
            }

            console.log('═══════════════════════════════════════════════════════');

            try {
              // 使用processMessage处理完整消息（会输出详细的捕获信息）
              await processMessage(accumulatedContent);
            } catch (e) {
                errorWithTag('MSG', '处理完整消息失败', e);
            }
            accumulatedContent = ''; // 重置
          });
        }
      }

      // 如果可以直接访问父窗口的消息，也可以在这里监听
      if (checkIfInIframe() && checkTavernHelper()) {
        logWithTag('INIT', '✅ SillyTavern环境检测通过，已设置消息监听器');
      } else {
        warnWithTag('INIT', '⚠️ 警告：不在SillyTavern iframe环境中，消息监听器可能无法正常工作');
      }

      // 监听发送消息前的事件，注入变量说明和对话历史
      if (window.eventOn && typeof window.eventOn === 'function') {
        console.log('[INIT] 正在注册 js_before_send_message 事件监听器...');
        window.eventOn('js_before_send_message', async (message) => {
          console.log('[EVENT] ⚡ js_before_send_message 事件被触发！');
          console.log('[EVENT] 消息对象:', message);

          try {
            // 发送给AI之前，检测并控制 UID
            await checkAndControlUIDs();
            if (message && message.text) {
              const originalText = message.text;
              message.text = buildPromptPrefix(originalText);
              logWithTag('PROMPT', '已注入正文提示词');
            } else {
              console.warn('[EVENT] ⚠️ 消息对象中没有 text 字段:', message);
            }
          } catch (e) {
            console.error('[EVENT] ❌ 处理消息失败:', e);
            errorWithTag('PROMPT', '注入提示词前缀失败', e);
          }
          return message;
        });
        console.log('[INIT] ✅ js_before_send_message 事件监听器已注册');
      } else {
        console.warn('[INIT] ⚠️ window.eventOn 不可用，无法注册 js_before_send_message 事件监听器');
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
      if (lastLayer?.varsSnapshot) {
        for (const p of paths) {
          const v = getNestedValue(lastLayer.varsSnapshot, p);
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
        console.warn('[UID] setGameMode 后同步世界书（UID33/43）失败:', e);
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
      console.log('[LOAD] 游戏模式:', mode);
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

      if (!checkTavernHelper()) {
        console.warn('[world-map] TavernHelper 不可用，已仅更新地点变量');
        return;
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
      console.log('[INIT] DOMContentLoaded 事件触发，开始初始化...');
      if (window.妹神官_settings_variable && typeof window.妹神官_settings_variable.init === 'function') {
        window.妹神官_settings_variable.init();
      }
      setupStreamListener();
      console.log('[INIT] setupStreamListener 完成');
      setupMessageListener();
      console.log('[INIT] setupMessageListener 完成');
      setupDialogueClickListeners();
      console.log('[INIT] setupDialogueClickListeners 完成');
      setupSaveFunctionality();
      console.log('[INIT] setupSaveFunctionality 完成');
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
            if (lastLayer?.varsSnapshot) {
              const v = getNestedValue(lastLayer.varsSnapshot, '托莉娜.基础.堕落阶段');
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
        console.log('[INIT] MeishinkanWorldMap 已初始化');

        if (DEBUG_SKIP_TO_WORLD_MAP) {
          hideBootScreens();
          await MeishinkanWorldMap.open();
          console.log('[DEBUG] 已直接打开世界地图');
        }
      }

      // 延迟检查环境
      setTimeout(() => {
        if (checkIfInIframe()) {
          logWithTag('INIT', '✅ 检测到在iframe中运行');
          if (checkTavernHelper()) {
            logWithTag('INIT', '✅ TavernHelper可用');
          } else {
            warnWithTag('INIT', '⚠️ TavernHelper不可用');
          }
        } else {
          warnWithTag('INIT', '⚠️ 不在iframe中运行');
        }
      }, 500);
    });

  

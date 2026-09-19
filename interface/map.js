/* ========== 地图/map.js ========== */
/**
 * 世界地图：单图平移缩放 + 热区 + 地点列表。
 * 依赖 index.js 注入：onTravel(location)
 */
(function (global) {
  /** @typedef {{ x:number, y:number, zoom?:number }} MapAnchor */
  /** @typedef {{ x:number, y:number, zoom:number }} MapFocus */
  /** @typedef {{ type:'circle', x:number, y:number, r:number }} MapHotspot */
  /** @typedef {{ url:string }} MapLocationOverlay */
  /** @typedef {{ id:string, name:string, mapId?:string, user?:MapFocus, torina?:MapAnchor, focus:MapFocus, hotspot:MapHotspot, overlay?:MapLocationOverlay }} MapLocation */
  /** @typedef {{ id:string, name:string, mapId?:string, defaultExpanded?:boolean, locationIds:string[] }} MapDistrict */
  /** @typedef {{ id:string, imageUrl:string, imageWidth?:number, imageHeight?:number, stackOrder?:number, stackGapAfter?:number, offsetX?:number, offsetY?:number, alignBottomToTopOf?:string, alignTopLeftOf?:string }} MapSheetDef */
  /** @typedef {{ offsetX:number, offsetY:number, sheetWidth:number, sheetHeight:number, imageUrl:string, imageWidth:number, imageHeight:number }} MapSheetLayout */
  /** @typedef {{ imageUrl?:string, imageWidth?:number, imageHeight?:number, stageWidth?:number, stageScale?:number, scaleReferenceMapId?:string, overviewFocus?:MapFocus, focusDurationMs?:number, maps?:MapSheetDef[], districts?:MapDistrict[], locations:MapLocation[] }} MapConfig */

  const CONFIG_URL = 'resource/map-locations.json';
  const CLOSE_BTN_URL = 'https://files.catbox.moe/hkgfil.png';
  /** 同地点时玩家/托莉娜头像水平错开基准（归一化坐标，随头像尺寸缩放） */
  const ACTOR_SAME_PLACE_SPREAD_BASE = 0.028;
  /** 手机短边约 400px 时头像占地图宽度比例（用户反馈此尺寸合适） */
  const ACTOR_SIZE_REF_VMIN = 400;
  const ACTOR_SIZE_BASE_PERCENT = 4;
  const ACTOR_SIZE_MIN_PERCENT = 2;
  const ACTOR_SIZE_MAX_PERCENT = 4.2;
  const ACTOR_FACES = {
    player: 'https://files.catbox.moe/h4is4m.png',
    torina1: 'https://files.catbox.moe/s9r98y.png',
    torina3: 'https://files.catbox.moe/r1vurn.png',
    torina4: 'https://files.catbox.moe/do2931.png',
  };

  /** @type {MapConfig|null} */
  let config = null;
  /** @type {{ onTravel?: (loc: MapLocation) => Promise<void>, getCurrentLocation?: () => Promise<string|null|undefined>, getTorinaLocation?: () => Promise<string|null|undefined>, getCorruptionStage?: () => Promise<number|null|undefined> }|null} */
  let deps = null;
  /** @type {HTMLElement|null} */
  let overlay = null;
  /** @type {HTMLElement|null} */
  let viewport = null;
  /** @type {HTMLElement|null} */
  let stage = null;
  /** @type {HTMLElement|null} */
  let marker = null;
  /** @type {boolean} */
  let busy = false;
  /** @type {string|null} */
  let activeId = null;
  /** @type {string|null} 左侧列表/预览选中的目的地 */
  let selectedId = null;
  /** @type {string|null} 玩家实际所在地点 id */
  let playerLocationId = null;
  /** @type {number} */
  let baseFitScale = 1;
  /** @type {{ tx:number, ty:number, scale:number }} */
  let currentTransform = { tx: 0, ty: 0, scale: 1 };
  /** @type {number|null} */
  let focusAnimRafId = null;
  /** @type {string} */
  let savedHtmlOverflow = '';
  /** @type {string} */
  let savedBodyOverflow = '';
  /** @type {Set<string>} */
  let expandedDistrictIds = new Set();
  /** @type {{ stageWidth:number, stageHeight:number, stageOriginY:number, maps:Record<string, MapSheetLayout> }} */
  let stageLayout = { stageWidth: 0, stageHeight: 0, stageOriginY: 0, maps: {} };
  /** @type {Set<string>} */
  let loadedSheetIds = new Set();
  /** @type {number|null} */
  let neighborPreloadTimer = null;
  /** @type {ResizeObserver|null} */
  let viewportResizeObserver = null;

  function lockPageScroll(lock) {
    const html = document.documentElement;
    const body = document.body;
    if (lock) {
      savedHtmlOverflow = html.style.overflow;
      savedBodyOverflow = body.style.overflow;
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
    } else {
      html.style.overflow = savedHtmlOverflow;
      body.style.overflow = savedBodyOverflow;
    }
  }

  function bindOverlayRefs(el) {
    overlay = el;
    viewport = el.querySelector('.world-map-viewport');
    stage = el.querySelector('.world-map-stage');
    marker = el.querySelector('.world-map-marker');
    overlay._worldMapParts = {
      sidebar: el.querySelector('.world-map-sidebar'),
      img: el.querySelector('.world-map-image'),
      hotspots: el.querySelector('.world-map-hotspots'),
      locationOverlays: el.querySelector('.world-map-location-overlays'),
      actorPlayer: el.querySelector('.world-map-actor-player'),
      actorTorina: el.querySelector('.world-map-actor-torina'),
      travelBtn: el.querySelector('.world-map-travel-btn'),
      mapStack: el.querySelector('.world-map-map-stack'),
    };
  }

  /**
   * @param {MapConfig} raw
   * @returns {MapConfig}
   */
  function normalizeConfig(raw) {
    /** @type {MapConfig} */
    const cfg = { ...raw, locations: [...raw.locations], districts: raw.districts ? [...raw.districts] : undefined };
    if (!cfg.maps?.length) {
      cfg.maps = [
        {
          id: 'xicheng',
          imageUrl: cfg.imageUrl || '',
          imageWidth: cfg.imageWidth || 3456,
          imageHeight: cfg.imageHeight || 4080,
        },
      ];
    }
    if (!cfg.stageWidth) {
      const widths = cfg.maps.map(m => m.imageWidth).filter(w => w != null && w > 0);
      cfg.stageWidth = widths.length ? Math.max(...widths) : 3456;
    }
    for (const loc of cfg.locations) {
      if (!loc.mapId) loc.mapId = 'xicheng';
    }
    return cfg;
  }

  /**
   * @param {MapConfig} cfg
   * @returns {MapSheetDef[]}
   */
  function getMapsInStackOrder(cfg) {
    return [...cfg.maps].sort((a, b) => {
      const ao = a.stackOrder ?? cfg.maps.indexOf(a);
      const bo = b.stackOrder ?? cfg.maps.indexOf(b);
      return ao - bo;
    });
  }

  /**
   * 全地图统一缩放：以西城区（或 scaleReferenceMapId）为基准，避免各图被拉成同宽导致比例不一
   * @param {MapConfig} cfg
   * @returns {number}
   */
  function getStageScale(cfg) {
    if (cfg.stageScale != null && Number.isFinite(cfg.stageScale)) return cfg.stageScale;
    const refId = cfg.scaleReferenceMapId || 'xicheng';
    const refMap = cfg.maps.find(m => m.id === refId) || cfg.maps[cfg.maps.length - 1];
    const targetWidth = cfg.stageWidth || refMap.imageWidth;
    return targetWidth / refMap.imageWidth;
  }

  /**
   * @param {MapConfig} cfg
   */
  function buildStageLayout(cfg) {
    const stageScale = getStageScale(cfg);
    const ordered = getMapsInStackOrder(cfg);
    let autoOffsetY = 0;
    let totalStageWidth = 0;
    let minY = 0;
    let maxY = 0;
    /** @type {Record<string, MapSheetLayout>} */
    const maps = {};

    for (const mapDef of ordered) {
      const iw = mapDef.imageWidth || cfg.stageWidth || 3456;
      const ih = mapDef.imageHeight || cfg.imageHeight || 4080;
      const sheetWidth = iw * stageScale;
      const sheetHeight = ih * stageScale;
      let offsetX = mapDef.offsetX ?? 0;
      let offsetY;

      if (mapDef.alignTopLeftOf) {
        const target = maps[mapDef.alignTopLeftOf];
        if (!target) {
          console.warn(`[world-map] alignTopLeftOf 目标未找到: ${mapDef.alignTopLeftOf}`);
          offsetY = mapDef.offsetY ?? autoOffsetY;
        } else {
          offsetX = target.offsetX + (mapDef.offsetX ?? 0);
          offsetY = target.offsetY + (mapDef.offsetY ?? 0);
        }
      } else if (mapDef.alignBottomToTopOf) {
        const target = maps[mapDef.alignBottomToTopOf];
        if (!target) {
          console.warn(`[world-map] alignBottomToTopOf 目标未找到: ${mapDef.alignBottomToTopOf}`);
          offsetY = mapDef.offsetY ?? autoOffsetY;
        } else {
          offsetY = target.offsetY - sheetHeight + (mapDef.offsetY ?? 0);
        }
      } else if (mapDef.offsetY != null) {
        offsetY = mapDef.offsetY;
      } else {
        offsetY = autoOffsetY;
      }

      maps[mapDef.id] = {
        offsetX,
        offsetY,
        sheetWidth,
        sheetHeight,
        imageUrl: mapDef.imageUrl,
        imageWidth: iw,
        imageHeight: ih,
      };
      totalStageWidth = Math.max(totalStageWidth, offsetX + sheetWidth);
      minY = Math.min(minY, offsetY);
      maxY = Math.max(maxY, offsetY + sheetHeight);
      if (mapDef.offsetY == null && !mapDef.alignBottomToTopOf && !mapDef.alignTopLeftOf) {
        autoOffsetY += sheetHeight + (mapDef.stackGapAfter ?? 0);
      }
    }

    const stageOriginY = minY;
    stageLayout = {
      stageWidth: totalStageWidth,
      stageHeight: Math.max(maxY - stageOriginY, autoOffsetY - stageOriginY),
      stageOriginY,
      maps,
    };
  }

  /**
   * @param {MapLocation} loc
   * @returns {string}
   */
  function getLocMapId(loc) {
    return loc.mapId || 'xicheng';
  }

  /**
   * @param {MapLocation} loc
   * @param {number} nx
   * @param {number} ny
   * @returns {{ x:number, y:number }}
   */
  function globalPointFromLocal(loc, nx, ny) {
    const mapId = getLocMapId(loc);
    const meta = stageLayout.maps[mapId];
    if (!meta) return { x: nx * stageLayout.stageWidth, y: ny * stageLayout.stageHeight };
    return {
      x: meta.offsetX + nx * meta.sheetWidth,
      y: meta.offsetY + ny * meta.sheetHeight,
    };
  }

  /**
   * @param {MapLocation} loc
   * @param {number} nx
   * @param {number} ny
   * @returns {{ x:number, y:number }}
   */
  function globalNormFromLocal(loc, nx, ny) {
    const pt = globalPointFromLocal(loc, nx, ny);
    return {
      x: pt.x / stageLayout.stageWidth,
      y: (pt.y - stageLayout.stageOriginY) / stageLayout.stageHeight,
    };
  }

  /**
   * @param {MapLocation} loc
   * @returns {MapFocus}
   */
  function getUserFocus(loc) {
    if (loc.user) {
      return { x: loc.user.x, y: loc.user.y, zoom: loc.user.zoom ?? loc.focus?.zoom ?? 2.4 };
    }
    return loc.focus;
  }

  /**
   * @param {MapLocation} loc
   * @returns {{ x:number, y:number }}
   */
  function getUserAnchor(loc) {
    const u = loc.user || loc.focus;
    return { x: u.x, y: u.y };
  }

  /**
   * @param {MapLocation} loc
   * @returns {{ x:number, y:number }}
   */
  function getTorinaAnchor(loc) {
    if (loc.torina) return { x: loc.torina.x, y: loc.torina.y };
    return getUserAnchor(loc);
  }

  /**
   * @param {string|null|undefined} name
   * @returns {MapLocation|null}
   */
  function findLocationByName(name) {
    if (!config || name == null || !String(name).trim()) return null;
    const key = String(name).trim();
    return config.locations.find(l => l.name === key || l.id === key) || null;
  }

  /**
   * @param {number|null|undefined} stage
   * @returns {string}
   */
  function resolveTorinaFaceUrl(stage) {
    const s = Number(stage);
    if (s >= 4) return ACTOR_FACES.torina4;
    if (s >= 3) return ACTOR_FACES.torina3;
    return ACTOR_FACES.torina1;
  }

  /**
   * 按视口短边与地点所属地图在合成画布中的宽度占比计算头像宽度（stage 百分比）。
   * 多地图拼接后 stage 很宽，须按单张地图占比缩放，否则聚焦某城区时头像会过大。
   * @param {MapLocation|null} [loc]
   * @returns {number}
   */
  function computeActorSizePercent(loc) {
    const mapId = loc ? getLocMapId(loc) : 'xicheng';
    const meta = stageLayout.maps[mapId];
    const sheetFraction =
      meta?.sheetWidth && stageLayout.stageWidth > 0
        ? meta.sheetWidth / stageLayout.stageWidth
        : 1;

    const { width, height } = getViewportSize();
    const vmin = Math.min(width, height);
    if (vmin <= 0) return ACTOR_SIZE_BASE_PERCENT * sheetFraction;
    const ratio = ACTOR_SIZE_REF_VMIN / vmin;
    const percent = ACTOR_SIZE_BASE_PERCENT * sheetFraction * Math.sqrt(ratio);
    const minP = ACTOR_SIZE_MIN_PERCENT * sheetFraction;
    const maxP = ACTOR_SIZE_MAX_PERCENT * sheetFraction;
    return Math.min(maxP, Math.max(minP, percent));
  }

  /**
   * 同地点左右错开量，随头像尺寸同比缩放
   * @param {MapLocation} loc
   * @returns {number}
   */
  function computeActorSamePlaceSpread(loc) {
    return ACTOR_SAME_PLACE_SPREAD_BASE * (computeActorSizePercent(loc) / ACTOR_SIZE_BASE_PERCENT);
  }

  /**
   * @param {MapLocation} userLoc
   * @param {MapLocation} torinaLoc
   */
  function applyActorSizes(userLoc, torinaLoc) {
    const parts = overlay?._worldMapParts;
    if (!parts?.actorPlayer || !parts?.actorTorina) return;
    parts.actorPlayer.style.width = `${computeActorSizePercent(userLoc)}%`;
    parts.actorTorina.style.width = `${computeActorSizePercent(torinaLoc)}%`;
  }

  /**
   * @param {HTMLElement|null} el
   * @param {number} x
   * @param {number} y
   */
  function placeActorEl(el, x, y) {
    if (!el) return;
    el.style.left = `${x * 100}%`;
    el.style.top = `${y * 100}%`;
    el.classList.add('is-visible');
  }

  async function updateActorMarkers() {
    if (!config || !overlay || overlay.classList.contains('hidden')) return;
    const parts = overlay._worldMapParts;
    if (!parts?.actorPlayer || !parts?.actorTorina) return;

    let userLocName = null;
    let torinaLocName = null;
    let corruptionStage = 1;

    if (deps?.getCurrentLocation) {
      try {
        userLocName = await Promise.resolve(deps.getCurrentLocation());
      } catch (err) {
        console.warn('[world-map] 读取玩家地点失败:', err);
      }
    }
    if (deps?.getTorinaLocation) {
      try {
        torinaLocName = await Promise.resolve(deps.getTorinaLocation());
      } catch (err) {
        console.warn('[world-map] 读取托莉娜地点失败:', err);
      }
    }
    if (deps?.getCorruptionStage) {
      try {
        corruptionStage = Number(await Promise.resolve(deps.getCorruptionStage())) || 1;
      } catch (err) {
        console.warn('[world-map] 读取堕落阶段失败:', err);
      }
    }

    const userLoc =
      findLocationByName(userLocName) ||
      findLocationByName('家') ||
      config.locations[0];
    if (!userLoc) return;

    const torinaLoc = torinaLocName ? findLocationByName(torinaLocName) : null;
    const userAnchor = getUserAnchor(userLoc);

    parts.actorPlayer.src = ACTOR_FACES.player;
    parts.actorPlayer.alt = '玩家';
    parts.actorTorina.src = resolveTorinaFaceUrl(corruptionStage);
    parts.actorTorina.alt = '托莉娜';

    if (!torinaLoc) {
      applyActorSizes(userLoc, userLoc);
      const userNorm = globalNormFromLocal(userLoc, userAnchor.x, userAnchor.y);
      placeActorEl(parts.actorPlayer, userNorm.x, userNorm.y);
      parts.actorTorina.classList.remove('is-visible');
      return;
    }

    const torinaAnchor = getTorinaAnchor(torinaLoc);
    const samePlace = userLoc.id === torinaLoc.id;

    applyActorSizes(userLoc, torinaLoc);
    const spreadLocal = computeActorSamePlaceSpread(userLoc);

    if (samePlace) {
      const userNorm = globalNormFromLocal(userLoc, userAnchor.x, userAnchor.y);
      const spreadGlobalX = (spreadLocal * stageLayout.stageWidth) / stageLayout.stageWidth;
      placeActorEl(parts.actorPlayer, userNorm.x - spreadGlobalX, userNorm.y);
      placeActorEl(parts.actorTorina, userNorm.x + spreadGlobalX, userNorm.y);
    } else {
      const userNorm = globalNormFromLocal(userLoc, userAnchor.x, userAnchor.y);
      const torinaNorm = globalNormFromLocal(torinaLoc, torinaAnchor.x, torinaAnchor.y);
      placeActorEl(parts.actorPlayer, userNorm.x, userNorm.y);
      placeActorEl(parts.actorTorina, torinaNorm.x, torinaNorm.y);
    }
  }

  /**
   * @param {MapLocation|null} loc
   */
  function updateLocationOverlay(loc) {
    const stack = overlay?._worldMapParts?.mapStack;
    if (!stack) return;
    stack.querySelectorAll('.world-map-location-overlay').forEach(img => {
      const active = !!loc && loc.id === img.dataset.locationId;
      img.classList.toggle('is-visible', active);
      img.classList.toggle('is-pulsing', active);
    });
  }

  /**
   * @param {string|null|undefined} mapId
   */
  function loadSheetImage(mapId) {
    if (!mapId || loadedSheetIds.has(mapId)) return;
    const sheet = overlay?._worldMapParts?.mapStack?.querySelector(`.world-map-sheet[data-map-id="${mapId}"]`);
    const img = sheet?.querySelector('.world-map-image');
    if (!(img instanceof HTMLImageElement) || !img.dataset.src) return;
    loadedSheetIds.add(mapId);
    img.src = img.dataset.src;
  }

  /**
   * @param {MapLocation|null|undefined} loc
   */
  function loadLocationOverlay(loc) {
    if (!loc?.overlay?.url || !overlay) return;
    const img = overlay.querySelector(`.world-map-location-overlay[data-location-id="${loc.id}"]`);
    if (!(img instanceof HTMLImageElement) || img.dataset.loaded === '1') return;
    img.dataset.loaded = '1';
    img.src = img.dataset.src || loc.overlay.url;
  }

  /**
   * @param {string} currentMapId
   */
  function scheduleNeighborSheetPreload(currentMapId) {
    if (neighborPreloadTimer != null) {
      clearTimeout(neighborPreloadTimer);
      neighborPreloadTimer = null;
    }
    if (!config?.maps?.length) return;
    neighborPreloadTimer = window.setTimeout(() => {
      neighborPreloadTimer = null;
      for (const mapDef of config?.maps || []) {
        if (mapDef.id !== currentMapId) loadSheetImage(mapDef.id);
      }
    }, 400);
  }

  function cancelNeighborSheetPreload() {
    if (neighborPreloadTimer == null) return;
    clearTimeout(neighborPreloadTimer);
    neighborPreloadTimer = null;
  }

  /**
   * @param {MapLocation} loc
   * @param {boolean} animate
   * @returns {Promise<void>}
   */
  async function setActiveLocationView(loc, animate) {
    activeId = loc.id;
    setSidebarActive(loc.id);
    loadSheetImage(getLocMapId(loc));
    loadLocationOverlay(loc);
    if (loc.overlay?.url) {
      hideMarker();
      updateLocationOverlay(loc);
    } else {
      updateLocationOverlay(null);
      showMarker(loc);
    }
    await applyFocusForLocation(loc, animate);
    await updateActorMarkers();
  }

  /**
   * @param {number} normX
   * @param {number} normY
   * @param {number} zoom
   * @returns {{ tx:number, ty:number, scale:number }}
   */
  function computeTransformGlobal(normX, normY, zoom) {
    if (!config) return { tx: 0, ty: 0, scale: baseFitScale };
    const vp = getViewportSize();
    const scale = baseFitScale * (zoom || 1);
    const fx = normX * stageLayout.stageWidth;
    const fy = normY * stageLayout.stageHeight;
    return {
      tx: vp.width / 2 - fx * scale,
      ty: vp.height / 2 - fy * scale,
      scale,
    };
  }

  /**
   * @param {MapLocation} loc
   * @returns {{ tx:number, ty:number, scale:number }}
   */
  function computeTransformForLocation(loc) {
    const focus = getUserFocus(loc);
    const norm = globalNormFromLocal(loc, focus.x, focus.y);
    return computeTransformGlobal(norm.x, norm.y, focus.zoom || 1);
  }

  /**
   * @param {number} t 0..1
   */
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /**
   * @param {{ tx:number, ty:number, scale:number }} t
   */
  function applyTransformImmediate(t) {
    if (!stage) return;
    currentTransform = t;
    stage.style.transform = `translate3d(${t.tx}px, ${t.ty}px, 0) scale(${t.scale})`;
  }

  function setCameraMoving(moving) {
    overlay?.classList.toggle('is-camera-moving', moving);
  }

  /** overlay 隐藏时 getBoundingClientRect 为 0，改用窗口尺寸 */
  function getViewportSize() {
    if (viewport) {
      const rect = viewport.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        return { width: rect.width, height: rect.height };
      }
    }
    return { width: window.innerWidth, height: window.innerHeight };
  }

  /**
   * @param {MapLocation} loc
   * @returns {Promise<void>}
   */
  function animateFocusToLocation(loc) {
    return new Promise(resolve => {
      if (!stage) {
        resolve();
        return;
      }
      if (focusAnimRafId != null) {
        cancelAnimationFrame(focusAnimRafId);
        focusAnimRafId = null;
      }

      const target = computeTransformForLocation(loc);
      const start = { ...currentTransform };
      const duration = config?.focusDurationMs ?? 1100;
      const t0 = performance.now();

      setCameraMoving(true);

      function tick(now) {
        const elapsed = now - t0;
        const progress = Math.min(1, elapsed / duration);
        const eased = easeInOutCubic(progress);

        applyTransformImmediate({
          tx: start.tx + (target.tx - start.tx) * eased,
          ty: start.ty + (target.ty - start.ty) * eased,
          scale: start.scale + (target.scale - start.scale) * eased,
        });

        if (progress < 1) {
          focusAnimRafId = requestAnimationFrame(tick);
          return;
        }

        focusAnimRafId = null;
        setCameraMoving(false);
        resolve();
      }

      focusAnimRafId = requestAnimationFrame(tick);
    });
  }

  /**
   * @param {MapLocation} loc
   * @param {boolean} animate
   * @returns {Promise<void>}
   */
  function applyFocusForLocation(loc, animate) {
    if (!stage) return Promise.resolve();
    if (animate) return animateFocusToLocation(loc);
    if (focusAnimRafId != null) {
      cancelAnimationFrame(focusAnimRafId);
      focusAnimRafId = null;
      setCameraMoving(false);
    }
    applyTransformImmediate(computeTransformForLocation(loc));
    return Promise.resolve();
  }

  /**
   * @param {MapFocus} focus 全画布归一化坐标 (0-1)
   * @param {boolean} animate
   * @returns {Promise<void>}
   */
  function applyFocusOverview(focus, animate) {
    if (!stage) return Promise.resolve();
    const apply = () => applyTransformImmediate(computeTransformGlobal(focus.x, focus.y, focus.zoom || 1));
    if (!animate) {
      if (focusAnimRafId != null) {
        cancelAnimationFrame(focusAnimRafId);
        focusAnimRafId = null;
        setCameraMoving(false);
      }
      apply();
      return Promise.resolve();
    }
    return new Promise(resolve => {
      if (focusAnimRafId != null) {
        cancelAnimationFrame(focusAnimRafId);
        focusAnimRafId = null;
      }
      const target = computeTransformGlobal(focus.x, focus.y, focus.zoom || 1);
      const start = { ...currentTransform };
      const duration = config?.focusDurationMs ?? 1100;
      const t0 = performance.now();
      setCameraMoving(true);
      function tick(now) {
        const progress = Math.min(1, (now - t0) / duration);
        const eased = easeInOutCubic(progress);
        applyTransformImmediate({
          tx: start.tx + (target.tx - start.tx) * eased,
          ty: start.ty + (target.ty - start.ty) * eased,
          scale: start.scale + (target.scale - start.scale) * eased,
        });
        if (progress < 1) {
          focusAnimRafId = requestAnimationFrame(tick);
          return;
        }
        focusAnimRafId = null;
        setCameraMoving(false);
        resolve();
      }
      focusAnimRafId = requestAnimationFrame(tick);
    });
  }

  /**
   * @param {MapLocation|null} loc
   */
  function showMarker(loc) {
    if (!marker || !loc) return;
    const anchor = getUserAnchor(loc);
    const norm = globalNormFromLocal(loc, anchor.x, anchor.y);
    marker.style.left = `${norm.x * 100}%`;
    marker.style.top = `${norm.y * 100}%`;
    marker.classList.add('is-visible');
  }

  function hideMarker() {
    marker?.classList.remove('is-visible');
  }

  function setSidebarActive(id) {
    if (!overlay) return;
    overlay.querySelectorAll('.world-map-loc-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.locationId === id);
    });
  }

  function setSidebarDisabled(disabled) {
    if (!overlay) return;
    overlay.querySelectorAll('.world-map-loc-btn, .world-map-district-btn, .world-map-hotspot').forEach(el => {
      if (el instanceof HTMLButtonElement) el.disabled = disabled;
      else el.style.pointerEvents = disabled ? 'none' : 'auto';
    });
    const travelBtn = overlay._worldMapParts?.travelBtn;
    if (travelBtn instanceof HTMLButtonElement) {
      if (disabled) travelBtn.disabled = true;
      else updateTravelButton();
    }
  }

  /**
   * @param {MapConfig} cfg
   * @returns {MapDistrict[]}
   */
  function resolveDistricts(cfg) {
    if (cfg.districts?.length) return cfg.districts;
    return [
      {
        id: 'xicheng',
        name: '西城区',
        defaultExpanded: true,
        locationIds: cfg.locations.map(l => l.id),
      },
    ];
  }

  /**
   * @param {MapConfig} cfg
   */
  function initDistrictExpandedState(cfg) {
    expandedDistrictIds = new Set();
    for (const district of resolveDistricts(cfg)) {
      if (district.defaultExpanded !== false) expandedDistrictIds.add(district.id);
    }
  }

  /**
   * @param {string} districtId
   */
  function toggleDistrict(districtId) {
    if (busy) return;
    if (expandedDistrictIds.has(districtId)) expandedDistrictIds.delete(districtId);
    else expandedDistrictIds.add(districtId);

    const group = overlay?.querySelector(`.world-map-district-group[data-district-id="${districtId}"]`);
    if (!group) return;
    const expanded = expandedDistrictIds.has(districtId);
    const wrap = group.querySelector('.world-map-district-children-wrap');
    const districtBtn = group.querySelector('.world-map-district-btn');
    if (wrap instanceof HTMLElement) wrap.classList.toggle('is-expanded', expanded);
    if (districtBtn) districtBtn.setAttribute('aria-expanded', String(expanded));
  }

  /**
   * @param {MapLocation} loc
   * @returns {HTMLButtonElement}
   */
  function createLocationButton(loc) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'world-map-loc-btn world-map-loc-btn-sub';
    btn.dataset.locationId = loc.id;
    btn.textContent = loc.name;
    btn.addEventListener('click', () => void previewLocation(loc));
    return btn;
  }

  /**
   * @param {MapConfig} cfg
   * @param {{ sidebar: HTMLElement }} parts
   */
  function renderDistrictSidebar(cfg, parts) {
    const locById = new Map(cfg.locations.map(l => [l.id, l]));

    for (const district of resolveDistricts(cfg)) {
      const expanded = expandedDistrictIds.has(district.id);
      const group = document.createElement('div');
      group.className = 'world-map-district-group';
      group.dataset.districtId = district.id;

      const districtBtn = document.createElement('button');
      districtBtn.type = 'button';
      districtBtn.className = 'world-map-district-btn';
      districtBtn.dataset.districtId = district.id;
      districtBtn.setAttribute('aria-expanded', String(expanded));

      const chevron = document.createElement('span');
      chevron.className = 'world-map-district-chevron';
      chevron.textContent = '▼';
      chevron.setAttribute('aria-hidden', 'true');

      const name = document.createElement('span');
      name.className = 'world-map-district-name';
      name.textContent = district.name;

      districtBtn.append(chevron, name);
      districtBtn.addEventListener('click', () => toggleDistrict(district.id));

      const childrenWrap = document.createElement('div');
      childrenWrap.className = 'world-map-district-children-wrap';
      if (expanded) childrenWrap.classList.add('is-expanded');

      const childrenInner = document.createElement('div');
      childrenInner.className = 'world-map-district-children-inner';

      const children = document.createElement('div');
      children.className = 'world-map-district-children';

      for (const locId of district.locationIds) {
        const loc = locById.get(locId);
        if (loc) children.appendChild(createLocationButton(loc));
      }

      childrenInner.appendChild(children);
      childrenWrap.appendChild(childrenInner);
      group.append(districtBtn, childrenWrap);
      parts.sidebar.appendChild(group);
    }
  }

  async function refreshPlayerLocationId() {
    let userLocName = null;
    if (deps?.getCurrentLocation) {
      try {
        userLocName = await Promise.resolve(deps.getCurrentLocation());
      } catch (err) {
        console.warn('[world-map] 读取玩家地点失败:', err);
      }
    }
    const loc =
      findLocationByName(userLocName) ||
      findLocationByName('家') ||
      config?.locations[0] ||
      null;
    playerLocationId = loc?.id ?? null;
  }

  function updateTravelButton() {
    const btn = overlay?._worldMapParts?.travelBtn;
    if (!(btn instanceof HTMLButtonElement)) return;
    const loc = selectedId ? config?.locations.find(l => l.id === selectedId) : null;
    const isSamePlace = !!loc && loc.id === playerLocationId;
    btn.disabled = busy || !loc || isSamePlace;
    if (!loc) {
      btn.textContent = '移动到此地';
      return;
    }
    btn.textContent = isSamePlace ? `已在：${loc.name}` : `移动到此地：${loc.name}`;
  }

  /**
   * 左侧列表：仅预览镜头与高亮，不触发移动
   * @param {MapLocation} loc
   */
  async function previewLocation(loc) {
    if (busy) return;
    selectedId = loc.id;
    loadSheetImage(getLocMapId(loc));
    await setActiveLocationView(loc, true);
    updateTravelButton();
  }

  /**
   * @param {MapLocation} loc
   */
  async function travelToLocation(loc) {
    if (busy || !deps?.onTravel) return;
    if (loc.id === playerLocationId) {
      selectedId = loc.id;
      await setActiveLocationView(loc, true);
      updateTravelButton();
      return;
    }
    busy = true;
    selectedId = loc.id;
    close(false);

    try {
      await deps.onTravel(loc);
      await refreshPlayerLocationId();
    } catch (err) {
      console.error('[world-map] 前往地点失败:', err);
    } finally {
      busy = false;
    }
  }

  /**
   * 右侧按钮：前往当前选中的地点
   */
  async function confirmTravelToSelected() {
    const loc = selectedId ? config?.locations.find(l => l.id === selectedId) : null;
    if (!loc) return;
    await travelToLocation(loc);
  }

  function updateFitScale() {
    if (!config || !stageLayout.stageWidth) return;
    const { width, height } = getViewportSize();
    baseFitScale = Math.max(width / stageLayout.stageWidth, height / stageLayout.stageHeight);
  }

  /**
   * @param {MapLocation} loc
   * @returns {HTMLButtonElement}
   */
  function createHotspotButton(loc) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'world-map-hotspot';
    btn.dataset.locationId = loc.id;
    btn.title = loc.name;
    btn.setAttribute('aria-label', loc.name);
    const hs = loc.hotspot;
    if (hs.type === 'circle') {
      const d = hs.r * 2 * 100;
      btn.style.left = `${hs.x * 100}%`;
      btn.style.top = `${hs.y * 100}%`;
      btn.style.width = `${d}%`;
      btn.style.height = `${d}%`;
    }
    btn.addEventListener('click', e => {
      e.stopPropagation();
      void previewLocation(loc);
    });
    return btn;
  }

  function bindViewportResize() {
    if (!viewport) return;
    viewportResizeObserver?.disconnect();
    viewportResizeObserver = new ResizeObserver(() => {
      updateFitScale();
      const loc = activeId ? config?.locations.find(l => l.id === activeId) : null;
      if (loc) applyFocusForLocation(loc, false);
      else if (config?.overviewFocus) applyFocusOverview(config.overviewFocus, false);
      void updateActorMarkers();
    });
    viewportResizeObserver.observe(viewport);
  }

  function buildOverlay() {
    const existing = document.getElementById('world-map-overlay');
    const expectedMaps = config?.maps?.length ?? 0;
    const existingMaps = existing?.querySelectorAll('.world-map-sheet').length ?? 0;
    const structureOk =
      existing?.querySelector('.world-map-ui') &&
      existing.querySelector('.world-map-map-stack') &&
      existing.querySelector('.world-map-actors') &&
      existing.querySelector('.world-map-travel-btn') &&
      (expectedMaps === 0 || existingMaps === expectedMaps);
    if (structureOk) {
      bindOverlayRefs(existing);
      return overlay;
    }
    existing?.remove();
    overlay = null;

    overlay = document.createElement('div');
    overlay.className = 'world-map-overlay hidden';
    overlay.id = 'world-map-overlay';

    viewport = document.createElement('div');
    viewport.className = 'world-map-viewport';

    stage = document.createElement('div');
    stage.className = 'world-map-stage';

    const mapStack = document.createElement('div');
    mapStack.className = 'world-map-map-stack';

    const markerLayer = document.createElement('div');
    markerLayer.className = 'world-map-marker-layer';

    marker = document.createElement('div');
    marker.className = 'world-map-marker';
    const ring = document.createElement('div');
    ring.className = 'world-map-marker-ring';
    marker.appendChild(ring);
    markerLayer.appendChild(marker);

    const actorsLayer = document.createElement('div');
    actorsLayer.className = 'world-map-actors';

    const actorPlayer = document.createElement('img');
    actorPlayer.className = 'world-map-actor world-map-actor-player';
    actorPlayer.draggable = false;

    const actorTorina = document.createElement('img');
    actorTorina.className = 'world-map-actor world-map-actor-torina';
    actorTorina.draggable = false;

    actorsLayer.appendChild(actorPlayer);
    actorsLayer.appendChild(actorTorina);

    stage.appendChild(mapStack);
    stage.appendChild(markerLayer);
    stage.appendChild(actorsLayer);
    viewport.appendChild(stage);

    const uiLayer = document.createElement('div');
    uiLayer.className = 'world-map-ui';

    const fadeLeft = document.createElement('div');
    fadeLeft.className = 'world-map-fade-left';

    const sidebar = document.createElement('div');
    sidebar.className = 'world-map-sidebar';

    const fadeRight = document.createElement('div');
    fadeRight.className = 'world-map-fade-right';

    const rightPanel = document.createElement('div');
    rightPanel.className = 'world-map-right-panel';

    const travelBtn = document.createElement('button');
    travelBtn.type = 'button';
    travelBtn.className = 'world-map-travel-btn';
    travelBtn.textContent = '移动到此地';
    travelBtn.disabled = true;
    travelBtn.addEventListener('click', () => void confirmTravelToSelected());

    rightPanel.appendChild(travelBtn);
    fadeRight.appendChild(rightPanel);

    const topBar = document.createElement('div');
    topBar.className = 'world-map-top-bar';

    const closeBtn = document.createElement('img');
    closeBtn.className = 'world-map-close-btn';
    closeBtn.src = CLOSE_BTN_URL;
    closeBtn.alt = '关闭';
    closeBtn.title = '关闭';
    closeBtn.addEventListener('click', e => {
      e.stopPropagation();
      close(true);
    });

    fadeLeft.appendChild(sidebar);
    topBar.appendChild(closeBtn);
    uiLayer.appendChild(fadeLeft);
    uiLayer.appendChild(fadeRight);
    uiLayer.appendChild(topBar);

    overlay.appendChild(viewport);
    overlay.appendChild(uiLayer);

    overlay._worldMapParts = { sidebar, mapStack, actorPlayer, actorTorina, travelBtn };
    document.body.appendChild(overlay);
    bindViewportResize();
    return overlay;
  }

  /**
   * @param {MapConfig} cfg
   */
  function renderLocations(cfg) {
    if (!overlay) return;
    const parts = overlay._worldMapParts;
    if (!parts?.mapStack) return;

    buildStageLayout(cfg);
    loadedSheetIds = new Set();
    parts.sidebar.replaceChildren();
    parts.mapStack.replaceChildren();

    stage.style.width = `${stageLayout.stageWidth}px`;
    stage.style.height = `${stageLayout.stageHeight}px`;

    for (const mapDef of getMapsInStackOrder(cfg)) {
      const meta = stageLayout.maps[mapDef.id];
      if (!meta) continue;

      const sheet = document.createElement('div');
      sheet.className = 'world-map-sheet';
      sheet.dataset.mapId = mapDef.id;
      sheet.style.left = `${meta.offsetX}px`;
      sheet.style.top = `${meta.offsetY - stageLayout.stageOriginY}px`;
      sheet.style.height = `${meta.sheetHeight}px`;
      sheet.style.width = `${meta.sheetWidth}px`;
      sheet.style.zIndex = String(mapDef.stackOrder ?? cfg.maps.indexOf(mapDef));

      const img = document.createElement('img');
      img.className = 'world-map-image';
      img.alt = '';
      img.decoding = 'async';
      img.dataset.src = mapDef.imageUrl;
      img.width = mapDef.imageWidth;
      img.height = mapDef.imageHeight;
      img.draggable = false;

      const locationOverlays = document.createElement('div');
      locationOverlays.className = 'world-map-location-overlays';

      const hotspots = document.createElement('div');
      hotspots.className = 'world-map-hotspots';

      sheet.append(img, locationOverlays, hotspots);
      parts.mapStack.appendChild(sheet);
    }

    renderDistrictSidebar(cfg, parts);

    for (const loc of cfg.locations) {
      const mapId = getLocMapId(loc);
      const sheet = parts.mapStack.querySelector(`.world-map-sheet[data-map-id="${mapId}"]`);
      if (!sheet) continue;
      const hotspots = sheet.querySelector('.world-map-hotspots');
      const locationOverlays = sheet.querySelector('.world-map-location-overlays');
      if (hotspots) hotspots.appendChild(createHotspotButton(loc));
      if (loc.overlay?.url && locationOverlays) {
        const oimg = document.createElement('img');
        oimg.className = 'world-map-location-overlay';
        oimg.dataset.locationId = loc.id;
        oimg.dataset.src = loc.overlay.url;
        oimg.alt = loc.name;
        oimg.draggable = false;
        oimg.decoding = 'async';
        locationOverlays.appendChild(oimg);
      }
    }
  }

  /**
   * @param {string} url
   * @returns {Promise<{ width:number, height:number }>}
   */
  function probeImageSize(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => reject(new Error(`无法读取图片尺寸: ${url}`));
      img.src = url;
    });
  }

  /**
   * @param {MapConfig} cfg
   */
  async function resolveMapDimensions(cfg) {
    await Promise.all(
      cfg.maps.map(async mapDef => {
        if (mapDef.imageWidth > 0 && mapDef.imageHeight > 0) return;
        try {
          const { width, height } = await probeImageSize(mapDef.imageUrl);
          mapDef.imageWidth = width;
          mapDef.imageHeight = height;
          console.info(`[world-map] 已探测地图尺寸 ${mapDef.id}: ${width}×${height}`);
        } catch (err) {
          console.warn(`[world-map] 地图 ${mapDef.id} 尺寸探测失败，使用默认 3456×4080`, err);
          mapDef.imageWidth = mapDef.imageWidth || 3456;
          mapDef.imageHeight = mapDef.imageHeight || 4080;
        }
      }),
    );
    if (!cfg.stageWidth) {
      const widths = cfg.maps.map(m => m.imageWidth).filter(w => w != null && w > 0);
      cfg.stageWidth = widths.length ? Math.max(...widths) : 3456;
    }
  }

  function readEmbeddedMapConfig() {
    const el = document.getElementById('meishinkan-map-config');
    if (!el?.textContent?.trim()) return null;
    try {
      return /** @type {MapConfig} */ (JSON.parse(el.textContent));
    } catch (err) {
      console.warn('[world-map] 内嵌 map-locations 解析失败:', err);
      return null;
    }
  }

  async function loadConfig(forceRefresh = false) {
    const embedded = readEmbeddedMapConfig();
    if (embedded) {
      if (!forceRefresh && config) return config;
      config = normalizeConfig(embedded);
      await resolveMapDimensions(config);
      buildStageLayout(config);
      return config;
    }
    if (config && !forceRefresh) return config;
    const res = await fetch(CONFIG_URL);
    if (!res.ok) throw new Error(`无法加载地图配置: ${CONFIG_URL}`);
    config = normalizeConfig(/** @type {MapConfig} */ (await res.json()));
    await resolveMapDimensions(config);
    buildStageLayout(config);
    return config;
  }

  /**
   * @param {MapConfig} cfg
   * @returns {Promise<MapLocation>}
   */
  async function resolveInitialLocation(cfg) {
    const home =
      cfg.locations.find(l => l.id === 'home') ||
      cfg.locations.find(l => l.name === '家') ||
      cfg.locations[0];

    let current = null;
    if (deps?.getCurrentLocation) {
      try {
        current = await Promise.resolve(deps.getCurrentLocation());
      } catch (err) {
        console.warn('[world-map] 读取当前地点失败:', err);
      }
    }

    if (current != null && String(current).trim()) {
      const key = String(current).trim();
      const matched = cfg.locations.find(l => l.name === key || l.id === key);
      if (matched) return matched;
    }

    return home;
  }

  /**
   * @param {MapLocation} loc
   */
  function showCurrentLocationView(loc) {
    setActiveLocationView(loc, false);
  }

  /**
   * @param {{ onTravel?: (loc: MapLocation) => Promise<void>, getCurrentLocation?: () => Promise<string|null|undefined>, getTorinaLocation?: () => Promise<string|null|undefined>, getCorruptionStage?: () => Promise<number|null|undefined> }} options
   */
  function init(options) {
    deps = options;
  }

  async function open() {
    try {
      const cfg = await loadConfig(true);
      initDistrictExpandedState(cfg);
      const initialLoc = await resolveInitialLocation(cfg);
      buildOverlay();
      renderLocations(cfg);
      loadSheetImage(getLocMapId(initialLoc));
      loadLocationOverlay(initialLoc);
      scheduleNeighborSheetPreload(getLocMapId(initialLoc));
      await refreshPlayerLocationId();
      selectedId = initialLoc.id;
      setSidebarDisabled(false);

      // 显示前先定位（隐藏时视口尺寸为 0，用 window 尺寸计算）
      updateFitScale();
      showCurrentLocationView(initialLoc);
      updateTravelButton();

      lockPageScroll(true);
      overlay.classList.remove('hidden');

      // 显示后立即用真实视口尺寸再算一次，避免闪一下全图
      updateFitScale();
      showCurrentLocationView(initialLoc);
      await updateActorMarkers();
      updateTravelButton();
    } catch (err) {
      console.error('[world-map]', err);
      if (typeof toastr !== 'undefined') toastr.error('地图加载失败');
    }
  }

  /**
   * @param {boolean} restoreMenu
   */
  function close(restoreMenu) {
    cancelNeighborSheetPreload();
    if (focusAnimRafId != null) {
      cancelAnimationFrame(focusAnimRafId);
      focusAnimRafId = null;
    }
    setCameraMoving(false);
    overlay?.classList.add('hidden');
    lockPageScroll(false);
    hideMarker();
    updateLocationOverlay(null);
    const parts = overlay?._worldMapParts;
    parts?.actorPlayer?.classList.remove('is-visible');
    parts?.actorTorina?.classList.remove('is-visible');
    if (restoreMenu) {
      document.getElementById('game-menu-overlay')?.classList.remove('hidden');
    }
  }

  global.MeishinkanWorldMap = {
    init,
    open,
    close,
    loadConfig,
    refreshActorMarkers: updateActorMarkers,
    /** 配置 JSON 更新后调用，重新拉取 map-locations.json */
    reloadConfig() {
      config = null;
      return loadConfig(true);
    },
  };
})(typeof window !== 'undefined' ? window : globalThis);



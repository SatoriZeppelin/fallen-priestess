(function (global) {
  const STORE_KEY = 'meishinkan_user_persona';

  const POSITIONS = {
    none: 'none',
    prompt: 'prompt',
    an_top: 'an_top',
    an_bottom: 'an_bottom',
    depth: 'depth',
  };

  const DEFAULTS = {
    name: '',
    description: '',
    position: POSITIONS.prompt,
    depth: 4,
    syncTavern: false,
  };

  let bound = false;

  function $(id) {
    return document.getElementById(id);
  }

  function isTavern() {
    const llm = global.妹神官_llm;
    return !!(llm && typeof llm.isTavernEnv === 'function' && llm.isTavernEnv());
  }

  function readTavernInfo() {
    const llm = global.妹神官_llm;
    if (llm && typeof llm.readTavernUserInfo === 'function') {
      return llm.readTavernUserInfo() || { name: '', description: '' };
    }
    return { name: '', description: '' };
  }

  function clampDepth(n) {
    n = parseInt(n, 10);
    if (isNaN(n) || n < 0) return 0;
    return Math.min(999, n);
  }

  function normalize(raw) {
    const o = raw && typeof raw === 'object' ? raw : {};
    let pos = String(o.position || DEFAULTS.position);
    if (!POSITIONS[pos]) pos = DEFAULTS.position;
    return {
      name: o.name != null ? String(o.name) : '',
      description: o.description != null ? String(o.description) : '',
      position: pos,
      depth: clampDepth(o.depth != null ? o.depth : DEFAULTS.depth),
      syncTavern: !!o.syncTavern,
    };
  }

  function loadRaw() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return normalize(DEFAULTS);
      return normalize(JSON.parse(raw));
    } catch (e) {
      return normalize(DEFAULTS);
    }
  }

  function load() {
    const d = loadRaw();
    if (d.syncTavern && isTavern()) {
      const st = readTavernInfo();
      return {
        name: st.name || d.name || '',
        description: st.description != null && st.description !== '' ? st.description : (d.description || ''),
        position: d.position,
        depth: d.depth,
        syncTavern: true,
      };
    }
    return d;
  }

  function save(data) {
    const d = normalize(data || {});
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(d));
    } catch (e) {}
    return d;
  }

  function getUserName() {
    const d = load();
    return String(d.name || '').trim();
  }

  function resolveUserMacro(text) {
    const s = String(text == null ? '' : text);
    if (!s) return s;
    const uName = getUserName();
    if (!uName) return s;
    return s.replace(/\{\{user\}\}/gi, uName);
  }

  function resolvedDescription(data) {
    const d = data || load();
    if (!d.position || d.position === POSITIONS.none) return '';
    let text = String(d.description || '').trim();
    if (!text) return '';
    text = text.replace(/\{\{char\}\}/gi, '托莉娜');
    text = resolveUserMacro(text);
    return text;
  }

  function getInjection(position) {
    const d = load();
    if (!d || d.position !== position) return '';
    return resolvedDescription(d);
  }

  function getDepthInjection() {
    const d = load();
    if (!d || d.position !== POSITIONS.depth) return null;
    const text = resolvedDescription(d);
    if (!text) return null;
    return {
      content: text,
      role: 'system',
      depth: d.depth != null ? d.depth : 4,
      insertion_order: 50,
      _isPrompt: true,
    };
  }

  function toast(msg) {
    if (global.妹神官_gal && typeof global.妹神官_gal.toast === 'function') {
      global.妹神官_gal.toast(msg);
      return;
    }
    const el = $('fp-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._hide);
    el._hide = setTimeout(function () {
      el.classList.remove('show');
    }, 1800);
  }

  function syncCount() {
    const el = $('cfg-user-desc');
    const out = $('cfg-user-desc-count');
    if (!out) return;
    out.textContent = String(el ? el.value.length : 0);
  }

  function syncDepthVisibility() {
    const pos = $('cfg-user-position');
    const wrap = $('cfg-user-depth-wrap');
    if (!wrap || !pos) return;
    wrap.hidden = pos.value !== 'depth';
  }

  function applySyncLockUI(locked) {
    const nameEl = $('cfg-user-name');
    const descEl = $('cfg-user-desc');
    const syncBtn = $('btn-user-sync-tavern');
    if (nameEl) {
      nameEl.readOnly = !!locked;
      nameEl.classList.toggle('is-locked', !!locked);
    }
    if (descEl) {
      descEl.readOnly = !!locked;
      descEl.classList.toggle('is-locked', !!locked);
    }
    if (syncBtn) {
      syncBtn.hidden = !isTavern();
      syncBtn.classList.toggle('is-active', !!locked);
      syncBtn.setAttribute('aria-pressed', locked ? 'true' : 'false');
      syncBtn.textContent = locked ? '跟随酒馆设定中（点击取消）' : '跟随酒馆User设定';
    }
  }

  function fillForm(d) {
    d = d || load();
    const nameEl = $('cfg-user-name');
    const descEl = $('cfg-user-desc');
    const posEl = $('cfg-user-position');
    const depthEl = $('cfg-user-depth');
    const locked = !!(d.syncTavern && isTavern());

    if (nameEl) nameEl.value = d.name || '';
    if (descEl) descEl.value = d.description || '';
    if (posEl) posEl.value = d.position || 'prompt';
    if (depthEl) depthEl.value = String(d.depth != null ? d.depth : 4);

    applySyncLockUI(locked);
    syncCount();
    syncDepthVisibility();
  }

  function readForm() {
    const raw = loadRaw();
    const nameEl = $('cfg-user-name');
    const descEl = $('cfg-user-desc');
    const posEl = $('cfg-user-position');
    const depthEl = $('cfg-user-depth');
    return {
      name: nameEl ? nameEl.value : raw.name,
      description: descEl ? descEl.value : raw.description,
      position: posEl ? posEl.value : raw.position,
      depth: depthEl ? depthEl.value : raw.depth,
      syncTavern: !!raw.syncTavern,
    };
  }

  function commit() {
    save(readForm());
  }

  function toggleTavernSync() {
    if (!isTavern()) return;
    const cur = loadRaw();
    const nextSync = !cur.syncTavern;
    if (nextSync) {
      const st = readTavernInfo();
      const saved = save({
        name: st.name || cur.name || '',
        description: st.description != null ? st.description : (cur.description || ''),
        position: cur.position,
        depth: cur.depth,
        syncTavern: true,
      });
      fillForm(saved);
      toast('已开启跟随酒馆 User 设定（名字与设定已锁定）');
    } else {
      const nameEl = $('cfg-user-name');
      const descEl = $('cfg-user-desc');
      const saved = save({
        name: nameEl ? nameEl.value : cur.name,
        description: descEl ? descEl.value : cur.description,
        position: cur.position,
        depth: cur.depth,
        syncTavern: false,
      });
      fillForm(saved);
      toast('已取消跟随酒馆 User 设定，现在可以自由编辑');
    }
  }

  function render() {
    fillForm(load());
  }

  function init() {
    render();
    if (bound) return;
    bound = true;

    ['cfg-user-name', 'cfg-user-desc', 'cfg-user-position', 'cfg-user-depth'].forEach(function (id) {
      const el = $(id);
      if (!el) return;
      const ev = id === 'cfg-user-desc' || id === 'cfg-user-name' ? 'input' : 'change';
      el.addEventListener(ev, function () {
        if (id === 'cfg-user-desc') syncCount();
        if (id === 'cfg-user-position') syncDepthVisibility();
        commit();
      });
    });

    const syncBtn = $('btn-user-sync-tavern');
    if (syncBtn) {
      syncBtn.addEventListener('click', function () {
        toggleTavernSync();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  global.妹神官_settings_user = {
    STORE_KEY: STORE_KEY,
    POSITIONS: POSITIONS,
    DEFAULTS: DEFAULTS,
    init: init,
    render: render,
    load: load,
    save: save,
    getUserName: getUserName,
    resolveUserMacro: resolveUserMacro,
    resolvedDescription: resolvedDescription,
    getInjection: getInjection,
    getDepthInjection: getDepthInjection,
  };
})(window);

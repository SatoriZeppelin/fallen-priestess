/**
 * 系统设置 · 变量（按 status_description 载入）
 * 对外：window.妹神官_settings_variable
 */
(function (global) {
  const STORE_KEY = 'meishinkan_variables';
  const SEED_KEY = 'meishinkan_variables_seed';
  const SEED_VER = 'variables-status-v2';
  const expanded = Object.create(null);
  let data = {};
  let meta = {};
  let view = 'tree';
  let bound = false;

  function $(id) {
    return document.getElementById(id);
  }

  function clone(v) {
    try {
      return JSON.parse(JSON.stringify(v));
    } catch (e) {
      return {};
    }
  }

  function isObj(v) {
    return v && typeof v === 'object' && !Array.isArray(v);
  }

  function toast(msg) {
    if (window.妹神官_gal && typeof window.妹神官_gal.toast === 'function') {
      window.妹神官_gal.toast(msg);
      return;
    }
    const el = document.getElementById('fp-toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._hide);
    el._hide = setTimeout(() => el.classList.remove('show'), 1800);
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function pathKey(path) {
    return (path || []).join('\0');
  }

  function dotted(path) {
    return (path || []).join('.');
  }

  function macroOf(path) {
    return '{{get_chat_variable::stat_data.' + dotted(path) + '}}';
  }

  function getMeta(path) {
    const m = meta[pathKey(path)];
    if (!m || typeof m !== 'object') return { varName: dotted(path), comment: '' };
    return {
      varName: m.varName || dotted(path),
      comment: m.comment || '',
    };
  }

  function packDefault() {
    const src = global.妹神官_default_variables;
    if (src && isObj(src.data)) {
      return { data: clone(src.data), meta: clone(src.meta || {}) };
    }
    return { data: {}, meta: {} };
  }

  function mergeMissing(target, source) {
    if (!isObj(source)) return target;
    if (!isObj(target)) return clone(source);
    Object.keys(source).forEach(function (k) {
      if (!(k in target)) target[k] = clone(source[k]);
      else if (isObj(source[k]) && isObj(target[k])) mergeMissing(target[k], source[k]);
    });
    return target;
  }

  function stripRemovedVars(obj) {
    if (obj && obj.系统 && Object.prototype.hasOwnProperty.call(obj.系统, '请求')) {
      delete obj.系统.请求;
    }
  }

  function loadStore() {
    const seed = packDefault();
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const loaded = parsed && parsed.data ? parsed : { data: parsed, meta: {} };
        data = mergeMissing(clone(loaded.data || {}), seed.data);
        stripRemovedVars(data);
        meta = Object.assign({}, seed.meta, loaded.meta || {});
        Object.keys(meta).forEach(function (k) {
          if (String(k).indexOf('系统\0请求') === 0) delete meta[k];
        });
        if (localStorage.getItem(SEED_KEY) !== SEED_VER) {
          localStorage.setItem(SEED_KEY, SEED_VER);
          saveStore();
        }
        return;
      }
    } catch (e) {}
    data = seed.data;
    meta = seed.meta;
    localStorage.setItem(SEED_KEY, SEED_VER);
    saveStore();
  }

  function saveStore() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ __fp: 1, data: data, meta: meta }));
    } catch (e) {
      toast('变量保存失败');
    }
    syncEraDefault();
  }

  function syncEraDefault() {
    if (window.妹神官_gal && typeof window.妹神官_gal.setDefaultVars === 'function') {
      window.妹神官_gal.setDefaultVars(data);
    }
  }

  function getAt(path) {
    let cur = data;
    for (let i = 0; i < path.length; i++) {
      if (!isObj(cur) && !Array.isArray(cur)) return undefined;
      cur = cur[path[i]];
    }
    return cur;
  }

  function setAt(path, value) {
    if (!path.length) return;
    let cur = data;
    for (let i = 0; i < path.length - 1; i++) {
      const k = path[i];
      if (!isObj(cur[k])) cur[k] = {};
      cur = cur[k];
    }
    cur[path[path.length - 1]] = value;
  }

  function parseValue(raw, prev) {
    const s = String(raw);
    if (typeof prev === 'boolean') return s === 'true' || s === '1';
    if (typeof prev === 'number') {
      const n = Number(s);
      return Number.isFinite(n) ? n : prev;
    }
    if (s === 'true') return true;
    if (s === 'false') return false;
    if (s !== '' && Number.isFinite(Number(s)) && String(Number(s)) === s.trim()) return Number(s);
    return s;
  }

  function nodeHtml(path, value, depth) {
    const key = path[path.length - 1];
    const id = pathKey(path);
    if (isObj(value)) {
      if (!(id in expanded)) expanded[id] = depth < 2;
      const open = !!expanded[id];
      const keys = Object.keys(value);
      return (
        '<div class="sys-var-node" data-path="' +
        esc(dotted(path)) +
        '" style="--d:' +
        depth +
        '">' +
        '<button type="button" class="sys-var-branch' +
        (open ? ' is-open' : '') +
        '" data-act="toggle">' +
        '<span class="sys-var-chevron" aria-hidden="true">▸</span>' +
        '<span class="sys-var-name">' +
        esc(key) +
        '</span>' +
        '<span class="sys-var-count">' +
        keys.length +
        '</span></button>' +
        (open
          ? '<div class="sys-var-children">' +
            keys
              .map(function (k) {
                return nodeHtml(path.concat([k]), value[k], depth + 1);
              })
              .join('') +
            '</div>'
          : '') +
        '</div>'
      );
    }
    const info = getMeta(path);
    return (
      '<div class="sys-var-leaf" data-path="' +
      esc(dotted(path)) +
      '" style="--d:' +
      depth +
      '">' +
      '<div class="sys-var-leaf-row">' +
      '<span class="sys-var-name">' +
      esc(key) +
      '</span>' +
      '<input class="sys-input sys-var-input" data-f="value" value="' +
      esc(value) +
      '" spellcheck="false" autocomplete="off" /></div>' +
      '<div class="sys-var-macro">' +
      esc(macroOf(path)) +
      '</div>' +
      (info.comment ? '<div class="sys-var-comment">' + esc(info.comment) + '</div>' : '') +
      '</div>'
    );
  }

  function renderTree() {
    const tree = $('var-tree');
    if (!tree) return;
    const keys = Object.keys(data);
    tree.innerHTML = keys
      .map(function (k) {
        return nodeHtml([k], data[k], 0);
      })
      .join('');
  }

  function renderJson() {
    const ta = $('cfg-var-json');
    if (!ta) return;
    ta.value = JSON.stringify(data, null, 2);
  }

  function applyView() {
    const tree = $('var-tree');
    const json = $('cfg-var-json');
    const btnTree = $('btn-var-view-tree');
    const btnJson = $('btn-var-view-json');
    const isTree = view === 'tree';
    if (tree) tree.hidden = !isTree;
    if (json) json.hidden = isTree;
    if (btnTree) btnTree.classList.toggle('active', isTree);
    if (btnJson) btnJson.classList.toggle('active', !isTree);
    if (isTree) renderTree();
    else renderJson();
  }

  function render() {
    applyView();
  }

  function commitJson() {
    const ta = $('cfg-var-json');
    if (!ta) return;
    try {
      const next = JSON.parse(ta.value || '{}');
      if (!isObj(next)) {
        toast('变量 JSON 必须是对象');
        return;
      }
      data = next;
      saveStore();
      toast('变量已更新');
    } catch (e) {
      toast('变量 JSON 无法解析');
    }
  }

  function bind() {
    if (bound) return;
    bound = true;

    const btnTree = $('btn-var-view-tree');
    const btnJson = $('btn-var-view-json');
    if (btnTree) {
      btnTree.addEventListener('click', function () {
        view = 'tree';
        render();
      });
    }
    if (btnJson) {
      btnJson.addEventListener('click', function () {
        view = 'json';
        render();
      });
    }

    const tree = $('var-tree');
    if (tree) {
      tree.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-act="toggle"]');
        if (!btn) return;
        const node = btn.closest('.sys-var-node');
        if (!node) return;
        const path = (node.getAttribute('data-path') || '').split('.');
        const id = pathKey(path);
        expanded[id] = !expanded[id];
        renderTree();
      });
      tree.addEventListener('change', function (e) {
        const input = e.target.closest('[data-f="value"]');
        if (!input) return;
        const leaf = input.closest('.sys-var-leaf');
        if (!leaf) return;
        const path = (leaf.getAttribute('data-path') || '').split('.');
        const prev = getAt(path);
        setAt(path, parseValue(input.value, prev));
        saveStore();
        input.value = String(getAt(path));
      });
    }

    const ta = $('cfg-var-json');
    if (ta) {
      ta.addEventListener('blur', commitJson);
    }
  }

  function getData() {
    return clone(data);
  }

  function init() {
    loadStore();
    bind();
    render();
  }

  global.妹神官_settings_variable = {
    init: init,
    render: render,
    getData: getData,
    loadStore: loadStore,
  };
})(window);

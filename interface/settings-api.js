/**
 * 系统设置 · API：多套命名接口 + 路由绑定
 * 对外：window.妹神官_settings_api
 */
(function (global) {
  const STORE_KEY = 'meishinkan_api_store';
  const ROUTES = ['main', 'world', 'story', 'stats', 'meta'];
  const expanded = Object.create(null);
  const advancedOpen = Object.create(null);
  let bound = false;

  function $(id) {
    return document.getElementById(id);
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
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

  function uid() {
    return 'api_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function hostOf(url) {
    try {
      let u = String(url || '').trim();
      if (!u) return '';
      if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
      return new URL(u).host || '';
    } catch (e) {
      return String(url || '').replace(/^https?:\/\//i, '').split('/')[0];
    }
  }

  function defaultProfile(name) {
    return {
      id: uid(),
      name: name || '接口 1',
      enabled: true,
      protocol: 'openai',
      baseUrl: '',
      apiKey: '',
      model: '',
      autoConnect: false,
      stream: false,
      streamDisplay: true,
      contextLength: 8192,
      maxTokens: 2048,
      temperature: 0.8,
    };
  }

  function emptyStore() {
    const first = defaultProfile('接口 1');
    return {
      profiles: [first],
      defaultProfileId: first.id,
      routes: { main: '', world: '', story: '', stats: '', meta: '' },
    };
  }

  function loadStore() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return emptyStore();
      const data = JSON.parse(raw);
      if (!data || !Array.isArray(data.profiles) || !data.profiles.length) return emptyStore();
      data.routes = data.routes || {};
      return data;
    } catch (e) {
      return emptyStore();
    }
  }

  function saveStore(st) {
    localStorage.setItem(STORE_KEY, JSON.stringify(st));
  }

  function protocolPlaceholder(protocol) {
    if (protocol === 'claude') return 'https://api.anthropic.com';
    if (protocol === 'gemini') return 'https://generativelanguage.googleapis.com';
    return 'https://api.openai.com/v1';
  }

  function fillRouteSelects() {
    const st = loadStore();
    const profiles = st.profiles || [];
    const options = profiles
      .map((p) => {
        return (
          '<option value="' +
          esc(p.id) +
          '">' +
          esc(p.name) +
          (p.enabled === false ? '（已禁用）' : '') +
          '</option>'
        );
      })
      .join('');

    const defSel = $('cfg-api-default-profile');
    if (defSel) {
      defSel.innerHTML = options;
      defSel.value = st.defaultProfileId || (profiles[0] && profiles[0].id) || '';
    }

    ROUTES.forEach((route) => {
      const sel = $('cfg-api-route-' + route);
      if (!sel) return;
      const cur = (st.routes && st.routes[route]) || '';
      sel.innerHTML = '<option value="">使用默认</option>' + options;
      sel.value = cur;
    });
  }

  function readCard(card, prev) {
    prev = prev || {};
    const val = (sel) => {
      const el = card.querySelector(sel);
      return el ? el.value : '';
    };
    const chk = (sel) => {
      const el = card.querySelector(sel);
      return !!(el && el.checked);
    };
    const num = (sel, fallback) => {
      const n = parseFloat(val(sel));
      return Number.isFinite(n) ? n : fallback;
    };
    return Object.assign({}, prev, {
      id: card.getAttribute('data-id'),
      name: val('[data-f="name"]').trim() || prev.name || '新接口',
      enabled: chk('[data-f="enabled"]'),
      protocol: val('[data-f="protocol"]') || prev.protocol || 'openai',
      baseUrl: val('[data-f="baseUrl"]').trim(),
      apiKey: val('[data-f="apiKey"]').trim(),
      model: val('[data-f="model"]').trim(),
      autoConnect: chk('[data-f="autoConnect"]'),
      stream: chk('[data-f="stream"]'),
      streamDisplay: chk('[data-f="streamDisplay"]'),
      contextLength: num('[data-f="contextLength"]', prev.contextLength || 8192),
      maxTokens: num('[data-f="maxTokens"]', prev.maxTokens || 2048),
      temperature: num('[data-f="temperature"]', prev.temperature != null ? prev.temperature : 0.8),
    });
  }

  function saveCard(card) {
    const id = card.getAttribute('data-id');
    const st = loadStore();
    const prev = st.profiles.find((p) => p.id === id) || {};
    const cfg = readCard(card, prev);
    st.profiles = st.profiles.map((p) => (p.id === id ? cfg : p));
    saveStore(st);

    const title = card.querySelector('.sys-api-card-title');
    if (title) title.textContent = cfg.name;
    const sub = card.querySelector('.sys-api-card-sub');
    if (sub) sub.textContent = [cfg.model, hostOf(cfg.baseUrl)].filter(Boolean).join(' · ') || '未配置';
    const badge = card.querySelector('.sys-api-badge');
    if (badge) {
      badge.textContent = cfg.enabled ? '已启用' : '已禁用';
      badge.classList.toggle('is-on', !!cfg.enabled);
      badge.classList.toggle('is-off', !cfg.enabled);
    }
    card.classList.toggle('is-off', cfg.enabled === false);
    fillRouteSelects();
    return cfg;
  }

  function cardHtml(p, isExpanded, index, total) {
    const protocol = p.protocol || 'openai';
    const sub = [p.model, hostOf(p.baseUrl)].filter(Boolean).join(' · ') || '未配置';
    const adv = !!advancedOpen[p.id];
    const only = total <= 1;
    const ph = protocolPlaceholder(protocol);
    return (
      '<article class="sys-api-card' +
      (isExpanded ? ' is-expanded' : '') +
      (p.enabled === false ? ' is-off' : '') +
      '" data-id="' +
      esc(p.id) +
      '">' +
      '<header class="sys-api-card-head">' +
      '<button type="button" class="sys-api-toggle" data-act="toggle" aria-expanded="' +
      (isExpanded ? 'true' : 'false') +
      '" title="展开/折叠">' +
      '<span class="sys-api-chevron" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>' +
      '</span></button>' +
      '<button type="button" class="sys-api-card-main" data-act="toggle">' +
      '<div class="sys-api-card-title-row">' +
      '<span class="sys-api-card-title">' +
      esc(p.name) +
      '</span>' +
      '<span class="sys-api-badge ' +
      (p.enabled !== false ? 'is-on' : 'is-off') +
      '">' +
      (p.enabled !== false ? '已启用' : '已禁用') +
      '</span></div>' +
      '<div class="sys-api-card-sub">' +
      esc(sub) +
      '</div></button>' +
      '<div class="sys-api-card-actions">' +
      '<button type="button" class="sys-icon-btn" data-act="up" title="上移"' +
      (index === 0 ? ' disabled' : '') +
      '><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 14 12 8 18 14"/></svg></button>' +
      '<button type="button" class="sys-icon-btn" data-act="down" title="下移"' +
      (index >= total - 1 ? ' disabled' : '') +
      '><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 10 12 16 18 10"/></svg></button>' +
      '<button type="button" class="sys-icon-btn" data-act="dup" title="复制"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg></button>' +
      '<button type="button" class="sys-icon-btn is-danger" data-act="del" title="删除"' +
      (only ? ' disabled' : '') +
      '><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg></button>' +
      '</div></header>' +
      '<div class="sys-api-card-body"' +
      (isExpanded ? '' : ' hidden') +
      '>' +
      '<div class="sys-l4"><h4 class="sys-l4-title">名称</h4>' +
      '<input type="text" class="sys-input" data-f="name" value="' +
      esc(p.name) +
      '" autocomplete="off" spellcheck="false" /></div>' +
      '<label class="sys-check"><input type="checkbox" data-f="enabled"' +
      (p.enabled !== false ? ' checked' : '') +
      ' /><span class="sys-check-box" aria-hidden="true"></span><span>启用接口</span></label>' +
      '<div class="sys-l4"><h4 class="sys-l4-title">协议</h4>' +
      '<select class="sys-select" data-f="protocol">' +
      '<option value="openai"' +
      (protocol === 'openai' ? ' selected' : '') +
      '>OpenAI（Chat Completions）</option>' +
      '<option value="claude"' +
      (protocol === 'claude' ? ' selected' : '') +
      '>Claude（Messages）</option>' +
      '<option value="gemini"' +
      (protocol === 'gemini' ? ' selected' : '') +
      '>Gemini（generateContent）</option></select></div>' +
      '<div class="sys-l4"><h4 class="sys-l4-title">接口地址</h4>' +
      '<input type="text" class="sys-input" data-f="baseUrl" value="' +
      esc(p.baseUrl || '') +
      '" placeholder="' +
      esc(ph) +
      '" autocomplete="off" spellcheck="false" /></div>' +
      '<div class="sys-l4"><h4 class="sys-l4-title">API Key</h4>' +
      '<input type="password" class="sys-input" data-f="apiKey" value="' +
      esc(p.apiKey || '') +
      '" placeholder="sk-..." autocomplete="off" spellcheck="false" /></div>' +
      '<div class="sys-l4"><h4 class="sys-l4-title">模型</h4>' +
      '<input type="text" class="sys-input" data-f="model" value="' +
      esc(p.model || '') +
      '" placeholder="连接后选择，也可手动填写" autocomplete="off" spellcheck="false" />' +
      '<p class="sys-hint">可直接输入模型名，也可先获取列表后选择。</p></div>' +
      '<div class="sys-api-actions">' +
      '<button type="button" class="settings-control-btn" data-act="connect">获取模型列表</button>' +
      '<button type="button" class="settings-control-btn" data-act="test">发送测试消息</button></div>' +
      '<label class="sys-check"><input type="checkbox" data-f="autoConnect"' +
      (p.autoConnect ? ' checked' : '') +
      ' /><span class="sys-check-box" aria-hidden="true"></span><span>自动连接</span></label>' +
      '<div class="sys-api-status" data-state="idle"><span class="sys-api-status-dot"></span><span>未连接</span></div>' +
      '<div class="sys-api-stream">' +
      '<label class="sys-check"><input type="checkbox" data-f="stream"' +
      (p.stream ? ' checked' : '') +
      ' /><span class="sys-check-box" aria-hidden="true"></span><span>流式传输</span></label>' +
      '<label class="sys-check"><input type="checkbox" data-f="streamDisplay"' +
      (p.streamDisplay !== false ? ' checked' : '') +
      ' /><span class="sys-check-box" aria-hidden="true"></span><span>流式显示</span></label></div>' +
      '<button type="button" class="sys-advanced-toggle" data-act="advanced" aria-expanded="' +
      (adv ? 'true' : 'false') +
      '">高级参数</button>' +
      '<div class="sys-advanced"' +
      (adv ? '' : ' hidden') +
      '>' +
      '<div class="sys-l4"><h4 class="sys-l4-title">上下文长度</h4>' +
      '<input type="number" class="sys-input" data-f="contextLength" min="1024" step="1024" value="' +
      esc(p.contextLength || 8192) +
      '" /></div>' +
      '<div class="sys-l4"><h4 class="sys-l4-title">最大回复长度</h4>' +
      '<input type="number" class="sys-input" data-f="maxTokens" min="1" value="' +
      esc(p.maxTokens || 2048) +
      '" /></div>' +
      '<div class="sys-l4"><h4 class="sys-l4-title">温度</h4>' +
      '<input type="number" class="sys-input" data-f="temperature" min="0" max="2" step="0.01" value="' +
      esc(p.temperature != null ? p.temperature : 0.8) +
      '" /></div></div></div></article>'
    );
  }

  function render() {
    const list = $('api-profiles-list');
    if (!list) return;
    const st = loadStore();
    const profiles = st.profiles || [];
    if (!Object.keys(expanded).length && profiles[0]) expanded[profiles[0].id] = true;
    list.innerHTML = profiles
      .map((p, i) => cardHtml(p, !!expanded[p.id], i, profiles.length))
      .join('');
    fillRouteSelects();
  }

  function moveProfile(id, dir) {
    const st = loadStore();
    const i = st.profiles.findIndex((p) => p.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= st.profiles.length) return;
    const tmp = st.profiles[i];
    st.profiles[i] = st.profiles[j];
    st.profiles[j] = tmp;
    saveStore(st);
    render();
  }

  function bind() {
    if (bound) return;
    bound = true;

    const addBtn = $('btn-api-add');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const st = loadStore();
        const next = defaultProfile('接口 ' + (st.profiles.length + 1));
        st.profiles.push(next);
        saveStore(st);
        Object.keys(expanded).forEach((k) => {
          expanded[k] = false;
        });
        expanded[next.id] = true;
        render();
      });
    }

    const list = $('api-profiles-list');
    if (list) {
      list.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-act]');
        if (!btn) return;
        const card = btn.closest('.sys-api-card');
        if (!card) return;
        const id = card.getAttribute('data-id');
        const act = btn.getAttribute('data-act');
        if (act === 'toggle') {
          expanded[id] = !expanded[id];
          render();
          return;
        }
        if (act === 'advanced') {
          advancedOpen[id] = !advancedOpen[id];
          const box = card.querySelector('.sys-advanced');
          if (box) {
            if (advancedOpen[id]) box.removeAttribute('hidden');
            else box.setAttribute('hidden', '');
          }
          btn.setAttribute('aria-expanded', advancedOpen[id] ? 'true' : 'false');
          return;
        }
        if (act === 'up') {
          saveCard(card);
          moveProfile(id, -1);
          return;
        }
        if (act === 'down') {
          saveCard(card);
          moveProfile(id, 1);
          return;
        }
        if (act === 'dup') {
          const st = loadStore();
          const src = st.profiles.find((p) => p.id === id);
          if (!src) return;
          const copy = Object.assign({}, src, {
            id: uid(),
            name: (src.name || '接口') + ' 副本',
          });
          const idx = st.profiles.findIndex((p) => p.id === id);
          st.profiles.splice(idx + 1, 0, copy);
          saveStore(st);
          expanded[copy.id] = true;
          render();
          return;
        }
        if (act === 'del') {
          const st = loadStore();
          if (st.profiles.length <= 1) {
            toast('至少保留一套接口');
            return;
          }
          st.profiles = st.profiles.filter((p) => p.id !== id);
          if (st.defaultProfileId === id) st.defaultProfileId = st.profiles[0].id;
          ROUTES.forEach((route) => {
            if (st.routes[route] === id) st.routes[route] = '';
          });
          saveStore(st);
          delete expanded[id];
          render();
          return;
        }
        if (act === 'connect' || act === 'test') {
          toast('连接测试稍后接入');
        }
      });

      list.addEventListener('change', (e) => {
        const card = e.target.closest('.sys-api-card');
        if (card) saveCard(card);
      });
      list.addEventListener('input', (e) => {
        const card = e.target.closest('.sys-api-card');
        if (card && e.target.matches('[data-f="name"]')) saveCard(card);
      });
    }

    const defSel = $('cfg-api-default-profile');
    if (defSel) {
      defSel.addEventListener('change', () => {
        const st = loadStore();
        st.defaultProfileId = defSel.value;
        saveStore(st);
      });
    }

    ROUTES.forEach((route) => {
      const sel = $('cfg-api-route-' + route);
      if (!sel) return;
      sel.addEventListener('change', () => {
        const st = loadStore();
        st.routes = st.routes || {};
        st.routes[route] = sel.value;
        saveStore(st);
      });
    });
  }

  function init() {
    bind();
    render();
  }

  global.妹神官_settings_api = { init, render, loadStore, saveStore };
})(window);

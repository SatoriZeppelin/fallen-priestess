/**
 * 系统设置 · API：多套命名接口 + 路由绑定
 * 对外：window.妹神官_settings_api
 */
(function (global) {
  const STORE_KEY = 'meishinkan_api_store';
  const ROUTES = ['story', 'otherpov', 'stats', 'world', 'snapshot', 'branches'];
  const CONTEXT_MAX = 2000000;
  const expanded = Object.create(null);
  const advancedOpen = Object.create(null);
  const statusById = Object.create(null);
  let bound = false;
  let storySamplerBound = false;

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
      models: [],
    };
  }

  function emptyRoutes() {
    return {
      story: '',
      otherpov: '',
      stats: '',
      world: '',
      snapshot: '',
      branches: '',
    };
  }

  function defaultStoryPrompt() {
    return [
      'Ignoring the format in the dialogue history, when the user takes a game action, you must strictly adhere to the following format for this turn\'s output:',
      '<imotoshinkan>',
      '    <imotoshinkan_maintext>',
      '        正文内容',
      '    </imotoshinkan_maintext>',
      '',
      '    <imotoshinkan_hook>',
      '        <名称|本回合该分段应该生成什么的简略描写>',
      '    </imotoshinkan_hook>',
      '',
      '</imotoshinkan>',
      '说明:',
      '    标签要求:',
      '        - 主标签: <imotoshinkan></imotoshinkan>',
      '        - 正文标签: <imotoshinkan_maintext></imotoshinkan_maintext>',
      '        - 生成钩子标签: <imotoshinkan_hook></imotoshinkan_hook>',
      '',
      '',
      '    正文规则:',
      '        仅限以下格式：',
      '            - 托莉娜对话标签:<托莉娜|立绘ID|表情|特效|阴影|对话内容>',
      '            - 其他人对话标签:<角色名|对话内容>',
      '            - 背景标签:<背景|背景名称>',
      '            - CG标签:<CG|组名|CG名称>',
      '        必须为{{user}}为视角的托莉娜台本，禁止出现{{user}}的对话标签',
      '    引子规则:',
      '        仅限以下格式:<名称|本回合该分段应该生成什么的简略描写>',
      '        参考案例:<额外视角|托莉娜正在门后面被马蒂亚斯隐奸，努力控制自己不发出声音和{{user}}对话>',
      '        参考案例:<地点变化|庄园书库>',
      '        名称白名单:额外视角/地点变化',
      '        要求:当存在多个hook的时候换行',
      '        当托莉娜与{{user}}分头行动、不在同一地点时，必须用<额外视角|...>写出托莉娜所遭遇的事情',
      '        当托莉娜本回合的移动目的地与{{user}}不同的时，用<地点变化|地点名称>声明',
    ].join('\n');
  }

  function defaultStoryParams() {
    return {
      maxTokens: 3500,
      contextLength: 8192,
      temperature: 1,
      topK: 0,
      topP: 0.95,
      rpm: 0,
      summaryAfter: 3,
      targetChars: 5000,
      prompt: defaultStoryPrompt(),
    };
  }

  function clampNum(n, min, max, fallback) {
    const v = Number(n);
    if (!Number.isFinite(v)) return fallback;
    return Math.min(max, Math.max(min, v));
  }

  function normalizeStoryParams(src) {
    const d = defaultStoryParams();
    const s = src && typeof src === 'object' ? src : {};
    const migratingOldDefaults = Number(s.summaryAfter) === 10 && Number(s.targetChars) === 800;
    const contextLength = clampNum(s.contextLength, 1024, CONTEXT_MAX, d.contextLength);
    return {
      maxTokens: clampNum(s.maxTokens, 16, Math.max(16, contextLength), d.maxTokens),
      contextLength: contextLength,
      temperature: clampNum(s.temperature, 0, 2, d.temperature),
      topK: Math.round(clampNum(s.topK, 0, 200, d.topK)),
      topP: clampNum(s.topP, 0, 1, d.topP),
      rpm: Math.round(clampNum(s.rpm, 0, 1000, d.rpm)),
      summaryAfter: Math.round(clampNum(migratingOldDefaults ? d.summaryAfter : s.summaryAfter, 1, 100, d.summaryAfter)),
      targetChars: Math.round(clampNum(migratingOldDefaults ? d.targetChars : s.targetChars, 100, 5000, d.targetChars)),
      prompt: typeof s.prompt === 'string' ? s.prompt : d.prompt,
    };
  }

  function emptyRouteParams() {
    return {
      story: defaultStoryParams(),
    };
  }

  function normalizeRouteParams(src) {
    const s = src && typeof src === 'object' ? src : {};
    return {
      story: normalizeStoryParams(s.story),
    };
  }

  function normalizeRoutes(src) {
    const out = emptyRoutes();
    const s = src && typeof src === 'object' ? src : {};
    ROUTES.forEach((key) => {
      if (typeof s[key] === 'string') out[key] = s[key];
    });
    if (!out.snapshot && s.meta) out.snapshot = s.meta;
    if (!out.branches && s.meta) out.branches = s.meta;
    return out;
  }

  function emptyStore() {
    const first = defaultProfile('接口 1');
    return {
      profiles: [first],
      defaultProfileId: first.id,
      routes: emptyRoutes(),
      routeParams: emptyRouteParams(),
    };
  }

  function loadStore() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return emptyStore();
      const data = JSON.parse(raw);
      if (!data || !Array.isArray(data.profiles) || !data.profiles.length) return emptyStore();
      data.routes = normalizeRoutes(data.routes);
      data.routeParams = normalizeRouteParams(data.routeParams);
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
    fillStorySampler(st.routeParams && st.routeParams.story);
  }

  function storySamplerRoot() {
    return $('story-sampler');
  }

  function fmtStoryVal(key, n) {
    if (key === 'temperature') {
      return (Math.round(n * 100) / 100).toFixed(2);
    }
    if (
      key === 'maxTokens' ||
      key === 'contextLength' ||
      key === 'topK' ||
      key === 'rpm' ||
      key === 'summaryAfter' ||
      key === 'targetChars'
    ) {
      return String(Math.round(n));
    }
    const r = Math.round(n * 100) / 100;
    return Number.isInteger(r) ? String(r) : String(r);
  }

  function setRangePct(el) {
    if (!el) return;
    const min = parseFloat(el.min);
    const max = parseFloat(el.max);
    const val = parseFloat(el.value);
    const pct = max === min ? 0 : ((val - min) / (max - min)) * 100;
    el.style.setProperty('--pct', Math.min(100, Math.max(0, pct)) + '%');
  }

  function fillStorySampler(src) {
    const root = storySamplerRoot();
    if (!root) return;
    const p = normalizeStoryParams(src);
    const ctx = root.querySelector('[data-p="contextLength"]');
    if (ctx) {
      ctx.max = String(CONTEXT_MAX);
      ctx.step = '1024';
    }
    const mt = root.querySelector('[data-p="maxTokens"]');
    if (mt) mt.max = String(Math.max(16, p.contextLength));
    Object.keys(p).forEach((key) => {
      const range = root.querySelector('[data-p="' + key + '"]');
      const num = root.querySelector('[data-p-num="' + key + '"]');
      if (range) {
        range.value = String(p[key] == null ? '' : p[key]);
        if (range.type === 'range') setRangePct(range);
      }
      if (num) num.value = fmtStoryVal(key, p[key]);
    });
  }

  function readStorySampler() {
    const root = storySamplerRoot();
    const d = defaultStoryParams();
    if (!root) return d;
    const num = (key) => {
      const el = root.querySelector('[data-p="' + key + '"]');
      return el ? el.value : d[key];
    };
    return normalizeStoryParams({
      maxTokens: num('maxTokens'),
      contextLength: num('contextLength'),
      temperature: num('temperature'),
      topK: num('topK'),
      topP: num('topP'),
      rpm: num('rpm'),
      summaryAfter: num('summaryAfter'),
      targetChars: num('targetChars'),
      prompt: num('prompt'),
    });
  }

  function saveStorySampler(opts) {
    const st = loadStore();
    st.routeParams = st.routeParams || {};
    st.routeParams.story = readStorySampler();
    saveStore(st);
    if (!(opts && opts.silent)) fillStorySampler(st.routeParams.story);
  }

  function getRouteParams(route) {
    const st = loadStore();
    if (route === 'story') return normalizeStoryParams(st.routeParams && st.routeParams.story);
    return null;
  }

  function resolveProfile(route) {
    const st = loadStore();
    const profiles = st.profiles || [];
    const routeId = route && st.routes ? st.routes[route] : '';
    const pick = (id) => profiles.find((p) => p && p.id === id && p.enabled !== false);
    return (
      pick(routeId) ||
      pick(st.defaultProfileId) ||
      profiles.find((p) => p && p.enabled !== false) ||
      profiles[0] ||
      null
    );
  }

  function bindStorySampler() {
    const root = storySamplerRoot();
    if (!root || storySamplerBound) return;
    storySamplerBound = true;
    root.addEventListener('input', (e) => {
      const t = e.target;
      if (!t) return;
      if (t.matches('[data-p]') && t.type === 'range') {
        const key = t.getAttribute('data-p');
        const num = root.querySelector('[data-p-num="' + key + '"]');
        if (num) num.value = fmtStoryVal(key, parseFloat(t.value));
        setRangePct(t);
        saveStorySampler();
        return;
      }
      if (t.matches('[data-p-num]')) {
        const key = t.getAttribute('data-p-num');
        const range = root.querySelector('[data-p="' + key + '"]');
        const n = parseFloat(t.value);
        if (range && Number.isFinite(n)) {
          range.value = String(n);
          setRangePct(range);
        }
        return;
      }
      if (t.matches('textarea[data-p]')) {
        saveStorySampler({ silent: true });
      }
    });
    root.addEventListener('change', (e) => {
      const t = e.target;
      if (!t) return;
      if (t.matches('[data-p], [data-p-num]')) saveStorySampler();
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
      models: Array.isArray(prev.models) ? prev.models : [],
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
      '<div class="sys-model-field">' +
      '<div class="sys-model-combo">' +
      '<input type="text" class="sys-input" data-f="model" value="' +
      esc(p.model || '') +
      '" placeholder="连接后选择，也可手动填写" autocomplete="off" spellcheck="false" />' +
      '<button type="button" class="sys-model-caret" data-act="model-menu" aria-label="选择模型" aria-expanded="false">' +
      '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M6.2 9.2h11.6L12 16.4 6.2 9.2z"/></svg>' +
      '</button></div>' +
      '<ul class="sys-model-menu" hidden role="listbox"></ul></div>' +
      '<p class="sys-hint">可直接输入模型名，也可先获取列表后选择。</p></div>' +
      '<div class="sys-api-actions">' +
      '<button type="button" class="settings-control-btn" data-act="connect">获取模型列表</button>' +
      '<button type="button" class="settings-control-btn" data-act="test">发送测试消息</button></div>' +
      '<label class="sys-check"><input type="checkbox" data-f="autoConnect"' +
      (p.autoConnect ? ' checked' : '') +
      ' /><span class="sys-check-box" aria-hidden="true"></span><span>自动连接</span></label>' +
      '<div class="sys-api-status" data-state="' +
      esc((statusById[p.id] && statusById[p.id].state) || 'idle') +
      '"><span class="sys-api-status-dot"></span><span>' +
      esc((statusById[p.id] && statusById[p.id].text) || '未连接') +
      '</span></div>' +
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
        const pick = e.target.closest('.sys-model-menu li[data-value]');
        if (pick) {
          const card = pick.closest('.sys-api-card');
          if (!card) return;
          const input = card.querySelector('[data-f="model"]');
          if (input) input.value = pick.getAttribute('data-value') || '';
          saveCard(card);
          closeModelMenu(card);
          return;
        }
        const btn = e.target.closest('[data-act]');
        if (!btn) return;
        const card = btn.closest('.sys-api-card');
        if (!card) return;
        const id = card.getAttribute('data-id');
        const act = btn.getAttribute('data-act');
        if (act === 'model-menu') {
          e.preventDefault();
          const wrap = card.querySelector('.sys-model-field');
          if (wrap && wrap.classList.contains('is-open')) closeModelMenu(card);
          else openModelMenu(card);
          return;
        }
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
        if (act === 'connect') {
          connectProfile(id, card);
          return;
        }
        if (act === 'test') {
          testProfile(id, card);
          return;
        }
      });

      list.addEventListener('change', (e) => {
        const card = e.target.closest('.sys-api-card');
        if (!card) return;
        const cfg = saveCard(card);
        if (e.target.matches('[data-f="autoConnect"]') && cfg.autoConnect && cfg.apiKey) {
          connectProfile(cfg.id, card);
        }
      });
      list.addEventListener('mousedown', (e) => {
        const caret = e.target.closest('[data-act="model-menu"]');
        if (caret) e.preventDefault();
      });
      list.addEventListener('focusin', (e) => {
        if (!e.target.matches('[data-f="model"]')) return;
        const card = e.target.closest('.sys-api-card');
        if (card) openModelMenu(card);
      });
      list.addEventListener('input', (e) => {
        const card = e.target.closest('.sys-api-card');
        if (!card) return;
        if (e.target.matches('[data-f="name"]')) saveCard(card);
        if (e.target.matches('[data-f="model"]')) {
          saveCard(card);
          if (card.querySelector('.sys-model-field.is-open')) renderModelMenu(card);
        }
      });
    }

    document.addEventListener('click', (e) => {
      if (e.target.closest('.sys-model-field')) return;
      document.querySelectorAll('#api-profiles-list .sys-model-field.is-open').forEach((wrap) => {
        const card = wrap.closest('.sys-api-card');
        if (card) closeModelMenu(card);
      });
    });

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

    bindStorySampler();
  }

  let busyId = '';
  let autoTried = false;

  function setStatus(card, state, text) {
    const id = card && card.getAttribute('data-id');
    if (id) statusById[id] = { state: state || 'idle', text: text || '未连接' };
    if (!card) return;
    const el = card.querySelector('.sys-api-status');
    if (!el) return;
    el.setAttribute('data-state', state || 'idle');
    const label = el.querySelector('span:last-child');
    if (label) label.textContent = text || '未连接';
  }

  function modelsOf(id) {
    const st = loadStore();
    const p = st.profiles.find((x) => x.id === id);
    return p && Array.isArray(p.models) ? p.models : [];
  }

  function closeModelMenu(card) {
    const wrap = card && card.querySelector('.sys-model-field');
    const menu = card && card.querySelector('.sys-model-menu');
    const caret = card && card.querySelector('[data-act="model-menu"]');
    if (wrap) wrap.classList.remove('is-open');
    if (menu) menu.hidden = true;
    if (caret) caret.setAttribute('aria-expanded', 'false');
  }

  function renderModelMenu(card, opts) {
    opts = opts || {};
    const id = card.getAttribute('data-id');
    const menu = card.querySelector('.sys-model-menu');
    const input = card.querySelector('[data-f="model"]');
    if (!menu || !input) return;
    const ids = modelsOf(id);
    const q = opts.showAll ? '' : String(input.value || '').trim().toLowerCase();
    const filtered = !q
      ? ids.slice()
      : ids.filter((m) => String(m).toLowerCase().indexOf(q) >= 0);
    if (!ids.length) {
      menu.innerHTML = '<li class="sys-model-empty">先获取模型列表</li>';
      return;
    }
    if (!filtered.length) {
      menu.innerHTML = '<li class="sys-model-empty">无匹配模型</li>';
      return;
    }
    menu.innerHTML = filtered
      .slice(0, 80)
      .map((m) => '<li role="option" data-value="' + esc(m) + '">' + esc(m) + '</li>')
      .join('');
  }

  function openModelMenu(card) {
    if (!card) return;
    document.querySelectorAll('#api-profiles-list .sys-api-card').forEach((el) => {
      if (el !== card) closeModelMenu(el);
    });
    const wrap = card.querySelector('.sys-model-field');
    const menu = card.querySelector('.sys-model-menu');
    const caret = card.querySelector('[data-act="model-menu"]');
    if (!wrap || !menu) return;
    renderModelMenu(card, { showAll: true });
    wrap.classList.add('is-open');
    menu.hidden = false;
    if (caret) caret.setAttribute('aria-expanded', 'true');
  }

  function persistModels(id, ids) {
    const st = loadStore();
    const p = st.profiles.find((x) => x.id === id);
    if (!p) return;
    p.models = ids || [];
    saveStore(st);
  }

  async function connectProfile(id, card) {
    if (!window.妹神官_llm || busyId) return;
    busyId = id;
    const cfg = card ? saveCard(card) : (loadStore().profiles.find((p) => p.id === id) || {});
    setStatus(card, 'loading', '连接中…');
    try {
      const ids = await window.妹神官_llm.listModels(cfg);
      persistModels(id, ids);
      if (card) {
        const input = card.querySelector('[data-f="model"]');
        if (input && !String(input.value || '').trim() && ids[0]) {
          input.value = ids[0];
          saveCard(card);
        }
        openModelMenu(card);
      }
      setStatus(card, 'ok', '已连接 · ' + ids.length + ' 个模型');
      toast('已获取模型列表');
    } catch (e) {
      const msg = String((e && e.message) || e || '连接失败').slice(0, 120);
      setStatus(card, 'fail', msg);
      toast('连接失败');
    } finally {
      busyId = '';
    }
  }

  async function testProfile(id, card) {
    if (!window.妹神官_llm || busyId) return;
    busyId = id;
    const cfg = card ? saveCard(card) : (loadStore().profiles.find((p) => p.id === id) || {});
    setStatus(card, 'loading', '发送测试…');
    try {
      await window.妹神官_llm.testMessage(cfg);
      setStatus(card, 'ok', '测试消息成功');
      toast('测试成功');
    } catch (e) {
      const msg = String((e && e.message) || e || '失败').slice(0, 120);
      setStatus(card, 'fail', msg);
      toast('测试失败');
    } finally {
      busyId = '';
    }
  }

  function maybeAutoConnect() {
    if (autoTried) return;
    const st = loadStore();
    const p = st.profiles.find((x) => x.id === st.defaultProfileId) || st.profiles[0];
    if (!p || !p.autoConnect || !String(p.apiKey || '').trim()) return;
    autoTried = true;
    const card = document.querySelector('#api-profiles-list .sys-api-card[data-id="' + p.id + '"]');
    connectProfile(p.id, card);
  }

  function init() {
    bind();
    render();
    maybeAutoConnect();
  }

  global.妹神官_settings_api = { init, render, loadStore, saveStore, getRouteParams, resolveProfile };
})(window);

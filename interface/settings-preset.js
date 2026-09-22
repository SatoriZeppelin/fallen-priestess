/**
 * 系统设置 · 预设：多套命名预设 + 路由绑定 + 条目列表
 * 对外：window.妹神官_settings_preset
 */
(function (global) {
  const STORE_KEY = 'meishinkan_preset_store';
  const ROUTES = ['story', 'otherpov', 'stats', 'world', 'snapshot', 'branches'];
  const MARKER_IDS = {
    dialogueExamples: 1,
    chatHistory: 1,
    worldInfoAfter: 1,
    worldInfoBefore: 1,
    charDescription: 1,
    charPersonality: 1,
    scenario: 1,
    personaDescription: 1,
  };
  const expanded = Object.create(null);
  const expandedEntry = Object.create(null);
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
    return 'ps_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function emptyRoutes() {
    const out = {};
    ROUTES.forEach((key) => {
      out[key] = '';
    });
    return out;
  }

  function emptyStore() {
    return {
      profiles: [],
      defaultPresetId: '',
      routes: emptyRoutes(),
    };
  }

  function normalizeRole(role) {
    const r = String(role || 'system').toLowerCase();
    if (r === 'user' || r === 'assistant' || r === 'system') return r;
    return 'system';
  }

  function roleLabel(role) {
    const r = normalizeRole(role);
    if (r === 'user') return '用户';
    if (r === 'assistant') return 'AI助手';
    return '系统';
  }

  function isMarkerPrompt(p) {
    if (!p) return true;
    if (p.marker === true) return true;
    if (MARKER_IDS[p.identifier]) return true;
    return false;
  }

  function normalizeEntry(e, i) {
    const src = e && typeof e === 'object' ? e : {};
    const ident = String(src.identifier || '');
    const id = String(src.id || ident || 'pe_' + i);
    return {
      id: id,
      identifier: ident || id,
      name: String(src.name || ident || '未命名').trim() || '未命名',
      role: normalizeRole(src.role),
      content: String(src.content != null ? src.content : src.prompt || ''),
      enabled: src.enabled !== false,
      marker: src.marker === true || !!MARKER_IDS[ident] || !!MARKER_IDS[id],
      injection_position: Number(src.injection_position) || 0,
      depth: Number(src.injection_depth != null ? src.injection_depth : src.depth) || 0,
      injection_order: Number(src.injection_order != null ? src.injection_order : src.order) || 100,
    };
  }

  function pickPromptOrder(data) {
    const list = data && data.prompt_order;
    if (!Array.isArray(list) || !list.length) return [];
    let preferred = null;
    for (let i = 0; i < list.length; i++) {
      const row = list[i];
      if (!row) continue;
      if (Array.isArray(row.order)) {
        if (row.character_id === 100001 || row.character_id === '100001') return row.order;
        if (!preferred) preferred = row.order;
      } else if (row.identifier) {
        return list;
      }
    }
    return preferred || [];
  }

  function flattenOrderItems(order) {
    const out = [];
    function walk(items) {
      (items || []).forEach((item) => {
        if (!item) return;
        if (Array.isArray(item.items) && item.items.length) {
          if (item.enabled === false) return;
          walk(item.items);
          return;
        }
        out.push(item);
      });
    }
    walk(order);
    return out;
  }

  function findPromptById(prompts, id) {
    if (!id) return null;
    for (let i = 0; i < prompts.length; i++) {
      const p = prompts[i];
      if (!p) continue;
      if (p.identifier === id || p.name === id || String(p.id) === String(id)) return p;
    }
    return null;
  }

  function importStPrompts(data) {
    const prompts = Array.isArray(data.prompts) ? data.prompts : Array.isArray(data.prompt) ? data.prompt : [];
    const order = flattenOrderItems(pickPromptOrder(data));
    const entries = [];
    const seen = Object.create(null);

    function pushFrom(p, enabled) {
      if (!p) return;
      const rec = normalizeEntry(p, entries.length);
      rec.enabled = enabled !== false;
      entries.push(rec);
      seen[rec.identifier] = true;
      seen[rec.id] = true;
      if (rec.name) seen[rec.name] = true;
    }

    if (order.length) {
      order.forEach((item) => {
        const id = typeof item === 'string' ? item : item.identifier;
        const enabled = typeof item === 'object' ? item.enabled !== false : true;
        const found = findPromptById(prompts, id);
        if (found) {
          pushFrom(found, enabled);
          return;
        }
        if (!id) return;
        entries.push(
          normalizeEntry(
            {
              id: String(id),
              identifier: id,
              name: id,
              role: 'system',
              content: '',
              enabled: enabled,
              marker: !!MARKER_IDS[id],
            },
            entries.length,
          ),
        );
        seen[id] = true;
      });
      prompts.forEach((p) => {
        if (!p) return;
        const pid = p.identifier || p.name || p.id;
        if (!pid || seen[pid]) return;
        if (isMarkerPrompt(p)) return;
        const content = String(p.content != null ? p.content : p.prompt || '').trim();
        if (!content) return;
        pushFrom(p, p.enabled !== false);
      });
      return entries;
    }

    if (prompts.length) return prompts.map((p, i) => normalizeEntry(p, i));

    const fallback = [];
    if (typeof data.main_prompt === 'string' && data.main_prompt.trim()) {
      fallback.push(
        normalizeEntry(
          { id: 'main_prompt', identifier: 'main_prompt', name: 'Main Prompt', content: data.main_prompt.trim() },
          0,
        ),
      );
    }
    if (typeof data.system_prompt === 'string' && data.system_prompt.trim()) {
      fallback.push(
        normalizeEntry(
          {
            id: 'system_prompt',
            identifier: 'system_prompt',
            name: 'System Prompt',
            content: data.system_prompt.trim(),
          },
          fallback.length,
        ),
      );
    }
    return fallback;
  }

  function extractPrompts(raw) {
    if (!raw || typeof raw !== 'object') return [];
    if (Array.isArray(raw.prompt_order) && raw.prompt_order.length) return importStPrompts(raw);
    const list = Array.isArray(raw.prompts) ? raw.prompts : [];
    return list.map((e, i) => normalizeEntry(e, i));
  }

  function normalizeRoutes(src) {
    const out = emptyRoutes();
    const s = src && typeof src === 'object' ? src : {};
    ROUTES.forEach((key) => {
      if (typeof s[key] === 'string') out[key] = s[key];
    });
    return out;
  }

  function normalizeProfile(p) {
    const src = p && typeof p === 'object' ? p : {};
    return {
      id: src.id || uid(),
      name: String(src.name || src.preset_name || '未命名预设').trim() || '未命名预设',
      enabled: src.enabled !== false,
      prompts: extractPrompts(src),
    };
  }

  function loadStore() {
    let st = null;
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data && Array.isArray(data.profiles)) {
          st = data;
          st.profiles = st.profiles.map(normalizeProfile);
          st.routes = normalizeRoutes(st.routes);
          if (st.profiles.length && (!st.defaultPresetId || !st.profiles.some((p) => p.id === st.defaultPresetId))) {
            st.defaultPresetId = st.profiles[0].id;
          }
          if (!st.profiles.length) st.defaultPresetId = '';
        }
      }
    } catch (e) {}
    if (!st) {
      st = emptyStore();
      saveStore(st);
    }
    return st;
  }

  function saveStore(st) {
    localStorage.setItem(STORE_KEY, JSON.stringify(st));
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

    const defSel = $('cfg-preset-default');
    if (defSel) {
      defSel.innerHTML = options;
      defSel.value = st.defaultPresetId || (profiles[0] && profiles[0].id) || '';
    }

    ROUTES.forEach((route) => {
      const sel = $('cfg-preset-route-' + route);
      if (!sel) return;
      const cur = (st.routes && st.routes[route]) || '';
      sel.innerHTML = '<option value="">使用默认</option>' + options;
      sel.value = cur;
    });
  }

  function entrySub(e) {
    const role = roleLabel(e.role);
    if (e.marker) return role + ' · 占位';
    const raw = String(e.content || '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!raw) return role;
    return role + ' · ' + (raw.length > 42 ? raw.slice(0, 42) + '…' : raw);
  }

  function entryHtml(e, index, total, open) {
    return (
      '<article class="sys-preset-entry' +
      (open ? ' is-expanded' : '') +
      (e.enabled === false ? ' is-off' : '') +
      '" data-eid="' +
      esc(e.id) +
      '">' +
      '<header class="sys-preset-entry-head">' +
      '<button type="button" class="sys-api-toggle" data-act="etoggle" aria-expanded="' +
      (open ? 'true' : 'false') +
      '" title="展开/折叠">' +
      '<span class="sys-api-chevron" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>' +
      '</span></button>' +
      '<button type="button" class="sys-api-card-main" data-act="etoggle">' +
      '<div class="sys-api-card-title-row">' +
      '<span class="sys-preset-idx">' +
      esc(String(index + 1)) +
      '</span>' +
      '<span class="sys-api-card-title">' +
      esc(e.name) +
      '</span>' +
      '<span class="sys-preset-role is-' +
      esc(normalizeRole(e.role)) +
      '">' +
      esc(roleLabel(e.role)) +
      '</span></div>' +
      '<div class="sys-api-card-sub">' +
      esc(entrySub(e)) +
      '</div></button>' +
      '<div class="sys-api-card-actions">' +
      '<button type="button" class="sys-icon-btn" data-act="eup" title="上移"' +
      (index <= 0 ? ' disabled' : '') +
      '><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg></button>' +
      '<button type="button" class="sys-icon-btn" data-act="edown" title="下移"' +
      (index >= total - 1 ? ' disabled' : '') +
      '><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></button>' +
      '<label class="sys-check sys-check-compact"><input type="checkbox" data-ef="enabled"' +
      (e.enabled !== false ? ' checked' : '') +
      ' /><span class="sys-check-box" aria-hidden="true"></span></label>' +
      '</div></header>' +
      (open
        ? '<div class="sys-preset-entry-body">' +
          '<div class="sys-l4"><h4 class="sys-l4-title">名称</h4>' +
          '<input type="text" class="sys-input" data-ef="name" value="' +
          esc(e.name) +
          '" autocomplete="off" spellcheck="false" /></div>' +
          '<div class="sys-l4"><h4 class="sys-l4-title">角色</h4>' +
          '<select class="sys-select" data-ef="role">' +
          '<option value="system"' +
          (normalizeRole(e.role) === 'system' ? ' selected' : '') +
          '>系统</option>' +
          '<option value="user"' +
          (normalizeRole(e.role) === 'user' ? ' selected' : '') +
          '>用户</option>' +
          '<option value="assistant"' +
          (normalizeRole(e.role) === 'assistant' ? ' selected' : '') +
          '>AI助手</option></select></div>' +
          '<div class="sys-l4"><h4 class="sys-l4-title">内容</h4>' +
          '<textarea class="sys-textarea" data-ef="content" spellcheck="false" autocomplete="off">' +
          esc(e.content || '') +
          '</textarea></div></div>'
        : '') +
      '</article>'
    );
  }

  function cardHtml(p, isExpanded, index, total) {
    const entries = p.prompts || [];
    const openId = expandedEntry[p.id] || '';
    const onCount = entries.filter((e) => e && e.enabled !== false).length;
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
      (entries.length ? onCount + '/' + entries.length + ' 条条目已启用' : '空预设') +
      '</div></button>' +
      '<div class="sys-api-card-actions">' +
      '<button type="button" class="sys-icon-btn" data-act="up" title="上移"' +
      (index <= 0 ? ' disabled' : '') +
      '><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg></button>' +
      '<button type="button" class="sys-icon-btn" data-act="down" title="下移"' +
      (index >= total - 1 ? ' disabled' : '') +
      '><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></button>' +
      '<button type="button" class="sys-icon-btn" data-act="dup" title="复制"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5h10"/></svg></button>' +
      '<button type="button" class="sys-icon-btn is-danger" data-act="del" title="删除"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg></button>' +
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
      ' /><span class="sys-check-box" aria-hidden="true"></span><span>启用预设</span></label>' +
      '<div class="sys-l4"><h4 class="sys-l4-title">条目</h4>' +
      (entries.length
        ? '<div class="sys-preset-entries">' +
          entries.map((e, i) => entryHtml(e, i, entries.length, String(openId) === String(e.id))).join('') +
          '</div>'
        : '<p class="sys-preset-empty">没有条目</p>') +
      '</div></div></article>'
    );
  }

  function render() {
    const list = $('preset-profiles-list');
    const empty = $('preset-empty');
    if (!list) return;
    const st = loadStore();
    const profiles = st.profiles || [];
    if (!Object.keys(expanded).length && profiles[0]) expanded[profiles[0].id] = true;
    list.innerHTML = profiles.map((p, i) => cardHtml(p, !!expanded[p.id], i, profiles.length)).join('');
    if (empty) empty.hidden = profiles.length > 0;
    fillRouteSelects();
  }

  function findProfile(st, id) {
    return (st.profiles || []).find((p) => p.id === id) || null;
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

  function moveEntry(pid, eid, dir) {
    const st = loadStore();
    const profile = findProfile(st, pid);
    if (!profile || !Array.isArray(profile.prompts)) return;
    const i = profile.prompts.findIndex((e) => String(e.id) === String(eid));
    const j = i + dir;
    if (i < 0 || j < 0 || j >= profile.prompts.length) return;
    const tmp = profile.prompts[i];
    profile.prompts[i] = profile.prompts[j];
    profile.prompts[j] = tmp;
    saveStore(st);
    render();
  }

  function saveCard(card) {
    const id = card.getAttribute('data-id');
    const st = loadStore();
    const prev = findProfile(st, id) || {};
    const nameEl = card.querySelector('[data-f="name"]');
    const enEl = card.querySelector('[data-f="enabled"]');
    const cfg = Object.assign({}, prev, {
      id: id,
      name: (nameEl && nameEl.value.trim()) || prev.name || '新预设',
      enabled: !!(enEl && enEl.checked),
      prompts: Array.isArray(prev.prompts) ? prev.prompts : [],
    });
    st.profiles = st.profiles.map((p) => (p.id === id ? cfg : p));
    saveStore(st);
    const title = card.querySelector(':scope > .sys-api-card-head .sys-api-card-title');
    if (title) title.textContent = cfg.name;
    const badge = card.querySelector(':scope > .sys-api-card-head .sys-api-badge');
    if (badge) {
      badge.textContent = cfg.enabled ? '已启用' : '已禁用';
      badge.classList.toggle('is-on', !!cfg.enabled);
      badge.classList.toggle('is-off', !cfg.enabled);
    }
    card.classList.toggle('is-off', cfg.enabled === false);
    fillRouteSelects();
  }

  function saveEntry(card, entryEl) {
    const pid = card.getAttribute('data-id');
    const eid = entryEl.getAttribute('data-eid');
    const st = loadStore();
    const profile = findProfile(st, pid);
    if (!profile) return;
    const entry = (profile.prompts || []).find((e) => String(e.id) === String(eid));
    if (!entry) return;
    const nameEl = entryEl.querySelector('[data-ef="name"]');
    const roleEl = entryEl.querySelector('[data-ef="role"]');
    const contentEl = entryEl.querySelector('[data-ef="content"]');
    const enEl = entryEl.querySelector('[data-ef="enabled"]');
    if (nameEl) entry.name = nameEl.value.trim() || entry.identifier || '未命名';
    if (roleEl) entry.role = normalizeRole(roleEl.value);
    if (contentEl) entry.content = contentEl.value;
    if (enEl) entry.enabled = !!enEl.checked;
    saveStore(st);
    const title = entryEl.querySelector('.sys-api-card-title');
    if (title) title.textContent = entry.name;
    const roleBadge = entryEl.querySelector('.sys-preset-role');
    if (roleBadge) {
      roleBadge.className = 'sys-preset-role is-' + normalizeRole(entry.role);
      roleBadge.textContent = roleLabel(entry.role);
    }
    const sub = entryEl.querySelector('.sys-api-card-sub');
    if (sub) sub.textContent = entrySub(entry);
    entryEl.classList.toggle('is-off', entry.enabled === false);
    const head = card.querySelector(':scope > .sys-api-card-head .sys-api-card-sub');
    if (head) {
      const entries = profile.prompts || [];
      const onCount = entries.filter((e) => e && e.enabled !== false).length;
      head.textContent = entries.length ? onCount + '/' + entries.length + ' 条条目已启用' : '空预设';
    }
  }

  function downloadJson(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 800);
  }

  function importPayload(data) {
    const st = loadStore();
    let incoming = [];
    if (Array.isArray(data)) incoming = data;
    else if (data && Array.isArray(data.profiles)) incoming = data.profiles;
    else if (data && (data.name || data.prompts || data.prompt_order)) incoming = [data];
    if (!incoming.length) {
      toast('没有可导入的预设');
      return;
    }
    incoming.forEach((raw) => {
      const copy = normalizeProfile(raw);
      copy.id = uid();
      copy.name = copy.name || '导入预设';
      st.profiles.push(copy);
      expanded[copy.id] = true;
    });
    if (!st.defaultPresetId || !st.profiles.some((p) => p.id === st.defaultPresetId)) {
      st.defaultPresetId = st.profiles[0] ? st.profiles[0].id : '';
    }
    saveStore(st);
    render();
    toast('已导入 ' + incoming.length + ' 套预设');
  }

  function bind() {
    if (bound) return;
    bound = true;

    const file = $('cfg-preset-file');
    const importBtn = $('btn-preset-import');
    if (importBtn && file) {
      importBtn.addEventListener('click', () => file.click());
      file.addEventListener('change', () => {
        const f = file.files && file.files[0];
        file.value = '';
        if (!f) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            importPayload(JSON.parse(String(reader.result || '{}')));
          } catch (e) {
            toast('导入失败');
          }
        };
        reader.readAsText(f, 'utf-8');
      });
    }

    const exportBtn = $('btn-preset-export');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        downloadJson('妹神官-预设.json', loadStore());
        toast('已导出预设');
      });
    }

    const list = $('preset-profiles-list');
    if (list) {
      list.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-act]');
        if (!btn) return;
        const entry = btn.closest('.sys-preset-entry');
        const card = btn.closest('.sys-api-card');
        if (!card) return;
        const id = card.getAttribute('data-id');
        const act = btn.getAttribute('data-act');
        if (entry && act === 'etoggle') {
          const eid = entry.getAttribute('data-eid');
          if (entry.classList.contains('is-expanded')) saveEntry(card, entry);
          expandedEntry[id] = String(expandedEntry[id]) === String(eid) ? '' : eid;
          render();
          return;
        }
        if (entry && act === 'eup') {
          saveEntry(card, entry);
          moveEntry(id, entry.getAttribute('data-eid'), -1);
          return;
        }
        if (entry && act === 'edown') {
          saveEntry(card, entry);
          moveEntry(id, entry.getAttribute('data-eid'), 1);
          return;
        }
        if (act === 'toggle') {
          expanded[id] = !card.classList.contains('is-expanded');
          render();
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
          const src = findProfile(st, id);
          if (!src) return;
          const copy = Object.assign({}, src, {
            id: uid(),
            name: (src.name || '预设') + ' 副本',
            prompts: JSON.parse(JSON.stringify(src.prompts || [])),
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
          st.profiles = st.profiles.filter((p) => p.id !== id);
          if (st.defaultPresetId === id) st.defaultPresetId = (st.profiles[0] && st.profiles[0].id) || '';
          ROUTES.forEach((route) => {
            if (st.routes[route] === id) st.routes[route] = '';
          });
          saveStore(st);
          delete expanded[id];
          delete expandedEntry[id];
          render();
        }
      });
      list.addEventListener('change', (e) => {
        const entry = e.target.closest('.sys-preset-entry');
        const card = e.target.closest('.sys-api-card');
        if (entry && card) saveEntry(card, entry);
        else if (card) saveCard(card);
      });
      list.addEventListener('input', (e) => {
        const entry = e.target.closest('.sys-preset-entry');
        const card = e.target.closest('.sys-api-card');
        if (entry && card && e.target.matches('[data-ef]')) saveEntry(card, entry);
        else if (card && e.target.matches('[data-f="name"]')) saveCard(card);
      });
    }

    const defSel = $('cfg-preset-default');
    if (defSel) {
      defSel.addEventListener('change', () => {
        const st = loadStore();
        st.defaultPresetId = defSel.value;
        saveStore(st);
      });
    }

    ROUTES.forEach((route) => {
      const sel = $('cfg-preset-route-' + route);
      if (!sel) return;
      sel.addEventListener('change', () => {
        const st = loadStore();
        st.routes = st.routes || emptyRoutes();
        st.routes[route] = sel.value;
        saveStore(st);
      });
    });
  }

  function getPreset(route) {
    const st = loadStore();
    const profiles = st.profiles || [];
    const id = (st.routes && st.routes[route]) || st.defaultPresetId;
    let p = profiles.find((x) => x.id === id);
    if (p && p.enabled === false) p = profiles.find((x) => x.id === st.defaultPresetId);
    if (p && p.enabled === false) p = profiles.find((x) => x.enabled !== false);
    return p || null;
  }

  function init() {
    bind();
    render();
  }

  global.妹神官_settings_preset = { init, render, loadStore, saveStore, getPreset, fillRouteSelects };
})(window);

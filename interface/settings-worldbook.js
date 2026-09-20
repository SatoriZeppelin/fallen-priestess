/**
 * 系统设置 · 世界书（托莉娜 / 其他角色 / 主要地点 / 核心设定）
 * 对外：window.妹神官_settings_worldbook
 * 激活规则对齐 SillyTavern World Info
 */
(function (global) {
  const STORE_KEY = 'meishinkan_worldbook';
  const CG_OFF_KEY = 'meishinkan_worldbook_cg_off_v1';
  const SCAN_KEY = 'meishinkan_worldbook_scan';
  const TIMED_KEY = 'meishinkan_worldbook_timed';
  const FOLDERS = ['托莉娜', '其他角色', '主要地点', '核心设定'];
  const NPC_KEYS = ['哈罗德', '埃德加', '约书亚', '温蒂', '莫里斯', '马蒂亚斯'];
  const LOGIC = { AND_ANY: 0, NOT_ALL: 1, NOT_ANY: 2, AND_ALL: 3 };
  const MAX_RECURSION_CAP = 20;
  const CJK_RE = /[\u2e80-\u9fff\u3040-\u30ff\uac00-\ud7af]/;

  function isCgEntry(e) {
    return /CG/i.test(String((e && e.comment) || ''));
  }

  function disableCgEntries(st) {
    if (!st || !Array.isArray(st.folders)) return st;
    st.folders.forEach(function (folder) {
      (folder.entries || []).forEach(function (e) {
        if (isCgEntry(e)) e.enabled = false;
      });
    });
    return st;
  }
  const expanded = Object.create(null);
  let activeFolder = FOLDERS[0];
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

  function emptyStore() {
    return {
      name: '影色渐染~阿斯林顿的妹神官',
      folders: FOLDERS.map(function (name) {
        return { id: name, name: name, entries: [] };
      }),
    };
  }

  function cloneDefault() {
    const src = global.妹神官_default_worldbook;
    if (!src) return disableCgEntries(emptyStore());
    try {
      return disableCgEntries(JSON.parse(JSON.stringify(src)));
    } catch (e) {
      return disableCgEntries(emptyStore());
    }
  }

  function folderOf(e) {
    if (e && FOLDERS.indexOf(e.folder) >= 0) return e.folder;
    const comment = String((e && (e.comment || e.name)) || '');
    if (comment.indexOf('托莉娜') === 0 || comment.indexOf('托莉娜-') >= 0 || comment.indexOf('阶段4-文风') >= 0) {
      return '托莉娜';
    }
    if (comment.indexOf('地点-') === 0 || comment.indexOf('废弃-地点') === 0) {
      return '主要地点';
    }
    const keys = [].concat((e && (e.keys || e.key)) || []);
    const keyjoin = keys.join(' ');
    for (let i = 0; i < NPC_KEYS.length; i++) {
      const n = NPC_KEYS[i];
      if ((comment.indexOf(n) >= 0 || keyjoin.indexOf(n) >= 0) && comment.indexOf('地点') !== 0) {
        return '其他角色';
      }
    }
    return '核心设定';
  }

  function asArray(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'object') {
      return Object.keys(raw).map(function (k) {
        return raw[k];
      });
    }
    return [];
  }

  function extractRawEntries(data) {
    if (!data || typeof data !== 'object') return [];
    if (Array.isArray(data.folders)) {
      const all = [];
      data.folders.forEach(function (folder) {
        asArray(folder && folder.entries).forEach(function (e) {
          if (e && typeof e === 'object') {
            all.push(Object.assign({}, e, { folder: (folder && folder.name) || e.folder }));
          }
        });
      });
      if (all.length) return all;
    }
    const orig = data.originalData && data.originalData.entries;
    return asArray(orig || data.entries);
  }

  function extObj(e) {
    return e && e.extensions && typeof e.extensions === 'object' ? e.extensions : {};
  }

  function pickRaw(e, snake, camel) {
    const ext = extObj(e);
    if (e && e[snake] != null && e[snake] !== '') return e[snake];
    if (e && camel && e[camel] != null && e[camel] !== '') return e[camel];
    if (ext[snake] != null && ext[snake] !== '') return ext[snake];
    if (camel && ext[camel] != null && ext[camel] !== '') return ext[camel];
    return undefined;
  }

  function pickNum(e, snake, camel, fallback) {
    const v = pickRaw(e, snake, camel);
    if (v == null || v === '') return fallback;
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }

  function pickNumOrNull(e, snake, camel) {
    const v = pickRaw(e, snake, camel);
    if (v == null || v === '') return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  function pickBool(e, snake, camel, fallback) {
    const ext = extObj(e);
    if (e && typeof e[snake] === 'boolean') return e[snake];
    if (e && camel && typeof e[camel] === 'boolean') return e[camel];
    if (typeof ext[snake] === 'boolean') return ext[snake];
    if (camel && typeof ext[camel] === 'boolean') return ext[camel];
    return fallback;
  }

  function pickTri(e, snake, camel) {
    const v = pickRaw(e, snake, camel);
    if (v == null || v === '') return null;
    return !!v;
  }

  function pickStr(e, snake, camel, fallback) {
    const v = pickRaw(e, snake, camel);
    return v == null ? fallback : String(v);
  }

  function parsePosition(e) {
    const ext = extObj(e);
    const v = ext.position != null && ext.position !== '' ? ext.position : e.position;
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    const map = {
      before_char: 0,
      before: 0,
      after_char: 1,
      after: 1,
      before_an: 2,
      an_top: 2,
      after_an: 3,
      an_bottom: 3,
      at_depth: 4,
      atDepth: 4,
      before_em: 5,
      em_top: 5,
      after_em: 6,
      em_bottom: 6,
      outlet: 7,
    };
    if (typeof v === 'string' && map[v] != null) return map[v];
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function parseTriggers(v) {
    if (!v) return [];
    if (Array.isArray(v)) return v.map(String).filter(Boolean);
    return String(v)
      .split(/[,，]/)
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);
  }

  function defaultScan() {
    return {
      scanDepth: 2,
      minActivations: 0,
      minActivationsDepthMax: 0,
      recursive: true,
      maxRecursionSteps: 0,
      caseSensitive: false,
      matchWholeWords: false,
      includeNames: true,
      useGroupScoring: false,
      budget: 0,
    };
  }

  function loadScan() {
    const base = defaultScan();
    try {
      const raw = localStorage.getItem(SCAN_KEY);
      if (!raw) return base;
      const o = JSON.parse(raw);
      if (!o || typeof o !== 'object') return base;
      return {
        scanDepth: Math.max(0, Number(o.scanDepth) || 0),
        minActivations: Math.max(0, Number(o.minActivations) || 0),
        minActivationsDepthMax: Math.max(0, Number(o.minActivationsDepthMax) || 0),
        recursive: o.recursive !== false,
        maxRecursionSteps: Math.max(0, Number(o.maxRecursionSteps) || 0),
        caseSensitive: !!o.caseSensitive,
        matchWholeWords: !!o.matchWholeWords,
        includeNames: o.includeNames !== false,
        useGroupScoring: !!o.useGroupScoring,
        budget: Math.max(0, Number(o.budget) || 0),
      };
    } catch (err) {
      return base;
    }
  }

  function saveScan(g) {
    try {
      localStorage.setItem(SCAN_KEY, JSON.stringify(g));
    } catch (err) {}
    return g;
  }

  function emptyTimed() {
    return { sticky: {}, cooldown: {}, tick: 0 };
  }

  function loadTimed() {
    try {
      const o = JSON.parse(localStorage.getItem(TIMED_KEY) || '{}');
      return {
        sticky: o.sticky && typeof o.sticky === 'object' ? o.sticky : {},
        cooldown: o.cooldown && typeof o.cooldown === 'object' ? o.cooldown : {},
        tick: Number(o.tick) || 0,
      };
    } catch (err) {
      return emptyTimed();
    }
  }

  function saveTimed(t) {
    try {
      localStorage.setItem(TIMED_KEY, JSON.stringify(t));
    } catch (err) {}
    return t;
  }

  function tickTimed() {
    const t = loadTimed();
    t.tick += 1;
    Object.keys(t.sticky).forEach(function (uid) {
      t.sticky[uid] = Number(t.sticky[uid]) - 1;
      if (!(t.sticky[uid] > 0)) delete t.sticky[uid];
    });
    Object.keys(t.cooldown).forEach(function (uid) {
      t.cooldown[uid] = Number(t.cooldown[uid]) - 1;
      if (!(t.cooldown[uid] > 0)) delete t.cooldown[uid];
    });
    return saveTimed(t);
  }

  function syncExtensions(e) {
    e.extensions = Object.assign({}, extObj(e), {
      position: e.position,
      exclude_recursion: !!e.exclude_recursion,
      display_index: e.display_index != null ? e.display_index : e.uid,
      probability: e.probability,
      useProbability: e.useProbability !== false,
      depth: e.depth,
      selectiveLogic: e.selectiveLogic,
      outlet_name: e.outlet_name || '',
      group: e.group || '',
      group_override: !!e.group_override,
      group_weight: e.group_weight,
      prevent_recursion: !!e.prevent_recursion,
      delay_until_recursion: e.delay_until_recursion,
      scan_depth: e.scan_depth,
      match_whole_words: e.match_whole_words,
      use_group_scoring: !!e.use_group_scoring,
      case_sensitive: e.case_sensitive,
      automation_id: e.automation_id || '',
      role: e.role,
      vectorized: !!e.vectorized,
      sticky: e.sticky,
      cooldown: e.cooldown,
      delay: e.delay,
      match_persona_description: !!e.match_persona_description,
      match_character_description: !!e.match_character_description,
      match_character_personality: !!e.match_character_personality,
      match_character_depth_prompt: !!e.match_character_depth_prompt,
      match_scenario: !!e.match_scenario,
      match_creator_notes: !!e.match_creator_notes,
      triggers: Array.isArray(e.triggers) ? e.triggers : [],
      ignore_budget: !!e.ignore_budget,
    });
    return e;
  }

  function normEntry(e, idx) {
    e = e && typeof e === 'object' ? e : {};
    let keys = e.keys || e.key || [];
    if (typeof keys === 'string') keys = parseKeys(keys);
    let sec = e.secondary_keys || e.keysecondary || [];
    if (typeof sec === 'string') sec = parseKeys(sec);
    let enabled = e.enabled;
    if (enabled == null) enabled = !e.disable;
    const uid = e.uid != null ? e.uid : e.id != null ? e.id : idx;
    const delayUntil = pickRaw(e, 'delay_until_recursion', 'delayUntilRecursion');
    const rec = {
      uid: uid,
      comment: e.comment || e.name || '',
      content: e.content || e.entry || '',
      keys: Array.isArray(keys) ? keys.slice() : [],
      secondary_keys: Array.isArray(sec) ? sec.slice() : [],
      constant: !!(e.constant || e.always || e.forceActivation),
      enabled: !!enabled,
      insertion_order: pickNum(e, 'insertion_order', 'order', idx),
      position: parsePosition(e),
      selective: e.selective !== false,
      selectiveLogic: pickNum(e, 'selectiveLogic', 'selective_logic', LOGIC.AND_ANY),
      probability: pickNum(e, 'probability', null, 100),
      useProbability: pickBool(e, 'useProbability', 'use_probability', true),
      depth: pickNum(e, 'depth', null, 4),
      role: pickNum(e, 'role', null, 0),
      scan_depth: pickNumOrNull(e, 'scan_depth', 'scanDepth'),
      case_sensitive: pickTri(e, 'case_sensitive', 'caseSensitive'),
      match_whole_words: pickTri(e, 'match_whole_words', 'matchWholeWords'),
      exclude_recursion: pickBool(e, 'exclude_recursion', 'excludeRecursion', false),
      prevent_recursion: pickBool(e, 'prevent_recursion', 'preventRecursion', false),
      delay_until_recursion: delayUntil == null || delayUntil === '' ? false : delayUntil,
      ignore_budget: pickBool(e, 'ignore_budget', 'ignoreBudget', false),
      group: pickStr(e, 'group', null, ''),
      group_override: pickBool(e, 'group_override', 'groupOverride', false),
      group_weight: pickNum(e, 'group_weight', 'groupWeight', 100),
      use_group_scoring: pickBool(e, 'use_group_scoring', 'useGroupScoring', false),
      automation_id: pickStr(e, 'automation_id', 'automationId', ''),
      outlet_name: pickStr(e, 'outlet_name', 'outletName', ''),
      vectorized: pickBool(e, 'vectorized', null, false),
      sticky: pickNum(e, 'sticky', null, 0),
      cooldown: pickNum(e, 'cooldown', null, 0),
      delay: pickNum(e, 'delay', null, 0),
      match_persona_description: pickBool(e, 'match_persona_description', 'matchPersonaDescription', false),
      match_character_description: pickBool(e, 'match_character_description', 'matchCharacterDescription', false),
      match_character_personality: pickBool(e, 'match_character_personality', 'matchCharacterPersonality', false),
      match_character_depth_prompt: pickBool(e, 'match_character_depth_prompt', 'matchCharacterDepthPrompt', false),
      match_scenario: pickBool(e, 'match_scenario', 'matchScenario', false),
      match_creator_notes: pickBool(e, 'match_creator_notes', 'matchCreatorNotes', false),
      triggers: parseTriggers(pickRaw(e, 'triggers', null)),
      display_index: pickNum(e, 'display_index', 'displayIndex', idx),
      extensions: extObj(e),
    };
    return syncExtensions(rec);
  }

  function normalize(raw) {
    const base = emptyStore();
    const src = raw && typeof raw === 'object' ? raw : {};
    base.name = src.name || base.name;
    const byName = Object.create(null);
    asArray(src.folders).forEach(function (folder) {
      if (!folder || typeof folder !== 'object') return;
      const name = FOLDERS.indexOf(folder.name) >= 0 ? folder.name : folder.id;
      if (FOLDERS.indexOf(name) < 0) return;
      byName[name] = asArray(folder.entries).map(function (e, i) {
        return normEntry(e, i);
      });
    });
    if (!asArray(src.folders).length) {
      extractRawEntries(src).forEach(function (e, i) {
        const rec = normEntry(e, i);
        const name = folderOf(e);
        if (!byName[name]) byName[name] = [];
        byName[name].push(rec);
      });
    }
    base.folders.forEach(function (folder) {
      folder.entries = byName[folder.name] || [];
    });
    return base;
  }

  function loadStore() {
    let st = null;
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) st = normalize(JSON.parse(raw));
    } catch (e) {}
    if (!st) st = normalize(cloneDefault());
    if (!localStorage.getItem(CG_OFF_KEY)) {
      disableCgEntries(st);
      localStorage.setItem(CG_OFF_KEY, '1');
      saveStore(st);
      return st;
    }
    if (!localStorage.getItem(STORE_KEY)) saveStore(st);
    return st;
  }

  function saveStore(st) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(st));
    } catch (e) {
      toast('世界书保存失败');
    }
    return st;
  }

  function folderByName(st, name) {
    return (st.folders || []).find(function (f) {
      return f.name === name;
    });
  }

  function activeEntries(st) {
    const folder = folderByName(st, activeFolder);
    return folder && Array.isArray(folder.entries) ? folder.entries : [];
  }

  function findEntry(st, uid) {
    const id = String(uid);
    for (let i = 0; i < (st.folders || []).length; i++) {
      const list = st.folders[i].entries || [];
      for (let j = 0; j < list.length; j++) {
        if (String(list[j].uid) === id) return { folder: st.folders[i], entry: list[j], index: j };
      }
    }
    return null;
  }

  function nextUid(st) {
    let m = 0;
    (st.folders || []).forEach(function (folder) {
      (folder.entries || []).forEach(function (e) {
        const n = Number(e.uid);
        if (Number.isFinite(n) && n > m) m = n;
      });
    });
    return m + 1;
  }

  function parseKeys(text) {
    return String(text || '')
      .split(/[,，]/)
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);
  }

  function keysLabel(e) {
    if (e.constant) return '常驻';
    const keys = (e.keys || []).filter(Boolean);
    return keys.length ? keys.join(' · ') : '无关键词';
  }

  function parseTriSelect(val) {
    if (val === '' || val == null) return null;
    return val === '1' || val === 'true';
  }

  function optNumAttr(v) {
    return v == null ? '' : esc(String(v));
  }

  function cardHtml(e, isExpanded, index, total) {
    const id = String(e.uid);
    return (
      '<article class="sys-api-card' +
      (isExpanded ? ' is-expanded' : '') +
      (e.enabled === false ? ' is-off' : '') +
      '" data-uid="' +
      esc(id) +
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
      esc(e.comment || '未命名条目') +
      '</span>' +
      '<span class="sys-api-badge ' +
      (e.enabled !== false ? 'is-on' : 'is-off') +
      '">' +
      (e.enabled !== false ? '已启用' : '已禁用') +
      '</span></div>' +
      '<div class="sys-api-card-sub">' +
      esc('UID ' + id + ' · ' + keysLabel(e) + ' · 顺序 ' + (e.insertion_order || 0)) +
      '</div></button>' +
      '<div class="sys-api-card-actions">' +
      '<button type="button" class="sys-icon-btn" data-act="up" title="上移"' +
      (index === 0 ? ' disabled' : '') +
      '><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 14 12 8 18 14"/></svg></button>' +
      '<button type="button" class="sys-icon-btn" data-act="down" title="下移"' +
      (index >= total - 1 ? ' disabled' : '') +
      '><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 10 12 16 18 10"/></svg></button>' +
      '<button type="button" class="sys-icon-btn is-danger" data-act="del" title="删除">' +
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg></button>' +
      '</div></header>' +
      (isExpanded
        ? '<div class="sys-api-card-body">' +
          '<div class="sys-l4"><h4 class="sys-l4-title">名称</h4>' +
          '<input type="text" class="sys-input" data-f="comment" value="' +
          esc(e.comment || '') +
          '" autocomplete="off" spellcheck="false" /></div>' +
          '<div class="sys-wb-checks">' +
          '<label class="sys-check"><input type="checkbox" data-f="enabled"' +
          (e.enabled !== false ? ' checked' : '') +
          ' /><span class="sys-check-box" aria-hidden="true"></span><span>启用</span></label>' +
          '<label class="sys-check"><input type="checkbox" data-f="constant"' +
          (e.constant ? ' checked' : '') +
          ' /><span class="sys-check-box" aria-hidden="true"></span><span>常驻</span></label>' +
          '<label class="sys-check"><input type="checkbox" data-f="selective"' +
          (e.selective !== false ? ' checked' : '') +
          ' /><span class="sys-check-box" aria-hidden="true"></span><span>选择性</span></label>' +
          '<label class="sys-check"><input type="checkbox" data-f="useProbability"' +
          (e.useProbability !== false ? ' checked' : '') +
          ' /><span class="sys-check-box" aria-hidden="true"></span><span>使用概率</span></label>' +
          '</div>' +
          '<div class="sys-route-binds">' +
          '<div class="sys-l4"><h4 class="sys-l4-title">插入顺序</h4>' +
          '<input type="number" class="sys-input" data-f="insertion_order" value="' +
          esc(e.insertion_order || 0) +
          '" /></div>' +
          '<div class="sys-l4"><h4 class="sys-l4-title">概率</h4>' +
          '<input type="number" class="sys-input" data-f="probability" min="0" max="100" value="' +
          esc(e.probability == null ? 100 : e.probability) +
          '" /></div>' +
          '<div class="sys-l4"><h4 class="sys-l4-title">插入位置</h4>' +
          '<select class="sys-select" data-f="position">' +
          opt(0, e.position, '角色定义之前') +
          opt(1, e.position, '角色定义之后') +
          opt(5, e.position, '示例消息前') +
          opt(6, e.position, '示例消息后') +
          opt(2, e.position, '作者注释之前') +
          opt(3, e.position, '作者注释之后') +
          opt(4, e.position, '@D 在深度') +
          opt(7, e.position, 'Outlet') +
          '</select></div>' +
          '<div class="sys-l4"><h4 class="sys-l4-title">深度 (@D)</h4>' +
          '<input type="number" class="sys-input" data-f="depth" min="0" value="' +
          esc(e.depth == null ? 4 : e.depth) +
          '" /></div>' +
          '<div class="sys-l4"><h4 class="sys-l4-title">角色</h4>' +
          '<select class="sys-select" data-f="role">' +
          opt(0, e.role, '系统') +
          opt(1, e.role, '用户') +
          opt(2, e.role, 'AI') +
          '</select></div>' +
          '<div class="sys-l4"><h4 class="sys-l4-title">逻辑</h4>' +
          '<select class="sys-select" data-f="selectiveLogic">' +
          opt(0, e.selectiveLogic, '与任意') +
          opt(1, e.selectiveLogic, '非全部') +
          opt(2, e.selectiveLogic, '非任意') +
          opt(3, e.selectiveLogic, '与全部') +
          '</select></div>' +
          '</div>' +
          '<div class="sys-l4"><h4 class="sys-l4-title">主要关键字</h4>' +
          '<textarea class="sys-textarea sys-wb-keys" data-f="keys" spellcheck="false">' +
          esc((e.keys || []).join(', ')) +
          '</textarea></div>' +
          '<div class="sys-l4"><h4 class="sys-l4-title">可选过滤器</h4>' +
          '<textarea class="sys-textarea sys-wb-keys" data-f="secondary_keys" spellcheck="false">' +
          esc((e.secondary_keys || []).join(', ')) +
          '</textarea></div>' +
          '<div class="sys-route-binds">' +
          '<div class="sys-l4"><h4 class="sys-l4-title">扫描深度</h4>' +
          '<input type="number" class="sys-input" data-f="scan_depth" min="0" placeholder="使用全局" value="' +
          optNumAttr(e.scan_depth) +
          '" /></div>' +
          '<div class="sys-l4"><h4 class="sys-l4-title">区分大小写</h4>' +
          '<select class="sys-select" data-f="case_sensitive">' +
          triOpts(e.case_sensitive) +
          '</select></div>' +
          '<div class="sys-l4"><h4 class="sys-l4-title">完整单词</h4>' +
          '<select class="sys-select" data-f="match_whole_words">' +
          triOpts(e.match_whole_words) +
          '</select></div>' +
          '<div class="sys-l4"><h4 class="sys-l4-title">组</h4>' +
          '<input type="text" class="sys-input" data-f="group" value="' +
          esc(e.group || '') +
          '" autocomplete="off" spellcheck="false" /></div>' +
          '<div class="sys-l4"><h4 class="sys-l4-title">组权重</h4>' +
          '<input type="number" class="sys-input" data-f="group_weight" min="1" value="' +
          esc(e.group_weight == null ? 100 : e.group_weight) +
          '" /></div>' +
          '<div class="sys-l4"><h4 class="sys-l4-title">自动化 ID</h4>' +
          '<input type="text" class="sys-input" data-f="automation_id" value="' +
          esc(e.automation_id || '') +
          '" autocomplete="off" spellcheck="false" /></div>' +
          '<div class="sys-l4"><h4 class="sys-l4-title">Outlet</h4>' +
          '<input type="text" class="sys-input" data-f="outlet_name" value="' +
          esc(e.outlet_name || '') +
          '" autocomplete="off" spellcheck="false" /></div>' +
          '<div class="sys-l4"><h4 class="sys-l4-title">粘滞</h4>' +
          '<input type="number" class="sys-input" data-f="sticky" min="0" value="' +
          esc(e.sticky || 0) +
          '" /></div>' +
          '<div class="sys-l4"><h4 class="sys-l4-title">冷却</h4>' +
          '<input type="number" class="sys-input" data-f="cooldown" min="0" value="' +
          esc(e.cooldown || 0) +
          '" /></div>' +
          '<div class="sys-l4"><h4 class="sys-l4-title">延迟</h4>' +
          '<input type="number" class="sys-input" data-f="delay" min="0" value="' +
          esc(e.delay || 0) +
          '" /></div>' +
          '</div>' +
          '<div class="sys-wb-checks">' +
          '<label class="sys-check"><input type="checkbox" data-f="exclude_recursion"' +
          (e.exclude_recursion ? ' checked' : '') +
          ' /><span class="sys-check-box" aria-hidden="true"></span><span>不可递归</span></label>' +
          '<label class="sys-check"><input type="checkbox" data-f="delay_until_recursion"' +
          (delayUntilOn(e) ? ' checked' : '') +
          ' /><span class="sys-check-box" aria-hidden="true"></span><span>延迟到递归</span></label>' +
          '<label class="sys-check"><input type="checkbox" data-f="prevent_recursion"' +
          (e.prevent_recursion ? ' checked' : '') +
          ' /><span class="sys-check-box" aria-hidden="true"></span><span>防止进一步递归</span></label>' +
          '<label class="sys-check"><input type="checkbox" data-f="ignore_budget"' +
          (e.ignore_budget ? ' checked' : '') +
          ' /><span class="sys-check-box" aria-hidden="true"></span><span>忽视限额</span></label>' +
          '<label class="sys-check"><input type="checkbox" data-f="group_override"' +
          (e.group_override ? ' checked' : '') +
          ' /><span class="sys-check-box" aria-hidden="true"></span><span>组优先</span></label>' +
          '<label class="sys-check"><input type="checkbox" data-f="use_group_scoring"' +
          (e.use_group_scoring ? ' checked' : '') +
          ' /><span class="sys-check-box" aria-hidden="true"></span><span>组评分</span></label>' +
          '<label class="sys-check"><input type="checkbox" data-f="vectorized"' +
          (e.vectorized ? ' checked' : '') +
          ' /><span class="sys-check-box" aria-hidden="true"></span><span>向量化</span></label>' +
          '<label class="sys-check"><input type="checkbox" data-f="match_persona_description"' +
          (e.match_persona_description ? ' checked' : '') +
          ' /><span class="sys-check-box" aria-hidden="true"></span><span>匹配人设</span></label>' +
          '<label class="sys-check"><input type="checkbox" data-f="match_character_description"' +
          (e.match_character_description ? ' checked' : '') +
          ' /><span class="sys-check-box" aria-hidden="true"></span><span>匹配角色描述</span></label>' +
          '<label class="sys-check"><input type="checkbox" data-f="match_character_personality"' +
          (e.match_character_personality ? ' checked' : '') +
          ' /><span class="sys-check-box" aria-hidden="true"></span><span>匹配性格</span></label>' +
          '<label class="sys-check"><input type="checkbox" data-f="match_character_depth_prompt"' +
          (e.match_character_depth_prompt ? ' checked' : '') +
          ' /><span class="sys-check-box" aria-hidden="true"></span><span>匹配深度提示</span></label>' +
          '<label class="sys-check"><input type="checkbox" data-f="match_scenario"' +
          (e.match_scenario ? ' checked' : '') +
          ' /><span class="sys-check-box" aria-hidden="true"></span><span>匹配场景</span></label>' +
          '<label class="sys-check"><input type="checkbox" data-f="match_creator_notes"' +
          (e.match_creator_notes ? ' checked' : '') +
          ' /><span class="sys-check-box" aria-hidden="true"></span><span>匹配创作者注释</span></label>' +
          '</div>' +
          '<div class="sys-l4"><h4 class="sys-l4-title">触发类型</h4>' +
          '<input type="text" class="sys-input" data-f="triggers" value="' +
          esc((e.triggers || []).join(', ')) +
          '" placeholder="空=全部；normal, continue, swipe" autocomplete="off" spellcheck="false" /></div>' +
          '<div class="sys-l4"><h4 class="sys-l4-title">内容</h4>' +
          '<textarea class="sys-textarea" data-f="content" spellcheck="false">' +
          esc(e.content || '') +
          '</textarea></div></div>'
        : '') +
      '</article>'
    );
  }

  function opt(value, current, label) {
    return (
      '<option value="' +
      value +
      '"' +
      (Number(current) === Number(value) ? ' selected' : '') +
      '>' +
      esc(label) +
      '</option>'
    );
  }

  function triOpts(val) {
    return (
      '<option value=""' +
      (val == null ? ' selected' : '') +
      '>使用全局</option>' +
      '<option value="1"' +
      (val === true ? ' selected' : '') +
      '>是</option>' +
      '<option value="0"' +
      (val === false ? ' selected' : '') +
      '>否</option>'
    );
  }

  function delayUntilOn(e) {
    const v = e && e.delay_until_recursion;
    if (v === true) return true;
    const n = Number(v);
    return Number.isFinite(n) && n > 0;
  }

  function delayUntilStep(e) {
    const v = e && e.delay_until_recursion;
    if (v === true) return 1;
    if (v === false || v == null || v === '') return 0;
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }

  function renderNav(st) {
    const nav = $('wb-foldernav');
    if (!nav) return;
    nav.innerHTML = FOLDERS.map(function (name) {
      const folder = folderByName(st, name);
      const count = folder && folder.entries ? folder.entries.length : 0;
      return (
        '<button type="button" class="sys-foldertab' +
        (name === activeFolder ? ' active' : '') +
        '" data-folder="' +
        esc(name) +
        '">' +
        esc(name) +
        '<span class="sys-foldertab-count">' +
        count +
        '</span></button>'
      );
    }).join('');
  }

  function fillScanForm() {
    const g = loadScan();
    const setVal = function (id, v) {
      const el = $(id);
      if (el) el.value = v;
    };
    const setChk = function (id, v) {
      const el = $(id);
      if (el) el.checked = !!v;
    };
    setVal('cfg-wb-scan-depth', g.scanDepth);
    setVal('cfg-wb-min-act', g.minActivations);
    setVal('cfg-wb-min-act-depth', g.minActivationsDepthMax);
    setVal('cfg-wb-max-rec', g.maxRecursionSteps);
    setVal('cfg-wb-budget', g.budget);
    setChk('cfg-wb-recursive', g.recursive);
    setChk('cfg-wb-case', g.caseSensitive);
    setChk('cfg-wb-whole', g.matchWholeWords);
    setChk('cfg-wb-names', g.includeNames);
    setChk('cfg-wb-group-score', g.useGroupScoring);
  }

  function readScanForm() {
    const num = function (id, fallback) {
      const el = $(id);
      if (!el) return fallback;
      const n = Number(el.value);
      return Number.isFinite(n) ? n : fallback;
    };
    const chk = function (id, fallback) {
      const el = $(id);
      return el ? !!el.checked : fallback;
    };
    return saveScan({
      scanDepth: Math.max(0, num('cfg-wb-scan-depth', 2)),
      minActivations: Math.max(0, num('cfg-wb-min-act', 0)),
      minActivationsDepthMax: Math.max(0, num('cfg-wb-min-act-depth', 0)),
      recursive: chk('cfg-wb-recursive', true),
      maxRecursionSteps: Math.max(0, num('cfg-wb-max-rec', 0)),
      caseSensitive: chk('cfg-wb-case', false),
      matchWholeWords: chk('cfg-wb-whole', false),
      includeNames: chk('cfg-wb-names', true),
      useGroupScoring: chk('cfg-wb-group-score', false),
      budget: Math.max(0, num('cfg-wb-budget', 0)),
    });
  }

  function render() {
    const st = loadStore();
    renderNav(st);
    const list = $('wb-entry-list');
    const empty = $('wb-empty');
    const entries = activeEntries(st);
    if (list) {
      list.innerHTML = entries
        .map(function (e, i) {
          return cardHtml(e, !!expanded[String(e.uid)], i, entries.length);
        })
        .join('');
    }
    if (empty) empty.hidden = entries.length > 0;
  }

  function val(card, f) {
    return card.querySelector('[data-f="' + f + '"]');
  }

  function saveCard(card) {
    const uid = card.getAttribute('data-uid');
    const st = loadStore();
    const hit = findEntry(st, uid);
    if (!hit) return;
    const e = hit.entry;
    const comment = val(card, 'comment');
    const enabled = val(card, 'enabled');
    const constant = val(card, 'constant');
    const selective = val(card, 'selective');
    const useProbability = val(card, 'useProbability');
    const keys = val(card, 'keys');
    const secondary = val(card, 'secondary_keys');
    const content = val(card, 'content');
    const insertion = val(card, 'insertion_order');
    const probability = val(card, 'probability');
    const position = val(card, 'position');
    const depth = val(card, 'depth');
    const role = val(card, 'role');
    const selectiveLogic = val(card, 'selectiveLogic');
    const scanDepth = val(card, 'scan_depth');
    const caseSensitive = val(card, 'case_sensitive');
    const matchWhole = val(card, 'match_whole_words');
    const group = val(card, 'group');
    const groupWeight = val(card, 'group_weight');
    const automationId = val(card, 'automation_id');
    const outlet = val(card, 'outlet_name');
    const sticky = val(card, 'sticky');
    const cooldown = val(card, 'cooldown');
    const delay = val(card, 'delay');
    const triggers = val(card, 'triggers');
    if (comment) e.comment = comment.value;
    if (enabled) e.enabled = enabled.checked;
    if (constant) e.constant = constant.checked;
    if (selective) e.selective = selective.checked;
    if (useProbability) e.useProbability = useProbability.checked;
    if (keys) e.keys = parseKeys(keys.value);
    if (secondary) e.secondary_keys = parseKeys(secondary.value);
    if (content) e.content = content.value;
    if (insertion) e.insertion_order = Number(insertion.value) || 0;
    if (probability) e.probability = Math.max(0, Math.min(100, Number(probability.value) || 0));
    if (position) e.position = Number(position.value) || 0;
    if (depth) e.depth = Number(depth.value) || 0;
    if (role) e.role = Number(role.value) || 0;
    if (selectiveLogic) e.selectiveLogic = Number(selectiveLogic.value) || 0;
    if (scanDepth) e.scan_depth = scanDepth.value === '' ? null : Number(scanDepth.value);
    if (caseSensitive) e.case_sensitive = parseTriSelect(caseSensitive.value);
    if (matchWhole) e.match_whole_words = parseTriSelect(matchWhole.value);
    if (group) e.group = group.value;
    if (groupWeight) e.group_weight = Number(groupWeight.value) || 100;
    if (automationId) e.automation_id = automationId.value;
    if (outlet) e.outlet_name = outlet.value;
    if (sticky) e.sticky = Math.max(0, Number(sticky.value) || 0);
    if (cooldown) e.cooldown = Math.max(0, Number(cooldown.value) || 0);
    if (delay) e.delay = Math.max(0, Number(delay.value) || 0);
    if (triggers) e.triggers = parseTriggers(triggers.value);
    [
      'exclude_recursion',
      'prevent_recursion',
      'ignore_budget',
      'group_override',
      'use_group_scoring',
      'vectorized',
      'match_persona_description',
      'match_character_description',
      'match_character_personality',
      'match_character_depth_prompt',
      'match_scenario',
      'match_creator_notes',
    ].forEach(function (f) {
      const el = val(card, f);
      if (el) e[f] = el.checked;
    });
    const delayEl = val(card, 'delay_until_recursion');
    if (delayEl) e.delay_until_recursion = delayEl.checked;
    syncExtensions(e);
    saveStore(st);
    const badge = card.querySelector('.sys-api-badge');
    if (badge) {
      badge.textContent = e.enabled ? '已启用' : '已禁用';
      badge.classList.toggle('is-on', !!e.enabled);
      badge.classList.toggle('is-off', !e.enabled);
    }
    card.classList.toggle('is-off', e.enabled === false);
    const title = card.querySelector('.sys-api-card-title');
    if (title) title.textContent = e.comment || '未命名条目';
    const sub = card.querySelector('.sys-api-card-sub');
    if (sub) sub.textContent = 'UID ' + e.uid + ' · ' + keysLabel(e) + ' · 顺序 ' + (e.insertion_order || 0);
    renderNav(st);
  }

  function moveEntry(uid, dir) {
    const st = loadStore();
    const folder = folderByName(st, activeFolder);
    if (!folder) return;
    const list = folder.entries || [];
    const idx = list.findIndex(function (e) {
      return String(e.uid) === String(uid);
    });
    const next = idx + dir;
    if (idx < 0 || next < 0 || next >= list.length) return;
    const tmp = list[idx];
    list[idx] = list[next];
    list[next] = tmp;
    saveStore(st);
    render();
  }

  function importData(data) {
    const incoming = extractRawEntries(data).map(function (e, i) {
      return { rec: normEntry(e, i), folder: folderOf(e) };
    });
    if (!incoming.length) {
      toast('没有可导入的条目');
      return;
    }
    const st = loadStore();
    let added = 0;
    let updated = 0;
    incoming.forEach(function (item) {
      const hit = findEntry(st, item.rec.uid);
      if (hit) {
        Object.assign(hit.entry, item.rec);
        if (hit.folder.name !== item.folder) {
          hit.folder.entries.splice(hit.index, 1);
          const dest = folderByName(st, item.folder);
          if (dest) dest.entries.push(hit.entry);
        }
        updated += 1;
        return;
      }
      const dest = folderByName(st, item.folder);
      if (!dest) return;
      dest.entries.push(item.rec);
      added += 1;
    });
    if (data && data.name) st.name = data.name;
    saveStore(st);
    render();
    toast('已导入 ' + (added + updated) + ' 条');
  }

  function exportStore() {
    const st = loadStore();
    const entries = {};
    st.folders.forEach(function (folder) {
      (folder.entries || []).forEach(function (e) {
        entries[String(e.uid)] = Object.assign({}, e, {
          id: e.uid,
          key: e.keys,
          keysecondary: e.secondary_keys,
          order: e.insertion_order,
          folder: folder.name,
        });
      });
    });
    const payload = {
      name: st.name,
      folders: st.folders,
      entries: entries,
      originalData: { name: st.name, entries: entries },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '影色渐染-世界书.json';
    a.click();
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
    }, 800);
  }

  function bind() {
    if (bound) return;
    bound = true;

    const nav = $('wb-foldernav');
    if (nav) {
      nav.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-folder]');
        if (!btn) return;
        activeFolder = btn.getAttribute('data-folder') || FOLDERS[0];
        render();
      });
    }

    const addBtn = $('btn-wb-add');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        const st = loadStore();
        const folder = folderByName(st, activeFolder);
        if (!folder) return;
        const rec = normEntry(
          {
            uid: nextUid(st),
            comment: '新条目',
            content: '',
            keys: [],
            constant: false,
            enabled: true,
          },
          folder.entries.length,
        );
        folder.entries.push(rec);
        saveStore(st);
        Object.keys(expanded).forEach(function (k) {
          expanded[k] = false;
        });
        expanded[String(rec.uid)] = true;
        render();
      });
    }

    const importBtn = $('btn-wb-import');
    const file = $('cfg-wb-file');
    if (importBtn && file) {
      importBtn.addEventListener('click', function () {
        file.value = '';
        file.click();
      });
      file.addEventListener('change', function () {
        const picked = file.files && file.files[0];
        if (!picked) return;
        const reader = new FileReader();
        reader.onload = function () {
          try {
            importData(JSON.parse(String(reader.result || '{}')));
          } catch (err) {
            toast('世界书文件无法解析');
          }
        };
        reader.readAsText(picked, 'utf-8');
      });
    }

    const exportBtn = $('btn-wb-export');
    if (exportBtn) exportBtn.addEventListener('click', exportStore);

    const scanBox = $('wb-scan-settings');
    if (scanBox) {
      scanBox.addEventListener('change', readScanForm);
      scanBox.addEventListener('input', readScanForm);
    }

    const list = $('wb-entry-list');
    if (list) {
      list.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-act]');
        if (!btn) return;
        const card = btn.closest('.sys-api-card');
        if (!card) return;
        const uid = card.getAttribute('data-uid');
        const act = btn.getAttribute('data-act');
        if (act === 'toggle') {
          if (expanded[uid]) saveCard(card);
          expanded[uid] = !expanded[uid];
          render();
          return;
        }
        if (act === 'up') {
          saveCard(card);
          moveEntry(uid, -1);
          return;
        }
        if (act === 'down') {
          saveCard(card);
          moveEntry(uid, 1);
          return;
        }
        if (act === 'del') {
          const st = loadStore();
          const hit = findEntry(st, uid);
          if (!hit) return;
          hit.folder.entries.splice(hit.index, 1);
          saveStore(st);
          delete expanded[uid];
          render();
        }
      });
      list.addEventListener('change', function (e) {
        const card = e.target.closest('.sys-api-card');
        if (card) saveCard(card);
      });
      list.addEventListener('input', function (e) {
        const card = e.target.closest('.sys-api-card');
        if (!card) return;
        if (e.target.matches('[data-f="comment"], [data-f="keys"], [data-f="secondary_keys"], [data-f="insertion_order"]')) {
          saveCard(card);
        }
      });
    }
  }

  function getAllEntries() {
    const list = [];
    loadStore().folders.forEach(function (folder) {
      (folder.entries || []).forEach(function (e) {
        list.push(Object.assign({ folder: folder.name }, e));
      });
    });
    return list;
  }

  function getEnabledEntries() {
    return getAllEntries()
      .filter(function (e) {
        return e.enabled !== false;
      })
      .sort(function (a, b) {
        return (b.insertion_order || 0) - (a.insertion_order || 0);
      });
  }

  function applyEnabled(updates) {
    if (!updates || !updates.length) return;
    const st = loadStore();
    const map = Object.create(null);
    updates.forEach(function (u) {
      map[String(u.uid)] = !!u.enabled;
    });
    let changed = false;
    st.folders.forEach(function (folder) {
      (folder.entries || []).forEach(function (e) {
        const k = String(e.uid);
        if (k in map && e.enabled !== map[k]) {
          e.enabled = map[k];
          changed = true;
        }
      });
    });
    if (!changed) return;
    saveStore(st);
    const pane = document.querySelector('#pane-system [data-subpane="prompt"]');
    if (pane && pane.classList.contains('active')) render();
  }

  function addUnique(list, seen, name) {
    const t = String(name || '').trim();
    if (!t || seen[t] || t.indexOf('废弃') >= 0) return;
    seen[t] = 1;
    list.push(t);
  }

  function listLocationNames() {
    const names = [];
    const seen = Object.create(null);
    try {
      const el = document.getElementById('meishinkan-map-config');
      const cfg = el ? JSON.parse(el.textContent) : {};
      (cfg.locations || []).forEach(function (l) {
        addUnique(names, seen, l && l.name);
      });
    } catch (e) {}
    getAllEntries().forEach(function (e) {
      if (e.folder !== '主要地点') return;
      const c = String(e.comment || '');
      if (c.indexOf('废弃') >= 0) return;
      if (c.indexOf('地点-') === 0) addUnique(names, seen, c.slice(3));
      (e.keys || []).forEach(function (k) {
        addUnique(names, seen, k);
      });
    });
    return names;
  }

  function listCharacterNames() {
    return ['托莉娜'].concat(NPC_KEYS);
  }

  function listCgGroups() {
    const groups = [];
    const seen = Object.create(null);
    function add(name, desc, uid) {
      const t = String(name || '').trim();
      if (!t || seen[t]) return;
      seen[t] = 1;
      groups.push({ name: t, desc: String(desc || '').trim(), uid: uid });
    }
    getAllEntries().forEach(function (e) {
      if (!isCgEntry(e)) return;
      const content = String(e.content || '');
      const uid = e.uid;
      let m;
      const reTick = /\*\*组名[：:]\*\*\s*`([^`]+)`/g;
      while ((m = reTick.exec(content))) add(m[1], '', uid);
      const reJson = /"组名"\s*:\s*"([^"]+)"/g;
      while ((m = reJson.exec(content))) add(m[1], '', uid);
      const reDesc = /"组名"\s*:\s*"([^"]+)"\s*,\s*"描述"\s*:\s*"([^"]+)"/g;
      while ((m = reDesc.exec(content))) add(m[1], m[2], uid);
      const c = String(e.comment || '').replace(/^资源列表-CG-?/, '').trim();
      if (c && c !== '资源列表-CG') add(c, '', uid);
    });
    return groups;
  }

  function escapeRegExp(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function keyIsRegex(key) {
    if (!key || key.length < 2 || key.charAt(0) !== '/') return false;
    return key.lastIndexOf('/') > 0;
  }

  function regexFromKey(key) {
    const last = key.lastIndexOf('/');
    try {
      return new RegExp(key.slice(1, last), key.slice(last + 1));
    } catch (err) {
      return null;
    }
  }

  function matchOneKey(haystack, key, caseSensitive, wholeWords) {
    if (!key) return false;
    if (keyIsRegex(key)) {
      const re = regexFromKey(key);
      if (!re) return false;
      re.lastIndex = 0;
      return re.test(haystack);
    }
    let h = haystack;
    let k = key;
    if (!caseSensitive) {
      h = h.toLowerCase();
      k = k.toLowerCase();
    }
    if (!wholeWords) return h.indexOf(k) >= 0;
    if (CJK_RE.test(k)) return h.indexOf(k) >= 0;
    const re = new RegExp('\\b' + escapeRegExp(k) + '\\b', caseSensitive ? '' : 'i');
    return re.test(haystack);
  }

  function matchAnyKeys(haystack, keys, caseSensitive, wholeWords) {
    for (let i = 0; i < keys.length; i++) {
      if (matchOneKey(haystack, keys[i], caseSensitive, wholeWords)) return true;
    }
    return false;
  }

  function matchAllKeys(haystack, keys, caseSensitive, wholeWords) {
    if (!keys.length) return true;
    for (let i = 0; i < keys.length; i++) {
      if (!matchOneKey(haystack, keys[i], caseSensitive, wholeWords)) return false;
    }
    return true;
  }

  function countMatchedKeys(haystack, keys, caseSensitive, wholeWords) {
    let n = 0;
    for (let i = 0; i < keys.length; i++) {
      if (matchOneKey(haystack, keys[i], caseSensitive, wholeWords)) n += 1;
    }
    return n;
  }

  function entryCase(e, g) {
    if (e.case_sensitive == null) return !!g.caseSensitive;
    return !!e.case_sensitive;
  }

  function entryWhole(e, g) {
    if (e.match_whole_words == null) return !!g.matchWholeWords;
    return !!e.match_whole_words;
  }

  function entryScanDepth(e, fallback) {
    if (e.scan_depth == null || e.scan_depth === '') return fallback;
    const n = Number(e.scan_depth);
    return Number.isFinite(n) ? Math.max(0, n) : fallback;
  }

  function secondaryOk(e, haystack, g) {
    if (!e.selective) return true;
    const sec = e.secondary_keys || [];
    if (!sec.length) return true;
    const cs = entryCase(e, g);
    const ww = entryWhole(e, g);
    const logic = Number(e.selectiveLogic);
    if (logic === LOGIC.AND_ALL) return matchAllKeys(haystack, sec, cs, ww);
    if (logic === LOGIC.NOT_ANY) return !matchAnyKeys(haystack, sec, cs, ww);
    if (logic === LOGIC.NOT_ALL) return !matchAllKeys(haystack, sec, cs, ww);
    return matchAnyKeys(haystack, sec, cs, ww);
  }

  function keywordActivates(e, haystack, g) {
    const keys = e.keys || [];
    if (!keys.length) return false;
    const cs = entryCase(e, g);
    const ww = entryWhole(e, g);
    if (!matchAnyKeys(haystack, keys, cs, ww)) return false;
    return secondaryOk(e, haystack, g);
  }

  function extrasHaystack(e, extras) {
    extras = extras || {};
    let t = '';
    if (e.match_persona_description && extras.persona) t += '\n' + extras.persona;
    if (e.match_character_description && extras.character) t += '\n' + extras.character;
    if (e.match_character_personality && extras.personality) t += '\n' + extras.personality;
    if (e.match_character_depth_prompt && extras.depthPrompt) t += '\n' + extras.depthPrompt;
    if (e.match_scenario && extras.scenario) t += '\n' + extras.scenario;
    if (e.match_creator_notes && extras.creatorNotes) t += '\n' + extras.creatorNotes;
    return t;
  }

  function triggerOk(e, trigger) {
    const list = e.triggers;
    if (!list || !list.length) return true;
    return list.indexOf(trigger || 'normal') >= 0;
  }

  function joinScanBuffer(messages, depth, includeNames) {
    if (!depth || depth <= 0 || !messages || !messages.length) return '';
    return messages.slice(-depth)
      .map(function (m) {
        const text = String((m && m.text) || '');
        if (includeNames && m && m.name) return m.name + ': ' + text;
        return text;
      })
      .join('\n');
  }

  function applyGroups(activated, g) {
    const groups = Object.create(null);
    const ungrouped = [];
    activated.forEach(function (a) {
      const name = String(a.entry.group || '').trim();
      if (!name) {
        ungrouped.push(a);
        return;
      }
      if (!groups[name]) groups[name] = [];
      groups[name].push(a);
    });
    const out = ungrouped.slice();
    Object.keys(groups).forEach(function (name) {
      let list = groups[name];
      const overrides = list.filter(function (a) {
        return a.entry.group_override;
      });
      if (overrides.length) list = overrides;
      if (list.length === 1) {
        out.push(list[0]);
        return;
      }
      const useScore =
        g.useGroupScoring ||
        list.some(function (a) {
          return a.entry.use_group_scoring;
        });
      if (useScore) {
        list.sort(function (a, b) {
          const ds = (b.score || 0) - (a.score || 0);
          if (ds) return ds;
          return (b.entry.insertion_order || 0) - (a.entry.insertion_order || 0);
        });
        out.push(list[0]);
        return;
      }
      let total = 0;
      list.forEach(function (a) {
        total += Math.max(1, Number(a.entry.group_weight) || 100);
      });
      let r = Math.random() * total;
      for (let i = 0; i < list.length; i++) {
        r -= Math.max(1, Number(list[i].entry.group_weight) || 100);
        if (r <= 0) {
          out.push(list[i]);
          return;
        }
      }
      out.push(list[list.length - 1]);
    });
    return out;
  }

  function applyBudget(activated, budget) {
    if (!budget || budget <= 0) return activated;
    const ignore = [];
    const rest = [];
    activated.forEach(function (a) {
      if (a.entry.ignore_budget) ignore.push(a);
      else rest.push(a);
    });
    rest.sort(function (a, b) {
      return (b.entry.insertion_order || 0) - (a.entry.insertion_order || 0);
    });
    const kept = ignore.slice();
    let used = ignore.reduce(function (n, a) {
      return n + String(a.entry.content || '').length;
    }, 0);
    rest.forEach(function (a) {
      const len = String(a.entry.content || '').length;
      if (kept.length && used + len > budget) return;
      kept.push(a);
      used += len;
    });
    return kept;
  }

  function sortActivated(list) {
    return list.slice().sort(function (a, b) {
      const ao = Number(a.entry.insertion_order) || 0;
      const bo = Number(b.entry.insertion_order) || 0;
      if (bo !== ao) return bo - ao;
      const ap = Number(a.entry.position) || 0;
      const bp = Number(b.entry.position) || 0;
      if (ap !== bp) return ap - bp;
      return String(a.entry.uid).localeCompare(String(b.entry.uid), undefined, { numeric: true });
    });
  }

  function scanAndActivate(ctx) {
    ctx = ctx || {};
    const g = loadScan();
    const messages = Array.isArray(ctx.messages) ? ctx.messages.slice() : [];
    const userInput = String(ctx.userInput || '');
    if (userInput) messages.push({ name: ctx.userName || '{{user}}', text: userInput });
    const timed = ctx.skipTick ? loadTimed() : tickTimed();
    const chatLength = ctx.chatLength != null ? ctx.chatLength : messages.length;
    const trigger = ctx.trigger || 'normal';
    const extras = ctx.extras || {};
    const entries = getAllEntries().filter(function (e) {
      return e.enabled !== false;
    });

    const activated = [];
    const seen = Object.create(null);

    function tryAdd(e, from, score) {
      const id = String(e.uid);
      if (seen[id]) return false;
      if (timed.cooldown[id]) return false;
      if (!triggerOk(e, trigger)) return false;
      if (e.delay && chatLength < e.delay) return false;
      if (e.useProbability !== false && Number(e.probability) < 100) {
        if (Math.random() * 100 >= Number(e.probability)) return false;
      }
      seen[id] = 1;
      activated.push({ entry: e, from: from, score: score || 0 });
      if (e.sticky > 0) timed.sticky[id] = e.sticky;
      if (e.cooldown > 0) timed.cooldown[id] = e.cooldown + (e.sticky || 0);
      saveTimed(timed);
      return true;
    }

    entries.forEach(function (e) {
      if (e.constant) tryAdd(e, 'constant', 0);
      else if (timed.sticky[String(e.uid)]) tryAdd(e, 'sticky', 0);
    });

    function scoreOf(e, hay) {
      return countMatchedKeys(hay, e.keys || [], entryCase(e, g), entryWhole(e, g));
    }

    function scanChat(depthNow) {
      entries.forEach(function (e) {
        if (seen[String(e.uid)]) return;
        if (e.constant) return;
        if (e.vectorized) return;
        if (delayUntilStep(e) > 0) return;
        const depth = entryScanDepth(e, depthNow);
        const hay = joinScanBuffer(messages, depth, g.includeNames) + extrasHaystack(e, extras);
        if (!keywordActivates(e, hay, g)) return;
        tryAdd(e, 'key', scoreOf(e, hay));
      });
    }

    let depthNow = g.scanDepth;
    const depthCap = Math.max(
      g.scanDepth,
      g.minActivations > 0 ? g.minActivationsDepthMax || messages.length : g.scanDepth,
    );
    scanChat(depthNow);
    while (g.minActivations > 0 && activated.length < g.minActivations && depthNow < depthCap && depthNow < messages.length) {
      depthNow += 1;
      scanChat(depthNow);
    }

    if (g.recursive) {
      let recHay = '';
      activated.forEach(function (a) {
        if (!a.entry.prevent_recursion) recHay += '\n' + String(a.entry.content || '');
      });
      const maxSteps = g.maxRecursionSteps > 0 ? g.maxRecursionSteps : MAX_RECURSION_CAP;
      let step = 1;
      let grew = true;
      while (grew && step <= maxSteps) {
        grew = false;
        const thisHay = recHay;
        entries.forEach(function (e) {
          if (seen[String(e.uid)]) return;
          if (e.constant) return;
          if (e.vectorized) return;
          if (e.exclude_recursion) return;
          const need = delayUntilStep(e);
          if (need > step) return;
          const hay = thisHay + extrasHaystack(e, extras);
          if (!keywordActivates(e, hay, g)) return;
          if (tryAdd(e, 'recursion', scoreOf(e, hay))) {
            grew = true;
            if (!e.prevent_recursion) recHay += '\n' + String(e.content || '');
          }
        });
        step += 1;
      }
    }

    const grouped = applyGroups(activated, g);
    const budgeted = applyBudget(grouped, g.budget);
    const sorted = sortActivated(budgeted);
    return {
      entries: sorted.map(function (a) {
        return a.entry;
      }),
      details: sorted,
      scan: g,
    };
  }

  function collectActivatedEntries(ctx) {
    return scanAndActivate(ctx).entries;
  }

  function formatActivatedText(entries) {
    if (!entries || !entries.length) return '';
    return (
      '## 世界书\n' +
      entries
        .map(function (e) {
          return '### ' + (e.comment || '条目') + '\n' + String(e.content || '').trim();
        })
        .join('\n\n') +
      '\n\n'
    );
  }

  function init() {
    bind();
    fillScanForm();
    render();
  }

  global.妹神官_settings_worldbook = {
    init: init,
    render: render,
    loadStore: loadStore,
    saveStore: saveStore,
    loadScan: loadScan,
    saveScan: saveScan,
    getAllEntries: getAllEntries,
    getEnabledEntries: getEnabledEntries,
    applyEnabled: applyEnabled,
    listLocationNames: listLocationNames,
    listCharacterNames: listCharacterNames,
    listCgGroups: listCgGroups,
    scanAndActivate: scanAndActivate,
    collectActivatedEntries: collectActivatedEntries,
    formatActivatedText: formatActivatedText,
  };
})(window);

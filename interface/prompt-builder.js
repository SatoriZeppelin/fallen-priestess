/**
 * SillyTavern Chat Completion 顺序组装
 * 对外：window.妹神官_prompt_builder
 */
(function (global) {
  const WI_BEFORE = 0;
  const WI_AFTER = 1;
  const WI_AN_TOP = 2;
  const WI_AN_BOTTOM = 3;
  const WI_AT_DEPTH = 4;
  const WI_EM_TOP = 5;
  const WI_EM_BOTTOM = 6;
  const WI_OUTLET = 7;

  const MARKERS = {
    main: 1,
    worldInfoBefore: 1,
    personaDescription: 1,
    charDescription: 1,
    charPersonality: 1,
    scenario: 1,
    enhanceDefinitions: 1,
    nsfw: 1,
    worldInfoAfter: 1,
    dialogueExamples: 1,
    chatHistory: 1,
    jailbreak: 1,
    authorsNote: 1,
  };

  const DEFAULT_ORDER = [
    'main',
    'worldInfoBefore',
    'personaDescription',
    'charDescription',
    'charPersonality',
    'scenario',
    'enhanceDefinitions',
    'nsfw',
    'worldInfoAfter',
    'dialogueExamples',
    'chatHistory',
    'jailbreak',
  ];

  function isMarkerId(id) {
    return !!MARKERS[String(id || '')];
  }

  function normalizeRole(role) {
    if (role === 1 || role === '1' || role === 'user') return 'user';
    if (role === 2 || role === '2' || role === 'assistant') return 'assistant';
    if (role === 'assistant' || role === 'user' || role === 'system') return role;
    return 'system';
  }

  function wiRole(role) {
    return normalizeRole(role == null ? 0 : role);
  }

  function roleRank(role) {
    const r = wiRole(role);
    if (r === 'user') return 0;
    if (r === 'assistant') return 1;
    return 2;
  }

  function sortByOrder(a, b) {
    const ao = Number(a && a.insertion_order != null ? a.insertion_order : a && a.order) || 0;
    const bo = Number(b && b.insertion_order != null ? b.insertion_order : b && b.order) || 0;
    if (ao !== bo) return ao - bo;
    return String((a && a.uid) || '').localeCompare(String((b && b.uid) || ''), undefined, { numeric: true });
  }

  function formatEntry(e) {
    if (!e) return '';
    const title = String(e.comment || '').trim();
    const body = String(e.content || '').trim();
    if (!body) return '';
    return title ? '### ' + title + '\n' + body : body;
  }

  function pushJoined(messages, entries, role) {
    if (!entries || !entries.length) return;
    const text = entries
      .slice()
      .sort(sortByOrder)
      .map(formatEntry)
      .filter(Boolean)
      .join('\n\n');
    if (!text) return;
    messages.push({ role: role || 'system', content: text });
  }

  function emptyBuckets() {
    return {
      before: [],
      after: [],
      anTop: [],
      anBottom: [],
      atDepth: [],
      emTop: [],
      emBottom: [],
      outlets: Object.create(null),
    };
  }

  function bucketEntries(entries) {
    const buckets = emptyBuckets();
    (entries || []).forEach(function (e) {
      if (!e) return;
      const pos = Number(e.position);
      if (pos === WI_AFTER) buckets.after.push(e);
      else if (pos === WI_AN_TOP) buckets.anTop.push(e);
      else if (pos === WI_AN_BOTTOM) buckets.anBottom.push(e);
      else if (pos === WI_AT_DEPTH) buckets.atDepth.push(e);
      else if (pos === WI_EM_TOP) buckets.emTop.push(e);
      else if (pos === WI_EM_BOTTOM) buckets.emBottom.push(e);
      else if (pos === WI_OUTLET) {
        const name = String(e.outlet_name || '').trim();
        if (!name) return;
        if (!buckets.outlets[name]) buckets.outlets[name] = [];
        buckets.outlets[name].push(e);
      } else buckets.before.push(e);
    });
    return buckets;
  }

  function substituteOutlets(text, outlets) {
    let out = String(text || '');
    if (!out) return out;
    out = out.replace(/\{\{outlet::([^}]+)\}\}/gi, function (_, raw) {
      const name = String(raw || '').trim();
      const list = outlets && outlets[name];
      if (!list || !list.length) return '';
      return list
        .slice()
        .sort(sortByOrder)
        .map(formatEntry)
        .filter(Boolean)
        .join('\n\n');
    });
    return out.replace(/\{\{char\}\}/gi, '托莉娜');
  }

  function applyMacros(text, outlets) {
    return substituteOutlets(text, outlets);
  }

  function isAbsolutePrompt(item) {
    if (!item) return false;
    if (item.absolute === true) return true;
    if (item.injection_position != null && item.injection_position !== '') {
      return Number(item.injection_position) === 1;
    }
    return false;
  }

  function defaultOrderItems(mainContent) {
    return DEFAULT_ORDER.map(function (id) {
      return {
        identifier: id,
        name: id,
        role: 'system',
        content: id === 'main' ? String(mainContent || '') : '',
        enabled: id !== 'enhanceDefinitions',
        marker: id !== 'main' && id !== 'nsfw' && id !== 'jailbreak' && id !== 'enhanceDefinitions',
        injection_position: 0,
        depth: 0,
        injection_order: 100,
      };
    });
  }

  function isResourceListEntry(e) {
    return /^资源列表/.test(String((e && e.comment) || ''));
  }

  function splitResourceList(entries) {
    const rest = [];
    const resources = [];
    (entries || []).forEach(function (e) {
      if (isResourceListEntry(e)) resources.push(e);
      else rest.push(e);
    });
    return { rest: rest, resources: resources };
  }

  function appendResourcesToJailbreak(items, resources) {
    const extra = (resources || [])
      .slice()
      .sort(sortByOrder)
      .map(formatEntry)
      .filter(Boolean)
      .join('\n\n');
    if (!extra) return items;
    let hit = false;
    items.forEach(function (item) {
      const id = item && (item.identifier || item.id);
      if (id !== 'jailbreak') return;
      const cur = String(item.content || '').trim();
      item.content = cur ? cur + '\n\n' + extra : extra;
      item.enabled = true;
      item.marker = false;
      hit = true;
    });
    if (!hit) {
      items.push({
        identifier: 'jailbreak',
        name: 'Post-History Instructions',
        role: 'system',
        content: extra,
        enabled: true,
        marker: false,
        injection_position: 0,
        depth: 0,
        injection_order: 100,
      });
    }
    return items;
  }

  function hydrateJailbreak(items, storyPrompt) {
    const text = String(storyPrompt || '').trim();
    if (!text) return items;
    let hit = false;
    items.forEach(function (item) {
      const id = item && (item.identifier || item.id);
      if (id === 'jailbreak') {
        item.content = text;
        item.enabled = true;
        item.marker = false;
        hit = true;
      }
    });
    if (!hit) {
      items.push({
        identifier: 'jailbreak',
        name: 'Post-History Instructions',
        role: 'system',
        content: text,
        enabled: true,
        marker: false,
        injection_position: 0,
        depth: 0,
        injection_order: 100,
      });
    }
    return items;
  }

  function resolveOrder(preset, storyPrompt) {
    const prompts = preset && Array.isArray(preset.prompts) ? preset.prompts.slice() : [];
    const enabled = prompts.filter(function (p) {
      return p && p.enabled !== false;
    });
    if (!enabled.length) return hydrateJailbreak(defaultOrderItems(''), storyPrompt);
    return hydrateJailbreak(enabled, storyPrompt);
  }

  function injectDepthEntries(chatMsgs, depthItems) {
    if (!depthItems || !depthItems.length) return;
    const groups = Object.create(null);
    depthItems.forEach(function (e) {
      let d = Number(e.depth);
      if (!Number.isFinite(d) || d < 0) d = 4;
      if (!groups[d]) groups[d] = [];
      groups[d].push(e);
    });
    Object.keys(groups)
      .map(Number)
      .sort(function (a, b) {
        return b - a;
      })
      .forEach(function (depth) {
        const items = groups[depth].slice().sort(function (a, b) {
          const rr = roleRank(a.role) - roleRank(b.role);
          if (rr) return rr;
          return sortByOrder(a, b);
        });
        let idx = Math.max(0, chatMsgs.length - depth);
        items.forEach(function (e) {
          const content = e._isPrompt ? String(e.content || '').trim() : formatEntry(e);
          if (!content) return;
          const role = e._isPrompt ? normalizeRole(e.role) : wiRole(e.role);
          chatMsgs.splice(idx, 0, { role: role, content: content });
          idx += 1;
        });
      });
  }

  function appendChatHistory(messages, history, userText, wi, absolutePrompts, extras) {
    const chatMsgs = [];
    (history || []).forEach(function (m) {
      if (!m) return;
      if (m.role !== 'user' && m.role !== 'assistant') return;
      const c = String(m.content || '').trim();
      if (!c) return;
      chatMsgs.push({ role: m.role, content: c });
    });

    pushJoined(chatMsgs, wi.anTop);

    const last = chatMsgs[chatMsgs.length - 1];
    const incoming = String(userText || '').trim();
    if (incoming) {
      if (last && last.role === 'user' && (incoming === last.content || incoming.indexOf(last.content) === 0)) {
        last.content = incoming;
      } else if (!(last && last.role === 'user' && last.content === incoming)) {
        chatMsgs.push({ role: 'user', content: incoming });
      }
    } else if (!chatMsgs.length) {
      chatMsgs.push({ role: 'user', content: '请继续对话' });
    }

    const depthItems = (wi.atDepth || []).slice();
    (absolutePrompts || []).forEach(function (p) {
      depthItems.push({
        content: applyMacros(p.content, wi.outlets),
        role: p.role,
        depth: p.depth != null ? p.depth : 0,
        insertion_order: p.injection_order != null ? p.injection_order : 100,
        _isPrompt: true,
      });
    });
    if (extras && extras.targetChars > 0) {
      depthItems.push({
        content: '正文目标字数：' + extras.targetChars,
        role: 'system',
        depth: 0,
        insertion_order: 10000,
        _isPrompt: true,
      });
    }

    injectDepthEntries(chatMsgs, depthItems);

    if (wi.anBottom && wi.anBottom.length) {
      const insertAt = Math.max(0, chatMsgs.length - 1);
      wi.anBottom
        .slice()
        .sort(sortByOrder)
        .forEach(function (e, i) {
          const text = formatEntry(e);
          if (!text) return;
          chatMsgs.splice(insertAt + i, 0, { role: wiRole(e.role), content: text });
        });
    }

    chatMsgs.forEach(function (m) {
      messages.push(m);
    });
  }

  function serializeMessages(messages) {
    return (messages || [])
      .map(function (m) {
        const role = m.role === 'user' ? 'user' : m.role === 'assistant' ? 'assistant' : 'system';
        return '[' + role + ']\n' + String(m.content || '').trim();
      })
      .filter(function (s) {
        return s.length > 8;
      })
      .join('\n\n');
  }

  function scanWorldbook(ctx) {
    const wb = global.妹神官_settings_worldbook;
    if (!wb || typeof wb.scanAndActivate !== 'function') return [];
    const result = wb.scanAndActivate(ctx || {});
    return (result && result.entries) || [];
  }

  function build(opts) {
    opts = opts || {};
    const storyPrompt = String(opts.storyPrompt || '').trim();
    const userText = String(opts.userInput || '').trim();
    const history = Array.isArray(opts.history) ? opts.history : [];
    const presetApi = global.妹神官_settings_preset;
    const preset = opts.preset || (presetApi && typeof presetApi.getPreset === 'function' ? presetApi.getPreset(opts.route || 'story') : null);
    const order = resolveOrder(preset, storyPrompt);

    const scanned = scanWorldbook({
      userInput: userText,
      userName: opts.userName || '{{user}}',
      messages: Array.isArray(opts.scanMessages) ? opts.scanMessages : [],
      extras: opts.extras || {},
      trigger: opts.trigger || 'normal',
      skipTick: !!opts.skipTick,
    });
    const split = splitResourceList(scanned);
    const entries = split.rest;
    appendResourcesToJailbreak(order, split.resources);
    const wi = bucketEntries(entries);

    const relative = [];
    const absolute = [];
    order.forEach(function (item) {
      if (!item || item.enabled === false) return;
      if (isAbsolutePrompt(item) && !isMarkerId(item.identifier || item.id)) {
        absolute.push(item);
        return;
      }
      relative.push(item);
    });

    const messages = [];
    const flags = { chatInserted: false, wiBefore: false, wiAfter: false };
    const diag = { order: [], worldbook: scanned.map(function (e) { return e.comment || e.uid; }) };

    relative.forEach(function (item) {
      const id = String(item.identifier || item.id || '');
      diag.order.push(id || item.name || '?');

      if (id === 'worldInfoBefore') {
        pushJoined(messages, wi.before);
        flags.wiBefore = true;
        return;
      }
      if (id === 'worldInfoAfter') {
        pushJoined(messages, wi.after);
        flags.wiAfter = true;
        return;
      }
      if (id === 'dialogueExamples') {
        pushJoined(messages, wi.emTop);
        pushJoined(messages, wi.emBottom);
        return;
      }
      if (id === 'chatHistory') {
        appendChatHistory(messages, history, userText, wi, absolute, {
          targetChars: Number(opts.targetChars) || 0,
        });
        flags.chatInserted = true;
        return;
      }
      if (id === 'authorsNote') {
        pushJoined(messages, wi.anTop);
        pushJoined(messages, wi.anBottom);
        return;
      }
      if (id === 'personaDescription' || id === 'charDescription' || id === 'charPersonality' || id === 'scenario') {
        const markerText = applyMacros(item.content, wi.outlets).trim();
        if (markerText) messages.push({ role: normalizeRole(item.role), content: markerText });
        return;
      }

      const content = applyMacros(item.content, wi.outlets).trim();
      if (!content) return;
      messages.push({ role: normalizeRole(item.role), content: content });
    });

    if (!flags.wiBefore) pushJoined(messages, wi.before);
    if (!flags.wiAfter) pushJoined(messages, wi.after);
    if (!flags.chatInserted) {
      appendChatHistory(messages, history, userText, wi, absolute, {
        targetChars: Number(opts.targetChars) || 0,
      });
    }

    const text = serializeMessages(messages);
    return {
      messages: messages,
      text: text,
      worldbook: entries,
      buckets: wi,
      diag: diag,
      preset: preset ? preset.name : '',
    };
  }

  global.妹神官_prompt_builder = {
    build: build,
    serializeMessages: serializeMessages,
    DEFAULT_ORDER: DEFAULT_ORDER,
  };
})(window);

/**
 * 直连 LLM：OpenAI / Claude / Gemini
 * 对外：window.妹神官_llm
 */
(function (global) {
  function normalizeBase(url) {
    return String(url || '')
      .trim()
      .replace(/\/+$/, '');
  }

  function collapseTrailingV1(url) {
    return normalizeBase(url).replace(/(\/v1)+$/i, '/v1');
  }

  function sanitizeEndpointUrl(url) {
    let u = normalizeBase(url);
    if (!u) return '';
    let q = '';
    const qi = u.indexOf('?');
    if (qi >= 0) {
      q = u.slice(qi);
      u = u.slice(0, qi);
    }
    u = u.replace(/(\/v1)+(\/chat\/completions)$/i, '/v1$2');
    u = u.replace(/(\/v1)+(\/messages)$/i, '/v1$2');
    u = u.replace(/(\/v1)+(\/models)$/i, '/v1$2');
    u = collapseTrailingV1(u);
    return u + q;
  }

  function resolveApiRoot(input) {
    let b = sanitizeEndpointUrl(input);
    if (!b) return '';
    b = b.replace(/\?.*$/, '');
    if (/\/v1\/chat\/completions$/i.test(b)) return b.replace(/\/chat\/completions$/i, '');
    if (/\/chat\/completions$/i.test(b)) return b.replace(/\/chat\/completions$/i, '');
    if (/\/v1\/messages$/i.test(b)) return b.replace(/\/messages$/i, '');
    if (/\/messages$/i.test(b)) return b.replace(/\/messages$/i, '');
    if (/\/v1beta\/models\/[^/:]+(?::[\w]+)?$/i.test(b)) {
      return b.replace(/\/v1beta\/models\/[^/:]+(?::[\w]+)?$/i, '');
    }
    if (/\/models\/[^/:]+(?::(?:generateContent|streamGenerateContent))$/i.test(b)) {
      return b.replace(/\/models\/[^/:]+(?::(?:generateContent|streamGenerateContent))$/i, '');
    }
    if (/\/v1beta\/models$/i.test(b)) return b.replace(/\/v1beta\/models$/i, '');
    if (/\/v1\/models$/i.test(b)) return b.replace(/\/models$/i, '');
    if (/\/models$/i.test(b)) return b.replace(/\/models$/i, '');
    return b;
  }

  function rootEndsWithV1(root) {
    return /\/v1$/i.test(root || '');
  }

  function protocolOf(cfg) {
    const p = String((cfg && cfg.protocol) || '')
      .trim()
      .toLowerCase();
    if (p === 'claude' || p === 'anthropic') return 'claude';
    if (p === 'gemini' || p === 'google') return 'gemini';
    return 'openai';
  }

  function defaultRoot(protocol) {
    if (protocol === 'claude') return 'https://api.anthropic.com';
    if (protocol === 'gemini') return 'https://generativelanguage.googleapis.com';
    return 'https://api.openai.com/v1';
  }

  function pushUnique(arr, item) {
    item = normalizeBase(item);
    if (item && arr.indexOf(item) < 0) arr.push(item);
  }

  function modelsUrlCandidates(cfg) {
    const urls = [];
    const protocol = protocolOf(cfg);
    const root = resolveApiRoot(cfg.baseUrl) || defaultRoot(protocol);
    if (!root) return urls;
    if (protocol === 'claude') {
      if (/\/models$/i.test(root)) {
        pushUnique(urls, root);
        return urls;
      }
      if (rootEndsWithV1(root)) pushUnique(urls, root + '/models');
      else {
        pushUnique(urls, root + '/v1/models');
        pushUnique(urls, root + '/models');
      }
      return urls;
    }
    if (protocol === 'gemini') {
      if (/\/models$/i.test(root)) pushUnique(urls, root);
      else {
        pushUnique(urls, root + '/v1beta/models');
        pushUnique(urls, root + '/models');
      }
      return urls;
    }
    if (/\/models$/i.test(root)) {
      pushUnique(urls, root);
      return urls;
    }
    if (rootEndsWithV1(root)) pushUnique(urls, root + '/models');
    else {
      pushUnique(urls, root + '/v1/models');
      pushUnique(urls, root + '/models');
    }
    return urls;
  }

  function geminiModelId(model) {
    return String(model || '')
      .trim()
      .replace(/^models\//i, '');
  }

  function chatUrlCandidates(cfg) {
    const urls = [];
    const protocol = protocolOf(cfg);
    const root = resolveApiRoot(cfg.baseUrl) || defaultRoot(protocol);
    const model = String((cfg && cfg.model) || '').trim();
    if (protocol === 'gemini') {
      const mid = encodeURIComponent(geminiModelId(model) || 'gemini-2.0-flash');
      if (!root) return urls;
      pushUnique(urls, root + '/v1beta/models/' + mid + ':generateContent');
      pushUnique(urls, root + '/models/' + mid + ':generateContent');
      return urls;
    }
    if (protocol === 'claude') {
      if (!root) return urls;
      if (/\/messages$/i.test(root)) {
        pushUnique(urls, root);
        return urls;
      }
      if (rootEndsWithV1(root)) pushUnique(urls, root + '/messages');
      else {
        pushUnique(urls, root + '/v1/messages');
        pushUnique(urls, root + '/messages');
      }
      return urls;
    }
    if (!root) return urls;
    if (/\/chat\/completions$/i.test(root)) {
      pushUnique(urls, root);
      return urls;
    }
    if (rootEndsWithV1(root)) pushUnique(urls, root + '/chat/completions');
    else {
      pushUnique(urls, root + '/v1/chat/completions');
      pushUnique(urls, root + '/chat/completions');
    }
    return urls;
  }

  function authHeaders(cfg, opts) {
    const headers = {};
    if (!opts || opts.json !== false) headers['Content-Type'] = 'application/json';
    const key = String((cfg && cfg.apiKey) || '').trim();
    if (!key) return headers;
    const protocol = protocolOf(cfg);
    if (protocol === 'claude') {
      headers['x-api-key'] = key;
      headers['anthropic-version'] = '2023-06-01';
      headers['anthropic-dangerous-direct-browser-access'] = 'true';
    } else if (protocol === 'gemini') {
      headers['x-goog-api-key'] = key;
    } else {
      headers.Authorization = 'Bearer ' + key;
    }
    return headers;
  }

  function withGeminiKeyQuery(url, cfg) {
    if (protocolOf(cfg) !== 'gemini') return url;
    const key = String((cfg && cfg.apiKey) || '').trim();
    if (!key) return url;
    if (/[?&]key=/i.test(url)) return url;
    return url + (url.indexOf('?') >= 0 ? '&' : '?') + 'key=' + encodeURIComponent(key);
  }

  function parseErrBody(text) {
    try {
      const j = JSON.parse(text || '{}');
      if (!j) return '';
      if (typeof j.error === 'string') return j.error;
      if (j.error && j.error.message) return String(j.error.message);
      if (j.message) return String(j.message);
    } catch (e) {}
    return String(text || '').replace(/\s+/g, ' ').trim().slice(0, 180);
  }

  function makeApiError(status, text, statusText) {
    const err = new Error(parseErrBody(text) || statusText || ('HTTP ' + status));
    err.status = status;
    return err;
  }

  function parseModelIds(data) {
    let list = [];
    if (data && Array.isArray(data.models)) list = data.models;
    else if (data && Array.isArray(data.data)) list = data.data;
    else if (Array.isArray(data)) list = data;
    const ids = list
      .map((m) => String((m && (m.id || m.name || m.model)) || '').replace(/^models\//i, ''))
      .filter(Boolean);
    ids.sort((a, b) => String(a).localeCompare(String(b)));
    return ids;
  }

  function extractAssistantText(data) {
    if (!data || typeof data !== 'object') return '';
    if (data.choices && data.choices[0]) {
      const ch = data.choices[0];
      if (ch.message && ch.message.content != null) return String(ch.message.content);
      if (ch.text != null) return String(ch.text);
    }
    if (Array.isArray(data.content)) {
      return data.content
        .map((block) => {
          if (!block) return '';
          if (typeof block === 'string') return block;
          if (block.text != null) return String(block.text);
          return '';
        })
        .join('');
    }
    if (data.candidates && data.candidates[0]) {
      const parts = (((data.candidates[0] || {}).content || {}).parts) || [];
      return parts.map((p) => (p && p.text != null ? String(p.text) : '')).join('');
    }
    return '';
  }

  async function fetchText(url, init) {
    const res = await fetch(url, init);
    const text = await res.text().catch(() => '');
    return { res: res, text: text };
  }

  async function tryUrls(urls, runOne) {
    const errors = [];
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      try {
        const out = await runOne(url);
        if (out) return out;
      } catch (e) {
        errors.push(String((e && e.message) || e).slice(0, 140));
        const status = e && e.status;
        if (status === 401 || status === 402 || status === 403 || status === 429) break;
      }
    }
    throw new Error(errors[0] || '连接失败');
  }

  function assertCfg(cfg) {
    const protocol = protocolOf(cfg);
    const key = String((cfg && cfg.apiKey) || '').trim();
    const baseUrl = String((cfg && cfg.baseUrl) || '').trim() || defaultRoot(protocol);
    if (!baseUrl) throw new Error('请填写接口地址');
    if (!key) throw new Error('请填写密钥');
    return Object.assign({}, cfg, { protocol: protocol, baseUrl: baseUrl, apiKey: key });
  }

  async function listModels(cfg) {
    const trial = assertCfg(cfg);
    const urls = modelsUrlCandidates(trial);
    if (!urls.length) throw new Error('请填写接口地址');
    return tryUrls(urls, async (url) => {
      const got = await fetchText(withGeminiKeyQuery(url, trial), {
        method: 'GET',
        headers: authHeaders(trial, { json: false }),
      });
      if (!got.res.ok) throw makeApiError(got.res.status, got.text, got.res.statusText);
      let data;
      try {
        data = JSON.parse(got.text || '{}');
      } catch (e) {
        throw new Error('返回非 JSON');
      }
      const ids = parseModelIds(data);
      if (!ids.length) throw new Error('模型列表为空');
      return ids;
    });
  }

  function splitClaude(messages) {
    const system = [];
    const rest = [];
    (messages || []).forEach((m) => {
      const content = m && m.content != null ? String(m.content) : '';
      if (!content) return;
      if (m.role === 'system') system.push(content);
      else rest.push({ role: m.role === 'assistant' ? 'assistant' : 'user', content: content });
    });
    return { system: system.join('\n\n'), messages: rest };
  }

  function splitGemini(messages) {
    const system = [];
    const contents = [];
    (messages || []).forEach((m) => {
      const content = m && m.content != null ? String(m.content) : '';
      if (!content) return;
      if (m.role === 'system') system.push(content);
      else {
        contents.push({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: content }],
        });
      }
    });
    return {
      systemInstruction: system.length ? { parts: [{ text: system.join('\n\n') }] } : null,
      contents: contents,
    };
  }

  function numOrNull(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  function buildChatPayload(trial, opts) {
    opts = opts || {};
    const protocol = protocolOf(trial);
    const model = String((trial && trial.model) || '').trim();
    const messages = opts.messages || [];
    const maxTokens = Math.max(16, Math.round(numOrNull(opts.maxTokens) || 2048));
    const stream = !!opts.stream && protocol !== 'gemini';
    const temperature = numOrNull(opts.temperature);
    const topP = numOrNull(opts.topP);
    const topK = numOrNull(opts.topK);
    if (protocol === 'claude') {
      const cl = splitClaude(messages);
      const body = { model: model, max_tokens: maxTokens, messages: cl.messages };
      if (cl.system) body.system = cl.system;
      if (stream) body.stream = true;
      if (temperature != null) body.temperature = temperature;
      if (topP != null) body.top_p = topP;
      if (topK != null && topK > 0) body.top_k = Math.round(topK);
      return { body: body, stream: stream };
    }
    if (protocol === 'gemini') {
      const ge = splitGemini(messages);
      const body = {
        contents: ge.contents,
        generationConfig: { maxOutputTokens: maxTokens },
      };
      if (ge.systemInstruction) body.systemInstruction = ge.systemInstruction;
      if (temperature != null) body.generationConfig.temperature = temperature;
      if (topP != null) body.generationConfig.topP = topP;
      if (topK != null && topK > 0) body.generationConfig.topK = Math.round(topK);
      return { body: body, stream: false };
    }
    const body = { model: model, messages: messages, max_tokens: maxTokens, stream: stream };
    if (temperature != null) body.temperature = temperature;
    if (topP != null) body.top_p = topP;
    if (topK != null && topK > 0) body.top_k = Math.round(topK);
    return { body: body, stream: stream };
  }

  function extractStreamDelta(data, protocol) {
    if (!data || typeof data !== 'object') return '';
    if (protocol === 'claude') {
      if (data.type === 'content_block_delta' && data.delta && data.delta.text) {
        return String(data.delta.text);
      }
      if (data.type === 'content_block_start' && data.content_block && data.content_block.text) {
        return String(data.content_block.text);
      }
      return '';
    }
    const delta = data.choices && data.choices[0] && data.choices[0].delta;
    if (delta && delta.content != null) return String(delta.content);
    if (data.choices && data.choices[0] && data.choices[0].text) {
      return String(data.choices[0].text);
    }
    return '';
  }

  async function readChatStream(res, onDelta, protocol) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buf = '';
    let content = '';
    const consume = (line) => {
      line = String(line || '').replace(/\r$/, '');
      if (!line) return false;
      if (line.indexOf('event:') === 0) return /message_stop/i.test(line.slice(6));
      if (line.indexOf('data:') !== 0) return false;
      const payload = line.slice(5).trim();
      if (!payload) return false;
      if (payload === '[DONE]') return true;
      try {
        const json = JSON.parse(payload);
        if (json && json.type === 'message_stop') return true;
        const delta = extractStreamDelta(json, protocol);
        if (delta) {
          content += delta;
          if (onDelta) onDelta(content, delta);
        }
      } catch (e) {}
      return false;
    };
    try {
      while (true) {
        const chunk = await reader.read();
        if (!chunk || chunk.done) break;
        buf += decoder.decode(chunk.value, { stream: true });
        const parts = buf.split('\n');
        buf = parts.pop() || '';
        let ended = false;
        for (let i = 0; i < parts.length; i++) {
          if (consume(parts[i])) {
            ended = true;
            break;
          }
        }
        if (ended) break;
      }
    } finally {
      try {
        buf += decoder.decode();
      } catch (e) {}
      if (buf) consume(buf);
    }
    return content;
  }

  async function chat(cfg, opts) {
    opts = opts || {};
    const trial = assertCfg(cfg);
    if (!String(trial.model || '').trim()) throw new Error('请填写模型');
    const messages = Array.isArray(opts.messages) ? opts.messages : [];
    if (!messages.length) throw new Error('消息为空');
    const packed = buildChatPayload(trial, opts);
    const urls = chatUrlCandidates(trial);
    if (!urls.length) throw new Error('请填写接口地址');
    return tryUrls(urls, async (url) => {
      const res = await fetch(withGeminiKeyQuery(url, trial), {
        method: 'POST',
        headers: authHeaders(trial),
        body: JSON.stringify(packed.body),
        signal: opts.signal,
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw makeApiError(res.status, text, res.statusText);
      }
      if (packed.stream && res.body && typeof res.body.getReader === 'function') {
        const content = await readChatStream(res, opts.onDelta, protocolOf(trial));
        if (!content) throw new Error('API 返回空内容');
        return content;
      }
      const text = await res.text().catch(() => '');
      let data;
      try {
        data = JSON.parse(text || '{}');
      } catch (e) {
        throw new Error('返回非 JSON');
      }
      if (data && data.error) throw makeApiError(res.status, text, 'API error');
      const full = extractAssistantText(data);
      if (!full) throw new Error('API 返回空内容');
      if (opts.onDelta) opts.onDelta(full, full);
      return full;
    });
  }

  async function testMessage(cfg) {
    return chat(cfg, {
      messages: [{ role: 'user', content: 'ping' }],
      maxTokens: 16,
      stream: false,
    });
  }

  global.妹神官_llm = { listModels: listModels, testMessage: testMessage, chat: chat };
})(window);

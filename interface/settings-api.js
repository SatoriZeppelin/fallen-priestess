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

  const TAVERN_PROFILE_ID = 'api_tavern_builtin';

  function isTavernEnv() {
    if (window.__FP_TAVERN_BOOT__) return true;
    if (window.妹神官_llm && typeof window.妹神官_llm.isTavernEnv === 'function' && window.妹神官_llm.isTavernEnv()) return true;
    try {
      if (window.TavernHelper || (window.parent && window.parent.TavernHelper) || (window.top && window.top.TavernHelper)) return true;
      if (window.SillyTavern || (window.parent && window.parent.SillyTavern) || (window.top && window.top.SillyTavern)) return true;
    } catch (e) {}
    return false;
  }

  function buildTavernProfile(existing) {
    const info =
      window.妹神官_llm && typeof window.妹神官_llm.readTavernApiInfo === 'function'
        ? window.妹神官_llm.readTavernApiInfo()
        : {};
    const prev = existing && typeof existing === 'object' ? existing : {};
    return {
      id: TAVERN_PROFILE_ID,
      name: prev.name || '酒馆API',
      enabled: prev.enabled !== false,
      protocol: 'tavern',
      baseUrl: info.source || 'SillyTavern',
      apiKey: '',
      model: info.model || prev.model || '酒馆当前模型',
      autoConnect: false,
      stream: prev.stream != null ? !!prev.stream : false,
      streamDisplay: prev.streamDisplay !== false,
      contextLength: Number(info.contextLength) || Number(prev.contextLength) || 8192,
      maxTokens: Number(info.maxTokens) || Number(prev.maxTokens) || 2048,
      temperature: info.temperature != null ? Number(info.temperature) : prev.temperature != null ? Number(prev.temperature) : 0.8,
      models: info.model ? [info.model] : prev.models || [],
      isTavern: true,
    };
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
      '    正文定位（{{user}}视角）:',
      '        正文将只以{{user}}为视角展开，只描写{{user}}在当前位置亲眼所见、亲耳所闻的内容',
      '        {{user}}无法看见或听见感知范围外的东西（如隔门、远处、视线死角、背对或分头行动时发生的事）',
      '        正文绝不能体现出托莉娜的心声、内心独白、心理活动或真实想法（禁止在托莉娜标签中使用（）写心声）',
      '        托莉娜在场时：只写她在{{user}}面前的言行、表情与{{user}}可感知到的外在反应（如脸红、喘息、声音发颤）',
      '        托莉娜不在场时：正文中不得出现托莉娜的台词与行动描写；她那一侧的遭遇只能写进<额外视角|...>引子，由系统另行生成',
      '        禁止：上帝视角描写、在正文中切换镜头到托莉娜身边，或使用「与此同时，托莉娜……」之类的旁白',
      '    正文格式:',
      '        仅限以下格式：',
      '            - 托莉娜对话标签:<托莉娜|立绘ID|表情|特效|阴影|对话内容>（仅限托莉娜在{{user}}身边时）',
      '            - 其他人对话标签:<角色名|对话内容>',
      '            - 背景标签:<背景|背景名称>（{{user}}所在地点）',
      '            - CG标签:<CG|组名|CG名称>',
      '        禁止出现{{user}}的对话标签',
      '    引子规则:',
      '        仅限以下格式:<名称|本回合该分段应该生成什么的简略描写>',
      '        参考案例:<额外视角|托莉娜正在门后面被马蒂亚斯隐奸，努力控制自己不发出声音和{{user}}对话>',
      '        参考案例:<地点变化|庄园书库>',
      '        名称白名单:额外视角/地点变化',
      '        要求:当存在多个hook的时候换行',
      '        当托莉娜与{{user}}分头行动、不在同一地点时，必须用<额外视角|...>写出托莉娜所遭遇的事情（仅写简略引子，具体内容由系统单独生成，禁止把托莉娜视角写入正文）',
      '        当托莉娜与{{user}}在同一地点时，禁止使用<额外视角|...>；此时托莉娜的一切遭遇都必须写在正文里（以{{user}}视角呈现），系统不会生成额外视角',
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

  function defaultOtherpovPrompt() {
    return [
      '你是「额外视角」叙事者。镜头只跟着托莉娜，写她与{{user}}分头行动期间，在{{user}}看不到的地方发生的事。',
      '与正文的分工:',
      '    正文 = {{user}}的镜头（已由<current_round>给出，仅作时间线参照）',
      '    额外视角 = 托莉娜的镜头（你负责的部分），二者是同一时间段的两条平行线',
      '    禁止：复述、改写或续写<current_round>中的任何场景、台词与事件',
      '    禁止：让{{user}}出场、说话或被直接描写；{{user}}只能以托莉娜的回忆/念头/远处传来的声音出现',
      '镜头规则:',
      '    地点: 只写托莉娜所在地点；开头第一行必须是<背景|托莉娜所在地点>，且不得与{{user}}当前地点相同',
      '    内心: 这里是唯一允许写托莉娜内心独白、真实感受、隐瞒之事的地方，应着重展现她在{{user}}面前藏起来的一面',
      '    衔接: 若有<previous_otherpov>，从其结尾状态直接接续；按<lead>给出的引子展开本回合事件',
      '    时间: 事件时长与正文同步，结尾停在与正文结尾相同的时间点，不得提前写到二人汇合之后',
      '格式（仅限以下标签）:',
      '    - 托莉娜对话标签:<托莉娜|立绘ID|表情|特效|阴影|对话内容>（心理独白也用此标签，内容用（）包裹）',
      '    - 其他人对话标签:<角色名|对话内容>',
      '    - 背景标签:<背景|背景名称>',
      '    - CG标签:<CG|组名|CG名称>',
      '    禁止出现{{user}}的对话标签',
      '篇幅: 充分展开引子中的事件，不得一句话敷衍',
      '输出: 直接输出台本内容，不要包裹任何 XML 标签，不要输出解释',
    ].join('\n');
  }

  function defaultOtherpovParams() {
    return {
      maxTokens: 2500,
      temperature: 1,
      topK: 0,
      topP: 0.95,
      rpm: 0,
      mainHistoryRounds: 5,
      otherpovHistoryRounds: 5,
      prompt: defaultOtherpovPrompt(),
    };
  }

  function defaultStatsPrompt() {
    return [
      '你是「数据变化」评估器。根据本回合玩家行动、正文（及额外视角）与当前变量状态，输出本回合需要更新的变量指令。',
      '规则:',
      '    - 只输出 _.set(\'变量路径\', 值) 或 _.add(\'变量路径\', 增量) 语句，每行一条',
      '    - 时间推进请使用 _.set 更新 系统.时间.小时 / 系统.时间.分钟 / 系统.时间.当前时间 / 系统.时间.已经过天数 / 系统.时间.星期',
      '    - 属性与H统计增减请使用 _.add（如 托莉娜.基础.性欲值、系统.体力.当前体力值 及 Hstate 相关次数与注入量）',
      '    - 严禁修改由引擎自动计算的锁定字段（现时魔力、现时魔力需求、堕落阶段、系统.模式、总吸取魔力次数/总量、与你高潮次数）',
      '    - 若本回合无任何变量变化，仅输出空内容',
      '输出: 直接输出 _.set / _.add 指令行（或包裹在 <imotoshinkan_variables>...</imotoshinkan_variables> 内），不要输出解释。',
    ].join('\n');
  }

  function defaultWorldPrompt() {
    return [
      '你是「世界状态与地点」判定器。根据本回合玩家行动、正文（及额外视角）与地图白名单，判定本回合结束时 {{user}} 与托莉娜各自的所在地点与同行状态。',
      '规则:',
      '    - 地点必须严格取自地图白名单中的地点名称，一字不差',
      '    - 同行状态只能是：同行 | 分开 | 待定',
      '    - 当同行状态为「同行」时，托莉娜地点必须与 {{user}} 当前地点一致',
      '    - 只输出以下三条以内的 _.set 指令（无变化的项可省略）：',
      '        _.set(\'stat_data.系统.地点.当前地点\', \'地点名\')',
      '        _.set(\'stat_data.系统.地点.托莉娜地点\', \'地点名\')',
      '        _.set(\'stat_data.托莉娜.行程.同行状态\', \'同行|分开|待定\')',
      '输出: 直接输出 _.set 指令行，不要输出任何解释。',
    ].join('\n');
  }

  function defaultSnapshotPrompt() {
    return [
      '你是「回合快照总结」生成器。根据本回合玩家行动与正文（及额外视角）以及当前时间，生成一行简明扼要的本回合剧情快照。',
      '规则:',
      '    - 严格使用单行格式：天数|星期几|HH:MM|本回合剧情总结',
      '    - 总结字数控制在 40~100 字以内，客观概括本回合发生的关键事件与角色状态变化',
      '    - 示例：1|星期一|08:30|托莉娜与{{user}}在客厅重逢并整理行李，聊起教会见习神官的工作安排',
      '输出: 直接输出该行快照文本（或包裹在 <imotoshinkan_snapshots>...</imotoshinkan_snapshots> 内），不要输出解释。',
    ].join('\n');
  }

  function defaultBranchesPrompt() {
    return [
      '你是「行动选项」生成器。根据本回合正文结尾的局面、角色状态与同行状态，为 {{user}} 生成下一回合可执行的行动分支选项。',
      '规则:',
      '    - 每行一条选项，格式严格为：分类|行动文案',
      '    - 分类仅限以下六种：亲密、日常、移动、推荐、观察或被动、快进时间',
      '    - 生成 4~6 条符合当前情境的行动选项，至少覆盖 3 个不同分类',
      '    - 当托莉娜与 {{user}} 分开（不在同一地点）时，禁止提供当场对托莉娜做亲密接触的选项',
      '输出: 直接输出多行「分类|行动文案」（或包裹在 <imotoshinkan_branches>...</imotoshinkan_branches> 内），不要输出解释。',
    ].join('\n');
  }

  function defaultSubRouteParams(route) {
    if (route === 'stats') {
      return { enabled: true, maxTokens: 1024, temperature: 0.4, topK: 0, topP: 0.95, rpm: 0, prompt: defaultStatsPrompt() };
    }
    if (route === 'world') {
      return { enabled: true, maxTokens: 512, temperature: 0.3, topK: 0, topP: 0.95, rpm: 0, prompt: defaultWorldPrompt() };
    }
    if (route === 'snapshot') {
      return { enabled: true, maxTokens: 512, temperature: 0.5, topK: 0, topP: 0.95, rpm: 0, prompt: defaultSnapshotPrompt() };
    }
    if (route === 'branches') {
      return { enabled: true, maxTokens: 1024, temperature: 0.8, topK: 0, topP: 0.95, rpm: 0, prompt: defaultBranchesPrompt() };
    }
    return { enabled: true, maxTokens: 1024, temperature: 0.7, topK: 0, topP: 0.95, rpm: 0, prompt: '' };
  }

  function normalizeSubRouteParams(route, src) {
    const d = defaultSubRouteParams(route);
    const s = src && typeof src === 'object' ? src : {};
    return {
      enabled: s.enabled !== false,
      maxTokens: clampNum(s.maxTokens, 16, 8192, d.maxTokens),
      temperature: clampNum(s.temperature, 0, 2, d.temperature),
      topK: Math.round(clampNum(s.topK, 0, 200, d.topK)),
      topP: clampNum(s.topP, 0, 1, d.topP),
      rpm: Math.round(clampNum(s.rpm, 0, 1000, d.rpm)),
      prompt: typeof s.prompt === 'string' && s.prompt.trim() ? s.prompt : d.prompt,
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
      targetChars: Math.max(0, Math.round(Number(migratingOldDefaults ? d.targetChars : s.targetChars) || d.targetChars)),
      prompt: (typeof s.prompt === 'string' && !s.prompt.includes('正文的镜头永远跟着{{user}}')) ? s.prompt : d.prompt,
    };
  }

  function normalizeOtherpovParams(src) {
    const d = defaultOtherpovParams();
    const s = src && typeof src === 'object' ? src : {};
    return {
      enabled: s.enabled !== false,
      maxTokens: clampNum(s.maxTokens, 16, 8192, d.maxTokens),
      temperature: clampNum(s.temperature, 0, 2, d.temperature),
      topK: Math.round(clampNum(s.topK, 0, 200, d.topK)),
      topP: clampNum(s.topP, 0, 1, d.topP),
      rpm: Math.round(clampNum(s.rpm, 0, 1000, d.rpm)),
      mainHistoryRounds: Math.round(clampNum(s.mainHistoryRounds, 0, 20, d.mainHistoryRounds)),
      otherpovHistoryRounds: Math.round(clampNum(s.otherpovHistoryRounds, 0, 20, d.otherpovHistoryRounds)),
      prompt: typeof s.prompt === 'string' ? s.prompt : d.prompt,
    };
  }

  const SUB_ROUTES = ['stats', 'world', 'snapshot', 'branches'];

  function emptyRouteParams() {
    return {
      story: defaultStoryParams(),
      otherpov: defaultOtherpovParams(),
      stats: defaultSubRouteParams('stats'),
      world: defaultSubRouteParams('world'),
      snapshot: defaultSubRouteParams('snapshot'),
      branches: defaultSubRouteParams('branches'),
    };
  }

  function normalizeRouteParams(src) {
    const s = src && typeof src === 'object' ? src : {};
    return {
      story: normalizeStoryParams(s.story),
      otherpov: normalizeOtherpovParams(s.otherpov),
      stats: normalizeSubRouteParams('stats', s.stats),
      world: normalizeSubRouteParams('world', s.world),
      snapshot: normalizeSubRouteParams('snapshot', s.snapshot),
      branches: normalizeSubRouteParams('branches', s.branches),
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
    if (isTavernEnv()) {
      const tav = buildTavernProfile();
      return {
        profiles: [tav],
        defaultProfileId: tav.id,
        routes: emptyRoutes(),
        routeParams: emptyRouteParams(),
      };
    }
    const first = defaultProfile('接口 1');
    return {
      profiles: [first],
      defaultProfileId: first.id,
      routes: emptyRoutes(),
      routeParams: emptyRouteParams(),
    };
  }

  function ensureStoreForEnv(data) {
    const inTavern = isTavernEnv();
    let changed = false;
    if (inTavern) {
      const idx = data.profiles.findIndex((p) => p && (p.id === TAVERN_PROFILE_ID || p.protocol === 'tavern'));
      if (idx < 0) {
        const tav = buildTavernProfile();
        data.profiles.unshift(tav);
        const firstNonTav = data.profiles[1];
        const firstIsUnconfigured =
          firstNonTav && !String(firstNonTav.baseUrl || '').trim() && !String(firstNonTav.apiKey || '').trim();
        if (!data.defaultProfileId || firstIsUnconfigured) {
          data.defaultProfileId = tav.id;
        }
        changed = true;
      } else {
        const refreshed = buildTavernProfile(data.profiles[idx]);
        if (data.profiles[idx].model !== refreshed.model || data.profiles[idx].baseUrl !== refreshed.baseUrl) {
          data.profiles[idx] = refreshed;
          changed = true;
        }
      }
    } else {
      const hadTavern = data.profiles.some((p) => p && (p.id === TAVERN_PROFILE_ID || p.protocol === 'tavern'));
      if (hadTavern) {
        data.profiles = data.profiles.filter((p) => p && p.id !== TAVERN_PROFILE_ID && p.protocol !== 'tavern');
        if (!data.profiles.length) {
          data.profiles.push(defaultProfile('接口 1'));
        }
        if (!data.profiles.some((p) => p.id === data.defaultProfileId)) {
          data.defaultProfileId = data.profiles[0].id;
        }
        ROUTES.forEach((route) => {
          if (data.routes && data.routes[route] === TAVERN_PROFILE_ID) data.routes[route] = '';
        });
        changed = true;
      }
    }
    if (changed) saveStore(data);
    return data;
  }

  function loadStore() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) {
        const initSt = emptyStore();
        saveStore(initSt);
        return initSt;
      }
      const data = JSON.parse(raw);
      if (!data || !Array.isArray(data.profiles) || !data.profiles.length) {
        const initSt = emptyStore();
        saveStore(initSt);
        return initSt;
      }
      data.routes = normalizeRoutes(data.routes);
      data.routeParams = normalizeRouteParams(data.routeParams);
      return ensureStoreForEnv(data);
    } catch (e) {
      return emptyStore();
    }
  }

  function importTavernApi() {
    if (!isTavernEnv()) {
      toast('当前不在酒馆环境中');
      return;
    }
    const st = loadStore();
    const idx = st.profiles.findIndex((p) => p && (p.id === TAVERN_PROFILE_ID || p.protocol === 'tavern'));
    const tav = buildTavernProfile(idx >= 0 ? st.profiles[idx] : null);
    tav.name = '酒馆API';
    tav.enabled = true;
    if (idx >= 0) {
      st.profiles[idx] = tav;
    } else {
      st.profiles.unshift(tav);
    }
    st.defaultProfileId = tav.id;
    saveStore(st);
    Object.keys(expanded).forEach((k) => {
      expanded[k] = false;
    });
    expanded[tav.id] = true;
    render();
    toast('已导入并同步酒馆API（' + (tav.model || '当前模型') + '）');
  }

  function saveStore(st) {
    localStorage.setItem(STORE_KEY, JSON.stringify(st));
  }

  function protocolPlaceholder(protocol) {
    if (protocol === 'tavern') return '由酒馆 (SillyTavern) 托管连接';
    if (protocol === 'claude') return 'https://api.anthropic.com';
    if (protocol === 'gemini') return 'https://generativelanguage.googleapis.com';
    return 'https://api.openai.com/v1';
  }

  const ROUTE_LABELS = {
    story: '主输出',
    otherpov: '额外视角',
    stats: '数据变化',
    world: '地点变化',
    snapshot: '总结',
    branches: '选项',
  };

  function renderRoutesOverviewMatrix(st, apiOptions) {
    const box = $('routes-overview-matrix');
    if (!box) return;
    const presetMod = window.妹神官_settings_preset;
    const presetSt = presetMod && typeof presetMod.loadStore === 'function' ? presetMod.loadStore() : { profiles: [], routes: {} };
    const presetOptions = (presetSt.profiles || [])
      .map((p) => '<option value="' + esc(p.id) + '">' + esc(p.name) + (p.enabled === false ? '（已禁用）' : '') + '</option>')
      .join('');

    box.innerHTML = ROUTES.map((route) => {
      const label = ROUTE_LABELS[route] || route;
      const rp = st.routeParams && st.routeParams[route];
      const isStory = route === 'story';
      const isOn = isStory ? true : (!rp || rp.enabled !== false);
      return (
        '<div class="sys-api-card" style="padding: 10px 14px;" data-overview-route="' + esc(route) + '">' +
          '<div style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">' +
            '<div style="display:flex; align-items:center; gap:10px; min-width: 150px;">' +
              '<span class="sys-api-card-title" style="font-size:14px;">' + esc(label) + '</span>' +
              (isStory
                ? '<span class="sys-api-badge is-on">核心必选</span>'
                : '<label class="sys-check" style="margin:0; font-size:12px;"><input type="checkbox" data-ov-enabled="' + esc(route) + '"' + (isOn ? ' checked' : '') + ' /><span class="sys-check-box" aria-hidden="true"></span><span>' + (isOn ? '已启用' : '已跳过') + '</span></label>') +
            '</div>' +
            '<div style="display:flex; align-items:center; gap:10px; flex:1; min-width:260px; justify-content:flex-end;">' +
              '<select class="sys-select" data-ov-api="' + esc(route) + '" style="max-width:200px;"><option value="">接口：使用默认</option>' + apiOptions + '</select>' +
              '<select class="sys-select" data-ov-preset="' + esc(route) + '" style="max-width:200px;"><option value="">预设：使用默认</option>' + presetOptions + '</select>' +
              '<button type="button" class="settings-control-btn" data-ov-jump="' + esc(route) + '">详情</button>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    ROUTES.forEach((route) => {
      const apiSel = box.querySelector('[data-ov-api="' + route + '"]');
      const preSel = box.querySelector('[data-ov-preset="' + route + '"]');
      if (apiSel) apiSel.value = (st.routes && st.routes[route]) || '';
      if (preSel) preSel.value = (presetSt.routes && presetSt.routes[route]) || '';
    });
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
    fillOtherpovSampler(st.routeParams && st.routeParams.otherpov);
    SUB_ROUTES.forEach((route) => {
      fillSubRouteSampler(route, st.routeParams && st.routeParams[route]);
    });
    ['otherpov'].concat(SUB_ROUTES).forEach((route) => {
      const chk = document.querySelector('[data-route-enabled="' + route + '"]');
      if (chk) {
        const rp = st.routeParams && st.routeParams[route];
        chk.checked = !rp || rp.enabled !== false;
      }
    });
    renderRoutesOverviewMatrix(st, options);
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
      key === 'targetChars' ||
      key === 'mainHistoryRounds' ||
      key === 'otherpovHistoryRounds'
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

  function otherpovSamplerRoot() {
    return $('otherpov-sampler');
  }

  function fillOtherpovSampler(src) {
    const root = otherpovSamplerRoot();
    if (!root) return;
    const p = normalizeOtherpovParams(src);
    Object.keys(p).forEach((key) => {
      const range = root.querySelector('[data-op="' + key + '"]');
      const num = root.querySelector('[data-op-num="' + key + '"]');
      if (range) {
        range.value = String(p[key] == null ? '' : p[key]);
        if (range.type === 'range') setRangePct(range);
      }
      if (num) num.value = fmtStoryVal(key, p[key]);
    });
  }

  function readOtherpovSampler() {
    const root = otherpovSamplerRoot();
    const d = defaultOtherpovParams();
    if (!root) return d;
    const num = (key) => {
      const el = root.querySelector('[data-op="' + key + '"]');
      return el ? el.value : d[key];
    };
    const chk = document.querySelector('[data-route-enabled="otherpov"]');
    return normalizeOtherpovParams({
      enabled: chk ? chk.checked : true,
      maxTokens: num('maxTokens'),
      temperature: num('temperature'),
      topK: num('topK'),
      topP: num('topP'),
      rpm: d.rpm,
      mainHistoryRounds: num('mainHistoryRounds'),
      otherpovHistoryRounds: num('otherpovHistoryRounds'),
      prompt: num('prompt'),
    });
  }

  function saveOtherpovSampler(opts) {
    const st = loadStore();
    st.routeParams = st.routeParams || {};
    st.routeParams.otherpov = readOtherpovSampler();
    saveStore(st);
    if (!(opts && opts.silent)) fillOtherpovSampler(st.routeParams.otherpov);
  }

  let otherpovSamplerBound = false;
  function bindOtherpovSampler() {
    const root = otherpovSamplerRoot();
    if (!root || otherpovSamplerBound) return;
    otherpovSamplerBound = true;
    root.addEventListener('input', (e) => {
      const t = e.target;
      if (!t) return;
      if (t.matches('[data-op]') && t.type === 'range') {
        const key = t.getAttribute('data-op');
        const num = root.querySelector('[data-op-num="' + key + '"]');
        if (num) num.value = fmtStoryVal(key, parseFloat(t.value));
        setRangePct(t);
        saveOtherpovSampler();
        return;
      }
      if (t.matches('[data-op-num]')) {
        const key = t.getAttribute('data-op-num');
        const range = root.querySelector('[data-op="' + key + '"]');
        const n = parseFloat(t.value);
        if (range && Number.isFinite(n)) {
          range.value = String(n);
          setRangePct(range);
        }
        saveOtherpovSampler();
        return;
      }
      if (t.matches('textarea[data-op]')) {
        saveOtherpovSampler({ silent: true });
      }
    });
    root.addEventListener('change', (e) => {
      const t = e.target;
      if (!t) return;
      if (t.matches('[data-op], [data-op-num]')) saveOtherpovSampler();
    });
  }

  function subRouteSamplerRoot(route) {
    return $(route + '-sampler');
  }

  function fillSubRouteSampler(route, src) {
    const root = subRouteSamplerRoot(route);
    if (!root) return;
    const p = normalizeSubRouteParams(route, src);
    Object.keys(p).forEach((key) => {
      const range = root.querySelector('[data-rt="' + key + '"]');
      const num = root.querySelector('[data-rt-num="' + key + '"]');
      if (range) {
        range.value = String(p[key] == null ? '' : p[key]);
        if (range.type === 'range') setRangePct(range);
      }
      if (num) num.value = fmtStoryVal(key, p[key]);
    });
  }

  function readSubRouteSampler(route) {
    const root = subRouteSamplerRoot(route);
    const d = defaultSubRouteParams(route);
    if (!root) return d;
    const val = (key) => {
      const el = root.querySelector('[data-rt="' + key + '"]');
      return el ? el.value : d[key];
    };
    const chk = document.querySelector('[data-route-enabled="' + route + '"]');
    return normalizeSubRouteParams(route, {
      enabled: chk ? chk.checked : true,
      maxTokens: val('maxTokens'),
      temperature: val('temperature'),
      topK: val('topK'),
      topP: val('topP'),
      rpm: d.rpm,
      prompt: val('prompt'),
    });
  }

  function saveSubRouteSampler(route, opts) {
    const st = loadStore();
    st.routeParams = st.routeParams || {};
    st.routeParams[route] = readSubRouteSampler(route);
    saveStore(st);
    if (!(opts && opts.silent)) fillSubRouteSampler(route, st.routeParams[route]);
  }

  const subRouteSamplerBound = {};
  function bindSubRouteSamplers() {
    SUB_ROUTES.forEach((route) => {
      const root = subRouteSamplerRoot(route);
      if (!root || subRouteSamplerBound[route]) return;
      subRouteSamplerBound[route] = true;
      root.addEventListener('input', (e) => {
        const t = e.target;
        if (!t) return;
        if (t.matches('[data-rt]') && t.type === 'range') {
          const key = t.getAttribute('data-rt');
          const num = root.querySelector('[data-rt-num="' + key + '"]');
          if (num) num.value = fmtStoryVal(key, parseFloat(t.value));
          setRangePct(t);
          saveSubRouteSampler(route);
          return;
        }
        if (t.matches('[data-rt-num]')) {
          const key = t.getAttribute('data-rt-num');
          const range = root.querySelector('[data-rt="' + key + '"]');
          const n = parseFloat(t.value);
          if (range && Number.isFinite(n)) {
            range.value = String(n);
            setRangePct(range);
          }
          saveSubRouteSampler(route);
          return;
        }
        if (t.matches('textarea[data-rt]')) {
          saveSubRouteSampler(route, { silent: true });
        }
      });
      root.addEventListener('change', (e) => {
        const t = e.target;
        if (!t) return;
        if (t.matches('[data-rt], [data-rt-num]')) saveSubRouteSampler(route);
      });
    });
  }

  function getRouteParams(route) {
    const st = loadStore();
    if (route === 'story') return normalizeStoryParams(st.routeParams && st.routeParams.story);
    if (route === 'otherpov') return normalizeOtherpovParams(st.routeParams && st.routeParams.otherpov);
    if (SUB_ROUTES.indexOf(route) >= 0) return normalizeSubRouteParams(route, st.routeParams && st.routeParams[route]);
    return null;
  }

  function saveRouteParams(route, params) {
    const st = loadStore();
    st.routeParams = st.routeParams || {};
    if (route === 'story') st.routeParams.story = normalizeStoryParams(params);
    else if (route === 'otherpov') st.routeParams.otherpov = normalizeOtherpovParams(params);
    else if (SUB_ROUTES.indexOf(route) >= 0) st.routeParams[route] = normalizeSubRouteParams(route, params);
    else return;
    saveStore(st);
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
        } else if (!range) {
          saveStorySampler();
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
    const isTavernCard = protocol === 'tavern' || p.id === TAVERN_PROFILE_ID;
    const sub = isTavernCard
      ? [p.model || '酒馆当前模型', 'SillyTavern'].filter(Boolean).join(' · ')
      : [p.model, hostOf(p.baseUrl)].filter(Boolean).join(' · ') || '未配置';
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
      (isTavernEnv() || isTavernCard
        ? '<option value="tavern"' +
          (protocol === 'tavern' ? ' selected' : '') +
          '>酒馆 API（SillyTavern 当前连接）</option>'
        : '') +
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
    const tavernBtn = $('btn-api-import-tavern');
    if (tavernBtn) tavernBtn.hidden = !isTavernEnv();
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

    const tavernImportBtn = $('btn-api-import-tavern');
    if (tavernImportBtn) {
      tavernImportBtn.hidden = !isTavernEnv();
      tavernImportBtn.addEventListener('click', () => {
        importTavernApi();
      });
    }

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
        fillRouteSelects(st);
      });
    });

    const paneRoutes = $('pane-routes');
    if (paneRoutes) {
      paneRoutes.addEventListener('click', (e) => {
        const resetBtn = e.target.closest('[data-reset-prompt]');
        if (resetBtn) {
          const route = resetBtn.getAttribute('data-reset-prompt');
          const st = loadStore();
          st.routeParams = st.routeParams || {};
          if (route === 'story') {
            st.routeParams.story = normalizeStoryParams(st.routeParams.story);
            st.routeParams.story.prompt = defaultStoryPrompt();
            saveStore(st);
            fillStorySampler(st.routeParams.story);
          } else if (route === 'otherpov') {
            st.routeParams.otherpov = normalizeOtherpovParams(st.routeParams.otherpov);
            st.routeParams.otherpov.prompt = defaultOtherpovPrompt();
            saveStore(st);
            fillOtherpovSampler(st.routeParams.otherpov);
          } else if (SUB_ROUTES.indexOf(route) >= 0) {
            st.routeParams[route] = normalizeSubRouteParams(route, st.routeParams[route]);
            st.routeParams[route].prompt = defaultSubRouteParams(route).prompt;
            saveStore(st);
            fillSubRouteSampler(route, st.routeParams[route]);
          }
          toast('已恢复默认提示词');
          return;
        }

        const applyBgBtn = e.target.closest('[data-apply-bg-route]');
        if (applyBgBtn) {
          const route = applyBgBtn.getAttribute('data-apply-bg-route');
          const sel = $('cfg-api-route-' + route);
          const val = sel ? sel.value : '';
          const st = loadStore();
          st.routes = st.routes || {};
          SUB_ROUTES.forEach((r) => {
            st.routes[r] = val;
          });
          saveStore(st);
          fillRouteSelects(st);
          toast('已将该接口套用到全部后台辅助路由');
          return;
        }

        const jumpBtn = e.target.closest('[data-ov-jump]');
        if (jumpBtn) {
          const targetRoute = jumpBtn.getAttribute('data-ov-jump');
          const subBtn = paneRoutes.querySelector('.settings-subtab[data-sub="' + targetRoute + '"]');
          if (subBtn) subBtn.click();
          return;
        }
      });

      paneRoutes.addEventListener('change', (e) => {
        const enChk = e.target.closest('[data-route-enabled]');
        if (enChk) {
          const route = enChk.getAttribute('data-route-enabled');
          if (route === 'otherpov') saveOtherpovSampler();
          else if (SUB_ROUTES.indexOf(route) >= 0) saveSubRouteSampler(route);
          fillRouteSelects(loadStore());
          toast((enChk.checked ? '已启用 ' : '已关闭 ') + (ROUTE_LABELS[route] || route) + ' 独立生成');
          return;
        }

        const ovEn = e.target.closest('[data-ov-enabled]');
        if (ovEn) {
          const route = ovEn.getAttribute('data-ov-enabled');
          const subChk = document.querySelector('[data-route-enabled="' + route + '"]');
          if (subChk) subChk.checked = ovEn.checked;
          if (route === 'otherpov') saveOtherpovSampler();
          else if (SUB_ROUTES.indexOf(route) >= 0) saveSubRouteSampler(route);
          fillRouteSelects(loadStore());
          toast((ovEn.checked ? '已启用 ' : '已关闭 ') + (ROUTE_LABELS[route] || route) + ' 独立生成');
          return;
        }

        const ovApi = e.target.closest('[data-ov-api]');
        if (ovApi) {
          const route = ovApi.getAttribute('data-ov-api');
          const st = loadStore();
          st.routes = st.routes || {};
          st.routes[route] = ovApi.value;
          saveStore(st);
          fillRouteSelects(st);
          return;
        }

        const ovPre = e.target.closest('[data-ov-preset]');
        if (ovPre) {
          const route = ovPre.getAttribute('data-ov-preset');
          const presetMod = window.妹神官_settings_preset;
          if (presetMod && typeof presetMod.loadStore === 'function') {
            const pst = presetMod.loadStore();
            pst.routes = pst.routes || {};
            pst.routes[route] = ovPre.value;
            presetMod.saveStore(pst);
            if (typeof presetMod.fillRouteSelects === 'function') presetMod.fillRouteSelects(pst);
            fillRouteSelects(loadStore());
          }
        }
      });
    }

    const resetAllDefaultBtn = $('btn-routes-apply-all-default');
    if (resetAllDefaultBtn) {
      resetAllDefaultBtn.addEventListener('click', () => {
        const st = loadStore();
        st.routes = emptyRoutes();
        saveStore(st);
        fillRouteSelects(st);
        const presetMod = window.妹神官_settings_preset;
        if (presetMod && typeof presetMod.loadStore === 'function') {
          const pst = presetMod.loadStore();
          pst.routes = {};
          presetMod.saveStore(pst);
          if (typeof presetMod.fillRouteSelects === 'function') presetMod.fillRouteSelects(pst);
        }
        fillRouteSelects(loadStore());
        toast('所有路由已重置为使用默认接口与预设');
      });
    }

    bindStorySampler();
    bindOtherpovSampler();
    bindSubRouteSamplers();
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

  global.妹神官_settings_api = {
    init,
    render,
    loadStore,
    saveStore,
    getRouteParams,
    saveRouteParams,
    resolveProfile,
    importTavernApi,
  };
})(window);

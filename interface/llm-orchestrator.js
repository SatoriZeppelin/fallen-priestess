/**
 * 多 LLM 角色合同：World / Story / Stats / Meta
 * 供 app.js 编排器调用。预设全文见 preset/role-*.md
 */
(function (global) {
  const BRANCH_CATEGORIES = ['亲密', '日常', '移动', '推荐', '观察或被动', '快进时间'];
  const COMPANION_STATES = ['同行', '分开', '待定'];

  const WORLD_PROMPT = [
    '你只负责地点与同行，不写正文、不改数值、不给分支。',
    '只输出一个 JSON 对象，不要解释。字段：playerLocation, torinaLocation, companion, needOtherPov, sceneHint。',
    'companion 只能是 同行|分开|待定。地点必须来自白名单。同行时两人同地。',
    '分开时托莉娜不得凭空出现在玩家身边；有独立戏份则 needOtherPov=true。',
  ].join('\n');

  const STORY_PROMPT = [
    '你只写本轮剧情正文。禁止输出 _.set / _.add / <imotoshinkan_variables> / 分支 / 快照。',
    '必须输出：<imotoshinkan><imotoshinkan_maintext>…</imotoshinkan_maintext></imotoshinkan>',
    'maintext 仅 {{user}} 视角。标签：<背景|名> <CG|组|名> <托莉娜|底图|表情|杂项|阴影|台词>。',
    '托莉娜不在场时不要写进 maintext；独立戏份用 <imotoshinkan_otherpov>。地点以锁定世界为准。',
  ].join('\n');

  const STATS_PROMPT = [
    '你只根据正文和行动给出数值增量。不要写正文或分支。只输出 JSON：events, set, add。',
    '禁止改：现时魔力、魔力需求、吸取总计、高潮总计、堕落阶段、系统.模式。',
    '时间用 set；性欲/堕落/体力用 add。无变化输出 {"events":[],"set":{},"add":{}}。单轮性欲 0-8，堕落 0-3。',
  ].join('\n');

  const META_PROMPT = [
    '你只生成下一轮分支和一句快照。不要写正文或改数值。只输出 JSON：snapshot, branches。',
    'snapshot 格式：天数|星期几|HH:MM|摘要。cat 只能是 亲密|日常|移动|推荐|观察或被动|快进时间。',
    '给 4-8 条可执行短选项，至少 2 个分类。分开时不要给当场对托莉娜动手的选项。',
  ].join('\n');

  const STATS_SET_ALLOW = new Set([
    '系统.时间.当前时间',
    '系统.时间.小时',
    '系统.时间.分钟',
    '系统.时间.已经过天数',
    '系统.时间.星期',
    '系统.体力.当前体力值',
    '托莉娜.基础.服装',
  ]);

  const STATS_ADD_ALLOW = new Set([
    '托莉娜.基础.性欲值',
    '托莉娜.基础.堕落值',
    '系统.体力.当前体力值',
    '托莉娜.Hstate纯爱.表.头部.与你口交次数',
    '托莉娜.Hstate纯爱.表.足部.与你足交次数',
    '托莉娜.Hstate纯爱.表.头部.与你接吻次数',
    '托莉娜.Hstate纯爱.表.头部.被你颜射次数',
    '托莉娜.Hstate纯爱.表.胸部.与你乳交次数',
    '托莉娜.Hstate纯爱.表.阴部.与你性交次数',
    '托莉娜.Hstate纯爱.表.阴部.与你肛交次数',
    '托莉娜.Hstate纯爱.表.总表.因为其他原因吸取你魔力次数',
    '托莉娜.Hstate纯爱.表.头部.与你接吻获得的魔力量',
    '托莉娜.Hstate纯爱.表.胸部.乳交吸取你魔力总量',
    '托莉娜.Hstate纯爱.表.阴部.小穴吸取你的魔力总量',
    '托莉娜.Hstate纯爱.表.阴部.屁穴吸取你的魔力总量',
    '托莉娜.Hstate纯爱.表.总表.因为其他原因吸取你魔力',
    '托莉娜.Hstate正常.表.头部.与你亲吻次数',
    '托莉娜.Hstate正常.表.头部.与你口交次数',
    '托莉娜.Hstate正常.表.胸部.与你乳交次数',
    '托莉娜.Hstate正常.表.足部.与你足交次数',
  ]);

  const STATS_DENY = [
    '现时魔力',
    '现时魔力需求',
    '从你吸取魔力次数',
    '从你吸取魔力总量',
    '总吸取魔力次数',
    '总吸取魔力量',
    '与你高潮次数',
    '堕落阶段',
    '系统.模式',
  ];

  function getLocationNames() {
    try {
      const el = document.getElementById('meishinkan-map-config');
      const cfg = el ? JSON.parse(el.textContent) : {};
      const names = (cfg.locations || []).map((item) => item && item.name).filter(Boolean);
      return names.length ? names : ['家'];
    } catch (e) {
      return ['家'];
    }
  }

  function normalizePath(path) {
    if (!path || typeof path !== 'string') return '';
    let p = path.trim();
    if (p.startsWith('stat_data.')) p = p.slice('stat_data.'.length);
    return p;
  }

  function isDeniedPath(path) {
    const p = normalizePath(path);
    return STATS_DENY.some((key) => p === key || p.endsWith('.' + key));
  }

  function extractJsonObject(text) {
    if (!text) return null;
    const fence = String(text).match(/```(?:json)?\s*([\s\S]*?)```/i);
    const raw = fence ? fence[1] : String(text);
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start < 0 || end <= start) return null;
    try {
      return JSON.parse(raw.slice(start, end + 1));
    } catch (e) {
      return null;
    }
  }

  function classifyAction(text) {
    const t = String(text || '').trim();
    const catPrefix = t.match(/^(亲密|日常|移动|推荐|观察或被动|快进时间|观察|被动|快进)[:：|｜]/);
    if (catPrefix) {
      const raw = catPrefix[1];
      if (raw === '观察' || raw === '被动') return '观察或被动';
      if (raw === '快进') return '快进时间';
      return raw;
    }
    if (/快进|拨到|等到(傍晚|晚上|深夜)|把时间/.test(t)) return '快进时间';
    if (/前往|出门|移动到|去镇上|去酒馆|去教会|去教堂|去码头/.test(t)) return '移动';
    return '日常';
  }

  function needsWorld(kind, actionText, companion) {
    if (kind === 'travel') return true;
    if (companion === '待定') return true;
    const cat = classifyAction(actionText);
    return cat === '移动' || cat === '快进时间';
  }

  function pickLocation(name, locations, fallback) {
    const list = locations && locations.length ? locations : getLocationNames();
    const raw = String(name || '').trim();
    if (list.includes(raw)) return raw;
    const loose = list.find((item) => raw && (item === raw || raw.indexOf(item) !== -1 || item.indexOf(raw) !== -1));
    return loose || fallback || list[0] || '家';
  }

  function parseWorld(text, locations, fallback) {
    const data = extractJsonObject(text);
    if (!data || typeof data !== 'object') return null;
    const fb = fallback || {};
    const companion = COMPANION_STATES.includes(data.companion) ? data.companion : (fb.companion || '同行');
    let playerLocation = pickLocation(data.playerLocation, locations, fb.playerLocation);
    let torinaLocation = pickLocation(data.torinaLocation, locations, fb.torinaLocation || playerLocation);
    if (companion === '同行') torinaLocation = playerLocation;
    return {
      playerLocation,
      torinaLocation,
      companion,
      needOtherPov: companion === '分开' ? !!data.needOtherPov : false,
      sceneHint: String(data.sceneHint || '').replace(/\s+/g, ' ').trim().slice(0, 80),
    };
  }

  function filterStatMap(src, allow) {
    const out = {};
    if (!src || typeof src !== 'object') return out;
    Object.keys(src).forEach((key) => {
      const path = normalizePath(key);
      if (!path || isDeniedPath(path) || !allow.has(path)) return;
      const value = src[key];
      if (value === null || value === undefined || value === '') return;
      out[path] = value;
    });
    return out;
  }

  function parseStats(text) {
    const data = extractJsonObject(text) || {};
    const events = Array.isArray(data.events) ? data.events.map((item) => String(item)).filter(Boolean) : [];
    const set = filterStatMap(data.set, STATS_SET_ALLOW);
    const add = filterStatMap(data.add, STATS_ADD_ALLOW);
    Object.keys(add).forEach((path) => {
      const n = parseFloat(add[path]);
      add[path] = Number.isFinite(n) ? n : 0;
    });
    if (typeof set['系统.时间.小时'] !== 'undefined') {
      set['系统.时间.小时'] = Math.max(0, Math.min(23, parseInt(set['系统.时间.小时'], 10) || 0));
    }
    if (typeof set['系统.时间.分钟'] !== 'undefined') {
      set['系统.时间.分钟'] = Math.max(0, Math.min(59, parseInt(set['系统.时间.分钟'], 10) || 0));
    }
    return { events, set, add };
  }

  function parseMeta(text) {
    const data = extractJsonObject(text);
    if (!data || typeof data !== 'object') return null;
    const snapshot = String(data.snapshot || '').replace(/\s+/g, ' ').trim();
    const branches = [];
    (Array.isArray(data.branches) ? data.branches : []).forEach((item) => {
      if (!item) return;
      if (typeof item === 'string') {
        const line = item.trim();
        if (line) branches.push({ cat: '推荐', text: line });
        return;
      }
      const textLine = String(item.text || '').trim();
      if (!textLine) return;
      let cat = String(item.cat || item.category || '推荐').trim();
      if (cat === '观察' || cat === '被动') cat = '观察或被动';
      if (cat === '快进') cat = '快进时间';
      if (BRANCH_CATEGORIES.indexOf(cat) < 0) cat = '推荐';
      branches.push({ cat, text: textLine });
    });
    if (!branches.length) return null;
    return {
      snapshot,
      branches,
      branchesText: branches.map((item) => item.cat + '|' + item.text).join('\n'),
    };
  }

  function stripStoryLeaks(parsed) {
    const next = parsed || { maintext: '', otherpov: '', branches: '', snapshots: '', variables: '' };
    const leakRe = /_\.(set|add)\s*\([^)]*\)\s*;?/g;
    const varBlock = /<imotoshinkan_variables>[\s\S]*?<\/imotoshinkan_variables>/gi;
    if (next.maintext) {
      next.maintext = String(next.maintext).replace(varBlock, '').replace(leakRe, '').trim();
    }
    if (next.otherpov) {
      next.otherpov = String(next.otherpov).replace(leakRe, '').trim();
    }
    next.variables = '';
    next.branches = '';
    next.snapshots = '';
    return next;
  }

  function parseStory(text, parseTagsFn) {
    if (!text || typeof parseTagsFn !== 'function') return null;
    let parsed = parseTagsFn(text);
    if (!parsed || !parsed.maintext) {
      const hasTag = /<(?:背景|CG|托莉娜)\|/.test(text);
      if (hasTag) {
        parsed = parseTagsFn('<imotoshinkan><imotoshinkan_maintext>' + text + '</imotoshinkan_maintext></imotoshinkan>');
      }
    }
    if (!parsed || !parsed.maintext) return null;
    return stripStoryLeaks(parsed);
  }

  function formatJsonBlock(title, obj) {
    return '## ' + title + '\n\n```json\n' + JSON.stringify(obj, null, 2) + '\n```\n';
  }

  function buildWorldPrompt(ctx) {
    const locations = ctx.locations || getLocationNames();
    return [
      '【角色：World】',
      WORLD_PROMPT,
      '',
      '## 地图白名单',
      locations.join('、'),
      '',
      formatJsonBlock('当前世界', ctx.world || {}),
      '## 玩家行动',
      ctx.playerInput || '',
      ctx.kind === 'travel' && ctx.forcedPlayerLocation ? '\n玩家已移动到：' + ctx.forcedPlayerLocation : '',
    ].join('\n');
  }

  function buildStoryPrompt(ctx) {
    const world = ctx.world || {};
    return [
      '【角色：Story】',
      STORY_PROMPT,
      '',
      formatJsonBlock('锁定世界', {
        playerLocation: world.playerLocation,
        torinaLocation: world.torinaLocation,
        companion: world.companion,
        needOtherPov: !!world.needOtherPov,
        sceneHint: world.sceneHint || '',
      }),
      '## 当前数值摘要',
      ctx.summary || '',
      '',
      '## 上一轮快照',
      ctx.lastSnapshot || '（无）',
      '',
      '## 玩家行动（第一优先）',
      ctx.playerInput || '',
      '',
      ctx.history || '',
    ].join('\n');
  }

  function buildStatsPrompt(ctx) {
    return [
      '【角色：Stats】',
      STATS_PROMPT,
      '',
      '## set 白名单',
      Array.from(STATS_SET_ALLOW).join('\n'),
      '',
      '## add 白名单',
      Array.from(STATS_ADD_ALLOW).join('\n'),
      '',
      formatJsonBlock('锁定世界', ctx.world || {}),
      '## 当前数值摘要',
      ctx.summary || '',
      '',
      '## 玩家行动',
      ctx.playerInput || '',
      '',
      '## 本轮正文',
      (ctx.story && ctx.story.maintext) || '',
    ].join('\n');
  }

  function buildMetaPrompt(ctx) {
    return [
      '【角色：Meta】',
      META_PROMPT,
      '',
      '分类：' + BRANCH_CATEGORIES.join('、'),
      '',
      formatJsonBlock('锁定世界', ctx.world || {}),
      '## 时钟（写入 snapshot）',
      ctx.clock || '',
      '',
      '## 玩家行动',
      ctx.playerInput || '',
      '',
      '## 本轮正文',
      (ctx.story && ctx.story.maintext) || '',
    ].join('\n');
  }

  global.妹神官_llm = {
    BRANCH_CATEGORIES,
    PROMPTS: { WORLD_PROMPT, STORY_PROMPT, STATS_PROMPT, META_PROMPT },
    STATS_SET_ALLOW,
    STATS_ADD_ALLOW,
    getLocationNames,
    classifyAction,
    needsWorld,
    extractJsonObject,
    parseWorld,
    parseStats,
    parseMeta,
    parseStory,
    stripStoryLeaks,
    buildWorldPrompt,
    buildStoryPrompt,
    buildStatsPrompt,
    buildMetaPrompt,
  };
})(window);

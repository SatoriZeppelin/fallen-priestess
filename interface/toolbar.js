/**
 * 妹神官 GAL 舞台工具栏
 * 对外：window.妹神官_toolbar
 */
(function () {
  var locked = true;
  var hideTimer = null;
  var mounted = false;
  var layoutRaf = 0;
  var layoutRo = null;
  var resizeBound = false;
  var layoutReady = false;

  var ICONS = {
    lock:
      '<svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>',
    unlock:
      '<svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 7.5-1.8"></path></svg>',
    gear:
      '<svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7.07 7.07 0 0 0-1.63-.94l-.36-2.54A.48.48 0 0 0 14 2h-4a.48.48 0 0 0-.48.41l-.36 2.54c-.59.24-1.13.55-1.63.94l-2.39-.96a.49.49 0 0 0-.59.22L2.63 8.87a.49.49 0 0 0 .12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94L2.75 14.5a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.3.59.22l2.39-.96c.5.39 1.04.7 1.63.94l.36 2.54c.05.24.24.41.48.41h4c.24 0 .44-.17.48-.41l.36-2.54c.59-.24 1.13-.55 1.63-.94l2.39.96c.22.09.47 0 .59-.22l1.92-3.32a.49.49 0 0 0-.12-.61l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z"/></svg>',
    loop:
      '<svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>',
    tripleBack:
      '<svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 17 4 12 9 7"/><polyline points="15 17 10 12 15 7"/><polyline points="21 17 16 12 21 7"/></svg>',
    rewind:
      '<svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>',
    stepBack:
      '<svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
    log:
      '<svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><rect x="5" y="3" width="14" height="18" rx="2.5"/><rect x="7.5" y="7.2" width="9" height="1.7" rx="0.85" fill="#2a1e0e"/><rect x="7.5" y="11.15" width="9" height="1.7" rx="0.85" fill="#2a1e0e"/><rect x="7.5" y="15.1" width="9" height="1.7" rx="0.85" fill="#2a1e0e"/></svg>',
    stepFwd:
      '<svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
    fastFwd:
      '<svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 17 11 12 6 7"/><polyline points="13 17 18 12 13 7"/></svg>',
    autoFwd:
      '<svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 18 13 12 7 6"/><line x1="17" y1="5" x2="17" y2="19"/></svg>',
    quest:
      '<svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="8"/><line x1="12" y1="8" x2="6" y2="12"/><line x1="12" y1="8" x2="18" y2="12"/><line x1="6" y1="12" x2="6" y2="18"/><path d="M3 15 L6 18 L9 15"/><line x1="18" y1="12" x2="18" y2="18"/><path d="M15 15 L18 18 L21 15"/></svg>',
    heart:
      '<svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
  };

  function gal() {
    return window.妹神官_gal || {};
  }

  function toast(msg) {
    if (gal().toast) gal().toast(msg);
    else console.info('[toolbar]', msg);
  }

  function $(id) {
    return document.getElementById(id);
  }

  function mountIcon(id, key) {
    var btn = $(id);
    if (btn && ICONS[key]) btn.innerHTML = ICONS[key];
  }

  function mountAllIcons() {
    mountIcon('btn-gal-toolbar-settings', 'gear');
    mountIcon('btn-gal-toolbar-regen', 'loop');
    mountIcon('btn-gal-toolbar-prevround', 'tripleBack');
    mountIcon('btn-gal-toolbar-rewind', 'rewind');
    mountIcon('btn-gal-toolbar-back', 'stepBack');
    mountIcon('btn-gal-toolbar-log', 'log');
    mountIcon('btn-gal-toolbar-fwd', 'stepFwd');
    mountIcon('btn-gal-toolbar-fastfwd', 'fastFwd');
    mountIcon('btn-gal-toolbar-auto', 'autoFwd');
    mountIcon('btn-gal-toolbar-quest', 'quest');
    mountIcon('btn-gal-toolbar-hstatus', 'heart');
  }

  function clearHideTimer() {
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
  }

  function refreshLockUi() {
    var dock = $('gal-toolbar-dock');
    var btn = $('btn-gal-toolbar-lock');
    if (!dock || !btn) return;

    dock.hidden = false;
    dock.style.display = 'flex';
    clearHideTimer();
    dock.classList.remove('is-pinned-hover');
    mountAllIcons();

    if (locked) {
      dock.classList.add('is-locked');
      dock.classList.remove('is-auto-hide');
      btn.classList.add('is-on');
      btn.setAttribute('aria-pressed', 'true');
      btn.title = '锁定工具栏（点击解锁，离开后自动隐藏）';
      btn.innerHTML = ICONS.lock;
    } else {
      dock.classList.remove('is-locked');
      dock.classList.add('is-auto-hide');
      btn.classList.remove('is-on');
      btn.setAttribute('aria-pressed', 'false');
      btn.title = '解锁工具栏（点击锁定，保持常显）';
      btn.innerHTML = ICONS.unlock;
    }

    var autoBtn = $('btn-gal-toolbar-auto');
    if (autoBtn) {
      var on = !!(gal().isAuto && gal().isAuto());
      autoBtn.classList.toggle('is-on', on);
      autoBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    scheduleLayout();
  }

  function scheduleLayout() {
    if (layoutRaf) return;
    layoutRaf = requestAnimationFrame(function () {
      layoutRaf = 0;
      layoutDock();
    });
  }

  function rectsOverlap(a, b, pad) {
    if (!a || !b) return false;
    var g = pad || 0;
    return a.left < b.right + g && a.right > b.left - g && a.top < b.bottom + g && a.bottom > b.top - g;
  }

  function rowWidthOf(items, gap) {
    var w = 0;
    for (var i = 0; i < items.length; i++) {
      w += items[i]._w || 0;
      if (i) w += gap;
    }
    return w;
  }

  function layoutDock() {
    var dock = $('gal-toolbar-dock');
    var bar = $('gal-toolbar');
    var parchment = document.getElementById('game-parchment');
    if (!dock || !bar || !parchment) return;
    if (parchment.classList.contains('is-cg-hide-toolbar')) return;

    var dialogue = parchment.querySelector('.dialogue');
    var nameArea = parchment.querySelector('.dialogue-name-area');
    var pH = parchment.clientHeight;
    var pW = parchment.clientWidth;
    var rightPad = 16;
    var leftPad = 8;
    var gap = 2;
    var rowGap = 2;
    var availW = Math.max(80, pW - rightPad - leftPad);
    var buttons = Array.prototype.slice.call(bar.querySelectorAll('.gal-tb-btn'));
    if (!buttons.length) return;

    var textTop = dialogue ? dialogue.offsetTop : Math.round(pH * 0.8);
    dock.style.right = rightPad + 'px';
    dock.style.bottom = Math.max(0, pH - textTop) + 'px';
    dock.style.top = 'auto';
    dock.classList.remove('is-stacked', 'is-above-name');

    buttons.forEach(function (btn) {
      btn._w = btn.offsetWidth || 40;
      btn._h = btn.offsetHeight || 40;
    });
    var rowH = 40;
    for (var bi = 0; bi < buttons.length; bi++) {
      if (buttons[bi]._h > rowH) rowH = buttons[bi]._h;
    }
    rowH += rowGap;

    var nameBox = null;
    if (
      nameArea &&
      nameArea.offsetHeight > 0 &&
      getComputedStyle(nameArea).display !== 'none' &&
      getComputedStyle(nameArea).visibility !== 'hidden'
    ) {
      nameBox = {
        left: nameArea.offsetLeft,
        right: nameArea.offsetLeft + nameArea.offsetWidth,
        top: nameArea.offsetTop,
        bottom: nameArea.offsetTop + nameArea.offsetHeight,
      };
    }

    function rowBox(items, rowIndex) {
      var w = rowWidthOf(items, gap);
      var bottom = textTop - rowIndex * rowH;
      return {
        left: pW - rightPad - w,
        right: pW - rightPad,
        top: bottom - rowH,
        bottom: bottom,
        w: w,
      };
    }

    function rowBlocked(items, rowIndex) {
      if (!items.length) return false;
      var box = rowBox(items, rowIndex);
      if (box.w > availW + 0.5) return true;
      return !!(nameBox && rectsOverlap(box, nameBox, 2));
    }

    var rows = [buttons.slice()];
    var guard = 0;
    while (guard++ < 80) {
      var moved = false;
      for (var r = 0; r < rows.length; r++) {
        if (rows[r].length > 1 && rowBlocked(rows[r], r)) {
          var item = rows[r].pop();
          if (!rows[r + 1]) rows[r + 1] = [];
          rows[r + 1].unshift(item);
          moved = true;
          break;
        }
      }
      if (!moved) break;
    }

    var maxW = 0;
    for (var rr = 0; rr < rows.length; rr++) {
      var rw = rowWidthOf(rows[rr], gap);
      if (rw > maxW) maxW = rw;
      var acc = 0;
      for (var i = rows[rr].length - 1; i >= 0; i--) {
        var btn = rows[rr][i];
        btn.style.right = acc + 'px';
        btn.style.bottom = rr * rowH + 'px';
        acc += (btn._w || 40) + gap;
      }
    }

    bar.style.width = Math.max(maxW, 1) + 'px';
    bar.style.height = Math.max(rows.length * rowH, rowH) + 'px';
    bar.classList.toggle('is-stacked', rows.length > 1);
    bar.classList.add('is-laid-out');

    if (!layoutReady) {
      requestAnimationFrame(function () {
        bar.classList.add('is-anim');
        layoutReady = true;
      });
    }
  }

  function setLocked(v) {
    locked = !!v;
    refreshLockUi();
    if (gal().setToolbarLocked) gal().setToolbarLocked(locked);
  }

  function toggleLock() {
    setLocked(!locked);
  }

  function setGenerating(on, label) {
    var el = $('gal-generating');
    if (!el) return;
    var text = el.querySelector('.gal-gen-label');
    if (text) text.textContent = label || '正在生成正文';
    if (on) {
      el.removeAttribute('hidden');
      el.classList.add('is-on');
    } else {
      el.classList.remove('is-on');
      el.setAttribute('hidden', '');
    }
  }

  function onToolbarClick(e) {
    e.stopPropagation();
    var btn = e.target && e.target.closest ? e.target.closest('[data-gal-tb]') : null;
    if (!btn || btn.disabled) return;
    var act = btn.getAttribute('data-gal-tb');
    var api = gal();
    if (act === 'lock') toggleLock();
    else if (act === 'save') {
      if (api.openSave) api.openSave();
      else toast('存档界面未就绪');
    } else if (act === 'regen') {
      if (api.regenerateCurrentRound) api.regenerateCurrentRound();
      else toast('重新生成未就绪');
    } else if (act === 'settings') {
      if (api.openSettings) api.openSettings();
      else toast('设置界面未就绪');
    } else if (act === 'prevround') {
      if (api.rewindPrevRound) api.rewindPrevRound();
      else toast('上一轮功能未就绪');
    } else if (act === 'rewind') {
      if (api.rewind) api.rewind();
    } else if (act === 'back') {
      if (api.prev) api.prev();
    } else if (act === 'log') {
      if (api.openLog) api.openLog();
      else toast('历史未就绪');
    } else if (act === 'fwd') {
      if (api.stopAuto) api.stopAuto();
      if (api.next) api.next();
      refreshLockUi();
    } else if (act === 'fastfwd') {
      if (api.skipToChoices) api.skipToChoices();
      else toast('快进不可用');
      refreshLockUi();
    } else if (act === 'auto') {
      if (api.toggleAuto) api.toggleAuto();
      refreshLockUi();
    } else if (act === 'quest') {
      if (api.openBranches) api.openBranches();
      else if (api.openLog) api.openLog();
      else toast('行动选项未就绪');
    } else if (act === 'hstatus') {
      if (api.openHstatus) api.openHstatus();
      else toast('Hstatus 未就绪');
    }
  }

  function bindDock(dock, bar) {
    dock.addEventListener('click', function (e) {
      e.stopPropagation();
    });
    dock.addEventListener('pointerdown', function (e) {
      e.stopPropagation();
    });
    dock.addEventListener('pointerenter', function () {
      if (locked) return;
      clearHideTimer();
      dock.classList.add('is-pinned-hover');
    });
    dock.addEventListener('pointerleave', function () {
      if (locked) return;
      clearHideTimer();
      hideTimer = setTimeout(function () {
        dock.classList.remove('is-pinned-hover');
        hideTimer = null;
      }, 280);
    });
    bar.addEventListener('click', onToolbarClick);
  }

  function buildDom() {
    var gen = document.createElement('div');
    gen.id = 'gal-generating';
    gen.className = 'gal-generating';
    gen.setAttribute('hidden', '');
    gen.setAttribute('aria-live', 'polite');
    gen.innerHTML = '<span class="gal-gen-spinner" aria-hidden="true"></span><span class="gal-gen-label">正在生成正文</span>';

    var dock = document.createElement('div');
    dock.id = 'gal-toolbar-dock';
    dock.className = 'is-locked';
    dock.setAttribute('aria-label', '游戏工具栏');
    dock.innerHTML =
      '<div id="gal-toolbar">' +
      '<div class="gal-tb-meta" aria-label="存档与设置">' +
      '<button type="button" class="gal-tb-btn is-on" id="btn-gal-toolbar-lock" data-gal-tb="lock" title="锁定工具栏" aria-pressed="true"></button>' +
      '<button type="button" class="gal-tb-btn gal-tb-text" id="btn-gal-toolbar-save" data-gal-tb="save" title="存档">SAVE</button>' +
      '<button type="button" class="gal-tb-btn" id="btn-gal-toolbar-regen" data-gal-tb="regen" title="重新生成本轮"></button>' +
      '<button type="button" class="gal-tb-btn" id="btn-gal-toolbar-settings" data-gal-tb="settings" title="设置"></button>' +
      '<button type="button" class="gal-tb-btn" id="btn-gal-toolbar-quest" data-gal-tb="quest" title="选择分支"></button>' +
      '<button type="button" class="gal-tb-btn" id="btn-gal-toolbar-hstatus" data-gal-tb="hstatus" title="Hstatus"></button>' +
      '</div>' +
      '<div class="gal-tb-nav" aria-label="播放控制">' +
      '<button type="button" class="gal-tb-btn" id="btn-gal-toolbar-prevround" data-gal-tb="prevround" title="回到上一轮开头"></button>' +
      '<button type="button" class="gal-tb-btn" id="btn-gal-toolbar-rewind" data-gal-tb="rewind" title="快退到本轮开头"></button>' +
      '<button type="button" class="gal-tb-btn" id="btn-gal-toolbar-back" data-gal-tb="back" title="后退一句"></button>' +
      '<button type="button" class="gal-tb-btn" id="btn-gal-toolbar-log" data-gal-tb="log" title="历史对话"></button>' +
      '<button type="button" class="gal-tb-btn" id="btn-gal-toolbar-fwd" data-gal-tb="fwd" title="前进一句"></button>' +
      '<button type="button" class="gal-tb-btn" id="btn-gal-toolbar-fastfwd" data-gal-tb="fastfwd" title="快进到本轮选项"></button>' +
      '<button type="button" class="gal-tb-btn" id="btn-gal-toolbar-auto" data-gal-tb="auto" title="自动前进" aria-pressed="false"></button>' +
      '</div></div>';
    return { gen: gen, dock: dock };
  }

  function bindLayout(parchment) {
    if (window.ResizeObserver) {
      if (layoutRo) layoutRo.disconnect();
      layoutRo = new ResizeObserver(scheduleLayout);
      layoutRo.observe(parchment);
      var nameArea = parchment.querySelector('.dialogue-name-area');
      var dialogue = parchment.querySelector('.dialogue');
      if (nameArea) layoutRo.observe(nameArea);
      if (dialogue) layoutRo.observe(dialogue);
    }
    if (!resizeBound) {
      resizeBound = true;
      window.addEventListener('resize', scheduleLayout);
    }
  }

  function mount(host) {
    if (!host) return;
    var parchment = host.classList && host.classList.contains('parchment') ? host : document.getElementById('game-parchment') || host;
    var dockEl = $('gal-toolbar-dock');
    if (mounted && dockEl && dockEl.parentElement === parchment) {
      refreshLockUi();
      return;
    }
    layoutReady = false;
    document.getElementById('gal-toolbar-dock')?.remove();
    document.getElementById('gal-generating')?.remove();
    var nodes = buildDom();
    parchment.appendChild(nodes.gen);
    parchment.appendChild(nodes.dock);
    bindDock(nodes.dock, nodes.dock.querySelector('#gal-toolbar'));
    bindLayout(parchment);
    if (gal().getToolbarLocked) locked = gal().getToolbarLocked() !== false;
    mounted = true;
    refreshLockUi();
  }

  window.妹神官_toolbar = {
    mount: mount,
    setLocked: function (v) {
      locked = !!v;
      refreshLockUi();
    },
    isLocked: function () {
      return locked;
    },
    refresh: refreshLockUi,
    layout: scheduleLayout,
    setGenerating: setGenerating,
  };
})();

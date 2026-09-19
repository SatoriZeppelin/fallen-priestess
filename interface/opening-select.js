/**
 * 开局选择：环状轮播（参考 Larimar）
 * 对外：window.妹神官_opening_select
 */
(function () {
  var SIDE = 2;
  var selectedIndex = 0;
  var dragOffset = 0;
  var drag = null;
  var layoutRaf = 0;
  var suppressClickUntil = 0;

  var ROUTES = [
    {
      id: 'love',
      title: '纯爱路线',
      subtitle: '禁用所有 NTR，与归来的妹妹重逢日常',
      desc:
        '托莉娜，{{user}}的妹妹，尽管没有任何血缘关系，却是{{user}}最重要而且唯一剩下的亲人。\n' +
        '久别两年，从寄宿学校归来的她成为了见习神官，让人松一口气地温驯且献身的性格依旧不变，她还是那个{{user}}熟悉的可爱妹妹。\n' +
        '本以为能与可爱的妹妹回归日常，二人却一同发现了她身体中流淌着魅魔血脉一事——\n' +
        '根据ASMR改编，本开局将完全禁用所有NTR机制，享受和妹妹生活吧',
      cover: 'https://files.catbox.moe/wcejcp.jpg',
    },
    {
      id: 'game',
      title: '游戏路线',
      subtitle: '启用全部 NTR，在旅途中守护她',
      desc:
        '托莉娜的疾病刻不容缓，二人踏上了斩杀魔王的旅途。\n' +
        '托莉娜的魅魔化会随时间加深，她的『魔力需求』——对男性精气的需求也会愈加强烈\n' +
        '{{user}}有限的『体力』是要用来满足妹妹的需求，还是用於攻略地城，尽快拯救妹妹？\n' +
        '无论哥哥作出何样的选择，善解人意的托莉娜也肯定会表示理解的\n' +
        '在旅途的最后，两人还能恢复以往的兄妹关系吗，亦或者……？一切的结局，都取决于你的一念之间。\n' +
        '根据游戏改编，本开局将启用所有NTR机制，保护好她吧',
      cover: 'https://files.catbox.moe/s0how3.jpg',
    },
  ];

  function $(id) {
    return document.getElementById(id);
  }

  function list() {
    return ROUTES;
  }

  function isOpen() {
    var el = $('opening-panel');
    return !!(el && el.classList.contains('open'));
  }

  function mod(i, n) {
    if (n <= 0) return 0;
    return ((i % n) + n) % n;
  }

  function stepPx() {
    var panel = $('opening-panel');
    var track = $('opening-track');
    var gap = 28;
    if (panel) {
      gap = parseFloat(window.getComputedStyle(panel).getPropertyValue('--opening-gap')) || gap;
    }
    var first = track && track.querySelector('.opening-card-wrap');
    var w = first && first.offsetWidth ? first.offsetWidth : 0;
    if (!w) w = 300;
    return w + gap;
  }

  function toRoman(n) {
    var v = Math.max(1, Math.floor(Number(n) || 1));
    var table = [
      [1000, 'M'],
      [900, 'CM'],
      [500, 'D'],
      [400, 'CD'],
      [100, 'C'],
      [90, 'XC'],
      [50, 'L'],
      [40, 'XL'],
      [10, 'X'],
      [9, 'IX'],
      [5, 'V'],
      [4, 'IV'],
      [1, 'I'],
    ];
    var out = '';
    for (var i = 0; i < table.length; i++) {
      while (v >= table[i][0]) {
        out += table[i][1];
        v -= table[i][0];
      }
    }
    return out || 'I';
  }

  function updateChrome() {
    var items = list();
    var idx = drag ? nearestIndex() : selectedIndex;
    var op = items[idx];
    var caption = $('opening-caption');
    if (caption) caption.textContent = op ? op.title : '暂无可用开局';

    var dots = $('opening-dots');
    if (dots) {
      var existing = dots.querySelectorAll('.opening-dot');
      if (existing.length !== items.length) {
        dots.innerHTML = '';
        items.forEach(function (_, i) {
          var d = document.createElement('button');
          d.type = 'button';
          d.className = 'opening-dot' + (i === idx ? ' is-on' : '');
          d.setAttribute('aria-label', '开局 ' + (i + 1));
          d.dataset.index = String(i);
          dots.appendChild(d);
        });
      } else {
        existing.forEach(function (d, i) {
          d.classList.toggle('is-on', i === idx);
        });
      }
    }

    var prev = $('btn-opening-prev');
    var next = $('btn-opening-next');
    var multi = items.length > 1;
    if (prev) {
      prev.disabled = !multi;
      prev.hidden = !multi;
    }
    if (next) {
      next.disabled = !multi;
      next.hidden = !multi;
    }
  }

  function floatDelta(i, center, n) {
    if (n <= 0) return 0;
    var c = ((center % n) + n) % n;
    var d = i - c;
    while (d > n / 2) d -= n;
    while (d < -n / 2) d += n;
    return d;
  }

  var GAP_DECAY = 0.62;

  function compressedX(d, step) {
    var sign = d < 0 ? -1 : d > 0 ? 1 : 0;
    if (!sign) return 0;
    var ad = Math.abs(d);
    var x = 0;
    var slot = 0;
    while (slot + 1 <= ad) {
      slot++;
      x += step * Math.pow(GAP_DECAY, slot - 1);
    }
    var rem = ad - slot;
    if (rem > 0) x += step * Math.pow(GAP_DECAY, slot) * rem;
    return sign * x;
  }

  function cardScale(ad) {
    if (ad < 0.12) return 1;
    return Math.max(0.52, 1 - ad * 0.22);
  }

  function visualCenter() {
    return selectedIndex + dragOffset;
  }

  function nearestIndex() {
    return mod(Math.round(visualCenter()), list().length);
  }

  function layoutRing(animate) {
    var track = $('opening-track');
    if (!track) return;
    var items = list();
    var n = items.length;
    var step = stepPx();
    var center = visualCenter();
    var wraps = track.querySelectorAll('.opening-card-wrap');
    var dragging = !!drag;

    wraps.forEach(function (wrap) {
      var i = Number(wrap.dataset.index);
      var card = wrap.querySelector('.opening-card');
      var d = floatDelta(i, center, n);
      var ad = Math.abs(d);
      var visible = ad <= SIDE + 0.55;
      var x = compressedX(d, step);
      var scale = cardScale(ad);

      wrap.style.transition = !animate || dragging ? 'none' : '';

      if (!visible) {
        wrap.style.opacity = '0';
        wrap.style.pointerEvents = 'none';
        wrap.style.transform =
          'translate(-50%, -50%) translateX(' + x + 'px) scale(' + scale + ')';
        wrap.style.zIndex = '0';
        if (card) {
          card.classList.remove('is-selected');
          card.setAttribute('aria-selected', 'false');
        }
        return;
      }

      wrap.style.opacity = String(Math.max(0.16, 1 - ad * 0.36));
      wrap.style.pointerEvents = ad < 0.55 ? 'auto' : 'none';
      wrap.style.transform =
        'translate(-50%, -50%) translateX(' + x + 'px) scale(' + scale + ')';
      wrap.style.zIndex = String(Math.round(20 - ad * 4));

      if (card) {
        var selected = Math.abs(d) < 0.35;
        card.classList.toggle('is-selected', selected);
        card.setAttribute('aria-selected', selected ? 'true' : 'false');
      }
    });
  }

  function scheduleLayout(animate) {
    if (layoutRaf) cancelAnimationFrame(layoutRaf);
    layoutRaf = requestAnimationFrame(function () {
      layoutRaf = 0;
      layoutRing(animate !== false);
    });
  }

  function selectIndex(i, opts) {
    var n = list().length;
    selectedIndex = mod(i, n);
    dragOffset = 0;
    updateChrome();
    layoutRing(!(opts && opts.instant));
  }

  function settleTo(target) {
    var n = list().length;
    var center = visualCenter();
    target = mod(target, n);
    selectedIndex = target;
    dragOffset = center - target;
    layoutRing(false);
    updateChrome();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        dragOffset = 0;
        layoutRing(true);
      });
    });
  }

  function stepBy(dir) {
    selectIndex(selectedIndex + dir);
  }

  function buildCards() {
    var track = $('opening-track');
    if (!track) return;
    track.innerHTML = '';
    list().forEach(function (op, i) {
      var wrap = document.createElement('div');
      wrap.className = 'opening-card-wrap';
      wrap.dataset.index = String(i);
      wrap.setAttribute('role', 'option');

      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'opening-card';
      card.dataset.index = String(i);
      card.setAttribute('aria-label', op.title);

      var frame = document.createElement('div');
      frame.className = 'opening-card-frame';
      frame.setAttribute('aria-hidden', 'true');

      var roman = document.createElement('div');
      roman.className = 'opening-card-roman';
      roman.textContent = toRoman(i + 1);

      var windowEl = document.createElement('div');
      windowEl.className = 'opening-card-window';

      var face = document.createElement('div');
      face.className = 'opening-card-face';
      if (op.cover) face.style.backgroundImage = 'url("' + op.cover + '")';

      var label = document.createElement('div');
      label.className = 'opening-card-label';
      label.textContent = op.title;

      windowEl.appendChild(face);
      windowEl.appendChild(label);
      frame.appendChild(roman);
      frame.appendChild(windowEl);
      card.appendChild(frame);
      wrap.appendChild(card);
      track.appendChild(wrap);
    });
    updateChrome();
    layoutRing(false);
  }

  function open() {
    var panel = $('opening-panel');
    if (!panel) return;
    selectedIndex = 0;
    dragOffset = 0;
    panel.classList.remove('open');
    buildCards();
    panel.removeAttribute('inert');
    panel.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function () {
      layoutRing(false);
      panel.classList.add('open');
    });
  }

  function close(opts) {
    var panel = $('opening-panel');
    if (!panel) return;
    var ae = document.activeElement;
    if (ae && panel.contains(ae) && typeof ae.blur === 'function') ae.blur();
    drag = null;
    dragOffset = 0;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    panel.setAttribute('inert', '');
    if (!opts || !opts.silent) {
      if (typeof window.妹神官_onOpeningClosed === 'function') {
        window.妹神官_onOpeningClosed();
      }
    }
  }

  function confirmSelected() {
    var op = list()[selectedIndex];
    if (!op) return;
    close({ silent: true });
    if (typeof window.妹神官_onOpeningPicked === 'function') {
      window.妹神官_onOpeningPicked(op.id);
    }
  }

  function bind() {
    var prev = $('btn-opening-prev');
    var next = $('btn-opening-next');
    var confirm = $('btn-opening-confirm');
    var closeBtn = $('btn-opening-close');
    var track = $('opening-track');
    var viewport = $('opening-viewport');
    var dots = $('opening-dots');

    if (prev) prev.addEventListener('click', function () { stepBy(-1); });
    if (next) next.addEventListener('click', function () { stepBy(1); });
    if (confirm) confirm.addEventListener('click', confirmSelected);
    if (closeBtn) closeBtn.addEventListener('click', function () { close(); });

    if (track) {
      track.addEventListener('click', function (e) {
        if (Date.now() < suppressClickUntil) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        if (drag && drag.moved) return;
        var card = e.target && e.target.closest ? e.target.closest('.opening-card') : null;
        if (!card) return;
        selectIndex(Number(card.dataset.index));
      });
    }

    if (dots) {
      dots.addEventListener('click', function (e) {
        var d = e.target && e.target.closest ? e.target.closest('.opening-dot') : null;
        if (!d) return;
        selectIndex(Number(d.dataset.index));
      });
    }

    if (viewport) {
      viewport.addEventListener(
        'pointerdown',
        function (e) {
          if (e.pointerType === 'mouse' && e.button !== 0) return;
          if (e.target && e.target.closest) {
            if (e.target.closest('.opening-nav, .opening-confirm, .opening-dot, .opening-close')) {
              return;
            }
          }
          if (layoutRaf) {
            cancelAnimationFrame(layoutRaf);
            layoutRaf = 0;
          }
          drag = {
            id: e.pointerId,
            x: e.clientX,
            startIndex: selectedIndex,
            moved: false,
            lastX: e.clientX,
            lastT: performance.now(),
            vx: 0,
            lastNearest: selectedIndex,
          };
          dragOffset = 0;
          layoutRing(false);
          try {
            viewport.setPointerCapture(e.pointerId);
          } catch (err) {}
        },
        { passive: true },
      );

      viewport.addEventListener(
        'pointermove',
        function (e) {
          if (!drag || drag.id !== e.pointerId) return;
          var now = performance.now();
          var dt = Math.max(1, now - drag.lastT);
          drag.vx = (e.clientX - drag.lastX) / dt;
          drag.lastX = e.clientX;
          drag.lastT = now;
          var dx = e.clientX - drag.x;
          if (Math.abs(dx) > 6) drag.moved = true;
          dragOffset = -dx / stepPx();
          var near = nearestIndex();
          if (near !== drag.lastNearest) {
            drag.lastNearest = near;
            updateChrome();
          }
          scheduleLayout(false);
        },
        { passive: true },
      );

      function endDrag(e) {
        if (!drag || (e && drag.id !== e.pointerId)) return;
        var moved = drag.moved;
        var startIndex = drag.startIndex;
        var vx = drag.vx || 0;
        var target = nearestIndex();
        if (moved && target === startIndex) {
          if (dragOffset > 0.18 || -vx > 0.45) target = startIndex + 1;
          else if (dragOffset < -0.18 || vx > 0.45) target = startIndex - 1;
        }
        drag = null;
        if (!moved) {
          dragOffset = 0;
          updateChrome();
          layoutRing(true);
          return;
        }
        suppressClickUntil = Date.now() + 450;
        settleTo(target);
      }

      viewport.addEventListener('pointerup', endDrag);
      viewport.addEventListener('pointercancel', endDrag);
      window.addEventListener('resize', function () {
        if (isOpen()) layoutRing(false);
      });
    }
  }

  window.妹神官_opening_select = {
    open: open,
    close: close,
    isOpen: isOpen,
    bind: bind,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();

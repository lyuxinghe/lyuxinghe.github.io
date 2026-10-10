(function () {
  'use strict';

  var narrow = window.matchMedia('(max-width: 767px)');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('[data-card-deck]').forEach(function (deck) {
    var rows = Array.from(deck.querySelectorAll('.card-deck-fan')).map(function (fan) {
      return { fan: fan, cards: Array.from(fan.querySelectorAll('[data-deck-card]')) };
    });
    var cards = Array.from(deck.querySelectorAll('[data-deck-card]'));
    var panels = Array.from(deck.querySelectorAll('[data-deck-panel]'));
    var details = deck.querySelector('.card-deck-details');
    if (!details || !cards.length || cards.length !== panels.length) return;
    var motionDuration = parseFloat(getComputedStyle(deck).getPropertyValue('--card-motion-duration')) || 650;

    var current = null;
    var pinned = null;
    var focusedCard;
    var hoverTimer;
    var closeTimer;
    var pointerOverCard = false;
    var hoverOrigin = null;
    var keyboardWithin = false;
    var ignoreFocus = false;
    var dismissedCard = null;
    var movingUntil = 0;
    var visiblePanels = new Set();
    var detailAnimations = [];
    var detailsReady = false;
    var latest = cards.find(function (card) { return card.dataset.latest === 'true'; }) || cards[cards.length - 1];

    function updateMedia() {
      panels.forEach(function (panel) {
        panel.querySelectorAll('video').forEach(function (video) {
          var shouldPlay = panel.classList.contains('is-active') && visiblePanels.has(panel) && !document.hidden && !reducedMotion.matches;
          if (shouldPlay) {
            var playing = video.play();
            if (playing) playing.catch(function () { /* Native controls remain available. */ });
          } else {
            video.pause();
          }
        });
      });
    }

    function revealCard(card, animate) {
      if (!narrow.matches) return;
      var fan = card.closest('.card-deck-fan');
      fan.scrollTo({ left: card.offsetLeft - (fan.clientWidth - card.offsetWidth) / 2, behavior: animate && !reducedMotion.matches ? 'smooth' : 'auto' });
    }

    function animatePin(card, adding) {
      var pin = card.querySelector('.archive-card-pin');
      if (!pin || !pin.animate) return;
      pin.getAnimations().forEach(function (animation) { animation.cancel(); });
      if (reducedMotion.matches) return;
      var frames = adding ? [
        { opacity: 0, transform: 'translateY(-12px) scale(1.3)', filter: 'blur(1px)', offset: 0 },
        { opacity: 1, transform: 'translateY(1px) scale(.94)', filter: 'blur(0)', offset: .65 },
        { opacity: 1, transform: 'translateY(-1px) scale(1.03)', offset: .82 },
        { opacity: 1, transform: 'translateY(0) scale(1)', offset: 1 }
      ] : [
        { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0)', offset: 0 },
        { opacity: 1, transform: 'translateY(-3px) scale(1.06)', offset: .35 },
        { opacity: 0, transform: 'translateY(-10px) scale(1.2)', filter: 'blur(.5px)', offset: 1 }
      ];
      pin.animate(frames, { duration: adding ? 560 : 400, easing: 'cubic-bezier(.22,.8,.24,1)' });
    }

    function finishDetailMotion() {
      detailAnimations.forEach(function (animation) {
        animation.onfinish = null;
        animation.cancel();
      });
      detailAnimations = [];
      details.style.height = '';
      details.classList.remove('is-transitioning');
      panels.forEach(function (panel) { panel.classList.remove('is-leaving'); });
    }

    function detailFrame(panel) {
      var style = getComputedStyle(panel);
      return { opacity: style.opacity, transform: style.transform, clipPath: style.clipPath === 'none' ? 'inset(0 0 0% 0)' : style.clipPath };
    }

    function updateDetails(card) {
      var next = card && panels.find(function (panel) { return panel.id === card.getAttribute('aria-controls'); });
      var previous = panels.find(function (panel) { return panel.classList.contains('is-active'); }) ||
        panels.find(function (panel) { return panel.classList.contains('is-leaving'); });
      var fromHeight = details.getBoundingClientRect().height;
      var previousFrame = previous && detailFrame(previous);
      var nextFrame = next && (next.classList.contains('is-active') || next.classList.contains('is-leaving')) && detailFrame(next);
      var canAnimate = detailsReady && !reducedMotion.matches && Boolean(details.animate);
      finishDetailMotion();
      panels.forEach(function (panel) {
        var active = panel === next;
        panel.classList.toggle('is-active', active);
        panel.classList.toggle('is-leaving', canAnimate && panel === previous && panel !== next);
        panel.setAttribute('aria-hidden', String(!active));
        panel.inert = !active;
      });
      if (next) {
        var cardBox = card.getBoundingClientRect();
        var detailBox = details.getBoundingClientRect();
        var origin = Math.max(0, Math.min(100, (cardBox.left + cardBox.width / 2 - detailBox.left) / Math.max(1, detailBox.width) * 100));
        next.style.setProperty('--detail-origin', origin + '%');
      }
      if (!canAnimate || (!previous && !next)) return;

      var folded = { opacity: 0, transform: 'perspective(900px) translateY(-28px) rotateX(-8deg) scale(.96, .92)', clipPath: 'inset(0 0 96% 0)' };
      var unfolded = { opacity: 1, transform: 'perspective(900px) translateY(0) rotateX(0deg) scale(1)', clipPath: 'inset(0 0 0% 0)' };
      var duration = next ? motionDuration : Math.round(motionDuration * .8);
      var toHeight = next ? next.offsetHeight : 0;
      var easing = 'cubic-bezier(.22,.8,.24,1)';
      details.style.height = fromHeight + 'px';
      details.classList.add('is-transitioning');
      if (previous && previous !== next) {
        detailAnimations.push(previous.animate([previousFrame, folded], {
          duration: next ? Math.round(duration * .55) : duration,
          easing: 'cubic-bezier(.4,0,.6,1)', fill: 'both'
        }));
      }
      if (next) {
        detailAnimations.push(next.animate([nextFrame || folded, unfolded], {
          duration: duration, easing: easing, fill: 'both'
        }));
      }
      var space = details.animate([{ height: fromHeight + 'px' }, { height: toHeight + 'px' }], {
        duration: duration, easing: easing, fill: 'both'
      });
      detailAnimations.push(space);
      space.onfinish = finishDetailMotion;
    }

    function select(card, animate) {
      window.clearTimeout(hoverTimer);
      hoverTimer = null;
      var changed = card !== current;
      var wasCompact = deck.classList.contains('is-open');
      current = card;
      if (!card || pinned) hoverOrigin = null;
      deck.classList.toggle('is-open', Boolean(card));
      deck.classList.toggle('has-pinned-card', Boolean(pinned));
      if (wasCompact !== Boolean(card)) movingUntil = Date.now() + (reducedMotion.matches ? 0 : motionDuration);
      cards.forEach(function (item) {
        var selected = item === card;
        var pinChanged = item.classList.contains('is-pinned') !== (item === pinned);
        item.setAttribute('aria-expanded', String(selected));
        item.setAttribute('aria-pressed', String(item === pinned));
        item.classList.toggle('is-pinned', item === pinned);
        if (pinChanged) animatePin(item, item === pinned);
        item.tabIndex = item === (focusedCard || card || latest) ? 0 : -1;
      });
      if (changed || !detailsReady) updateDetails(card);
      detailsReady = true;
      layout();
      if (card && changed) revealCard(card, animate);
      updateMedia();
    }

    function layout() {
      rows.forEach(function (row) { row.fan.style.setProperty('--card-count', row.cards.length); });
      rows.forEach(function (row) {
        var width = row.fan.clientWidth;
        var count = row.cards.length;
        var fullWidth = narrow.matches ? Math.min(270, window.innerWidth * 0.78) : count > 4 ? Math.max(155, Math.min(180, (width - 160) / (1 + (count - 1) * 0.8))) : Math.min(270, (width - 140) / (1 + (count - 1) * 0.88));
        var compactWidth = narrow.matches ? Math.min(160, (width - 24 - (count - 1) * 8) / count) : Math.min(160, (width - 60) / count - 12);
        var cardWidth = current ? compactWidth : fullWidth;
        row.fan.style.setProperty('--card-width', cardWidth + 'px');
        row.fan.style.setProperty('--card-scale', String(cardWidth / fullWidth));
        if (narrow.matches) {
          revealCard(row.cards.indexOf(current) !== -1 ? current : row.cards[row.cards.length - 1], false);
          return;
        }
        var step = current ? cardWidth + 12 : count > 4 ? Math.min(cardWidth * 0.8, (width - cardWidth - 150) / (count - 1)) : cardWidth * 0.88;
        var middle = (count - 1) / 2;
        row.cards.forEach(function (card, index) {
          var offset = index - middle;
          card.style.setProperty('--card-left', (width / 2 + offset * step) + 'px');
          card.style.setProperty('--card-layer', String(index + 1));
        });
      });
    }

    var tablist = deck.querySelector('[data-deck-tabs]') || rows[0].fan;
    tablist.setAttribute('role', 'toolbar');
    if (rows.length > 1) rows.forEach(function (row) { row.fan.setAttribute('role', 'group'); });
    panels.forEach(function (panel) { panel.setAttribute('role', 'region'); panel.tabIndex = 0; });

    function closePreview() {
      window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(function () {
        if (!pinned && !pointerOverCard && !hoverOrigin && !keyboardWithin) select(null, false);
      }, 220);
    }

    function preview(card) {
      if (pinned || dismissedCard === card || current === card || Date.now() < movingUntil) return;
      window.clearTimeout(hoverTimer);
      hoverTimer = window.setTimeout(function () {
        hoverTimer = null;
        // Do not replace content while a keyboard user is reading its links.
        if (!pinned && !panels.some(function (panel) { return panel.contains(document.activeElement); })) {
          if (!current) hoverOrigin = card.getBoundingClientRect();
          select(card, true);
        }
      }, 140);
    }

    // Keep a route to the smaller card when shrinking moves it away from the pointer.
    document.addEventListener('pointermove', function (event) {
      if (event.pointerType !== 'mouse' || !hoverOrigin || !current || pinned) return;
      if (Date.now() >= movingUntil && cards.some(function (card) { return card.matches(':hover'); })) {
        hoverOrigin = null;
        return;
      }
      var target = current.getBoundingClientRect();
      var withinRoute = event.clientX >= Math.min(hoverOrigin.left, target.left) &&
        event.clientX <= Math.max(hoverOrigin.right, target.right) &&
        event.clientY >= Math.min(hoverOrigin.top, target.top) &&
        event.clientY <= Math.max(hoverOrigin.bottom, target.bottom);
      if (!withinRoute) {
        hoverOrigin = null;
        closePreview();
      }
    });

    deck.addEventListener('pointerleave', function (event) {
      if (event.pointerType !== 'mouse') return;
      pointerOverCard = false;
      hoverOrigin = null;
      window.clearTimeout(hoverTimer);
      hoverTimer = null;
      closePreview();
    });
    deck.addEventListener('pointerdown', function () { keyboardWithin = false; });
    deck.addEventListener('focusin', function (event) {
      if (event.target.matches(':focus-visible')) keyboardWithin = true;
      window.clearTimeout(closeTimer);
    });
    deck.addEventListener('focusout', function () {
      window.setTimeout(function () {
        if (!deck.contains(document.activeElement)) {
          keyboardWithin = false;
          closePreview();
        }
      }, 0);
    });
    deck.addEventListener('keydown', function (event) {
      keyboardWithin = true;
      if (event.key !== 'Escape' || !current) return;
      event.preventDefault();
      var previous = current;
      pinned = null;
      dismissedCard = previous;
      ignoreFocus = true;
      previous.focus({ preventScroll: true });
      ignoreFocus = false;
      select(null, false);
    });
    cards.forEach(function (card, index) {
      card.addEventListener('click', function () {
        window.clearTimeout(closeTimer);
        if (pinned === card) {
          pinned = null;
          dismissedCard = null;
          select(pointerOverCard || keyboardWithin ? card : null, false);
        } else {
          pinned = card;
          dismissedCard = null;
          select(card, true);
        }
      });
      card.addEventListener('focus', function () {
        focusedCard = card;
        cards.forEach(function (item) { item.tabIndex = item === card ? 0 : -1; });
        if (!ignoreFocus && !pinned && card.matches(':focus-visible')) {
          keyboardWithin = true;
          select(card, true);
        }
      });
      card.addEventListener('pointerenter', function (event) {
        if (event.pointerType !== 'mouse') return;
        pointerOverCard = true;
        if (Date.now() >= movingUntil) hoverOrigin = null;
        window.clearTimeout(closeTimer);
        if (!panels.some(function (panel) { return panel.contains(document.activeElement); })) keyboardWithin = false;
        preview(card);
      });
      card.addEventListener('pointermove', function (event) {
        if (event.pointerType === 'mouse' && !hoverTimer) preview(card);
      });
      card.addEventListener('pointerleave', function (event) {
        if (event.pointerType !== 'mouse') return;
        pointerOverCard = false;
        window.clearTimeout(hoverTimer);
        hoverTimer = null;
        if (dismissedCard === card) dismissedCard = null;
        closePreview();
      });
      card.addEventListener('keydown', function (event) {
        var next;
        if (event.key === 'ArrowRight') next = (index + 1) % cards.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + cards.length) % cards.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = cards.length - 1;
        if (next !== undefined) { event.preventDefault(); cards[next].focus(); }
      });
    });

    deck.classList.add('is-enhanced');
    select(null, false);

    if ('ResizeObserver' in window) {
      var layoutObserver = new ResizeObserver(layout);
      rows.forEach(function (row) { layoutObserver.observe(row.fan); });
    } else window.addEventListener('resize', layout);
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) visiblePanels.add(entry.target);
          else visiblePanels.delete(entry.target);
        });
        updateMedia();
      });
      panels.forEach(function (panel) { observer.observe(panel); });
    }
    document.addEventListener('visibilitychange', updateMedia);
    reducedMotion.addEventListener('change', function () {
      updateMedia();
      if (reducedMotion.matches) {
        finishDetailMotion();
        deck.querySelectorAll('.archive-card-pin').forEach(function (element) {
          if (element.getAnimations) element.getAnimations().forEach(function (animation) { animation.cancel(); });
        });
      }
    });
  });
}());

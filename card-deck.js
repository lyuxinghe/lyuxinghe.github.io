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
    if (!cards.length || cards.length !== panels.length) return;

    var current;
    var hoverTimer;
    var visiblePanels = new Set();
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

    function select(card, animate) {
      window.clearTimeout(hoverTimer);
      if (card === current) return;
      current = card;
      cards.forEach(function (item) {
        var selected = item === card;
        item.setAttribute('aria-selected', String(selected));
        item.tabIndex = selected ? 0 : -1;
      });
      panels.forEach(function (panel) {
        var active = panel.id === card.getAttribute('aria-controls');
        panel.classList.toggle('is-active', active);
        panel.setAttribute('aria-hidden', String(!active));
        panel.inert = !active;
        if (active && animate && !reducedMotion.matches && panel.animate) {
          panel.getAnimations().forEach(function (animation) { animation.cancel(); });
          panel.animate([{ opacity: 0.4, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 300, easing: 'cubic-bezier(.2,.8,.2,1)' });
        }
      });
      revealCard(card, animate);
      updateMedia();
    }

    function layout() {
      if (narrow.matches) {
        rows.forEach(function (row) {
          revealCard(row.cards.indexOf(current) !== -1 ? current : row.cards[row.cards.length - 1], false);
        });
        return;
      }
      rows.forEach(function (row) {
        var width = row.fan.clientWidth;
        var count = row.cards.length;
        var cardWidth = count > 4 ? Math.max(155, Math.min(180, (width - 160) / (1 + (count - 1) * 0.8))) : Math.min(270, (width - 140) / (1 + (count - 1) * 0.88));
        var step = count > 4 ? Math.min(cardWidth * 0.8, (width - cardWidth - 150) / (count - 1)) : cardWidth * 0.88;
        var middle = (count - 1) / 2;
        row.fan.style.setProperty('--card-width', cardWidth + 'px');
        row.cards.forEach(function (card, index) {
          var offset = index - middle;
          card.style.setProperty('--card-left', (width / 2 + offset * step) + 'px');
          card.style.setProperty('--card-angle', (offset * 4) + 'deg');
          card.style.setProperty('--card-drop', (offset * offset * 4) + 'px');
          card.style.setProperty('--card-layer', String(index + 1));
        });
      });
    }

    var tablist = deck.querySelector('[data-deck-tabs]') || rows[0].fan;
    tablist.setAttribute('role', 'tablist');
    if (rows.length > 1) rows.forEach(function (row) { row.fan.setAttribute('role', 'group'); });
    panels.forEach(function (panel) { panel.setAttribute('role', 'tabpanel'); panel.tabIndex = 0; });
    cards.forEach(function (card, index) {
      card.setAttribute('role', 'tab');
      card.addEventListener('click', function () { select(card, true); });
      card.addEventListener('focus', function () { select(card, true); });
      card.addEventListener('pointerenter', function (event) {
        if (event.pointerType !== 'mouse') return;
        window.clearTimeout(hoverTimer);
        hoverTimer = window.setTimeout(function () {
          // Keep a focused detail link available while the mouse crosses the fan.
          if (!panels.some(function (panel) { return panel.contains(document.activeElement); })) select(card, true);
        }, 140);
      });
      card.addEventListener('pointerleave', function () { window.clearTimeout(hoverTimer); });
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
    select(latest, false);
    layout();

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
    reducedMotion.addEventListener('change', updateMedia);
  });
}());

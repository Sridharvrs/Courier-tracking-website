/* ===== SwiftTrail — shared behaviour: drawer menu, nav shrink, scroll reveal, counters ===== */
(function () {
  // ---- Mobile drawer (full height / half width) ----
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');
  var scrim = document.getElementById('scrim');

  function toggleMenu(force) {
    var open = force !== undefined ? force : !drawer.classList.contains('open');
    drawer.classList.toggle('open', open);
    scrim.classList.toggle('on', open);
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) burger.addEventListener('click', function () { toggleMenu(); });
  if (scrim) scrim.addEventListener('click', function () { toggleMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggleMenu(false); });
  document.querySelectorAll('.drawer a').forEach(function (a) {
    a.addEventListener('click', function () { toggleMenu(false); });
  });

  // ---- Nav shrink on scroll ----
  var nav = document.querySelector('.nav');
  window.addEventListener('scroll', function () {
    if (nav) nav.classList.toggle('shrink', window.scrollY > 40);
  });

  // ---- Scroll reveal ----
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        if (en.target.dataset.count) runCount(en.target);
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(function (el, i) {
    el.style.transitionDelay = (el.dataset.delay || (i % 4) * 90) + 'ms';
    io.observe(el);
  });

  // ---- Number counters ----
  function runCount(el) {
    var target = parseFloat(el.dataset.count), dec = (target % 1 !== 0) ? 1 : 0, cur = 0;
    var step = target / 60;
    var t = setInterval(function () {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(t); }
      el.textContent = cur.toFixed(dec) + (el.dataset.suffix || '');
    }, 18);
  }
  document.querySelectorAll('[data-count]').forEach(function (el) { io.observe(el); });

  // ---- Year ----
  document.querySelectorAll('.yr').forEach(function (e) { e.textContent = new Date().getFullYear(); });
})();

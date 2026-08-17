/* ===== SERVICES page — tab switcher + tilt cards ===== */
(function () {
  var tbs = document.querySelectorAll('.tb');
  var panes = document.querySelectorAll('.pane');
  tbs.forEach(function (b) {
    b.addEventListener('click', function () {
      tbs.forEach(function (x) { x.classList.remove('active'); });
      panes.forEach(function (p) { p.classList.remove('active'); });
      b.classList.add('active');
      panes[+b.dataset.t].classList.add('active');
    });
  });

  // auto rotate tabs until the user interacts
  var i = 0, auto = setInterval(function () { i = (i + 1) % tbs.length; tbs[i].click(); }, 5200);
  document.querySelector('.tabs').addEventListener('click', function () { clearInterval(auto); });

  // subtle 3D tilt on coverage cards
  document.querySelectorAll('.cv').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - .5;
      var y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = 'translateY(-12px) rotateX(' + (-y * 8) + 'deg) rotateY(' + (x * 8) + 'deg)';
    });
    card.addEventListener('mouseleave', function () { card.style.transform = ''; });
  });
})();

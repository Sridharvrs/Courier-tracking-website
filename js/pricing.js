/* ===== PRICING page — billing toggle + live rate calculator ===== */
(function () {
  /* ---- monthly / annual toggle with number roll ---- */
  var sw = document.getElementById('switch'), annual = false;
  function roll(el, to) {
    var from = parseInt(el.textContent.replace(/[^0-9]/g, ''), 10) || 0, t0 = null;
    function frame(ts) {
      if (!t0) t0 = ts;
      var k = Math.min((ts - t0) / 500, 1);
      el.textContent = Math.round(from + (to - from) * k).toLocaleString('en-IN');
      if (k < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  sw.addEventListener('click', function () {
    annual = !annual;
    sw.classList.toggle('on', annual);
    document.getElementById('lblM').classList.toggle('active', !annual);
    document.getElementById('lblY').classList.toggle('active', annual);
    document.querySelectorAll('.amt').forEach(function (a) {
      roll(a, parseInt(annual ? a.dataset.y : a.dataset.m, 10));
    });
  });

  /* ---- rate calculator ---- */
  var svc = document.getElementById('cSvc'), w = document.getElementById('cWeight'),
      d = document.getElementById('cDist'), ins = document.getElementById('cIns'),
      otp = document.getElementById('cOtp'), out = document.getElementById('quoteOut'),
      eta = document.getElementById('quoteEta');

  function calc() {
    var rate = parseFloat(svc.value), kg = +w.value, km = +d.value;
    var cost = 99 + rate * (km / 10) + kg * 22;
    if (ins.checked) cost += 180;
    if (otp.checked) cost += 25;
    cost = Math.round(cost);
    document.getElementById('wOut').textContent = kg + ' kg';
    document.getElementById('dOut').textContent = km + ' km';
    out.textContent = '₹' + cost.toLocaleString('en-IN');
    var days = rate >= 26 ? Math.ceil(km / 900) + 2 : rate >= 18 ? 2 : km <= 60 ? 0 : Math.ceil(km / 700);
    eta.textContent = days === 0 ? 'Delivered same day' : 'Approx ' + days + ' day' + (days > 1 ? 's' : '') + ' transit';
    out.animate([{ transform: 'scale(1.12)' }, { transform: 'scale(1)' }], { duration: 260 });
  }
  [svc, w, d, ins, otp].forEach(function (el) { el.addEventListener('input', calc); });
  calc();

  document.getElementById('bookBtn').addEventListener('click', function () {
    var m = document.getElementById('cMsg');
    m.textContent = '✅ Quote locked. Sign in to confirm the pickup slot…';
    setTimeout(function () { window.location.href = 'login.html'; }, 1100);
  });
})();

/* ===== CONTACT page — form validation, ticket id, newsletter ===== */
(function () {
  var f = document.getElementById('cForm');
  function setErr(input, msg) {
    var e = input.parentElement.querySelector('.err');
    if (e) e.textContent = msg || '';
    input.style.borderColor = msg ? '#ff5c8a' : 'rgba(255,255,255,.14)';
    if (msg) input.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-7px)' }, { transform: 'translateX(7px)' }, { transform: 'translateX(0)' }], { duration: 300 });
  }

  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = document.getElementById('fName'), m = document.getElementById('fMail'), t = document.getElementById('fMsg');
    var ok = true;
    if (n.value.trim().length < 3) { setErr(n, 'Please enter your full name'); ok = false; } else setErr(n);
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(m.value.trim())) { setErr(m, 'Enter a valid email address'); ok = false; } else setErr(m);
    if (t.value.trim().length < 10) { setErr(t, 'Tell us a little more (10+ characters)'); ok = false; } else setErr(t);
    if (!ok) return;

    var btn = f.querySelector('button');
    btn.textContent = 'Sending…'; btn.disabled = true;
    setTimeout(function () {
      btn.textContent = 'Send message ✈️'; btn.disabled = false;
      document.getElementById('okMsg').textContent = '✅ Ticket #ST' + Math.floor(100000 + Math.random() * 899999) + ' created. Check your inbox.';
      f.reset();
    }, 1000);
  });

  var nf = document.getElementById('newsForm');
  nf.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = document.getElementById('newsMail').value.trim();
    var msg = document.getElementById('newsMsg');
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v)) { msg.textContent = '⚠️ That email does not look right.'; return; }
    msg.textContent = '🎉 You are on the list. First issue lands next Tuesday.';
    nf.reset();
  });

  // smooth-scroll for the "Write to us" quick link
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var el = document.querySelector(a.getAttribute('href'));
      if (el) { ev.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
})();

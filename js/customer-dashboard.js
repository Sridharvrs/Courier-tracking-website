/* =========================================
   LOGGED-IN USER
========================================= */

const currentUser = JSON.parse(
    sessionStorage.getItem("swiftTrailUser") || "null"
);

if (!currentUser) {
    window.location.href = "login.html";
} else {

    const userName = currentUser.name || "Customer";
    const userEmail = currentUser.email || "";
    const userRole = currentUser.role || "Customer";


    /* =========================================
       DYNAMIC PROFILE NAME
    ========================================= */

    document.querySelectorAll(".profileName").forEach(element => {
        element.textContent = userName;
    });


    /* =========================================
       DYNAMIC USER EMAIL
    ========================================= */

    document.querySelectorAll(".profileEmail").forEach(element => {
        element.textContent = userEmail;
    });


    /* =========================================
       DYNAMIC USER ROLE
    ========================================= */

    document.querySelectorAll(".profileRole").forEach(element => {
        element.textContent = userRole;
    });


    /* =========================================
       DYNAMIC DATA ATTRIBUTES
    ========================================= */

    document.querySelectorAll("[data-user-name]").forEach(element => {
        element.textContent = userName;
    });

    document.querySelectorAll("[data-user-email]").forEach(element => {
        element.textContent = userEmail;
    });

    document.querySelectorAll("[data-user-role]").forEach(element => {
        element.textContent = userRole;
    });
}

/* ===== Customer Dashboard logic ===== */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- toast ---------- */
  const toast = $('#toast');
  let tT;
  function say(msg) {
    toast.innerHTML = msg;
    toast.classList.add('show');
    clearTimeout(tT);
    tT = setTimeout(() => toast.classList.remove('show'), 3200);
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-toast]');
    if (b) say(b.dataset.toast);
  });

  /* ---------- sidebar / topbar ---------- */
  const side = $('#side'), scrim = $('#scrim');
  const openSide = o => { side.classList.toggle('open', o); scrim.classList.toggle('on', o); };
  $('#sbToggle').addEventListener('click', () => openSide(!side.classList.contains('open')));
  scrim.addEventListener('click', () => openSide(false));

  /* ---------- module switching ---------- */
  const titles = {
    overview: [
    'Overview',
    `Welcome back, ${currentUser?.name || 'Customer'}`
    ],
    shipments: ['My Shipments', 'All parcels on your account'],
    track: ['Live Tracking', 'Realtime parcel console'],
    book: ['Book Pickup', 'Create a new shipment'],
    address: ['Address Book', 'Saved pickup & drop points'],
    wallet: ['Wallet & Bills', 'Balance, invoices, top-ups'],
    support: ['Support', 'Tickets and help desk'],
    settings: ['Settings', 'Profile, alerts, security']
  };
  function go(id) {
    $$('.module').forEach(m => m.classList.remove('on'));
    const el = document.getElementById('m-' + id);
    if (el) el.classList.add('on');
    $$('.mlink').forEach(l => l.classList.toggle('active', l.dataset.mod === id));
    const t = titles[id] || ['Dashboard', ''];
    $('#tbTitle').innerHTML = t[0] + ' <small>' + t[1] + '</small>';
    if (window.innerWidth <= 900) openSide(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    revealAll();
    if (id === 'overview') { drawChart(); animateBars(); }
  }
  $$('.mlink').forEach(l => l.addEventListener('click', () => go(l.dataset.mod)));
  $$('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));

  /* ---------- logout ---------- */
  function logout() {
    if (confirm('Log out of your SwiftTrail customer account?')) {
      say('Signing you out… <b>see you soon!</b>');
      setTimeout(() => (window.location.href = 'login.html'), 900);
    }
  }
  $('#logoutSide').addEventListener('click', logout);
  $('#logoutTop').addEventListener('click', logout);
  $('#bellBtn').addEventListener('click', () => say('3 new scans on <b>ST-99120</b>'));

  /* ---------- reveal ---------- */
  function revealAll() {
    $$('.module.on .reveal').forEach((el, i) => {
      el.classList.remove('in');
      setTimeout(() => el.classList.add('in'), 70 * i);
    });
  }

  /* ---------- counters ---------- */
  function counters() {
    $$('.count').forEach(el => {
      const to = +el.dataset.to; let n = 0;
      const step = Math.max(1, Math.round(to / 40));
      const iv = setInterval(() => {
        n += step;
        if (n >= to) { n = to; clearInterval(iv); }
        el.textContent = n;
      }, 28);
    });
  }

  function animateBars() {
    $$('.bar i').forEach(b => setTimeout(() => (b.style.width = b.dataset.w + '%'), 250));
  }

  /* ---------- chart ---------- */
  const chartData = [{ m: 'Jan', v: 42 }, { m: 'Feb', v: 58 }, { m: 'Mar', v: 36 }, { m: 'Apr', v: 71 },
  { m: 'May', v: 63 }, { m: 'Jun', v: 88 }, { m: 'Jul', v: 74 }, { m: 'Aug', v: 96 }];
  function drawChart() {
    const c = $('#custChart'); if (!c) return;
    c.innerHTML = chartData.map(d => `<div data-h="${d.v}"><em>${d.v}</em><span>${d.m}</span></div>`).join('');
    setTimeout(() => $$('#custChart div').forEach((d, i) =>
      setTimeout(() => (d.style.height = (d.dataset.h * 0.9) + '%'), i * 80)), 120);
  }

  /* ---------- shipments table ---------- */
  const ships = [
    { id: 'ST-99120', r: 'Chennai → Bengaluru', s: 'Express', w: '3.0 kg', st: 'transit', eta: 'Today 7 PM' },
    { id: 'ST-44781', r: 'Chennai → Hyderabad', s: 'Surface', w: '8.5 kg', st: 'transit', eta: 'Tomorrow' },
    { id: 'ST-10233', r: 'Madurai → Chennai', s: 'Flash', w: '1.2 kg', st: 'delivered', eta: 'Delivered' },
    { id: 'ST-77410', r: 'Chennai → Kochi', s: 'Express', w: '4.4 kg', st: 'pending', eta: 'Pickup 4 PM' },
    { id: 'ST-66190', r: 'Coimbatore → Chennai', s: 'Surface', w: '12 kg', st: 'delivered', eta: 'Delivered' },
    { id: 'ST-33520', r: 'Chennai → Mumbai', s: 'Air Cargo', w: '22 kg', st: 'transit', eta: '2 days' },
    { id: 'ST-28004', r: 'Chennai → Delhi', s: 'Express', w: '2.1 kg', st: 'pending', eta: 'Awaiting label' }
  ];
  const tagOf = s => s === 'delivered' ? '<span class="tag t-green">Delivered</span>'
    : s === 'transit' ? '<span class="tag t-blue">In Transit</span>'
      : '<span class="tag t-amber">Pending</span>';
  function renderShips(f = 'all') {
    $('#shipRows').innerHTML = ships.filter(s => f === 'all' || s.st === f)
      .map(s => `<tr><td><b>${s.id}</b></td><td>${s.r}</td><td>${s.s}</td><td>${s.w}</td><td>${tagOf(s.st)}</td><td>${s.eta}</td></tr>`).join('');
  }
  $$('.fbtn').forEach(b => b.addEventListener('click', () => {
    $$('.fbtn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    renderShips(b.dataset.f);
  }));

  /* ---------- tracking ---------- */
  const db = {
    'ST-99120': { route: 'Chennai → Bengaluru', stage: 3, eta: 'Today, 7:00 PM', rider: 'Arun K.', svc: 'Express' },
    'ST-44781': { route: 'Chennai → Hyderabad', stage: 2, eta: 'Tomorrow, 1:30 PM', rider: 'Hub transit', svc: 'Surface' },
    'ST-10233': { route: 'Madurai → Chennai', stage: 4, eta: 'Delivered 11:04 AM', rider: 'Signed by Meera', svc: 'Flash' }
  };
  const steps = [['Booked', 'fa-box'], ['Picked Up', 'fa-warehouse'], ['In Transit', 'fa-truck-fast'], ['Out for Delivery', 'fa-motorcycle'], ['Delivered', 'fa-circle-check']];
  function track() {
    const id = ($('#trkInput').value || '').trim().toUpperCase();
    const d = db[id];
    const out = $('#trkResult');
    if (!d) { out.innerHTML = `<p class="note">No parcel found for <b>${id || '—'}</b>. Try ST-99120.</p>`; return; }
    out.innerHTML = `<div class="trk-card">
      <h4>${id} · ${d.svc}</h4>
      <div class="meta"><div><b>Route</b>${d.route}</div><div><b>ETA</b>${d.eta}</div><div><b>Handler</b>${d.rider}</div></div>
      <div class="bar" style="background:rgba(255,255,255,.2)"><i style="background:linear-gradient(90deg,#00d4b1,#ffb020);width:${(d.stage / 4) * 100}%"></i></div>
      <div class="trk-steps">${steps.map((s, i) => `<div class="${i <= d.stage ? 'ok' : ''}"><i class="fa-solid ${s[1]}"></i>${s[0]}</div>`).join('')}</div>
    </div>`;
    say('Live status loaded for <b>' + id + '</b>');
  }
  $('#trkBtn').addEventListener('click', track);
  $('#trkInput').addEventListener('keydown', e => e.key === 'Enter' && track());
  $('#topSearch').addEventListener('keydown', e => {
    if (e.key === 'Enter') { go('track'); $('#trkInput').value = e.target.value; track(); }
  });

  /* ---------- live feed ---------- */
  const events = [
    ['Departed Chennai hub', 'ST-99120'], ['Arrived Hosur sort center', 'ST-99120'],
    ['Customs cleared', 'ST-33520'], ['Out for delivery', 'ST-10233'],
    ['Rider assigned', 'ST-44781'], ['Package scanned at gateway', 'ST-77410']
  ];
  function pushFeed() {
    const f = $('#feed'); if (!f) return;
    const e = events[Math.floor(Math.random() * events.length)];
    const li = document.createElement('li');
    li.innerHTML = `<i class="fa-solid fa-satellite-dish" style="color:#7b5cff"></i><div><b>${e[0]}</b><span>${e[1]} · ${new Date().toLocaleTimeString()}</span></div>`;
    f.prepend(li);
    while (f.children.length > 8) f.lastElementChild.remove();
  }
  for (let i = 0; i < 4; i++) pushFeed();
  setInterval(pushFeed, 5000);

  /* ---------- booking quote ---------- */
  function quote() {
    const kg = +$('#bkKg').value || 0;
    const mul = +$('#bkSvc').value;
    const ins = +$('#bkIns').value;
    const base = 60, perKg = 28;
    const total = Math.round((base + kg * perKg) * mul + ins);
    $('#bkTotal').textContent = '₹' + total.toLocaleString('en-IN');
    $('#bkBreak').textContent = `Base ₹${base} + ${kg}kg × ₹${perKg} × ${mul}x service + ₹${ins} cover`;
  }
  ['bkKg', 'bkSvc', 'bkIns'].forEach(id => {
    const el = $('#' + id); el.addEventListener('input', quote); el.addEventListener('change', quote);
  });
  $('#bkDate').valueAsDate = new Date();
  quote();
  $('#bkConfirm').addEventListener('click', () => {
    const id = 'ST-' + Math.floor(10000 + Math.random() * 89999);
    ships.unshift({ id, r: $('#bkFrom').value + ' → ' + $('#bkTo').value, s: 'New', w: $('#bkKg').value + ' kg', st: 'pending', eta: 'Pickup scheduled' });
    renderShips('all');
    say('Pickup confirmed · Tracking ID <b>' + id + '</b>');
  });

  /* ---------- address book ---------- */
  const addrs = [
    { t: 'Home', n: 'Meera Raghav', a: '14/3 Anna Nagar West, Chennai 600040', c: 'c-violet', tag: 'Default Pickup' },
    { t: 'Office', n: 'Nova Labs Pvt Ltd', a: 'Tidel Park, Taramani, Chennai 600113', c: 'c-teal', tag: 'Business' },
    { t: 'Parents', n: 'R. Raghav', a: '22 Gandhi Street, Madurai 625001', c: 'c-amber', tag: 'Drop' },
    { t: 'Warehouse', n: 'Meera Store', a: 'Plot 7, Ambattur Estate, Chennai 600058', c: 'c-pink', tag: 'Bulk' },
    { t: 'Friend', n: 'Kavya S.', a: 'HSR Layout Sector 2, Bengaluru 560102', c: 'c-sky', tag: 'Drop' }
  ];
  function renderAddr() {
    $('#addrGrid').innerHTML = addrs.map(a => `<div class="addr ${a.c}">
      <span class="lbl">${a.tag}</span><h4>${a.t}</h4>
      <p><b>${a.n}</b><br>${a.a}</p>
      <div class="acts"><button data-toast="Address set as default.">Set Default</button><button data-toast="Address details copied.">Copy</button></div>
    </div>`).join('');
  }
  $('#addAddr').addEventListener('click', () => {
    const t = prompt('Label for the new address (e.g. Studio)');
    if (!t) return;
    const cs = ['c-violet', 'c-teal', 'c-amber', 'c-pink', 'c-sky', 'c-lime'];
    addrs.push({ t, n: 'Meera Raghav', a: 'Address pending verification', c: cs[addrs.length % cs.length], tag: 'New' });
    renderAddr(); say('Address <b>' + t + '</b> added.');
  });
  $('#pinBtn').addEventListener('click', () => {
    const p = $('#pinInput').value.trim();
    $('#pinOut').innerHTML = /^\d{6}$/.test(p)
      ? `PIN <b>${p}</b> is serviceable · next-day express available.`
      : 'Please enter a valid 6-digit PIN code.';
  });

  /* ---------- wallet ---------- */
  let bal = 4820;
  $$('.quickamt button').forEach(b => b.addEventListener('click', () => ($('#topAmt').value = b.dataset.amt)));
  $('#topBtn').addEventListener('click', () => {
    const a = +$('#topAmt').value || 0;
    if (a <= 0) return say('Enter a valid amount.');
    bal += a;
    $('#walBal').textContent = '₹' + bal.toLocaleString('en-IN');
    say('₹' + a + ' added · new balance <b>₹' + bal.toLocaleString('en-IN') + '</b>');
  });

  /* ---------- support ---------- */
  $('#spBtn').addEventListener('click', () => {
    if (!$('#spMsg').value.trim()) { $('#spOut').textContent = 'Please describe the issue before submitting.'; return; }
    const t = 'TKT-' + Math.floor(1000 + Math.random() * 8999);
    $('#spOut').innerHTML = `Ticket <b>${t}</b> created. Expect a reply within 15 minutes.`;
    say('Ticket <b>' + t + '</b> raised successfully.');
    $('#spMsg').value = '';
  });

  /* ---------- init ---------- */
  renderShips(); renderAddr(); counters(); drawChart(); animateBars(); revealAll();
})();

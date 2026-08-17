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

    // =============

    document.querySelectorAll(".profileName").forEach(element => {
        element.textContent = userName;
    });

    document.querySelectorAll(".profileEmail").forEach(element => {
        element.textContent = userEmail;
    });

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


/* ===== Shipper Dashboard logic ===== */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- toast ---------- */
  const toast = $('#toast'); let tT;
  function say(msg) {
    toast.innerHTML = msg; toast.classList.add('show');
    clearTimeout(tT); tT = setTimeout(() => toast.classList.remove('show'), 3200);
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-toast]'); if (b) say(b.dataset.toast);
  });

  /* ---------- sidebar ---------- */
  const side = $('#side'), scrim = $('#scrim');
  const openSide = o => { side.classList.toggle('open', o); scrim.classList.toggle('on', o); };
  $('#sbToggle').addEventListener('click', () => openSide(!side.classList.contains('open')));
  scrim.addEventListener('click', () => openSide(false));

  /* ---------- modules ---------- */
  const titles = {
    control: ['Control Room', 'Nova Logistics · Hub Chennai'],
    consign: ['Consignments', 'Manifest & AWB management'],
    fleet: ['Fleet & Riders', 'Capacity and performance'],
    warehouse: ['Warehouse', 'Bin-level stock register'],
    rates: ['Rate Cards', 'Contracts and margin'],
    cod: ['COD Settlement', 'Cash collection & payouts'],
    reports: ['Reports', 'Performance analytics'],
    team: ['Team Access', 'Roles and audit trail']
  };
  function go(id) {
    $$('.module').forEach(m => m.classList.remove('on'));
    const el = document.getElementById('m-' + id); if (el) el.classList.add('on');
    $$('.mlink').forEach(l => l.classList.toggle('active', l.dataset.mod === id));
    const t = titles[id] || ['Dashboard', ''];
    $('#tbTitle').innerHTML = t[0] + ' <small>' + t[1] + '</small>';
    if (window.innerWidth <= 900) openSide(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    revealAll(); animateBars();
    if (id === 'control') drawChart('#hubChart', hubData);
    if (id === 'reports') drawChart('#revChart', revData);
  }
  $$('.mlink').forEach(l => l.addEventListener('click', () => go(l.dataset.mod)));
  $$('[data-go]').forEach(b => b.addEventListener('click', () => go(b.dataset.go)));

  /* ---------- logout ---------- */
  function logout() {
    if (confirm('Log out of the Nova Logistics shipper account?')) {
      say('Closing session… <b>goodbye!</b>');
      setTimeout(() => (window.location.href = 'login.html'), 900);
    }
  }
  $('#logoutSide').addEventListener('click', logout);
  $('#logoutTop').addEventListener('click', logout);
  $('#bellBtn').addEventListener('click', () => say('8 NDR parcels need action before 6 PM'));

  /* ---------- reveal + bars ---------- */
  function revealAll() {
    $$('.module.on .reveal').forEach((el, i) => {
      el.classList.remove('in'); setTimeout(() => el.classList.add('in'), 70 * i);
    });
  }
  function animateBars() {
    $$('.module.on .bar i').forEach((b, i) => {
      b.style.width = '0'; setTimeout(() => (b.style.width = b.dataset.w + '%'), 200 + i * 90);
    });
  }
  function counters() {
    $$('.count').forEach(el => {
      const to = +el.dataset.to; let n = 0;
      const step = Math.max(1, Math.round(to / 40));
      const iv = setInterval(() => { n += step; if (n >= to) { n = to; clearInterval(iv); } el.textContent = n; }, 26);
    });
  }

  /* ---------- charts ---------- */
  const hubData = [['08h', 48], ['10h', 76], ['12h', 92], ['14h', 64], ['16h', 88], ['18h', 71], ['20h', 96], ['22h', 55]];
  const revData = [['W26', 62], ['W27', 71], ['W28', 58], ['W29', 84], ['W30', 77], ['W31', 91], ['W32', 86], ['W33', 98]];
  function drawChart(sel, data) {
    const c = $(sel); if (!c) return;
    c.innerHTML = data.map(d => `<div data-h="${d[1]}"><em>${d[1]}</em><span>${d[0]}</span></div>`).join('');
    setTimeout(() => $$(sel + ' div').forEach((d, i) =>
      setTimeout(() => (d.style.height = (d.dataset.h * 0.9) + '%'), i * 80)), 120);
  }

  /* ---------- consignments ---------- */
  const cns = [
    { a: 'SW-880231', r: 'Anitha D.', d: 'Bengaluru 560102', m: 'Express', v: '₹2,450', s: '<span class="tag t-blue">Picked</span>' },
    { a: 'SW-880232', r: 'Ganesh V.', d: 'Hyderabad 500081', m: 'Surface', v: '₹980', s: '<span class="tag t-amber">Awaiting</span>' },
    { a: 'SW-880233', r: 'Priya N.', d: 'Kochi 682024', m: 'Express', v: '₹5,120', s: '<span class="tag t-green">Delivered</span>' },
    { a: 'SW-880234', r: 'Rahul T.', d: 'Mumbai 400069', m: 'Air', v: '₹12,300', s: '<span class="tag t-blue">In Transit</span>' },
    { a: 'SW-880235', r: 'Sneha R.', d: 'Chennai 600028', m: 'Same-day', v: '₹640', s: '<span class="tag t-green">Delivered</span>' },
    { a: 'SW-880236', r: 'Imran S.', d: 'Coimbatore 641012', m: 'Surface', v: '₹1,760', s: '<span class="tag t-pink">NDR</span>' },
    { a: 'SW-880237', r: 'Deepa K.', d: 'Madurai 625020', m: 'Express', v: '₹3,010', s: '<span class="tag t-blue">Picked</span>' },
    { a: 'SW-880238', r: 'Vikram J.', d: 'Delhi 110024', m: 'Air', v: '₹8,900', s: '<span class="tag t-grey">Manifested</span>' },
    { a: 'SW-880239', r: 'Lakshmi P.', d: 'Salem 636004', m: 'Surface', v: '₹520', s: '<span class="tag t-amber">Awaiting</span>' }
  ];
  function renderCns() {
    $('#cnRows').innerHTML = cns.map(c => `<tr>
      <td><input type="checkbox" class="rowchk"></td><td><b>${c.a}</b></td><td>${c.r}</td>
      <td>${c.d}</td><td>${c.m}</td><td>${c.v}</td><td>${c.s}</td></tr>`).join('');
    $$('.rowchk').forEach(ch => ch.addEventListener('change', () =>
      ch.closest('tr').classList.toggle('sel', ch.checked)));
  }
  $('#chkAll').addEventListener('change', e => {
    $$('.rowchk').forEach(ch => { ch.checked = e.target.checked; ch.closest('tr').classList.toggle('sel', ch.checked); });
  });
  const selCount = () => $$('.rowchk').filter(c => c.checked).length;
  $('#bulkAssign').addEventListener('click', () => {
    const n = selCount();
    say(n ? `<b>${n}</b> consignment(s) assigned to available riders.` : 'Select at least one AWB first.');
  });
  $('#bulkLabel').addEventListener('click', () => {
    const n = selCount();
    say(n ? `Generating <b>${n}</b> shipping label(s)…` : 'Select at least one AWB first.');
  });

  /* ---------- riders ---------- */
  const riders = [
    { n: 'Arun Kumar', z: 'Chennai North · TN-09 AC 4412', s: 'Online', c: '', img: 'team1.webp', del: 28, pend: 6, cap: 82 },
    { n: 'Divya Prakash', z: 'Chennai South · EV Pod 4', s: 'Online', c: '', img: 'team2.webp', del: 34, pend: 3, cap: 91 },
    { n: 'Ravi Mohan', z: 'Hosur Lane · TN-22 BX 7781', s: 'Break', c: 'brk', img: 'team3.webp', del: 19, pend: 11, cap: 64 },
    { n: 'Naveen Suresh', z: 'Bengaluru · KA-51 MN 3390', s: 'Online', c: '', img: 'team4.webp', del: 41, pend: 2, cap: 96 },
    { n: 'Farhan Ali', z: 'Hyderabad · TS-07 QP 2210', s: 'Offline', c: 'off', img: 'team5.webp', del: 0, pend: 0, cap: 12 },
    { n: 'Meghna Iyer', z: 'Kochi · KL-05 TT 8823', s: 'Online', c: '', img: 'team6.webp', del: 23, pend: 8, cap: 73 }
  ];
  function renderRiders() {
    $('#riderGrid').innerHTML = riders.map(r => `<div class="rider">
      <div class="ph"><span class="st ${r.c}">${r.s}</span>
        <img src="images/${r.img}" alt="${r.n}"></div>
      <div class="bd"><h4>${r.n}</h4><p>${r.z}</p>
        <div class="stats"><div><b>${r.del}</b><span>Delivered</span></div><div><b>${r.pend}</b><span>Pending</span></div><div><b>${r.cap}%</b><span>Load</span></div></div>
        <div class="bar"><i data-w="${r.cap}" style="background:linear-gradient(90deg,#ffb020,#ff5c8a)"></i></div>
      </div></div>`).join('');
  }
  $('#asBtn').addEventListener('click', () => {
    const awb = $('#asAwb').value.trim();
    if (!awb) { $('#asOut').textContent = 'Enter an AWB number to dispatch.'; return; }
    $('#asOut').innerHTML = `<b>${awb.toUpperCase()}</b> dispatched to ${$('#asRider').value}.`;
    say('Dispatch created for <b>' + awb.toUpperCase() + '</b>');
  });

  /* ---------- warehouse ---------- */
  const wh = [
    ['SKU-1042', 'Bubble wrap roll 50m', 'Chennai DC', 'A-12', 340, 'ok'],
    ['SKU-2210', 'Corrugated box M', 'Chennai DC', 'B-04', 86, 'low'],
    ['SKU-3391', 'Thermal label roll', 'Hosur Spoke', 'C-19', 512, 'ok'],
    ['SKU-4408', 'Cold gel pack', 'Bengaluru DC', 'R-02', 41, 'low'],
    ['SKU-5527', 'Fragile tape', 'Chennai DC', 'A-31', 218, 'ok'],
    ['SKU-6640', 'Poly mailer L', 'Bengaluru DC', 'D-08', 12, 'crit'],
    ['SKU-7712', 'Pallet shrink film', 'Hosur Spoke', 'E-05', 165, 'ok']
  ];
  const hTag = h => h === 'ok' ? '<span class="tag t-green">Healthy</span>'
    : h === 'low' ? '<span class="tag t-amber">Low</span>' : '<span class="tag t-pink">Critical</span>';
  $('#whRows').innerHTML = wh.map(r =>
    `<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${hTag(r[5])}</td></tr>`).join('');

  /* ---------- rate simulator ---------- */
  function sim() {
    const sell = +$('#rtSell').value || 0, cost = +$('#rtZone').value, vol = +$('#rtVol').value || 0;
    const per = sell - cost, m = per * vol;
    $('#rtOut').textContent = '₹' + m.toLocaleString('en-IN');
    $('#rtPer').textContent = `₹${per} margin per parcel × ${vol.toLocaleString('en-IN')} shipments`;
  }
  ['rtSell', 'rtZone', 'rtVol'].forEach(id => {
    $('#' + id).addEventListener('input', sim); $('#' + id).addEventListener('change', sim);
  });
  sim();

  /* ---------- COD ---------- */
  $('#reqPayout').addEventListener('click', () => {
    $('#codPend').textContent = '₹0';
    say('Payout of <b>₹2,41,500</b> requested · credited within 24h.');
  });

  /* ---------- team ---------- */
  const team = [
    ['Nithya Raman', 'Ops Manager', 'Chennai DC', '2 min ago', 'Full'],
    ['Karthik Velan', 'Dispatch Lead', 'Hosur Spoke', '18 min ago', 'Limited'],
    ['Sana Fatima', 'Finance', 'HQ', '1 hour ago', 'Billing only'],
    ['Joseph M.', 'Warehouse Supervisor', 'Bengaluru DC', 'Yesterday', 'Limited'],
    ['Nova Admin', 'Owner', 'HQ', 'Online', 'Full']
  ];
  function renderTeam() {
    $('#teamRows').innerHTML = team.map(t => `<tr><td><b>${t[0]}</b></td><td>${t[1]}</td><td>${t[2]}</td><td>${t[3]}</td>
      <td><span class="tag ${t[4] === 'Full' ? 't-green' : t[4] === 'Limited' ? 't-blue' : 't-grey'}">${t[4]}</span></td></tr>`).join('');
  }
  $('#inviteBtn').addEventListener('click', () => {
    const n = prompt('Name of the team member to invite');
    if (!n) return;
    team.push([n, 'Pending role', 'Unassigned', 'Invited', 'Limited']);
    renderTeam(); say('Invite sent to <b>' + n + '</b>');
  });

  /* ---------- top search ---------- */
  $('#topSearch').addEventListener('keydown', e => {
    if (e.key === 'Enter') { go('consign'); say('Filtering manifest for <b>' + e.target.value + '</b>'); }
  });

  /* ---------- live exception ticker ---------- */
  setInterval(() => {
    if (Math.random() > .65) say('New scan exception on <b>SW-8802' + Math.floor(30 + Math.random() * 9) + '</b>');
  }, 15000);

  /* ---------- init ---------- */
  renderCns(); renderRiders(); renderTeam(); counters();
  drawChart('#hubChart', hubData); drawChart('#revChart', revData);
  revealAll(); animateBars();
})();

/* ===== TRACK page — typing headline, demo shipment lookup, live feed, accordion ===== */
(function () {
  /* ---- typing effect ---- */
  var words = ['my parcel?', 'my order?', 'ST-99120?', 'the driver?'];
  var el = document.getElementById('typed'), w = 0, c = 0, del = false;
  function type() {
    var word = words[w];
    el.textContent = del ? word.slice(0, --c) : word.slice(0, ++c);
    if (!del && c === word.length) { del = true; setTimeout(type, 1300); return; }
    if (del && c === 0) { del = false; w = (w + 1) % words.length; }
    setTimeout(type, del ? 45 : 95);
  }
  if (el) type();

  /* ---- demo shipment database ---- */
  var DB = {
    'ST-99120': {
      status: 'Out for delivery', cls: '', pct: 82,
      from: 'Bengaluru, KA', to: 'Chennai, TN', svc: 'Express Same-Day', eta: 'Today, 4:20 PM',
      steps: [
        ['done', 'Label created', 'Shipper portal · Bengaluru', 'Aug 12, 08:10'],
        ['done', 'Picked up', 'Rider Karthik M · Indiranagar', 'Aug 12, 10:32'],
        ['done', 'Arrived at hub', 'BLR South sorting centre', 'Aug 12, 14:05'],
        ['done', 'In transit', 'Line-haul BLR → MAA, truck TN09-4412', 'Aug 12, 21:40'],
        ['now', 'Out for delivery', 'Rider Suresh P · Anna Nagar route', 'Aug 13, 09:15'],
        ['', 'Delivered', 'Awaiting signature / OTP', 'Expected 4:20 PM']
      ]
    },
    'ST-44781': {
      status: 'In transit', cls: 'transit', pct: 46,
      from: 'Dubai, UAE', to: 'Mumbai, MH', svc: 'International Air', eta: 'Aug 15, 6:00 PM',
      steps: [
        ['done', 'Label created', 'Merchant API · Dubai', 'Aug 11, 16:22'],
        ['done', 'Picked up', 'DXB Freight terminal 2', 'Aug 12, 07:00'],
        ['done', 'Export cleared', 'Customs DXB · duty prepaid', 'Aug 12, 19:35'],
        ['now', 'In transit', 'Flight EK-508 · airborne', 'Aug 13, 03:10'],
        ['', 'Import clearance', 'BOM customs queue', 'Pending'],
        ['', 'Delivered', 'Andheri East', 'Expected Aug 15']
      ]
    },
    'ST-10233': {
      status: 'Delivered', cls: 'done', pct: 100,
      from: 'Coimbatore, TN', to: 'Madurai, TN', svc: 'Standard Ground', eta: 'Delivered Aug 11',
      steps: [
        ['done', 'Label created', 'Bulk upload · CBE warehouse', 'Aug 09, 11:00'],
        ['done', 'Picked up', 'Rider Vignesh R', 'Aug 09, 15:45'],
        ['done', 'Arrived at hub', 'CBE central hub', 'Aug 09, 20:12'],
        ['done', 'In transit', 'Road leg CBE → MDU', 'Aug 10, 05:30'],
        ['done', 'Out for delivery', 'Rider Anitha S', 'Aug 11, 09:02'],
        ['done', 'Delivered', 'Signed by R. Kumar · photo saved', 'Aug 11, 12:48']
      ]
    }
  };

  var form = document.getElementById('trackForm'),
      input = document.getElementById('trackInput'),
      empty = document.getElementById('rcEmpty'),
      body = document.getElementById('rcBody');

  function render(id) {
    var d = DB[id];
    if (!d) {
      empty.hidden = false; body.hidden = true;
      empty.innerHTML = '<div class="box-anim">🕵️</div><h3>No shipment found for “' + id + '”</h3><p>Use one of the demo IDs: ST-99120, ST-44781 or ST-10233.</p>';
      return;
    }
    empty.hidden = true; body.hidden = false;
    document.getElementById('rId').textContent = id;
    var st = document.getElementById('rStatus');
    st.textContent = d.status; st.className = 'rc-status ' + d.cls;
    document.getElementById('rFrom').textContent = d.from;
    document.getElementById('rTo').textContent = d.to;
    document.getElementById('rSvc').textContent = d.svc;
    document.getElementById('rEta').textContent = d.eta;

    var ul = document.getElementById('steps');
    ul.innerHTML = '';
    d.steps.forEach(function (s, i) {
      var li = document.createElement('li');
      li.className = s[0];
      li.style.animationDelay = (i * 110) + 'ms';
      li.innerHTML = '<i class="sd"></i><div><b>' + s[1] + '</b><span>' + s[2] + '</span></div><time>' + s[3] + '</time>';
      ul.appendChild(li);
    });
    setTimeout(function () {
      document.getElementById('pbar').style.width = d.pct + '%';
      document.getElementById('ptruck').style.left = 'calc(' + d.pct + '% - 14px)';
    }, 120);
    document.getElementById('resultCard').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var id = input.value.trim().toUpperCase();
    if (!id) { input.focus(); return; }
    render(id);
  });
  document.querySelectorAll('.chip').forEach(function (c) {
    c.addEventListener('click', function () { input.value = c.dataset.id; render(c.dataset.id); });
  });

  // deep link from home page: track.html?id=ST-99120
  var q = new URLSearchParams(location.search).get('id');
  if (q) { input.value = q.toUpperCase(); render(q.toUpperCase()); }

  /* ---- live scan feed ---- */
  var cities = ['Chennai', 'Pune', 'Delhi NCR', 'Kochi', 'Dubai', 'Singapore', 'Hyderabad', 'Jaipur'];
  var acts = ['Hub scan', 'Departed facility', 'Out for delivery', 'Delivered', 'Customs cleared', 'Pickup done'];
  var list = document.getElementById('feedList');
  function pad(n) { return n < 10 ? '0' + n : n; }
  function push() {
    if (!list) return;
    var d = new Date();
    var li = document.createElement('li');
    li.innerHTML = '<em>' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()) + '</em>' +
      '<b>ST-' + Math.floor(10000 + Math.random() * 89999) + '</b>' +
      '<span>' + acts[Math.floor(Math.random() * acts.length)] + ' · ' + cities[Math.floor(Math.random() * cities.length)] + '</span>' +
      '<span class="tag">live</span>';
    list.prepend(li);
    while (list.children.length > 7) list.lastChild.remove();
  }
  for (var i = 0; i < 6; i++) push();
  setInterval(push, 2600);

  /* ---- accordion ---- */
  document.querySelectorAll('.ai button').forEach(function (b) {
    b.addEventListener('click', function () {
      var item = b.parentElement, panel = item.querySelector('.ap');
      var open = item.classList.contains('open');
      document.querySelectorAll('.ai').forEach(function (x) { x.classList.remove('open'); x.querySelector('.ap').style.maxHeight = null; });
      if (!open) { item.classList.add('open'); panel.style.maxHeight = panel.scrollHeight + 'px'; }
    });
  });
})();


/* =========================================================
   LIVE ROUTE INTELLIGENCE
========================================================= */

function updateRouteIntelligence(id) {

  var d = DB[id];

  if (!d) return;


  var intelId = document.getElementById('intelId');
  var intelEta = document.getElementById('intelEta');
  var intelPercent = document.getElementById('intelPercent');
  var intelProgress = document.getElementById('intelProgress');
  var intelDistance = document.getElementById('intelDistance');


  if (!intelId) return;


  /* Tracking ID */

  intelId.textContent = id;


  /* ETA */

  var etaText = d.eta;

  if (d.status === 'Delivered') {
    etaText = 'Delivered';
  }

  intelEta.textContent = etaText;


  /* Progress */

  intelPercent.textContent =
    d.pct + '%';

  intelProgress.style.width =
    d.pct + '%';


  /* Distance */

  var remaining;

  if (d.pct >= 100) {
    remaining = '0 km';
  } else if (d.pct >= 80) {
    remaining = '42.8 km';
  } else if (d.pct >= 40) {
    remaining = '186 km';
  } else {
    remaining = '640 km';
  }

  intelDistance.textContent =
    remaining;


  /* Vehicle status */

  var vehicleCard =
    document.querySelector('.vehicle-card');

  if (vehicleCard) {

    if (d.status === 'Delivered') {

      vehicleCard.innerHTML =
        '<strong>DELIVERED</strong>' +
        '<span>Shipment completed</span>';

    } else {

      vehicleCard.innerHTML =
        '<strong>' + id + '</strong>' +
        '<span>Live courier · 48 km/h</span>';

    }

  }


  /* Route status */

  var status =
    document.querySelector('.intel-status');

  if (status) {

    if (d.status === 'Delivered') {

      status.textContent =
        'DELIVERED';

      status.style.color =
        '#ffffff';

      status.style.background =
        'rgba(59,165,93,.2)';

    } else {

      status.textContent =
        'ON ROUTE';

      status.style.color =
        '#4fe2ca';

      status.style.background =
        'rgba(0,212,177,.08)';

    }

  }

}
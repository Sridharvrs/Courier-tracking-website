/* ===== HOME page interactions ===== */
(function () {
  var form = document.getElementById('quickForm');
  var input = document.getElementById('quickId');
  var hint = document.getElementById('quickHint');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var id = input.value.trim().toUpperCase();
      if (!id) {
        hint.innerHTML = '⚠️ Please type a tracking ID first.';
        hint.style.color = '#c62828';
        input.style.borderColor = '#c62828';
        input.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-9px)' }, { transform: 'translateX(9px)' }, { transform: 'translateX(0)' }], { duration: 320 });
        return;
      }
      hint.innerHTML = '🔎 Opening live map for <b>' + id + '</b>…';
      hint.style.color = '#0b6053';
      setTimeout(function () { window.location.href = 'track.html?id=' + encodeURIComponent(id); }, 700);
    });
  }

  // clickable sample ids
  document.querySelectorAll('.qb-hint b').forEach(function (b) {
    b.addEventListener('click', function () { input.value = b.textContent; input.focus(); });
  });

  // parallax on hero art
  var art = document.querySelector('.hero-art');
  window.addEventListener('mousemove', function (e) {
    if (!art || window.innerWidth < 900) return;
    var x = (e.clientX / window.innerWidth - .5) * 22;
    var y = (e.clientY / window.innerHeight - .5) * 18;
    art.style.transform = 'translate(' + x + 'px,' + y + 'px)';
  });
})();

/* =========================================================
   COMMAND CENTER LIVE DATA
========================================================= */

(function () {

  const eta = document.querySelector('.current-card p');
  const distance = document.querySelector('.command-stat:nth-child(3) strong');

  if (!eta || !distance) return;

  let minutes = 18;
  let km = 42.8;

  setInterval(function () {

    minutes = minutes <= 12 ? 18 : minutes - 1;
    km = Math.max(38, km - 0.1);

    eta.textContent = minutes + ' min from destination';
    distance.textContent = km.toFixed(1) + ' km';

  }, 5000);

})();


/* =========================================================
   PACKAGE JOURNEY INTERACTION
========================================================= */

(function () {

  var points = document.querySelectorAll('.journey-point');
  var labels = document.querySelectorAll('.journey-label');

  var packageBox = document.querySelector('.story-package');
  var progressBar = document.getElementById('storyProgress');
  var progressText = document.getElementById('storyProgressText');

  var storyIcon = document.getElementById('storyIcon');
  var storyEyebrow = document.getElementById('storyEyebrow');
  var storyTitle = document.getElementById('storyTitle');
  var storyDescription = document.getElementById('storyDescription');
  var storyLocation = document.getElementById('storyLocation');

  if (!points.length) return;


  var stages = [

    {
      icon: '📦',
      title: 'Package picked up',
      description:
        'Your shipment has been collected from the sender and securely entered into the SwiftTrail network.',
      location: 'Chennai, India',
      progress: 20
    },

    {
      icon: '🏭',
      title: 'Reached sorting hub',
      description:
        'Your package has arrived at a sorting facility and is being prepared for its next destination.',
      location: 'Chennai Sorting Hub',
      progress: 40
    },

    {
      icon: '🚚',
      title: 'In transit',
      description:
        'Your shipment is moving between hubs. Live tracking keeps you updated while it travels.',
      location: 'Bengaluru Highway',
      progress: 60
    },

    {
      icon: '📍',
      title: 'Out for delivery',
      description:
        'Your courier is on the final route and your package is getting closer to its destination.',
      location: 'Bengaluru, India',
      progress: 80
    },

    {
      icon: '🏠',
      title: 'Package delivered',
      description:
        'Your shipment has safely reached its destination and the delivery journey is complete.',
      location: 'Customer Address',
      progress: 100
    }

  ];


  function updateJourney(index) {

    var stage = stages[index];

    /* Update content */

    storyIcon.textContent = stage.icon;

    storyEyebrow.textContent =
      'STEP ' + String(index + 1).padStart(2, '0');

    storyTitle.textContent = stage.title;

    storyDescription.textContent =
      stage.description;

    storyLocation.textContent =
      stage.location;


    /* Update progress */

    progressBar.style.width =
      stage.progress + '%';

    progressText.textContent =
      stage.progress + '%';


    /* Move package */

    var point = points[index];

    if (point) {

      var position =
        point.style.left;

      packageBox.style.left =
        position;

    }


    /* Update points */

    points.forEach(function (point, i) {

      point.classList.remove(
        'active',
        'completed'
      );

      if (i < index) {
        point.classList.add('completed');
      }

      if (i === index) {
        point.classList.add('active');
      }

    });


    /* Update labels */

    labels.forEach(function (label, i) {

      label.classList.toggle(
        'active',
        i === index
      );

    });


    /* Update road progress */

    document
      .querySelector('.story-visual')
      .style.setProperty(
        '--story-progress-width',
        stage.progress + '%'
      );

  }


  /* Point clicks */

  points.forEach(function (point) {

    point.addEventListener(
      'click',
      function () {

        var index =
          parseInt(
            point.dataset.stage,
            10
          );

        updateJourney(index);

      }
    );

  });


  /* Label clicks */

  labels.forEach(function (label) {

    label.addEventListener(
      'click',
      function () {

        var index =
          parseInt(
            label.dataset.stage,
            10
          );

        updateJourney(index);

      }
    );

  });


  /* Initial state */

  updateJourney(0);

})();
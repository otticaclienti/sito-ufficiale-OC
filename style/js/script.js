document.addEventListener('DOMContentLoaded', function () {
  initMarquee('#track-top',   { direction: 'left',  speed: 30 });
  initMarquee('#track-bottom',{ direction: 'right', speed: 30 });
});

function initMarquee(selector, options) {
  var direction = (options && options.direction) ? options.direction : 'left';
  var speed = (options && options.speed) ? options.speed : 50;

  var track = document.querySelector(selector);
  if (!track) return;

  var row = track.parentElement;
  var originalItems = Array.prototype.slice.call(track.children);

  // Attendi che le immagini siano cariche (evita misure sballate = loopWidth errato)
  var loaders = originalItems.map(function (img) {
    if (img.complete) return Promise.resolve();
    return new Promise(function (resolve) {
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
    });
  });

  Promise.all(loaders).then(function () {
    // Larghezza del set originale PRIMA di clonare
    var originalWidth = track.scrollWidth;

    // Clona una volta il set originale per creare continuità
    originalItems.forEach(function (el) {
      track.appendChild(el.cloneNode(true));
    });

    // Se serve, estendi ulteriormente per riempire lo schermo
    while (track.scrollWidth < row.offsetWidth * 2) {
      originalItems.forEach(function (el) {
        track.appendChild(el.cloneNode(true));
      });
    }

    var loopWidth = originalWidth;     // un ciclo completo
    var dir = (direction === 'left') ? -1 : 1;
    var pos = (dir === 1) ? -loopWidth : 0; // per right si parte da -loopWidth
    var paused = false;
    var last = performance.now();

    function step(now) {
      var dt = (now - last) / 1000;
      last = now;

      if (!paused) {
        pos += dir * speed * dt;

        // Wrapping continuo nell’intervallo [-loopWidth, 0]
        if (pos <= -loopWidth) pos += loopWidth; // ha superato la metà a sinistra → riporta avanti
        if (pos >= 0)         pos -= loopWidth; // ha superato la metà a destra → riporta indietro

        track.style.transform = 'translateX(' + pos + 'px)';
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);


    // Resize: estendi se necessario mantenendo il loop
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        while (track.scrollWidth < row.offsetWidth * 2) {
          originalItems.forEach(function (el) {
            track.appendChild(el.cloneNode(true));
          });
        }
        // loopWidth resta la larghezza del set originale; la posizione continua a fare wrapping
      }, 150);
    });
  });
}
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');

    // Se è un link interno (#id), gestisci scroll fluido
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        const offset = 130;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }

    // Chiudi la navbar dopo il click (sia interni che esterni)
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse.classList.contains('show')) {
      new bootstrap.Collapse(navbarCollapse).hide();
    }
  });
});

// Chiudi la navbar se clicchi fuori
document.addEventListener('click', function(event) {
  const navbarCollapse = document.querySelector('.navbar-collapse');
  const navbarToggler = document.querySelector('.navbar-toggler');

  if (
    navbarCollapse.classList.contains('show') &&
    !navbarCollapse.contains(event.target) &&
    !navbarToggler.contains(event.target)
  ) {
    new bootstrap.Collapse(navbarCollapse).hide();
  }
});
const navbarCollapse = document.getElementById('navbarSupportedContent');
const logoNavbar = document.getElementById('logoNavbar');

navbarCollapse.addEventListener('show.bs.collapse', () => {
  logoNavbar.style.display = 'none';
});

navbarCollapse.addEventListener('hidden.bs.collapse', () => {
  logoNavbar.style.display = 'block';
});

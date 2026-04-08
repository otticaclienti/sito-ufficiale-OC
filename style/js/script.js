document.addEventListener('DOMContentLoaded', function () {

  /* ============================
     MARQUEE / LOGO CAROUSEL
  ============================ */
  initMarquee('#track-top',   { direction: 'left',  speed: 30 });
  initMarquee('#track-bottom',{ direction: 'right', speed: 30 });

  /* ============================
     SCROLL REVEAL ANIMATIONS
  ============================ */
  var revealElements = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('revealed');
    });
  }

  /* ============================
     NAVBAR SCROLL EFFECT
  ============================ */
  var navbar = document.getElementById('mainNav');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  /* ============================
     SMOOTH SCROLL FOR NAV LINKS
  ============================ */
  document.querySelectorAll('.navbar-nav .nav-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        var target = document.getElementById(href.substring(1));
        if (target) {
          var offset = 100;
          var top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
      // Close mobile menu after click
      var navbarCollapse = document.getElementById('navbarNav');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        new bootstrap.Collapse(navbarCollapse).hide();
      }
    });
  });

  /* ============================
     CLOSE MOBILE MENU ON OUTSIDE CLICK
  ============================ */
  document.addEventListener('click', function (event) {
    var navbarCollapse = document.getElementById('navbarNav');
    var navbarToggler = document.querySelector('.navbar-toggler');
    if (
      navbarCollapse &&
      navbarCollapse.classList.contains('show') &&
      !navbarCollapse.contains(event.target) &&
      !navbarToggler.contains(event.target)
    ) {
      new bootstrap.Collapse(navbarCollapse).hide();
    }
  });

  /* ============================
     HIDE LOGO ON MOBILE MENU OPEN
  ============================ */
  var navbarCollapse = document.getElementById('navbarNav');
  var logoNavbar = document.querySelector('.navbar-brand:not(#logoCollapse)');
  if (navbarCollapse && logoNavbar) {
    navbarCollapse.addEventListener('show.bs.collapse', function () {
      logoNavbar.style.opacity = '0';
    });
    navbarCollapse.addEventListener('hidden.bs.collapse', function () {
      logoNavbar.style.opacity = '1';
    });
  }

});

/* ============================
   MARQUEE FUNCTION
============================ */
function initMarquee(selector, options) {
  var direction = (options && options.direction) ? options.direction : 'left';
  var speed = (options && options.speed) ? options.speed : 50;

  var track = document.querySelector(selector);
  if (!track) return;

  var row = track.parentElement;
  var originalItems = Array.prototype.slice.call(track.children);

  var loaders = originalItems.map(function (img) {
    if (img.complete) return Promise.resolve();
    return new Promise(function (resolve) {
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
    });
  });

  Promise.all(loaders).then(function () {
    var originalWidth = track.scrollWidth;

    originalItems.forEach(function (el) {
      track.appendChild(el.cloneNode(true));
    });

    while (track.scrollWidth < row.offsetWidth * 2) {
      originalItems.forEach(function (el) {
        track.appendChild(el.cloneNode(true));
      });
    }

    var loopWidth = originalWidth;
    var dir = (direction === 'left') ? -1 : 1;
    var pos = (dir === 1) ? -loopWidth : 0;
    var last = performance.now();

    function step(now) {
      var dt = (now - last) / 1000;
      last = now;

      pos += dir * speed * dt;

      if (pos <= -loopWidth) pos += loopWidth;
      if (pos >= 0) pos -= loopWidth;

      track.style.transform = 'translateX(' + pos + 'px)';
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        while (track.scrollWidth < row.offsetWidth * 2) {
          originalItems.forEach(function (el) {
            track.appendChild(el.cloneNode(true));
          });
        }
      }, 150);
    });
  });
}

/* ── NAV SCROLL ──────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── COUNTERS ────────────────────────────────── */
const statsObserver = new IntersectionObserver((entries) => {
  if (!entries[0].isIntersecting) return;
  document.querySelectorAll('[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    let cur = 0;
    const step = Math.ceil(target / 45);
    const iv = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur + (target >= 20 ? '+' : '');
      if (cur >= target) clearInterval(iv);
    }, 28);
  });
  statsObserver.disconnect();
}, { threshold: 0.5 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObserver.observe(statsEl);

/* ── REVEAL ON SCROLL ────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.transitionDelay = (i * 0.07) + 's';
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── FORM ────────────────────────────────────── */
function submitForm() {
  const inputs = document.querySelectorAll('.form-input, .form-textarea');
  let ok = true;
  inputs.forEach(i => {
    if (!i.value.trim()) {
      i.style.borderColor = 'rgba(167,139,250,0.6)';
      ok = false;
    } else {
      i.style.borderColor = '';
    }
  });
  if (!ok) return;
  document.getElementById('formSuccess').style.display = 'block';
  inputs.forEach(i => i.value = '');
  setTimeout(() => document.getElementById('formSuccess').style.display = 'none', 5000);
}

/* ── NAV ACTIVE LINK ─────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 160) cur = s.id; });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--violet-l)' : '';
  });
});

/* ── MOBILE HAMBURGER ───────────────────────── */
const toggleBtn = document.querySelector('.nav-toggle');
const navList = document.querySelector('.nav-links');
if (toggleBtn && navList) {
  toggleBtn.addEventListener('click', () => {
    console.log('hamburger clicked');
    navList.classList.toggle('mobile-active');
    toggleBtn.classList.toggle('open');
  });

  // close menu when a link is tapped (useful on mobile)
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      if (navList.classList.contains('mobile-active')) {
        navList.classList.remove('mobile-active');
        toggleBtn.classList.remove('open');
      }
    });
  });
}

/* ── CANSAT CAROUSEL ─────────────────────────── */
(function () {
  const track = document.getElementById('cansatTrack');
  const dotsContainer = document.getElementById('cansatDots');
  const prevBtn = document.getElementById('cansatPrev');
  const nextBtn = document.getElementById('cansatNext');
  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  let current = 0;
  const total = slides.length;

  // Clonar primera y última slide para efecto bucle infinito
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[total - 1].cloneNode(true);
  track.appendChild(firstClone);
  track.insertBefore(lastClone, slides[0]);

  // Empezar en la segunda posición (la primera real)
  let pos = 1;
  track.style.transition = 'none';
  track.style.transform = `translateX(-${pos * 100}%)`;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Ir a foto ' + (i + 1));
    dot.addEventListener('click', () => goTo(i + 1, i));
    dotsContainer.appendChild(dot);
  });

  function updateDots(realIndex) {
    dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === realIndex);
    });
  }

  function goTo(newPos, dotIndex) {
    pos = newPos;
    current = dotIndex;
    track.style.transition = 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)';
    track.style.transform = `translateX(-${pos * 100}%)`;
    updateDots(current);
  }

  // Al terminar la transición, hacer el salto invisible si estamos en un clon
  track.addEventListener('transitionend', () => {
    if (pos === 0) {
      track.style.transition = 'none';
      pos = total;
      current = total - 1;
      track.style.transform = `translateX(-${pos * 100}%)`;
      updateDots(current);
    }
    if (pos === total + 1) {
      track.style.transition = 'none';
      pos = 1;
      current = 0;
      track.style.transform = `translateX(-${pos * 100}%)`;
      updateDots(current);
    }
  });

  prevBtn.addEventListener('click', () => goTo(pos - 1, (current - 1 + total) % total));
  nextBtn.addEventListener('click', () => goTo(pos + 1, (current + 1) % total));

  let autoplay = setInterval(() => goTo(pos + 1, (current + 1) % total), 4000);
  [prevBtn, nextBtn].forEach(btn => {
    btn.addEventListener('click', () => {
      clearInterval(autoplay);
      autoplay = setInterval(() => goTo(pos + 1, (current + 1) % total), 4000);
    });
  });

  let startX = 0;
  track.parentElement.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.parentElement.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      const dir = diff > 0 ? 1 : -1;
      goTo(pos + dir, (current + dir + total) % total);
    }
  });
})();
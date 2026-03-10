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

/* ============================================================
   NAVBAR — scroll effect + active link
   ============================================================ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 24);
  highlightNav();
}, { passive: true });

function highlightNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 90) current = s.id;
  });
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}

/* ============================================================
   HAMBURGER
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ============================================================
   PARALLAX HERO SHAPES
   ============================================================ */
const heroShapes = document.querySelectorAll('.hshape');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > window.innerHeight) return;
  heroShapes.forEach((s, i) => {
    s.style.transform = `translateY(${y * (0.08 + i * 0.04)}px)`;
  });
}, { passive: true });

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-a');
    const isOpen = item.classList.contains('open');

    // close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-a').classList.remove('open');
    });

    if (!isOpen) {
      item.classList.add('open');
      answer.classList.add('open');
    }
  });
});

/* ============================================================
   REVIEWS CAROUSEL — 3 in 3
   ============================================================ */
const carTrack     = document.getElementById('carTrack');
const dotsWrapper  = document.getElementById('carDots');
const TOTAL        = 9;
let   currentPage  = 0;
let   autoTimer;

function getPerPage() { return window.innerWidth < 700 ? 1 : 3; }

function buildDots() {
  dotsWrapper.innerHTML = '';
  const pages = Math.ceil(TOTAL / getPerPage());
  for (let i = 0; i < pages; i++) {
    const dot = document.createElement('button');
    dot.classList.add('car-dot');
    dot.setAttribute('aria-label', `Página ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrapper.appendChild(dot);
  }
}

function setCardWidths() {
  const perPage = getPerPage();
  const wrapW = carTrack.parentElement.clientWidth;
  const gap   = 22;
  const cardW = Math.floor((wrapW - gap * (perPage - 1)) / perPage);
  carTrack.querySelectorAll('.rcard').forEach(c => {
    c.style.minWidth = cardW + 'px';
    c.style.width    = cardW + 'px';
  });
  return cardW;
}

function goTo(page) {
  const perPage = getPerPage();
  const pages   = Math.ceil(TOTAL / perPage);
  currentPage = ((page % pages) + pages) % pages;
  const cardW = setCardWidths();
  const step  = (cardW + 22) * perPage;
  carTrack.style.transform = `translateX(-${currentPage * step}px)`;
  dotsWrapper.querySelectorAll('.car-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentPage);
  });
}

window.addEventListener('load', () => { buildDots(); goTo(0); });
window.addEventListener('resize', () => { buildDots(); goTo(0); });

document.getElementById('prevBtn').addEventListener('click', () => { goTo(currentPage - 1); resetAuto(); });
document.getElementById('nextBtn').addEventListener('click', () => { goTo(currentPage + 1); resetAuto(); });

function resetAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(() => goTo(currentPage + 1), 5200);
}
autoTimer = setInterval(() => goTo(currentPage + 1), 5200);

// recalc on resize
window.addEventListener('resize', () => goTo(currentPage), { passive: true });

/* touch / swipe on carousel */
let touchStartX = 0;
carTrack.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
carTrack.addEventListener('touchend',   e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) { goTo(diff > 0 ? currentPage + 1 : currentPage - 1); resetAuto(); }
});

/* ============================================================
   LANGUAGE TOGGLE  (ES ↔ EN)
   ============================================================ */
let lang = 'es';
const langBtn = document.getElementById('langBtn');

langBtn.addEventListener('click', () => {
  lang = lang === 'es' ? 'en' : 'es';
  langBtn.textContent = lang === 'es' ? 'EN' : 'ES';
  document.documentElement.lang = lang;
  applyLang(lang);
});

function applyLang(l) {
  // textContent elements with data-es / data-en
  document.querySelectorAll('[data-es]').forEach(el => {
    const txt = el.getAttribute(`data-${l}`);
    if (!txt) return;
    // if element has child elements (like span inside h2), use innerHTML carefully
    if (el.children.length === 0) {
      el.textContent = txt;
    } else {
      el.innerHTML = txt;
    }
  });

  // placeholders
  const phMap = {
    es: {
      fname:   'María García',
      fphone:  '+34 600 000 000',
      femail:  'tu@email.com',
      fpet:    'Max, perro labrador, 3 años',
      fmsg:    'Cuéntame qué necesitas...'
    },
    en: {
      fname:   'Mary Smith',
      fphone:  '+44 7700 000000',
      femail:  'your@email.com',
      fpet:    'Max, labrador, 3 years old',
      fmsg:    'Tell me what you need...'
    }
  };
  Object.entries(phMap[l]).forEach(([id, ph]) => {
    const el = document.getElementById(id);
    if (el) el.placeholder = ph;
  });
}

/* ============================================================
   CONTACT FORM — Formspree submission
   ============================================================ */
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');

contactForm.addEventListener('submit', async e => {
  e.preventDefault();
  const original = submitBtn.textContent;

  submitBtn.textContent = lang === 'es' ? 'Enviando...' : 'Sending...';
  submitBtn.disabled = true;

  try {
    const res = await fetch(contactForm.action, {
      method:  'POST',
      body:    new FormData(contactForm),
      headers: { Accept: 'application/json' }
    });

    if (res.ok) {
      submitBtn.textContent = lang === 'es' ? '✓ ¡Mensaje enviado!' : '✓ Message sent!';
      submitBtn.style.background = 'linear-gradient(135deg,#25D366,#128C7E)';
      contactForm.reset();
    } else {
      throw new Error('server error');
    }
  } catch {
    submitBtn.textContent = lang === 'es'
      ? 'Error · Llámanos: +34 620 01 72 35'
      : 'Error · Call: +34 620 01 72 35';
    submitBtn.style.background = 'linear-gradient(135deg,#ff6b6b,#ee5a24)';
  }

  setTimeout(() => {
    submitBtn.textContent  = original;
    submitBtn.style.background = '';
    submitBtn.disabled = false;
  }, 5000);
});

/* ============================================================
   SMOOTH SECTION TRANSITIONS — page load fade-in
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .5s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { document.body.style.opacity = '1'; });
  });
});

/* ============================================================
   NAVBAR — scroll effect + active link
   ============================================================ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });

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
if (heroShapes.length) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > window.innerHeight) return;
    heroShapes.forEach((s, i) => {
      s.style.transform = `translateY(${y * (0.08 + i * 0.04)}px)`;
    });
  }, { passive: true });
}

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
   REVIEWS CAROUSEL — solo en index.html
   ============================================================ */
const carTrack    = document.getElementById('carTrack');
const dotsWrapper = document.getElementById('carDots');

if (carTrack && dotsWrapper) {
  const TOTAL = 9;
  let currentPage = 0;
  let autoTimer;

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

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(currentPage + 1), 5200);
  }

  window.addEventListener('load', () => { buildDots(); goTo(0); resetAuto(); });
  window.addEventListener('resize', () => { buildDots(); goTo(0); });

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(currentPage - 1); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(currentPage + 1); resetAuto(); });

  let touchStartX = 0;
  carTrack.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  carTrack.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(diff > 0 ? currentPage + 1 : currentPage - 1); resetAuto(); }
  });
}

/* ============================================================
   LANGUAGE TOGGLE  (ES ↔ EN) — persiste entre páginas
   ============================================================ */
let lang = localStorage.getItem('lang') || 'es';
const langBtn = document.getElementById('langBtn');

function applyLang(l) {
  document.documentElement.lang = l;
  if (langBtn) langBtn.textContent = l === 'es' ? 'EN' : 'ES';

  document.querySelectorAll('[data-es]').forEach(el => {
    const txt = el.getAttribute(`data-${l}`);
    if (!txt) return;
    if (el.children.length === 0) {
      el.textContent = txt;
    } else {
      el.innerHTML = txt;
    }
  });

  const phMap = {
    es: { fname: 'María García', fphone: '+34 600 000 000', femail: 'tu@email.com', fpet: 'Max, perro labrador, 3 años', fmsg: 'Cuéntame qué necesitas...' },
    en: { fname: 'Mary Smith',   fphone: '+44 7700 000000', femail: 'your@email.com', fpet: 'Max, labrador, 3 years old', fmsg: 'Tell me what you need...' }
  };
  Object.entries(phMap[l]).forEach(([id, ph]) => {
    const el = document.getElementById(id);
    if (el) el.placeholder = ph;
  });
}

if (langBtn) {
  langBtn.addEventListener('click', () => {
    lang = lang === 'es' ? 'en' : 'es';
    localStorage.setItem('lang', lang);
    applyLang(lang);
  });
}

applyLang(lang);

/* ============================================================
   CONTACT FORM — solo en contacto.html
   ============================================================ */
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');

if (contactForm && submitBtn) {
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
      submitBtn.textContent = original;
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 5000);
  });
}

/* ============================================================
   PAGE LOAD FADE-IN
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .5s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { document.body.style.opacity = '1'; });
  });
});

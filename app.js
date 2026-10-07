/* ═══════════════════════════════════════════════════════════
   UNDANGAN DIGITAL – app.js
   Arif & Sari · 15 November 2026
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── GUEST NAME FROM URL ─── */
(function () {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('to');
  if (name) {
    document.getElementById('guest-name').textContent = decodeURIComponent(name);
  }
})();

/* ─── COVER PETAL ANIMATION (on cover screen) ─── */
(function () {
  const canvas = document.getElementById('cover-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, petals = [];

  function resize () {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['rgba(74,168,216,', 'rgba(179,218,245,', 'rgba(255,255,255,'];

  function Petal () {
    this.reset();
  }
  Petal.prototype.reset = function () {
    this.x  = Math.random() * W;
    this.y  = -20;
    this.r  = 4 + Math.random() * 6;
    this.vx = (Math.random() - .5) * .8;
    this.vy = .5 + Math.random() * 1.2;
    this.alpha = .4 + Math.random() * .5;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.angle = Math.random() * Math.PI * 2;
    this.spin  = (Math.random() - .5) * .04;
  };
  Petal.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    this.angle += this.spin;
    if (this.y > H + 20) this.reset();
  };
  Petal.prototype.draw = function () {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.beginPath();
    ctx.ellipse(0, 0, this.r, this.r * 1.8, 0, 0, Math.PI * 2);
    ctx.fillStyle = this.color + this.alpha + ')';
    ctx.fill();
    ctx.restore();
  };

  for (let i = 0; i < 60; i++) {
    const p = new Petal();
    p.y = Math.random() * H;
    petals.push(p);
  }

  let coverAnimId;
  function animateCover () {
    ctx.clearRect(0, 0, W, H);
    petals.forEach(p => { p.update(); p.draw(); });
    coverAnimId = requestAnimationFrame(animateCover);
  }
  animateCover();

  window._stopCoverAnim = function () {
    cancelAnimationFrame(coverAnimId);
  };
})();

/* ─── OPEN INVITATION ─── */
function openInvitation () {
  const cover = document.getElementById('cover-screen');
  const main  = document.getElementById('main-content');

  cover.classList.add('hidden');
  setTimeout(() => {
    cover.style.display = 'none';
    window._stopCoverAnim();
  }, 850);

  main.style.display = 'block';

  // Start main petal canvas
  setTimeout(() => {
    startPetals();
    initReveal();
    startCountdown();
    initDotNav();
    loadDefaultWishes();
  }, 100);

  // Auto-play music
  const music = document.getElementById('bg-music');
  music.play().catch(() => {});
}

/* ─── MUSIC TOGGLE ─── */
let musicPlaying = false;
function toggleMusic () {
  const music  = document.getElementById('bg-music');
  const iconP  = document.getElementById('music-icon-play');
  const iconPa = document.getElementById('music-icon-pause');
  if (musicPlaying) {
    music.pause();
    iconP.style.display  = '';
    iconPa.style.display = 'none';
  } else {
    music.play().catch(() => {});
    iconP.style.display  = 'none';
    iconPa.style.display = '';
  }
  musicPlaying = !musicPlaying;
}
// Reflect state when music auto-starts
document.getElementById('bg-music').addEventListener('play', () => {
  musicPlaying = true;
  document.getElementById('music-icon-play').style.display  = 'none';
  document.getElementById('music-icon-pause').style.display = '';
});

/* ─── FLOATING PETALS (main page) ─── */
function startPetals () {
  const canvas = document.getElementById('petal-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, petals = [];

  function resize () {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = [
    'rgba(74,168,216,',
    'rgba(179,218,245,',
    'rgba(13,79,140,',
    'rgba(200,230,245,'
  ];

  function Petal () { this.reset(); }
  Petal.prototype.reset = function () {
    this.x     = Math.random() * W;
    this.y     = -30;
    this.r     = 3 + Math.random() * 7;
    this.vx    = (Math.random() - .5) * .7;
    this.vy    = .3 + Math.random() * .9;
    this.alpha = .15 + Math.random() * .25;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.angle = Math.random() * Math.PI * 2;
    this.spin  = (Math.random() - .5) * .03;
  };
  Petal.prototype.update = function () {
    this.x += this.vx + Math.sin(Date.now() * .001 + this.y * .01) * .3;
    this.y += this.vy;
    this.angle += this.spin;
    if (this.y > H + 30) this.reset();
  };
  Petal.prototype.draw = function () {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.beginPath();
    // petal shape
    ctx.moveTo(0, -this.r * 1.5);
    ctx.bezierCurveTo(this.r, -this.r, this.r, this.r, 0, this.r * 1.5);
    ctx.bezierCurveTo(-this.r, this.r, -this.r, -this.r, 0, -this.r * 1.5);
    ctx.fillStyle = this.color + this.alpha + ')';
    ctx.fill();
    ctx.restore();
  };

  for (let i = 0; i < 40; i++) {
    const p = new Petal();
    p.y = Math.random() * H;
    petals.push(p);
  }

  function loop () {
    ctx.clearRect(0, 0, W, H);
    petals.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
}

/* ─── SCROLL REVEAL ─── */
function initReveal () {
  const els = document.querySelectorAll('.reveal');
  const io  = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
}

/* ─── DOT NAV ─── */
function initDotNav () {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const dots     = document.querySelectorAll('#dot-nav .dot');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id  = e.target.id;
        dots.forEach(d => d.classList.remove('active'));
        const active = document.querySelector('#dot-nav .dot[href="#' + id + '"]');
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });

  sections.forEach(s => io.observe(s));

  // Smooth scroll
  dots.forEach(d => {
    d.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(d.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ─── COUNTDOWN ─── */
function startCountdown () {
  const target = new Date('2026-11-15T08:00:00+07:00').getTime();

  function tick () {
    const now  = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      document.getElementById('cd-days').textContent  = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-mins').textContent  = '00';
      document.getElementById('cd-secs').textContent  = '00';
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);

    const pad = n => String(n).padStart(2, '0');

    animateNumber('cd-days',  pad(d));
    animateNumber('cd-hours', pad(h));
    animateNumber('cd-mins',  pad(m));
    animateNumber('cd-secs',  pad(s));
  }

  function animateNumber (id, val) {
    const el = document.getElementById(id);
    if (el.textContent !== val) {
      el.style.transform = 'translateY(-4px)';
      el.style.opacity   = '0.5';
      setTimeout(() => {
        el.textContent     = val;
        el.style.transform = '';
        el.style.opacity   = '';
      }, 120);
    }
  }

  tick();
  setInterval(tick, 1000);
}

/* ─── GALLERY LIGHTBOX ─── */
function openLightbox (el) {
  const bg   = getComputedStyle(el.querySelector('.gimg')).backgroundImage;
  const url  = bg.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
  const lb   = document.getElementById('lightbox');
  const img  = document.getElementById('lb-img');
  img.src    = url;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox () {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

/* ─── WISHES ─── */
const DEFAULT_WISHES = [
  { name: 'Bunda Aisyah', text: 'Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Barakallahu lakuma wa baraka alaikuma. 🤲', time: '2 jam lalu' },
  { name: 'Rizky Pratama', text: 'Selamat menempuh hidup baru, bro! Semoga langgeng sampai kakek nenek dan selalu bahagia! 🎉💙', time: '5 jam lalu' },
  { name: 'Dewi Anggraeni', text: 'Sari, kamu cantik banget! Semoga pernikahannya penuh cinta dan keberkahan ya. Bahagia selalu kalian berdua ❤️', time: '1 hari lalu' },
];

function loadDefaultWishes () {
  const saved = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
  const all   = [...saved, ...DEFAULT_WISHES];
  const list  = document.getElementById('wish-list');
  list.innerHTML = '';
  all.forEach(w => list.insertAdjacentHTML('beforeend', wishCardHTML(w)));
}

function wishCardHTML (w) {
  return `
    <div class="wish-card">
      <div class="wish-card-name">✨ ${escapeHTML(w.name)}</div>
      <div class="wish-card-text">${escapeHTML(w.text)}</div>
      <div class="wish-card-time">${w.time}</div>
    </div>`;
}

function submitWish (e) {
  e.preventDefault();
  const name = document.getElementById('wish-name').value.trim();
  const text = document.getElementById('wish-text').value.trim();
  if (!name || !text) return;

  const w = { name, text, time: 'Baru saja' };
  const saved = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
  saved.unshift(w);
  localStorage.setItem('wedding_wishes', JSON.stringify(saved));

  const list = document.getElementById('wish-list');
  list.insertAdjacentHTML('afterbegin', wishCardHTML(w));

  document.getElementById('wish-name').value = '';
  document.getElementById('wish-text').value = '';

  showToast('Ucapan berhasil dikirim! 💌');
}

/* ─── RSVP ─── */
function submitRSVP (e) {
  e.preventDefault();
  const attend = document.querySelector('input[name="attend"]:checked');
  if (!attend) { showToast('Pilih konfirmasi kehadiran dulu ya!'); return; }

  const name   = document.getElementById('rsvp-name').value.trim();
  const phone  = document.getElementById('rsvp-phone').value.trim();
  const guests = document.getElementById('rsvp-guests').value;
  const status = attend.value;

  // Save to localStorage
  const data = { name, phone, guests, status, ts: new Date().toISOString() };
  const saved = JSON.parse(localStorage.getItem('wedding_rsvp') || '[]');
  saved.push(data);
  localStorage.setItem('wedding_rsvp', JSON.stringify(saved));

  // Show success
  document.getElementById('rsvp-form').style.display    = 'none';
  document.getElementById('rsvp-success').style.display = '';

  const msg = status === 'hadir'
    ? `Yeay! Kami sangat bahagia ${name} bisa hadir! 🎉`
    : status === 'tidak'
    ? `Kami sangat memahami, semoga bisa bersama di lain waktu.`
    : `Kami menunggu kabar dari ${name}!`;

  showToast(msg, 5000);
}

/* ─── TOAST ─── */
function showToast (msg, dur = 3500) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), dur);
}

/* ─── UTILS ─── */
function escapeHTML (str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ─── PARALLAX HERO ─── */
window.addEventListener('scroll', () => {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const bg = hero.querySelector('.hero-bg');
  if (bg) {
    bg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }
});


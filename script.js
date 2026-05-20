// ── INFINITE PROJECT SLIDER ──
let projCurrentIndex = 0;
let projIsTransitioning = false;
let projOriginalCount = 0;

function initInfiniteProjectSlider() {
  const track = document.getElementById('projScrollTrack');
  if (!track) return;

  const originalCards = Array.from(track.children);
  projOriginalCount = originalCards.length;

  // Clone semua cards di awal dan akhir untuk infinite effect
  originalCards.forEach(card => {
    const cloneBefore = card.cloneNode(true);
    const cloneAfter = card.cloneNode(true);
    track.insertBefore(cloneBefore, track.firstChild);
    track.appendChild(cloneAfter);
  });

  // Set posisi awal ke card asli pertama (setelah clone)
  projCurrentIndex = projOriginalCount;
  updateProjectSlider(false);
}

function projScroll(direction) {
  if (projIsTransitioning) return;
  
  projIsTransitioning = true;
  projCurrentIndex += direction;
  
  updateProjectSlider(true);
  
  // Reset posisi untuk infinite loop setelah animasi
  setTimeout(() => {
    const totalCards = projOriginalCount * 3; // clone + original + clone
    
    // Jika sudah di clone terakhir, reset ke card asli pertama
    if (projCurrentIndex >= projOriginalCount * 2) {
      projCurrentIndex = projOriginalCount;
      updateProjectSlider(false);
    }
    // Jika sudah di clone pertama, reset ke card asli terakhir
    else if (projCurrentIndex < projOriginalCount) {
      projCurrentIndex = projOriginalCount * 2 - 1;
      updateProjectSlider(false);
    }
    
    projIsTransitioning = false;
  }, 500);
}

function updateProjectSlider(animate = true) {
  const track = document.getElementById('projScrollTrack');
  if (!track) return;
  
  const cardWidth = 216; // 200px + 16px gap
  const offset = -projCurrentIndex * cardWidth;
  
  track.style.transition = animate ? 'transform 0.5s ease' : 'none';
  track.style.transform = `translateX(${offset}px)`;
}

function toggleMenu() {
  document.querySelector('.nav-links').classList.toggle('open');
}

function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
}

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el = entry.target;
    el.style.opacity = '1';
    el.style.transform = 'translate3d(0, 0, 0) scale(1)';
    el.style.filter = 'blur(0)';
    el.style.visibility = 'visible';

    io.unobserve(el);
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -10% 0px'
});

function initScrollReveal() {
  // Exclude .bc elements (handled by CSS .fu animation) and elements already handled by initRichScrollReveal
  const revealItems = document.querySelectorAll('.acard, .soft-tile, .proj-card, .proj-card-new, .cert-card, .cv-block, .cv-panel, .skill-row');

  revealItems.forEach((el, index) => {
    // Skip if already has reveal class or fu animation
    if (el.classList.contains('fu') || el.classList.contains('fu1') || el.classList.contains('fu2') || el.classList.contains('fu3')) return;
    // Skip if initRichScrollReveal will handle it
    if (el.classList.contains('proj-card-new') || el.classList.contains('proj-reveal')) return;

    el.style.opacity = '0';
    el.style.visibility = 'hidden';
    el.style.transform = 'translate3d(0, 24px, 0) scale(0.98)';
    el.style.filter = 'blur(8px)';
    el.style.transition = 'opacity .65s ease, transform .65s ease, filter .65s ease';
    el.style.transitionDelay = `${Math.min(index * 40, 240)}ms`;
    io.observe(el);
  });
}

function typeText(node, text, speed = 80) {
  node.textContent = '';
  let index = 0;

  const writer = () => {
    if (index <= text.length) {
      node.textContent = text.slice(0, index);
      index += 1;
      requestAnimationFrame(() => setTimeout(writer, speed));
    }
  };
  writer();
}

function initHeroTyping() {
  const tagline = document.querySelector('.bc-hero-text .tagline');
  if (!tagline) return;
  const text = tagline.textContent.trim();
  tagline.textContent = '';
  setTimeout(() => typeText(tagline, text, 70), 700);
}

function initTiltCards() {
  const cards = document.querySelectorAll('.bc.bc-hero, .bc.bc-photo, .bc.bc-desc, .bc.bc-taglist, .bc.bc-quote');

  cards.forEach(card => {
    card.style.transformStyle = 'preserve-3d';
    card.style.transition = 'transform .35s ease, box-shadow .35s ease';

    card.addEventListener('mousemove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const rotateX = (-y * 10).toFixed(2);
      const rotateY = (x * 10).toFixed(2);

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(2px)`;
      card.style.boxShadow = `${-x * 18}px ${y * 18}px 40px rgba(207, 46, 110, 0.18)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      card.style.boxShadow = '';
    });
  });
}

function initSkillAnimations() {
  const skills = document.querySelectorAll('.skill-fill');
  if (skills.length) {
    skills.forEach(bar => {
      const widthAttr = bar.getAttribute('style');
      const match = widthAttr ? widthAttr.match(/width\s*:\s*([^;]+);?/) : null;
      const target = bar.dataset.w || (match ? match[1].trim() : '0%');
      bar.dataset.w = target.replace('%', '');
      bar.style.width = '0';
    });
    setTimeout(() => {
      skills.forEach(bar => bar.style.width = `${bar.dataset.w}%`);
    }, 500);
  }

  const cvBars = document.querySelectorAll('.cv-mini-fill');
  if (cvBars.length) {
    cvBars.forEach(bar => {
      const widthAttr = bar.getAttribute('style');
      const match = widthAttr ? widthAttr.match(/width\s*:\s*([^;]+);?/) : null;
      const target = bar.dataset.w || (match ? match[1].trim() : '0%');
      bar.dataset.w = target.replace('%', '');
      bar.style.width = '0';
    });
    setTimeout(() => {
      cvBars.forEach(bar => bar.style.width = `${bar.dataset.w}%`);
    }, 500);
  }
}

// ── PROJECT CARDS — enhanced animations ──
function initProjectReveal() {
  const cards = document.querySelectorAll('.proj-reveal');
  if (!cards.length) return;

  const colors = ['#f48fb1','#e91e63','#c2185b','#fce4ec','#f8bbd9','#ff80ab'];

  // ── 1. Staggered scroll-reveal with flip ──
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      const delay = parseInt(card.dataset.delay || 0);
      setTimeout(() => {
        card.classList.add('is-visible');
        // burst mini stars on reveal
        burstStars(card);
      }, delay);
      obs.unobserve(card);
    });
  }, { threshold: 0.12 });

  cards.forEach((card, idx) => {
    obs.observe(card);

    // ── 2. Floating particle dots ──
    const pContainer = card.querySelector('.proj-particles');
    if (pContainer) {
      for (let i = 0; i < 14; i++) {
        const p = document.createElement('span');
        p.className = 'proj-particle';
        const angle = (i / 14) * 360;
        const dist = 50 + Math.random() * 60;
        const tx = Math.cos(angle * Math.PI / 180) * dist;
        const ty = Math.sin(angle * Math.PI / 180) * dist;
        p.style.cssText = `
          left:${10 + Math.random() * 80}%;
          top:${10 + Math.random() * 80}%;
          background:${colors[i % colors.length]};
          --tx:translate(${tx}px,${ty}px);
          animation-delay:${Math.random() * 0.2}s;
          width:${3 + Math.random() * 6}px;
          height:${3 + Math.random() * 6}px;
        `;
        pContainer.appendChild(p);
      }
    }

    // ── 3. Magnetic 3D tilt on hover ──
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rx = (-y * 16).toFixed(2);
      const ry = (x * 16).toFixed(2);
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px) scale(1.02)`;
      card.style.boxShadow = `${-x*22}px ${y*22}px 48px rgba(233,30,99,0.26)`;

      // move glow with mouse
      const glow = card.querySelector('.proj-glow');
      if (glow) {
        glow.style.background = `radial-gradient(circle at ${(x+0.5)*100}% ${(y+0.5)*100}%, rgba(233,30,99,0.22) 0%, transparent 70%)`;
        glow.style.opacity = '1';
      }

      // sparkle trail
      spawnTrailSparkle(card, e.clientX - rect.left, e.clientY - rect.top);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
      const glow = card.querySelector('.proj-glow');
      if (glow) glow.style.opacity = '0';
    });
  });

  // ── 4. Star burst on reveal ──
  function burstStars(card) {
    const rect = card.getBoundingClientRect();
    for (let i = 0; i < 8; i++) {
      const star = document.createElement('span');
      star.className = 'proj-burst-star';
      const angle = (i / 8) * 360;
      const dist = 40 + Math.random() * 30;
      star.style.cssText = `
        left:${rect.width / 2}px;
        top:${rect.height / 2}px;
        --bx:${Math.cos(angle * Math.PI / 180) * dist}px;
        --by:${Math.sin(angle * Math.PI / 180) * dist}px;
        background:${colors[i % colors.length]};
        width:${5 + Math.random()*4}px;
        height:${5 + Math.random()*4}px;
      `;
      card.appendChild(star);
      setTimeout(() => star.remove(), 700);
    }
  }

  // ── 5. Mouse-trail mini sparkles ──
  const trailPool = [];
  function spawnTrailSparkle(card, x, y) {
    if (Math.random() > 0.35) return; // throttle
    const s = document.createElement('span');
    s.className = 'proj-trail-spark';
    s.style.cssText = `left:${x}px; top:${y}px; background:${colors[Math.floor(Math.random()*colors.length)]};`;
    card.appendChild(s);
    setTimeout(() => s.remove(), 600);
  }
}



function initAchievements() {
  // ── 1. Scroll-reveal cards ──
  const cards = document.querySelectorAll('.achieve-reveal');
  if (!cards.length) return;

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      const delay = parseInt(card.dataset.delay || 0);
      setTimeout(() => card.classList.add('is-visible'), delay);
      revealObs.unobserve(card);
    });
  }, { threshold: 0.12 });

  cards.forEach(card => {
    revealObs.observe(card);

    // ── 2. Inject particle dots ──
    const pContainer = card.querySelector('.ach-particles');
    if (pContainer) {
      const colors = ['#f48fb1','#e91e63','#c2185b','#fce4ec','#f8bbd9'];
      for (let i = 0; i < 10; i++) {
        const p = document.createElement('span');
        p.className = 'ach-particle';
        const angle = (i / 10) * 360;
        const dist = 40 + Math.random() * 40;
        const tx = Math.cos(angle * Math.PI / 180) * dist;
        const ty = Math.sin(angle * Math.PI / 180) * dist;
        p.style.cssText = `
          left:${20 + Math.random() * 60}%;
          top:${20 + Math.random() * 60}%;
          background:${colors[i % colors.length]};
          --tx:translate(${tx}px,${ty}px);
          animation-delay:${Math.random() * 0.15}s;
          width:${4 + Math.random() * 5}px;
          height:${4 + Math.random() * 5}px;
        `;
        pContainer.appendChild(p);
      }
    }
  });

  // ── 3. Canvas sparkles ──
  const canvas = document.getElementById('sparkleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const section = canvas.parentElement;
  let sparkles = [];
  let raf;

  function resizeCanvas() {
    canvas.width  = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function spawnSparkle() {
    sparkles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1.5 + Math.random() * 2.5,
      alpha: 0,
      phase: Math.random() * Math.PI * 2,
      speed: 0.015 + Math.random() * 0.02,
      life: 0,
      maxLife: 80 + Math.random() * 80,
    });
  }

  function drawSparkle(s) {
    const pulse = Math.sin(s.phase + s.life * s.speed) * 0.5 + 0.5;
    ctx.save();
    ctx.globalAlpha = s.alpha * pulse;
    ctx.fillStyle = '#e91e63';
    ctx.shadowColor = '#f48fb1';
    ctx.shadowBlur  = 8;
    // 4-point star
    ctx.beginPath();
    const arms = 4;
    for (let i = 0; i < arms * 2; i++) {
      const a = (i * Math.PI) / arms;
      const rr = i % 2 === 0 ? s.r : s.r * 0.4;
      i === 0 ? ctx.moveTo(s.x + rr * Math.cos(a), s.y + rr * Math.sin(a))
              : ctx.lineTo(s.x + rr * Math.cos(a), s.y + rr * Math.sin(a));
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function tickSparkles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.25) spawnSparkle();

    sparkles = sparkles.filter(s => s.life < s.maxLife);
    sparkles.forEach(s => {
      s.life++;
      s.y -= 0.4;
      // fade in first 25%, hold, fade out last 25%
      const pct = s.life / s.maxLife;
      if (pct < 0.25)      s.alpha = pct / 0.25;
      else if (pct > 0.75) s.alpha = (1 - pct) / 0.25;
      else                 s.alpha = 1;
      drawSparkle(s);
    });

    raf = requestAnimationFrame(tickSparkles);
  }

  // only run when section in view to save resources
  const canvasObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      if (!raf) tickSparkles();
    } else {
      cancelAnimationFrame(raf);
      raf = null;
    }
  }, { threshold: 0.05 });
  canvasObs.observe(section);

  // ── 4. Lightbox modal on card click ──
  const modal         = document.getElementById('achModal');
  const modalImg      = document.getElementById('achModalImg');
  const modalLoader   = document.getElementById('achModalLoader');
  const modalTitle    = document.getElementById('achModalTitle');
  const modalClose    = document.getElementById('achModalClose');
  const modalBackdrop = document.getElementById('achModalBackdrop');

  function openModal(card) {
    const title    = card.dataset.title || '';
    
    // Get local image path from the card's img element
    const localImg = card.querySelector('.ach-img');
    const imgUrl   = localImg ? localImg.src : '';

    // reset state
    modalImg.classList.remove('loaded');
    modalImg.src = '';
    modalLoader.classList.remove('hide');
    modalTitle.textContent = title;

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    if (imgUrl) {
      modalImg.onload = () => {
        modalImg.classList.add('loaded');
        modalLoader.classList.add('hide');
      };
      modalImg.onerror = () => {
        // Jika gambar lokal tidak bisa dimuat, tetap tampilkan tombol Drive
        modalLoader.classList.add('hide');
        modalImg.alt = 'Gambar tidak dapat dimuat. Silakan buka di Google Drive.';
        modalImg.classList.add('loaded');
      };
      modalImg.src = imgUrl;
    }
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { if (modalImg) modalImg.src = ''; }, 350);
  }

  if (modal) {
    cards.forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => openModal(card));
    });
    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });
  }
}

// ── AUTO PLAY SLIDERS ──
let projAutoInterval = null;

function startProjectAutoPlay() {
  stopProjectAutoPlay();
  projAutoInterval = setInterval(() => {
    if (!projIsTransitioning) {
      projScroll(1);
    }
  }, 3000);
}

function stopProjectAutoPlay() {
  if (projAutoInterval) {
    clearInterval(projAutoInterval);
    projAutoInterval = null;
  }
}

function initCursorEffect() {
  if (document.querySelector('.custom-cursor')) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.innerHTML = '<span class="cursor-core"></span>';
  document.body.appendChild(cursor);

  let tx = 0, ty = 0;
  let cx = 0, cy = 0;

  window.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
  }, { passive: true });

  (function loop() {
    cx += (tx - cx) * 0.25; // faster lerp
    cy += (ty - cy) * 0.25;
    // translate with -50% offset in same string
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();

  const TEXT_TAGS = new Set(['p','h1','h2','h3','h4','h5','h6','span','li','label','strong','em','td','th']);
  const CLICK_SEL = 'a, button, .btn, .proj-btn, .social-link, .tag, .pill, .slider-btn, input, textarea, select, .bc, .acard, .proj-card-new, .ach-card, .soft-tile';

  document.addEventListener('mouseover', e => {
    const el = e.target;
    if (el.closest(CLICK_SEL)) {
      cursor.classList.add('cursor--hover');
      cursor.classList.remove('cursor--text');
    } else if (TEXT_TAGS.has(el.tagName.toLowerCase())) {
      cursor.classList.add('cursor--text');
      cursor.classList.remove('cursor--hover');
    } else {
      cursor.classList.remove('cursor--hover', 'cursor--text');
    }
  }, { passive: true });

  window.addEventListener('mousedown', () => cursor.classList.add('cursor--active'));
  window.addEventListener('mouseup',   () => cursor.classList.remove('cursor--active'));
}

document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initScrollReveal();
  initHeroTyping();
  initTiltCards();
  initSkillAnimations();
  initCursorEffect();
  initProjectReveal();
  initAchievements();

  // ── NEW: all-page enhancements ──
  initGlobalSparkleCanvas();
  initRichScrollReveal();
  initTagPopReveal();
  initSoftTileRipple();
  initSectionTitleLines();
  initNavbarScrollEffect();
  initCounterNumbers();
  initPageBannerParticles();
  initFloatingBgShapes();
});

// ══════════════════════════════════════
//   GLOBAL SPARKLE CANVAS (all pages)
// ══════════════════════════════════════
function initGlobalSparkleCanvas() {
  const canvas = document.createElement('canvas');
  canvas.id = 'globalSparkleCanvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#e91e63','#f48fb1','#c2185b','#ff80ab','#fce4ec'];
  let sparks = [];

  function spawn(x, y) {
    for (let i = 0; i < 3; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.6 + Math.random() * 1.4;
      sparks.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.8,
        r: 1.5 + Math.random() * 2.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0, maxLife: 40 + Math.random() * 30,
      });
    }
  }

  // spawn on mousemove (throttled)
  let lastSpawn = 0;
  window.addEventListener('mousemove', e => {
    const now = Date.now();
    if (now - lastSpawn < 60) return;
    lastSpawn = now;
    spawn(e.clientX, e.clientY);
  });

  // auto ambient sparkles
  setInterval(() => {
    spawn(
      Math.random() * window.innerWidth,
      Math.random() * window.innerHeight * 0.6
    );
  }, 800);

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sparks = sparks.filter(s => s.life < s.maxLife);
    sparks.forEach(s => {
      s.life++;
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.035; // gravity
      const pct = s.life / s.maxLife;
      const alpha = pct < 0.3 ? pct / 0.3 : 1 - (pct - 0.3) / 0.7;

      ctx.save();
      ctx.globalAlpha = alpha * 0.7;
      ctx.fillStyle = s.color;
      ctx.shadowColor = s.color;
      ctx.shadowBlur = 6;
      // draw 4-point star
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        const rr = i % 2 === 0 ? s.r : s.r * 0.38;
        i === 0
          ? ctx.moveTo(s.x + rr * Math.cos(a), s.y + rr * Math.sin(a))
          : ctx.lineTo(s.x + rr * Math.cos(a), s.y + rr * Math.sin(a));
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(tick);
  }
  tick();
}

// ══════════════════════════════════════
//   RICH SCROLL REVEAL (Home, About, Skills, CV)
// ══════════════════════════════════════
function initRichScrollReveal() {
  // Only apply reveal to elements that are NOT already animated by .fu class
  const isFu = el => el.classList.contains('fu') || el.classList.contains('fu1') || el.classList.contains('fu2') || el.classList.contains('fu3');

  const leftSelectors  = ['.acard:nth-child(odd)', '.cv-block', '.sk-card:first-child', '.about-sidebar'];
  const rightSelectors = ['.acard:nth-child(even)', '.cv-panel', '.sk-card:last-child', '.about-body-right'];
  const upSelectors    = ['.soft-tile', '.edu-step', '.cv-tl-item'];

  function addReveal(selector, cls) {
    document.querySelectorAll(selector).forEach(el => {
      if (isFu(el)) return; // skip elements already handled by CSS animations
      if (el.classList.contains('reveal-ready') || el.classList.contains('reveal-left') || el.classList.contains('reveal-right')) return;
      el.classList.add(cls);
    });
  }

  leftSelectors.forEach(s  => addReveal(s, 'reveal-left'));
  rightSelectors.forEach(s => addReveal(s, 'reveal-right'));
  upSelectors.forEach(s    => addReveal(s, 'reveal-ready'));

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const siblings = Array.from(el.parentElement?.children || [el]);
      const idx = siblings.indexOf(el);
      el.style.transitionDelay = `${Math.min(idx * 75, 480)}ms`;
      el.classList.add('revealed');
      obs.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });

  document.querySelectorAll('.reveal-ready, .reveal-left, .reveal-right')
    .forEach(el => obs.observe(el));
}

// ══════════════════════════════════════
//   TAG / PILL POP REVEAL
// ══════════════════════════════════════
function initTagPopReveal() {
  // Skip tags inside .bc-taglist — sudah dihandle animasi CSS fadeInUp di container .tags
  const tags = document.querySelectorAll('.tag:not(.bc-taglist .tag), .pill, .proj-tag, .banner-chip');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const siblings = Array.from(el.parentElement?.children || [el]);
      const idx = siblings.indexOf(el);
      const delay = idx * 60;

      setTimeout(() => {
        el.classList.add('pop-ready', 'popped');
        el.style.animationDelay = `${delay}ms`;

        // setelah animasi selesai, bersihkan class & inline style supaya tidak konflik
        const totalDuration = 450 + delay;
        setTimeout(() => {
          el.classList.remove('pop-ready', 'popped');
          el.style.opacity = '';
          el.style.animationDelay = '';
        }, totalDuration + 50);
      }, 0);

      obs.unobserve(el);
    });
  }, { threshold: 0.2 });

  tags.forEach(t => {
    // Jangan set opacity 0 kalau parent sudah handle animasi
    if (!t.closest('.bc-taglist')) {
      t.style.opacity = '0';
    }
    obs.observe(t);
  });
}

// ══════════════════════════════════════
//   SOFT TILE MOUSE RIPPLE (Skills page)
// ══════════════════════════════════════
function initSoftTileRipple() {
  document.querySelectorAll('.soft-tile').forEach(tile => {
    tile.addEventListener('mousemove', e => {
      const rect = tile.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      const my = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
      tile.style.setProperty('--mx', mx + '%');
      tile.style.setProperty('--my', my + '%');
    });

    // bounce the emoji on hover
    const emoji = tile.querySelector('div');
    if (emoji) {
      tile.addEventListener('mouseenter', () => {
        emoji.style.transition = 'transform .35s cubic-bezier(.34,1.56,.64,1)';
        emoji.style.transform = 'scale(1.4) rotate(-8deg)';
      });
      tile.addEventListener('mouseleave', () => {
        emoji.style.transform = 'scale(1) rotate(0deg)';
      });
    }
  });
}

// ══════════════════════════════════════
//   SECTION TITLE UNDERLINE DRAW
// ══════════════════════════════════════
function initSectionTitleLines() {
  const titles = document.querySelectorAll('.section-title, .cv-block-head, .sk-card h3, .about-body-right h3');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('line-drawn');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  titles.forEach(t => obs.observe(t));
}

// ══════════════════════════════════════
//   NAVBAR SCROLL GLOW
// ══════════════════════════════════════
function initNavbarScrollEffect() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.style.boxShadow = '0 4px 28px rgba(233,30,99,0.18)';
      nav.style.background = 'rgba(255,255,255,0.92)';
      nav.style.backdropFilter = 'blur(12px)';
    } else {
      nav.style.boxShadow = '';
      nav.style.background = '';
      nav.style.backdropFilter = '';
    }
  }, { passive: true });
}

// ══════════════════════════════════════
//   NUMBER COUNTER ANIMATION (CV stats)
// ══════════════════════════════════════
function initCounterNumbers() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      let current = 0;
      const step = Math.ceil(target / 40);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
      }, 30);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
}

// ══════════════════════════════════════
//   PAGE BANNER PARTICLE BURST
// ══════════════════════════════════════
function initPageBannerParticles() {
  const banner = document.querySelector('.page-banner');
  if (!banner) return;

  const colors = ['#ffffff','#f48fb1','#fce4ec','#ff80ab','#e91e63'];
  const count = 18;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    const size = 4 + Math.random() * 8;
    const x = 5 + Math.random() * 90;
    const dur = 4 + Math.random() * 5;
    const delay = Math.random() * 5;

    p.style.cssText = `
      position:absolute;
      left:${x}%;
      bottom:${-size}px;
      width:${size}px;
      height:${size}px;
      border-radius:50%;
      background:${colors[i % colors.length]};
      opacity:0;
      animation: bannerFloat ${dur}s ease-in-out ${delay}s infinite;
      pointer-events:none;
    `;
    banner.appendChild(p);
  }

  // inject keyframes once
  if (!document.getElementById('bannerFloatStyle')) {
    const style = document.createElement('style');
    style.id = 'bannerFloatStyle';
    style.textContent = `
      @keyframes bannerFloat {
        0%   { opacity:0; transform: translateY(0) scale(0.5); }
        20%  { opacity:.7; }
        80%  { opacity:.4; }
        100% { opacity:0; transform: translateY(-${banner.offsetHeight + 20}px) scale(1.2) rotate(180deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

// ══════════════════════════════════════
//   FLOATING BACKGROUND SHAPES
// ══════════════════════════════════════
function initFloatingBgShapes() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const shapes = [
    // type, size, color, duration, delay, left%, rotation
    { type: 'ring',      w: 80,  h: 80,  dur: 18, delay: 0,   left: 8  },
    { type: 'ring-fill', w: 40,  h: 40,  dur: 14, delay: 2,   left: 20 },
    { type: 'ring',      w: 120, h: 120, dur: 22, delay: 5,   left: 75 },
    { type: 'ring-fill', w: 24,  h: 24,  dur: 12, delay: 1,   left: 88 },
    { type: 'ring',      w: 60,  h: 60,  dur: 16, delay: 7,   left: 45 },
    { type: 'ring-fill', w: 50,  h: 50,  dur: 20, delay: 3,   left: 60 },
    { type: 'ring',      w: 90,  h: 90,  dur: 25, delay: 9,   left: 33 },
    { type: 'ring-fill', w: 30,  h: 30,  dur: 11, delay: 4,   left: 92 },
    { type: 'ring',      w: 55,  h: 55,  dur: 17, delay: 6,   left: 15 },
    { type: 'ring-fill', w: 70,  h: 70,  dur: 19, delay: 8,   left: 55 },
    { type: 'ring',      w: 100, h: 100, dur: 23, delay: 11,  left: 70 },
    { type: 'ring-fill', w: 20,  h: 20,  dur: 10, delay: 0.5, left: 38 },
  ];

  shapes.forEach(s => {
    const el = document.createElement('div');
    el.className = `bg-shape ${s.type}`;
    el.style.cssText = `
      width: ${s.w}px;
      height: ${s.h}px;
      left: ${s.left}%;
      bottom: -${s.h + 20}px;
      animation-duration: ${s.dur}s;
      animation-delay: ${s.delay}s;
      animation-timing-function: ease-in-out;
    `;
    canvas.appendChild(el);
  });
}

// ══════════════════════════════════════
//   PAGE TRANSITION — REMOVED
// ══════════════════════════════════════
function initPageTransition() {}

// ══════════════════════════════════════
//   SCROLL PROGRESS BAR
// ══════════════════════════════════════
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  // Append to <html> not <body> so body's transform animation doesn't affect fixed positioning
  document.documentElement.appendChild(bar);

  function updateBar() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }

  window.addEventListener('scroll', updateBar, { passive: true });
  // Also update on resize in case page height changes
  window.addEventListener('resize', updateBar, { passive: true });
}

// ══════════════════════════════════════
//   GLITCH TEXT on hero h1
// ══════════════════════════════════════
function initGlitchText() {
  // Disabled — caused h1 to disappear in hero
}

// ══════════════════════════════════════
//   MAGNETIC BUTTONS
// ══════════════════════════════════════
function initMagneticButtons() {
  const btns = document.querySelectorAll('.btn-white, .btn-border, .btn-pink, .btn-ghost, .proj-btn, .slider-btn');
  btns.forEach(btn => {
    btn.classList.add('magnetic-btn');

    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.35;
      const dy = (e.clientY - cy) * 0.35;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
}

// ══════════════════════════════════════
//   RIPPLE CLICK EFFECT
// ══════════════════════════════════════
function initRippleEffect() {
  const targets = document.querySelectorAll(
    '.btn-white, .btn-border, .btn-pink, .btn-ghost, .proj-btn, .nav-links a, .social-link'
  );

  targets.forEach(el => {
    el.classList.add('ripple-container');
    el.addEventListener('click', e => {
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple-wave';
      ripple.style.cssText = `width:${size}px; height:${size}px; left:${x}px; top:${y}px;`;
      el.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// ══════════════════════════════════════
//   TOAST NOTIFICATION
// ══════════════════════════════════════
function initToastSystem() {
  // Create container
  const container = document.createElement('div');
  container.id = 'toast-container';
  document.body.appendChild(container);

  // Expose global function
  window.showToast = function(icon, message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('show'));
    });

    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  };

  // Social links toast
  document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', () => {
      const icon = link.querySelector('i');
      if (!icon) return;
      if (icon.classList.contains('fa-instagram')) showToast('📸', 'Opening Instagram...');
      else if (icon.classList.contains('fa-tiktok'))    showToast('🎵', 'Opening TikTok...');
      else if (icon.classList.contains('fa-youtube'))   showToast('▶️', 'Opening YouTube...');
    });
  });

  // Copy email on CV page
  document.querySelectorAll('.cv-info-row').forEach(row => {
    const emailSpan = row.querySelector('span:last-child');
    if (emailSpan && emailSpan.textContent.includes('@')) {
      row.style.cursor = 'pointer';
      row.title = 'Klik untuk copy email';
      row.addEventListener('click', () => {
        navigator.clipboard.writeText(emailSpan.textContent.trim()).then(() => {
          showToast('📋', 'Email berhasil dicopy!');
        });
      });
    }
  });
}

// ══════════════════════════════════════
//   CARD FLIP — About page (DISABLED)
// ══════════════════════════════════════
function initCardFlip() {
  // Removed — caused layout issues with tag content inside cards
}

// ══════════════════════════════════════
//   TYPING CURSOR on tagline
// ══════════════════════════════════════
function initTypingCursor() {
  const tagline = document.querySelector('.bc-hero-text .tagline');
  if (!tagline) return;
  tagline.classList.add('typing-cursor');
}

// ══════════════════════════════════════
//   INIT ALL NEW FEATURES
// ══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initPageTransition();
  initScrollProgress();
  initGlitchText();
  initMagneticButtons();
  initRippleEffect();
  initToastSystem();
  initCardFlip();
  initTypingCursor();
});

// ══════════════════════════════════════
//   TEXT LETTER REVEAL (semua halaman)
// ══════════════════════════════════════
function initTextEffects() {
  // Letter reveal — section headings only (NOT h1, NOT hero elements)
  const headings = document.querySelectorAll(
    '.section-title, .cv-block-head, .sk-card h3, .cert-section-title'
  );

  headings.forEach(el => {
    if (el.querySelector('i, img, svg')) return;
    if (el.dataset.split) return;
    el.dataset.split = '1';

    const text = el.textContent;
    el.textContent = '';
    el.style.display = 'inline-block';

    text.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.cssText = `
        display: inline-block;
        opacity: 0;
        transform: translateY(12px);
        transition: opacity 0.4s ease ${i * 30}ms, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 30}ms;
      `;
      el.appendChild(span);
    });

    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      el.querySelectorAll('span').forEach(s => {
        s.style.opacity = '1';
        s.style.transform = 'translateY(0)';
      });
      obs.unobserve(el);
    }, { threshold: 0.5 });
    obs.observe(el);
  });

  // Year hover effect
  document.querySelectorAll('.cv-tl-year, .ach-year').forEach(el => {
    el.style.transition = 'transform 0.3s ease, color 0.3s ease';
    el.addEventListener('mouseenter', () => {
      el.style.transform = 'scale(1.1) translateX(4px)';
      el.style.color = 'var(--pink)';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.color = '';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTextEffects();
});

// ══════════════════════════════════════
//   BACK TO TOP
// ══════════════════════════════════════
function initBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.innerHTML = '↑';
  btn.title = 'Back to top';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ══════════════════════════════════════
//   DARK MODE TOGGLE
// ══════════════════════════════════════
function initDarkMode() {
  const btn = document.createElement('button');
  btn.id = 'theme-toggle';
  btn.innerHTML = '🌙';
  btn.title = 'Toggle dark mode';
  document.body.appendChild(btn);

  // Restore saved preference
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    btn.innerHTML = '☀️';
  }

  btn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    btn.innerHTML = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

// ══════════════════════════════════════
//   SKILL BAR TOOLTIP
// ══════════════════════════════════════
function initSkillTooltips() {
  document.querySelectorAll('.skill-row').forEach(row => {
    const fill = row.querySelector('.skill-fill');
    if (!fill) return;
    const pct = parseInt(fill.dataset.w || 0);

    let level;
    if (pct >= 90)      level = '🌟 Expert';
    else if (pct >= 70) level = '💪 Intermediate';
    else if (pct >= 50) level = '📈 Developing';
    else                level = '🌱 Beginner';

    const tip = document.createElement('div');
    tip.className = 'skill-tooltip';
    tip.textContent = `${level} · ${pct}%`;
    row.appendChild(tip);
  });
}

// ══════════════════════════════════════
//   CONFETTI BURST
// ══════════════════════════════════════
function spawnConfetti(x, y) {
  const colors = ['#e91e63','#f48fb1','#c2185b','#ff80ab','#fce4ec','#ffffff','#ff4081'];
  const count = 40;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';

    const angle = (Math.random() * 360);
    const dist  = 80 + Math.random() * 160;
    const cx    = Math.cos(angle * Math.PI / 180) * dist + 'px';
    const cy    = (Math.random() * -200 - 60) + 'px';
    const cr    = (Math.random() * 720 - 360) + 'deg';
    const dur   = 0.6 + Math.random() * 0.8;

    el.style.cssText = `
      left: ${x}px;
      top: ${y}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      --cx: ${cx};
      --cy: ${cy};
      --cr: ${cr};
      animation-duration: ${dur}s;
      width: ${4 + Math.random() * 8}px;
      height: ${4 + Math.random() * 8}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), dur * 1000 + 100);
  }
}

function initConfetti() {
  // Trigger on hero CTA buttons
  document.querySelectorAll('.btn-white, .btn-border, .bc-hero-btns a').forEach(btn => {
    btn.addEventListener('click', e => {
      spawnConfetti(e.clientX, e.clientY);
    });
  });
}

// ══════════════════════════════════════
//   INIT ALL
// ══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initBackToTop();
  initDarkMode();
  initSkillTooltips();
  initConfetti();
});

// ══════════════════════════════════════
//   BANNER TYPING EFFECT
// ══════════════════════════════════════
function initBannerTyping() {
  const subtitle = document.querySelector('.page-banner p');
  if (!subtitle) return;

  const original = subtitle.textContent.trim();
  subtitle.textContent = '';
  subtitle.classList.add('banner-typing');

  let i = 0;
  const type = () => {
    if (i <= original.length) {
      subtitle.textContent = original.slice(0, i);
      i++;
      setTimeout(type, 45);
    } else {
      subtitle.classList.remove('banner-typing');
    }
  };
  setTimeout(type, 400);
}

// ══════════════════════════════════════
//   IMAGE LIGHTBOX
// ══════════════════════════════════════
function initImageLightbox() {
  // Create lightbox
  const lb = document.createElement('div');
  lb.id = 'img-lightbox';
  lb.innerHTML = `<button id="img-lightbox-close">✕</button><img src="" alt="preview">`;
  document.body.appendChild(lb);

  const lbImg = lb.querySelector('img');
  const lbClose = lb.querySelector('#img-lightbox-close');

  function open(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => lbImg.src = '', 300);
  }

  lbClose.addEventListener('click', close);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  // Make profile photos zoomable
  const targets = document.querySelectorAll(
    '.bc-hero-photo, .cv-photo, .bc-photo img, .about-sidebar img:not(.icon img)'
  );
  targets.forEach(img => {
    img.classList.add('zoomable');
    img.addEventListener('click', () => open(img.src, img.alt));
  });
}

// ══════════════════════════════════════
//   FLOATING EMOJI from quote card
// ══════════════════════════════════════
function initFloatingEmoji() {
  const quotes = document.querySelectorAll('.bc-quote, .cv-quote');
  const emojis = ['✨','🌸','💕','⭐','🎀','💫','🌷','✿','♡','🩷'];

  quotes.forEach(card => {
    setInterval(() => {
      const em = document.createElement('span');
      em.className = 'float-emoji';
      em.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      em.style.cssText = `
        left: ${10 + Math.random() * 80}%;
        bottom: 10px;
      `;
      card.style.position = 'relative';
      card.style.overflow = 'visible';
      card.appendChild(em);
      setTimeout(() => em.remove(), 2600);
    }, 1800);
  });
}

// ══════════════════════════════════════
//   MUSIC PLAYER — REMOVED
// ══════════════════════════════════════
function initSpotifyWidget() {}

// ══════════════════════════════════════
//   DRAGGABLE STICKERS — REMOVED
// ══════════════════════════════════════
function initDraggableStickers() {}

// ══════════════════════════════════════
//   INIT ALL NEW FEATURES
// ══════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initBannerTyping();
  initImageLightbox();
  initFloatingEmoji();
  initSpotifyWidget();
  initDraggableStickers();
});

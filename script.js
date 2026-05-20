/* ============================================================
   SCRIPT.JS — GSAP Animations, Parallax, Noise, Modal
   ============================================================ */

// Always start from the top on refresh
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);


/* ----------------------------------------------------------
   1. NOISE CANVAS
   ---------------------------------------------------------- */
(function generateNoise() {
  const canvas = document.getElementById('noiseCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderNoise();
  }

  function renderNoise() {
    const w = canvas.width;
    const h = canvas.height;
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255 | 0;
      data[i] = data[i + 1] = data[i + 2] = v;
      data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  resize();
  window.addEventListener('resize', resize);
}());

/* ----------------------------------------------------------
   2. GSAP HERO ENTRANCE ANIMATION
   ---------------------------------------------------------- */
window.addEventListener('load', () => {
  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Background + image entrance
  tl.fromTo('.hero',
    { opacity: 0 },
    { opacity: 1, duration: 1.2 },
    0
  );

  tl.fromTo('#heroImageWrap',
    { scale: 1.12, opacity: 0 },
    { scale: 1, opacity: 1, duration: 2, ease: 'power2.out' },
    0.2
  );

  // Staggered text entrance
  tl.fromTo('#heroIntro',
    { x: -40, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.9 },
    0.6
  );

  tl.fromTo('#heroName',
    { x: -60, opacity: 0 },
    { x: 0, opacity: 1, duration: 1 },
    0.78
  );

  tl.fromTo('#heroRole',
    { x: -40, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.9 },
    0.95
  );

  tl.fromTo('#heroCaption',
    { x: -30, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.8 },
    1.1
  );

  tl.fromTo('#heroActions',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8 },
    1.25
  );

  // Make content visible (it starts at opacity: 0 via CSS)
  tl.set('#heroContent', { opacity: 1 }, 0.6);

  // Scroll hint
  tl.fromTo('#heroScroll',
    { opacity: 0 },
    { opacity: 1, duration: 0.8 },
    1.5
  );
});

/* ----------------------------------------------------------
   3. PARALLAX SCROLL (HERO IMAGE + TEXT FADE)
   ---------------------------------------------------------- */
function initParallax() {
  const heroImageWrap = document.getElementById('heroImageWrap');
  if (!heroImageWrap) return;

  // Parallax image only — hero text stays visible while scrolling
  gsap.to(heroImageWrap, {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    },
    yPercent: 18,
    ease: 'none',
  });
}

/* ----------------------------------------------------------
   4. SECTION REVEAL ANIMATIONS
   ---------------------------------------------------------- */
function initSectionAnimations() {
  // Works cards — stagger
  gsap.fromTo('.work-card',
    { y: 60, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 0.9, stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#worksGrid',
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      }
    }
  );

  // Photos grid
  gsap.fromTo('.photo-item',
    { scale: 0.95, opacity: 0 },
    {
      scale: 1, opacity: 1, duration: 0.8, stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#photosGrid',
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      }
    }
  );

  // Service cards
  gsap.fromTo('.service-card',
    { y: 50, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 0.8, stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.services__grid',
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      }
    }
  );

  // Contact title
  gsap.fromTo('.contact__title',
    { x: -60, opacity: 0 },
    {
      x: 0, opacity: 1, duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.contact',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      }
    }
  );

  // Section headers
  document.querySelectorAll('.section-header').forEach(el => {
    gsap.fromTo(el,
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  });
}

/* ----------------------------------------------------------
   5. NAV SCROLL EFFECT
   ---------------------------------------------------------- */
function initNav() {
  const nav = document.getElementById('nav');

  // Scrolled style
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Active section indicator
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a:not(.nav__cta)');

  function setActive(id) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === '#' + id);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { threshold: 0.3 });

  sections.forEach(section => observer.observe(section));
}

/* ----------------------------------------------------------
   6. VIDEO MODAL
   ---------------------------------------------------------- */
function initModal() {
  const modal = document.getElementById('videoModal');
  const videoPlayer = document.getElementById('videoPlayer');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalTitle = document.getElementById('modalTitle');

  function openModal(videoSrc, title) {
    videoPlayer.src = videoSrc;
    videoPlayer.currentTime = 0;
    modalTitle.textContent = title || '';
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    videoPlayer.play().then(() => {
      const el = videoPlayer;
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.webkitEnterFullscreen) el.webkitEnterFullscreen(); // iOS Safari
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
    }).catch(() => {});
  }

  // When user exits fullscreen (e.g. press Escape in fullscreen), also close modal
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
  document.addEventListener('webkitfullscreenchange', () => {
    if (!document.webkitFullscreenElement && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    videoPlayer.pause();
    setTimeout(() => { videoPlayer.src = ''; }, 400);
  }

  // Click to open modal
  document.querySelectorAll('.work-card').forEach(card => {
    const preview = card.querySelector('.work-card__preview');

    // Hover: silently preview the video
    card.addEventListener('mouseenter', () => {
      if (preview) {
        preview.currentTime = 0;
        preview.play().catch(() => {});
      }
    });
    card.addEventListener('mouseleave', () => {
      if (preview) {
        preview.pause();
        preview.currentTime = 0;
      }
    });

    // Click: open fullscreen modal
    card.addEventListener('click', () => {
      const videoSrc = card.dataset.video;
      const title = card.dataset.title;
      if (videoSrc) openModal(videoSrc, title);
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    if (e.key === ' ' && modal.classList.contains('is-open')) {
      e.preventDefault();
      videoPlayer.paused ? videoPlayer.play() : videoPlayer.pause();
    }
  });
}

/* ----------------------------------------------------------
   7. CURSOR GLOW (DESKTOP)
   ---------------------------------------------------------- */
function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch devices

  const glow = document.createElement('div');
  glow.id = 'cursorGlow';
  glow.style.cssText = `
    position: fixed;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,200,0.05) 0%, transparent 65%);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    top: 0; left: 0;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
}

/* ----------------------------------------------------------
   8. HAMBURGER (MOBILE)
   ---------------------------------------------------------- */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.querySelector('.nav__links');
  if (!btn || !links) return;

  function openMenu() {
    links.classList.add('is-open');
    btn.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    // Animate spans to X
    const spans = btn.querySelectorAll('span');
    spans[0].style.cssText = 'transform: translateY(7px) rotate(45deg); background: #00F5D4;';
    spans[1].style.cssText = 'opacity: 0; transform: scaleX(0);';
    spans[2].style.cssText = 'transform: translateY(-7px) rotate(-45deg); background: #00F5D4;';
  }

  function closeMenu() {
    links.classList.remove('is-open');
    btn.classList.remove('is-active');
    document.body.style.overflow = '';
    const spans = btn.querySelectorAll('span');
    spans[0].style.cssText = '';
    spans[1].style.cssText = '';
    spans[2].style.cssText = '';
  }

  btn.addEventListener('click', () => {
    links.classList.contains('is-open') ? closeMenu() : openMenu();
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && links.classList.contains('is-open')) closeMenu();
  });
}


/* ----------------------------------------------------------
   9. IMAGE LIGHTBOX (POSTER SECTION)
   ---------------------------------------------------------- */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 350);
  }

  document.querySelectorAll('.photo-item[data-src]').forEach(item => {
    item.addEventListener('click', () => {
      const src = item.dataset.src;
      const alt = item.querySelector('img')?.alt || '';
      openLightbox(src, alt);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
  });
}

/* ----------------------------------------------------------
   INIT ALL
   ---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Wait a tick for GSAP to be loaded (from CDN in <head>)
  requestAnimationFrame(() => {
    if (typeof gsap !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      initParallax();
      initSectionAnimations();
    }
    initNav();
    initModal();
    initLightbox();
    initCursorGlow();
    initHamburger();
  });
});

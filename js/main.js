gsap.registerPlugin(ScrollTrigger);

// === ФИКС МОБИЛЬНОГО СКРОЛЛА ===
// Запрещаем GSAP обновляться, когда на телефоне скрывается адресная строка (resize по вертикали)
ScrollTrigger.config({
  ignoreMobileResize: true
});

// Обновление переменной --vh
function updateVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
updateVh();

// === УМНЫЙ РЕСАЙЗ ===
// Если ширина экрана не изменилась (а изменилась только высота из-за скрытия меню браузера),
// мы НЕ перезагружаем анимации. Это убирает "прыжки" на телефоне.
let lastWidth = window.innerWidth;

window.addEventListener('resize', () => {
  if (window.innerWidth !== lastWidth) {
    lastWidth = window.innerWidth;
    updateVh();
    clearTimeout(window.__resizeTimer);
    window.__resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 220);
  }
});

// Оптимизация для мобильных устройств
function optimizeForMobile() {
  if (window.innerWidth <= 768) {
    gsap.config({
      nullTargetWarn: false,
      units: { left: "%", top: "%", rotation: "rad" }
    });

    const particles = document.querySelector('.particles-container');
    if (particles) {
      particles.style.display = 'none';
    }
  }
}

// Page animations
function initAnimations() {
  // Hero animations
  const tl = gsap.timeline();
  tl.from('.avatar-container', {
    duration: 1.2,
    autoAlpha: 0,
    y: 30,
    scale: 0.8,
    rotation: -5,
    ease: 'power3.out'
  })
  .from('.hero-title', {
    duration: 1.1,
    autoAlpha:0,
    y: 25,
    ease: 'power3.out'
  }, '-=0.6')
  .from('.hero-subtitle', {
    duration: 0.9,
    autoAlpha:0,
    y: 20,
    ease: 'power3.out'
  }, '-=0.5')
  .from('.social-icons-container', {
    duration: 0.8,
    autoAlpha:0,
    y: 15,
    stagger: 0.1,
    ease: 'power3.out'
  }, '-=0.4');

  // АНИМАЦИИ ДЛЯ ПК (Ширина > 768px)
  if (window.innerWidth > 768) {
    gsap.utils.toArray('.skills-section-large').forEach(el => {
      gsap.fromTo(el, { autoAlpha: 0, y: 30 }, {
        duration: 1.1,
        autoAlpha: 1,
        y: 0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
          markers: false
        }
      });
    });

    gsap.utils.toArray('.skill-category').forEach((it, i) => {
      gsap.fromTo(it, { autoAlpha: 0, y: 20, scale: 0.95 }, {
        duration: 0.9,
        autoAlpha:1,
        y:0,
        scale: 1,
        ease:'power3.out',
        scrollTrigger: {
          trigger: it,
          start: 'top 85%',
          end: 'bottom 15%',
          toggleActions: 'play none none reverse'
        },
        delay: i*0.1
      });
    });

    gsap.utils.toArray('.stat-item').forEach((it, i) => {
      gsap.fromTo(it, { autoAlpha: 0, y: 15 }, {
        duration: 0.8,
        autoAlpha:1,
        y:0,
        ease:'power3.out',
        scrollTrigger: {
          trigger: it,
          start: 'top 90%',
          end: 'bottom 10%',
          toggleActions: 'play none none reverse'
        },
        delay: i*0.05
      });
    });

    // Projects animation
    gsap.utils.toArray('.projects-section').forEach(el => {
      gsap.fromTo(el, { autoAlpha: 0, y: 30 }, {
        duration: 1.1,
        autoAlpha: 1,
        y: 0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
          markers: false
        }
      });
    });

    // Project items animation
    gsap.utils.toArray('.project-item').forEach((it, i) => {
      gsap.fromTo(it, { autoAlpha: 0, y: 20, scale: 0.95 }, {
        duration: 0.9,
        autoAlpha:1,
        y:0,
        scale: 1,
        ease:'power3.out',
        scrollTrigger: {
          trigger: it,
          start: 'top 85%',
          end: 'bottom 15%',
          toggleActions: 'play none none reverse'
        },
        delay: i*0.1
      });
    });

    // Spotify player animation
    gsap.utils.toArray('.spotify-player').forEach(el => {
      gsap.fromTo(el, { autoAlpha: 0, y: 30, scale: 0.9 }, {
        duration: 1.2,
        autoAlpha: 1,
        y: 0,
        scale: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    // Footer animation
    gsap.fromTo('.footer', { autoAlpha: 0, y: 20 }, {
      duration: 1,
      autoAlpha: 1,
      y: 0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.footer',
        start: 'top 90%',
        end: 'bottom 10%',
        toggleActions: 'play none none reverse'
      }
    });
  } else {
    // АНИМАЦИИ ДЛЯ МОБИЛЬНЫХ (Упрощенные)
    // scrub: false - чтобы скролл не управлял анимацией напрямую (убирает рывки)
    // toggleActions: 'play none none none' - анимация играет 1 раз и не откатывается назад
    gsap.utils.toArray('.skills-section-large, .skill-category, .stat-item, .projects-section, .project-item, .spotify-player, .footer').forEach(el => {
      gsap.fromTo(el, { autoAlpha: 0, y: 20 }, {
        duration: 0.7,
        autoAlpha: 1,
        y: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none', // Важно для плавности на телефоне
          scrub: false
        }
      });
    });
  }
}

// Toggle project details
function toggleProjectById(projectId) {
  const el = document.getElementById(projectId);
  if (!el) return;
  const projectItem = el.closest('.project-item');
  const open = el.classList.contains('open');

  // Close others
  document.querySelectorAll('.project-details.open').forEach(d => {
    if (d !== el) {
      d.classList.remove('open');
      d.closest('.project-item').setAttribute('aria-expanded', 'false');
    }
  });

  if (open) {
    el.classList.remove('open');
    projectItem.setAttribute('aria-expanded', 'false');
  } else {
    el.classList.add('open');
    projectItem.setAttribute('aria-expanded', 'true');
  }
}

// Attach click handlers
function attachProjectToggles() {
  document.querySelectorAll('.project-item').forEach(item => {
    const header = item.querySelector('.project-header');
    const details = item.querySelector('.project-details');

    if (header && details) {
      header.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleProjectById(details.id);
      });

      // Keyboard support
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleProjectById(details.id);
        }
      });
    }

    // Prevent toggle when clicking on project button
    const projectButton = item.querySelector('.project-button');
    if (projectButton) {
      projectButton.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  });
}

// Images fallback
function imagesFallback() {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      this.style.display = 'none';
      const ph = document.createElement('div');
      ph.style.width = this.width ? this.width + 'px' : '140px';
      ph.style.height = this.height ? this.height + 'px' : '140px';
      ph.style.borderRadius = '12px';
      ph.style.background = 'linear-gradient(135deg, var(--gray-600), var(--black))';
      ph.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
      ph.style.border = '2px solid var(--gray-600)';
      this.parentNode && this.parentNode.appendChild(ph);
    });
  });
}

// Spotify player controls
function initSpotifyPlayer() {
  const playBtn = document.querySelector('.spotify-play-btn');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const progressBar = document.querySelector('.progress-bar');
  const progressFill = document.querySelector('.progress-bar-fill');

  let isPlaying = false;
  let currentProgress = 45;
  let progressInterval;

  // Play/Pause
  if (playBtn) {
    playBtn.addEventListener('click', function() {
      const svg = this.querySelector('svg');
      isPlaying = !isPlaying;

      if (isPlaying) {
        // Pause icon
        svg.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
        startProgress();
      } else {
        // Play icon
        svg.innerHTML = '<path d="M8 5v14l11-7z"/>';
        stopProgress();
      }

      // Анимация нажатия
      gsap.to(this, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      });
    });
  }

  // Previous track
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      // Анимация нажатия
      gsap.to(this, {
        scale: 0.85,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      });

      // Сброс прогресса при перемотке назад
      currentProgress = 0;
      progressFill.style.width = currentProgress + '%';
      stopProgress();
      if (isPlaying) startProgress();
    });
  }

  // Next track
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      // Анимация нажатия
      gsap.to(this, {
        scale: 0.85,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      });

      // Сброс прогресса при перемотке вперед
      currentProgress = 0;
      progressFill.style.width = currentProgress + '%';
      stopProgress();
      if (isPlaying) startProgress();
    });
  }

  // Progress bar click
  if (progressBar) {
    progressBar.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newProgress = (clickX / rect.width) * 100;
      currentProgress = Math.max(0, Math.min(100, newProgress));
      progressFill.style.width = currentProgress + '%';
    });
  }

  // Симуляция прогресса при воспроизведении
  function startProgress() {
    stopProgress();
    progressInterval = setInterval(() => {
      if (isPlaying && currentProgress < 100) {
        currentProgress += 0.2;
        progressFill.style.width = currentProgress + '%';
      } else if (currentProgress >= 100) {
        stopProgress();
        isPlaying = false;
        const playSvg = playBtn.querySelector('svg');
        playSvg.innerHTML = '<path d="M8 5v14l11-7z"/>';
      }
    }, 1000);
  }

  function stopProgress() {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  }
}

// Add floating particles effect
function addParticlesEffect() {
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'particles-container';
  particlesContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
  `;
  document.body.appendChild(particlesContainer);

  // Create particles
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 6 + 2}px;
      height: ${Math.random() * 6 + 2}px;
      background: linear-gradient(45deg, var(--gray-400), var(--gray-300));
      border-radius: 50%;
      opacity: ${Math.random() * 0.2 + 0.1};
      filter: blur(1px);
    `;

    gsap.set(particle, {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight
    });

    gsap.to(particle, {
      y: '+=100',
      rotation: 360,
      duration: Math.random() * 10 + 10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    particlesContainer.appendChild(particle);
  }
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  optimizeForMobile();
  initAnimations();
  attachProjectToggles();
  imagesFallback();
  initSpotifyPlayer();
  // addParticlesEffect(); // Закомментируйте эту строку, чтобы убрать частицы полностью
});

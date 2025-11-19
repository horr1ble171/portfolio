gsap.registerPlugin(ScrollTrigger);

// Функция определения мобильного устройства
function isMobileDevice() {
  return window.innerWidth <= 768;
}

// Обновление переменной --vh (только для мобильных)
function updateVh() {
  if (isMobileDevice()) {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
}

// Оптимизация для мобильных устройств
function optimizeForMobile() {
  if (isMobileDevice()) {
    gsap.config({
      nullTargetWarn: false,
      units: { left: "%", top: "%", rotation: "rad" }
    });

    ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true
    });
  }
}

// Page animations
function initAnimations() {
  const isMobile = isMobileDevice();

  // Hero animations (одинаковые для всех устройств)
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

  // Для десктопов используем полные анимации, для мобильных - упрощенные
  if (!isMobile) {
    initDesktopAnimations();
  } else {
    initMobileAnimations();
  }
}

// Полные анимации для десктопа (оригинальные)
function initDesktopAnimations() {
  // Skills animations
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
}

// Упрощенные анимации для мобильных
function initMobileAnimations() {
  const elements = [
    '.skills-section-large',
    '.skill-category',
    '.stat-item',
    '.projects-section',
    '.project-item',
    '.spotify-player',
    '.footer'
  ];

  elements.forEach(selector => {
    gsap.utils.toArray(selector).forEach(el => {
      gsap.fromTo(el, {
        autoAlpha: 0,
        y: 20
      }, {
        duration: 0.8,
        autoAlpha: 1,
        y: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
          scrub: false,
          once: true // Анимация срабатывает только один раз
        }
      });
    });
  });
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

// Оптимизация производительности (только для мобильных)
function optimizePerformance() {
  if (isMobileDevice()) {
    // Упрощаем анимации для мобильных
    gsap.config({
      force3D: false
    });

    // Предотвращаем блокировку скролла
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';

    // Улучшаем обработку касаний
    document.addEventListener('touchmove', function(e) {
      // Разрешаем нативный скролл
    }, { passive: true });
  }
}

// Обновление при ресайзе
function handleResize() {
  updateVh();

  // Обновляем ScrollTrigger с задержкой
  clearTimeout(window.__resizeTimer);
  window.__resizeTimer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  updateVh();
  optimizeForMobile();
  optimizePerformance();
  initAnimations();
  attachProjectToggles();
  imagesFallback();
  initSpotifyPlayer();

  // Обработчик ресайза
  window.addEventListener('resize', handleResize, { passive: true });
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
});

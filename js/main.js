gsap.registerPlugin(ScrollTrigger);

// === ФИКС МОБИЛЬНОГО СКРОЛЛА ===
ScrollTrigger.config({
  ignoreMobileResize: true
});

function updateVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
updateVh();

let lastWidth = window.innerWidth;

window.addEventListener('resize', () => {
  if (window.innerWidth !== lastWidth) {
    lastWidth = window.innerWidth;
    updateVh();
    clearTimeout(window.__resizeTimer);
    window.__resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 220);
  }
});

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

// === АНИМАЦИЯ ЦИФР ===
function initCounters() {
  gsap.utils.toArray('.stat-number').forEach(stat => {
    const originalText = stat.innerText;
    const endValue = parseFloat(originalText.replace(/[^0-9.]/g, ''));
    const suffix = originalText.replace(/[0-9.]/g, '');

    if (isNaN(endValue)) return;

    const obj = { val: 0 };

    gsap.to(obj, {
      val: endValue,
      duration: 1.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: stat,
        start: "top 85%",
        toggleActions: "play none none reverse"
      },
      onUpdate: () => {
        stat.innerText = Math.floor(obj.val) + suffix;
      }
    });
  });
}

// Основные анимации страницы
function initAnimations() {
  const tl = gsap.timeline();

  // === 1. HERO (ГЛАВНАЯ) - Аватар первый ===
  tl.from('.avatar-container', {
    duration: 0.8,
    autoAlpha: 0,
    y: 30,
    scale: 0.95,
    ease: 'power3.out'
  })
  // === 2. НАВИГАЦИЯ (После аватара) ===
  .from('.fixed-header', {
    duration: 0.8,
    y: -100,
    ease: 'power3.out'
  }, '-=0.4')

  // === 3. ТЕКСТ И СОЦСЕТИ ===
  .from('.hero-title', {
    duration: 0.8,
    autoAlpha: 0,
    y: 30,
    ease: 'power3.out'
  }, '-=0.6')
  .from('.hero-subtitle', {
    duration: 0.8,
    autoAlpha: 0,
    y: 30,
    ease: 'power3.out'
  }, '-=0.6')
  .from('.social-icons-container', {
    duration: 0.8,
    autoAlpha: 0,
    y: 30,
    ease: 'power3.out'
  }, '-=0.6');

  // === РАЗДЕЛЕНИЕ АНИМАЦИЙ: ПК vs МОБИЛЬНЫЕ ===
  if (window.innerWidth > 768) {
    // --- ВЕРСИЯ ДЛЯ ПК ---

    // 2. ЗАГОЛОВКИ СЕКЦИЙ
    gsap.utils.toArray('.skills-section-large, .projects-section, .spotify-section-large').forEach(el => {
      gsap.fromTo(el, { autoAlpha: 0, y: 30 }, {
        duration: 0.8,
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

    // 3. КАРТОЧКИ
    const cardsSelector = '.skill-category, .project-item, .spotify-player';

    gsap.utils.toArray(cardsSelector).forEach((it, i) => {
      gsap.fromTo(it, { autoAlpha: 0, y: 30, scale: 0.95 }, {
        duration: 0.8,
        autoAlpha: 1,
        y: 0,
        scale: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: it,
          start: 'top 85%',
          end: 'bottom 15%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    // 4. Статистика
    gsap.utils.toArray('.stat-item').forEach((it, i) => {
      gsap.fromTo(it, { autoAlpha: 0, y: 20 }, {
        duration: 0.6,
        autoAlpha: 1,
        y: 0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: it,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        },
        delay: i * 0.1
      });
    });

    // 5. Футер
    gsap.fromTo('.footer', { autoAlpha: 0, y: 30 }, {
      duration: 0.8,
      autoAlpha: 1,
      y: 0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.footer',
        start: 'top 95%',
        toggleActions: 'play none none reverse'
      }
    });

  } else {
    // --- ВЕРСИЯ ДЛЯ МОБИЛЬНЫХ ---
    const mobileElements = '.skills-section-large, .skill-category, .stat-item, .projects-section, .project-item, .spotify-section-large, .spotify-player, .footer';

    gsap.utils.toArray(mobileElements).forEach(el => {
      gsap.fromTo(el, { autoAlpha: 0, y: 30 }, {
        duration: 0.6,
        autoAlpha: 1,
        y: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 95%',
          toggleActions: 'play none none none',
          scrub: false
        }
      });
    });
  }
}

// Логика открытия/закрытия проектов
function toggleProjectById(projectId) {
  const el = document.getElementById(projectId);
  if (!el) return;
  const projectItem = el.closest('.project-item');
  const open = el.classList.contains('open');

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

      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleProjectById(details.id);
        }
      });
    }

    const projectButton = item.querySelector('.project-button');
    if (projectButton) {
      projectButton.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  });
}

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

function initSpotifyPlayer() {
  const playBtn = document.querySelector('.spotify-play-btn');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const progressBar = document.querySelector('.progress-bar');
  const progressFill = document.querySelector('.progress-bar-fill');

  let isPlaying = false;
  let currentProgress = 45;
  let progressInterval;

  if (playBtn) {
    playBtn.addEventListener('click', function() {
      const svg = this.querySelector('svg');
      isPlaying = !isPlaying;

      if (isPlaying) {
        svg.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
        startProgress();
      } else {
        svg.innerHTML = '<path d="M8 5v14l11-7z"/>';
        stopProgress();
      }

      gsap.to(this, { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 });
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      gsap.to(this, { scale: 0.85, duration: 0.1, yoyo: true, repeat: 1 });
      currentProgress = 0;
      progressFill.style.width = currentProgress + '%';
      stopProgress();
      if (isPlaying) startProgress();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      gsap.to(this, { scale: 0.85, duration: 0.1, yoyo: true, repeat: 1 });
      currentProgress = 0;
      progressFill.style.width = currentProgress + '%';
      stopProgress();
      if (isPlaying) startProgress();
    });
  }

  if (progressBar) {
    progressBar.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newProgress = (clickX / rect.width) * 100;
      currentProgress = Math.max(0, Math.min(100, newProgress));
      progressFill.style.width = currentProgress + '%';
    });
  }

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

function initNavigation() {
  const header = document.querySelector('.fixed-header');
  const hamburger = document.querySelector('.hamburger');
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Мобильное меню
  if (hamburger && navbar) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navbar.classList.toggle('active');
    });
  }

  navLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.startsWith('#')) {
          e.preventDefault();
          const targetElement = document.querySelector(targetId);

          // Закрываем мобильное меню при кликеф
          if (hamburger && navbar.classList.contains('active')) {
            hamburger.classList.remove('active');
            navbar.classList.remove('active');
          }

          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 80,
              behavior: 'smooth'
            });
          }
      }
    });
  });
}

// === ВИБРАЦИЯ (HAPTIC FEEDBACK) ===
function initVibration() {
  // Функция для запуска вибрации
  const vibrate = (pattern) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  // Слушаем клики на всем документе
  document.body.addEventListener('click', (e) => {
    const target = e.target;

    // 1. Кнопка Play/Pause (самая сильная вибрация)
    if (target.closest('.spotify-play-btn')) {
      vibrate(30);
      return;
    }

    // 2. Кнопки управления плеером (вперед/назад)
    if (target.closest('.spotify-control-btn')) {
      vibrate(15);
      return;
    }

    // 3. Меню гамбургер (средняя вибрация)
    if (target.closest('.hamburger')) {
      vibrate(20);
      return;
    }

    // 4. Раскрытие проектов (средняя вибрация)
    if (target.closest('.project-header')) {
      vibrate(20);
      return;
    }

    // 5. Обычные ссылки и кнопки (легкая вибрация)
    // Включает навигацию, соцсети, кнопки "Попробовать бота"
    if (target.closest('a, button, [role="button"]')) {
      vibrate(10);
      return;
    }

    // 6. Прогресс бар (легкая вибрация)
    if (target.closest('.progress-bar')) {
      vibrate(10);
      return;
    }
  }, { capture: true });
}

document.addEventListener('DOMContentLoaded', () => {
  optimizeForMobile();
  initAnimations();
  initCounters();
  attachProjectToggles();
  imagesFallback();
  initSpotifyPlayer();
  initNavigation();
  initVibration();
});

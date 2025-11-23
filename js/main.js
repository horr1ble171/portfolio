gsap.registerPlugin(ScrollTrigger);

// === ФИКС МОБИЛЬНОГО СКРОЛЛА ===
// Запрещаем GSAP обновляться, когда на телефоне скрывается адресная строка (resize по вертикали)
ScrollTrigger.config({ 
  ignoreMobileResize: true 
});

// Обновление переменной --vh (для корректной высоты на мобильных)
function updateVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}
updateVh();

// === УМНЫЙ РЕСАЙЗ ===
// Если ширина экрана не изменилась (а изменилась только высота из-за скрытия меню браузера),
// мы НЕ перезагружаем анимации. Это убирает "прыжки" и телепортацию на телефоне.
let lastWidth = window.innerWidth;

window.addEventListener('resize', () => {
  if (window.innerWidth !== lastWidth) {
    lastWidth = window.innerWidth;
    updateVh();
    clearTimeout(window.__resizeTimer);
    window.__resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 220);
  }
});

// Оптимизация настроек GSAP для мобильных
function optimizeForMobile() {
  if (window.innerWidth <= 768) {
    gsap.config({
      nullTargetWarn: false,
      units: { left: "%", top: "%", rotation: "rad" }
    });

    // Отключаем частицы на слабых устройствах, если они есть
    const particles = document.querySelector('.particles-container');
    if (particles) {
      particles.style.display = 'none';
    }
  }
}

// === НОВАЯ ФУНКЦИЯ: АНИМАЦИЯ ЦИФР (СЧЕТЧИКИ) ===
function initCounters() {
  gsap.utils.toArray('.stat-number').forEach(stat => {
    // 1. Сохраняем исходный текст (например, "700+")
    const originalText = stat.innerText;
    
    // 2. Достаем только число (700)
    const endValue = parseFloat(originalText.replace(/[^0-9.]/g, ''));
    
    // 3. Достаем суффикс (например, "+", "%" или пустоту)
    const suffix = originalText.replace(/[0-9.]/g, '');

    // Если вдруг там нет цифр, пропускаем
    if (isNaN(endValue)) return;

    // Объект-прокси для анимации значения
    const obj = { val: 0 };

    gsap.to(obj, {
      val: endValue,
      duration: 2,        // Длительность анимации
      ease: "power2.out", // Плавное замедление
      scrollTrigger: {
        trigger: stat,
        start: "top 85%", // Запуск, когда элемент почти появился
        toggleActions: "play none none reverse" // Перезапуск, если проскроллить вверх и обратно
      },
      onUpdate: () => {
        // Обновляем текст, округляя число и добавляя хвостик
        stat.innerText = Math.floor(obj.val) + suffix;
      }
    });
  });
}

// Основные анимации страницы
function initAnimations() {
  // Hero animations (Аватар, заголовок)
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

  // === РАЗДЕЛЕНИЕ АНИМАЦИЙ: ПК vs МОБИЛЬНЫЕ ===
  if (window.innerWidth > 768) {
    // --- ВЕРСИЯ ДЛЯ ПК (Более сложные эффекты) ---
    
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
    // --- ВЕРСИЯ ДЛЯ МОБИЛЬНЫХ (Упрощенная и стабильная) ---
    // scrub: false и toggleActions: 'play none none none' убирают рывки при скролле
    
    const mobileElements = '.skills-section-large, .skill-category, .stat-item, .projects-section, .project-item, .spotify-player, .footer';
    
    gsap.utils.toArray(mobileElements).forEach(el => {
      gsap.fromTo(el, { autoAlpha: 0, y: 20 }, {
        duration: 0.7,
        autoAlpha: 1,
        y: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          toggleActions: 'play none none none', // Играем 1 раз
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

  // Закрываем остальные
  document.querySelectorAll('.project-details.open').forEach(d => {
    if (d !== el) {
      d.classList.remove('open');
      d.closest('.project-item').setAttribute('aria-expanded', 'false');
    }
  });

  // Тоггл текущего
  if (open) {
    el.classList.remove('open');
    projectItem.setAttribute('aria-expanded', 'false');
  } else {
    el.classList.add('open');
    projectItem.setAttribute('aria-expanded', 'true');
  }
}

// Навешиваем обработчики кликов на проекты
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

      // Поддержка клавиатуры
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleProjectById(details.id);
        }
      });
    }

    // Чтобы клик по кнопке внутри не закрывал проект
    const projectButton = item.querySelector('.project-button');
    if (projectButton) {
      projectButton.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  });
}

// Заглушка для картинок, если они не загрузились
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

// Плеер Spotify (логика кнопок и прогресс-бара)
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
        svg.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
        startProgress();
      } else {
        svg.innerHTML = '<path d="M8 5v14l11-7z"/>';
        stopProgress();
      }

      gsap.to(this, { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 });
    });
  }

  // Previous track
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      gsap.to(this, { scale: 0.85, duration: 0.1, yoyo: true, repeat: 1 });
      currentProgress = 0;
      progressFill.style.width = currentProgress + '%';
      stopProgress();
      if (isPlaying) startProgress();
    });
  }

  // Next track
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      gsap.to(this, { scale: 0.85, duration: 0.1, yoyo: true, repeat: 1 });
      currentProgress = 0;
      progressFill.style.width = currentProgress + '%';
      stopProgress();
      if (isPlaying) startProgress();
    });
  }

  // Клик по прогресс-бару
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

// Частицы на фоне (можно включить, раскомментировав вызов внизу)
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

// === ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ===
document.addEventListener('DOMContentLoaded', () => {
  optimizeForMobile();
  initAnimations();      // Обычные анимации появления
  initCounters();        // Новая анимация бегущих цифр
  attachProjectToggles();
  imagesFallback();
  initSpotifyPlayer();
  // addParticlesEffect(); // Частицы (по желанию)
});

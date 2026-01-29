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
        start: "top 95%", // Срабатывает раньше
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
  // Анимируем ОБЕРТКУ, чтобы не конфликтовать с hover-эффектом контейнера
  tl.from('.avatar-wrapper', {
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
          start: 'top 95%', // Появляются раньше
          end: 'bottom 5%',
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
          start: 'top 95%', // Появляются раньше
          end: 'bottom 5%',
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
          start: 'top 95%', // Появляются раньше
          toggleActions: 'play none none reverse'
        },
        delay: i * 0.1
      });
    });

    // Анимация футера УДАЛЕНА

  } else {
    // --- ВЕРСИЯ ДЛЯ МОБИЛЬНЫХ ---
    // Убрал .footer из списка анимируемых элементов
    const mobileElements = '.skills-section-large, .skill-category, .stat-item, .projects-section, .project-item, .spotify-section-large, .spotify-player';

    gsap.utils.toArray(mobileElements).forEach(el => {
      gsap.fromTo(el, { autoAlpha: 0, y: 30 }, {
        duration: 0.6,
        autoAlpha: 1,
        y: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 98%', // Появляются практически сразу при появлении на экране
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
    // Пропускаем изображение в лайтбоксе
    if (img.id === 'lightbox-img') return;

    img.addEventListener('error', function() {
      // Если у картинки нет src (например, очистили), не считаем это ошибкой
      if (!this.getAttribute('src')) return;

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

          // Закрываем мобильное меню при клике
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

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');
  const triggers = document.querySelectorAll('.avatar-image, .album-cover-image');

  if (!lightbox || !lightboxImg) return;

  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Блокируем скролл
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Разблокируем скролл

    // Не очищаем src сразу, чтобы не было моргания или ошибки загрузки пустой строки
    // Можно очистить после анимации, если нужно, но лучше оставить как есть
    // или заменить на прозрачный пиксель, если критично
  }

  triggers.forEach(img => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(img.src);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);

  // Закрытие по клику на фон
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Закрытие по Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  optimizeForMobile();
  initAnimations();
  initCounters();
  attachProjectToggles();
  imagesFallback();
  initSpotifyPlayer();
  initNavigation();
  initLightbox();
});

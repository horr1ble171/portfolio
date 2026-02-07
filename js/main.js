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
        start: "top 95%",
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
          start: 'top 95%',
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
          start: 'top 95%',
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
          start: 'top 95%',
          toggleActions: 'play none none reverse'
        },
        delay: i * 0.1
      });
    });

  } else {
    // --- ВЕРСИЯ ДЛЯ МОБИЛЬНЫХ ---
    const mobileElements = '.skills-section-large, .skill-category, .stat-item, .projects-section, .project-item, .spotify-section-large, .spotify-player';

    gsap.utils.toArray(mobileElements).forEach(el => {
      gsap.fromTo(el, { autoAlpha: 0, y: 30 }, {
        duration: 0.6,
        autoAlpha: 1,
        y: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 98%',
          toggleActions: 'play none none none',
          scrub: false
        }
      });
    });
  }
}

// Логика открытия/закрытия проектов с динамической высотой
function toggleProjectById(projectId) {
  const el = document.getElementById(projectId);
  if (!el) return;
  const projectItem = el.closest('.project-item');
  const isOpen = el.classList.contains('open');

  // Закрываем другие открытые проекты
  document.querySelectorAll('.project-details.open').forEach(d => {
    if (d !== el) {
      d.style.maxHeight = null; // Сбрасываем высоту
      d.classList.remove('open');
      d.closest('.project-item').setAttribute('aria-expanded', 'false');
    }
  });

  if (isOpen) {
    // Закрываем текущий
    el.style.maxHeight = null;
    el.classList.remove('open');
    projectItem.setAttribute('aria-expanded', 'false');
  } else {
    // Открываем текущий
    el.classList.add('open');
    el.style.maxHeight = el.scrollHeight + "px"; // Устанавливаем точную высоту контента
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
        // e.stopPropagation(); // Removed to allow menu closing
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
        // e.stopPropagation(); // Removed to allow menu closing
      });
    }
  });
}

function imagesFallback() {
  document.querySelectorAll('img').forEach(img => {
    if (img.id === 'lightbox-img') return;

    img.addEventListener('error', function() {
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

// Функция для анимации клика (вынесена глобально для использования в разных местах)
function animateClick(element, scaleTo) {
  // 1. Отключаем CSS transition, чтобы не мешал GSAP
  element.style.transition = 'none';

  gsap.fromTo(element,
    { scale: 1 },
    {
      scale: scaleTo,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      overwrite: true,
      onComplete: () => {
        // 2. После анимации очищаем инлайновые стили GSAP
        // и восстанавливаем CSS transition (убирая 'none')
        gsap.set(element, { clearProps: "all" });
      }
    }
  );
}

function initSpotifyPlayer() {
  const playBtn = document.querySelector('.spotify-play-btn');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const progressBar = document.querySelector('.progress-bar');
  const progressFill = document.querySelector('.progress-bar-fill');

  if (playBtn) {
    playBtn.addEventListener('click', function() {
      animateClick(this, 0.9);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      animateClick(this, 0.85);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      animateClick(this, 0.85);
    });
  }

  // Прогресс бар больше не кликабельный, анимация shimmer остается в CSS
}

function initNavigation() {
  const header = document.querySelector('.fixed-header');
  const hamburger = document.querySelector('.hamburger');
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
      document.body.classList.add('scrolled-mode'); // Добавляем класс для body
    } else {
      header.classList.remove('scrolled');
      document.body.classList.remove('scrolled-mode'); // Удаляем класс
    }
  });

  // Мобильное меню
  if (hamburger && navbar) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      navbar.classList.toggle('active');
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
      if (navbar.classList.contains('active') && !navbar.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navbar.classList.remove('active');
      }
    });
  }

  navLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      // Анимация нажатия для навигации
      animateClick(this, 0.95);

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
      // e.stopPropagation(); // Removed to allow menu closing
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

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
    gsap.utils.toArray('.skills-section-large, .projects-section-large, .spotify-section-large').forEach(el => {
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
    const cardsSelector = '.skill-category, .project-card, .spotify-player';

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
    const mobileElements = '.skills-section-large, .skill-category, .stat-item, .projects-section-large, .project-card, .spotify-section-large, .spotify-player';

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

function initProjectModals() {
  const openButtons = document.querySelectorAll('.project-card-button');
  const modals = document.querySelectorAll('.project-modal-overlay');

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      setupDescription(modal);
    }
  }

  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function setupDescription(modal) {
    if (window.innerWidth <= 768) {
      const description = modal.querySelector('.project-modal-description');
      if (description) {
        // Сохраняем полный текст, если еще не сохранили
        if (!description.dataset.fullText) {
          description.dataset.fullText = description.innerHTML;
        }

        // ВСЕГДА сбрасываем к сокращенному виду при открытии
        const fullText = description.dataset.fullText;
        // Если текст достаточно длинный, сокращаем его
        if (fullText.length > 100) {
            const shortText = fullText.substring(0, 100);
            description.innerHTML = `${shortText}<span class="read-more">... еще</span>`;

            const readMore = description.querySelector('.read-more');
            readMore.style.cursor = 'pointer';
            readMore.style.color = 'var(--gray-400)';
            readMore.addEventListener('click', (e) => {
              e.stopPropagation();
              description.innerHTML = fullText;
            });
        } else {
            // Если текст короткий, просто показываем его
            description.innerHTML = fullText;
        }
      }
    }
  }

  openButtons.forEach(button => {
    button.addEventListener('click', () => {
      const projectId = button.dataset.projectId;
      openModal(`project-modal-${projectId}`);
    });
  });

  modals.forEach(modal => {
    const closeButton = modal.querySelector('.project-modal-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        closeModal(modal);
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (modal.classList.contains('active')) {
          closeModal(modal);
        }
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
  // Добавил .project-modal-image в селектор
  const triggers = document.querySelectorAll('.avatar-image, .album-cover-image, .project-modal-image');

  if (!lightbox || !lightboxImg) return;

  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    // document.body.style.overflow = 'hidden'; // Убрал блокировку скролла body, так как она может конфликтовать с модалкой
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    // document.body.style.overflow = '';
  }

  triggers.forEach(img => {
    img.addEventListener('click', (e) => {
      e.stopPropagation(); // Останавливаем всплытие, чтобы не закрыть модалку (если клик внутри)
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
  initProjectModals();
  imagesFallback();
  initSpotifyPlayer();
  initNavigation();
  initLightbox();
});

gsap.registerPlugin(ScrollTrigger);

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

function initAnimations() {
  const tl = gsap.timeline();
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const socialIcons = document.querySelector('.social-icons-container');
  const titleText = heroTitle.textContent;
  
  heroTitle.textContent = '';
  heroTitle.classList.add('typing-active');

  tl.from('.avatar-wrapper', {
    duration: 0.8,
    autoAlpha: 0,
    y: 30,
    scale: 0.95,
    ease: 'power3.out'
  })
  .from('.fixed-header', {
    duration: 0.8,
    y: -100,
    ease: 'power3.out'
  }, '-=0.4')
  .to(heroTitle, {
    duration: 1,
    onStart: () => {
      let count = 0;
      const typeInterval = setInterval(() => {
        if (count <= titleText.length) {
          heroTitle.textContent = titleText.substring(0, count);
          count++;
        } else {
          clearInterval(typeInterval);
          // Wait a bit and stop the cursor if needed, 
          // but usually kept for better aesthetics or removed after some time
          setTimeout(() => heroTitle.classList.remove('typing-active'), 1500);
        }
      }, 60); // Speed of typing
    }
  }, '-=0.6')
  .from(heroSubtitle, {
    duration: 0.8,
    autoAlpha: 0,
    y: 30,
    ease: 'power3.out'
  }, '-=0.2')
  .from(socialIcons, {
    duration: 0.8,
    autoAlpha: 0,
    y: 30,
    ease: 'power3.out'
  }, '-=0.6');

  if (window.innerWidth > 768) {

    // Section fade-in
    const sectionsToAnimate = '.skills-section-large, .projects-section-large, .studio-section-large, .spotify-section-large';
    gsap.utils.toArray(sectionsToAnimate).forEach(el => {
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

    // Category/Card animations
    const cardsSelector = '.skill-category, .project-card, .studio-card, .studio-team-member, .spotify-player';

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
    // Mobile animations (simplified)
    const mobileElements = '.skills-section-large, .projects-section-large, .studio-section-large, .spotify-section-large, .skill-category, .project-card, .studio-card, .studio-team-member, .stat-item, .spotify-player';

    gsap.utils.toArray(mobileElements).forEach(el => {
      gsap.fromTo(el, { autoAlpha: 0, y: 20 }, {
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
  let currentModalIndex = -1;

  const modalIds = [...new Set(Array.from(openButtons).map(btn => `project-modal-${btn.dataset.projectId}`))];

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modals.forEach(m => m.classList.remove('active'));

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      setupDescription(modal);
      setupTechnologies(modal);
      setupNavigation(modal);

      currentModalIndex = modalIds.indexOf(modalId);

      const content = modal.querySelector('.project-modal-content');
      gsap.fromTo(content,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  }

  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateProject(direction) {
    let newIndex = currentModalIndex + direction;

    if (newIndex < 0) newIndex = modalIds.length - 1;
    if (newIndex >= modalIds.length) newIndex = 0;

    const currentId = modalIds[currentModalIndex];
    const nextId = modalIds[newIndex];

    const currentModal = document.getElementById(currentId);
    const nextModal = document.getElementById(nextId);

    if (!currentModal || !nextModal) return;

    setupDescription(nextModal);
    setupTechnologies(nextModal);
    setupNavigation(nextModal);

    // Мгновенное переключение без анимации
    currentModal.classList.remove('active');
    nextModal.classList.add('active');

    // Очистка возможных стилей
    const currentContent = currentModal.querySelector('.project-modal-content');
    const nextContent = nextModal.querySelector('.project-modal-content');
    if (currentContent) gsap.set(currentContent, { clearProps: "all" });
    if (nextContent) gsap.set(nextContent, { clearProps: "all" });

    currentModalIndex = newIndex;
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

    // Добавляем поддержку свайпов один раз при инициализации
    let touchStartX = 0;
    let touchEndX = 0;

    modal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
        navigateProject(1);
      } else if (touchEndX > touchStartX + swipeThreshold) {
        navigateProject(-1);
      }
    }, { passive: true });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (modal.classList.contains('active')) {
          closeModal(modal);
        }
      });
    } else if (e.key === 'ArrowLeft') {
        const activeModal = document.querySelector('.project-modal-overlay.active');
        if (activeModal && typeof navigateProject === 'function') navigateProject(-1);
    } else if (e.key === 'ArrowRight') {
        const activeModal = document.querySelector('.project-modal-overlay.active');
        if (activeModal && typeof navigateProject === 'function') navigateProject(1);
    }
  });

  // Make navigateProject available to setupNavigation
  window._navigateProject = navigateProject;
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

function animateClick(element, scaleTo) {
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
}

function initNavigation() {
  const header = document.querySelector('.fixed-header');
  const hamburger = document.querySelector('.hamburger');
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  let isScrolled = false;
  window.addEventListener('scroll', () => {
    const shouldBeScrolled = window.scrollY > 50;
    if (shouldBeScrolled !== isScrolled) {
      isScrolled = shouldBeScrolled;
      header.classList.toggle('scrolled', isScrolled);
      document.body.classList.toggle('scrolled-mode', isScrolled);
    }
  }, { passive: true });

  if (hamburger && navbar) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      navbar.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (navbar.classList.contains('active') && !navbar.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        navbar.classList.remove('active');
      }
    });
  }

  navLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      animateClick(this, 0.95);

      const targetId = this.getAttribute('href');
      if (targetId.startsWith('#')) {
          e.preventDefault();
          const targetElement = document.querySelector(targetId);

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
  const triggers = document.querySelectorAll('.avatar-image, .album-cover-image, .project-modal-image, .member-image');

  if (!lightbox || !lightboxImg) return;

  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  triggers.forEach(img => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(img.src);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

function animateStatNumbers() {
  gsap.utils.toArray('.stat-number').forEach(stat => {
    const originalText = stat.textContent.trim();
    const value = parseFloat(originalText);

    if (isNaN(value)) return;

    const suffix = originalText.replace(value, '').trim();
    const counter = { val: 0 };

    ScrollTrigger.create({
      trigger: stat,
      start: "top 90%",
      onEnter: () => {
        counter.val = 0;
        gsap.to(counter, {
          val: value,
          duration: 2,
          ease: "none",
          onUpdate: () => {
            stat.textContent = Math.floor(counter.val) + suffix;
          }
        });
      },
      onLeaveBack: () => {
        counter.val = 0;
        stat.textContent = "0" + suffix;
      }
    });
  });
}

function initScrollSpy() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleScroll() {
    let current = '';
    const scrollY = window.scrollY;
    
    // Header height + some buffer
    const offset = 140; 

    // Find the right section
    sections.forEach(section => {
      const sectionTop = section.offsetTop - offset;
      if (scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    // Handle home specifically when at the very top
    if (scrollY < 100) {
      current = 'hero';
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      // Direct comparison with the section ID to avoid partial matches
      if (href === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        handleScroll();
        isScrolling = false;
      });
      isScrolling = true;
    }
  }, { passive: true });

  // Set initial state
  handleScroll();
}

function initLegalModals() {
  const privacyTrigger = document.getElementById('open-privacy');
  const termsTrigger = document.getElementById('open-terms');
  const privacyModal = document.getElementById('legal-modal-privacy');
  const termsModal = document.getElementById('legal-modal-terms');

  if (!privacyTrigger || !termsTrigger || !privacyModal || !termsModal) return;

  function openLegalModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    const content = modal.querySelector('.project-modal-content');
    gsap.fromTo(content, 
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }
    );
  }

  function closeLegalModal(modal) {
    modal.classList.remove('active');
    if (!document.querySelector('.project-modal-overlay.active')) {
      document.body.style.overflow = '';
    }
  }

  privacyTrigger.addEventListener('click', () => openLegalModal(privacyModal));
  termsTrigger.addEventListener('click', () => openLegalModal(termsModal));

  [privacyModal, termsModal].forEach(modal => {
    const closeBtn = modal.querySelector('.project-modal-close');
    closeBtn.addEventListener('click', () => closeLegalModal(modal));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLegalModal(modal);
    });
  });
}

function initPreloader() {
  const preloader = document.getElementById('preloader');
  const bar = document.getElementById('preloader-bar');
  const percentage = document.getElementById('preloader-percentage');
  const body = document.body;

  if (!preloader || !bar || !percentage) return;

  let width = 0;
  const interval = setInterval(() => {
    if (width < 95) {
      width += Math.random() * 3;
      if (width > 95) width = 95;
      bar.style.width = width + '%';
      percentage.textContent = Math.floor(width) + '%';
    }
  }, 70);

  const finishLoading = () => {
    clearInterval(interval);
    
    // Smooth finish to 100%
    const finishInterval = setInterval(() => {
      if (width >= 100) {
        clearInterval(finishInterval);
        
        setTimeout(() => {
          preloader.classList.add('fade-out');
          body.classList.remove('loading');
          
          // Start initial animations after preloader is gone
          initAnimations();
        }, 400);
      } else {
        width += 1; // Increment by 1 as requested
        bar.style.width = width + '%';
        percentage.textContent = Math.floor(width) + '%';
      }
    }, 8); // Fast but visible finish
  };

  if (document.readyState === 'complete') {
    finishLoading();
} else {
    window.addEventListener('load', finishLoading);
  }
}

const translations = {
  ru: {
    logo: "horr1ble",
    preloader_text: "Портфолио загружается...",
    nav_home: "Главная",
    nav_skills: "Навыки",
    nav_projects: "Проекты",
    nav_studio: "Веб-студия",
    nav_spotify: "Spotify",
    hero_subtitle: "разработчик telegram ботов<br> и сайтов",
    skills_title: "Мои навыки",
    skill_fullstack: "Full-Stack разработка",
    skill_fullstack_desc: "Полный цикл разработки от проектирования архитектуры до запуска проекта.",
    skill_tech: "Технологии",
    skill_bots: "Telegram боты",
    skill_bots_desc: "Создание высоконагруженных ботов с обработкой медиафайлов, интеграцией API и сложной бизнес-логикой.",
    skill_product: "Продуктовый подход",
    skill_product_desc: "Создание продуктов, которые решают реальные проблемы пользователей и растут органически без рекламы.",
    stat_projects: "Запущенных проектов",
    stat_users: "Пользователей",
    stat_years: "Года разработки",
    stat_self: "Самообучение",
    skill_tag_html: "HTML/CSS/JavaScript",
    skill_tag_python: "Python",
    skill_tag_tg_api: "Telegram API",
    skill_tag_aiogram: "Aiogram",
    skill_tag_audio: "Обработка аудио",
    skill_tag_db: "Базы данных",
    skill_tag_nextjs: "Next.js 14",
    skill_tag_tailwind: "TailwindCSS",
    skill_tag_zustand: "Zustand / React Query",
    skill_tag_shadcn: "shadcn/ui",
    skill_tag_nodejs: "Node.js / Express",
    skill_tag_logic: "Сложная логика",
    skill_tag_highload: "Высокая нагрузка",
    skill_tag_payments: "Платежные системы",
    skill_tag_ux: "User Experience",
    skill_tag_analytics: "Аналитика",
    skill_tag_scaling: "Масштабирование",
    projects_title: "Мои проекты",
    project_music_title: "Музыка для профиля",
    project_music_desc: "Этот бот позволяет пользователям добавлять или изменять обложку, название, исполнителя и название альбома для аудиофайлов прямо в Telegram.",
    project_portfolio_title: "Портфолио",
    project_portfolio_desc: "Это мой личный сайт-портфолио, созданный для демонстрации моих навыков, проектов и интересов. Он разработан с акцентом на современный дизайн, адаптивность и интерактивность, чтобы обеспечить наилучший пользовательский опыт.",
    project_geo_title: "GEO stars",
    project_geo_desc: "Бот, разработанный на заказ, для продажи звезд и премиум-статусов Telegram. Включает интеграцию с платежными системами, систему учета заказов и управление пользователями. (Бот находится во владении другого человека)",
    project_ascii_title: "Ascii art generator",
    project_ascii_desc: "Бот для преобразования изображений в ASCII-арт. Пользователи могут загружать фотографии, а бот генерирует текстовые изображения, используя различные символы и настройки плотности.",
    project_beam_title: "Beam Builds",
    project_beam_desc: "Платформа для публикации и поиска готовых сборок модов для BeamNG.drive. Находи, делись, собирай.",
    more: "Подробнее",
    studio_title: "Веб-студия",
    studio_subtitle: "Создаем цифровые продукты от идеи до реализации.<br>Веб-сайты, Telegram и Discord боты, полный цикл разработки.",
    tag_discord_bots: "Discord боты",
    studio_team_title: "Команда разработчиков, готовая воплотить ваши идеи в жизнь",
    studio_btn: "Перейти на сайт",
    studio_tag_websites: "Веб-сайты",
    studio_tag_bots: "Telegram боты",
    member_role: "Full-stack Developer",
    spotify_title: "Мой любимый альбом на Spotify",
    footer_subtitle: "Разработчик Telegram ботов и создатель продуктов",
    footer_studio: "Студия",
    footer_contacts: "Контакты",
    footer_rights: "© 2025 - 2026 horr1ble.space Все права защищены.",
    spotify_open: "Открыть в Spotify",
    footer_privacy: "Политика конфиденциальности",
    footer_terms: "Условия использования",
    modal_start_date: "Дата начала",
    modal_status: "Статус",
    modal_developers: "Разработчики",
    modal_active: "Активен",
    modal_finished: "Завершён",
    modal_in_dev: "В разработке",
    modal_tech_title: "Технологии:",
    modal_try_bot: "Попробовать бота",
    modal_try_site: "Перейти на сайт",
    swipe_hint: "свайпните для навигации",
    spotify_playing: "<span class=\"playing-dot\">●</span> Сейчас играет",

    privacy_intro: "Ваша конфиденциальность очень важна для меня. На этом сайте данные не собираются автоматически, за исключением стандартных логов сервера.",
    privacy_q1_title: "Какие данные я собираю?",
    privacy_q1_text: "Я не собираю личную информацию о посетителях сайта. Если вы связываетесь со мной через сторонние платформы (Telegram, Discord), ваши данные обрабатываются в соответствии с их политикой конфиденциальности.",
    privacy_q2_title: "Cookies",
    privacy_q2_text: "Данный сайт не использует куки-файлы для отслеживания ваших действий.",
    privacy_q3_title: "Сторонние сервисы",
    privacy_q3_text: "На сайте могут присутствовать ссылки на сторонние ресурсы (GitHub, Spotify, Telegram). Я не несу ответственности за содержание и политику конфиденциальности этих сайтов.",
    terms_intro: "Используя этот сайт, вы соглашаетесь со следующими условиями:",
    terms_q1_title: "Контент",
    terms_q1_text: "Весь контент, представленный на сайте (тексты, изображения, примеры кода), является интеллектуальной собственностью и предназначен для ознакомления.",
    terms_q2_title: "Отказ от ответственности",
    terms_q2_text: "Сайт предоставляется \"как есть\". Я не несу ответственности за любые технические ошибки или убытки, возникшие в результате использования информации с этого сайта.",
    terms_q3_title: "Изменения",
    terms_q3_text: "Я оставляю за собой право изменять содержание сайта и данные условия в любое время без предварительного уведомления.",

  },

  en: {
    logo: "horr1ble",
    preloader_text: "Portfolio is loading...",
    nav_home: "Home",
    nav_skills: "Skills",
    nav_projects: "Projects",
    nav_studio: "Web Studio",
    nav_spotify: "Spotify",
    hero_subtitle: "telegram bots and<br> websites developer",
    skills_title: "My Skills",
    skill_fullstack: "Full-Stack Development",
    skill_fullstack_desc: "Full development cycle from architecture design to project launch.",
    skill_tech: "Technologies",
    skill_bots: "Telegram Bots",
    skill_bots_desc: "Creating high-load bots with media processing, API integration, and complex business logic.",
    skill_product: "Product Approach",
    skill_product_desc: "Creating products that solve real user problems and grow organically without advertising.",
    stat_projects: "Projects Launched",
    stat_users: "Users",
    stat_years: "Years of Development",
    stat_self: "Self-taught",
    skill_tag_html: "HTML/CSS/JavaScript",
    skill_tag_python: "Python",
    skill_tag_tg_api: "Telegram API",
    skill_tag_aiogram: "Aiogram",
    skill_tag_audio: "Audio Processing",
    skill_tag_db: "Databases",
    skill_tag_nextjs: "Next.js 14",
    skill_tag_tailwind: "TailwindCSS",
    skill_tag_zustand: "Zustand / React Query",
    skill_tag_shadcn: "shadcn/ui",
    skill_tag_nodejs: "Node.js / Express",
    skill_tag_logic: "Complex Logic",
    skill_tag_highload: "High Load",
    skill_tag_payments: "Payment Systems",
    skill_tag_ux: "User Experience",
    skill_tag_analytics: "Analytics",
    skill_tag_scaling: "Scaling",
    projects_title: "My Projects",
    project_music_title: "Music for profile",
    project_music_desc: "This bot allows users to add or change the cover, title, artist and album name for audio files directly in Telegram.",
    project_portfolio_title: "Portfolio",
    project_portfolio_desc: "This is my personal portfolio website created to showcase my skills, projects and interests. It is designed with a focus on modern design, responsiveness and interactivity to provide the best user experience.",
    project_geo_title: "GEO stars",
    project_geo_desc: "Custom-developed bot for selling Telegram stars and premium statuses. Includes integration with payment systems, order tracking system and user management. (Bot is owned by another person)",
    project_ascii_title: "Ascii art generator",
    project_ascii_desc: "Bot for converting images to ASCII art. Users can upload photos and the bot generates text images using various symbols and density settings.",
    project_beam_title: "Beam Builds",
    project_beam_desc: "Platform for publishing and searching ready-made mod builds for BeamNG.drive. Find, share, build.",
    more: "Details",
    studio_title: "Web Studio",
    studio_subtitle: "We create digital products from idea to implementation.<br>Websites, Telegram and Discord bots, full development cycle.",
    tag_discord_bots: "Discord Bots",
    studio_team_title: "Team of developers ready to bring your ideas to life",
    studio_btn: "Go to website",
    studio_tag_websites: "Websites",
    studio_tag_bots: "Telegram Bots",
    member_role: "Full-stack Developer",
    spotify_title: "My favorite album on Spotify",
    footer_subtitle: "Telegram bot developer and product creator",
    footer_studio: "Studio",
    footer_contacts: "Contacts",
    footer_rights: "© 2025 - 2026 horr1ble.space All rights reserved.",
    spotify_open: "Open in Spotify",
    footer_privacy: "Privacy Policy",
    footer_terms: "Terms of Use",
    modal_start_date: "Start date",
    modal_status: "Status",
    modal_developers: "Developers",
    modal_active: "Active",
    modal_finished: "Finished",
    modal_in_dev: "In Development",
    modal_tech_title: "Technologies:",
    modal_try_bot: "Try the bot",
    modal_try_site: "Go to website",
    swipe_hint: "swipe for navigation",
    spotify_playing: "<span class=\"playing-dot\">●</span> Now playing",

    privacy_intro: "Your privacy is very important to me. On this site, data is not collected automatically, except for standard server logs.",
    privacy_q1_title: "What data do I collect?",
    privacy_q1_text: "I do not collect personal information about site visitors. If you contact me through third-party platforms (Telegram, Discord), your data is processed in accordance with their privacy policy.",
    privacy_q2_title: "Cookies",
    privacy_q2_text: "This site does not use cookies to track your actions.",
    privacy_q3_title: "Third-party services",
    privacy_q3_text: "The site may contain links to third-party resources (GitHub, Spotify, Telegram). I am not responsible for the content and privacy policy of these sites.",
    terms_intro: "By using this site, you agree to the following terms:",
    terms_q1_title: "Content",
    terms_q1_text: "All content presented on the site (texts, images, code examples) is intellectual property and is intended for informational purposes.",
    terms_q2_title: "Disclaimer",
    terms_q2_text: "The site is provided \"as is\". I am not responsible for any technical errors or damages resulting from the use of information from this site.",
    terms_q3_title: "Changes",
    terms_q3_text: "I reserve the right to change the content of the site and these terms at any time without prior notice.",

  }

};

function initI18n() {
  const langSelectors = document.querySelectorAll('[data-lang]');
  const pcLangWrapper = document.querySelector('.lang-selector-pc-wrapper');
  const pcLangBtn = document.querySelector('.lang-hamburger');
  const activeLangLabel = document.querySelector('.active-lang');
  
  const savedLang = localStorage.getItem('selectedLang');
  let currentLang = 'ru';

  if (savedLang) {
    currentLang = savedLang;
  } else {
    const userLang = navigator.language || navigator.userLanguage;
    if (userLang && !userLang.toLowerCase().includes('ru')) {
      currentLang = 'en';
    }
  }

  const updateContent = (lang) => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
        
        // Clear cached full text for description truncation on mobile
        if (el.classList.contains('project-modal-description')) {
            delete el.dataset.fullText;
        }
      }
    });

    // Re-run setup for active modal if it exists
    const activeModal = document.querySelector('.project-modal-overlay.active');
    if (activeModal && typeof setupDescription === 'function') {
        setupDescription(activeModal);
    }

    // Update active states in all selectors
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    if (activeLangLabel) {
      activeLangLabel.textContent = lang.toUpperCase();
    }
    
    document.documentElement.lang = lang;
    localStorage.setItem('selectedLang', lang);
  };

  // Lang selection click
  langSelectors.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedLang = btn.getAttribute('data-lang');
      updateContent(selectedLang);
      if (pcLangWrapper) pcLangWrapper.classList.remove('active');
    });
  });

  // PC Dropdown toggle
  if (pcLangBtn) {
    pcLangBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      pcLangWrapper.classList.toggle('active');
    });
  }

  // Close dropdown on outside click
  document.addEventListener('click', () => {
    if (pcLangWrapper) pcLangWrapper.classList.remove('active');
  });

  // Initial update
  updateContent(currentLang);
}

document.addEventListener('DOMContentLoaded', () => {
  optimizeForMobile();
  initI18n(); // Инициализация многоязычности
  initPreloader(); // Инициализация прелоадера
  initProjectModals();
  initLegalModals();
  imagesFallback();
  initSpotifyPlayer();
  initNavigation();
  initLightbox();
  animateStatNumbers();
  initScrollSpy(); // Инициализация подсветки меню
});

function setupDescription(modal) {
  if (window.innerWidth <= 768) {
    const description = modal.querySelector('.project-modal-description');
    if (description) {
      if (!description.dataset.fullText) {
        description.dataset.fullText = description.innerHTML;
      }

      const fullText = description.dataset.fullText;
      if (fullText.length > 100) {
          const shortText = fullText.substring(0, 100);
          // Use localized "more" text
          const moreText = localStorage.getItem('selectedLang') === 'en' ? ' more' : ' еще';
          description.innerHTML = `${shortText}<span class="read-more">... ${moreText}</span>`;

          const readMore = description.querySelector('.read-more');
          readMore.style.cursor = 'pointer';
          readMore.style.color = 'var(--gray-400)';
          readMore.addEventListener('click', (e) => {
            e.stopPropagation();
            description.innerHTML = fullText;
          });
      } else {
          description.innerHTML = fullText;
      }
    }
  }
}

function setupTechnologies(modal) {
  if (window.innerWidth <= 768) {
    const techContainer = modal.querySelector('.tech-icons');
    if (!techContainer) return;

    const existingBtn = techContainer.querySelector('.tech-more-btn');
    if (existingBtn) {
      existingBtn.remove();
    }

    const items = techContainer.querySelectorAll('.tech-item');
    items.forEach(item => item.style.display = 'flex');

    if (items.length > 2) {
      for (let i = 2; i < items.length; i++) {
        items[i].style.display = 'none';
      }

      const moreBtn = document.createElement('button');
      moreBtn.className = 'tech-more-btn';
      moreBtn.textContent = `+${items.length - 2}`;

      techContainer.appendChild(moreBtn);

      moreBtn.addEventListener('click', () => {
        items.forEach(item => item.style.display = 'flex');
        moreBtn.remove();
      });
    }
  } else {
      const techContainer = modal.querySelector('.tech-icons');
      if (techContainer) {
          const items = techContainer.querySelectorAll('.tech-item');
          items.forEach(item => item.style.display = 'flex');

          const existingBtn = techContainer.querySelector('.tech-more-btn');
          if (existingBtn) {
              existingBtn.remove();
          }
      }
  }
}

function setupNavigation(modal) {
  const oldArrows = modal.querySelectorAll('.project-nav-arrow');
  if (oldArrows) oldArrows.forEach(arrow => arrow.remove());

  if (window.innerWidth > 1024) {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'project-nav-arrow prev btn-press';
    prevBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>';

    const nextBtn = document.createElement('button');
    nextBtn.className = 'project-nav-arrow next btn-press';
    nextBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>';

    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof window._navigateProject === 'function') {
          window._navigateProject(-1);
      }
    });

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof window._navigateProject === 'function') {
          window._navigateProject(1);
      }
    });

    modal.appendChild(prevBtn);
    modal.appendChild(nextBtn);
  }
}

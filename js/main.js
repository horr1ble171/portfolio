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

  if (window.innerWidth > 768) {

    // Убрал .projects-section-large
    gsap.utils.toArray('.skills-section-large, .spotify-section-large').forEach(el => {
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

    // Убрал .project-card
    const cardsSelector = '.skill-category, .spotify-player';

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
    // Убрал .projects-section-large и .project-card
    const mobileElements = '.skills-section-large, .skill-category, .stat-item, .spotify-section-large, .spotify-player';

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
      setupNavigation(modal, modalId);

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
            description.innerHTML = `${shortText}<span class="read-more">... еще</span>`;

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

  function setupNavigation(modal, currentId) {
    const oldArrows = modal.querySelectorAll('.project-nav-arrow');
    oldArrows.forEach(arrow => arrow.remove());

    if (window.innerWidth > 1024) {
      const prevBtn = document.createElement('button');
      prevBtn.className = 'project-nav-arrow prev';
      prevBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>';

      const nextBtn = document.createElement('button');
      nextBtn.className = 'project-nav-arrow next';
      nextBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>';

      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateProject(-1);
      });

      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateProject(1);
      });

      modal.appendChild(prevBtn);
      modal.appendChild(nextBtn);
    }

    let touchStartX = 0;
    let touchEndX = 0;

    modal.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
        navigateProject(1);
      }
      if (touchEndX > touchStartX + swipeThreshold) {
        navigateProject(-1);
      }
    }
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
    setupNavigation(nextModal, nextId);

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
        if (activeModal) navigateProject(-1);
    } else if (e.key === 'ArrowRight') {
        const activeModal = document.querySelector('.project-modal-overlay.active');
        if (activeModal) navigateProject(1);
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
  const triggers = document.querySelectorAll('.avatar-image, .album-cover-image, .project-modal-image');

  if (!lightbox || !lightboxImg) return;

  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
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
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= (sectionTop - sectionHeight / 3)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current)) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
  optimizeForMobile();
  initAnimations();
  initProjectModals();
  imagesFallback();
  initSpotifyPlayer();
  initNavigation();
  initLightbox();
  animateStatNumbers();
  initScrollSpy(); // Инициализация подсветки меню
});
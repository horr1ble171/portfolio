// Регистрируем плагин ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Основная функция инициализации
function initPortfolio() {
    console.log('🚀 horr1ble portfolio loaded');
    
    initThemeSwitcher();
    initAnimations();
    initSpotifyAnimations();
    updateParallax();
    initAvatarFallback();
}

// Управление темой
function initThemeSwitcher() {
    const themeSwitch = document.getElementById('theme-switch');
    const body = document.body;

    // Восстанавливаем сохраненную тему
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        themeSwitch.checked = true;
        body.classList.add('dark-theme');
    }

    // Обработчик переключения
    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    });

    // Анимация появления переключателя
    gsap.to('.theme-switcher-container', {
        duration: 0.8,
        opacity: 1,
        y: 0,
        delay: 1.5,
        ease: "power2.out",
        onComplete: () => {
            document.querySelector('.theme-switcher-container').classList.add('loaded');
        }
    });
}

// Основные анимации
function initAnimations() {
    const tl = gsap.timeline();

    tl.to(".avatar-container", {
        duration: 1.2,
        opacity: 1,
        y: 0,
        ease: "back.out(1.4)"
    })
    .to(".hero-title", {
        duration: 1,
        opacity: 1,
        y: 0,
        ease: "power2.out"
    }, "-=0.8")
    .to(".hero-subtitle", {
        duration: 0.8,
        opacity: 1,
        y: 0,
        ease: "power2.out"
    }, "-=0.6")
    .to(".social-icons-container", {
        duration: 0.8,
        opacity: 1,
        y: 0,
        ease: "power2.out"
    }, "-=0.4")
    .to(".social-icon", {
        duration: 0.8,
        opacity: 1,
        y: 0,
        stagger: 0.1,
        ease: "back.out(1.2)"
    }, "-=0.6");

    // Анимация секции проектов
    gsap.fromTo("#projects-section", {
        opacity: 0,
        y: 50
    }, {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
            trigger: "#projects-section",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });
}

// Анимации Spotify
function initSpotifyAnimations() {
    // Заголовок
    gsap.fromTo(".spotify-title", {
        opacity: 0,
        y: 50
    }, {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
            trigger: "#spotify",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });

    // Плеер
    gsap.fromTo(".spotify-player", {
        opacity: 0,
        y: 50
    }, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.3,
        scrollTrigger: {
            trigger: "#spotify",
            start: "top 70%",
            toggleActions: "play none none reverse"
        },
        onComplete: function() {
            document.querySelector('.spotify-player').classList.add('animated');
            animateSpotifyElements();
        }
    });
}

// Анимация элементов Spotify
function animateSpotifyElements() {
    const tl = gsap.timeline();
    
    tl.to(".spotify-header", {
        duration: 0.6,
        opacity: 1,
        y: 0,
        ease: "power2.out"
    })
    .to(".spotify-content", {
        duration: 0.6,
        opacity: 1,
        y: 0,
        ease: "power2.out"
    }, "-=0.3")
    .to(".spotify-controls", {
        duration: 0.6,
        opacity: 1,
        y: 0,
        ease: "power2.out"
    }, "-=0.3")
    .to(".spotify-link", {
        duration: 0.6,
        opacity: 1,
        y: 0,
        ease: "power2.out"
    }, "-=0.3");
}

// Параллакс эффект
let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX - window.innerWidth / 2) * 0.002;
    targetY = (e.clientY - window.innerHeight / 2) * 0.002;
});

function updateParallax() {
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;

    gsap.to(".hero-title", {
        duration: 2,
        x: mouseX * 20,
        y: mouseY * 20,
        ease: "power2.out"
    });

    gsap.to(".avatar-container", {
        duration: 2,
        x: mouseX * 10,
        y: mouseY * 10,
        ease: "power2.out"
    });

    requestAnimationFrame(updateParallax);
}

// Управление проектами
function toggleProject(projectId) {
    const projectDetails = document.getElementById(projectId);
    const allProjectDetails = document.querySelectorAll('.project-details');

    // Закрываем другие проекты
    allProjectDetails.forEach(detail => {
        if (detail.id !== projectId && detail.classList.contains('open')) {
            gsap.to(detail, {
                duration: 0.3,
                maxHeight: 0,
                opacity: 0,
                y: -10,
                ease: "power2.inOut",
                onComplete: () => {
                    detail.classList.remove('open');
                }
            });
        }
    });

    // Открываем/закрываем выбранный
    if (projectDetails.classList.contains('open')) {
        gsap.to(projectDetails, {
            duration: 0.3,
            maxHeight: 0,
            opacity: 0,
            y: -10,
            ease: "power2.inOut",
            onComplete: () => {
                projectDetails.classList.remove('open');
            }
        });
    } else {
        projectDetails.classList.add('open');
        
        gsap.fromTo(projectDetails,
            { 
                maxHeight: 0,
                opacity: 0,
                y: -10
            },
            { 
                maxHeight: 500,
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "power2.out"
            }
        );
    }
}

// Фолбэк для аватара
function initAvatarFallback() {
    const avatarImg = document.querySelector('.avatar-image');
    if (avatarImg) {
        avatarImg.onerror = function() {
            this.style.display = 'none';
            this.parentElement.innerHTML = '<div class="avatar-placeholder">H</div>';
        };
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initPortfolio);

// Обновление анимаций при ресайзе
window.addEventListener('resize', () => ScrollTrigger.refresh());

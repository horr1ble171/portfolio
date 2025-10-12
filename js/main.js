// Регистрируем плагин ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Функционал смены темы
function initThemeSwitcher() {
    const themeSwitch = document.getElementById('theme-switch');
    const body = document.body;

    // Проверяем сохраненную тему
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        themeSwitch.checked = true;
        body.classList.add('dark-theme');
    }

    // Обработчик изменения темы
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

// Плавная анимация появления при загрузке
function initPageAnimations() {
    const tl = gsap.timeline();

    // Анимация аватара
    tl.to(".avatar-container", {
        duration: 1.2,
        opacity: 1,
        y: 0,
        ease: "back.out(1.4)"
    })
    // Анимация заголовка
    .to(".hero-title", {
        duration: 1,
        opacity: 1,
        y: 0,
        ease: "power2.out"
    }, "-=0.8")
    // Анимация подзаголовка
    .to(".hero-subtitle", {
        duration: 0.8,
        opacity: 1,
        y: 0,
        ease: "power2.out"
    }, "-=0.6")
    // Анимация иконок соцсетей
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

    // Анимация второй секции (проекты)
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
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        }
    });
}

// Анимация появления Spotify секции
function initSpotifyAnimation() {
    // Анимация заголовка Spotify
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
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        }
    });

    // Анимация самого плеера с задержкой
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
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        onComplete: function() {
            document.querySelector('.spotify-player').classList.add('animated');
            animateSpotifyElements();
        }
    });
}

// Анимация внутренних элементов Spotify плеера
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

// Плавный параллакс эффект для мыши
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

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

// Функция для открытия/закрытия проекта
function toggleProject(projectId) {
    const projectDetails = document.getElementById(projectId);
    const allProjectDetails = document.querySelectorAll('.project-details');

    // Закрываем все другие открытые проекты
    allProjectDetails.forEach(detail => {
        if (detail.id !== projectId && detail.classList.contains('open')) {
            // Анимация закрытия
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

    // Открываем/закрываем выбранный проект
    if (projectDetails.classList.contains('open')) {
        // Анимация закрытия
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
        // Сначала показываем контейнер с анимацией
        projectDetails.style.display = 'block';
        
        // Анимация открытия контейнера
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
                ease: "power2.out",
                onComplete: function() {
                    projectDetails.classList.add('open');
                    // После открытия контейнера анимируем появление контента
                    animateProjectElements(projectDetails);
                }
            }
        );
    }
}

// Анимация элементов внутри открытого проекта
function animateProjectElements(projectDetails) {
    const content = projectDetails.querySelector('.project-details-content');
    
    // Сначала убедимся что контент видим
    content.style.display = 'block';
    
    // Затем анимируем появление
    gsap.fromTo(content,
        { 
            opacity: 0,
            y: -10
        },
        { 
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            delay: 0.1
        }
    );
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 horr1ble portfolio loaded');

    // Инициализируем переключатель темы
    initThemeSwitcher();

    // Инициализируем анимации
    initPageAnimations();
    initSpotifyAnimation();

    // Запускаем параллакс
    updateParallax();

    // Проверяем наличие аватара
    const avatarImg = document.querySelector('.avatar-image');
    if (avatarImg) {
        avatarImg.onerror = function() {
            this.style.display = 'none';
            this.parentElement.innerHTML = '<div class="avatar-placeholder">H</div>';
        };
    }
});

// Ресайз окна
window.addEventListener('resize', function() {
    // Обновляем анимации при ресайзе
    ScrollTrigger.refresh();
});

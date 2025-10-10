// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 horr1ble portfolio loaded');
    
    initThemeSwitcher();
    initAnimations();
    startParallax();
});

// Управление темой
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

    // Показываем переключатель
    setTimeout(() => {
        document.querySelector('.theme-switcher-container').style.opacity = '1';
    }, 1000);
}

// Анимации
function initAnimations() {
    // Регистрируем плагин
    if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Анимация появления элементов
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

    // Анимации при скролле
    initScrollAnimations();
}

function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    // Анимация секций
    gsap.utils.toArray('#projects, #spotify').forEach(section => {
        gsap.fromTo(section, {
            opacity: 0,
            y: 50
        }, {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Анимация карточек проектов
    gsap.fromTo(".project-card", {
        opacity: 0,
        y: 30
    }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
            trigger: "#projects",
            start: "top 70%",
            toggleActions: "play none none reverse"
        }
    });

    // Анимация спотифай плеера
    gsap.fromTo(".spotify-player", {
        opacity: 0,
        scale: 0.9
    }, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        scrollTrigger: {
            trigger: "#spotify",
            start: "top 70%",
            toggleActions: "play none none reverse"
        }
    });
}

// Управление проектами
function toggleProject(projectId) {
    const projectDetails = document.getElementById(projectId);
    const isVisible = projectDetails.style.display === 'block';
    
    // Закрываем все проекты
    document.querySelectorAll('.project-details').forEach(detail => {
        if (gsap) {
            gsap.to(detail, {
                height: 0,
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    detail.style.display = 'none';
                }
            });
        } else {
            detail.style.display = 'none';
        }
    });
    
    // Открываем выбранный проект
    if (!isVisible) {
        projectDetails.style.display = 'block';
        if (gsap) {
            gsap.fromTo(projectDetails, 
                { opacity: 0, height: 0 }, 
                { opacity: 1, height: 'auto', duration: 0.4 }
            );
        }
    }
}

// Параллакс эффект
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

function startParallax() {
    document.addEventListener('mousemove', (e) => {
        targetX = (e.clientX - window.innerWidth / 2) * 0.002;
        targetY = (e.clientY - window.innerHeight / 2) * 0.002;
    });

    function updateParallax() {
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        if (gsap) {
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
        }

        requestAnimationFrame(updateParallax);
    }

    updateParallax();
}

// Ресайз
window.addEventListener('resize', function() {
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
});

// Обработка ошибок изображений
document.addEventListener('DOMContentLoaded', function() {
    const avatarImg = document.querySelector('.avatar-image');
    if (avatarImg) {
        avatarImg.onerror = function() {
            this.style.display = 'none';
            this.parentElement.innerHTML = '<div class="avatar-placeholder">H</div>';
        };
    }
});

// Main application
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 horr1ble portfolio loaded');
        
        // Register GSAP plugins
        gsap.registerPlugin(ScrollTrigger);

        // Initialize modules
        this.initThemeSwitcher();
        this.initAnimations();
        this.initEventListeners();
        this.startParallax();
    }

    // Theme management
    initThemeSwitcher() {
        const themeSwitch = document.getElementById('theme-switch');
        const body = document.body;

        // Check saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Set initial theme
        const initialTheme = savedTheme === 'dark' || (savedTheme === 'auto' && prefersDark) ? 'dark' : 'light';
        
        if (initialTheme === 'dark') {
            themeSwitch.checked = true;
            body.setAttribute('data-theme', 'dark');
        }

        // Theme change handler
        themeSwitch.addEventListener('change', (e) => {
            const isDark = e.target.checked;
            body.setAttribute('data-theme', isDark ? 'dark' : 'light');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });

        // Animate theme switcher appearance
        this.animateThemeSwitcher();
    }

    animateThemeSwitcher() {
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

    // Animations
    initAnimations() {
        this.animateHeroSection();
        this.initScrollAnimations();
    }

    animateHeroSection() {
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
        }, "-=0.6")
        .to(".btn", {
            duration: 0.8,
            opacity: 1,
            y: 0,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.4");
    }

    initScrollAnimations() {
        // Projects section animation
        gsap.fromTo("#projects", {
            opacity: 0,
            y: 50
        }, {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
                trigger: "#projects",
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            }
        });

        // Projects cards animation
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
                end: "bottom 30%",
                toggleActions: "play none none reverse"
            }
        });

        // Spotify section animation
        gsap.fromTo("#spotify", {
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
    }

    // Parallax effect
    startParallax() {
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        document.addEventListener('mousemove', (e) => {
            targetX = (e.clientX - window.innerWidth / 2) * 0.002;
            targetY = (e.clientY - window.innerHeight / 2) * 0.002;
        });

        const updateParallax = () => {
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
        };

        updateParallax();
    }

    // Event listeners
    initEventListeners() {
        this.handleAvatarError();
        this.handleResize();
    }

    handleAvatarError() {
        const avatarImg = document.querySelector('.avatar-image');
        if (avatarImg) {
            avatarImg.onerror = () => {
                avatarImg.style.display = 'none';
                avatarImg.parentElement.innerHTML = '<div class="avatar-placeholder">H</div>';
            };
        }
    }

    handleResize() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                ScrollTrigger.refresh();
            }, 250);
        });
    }
}

// Project functionality
class ProjectManager {
    static toggleProject(projectId) {
        const projectDetails = document.getElementById(projectId);
        const allProjectDetails = document.querySelectorAll('.project-details');

        // Close all other open projects
        allProjectDetails.forEach(detail => {
            if (detail.id !== projectId && detail.style.display === 'block') {
                gsap.to(detail, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.inOut",
                    onComplete: () => {
                        detail.style.display = 'none';
                    }
                });
            }
        });

        // Toggle selected project
        if (projectDetails.style.display === 'block') {
            gsap.to(projectDetails, {
                height: 0,
                opacity: 0,
                duration: 0.3,
                ease: "power2.inOut",
                onComplete: () => {
                    projectDetails.style.display = 'none';
                }
            });
        } else {
            projectDetails.style.display = 'block';
            gsap.fromTo(projectDetails,
                { height: 0, opacity: 0 },
                { height: 'auto', opacity: 1, duration: 0.4, ease: "power2.out" }
            );
        }
    }
}

// Global function for HTML onclick
function toggleProject(projectId) {
    ProjectManager.toggleProject(projectId);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioApp, ProjectManager };
}

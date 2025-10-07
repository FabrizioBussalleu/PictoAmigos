import { appState } from './state.js';
import { showScreen, showNotification, safeVibrate, getCurrentTime } from './dom.js';
import { initializeAuth } from './auth.js';
import { initializeChat } from './chat.js';
import { initializeExtensions } from './extensions-refactored.js';

class PictoAmigosApp {
    constructor() {
        this.authModule = null;
        this.chatModule = null;
        this.extensionsModule = null;
    }

    initialize() {
        this.authModule = initializeAuth();
        this.chatModule = initializeChat();
        this.extensionsModule = initializeExtensions();

        this.setupUIEventHandlers();
        this.setupFormEnhancements();
        this.setupMobileOptimizations();
        this.setupKonamiCode();
        this.createParticleEffect();

        showScreen('welcomeScreen');
    }

    setupUIEventHandlers() {
        window.showScreen = (screenId) => showScreen(screenId);

        window.showNotifications = () => {
            this.chatModule.showNotifications();
        };

        window.logout = () => {
            this.authModule.logout();
        };

        window.selectFriend = (friendName) => {
            this.chatModule.selectFriend(friendName);
        };

        window.sendMessage = () => {
            this.chatModule.sendMessage();
        };

        window.addPictogram = (pictogram) => {
            this.chatModule.addPictogram(pictogram);
            this.extensionsModule.achievementSystem.trackPictogramUse(pictogram);

            if (event && event.target) {
                event.target.style.transform = 'scale(1.3) rotate(15deg)';
                setTimeout(() => {
                    event.target.style.transform = '';
                }, 200);
            }
        };

        window.changeTheme = (themeName) => {
            this.extensionsModule.changeTheme(themeName);
        };

        window.toggleSound = () => {
            this.extensionsModule.toggleSound();
        };

        window.showAchievements = () => {
            this.extensionsModule.showAchievements();
        };
    }

    setupFormEnhancements() {
        const labels = document.querySelectorAll('.input-group label');
        labels.forEach(label => {
            label.addEventListener('click', function() {
                const input = this.parentElement.querySelector('input, select');
                if (input) {
                    input.focus();
                }
            });
        });

        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.closest('.input-group').style.transform = 'translateY(-2px)';
                this.closest('.input-group').style.transition = 'transform 0.3s ease';
            });

            input.addEventListener('blur', function() {
                this.closest('.input-group').style.transform = 'translateY(0)';
            });
        });

        const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
        textInputs.forEach(input => {
            input.addEventListener('input', function() {
                if (navigator.vibrate && this.value.length > 0) {
                    safeVibrate(10);
                }
            });
        });
    }

    setupMobileOptimizations() {
        if (this.isMobile()) {
            const inputs = document.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('focus', function() {
                    this.style.fontSize = '16px';
                });
            });

            let touchStartY = 0;
            let touchEndY = 0;

            document.addEventListener('touchstart', function(event) {
                touchStartY = event.changedTouches[0].screenY;
            });

            document.addEventListener('touchend', function(event) {
                touchEndY = event.changedTouches[0].screenY;
                handleGesture();
            });

            function handleGesture() {
                const swipeThreshold = 50;
                const diff = touchStartY - touchEndY;

                if (Math.abs(diff) > swipeThreshold) {
                    safeVibrate(25);
                }
            }
        }
    }

    setupKonamiCode() {
        let konamiCode = [];
        const konamiSequence = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];

        document.addEventListener('keydown', (event) => {
            konamiCode.push(event.code);

            if (konamiCode.length > konamiSequence.length) {
                konamiCode.shift();
            }

            if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
                this.activateRainbowMode();
                konamiCode = [];
            }
        });
    }

    activateRainbowMode() {
        showNotification('¡Modo Arcoíris Activado! 🌈✨', 'success');

        document.body.style.animation = 'rainbow 2s infinite';

        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                25% { filter: hue-rotate(90deg); }
                50% { filter: hue-rotate(180deg); }
                75% { filter: hue-rotate(270deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            document.body.style.animation = '';
            style.remove();
        }, 10000);
    }

    createParticleEffect() {
        const welcomeScreen = document.querySelector('.welcome-screen');
        if (!welcomeScreen) return;

        const particles = ['✨', '🌟', '💫', '⭐', '🌈', '🎈', '🎨', '🦄'];

        setInterval(() => {
            const particle = document.createElement('div');
            particle.textContent = particles[Math.floor(Math.random() * particles.length)];
            particle.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 20 + 15}px;
                left: ${Math.random() * 100}%;
                top: -50px;
                opacity: 0.7;
                pointer-events: none;
                z-index: -1;
                animation: particleFall ${Math.random() * 3 + 2}s linear forwards;
            `;

            welcomeScreen.appendChild(particle);

            setTimeout(() => {
                if (particle.parentElement) {
                    particle.remove();
                }
            }, 5000);
        }, 1000);
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new PictoAmigosApp();
    app.initialize();
    window.pictoAmigosApp = app;
    window.appState = appState;
    window.getCurrentTime = getCurrentTime;
});

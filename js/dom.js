export function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen, .welcome-screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });

    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        setTimeout(() => {
            targetScreen.classList.add('active');
        }, 100);
    }

    safeVibrate(50);
}

export function safeVibrate(pattern) {
    try {
        if (navigator.vibrate && document.hasFocus()) {
            navigator.vibrate(pattern);
        }
    } catch (error) {
        console.warn('Vibration not supported');
    }
}

export function markFieldAsValid(inputGroup) {
    inputGroup.classList.remove('error');
    inputGroup.classList.add('valid');

    const existingError = inputGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

export function markFieldAsError(inputGroup, message) {
    inputGroup.classList.remove('valid');
    inputGroup.classList.add('error');

    const existingError = inputGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: var(--danger-color);
        font-size: var(--font-size-xs);
        margin-top: var(--spacing-xs);
        animation: errorSlide 0.3s ease;
    `;

    inputGroup.appendChild(errorElement);
}

export function clearFieldValidation(inputGroup) {
    inputGroup.classList.remove('valid', 'error');
    const existingError = inputGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

export function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };

    notification.innerHTML = `
        <div class="notification-content">
            <i class="${iconMap[type] || iconMap.info}"></i>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 350px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        animation: slideInRight 0.3s ease;
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);

    return notification;
}

function getNotificationColor(type) {
    const colors = {
        success: 'linear-gradient(135deg, #6BCF7F 0%, #4CAF50 100%)',
        error: 'linear-gradient(135deg, #FF6B6B 0%, #E74C3C 100%)',
        warning: 'linear-gradient(135deg, #FFD93D 0%, #F39C12 100%)',
        info: 'linear-gradient(135deg, #4ECDC4 0%, #17A2B8 100%)'
    };
    return colors[type] || colors.info;
}

export function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

export function createCelebrationEffect() {
    const emojis = ['🎉', '🎊', '✨', '🌟', '🎈', '🦄', '🌈'];

    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            particle.style.cssText = `
                position: fixed;
                font-size: ${Math.random() * 20 + 20}px;
                left: ${Math.random() * 100}vw;
                top: -50px;
                pointer-events: none;
                z-index: 10000;
                animation: celebrationFall ${Math.random() * 2 + 3}s ease-out forwards;
            `;

            document.body.appendChild(particle);

            setTimeout(() => {
                if (particle.parentElement) {
                    particle.remove();
                }
            }, 5000);
        }, i * 100);
    }
}

export function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

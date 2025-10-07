import { appState } from './state.js';
import { showScreen, showNotification, safeVibrate, createCelebrationEffect, markFieldAsValid, markFieldAsError } from './dom.js';
import { FormValidator, ValidationRules } from './validation.js';

export class AuthModule {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const registerForm = document.getElementById('registerForm');
        const loginForm = document.getElementById('loginForm');

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
            this.addRealTimeValidation(registerForm, 'register');
        }

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
            this.addRealTimeValidation(loginForm, 'login');
        }
    }

    async handleRegister(event) {
        event.preventDefault();

        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        const formData = new FormData(form);
        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            age: formData.get('age')
        };

        const validator = new FormValidator(form, {
            username: [ValidationRules.required, ValidationRules.minLength(3)],
            email: [ValidationRules.required, ValidationRules.email],
            password: [ValidationRules.required, ValidationRules.minLength(6)],
            age: [ValidationRules.required]
        });

        const isValid = validator.validate();
        const errors = validator.getErrors();

        Object.keys(errors).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            const inputGroup = field?.closest('.input-group');
            if (inputGroup) {
                markFieldAsError(inputGroup, errors[fieldName]);
            }
        });

        if (!isValid) {
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }, 500);
            showNotification('Por favor, corrige los errores en el formulario', 'warning');
            safeVibrate([100, 50, 100]);
            return;
        }

        setTimeout(() => {
            appState.setCurrentUser(userData);

            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;

            submitBtn.style.background = 'var(--gradient-success)';
            submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Cuenta Creada!';

            showNotification('¡Cuenta creada exitosamente! Bienvenido a PictoAmigos', 'success');

            createCelebrationEffect();

            appState.publish('userRegistered', userData);

            setTimeout(() => {
                document.getElementById('userNameDisplay').textContent = `¡Hola, ${userData.username}!`;
                showScreen('mainScreen');
                appState.publish('screenChanged', 'mainScreen');
            }, 1000);
        }, 1000);
    }

    async handleLogin(event) {
        event.preventDefault();

        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        const formData = new FormData(form);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        const validator = new FormValidator(form, {
            email: [ValidationRules.required, ValidationRules.email],
            password: [ValidationRules.required]
        });

        const isValid = validator.validate();
        const errors = validator.getErrors();

        Object.keys(errors).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            const inputGroup = field?.closest('.input-group');
            if (inputGroup) {
                markFieldAsError(inputGroup, errors[fieldName]);
            }
        });

        if (!isValid) {
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }, 500);
            showNotification('Por favor, completa todos los campos correctamente', 'warning');
            safeVibrate([100, 50, 100]);
            return;
        }

        setTimeout(() => {
            const userData = {
                username: loginData.email.split('@')[0],
                email: loginData.email
            };

            appState.setCurrentUser(userData);

            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;

            submitBtn.style.background = 'var(--gradient-success)';
            submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡Bienvenido!';

            showNotification('¡Bienvenido de vuelta!', 'success');

            appState.publish('userLoggedIn', userData);

            setTimeout(() => {
                document.getElementById('userNameDisplay').textContent = `¡Hola, ${userData.username}!`;
                showScreen('mainScreen');
                appState.publish('screenChanged', 'mainScreen');
            }, 800);
        }, 800);
    }

    addRealTimeValidation(form, formType) {
        const fields = form.querySelectorAll('input, select');

        fields.forEach(field => {
            field.addEventListener('input', () => {
                const inputGroup = field.closest('.input-group');
                const fieldName = field.getAttribute('name');

                if (!inputGroup || !fieldName) return;

                const value = field.value;
                let rules = [];

                switch (fieldName) {
                    case 'username':
                        rules = [ValidationRules.minLength(3)];
                        break;
                    case 'email':
                    case 'loginEmail':
                        rules = [ValidationRules.email];
                        break;
                    case 'password':
                    case 'loginPassword':
                        if (formType === 'register') {
                            rules = [ValidationRules.minLength(6)];
                        }
                        break;
                }

                if (value.length === 0) {
                    inputGroup.classList.remove('valid', 'error');
                    const existingError = inputGroup.querySelector('.error-message');
                    if (existingError) {
                        existingError.remove();
                    }
                    return;
                }

                let allValid = true;
                for (const rule of rules) {
                    const result = rule(value);
                    if (!result.valid) {
                        markFieldAsError(inputGroup, result.message);
                        allValid = false;
                        break;
                    }
                }

                if (allValid && rules.length > 0) {
                    markFieldAsValid(inputGroup);
                }
            });

            field.addEventListener('change', () => {
                if (field.tagName === 'SELECT') {
                    const inputGroup = field.closest('.input-group');
                    if (field.value) {
                        markFieldAsValid(inputGroup);
                    }
                }
            });
        });
    }

    logout() {
        appState.setCurrentUser(null);
        showNotification('¡Hasta luego! Vuelve pronto', 'info');
        appState.publish('userLoggedOut');
        setTimeout(() => {
            showScreen('welcomeScreen');
        }, 1000);
    }
}

export function initializeAuth() {
    return new AuthModule();
}

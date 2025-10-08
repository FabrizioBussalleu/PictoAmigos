export const ValidationRules = {
    required: (value) => ({
        valid: value && value.trim().length > 0,
        message: 'Este campo es requerido'
    }),

    minLength: (min) => (value) => ({
        valid: value && value.length >= min,
        message: `Debe tener al menos ${min} caracteres`
    }),

    maxLength: (max) => (value) => ({
        valid: !value || value.length <= max,
        message: `No debe exceder ${max} caracteres`
    }),

    email: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
            valid: !value || emailRegex.test(value),
            message: 'Ingresa un email válido'
        };
    },

    pattern: (regex, message) => (value) => ({
        valid: !value || regex.test(value),
        message: message || 'Formato inválido'
    })
};

export class FormValidator {
    constructor(formElement, validationRules) {
        this.form = formElement;
        this.rules = validationRules;
        this.errors = {};
    }

    validate() {
        this.errors = {};
        let isValid = true;

        Object.keys(this.rules).forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (!field) return;

            const value = field.value;
            const fieldRules = this.rules[fieldName];

            for (const rule of fieldRules) {
                const result = rule(value);
                if (!result.valid) {
                    this.errors[fieldName] = result.message;
                    isValid = false;
                    break;
                }
            }
        });

        return isValid;
    }

    getErrors() {
        return this.errors;
    }

    getFieldError(fieldName) {
        return this.errors[fieldName];
    }

    hasError(fieldName) {
        return !!this.errors[fieldName];
    }
}

export function validateField(value, rules) {
    for (const rule of rules) {
        const result = rule(value);
        if (!result.valid) {
            return result;
        }
    }
    return { valid: true };
}

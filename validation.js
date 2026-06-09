// js/validation.js — form validation helpers

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validatePhone(phone) {
  // Accepts Indian mobile numbers (10 digits, optionally +91 prefix)
  return /^(\+91[\s-]?)?[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));
}

/**
 * Validate a field and show/hide its error message.
 * @param {HTMLElement} field  – the input / select / textarea
 * @param {string}      msg    – error text (falsy = clear error)
 * @returns {boolean}  true if valid
 */
export function setFieldError(field, msg) {
  const group = field.closest('.form-group');
  let errEl = group?.querySelector('.field-error');

  if (!errEl && group) {
    errEl = document.createElement('span');
    errEl.className = 'field-error';
    group.appendChild(errEl);
  }

  if (msg) {
    field.classList.add('error');
    if (errEl) errEl.textContent = msg;
    return false;
  } else {
    field.classList.remove('error');
    if (errEl) errEl.textContent = '';
    return true;
  }
}

/**
 * Run all validators; returns true only if every field passes.
 * validators: Array<{ field: HTMLElement, rules: [{ test: fn, msg: string }] }>
 */
export function runValidation(validators) {
  let valid = true;
  for (const { field, rules } of validators) {
    let fieldValid = true;
    for (const { test, msg } of rules) {
      if (!test(field.value)) {
        setFieldError(field, msg);
        fieldValid = false;
        break;
      }
    }
    if (fieldValid) setFieldError(field, null);
    if (!fieldValid) valid = false;
  }
  return valid;
}

// Clear all errors in a form
export function clearErrors(form) {
  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  form.querySelectorAll('.field-error').forEach(el => (el.textContent = ''));
}

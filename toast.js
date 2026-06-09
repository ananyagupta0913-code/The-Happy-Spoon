// js/toast.js — lightweight toast notification utility

let container = null;

function getContainer() {
  if (!container) {
    container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
  }
  return container;
}

/**
 * Show a toast notification.
 * @param {string} message
 * @param {'success'|'error'|'warning'} type
 * @param {number} duration  ms before auto-dismiss (0 = never)
 */
export function showToast(message, type = 'success', duration = 4000) {
  const icons = { success: '✓', error: '✕', warning: '⚠' };
  const c = getContainer();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] ?? '●'}</span>
    <span class="toast-msg">${message}</span>
    <button class="toast-close" aria-label="Close">×</button>
  `;

  const dismiss = () => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  };

  toast.querySelector('.toast-close').addEventListener('click', dismiss);
  if (duration > 0) setTimeout(dismiss, duration);

  c.appendChild(toast);
  return toast;
}

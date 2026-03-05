// Dark Mode + Stars + Moon
const THEME_KEY = 'rms_theme';

function initRetroMode() {
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  applyTheme(saved);
  updateToggle(saved);
  generateStars();
}

function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
  updateToggle(theme);
}

function applyTheme(theme) {
  if (theme === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

function updateToggle(theme) {
  document.querySelectorAll('.theme-toggle-opt').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.themeVal === theme);
  });
}

function generateStars() {
  const container = document.getElementById('starsContainer');
  if (!container) return;
  
  for (let i = 0; i < 60; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.setProperty('--dur', (2 + Math.random() * 3) + 's');
    star.style.setProperty('--bright', (0.4 + Math.random() * 0.6));
    star.style.setProperty('--scale', (1.1 + Math.random() * 0.4));
    star.style.animationDelay = Math.random() * 3 + 's';
    container.appendChild(star);
  }
}

window.setTheme = setTheme;
window.initRetroMode = initRetroMode;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRetroMode);
} else {
  initRetroMode();
}
// Retro Mode - Injects retro toggle button + loads retro CSS
(function() {
  // Inject retro theme CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/css/retro-theme.css';
  document.head.appendChild(link);

  // Inject retro button into toggle after DOM is ready
  function injectRetroButton() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    // Check if already exists
    if (toggle.querySelector('[data-theme-val="retro"]')) return;
    const btn = document.createElement('div');
    btn.className = 'theme-toggle-opt';
    btn.setAttribute('data-theme-val', 'retro');
    btn.title = 'Retro';
    btn.onclick = () => window.setTheme('retro');
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="12" x2="6" y2="12.01"/><line x1="10" y1="12" x2="10" y2="12.01"/><path d="M14 12h4"/><path d="M6 16h4"/><path d="M14 16h4"/></svg>';
    toggle.appendChild(btn);

    // Re-apply active state
    const saved = localStorage.getItem('rms_theme');
    if (saved) {
      toggle.querySelectorAll('.theme-toggle-opt').forEach(opt => {
        opt.classList.toggle('active', opt.getAttribute('data-theme-val') === saved);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectRetroButton);
  } else {
    injectRetroButton();
  }
})();

// =============================================================================
// LOADER.JS - Carrega todos os scripts do RetroMynd Study Hub
// Adicione apenas: <script src="js/loader.js"></script> no index.html
// =============================================================================

(function() {
  const scripts = [
    'js/api.js',
    'js/auth.js',
    'js/retro-mode.js',
    'js/main.js',
    'js/emoji-manager.js'
  ];

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = () => { console.warn('Failed to load:', src); resolve(); };
      document.body.appendChild(s);
    });
  }

  async function loadAll() {
    for (const src of scripts) {
      await loadScript(src);
    }
    console.log('[RetroMynd] All scripts loaded');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAll);
  } else {
    loadAll();
  }
})();

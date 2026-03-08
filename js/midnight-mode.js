/* =====================================================
   MIDNIGHT MODE — js/midnight-mode.js
   Applies/removes the midnight body class.
   Piggy-backs on retro-mode.js theme infrastructure.
   ===================================================== */
(function () {
  'use strict';
  /* midnight-mode.js is intentionally lightweight.
     The full cycle logic lives in retro-mode.js which
     already manages the rm_theme localStorage key and
     the .retro-toggle button.
     This file only ensures the midnight body class is
     applied on page load for pages that don't load
     retro-mode.js (login.html, landing.html already
     load retro-mode.js, but this is a safe no-op). */

  var THEME_KEY = 'rm_theme';

  function applyMidnightIfSaved() {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved === 'midnight') {
      document.body.classList.remove('retro-dark', 'retro-light', 'retro-mode');
      document.body.classList.add('midnight');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyMidnightIfSaved);
  } else {
    applyMidnightIfSaved();
  }
})();

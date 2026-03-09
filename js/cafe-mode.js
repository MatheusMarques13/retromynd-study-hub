(function () {
  'use strict';
  var THEME_KEY = 'rm_theme';

  function applyCafeIfSaved() {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved === 'cafe-dark' || saved === 'cafe-light') {
      document.body.classList.remove('retro-dark', 'retro-light', 'retro-mode');
      document.body.classList.add(saved);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyCafeIfSaved);
  } else {
    applyCafeIfSaved();
  }
})();

(function () {
  'use strict';
  var THEME_KEY = 'rm_theme';

  function applyCafeIfSaved() {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved === 'cafe') {
      document.body.classList.remove('retro-dark', 'retro-light', 'retro-mode');
      document.body.classList.add('cafe');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyCafeIfSaved);
  } else {
    applyCafeIfSaved();
  }
})();

/* ================================================================
   emoji-theme.js — Centralized emoji theming for RetroMynd Study Hub
   Comfy mode: native emoji with soft pastel glow + hover animation
   Retro mode: inline pixel-art SVG with pixelated rendering
   ================================================================ */
(function () {
  'use strict';

  /* ============================================================
     PIXEL-ART SVG MAP  (16×16, image-rendering: pixelated)
     Keys are the native emoji characters stored in data-native.
  ============================================================ */
  var RETRO_SVG = {

    /* 🔥 Fire — Streak stat */
    '\uD83D\uDD25':
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">'
      + '<rect x="7" y="1" width="2" height="2" fill="#FFD700"/>'
      + '<rect x="6" y="3" width="4" height="1" fill="#FFD700"/>'
      + '<rect x="5" y="4" width="6" height="1" fill="#FF8C00"/>'
      + '<rect x="4" y="5" width="8" height="1" fill="#FF8C00"/>'
      + '<rect x="3" y="6" width="10" height="2" fill="#FF8C00"/>'
      + '<rect x="3" y="8" width="10" height="2" fill="#CC2200"/>'
      + '<rect x="4" y="10" width="8" height="1" fill="#CC2200"/>'
      + '<rect x="5" y="11" width="6" height="1" fill="#CC2200"/>'
      + '<rect x="5" y="12" width="6" height="1" fill="#881000"/>'
      + '<rect x="6" y="13" width="4" height="1" fill="#881000"/>'
      + '</svg>',

    /* 📝 Memo — Notes stat */
    '\uD83D\uDCDD':
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">'
      + '<rect x="2" y="2" width="9" height="12" fill="#FFFDF0"/>'
      + '<rect x="2" y="2" width="9" height="12" fill="none" stroke="#CCBBAA" stroke-width="1"/>'
      + '<polygon points="9,2 12,5 9,5" fill="#DDCC88"/>'
      + '<rect x="9" y="2" width="3" height="3" fill="none" stroke="#CCBBAA" stroke-width="1"/>'
      + '<rect x="4" y="5" width="5" height="1" fill="#6DBDE8"/>'
      + '<rect x="4" y="7" width="5" height="1" fill="#6DBDE8"/>'
      + '<rect x="4" y="9" width="3" height="1" fill="#6DBDE8"/>'
      + '<rect x="7" y="0" width="2" height="3" fill="#888888"/>'
      + '</svg>',

    /* ✅ Check — Goals stat */
    '\u2705':
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">'
      + '<rect x="1" y="1" width="14" height="14" fill="#22BB55"/>'
      + '<rect x="1" y="1" width="14" height="14" fill="none" stroke="#118833" stroke-width="1"/>'
      + '<rect x="3" y="7" width="2" height="2" fill="#FFFFFF"/>'
      + '<rect x="5" y="9" width="2" height="2" fill="#FFFFFF"/>'
      + '<rect x="7" y="7" width="2" height="2" fill="#FFFFFF"/>'
      + '<rect x="9" y="5" width="2" height="2" fill="#FFFFFF"/>'
      + '<rect x="11" y="3" width="2" height="2" fill="#FFFFFF"/>'
      + '</svg>',

    /* ⏱ Stopwatch — Pomodoros stat */
    '\u23F1':
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">'
      + '<rect x="6" y="0" width="4" height="1" fill="#888888"/>'
      + '<rect x="7" y="1" width="2" height="2" fill="#AAAAAA"/>'
      + '<rect x="2" y="3" width="12" height="12" rx="6" fill="#CCCCCC"/>'
      + '<rect x="3" y="4" width="10" height="10" rx="5" fill="#EEEEEE"/>'
      + '<rect x="7" y="5" width="2" height="4" fill="#333333"/>'
      + '<rect x="8" y="8" width="3" height="1" fill="#333333"/>'
      + '<rect x="7" y="13" width="2" height="1" fill="#AAAAAA"/>'
      + '<rect x="2" y="8" width="1" height="1" fill="#AAAAAA"/>'
      + '<rect x="13" y="8" width="1" height="1" fill="#AAAAAA"/>'
      + '</svg>',

    /* ❤ Heart — login button */
    '\u2764':
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">'
      + '<rect x="1" y="4" width="4" height="1" fill="#FF4466"/>'
      + '<rect x="9" y="4" width="4" height="1" fill="#FF4466"/>'
      + '<rect x="0" y="5" width="6" height="4" fill="#FF4466"/>'
      + '<rect x="10" y="5" width="6" height="4" fill="#FF4466"/>'
      + '<rect x="6" y="5" width="4" height="4" fill="#FF4466"/>'
      + '<rect x="1" y="9" width="12" height="2" fill="#FF4466"/>'
      + '<rect x="2" y="11" width="10" height="1" fill="#FF4466"/>'
      + '<rect x="4" y="12" width="6" height="1" fill="#FF4466"/>'
      + '<rect x="6" y="13" width="2" height="1" fill="#FF4466"/>'
      + '</svg>',

    /* ⚡ Lightning — register / powered-by */
    '\u26A1':
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">'
      + '<rect x="8" y="0" width="5" height="1" fill="#FFD700"/>'
      + '<rect x="7" y="1" width="5" height="1" fill="#FFD700"/>'
      + '<rect x="6" y="2" width="5" height="1" fill="#FFD700"/>'
      + '<rect x="5" y="3" width="5" height="1" fill="#FFD700"/>'
      + '<rect x="4" y="4" width="7" height="2" fill="#FFD700"/>'
      + '<rect x="5" y="6" width="6" height="1" fill="#FFD700"/>'
      + '<rect x="3" y="7" width="8" height="1" fill="#FFD700"/>'
      + '<rect x="3" y="8" width="6" height="1" fill="#FFD700"/>'
      + '<rect x="3" y="9" width="5" height="1" fill="#FFD700"/>'
      + '<rect x="3" y="10" width="4" height="1" fill="#FFD700"/>'
      + '<rect x="3" y="11" width="3" height="1" fill="#FFD700"/>'
      + '</svg>',

    /* 📌 Pushpin — notes */
    '\uD83D\uDCCC':
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">'
      + '<rect x="6" y="0" width="4" height="2" fill="#CC2200"/>'
      + '<rect x="5" y="2" width="6" height="1" fill="#CC2200"/>'
      + '<rect x="4" y="3" width="8" height="4" fill="#DD3311"/>'
      + '<rect x="5" y="7" width="6" height="2" fill="#AA1100"/>'
      + '<rect x="7" y="9" width="2" height="5" fill="#AA1100"/>'
      + '<rect x="4" y="2" width="2" height="5" fill="#FF6644"/>'
      + '</svg>'

  };

  /* ============================================================
     CSS — injected once
  ============================================================ */
  if (!document.getElementById('emoji-theme-css')) {
    var style = document.createElement('style');
    style.id = 'emoji-theme-css';
    style.textContent = ''

      /* --- comfy wrapper --- */
      + '.emoji-themed {'
      + '  display:inline-flex;align-items:center;justify-content:center;'
      + '  line-height:1;vertical-align:middle; }'

      /* comfy: native emoji, pastel glow, smooth hover */
      + '.emoji-comfy {'
      + '  transition:transform .2s ease,filter .2s ease; }'
      + '.emoji-comfy:hover {'
      + '  transform:scale(1.3);'
      + '  filter:drop-shadow(0 0 6px rgba(255,107,157,.55))  drop-shadow(0 0 3px rgba(255,220,180,.4));'
      + '  animation:rmEmojiPop .25s ease; }'
      + '@keyframes rmEmojiPop{'
      + '  0%{transform:scale(1)}50%{transform:scale(1.4)}100%{transform:scale(1.3)} }'

      /* retro: pixel-art render */
      + '.emoji-retro {'
      + '  image-rendering:pixelated;image-rendering:crisp-edges; }'
      + '.emoji-retro svg {'
      + '  image-rendering:pixelated;image-rendering:crisp-edges;'
      + '  display:block;'
      + '  filter:drop-shadow(1px 1px 0 rgba(0,0,0,.5)); }'
      + 'body.retro-dark .emoji-retro svg {'
      + '  filter:drop-shadow(1px 1px 0 rgba(0,0,0,.7))'
      + '         drop-shadow(0 0 5px rgba(245,197,24,.25)); }'
      + 'body.retro-light .emoji-retro svg {'
      + '  filter:drop-shadow(1px 1px 0 rgba(0,0,0,.3)); }'

      /* stat-icon sizing */
      + '.stat-icon .emoji-themed { font-size:20px; }'
      + '.stat-icon .emoji-retro svg { width:20px;height:20px; }'

      ;
    document.head.appendChild(style);
  }

  /* ============================================================
     LOGIC
  ============================================================ */

  function isRetroMode() {
    return document.body.classList.contains('retro-dark') ||
           document.body.classList.contains('retro-light');
  }

  function updateSpan(span) {
    var native  = span.getAttribute('data-native') || span.innerHTML;
    var emoji   = span.getAttribute('data-emoji') || '';
    var retroSvg = RETRO_SVG[emoji];

    if (isRetroMode() && retroSvg) {
      span.classList.remove('emoji-comfy');
      span.classList.add('emoji-retro');
      span.innerHTML = retroSvg;
    } else {
      span.classList.remove('emoji-retro');
      span.classList.add('emoji-comfy');
      span.innerHTML = native;
    }
  }

  function applyEmojiTheme() {
    document.querySelectorAll('.emoji-themed').forEach(updateSpan);
  }

  /* Watch body class changes (retro mode toggle) and dynamic content */
  var emojiObserver = new MutationObserver(function (mutations) {
    var needUpdate = false;
    for (var i = 0; i < mutations.length; i++) {
      var m = mutations[i];
      if (m.attributeName === 'class') {
        needUpdate = true;
        break;
      }
      if (m.type === 'childList') {
        for (var j = 0; j < m.addedNodes.length; j++) {
          var node = m.addedNodes[j];
          if (node.nodeType === 1 &&
              (node.classList.contains('emoji-themed') ||
               (node.querySelector && node.querySelector('.emoji-themed')))) {
            needUpdate = true;
            break;
          }
        }
      }
      if (needUpdate) break;
    }
    if (needUpdate) { applyEmojiTheme(); }
  });

  function init() {
    emojiObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
      childList: true,
      subtree: true
    });
    applyEmojiTheme();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Expose for dynamic content (e.g. after renderApp re-renders the DOM) */
  window.applyEmojiTheme = applyEmojiTheme;

})();

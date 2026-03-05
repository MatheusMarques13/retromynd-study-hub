// =============================================================================
// EMOJI MANAGER - RetroMynd Study Hub
// Sistema inteligente de substituição de emojis entre modo Comfy e Retro
// =============================================================================

(function() {
  'use strict';

  // MAPA DE EMOJIS: Unicode → Comfy visual → Retro visual
  const EMOJI_MAP = {
    // STATS & ICONS
    '\uD83D\uDD25': {  // 🔥 Fire (Streak)
      comfy: '<span class="e-comfy e-fire" title="Streak">🔥</span>',
      retro: '<span class="e-retro e-fire-px" title="Streak">▓▓</span>'
    },
    '\uD83D\uDCDD': {  // 📝 Memo (Notas)
      comfy: '<span class="e-comfy e-note" title="Notas">📝</span>',
      retro: '<span class="e-retro e-note-px" title="Notas">■■</span>'
    },
    '\u2705': {  // ✅ Check Mark (Metas)
      comfy: '<span class="e-comfy e-check" title="Metas">✅</span>',
      retro: '<span class="e-retro e-check-px" title="Metas">◆◆</span>'
    },
    '\u23F1': {  // ⏱ Stopwatch (Pomodoros)
      comfy: '<span class="e-comfy e-timer" title="Pomodoros">⏱</span>',
      retro: '<span class="e-retro e-timer-px" title="Pomodoros">▲▲</span>'
    },

    // HEARTS
    '\uD83D\uDC95': {  // 💕 Two Hearts
      comfy: '<span class="e-comfy e-heart-two" title="Love">💕</span>',
      retro: '<span class="e-retro e-heart-px" title="Love">♥♥</span>'
    },
    '\uD83D\uDC96': {  // 💖 Sparkling Heart
      comfy: '<span class="e-comfy e-heart-spark" title="Love">💖</span>',
      retro: '<span class="e-retro e-heart-px-glow" title="Love">♦♦</span>'
    },

    // MISC
    '\u2764': {  // ❤ Red Heart
      comfy: '<span class="e-comfy e-heart-red" title="Love">❤</span>',
      retro: '<span class="e-retro e-heart-px-solid" title="Love">♥</span>'
    },
    '\u26A1': {  // ⚡ High Voltage
      comfy: '<span class="e-comfy e-bolt" title="Power">⚡</span>',
      retro: '<span class="e-retro e-bolt-px" title="Power">▼</span>'
    }
  };

  // CSS PARA OS ÍCONES CUSTOM
  const css = document.createElement('style');
  css.id = 'emoji-manager-css';
  css.textContent = `
    /* ═══ COMFY MODE ═══ */
    body:not(.retro-dark):not(.retro-light) .e-comfy {
      display: inline;
      font-style: normal;
      vertical-align: middle;
    }
    body:not(.retro-dark):not(.retro-light) .e-retro {
      display: none;
    }

    /* ═══ RETRO MODE ═══ */
    body.retro-dark .e-comfy,
    body.retro-light .e-comfy {
      display: none;
    }
    body.retro-dark .e-retro,
    body.retro-light .e-retro {
      display: inline-block;
      font-family: 'Press Start 2P', monospace !important;
      font-size: 0.75em;
      vertical-align: middle;
      letter-spacing: -1px;
    }

    /* ═══ RETRO ICON COLORS ═══ */
    body.retro-dark .e-fire-px,
    body.retro-light .e-fire-px {
      color: var(--rpink);
      text-shadow: 0 0 4px var(--rpink-glow);
    }
    body.retro-dark .e-note-px,
    body.retro-light .e-note-px {
      color: var(--rsky);
      text-shadow: 0 0 4px rgba(126,200,245,0.4);
    }
    body.retro-dark .e-check-px,
    body.retro-light .e-check-px {
      color: var(--rgold);
      text-shadow: 0 0 4px var(--rgold-glow);
    }
    body.retro-dark .e-timer-px,
    body.retro-light .e-timer-px {
      color: var(--rgreen);
      text-shadow: 0 0 4px rgba(46,204,113,0.4);
    }
    body.retro-dark .e-heart-px,
    body.retro-dark .e-heart-px-glow,
    body.retro-dark .e-heart-px-solid,
    body.retro-light .e-heart-px,
    body.retro-light .e-heart-px-glow,
    body.retro-light .e-heart-px-solid {
      color: var(--rpink);
      text-shadow: 0 0 6px var(--rpink-glow);
    }
    body.retro-dark .e-bolt-px,
    body.retro-light .e-bolt-px {
      color: var(--rgold);
      text-shadow: 0 0 8px var(--rgold-glow);
    }
  `;
  document.head.appendChild(css);

  // FUNÇÃO: Substituir emojis em elemento
  function replaceEmojis(element) {
    if (!element || !element.innerHTML) return;

    let html = element.innerHTML;
    let changed = false;

    // Substituir cada emoji do mapa
    Object.keys(EMOJI_MAP).forEach(function(emojiChar) {
      const map = EMOJI_MAP[emojiChar];
      const regex = new RegExp(emojiChar, 'g');

      // Verifica se o emoji já não foi substituído
      if (html.indexOf(emojiChar) !== -1 && html.indexOf('e-comfy') === -1 && html.indexOf('e-retro') === -1) {
        html = html.replace(regex, map.comfy + map.retro);
        changed = true;
      }
    });

    if (changed) {
      element.innerHTML = html;
    }
  }

  // FUNÇÃO: Processar todo o DOM
  function processAllEmojis() {
    // Stats do hub
    const statIcons = document.querySelectorAll('.stat-icon');
    statIcons.forEach(replaceEmojis);

    // Login heart
    const loginHeart = document.querySelector('.login-heart');
    if (loginHeart) replaceEmojis(loginHeart);

    // Profile avatars
    const avatars = document.querySelectorAll('.profile-avatar, .login-saved-avatar, #headerAvatar, #ppAvatarBig');
    avatars.forEach(replaceEmojis);

    // Splash heart (já é grid de divs, não mexer)

    // Botões com emojis
    const buttons = document.querySelectorAll('button, .rl-btn, .login-btn');
    buttons.forEach(replaceEmojis);

    // Headers com tags
    const tags = document.querySelectorAll('.nb-tag, .badge');
    tags.forEach(replaceEmojis);
  }

  // INICIALIZAÇÃO
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(processAllEmojis, 400);
      });
    } else {
      setTimeout(processAllEmojis, 400);
    }

    // Observar mudanças no DOM para novos emojis
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) { // Element node
              replaceEmojis(node);
              // Processar filhos também
              const children = node.querySelectorAll('*');
              children.forEach(replaceEmojis);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Expor globalmente para uso externo
  window.EmojiManager = {
    replaceEmojis: replaceEmojis,
    processAll: processAllEmojis
  };

  init();
})();

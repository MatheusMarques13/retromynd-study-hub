// =============================================================================
// EMOJI KILLER - RetroMynd Study Hub
// Substitui TODOS os emojis nativos por SVG pixel icons
// =============================================================================

(function() {
  'use strict';

  const SVG_ICONS = {
    fire: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 23C7.03 23 3 18.97 3 14c0-3.87 2.96-8.11 5.5-10.87.6-.65 1.65-.2 1.6.65-.16 2.7 1.15 4.22 2.53 4.22.63 0 1.2-.4 1.37-1 .7-2.4.2-5-1.1-7-.4-.6.2-1.35.88-1.05C17.27 1.3 21 5.85 21 11c0 6.63-4.03 12-9 12z" fill="var(--pink)"/><path d="M14.5 23c-2.49 0-4.5-2.24-4.5-5 0-1.83.82-3.45 2.04-4.68.38-.38 1.01-.14 1.07.38.12 1.03.74 1.8 1.39 1.8.37 0 .7-.3.76-.7.17-.97-.01-2.1-.49-2.94-.24-.42.14-.92.58-.72A5.5 5.5 0 0 1 19 16.5c0 3.59-2.01 6.5-4.5 6.5z" fill="#FFB74D"/></svg>`,
    
    notes: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="2" width="16" height="20" rx="2" fill="var(--blue)" opacity="0.15" stroke="var(--blue)" stroke-width="1.5"/><line x1="8" y1="7" x2="16" y2="7" stroke="var(--blue)" stroke-width="1.5" stroke-linecap="round"/><line x1="8" y1="11" x2="16" y2="11" stroke="var(--blue)" stroke-width="1.5" stroke-linecap="round"/><line x1="8" y1="15" x2="13" y2="15" stroke="var(--blue)" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    
    check: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="4" fill="var(--lavender)" opacity="0.2" stroke="var(--lavender)" stroke-width="1.5"/><path d="M7 12.5L10.5 16L17 8" stroke="var(--lavender)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    
    timer: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="13" r="9" fill="var(--mint)" opacity="0.15" stroke="var(--mint)" stroke-width="1.5"/><line x1="12" y1="9" x2="12" y2="13" stroke="var(--mint)" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="13" x2="15" y2="15" stroke="var(--mint)" stroke-width="2" stroke-linecap="round"/><line x1="10" y1="2" x2="14" y2="2" stroke="var(--mint)" stroke-width="2" stroke-linecap="round"/></svg>`,
    
    heart: `<svg width="20" height="20" viewBox="0 0 24 24" fill="var(--pink)" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,

    bolt: `<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--pink)" xmlns="http://www.w3.org/2000/svg"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,

    tomato: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="15" r="7" fill="#FF6B6B"/><path d="M12 8V5" stroke="#4CAF50" stroke-width="1.5" stroke-linecap="round"/><path d="M9 6Q8 4 9.5 3" stroke="#4CAF50" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M15 6Q16 4 14.5 3" stroke="#4CAF50" stroke-width="1.5" stroke-linecap="round" fill="none"/><circle cx="10" cy="12" r="1.5" fill="white" opacity="0.4"/></svg>`,

    crown: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 18h18l-3-9-4.5 3.5L12 5 8.5 12.5 4 9z" fill="#FFD54F" stroke="#FF8F00" stroke-width="1.5" stroke-linejoin="round"/><rect x="3" y="18" width="18" height="3" rx="1" fill="#FFD54F" stroke="#FF8F00" stroke-width="1.5"/></svg>`,

    owl: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="12" cy="14" rx="7" ry="8" fill="var(--lavender)" opacity="0.2" stroke="var(--lavender)" stroke-width="1.5"/><circle cx="9" cy="11" r="2.5" fill="white" stroke="var(--lavender)" stroke-width="1"/><circle cx="15" cy="11" r="2.5" fill="white" stroke="var(--lavender)" stroke-width="1"/><circle cx="9" cy="11.5" r="1.2" fill="#5B21B6"/><circle cx="15" cy="11.5" r="1.2" fill="#5B21B6"/><path d="M10 16 Q12 18 14 16" stroke="var(--lavender)" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M9 7L11 9M15 7L13 9" stroke="var(--lavender)" stroke-width="1.5" stroke-linecap="round"/></svg>`,

    sunrise: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 17h18" stroke="var(--pink)" stroke-width="1.5" stroke-linecap="round"/><path d="M5 17a7 7 0 0 1 14 0" stroke="#FFB74D" stroke-width="1.5" fill="none"/><circle cx="12" cy="10" r="2" fill="#FFB74D"/><line x1="12" y1="4" x2="12" y2="6" stroke="#FFB74D" stroke-width="1.5" stroke-linecap="round"/><line x1="6.22" y1="6.22" x2="7.64" y2="7.64" stroke="#FFB74D" stroke-width="1.5" stroke-linecap="round"/><line x1="17.78" y1="6.22" x2="16.36" y2="7.64" stroke="#FFB74D" stroke-width="1.5" stroke-linecap="round"/><line x1="4" y1="10" x2="6" y2="10" stroke="#FFB74D" stroke-width="1.5" stroke-linecap="round"/><line x1="18" y1="10" x2="20" y2="10" stroke="#FFB74D" stroke-width="1.5" stroke-linecap="round"/></svg>`,

    faceGreat:   `<svg width="22" height="22" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="18" fill="#FFF9C4" stroke="#FFD54F" stroke-width="1.5"/><circle cx="14" cy="16" r="2" fill="#5D4037"/><circle cx="26" cy="16" r="2" fill="#5D4037"/><path d="M13 24 Q20 30 27 24" stroke="#5D4037" stroke-width="2" stroke-linecap="round" fill="none"/><circle cx="15.5" cy="15" r="0.8" fill="white" opacity="0.8"/></svg>`,
    faceGood:    `<svg width="22" height="22" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="18" fill="#DCEDC8" stroke="#AED581" stroke-width="1.5"/><circle cx="14" cy="16" r="2" fill="#33691E"/><circle cx="26" cy="16" r="2" fill="#33691E"/><path d="M14 24 Q20 28 26 24" stroke="#33691E" stroke-width="2" stroke-linecap="round" fill="none"/></svg>`,
    faceNeutral: `<svg width="22" height="22" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="18" fill="#F5F5F5" stroke="#BDBDBD" stroke-width="1.5"/><circle cx="14" cy="16" r="2" fill="#424242"/><circle cx="26" cy="16" r="2" fill="#424242"/><line x1="13" y1="25" x2="27" y2="25" stroke="#424242" stroke-width="2" stroke-linecap="round"/></svg>`,
    faceBad:     `<svg width="22" height="22" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="18" fill="#BBDEFB" stroke="#90CAF9" stroke-width="1.5"/><path d="M12 15 Q14 13 16 15" stroke="#1565C0" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M24 15 Q26 13 28 15" stroke="#1565C0" stroke-width="1.5" stroke-linecap="round" fill="none"/><circle cx="14" cy="17" r="2" fill="#1565C0"/><circle cx="26" cy="17" r="2" fill="#1565C0"/><path d="M14 27 Q20 23 26 27" stroke="#1565C0" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M15 20 Q14 23 15 25" stroke="#90CAF9" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>`,
    faceTerrible:`<svg width="22" height="22" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="18" fill="#E8EAF6" stroke="#9FA8DA" stroke-width="1.5"/><path d="M12 14 Q14 12 16 14" stroke="#283593" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M24 14 Q26 12 28 14" stroke="#283593" stroke-width="1.5" stroke-linecap="round" fill="none"/><circle cx="14" cy="16" r="2" fill="#283593"/><circle cx="26" cy="16" r="2" fill="#283593"/><path d="M13 27 Q20 22 27 27" stroke="#283593" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M12 19 Q9 23 11 28" stroke="#9FA8DA" stroke-width="2" stroke-linecap="round" fill="none"/><path d="M28 19 Q31 23 29 28" stroke="#9FA8DA" stroke-width="2" stroke-linecap="round" fill="none"/></svg>`
  };

  // Mapeia emojis unicode para SVG
  const EMOJI_TO_SVG = {
    '🔥': SVG_ICONS.fire,
    '📝': SVG_ICONS.notes,
    '✅': SVG_ICONS.check,
    '⏱': SVG_ICONS.timer,
    '⏱️': SVG_ICONS.timer,
    '💕': SVG_ICONS.heart,
    '💖': SVG_ICONS.heart,
    '💗': SVG_ICONS.heart,
    '💝': SVG_ICONS.heart,
    '💞': SVG_ICONS.heart,
    '💓': SVG_ICONS.heart,
    '❤': SVG_ICONS.heart,
    '❤️': SVG_ICONS.heart,
    '♥': SVG_ICONS.heart,
    '💜': SVG_ICONS.heart,
    '🩷': SVG_ICONS.heart,
    '💙': SVG_ICONS.heart,
    '💚': SVG_ICONS.heart,
    '🧡': SVG_ICONS.heart,
    '💛': SVG_ICONS.heart,
    '🩶': SVG_ICONS.heart,
    '🖤': SVG_ICONS.heart,
    '🤍': SVG_ICONS.heart,
    '🤎': SVG_ICONS.heart,
    '❣️': SVG_ICONS.heart,
    '❣': SVG_ICONS.heart,
    '⚡': SVG_ICONS.bolt,
    '⚡️': SVG_ICONS.bolt,
    '⭐': `<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--pink)"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    '✨': `<svg width="14" height="14" viewBox="0 0 24 24" fill="var(--lavender)"><polygon points="12 2 14 10 22 12 14 14 12 22 10 14 2 12 10 10"/></svg>`,
    '🎮': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="4"/><circle cx="8" cy="12" r="1.5" fill="var(--blue)"/><circle cx="16" cy="12" r="1.5" fill="var(--pink)"/></svg>`,
    '📚': SVG_ICONS.notes,
    '🗒️': SVG_ICONS.notes,
    '🗒': SVG_ICONS.notes,
    '📋': SVG_ICONS.notes,
    '✏️': SVG_ICONS.notes,
    '✏': SVG_ICONS.notes,
    '🎯': SVG_ICONS.check,
    '🏆': `<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--pink)"><path d="M12 2L15 8H21L16.5 12L18 18L12 14.5L6 18L7.5 12L3 8H9L12 2Z"/></svg>`,
    '🎵': `<svg width="14" height="14" viewBox="0 0 24 24" fill="var(--pink)"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3" fill="var(--pink)"/><circle cx="18" cy="16" r="3" fill="var(--lavender)"/></svg>`,
    '💪': SVG_ICONS.bolt,
    '🚀': SVG_ICONS.bolt,
    '🌙': `<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--lavender)"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    '☀️': `<svg width="16" height="16" viewBox="0 0 24 24" fill="var(--pink)"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3" stroke="var(--pink)" stroke-width="2"/><line x1="12" y1="21" x2="12" y2="23" stroke="var(--pink)" stroke-width="2"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="var(--pink)" stroke-width="2"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="var(--pink)" stroke-width="2"/></svg>`,
    '🔒': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-mid)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    '👤': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-mid)" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    '📧': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-mid)" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg>`,
    '✔': SVG_ICONS.check,
    '✔️': SVG_ICONS.check,
    '✓': SVG_ICONS.check,
    '✗': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--pink)" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    '✕': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--pink)" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    '●': `<svg width="10" height="10" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="var(--blue)"/></svg>`,
    '⏰': SVG_ICONS.timer,
    '🕐': SVG_ICONS.timer,
    '🕑': SVG_ICONS.timer,
    '⏲️': SVG_ICONS.timer,
    '⏲': SVG_ICONS.timer,
    '🔗': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
    '🍅': SVG_ICONS.tomato,
    '👑': SVG_ICONS.crown,
    '🦉': SVG_ICONS.owl,
    '🌅': SVG_ICONS.sunrise,
    '😊': SVG_ICONS.faceGreat,
    '🙂': SVG_ICONS.faceGood,
    '😐': SVG_ICONS.faceNeutral,
    '😢': SVG_ICONS.faceBad,
    '😭': SVG_ICONS.faceTerrible,
  };

  // Build regex pattern from all emoji keys
  const emojiPattern = Object.keys(EMOJI_TO_SVG)
    .sort((a, b) => b.length - a.length) // longer first to avoid partial matches
    .map(e => e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  
  const emojiRegex = new RegExp(emojiPattern, 'g');

  function replaceEmojisInElement(el) {
    if (!el || el.nodeType !== 1) return;
    if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') return;
    if (el.classList && el.classList.contains('emoji-replaced')) return;
    if (el.id === 'pxHeart' || el.id === 'pxLogo') return;

    // Walk text nodes
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach(function(textNode) {
      const text = textNode.textContent;
      if (!emojiRegex.test(text)) return;
      emojiRegex.lastIndex = 0;

      const span = document.createElement('span');
      span.className = 'emoji-replaced';
      span.style.cssText = 'display:inline;vertical-align:middle;';
      span.innerHTML = text.replace(emojiRegex, function(match) {
        return '<span style="display:inline-flex;align-items:center;vertical-align:middle;line-height:1;">' + (EMOJI_TO_SVG[match] || match) + '</span>';
      });

      if (span.innerHTML !== text) {
        textNode.parentNode.replaceChild(span, textNode);
      }
    });
  }

  function processAll() {
    document.querySelectorAll('body *:not(script):not(style):not(.emoji-replaced)').forEach(function(el) {
      // Only process leaf-ish elements or elements with direct text
      if (el.childNodes.length > 0) {
        replaceEmojisInElement(el);
      }
    });
  }

  function init() {
    const run = function() {
      processAll();
      // Re-run after dynamic content loads
      setTimeout(processAll, 800);
      setTimeout(processAll, 2000);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run);
    } else {
      run();
    }

    // Observe DOM changes
    const observer = new MutationObserver(function(mutations) {
      let shouldProcess = false;
      mutations.forEach(function(m) {
        if (m.addedNodes.length > 0) shouldProcess = true;
      });
      if (shouldProcess) {
        setTimeout(processAll, 100);
      }
    });

    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      document.addEventListener('DOMContentLoaded', function() {
        observer.observe(document.body, { childList: true, subtree: true });
      });
    }
  }

  window.EmojiManager = { processAll: processAll, replaceEmojisInElement: replaceEmojisInElement };
  init();
})();

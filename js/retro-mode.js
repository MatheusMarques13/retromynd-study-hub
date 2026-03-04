(function(){
  'use strict';
  var RETRO_KEY = 'retromynd_retro';

  /* ===== INJECT RETRO CSS ===== */
  var css = document.createElement('style');
  css.id = 'retro-mode-css';
  css.textContent = '\n'

  /* ---------- ROOT VARIABLES ---------- */
  + 'body.retro-mode {'
  + '  --rbg:#0d1f3c; --rsurface:#0a1628; --rcard:#112244; --rborder:#1e3a6e;'
  + '  --rpixel:#e8f0ff; --rdim:#3a5a8a; --rpink:#e8477a; --rgold:#f5c518;'
  + '  --rblue:#1a72c7; --rsky:#7ec8f5; --rgreen:#2ecc71;'
  + '}'

  /* ---------- GLOBAL ---------- */
  + 'body.retro-mode {'
  + '  background: var(--rbg) !important;'
  + '  color: var(--rpixel) !important;'
  + '  font-family: Inter, sans-serif !important;'
  + '}'
  /* Scanline overlay */
  + 'body.retro-mode::after {'
  + '  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 99999;'
  + '  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.06) 2px, rgba(0,0,0,.06) 4px);'
  + '}'
  /* Selection */
  + 'body.retro-mode ::selection { background: var(--rgold); color: #000; }'
  + 'body.retro-mode ::-moz-selection { background: var(--rgold); color: #000; }'
  /* Scrollbar */
  + 'body.retro-mode ::-webkit-scrollbar { width: 6px; height: 6px; }'
  + 'body.retro-mode ::-webkit-scrollbar-track { background: var(--rsurface); }'
  + 'body.retro-mode ::-webkit-scrollbar-thumb { background: var(--rborder); }'
  + 'body.retro-mode ::-webkit-scrollbar-thumb:hover { background: var(--rgold); }'

  /* ---------- ALL CARDS / CONTAINERS ---------- */
  + 'body.retro-mode .card,'
  + 'body.retro-mode .hub-card,'
  + 'body.retro-mode .stat-card,'
  + 'body.retro-mode .timer-card,'
  + 'body.retro-mode .goals-card,'
  + 'body.retro-mode .notes-card,'
  + 'body.retro-mode .pomodoro-card,'
  + 'body.retro-mode .metas-card,'
  + 'body.retro-mode .notebook-card,'
  + 'body.retro-mode [class*="card"],'
  + 'body.retro-mode [class*="Card"],'
  + 'body.retro-mode [class*="container"]:not(#rmLoginOverlay):not(#rmLoginOverlay *),'
  + 'body.retro-mode [class*="panel"]:not(#rmProfilePanel),'
  + 'body.retro-mode [class*="widget"],'
  + 'body.retro-mode [class*="section"]:not(#rmProfilePanel *),'
  + 'body.retro-mode [class*="box"]:not(input):not(select) {'
  + '  background: var(--rcard) !important;'
  + '  border-color: var(--rborder) !important;'
  + '  border-radius: 0 !important;'
  + '  color: var(--rpixel) !important;'
  + '  box-shadow: 4px 4px 0 rgba(0,0,0,.4) !important;'
  + '}'

  /* Card borders - make sure they have borders */
  + 'body.retro-mode [class*="card"],'
  + 'body.retro-mode [class*="Card"] {'
  + '  border: 2px solid var(--rborder) !important;'
  + '}'

  /* ---------- HEADER / NAV ---------- */
  + 'body.retro-mode header,'
  + 'body.retro-mode [class*="header"]:not(#rmProfilePanel *):not(#rmProfileBar),'
  + 'body.retro-mode [class*="Header"],'
  + 'body.retro-mode nav,'
  + 'body.retro-mode [class*="nav"],'
  + 'body.retro-mode [class*="Nav"],'
  + 'body.retro-mode [class*="toolbar"],'
  + 'body.retro-mode [class*="topbar"] {'
  + '  background: var(--rsurface) !important;'
  + '  border-color: var(--rborder) !important;'
  + '  color: var(--rpixel) !important;'
  + '}'

  /* ---------- PAGE BACKGROUND AREAS ---------- */
  + 'body.retro-mode main,'
  + 'body.retro-mode [class*="main"],'
  + 'body.retro-mode [class*="content"],'
  + 'body.retro-mode [class*="wrapper"],'
  + 'body.retro-mode [class*="Wrapper"],'
  + 'body.retro-mode [class*="layout"],'
  + 'body.retro-mode [class*="page"],'
  + 'body.retro-mode [class*="grid"],'
  + 'body.retro-mode [class*="body"] {'
  + '  background: transparent !important;'
  + '  color: var(--rpixel) !important;'
  + '}'

  /* ---------- HEADINGS & TITLES ---------- */
  + 'body.retro-mode h1, body.retro-mode h2, body.retro-mode h3,'
  + 'body.retro-mode h4, body.retro-mode h5, body.retro-mode h6 {'
  + '  font-family: VT323, monospace !important;'
  + '  color: var(--rgold) !important;'
  + '  text-shadow: 0 0 20px rgba(245,197,24,.4), 4px 4px 0 rgba(245,197,24,.15) !important;'
  + '  letter-spacing: .04em !important;'
  + '}'

  /* Title with flicker */
  + 'body.retro-mode h1 {'
  + '  animation: rmFlicker 5s infinite !important;'
  + '}'
  + '@keyframes rmFlicker { 0%,95%,100%{opacity:1} 96%{opacity:.7} 97%{opacity:1} 98%{opacity:.4} 99%{opacity:1} }'

  /* ---------- BODY TEXT ---------- */
  + 'body.retro-mode p, body.retro-mode span, body.retro-mode div, body.retro-mode li,'
  + 'body.retro-mode td, body.retro-mode th, body.retro-mode label,'
  + 'body.retro-mode [class*="text"], body.retro-mode [class*="label"],'
  + 'body.retro-mode [class*="desc"], body.retro-mode [class*="sub"],'
  + 'body.retro-mode [class*="meta"], body.retro-mode [class*="info"] {'
  + '  color: var(--rpixel) !important;'
  + '}'

  /* Dim / secondary text */
  + 'body.retro-mode [class*="dim"], body.retro-mode [class*="muted"],'
  + 'body.retro-mode [class*="secondary"], body.retro-mode [class*="light"],'
  + 'body.retro-mode [class*="gray"], body.retro-mode [class*="grey"],'
  + 'body.retro-mode [class*="placeholder"], body.retro-mode small,'
  + 'body.retro-mode [class*="hint"], body.retro-mode [class*="caption"] {'
  + '  color: var(--rdim) !important;'
  + '}'

  /* ---------- STAT NUMBERS ---------- */
  + 'body.retro-mode [class*="stat"] [class*="val"],'
  + 'body.retro-mode [class*="stat"] [class*="num"],'
  + 'body.retro-mode [class*="stat"] [class*="count"],'
  + 'body.retro-mode [class*="streak"],'
  + 'body.retro-mode [class*="score"] {'
  + '  font-family: VT323, monospace !important;'
  + '  color: var(--rgold) !important;'
  + '  text-shadow: 0 0 8px rgba(245,197,24,.5) !important;'
  + '  font-size: 2rem !important;'
  + '}'

  /* Stat labels */
  + 'body.retro-mode [class*="stat"] [class*="label"],'
  + 'body.retro-mode [class*="stat"] [class*="title"],'
  + 'body.retro-mode [class*="stat"] small {'
  + '  font-family: "Space Mono", monospace !important;'
  + '  color: var(--rdim) !important;'
  + '  font-size: .6rem !important;'
  + '  letter-spacing: .15em !important;'
  + '  text-transform: uppercase !important;'
  + '}'

  /* ---------- BIG NUMBERS (timer, counters) ---------- */
  + 'body.retro-mode [class*="timer"] [class*="display"],'
  + 'body.retro-mode [class*="timer"] [class*="time"],'
  + 'body.retro-mode [class*="clock"],'
  + 'body.retro-mode [class*="countdown"],'
  + 'body.retro-mode [class*="pomodoro"] [class*="display"],'
  + 'body.retro-mode [class*="digit"] {'
  + '  font-family: VT323, monospace !important;'
  + '  color: var(--rgold) !important;'
  + '  text-shadow: 0 0 30px rgba(245,197,24,.6), 0 0 60px rgba(245,197,24,.2) !important;'
  + '}'

  /* ---------- BUTTONS ---------- */
  + 'body.retro-mode button:not(.rm-tb):not(.rm-bt):not(.pb-btn):not(.pp-save):not(.pp-logout):not(.pp-close):not(#rmLoginOverlay button),'
  + 'body.retro-mode [class*="btn"]:not(.rm-tb):not(.rm-bt):not(.pb-btn):not(.pp-save):not(.pp-logout):not(#rmLoginOverlay *),'
  + 'body.retro-mode [class*="Btn"]:not(#rmLoginOverlay *),'
  + 'body.retro-mode [type="button"]:not(#rmLoginOverlay *),'
  + 'body.retro-mode [type="submit"]:not(#rmLoginOverlay *) {'
  + '  font-family: "Space Mono", monospace !important;'
  + '  background: transparent !important;'
  + '  border: 2px solid var(--rborder) !important;'
  + '  color: var(--rpixel) !important;'
  + '  border-radius: 0 !important;'
  + '  cursor: pointer !important;'
  + '  transition: all .15s !important;'
  + '  text-transform: uppercase !important;'
  + '  letter-spacing: .06em !important;'
  + '  font-weight: 700 !important;'
  + '  font-size: .65rem !important;'
  + '}'
  + 'body.retro-mode button:not(#rmLoginOverlay button):hover,'
  + 'body.retro-mode [class*="btn"]:not(#rmLoginOverlay *):hover {'
  + '  border-color: var(--rgold) !important;'
  + '  color: var(--rgold) !important;'
  + '  box-shadow: 0 0 8px rgba(245,197,24,.3), 2px 2px 0 var(--rgold) !important;'
  + '}'

  /* Active/selected buttons */
  + 'body.retro-mode button.active:not(#rmLoginOverlay button),'
  + 'body.retro-mode [class*="btn"].active:not(#rmLoginOverlay *),'
  + 'body.retro-mode button[class*="active"]:not(#rmLoginOverlay button),'
  + 'body.retro-mode [class*="selected"],'
  + 'body.retro-mode [aria-selected="true"] {'
  + '  background: var(--rgold) !important;'
  + '  color: #000 !important;'
  + '  border-color: var(--rgold) !important;'
  + '  box-shadow: 0 0 12px var(--rgold) !important;'
  + '}'

  /* Primary action buttons (Start, Add, etc) */
  + 'body.retro-mode [class*="primary"]:not(#rmLoginOverlay *),'
  + 'body.retro-mode [class*="start"]:not(#rmLoginOverlay *),'
  + 'body.retro-mode [class*="add"]:not(#rmLoginOverlay *),'
  + 'body.retro-mode [class*="submit"]:not(#rmLoginOverlay *) {'
  + '  background: var(--rgold) !important;'
  + '  color: #000 !important;'
  + '  border-color: var(--rgold) !important;'
  + '}'

  /* Danger/reset buttons */
  + 'body.retro-mode [class*="danger"]:not(#rmLoginOverlay *),'
  + 'body.retro-mode [class*="reset"]:not(#rmLoginOverlay *),'
  + 'body.retro-mode [class*="delete"]:not(#rmLoginOverlay *),'
  + 'body.retro-mode [class*="remove"]:not(#rmLoginOverlay *) {'
  + '  border-color: var(--rpink) !important;'
  + '  color: var(--rpink) !important;'
  + '}'
  + 'body.retro-mode [class*="danger"]:hover,'
  + 'body.retro-mode [class*="reset"]:hover {'
  + '  box-shadow: 0 0 8px rgba(232,71,122,.4), 2px 2px 0 var(--rpink) !important;'
  + '}'

  /* ---------- INPUTS ---------- */
  + 'body.retro-mode input:not(.rm-f):not(.pp-input):not(#rmLoginOverlay input),'
  + 'body.retro-mode textarea:not(#rmLoginOverlay textarea),'
  + 'body.retro-mode select:not(#rmLoginOverlay select) {'
  + '  background: var(--rsurface) !important;'
  + '  border: 2px solid var(--rborder) !important;'
  + '  color: var(--rpixel) !important;'
  + '  font-family: "Space Mono", monospace !important;'
  + '  border-radius: 0 !important;'
  + '  outline: none !important;'
  + '  caret-color: var(--rgold) !important;'
  + '}'
  + 'body.retro-mode input:not(#rmLoginOverlay input):focus,'
  + 'body.retro-mode textarea:not(#rmLoginOverlay textarea):focus {'
  + '  border-color: var(--rgold) !important;'
  + '  box-shadow: 0 0 8px rgba(245,197,24,.2) !important;'
  + '}'
  + 'body.retro-mode input::placeholder,'
  + 'body.retro-mode textarea::placeholder {'
  + '  color: var(--rdim) !important;'
  + '}'

  /* ---------- CHECKBOXES ---------- */
  + 'body.retro-mode input[type="checkbox"] {'
  + '  appearance: none !important; -webkit-appearance: none !important;'
  + '  width: 18px !important; height: 18px !important;'
  + '  border: 2px solid var(--rborder) !important;'
  + '  background: var(--rsurface) !important;'
  + '  border-radius: 0 !important; cursor: pointer !important;'
  + '  position: relative !important;'
  + '}'
  + 'body.retro-mode input[type="checkbox"]:checked {'
  + '  background: var(--rgold) !important;'
  + '  border-color: var(--rgold) !important;'
  + '  box-shadow: 0 0 8px var(--rgold) !important;'
  + '}'
  + 'body.retro-mode input[type="checkbox"]:checked::after {'
  + '  content: "\u2713"; position: absolute; top: -2px; left: 2px;'
  + '  color: #000; font-weight: 900; font-size: 14px;'
  + '}'

  /* ---------- TAGS / BADGES ---------- */
  + 'body.retro-mode [class*="tag"],'
  + 'body.retro-mode [class*="Tag"],'
  + 'body.retro-mode [class*="badge"],'
  + 'body.retro-mode [class*="Badge"],'
  + 'body.retro-mode [class*="chip"],'
  + 'body.retro-mode [class*="label"]:not(label) {'
  + '  background: transparent !important;'
  + '  border: 1.5px solid var(--rpink) !important;'
  + '  color: var(--rpink) !important;'
  + '  border-radius: 0 !important;'
  + '  font-family: "Space Mono", monospace !important;'
  + '  font-size: .6rem !important;'
  + '  font-weight: 700 !important;'
  + '}'

  /* ---------- TABS ---------- */
  + 'body.retro-mode [class*="tab"]:not(.rm-tb):not(#rmLoginOverlay *),'
  + 'body.retro-mode [class*="Tab"]:not(#rmLoginOverlay *),'
  + 'body.retro-mode [role="tab"] {'
  + '  font-family: "Space Mono", monospace !important;'
  + '  background: transparent !important;'
  + '  color: var(--rdim) !important;'
  + '  border-color: var(--rborder) !important;'
  + '  border-radius: 0 !important;'
  + '  letter-spacing: .08em !important;'
  + '  font-weight: 700 !important;'
  + '}'
  + 'body.retro-mode [class*="tab"].active:not(.rm-tb),'
  + 'body.retro-mode [class*="Tab"].active,'
  + 'body.retro-mode [role="tab"][aria-selected="true"],'
  + 'body.retro-mode [class*="tab"][class*="active"]:not(.rm-tb) {'
  + '  background: var(--rpink) !important;'
  + '  color: #fff !important;'
  + '  border-color: var(--rpink) !important;'
  + '}'

  /* ---------- PROGRESS BARS ---------- */
  + 'body.retro-mode [class*="progress"],'
  + 'body.retro-mode progress {'
  + '  background: var(--rsurface) !important;'
  + '  border: 2px solid var(--rborder) !important;'
  + '  border-radius: 0 !important;'
  + '  overflow: hidden !important;'
  + '}'
  + 'body.retro-mode [class*="progress"] [class*="fill"],'
  + 'body.retro-mode [class*="progress"] [class*="bar"],'
  + 'body.retro-mode [class*="progress"] > div {'
  + '  background: var(--rgold) !important;'
  + '  box-shadow: 0 0 8px var(--rgold) !important;'
  + '  border-radius: 0 !important;'
  + '}'

  /* ---------- RULED LINES / NOTEBOOK PAPER → REMOVE ---------- */
  + 'body.retro-mode [class*="ruled"],'
  + 'body.retro-mode [class*="paper"],'
  + 'body.retro-mode [class*="notebook"],'
  + 'body.retro-mode [class*="lined"] {'
  + '  background-image: none !important;'
  + '  background: var(--rcard) !important;'
  + '}'

  /* Remove any ::before/::after that creates ruled lines */
  + 'body.retro-mode [class*="card"]::before,'
  + 'body.retro-mode [class*="card"]::after,'
  + 'body.retro-mode [class*="paper"]::before,'
  + 'body.retro-mode [class*="paper"]::after,'
  + 'body.retro-mode [class*="note"]::before,'
  + 'body.retro-mode [class*="note"]::after {'
  + '  background: none !important;'
  + '  background-image: none !important;'
  + '  border: none !important;'
  + '}'

  /* ---------- LINKS ---------- */
  + 'body.retro-mode a:not(#rmLoginOverlay a) {'
  + '  color: var(--rsky) !important;'
  + '}'
  + 'body.retro-mode a:hover {'
  + '  color: var(--rgold) !important;'
  + '  text-shadow: 0 0 8px rgba(245,197,24,.3) !important;'
  + '}'

  /* ---------- HR / DIVIDERS ---------- */
  + 'body.retro-mode hr, body.retro-mode [class*="divider"],'
  + 'body.retro-mode [class*="separator"] {'
  + '  border-color: var(--rborder) !important;'
  + '  background: var(--rborder) !important;'
  + '}'

  /* ---------- TOOLTIPS / POPUPS ---------- */
  + 'body.retro-mode [class*="tooltip"],'
  + 'body.retro-mode [class*="popup"],'
  + 'body.retro-mode [class*="modal"]:not(#rmLoginOverlay),'
  + 'body.retro-mode [class*="dropdown"] {'
  + '  background: var(--rsurface) !important;'
  + '  border: 2px solid var(--rborder) !important;'
  + '  color: var(--rpixel) !important;'
  + '  border-radius: 0 !important;'
  + '}'

  /* ---------- EMOJIS: preserve them ---------- */
  + 'body.retro-mode [class*="emoji"], body.retro-mode [class*="icon"] {'
  + '  filter: none !important;'
  + '}'

  /* ---------- IMAGES ---------- */
  + 'body.retro-mode img:not([class*="avatar"]):not([class*="emoji"]) {'
  + '  filter: brightness(.85) contrast(1.1) !important;'
  + '  border: 2px solid var(--rborder) !important;'
  + '  border-radius: 0 !important;'
  + '}'

  /* ---------- RETRO TOGGLE BUTTON ---------- */
  + '.retro-toggle {'
  + '  font-family: VT323, monospace !important;'
  + '  font-size: .7rem; padding: 2px 8px;'
  + '  border: 1.5px solid var(--rpink, #e8477a);'
  + '  color: var(--rpink, #e8477a);'
  + '  background: transparent; cursor: pointer;'
  + '  letter-spacing: .08em; font-weight: 700;'
  + '  transition: all .2s; border-radius: 2px; margin-left: 4px;'
  + '}'
  + '.retro-toggle:hover, .retro-toggle.on {'
  + '  background: var(--rpink, #e8477a); color: #fff;'
  + '  box-shadow: 0 0 10px rgba(232,71,122,.4);'
  + '}'
  + 'body.retro-mode .retro-toggle {'
  + '  border-color: var(--rgold); color: var(--rgold);'
  + '}'
  + 'body.retro-mode .retro-toggle:hover,'
  + 'body.retro-mode .retro-toggle.on {'
  + '  background: var(--rgold); color: #000;'
  + '  box-shadow: 0 0 12px rgba(245,197,24,.5);'
  + '}'

  /* ---------- CURSOR BLINK on focused inputs ---------- */
  + 'body.retro-mode input:focus, body.retro-mode textarea:focus {'
  + '  animation: rmCursorGlow 1.5s ease infinite !important;'
  + '}'
  + '@keyframes rmCursorGlow {'
  + '  0%,100% { box-shadow: 0 0 4px rgba(245,197,24,.2); }'
  + '  50% { box-shadow: 0 0 12px rgba(245,197,24,.4); }'
  + '}'

  /* ---------- SMOOTH TRANSITION ---------- */
  + 'body { transition: background .5s ease, color .5s ease; }'
  + '[class*="card"], [class*="Card"], header, nav, main,'
  + 'button, input, textarea, select, [class*="tab"] {'
  + '  transition: background .3s, color .3s, border-color .3s, box-shadow .3s;'
  + '}'

  + '';
  document.head.appendChild(css);

  /* ===== TOGGLE LOGIC ===== */
  function isRetro() { return document.body.classList.contains('retro-mode'); }

  window.toggleRetroMode = function(force) {
    var on = (typeof force === 'boolean') ? force : !isRetro();
    document.body.classList.toggle('retro-mode', on);
    localStorage.setItem(RETRO_KEY, on ? '1' : '0');

    /* Update toggle buttons */
    document.querySelectorAll('.retro-toggle').forEach(function(btn) {
      btn.classList.toggle('on', on);
      btn.textContent = on ? 'COMFY' : 'RETRO';
    });

    /* Try to hook existing theme buttons */
    hookThemeButtons();
  };

  /* ===== HOOK EXISTING THEME TOGGLE (sun/monitor/moon icons) ===== */
  function hookThemeButtons() {
    /* Look for theme toggle buttons with moon/dark icons */
    var allBtns = document.querySelectorAll('button, [role="button"], [class*="theme"], [class*="toggle"], [class*="mode"]');
    allBtns.forEach(function(btn) {
      if (btn.classList.contains('retro-toggle')) return;
      if (btn.id && btn.id.startsWith('rm')) return;
      var txt = (btn.textContent || '').trim();
      var title = (btn.getAttribute('title') || '').toLowerCase();
      var ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
      /* Check if it's a dark/night mode button */
      if (txt === '\uD83C\uDF19' || txt === '\uD83C\uDF1A' || title.includes('dark') || title.includes('retro')
          || ariaLabel.includes('dark') || ariaLabel.includes('night')) {
        if (!btn._retroHooked) {
          btn._retroHooked = true;
          var origClick = btn.onclick;
          btn.onclick = function(e) {
            window.toggleRetroMode(true);
            if (origClick) origClick.call(btn, e);
          };
        }
      }
      /* Check if it's a light/comfy mode button */
      if (txt === '\u2600\uFE0F' || txt === '\u2600' || title.includes('light') || title.includes('comfy')
          || ariaLabel.includes('light')) {
        if (!btn._retroHooked) {
          btn._retroHooked = true;
          var origClick2 = btn.onclick;
          btn.onclick = function(e) {
            window.toggleRetroMode(false);
            if (origClick2) origClick2.call(btn, e);
          };
        }
      }
    });
  }

  /* ===== INJECT RETRO TOGGLE INTO PROFILE BAR ===== */
  function injectToggleButton() {
    var bar = document.getElementById('rmProfileBar');
    if (!bar || bar.querySelector('.retro-toggle')) return;
    var btn = document.createElement('button');
    btn.className = 'retro-toggle' + (isRetro() ? ' on' : '');
    btn.textContent = isRetro() ? 'COMFY' : 'RETRO';
    btn.onclick = function() { window.toggleRetroMode(); };
    /* Insert before the SAIR button */
    var sairBtn = bar.querySelector('.pb-logout');
    if (sairBtn) bar.insertBefore(btn, sairBtn);
    else bar.appendChild(btn);
  }

  /* ===== BOOT ===== */
  function retroBoot() {
    /* Apply saved preference */
    if (localStorage.getItem(RETRO_KEY) === '1') {
      document.body.classList.add('retro-mode');
    }
    /* Inject toggle button */
    injectToggleButton();
    hookThemeButtons();

    /* Watch for profile bar being injected (by api.js) */
    var observer = new MutationObserver(function() {
      injectToggleButton();
      hookThemeButtons();
    });
    observer.observe(document.body, { childList: true, subtree: false });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(retroBoot, 300); });
  } else {
    setTimeout(retroBoot, 300);
  }
})();

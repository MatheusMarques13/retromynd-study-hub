(function(){
  'use strict';
  var RETRO_KEY = 'retromynd_retro';

  var css = document.createElement('style');
  css.id = 'retro-mode-css';
  css.textContent = '\n'

  /* ===== ROOT ===== */
  + 'body.retro-mode { --rbg:#0d1f3c; --rsurface:#0a1628; --rcard:#112244; --rborder:#1e3a6e;'
  + '  --rpixel:#e8f0ff; --rdim:#7a8faa; --rpink:#e8477a; --rgold:#f5c518;'
  + '  --rblue:#1a72c7; --rsky:#7ec8f5; --rgreen:#2ecc71; }'

  /* ===== GLOBAL ===== */
  + 'body.retro-mode { background:var(--rbg)!important; color:var(--rpixel)!important; }'
  /* Scanline */
  + 'body.retro-mode::after { content:"";position:fixed;inset:0;pointer-events:none;z-index:99999;'
  + '  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.04) 2px,rgba(0,0,0,.04) 4px); }'
  /* Selection */
  + 'body.retro-mode ::selection { background:var(--rgold);color:#000; }'
  /* Scrollbar */
  + 'body.retro-mode ::-webkit-scrollbar{width:6px;height:6px}'
  + 'body.retro-mode ::-webkit-scrollbar-track{background:var(--rsurface)}'
  + 'body.retro-mode ::-webkit-scrollbar-thumb{background:var(--rborder)}'
  + 'body.retro-mode ::-webkit-scrollbar-thumb:hover{background:var(--rgold)}'

  /* ===== CARDS ===== */
  + 'body.retro-mode [class*="card"],'
  + 'body.retro-mode [class*="Card"],'
  + 'body.retro-mode [class*="widget"],'
  + 'body.retro-mode [class*="panel"]:not(#rmProfilePanel),'
  + 'body.retro-mode [class*="box"]:not(input):not(select) {'
  + '  background:var(--rcard)!important; border:2px solid var(--rborder)!important;'
  + '  border-radius:0!important; box-shadow:4px 4px 0 rgba(0,0,0,.4)!important; color:var(--rpixel)!important; }'

  /* ===== HEADER / NAV ===== */
  + 'body.retro-mode header,'
  + 'body.retro-mode [class*="header"]:not(#rmProfilePanel *):not(#rmProfileBar *),'
  + 'body.retro-mode nav, body.retro-mode [class*="nav"]:not(#rmProfilePanel *),'
  + 'body.retro-mode [class*="toolbar"], body.retro-mode [class*="topbar"] {'
  + '  background:var(--rsurface)!important; border-color:var(--rborder)!important; color:var(--rpixel)!important; }'

  /* ===== BACKGROUNDS ===== */
  + 'body.retro-mode main, body.retro-mode [class*="main"],'
  + 'body.retro-mode [class*="content"], body.retro-mode [class*="wrapper"],'
  + 'body.retro-mode [class*="layout"], body.retro-mode [class*="page"],'
  + 'body.retro-mode [class*="grid"], body.retro-mode [class*="body"],'
  + 'body.retro-mode [class*="container"]:not(#rmLoginOverlay):not(#rmLoginOverlay *),'
  + 'body.retro-mode [class*="section"]:not(#rmProfilePanel *) {'
  + '  background:transparent!important; color:var(--rpixel)!important; }'

  /* ===== HEADINGS ===== */
  + 'body.retro-mode h1:not(#rmLoginOverlay h1),'
  + 'body.retro-mode h2:not(#rmLoginOverlay *),'
  + 'body.retro-mode h3, body.retro-mode h4, body.retro-mode h5 {'
  + '  font-family:VT323,monospace!important; color:var(--rgold)!important;'
  + '  text-shadow:0 0 20px rgba(245,197,24,.4),4px 4px 0 rgba(245,197,24,.15)!important;'
  + '  letter-spacing:.04em!important; }'
  + 'body.retro-mode h1:not(#rmLoginOverlay h1) { animation:rmFlicker 5s infinite!important; }'
  + '@keyframes rmFlicker{0%,95%,100%{opacity:1}96%{opacity:.7}97%{opacity:1}98%{opacity:.4}99%{opacity:1}}'

  /* ===== ALL TEXT - ensure readable ===== */
  + 'body.retro-mode p, body.retro-mode li, body.retro-mode td,'
  + 'body.retro-mode th, body.retro-mode label,'
  + 'body.retro-mode [class*="desc"], body.retro-mode [class*="sub"],'
  + 'body.retro-mode [class*="info"]:not(#rmProfileBar *) { color:var(--rpixel)!important; }'

  /* Span and div - only override inside cards/main content, not profile bar */
  + 'body.retro-mode [class*="card"] span,'
  + 'body.retro-mode [class*="card"] div,'
  + 'body.retro-mode main span, body.retro-mode main div,'
  + 'body.retro-mode [class*="content"] span,'
  + 'body.retro-mode [class*="content"] div { color:var(--rpixel)!important; }'

  /* Dim text - BRIGHTER than before for readability */
  + 'body.retro-mode [class*="muted"], body.retro-mode [class*="secondary"],'
  + 'body.retro-mode [class*="gray"], body.retro-mode [class*="grey"],'
  + 'body.retro-mode [class*="hint"], body.retro-mode [class*="caption"],'
  + 'body.retro-mode small, body.retro-mode [class*="placeholder"],'
  + 'body.retro-mode [class*="empty"], body.retro-mode [class*="no-"] { color:var(--rdim)!important; }'

  /* ===== STAT NUMBERS ===== */
  + 'body.retro-mode [class*="stat"] [class*="val"],'
  + 'body.retro-mode [class*="stat"] [class*="num"],'
  + 'body.retro-mode [class*="stat"] [class*="count"],'
  + 'body.retro-mode [class*="streak"], body.retro-mode [class*="score"] {'
  + '  font-family:VT323,monospace!important; color:var(--rgold)!important;'
  + '  text-shadow:0 0 8px rgba(245,197,24,.5)!important; font-size:2rem!important; }'

  /* Stat labels */
  + 'body.retro-mode [class*="stat"] [class*="label"],'
  + 'body.retro-mode [class*="stat"] [class*="title"],'
  + 'body.retro-mode [class*="stat"] small { font-family:"Space Mono",monospace!important;'
  + '  color:var(--rdim)!important; font-size:.6rem!important; letter-spacing:.15em!important; text-transform:uppercase!important; }'

  /* ===== TIMER DISPLAY ===== */
  + 'body.retro-mode [class*="timer"] [class*="display"],'
  + 'body.retro-mode [class*="timer"] [class*="time"],'
  + 'body.retro-mode [class*="clock"], body.retro-mode [class*="countdown"],'
  + 'body.retro-mode [class*="digit"] { font-family:VT323,monospace!important;'
  + '  color:var(--rgold)!important; text-shadow:0 0 30px rgba(245,197,24,.6),0 0 60px rgba(245,197,24,.2)!important; }'

  /* ===== BUTTONS - LEGIBLE ===== */
  + 'body.retro-mode button:not(#rmLoginOverlay button):not(.rm-tb):not(.rm-bt):not(.pb-btn):not(.pb-logout)'
  + ':not(.pp-save):not(.pp-logout):not(.pp-close):not(.retro-toggle),'
  + 'body.retro-mode [type="button"]:not(#rmLoginOverlay *),'
  + 'body.retro-mode [type="submit"]:not(#rmLoginOverlay *) {'
  + '  font-family:"Space Mono",monospace!important; background:var(--rsurface)!important;'
  + '  border:2px solid var(--rborder)!important; color:var(--rpixel)!important;'
  + '  border-radius:0!important; cursor:pointer!important; font-weight:700!important;'
  + '  font-size:.7rem!important; letter-spacing:.06em!important; padding:6px 12px!important; }'

  + 'body.retro-mode button:not(#rmLoginOverlay button):not(.rm-tb):not(.rm-bt):not(.pb-btn)'
  + ':not(.pb-logout):not(.pp-save):not(.pp-logout):not(.pp-close):not(.retro-toggle):hover {'
  + '  border-color:var(--rgold)!important; color:var(--rgold)!important;'
  + '  box-shadow:0 0 8px rgba(245,197,24,.3),2px 2px 0 var(--rgold)!important; }'

  /* Active/selected buttons */
  + 'body.retro-mode button.active:not(#rmLoginOverlay button):not(.rm-tb):not(.pb-btn),'
  + 'body.retro-mode [class*="selected"]:not(#rmLoginOverlay *),'
  + 'body.retro-mode [aria-selected="true"]:not(#rmLoginOverlay *) {'
  + '  background:var(--rgold)!important; color:#000!important; border-color:var(--rgold)!important;'
  + '  box-shadow:0 0 12px var(--rgold)!important; }'

  /* Danger/reset buttons - visible pink */
  + 'body.retro-mode [class*="danger"], body.retro-mode [class*="reset"],'
  + 'body.retro-mode [class*="delete"], body.retro-mode [class*="remove"] {'
  + '  border-color:var(--rpink)!important; color:var(--rpink)!important; }'

  /* ===== INPUTS - LEGIBLE ===== */
  + 'body.retro-mode input:not(.rm-f):not(.pp-input):not(#rmLoginOverlay input),'
  + 'body.retro-mode textarea:not(#rmLoginOverlay textarea),'
  + 'body.retro-mode select:not(#rmLoginOverlay select) {'
  + '  background:var(--rsurface)!important; border:2px solid var(--rborder)!important;'
  + '  color:var(--rpixel)!important; font-family:"Space Mono",monospace!important;'
  + '  border-radius:0!important; caret-color:var(--rgold)!important; font-size:.8rem!important; }'
  + 'body.retro-mode input:not(#rmLoginOverlay input):focus,'
  + 'body.retro-mode textarea:not(#rmLoginOverlay textarea):focus {'
  + '  border-color:var(--rgold)!important; box-shadow:0 0 8px rgba(245,197,24,.2)!important; }'
  + 'body.retro-mode input::placeholder, body.retro-mode textarea::placeholder { color:var(--rdim)!important; }'

  /* ===== CHECKBOXES ===== */
  + 'body.retro-mode input[type="checkbox"] { appearance:none!important;-webkit-appearance:none!important;'
  + '  width:18px!important;height:18px!important; border:2px solid var(--rborder)!important;'
  + '  background:var(--rsurface)!important; border-radius:0!important; cursor:pointer!important; position:relative!important; }'
  + 'body.retro-mode input[type="checkbox"]:checked { background:var(--rgold)!important;'
  + '  border-color:var(--rgold)!important; box-shadow:0 0 8px var(--rgold)!important; }'
  + 'body.retro-mode input[type="checkbox"]:checked::after { content:"\u2713";position:absolute;top:-2px;left:2px;color:#000;font-weight:900;font-size:14px; }'

  /* ===== TAGS/BADGES - VISIBLE ===== */
  + 'body.retro-mode [class*="tag"]:not(#rmLoginOverlay *),'
  + 'body.retro-mode [class*="badge"]:not(#rmLoginOverlay *),'
  + 'body.retro-mode [class*="chip"]:not(#rmLoginOverlay *) {'
  + '  background:transparent!important; border:1.5px solid var(--rpink)!important;'
  + '  color:var(--rpink)!important; border-radius:0!important; font-family:"Space Mono",monospace!important;'
  + '  font-size:.62rem!important; font-weight:700!important; }'

  /* ===== TABS - LEGIBLE ===== */
  + 'body.retro-mode [class*="tab"]:not(.rm-tb):not(#rmLoginOverlay *),'
  + 'body.retro-mode [role="tab"] {'
  + '  font-family:"Space Mono",monospace!important; background:var(--rsurface)!important;'
  + '  color:var(--rpixel)!important; border:2px solid var(--rborder)!important;'
  + '  border-radius:0!important; font-weight:700!important; font-size:.65rem!important;'
  + '  letter-spacing:.08em!important; padding:5px 10px!important; }'

  + 'body.retro-mode [class*="tab"].active:not(.rm-tb),'
  + 'body.retro-mode [class*="tab"][class*="active"]:not(.rm-tb),'
  + 'body.retro-mode [role="tab"][aria-selected="true"] {'
  + '  background:var(--rpink)!important; color:#fff!important; border-color:var(--rpink)!important; }'

  /* ===== PROGRESS BARS ===== */
  + 'body.retro-mode [class*="progress"], body.retro-mode progress {'
  + '  background:var(--rsurface)!important; border:2px solid var(--rborder)!important; border-radius:0!important; }'
  + 'body.retro-mode [class*="progress"] [class*="fill"],'
  + 'body.retro-mode [class*="progress"] [class*="bar"] > div {'
  + '  background:var(--rgold)!important; box-shadow:0 0 8px var(--rgold)!important; }'

  /* ===== REMOVE NOTEBOOK PAPER ===== */
  + 'body.retro-mode [class*="ruled"], body.retro-mode [class*="paper"],'
  + 'body.retro-mode [class*="notebook"], body.retro-mode [class*="lined"] {'
  + '  background-image:none!important; background:var(--rcard)!important; }'
  + 'body.retro-mode [class*="card"]::before, body.retro-mode [class*="card"]::after,'
  + 'body.retro-mode [class*="paper"]::before, body.retro-mode [class*="paper"]::after,'
  + 'body.retro-mode [class*="note"]::before, body.retro-mode [class*="note"]::after {'
  + '  background:none!important; background-image:none!important; border:none!important; display:none!important; }'

  /* ===== LINKS ===== */
  + 'body.retro-mode a:not(#rmLoginOverlay a) { color:var(--rsky)!important; }'
  + 'body.retro-mode a:hover { color:var(--rgold)!important; }'

  /* ===== DIVIDERS ===== */
  + 'body.retro-mode hr, body.retro-mode [class*="divider"],'
  + 'body.retro-mode [class*="separator"] { border-color:var(--rborder)!important; background:var(--rborder)!important; }'

  /* ===== TOOLTIPS/POPUPS ===== */
  + 'body.retro-mode [class*="tooltip"], body.retro-mode [class*="popup"],'
  + 'body.retro-mode [class*="modal"]:not(#rmLoginOverlay),'
  + 'body.retro-mode [class*="dropdown"] {'
  + '  background:var(--rsurface)!important; border:2px solid var(--rborder)!important;'
  + '  color:var(--rpixel)!important; border-radius:0!important; }'

  /* ===== RETRO TOGGLE BUTTON ===== */
  + '.retro-toggle { font-family:Inter,sans-serif!important; font-size:.6rem; padding:3px 10px;'
  + '  border:1.5px solid #f2d6d0; color:#d4726a; background:transparent; cursor:pointer;'
  + '  font-weight:600; transition:all .2s; border-radius:12px; margin-left:4px; }'
  + '.retro-toggle:hover, .retro-toggle.on { background:var(--rpink,#e8477a); color:#fff;'
  + '  border-color:var(--rpink,#e8477a); }'
  + 'body.retro-mode .retro-toggle { border-color:#1e3a6e!important; color:#3a5a8a!important;'
  + '  border-radius:0!important; font-family:"Space Mono",monospace!important; }'
  + 'body.retro-mode .retro-toggle:hover, body.retro-mode .retro-toggle.on {'
  + '  background:var(--rgold)!important; color:#000!important; border-color:var(--rgold)!important; }'

  /* ===== SMOOTH TRANSITIONS ===== */
  + 'body { transition:background .5s ease,color .5s ease; }'
  + '[class*="card"],[class*="Card"],header,nav,main,'
  + 'button,input,textarea,select,[class*="tab"] {'
  + '  transition:background .3s,color .3s,border-color .3s,box-shadow .3s; }'
  + '';
  document.head.appendChild(css);

  /* ===== TOGGLE LOGIC ===== */
  function isRetro() { return document.body.classList.contains('retro-mode'); }

  window.toggleRetroMode = function(force) {
    var on = (typeof force === 'boolean') ? force : !isRetro();
    document.body.classList.toggle('retro-mode', on);
    localStorage.setItem(RETRO_KEY, on ? '1' : '0');
    document.querySelectorAll('.retro-toggle').forEach(function(btn) {
      btn.classList.toggle('on', on);
      btn.textContent = on ? 'COMFY' : 'RETRO';
    });
    hookThemeButtons();
  };

  function hookThemeButtons() {
    document.querySelectorAll('button, [role="button"], [class*="theme"], [class*="toggle"], [class*="mode"]').forEach(function(btn) {
      if (btn.classList.contains('retro-toggle')) return;
      if (btn.id && btn.id.startsWith('rm')) return;
      var txt = (btn.textContent || '').trim();
      var title = (btn.getAttribute('title') || '').toLowerCase();
      var ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
      if (txt === '\uD83C\uDF19' || title.includes('dark') || ariaLabel.includes('dark')) {
        if (!btn._retroHooked) { btn._retroHooked = true;
          var orig = btn.onclick;
          btn.onclick = function(e) { window.toggleRetroMode(true); if(orig) orig.call(btn,e); };
        }
      }
      if (txt === '\u2600\uFE0F' || txt === '\u2600' || title.includes('light') || ariaLabel.includes('light')) {
        if (!btn._retroHooked) { btn._retroHooked = true;
          var orig2 = btn.onclick;
          btn.onclick = function(e) { window.toggleRetroMode(false); if(orig2) orig2.call(btn,e); };
        }
      }
    });
  }

  function injectToggleButton() {
    var bar = document.getElementById('rmProfileBar');
    if (!bar || bar.querySelector('.retro-toggle')) return;
    var btn = document.createElement('button');
    btn.className = 'retro-toggle' + (isRetro() ? ' on' : '');
    btn.textContent = isRetro() ? 'COMFY' : 'RETRO';
    btn.onclick = function() { window.toggleRetroMode(); };
    var sairBtn = bar.querySelector('.pb-logout');
    if (sairBtn) bar.insertBefore(btn, sairBtn);
    else bar.appendChild(btn);
  }

  function retroBoot() {
    if (localStorage.getItem(RETRO_KEY) === '1') {
      document.body.classList.add('retro-mode');
    }
    injectToggleButton();
    hookThemeButtons();
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

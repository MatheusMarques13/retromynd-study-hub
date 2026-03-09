(function(){
  'use strict';
  var THEME_KEY = 'rm_theme';

  /* ===== INJECT GOOGLE FONTS (retro) ===== */
  if (!document.getElementById('rm-retro-fonts')) {
    var link = document.createElement('link');
    link.id = 'rm-retro-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=VT323&display=swap';
    document.head.appendChild(link);
  }

  /* ===== CSS ===== */
  var css = document.createElement('style');
  css.id = 'retro-mode-css';
  css.textContent = ''

  /* ========== RETRO DARK VARIABLES ========== */
  + 'body.retro-dark {'
  + '  --rbg:#0d1f3c; --rsurface:#0a1628; --rcard:#112244; --rborder:#1e3a6e;'
  + '  --rpixel:#e8f0ff; --rdim:#7a8faa; --rpink:#e8477a; --rgold:#f5c518;'
  + '  --rsky:#7ec8f5; --rgreen:#2ecc71;'
  + '  --rshadow:rgba(0,0,0,.4); --rscanline:rgba(0,0,0,.04);'
  + '  --rgold-glow:rgba(245,197,24,.4); --rpink-glow:rgba(232,71,122,.4);'
  + '}'

  /* ========== RETRO LIGHT VARIABLES ========== */
  + 'body.retro-light {'
  + '  --rbg:#f0ebe3; --rsurface:#e6dfd5; --rcard:#fffef7; --rborder:#1e3a6e;'
  + '  --rpixel:#0d1f3c; --rdim:#5a6a7e; --rpink:#d63a6a; --rgold:#b8860b;'
  + '  --rsky:#1a5ea8; --rgreen:#1d9e4e;'
  + '  --rshadow:rgba(30,58,110,.15); --rscanline:rgba(0,0,0,.015);'
  + '  --rgold-glow:rgba(184,134,11,.25); --rpink-glow:rgba(214,58,106,.25);'
  + '}'

  /* ========== SHARED RETRO (both dark + light) ========== */

  /* --- NUCLEAR FONT OVERRIDE --- */
  + 'body.retro-dark *, body.retro-light * {'
  + '  font-family:"Space Mono",monospace!important;'
  + '}'
  + 'body.retro-dark h1:not(#rmLoginOverlay h1), body.retro-dark h2:not(#rmLoginOverlay *),'
  + 'body.retro-dark h3, body.retro-dark h4, body.retro-dark h5, body.retro-dark h6,'
  + 'body.retro-light h1:not(#rmLoginOverlay h1), body.retro-light h2:not(#rmLoginOverlay *),'
  + 'body.retro-light h3, body.retro-light h4, body.retro-light h5, body.retro-light h6 {'
  + '  font-family:VT323,monospace!important;'
  + '}'

  /* --- Global bg + color --- */
  + 'body.retro-dark, body.retro-light {'
  + '  background:var(--rbg)!important; color:var(--rpixel)!important; }'

  /* --- Scanlines --- */
  + 'body.retro-dark::after, body.retro-light::after {'
  + '  content:"";position:fixed;inset:0;pointer-events:none;z-index:99999;'
  + '  background:repeating-linear-gradient(0deg,transparent,transparent 2px,var(--rscanline) 2px,var(--rscanline) 4px); }'

  /* --- Selection --- */
  + 'body.retro-dark ::selection, body.retro-light ::selection { background:var(--rgold);color:#000; }'

  /* --- Scrollbar --- */
  + 'body.retro-dark ::-webkit-scrollbar, body.retro-light ::-webkit-scrollbar { width:6px;height:6px; }'
  + 'body.retro-dark ::-webkit-scrollbar-track, body.retro-light ::-webkit-scrollbar-track { background:var(--rsurface); }'
  + 'body.retro-dark ::-webkit-scrollbar-thumb, body.retro-light ::-webkit-scrollbar-thumb { background:var(--rborder); }'
  + 'body.retro-dark ::-webkit-scrollbar-thumb:hover, body.retro-light ::-webkit-scrollbar-thumb:hover { background:var(--rgold); }'

  /* --- Cards --- */
  + 'body.retro-dark [class*="card"], body.retro-dark [class*="Card"], body.retro-dark [class*="widget"],'
  + 'body.retro-dark [class*="panel"]:not(#rmProfilePanel), body.retro-dark [class*="box"]:not(input):not(select),'
  + 'body.retro-light [class*="card"], body.retro-light [class*="Card"], body.retro-light [class*="widget"],'
  + 'body.retro-light [class*="panel"]:not(#rmProfilePanel), body.retro-light [class*="box"]:not(input):not(select) {'
  + '  background:var(--rcard)!important; border:2px solid var(--rborder)!important;'
  + '  border-radius:0!important; box-shadow:4px 4px 0 var(--rshadow)!important; color:var(--rpixel)!important; }'

  /* --- Header/Nav --- */
  + 'body.retro-dark header, body.retro-dark [class*="header"]:not(#rmProfilePanel *):not(#rmProfileBar *),'
  + 'body.retro-dark nav, body.retro-dark [class*="nav"]:not(#rmProfilePanel *),'
  + 'body.retro-dark [class*="toolbar"], body.retro-dark [class*="topbar"],'
  + 'body.retro-light header, body.retro-light [class*="header"]:not(#rmProfilePanel *):not(#rmProfileBar *),'
  + 'body.retro-light nav, body.retro-light [class*="nav"]:not(#rmProfilePanel *),'
  + 'body.retro-light [class*="toolbar"], body.retro-light [class*="topbar"] {'
  + '  background:var(--rsurface)!important; border-color:var(--rborder)!important; color:var(--rpixel)!important; }'

  /* --- Backgrounds --- */
  + 'body.retro-dark main, body.retro-dark [class*="main"], body.retro-dark [class*="content"],'
  + 'body.retro-dark [class*="wrapper"], body.retro-dark [class*="layout"], body.retro-dark [class*="page"],'
  + 'body.retro-dark [class*="grid"], body.retro-dark [class*="body"],'
  + 'body.retro-dark [class*="container"]:not(#rmLoginOverlay):not(#rmLoginOverlay *),'
  + 'body.retro-dark [class*="section"]:not(#rmProfilePanel *),'
  + 'body.retro-light main, body.retro-light [class*="main"], body.retro-light [class*="content"],'
  + 'body.retro-light [class*="wrapper"], body.retro-light [class*="layout"], body.retro-light [class*="page"],'
  + 'body.retro-light [class*="grid"], body.retro-light [class*="body"],'
  + 'body.retro-light [class*="container"]:not(#rmLoginOverlay):not(#rmLoginOverlay *),'
  + 'body.retro-light [class*="section"]:not(#rmProfilePanel *) {'
  + '  background:transparent!important; color:var(--rpixel)!important; }'

  /* --- Headings style --- */
  + 'body.retro-dark h1:not(#rmLoginOverlay h1), body.retro-dark h2:not(#rmLoginOverlay *),'
  + 'body.retro-dark h3, body.retro-dark h4, body.retro-dark h5,'
  + 'body.retro-light h1:not(#rmLoginOverlay h1), body.retro-light h2:not(#rmLoginOverlay *),'
  + 'body.retro-light h3, body.retro-light h4, body.retro-light h5 {'
  + '  color:var(--rgold)!important;'
  + '  text-shadow:0 0 20px var(--rgold-glow),4px 4px 0 rgba(0,0,0,.08)!important;'
  + '  letter-spacing:.04em!important; }'
  + 'body.retro-dark h1:not(#rmLoginOverlay h1), body.retro-light h1:not(#rmLoginOverlay h1) {'
  + '  animation:rmFlicker 5s infinite!important; }'
  + '@keyframes rmFlicker{0%,95%,100%{opacity:1}96%{opacity:.7}97%{opacity:1}98%{opacity:.4}99%{opacity:1}}'

  /* --- All text readable --- */
  + 'body.retro-dark p, body.retro-dark li, body.retro-dark td, body.retro-dark th, body.retro-dark label,'
  + 'body.retro-dark [class*="desc"], body.retro-dark [class*="sub"], body.retro-dark [class*="info"]:not(#rmProfileBar *),'
  + 'body.retro-light p, body.retro-light li, body.retro-light td, body.retro-light th, body.retro-light label,'
  + 'body.retro-light [class*="desc"], body.retro-light [class*="sub"], body.retro-light [class*="info"]:not(#rmProfileBar *) {'
  + '  color:var(--rpixel)!important; }'

  + 'body.retro-dark [class*="card"] span, body.retro-dark [class*="card"] div,'
  + 'body.retro-dark main span, body.retro-dark main div,'
  + 'body.retro-dark [class*="content"] span, body.retro-dark [class*="content"] div,'
  + 'body.retro-light [class*="card"] span, body.retro-light [class*="card"] div,'
  + 'body.retro-light main span, body.retro-light main div,'
  + 'body.retro-light [class*="content"] span, body.retro-light [class*="content"] div {'
  + '  color:var(--rpixel)!important; }'

  /* --- Dim text --- */
  + 'body.retro-dark [class*="muted"], body.retro-dark [class*="secondary"], body.retro-dark [class*="gray"],'
  + 'body.retro-dark [class*="grey"], body.retro-dark [class*="hint"], body.retro-dark [class*="caption"],'
  + 'body.retro-dark small, body.retro-dark [class*="placeholder"], body.retro-dark [class*="empty"],'
  + 'body.retro-light [class*="muted"], body.retro-light [class*="secondary"], body.retro-light [class*="gray"],'
  + 'body.retro-light [class*="grey"], body.retro-light [class*="hint"], body.retro-light [class*="caption"],'
  + 'body.retro-light small, body.retro-light [class*="placeholder"], body.retro-light [class*="empty"] {'
  + '  color:var(--rdim)!important; }'

  /* --- Stat numbers (VT323) --- */
  + 'body.retro-dark [class*="stat"] [class*="val"], body.retro-dark [class*="stat"] [class*="num"],'
  + 'body.retro-dark [class*="stat"] [class*="count"], body.retro-dark [class*="streak"], body.retro-dark [class*="score"],'
  + 'body.retro-light [class*="stat"] [class*="val"], body.retro-light [class*="stat"] [class*="num"],'
  + 'body.retro-light [class*="stat"] [class*="count"], body.retro-light [class*="streak"], body.retro-light [class*="score"] {'
  + '  font-family:VT323,monospace!important; color:var(--rgold)!important;'
  + '  text-shadow:0 0 8px var(--rgold-glow)!important; font-size:2rem!important; }'

  /* --- Stat labels --- */
  + 'body.retro-dark [class*="stat"] [class*="label"], body.retro-dark [class*="stat"] [class*="title"], body.retro-dark [class*="stat"] small,'
  + 'body.retro-light [class*="stat"] [class*="label"], body.retro-light [class*="stat"] [class*="title"], body.retro-light [class*="stat"] small {'
  + '  color:var(--rdim)!important; font-size:.6rem!important; letter-spacing:.15em!important; text-transform:uppercase!important; }'

  /* --- Timer (VT323) --- */
  + 'body.retro-dark [class*="timer"] [class*="display"], body.retro-dark [class*="timer"] [class*="time"],'
  + 'body.retro-dark [class*="clock"], body.retro-dark [class*="countdown"], body.retro-dark [class*="digit"],'
  + 'body.retro-light [class*="timer"] [class*="display"], body.retro-light [class*="timer"] [class*="time"],'
  + 'body.retro-light [class*="clock"], body.retro-light [class*="countdown"], body.retro-light [class*="digit"] {'
  + '  font-family:VT323,monospace!important; color:var(--rgold)!important;'
  + '  text-shadow:0 0 30px var(--rgold-glow),0 0 60px rgba(0,0,0,.1)!important; }'

  /* --- Buttons --- */
  + 'body.retro-dark button:not(#rmLoginOverlay button):not(.rm-tb):not(.rm-bt):not(.pb-btn):not(.pb-logout)'
  + ':not(.pp-save):not(.pp-logout):not(.pp-close):not(.retro-toggle):not(.home-btn),'
  + 'body.retro-dark [type="button"]:not(#rmLoginOverlay *), body.retro-dark [type="submit"]:not(#rmLoginOverlay *),'
  + 'body.retro-light button:not(#rmLoginOverlay button):not(.rm-tb):not(.rm-bt):not(.pb-btn):not(.pb-logout)'
  + ':not(.pp-save):not(.pp-logout):not(.pp-close):not(.retro-toggle):not(.home-btn),'
  + 'body.retro-light [type="button"]:not(#rmLoginOverlay *), body.retro-light [type="submit"]:not(#rmLoginOverlay *) {'
  + '  background:var(--rsurface)!important; border:2px solid var(--rborder)!important;'
  + '  color:var(--rpixel)!important; border-radius:0!important; cursor:pointer!important;'
  + '  font-weight:700!important; font-size:.7rem!important; letter-spacing:.06em!important; padding:6px 12px!important; }'

  + 'body.retro-dark button:not(#rmLoginOverlay button):not(.rm-tb):not(.rm-bt):not(.pb-btn)'
  + ':not(.pb-logout):not(.pp-save):not(.pp-logout):not(.pp-close):not(.retro-toggle):not(.home-btn):hover,'
  + 'body.retro-light button:not(#rmLoginOverlay button):not(.rm-tb):not(.rm-bt):not(.pb-btn)'
  + ':not(.pb-logout):not(.pp-save):not(.pp-logout):not(.pp-close):not(.retro-toggle):not(.home-btn):hover {'
  + '  border-color:var(--rgold)!important; color:var(--rgold)!important;'
  + '  box-shadow:0 0 8px var(--rgold-glow),2px 2px 0 var(--rgold)!important; }'

  /* Active buttons */
  + 'body.retro-dark button.active:not(#rmLoginOverlay button):not(.rm-tb):not(.pb-btn),'
  + 'body.retro-dark [class*="selected"]:not(#rmLoginOverlay *), body.retro-dark [aria-selected="true"]:not(#rmLoginOverlay *),'
  + 'body.retro-light button.active:not(#rmLoginOverlay button):not(.rm-tb):not(.pb-btn),'
  + 'body.retro-light [class*="selected"]:not(#rmLoginOverlay *), body.retro-light [aria-selected="true"]:not(#rmLoginOverlay *) {'
  + '  background:var(--rgold)!important; color:#000!important; border-color:var(--rgold)!important;'
  + '  box-shadow:0 0 12px var(--rgold-glow)!important; }'

  /* Danger buttons */
  + 'body.retro-dark [class*="danger"], body.retro-dark [class*="reset"], body.retro-dark [class*="delete"],'
  + 'body.retro-light [class*="danger"], body.retro-light [class*="reset"], body.retro-light [class*="delete"] {'
  + '  border-color:var(--rpink)!important; color:var(--rpink)!important; }'

  /* --- Inputs --- */
  + 'body.retro-dark input:not(.rm-f):not(.pp-input):not(#rmLoginOverlay input),'
  + 'body.retro-dark textarea:not(#rmLoginOverlay textarea), body.retro-dark select:not(#rmLoginOverlay select),'
  + 'body.retro-light input:not(.rm-f):not(.pp-input):not(#rmLoginOverlay input),'
  + 'body.retro-light textarea:not(#rmLoginOverlay textarea), body.retro-light select:not(#rmLoginOverlay select) {'
  + '  background:var(--rsurface)!important; border:2px solid var(--rborder)!important;'
  + '  color:var(--rpixel)!important; border-radius:0!important; caret-color:var(--rgold)!important; font-size:.8rem!important; }'
  + 'body.retro-dark input:not(#rmLoginOverlay input):focus, body.retro-dark textarea:not(#rmLoginOverlay textarea):focus,'
  + 'body.retro-light input:not(#rmLoginOverlay input):focus, body.retro-light textarea:not(#rmLoginOverlay textarea):focus {'
  + '  border-color:var(--rgold)!important; box-shadow:0 0 8px var(--rgold-glow)!important; }'
  + 'body.retro-dark input::placeholder, body.retro-dark textarea::placeholder,'
  + 'body.retro-light input::placeholder, body.retro-light textarea::placeholder { color:var(--rdim)!important; }'

  /* --- Checkboxes --- */
  + 'body.retro-dark input[type="checkbox"], body.retro-light input[type="checkbox"] {'
  + '  appearance:none!important;-webkit-appearance:none!important;'
  + '  width:18px!important;height:18px!important; border:2px solid var(--rborder)!important;'
  + '  background:var(--rsurface)!important; border-radius:0!important; cursor:pointer!important; position:relative!important; }'
  + 'body.retro-dark input[type="checkbox"]:checked, body.retro-light input[type="checkbox"]:checked {'
  + '  background:var(--rgold)!important; border-color:var(--rgold)!important; box-shadow:0 0 8px var(--rgold-glow)!important; }'
  + 'body.retro-dark input[type="checkbox"]:checked::after, body.retro-light input[type="checkbox"]:checked::after {'
  + '  content:"\\u2713";position:absolute;top:-2px;left:2px;color:#000;font-weight:900;font-size:14px; }'

  /* --- Tags/Badges --- */
  + 'body.retro-dark [class*="tag"]:not(#rmLoginOverlay *), body.retro-dark [class*="badge"]:not(#rmLoginOverlay *),'
  + 'body.retro-light [class*="tag"]:not(#rmLoginOverlay *), body.retro-light [class*="badge"]:not(#rmLoginOverlay *) {'
  + '  background:transparent!important; border:1.5px solid var(--rpink)!important;'
  + '  color:var(--rpink)!important; border-radius:0!important; font-size:.62rem!important; font-weight:700!important; }'

  /* --- Tabs --- */
  + 'body.retro-dark [class*="tab"]:not(.rm-tb):not(#rmLoginOverlay *), body.retro-dark [role="tab"],'
  + 'body.retro-light [class*="tab"]:not(.rm-tb):not(#rmLoginOverlay *), body.retro-light [role="tab"] {'
  + '  background:var(--rsurface)!important; color:var(--rpixel)!important;'
  + '  border:2px solid var(--rborder)!important; border-radius:0!important;'
  + '  font-weight:700!important; font-size:.65rem!important; letter-spacing:.08em!important; padding:5px 10px!important; }'
  + 'body.retro-dark [class*="tab"].active:not(.rm-tb), body.retro-dark [class*="tab"][class*="active"]:not(.rm-tb),'
  + 'body.retro-dark [role="tab"][aria-selected="true"],'
  + 'body.retro-light [class*="tab"].active:not(.rm-tb), body.retro-light [class*="tab"][class*="active"]:not(.rm-tb),'
  + 'body.retro-light [role="tab"][aria-selected="true"] {'
  + '  background:var(--rpink)!important; color:#fff!important; border-color:var(--rpink)!important; }'

  /* --- Progress --- */
  + 'body.retro-dark [class*="progress"], body.retro-dark progress,'
  + 'body.retro-light [class*="progress"], body.retro-light progress {'
  + '  background:var(--rsurface)!important; border:2px solid var(--rborder)!important; border-radius:0!important; }'
  + 'body.retro-dark [class*="progress"] [class*="fill"], body.retro-light [class*="progress"] [class*="fill"] {'
  + '  background:var(--rgold)!important; box-shadow:0 0 8px var(--rgold-glow)!important; }'

  /* --- Remove notebook paper --- */
  + 'body.retro-dark [class*="ruled"], body.retro-dark [class*="paper"], body.retro-dark [class*="notebook"], body.retro-dark [class*="lined"],'
  + 'body.retro-light [class*="ruled"], body.retro-light [class*="paper"], body.retro-light [class*="notebook"], body.retro-light [class*="lined"] {'
  + '  background-image:none!important; background:var(--rcard)!important; }'
  + 'body.retro-dark [class*="card"]::before, body.retro-dark [class*="card"]::after,'
  + 'body.retro-dark [class*="paper"]::before, body.retro-dark [class*="paper"]::after,'
  + 'body.retro-dark [class*="note"]::before, body.retro-dark [class*="note"]::after,'
  + 'body.retro-light [class*="card"]::before, body.retro-light [class*="card"]::after,'
  + 'body.retro-light [class*="paper"]::before, body.retro-light [class*="paper"]::after,'
  + 'body.retro-light [class*="note"]::before, body.retro-light [class*="note"]::after {'
  + '  background:none!important; background-image:none!important; border:none!important; display:none!important; }'

  /* --- Links --- */
  + 'body.retro-dark a:not(#rmLoginOverlay a), body.retro-light a:not(#rmLoginOverlay a) { color:var(--rsky)!important; }'
  + 'body.retro-dark a:hover, body.retro-light a:hover { color:var(--rgold)!important; }'

  /* --- Dividers --- */
  + 'body.retro-dark hr, body.retro-dark [class*="divider"], body.retro-dark [class*="separator"],'
  + 'body.retro-light hr, body.retro-light [class*="divider"], body.retro-light [class*="separator"] {'
  + '  border-color:var(--rborder)!important; background:var(--rborder)!important; }'

  /* --- Tooltips/Popups --- */
  + 'body.retro-dark [class*="tooltip"], body.retro-dark [class*="popup"],'
  + 'body.retro-dark [class*="modal"]:not(#rmLoginOverlay), body.retro-dark [class*="dropdown"],'
  + 'body.retro-light [class*="tooltip"], body.retro-light [class*="popup"],'
  + 'body.retro-light [class*="modal"]:not(#rmLoginOverlay), body.retro-light [class*="dropdown"] {'
  + '  background:var(--rsurface)!important; border:2px solid var(--rborder)!important;'
  + '  color:var(--rpixel)!important; border-radius:0!important; }'

  /* ========== RETRO TOGGLE BUTTON ========== */
  + '.retro-toggle { font-family:Inter,sans-serif!important; font-size:.6rem; padding:3px 10px;'
  + '  border:1.5px solid #f2d6d0; color:#d4726a; background:transparent; cursor:pointer;'
  + '  font-weight:600; transition:all .2s; border-radius:12px; margin-left:4px; }'
  + '.retro-toggle:hover { background:#e8477a; color:#fff; border-color:#e8477a; }'
  + 'body.retro-dark .retro-toggle { border-color:#1e3a6e!important; color:#7a8faa!important;'
  + '  border-radius:0!important; font-family:"Space Mono",monospace!important; }'
  + 'body.retro-dark .retro-toggle:hover { background:var(--rgold)!important; color:#000!important; border-color:var(--rgold)!important; }'
  + 'body.retro-light .retro-toggle { border-color:#1e3a6e!important; color:#1e3a6e!important;'
  + '  border-radius:0!important; font-family:"Space Mono",monospace!important; }'
  + 'body.retro-light .retro-toggle:hover { background:var(--rgold)!important; color:#000!important; border-color:var(--rgold)!important; }'

  /* ========== HOME BUTTON ========== */
  + 'body.retro-dark .home-btn, body.retro-light .home-btn {'
  + '  background:var(--rsurface)!important; border:2px solid var(--rborder)!important;'
  + '  color:var(--rpixel)!important; border-radius:0!important;'
  + '  font-family:"Space Mono",monospace!important; font-size:.8rem!important; padding:4px 10px!important; }'
  + 'body.retro-dark .home-btn:hover, body.retro-light .home-btn:hover {'
  + '  border-color:var(--rgold)!important; color:var(--rgold)!important;'
  + '  box-shadow:0 0 8px var(--rgold-glow)!important; }'

  /* ========== SMOOTH TRANSITIONS ========== */
  + 'body { transition:background .5s ease,color .5s ease; }'
  + '[class*="card"],[class*="Card"],header,nav,main,'
  + 'button,input,textarea,select,[class*="tab"] {'
  + '  transition:background .3s,color .3s,border-color .3s,box-shadow .3s; }'
  + '';
  document.head.appendChild(css);

  /* ===== THEME LOGIC ===== */
  function getTheme() { return localStorage.getItem(THEME_KEY) || 'comfy'; }
  function setTheme(t) { localStorage.setItem(THEME_KEY, t); }
  function isRetro() { var t = getTheme(); return t === 'retro-dark' || t === 'retro-light'; }
  function isCafe() { var t = getTheme(); return t === 'cafe-dark' || t === 'cafe-light'; }

  function applyTheme(theme) {
    document.body.classList.remove('retro-dark','retro-light','retro-mode','cafe-dark','cafe-light');
    if (theme === 'retro-dark') document.body.classList.add('retro-dark');
    else if (theme === 'retro-light') document.body.classList.add('retro-light');
    else if (theme === 'cafe-dark') document.body.classList.add('cafe-dark');
    else if (theme === 'cafe-light') document.body.classList.add('cafe-light');
    setTheme(theme);
    updateToggleButtons(theme);
  }

  function updateToggleButtons(theme) {
    var isR = (theme === 'retro-dark' || theme === 'retro-light');
    var isC = (theme === 'cafe-dark' || theme === 'cafe-light');
    document.querySelectorAll('.retro-toggle').forEach(function(btn) {
      if (isR) {
        btn.textContent = 'CAFÉ';
      } else if (isC) {
        btn.textContent = 'COMFY';
      } else {
        btn.textContent = 'RETRO';
      }
    });
  }

  /* Toggle cycles: comfy → retro-dark → cafe-dark → comfy */
  window.toggleRetroMode = function(force) {
    if (typeof force === 'string') { applyTheme(force); return; }
    var current = getTheme();
    if (current === 'comfy') {
      applyTheme('retro-dark');
    } else if (isRetro()) {
      /* retro → café (preserve light/dark preference) */
      var wasDark = (current === 'retro-dark');
      applyTheme(wasDark ? 'cafe-dark' : 'cafe-light');
    } else if (isCafe()) {
      applyTheme('comfy');
    } else {
      applyTheme('retro-dark');
    }
  };

  /* ===== HOOK EXISTING LIGHT/DARK BUTTONS ===== */
  function hookThemeButtons() {
    /* Hook the hub's own theme toggle buttons */
    var themeToggle = document.getElementById('themeToggle');
    if (themeToggle && !themeToggle._rmHooked) {
      themeToggle._rmHooked = true;
      themeToggle.querySelectorAll('.theme-toggle-opt').forEach(function(opt) {
        opt.addEventListener('click', function() {
          var val = opt.getAttribute('data-theme-val');
          if (isRetro()) {
            if (val === 'light') applyTheme('retro-light');
            else if (val === 'dark') applyTheme('retro-dark');
            /* system: default to retro-dark */
            else applyTheme('retro-dark');
          } else if (isCafe()) {
            if (val === 'light') applyTheme('cafe-light');
            else if (val === 'dark') applyTheme('cafe-dark');
            /* system: default to cafe-dark */
            else applyTheme('cafe-dark');
          }
        });
      });
    }
  }

  /* ===== INJECT TOGGLE BUTTON ===== */
  function injectToggleButton() {
    /* Try profile bar first */
    var bar = document.getElementById('rmProfileBar');
    if (bar && !bar.querySelector('.retro-toggle')) {
      var btn = document.createElement('button');
      btn.className = 'retro-toggle';
      var theme = getTheme();
      var isR = (theme === 'retro-dark' || theme === 'retro-light');
      var isC = (theme === 'cafe-dark' || theme === 'cafe-light');
      btn.textContent = isR ? 'CAFÉ' : (isC ? 'COMFY' : 'RETRO');
      btn.onclick = function() { window.toggleRetroMode(); };
      var sairBtn = bar.querySelector('.pb-logout');
      if (sairBtn) bar.insertBefore(btn, sairBtn);
      else bar.appendChild(btn);
      return;
    }
    /* Fallback: inject near theme toggle in hub header */
    var hubHeader = document.querySelector('.hub-header');
    if (hubHeader && !hubHeader.querySelector('.retro-toggle')) {
      var btn2 = document.createElement('button');
      btn2.className = 'retro-toggle';
      var theme2 = getTheme();
      var isR2 = (theme2 === 'retro-dark' || theme2 === 'retro-light');
      var isC2 = (theme2 === 'cafe-dark' || theme2 === 'cafe-light');
      btn2.textContent = isR2 ? 'CAFÉ' : (isC2 ? 'COMFY' : 'RETRO');
      btn2.onclick = function() { window.toggleRetroMode(); };
      var themeToggle = document.getElementById('themeToggle');
      if (themeToggle) themeToggle.parentNode.insertBefore(btn2, themeToggle.nextSibling);
      else hubHeader.appendChild(btn2);
    }
  }

  /* ===== BOOT ===== */
  function retroBoot() {
    var saved = getTheme();
    if (saved !== 'comfy') applyTheme(saved);
    injectToggleButton();
    hookThemeButtons();
    var observer = new MutationObserver(function() {
      injectToggleButton();
      hookThemeButtons();
    });
    observer.observe(document.body, { childList:true, subtree:false });
  }

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(retroBoot,300);});
  else setTimeout(retroBoot,300);
})();

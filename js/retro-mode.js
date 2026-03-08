(function(){
  'use strict';
  var THEME_KEY = 'rm_theme';

  /* ===== INJECT GOOGLE FONTS ===== */
  if (!document.getElementById('rm-retro-fonts')) {
    var link = document.createElement('link');
    link.id = 'rm-retro-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=VT323&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&display=swap';
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
  + ':not(.pp-save):not(.pp-logout):not(.pp-close):not(.retro-toggle),'
  + 'body.retro-dark [type="button"]:not(#rmLoginOverlay *), body.retro-dark [type="submit"]:not(#rmLoginOverlay *),'
  + 'body.retro-light button:not(#rmLoginOverlay button):not(.rm-tb):not(.rm-bt):not(.pb-btn):not(.pb-logout)'
  + ':not(.pp-save):not(.pp-logout):not(.pp-close):not(.retro-toggle),'
  + 'body.retro-light [type="button"]:not(#rmLoginOverlay *), body.retro-light [type="submit"]:not(#rmLoginOverlay *) {'
  + '  background:var(--rsurface)!important; border:2px solid var(--rborder)!important;'
  + '  color:var(--rpixel)!important; border-radius:0!important; cursor:pointer!important;'
  + '  font-weight:700!important; font-size:.7rem!important; letter-spacing:.06em!important; padding:6px 12px!important; }'

  + 'body.retro-dark button:not(#rmLoginOverlay button):not(.rm-tb):not(.rm-bt):not(.pb-btn)'
  + ':not(.pb-logout):not(.pp-save):not(.pp-logout):not(.pp-close):not(.retro-toggle):hover,'
  + 'body.retro-light button:not(#rmLoginOverlay button):not(.rm-tb):not(.rm-bt):not(.pb-btn)'
  + ':not(.pb-logout):not(.pp-save):not(.pp-logout):not(.pp-close):not(.retro-toggle):hover {'
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


  /* ╔══════════════════════════════════════════════╗ */
  /* ║           CAFÉ THEME — PARIS CHIC            ║ */
  /* ╚══════════════════════════════════════════════╝ */

  + 'body.cafe {'
  + '  --cbg:#1a1410; --csurface:#231e18; --ccard:#2c2520; --cborder:#3d342b;'
  + '  --ctext:#f0e8dc; --cdim:#a89880; --cgold:#c9a96e; --ccream:#f5efe4;'
  + '  --caccent:#8b6e4e; --crose:#c4787a; --cwarm:#e8c9a0;'
  + '  --cshadow:0 2px 16px rgba(0,0,0,.35); --cglow:rgba(201,169,110,.15);'
  + '}'

  /* --- Café: Global --- */
  + 'body.cafe {'
  + '  background:linear-gradient(165deg,#1a1410 0%,#1e1814 30%,#211c16 60%,#191310 100%)!important;'
  + '  color:var(--ctext)!important;'
  + '}'
  + 'body.cafe::before {'
  + '  content:"";position:fixed;inset:0;pointer-events:none;z-index:0;'
  + '  background:radial-gradient(ellipse 120% 80% at 20% 50%,rgba(201,169,110,.04) 0%,transparent 70%),'
  + '  radial-gradient(ellipse 100% 60% at 80% 30%,rgba(139,110,78,.03) 0%,transparent 60%);'
  + '}'
  + 'body.cafe::after {'
  + '  content:"";position:fixed;inset:0;pointer-events:none;z-index:0;'
  + '  background:radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,.2) 100%);'
  + '}'

  /* --- Café: Nuclear font override --- */
  + 'body.cafe * {'
  + '  font-family:"Cormorant Garamond",Garamond,"Times New Roman",serif!important;'
  + '}'
  + 'body.cafe h1:not(#rmLoginOverlay h1), body.cafe h2:not(#rmLoginOverlay *),'
  + 'body.cafe h3, body.cafe h4, body.cafe h5, body.cafe h6 {'
  + '  font-family:"Playfair Display",Didot,"Times New Roman",serif!important;'
  + '  font-weight:600!important; letter-spacing:.02em!important;'
  + '  color:var(--cgold)!important;'
  + '  text-shadow:0 1px 12px rgba(201,169,110,.2)!important;'
  + '}'

  /* --- Café: Selection --- */
  + 'body.cafe ::selection { background:var(--cgold);color:#1a1410; }'

  /* --- Café: Scrollbar --- */
  + 'body.cafe ::-webkit-scrollbar { width:5px;height:5px; }'
  + 'body.cafe ::-webkit-scrollbar-track { background:var(--csurface); }'
  + 'body.cafe ::-webkit-scrollbar-thumb { background:var(--cborder);border-radius:3px; }'
  + 'body.cafe ::-webkit-scrollbar-thumb:hover { background:var(--cgold); }'

  /* --- Café: Cards --- */
  + 'body.cafe [class*="card"], body.cafe [class*="Card"], body.cafe [class*="widget"],'
  + 'body.cafe [class*="panel"]:not(#rmProfilePanel), body.cafe [class*="box"]:not(input):not(select) {'
  + '  background:var(--ccard)!important;'
  + '  border:1px solid var(--cborder)!important;'
  + '  border-radius:8px!important;'
  + '  box-shadow:var(--cshadow)!important;'
  + '  color:var(--ctext)!important;'
  + '}'

  /* --- Café: Header/Nav --- */
  + 'body.cafe header, body.cafe [class*="header"]:not(#rmProfilePanel *):not(#rmProfileBar *),'
  + 'body.cafe nav, body.cafe [class*="nav"]:not(#rmProfilePanel *),'
  + 'body.cafe [class*="toolbar"], body.cafe [class*="topbar"] {'
  + '  background:var(--csurface)!important; border-color:var(--cborder)!important; color:var(--ctext)!important; }'

  /* --- Café: Backgrounds --- */
  + 'body.cafe main, body.cafe [class*="main"], body.cafe [class*="content"],'
  + 'body.cafe [class*="wrapper"], body.cafe [class*="layout"], body.cafe [class*="page"],'
  + 'body.cafe [class*="grid"], body.cafe [class*="body"],'
  + 'body.cafe [class*="container"]:not(#rmLoginOverlay):not(#rmLoginOverlay *),'
  + 'body.cafe [class*="section"]:not(#rmProfilePanel *) {'
  + '  background:transparent!important; color:var(--ctext)!important; }'

  /* --- Café: Text --- */
  + 'body.cafe p, body.cafe li, body.cafe td, body.cafe th, body.cafe label,'
  + 'body.cafe [class*="desc"], body.cafe [class*="sub"], body.cafe [class*="info"]:not(#rmProfileBar *) {'
  + '  color:var(--ctext)!important; }'
  + 'body.cafe [class*="card"] span, body.cafe [class*="card"] div,'
  + 'body.cafe main span, body.cafe main div,'
  + 'body.cafe [class*="content"] span, body.cafe [class*="content"] div {'
  + '  color:var(--ctext)!important; }'

  /* --- Café: Dim text --- */
  + 'body.cafe [class*="muted"], body.cafe [class*="secondary"], body.cafe [class*="gray"],'
  + 'body.cafe [class*="grey"], body.cafe [class*="hint"], body.cafe [class*="caption"],'
  + 'body.cafe small, body.cafe [class*="placeholder"], body.cafe [class*="empty"] {'
  + '  color:var(--cdim)!important; }'

  /* --- Café: Stats --- */
  + 'body.cafe [class*="stat"] [class*="val"], body.cafe [class*="stat"] [class*="num"],'
  + 'body.cafe [class*="stat"] [class*="count"], body.cafe [class*="streak"], body.cafe [class*="score"] {'
  + '  font-family:"Playfair Display",serif!important; color:var(--cgold)!important;'
  + '  text-shadow:0 1px 8px var(--cglow)!important; font-size:1.8rem!important; font-weight:700!important; }'
  + 'body.cafe [class*="stat"] [class*="label"], body.cafe [class*="stat"] [class*="title"], body.cafe [class*="stat"] small {'
  + '  color:var(--cdim)!important; font-size:.65rem!important; letter-spacing:.18em!important;'
  + '  text-transform:uppercase!important; font-weight:500!important; }'

  /* --- Café: Timer --- */
  + 'body.cafe [class*="timer"] [class*="display"], body.cafe [class*="timer"] [class*="time"],'
  + 'body.cafe [class*="clock"], body.cafe [class*="countdown"], body.cafe [class*="digit"] {'
  + '  font-family:"Playfair Display",serif!important; color:var(--cwarm)!important;'
  + '  text-shadow:0 2px 20px rgba(232,201,160,.15)!important; font-weight:700!important; }'

  /* --- Café: Buttons --- */
  + 'body.cafe button:not(#rmLoginOverlay button):not(.rm-tb):not(.rm-bt):not(.pb-btn):not(.pb-logout)'
  + ':not(.pp-save):not(.pp-logout):not(.pp-close):not(.retro-toggle),'
  + 'body.cafe [type="button"]:not(#rmLoginOverlay *), body.cafe [type="submit"]:not(#rmLoginOverlay *) {'
  + '  background:transparent!important; border:1px solid var(--caccent)!important;'
  + '  color:var(--cwarm)!important; border-radius:4px!important; cursor:pointer!important;'
  + '  font-weight:600!important; font-size:.78rem!important; letter-spacing:.08em!important;'
  + '  padding:7px 16px!important; transition:all .25s ease!important; }'
  + 'body.cafe button:not(#rmLoginOverlay button):not(.rm-tb):not(.rm-bt):not(.pb-btn)'
  + ':not(.pb-logout):not(.pp-save):not(.pp-logout):not(.pp-close):not(.retro-toggle):hover {'
  + '  background:var(--cgold)!important; color:#1a1410!important; border-color:var(--cgold)!important;'
  + '  box-shadow:0 2px 16px rgba(201,169,110,.25)!important; }'

  /* Café: Active buttons */
  + 'body.cafe button.active:not(#rmLoginOverlay button):not(.rm-tb):not(.pb-btn),'
  + 'body.cafe [class*="selected"]:not(#rmLoginOverlay *), body.cafe [aria-selected="true"]:not(#rmLoginOverlay *) {'
  + '  background:var(--cgold)!important; color:#1a1410!important; border-color:var(--cgold)!important;'
  + '  box-shadow:0 2px 12px var(--cglow)!important; }'

  /* Café: Danger buttons */
  + 'body.cafe [class*="danger"], body.cafe [class*="reset"], body.cafe [class*="delete"] {'
  + '  border-color:var(--crose)!important; color:var(--crose)!important; }'

  /* --- Café: Inputs --- */
  + 'body.cafe input:not(.rm-f):not(.pp-input):not(#rmLoginOverlay input),'
  + 'body.cafe textarea:not(#rmLoginOverlay textarea), body.cafe select:not(#rmLoginOverlay select) {'
  + '  background:var(--csurface)!important; border:1px solid var(--cborder)!important;'
  + '  color:var(--ctext)!important; border-radius:4px!important; caret-color:var(--cgold)!important;'
  + '  font-size:.85rem!important; }'
  + 'body.cafe input:not(#rmLoginOverlay input):focus, body.cafe textarea:not(#rmLoginOverlay textarea):focus {'
  + '  border-color:var(--cgold)!important; box-shadow:0 0 0 2px rgba(201,169,110,.15)!important; }'
  + 'body.cafe input::placeholder, body.cafe textarea::placeholder { color:var(--cdim)!important; }'

  /* --- Café: Checkboxes --- */
  + 'body.cafe input[type="checkbox"] {'
  + '  appearance:none!important;-webkit-appearance:none!important;'
  + '  width:16px!important;height:16px!important; border:1px solid var(--caccent)!important;'
  + '  background:var(--csurface)!important; border-radius:3px!important; cursor:pointer!important; position:relative!important; }'
  + 'body.cafe input[type="checkbox"]:checked {'
  + '  background:var(--cgold)!important; border-color:var(--cgold)!important; }'
  + 'body.cafe input[type="checkbox"]:checked::after {'
  + '  content:"\\u2713";position:absolute;top:-2px;left:1px;color:#1a1410;font-weight:900;font-size:13px; }'

  /* --- Café: Tags/Badges --- */
  + 'body.cafe [class*="tag"]:not(#rmLoginOverlay *), body.cafe [class*="badge"]:not(#rmLoginOverlay *) {'
  + '  background:rgba(201,169,110,.1)!important; border:1px solid var(--cgold)!important;'
  + '  color:var(--cgold)!important; border-radius:3px!important; font-size:.6rem!important;'
  + '  font-weight:600!important; letter-spacing:.1em!important; }'

  /* --- Café: Tabs --- */
  + 'body.cafe [class*="tab"]:not(.rm-tb):not(#rmLoginOverlay *), body.cafe [role="tab"] {'
  + '  background:transparent!important; color:var(--cdim)!important;'
  + '  border:1px solid transparent!important; border-radius:4px!important;'
  + '  font-weight:600!important; font-size:.72rem!important; letter-spacing:.06em!important;'
  + '  padding:6px 14px!important; transition:all .2s ease!important; }'
  + 'body.cafe [class*="tab"].active:not(.rm-tb), body.cafe [class*="tab"][class*="active"]:not(.rm-tb),'
  + 'body.cafe [role="tab"][aria-selected="true"] {'
  + '  background:var(--cgold)!important; color:#1a1410!important; border-color:var(--cgold)!important; }'

  /* --- Café: Progress --- */
  + 'body.cafe [class*="progress"], body.cafe progress {'
  + '  background:var(--csurface)!important; border:1px solid var(--cborder)!important; border-radius:4px!important; }'
  + 'body.cafe [class*="progress"] [class*="fill"] {'
  + '  background:linear-gradient(90deg,var(--caccent),var(--cgold))!important;'
  + '  border-radius:3px!important; }'

  /* --- Café: Remove notebook paper --- */
  + 'body.cafe [class*="ruled"], body.cafe [class*="paper"], body.cafe [class*="notebook"], body.cafe [class*="lined"] {'
  + '  background-image:none!important; background:var(--ccard)!important; }'
  + 'body.cafe [class*="card"]::before, body.cafe [class*="card"]::after,'
  + 'body.cafe [class*="paper"]::before, body.cafe [class*="paper"]::after,'
  + 'body.cafe [class*="note"]::before, body.cafe [class*="note"]::after {'
  + '  background:none!important; background-image:none!important; border:none!important; display:none!important; }'

  /* --- Café: Notebook holes hidden --- */
  + 'body.cafe .nb-holes { display:none!important; }'
  + 'body.cafe .nb { border-left:2px solid rgba(201,169,110,.15)!important; }'
  + 'body.cafe .nb-body { background:var(--ccard)!important; background-image:none!important; }'
  + 'body.cafe .stat { background:var(--ccard)!important; background-image:none!important;'
  + '  border:1px solid var(--cborder)!important; border-radius:8px!important; }'
  + 'body.cafe .nb-body::before, body.cafe .nb-header::before { display:none!important; }'

  /* --- Café: Links --- */
  + 'body.cafe a:not(#rmLoginOverlay a) { color:var(--cgold)!important; }'
  + 'body.cafe a:hover { color:var(--cwarm)!important; }'

  /* --- Café: Dividers --- */
  + 'body.cafe hr, body.cafe [class*="divider"], body.cafe [class*="separator"] {'
  + '  border-color:var(--cborder)!important; background:var(--cborder)!important; }'

  /* --- Café: Tooltips --- */
  + 'body.cafe [class*="tooltip"], body.cafe [class*="popup"],'
  + 'body.cafe [class*="modal"]:not(#rmLoginOverlay), body.cafe [class*="dropdown"] {'
  + '  background:var(--csurface)!important; border:1px solid var(--cborder)!important;'
  + '  color:var(--ctext)!important; border-radius:6px!important; }'

  /* --- Café: Profile panel --- */
  + 'body.cafe .profile-panel {'
  + '  background:var(--csurface)!important; background-image:none!important;'
  + '  border-left:1px solid var(--cborder)!important; }'

  /* --- Café: Login box --- */
  + 'body.cafe .login-box {'
  + '  background:var(--ccard)!important; background-image:none!important;'
  + '  border:1px solid var(--cborder)!important; border-radius:8px!important; }'

  /* --- Café: Subtle grain texture overlay --- */
  + '@keyframes cafeGrain { 0%,100%{transform:translate(0,0)} 10%{transform:translate(-1%,-1%)} 30%{transform:translate(1%,0)} 50%{transform:translate(-1%,1%)} 70%{transform:translate(1%,-1%)} 90%{transform:translate(0,1%)} }'


  /* ========== THEME TOGGLE BUTTON ========== */
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
  + 'body.cafe .retro-toggle { font-family:"Cormorant Garamond",serif!important; font-size:.7rem!important;'
  + '  border:1px solid var(--caccent)!important; color:var(--cgold)!important;'
  + '  border-radius:4px!important; letter-spacing:.1em!important; font-weight:600!important; }'
  + 'body.cafe .retro-toggle:hover { background:var(--cgold)!important; color:#1a1410!important;'
  + '  border-color:var(--cgold)!important; }'

  /* ========== SMOOTH TRANSITIONS ========== */
  + 'body { transition:background .5s ease,color .5s ease; }'
  + '[class*="card"],[class*="Card"],header,nav,main,'
  + 'button,input,textarea,select,[class*="tab"] {'
  + '  transition:background .3s,color .3s,border-color .3s,box-shadow .3s; }'
  + '';
  document.head.appendChild(css);

  /* ===== THEME LOGIC ===== */
  var THEMES = ['comfy', 'retro-dark', 'cafe'];
  var THEME_LABELS = { 'comfy': 'RETRO', 'retro-dark': 'CAF\u00c9', 'retro-light': 'CAF\u00c9', 'cafe': 'COMFY' };

  function getTheme() { return localStorage.getItem(THEME_KEY) || 'comfy'; }
  function setTheme(t) { localStorage.setItem(THEME_KEY, t); }
  function isRetro() { var t = getTheme(); return t === 'retro-dark' || t === 'retro-light'; }
  function isCafe() { return getTheme() === 'cafe'; }

  function applyTheme(theme) {
    document.body.classList.remove('retro-dark','retro-light','retro-mode','cafe');
    if (theme === 'retro-dark') document.body.classList.add('retro-dark');
    else if (theme === 'retro-light') document.body.classList.add('retro-light');
    else if (theme === 'cafe') document.body.classList.add('cafe');
    setTheme(theme);
    updateToggleButtons(theme);
  }

  function updateToggleButtons(theme) {
    var label = THEME_LABELS[theme] || 'RETRO';
    document.querySelectorAll('.retro-toggle').forEach(function(btn) {
      btn.textContent = label;
    });
  }

  /* Toggle cycles: comfy -> retro-dark -> cafe -> comfy */
  window.toggleRetroMode = function(force) {
    if (typeof force === 'string') { applyTheme(force); return; }
    var current = getTheme();
    if (current === 'comfy') applyTheme('retro-dark');
    else if (isRetro()) applyTheme('cafe');
    else if (isCafe()) applyTheme('comfy');
    else applyTheme('retro-dark');
  };

  /* ===== HOOK EXISTING LIGHT/DARK BUTTONS ===== */
  function hookThemeButtons() {
    var themeToggle = document.getElementById('themeToggle');
    if (themeToggle && !themeToggle._rmHooked) {
      themeToggle._rmHooked = true;
      themeToggle.querySelectorAll('.theme-toggle-opt').forEach(function(opt) {
        opt.addEventListener('click', function() {
          var val = opt.getAttribute('data-theme-val');
          if (isRetro()) {
            if (val === 'light') applyTheme('retro-light');
            else if (val === 'dark') applyTheme('retro-dark');
            else applyTheme('retro-dark');
          }
        });
      });
    }
  }

  /* ===== INJECT TOGGLE BUTTON ===== */
  function injectToggleButton() {
    var bar = document.getElementById('rmProfileBar');
    if (bar && !bar.querySelector('.retro-toggle')) {
      var btn = document.createElement('button');
      btn.className = 'retro-toggle';
      btn.textContent = THEME_LABELS[getTheme()] || 'RETRO';
      btn.onclick = function() { window.toggleRetroMode(); };
      var sairBtn = bar.querySelector('.pb-logout');
      if (sairBtn) bar.insertBefore(btn, sairBtn);
      else bar.appendChild(btn);
      return;
    }
    var hubHeader = document.querySelector('.hub-header');
    if (hubHeader && !hubHeader.querySelector('.retro-toggle')) {
      var btn2 = document.createElement('button');
      btn2.className = 'retro-toggle';
      btn2.textContent = THEME_LABELS[getTheme()] || 'RETRO';
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

(function(){
  'use strict';

  var TOKEN_KEY = 'retromynd_token';
  var USER_KEY  = 'retromynd_user';
  var ACCOUNTS_KEY = 'retromynd_accounts';
  var OVERLAY_ID = 'rmLoginOverlay';
  var PROFILE_BAR_ID = 'rmProfileBar';
  var PROFILE_PANEL_ID = 'rmProfilePanel';

  var SYNC_MAP = {
    history:'lessonhistoryv1', quiz_history:'lessonquizv1',
    seen_quiz:'lessonseenquizidsv2', seen_coding:'lessonseencodingidsv2',
    gen_cycle:'lessongencycle'
  };

  function getToken()  { return localStorage.getItem(TOKEN_KEY); }
  function setToken(t) { localStorage.setItem(TOKEN_KEY, t); }
  function getUser()   { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch(e) { return null; } }
  function setUser(u)  { localStorage.setItem(USER_KEY, JSON.stringify(u)); }
  function clearAuth() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); }

  function getSavedAccounts() { try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || []; } catch(e) { return []; } }
  function saveAccount(user) {
    var a = getSavedAccounts();
    var i = a.findIndex(function(x){return x.email===user.email});
    var e = {email:user.email, name:user.name||'', avatar:user.avatar||'\uD83D\uDC95'};
    if(i>=0) a[i]=e; else a.push(e);
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(a.slice(-5)));
  }

  async function api(path, opts) {
    opts = opts || {};
    var token = getToken();
    var h = Object.assign({'Content-Type':'application/json'}, opts.headers||{});
    if(token) h['Authorization'] = 'Bearer '+token;
    var res = await fetch(path, Object.assign({}, opts, {headers:h}));
    var data = await res.json();
    if(!res.ok) {
      var msg = data.error||'Erro '+res.status;
      if(data.debug) msg += ' | '+data.debug;
      throw new Error(msg);
    }
    return data;
  }

  /* ===== NUKE OLD LOGIN ===== */
  function nukeOldLogin(user) {
    ['loginOverlay','login-overlay','loginSection','login-section'].forEach(function(id){
      var el = document.getElementById(id); if(el) el.style.display = 'none';
    });
    ['loginErr','loginEmail','loginName','loginPass'].forEach(function(id){
      var el = document.getElementById(id);
      if(el) {
        var c = el;
        while(c.parentElement && c.parentElement !== document.body) c = c.parentElement;
        if(c && c !== document.body) c.style.display = 'none';
      }
    });
    document.querySelectorAll('[onclick*="doLogin"],[onclick*="doRegister"]').forEach(function(el){
      var c = el;
      while(c.parentElement && c.parentElement !== document.body) c = c.parentElement;
      if(c && c !== document.body) c.style.display = 'none';
    });
    document.querySelectorAll('button, a, span, div, p').forEach(function(el) {
      var txt = el.textContent.trim();
      if (txt.match(/Entrar/) && txt.length < 20 && el.children.length <= 1) {
        if (user && user.name) {
          el.textContent = (user.avatar || '\uD83D\uDC95') + ' ' + user.name;
          el.style.cursor = 'pointer';
          el.onclick = function() { window._rmToggleProfile(); };
        } else {
          el.style.display = 'none';
        }
      }
      if (txt.match(/Cadastrar/) && txt.length < 25 && el.children.length <= 1) {
        el.style.display = 'none';
      }
    });
  }

  /* ===== LOGIN OVERLAY ===== */
  function createLoginOverlay() {
    if(document.getElementById(OVERLAY_ID)) return;
    var accounts = getSavedAccounts();
    var accHTML = '';
    if(accounts.length) {
      accHTML = '<div class="rm-slbl">Contas salvas</div>';
      accounts.forEach(function(a){
        accHTML += '<div class="rm-si" onclick="window._rmFill(\''+a.email.replace(/'/g,"\\\'")+'\')">'
          +'<span class="rm-sa">'+(a.avatar||'\uD83D\uDC95')+'</span>'
          +'<div><b>'+(a.name||a.email.split('@')[0])+'</b><div class="rm-se">'+a.email+'</div></div></div>';
      });
    }
    var o = document.createElement('div');
    o.id = OVERLAY_ID;
    o.innerHTML = '<style>'
      +'#'+OVERLAY_ID+'{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#fce4ec,#fff3e0 50%,#e8f5e9);font-family:Inter,sans-serif;transition:opacity .4s}'
      +'#'+OVERLAY_ID+'.out{opacity:0;pointer-events:none}'
      +'.rm-c{background:#fffef7;border:2px solid #e8d5b5;border-radius:16px;padding:2rem 1.5rem;width:92vw;max-width:380px;box-shadow:0 8px 32px rgba(0,0,0,.1);position:relative;overflow:hidden}'
      +'.rm-c::before{content:"";position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(transparent,transparent 27px,#f0e6d3 27px,#f0e6d3 28px);opacity:.3}'
      +'.rm-c>*{position:relative;z-index:1}'
      +'.rm-hd{text-align:center;margin-bottom:1rem}.rm-em{font-size:2rem}.rm-tt{font-size:2rem;color:#d4726a;margin:0;font-family:cursive}'
      +'.rm-tabs{display:flex;margin-bottom:1rem;border-radius:8px;overflow:hidden;border:2px solid #e8d5b5}'
      +'.rm-tb{flex:1;padding:.55rem;text-align:center;font-size:.75rem;font-weight:700;letter-spacing:.08em;cursor:pointer;background:#fff8f0;color:#b8a080;border:none;font-family:inherit;transition:all .2s}'
      +'.rm-tb.on{background:#f9a8b8;color:#fff}'
      +'.rm-slbl{text-align:center;font-size:.68rem;color:#b8a080;font-style:italic;margin-bottom:.4rem}'
      +'.rm-si{display:flex;align-items:center;gap:.5rem;padding:.45rem .6rem;background:rgba(200,220,240,.25);border-radius:8px;margin-bottom:.35rem;cursor:pointer;transition:background .15s}'
      +'.rm-si:hover{background:rgba(200,220,240,.45)}'
      +'.rm-sa{font-size:1rem}.rm-si b{font-size:.78rem;color:#5a4a3a;display:block}.rm-se{font-size:.62rem;color:#a0927e}'
      +'.rm-dv{text-align:center;font-size:.62rem;color:#b8a080;margin:.6rem 0;font-style:italic}'
      +'.rm-f{width:100%;padding:.55rem .7rem;border:1.5px solid #e0d5c5;border-radius:8px;font-size:.8rem;background:#fffef7;color:#5a4a3a;margin-bottom:.45rem;box-sizing:border-box;font-family:inherit;outline:none;transition:border .2s}'
      +'.rm-f:focus{border-color:#f9a8b8}.rm-f::placeholder{color:#c8b8a8}'
      +'.rm-bt{width:100%;padding:.6rem;border:none;border-radius:24px;font-size:.83rem;font-weight:700;cursor:pointer;font-family:inherit;transition:all .2s;margin-top:.5rem}'
      +'.rm-bt:active{transform:scale(.97)}'
      +'.rm-bl{background:linear-gradient(135deg,#f9a8b8,#f48fb1);color:#fff;box-shadow:0 3px 12px rgba(244,143,177,.4)}'
      +'.rm-br{background:linear-gradient(135deg,#81d4fa,#4fc3f7);color:#fff;box-shadow:0 3px 12px rgba(79,195,247,.4)}'
      +'.rm-er{text-align:center;font-size:.68rem;color:#e8477a;margin-top:.5rem;min-height:.9rem}'
      +'.rm-ft{text-align:center;font-size:.58rem;color:#b8a080;margin-top:.7rem}.rm-ft span{color:#f5c518}'
      +'.rm-v{display:none}.rm-v.on{display:block}'
      +'</style>'
      +'<div class="rm-c"><div class="rm-hd"><div class="rm-em">\uD83D\uDC95</div><h1 class="rm-tt">Study Hub</h1></div>'
      +'<div class="rm-tabs"><button class="rm-tb on" id="rmTL" onclick="window._rmTab(\'l\')">ENTRAR</button><button class="rm-tb" id="rmTR" onclick="window._rmTab(\'r\')">CADASTRAR</button></div>'
      +'<div class="rm-v on" id="rmVL">'
      +(accHTML?accHTML+'<div class="rm-dv">ou entre com email</div>':'')
      +'<input class="rm-f" id="rmLE" type="email" placeholder="Email"><input class="rm-f" id="rmLP" type="password" placeholder="Senha">'
      +'<button class="rm-bt rm-bl" onclick="window._rmLogin()">Entrar \uD83D\uDC95</button><div class="rm-er" id="rmLErr"></div></div>'
      +'<div class="rm-v" id="rmVR"><input class="rm-f" id="rmRE" type="email" placeholder="Email"><input class="rm-f" id="rmRN" type="text" placeholder="Seu nome"><input class="rm-f" id="rmRP" type="password" placeholder="Senha (min 6)">'
      +'<button class="rm-bt rm-br" onclick="window._rmReg()">Cadastrar \u26A1</button><div class="rm-er" id="rmRErr"></div></div>'
      +'<div class="rm-ft">Powered by <span>RetroMynd API</span> \u26A1</div></div>';
    document.body.appendChild(o);
    var lp=document.getElementById('rmLP'); if(lp) lp.onkeydown=function(e){if(e.key==='Enter')window._rmLogin();};
    var rp=document.getElementById('rmRP'); if(rp) rp.onkeydown=function(e){if(e.key==='Enter')window._rmReg();};
  }

  window._rmTab = function(t) {
    document.getElementById('rmTL').className = 'rm-tb'+(t==='l'?' on':'');
    document.getElementById('rmTR').className = 'rm-tb'+(t==='r'?' on':'');
    document.getElementById('rmVL').className = 'rm-v'+(t==='l'?' on':'');
    document.getElementById('rmVR').className = 'rm-v'+(t==='r'?' on':'');
  };
  window._rmFill = function(email) {
    var e=document.getElementById('rmLE'); if(e) e.value=email;
    var p=document.getElementById('rmLP'); if(p){p.value='';p.focus();}
  };
  window._rmLogin = async function() {
    var email=(document.getElementById('rmLE')||{}).value||'';
    var pass=(document.getElementById('rmLP')||{}).value||'';
    var err=document.getElementById('rmLErr');
    if(!email.trim()||!pass){if(err)err.textContent='Preencha email e senha';return;}
    try {
      if(err)err.textContent='Entrando...';
      var d = await api('/api/auth/login',{method:'POST',body:JSON.stringify({email:email.trim(),password:pass})});
      setToken(d.token); enterApp(d.user); syncDown();
    } catch(e){if(err)err.textContent=e.message;}
  };
  window._rmReg = async function() {
    var email=(document.getElementById('rmRE')||{}).value||'';
    var name=(document.getElementById('rmRN')||{}).value||'';
    var pass=(document.getElementById('rmRP')||{}).value||'';
    var err=document.getElementById('rmRErr');
    if(!email.trim()||!name.trim()||!pass){if(err)err.textContent='Preencha tudo';return;}
    if(pass.length<6){if(err)err.textContent='Senha min 6 chars';return;}
    try {
      if(err)err.textContent='Cadastrando...';
      var d = await api('/api/auth/register',{method:'POST',body:JSON.stringify({email:email.trim(),password:pass,name:name.trim()})});
      setToken(d.token); enterApp(d.user); syncUp();
    } catch(e){if(err)err.textContent=e.message;}
  };

  /* ===== PROFILE BAR ===== */
  function injectProfileBar(user) {
    if(document.getElementById(PROFILE_BAR_ID)) { updateProfileBar(user); return; }
    var bar = document.createElement('div');
    bar.id = PROFILE_BAR_ID;
    bar.innerHTML = '<style>'
      +'#'+PROFILE_BAR_ID+'{display:flex;align-items:center;gap:.6rem;padding:.45rem 1.2rem;background:#0a1628;border-bottom:2px solid #1e3a6e;font-family:Inter,sans-serif;position:relative;z-index:100}'
      +'.pb-avatar{font-size:1.4rem;cursor:pointer;transition:transform .2s}.pb-avatar:hover{transform:scale(1.2)}'
      +'.pb-info{flex:1;min-width:0}'
      +'.pb-name{font-size:.78rem;color:#f5c518;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
      +'.pb-meta{font-size:.58rem;color:#3a5a8a;font-family:"Space Mono",monospace}'
      +'.pb-meta span{color:#e8477a}'
      +'.pb-btn{background:none;border:1px solid #1e3a6e;color:#3a5a8a;font-size:.6rem;padding:3px 8px;cursor:pointer;font-family:"Space Mono",monospace;transition:all .15s;border-radius:2px}'
      +'.pb-btn:hover{border-color:#f5c518;color:#f5c518}'
      +'.pb-logout{color:#e8477a;border-color:rgba(232,71,122,.3)}.pb-logout:hover{border-color:#e8477a;color:#e8477a;background:rgba(232,71,122,.08)}'
      +'#'+PROFILE_PANEL_ID+'{display:none;position:fixed;top:0;right:0;width:320px;max-width:90vw;height:100vh;background:#0d1f3c;border-left:2px solid #1e3a6e;z-index:9999;overflow-y:auto;font-family:Inter,sans-serif;animation:ppSlide .25s ease;box-shadow:-4px 0 24px rgba(0,0,0,.5)}'
      +'#'+PROFILE_PANEL_ID+'.open{display:block}'
      +'@keyframes ppSlide{from{transform:translateX(100%)}to{transform:translateX(0)}}'
      +'.pp-header{text-align:center;padding:2rem 1.5rem 1rem;border-bottom:1px solid #1e3a6e}'
      +'.pp-avatar{font-size:3rem;margin-bottom:.5rem;cursor:pointer}'
      +'.pp-name{font-family:VT323,monospace;font-size:1.6rem;color:#f5c518;margin:0}'
      +'.pp-email{font-size:.7rem;color:#3a5a8a;margin-top:.15rem}'
      +'.pp-level{font-family:"Space Mono",monospace;font-size:.65rem;color:#e8477a;margin-top:.4rem}'
      +'.pp-section{padding:1rem 1.5rem;border-bottom:1px solid #1e3a6e}'
      +'.pp-label{font-size:.6rem;color:#3a5a8a;letter-spacing:.1em;font-weight:700;margin-bottom:.5rem;font-family:"Space Mono",monospace}'
      +'.pp-input{width:100%;padding:.5rem .7rem;background:#112244;border:1px solid #1e3a6e;color:#e8f0ff;font-size:.8rem;font-family:inherit;outline:none;box-sizing:border-box;border-radius:2px;margin-bottom:.4rem}'
      +'.pp-input:focus{border-color:#f5c518}'
      +'.pp-save{background:#f5c518;color:#000;border:none;padding:.5rem 1.2rem;font-size:.7rem;font-weight:700;cursor:pointer;font-family:"Space Mono",monospace;letter-spacing:.05em;margin-top:.3rem}'
      +'.pp-save:hover{background:#e6b800}'
      +'.pp-close{position:absolute;top:.8rem;right:1rem;background:none;border:none;color:#3a5a8a;font-size:1.2rem;cursor:pointer;padding:.3rem}'
      +'.pp-close:hover{color:#e8477a}'
      +'.pp-logout{display:block;width:100%;padding:.7rem;background:rgba(232,71,122,.08);border:1px solid rgba(232,71,122,.3);color:#e8477a;font-size:.75rem;font-weight:700;cursor:pointer;font-family:"Space Mono",monospace;text-align:center;margin-top:1rem;border-radius:2px}'
      +'.pp-logout:hover{background:rgba(232,71,122,.15)}'
      +'.pp-backdrop{display:none;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:9998}'
      +'.pp-backdrop.open{display:block}'
      +'</style>'
      +'<span class="pb-avatar" onclick="window._rmToggleProfile()" id="pbAvatar">'+(user.avatar||'\uD83D\uDC95')+'</span>'
      +'<div class="pb-info"><div class="pb-name" id="pbName">'+(user.name||'User')+'</div>'
      +'<div class="pb-meta">Lvl <span id="pbLevel">'+(user.level||1)+'</span> \u2022 '+(user.title||'Novato')+'</div></div>'
      +'<button class="pb-btn" onclick="window._rmToggleProfile()">PERFIL</button>'
      +'<button class="pb-btn pb-logout" onclick="window.doLogout()">SAIR</button>';
    document.body.insertBefore(bar, document.body.firstChild);

    var backdrop = document.createElement('div');
    backdrop.className = 'pp-backdrop'; backdrop.id = 'rmBackdrop';
    backdrop.onclick = function(){window._rmToggleProfile();};
    document.body.appendChild(backdrop);

    var panel = document.createElement('div');
    panel.id = PROFILE_PANEL_ID;
    panel.innerHTML = ''
      +'<button class="pp-close" onclick="window._rmToggleProfile()">\u2715</button>'
      +'<div class="pp-header">'
      +'<div class="pp-avatar" id="ppAvatar">'+(user.avatar||'\uD83D\uDC95')+'</div>'
      +'<div class="pp-name" id="ppName">'+(user.name||'')+'</div>'
      +'<div class="pp-email" id="ppEmail">'+(user.email||'')+'</div>'
      +'<div class="pp-level" id="ppLevel">Level '+(user.level||1)+' \u2022 '+(user.title||'Novato')+' \u2022 '+(user.xp||0)+' XP</div>'
      +'</div>'
      +'<div class="pp-section"><div class="pp-label">NOME</div>'
      +'<input class="pp-input" id="ppEditName" value="'+(user.name||'').replace(/"/g,'&quot;')+'"></div>'
      +'<div class="pp-section"><div class="pp-label">BIO</div>'
      +'<input class="pp-input" id="ppEditBio" value="'+(user.bio||'').replace(/"/g,'&quot;')+'" placeholder="Sobre voc\u00EA..."></div>'
      +'<div class="pp-section"><div class="pp-label">AVATAR (emoji)</div>'
      +'<input class="pp-input" id="ppEditAvatar" value="'+(user.avatar||'\uD83D\uDC95')+'" maxlength="4" style="font-size:1.5rem;text-align:center"></div>'
      +'<div class="pp-section"><button class="pp-save" onclick="window._rmSaveProfile()">SALVAR PERFIL</button>'
      +'<button class="pp-logout" onclick="window.doLogout()">SAIR DA CONTA</button></div>';
    document.body.appendChild(panel);
  }

  function updateProfileBar(user) {
    var el;
    el=document.getElementById('pbAvatar'); if(el) el.textContent=user.avatar||'\uD83D\uDC95';
    el=document.getElementById('pbName');   if(el) el.textContent=user.name||'User';
    el=document.getElementById('pbLevel');  if(el) el.textContent=user.level||1;
    el=document.getElementById('ppAvatar'); if(el) el.textContent=user.avatar||'\uD83D\uDC95';
    el=document.getElementById('ppName');   if(el) el.textContent=user.name||'';
    el=document.getElementById('ppEmail');  if(el) el.textContent=user.email||'';
    el=document.getElementById('ppLevel');  if(el) el.textContent='Level '+(user.level||1)+' \u2022 '+(user.title||'Novato')+' \u2022 '+(user.xp||0)+' XP';
  }

  window._rmToggleProfile = function() {
    var p = document.getElementById(PROFILE_PANEL_ID);
    var b = document.getElementById('rmBackdrop');
    if(p) p.classList.toggle('open');
    if(b) b.classList.toggle('open');
  };

  window._rmSaveProfile = async function() {
    var name = (document.getElementById('ppEditName')||{}).value||'';
    var bio = (document.getElementById('ppEditBio')||{}).value||'';
    var avatar = (document.getElementById('ppEditAvatar')||{}).value||'';
    try {
      var d = await api('/api/auth/profile',{method:'PUT',body:JSON.stringify({name:name.trim(),bio:bio.trim(),avatar:avatar.trim()})});
      setUser(d.user); saveAccount(d.user); updateProfileBar(d.user);
      window._rmToggleProfile();
    } catch(e){ alert('Erro: '+e.message); }
  };

  function enterApp(user) {
    setUser(user); saveAccount(user);
    var ov = document.getElementById(OVERLAY_ID);
    if(ov) { ov.classList.add('out'); setTimeout(function(){ov.remove();},500); }
    nukeOldLogin(user);
    injectProfileBar(user);
    loadRetroMode();
  }

  window.doLogout = function() {
    clearAuth();
    var bar=document.getElementById(PROFILE_BAR_ID); if(bar) bar.remove();
    var panel=document.getElementById(PROFILE_PANEL_ID); if(panel) panel.remove();
    var bd=document.getElementById('rmBackdrop'); if(bd) bd.remove();
    window.location.reload();
  };

  window.saveProfile = async function() {
    if(!getToken()) return;
    try {
      var u = getUser();
      var d = await api('/api/auth/profile',{method:'PUT',body:JSON.stringify({name:u.name,bio:u.bio,avatar:u.avatar})});
      setUser(d.user); saveAccount(d.user); updateProfileBar(d.user);
    } catch(e){}
  };

  /* ===== LOAD RETRO MODE ===== */
  function loadRetroMode() {
    if (document.getElementById('retro-mode-script')) return;
    var s = document.createElement('script');
    s.id = 'retro-mode-script';
    s.src = '/js/retro-mode.js';
    document.head.appendChild(s);
  }

  /* ===== SYNC ===== */
  async function syncUp() {
    if(!getToken()) return;
    for(var type in SYNC_MAP) {
      try { var r=localStorage.getItem(SYNC_MAP[type]);
        if(r) await api('/api/data/save',{method:'POST',body:JSON.stringify({data_type:type,data:JSON.parse(r)})});
      } catch(e){}
    }
  }
  async function syncDown() {
    if(!getToken()) return;
    try {
      var data = await api('/api/data/load');
      for(var type in SYNC_MAP) {
        if(data[type]&&data[type].data!=null) localStorage.setItem(SYNC_MAP[type],JSON.stringify(data[type].data));
      }
    } catch(e){}
  }
  setInterval(function(){if(getToken())syncUp();},60000);
  window.addEventListener('beforeunload',function(){
    if(!getToken())return;
    for(var type in SYNC_MAP) {
      try { var r=localStorage.getItem(SYNC_MAP[type]);
        if(r) fetch('/api/data/save',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+getToken()},body:JSON.stringify({data_type:type,data:JSON.parse(r)}),keepalive:true});
      } catch(e){}
    }
  });

  async function boot() {
    nukeOldLogin(null);
    if(getToken()) {
      try {
        var d = await api('/api/auth/me');
        enterApp(d.user);
        await syncDown();
        return;
      } catch(e){ clearAuth(); }
    }
    createLoginOverlay();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,100);});
  else setTimeout(boot,100);
})();

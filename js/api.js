(function(){
  'use strict';

  /* ========== CONFIG ========== */
  var TOKEN_KEY = 'retromynd_token';
  var USER_KEY  = 'retromynd_user';
  var ACCOUNTS_KEY = 'retromynd_accounts';
  var OVERLAY_ID = 'rmLoginOverlay';

  var SYNC_MAP = {
    history:      'lessonhistoryv1',
    quiz_history: 'lessonquizv1',
    seen_quiz:    'lessonseenquizidsv2',
    seen_coding:  'lessonseencodingidsv2',
    gen_cycle:    'lessongencycle'
  };

  /* ========== AUTH HELPERS ========== */
  function getToken()  { return localStorage.getItem(TOKEN_KEY); }
  function setToken(t) { localStorage.setItem(TOKEN_KEY, t); }
  function getUser()   { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch(e) { return null; } }
  function setUser(u)  { localStorage.setItem(USER_KEY, JSON.stringify(u)); }
  function clearAuth() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); }

  /* ========== SAVED ACCOUNTS ========== */
  function getSavedAccounts() {
    try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || []; } catch(e) { return []; }
  }
  function saveAccount(user) {
    var accounts = getSavedAccounts();
    var idx = accounts.findIndex(function(a) { return a.email === user.email; });
    var entry = { email: user.email, name: user.name || '', avatar: user.avatar || '\uD83D\uDC95' };
    if (idx >= 0) accounts[idx] = entry; else accounts.push(entry);
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts.slice(-5)));
  }

  /* ========== API ========== */
  async function api(path, opts) {
    opts = opts || {};
    var token = getToken();
    var h = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
    if (token) h['Authorization'] = 'Bearer ' + token;
    var res = await fetch(path, Object.assign({}, opts, { headers: h }));
    var data = await res.json();
    if (!res.ok) {
      var msg = data.error || 'Erro ' + res.status;
      if (data.debug) msg += ' | DEBUG: ' + data.debug;
      if (data.code) msg += ' | CODE: ' + data.code;
      throw new Error(msg);
    }
    return data;
  }

  /* ========== HIDE OLD STATIC LOGIN ========== */
  function hideOldLogin() {
    var ids = ['loginErr','loginEmail','loginName','loginPass'];
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el) {
        var container = el;
        while (container.parentElement && container.parentElement !== document.body) {
          container = container.parentElement;
        }
        if (container && container !== document.body) {
          container.style.display = 'none';
        }
        break;
      }
    }
  }

  /* ========== LOGIN OVERLAY UI ========== */
  function createLoginOverlay() {
    if (document.getElementById(OVERLAY_ID)) return;

    var accounts = getSavedAccounts();
    var accountsHTML = '';
    if (accounts.length > 0) {
      accountsHTML = '<div class="rm-saved-label">Contas salvas</div>';
      accounts.forEach(function(acc) {
        accountsHTML += '<div class="rm-saved-item" onclick="window._rmFillAccount(\'' + acc.email.replace(/'/g, "\\'") + '\')">'
          + '<span class="rm-saved-avatar">' + (acc.avatar || '\uD83D\uDC95') + '</span>'
          + '<div><strong>' + (acc.name || acc.email.split('@')[0]) + '</strong>'
          + '<div class="rm-saved-email">' + acc.email + '</div></div></div>';
      });
    }

    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.innerHTML = ''
      + '<style>'
      + '#' + OVERLAY_ID + '{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#fce4ec 0%,#fff3e0 50%,#e8f5e9 100%);font-family:Inter,sans-serif;transition:opacity .4s ease}'
      + '#' + OVERLAY_ID + '.rm-fadeout{opacity:0;pointer-events:none}'
      + '.rm-card{background:#fffef7;border:2px solid #e8d5b5;border-radius:16px;padding:2rem 1.5rem;width:92vw;max-width:380px;box-shadow:0 8px 32px rgba(0,0,0,.1);position:relative;overflow:hidden}'
      + '.rm-card::before{content:"";position:absolute;left:0;right:0;top:0;bottom:0;pointer-events:none;background:repeating-linear-gradient(transparent,transparent 27px,#f0e6d3 27px,#f0e6d3 28px);opacity:.35}'
      + '.rm-card>*{position:relative;z-index:1}'
      + '.rm-header{text-align:center;margin-bottom:1.2rem}'
      + '.rm-emoji{font-size:2rem;margin-bottom:.3rem}'
      + '.rm-title{font-family:"Dancing Script",cursive,Inter,sans-serif;font-size:2rem;color:#d4726a;margin:0}'
      + '.rm-tabs{display:flex;gap:0;margin-bottom:1.2rem;border-radius:8px;overflow:hidden;border:2px solid #e8d5b5}'
      + '.rm-tab{flex:1;padding:.55rem;text-align:center;font-size:.78rem;font-weight:700;letter-spacing:.08em;cursor:pointer;transition:all .2s;background:#fff8f0;color:#b8a080;border:none;font-family:inherit}'
      + '.rm-tab.active{background:#f9a8b8;color:#fff}'
      + '.rm-tab:first-child{border-right:1px solid #e8d5b5}'
      + '.rm-saved-label{text-align:center;font-size:.7rem;color:#b8a080;font-style:italic;margin-bottom:.5rem}'
      + '.rm-saved-item{display:flex;align-items:center;gap:.6rem;padding:.5rem .7rem;background:rgba(200,220,240,.25);border-radius:8px;margin-bottom:.4rem;cursor:pointer;transition:background .15s}'
      + '.rm-saved-item:hover{background:rgba(200,220,240,.45)}'
      + '.rm-saved-avatar{font-size:1.1rem}'
      + '.rm-saved-item strong{font-size:.8rem;color:#5a4a3a;display:block}'
      + '.rm-saved-email{font-size:.65rem;color:#a0927e}'
      + '.rm-divider{text-align:center;font-size:.65rem;color:#b8a080;margin:.7rem 0;font-style:italic}'
      + '.rm-field{width:100%;padding:.6rem .8rem;border:1.5px solid #e0d5c5;border-radius:8px;font-size:.82rem;background:#fffef7;color:#5a4a3a;margin-bottom:.5rem;box-sizing:border-box;font-family:inherit;outline:none;transition:border-color .2s}'
      + '.rm-field:focus{border-color:#f9a8b8}'
      + '.rm-field::placeholder{color:#c8b8a8}'
      + '.rm-actions{display:flex;gap:.6rem;margin-top:.8rem}'
      + '.rm-btn{flex:1;padding:.65rem;border:none;border-radius:24px;font-size:.85rem;font-weight:700;cursor:pointer;font-family:inherit;transition:all .2s;letter-spacing:.03em}'
      + '.rm-btn:active{transform:scale(.97)}'
      + '.rm-btn-login{background:linear-gradient(135deg,#f9a8b8,#f48fb1);color:#fff;box-shadow:0 3px 12px rgba(244,143,177,.4)}'
      + '.rm-btn-login:hover{box-shadow:0 4px 18px rgba(244,143,177,.6)}'
      + '.rm-btn-register{background:linear-gradient(135deg,#81d4fa,#4fc3f7);color:#fff;box-shadow:0 3px 12px rgba(79,195,247,.4)}'
      + '.rm-btn-register:hover{box-shadow:0 4px 18px rgba(79,195,247,.6)}'
      + '.rm-err{text-align:center;font-size:.7rem;color:#e8477a;margin-top:.6rem;min-height:1rem}'
      + '.rm-footer{text-align:center;font-size:.6rem;color:#b8a080;margin-top:.8rem}'
      + '.rm-footer span{color:#f5c518}'
      + '.rm-view{display:none}'
      + '.rm-view.active{display:block}'
      + '</style>'
      + '<div class="rm-card">'
      + '  <div class="rm-header"><div class="rm-emoji">\uD83D\uDC95</div><h1 class="rm-title">Study Hub</h1></div>'
      + '  <div class="rm-tabs">'
      + '    <button class="rm-tab active" id="rmTabLogin" onclick="window._rmSwitchTab(\'login\')">ENTRAR</button>'
      + '    <button class="rm-tab" id="rmTabRegister" onclick="window._rmSwitchTab(\'register\')">CADASTRAR</button>'
      + '  </div>'

      /* ---- LOGIN VIEW ---- */
      + '  <div class="rm-view active" id="rmViewLogin">'
      + (accountsHTML ? accountsHTML + '<div class="rm-divider">ou entre com outro email</div>' : '')
      + '    <input class="rm-field" id="rmLoginEmail" type="email" placeholder="Email" autocomplete="email">'
      + '    <input class="rm-field" id="rmLoginPass" type="password" placeholder="Senha" autocomplete="current-password">'
      + '    <div class="rm-actions"><button class="rm-btn rm-btn-login" onclick="window._rmDoLogin()">Entrar \uD83D\uDC95</button></div>'
      + '    <div class="rm-err" id="rmLoginErr"></div>'
      + '  </div>'

      /* ---- REGISTER VIEW ---- */
      + '  <div class="rm-view" id="rmViewRegister">'
      + '    <input class="rm-field" id="rmRegEmail" type="email" placeholder="Email" autocomplete="email">'
      + '    <input class="rm-field" id="rmRegName" type="text" placeholder="Seu nome (ex: Matheus)">'
      + '    <input class="rm-field" id="rmRegPass" type="password" placeholder="Senha (m\u00EDnimo 6)" autocomplete="new-password">'
      + '    <div class="rm-actions"><button class="rm-btn rm-btn-register" onclick="window._rmDoRegister()">Cadastrar \u26A1</button></div>'
      + '    <div class="rm-err" id="rmRegErr"></div>'
      + '  </div>'

      + '  <div class="rm-footer">Powered by <span>RetroMynd API</span> \u26A1</div>'
      + '</div>';

    document.body.appendChild(overlay);

    /* Enter key support */
    var lp = document.getElementById('rmLoginPass');
    if (lp) lp.addEventListener('keydown', function(e) { if (e.key === 'Enter') window._rmDoLogin(); });
    var rp = document.getElementById('rmRegPass');
    if (rp) rp.addEventListener('keydown', function(e) { if (e.key === 'Enter') window._rmDoRegister(); });
  }

  /* ========== TAB SWITCHING ========== */
  window._rmSwitchTab = function(tab) {
    var tl = document.getElementById('rmTabLogin');
    var tr = document.getElementById('rmTabRegister');
    var vl = document.getElementById('rmViewLogin');
    var vr = document.getElementById('rmViewRegister');
    if (tab === 'login') {
      tl.classList.add('active'); tr.classList.remove('active');
      vl.classList.add('active'); vr.classList.remove('active');
    } else {
      tr.classList.add('active'); tl.classList.remove('active');
      vr.classList.add('active'); vl.classList.remove('active');
    }
  };

  /* ========== FILL FROM SAVED ACCOUNT ========== */
  window._rmFillAccount = function(email) {
    var el = document.getElementById('rmLoginEmail');
    if (el) el.value = email;
    var p = document.getElementById('rmLoginPass');
    if (p) { p.value = ''; p.focus(); }
    var err = document.getElementById('rmLoginErr');
    if (err) err.textContent = 'Digite a senha \uD83D\uDD12';
  };

  /* ========== LOGIN ========== */
  window._rmDoLogin = async function() {
    var email = (document.getElementById('rmLoginEmail') || {}).value || '';
    var pass  = (document.getElementById('rmLoginPass')  || {}).value || '';
    var errEl = document.getElementById('rmLoginErr');
    email = email.trim();
    if (errEl) errEl.textContent = '';

    if (!email || !pass) { if (errEl) errEl.textContent = 'Preencha email e senha'; return; }

    try {
      if (errEl) errEl.textContent = 'Entrando...';
      var d = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email, password: pass })
      });
      setToken(d.token);
      enterApp(d.user);
      syncDown();
    } catch (err) {
      if (errEl) errEl.textContent = err.message;
    }
  };

  /* ========== REGISTER ========== */
  window._rmDoRegister = async function() {
    var email = (document.getElementById('rmRegEmail') || {}).value || '';
    var name  = (document.getElementById('rmRegName')  || {}).value || '';
    var pass  = (document.getElementById('rmRegPass')  || {}).value || '';
    var errEl = document.getElementById('rmRegErr');
    email = email.trim(); name = name.trim();
    if (errEl) errEl.textContent = '';

    if (!email || !name || !pass) { if (errEl) errEl.textContent = 'Preencha todos os campos'; return; }
    if (pass.length < 6) { if (errEl) errEl.textContent = 'Senha m\u00EDnimo 6 caracteres'; return; }

    try {
      if (errEl) errEl.textContent = 'Cadastrando...';
      var d = await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: email, password: pass, name: name })
      });
      setToken(d.token);
      enterApp(d.user);
      syncUp();
    } catch (err) {
      if (errEl) errEl.textContent = err.message;
    }
  };

  /* ========== ENTER APP ========== */
  function enterApp(user) {
    setUser(user);
    saveAccount(user);

    /* Fade out and remove overlay */
    var ov = document.getElementById(OVERLAY_ID);
    if (ov) {
      ov.classList.add('rm-fadeout');
      setTimeout(function() { ov.remove(); }, 500);
    }

    /* Set profile elements if they exist in app */
    var n = document.getElementById('profName');   if (n) n.textContent = user.name || '';
    var e = document.getElementById('profEmail');  if (e) e.textContent = user.email || '';
    var a = document.getElementById('profAvatar'); if (a) a.textContent = user.avatar || '\uD83D\uDC95';
    var b = document.getElementById('profBio');    if (b) b.textContent = user.bio || '';
  }

  function showLoginScreen() {
    clearAuth();
    var ov = document.getElementById(OVERLAY_ID);
    if (ov) ov.remove();
    createLoginOverlay();
  }

  /* ========== LOGOUT ========== */
  window.doLogout = function() {
    showLoginScreen();
  };

  /* ========== PROFILE UPDATE ========== */
  window.saveProfile = async function() {
    if (!getToken()) return;
    var name   = (document.getElementById('profName')   || {}).textContent || '';
    var bio    = (document.getElementById('profBio')    || {}).textContent || '';
    var avatar = (document.getElementById('profAvatar') || {}).textContent || '';
    try {
      var d = await api('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ name: name.trim(), bio: bio.trim(), avatar: avatar.trim() })
      });
      setUser(d.user);
      saveAccount(d.user);
    } catch (e) { console.warn('Profile save failed:', e.message); }
  };

  /* ========== DATA SYNC ========== */
  async function syncUp() {
    if (!getToken()) return;
    var keys = Object.keys(SYNC_MAP);
    for (var i = 0; i < keys.length; i++) {
      var type = keys[i];
      var key  = SYNC_MAP[type];
      try {
        var raw = localStorage.getItem(key);
        if (raw) {
          await api('/api/data/save', {
            method: 'POST',
            body: JSON.stringify({ data_type: type, data: JSON.parse(raw) })
          });
        }
      } catch (e) { console.warn('syncUp ' + type + ':', e.message); }
    }
  }

  async function syncDown() {
    if (!getToken()) return;
    try {
      var data = await api('/api/data/load');
      var keys = Object.keys(SYNC_MAP);
      for (var i = 0; i < keys.length; i++) {
        var type = keys[i];
        var key  = SYNC_MAP[type];
        if (data[type] && data[type].data != null) {
          localStorage.setItem(key, JSON.stringify(data[type].data));
        }
      }
    } catch (e) { console.warn('syncDown:', e.message); }
  }

  /* ========== PERIODIC SYNC ========== */
  setInterval(function() {
    if (getToken()) syncUp();
  }, 60000);

  /* ========== SYNC ON PAGE CLOSE ========== */
  window.addEventListener('beforeunload', function() {
    if (!getToken()) return;
    var keys = Object.keys(SYNC_MAP);
    for (var i = 0; i < keys.length; i++) {
      var type = keys[i];
      var key  = SYNC_MAP[type];
      try {
        var raw = localStorage.getItem(key);
        if (raw) {
          fetch('/api/data/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() },
            body: JSON.stringify({ data_type: type, data: JSON.parse(raw) }),
            keepalive: true
          });
        }
      } catch (e) {}
    }
  });

  /* ========== BOOT ========== */
  async function boot() {
    hideOldLogin();

    if (getToken()) {
      try {
        var d = await api('/api/auth/me');
        enterApp(d.user);
        await syncDown();
        return;
      } catch (e) {
        clearAuth();
      }
    }

    createLoginOverlay();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(boot, 100); });
  } else {
    setTimeout(boot, 100);
  }

})();

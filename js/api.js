(function(){
  'use strict';

  /* ========== CONFIG ========== */
  var TOKEN_KEY = 'retromynd_token';
  var USER_KEY  = 'retromynd_user';
  var ACCOUNTS_KEY = 'retromynd_accounts';

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
      if (data.hint) msg += ' | HINT: ' + data.hint;
      if (data.code) msg += ' | CODE: ' + data.code;
      throw new Error(msg);
    }
    return data;
  }

  /* ========== UI HELPERS ========== */
  function showErr(msg) {
    var e = document.getElementById('loginErr');
    if (e) { e.textContent = msg; e.style.fontSize = '11px'; }
  }

  /* Find the login container by traversing up from known child elements */
  function findLoginContainer() {
    var anchor = document.getElementById('loginOverlay')
              || document.getElementById('login-overlay')
              || document.getElementById('loginSection')
              || document.getElementById('login-section');
    if (anchor) return anchor;

    /* Traverse from known login form elements */
    var child = document.getElementById('loginErr')
             || document.getElementById('loginEmail')
             || document.getElementById('loginName')
             || document.getElementById('loginPass');
    if (!child) return null;

    var el = child;
    while (el.parentElement && el.parentElement !== document.body) {
      el = el.parentElement;
    }
    return (el && el !== document.body) ? el : null;
  }

  function enterApp(user) {
    setUser(user);
    saveAccount(user);

    /* Hide login section */
    var ov = findLoginContainer();
    if (ov) {
      ov.style.display = 'none';
    } else {
      /* Fallback: reload page (autoLogin will handle it) */
      if (!sessionStorage.getItem('retromynd_reloaded')) {
        sessionStorage.setItem('retromynd_reloaded', '1');
        window.location.reload();
        return;
      }
    }
    sessionStorage.removeItem('retromynd_reloaded');

    /* Show app content (in case anything is hidden) */
    var header = document.querySelector('header');
    if (header) header.style.display = '';
    var navTabs = document.querySelector('.nav-tabs');
    if (navTabs) navTabs.style.display = '';
    var views = document.querySelectorAll('.view');
    views.forEach(function(v) { v.style.removeProperty('display'); });

    /* Set profile elements if they exist */
    var n = document.getElementById('profName');   if (n) n.textContent = user.name || '';
    var e = document.getElementById('profEmail');  if (e) e.textContent = user.email || '';
    var a = document.getElementById('profAvatar'); if (a) a.textContent = user.avatar || '\uD83D\uDC95';
    var b = document.getElementById('profBio');    if (b) b.textContent = user.bio || '';
  }

  function showLoginScreen() {
    clearAuth();
    var ov = findLoginContainer();
    if (ov) {
      ov.style.display = '';
    } else {
      window.location.reload();
    }
  }

  /* ========== REGISTER ========== */
  window.doRegister = async function() {
    var email = (document.getElementById('loginEmail') || {}).value || '';
    var name  = (document.getElementById('loginName')  || {}).value || '';
    var pass  = (document.getElementById('loginPass')  || {}).value || '';
    email = email.trim(); name = name.trim();
    showErr('');

    if (!email || !name || !pass) { showErr('Preencha todos os campos'); return; }
    if (pass.length < 6) { showErr('Senha m\u00EDnimo 6 caracteres'); return; }

    try {
      showErr('Cadastrando...');
      var d = await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: email, password: pass, name: name })
      });
      setToken(d.token);
      enterApp(d.user);
      syncUp();
    } catch (err) {
      showErr(err.message);
    }
  };

  /* ========== LOGIN ========== */
  window.doLogin = async function() {
    var email = (document.getElementById('loginEmail') || {}).value || '';
    var pass  = (document.getElementById('loginPass')  || {}).value || '';
    email = email.trim();
    showErr('');

    if (!email || !pass) { showErr('Preencha email e senha'); return; }

    try {
      showErr('Entrando...');
      var d = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email, password: pass })
      });
      setToken(d.token);
      enterApp(d.user);
      syncDown();
    } catch (err) {
      showErr(err.message);
    }
  };

  /* ========== LOGIN WITH SAVED ACCOUNT ========== */
  window.loginWithAccount = function(email) {
    var emailEl = document.getElementById('loginEmail');
    if (emailEl) emailEl.value = email;
    var nameEl = document.getElementById('loginName');
    if (nameEl) nameEl.value = '';
    var passEl = document.getElementById('loginPass');
    if (passEl) { passEl.value = ''; passEl.focus(); }
    showErr('Digite a senha para entrar');
  };

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

  /* ========== AUTO-LOGIN ON LOAD ========== */
  async function autoLogin() {
    if (!getToken()) return;
    try {
      var d = await api('/api/auth/me');
      enterApp(d.user);
      await syncDown();
    } catch (e) {
      clearAuth();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(autoLogin, 200); });
  } else {
    setTimeout(autoLogin, 200);
  }

})();

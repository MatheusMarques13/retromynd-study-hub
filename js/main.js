// =============================================================================
// MAIN.JS - RetroMynd Study Hub
// =============================================================================

(function() {
  'use strict';
  const $ = id => document.getElementById(id);

  // ═══ PERSISTENCE LAYER ═══
  const store = {
    _dirty: new Set(),
    _saving: false,
    _retryCount: 0,
    _maxRetries: 5,
    _lastSyncOk: false,
    _lastFlushOk: true,
    _localModifiedAt: 0,
    _serverConfirmedAt: 0,

    get(key, fallback) {
      try {
        const raw = localStorage.getItem('rms_' + key);
        return raw ? JSON.parse(raw) : fallback;
      } catch { return fallback; }
    },

    set(key, value, sync = true) {
      localStorage.setItem('rms_' + key, JSON.stringify(value));
      if (sync) {
        this._dirty.add(key);
        this._localModifiedAt = Date.now();
        this._debouncedFlush();
      }
    },

    getRaw(key, fallback) {
      const v = localStorage.getItem('rms_' + key);
      return v != null ? v : fallback;
    },

    setRaw(key, value, sync = true) {
      localStorage.setItem('rms_' + key, String(value));
      if (sync) {
        this._dirty.add(key);
        this._localModifiedAt = Date.now();
        this._debouncedFlush();
      }
    },

    _flushTimer: null,
    _debouncedFlush() {
      clearTimeout(this._flushTimer);
      this._flushTimer = setTimeout(() => this.flush(), 1500);
    },

    flushNow() {
      clearTimeout(this._flushTimer);
      return this.flush();
    },

    _serverMap: {
      goals:        () => ({ type: 'goals',  data: store.get('goals', []) }),
      notes:        () => ({ type: 'notes',  data: store.get('notes', []) }),
      pomodoros:    () => ({ type: 'timer',  data: { pomodoros: parseInt(store.getRaw('pomodoros', '0')), totalMinutes: 0 } }),
      streak:       () => ({ type: 'streak', data: { current: parseInt(store.getRaw('streak', '0')), best: parseInt(store.getRaw('streak', '0')), days: store.get('streak_days', {}) } }),
      streak_days:  () => ({ type: 'streak', data: { current: parseInt(store.getRaw('streak', '0')), best: parseInt(store.getRaw('streak', '0')), days: store.get('streak_days', {}) } }),
      lessons:      () => ({ type: 'lessons', data: store.get('lessons', { completed: [], history: [] }) }),
    },

    async flush() {
      if (this._saving || !auth || !auth.isAuthenticated() || this._dirty.size === 0) return;
      this._saving = true;
      const ops = new Map();
      const dirtyKeys = [...this._dirty];
      for (const key of dirtyKeys) {
        const mapper = this._serverMap[key];
        if (mapper) {
          const { type, data } = mapper();
          ops.set(type, data);
        }
      }
      this._dirty.clear();

      let allOk = true;
      for (const [type, data] of ops) {
        try {
          await auth.saveData(type, data);
          this._retryCount = 0;
          this._serverConfirmedAt = Date.now();
        } catch (e) {
          allOk = false;
          for (const key of dirtyKeys) {
            const mapper = this._serverMap[key];
            if (mapper && mapper().type === type) this._dirty.add(key);
          }
          if (e.message && (e.message.includes('401') || e.message.toLowerCase().includes('token') || e.message.toLowerCase().includes('expirado'))) {
            showSaveStatus('error', 'Sessão expirada! Faça login novamente.');
            break;
          }
        }
      }

      this._saving = false;
      this._lastFlushOk = allOk;
      this._lastSyncOk = allOk;

      if (allOk && ops.size > 0) {
        showSaveStatus('ok', 'Salvo na nuvem ✓');
      }

      if (this._dirty.size > 0) {
        this._retryCount++;
        if (this._retryCount <= this._maxRetries) {
          const delay = Math.min(2000 * Math.pow(2, this._retryCount - 1), 30000);
          setTimeout(() => this.flush(), delay);
        } else {
          showSaveStatus('error', 'Falha ao salvar na nuvem. Dados salvos localmente.');
        }
      }
    },

    flushSync() {
      if (!auth || !auth.isAuthenticated() || this._dirty.size === 0) return;
      const ops = new Map();
      for (const key of this._dirty) {
        const mapper = this._serverMap[key];
        if (mapper) {
          const { type, data } = mapper();
          ops.set(type, data);
        }
      }
      this._dirty.clear();
      for (const [type, data] of ops) {
        try {
          const token = localStorage.getItem('token');
          if (!token) continue;
          const blob = new Blob([JSON.stringify({ data_type: type, data })], { type: 'application/json' });
          navigator.sendBeacon('/api/data/save?token=' + encodeURIComponent(token), blob);
        } catch (e) { /* best effort */ }
      }
    }
  };
  window._store = store;

  window.addEventListener('beforeunload', () => {
    store.flushSync();
  });
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') store.flushNow();
  });
  setInterval(() => { if (store._dirty.size > 0) store.flush(); }, 30000);

  // ═══ SAVE STATUS INDICATOR ═══
  function showSaveStatus(type, msg) {
    let el = $('saveStatus');
    if (!el) {
      el = document.createElement('div');
      el.id = 'saveStatus';
      el.style.cssText = 'position:fixed;bottom:16px;right:16px;padding:8px 16px;border-radius:8px;font-family:Kalam,cursive;font-size:14px;z-index:9999;transition:all .3s;opacity:0;transform:translateY(10px);pointer-events:none;max-width:90vw;word-break:break-word;';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    if (type === 'ok') { el.style.background = '#D1FAE5'; el.style.color = '#059669'; }
    else if (type === 'error') { el.style.background = '#FEE2E2'; el.style.color = '#DC2626'; el.style.pointerEvents = 'auto'; }
    else { el.style.background = '#FEF3C7'; el.style.color = '#D97706'; }
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(10px)'; }, type === 'error' ? 8000 : 3000);
  }
  window.showSaveStatus = showSaveStatus;

  // ═══ PROFILE PANEL ═══
  function initProfilePanel() {
    const trigger = $('profileTrigger');
    const panel = $('ppPanel');
    const overlay = $('ppOverlay');
    const closeBtn = $('ppClose');
    const logoutBtn = $('ppLogout');
    const avatarBig = $('ppAvatarBig');
    const avatarGrid = $('ppAvatarGrid');

    if (trigger) trigger.onclick = () => openProfile();
    if (closeBtn) closeBtn.onclick = () => closeProfile();
    if (overlay) overlay.onclick = () => closeProfile();
    if (logoutBtn) logoutBtn.onclick = () => {
      showSaveStatus('warn', 'Salvando antes de sair...');
      store.flushNow().then(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('rms_user');
        window.location.href = '/login.html';
      }).catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('rms_user');
        window.location.href = '/login.html';
      });
    };

    const avatars = ['💖','🎮','🧠','🔥','⭐','🌙','🎵','🦊','🐱','🌸','💜','🎯','🍀','🌈','✨','🎪'];
    if (avatarGrid) {
      avatarGrid.innerHTML = avatars.map(a => `<span class="pp-avatar-opt" onclick="window.pickAvatar('${a}')">${a}</span>`).join('');
    }
    if (avatarBig) avatarBig.onclick = () => { if (avatarGrid) avatarGrid.classList.toggle('open'); };

    const ppName = $('ppName');
    const ppBio = $('ppBio');
    if (ppName) ppName.onblur = () => saveProfile();
    if (ppBio) ppBio.onblur = () => saveProfile();
  }

  function openProfile() {
    const panel = $('ppPanel'), overlay = $('ppOverlay');
    if (panel) panel.classList.add('open');
    if (overlay) overlay.classList.add('open');
    const user = auth ? auth.getUser() : null;
    if (user) {
      const ppName = $('ppName'), ppEmail = $('ppEmail'), ppBio = $('ppBio'), ppAvatarBig = $('ppAvatarBig'), ppSince = $('ppSince'), ppStats = $('ppStats');
      if (ppName) ppName.value = user.name || '';
      if (ppEmail) ppEmail.textContent = user.email || '';
      if (ppBio) ppBio.value = user.bio || localStorage.getItem('rms_bio') || '';
      if (ppAvatarBig) ppAvatarBig.textContent = user.avatar || localStorage.getItem('rms_avatar') || '💖';
      if (ppSince) ppSince.textContent = user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'Hoje';
      const goals = getGoals(), notes = getNotes();
      const streak = parseInt(store.getRaw('streak', '0')), pomos = parseInt(store.getRaw('pomodoros', '0'));
      if (ppStats) ppStats.innerHTML = `
        <div class="pp-stat-card"><div class="pp-stat-num" style="color:var(--pink)">${streak}</div><div class="pp-stat-lbl">Streak</div></div>
        <div class="pp-stat-card"><div class="pp-stat-num" style="color:var(--blue)">${notes.length}</div><div class="pp-stat-lbl">Notas</div></div>
        <div class="pp-stat-card"><div class="pp-stat-num" style="color:var(--lavender)">${goals.length}</div><div class="pp-stat-lbl">Metas</div></div>
        <div class="pp-stat-card"><div class="pp-stat-num" style="color:var(--mint)">${pomos}</div><div class="pp-stat-lbl">Pomodoros</div></div>
      `;
    }
  }

  function closeProfile() {
    const panel = $('ppPanel'), overlay = $('ppOverlay');
    if (panel) panel.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  }

  window.pickAvatar = function(emoji) {
    const ppAvatarBig = $('ppAvatarBig'), headerAvatar = $('headerAvatar');
    if (ppAvatarBig) ppAvatarBig.textContent = emoji;
    if (headerAvatar) headerAvatar.textContent = emoji;
    localStorage.setItem('rms_avatar', emoji);
    const grid = $('ppAvatarGrid'); if (grid) grid.classList.remove('open');
    const user = auth ? auth.getUser() : null;
    if (user) { user.avatar = emoji; localStorage.setItem('rms_user', JSON.stringify(user)); }
  };

  function saveProfile() {
    const ppName = $('ppName'), ppBio = $('ppBio');
    const name = ppName ? ppName.value : '', bio = ppBio ? ppBio.value : '';
    localStorage.setItem('rms_bio', bio);
    const user = auth ? auth.getUser() : null;
    if (user) {
      user.name = name; user.bio = bio;
      localStorage.setItem('rms_user', JSON.stringify(user));
      const headerName = $('headerName');
      if (headerName) headerName.textContent = name || user.email || 'Estudante';
    }
    if (auth && auth.updateProfile) auth.updateProfile({ name, bio }).catch(() => {});
  }

  // ═══ SHOW HUB ═══
  async function showHub() {
    const hub = $('hub');
    if (hub) { hub.style.display = 'block'; hub.classList.add('show'); }
    const user = auth ? auth.getUser() : null;
    if (user) {
      const headerName = $('headerName'), headerAvatar = $('headerAvatar');
      if (headerName) headerName.textContent = user.name || user.email || 'Estudante';
      if (headerAvatar) headerAvatar.textContent = user.avatar || localStorage.getItem('rms_avatar') || '💖';
    }
    updateDate();
    initProfilePanel();
    try { initPomodoro(); } catch(e) {}
    try { initGoals(); } catch(e) { console.error('[Goals] Init error:', e); }
    try { initNotes(); } catch(e) {}
    try { initStreak(); } catch(e) {}
    try { initRetroLesson(); } catch(e) {}
    loadStats();
    syncFromServer();
  }
  window.showHub = showHub;

  // ═══ SYNC FROM SUPABASE ═══
  async function syncFromServer(attempt) {
    attempt = attempt || 1;
    const maxAttempts = 3;

    if (!auth || !auth.isAuthenticated()) return;

    try {
      if (attempt === 1) showSaveStatus('warn', 'Sincronizando...');

      const token = localStorage.getItem('token');
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const resp = await fetch('/api/data/load', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (!resp.ok) {
        if (resp.status === 401) { showSaveStatus('error', 'Sessão expirada!'); return; }
        throw new Error(`HTTP ${resp.status}`);
      }

      const allData = await resp.json();
      if (!allData || typeof allData !== 'object') { showSaveStatus('ok', 'Conectado ✓'); return; }

      let loaded = 0;
      let needsResync = false;

      // GOALS SYNC
      if (allData.goals && allData.goals.data && Array.isArray(allData.goals.data)) {
        const serverGoals = allData.goals.data;
        const localGoals = store.get('goals', []);

        if (localGoals.length === 0 && serverGoals.length > 0) {
          store.set('goals', serverGoals, false);
          loaded++;
        } else if (localGoals.length > 0 && serverGoals.length === 0) {
          needsResync = true;
          store._dirty.add('goals');
        } else if (localGoals.length > 0 && serverGoals.length > 0) {
          const merged = new Map();
          serverGoals.forEach(g => merged.set(g.id, g));
          let hasNew = false;
          localGoals.forEach(g => {
            if (!merged.has(g.id)) hasNew = true;
            merged.set(g.id, g);
          });
          const result = Array.from(merged.values());
          store.set('goals', result, false);
          if (hasNew || result.length !== serverGoals.length) {
            needsResync = true;
            store._dirty.add('goals');
          }
          loaded++;
        }
      } else if (store.get('goals', []).length > 0) {
        needsResync = true;
        store._dirty.add('goals');
      }

      // NOTES SYNC
      if (allData.notes && allData.notes.data && Array.isArray(allData.notes.data)) {
        const serverNotes = allData.notes.data;
        const localNotes = store.get('notes', []);

        if (localNotes.length === 0 && serverNotes.length > 0) {
          store.set('notes', serverNotes, false);
          loaded++;
        } else if (localNotes.length > 0 && serverNotes.length === 0) {
          needsResync = true;
          store._dirty.add('notes');
        } else if (localNotes.length > 0 && serverNotes.length > 0) {
          const merged = new Map();
          serverNotes.forEach(n => merged.set(n.id, n));
          let hasNew = false;
          localNotes.forEach(n => {
            if (!merged.has(n.id)) hasNew = true;
            merged.set(n.id, n);
          });
          const result = Array.from(merged.values());
          store.set('notes', result, false);
          if (hasNew || result.length !== serverNotes.length) {
            needsResync = true;
            store._dirty.add('notes');
          }
          loaded++;
        }
      } else if (store.get('notes', []).length > 0) {
        needsResync = true;
        store._dirty.add('notes');
      }

      // TIMER
      if (allData.timer && allData.timer.data) {
        const d = allData.timer.data;
        if (d.pomodoros != null) {
          const localP = parseInt(store.getRaw('pomodoros', '0'));
          if (d.pomodoros > localP) { store.setRaw('pomodoros', d.pomodoros, false); loaded++; }
          else if (localP > d.pomodoros) { needsResync = true; store._dirty.add('pomodoros'); }
        }
      }

      // LESSONS SYNC
      if (allData.lessons && allData.lessons.data) {
        const serverLessons = allData.lessons.data;
        const localLessons = store.get('lessons', { completed: [], history: [] });
        // Merge completed lessons by id (local wins on conflict)
        const merged = new Map();
        (serverLessons.completed || []).forEach(l => merged.set(l.id, l));
        (localLessons.completed || []).forEach(l => merged.set(l.id, l));
        const result = {
          completed: Array.from(merged.values()),
          history: [...(serverLessons.history || []), ...(localLessons.history || [])]
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
            .filter((v, i, a) => a.findIndex(t => t.id === v.id && t.timestamp === v.timestamp) === i)
        };
        store.set('lessons', result, false);
        if (result.completed.length > (serverLessons.completed || []).length) {
          needsResync = true;
          store._dirty.add('lessons');
        }
        if (result.completed.length > 0) loaded++;
      } else if (store.get('lessons', { completed: [], history: [] }).completed.length > 0) {
        needsResync = true;
        store._dirty.add('lessons');
      }

      // STREAK
      if (allData.streak && allData.streak.data) {
        const d = allData.streak.data;
        if (d.days && typeof d.days === 'object') {
          const localDays = store.get('streak_days', {});
          const merged = { ...d.days, ...localDays };
          store.set('streak_days', merged, false);
          if (Object.keys(merged).length > Object.keys(d.days).length) {
            needsResync = true; store._dirty.add('streak_days');
          }
          if (Object.keys(merged).length > 0) loaded++;
        }
        if (d.current != null) store.setRaw('streak', d.current, false);
      }

      store._lastSyncOk = true;
      if (loaded > 0) showSaveStatus('ok', 'Dados sincronizados ✓');
      else showSaveStatus('ok', 'Conectado ✓');

      if (loaded > 0) {
        loadStats();
        try { renderGoals(); } catch(e) {}
        try { renderNotesList(); } catch(e) {}
      }

      if (needsResync) {
        setTimeout(() => store.flush(), 300);
      }

    } catch(e) {
      if (attempt < maxAttempts && (e.name === 'AbortError' || e.name === 'TypeError' || e.message.includes('500'))) {
        await new Promise(r => setTimeout(r, 1000 * attempt));
        return syncFromServer(attempt + 1);
      }
      store._lastSyncOk = false;
      if (e.name === 'AbortError') showSaveStatus('error', 'Timeout. Dados locais OK.');
      else if (e.name === 'TypeError') showSaveStatus('error', 'Sem internet — dados locais OK');
      else showSaveStatus('error', 'Erro sync: ' + e.message.substring(0, 60));
    }
  }

  // ═══ DATE ═══
  function updateDate() {
    const el = $('dateD'); if (!el) return;
    const d = new Date();
    const dias = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
    const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    el.textContent = `${dias[d.getDay()]}, ${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
  }

  // ═══ STATS ═══
  function loadStats() {
    const goals = getGoals(), notes = getNotes();
    const streak = parseInt(store.getRaw('streak', '0'));
    const pomos = parseInt(store.getRaw('pomodoros', '0'));
    const lessons = store.get('lessons', { completed: [], history: [] });
    const todayKey = localDateKey(new Date());
    const todayGoals = goals.filter(g => localDateKey(new Date(g.date)) === todayKey);
    const doneGoals = todayGoals.filter(g => g.done).length;
    const sS = $('sS'); if (sS) sS.textContent = streak;
    const sN = $('sN'); if (sN) sN.textContent = notes.length;
    const sG = $('sG'); if (sG) sG.textContent = `${doneGoals}/${todayGoals.length}`;
    const sP = $('sP'); if (sP) sP.textContent = pomos;
    const sL = $('sL'); if (sL) sL.textContent = (lessons.completed || []).length;
  }
  window.loadStats = loadStats;

  function localDateKey(d) {
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }

  // ═══ POMODORO ═══
  let pomTimer = null, pomSec = 25 * 60, pomRunning = false, pomMode = 25;

  function initPomodoro() {
    document.querySelectorAll('.tm-btn[data-min]').forEach(btn => {
      btn.onclick = () => {
        pomMode = parseInt(btn.dataset.min); pomSec = pomMode * 60;
        pomRunning = false; clearInterval(pomTimer); updateTimerDisplay();
        document.querySelectorAll('.tm-btn[data-min]').forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
        const tB = $('tB'); if (tB) tB.textContent = 'Iniciar';
        const tL = $('tL'); if (tL) tL.textContent = pomMode <= 15 ? 'BREAK TIME' : 'FOCUS MODE';
      };
    });
    const tB = $('tB'); if (tB) tB.onclick = toggleTimer;
    const tR = $('tReset'); if (tR) tR.onclick = resetTimer;
    updateTimerDisplay();
  }

  function toggleTimer() {
    if (pomRunning) {
      clearInterval(pomTimer); pomRunning = false;
      const tB = $('tB'); if (tB) tB.textContent = 'Continuar';
    } else {
      pomRunning = true;
      const tB = $('tB'); if (tB) tB.textContent = 'Pausar';
      pomTimer = setInterval(() => {
        pomSec--;
        if (pomSec <= 0) {
          clearInterval(pomTimer); pomRunning = false; pomSec = 0;
          const tB = $('tB'); if (tB) tB.textContent = 'Iniciar';
          if (pomMode >= 25) {
            const p = parseInt(store.getRaw('pomodoros', '0')) + 1;
            store.setRaw('pomodoros', p);
            loadStats();
            store.flushNow();
          }
        }
        updateTimerDisplay();
      }, 1000);
    }
  }

  function resetTimer() {
    clearInterval(pomTimer); pomRunning = false; pomSec = pomMode * 60;
    updateTimerDisplay();
    const tB = $('tB'); if (tB) tB.textContent = 'Iniciar';
  }

  function updateTimerDisplay() {
    const m = Math.floor(pomSec / 60), s = pomSec % 60;
    const tD = $('tD'); if (tD) tD.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  // ═══ GOALS ═══
  let goalTab = 'today';
  let goalFilter = 'a';
  let goalPage = 1;
  const GOALS_PER_PAGE = 8;

  function getGoals() {
    return store.get('goals', []);
  }

  function saveGoals(goals) {
    store.set('goals', goals);
    localStorage.setItem('rms_goals', JSON.stringify(goals));
    store._dirty.add('goals');
    store._localModifiedAt = Date.now();
    loadStats();
    store.flushNow().catch(function(){});
  }

  function initGoals() {
    const addBtn = $('goalAddBtn');
    const input = $('goalInput');
    if (addBtn) addBtn.onclick = addGoal;
    if (input) input.onkeydown = e => { if (e.key === 'Enter') addGoal(); };

    const gtC = $('gtC'), gtH = $('gtH');
    if (gtC) gtC.onclick = () => { goalTab = 'today'; goalPage = 1; renderGoalTabs(); };
    if (gtH) gtH.onclick = () => { goalTab = 'history'; goalPage = 1; renderGoalTabs(); };

    document.querySelectorAll('#goalFilters .goal-filter').forEach(btn => {
      btn.onclick = () => {
        goalFilter = btn.dataset.f; goalPage = 1;
        document.querySelectorAll('#goalFilters .goal-filter').forEach(b => b.classList.remove('on'));
        btn.classList.add('on'); renderHistory();
      };
    });

    const pgPrev = $('pgPrev'), pgNext = $('pgNext');
    if (pgPrev) pgPrev.onclick = () => { if (goalPage > 1) { goalPage--; renderGoals(); } };
    if (pgNext) pgNext.onclick = () => { goalPage++; renderGoals(); };

    renderGoalTabs();
  }

  function renderGoalTabs() {
    const gtC = $('gtC'), gtH = $('gtH'), gvC = $('gvC'), gvH = $('gvH');
    if (gtC) gtC.classList.toggle('on', goalTab === 'today');
    if (gtH) gtH.classList.toggle('on', goalTab === 'history');
    if (gvC) gvC.style.display = goalTab === 'today' ? '' : 'none';
    if (gvH) gvH.style.display = goalTab === 'history' ? '' : 'none';
    goalPage = 1;
    if (goalTab === 'today') renderGoals(); else renderHistory();
  }

  function addGoal() {
    const input = $('goalInput');
    if (!input || !input.value.trim()) return;
    const goals = getGoals();
    goals.push({ id: Date.now(), text: input.value.trim(), done: false, date: new Date().toISOString() });
    saveGoals(goals);
    input.value = '';
    renderGoals();
  }

  function renderGoals() {
    const container = $('goalContainer'); if (!container) return;
    const todayKey = localDateKey(new Date());
    const goals = getGoals().filter(g => localDateKey(new Date(g.date)) === todayKey);

    if (!goals.length) {
      container.innerHTML = '<div class="goal-empty">Nenhuma meta hoje ✏️</div>';
      const pager = $('goalPager'); if (pager) pager.style.display = 'none';
      return;
    }

    const total = goals.length, totalPages = Math.ceil(total / GOALS_PER_PAGE);
    if (goalPage > totalPages) goalPage = totalPages;
    const start = (goalPage - 1) * GOALS_PER_PAGE;
    const pageGoals = goals.slice(start, start + GOALS_PER_PAGE);

    container.innerHTML = pageGoals.map(g => `
      <div class="goal-row ${g.done?'done':''}">
        <div class="gchk" onclick="window.toggleGoal(${g.id})">${g.done?'✓':''}</div>
        <span class="glabel" onclick="window.toggleGoal(${g.id})">${g.text}</span>
        <span class="gx" onclick="window.deleteGoal(${g.id})">×</span>
      </div>
    `).join('');

    const pager = $('goalPager');
    if (pager) {
      pager.style.display = totalPages > 1 ? '' : 'none';
      const pgInfo = $('pgInfo'); if (pgInfo) pgInfo.textContent = `${goalPage}/${totalPages}`;
      const pgPrev = $('pgPrev'); if (pgPrev) pgPrev.disabled = goalPage <= 1;
      const pgNext = $('pgNext'); if (pgNext) pgNext.disabled = goalPage >= totalPages;
    }
  }

  function renderHistory() {
    const container = $('histContainer'); if (!container) return;
    const summaryEl = $('histSummary');
    const allGoals = getGoals();
    const todayKey = localDateKey(new Date());
    const byDate = {};
    allGoals.forEach(g => {
      const key = localDateKey(new Date(g.date));
      if (!byDate[key]) byDate[key] = [];
      byDate[key].push(g);
    });
    const sortedDates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));
    const doneAll = allGoals.filter(g => g.done).length;
    const pendingAll = allGoals.filter(g => !g.done && localDateKey(new Date(g.date)) === todayKey).length;
    const expiredAll = allGoals.filter(g => !g.done && localDateKey(new Date(g.date)) < todayKey).length;
    if (summaryEl) {
      summaryEl.innerHTML = `
        <div class="hist-stat"><div class="hist-stat-num green">${doneAll}</div><div class="hist-stat-lbl">Concluídas</div></div>
        <div class="hist-stat"><div class="hist-stat-num red">${expiredAll}</div><div class="hist-stat-lbl">Expiradas</div></div>
        <div class="hist-stat"><div class="hist-stat-num blue">${pendingAll}</div><div class="hist-stat-lbl">Pendentes</div></div>
      `;
    }
    if (sortedDates.length === 0) { container.innerHTML = '<div class="hist-empty">Nenhuma meta registrada ainda</div>'; return; }
    let html = '';
    const diasSemana = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    sortedDates.forEach(dateKey => {
      let goals = byDate[dateKey];
      const isToday = dateKey === todayKey;
      if (goalFilter === 'c') goals = goals.filter(g => g.done);
      else if (goalFilter === 'e') goals = goals.filter(g => !g.done && dateKey < todayKey);
      else if (goalFilter === 'p') goals = goals.filter(g => !g.done && dateKey >= todayKey);
      if (goals.length === 0) return;
      const d = new Date(dateKey + 'T12:00:00');
      const dayName = diasSemana[d.getDay()];
      const dateLabel = `${dayName}, ${d.getDate()}/${d.getMonth()+1}`;
      const done = goals.filter(g => g.done).length;
      const pct = goals.length > 0 ? Math.round(done / goals.length * 100) : 0;
      html += `<div class="hist-section">`;
      html += `<div class="hist-date-header">`;
      html += `<span class="hist-date-label ${isToday ? 'today' : ''}">${isToday ? '📌 HOJE' : dateLabel}</span>`;
      if (isToday) html += `<span class="hist-date-live">● LIVE</span>`;
      html += `<span class="hist-date-stats">${done}/${goals.length} (${pct}%)</span>`;
      html += `</div>`;
      html += `<div class="hist-bar"><div class="hist-bar-fill" style="width:${pct}%"></div></div>`;
      goals.forEach(g => {
        const isDone = g.done, isExpired = !isDone && dateKey < todayKey;
        const cls = isDone ? 'done' : (isExpired ? 'expired' : '');
        const chkCls = isDone ? 'ok' : (isExpired ? 'fail' : 'pend');
        const chkIcon = isDone ? '✓' : (isExpired ? '✗' : '●');
        const badgeCls = isDone ? 'ok' : (isExpired ? 'exp' : 'live');
        const badgeText = isDone ? 'DONE' : (isExpired ? 'EXPIRED' : 'ACTIVE');
        html += `<div class="hist-row ${cls}"><div class="hchk ${chkCls}">${chkIcon}</div><span class="hlabel">${g.text}</span><span class="hbadge ${badgeCls}">${badgeText}</span></div>`;
      });
      html += `</div>`;
    });
    container.innerHTML = html || '<div class="hist-empty">Nenhuma meta com esse filtro</div>';
  }

  window.toggleGoal = function(id) {
    const goals = getGoals();
    const goal = goals.find(x => x.id === id);
    if (goal) { goal.done = !goal.done; saveGoals(goals); renderGoals(); if (goalTab === 'history') renderHistory(); }
  };

  window.deleteGoal = function(id) {
    saveGoals(getGoals().filter(x => x.id !== id));
    renderGoals(); if (goalTab === 'history') renderHistory();
  };

  window.renderGoals = renderGoals;

  // ═══ NOTES ═══
  let currentNote = null;
  const postitColors = ['postit-yellow','postit-pink','postit-mint','postit-peach','postit-lilac','postit-sky'];
  let selectedPostitColor = 'postit-yellow';

  function initNotes() { renderNotesList(); }
  function getNotes() { return store.get('notes', []); }

  function saveNotes(n) {
    store.set('notes', n);
    localStorage.setItem('rms_notes', JSON.stringify(n));
    store._dirty.add('notes');
    store._localModifiedAt = Date.now();
    loadStats();
    store.flushNow().catch(function(){});
  }

  function renderNotesList() {
    const app = $('notesApp'); if (!app) return;
    const notes = getNotes(), colors = postitColors;
    app.innerHTML = `<div class="notes-grid">
      <div class="note-add-card" onclick="window.createNote()"><span>+</span><small>Nova nota</small></div>
      ${notes.map((n,i) => {
        const postitCount = (n.postits && n.postits.length) ? ` • ${n.postits.length} post-it${n.postits.length>1?'s':''}` : '';
        return `<div class="note-card" style="background:var(--${n.color||colors[i%colors.length]});--rot:${(Math.random()*4-2).toFixed(1)}deg" onclick="window.openNote(${n.id})">
          <div class="note-card-del" onclick="event.stopPropagation();window.deleteNote(${n.id})">×</div>
          <div class="note-card-title">${n.title||'Sem título'}</div>
          <div class="note-card-preview">${n.content||''}${postitCount}</div>
        </div>`;
      }).join('')}
    </div>`;
  }
  window.renderNotesList = renderNotesList;

  window.createNote = function() {
    const notes = getNotes();
    const note = { id: Date.now(), title: '', content: '', color: 'postit-yellow', postits: [], date: new Date().toISOString() };
    notes.push(note); saveNotes(notes); window.openNote(note.id);
  };

  window.openNote = function(id) {
    const notes = getNotes(), note = notes.find(n=>n.id===id); if(!note) return;
    if (!note.postits) note.postits = [];
    currentNote = note; selectedPostitColor = 'postit-yellow'; renderNoteEditor();
  };

  function renderNoteEditor() {
    const app = $('notesApp'); if (!app || !currentNote) return;
    const note = currentNote;
    const postitsHtml = note.postits.map((p, i) => `<div class="note-postit" style="background:var(--${p.color || 'postit-yellow'})">${p.text}<span class="note-postit-del" onclick="window.deletePostit(${i})">×</span></div>`).join('');
    const colorPickerHtml = postitColors.map(c => `<div class="postit-color-pick ${c===selectedPostitColor?'active':''}" style="background:var(--${c})" onclick="window.selectPostitColor('${c}')"></div>`).join('');
    const noteColorHtml = postitColors.map(c => `<div class="note-color-dot ${c===note.color?'active':''}" style="background:var(--${c})" onclick="window.changeNoteColor('${c}')"></div>`).join('');
    app.innerHTML = `<div class="note-editor">
      <div class="note-editor-header"><button class="note-back" onclick="window.closeNote()">← Voltar</button>${noteColorHtml}</div>
      <input class="note-title-input" id="noteTitle" value="${note.title}" placeholder="Título..." oninput="window.saveCurrentNote()">
      <textarea class="note-textarea" id="noteContent" placeholder="Escreva aqui..." oninput="window.saveCurrentNote()">${note.content}</textarea>
      <div class="px-div"></div>
      <div class="note-postits" id="notePostits">${postitsHtml}</div>
      <div class="postit-add-row">
        <input class="postit-add-input" id="postitInput" placeholder="Adicionar post-it..." onkeydown="if(event.key==='Enter')window.addPostit()">
        ${colorPickerHtml}
        <button class="postit-add-btn" onclick="window.addPostit()">+ Post-it</button>
      </div>
      <div class="note-meta"><span>Criada: ${new Date(note.date).toLocaleDateString('pt-BR')}</span><span>${note.postits.length} post-it${note.postits.length!==1?'s':''}</span></div>
    </div>`;
  }

  window.selectPostitColor = function(color) { selectedPostitColor = color; renderNoteEditor(); const input = $('postitInput'); if (input) input.focus(); };

  window.addPostit = function() {
    const input = $('postitInput'); if (!input || !input.value.trim() || !currentNote) return;
    const notes = getNotes(), n = notes.find(x => x.id === currentNote.id); if (!n) return;
    if (!n.postits) n.postits = [];
    n.postits.push({ text: input.value.trim(), color: selectedPostitColor, date: new Date().toISOString() });
    currentNote = n; saveNotes(notes); renderNoteEditor();
    setTimeout(() => { const inp = $('postitInput'); if (inp) inp.focus(); }, 50);
  };

  window.deletePostit = function(index) {
    if (!currentNote) return;
    const notes = getNotes(), n = notes.find(x => x.id === currentNote.id); if (!n || !n.postits) return;
    n.postits.splice(index, 1); currentNote = n; saveNotes(notes); renderNoteEditor();
  };

  window.changeNoteColor = function(color) {
    if (!currentNote) return;
    const notes = getNotes(), n = notes.find(x => x.id === currentNote.id); if (!n) return;
    n.color = color; currentNote = n; saveNotes(notes); renderNoteEditor();
  };

  window.closeNote = function() { currentNote = null; renderNotesList(); };

  let _noteTypingTimer = null;
  window.saveCurrentNote = function() {
    if (!currentNote) return;
    const notes = getNotes(), n = notes.find(x => x.id === currentNote.id); if (!n) return;
    const t = $('noteTitle'), c = $('noteContent');
    if (t) n.title = t.value; if (c) n.content = c.value;
    currentNote = n;
    store.set('notes', notes, false);
    localStorage.setItem('rms_notes', JSON.stringify(notes));
    store._dirty.add('notes');
    store._localModifiedAt = Date.now();
    clearTimeout(_noteTypingTimer);
    _noteTypingTimer = setTimeout(() => store.flushNow(), 3000);
  };

  window.deleteNote = function(id) { saveNotes(getNotes().filter(n => n.id !== id)); if (currentNote && currentNote.id === id) currentNote = null; renderNotesList(); };

  // ═══ STREAK ═══
  function initStreak() {
    const container = $('skD'), btn = $('skBtn'); if(!container) return;
    const data = store.get('streak_days', {});
    const today = new Date(), dias = ['D','S','T','Q','Q','S','S'];
    let html = '';
    for (let i=6;i>=0;i--) {
      const d=new Date(today); d.setDate(d.getDate()-i);
      const key=localDateKey(d), isT=i===0, ok=data[key];
      html += `<div class="sd ${ok?'ok':''} ${isT?'now':''}">${dias[d.getDay()]}</div>`;
    }
    container.innerHTML = html;
    let streak=0;
    for(let i=0;i<365;i++){const d=new Date(today);d.setDate(d.getDate()-i);if(data[localDateKey(d)])streak++;else break;}
    store.setRaw('streak', streak, false);
    if(btn) btn.onclick=()=>{
      data[localDateKey(new Date())]=true;
      store.set('streak_days', data); store.setRaw('streak', 0);
      initStreak(); loadStats(); store.flushNow();
    };
  }

  // ═══ RETROLESSON ═══
  function initRetroLesson() {
    const container = $('rlC'); if(!container) return;
    const ch = [
      {type:'JS',title:'Array Flatten',desc:'Achate um array multidimensional',diff:'easy'},
      {type:'PY',title:'Palindrome',desc:'Verifique se é palíndromo',diff:'easy'},
      {type:'JS',title:'Debounce',desc:'Implemente um debounce',diff:'medium'},
      {type:'ALGO',title:'Binary Search',desc:'Busca binária',diff:'medium'},
      {type:'JS',title:'Promise.all',desc:'Reimplemente Promise.all',diff:'hard'},
    ];
    const c=ch[Math.floor(Math.random()*ch.length)];
    container.innerHTML = `<div class="rl-box"><div class="rl-type">${c.type}</div><div class="rl-title">${c.title}</div><div class="rl-desc">${c.desc}</div><span class="rl-diff d-${c.diff[0]}">${c.diff.toUpperCase()}</span></div>`;
    const rlNew=$('rlNew'); if(rlNew) rlNew.onclick=initRetroLesson;
  }

  window.openLesson = function() {
    const panel = $('lessonPanel'), overlay = $('lessonOverlay'), iframe = $('lessonIframe');
    if (panel) panel.classList.add('open'); if (overlay) overlay.classList.add('open');
    if (iframe && !iframe.src.includes('blob:')) {
      const dataEl = $('lessonData');
      if (dataEl) {
        try {
          const html = atob(dataEl.textContent.trim());
          iframe.src = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
        } catch(e) {}
      }
    }
    // After iframe loads, send bridge init signal
    if (iframe) {
      iframe.onload = function() {
        try {
          iframe.contentWindow.postMessage({ type: 'initBridge' }, '*');
        } catch(e) {}
      };
    }
  };

  // ═══ RETROLESSON postMessage BRIDGE ═══
  window.addEventListener('message', function(e) {
    if (!e.data || e.data.type !== 'lessonComplete') return;
    const lessons = store.get('lessons', { completed: [], history: [] });
    const entry = {
      id: e.data.lessonId || Date.now(),
      title: e.data.title || 'Lesson',
      language: e.data.language || 'JS',
      difficulty: e.data.difficulty || 'medium',
      completedAt: new Date().toISOString(),
      score: e.data.score || null,
      timestamp: Date.now()
    };
    // Avoid duplicate completed entries by id
    if (!lessons.completed.find(l => l.id === entry.id)) {
      lessons.completed.push(entry);
    }
    // Always push to history (tracks every attempt)
    lessons.history.push(entry);
    store.set('lessons', lessons);
    store.flushNow();
    // Update stats display
    try { loadStats(); } catch(e2) {}
  });
  window.closeLesson = function() {
    const panel = $('lessonPanel'), overlay = $('lessonOverlay');
    if (panel) panel.classList.remove('open'); if (overlay) overlay.classList.remove('open');
  };

  // ═══ THEME ═══
  window.setTheme = function(theme) {
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem('rms_theme', theme);
    document.querySelectorAll('.theme-toggle-opt').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.themeVal === theme);
    });
    const effectiveTheme = document.documentElement.getAttribute('data-theme');
    if (effectiveTheme === 'dark' || effectiveTheme === 'retro') generateStars();
  };

  function generateStars() {
    const container = $('starsContainer');
    if (!container || container.children.length > 0) return;
    for (let i = 0; i < 80; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%'; star.style.top = Math.random() * 100 + '%';
      star.style.setProperty('--dur', (2 + Math.random() * 4) + 's');
      star.style.setProperty('--bright', (0.4 + Math.random() * 0.6));
      star.style.setProperty('--scale', (1.1 + Math.random() * 0.5));
      star.style.animationDelay = Math.random() * 3 + 's';
      container.appendChild(star);
    }
  }

  // ═══ INIT ═══
  function init() {
    const savedTheme = localStorage.getItem('rms_theme') || 'light';
    window.setTheme(savedTheme);
    if (auth && auth.isAuthenticated()) showHub();
    else window.location.href = '/login.html';
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

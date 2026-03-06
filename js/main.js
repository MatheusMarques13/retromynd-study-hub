// =============================================================================
// MAIN.JS - RetroMynd Study Hub
// Fluxo: login.html → Hub (Vercel + Supabase)
// PERSISTENCE: Server-first. Load from server on boot, fallback to localStorage.
// =============================================================================

(function() {
  'use strict';
  const $ = id => document.getElementById(id);

  // ═══ PERSISTENCE LAYER ═══
  // All data goes through here. Saves to localStorage immediately + queues server save.
  const store = {
    _dirty: new Set(),
    _saving: false,

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
        this._debouncedFlush();
      }
    },

    _flushTimer: null,
    _debouncedFlush() {
      clearTimeout(this._flushTimer);
      this._flushTimer = setTimeout(() => this.flush(), 2000);
    },

    // Maps localStorage keys to server data_type + payload builder
    _serverMap: {
      goals:        () => ({ type: 'goals',  data: { items: store.get('goals', []), history: [] } }),
      notes:        () => ({ type: 'notes',  data: { notes: store.get('notes', []) } }),
      pomodoros:    () => ({ type: 'timer',  data: { pomodoros: parseInt(store.getRaw('pomodoros', '0')), totalMinutes: 0 } }),
      streak:       () => ({ type: 'streak', data: { current: parseInt(store.getRaw('streak', '0')), best: parseInt(store.getRaw('streak', '0')), days: store.get('streak_days', {}) } }),
      streak_days:  () => ({ type: 'streak', data: { current: parseInt(store.getRaw('streak', '0')), best: parseInt(store.getRaw('streak', '0')), days: store.get('streak_days', {}) } }),
    },

    async flush() {
      if (this._saving || !auth || !auth.isAuthenticated() || this._dirty.size === 0) return;
      this._saving = true;
      // Collect unique server save operations
      const ops = new Map();
      for (const key of this._dirty) {
        const mapper = this._serverMap[key];
        if (mapper) {
          const { type, data } = mapper();
          ops.set(type, data); // dedup by type (streak_days + streak = one save)
        }
      }
      this._dirty.clear();
      for (const [type, data] of ops) {
        try {
          await auth.saveData(type, data);
          console.log('[RetroMynd] Saved', type);
        } catch (e) {
          console.warn('[RetroMynd] Save failed:', type, e.message);
          // Re-mark as dirty so next flush retries
          this._dirty.add(type);
        }
      }
      this._saving = false;
      // If new dirty items appeared during save, flush again
      if (this._dirty.size > 0) setTimeout(() => this.flush(), 1000);
    },

    // Force immediate flush (used on beforeunload)
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
          // Use sendBeacon for reliable unload saves
          const blob = new Blob([JSON.stringify({ data_type: type, data })], { type: 'application/json' });
          navigator.sendBeacon('/api/data/save?token=' + token, blob);
        } catch (e) { /* best effort */ }
      }
    }
  };
  window._store = store;

  // Save on tab close / navigate away
  window.addEventListener('beforeunload', () => store.flushSync());
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') store.flush();
  });

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
      store.flush(); // save before logout
      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('rms_user');
        window.location.href = '/login.html';
      }, 500);
    };

    const avatars = ['💖','🎮','🧠','🔥','⭐','🌙','🎵','🦊','🐱','🌸','💜','🎯','🍀','🌈','✨','🎪'];
    if (avatarGrid) {
      avatarGrid.innerHTML = avatars.map(a => `<span class="pp-avatar-opt" onclick="window.pickAvatar('${a}')">${a}</span>`).join('');
    }
    if (avatarBig) avatarBig.onclick = () => {
      if (avatarGrid) avatarGrid.classList.toggle('open');
    };

    const ppName = $('ppName');
    const ppBio = $('ppBio');
    if (ppName) ppName.onblur = () => saveProfile();
    if (ppBio) ppBio.onblur = () => saveProfile();
  }

  function openProfile() {
    const panel = $('ppPanel');
    const overlay = $('ppOverlay');
    if (panel) panel.classList.add('open');
    if (overlay) overlay.classList.add('open');

    const user = auth ? auth.getUser() : null;
    if (user) {
      const ppName = $('ppName');
      const ppEmail = $('ppEmail');
      const ppBio = $('ppBio');
      const ppAvatarBig = $('ppAvatarBig');
      const ppSince = $('ppSince');
      const ppStats = $('ppStats');

      if (ppName) ppName.value = user.name || '';
      if (ppEmail) ppEmail.textContent = user.email || '';
      if (ppBio) ppBio.value = user.bio || localStorage.getItem('rms_bio') || '';
      if (ppAvatarBig) ppAvatarBig.textContent = user.avatar || localStorage.getItem('rms_avatar') || '💖';
      if (ppSince) ppSince.textContent = user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'Hoje';

      const goals = getGoals();
      const notes = getNotes();
      const streak = parseInt(store.getRaw('streak', '0'));
      const pomos = parseInt(store.getRaw('pomodoros', '0'));
      if (ppStats) ppStats.innerHTML = `
        <div class="pp-stat-card"><div class="pp-stat-num" style="color:var(--pink)">${streak}</div><div class="pp-stat-lbl">Streak</div></div>
        <div class="pp-stat-card"><div class="pp-stat-num" style="color:var(--blue)">${notes.length}</div><div class="pp-stat-lbl">Notas</div></div>
        <div class="pp-stat-card"><div class="pp-stat-num" style="color:var(--lavender)">${goals.length}</div><div class="pp-stat-lbl">Metas</div></div>
        <div class="pp-stat-card"><div class="pp-stat-num" style="color:var(--mint)">${pomos}</div><div class="pp-stat-lbl">Pomodoros</div></div>
      `;
    }
  }

  function closeProfile() {
    const panel = $('ppPanel');
    const overlay = $('ppOverlay');
    if (panel) panel.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  }

  window.pickAvatar = function(emoji) {
    const ppAvatarBig = $('ppAvatarBig');
    const headerAvatar = $('headerAvatar');
    if (ppAvatarBig) ppAvatarBig.textContent = emoji;
    if (headerAvatar) headerAvatar.textContent = emoji;
    localStorage.setItem('rms_avatar', emoji);
    const grid = $('ppAvatarGrid');
    if (grid) grid.classList.remove('open');
    const user = auth ? auth.getUser() : null;
    if (user) { user.avatar = emoji; localStorage.setItem('rms_user', JSON.stringify(user)); }
  };

  function saveProfile() {
    const ppName = $('ppName');
    const ppBio = $('ppBio');
    const name = ppName ? ppName.value : '';
    const bio = ppBio ? ppBio.value : '';
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
      const headerName = $('headerName');
      const headerAvatar = $('headerAvatar');
      if (headerName) headerName.textContent = user.name || user.email || 'Estudante';
      if (headerAvatar) headerAvatar.textContent = user.avatar || localStorage.getItem('rms_avatar') || '💖';
    }
    updateDate();
    initProfilePanel();

    // CRITICAL: Sync from server FIRST, then render everything
    await syncFromServer();

    loadStats();
    try { initPomodoro(); } catch(e) {}
    try { initGoals(); } catch(e) {}
    try { initNotes(); } catch(e) {}
    try { initStreak(); } catch(e) {}
    try { initRetroLesson(); } catch(e) {}
  }
  window.showHub = showHub;

  // ═══ SYNC FROM SUPABASE ═══
  async function syncFromServer() {
    if (!auth || !auth.isAuthenticated()) return;
    try {
      const allData = await auth.loadData('');
      if (!allData || typeof allData !== 'object') {
        console.log('[RetroMynd] No server data yet');
        return;
      }

      // Goals
      if (allData.goals && allData.goals.data) {
        const d = allData.goals.data;
        if (d.items && Array.isArray(d.items)) {
          store.set('goals', d.items, false); // false = don't re-sync to server
        }
      }

      // Notes
      if (allData.notes && allData.notes.data) {
        const d = allData.notes.data;
        if (d.notes && Array.isArray(d.notes)) {
          store.set('notes', d.notes, false);
        }
      }

      // Timer/Pomodoros
      if (allData.timer && allData.timer.data) {
        const d = allData.timer.data;
        if (d.pomodoros != null) {
          store.setRaw('pomodoros', d.pomodoros, false);
        }
      }

      // Streak
      if (allData.streak && allData.streak.data) {
        const d = allData.streak.data;
        if (d.days && typeof d.days === 'object') {
          store.set('streak_days', d.days, false);
        }
        if (d.current != null) {
          store.setRaw('streak', d.current, false);
        }
      }

      console.log('[RetroMynd] Synced from server ✓');
    } catch(e) {
      console.warn('[RetroMynd] Sync error (using local data):', e.message);
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
    const today = new Date().toDateString();
    const todayGoals = goals.filter(g => new Date(g.date).toDateString() === today);
    const doneGoals = todayGoals.filter(g => g.done).length;
    const sS = $('sS'); if (sS) sS.textContent = streak;
    const sN = $('sN'); if (sN) sN.textContent = notes.length;
    const sG = $('sG'); if (sG) sG.textContent = `${doneGoals}/${todayGoals.length}`;
    const sP = $('sP'); if (sP) sP.textContent = pomos;
  }
  window.loadStats = loadStats;

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
  function initGoals() {
    const addBtn = $('goalAddBtn'); const input = $('goalInput');
    if (addBtn) addBtn.onclick = addGoal;
    if (input) input.onkeydown = e => { if (e.key === 'Enter') addGoal(); };
    renderGoals();
  }
  function getGoals() { return store.get('goals', []); }
  function saveGoals(g) { store.set('goals', g); loadStats(); }

  function addGoal() {
    const input = $('goalInput'); if (!input || !input.value.trim()) return;
    const goals = getGoals();
    goals.push({ id: Date.now(), text: input.value.trim(), done: false, date: new Date().toISOString() });
    saveGoals(goals); input.value = ''; renderGoals();
  }

  function renderGoals() {
    const container = $('goalContainer'); if (!container) return;
    const today = new Date().toDateString();
    const goals = getGoals().filter(g => new Date(g.date).toDateString() === today);
    if (!goals.length) { container.innerHTML = '<div class="goal-empty">Nenhuma meta hoje</div>'; return; }
    container.innerHTML = goals.map(g => `
      <div class="goal-row ${g.done?'done':''}">
        <div class="gchk" onclick="window.toggleGoal(${g.id})">${g.done?'✓':''}</div>
        <span class="glabel" onclick="window.toggleGoal(${g.id})">${g.text}</span>
        <span class="gx" onclick="window.deleteGoal(${g.id})">×</span>
      </div>
    `).join('');
  }
  window.toggleGoal = function(id) { const g=getGoals(),f=g.find(x=>x.id===id); if(f)f.done=!f.done; saveGoals(g); renderGoals(); };
  window.deleteGoal = function(id) { saveGoals(getGoals().filter(x=>x.id!==id)); renderGoals(); };
  window.renderGoals = renderGoals;

  // ═══ NOTES (with Post-its) ═══
  let currentNote = null;
  const postitColors = ['postit-yellow','postit-pink','postit-mint','postit-peach','postit-lilac','postit-sky'];
  let selectedPostitColor = 'postit-yellow';

  function initNotes() { renderNotesList(); }
  function getNotes() { return store.get('notes', []); }
  function saveNotes(n) { store.set('notes', n); loadStats(); }

  function renderNotesList() {
    const app = $('notesApp'); if (!app) return;
    const notes = getNotes();
    const colors = postitColors;
    app.innerHTML = `<div class="notes-grid">
      <div class="note-add-card" onclick="window.createNote()"><span>+</span><small>Nova nota</small></div>
      ${notes.map((n,i) => {
        const postitCount = (n.postits && n.postits.length) ? ` • ${n.postits.length} post-it${n.postits.length>1?'s':''}` : '';
        return `
        <div class="note-card" style="background:var(--${n.color||colors[i%colors.length]});--rot:${(Math.random()*4-2).toFixed(1)}deg" onclick="window.openNote(${n.id})">
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
    currentNote = note;
    selectedPostitColor = 'postit-yellow';
    renderNoteEditor();
  };

  function renderNoteEditor() {
    const app = $('notesApp'); if (!app || !currentNote) return;
    const note = currentNote;
    const postitsHtml = note.postits.map((p, i) => `
      <div class="note-postit" style="background:var(--${p.color || 'postit-yellow'})">
        ${p.text}
        <span class="note-postit-del" onclick="window.deletePostit(${i})">×</span>
      </div>
    `).join('');

    const colorPickerHtml = postitColors.map(c =>
      `<div class="postit-color-pick ${c===selectedPostitColor?'active':''}" style="background:var(--${c})" onclick="window.selectPostitColor('${c}')"></div>`
    ).join('');

    const noteColorHtml = postitColors.map(c =>
      `<div class="note-color-dot ${c===note.color?'active':''}" style="background:var(--${c})" onclick="window.changeNoteColor('${c}')"></div>`
    ).join('');

    app.innerHTML = `<div class="note-editor">
      <div class="note-editor-header">
        <button class="note-back" onclick="window.closeNote()">← Voltar</button>
        ${noteColorHtml}
      </div>
      <input class="note-title-input" id="noteTitle" value="${note.title}" placeholder="Título..." oninput="window.saveCurrentNote()">
      <textarea class="note-textarea" id="noteContent" placeholder="Escreva aqui..." oninput="window.saveCurrentNote()">${note.content}</textarea>

      <div class="px-div"></div>

      <div class="note-postits" id="notePostits">${postitsHtml}</div>

      <div class="postit-add-row">
        <input class="postit-add-input" id="postitInput" placeholder="Adicionar post-it..." onkeydown="if(event.key==='Enter')window.addPostit()">
        ${colorPickerHtml}
        <button class="postit-add-btn" onclick="window.addPostit()">+ Post-it</button>
      </div>

      <div class="note-meta">
        <span>Criada: ${new Date(note.date).toLocaleDateString('pt-BR')}</span>
        <span>${note.postits.length} post-it${note.postits.length!==1?'s':''}</span>
      </div>
    </div>`;
  }

  window.selectPostitColor = function(color) {
    selectedPostitColor = color;
    renderNoteEditor();
    const input = $('postitInput'); if (input) input.focus();
  };

  window.addPostit = function() {
    const input = $('postitInput'); if (!input || !input.value.trim() || !currentNote) return;
    const notes = getNotes(), n = notes.find(x => x.id === currentNote.id); if (!n) return;
    if (!n.postits) n.postits = [];
    n.postits.push({ text: input.value.trim(), color: selectedPostitColor, date: new Date().toISOString() });
    currentNote = n;
    saveNotes(notes);
    renderNoteEditor();
    setTimeout(() => { const inp = $('postitInput'); if (inp) inp.focus(); }, 50);
  };

  window.deletePostit = function(index) {
    if (!currentNote) return;
    const notes = getNotes(), n = notes.find(x => x.id === currentNote.id); if (!n) return;
    if (!n.postits) return;
    n.postits.splice(index, 1);
    currentNote = n;
    saveNotes(notes);
    renderNoteEditor();
  };

  window.changeNoteColor = function(color) {
    if (!currentNote) return;
    const notes = getNotes(), n = notes.find(x => x.id === currentNote.id); if (!n) return;
    n.color = color;
    currentNote = n;
    saveNotes(notes);
    renderNoteEditor();
  };

  window.closeNote = function() { currentNote = null; renderNotesList(); };

  window.saveCurrentNote = function() {
    if (!currentNote) return;
    const notes = getNotes(), n = notes.find(x => x.id === currentNote.id); if (!n) return;
    const t = $('noteTitle'), c = $('noteContent');
    if (t) n.title = t.value;
    if (c) n.content = c.value;
    currentNote = n;
    saveNotes(notes);
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
      const key=d.toISOString().split('T')[0], isT=i===0, ok=data[key];
      html += `<div class="sd ${ok?'ok':''} ${isT?'now':''}">${dias[d.getDay()]}</div>`;
    }
    container.innerHTML = html;
    let streak=0;
    for(let i=0;i<365;i++){const d=new Date(today);d.setDate(d.getDate()-i);if(data[d.toISOString().split('T')[0]])streak++;else break;}
    store.setRaw('streak', streak, false);
    if(btn) btn.onclick=()=>{
      data[new Date().toISOString().split('T')[0]]=true;
      store.set('streak_days', data);
      store.setRaw('streak', 0); // will be recalculated
      initStreak(); loadStats();
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
    if (panel) panel.classList.add('open');
    if (overlay) overlay.classList.add('open');
    if (iframe && !iframe.src.includes('blob:')) {
      const dataEl = $('lessonData');
      if (dataEl) { try { const html = atob(dataEl.textContent.trim()); iframe.src = URL.createObjectURL(new Blob([html], { type: 'text/html' })); } catch(e) {} }
    }
  };
  window.closeLesson = function() {
    const panel = $('lessonPanel'), overlay = $('lessonOverlay');
    if (panel) panel.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  };

  // ═══ THEME (light / system / dark) ═══
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
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
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

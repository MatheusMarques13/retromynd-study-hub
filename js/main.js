// =============================================================================
// MAIN.JS - RetroMynd Study Hub
// Fluxo: login.html → Hub (Vercel + Supabase)
// =============================================================================

(function() {
  'use strict';
  const $ = id => document.getElementById(id);

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
      if (auth) {
        localStorage.removeItem('token');
        localStorage.removeItem('rms_user');
        window.location.href = '/login.html';
      }
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
      const streak = parseInt(localStorage.getItem('rms_streak') || '0');
      const pomos = parseInt(localStorage.getItem('rms_pomodoros') || '0');
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
  function showHub() {
    const hub = $('hub');
    if (hub) { hub.style.display = 'block'; hub.classList.add('show'); }
    const user = auth ? auth.getUser() : null;
    if (user) {
      const headerName = $('headerName');
      const headerAvatar = $('headerAvatar');
      if (headerName) headerName.textContent = user.name || user.email || 'Estudante';
      if (headerAvatar) headerAvatar.textContent = user.avatar || localStorage.getItem('rms_avatar') || '💖';
    }
    updateDate(); loadStats(); syncFromServer(); initProfilePanel();
    try { initPomodoro(); } catch(e) {}
    try { initGoals(); } catch(e) {}
    try { initNotes(); } catch(e) {}
    try { initStreak(); } catch(e) {}
    try { initRetroLesson(); } catch(e) {}
  }
  window.showHub = showHub;

  // ═══ SYNC FROM SUPABASE ═══
  // load.js returns: { goals: { data: {...}, updated_at }, notes: { data: {...}, updated_at }, ... }
  // When calling loadData('goals'), it returns the FULL object (filtered by type query)
  async function syncFromServer() {
    if (!auth || !auth.isAuthenticated()) return;
    try {
      // Load all data at once (no type filter) for efficiency
      const allData = await auth.loadData('');
      // allData = { goals: {data, updated_at}, notes: {data, updated_at}, ... }

      if (allData && allData.goals && allData.goals.data) {
        const d = allData.goals.data;
        if (d.items) localStorage.setItem('rms_goals', JSON.stringify(d.items));
      }
      if (allData && allData.notes && allData.notes.data) {
        const d = allData.notes.data;
        if (d.notes) localStorage.setItem('rms_notes', JSON.stringify(d.notes));
      }
      if (allData && allData.timer && allData.timer.data) {
        const d = allData.timer.data;
        if (d.pomodoros != null) localStorage.setItem('rms_pomodoros', d.pomodoros);
      }
      if (allData && allData.streak && allData.streak.data) {
        const d = allData.streak.data;
        if (d.days) localStorage.setItem('rms_streak_days', JSON.stringify(d.days || {}));
        if (d.current != null) localStorage.setItem('rms_streak', d.current);
      }
      loadStats();
      try { renderGoals(); } catch(e) {}
      try { renderNotesList(); } catch(e) {}
      try { initStreak(); } catch(e) {}
    } catch(e) { console.log('[RetroMynd] Sync error:', e.message); }
  }

  // ═══ SAVE TO SUPABASE (debounced) ═══
  let saveTimeout = null;
  function saveToServer(type) {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      if (!auth || !auth.isAuthenticated()) return;
      try {
        if (type === 'goals') await auth.saveData('goals', { items: getGoals(), history: [] });
        else if (type === 'notes') await auth.saveData('notes', { notes: getNotes() });
        else if (type === 'timer') await auth.saveData('timer', { pomodoros: parseInt(localStorage.getItem('rms_pomodoros') || '0'), totalMinutes: 0 });
        else if (type === 'streak') {
          const days = JSON.parse(localStorage.getItem('rms_streak_days') || '{}');
          const current = parseInt(localStorage.getItem('rms_streak') || '0');
          await auth.saveData('streak', { current, best: current, days });
        }
      } catch(e) { console.log('[RetroMynd] Save error:', e.message); }
    }, 1500);
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
    const streak = parseInt(localStorage.getItem('rms_streak') || '0');
    const pomos = parseInt(localStorage.getItem('rms_pomodoros') || '0');
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
            const p = parseInt(localStorage.getItem('rms_pomodoros') || '0') + 1;
            localStorage.setItem('rms_pomodoros', p); loadStats(); saveToServer('timer');
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
  function getGoals() { return JSON.parse(localStorage.getItem('rms_goals') || '[]'); }
  function saveGoals(g) { localStorage.setItem('rms_goals', JSON.stringify(g)); loadStats(); saveToServer('goals'); }

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
  function getNotes() { return JSON.parse(localStorage.getItem('rms_notes') || '[]'); }
  function saveNotes(n) { localStorage.setItem('rms_notes', JSON.stringify(n)); loadStats(); saveToServer('notes'); }

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
    const app = $('notesApp'); if(!app) return;
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
    const data = JSON.parse(localStorage.getItem('rms_streak_days')||'{}');
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
    localStorage.setItem('rms_streak',streak);
    if(btn) btn.onclick=()=>{
      data[new Date().toISOString().split('T')[0]]=true;
      localStorage.setItem('rms_streak_days',JSON.stringify(data));
      initStreak(); loadStats(); saveToServer('streak');
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

  // ═══ THEME (light / system / dark / retro) ═══
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

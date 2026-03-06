// =============================================================================
// MAIN.JS - RetroMynd Study Hub
// Fluxo: Splash → Login → Hub (Vercel + Supabase)
// =============================================================================

(function() {
  'use strict';
  const $ = id => document.getElementById(id);

  // ═══ SPLASH → LOGIN/HUB ═══
  window.goFromSplash = function() {
    const splash = $('splash');
    if (splash) {
      splash.classList.add('hide');
      setTimeout(() => { splash.style.display = 'none'; }, 600);
    }
    if (auth && auth.isAuthenticated()) showHub();
    else showLogin();
  };

  // ═══ SHOW LOGIN ═══
  function showLogin() {
    const login = $('loginScreen');
    const hub = $('hub');
    if (hub) hub.style.display = 'none';

    if (login) {
      login.style.display = 'flex';
      login.classList.add('show');
    } else {
      createLoginScreen();
    }
    loadSavedUsers();
  }
  window.showLogin = showLogin;

  function createLoginScreen() {
    if ($('loginScreen')) return;
    const div = document.createElement('div');
    div.id = 'loginScreen';
    div.style.cssText = 'display:flex;align-items:center;justify-content:center;min-height:100vh;background:var(--bg);padding:20px;';
    div.innerHTML = `
      <div class="nb" style="max-width:420px;width:100%;">
        <div class="nb-holes"><div class="nb-hole"></div><div class="nb-hole"></div><div class="nb-hole"></div></div>
        <div class="nb-header">
          <h2 style="text-align:center;width:100%;">Entrar no RetroMynd</h2>
        </div>
        <div class="nb-body" style="padding-top:20px;padding-bottom:30px;">
          <div id="loginSaved" style="margin-bottom:16px;"></div>

          <div style="margin-bottom:14px;display:flex;gap:8px;">
            <button class="postit-btn tm-btn on" id="ltLogin" onclick="window.switchLoginMode('login')" style="flex:1;padding:8px;font-size:15px;">Login</button>
            <button class="postit-btn tm-btn" id="ltReg" onclick="window.switchLoginMode('register')" style="flex:1;padding:8px;font-size:15px;">Cadastrar</button>
          </div>

          <div id="loginNameRow" style="display:none;margin-bottom:10px;">
            <input id="loginName" type="text" placeholder="Seu nome" style="width:100%;font-family:'Kalam',cursive;font-size:16px;padding:10px 14px;border:1px solid var(--paper-line);border-radius:6px;background:rgba(255,255,255,.8);color:var(--text);outline:none;">
          </div>
          <div style="margin-bottom:10px;">
            <input id="loginEmail" type="email" placeholder="Email" style="width:100%;font-family:'Kalam',cursive;font-size:16px;padding:10px 14px;border:1px solid var(--paper-line);border-radius:6px;background:rgba(255,255,255,.8);color:var(--text);outline:none;">
          </div>
          <div style="margin-bottom:14px;">
            <input id="loginPass" type="password" placeholder="Senha (mín. 6 caracteres)" style="width:100%;font-family:'Kalam',cursive;font-size:16px;padding:10px 14px;border:1px solid var(--paper-line);border-radius:6px;background:rgba(255,255,255,.8);color:var(--text);outline:none;" onkeydown="if(event.key==='Enter')window.doLoginAction()">
          </div>

          <button id="loginActionBtn" class="postit-btn" onclick="window.doLoginAction()" style="width:100%;padding:12px;font-size:17px;background:var(--pink);color:#fff;border-radius:8px;cursor:pointer;font-weight:700;">Entrar</button>

          <div id="loginErr" style="text-align:center;color:var(--pink);font-size:14px;margin-top:10px;min-height:20px;"></div>

          <div style="text-align:center;margin-top:16px;">
            <span style="font-family:'Press Start 2P',monospace;font-size:6px;color:var(--text-light);letter-spacing:1px;">POWERED BY SUPABASE</span>
          </div>
        </div>
      </div>
    `;
    document.body.insertBefore(div, document.body.firstChild);
  }

  let loginMode = 'login';
  window.switchLoginMode = function(mode) {
    loginMode = mode;
    const nameRow = $('loginNameRow');
    const ltLogin = $('ltLogin');
    const ltReg = $('ltReg');
    const btn = $('loginActionBtn');
    if (mode === 'register') {
      if (nameRow) nameRow.style.display = 'block';
      if (ltLogin) ltLogin.classList.remove('on');
      if (ltReg) ltReg.classList.add('on');
      if (btn) btn.textContent = 'Cadastrar';
    } else {
      if (nameRow) nameRow.style.display = 'none';
      if (ltLogin) ltLogin.classList.add('on');
      if (ltReg) ltReg.classList.remove('on');
      if (btn) btn.textContent = 'Entrar';
    }
  };

  window.doLoginAction = async function() {
    const err = $('loginErr');
    const btn = $('loginActionBtn');
    try {
      if (err) { err.style.color = 'var(--blue)'; err.textContent = loginMode === 'login' ? 'Entrando...' : 'Cadastrando...'; }
      if (btn) btn.disabled = true;

      if (loginMode === 'register') {
        const name = ($('loginName') || {}).value || '';
        const email = ($('loginEmail') || {}).value || '';
        const pass = ($('loginPass') || {}).value || '';
        await auth.register(email, pass, name);
      } else {
        const email = ($('loginEmail') || {}).value || '';
        const pass = ($('loginPass') || {}).value || '';
        await auth.login(email, pass);
      }
      if (err) err.textContent = '';
      showHub();
    } catch(e) {
      if (err) { err.style.color = 'var(--pink)'; err.textContent = e.message || 'Erro ao conectar'; }
    } finally {
      if (btn) btn.disabled = false;
    }
  };

  function loadSavedUsers() {
    const container = $('loginSaved');
    if (!container) return;
    const user = auth ? auth.getUser() : null;
    if (user && auth.isAuthenticated()) {
      container.innerHTML = `
        <div style="text-align:center;margin-bottom:12px;">
          <div style="font-size:14px;color:var(--text-light);margin-bottom:8px;">Entrar rapidinho:</div>
          <button class="postit-btn" onclick="window.quickLogin()" style="padding:10px 20px;font-size:16px;background:var(--postit-lilac);color:#7C3AED;border-radius:8px;cursor:pointer;">
            ${user.name || 'Estudante'} (${user.email || ''})
          </button>
        </div>
        <div style="text-align:center;font-size:13px;color:var(--text-light);margin-bottom:8px;">ou entre com outra conta</div>
      `;
    } else {
      container.innerHTML = '';
    }
  }

  window.quickLogin = function() {
    if (auth && auth.isAuthenticated()) showHub();
  };

  // ═══ SHOW HUB ═══
  function showHub() {
    const login = $('loginScreen');
    const hub = $('hub');
    if (login) login.style.display = 'none';
    if (hub) { hub.style.display = 'block'; hub.classList.add('show'); }

    const user = auth ? auth.getUser() : null;
    if (user) {
      const headerName = $('headerName');
      if (headerName) headerName.textContent = user.name || user.email || 'Estudante';
    }

    updateDate();
    loadStats();
    syncFromServer();
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
      const [goals, notes, timer, streak] = await Promise.allSettled([
        auth.loadData('goals'),
        auth.loadData('notes'),
        auth.loadData('timer'),
        auth.loadData('streak')
      ]);
      if (goals.status === 'fulfilled' && goals.value.data) {
        const d = goals.value.data;
        if (d.items) localStorage.setItem('rms_goals', JSON.stringify(d.items));
      }
      if (notes.status === 'fulfilled' && notes.value.data) {
        const d = notes.value.data;
        if (d.notes) localStorage.setItem('rms_notes', JSON.stringify(d.notes));
      }
      if (timer.status === 'fulfilled' && timer.value.data) {
        const d = timer.value.data;
        if (d.pomodoros != null) localStorage.setItem('rms_pomodoros', d.pomodoros);
      }
      if (streak.status === 'fulfilled' && streak.value.data) {
        const d = streak.value.data;
        if (d.days) localStorage.setItem('rms_streak_days', JSON.stringify(d.days || {}));
        if (d.current != null) localStorage.setItem('rms_streak', d.current);
      }
      loadStats();
      try { renderGoals(); } catch(e) {}
      try { renderNotesList(); } catch(e) {}
      try { initStreak(); } catch(e) {}
    } catch(e) { console.log('[RetroMynd] Sync error (using local data):', e.message); }
  }

  // ═══ SAVE TO SUPABASE (debounced) ═══
  let saveTimeout = null;
  function saveToServer(type) {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      if (!auth || !auth.isAuthenticated()) return;
      try {
        if (type === 'goals') {
          await auth.saveData('goals', { items: getGoals(), history: [] });
        } else if (type === 'notes') {
          await auth.saveData('notes', { notes: getNotes() });
        } else if (type === 'timer') {
          await auth.saveData('timer', { pomodoros: parseInt(localStorage.getItem('rms_pomodoros') || '0'), totalMinutes: 0 });
        } else if (type === 'streak') {
          const days = JSON.parse(localStorage.getItem('rms_streak_days') || '{}');
          const current = parseInt(localStorage.getItem('rms_streak') || '0');
          await auth.saveData('streak', { current, best: current, days });
        }
      } catch(e) { console.log('[RetroMynd] Save error:', e.message); }
    }, 1500);
  }

  // ═══ LOGOUT ═══
  window.doLogout = function() { if (auth) auth.logout(); };

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
    const goals = getGoals();
    const notes = getNotes();
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
            localStorage.setItem('rms_pomodoros', p);
            loadStats(); saveToServer('timer');
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

  // ═══ NOTES ═══
  let currentNote = null;
  function initNotes() { renderNotesList(); }
  function getNotes() { return JSON.parse(localStorage.getItem('rms_notes') || '[]'); }
  function saveNotes(n) { localStorage.setItem('rms_notes', JSON.stringify(n)); loadStats(); saveToServer('notes'); }

  function renderNotesList() {
    const app = $('notesApp'); if (!app) return;
    const notes = getNotes();
    const colors = ['postit-yellow','postit-pink','postit-mint','postit-peach','postit-lilac','postit-sky'];
    app.innerHTML = `<div class="notes-grid">
      <div class="note-add-card" onclick="window.createNote()"><span>+</span><small>Nova nota</small></div>
      ${notes.map((n,i) => `
        <div class="note-card" style="background:var(--${n.color||colors[i%colors.length]});--rot:${(Math.random()*4-2).toFixed(1)}deg" onclick="window.openNote(${n.id})">
          <div class="note-card-del" onclick="event.stopPropagation();window.deleteNote(${n.id})">×</div>
          <div class="note-card-title">${n.title||'Sem título'}</div>
          <div class="note-card-preview">${n.content||''}</div>
        </div>
      `).join('')}
    </div>`;
  }
  window.renderNotesList = renderNotesList;

  window.createNote = function() {
    const notes = getNotes();
    const note = { id: Date.now(), title: '', content: '', color: 'postit-yellow', date: new Date().toISOString() };
    notes.push(note); saveNotes(notes); window.openNote(note.id);
  };
  window.openNote = function(id) {
    const notes = getNotes(), note = notes.find(n=>n.id===id); if(!note) return;
    currentNote = note;
    const app = $('notesApp'); if(!app) return;
    app.innerHTML = `<div class="note-editor">
      <div class="note-editor-header"><button class="note-back" onclick="window.closeNote()">← Voltar</button></div>
      <input class="note-title-input" id="noteTitle" value="${note.title}" placeholder="Título..." oninput="window.saveCurrentNote()">
      <textarea class="note-textarea" id="noteContent" placeholder="Escreva aqui..." oninput="window.saveCurrentNote()">${note.content}</textarea>
    </div>`;
  };
  window.closeNote = function() { currentNote=null; renderNotesList(); };
  window.saveCurrentNote = function() {
    if(!currentNote) return; const notes=getNotes(),n=notes.find(x=>x.id===currentNote.id); if(!n) return;
    const t=$('noteTitle'),c=$('noteContent'); if(t)n.title=t.value; if(c)n.content=c.value; saveNotes(notes);
  };
  window.deleteNote = function(id) { saveNotes(getNotes().filter(n=>n.id!==id)); renderNotesList(); };

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

  // ═══ INIT ═══
  function init() {
    const splash = $('splash');
    if (splash && splash.style.display !== 'none' && !splash.classList.contains('hide')) return;
    if (auth && auth.isAuthenticated()) showHub();
    else showLogin();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

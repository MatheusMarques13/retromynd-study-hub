// =============================================================================
// MAIN.JS - RetroMynd Study Hub
// Controla o fluxo: Splash → Login → Hub
// =============================================================================

(function() {
  'use strict';

  // ═══ ELEMENTOS ═══
  const $ = id => document.getElementById(id);

  // ═══ SPLASH → LOGIN/HUB ═══
  window.goFromSplash = function() {
    const splash = $('splash');
    if (splash) {
      splash.classList.add('hide');
      setTimeout(() => { splash.style.display = 'none'; }, 600);
    }

    // Se já está logado, vai pro hub
    if (auth && auth.isAuthenticated()) {
      showHub();
    } else {
      showLogin();
    }
  };

  // ═══ AUTO-FADE da splash redireciona corretamente ═══
  function handleSplashAutoFade() {
    const splash = $('splash');
    if (!splash) return;

    splash.addEventListener('animationend', function(e) {
      if (e.animationName === 'autoFadeSplash') {
        splash.style.display = 'none';
        if (auth && auth.isAuthenticated()) {
          showHub();
        } else {
          showLogin();
        }
      }
    });
  }

  // ═══ MOSTRAR LOGIN ═══
  function showLogin() {
    const login = $('loginScreen');
    const hub = $('hub');
    if (login) { login.style.display = 'flex'; login.classList.add('show'); }
    if (hub) hub.style.display = 'none';
    loadSavedUsers();
  }

  // ═══ MOSTRAR HUB ═══
  function showHub() {
    const login = $('loginScreen');
    const hub = $('hub');
    if (login) { login.style.display = 'none'; login.classList.remove('show'); }
    if (hub) { hub.style.display = 'block'; hub.classList.add('show'); }

    const user = auth ? auth.getUser() : null;
    if (user) {
      const headerName = $('headerName');
      if (headerName) headerName.textContent = user.name || user.email;
    }

    updateDate();
    loadStats();
    initPomodoro();
    initGoals();
    initNotes();
    initStreak();
    initRetroLesson();
  }

  // ═══ LOGIN ═══
  window.doLogin = async function() {
    const email = ($('loginEmail') || {}).value;
    const pass = ($('loginPass') || {}).value;
    const err = $('loginErr');

    if (!email || !pass) {
      if (err) err.textContent = 'Preencha email e senha';
      return;
    }

    try {
      if (err) err.textContent = 'Entrando...';
      await auth.login(email, pass);
      showHub();
    } catch (e) {
      if (err) err.textContent = e.message || 'Erro ao fazer login';
    }
  };

  window.doRegister = async function() {
    const email = ($('loginEmail') || {}).value;
    const name = ($('loginName') || {}).value;
    const pass = ($('loginPass') || {}).value;
    const err = $('loginErr');

    if (!email || !pass || !name) {
      if (err) err.textContent = 'Preencha todos os campos';
      return;
    }

    try {
      if (err) err.textContent = 'Cadastrando...';
      await auth.register(email, pass, name);
      showHub();
    } catch (e) {
      if (err) err.textContent = e.message || 'Erro ao cadastrar';
    }
  };

  function loadSavedUsers() {
    const container = $('loginSaved');
    if (!container) return;
    const user = auth ? auth.getUser() : null;
    if (user) {
      container.innerHTML = `
        <div class="login-saved-label">Entrar rapidinho:</div>
        <div class="login-saved-user" onclick="window.quickLogin()">
          <span class="login-saved-avatar">♥</span>
          <div>
            <div class="login-saved-name">${user.name || 'Estudante'}</div>
            <div class="login-saved-email">${user.email || ''}</div>
          </div>
        </div>
        <div class="login-or">ou entre com outra conta</div>
      `;
    } else {
      container.innerHTML = '';
    }
  }

  window.quickLogin = function() {
    if (auth && auth.isAuthenticated()) {
      showHub();
    }
  };

  // ═══ PROFILE ═══
  function initProfile() {
    const trigger = $('profileTrigger');
    const panel = $('ppPanel');
    const overlay = $('ppOverlay');
    const close = $('ppClose');
    const logout = $('ppLogout');

    if (trigger) trigger.onclick = () => {
      if (panel) panel.classList.add('open');
      if (overlay) overlay.classList.add('open');
      loadProfileData();
    };
    if (close) close.onclick = closeProfile;
    if (overlay) overlay.onclick = closeProfile;
    if (logout) logout.onclick = () => { if (auth) auth.logout(); };
  }

  function closeProfile() {
    const panel = $('ppPanel');
    const overlay = $('ppOverlay');
    if (panel) panel.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  }

  function loadProfileData() {
    const user = auth ? auth.getUser() : null;
    if (!user) return;
    const ppName = $('ppName');
    const ppEmail = $('ppEmail');
    if (ppName) ppName.value = user.name || '';
    if (ppEmail) ppEmail.textContent = user.email || '';
  }

  // ═══ DATE ═══
  function updateDate() {
    const el = $('dateD');
    if (!el) return;
    const d = new Date();
    const dias = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
    const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    el.textContent = `${dias[d.getDay()]}, ${d.getDate()} ${meses[d.getMonth()]} ${d.getFullYear()}`;
  }

  // ═══ STATS ═══
  function loadStats() {
    // Local fallback stats
    const goals = JSON.parse(localStorage.getItem('rms_goals') || '[]');
    const notes = JSON.parse(localStorage.getItem('rms_notes') || '[]');
    const streak = parseInt(localStorage.getItem('rms_streak') || '0');
    const pomos = parseInt(localStorage.getItem('rms_pomodoros') || '0');
    const doneGoals = goals.filter(g => g.done).length;

    const sS = $('sS'); if (sS) sS.textContent = streak;
    const sN = $('sN'); if (sN) sN.textContent = notes.length;
    const sG = $('sG'); if (sG) sG.textContent = `${doneGoals}/${goals.length}`;
    const sP = $('sP'); if (sP) sP.textContent = pomos;
  }

  // ═══ POMODORO ═══
  let pomTimer = null, pomSec = 25 * 60, pomRunning = false, pomMode = 25;

  function initPomodoro() {
    const modes = document.querySelectorAll('.tm-btn');
    modes.forEach(btn => {
      btn.onclick = () => {
        pomMode = parseInt(btn.dataset.min);
        pomSec = pomMode * 60;
        pomRunning = false;
        clearInterval(pomTimer);
        updateTimerDisplay();
        modes.forEach(b => b.classList.remove('on'));
        btn.classList.add('on');
        const tB = $('tB'); if (tB) tB.textContent = 'Iniciar';
        const tL = $('tL');
        if (tL) tL.textContent = pomMode <= 15 ? 'BREAK TIME' : 'FOCUS MODE';
      };
    });

    const tB = $('tB');
    if (tB) tB.onclick = toggleTimer;
    const tR = $('tReset');
    if (tR) tR.onclick = resetTimer;
    updateTimerDisplay();
  }

  function toggleTimer() {
    if (pomRunning) {
      clearInterval(pomTimer);
      pomRunning = false;
      const tB = $('tB'); if (tB) tB.textContent = 'Continuar';
    } else {
      pomRunning = true;
      const tB = $('tB'); if (tB) tB.textContent = 'Pausar';
      pomTimer = setInterval(() => {
        pomSec--;
        if (pomSec <= 0) {
          clearInterval(pomTimer);
          pomRunning = false;
          pomSec = 0;
          const tB = $('tB'); if (tB) tB.textContent = 'Iniciar';
          // Incrementar pomodoros
          if (pomMode >= 25) {
            const p = parseInt(localStorage.getItem('rms_pomodoros') || '0') + 1;
            localStorage.setItem('rms_pomodoros', p);
            loadStats();
          }
          if (Notification.permission === 'granted') {
            new Notification('RetroMynd', { body: 'Pomodoro concluído!' });
          }
        }
        updateTimerDisplay();
      }, 1000);
    }
  }

  function resetTimer() {
    clearInterval(pomTimer);
    pomRunning = false;
    pomSec = pomMode * 60;
    updateTimerDisplay();
    const tB = $('tB'); if (tB) tB.textContent = 'Iniciar';
  }

  function updateTimerDisplay() {
    const m = Math.floor(pomSec / 60);
    const s = pomSec % 60;
    const tD = $('tD');
    if (tD) tD.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  // ═══ GOALS ═══
  let goalPage = 0;
  const GOALS_PER_PAGE = 6;

  function initGoals() {
    const addBtn = $('goalAddBtn');
    const input = $('goalInput');
    if (addBtn) addBtn.onclick = addGoal;
    if (input) input.onkeydown = e => { if (e.key === 'Enter') addGoal(); };

    const gtC = $('gtC');
    const gtH = $('gtH');
    if (gtC) gtC.onclick = () => { gtC.classList.add('on'); gtH.classList.remove('on'); $('gvC').style.display=''; $('gvH').style.display='none'; };
    if (gtH) gtH.onclick = () => { gtH.classList.add('on'); gtC.classList.remove('on'); $('gvH').style.display=''; $('gvC').style.display='none'; renderHistory(); };

    renderGoals();
  }

  function getGoals() { return JSON.parse(localStorage.getItem('rms_goals') || '[]'); }
  function saveGoals(g) { localStorage.setItem('rms_goals', JSON.stringify(g)); loadStats(); }

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
    const container = $('goalContainer');
    if (!container) return;
    const goals = getGoals().filter(g => {
      const d = new Date(g.date);
      const today = new Date();
      return d.toDateString() === today.toDateString();
    });

    if (goals.length === 0) {
      container.innerHTML = '<div class="goal-empty">Nenhuma meta hoje... bora criar uma?</div>';
      return;
    }

    const start = goalPage * GOALS_PER_PAGE;
    const page = goals.slice(start, start + GOALS_PER_PAGE);

    container.innerHTML = page.map(g => `
      <div class="goal-row ${g.done ? 'done' : ''}" data-id="${g.id}">
        <div class="gchk" onclick="window.toggleGoal(${g.id})">${g.done ? '✓' : ''}</div>
        <span class="glabel" onclick="window.toggleGoal(${g.id})">${g.text}</span>
        <span class="gx" onclick="window.deleteGoal(${g.id})">×</span>
      </div>
    `).join('');
  }

  window.toggleGoal = function(id) {
    const goals = getGoals();
    const g = goals.find(x => x.id === id);
    if (g) g.done = !g.done;
    saveGoals(goals);
    renderGoals();
  };

  window.deleteGoal = function(id) {
    saveGoals(getGoals().filter(x => x.id !== id));
    renderGoals();
  };

  function renderHistory() {
    const container = $('histContainer');
    if (!container) return;
    const goals = getGoals();
    if (goals.length === 0) {
      container.innerHTML = '<div class="hist-empty">Sem histórico ainda</div>';
      return;
    }
    // Group by date
    const grouped = {};
    goals.forEach(g => {
      const key = new Date(g.date).toLocaleDateString('pt-BR');
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(g);
    });

    container.innerHTML = Object.entries(grouped).reverse().map(([date, items]) => {
      const done = items.filter(i => i.done).length;
      return `
        <div class="hist-section">
          <div class="hist-date-header">
            <span class="hist-date-label">${date}</span>
            <span class="hist-date-stats">${done}/${items.length} concluídas</span>
          </div>
          ${items.map(i => `
            <div class="hist-row ${i.done ? 'done' : ''}">
              <div class="hchk ${i.done ? 'ok' : 'pend'}">✓</div>
              <span class="hlabel">${i.text}</span>
            </div>
          `).join('')}
        </div>
      `;
    }).join('');
  }

  // ═══ NOTES ═══
  let currentNote = null;

  function initNotes() { renderNotesList(); }

  function getNotes() { return JSON.parse(localStorage.getItem('rms_notes') || '[]'); }
  function saveNotes(n) { localStorage.setItem('rms_notes', JSON.stringify(n)); loadStats(); }

  function renderNotesList() {
    const app = $('notesApp');
    if (!app) return;
    const notes = getNotes();
    const colors = ['postit-yellow','postit-pink','postit-mint','postit-peach','postit-lilac','postit-sky'];

    app.innerHTML = `
      <div class="notes-grid">
        <div class="note-add-card" onclick="window.createNote()">
          <span>+</span>
          <small>Nova nota</small>
        </div>
        ${notes.map((n, i) => `
          <div class="note-card" style="background:var(--${n.color || colors[i % colors.length]});--rot:${(Math.random()*4-2).toFixed(1)}deg" onclick="window.openNote(${n.id})">
            <div class="note-card-del" onclick="event.stopPropagation();window.deleteNote(${n.id})">×</div>
            <div class="note-card-title">${n.title || 'Sem título'}</div>
            <div class="note-card-preview">${n.content || ''}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  window.createNote = function() {
    const notes = getNotes();
    const note = { id: Date.now(), title: '', content: '', color: 'postit-yellow', date: new Date().toISOString() };
    notes.push(note);
    saveNotes(notes);
    window.openNote(note.id);
  };

  window.openNote = function(id) {
    const notes = getNotes();
    const note = notes.find(n => n.id === id);
    if (!note) return;
    currentNote = note;

    const app = $('notesApp');
    if (!app) return;

    app.innerHTML = `
      <div class="note-editor">
        <div class="note-editor-header">
          <button class="note-back" onclick="window.closeNote()">← Voltar</button>
        </div>
        <input class="note-title-input" id="noteTitle" value="${note.title}" placeholder="Título da nota..." oninput="window.saveCurrentNote()">
        <textarea class="note-textarea" id="noteContent" placeholder="Escreva aqui..." oninput="window.saveCurrentNote()">${note.content}</textarea>
      </div>
    `;
  };

  window.closeNote = function() {
    currentNote = null;
    renderNotesList();
  };

  window.saveCurrentNote = function() {
    if (!currentNote) return;
    const notes = getNotes();
    const note = notes.find(n => n.id === currentNote.id);
    if (!note) return;
    const title = $('noteTitle');
    const content = $('noteContent');
    if (title) note.title = title.value;
    if (content) note.content = content.value;
    saveNotes(notes);
  };

  window.deleteNote = function(id) {
    saveNotes(getNotes().filter(n => n.id !== id));
    renderNotesList();
  };

  // ═══ STREAK ═══
  function initStreak() {
    const container = $('skD');
    const btn = $('skBtn');
    if (!container) return;

    const streakData = JSON.parse(localStorage.getItem('rms_streak_days') || '{}');
    const today = new Date();
    const dias = ['D','S','T','Q','Q','S','S'];

    let html = '';
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const isToday = i === 0;
      const isDone = streakData[key];
      html += `<div class="sd ${isDone ? 'ok' : ''} ${isToday ? 'now' : ''}">${dias[d.getDay()]}</div>`;
    }
    container.innerHTML = html;

    // Calculate streak
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      if (streakData[key]) streak++;
      else break;
    }
    localStorage.setItem('rms_streak', streak);

    if (btn) btn.onclick = () => {
      const key = new Date().toISOString().split('T')[0];
      streakData[key] = true;
      localStorage.setItem('rms_streak_days', JSON.stringify(streakData));
      initStreak();
      loadStats();
    };
  }

  // ═══ RETROLESSON ═══
  function initRetroLesson() {
    const container = $('rlC');
    if (!container) return;

    const challenges = [
      { type: 'JAVASCRIPT', title: 'Array Flatten', desc: 'Achate um array multidimensional', diff: 'easy' },
      { type: 'PYTHON', title: 'Palindrome Check', desc: 'Verifique se uma string é palíndromo', diff: 'easy' },
      { type: 'JAVASCRIPT', title: 'Debounce Function', desc: 'Implemente um debounce', diff: 'medium' },
      { type: 'ALGORITHM', title: 'Binary Search', desc: 'Busca binária em array ordenado', diff: 'medium' },
      { type: 'JAVASCRIPT', title: 'Promise.all', desc: 'Reimplemente Promise.all', diff: 'hard' },
    ];

    const c = challenges[Math.floor(Math.random() * challenges.length)];
    const diffClass = c.diff === 'easy' ? 'd-e' : c.diff === 'medium' ? 'd-m' : 'd-h';

    container.innerHTML = `
      <div class="rl-box">
        <div class="rl-type">${c.type}</div>
        <div class="rl-title">${c.title}</div>
        <div class="rl-desc">${c.desc}</div>
        <span class="rl-diff ${diffClass}">${c.diff.toUpperCase()}</span>
      </div>
    `;

    const rlNew = $('rlNew');
    if (rlNew) rlNew.onclick = initRetroLesson;
  }

  window.openLesson = function() {
    const panel = $('lessonPanel');
    const overlay = $('lessonOverlay');
    const iframe = $('lessonIframe');
    if (panel) panel.classList.add('open');
    if (overlay) overlay.classList.add('open');
    // Load lesson data from base64
    const lessonData = document.getElementById('lessonData');
    if (iframe && lessonData) {
      try {
        const html = atob(lessonData.textContent.trim());
        iframe.srcdoc = html;
      } catch(e) {
        iframe.srcdoc = '<h1 style="padding:2rem;font-family:sans-serif;">RetroLesson em breve!</h1>';
      }
    }
  };

  window.closeLesson = function() {
    const panel = $('lessonPanel');
    const overlay = $('lessonOverlay');
    if (panel) panel.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  };

  // ═══ INIT ═══
  function init() {
    handleSplashAutoFade();
    initProfile();

    // Se não tem splash (já passou), decide login ou hub
    const splash = $('splash');
    if (splash && splash.style.display === 'none') {
      if (auth && auth.isAuthenticated()) showHub();
      else showLogin();
    }

    // Pedir permissão de notificação
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

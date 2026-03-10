// ═══════════════════════════════════════════════════════
// RetroMynd i18n — Bilingual EN / PT-BR
// ═══════════════════════════════════════════════════════
(function() {
  'use strict';

  const LANG_KEY = 'rms_lang';

  // Default language
  let currentLang = localStorage.getItem(LANG_KEY) || 'pt';

  // ── Translation dictionaries ──
  const dict = {
    // ── Hub header / nav ──
    'Study Hub':                    { en: 'Study Hub',               pt: 'Study Hub' },
    'My Profile':                   { en: 'My Profile',              pt: 'Meu Perfil' },
    'Nome':                         { en: 'Name',                    pt: 'Nome' },
    'Email':                        { en: 'Email',                   pt: 'Email' },
    'Bio':                          { en: 'Bio',                     pt: 'Bio' },
    'bio_placeholder':              { en: 'A sentence about you...', pt: 'Uma frase sobre você...' },
    'Membro desde':                 { en: 'Member since',            pt: 'Membro desde' },
    'Sair da conta':                { en: 'Log out',                 pt: 'Sair da conta' },
    'Início':                       { en: 'Home',                    pt: 'Início' },
    'Entrar':                       { en: 'Log in',                  pt: 'Entrar' },
    'Estudante':                    { en: 'Student',                 pt: 'Estudante' },

    // ── Stats ──
    'Streak':                       { en: 'Streak',                  pt: 'Streak' },
    'Notas':                        { en: 'Notes',                   pt: 'Notas' },
    'Metas':                        { en: 'Goals',                   pt: 'Metas' },
    'Pomodoros':                    { en: 'Pomodoros',               pt: 'Pomodoros' },
    'Lessons':                      { en: 'Lessons',                 pt: 'Lições' },

    // ── Pomodoro ──
    'Pomodoro Timer':               { en: 'Pomodoro Timer',          pt: 'Pomodoro Timer' },
    'FOCUS':                        { en: 'FOCUS',                   pt: 'FOCO' },
    'FOCUS MODE':                   { en: 'FOCUS MODE',              pt: 'MODO FOCO' },
    'BREAK TIME':                   { en: 'BREAK TIME',              pt: 'INTERVALO' },
    'Break 5':                      { en: 'Break 5',                 pt: 'Pausa 5' },
    'Break 15':                     { en: 'Break 15',                pt: 'Pausa 15' },
    'Iniciar':                      { en: 'Start',                   pt: 'Iniciar' },
    'Continuar':                    { en: 'Resume',                  pt: 'Continuar' },
    'Pausar':                       { en: 'Pause',                   pt: 'Pausar' },
    'Reset':                        { en: 'Reset',                   pt: 'Resetar' },

    // ── Goals ──
    'Metas do Dia':                 { en: 'Daily Goals',             pt: 'Metas do Dia' },
    'DAILY':                        { en: 'DAILY',                   pt: 'DIÁRIO' },
    'Hoje':                         { en: 'Today',                   pt: 'Hoje' },
    'Historico':                     { en: 'History',                 pt: 'Histórico' },
    'goal_placeholder':             { en: 'Write a goal...',         pt: 'Escreva uma meta...' },
    'Anterior':                     { en: 'Previous',                pt: 'Anterior' },
    'Proxima':                      { en: 'Next',                    pt: 'Próxima' },
    'Todos':                        { en: 'All',                     pt: 'Todos' },
    'Concluidas':                   { en: 'Completed',               pt: 'Concluídas' },
    'Expiradas':                    { en: 'Expired',                 pt: 'Expiradas' },
    'Pendentes':                    { en: 'Pending',                 pt: 'Pendentes' },
    'Nenhuma meta hoje':            { en: 'No goals today',          pt: 'Nenhuma meta hoje' },
    'Nenhuma meta registrada ainda':{ en: 'No goals recorded yet',   pt: 'Nenhuma meta registrada ainda' },
    'Nenhuma meta com esse filtro': { en: 'No goals with this filter', pt: 'Nenhuma meta com esse filtro' },
    'DONE':                         { en: 'DONE',                    pt: 'FEITA' },
    'EXPIRED':                      { en: 'EXPIRED',                 pt: 'EXPIRADA' },
    'ACTIVE':                       { en: 'ACTIVE',                  pt: 'ATIVA' },
    'HOJE':                         { en: 'TODAY',                   pt: 'HOJE' },
    'LIVE':                         { en: 'LIVE',                    pt: 'AO VIVO' },

    // ── Notes ──
    'Caderno de Notas':             { en: 'Notebook',                pt: 'Caderno de Notas' },
    'NOTES':                        { en: 'NOTES',                   pt: 'NOTAS' },
    'Sem título':                   { en: 'Untitled',                pt: 'Sem título' },
    'Adicionar post-it...':         { en: 'Add a post-it...',        pt: 'Adicionar post-it...' },
    'Criada: ':                     { en: 'Created: ',               pt: 'Criada: ' },

    // ── Flashcards ──
    'Flashcards':                   { en: 'Flashcards',              pt: 'Flashcards' },
    'REVIEW':                       { en: 'REVIEW',                  pt: 'REVISÃO' },
    'Geral':                        { en: 'General',                 pt: 'Geral' },
    'Nome do deck...':              { en: 'Deck name...',            pt: 'Nome do deck...' },
    '+ Novo Deck':                  { en: '+ New Deck',              pt: '+ Novo Deck' },
    'pendentes hoje':               { en: 'due today',               pt: 'pendentes hoje' },
    'cards no deck':                { en: 'cards in deck',           pt: 'cards no deck' },
    'revisados':                    { en: 'reviewed',                pt: 'revisados' },
    'Frente (pergunta)...':         { en: 'Front (question)...',     pt: 'Frente (pergunta)...' },
    'Verso (resposta)...':          { en: 'Back (answer)...',        pt: 'Verso (resposta)...' },
    'Adicionar':                    { en: 'Add',                     pt: 'Adicionar' },
    'fc_empty':                     { en: 'No cards yet! Add your first flashcard',  pt: 'Nenhum card ainda! Adicione seu primeiro flashcard' },
    'Tudo em dia!':                 { en: 'All caught up!',          pt: 'Tudo em dia!' },
    'fc_no_review':                 { en: 'No cards to review now. Come back later or add new cards.', pt: 'Nenhum card para revisar agora. Volte mais tarde ou adicione novos cards.' },
    'fc_invalid_deck':              { en: 'Invalid or duplicate name', pt: 'Nome inválido ou já existe' },

    // ── RetroLesson ──
    'RetroLesson':                  { en: 'RetroLesson',             pt: 'RetroLesson' },
    'LEARN':                        { en: 'LEARN',                   pt: 'APRENDER' },
    'Novo Desafio':                 { en: 'New Challenge',           pt: 'Novo Desafio' },
    'Abrir RetroLesson':            { en: 'Open RetroLesson',        pt: 'Abrir RetroLesson' },

    // ── Quick Links ──
    'Links Rapidos':                { en: 'Quick Links',             pt: 'Links Rápidos' },
    'HUB':                          { en: 'HUB',                     pt: 'HUB' },
    'Streak da Semana':             { en: 'Week Streak',             pt: 'Streak da Semana' },
    'Marcar hoje':                  { en: 'Mark today',              pt: 'Marcar hoje' },

    // ── Code Snippets ──
    'Code Snippets':                { en: 'Code Snippets',           pt: 'Trechos de Código' },
    'CODE':                         { en: 'CODE',                    pt: 'CÓDIGO' },
    'Colapsar':                     { en: 'Collapse',                pt: 'Colapsar' },
    'Expandir':                     { en: 'Expand',                  pt: 'Expandir' },
    'Copiar código':                { en: 'Copy code',               pt: 'Copiar código' },
    'Excluir':                      { en: 'Delete',                  pt: 'Excluir' },
    'snip_empty':                   { en: 'No snippets saved. Paste your first code snippet!', pt: 'Nenhum snippet salvo. Cole seu primeiro trecho de código!' },
    'Código copiado!':              { en: 'Code copied!',            pt: 'Código copiado!' },

    // ── Achievements ──
    'Conquistas':                   { en: 'Achievements',            pt: 'Conquistas' },
    'BADGES':                       { en: 'BADGES',                  pt: 'MEDALHAS' },
    'conquistas desbloqueadas':     { en: 'achievements unlocked',   pt: 'conquistas desbloqueadas' },
    'Nova conquista':               { en: 'New achievement',         pt: 'Nova conquista' },

    // ── Mood Tracker ──
    'Mood Tracker':                 { en: 'Mood Tracker',            pt: 'Mood Tracker' },
    'MOOD':                         { en: 'MOOD',                    pt: 'HUMOR' },
    'Ótimo':                        { en: 'Great',                   pt: 'Ótimo' },
    'Bem':                          { en: 'Good',                    pt: 'Bem' },
    'Normal':                       { en: 'Neutral',                 pt: 'Normal' },
    'Mal':                          { en: 'Bad',                     pt: 'Mal' },
    'Péssimo':                      { en: 'Terrible',                pt: 'Péssimo' },

    // ── Status messages ──
    'Salvo na nuvem':               { en: 'Saved to cloud',          pt: 'Salvo na nuvem' },
    'Sessão expirada':              { en: 'Session expired! Please log in again.', pt: 'Sessão expirada! Faça login novamente.' },
    'Falha ao salvar':              { en: 'Cloud save failed. Data saved locally.', pt: 'Falha ao salvar na nuvem. Dados salvos localmente.' },
    'Salvando antes de sair':       { en: 'Saving before logout...',  pt: 'Salvando antes de sair...' },
    'Sincronizando':                { en: 'Syncing...',              pt: 'Sincronizando...' },
    'Dados sincronizados':          { en: 'Data synced',             pt: 'Dados sincronizados' },
    'Conectado':                    { en: 'Connected',               pt: 'Conectado' },
    'Sem internet':                 { en: 'No internet — local data OK', pt: 'Sem internet — dados locais OK' },
    'Timeout':                      { en: 'Timeout. Local data OK.', pt: 'Timeout. Dados locais OK.' },
    'Erro sync':                    { en: 'Sync error: ',            pt: 'Erro sync: ' },

    // ── Achievement titles + descriptions ──
    'Primeiro Passo':               { en: 'First Step',              pt: 'Primeiro Passo' },
    'Complete sua primeira meta':    { en: 'Complete your first goal', pt: 'Complete sua primeira meta' },
    'On Fire':                      { en: 'On Fire',                 pt: 'On Fire' },
    '3 dias de streak':             { en: '3-day streak',            pt: '3 dias de streak' },
    'Semana Perfeita':              { en: 'Perfect Week',            pt: 'Semana Perfeita' },
    '7 dias de streak seguidos':    { en: '7-day streak in a row',   pt: '7 dias de streak seguidos' },
    'Tomato Master':                { en: 'Tomato Master',           pt: 'Mestre do Tomate' },
    'Complete 10 pomodoros':        { en: 'Complete 10 pomodoros',   pt: 'Complete 10 pomodoros' },
    'Time Lord':                    { en: 'Time Lord',               pt: 'Senhor do Tempo' },
    'Complete 50 pomodoros':        { en: 'Complete 50 pomodoros',   pt: 'Complete 50 pomodoros' },
    'Rei do Foco':                  { en: 'Focus King',              pt: 'Rei do Foco' },
    'Complete 100 pomodoros':       { en: 'Complete 100 pomodoros',  pt: 'Complete 100 pomodoros' },
    'Escritor':                     { en: 'Writer',                  pt: 'Escritor' },
    'Crie 5 notas':                 { en: 'Create 5 notes',         pt: 'Crie 5 notas' },
    'Autor':                        { en: 'Author',                  pt: 'Autor' },
    'Crie 20 notas':                { en: 'Create 20 notes',        pt: 'Crie 20 notas' },
    'Focused':                      { en: 'Focused',                 pt: 'Focado' },
    'Complete 10 metas':            { en: 'Complete 10 goals',      pt: 'Complete 10 metas' },
    'Unstoppable':                  { en: 'Unstoppable',             pt: 'Imparável' },
    'Complete 50 metas':            { en: 'Complete 50 goals',      pt: 'Complete 50 metas' },
    'Night Owl':                    { en: 'Night Owl',               pt: 'Coruja Noturna' },
    'Estude depois da meia-noite':  { en: 'Study past midnight',    pt: 'Estude depois da meia-noite' },
    'Early Bird':                   { en: 'Early Bird',              pt: 'Madrugador' },
    'Estude antes das 7h':          { en: 'Study before 7 AM',      pt: 'Estude antes das 7h' },
    'Music Lover':                  { en: 'Music Lover',             pt: 'Amante da Música' },
    'Use o player de música':       { en: 'Use the music player',   pt: 'Use o player de música' },
    'Consistente':                  { en: 'Consistent',              pt: 'Consistente' },
    '14 dias de streak':            { en: '14-day streak',           pt: '14 dias de streak' },
    'Lendário':                     { en: 'Legendary',               pt: 'Lendário' },
    '30 dias de streak seguidos':   { en: '30-day streak in a row', pt: '30 dias de streak seguidos' },
    'Flash Start':                  { en: 'Flash Start',             pt: 'Flash Start' },
    'Crie seu primeiro flashcard':  { en: 'Create your first flashcard', pt: 'Crie seu primeiro flashcard' },
    'Card Collector':               { en: 'Card Collector',          pt: 'Colecionador de Cards' },
    'Tenha 50 flashcards criados':  { en: 'Have 50 flashcards',     pt: 'Tenha 50 flashcards criados' },
    'Deck Master':                  { en: 'Deck Master',             pt: 'Mestre dos Decks' },
    'Crie 3 decks de flashcards':   { en: 'Create 3 flashcard decks', pt: 'Crie 3 decks de flashcards' },
    'Code Keeper':                  { en: 'Code Keeper',             pt: 'Guardião do Código' },
    'Salve seu primeiro snippet':   { en: 'Save your first snippet', pt: 'Salve seu primeiro snippet' },
    'Snippet Library':              { en: 'Snippet Library',         pt: 'Biblioteca de Snippets' },
    'Salve 10 snippets de código':  { en: 'Save 10 code snippets',  pt: 'Salve 10 snippets de código' },
    'Polyglot':                     { en: 'Polyglot',                pt: 'Poliglota' },
    'Use 3+ linguagens nos snippets':{ en: 'Use 3+ languages in snippets', pt: 'Use 3+ linguagens nos snippets' },
    'Self-Aware':                   { en: 'Self-Aware',              pt: 'Autoconsciente' },
    '7 dias seguidos de check-in de humor': { en: '7 consecutive mood check-ins', pt: '7 dias seguidos de check-in de humor' },
    'Mindful Master':               { en: 'Mindful Master',          pt: 'Mestre da Atenção Plena' },
    '30 dias seguidos de check-in': { en: '30 consecutive check-ins', pt: '30 dias seguidos de check-in' },
    'Code Solver':                  { en: 'Code Solver',             pt: 'Resolvedor de Código' },
    'Complete sua primeira RetroLesson': { en: 'Complete your first RetroLesson', pt: 'Complete sua primeira RetroLesson' },
    'Code Graduate':                { en: 'Code Graduate',           pt: 'Graduado em Código' },
    'Complete 10 RetroLessons':     { en: 'Complete 10 RetroLessons', pt: 'Complete 10 RetroLessons' },

    // ── Days / Months ──
    'Domingo':  { en: 'Sunday',    pt: 'Domingo' },
    'Segunda':  { en: 'Monday',    pt: 'Segunda' },
    'Terça':    { en: 'Tuesday',   pt: 'Terça' },
    'Quarta':   { en: 'Wednesday', pt: 'Quarta' },
    'Quinta':   { en: 'Thursday',  pt: 'Quinta' },
    'Sexta':    { en: 'Friday',    pt: 'Sexta' },
    'Sábado':   { en: 'Saturday',  pt: 'Sábado' },
    'Dom': { en: 'Sun', pt: 'Dom' }, 'Seg': { en: 'Mon', pt: 'Seg' },
    'Ter': { en: 'Tue', pt: 'Ter' }, 'Qua': { en: 'Wed', pt: 'Qua' },
    'Qui': { en: 'Thu', pt: 'Qui' }, 'Sex': { en: 'Fri', pt: 'Sex' },
    'Sáb': { en: 'Sat', pt: 'Sáb' },
    'Jan': { en: 'Jan', pt: 'Jan' }, 'Fev': { en: 'Feb', pt: 'Fev' },
    'Mar': { en: 'Mar', pt: 'Mar' }, 'Abr': { en: 'Apr', pt: 'Abr' },
    'Mai': { en: 'May', pt: 'Mai' }, 'Jun': { en: 'Jun', pt: 'Jun' },
    'Jul': { en: 'Jul', pt: 'Jul' }, 'Ago': { en: 'Aug', pt: 'Ago' },
    'Set': { en: 'Sep', pt: 'Set' }, 'Out': { en: 'Oct', pt: 'Out' },
    'Nov': { en: 'Nov', pt: 'Nov' }, 'Dez': { en: 'Dec', pt: 'Dez' },
  };

  // ── Core API ──
  function t(key) {
    const entry = dict[key];
    if (!entry) return key;
    return entry[currentLang] || entry['pt'] || key;
  }

  function getLang() { return currentLang; }

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    applyToDOM();
    // Notify lesson iframe
    try {
      const iframe = document.getElementById('lessonIframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'setLang', lang: lang }, '*');
      }
    } catch(e) {}
    // Dispatch event for JS-rendered content to re-render
    window.dispatchEvent(new CustomEvent('langChange', { detail: { lang } }));
  }

  function toggleLang() {
    setLang(currentLang === 'pt' ? 'en' : 'pt');
  }

  // ── Apply translations to [data-i18n] elements ──
  function applyToDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = t(key);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.title = t(key);
    });
    // Update lang toggle button label
    const btn = document.getElementById('langToggle');
    if (btn) btn.textContent = currentLang === 'pt' ? 'EN' : 'PT';
  }

  // ── Expose globally ──
  window.i18n = { t, getLang, setLang, toggleLang, applyToDOM, dict };
  window.t = t;
})();

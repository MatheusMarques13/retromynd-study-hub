// Code Snippets Library
(function () {
  'use strict';

  var LS_KEY = 'rmSnippets';

  var LANGUAGES = ['JavaScript', 'Python', 'HTML', 'CSS', 'SQL', 'TypeScript', 'Java', 'C++', 'Other'];

  var LANG_COLORS = {
    'JavaScript': { bg: '#F7DF1E', text: '#1a1a1a' },
    'Python':     { bg: '#3776AB', text: '#fff' },
    'HTML':       { bg: '#E34F26', text: '#fff' },
    'CSS':        { bg: '#1572B6', text: '#fff' },
    'SQL':        { bg: '#336791', text: '#fff' },
    'TypeScript': { bg: '#3178C6', text: '#fff' },
    'Java':       { bg: '#007396', text: '#fff' },
    'C++':        { bg: '#00599C', text: '#fff' },
    'Other':      { bg: '#6B7280', text: '#fff' }
  };

  // ─── Storage ────────────────────────────────────────────────────────────────

  function loadSnippets() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
    catch (e) { return []; }
  }

  function saveSnippets(arr) {
    localStorage.setItem(LS_KEY, JSON.stringify(arr));
    if (window.markDirty) window.markDirty('snippets');
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  function escHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function codeWithLineNumbers(code) {
    return code.split('\n').map(function (line, i) {
      return '<span class="snip-ln">' + (i + 1) + '</span>' + escHtml(line);
    }).join('\n');
  }

  function langBadgeHtml(lang) {
    var c = LANG_COLORS[lang] || LANG_COLORS['Other'];
    return '<span class="snip-lang-badge" style="background:' + c.bg + ';color:' + c.text + '">' + escHtml(lang) + '</span>';
  }

  function fmtDate(iso) {
    try {
      var d = new Date(iso);
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch (e) { return ''; }
  }

  // ─── State ───────────────────────────────────────────────────────────────────

  var _expanded = {};
  var _filter = '';

  // ─── Render ──────────────────────────────────────────────────────────────────

  function buildExpandBtn(id, lineCount, isExp) {
    if (lineCount <= 3) return '';
    return '<button class="snip-expand-btn postit-btn" data-id="' + id + '">'
      + (isExp ? 'Colapsar &#9650;' : 'Expandir &#9660;') + '</button>';
  }

  function buildSnippetCard(s) {
    var isExp = !!_expanded[s.id];
    var lines = s.code.split('\n');
    var codeToShow = isExp ? s.code : lines.slice(0, 3).join('\n');
    var tagsHtml = (s.tags && s.tags.length)
      ? s.tags.map(function (t) { return '<span class="snip-tag">' + escHtml(t) + '</span>'; }).join('')
      : '';
    var expandBtn = buildExpandBtn(s.id, lines.length, isExp);

    return '<div class="snip-card" data-id="' + s.id + '">'
      + '<div class="snip-card-header">'
      +   '<span class="snip-card-title">' + escHtml(s.title) + '</span>'
      +   langBadgeHtml(s.language)
      +   '<span class="snip-card-actions">'
      +     '<button class="snip-copy-btn postit-btn" data-id="' + s.id + '" title="Copiar c\u00f3digo">&#128203;</button>'
      +     '<button class="snip-delete-btn postit-btn" data-id="' + s.id + '" title="Excluir">&#10005;</button>'
      +   '</span>'
      + '</div>'
      + '<pre class="snip-code-block' + (isExp ? ' snip-expanded' : '') + '">'
      + codeWithLineNumbers(codeToShow)
      + '</pre>'
      + '<div class="snip-card-footer">'
      +   '<div class="snip-tags">' + tagsHtml + '</div>'
      +   '<div class="snip-meta">'
      +     '<span class="snip-date">' + fmtDate(s.created) + '</span>'
      +     expandBtn
      +   '</div>'
      + '</div>'
      + '</div>';
  }

  function getFiltered() {
    var all = loadSnippets();
    if (!_filter.trim()) return all;
    var q = _filter.toLowerCase().trim();
    return all.filter(function (s) {
      return s.title.toLowerCase().indexOf(q) !== -1
        || s.language.toLowerCase().indexOf(q) !== -1
        || (s.tags && s.tags.some(function (t) { return t.toLowerCase().indexOf(q) !== -1; }));
    });
  }

  function render() {
    var container = document.getElementById('snipList');
    if (!container) return;
    var snippets = getFiltered();
    if (!snippets.length) {
      container.innerHTML = '<div class="snip-empty">Nenhum snippet salvo. Cole seu primeiro trecho de c\u00f3digo! \uD83D\uDCBB</div>';
      return;
    }
    container.innerHTML = snippets.map(buildSnippetCard).join('');

    container.querySelectorAll('.snip-copy-btn').forEach(function (btn) {
      btn.onclick = function () { copySnippet(btn.dataset.id); };
    });
    container.querySelectorAll('.snip-delete-btn').forEach(function (btn) {
      btn.onclick = function () { deleteSnippet(btn.dataset.id); };
    });
    container.querySelectorAll('.snip-expand-btn').forEach(function (btn) {
      btn.onclick = function () { toggleExpand(btn.dataset.id); };
    });
  }

  // ─── Actions ─────────────────────────────────────────────────────────────────

  function copySnippet(id) {
    var all = loadSnippets();
    var s = all.find(function (item) { return item.id === id; });
    if (!s) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(s.code).then(function () { showToast('C\u00f3digo copiado! \uD83D\uDCCB'); });
    } else {
      var ta = document.createElement('textarea');
      ta.value = s.code;
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); showToast('C\u00f3digo copiado! \uD83D\uDCCB'); } catch (e) {}
      document.body.removeChild(ta);
    }
  }

  function deleteSnippet(id) {
    if (!confirm('Excluir este snippet?')) return;
    var all = loadSnippets().filter(function (x) { return x.id !== id; });
    saveSnippets(all);
    delete _expanded[id];
    render();
  }

  function toggleExpand(id) {
    _expanded[id] = !_expanded[id];
    render();
  }

  function showToast(msg) {
    var t = document.getElementById('snipToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'snipToast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.className = 'snip-toast snip-toast-show';
    clearTimeout(t._tmr);
    t._tmr = setTimeout(function () { t.className = 'snip-toast'; }, 2300);
  }

  // ─── Init ────────────────────────────────────────────────────────────────────

  function initSnippetsApp() {
    var container = document.getElementById('snippetsApp');
    if (!container) return;

    var langOpts = LANGUAGES.map(function (l) {
      return '<option value="' + l + '">' + l + '</option>';
    }).join('');

    container.innerHTML = ''
      + '<div class="snip-search-row">'
      +   '<input type="text" id="snipSearch" class="snip-search" placeholder="&#128269; Filtrar por t\u00edtulo, linguagem ou tag\u2026" autocomplete="off">'
      + '</div>'
      + '<div class="snip-form" id="snipForm">'
      +   '<div class="snip-form-row">'
      +     '<input type="text" id="snipTitle" class="snip-input" placeholder="T\u00edtulo do snippet" autocomplete="off" maxlength="100">'
      +     '<select id="snipLang" class="snip-select">' + langOpts + '</select>'
      +   '</div>'
      +   '<textarea id="snipCode" class="snip-textarea" placeholder="Cole seu c\u00f3digo aqui\u2026" spellcheck="false"></textarea>'
      +   '<div class="snip-form-row snip-form-bottom">'
      +     '<input type="text" id="snipTags" class="snip-input snip-tags-input" placeholder="Tags (separadas por v\u00edrgula)" autocomplete="off" maxlength="200">'
      +     '<button type="button" id="snipSaveBtn" class="snip-save-btn postit-btn">Salvar &#128190;</button>'
      +   '</div>'
      + '</div>'
      + '<div class="snip-list" id="snipList"></div>';

    document.getElementById('snipSearch').addEventListener('input', function () {
      _filter = this.value;
      render();
    });

    document.getElementById('snipSaveBtn').addEventListener('click', function () {
      var titleEl = document.getElementById('snipTitle');
      var codeEl  = document.getElementById('snipCode');
      var title   = titleEl.value.trim();
      var lang    = document.getElementById('snipLang').value;
      var code    = codeEl.value;
      var tagsRaw = document.getElementById('snipTags').value;

      if (!title) { titleEl.focus(); showToast('Adicione um t\u00edtulo! \u270F\uFE0F'); return; }
      if (!code.trim()) { codeEl.focus(); showToast('Cole o c\u00f3digo! \uD83D\uDCBB'); return; }

      var tags = tagsRaw.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
      var now  = new Date().toISOString();
      var snippet = { id: generateId(), title: title, language: lang, code: code, tags: tags, created: now, updated: now };

      var all = loadSnippets();
      all.unshift(snippet);
      saveSnippets(all);

      document.getElementById('snipTitle').value = '';
      document.getElementById('snipCode').value  = '';
      document.getElementById('snipTags').value  = '';
      document.getElementById('snipLang').value  = LANGUAGES[0];

      render();
      showToast('Snippet salvo! \uD83C\uDF89');
    });

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSnippetsApp);
  } else {
    initSnippetsApp();
  }

  // Re-render when cloud sync updates localStorage
  window.addEventListener('rmCloudSync', function() {
    render();
  });
})();

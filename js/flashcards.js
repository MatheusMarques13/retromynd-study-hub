/* ============================================================
   RetroMynd Flashcards — SM-2 inspired spaced repetition
   localStorage key: rmFlashcards
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'rmFlashcards';
  var DEFAULT_DECK = 'Geral';

  /* ── State ── */
  var state = {
    data: { decks: {} },     // persisted
    activeDeck: DEFAULT_DECK,
    reviewQueue: [],          // cards due today in review order
    reviewIndex: 0,
    flipped: false,
    reviewedToday: 0,
    addingDeck: false         // true while showing inline new-deck form
  };

  /* ────────────────── Persistence ────────────────── */

  function loadData() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && parsed.decks) {
          state.data = parsed;
        }
      }
    } catch (e) {}
    // Ensure default deck exists
    if (!state.data.decks[DEFAULT_DECK]) {
      state.data.decks[DEFAULT_DECK] = [];
    }
  }

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
    } catch (e) {}
  }

  /* ────────────────── Date Helpers (timezone-safe) ────────────────── */

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  // Returns local date as "YYYY-MM-DD"
  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  // Adds n days to a "YYYY-MM-DD" string using local timezone
  function addDays(dateStr, n) {
    var parts = dateStr.split('-');
    var d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    d.setDate(d.getDate() + Math.max(1, Math.round(n)));
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  /* ────────────────── SM-2 Algorithm ────────────────── */

  function rateCard(card, rating) {
    // rating: "hard" | "good" | "easy"
    var today = todayStr();
    card.repetitions = (card.repetitions || 0) + 1;

    if (rating === 'hard') {
      card.interval = Math.max(1, (card.interval || 1) * 0.5);
      card.easeFactor = Math.max(1.3, (card.easeFactor || 2.5) - 0.2);
    } else if (rating === 'good') {
      card.interval = Math.max(1, (card.interval || 1) * (card.easeFactor || 2.5));
      // easeFactor stays
    } else { // easy
      card.interval = Math.max(1, (card.interval || 1) * (card.easeFactor || 2.5) * 1.3);
      card.easeFactor = (card.easeFactor || 2.5) + 0.15;
    }

    card.dueDate = addDays(today, card.interval);
    return card;
  }

  /* ────────────────── Card CRUD ────────────────── */

  function addCard(front, back) {
    var today = todayStr();
    var card = {
      front: front.trim(),
      back: back.trim(),
      interval: 1,
      easeFactor: 2.5,
      dueDate: today,
      repetitions: 0,
      created: today
    };
    state.data.decks[state.activeDeck].push(card);
    saveData();
    return card;
  }

  function createDeck(name) {
    var trimmed = name.trim();
    if (!trimmed || state.data.decks[trimmed]) return null;
    state.data.decks[trimmed] = [];
    saveData();
    return trimmed;
  }

  /* ────────────────── Review Queue ────────────────── */

  // Rebuilds queue WITHOUT resetting reviewedToday (caller manages that)
  function buildReviewQueue() {
    var today = todayStr();
    var cards = state.data.decks[state.activeDeck] || [];
    state.reviewQueue = cards
      .map(function (card, i) { return { card: card, index: i }; })
      .filter(function (item) { return item.card.dueDate <= today; });
    state.reviewIndex = 0;
    state.flipped = false;
  }

  /* ────────────────── Stats ────────────────── */

  function getStats() {
    var today = todayStr();
    var cards = state.data.decks[state.activeDeck] || [];
    var due = cards.filter(function (c) { return c.dueDate <= today; }).length;
    return {
      due: due,
      total: cards.length,
      reviewedToday: state.reviewedToday
    };
  }

  /* ────────────────── Rendering ────────────────── */

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function render() {
    var root = document.getElementById('flashcardsApp');
    if (!root) return;

    var deckNames = Object.keys(state.data.decks);
    var stats = getStats();
    var cards = state.data.decks[state.activeDeck] || [];
    var currentItem = state.reviewQueue[state.reviewIndex] || null;

    var html = '';

    /* Deck tabs */
    html += '<div class="fc-deck-tabs">';
    deckNames.forEach(function (name) {
      html += '<button class="fc-deck-tab postit-btn' + (name === state.activeDeck ? ' on' : '') + '" data-fc-deck="' + esc(name) + '">' + esc(name) + '</button>';
    });
    if (state.addingDeck) {
      html += '<input class="fc-input" id="fcNewDeckInput" placeholder="Nome do deck..." autocomplete="off" style="width:140px;flex:none">';
      html += '<button class="fc-add-btn postit-btn" id="fcNewDeckConfirm">OK</button>';
      html += '<button class="fc-deck-new postit-btn" id="fcNewDeckCancel">&#215;</button>';
    } else {
      html += '<button class="fc-deck-new postit-btn" id="fcNewDeck">+ Novo Deck</button>';
    }
    html += '</div>';

    /* Stats row */
    html += '<div class="fc-stats-row">';
    html += '<div class="fc-stat fc-stat-due"><span class="fc-stat-num">' + stats.due + '</span>&nbsp;pendentes hoje</div>';
    html += '<div class="fc-stat"><span class="fc-stat-num">' + stats.total + '</span>&nbsp;cards no deck</div>';
    html += '<div class="fc-stat fc-stat-done"><span class="fc-stat-num">' + stats.reviewedToday + '</span>&nbsp;revisados</div>';
    html += '</div>';

    /* Add card form */
    html += '<div class="fc-add-row">';
    html += '<input class="fc-input" id="fcFront" placeholder="Frente (pergunta)..." autocomplete="off">';
    html += '<input class="fc-input" id="fcBack" placeholder="Verso (resposta)..." autocomplete="off">';
    html += '<button class="fc-add-btn postit-btn" id="fcAddBtn">Adicionar</button>';
    html += '</div>';

    /* Divider */
    html += '<div class="px-div"></div>';

    /* Review area */
    if (cards.length === 0) {
      html += '<div class="fc-empty">Nenhum card ainda! Adicione seu primeiro flashcard &#10024;</div>';
    } else if (state.reviewQueue.length === 0 || state.reviewIndex >= state.reviewQueue.length) {
      /* All done */
      html += '<div class="fc-all-done">';
      html += '<div class="fc-all-done-icon">&#127881;</div>';
      html += '<div class="fc-all-done-text">Tudo em dia!</div>';
      html += '<div class="fc-all-done-sub">Nenhum card para revisar agora. Volte mais tarde ou adicione novos cards.</div>';
      html += '</div>';
    } else {
      /* Active review card */
      var card = currentItem.card;
      var queueLen = state.reviewQueue.length;
      var pos = state.reviewIndex + 1;

      html += '<div class="fc-card-count">CARD ' + pos + ' / ' + queueLen + '</div>';
      html += '<div class="fc-scene">';
      html += '<div class="fc-card-wrapper' + (state.flipped ? ' flipped' : '') + '" id="fcCardWrapper">';
      html += '<div class="fc-face fc-front"><span class="fc-face-label">FRENTE</span><span class="fc-face-text">' + esc(card.front) + '</span></div>';
      html += '<div class="fc-face fc-back"><span class="fc-face-label">VERSO</span><span class="fc-face-text">' + esc(card.back) + '</span></div>';
      html += '</div>';
      html += '</div>';

      if (!state.flipped) {
        html += '<div class="fc-hint">Clique no card para revelar a resposta</div>';
      } else {
        html += '<div class="fc-rating-row">';
        html += '<button class="fc-rating-btn fc-rating-hard" data-fc-rate="hard">&#128551; Dif&iacute;cil</button>';
        html += '<button class="fc-rating-btn fc-rating-good" data-fc-rate="good">&#128077; Bom</button>';
        html += '<button class="fc-rating-btn fc-rating-easy" data-fc-rate="easy">&#11088; F&aacute;cil</button>';
        html += '</div>';
      }
    }

    root.innerHTML = html;
    attachEvents(root);
  }

  /* ────────────────── Event Binding ────────────────── */

  function attachEvents(root) {
    /* Deck tab clicks */
    root.querySelectorAll('[data-fc-deck]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.activeDeck = btn.getAttribute('data-fc-deck');
        state.reviewedToday = 0;  // reset counter when switching decks
        buildReviewQueue();
        render();
      });
    });

    /* New deck: show inline form */
    var newDeckBtn = root.querySelector('#fcNewDeck');
    if (newDeckBtn) {
      newDeckBtn.addEventListener('click', function () {
        state.addingDeck = true;
        render();
        var input = document.getElementById('fcNewDeckInput');
        if (input) input.focus();
      });
    }

    /* New deck: confirm */
    function confirmNewDeck() {
      var input = document.getElementById('fcNewDeckInput');
      var name = input ? input.value : '';
      var created = createDeck(name);
      if (created) {
        state.activeDeck = created;
        state.reviewedToday = 0;
        state.addingDeck = false;
        buildReviewQueue();
        render();
      } else if (input) {
        input.style.borderColor = 'var(--pink)';
        input.placeholder = 'Nome inv\u00e1lido ou j\u00e1 existe';
        input.value = '';
        input.focus();
      }
    }

    var confirmBtn = root.querySelector('#fcNewDeckConfirm');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', confirmNewDeck);
    }

    /* New deck: cancel */
    var cancelBtn = root.querySelector('#fcNewDeckCancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function () {
        state.addingDeck = false;
        render();
      });
    }

    /* New deck: keyboard on inline input */
    var newDeckInput = root.querySelector('#fcNewDeckInput');
    if (newDeckInput) {
      newDeckInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { confirmNewDeck(); }
        if (e.key === 'Escape') { state.addingDeck = false; render(); }
      });
    }

    /* Add card button */
    var addBtn = root.querySelector('#fcAddBtn');
    var frontInput = root.querySelector('#fcFront');
    var backInput = root.querySelector('#fcBack');

    function doAdd() {
      var front = frontInput ? frontInput.value : '';
      var back = backInput ? backInput.value : '';
      if (!front.trim() || !back.trim()) {
        if (frontInput && !frontInput.value.trim()) frontInput.focus();
        else if (backInput) backInput.focus();
        return;
      }
      addCard(front, back);
      // Rebuild queue but preserve reviewedToday
      var prevReviewed = state.reviewedToday;
      buildReviewQueue();
      state.reviewedToday = prevReviewed;
      render();
      // Refocus front input after re-render
      var newFront = document.getElementById('fcFront');
      if (newFront) newFront.focus();
    }

    if (addBtn) {
      addBtn.addEventListener('click', doAdd);
    }
    if (backInput) {
      backInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') doAdd();
      });
    }
    if (frontInput) {
      frontInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && backInput) backInput.focus();
      });
    }

    /* Card flip */
    var wrapper = root.querySelector('#fcCardWrapper');
    if (wrapper) {
      wrapper.addEventListener('click', function () {
        if (!state.flipped) {
          state.flipped = true;
          render();
        }
      });
    }

    /* Rating buttons */
    root.querySelectorAll('[data-fc-rate]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var rating = btn.getAttribute('data-fc-rate');
        var item = state.reviewQueue[state.reviewIndex];
        if (!item) return;
        rateCard(item.card, rating);
        saveData();
        state.reviewedToday++;
        state.reviewIndex++;
        state.flipped = false;
        render();
      });
    });
  }

  /* ────────────────── Init ────────────────── */

  function init() {
    var root = document.getElementById('flashcardsApp');
    if (!root) return;
    loadData();
    buildReviewQueue();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

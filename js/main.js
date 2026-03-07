// =============================================================================
// MAIN.JS - RetroMynd Study Hub
// PERSISTENCE: Server-first. Load from server on boot, fallback to localStorage.
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
          console.log('[RetroMynd] ☁️ Saved:', type);
          this._retryCount = 0;
        } catch (e) {
          allOk = false;
          console.warn('[RetroMynd] ❌ Save failed:', type, e.message);
          for (const key of dirtyKeys) {
            const mapper = this._serverMap[key];
            if (mapper && mapper().type === type) this._dirty.add(key);
          }
          if (e.message && (e.message.includes('401') || e.message.toLowerCase().includes('token') || e.message.toLowerCase().includes('expirado'))) {
            console.error('[RetroMynd] 🔑 Token expired/invalid!');
            showSaveStatus('error', 'Sessão expirada! Faça login novamente.');
            break;
          }
        }
      }

      this._saving = false;
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

  window.addEventListener('beforeunload', () => store.flushSync());
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

  // (Continue with rest of main.js - profile, hub, sync, goals, notes, etc...)
  // [REST OF THE FILE REMAINS EXACTLY THE SAME]

// API Client - Offline-first: funciona com ou sem backend
const API_URL = 'https://retromynd-study-hub-backend.onrender.com';
let backendOnline = false;

const api = {
  async checkHealth() {
    try {
      const r = await fetch(`${API_URL}/api/health`, { signal: AbortSignal.timeout(4000) });
      backendOnline = r.ok;
    } catch(e) { backendOnline = false; }
    console.log('[RetroMynd] Backend:', backendOnline ? 'ONLINE' : 'OFFLINE (usando localStorage)');
    return backendOnline;
  },

  async call(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    };
    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'API Error');
    }
    return response.json();
  },
  get(e) { return this.call(e, { method: 'GET' }); },
  post(e, d) { return this.call(e, { method: 'POST', body: JSON.stringify(d) }); },
  put(e, d) { return this.call(e, { method: 'PUT', body: JSON.stringify(d) }); },
  delete(e) { return this.call(e, { method: 'DELETE' }); },
  isOnline() { return backendOnline; }
};

window.api = api;

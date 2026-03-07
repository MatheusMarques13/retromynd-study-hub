// API Client - Aponta pro mesmo domínio Vercel (serverless functions)
const API_URL = '';

const api = {
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
      const errorMsg = error.detail || error.error || error.message || `HTTP ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.code = error.code;
      err.hint = error.hint;
      err.fullError = error;
      console.error('[API Error]', endpoint, response.status, error);
      throw err;
    }
    return response.json();
  },
  get(e) { return this.call(e, { method: 'GET' }); },
  post(e, d) { return this.call(e, { method: 'POST', body: JSON.stringify(d) }); },
  put(e, d) { return this.call(e, { method: 'PUT', body: JSON.stringify(d) }); },
  delete(e) { return this.call(e, { method: 'DELETE' }); }
};

window.api = api;

// AUTH - Offline-first: funciona com localStorage quando backend offline
const AUTH_KEY = 'rms_auth';
const USER_KEY = 'rms_user';
const USERS_DB = 'rms_users_db';

const auth = {
  async login(email, password) {
    // Tenta backend primeiro
    if (api.isOnline()) {
      try {
        const data = await api.post('/api/auth/login', { email, password });
        this.setAuth(data.token, data.user);
        return data;
      } catch(e) { /* fallback local */ }
    }
    // Fallback: localStorage
    const users = JSON.parse(localStorage.getItem(USERS_DB) || '{}');
    const user = users[email.toLowerCase()];
    if (!user) throw new Error('Conta não encontrada. Cadastre-se!');
    if (user.password !== this._hash(password)) throw new Error('Senha incorreta');
    const token = 'local_' + Date.now();
    this.setAuth(token, { email: user.email, name: user.name });
    return { token, user: { email: user.email, name: user.name } };
  },

  async register(email, password, name) {
    if (!email || !password || !name) throw new Error('Preencha todos os campos');
    if (password.length < 4) throw new Error('Senha deve ter pelo menos 4 caracteres');

    // Tenta backend primeiro
    if (api.isOnline()) {
      try {
        const data = await api.post('/api/auth/register', { email, password, name });
        this.setAuth(data.token, data.user);
        this._saveLocal(email, password, name);
        return data;
      } catch(e) { /* fallback local */ }
    }
    // Fallback: localStorage
    const users = JSON.parse(localStorage.getItem(USERS_DB) || '{}');
    const key = email.toLowerCase();
    if (users[key]) throw new Error('Email já cadastrado');
    users[key] = { email, name, password: this._hash(password) };
    localStorage.setItem(USERS_DB, JSON.stringify(users));
    const token = 'local_' + Date.now();
    this.setAuth(token, { email, name });
    return { token, user: { email, name } };
  },

  _hash(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; }
    return 'h_' + Math.abs(h).toString(36);
  },

  _saveLocal(email, password, name) {
    const users = JSON.parse(localStorage.getItem(USERS_DB) || '{}');
    users[email.toLowerCase()] = { email, name, password: this._hash(password) };
    localStorage.setItem(USERS_DB, JSON.stringify(users));
  },

  setAuth(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser() {
    const u = localStorage.getItem(USER_KEY);
    return u ? JSON.parse(u) : null;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem(USER_KEY);
    window.location.reload();
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};

window.auth = auth;

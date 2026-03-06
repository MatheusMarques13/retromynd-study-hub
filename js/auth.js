// AUTH - Usa Vercel serverless + Supabase
const USER_KEY = 'rms_user';

const auth = {
  async login(email, password) {
    const data = await api.post('/api/auth/login', { email, password });
    this.setAuth(data.token, data.user);
    return data;
  },

  async register(email, password, name) {
    const data = await api.post('/api/auth/register', { email, password, name });
    this.setAuth(data.token, data.user);
    return data;
  },

  async getMe() {
    return api.get('/api/auth/me');
  },

  async updateProfile(updates) {
    return api.put('/api/auth/profile', updates);
  },

  async loadData(dataType) {
    return api.get(`/api/data/load?type=${dataType}`);
  },

  async saveData(dataType, data) {
    return api.post('/api/data/save', { data_type: dataType, data });
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
    window.location.href = '/login.html';
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};

window.auth = auth;

const AUTH_KEY = 'rms_auth';
const USER_KEY = 'rms_user';

const auth = {
  async login(email, password) {
    try {
      const data = await api.post('/api/auth/login', { email, password });
      this.setAuth(data.token, data.user);
      return data;
    } catch (err) {
      throw err;
    }
  },
  
  async register(email, password, name) {
    try {
      const data = await api.post('/api/auth/register', { email, password, name });
      this.setAuth(data.token, data.user);
      return data;
    } catch (err) {
      throw err;
    }
  },
  
  setAuth(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  
  getUser() {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
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
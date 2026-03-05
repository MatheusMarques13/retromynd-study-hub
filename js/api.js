const API_URL = 'https://retromynd-study-hub-backend.onrender.com';

const api = {
  async call(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    };
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API Error');
      }
      
      return await response.json();
    } catch (err) {
      console.error('API Error:', err);
      throw err;
    }
  },
  
  get(endpoint) {
    return this.call(endpoint, { method: 'GET' });
  },
  
  post(endpoint, data) {
    return this.call(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  put(endpoint, data) {
    return this.call(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  delete(endpoint) {
    return this.call(endpoint, { method: 'DELETE' });
  }
};

window.api = api;
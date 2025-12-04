const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('access_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('access_token');
  }

  getToken() {
    return this.token;
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Request failed');
    }

    return response.json();
  }

  // User endpoints
  async register(userData) {
    return this.request('/users/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    const token = await this.request('/users/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    this.setToken(token.access_token);
    return token;
  }

  async getUsers() {
    return this.request('/users/');
  }

  // Master endpoints
  async getMasters() {
    return this.request('/master/');
  }

  async createMaster(data) {
    return this.request('/master/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteMaster(id) {
    return this.request(`/master/${id}`, {
      method: 'DELETE',
    });
  }

  // Service endpoints
  async getServices() {
    return this.request('/service/');
  }

  async createService(data) {
    return this.request('/service/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteService(id) {
    return this.request(`/service/${id}`, {
      method: 'DELETE',
    });
  }

  // Appointment endpoints
  async getAppointments() {
    return this.request('/appointment/');
  }

  async createAppointment(data) {
    return this.request('/appointment/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteAppointment(id) {
    return this.request(`/appointment/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();

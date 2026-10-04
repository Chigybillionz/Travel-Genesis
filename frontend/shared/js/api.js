/**
 * TravelGenesis - Central API Client & Auth Manager
 * Connects frontend views to the Express backend API.
 */

const API_BASE_URL = window.TRAVEL_API_URL || 'http://localhost:5001/api';

const TOKEN_KEY = 'tg_auth_token';
const USER_KEY = 'tg_user';

const API = {
  baseUrl: API_BASE_URL,

  // ==========================================
  // Auth Token & Local State Management
  // ==========================================
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token) {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  getUser() {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error parsing stored user data:', e);
      return null;
    }
  },

  setUser(user) {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      // Also sync existing legacy keys for backward-compatibility with UI templates
      if (user.name) {
        const firstName = user.name.split(' ')[0];
        localStorage.setItem('userName', firstName);
        localStorage.setItem('userFullName', user.name);
      }
      if (user.email) {
        localStorage.setItem('userEmail', user.email);
      }
      if (user.location) {
        localStorage.setItem('userLocation', user.location);
      }
      if (user.avatarUrl) {
        localStorage.setItem('userAvatar', user.avatarUrl);
      }
    } else {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem('userName');
      localStorage.removeItem('userFullName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userLocation');
      localStorage.removeItem('userAvatar');
    }
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  logout() {
    this.setToken(null);
    this.setUser(null);
  },

  // ==========================================
  // Base Request Method
  // ==========================================
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        const errorMessage =
          (data && (data.message || data.error)) ||
          `Request failed with status ${response.status}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Unable to connect to backend server. Make sure it is running on port 5001.');
      }
      throw err;
    }
  },

  // ==========================================
  // Auth Endpoints (Phase 2)
  // ==========================================
  auth: {
    async register({ name, email, password, location }) {
      const res = await API.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, location }),
      });
      if (res.token) API.setToken(res.token);
      if (res.user) API.setUser(res.user);
      return res;
    },

    async login({ email, password }) {
      const res = await API.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (res.token) API.setToken(res.token);
      if (res.user) API.setUser(res.user);
      return res;
    },

    async getMe() {
      return await API.request('/auth/me', {
        method: 'GET',
      });
    },
  },

  // ==========================================
  // User Profile Endpoints (Phase 2)
  // ==========================================
  users: {
    async getProfile() {
      const res = await API.request('/users/profile', {
        method: 'GET',
      });
      if (res.user) API.setUser(res.user);
      return res;
    },

    async updateProfile(updates) {
      const res = await API.request('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      if (res.user) API.setUser(res.user);
      return res;
    },
  },

  // ==========================================
  // Flights Endpoints (Phase 3)
  // ==========================================
  flights: {
    async getAll() {
      return await API.request('/flights', { method: 'GET' });
    },

    async search(params = {}) {
      const query = new URLSearchParams(params).toString();
      return await API.request(`/flights/search?${query}`, { method: 'GET' });
    },

    async getById(id) {
      return await API.request(`/flights/${id}`, { method: 'GET' });
    },
  },

  // ==========================================
  // Destinations Endpoints (Phase 3)
  // ==========================================
  destinations: {
    async getExplore() {
      return await API.request('/destinations/explore', { method: 'GET' });
    },

    async getById(id) {
      return await API.request(`/destinations/${id}`, { method: 'GET' });
    },
  },

  // ==========================================
  // Bookings Endpoints (Phase 4)
  // ==========================================
  bookings: {
    async create(bookingData) {
      return await API.request('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
    },

    async getMyTrips() {
      return await API.request('/bookings/my-trips', { method: 'GET' });
    },

    async cancel(id, reason) {
      return await API.request(`/bookings/${id}/cancel`, {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      });
    },
  },

  // ==========================================
  // Notifications Endpoints (Phase 5)
  // ==========================================
  notifications: {
    async getAll() {
      return await API.request('/notifications', { method: 'GET' });
    },

    async markAsRead(id) {
      return await API.request(`/notifications/${id}/read`, { method: 'PATCH' });
    },

    async markAllAsRead() {
      return await API.request('/notifications/read-all', { method: 'PATCH' });
    },
  },
};

// Export to window for vanilla HTML script loading
if (typeof window !== 'undefined') {
  window.API = API;
}

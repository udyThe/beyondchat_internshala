import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const articleAPI = {
  // Get all articles
  getAll: async () => {
    const response = await api.get('/articles');
    return response.data;
  },

  // Get article by ID
  getById: async (id) => {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  },

  // Get latest article
  getLatest: async () => {
    const response = await api.get('/articles/latest');
    return response.data;
  },

  // Create article
  create: async (data) => {
    const response = await api.post('/articles', data);
    return response.data;
  },

  // Update article
  update: async (id, data) => {
    const response = await api.put(`/articles/${id}`, data);
    return response.data;
  },

  // Delete article
  delete: async (id) => {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
  },
};

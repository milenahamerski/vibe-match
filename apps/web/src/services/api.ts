import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Adiciona o token JWT no cabeçalho das requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vibe_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

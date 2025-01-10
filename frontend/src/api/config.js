// frontend/src/api/config.js
import axios from 'axios';

// Geliştirme ortamında docker container içinden backend'e erişim
const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8082'  // Local geliştirme için
  : process.env.REACT_APP_API_URL;  // Production için

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
});

// Hata yakalama interceptor'ı
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Hatası:', error);
    if (error.code === 'ECONNREFUSED') {
      console.error('Backend bağlantısı kurulamadı');
    }
    return Promise.reject(error);
  }
);

export default api;
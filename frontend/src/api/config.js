// frontend/src/api/config.js
import axios from 'axios';

// API URL'i environment variable'dan al
const API_URL = process.env.REACT_APP_API_URL;

// Axios instance oluştur
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000 // 10 saniye
});

export default api;
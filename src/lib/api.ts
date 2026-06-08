import axios from 'axios';

const isProd = process.env.NODE_ENV === 'production';
const baseURL = isProd ? 'https://api.freebucks.host' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000');

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('freebucks_token') : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Prevent browser caching for all API requests
  if (config.headers) {
    config.headers['Cache-Control'] = 'no-cache';
    config.headers['Pragma'] = 'no-cache';
    config.headers['Expires'] = '0';
  }
  
  return config;
});

export const handleApiError = (error: any) => {
  if (error.response?.data?.details) {
    const detailString = error.response.data.details.map((d: any) => `${d.path}: ${d.message}`).join(', ');
    return `${error.response.data.error} - ${detailString}`;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  return error.message || 'An unknown error occurred';
};

export default api;

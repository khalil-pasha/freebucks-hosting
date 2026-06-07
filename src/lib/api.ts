import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('freebucks_token') : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
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

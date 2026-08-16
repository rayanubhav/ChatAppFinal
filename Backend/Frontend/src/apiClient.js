import axios from 'axios';

// Get the base URL from the .env file
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`, // All API routes start with /api
  withCredentials: true,
});

export default apiClient;
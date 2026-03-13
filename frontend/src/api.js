import axios from 'axios';

// Use environment variable for backend URL
const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api' });

// This automatically sends your Admin Token to the server
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers['x-auth-token'] = token;
    }
    return req;
});

export const login = (formData) => API.post('/auth/login', formData);
export const fetchData = () => API.get('/data');
export const addEntry = (data) => API.post('/data', data);
export const deleteEntry = (id) => API.delete(`/data/${id}`);

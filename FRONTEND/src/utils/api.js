import axios from 'axios';
import store from '@/redux/store';
import { setUser } from '@/redux/authSlice';
import { BACKEND_URL } from './constants';

const api = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            const isPublicPath = currentPath === '/' || currentPath === '/login' || currentPath === '/signup' || currentPath === '/jobs' || currentPath.startsWith('/description');
            
            // Only force logout if the user was on an authenticated route
            if (!isPublicPath) {
                store.dispatch(setUser(null));
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;

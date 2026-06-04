import api from './api';

export const register = (name, email, password) => {
  return api.post('/auth/register/', { name, email, password });
};

export const login = async (email, password) => {
  const res = await api.post('/auth/login/', { email, password });
  localStorage.setItem('access_token', res.data.access);
  localStorage.setItem('refresh_token', res.data.refresh);
  return res.data.user; 
};

export const logout = async () => {
  const refresh = localStorage.getItem('refresh_token');
  try {
    await api.post('/auth/logout/', { refresh });
  } finally {
    localStorage.clear();
    window.location.href = '/login';
  }
};

export const isLoggedIn = () => {
  return !!localStorage.getItem('access_token');
};
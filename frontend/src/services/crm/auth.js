// src/services/crm/auth.js
import api from './api.js';

export const loginCRM = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  // data contient: { token, utilisateur, message }
  return data;
};

export const logoutCRM = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};

export const getMeCRM = async () => {
  const { data } = await api.get('/auth/me');
  // data contient: { utilisateur, roles, permissions }
  return data;
};
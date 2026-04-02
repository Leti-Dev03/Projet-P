import api from './api.js';

export const getUsers = async () => {
  const { data } = await api.get('/users');
  return data;
};

export const getUserById = async (id) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

export const createUser = async (userData) => {
  const { data } = await api.post('/users', userData);
  return data;
};

export const updateUser = async (id, userData) => {
  const { data } = await api.put(`/users/${id}`, userData);
  return data;
};

export const toggleUserStatut = async (id, statut) => {
  const { data } = await api.put(`/users/${id}/statut`, { statut });
  return data;
};

export const assignUserRole = async (id, role_id) => {
  const { data } = await api.put(`/users/${id}/role`, { role_id });
  return data;
};

export const resetUserPassword = async (id) => {
  const { data } = await api.post(`/users/${id}/reset-password`);
  return data;
};
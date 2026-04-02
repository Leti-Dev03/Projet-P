import api from './api.js';

export const getRoles = async () => {
  const { data } = await api.get('/roles');
  return data;
};

export const createRole = async (roleData) => {
  const { data } = await api.post('/roles', roleData);
  return data;
};

export const updateRole = async (id, roleData) => {
  const { data } = await api.put(`/roles/${id}`, roleData);
  return data;
};

export const deleteRole = async (id) => {
  const { data } = await api.delete(`/roles/${id}`);
  return data;
};

export const getRolePermissions = async (id) => {
  const { data } = await api.get(`/roles/${id}/permissions`);
  return data; // matrice [{ressource_nom, permissions: [{action, active}]}]
};

export const updateRolePermissions = async (id, permission_ids) => {
  const { data } = await api.put(`/roles/${id}/permissions`, { permission_ids });
  return data;
};

export const getRessources = async () => {
  const { data } = await api.get('/roles/ressources');
  return data;
};
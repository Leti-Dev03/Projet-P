import api from './api.js';

export const getLogs = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.utilisateur_id) params.append('utilisateur_id', filters.utilisateur_id);
  if (filters.action) params.append('action', filters.action);
  if (filters.ressource) params.append('ressource', filters.ressource);
  if (filters.date_debut) params.append('date_debut', filters.date_debut);
  if (filters.date_fin) params.append('date_fin', filters.date_fin);
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);

  const { data } = await api.get(`/logs?${params.toString()}`);
  return data; // { data, total, page, limit }
};

export const getLogsByUser = async (id) => {
  const { data } = await api.get(`/logs/user/${id}`);
  return data;
};
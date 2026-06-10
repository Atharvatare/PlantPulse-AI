import api from './api';

export const getAll = (params) => api.get('/assets', { params });
export const getStats = () => api.get('/assets/stats');
export const getById = (id) => api.get(`/assets/${id}`);
export const create = (data) => api.post('/assets', data);
export const update = (id, data) => api.put(`/assets/${id}`, data);
export const delete_ = (id) => api.delete(`/assets/${id}`);

import api from './api';

export const getAll = (params) => api.get('/work-orders', { params });
export const getById = (id) => api.get(`/work-orders/${id}`);
export const create = (data) => api.post('/work-orders', data);
export const update = (id, data) => api.put(`/work-orders/${id}`, data);
export const delete_ = (id) => api.delete(`/work-orders/${id}`);

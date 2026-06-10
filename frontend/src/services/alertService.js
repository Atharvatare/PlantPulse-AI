import api from './api';

export const getAll = () => api.get('/alerts');
export const getBySeverity = (severity) => api.get(`/alerts/severity/${severity}`);
export const acknowledge = (id) => api.put(`/alerts/${id}/acknowledge`);
export const acknowledgeAll = () => api.put('/alerts/acknowledge-all');
export const delete_ = (id) => api.delete(`/alerts/${id}`);

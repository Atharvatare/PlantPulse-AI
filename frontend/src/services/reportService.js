import api from './api';

export const getAll = (params) => api.get('/reports', { params });
export const getById = (id) => api.get(`/reports/${id}`);
export const getAssetReport = (assetId) => api.get(`/reports/asset/${assetId}`);
export const getMaintenanceReport = (params) => api.get('/reports/maintenance', { params });
export const getFailureReport = () => api.get('/reports/failure');
export const getMonthlyReport = (params) => api.get('/reports/monthly', { params });
export const generate = (data) => api.post('/reports/save', data);
export const delete_ = (id) => api.delete(`/reports/${id}`);

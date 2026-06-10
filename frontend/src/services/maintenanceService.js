import api from './api';

export const analyzeSensorData = (data) => api.post('/maintenance/analyze', data);
export const getPredictions = (params) => api.get('/maintenance/predictions', { params });
export const getMaintenanceHistory = (assetId) => api.get(`/maintenance/history/${assetId}`);

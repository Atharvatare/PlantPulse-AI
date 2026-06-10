import api from './api';

export const analyze = (data) => api.post('/ai/analyze', data);
export const chat = (message) => api.post('/ai/chat', { message });
export const generateReport = (assetId) => api.post(`/ai/report/${assetId}`);
export const faultAnalysis = (data) => api.post('/ai/fault-analysis', data);
export const predict = (data) => api.post('/ai/predict', data);

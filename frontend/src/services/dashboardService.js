import api from './api';

export const getKPIs = () => api.get('/dashboard/kpis');
export const getCharts = () => api.get('/dashboard/charts');
export const getRecentAlerts = () => api.get('/dashboard/recent-alerts');

import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menyertakan token otentikasi di setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('crms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication & Users
export const loginUser = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');
export const logoutUser = () => api.post('/auth/logout');
export const getUsers = () => api.get('/users');

export const getDashboardSummary = () => api.get('/dashboard/summary');
export const getOverdueAccounts = (params) => api.get('/overdue-accounts', { params });
export const getOverdueAccountDetail = (id) => api.get(`/overdue-accounts/${id}`);
export const reevaluateAccount = (id, data) => api.post(`/overdue-accounts/${id}/reevaluate`, data);
export const updateAccountStatus = (id, data) => api.put(`/overdue-accounts/${id}/status`, data);

export const logActivity = (data) => api.post('/activities', data);
export const getActivities = (agreementNo) => api.get(`/activities/agreement/${agreementNo}`);

export const runConfinsEOD = (data) => api.post('/confins/eod-sync', data);
export const simulatePayment = (data) => api.post('/confins/simulate-payment', data);
export const resetDemoData = () => api.post('/confins/reset-demo');

export const getVIPAccounts = () => api.get('/vip/accounts');
export const assignVIPAction = (agreementNo, data) => api.post(`/vip/accounts/${agreementNo}/action`, data);

// Unified Customer 360° & Advanced Collections Lifecycle
export const getCustomerExposure360 = (customerId) => api.get(`/customers/${customerId}/exposure-360`);
export const updateCustomerPhone = (customerId, phone) => api.put(`/customers/${customerId}/phone`, { phone });
export const sendCustomerWhatsApp = (customerId, data) => api.post(`/customers/${customerId}/send-whatsapp`, data);
export const updateRecoveryStage = (accountId, data) => api.put(`/overdue-accounts/${accountId}/recovery-stage`, data);

export default api;

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

// Enterprise Collections Architecture Modules
export const getPDMAccounts = (params) => api.get('/pdm/accounts', { params });
export const sendPDMReminder = (id) => api.post(`/pdm/${id}/send-reminder`);

export const getLegalCases = (params) => api.get('/legal/cases', { params });
export const updateLegalStage = (id, data) => api.put(`/legal/cases/${id}/stage`, data);

export const getRepoCases = (params) => api.get('/repo/cases', { params });
export const updateRepoStage = (id, data) => api.put(`/repo/cases/${id}/stage`, data);

export const getSettlementProposals = (params) => api.get('/settlement/proposals', { params });
export const createSettlementProposal = (data) => api.post('/settlement/proposals', data);
export const updateSettlementStage = (id, data) => api.put(`/settlement/proposals/${id}/stage`, data);
export const saveSettlementTranches = (id, data) => api.post(`/settlement/proposals/${id}/tranches`, data);
export const paySettlementTranche = (id, data) => api.post(`/settlement/tranches/${id}/pay`, data);
export const recommendSettlementProposal = (id, data) => api.post(`/settlement/proposals/${id}/recommend`, data);
export const processSettlementProposal = (id, data) => api.put(`/settlement/proposals/${id}/action`, data);

export const getSkipTracingCases = (params) => api.get('/skip-tracing/cases', { params });
export const updateSkipTracingFeedback = (id, data) => api.put(`/skip-tracing/cases/${id}/feedback`, data);

// GeoTracker (GPS Field Monitoring & Route Playback)
export const getLiveCollectors = (params) => api.get('/geotracker/collectors', { params });
export const getCollectorRouteHistory = (username) => api.get(`/geotracker/collectors/${username}/route`);
export const pingLocation = (data) => api.post('/geotracker/ping', data);

// mCollect (Mobile Field Collections Workbench & Digital Receipts)
export const getMCollectAccounts = (params) => api.get('/mcollect/accounts', { params });
export const recordMCollectPayment = (data) => api.post('/mcollect/record-payment', data);
export const requestPaymentLink = (data) => api.post('/mcollect/request-payment-link', data);
export const getMCollectReceipts = (params) => api.get('/mcollect/receipts', { params });
export const sendReceiptWhatsApp = (id) => api.post(`/mcollect/receipts/${id}/send-whatsapp`);
export const simulateForeclosure = (data) => api.post('/mcollect/foreclosure-simulate', data);

// Supervisory Control, External Agency & Authority Delegation (OOO)
export const getAgencies = () => api.get('/agencies');
export const createAgency = (data) => api.post('/agencies', data);
export const getDelegations = () => api.get('/delegations');
export const createDelegation = (data) => api.post('/delegations', data);
export const cancelDelegation = (id) => api.delete(`/delegations/${id}`);
export const getCapacityPlanning = () => api.get('/capacity-planning');

export default api;


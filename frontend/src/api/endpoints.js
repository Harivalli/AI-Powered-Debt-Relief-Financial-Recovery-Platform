import api from './client';

export const authApi = {
  register: (data) => api.post('/api/auth/register', data),
  login: (email, password) => {
    const form = new URLSearchParams();
    form.append('username', email);
    form.append('password', password);
    return api.post('/api/auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  me: () => api.get('/api/auth/me'),
};

export const profileApi = {
  get: () => api.get('/api/profile'),
  update: (data) => api.put('/api/profile', data),
};

export const debtsApi = {
  list: () => api.get('/api/debts'),
  create: (data) => api.post('/api/debts', data),
  update: (id, data) => api.put(`/api/debts/${id}`, data),
  remove: (id) => api.delete(`/api/debts/${id}`),
};

export const expensesApi = {
  list: () => api.get('/api/expenses'),
  create: (data) => api.post('/api/expenses', data),
  remove: (id) => api.delete(`/api/expenses/${id}`),
};

export const dashboardApi = {
  summary: () => api.get('/api/dashboard/summary'),
};

export const aiApi = {
  analyze: () => api.post('/api/ai/analysis'),
  analysisHistory: () => api.get('/api/ai/analysis/history'),
  chat: (message) => api.post('/api/ai/chat', { message }),
  score: () => api.get('/api/ai/score'),
  repaymentPlan: (strategy, extraMonthlyPayment) =>
    api.post('/api/ai/repayment-plan', { strategy, extra_monthly_payment: extraMonthlyPayment }),
};

export const reportsApi = {
  downloadUrl: () => `${api.defaults.baseURL}/api/reports/financial-summary`,
};

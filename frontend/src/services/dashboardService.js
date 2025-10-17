import api from "./api";

export const dashboardService = {
  getStats: async () => {
    const response = await api.get("/dashboard/stats");
    return response.data;
  },

  getRevenueTrends: async (days = 30) => {
    const response = await api.get(`/dashboard/revenue-trends?days=${days}`);
    return response.data;
  },

  getPaymentAnalytics: async () => {
    const response = await api.get("/dashboard/payment-analytics");
    return response.data;
  },
};

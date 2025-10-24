import api from "./api";

export const chatbotService = {
  // Send message to chatbot
  sendMessage: async (message) => {
    const response = await api.post("/chatbot/chat", { message });
    return response.data;
  },

  // Get consignment details
  getConsignment: async (consignmentNo) => {
    const response = await api.get(`/chatbot/${consignmentNo}`);
    return response.data;
  },
};

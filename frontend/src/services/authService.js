import api from "./api";

export const authService = {
  login: async (username, password) => {
    const response = await api.post("/auth/login", { username, password });
    if (response.data.success) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  getStoredUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getStoredToken: () => {
    return localStorage.getItem("token");
  },
};

import axios from "axios";

const API_URL = "http://localhost:8800/api";

const authorizedHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const normalizeError = (error, fallbackMessage) => {
  const message = error.response?.data?.message || fallbackMessage;
  return { success: false, message };
};

export const authApi = {
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/user/login`, credentials, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return normalizeError(error, "Login failed. Please try again.");
    }
  },

  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/user/register`, userData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return normalizeError(error, "Registration failed. Please try again.");
    }
  },

  logout: async () => {
    try {
      const response = await axios.post(`${API_URL}/user/logout`, {}, { withCredentials: true });
      return response.data;
    } catch (error) {
      return normalizeError(error, "Logout failed. Please try again.");
    }
  },

  getAnalytics: async (token) => {
    const response = await axios.get(`${API_URL}/user/analytics`, authorizedHeaders(token));
    return response.data;
  },

  getUsers: async (token) => {
    const response = await axios.get(`${API_URL}/user/all`, authorizedHeaders(token));
    return response.data;
  },

  updateUser: async (userId, payload, token) => {
    const response = await axios.put(`${API_URL}/user/${userId}`, payload, authorizedHeaders(token));
    return response.data;
  },

  toggleUserStatus: async (userId, isActive, token) => {
    const response = await axios.patch(
      `${API_URL}/user/${userId}`,
      { isActive },
      authorizedHeaders(token)
    );
    return response.data;
  },

  deleteUser: async (userId, token) => {
    const response = await axios.delete(`${API_URL}/user/${userId}`, authorizedHeaders(token));
    return response.data;
  },

  changePassword: async (passwords, token) => {
    const response = await axios.put(
      `${API_URL}/user/change-password`,
      passwords,
      authorizedHeaders(token)
    );
    return response.data;
  },
};

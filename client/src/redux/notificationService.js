// client/src/redux/notificationService.js
import axios from "axios";

const API_BASE = "/api/notifications";

export const getNotifications = async (token, skip = 0, limit = 30) => {
  try {
    const res = await axios.get(`${API_BASE}?skip=${skip}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch notifications." };
  }
};

export const markNotificationAsRead = async (id, token) => {
  try {
    const res = await axios.put(`${API_BASE}/${id}/read`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to mark as read." };
  }
};

// Optional: support "Mark all as read"
export const markAllAsRead = async (token) => {
  try {
    const res = await axios.put(`${API_BASE}/mark-all`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to mark all as read." };
  }
};

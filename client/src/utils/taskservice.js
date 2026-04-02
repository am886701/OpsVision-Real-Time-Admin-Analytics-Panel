import axios from "axios";

const API_URL = "http://localhost:8800/api/tasks";

const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please log in again.");
  return token;
};

const withAuth = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const createTask = async (taskData) => {
  const response = await axios.post(`${API_URL}/create`, taskData, withAuth());
  return response.data;
};

export const updateTask = async (taskId, updatedData) => {
  const response = await axios.put(`${API_URL}/${taskId}`, updatedData, withAuth());
  return response.data;
};

export const getTasks = async () => {
  const response = await axios.get(`${API_URL}`, withAuth());
  return response.data;
};

export const getTrashedTasks = async () => {
  const response = await axios.get(`${API_URL}/trash`, withAuth());
  return response.data.tasks;
};

export const trashTask = async (taskId) => {
  const response = await axios.put(`${API_URL}/trash/${taskId}`, {}, withAuth());
  return response.data;
};

export const restoreTask = async (taskId) => {
  const response = await axios.put(`${API_URL}/restore/${taskId}?actionType=restore`, {}, withAuth());
  return response.data;
};

export const permanentDeleteTask = async (taskId) => {
  const response = await axios.delete(`${API_URL}/delete/${taskId}`, withAuth());
  return response.data;
};

export const restoreAllTasks = async () => {
  const response = await axios.put(`${API_URL}/restore-all`, {}, withAuth());
  return response.data;
};

export const permanentDeleteAllTasks = async () => {
  const response = await axios.delete(`${API_URL}/delete-all`, withAuth());
  return response.data;
};

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

axios.defaults.baseURL = API_URL;

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Set auth header
const setAuthHeader = () => {
  const token = getAuthToken();
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Tasks API
export const getTasks = async () => {
  setAuthHeader();
  const response = await axios.get('/api/tasks');
  return response.data.data.tasks;
};

export const getTask = async (id) => {
  setAuthHeader();
  const response = await axios.get(`/api/tasks/${id}`);
  return response.data.data.task;
};

export const createTask = async (taskData) => {
  setAuthHeader();
  const response = await axios.post('/api/tasks', taskData);
  return response.data.data.task;
};

export const updateTask = async (id, taskData) => {
  setAuthHeader();
  const response = await axios.put(`/api/tasks/${id}`, taskData);
  return response.data.data.task;
};

export const deleteTask = async (id) => {
  setAuthHeader();
  await axios.delete(`/api/tasks/${id}`);
  return { success: true };
};

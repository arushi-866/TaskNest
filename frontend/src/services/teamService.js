import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  // Try to get token from common storage patterns
  const token = localStorage.getItem('token') || 
                (JSON.parse(localStorage.getItem('user') || '{}')?.token);
  
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const getTeams = async () => {
  const response = await axios.get(`${API_URL}/teams`, getAuthHeader());
  return response.data;
};

const createTeam = async (teamData) => {
  const response = await axios.post(`${API_URL}/teams`, teamData, getAuthHeader());
  return response.data;
};

const getTeamMembers = async (teamId) => {
  const response = await axios.get(`${API_URL}/teams/${teamId}/members`, getAuthHeader());
  return response.data;
};

const inviteMember = async (teamId, email) => {
  const response = await axios.post(`${API_URL}/teams/${teamId}/invite`, { email }, getAuthHeader());
  return response.data;
};

const acceptInvite = async (token, teamId) => {
  const response = await axios.post(`${API_URL}/teams/accept-invite`, { token, teamId }, getAuthHeader());
  return response.data;
};

const joinTeam = async (teamCode) => {
  const response = await axios.post(`${API_URL}/teams/join`, { teamCode }, getAuthHeader());
  return response.data;
};

const getTeamTasks = async (teamId) => {
  const response = await axios.get(`${API_URL}/tasks?teamId=${teamId}`, getAuthHeader());
  return response.data;
};

const teamService = {
  getTeams,
  createTeam,
  getTeamMembers,
  inviteMember,
  acceptInvite,
  joinTeam,
  getTeamTasks
};

export default teamService;
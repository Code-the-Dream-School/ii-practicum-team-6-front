import axios from 'axios';

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const codeCrewAPI = {
  updateUser(data){
  return instance.patch('/users/me', data);
  },

  register(data) {
    return instance.post('/auth/register', data);
  },
  authMe() {
    return instance.get('/auth/me');
  },
  login(data) {
    return instance.post('/auth/login', data);
  },
  logOut() {
    return instance.post('/auth/logout');
  },
  forgotPassword(data) {
    return instance.post('/auth/forgot-password', data);
  },
  resetPassword(data) {
    return instance.post('/auth/reset-password', data);
  },
  getProject(id) {
    return instance.get(`/projects/${id}`);
  },
  getProjects(data = {}) {
    return instance.get('/projects', data);
  },
  createProject(data) {
    return instance.post('/projects', data);
  },
  updateProject(id, data) {
    return instance.patch(`/projects/${id}`, data);
  },
  deleteProject(id) {
    return instance.delete(`/projects/${id}`);
  },
  leaveProject(id) {
    return instance.post(`/projects/${id}/leave`);
  },
  toggleVote(id) {
    return instance.post(`/projects/${id}/votes`);
  },
  getAllVotes(id) {
    return instance.get(`/projects/${id}/votes`);
  },
  sendJoinRequest(id, data) {
    return instance.post(`/projects/${id}/join-requests`, data);
  },
  getProjectJoinRequests(id) {
    return instance.get(`/projects/${id}/join-requests`);
  },
  unsendJoinRequest(id, data) {
    return instance.delete(`/projects/${id}/join-requests`, {data});
  },
  reviewJoinRequest(id, requestId, data) {
    return instance.patch(`/projects/${id}/join-requests/${requestId}`, data);
  },
  getMyProjects(params) {
    return instance.get('/projects/myProjects', {params});
  },
  getMyProjectRequests(params) {
    return instance.get('/projects/myProjectRequests', {params});
  },
  getMyCreatedProjects(params) {
    return instance.get('/projects/myCreatedProjects', {params});
  },
};

export default codeCrewAPI;

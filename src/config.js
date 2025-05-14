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

  getAllSkills() {
    return instance.get('/skills');
  },

  searchSkills(searchBody) {
    return instance.post('/skills/search', { searchBody});
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

};

export default codeCrewAPI;

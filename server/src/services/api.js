import axios from 'axios';


const api = axios.create({
  baseURL: '/api',
});


api.interceptors.request.use(
  (config) => {
    // Get the user's info from localStorage.
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;

    
    if (userInfo?.token) {
      config.headers['Authorization'] = `Bearer ${userInfo.token}`;
    }
    
    
    return config;
  },
  (error) => {
    
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://ahmedsamir2025.pythonanywhere.com',
  // headers: { 'Content-Type': 'application/json' }
  headers: { 'Content-Type': 'multipart/form-data' }
    ,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }

  
);

export const addFriend = (userId: number) => axiosClient.post(`/chat/friends/${userId}/`);
export const startChat = (userId: number) => axiosClient.post(`/chat/start-chat/${userId}/`);



export default axiosClient;


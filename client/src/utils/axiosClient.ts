
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: { 'Content-Type': 'application/json' }
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Token ${token}`;
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


// import axios from 'axios';

// const axiosClient = axios.create({
//   baseURL: 'http://127.0.0.1:8000',
//   headers: { 'Content-Type': 'multipart/form-data' }
// });

// // Request interceptor
// axiosClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem('authToken');
//   config.headers = config.headers || {};

//   if (token) {
//     config.headers.Authorization = `Token ${token}`;
//   }

//   if (config.data instanceof FormData) {
//     delete config.headers['Content-Type'];
//   }

//   return config;
// });

// // Response interceptor
// axiosClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const originalRequest = error.config;
    
//     if (error.response?.status === 401) {
//       // Specific endpoint exception
//       if (!originalRequest.url.includes('/auth/login/')) {
//         localStorage.removeItem('token');
        
//         // Only redirect if not already on login page
//         if (window.location.pathname !== '/login') {
//           window.location.href = '/login';
//         }
//       }
//     }
    
//     return Promise.reject(error);
//   }
// );

// export default axiosClient;
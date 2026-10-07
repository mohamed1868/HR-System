import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: "/api/",
  withCredentials: true,
})

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401 && error.config?.url !== "login") {
      if (typeof window !== 'undefined') {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
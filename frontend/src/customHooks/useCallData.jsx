import axios from "axios";

const useCallData = () => {
  const axiosData = axios.create({
    baseURL: '/api',
    withCredentials: true,
    timeout: 10000,
  });

  // Add response interceptor for error handling
  axiosData.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized
        window.location.href = '/signin';
      }
      return Promise.reject(error);
    }
  );

  return axiosData;
};

export default useCallData;
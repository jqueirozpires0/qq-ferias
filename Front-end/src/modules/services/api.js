import Axios from 'axios';
import axiosRetry from 'axios-retry';


const options = {
  baseURL:'http://localhost:3000/',
};

const api = Axios.create(options);
axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: axiosRetry.isRetryableError,
});

api.interceptors.request.use((config) => {
  if (localStorage.token) {
    config.headers = {
      Authorization: `Bearer ${localStorage.token}`,
    };
  }
  return config;
});

export default api;
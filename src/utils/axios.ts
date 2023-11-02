import { HttpError } from "@refinedev/core";
import axios from "axios";
import { getAuthToken } from "./helpers";


const API_URL = "http://localhost:8611";

const axiosInstance = axios.create({
  headers: {
    'x-api-key': 'sandbox',
    'authorization': `Bearer ${getAuthToken()}`
  },
  baseURL: API_URL
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const customError: HttpError = {
      ...error,
      message: error.response?.data?.message,
      statusCode: error.response?.status,
    };

    return Promise.reject(customError);
  }
);

export { axiosInstance, API_URL };

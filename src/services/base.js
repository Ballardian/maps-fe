/* eslint-disable no-param-reassign */
import axios from "axios";
import { STRAPI_API_TOKEN } from "../config";

const api = axios.create({});

// Whenever a request is made, we attach our token in header.
api.interceptors.request.use((config) => {
  // TODO george add tokens to localStorage
  //   const token = localStorage.getItem("token");
  const token = STRAPI_API_TOKEN;
  //   const token =
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjU3NTIzOTc4LCJleHAiOjE2NjAxMTU5Nzh9.wKgU8cv8uGfiCVieHsAGq5CvknWDjxCcl0h2d-7XElA";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Whenever a response is received
api.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response.data;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger

    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.reload();
    }
    console.log("base error", error.response);
    return Promise.reject(error.response.data.error);
  }
);

export default {
  api,
};

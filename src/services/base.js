/* eslint-disable no-param-reassign */
import axios from "axios";
import { STRAPI_API_TOKEN } from "../config";

const api = axios.create({});

// Whenever a request is made, we attach our token in header.
api.interceptors.request.use((config) => {
  // TODO george check works without jwt token
  let token = localStorage.getItem("token");
  if (!token) {
    token = STRAPI_API_TOKEN;
  }
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

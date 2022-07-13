import base from "./base";
import { LOGIN_ENDPOINT } from "../config";

const login = async (username, password) => {
  const response = await base.api.post(`${LOGIN_ENDPOINT}`, {
    // identifier can be either username or email
    identifier: username,
    password: password,
  });
  return response;
};

export default {
  login,
};

import base from "./base";
import { REGISTER_ENDPOINT, IMAGE_UPLOAD_ENDPOINT } from "../config";

const registerUser = async (username, email, password, fullName) => {
  const response = await base.api.post(`${REGISTER_ENDPOINT}`, {
    username,
    email,
    password,
    fullName,
  });
  return response;
};

const uploadProfileImage = async (file, userId) => {
  const formData = new FormData();
  formData.append("files", file.originFileObj);
  formData.append("ref", "plugin::users-permissions.user");
  formData.append("refId", userId);
  formData.append("field", "profileImage");
  const response = await base.api.post(`${IMAGE_UPLOAD_ENDPOINT}`, formData);
  return response;
};

export default {
  registerUser,
  uploadProfileImage,
};

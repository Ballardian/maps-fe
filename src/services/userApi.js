import base from "./base";
import { USER_ENDPOINT } from "../config";
import { destinationStatus } from "../constants";
import destinationUtils from "../utils/destinationUtils";

const qs = require("qs");
const userQuery = qs.stringify(
  {
    filters: {
      destinations: {
        status: {
          $eq: destinationStatus.CURRENT,
        },
      },
    },
    populate: ["profileImage", "destinations.location"],
  },
  {
    encodeValuesOnly: true, // prettify URL
  }
);

const fetchUser = async (userId) => {
  const response = await base.api.get(
    `${USER_ENDPOINT}/${userId}?${userQuery}`
  );
  return response;
};

const fetchCurrentUser = async () => {
  const response = await base.api.get(`${USER_ENDPOINT}/me/?${userQuery}`);
  //   TODO george move logic to BE
  const currentDestination = destinationUtils.getUserCurrentDestination(
    response.destinations
  );
  response.destinations = [currentDestination];
  return response;
};

const fetchCurrentUserSummary = async () => {
  const response = await base.api.get(`${USER_ENDPOINT}/me`);
  return response;
};

const updateUser = async (
  userId,
  username,
  email,
  fullName,
  contactEmail,
  contactInstagram,
  contactNumber
) => {
  const response = await base.api.put(`${USER_ENDPOINT}/${userId}`, {
    username,
    email,
    fullName,
    contactEmail,
    contactInstagram,
    contactNumber,
  });
  return response;
};

export default {
  fetchUser,
  fetchCurrentUser,
  updateUser,
  fetchCurrentUserSummary,
};

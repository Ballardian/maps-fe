import base from "./base";
import { USER_ENDPOINT, FRIENDS_ENDPOINT } from "../config";
import { destinationStatus } from "../constants";

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
  const currentDestination = response.destinations.find(
    (item) => item.status === destinationStatus.CURRENT
  );
  response.destinations = [currentDestination];
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

// TODO george move to friendsApi
const friendQuery = (userId) => {
  const query = qs.stringify(
    {
      filters: {
        user: {
          id: {
            $eq: userId,
          },
        },
        // friend: {
        //   destinations: {
        //     status: {
        //       $eq: destinationStatus.CURRENT,
        //     },
        //   },
        // },
      },
      populate: ["friend.destinations.location", "friend.profileImage"],
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
  );
  return query;
};

const fetchFriendDestinations = async (userId) => {
  const response = await base.api.get(
    `${FRIENDS_ENDPOINT}?${friendQuery(userId)}`
  );
  return response;
};

export default {
  fetchUser,
  fetchFriendDestinations,
  fetchCurrentUser,
  updateUser,
};

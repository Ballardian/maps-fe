import base from "./base";
import { USER_ENDPOINT, FRIENDS_ENDPOINT } from "../config";

const qs = require("qs");
const userQuery = qs.stringify(
  {
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
  return response;
};

const friendQuery = (userId) => {
  const query = qs.stringify(
    {
      filters: {
        user: {
          id: {
            $eq: userId,
          },
        },
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
};

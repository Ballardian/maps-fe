import base from "./base";
import { FRIENDS_ENDPOINT } from "../config";
import { friendStatus } from "../constants";

const qs = require("qs");

// TODO george move to friendsApi
// TODO george move to BE
const friendDestinationQuery = (userId) => {
  const query = qs.stringify(
    {
      filters: {
        user: {
          id: {
            $eq: userId,
          },
        },
        status: {
          $eq: friendStatus.ACCEPTED,
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
    `${FRIENDS_ENDPOINT}?${friendDestinationQuery(userId)}`
  );
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
      populate: ["friend.profileImage"],
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
  );
  return query;
};

const fetchFriends = async (userId) => {
  const response = await base.api.get(
    `${FRIENDS_ENDPOINT}?${friendQuery(userId)}`
  );
  return response;
};

const addGeorge = async (userId) => {
  const response = await base.api.post(`${FRIENDS_ENDPOINT}`, {
    data: {
      user: userId,
      friend: 1,
      status: friendStatus.ACCEPTED,
    },
  });
  return response;
};

export default {
  fetchFriends,
  fetchFriendDestinations,
  addGeorge,
};

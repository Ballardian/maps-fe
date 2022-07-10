import axios from "axios";

const STRAPI_API_TOKEN =
  "df70fa29e521e86062a91630afa4e23087c87e26703d8734bd65bda382d3c3bb96662bf895220be6631a5641827f4f80d2a4246d366668ac041a9268e7ea05b8061dbbde32de6b33dc985dd384c76228ff50e329433a70e456d09760335f68226fb64eb4e7ccc6f7fe9df1b9e9d2bb8a142e167439053d7d53cb558e5587fe06";

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
  const response = await axios
    .get(`http://localhost:1337/api/users/${userId}?${userQuery}`, {
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
    })
    .then(({ data }) => {
      console.log("api data", data);
      return data;
    })
    .catch((error) => console.log("API ERROR", error));
  return response;
};

const friendQuery = qs.stringify(
  {
    filters: {
      user: {
        id: {
          $eq: 1,
        },
      },
    },
    populate: ["friend.destinations.location", "friend.profileImage"],
  },
  {
    encodeValuesOnly: true, // prettify URL
  }
);

const fetchFriendDestinations = async () => {
  const response = await axios
    .get(`http://localhost:1337/api/friends?${friendQuery}`, {
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
    })
    .then(({ data }) => {
      console.log("api data", data);
      return data;
    })
    .catch((error) => console.log("API ERROR", error));
  return response;
};

export default {
  fetchUser,
  fetchFriendDestinations,
};

import base from "./base";
import { DESTINATIONS_ENDPOINT } from "../config";

const addDestination = async (userId, locationId) => {
  const response = await base.api.post(`${DESTINATIONS_ENDPOINT}`, {
    data: { user: userId, location: locationId },
  });
  return response;
};

export default {
  addDestination,
};

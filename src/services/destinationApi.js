import base from "./base";
import locationUtils from "../utils/locationUtils";
import { DESTINATIONS_ENDPOINT } from "../config";

const addDestination = async (userId, location) => {
  const randomisedLatLong = locationUtils.randomiseLocation(
    location.latitude,
    location.longitude
  );
  const response = await base.api.post(`${DESTINATIONS_ENDPOINT}`, {
    data: {
      user: userId,
      location: location.id,
      longitude: randomisedLatLong.longitude,
      latitude: randomisedLatLong.latitude,
    },
  });
  return response;
};

export default {
  addDestination,
};

import base from "./base";
import locationUtils from "../utils/locationUtils";
import { DESTINATIONS_ENDPOINT } from "../config";
import { destinationStatus } from "../constants";

const addDestination = async (userId, location) => {
  const randomisedLatLong = locationUtils.randomiseLocation(
    location.attributes.latitude,
    location.attributes.longitude
  );
  const response = await base.api.post(`${DESTINATIONS_ENDPOINT}`, {
    data: {
      user: userId,
      location: location.id,
      longitude: randomisedLatLong.longitude,
      latitude: randomisedLatLong.latitude,
      status: destinationStatus.CURRENT,
    },
  });
  return response;
};

const updateCurrentDestination = async (destinationId) => {
  const response = await base.api.put(
    `${DESTINATIONS_ENDPOINT}/${destinationId}`,
    {
      data: {
        status: destinationStatus.PAST,
      },
    }
  );
  return response;
};

export default { addDestination, updateCurrentDestination };

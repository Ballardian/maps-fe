import base from "./base";
import { LOCATIONS_ENDPOINT } from "../config";

// TODO george add sort
const fetchLocations = async () => {
  const response = await base.api.get(`${LOCATIONS_ENDPOINT}`);
  return response;
};

export default {
  fetchLocations,
};

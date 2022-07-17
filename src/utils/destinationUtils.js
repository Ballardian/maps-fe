import { destinationStatus } from "../constants";

// /   TODO george move logic to BE
const getUserCurrentDestination = (destinations) => {
  const currentDestination = destinations.find(
    (item) => item.status === destinationStatus.CURRENT
  );
  return currentDestination;
};

export default {
  getUserCurrentDestination,
};

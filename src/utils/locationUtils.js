import randomLocation from "random-location";

const DISTANCE = 8000;

const randomiseLocation = (latitude, longitude) => {
  const location = {
    latitude,
    longitude,
  };
  const randomPoint = randomLocation.randomCirclePoint(location, DISTANCE);
  return randomPoint;
};

export default {
  randomiseLocation,
};

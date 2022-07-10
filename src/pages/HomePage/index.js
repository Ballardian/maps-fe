import React, { useState, useMemo, useEffect, useCallback } from "react";
import ReactMapGL, {
  Source,
  Layer,
  NavigationControl,
  Marker,
  Popup,
} from "react-map-gl";
import userApi from "../../services/userApi";

// TODO george add info to redux upon sign in / initial load
const USER_ID = 1;

const HomePage = () => {
  const [viewport, setViewport] = useState({
    // TODO george change to your own location (add 1st dest on sign up)
    latitude: 40.7127837,
    longitude: -74.0059413,
    zoom: 10,
  });
  const [markerData, setMarkerData] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    // fetchUser();
    fetchFriendDestinations();
  }, []);

  //   TODO fire after sign in
  //   const fetchUser = async () => {
  //     try {
  //       const response = await userApi.fetchUser(USER_ID);
  //       const locationData =
  //         response.destinations.data[0].attributes.location.data.attributes;
  //       console.log("res", response);
  //       //   setMarkerData(response);
  //       //   setLoading(false);
  //     } catch (error) {
  //       console.log("here", error);
  //     }
  //   };

  const fetchFriendDestinations = async () => {
    try {
      const response = await userApi.fetchFriendDestinations();
      setMarkerData(response);
      setLoading(false);
    } catch (error) {
      console.log("here", error);
    }
  };

  // const getCapData = (loc_data) => {
  //   const feature_array = loc_data.map((item) => {
  //     const long = item["CapitalLongitude"];
  //     const lat = item["CapitalLatitude"];
  //     return {
  //       type: "Feature",
  //       geometry: { type: "Point", coordinates: [long, lat] },
  //     };
  //   });
  //   return feature_array;
  // };

  // const layerStyle = {
  //   id: "point",
  //   type: "symbol",
  //   layout: {
  //     "icon-image": "{icon}-15",
  //     "icon-size": 1,
  //     "icon-allow-overlap": true,
  //   },
  // paint: {
  //   "circle-radius": 10,
  //   "circle-color": "#007cbf",
  // },
  // };

  // TODO george doesnt work dunno why
  // console.log("ENV", process.env.REACT_APP_MAPBOX_TOKEN);

  //   TODO GEORGE NEED FOR LINES
  //   const futurePlans = {
  //     type: "FeatureCollection",
  //     features: [
  //       {
  //         type: "Feature",
  //         geometry: {
  //           type: "LineString",
  //           coordinates: [
  //             [-74.0059413, 40.7127837],
  //             [-118.2436849, 34.0522342],
  //           ],
  //         },
  //       },
  //       {
  //         type: "Feature",
  //         geometry: {
  //           type: "LineString",
  //           coordinates: [
  //             [-111.8910474, 40.7607793],
  //             [-74.0059413, 40.7127837],
  //           ],
  //         },
  //       },
  //     ],
  //   };

  //   const layerStyle = {
  //     id: "marker-line",
  //     type: "line",
  //     layout: {
  //       "line-cap": "round",
  //       "line-join": "round",
  //     },
  //     paint: {
  //       "line-color": "#ba0716",
  //       "line-width": 2,
  //       "line-dasharray": [1, 2],
  //     },
  //   };

  //   const markers = useMemo(
  //     () =>
  //       markerData.data.map((item) => (
  //         <Marker
  //           key={item.id}
  //           longitude={item.longitude}
  //           latitude={item.latitude}
  //           anchor="bottom"
  //         >
  //           <button
  //             onClick={(e) => {
  //               e.preventDefault();
  //               setSelectedMarker(item);
  //             }}
  //           >
  //             <img src={item.image} alt={`${item.image}`} />
  //           </button>
  //         </Marker>
  //       )),
  //     [markerData]
  //   );

  const cleanData = (item) => {
    const itemId = item.attributes.friend.data.id;
    const itemData = item.attributes.friend.data.attributes;
    // TODO george update for multiple destinations
    const locationData =
      item.attributes.friend.data.attributes.destinations.data[0].attributes
        .location.data.attributes;

    return [itemId, itemData, locationData];
  };

  const markers = useMemo(() => {
    if (markerData) {
      return markerData.data.map((item) => {
        const [itemId, itemData, locationData] = cleanData(item);
        return (
          <Marker
            key={itemId}
            longitude={locationData.longitude}
            latitude={locationData.latitude}
            anchor="bottom"
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                setSelectedMarker(itemData);
              }}
            >
              <img
                src={`http://localhost:1337${itemData.profileImage.data.attributes.url}`}
                alt={`${itemData.profileImage.data.attributes.url}`}
                style={{ borderRadius: "50%", height: "30px", width: "30px" }}
              />
            </button>
          </Marker>
        );
      });
    }
  }, [markerData]);

  const popUp = (selectedMarker) => {
    console.log("SEL", selectedMarker);
    const locationData =
      selectedMarker.destinations.data[0].attributes.location.data.attributes;
    return (
      <Popup
        longitude={locationData.longitude}
        latitude={locationData.latitude}
        anchor="top"
        onClose={() => setSelectedMarker(null)}
        closeButton={true}
        closeOnClick={false}
      >
        <img
          src={`http://localhost:1337${selectedMarker.profileImage.data.attributes.url}`}
          alt={`${selectedMarker.profileImage.data.attributes.url}`}
          style={{ borderRadius: "50%", height: "30px", width: "30px" }}
        />
        <p>{selectedMarker.fullName}</p>
        <p>{selectedMarker.email}</p>
      </Popup>
    );
  };

  return (
    <ReactMapGL
      {...viewport}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/georgeballardsoftware/cl5dfdvsh00cy16p3uvsy41u2"
      mapboxAccessToken={
        "pk.eyJ1IjoiZ2VvcmdlYmFsbGFyZHNvZnR3YXJlIiwiYSI6ImNsNWRiMTR3djBwcTUzbW9ldGJ1emx4ankifQ.FeOSQ6TxMH9TnHodvsd4zQ"
      }
      onMove={(evt) => setViewport(evt.viewState)}
      reuseMaps
      maxPitch={0}
      dragRotate={false}
    >
      <NavigationControl
        visualizePitch={false}
        showCompass={false}
        showZoom={false}
      />
      {/* <Source id="my-data" type="geojson" data={futurePlans}>
        <Layer {...layerStyle} />
      </Source> */}
      {!isLoading && markers}
      {selectedMarker && popUp(selectedMarker)}
    </ReactMapGL>
  );
};

export default HomePage;

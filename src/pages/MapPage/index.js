import React, { useState, useMemo, useEffect } from "react";
import ReactMapGL, {
  Source,
  Layer,
  NavigationControl,
  Marker,
  Popup,
} from "react-map-gl";
import { Avatar, Spin, Row } from "antd";
import userApi from "../../services/userApi";
import friendsApi from "../../services/friendsApi";
import {
  BASE_ENDPOINT,
  MAPBOX_API_TOKEN,
  MAPBOX_MAP_STYLE,
} from "../../config";

import { destinationStatus } from "../../constants";

const MapPage = () => {
  const [user, setUSer] = useState(null);
  const [viewport, setViewport] = useState(null);
  const [markerData, setMarkerData] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    // TODO george remove once log out button ready
    // localStorage.removeItem("token");
    // TODO george add info to redux upon sign in / initial load
    // TODO george pass user id
    const userId = localStorage.getItem("id");
    if (userId) {
      fetchUser(userId);
    }
    fetchFriendDestinations();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await userApi.fetchCurrentUser();
      const locationData = response.destinations[0];
      console.log("res", response);
      console.log("loc", locationData);
      setViewport({
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        zoom: 10,
      });
    } catch (error) {
      console.log("here", error);
    }
  };

  const fetchFriendDestinations = async () => {
    try {
      const response = await friendsApi.fetchFriendDestinations();
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
    // TODO george move logic to BE
    const locationData =
      item.attributes.friend.data.attributes.destinations.data.find(
        (item) => item.attributes.status === destinationStatus.CURRENT
      )?.attributes;

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
            <Avatar
              src={`${BASE_ENDPOINT}${itemData.profileImage.data.attributes.url}`}
              size="large"
              onClick={(e) => {
                e.preventDefault();
                setSelectedMarker(itemData);
              }}
            />
          </Marker>
        );
      });
    }
  }, [markerData]);

  const popUp = useMemo(() => {
    // TODO george why does this run twice?
    console.log("SEL", selectedMarker);
    if (selectedMarker) {
      const locationData = selectedMarker.destinations.data[0].attributes;
      return (
        <Popup
          longitude={locationData.longitude}
          latitude={locationData.latitude}
          anchor="top"
          onClose={() => setSelectedMarker(null)}
          closeButton
          closeOnClick={false}
        >
          <Avatar
            src={`${BASE_ENDPOINT}${selectedMarker.profileImage.data.attributes.url}`}
            size="large"
          />

          <p>{selectedMarker.fullName}</p>
          <p>{selectedMarker.email}</p>
        </Popup>
      );
    }
  }, [selectedMarker]);

  return (
    <>
      {viewport ? (
        <ReactMapGL
          {...viewport}
          style={{ width: "100vw", height: "100vh" }}
          mapStyle={MAPBOX_MAP_STYLE}
          mapboxAccessToken={MAPBOX_API_TOKEN}
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
          {!isLoading && selectedMarker && popUp}
        </ReactMapGL>
      ) : (
        <Row type="flex" justify="space-around" style={{ marginTop: 80 }}>
          <Spin size="large" />
        </Row>
      )}
    </>
  );
};

export default MapPage;

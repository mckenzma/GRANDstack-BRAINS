import React, { useState } from "react";

// Leaflet
import { Map, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";
//import HeatmapLayer from 'react-leaflet-heatmap-layer/lib/HeatmapLayer';
import "react-leaflet-markercluster/dist/styles.min.css";

import BridgeDrawer from "./BridgeDrawer.js";

export default function BridgeMarkrer({ bridge, index }) {
  const [state, setState] = useState({
    open: false,
    bridgeCode: "",
    placeCode: "",
    countyCode: "",
    stateCode: ""
  });

  const myIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
  });

  const setBridge = bridge => {
    setState({
      open: true,
      bridgeCode: bridge.code,
      placeCode: bridge.placeCode,
      countyCode: bridge.countyCode,
      stateCode: bridge.stateCode
    });
  };

  return (
    <>
      <Marker
        key={index}
        position={[bridge.location.latitude, bridge.location.longitude]}
        icon={myIcon}
        onClick={() => setBridge(bridge)}
      />
      {/* Only render drawer when needed to be opened */}
      {state.open === true && (
        <BridgeDrawer state={state} setState={setState} />
      )}
    </>
  );
}

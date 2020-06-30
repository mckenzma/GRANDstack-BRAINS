import React, { useState, useRef } from "react";
import "./Map.css";

// Material UI components
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

// Apollo
import { useQuery } from "@apollo/react-hooks";

import gql from "graphql-tag";

// Leaflet
import { Map, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";
//import HeatmapLayer from 'react-leaflet-heatmap-layer/lib/HeatmapLayer';
import "react-leaflet-markercluster/dist/styles.min.css";
import MarkerClusterGroup from "react-leaflet-markercluster";

// External function/components
import BridgeDrawer from "./BridgeDrawer.js";
import Loading from "./Loading";
// import StateMarker from "./MapStateMarker.js";

const useStyles = makeStyles(theme => ({
  root: {
    height: 400,
    overflowX: "auto",
    paddingTop: theme.spacing(2)
  },
  list: {
    width: 400
  },
  map: {
    marginTop: theme.spacing(1)
  },
  card: {
    minWidth: 275
  }
}));

const GET_BRIDGES = gql`
  query bridgesPaginateQuery(
    $_selectedStates: [String!]
    $_selectedYears: [Int!]
  ) #$maintRespSelected: [String!]
  #$ownerSelected: [String!]
  #$ {/*this.props.ownerSelected != null && this.props.ownerSelected.length > 0 ? '$ownerSelected: [String!]' : '' */} this is a way to not pass every filter in unless selected
  {
    Bridge(
      filter: {
        place: { county: { state: { abbreviation_in: $_selectedStates } } }
        buildYear_in: $_selectedYears
        #$ {/*this.props.ownerSelected != null && this.props.ownerSelected.length > 0 ? 'owner: { description_in: $ownerSelected }' : '' */} this is a way to not pass every filter in unless selected
      }
    ) {
      stateCode
      countyCode
      placeCode
      code
      latitude_decimal
      longitude_decimal
    }
  }
`;

export default function MapLeaf({
  _selectedStates,
  _selectedYears,
  headerHeight
}) {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_BRIDGES, {
    variables: {
      _selectedStates,
      _selectedYears
    }
  });

  const [lng, setLng] = useState(-98.5795); // center of US --> Long. 103 46 17.60283(W)
  const [lat, setLat] = useState(39.8283); //center of US --> Lat. 44 58 02.07622(N)
  const [zoom, setZoom] = useState(4);
  const [right, setRight] = useState(false);
  const [bridge_id, setBridge_id] = useState(null);
  const [bridge_lat, setBridge_lat] = useState(null);
  const [bridge_lng, setBridge_lng] = useState(null);
  const [bridge_year, setBridge_year] = useState(null);
  const [owned_by, setOwned_by] = useState(null);
  const [maintained_by, setMaintained_by] = useState(null);
  const [bridge_code, setBridge_code] = useState(null);
  const [place_code, setPlace_code] = useState(null);
  const [county_code, setCounty_code] = useState(null);
  const [state_code, setState_code] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [state, setState] = useState(null);

  const tabHeaderRef = useRef(null);
  const style = { top: headerHeight };
  const style2 = {
    marginTop:
      headerHeight +
      (tabHeaderRef.current ? tabHeaderRef.current.offsetHeight : 0)
  };

  const toggleDrawer = (
    open,
    bridgeCode,
    placeCode,
    countyCode,
    stateCode
  ) => () => {
    setRight(open);
    setState({
      bridgeCode: bridgeCode,
      placeCode: placeCode,
      countyCode: countyCode,
      stateCode: stateCode
    });
  };

  const [position, setPosition] = useState([lat, lng]);

  const myIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
  });

  const setBridge = bridge => {
    setRight(true);
    setBridge_code(bridge.code);
    setPlace_code(bridge.placeCode);
    setCounty_code(bridge.countyCode);
    setState_code(bridge.stateCode);
  };

  if (loading) return <Loading />;
  if (error) return `Error ${error.message}`;

  return (
    <div style={style} ref={tabHeaderRef}>
      <Map
        style={style2}
        center={position}
        zoom={zoom}
        maxZoom={18}
        // className="absolute top right left bottom"
        preferCanvas={true}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>
          {data.Bridge.map(b => {
            const id = `${b.stateCode}${b.countyCode}${b.placeCode}${b.code}`;
            return (
              <Marker
                key={id}
                position={[b.latitude_decimal, b.longitude_decimal]}
                icon={myIcon}
                onClick={() => setBridge(b)}
              />
            );
          })}
        </MarkerClusterGroup>
      </Map>

      <Drawer
        // variant="persistent"
        anchor="right"
        open={right}
        onClose={toggleDrawer(false)}
      >
        <div tabIndex={0} role="button">
          <div className={classes.list}>
            <List>
              <ListItem>
                <ListItemText>Bridge Info</ListItemText>
              </ListItem>
            </List>
            <Divider />
            <BridgeDrawer
              selectedBridge={bridge_code}
              selectedPlace={place_code}
              selectedCounty={county_code}
              selectedState={state_code}
              right={right}
              setRight={setRight}
              open={right}
            />
          </div>
        </div>
      </Drawer>
    </div>
  );
}

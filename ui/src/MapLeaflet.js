import React, { useState, useRef, useEffect, useMemo } from "react";
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
import MenuDrawer from "./MenuDrawer";

// import StateMarker from "./MapStateMarker.js";
import BridgeMarker from "./BridgeMarker";

import Loading from "./Loading";

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

// TODO - since we store the state code on the bridge as a property, could update to pass and match on the state code
//        rather than "walking the relationships". Would need to update the state selector to do so
const GET_BRIDGES = gql`
  query bridgesPaginateQuery(
    $_selectedStates: [String!] #$maintRespSelected: [String!] # $_selectedYears: [Int!] #$ownerSelected: [String!]
  ) #$ {/*this.props.ownerSelected != null && this.props.ownerSelected.length > 0 ? '$ownerSelected: [String!]' : '' */} this is a way to not pass every filter in unless selected
  {
    Bridge(
      first: 1000 #limiting return b/c getting react range error. this is def due to the number of bridges being rendered. this should improve as corrections to bridges are made and that number decreases.
      # however, this is still something to review for potential improvements.
      filter: {
        AND: [
          # {
          #   place: { county: { state: { abbreviation_in: $_selectedStates } } }
          # }
          { stateCode_in: $_selectedStates }
          { place_not: null } # added because there are incomplete connections from state to bridge due to errors in the raw data
          { place: { county_not: null } } # added because there are incomplete connections from state to bridge due to errors in the raw data
          { place: { county: { state_not: null } } } # added because there are incomplete connections from state to bridge due to errors in the raw data
          # { latitude_decimal_not:null }
          # { location_not:{latitude: 0.0, longitude: 0.0}}, # added to prevent rendering issue of too many bridges on 0,0
          # { stateCode_not: ""},
          # { placeCode_not: ""}
        ]
        # buildYear_in: $_selectedYears
        #$ {/*this.props.ownerSelected != null && this.props.ownerSelected.length > 0 ? 'owner: { description_in: $ownerSelected }' : '' */} this is a way to not pass every filter in unless selected
      }
    ) {
      stateCode
      countyCode
      placeCode
      code
      location {
        latitude
        longitude
      }
    }
  }
`;

export default function MapLeaf({
  _selectedStates,
  // _selectedYears, // this is currently not included in the filters as an option
  headerHeight
}) {
  const classes = useStyles();
  // console.log(_selectedStates.map(state => state.abbreviation));
  const { loading, error, data } = useQuery(GET_BRIDGES, {
    variables: {
      _selectedStates: _selectedStates.map(state => state.code)
      // _selectedYears
    }
  });

  console.log(_selectedStates);
  console.log(_selectedStates.map(state => state.code));

  const [lng, setLng] = useState(-98.5795); // center of US --> Long. 103 46 17.60283(W)
  const [lat, setLat] = useState(39.8283); //center of US --> Lat. 44 58 02.07622(N)
  const [zoom, setZoom] = useState(4);

  const tabHeaderRef = useRef(null);
  const style = { top: headerHeight };
  const style2 = {
    marginTop: headerHeight, // +
    // (tabHeaderRef.current ? tabHeaderRef.current.offsetHeight : 0),
    height: `calc(100vh - ${headerHeight}px)` // set height equal too 100 minus header height
  };

  const [position, setPosition] = useState([lat, lng]);

  // console.log(data,loading,error);

  // Todo - update this use of how the map shows while loading. Ideally want the map to always show and then show the loading icon with maybe the map "dimmed" ?
  // if (loading) return <Loading style={{position: 'absolute', left: '50%', top: '50%',transform: 'translate(-50%, -50%)'}}/>;
  // if (loading)
  //   return (
  //     <div style={style} ref={tabHeaderRef}>
  //       <Map
  //         style={style2}
  //         center={position}
  //         zoom={zoom}
  //         maxZoom={18}
  //         preferCanvas={true}
  //       >
  //         <TileLayer
  //           attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  //           url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
  //         />
  //       </Map>
  //     </div>
  //   );
  // if (error) return `Error ${error.message}`;

  return (
    <div style={style} ref={tabHeaderRef}>
      {/* can we move this down into the Map tag and get rid of it? */}
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
          // Reference: https://wiki.openstreetmap.org/wiki/Tile_servers
          // this is for the "tradition basic map"
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          // this sets a "dark carto map"
          // url="	https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>
          {console.log("create markers here!")}
          {loading && console.log("loading")}
          {error && console.log("error")}
          {data !== undefined &&
            data.Bridge.map((b, index) => {
              console.log("Markers rendered");
              return <BridgeMarker bridge={b} index={index} key={index} />;
            })}
        </MarkerClusterGroup>
      </Map>
    </div>
  );
}

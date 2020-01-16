import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery } from "@apollo/react-hooks";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import "./Map.css";
import { withStyles } from "@material-ui/core/styles";

import { Map, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";

//import HeatmapLayer from 'react-leaflet-heatmap-layer/lib/HeatmapLayer';

import "react-leaflet-markercluster/dist/styles.min.css";
import MarkerClusterGroup from "react-leaflet-markercluster";

import PropTypes from "prop-types";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

// import Card from "@material-ui/core/Card";

import BridgeDrawer from "./BridgeDrawer.js";

// import StateMarker from "./MapStateMarker.js";

const useStyles = makeStyles(theme => ({
  // const styles = theme => ({
  root: {
    height: 400,
    overflowX: "auto",
    paddingTop: theme.spacing(2)
  },
  list: {
    // width: 250
    width: 400
  },
  map: {
    marginTop: theme.spacing(1)
  },
  card: {
    minWidth: 275
  }
  // });
}));

const GET_BRIDGES = gql`
  query bridgesPaginateQuery(
    $_selectedStates: [String!]
    $_selectedYears: [Int!] #$maintRespSelected: [String!] #$ownerSelected: [String!] #$ {/*this.props.ownerSelected != null && this.props.ownerSelected.length > 0 ? '$ownerSelected: [String!]' : '' */} this is a way to not pass every filter in unless selected
  ) {
    Bridge(
      filter: {
        place: { county: { state: { abbreviation_in: $_selectedStates } } }
        buildYear_in: $_selectedYears
        #maintenanceResp: { description_in: $maintRespSelected }
        #owner: { description_in: $ownerSelected }
        #$ {/*this.props.ownerSelected != null && this.props.ownerSelected.length > 0 ? 'owner: { description_in: $ownerSelected }' : '' */} this is a way to not pass every filter in unless selected
      }
    ) {
      #id
      #state_code
      stateCode
      #county_code
      countyCode
      #place_code
      placeCode
      code
      latitude_decimal
      longitude_decimal
    }
  }
`;

export default function MapLeaf({ _selectedStates, _selectedYears }) {
  const classes = useStyles();
  // class MapLeaf extends React.Component {
  // constructor(props) {
  // super(props);
  const { loading, error, data } = useQuery(GET_BRIDGES, {
    variables: {
      _selectedStates,
      _selectedYears
      // maintRespSelected: this.props.maintRespSelected,
      // ownerSelected: this.props.ownerSelected
    }
  });

  // console.log(data);

  // this.state = {
  // lng: -98.5795, // center of US --> Long. 103 46 17.60283(W)
  const [lng, setLng] = useState(-98.5795); // center of US --> Long. 103 46 17.60283(W)
  // lat: 39.8283, //center of US --> Lat. 44 58 02.07622(N)
  const [lat, setLat] = useState(39.8283); //center of US --> Lat. 44 58 02.07622(N)
  // zoom: 4,
  const [zoom, setZoom] = useState(4);
  // right: false,
  const [right, setRight] = useState(false);
  // bridge_id: null,
  const [bridge_id, setBridge_id] = useState(null);
  // bridge_lat: null,
  const [bridge_lat, setBridge_lat] = useState(null);
  // bridge_lng: null,
  const [bridge_lng, setBridge_lng] = useState(null);
  // build_year: null,
  const [bridge_year, setBridge_year] = useState(null);
  // owned_by: null,
  const [owned_by, setOwned_by] = useState(null);
  // maintained_by: null,
  const [maintained_by, setMaintained_by] = useState(null);

  // bridge_code: null,
  const [bridge_code, setBridge_code] = useState(null);
  // place_code: null,
  const [place_code, setPlace_code] = useState(null);
  // county_code: null,
  const [county_code, setCounty_code] = useState(null);
  // state_code: null,
  const [state_code, setState_code] = useState(null);
  // latitude: null,
  const [latitude, setLatitude] = useState(null);
  // longitude: null
  const [longitude, setLongitude] = useState(null);
  // };
  // }

  const [state, setState] = useState(null);

  const toggleDrawer = (
    // side,
    open,
    // bridge
    // bridge_id
    bridgeCode,
    placeCode,
    countyCode,
    stateCode
  ) => () => {
    setRight(open);
    setState({
      // [side]: open,
      // bridge_name: bridge.name,
      // bridge_id: bridge.id,
      // bridge_id: bridge_id,

      bridgeCode: bridgeCode,
      placeCode: placeCode,
      countyCode: countyCode,
      stateCode: stateCode
      // latitude: latitude,
      // longitude: longitude

      // bridge_lat: bridge.latitude_decimal,
      // bridge_lng: bridge.longitude_decimal,
      // build_year: bridge.yearbuilt
    });
    // setRight("open");
  };

  // render() {
  //   const { classes } = this.props;

  // const position = [this.state.lat, this.state.lng];
  const [position, setPosition] = useState([lat, lng]);

  const myIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
  });

  const setBridge = bridge => {
    setRight(true);
    setBridge_code(bridge.code);
    console.log(bridge.code);
    setPlace_code(bridge.placeCode);
    console.log(bridge.placeCode);
    setCounty_code(bridge.countyCode);
    console.log(bridge.countyCode);
    setState_code(bridge.stateCode);
    console.log(bridge.stateCode);
  };

  // return (
  //   <Query
  //     // Trying Filter Application starting at Bridge
  //     //${/*use this to only have filters selected affect query*/}
  //     //${this.props.ownerSelected != null && this.props.ownerSelected.length > 0 ? '$ownerSelected: [String!]' : '' }
  //     //${this.props.ownerSelected != null && this.props.ownerSelected.length > 0 ? 'owner: { description_in: $ownerSelected }' : '' }
  //     query={gql`
  //       query bridgesPaginateQuery(
  //         $selected: [String!]
  //         $yearSelected: [Int!] #$maintRespSelected: [String!] #$ownerSelected: [String!] #$ {/*this.props.ownerSelected != null && this.props.ownerSelected.length > 0 ? '$ownerSelected: [String!]' : '' */} this is a way to not pass every filter in unless selected
  //       ) {
  //         Bridge(
  //           filter: {
  //             place: { county: { state: { abbreviation_in: $selected } } }
  //             buildYear_in: $yearSelected
  //             #maintenanceResp: { description_in: $maintRespSelected }
  //             #owner: { description_in: $ownerSelected }
  //             #$ {/*this.props.ownerSelected != null && this.props.ownerSelected.length > 0 ? 'owner: { description_in: $ownerSelected }' : '' */} this is a way to not pass every filter in unless selected
  //           }
  //         ) {
  //           #id
  //           #state_code
  //           stateCode
  //           #county_code
  //           countyCode
  //           #place_code
  //           placeCode
  //           code
  //           latitude_decimal
  //           longitude_decimal
  //         }
  //       }
  //     `}
  //     variables={{
  //       selected: this.props.selected,
  //       yearSelected: this.props.yearSelected
  //       // maintRespSelected: this.props.maintRespSelected,
  //       // ownerSelected: this.props.ownerSelected
  //     }}
  //   >
  //     {({ loading, error, data }) => {
  //       if (loading) return <p>Loading...</p>;
  //       if (error) return <p>Error</p>;

  // console.log(state_code);

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  // console.log(state_code);

  return (
    <div>
      <Map
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
          {/* Begin Revised Bridge Query */}
          {data.Bridge.map(b => {
            //const id = `${b.state_code}${b.county_code}${b.place_code}${
            const id = `${b.stateCode}${b.countyCode}${b.placeCode}${b.code}`;
            // need to clean this up!
            // const code = b.code;
            // const place_code = b.place_code;
            // const county_code = b.county_code;
            // const state_code = b.state_code;
            // const latitude = b.latitude_decimal;
            // const longitude = b.longitude_decimal;
            return (
              <Marker
                key={id}
                position={[b.latitude_decimal, b.longitude_decimal]}
                icon={myIcon}
                onClick={
                  () => setBridge(b)

                  // toggleDrawer(
                  // // "right",
                  // true,
                  // // b
                  // // id
                  // b.code,
                  // // b.place_code,
                  // b.placeCode,
                  // // b.county_code,
                  // b.countyCode,
                  // // b.state_code,
                  // b.stateCode
                  // // b.latitude_decimal,
                  // // b.longitude_decimal
                  // )
                }
              />
            );
          })}
          {/* End Revised Bridge Query */}
        </MarkerClusterGroup>
        {/*<StateMarker />*/}
      </Map>

      {/*<Map center={position} zoom={this.state.zoom} className="absolute top right left bottom" >
                <HeatmapLayer
                  //blur={10.0}
                  //radius={10.0}
                  fitBoundsOnLoad
                  fitBoundsOnUpdate
                  points={data.Bridge}
                  longitudeExtractor={m => m['longitude_decimal']}
                  latitudeExtractor={m => m['latitude_decimal']}
                  intensityExtractor={m => 5.0} />
                <TileLayer
                  url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
              </Map>*/}

      <Drawer
        // variant="persistent"
        anchor="right"
        open={right}
        // onClose={toggleDrawer("right", false, "")}
        onClose={toggleDrawer(false)}
      >
        <div
          tabIndex={0}
          role="button"
          // onClick={this.toggleDrawer("right", false, "")}
          // onKeyDown={this.toggleDrawer("right", false, "")}
        >
          <div className={classes.list}>
            <List>
              <ListItem>
                <ListItemText>Bridge Info</ListItemText>
              </ListItem>
            </List>
            <Divider />
            <BridgeDrawer
              // selectedBridge={this.state.bridge_id}
              // selectedBridge={this.state.bridge_code}
              selectedBridge={bridge_code}
              // selectedPlace={this.state.place_code}
              selectedPlace={place_code}
              // selectedCounty={this.state.county_code}
              selectedCounty={county_code}
              // selectedState={this.state.state_code}
              selectedState={state_code}
              right={right}
              setRight={setRight}
              // open={this.state.right}
              open={right}
              // onClose={this.toggleDrawer("right", false, "")}
            />
            {/* {sideList} */}
          </div>
        </div>
      </Drawer>
    </div>
  );
  //     }}
  //   </Query>
  // );
  // }
}

// MapLeaf.propTypes = {
//   classes: PropTypes.object.isRequired
// };

// export default withStyles(styles)(MapLeaf);

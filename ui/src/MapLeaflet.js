import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import "./Map.css";
import { withStyles } from "@material-ui/core/styles";

// import Paper from "@material-ui/core/Paper";

// import mapboxgl from "mapbox-gl";
// import 'mapbox-gl/dist/mapbox-gl.css';
// import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
// import ReactMapboxGl from "react-mapbox-gl";

import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';

import HeatmapLayer from 'react-leaflet-heatmap-layer/lib/HeatmapLayer';

// import 'leaflet.markercluster/dist/MarkerCluster.css';
// import MarkerClusterGroup from 'leaflet.markercluster/dist/leaflet.markercluster-src.js';

// import 'react-leaflet-markercluster/dist/styles.min.css';
// import MarkerClusterGroup from 'react-leaflet-markercluster/dist/react-leaflet-markercluster.js';

// import HeatmapLayer from 'react-leaflet-heatmap-layer/src/HeatmapLayer';

import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
// import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

// import TemporaryDrawer from './BridgeDrawer';

// mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
// ReactMapboxGl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
// mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

const styles = theme => ({
  root: {
    // width: 700,
    height: 400,
    // maxWidth: 700,
    // marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
    // margin: "auto"
  },
  list: {
    width: 250,
  },
  
});

// console.log(icon);
// console.log(iconShadow);

class MapLeaf extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // lng: 5,
      lng: -93.2650,
      // lat: 34,
      lat: 44.9778,
      // zoom: 1.5
      // zoom: 13,
      zoom: 6,
      // order: "asc",
      // orderBy: "avgStars"
    //   viewport: {
	  	// width: 400,
	  	// height: 400,
	  	// latitude: 37.7577,
	  	// longitude: -122.4376,
	  	// zoom: 8
	  // },
      right: false,
      bridge_id: null,
      bridge_lat: null,
      bridge_lng: null,
      build_year: null
    };

    // this.businessMarkers = [];
  }

  toggleDrawer = (side, open, bridge) => () => {
    this.setState({
      [side]: open,
      bridge_id: bridge.id,
      bridge_lat: bridge.latitude_decimal,
      bridge_lng: bridge.longitude_decimal,
      build_year: bridge.yearbuilt
    });
  };

  render() {

    const { classes } = this.props;
    // console.log(classes);
    // console.log(this.state.bridge_id);

    const sideList = (
      <div className={classes.list}>
        <List >
          <ListItem >
            <ListItemText >ID: {this.state.bridge_id}</ListItemText>
          </ListItem>
          {/*<ListItem >
            <ListItemText >LAT: {this.state.bridge_lat}</ListItemText>
          </ListItem>
          <ListItem >
            <ListItemText >LONG: {this.state.bridge_lng}</ListItemText>
          </ListItem>*/}
          <ListItem >
            <ListItemText >Build Year: {this.state.build_year}</ListItemText>
          </ListItem>
        </List>
      </div>
    );

    const position = [this.state.lat, this.state.lng];

          const myIcon = L.icon({
            iconUrl: icon,
            shadowUrl: iconShadow
          });

          


          return (
            <Query
              query={gql`
                {
                  Bridge(first: 10000) {
                    id
                    latitude_decimal
                    longitude_decimal
                    yearbuilt
                  }
                }
              `}
            >
              {({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>
                if (error) return <p>Error</p>

                return (

                  <div>
                    {/*<Map center={position} zoom={this.state.zoom} className="absolute top right left bottom" >
                      <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                      />
                      {data.Bridge
                        .slice()
                        .map(n => {
                          return (
                            
                            <Marker key={n.id} position={[n.latitude_decimal, n.longitude_decimal]} icon={myIcon} onClick={this.toggleDrawer('right', true,n)}>
                            </Marker>
                          
                            
                                );
                                })}
                    </Map>*/}

                    <Map center={position} zoom={this.state.zoom} className="absolute top right left bottom" >
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
                    </Map>

                    <Drawer anchor="right" open={this.state.right} onClose={this.toggleDrawer('right', false, "")}>
                      <div
                        tabIndex={0}
                        role="button"
                        onClick={this.toggleDrawer('right', false, "")}
                        onKeyDown={this.toggleDrawer('right', false, "")}
                      >
                        <div className={classes.list}>
                        <List>
                          <ListItem>
                            <ListItemText>Bridge Info</ListItemText>
                          </ListItem>
                        </List>
                        <Divider />
                        {sideList}
                        </div>
                      </div>
                    </Drawer>
                  </div>
                );
              }}
            </Query>
        
          );
    
  }
}

MapLeaf.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MapLeaf);
// export default Map;

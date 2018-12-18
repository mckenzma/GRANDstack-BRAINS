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




import PropTypes from 'prop-types';
import Drawer from '@material-ui/core/Drawer';
// import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import TemporaryDrawer from './BridgeDrawer';

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
      bridge_lng: null
    };

    // this.businessMarkers = [];
  }

  toggleDrawer = (side, open, bridge) => () => {
    this.setState({
      [side]: open,
      bridge_id: bridge.id,
      bridge_lat: bridge.latitude_decimal,
      bridge_lng: bridge.longitude_decimal
    });
  };

  // businessPopupHTML = business => {
  //   return `<ul>
  //   <li>
  //     <strong>Id: </strong> ${business.id}
  //   </li>
  //   <li>
  //     <strong>Longitude: </strong> ${business.longitude_decimal}
  //   </li>
  //   <li>
  //     <strong>Latitude: </strong> ${business.latitude_decimal}
  //   </li>
  // </ul>`;
  // };

  // setBusinessMarkers() {
  //   // console.log("setBusinessMarkers");
  //   const { businesses } = this.props;
  //   // this.businessMarkers.map(m => {
  //   //   m.remove();
  //   //   return true;
  //   // });
  //   // console.log(businesses);
  //   // console.log(this.map);
  //   // this.businessMarkers = businesses.map(b => {
  //   //   // console.log(b);
  //   //   return new mapboxgl.Marker()
  //   //     //.setLngLat([b.location.x, b.location.y])
  //   //     .setLngLat([b.longitude_decimal, b.latitude_decimal])
  //   //     .setPopup(
  //   //       new mapboxgl.Popup({ offset: 25 }).setHTML(this.businessPopupHTML(b))
  //   //     )

  //   //     // .onclick = function (e) {
  //   //     //   this.toggleDrawer('right', true);

  //   //     //   // var clickedLayer = this.textContent;
  //   //     //   // e.preventDefault();
  //   //     //   // e.stopPropagation();

  //   //     //   // var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

  //   //     //   // if (visibility === 'visible') {
  //   //     //   //     map.setLayoutProperty(clickedLayer, 'visibility', 'none');
  //   //     //   //     this.className = '';
  //   //     //   // } else {
  //   //     //   //     this.className = 'active';
  //   //     //   //     map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
  //   //     //   // }
  //   //     // };
  //   //     .on('click', function(e) {
  //   //       this.toggleDrawer('right', true);
  //   //       console.log("clicked");
  //   //     })
  //   //     .addTo(this.map);
  //   // });
  // }

  // componentDidUpdate() {
  //   this.setBusinessMarkers();
  //   if (this.mapLoaded) {
  //     // this.map
  //       // .getSource("polygon")
  //       // .setData(
  //         // this.createGeoJSONCircle(
  //         //   [this.props.mapCenter.longitude, this.props.mapCenter.latitude],
  //         //   this.props.mapCenter.radius
  //         // ).data
  //       // );
  //   }
  // }

  // // componentDidMount() {
  // //   this.map = new mapboxgl.Map({
  // //     container: this.mapContainer,
  // //     style: 'mapbox://styles/mapbox/streets-v9'
  // //   });
  // // }

  

  // componentDidMount() {
  //   // console.log("componentDidMount");
  //   const { lng, lat, zoom } = this.state;

  //   const { businesses } = this.props;
  //   // console.log(businesses);
  //   // console.log(JSON.stringify(businesses));

  //   // const map = new mapboxgl.Map({
  //   // this.map = new mapboxgl.Map({ // this line is giving me an error: 'map' is not defined no-undefined
  //   //   container: this.mapContainer,
  //   //   style: 'mapbox://styles/mapbox/streets-v9',
  //   //   center: [lng, lat],
  //   //   // width: 300,
  //   //   zoom
  //   // });

  //   // this.map.on('load', () => {
  //   //   this.mapLoaded = true;
  //   //   // this.map.addSource('bridges', {
  //   //   //   "type": "geojson",
  //   //   //   "data": JSON.stringify(businesses)
  //   //   // });

  //   //   // this.map.addLayer({
  //   //   //   "id": "bridges-heat",
  //   //   //   "type": "heatmap",
  //   //   //   "source": "bridges",
  //   //   //   "maxzoom": 9,
  //   //   //   "paint": {
  //   //   //     // Increase the heatmap wieght vase
  //   //   //   }
  //   //   // })


  //   //   // this.map.addSource(
  //   //   //   "polygon",
  //   //   //   this.createGeoJSONCircle([lng, lat], this.props.mapCenter.radius)
  //   //   // );
  //   //   // this.map.addLayer({
  //   //   //   id: "polygon",
  //   //   //   type: "fill",
  //   //   //   source: "polygon",
  //   //   //   layout: {},
  //   //   //   paint: {
  //   //   //     "fill-color": "blue",
  //   //   //     "fill-opacity": 0.6
  //   //   //   }
  //   //   // });
  //   // });

  //   // const onDragEnd = e => {
  //   //   var lngLat = e.target.getLngLat();

  //   //   const viewport = {
  //   //     latitude: lngLat.lat,
  //   //     longitude: lngLat.lng,
  //   //     zoom: this.map.getZoom()
  //   //   }
  //   //   this.props.mapSearchPointChange(viewport);
  //   // }
		// // console.log(this.map);
  //   //  this.map.on('move', () => {
  //   //   const { lng, lat } = this.map.getCenter();

  //   //   this.setState({
  //   //     lng: lng.toFixed(4),
  //   //     lat: lat.toFixed(4),
  //   //     zoom: this.map.getZoom().toFixed(2)
  //   //   });
  //   // });

  //   // this.setBusinessMarkers();
  // }

  // componentWillUnmount() {
  //   this.map.remove();
  // }

  // handleSortRequest = property => {
  //   const orderBy = property;
  //   let order = "desc";

  //   if (this.state.orderBy === property && this.state.order === "desc") {
  //     order = "asc";
  //   }

  //   this.setState({ order, orderBy });
  // };

  render() {

    const { classes } = this.props;
    // console.log(classes);
    console.log(this.state.bridge_id);

    const sideList = (
      <div className={classes.list}>
        {/*<List>
          <ListItem>
            <ListItemText>Bridge Info</ListItemText>
          </ListItem>
        </List>
        <Divider />*/}
        {/*<List>
          {['Test 1', 'Test 2', 'Test 3', 'Test 4'].map((text, index) => (
            <ListItem button key={text}>
              {/*<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>*/}
              {/*<ListItemText primary={text} />
            </ListItem>
          ))}
        </List>*/}
        <List >
          <ListItem >
            <ListItemText >ID: {this.state.bridge_id}</ListItemText>
          </ListItem>
          <ListItem >
            <ListItemText >LAT: {this.state.bridge_lat}</ListItemText>
          </ListItem>
          <ListItem >
            <ListItemText >LONG: {this.state.bridge_lng}</ListItemText>
          </ListItem>
        </List>
        {/*<Divider />*/}
        {/*<List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>*/}
      </div>
    );

  	// const { lng, lat, zoom } = this.state;

    const position = [this.state.lat, this.state.lng];
    // console.log(position);

    // return (
    //   <div>
    //     {<div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
    //       <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
    //     </div>}
    //     <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
    //   </div>
    // );

    // const { order, orderBy } = this.state;
    // return (
    //   <Query
    //     query={gql`
    //       {
    //         states {
    //           id
    //           name
    //           numCounties
    //           numPlaces
    //           numBridges
    //         }
    //       }
    //     `}
    //   >
    //     {({ loading, error, data }) => {
    //       if (loading) return <p>Loading...</p>;
    //       if (error) return <p>Error</p>;
          const myIcon = L.icon({
            iconUrl: icon,
            shadowUrl: iconShadow
          });




          return (
            <Query
              query={gql`
                {
                  Bridge(first: 20) {
                    id
                    latitude_decimal
                    longitude_decimal
                  }
                }
              `}
            >
              {({ loading, error, data }) => {
                if (loading) return <p>Loading...</p>
                if (error) return <p>Error</p>

                return (
                  <div>
                    <Map center={position} zoom={this.state.zoom} className={this.props.classes.root}>
                      <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                        // url='http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
                      />
                      {data.Bridge
                        .slice()
                        .map(n => {
                          return (
                            
                            <Marker key={n.id} position={[n.latitude_decimal, n.longitude_decimal]} icon={myIcon} onClick={this.toggleDrawer('right', true,n)}>
                              <Popup>
                                {n.id} <br/> Latitude: {n.latitude_decimal} <br/> Longitude: {n.longitude_decimal}
                                {/*A pretty CSS3 popup. <br/> Easily customizable.*/}
                              </Popup>
                            </Marker>
                            
                            // <Drawer anchor="right" open={this.state.right} onClose={this.toggleDrawer('right', false)}>
                            //   <div
                            //     tabIndex={0}
                            //     role="button"
                            //     onClick={this.toggleDrawer('right', false)}
                            //     onKeyDown={this.toggleDrawer('right', false)}
                            //   >
                            //     <div className={classes.list}>
                            //       <List>
                            //         <ListItem>
                            //           <ListItemText>Bridge Info</ListItemText>
                            //         </ListItem>
                            //       </List>
                            //       <Divider />
                            //       <List key={n.id}>
                            //           <ListItem >
                            //             <ListItemText >ID: {n.id}</ListItemText>
                            //           </ListItem>
                            //           <ListItem >
                            //             <ListItemText >LAT: {n.latitude_decimal}</ListItemText>
                            //           </ListItem>
                            //           <ListItem >
                            //             <ListItemText >LONG: {n.longitude_decimal}</ListItemText>
                            //           </ListItem>
                            //       </List>
                            //     </div>
                            //   </div>
                            // </Drawer>
                            
                                );
                                })}
                              {/*<TemporaryDrawer />*/}
                              {/*<Drawer anchor="right" open={this.state.right} onClose={this.toggleDrawer('right', false)}>
                                <div
                                  tabIndex={0}
                                  role="button"
                                  onClick={this.toggleDrawer('right', false)}
                                  onKeyDown={this.toggleDrawer('right', false)}
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
                              </Drawer>*/}
                              
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
        //{/*</Paper>*/}
        // {<div ref={el => this.mapContainer = el} />}
      // </div>




   //          // <Paper className={this.props.classes.root}>
             // <Paper className={this.props.classes.root}>
   // <div>
        // {<div ref={el => this.mapContainer = el} className="absolute top right left bottom" />}
        // <div ref={el => this.mapContainer = el} className={this.props.classes.root} />
  //      <Paper>
    //    <div ref={el => this.mapContainer = el} className={this.state.viewport} />
      //  </Paper>
   // </div>
              // </Paper>
          );
    //     }}
    //   </Query>
    // );
  }
}

MapLeaf.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MapLeaf);
// export default Map;

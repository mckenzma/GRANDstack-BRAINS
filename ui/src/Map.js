import React from "react";
// import { Query } from "react-apollo";
// import gql from "graphql-tag";
import "./Map.css";
import { withStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";

import mapboxgl from "mapbox-gl";
// import 'mapbox-gl/dist/mapbox-gl.css';
// import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
// import ReactMapboxGl from "react-mapbox-gl";

// mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
// ReactMapboxGl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

const styles = theme => ({
  root: {
    width: 700,
    height: 400,
    // maxWidth: 700,
    // marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
    // margin: "auto"
  },
  
});



class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // lng: 5,
      lng: -93.2650,
      // lat: 34,
      lat: 44.9778,
      // zoom: 1.5
      zoom: 13
      // order: "asc",
      // orderBy: "avgStars"
    //   viewport: {
	  	// width: 400,
	  	// height: 400,
	  	// latitude: 37.7577,
	  	// longitude: -122.4376,
	  	// zoom: 8
	  // },
	  
    };
  }

  // componentDidMount() {
  //   this.map = new mapboxgl.Map({
  //     container: this.mapContainer,
  //     style: 'mapbox://styles/mapbox/streets-v9'
  //   });
  // }

  

  componentDidMount() {
    const { lng, lat, zoom } = this.state;

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [lng, lat],
      zoom,
      width: 300
    });
		
     map.on('move', () => {
      const { lng, lat } = map.getCenter();

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });
  }

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

  	const { lng, lat, zoom } = this.state;

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

          return (
// <div>
        // {<div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
        //   <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
        // </div>}
        <Paper className={this.props.classes.root}>
        {/*<div ref={el => this.mapContainer = el} className="absolute top right left bottom"/>*/}
        <div ref={el => this.mapContainer = el} className={this.props.classes.root}/>
        </Paper>
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

export default withStyles(styles)(Map);
// export default Map;

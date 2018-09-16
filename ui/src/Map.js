import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { withStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";

import mapboxgl from "mapbox-gl";
// import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
// import ReactMapboxGl from "react-mapbox-gl";

// mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
// ReactMapboxGl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

const styles = theme => ({
  root: {
    maxWidth: 700,
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
    margin: "auto"
  },
  
});


// const Map = ReactMapboxGl({
//   accessToken: "pk.eyJ1IjoiZmFicmljOCIsImEiOiJjaWc5aTV1ZzUwMDJwdzJrb2w0dXRmc2d0In0.p6GGlfyV-WksaDV_KdN27A"
// });

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // order: "asc",
      // orderBy: "avgStars"
      viewport: {
	  	width: 400,
	  	height: 400,
	  	latitude: 37.7577,
	  	longitude: -122.4376,
	  	zoom: 8
	  },
	  lng: 5,
      lat: 34,
      zoom: 1.5
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
      zoom
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

    return (
      <div>
        <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
          <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
        </div>
        <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
      </div>
    );

    // return <div style={this.state.viewport} ref={el => this.mapContainer = el} />;
    // return <div style={this.props.classes.viewport} ref={el => this.mapContainer = el} />;

    // const { order, orderBy } = this.state;
    //return (
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

   //        return (
   //          // <Paper className={this.props.classes.root}>
   //          //<Paper className={this.props.classes.root}>
   //          //{/*}  // Map goes here*/}

			// <ReactMapboxGl
			//   style="mapbox://styles/mapbox/streets-v9"
			//   containerStyle={{
			//     height: 300,
			//     width: 300
			//   }}
			//   className={this.props.classes.viewport}
			//   />
			// //{/*//     {<Layer
			// //       type="symbol"
			// //       id="marker"
			// //       layout={{ "icon-image": "marker-15" }}>
			// //       <Feature coordinates={[-0.481747846041145, 51.3233379650232]}/>
			// //     </Layer>}
			// // {/*</ReactMapboxGl>*/}
   //          //</Paper>
   //        );
        // }}
      // </Query>
    //);
  }
}

export default withStyles(styles)(Map);

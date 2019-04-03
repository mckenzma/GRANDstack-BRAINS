import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import "./BridgeList.css";
import { withStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import 'mapbox-gl/dist/mapbox-gl.css';

import MapLeaf from './MapLeaflet';

const styles = theme => ({
  root: {
    // maxWidth: 700,
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
    margin: "auto"
  },
  table: {
    minWidth: 700
  }
});


class BridgeList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
           
      businesses: [],
      mapCenter: {
        longitude: -93.2650,
        latitude: 44.9778,
        zoom: 13,
      }
    };
  }

  
  render() {
    // const { order, orderBy } = this.state;
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
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error</p>;

          return (
            <Paper className={this.props.classes.root}>
              <MapLeaf />
            </Paper>
          );
        }}
      </Query>
    );
  }
}

export default withStyles(styles)(BridgeList);

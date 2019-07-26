import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { withStyles } from "@material-ui/core/styles";

import { Map, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";

const styles = theme => ({
  // root: {
  //   height: 400,
  //   overflowX: "auto",
  //   paddingTop: theme.spacing.unit * 2,
  // },
  // list: {
  //   width: 250
  // },
  // map: {
  //   marginTop: theme.spacing.unit
  // },
  // card: {
  //   minWidth: 275
  // }
});

class StateMarker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { classes } = this.props;

    const stateIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow
    });

    return (
      <Query
        query={gql`
          {
            State {
              abbreviation
              longitude_decimal
              latitude_decimal
            }
          }
        `}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error</p>;

          return (
            <div>
              {data.State.map(s => {
                return (
                  <Marker
                    key={s.abbreviation}
                    position={[s.latitude_decimal, s.longitude_decimal]}
                    icon={stateIcon}
                  />
                );
              })}
            </div>
          );
        }}
      </Query>
    );
  }
}

export default withStyles(styles)(StateMarker);

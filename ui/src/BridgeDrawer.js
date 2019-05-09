import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";

import ListItemText from "@material-ui/core/ListItemText";

const styles = {
  list: {
    width: 250
  }
};

class BridgeDrawer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      right: false

      // bridge: this.props.bridge,
      // bridge_id: this.props.selectedBridge,
      // bridge_lat: null,
      // bridge_lng: null,
      // build_year: null,
      // owned_by: null,
      // maintained_by: null
    };
  }

  render() {
    const { classes } = this.props;

    // console.log("selectedBridge: " + this.props.selectedBridge);

    return (
      <Query
        query={gql`
          query bridgePaginateQuery($selectedBridge: ID!) {
            Bridge(filter: { id: $selectedBridge }) {
              id
              latitude_decimal
              longitude_decimal
              yearbuilt
              buildYear {
                year
              }
            }
          }
        `}
        variables={{
          selectedBridge: this.props.selectedBridge
        }}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error</p>;

          return (
            <div className={classes.list}>
              {data.Bridge.map(b => {
                return (
                  <List key={b.id}>
                    <ListItem>
                      <ListItemText>ID: {b.id}</ListItemText>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText>LAT: {b.latitude_decimal}</ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText>LONG: {b.longitude_decimal}</ListItemText>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText>
                        Build Year: {b.buildYear.year}
                      </ListItemText>
                    </ListItem>
                  </List>
                );
              })}
            </div>
          );
        }}
      </Query>
    );
  }
}

BridgeDrawer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(BridgeDrawer);

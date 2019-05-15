import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
// import Drawer from "@material-ui/core/Drawer";
// import Button from "@material-ui/core/Button";
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
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <Query
        query={gql`
          query bridgePaginateQuery($selectedBridge: ID!) {
            Bridge(filter: { id: $selectedBridge }) {
              id
              name
              latitude_decimal
              longitude_decimal
              buildYear {
                year
              }
              place {
                name
                county {
                  name
                  state {
                    name
                  }
                }
              }
              maintenanceResp {
                description
              }
              owner {
                description
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
                      <ListItemText>
                        State: {b.place.county.state.name}
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText>County: {b.place.county.name}</ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText>Place: {b.place.name}</ListItemText>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText>Name: {b.id}</ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText>LAT: {b.latitude_decimal}</ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText>LONG: {b.longitude_decimal}</ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText>
                        Build Year: {b.buildYear.year}
                      </ListItemText>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText>
                        Owned By: {b.owner.description}
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText>
                        Maintaned By: {b.maintenanceResp.description}
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

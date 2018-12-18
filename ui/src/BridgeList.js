import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import "./BridgeList.css";
import { withStyles } from "@material-ui/core/styles";
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableHead from "@material-ui/core/TableHead";
// import TableRow from "@material-ui/core/TableRow";
// import Tooltip from "@material-ui/core/Tooltip";
import Paper from "@material-ui/core/Paper";
// import { TableSortLabel } from "@material-ui/core";

// import Map from './Map';
import 'mapbox-gl/dist/mapbox-gl.css';

import MapLeaf from './MapLeaflet';

// import TemporaryDrawer from './BridgeDrawer';

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

// function getSorting(order, orderBy) {
  // return order === "desc"
    // ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    // : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
// }

class BridgeList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // order: "asc",
      // orderBy: "avgStars",
      
      businesses: [],
      mapCenter: {
        longitude: -93.2650,
        latitude: 44.9778,
        zoom: 13,
      }
    };
  }

  // handleSortRequest = property => {
  //   const orderBy = property;
  //   let order = "desc";

  //   if (this.state.orderBy === property && this.state.order === "desc") {
  //     order = "asc";
  //   }

  //   this.setState({ order, orderBy });
  // };

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
              {/*<Map
                businesses={data.Bridge}
              />*/}

              <MapLeaf
                // businesses={data.Bridge}
              />
              
              {/*<TemporaryDrawer />*/}

              {/*<Table className={this.props.classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      key="id"
                      sortDirection={orderBy === "id" ? order : false}
                    >
                      <Tooltip
                        title="Sort"
                        placement="bottom-start"
                        enterDelay={300}
                      >
                        <TableSortLabel
                          active={orderBy === "id"}
                          direction={order}
                          onClick={() => this.handleSortRequest("id")}
                        >
                          Id
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      key="latitude_decimal"
                      sortDirection={orderBy === "latitude_decimal" ? order : false}
                      numeric
                    >
                      <Tooltip
                        title="Sort"
                        placement="bottom-end"
                        enterDelay={300}
                      >
                        <TableSortLabel
                          active={orderBy === "latitude_decimal"}
                          direction={order}
                          onClick={() => this.handleSortRequest("latitude_decimal")}
                        >
                          Latitude
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      key="longitude_decimal"
                      sortDirection={orderBy === "longitude_decimal" ? order : false}
                      numeric
                    >
                      <Tooltip
                        title="Sort"
                        placement="bottom-end"
                        enterDelay={300}
                      >
                        <TableSortLabel
                          active={orderBy === "longitude_decimal"}
                          direction={order}
                          onClick={() => this.handleSortRequest("longitude_decimal")}
                        >
                          Longitude
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.Bridge
                    .slice()
                    .sort(getSorting(order, orderBy))
                    .map(n => {
                      return (
                        <TableRow key={n.id}>
                          <TableCell component="th" scope="row">
                            {n.id}
                          </TableCell>
                          <TableCell numeric>{n.latitude_decimal}</TableCell>
                          <TableCell numeric>{n.longitude_decimal}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>*/}
            </Paper>
          );
        }}
      </Query>
    );
  }
}

export default withStyles(styles)(BridgeList);

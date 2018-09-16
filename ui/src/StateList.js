import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import "./StateList.css";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import Paper from "@material-ui/core/Paper";
import { TableSortLabel } from "@material-ui/core";

const styles = theme => ({
  root: {
    maxWidth: 700,
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
    margin: "auto"
  },
  table: {
    minWidth: 700
  }
});

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

class StateList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: "asc",
      orderBy: "avgStars"
    };
  }

  handleSortRequest = property => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  render() {
    const { order, orderBy } = this.state;
    return (
      <Query
        query={gql`
          {
            states {
              id
              name
              numCounties
              numPlaces
              numBridges
            }
          }
        `}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error</p>;

          return (
            <Paper className={this.props.classes.root}>
              <Table className={this.props.classes.table}>
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
                      key="name"
                      sortDirection={orderBy === "name" ? order : false}
                      numeric
                    >
                      <Tooltip
                        title="Sort"
                        placement="bottom-end"
                        enterDelay={300}
                      >
                        <TableSortLabel
                          active={orderBy === "name"}
                          direction={order}
                          onClick={() => this.handleSortRequest("name")}
                        >
                          Name
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      key="numCounties"
                      sortDirection={orderBy === "numCounties" ? order : false}
                      numeric
                    >
                      <Tooltip
                        title="Sort"
                        placement="bottom-end"
                        enterDelay={300}
                      >
                        <TableSortLabel
                          active={orderBy === "numCounties"}
                          direction={order}
                          onClick={() => this.handleSortRequest("numCounties")}
                        >
                          # of Counties
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      key="numPlaces"
                      sortDirection={orderBy === "numPlaces" ? order : false}
                      numeric
                    >
                      <Tooltip
                        title="Sort"
                        placement="bottom-end"
                        enterDelay={300}
                      >
                        <TableSortLabel
                          active={orderBy === "numPlaces"}
                          direction={order}
                          onClick={() => this.handleSortRequest("numPlaces")}
                        >
                          # of Places
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      key="numBridges"
                      sortDirection={orderBy === "numBridges" ? order : false}
                      numeric
                    >
                      <Tooltip
                        title="Sort"
                        placement="bottom-end"
                        enterDelay={300}
                      >
                        <TableSortLabel
                          active={orderBy === "numBridges"}
                          direction={order}
                          onClick={() => this.handleSortRequest("numBridges")}
                        >
                          # of Bridges
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.states
                    .slice()
                    .sort(getSorting(order, orderBy))
                    .map(n => {
                      return (
                        <TableRow key={n.id}>
                          <TableCell component="th" scope="row">
                            {n.id}
                          </TableCell>
                          <TableCell>{n.name}</TableCell>
                          <TableCell numeric>{n.numCounties}</TableCell>
                          <TableCell numeric>{n.numPlaces}</TableCell>
                          <TableCell numeric>{n.numBridges}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </Paper>
          );
        }}
      </Query>
    );
  }
}

export default withStyles(styles)(StateList);

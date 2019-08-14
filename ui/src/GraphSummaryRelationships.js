import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
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
    // minWidth: 700
  }
});

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

class GraphSummaryRelationships extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: "desc",
      orderBy: "count"
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
            relationshipSummaryCount {
              type
              count
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
                      key="type"
                      sortDirection={orderBy === "type" ? order : false}
                    >
                      <Tooltip
                        title="Sort"
                        placement="bottom-start"
                        enterDelay={3000}
                      >
                        <TableSortLabel
                          active={orderBy === "type"}
                          direction={order}
                          onClick={() => this.handleSortRequest("type")}
                        >
                          Relationship Label
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      key="count"
                      sortDirection={orderBy === "count" ? order : false}
                    >
                      <Tooltip
                        title="Sort"
                        placement="bottom-start"
                        enterDelay={3000}
                      >
                        <TableSortLabel
                          active={orderBy === "count"}
                          direction={order}
                          onClick={() => this.handleSortRequest("count")}
                        >
                          Count
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.relationshipSummaryCount
                    .slice()
                    .sort(getSorting(order, orderBy))
                    .map(n => {
                      return (
                        <TableRow key={n.type}>
                          <TableCell component="th" scope="row">
                            {n.type}
                          </TableCell>
                          {/*<TableCell numeric>{n.count.toInt()}</TableCell>*/}
                          <TableCell>{n.count}</TableCell>
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

export default withStyles(styles)(GraphSummaryRelationships);
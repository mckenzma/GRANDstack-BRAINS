import React, { useState } from "react";
import { Query } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import Paper from "@material-ui/core/Paper";
import { TableSortLabel } from "@material-ui/core";

import Loading from "./Loading";

const useStyles = makeStyles(theme => ({
  // const styles = theme => ({
  root: {
    maxWidth: 700,
    marginTop: theme.spacing(3),
    overflowX: "auto",
    margin: "auto"
  },
  table: {
    // minWidth: 700
  }
  // });
}));

const GET_NODES = gql`
  {
    nodeSummaryCount {
      label
      count
    }
  }
`;

// function getSorting(order, orderBy) {
//   return order === "desc"
//     ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
//     : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
// }

export default function GraphSummaryNodes() {
  // class GraphSummaryNodes extends React.Component {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     order: "desc",
  //     orderBy: "count"
  //   };
  // }

  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("count");

  const handleSortRequest = property => {
    const newOrderBy = property;
    let newOrder = "desc";

    if (orderBy === property && order === "desc") {
      newOrder = "asc";
    }

    // this.setState({ order, orderBy });
    setOrder(newOrder);
    setOrderBy(newOrderBy);
  };

  function getSorting(order, orderBy) {
    return order === "desc"
      ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
  }

  const { loading, error, data } = useQuery(GET_NODES);
  // render() {
  //   const { order, orderBy } = this.state;
  //   return (
  //     <Query
  //       query={gql`
  //         {
  //           nodeSummaryCount {
  //             label
  //             count
  //           }
  //         }
  //       `}
  //     >
  //       {({ loading, error, data }) => {
  //         // if (loading) return <p>Loading...</p>;

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;
  // if (loading) return <Loading />;
  // if (error) return <p>Error</p>;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell
              key="label"
              sortDirection={orderBy === "label" ? order : false}
            >
              <Tooltip title="Sort" placement="bottom-start" enterDelay={3000}>
                <TableSortLabel
                  active={orderBy === "label"}
                  direction={order}
                  onClick={() => handleSortRequest("label")}
                >
                  Node Label
                </TableSortLabel>
              </Tooltip>
            </TableCell>
            <TableCell
              key="count"
              sortDirection={orderBy === "count" ? order : false}
            >
              <Tooltip title="Sort" placement="bottom-start" enterDelay={3000}>
                <TableSortLabel
                  active={orderBy === "count"}
                  direction={order}
                  onClick={() => handleSortRequest("count")}
                >
                  Count
                </TableSortLabel>
              </Tooltip>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.nodeSummaryCount
            .slice()
            .sort(getSorting(order, orderBy))
            .map(n => {
              return (
                <TableRow key={n.label}>
                  <TableCell component="th" scope="row">
                    {n.label}
                  </TableCell>
                  {/*<TableCell numeric>{n.count.toInt()}</TableCell>*/}
                  <TableCell>{n.count.toLocaleString()}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </Paper>
  );
  //       }}
  //     </Query>
  //   );
  // }
}

// export default withStyles(styles)(GraphSummaryNodes);

import React, { useState } from "react";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
// Material UI component
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import Paper from "@material-ui/core/Paper";
import { TableSortLabel } from "@material-ui/core";

// import Loading from "./Loading";

const useStyles = makeStyles(theme => ({
  // root: {
  //   // maxWidth: 700,
  //   // marginTop: theme.spacing(3),
  //   // overflowX: "auto",
  //   margin: "auto"
  // },
  // table: {
  //   // minWidth: 700
  // }
}));

const GET_RELATIONSHIPS = gql`
  {
    relationshipSummaryCount {
      type
      count
    }
  }
`;

export default function GraphSummaryRelationships() {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("count");

  const handleSortRequest = property => {
    const newOrderBy = property;
    let newOrder = "desc";

    if (orderBy === property && order === "desc") {
      newOrder = "asc";
    }

    setOrder(newOrder);
    setOrderBy(newOrderBy);
  };

  function getSorting(order, orderBy) {
    return order === "desc"
      ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
  }

  const { loading, error, data } = useQuery(GET_RELATIONSHIPS);

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  //TODO: need to make scrolling table
  return (
    <TableContainer /*component={Paper}*/ /*style={{ overflowY: "auto" }}*/>
      <Table
        /*className={classes.table}*/
        stickyHeader={true}
        size="small"
      >
        <TableHead>
          <TableRow>
            <TableCell
              key="type"
              sortDirection={orderBy === "type" ? order : false}
            >
              <Tooltip title="Sort" placement="bottom-start" enterDelay={3000}>
                <TableSortLabel
                  active={orderBy === "type"}
                  direction={order}
                  onClick={() => handleSortRequest("type")}
                >
                  Relationship Type
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
                  <TableCell>{n.count.toLocaleString()}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

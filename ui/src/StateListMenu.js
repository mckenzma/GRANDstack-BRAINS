import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
// import "./StateList.css";
import { withStyles } from "@material-ui/core/styles";
// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableHead from "@material-ui/core/TableHead";
// import TableRow from "@material-ui/core/TableRow";
// import Tooltip from "@material-ui/core/Tooltip";
// import Paper from "@material-ui/core/Paper";
// import { TableSortLabel } from "@material-ui/core";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
  root: {
    // maxWidth: 700,
    // marginTop: theme.spacing.unit * 3,
    // overflowX: "auto",
    // margin: "auto"
  }
  // table: {
  //   minWidth: 700
  // }
});

// function getSorting(order, orderBy) {
//   return order === "desc"
//     ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
//     : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
// }

class StateListMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // order: "asc",
      // orderBy: "avgStars"

      checked: true
    };
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

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
            State {
              id
              name
            }
          }
        `}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error</p>;

          return (
            <div>
              <List>
                <ListItem >
                  <ListItemText>States</ListItemText>
                </ListItem>
              {data.State
                .slice()
                // .sort(getSorting(order, orderBy))
                .map(n => {
                  return (
                    <ListItem button key={n.id}>
                      <Checkbox
                        checked={this.state.checked}
                        onChange={this.handleChange('checked')}
                        value="checked"
                      />
                      <ListItemText>{n.name}</ListItemText>
                    </ListItem>
                  );
                })}
                </List>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default StateListMenu;
// export default withStyles(styles)(StateListMenu);

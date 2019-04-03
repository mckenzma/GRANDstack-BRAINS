import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import { withStyles } from "@material-ui/core/styles";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
  root: {
    // maxWidth: 700,
    // marginTop: theme.spacing.unit * 3,
    // overflowX: "auto",
    // margin: "auto"
  }
});

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

class StateListMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: "asc",
      orderBy: "name",

      checked: false,
      // checked: {
      //   AK: true,
      //   MN: true,
      // },
      AK: false,
      MN: false,
    };
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
    console.log(name);
  };

  render() {
    const { order, orderBy } = this.state;
    // const { order } = this.state;
    console.log(this.state);
    
    ;
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
                .sort(getSorting(order, orderBy))
                .map(n => {
                  return (
                    <ListItem key={n.id}>
                      <Checkbox
                        // checked={this.state.checked}
                        checked={this.state[n.name]}
                        // onChange={this.handleChange('checked')}
                        onChange={this.handleChange(n.name)}
                        // value="checked"
                        value={n.name}
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

import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

//import { withStyles } from "@material-ui/core/styles";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
//import Checkbox from '@material-ui/core/Checkbox';

import Radio from "@material-ui/core/Radio";
//import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
//import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

//import MapLeaf from './MapLeaflet';

/*const styles = theme => ({
  root: {
    // maxWidth: 700,
    // marginTop: theme.spacing.unit * 3,
    // overflowX: "auto",
    // margin: "auto"
  }
});*/

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

class StateListMenu extends React.Component {
  /*}  constructor(props) {
    super(props);

    this.state = {
      order: "asc",
      orderBy: "name",
      //name: null

      //checked: false,
      // checked: {
      //   AK: true,
      //   MN: true,
      // },
      //AK: false,
      //MN: false,
    };
  }*/

  constructor(props) {
    super(props);

    this.state = {
      order: "asc",
      orderBy: "name",
      name: null,
      selectedStates: []
    };
  }

  // componentWillReceiveProps(props) {
  //   //this.setState({ name: props.name, order: props.order, orderBy: props.orderBy })
  //   this.setState({ order: props.order, orderBy: props.orderBy })
  // }

  handleChange = name => event => {
    //this.setState({ [name]: event.target.checked });
    //this.setState({ name: name });
    this.props.triggerParentUpdate(name);
    this.setState({ selectedValue: event.target.value });
    //this.state.selectedStates = this.state.selectedStates.concat(name); //this adds selected state to an array

    //this.setState({ name: name }, () => { this.MapLeaf.render() } );
    //this.setState({ name: [name, event.target.checked] });
    //console.log(name);
  };

  render() {
    //const { order, orderBy, name } = this.state;
    const { order, orderBy } = this.state;
    //const { order, orderBy, name } = this.props;

    //const { _name } = this.state.name;
    // const { order } = this.state;
    //console.log(this.state);

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
        {/*<Query
        query={gql`
          {
            State {
              id
              name
              bridges {
                id
                name
                latitude_decimal
                longitude_decimal
                yearbuilt
              }
            }
          }
        `}
      >*/}
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error</p>;

          return (
            <div>
              <List>
                <ListItem>
                  <ListItemText>States</ListItemText>
                </ListItem>
                {data.State.slice()
                  .sort(getSorting(order, orderBy))
                  .map(n => {
                    return (
                      <ListItem key={n.id}>
                        {/*<Checkbox
                        // checked={this.state.checked}
                        checked={this.state[n.name]}
                        //checked={this.props[n.name]}
                        // onChange={this.handleChange('checked')}
                        onChange={this.handleChange(n.name)}
                        // value="checked"
                        value={n.name}
                      />*/}
                        <Radio
                          checked={this.state.selectedValue === n.name}
                          onChange={this.handleChange(n.name)}
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

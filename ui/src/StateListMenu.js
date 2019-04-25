import React from "react";

import PropTypes from "prop-types";

import { Query } from "react-apollo";
import gql from "graphql-tag";

//import { withStyles } from "@material-ui/core/styles";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";

import Radio from "@material-ui/core/Radio";
//import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
//import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

import Divider from "@material-ui/core/Divider";

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
      selectedStates: [],
      selected: []
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

  handleClick = (event, id) => {
    const { selected, numSelected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
    this.setState({ numSelected: newSelected.length });

    this.props.triggerParentUpdate(newSelected);

    console.log("selected: " + selected);
    console.log("numSelected: " + numSelected);

    console.log(this.state);
    //this.setState(state => ({ rowCount: state.data.length}));
    //console.log("rowCount: " + this.state);
    //this.setState({ numSelected: selected.length});
    //console.log("numSelected: " + selected.length);
  };

  //handleSelectAllClick = event => {
  handleSelectAllClick = (event, data) => {
    const { numSelected } = this.state;
    if (event.target.checked) {
      this.setState({ selected: data.map(n => n.id) });
      this.setState(state => ({ numSelected: state.selected.length }));
      //this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
    this.setState(state => ({ numSelected: state.selected.length }));
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    //const { order, orderBy, name } = this.state;
    const { order, orderBy, selected } = this.state;
    //const { data } = this.state;
    const { onSelectAllClick, numSelected, rowCount } = this.state;
    //console.log("onSelectAllClick: " + onSelectAllClick);
    //console.log("numSelected: " + numSelected);
    //console.log("select.length: " + this.state.select.length);
    //console.log("rowCount: " + rowCount);
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

          const rowCount = Object.keys(data.State).length;
          console.log(data);
          console.log("rowCount: " + rowCount);
          console.log("numSelected: " + numSelected);

          //console.log("onSelectAllClick: " + onSelectAllClick);
          //console.log("numSelected: " + numSelected);
          //console.log("rowCount: " + rowCount);

          return (
            <div>
              <List>
                <ListItem>
                  <ListItemText>States</ListItemText>
                </ListItem>
                <ListItem>
                  <Checkbox
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={numSelected === rowCount}
                    //selected={numSelected === rowCount}
                    //onChange={onSelectAllClick}
                    //  onChange={this.handleSelectAllClick}
                    onChange={event =>
                      this.handleSelectAllClick(event, Object(data.State))
                    }
                    //onSelectAllClick={this.handleSelectAllClick}
                  />
                  <ListItemText>Select All</ListItemText>
                </ListItem>
                <Divider />
                {data.State.slice()
                  .sort(getSorting(order, orderBy))
                  .map(n => {
                    const isSelected = this.isSelected(n.id);
                    return (
                      <ListItem key={n.id}>
                        <Checkbox
                          // checked={this.state.checked}
                          //    checked={this.state[n.name]}
                          checked={isSelected}
                          //checked={this.props[n.name]}
                          // onChange={this.handleChange('checked')}
                          onChange={this.handleChange(n.name)}
                          // value="checked"
                          value={n.name}
                          selected={isSelected}
                          onClick={event => this.handleClick(event, n.id)}
                        />
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

// List.propTypes = {
//   numSelected: PropTypes.number.isRequired,
//   onSelectAllClick: PropTypes.func.isRequired,
//   rowCount: PropTypes.number.isRequired,
// };

export default StateListMenu;
// export default withStyles(styles)(StateListMenu);

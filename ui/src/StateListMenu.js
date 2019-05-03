import React from "react";

import { Query } from "react-apollo";
import gql from "graphql-tag";

// import List from "@material-ui/core/List";
// import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";

// import Radio from "@material-ui/core/Radio";
//import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
//import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

import Divider from "@material-ui/core/Divider";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import PropTypes from "prop-types";

// import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
    // maxWidth: 300
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    margin: theme.spacing.unit / 4
  },
  noLabel: {
    marginTop: theme.spacing.unit * 3
  }
});

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250
//     }
//   }
// };

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

// function getStyles(name, that) {
//   return {
//     fontWeight:
//       that.state.name.indexOf(name) === -1
//         ? that.props.theme.typography.fontWeightRegular
//         : that.props.theme.typography.fontWeightMedium
//   };
// }

class StateListMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: "asc", // sets order of states to be named in list
      orderBy: "name",
      name: null,
      selectedStates: [],
      // selected: []
      selected: this.props.selected,
      numSelected: this.props.numSelected
    };
  }

  handleChange = name => event => {
    this.props.triggerParentUpdate("name", name);
    this.setState({ selectedValue: event.target.value });
  };

  handleClick = (event, name) => {
    //const { selected, numSelected } = this.state;
    const { selected } = this.state;
    // const { selected } = this.props;
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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

    this.setState({ selected: newSelected.sort() });
    this.setState({ numSelected: newSelected.length });
    this.props.triggerParentUpdate("selected", newSelected);
    this.props.triggerParentUpdate("numSelected", newSelected.length);
    // console.log("select: newSelected: " + newSelected);
    // console.log("select: numSelected: " + newSelected.length);
  };

  handleSelectAllClick = (event, data) => {
    // const { numSelected } = this.state;

    let newSelected = [];

    if (event.target.checked) {
      newSelected = data.map(n => n.name);
      // console.log("selecte all: newSelected: " + newSelected);
      this.setState({ selected: newSelected.sort() });
      this.setState(state => ({ numSelected: state.selected.length }));
      this.props.triggerParentUpdate(state => ({
        numSelected: state.selected.length
      }));
      this.props.triggerParentUpdate("selected", newSelected);
      return;
    }
    this.setState({ selected: [] });
    this.setState(state => ({ numSelected: state.selected.length }));
    this.props.triggerParentUpdate(state => ({ selected: state.selected }));
  };

  isSelected = name => this.state.selected.indexOf(name) !== -1;

  render() {
    const { order, orderBy } = this.state;

    // const { selected } = this.props;
    // const { onSelectAllClick, numSelected, rowCount } = this.state;

    const { numSelected } = this.state;
    // console.log("numSelected: " + numSelected);
    // const { numSelected } = this.props;

    const { classes } = this.props;

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

          const rowCount = Object.keys(data.State).length;
          // console.log("rowCount: " + rowCount);
          // console.log("numSelected: " + numSelected);

          return (
            <div className={classes.root}>
              <FormControl className={classes.formControl}>
                <InputLabel>States</InputLabel>
                <Select
                  multiple
                  value={this.state.selected}
                  renderValue={selected => (
                    <div className={classes.chips}>
                      {this.state.selected.map(value => (
                        <Chip
                          key={value}
                          label={value} /*display="flex" flexWrap="wrap"*/
                        />
                      ))}
                    </div>
                  )}
                  // MenuProps={MenuProps}
                >
                  <MenuItem>
                    <Checkbox
                      // disabled
                      indeterminate={numSelected > 0 && numSelected < rowCount}
                      checked={numSelected === rowCount}
                      onChange={event =>
                        this.handleSelectAllClick(event, Object(data.State))
                      }
                    />
                    <ListItemText>Select All</ListItemText>
                  </MenuItem>
                  <Divider />
                  {data.State.slice()
                    .sort(getSorting(order, orderBy))
                    .map(n => {
                      const isSelected = this.isSelected(n.name);
                      return (
                        <MenuItem key={n.name}>
                          <Checkbox
                            checked={isSelected}
                            onChange={this.handleChange(n.name)}
                            value={n.name}
                            selected={isSelected} // is this actually needed? - test removal
                            onClick={event => this.handleClick(event, n.name)}
                          />
                          <ListItemText>{n.name}</ListItemText>
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
              {/*}              <List>
                <ListItem>
                  <ListItemText>States</ListItemText>
                </ListItem>
                <ListItem>
                  <Checkbox
                    disabled // disable to prevent app from crashing by letting them select all
                    // need to update query/load so that don't need to reload/requery all according to filters
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
                    // const isSelected = this.isSelected(n.id);
                    const isSelected = this.isSelected(n.name);
                    return (
                      //{/*<ListItem key={n.id}>*/}
              {/*}                      <ListItem key={n.name}>
                        <Checkbox
                          // checked={this.state.checked}
                          //    checked={this.state[n.name]}
                          checked={isSelected}
                          //checked={this.props[n.name]}
                          // onChange={this.handleChange('checked')}
                          onChange={this.handleChange(n.name)}
                          // value="checked"
                          value={n.name}
                          selected={isSelected} // is this actually needed? - test removal
                          // onClick={event => this.handleClick(event, n.id)}
                          onClick={event => this.handleClick(event, n.name)}
                        />
                        {/*<Radio
                          checked={this.state.selectedValue === n.name}
                          onChange={this.handleChange(n.name)}
                          value={n.name}
                        />*/}
              {/*}                        <ListItemText>{n.name}</ListItemText>
                      </ListItem>
                    );
                  })}
              </List>*/}
            </div>
          );
        }}
      </Query>
    );
  }
}

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

StateListMenu.propTypes = {
  classes: PropTypes.object.isRequired
};

// export default StateListMenu;
export default withStyles(styles, { withTheme: true })(StateListMenu);

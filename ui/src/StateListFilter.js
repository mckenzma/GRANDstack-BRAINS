import React from "react";

import { Query } from "react-apollo";
import gql from "graphql-tag";

import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";

import Divider from "@material-ui/core/Divider";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
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

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

class StateListFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: "asc", // sets order of states to be named in list
      orderBy: "name",
      name: null,
      selectedStates: [],
      selected: this.props.selected,
      numSelected: this.props.numSelected
    };
  }

  handleChange = name => event => {
    this.props.triggerParentUpdate("name", name);
    this.setState({ selectedValue: event.target.value });
  };

  handleClick = (event, name) => {
    const { selected } = this.state;
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
  };

  handleSelectAllClick = (event, data) => {
    let newSelected = [];

    if (event.target.checked) {
      newSelected = data.map(n => n.name);
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

    const { numSelected } = this.state;

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
            </div>
          );
        }}
      </Query>
    );
  }
}

StateListFilter.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(StateListFilter);

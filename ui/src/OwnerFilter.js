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

class OwnerFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: "asc", // sets order of descriptions to be listed in the menu
      orderBy: "description",
      ownerSelected: this.props.ownerSelected,
      numOwnerSelected: this.props.numOwnerSelected
    };
  }

  handleChange = description => event => {
    this.setState({ selectedValue: event.target.value });
  };

  handleClick = (event, description) => {
    const { ownerSelected } = this.state;
    const selectedIndex = ownerSelected.indexOf(description);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(ownerSelected, description);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(ownerSelected.slice(1));
    } else if (selectedIndex === ownerSelected.length - 1) {
      newSelected = newSelected.concat(ownerSelected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        ownerSelected.slice(0, selectedIndex),
        ownerSelected.slice(selectedIndex + 1)
      );
    }

    this.setState({ ownerSelected: newSelected.sort() });
    this.setState({ numOwnerSelected: newSelected.length });
    this.props.triggerParentUpdate("ownerSelected", newSelected);
    this.props.triggerParentUpdate("numOwnerSelected", newSelected.length);
  };

  handleSelectAllClick = (event, data) => {
    let newSelected = [];

    if (event.target.checked) {
      newSelected = data.map(n => n.description);
      this.setState({ ownerSelected: newSelected.sort() });
      this.setState(state => ({
        numOwnerSelected: state.ownerSelected.length
      }));
      this.props.triggerParentUpdate(state => ({
        numOwnerSelected: state.ownerSelected.length
      }));
      this.props.triggerParentUpdate("ownerSelected", newSelected);
      return;
    }
    this.setState({ ownerSelected: [] });
    this.setState(state => ({
      numOwnerSelected: state.ownerSelected.length
    }));
    this.props.triggerParentUpdate(state => ({
      ownerSelected: state.ownerSelected
    }));
  };

  isOwnerSelected = description =>
    this.state.ownerSelected.indexOf(description) !== -1;

  render() {
    const { order, orderBy } = this.state;

    const { numOwnerSelected } = this.state;

    const { classes } = this.props;

    return (
      <Query
        query={gql`
          {
            Owner {
              id
              description
            }
          }
        `}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error</p>;

          const rowOwnerCount = Object.keys(data.Owner).length;

          return (
            <div className={classes.root}>
              <FormControl className={classes.formControl}>
                <InputLabel>Owner</InputLabel>
                <Select
                  multiple
                  value={this.state.ownerSelected}
                  renderValue={ownerSelected => (
                    <div className={classes.chips}>
                      {this.state.ownerSelected.map(value => (
                        <Chip key={value} label={value} />
                      ))}
                    </div>
                  )}
                >
                  <MenuItem>
                    <Checkbox
                      // disabled
                      indeterminate={
                        numOwnerSelected > 0 && numOwnerSelected < rowOwnerCount
                      }
                      checked={numOwnerSelected === rowOwnerCount}
                      onChange={event =>
                        this.handleSelectAllClick(event, Object(data.Owner))
                      }
                    />
                    <ListItemText>Select All</ListItemText>
                  </MenuItem>
                  <Divider />
                  {data.Owner.slice()
                    .sort(getSorting(order, orderBy))
                    .map(n => {
                      const isOwnerSelected = this.isOwnerSelected(
                        n.description
                      );
                      return (
                        <MenuItem key={n.description}>
                          <Checkbox
                            checked={isOwnerSelected}
                            onChange={this.handleChange(n.description)}
                            value={n.description}
                            selected={isOwnerSelected} // is this actually needed? - test removal
                            onClick={event =>
                              this.handleClick(event, n.description)
                            }
                          />
                          <ListItemText>{n.description}</ListItemText>
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

OwnerFilter.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(OwnerFilter);

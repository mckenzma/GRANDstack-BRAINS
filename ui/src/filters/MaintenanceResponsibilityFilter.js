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
    margin: theme.spacing(1),
    minWidth: 120
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    margin: theme.spacing(0.25)
  },
  noLabel: {
    marginTop: theme.spacing(3)
  }
});

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

class MaintenanceResponsibilityFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: "asc", // sets order of descriptions to be listed in the menu
      orderBy: "description",
      maintRespSelected: this.props.maintRespSelected,
      numMaintRespSelected: this.props.numMaintRespSelected
    };
  }

  handleChange = description => event => {
    this.setState({ selectedValue: event.target.value });
  };

  handleClick = (event, description) => {
    const { maintRespSelected } = this.state;
    const selectedIndex = maintRespSelected.indexOf(description);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(maintRespSelected, description);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(maintRespSelected.slice(1));
    } else if (selectedIndex === maintRespSelected.length - 1) {
      newSelected = newSelected.concat(maintRespSelected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        maintRespSelected.slice(0, selectedIndex),
        maintRespSelected.slice(selectedIndex + 1)
      );
    }

    this.setState({ maintRespSelected: newSelected.sort() });
    this.setState({ numMaintRespSelected: newSelected.length });
    this.props.triggerParentUpdate("maintRespSelected", newSelected);
    this.props.triggerParentUpdate("numMaintRespSelected", newSelected.length);
  };

  handleSelectAllClick = (event, data) => {
    let newSelected = [];

    if (event.target.checked) {
      newSelected = data.map(n => n.description);
      this.setState({ maintRespSelected: newSelected.sort() });
      this.setState(state => ({
        numMaintRespSelected: state.maintRespSelected.length
      }));
      this.props.triggerParentUpdate(state => ({
        numMaintRespSelected: state.maintRespSelected.length
      }));
      this.props.triggerParentUpdate("maintRespSelected", newSelected);
      return;
    }
    this.setState({ maintRespSelected: [] });
    this.setState(state => ({
      numMaintRespSelected: state.maintRespSelected.length
    }));
    this.props.triggerParentUpdate(state => ({
      maintRespSelected: state.maintRespSelected
    }));
  };

  isMaintRespSelected = description =>
    this.state.maintRespSelected.indexOf(description) !== -1;

  render() {
    const { order, orderBy } = this.state;

    const { numMaintRespSelected } = this.state;

    const { classes } = this.props;

    return (
      <Query
        query={gql`
          {
            MaintenanceResp {
              id
              description
            }
          }
        `}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error</p>;

          const rowMaintRespCount = Object.keys(data.MaintenanceResp).length;

          return (
            <div className={classes.root}>
              <FormControl className={classes.formControl}>
                <InputLabel>Maintenance Responsibility</InputLabel>
                <Select
                  multiple
                  value={this.state.maintRespSelected}
                  renderValue={maintRespSelected => (
                    <div className={classes.chips}>
                      {this.state.maintRespSelected.map(value => (
                        <Chip key={value} label={value} />
                      ))}
                    </div>
                  )}
                >
                  <MenuItem>
                    <Checkbox
                      // disabled
                      indeterminate={
                        numMaintRespSelected > 0 &&
                        numMaintRespSelected < rowMaintRespCount
                      }
                      checked={numMaintRespSelected === rowMaintRespCount}
                      onChange={event =>
                        this.handleSelectAllClick(
                          event,
                          Object(data.MaintenanceResp)
                        )
                      }
                    />
                    <ListItemText>Select All</ListItemText>
                  </MenuItem>
                  <Divider />
                  {data.MaintenanceResp.slice()
                    .sort(getSorting(order, orderBy))
                    .map(n => {
                      const isMaintRespSelected = this.isMaintRespSelected(
                        n.description
                      );
                      return (
                        <MenuItem key={n.description}>
                          <Checkbox
                            checked={isMaintRespSelected}
                            onChange={this.handleChange(n.description)}
                            value={n.description}
                            selected={isMaintRespSelected} // is this actually needed? - test removal
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

MaintenanceResponsibilityFilter.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(
  MaintenanceResponsibilityFilter
);

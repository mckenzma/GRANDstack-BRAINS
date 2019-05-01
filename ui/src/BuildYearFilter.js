import React from "react";

import { Query } from "react-apollo";
import gql from "graphql-tag";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";

import Divider from "@material-ui/core/Divider";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import PropTypes from "prop-types";

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

class BuildYearFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // order: "asc",
      order: "desc", // sets order of years to be listed in the menu
      orderBy: "year",
      // name: null,
      //selectedStates: [],
      // selected: []
      yearSelected: this.props.yearSelected,
      numYearSelected: this.props.numYearSelected
    };
  }

  handleChange = year => event => {
    // this.props.triggerParentUpdate("yearSelected", year);
    this.setState({ selectedValue: event.target.value });
  };

  handleClick = (event, year) => {
    //const { selected, numSelected } = this.state;
    const { yearSelected } = this.state;
    // const { yearSelected } = this.props;
    const selectedIndex = yearSelected.indexOf(year);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(yearSelected, year);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(yearSelected.slice(1));
    } else if (selectedIndex === yearSelected.length - 1) {
      newSelected = newSelected.concat(yearSelected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        yearSelected.slice(0, selectedIndex),
        yearSelected.slice(selectedIndex + 1)
      );
    }

    this.setState({ yearSelected: newSelected.sort().reverse() });
    this.setState({ numYearSelected: newSelected.length });
    this.props.triggerParentUpdate("yearSelected", newSelected);
    this.props.triggerParentUpdate("numYearSelected", newSelected.length);
    // console.log("select: newSelected: " + newSelected);
    // console.log("select: numSelected: " + newSelected.length);
  };

  handleSelectAllClick = (event, data) => {
    // const { numSelected } = this.state;

    let newSelected = [];

    if (event.target.checked) {
      newSelected = data.map(n => n.year);
      console.log("selected all: newSelected: " + newSelected);
      this.setState({ yearSelected: newSelected });
      this.setState(state => ({ numYearSelected: state.yearSelected.length }));
      this.props.triggerParentUpdate(state => ({
        numYearSelected: state.yearSelected.length
      }));
      this.props.triggerParentUpdate("yearSelected", newSelected);
      return;
    }
    this.setState({ yearSelected: [] });
    this.setState(state => ({ numYearSelected: state.yearSelected.length }));
    this.props.triggerParentUpdate(state => ({
      yearSelected: state.yearSelected
    }));
  };

  isYearSelected = year => this.state.yearSelected.indexOf(year) !== -1;

  render() {
    const { order, orderBy } = this.state;

    // const { selected } = this.props;
    // const { onSelectAllClick, numSelected, rowCount } = this.state;

    const { numYearSelected } = this.state;
    // const { numSelected } = this.props;

    const { classes } = this.state;

    return (
      <Query
        query={gql`
          {
            BuildYear {
              #id
              year
            }
          }
        `}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error</p>;

          const rowYearCount = Object.keys(data.BuildYear).length;

          return (
            <div>
              <FormControl>
                <InputLabel>Build Years</InputLabel>
                <Select
                  multiple
                  value={this.state.yearSelected}
                  renderValue={yearSelected => (
                    <div>
                      {this.state.yearSelected.map(value => (
                        <Chip key={value} label={value} />
                      ))}
                    </div>
                  )}
                >
                  <MenuItem>
                    <Checkbox
                      // disabled
                      indeterminate={
                        numYearSelected > 0 && numYearSelected < rowYearCount
                      }
                      checked={numYearSelected === rowYearCount}
                      onChange={event =>
                        this.handleSelectAllClick(event, Object(data.BuildYear))
                      }
                    />
                    <ListItemText>Select All</ListItemText>
                  </MenuItem>
                  <Divider />
                  {data.BuildYear.slice()
                    .sort(getSorting(order, orderBy))
                    .map(n => {
                      const isYearSelected = this.isYearSelected(n.year);
                      return (
                        <MenuItem key={n.year}>
                          <Checkbox
                            checked={isYearSelected}
                            onChange={this.handleChange(n.year)}
                            value={toString(n.year)}
                            //selected={isYearSelected} // is this actually needed? - test removal
                            selected={isYearSelected} // is this actually needed? - test removal
                            onClick={event => this.handleClick(event, n.year)}
                          />
                          <ListItemText>{n.year}</ListItemText>
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

export default BuildYearFilter;
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery } from "@apollo/react-hooks";
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

const useStyles = makeStyles(theme => ({
  // const styles = theme => ({
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
  // });
}));

const GET_BUILD_YEARS = gql`
  {
    queryBuildYear {
      year
    }
  }
  #{
  #  BuildYear {
  #    #id
  #    year
  #  }
  #}
`;

// function getSorting(order, orderBy) {
//   return order === "desc"
//     ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
//     : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
// }

export default function BuildYearFilter({ selectedYears, setSelectedYears }) {
  // class BuildYearFilter extends React.Component {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     order: "desc", // sets order of years to be listed in the menu
  //     orderBy: "year",
  //     yearSelected: this.props.yearSelected,
  //     numYearSelected: this.props.numYearSelected
  //   };
  // }

  const classes = useStyles();

  const { loading, error, data } = useQuery(GET_BUILD_YEARS);

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("year");

  const [year, setYear] = useState(null);

  const [state, setState] = useState(null);

  const [selected, setSelected] = useState("");
  const [numSelected, setNumSelected] = useState(0);
  const [numSelectedYears, setNumSelectedYears] = useState(
    selectedYears.length
  );

  const handleChange = year => event => {
    // this.setState({ selectedValue: event.target.value });
    setState({ ...state, [year]: event.target.checked });
  };

  // console.log(state);

  const handleClick = (event, year) => {
    // const { yearSelected } = this.state;
    setSelected(selectedYears);
    const selectedIndex = selectedYears.indexOf(year);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedYears, year);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedYears.slice(1));
    } else if (selectedIndex === selectedYears.length - 1) {
      newSelected = newSelected.concat(selectedYears.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedYears.slice(0, selectedIndex),
        selectedYears.slice(selectedIndex + 1)
      );
    }

    // this.setState({ yearSelected: newSelected.sort().reverse() });
    setSelectedYears(newSelected.sort().reverse());
    // this.setState({ numYearSelected: newSelected.length });
    setNumSelectedYears(newSelected.length);
    // this.props.triggerParentUpdate("yearSelected", newSelected);
    // this.props.triggerParentUpdate("numYearSelected", newSelected.length);
  };

  // console.log(data);

  const handleSelectAllClick = (event, data) => {
    let newSelected = [];

    if (event.target.checked) {
      newSelected = data.map(n => n.year);
      console.log(data.map(n => n.year));
      setSelectedYears(newSelected.sort().reverse());
      // this.setState({ yearSelected: newSelected.sort().reverse() });
      // this.setState(state => ({ numYearSelected: state.yearSelected.length }));
      // this.props.triggerParentUpdate(state => ({
      // numYearSelected: state.yearSelected.length
      // }));
      // this.props.triggerParentUpdate("yearSelected", newSelected);
      setNumSelectedYears(rowCount);
      return;
    }
    // this.setState({ yearSelected: [] });
    setSelectedYears([]);
    // this.setState(state => ({ numYearSelected: state.yearSelected.length }));
    setNumSelected(0);
    // this.props.triggerParentUpdate(state => ({
    //   yearSelected: state.yearSelected
    // }));
  };

  function getSorting(order, orderBy) {
    return order === "desc"
      ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
  }

  // isYearSelected = year => this.state.yearSelected.indexOf(year) !== -1;

  // render() {
  // const { order, orderBy } = this.state;

  // const { numYearSelected } = this.state;

  // const { classes } = this.props;

  // return (
  //   <Query
  //     query={gql`
  //       {
  //         queryBuildYear {
  //           year
  //         }
  //       }
  //       #{
  //       #  BuildYear {
  //       #    #id
  //       #    year
  //       #  }
  //       #}
  //     `}
  //   >
  // //     {({ loading, error, data }) => {
  //       if (loading) return <p>Loading...</p>;
  //       if (error) return <p>Error</p>;

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  // const rowYearCount = Object.keys(data.BuildYear).length;
  const rowCount = Object.keys(data.queryBuildYear).length;

  return (
    // <div className={classes.root}>
    <FormControl className={classes.formControl}>
      <InputLabel>Build Years</InputLabel>
      <Select
        multiple
        value={selectedYears}
        renderValue={selectedYears => (
          <div className={classes.chips}>
            {selectedYears.map(value => (
              <Chip key={value} label={value} />
            ))}
          </div>
        )}
      >
        <MenuItem>
          <Checkbox
            // disabled
            indeterminate={numSelectedYears > 0 && numSelectedYears < rowCount}
            checked={numSelectedYears === rowCount}
            onChange={event =>
              // this.handleSelectAllClick(event, Object(data.BuildYear))
              handleSelectAllClick(event, Object(data.queryBuildYear))
            }
          />
          <ListItemText>Select All</ListItemText>
        </MenuItem>
        <Divider />
        {/*{data.BuildYear.slice()*/}
        {data.queryBuildYear
          .slice()
          .sort(getSorting(order, orderBy))
          .map(n => {
            // const isYearSelected = isYearSelected(n.year);
            return (
              <MenuItem key={n.year} value={n.year}>
                <Checkbox
                  checked={selectedYears.indexOf(n.year) !== -1}
                  onChange={handleChange(n.year)}
                  value={toString(n.year)}
                  // value={n.year}
                  // selected={isYearSelected} // is this actually needed? - test removal
                  onClick={event => handleClick(event, n.year)}
                />
                <ListItemText>{n.year}</ListItemText>
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>
    // </div>
  );
  //       }}
  //     </Query>
  //   );
  // }
}

// BuildYearFilter.propTypes = {
//   classes: PropTypes.object.isRequired
// };

// export default withStyles(styles, { withTheme: true })(BuildYearFilter);

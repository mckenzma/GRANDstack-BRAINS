import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery } from "@apollo/react-hooks";

import { Query } from "react-apollo";
import gql from "graphql-tag";

import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

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

const GET_STATES = gql`
  {
    State {
      name
      code
      abbreviation
    }
  }
`;

// function getSorting(order, orderBy) {
//   return order === "desc"
//     ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
//     : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
// }

export default function StateListFilter({
  selectedStates,
  setSelectedStates
  // numSelectedStates,
  // setNumSelectedStates
}) {
  const classes = useStyles();

  // console.log(selected);

  const { loading, error, data } = useQuery(GET_STATES);
  // class StateListFilter extends React.Component {
  // constructor(props) {
  // super(props);

  // this.state = {
  // order: "asc", // sets order of states to be named in list
  const [order, setOrder] = useState("asc");
  // orderBy: "abbreviation",
  const [orderBy, setOrderBy] = useState("abbreviation");
  // abbreviation: null,
  const [abbreviation, setAbbreviation] = useState(null);
  // selectedStates: [],
  // const [selectedStates, setSelectedStates] = useState([]);
  // const [numSelectedStates, setNumSelectedStates] = useState(0);
  // selected: this.props.selected,
  // numSelected: this.props.numSelected
  // };
  // };
  const [state, setState] = useState(null);

  const [selected, setSelected] = useState("");
  const [numSelected, setNumSelected] = useState(0);
  const [numSelectedStates, setNumSelectedStates] = useState(
    selectedStates.length
  );

  // const order = "asc";
  // const orderBy = "abbreviation";
  // const [abbreviation, setAbbreviation] = useState("");
  // const [selectedStates, setSelectedState] = useState([]);

  const handleChange = abbreviation => event => {
    // this.props.triggerParentUpdate("abbreviation", abbreviation);
    // this.setState({ selectedValue: event.target.value });
    setState({ ...state, [abbreviation]: event.target.checked });
  };

  function handleClick(event, abbreviation) {
    // const { selected } = this.state;
    setSelected(selectedStates);
    const selectedIndex = selectedStates.indexOf(abbreviation);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedStates, abbreviation);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedStates.slice(1));
    } else if (selectedIndex === selectedStates.length - 1) {
      newSelected = newSelected.concat(selectedStates.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedStates.slice(0, selectedIndex),
        selectedStates.slice(selectedIndex + 1)
      );
    }

    // this.setState({ selected: newSelected.sort() });
    setSelectedStates(newSelected.sort());
    // this.setState({ numSelected: newSelected.length });
    setNumSelectedStates(newSelected.length);
    // this.props.triggerParentUpdate("selected", newSelected);
    // this.props.triggerParentUpdate("numSelected", newSelected.length);
  }

  const handleSelectAllClick = (event, data) => {
    let newSelected = [];

    if (event.target.checked) {
      newSelected = data.map(n => n.abbreviation);
      setSelectedStates(newSelected.sort());
      // newSelected = data.map(n => n.abbreviation);
      // this.setState({ selected: newSelected.sort() });
      // this.setState(state => ({ numSelected: state.selected.length }));
      // this.props.triggerParentUpdate(state => ({
      // numSelected: state.selected.length
      setNumSelectedStates(rowCount);
      // }));
      // this.props.triggerParentUpdate("selected", newSelected);
      return;
    }
    // this.setState({ selected: [] });
    setSelectedStates([]);
    // this.setState(state => ({ numSelected: state.selected.length }));
    setNumSelected(0);
    // this.props.triggerParentUpdate(state => ({ selected: state.selected }));
  };

  function getSorting(order, orderBy) {
    return order === "desc"
      ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
  }

  // isSelected = abbreviation => this.state.selected.indexOf(abbreviation) !== -1;

  // render() {
  //   const { order, orderBy } = this.state;

  //   const { numSelected } = this.state;

  //   const { classes } = this.props;

  // return (
  //   <Query
  //     query={gql`
  //       {
  //         State {
  //           # id
  //           name
  //           code
  //           abbreviation
  //         }
  //       }
  //     `}
  //   >
  //     {({ loading, error, data }) => {
  //       if (loading) return <p>Loading...</p>;
  //       if (error) return <p>Error</p>;

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  // console.log(data);

  const rowCount = Object.keys(data.State).length;
  // const rowCount = 0;

  return (
    // <div className={classes.root}>
    <FormControl className={classes.formControl}>
      <InputLabel>States</InputLabel>
      <Select
        multiple
        // value={this.state.selected}
        value={selectedStates}
        renderValue={selectedStates => (
          <div className={classes.chips}>
            {selectedStates.map(value => (
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
            indeterminate={
              numSelectedStates > 0 && numSelectedStates < rowCount
            }
            checked={numSelectedStates === rowCount}
            onChange={event =>
              // this.handleSelectAllClick(event, Object(data.State))
              handleSelectAllClick(event, Object(data.State))
            }
          />
          <ListItemText>Select All</ListItemText>
        </MenuItem>
        <Divider />
        {data.State.slice()
          .sort(getSorting(order, orderBy))
          .map(n => {
            // const isSelected = this.isSelected(n.abbreviation);
            // const isSelected = isSelected(n.abbreviation);
            return (
              <MenuItem key={n.abbreviation} value={n.abbreviation}>
                <Checkbox
                  checked={selectedStates.indexOf(n.abbreviation) !== -1}
                  // onChange={this.handleChange(n.abbreviation)}
                  onChange={handleChange(n.abbreviation)}
                  value={n.abbreviation}
                  // selected={isSelected} // is this actually needed? - test removal
                  onClick={event =>
                    // this.handleClick(event, n.abbreviation)
                    handleClick(event, n.abbreviation)
                  }
                />
                <ListItemText>{n.abbreviation}</ListItemText>
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>
    // </div>
  );
  // }}
  // </Query>
  // );
  // }
}

// StateListFilter.propTypes = {
// classes: PropTypes.object.isRequired
// };

// export default withStyles(styles, { withTheme: true })(StateListFilter);

import React, { useState } from "react";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { makeStyles } from "@material-ui/core/styles";
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

import Loading from "./../Loading";

const useStyles = makeStyles(theme => ({
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

export default function StateListFilter({
  selectedStates,
  setSelectedStates
  // numSelectedStates,
  // setNumSelectedStates
}) {
  const classes = useStyles();

  const { loading, error, data } = useQuery(GET_STATES);

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("abbreviation");
  const [abbreviation, setAbbreviation] = useState(null);
  const [state, setState] = useState(null);

  const [selected, setSelected] = useState("");
  const [numSelected, setNumSelected] = useState(0);
  const [numSelectedStates, setNumSelectedStates] = useState(
    selectedStates.length
  );

  const handleChange = abbreviation => event => {
    setState({ ...state, [abbreviation]: event.target.checked });
  };

  function handleClick(event, abbreviation) {
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

    setSelectedStates(newSelected.sort());
    setNumSelectedStates(newSelected.length);
  }

  const handleSelectAllClick = (event, data) => {
    let newSelected = [];

    if (event.target.checked) {
      newSelected = data.map(n => n.abbreviation);
      setSelectedStates(newSelected.sort());
      setNumSelectedStates(rowCount);
      return;
    }
    setSelectedStates([]);
    setNumSelected(0);
  };

  function getSorting(order, orderBy) {
    return order === "desc"
      ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
  }

  if (loading) return <Loading />;
  if (error) return `Error ${error.message}`;

  const rowCount = Object.keys(data.State).length;

  return (
    // <div className={classes.root}>
    <FormControl className={classes.formControl}>
      <InputLabel>States</InputLabel>
      <Select
        multiple
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
            onChange={event => handleSelectAllClick(event, Object(data.State))}
          />
          <ListItemText>Select All</ListItemText>
        </MenuItem>
        <Divider />
        {data.State.slice()
          .sort(getSorting(order, orderBy))
          .map(n => {
            // const isSelected = isSelected(n.abbreviation);
            return (
              <MenuItem key={n.abbreviation} value={n.abbreviation}>
                <Checkbox
                  checked={selectedStates.indexOf(n.abbreviation) !== -1}
                  onChange={handleChange(n.abbreviation)}
                  value={n.abbreviation}
                  // selected={isSelected} // is this actually needed? - test removal
                  onClick={event => handleClick(event, n.abbreviation)}
                />
                <ListItemText>{n.abbreviation}</ListItemText>
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>
    // </div>
  );
}

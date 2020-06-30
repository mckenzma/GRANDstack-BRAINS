import React, { useState } from "react";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { makeStyles } from "@material-ui/core/styles";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";

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

export default function BuildYearFilter({ selectedYears, setSelectedYears }) {
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
    setState({ ...state, [year]: event.target.checked });
  };

  const handleClick = (event, year) => {
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

    setSelectedYears(newSelected.sort().reverse());
    setNumSelectedYears(newSelected.length);
  };

  const handleSelectAllClick = (event, data) => {
    let newSelected = [];

    if (event.target.checked) {
      newSelected = data.map(n => n.year);
      console.log(data.map(n => n.year));
      setSelectedYears(newSelected.sort().reverse());
      setNumSelectedYears(rowCount);
      return;
    }
    setSelectedYears([]);
    setNumSelected(0);
  };

  function getSorting(order, orderBy) {
    return order === "desc"
      ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
  }

  if (loading) return <Loading />;
  if (error) return `Error ${error.message}`;

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
              handleSelectAllClick(event, Object(data.queryBuildYear))
            }
          />
          <ListItemText>Select All</ListItemText>
        </MenuItem>
        <Divider />
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
}

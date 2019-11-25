import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles(theme => ({
  root: {
    width: "auto",
    padding: theme.spacing(3)
  },
  margin: {
    height: theme.spacing(3)
  }
}));

export default function DiscreteSlider({ sliderYears, selectedSliderYear }) {
  const classes = useStyles();

  const [value, setValue] = useState(Math.max(...sliderYears));

  const marks = sliderYears.map(year => ({
    value: year,
    label: toString(year)
  }));

  const handleChange = (event, value) => {
    setValue(value);
    selectedSliderYear(value);
  };

  return (
    <div className={classes.root}>
      {/*<div className={classes.margin} />*/}
      <Typography id="discrete-slider-always" gutterBottom>
        Inspection Log Year
      </Typography>
      <div className={classes.margin} />
      <Slider
        defaultValue={Math.max(...sliderYears)}
        // getAriaValueText={valuetext}
        aria-labelledby="discrete-slider-always"
        step={1}
        min={Math.min(...sliderYears)}
        max={Math.max(...sliderYears)}
        marks={sliderYears}
        valueLabelDisplay="on"
        onChange={handleChange}
      />
    </div>
  );
}

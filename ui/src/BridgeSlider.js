// import React from "react";
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

// const marks = [
//   {
//     value: 0,
//     label: "0°C"
//   },
//   {
//     value: 20,
//     label: "20°C"
//   },
//   {
//     value: 37,
//     label: "37°C"
//   },
//   {
//     value: 100,
//     label: "100°C"
//   }
// ];

// function handleChange(event, value) {
//     this.setState({ value: value});
//     console.log(value);
//     // this.value = value;
//   }

export default function DiscreteSlider({ sliderYears, selectedSliderYear }) {
  const classes = useStyles();

  // this.state = {
  //   value: Math.max(...sliderYears)
  // };

  const [value, setValue] = useState(Math.max(...sliderYears));

  // const [value,handleChange] = useState(0);
  // const value = useState(Math.max(...sliderYears));

  // const value = Math.max(...sliderYears);

  // console.log(value);

  const marks = sliderYears.map(year => ({
    value: year,
    label: toString(year)
  }));

  const handleChange = (event, value) => {
    setValue(value);
    selectedSliderYear(value);
    console.log(value);

    // this.value = value;
  };

  // function handleDragStop() {
  //   this.setState({ value: value });
  //   // this.props.update(this.value);
  // }

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
        // step={10}
        step={1}
        min={Math.min(...sliderYears)}
        max={Math.max(...sliderYears)}
        // marks={marks}
        marks={sliderYears}
        valueLabelDisplay="on"
        // trying to update state fron slider
        onChange={handleChange}
        // onChange={() => this.setState({ value: this.state.value })}
        // onDragStop={this.handleDragStop}
        // onChange={(event, value) => this.handleChange(value)}
      />
    </div>
  );
}

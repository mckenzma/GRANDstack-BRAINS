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

export default function DiscreteSlider({
  /*bridge,*/ sliderYears,
  selectedSliderYear
}) {
  const classes = useStyles();
  // console.log(sliderYears);
  const [value, setValue] = useState(Math.max(...sliderYears));

  // TODO - set this by file years
  const fileYears = [
    1992,
    1993,
    1994,
    1995,
    1996,
    1997,
    1998,
    1999,
    2000,
    2001,
    2002,
    2003,
    2004,
    2005,
    2006,
    2007,
    2008,
    2009,
    2010,
    2011,
    2012,
    2013,
    2014,
    2015,
    2016,
    2017,
    2018,
    2019
  ];

  console.log(sliderYears);

  // TODO - restrict values to only those for the bridge with a query
  const marks = sliderYears.map(year => {
    if (fileYears.includes(year)) {
      return {
        value: year
        // key: bridge.stateCode+bridge.countyCode+bridge.placeCode+bridge.code+year
        // label: toString(year)
      };
    }
  });

  console.log(marks);

  const handleChange = (event, value) => {
    setValue(value);
    selectedSliderYear(value);
  };

  // function valuetext(value) {
  //   return `${value}°C`;
  // }

  return (
    <>
      {/* <div className={classes.root}> */}
      {/*<div className={classes.margin} />*/}
      <Typography id="discrete-slider-always" gutterBottom>
        Inspection Log Year
      </Typography>
      <div className={classes.margin} />
      <Slider
        // defaultValue={Math.max(...sliderYears)}
        defaultValue={value}
        // getAriaValueText={valuetext}
        aria-labelledby="discrete-slider-always"
        // step={1}
        step={null}
        // min={Math.min(...sliderYears)}
        min={Math.min(...fileYears)}
        // max={Math.max(...sliderYears)}
        max={Math.max(...fileYears)}
        // marks={sliderYears}
        marks={fileYears}
        valueLabelDisplay={sliderYears.length === 0 ? "" : "on"}
        onChange={handleChange}
        marks={marks}
        disabled={sliderYears.length === 0 ? true : false}
      />
      {/* </div> */}
    </>
  );
}

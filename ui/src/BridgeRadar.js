import React, { Component } from "react";
import Chart from "react-apexcharts";

class BridgeChart extends React.Component {
  constructor(props) {
    super(props);

    const labels = [];
    const data = [];

    [
      "STRUCTURAL_EVAL_067",
      "DECK_GEOMETRY_EVAL_068",
      "UNDCLRENCE_EVAL_069",
      "POSTING_EVAL_070",
      "WATERWAY_EVAL_071",
      "APPR_ROAD_EVAL_072"
    ].forEach(key => {
      if (this.props[key] !== "N") {
        labels.push(key.substr(-3)); //use .substr to extract last 3 of labels. need to update
        data.push(this.props[key]);
      }
    });

    console.log(data);

    this.state = {
      options: {
        labels,
        title: {
          text: "Bridge Component Rating"
        },
        yaxis: {
          min: 0,
          max: 9
        },
        plotOptions: {
          radar: {
            // size: 140,
            polygons: {
              // strokeColor: '#e9e9e9',
              fill: {
                colors: [
                  "#b3ffb3", // 9 Green
                  "#b3ffb3", // 8 Green
                  "#b3ffb3", // 7 Green
                  "#ffd1b3", // 6 Orange
                  "#ffd1b3", // 5 Orange
                  "#ffd1b3", // 5 Orange /*need to remove this once 5 issue fixed
                  "#ffc2b3", // 4 Red
                  "#ffc2b3", // 3 Red
                  "#ff3300", // 2 Redder
                  "#b32400", // 1 Dark Red
                  "#000000" // 0 Black / Dark Gray
                ]
              }
            }
          }
        }
      },
      series: [
        {
          // TODO - FIX "5" showing up twice?
          name: "Inspection Log",
          data
        }
      ]
    };
  }

  render() {
    const labels = [];
    const data = [];

    [
      "STRUCTURAL_EVAL_067",
      "DECK_GEOMETRY_EVAL_068",
      "UNDCLRENCE_EVAL_069",
      "POSTING_EVAL_070",
      "WATERWAY_EVAL_071",
      "APPR_ROAD_EVAL_072"
    ].forEach(key => {
      if (this.props[key] !== "N") {
        labels.push(key.substr(-3)); //use .substr to extract last 3 of labels. need to update
        data.push(this.props[key]);
      }
    });

    console.log(data);

    const state = {
      options: {
        labels,
        title: {
          text: "Bridge Component Rating"
        },
        yaxis: {
          min: 0,
          max: 9
        },
        plotOptions: {
          radar: {
            // size: 140,
            polygons: {
              // strokeColor: '#e9e9e9',
              fill: {
                colors: [
                  "#b3ffb3", // 9 Green
                  "#b3ffb3", // 8 Green
                  "#b3ffb3", // 7 Green
                  "#ffd1b3", // 6 Orange
                  "#ffd1b3", // 5 Orange
                  "#ffd1b3", // 5 Orange /*need to remove this once 5 issue fixed
                  "#ffc2b3", // 4 Red
                  "#ffc2b3", // 3 Red
                  "#ff3300", // 2 Redder
                  "#b32400", // 1 Dark Red
                  "#000000" // 0 Black / Dark Gray
                ]
              }
            }
          }
        }
      },
      series: [
        {
          // TODO - FIX "5" showing up twice?
          name: "Inspection Log",
          data
        }
      ]
    };

    return (
      <div id="chart">
        <Chart
          options={state.options}
          series={state.series}
          type="radar"
          height="350"
        />
        {/* TODO Ad text box to state which thing is excluded (NOT APPLICABLE) for this bridge */}
      </div>
    );
  }
}

export default BridgeChart;

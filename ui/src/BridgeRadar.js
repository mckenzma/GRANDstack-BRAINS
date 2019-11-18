import React, { Component } from "react";
import Chart from "react-apexcharts";

class BridgeChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        labels: [
          // "STRUCTURAL_EVAL_067",
          "067",
          // "DECK_GEOMETRY_EVAL_068",
          "068",
          // "UNDCLRENCE_EVAL_069",
          "069",
          // "POSTING_EVAL_070",
          "070",
          // "WATERWAY_EVAL_071",
          "071",
          // "APPR_ROAD_EVAL_072"
          "072"
        ],
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
          data: [
            // TODO: Clean this logic up. 0 is not an accurate way to handle this...
            parseInt(
              this.props.STRUCTURAL_EVAL_067 == "N"
                ? "0"
                : this.props.STRUCTURAL_EVAL_067
            ),
            parseInt(
              this.props.DECK_GEOMETRY_EVAL_068 == "N"
                ? "0"
                : this.props.DECK_GEOMETRY_EVAL_068
            ),
            parseInt(
              this.props.UNDCLRENCE_EVAL_069 == "N"
                ? "0"
                : this.props.UNDCLRENCE_EVAL_069
            ),
            parseInt(
              this.props.POSTING_EVAL_070 == "N"
                ? "0"
                : this.props.POSTING_EVAL_070
            ),
            parseInt(
              this.props.WATERWAY_EVAL_071 == "N"
                ? "0"
                : this.props.WATERWAY_EVAL_071
            ),
            parseInt(
              this.props.APPR_ROAD_EVAL_072 == "N"
                ? "0"
                : this.props.APPR_ROAD_EVAL_072
            )
          ]
        }
      ]
    };
  }

  render() {
    return (
      <div id="chart">
        <Chart
          options={this.state.options}
          series={this.state.series}
          type="radar"
          height="350"
        />
      </div>
    );
  }
}

export default BridgeChart;

// const domContainer = document.querySelector('#app');
// ReactDOM.render(React.createElement(BridgeChart), domContainer);

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
          max: 10
        }
      },
      series: [
        {
          name: "Series 1",
          data: [
            parseInt(this.props.STRUCTURAL_EVAL_067),
            parseInt(this.props.DECK_GEOMETRY_EVAL_068),
            parseInt(this.props.UNDCLRENCE_EVAL_069),
            parseInt(this.props.POSTING_EVAL_070),
            parseInt(this.props.WATERWAY_EVAL_071),
            parseInt(this.props.APPR_ROAD_EVAL_072)
          ]
        }
      ]
    };
  }

  render() {
    console.log(parseInt(this.props.STRUCTURAL_EVAL_067));
    console.log(parseInt(this.props.DECK_GEOMETRY_EVAL_068));
    console.log(parseInt(this.props.UNDCLRENCE_EVAL_069));
    console.log(parseInt(this.props.POSTING_EVAL_070));
    console.log(parseInt(this.props.WATERWAY_EVAL_071));
    console.log(parseInt(this.props.APPR_ROAD_EVAL_072));
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

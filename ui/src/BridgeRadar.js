import React, { Component } from "react";
import Chart from "react-apexcharts";

class BridgeChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        labels: ["January", "February", "March", "April", "May", "June"],
        title: {
          text: "Basic Radar Chart"
        }
      },
      series: [
        {
          name: "Series 1",
          data: [80, 50, 30, 40, 100, 20]
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

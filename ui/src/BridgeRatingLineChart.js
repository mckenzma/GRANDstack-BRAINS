import React from "react";
import Chart from "react-apexcharts";

export default function BridgeRatingLineChart({ inspectionLogs }) {
  const categories = [];

  const data_067 = [];
  const data_068 = [];
  const data_069 = [];
  const data_070 = [];
  const data_071 = [];
  const data_072 = [];

  inspectionLogs.forEach(log => {
    categories.push(log.year);
    // data.push(log.STRUCTURAL_EVAL_067);

    data_067.push(log.STRUCTURAL_EVAL_067);
    data_068.push(log.DECK_GEOMETRY_EVAL_068);
    data_069.push(log.UNDCLRENCE_EVAL_069);
    data_070.push(log.POSTING_EVAL_070);
    data_071.push(log.WATERWAY_EVAL_071);
    data_072.push(log.APPR_ROAD_EVAL_072);
  });

  const series = [
    {
      name: "STRUCTURAL_EVAL_067",
      data: data_067.reverse()
    },
    {
      name: "DECK_GEOMETRY_EVAL_068",
      data: data_068.reverse()
    },
    {
      name: "UNDCLRENCE_EVAL_069",
      data: data_069.reverse()
    },
    {
      name: "POSTING_EVAL_070",
      data: data_070.reverse()
    },
    {
      name: "WATERWAY_EVAL_071",
      data: data_071.reverse()
    },
    {
      name: "APPR_ROAD_EVAL_072",
      data: data_072.reverse()
    }
  ];

  const state = {
    series: series,
    options: {
      chart: {
        type: "line",
        height: 350,
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },

      title: {
        text: "Condition Eval Rating By Year",
        align: "left"
      },
      // subtitle: {
      //   text: 'Condition Rating By Component By Year',
      //   align: 'left'
      // },
      xaxis: {
        // categories: [1991,1992,1993,1994,1995,1996,1997,1998,1999]
        categories: categories.reverse()
      },
      yaxis: {
        min: 0,
        max: 9
        // tickamount: 10
      },
      legend: {
        horizontalAlign: "left"
      }
    }
  };

  return (
    <div id="chart">
      <Chart options={state.options} series={state.series} />
    </div>
  );
}

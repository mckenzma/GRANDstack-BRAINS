import React /*, { useState }*/ from "react";
import Chart from "react-apexcharts";

// import { Query } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Loading from "./../Loading";

const GET_ROWS_PER_YEAR_PER_STATE = gql`
  {
    stackedBarChart_Rows_Per_Year_Per_State__1 {
      state
      data {
        year
        count
      }
    }
  }
`;

export default function StackedBarChart2() {
  // class StackedBarChart2 extends React.Component {
  // constructor(props) {
  // super(props);

  const state = {
    options: {
      chart: {
        height: 350,
        type: "bar",
        stacked: true
      },
      //setting colors for series
      colors: [
        "#2E93fA",
        "#66DA26",
        "#546E7A",
        "#E91E63",
        "#FF9800",
        "#bbb",
        "#aaa",
        "#123456"
      ],
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      stroke: {
        width: 1,
        colors: ["#fff"]
      },
      title: {
        text: "Rows per File Year per State"
      },
      xaxis: {
        labels: {
          formatter: function(val) {
            return val /*+ "K"*/;
          }
        }
      },
      yaxis: {
        title: {
          text: undefined
        }
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return val /*+ "K"*/;
          }
        }
      },
      fill: {
        opacity: 1
      },

      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40
      }
    }
  };
  // }

  const { loading, error, data } = useQuery(GET_ROWS_PER_YEAR_PER_STATE);

  //render() {
  //  return (
  //    <Query
  //      query={gql`
  //        {
  //          stackedBarChart_Rows_Per_Year_Per_State__1 {
  //            state
  //            data {
  //              year
  //              count
  //            }
  //          }
  //        }
  //      `}
  //    >
  //      {({ loading, error, data }) => {
  if (loading) return <Loading />;
  if (error) return <p>Error</p>;

  const options = {
    //...this.state.options,
    xaxis: {
      categories: data.stackedBarChart_Rows_Per_Year_Per_State__1
        .slice(0, 1)
        .map(n => {
          return n.data.slice().map(s => {
            return s.year;
          });
        })[0]
    }
  };

  const series = data.stackedBarChart_Rows_Per_Year_Per_State__1
    .slice()
    .map(n => {
      return {
        name: n.state,
        data: n.data.slice().map(d => {
          return d.count;
        })
      };
    });

  return (
    <div className="bar">
      <Chart options={options} series={series} type="bar" />
    </div>
  );
  //      }}
  //    </Query>
  //  );
  //}
}

// export default StackedBarChart2;

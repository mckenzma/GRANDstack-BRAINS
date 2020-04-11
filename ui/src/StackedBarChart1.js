import React from "react";
import Chart from "react-apexcharts";

import { Query } from "react-apollo";
import gql from "graphql-tag";

import Loading from "./Loading";

class StackedBarChart1 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          height: "auto",
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
          text: "Rows per State per File Year"
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
  }

  render() {
    return (
      <Query
        query={gql`
          {
            stackedBarChart_Rows_Per_State_Per_Year__1 {
              year
              data {
                state
                count
              }
            }
          }
        `}
      >
        {({ loading, error, data }) => {
          if (loading) return <Loading />;
          if (error) return <p>Error</p>;

          const options = {
            ...this.state.options,
            xaxis: {
              categories: data.stackedBarChart_Rows_Per_State_Per_Year__1
                .slice(0, 1)
                .map(n => {
                  return n.data.slice().map(s => {
                    return s.state;
                  });
                })[0]
            }
          };

          const series = data.stackedBarChart_Rows_Per_State_Per_Year__1
            .slice()
            .map(n => {
              return {
                name: n.year,
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
        }}
      </Query>
    );
  }
}

export default StackedBarChart1;

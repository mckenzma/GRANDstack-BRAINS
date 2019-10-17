import React, { Component } from "react";
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
          // height: 350,
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
        // series: [
        //   {
        //     name: "Rating 0",
        //     data: [44, 55, 41, 37, 22, 43, 21]
        //   },
        //   {
        //     name: "Rating 1",
        //     data: [53, 32, 33, 52, 13, 43, 32]
        //   },
        //   {
        //     name: "Rating 2",
        //     data: [12, 17, 11, 9, 15, 11, 20]
        //   },
        //   {
        //     name: "Rating 3",
        //     data: [9, 7, 5, 8, 6, 9, 4]
        //   },
        //   {
        //     name: "Rating 4",
        //     data: [25, 12, 19, 32, 25, 24, 10]
        //   }
        // ],
        title: {
          text: "Rows per State per File Year"
        },
        xaxis: {
          // categories: ["2018", "2017", "2016", "2015", "2014", "2013", "2012"],
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
          // if (loading) return <p>Loading...</p>;
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

          ///////
          // 1993 PR is missing from query! WHY?
          // PR93.txt connect to Oregon for some weird reason...
          ///////
          // console.log(data);

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

          // console.log(series);

          return (
            <div className="bar">
              <Chart
                // options={this.state.options}
                options={options}
                // series={this.state.options.series}
                series={series}
                type="bar"
                // width="380"
              />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default StackedBarChart1;

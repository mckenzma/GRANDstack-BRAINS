import React, { Component } from "react";
import Chart from "react-apexcharts";

import { Query } from "react-apollo";
import gql from "graphql-tag";

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

class HeatMapState extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: "asc", // sets order of states to be named in list
      orderBy: "name",

      // this sets the state for the Apex Chart
      options: {
        chart: {
          // id: "basic-bar",
          // type: "bar"
        },
        plotOptions: {
          heatmap: {
            colorScale: {
              ranges: [
                {
                  from: -30,
                  to: 5,
                  color: "#00A100",
                  name: "low"
                },
                {
                  from: 6,
                  to: 20,
                  color: "#128FD9",
                  name: "medium"
                },
                {
                  from: 21,
                  to: 45,
                  color: "#FFB200",
                  name: "high"
                }
              ]
            }
          }
        }
      }
    };
  }

  render() {
    const { order, orderBy } = this.state;

    return (
      <Query
        query={gql`
          query statesPaginateQuery($selected: [String!]) {
            State(filter: { name_in: $selected }) {
              name
              numBridges
            }
          }
        `}
        variables={{
          selected: this.props.selected
        }}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error</p>;

          // window.data = data;

          // const options = {
          //   ...this.state.options,
          //   xaxis: {
          //     categories: data.State.slice()
          //       .sort(getSorting(order, orderBy))
          //       .map(n => {
          //         return n.name;
          //       })
          //   }
          // };

          console.log(data);

          // const series = [
          //   {
          //     name: "Number of Bridges",
          //     data: data.State.slice()
          //       .sort(getSorting(order, orderBy))
          //       .map(n => {
          //         return {
          //           x: n.name,
          //           y: n.numBridges
          //         };
          //       })
          //   },
          //   {
          //     name: "Number of Bridges",
          //     data: data.State.slice()
          //       .sort(getSorting(order, orderBy))
          //       .map(n => {
          //         return {
          //           x: n.name,
          //           y: n.numBridges
          //         };
          //       })
          //   }
          // ];

          const series = data.State.slice()
            .sort(getSorting(order, orderBy))
            .map(n => {
              return {
                name: n.name,
                data: [{ x: n.name, y: n.numBridges }]
              };
            });

          console.log(series);

          // const series2 = [
          //   {
          //     name: "Series 1",
          //     data: [
          //       {
          //         x: "W1",
          //         y: 22
          //       },
          //       {
          //         x: "W2",
          //         y: 29
          //       },
          //       {
          //         x: "W3",
          //         y: 13
          //       },
          //       {
          //         x: "W4",
          //         y: 32
          //       }
          //     ]
          //   },
          //   {
          //     name: "Series 2",
          //     data: [
          //       {
          //         x: "W1",
          //         y: 43
          //       },
          //       {
          //         x: "W2",
          //         y: 43
          //       },
          //       {
          //         x: "W3",
          //         y: 43
          //       },
          //       {
          //         x: "W4",
          //         y: 43
          //       }
          //     ]
          //   }
          // ];

          // console.log(series2);
          // console.log(this.state.options.series);

          return (
            <div className="mixed-chart">
              <Chart
                options={this.state.options}
                // options={options}
                // series={this.state.options.series}
                series={series}
                type="heatmap"
                // width="380"
              />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default HeatMapState;

import React, { Component } from "react";
import Chart from "react-apexcharts";

import { Query } from "react-apollo";
import gql from "graphql-tag";

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

class DonutChartState extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: "asc", // sets order of states to be named in list
      orderBy: "name",

      // this sets the state for the Apex Chart
      options: {
        legend: {
          show: true,
          position: "bottom"
        }
        //series: [44, 55, 41, 17, 15],
        //labels: ["A", "B", "C", "D", "E"]
      }
    };
  }

  render() {
    const { order, orderBy } = this.state;

    return (
      <Query
        query={gql`
          #query statesParginateQuery(
          #  $selected: [String!]
          #)
          {
            #State(
            #  filter: {
            #    name_in: $selected
            #  }
            #) {
            State {
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

          window.data = data;

          const options = {
            ...this.state.options,
            labels: data.State.slice()
              .sort(getSorting(order, orderBy))
              .map(n => {
                return n.name;
              })
          };

          return (
            <div className="donut">
              <Chart
                // options={this.state.options}
                options={options}
                // series={this.state.options.series}
                series={data.State.slice()
                  .sort(getSorting(order, orderBy))
                  .map(n => {
                    return n.numBridges;
                  })}
                type="donut"
                // width="380"
              />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default DonutChartState;

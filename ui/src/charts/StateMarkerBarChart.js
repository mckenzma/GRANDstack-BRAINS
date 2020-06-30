import React /*, { Component }*/ from "react";
import Chart from "react-apexcharts";

import { Query } from "react-apollo";
import gql from "graphql-tag";

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

class StateMarkerBarChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedState: this.props.selectedState,
      // order: "asc", // sets order of states to be named in list
      // orderBy: "abbreviation",

      options: {
        chart: {
          type: "bar"
        },
        title: {
          text: "Bridge Count by Year Built"
        },
        plotOptions: {
          bar: {
            columnWidth: "100%",
            dataLabels: {
              hideOverflowingLabels: false
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
          query statesPaginateQuery($selectedState: String!) {
            State(filter: { name: $selectedState }) {
              chartBarBridgeByBuildYear {
                year
                count
              }
            }
          }
        `}
        variables={{
          selectedState: this.props.selectedState
        }}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error</p>;

          window.data = data;
          console.log(data);
          console.log(this.state.selectedState);
          console.log(this.props.selectedState);

          const options = {
            ...this.state.options,
            xaxis: {
              categories: data.State.slice()
                // .sort(getSorting(order, orderBy))
                .map(n => {
                  return n.abbreviation;
                })
            }
          };

          const series = [
            {
              abbreviation: "Number of Bridges",
              data: data.State.slice()
                // .sort(getSorting(order, orderBy))
                .map(n => {
                  return n.numBridges;
                })
            }
          ];

          return (
            <div className="mixed-chart">
              <Chart options={options} series={series} type="bar" />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default StateMarkerBarChart;

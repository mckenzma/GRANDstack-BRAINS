import React /*, { Component }*/ from "react";
import Chart from "react-apexcharts";

import { Query } from "react-apollo";
import gql from "graphql-tag";

import Loading from "./Loading";

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
    : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

class BarChartState extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: "asc", // sets order of states to be named in list
      orderBy: "abbreviation",

      // this sets the state for the Apex Chart
      options: {
        chart: {
          // id: "basic-bar",
          type: "bar"
        },
        title: {
          text: "Total Bridge Count by State"
        },
        plotOptions: {
          bar: {
            // barHeight: '100%',
            // distributed: true,
            // horizontal: true,
            columnWidth: "90%",
            dataLabels: {
              hideOverflowingLabels: false
            }
          }
        }
        // legend: {
        //   show:true,
        //   position: 'bottom'
        // },
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
          query statesPaginateQuery($selected: [String!]) {
            State(filter: { abbreviation_in: $selected }) {
              abbreviation
              numBridges
            }
          }
        `}
        variables={{
          selected: this.props.selected
        }}
      >
        {({ loading, error, data }) => {
          // if (loading) return <p>Loading...</p>;
          if (loading) return <Loading />;
          if (error) return <p>Error</p>;

          // window.data = data;

          const options = {
            ...this.state.options,
            xaxis: {
              categories: data.State.slice()
                .sort(getSorting(order, orderBy))
                .map(n => {
                  return n.abbreviation;
                })
            }
          };

          const series = [
            {
              abbreviation: "Number of Bridges",
              data: data.State.slice()
                .sort(getSorting(order, orderBy))
                .map(n => {
                  return n.numBridges.toLocaleString();
                })
            }
          ];

          return (
            <div className="mixed-chart">
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

export default BarChartState;

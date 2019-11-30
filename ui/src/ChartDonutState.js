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

class DonutChartState extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: "asc", // sets order of states to be named in list
      orderBy: "abbreviation",

      // this sets the state for the Apex Chart
      options: {
        legend: {
          show: true,
          position: "bottom"
        },
        title: {
          text: "Total Bridge Count by State"
        }
      }
    };
  }

  render() {
    const { order, orderBy } = this.state;

    return (
      <Query
        query={gql`
          query statesParginateQuery($selected: [String!]) {
            State(filter: { abbreviation_in: $selected }) {
              #State {
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
          if (loading) return <Loading />;
          if (error) return <p>Error</p>;

          const options = {
            ...this.state.options,
            labels: data.State.slice()
              .sort(getSorting(order, orderBy))
              .map(n => {
                return n.abbreviation;
              })
          };

          return (
            <div className="donut">
              <Chart
                options={options}
                series={data.State.slice()
                  .sort(getSorting(order, orderBy))
                  .map(n => {
                    return n.numBridges.toLocaleString();
                  })}
                type="donut"
              />
            </div>
          );
        }}
      </Query>
    );
  }
}

export default DonutChartState;

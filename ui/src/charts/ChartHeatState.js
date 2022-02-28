import React from "react";
import Chart from "react-apexcharts";

import { Query } from "react-apollo";
import gql from "graphql-tag";

import Loading from "./../Loading";

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
      orderBy: "abbreviation",

      // this sets the state for the Apex Chart
      options: {
        chart: {
          // id: "basic-bar",
          // type: "bar"
          // height: 200,
          type: "heatmap"
        },
        title: {
          text: "Bridge Count by State-Owner"
        },
        plotOptions: {
          heatmap: {
            enableShades: false,
            // shadeIntensity: 1.0,

            colorScale: {
              ranges: [
                {
                  from: 0,
                  to: 0,
                  color: "#ffffff",
                  name: "none"
                },
                {
                  from: 1,
                  to: 10,
                  color: "#00A100"
                  // name: "low (1 to 10)"
                },
                {
                  from: 11,
                  to: 100,
                  color: "#128FD9"
                  // name: "medium (11 to 100)"
                },
                {
                  from: 101,
                  to: 100000,
                  color: "#FFB200"
                  // name: "high (101+)"
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
          query statesPaginateQuery(
            $selected: [String!]
            $ownerSelected: [String!]
          ) {
            State(filter: { abbreviation_in: $selected }) {
              abbreviation
              chartHeatMapStateOwners(owners: $ownerSelected) {
                ownerDescription
                bridgeCount
              }
            }
          }
        `}
        // query={gql`
        //   query heatmapDataPaginateQuery(
        //     $selected: [String!]
        //     $ownerSelected: [String!]
        //   ) {
        //     heatmapData(states: $selected, owners: $ownerSelected) {
        //       stateName
        //       ownerDescription
        //       bridgeCount
        //     }
        //   }
        // `}
        // query={gql`
        //   query statesPaginateQuery(
        //     $selected: [String!]
        //     #$ownerSelected: [String!]
        //   ) {
        //     State(
        //       filter: {
        //         name_in: $selected
        //         #county: { place: { bridge: {owner: { description_in: $ownerSelected } } } }
        //       }
        //     ) {
        //       name
        //       numBridges
        //       #chartHeatMapStateOwnerCount(owners: $ownerSelected)
        //       chartHeatMapStateOwnerCount
        //     }
        //   }
        // `}
        variables={{
          selected: this.props.selected,
          ownerSelected: this.props.ownerSelected
        }}
      >
        {({ loading, error, data }) => {
          // if (loading) return <p>Loading...</p>;
          if (loading) return <Loading />;
          if (error) return <p>Error</p>;

          const series = data.State.slice()
            .sort(getSorting(order, orderBy))
            .map(n => {
              return {
                abbreviation: n.abbreviation,
                //need additional map here
                // data: [{ x: n.ownerDescription, y: n.bridgeCount }]
                data: n.chartHeatMapStateOwners.map(s => {
                  return {
                    x: s.ownerDescription,
                    y: s.bridgeCount.toLocaleString()
                  };
                })
              };
            });

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

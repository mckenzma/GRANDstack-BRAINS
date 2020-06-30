import React, { useState } from "react";
import Chart from "react-apexcharts";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Loading from "./../Loading";

const GET_STATES_QUERY = gql`
  query statesPaginateQuery($_selectedStates: [String!]) {
    State(filter: { abbreviation_in: $_selectedStates }) {
      abbreviation
      numBridges
    }
  }
`;

export default function BarChartState({ _selectedStates }) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("abbreviation");

  function getSorting(order, orderBy) {
    return order === "desc"
      ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
  }

  const { loading, error, data } = useQuery(GET_STATES_QUERY, {
    variables: {
      _selectedStates
    }
  });

  if (loading) return <Loading />;
  if (error) return <p>Error</p>;

  let categories = [];
  data.State.sort(getSorting(order, orderBy)).map(n => {
    categories.push(n.abbreviation);
  });

  const series = [
    {
      name: "Number of Bridges",
      data: data.State.sort(getSorting(order, orderBy)) //.slice()
        .map(n => {
          return n.numBridges;
        })
    }
  ];

  return (
    <div className="mixed-chart">
      <Chart
        // options={options}
        options={{
          chart: {
            // id: "basic-bar",
            // type: "bar"
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
                position: "top",
                hideOverflowingLabels: false
              }
            }
          },
          dataLabels: {
            enabled: true,
            formatter: function(val) {
              return val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
            },
            offsetY: -20,
            style: {
              fontSize: "12px",
              colors: ["#304758"]
            }
          },
          xaxis: {
            // categories: categories[0]
            categories: categories
          },
          tooltip: {
            y: {
              formatter: function(val) {
                return val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
              }
            }
          }
          // legend: {
          //   show:true,
          //   position: 'bottom'
          // },
        }}
        series={series}
        type="bar"
        // width="380"
      />
    </div>
  );
}

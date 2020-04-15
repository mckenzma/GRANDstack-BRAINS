import React, { useState } from "react";
import Chart from "react-apexcharts";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Loading from "./Loading";

const GET_STATES_QUERY = gql`
  query statesPaginateQuery($_selectedStates: [String!]) {
    State(filter: { abbreviation_in: $_selectedStates }) {
      abbreviation
      numBridges
    }
  }
`;

export default function BarChartState({ _selectedStates }) {
  console.log(_selectedStates);
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

  const categories = [
    data.State.slice()
      .sort(getSorting(order, orderBy))
      .map(n => {
        return n.abbreviation;
      })
  ];

  console.log(categories);

  const series = [
    {
      abbreviation: "Number of Bridges",
      data: data.State.slice()
        .sort(getSorting(order, orderBy))
        .map(n => {
          return n.numBridges;
        })
    }
  ];

  console.log(series);

  return (
    <div className="mixed-chart">
      <Chart
        // options={options}
        options={{
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
          },
          xaxis: {
            categories: categories
          }
          // legend: {
          //   show:true,
          //   position: 'bottom'
          // },
          //series: [44, 55, 41, 17, 15],
          //labels: ["A", "B", "C", "D", "E"]
        }}
        series={series}
        type="bar"
        // width="380"
      />
    </div>
  );
}

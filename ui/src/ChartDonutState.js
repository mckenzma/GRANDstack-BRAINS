import React, { useState /*, { Component }*/ } from "react";
import Chart from "react-apexcharts";

import { Query } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Loading from "./Loading";

// function getSorting(order, orderBy) {
//   return order === "desc"
//     ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
//     : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
// }

const GET_STATE_QUERY = gql`
  query statesParginateQuery($_selectedStates: [String!]) {
    State(filter: { abbreviation_in: $_selectedStates }) {
      #State {
      abbreviation
      numBridges
    }
  }
`;

export default function DonutChartState({ _selectedStates }) {
  // class DonutChartState extends React.Component {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     // order: "asc", // sets order of states to be named in list
  //     // orderBy: "abbreviation",

  //     // this sets the state for the Apex Chart
  //     options: {
  //       legend: {
  //         show: true,
  //         position: "bottom"
  //       },
  //       title: {
  //         text: "Total Bridge Count by State"
  //       }
  //     }
  //   };
  // }

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("abbreviation");
  const labels = [];
  const series = [];
  // const [options, setOptions] = useState({
  //   options: {
  //       legend: {
  //         show: true,
  //         position: "bottom"
  //       },
  //       title: {
  //         text: "Total Bridge Count by State"
  //       },
  //       label: labels
  //     }
  // });

  function getSorting(order, orderBy) {
    return order === "desc"
      ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
  }

  const { loading, error, data } = useQuery(GET_STATE_QUERY);

  // render() {
  // const { order, orderBy } = this.state;

  // return (
  //   <Query
  //     query={gql`
  //       query statesParginateQuery($selected: [String!]) {
  //         State(filter: { abbreviation_in: $selected }) {
  //           #State {
  //           abbreviation
  //           numBridges
  //         }
  //       }
  //     `}
  //     variables={{
  //       // selected: this.props.selected
  //       selectedStates: _selectedStates
  //     }}
  //   >
  //     {({ loading, error, data }) => {
  //       if (loading) return <Loading />;
  //       if (error) return <p>Error</p>;

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  // const labels = data.State.slice().sort(getSorting(order, orderBy)).map(n => {
  //   return n.abbreviation
  // });

  data.State.slice()
    .sort(getSorting(order, orderBy))
    .map(n => {
      labels.push(n.abbreviation);
    });

  console.log(labels);

  // console.log(options.labels);

  // const series = data.State.slice()
  //         .sort(getSorting(order, orderBy))
  //         .map(n => {
  //           return n.numBridges.toLocaleString()
  //         });

  data.State.slice()
    .sort(getSorting(order, orderBy))
    .map(n => {
      // series.push(n.numBridges.toLocaleString());
      series.push(n.numBridges);
    });

  console.log(series);

  // setOptions({
  //   // const options = {
  //     // ...this.state.options,
  //     ...options,
  //     labels: labels
  //     // labels: data.State.slice()
  //     //   .sort(getSorting(order, orderBy))
  //     //   .map(n => {
  //     //     return n.abbreviation;
  //     //   })
  //   // };
  // });

  return (
    <div className="donut">
      <Chart
        // options={options}
        options={{
          // options: {
          legend: {
            show: true,
            position: "bottom"
          },
          title: {
            text: "Total Bridge Count by State"
          },
          labels: labels
        }} //}
        series={series}
        // series={data.State.slice()
        //   .sort(getSorting(order, orderBy))
        //   .map(n => {
        //     return n.numBridges.toLocaleString();
        //   })}
        type="donut"
      />
    </div>
  );
  // }}
  // </Query>
  // );
  // }
}

// export default DonutChartState;

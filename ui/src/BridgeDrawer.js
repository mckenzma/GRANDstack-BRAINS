import React, { useState } from "react";
import { Query } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
// import Drawer from "@material-ui/core/Drawer";
// import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";

import ListItemText from "@material-ui/core/ListItemText";

import BridgeRadar from "./BridgeRadar";

import SimpleSlider from "./BridgeSlider";

const useStyles = makeStyles(theme => ({
  // const styles = {
  list: {
    width: 400
  }
  // };
}));

const GET_BRIDGE = gql`
  query bridgePaginateQuery(
    $selectedBridge: String!
    $selectedPlace: String!
    $selectedCounty: String!
    $selectedState: String!
  ) {
    Bridge(
      filter: {
        code: $selectedBridge
        #place_code: $selectedPlace
        placeCode: $selectedPlace
        #county_code: $selectedCounty
        countyCode: $selectedCounty
        #state_code: $selectedState
        stateCode: $selectedState
        #place : {county: { state: { code: $selectedState } } }
      }
    ) {
      #id
      ########
      # is it faster to query on these here with Node Key?
      #state_code
      stateCode
      #county_code
      countyCode
      #place_code
      placeCode
      ########
      code
      latitude_decimal
      longitude_decimal
      buildYear
      #buildYear {
      #  year
      #}
      ########
      # or is it faster to query here with tree?
      place {
        #  code
        county {
          #    code
          state {
            name
          }
        }
      }
      ########
      #maintenanceResp {
      #  description
      #}
      #owner {
      #  description
      #}
      latestInspectionLog {
        year
        STRUCTURAL_EVAL_067
        DECK_GEOMETRY_EVAL_068
        UNDCLRENCE_EVAL_069
        POSTING_EVAL_070
        WATERWAY_EVAL_071
        APPR_ROAD_EVAL_072
      }
      inspectionLogs {
        year
        STRUCTURAL_EVAL_067
        DECK_GEOMETRY_EVAL_068
        UNDCLRENCE_EVAL_069
        POSTING_EVAL_070
        WATERWAY_EVAL_071
        APPR_ROAD_EVAL_072
      }
    }
  }
`;

const BridgeDetail = ({ Bridge }) => {
  const temp = Bridge.inspectionLogs.map(log => log.year);
  const [currentYear, setCurrentYear] = useState(Math.max(...temp));
  const [sliderYears, setSliderYears] = useState(temp);
  const [inspectionLog, setInspectionLog] = useState(
    Bridge.latestInspectionLog
  );
  const id = `${Bridge.stateCode}${Bridge.countyCode}${Bridge.placeCode}${
    Bridge.code
  }`;

  const updateYear = year => {
    setCurrentYear(year);
    setInspectionLog(
      Bridge.inspectionLogs.filter(
        inspectionLog => inspectionLog.year === year
      )[0]
    );
  };

  return (
    <List>
      <ListItem>
        <ListItemText>
          State: {Bridge.place.county.state.name}
          {/*State: {Bridge.stateCode}*/}
        </ListItemText>
      </ListItem>
      <ListItem>
        {/*<ListItemText>County: {Bridge.place.county.name}</ListItemText>*/}
        <ListItemText>County: {Bridge.countyCode}</ListItemText>
      </ListItem>
      <ListItem>
        {/*<ListItemText>Place: {Bridge.place.code}</ListItemText>*/}
        <ListItemText>Place: {Bridge.placeCode}</ListItemText>
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText>Name: {Bridge.code}</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>LAT: {Bridge.latitude_decimal}</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>LONG: {Bridge.longitude_decimal}</ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>
          {/*Build Year: {Bridge.buildYear.year}*/}
          Build Year: {Bridge.buildYear}
        </ListItemText>
      </ListItem>
      <Divider />
      {/*<Divider />
      <ListItem>
        <ListItemText>
          Owned By: {b.owner.description}
        </ListItemText>
      </ListItem>
      <ListItem>
        <ListItemText>
          Maintaned By: {b.maintenanceResp.description}
        </ListItemText>
      </ListItem>*/}

      <SimpleSlider sliderYears={sliderYears} selectedSliderYear={updateYear} />
      <BridgeRadar
        STRUCTURAL_EVAL_067={inspectionLog.STRUCTURAL_EVAL_067}
        DECK_GEOMETRY_EVAL_068={inspectionLog.DECK_GEOMETRY_EVAL_068}
        UNDCLRENCE_EVAL_069={inspectionLog.UNDCLRENCE_EVAL_069}
        POSTING_EVAL_070={inspectionLog.POSTING_EVAL_070}
        WATERWAY_EVAL_071={inspectionLog.WATERWAY_EVAL_071}
        APPR_ROAD_EVAL_072={inspectionLog.APPR_ROAD_EVAL_072}
      />
    </List>
  );
};

export default function BridgeDrawer({
  right,
  setRight,
  selectedBridge,
  selectedPlace,
  selectedCounty,
  selectedState,
  open
}) {
  const classes = useStyles();

  // setRight(true);

  const { loading, error, data } = useQuery(GET_BRIDGE, {
    variables: {
      selectedBridge,
      selectedPlace,
      selectedCounty,
      selectedState
    }
  });

  console.log(selectedBridge);
  console.log(selectedPlace);
  console.log(selectedCounty);
  console.log(selectedState);
  console.log(right);
  console.log(open);
  console.log(data);
  // class BridgeDrawer extends React.Component {
  // constructor(props) {
  // super(props);

  // this.state = {
  // right: false,
  // setRight(false);
  // sliderYears: [],
  const [sliderYears, setSliderYears] = useState([]);
  // currentYear: null // default to non null value
  const [currentYear, setCurrentYear] = useState(null);
  // };
  // }

  // render() {
  // const { classes } = this.props;

  // TODO: fix query error when clicking back on map from open drawer. Getting GrpahQL query error

  // Is it better to qurey bridge on code, state_code, couny_code, place_code on Bridge node
  // or to query based on the state, county, place, bridge tree?
  // return (
  //   <Query
  //     query={gql`
  //       query bridgePaginateQuery(
  //         $selectedBridge: String!
  //         $selectedPlace: String!
  //         $selectedCounty: String!
  //         $selectedState: String!
  //       ) {
  //         Bridge(
  //           filter: {
  //             code: $selectedBridge
  //             #place_code: $selectedPlace
  //             placeCode: $selectedPlace
  //             #county_code: $selectedCounty
  //             countyCode: $selectedCounty
  //             #state_code: $selectedState
  //             stateCode: $selectedState
  //             #place : {county: { state: { code: $selectedState } } }
  //           }
  //         ) {
  //           #id
  //           ########
  //           # is it faster to query on these here with Node Key?
  //           #state_code
  //           stateCode
  //           #county_code
  //           countyCode
  //           #place_code
  //           placeCode
  //           ########
  //           code
  //           latitude_decimal
  //           longitude_decimal
  //           buildYear
  //           #buildYear {
  //           #  year
  //           #}
  //           ########
  //           # or is it faster to query here with tree?
  //           place {
  //             #  code
  //             county {
  //               #    code
  //               state {
  //                 name
  //               }
  //             }
  //           }
  //           ########
  //           #maintenanceResp {
  //           #  description
  //           #}
  //           #owner {
  //           #  description
  //           #}
  //           latestInspectionLog {
  //             year
  //             STRUCTURAL_EVAL_067
  //             DECK_GEOMETRY_EVAL_068
  //             UNDCLRENCE_EVAL_069
  //             POSTING_EVAL_070
  //             WATERWAY_EVAL_071
  //             APPR_ROAD_EVAL_072
  //           }
  //           inspectionLogs {
  //             year
  //             STRUCTURAL_EVAL_067
  //             DECK_GEOMETRY_EVAL_068
  //             UNDCLRENCE_EVAL_069
  //             POSTING_EVAL_070
  //             WATERWAY_EVAL_071
  //             APPR_ROAD_EVAL_072
  //           }
  //         }
  //       }
  //     `}
  //     variables={{
  //       selectedBridge: this.props.selectedBridge,
  //       selectedPlace: this.props.selectedPlace,
  //       selectedCounty: this.props.selectedCounty,
  //       selectedState: this.props.selectedState
  //     }}
  //   >
  //     {({ loading, error, data }) => {
  //       if (loading) return <p>Loading...</p>;
  //       if (error) return <p>Error</p>;

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  return (
    <div className={classes.list}>
      {data.Bridge.map(b => {
        // const id = `${b.state_code}${b.county_code}${b.place_code}${b.code}`;
        const id = `${b.stateCode}${b.countyCode}${b.placeCode}${b.code}`;

        // console.log(id);

        // this.state.currentYear = b.latestInspectionLog.year;

        // const temp = b.inspectionLogs.map(log => log.year);
        // this.state.sliderYears = temp;
        // // this.state.currentYear = temp;

        // // console.log(b.inspectionLogs);

        // console.log("currentYear: " + this.state.currentYear);

        // const inspectionLog = b.inspectionLogs.filter(inspectionLog => inspectionLog.year === this.state.currentYear);
        // console.log("hello", inspectionLog[0]);
        // const inspectionLogForRadar = inspectionLog[0] || {
        //   STRUCTURAL_EVAL_067 : `${b.latestInspectionLog.STRUCTURAL_EVAL_067}`,
        //   DECK_GEOMETRY_EVAL_068 : `${b.latestInspectionLog.DECK_GEOMETRY_EVAL_068}`,
        //   UNDCLRENCE_EVAL_069 : `${b.latestInspectionLog.UNDCLRENCE_EVAL_069}`,
        //   POSTING_EVAL_070 : `${b.latestInspectionLog.POSTING_EVAL_070}`,
        //   WATERWAY_EVAL_071 : `${b.latestInspectionLog.WATERWAY_EVAL_071}`,
        //   APPR_ROAD_EVAL_072 : `${b.latestInspectionLog.APPR_ROAD_EVAL_072}`
        // };
        // console.log("Radar: ", inspectionLogForRadar);

        // this.state.STRUCTURAL_EVAL_067= inspectionLogForRadar.STRUCTURAL_EVAL_067;
        // this.state.DECK_GEOMETRY_EVAL_068= inspectionLogForRadar.DECK_GEOMETRY_EVAL_068;
        // this.state.UNDCLRENCE_EVAL_069= inspectionLogForRadar.UNDCLRENCE_EVAL_069;
        // this.state.POSTING_EVAL_070= inspectionLogForRadar.POSTING_EVAL_070;
        // this.state.WATERWAY_EVAL_071= inspectionLogForRadar.WATERWAY_EVAL_071;
        // this.state.APPR_ROAD_EVAL_072= inspectionLogForRadar.APPR_ROAD_EVAL_072;

        return <BridgeDetail Bridge={b} key={id} />;
      })}
    </div>
  );
  //       }}
  //     </Query>
  //   );
  // }
}

// BridgeDrawer.propTypes = {
//   classes: PropTypes.object.isRequired
// };

// export default withStyles(styles)(BridgeDrawer);

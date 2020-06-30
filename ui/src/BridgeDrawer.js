import React, { useState } from "react";

// Apollo
import { useQuery } from "@apollo/react-hooks";

import gql from "graphql-tag";

// Material UI components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

// External functions/components
import BridgeRadar from "./BridgeRadar";
import SimpleSlider from "./BridgeSlider";
import BridgeRatingLineChart from "./BridgeRatingLineChart";

const useStyles = makeStyles(theme => ({
  list: {
    width: 400
  }
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
        placeCode: $selectedPlace
        countyCode: $selectedCounty
        stateCode: $selectedState
      }
    ) {
      stateCode
      countyCode
      placeCode
      code
      latitude_decimal
      longitude_decimal
      buildYear
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

// TODO add button to show raw file data

const BridgeDetail = ({ Bridge }) => {
  const temp = Bridge.inspectionLogs.map(log => log.year);
  const [currentYear, setCurrentYear] = useState(Math.max(...temp));
  const [sliderYears, setSliderYears] = useState(temp);
  const [inspectionLog, setInspectionLog] = useState(
    Bridge.latestInspectionLog
  );
  const id = `${Bridge.stateCode}${Bridge.countyCode}${Bridge.placeCode}${Bridge.code}`;

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
      <BridgeRadar inspectionLog={inspectionLog} />
      <BridgeRatingLineChart inspectionLogs={Bridge.inspectionLogs} />
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

  const { loading, error, data } = useQuery(GET_BRIDGE, {
    variables: {
      selectedBridge,
      selectedPlace,
      selectedCounty,
      selectedState
    }
  });

  const [sliderYears, setSliderYears] = useState([]);
  const [currentYear, setCurrentYear] = useState(null);

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  return (
    <div className={classes.list}>
      {data.Bridge.map(b => {
        const id = `${b.stateCode}${b.countyCode}${b.placeCode}${b.code}`;

        return <BridgeDetail Bridge={b} key={id} />;
      })}
    </div>
  );
}

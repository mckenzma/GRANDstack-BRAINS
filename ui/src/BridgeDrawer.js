import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
// import Drawer from "@material-ui/core/Drawer";
// import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";

import ListItemText from "@material-ui/core/ListItemText";

import BridgeRadar from "./BridgeRadar";

const styles = {
  list: {
    width: 250
  }
};

class BridgeDrawer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      right: false
    };
  }

  render() {
    const { classes } = this.props;

    // TODO: fix query error when clicking back on map from open drawer. Getting GrpahQL query error

    // Is it better to qurey bridge on code, state_code, couny_code, place_code on Bridge node
    // or to query based on the state, county, place, bridge tree?
    return (
      <Query
        query={gql`
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
              #place {
              #  code
              #  county {
              #    code
              #    state {
              #      name
              #    }
              #  }
              #}
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
            }
          }
        `}
        variables={{
          selectedBridge: this.props.selectedBridge,
          selectedPlace: this.props.selectedPlace,
          selectedCounty: this.props.selectedCounty,
          selectedState: this.props.selectedState
        }}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error</p>;

          // console.log(this.props.selectedBridge);
          // console.log(this.props.selectedPlace);
          // console.log(this.props.selectedCounty);
          // console.log(this.props.selectedState);

          return (
            <div className={classes.list}>
              {data.Bridge.map(b => {
                // const id = `${b.state_code}${b.county_code}${b.place_code}${b.code}`;
                const id = `${b.stateCode}${b.countyCode}${b.placeCode}${
                  b.code
                }`;

                this.state.STRUCTURAL_EVAL_067 = `${
                  b.latestInspectionLog.STRUCTURAL_EVAL_067
                }`;
                this.state.DECK_GEOMETRY_EVAL_068 = `${
                  b.latestInspectionLog.DECK_GEOMETRY_EVAL_068
                }`;
                this.state.UNDCLRENCE_EVAL_069 = `${
                  b.latestInspectionLog.UNDCLRENCE_EVAL_069
                }`;
                this.state.POSTING_EVAL_070 = `${
                  b.latestInspectionLog.POSTING_EVAL_070
                }`;
                this.state.WATERWAY_EVAL_071 = `${
                  b.latestInspectionLog.WATERWAY_EVAL_071
                }`;
                this.state.APPR_ROAD_EVAL_072 = `${
                  b.latestInspectionLog.APPR_ROAD_EVAL_072
                }`;

                return (
                  <List key={id}>
                    <ListItem>
                      <ListItemText>
                        {/*State: {b.place.county.state.name}*/}
                        State: {b.stateCode}
                      </ListItemText>
                    </ListItem>
                    <ListItem>
                      {/*<ListItemText>County: {b.place.county.name}</ListItemText>*/}
                      <ListItemText>County: {b.countyCode}</ListItemText>
                    </ListItem>
                    <ListItem>
                      {/*<ListItemText>Place: {b.place.code}</ListItemText>*/}
                      <ListItemText>Place: {b.placeCode}</ListItemText>
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText>Name: {b.code}</ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText>LAT: {b.latitude_decimal}</ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText>LONG: {b.longitude_decimal}</ListItemText>
                    </ListItem>
                    <ListItem>
                      <ListItemText>
                        {/*Build Year: {b.buildYear.year}*/}
                        Build Year: {b.buildYear}
                      </ListItemText>
                    </ListItem>
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
                  </List>
                );
              })}
              <BridgeRadar
                STRUCTURAL_EVAL_067={this.state.STRUCTURAL_EVAL_067}
                DECK_GEOMETRY_EVAL_068={this.state.DECK_GEOMETRY_EVAL_068}
                UNDCLRENCE_EVAL_069={this.state.UNDCLRENCE_EVAL_069}
                POSTING_EVAL_070={this.state.POSTING_EVAL_070}
                WATERWAY_EVAL_071={this.state.WATERWAY_EVAL_071}
                APPR_ROAD_EVAL_072={this.state.APPR_ROAD_EVAL_072}
              />
            </div>
          );
        }}
      </Query>
    );
  }
}

BridgeDrawer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(BridgeDrawer);

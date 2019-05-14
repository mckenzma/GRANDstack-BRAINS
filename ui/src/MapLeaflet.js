import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import "./Map.css";
import { withStyles } from "@material-ui/core/styles";

import { Map, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";

//import HeatmapLayer from 'react-leaflet-heatmap-layer/lib/HeatmapLayer';

import "react-leaflet-markercluster/dist/styles.min.css";
import MarkerClusterGroup from "react-leaflet-markercluster";

import PropTypes from "prop-types";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import Card from "@material-ui/core/Card";

import BridgeDrawer from "./BridgeDrawer.js";

const styles = theme => ({
  root: {
    height: 400,
    overflowX: "auto"
  },
  list: {
    width: 250
  },
  map: {
    marginTop: theme.spacing.unit
  },
  card: {
    minWidth: 275
  }
});

class MapLeaf extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lng: -98.5795, // center of US --> Long. 103 46 17.60283(W)
      lat: 39.8283, //center of US --> Lat. 44 58 02.07622(N)
      zoom: 4,
      right: false,
      bridge_id: null,
      bridge_lat: null,
      bridge_lng: null,
      build_year: null,
      owned_by: null,
      maintained_by: null
    };
  }

  toggleDrawer = (
    side,
    open,
    // bridge
    bridge_id
  ) => () => {
    this.setState({
      [side]: open,
      // bridge_name: bridge.name,
      // bridge_id: bridge.id,
      bridge_id: bridge_id
      // bridge_lat: bridge.latitude_decimal,
      // bridge_lng: bridge.longitude_decimal,
      // build_year: bridge.yearbuilt
    });
  };

  render() {
    const { classes } = this.props;

    const sideList = (
      <div className={classes.list}>
        <List>
          <ListItem>
            <ListItemText>ID: {this.state.bridge_id}</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>State: {this.state.bridge_state}</ListItemText>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText>LAT: {this.state.bridge_lat}</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>LONG: {this.state.bridge_lng}</ListItemText>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText>Build Year: {this.state.build_year}</ListItemText>
          </ListItem>
        </List>
      </div>
    );

    const position = [this.state.lat, this.state.lng];

    const myIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow
    });

    return (
      <Query
        // Trying Filter Application starting at Bridge
        query={gql`
          query statesPaginateQuery(
            $selected: [String!]
            $yearSelected: [Int!]
            $maintRespSelected: [String!]
          ) {
            Bridge(
              filter: {
                place: { county: { state: { name_in: $selected } } }
                buildYear: { year_in: $yearSelected }
                maintenanceResp: { description_in: $maintRespSelected }
              }
            ) {
              id
              latitude_decimal
              longitude_decimal
            }
          }
        `}
        // Updated State Filter
        // query={gql`
        //   query statesPaginateQuery(
        //     $selected: [String!]
        //     $yearSelected: [Int!]
        //   ) {
        //     State(filter: { name_in: $selected }) {
        //       id
        //       name
        //       county {
        //         id
        //         name
        //         place {
        //           id
        //           name
        //           bridge(filter: { buildYear: { year_in: $yearSelected } }) {
        //             #bridge(filter: { yearbuilt_in: $yearSelected }) {
        //             #bridge {
        //             id
        //             yearbuilt
        //             latitude_decimal
        //             longitude_decimal
        //             yearbuilt
        //             #buildYear(filter: { year_in: $yearSelected }) {
        //             #buildYear {
        //             #  year
        //             #}
        //           }
        //         }
        //       }
        //     }
        //   }
        // `}

        // Original State Filter
        // query={gql`
        //   query statesPaginateQuery(
        // $selected: [String!]
        // #$yearSelected: [Int!]
        // )
        //   {
        //     State(filter: { name_in: $selected }) {
        //       id
        //       name
        //       bridges {
        //         id
        //         name
        //         latitude_decimal
        //         longitude_decimal
        //         yearbuilt
        //         #buildYear(filter: { year_in: $yearSelected }) {
        //         #buildYear {
        //         #  year
        //         #}
        //       }
        //     }
        //   }
        // `}
        variables={{
          selected: this.props.selected,
          yearSelected: this.props.yearSelected,
          maintRespSelected: this.props.maintRespSelected
        }}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error</p>;

          return (
            <div>
              <Map
                center={position}
                zoom={this.state.zoom}
                maxZoom={18}
                className="absolute top right left bottom"
                preferCanvas={true}
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                />
                <MarkerClusterGroup>
                  {/* Begin Revised Bridge Query */}
                  {data.Bridge.map(b => {
                    return (
                      <Marker
                        key={b.id}
                        position={[b.latitude_decimal, b.longitude_decimal]}
                        icon={myIcon}
                        onClick={this.toggleDrawer(
                          "right",
                          true,
                          // b
                          b.id
                        )}
                      />
                    );
                  })}
                  {/* End Revised Bridge Query */}

                  {/* Begin React Fragment Implementatinon */}
                  {/*{
                    data.State.map(s => (
                      <React.Fragment key={s.id}>
                        <County data={s} />
                      </React.Fragment>
                    ))
                  }*/}
                  {/* End React Fragment Implementatinon */}

                  {/* Begin original State query */}
                  {/*{data.State.map(s => {
                    return (
                      <div key={s.id}>
                        {s.county.map(c => {
                          return (
                            <div key={s.id + c.id}>
                              {c.place.map(p => {
                                return (
                                  <div key={s.id + c.id + p.id}>
                                    {p.bridge.map(b => {
                                      return (
                                        <div key={b.id}>
                                          <Marker
                                            key={b.id}
                                            position={[
                                              b.latitude_decimal,
                                              b.longitude_decimal
                                            ]}
                                            icon={myIcon}
                                            onClick={this.toggleDrawer(
                                              "right",
                                              true,
                                              b,
                                              s.name //,
                                              // c.name,
                                              // p.name
                                            )}
                                          />
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}*/}
                  {/* Begin original State query */}

                  {/*{data.State.slice().map(b => {
                    return (
                      <div key={b.id}>
                        {b.bridges.slice().map(n => {
                          return (
                            <Marker
                              key={n.id}
                              position={[
                                n.latitude_decimal,
                                n.longitude_decimal
                              ]}
                              icon={myIcon}
                              onClick={this.toggleDrawer(
                                "right",
                                true,
                                n,
                                b.name
                              )}
                            />
                          );
                        })}
                      </div>
                    );
                  })}*/}
                </MarkerClusterGroup>
              </Map>

              {/*<Map center={position} zoom={this.state.zoom} className="absolute top right left bottom" >
                <HeatmapLayer
                  //blur={10.0}
                  //radius={10.0}
                  fitBoundsOnLoad
                  fitBoundsOnUpdate
                  points={data.Bridge}
                  longitudeExtractor={m => m['longitude_decimal']}
                  latitudeExtractor={m => m['latitude_decimal']}
                  intensityExtractor={m => 5.0} />
                <TileLayer
                  url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
              </Map>*/}

              <Drawer
                anchor="right"
                open={this.state.right}
                onClose={this.toggleDrawer("right", false, "")}
              >
                <div
                  tabIndex={0}
                  role="button"
                  onClick={this.toggleDrawer("right", false, "")}
                  onKeyDown={this.toggleDrawer("right", false, "")}
                >
                  <div className={classes.list}>
                    <List>
                      <ListItem>
                        <ListItemText>Bridge Info</ListItemText>
                      </ListItem>
                    </List>
                    <Divider />
                    <BridgeDrawer
                      selectedBridge={this.state.bridge_id}
                      // open={this.state.right}
                      // onClose={this.toggleDrawer("right", false, "")}
                    />
                    {/* {sideList} */}
                  </div>
                </div>
              </Drawer>
            </div>
          );
        }}
      </Query>
    );
  }
}

// Begin React Fragment Implementatinon
// const County = ({ data }) =>
//   data.county.map(c => (
//     <React.Fragment key={c.id}>
//       <Place data={c} />
//     </React.Fragment>
//   ));

// const Place = ({ data }) =>
//   data.county.map(p => (
//     <React.Fragment key={p.id}>
//       <Bridge data={p} />
//     </React.Fragment>
//   ));

// const Bridge = ({ data }) =>
//   data.county.map(b => (
//     <React.Fragment key={b.id}>
//       <Marker
//         key={b.id}
//         position={[b.latitude_decimal, b.longitude_decimal]}
//         // icon={myIcon}
//         // onClick={this.toggleDrawer("right", true, b, s.name)}
//       />
//     </React.Fragment>
//   ));
// End React Fragment Implementatinon

MapLeaf.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MapLeaf);

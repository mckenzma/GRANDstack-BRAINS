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

const styles = theme => ({
  root: {
    // width: 700,
    height: 400,
    // maxWidth: 700,
    // marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
    // margin: "auto"
  },
  list: {
    width: 250
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
    bridge,
    stateName /*, countyName, placeName*/
  ) => () => {
    this.setState({
      [side]: open,
      bridge_state: stateName,
      // bridge_county: countyName,
      // bridge_place: placeName,
      bridge_name: bridge.name,
      bridge_id: bridge.id,
      bridge_lat: bridge.latitude_decimal,
      bridge_lng: bridge.longitude_decimal,
      build_year: bridge.yearbuilt
    });
  };

  render() {
    const { classes } = this.props;

    const sideList = (
      <div className={classes.list}>
        <List>
          {/*<ListItem >
            <ListItemText >NAME: {this.state.bridge_name}</ListItemText>
          </ListItem>*/}
          <ListItem>
            <ListItemText>State: {this.state.bridge_state}</ListItemText>
          </ListItem>
          {/*<ListItem>
            <ListItemText>County: {this.state.bridge_county}</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>Place: {this.state.bridge_place}</ListItemText>
          </ListItem>*/}
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
          {/*<ListItem >
            <ListItemText >Owned By: </ListItemText>
          </ListItem>
          <ListItem >
            <ListItemText >Maintained By: </ListItemText>
          </ListItem>*/}
        </List>
      </div>
    );

    const position = [this.state.lat, this.state.lng];

    const myIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow
    });

    // if (this.props.selected.length === 52) {
    //   // maybe use rowCount here?
    //   // return {}
    //   console.log("just load bridges");
    // } else {
    //   // return {name_in: this.props.selected};
    //   console.log("load state then bridges");
    // }

    // console.log("map: selected: " + this.props.selected);
    // console.log("map: yearSelected: " + this.props.yearSelected);

    return (
      <Query
        query={gql`
          query statesPaginateQuery(
            $selected: [String!]
            $yearSelected: [Int!]
          ) {
            State(filter: { name_in: $selected }) {
              id
              name
              county {
                name
                place {
                  name
                  bridge(filter: { buildYear: { year_in: $yearSelected } }) {
                    #bridge(filter: { yearbuilt_in: $yearSelected }) {
                    #bridge {
                    id
                    yearbuilt
                    latitude_decimal
                    longitude_decimal
                    yearbuilt
                    #buildYear(filter: { year_in: $yearSelected }) {
                    #buildYear {
                    #  year
                    #}
                  }
                }
              }
            }
          }
        `}
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
          //name: this.state.name
          // name: this.props.name,
          selected: this.props.selected,
          yearSelected: this.props.yearSelected
          // selected: []
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
                  {data.State.slice().map(s => {
                    return (
                      //<div key={s.id}>
                      <div>
                        {s.county.slice().map(c => {
                          return (
                            // <div key={c.id}>
                            <div>
                              {c.place.slice().map(p => {
                                return (
                                  // <div key={p.id}>
                                  <div>
                                    {p.bridge.slice().map(b => {
                                      return (
                                        // <div key={m.id}>
                                        <div key={b.id}>
                                          {/*//{m.bridge.slice().map(n => {*/}
                                          {/*return (*/}
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
                                          {/*} );*/}
                                          {/*//})}*/}
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
                  })}
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
                    {sideList}
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

MapLeaf.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MapLeaf);

import React, { useState } from "react";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const GET_BRIDGE_ROWS = gql`
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
      rows {
        file {
          year
          name
        }
        # order alphabetically or by number?
        # prob by number
        ADT_029
        APPR_KIND_044A
        APPR_RAIL_036C
        APPR_RAIL_END_036D
        APPR_ROAD_EVAL_072
        APPR_SPANS_046
        APPR_TYPE_044B
        APPR_WIDTH_MT_032
        BASE_HWY_NETWORK_012
        BRIDGE_IMP_COST_094
        BRIDGE_LEN_IND_112
        CHANNEL_COND_061
        COUNTY_CODE_003
        CRITICAL_FACILITY_006B
        CULVERT_COND_062
        DATE_LAST_UPDATE
        DATE_OF_INSPECT_090
        DECK_COND_058
        DECK_GEOMETRY_EVAL_068
        DECK_PROTECTION_108C
        DECK_STRUCTURE_TYPE_107
        DECK_WIDTH_MT_052
        DEDUCT_CODE
        DEGREES_SKEW_034
        DESIGN_LOAD_031
        DETOUR_KILOS_019
        DIRECTION_005E
        DTL_TYPE_OF_IMP
        FACILITY_CARRIED_007
        FEATURES_DESC_006A
        FEDERAL_LANDS_105
        FED_AGENCY
        FRACTURE_092A
        FRACTURE_LAST_DATE_093A
        FUNCTIONAL_CLASS_026
        FUTURE_ADT_114
        HIGHWAY_DISTRICT_002
        HIGHWAY_SYSTEM_104
        HISTORY_037
        HORR_CLR_MT_047
        IMP_LEN_MT_076
        INSPECT_FREQ_MONTHS_091
        INVENTORY_RATING_066
        INV_RATING_METH_065
        KILOPOINT_011
        LAT_016
        LAT_UND_MT_055B
        LAT_UND_REF_055A
        LEFT_CURB_MT_050A
        LEFT_LAT_UND_MT_056
        LOCATION_009
        LONG_017
        LRS_INV_ROUTE_013A
        MAINTENANCE_021
        MAIN_UNIT_SPANS_045
        MAX_SPAN_LEN_MT_048
        MEDIAN_CODE_033
        MEMBRANE_TYPE_108B
        MIN_NAV_CLR_MT_116
        MIN_VERT_CLR_010
        NATIONAL_NETWORK_110
        NAVIGATION_038
        NAV_HORR_CLR_MT_040
        NAV_VERT_CLR_MT_039
        NBI_TYPE_OF_IMP
        OPEN_CLOSED_POSTED_041
        OPERATING_RATING_064
        OPR_RATING_METH_063
        OTHER_STATE_CODE_098A
        OTHER_STATE_PCNT_098B
        OTHR_STATE_STRUC_NO_099
        OWNER_022
        PARALLEL_STRUCTURE_101
        PERCENT_ADT_TRUCK_109
        PIER_PROTECTION_111
        PLACE_CODE_004
        POSTING_EVAL_070
        PROGRAM_CODE
        PROJ_NO
        PROJ_SUFFIX
        RAILINGS_036A
        RECORD_TYPE_005A
        REMARKS
        RIGHT_CURB_MT_050B
        ROADWAY_IMP_COST_095
        ROADWAY_WIDTH_MT_051
        ROUTE_NUMBER_005D
        ROUTE_PREFIX_005B
        SCOUR_CRITICAL_113
        SERVICE_LEVEL_005C
        SERVICE_ON_042A
        SERVICE_UND_042B
        SPECIAL_CODE
        SPEC_INSPECT_092C
        SPEC_LAST_DATE_093C
        STATE_CODE_001
        STATUS_NO_10YR_RULE
        STATUS_WITH_10YR_RULE
        STEP_CODE
        STRAHNET_HIGHWAY_100
        STRUCTURAL_EVAL_067
        STRUCTURE_FLARED_035
        STRUCTURE_KIND_043A
        STRUCTURE_LEN_MT_049
        STRUCTURE_NUMBER_008
        STRUCTURE_TYPE_043B
        SUBROUTE_NO_013B
        SUBSTRUCTURE_COND_060
        SUFFICIENCY_ASTERC
        SUFFICIENCY_RATING
        SUPERSTRUCTURE_COND_059
        SURFACE_TYPE_108A
        TEMP_STRUCTURE_103
        TOLL_020
        TOTAL_IMP_COST_096
        TRAFFIC_DIRECTION_102
        TRAFFIC_LANES_ON_028A
        TRAFFIC_LANES_UND_028B
        TRANSITIONS_036B
        TYPE_LAST_UPDATE
        UNDCLRENCE_EVAL_069
        UNDWATER_LAST_DATE_093B
        UNDWATER_LOOK_SEE_092B
        VERT_CLR_OVER_MT_053
        VERT_CLR_UND_054B
        VERT_CLR_UND_REF_054A
        WATERWAY_EVAL_071
        WORK_DONE_BY_075B
        WORK_PROPOSED_075A
        YEAR_ADT_030
        YEAR_BUILT_027
        YEAR_OF_FUTURE_ADT_115
        YEAR_OF_IMP_097
        YEAR_RECONSTRUCTED_106
      }
    }
  }
`;

// TODOS
// 1. dynamically build row cells rather than manually
// 2. create function to control swtich color highlighting

export default function BridgeTable({
  code,
  placeCode,
  countyCode,
  stateCode,
  showChanges
}) {
  const { loading, error, data } = useQuery(GET_BRIDGE_ROWS, {
    variables: {
      selectedBridge: code,
      selectedPlace: placeCode,
      selectedCounty: countyCode,
      selectedState: stateCode
    }
  });
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("year");

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  function getSorting(order, orderBy) {
    return order === "desc"
      ? (a, b) => (b["file"][orderBy] < a["file"][orderBy] ? -1 : 1)
      : (a, b) => (a["file"][orderBy] < b["file"][orderBy] ? -1 : 1);
  }

  // TODO: fix horiz scroll. cant click on to drag.

  return (
    <TableContainer /*component={Paper}*/ style={{ overflowX: "auto" }}>
      <Table
        /*className={classes.table}*/ aria-label="simple table"
        stickyHeader={true}
        size="small"
      >
        <TableHead>
          <TableRow>
            {Object.keys(data.Bridge[0].rows[0]).map(prop => {
              // TODO - refactor this so the header is created at the same time the first row is created to reduce number of iterations
              if (prop === "file") {
                return (
                  <React.Fragment key={"react-fragment"}>
                    <TableCell
                      style={{
                        position: "-webkit-sticky",
                        position: "sticky",
                        left: 0,
                        zIndex: 3
                      }}
                      key={"year"}
                    >
                      Year{/*prop.year*/}
                    </TableCell>
                    <TableCell key={"fileName"}>
                      File Name{/*prop.name*/}
                    </TableCell>
                  </React.Fragment>
                );
              } else if (prop === "__typename") {
                return;
              } else {
                return <TableCell key={prop}>{prop}</TableCell>;
              }
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.Bridge[0].rows
            .sort(getSorting(order, orderBy))
            .map((row, rowIndex) => {
              return (
                <TableRow key={rowIndex}>
                  {/* Trying to not have to specify each property from the Row node */}
                  {/* {Object.entries(row).map((val,valIndex) =>{
                                // console.log(val, val[0],val[1]);
                                
                                if (val[0] === "file" ){
                                    return (
                                        <>
                                            <TableCell key={rowIndex+"_year_"+val[1].year}>{val[1].year}</TableCell>
                                            <TableCell key={rowIndex+"_fileName_"+val[1].name}>{val[1].name}</TableCell>
                                        </>
                                    );
                                }else if(val[0] === "__typename"){
                                    return;
                                } 
                                else{
                                    // console.log("thisRow val:", val, "prev row val:", data.Bridge[0][rowIndex-1][valIndex])
                                    return (
                                        <TableCell
                                            // TODO - add styling to highlight values different from prev year
                                            // style={{
                                            //     backgroundColor: data.Bridges[0][rowIndex]
                                            // }}
                                            // #ef9a9a background color for "different" cells
                                            key={rowIndex+"_"+valIndex}
                                        >
                                            {val[1]}
                                        </TableCell>
                                    );
                                }
                            })} */}

                  {/* Manually typing out every column */}
                  {/* TODO - make this dynamic. order by number (order as shown in document) not by alpha */}
                  <TableCell /*style={{backgroundColor: rowIndex !== 0 ? (row.file.year !== data.Bridge[0].rows[rowIndex-1]["file"]["year"] ? '#ef9a9a': '') : ''}}*/
                    style={{
                      position: "-webkit-sticky",
                      position: "sticky",
                      background: "#fff",
                      left: 0,
                      zIndex: 1
                    }}
                    key={"file_year_" + rowIndex}
                  >
                    {row.file.year}
                  </TableCell>
                  <TableCell /*style={{backgroundColor: rowIndex !== 0 ? (row.file.year !== data.Bridge[0].rows[rowIndex-1]["file"]["year"] ? '#ef9a9a': '') : ''}}*/
                    key={"file_name_" + rowIndex}
                  >
                    {row.file.name}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.ADT_029 !==
                            data.Bridge[0].rows[rowIndex - 1]["ADT_029"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"ADT_029" + "_" + rowIndex}
                  >
                    {row.ADT_029}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.APPR_KIND_044A !==
                            data.Bridge[0].rows[rowIndex - 1]["APPR_KIND_044A"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"APPR_KIND_044A" + "_" + rowIndex}
                  >
                    {row.APPR_KIND_044A}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.APPR_RAIL_036C !==
                            data.Bridge[0].rows[rowIndex - 1]["APPR_RAIL_036C"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"APPR_RAIL_036C" + "_" + rowIndex}
                  >
                    {row.APPR_RAIL_036C}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.APPR_RAIL_END_036D !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "APPR_RAIL_END_036D"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"APPR_RAIL_END_036D" + "_" + rowIndex}
                  >
                    {row.APPR_RAIL_END_036D}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.APPR_ROAD_EVAL_072 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "APPR_ROAD_EVAL_072"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"APPR_ROAD_EVAL_072" + "_" + rowIndex}
                  >
                    {row.APPR_ROAD_EVAL_072}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.APPR_SPANS_046 !==
                            data.Bridge[0].rows[rowIndex - 1]["APPR_SPANS_046"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"APPR_SPANS_046" + "_" + rowIndex}
                  >
                    {row.APPR_SPANS_046}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.APPR_TYPE_044B !==
                            data.Bridge[0].rows[rowIndex - 1]["APPR_TYPE_044B"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"APPR_TYPE_044B" + "_" + rowIndex}
                  >
                    {row.APPR_TYPE_044B}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.APPR_WIDTH_MT_032 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "APPR_WIDTH_MT_032"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"APPR_WIDTH_MT_032" + "_" + rowIndex}
                  >
                    {row.APPR_WIDTH_MT_032}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.BASE_HWY_NETWORK_012 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "BASE_HWY_NETWORK_012"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"BASE_HWY_NETWORK_012" + "_" + rowIndex}
                  >
                    {row.BASE_HWY_NETWORK_012}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.BRIDGE_IMP_COST_094 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "BRIDGE_IMP_COST_094"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"BRIDGE_IMP_COST_094" + "_" + rowIndex}
                  >
                    {row.BRIDGE_IMP_COST_094}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.BRIDGE_LEN_IND_112 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "BRIDGE_LEN_IND_112"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"BRIDGE_LEN_IND_112" + "_" + rowIndex}
                  >
                    {row.BRIDGE_LEN_IND_112}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.CHANNEL_COND_061 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "CHANNEL_COND_061"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"CHANNEL_COND_061" + "_" + rowIndex}
                  >
                    {row.CHANNEL_COND_061}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.COUNTY_CODE_003 !==
                            data.Bridge[0].rows[rowIndex - 1]["COUNTY_CODE_003"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"COUNTY_CODE_003" + "_" + rowIndex}
                  >
                    {row.COUNTY_CODE_003}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.CRITICAL_FACILITY_006B !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "CRITICAL_FACILITY_006B"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"CRITICAL_FACILITY_006B" + "_" + rowIndex}
                  >
                    {row.CRITICAL_FACILITY_006B}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.CULVERT_COND_062 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "CULVERT_COND_062"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"CULVERT_COND_062" + "_" + rowIndex}
                  >
                    {row.CULVERT_COND_062}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.DATE_LAST_UPDATE !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "DATE_LAST_UPDATE"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"DATE_LAST_UPDATE" + "_" + rowIndex}
                  >
                    {row.DATE_LAST_UPDATE}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.DATE_OF_INSPECT_090 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "DATE_OF_INSPECT_090"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"DATE_OF_INSPECT_090" + "_" + rowIndex}
                  >
                    {row.DATE_OF_INSPECT_090}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.DECK_COND_058 !==
                            data.Bridge[0].rows[rowIndex - 1]["DECK_COND_058"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"DECK_COND_058" + "_" + rowIndex}
                  >
                    {row.DECK_COND_058}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.DECK_GEOMETRY_EVAL_068 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "DECK_GEOMETRY_EVAL_068"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={
                      "APPR_RDECK_GEOMETRY_EVAL_068AIL_036C" + "_" + rowIndex
                    }
                  >
                    {row.DECK_GEOMETRY_EVAL_068}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.DECK_PROTECTION_108C !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "DECK_PROTECTION_108C"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"DECK_PROTECTION_108C" + "_" + rowIndex}
                  >
                    {row.DECK_PROTECTION_108C}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.DECK_STRUCTURE_TYPE_107 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "DECK_STRUCTURE_TYPE_107"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"DECK_STRUCTURE_TYPE_107" + "_" + rowIndex}
                  >
                    {row.DECK_STRUCTURE_TYPE_107}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.DECK_WIDTH_MT_052 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "DECK_WIDTH_MT_052"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"DECK_WIDTH_MT_052" + "_" + rowIndex}
                  >
                    {row.DECK_WIDTH_MT_052}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.DEDUCT_CODE !==
                            data.Bridge[0].rows[rowIndex - 1]["DEDUCT_CODE"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"DEDUCT_CODE" + "_" + rowIndex}
                  >
                    {row.DEDUCT_CODE}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.DEGREES_SKEW_034 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "DEGREES_SKEW_034"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"DEGREES_SKEW_034" + "_" + rowIndex}
                  >
                    {row.DEGREES_SKEW_034}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.DESIGN_LOAD_031 !==
                            data.Bridge[0].rows[rowIndex - 1]["DESIGN_LOAD_031"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"DESIGN_LOAD_031" + "_" + rowIndex}
                  >
                    {row.DESIGN_LOAD_031}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.DETOUR_KILOS_019 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "DETOUR_KILOS_019"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"DETOUR_KILOS_019" + "_" + rowIndex}
                  >
                    {row.DETOUR_KILOS_019}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.DIRECTION_005E !==
                            data.Bridge[0].rows[rowIndex - 1]["DIRECTION_005E"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"DIRECTION_005E" + "_" + rowIndex}
                  >
                    {row.DIRECTION_005E}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.DTL_TYPE_OF_IMP !==
                            data.Bridge[0].rows[rowIndex - 1]["DTL_TYPE_OF_IMP"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"DTL_TYPE_OF_IMP" + "_" + rowIndex}
                  >
                    {row.DTL_TYPE_OF_IMP}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.FACILITY_CARRIED_007 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "FACILITY_CARRIED_007"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"FACILITY_CARRIED_007" + "_" + rowIndex}
                  >
                    {row.FACILITY_CARRIED_007}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.FEATURES_DESC_006A !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "FEATURES_DESC_006A"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"FEATURES_DESC_006A" + "_" + rowIndex}
                  >
                    {row.FEATURES_DESC_006A}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.FEDERAL_LANDS_105 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "FEDERAL_LANDS_105"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"FEDERAL_LANDS_105" + "_" + rowIndex}
                  >
                    {row.FEDERAL_LANDS_105}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.FED_AGENCY !==
                            data.Bridge[0].rows[rowIndex - 1]["FED_AGENCY"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"FED_AGENCY" + "_" + rowIndex}
                  >
                    {row.FED_AGENCY}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.FRACTURE_092A !==
                            data.Bridge[0].rows[rowIndex - 1]["FRACTURE_092A"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"FRACTURE_092A" + "_" + rowIndex}
                  >
                    {row.FRACTURE_092A}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.FRACTURE_LAST_DATE_093A !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "FRACTURE_LAST_DATE_093A"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"FRACTURE_LAST_DATE_093A" + "_" + rowIndex}
                  >
                    {row.FRACTURE_LAST_DATE_093A}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.FUNCTIONAL_CLASS_026 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "FUNCTIONAL_CLASS_026"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"FUNCTIONAL_CLASS_026" + "_" + rowIndex}
                  >
                    {row.FUNCTIONAL_CLASS_026}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.FUTURE_ADT_114 !==
                            data.Bridge[0].rows[rowIndex - 1]["FUTURE_ADT_114"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"FUTURE_ADT_114" + "_" + rowIndex}
                  >
                    {row.FUTURE_ADT_114}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.HIGHWAY_DISTRICT_002 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "HIGHWAY_DISTRICT_002"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"HIGHWAY_DISTRICT_002" + "_" + rowIndex}
                  >
                    {row.HIGHWAY_DISTRICT_002}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.HIGHWAY_SYSTEM_104 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "HIGHWAY_SYSTEM_104"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"HIGHWAY_SYSTEM_104" + "_" + rowIndex}
                  >
                    {row.HIGHWAY_SYSTEM_104}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.HISTORY_037 !==
                            data.Bridge[0].rows[rowIndex - 1]["HISTORY_037"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"HISTORY_037" + "_" + rowIndex}
                  >
                    {row.HISTORY_037}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.HORR_CLR_MT_047 !==
                            data.Bridge[0].rows[rowIndex - 1]["HORR_CLR_MT_047"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"HORR_CLR_MT_047" + "_" + rowIndex}
                  >
                    {row.HORR_CLR_MT_047}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.IMP_LEN_MT_076 !==
                            data.Bridge[0].rows[rowIndex - 1]["IMP_LEN_MT_076"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"IMP_LEN_MT_076" + "_" + rowIndex}
                  >
                    {row.IMP_LEN_MT_076}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.INSPECT_FREQ_MONTHS_091 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "INSPECT_FREQ_MONTHS_091"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"INSPECT_FREQ_MONTHS_091" + "_" + rowIndex}
                  >
                    {row.INSPECT_FREQ_MONTHS_091}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.INVENTORY_RATING_066 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "INVENTORY_RATING_066"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"INVENTORY_RATING_066" + "_" + rowIndex}
                  >
                    {row.INVENTORY_RATING_066}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.INV_RATING_METH_065 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "INV_RATING_METH_065"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"INV_RATING_METH_065" + "_" + rowIndex}
                  >
                    {row.INV_RATING_METH_065}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.KILOPOINT_011 !==
                            data.Bridge[0].rows[rowIndex - 1]["KILOPOINT_011"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"KILOPOINT_011" + "_" + rowIndex}
                  >
                    {row.KILOPOINT_011}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.LAT_016 !==
                            data.Bridge[0].rows[rowIndex - 1]["LAT_016"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"LAT_016" + "_" + rowIndex}
                  >
                    {row.LAT_016}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.LAT_UND_MT_055B !==
                            data.Bridge[0].rows[rowIndex - 1]["LAT_UND_MT_055B"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"LAT_UND_MT_055B" + "_" + rowIndex}
                  >
                    {row.LAT_UND_MT_055B}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.LAT_UND_REF_055A !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "LAT_UND_REF_055A"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"LAT_UND_REF_055A" + "_" + rowIndex}
                  >
                    {row.LAT_UND_REF_055A}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.LEFT_CURB_MT_050A !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "LEFT_CURB_MT_050A"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"LEFT_CURB_MT_050A" + "_" + rowIndex}
                  >
                    {row.LEFT_CURB_MT_050A}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.LEFT_LAT_UND_MT_056 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "LEFT_LAT_UND_MT_056"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"LEFT_LAT_UND_MT_056" + "_" + rowIndex}
                  >
                    {row.LEFT_LAT_UND_MT_056}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.LOCATION_009 !==
                            data.Bridge[0].rows[rowIndex - 1]["LOCATION_009"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"LOCATION_009" + "_" + rowIndex}
                  >
                    {row.LOCATION_009}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.LONG_017 !==
                            data.Bridge[0].rows[rowIndex - 1]["LONG_017"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"LONG_017" + "_" + rowIndex}
                  >
                    {row.LONG_017}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.LRS_INV_ROUTE_013A !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "LRS_INV_ROUTE_013A"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"LRS_INV_ROUTE_013A" + "_" + rowIndex}
                  >
                    {row.LRS_INV_ROUTE_013A}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.MAINTENANCE_021 !==
                            data.Bridge[0].rows[rowIndex - 1]["MAINTENANCE_021"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"MAINTENANCE_021" + "_" + rowIndex}
                  >
                    {row.MAINTENANCE_021}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.MAIN_UNIT_SPANS_045 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "MAIN_UNIT_SPANS_045"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"MAIN_UNIT_SPANS_045" + "_" + rowIndex}
                  >
                    {row.MAIN_UNIT_SPANS_045}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.MAX_SPAN_LEN_MT_048 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "MAX_SPAN_LEN_MT_048"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"MAX_SPAN_LEN_MT_048" + "_" + rowIndex}
                  >
                    {row.MAX_SPAN_LEN_MT_048}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.MEDIAN_CODE_033 !==
                            data.Bridge[0].rows[rowIndex - 1]["MEDIAN_CODE_033"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"MEDIAN_CODE_033" + "_" + rowIndex}
                  >
                    {row.MEDIAN_CODE_033}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.MEMBRANE_TYPE_108B !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "MEMBRANE_TYPE_108B"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"MEMBRANE_TYPE_108B" + "_" + rowIndex}
                  >
                    {row.MEMBRANE_TYPE_108B}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.MIN_NAV_CLR_MT_116 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "MIN_NAV_CLR_MT_116"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"MIN_NAV_CLR_MT_116" + "_" + rowIndex}
                  >
                    {row.MIN_NAV_CLR_MT_116}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.MIN_VERT_CLR_010 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "MIN_VERT_CLR_010"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"MIN_VERT_CLR_010" + "_" + rowIndex}
                  >
                    {row.MIN_VERT_CLR_010}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.NATIONAL_NETWORK_110 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "NATIONAL_NETWORK_110"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"NATIONAL_NETWORK_110" + "_" + rowIndex}
                  >
                    {row.NATIONAL_NETWORK_110}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.NAVIGATION_038 !==
                            data.Bridge[0].rows[rowIndex - 1]["NAVIGATION_038"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"NAVIGATION_038" + "_" + rowIndex}
                  >
                    {row.NAVIGATION_038}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.NAV_HORR_CLR_MT_040 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "NAV_HORR_CLR_MT_040"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"NAV_HORR_CLR_MT_040" + "_" + rowIndex}
                  >
                    {row.NAV_HORR_CLR_MT_040}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.NAV_VERT_CLR_MT_039 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "NAV_VERT_CLR_MT_039"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"NAV_VERT_CLR_MT_039" + "_" + rowIndex}
                  >
                    {row.NAV_VERT_CLR_MT_039}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.NBI_TYPE_OF_IMP !==
                            data.Bridge[0].rows[rowIndex - 1]["NBI_TYPE_OF_IMP"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"NBI_TYPE_OF_IMP" + "_" + rowIndex}
                  >
                    {row.NBI_TYPE_OF_IMP}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.OPEN_CLOSED_POSTED_041 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "OPEN_CLOSED_POSTED_041"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"OPEN_CLOSED_POSTED_041" + "_" + rowIndex}
                  >
                    {row.OPEN_CLOSED_POSTED_041}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.OPERATING_RATING_064 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "OPERATING_RATING_064"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"OPERATING_RATING_064" + "_" + rowIndex}
                  >
                    {row.OPERATING_RATING_064}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.OPR_RATING_METH_063 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "OPR_RATING_METH_063"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"OPR_RATING_METH_063" + "_" + rowIndex}
                  >
                    {row.OPR_RATING_METH_063}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.OTHER_STATE_CODE_098A !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "OTHER_STATE_CODE_098A"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"OTHER_STATE_CODE_098A" + "_" + rowIndex}
                  >
                    {row.OTHER_STATE_CODE_098A}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.OTHER_STATE_PCNT_098B !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "OTHER_STATE_PCNT_098B"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"OTHER_STATE_PCNT_098B" + "_" + rowIndex}
                  >
                    {row.OTHER_STATE_PCNT_098B}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.OTHR_STATE_STRUC_NO_099 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "OTHR_STATE_STRUC_NO_099"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"OTHR_STATE_STRUC_NO_099" + "_" + rowIndex}
                  >
                    {row.OTHR_STATE_STRUC_NO_099}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.OWNER_022 !==
                            data.Bridge[0].rows[rowIndex - 1]["OWNER_022"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"OWNER_022" + "_" + rowIndex}
                  >
                    {row.OWNER_022}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.PARALLEL_STRUCTURE_101 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "PARALLEL_STRUCTURE_101"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"PARALLEL_STRUCTURE_101" + "_" + rowIndex}
                  >
                    {row.PARALLEL_STRUCTURE_101}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.PERCENT_ADT_TRUCK_109 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "PERCENT_ADT_TRUCK_109"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"PERCENT_ADT_TRUCK_109" + "_" + rowIndex}
                  >
                    {row.PERCENT_ADT_TRUCK_109}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.PIER_PROTECTION_111 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "PIER_PROTECTION_111"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"PIER_PROTECTION_111" + "_" + rowIndex}
                  >
                    {row.PIER_PROTECTION_111}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.PLACE_CODE_004 !==
                            data.Bridge[0].rows[rowIndex - 1]["PLACE_CODE_004"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"PLACE_CODE_004" + "_" + rowIndex}
                  >
                    {row.PLACE_CODE_004}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.POSTING_EVAL_070 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "POSTING_EVAL_070"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"POSTING_EVAL_070" + "_" + rowIndex}
                  >
                    {row.POSTING_EVAL_070}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.PROGRAM_CODE !==
                            data.Bridge[0].rows[rowIndex - 1]["PROGRAM_CODE"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"PROGRAM_CODE" + "_" + rowIndex}
                  >
                    {row.PROGRAM_CODE}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.PROJ_NO !==
                            data.Bridge[0].rows[rowIndex - 1]["PROJ_NO"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"PROJ_NO" + "_" + rowIndex}
                  >
                    {row.PROJ_NO}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.PROJ_SUFFIX !==
                            data.Bridge[0].rows[rowIndex - 1]["PROJ_SUFFIX"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"PROJ_SUFFIX" + "_" + rowIndex}
                  >
                    {row.PROJ_SUFFIX}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.RAILINGS_036A !==
                            data.Bridge[0].rows[rowIndex - 1]["RAILINGS_036A"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"RAILINGS_036A" + "_" + rowIndex}
                  >
                    {row.RAILINGS_036A}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.RECORD_TYPE_005A !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "RECORD_TYPE_005A"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"RECORD_TYPE_005A" + "_" + rowIndex}
                  >
                    {row.RECORD_TYPE_005A}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.REMARKS !==
                            data.Bridge[0].rows[rowIndex - 1]["REMARKS"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"REMARKS" + "_" + rowIndex}
                  >
                    {row.REMARKS}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.RIGHT_CURB_MT_050B !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "RIGHT_CURB_MT_050B"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"RIGHT_CURB_MT_050B" + "_" + rowIndex}
                  >
                    {row.RIGHT_CURB_MT_050B}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.ROADWAY_IMP_COST_095 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "ROADWAY_IMP_COST_095"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"ROADWAY_IMP_COST_095" + "_" + rowIndex}
                  >
                    {row.ROADWAY_IMP_COST_095}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.ROADWAY_WIDTH_MT_051 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "ROADWAY_WIDTH_MT_051"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"ROADWAY_WIDTH_MT_051" + "_" + rowIndex}
                  >
                    {row.ROADWAY_WIDTH_MT_051}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.ROUTE_NUMBER_005D !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "ROUTE_NUMBER_005D"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"ROUTE_NUMBER_005D" + "_" + rowIndex}
                  >
                    {row.ROUTE_NUMBER_005D}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.ROUTE_PREFIX_005B !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "ROUTE_PREFIX_005B"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"ROUTE_PREFIX_005B" + "_" + rowIndex}
                  >
                    {row.ROUTE_PREFIX_005B}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.SCOUR_CRITICAL_113 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "SCOUR_CRITICAL_113"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"SCOUR_CRITICAL_113" + "_" + rowIndex}
                  >
                    {row.SCOUR_CRITICAL_113}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.SERVICE_LEVEL_005C !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "SERVICE_LEVEL_005C"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"SERVICE_LEVEL_005C" + "_" + rowIndex}
                  >
                    {row.SERVICE_LEVEL_005C}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.SERVICE_ON_042A !==
                            data.Bridge[0].rows[rowIndex - 1]["SERVICE_ON_042A"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"SERVICE_ON_042A" + "_" + rowIndex}
                  >
                    {row.SERVICE_ON_042A}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.SERVICE_UND_042B !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "SERVICE_UND_042B"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"SERVICE_UND_042B" + "_" + rowIndex}
                  >
                    {row.SERVICE_UND_042B}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.SPECIAL_CODE !==
                            data.Bridge[0].rows[rowIndex - 1]["SPECIAL_CODE"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"SPECIAL_CODE" + "_" + rowIndex}
                  >
                    {row.SPECIAL_CODE}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.SPEC_INSPECT_092C !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "SPEC_INSPECT_092C"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"SPEC_INSPECT_092C" + "_" + rowIndex}
                  >
                    {row.SPEC_INSPECT_092C}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.SPEC_LAST_DATE_093C !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "SPEC_LAST_DATE_093C"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"SPEC_LAST_DATE_093C" + "_" + rowIndex}
                  >
                    {row.SPEC_LAST_DATE_093C}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.STATE_CODE_001 !==
                            data.Bridge[0].rows[rowIndex - 1]["STATE_CODE_001"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"STATE_CODE_001" + "_" + rowIndex}
                  >
                    {row.STATE_CODE_001}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.STATUS_NO_10YR_RULE !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "STATUS_NO_10YR_RULE"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"STATUS_NO_10YR_RULE" + "_" + rowIndex}
                  >
                    {row.STATUS_NO_10YR_RULE}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.STATUS_WITH_10YR_RULE !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "STATUS_WITH_10YR_RULE"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"STATUS_WITH_10YR_RULE" + "_" + rowIndex}
                  >
                    {row.STATUS_WITH_10YR_RULE}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.STEP_CODE !==
                            data.Bridge[0].rows[rowIndex - 1]["STEP_CODE"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"STEP_CODE" + "_" + rowIndex}
                  >
                    {row.STEP_CODE}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.STRAHNET_HIGHWAY_100 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "STRAHNET_HIGHWAY_100"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"STRAHNET_HIGHWAY_100" + "_" + rowIndex}
                  >
                    {row.STRAHNET_HIGHWAY_100}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.STRUCTURAL_EVAL_067 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "STRUCTURAL_EVAL_067"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"STRUCTURAL_EVAL_067" + "_" + rowIndex}
                  >
                    {row.STRUCTURAL_EVAL_067}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.STRUCTURE_FLARED_035 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "STRUCTURE_FLARED_035"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"STRUCTURE_FLARED_035" + "_" + rowIndex}
                  >
                    {row.STRUCTURE_FLARED_035}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.STRUCTURE_KIND_043A !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "STRUCTURE_KIND_043A"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"STRUCTURE_KIND_043A" + "_" + rowIndex}
                  >
                    {row.STRUCTURE_KIND_043A}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.STRUCTURE_LEN_MT_049 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "STRUCTURE_LEN_MT_049"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"STRUCTURE_LEN_MT_049" + "_" + rowIndex}
                  >
                    {row.STRUCTURE_LEN_MT_049}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.STRUCTURE_NUMBER_008 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "STRUCTURE_NUMBER_008"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"STRUCTURE_NUMBER_008" + "_" + rowIndex}
                  >
                    {row.STRUCTURE_NUMBER_008}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.STRUCTURE_TYPE_043B !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "STRUCTURE_TYPE_043B"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"STRUCTURE_TYPE_043B" + "_" + rowIndex}
                  >
                    {row.STRUCTURE_TYPE_043B}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.SUBROUTE_NO_013B !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "SUBROUTE_NO_013B"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"SUBROUTE_NO_013B" + "_" + rowIndex}
                  >
                    {row.SUBROUTE_NO_013B}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.SUBSTRUCTURE_COND_060 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "SUBSTRUCTURE_COND_060"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"SUBSTRUCTURE_COND_060" + "_" + rowIndex}
                  >
                    {row.SUBSTRUCTURE_COND_060}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.SUFFICIENCY_ASTERC !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "SUFFICIENCY_ASTERC"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"SUFFICIENCY_ASTERC" + "_" + rowIndex}
                  >
                    {row.SUFFICIENCY_ASTERC}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.SUFFICIENCY_RATING !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "SUFFICIENCY_RATING"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"SUFFICIENCY_RATING" + "_" + rowIndex}
                  >
                    {row.SUFFICIENCY_RATING}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.SUPERSTRUCTURE_COND_059 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "SUPERSTRUCTURE_COND_059"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"SUPERSTRUCTURE_COND_059" + "_" + rowIndex}
                  >
                    {row.SUPERSTRUCTURE_COND_059}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.SURFACE_TYPE_108A !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "SURFACE_TYPE_108A"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"SURFACE_TYPE_108A" + "_" + rowIndex}
                  >
                    {row.SURFACE_TYPE_108A}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.TEMP_STRUCTURE_103 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "TEMP_STRUCTURE_103"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"TEMP_STRUCTURE_103" + "_" + rowIndex}
                  >
                    {row.TEMP_STRUCTURE_103}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.TOLL_020 !==
                            data.Bridge[0].rows[rowIndex - 1]["TOLL_020"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"TOLL_020" + "_" + rowIndex}
                  >
                    {row.TOLL_020}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.TOTAL_IMP_COST_096 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "TOTAL_IMP_COST_096"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"TOTAL_IMP_COST_096" + "_" + rowIndex}
                  >
                    {row.TOTAL_IMP_COST_096}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.TRAFFIC_DIRECTION_102 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "TRAFFIC_DIRECTION_102"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"TRAFFIC_DIRECTION_102" + "_" + rowIndex}
                  >
                    {row.TRAFFIC_DIRECTION_102}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.TRAFFIC_LANES_ON_028A !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "TRAFFIC_LANES_ON_028A"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"TRAFFIC_LANES_ON_028A" + "_" + rowIndex}
                  >
                    {row.TRAFFIC_LANES_ON_028A}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.TRAFFIC_LANES_UND_028B !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "TRAFFIC_LANES_UND_028B"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"TRAFFIC_LANES_UND_028B" + "_" + rowIndex}
                  >
                    {row.TRAFFIC_LANES_UND_028B}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.TRANSITIONS_036B !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "TRANSITIONS_036B"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"TRANSITIONS_036B" + "_" + rowIndex}
                  >
                    {row.TRANSITIONS_036B}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.TYPE_LAST_UPDATE !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "TYPE_LAST_UPDATE"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"TYPE_LAST_UPDATE" + "_" + rowIndex}
                  >
                    {row.TYPE_LAST_UPDATE}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.UNDCLRENCE_EVAL_069 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "UNDCLRENCE_EVAL_069"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"UNDCLRENCE_EVAL_069" + "_" + rowIndex}
                  >
                    {row.UNDCLRENCE_EVAL_069}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.UNDWATER_LAST_DATE_093B !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "UNDWATER_LAST_DATE_093B"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"UNDWATER_LAST_DATE_093B" + "_" + rowIndex}
                  >
                    {row.UNDWATER_LAST_DATE_093B}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.UNDWATER_LOOK_SEE_092B !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "UNDWATER_LOOK_SEE_092B"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"UNDWATER_LOOK_SEE_092B" + "_" + rowIndex}
                  >
                    {row.UNDWATER_LOOK_SEE_092B}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.VERT_CLR_OVER_MT_053 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "VERT_CLR_OVER_MT_053"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"VERT_CLR_OVER_MT_053" + "_" + rowIndex}
                  >
                    {row.VERT_CLR_OVER_MT_053}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.VERT_CLR_UND_054B !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "VERT_CLR_UND_054B"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"VERT_CLR_UND_054B" + "_" + rowIndex}
                  >
                    {row.VERT_CLR_UND_054B}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.VERT_CLR_UND_REF_054A !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "VERT_CLR_UND_REF_054A"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"VERT_CLR_UND_REF_054A" + "_" + rowIndex}
                  >
                    {row.VERT_CLR_UND_REF_054A}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.WATERWAY_EVAL_071 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "WATERWAY_EVAL_071"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"WATERWAY_EVAL_071" + "_" + rowIndex}
                  >
                    {row.WATERWAY_EVAL_071}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.WORK_DONE_BY_075B !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "WORK_DONE_BY_075B"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"WORK_DONE_BY_075B" + "_" + rowIndex}
                  >
                    {row.WORK_DONE_BY_075B}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.WORK_PROPOSED_075A !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "WORK_PROPOSED_075A"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"WORK_PROPOSED_075A" + "_" + rowIndex}
                  >
                    {row.WORK_PROPOSED_075A}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.YEAR_ADT_030 !==
                            data.Bridge[0].rows[rowIndex - 1]["YEAR_ADT_030"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"YEAR_ADT_030" + "_" + rowIndex}
                  >
                    {row.YEAR_ADT_030}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.YEAR_BUILT_027 !==
                            data.Bridge[0].rows[rowIndex - 1]["YEAR_BUILT_027"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"YEAR_BUILT_027" + "_" + rowIndex}
                  >
                    {row.YEAR_BUILT_027}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.YEAR_OF_FUTURE_ADT_115 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "YEAR_OF_FUTURE_ADT_115"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"YEAR_OF_FUTURE_ADT_115" + "_" + rowIndex}
                  >
                    {row.YEAR_OF_FUTURE_ADT_115}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.YEAR_OF_IMP_097 !==
                            data.Bridge[0].rows[rowIndex - 1]["YEAR_OF_IMP_097"]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"YEAR_OF_IMP_097" + "_" + rowIndex}
                  >
                    {row.YEAR_OF_IMP_097}
                  </TableCell>
                  <TableCell
                    style={{
                      backgroundColor: showChanges
                        ? rowIndex !== 0
                          ? row.YEAR_RECONSTRUCTED_106 !==
                            data.Bridge[0].rows[rowIndex - 1][
                              "YEAR_RECONSTRUCTED_106"
                            ]
                            ? "#ef9a9a"
                            : ""
                          : ""
                        : ""
                    }}
                    key={"YEAR_RECONSTRUCTED_106" + "_" + rowIndex}
                  >
                    {row.YEAR_RECONSTRUCTED_106}
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

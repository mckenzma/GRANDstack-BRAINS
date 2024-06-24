// Iterate through files and import rows (NoDelimiter)
MATCH (file:NoDelimiterFile)
WHERE NOT (file)-[:CONTAINS]->(:NoDelimiterRow)
// these files have some character(s) causing issues
AND NOT file.url = "https://www.fhwa.dot.gov/bridge/nbi/2001/AL01.txt"
AND NOT file.url = "https://www.fhwa.dot.gov/bridge/nbi/2006/WY06.txt"
AND NOT file.url = "https://www.fhwa.dot.gov/bridge/nbi/2011/WV11.txt"
AND NOT file.url = "https://www.fhwa.dot.gov/bridge/nbi/2017/DC17.txt"
WITH collect(file.url) AS fileURLs
UNWIND fileURLs AS fileURL
CALL apoc.periodic.iterate(
'
CALL apoc.load.csv($url,{header:false,quoteChar:"\u0000",arraySep:"\u0000"}) YIELD list AS row
RETURN row
','
CREATE (fileRow:Row:NoDelimiterRow {createdOn: date()})
SET fileRow.data = row[0],
fileRow.url = $url,
fileRow.createdOn = date()
',
{batchSize:10000,parallel:false,params:{url:fileURL}}) YIELD batches, total
RETURN batches, total

// No delimiter files causing problems
UNWIND ["https://www.fhwa.dot.gov/bridge/nbi/2001/AL01.txt",
        "https://www.fhwa.dot.gov/bridge/nbi/2006/WY06.txt",
        "https://www.fhwa.dot.gov/bridge/nbi/2011/WV11.txt",
        "https://www.fhwa.dot.gov/bridge/nbi/2017/DC17.txt"]
  AS url
LOAD CSV FROM url AS row
FIELDTERMINATOR "\u0000"
CREATE (fileRow:Row:NoDelimiterRow {createdOn: date()})
SET fileRow.data = row[0],
fileRow.url = url,
fileRow.createdOn = date()

// Parse no delimiter data to NBI fields
// https://www.fhwa.dot.gov/bridge/nbi/format.cfm
// need to review and verify data
CALL apoc.periodic.iterate(
'
MATCH (ndr:NoDelimiterRow)
WHERE ndr.STATE_CODE_001 IS NULL
RETURN ndr
','
WITH ndr, ndr.data AS data
WITH ndr, {
  STATE_CODE_001: substring(data,0,2), // STATE_CODE_001
  // Not sure what to do with this
  STRUCTURE_NUMBER_008: substring(data,3,15), // STRUCTURE_NUMBER_008
  
  RECORD_TYPE_005A: substring(data,18,1), // RECORD_TYPE_005A
  ROUTE_PREFIX_005B: substring(data,19,1), // ROUTE_PREFIX_005B
  SERVICE_LEVEL_005C: substring(data,20,1), // SERVICE_LEVEL_005C
  ROUTE_NUMBER_005D: substring(data,21,5), // ROUTE_NUMBER_005D
  DIRECTION_005E: substring(data,26,1), // DIRECTION_005E
  HIGHWAY_DISTRICT_002: substring(data,27,2), // HIGHWAY_DISTRICT_002
  COUNTY_CODE_003: substring(data,29,3), // COUNTY_CODE_003
  PLACE_CODE_004: substring(data,32,5), // PLACE_CODE_004
  
  FEATURES_DESC_006A: substring(data,37,24), // FEATURES_DESC_006A
  CRITICAL_FACILITY_006B: substring(data,61,1), // CRITICAL_FACILITY_006B
  FACILITY_CARRIED_007: substring(data,62,18), // FACILITY_CARRIED_007
  LOCATION_009: substring(data,80,25), // LOCATION_009
  MIN_VERT_CLR_010: substring(data,105,4), // MIN_VERT_CLR_010
  KILOPOINT_011: substring(data,109,7), // KILOPOINT_011
  BASE_HWY_NETWORK_012: substring(data,116,1), // BASE_HWY_NETWORK_012
  
  LRS_INV_ROUTE_013A: substring(data,117,10), // LRS_INV_ROUTE_013A
  SUBROUTE_NO_013B: substring(data,127,2), // SUBROUTE_NO_013B
  LAT_016: substring(data,129,8), // LAT_016
  LONG_017: substring(data,137,9), // LONG_017
  DETOUR_KILOS_019: substring(data,146,3), // DETOUR_KILOS_019
  TOLL_020: substring(data,149,1), // TOLL_020
  MAINTENANCE_021: substring(data,150,2), // MAINTENANCE_021
  OWNER_022: substring(data,152,2), // OWNER_022
  FUNCTIONAL_CLASS_026: substring(data,154,2), // FUNCTIONAL_CLASS_026
  YEAR_BUILT_027: substring(data,156,4), // YEAR_BUILT_027
  
  TRAFFIC_LANES_ON_028A: substring(data,160,2), // TRAFFIC_LANES_ON_028A
  TRAFFIC_LANES_UND_028B: substring(data,162,2), // TRAFFIC_LANES_UND_028B
  ADT_029: substring(data,164,6), // ADT_029
  YEAR_ADT_030: substring(data,170,4), // YEAR_ADT_030
  DESIGN_LOAD_031: substring(data,174,1), // DESIGN_LOAD_031
  APPR_WIDTH_MT_032: substring(data,175,4), // APPR_WIDTH_MT_032
  MEDIAN_CODE_033: substring(data,179,1), // MEDIAN_CODE_033
  DEGREES_SKEW_034: substring(data,180,2), // DEGREES_SKEW_034
  STRUCTURE_FLARED_035: substring(data,182,1), // STRUCTURE_FLARED_035
  
  RAILINGS_036A: substring(data,183,1), // RAILINGS_036A
  TRANSITIONS_036B: substring(data,184,1), // TRANSITIONS_036B
  APPR_RAIL_036C: substring(data,185,1), // APPR_RAIL_036C
  APPR_RAIL_END_036D: substring(data,186,1), // APPR_RAIL_END_036D
  HISTORY_037: substring(data,187,1), // HISTORY_037
  NAVIGATION_038: substring(data,188,1), // NAVIGATION_038
  NAV_VERT_CLR_MT_039: substring(data,189,4), // NAV_VERT_CLR_MT_039
  NAV_HORR_CLR_MT_040: substring(data,193,5), // NAV_HORR_CLR_MT_040
  OPEN_CLOSED_POSTED_041: substring(data,198,1), // OPEN_CLOSED_POSTED_041
  
  SERVICE_ON_042A: substring(data,199,1), // SERVICE_ON_042A
  SERVICE_UND_042B: substring(data,200,1), // SERVICE_UND_042B
  
  STRUCTURE_KIND_043A: substring(data,201,1), // STRUCTURE_KIND_043A
  STRUCTURE_TYPE_043B: substring(data,202,2), // STRUCTURE_TYPE_043B
  
  APPR_KIND_044A: substring(data,204,1), // APPR_KIND_044A
  APPR_TYPE_044B: substring(data,205,2), // APPR_TYPE_044B
  MAIN_UNIT_SPANS_045: substring(data,207,3), // MAIN_UNIT_SPANS_045
  APPR_SPANS_046: substring(data,210,4), // APPR_SPANS_046
  HORR_CLR_MT_047: substring(data,214,3), // HORR_CLR_MT_047
  MAX_SPAN_LEN_MT_048: substring(data,217,5), // MAX_SPAN_LEN_MT_048
  STRUCTURE_LEN_MT_049: substring(data,222,6), // STRUCTURE_LEN_MT_049
  
  LEFT_CURB_MT_050A: substring(data,228,3), // LEFT_CURB_MT_050A
  RIGHT_CURB_MT_050B: substring(data,231,3), // RIGHT_CURB_MT_050B
  ROADWAY_WIDTH_MT_051: substring(data,234,4), // ROADWAY_WIDTH_MT_051
  DECK_WIDTH_MT_052: substring(data,238,4), // DECK_WIDTH_MT_052
  VERT_CLR_OVER_MT_053: substring(data,242,4), // VERT_CLR_OVER_MT_053
  
  VERT_CLR_UND_REF_054A: substring(data,246,1), // VERT_CLR_UND_REF_054A
  VERT_CLR_UND_054B: substring(data,247,4), // VERT_CLR_UND_054B
  
  LAT_UND_REF_055A: substring(data,251,1), // LAT_UND_REF_055A
  LAT_UND_MT_055B: substring(data,252,3), // LAT_UND_MT_055B
  LEFT_LAT_UND_MT_056: substring(data,255,3), // LEFT_LAT_UND_MT_056
  DECK_COND_058: substring(data,258,1), // DECK_COND_058
  SUPERSTRUCTURE_COND_059: substring(data,259,1), // SUPERSTRUCTURE_COND_059
  SUBSTRUCTURE_COND_060: substring(data,260,1), // SUBSTRUCTURE_COND_060
  CHANNEL_COND_061: substring(data,261,1), // CHANNEL_COND_061
  CULVERT_COND_062: substring(data,262,1), // CULVERT_COND_062
  OPR_RATING_METH_063: substring(data,263,1), // OPR_RATING_METH_063
  OPERATING_RATING_064: substring(data,264,3), // OPERATING_RATING_064
  INV_RATING_METH_065: substring(data,267,1), // INV_RATING_METH_065
  INVENTORY_RATING_066: substring(data,268,3), // INVENTORY_RATING_066

  STRUCTURAL_EVAL_067: substring(data,271,1), // STRUCTURAL_EVAL_067
  DECK_GEOMETRY_EVAL_068: substring(data,272,1), // DECK_GEOMETRY_EVAL_068
  UNDCLRENCE_EVAL_069: substring(data,273,1), // UNDCLRENCE_EVAL_069
  POSTING_EVAL_070: substring(data,274,1), // POSTING_EVAL_070
  WATERWAY_EVAL_071: substring(data,275,1), // WATERWAY_EVAL_071
  APPR_ROAD_EVAL_072: substring(data,276,1), // APPR_ROAD_EVAL_072
  
  WORK_PROPOSED_075A: substring(data,277,2), // WORK_PROPOSED_075A
  WORK_DONE_BY_075B: substring(data,279,1), // WORK_DONE_BY_075B
  IMP_LEN_MT_076: substring(data,280,6), // IMP_LEN_MT_076
  DATE_OF_INSPECT_090: substring(data,286,4), // DATE_OF_INSPECT_090
  INSPECT_FREQ_MONTHS_091: substring(data,290,2), // INSPECT_FREQ_MONTHS_091
  
  FRACTURE_092A: substring(data,292,3), // FRACTURE_092A
  UNDWATER_LOOK_SEE_092B: substring(data,295,3), // UNDWATER_LOOK_SEE_092B
  SPEC_INSPECT_092C: substring(data,298,3), // SPEC_INSPECT_092C
  
  FRACTURE_LAST_DATE_093A: substring(data,301,4), // FRACTURE_LAST_DATE_093A
  UNDWATER_LAST_DATE_093B: substring(data,305,4), // UNDWATER_LAST_DATE_093B
  SPEC_LAST_DATE_093C: substring(data,309,4), // SPEC_LAST_DATE_093C
  BRIDGE_IMP_COST_094: substring(data,313,6), // BRIDGE_IMP_COST_094
  ROADWAY_IMP_COST_095: substring(data,319,6), // ROADWAY_IMP_COST_095
  TOTAL_IMP_COST_096: substring(data,325,6), // TOTAL_IMP_COST_096
  YEAR_OF_IMP_097: substring(data,331,4), // YEAR_OF_IMP_097
  
  OTHER_STATE_CODE_098A: substring(data,335,2), // OTHER_STATE_CODE_098A
  OTHER_STATE_PCNT_098B: substring(data,338,2), // OTHER_STATE_PCNT_098B
  OTHR_STATE_STRUC_NO_099: substring(data,340,15), // OTHR_STATE_STRUC_NO_099
  STRAHNET_HIGHWAY_100: substring(data,355,1), // STRAHNET_HIGHWAY_100
  PARALLEL_STRUCTURE_101: substring(data,356,1), // PARALLEL_STRUCTURE_101
  TRAFFIC_DIRECTION_102: substring(data,357,1), // TRAFFIC_DIRECTION_102
  TEMP_STRUCTURE_103: substring(data,358,1), // TEMP_STRUCTURE_103
  HIGHWAY_SYSTEM_104: substring(data,359,1), // HIGHWAY_SYSTEM_104
  FEDERAL_LANDS_105: substring(data,360,1), // FEDERAL_LANDS_105
  YEAR_RECONSTRUCTED_106: substring(data,361,4), // YEAR_RECONSTRUCTED_106
  DECK_STRUCTURE_TYPE_107: substring(data,365,1), // DECK_STRUCTURE_TYPE_107
  
  SURFACE_TYPE_108A: substring(data,366,1), // SURFACE_TYPE_108A
  MEMBRANE_TYPE_108B: substring(data,367,1), // MEMBRANE_TYPE_108B
  DECK_PROTECTION_108C: substring(data,368,1), // DECK_PROTECTION_108C
  PERCENT_ADT_TRUCK_109: substring(data,369,2), // PERCENT_ADT_TRUCK_109
  NATIONAL_NETWORK_110: substring(data,371,1), // NATIONAL_NETWORK_110
  PIER_PROTECTION_111: substring(data,372,1), // PIER_PROTECTION_111
  BRIDGE_LEN_IND_112: substring(data,373,1), // BRIDGE_LEN_IND_112
  SCOUR_CRITICAL_113: substring(data,374,1), // SCOUR_CRITICAL_113
  FUTURE_ADT_114: substring(data,375,6), // FUTURE_ADT_114
  YEAR_OF_FUTURE_ADT_115: substring(data,381,4), // YEAR_OF_FUTURE_ADT_115
  MIN_NAV_CLR_MT_116: substring(data,385,4), // MIN_NAV_CLR_MT_116
  FED_AGENCY: substring(data,389,44), // FED_AGENCY
  DATE_LAST_UPDATE: substring(data,433,1), // DATE_LAST_UPDATE
  TYPE_LAST_UPDATE: substring(data,434,1), // TYPE_LAST_UPDATE
  DEDUCT_CODE: substring(data,435,10) // DEDUCT_CODE
} AS record
SET ndr += record
',
{batchSize:10000,parallel:false}) YIELD batches, total
RETURN batches, total


CALL apoc.periodic.commit('
MATCH (ndr:NoDelimiterRow)
WHERE ndr.STATE_CODE_001 IS NULL
with ndr, ndr.data AS data LIMIT {limit}
WITH ndr, {
  STATE_CODE_001: substring(data,0,2), // STATE_CODE_001
// Not sure what to do with this
STRUCTURE_NUMBER_008: substring(data,3,15), // STRUCTURE_NUMBER_008

RECORD_TYPE_005A: substring(data,18,1), // RECORD_TYPE_005A
ROUTE_PREFIX_005B: substring(data,19,1), // ROUTE_PREFIX_005B
SERVICE_LEVEL_005C: substring(data,20,1), // SERVICE_LEVEL_005C
ROUTE_NUMBER_005D: substring(data,21,5), // ROUTE_NUMBER_005D
DIRECTION_005E: substring(data,26,1), // DIRECTION_005E
HIGHWAY_DISTRICT_002: substring(data,27,2), // HIGHWAY_DISTRICT_002
COUNTY_CODE_003: substring(data,29,3), // COUNTY_CODE_003
PLACE_CODE_004: substring(data,32,5), // PLACE_CODE_004

FEATURES_DESC_006A: substring(data,37,24), // FEATURES_DESC_006A
CRITICAL_FACILITY_006B: substring(data,61,1), // CRITICAL_FACILITY_006B
FACILITY_CARRIED_007: substring(data,62,18), // FACILITY_CARRIED_007
LOCATION_009: substring(data,80,25), // LOCATION_009
MIN_VERT_CLR_010: substring(data,105,4), // MIN_VERT_CLR_010
KILOPOINT_011: substring(data,109,7), // KILOPOINT_011
BASE_HWY_NETWORK_012: substring(data,116,1), // BASE_HWY_NETWORK_012

LRS_INV_ROUTE_013A: substring(data,117,10), // LRS_INV_ROUTE_013A
SUBROUTE_NO_013B: substring(data,127,2), // SUBROUTE_NO_013B
LAT_016: substring(data,129,8), // LAT_016
LONG_017: substring(data,137,9), // LONG_017
DETOUR_KILOS_019: substring(data,146,3), // DETOUR_KILOS_019
TOLL_020: substring(data,149,1), // TOLL_020
MAINTENANCE_021: substring(data,150,2), // MAINTENANCE_021
OWNER_022: substring(data,152,2), // OWNER_022
FUNCTIONAL_CLASS_026: substring(data,154,2), // FUNCTIONAL_CLASS_026
YEAR_BUILT_027: substring(data,156,4), // YEAR_BUILT_027

TRAFFIC_LANES_ON_028A: substring(data,160,2), // TRAFFIC_LANES_ON_028A
TRAFFIC_LANES_UND_028B: substring(data,162,2), // TRAFFIC_LANES_UND_028B
ADT_029: substring(data,164,6), // ADT_029
YEAR_ADT_030: substring(data,170,4), // YEAR_ADT_030
DESIGN_LOAD_031: substring(data,174,1), // DESIGN_LOAD_031
APPR_WIDTH_MT_032: substring(data,175,4), // APPR_WIDTH_MT_032
MEDIAN_CODE_033: substring(data,179,1), // MEDIAN_CODE_033
DEGREES_SKEW_034: substring(data,180,2), // DEGREES_SKEW_034
STRUCTURE_FLARED_035: substring(data,182,1), // STRUCTURE_FLARED_035

RAILINGS_036A: substring(data,183,1), // RAILINGS_036A
TRANSITIONS_036B: substring(data,184,1), // TRANSITIONS_036B
APPR_RAIL_036C: substring(data,185,1), // APPR_RAIL_036C
APPR_RAIL_END_036D: substring(data,186,1), // APPR_RAIL_END_036D
HISTORY_037: substring(data,187,1), // HISTORY_037
NAVIGATION_038: substring(data,188,1), // NAVIGATION_038
NAV_VERT_CLR_MT_039: substring(data,189,4), // NAV_VERT_CLR_MT_039
NAV_HORR_CLR_MT_040: substring(data,193,5), // NAV_HORR_CLR_MT_040
OPEN_CLOSED_POSTED_041: substring(data,198,1), // OPEN_CLOSED_POSTED_041

SERVICE_ON_042A: substring(data,199,1), // SERVICE_ON_042A
SERVICE_UND_042B: substring(data,200,1), // SERVICE_UND_042B

STRUCTURE_KIND_043A: substring(data,201,1), // STRUCTURE_KIND_043A
STRUCTURE_TYPE_043B: substring(data,202,2), // STRUCTURE_TYPE_043B

APPR_KIND_044A: substring(data,204,1), // APPR_KIND_044A
APPR_TYPE_044B: substring(data,205,2), // APPR_TYPE_044B
MAIN_UNIT_SPANS_045: substring(data,207,3), // MAIN_UNIT_SPANS_045
APPR_SPANS_046: substring(data,210,4), // APPR_SPANS_046
HORR_CLR_MT_047: substring(data,214,3), // HORR_CLR_MT_047
MAX_SPAN_LEN_MT_048: substring(data,217,5), // MAX_SPAN_LEN_MT_048
STRUCTURE_LEN_MT_049: substring(data,222,6), // STRUCTURE_LEN_MT_049

LEFT_CURB_MT_050A: substring(data,228,3), // LEFT_CURB_MT_050A
RIGHT_CURB_MT_050B: substring(data,231,3), // RIGHT_CURB_MT_050B
ROADWAY_WIDTH_MT_051: substring(data,234,4), // ROADWAY_WIDTH_MT_051
DECK_WIDTH_MT_052: substring(data,238,4), // DECK_WIDTH_MT_052
VERT_CLR_OVER_MT_053: substring(data,242,4), // VERT_CLR_OVER_MT_053

VERT_CLR_UND_REF_054A: substring(data,246,1), // VERT_CLR_UND_REF_054A
VERT_CLR_UND_054B: substring(data,247,4), // VERT_CLR_UND_054B

LAT_UND_REF_055A: substring(data,251,1), // LAT_UND_REF_055A
LAT_UND_MT_055B: substring(data,252,3), // LAT_UND_MT_055B
LEFT_LAT_UND_MT_056: substring(data,255,3), // LEFT_LAT_UND_MT_056
DECK_COND_058: substring(data,258,1), // DECK_COND_058
SUPERSTRUCTURE_COND_059: substring(data,259,1), // SUPERSTRUCTURE_COND_059
SUBSTRUCTURE_COND_060: substring(data,260,1), // SUBSTRUCTURE_COND_060
CHANNEL_COND_061: substring(data,261,1), // CHANNEL_COND_061
CULVERT_COND_062: substring(data,262,1), // CULVERT_COND_062
OPR_RATING_METH_063: substring(data,263,1), // OPR_RATING_METH_063
OPERATING_RATING_064: substring(data,264,3), // OPERATING_RATING_064
INV_RATING_METH_065: substring(data,267,1), // INV_RATING_METH_065
INVENTORY_RATING_066: substring(data,268,3), // INVENTORY_RATING_066
STRUCTURAL_EVAL_067: substring(data,271,1), // STRUCTURAL_EVAL_067
DECK_GEOMETRY_EVAL_068: substring(data,272,1), // DECK_GEOMETRY_EVAL_068
UNDCLRENCE_EVAL_069: substring(data,273,1), // UNDCLRENCE_EVAL_069
POSTING_EVAL_070: substring(data,274,1), // POSTING_EVAL_070
WATERWAY_EVAL_071: substring(data,275,1), // WATERWAY_EVAL_071
APPR_ROAD_EVAL_072: substring(data,276,1), // APPR_ROAD_EVAL_072

WORK_PROPOSED_075A: substring(data,277,2), // WORK_PROPOSED_075A
WORK_DONE_BY_075B: substring(data,279,1), // WORK_DONE_BY_075B
IMP_LEN_MT_076: substring(data,280,6), // IMP_LEN_MT_076
DATE_OF_INSPECT_090: substring(data,286,4), // DATE_OF_INSPECT_090
INSPECT_FREQ_MONTHS_091: substring(data,290,2), // INSPECT_FREQ_MONTHS_091

FRACTURE_092A: substring(data,292,3), // FRACTURE_092A
UNDWATER_LOOK_SEE_092B: substring(data,295,3), // UNDWATER_LOOK_SEE_092B
SPEC_INSPECT_092C: substring(data,298,3), // SPEC_INSPECT_092C

FRACTURE_LAST_DATE_093A: substring(data,301,4), // FRACTURE_LAST_DATE_093A
UNDWATER_LAST_DATE_093B: substring(data,305,4), // UNDWATER_LAST_DATE_093B
SPEC_LAST_DATE_093C: substring(data,309,4), // SPEC_LAST_DATE_093C
BRIDGE_IMP_COST_094: substring(data,313,6), // BRIDGE_IMP_COST_094
ROADWAY_IMP_COST_095: substring(data,319,6), // ROADWAY_IMP_COST_095
TOTAL_IMP_COST_096: substring(data,325,6), // TOTAL_IMP_COST_096
YEAR_OF_IMP_097: substring(data,331,4), // YEAR_OF_IMP_097

OTHER_STATE_CODE_098A: substring(data,335,2), // OTHER_STATE_CODE_098A
OTHER_STATE_PCNT_098B: substring(data,338,2), // OTHER_STATE_PCNT_098B
OTHR_STATE_STRUC_NO_099: substring(data,340,15), // OTHR_STATE_STRUC_NO_099
STRAHNET_HIGHWAY_100: substring(data,355,1), // STRAHNET_HIGHWAY_100
PARALLEL_STRUCTURE_101: substring(data,356,1), // PARALLEL_STRUCTURE_101
TRAFFIC_DIRECTION_102: substring(data,357,1), // TRAFFIC_DIRECTION_102
TEMP_STRUCTURE_103: substring(data,358,1), // TEMP_STRUCTURE_103
HIGHWAY_SYSTEM_104: substring(data,359,1), // HIGHWAY_SYSTEM_104
FEDERAL_LANDS_105: substring(data,360,1), // FEDERAL_LANDS_105
YEAR_RECONSTRUCTED_106: substring(data,361,4), // YEAR_RECONSTRUCTED_106
DECK_STRUCTURE_TYPE_107: substring(data,365,1), // DECK_STRUCTURE_TYPE_107

SURFACE_TYPE_108A: substring(data,366,1), // SURFACE_TYPE_108A
MEMBRANE_TYPE_108B: substring(data,367,1), // MEMBRANE_TYPE_108B
DECK_PROTECTION_108C: substring(data,368,1), // DECK_PROTECTION_108C
PERCENT_ADT_TRUCK_109: substring(data,369,2), // PERCENT_ADT_TRUCK_109
NATIONAL_NETWORK_110: substring(data,371,1), // NATIONAL_NETWORK_110
PIER_PROTECTION_111: substring(data,372,1), // PIER_PROTECTION_111
BRIDGE_LEN_IND_112: substring(data,373,1), // BRIDGE_LEN_IND_112
SCOUR_CRITICAL_113: substring(data,374,1), // SCOUR_CRITICAL_113
FUTURE_ADT_114: substring(data,375,6), // FUTURE_ADT_114
YEAR_OF_FUTURE_ADT_115: substring(data,381,4), // YEAR_OF_FUTURE_ADT_115
MIN_NAV_CLR_MT_116: substring(data,385,4), // MIN_NAV_CLR_MT_116
FED_AGENCY: substring(data,389,44), // FED_AGENCY
DATE_LAST_UPDATE: substring(data,433,1), // DATE_LAST_UPDATE
TYPE_LAST_UPDATE: substring(data,434,1), // TYPE_LAST_UPDATE
DEDUCT_CODE: substring(data,435,10) // DEDUCT_CODE
} AS record
SET ndr += record
'
,{limit:10000})
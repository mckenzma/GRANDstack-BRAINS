/////////////////////////////////////////////////////////////////////////////////
// This file represets all of the import queries to construct the graph database
// To build a copy of this, these should be completed in order as listed below
/////////////////////////////////////////////////////////////////////////////////

// Create nodes for each file URL (Delimited Files)
// Data loaded from https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm via define URLs stored in Google Sheet
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A/export?format=csv&id=1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A&gid=1318941318" AS row
WITH row
WHERE NOT row.Year IS NULL
//AND row.Import = "Yes"
WITH row, row.URL AS fileUrl
MERGE (file:File:DelimitedFile {url: fileUrl})
ON CREATE SET file.url = fileUrl,
              file.folder = row.Folder,
              file.name = row.File,
              file.year = toInteger(row.Year),
              file.createdOn = timestamp()

// Create nodes for each file URL (No Delimiter)
// Data loaded from https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm via define URLs stored in Google Sheet
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/14k9QoWIO1N-eRRDxslZxTY24OWSFbpGCVnAWGVnZxJ4/export?format=csv&id=14k9QoWIO1N-eRRDxslZxTY24OWSFbpGCVnAWGVnZxJ4&gid=1318941318" AS row
WITH row
WHERE NOT row.Year IS NULL
WITH row, row.URL AS fileUrl
MERGE (file:File:NoDelimiterFile {url: fileUrl})
ON CREATE SET file.url = fileUrl,
              file.folder = row.Folder,
              file.name = row.File,
              file.year = toInteger(row.Year),
              file.createdOn = timestamp()

// Iterate through files and import rows (Delimited)
MATCH (file:DelimitedFile)
WHERE NOT (file)-[:CONTAINS]->(:DelimitedRow)
WITH collect(file.url) AS fileURLs
UNWIND fileURLs AS fileURL
CALL apoc.periodic.iterate(
'
CALL apoc.load.csv($url,{header:true,quoteChar:"\u0000"}) YIELD map AS row
RETURN row
','
CREATE (fileRow:Row:DelimitedRow {createdOn: date()})
SET fileRow += row,
fileRow.url = $url,
fileRow.createdOn = date()
',
{batchSize:10000,parallel:false,params:{url:fileURL}}) YIELD batches, total
RETURN batches, total

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



// Connect rows to files (Delimited)
CALL apoc.periodic.iterate(
'
MATCH (row:DelimitedRow)
WHERE NOT (row)<-[:CONTAINS]-()
RETURN row
','
MATCH (file:DelimitedFile)
WHERE file.url = row.url
MERGE (file)-[:CONTAINS]->(row)
',
{batchSize:10000,parallel:false}) YIELD batches, total
RETURN batches, total

// Connect rows to files (No Delimiter)
CALL apoc.periodic.iterate(
'
MATCH (row:NoDelimiterRow)
WHERE NOT (row)<-[:CONTAINS]-()
RETURN row
','
MATCH (file:NoDelimiterFile)
WHERE file.url = row.url
MERGE (file)-[:CONTAINS]->(row)
',
{batchSize:10000,parallel:false}) YIELD batches, total
RETURN batches, total

// Create state node and connect to file
CALL apoc.periodic.iterate(
'
MATCH (file:File)
WHERE NOT (file)-[:FILE_FOR]->()
RETURN file
','
MATCH (file)-[:CONTAINS]->(row)
WITH file, row LIMIT 1
MERGE (state:State {code: row.STATE_CODE_001})
ON CREATE SET state.createdOn = date()
WITH file, state
MERGE (file)-[:FILE_FOR]->(state)
',
{batchSize:1, parallel:false}) YIELD batches, total
RETURN batches, total

// Connect files per state in order by year
// TO DO - Delimiter and NO Delimiter Files shoudl each have their own string
// TO DO - Need to connect delimieter/no delimeter files of same year
MATCH (state:State)
WITH collect(state) AS states
UNWIND states AS state
MATCH (state)<-[:FILE_FOR]-(file)
WITH state, file ORDER BY file.year ASC // ascending order
WITH state, collect(file) AS orderedFiles
UNWIND range(0,size(orderedFiles)-2) AS i
WITH orderedFiles[i] AS start, orderedFiles[i+1] AS end
MERGE (start)-[:NEXT_FILE]->(end)

// Create (:State)<--(:County)<--(:Place)
CALL apoc.periodic.iterate(
'
MATCH (row:NoDelimiterRow)
//WHERE NOT (row)-[:DATA_FOR]->()
RETURN row
','
WITH DISTINCT row.STATE_CODE_001 AS stateCode, 
        row.COUNTY_CODE_003 AS countyCode,
              row.PLACE_CODE_004 AS placeCode
MATCH (state:State {code: stateCode})
MERGE (state)<-[:OF_STATE]-(county:County {code: countyCode})
MERGE (county)<-[:OF_COUNTY]-(place:Place {code: placeCode})
ON CREATE SET county.createdOn = date(),
        place.createdOn = date()
',
{batchSize:10000,parallel:false})

// Create constraint & node key
CREATE CONSTRAINT ON (bridge:Bridge) ASSERT (bridge.state_code, bridge.county_code, bridge.place_code, bridge.code) IS NODE KEY

// create/merge bridge
CALL apoc.periodic.iterate(
'
MATCH (row:NoDelimiterRow)
WHERE NOT (row)-[:DATA_FOR]->()
RETURN row
','
WITH DISTINCT row.STATE_CODE_001 AS stateCode, 
     row.COUNTY_CODE_003 AS countyCode,
     row.PLACE_CODE_004 AS placeCode,
     coalesce(apoc.text.replace(trim(row.STRUCTURE_NUMBER_008), "^0*", ""),row.STRUCTURE_NUMBER_008) AS bridgeCode
MERGE (bridge:Bridge {state_code: stateCode, 
                      county_code: countyCode, 
                      place_code: placeCode, 
                      code: bridgeCode})
ON CREATE SET bridge.createdOn = datetime()
//CREATE (row)-[:DATA_FOR]->(bridge)
',
{batchSize:10000,parallel:false})

// Connect bridge to row
CALL apoc.periodic.iterate(
'
MATCH (row:NoDelimiterRow)
WHERE NOT (row)-[:DATA_FOR]->()
RETURN row
','
WITH row,
row.STATE_CODE_001 AS stateCode, 
     row.COUNTY_CODE_003 AS countyCode,
     row.PLACE_CODE_004 AS placeCode,
    coalesce(apoc.text.replace(trim(row.STRUCTURE_NUMBER_008), "^0*", ""),row.STRUCTURE_NUMBER_008) AS bridgeCode
MATCH (bridge:Bridge {state_code: stateCode, 
                      county_code: countyCode, 
                      place_code: placeCode, 
                      code: bridgeCode})
CREATE (row)-[:DATA_FOR]->(bridge)
',
{batchSize:10000,parallel:false})

// Connect bridge to place
// connect bridge to existing (State)<--(County)<--(Place) tree
CALL apoc.periodic.iterate(
'
MATCH (bridge:Bridge)
WHERE NOT (bridge)-[:OF_PLACE]->()
RETURN bridge
','
MATCH (state:State {code: bridge.state_code})
    <-[:OF_STATE]-(county:County {code: bridge.county_code})
      <-[:OF_COUNTY]-(place:Place {code: bridge.place_code})
WITH place, bridge
CREATE (bridge)-[:OF_PLACE]->(place)
',
{batchSize:10000,parallel:false}) YIELD batches, total
RETURN batches, total


// Connect rows per bridge in order by year
CALL apoc.periodic.iterate(
'
MATCH (bridge:Bridge)
RETURN bridge
','
MATCH (bridge)<-[:DATA_FOR]-(row)<-[:CONTAINS]-(file)
WITH bridge, row ORDER BY file.year ASC // ascending order
WITH bridge, collect(row) AS orderedRows
UNWIND range(0,size(orderedRows)-2) AS i
WITH orderedRows[i] AS start, orderedRows[i+1] AS end
MERGE (start)-[:NEXT_RECORD]->(end)
',
{batchSize:10000,parallel:false}) YIELD batches, total
RETURN batches, total


// Create Location Audit Log
CALL apoc.periodic.iterate(
'
MATCH (bridge:Bridge)
OPTIONAL MATCH (bridge)-[:LATEST_LOCATION_LOG]->(al)
WITH bridge, coalesce(al.year,0) AS year
MATCH (bridge)<-[:DATA_FOR]-(row:Row)<-[:CONTAINS]-(file:File)
WHERE file.year > year
RETURN bridge, row, file.year AS fYear
ORDER BY fYear
','
CREATE (newAL:AuditLog:LocationLog)
SET newAL.latRaw = row.LAT_016,
    newAL.longRaw = row.LONG_017,
    newAL.year = fYear
// switched up bridge alias here because to lazy to change code
WITH bridge AS b, collect(newAL) AS items
WITH b, items, items[0] AS al
// going to possibly need this rel and old one
OPTIONAL MATCH (b)-[r:LATEST_LOCATION_LOG]->(ol) WHERE ol <> al
// go ahead and create the new latest
CREATE (b)-[:LATEST_LOCATION_LOG]->(al)
// ugly foreach hack to find singleton items where there was an old one that needs deleting
FOREACH (al IN CASE WHEN r IS NOT NULL AND size(items) = 1 THEN items ELSE [] END |
DELETE r CREATE (al)-[:PREV_LOCATION_LOG]->(ol)
)
// now to handle bridges with more than one new log
WITH r, ol, b, items
WHERE size(items) > 1
// create a chain (first entry linked to bridge already above)
UNWIND range(0, size(items) - 2) AS idx
WITH r, ol,b, items, items[idx] AS new, items[idx + 1] AS old
CREATE (new)-[:PREV_LOCATION_LOG]->(old)
// distinct back down and find the last
WITH DISTINCT r, ol,b, items
WITH r, ol,b, items[size(items) - 1] AS lastAL
WHERE r IS NOT NULL
DELETE r 
CREATE (lastAL)-[:PREV_LOCATION_LOG]->(ol)
',
{batchSize:5000,parallel:false})

// this is a temp query to allow GRANDstack app to function while figuring out additional ways to handle location logs
// Convert raw  latitude, longitude data to decimals
// Convert Latitude and Longitude from initial import to point (spatial)
CALL apoc.periodic.iterate('
MATCH (locLog:LocationLog)
WHERE locLog.latitude_decimal IS NULL 
OR locLog.longitude_decimal IS NULL
RETURN locLog
','
WITH locLog,
     toFloat(left(locLog.latRaw, 2)) + toFloat(substring(locLog.latRaw,2,2))/60 + toFloat(right(locLog.latRaw,4))/100/3600 AS latitude_decimal,
     size(locLog.longRaw) AS long_size
WITH locLog,
     latitude_decimal,
     CASE long_size
        WHEN 8 THEN -1 * ( toFloat(left(locLog.longRaw, 2)) + toFloat(substring(locLog.longRaw,2,2))/60 + toFloat(right(locLog.longRaw,4))/100/3600 )
        WHEN 9 THEN -1 * ( toFloat(left(locLog.longRaw, 3)) + toFloat(substring(locLog.longRaw,3,2))/60 + toFloat(right(locLog.longRaw,4))/100/3600 )
     END AS longitude_decimal
SET locLog.location = point({ longitude: longitude_decimal, latitude: latitude_decimal }),
    locLog.longitude_decimal = longitude_decimal,
    locLog.latitude_decimal = latitude_decimal
',
{batchSize:10000, parallel:false})


// Calculate distances between each LocationLog point
// at some point possibly move distance value to relationship between logs
CALL apoc.periodic.iterate(
'
MATCH (log:LocationLog)
//WHERE log.distance IS NULL
//AND (log)-[:PREV_LOCATION_LOG]->()
WHERE (log)-[:PREV_LOCATION_LOG]->()
RETURN log
','
MATCH (log)-[:PREV_LOCATION_LOG]->(prevLog)
WITH log, distance(log.location,prevLog.location) AS dist
SET log.distance = dist
',
{batchSize:5000,parallel:false})



// Create Inspection Audit Log
CALL apoc.periodic.iterate(
'
MATCH (bridge:Bridge)
OPTIONAL MATCH (bridge)-[:LATEST_INSPECTION_LOG]->(al)
WITH bridge, coalesce(al.year,0) AS year
MATCH (bridge)<-[:DATA_FOR]-(row:Row)<-[:CONTAINS]-(file:File)
WHERE file.year > year
RETURN bridge, row, file.year AS fYear
ORDER BY fYear
','
CREATE (newAL:AuditLog:InspectionLog)
SET newAL.STRUCTURAL_EVAL_067 = row.STRUCTURAL_EVAL_067,
    newAL.DECK_GEOMETRY_EVAL_068 = row.DECK_GEOMETRY_EVAL_068,
    newAL.UNDCLRENCE_EVAL_069 = row.UNDCLRENCE_EVAL_069,
    newAL.POSTING_EVAL_070 = row.POSTING_EVAL_070,
    newAL.WATERWAY_EVAL_071 = row.WATERWAY_EVAL_071,
    newAL.APPR_ROAD_EVAL_072 = row.APPR_ROAD_EVAL_072,
    newAL.year = fYear
// switched up bridge alias because too lazy to change code
WITH bridge AS b, collect(newAL) AS items
WITH b, items, items[0] AS al
// going to possibly need this rel and old one
OPTIONAL MATCH (b)-[r:LATEST_INSPECTION_LOG]->(ol) WHERE ol <> al
// go ahead and create new LATEST_INSPECTION_LOG
CREATE (b)-[:LATEST_INSPECTION_LOG]->(al)
// ugly foreach hack to find singleton items where there was an old one that needs deleting
FOREACH (al IN CASE WHEN r IS NOT NULL AND size(items) = 1 THEN items ELSE [] END |
DELETE r CREATE (al)-[:PREV_INSPECTION_LOG]->(ol)
)
// now to handle bridges with more than one new log
WITH r, ol, b, items
WHERE size(items) > 1
// Create a chain (first entry linked to bridge already above)
UNWIND range(0, size(items) - 2) AS idx
WITH r, ol, b, items, items[idx] AS new, items[idx + 1] AS old
CREATE (new)-[:PREV_INSPECTION_LOG]->(old)
// distinct back down and find the last
WITH DISTINCT r, ol, b, items
WITH r, ol, b, items[size(items) - 1] AS lastAL
WHERE r IS NOT NULL
DELETE r
CREATE (lastAL)-[:PREV_INSPECTION_LOG]->(ol)
',
{batchSize:5000,parallel:false})




////////////////////////////////////////
// WIP for connecting shared bridges and a few things
////////////////////////////////////////
// detach delete bridges for not
CALL apoc.periodic.iterate(
'
MATCH (bridge:Bridge)
RETURN bridge
','
DETACH DELETE bridge
',
{batchSize:10000,parallel:false})







// Connect bridges directly to state (temporary while we navigate the place/county/bridge "duplicates")
//CALL apoc.periodic.iterate(
//'
//MATCH (bridge:Bridge)
//WHERE NOT (bridge)-[:LOCATED_IN]->()
//RETURN bridge
//','
//MATCH (state:State)
//WHERE state.code = bridge.state_code
//CREATE (bridge)-[:LOCATED_IN]->(state)
//',
//{batchSize:10000,parallel:false})

// connect "shared" bridge
// re-write to improve connection between bridges
CALL apoc.periodic.iterate(
'
MATCH (row:Row)
WHERE NOT row.OTHER_STATE_CODE_098A = ""
AND NOT row.OTHR_STATE_STRUC_NO_099 = ""
MATCH (row)-[:DATA_FOR]->(bridge)
RETURN bridge, row
','
MATCH (adj_bridge:Bridge {state_code: left(row.OTHER_STATE_CODE_098A,2),
              bridge_code: row.OTHR_STATE_STRUC_NO_099 })
MERGE (bridge)-[:SHARED_BRIDGE]->(adj_bridge)
',
{batchSize:10000})

// showing connected bridges
MATCH p=(s1)<-[:LOCATED_IN]-(b1)-[r:SHARED_BRIDGE]->(b2)-[:LOCATED_IN]->(s2) RETURN p LIMIT 25

// starting to look at percent responsibility for shared bridges
MATCH (s1)<-[:LOCATED_IN]-(b1)-[:SHARED_BRIDGE]-(b2)-[:LOCATED_IN]->(s2),
    (b1)<-[:DATA_FOR]-(row1), 
      (b2)<-[:DATA_FOR]-(row2)
RETURN s1.name AS S1,
     b1.bridge_code AS B1,
       row2.OTHER_STATE_PCNT_098B AS B1_PCNT,
       labels(row2) AS labels2,
       [collect(DISTINCT row2.OTHER_STATE_PCNT_098B), collect(DISTINCT row1.OTHER_STATE_PCNT_098B)] AS PCNT_Pairs,
       s2.name AS S2,
       b2.bridge_code AS B2,
       row1.OTHER_STATE_PCNT_098B AS B2_PCNT,
       labels(row1) AS labels1

////////////////////////////////////////
////////////////////////////////////////

// WIP
// Creating Location Audit Log records
MATCH (b:Bridge)
//WHERE NOT (b)-[:LATEST_LOCATION_LOG]->()
WITH b limit 1
MATCH (b)<-[:DATA_FOR]-(ndr:NoDelimiterRow)<-[:CONTAINS]-(f:File)
WITH b, [ndr.LAT_016,ndr.LONG_017] AS point, f.year AS year ORDER BY year ASC
WITH b, collect([point,year]) AS records
UNWIND records AS record
OPTIONAL MATCH (b)-[r:LATEST_LOCATION_LOG]->(prev:AuditLog_Location)
DELETE r
WITH b, ndr, f, prev
MERGE (b)-[:LATEST_LOCATION_LOG]->(new:AuditLog_Location)
ON CREATE SET new.year = f.year,
        new.pointRaw = [ndr.LAT_016, ndr.LONG_017]
WITH new, prev
WHERE NOT prev IS NULL
MERGE (new)-[:PREVIOUS]->(prev)

// Add row count for files
// will use this for tracking failed row imports
// maybe increase batchSize for faster run?
CALL apoc.periodic.iterate(
'
MATCH (file:File)
WHERE NOT exists(file.rowCount)
RETURN file
','
LOAD CSV WITH HEADERS FROM file.url AS row
WITH file, count(row) AS rowCount
SET file.rowCount = rowCount
',
{batchSize:10,parallel:false}) YIELD batches, total
RETURN batches, total

// Add row sizes for files
CALL apoc.periodic.iterate(
'
MATCH (file:File)
WHERE NOT exists(file.rowSize)
RETURN file
','
CALL apoc.load.csv(file.url,{header:true}) YIELD list AS list
WITH file, size(list) AS rowSize
WITH file, collect(DISTINCT rowSize) AS rowSizes
SET file.rowSize = rowSizes
',
{batchSize:10,parallel:false}) YIELD batches, total
RETURN batches, total


//CREATE CONSTRAINT ON (fileRow:Row) ASSERT (fileRow.fileURL, fileRow.STRUCTURE_NUMBER_008) IS NODE KEY;

// Load CSVs from (:File) nodes and create (:Row) nodes
MATCH (file:File)
WHERE NOT (file)-[:CONTAINS]->(:Row)
WITH collect(file.url) AS fileURLs
UNWIND fileURLs AS fileURL
CALL apoc.periodic.iterate(
'
LOAD CSV WITH HEADERS FROM $url AS row
RETURN row
','
MERGE (fileRow:Row {fileURl: $url, STRUCTURE_NUMBER_008: row.STRUCTURE_NUMBER_008})
ON CREATE SET fileRow.fileURL = $url,
              fileRow.STRUCTURE_NUMBER_008 = row.STRUCTURE_NUMBER_008,
              fileRow.createdOn = timestamp()
',
{batchSize:10000,parellel:false,params:{url:fileURL}}) YIELD batches, total
RETURN batches, total

// Connect (:File)-[:CONTAINS]->(:Row)
MATCH (file:File)
WHERE NOT 


// Create States
// Data loaded from https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm via define URLs stored in Google Sheet
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A/export?format=csv&id=1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A&gid=1318941318" AS row1
// Data loaded from files downloaded at https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm and stored in the "import" folder for the database instance
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY/export?format=csv&id=1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY&gid=749188439" AS row1
WITH CASE
  WHEN NOT row1.Year IS NULL THEN collect(row1.URL)
    END AS fileURLs
UNWIND fileURLs as fileURL
CALL apoc.periodic.iterate(
'
LOAD CSV WITH HEADERS FROM $url AS row RETURN row

','
MERGE (state:State {code: row.STATE_CODE_001})
ON CREATE SET state.code = row.STATE_CODE_001 
',
{batchSize:10000, parallel:false, params:{url:fileURL}}) YIELD batches, total
RETURN batches, total

// Update State properties
MATCH (state:State)
SET state.abbreviation = 
      CASE state.code
        WHEN "01" THEN "AL"
          WHEN "02" THEN "AK"
          //WHEN "03" THEN "" //this is not referenced. kept for numeric continuity
          WHEN "04" THEN "AZ"
          WHEN "05" THEN "AR"
          WHEN "06" THEN "CA"
          //WHEN "07" THEN "" //this is not referenced. kept for numeric continuity
          WHEN "08" THEN "CO"
          WHEN "09" THEN "CT"
          WHEN "10" THEN "DE"
          WHEN "11" THEN "DC"
          WHEN "12" THEN "FL"
          WHEN "13" THEN "GA"
          //WHEN "14" THEN "" //this is not referenced. kept for numeric continuity
          WHEN "15" THEN "HI"
          WHEN "16" THEN "ID"
          WHEN "17" THEN "IL"
          WHEN "18" THEN "IN"
          WHEN "19" THEN "IA"
          WHEN "20" THEN "KS"
          WHEN "21" THEN "KY"
          WHEN "22" THEN "LA"
          WHEN "23" THEN "ME"
          WHEN "24" THEN "MD"
          WHEN "25" THEN "MA"
          WHEN "26" THEN "MI"
          WHEN "27" THEN "MN"
          WHEN "28" THEN "MS"
          WHEN "29" THEN "MO"
          WHEN "30" THEN "MT"
          WHEN "31" THEN "NE"
          WHEN "32" THEN "NV"
          WHEN "33" THEN "NH"
          WHEN "34" THEN "NJ"
          WHEN "35" THEN "NM"
          WHEN "36" THEN "NY"
          WHEN "37" THEN "NC"
          WHEN "38" THEN "ND"
          WHEN "39" THEN "OH"
          WHEN "40" THEN "OK"
          WHEN "41" THEN "OR"
          WHEN "42" THEN "PA"
          //WHEN "43" THEN "" //this is not referenced. kept for numeric continuity
          WHEN "44" THEN "RI"
          WHEN "45" THEN "SC"
          WHEN "46" THEN "SD"
          WHEN "47" THEN "TN"
          WHEN "48" THEN "TX"
          WHEN "49" THEN "UT"
          WHEN "50" THEN "VT"
          WHEN "51" THEN "VA"
          WHEN "53" THEN "WA"
          WHEN "54" THEN "WV"
          WHEN "55" THEN "WI"
          WHEN "56" THEN "WY"
          WHEN "72" THEN "PR"
      END,
      state.name = 
      CASE state.code
      //need to incorporate longer state names
        WHEN "01" THEN "Alabama"
          WHEN "02" THEN "Alaska"
          //WHEN "03" THEN "" //this is not referenced. kept for numeric continuity
          WHEN "04" THEN "Arizona"
          WHEN "05" THEN "Arkansas"
          WHEN "06" THEN "California"
          //WHEN "07" THEN "" //this is not referenced. kept for numeric continuity
          WHEN "08" THEN "Colorado"
          WHEN "09" THEN "Connecticut"
          WHEN "10" THEN "Deleware"
          WHEN "11" THEN "District of Columbia"
          WHEN "12" THEN "Florida"
          WHEN "13" THEN "Georgia"
          //WHEN "14" THEN "" //this is not referenced. kept for numeric continuity
          WHEN "15" THEN "Hawaii"
          WHEN "16" THEN "Idaho"
          WHEN "17" THEN "Illinois"
          WHEN "18" THEN "Indiana"
          WHEN "19" THEN "Iowa"
          WHEN "20" THEN "Kansas"
          WHEN "21" THEN "Kentucky"
          WHEN "22" THEN "Louisianna"
          WHEN "23" THEN "Maine"
          WHEN "24" THEN "Maryland"
          WHEN "25" THEN "Massachusetts"
          WHEN "26" THEN "Michigan"
          WHEN "27" THEN "Minnesota"
          WHEN "28" THEN "Mississippi"
          WHEN "29" THEN "Missouri"
          WHEN "30" THEN "Montana"
          WHEN "31" THEN "Nebraska"
          WHEN "32" THEN "Nevada"
          WHEN "33" THEN "New Hampshire"
          WHEN "34" THEN "New Jersey"
          WHEN "35" THEN "New Mexico"
          WHEN "36" THEN "New York"
          WHEN "37" THEN "North Carolina"
          WHEN "38" THEN "North Dakota"
          WHEN "39" THEN "Ohio"
          WHEN "40" THEN "Oklahoma"
          WHEN "41" THEN "Oregon"
          WHEN "42" THEN "Pennsylvania"
          //WHEN "43" THEN "" //this is not referenced. kept for numeric continuity
          WHEN "44" THEN "Rhode Island"
          WHEN "45" THEN "South Carolina"
          WHEN "46" THEN "South Dakota"
          WHEN "47" THEN "Tennessee"
          WHEN "48" THEN "Texas"
          WHEN "49" THEN "Utah"
          WHEN "50" THEN "Vermont"
          WHEN "51" THEN "Virginia"
          WHEN "53" THEN "Washington"
          WHEN "54" THEN "West Virginia"
          WHEN "55" THEN "Wisconsin"
          WHEN "56" THEN "Wyoming"
          WHEN "72" THEN "Puerto Rico"
        END;

// Connect bordering states
WITH "https://docs.google.com/spreadsheets/d/14ZJLZKZSlfgfo_pjuWKB8UBvkcgBncaX0xziqFMLpE0/export?format=csv&id=14ZJLZKZSlfgfo_pjuWKB8UBvkcgBncaX0xziqFMLpE0&gid=502947187" AS fileURL
LOAD CSV WITH HEADERS FROM fileURL AS row
WITH DISTINCT size(keys(row)) AS rowSize, keys(row) AS headers, fileURL
LOAD CSV WITH HEADERS FROM fileURL AS row
//UNWIND range(0,rowSize-1) AS i
UNWIND headers AS header
WITH row, header
WHERE row[header] = "Y"
WITH row['State Name'] AS state, collect(header) AS borderingStates
MATCH (s1:State)
WHERE s1.abbreviation = state
UNWIND borderingStates AS borderingState
MATCH (s2:State)
WHERE s2.abbreviation = borderingState
AND NOT (s1)<-[:BORDERS_STATE]-(s2)
MERGE (s1)-[:BORDERS_STATE]->(s2)

// Add Lat & Long to States
LOAD CSV WITH HEADERS FROM 'https://docs.google.com/spreadsheets/d/1jMFJpqqHgtkU4md4fub6nevmCH--rCKMh2Dxdrp4N30/export?format=csv&id=1jMFJpqqHgtkU4md4fub6nevmCH--rCKMh2Dxdrp4N30&gid=0' AS row
WITH row
MATCH (state:State)
WHERE state.abbreviation = row.state
SET state.latitude_decimal = toFloat(row.latitude),
  state.longitude_decimal = toFloat(row.longitude)

// Build (:State)<--(:County)<--(:Place)<--(:Bridge) tree
CALL apoc.periodic.iterate(
'
MATCH (row:Row)
WHERE NOT (row)-[:DATA_FOR]->()
RETURN row
','
MATCH (state:State {code: row.STATE_CODE_001})
MERGE (state)<-[:OF_STATE]-(county:County {code: row.COUNTY_CODE_003})
MERGE (county)<-[:OF_COUNTY]-(place:Place {code: row.PLACE_CODE_004})
MERGE (place)<-[:OF_PLACE]-(bridge:Bridge {id: row.STATE_CODE_001 + "_" + 
                                               row.COUNTY_CODE_003 + "_" + 
                                               row.PLACE_CODE_004 + "_" + 
                                               row.STRUCTURE_NUMBER_008 + 
                                               "_LAT_" + row.LAT_016 + 
                                               "_LONG_" +row.LONG_017})
ON CREATE SET bridge.name = row.STRUCTURE_NUMBER_008,
        bridge.latitude = row.LAT_016,
        bridge.longitude = row.LONG_017,
        bridge.yearbuilt = toInteger(row.YEAR_BUILT_027),
        
        place.code = row.PLACE_CODE_004,
        county.code = row.COUNTY_CODE_003,
        state.code = row.STATE_CODE_001
WITH row, bridge
MERGE (row)-[:DATA_FOR]->(bridge)
',
{batchSize:10000,parallel:false}) YIELD batches, total
RETURN batches, total



// Add County Names
CALL apoc.periodic.iterate(
'
WITH "https://docs.google.com/spreadsheets/d/1-aou_hSFK2JItter84JvUOHUfqJ9Ctjev0G48BF_OjQ/export?format=csv&id=1-aou_hSFK2JItter84JvUOHUfqJ9Ctjev0G48BF_OjQ&gid=726211642" AS fileURL
LOAD CSV WITH HEADERS FROM fileURL AS row
RETURN row
','
MATCH (state:State)<-[:OF_STATE]-(county)
WHERE state.name = row.State
AND county.code = row.`County Code`
SET county.name = rtrim(row.`County Name`)
',
{batchSize:10000,parallel:false}) YIELD batches, total
RETURN batches, total






// Create Entity node and assiging -[:MAINTAINS]->(:Bridge), -[:OWNS]->(:Bridge) relationships
// previously had these rels as separate nodes, but the encoding is the same. Uniting to 1 node and using 2 rels to create context
// Can possibly separate depending on additional information assertained from NBI data
CALL apoc.periodic.iterate(
'
MATCH (bridge:Bridge)
RETURN bridge
','
MATCH (bridge)<-[:DATA_FOR]-(row:Row)
WITH bridge, row.OWNER_022 AS ownerCode, row.MAINTENANCE_021 AS maintCode
MERGE (entity:Entity {code: maintCode})
ON CREATE SET entity.creadedOn = date()
WITH bridge, ownerCode, maintCode
MERGE (entity:Entity {code: ownerCode})
ON CREATE SET entity.createdOn = date()
WITH bridge, ownerCode, maintCode
MATCH (owner:Entity {code: ownerCode})
WITH bridge, owner, maintCode
MATCH (maintainer:Entity {code: maintCode})
MERGE (bridge)<-[:OWNS]-(owner)
MERGE (bridge)<-[:MAINTAINS]-(maintainer)
',
{batchSize:10000,parallel:false}) YIELD batches, total
RETURN batches, total







// Load and connect :Owner and :MaintenanceResp to :Bridge
// Data loaded from https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm via define URLs stored in Google Sheet
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A/export?format=csv&id=1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A&gid=1318941318" AS row1
// Data loaded from files downloaded at https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm and stored in the "import" folder for the database instance
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY/export?format=csv&id=1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY&gid=749188439" AS row1
WITH CASE
	WHEN NOT row1.Year IS NULL THEN collect(row1.URL)
    END AS fileURLs
UNWIND fileURLs as fileURL
CALL apoc.periodic.iterate(
'
LOAD CSV WITH HEADERS FROM $url AS row RETURN row
','
MATCH (bridge:Bridge {id: row.STATE_CODE_001 + "_" + 
                          row.COUNTY_CODE_003 + "_" + 
                          row.PLACE_CODE_004 + "_" + 
                          row.STRUCTURE_NUMBER_008 + 
                          "_LAT_" + row.LAT_016 + 
                          "_LONG_" +row.LONG_017})
MERGE (owner:Owner {id: row.OWNER_022})
MERGE (maintResp:MaintenanceResp {id: row.MAINTENANCE_021})
MERGE (bridge)-[:OWNED_BY]->(owner)
MERGE (bridge)-[:MAINTAINED_BY]->(maintResp)
ON CREATE SET owner.name = row.OWNER_022,
			  maintResp.name = row.MAINTENANCE_021
',
{batchSize:10000, parallel:false, params:{url:fileURL}}) YIELD batches, total
RETURN batches, total








// Create (:Owner) node
MATCH (file:File)
WITH collect(file.url) AS fileURLs
UNWIND fileURLs AS fileURL
CALL apoc.periodic.iterate(
'
LOAD CSV WITH HEADERS FROM $url AS row 
WITH row
WHERE NOT row.OWNER_022 IS NULL
RETURN row
','
MERGE (owner:Owner {id: row.OWNER_022})
ON CREATE SET owner.id = row.OWNER_022
',
{batchSize:10000, parallel:false, params:{url:fileURL}}) YIELD batches, total
RETURN batches, total

//query to add OWner Code Description
MATCH (owner:Owner)
SET owner.description = 
CASE owner.id
    WHEN "01" THEN "State Highway Agency"
    WHEN "02" THEN "County Highway Agency"
    WHEN "03" THEN "Town or Township Highway Agency"
    WHEN "04" THEN "City or Municipal Highway Agency"
    WHEN "11" THEN "State Park, Forest, or Reservation Agency"
    WHEN "12" THEN "Local Park, Forest, or Reservation Agency"
    WHEN "21" THEN "Other State Agencies"
    WHEN "25" THEN "Othe Local Agencies"
    WHEN "26" THEN "Private (other than railroad)"
    WHEN "27" THEN "Railroad"
    WHEN "31" THEN "State Toll Authority"
    WHEN "32" THEN "Local Toll Authority"
    WHEN "60" THEN "Other Federal Agencies"// (not listed below)"
    WHEN "61" THEN "Indian Tribal Government"
    WHEN "62" THEN "Bureau of Indian Affairs"
    WHEN "63" THEN "Bureau of Fish and Wildlife"
    WHEN "64" THEN "U.S. Forest Service"
    WHEN "66" THEN "National Park Service"
    WHEN "67" THEN "Tennessee Valley Authority"
    WHEN "68" THEN "Bureau of Land Management"
    WHEN "69" THEN "Bureau of Reclamation"
    WHEN "70" THEN "Corps of Engineers (Civil)"
    WHEN "71" THEN "Corps of Engineers (Military)"
    WHEN "72" THEN "Air Force"
    WHEN "73" THEN "Navy/Marines"
    WHEN "74" THEN "Army"
    WHEN "75" THEN "NASA"
    WHEN "76" THEN "Metropolitan Washington Airports Service"
    WHEN "80" THEN "Unkown"
    ELSE "XXX - Need to review and update"
END

// Merge relationship between (:Owner) and (:Bridge) nodes
MATCH (file:File)
WITH collect(file.url) AS fileURLs
UNWIND fileURLs AS fileURL
CALL apoc.periodic.iterate(
'
LOAD CSV WITH HEADERS FROM $url AS row 
WITH row
WHERE NOT row.OWNER_022 IS NULL
MATCH (bridge:Bridge {id: row.STATE_CODE_001 + "_" + 
                          row.COUNTY_CODE_003 + "_" + 
                          row.PLACE_CODE_004 + "_" + 
                          row.STRUCTURE_NUMBER_008 + 
                          "_LAT_" + row.LAT_016 + 
                          "_LONG_" +row.LONG_017})
MATCH (owner:Owner {id: row.OWNER_022})
RETURN bridge, owner
','
MERGE (bridge)-[:OWNED_BY]->(owner)
',
{batchSize:10000, parallel:true, params:{url:fileURL}}) YIELD batches, total
RETURN batches, total

// Create (:MaintenanceResp) node
MATCH (file:File)
WITH collect(file.url) AS fileURLs
UNWIND fileURLs AS fileURL
CALL apoc.periodic.iterate(
'
LOAD CSV WITH HEADERS FROM $url AS row 
WITH row
WHERE NOT row.MAINTENANCE_021 IS NULL
RETURN row
','
MERGE (maintResp:MaintenanceResp {id: row.MAINTENANCE_021})
ON CREATE SET maintResp.id = row.MAINTENANCE_021
',
{batchSize:10000, parallel:false, params:{url:fileURL}}) YIELD batches, total
RETURN batches, total

// Load and create (:MaintenanceResp) nodes
//MATCH (file:File)
//WITH collect(file.url) AS fileURLs
//UNWIND fileURLs AS fileURL
//CALL apoc.periodic.commit("
//LOAD CSV WITH HEADERS FROM fileURL AS row
////WITH row
////WHERE NOT row.MAINTENANCE_021 IS NULL
//MERGE (maintResp:MaintenanceResp {id: row.MAINTENANCE_021})
//WITH maintResp limit {limit}
//ON CREATE SET maintResp.id = row.MAINTENANCE_021
//",
//{limit:1000}) YIELD batches
//RETURN batches

//query to add Maintenance Responsibility Code Description
MATCH (maintResp:MaintenanceResp)
SET maintResp.description = 
CASE maintResp.id
    WHEN "01" THEN "State Highway Agency"
    WHEN "02" THEN "County Highway Agency"
    WHEN "03" THEN "Town or Township Highway Agency"
    WHEN "04" THEN "City or Municipal Highway Agency"
    WHEN "11" THEN "State Park, Forest, or Reservation Agency"
    WHEN "12" THEN "Local Park, Forest, or Reservation Agency"
    WHEN "21" THEN "Other State Agencies"
    WHEN "25" THEN "Othe Local Agencies"
    WHEN "26" THEN "Private (other than railroad)"
    WHEN "27" THEN "Railroad"
    WHEN "31" THEN "State Toll Authority"
    WHEN "32" THEN "Local Toll Authority"
    WHEN "60" THEN "Other Federal Agencies"// (not listed below)"
    WHEN "61" THEN "Indian Tribal Government"
    WHEN "62" THEN "Bureau of Indian Affairs"
    WHEN "63" THEN "Bureau of Fish and Wildlife"
    WHEN "64" THEN "U.S. Forest Service"
    WHEN "66" THEN "National Park Service"
    WHEN "67" THEN "Tennessee Valley Authority"
    WHEN "68" THEN "Bureau of Land Management"
    WHEN "69" THEN "Bureau of Reclamation"
    WHEN "70" THEN "Corps of Engineers (Civil)"
    WHEN "71" THEN "Corps of Engineers (Military)"
    WHEN "72" THEN "Air Force"
    WHEN "73" THEN "Navy/Marines"
    WHEN "74" THEN "Army"
    WHEN "75" THEN "NASA"
    WHEN "76" THEN "Metropolitan Washington Airports Service"
    WHEN "80" THEN "Unkown"
    ELSE "XXX - Need to review and update"
END

// Merge relationship between (:MaintenanceResp) and (:Bridge) nodes
MATCH (file:File)
WITH collect(file.url) AS fileURLs
UNWIND fileURLs AS fileURL
CALL apoc.periodic.iterate(
'
LOAD CSV WITH HEADERS FROM $url AS row 
WITH row
WHERE NOT row.MAINTENANCE_021 IS NULL
MATCH (bridge:Bridge {id: row.STATE_CODE_001 + "_" + 
                          row.COUNTY_CODE_003 + "_" + 
                          row.PLACE_CODE_004 + "_" + 
                          row.STRUCTURE_NUMBER_008 + 
                          "_LAT_" + row.LAT_016 + 
                          "_LONG_" +row.LONG_017})
MATCH (maintResp:MaintenanceResp {id: row.MAINTENANCE_021})
RETURN bridge, maintResp
','
MERGE (bridge)-[:MAINTAINED_BY]->(maintResp)
',
{batchSize:10000, parallel:true, params:{url:fileURL}}) YIELD batches, total
RETURN batches, total










// Convert Latitude and Longitude from initial import to point (spatial)
CALL apoc.periodic.iterate('
MATCH (bridge:Bridge)
WHERE NOT bridge.latitude IS NULL
AND NOT bridge.longitude IS NULL
RETURN bridge
','
WITH bridge,
     toFloat(left(bridge.latitude, 2)) + toFloat(substring(bridge.latitude,2,2))/60 + toFloat(right(bridge.latitude,4))/100/3600 AS latitude_decimal,
     size(bridge.longitude) AS long_size
WITH bridge,
     latitude_decimal,
     CASE long_size
        WHEN 8 THEN -1 * ( toFloat(left(bridge.longitude, 2)) + toFloat(substring(bridge.longitude,2,2))/60 + toFloat(right(bridge.longitude,4))/100/3600 )
        WHEN 9 THEN -1 * ( toFloat(left(bridge.longitude, 3)) + toFloat(substring(bridge.longitude,3,2))/60 + toFloat(right(bridge.longitude,4))/100/3600 )
     END AS longitude_decimal
SET bridge.location = point({ longitude: longitude_decimal, latitude: latitude_decimal }),
    bridge.longitude_decimal = longitude_decimal,
    bridge.latitude_decimal = latitude_decimal
',
{batchSize:10000, parallel:true}) YIELD batches, total
RETURN batches, total





/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
//WIP
// Load and create :Inspection
// leads to websocket failure
MATCH (file:File)
WHERE NOT (file)-[:CONTAINS]->(:Row)
WITH collect(file.url) AS fileURLs
UNWIND fileURLs AS fileURL
CALL apoc.periodic.iterate(
'
LOAD CSV WITH HEADERS FROM $url AS row
RETURN row
','
CREATE (inspectionRaw:InspectionRaw {createdOn: date(),
                     STATE_CODE_001: row.STATE_CODE_001,
                        COUNTY_CODE_003: row.COUNTY_CODE_003,
                        PLACE_CODE_004: row.PLACE_CODE_004,
                        STRUCTURE_NUMBER_008: row.STRUCTURE_NUMBER_008,
                        DECK_COND_058: row.DECK_COND_058,
                        SUPERSTRUCTURE_COND_059: row.SUPERSTRUCTURE_COND_059,
                        SUBSTRUCTURE_COND_060: row.SUBSTRUCTURE_COND_060,
                        CHANNEL_COND_061: row.CHANNEL_COND_061,
                        CULVERT_COND_062: row.CULVERT_COND_062,
                        DATE_OF_INSPECT_090: row.DATE_OF_INSPECT_090})
',
{batchSize:5000,parallel:false,params:{url:fileURL}}) YIELD batches, total
RETURN batches, total




// Load and create :InspectionDate
// Data loaded from https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm via define URLs stored in Google Sheet
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A/export?format=csv&id=1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A&gid=1318941318" AS row1
CREATE INDEX ON :InspectionDate(id);
// Data loaded from files downloaded at https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm and stored in the "import" folder for the database instance
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY/export?format=csv&id=1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY&gid=749188439" AS row1
WITH CASE
    //WHEN NOT row1.Year IS NULL THEN collect([row1.URL,row1.Year])
    WHEN NOT row1.Year IS NULL THEN collect(row1.URL)
    END AS fileURLs
UNWIND fileURLs as fileURL
CALL apoc.periodic.iterate(
'
LOAD CSV WITH HEADERS FROM $url AS row RETURN row
','
//MATCH (bridge:Bridge {id: row.STATE_CODE_001 + "_" + 
//                          row.COUNTY_CODE_003 + "_" + 
//                          row.PLACE_CODE_004 + "_" + 
//                          row.STRUCTURE_NUMBER_008 + 
//                          "_LAT_" + row.LAT_016 + 
//                          "_LONG_" +row.LONG_017})
MERGE (inspDate:InspectionDate {id: row.DATE_OF_INSPECT_090})
//MERGE (bridge)-[:INSPECTED_ON]->(inspDate)
ON CREATE SET inspDate.id = row.DATE_OF_INSPECT_090
',
//{batchSize:10000, parallel:false, params:{url:fileURL[0], fileYear:fileURL[1]}}) YIELD batches, total
{batchSize:5000, parallel:false, params:{url:fileURL}}) YIELD batches, total
RETURN batches, total


// need to update, clean, and change insp dates to temporal format
LOAD CSV WITH HEADERS FROM "https://www.fhwa.dot.gov/bridge/nbi/2017/delimited/AL17.txt" AS row
WITH row, replace(row.DATE_OF_INSPECT_090, " ", "") AS temp
WITH row, temp, 
    CASE size(temp)
        //WHEN 3 THEN toInteger(left(temp,1))
        WHEN 4 THEN toInteger(left(temp,2))
    END AS month,
    CASE 
        WHEN ( toInteger(right(temp,2)) <= 99 AND toInteger(right(temp,2)) >= 92 ) THEN toInteger("19" + right(temp,2))
        WHEN ( toInteger(right(temp,2)) >= 00 AND toInteger(right(temp,2)) < 92 ) THEN toInteger("20" + right(temp,2))
    END AS year
RETURN row.DATE_OF_INSPECT_090, size(row.DATE_OF_INSPECT_090), temp, month, year
ORDER BY month

CALL apoc.periodic.iterate(
'
MATCH (inspDate:InspectionDate) 
//WHERE NOT exists(inspDate.date)
//AND size(inspDate.id) = 4
RETURN inspDate
','
WITH inspDate,
     CASE size(inspDate.id)
        WHEN 3 THEN toInteger(left(inspDate.id,1))
        WHEN 4 THEN toInteger(left(inspDate.id,2))
    END AS month,
    CASE
        WHEN ( toInteger(right(inspDate.id,2)) <= 99 AND toInteger(right(inspDate.id,2)) >= 92 ) THEN toInteger("19" + right(inspDate.id,2))
        WHEN ( toInteger(right(inspDate.id,2)) >= 00 AND toInteger(right(inspDate.id,2)) < 92 ) THEN toInteger("20" + right(inspDate.id,2))
    END AS year
SET inspDate.date = date({ year: year, month: month})
',
{batchSize:1000,parallel:false}) YIELD batches, total
RETURN batches, total

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////


// Data loaded from files downloaded at https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm and stored in the "import" folder for the database instance
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY/export?format=csv&id=1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY&gid=749188439" AS row1
WITH CASE
    WHEN NOT row1.Year IS NULL THEN collect(row1.URL)
    END AS fileURLs
UNWIND fileURLs as fileURL
CALL apoc.periodic.iterate(
'
LOAD CSV WITH HEADERS FROM $url AS row RETURN row
','
MATCH (bridge:Bridge {id: row.STATE_CODE_001 + "_" + 
                          row.COUNTY_CODE_003 + "_" + 
                          row.PLACE_CODE_004 + "_" + 
                          row.STRUCTURE_NUMBER_008 + 
                          "_LAT_" + row.LAT_016 + 
                          "_LONG_" +row.LONG_017})
MERGE (structureKind:StructureKind {id: row.STRUCTURE_KIND_043A})
MERGE (structureType:StructureType {id: row.STRUCTURE_TYPE_043B})
MERGE (bridge)-[:HAS_STRUCTURE_KIND]->(structureKind)
MERGE (bridge)-[:HAS_STRUCTURE_TYPE]->(structureType)
ON CREATE SET structureKind.code = row.STRUCTURE_KIND_043A,
              structureType.code = row.STRUCTURE_TYPE_043B
',
{batchSize:10000, parallel:false, params:{url:fileURL}}) YIELD batches, total
RETURN batches, total

//query to add Structure Kind Code Description
MATCH (structureKind:StructureKind)
SET structureKind.description = 
CASE structureKind.code
    WHEN "1" THEN "Concrete"
    WHEN "2" THEN "Concrete continuous"
    WHEN "3" THEN "Steel"
    WHEN "4" THEN "Steel continuous"
    WHEN "5" THEN "Prestressed concrete (incl. Post-tension)"
    WHEN "6" THEN "Prestressed concrete continous (incl. Post-tension)"
    WHEN "7" THEN "Wood or Timber"
    WHEN "8" THEN "Masonry"
    WHEN "9" THEN "Aluminum, Wrought Iron, or Cast Iron"
    WHEN "0" THEN "Other"
END

//query to add Structure Type Code Description
MATCH (structureType:StructureType)
SET structureType.description = 
CASE structureType.code
    WHEN "01" THEN "Slab"
    WHEN "02" THEN "Stringer/Multi-beam or Girder"
    WHEN "03" THEN "Girder and Floorbeam System"
    WHEN "04" THEN "Tee Beam"
    WHEN "05" THEN "Box Beam or Girders - Multiple"
    WHEN "06" THEN "Box Beam or Girders - Single or Spread"
    WHEN "07" THEN "Frame (except culverts)"
    WHEN "08" THEN "Orthotropic"
    WHEN "09" THEN "Truss - Deck"
    WHEN "10" THEN "Truss - Thru"
    WHEN "11" THEN "Arch - Deck"
    WHEN "12" THEN "Arch - Thru"
    WHEN "13" THEN "Suspension"
    WHEN "14" THEN "Stayed Girder"
    WHEN "15" THEN "Movable - Lift"
    WHEN "16" THEN "Movable - Bascule"
    WHEN "17" THEN "Movable - Swing"
    WHEN "18" THEN "Tunnel"
    WHEN "19" THEN "Culvert (includes frame culverts)"
    WHEN "20" THEN "Mixed types *"
    WHEN "21" THEN "Sergmental Box Girder"
    WHEN "22" THEN "Channel Beam"
    WHEN "00" THEN "Other"
END

















// trying to understand what data is valid
MATCH (iD:InspectionDate)
WHERE (size(replace(iD.id," ", "")) = 3 OR size(replace(iD.id," ", "")) = 4)
AND NOT iD.id CONTAINS "."
WITH iD, 
	 replace(iD.id," ", "") AS tempDate
//RETURN replace(iD.id," ", ""), 
//	   right(replace(iD.id," ", ""),2) AS year,
//       CASE size(replace(iD.id," ", ""))
//       	WHEN 3 THEN "0" + left(replace(iD.id," ", ""), 1)
//        WHEN 4 THEN left(replace(iD.id," ", ""), 2)
//       END AS month
//ORDER BY year, month
WITH iD,
	 tempDate,
	 right(tempDate, 2) AS year,
	 CASE size(tempDate)
	 	WHEN 3 THEN "0" + left(tempDate, 1)
	 	WHEN 4 THEN left(tempDate, 2)
	 END AS month
RETURN iD.year, tempDate, year, month
ORDER BY year, month
//SET iD.date({ year})





// set Inspection Date month and year properties
MATCH (inspDate:InspectionDate)
SET inspDate.year = right(inspDate.id, 2)
WITH inspDate.year AS inspDateYear
MATCH (inspDate:InspectionDate)
WHERE size(inspDate.id) = 3
SET inspDate.month = left(inspDate.id, 1)
WITH inspDateYear, inspDate.month AS inspDateMonth
MATCH (inspDate:InspectionDate)
WHERE size(inspDate.id) = 4
SET inspDate.month = left(inspDate.id, 2)







// Create (:YearBuilt) and connect to (:Bridge)
MATCH (bridge:Bridge)
WHERE size(toString(bridge.yearbuilt)) = 4 //this ignores null values, and bridges where year recorded doesn't match designated format`
WITH collect(DISTINCT bridge.yearbuilt) AS buildYears
UNWIND buildYears as buildYear
//MERGE (yearBuilt:YearBuilt {year: date({ year: buildYear})})
MERGE(yearBuilt:YearBuilt {year: buildYear})
WITH yearBuilt, buildYear
CALL apoc.periodic.iterate(
'
MATCH (bridge:Bridge)
WHERE bridge.yearbuilt = $build_year
MATCH (yearBuilt:YearBuilt)
//WHERE yearBuilt.year.year = $build_year
WHERE yearBuilt.year = $build_year
RETURN bridge, yearBuilt
',
'
MERGE (bridge)-[:BUILT_IN]->(yearBuilt)
',
{batchSize:10000, parallel:true, params:{build_year:buildYear}}) YIELD batches, total
RETURN batches, total











// connect (:InspectionDate) to (:Month) in timeline tree
MATCH (bridge:Bridge)-[:INSPECTED_ON]->(inspDate:InspectionDate)
MATCH (year:Year {id: inspDate.year})-[:MONTH]->(month:Month {id: inspDate.month})
MERGE (inspDate)-[:DATE_OF_INSPECTION]->(month)

// Create Condition Rating Nodes
UNWIND [['N', 'NOT APPLICABLE', ''], 
        ['9', 'EXCELLENT CONDITION', ''],
        ['8', 'VERY GOOD CONDITION', 'No problems noted.'],
        ['7', 'GOOD CONDITION', 'Some minor problems.'],
        ['6', 'SATISFACTORY CONDITION', 'structural elements show some minor deterioration.'],
        ['5', 'FAIR CONDITION', 'All primary structural elements are sound but may have minor section loss, cracking, spalling or scour.'],
        ['4', 'POOR CONDITION', 'Advanced section loss, deterioration, spalling or scour.'],
        ['3', 'SERIOUS CONDITION', 'Loss of section, deterioration, spalling or scour have seriously affected primary structural components. Local failures are possible. Fatigue cracks in stell or shear cracks in concrete may be present.'],
        ['2', 'CRITICAL CONDITION', 'Advanced deterioration of primary structural elements. Fatigue cracks in steel or shear cracks in concrete may be present or scour may have removed substructure support. Unless closesly monitored it may be necessary to close the bridge until corrective action is taken.'],
        ['1', '"IMMINENT" FAILURE CONDITION', 'Major deterioration or section loss present in critical structural components or obvious vertical or horizontal movement affecting structure stability. Bridge is closed to traffic but corrective action may put back in light service.'],
        ['0', 'FAILED CONDITION', 'Out of Service - Beyond corrective action.']] AS rating_code
CREATE (:ConditionRating {code: rating_code[0], generalDescription: rating_code[1], additionalDescription: rating_code[2]})

// Create Appraisal Rating Nodes
UNWIND [['N', 'Not applicable'], 
        ['9', 'Superior to present desirable criteria'],
        ['8', 'Equal to present desirable criteria'],
        ['7', 'Better than present minimum criteria'],
        ['6', 'Equal to present minimum criteria'],
        ['5', 'Somewhat better than minimum adequacy to tolerate being left in place as is'],
        ['4', 'Meets minimum tolerable limits to be left in place as is'],
        ['3', 'Basically intolerable requiring high priority of corrective action'],
        ['2', 'Basically intolerable requiring high priority of replacement'],
        ['1', 'This value of raiting cide not used'],
        ['0', 'Bridge closed']] AS appraisal_code
CREATE (:AppraisalRating {code: appraisal_code[0], description: appraisal_code[1]})


// create (:Evaluation) and connect to (:InspectionDate) and (:Bridge)
CALL apoc.periodic.iterate("
UNWIND ['file:///MN14.csv', 'file:///AK14.csv'] AS file
LOAD CSV WITH HEADERS FROM file AS row RETURN row",
"
MATCH (bridge:Bridge {id: row.STRUCTURE_NUMBER_008}) //need to update this to match bridge id
MATCH (inspDate:InspectionDate {id: row.DATE_OF_INSPECT_090})
MERGE (evaluation:Evaluation {id: bridge.id + inspDate.id})
MERGE (bridge)<-[:EVALUATION_OF]-(evaluation)-[:EVALUATED_ON]->(inspDate)
ON CREATE SET evaluation.id = bridge.id + inspDate.id,
			  
              evaluation.deck_cond = row.DECK_COND_058,
			  evaluation.superstructure_cond = row.SUPERSTRUCTURE_COND_059,
			  evaluation.substructure_cond = row.SUBSTRUCTURE_COND_060,
			  evaluation.channel_cond = row.CHANNEL_COND_061,
			  evaluation.culvert_cond = row.CULVERT_COND_062,

			  evaluation.structural_eval = row.STRUCTURAL_EVAL_067,
			  evaluation.deck_geometry_eval = row.DECK_GEOMETRY_EVAL_068,
			  evaluation.undclrence_eval = row.UNDCLRENCE_EVAL_069,
			  evaluation.posting_eval = row.POSTING_EVAL_070,
			  evaluation.waterway_eval = row.WATERWAY_EVAL_071,
			  evaluation.appr_road_eval = row.APPR_ROAD_EVAL_072
",
{batchSize:1000,iterateList:true});


// converting latitude to decimal
MATCH (bridge:Bridge)
WHERE size(bridge.latitude) = 8
SET bridge.latitude_decimal = toFloat(left(bridge.latitude, 2)) + toFloat(substring(bridge.latitude,2,2))/60 + toFloat(right(bridge.latitude,4))/100/3600

// query to verify new latitude_decimal property
MATCH (bridge:Bridge)
WHERE size(bridge.latitude) = 8
//SET bridge.latitude_decimal = toFloat(left(bridge.latitude, 2)) + toFloat(substring(bridge.latitude,2,2))/60 + toFloat(right(bridge.latitude,4))/100/3600
RETURN bridge.latitude AS Lat, 
	   toFloat(left(bridge.latitude, 2)) AS Degrees, 
	   toFloat(substring(bridge.latitude,2,2))/60 AS Minutes,
       toFloat(right(bridge.latitude,4))/100/3600 AS Seconds,
       toFloat(left(bridge.latitude, 2)) + toFloat(substring(bridge.latitude,2,2))/60 + toFloat(right(bridge.latitude,4))/100/3600 AS Lat_Decimal,
       bridge.latitude_decimal
ORDER BY Lat


// converting longitude to decimal
MATCH (bridge:Bridge)
WITH bridge, size(bridge.longitude) AS long_size
WHERE long_size >= 8
SET bridge.longitude_decimal = 
CASE long_size
	WHEN 8 THEN -1 * ( toFloat(left(bridge.longitude, 2)) + toFloat(substring(bridge.longitude,2,2))/60 + toFloat(right(bridge.longitude,4))/100/3600 )
    WHEN 9 THEN -1 * ( toFloat(left(bridge.longitude, 3)) + toFloat(substring(bridge.longitude,3,2))/60 + toFloat(right(bridge.longitude,4))/100/3600 )
END

// query to verify new latitude_decimal property
MATCH (bridge:Bridge)
WITH bridge, size(bridge.longitude) AS long_size
WHERE long_size >= 8
RETURN size(bridge.longitude),
	   bridge.longitude AS Long, 
	CASE size(bridge.longitude)
		WHEN 8 THEN toFloat(left(bridge.longitude, 2))
		WHEN 9 THEN toFloat(left(bridge.longitude, 3))
	END AS Degrees,
    CASE size(bridge.longitude)
    	WHEN 8 THEN toFloat(substring(bridge.longitude,2,2))/60
        WHEN 9 THEN toFloat(substring(bridge.longitude,3,2))/60
	END AS Minutes,
	   toFloat(right(bridge.longitude,4))/100/3600 AS Seconds,
	CASE long_size
		WHEN 8 THEN -1 * ( toFloat(left(bridge.longitude, 2)) + toFloat(substring(bridge.longitude,2,2))/60 + toFloat(right(bridge.longitude,4))/100/3600 )
	    WHEN 9 THEN -1 * ( toFloat(left(bridge.longitude, 3)) + toFloat(substring(bridge.longitude,3,2))/60 + toFloat(right(bridge.longitude,4))/100/3600 )
	END AS decimal,
	bridge.longitude_decimal
ORDER BY Long


// adding Bridge long & lat as point
MATCH (bridge:Bridge)
WHERE NOT bridge.latitude IS NULL
AND NOT bridge.longitude IS NULL
WITH bridge,
	 toFloat(left(bridge.latitude, 2)) + toFloat(substring(bridge.latitude,2,2))/60 + toFloat(right(bridge.latitude,4))/100/3600 AS latitude_decimal,
     size(bridge.longitude) AS long_size
WITH bridge,
	 latitude_decimal,
     CASE long_size
	 	WHEN 8 THEN -1 * ( toFloat(left(bridge.longitude, 2)) + toFloat(substring(bridge.longitude,2,2))/60 + toFloat(right(bridge.longitude,4))/100/3600 )
     	WHEN 9 THEN -1 * ( toFloat(left(bridge.longitude, 3)) + toFloat(substring(bridge.longitude,3,2))/60 + toFloat(right(bridge.longitude,4))/100/3600 )
	 END AS longitude_decimal
SET bridge.location = point({ longitude: longitude_decimal, latitude: latitude_decimal })



//query to change state name from id to state letters
// This changes the state "numeric" code to the 2-letter state abreviation
MATCH (state:State)
SET state.name = 
CASE state.name // change to state.code?
	WHEN "01" THEN "AL"
    WHEN "02" THEN "AK"
    //WHEN "03" THEN "" //this is not referenced. kept for numeric continuity
    WHEN "04" THEN "AZ"
    WHEN "05" THEN "AR"
    WHEN "06" THEN "CA"
    //WHEN "07" THEN "" //this is not referenced. kept for numeric continuity
    WHEN "08" THEN "CO"
    WHEN "09" THEN "CT"
    WHEN "10" THEN "DE"
    WHEN "11" THEN "DC"
    WHEN "12" THEN "FL"
    WHEN "13" THEN "GA"
    //WHEN "14" THEN "" //this is not referenced. kept for numeric continuity
    WHEN "15" THEN "HI"
    WHEN "16" THEN "ID"
    WHEN "17" THEN "IL"
    WHEN "18" THEN "IN"
    WHEN "19" THEN "IA"
    WHEN "20" THEN "KS"
    WHEN "21" THEN "KY"
    WHEN "22" THEN "LA"
    WHEN "23" THEN "ME"
    WHEN "24" THEN "MD"
    WHEN "25" THEN "MA"
    WHEN "26" THEN "MI"
    WHEN "27" THEN "MN"
    WHEN "28" THEN "MS"
    WHEN "29" THEN "MO"
    WHEN "30" THEN "MT"
    WHEN "31" THEN "NE"
    WHEN "32" THEN "NV"
    WHEN "33" THEN "NH"
    WHEN "34" THEN "NJ"
    WHEN "35" THEN "NM"
    WHEN "36" THEN "NY"
    WHEN "37" THEN "NC"
    WHEN "38" THEN "ND"
    WHEN "39" THEN "OH"
    WHEN "40" THEN "OK"
    WHEN "41" THEN "OR"
    WHEN "42" THEN "PA"
    //WHEN "43" THEN "" //this is not referenced. kept for numeric continuity
    WHEN "44" THEN "RI"
    WHEN "45" THEN "SC"
    WHEN "46" THEN "SD"
    WHEN "47" THEN "TN"
    WHEN "48" THEN "TX"
    WHEN "49" THEN "UT"
    WHEN "50" THEN "VT"
    WHEN "51" THEN "VA"
    WHEN "53" THEN "WA"
    WHEN "54" THEN "WV"
    WHEN "55" THEN "WI"
    WHEN "56" THEN "WY"
    WHEN "72" THEN "PR"
END//
//need to incorporate longer state names
  WHEN "01" THEN "Alabama"
    WHEN "02" THEN "Alaska"
    //WHEN "03" THEN "" //this is not referenced. kept for numeric continuity
    WHEN "04" THEN "Arizona"
    WHEN "05" THEN "Arkansas"
    WHEN "06" THEN "California"
    //WHEN "07" THEN "" //this is not referenced. kept for numeric continuity
    WHEN "08" THEN "Colorado"
    WHEN "09" THEN "Connecticut"
    WHEN "10" THEN "Deleware"
    WHEN "11" THEN "District of Columbia"
    WHEN "12" THEN "Florida"
    WHEN "13" THEN "Georgia"
    //WHEN "14" THEN "" //this is not referenced. kept for numeric continuity
    WHEN "15" THEN "Hawaii"
    WHEN "16" THEN "Idaho"
    WHEN "17" THEN "Illinois"
    WHEN "18" THEN "Indiana"
    WHEN "19" THEN "Iowa"
    WHEN "20" THEN "Kansas"
    WHEN "21" THEN "Kentucky"
    WHEN "22" THEN "Louisianna"
    WHEN "23" THEN "Maine"
    WHEN "24" THEN "Maryland"
    WHEN "25" THEN "Massachusetts"
    WHEN "26" THEN "Michigan"
    WHEN "27" THEN "Minnesota"
    WHEN "28" THEN "Mississippi"
    WHEN "29" THEN "Missouri"
    WHEN "30" THEN "Montana"
    WHEN "31" THEN "Nebraska"
    WHEN "32" THEN "Nevada"
    WHEN "33" THEN "New Hampshire"
    WHEN "34" THEN "New Jersey"
    WHEN "35" THEN "New Mexico"
    WHEN "36" THEN "New York"
    WHEN "37" THEN "North Carolina"
    WHEN "38" THEN "North Dakota"
    WHEN "39" THEN "Ohio"
    WHEN "40" THEN "Oklahoma"
    WHEN "41" THEN "Oregon"
    WHEN "42" THEN "Pennsylvania"
    //WHEN "43" THEN "" //this is not referenced. kept for numeric continuity
    WHEN "44" THEN "Rhode Island"
    WHEN "45" THEN "South Carolina"
    WHEN "46" THEN "South Dakota"
    WHEN "47" THEN "Tennessee"
    WHEN "48" THEN "Texas"
    WHEN "49" THEN "Utah"
    WHEN "50" THEN "Vermont"
    WHEN "51" THEN "Virginia"
    WHEN "53" THEN "Washington"
    WHEN "54" THEN "West Virginia"
    WHEN "55" THEN "Wisconsin"
    WHEN "56" THEN "Wyoming"
    WHEN "72" THEN "Puerto Rico"







// Data loaded from https://www2.census.gov/programs-surveys/popest/geographies/2016/all-geocodes-v2016.xlsx converted to shared Google Sheet
CALL apoc.periodic.iterate(
'
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/12ZvB9atf_RHWpqDzahN68pgVB5PNGz34LAnsIfwcVMs/export?format=csv&id=12ZvB9atf_RHWpqDzahN68pgVB5PNGz34LAnsIfwcVMs&gid=1935809672" AS row
RETURN row
','
MATCH (state:State)
WHERE state.id = row.`State Code (FIPS)`
MATCH (state)<-[:OF_STATE]-(county:County)
WHERE county.id = row.`County Code (FIPS)`
SET county.name = row.`Area Name (including legal/statistical area description)`
',
{batchSize:10000, parallel:false}) YIELD batches, total
RETURN batches, total

// Data loaded from https://www2.census.gov/programs-surveys/popest/geographies/2016/all-geocodes-v2016.xlsx converted to shared Google Sheet
CALL apoc.periodic.iterate(
'
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/12ZvB9atf_RHWpqDzahN68pgVB5PNGz34LAnsIfwcVMs/export?format=csv&id=12ZvB9atf_RHWpqDzahN68pgVB5PNGz34LAnsIfwcVMs&gid=1935809672" AS row
RETURN row
','
MATCH (state:State)
WHERE state.id = row.`State Code (FIPS)`
MATCH (state)<--(:County)<--(place:Place)
WHERE place.id = row.`Place Code (FIPS)`
SET place.name = row.`Area Name (including legal/statistical area description)`
',
{batchSize:10000, parallel:false}) YIELD batches, total
RETURN batches, total






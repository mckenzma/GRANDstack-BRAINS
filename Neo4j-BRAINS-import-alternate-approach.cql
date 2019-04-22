// Data loaded from https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm via define URLs stored in Google Sheet
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A/export?format=csv&id=1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A&gid=1318941318" AS row1
// Data loaded from files downloaded at https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm and stored in the "import" folder for the database instance
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY/export?format=csv&id=1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY&gid=749188439" AS row1
WITH CASE
  WHEN NOT row1.Year IS NULL THEN collect(row1.URL)
    END AS fileURLs
UNWIND fileURLs as fileURL
MERGE (file:File {url: fileURL})
ON CREATE SET file.url = fileURL





MATCH (file:File)
WITH collect(file.url) AS fileURLs
WITH fileURLs[0] AS fileURL, 0 AS row_num
//UNWIND fileURLS AS fileURL
//LOAD CSV WITH HEADERS FROM fileURL AS row
CALL apoc.load.csv(replace(fileURL,"file:///",""),{sep:","}) YIELD lineNo, map AS row
WITH row, fileURL AS file_url, lineNo AS row_num
MERGE (fileRow:FileRow {urlRow: file_url + "_row_" + row_num})
ON CREATE SET fileRow.urlRow = file_url + "_row_" + row_num,
              
              fileRow.STATE_CODE_001 = row.STATE_CODE_001,
              fileRow.HIGHWAY_DISTRICT_002 = row.HIGHWAY_DISTRICT_002,
              fileRow.COUNTY_CODE_003 = row.COUNTY_CODE_003,
              fileRow.PLACE_CODE_004 = row.PLACE_CODE_004,
              fileRow.RECORD_TYPE_005A = row.RECORD_TYPE_005A,
              fileRow.ROUTE_PREFIX_005B = row.ROUTE_PREFIX_005B,
              fileRow.SERVICE_LEVEL_005C = row.SERVICE_LEVEL_005C,
              fileRow.ROUTE_NUMBER_005D = row.ROUTE_NUMBER_005D,
              fileRow.DIRECTION_005E = row.DIRECTION_005E,
              fileRow.FEATURES_DESC_006A = row.FEATURES_DESC_006A,
              fileRow.CRITICAL_FACILITY_006B = row.CRITICAL_FACILITY_006B,
              fileRow.FACILITY_CARRIED_007 = row.FACILITY_CARRIED_007,
              fileRow.STRUCTURE_NUMBER_008 = row.STRUCTURE_NUMBER_008,
              fileRow.LOCATION_009 = row.LOCATION_009,
              fileRow.MIN_VERT_CLR_010 = row.MIN_VERT_CLR_010,
              fileRow.KILOPOINT_011 = row.KILOPOINT_011,
              fileRow.BASE_HWY_NETWORK_012 = row.BASE_HWY_NETWORK_012,
              fileRow.LRS_INV_ROUTE_013A = row.LRS_INV_ROUTE_013A,
              fileRow.SUBROUTE_NO_013B = row.SUBROUTE_NO_013B,
              fileRow.LAT_016 = row.LAT_016,
              fileRow.LONG_017 = row.LONG_017,

              fileRow.DETOUR_KILOS_019 = row.DETOUR_KILOS_019,
              fileRow.TOLL_020  = row.TOLL_020,
              fileRow.MAINTENANCE_021 = row.MAINTENANCE_021,
              fileRow.OWNER_022 = row.OWNER_022,

              fileRow.FUNCTIONAL_CLASS_026 = row.FUNCTIONAL_CLASS_026,
              fileRow.YEAR_BUILT_027 = row.YEAR_BUILT_027,
              fileRow.TRAFFIC_LANES_ON_028A = row.TRAFFIC_LANES_ON_028A,
              fileRow.TRAFFIC_LANES_UND_028B = row.TRAFFIC_LANES_UND_028B,
              fileRow.ADT_029 = row.ADT_029,
              fileRow.YEAR_ADT_030 = row.YEAR_ADT_030,
              fileRow.DESIGN_LOAD_031 = row.DESIGN_LOAD_031,
              fileRow.APPR_WIDTH_MT_032 = row.APPR_WIDTH_MT_032,
              fileRow.MEDIAN_CODE_033 = row.MEDIAN_CODE_033,
              fileRow.DEGREES_SKEW_034 = row.DEGREES_SKEW_034,
              fileRow.STRUCTURE_FLARED_035 = row.STRUCTURE_FLARED_035,
              fileRow.RAILINGS_036A = row.RAILINGS_036A,
              fileRow.TRANSITIONS_036B = row.TRANSITIONS_036B,
              fileRow.APPR_RAIL_036C = row.APPR_RAIL_036C,
              fileRow.APPR_RAIL_END_036D = row.APPR_RAIL_END_036D,
              fileRow.HISTORY_037 = row.HISTORY_037,
              fileRow.NAVIGATION_038 = row.NAVIGATION_038,
              fileRow.NAV_VERT_CLR_MT_039 = row.NAV_VERT_CLR_MT_039,
              fileRow.NAV_HORR_CLR_MT_040 = row.NAV_HORR_CLR_MT_040,
              fileRow.OPEN_CLOSED_POSTED_041 = row.OPEN_CLOSED_POSTED_041,
              fileRow.SERVICE_ON_042A = row.SERVICE_ON_042A,
              fileRow.SERVICE_UND_042B = row.SERVICE_UND_042B,
              fileRow.STRUCTURE_KIND_043A = row.STRUCTURE_KIND_043A,
              fileRow.STRUCTURE_TYPE_043B = row.STRUCTURE_TYPE_043B,
              fileRow.APPR_KIND_044A = row.APPR_KIND_044A,
              fileRow.APPR_TYPE_044B = row.APPR_TYPE_044B,
              fileRow.MAIN_UNIT_SPANS_045 = row.MAIN_UNIT_SPANS_045,
              fileRow.APPR_SPANS_046 = row.APPR_SPANS_046,
              fileRow.HORR_CLR_MT_047 = row.HORR_CLR_MT_047,
              fileRow.MAX_SPAN_LEN_MT_048 = row.MAX_SPAN_LEN_MT_048,
              fileRow.STRUCTURE_LEN_MT_049 = row.STRUCTURE_LEN_MT_049,
              fileRow.LEFT_CURB_MT_050A = row.LEFT_CURB_MT_050A,
              fileRow.RIGHT_CURB_MT_050B = row.RIGHT_CURB_MT_050B,
              fileRow.ROADWAY_WIDTH_MT_051 = row.ROADWAY_WIDTH_MT_051,
              fileRow.DECK_WIDTH_MT_052 = row.DECK_WIDTH_MT_052,
              fileRow.VERT_CLR_OVER_MT_053 = row.VERT_CLR_OVER_MT_053,
              fileRow.VERT_CLR_UND_REF_054A = row.VERT_CLR_UND_REF_054A,
              fileRow.VERT_CLR_UND_054B = row.VERT_CLR_UND_054B,
              fileRow.LAT_UND_REF_055A = row.LAT_UND_REF_055A,
              fileRow.LAT_UND_MT_055B = row.LAT_UND_MT_055B,
              fileRow.LEFT_LAT_UND_MT_056 = row.LEFT_LAT_UND_MT_056,

              fileRow.DECK_COND_058 = row.DECK_COND_058,
              fileRow.SUPERSTRUCTURE_COND_059 = row.SUPERSTRUCTURE_COND_059,
              fileRow.SUBSTRUCTURE_COND_060 = row.SUBSTRUCTURE_COND_060,
              fileRow.CHANNEL_COND_061 = row.CHANNEL_COND_061,
              fileRow.CULVERT_COND_062 = row.CULVERT_COND_062,

              fileRow.OPR_RATING_METH_063 = row.OPR_RATING_METH_063,
              fileRow.OPERATING_RATING_064 = row.OPERATING_RATING_064,

              fileRow.INV_RATING_METH_065 = row.INV_RATING_METH_065,
              fileRow.INVENTORY_RATING_066 = row.INVENTORY_RATING_066,

              fileRow.STRUCTURAL_EVAL_067 = row.STRUCTURAL_EVAL_067,
              fileRow.DECK_GEOMETRY_EVAL_068 = row.DECK_GEOMETRY_EVAL_068,
              fileRow.UNDCLRENCE_EVAL_069 = row.UNDCLRENCE_EVAL_069,
              fileRow.POSTING_EVAL_070 = row.POSTING_EVAL_070,
              fileRow.WATERWAY_EVAL_071 = row.WATERWAY_EVAL_071,
              fileRow.APPR_ROAD_EVAL_072 = row.APPR_ROAD_EVAL_072,

              fileRow.WORK_PROPOSED_075A = row.WORK_PROPOSED_075A,
              fileRow.WORK_DONE_BY_075B = row.WORK_DONE_BY_075B,
              fileRow.IMP_LEN_MT_076 = row.IMP_LEN_MT_076,

              fileRow.DATE_OF_INSPECT_090 = row.DATE_OF_INSPECT_090,
              fileRow.INSPECT_FREQ_MONTHS_091 = row.INSPECT_FREQ_MONTHS_091,
              fileRow.FRACTURE_092A = row.FRACTURE_092A,
              fileRow.UNDWATER_LOOK_SEE_092B = row.UNDWATER_LOOK_SEE_092B,
              fileRow.SPEC_INSPECT_092C = row.SPEC_INSPECT_092C,
              fileRow.FRACTURE_LAST_DATE_093A = row.FRACTURE_LAST_DATE_093A,
              fileRow.UNDWATER_LAST_DATE_093B = row.UNDWATER_LAST_DATE_093B,
              fileRow.SPEC_LAST_DATE_093C = row.SPEC_LAST_DATE_093C,
              fileRow.BRIDGE_IMP_COST_094 = row.BRIDGE_IMP_COST_094,
              fileRow.ROADWAY_IMP_COST_095 = row.ROADWAY_IMP_COST_095,
              fileRow.TOTAL_IMP_COST_096 = row.TOTAL_IMP_COST_096,
              fileRow.YEAR_OF_IMP_097 = row.YEAR_OF_IMP_097,
              fileRow.OTHER_STATE_CODE_098A = row.OTHER_STATE_CODE_098A,
              fileRow.OTHER_STATE_PCNT_098B = row.OTHER_STATE_PCNT_098B,
              fileRow.OTHR_STATE_STRUC_NO_099 = row.OTHR_STATE_STRUC_NO_099,
              fileRow.STRAHNET_HIGHWAY_100 = row.STRAHNET_HIGHWAY_100,
              fileRow.PARALLEL_STRUCTURE_101 = row.PARALLEL_STRUCTURE_101,
              fileRow.TRAFFIC_DIRECTION_102 = row.TRAFFIC_DIRECTION_102,
              fileRow.TEMP_STRUCTURE_103 = row.TEMP_STRUCTURE_103,
              fileRow.HIGHWAY_SYSTEM_104 = row.HIGHWAY_SYSTEM_104,
              fileRow.FEDERAL_LANDS_105 = row.FEDERAL_LANDS_105,
              fileRow.YEAR_RECONSTRUCTED_106 = row.YEAR_RECONSTRUCTED_106,
              fileRow.DECK_STRUCTURE_TYPE_107 = row.DECK_STRUCTURE_TYPE_107,
              fileRow.SURFACE_TYPE_108A = row.SURFACE_TYPE_108A,
              fileRow.MEMBRANE_TYPE_108B = row.MEMBRANE_TYPE_108B,
              fileRow.DECK_PROTECTION_108C = row.DECK_PROTECTION_108C,
              fileRow.PERCENT_ADT_TRUCK_109 = row.PERCENT_ADT_TRUCK_109,
              fileRow.NATIONAL_NETWORK_110 = row.NATIONAL_NETWORK_110,
              fileRow.PIER_PROTECTION_111 = row.PIER_PROTECTION_111,
              fileRow.BRIDGE_LEN_IND_112 = row.BRIDGE_LEN_IND_112,
              fileRow.SCOUR_CRITICAL_113 = row.SCOUR_CRITICAL_113,
              fileRow.FUTURE_ADT_114 = row.FUTURE_ADT_114,
              fileRow.YEAR_OF_FUTURE_ADT_115 = row.YEAR_OF_FUTURE_ADT_115,
              fileRow.MIN_NAV_CLR_MT_116 = row.MIN_NAV_CLR_MT_116,
              fileRow.FED_AGENCY = row.FED_AGENCY,
              fileRow.DATE_LAST_UPDATE = row.DATE_LAST_UPDATE,
              fileRow.TYPE_LAST_UPDATE = row.TYPE_LAST_UPDATE,
              fileRow.DEDUCT_CODE = row.DEDUCT_CODE,
              fileRow.REMARKS = row.REMARKS,
              fileRow.PROGRAM_CODE = row.PROGRAM_CODE,
              fileRow.PROJ_NO = row.PROJ_NO,
              fileRow.PROJ_SUFFIX = row.PROJ_SUFFIX,
              fileRow.NBI_TYPE_OF_IMP = row.NBI_TYPE_OF_IMP,
              fileRow.DTL_TYPE_OF_IMP = row.DTL_TYPE_OF_IMP,
              fileRow.SPECIAL_CODE = row.SPECIAL_CODE,
              fileRow.STEP_CODE = row.STEP_CODE,
              fileRow.STATUS_WITH_10YR_RULE = row.STATUS_WITH_10YR_RULE,
              fileRow.SUFFICIENCY_ASTERC = row.SUFFICIENCY_ASTERC,
              fileRow.SUFFICIENCY_RATING = row.SUFFICIENCY_RATING,
              fileRow.STATUS_NO_10YR_RULE = row.STATUS_NO_10YR_RULE










// Data loaded from https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm via define URLs stored in Google Sheet
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A/export?format=csv&id=1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A&gid=1318941318" AS row1
// Data loaded from files downloaded at https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm and stored in the "import" folder for the database instance
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY/export?format=csv&id=1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY&gid=749188439" AS row1
WITH CASE
  WHEN NOT row1.Year IS NULL THEN collect(row1.URL)
    END AS fileURLs
UNWIND fileURLs as fileURL
MERGE (file:File {url: fileURL})
ON CREATE SET file.url = fileURL
WITH file
CALL apoc.periodic.iterate(
'
LOAD CSV WITH HEADERS FROM $url AS row RETURN row, $url AS file_url
','
MERGE (file:File {url: file_url})
MERGE (fileRow:FileRow {urlRow: file_url + row})
MERGE (file)<-[:ROW_OF]-(fileRow)
ON CREATE SET //file.url = file_url,

              fileRow.urlRow = file_url + row,
              
              fileRow.STATE_CODE_001 = row.STATE_CODE_001,
              fileRow.HIGHWAY_DISTRICT_002 = row.HIGHWAY_DISTRICT_002,
              fileRow.COUNTY_CODE_003 = row.COUNTY_CODE_003,
              fileRow.PLACE_CODE_004 = row.PLACE_CODE_004,
              fileRow.RECORD_TYPE_005A = row.RECORD_TYPE_005A,
              fileRow.ROUTE_PREFIX_005B = row.ROUTE_PREFIX_005B,
              fileRow.SERVICE_LEVEL_005C = row.SERVICE_LEVEL_005C,
              fileRow.ROUTE_NUMBER_005D = row.ROUTE_NUMBER_005D,
              fileRow.DIRECTION_005E = row.DIRECTION_005E,
              fileRow.FEATURES_DESC_006A = row.FEATURES_DESC_006A,
              fileRow.CRITICAL_FACILITY_006B = row.CRITICAL_FACILITY_006B,
              fileRow.FACILITY_CARRIED_007 = row.FACILITY_CARRIED_007,
              fileRow.STRUCTURE_NUMBER_008 = row.STRUCTURE_NUMBER_008,
              fileRow.LOCATION_009 = row.LOCATION_009,
              fileRow.MIN_VERT_CLR_010 = row.MIN_VERT_CLR_010,
              fileRow.KILOPOINT_011 = row.KILOPOINT_011,
              fileRow.BASE_HWY_NETWORK_012 = row.BASE_HWY_NETWORK_012,
              fileRow.LRS_INV_ROUTE_013A = row.LRS_INV_ROUTE_013A,
              fileRow.SUBROUTE_NO_013B = row.SUBROUTE_NO_013B,
              fileRow.LAT_016 = row.LAT_016,
              fileRow.LONG_017 = row.LONG_017,

              fileRow.DETOUR_KILOS_019 = row.DETOUR_KILOS_019,
              fileRow.  = row.TOLL_020,
              fileRow.MAINTENANCE_021 = row.MAINTENANCE_021,
              fileRow.OWNER_022 = row.OWNER_022,

              fileRow.FUNCTIONAL_CLASS_026 = row.FUNCTIONAL_CLASS_026,
              fileRow.YEAR_BUILT_027 = row.YEAR_BUILT_027,
              fileRow.TRAFFIC_LANES_ON_028A = row.TRAFFIC_LANES_ON_028A,
              fileRow.TRAFFIC_LANES_UND_028B = row.TRAFFIC_LANES_UND_028B,
              fileRow.ADT_029 = row.ADT_029,
              fileRow.YEAR_ADT_030 = row.YEAR_ADT_030,
              fileRow.DESIGN_LOAD_031 = row.DESIGN_LOAD_031,
              fileRow.APPR_WIDTH_MT_032 = row.APPR_WIDTH_MT_032,
              fileRow.MEDIAN_CODE_033 = row.MEDIAN_CODE_033,
              fileRow.DEGREES_SKEW_034 = row.DEGREES_SKEW_034,
              fileRow.STRUCTURE_FLARED_035 = row.STRUCTURE_FLARED_035,
              fileRow.RAILINGS_036A = row.RAILINGS_036A,
              fileRow.TRANSITIONS_036B = row.TRANSITIONS_036B,
              fileRow.APPR_RAIL_036C = row.APPR_RAIL_036C,
              fileRow.APPR_RAIL_END_036D = row.APPR_RAIL_END_036D,
              fileRow.HISTORY_037 = row.HISTORY_037,
              fileRow.NAVIGATION_038 = row.NAVIGATION_038,
              fileRow.NAV_VERT_CLR_MT_039 = row.NAV_VERT_CLR_MT_039,
              fileRow.NAV_HORR_CLR_MT_040 = row.NAV_HORR_CLR_MT_040,
              fileRow.OPEN_CLOSED_POSTED_041 = row.OPEN_CLOSED_POSTED_041,
              fileRow.SERVICE_ON_042A = row.SERVICE_ON_042A,
              fileRow.SERVICE_UND_042B = row.SERVICE_UND_042B,
              fileRow.STRUCTURE_KIND_043A = row.STRUCTURE_KIND_043A,
              fileRow.STRUCTURE_TYPE_043B = row.STRUCTURE_TYPE_043B,
              fileRow.APPR_KIND_044A = row.APPR_KIND_044A,
              fileRow.APPR_TYPE_044B = row.APPR_TYPE_044B,
              fileRow.MAIN_UNIT_SPANS_045 = row.MAIN_UNIT_SPANS_045,
              fileRow.APPR_SPANS_046 = row.APPR_SPANS_046,
              fileRow.HORR_CLR_MT_047 = row.HORR_CLR_MT_047,
              fileRow.MAX_SPAN_LEN_MT_048 = row.MAX_SPAN_LEN_MT_048,
              fileRow.STRUCTURE_LEN_MT_049 = row.STRUCTURE_LEN_MT_049,
              fileRow.LEFT_CURB_MT_050A = row.LEFT_CURB_MT_050A,
              fileRow.RIGHT_CURB_MT_050B = row.RIGHT_CURB_MT_050B,
              fileRow.ROADWAY_WIDTH_MT_051 = row.ROADWAY_WIDTH_MT_051,
              fileRow.DECK_WIDTH_MT_052 = row.DECK_WIDTH_MT_052,
              fileRow.VERT_CLR_OVER_MT_053 = row.VERT_CLR_OVER_MT_053,
              fileRow.VERT_CLR_UND_REF_054A = row.VERT_CLR_UND_REF_054A,
              fileRow.VERT_CLR_UND_054B = row.VERT_CLR_UND_054B,
              fileRow.LAT_UND_REF_055A = row.LAT_UND_REF_055A,
              fileRow.LAT_UND_MT_055B = row.LAT_UND_MT_055B,
              fileRow.LEFT_LAT_UND_MT_056 = row.LEFT_LAT_UND_MT_056,

              fileRow.DECK_COND_058 = row.DECK_COND_058,
              fileRow.SUPERSTRUCTURE_COND_059 = row.SUPERSTRUCTURE_COND_059,
              fileRow.SUBSTRUCTURE_COND_060 = row.SUBSTRUCTURE_COND_060,
              fileRow.CHANNEL_COND_061 = row.CHANNEL_COND_061,
              fileRow.CULVERT_COND_062 = row.CULVERT_COND_062,

              fileRow.OPR_RATING_METH_063 = row.OPR_RATING_METH_063,
              fileRow.OPERATING_RATING_064 = row.OPERATING_RATING_064,

              fileRow.INV_RATING_METH_065 = row.INV_RATING_METH_065,
              fileRow.INVENTORY_RATING_066 = row.INVENTORY_RATING_066,

              fileRow.STRUCTURAL_EVAL_067 = row.STRUCTURAL_EVAL_067,
              fileRow.DECK_GEOMETRY_EVAL_068 = row.DECK_GEOMETRY_EVAL_068,
              fileRow.UNDCLRENCE_EVAL_069 = row.UNDCLRENCE_EVAL_069,
              fileRow.POSTING_EVAL_070 = row.POSTING_EVAL_070,
              fileRow.WATERWAY_EVAL_071 = row.WATERWAY_EVAL_071,
              fileRow.APPR_ROAD_EVAL_072 = row.APPR_ROAD_EVAL_072,

              fileRow.WORK_PROPOSED_075A = row.WORK_PROPOSED_075A,
              fileRow.WORK_DONE_BY_075B = row.WORK_DONE_BY_075B,
              fileRow.IMP_LEN_MT_076 = row.IMP_LEN_MT_076,

              fileRow.DATE_OF_INSPECT_090 = row.DATE_OF_INSPECT_090,
              fileRow.INSPECT_FREQ_MONTHS_091 = row.INSPECT_FREQ_MONTHS_091,
              fileRow.FRACTURE_092A = row.FRACTURE_092A,
              fileRow.UNDWATER_LOOK_SEE_092B = row.UNDWATER_LOOK_SEE_092B,
              fileRow.SPEC_INSPECT_092C = row.SPEC_INSPECT_092C,
              fileRow.FRACTURE_LAST_DATE_093A = row.FRACTURE_LAST_DATE_093A,
              fileRow.UNDWATER_LAST_DATE_093B = row.UNDWATER_LAST_DATE_093B,
              fileRow.SPEC_LAST_DATE_093C = row.SPEC_LAST_DATE_093C,
              fileRow.BRIDGE_IMP_COST_094 = row.BRIDGE_IMP_COST_094,
              fileRow.ROADWAY_IMP_COST_095 = row.ROADWAY_IMP_COST_095,
              fileRow.TOTAL_IMP_COST_096 = row.TOTAL_IMP_COST_096,
              fileRow.YEAR_OF_IMP_097 = row.YEAR_OF_IMP_097,
              fileRow.OTHER_STATE_CODE_098A = row.OTHER_STATE_CODE_098A,
              fileRow.OTHER_STATE_PCNT_098B = row.OTHER_STATE_PCNT_098B,
              fileRow.OTHR_STATE_STRUC_NO_099 = row.OTHR_STATE_STRUC_NO_099,
              fileRow.STRAHNET_HIGHWAY_100 = row.STRAHNET_HIGHWAY_100,
              fileRow.PARALLEL_STRUCTURE_101 = row.PARALLEL_STRUCTURE_101,
              fileRow.TRAFFIC_DIRECTION_102 = row.TRAFFIC_DIRECTION_102,
              fileRow.TEMP_STRUCTURE_103 = row.TEMP_STRUCTURE_103,
              fileRow.HIGHWAY_SYSTEM_104 = row.HIGHWAY_SYSTEM_104,
              fileRow.FEDERAL_LANDS_105 = row.FEDERAL_LANDS_105,
              fileRow.YEAR_RECONSTRUCTED_106 = row.YEAR_RECONSTRUCTED_106,
              fileRow.DECK_STRUCTURE_TYPE_107 = row.DECK_STRUCTURE_TYPE_107,
              fileRow.SURFACE_TYPE_108A = row.SURFACE_TYPE_108A,
              fileRow.MEMBRANE_TYPE_108B = row.MEMBRANE_TYPE_108B,
              fileRow.DECK_PROTECTION_108C = row.DECK_PROTECTION_108C,
              fileRow.PERCENT_ADT_TRUCK_109 = row.PERCENT_ADT_TRUCK_109,
              fileRow.NATIONAL_NETWORK_110 = row.NATIONAL_NETWORK_110,
              fileRow.PIER_PROTECTION_111 = row.PIER_PROTECTION_111,
              fileRow.BRIDGE_LEN_IND_112 = row.BRIDGE_LEN_IND_112,
              fileRow.SCOUR_CRITICAL_113 = row.SCOUR_CRITICAL_113,
              fileRow.FUTURE_ADT_114 = row.FUTURE_ADT_114,
              fileRow.YEAR_OF_FUTURE_ADT_115 = row.YEAR_OF_FUTURE_ADT_115,
              fileRow.MIN_NAV_CLR_MT_116 = row.MIN_NAV_CLR_MT_116,
              fileRow.FED_AGENCY = row.FED_AGENCY,
              fileRow.DATE_LAST_UPDATE = row.DATE_LAST_UPDATE,
              fileRow.TYPE_LAST_UPDATE = row.TYPE_LAST_UPDATE,
              fileRow.DEDUCT_CODE = row.DEDUCT_CODE,
              fileRow.REMARKS = row.REMARKS,
              fileRow.PROGRAM_CODE = row.PROGRAM_CODE,
              fileRow.PROJ_NO = row.PROJ_NO,
              fileRow.PROJ_SUFFIX = row.PROJ_SUFFIX,
              fileRow.NBI_TYPE_OF_IMP = row.NBI_TYPE_OF_IMP,
              fileRow.DTL_TYPE_OF_IMP = row.DTL_TYPE_OF_IMP,
              fileRow.SPECIAL_CODE = row.SPECIAL_CODE,
              fileRow.STEP_CODE = row.STEP_CODE,
              fileRow.STATUS_WITH_10YR_RULE = row.STATUS_WITH_10YR_RULE,
              fileRow.SUFFICIENCY_ASTERC = row.SUFFICIENCY_ASTERC,
              fileRow.SUFFICIENCY_RATING = row.SUFFICIENCY_RATING,
              fileRow.STATUS_NO_10YR_RULE = row.STATUS_NO_10YR_RULE
',
{batchSize:1000, parallel:false, params:{url:file.url}}) YIELD batches, total
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
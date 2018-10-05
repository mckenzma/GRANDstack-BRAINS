CALL apoc.periodic.iterate("
UNWIND ['file:///MN14.csv', 'file:///AK14.csv'] AS file
LOAD CSV WITH HEADERS FROM file AS row RETURN row",
"
MERGE (bridge:Bridge {id: row.STRUCTURE_NUMBER_008})
MERGE (place:Place {id: row.PLACE_CODE_004})
MERGE (county:County {id: row.COUNTY_CODE_003})
MERGE (state:State {id: row.STATE_CODE_001})
MERGE (owner:Owner {id: row.OWNER_022})
MERGE (maintResp:MaintenanceResp {id: row.MAINTENANCE_021})
MERGE (toll:Toll {id: row.TOLL_020})
MERGE (funcClass:FunctionalClass {id: row.FUNCTIONAL_CLASS_026})
MERGE (servOn:ServiceOn {id: row.SERVICE_ON_042A})
MERGE (servUnder:ServiceUnder {id: row.SERVICE_UND_042B})
MERGE (mainStructKind:MainStructKind {id: row.STRUCTURE_KIND_043A})
MERGE (mainStructType:MainStructType {id: row.STRUCTURE_TYPE_043B})
MERGE (apprStructKind:ApprStructKind {id: row.APPR_KIND_044A})
MERGE (apprStructType:ApprStructType {id: row.APPR_TYPE_044B})
MERGE (inspDate:InspectionDate {id: row.DATE_OF_INSPECT_090})
MERGE (bridge)-[:OF_PLACE]->(place)
MERGE (place)-[:OF_COUNTY]->(county)
MERGE (county)-[:OF_STATE]->(state)
MERGE (bridge)-[:OWNED_BY]->(owner)
MERGE (bridge)-[:MAINTAINED_BY]->(maintResp)
MERGE (bridge)-[:HAS_TOLL]->(toll)
MERGE (bridge)-[:HAS_FUNC_CLASS]->(funcClass)
MERGE (bridge)-[:HAS_SERVICE_TYPE]->(servOn)
MERGE (bridge)-[:HAS_SERVICE_TYPE]->(servUnder)
MERGE (bridge)-[:HAS_MAIN_STRUCTURE_TYPE]->(mainStructType)
MERGE (bridge)-[:HAS_MAIN_STRUCTURE_TYPE]->(mainStructKind)
MERGE (bridge)-[:HAS_APPR_STRUCTURE_TYPE]->(apprStructType)
MERGE (bridge)-[:HAS_APPR_STRUCTURE_TYPE]->(apprStructKind)
MERGE (bridge)-[:INSPECTED_ON]->(inspDate)
ON CREATE SET bridge.name = row.STRUCTURE_NUMBER_008,
			  bridge.latitude = row.LAT_016,
			  bridge.longitude = row.LONG_017,
			  bridge.yearbuilt = row.YEAR_BUILT_027,
			  place.name = row.PLACE_CODE_004,
			  county.name = row.COUNTY_CODE_003,
			  state.name = row.STATE_CODE_001,
			  owner.name = row.OWNER_022,
			  maintResp.name = row.MAINTENANCE_021
",
{batchSize:1000,iterateList:true});


// build state, county, place like a timeline tree
CALL apoc.periodic.iterate("
UNWIND ['file:///MN14.csv', 'file:///AK14.csv'] AS file
LOAD CSV WITH HEADERS FROM file AS row RETURN row",
"
MERGE (state:State {id: row.STATE_CODE_001})
MERGE (state)<-[:OF_STATE]-(county:County {id: row.COUNTY_CODE_003})
MERGE (county)<-[:OF_COUNTY]-(place:Place {id: row.PLACE_CODE_004})
MERGE (place)<-[:OF_PLACE]-(bridge:Bridge {id: row.STRUCTURE_NUMBER_008})
ON CREATE SET bridge.name = row.STRUCTURE_NUMBER_008,
			  bridge.latitude = row.LAT_016,
			  bridge.longitude = row.LONG_017,
			  bridge.yearbuilt = row.YEAR_BUILT_027,
			  
			  bridge.deck_cond = row.DECK_COND_058,
			  bridge.superstructure_cond = row.SUPERSTRUCTURE_COND_059,
			  bridge.substructure_cond = row.SUBSTRUCTURE_COND_060,
			  bridge.channel_cond = row.CHANNEL_COND_061,
			  bridge.culvert_cond = row.CULVERT_COND_062,

			  bridge.structural_eval = row.STRUCTURAL_EVAL_067,
			  bridge.deck_geometry_eval = row.DECK_GEOMETRY_EVAL_068,
			  bridge.undclrence_eval = row.UNDCLRENCE_EVAL_069,
			  bridge.posting_eval = row.POSTING_EVAL_070,
			  bridge.waterway_eval = row.WATERWAY_EVAL_071,
			  bridge.appr_road_eval = row.APPR_ROAD_EVAL_072,
			  
			  place.name = row.PLACE_CODE_004,
			  county.name = row.COUNTY_CODE_003,
			  state.name = row.STATE_CODE_001
",
{batchSize:1000,iterateList:true});

// count number of bridges built each year
MATCH (bridge:Bridge)
RETURN bridge.yearbuilt, count(bridge.yearbuilt)
ORDER BY bridge.yearbuilt


// build timeline tree
MATCH (inspDate:InspectionDate)
MERGE (year:Year {id: inspDate.year})
MERGE (year)-[:MONTH]->(month:Month {id: inspDate.month})

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

// connect (:InspectionDate) to (:Month) in timeline tree
MATCH (bridge:Bridge)-[:INSPECTED_ON]->(inspDate:InspectionDate)
MATCH (year:Year {id: inspDate.year})-[:MONTH]->(month:Month {id: inspDate.month})
MERGE (inspDate)-[:DATE_OF_INSPECTION]->(month)

// Create Condition Rating Nodes
UNWIND ['N', '9', '8', '7', '6', '5', '4', '3', '2', '1', '0'] AS code
CREATE (:ConditionRating {id: code})

// Create Appraisal Rating Nodes
UNWIND ['N', '9', '8', '7', '6', '5', '4', '3', '2', '1', '0'] AS code
CREATE (:AppraisalRating {id: code})




//STATE_CODE_001
HIGHWAY_DISTRICT_002
//COUNTY_CODE_003
//PLACE_CODE_004
RECORD_TYPE_005A
ROUTE_PREFIX_005B
SERVICE_LEVEL_005C
ROUTE_NUMBER_005D
DIRECTION_005E
FEATURES_DESC_006A
CRITICAL_FACILITY_006B
FACILITY_CARRIED_007
//STRUCTURE_NUMBER_008
LOCATION_009
MIN_VERT_CLR_010
KILOPOINT_011
BASE_HWY_NETWORK_012
LRS_INV_ROUTE_013A
SUBROUTE_NO_013B
//LAT_016
//LONG_017

DETOUR_KILOS_019
//TOLL_020
//MAINTENANCE_021
//OWNER_022

//FUNCTIONAL_CLASS_026
//YEAR_BUILT_027
TRAFFIC_LANES_ON_028A
TRAFFIC_LANES_UND_028B
ADT_029
YEAR_ADT_030
DESIGN_LOAD_031
APPR_WIDTH_MT_032
MEDIAN_CODE_033
DEGREES_SKEW_034
STRUCTURE_FLARED_035
RAILINGS_036A
TRANSITIONS_036B
APPR_RAIL_036C
APPR_RAIL_END_036D
HISTORY_037
NAVIGATION_038
NAV_VERT_CLR_MT_039
NAV_HORR_CLR_MT_040
OPEN_CLOSED_POSTED_041
//SERVICE_ON_042A
//SERVICE_UND_042B
//STRUCTURE_KIND_043A
//STRUCTURE_TYPE_043B
//APPR_KIND_044A
//APPR_TYPE_044B
MAIN_UNIT_SPANS_045
APPR_SPANS_046
HORR_CLR_MT_047
MAX_SPAN_LEN_MT_048
STRUCTURE_LEN_MT_049
LEFT_CURB_MT_050A
RIGHT_CURB_MT_050B
ROADWAY_WIDTH_MT_051
DECK_WIDTH_MT_052
VERT_CLR_OVER_MT_053
VERT_CLR_UND_REF_054A
VERT_CLR_UND_054B
LAT_UND_REF_055A
LAT_UND_MT_055B
LEFT_LAT_UND_MT_056

DECK_COND_058
SUPERSTRUCTURE_COND_059
SUBSTRUCTURE_COND_060
CHANNEL_COND_061
CULVERT_COND_062

OPR_RATING_METH_063
OPERATING_RATING_064

INV_RATING_METH_065
INVENTORY_RATING_066

STRUCTURAL_EVAL_067
DECK_GEOMETRY_EVAL_068
UNDCLRENCE_EVAL_069
POSTING_EVAL_070
WATERWAY_EVAL_071
APPR_ROAD_EVAL_072

WORK_PROPOSED_075A
WORK_DONE_BY_075B
IMP_LEN_MT_076

//DATE_OF_INSPECT_090
INSPECT_FREQ_MONTHS_091
FRACTURE_092A
UNDWATER_LOOK_SEE_092B
SPEC_INSPECT_092C
FRACTURE_LAST_DATE_093A
UNDWATER_LAST_DATE_093B
SPEC_LAST_DATE_093C
BRIDGE_IMP_COST_094
ROADWAY_IMP_COST_095
TOTAL_IMP_COST_096
YEAR_OF_IMP_097
OTHER_STATE_CODE_098A
OTHER_STATE_PCNT_098B
OTHR_STATE_STRUC_NO_099
STRAHNET_HIGHWAY_100
PARALLEL_STRUCTURE_101
TRAFFIC_DIRECTION_102
TEMP_STRUCTURE_103
HIGHWAY_SYSTEM_104
FEDERAL_LANDS_105
YEAR_RECONSTRUCTED_106
DECK_STRUCTURE_TYPE_107
SURFACE_TYPE_108A
MEMBRANE_TYPE_108B
DECK_PROTECTION_108C
PERCENT_ADT_TRUCK_109
NATIONAL_NETWORK_110
PIER_PROTECTION_111
BRIDGE_LEN_IND_112
SCOUR_CRITICAL_113
FUTURE_ADT_114
YEAR_OF_FUTURE_ADT_115
MIN_NAV_CLR_MT_116
FED_AGENCY
DATE_LAST_UPDATE
TYPE_LAST_UPDATE
DEDUCT_CODE
REMARKS
PROGRAM_CODE
PROJ_NO
PROJ_SUFFIX
NBI_TYPE_OF_IMP
DTL_TYPE_OF_IMP
SPECIAL_CODE
STEP_CODE
STATUS_WITH_10YR_RULE
SUFFICIENCY_ASTERC
SUFFICIENCY_RATING
STATUS_NO_10YR_RULE

// creating Indexes for mass import
CREATE INDEX ON :Bridge(id);
CREATE INDEX ON :Place(id);
CREATE INDEX ON :County(id);
CREATE INDEX ON :State(id);
CREATE INDEX ON :Owner(id);
CREATE INDEX ON :MaintenanceResp(id);

// Loading data into the database
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A/export?format=csv&id=1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A&gid=1318941318" AS row1
WITH CASE
	WHEN NOT row1.Year IS NULL THEN collect(row1.URL)
    END AS fileURLs
//RETURN fileURLs
UNWIND fileURLs as fileURL
//RETURN fileURL
CALL apoc.periodic.iterate(
'
LOAD CSV WITH HEADERS FROM $url AS row RETURN row
//CALL apoc.load.csv($url) YIELD map AS row RETURN row
','
MERGE (state:State {id: row.STATE_CODE_001})
MERGE (state)<-[:OF_STATE]-(county:County {id: row.COUNTY_CODE_003})
MERGE (county)<-[:OF_COUNTY]-(place:Place {id: row.PLACE_CODE_004})
MERGE (place)<-[:OF_PLACE]-(bridge:Bridge {id: row.STRUCTURE_NUMBER_008})
ON CREATE SET bridge.name = row.STRUCTURE_NUMBER_008,
			  bridge.latitude = row.LAT_016,
			  bridge.longitude = row.LONG_017,
			  bridge.yearbuilt = row.YEAR_BUILT_027,
			  
			  //bridge.deck_cond = row.DECK_COND_058,
			  //bridge.superstructure_cond = row.SUPERSTRUCTURE_COND_059,
			  //bridge.substructure_cond = row.SUBSTRUCTURE_COND_060,
			  //bridge.channel_cond = row.CHANNEL_COND_061,
			  //bridge.culvert_cond = row.CULVERT_COND_062,
			  //bridge.structural_eval = row.STRUCTURAL_EVAL_067,
			  //bridge.deck_geometry_eval = row.DECK_GEOMETRY_EVAL_068,
			  //bridge.undclrence_eval = row.UNDCLRENCE_EVAL_069,
			  //bridge.posting_eval = row.POSTING_EVAL_070,
			  //bridge.waterway_eval = row.WATERWAY_EVAL_071,
			  //bridge.appr_road_eval = row.APPR_ROAD_EVAL_072,
			  
			  place.name = row.PLACE_CODE_004,
			  county.name = row.COUNTY_CODE_003,
			  state.name = row.STATE_CODE_001
',
{batchSize:1000, parallel:false, params:{url:fileURL}}) YIELD batches, total
RETURN batches, total


// this is to import files as listed in a CSV
LOAD CSV WITH HEADERS FROM "file:///NBIFilesListFiles.csv" AS line1
WITH collect("file:///"+line1.Folder+"/"+line1.File) as Files
UNWIND Files AS file
LOAD CSV WITH HEADERS FROM file AS row
RETURN row
LIMIT 10

CALL apoc.periodic.iterate(
"
LOAD CSV WITH HEADERS FROM 'file:///NBIFilesListFiles.csv' AS line1
WITH collect('file:///'+line1.Folder+'/'+line1.File) as Files
UNWIND Files AS file
LOAD CSV WITH HEADERS FROM file AS row RETURN row
",
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
{batchSize:1000,iterateList:true})

// this is not the correct query because it connects counties across statesb-- oops
CALL apoc.periodic.iterate("
UNWIND [
	'file:///AK14.csv',
	'file:///AL14.csv',
	'file:///AR14.csv',
	'file:///AZ14.csv',
	'file:///CA14.csv',
	'file:///CO14.csv',
	'file:///CT14.csv',
	'file:///DC14.csv',
	'file:///DE14.csv',
	'file:///FL14.csv',
	'file:///GA14.csv',
	'file:///HI14.csv',
	'file:///IA14.csv',
	'file:///ID14.csv',
	'file:///IL14.csv',
	'file:///IN14.csv',
	'file:///KS14.csv',
	'file:///LA14.csv',
	'file:///MA14.csv',
	'file:///MD14.csv',
	'file:///ME14.csv',
	'file:///MI14.csv',
	'file:///MN14.csv',
	'file:///MO14.csv',
	'file:///MS14.csv',
	'file:///MT14.csv',
	'file:///NC14.csv',
	'file:///ND14.csv',
	'file:///NE14.csv',
	'file:///NH14.csv',
	'file:///NJ14.csv',
	'file:///NM14.csv',
	'file:///AK14.csv',
	'file:///NV14.csv',
	'file:///NY14.csv',
	'file:///OH14.csv',
	'file:///OK14.csv',
	'file:///OR14.csv',
	'file:///PA14.csv',
	'file:///PR14.csv',
	'file:///RI14.csv',
	'file:///SC14.csv',
	'file:///SD14.csv',
	'file:///TN14.csv',
	'file:///TX14.csv',
	'file:///UT14.csv',
	'file:///VA14.csv',
	'file:///VT14.csv',
	'file:///WA14.csv',
	'file:///WI14.csv',
	'file:///WV14.csv',
	'file:///WY14.csv' 
	] AS file
LOAD CSV WITH HEADERS FROM file AS row RETURN row",
"
MERGE (bridge:Bridge {id: row.STRUCTURE_NUMBER_008})
MERGE (place:Place {id: row.PLACE_CODE_004})
MERGE (county:County {id: row.COUNTY_CODE_003})
MERGE (state:State {id: row.STATE_CODE_001})
MERGE (owner:Owner {id: row.OWNER_022})
MERGE (maintResp:MaintenanceResp {id: row.MAINTENANCE_021})
//MERGE (toll:Toll {id: row.TOLL_020})
//MERGE (funcClass:FunctionalClass {id: row.FUNCTIONAL_CLASS_026})
//MERGE (servOn:ServiceOn {id: row.SERVICE_ON_042A})
//MERGE (servUnder:ServiceUnder {id: row.SERVICE_UND_042B})
//MERGE (mainStructKind:MainStructKind {id: row.STRUCTURE_KIND_043A})
//MERGE (mainStructType:MainStructType {id: row.STRUCTURE_TYPE_043B})
//MERGE (apprStructKind:ApprStructKind {id: row.APPR_KIND_044A})
//MERGE (apprStructType:ApprStructType {id: row.APPR_TYPE_044B})
//MERGE (inspDate:InspectionDate {id: row.DATE_OF_INSPECT_090})
MERGE (bridge)-[:OF_PLACE]->(place)
MERGE (place)-[:OF_COUNTY]->(county)
MERGE (county)-[:OF_STATE]->(state)
MERGE (bridge)-[:OWNED_BY]->(owner)
MERGE (bridge)-[:MAINTAINED_BY]->(maintResp)
//MERGE (bridge)-[:HAS_TOLL]->(toll)
//MERGE (bridge)-[:HAS_FUNC_CLASS]->(funcClass)
//MERGE (bridge)-[:HAS_SERVICE_TYPE]->(servOn)
//MERGE (bridge)-[:HAS_SERVICE_TYPE]->(servUnder)
//MERGE (bridge)-[:HAS_MAIN_STRUCTURE_TYPE]->(mainStructType)
//MERGE (bridge)-[:HAS_MAIN_STRUCTURE_TYPE]->(mainStructKind)
//MERGE (bridge)-[:HAS_APPR_STRUCTURE_TYPE]->(apprStructType)
//MERGE (bridge)-[:HAS_APPR_STRUCTURE_TYPE]->(apprStructKind)
//MERGE (bridge)-[:INSPECTED_ON]->(inspDate)
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
UNWIND [
	'file:///AK14.csv',
	'file:///AL14.csv',
	'file:///AR14.csv',
	'file:///AZ14.csv',
	'file:///CA14.csv',
	'file:///CO14.csv',
	'file:///CT14.csv',
	'file:///DC14.csv',
	'file:///DE14.csv',
	'file:///FL14.csv',
	'file:///GA14.csv',
	'file:///HI14.csv',
	'file:///IA14.csv',
	'file:///ID14.csv',
	'file:///IL14.csv',
	'file:///IN14.csv',
	'file:///KS14.csv',
	'file:///LA14.csv',
	'file:///MA14.csv',
	'file:///MD14.csv',
	'file:///ME14.csv',
	'file:///MI14.csv',
	'file:///MN14.csv',
	'file:///MO14.csv',
	'file:///MS14.csv',
	'file:///MT14.csv',
	'file:///NC14.csv',
	'file:///ND14.csv',
	'file:///NE14.csv',
	'file:///NH14.csv',
	'file:///NJ14.csv',
	'file:///NM14.csv',
	'file:///AK14.csv',
	'file:///NV14.csv',
	'file:///NY14.csv',
	'file:///OH14.csv',
	'file:///OK14.csv',
	'file:///OR14.csv',
	'file:///PA14.csv',
	'file:///PR14.csv',
	'file:///RI14.csv',
	'file:///SC14.csv',
	'file:///SD14.csv',
	'file:///TN14.csv',
	'file:///TX14.csv',
	'file:///UT14.csv',
	'file:///VA14.csv',
	'file:///VT14.csv',
	'file:///WA14.csv',
	'file:///WI14.csv',
	'file:///WV14.csv',
	'file:///WY14.csv' 
	] AS file
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





// create (inspDate) nodes
CALL apoc.periodic.iterate("
UNWIND ['file:///MN14.csv', 'file:///AK14.csv'] AS file
LOAD CSV WITH HEADERS FROM file AS row RETURN row",
"
MERGE (inspDate:InspectionDate {id: row.DATE_OF_INSPECT_090})
",
{batchSize:1000,iterateList:true});

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

// build timeline tree
MATCH (inspDate:InspectionDate)
MERGE (year:Year {id: inspDate.year})
MERGE (year)-[:MONTH]->(month:Month {id: inspDate.month})
MERGE (month)-[:INSPECTED_ON]->(inspDate)


// connect bridge to year
MATCH (bridge:Bridge)
MERGE (year:Year {id: right(bridge.yearbuilt, 2)})
MERGE (bridge)-[:BUILT_ON]->(year)






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


// create (:Evaluation) and connect to (:InspectionDate) and (:Bridge)
CALL apoc.periodic.iterate("
UNWIND ['file:///MN14.csv', 'file:///AK14.csv'] AS file
LOAD CSV WITH HEADERS FROM file AS row RETURN row",
"
MATCH (bridge:Bridge {id: row.STRUCTURE_NUMBER_008})
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
//query to change state name from id to state letters
MATCH (state:State)
SET state.name = 
CASE state.name
	WHEN "01" THEN "AL"
    WHEN "02" THEN "AK"
    //WHEN "03" THEN ""
    WHEN "04" THEN "AZ"
    WHEN "05" THEN "AR"
    WHEN "06" THEN "CA"
    //WHEN "07" THEN ""
    WHEN "08" THEN "CO"
    WHEN "09" THEN "CT"
    WHEN "10" THEN "DE"
    WHEN "11" THEN "DC"
    WHEN "12" THEN "FL"
    WHEN "13" THEN "GA"
    //WHEN "14" THEN ""
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
    //WHEN "43" THEN ""
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
END


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
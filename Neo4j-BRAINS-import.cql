/////////////////////////////////////////////////////////////////////////////////
// This file represets all of the import queries to construct the graph database
// To build a copy of this, these should be completed in order as listed below
/////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////
// TODO: Consider splitting data between delimited vs no-delimiter data
// TODO: Add processing labels
/////////////////////////////////////////////////////////////////////////////////

// Create constraint & node key
//CREATE CONSTRAINT ON (bridge:Bridge) ASSERT (bridge.state_code, bridge.county_code, bridge.place_code, bridge.code) IS NODE KEY
//DROP CONSTRAINT ON (bridge:Bridge) ASSERT (bridge.state_code, bridge.county_code, bridge.place_code, bridge.code) IS NODE KEY
CREATE CONSTRAINT ON (bridge:Bridge) ASSERT (bridge.stateCode, bridge.countyCode, bridge.placeCode, bridge.code) IS NODE KEY

// Connect bridge to place
// connect bridge to existing (State)<--(County)<--(Place) tree
CALL apoc.periodic.iterate(
'
MATCH (bridge:Bridge)
WHERE NOT (bridge)-[:OF_PLACE]->()
RETURN bridge
','
MATCH (state:State {code: bridge.stateCode})
    <-[:OF_STATE]-(county:County {code: bridge.countyCode})
      <-[:OF_COUNTY]-(place:Place {code: bridge.placeCode})
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


// TEMPORARY
// Set lat/long props on (:Bridge)
// Done to let web app function correctly
CALL apoc.periodic.iterate(
'
MATCH (b:Bridge)-[:LATEST_LOCATION_LOG]->(log)
RETURN b, log.location AS location
','
WITH b,
   CASE WHEN location.latitude IS NULL THEN 0.0 ELSE location.latitude END AS latitude,
     CASE WHEN location.longitude IS NULL THEN 0.0 ELSE location.longitude END AS longitude  
SET b.latitude_decimal = latitude,
    b.longitude_decimal = longitude
'
,{batchSize:10000,parallel:false})


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


// Create Build Year Audit Log
CALL apoc.periodic.iterate(
'
MATCH (bridge:Bridge)
OPTIONAL MATCH (bridge)-[:LATEST_BUILD_YEAR_LOG]->(al)
WITH bridge, coalesce(al.year,0) AS year
MATCH (bridge)<-[:DATA_FOR]-(row:Row)<-[:CONTAINS]-(file:File)
WHERE file.year > year
RETURN bridge, row, file.year AS fYear
ORDER BY fYear
','
CREATE (newAL:AuditLog:BuildYearLog)
SET newAL.YEAR_BUILT_027 = toInteger(row.YEAR_BUILT_027),
    newAL.year = fYear
// switched up bridge alias because too lazy to change code
WITH bridge AS b, collect(newAL) AS items
WITH b, items, items[0] AS al
// going to possibly need this rel and old one
OPTIONAL MATCH (b)-[r:LATEST_BUILD_YEAR_LOG]->(ol) WHERE ol <> al
// go ahead and create new LATEST_BUILD_YEAR_LOG
CREATE (b)-[:LATEST_BUILD_YEAR_LOG]->(al)
// ugly foreach hack to find singleton items where there was an old one that needs deleting
FOREACH (al IN CASE WHEN r IS NOT NULL AND size(items) = 1 THEN items ELSE [] END |
DELETE r CREATE (al)-[:PREV_BUILD_YEAR_LOG]->(ol)
)
// now to handle bridges with more than one new log
WITH r, ol, b, items
WHERE size(items) > 1
// Create a chain (first entry linked to bridge already above)
UNWIND range(0, size(items) - 2) AS idx
WITH r, ol, b, items, items[idx] AS new, items[idx + 1] AS old
CREATE (new)-[:PREV_BUILD_YEAR_LOG]->(old)
// distinct back down and find the last
WITH DISTINCT r, ol, b, items
WITH r, ol, b, items[size(items) - 1] AS lastAL
WHERE r IS NOT NULL
DELETE r
CREATE (lastAL)-[:PREV_BUILD_YEAR_LOG]->(ol)
',
{batchSize:5000,parallel:false})

// TEMPORARY
// Set buildYear prop on (:Bridge)
// Done to let web app function correctly
CALL apoc.periodic.iterate(
'
MATCH (b:Bridge)-[:LATEST_BUILD_YEAR_LOG]->(log)
RETURN b, log.YEAR_BUILT_027 AS year
','
SET b.buildYear = year
'
,{batchSize:10000,parallel:false})



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
MATCH (adj_bridge:Bridge {stateCode: left(row.OTHER_STATE_CODE_098A,2),
              bridgeCode: row.OTHR_STATE_STRUC_NO_099 })
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
     b1.bridgeCode AS B1,
       row2.OTHER_STATE_PCNT_098B AS B1_PCNT,
       labels(row2) AS labels2,
       [collect(DISTINCT row2.OTHER_STATE_PCNT_098B), collect(DISTINCT row1.OTHER_STATE_PCNT_098B)] AS PCNT_Pairs,
       s2.name AS S2,
       b2.bridgeCode AS B2,
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

//// Build (:State)<--(:County)<--(:Place)<--(:Bridge) tree
//CALL apoc.periodic.iterate(
//'
//MATCH (row:Row)
//WHERE NOT (row)-[:DATA_FOR]->()
//RETURN row
//','
//MATCH (state:State {code: row.STATE_CODE_001})
//MERGE (state)<-[:OF_STATE]-(county:County {code: row.COUNTY_CODE_003})
//MERGE (county)<-[:OF_COUNTY]-(place:Place {code: row.PLACE_CODE_004})
//MERGE (place)<-[:OF_PLACE]-(bridge:Bridge {id: row.STATE_CODE_001 + "_" + 
//                                               row.COUNTY_CODE_003 + "_" + 
//                                               row.PLACE_CODE_004 + "_" + 
//                                               row.STRUCTURE_NUMBER_008 + 
//                                               "_LAT_" + row.LAT_016 + 
//                                               "_LONG_" +row.LONG_017})
//ON CREATE SET bridge.name = row.STRUCTURE_NUMBER_008,
//        bridge.latitude = row.LAT_016,
//        bridge.longitude = row.LONG_017,
//        bridge.yearbuilt = toInteger(row.YEAR_BUILT_027),
//        
//        place.code = row.PLACE_CODE_004,
//        county.code = row.COUNTY_CODE_003,
//        state.code = row.STATE_CODE_001
//WITH row, bridge
//MERGE (row)-[:DATA_FOR]->(bridge)
//',
//{batchSize:10000,parallel:false}) YIELD batches, total
//RETURN batches, total



//// Add County Names
//CALL apoc.periodic.iterate(
//'
//WITH "https://docs.google.com/spreadsheets/d/1-aou_hSFK2JItter84JvUOHUfqJ9Ctjev0G48BF_OjQ/export?format=csv&id=1-aou_hSFK2JItter84JvUOHUfqJ9Ctjev0G48BF_OjQ&gid=726211642" AS fileURL
//LOAD CSV WITH HEADERS FROM fileURL AS row
//RETURN row
//','
//MATCH (state:State)<-[:OF_STATE]-(county)
//WHERE state.name = row.State
//AND county.code = row.`County Code`
//SET county.name = rtrim(row.`County Name`)
//',
//{batchSize:10000,parallel:false}) YIELD batches, total
//RETURN batches, total






//// Create Entity node and assiging -[:MAINTAINS]->(:Bridge), -[:OWNS]->(:Bridge) relationships
//// previously had these rels as separate nodes, but the encoding is the same. Uniting to 1 node and using 2 rels to create context
//// Can possibly separate depending on additional information assertained from NBI data
//CALL apoc.periodic.iterate(
//'
//MATCH (bridge:Bridge)
//RETURN bridge
//','
//MATCH (bridge)<-[:DATA_FOR]-(row:Row)
//WITH bridge, row.OWNER_022 AS ownerCode, row.MAINTENANCE_021 AS maintCode
//MERGE (entity:Entity {code: maintCode})
//ON CREATE SET entity.creadedOn = date()
//WITH bridge, ownerCode, maintCode
//MERGE (entity:Entity {code: ownerCode})
//ON CREATE SET entity.createdOn = date()
//WITH bridge, ownerCode, maintCode
//MATCH (owner:Entity {code: ownerCode})
//WITH bridge, owner, maintCode
//MATCH (maintainer:Entity {code: maintCode})
//MERGE (bridge)<-[:OWNS]-(owner)
//MERGE (bridge)<-[:MAINTAINS]-(maintainer)
//',
//{batchSize:10000,parallel:false}) YIELD batches, total
//RETURN batches, total







//// Load and connect :Owner and :MaintenanceResp to :Bridge
//// Data loaded from https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm via define URLs stored in Google Sheet
//LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A/export?format=csv&id=1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A&gid=1318941318" AS row1
//// Data loaded from files downloaded at https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm and stored in the "import" folder for the database instance
//LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY/export?format=csv&id=1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY&gid=749188439" AS row1
//WITH CASE
//	WHEN NOT row1.Year IS NULL THEN collect(row1.URL)
//    END AS fileURLs
//UNWIND fileURLs as fileURL
//CALL apoc.periodic.iterate(
//'
//LOAD CSV WITH HEADERS FROM $url AS row RETURN row
//','
//MATCH (bridge:Bridge {id: row.STATE_CODE_001 + "_" + 
//                          row.COUNTY_CODE_003 + "_" + 
//                          row.PLACE_CODE_004 + "_" + 
//                          row.STRUCTURE_NUMBER_008 + 
//                          "_LAT_" + row.LAT_016 + 
//                          "_LONG_" +row.LONG_017})
//MERGE (owner:Owner {id: row.OWNER_022})
//MERGE (maintResp:MaintenanceResp {id: row.MAINTENANCE_021})
//MERGE (bridge)-[:OWNED_BY]->(owner)
//MERGE (bridge)-[:MAINTAINED_BY]->(maintResp)
//ON CREATE SET owner.name = row.OWNER_022,
//			  maintResp.name = row.MAINTENANCE_021
//',
//{batchSize:10000, parallel:false, params:{url:fileURL}}) YIELD batches, total
//RETURN batches, total








//// Create (:Owner) node
//MATCH (file:File)
//WITH collect(file.url) AS fileURLs
//UNWIND fileURLs AS fileURL
//CALL apoc.periodic.iterate(
//'
//LOAD CSV WITH HEADERS FROM $url AS row 
//WITH row
//WHERE NOT row.OWNER_022 IS NULL
//RETURN row
//','
//MERGE (owner:Owner {id: row.OWNER_022})
//ON CREATE SET owner.id = row.OWNER_022
//',
//{batchSize:10000, parallel:false, params:{url:fileURL}}) YIELD batches, total
//RETURN batches, total

////query to add OWner Code Description
//MATCH (owner:Owner)
//SET owner.description = 
//CASE owner.id
//    WHEN "01" THEN "State Highway Agency"
//    WHEN "02" THEN "County Highway Agency"
//    WHEN "03" THEN "Town or Township Highway Agency"
//    WHEN "04" THEN "City or Municipal Highway Agency"
//    WHEN "11" THEN "State Park, Forest, or Reservation Agency"
//    WHEN "12" THEN "Local Park, Forest, or Reservation Agency"
//    WHEN "21" THEN "Other State Agencies"
//    WHEN "25" THEN "Othe Local Agencies"
//    WHEN "26" THEN "Private (other than railroad)"
//    WHEN "27" THEN "Railroad"
//    WHEN "31" THEN "State Toll Authority"
//    WHEN "32" THEN "Local Toll Authority"
//    WHEN "60" THEN "Other Federal Agencies"// (not listed below)"
//    WHEN "61" THEN "Indian Tribal Government"
//    WHEN "62" THEN "Bureau of Indian Affairs"
//    WHEN "63" THEN "Bureau of Fish and Wildlife"
//    WHEN "64" THEN "U.S. Forest Service"
//    WHEN "66" THEN "National Park Service"
//    WHEN "67" THEN "Tennessee Valley Authority"
//    WHEN "68" THEN "Bureau of Land Management"
//    WHEN "69" THEN "Bureau of Reclamation"
//    WHEN "70" THEN "Corps of Engineers (Civil)"
//    WHEN "71" THEN "Corps of Engineers (Military)"
//    WHEN "72" THEN "Air Force"
//    WHEN "73" THEN "Navy/Marines"
//    WHEN "74" THEN "Army"
//    WHEN "75" THEN "NASA"
//    WHEN "76" THEN "Metropolitan Washington Airports Service"
//    WHEN "80" THEN "Unkown"
//    ELSE "XXX - Need to review and update"
//END

//// Merge relationship between (:Owner) and (:Bridge) nodes
//MATCH (file:File)
//WITH collect(file.url) AS fileURLs
//UNWIND fileURLs AS fileURL
//CALL apoc.periodic.iterate(
//'
//LOAD CSV WITH HEADERS FROM $url AS row 
//WITH row
//WHERE NOT row.OWNER_022 IS NULL
//MATCH (bridge:Bridge {id: row.STATE_CODE_001 + "_" + 
//                          row.COUNTY_CODE_003 + "_" + 
//                          row.PLACE_CODE_004 + "_" + 
//                          row.STRUCTURE_NUMBER_008 + 
//                          "_LAT_" + row.LAT_016 + 
//                          "_LONG_" +row.LONG_017})
//MATCH (owner:Owner {id: row.OWNER_022})
//RETURN bridge, owner
//','
//MERGE (bridge)-[:OWNED_BY]->(owner)
//',
//{batchSize:10000, parallel:true, params:{url:fileURL}}) YIELD batches, total
//RETURN batches, total

//// Create (:MaintenanceResp) node
//MATCH (file:File)
//WITH collect(file.url) AS fileURLs
//UNWIND fileURLs AS fileURL
//CALL apoc.periodic.iterate(
//'
//LOAD CSV WITH HEADERS FROM $url AS row 
//WITH row
//WHERE NOT row.MAINTENANCE_021 IS NULL
//RETURN row
//','
//MERGE (maintResp:MaintenanceResp {id: row.MAINTENANCE_021})
//ON CREATE SET maintResp.id = row.MAINTENANCE_021
//',
//{batchSize:10000, parallel:false, params:{url:fileURL}}) YIELD batches, total
//RETURN batches, total

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

////query to add Maintenance Responsibility Code Description
//MATCH (maintResp:MaintenanceResp)
//SET maintResp.description = 
//CASE maintResp.id
//    WHEN "01" THEN "State Highway Agency"
//    WHEN "02" THEN "County Highway Agency"
//    WHEN "03" THEN "Town or Township Highway Agency"
//    WHEN "04" THEN "City or Municipal Highway Agency"
//    WHEN "11" THEN "State Park, Forest, or Reservation Agency"
//    WHEN "12" THEN "Local Park, Forest, or Reservation Agency"
//    WHEN "21" THEN "Other State Agencies"
//    WHEN "25" THEN "Othe Local Agencies"
//    WHEN "26" THEN "Private (other than railroad)"
//    WHEN "27" THEN "Railroad"
//    WHEN "31" THEN "State Toll Authority"
//    WHEN "32" THEN "Local Toll Authority"
//    WHEN "60" THEN "Other Federal Agencies"// (not listed below)"
//    WHEN "61" THEN "Indian Tribal Government"
//    WHEN "62" THEN "Bureau of Indian Affairs"
//    WHEN "63" THEN "Bureau of Fish and Wildlife"
//    WHEN "64" THEN "U.S. Forest Service"
//    WHEN "66" THEN "National Park Service"
//    WHEN "67" THEN "Tennessee Valley Authority"
//    WHEN "68" THEN "Bureau of Land Management"
//    WHEN "69" THEN "Bureau of Reclamation"
//    WHEN "70" THEN "Corps of Engineers (Civil)"
//    WHEN "71" THEN "Corps of Engineers (Military)"
//    WHEN "72" THEN "Air Force"
//    WHEN "73" THEN "Navy/Marines"
//    WHEN "74" THEN "Army"
//    WHEN "75" THEN "NASA"
//    WHEN "76" THEN "Metropolitan Washington Airports Service"
//    WHEN "80" THEN "Unkown"
//    ELSE "XXX - Need to review and update"
//END

//// Merge relationship between (:MaintenanceResp) and (:Bridge) nodes
//MATCH (file:File)
//WITH collect(file.url) AS fileURLs
//UNWIND fileURLs AS fileURL
//CALL apoc.periodic.iterate(
//'
//LOAD CSV WITH HEADERS FROM $url AS row 
//WITH row
//WHERE NOT row.MAINTENANCE_021 IS NULL
//MATCH (bridge:Bridge {id: row.STATE_CODE_001 + "_" + 
//                          row.COUNTY_CODE_003 + "_" + 
//                          row.PLACE_CODE_004 + "_" + 
//                          row.STRUCTURE_NUMBER_008 + 
//                          "_LAT_" + row.LAT_016 + 
//                          "_LONG_" +row.LONG_017})
//MATCH (maintResp:MaintenanceResp {id: row.MAINTENANCE_021})
//RETURN bridge, maintResp
//','
//MERGE (bridge)-[:MAINTAINED_BY]->(maintResp)
//',
//{batchSize:10000, parallel:true, params:{url:fileURL}}) YIELD batches, total
//RETURN batches, total










// // Convert Latitude and Longitude from initial import to point (spatial)
// CALL apoc.periodic.iterate('
// MATCH (bridge:Bridge)
// WHERE NOT bridge.latitude IS NULL
// AND NOT bridge.longitude IS NULL
// RETURN bridge
// ','
// WITH bridge,
//      toFloat(left(bridge.latitude, 2)) + toFloat(substring(bridge.latitude,2,2))/60 + toFloat(right(bridge.latitude,4))/100/3600 AS latitude_decimal,
//      size(bridge.longitude) AS long_size
// WITH bridge,
//      latitude_decimal,
//      CASE long_size
//         WHEN 8 THEN -1 * ( toFloat(left(bridge.longitude, 2)) + toFloat(substring(bridge.longitude,2,2))/60 + toFloat(right(bridge.longitude,4))/100/3600 )
//         WHEN 9 THEN -1 * ( toFloat(left(bridge.longitude, 3)) + toFloat(substring(bridge.longitude,3,2))/60 + toFloat(right(bridge.longitude,4))/100/3600 )
//      END AS longitude_decimal
// SET bridge.location = point({ longitude: longitude_decimal, latitude: latitude_decimal }),
//     bridge.longitude_decimal = longitude_decimal,
//     bridge.latitude_decimal = latitude_decimal
// ',
// {batchSize:10000, parallel:true}) YIELD batches, total
// RETURN batches, total





/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
// //WIP
// // Load and create :Inspection
// // leads to websocket failure
// MATCH (file:File)
// WHERE NOT (file)-[:CONTAINS]->(:Row)
// WITH collect(file.url) AS fileURLs
// UNWIND fileURLs AS fileURL
// CALL apoc.periodic.iterate(
// '
// LOAD CSV WITH HEADERS FROM $url AS row
// RETURN row
// ','
// CREATE (inspectionRaw:InspectionRaw {createdOn: date(),
//                      STATE_CODE_001: row.STATE_CODE_001,
//                         COUNTY_CODE_003: row.COUNTY_CODE_003,
//                         PLACE_CODE_004: row.PLACE_CODE_004,
//                         STRUCTURE_NUMBER_008: row.STRUCTURE_NUMBER_008,
//                         DECK_COND_058: row.DECK_COND_058,
//                         SUPERSTRUCTURE_COND_059: row.SUPERSTRUCTURE_COND_059,
//                         SUBSTRUCTURE_COND_060: row.SUBSTRUCTURE_COND_060,
//                         CHANNEL_COND_061: row.CHANNEL_COND_061,
//                         CULVERT_COND_062: row.CULVERT_COND_062,
//                         DATE_OF_INSPECT_090: row.DATE_OF_INSPECT_090})
// ',
// {batchSize:5000,parallel:false,params:{url:fileURL}}) YIELD batches, total
// RETURN batches, total




// // Load and create :InspectionDate
// // Data loaded from https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm via define URLs stored in Google Sheet
// LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A/export?format=csv&id=1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A&gid=1318941318" AS row1
// CREATE INDEX ON :InspectionDate(id);
// // Data loaded from files downloaded at https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm and stored in the "import" folder for the database instance
// LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY/export?format=csv&id=1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY&gid=749188439" AS row1
// WITH CASE
//     //WHEN NOT row1.Year IS NULL THEN collect([row1.URL,row1.Year])
//     WHEN NOT row1.Year IS NULL THEN collect(row1.URL)
//     END AS fileURLs
// UNWIND fileURLs as fileURL
// CALL apoc.periodic.iterate(
// '
// LOAD CSV WITH HEADERS FROM $url AS row RETURN row
// ','
// //MATCH (bridge:Bridge {id: row.STATE_CODE_001 + "_" + 
// //                          row.COUNTY_CODE_003 + "_" + 
// //                          row.PLACE_CODE_004 + "_" + 
// //                          row.STRUCTURE_NUMBER_008 + 
// //                          "_LAT_" + row.LAT_016 + 
// //                          "_LONG_" +row.LONG_017})
// MERGE (inspDate:InspectionDate {id: row.DATE_OF_INSPECT_090})
// //MERGE (bridge)-[:INSPECTED_ON]->(inspDate)
// ON CREATE SET inspDate.id = row.DATE_OF_INSPECT_090
// ',
// //{batchSize:10000, parallel:false, params:{url:fileURL[0], fileYear:fileURL[1]}}) YIELD batches, total
// {batchSize:5000, parallel:false, params:{url:fileURL}}) YIELD batches, total
// RETURN batches, total


// // need to update, clean, and change insp dates to temporal format
// LOAD CSV WITH HEADERS FROM "https://www.fhwa.dot.gov/bridge/nbi/2017/delimited/AL17.txt" AS row
// WITH row, replace(row.DATE_OF_INSPECT_090, " ", "") AS temp
// WITH row, temp, 
//     CASE size(temp)
//         //WHEN 3 THEN toInteger(left(temp,1))
//         WHEN 4 THEN toInteger(left(temp,2))
//     END AS month,
//     CASE 
//         WHEN ( toInteger(right(temp,2)) <= 99 AND toInteger(right(temp,2)) >= 92 ) THEN toInteger("19" + right(temp,2))
//         WHEN ( toInteger(right(temp,2)) >= 00 AND toInteger(right(temp,2)) < 92 ) THEN toInteger("20" + right(temp,2))
//     END AS year
// RETURN row.DATE_OF_INSPECT_090, size(row.DATE_OF_INSPECT_090), temp, month, year
// ORDER BY month

// CALL apoc.periodic.iterate(
// '
// MATCH (inspDate:InspectionDate) 
// //WHERE NOT exists(inspDate.date)
// //AND size(inspDate.id) = 4
// RETURN inspDate
// ','
// WITH inspDate,
//      CASE size(inspDate.id)
//         WHEN 3 THEN toInteger(left(inspDate.id,1))
//         WHEN 4 THEN toInteger(left(inspDate.id,2))
//     END AS month,
//     CASE
//         WHEN ( toInteger(right(inspDate.id,2)) <= 99 AND toInteger(right(inspDate.id,2)) >= 92 ) THEN toInteger("19" + right(inspDate.id,2))
//         WHEN ( toInteger(right(inspDate.id,2)) >= 00 AND toInteger(right(inspDate.id,2)) < 92 ) THEN toInteger("20" + right(inspDate.id,2))
//     END AS year
// SET inspDate.date = date({ year: year, month: month})
// ',
// {batchSize:1000,parallel:false}) YIELD batches, total
// RETURN batches, total

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////


// // Data loaded from files downloaded at https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm and stored in the "import" folder for the database instance
// LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY/export?format=csv&id=1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY&gid=749188439" AS row1
// WITH CASE
//     WHEN NOT row1.Year IS NULL THEN collect(row1.URL)
//     END AS fileURLs
// UNWIND fileURLs as fileURL
// CALL apoc.periodic.iterate(
// '
// LOAD CSV WITH HEADERS FROM $url AS row RETURN row
// ','
// MATCH (bridge:Bridge {id: row.STATE_CODE_001 + "_" + 
//                           row.COUNTY_CODE_003 + "_" + 
//                           row.PLACE_CODE_004 + "_" + 
//                           row.STRUCTURE_NUMBER_008 + 
//                           "_LAT_" + row.LAT_016 + 
//                           "_LONG_" +row.LONG_017})
// MERGE (structureKind:StructureKind {id: row.STRUCTURE_KIND_043A})
// MERGE (structureType:StructureType {id: row.STRUCTURE_TYPE_043B})
// MERGE (bridge)-[:HAS_STRUCTURE_KIND]->(structureKind)
// MERGE (bridge)-[:HAS_STRUCTURE_TYPE]->(structureType)
// ON CREATE SET structureKind.code = row.STRUCTURE_KIND_043A,
//               structureType.code = row.STRUCTURE_TYPE_043B
// ',
// {batchSize:10000, parallel:false, params:{url:fileURL}}) YIELD batches, total
// RETURN batches, total

// //query to add Structure Kind Code Description
// MATCH (structureKind:StructureKind)
// SET structureKind.description = 
// CASE structureKind.code
//     WHEN "1" THEN "Concrete"
//     WHEN "2" THEN "Concrete continuous"
//     WHEN "3" THEN "Steel"
//     WHEN "4" THEN "Steel continuous"
//     WHEN "5" THEN "Prestressed concrete (incl. Post-tension)"
//     WHEN "6" THEN "Prestressed concrete continous (incl. Post-tension)"
//     WHEN "7" THEN "Wood or Timber"
//     WHEN "8" THEN "Masonry"
//     WHEN "9" THEN "Aluminum, Wrought Iron, or Cast Iron"
//     WHEN "0" THEN "Other"
// END

// //query to add Structure Type Code Description
// MATCH (structureType:StructureType)
// SET structureType.description = 
// CASE structureType.code
//     WHEN "01" THEN "Slab"
//     WHEN "02" THEN "Stringer/Multi-beam or Girder"
//     WHEN "03" THEN "Girder and Floorbeam System"
//     WHEN "04" THEN "Tee Beam"
//     WHEN "05" THEN "Box Beam or Girders - Multiple"
//     WHEN "06" THEN "Box Beam or Girders - Single or Spread"
//     WHEN "07" THEN "Frame (except culverts)"
//     WHEN "08" THEN "Orthotropic"
//     WHEN "09" THEN "Truss - Deck"
//     WHEN "10" THEN "Truss - Thru"
//     WHEN "11" THEN "Arch - Deck"
//     WHEN "12" THEN "Arch - Thru"
//     WHEN "13" THEN "Suspension"
//     WHEN "14" THEN "Stayed Girder"
//     WHEN "15" THEN "Movable - Lift"
//     WHEN "16" THEN "Movable - Bascule"
//     WHEN "17" THEN "Movable - Swing"
//     WHEN "18" THEN "Tunnel"
//     WHEN "19" THEN "Culvert (includes frame culverts)"
//     WHEN "20" THEN "Mixed types *"
//     WHEN "21" THEN "Sergmental Box Girder"
//     WHEN "22" THEN "Channel Beam"
//     WHEN "00" THEN "Other"
// END

















// // trying to understand what data is valid
// MATCH (iD:InspectionDate)
// WHERE (size(replace(iD.id," ", "")) = 3 OR size(replace(iD.id," ", "")) = 4)
// AND NOT iD.id CONTAINS "."
// WITH iD, 
// 	 replace(iD.id," ", "") AS tempDate
// //RETURN replace(iD.id," ", ""), 
// //	   right(replace(iD.id," ", ""),2) AS year,
// //       CASE size(replace(iD.id," ", ""))
// //       	WHEN 3 THEN "0" + left(replace(iD.id," ", ""), 1)
// //        WHEN 4 THEN left(replace(iD.id," ", ""), 2)
// //       END AS month
// //ORDER BY year, month
// WITH iD,
// 	 tempDate,
// 	 right(tempDate, 2) AS year,
// 	 CASE size(tempDate)
// 	 	WHEN 3 THEN "0" + left(tempDate, 1)
// 	 	WHEN 4 THEN left(tempDate, 2)
// 	 END AS month
// RETURN iD.year, tempDate, year, month
// ORDER BY year, month
// //SET iD.date({ year})





// // set Inspection Date month and year properties
// MATCH (inspDate:InspectionDate)
// SET inspDate.year = right(inspDate.id, 2)
// WITH inspDate.year AS inspDateYear
// MATCH (inspDate:InspectionDate)
// WHERE size(inspDate.id) = 3
// SET inspDate.month = left(inspDate.id, 1)
// WITH inspDateYear, inspDate.month AS inspDateMonth
// MATCH (inspDate:InspectionDate)
// WHERE size(inspDate.id) = 4
// SET inspDate.month = left(inspDate.id, 2)







// // Create (:YearBuilt) and connect to (:Bridge)
// MATCH (bridge:Bridge)
// WHERE size(toString(bridge.yearbuilt)) = 4 //this ignores null values, and bridges where year recorded doesn't match designated format`
// WITH collect(DISTINCT bridge.yearbuilt) AS buildYears
// UNWIND buildYears as buildYear
// //MERGE (yearBuilt:YearBuilt {year: date({ year: buildYear})})
// MERGE(yearBuilt:YearBuilt {year: buildYear})
// WITH yearBuilt, buildYear
// CALL apoc.periodic.iterate(
// '
// MATCH (bridge:Bridge)
// WHERE bridge.yearbuilt = $build_year
// MATCH (yearBuilt:YearBuilt)
// //WHERE yearBuilt.year.year = $build_year
// WHERE yearBuilt.year = $build_year
// RETURN bridge, yearBuilt
// ',
// '
// MERGE (bridge)-[:BUILT_IN]->(yearBuilt)
// ',
// {batchSize:10000, parallel:true, params:{build_year:buildYear}}) YIELD batches, total
// RETURN batches, total











// // connect (:InspectionDate) to (:Month) in timeline tree
// MATCH (bridge:Bridge)-[:INSPECTED_ON]->(inspDate:InspectionDate)
// MATCH (year:Year {id: inspDate.year})-[:MONTH]->(month:Month {id: inspDate.month})
// MERGE (inspDate)-[:DATE_OF_INSPECTION]->(month)

// // Create Condition Rating Nodes
// UNWIND [['N', 'NOT APPLICABLE', ''], 
//         ['9', 'EXCELLENT CONDITION', ''],
//         ['8', 'VERY GOOD CONDITION', 'No problems noted.'],
//         ['7', 'GOOD CONDITION', 'Some minor problems.'],
//         ['6', 'SATISFACTORY CONDITION', 'structural elements show some minor deterioration.'],
//         ['5', 'FAIR CONDITION', 'All primary structural elements are sound but may have minor section loss, cracking, spalling or scour.'],
//         ['4', 'POOR CONDITION', 'Advanced section loss, deterioration, spalling or scour.'],
//         ['3', 'SERIOUS CONDITION', 'Loss of section, deterioration, spalling or scour have seriously affected primary structural components. Local failures are possible. Fatigue cracks in stell or shear cracks in concrete may be present.'],
//         ['2', 'CRITICAL CONDITION', 'Advanced deterioration of primary structural elements. Fatigue cracks in steel or shear cracks in concrete may be present or scour may have removed substructure support. Unless closesly monitored it may be necessary to close the bridge until corrective action is taken.'],
//         ['1', '"IMMINENT" FAILURE CONDITION', 'Major deterioration or section loss present in critical structural components or obvious vertical or horizontal movement affecting structure stability. Bridge is closed to traffic but corrective action may put back in light service.'],
//         ['0', 'FAILED CONDITION', 'Out of Service - Beyond corrective action.']] AS ratingCode
// CREATE (:ConditionRating {code: ratingCode[0], generalDescription: ratingCode[1], additionalDescription: ratingCode[2]})

// // Create Appraisal Rating Nodes
// UNWIND [['N', 'Not applicable'], 
//         ['9', 'Superior to present desirable criteria'],
//         ['8', 'Equal to present desirable criteria'],
//         ['7', 'Better than present minimum criteria'],
//         ['6', 'Equal to present minimum criteria'],
//         ['5', 'Somewhat better than minimum adequacy to tolerate being left in place as is'],
//         ['4', 'Meets minimum tolerable limits to be left in place as is'],
//         ['3', 'Basically intolerable requiring high priority of corrective action'],
//         ['2', 'Basically intolerable requiring high priority of replacement'],
//         ['1', 'This value of raiting cide not used'],
//         ['0', 'Bridge closed']] AS appraisalCode
// CREATE (:AppraisalRating {code: appraisalCode[0], description: appraisalCode[1]})


// // create (:Evaluation) and connect to (:InspectionDate) and (:Bridge)
// CALL apoc.periodic.iterate("
// UNWIND ['file:///MN14.csv', 'file:///AK14.csv'] AS file
// LOAD CSV WITH HEADERS FROM file AS row RETURN row",
// "
// MATCH (bridge:Bridge {id: row.STRUCTURE_NUMBER_008}) //need to update this to match bridge id
// MATCH (inspDate:InspectionDate {id: row.DATE_OF_INSPECT_090})
// MERGE (evaluation:Evaluation {id: bridge.id + inspDate.id})
// MERGE (bridge)<-[:EVALUATION_OF]-(evaluation)-[:EVALUATED_ON]->(inspDate)
// ON CREATE SET evaluation.id = bridge.id + inspDate.id,
			  
//               evaluation.deck_cond = row.DECK_COND_058,
// 			  evaluation.superstructure_cond = row.SUPERSTRUCTURE_COND_059,
// 			  evaluation.substructure_cond = row.SUBSTRUCTURE_COND_060,
// 			  evaluation.channel_cond = row.CHANNEL_COND_061,
// 			  evaluation.culvert_cond = row.CULVERT_COND_062,

// 			  evaluation.structural_eval = row.STRUCTURAL_EVAL_067,
// 			  evaluation.deck_geometry_eval = row.DECK_GEOMETRY_EVAL_068,
// 			  evaluation.undclrence_eval = row.UNDCLRENCE_EVAL_069,
// 			  evaluation.posting_eval = row.POSTING_EVAL_070,
// 			  evaluation.waterway_eval = row.WATERWAY_EVAL_071,
// 			  evaluation.appr_road_eval = row.APPR_ROAD_EVAL_072
// ",
// {batchSize:1000,iterateList:true});


// // converting latitude to decimal
// MATCH (bridge:Bridge)
// WHERE size(bridge.latitude) = 8
// SET bridge.latitude_decimal = toFloat(left(bridge.latitude, 2)) + toFloat(substring(bridge.latitude,2,2))/60 + toFloat(right(bridge.latitude,4))/100/3600




// // converting longitude to decimal
// MATCH (bridge:Bridge)
// WITH bridge, size(bridge.longitude) AS long_size
// WHERE long_size >= 8
// SET bridge.longitude_decimal = 
// CASE long_size
// 	WHEN 8 THEN -1 * ( toFloat(left(bridge.longitude, 2)) + toFloat(substring(bridge.longitude,2,2))/60 + toFloat(right(bridge.longitude,4))/100/3600 )
//     WHEN 9 THEN -1 * ( toFloat(left(bridge.longitude, 3)) + toFloat(substring(bridge.longitude,3,2))/60 + toFloat(right(bridge.longitude,4))/100/3600 )
// END

// // query to verify new latitude_decimal property
// MATCH (bridge:Bridge)
// WITH bridge, size(bridge.longitude) AS long_size
// WHERE long_size >= 8
// RETURN size(bridge.longitude),
// 	   bridge.longitude AS Long, 
// 	CASE size(bridge.longitude)
// 		WHEN 8 THEN toFloat(left(bridge.longitude, 2))
// 		WHEN 9 THEN toFloat(left(bridge.longitude, 3))
// 	END AS Degrees,
//     CASE size(bridge.longitude)
//     	WHEN 8 THEN toFloat(substring(bridge.longitude,2,2))/60
//         WHEN 9 THEN toFloat(substring(bridge.longitude,3,2))/60
// 	END AS Minutes,
// 	   toFloat(right(bridge.longitude,4))/100/3600 AS Seconds,
// 	CASE long_size
// 		WHEN 8 THEN -1 * ( toFloat(left(bridge.longitude, 2)) + toFloat(substring(bridge.longitude,2,2))/60 + toFloat(right(bridge.longitude,4))/100/3600 )
// 	    WHEN 9 THEN -1 * ( toFloat(left(bridge.longitude, 3)) + toFloat(substring(bridge.longitude,3,2))/60 + toFloat(right(bridge.longitude,4))/100/3600 )
// 	END AS decimal,
// 	bridge.longitude_decimal
// ORDER BY Long


// // adding Bridge long & lat as point 
// MATCH (bridge:Bridge)
// WHERE NOT bridge.latitude IS NULL
// AND NOT bridge.longitude IS NULL
// WITH bridge,
// 	 toFloat(left(bridge.latitude, 2)) + toFloat(substring(bridge.latitude,2,2))/60 + toFloat(right(bridge.latitude,4))/100/3600 AS latitude_decimal,
//      size(bridge.longitude) AS long_size
// WITH bridge,
// 	 latitude_decimal,
//      CASE long_size
// 	 	WHEN 8 THEN -1 * ( toFloat(left(bridge.longitude, 2)) + toFloat(substring(bridge.longitude,2,2))/60 + toFloat(right(bridge.longitude,4))/100/3600 )
//      	WHEN 9 THEN -1 * ( toFloat(left(bridge.longitude, 3)) + toFloat(substring(bridge.longitude,3,2))/60 + toFloat(right(bridge.longitude,4))/100/3600 )
// 	 END AS longitude_decimal
// SET bridge.location = point({ longitude: longitude_decimal, latitude: latitude_decimal })



// //query to change state name from id to state letters
// // This changes the state "numeric" code to the 2-letter state abreviation
// MATCH (state:State)
// SET state.name = 
// CASE state.name // change to state.code?
// 	WHEN "01" THEN "AL"
//     WHEN "02" THEN "AK"
//     //WHEN "03" THEN "" //this is not referenced. kept for numeric continuity
//     WHEN "04" THEN "AZ"
//     WHEN "05" THEN "AR"
//     WHEN "06" THEN "CA"
//     //WHEN "07" THEN "" //this is not referenced. kept for numeric continuity
//     WHEN "08" THEN "CO"
//     WHEN "09" THEN "CT"
//     WHEN "10" THEN "DE"
//     WHEN "11" THEN "DC"
//     WHEN "12" THEN "FL"
//     WHEN "13" THEN "GA"
//     //WHEN "14" THEN "" //this is not referenced. kept for numeric continuity
//     WHEN "15" THEN "HI"
//     WHEN "16" THEN "ID"
//     WHEN "17" THEN "IL"
//     WHEN "18" THEN "IN"
//     WHEN "19" THEN "IA"
//     WHEN "20" THEN "KS"
//     WHEN "21" THEN "KY"
//     WHEN "22" THEN "LA"
//     WHEN "23" THEN "ME"
//     WHEN "24" THEN "MD"
//     WHEN "25" THEN "MA"
//     WHEN "26" THEN "MI"
//     WHEN "27" THEN "MN"
//     WHEN "28" THEN "MS"
//     WHEN "29" THEN "MO"
//     WHEN "30" THEN "MT"
//     WHEN "31" THEN "NE"
//     WHEN "32" THEN "NV"
//     WHEN "33" THEN "NH"
//     WHEN "34" THEN "NJ"
//     WHEN "35" THEN "NM"
//     WHEN "36" THEN "NY"
//     WHEN "37" THEN "NC"
//     WHEN "38" THEN "ND"
//     WHEN "39" THEN "OH"
//     WHEN "40" THEN "OK"
//     WHEN "41" THEN "OR"
//     WHEN "42" THEN "PA"
//     //WHEN "43" THEN "" //this is not referenced. kept for numeric continuity
//     WHEN "44" THEN "RI"
//     WHEN "45" THEN "SC"
//     WHEN "46" THEN "SD"
//     WHEN "47" THEN "TN"
//     WHEN "48" THEN "TX"
//     WHEN "49" THEN "UT"
//     WHEN "50" THEN "VT"
//     WHEN "51" THEN "VA"
//     WHEN "53" THEN "WA"
//     WHEN "54" THEN "WV"
//     WHEN "55" THEN "WI"
//     WHEN "56" THEN "WY"
//     WHEN "72" THEN "PR"
// END//
// //need to incorporate longer state names
//   WHEN "01" THEN "Alabama"
//     WHEN "02" THEN "Alaska"
//     //WHEN "03" THEN "" //this is not referenced. kept for numeric continuity
//     WHEN "04" THEN "Arizona"
//     WHEN "05" THEN "Arkansas"
//     WHEN "06" THEN "California"
//     //WHEN "07" THEN "" //this is not referenced. kept for numeric continuity
//     WHEN "08" THEN "Colorado"
//     WHEN "09" THEN "Connecticut"
//     WHEN "10" THEN "Deleware"
//     WHEN "11" THEN "District of Columbia"
//     WHEN "12" THEN "Florida"
//     WHEN "13" THEN "Georgia"
//     //WHEN "14" THEN "" //this is not referenced. kept for numeric continuity
//     WHEN "15" THEN "Hawaii"
//     WHEN "16" THEN "Idaho"
//     WHEN "17" THEN "Illinois"
//     WHEN "18" THEN "Indiana"
//     WHEN "19" THEN "Iowa"
//     WHEN "20" THEN "Kansas"
//     WHEN "21" THEN "Kentucky"
//     WHEN "22" THEN "Louisianna"
//     WHEN "23" THEN "Maine"
//     WHEN "24" THEN "Maryland"
//     WHEN "25" THEN "Massachusetts"
//     WHEN "26" THEN "Michigan"
//     WHEN "27" THEN "Minnesota"
//     WHEN "28" THEN "Mississippi"
//     WHEN "29" THEN "Missouri"
//     WHEN "30" THEN "Montana"
//     WHEN "31" THEN "Nebraska"
//     WHEN "32" THEN "Nevada"
//     WHEN "33" THEN "New Hampshire"
//     WHEN "34" THEN "New Jersey"
//     WHEN "35" THEN "New Mexico"
//     WHEN "36" THEN "New York"
//     WHEN "37" THEN "North Carolina"
//     WHEN "38" THEN "North Dakota"
//     WHEN "39" THEN "Ohio"
//     WHEN "40" THEN "Oklahoma"
//     WHEN "41" THEN "Oregon"
//     WHEN "42" THEN "Pennsylvania"
//     //WHEN "43" THEN "" //this is not referenced. kept for numeric continuity
//     WHEN "44" THEN "Rhode Island"
//     WHEN "45" THEN "South Carolina"
//     WHEN "46" THEN "South Dakota"
//     WHEN "47" THEN "Tennessee"
//     WHEN "48" THEN "Texas"
//     WHEN "49" THEN "Utah"
//     WHEN "50" THEN "Vermont"
//     WHEN "51" THEN "Virginia"
//     WHEN "53" THEN "Washington"
//     WHEN "54" THEN "West Virginia"
//     WHEN "55" THEN "Wisconsin"
//     WHEN "56" THEN "Wyoming"
//     WHEN "72" THEN "Puerto Rico"







// // Data loaded from https://www2.census.gov/programs-surveys/popest/geographies/2016/all-geocodes-v2016.xlsx converted to shared Google Sheet
// CALL apoc.periodic.iterate(
// '
// LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/12ZvB9atf_RHWpqDzahN68pgVB5PNGz34LAnsIfwcVMs/export?format=csv&id=12ZvB9atf_RHWpqDzahN68pgVB5PNGz34LAnsIfwcVMs&gid=1935809672" AS row
// RETURN row
// ','
// MATCH (state:State)
// WHERE state.id = row.`State Code (FIPS)`
// MATCH (state)<-[:OF_STATE]-(county:County)
// WHERE county.id = row.`County Code (FIPS)`
// SET county.name = row.`Area Name (including legal/statistical area description)`
// ',
// {batchSize:10000, parallel:false}) YIELD batches, total
// RETURN batches, total

// // Data loaded from https://www2.census.gov/programs-surveys/popest/geographies/2016/all-geocodes-v2016.xlsx converted to shared Google Sheet
// CALL apoc.periodic.iterate(
// '
// LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/12ZvB9atf_RHWpqDzahN68pgVB5PNGz34LAnsIfwcVMs/export?format=csv&id=12ZvB9atf_RHWpqDzahN68pgVB5PNGz34LAnsIfwcVMs&gid=1935809672" AS row
// RETURN row
// ','
// MATCH (state:State)
// WHERE state.id = row.`State Code (FIPS)`
// MATCH (state)<--(:County)<--(place:Place)
// WHERE place.id = row.`Place Code (FIPS)`
// SET place.name = row.`Area Name (including legal/statistical area description)`
// ',
// {batchSize:10000, parallel:false}) YIELD batches, total
// RETURN batches, total






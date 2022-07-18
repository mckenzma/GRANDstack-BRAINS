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
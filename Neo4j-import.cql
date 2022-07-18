//////////////////////////////////////
// Neo4j Import Cypher
//////////////////////////////////////
// Notes:
// 1. These should be run in order any time a new file is ready to be imported
// 2. This currently considers only the Delimited formatted files
//////////////////////////////////////
// TODOS:
// 1. 
//////////////////////////////////////


//////////////////////////////////////
// Part 2: Raw Data Import
//////////////////////////////////////
//// Create nodes for each file URL (Delimited Files)
//// Data loaded from https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm via define URLs stored in Google Sheet
//LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A/export?format=csv&id=1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A&gid=1318941318" AS row
//WITH row
//WHERE NOT row.Year IS NULL
//WITH row, row.URL AS fileUrl
//MERGE (file:File:DelimitedFile {url: fileUrl})
//ON CREATE SET file.url = fileUrl,
//              file.folder = row.Folder,
//              file.name = row.File,
//              file.year = toInteger(row.Year),
//              file.createdOn = datetime(), 
//              file:ImportFileRows


//// Iterate through files and import rows (Delimited)
//MATCH (file:ImportFileRows)
//REMOVE file:ImportFileRows
//WITH collect([file.url,file.name]) AS files
//UNWIND files AS file
//CALL apoc.periodic.iterate(
//'
//CALL apoc.load.csv($url,{header:true,quoteChar:"\u0000"}) YIELD map AS row
//RETURN row
//','
//CREATE (fileRow:Row:DelimitedRow)
//SET fileRow += row,
//fileRow.file = $name,
//fileRow.createdOn = datetime(),
//fileRow:ConnectRowToFile
//',
//{batchSize:10000,parallel:false,params:{url: file[0], name: file[1]}}) YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
//RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams


//// Connect rows to files (Delimited)
//CALL apoc.periodic.iterate(
//'
//MATCH (row:ConnectRowToFile)
//RETURN row
//','
//REMOVE row:ConnectRowToFile
//WITH row
//MATCH (file:DelimitedFile)
//WHERE file.name = row.file
//MERGE (file)-[:CONTAINS]->(row)
//',
//{batchSize:10000,parallel:false}) YIELD batches, total
//RETURN batches, total


//// TODO - update to only connect where needed.
//// Create (:File)-[:NEXT_FILE]->(:File) for each state in ascending order
//MATCH (file:File)
//WITH DISTINCT left(file.name,2) AS stateAbbr
//WITH stateAbbr
//ORDER BY stateAbbr
//MATCH (df:DelimitedFile)
//WHERE left(df.name,2) = stateAbbr
//WITH stateAbbr, df
//ORDER BY df.year ASC
//WITH stateAbbr, collect(df) AS fileArray
//UNWIND range(0,size(fileArray)-2,1) AS index
//WITH fileArray[index] AS start, fileArray[index+1] AS end
//MERGE (start)-[:NEXT_FILE]->(end)


//// Create (:Row)-[:NEXT_ROW]->(:Row) by state for each record in ascending order by file year
//MATCH (file:File)
//WITH DISTINCT left(file.name,2) AS stateAbbr
//WITH stateAbbr
//ORDER BY stateAbbr
//MATCH (df:DelimitedFile)
//WHERE left(df.name,2) = stateAbbr
//WITH stateAbbr, df
//ORDER BY df.year ASC
//WITH stateAbbr, collect(df) AS fileArray
//UNWIND range(0,size(fileArray)-2,1) AS index
//WITH fileArray[index].name AS startFile, fileArray[index+1].name AS endFile
//CALL apoc.periodic.iterate(
//'
//MATCH (:DelimitedFile {name: $startFile})-[:CONTAINS]->(startRow:ConnectRowToNextRow)
//MATCH (:DelimitedFile {name: $endFile})-[:CONTAINS]->(endRow:ConnectRowToNextRow)
//WHERE endRow.STRUCTURE_NUMBER_008 = startRow.STRUCTURE_NUMBER_008
//RETURN startRow, endRow
//','
//MERGE (startRow)-[:NEXT_ROW]->(endRow)
//',
//{batches:1000, parallel:false, params:{startFile: startFile, endFile: endFile}}) YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
//RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams


//////////////////////////////////////
// Part 3: Building (:State)-->(:County)-->(:Place)-->(:Bridge)
//////////////////////////////////////

// // Processing Label for (:File)
// // TODO - Add this processing label to when file node is created
// MATCH (file:File)
// WHERE NOT (file)-[:FILE_FOR]->()
// SET file:ConnectFileToState

// // Create state node and connect to file
// CALL apoc.periodic.iterate(
// '
// MATCH (file:ConnectFileToState)
// RETURN file
// ','
// REMOVE file:ConnectFileToState
// WITH file
// MERGE (state:State {abbreviation: left(file.name,2)})
// WITH file, state
// MERGE (file)-[:FILE_FOR]->(state)
// ',
// {batchSize:1, parallel:false}) //YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
// //RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams

// // Update State properties
// // TODO - update to set code and name via objects in one case statement (if possible)
// MATCH (state:State)
// SET state.code = 
// 			// These are ordered by the state code
//       CASE state.abbreviation
//         WHEN "AL" THEN "01"
//         WHEN "AK" THEN "02"
//         //WHEN "03" THEN "" //this is not referenced. kept for numeric continuity
//         WHEN "AZ" THEN "04"
//         WHEN "AR" THEN "05"
//         WHEN "CA" THEN "06"
//         //WHEN "07" THEN "" //this is not referenced. kept for numeric continuity
//         WHEN "CO" THEN "08"
//         WHEN "CT" THEN "09"
//         WHEN "DE" THEN "10"
//         WHEN "DC" THEN "11"
//         WHEN "FL" THEN "12"
//         WHEN "GA" THEN "13"
//         //WHEN "14" THEN "" //this is not referenced. kept for numeric continuity
//         WHEN "HI" THEN "15"
//         WHEN "ID" THEN "16"
//         WHEN "IL" THEN "17"
//         WHEN "IN" THEN "18"
//         WHEN "IA" THEN "19"
//         WHEN "KS" THEN "20"
//         WHEN "KY" THEN "21"
//         WHEN "LA" THEN "22"
//         WHEN "ME" THEN "23"
//         WHEN "MD" THEN "24"
//         WHEN "MA" THEN "25"
//         WHEN "MI" THEN "26"
//         WHEN "MN" THEN "27"
//         WHEN "MS" THEN "28"
//         WHEN "MO" THEN "29"
//         WHEN "MT" THEN "30"
//         WHEN "NE" THEN "31"
//         WHEN "NV" THEN "32"
//         WHEN "NH" THEN "33"
//         WHEN "NJ" THEN "34"
//         WHEN "NM" THEN "35"
//         WHEN "NY" THEN "36"
//         WHEN "NC" THEN "37"
//         WHEN "ND" THEN "38"
//         WHEN "OH" THEN "39"
//         WHEN "OK" THEN "40"
//         WHEN "OR" THEN "41"
//         WHEN "PA" THEN "42"
//         //WHEN "43" THEN "" //this is not referenced. kept for numeric continuity
//         WHEN "RI" THEN "44"
//         WHEN "SC" THEN "45"
//         WHEN "SD" THEN "46"
//         WHEN "TN" THEN "47"
//         WHEN "TX" THEN "48"
//         WHEN "UT" THEN "49"
//         WHEN "VT" THEN "50"
//         WHEN "VA" THEN "51"
//         WHEN "WA" THEN "53"
//         WHEN "WV" THEN "54"
//         WHEN "WI" THEN "55"
//         WHEN "WY" THEN "56"
//         WHEN "PR" THEN "72"
//       END,
//       state.name = 
//       CASE state.abbreviation
//       //need to incorporate longer state names
//         WHEN "AL" THEN "Alabama"
//         WHEN "AK" THEN "Alaska"
//         //WHEN "03" THEN "" //this is not referenced. kept for numeric continuity
//         WHEN "AZ" THEN "Arizona"
//         WHEN "AR" THEN "Arkansas"
//         WHEN "CA" THEN "California"
//         //WHEN "07" THEN "" //this is not referenced. kept for numeric continuity
//         WHEN "CO" THEN "Colorado"
//         WHEN "CT" THEN "Connecticut"
//         WHEN "DE" THEN "Delaware"
//         WHEN "DC" THEN "District of Columbia"
//         WHEN "FL" THEN "Florida"
//         WHEN "GA" THEN "Georgia"
//         //WHEN "14" THEN "" //this is not referenced. kept for numeric continuity
//         WHEN "HI" THEN "Hawaii"
//         WHEN "ID" THEN "Idaho"
//         WHEN "IL" THEN "Illinois"
//         WHEN "IN" THEN "Indiana"
//         WHEN "IA" THEN "Iowa"
//         WHEN "KS" THEN "Kansas"
//         WHEN "KY" THEN "Kentucky"
//         WHEN "LA" THEN "Louisiana"
//         WHEN "ME" THEN "Maine"
//         WHEN "MD" THEN "Maryland"
//         WHEN "MA" THEN "Massachusetts"
//         WHEN "MI" THEN "Michigan"
//         WHEN "MN" THEN "Minnesota"
//         WHEN "MS" THEN "Mississippi"
//         WHEN "MO" THEN "Missouri"
//         WHEN "MT" THEN "Montana"
//         WHEN "NE" THEN "Nebraska"
//         WHEN "NV" THEN "Nevada"
//         WHEN "NH" THEN "New Hampshire"
//         WHEN "NJ" THEN "New Jersey"
//         WHEN "NM" THEN "New Mexico"
//         WHEN "NY" THEN "New York"
//         WHEN "NC" THEN "North Carolina"
//         WHEN "ND" THEN "North Dakota"
//         WHEN "OH" THEN "Ohio"
//         WHEN "OK" THEN "Oklahoma"
//         WHEN "OR" THEN "Oregon"
//         WHEN "PA" THEN "Pennsylvania"
//         //WHEN "43" THEN "" //this is not referenced. kept for numeric continuity
//         WHEN "RI" THEN "Rhode Island"
//         WHEN "SC" THEN "South Carolina"
//         WHEN "SD" THEN "South Dakota"
//         WHEN "TN" THEN "Tennessee"
//         WHEN "TX" THEN "Texas"
//         WHEN "UT" THEN "Utah"
//         WHEN "VT" THEN "Vermont"
//         WHEN "VA" THEN "Virginia"
//         WHEN "WA" THEN "Washington"
//         WHEN "WV" THEN "West Virginia"
//         WHEN "WI" THEN "Wisconsin"
//         WHEN "WY" THEN "Wyoming"
//         WHEN "PR" THEN "Puerto Rico"
//       END


// // Create index for each bridge based on STATE_CODE_001, COUNTY_CODE_003, PLACE_CODE_004, STRUCTURE_NUMBER_008
// CREATE INDEX bridgePlaceCountyState FOR (b:Bridge) ON (b.stateCode, b.countyCode, b.placeCode, b.code)

// // Add processing label to each (:Row) not connected to a (:Bridge)
// // TODO - add this processing label upon row creation
// CALL apoc.periodic.iterate(
// '
// MATCH (row:Row)
// WHERE NOT (row)-[:DATA_FOR]->()
// RETURN row
// ','
// SET row:ConnectRowToBridge
// ',
// {batchSize:10000, parallel:false})// YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
// //RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams

//// Add processing row for first record row
//CALL apoc.periodic.iterate(
//'
//MATCH (row:ConnectRowToBridge)
//WHERE NOT (row)-[:DATA_FOR]->()
//AND NOT ()-[:NEXT_ROW]->(row)
//RETURN row
//','
//SET row:CreateBridge
//',
//{batchSize:10000, parallel:false}) YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
//RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams



/////////////////////////////////////
// WIP
/////////////////////////////////////
// // Merge (:Bridge) 
// //UNWIND [1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019] AS year
// CALL apoc.periodic.iterate(
// '
// MATCH (row:ConnectRowToBridge)<-[:CONTAINS]-(file:File)
// WHERE file.year = $year
// RETURN row
// ','
// WITH row, 
//      row.STATE_CODE_001 AS stateCode,
//      row.COUNTY_CODE_003 AS countyCode,
//      row.PLACE_CODE_004 AS placeCode,
//      coalesce(apoc.text.replace(trim(row.STRUCTURE_NUMBER_008), "^0*", ""),row.STRUCTURE_NUMBER_008) AS bridgeCode
// MERGE (bridge:Bridge {stateCode: stateCode, 
// 											countyCode: countyCode, 
// 											placeCode: placeCode, 
// 											code: bridgeCode})
// ON CREATE SET bridge:ConnectToPlace
// ',
// {batchSize:10000, parallel:false,params:{year:year}}) YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
// RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams

// // Connect bridge to row
// UNWIND [1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019] AS year
// CALL apoc.periodic.iterate(
// '
// MATCH (row:ConnectRowToBridge)//<-[:CONTAINS]-(file:File)
// WHERE file.year = $year
// RETURN row
// ','
// WITH row,
// row.STATE_CODE_001 AS stateCode, 
//      row.COUNTY_CODE_003 AS countyCode,
//      row.PLACE_CODE_004 AS placeCode,
//     coalesce(apoc.text.replace(trim(row.STRUCTURE_NUMBER_008), "^0*", ""),row.STRUCTURE_NUMBER_008) AS bridgeCode
// MATCH (bridge:Bridge {stateCode: stateCode, 
//                       countyCode: countyCode, 
//                       placeCode: placeCode, 
//                       code: bridgeCode})
// CREATE (row)-[:DATA_FOR]->(bridge)
// WITH row
// REMOVE row:ConnectRowToBridge
// ',
// {batchSize:1000,parallel:false,params:{year:year}}) YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
// //{batchSize:10000,parallel:false}) YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
// //RETURN year, batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
// RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams

// // Create Index for places
// CREATE INDEX placeCountyState FOR (p:Place) ON (p.stateCode, p.countyCode, p.code)

// // MERGE (:Place)
// CALL apoc.periodic.iterate(
// '
// MATCH (bridge:ConnectToPlace)
// RETURN bridge
// ','
// MERGE (place:Place {code: bridge.placeCode, countyCode: bridge.countyCode, stateCode: bridge.stateCode})
// ON CREATE SET place:ConnectToCounty
// ',
// {batchSize:10000, parallel:false}) YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
// RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams

// // Create (:Place)-[:HAS_BRIDGE]->(:Bridge)
// CALL apoc.periodic.iterate(
// '
// MATCH (bridge:ConnectToPlace)
// RETURN bridge
// ','
// WITH bridge
// MATCH (place:Place {code: bridge.placeCode, countyCode: bridge.countyCode, stateCode: bridge.stateCode})
// CREATE (place)-[:HAS_BRIDGE]->(bridge)
// WITH bridge
// REMOVE bridge:ConnectToPlace
// ',
// {batchSize:10000, parallel:false}) YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
// RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams

// CREATE INDEX countyState FOR (c:County) ON (c.code, c.StateCode)

// // Merge (:County)
// CALL apoc.periodic.iterate(
// '
// MATCH (place:ConnectToCounty)
// RETURN place
// ','
// MERGE (county:County {code: place.countyCode, stateCode: place.stateCode})
// ON CREATE SET county:ConnectToState
// ',
// {batchSize:10000, parallel:false}) YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
// RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams

// // Create (:County)-[:HAS_PLACE]->(:Place)
// CALL apoc.periodic.iterate(
// '
// MATCH (place:ConnectToCounty)
// RETURN place
// ','
// WITH place
// MATCH (county:County {code: place.countyCode, stateCode: place.stateCode})
// CREATE (county)-[:HAS_PLACE]->(place)
// WITH place
// REMOVE place:ConnectToCounty
// ',
// {batchSize:10000, parallel:false}) YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
// RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams

// // Create (:State)-[:HAS_COUNTY]->(:County)
// CALL apoc.periodic.iterate(
// '
// MATCH (county:ConnectToState)
// RETURN county
// ','
// WITH county
// MATCH (state:State {code: county.stateCode})
// CREATE (state)-[:HAS_COUNTY]->(county)
// WITH county
// REMOVE county:ConnectToState
// ',
// {batchSize:10000, parallel:false}) YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
// RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams


//////////////////////////////////////
// Part 4: Fixing (:County)-->(:Place)-->(:Bridge)
//////////////////////////////////////

// // WIP Fixing County and Place codes
// // the case statements need to go on the bridge node script since we use the bridges to build the rest
// // only need to delete :Invalid nodes
// MATCH (b:Bridge)
// WITH b.stateCode AS sCode, trim(b.countyCode) AS cCode, trim(b.placeCode) AS pCode
// ORDER BY pCode, cCode
// WITH sCode,
// 	 CASE size(cCode)
//      	WHEN 0 THEN '000'
//         WHEN 1 THEN '00' + cCode
//         WHEN 2 THEN '0' + cCode
//         ELSE cCode
//      END AS cCode,
//      CASE size(pCode)
//      	WHEN 0 THEN '00000'
//         WHEN 1 THEN '0000' + pCode
//         WHEN 2 THEN '000' + pCode
//         WHEN 3 THEN '00' + pCode
//         WHEN 4 THEN '0' + pCode
//         ELSE pCode
//      END AS pCode
// RETURN sCode, 
// 	   size(cCode) AS cCodeSize, 
//        collect(DISTINCT cCode) AS cCodes,
//        size(pCode) AS pCodeSize, 
//        collect(DISTINCT pCode) AS pCodes,
//        count(*) AS count
// ORDER BY sCode, cCodeSize, pCodeSize

// // Add Invalid labels to C, P, B
// MATCH (b:Bridge)
// WHERE size(b.countyCode) <> 3
// OR size(b.placeCode) <> 5
// OR size(b.code) <> 15
// SET b:Invalid;
// MATCH (p:Place)
// WHERE size(p.countyCode) <> 3
// OR size(p.code) <> 5
// SET p:Invalid;
// MATCH (c:County)
// WHERE size(c.code) <> 3
// SET c:Invalid;

// // Breakdown of 'Valid' nodes from S, C, P, B tree
// MATCH (s:State)-[:HAS_COUNTY]->(c:County)-[:HAS_PLACE]->(p:Place)-[:HAS_BRIDGE]->(b:Bridge)
// WITH s, c, p, b
// RETURN s.code AS sCode, NOT c:Invalid AS validCounty, NOT p:Invalid AS validPlace, NOT b:Invalid AS validBridge, count(*) AS count
// ORDER BY sCode, validCounty, validPlace, validBridge

// Delete (:Invalid) nodes on (B), (P), (C)



// // Add County Names
// CALL apoc.periodic.iterate(
// '
// WITH "https://docs.google.com/spreadsheets/d/1-aou_hSFK2JItter84JvUOHUfqJ9Ctjev0G48BF_OjQ/export?format=csv&id=1-aou_hSFK2JItter84JvUOHUfqJ9Ctjev0G48BF_OjQ&gid=726211642" AS fileURL
// LOAD CSV WITH HEADERS FROM fileURL AS row
// RETURN row
// ','
// MATCH (state:State)-[:HAS_COUNTY]->(county)
// WHERE state.name = row.State
// AND county.code = row.`County Code`
// SET county.name = rtrim(row.`County Name`)
// ',
// {batchSize:10000,parallel:false}) YIELD batches, total
// RETURN batches, total

// // Add label for "invalid county"
// CALL apoc.periodic.iterate(
// '
// MATCH (c:County)
// RETURN c
// ','
// WITH c
// // check count conditions
// WHERE size(c.code) <> 3
// OR NOT c.code =~ "^[0-9]+$"
// SET c:InvalidCounty
// ',
// {batchSize:10000,parallel: false})

// // Compare Valid vs All Counties
// MATCH (c:County)
// RETURN "All" as name, count(*) AS count
// UNION ALL
// MATCH (c:InvalidCounty)
// RETURN "Invalid" AS name, count(*) AS count


// // Add label for "invalid place"
// CALL apoc.periodic.iterate(
// '
// MATCH (p:Place)
// RETURN p
// ','
// WITH p
// // check county conditions
// WHERE (size(p.countyCode) <> 3 OR NOT p.countyCode =~ "^[0-9]+$")
// // check place conditions
// OR (size(p.code) <> 5 OR NOT p.code =~ "^[0-9]+$")
// SET p:InvalidPlace
// ',
// {batchSize:10000,parallel: false})

// // Compare Valid vs All Place
// MATCH (p:Place)
// RETURN "All" as name, count(*) AS count
// UNION ALL
// MATCH (p:InvalidPlace)
// RETURN "Invalid" AS name, count(*) AS count


// // Add label for "invalid bridge"
// CALL apoc.periodic.iterate(
// '
// MATCH (b:Bridge)
// RETURN b
// ','
// WITH b
// // check county conditions
// WHERE (size(b.countyCode) <> 3 OR NOT b.countyCode =~ "^[0-9]+$")
// // check place conditions
// OR (size(b.placeCode) <> 5 OR NOT b.placeCode =~ "^[0-9]+$")
// // check bridge conditions
// OR size(b.code) <> 15
// SET b:InvalidBridge
// ',
// {batchSize:10000,parallel: false})

// // Compare Valid vs All Bridge
// MATCH (b:Bridge)
// RETURN "All" as name, count(*) AS count
// UNION ALL
// MATCH (b:InvalidBridge)
// RETURN "Invalid" AS name, count(*) AS count


// // Show breakdown and count of "invalid" bridges
// MATCH (b:InvalidBridge)
// RETURN (size(b.countyCode) <> 3 OR NOT b.countyCode =~ "^[0-9]+$") AS hasInvalidCounty, // check county conditions
//        (size(b.placeCode) <> 5 OR NOT b.placeCode =~ "^[0-9]+$") AS hasInvalidPlace, // check place conditions
//        (size(b.code) <> 15) as hasInvalidBridgeCode, // check bridge conditions
//        count(*)



// // Trying to fix wIP
// CALL apoc.periodic.iterate(
// '
// MATCH (r:Row)
// RETURN r
// ','
// SET r:ConnectRowToBridge
// ',
// {batchSize:10000,parallel:false})


// CALL apoc.periodic.iterate(
// '
// MATCH (row:ConnectRowToBridge)
// RETURN row
// ','
// WITH row, 
//      row.STATE_CODE_001 AS stateCode,
//      row.COUNTY_CODE_003 AS countyCode,
//      row.PLACE_CODE_004 AS placeCode,
//      row.STRUCTURE_NUMBER_008 AS bridgeCode
// MERGE (bridge:Bridge {stateCode: stateCode, 
// 											countyCode: countyCode, 
// 											placeCode: placeCode, 
// 											code: bridgeCode})
// ON CREATE SET bridge:ConnectToPlace
// ',
// {batchSize:10000, parallel:false})


// // MERGE (:Place)
// CALL apoc.periodic.iterate(
// '
// MATCH (bridge:ConnectToPlace)
// RETURN bridge
// ','
// MERGE (place:Place {code: bridge.placeCode, countyCode: bridge.countyCode, stateCode: bridge.stateCode})
// ON CREATE SET place:ConnectToCounty
// ',
// {batchSize:10000, parallel:false}) 

// // Compare Valid vs All Bridge
// MATCH (b:Bridge)
// RETURN "All" as name, count(*) AS count
// UNION ALL
// MATCH (b:InvalidBridge)
// WHERE NOT b:ConnectToPlace
// RETURN "Invalid & Existing" AS name, count(*) AS count
// UNION ALL
// MATCH (b:InvalidBridge:ConnectToPlace)
// RETURN "Invalid & New" AS name, count(*) AS count
// UNION ALL
// MATCH (b:ConnectToPlace)
// WHERE NOT b:InvalidBridge
// RETURN "New & Valid" AS name, count(*) AS count
// UNION ALL
// MATCH (b:Bridge)
// WHERE NOT b:InvalidBridge AND NOT b:ConnectToPlace
// RETURN "Exist & Valid" AS name, count(*) AS count

// // Merge Bridge
// CALL apoc.periodic.iterate(
// '
// WITH 3 AS cCodeSize,
//      5 AS pCodeSize, 
//      15 AS bCodeSize
// MATCH (row:ConnectRowToBridge)
// WITH row, 
//      cCodeSize, 
//      pCodeSize, 
//      bCodeSize,
//      cCodeSize - size(row.COUNTY_CODE_003) AS cDiff,
//      pCodeSize - size(row.PLACE_CODE_004) AS pDiff,
//      bCodeSize - size(row.STRUCTURE_NUMBER_008) AS bDiff
// RETURN row.STATE_CODE_001 AS sCode,
//        apoc.text.repeat("0",cDiff) + row.COUNTY_CODE_003 AS cCode,
//        apoc.text.repeat("0",pDiff) + row.PLACE_CODE_004 AS pCode,
//        apoc.text.repeat(" ",bDiff) + row.STRUCTURE_NUMBER_008 AS bCode
// ','
// MERGE (bridge:Bridge {stateCode: sCode, 
// 					  countyCode: cCode,
//                       placeCode: pCode,
// 					  code: bCode})
// ON CREATE SET bridge:ConnectToPlace
// ',
// {batchSize:10000, parallel:false})

// // Connect bridge to row
// CALL apoc.periodic.iterate(
// '
// WITH 3 AS cCodeSize,
//      5 AS pCodeSize, 
//      15 AS bCodeSize
// MATCH (row:ConnectRowToBridge)
// WITH row, 
//      cCodeSize, 
//      pCodeSize, 
//      bCodeSize,
//      cCodeSize - size(row.COUNTY_CODE_003) AS cDiff,
//      pCodeSize - size(row.PLACE_CODE_004) AS pDiff,
//      bCodeSize - size(row.STRUCTURE_NUMBER_008) AS bDiff
// RETURN row,
//        row.STATE_CODE_001 AS sCode,
//        apoc.text.repeat("0",cDiff) + row.COUNTY_CODE_003 AS cCode,
//        apoc.text.repeat("0",pDiff) + row.PLACE_CODE_004 AS pCode,
//        apoc.text.repeat(" ",bDiff) + row.STRUCTURE_NUMBER_008 AS bCode
// ','
// WITH row, sCode, cCode, pCode, bCode
// MATCH (bridge:Bridge {stateCode: sCode, 
//                       countyCode: cCode, 
//                       placeCode: pCode, 
//                       code: bCode})
// CREATE (row)-[:DATA_FOR]->(bridge)
// WITH row
// REMOVE row:ConnectRowToBridge
// ',
// {batchSize:1000,parallel:false})

// Then repeat other steps for merging & connecting to place, county, and state


//////////////////////////////////////
// Part 5: Build year and long/lat audit log
//////////////////////////////////////

// // Create Location Audit Log
// CALL apoc.periodic.iterate(
// '
// MATCH (bridge:Bridge)
// OPTIONAL MATCH (bridge)-[:LATEST_LOCATION_LOG]->(al)
// WITH bridge, coalesce(al.year,0) AS year
// MATCH (bridge)<-[:DATA_FOR]-(row:Row)<-[:CONTAINS]-(file:File)
// WHERE file.year > year
// RETURN bridge, row, file.year AS fYear
// ORDER BY fYear
// ','
// CREATE (newAL:AuditLog:LocationLog)
// SET newAL.latRaw = row.LAT_016,
//     newAL.longRaw = row.LONG_017,
//     newAL.year = fYear
// // switched up bridge alias here because to lazy to change code
// WITH bridge AS b, collect(newAL) AS items
// WITH b, items, items[0] AS al
// // going to possibly need this rel and old one
// OPTIONAL MATCH (b)-[r:LATEST_LOCATION_LOG]->(ol) WHERE ol <> al
// // go ahead and create the new latest
// CREATE (b)-[:LATEST_LOCATION_LOG]->(al)
// // ugly foreach hack to find singleton items where there was an old one that needs deleting
// FOREACH (al IN CASE WHEN r IS NOT NULL AND size(items) = 1 THEN items ELSE [] END |
// DELETE r CREATE (al)-[:PREV_LOCATION_LOG]->(ol)
// )
// // now to handle bridges with more than one new log
// WITH r, ol, b, items
// WHERE size(items) > 1
// // create a chain (first entry linked to bridge already above)
// UNWIND range(0, size(items) - 2) AS idx
// WITH r, ol,b, items, items[idx] AS new, items[idx + 1] AS old
// CREATE (new)-[:PREV_LOCATION_LOG]->(old)
// // distinct back down and find the last
// WITH DISTINCT r, ol,b, items
// WITH r, ol,b, items[size(items) - 1] AS lastAL
// WHERE r IS NOT NULL
// DELETE r 
// CREATE (lastAL)-[:PREV_LOCATION_LOG]->(ol)
// ',
// {batchSize:5000,parallel:false})

// // Find location logs that don't meet basic encoding criteria based on length
// MATCH (locLog:LocationLog)
// RETURN size(locLog.longRaw), size(locLog.latRaw),  count(*)

// // Add "Invalid" label for location logs that don't meet basic criteria
// MATCH (locLog:LocationLog)
// WHERE size(locLog.latRaw) <> 8
// OR size(locLog.longRaw) <> 9
// SET locLog:InvalidLocationLog

// // Create decimal lat / long where valid log
// CALL apoc.periodic.iterate(
// '
// MATCH (locLog:LocationLog)
// WHERE NOT locLog:InvalidLocationLog
// RETURN locLog
// ','
// WITH locLog, size(locLog.longRaw) AS long_size
// WITH locLog,
// 	 toFloat(left(locLog.latRaw, 2)) + toFloat(substring(locLog.latRaw,2,2))/60 + toFloat(right(locLog.latRaw,4))/100/3600 AS latitude_decimal,
// 	 CASE long_size
//         WHEN 8 THEN -1 * ( toFloat(left(locLog.longRaw, 2)) + toFloat(substring(locLog.longRaw,2,2))/60 + toFloat(right(locLog.longRaw,4))/100/3600 )
//         WHEN 9 THEN -1 * ( toFloat(left(locLog.longRaw, 3)) + toFloat(substring(locLog.longRaw,3,2))/60 + toFloat(right(locLog.longRaw,4))/100/3600 )
//      END AS longitude_decimal
// SET locLog.latitude = latitude_decimal,
// 	  locLog.longitude = longitude_decimal
// WITH locLog
// // check if lat/long outside expected bounds set "Invalid" label
// WHERE NOT (-90 <= latitude_decimal AND latitude_decimal <= 90)
// OR NOT (-180 <= longitude_decimal AND longitude_decimal <= 180)
// SET locLog:InvalidLocationLog
// ',
// {batchSize:5000})

// // Update bridge location based on most recent valid location log
// CALL apoc.periodic.iterate(
// '
// MATCH (b:Bridge)-[:LATEST_LOCATION_LOG]->(latest)
// //WHERE NOT b:InvalidBridge
// //AND NOT b:ConnectRowToBridge
// //AND NOT b:ConnectToPlace
// RETURN b, latest
// ','
// WITH b, latest
// WITH b, [(latest)-[:PREV_LOCATION_LOG*0..]->(log) WHERE NOT log:InvalidLocationLog | log {.latitude, .longitude}] AS logs
// WITH b, logs, size(logs) AS size
// WITH b, logs,
// 	 CASE
//      	WHEN size > 0 THEN point({ latitude: logs[0].latitude, longitude: logs[0].longitude }) // update bridge location 
//         ELSE point({ latitude: 0.0, longitude: 0.0 }) // arbitrarily set to 0,0 to plot bridge outside of continental US
// 	END AS point
// SET b.location = point
// ',
// {batchSize:1000})

// // Arbitrarily set "Invalid bridges" or bridges where location not set to location 0,0
// CALL apoc.periodic.iterate(
// '
// MATCH (b:Bridge)
// WHERE NOT exists(b.location)
// RETURN b
// ','
// SET b.location = point({ latitude: 0.0, longitude: 0.0 })
// ',
// {batchSize:10000})

// // Create Build Year Audit Log
// CALL apoc.periodic.iterate(
// '
// MATCH (bridge:Bridge)
// OPTIONAL MATCH (bridge)-[:LATEST_BUILD_YEAR_LOG]->(al)
// WITH bridge, coalesce(al.year,0) AS year
// MATCH (bridge)<-[:DATA_FOR]-(row:Row)<-[:CONTAINS]-(file:File)
// WHERE file.year > year
// RETURN bridge, row, file.year AS fYear
// ORDER BY fYear
// ','
// CREATE (newAL:AuditLog:BuildYearLog)
// SET newAL.YEAR_BUILT_027 = toInteger(row.YEAR_BUILT_027),
//     newAL.year = fYear
// // switched up bridge alias because too lazy to change code
// WITH bridge AS b, collect(newAL) AS items
// WITH b, items, items[0] AS al
// // going to possibly need this rel and old one
// OPTIONAL MATCH (b)-[r:LATEST_BUILD_YEAR_LOG]->(ol) WHERE ol <> al
// // go ahead and create new LATEST_BUILD_YEAR_LOG
// CREATE (b)-[:LATEST_BUILD_YEAR_LOG]->(al)
// // ugly foreach hack to find singleton items where there was an old one that needs deleting
// FOREACH (al IN CASE WHEN r IS NOT NULL AND size(items) = 1 THEN items ELSE [] END |
// DELETE r CREATE (al)-[:PREV_BUILD_YEAR_LOG]->(ol)
// )
// // now to handle bridges with more than one new log
// WITH r, ol, b, items
// WHERE size(items) > 1
// // Create a chain (first entry linked to bridge already above)
// UNWIND range(0, size(items) - 2) AS idx
// WITH r, ol, b, items, items[idx] AS new, items[idx + 1] AS old
// CREATE (new)-[:PREV_BUILD_YEAR_LOG]->(old)
// // distinct back down and find the last
// WITH DISTINCT r, ol, b, items
// WITH r, ol, b, items[size(items) - 1] AS lastAL
// WHERE r IS NOT NULL
// DELETE r
// CREATE (lastAL)-[:PREV_BUILD_YEAR_LOG]->(ol)
// ',
// {batchSize:5000,parallel:false})

//////////////////////////////////////
// Part 6: "related bridges" & "connected states"
//////////////////////////////////////


//////////////////////////////////////
// Part 7: Owned & Maintained
//////////////////////////////////////
// // Create Entity node and assiging -[:MAINTAINS]->(:Bridge), -[:OWNS]->(:Bridge) relationships
// // previously had these rels as separate nodes, but the encoding is the same. Uniting to 1 node and using 2 rels to create context
// // Can possibly separate depending on additional information assertained from NBI data
// // Note that I exclude "InvalidBridges"
// CALL apoc.periodic.iterate(
// '
// MATCH (bridge:Bridge)
// WHERE NOT bridge:InvalidBridge
// RETURN bridge
// ','
// MATCH (bridge)<-[:DATA_FOR]-(row:Row)
// WITH bridge, row.OWNER_022 AS ownerCode, row.MAINTENANCE_021 AS maintCode
// MERGE (entity:Entity {code: maintCode})
// ON CREATE SET entity.creadedOn = date()
// WITH bridge, ownerCode, maintCode
// MERGE (entity:Entity {code: ownerCode})
// ON CREATE SET entity.createdOn = date()
// WITH bridge, ownerCode, maintCode
// MATCH (owner:Entity {code: ownerCode})
// WITH bridge, owner, maintCode
// MATCH (maintainer:Entity {code: maintCode})
// MERGE (bridge)<-[:OWNS]-(owner)
// MERGE (bridge)<-[:MAINTAINS]-(maintainer)
// ',
// {batchSize:10000,parallel:false}) YIELD batches, total
// RETURN batches, total

// //query to add Entity Code Description
// MATCH (entity:Entity)
// SET entity.description = 
// CASE entity.code
//     WHEN "01" THEN "State Highway Agency"
//     WHEN "02" THEN "County Highway Agency"
//     WHEN "03" THEN "Town or Township Highway Agency"
//     WHEN "04" THEN "City or Municipal Highway Agency"
//     WHEN "11" THEN "State Park, Forest, or Reservation Agency"
//     WHEN "12" THEN "Local Park, Forest, or Reservation Agency"
//     WHEN "21" THEN "Other State Agencies"
//     WHEN "25" THEN "Othe Local Agencies"
//     WHEN "26" THEN "Private (other than railroad)"
//     WHEN "27" THEN "Railroad"
//     WHEN "31" THEN "State Toll Authority"
//     WHEN "32" THEN "Local Toll Authority"
//     WHEN "60" THEN "Other Federal Agencies"// (not listed below)"
//     WHEN "61" THEN "Indian Tribal Government"
//     WHEN "62" THEN "Bureau of Indian Affairs"
//     WHEN "63" THEN "Bureau of Fish and Wildlife"
//     WHEN "64" THEN "U.S. Forest Service"
//     WHEN "66" THEN "National Park Service"
//     WHEN "67" THEN "Tennessee Valley Authority"
//     WHEN "68" THEN "Bureau of Land Management"
//     WHEN "69" THEN "Bureau of Reclamation"
//     WHEN "70" THEN "Corps of Engineers (Civil)"
//     WHEN "71" THEN "Corps of Engineers (Military)"
//     WHEN "72" THEN "Air Force"
//     WHEN "73" THEN "Navy/Marines"
//     WHEN "74" THEN "Army"
//     WHEN "75" THEN "NASA"
//     WHEN "76" THEN "Metropolitan Washington Airports Service"
//     WHEN "80" THEN "Unkown"
//     ELSE "XXX - Need to review and update"
// END


//////////////////////////////////////
// Part 8: UI? 
//////////////////////////////////////




//////////////////////////////////////
// Part 9: Inspection Logs
//////////////////////////////////////
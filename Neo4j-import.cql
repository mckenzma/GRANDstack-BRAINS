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
// Create nodes for each file URL (Delimited Files)
// Data loaded from https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm via define URLs stored in Google Sheet
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A/export?format=csv&id=1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A&gid=1318941318" AS row
WITH row
WHERE NOT row.Year IS NULL
WITH row, row.URL AS fileUrl
MERGE (file:File:DelimitedFile {url: fileUrl})
ON CREATE SET file.url = fileUrl,
              file.folder = row.Folder,
              file.name = row.File,
              file.year = toInteger(row.Year),
              file.createdOn = datetime(), 
              file:ImportFileRows


// Iterate through files and import rows (Delimited)
MATCH (file:ImportFileRows)
REMOVE file:ImportFileRows
WITH collect([file.url,file.name]) AS files
UNWIND files AS file
CALL apoc.periodic.iterate(
'
CALL apoc.load.csv($url,{header:true,quoteChar:"\u0000"}) YIELD map AS row
RETURN row
','
CREATE (fileRow:Row:DelimitedRow)
SET fileRow += row,
fileRow.file = $name,
fileRow.createdOn = datetime(),
fileRow:ConnectRowToFile
',
{batchSize:10000,parallel:false,params:{url: file[0], name: file[1]}}) YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams


// Connect rows to files (Delimited)
CALL apoc.periodic.iterate(
'
MATCH (row:ConnectRowToFile)
RETURN row
','
REMOVE row:ConnectRowToFile
WITH row
MATCH (file:DelimitedFile)
WHERE file.name = row.file
MERGE (file)-[:CONTAINS]->(row)
',
{batchSize:10000,parallel:false}) YIELD batches, total
RETURN batches, total


// TODO - update to only connect where needed.
// Create (:File)-[:NEXT_FILE]->(:File) for each state in ascending order
MATCH (file:File)
WITH DISTINCT left(file.name,2) AS stateAbbr
WITH stateAbbr
ORDER BY stateAbbr
MATCH (df:DelimitedFile)
WHERE left(df.name,2) = stateAbbr
WITH stateAbbr, df
ORDER BY df.year ASC
WITH stateAbbr, collect(df) AS fileArray
UNWIND range(0,size(fileArray)-2,1) AS index
WITH fileArray[index] AS start, fileArray[index+1] AS end
MERGE (start)-[:NEXT_FILE]->(end)


// Create (:Row)-[:NEXT_ROW]->(:Row) by state for each record in ascending order by file year
MATCH (file:File)
WITH DISTINCT left(file.name,2) AS stateAbbr
WITH stateAbbr
ORDER BY stateAbbr
MATCH (df:DelimitedFile)
WHERE left(df.name,2) = stateAbbr
WITH stateAbbr, df
ORDER BY df.year ASC
WITH stateAbbr, collect(df) AS fileArray
UNWIND range(0,size(fileArray)-2,1) AS index
WITH fileArray[index].name AS startFile, fileArray[index+1].name AS endFile
CALL apoc.periodic.iterate(
'
MATCH (:DelimitedFile {name: $startFile})-[:CONTAINS]->(startRow:ConnectRowToNextRow)
MATCH (:DelimitedFile {name: $endFile})-[:CONTAINS]->(endRow:ConnectRowToNextRow)
WHERE endRow.STRUCTURE_NUMBER_008 = startRow.STRUCTURE_NUMBER_008
RETURN startRow, endRow
','
MERGE (startRow)-[:NEXT_ROW]->(endRow)
',
{batches:1000, parallel:false, params:{startFile: startFile, endFile: endFile}}) YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams


//////////////////////////////////////
// Part 3: Building (:State)-->(:County)-->(:Place)-->(:Bridge)
//////////////////////////////////////

// Processing Label for (:File)
// TODO - Add this processing label to when file node is created
MATCH (file:File)
WHERE NOT (file)-[:FILE_FOR]->()
SET file:ConnectFileToState

// Create state node and connect to file
CALL apoc.periodic.iterate(
'
MATCH (file:ConnectFileToState)
RETURN file
','
MERGE (state:State {abbreviation: left(file.name,2)})
WITH file, state
MERGE (file)-[:FILE_FOR]->(state)
',
{batchSize:1, parallel:false}) YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams

// Update State properties
MATCH (state:State)
SET state.code = 
			// These are ordered by the state code
      CASE state.abbreviation
        WHEN "AL" THEN "01"
        WHEN "AK" THEN "02"
        //WHEN "03" THEN "" //this is not referenced. kept for numeric continuity
        WHEN "AZ" THEN "04"
        WHEN "AR" THEN "05"
        WHEN "CA" THEN "06"
        //WHEN "07" THEN "" //this is not referenced. kept for numeric continuity
        WHEN "CO" THEN "08"
        WHEN "CT" THEN "09"
        WHEN "DE" THEN "10"
        WHEN "DC" THEN "11"
        WHEN "FL" THEN "12"
        WHEN "GA" THEN "13"
        //WHEN "14" THEN "" //this is not referenced. kept for numeric continuity
        WHEN "HI" THEN "15"
        WHEN "ID" THEN "16"
        WHEN "IL" THEN "17"
        WHEN "IN" THEN "18"
        WHEN "IA" THEN "19"
        WHEN "KS" THEN "20"
        WHEN "KY" THEN "21"
        WHEN "LA" THEN "22"
        WHEN "ME" THEN "23"
        WHEN "MD" THEN "24"
        WHEN "MA" THEN "25"
        WHEN "MI" THEN "26"
        WHEN "MN" THEN "27"
        WHEN "MS" THEN "28"
        WHEN "MO" THEN "29"
        WHEN "MT" THEN "30"
        WHEN "NE" THEN "31"
        WHEN "NV" THEN "32"
        WHEN "NH" THEN "33"
        WHEN "NJ" THEN "34"
        WHEN "NM" THEN "35"
        WHEN "NY" THEN "36"
        WHEN "NC" THEN "37"
        WHEN "ND" THEN "38"
        WHEN "OH" THEN "39"
        WHEN "OK" THEN "40"
        WHEN "OR" THEN "41"
        WHEN "PA" THEN "42"
        //WHEN "43" THEN "" //this is not referenced. kept for numeric continuity
        WHEN "RI" THEN "44"
        WHEN "SC" THEN "45"
        WHEN "SD" THEN "46"
        WHEN "TN" THEN "47"
        WHEN "TX" THEN "48"
        WHEN "UT" THEN "49"
        WHEN "VT" THEN "50"
        WHEN "VA" THEN "51"
        WHEN "WA" THEN "53"
        WHEN "WV" THEN "54"
        WHEN "WI" THEN "55"
        WHEN "WY" THEN "56"
        WHEN "PR" THEN "72"
      END,
      state.name = 
      CASE state.abbreviation
      //need to incorporate longer state names
        WHEN "AL" THEN "Alabama"
        WHEN "AK" THEN "Alaska"
        //WHEN "03" THEN "" //this is not referenced. kept for numeric continuity
        WHEN "AZ" THEN "Arizona"
        WHEN "AR" THEN "Arkansas"
        WHEN "CA" THEN "California"
        //WHEN "07" THEN "" //this is not referenced. kept for numeric continuity
        WHEN "CO" THEN "Colorado"
        WHEN "CT" THEN "Connecticut"
        WHEN "DE" THEN "Deleware"
        WHEN "DC" THEN "District of Columbia"
        WHEN "FL" THEN "Florida"
        WHEN "GA" THEN "Georgia"
        //WHEN "14" THEN "" //this is not referenced. kept for numeric continuity
        WHEN "HI" THEN "Hawaii"
        WHEN "ID" THEN "Idaho"
        WHEN "IL" THEN "Illinois"
        WHEN "IN" THEN "Indiana"
        WHEN "IA" THEN "Iowa"
        WHEN "KS" THEN "Kansas"
        WHEN "KY" THEN "Kentucky"
        WHEN "LA" THEN "Louisianna"
        WHEN "ME" THEN "Maine"
        WHEN "MD" THEN "Maryland"
        WHEN "MA" THEN "Massachusetts"
        WHEN "MI" THEN "Michigan"
        WHEN "MN" THEN "Minnesota"
        WHEN "MS" THEN "Mississippi"
        WHEN "MO" THEN "Missouri"
        WHEN "MT" THEN "Montana"
        WHEN "NE" THEN "Nebraska"
        WHEN "NV" THEN "Nevada"
        WHEN "NH" THEN "New Hampshire"
        WHEN "NJ" THEN "New Jersey"
        WHEN "NM" THEN "New Mexico"
        WHEN "NY" THEN "New York"
        WHEN "NC" THEN "North Carolina"
        WHEN "ND" THEN "North Dakota"
        WHEN "OH" THEN "Ohio"
        WHEN "OK" THEN "Oklahoma"
        WHEN "OR" THEN "Oregon"
        WHEN "PA" THEN "Pennsylvania"
        //WHEN "43" THEN "" //this is not referenced. kept for numeric continuity
        WHEN "RI" THEN "Rhode Island"
        WHEN "SC" THEN "South Carolina"
        WHEN "SD" THEN "South Dakota"
        WHEN "TN" THEN "Tennessee"
        WHEN "TX" THEN "Texas"
        WHEN "UT" THEN "Utah"
        WHEN "VT" THEN "Vermont"
        WHEN "VA" THEN "Virginia"
        WHEN "WA" THEN "Washington"
        WHEN "WV" THEN "West Virginia"
        WHEN "WI" THEN "Wisconsin"
        WHEN "WY" THEN "Wyoming"
        WHEN "PR" THEN "Puerto Rico"
      END;


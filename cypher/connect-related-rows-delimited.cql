// TODO need to only run this on new files when added
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
MATCH (:DelimitedFile {name: $startFile})-[:CONTAINS]->(startRow:Row)
MATCH (:DelimitedFile {name: $endFile})-[:CONTAINS]->(endRow:Row)
WHERE endRow.STRUCTURE_NUMBER_008 = startRow.STRUCTURE_NUMBER_008
RETURN startRow, endRow
','
MERGE (startRow)-[:NEXT_ROW]->(endRow)
',
{batches:1000, parallel:false, params:{startFile: startFile, endFile: endFile}}) YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
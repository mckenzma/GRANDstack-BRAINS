// Connect rows to files (Delimited)
CALL apoc.periodic.iterate(
'
MATCH (row:ConnectRowToFile)
RETURN row
','
WITH row
MATCH (file:DelimitedFile)
WHERE file.name = row.file
MERGE (file)-[:CONTAINS]->(row)
REMOVE row:ConnectRowToFile
',
{batchSize:10000,parallel:false,iterateList:true})// YIELD batches, total
//RETURN batches, total
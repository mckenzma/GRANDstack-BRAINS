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
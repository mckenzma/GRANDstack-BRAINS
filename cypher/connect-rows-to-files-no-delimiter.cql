// Connect rows to files (No Delimiter)
CALL apoc.periodic.iterate(
'
MATCH (row:NoDelimiterRow)
WHERE NOT (row)<-[:CONTAINS]-()
RETURN row
','
MATCH (file:NoDelimiterFile)
WHERE file.url = row.url
MERGE (file)-[:CONTAINS]->(row)
',
{batchSize:10000,parallel:false}) YIELD batches, total
RETURN batches, total
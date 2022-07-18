// Add County Names
CALL apoc.periodic.iterate(
'
WITH "https://docs.google.com/spreadsheets/d/1-aou_hSFK2JItter84JvUOHUfqJ9Ctjev0G48BF_OjQ/export?format=csv&id=1-aou_hSFK2JItter84JvUOHUfqJ9Ctjev0G48BF_OjQ&gid=726211642" AS fileURL
LOAD CSV WITH HEADERS FROM fileURL AS row
RETURN row
','
MATCH (state:State)-[:HAS_COUNTY]->(county)
WHERE state.name = row.State
AND county.code = row.`County Code`
SET county.name = rtrim(row.`County Name`)
',
{batchSize:10000,parallel:false}) YIELD batches, total
RETURN batches, total
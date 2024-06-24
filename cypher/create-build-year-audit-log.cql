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
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
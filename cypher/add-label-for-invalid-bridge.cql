// Add label for "invalid bridge"
CALL apoc.periodic.iterate(
'
MATCH (b:Bridge)
RETURN b
','
WITH b
// check county conditions
WHERE (size(b.countyCode) <> 3 OR NOT b.countyCode =~ "^[0-9]+$")
// check place conditions
OR (size(b.placeCode) <> 5 OR NOT b.placeCode =~ "^[0-9]+$")
// check bridge conditions
OR size(b.code) <> 15
SET b:InvalidBridge
',
{batchSize:10000,parallel: false})
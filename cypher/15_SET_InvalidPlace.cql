// Add label for "invalid place"
CALL apoc.periodic.iterate(
'
MATCH (p:Place)
RETURN p
','
WITH p
// check county conditions
WHERE (size(p.countyCode) <> 3 OR NOT p.countyCode =~ "^[0-9]+$")
// check place conditions
OR (size(p.code) <> 5 OR NOT p.code =~ "^[0-9]+$")
SET p:InvalidPlace
',
{batchSize:10000,parallel: true})
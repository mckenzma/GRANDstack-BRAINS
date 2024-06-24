// Add label for "invalid county"
CALL apoc.periodic.iterate(
'
MATCH (c:County)
RETURN c
','
WITH c
// check count conditions
WHERE size(c.code) <> 3
OR NOT c.code =~ "^[0-9]+$"
SET c:InvalidCounty
',
{batchSize:10000,parallel: true})
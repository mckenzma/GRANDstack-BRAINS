// Arbitrarily set "Invalid bridges" or bridges where location not set to location 0,0
CALL apoc.periodic.iterate(
'
MATCH (b:Bridge)
WHERE NOT exists(b.location)
RETURN b
','
SET b.location = point({ latitude: 0.0, longitude: 0.0 })
',
{batchSize:10000})
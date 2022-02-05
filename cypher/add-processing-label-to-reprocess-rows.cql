// Trying to fix wIP
CALL apoc.periodic.iterate(
'
MATCH (r:Row)
RETURN r
','
SET r:ConnectRowToBridge
',
{batchSize:10000,parallel:false})
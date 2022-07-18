// Create (:County)-[:HAS_PLACE]->(:Place)
CALL apoc.periodic.iterate(
'
MATCH (place:ConnectToCounty)
RETURN place
','
WITH place
MATCH (county:County {code: place.countyCode, stateCode: place.stateCode})
CREATE (county)-[:HAS_PLACE]->(place)
WITH place
REMOVE place:ConnectToCounty
',
{batchSize:10000, parallel:false}) YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
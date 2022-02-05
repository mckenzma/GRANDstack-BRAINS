// MERGE (:Place)
CALL apoc.periodic.iterate(
'
MATCH (bridge:ConnectToPlace)
RETURN bridge
','
MERGE (place:Place {code: bridge.placeCode, countyCode: bridge.countyCode, stateCode: bridge.stateCode})
ON CREATE SET place:ConnectToCounty
',
{batchSize:10000, parallel:false}) YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
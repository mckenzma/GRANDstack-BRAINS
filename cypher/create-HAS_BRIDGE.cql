// Create (:Place)-[:HAS_BRIDGE]->(:Bridge)
CALL apoc.periodic.iterate(
'
MATCH (bridge:ConnectToPlace)
RETURN bridge
','
WITH bridge
MATCH (place:Place {code: bridge.placeCode, countyCode: bridge.countyCode, stateCode: bridge.stateCode})
CREATE (place)-[:HAS_BRIDGE]->(bridge)
WITH bridge
REMOVE bridge:ConnectToPlace
',
{batchSize:10000, parallel:false}) YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
// Create (:Place)-[:HAS_BRIDGE]->(:Bridge)
CALL apoc.periodic.iterate(
'
MATCH (bridge:ConnectBridgeToPlace)
RETURN bridge
','
//WITH bridge
MERGE (place:Place {code: bridge.placeCode, 
                    countyCode: bridge.countyCode, 
                    stateCode: bridge.stateCode})
ON CREATE SET place:ConnectPlaceToCounty
MERGE (place)-[:HAS_BRIDGE]->(bridge)
WITH bridge
REMOVE bridge:ConnectBridgeToPlace
',
{batchSize:10000, parallel:false})// YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
//RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
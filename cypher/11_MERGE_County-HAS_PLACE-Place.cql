// Create (:County)-[:HAS_PLACE]->(:Place)
CALL apoc.periodic.iterate(
'
MATCH (place:ConnectPlaceToCounty)
RETURN place
','
//WITH place
MERGE (county:County {code: place.countyCode, 
                      stateCode: place.stateCode})
ON CREATE SET county:ConnectCountyToState
MERGE (county)-[:HAS_PLACE]->(place)
WITH place
REMOVE place:ConnectPlaceToCounty
',
{batchSize:10000, parallel:false})// YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
//RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
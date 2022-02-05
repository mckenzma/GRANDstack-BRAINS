// Merge (:County)
CALL apoc.periodic.iterate(
'
MATCH (place:ConnectToCounty)
RETURN place
','
MERGE (county:County {code: place.countyCode, stateCode: place.stateCode})
ON CREATE SET county:ConnectToState
',
{batchSize:10000, parallel:false}) YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
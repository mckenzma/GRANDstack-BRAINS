// Create (:State)-[:HAS_COUNTY]->(:County)
CALL apoc.periodic.iterate(
'
MATCH (county:ConnectToState)
RETURN county
','
WITH county
MATCH (state:State {code: county.stateCode})
CREATE (state)-[:HAS_COUNTY]->(county)
WITH county
REMOVE county:ConnectToState
',
{batchSize:10000, parallel:false}) YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
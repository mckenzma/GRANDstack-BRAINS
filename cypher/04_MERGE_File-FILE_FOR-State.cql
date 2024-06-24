// Create state node and connect to file
CALL apoc.periodic.iterate(
'
MATCH (file:ConnectFileToState)
RETURN file
','
WITH file
MERGE (state:State {abbreviation: left(file.name,2)})
ON CREATE SET state:SetStateProps
WITH file, state
MERGE (file)-[:FILE_FOR]->(state)
REMOVE file:ConnectFileToState
',
{batchSize:1, parallel:false}) //YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
//RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
// Add processing label to each (:Row) not connected to a (:Bridge)
// TODO - add this processing label upon row creation
CALL apoc.periodic.iterate(
'
MATCH (row:Row)
WHERE NOT (row)-[:DATA_FOR]->()
RETURN row
','
SET row:ConnectRowToBridge
',
{batchSize:10000, parallel:false})// YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
//RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
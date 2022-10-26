// Iterate through files and import rows (Delimited)
MATCH (file:ImportFileRows)
//REMOVE file:ImportFileRows
//WITH collect([file.url,file.name]) AS files
//UNWIND files AS file
CALL apoc.periodic.iterate(
'
CALL apoc.load.csv($url,{header:true,quoteChar:"\u0000"}) YIELD map AS row
RETURN row
','
CREATE (fileRow:Row:DelimitedRow)
SET fileRow += row,
    fileRow.file = $name,
    fileRow.createdOn = datetime(),
    fileRow:ConnectRowToFile,
    fileRow:ConnectRowToBridge,
    fileRow:ConnectBridgeToOwner,
    fileRow:ConnectBridgeToMaintainer
',
{batchSize:10000,parallel:true,params:{url: file.url, name: file.name}}) YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
WITH file
REMOVE file:ImportFileRows
//RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
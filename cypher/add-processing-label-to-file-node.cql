// Processing Label for (:File)
// TODO - Add this processing label to when file node is created
MATCH (file:File)
WHERE NOT (file)-[:FILE_FOR]->()
SET file:ConnectFileToState
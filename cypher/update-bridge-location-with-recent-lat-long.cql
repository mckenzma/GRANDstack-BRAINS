// Update bridge location based on most recent valid location log
CALL apoc.periodic.iterate(
'
MATCH (b:Bridge)-[:LATEST_LOCATION_LOG]->(latest)
//WHERE NOT b:InvalidBridge
//AND NOT b:ConnectRowToBridge
//AND NOT b:ConnectToPlace
RETURN b, latest
','
WITH b, latest
WITH b, [(latest)-[:PREV_LOCATION_LOG*0..]->(log) WHERE NOT log:InvalidLocationLog | log {.latitude, .longitude}] AS logs
WITH b, logs, size(logs) AS size
WITH b, logs,
	 CASE
     	WHEN size > 0 THEN point({ latitude: logs[0].latitude, longitude: logs[0].longitude }) // update bridge location 
        ELSE point({ latitude: 0.0, longitude: 0.0 }) // arbitrarily set to 0,0 to plot bridge outside of continental US
	END AS point
SET b.location = point
',
{batchSize:1000})
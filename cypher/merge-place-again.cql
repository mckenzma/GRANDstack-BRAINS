// MERGE (:Place)
CALL apoc.periodic.iterate(
'
MATCH (bridge:ConnectToPlace)
RETURN bridge
','
MERGE (place:Place {code: bridge.placeCode, countyCode: bridge.countyCode, stateCode: bridge.stateCode})
ON CREATE SET place:ConnectToCounty
',
{batchSize:10000, parallel:false}) 
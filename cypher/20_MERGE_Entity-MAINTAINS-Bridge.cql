CALL apoc.periodic.iterate(
'
  MATCH (row:ConnectBridgeToMaintainer)
  RETURN row
','
  MATCH (row)-[:DATA_FOR]->(bridge)
  WITH row, bridge, row.MAINTENANCE_021 AS maintainerCode
  MERGE (entity:Entity {code: maintainerCode})
  ON CREATE entity:AddEntityDescription
  WITH row, bridge, entity
  MERGE (entity)-[:MAINTAINS]->(bridge)

  WITH row
  REMOVE row:ConnectBridgeToMaintainer
',
{batchSize:10000, parallel:false, iterateList:true})
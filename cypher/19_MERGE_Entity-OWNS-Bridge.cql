CALL apoc.periodic.iterate(
'
  MATCH (row:ConnectBridgeToOwner)
  RETURN row
','
  MATCH (row)-[:DATA_FOR]->(bridge)
  WITH row, bridge, row.OWNER_022 AS ownerCode
  MERGE (entity:Entity {code: ownerCode})
  ON CREATE entity:AddEntityDescription
  WITH row, bridge, entity
  MERGE (entity)-[:OWNS]->(bridge)

  WITH row
  REMOVE row:ConnectBridgeToOwner
',
{batchSize:10000, parallel:false, iterateList:true})
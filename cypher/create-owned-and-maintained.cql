// Create Entity node and assiging -[:MAINTAINS]->(:Bridge), -[:OWNS]->(:Bridge) relationships
// previously had these rels as separate nodes, but the encoding is the same. Uniting to 1 node and using 2 rels to create context
// Can possibly separate depending on additional information assertained from NBI data
// Note that I exclude "InvalidBridges"
CALL apoc.periodic.iterate(
'
MATCH (bridge:Bridge)
WHERE NOT bridge:InvalidBridge
RETURN bridge
','
MATCH (bridge)<-[:DATA_FOR]-(row:Row)
WITH bridge, row.OWNER_022 AS ownerCode, row.MAINTENANCE_021 AS maintCode
MERGE (entity:Entity {code: maintCode})
ON CREATE SET entity.creadedOn = date()
WITH bridge, ownerCode, maintCode
MERGE (entity:Entity {code: ownerCode})
ON CREATE SET entity.createdOn = date()
WITH bridge, ownerCode, maintCode
MATCH (owner:Entity {code: ownerCode})
WITH bridge, owner, maintCode
MATCH (maintainer:Entity {code: maintCode})
MERGE (bridge)<-[:OWNS]-(owner)
MERGE (bridge)<-[:MAINTAINS]-(maintainer)
',
{batchSize:10000,parallel:false}) YIELD batches, total
RETURN batches, total
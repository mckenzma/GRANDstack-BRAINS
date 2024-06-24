// Create comparisons between rows for same year files
CALL apoc.periodic.iterate(
'
MATCH (b:Bridge)
WHERE (b)<-[:DATA_FOR]-(:DelimitedRow)
AND (b)<-[:DATA_FOR]-(:NoDelimiterRow)
RETURN b
','
MATCH (b)<-[:DATA_FOR]-(dr:DelimitedRow)<-[:CONTAINS]-(df:DelimitedFile)
WHERE NOT (dr)-[:COMPARES]->()
WITH b, dr, df
OPTIONAL MATCH (b)<-[:DATA_FOR]-(ndr:NoDelimiterRow)<-[:CONTAINS]-(ndf:NoDelimiterFile)
WHERE NOT (ndr)-[:COMPARES]->()
AND ndf.year = df.year
WITH b, ndr, dr//, ndf, df
WHERE NOT ndr IS NULL
MERGE (dr)-[:COMPARES]->(rc:RowComparison)<-[:COMPARES]-(ndr)
ON CREATE SET rc.createdOn = date()
',
{batchSize:1000,parallel:false})

// Set property on (:RowComparison) showing which properties vary between the files
CALL apoc.periodic.iterate(
'
MATCH (rc:RowComparison)
WHERE rc.varyingProps IS NULL
RETURN rc
','
MATCH (rc)<-[:COMPARES]-(dr:DelimitedRow)
MATCH (rc)<-[:COMPARES]-(ndr:NoDelimiterRow)
// dr has more keys/properties than ndr
WITH rc, dr, ndr, keys(dr) AS propKeys
WITH rc, FILTER(prop IN propKeys WHERE dr[prop] <> ndr[prop] AND prop <> "url" AND prop <> "createdOn") AS diffProps
WHERE size(diffProps) > 0
SET rc.varyingProps = diffProps
',
{batchSize:10000, parallel:false})

// iterate through and add fileName field to rc for faster queries
CALL apoc.periodic.iterate(
'
MATCH (rc:RowComparison)
WHERE rc.fileName IS NULL
RETURN rc
','
MATCH (rc)<-[:COMPARES]-(:NoDelimiterRow)<-[:CONTAINS]-(ndf:NoDelimiterFile)
MATCH (rc)<-[:COMPARES]-(:DelimitedRow)<-[:CONTAINS]-(df:DelimitedFile)
WHERE df.name = ndf.name
SET rc.fileName = df.name
',
{batchSize:10000,parallel:false})

// Add processing lables to (:RowComparison)
CALL apoc.periodic.iterate(
'
MATCH (rc:RowComparison)
RETURN rc
','
SET rc:ProcessRowComparison
',
{batchSize:10000,parallel:false});


// Create (:RowAuditLogs) annd connect to (:RowComparison)
// TODO: Does it make sense to have each difference as its own node or stored on a single node?
CALL apoc.periodic.iterate(
'
MATCH (rc:ProcessRowComparison)
RETURN rc
','
WITH rc
REMOVE rc:ProcessRowComparison
WITH rc, rc.varyingProps AS props
UNWIND props AS prop
MATCH (ndr:NoDelimiterRow)-[:COMPARES]->(rc)<-[:COMPARES]-(dr:DelimitedRow)
MERGE (ral:RowAuditLog {
  property: prop,
  ndr_value: ndr[prop],
  dr_value: dr[prop]
})-[:AUDITS_ROW]->(rc)

//MERGE (ral)-[:AUDITS_ROW]->(rc)
',
{batchSize:10000, parallel:false});
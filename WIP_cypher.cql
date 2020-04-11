// Query
// Summary of counts of varying props
MATCH (rc:RowComparison)
UNWIND rc.varyingProps AS prop
RETURN DISTINCT prop, count(*)
ORDER BY prop ASC




// how can this be improved?
MATCH (ral:RowAuditLog)
WHERE ral.property = "OWNER_022"
AND trim(ral.dr_value) <> trim(ral.ndr_value)
WITH ral //LIMIT 1000
MATCH (ral)-[:AUDITS_ROW]->(rc),
	  (rc)<-[:COMPARES]-(ndr:NoDelimiterRow),
      (rc)<-[:COMPARES]-(dr:DelimitedRow),
      (ndr)<-[:CONTAINS]-(ndf:File),
      (dr)<-[:CONTAINS]-(df:File)
RETURN ral.property, collect(DISTINCT ndf.name), collect(DISTINCT df.name)


MATCH (ral:RowAuditLog)
WITH ral, ral.property AS prop
MATCH (ral)-[:AUDITS_ROW]->(rc)
WITH prop, left(rc.fileName, 2) AS abbr, count(prop) AS count
ORDER BY abbr
RETURN DISTINCT prop, collect([abbr,count])
ORDER BY prop
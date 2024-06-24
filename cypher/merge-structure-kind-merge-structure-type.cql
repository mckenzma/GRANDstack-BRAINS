// Data loaded from files downloaded at https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm and stored in the "import" folder for the database instance
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY/export?format=csv&id=1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY&gid=749188439" AS row1
WITH CASE
    WHEN NOT row1.Year IS NULL THEN collect(row1.URL)
    END AS fileURLs
UNWIND fileURLs as fileURL
CALL apoc.periodic.iterate(
'
LOAD CSV WITH HEADERS FROM $url AS row RETURN row
','
MATCH (bridge:Bridge {id: row.STATE_CODE_001 + "_" + 
                          row.COUNTY_CODE_003 + "_" + 
                          row.PLACE_CODE_004 + "_" + 
                          row.STRUCTURE_NUMBER_008 + 
                          "_LAT_" + row.LAT_016 + 
                          "_LONG_" +row.LONG_017})
MERGE (structureKind:StructureKind {id: row.STRUCTURE_KIND_043A})
MERGE (structureType:StructureType {id: row.STRUCTURE_TYPE_043B})
MERGE (bridge)-[:HAS_STRUCTURE_KIND]->(structureKind)
MERGE (bridge)-[:HAS_STRUCTURE_TYPE]->(structureType)
ON CREATE SET structureKind.code = row.STRUCTURE_KIND_043A,
              structureType.code = row.STRUCTURE_TYPE_043B
',
{batchSize:10000, parallel:false, params:{url:fileURL}}) YIELD batches, total
RETURN batches, total
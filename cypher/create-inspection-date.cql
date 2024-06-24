// Load and create :InspectionDate
// Data loaded from https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm via define URLs stored in Google Sheet
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A/export?format=csv&id=1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A&gid=1318941318" AS row1
CREATE INDEX ON :InspectionDate(id);
// Data loaded from files downloaded at https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm and stored in the "import" folder for the database instance
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY/export?format=csv&id=1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY&gid=749188439" AS row1
WITH CASE
    //WHEN NOT row1.Year IS NULL THEN collect([row1.URL,row1.Year])
    WHEN NOT row1.Year IS NULL THEN collect(row1.URL)
    END AS fileURLs
UNWIND fileURLs as fileURL
CALL apoc.periodic.iterate(
'
LOAD CSV WITH HEADERS FROM $url AS row RETURN row
','
//MATCH (bridge:Bridge {id: row.STATE_CODE_001 + "_" + 
//                          row.COUNTY_CODE_003 + "_" + 
//                          row.PLACE_CODE_004 + "_" + 
//                          row.STRUCTURE_NUMBER_008 + 
//                          "_LAT_" + row.LAT_016 + 
//                          "_LONG_" +row.LONG_017})
MERGE (inspDate:InspectionDate {id: row.DATE_OF_INSPECT_090})
//MERGE (bridge)-[:INSPECTED_ON]->(inspDate)
ON CREATE SET inspDate.id = row.DATE_OF_INSPECT_090
',
//{batchSize:10000, parallel:false, params:{url:fileURL[0], fileYear:fileURL[1]}}) YIELD batches, total
{batchSize:5000, parallel:false, params:{url:fileURL}}) YIELD batches, total
RETURN batches, total
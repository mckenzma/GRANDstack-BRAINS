//WIP
// Load and create :Inspection
// leads to websocket failure
MATCH (file:File)
WHERE NOT (file)-[:CONTAINS]->(:Row)
WITH collect(file.url) AS fileURLs
UNWIND fileURLs AS fileURL
CALL apoc.periodic.iterate(
'
LOAD CSV WITH HEADERS FROM $url AS row
RETURN row
','
CREATE (inspectionRaw:InspectionRaw {createdOn: date(),
                     STATE_CODE_001: row.STATE_CODE_001,
                        COUNTY_CODE_003: row.COUNTY_CODE_003,
                        PLACE_CODE_004: row.PLACE_CODE_004,
                        STRUCTURE_NUMBER_008: row.STRUCTURE_NUMBER_008,
                        DECK_COND_058: row.DECK_COND_058,
                        SUPERSTRUCTURE_COND_059: row.SUPERSTRUCTURE_COND_059,
                        SUBSTRUCTURE_COND_060: row.SUBSTRUCTURE_COND_060,
                        CHANNEL_COND_061: row.CHANNEL_COND_061,
                        CULVERT_COND_062: row.CULVERT_COND_062,
                        DATE_OF_INSPECT_090: row.DATE_OF_INSPECT_090})
',
{batchSize:5000,parallel:false,params:{url:fileURL}}) YIELD batches, total
RETURN batches, total
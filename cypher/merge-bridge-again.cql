CALL apoc.periodic.iterate(
'
MATCH (row:ConnectRowToBridge)
RETURN row
','
WITH row, 
     row.STATE_CODE_001 AS stateCode,
     row.COUNTY_CODE_003 AS countyCode,
     row.PLACE_CODE_004 AS placeCode,
     row.STRUCTURE_NUMBER_008 AS bridgeCode
MERGE (bridge:Bridge {stateCode: stateCode, 
											countyCode: countyCode, 
											placeCode: placeCode, 
											code: bridgeCode})
ON CREATE SET bridge:ConnectToPlace
',
{batchSize:10000, parallel:false})
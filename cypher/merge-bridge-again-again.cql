// Merge Bridge
CALL apoc.periodic.iterate(
'
WITH 3 AS cCodeSize,
     5 AS pCodeSize, 
     15 AS bCodeSize
MATCH (row:ConnectRowToBridge)
WITH row, 
     cCodeSize, 
     pCodeSize, 
     bCodeSize,
     cCodeSize - size(row.COUNTY_CODE_003) AS cDiff,
     pCodeSize - size(row.PLACE_CODE_004) AS pDiff,
     bCodeSize - size(row.STRUCTURE_NUMBER_008) AS bDiff
RETURN row.STATE_CODE_001 AS sCode,
       apoc.text.repeat("0",cDiff) + row.COUNTY_CODE_003 AS cCode,
       apoc.text.repeat("0",pDiff) + row.PLACE_CODE_004 AS pCode,
       apoc.text.repeat(" ",bDiff) + row.STRUCTURE_NUMBER_008 AS bCode
','
MERGE (bridge:Bridge {stateCode: sCode, 
					  countyCode: cCode,
                      placeCode: pCode,
					  code: bCode})
ON CREATE SET bridge:ConnectToPlace
',
{batchSize:10000, parallel:false})
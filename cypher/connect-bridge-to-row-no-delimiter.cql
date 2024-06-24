// Connect bridge to row (:NoDelimiterRow)
CALL apoc.periodic.iterate(
'
MATCH (row:NoDelimiterRow)
WHERE NOT (row)-[:DATA_FOR]->()
RETURN row
','
WITH row,
row.STATE_CODE_001 AS stateCode, 
     row.COUNTY_CODE_003 AS countyCode,
     row.PLACE_CODE_004 AS placeCode,
    coalesce(apoc.text.replace(trim(row.STRUCTURE_NUMBER_008), "^0*", ""),row.STRUCTURE_NUMBER_008) AS bridgeCode
MATCH (bridge:Bridge {stateCode: stateCode, 
                      countyCode: countyCode, 
                      placeCode: placeCode, 
                      code: bridgeCode})
CREATE (row)-[:DATA_FOR]->(bridge)
',
{batchSize:10000,parallel:false})
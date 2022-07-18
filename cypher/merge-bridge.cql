// Merge (:Bridge) 
//UNWIND [1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019] AS year
CALL apoc.periodic.iterate(
'
MATCH (row:ConnectRowToBridge)<-[:CONTAINS]-(file:File)
WHERE file.year = $year
RETURN row
','
WITH row, 
     row.STATE_CODE_001 AS stateCode,
     row.COUNTY_CODE_003 AS countyCode,
     row.PLACE_CODE_004 AS placeCode,
     coalesce(apoc.text.replace(trim(row.STRUCTURE_NUMBER_008), "^0*", ""),row.STRUCTURE_NUMBER_008) AS bridgeCode
MERGE (bridge:Bridge {stateCode: stateCode, 
											countyCode: countyCode, 
											placeCode: placeCode, 
											code: bridgeCode})
ON CREATE SET bridge:ConnectToPlace
',
{batchSize:10000, parallel:false,params:{year:year}}) YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
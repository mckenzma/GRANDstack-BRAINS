// need to update, clean, and change insp dates to temporal format
LOAD CSV WITH HEADERS FROM "https://www.fhwa.dot.gov/bridge/nbi/2017/delimited/AL17.txt" AS row
WITH row, replace(row.DATE_OF_INSPECT_090, " ", "") AS temp
WITH row, temp, 
    CASE size(temp)
        //WHEN 3 THEN toInteger(left(temp,1))
        WHEN 4 THEN toInteger(left(temp,2))
    END AS month,
    CASE 
        WHEN ( toInteger(right(temp,2)) <= 99 AND toInteger(right(temp,2)) >= 92 ) THEN toInteger("19" + right(temp,2))
        WHEN ( toInteger(right(temp,2)) >= 00 AND toInteger(right(temp,2)) < 92 ) THEN toInteger("20" + right(temp,2))
    END AS year
RETURN row.DATE_OF_INSPECT_090, size(row.DATE_OF_INSPECT_090), temp, month, year
ORDER BY month

CALL apoc.periodic.iterate(
'
MATCH (inspDate:InspectionDate) 
//WHERE NOT exists(inspDate.date)
//AND size(inspDate.id) = 4
RETURN inspDate
','
WITH inspDate,
     CASE size(inspDate.id)
        WHEN 3 THEN toInteger(left(inspDate.id,1))
        WHEN 4 THEN toInteger(left(inspDate.id,2))
    END AS month,
    CASE
        WHEN ( toInteger(right(inspDate.id,2)) <= 99 AND toInteger(right(inspDate.id,2)) >= 92 ) THEN toInteger("19" + right(inspDate.id,2))
        WHEN ( toInteger(right(inspDate.id,2)) >= 00 AND toInteger(right(inspDate.id,2)) < 92 ) THEN toInteger("20" + right(inspDate.id,2))
    END AS year
SET inspDate.date = date({ year: year, month: month})
',
{batchSize:1000,parallel:false}) YIELD batches, total
RETURN batches, total
// Iterate through files and import rows (NoDelimiter)
MATCH (file:NoDelimiterFile)
WHERE NOT (file)-[:CONTAINS]->(:NoDelimiterRow)
// these files have some character(s) causing issues
AND NOT file.url = "https://www.fhwa.dot.gov/bridge/nbi/2001/AL01.txt"
AND NOT file.url = "https://www.fhwa.dot.gov/bridge/nbi/2006/WY06.txt"
AND NOT file.url = "https://www.fhwa.dot.gov/bridge/nbi/2011/WV11.txt"
AND NOT file.url = "https://www.fhwa.dot.gov/bridge/nbi/2017/DC17.txt"
WITH collect(file.url) AS fileURLs
UNWIND fileURLs AS fileURL
CALL apoc.periodic.iterate(
'
CALL apoc.load.csv($url,{header:false,quoteChar:"\u0000",arraySep:"\u0000"}) YIELD list AS row
RETURN row
','
CREATE (fileRow:Row:NoDelimiterRow {createdOn: date()})
SET fileRow.data = row[0],
fileRow.url = $url,
fileRow.createdOn = date()
',
{batchSize:10000,parallel:false,params:{url:fileURL}}) YIELD batches, total
RETURN batches, total

// No delimiter files causing problems
UNWIND ["https://www.fhwa.dot.gov/bridge/nbi/2001/AL01.txt",
        "https://www.fhwa.dot.gov/bridge/nbi/2006/WY06.txt",
        "https://www.fhwa.dot.gov/bridge/nbi/2011/WV11.txt",
        "https://www.fhwa.dot.gov/bridge/nbi/2017/DC17.txt"]
  AS url
LOAD CSV FROM url AS row
FIELDTERMINATOR "\u0000"
CREATE (fileRow:Row:NoDelimiterRow {createdOn: date()})
SET fileRow.data = row[0],
fileRow.url = url,
fileRow.createdOn = date()
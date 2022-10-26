// Create nodes for each file URL (Delimited Files)
// Data loaded from https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm via define URLs stored in Google Sheet
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A/export?format=csv&id=1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A&gid=1318941318" AS row
WITH row
WHERE NOT row.Year IS NULL
WITH row, row.URL AS fileUrl
MERGE (file:File:DelimitedFile {url: fileUrl})
ON CREATE SET file.url = fileUrl,
              file.folder = row.Folder,
              file.name = row.File,
              file.year = toInteger(row.Year),
              file.createdOn = datetime(), 
              file:ImportFileRows,
              file:ConnectFileToState
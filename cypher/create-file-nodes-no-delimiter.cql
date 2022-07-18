// Create nodes for each file URL (No Delimiter)
// Data loaded from https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm via define URLs stored in Google Sheet
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/14k9QoWIO1N-eRRDxslZxTY24OWSFbpGCVnAWGVnZxJ4/export?format=csv&id=14k9QoWIO1N-eRRDxslZxTY24OWSFbpGCVnAWGVnZxJ4&gid=1318941318" AS row
WITH row
WHERE NOT row.Year IS NULL
WITH row, row.URL AS fileUrl
MERGE (file:File:NoDelimiterFile {url: fileUrl})
ON CREATE SET file.url = fileUrl,
              file.folder = row.Folder,
              file.name = row.File,
              file.year = toInteger(row.Year),
              file.createdOn = timestamp()
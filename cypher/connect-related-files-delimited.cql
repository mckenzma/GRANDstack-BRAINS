// TODO - update to only connect where needed.
// Create (:File)-[:NEXT_FILE]->(:File) for each state in ascending order
MATCH (file:File)
WITH DISTINCT left(file.name,2) AS stateAbbr
WITH stateAbbr
ORDER BY stateAbbr
MATCH (df:DelimitedFile)
WHERE left(df.name,2) = stateAbbr
WITH stateAbbr, df
ORDER BY df.year ASC
WITH stateAbbr, collect(df) AS fileArray
UNWIND range(0,size(fileArray)-2,1) AS index
WITH fileArray[index] AS start, fileArray[index+1] AS end
MERGE (start)-[:NEXT_FILE]->(end)
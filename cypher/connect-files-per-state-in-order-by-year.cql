// Connect files per state in order by year
// TO DO - Delimiter and NO Delimiter Files shoudl each have their own string
// TO DO - Need to connect delimieter/no delimeter files of same year
MATCH (state:State)
WITH collect(state) AS states
UNWIND states AS state
MATCH (state)<-[:FILE_FOR]-(file)
WITH state, file ORDER BY file.year ASC // ascending order
WITH state, collect(file) AS orderedFiles
UNWIND range(0,size(orderedFiles)-2) AS i
WITH orderedFiles[i] AS start, orderedFiles[i+1] AS end
MERGE (start)-[:NEXT_FILE]->(end)
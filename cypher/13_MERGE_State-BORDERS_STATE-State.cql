// Connect bordering states
WITH "https://docs.google.com/spreadsheets/d/14ZJLZKZSlfgfo_pjuWKB8UBvkcgBncaX0xziqFMLpE0/export?format=csv&id=14ZJLZKZSlfgfo_pjuWKB8UBvkcgBncaX0xziqFMLpE0&gid=502947187" AS fileURL
LOAD CSV WITH HEADERS FROM fileURL AS row
WITH DISTINCT size(keys(row)) AS rowSize, keys(row) AS headers, fileURL
LOAD CSV WITH HEADERS FROM fileURL AS row
//UNWIND range(0,rowSize-1) AS i
UNWIND headers AS header
WITH row, header
WHERE row[header] = "Y"
WITH row['State Name'] AS state, collect(header) AS borderingStates
MATCH (s1:State)
WHERE s1.abbreviation = state
UNWIND borderingStates AS borderingState
MATCH (s2:State)
WHERE s2.abbreviation = borderingState
AND NOT (s1)<-[:BORDERS_STATE]-(s2)
MERGE (s1)-[:BORDERS_STATE]->(s2)
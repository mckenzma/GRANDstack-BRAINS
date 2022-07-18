// Compare Valid vs All Bridge
MATCH (b:Bridge)
RETURN "All" as name, count(*) AS count
UNION ALL
MATCH (b:InvalidBridge)
WHERE NOT b:ConnectToPlace
RETURN "Invalid & Existing" AS name, count(*) AS count
UNION ALL
MATCH (b:InvalidBridge:ConnectToPlace)
RETURN "Invalid & New" AS name, count(*) AS count
UNION ALL
MATCH (b:ConnectToPlace)
WHERE NOT b:InvalidBridge
RETURN "New & Valid" AS name, count(*) AS count
UNION ALL
MATCH (b:Bridge)
WHERE NOT b:InvalidBridge AND NOT b:ConnectToPlace
RETURN "Exist & Valid" AS name, count(*) AS count
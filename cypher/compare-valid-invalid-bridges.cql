// Compare Valid vs All Bridge
MATCH (b:Bridge)
RETURN "All" as name, count(*) AS count
UNION ALL
MATCH (b:InvalidBridge)
RETURN "Invalid" AS name, count(*) AS count
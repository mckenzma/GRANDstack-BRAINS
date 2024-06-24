// Compare Valid vs All Place
MATCH (p:Place)
RETURN "All" as name, count(*) AS count
UNION ALL
MATCH (p:InvalidPlace)
RETURN "Invalid" AS name, count(*) AS count
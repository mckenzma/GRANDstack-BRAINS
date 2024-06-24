// Compare Valid vs All Counties
MATCH (c:County)
RETURN "All" as name, count(*) AS count
UNION ALL
MATCH (c:InvalidCounty)
RETURN "Invalid" AS name, count(*) AS count
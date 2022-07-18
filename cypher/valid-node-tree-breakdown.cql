// Breakdown of 'Valid' nodes from S, C, P, B tree
MATCH (s:State)-[:HAS_COUNTY]->(c:County)-[:HAS_PLACE]->(p:Place)-[:HAS_BRIDGE]->(b:Bridge)
WITH s, c, p, b
RETURN s.code AS sCode, NOT c:Invalid AS validCounty, NOT p:Invalid AS validPlace, NOT b:Invalid AS validBridge, count(*) AS count
ORDER BY sCode, validCounty, validPlace, validBridge
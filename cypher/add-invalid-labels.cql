// Add Invalid labels to C, P, B
MATCH (b:Bridge)
WHERE size(b.countyCode) <> 3
OR size(b.placeCode) <> 5
OR size(b.code) <> 15
SET b:Invalid;
MATCH (p:Place)
WHERE size(p.countyCode) <> 3
OR size(p.code) <> 5
SET p:Invalid;
MATCH (c:County)
WHERE size(c.code) <> 3
SET c:Invalid;
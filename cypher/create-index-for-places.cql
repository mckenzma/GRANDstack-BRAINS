// Create Index for places
CREATE INDEX placeCountyState FOR (p:Place) ON (p.stateCode, p.countyCode, p.code)
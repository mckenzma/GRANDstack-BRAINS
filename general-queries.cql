///////////////////////////////////////////////
// DEFINED QUERIES TO EXPLORE DATA
///////////////////////////////////////////////

// Query schema meta sub graph
CALL apoc.meta.subGraph({
	labels:["File","Row","State","County","Place","Bridge"],
    rels:["DATA_FOR","CONTAINS","NEXT_FILE","NEXT_RECORD","OF_STATE","OF_COUNTY","BORDERS_STATE","SHARED_BRIDGE","LOCATED_IN","FILE_FOR"],
    excludes:["DelimitedFile","NoDelimiterFile"]
})

MATCH (s1:State)<-[r1:LOCATED_IN]-(b1:Bridge)-[r2:SHARED_BRIDGE]-(b2:Bridge)-[r3:LOCATED_IN]->(s2:State)
WITH s1, s2, head(collect(distinct([b1, b2, r1, r2, r3]))) as bridgePairs
RETURN s1, s2, bridgePairs

MATCH (s1:State)<-[r1:LOCATED_IN]-(b1:Bridge)-[r2:SHARED_BRIDGE]-(b2:Bridge)-[r3:LOCATED_IN]->(s2:State)
WITH s1, s2, head(collect(distinct([b1, b2, r1, r2, r3]))) as bridgePairs
RETURN s1, s2, bridgePairs

// Intify count of total bridges and distinct bridges per state to determine if duplicate bridges
MATCH (state:State)<-[*]-(bridge:Bridge)
WITH state.name AS stateName, count(bridge) AS totalBridges, count(DISTINCT bridge.name) AS distBridges
RETURN stateName, totalBridges, distBridges, totalBridges - distBridges AS diff

// Simple query to show number of counties, places, bridges per state
MATCH (s:State)<--(c:County)
WITH s, count(c) as NumCounties
MATCH (s)<--(c)<--(p:Place)
WITH s, NumCounties, count(p) AS NumPlaces
MATCH (s)<--(c)<--(p)<--(b:Bridge)
WITH s, NumCounties, NumPlaces, count(b) AS NumBridges
RETURN s.name, NumCounties, NumPlaces, NumBridges
ORDER BY s.name

// Count number of bridges built each year
MATCH (bridge:Bridge)
WHERE length(toString(bridge.yearbuilt)) = 4 //this ignores null values, and bridges where year recorded doesn't match designated format
WITH collect(DISTINCT bridge.yearbuilt) AS buildYears
UNWIND buildYears as buildYear
MATCH (bridge2:Bridge)
WHERE bridge2.yearbuilt = buildYear
RETURN buildYear, count(bridge2) AS Num_Bridges_Built
ORDER BY buildYear

// Count number of bridge built each year by state
MATCH (yb:YearBuilt)
MATCH (s:State)
MATCH (yb)<-[:BUILT_IN]-(bridge:Bridge)-[:OF_PLACE]->()-[:OF_COUNTY]->()-[:OF_STATE]->(s)   
RETURN yb.year.year, s.name, count(bridge)
ORDER BY yb.year.year, s.name

// count the number of (:Bridges) by (:State) and (:MaintenanceResp)
MATCH (state:State)
MATCH (maintResp:MaintenanceResp)
MATCH (state)<-[*]-(bridge:Bridge)-->(maintResp)
RETURN state.name, maintResp.description, count(bridge)
ORDER BY count(bridge) DESC
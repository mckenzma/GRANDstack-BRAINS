// Create (:YearBuilt) and connect to (:Bridge)
MATCH (bridge:Bridge)
WHERE size(toString(bridge.yearbuilt)) = 4 //this ignores null values, and bridges where year recorded doesn't match designated format`
WITH collect(DISTINCT bridge.yearbuilt) AS buildYears
UNWIND buildYears as buildYear
//MERGE (yearBuilt:YearBuilt {year: date({ year: buildYear})})
MERGE(yearBuilt:YearBuilt {year: buildYear})
WITH yearBuilt, buildYear
CALL apoc.periodic.iterate(
'
MATCH (bridge:Bridge)
WHERE bridge.yearbuilt = $build_year
MATCH (yearBuilt:YearBuilt)
//WHERE yearBuilt.year.year = $build_year
WHERE yearBuilt.year = $build_year
RETURN bridge, yearBuilt
',
'
MERGE (bridge)-[:BUILT_IN]->(yearBuilt)
',
{batchSize:10000, parallel:true, params:{build_year:buildYear}}) YIELD batches, total
RETURN batches, total
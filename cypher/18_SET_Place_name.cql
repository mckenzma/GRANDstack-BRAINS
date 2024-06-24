// Data loaded from https://www2.census.gov/programs-surveys/popest/geographies/2016/all-geocodes-v2016.xlsx converted to shared Google Sheet
CALL apoc.periodic.iterate(
'
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/12ZvB9atf_RHWpqDzahN68pgVB5PNGz34LAnsIfwcVMs/export?format=csv&id=12ZvB9atf_RHWpqDzahN68pgVB5PNGz34LAnsIfwcVMs&gid=1935809672" AS row
RETURN row
','
MATCH (state:State)
WHERE state.code = row.`State Code (FIPS)`
MATCH (state)-[:HAS_COUNTY]->(:County)-[:HAS_PLACE]->(place:Place)
WHERE place.code = row.`Place Code (FIPS)`
SET place.name = row.`Area Name (including legal/statistical area description)`
',
{batchSize:10000, parallel:false}) //YIELD batches, total
//RETURN batches, total
// creating Indexes for mass import
CREATE INDEX ON :Bridge(id);
CREATE INDEX ON :Place(id);
CREATE INDEX ON :County(id);
CREATE INDEX ON :State(id);
CREATE INDEX ON :Owner(id);
CREATE INDEX ON :MaintenanceResp(id);
CREATE INDEX ON :InspectionDate(id);

// Load and connect :State, :County, :Place, and :Bridge


// Data loaded from https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm via define URLs stored in Google Sheet
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A/export?format=csv&id=1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A&gid=1318941318" AS row1
// Data loaded from files downloaded at https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm and stored in the "import" folder for the database instance
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY/export?format=csv&id=1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY&gid=749188439" AS row1
WITH CASE
	WHEN NOT row1.Year IS NULL THEN collect(row1.URL)
    END AS fileURLs
UNWIND fileURLs as fileURL
CALL apoc.periodic.iterate(
'
LOAD CSV WITH HEADERS FROM $url AS row RETURN row

','
MERGE (state:State {id: row.STATE_CODE_001})
MERGE (state)<-[:OF_STATE]-(county:County {id: row.COUNTY_CODE_003})
MERGE (county)<-[:OF_COUNTY]-(place:Place {id: row.PLACE_CODE_004})
MERGE (place)<-[:OF_PLACE]-(bridge:Bridge {id: row.STATE_CODE_001 + "_" + 
                                               row.COUNTY_CODE_003 + "_" + 
                                               row.PLACE_CODE_004 + "_" + 
                                               row.STRUCTURE_NUMBER_008 + 
                                               "_LAT_" + row.LAT_016 + 
                                               "_LONG_" +row.LONG_017})
ON CREATE SET bridge.name = row.STRUCTURE_NUMBER_008,
			  bridge.latitude = row.LAT_016,
			  bridge.longitude = row.LONG_017,
			  bridge.yearbuilt = toInteger(row.YEAR_BUILT_027),
			  
			  place.name = row.PLACE_CODE_004,
			  county.name = row.COUNTY_CODE_003,
			  state.name = row.STATE_CODE_001
',
{batchSize:10000, parallel:false, params:{url:fileURL}}) YIELD batches, total
RETURN batches, total

// Load and connect :Owner and :MaintenanceResp to :Bridge
// Data loaded from https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm via define URLs stored in Google Sheet
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A/export?format=csv&id=1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A&gid=1318941318" AS row1
// Data loaded from files downloaded at https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm and stored in the "import" folder for the database instance
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY/export?format=csv&id=1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY&gid=749188439" AS row1
WITH CASE
	WHEN NOT row1.Year IS NULL THEN collect(row1.URL)
    END AS fileURLs
UNWIND fileURLs as fileURL
CALL apoc.periodic.iterate(
'
LOAD CSV WITH HEADERS FROM $url AS row RETURN row
','
MATCH (bridge:Bridge {id: row.STATE_CODE_001 + "_" + 
                          row.COUNTY_CODE_003 + "_" + 
                          row.PLACE_CODE_004 + "_" + 
                          row.STRUCTURE_NUMBER_008 + 
                          "_LAT_" + row.LAT_016 + 
                          "_LONG_" +row.LONG_017})
MERGE (owner:Owner {id: row.OWNER_022})
MERGE (maintResp:MaintenanceResp {id: row.MAINTENANCE_021})
MERGE (bridge)-[:OWNED_BY]->(owner)
MERGE (bridge)-[:MAINTAINED_BY]->(maintResp)
ON CREATE SET owner.name = row.OWNER_022,
			  maintResp.name = row.MAINTENANCE_021
',
{batchSize:10000, parallel:false, params:{url:fileURL}}) YIELD batches, total
RETURN batches, total

// Convert Latitude and Longitude from initial import to point (spatial)
CALL apoc.periodic.iterate('
MATCH (bridge:Bridge)
WHERE NOT bridge.latitude IS NULL
AND NOT bridge.longitude IS NULL
RETURN bridge
','
WITH bridge,
     toFloat(left(bridge.latitude, 2)) + toFloat(substring(bridge.latitude,2,2))/60 + toFloat(right(bridge.latitude,4))/100/3600 AS latitude_decimal,
     size(bridge.longitude) AS long_size
WITH bridge,
     latitude_decimal,
     CASE long_size
        WHEN 8 THEN -1 * ( toFloat(left(bridge.longitude, 2)) + toFloat(substring(bridge.longitude,2,2))/60 + toFloat(right(bridge.longitude,4))/100/3600 )
        WHEN 9 THEN -1 * ( toFloat(left(bridge.longitude, 3)) + toFloat(substring(bridge.longitude,3,2))/60 + toFloat(right(bridge.longitude,4))/100/3600 )
     END AS longitude_decimal
SET bridge.location = point({ longitude: longitude_decimal, latitude: latitude_decimal }),
    bridge.longitude_decimal = longitude_decimal,
    bridge.latitude_decimal = latitude_decimal
',
{batchSize:10000, parallel:true}) YIELD batches, total
RETURN batches, total





/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
// Load and create :InspectionDate
// Data loaded from https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm via define URLs stored in Google Sheet
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A/export?format=csv&id=1sFcY7LFBCGXSFG336UPoOf72BBv3bmv_AVaYLxwiV4A&gid=1318941318" AS row1
CREATE INDEX ON :InspectionDate(id);
// Data loaded from files downloaded at https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm and stored in the "import" folder for the database instance
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY/export?format=csv&id=1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY&gid=749188439" AS row1
WITH CASE
    //WHEN NOT row1.Year IS NULL THEN collect([row1.URL,row1.Year])
    WHEN NOT row1.Year IS NULL THEN collect(row1.URL)
    END AS fileURLs
UNWIND fileURLs as fileURL
CALL apoc.periodic.iterate(
'
LOAD CSV WITH HEADERS FROM $url AS row RETURN row
','
//MATCH (state:State {id: row.STATE_CODE_001})
//MATCH (state)<-[:OF_STATE]-(county:County {id: row.COUNTY_CODE_003})
//MATCH (county)<-[:OF_COUNTY]-(place:Place {id: row.PLACE_CODE_004})
//MATCH (place)<-[:OF_PLACE]-(bridge:Bridge {id: row.STATE_CODE_001 + "_" + 
//                                               row.COUNTY_CODE_003 + "_" + 
//                                               row.PLACE_CODE_004 + "_" + 
//                                               row.STRUCTURE_NUMBER_008 + 
//                                               "_LAT_" + row.LAT_016 + 
//                                               "_LONG_" +row.LONG_017})

MATCH (bridge:Bridge {id: row.STATE_CODE_001 + "_" + 
                          row.COUNTY_CODE_003 + "_" + 
                          row.PLACE_CODE_004 + "_" + 
                          row.STRUCTURE_NUMBER_008 + 
                          "_LAT_" + row.LAT_016 + 
                          "_LONG_" +row.LONG_017})
MERGE (bridge)-[:INSPECTED_ON]->(inspDate:InspectionDate {id: row.DATE_OF_INSPECT_090})
ON CREATE SET inspDate.id = row.DATE_OF_INSPECT_090
',
//{batchSize:10000, parallel:false, params:{url:fileURL[0], fileYear:fileURL[1]}}) YIELD batches, total
{batchSize:10000, parallel:false, params:{url:fileURL}}) YIELD batches, total
RETURN batches, total


// need to update, clean, and change insp dates to temporal format
LOAD CSV WITH HEADERS FROM "https://www.fhwa.dot.gov/bridge/nbi/2018/delimited/AL18.txt" AS row
WITH row, replace(row.DATE_OF_INSPECT_090, " ", "") AS temp
WITH row, temp, 
    CASE size(temp)
        WHEN 3 THEN toInteger(left(temp,1))
        WHEN 4 THEN toInteger(left(temp,2))
    END AS month,
    CASE 
        WHEN ( toInteger(right(temp,2)) <= 99 AND toInteger(right(temp,2)) >= 92 ) THEN toInteger("19" + right(temp,2))
        WHEN ( toInteger(right(temp,2)) >= 00 AND toInteger(right(temp,2)) < 92 ) THEN toInteger("20" + right(temp,2))
    END AS year
RETURN row.DATE_OF_INSPECT_090, size(row.DATE_OF_INSPECT_090), temp, month, year
ORDER BY month
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////


// Data loaded from files downloaded at https://www.fhwa.dot.gov/bridge/nbi/ascii.cfm and stored in the "import" folder for the database instance
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY/export?format=csv&id=1S2yMzP30KfjQx2TBE42VjVnH8ZODLVN1lDGwmsPpPJY&gid=749188439" AS row1
WITH CASE
    WHEN NOT row1.Year IS NULL THEN collect(row1.URL)
    END AS fileURLs
UNWIND fileURLs as fileURL
CALL apoc.periodic.iterate(
'
LOAD CSV WITH HEADERS FROM $url AS row RETURN row
','
MATCH (bridge:Bridge {id: row.STATE_CODE_001 + "_" + 
                          row.COUNTY_CODE_003 + "_" + 
                          row.PLACE_CODE_004 + "_" + 
                          row.STRUCTURE_NUMBER_008 + 
                          "_LAT_" + row.LAT_016 + 
                          "_LONG_" +row.LONG_017})
MERGE (structureKind:StructureKind {id: row.STRUCTURE_KIND_043A})
MERGE (structureType:StructureType {id: row.STRUCTURE_TYPE_043B})
MERGE (bridge)-[:HAS_STRUCTURE_KIND]->(structureKind)
MERGE (bridge)-[:HAS_STRUCTURE_TYPE]->(structureType)
ON CREATE SET structureKind.code = row.STRUCTURE_KIND_043A,
              structureType.code = row.STRUCTURE_TYPE_043B
',
{batchSize:10000, parallel:false, params:{url:fileURL}}) YIELD batches, total
RETURN batches, total

//query to add Structure Kind Code Description
MATCH (structureKind:StructureKind)
SET structureKind.description = 
CASE structureKind.code
    WHEN "1" THEN "Concrete"
    WHEN "2" THEN "Concrete continuous"
    WHEN "3" THEN "Steel"
    WHEN "4" THEN "Steel continuous"
    WHEN "5" THEN "Prestressed concrete (incl. Post-tension)"
    WHEN "6" THEN "Prestressed concrete continous (incl. Post-tension)"
    WHEN "7" THEN "Wood or Timber"
    WHEN "8" THEN "Masonry"
    WHEN "9" THEN "Aluminum, Wrought Iron, or Cast Iron"
    WHEN "0" THEN "Other"
END

//query to add Structure Type Code Description
MATCH (structureType:StructureType)
SET structureType.description = 
CASE structureType.code
    WHEN "01" THEN "Slab"
    WHEN "02" THEN "Stringer/Multi-beam or Girder"
    WHEN "03" THEN "Girder and Floorbeam System"
    WHEN "04" THEN "Tee Beam"
    WHEN "05" THEN "Box Beam or Girders - Multiple"
    WHEN "06" THEN "Box Beam or Girders - Single or Spread"
    WHEN "07" THEN "Frame (except culverts)"
    WHEN "08" THEN "Orthotropic"
    WHEN "09" THEN "Truss - Deck"
    WHEN "10" THEN "Truss - Thru"
    WHEN "11" THEN "Arch - Deck"
    WHEN "12" THEN "Arch - Thru"
    WHEN "13" THEN "Suspension"
    WHEN "14" THEN "Stayed Girder"
    WHEN "15" THEN "Movable - Lift"
    WHEN "16" THEN "Movable - Bascule"
    WHEN "17" THEN "Movable - Swing"
    WHEN "18" THEN "Tunnel"
    WHEN "19" THEN "Culvert (includes frame culverts)"
    WHEN "20" THEN "Mixed types *"
    WHEN "21" THEN "Sergmental Box Girder"
    WHEN "22" THEN "Channel Beam"
    WHEN "00" THEN "Other"
END

















// trying to understand what data is valid
MATCH (iD:InspectionDate)
WHERE (size(replace(iD.id," ", "")) = 3 OR size(replace(iD.id," ", "")) = 4)
AND NOT iD.id CONTAINS "."
WITH iD, 
	 replace(iD.id," ", "") AS tempDate
//RETURN replace(iD.id," ", ""), 
//	   right(replace(iD.id," ", ""),2) AS year,
//       CASE size(replace(iD.id," ", ""))
//       	WHEN 3 THEN "0" + left(replace(iD.id," ", ""), 1)
//        WHEN 4 THEN left(replace(iD.id," ", ""), 2)
//       END AS month
//ORDER BY year, month
WITH iD,
	 tempDate,
	 right(tempDate, 2) AS year,
	 CASE size(tempDate)
	 	WHEN 3 THEN "0" + left(tempDate, 1)
	 	WHEN 4 THEN left(tempDate, 2)
	 END AS month
RETURN iD.year, tempDate, year, month
ORDER BY year, month
//SET iD.date({ year})





// set Inspection Date month and year properties
MATCH (inspDate:InspectionDate)
SET inspDate.year = right(inspDate.id, 2)
WITH inspDate.year AS inspDateYear
MATCH (inspDate:InspectionDate)
WHERE size(inspDate.id) = 3
SET inspDate.month = left(inspDate.id, 1)
WITH inspDateYear, inspDate.month AS inspDateMonth
MATCH (inspDate:InspectionDate)
WHERE size(inspDate.id) = 4
SET inspDate.month = left(inspDate.id, 2)







// Create (:YearBuilt) and connect to (:Bridge)
MATCH (bridge:Bridge)
WHERE size(toString(bridge.yearbuilt)) = 4 //this ignores null values, and bridges where year recorded doesn't match designated format`
WITH collect(DISTINCT bridge.yearbuilt) AS buildYears
UNWIND buildYears as buildYear
MERGE (yearBuilt:YearBuilt {year: date({ year: buildYear})})
//MERGE(yearBuilt:YearBuilt {year: buildYear})
WITH yearBuilt, buildYear
CALL apoc.periodic.iterate(
'
MATCH (bridge:Bridge)
WHERE bridge.yearbuilt = $build_year
MATCH (yearBuilt:YearBuilt)
WHERE yearBuilt.year.year = $build_year
RETURN bridge, yearBuilt
',
'
MERGE (bridge)-[:BUILT_IN]->(yearBuilt)
',
{batchSize:10000, parallel:true, params:{build_year:buildYear}}) YIELD batches, total
RETURN batches, total











// connect (:InspectionDate) to (:Month) in timeline tree
MATCH (bridge:Bridge)-[:INSPECTED_ON]->(inspDate:InspectionDate)
MATCH (year:Year {id: inspDate.year})-[:MONTH]->(month:Month {id: inspDate.month})
MERGE (inspDate)-[:DATE_OF_INSPECTION]->(month)

// Create Condition Rating Nodes
UNWIND [['N', 'NOT APPLICABLE', ''], 
        ['9', 'EXCELLENT CONDITION', ''],
        ['8', 'VERY GOOD CONDITION', 'No problems noted.'],
        ['7', 'GOOD CONDITION', 'Some minor problems.'],
        ['6', 'SATISFACTORY CONDITION', 'structural elements show some minor deterioration.'],
        ['5', 'FAIR CONDITION', 'All primary structural elements are sound but may have minor section loss, cracking, spalling or scour.'],
        ['4', 'POOR CONDITION', 'Advanced section loss, deterioration, spalling or scour.'],
        ['3', 'SERIOUS CONDITION', 'Loss of section, deterioration, spalling or scour have seriously affected primary structural components. Local failures are possible. Fatigue cracks in stell or shear cracks in concrete may be present.'],
        ['2', 'CRITICAL CONDITION', 'Advanced deterioration of primary structural elements. Fatigue cracks in steel or shear cracks in concrete may be present or scour may have removed substructure support. Unless closesly monitored it may be necessary to close the bridge until corrective action is taken.'],
        ['1', '"IMMINENT" FAILURE CONDITION', 'Major deterioration or section loss present in critical structural components or obvious vertical or horizontal movement affecting structure stability. Bridge is closed to traffic but corrective action may put back in light service.'],
        ['0', 'FAILED CONDITION', 'Out of Service - Beyond corrective action.']] AS rating_code
CREATE (:ConditionRating {code: rating_code[0], generalDescription: rating_code[1], additionalDescription: rating_code[2]})

// Create Appraisal Rating Nodes
UNWIND [['N', 'Not applicable'], 
        ['9', 'Superior to present desirable criteria'],
        ['8', 'Equal to present desirable criteria'],
        ['7', 'Better than present minimum criteria'],
        ['6', 'Equal to present minimum criteria'],
        ['5', 'Somewhat better than minimum adequacy to tolerate being left in place as is'],
        ['4', 'Meets minimum tolerable limits to be left in place as is'],
        ['3', 'Basically intolerable requiring high priority of corrective action'],
        ['2', 'Basically intolerable requiring high priority of replacement'],
        ['1', 'This value of raiting cide not used'],
        ['0', 'Bridge closed']] AS appraisal_code
CREATE (:AppraisalRating {code: appraisal_code[0], description: appraisal_code[1]})


// create (:Evaluation) and connect to (:InspectionDate) and (:Bridge)
CALL apoc.periodic.iterate("
UNWIND ['file:///MN14.csv', 'file:///AK14.csv'] AS file
LOAD CSV WITH HEADERS FROM file AS row RETURN row",
"
MATCH (bridge:Bridge {id: row.STRUCTURE_NUMBER_008}) //need to update this to match bridge id
MATCH (inspDate:InspectionDate {id: row.DATE_OF_INSPECT_090})
MERGE (evaluation:Evaluation {id: bridge.id + inspDate.id})
MERGE (bridge)<-[:EVALUATION_OF]-(evaluation)-[:EVALUATED_ON]->(inspDate)
ON CREATE SET evaluation.id = bridge.id + inspDate.id,
			  
              evaluation.deck_cond = row.DECK_COND_058,
			  evaluation.superstructure_cond = row.SUPERSTRUCTURE_COND_059,
			  evaluation.substructure_cond = row.SUBSTRUCTURE_COND_060,
			  evaluation.channel_cond = row.CHANNEL_COND_061,
			  evaluation.culvert_cond = row.CULVERT_COND_062,

			  evaluation.structural_eval = row.STRUCTURAL_EVAL_067,
			  evaluation.deck_geometry_eval = row.DECK_GEOMETRY_EVAL_068,
			  evaluation.undclrence_eval = row.UNDCLRENCE_EVAL_069,
			  evaluation.posting_eval = row.POSTING_EVAL_070,
			  evaluation.waterway_eval = row.WATERWAY_EVAL_071,
			  evaluation.appr_road_eval = row.APPR_ROAD_EVAL_072
",
{batchSize:1000,iterateList:true});


// converting latitude to decimal
MATCH (bridge:Bridge)
WHERE size(bridge.latitude) = 8
SET bridge.latitude_decimal = toFloat(left(bridge.latitude, 2)) + toFloat(substring(bridge.latitude,2,2))/60 + toFloat(right(bridge.latitude,4))/100/3600

// query to verify new latitude_decimal property
MATCH (bridge:Bridge)
WHERE size(bridge.latitude) = 8
//SET bridge.latitude_decimal = toFloat(left(bridge.latitude, 2)) + toFloat(substring(bridge.latitude,2,2))/60 + toFloat(right(bridge.latitude,4))/100/3600
RETURN bridge.latitude AS Lat, 
	   toFloat(left(bridge.latitude, 2)) AS Degrees, 
	   toFloat(substring(bridge.latitude,2,2))/60 AS Minutes,
       toFloat(right(bridge.latitude,4))/100/3600 AS Seconds,
       toFloat(left(bridge.latitude, 2)) + toFloat(substring(bridge.latitude,2,2))/60 + toFloat(right(bridge.latitude,4))/100/3600 AS Lat_Decimal,
       bridge.latitude_decimal
ORDER BY Lat


// converting longitude to decimal
MATCH (bridge:Bridge)
WITH bridge, size(bridge.longitude) AS long_size
WHERE long_size >= 8
SET bridge.longitude_decimal = 
CASE long_size
	WHEN 8 THEN -1 * ( toFloat(left(bridge.longitude, 2)) + toFloat(substring(bridge.longitude,2,2))/60 + toFloat(right(bridge.longitude,4))/100/3600 )
    WHEN 9 THEN -1 * ( toFloat(left(bridge.longitude, 3)) + toFloat(substring(bridge.longitude,3,2))/60 + toFloat(right(bridge.longitude,4))/100/3600 )
END

// query to verify new latitude_decimal property
MATCH (bridge:Bridge)
WITH bridge, size(bridge.longitude) AS long_size
WHERE long_size >= 8
RETURN size(bridge.longitude),
	   bridge.longitude AS Long, 
	CASE size(bridge.longitude)
		WHEN 8 THEN toFloat(left(bridge.longitude, 2))
		WHEN 9 THEN toFloat(left(bridge.longitude, 3))
	END AS Degrees,
    CASE size(bridge.longitude)
    	WHEN 8 THEN toFloat(substring(bridge.longitude,2,2))/60
        WHEN 9 THEN toFloat(substring(bridge.longitude,3,2))/60
	END AS Minutes,
	   toFloat(right(bridge.longitude,4))/100/3600 AS Seconds,
	CASE long_size
		WHEN 8 THEN -1 * ( toFloat(left(bridge.longitude, 2)) + toFloat(substring(bridge.longitude,2,2))/60 + toFloat(right(bridge.longitude,4))/100/3600 )
	    WHEN 9 THEN -1 * ( toFloat(left(bridge.longitude, 3)) + toFloat(substring(bridge.longitude,3,2))/60 + toFloat(right(bridge.longitude,4))/100/3600 )
	END AS decimal,
	bridge.longitude_decimal
ORDER BY Long


// adding Bridge long & lat as point
MATCH (bridge:Bridge)
WHERE NOT bridge.latitude IS NULL
AND NOT bridge.longitude IS NULL
WITH bridge,
	 toFloat(left(bridge.latitude, 2)) + toFloat(substring(bridge.latitude,2,2))/60 + toFloat(right(bridge.latitude,4))/100/3600 AS latitude_decimal,
     size(bridge.longitude) AS long_size
WITH bridge,
	 latitude_decimal,
     CASE long_size
	 	WHEN 8 THEN -1 * ( toFloat(left(bridge.longitude, 2)) + toFloat(substring(bridge.longitude,2,2))/60 + toFloat(right(bridge.longitude,4))/100/3600 )
     	WHEN 9 THEN -1 * ( toFloat(left(bridge.longitude, 3)) + toFloat(substring(bridge.longitude,3,2))/60 + toFloat(right(bridge.longitude,4))/100/3600 )
	 END AS longitude_decimal
SET bridge.location = point({ longitude: longitude_decimal, latitude: latitude_decimal })



//query to change state name from id to state letters
// This changes the state "numeric" code to the 2-letter state abreviation
MATCH (state:State)
SET state.name = 
CASE state.name
	WHEN "01" THEN "AL"
    WHEN "02" THEN "AK"
    //WHEN "03" THEN "" //this is not referenced. kept for numeric continuity
    WHEN "04" THEN "AZ"
    WHEN "05" THEN "AR"
    WHEN "06" THEN "CA"
    //WHEN "07" THEN "" //this is not referenced. kept for numeric continuity
    WHEN "08" THEN "CO"
    WHEN "09" THEN "CT"
    WHEN "10" THEN "DE"
    WHEN "11" THEN "DC"
    WHEN "12" THEN "FL"
    WHEN "13" THEN "GA"
    //WHEN "14" THEN "" //this is not referenced. kept for numeric continuity
    WHEN "15" THEN "HI"
    WHEN "16" THEN "ID"
    WHEN "17" THEN "IL"
    WHEN "18" THEN "IN"
    WHEN "19" THEN "IA"
    WHEN "20" THEN "KS"
    WHEN "21" THEN "KY"
    WHEN "22" THEN "LA"
    WHEN "23" THEN "ME"
    WHEN "24" THEN "MD"
    WHEN "25" THEN "MA"
    WHEN "26" THEN "MI"
    WHEN "27" THEN "MN"
    WHEN "28" THEN "MS"
    WHEN "29" THEN "MO"
    WHEN "30" THEN "MT"
    WHEN "31" THEN "NE"
    WHEN "32" THEN "NV"
    WHEN "33" THEN "NH"
    WHEN "34" THEN "NJ"
    WHEN "35" THEN "NM"
    WHEN "36" THEN "NY"
    WHEN "37" THEN "NC"
    WHEN "38" THEN "ND"
    WHEN "39" THEN "OH"
    WHEN "40" THEN "OK"
    WHEN "41" THEN "OR"
    WHEN "42" THEN "PA"
    //WHEN "43" THEN "" //this is not referenced. kept for numeric continuity
    WHEN "44" THEN "RI"
    WHEN "45" THEN "SC"
    WHEN "46" THEN "SD"
    WHEN "47" THEN "TN"
    WHEN "48" THEN "TX"
    WHEN "49" THEN "UT"
    WHEN "50" THEN "VT"
    WHEN "51" THEN "VA"
    WHEN "53" THEN "WA"
    WHEN "54" THEN "WV"
    WHEN "55" THEN "WI"
    WHEN "56" THEN "WY"
    WHEN "72" THEN "PR"
END

// Data loaded from https://www2.census.gov/programs-surveys/popest/geographies/2016/all-geocodes-v2016.xlsx converted to shared Google Sheet
CALL apoc.periodic.iterate(
'
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/12ZvB9atf_RHWpqDzahN68pgVB5PNGz34LAnsIfwcVMs/export?format=csv&id=12ZvB9atf_RHWpqDzahN68pgVB5PNGz34LAnsIfwcVMs&gid=1935809672" AS row
RETURN row
','
MATCH (state:State)
WHERE state.id = row.`State Code (FIPS)`
MATCH (state)<-[:OF_STATE]-(county:County)
WHERE county.id = row.`County Code (FIPS)`
SET county.name = row.`Area Name (including legal/statistical area description)`
',
{batchSize:10000, parallel:false}) YIELD batches, total
RETURN batches, total

// Data loaded from https://www2.census.gov/programs-surveys/popest/geographies/2016/all-geocodes-v2016.xlsx converted to shared Google Sheet
CALL apoc.periodic.iterate(
'
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/12ZvB9atf_RHWpqDzahN68pgVB5PNGz34LAnsIfwcVMs/export?format=csv&id=12ZvB9atf_RHWpqDzahN68pgVB5PNGz34LAnsIfwcVMs&gid=1935809672" AS row
RETURN row
','
MATCH (state:State)
WHERE state.id = row.`State Code (FIPS)`
MATCH (state)<--(:County)<--(place:Place)
WHERE place.id = row.`Place Code (FIPS)`
SET place.name = row.`Area Name (including legal/statistical area description)`
',
{batchSize:10000, parallel:false}) YIELD batches, total
RETURN batches, total

//query to add Maintenance Responsibility Code Description
MATCH (maintResp:MaintenanceResp)
SET maintResp.description = 
CASE maintResp.name
    WHEN "01" THEN "State Highway Agency"
    WHEN "02" THEN "County Highway Agency"
    WHEN "03" THEN "Town or Township Highway Agency"
    WHEN "04" THEN "City or Municipal Highway Agency"
    WHEN "11" THEN "State Park, Forest, or Reservation Agency"
    WHEN "12" THEN "Local Park, Forest, or Reservation Agency"
    WHEN "21" THEN "Other State Agencies"
    WHEN "25" THEN "Othe Local Agencies"
    WHEN "26" THEN "Private (other than railroad)"
    WHEN "27" THEN "Railroad"
    WHEN "31" THEN "State Toll Authority"
    WHEN "32" THEN "Local Toll Authority"
    WHEN "60" THEN "Other Federal Agencies"// (not listed below)"
    WHEN "61" THEN "Indian Tribal Government"
    WHEN "62" THEN "Bureau of Indian Affairs"
    WHEN "63" THEN "Bureau of Fish and Wildlife"
    WHEN "64" THEN "U.S. Forest Service"
    WHEN "66" THEN "National Park Service"
    WHEN "67" THEN "Tennessee Valley Authority"
    WHEN "68" THEN "Bureau of Land Management"
    WHEN "69" THEN "Bureau of Reclamation"
    WHEN "70" THEN "Corps of Engineers (Civil)"
    WHEN "71" THEN "Corps of Engineers (Military)"
    WHEN "72" THEN "Air Force"
    WHEN "73" THEN "Navy/Marines"
    WHEN "74" THEN "Army"
    WHEN "75" THEN "NASA"
    WHEN "76" THEN "Metropolitan Washington Airports Service"
    WHEN "80" THEN "Unkown"
END



///////////////////////////////////////////////
// DEFINED QUERIES TO EXPLORE DATA
///////////////////////////////////////////////

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


///////////////////////////////////////////////
// Everything below here references the different headers to be incorporated.
// Commented out lines reference headers that have been incoroporated in some fashion above.
///////////////////////////////////////////////
//STATE_CODE_001
HIGHWAY_DISTRICT_002
//COUNTY_CODE_003
//PLACE_CODE_004
RECORD_TYPE_005A
ROUTE_PREFIX_005B
SERVICE_LEVEL_005C
ROUTE_NUMBER_005D
DIRECTION_005E
FEATURES_DESC_006A
CRITICAL_FACILITY_006B
FACILITY_CARRIED_007
//STRUCTURE_NUMBER_008
LOCATION_009
MIN_VERT_CLR_010
KILOPOINT_011
BASE_HWY_NETWORK_012
LRS_INV_ROUTE_013A
SUBROUTE_NO_013B
//LAT_016
//LONG_017

DETOUR_KILOS_019
//TOLL_020
//MAINTENANCE_021
//OWNER_022

FUNCTIONAL_CLASS_026
//YEAR_BUILT_027
TRAFFIC_LANES_ON_028A
TRAFFIC_LANES_UND_028B
ADT_029
YEAR_ADT_030
DESIGN_LOAD_031
APPR_WIDTH_MT_032
MEDIAN_CODE_033
DEGREES_SKEW_034
STRUCTURE_FLARED_035
RAILINGS_036A
TRANSITIONS_036B
APPR_RAIL_036C
APPR_RAIL_END_036D
HISTORY_037
NAVIGATION_038
NAV_VERT_CLR_MT_039
NAV_HORR_CLR_MT_040
OPEN_CLOSED_POSTED_041
SERVICE_ON_042A
SERVICE_UND_042B
STRUCTURE_KIND_043A
STRUCTURE_TYPE_043B
APPR_KIND_044A
APPR_TYPE_044B
MAIN_UNIT_SPANS_045
APPR_SPANS_046
HORR_CLR_MT_047
MAX_SPAN_LEN_MT_048
STRUCTURE_LEN_MT_049
LEFT_CURB_MT_050A
RIGHT_CURB_MT_050B
ROADWAY_WIDTH_MT_051
DECK_WIDTH_MT_052
VERT_CLR_OVER_MT_053
VERT_CLR_UND_REF_054A
VERT_CLR_UND_054B
LAT_UND_REF_055A
LAT_UND_MT_055B
LEFT_LAT_UND_MT_056

DECK_COND_058
SUPERSTRUCTURE_COND_059
SUBSTRUCTURE_COND_060
CHANNEL_COND_061
CULVERT_COND_062

OPR_RATING_METH_063
OPERATING_RATING_064

INV_RATING_METH_065
INVENTORY_RATING_066

STRUCTURAL_EVAL_067
DECK_GEOMETRY_EVAL_068
UNDCLRENCE_EVAL_069
POSTING_EVAL_070
WATERWAY_EVAL_071
APPR_ROAD_EVAL_072

WORK_PROPOSED_075A
WORK_DONE_BY_075B
IMP_LEN_MT_076

//DATE_OF_INSPECT_090
INSPECT_FREQ_MONTHS_091
FRACTURE_092A
UNDWATER_LOOK_SEE_092B
SPEC_INSPECT_092C
FRACTURE_LAST_DATE_093A
UNDWATER_LAST_DATE_093B
SPEC_LAST_DATE_093C
BRIDGE_IMP_COST_094
ROADWAY_IMP_COST_095
TOTAL_IMP_COST_096
YEAR_OF_IMP_097
OTHER_STATE_CODE_098A
OTHER_STATE_PCNT_098B
OTHR_STATE_STRUC_NO_099
STRAHNET_HIGHWAY_100
PARALLEL_STRUCTURE_101
TRAFFIC_DIRECTION_102
TEMP_STRUCTURE_103
HIGHWAY_SYSTEM_104
FEDERAL_LANDS_105
YEAR_RECONSTRUCTED_106
DECK_STRUCTURE_TYPE_107
SURFACE_TYPE_108A
MEMBRANE_TYPE_108B
DECK_PROTECTION_108C
PERCENT_ADT_TRUCK_109
NATIONAL_NETWORK_110
PIER_PROTECTION_111
BRIDGE_LEN_IND_112
SCOUR_CRITICAL_113
FUTURE_ADT_114
YEAR_OF_FUTURE_ADT_115
MIN_NAV_CLR_MT_116
FED_AGENCY
DATE_LAST_UPDATE
TYPE_LAST_UPDATE
DEDUCT_CODE
REMARKS
PROGRAM_CODE
PROJ_NO
PROJ_SUFFIX
NBI_TYPE_OF_IMP
DTL_TYPE_OF_IMP
SPECIAL_CODE
STEP_CODE
STATUS_WITH_10YR_RULE
SUFFICIENCY_ASTERC
SUFFICIENCY_RATING
STATUS_NO_10YR_RULE
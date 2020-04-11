// terminal command to download files from https://wambachers-osm.website/boundaries/
curl -f -o osm-boundaries.zip --url 'https://wambachers-osm.website/boundaries/exportBoundaries?cliVersion=1.0&cliKey=200701b0-e0d6-4772-a714-b76308222f14&exportFormat=json&exportLayout=levels&exportAreas=water&from_AL=2&to_AL=8&union=false&selected=148838'

// Create (:CountryBoundary) Nodes
WITH "file:///United_States_AL2.GeoJson" AS url
CALL apoc.load.json(url) YIELD value
WITH value.features[0].properties AS properties,
    value.features[0].geometry.coordinates AS coordArrayBig
WITH properties, coordArrayBig, size(coordArrayBig) AS sizeBig
UNWIND coordArrayBig AS lilArray
UNWIND lilArray AS tinyArray
UNWIND range(0,size(tinyArray)-2) AS idx // -2 bc don't need to include last set of coords in array because last is same as first. Doing it this way means don't need to MERGE
WITH properties, tinyArray[idx] AS coords
WITH coords,// AS coords,
     toInteger(properties.srid) AS srid,
     properties.id AS id,
     properties.name AS name,
     properties.localname AS localname,
     properties.official_name AS official_name
CREATE (cb:CountryBoundary)
SET cb.location = point({longitude: coords[0], latitude: coords[1], srid: srid}),
    //cb.srid = srid,
    cb.id = id,
    cb.name = name,
    cb.localname = localname,
    cb.official_name = official_name

// Connect (:CountryBoundary) nodes
WITH "file:///United_States_AL2.GeoJson" AS url
CALL apoc.load.json(url) YIELD value
WITH value.features[0].properties AS properties,
    value.features[0].geometry.coordinates AS coordArrayBig
WITH properties, coordArrayBig, size(coordArrayBig) AS sizeBig
UNWIND coordArrayBig AS lilArray
UNWIND lilArray AS tinyArray
UNWIND range(0,size(tinyArray)-2) AS idx // -2 bc don't need to include last set of coords in array because last is same as first. Doing it this way means don't need to MERGE
WITH properties, tinyArray[idx] AS startCoords, tinyArray[idx+1] AS endCoords
WITH startCoords,
    endCoords,
     //toInteger(properties.srid) AS srid,
     //properties.id AS id,
     properties.name AS name//,
     //properties.localname AS localname,
     //properties.official_name AS official_name
MATCH (start:CountryBoundary {name: name, location: point({longitude: startCoords[0], latitude: startCoords[1]})})
MATCH (end:CountryBoundary {name: name, location: point({longitude: endCoords[0], latitude: endCoords[1]})})
MERGE (start)-[:NEXT]->(end)





// Things below are work in progress






WITH "file:///United_States_AL2.GeoJson" AS url
CALL apoc.load.json(url) YIELD value
WITH value.features[0].properties AS properties,
    value.features[0].geometry.coordinates AS coordArrayBig
WITH properties, coordArrayBig, size(coordArrayBig) AS sizeBig
UNWIND coordArrayBig AS lilArray
UNWIND lilArray[0] AS tinyArray
UNWIND range(0,size(tinyArray)-2) AS idx
MATCH (start:CountryBoundary {})


WITH properties, tinyArray[idx] AS coords
WITH coords,// AS coords,
     properties.srid AS srid,
     properties.id AS id,
     properties.name AS name,
     properties.localname AS localname,
     properties.official_name AS official_name
CREATE (cb:CountryBoundary)
SET cb.coords = coords,
    cb.srid = srid,
    cb.id = id,
    cb.name = name,
    cb.localname = localname,
    cb.official_name = official_name




    
// Connect (:CountryBoundary) nodes to create boundary
WITH "file:///United_States_AL2.GeoJson" AS url
CALL apoc.load.json(url) YIELD value
WITH value.features[0].geometry.coordinates[0][0] AS points
UNWIND range(0,size(points)-2) AS idx
WITH points[idx] AS startNode, points[idx+1] AS endNode
//RETURN startNode, endNode
MATCH (start:StateBoundary {state: "Alabama", location: point({longitude: startNode[0], latitude: startNode[1]})})
MATCH (end:StateBoundary {state: "Alabama", location: point({longitude: endNode[0], latitude: endNode[1]})})
//RETURN start {.*}, end {.*}
MERGE (start)-[:NEXT]->(end)







// Create (:StateBoundary) nodes
WITH "file:///United_States_AL8.GeoJson" AS url
CALL apoc.load.json(url) YIELD value
WITH value.features[0].geometry.coordinates[0][0] AS points
UNWIND points AS point
MERGE (sb:StateBoundary {state: "Alabama", location: point({longitude: point[0], latitude: point[1]})})

// Connect (:StateBoundary) nodes to create boundary
WITH "file:///United_States_AL8.GeoJson" AS url
CALL apoc.load.json(url) YIELD value
WITH value.features[0].geometry.coordinates[0][0] AS points
UNWIND range(0,size(points)-2) AS idx
WITH points[idx] AS startNode, points[idx+1] AS endNode
//RETURN startNode, endNode
MATCH (start:StateBoundary {state: "Alabama", location: point({longitude: startNode[0], latitude: startNode[1]})})
MATCH (end:StateBoundary {state: "Alabama", location: point({longitude: endNode[0], latitude: endNode[1]})})
//RETURN start {.*}, end {.*}
MERGE (start)-[:NEXT]->(end)









WITH "file:///United_States_AL8.GeoJson" AS url
CALL apoc.load.json(url) YIELD value
WITH value.features AS things
UNWIND things AS thing
CREATE (n:Node) 
SET //n.name = thing.properties.name,
   //n.bbox = thing.bbox,
   //n.coordinates = thing.geometry.coordinates[0][0][0]
//{
//"type":"Feature",
//"properties" : {
   //"srid"          : "4326",
   n.srid = thing.properties.srid,
   //"id"            : "253672",
   n.id = thing.properties.id,
   //"name"          : "Aasu",
   n.name = thing.properties.name,
   //"localname"     : "Aasu",
   n.localname = thing.properties.name,
   //"official_name" : "",
   //n.official_name = thing.properties.official_name,
   //"boundary"      : "administrative",
   n.boundary = thing.properties.boundary,
   //"admin_level"   : "8",
   n.admin_level = thing.properties.admin_level,
   //"note"          : "",
   n.note = thing.properties.note,
   //"wikidata"      : "Q2820114",
   //n.wikidata = thing.properties.wikidata,
   //"wikipedia"     : "en:Aasu, American Samoa",
   //"timestamp"     : "2019-11-02 23:01:02",
   //"rpath"         : "253672,4027563,7381454,2177187,148838,0",
   //"alltags"       : {
      //"is_in" : "USA, American Samoa",
      //"wikidata" : "Q2820114",
      //"wikipedia" : "en:Aasu, American Samoa",
      //"border_type" : "village",
      n.border_type = thing.properties.alltags.border_type,
      //"is_in:state" : "American Samoa",
      n.is_in_state = thing.properties.alltags.`is_in:state`,
      //"is_in:country" : "USA;American Samoa",
      n.is_in_country = thing.properties.alltags.`is_in:country`,
      //"is_in:state_code" : "AS",
      n.is_in_state_code = thing.properties.alltags.`is_in:state_code`,
      //"is_in:country_code" : "AS"}
      n.is_in_country_code = thing.properties.alltags.`is_in:country_code`,
   //},
   //"bbox"    : [-170.77081, -14.318303, -170.73726, -14.278627],
   n.bbox = thing.bbox,
   //"geometry": {"type":"MultiPolygon","coordinates":[[[[-170.770817,-14.314279],[-170.770751,-14.314278],[-170.770556,-14.314276],[-170.770526,-14.314276],[-170.770492,-14.314274],[-170.770288,-14.314263],[-170.770135,-14.314255],[-170.769679,-14.31423],[-170.769476,-14.314219],[-170.769402,-14.314216],[-170.769307,-14.314214],[-170.76918,-14.314209],[-170.769107,-14.314207],[-170.768585,-14.31419],[-170.768546,-14.314188],[-170.768475,-14.314185],[-170.768411,-14.314182],[-170.768371,-14.314182],[-170.767873,-14.314188],[-170.767825,-14.314193],[-170.767769,-14.314205],[-170.767498,-14.314265],[-170.767486,-14.314268],[-170.767214,-14.314345],[-170.76694,-14.314434],[-170.766752,-14.314497],[-170.766735,-14.314502],[-170.766593,-14.314552],[-170.766406,-14.314613],[-170.766291,-14.314651],[-170.766043,-14.314732],[-170.765711,-14.314849],[-170.765281,-14.314985],[-170.765164,-14.31502],[-170.76507,-14.315055],[-170.764735,-14.315171],[-170.764709,-14.315178],[-170.7645,-14.315243],[-170.764376,-14.315291],[-170.764296,-14.315316],[-170.764058,-14.315395],[-170.763979,-14.315422],[-170.763878,-14.315455],[-170.763702,-14.315514],[-170.763573,-14.315547],[-170.763498,-14.315567],[-170.76347,-14.315571],[-170.763342,-14.315594],[-170.763302,-14.315597],[-170.762907,-14.315633],[-170.762796,-14.315627],[-170.762764,-14.315626],[-170.762629,-14.315603],[-170.762499,-14.315567],[-170.762396,-14.315534],[-170.762231,-14.315462],[-170.76217,-14.315436],[-170.761988,-14.315315],[-170.761759,-14.315132],[-170.761749,-14.315123],[-170.76168,-14.315067],[-170.761614,-14.315014],[-170.761599,-14.315002],[-170.761302,-14.314768],[-170.761217,-14.314703],[-170.761146,-14.314648],[-170.761015,-14.314564],[-170.76093,-14.314525],[-170.760848,-14.314512],[-170.76079,-14.314508],[-170.760761,-14.314514],[-170.760717,-14.314524],[-170.760602,-14.314582],[-170.760564,-14.314629],[-170.760549,-14.314653],[-170.760506,-14.31473],[-170.760521,-14.314821],[-170.760557,-14.314889],[-170.760658,-14.315005],[-170.760782,-14.315115],[-170.760809,-14.315141],[-170.760917,-14.315245],[-170.761022,-14.315371],[-170.761091,-14.315496],[-170.761152,-14.315586],[-170.761196,-14.315707],[-170.761234,-14.315788],[-170.761256,-14.315863],[-170.761266,-14.315947],[-170.761266,-14.316034],[-170.761247,-14.316161],[-170.761144,-14.316479],[-170.761108,-14.316554],[-170.761079,-14.316619],[-170.760998,-14.316747],[-170.760958,-14.316822],[-170.760932,-14.316871],[-170.76085,-14.317013],[-170.760761,-14.317106],[-170.760648,-14.317202],[-170.760596,-14.317253],[-170.760557,-14.317293],[-170.760165,-14.317668],[-170.760053,-14.317806],[-170.7599981,-14.3178678],[-170.759973,-14.317896],[-170.759876,-14.318014],[-170.7597688,-14.3181471],[-170.759756,-14.318163],[-170.7597012,-14.3182666],[-170.759682,-14.318303],[-170.758899,-14.316282],[-170.758463,-14.316257],[-170.752729,-14.315938],[-170.750862,-14.315051],[-170.75018,-14.314727],[-170.748547,-14.313863],[-170.747959,-14.313476],[-170.747405,-14.313162],[-170.744694,-14.311624],[-170.743923,-14.311155],[-170.742779,-14.31046],[-170.739841,-14.306829],[-170.739444,-14.306338],[-170.73738,-14.303989],[-170.737265,-14.303661],[-170.739681,-14.299066],[-170.742627,-14.295386],[-170.745375,-14.291956],[-170.745516,-14.29172],[-170.745559,-14.291576],[-170.745694,-14.291148],[-170.745738,-14.291006],[-170.746395,-14.290459],[-170.747111,-14.28987],[-170.749186,-14.288016],[-170.75,-14.28729],[-170.757796,-14.280964],[-170.760677,-14.278627],[-170.76125,-14.280656],[-170.76297,-14.286745],[-170.763544,-14.288775],[-170.764873,-14.293917],[-170.768861,-14.309343],[-170.768894,-14.309471],[-170.770421,-14.313172],[-170.770817,-14.314279]]]]}
   n.coordinates = thing.geometry.coordinates[0][0]
//}




WITH "file:///United_States_AL8.GeoJson" AS url
CALL apoc.load.json(url) YIELD value
WITH value.features AS objects
UNWIND objects AS object
WITH 
//{
//"type":"Feature",
//"properties" : {
   //"srid"          : "4326",
   object.properties.srid AS srid,
   //"id"            : "253672",
   object.properties.id AS id,
   //"name"          : "Aasu",
   object.properties.name AS name,
   //"localname"     : "Aasu",
   object.properties.localname AS localname,
   //"official_name" : "",
   //n.official_name = object.properties.official_name,
   //"boundary"      : "administrative",
   object.properties.boundary AS boundary,
   //"admin_level"   : "8",
   object.properties.admin_level AS admin_level,
   //"note"          : "",
   object.properties.note AS note,
   //"wikidata"      : "Q2820114",
   //n.wikidata = object.properties.wikidata,
   //"wikipedia"     : "en:Aasu, American Samoa",
   //"timestamp"     : "2019-11-02 23:01:02",
   //"rpath"         : "253672,4027563,7381454,2177187,148838,0",
   //"alltags"       : {
      //"is_in" : "USA, American Samoa",
      //"wikidata" : "Q2820114",
      //"wikipedia" : "en:Aasu, American Samoa",
      //"border_type" : "village",
      object.properties.alltags.border_type AS border_type,
      //"is_in:state" : "American Samoa",
      object.properties.alltags.`is_in:state` AS is_in_state,
      //"is_in:country" : "USA;American Samoa",
      object.properties.alltags.`is_in:country` AS is_in_country,
      //"is_in:state_code" : "AS",
      object.properties.alltags.`is_in:state_code` AS is_in_state_code,
      //"is_in:country_code" : "AS"}
      object.properties.alltags.`is_in:country_code` AS is_in_country_code,
   //},
   //"bbox"    : [-170.77081, -14.318303, -170.73726, -14.278627],
   object.bbox AS bbox,
   //"geometry": {"type":"MultiPolygon","coordinates":[[[[-170.770817,-14.314279],...,[-170.770817,-14.314279]]]]}
   object.geometry.coordinates[0][0] AS allCoordinates
//}
WITH srid, id, name, localname, boundary, admin_level, note, border_type, is_in_state, is_in_country, is_in_state_code, is_in_country_code, bbox, allCoordinates
UNWIND range(0,size(allCoordinates)-2) AS idx
WITH allCoordinates[idx] AS coordinates, srid, id, name, localname, boundary, admin_level, note, border_type, is_in_state, is_in_country, is_in_state_code, is_in_country_code, bbox
//WITH { srid, id, name, localname, boundary, admin_level, note, border_type, is_in_state, is_in_country, is_in_state_code, is_in_country_code, bbox, coordinates } AS data
CREATE (b:Boundary)
SET b.srid = srid,
    b.id = id,
    b.name = name,
    b.localname = localname,
    b.boundary = boundary,
    b.admin_level = admin_level,
    b.note = note,
    b.border_type = border_type,
    b.is_in_state = is_in_state,
    b.is_in_country = is_in_country,
    b.is_in_state_code = is_in_state_code,
    b.is_in_country_code = is_in_country_code,
    b.bbox = bbox,
    b.coordinates = point({latitude: coordinates[1], longitude: coordinates[0]})
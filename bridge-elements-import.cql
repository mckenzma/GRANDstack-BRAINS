// Cypher Import File for NATIONAL BRIDGE INVENTORY BRIDGE ELEMENTS
// Specification PDF url: https://www.fhwa.dot.gov/bridge/nbi/131216_a1.pdf

// TODO - setup import google sheets like for bridge data

// this query returns elements (limited to 5 for testing) from the .zip XML file.
// When working with other file be sure to note the end with the '!file_name.xml'.
// This is needed to work with compressed files and can pull directly from the nbi website
call apoc.load.xml("https://www.fhwa.dot.gov/bridge/nbi/element/2020/2020AL_ElementData.zip!2020AL_ElementData.xml", '', {}, true) YIELD value
WITH value._FHWAELEMENT AS elements
UNWIND elements AS element
RETURN element LIMIT 5

// Quick notes from initial look
// Below is general format of each "element" as recorded
{
  "_type": "FHWAED",
  "_FHWAED": [
    {
      "_type": "STATE",
      "_text": "01"
    },
    {
      "_type": "STRUCNUM",
      "_text": "000042"
    },
    {
      "_type": "EN",
      "_text": "241"
    },
    {
      "_type": "TOTALQTY",
      "_text": "130"
    },
    {
      "_type": "CS1",
      "_text": "0"
    },
    {
      "_type": "CS2",
      "_text": "0"
    },
    {
      "_type": "CS3",
      "_text": "130"
    },
    {
      "_type": "CS4",
      "_text": "0"
    }
  ]
}
// The first 2 objects in the _FHWAED array are pretty straight forward
// Might be tricky connecting the structure number to the NBI files if they aren't clean
// The 3rd indicates the element number and it's value (number)
// the element number can be tied to a Table 1 on the resource document
// The last 5 are related with "TOTALQTY" the sum of each "CS#"
// CS - 1 = Good
// CS - 2 = Fair
// CS - 3 = Poor
// CS - 4 = Severe
// The quantities for each CS should sum to equal the total

// Initial WIP to import and store raw data on node
call apoc.load.xml("https://www.fhwa.dot.gov/bridge/nbi/element/2020/2020AL_ElementData.zip!2020AL_ElementData.xml", '', {}, true) YIELD value
WITH value._FHWAELEMENT AS elements
UNWIND elements AS element
WITH element LIMIT 1
CREATE (el:Element)
SET el.state = element._FHWAED[0]._text,
    el.strucNum = element._FHWAED[1]._text,
    el.elemNum = element._FHWAED[2]._text,
    el.totalQty = element._FHWAED[3]._text,
    el.cs1 = element._FHWAED[4]._text,
    el.cs2 = element._FHWAED[5]._text,
    el.cs3 = element._FHWAED[6]._text,
    el.cs4 = element._FHWAED[7]._text
RETURN element, el {.*}

// Created a Google sheet that helps to build all of the URLs needed to import the bridge element data
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1z4gfFVp3s0GbPe8YRFhU1eiNDUXR6eUUwu2BDOC5QPs/export?format=csv&id=1z4gfFVp3s0GbPe8YRFhU1eiNDUXR6eUUwu2BDOC5QPs&gid=0" AS row
RETURN row

// Query to count number of elements for each file
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1z4gfFVp3s0GbPe8YRFhU1eiNDUXR6eUUwu2BDOC5QPs/export?format=csv&id=1z4gfFVp3s0GbPe8YRFhU1eiNDUXR6eUUwu2BDOC5QPs&gid=0" AS row
WITH row
WHERE row.DataPresent = "Yes"
CALL apoc.load.xml(row.URL, '', {}, true) YIELD value
RETURN row.Year, row.Abbreviation, row.URL, size(value._FHWAELEMENT)

// Create (:File:XML) nodes
LOAD CSV WITH HEADERS FROM "https://docs.google.com/spreadsheets/d/1z4gfFVp3s0GbPe8YRFhU1eiNDUXR6eUUwu2BDOC5QPs/export?format=csv&id=1z4gfFVp3s0GbPe8YRFhU1eiNDUXR6eUUwu2BDOC5QPs&gid=0" AS row
WITH row
WHERE row.DataPresent = "Yes"
WITH row, row.URL AS fileUrl
MERGE (file:File:XML {url: fileUrl})
ON CREATE SET file.abbreviation = row.Abbreviation,
              file.name = row.File,
              file.year = toInteger(row.Year),
              file.createdOn = datetime(),
              file:ImportXML

// Iterate through files and import elements
MATCH (file:ImportXML)
REMOVE file:ImportXML
WITH collect(file) AS files
UNWIND files AS file
CALL apoc.periodic.iterate(
'
CALL apoc.load.xml($url, "", {}, true) YIELD value
WITH value._FHWAELEMENT AS elements
UNWIND elements AS element
RETURN element
','
WITH element._FHWAED AS components
CREATE (el:XmlElement)
SET el.file = $name,
    el.state = [x in components WHERE x._type = "STATE" | x._text][0],
    el.structNum = [x in components WHERE x._type = "STRUCNUM" | x._text][0],
    el.elementNum = [x in components WHERE x._type = "EN" | x._text][0],
    el.totalQty = [x in components WHERE x._type = "TOTALQTY" | toInteger(x._text)][0],
    el.cs1 = [x in components WHERE x._type = "CS1" | toInteger(x._text)][0],
    el.cs2 = [x in components WHERE x._type = "CS2" | toInteger(x._text)][0],
    el.cs3 = [x in components WHERE x._type = "CS3" | toInteger(x._text)][0],
    el.cs4 = [x in components WHERE x._type = "CS4" | toInteger(x._text)][0],
    el:ConnectElementToFile
',
{batchSize:1000,parallel:false,params:{url: file.url, name: file.name}}) YIELD batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
WITH file, batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams
//REMOVE file:ImportXML
RETURN batches, total, timeTaken, committedOperations, failedOperations, failedBatches, retries, errorMessages, batch, operations, wasTerminated, failedParams

// Connect XML File to XML Element Data
CALL apoc.periodic.iterate(
'
MATCH (element:ConnectElementToFile)
RETURN element
','
MATCH (file:File)
WHERE file.name = element.file
CREATE (file)-[:CONTAINS]->(element)
WITH element
REMOVE element:ConnectElementToFile
',
{batchSize:1000,parallel:false})
//TODO - update batch size to 10000 when integrating with bridge database

//TODO - create query(ies) to create bridge and elements
// 1. Add processing labels to XML element to create "bridge". Need to update query where XML element created to generate this processing label.
// 2. Add processing labels to XML element to create "element". Need to update query where XML element created to generate this processing label.
// 3. Add query to connect bridge, element, and XML element

// Create (:State)
CALL apoc.periodic.iterate(
'
MATCH (file:File)
RETURN file
','
MERGE (state:State {abbreviation: file.abbreviation})
MERGE (state)<-[:FILE_FOR]-(file)
',
{batchSize:1000})

// Create Constraint on (:Element)
CREATE CONSTRAINT ON (el:Element) ASSERT (el.strucNum, el.stateCode, el.elementNum) IS NODE KEY

// Create (:Element)
CALL apoc.periodic.iterate(
'
MATCH (xml:XmlElement)
RETURN xml
','
MERGE (el:Element {elementNum: xml.elementNum, strucNum: xml.structNum, stateCode: xml.state})
ON CREATE SET el.stateAbbr = substring(xml.file,4,2)
',
{batchSize:1000})

// Create (:Element)<-[:DATA_FOR]-(:XmlElement)
CALL apoc.periodic.iterate(
'
MATCH (xml:XmlElement)
RETURN xml
','
MATCH (el:Element {elementNum: xml.elementNum, strucNum: xml.structNum, stateCode: xml.state})
MERGE (el)<-[:DATA_FOR]-(xml)
',
{batchSize:1000})

// Create (:Bridge)-[:HAS_ELEMENT]->(:Element)
CALL apoc.periodic.iterate(
'
MATCH (el:Element)
RETURN el
','
MATCH (b:Bridge {strucNum: el.strucNum, stateCode: el.stateCode})
MERGE (b)-[:HAS_ELEMENT]->(el)
',
{batchSize:1000})

// Create Constrain on (:Bridge)
 CREATE CONSTRAINT ON (b:Bridge) ASSERT (b.strucNum, b.stateCode) IS NODE KEY

// Create (:Bridge)
CALL apoc.periodic.iterate(
'
MATCH (el:Element)
RETURN el
','
MERGE (b:Bridge {strucNum: el.strucNum, stateCode: el.stateCode})
ON CREATE SET b.stateAbbr = el.stateAbbr
',
{batchSize:1000})

// Create (:State)-[:HAS_BRIDGE]->(:Bridge)
CALL apoc.periodic.iterate(
'
MATCH (b:Bridge)
RETURN b
','
MATCH (s:State {abbreviation: b.stateAbbr})
MERGE (s)-[:HAS_BRIDGE]->(b)
WITH s,b
SET s.code = b.stateCode
',
{batchSize:1000})

// Query to read 'table_1_bridge_elements.json'
// Table 1. Bridge Elements "cross-walk"element
CALL apoc.load.json("https://raw.githubusercontent.com/mckenzma/GRANDstack-BRAINS/master/table_1_bridge_elements.json") YIELD value
WITH value
UNWIND value.types AS type
WITH type
UNWIND type.elements AS element
RETURN type.type, element.element, element.units, element.element_numbers
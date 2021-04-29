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

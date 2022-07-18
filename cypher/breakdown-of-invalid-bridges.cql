// Show breakdown and count of "invalid" bridges
MATCH (b:InvalidBridge)
RETURN (size(b.countyCode) <> 3 OR NOT b.countyCode =~ "^[0-9]+$") AS hasInvalidCounty, // check county conditions
       (size(b.placeCode) <> 5 OR NOT b.placeCode =~ "^[0-9]+$") AS hasInvalidPlace, // check place conditions
       (size(b.code) <> 15) as hasInvalidBridgeCode, // check bridge conditions
       count(*)
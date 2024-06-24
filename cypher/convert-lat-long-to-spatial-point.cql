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
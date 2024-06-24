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
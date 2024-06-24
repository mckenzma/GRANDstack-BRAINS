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
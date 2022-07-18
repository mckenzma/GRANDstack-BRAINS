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
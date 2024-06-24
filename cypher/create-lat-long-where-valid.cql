// Create decimal lat / long where valid log
CALL apoc.periodic.iterate(
'
MATCH (locLog:LocationLog)
WHERE NOT locLog:InvalidLocationLog
RETURN locLog
','
WITH locLog, size(locLog.longRaw) AS long_size
WITH locLog,
	 toFloat(left(locLog.latRaw, 2)) + toFloat(substring(locLog.latRaw,2,2))/60 + toFloat(right(locLog.latRaw,4))/100/3600 AS latitude_decimal,
	 CASE long_size
        WHEN 8 THEN -1 * ( toFloat(left(locLog.longRaw, 2)) + toFloat(substring(locLog.longRaw,2,2))/60 + toFloat(right(locLog.longRaw,4))/100/3600 )
        WHEN 9 THEN -1 * ( toFloat(left(locLog.longRaw, 3)) + toFloat(substring(locLog.longRaw,3,2))/60 + toFloat(right(locLog.longRaw,4))/100/3600 )
     END AS longitude_decimal
SET locLog.latitude = latitude_decimal,
	  locLog.longitude = longitude_decimal
WITH locLog
// check if lat/long outside expected bounds set "Invalid" label
WHERE NOT (-90 <= latitude_decimal AND latitude_decimal <= 90)
OR NOT (-180 <= longitude_decimal AND longitude_decimal <= 180)
SET locLog:InvalidLocationLog
',
{batchSize:5000})
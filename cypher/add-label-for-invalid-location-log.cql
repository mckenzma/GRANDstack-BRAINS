// Add "Invalid" label for location logs that don't meet basic criteria
MATCH (locLog:LocationLog)
WHERE size(locLog.latRaw) <> 8
OR size(locLog.longRaw) <> 9
SET locLog:InvalidLocationLog
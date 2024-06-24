// Find location logs that don't meet basic encoding criteria based on length
MATCH (locLog:LocationLog)
RETURN size(locLog.longRaw), size(locLog.latRaw),  count(*)
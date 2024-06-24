// WIP Fixing County and Place codes
// the case statements need to go on the bridge node script since we use the bridges to build the rest
// only need to delete :Invalid nodes
MATCH (b:Bridge)
WITH b.stateCode AS sCode, trim(b.countyCode) AS cCode, trim(b.placeCode) AS pCode
ORDER BY pCode, cCode
WITH sCode,
	 CASE size(cCode)
     	WHEN 0 THEN '000'
        WHEN 1 THEN '00' + cCode
        WHEN 2 THEN '0' + cCode
        ELSE cCode
     END AS cCode,
     CASE size(pCode)
     	WHEN 0 THEN '00000'
        WHEN 1 THEN '0000' + pCode
        WHEN 2 THEN '000' + pCode
        WHEN 3 THEN '00' + pCode
        WHEN 4 THEN '0' + pCode
        ELSE pCode
     END AS pCode
RETURN sCode, 
	   size(cCode) AS cCodeSize, 
       collect(DISTINCT cCode) AS cCodes,
       size(pCode) AS pCodeSize, 
       collect(DISTINCT pCode) AS pCodes,
       count(*) AS count
ORDER BY sCode, cCodeSize, pCodeSize
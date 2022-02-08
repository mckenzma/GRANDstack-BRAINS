// trying to understand what data is valid
MATCH (iD:InspectionDate)
WHERE (size(replace(iD.id," ", "")) = 3 OR size(replace(iD.id," ", "")) = 4)
AND NOT iD.id CONTAINS "."
WITH iD, 
	 replace(iD.id," ", "") AS tempDate
//RETURN replace(iD.id," ", ""), 
//	   right(replace(iD.id," ", ""),2) AS year,
//       CASE size(replace(iD.id," ", ""))
//       	WHEN 3 THEN "0" + left(replace(iD.id," ", ""), 1)
//        WHEN 4 THEN left(replace(iD.id," ", ""), 2)
//       END AS month
//ORDER BY year, month
WITH iD,
	 tempDate,
	 right(tempDate, 2) AS year,
	 CASE size(tempDate)
	 	WHEN 3 THEN "0" + left(tempDate, 1)
	 	WHEN 4 THEN left(tempDate, 2)
	 END AS month
RETURN iD.year, tempDate, year, month
ORDER BY year, month
//SET iD.date({ year})





// set Inspection Date month and year properties
MATCH (inspDate:InspectionDate)
SET inspDate.year = right(inspDate.id, 2)
WITH inspDate.year AS inspDateYear
MATCH (inspDate:InspectionDate)
WHERE size(inspDate.id) = 3
SET inspDate.month = left(inspDate.id, 1)
WITH inspDateYear, inspDate.month AS inspDateMonth
MATCH (inspDate:InspectionDate)
WHERE size(inspDate.id) = 4
SET inspDate.month = left(inspDate.id, 2)
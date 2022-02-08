// connect (:InspectionDate) to (:Month) in timeline tree
MATCH (bridge:Bridge)-[:INSPECTED_ON]->(inspDate:InspectionDate)
MATCH (year:Year {id: inspDate.year})-[:MONTH]->(month:Month {id: inspDate.month})
MERGE (inspDate)-[:DATE_OF_INSPECTION]->(month)
// create (:Evaluation) and connect to (:InspectionDate) and (:Bridge)
CALL apoc.periodic.iterate("
UNWIND ['file:///MN14.csv', 'file:///AK14.csv'] AS file
LOAD CSV WITH HEADERS FROM file AS row RETURN row",
"
MATCH (bridge:Bridge {id: row.STRUCTURE_NUMBER_008}) //need to update this to match bridge id
MATCH (inspDate:InspectionDate {id: row.DATE_OF_INSPECT_090})
MERGE (evaluation:Evaluation {id: bridge.id + inspDate.id})
MERGE (bridge)<-[:EVALUATION_OF]-(evaluation)-[:EVALUATED_ON]->(inspDate)
ON CREATE SET evaluation.id = bridge.id + inspDate.id,
			  
              evaluation.deck_cond = row.DECK_COND_058,
			  evaluation.superstructure_cond = row.SUPERSTRUCTURE_COND_059,
			  evaluation.substructure_cond = row.SUBSTRUCTURE_COND_060,
			  evaluation.channel_cond = row.CHANNEL_COND_061,
			  evaluation.culvert_cond = row.CULVERT_COND_062,

			  evaluation.structural_eval = row.STRUCTURAL_EVAL_067,
			  evaluation.deck_geometry_eval = row.DECK_GEOMETRY_EVAL_068,
			  evaluation.undclrence_eval = row.UNDCLRENCE_EVAL_069,
			  evaluation.posting_eval = row.POSTING_EVAL_070,
			  evaluation.waterway_eval = row.WATERWAY_EVAL_071,
			  evaluation.appr_road_eval = row.APPR_ROAD_EVAL_072
",
{batchSize:1000,iterateList:true});
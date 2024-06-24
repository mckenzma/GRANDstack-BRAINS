// Create Condition Rating Nodes
UNWIND [['N', 'NOT APPLICABLE', ''], 
        ['9', 'EXCELLENT CONDITION', ''],
        ['8', 'VERY GOOD CONDITION', 'No problems noted.'],
        ['7', 'GOOD CONDITION', 'Some minor problems.'],
        ['6', 'SATISFACTORY CONDITION', 'structural elements show some minor deterioration.'],
        ['5', 'FAIR CONDITION', 'All primary structural elements are sound but may have minor section loss, cracking, spalling or scour.'],
        ['4', 'POOR CONDITION', 'Advanced section loss, deterioration, spalling or scour.'],
        ['3', 'SERIOUS CONDITION', 'Loss of section, deterioration, spalling or scour have seriously affected primary structural components. Local failures are possible. Fatigue cracks in stell or shear cracks in concrete may be present.'],
        ['2', 'CRITICAL CONDITION', 'Advanced deterioration of primary structural elements. Fatigue cracks in steel or shear cracks in concrete may be present or scour may have removed substructure support. Unless closesly monitored it may be necessary to close the bridge until corrective action is taken.'],
        ['1', '"IMMINENT" FAILURE CONDITION', 'Major deterioration or section loss present in critical structural components or obvious vertical or horizontal movement affecting structure stability. Bridge is closed to traffic but corrective action may put back in light service.'],
        ['0', 'FAILED CONDITION', 'Out of Service - Beyond corrective action.']] AS ratingCode
CREATE (:ConditionRating {code: ratingCode[0], generalDescription: ratingCode[1], additionalDescription: ratingCode[2]})
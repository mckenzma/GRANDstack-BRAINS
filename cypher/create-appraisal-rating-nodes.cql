// Create Appraisal Rating Nodes
UNWIND [['N', 'Not applicable'], 
        ['9', 'Superior to present desirable criteria'],
        ['8', 'Equal to present desirable criteria'],
        ['7', 'Better than present minimum criteria'],
        ['6', 'Equal to present minimum criteria'],
        ['5', 'Somewhat better than minimum adequacy to tolerate being left in place as is'],
        ['4', 'Meets minimum tolerable limits to be left in place as is'],
        ['3', 'Basically intolerable requiring high priority of corrective action'],
        ['2', 'Basically intolerable requiring high priority of replacement'],
        ['1', 'This value of raiting cide not used'],
        ['0', 'Bridge closed']] AS appraisalCode
CREATE (:AppraisalRating {code: appraisalCode[0], description: appraisalCode[1]})
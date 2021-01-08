# Cypher

This folder contains the individual cypher snippets used to run the importation of data into the graph model. The order of the cypher represented here is the order in which the cypher should be run.

<!-- Blog Part 2 -->
1. [Create `(:File:DelimitedFile)` nodes](https://github.com/mckenzma/GRANDstack-BRAINS/blob/master/cypher/create-file-nodes.cql)
1. [Import `(:Row:DelimitedRow)` nodes](https://github.com/mckenzma/GRANDstack-BRAINS/blob/master/cypher/import-row-nodes.cql)
1. [Connect rows to files](https://github.com/mckenzma/GRANDstack-BRAINS/blob/master/cypher/connect-rows-to-files.cql)
1. [Connect related files](https://github.com/mckenzma/GRANDstack-BRAINS/blob/master/cypher/connect-related-files.cql)
1. [Connect related rows](https://github.com/mckenzma/GRANDstack-BRAINS/blob/master/cypher/connect-related-rows.cql)
<!-- Blog Part 3 -->
1. [Add file processing label]()
1. [Create and connect `(:State)` nodes to `(:File)`]()
1. [Add state properties]()
1. [Create bridge index]()
1. [Add row processing label]()
1. [Add bridge processing label to first row record]()
1. [Create `(:Bridge)`]()
1. [Connect bridge to row]()
1. [Create index for place]()
1. [Merge places]()
1. [Connect bridge to place]()
1. [Merge counties]()
1. [Connect county to place]()
1. [Connect state to county]()
<!-- Blog Part 4 -->

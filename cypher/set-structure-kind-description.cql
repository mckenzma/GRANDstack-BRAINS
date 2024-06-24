//query to add Structure Kind Code Description
MATCH (structureKind:StructureKind)
SET structureKind.description = 
CASE structureKind.code
    WHEN "1" THEN "Concrete"
    WHEN "2" THEN "Concrete continuous"
    WHEN "3" THEN "Steel"
    WHEN "4" THEN "Steel continuous"
    WHEN "5" THEN "Prestressed concrete (incl. Post-tension)"
    WHEN "6" THEN "Prestressed concrete continous (incl. Post-tension)"
    WHEN "7" THEN "Wood or Timber"
    WHEN "8" THEN "Masonry"
    WHEN "9" THEN "Aluminum, Wrought Iron, or Cast Iron"
    WHEN "0" THEN "Other"
END
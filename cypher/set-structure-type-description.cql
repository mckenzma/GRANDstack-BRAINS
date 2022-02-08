//query to add Structure Type Code Description
MATCH (structureType:StructureType)
SET structureType.description = 
CASE structureType.code
    WHEN "01" THEN "Slab"
    WHEN "02" THEN "Stringer/Multi-beam or Girder"
    WHEN "03" THEN "Girder and Floorbeam System"
    WHEN "04" THEN "Tee Beam"
    WHEN "05" THEN "Box Beam or Girders - Multiple"
    WHEN "06" THEN "Box Beam or Girders - Single or Spread"
    WHEN "07" THEN "Frame (except culverts)"
    WHEN "08" THEN "Orthotropic"
    WHEN "09" THEN "Truss - Deck"
    WHEN "10" THEN "Truss - Thru"
    WHEN "11" THEN "Arch - Deck"
    WHEN "12" THEN "Arch - Thru"
    WHEN "13" THEN "Suspension"
    WHEN "14" THEN "Stayed Girder"
    WHEN "15" THEN "Movable - Lift"
    WHEN "16" THEN "Movable - Bascule"
    WHEN "17" THEN "Movable - Swing"
    WHEN "18" THEN "Tunnel"
    WHEN "19" THEN "Culvert (includes frame culverts)"
    WHEN "20" THEN "Mixed types *"
    WHEN "21" THEN "Sergmental Box Girder"
    WHEN "22" THEN "Channel Beam"
    WHEN "00" THEN "Other"
END
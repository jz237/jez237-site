# Beneath Philadelphia public map snapshots

Retrieved 2026-09-23 from City of Philadelphia / Philadelphia Water Department
public ArcGIS services, organization fLeGjb7u4uXqeF9q. Refresh with
`python demos/philadelphia-relief/tools/build_underground.py`.

Services: https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/
- INLETS/FeatureServer/0: mapped inlets, system and inlet type.
- OUTFALLS/FeatureServer/0: mapped outfalls, system and outfall type.
- Hydrographic_Features_Arc/FeatureServer/0: only inf1 = Culverted.
- HistoricStreams_Arc/FeatureServer/0: historic watercourse alignments.

Coordinates are returned in EPSG:4326 at six decimals, with ArcGIS generalized
geometry tolerance 0.000015 degrees. They are not engineering survey positions.
Records intersecting each neighborhood bounding box are downloaded in complete
ordered pages of 2,000 records; visible geometry is clipped at the exhibit edge.
Citywide data omits inlets; neighborhood choices include all returned inlets.
Overlapping neighborhoods may contain the same records; counts must not be summed.
All vertical positions, transit widths, station volumes and exposed strata are
illustrative. No connections between inlets, outfalls or streams are invented.
Culverts are mapped waterways and are not labeled as sewage tunnels. Historic
streams are not represented as today's sewer pipe network.

Sewer map previews: Philadelphia Department of Public Works, 1927 and 1929,
published by Water History PHL / Adam Levine:
https://waterhistoryphl.org/2024/01/sewer-systems-philadelphia-1927-1929/
These maps include existing AND proposed main sewers; use their original legends.
The UI links to the full-resolution originals. Modern system reference:
https://water.phila.gov/pool/files/SSES-Report_July2014.pdf
No complete current underground pipe survey is claimed.

The original educational SVG sewer cross-section is schematic, not site-specific.

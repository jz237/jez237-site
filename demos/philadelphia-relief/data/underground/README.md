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

## SEPTA rail network

`septa-rail.json` contains all route types 0, 1 and 2 in SEPTA's official
v202609061 GTFS release (26 rail route IDs). All referenced trip shapes and their
served stops are included, rather than selecting a single trip per line. Bus and
trolleybus routes are excluded. Route identifiers use SEPTA's current Metro names.
GTFS source: https://github.com/septadev/GTFS/releases/tag/v202609061
This is a geographic snapshot, not a service-status or departure-time display.
Temporary patterns in the feed are retained; this is not a survey of every track.
Stop counts include distinct platforms and directional stop locations.
Routes are clipped to the existing relief bounds (-75.8,39.7,-74.7,40.55), so any
outlying pieces, such as Newark south of the region, are outside the exhibit.

Railway tunnel and bridge tags were retrieved from public OpenStreetMap Overpass
on 2026-09-23. Attribution: OpenStreetMap contributors, ODbL 1.0:
https://www.openstreetmap.org/copyright
Each GTFS segment is matched within 25 m to a similarly oriented mapped railway
segment (absolute direction cosine >= 0.8); segments are split to at most 80 m.
GTFS shapes are simplified with 3 m tolerance before matching. These are
approximate structure classifications, not measured track depths or heights.
Unmatched segments are explicitly unclassified, never assumed underground.
Station classifications match nearby structure tags without an orientation test.
All vertical display levels are illustrative. Shared segments keep all route IDs.

Refresh with `python tools/build_transit.py GTFS.zip tunnels.json bridges.json`.
The input Overpass JSON files contain `out geom` railway ways with tunnel or bridge
tags for rail, subway, light_rail and tram inside the relief bounds. Reject responses
with a timeout remark. The browser downloads only the compact derived snapshot.

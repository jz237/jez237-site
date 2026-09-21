# Regional riverbed display

Derived from NOAA Office of Coast Survey **BlueTopo** public GeoTIFFs, using the
BlueTopo tile catalogue dated 2026-09-21. Attribution and specifications:
https://www.nauticalcharts.noaa.gov/data/bluetopo.html
https://www.nauticalcharts.noaa.gov/data/bluetopo_specs.html

`sources.json` retains the tile URLs, checksums, delivery dates and contributing
survey records. Tile delivery dates are **not** survey dates. Local source surveys
range from 1978 to 2026. BlueTopo may contain interpolation within source surveys;
the explicit NBS generalization contributor (0) and records without bathymetric
coverage are excluded. Unknown areas are never replaced with synthetic depths.

The source tiles have 4 m spacing. The display grid is sampled to approximately
19 by 21 m, retaining negative elevations relative to **NAVD88**. It is not a
current water-depth measurement, tidal model, or navigational chart. Land above
the reference datum and uncovered stretches retain the existing map.

`riverbed.png` is a numeric raster, not a photograph: north at row 0,
`elevation_m = -(R * 256 + G) / 100`, B=255 for coverage, B=0 for no data. Alpha
is always 255 so browser image decoding cannot premultiply numeric channels.
The shader requires coverage in all samples used in bilinear interpolation.
Elevation colors and 2 m contour intervals always use unexaggerated values.

The additional riverbed exaggeration is separate from the map's terrain scale.
The renderer reuses the existing adaptive terrain mesh and water overlays. No
extra draw calls or background polling are introduced. The PNG and compact
manifest load only when enabled. Turning it off releases its CPU/GPU texture
data; a subsequent enable can reuse the browser's HTTP cache.

Rebuild with `tools/build_bathymetry.py --catalog PATH --cache PATH`. Requires
numpy, Pillow and rasterio; the downloaded catalogue and intermediate caches
are intentionally kept outside the published site. A live survey catalogue is
available in the public `noaa-ocs-nationalbathymetry-pds` S3 bucket under
`BlueTopo/_BlueTopo_Tile_Scheme/`.

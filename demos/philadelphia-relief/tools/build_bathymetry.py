"""Build an optional, bounded BlueTopo display grid; never fill survey gaps.

Requires numpy, rasterio, Pillow. Source GeoTIFFs are read through HTTP ranges.
The tile catalogue is the public NOAA BlueTopo geopackage. No API key required.
Usage: python tools/build_bathymetry.py --catalog PATH --cache PATH
"""
import argparse
import json
from pathlib import Path
import sqlite3
import urllib.request
import xml.etree.ElementTree as ET

import numpy as np
from PIL import Image
import rasterio
from rasterio.enums import Resampling
from rasterio.transform import from_bounds
from rasterio.warp import reproject, transform_bounds
from rasterio.windows import from_bounds as window_from_bounds

ROOT = Path(__file__).resolve().parents[1]
B = dict(west=-75.6, south=39.7, east=-74.7, north=40.275)
W, H = 4096, 3072


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--catalog', required=True)
    parser.add_argument('--cache', required=True)
    args = parser.parse_args()
    cache = Path(args.cache)
    cache.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(args.catalog)
    db.row_factory = sqlite3.Row
    table = db.execute('select table_name from gpkg_contents').fetchone()[0]
    assert table.startswith('BlueTopo_Tile_Scheme_') and table.replace('_', '').isalnum()
    rows = db.execute(f'''select a.* from {table} a join rtree_{table}_geom b on a.fid=b.id
        where b.minx < ? and b.maxx > ? and b.miny < ? and b.maxy > ?''',
        (B['east'], B['west'], B['north'], B['south'])).fetchall()
    transform = from_bounds(B['west'], B['south'], B['east'], B['north'], W, H)
    grid = np.full((H, W), np.nan, dtype=np.float32)
    sources, survey_dates = [], []
    for row in rows:
        url = row['GeoTIFF_Link']
        cached = cache / (Path(url).stem + '.npz')
        rat_file = cache / (Path(url).stem + '.xml')
        if not rat_file.exists():
            urllib.request.urlretrieve(row['RAT_Link'], rat_file)
        rat = ET.parse(rat_file)
        fields = [x.findtext('Name') for x in rat.findall('.//FieldDefn')]
        records = [dict(zip(fields, [v.text for v in x])) for x in rat.findall('.//Row')]
        # Generalized/interpolated filler (contributor 0) is not surveyed coverage.
        surveys = {int(x['value']): x for x in records
                   if x.get('bathy_coverage') == '1' and int(x['value']) != 0}
        if cached.exists():
            data = np.load(cached)
            heights, contributors, affine = data['heights'], data['contributors'], data['affine']
            src_transform = rasterio.Affine(*affine)
        else:
            with rasterio.Env(GDAL_DISABLE_READDIR_ON_OPEN='EMPTY_DIR',
                              CPL_VSIL_CURL_ALLOWED_EXTENSIONS='.tiff', GDAL_HTTP_TIMEOUT='45'):
                with rasterio.open(url) as ds:
                    # Keep roughly 8 m source sampling before the final ~20 m display grid.
                    oh, ow = (ds.height + 1) // 2, (ds.width + 1) // 2
                    heights, contributors = ds.read([1, 3], out_shape=(2, oh, ow),
                                                     resampling=Resampling.nearest)
                    src_transform = ds.transform * ds.transform.scale(ds.width / ow, ds.height / oh)
            np.savez_compressed(cached, heights=heights, contributors=contributors,
                                affine=list(src_transform)[:6])
        valid = np.isfinite(heights) & (heights < 0) & (heights > -100)
        valid &= np.isin(contributors, list(surveys))
        heights = np.where(valid, heights, np.nan).astype(np.float32)
        # Reproject only the small destination window intersecting this source.
        sb = rasterio.transform.array_bounds(*heights.shape, src_transform)
        bounds = transform_bounds('EPSG:26918', 'EPSG:4326', *sb)
        win = window_from_bounds(*bounds, transform=transform)
        x0, y0 = max(0, int(np.floor(win.col_off))), max(0, int(np.floor(win.row_off)))
        x1 = min(W, int(np.ceil(win.col_off + win.width)))
        y1 = min(H, int(np.ceil(win.row_off + win.height)))
        if x1 <= x0 or y1 <= y0:
            continue
        dest = np.full((y1-y0, x1-x0), np.nan, dtype=np.float32)
        reproject(heights, dest, src_transform=src_transform, src_crs='EPSG:26918',
                  dst_transform=transform * rasterio.Affine.translation(x0, y0),
                  dst_crs='EPSG:4326', src_nodata=np.nan, dst_nodata=np.nan,
                  resampling=Resampling.nearest)
        view = grid[y0:y1, x0:x1]
        view[np.isfinite(dest)] = dest[np.isfinite(dest)]
        used = sorted(int(x) for x in np.unique(contributors[valid]))
        metadata = [surveys[x] for x in used]
        survey_dates.extend(x['survey_date_end'] for x in metadata if x.get('survey_date_end'))
        sources.append(dict(tile=row['tile'], url=url, rat=row['RAT_Link'],
                            delivered=row['Delivered_Date'], sourceResolution=row['Resolution'],
                            sha256=row['GeoTIFF_SHA256_Checksum'], surveys=metadata))
        print(row['tile'], int(np.isfinite(dest).sum()), flush=True)
    valid = np.isfinite(grid)
    q = np.rint(np.where(valid, -grid, 0) * 100).astype(np.uint16)
    rgba = np.empty((H, W, 4), dtype=np.uint8)
    rgba[:, :, 0], rgba[:, :, 1] = q >> 8, q & 255
    rgba[:, :, 2], rgba[:, :, 3] = valid.astype(np.uint8) * 255, 255
    out = ROOT / 'data' / 'bathymetry'
    out.mkdir(exist_ok=True)
    Image.fromarray(rgba).save(out / 'riverbed.png', optimize=True)
    probes = []
    for name, lon, lat in [('Delaware at Penns Landing', -75.136, 39.944),
                           ('Lower Schuylkill', -75.214, 39.900),
                           ('Center City land', -75.164, 39.953),
                           ('Upper Schuylkill', -75.191, 39.976)]:
        x = min(W-1, max(0, int((lon-B['west']) / (B['east']-B['west']) * W)))
        y = min(H-1, max(0, int((B['north']-lat) / (B['north']-B['south']) * H)))
        probes.append(dict(name=name, lon=lon, lat=lat, x=x, y=y,
                           elevationM=round(float(grid[y, x]), 2) if valid[y, x] else None))
    doc = dict(version=1, source='NOAA Office of Coast Survey BlueTopo',
               sourceUrl='https://www.nauticalcharts.noaa.gov/data/bluetopo.html',
               datum='NAVD88', encoding='elevationM = -(R * 256 + G) / 100; B = 255 means coverage',
               bounds=B, width=W, height=H, image='riverbed.png',
               sampleSpacingM=[round((B['east']-B['west'])*85238/W, 1),
                               round((B['north']-B['south'])*111037/H, 1)],
               validSamples=int(valid.sum()), minElevationM=round(float(np.nanmin(grid)), 2),
               surveyDateRange=[min(survey_dates), max(survey_dates)],
               note='Survey-derived elevations, sampled for display. No live tides. '
                    'Source coverage and survey dates vary. Generalization filler excluded. '
                    'Not for navigation.', probes=probes, sources=sources)
    provenance = dict(source=doc['source'], sourceUrl=doc['sourceUrl'], tiles=sources)
    (out / 'sources.json').write_text(json.dumps(provenance, indent=2) + '\n', encoding='utf-8')
    doc['sources'] = 'sources.json'
    doc['sourceTiles'] = len(sources)
    (out / 'manifest.json').write_text(json.dumps(doc, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({k:v for k,v in doc.items() if k != 'sources'}, indent=2))


if __name__ == '__main__':
    main()

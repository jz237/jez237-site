"""Shared region definition for the Philadelphia 3D topographic map.

Every generator in tools/ imports the bounds from here so the heightmap,
the vector layers and the runtime metadata can never drift apart.
"""

# Geographic bounds of the authored scene.
#
# Chosen to hold the whole Philadelphia metro story in one frame:
#   west  -75.80  Chester County / Pottstown edge of the Piedmont
#   east  -74.70  Mount Laurel / Marlton, NJ
#   south  39.70  below Chester + the Delaware County riverfront
#   north  40.55  upper Bucks County (past Doylestown and Quakertown)
#
# ~93.6 km x 94.4 km at this latitude, i.e. very nearly square, which keeps
# the terrain mesh isotropic without a correction factor.
WEST = -75.80
EAST = -74.70
SOUTH = 39.70
NORTH = 40.55

# Zoom level of the source terrain tiles (~29 m/px at 40 deg N).
TERRAIN_ZOOM = 12

# Output heightmap grid. 2048 samples across 93.6 km => ~45.7 m/sample, which
# comfortably oversamples the 29 m source without inventing detail.
GRID_W = 2048
GRID_H = 2048

# Elevation quantisation step in metres for the packed PNG. 0.1 m is far finer
# than the accuracy of any public DEM, so it is lossless in practice while
# keeping the low byte compressible.
ELEV_STEP = 0.1

# Local metric projection anchor (equirectangular about the region centre).
# Over ~94 km the distortion against a proper conformal projection stays well
# under one output sample, so the simple form is used everywhere.
LAT0 = (SOUTH + NORTH) / 2.0
LON0 = (WEST + EAST) / 2.0

# WGS84 metres-per-degree at LAT0, used by both the generators and the runtime.
import math

METERS_PER_DEG_LAT = 111132.92 - 559.82 * math.cos(2 * math.radians(LAT0)) \
    + 1.175 * math.cos(4 * math.radians(LAT0))
METERS_PER_DEG_LON = (111412.84 * math.cos(math.radians(LAT0))
                      - 93.5 * math.cos(3 * math.radians(LAT0)))

WIDTH_M = (EAST - WEST) * METERS_PER_DEG_LON
HEIGHT_M = (NORTH - SOUTH) * METERS_PER_DEG_LAT


def bbox_overpass() -> str:
    """Overpass bbox filter order: south,west,north,east."""
    return f"{SOUTH},{WEST},{NORTH},{EAST}"

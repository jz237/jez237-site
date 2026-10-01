# Quarry arena visual overhaul, September 30, 2026

The supplied picture sets the art direction; it is not game artwork and is not
bundled. Development comparisons use actual Chrome/WebGL captures of the arena
with eight real vehicles, intact and damaged bodies, and a pileup. The baseline
uses release c25fd235. Iterations keep the same positions and camera, and also
capture the playable camera composition. No rendered mockup stands in for play.

The chase view places the car below the horizon with an upright world-up camera,
8.6m trailing distance, 2.8m height above its physics reference, 5.1m look-ahead
and 52-degree base vertical field of view. Speed changes are restrained. Hood,
inspection, wreck hold, gamepad and spectator cameras retain their controls.
The dial uses kilometres per hour; event, condition and subsystem feedback stay.

Blender 5.2.1 LTS authors fifteen near/far quarry sections from five retained
authored rock assets. Upper faces receive local bedding relief, spalled planes,
chipped corners and split-edge normals. Whole surfaces replace their prior
rendered skins to avoid overlapping shadows. Their original source GLBs and
collision files are retained unchanged. Decorative relief is shallow; angular
plates follow radial BVH hits on the copied upper rock envelope. Collision remains
the existing coarse authored proxies. Roads and driveable quarry aprons retain
their physical geometry. An exposed neutral stone palette and 4.3m registered
photographic fracture layer help the larger faces read from the driving camera.

New Blender floodlights contain tapering masts, cast bases, fastening bolts,
conduits, lamp housings, cooling fins and LED optics. Caps and cabinets complete
the barrier/service apron. Existing authored containers, workshop and excavator
are reused on the north service apron beyond the circuit. Fictional weathered
Quarry Impact banners have original typography and grommets. Event dressing is
shown for the expanded solo derby; the connected quarry/circuit remain usable.

The solo arena uses the existing licensed asphalt, gravel and scree photographs
with colour/normal/roughness coordinates kept registered in world metres.
Stochastic translated tiles reduce repetition. Deposits, irregular roughness,
wet sheen, worn rubber arcs and the existing physical tire trails remain local.
The twelve physical puddles keep their shape and contact/splash logic; their
water finish reflects the sky more visibly. Vegetation gains 42 irregular crest
conifers using shared scanned branch geometry, including varied widths/heights.
Dust receives a restrained directional backlight from the same quarry sun.

The photographic HDR and key light rotate together: 1.1-radian sky yaw, with the
original bright-tail solar direction rotated by -0.8 radians. Sun 3.35, HDR fill
.54, hemisphere .38, ACES exposure 1.03 and restrained distance fog preserve
paint, glass and interior detail. Paint/dirt/wear/deformation shaders are retained;
wheel alloy, rubber and interior finishes are calibrated separately. Original
Blender wheel machining adds shared hub lips, washers and hexagonal nuts to all
three existing cars. The detail follows their physical wheel pivots and damage.

The new authored geometry is CC0; all retained source assets keep their recorded
attribution. Original Car Concept bodies retain their CC-BY 4.0 attribution.
Existing 38 ElevenLabs clips are reused; no new API call or spending occurs.
All 23 deployed multiplayer Worker inputs remain unchanged, and internet
multiplayer testing is excluded. This is a browser renderer with rigid-body
collision and visual deformation; AAA reference parity is not claimed.

Authoring manifests live beside the editable Blender scenes in source/models.
source/reference-overhaul-revision.json and frozen gzip fixtures reconstruct
the previous release without changing earlier provenance hashes.

# Quarry workyard revision

Original editable geometry is in `../models/quarry-workyard.blend`; reproduce it with Blender 5.2 and `tools/author-workyard.py` from the project root. The Blender file links the locally bundled material photographs through relative paths. Runtime GLB prototypes use two detail levels and share the external photographs. Both LODs are included in the exported triangle total, not rendered simultaneously.

Six prototypes replace the previous industrial scenery: corrugated containers with corner castings, door hinges and locking bars; a tracked excavator with track shoes, road wheels, cabin controls, hydraulic pistons and bucket teeth; a conveyor with rollers, trusses and a motor; a clad workshop with a shutter, windows and gutters; silos with welded bands, ladders and pipework; and concrete barriers with chipped edges and lifting eyes. The fence uses rounded posts and analytically antialiased chain-link wire.

`src/scenery-workyard.ts` places the assets at the original obstacle transforms. `src/scenery-workyard-ground.ts` adds terrain-following fines, small foundation rubble, old wheel impressions and sheltered grass. These are cosmetic surface marks and small fragments; the existing simplified obstacle collision remains. There are no new drivable interiors or moving machines.

The three new material sets are unchanged CC0 Poly Haven source JPEGs. Source metadata, official URLs, file hashes and license records are retained here and in `public/assets/workyard/manifest.json`. Existing cladding, gravel and scree photographs are reused. No paid asset or new audio generation was used.

`source/workyard-revision.json` and compressed previous-source snapshots explicitly identify this authorized revision. Historical scene tests reconstruct the previous release only when requested; separate current-scene checks verify the actual new loader, LODs, surfaces and all 23 unchanged deployed physics inputs. No historical baseline was regenerated.

The crash update is presentation only: an analytically integrated bounded recoil spring, short directional sparks, ground-level dust and short layered impact sounds from the existing ElevenLabs recordings. Vehicle health, handling, collision geometry and scoring keep their prior rules. Online play is not part of this revision's play-test coverage.

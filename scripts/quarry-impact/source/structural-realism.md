# Structure, contact and persistent crash evidence

This pass applies to the coupe, sedan and hatch. It preserves their original model geometry and photographic image bytes; the changes run on the prepared, deformable copies. It remains a hybrid rigid-body/browser game, with simplified damaged collision shapes. It does not implement structural soft bodies or claim Wreckfest 2 fidelity.

## Structure

Mechanical details are batched by material and construction role. The engine block, sump, cover and intake shift a bounded distance on their mounts without deforming their internal shape. Rails, beams, crash mounts and braces resist compression more than the outer skin, while radiator parts buckle more readily. The continuous occupant-cell field protects the upper central body; glazing and adjacent panels evaluate the same field so their apertures stay connected. Existing hood, bumper, door, seal and mirror assemblies retain their hinges and attachment rules. New groups add at most eight draws per car rather than retaining hundreds of small mechanical objects.

## Wheel contact and handling

Existing localized corner damage now updates Rapier's suspension stiffness, rest length, maximum force, wheel radius, grip, axle camber, toe, drive force and brake drag. Displaced mounts move the actual raycast connection point. Intact setup retains its prior values. Damaged tires rub and resist rolling, and the car loses alignment; existing weight and assisted steering still make the intact cars forgiving. A small tire sidewall bulge and contact-plane deformation follow actual suspension load and ground contact. Wheel wobble follows traveled distance and stops while parked. Repair clears both the visual and physical changes.

The tires remain raycast wheels. The contact patch is visual, not a deformable rubber collision mesh; there is no full pneumatic tire or structural suspension solver.

## Surfaces and evidence

Paint, clearcoat, glass, plastic, galvanized steel, cast alloy and rubber use distinct material responses. The older vertex wear and exposed-primer/metal finish remain. Per-car wetness and silt deposition change reflection roughness and clearcoat coverage. Dirt accumulates through gravel travel, especially when tires are wet; water remains on each tire after leaving a real puddle. Wet tread trails fade behind the car. Sliding tires displace darker dirt, and sufficiently low hanging bumpers leave narrow scrape trails and drive the existing positional scrape recording. Deposition uses actual grounded tire contacts; airborne wheels cannot leave wet tread.

Car-to-car impacts carry the other vehicle's paint color into a localized persistent transfer attribute. Static objects do not invent transferred paint. Transferred paint, tire water, dirt and body wetness clear on repair. Ground traces share one bounded draw with 2,048 reusable slots and finite lifetimes. Event reset clears them immediately; inspection and pause freeze their clock.

## Blender fluid production

`tools/bake-vehicle-fluids.py` uses Blender 5.2.1 LTS Mantaflow gas/fuel simulation with two irregular, pulsing inflows, a 112-cell domain, 112 simulated frames at 24 Hz, and modular OpenVDB data caching. The bake renders separate fire and smoke through Eevee named `density` and `flame` attributes. No amplification cache is used. The editable scene is `source/fx/vehicle-fluids.blend`; simulation caches and intermediate renders are local development outputs.

`tools/pack-vehicle-fluids.py` assembles frames 40–103 into two 2,048-square RGBA atlases with 64 tiles each. Fire coverage is recovered from rendered emission; smoke alpha is level adjusted. The manifest records those adjustments, every rendered/packed frame checksum, authoring hashes, final file hashes and the original procedural CC0 license. `tools/render-vehicle-fluids.py` can re-render an existing cache.

The runtime shares both textures across cars and restarts. Adjacent frames interpolate; the final eight frames crossfade through the first eight before resuming at frame eight. Playback phase, scale, soot, source positions and particle motion vary. Smoke rises in world space and stays behind moving cars; flame sources follow the damaged vehicle. Existing finite-fuel ignition eligibility, delays and rare bursts are retained. The older procedural volume shader remains as a fallback if either atlas fails to load and still supplies the brief explosion volume. Pool limits remain 640 puffs and two nearby lights. The textures add 4,975,916 download bytes and about 32 MiB of shared RGBA GPU storage without mipmaps.

These are animated billboards rendered from an offline fluid simulation, not a live three-dimensional fire solver. They have perspective and close-up limits, and there is no physical explosion blast impulse. All 38 existing ElevenLabs recordings remain local; this pass generates no audio, makes no service calls and spends nothing.

## Verification

`tests/structural-realism.test.ts` checks rigid-engine shape, resistant rails, real corner configuration and exact repair for all cars, stationary/paused wobble, fixed-step driving at 30/60/144 rendering rates, persistent local coatings, bounded trace storage, approved fluid assets and source recovery. `tools/structural-realism-qa.mjs` verifies actual material/shader rendering, transferred paint, corner damage, grounded puddle trails, restart/reset and one shared atlas load in Chrome. Existing gameplay, AI, graphics/context-restoration, fire/audio and performance checks remain applicable.

`source/structural-realism-revision.json` and compressed fixtures recover the preceding runtime without changing older frozen hashes. All 23 deployed Worker simulation inputs remain unchanged. No backend deployment or internet multiplayer test is part of this pass; new local wheel consequences are evaluated by the solo physics path.

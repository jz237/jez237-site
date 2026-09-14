# Species

Launch roster: twelve species present in Lake Nockamixon or Green Lane Reservoir. Forage (gizzard shad, shiners) is simulated as instanced schools and is not catchable. Expansion venues add trout and fallfish (Tohickon tailwater, Penns Creek), shad, stripers and flathead catfish (the Delaware), and white perch and saugeye (Green Lane).

| Species | Holds | Signature behaviour | Fight |
|---|---|---|---|
| Largemouth bass (hero) | laydowns, docks, weed edges, shade | ambush; topwater blow-ups at dawn/dusk; visible spring beds | jumps, head-shakes, dives for cover |
| Smallmouth bass | riprap, gravel points, rock | roams; strongest pound for pound | repeated jumps |
| Muskellunge (+ tiger pattern) | weed edges, points | follows the lure to the kayak, figure-eight; teeth cut line without a leader | violent head-shakes, short brutal runs |
| Walleye | deep points, dusk/night shallows | subtle taps; eye-shine in the lure cam; trolled crankbaits | dogged, deep |
| Chain pickerel | weedy coves | slashing strikes | quick, thrashing |
| Hybrid striped bass | open water over shad | dawn boils | long powerful runs |
| Channel catfish | bottom, channel edge, night | scent-driven; bottom rigs in holders | long bulldogging |
| Common carp | shallow silt flats | bubble trails, mudding, sight-fishing | huge, long runs |
| Black crappie | brush piles, dock shade, spring | schools | light; paper mouth pulls hooks if horsed |
| Bluegill | docks, shallows | bed colonies visible from above; the first fish on a float | quick circles |
| Yellow perch | deeper flats, schools | winter/ice mode later | light |
| Pumpkinseed | shallow weeds | colour showcase | quick circles |

## Size classes
Every species carries Young / Common / Trophy / Legend with its own thresholds and a length-weight curve (W = a·L^b, checked in tests against known specimens). Largemouth: Young < 12 in, Common 12–18 in, Trophy 18 in and 5 lb+, Legend the named residents at 7 lb+ against Pennsylvania's 11 lb 3 oz record. Class changes the fight, the card and journal progress.

## Implemented (v0.7.0)
| Species | Young | Common | Trophy | Legend | Weight (lb) | Diel | Temp °C | Fish in the cove |
|---|---|---|---|---|---|---|---|---|
| Largemouth bass | < 12 in | 12–18 | 18–22 | 22+ | in³ / 1600 | crepuscular | 18–27 | 8 + the Ridge Fish |
| Smallmouth bass | < 11 in | 11–16 | 16–20 | 20+ | in³ / 1300 | crepuscular | 16–24 | 5 |
| Walleye | < 15 in | 15–22 | 22–27 | 27+ | in³ / 2700 | nocturnal | 12–22 | 4 |
| Bluegill | < 6 in | 6–8 | 8–10 | 10+ | in³ / 1000 | diurnal | 18–28 | 12 |

Technique and lure-family multipliers per species are in `species.js` (`technique`, `lureFamily`); walleye treat topwater at 0.25 and walking the dog at 0.3, bluegill take almost nothing but small soft baits worked slowly. `tests/species.test.mjs` checks the roster, weights against known specimens and the diel peaks.

## Simulation (M2–M3)
States: HOLD, CRUISE, FORAGE, INSPECT (follows the lure 1–4 s), STRIKE, REFUSE (turns away; visible with the lenses), HOOKED (RUN / SULK / HEADSHAKE / JUMP / ROLL / TIRED), FLEE, SPAWN, SUSPEND, REST. Drivers: species diel curve, water temperature by season and hour, barometric trend, light (sun elevation × cloud), wind (bait stacks on windblown banks), clarity, moon. Perception: lure profile vs prey window, lateral-line vibration with inverse-square falloff, colour contrast at depth given clarity and light, flash, rattle, and technique match. `strikeChance = boldness · activity · presentation · techniqueMatch · (1 − aversion[lureFamily]) · depthMatch · speedMatch`. About ten persistent residents per lake learn aversion per escape and forget slowly; casual fish come from a population table.

## Rendering
Hero skinned glTF (20–40k tris, 2K PBR, WebP) with a species material on MeshPhysicalMaterial: countershading, tiled scale micro-normals with anisotropy along the body, iridescent sheen on flanks, fin translucency by sampling the refraction target, a mucus clearcoat that dries in the in-hand shot, gill flare, layered cornea eye, walleye eye-shine, mask-driven bar and spot patterns. Procedural swim on a twelve-bone spine, burst-glide, jaw snap, head-shakes and ballistic jumps. LOD: skinned hero within 12 m, 6–8k skinned to 40 m, instanced procedural beyond.

# Bearded Dragon · Desert Terrarium

A separate dry habitat for the dragon formerly in Weatherglass's rainforest. The supplied enclosure image guided its wide black frame, sandstone basking shelf, two shelters, weathered driftwood, sandy soil, desert backdrop, overhead lamps, food and water dishes. One living bearded dragon retains the original sculpt, 50-bone rig, scales, independent toes, breathing, blinking, hunting, grazing, memory and temperature-driven activity. Its feet and navigation sample the actual rocks and driftwood. No other animals share its enclosure.

- Live route: https://jez237.com/demos/bearded-dragon-terrarium/
- Build: `npm ci && npm run build`
- Controls: drag to orbit, scroll/pinch to zoom, Follow dragon, Feed cricket (then tap to place), Fresh greens, colour morphs and a lamp schedule. Keys F, M, H, R, 1 and 2. `?ui=0` hides the UI.
- Model: the user's existing procedural dragon from `scripts/terrarium/`, retained here with its baked binary.
- Backdrop and sandstone texture: built-in ImageGen, with the user's image as the composition reference. The log uses CC0 Poly Haven Rough Wood maps on custom closed, displaced branches. Aloe, cacti and shrubs are 3D geometry guided by the [fal GPT Image 2 plant studies and prompts](references/plants/README.md). See [asset credits](public/ATTRIBUTION.md).
- Habitat conditions are illustrative simulation values. Heat/light fade at night, and the dragon rests in the cool shelter. Its warm ledge, cool shaded hide, ventilation and internal UVB tube follow the broad layout principles in the [RSPCA bearded dragon guidance](https://www.rspca.org.uk/adviceandwelfare/pets/other/beardeddragon).
- The rainforest remains at https://jez237.com/demos/terrarium/ with its fish and toad and no dragon.

The public build is in `demos/bearded-dragon-terrarium/`. The preview and catalog cover are captured from the running 3D scene.

The enclosure measures 1.6 × 0.9 × 0.64 metres in scene units. Its expanded front-to-back depth provides 50% more floor area than the original 0.6-metre depth, with food and water near the front, planting along the edges and connected roaming space across the full floor. The dragon, shelters and climbing wood retain their scale.

Locomotion uses anchored stance feet, planned individual steps, a flexible trunk and an articulated tail with gravity, inertia and contact friction. The scene advances at a fixed 60 Hz and tail physics at 120 Hz; a suspended tab resumes without catching up in one large movement. Graphics context recovery retains the animal's state instead of reloading it onto the basking ledge. Parallel transport keeps the tail's cross-section from flipping at vertical hangs; the pelvis follows the trunk independently of tail contact. The tail collides against the full wood/stone meshes along each segment, including its visible skin thickness; unsupported sections sag freely. Swept contacts prevent tunneling, and each solid resolves a contact manifold without opposing per-triangle kicks.

Before lifting a foot, the controller finds a reachable surface patch for its sole and splayed toes and sweeps the complete toe fan along the step. Stance soles stay fixed in world space. Body movement, height and tilt are fitted to those contacts before the pose is committed, and the airborne foot's landing remains reachable. Climbs transfer one foot at a time, allowing a small weight shift on the three planted feet; level walking retains separate forelimb and hindlimb stance timing. A transfer waits for its elbow or knee to clear a surface before advancing farther. Broad collision capsules lead to a detailed check against an envelope sampled from the original leg mesh, including the rounded shoulder and hip joints. Feet lift before crossing a riser and approach the landing orientation during swing. Carried knee and hand frames avoid IK singularity spins, and toes conform individually to curved wood and stone.

Navigation preserves usable corners and reserves turning clearance for the whole stance. A broad worn sandstone incline, using the existing stone photograph, replaces the narrow stair corners between the ledge and the sand. The dragon backs into the hide with its head facing out. The water dish sits slightly farther toward the front-right corner to clear the hide entrance, and small decorative stones sit outside the walking corridor. Stance width and toe orientation adjust on narrow perches, in the hide and beside the glass. A blocked approach can back away and replan; it never relocates the animal to a waypoint. Support rays distinguish the top of a solid from its underside and from a genuinely overhead branch. Forepaws remain outside their shoulders, with collision-aware elbows and knees. Looking around and lifting the head cannot rotate the shoulder girdle away from the planted forefeet.

Run `npm test` for the regression suite. In addition to cadence, limb lengths, tail contacts, plant pressure and dish tests, the locomotion suite replays a continuous tour against an export of the actual habitat collision meshes, including both bowls. It measures stance sliding, rendered foot anchors, support gaps, limb lengths and body displacement on every simulation tick, and samples skinned-limb penetration at 10 Hz. The fixture contains geometry only; the dragon's sculpt and textures are unchanged.

Cave rear walls follow the rounded openings and sit inside the stone arches, avoiding an exposed dark rectangle behind the cool hide. Individual aloe blades and shrub stems bend down under contact with the dragon's body, feet, and tail, then recover gradually. Their roots stay anchored; margin teeth, seed clusters, geometry normals, and shadows follow the same bends. Broad shallow body contacts leave low leaves beneath the belly alone. Plant regressions check pressure clearance, recovery, rooted geometry, frame cadence, and overhead passes.

The feeding tray follows the original reference: a thick chipped oval stone rim and a properly closed basin, using the existing sandstone photograph. Fourteen edible portions combine 56 cupped, torn greens with textured squash chunks and slices. The bowl participates in foothold and tail collisions. The dragon keeps its chest and head raised to the salad when grazing; bites remove portions and the Greens control restores the full salad.

## Movement research and scale

The animal represents a central bearded dragon, *Pogona vitticeps*. The baked sculpt spans roughly 30 sculpt units, but its scene scale is **0.016 metres per unit**, giving an adult about **49 cm long**, including the tail. Cadence and reach use that scene scale; the old 30 cm description referred to the unscaled sculpt.

| Evidence | Consequence for this simulation |
| --- | --- |
| [Bonnan et al., 2025](https://anatomypubs.onlinelibrary.wiley.com/doi/full/10.1002/ar.25588), XROMM and treadmill observations: mean speed 0.30 m/s; forelimb stance 63%, hindlimb stance 74% across 13 trials. | Separate fore/hind support timing, with more support during slower movement. The forearm may rotate while the palm stays oriented toward its support. Published joint angles use anatomical coordinate systems and are not copied directly into this rig. |
| [Abdala et al., 2009](https://anatomypubs.onlinelibrary.wiley.com/doi/full/10.1002/ar.20909): flat-substrate stance/swing 0.49/0.14 s; broad-dowel 0.57/0.20 s, from two animals. | These imply approximately 1.6 and 1.3 cycles/s in those trials. Narrow surfaces require deliberate transfers and room for the stiff, splayed hand; the feet do not wrap like a chameleon's. |
| [Barringham, 2021](https://pure.manchester.ac.uk/ws/portalfiles/portal/216118204/FULL_TEXT.PDF): five juveniles filmed at 500 fps on sand, gravel and slopes from −15° to +15°. Sand increased support duty; slope responses varied between individuals. | Terrain changes step length, speed and support requirements. Juvenile size-normalized regressions are not copied as adult speeds. These shallow-track trials do not validate climbing over large rock edges. |
| [Zghikh et al., 2014](https://onlinelibrary.wiley.com/doi/full/10.1111/joa.12224): muscular tongue protrusion and substantially faster retraction. | A short, aimed pickup with faster retraction. Its excursion and timing are model-scale approximations, not a ballistic chameleon tongue. |
| [Australian Museum](https://australian.museum/learn/animals/reptiles/central-bearded-dragon/) and [Taronga Zoo / NSW Education footage](https://nswdoe-prod65-04.adobecqms.net/teaching-and-learning/animals-in-schools/animals-in-schools-resources/videos-animal-care-and-management/bearded-dragon-videos). | Daytime basking, resting, shelter, shade and omnivorous feeding. Random head-bob/arm-wave performances are disabled for this solitary animal. |

Visual references include the XROMM paper's two fluoroscope views and its looped forelimb reconstruction, plus Taronga's resting/perching and feeding presentation. Edited, slowed and looped footage is used for posture and limb sequencing; it is not treated as an unedited timing measurement. Speeds between the measured examples, acceleration, turning limits, tail stiffness, breathing and normalized internal drives remain engineering estimates. This is a behavior-informed animation, not a validated physiological model or husbandry guide.

## Controller ownership and regression checks

`LizardBrain` chooses activities, routes and desired motion. `LizardRig` owns the accepted root pose, support constraints, anatomical limb frames and committed foot transfers. `FootTransfer` gives each transfer a continuous start and touchdown. Gait phase requests a lift; it cannot skip a foot partway into its arc. A deterministic candidate budget spreads difficult foothold searches across ticks while existing feet remain planted. Unfinished transfers report recovery needs back to navigation.

The independent head solver checks an envelope of the actual head, neck and jaw mesh and raises the short neck without moving the shoulder supports. A near target crossing behind the neck cannot flip gaze between opposite limits. Jaw opening is eased. Tongue reach has a bounded direction and excursion. `PreyContact` tests the swept mouth/tongue against the insect's body after the final pose is accepted and rejects contact through hardscape. Prey under the chin triggers withdrawal; an insect repeatedly escaping across ledges may be left alone after a bounded pursuit.

`DragonNeeds` tracks illustrative satiety, thirst and fatigue. Feeding and drinking change those drives; supported rest reduces fatigue. Temperature and environmental light retain their existing role. The simulation now runs in real seconds rather than applying a global 1.5× multiplier to physiology, behavior and gait together. Render interpolation remains separate from the 60 Hz contact solver and 120 Hz tail solver.

The habitat tour and obstacle hunts sample rendered head, jaw, neck, trunk, feet and limbs in addition to controller targets. Separate tests cover lift-off continuity, different fore/hind duty factors, physical capture, gaze singularities, needs, tail stability and varied display cadence. `node --import tsx tools/measure-gait.ts` reports actual distance, cadence and support ratios on level ground; those values are simulation measurements, not additional biological evidence.

### Validation, 28 October 2026

All **71 regression tests** passed across the movement, navigation, hunting and remaining geometry/presentation suites. Six repeated tours from three seeds completed all 30 destinations, in addition to the continuous five-destination skin audit. All five stationary obstacle hunts captured by contact. The two open-sand moving-prey trials captured in 7.75 and 5.25 seconds; two insects escaping around ledges were left safely after bounded pursuits. Starting stances are checked for reach, and the difficult rock starting area is reached by walking rather than placing an impossible pose across an edge.

| Check | Observed result / limit |
| --- | --- |
| Planted sole drift | 0 in the sampled tours and hunts; limit 0.1 mm |
| Sole support gap and limb-length error | Floating-point residuals; limits 0.5 mm and 0.15 mm |
| Continuous-tour root/head displacement | At most 3.18 / 10.00 mm per 60 Hz tick; limits 4 / 12 mm |
| Sampled visible skin penetration | At most 2.43 mm in the continuous tour, including interpolated poses; limit 3 mm. Obstacle and moving-prey hunts stayed below 1.5 mm. |
| Stationary obstacle hunts | Longest translation pause 2.77 s; longest airborne transfer 1.74 s; no inverted forepaws |
| Level requested / actual speeds | 0.060 / 0.060, 0.120 / 0.119, 0.240 / 0.232 m/s |
| Timing | Fixed-step tests at 10, 15, 30, 60, 144 Hz and uneven display intervals; suspension and slow-frame recovery tested |

Rendered review used an oblique descent recording and a side-view moving-cricket capture, with closely spaced frames inspected during foot transfers. A visible 1280×720 embedded-browser sample ran about 32 fps, 31.7 ms frame-time p95 and real-time simulation speed over 81 seconds, with no frames over 100 ms. These are local measurements, not a performance promise for every device.

The contact solver is kinematic: it preserves supports and reachable anatomy, but does not simulate measured muscle forces or prove physical balance for every possible stance. Collision envelopes and the skin audit are sampled, with millimetre-scale residual penetration permitted. Difficult climbs remain slower than open-ground pursuit, some insects escape, and behavior/soft-tissue timings not directly measured in the cited studies remain estimates. The unchanged sculpt and material assets preserve the dragon's appearance.

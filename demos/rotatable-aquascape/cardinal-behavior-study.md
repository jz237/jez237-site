# Cardinal tetra behavior study

Species: **Paracheirodon axelrodi**, the cardinal tetra. This is a literature and field-observation review for the Living Aquascape animation, not a new animal experiment or a calibrated biological simulation. Neon tetra results were excluded from the species-specific behavior changes after the species was clarified.

## Evidence and implementation

### Foraging around submerged structure

Ilse Walker's 2004 study examined gut contents of 80 wild cardinals from Rio Negro tributaries. Small animal prey, including microcrustaceans and chironomid larvae, predominated. The paper describes groups browsing among submerged roots, plants and litter; incidental plant matter is not evidence that cardinals primarily eat plants.

**Applied:** Fish can choose feeding patches sampled from this tank's actual planted positions. They approach, briefly inspect or pick, remember recent patches, and return to travel. Browsing does not remove leaves or invent a measured population of prey.

Source: [Walker, 2004, Acta Amazonica — The food spectrum of the cardinal tetra in its natural habitat](https://acta.inpa.gov.br/fasciculos/34-1/BODY/v34n1a09.html).

### Group movement with short feeding stops

A first-person underwater field account in Tropical Fish Hobbyist describes cardinal schools pausing to pick food associated with plants, then continuing together. This is observational natural-history evidence, not a controlled estimate of speed, pause duration or schooling distance.

**Applied:** Individual browsing interrupts travel; local neighbors contribute to regrouping. Loose and cohesive periods vary in duration instead of repeating on a fixed 48-second schedule. Brief stops still include stabilizing fin movement.

Source: [TFH — Cardinal Tetras in Their Natural Habitat](https://www.tfhmagazine.com/articles/freshwater/cardinal-tetras-in-their-natural-habitat).

### Alarm responses are context-dependent

Goodall and colleagues (2024) reported avoidance, erratic swimming and less time moving when cardinals encountered conspecific skin extract. This experiment tested a chemical alarm cue. It does not establish a glass-tap response or justify constant frantic swimming.

**Applied:** The normal aquarium remains exploratory. Its pre-existing brief underwater tap response is retained as an interactive approximation, with a cooldown; it is not presented as a reproduction of that experiment. Identification and magnifier taps do not trigger it.

Source: [Goodall et al., Zoology, 2024 — Epidermal club cells and antipredator behavior](https://pubmed.ncbi.nlm.nih.gov/38701689/).

## Swimming mechanics and limits

No cardinal-specific high-speed kinematic dataset was obtained in this review. The numerical swimming, stroke and fin rates are therefore animation parameters, not published cardinal measurements. General undulatory swimming research supports linking propulsion to a traveling body wave and changing tail-beat activity with swimming demand; it cannot supply species-specific constants here.

Source: [Saadat et al., 2021 — Fishes regulate tail-beat kinematics to minimize speed-specific cost of transport](https://pmc.ncbi.nlm.nih.gov/articles/PMC8634626/).

The model retains a steady head and flexible rear body, independently moving paired fins, gradual upright turns, continuous vertical and front-to-back movement, obstacle avoidance and spacing. New independent short propulsion/coasting cycles vary effort within travel. Coasting reduces thrust while momentum decays; paired fins continue stabilizing. Pursuit of visible sinking food overrides browsing.

## Validation

Automated checks cover reachable feeding, browsing with memory, pause/resume, independent propulsion cycles, upright turns, exploration across depth, school cohesion and contact separation. Camera tracking is independent of fish heading. These establish software behavior, not biological validation. The next scientific improvement would be time-coded video of identified cardinals in a comparable planted aquarium, with body-length speed and pause distributions measured against this simulation.


## September 12 follow-up: footage review and surface grazers

### What was actually inspected

Ivan Mikolji's [Swimming with Paracheirodon axelrodi Cardinal Tetras](https://www.youtube.com/watch?v=HzKa7d-Ha7Q) identifies the fish and habitat in the author's description. Browser playback and paused frames at approximately 19.55, 24.55 and 35.27 seconds were inspected. The underwater frames show fish distributed around submerged cover, with varying projected spacing, headings and apparent sizes. Fish are not arranged in a single flat row.

This is a qualitative reference check, not a tracked kinematic dataset. Camera motion, occlusion and low resolution prevent reliable body-length speed, tailbeat-frequency or pause-duration estimates from these samples. No numerical motion constants below are presented as measurements from this video. Walker's field observations and diet study, and Mikolji's written account of brief feeding stops, remain the support for patch-oriented browsing and resumed group travel.

### Changes made from that comparison

- A feeding-patch arrival now requires proximity in all three spatial dimensions. Matching a leaf's screen position while several body lengths away in depth no longer triggers inspection.
- An unsuccessful approach times out into travel, rather than manufacturing a feeding stop away from the patch.
- Short picking movements begin after the fish settles at a reached patch, with independent delays and refractory intervals. They no longer come from a repeating global-time peck cycle.
- Existing bursts, coasts, flexible traveling body waves, independent fins, upright turns, local schooling, spacing, food pursuit and full-depth occlusion are retained.

Picking durations (0.08–0.15 s), delays and steering tolerances are illustrative parameters. Tests check actual 3D arrival, failed approaches, reaching real supplied patches, resuming travel, independent movement, feeding interception and collision spacing. These are simulation checks, not animal experimental results.

### Shrimp and snails

Six representative Neocaridina-like dwarf shrimp have articulated walking legs, front picking appendages, antennae, mouthparts, abdominal segments, swimmerets and tail fans. Three representative ramshorn snails have coiled shells, a contacting foot, mantle, heads and tentacles. They use individual grazing/walking clocks and cached contact paths on substrate/hardscape or glass. Routes that would bridge a sharp drop are relocated to the front substrate margin. Their movement is illustrative; the animals do not yet model food depletion, reproduction or population dynamics. They produce waste as well as recycling organic material.

[University of Florida IFAS: Cherry shrimp](https://ask.ifas.ufl.edu/publication/IN1301) describes five leg pairs, the first two modified for food handling, and abdominal swimmerets. This guided the representative appendage layout.

[Lee et al., Crawling beneath the free surface: Water snail locomotion](https://www.damtp.cam.ac.uk/user/lauga/papers/22.pdf) distinguishes ciliary gliding from conspicuous pedal waves. The ramshorn animation therefore keeps a continuous surface-contacting foot without attributing a measured land-snail wave pattern to this aquatic model. Exact taxonomic anatomy, shell growth and radular microstructure are not simulated.

All animals are original procedural geometry. No footage or third-party animal asset is redistributed. Detailed appendages share seven instanced render batches; the aquarium's existing plants, fish geometry, textures, resolution and lighting passes are retained.


### Macro-reference model revision

The shrimp and snails have since been rebuilt using an explicitly generated GPT Image visual reference and material atlas. See the [model study and reference](./grazer-model-study.md). The new meshes replace the rounded prototypes, adding shaped carapaces and abdomen plates, thin ray-bearing tail fans, joined shell whorls, an aperture lip, a broad sculpted foot and finer surface texture. This visual revision does not change or add measurements to the cardinal evidence above.

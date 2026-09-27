# Reef movement research: blue tang, semilarvatus, royal gramma

Research date: 2026-09-27. This note separates observed natural history from authored animation parameters. It is not an aquarium husbandry or stocking guide.

## Evidence and limits

No reliable adult **routine cruising speed**, tail frequency, or turning-rate measurement was located for these three species in the sources reviewed. Do not describe the proposed numbers below as measured biology. Critical swimming speed in an increasing-current laboratory test is also not a normal cruising speed.

The available quantitative royal-gramma paper concerns **5.5–10.5 mm larvae**, not the adult fish being rendered: Leis et al. (2012), *Development of morphology and swimming in larvae of a coral-reef fish, the royal gramma, Gramma loreto*, DOI [10.3989/scimar.03409.03A](https://scientiamarina.revistas.csic.es/index.php/scientiamarina/article/download/1333/1422/1401). Its larval critical-speed results must not be transferred to adult animation.

## Blue tang — Paracanthurus hepatus

**Sourced observations.** Oregon Coast Aquarium describes reef habitat and a diet combining plankton and algae scraped from reef surfaces. [Species account](https://aquarium.org/animals/blue-tang/). Nagoya Port Aquarium describes reef-associated groups and zooplankton/algae feeding. [Keeper species account](https://nagoyaaqua.jp/friends/south/13480/). Churaumi Aquarium distinguishes juveniles grouped among coral from larger animals occupying current-exposed rocky reef habitat. [Species account](https://churaumi.okinawa/sp/fishbook/00000094/).

**Implementation inference.** Give the blue tang a larger roaming range than the gramma, with continuous midwater routes, smooth height/depth changes, occasional plankton interception, and slower approaches to rock surfaces. If there is only one blue tang, do not manufacture a school with unrelated fish. Maintain awareness/separation of every nearby fish. Let successful feeding visits influence later route choices.

**Animation inference.** Keep the head stable and routine rear-body flex modest, with independent active pectoral fins. Increase posterior flex and caudal effort during real acceleration; reduce them during coasting. A study of the related yellow tang supports the general distinction between routine pectoral propulsion and increasing body/caudal contribution at higher effort, but **does not establish blue-tang thresholds**. [Related-species experimental study](https://link.springer.com/article/10.1007/s00360-025-01627-y).

## Golden/bluecheek butterflyfish — Chaetodon semilarvatus

**Strongest species-specific evidence.** Zekeria et al. (2002), *Resource partitioning among four butterflyfish species in the Red Sea*, observed coral feeding, solitary animals or small aggregations, and overlapping undefended home ranges. They observed feeding both by day and night. [Authors' university record and abstract](https://research.rug.nl/en/publications/resource-partitioning-among-four-butterflyfish-species-in-the-red/) / [DOI 10.1071/MF01150](https://doi.org/10.1071/MF01150).

**Additional institutional context.** The South African Institute for Aquatic Biodiversity account describes animals resting under ledges and active around coral, singly, in pairs, or in groups. [Coastal Fishes of the Western Indian Ocean, volume 3, species account](https://saiab.ac.za/wp-content/uploads/2022/11/1._wiof_volume_3_text.pdf). Kaliningrad Zoo reports pairs/small groups, coral and benthic-invertebrate feeding, and nighttime activity. [Zoo species account](https://kldzoo.ru/animals-and-park/animals/maskovaya-ryba-babochka/). These descriptions do not justify making the animated fish night-only, given the direct day-and-night observations above.

**Implementation inference.** Replace a tang-style repetitive patrol with deliberate coral inspections, braking to hover near a chosen surface, a brief mouth-oriented nipping/inspection pose, and an unhurried departure to another reef patch. Add longer sheltered pauses without leaving the fish hidden indefinitely. Do not treat it as an aggressive territory defender. A loose conspecific companion preference is defensible only if a second semilarvatus is present; do not glue it to the blue tang. Keep nibbling visual unless an actual food object is consumed; do not change chemistry for an empty inspection.

**Animation inference.** Use lower typical translation and stronger pectoral station-keeping than the roaming blue tang. Preserve visible traveling posterior flex, independent fin phases and speed changes, but avoid an eel-like wave through the round anterior body. The exact frequencies, pause durations and speeds remain authored.

## Royal gramma — Gramma loreto

**Sourced observations.** Aquarium La Rochelle describes small reef-associated shoals, strong proximity to cave entrances/overhangs, feeding on small planktonic and benthic crustaceans, and defensive mouth-open displays. It also documents belly-up swimming beneath overhangs. [Aquarium species account](https://www.aquarium-larochelle.com/en/species-encyclopedia/royal-gramma/).

**Implementation inference.** Use a persistent, collision-safe shelter anchor. Alternate hovering near it with short food inspections and brief excursions; return toward shelter when crowded or when a much larger nearby fish approaches. A gramma should not share the tang's tank-wide cruising pattern. Local separation should dominate tight schooling. It may explore front/back depth around its ledge while maintaining an escape route.

**Orientation constraint.** Inversion near a real ledge is biological, but implementing unrestricted roll would conflict with the user's established upright-turn preference and risk spinning artifacts. For this pass, keep upright navigation and encode the shelter/foraging behavior. Only add optional controlled inversion later if a true overhang surface-normal target and a stable interpolation are available; never roll randomly in open water.

## Illustrative tuning envelope — NOT measured species speeds

These ranges are optional starting points for authored calm aquarium motion, expressed in model body lengths per second (BL/s), to be adjusted after visual review. They are not literature-derived measurements or physiological limits.

| Species | Routine translation | Slow inspection / station keeping | Brief purposeful acceleration |
| --- | --- | --- | --- |
| Blue tang | 0.45–1.1 BL/s | 0.08–0.25 BL/s | 1.3–1.8 BL/s |
| Semilarvatus | 0.20–0.55 BL/s | 0.02–0.14 BL/s | 0.7–1.0 BL/s |
| Royal gramma | 0.12–0.40 BL/s locally | 0.01–0.10 BL/s | 0.8–1.3 BL/s for short excursions/retreat |

Apply acceleration/deceleration easing, curvature-aware braking, persistent individual state/phase, and collision clearance to each envelope. Do not multiply the same rigid loop by a species speed. Keep body wave amplitude tied to actual effort, retain fin movement during hovering, and preserve varied bursts, coasts, inspection pauses, continuous depth and stable heads. Sampling frequencies and pause durations should be individual and independent. Braking at a target must not repeatedly overshoot and flip heading.

## Recommended acceptance observations

- Over a minute, the tang should visibly cover more open-water range while the gramma repeatedly returns to its shelter region.
- The semilarvatus should visit multiple coral-adjacent points and visibly settle/inspect rather than cross the tank without purpose.
- None should permanently occupy a single depth plane, pass through coral, spin, or share synchronized tail/fin timing.
- Food pursuit must target an actual particle; only mouth-range capture consumes it. Sheltered pauses and empty coral inspections must not consume food.
- Label any exposed speed or behavior constants as illustrative. No claim of scientifically measured adult speed is supported by this research pass.

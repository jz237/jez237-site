# Reef aquarium swimming research

Research date: September 27, 2026. This guide covers the seven fish species in the 3D reef aquarium and explains how their natural behavior should inform the animation. It is not a fishkeeping or stocking guide.

## What the research supports

| Fish | Observed behavior | Current animation design; validation underway |
| --- | --- | --- |
| **Blue tang** (*Paracanthurus hepatus*) | Reef-associated fish that feed on plankton and algae. [Oregon Coast Aquarium](https://aquarium.org/animals/blue-tang/) | Broad routes through open water, changing height and depth, occasional food pursuit and slower rock inspections. The lone tang does not join a school of unrelated species. |
| **Semilarvatus / bluecheek butterflyfish** (*Chaetodon semilarvatus*) | Field observations document coral feeding, solitary animals or small aggregations, overlapping undefended home ranges and feeding during both day and night. [Zekeria et al., 2002](https://research.rug.nl/en/publications/resource-partitioning-among-four-butterflyfish-species-in-the-red/) | Visits to accessible reef-adjacent points, with braking, inspection pauses and departure to another patch. These scenery inspections do not remove coral or create a food capture. No aggressive territorial patrol is assigned. |
| **Royal gramma** (*Gramma loreto*) | Stays near cave entrances and overhangs, feeds on small crustaceans and can display defensively. Natural upside-down swimming is associated with overhangs. [Aquarium La Rochelle](https://www.aquarium-larochelle.com/en/species-encyclopedia/royal-gramma/) | A remembered shelter, short local excursions, hovering and returns when crowded by larger fish. Navigation remains upright; overhang inversion and mouth-open territorial displays are not implemented. |
| **Blue-green chromis** (*Chromis viridis*) | Schooling research measures both group alignment/spacing and individual escape responses. Fish feed near home coral and shelter in its branches. [Nadler et al., 2018](https://eprints.gla.ac.uk/168214/1/168214.pdf), [feeding study, 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9339911/) | Local heading alignment, cohesion and separation combine with individual decisions and fin phases. Shared excursion regions allow loose grouping; food pursuit can interrupt it. Night goals favor accessible water beside reef structures, rather than entering solid coral. |
| **Female lyretail anthias** (*Pseudanthias squamipinnis*) | A study of adult females documents site-attached plankton feeding near shelter: search, strike individual prey and orient into current. Stronger current reduces the spread of orientations. [Genin et al., 2024](https://www.frontiersin.org/articles/10.3389/fmars.2024.1330477/full) | Local above-reef excursions around individual home stations, loose social attraction and pauses facing an authored slowly changing current direction. Food pursuit interrupts the routine. Female models do not receive male harem-defense behavior; the current is an animation cue, not a fluid simulation. |
| **Ocellaris clownfish** (*Amphiprion ocellaris*) | A captive juvenile study found shorter travel with an accepted natural host, predominantly daytime activity and individual variation. Anemonefish make occasional feeding excursions from their host. [Host-choice study, 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6850181/) | Existing anemone interaction remains, with independently timed perimeter excursions, nearby feeding and returns. Fins remain active during hovering, and nighttime movement slows. |
| **Mandarin dragonet** (*Synchiropus splendidus*) | Extensive field observation found close substrate association, local movement and avoidance of open sand between habitat patches. Spawning rises are a special dusk behavior. [Sadovy de Mitcheson et al., 2022](https://link.springer.com/article/10.1007/s10641-022-01281-1) | Short moves score nearby rubble edges more highly than exposed ground, with bottom hovering, inspection picks and supported rests. Height follows the sand terrain and depth varies locally. Rock-top perching and reproductive spawning ascents are not implemented. |

The animation applications are design interpretations of the observations, not claims that the papers measured every pose or movement parameter.

## Speeds and motion limits

**Authored model-body-lengths-per-second values are animation settings, not measured adult cruising speeds.** One model body length is the normalized one-unit trunk length scaled for each fish; it can exclude the caudal fin and is not necessarily the rendered animal's total length. This lets differently sized fish move at plausible relative scales without claiming a calibrated physical aquarium.

No comparable set of adult routine swimming speeds, fin frequencies and turning rates was established for all seven species in this research. In particular:

- The chromis experiment's 3.2 cm/s is a **tunnel water-flow setting**.
- The anthias experiment's 3–28.5 cm/s values are **water currents**.
- The clownfish activity results concern **juveniles and host conditions**.
- Available royal-gramma swimming measurements concern **larvae**, not the rendered adults. [Leis et al., 2012](https://scientiamarina.revistas.csic.es/index.php/scientiamarina/article/download/1333/1422/1401).

None should be reused as a generic adult cruise speed. Routine travel, holding position against current, a feeding dart and an escape burst are separate behaviors. Fin effort may remain substantial during station holding even when the fish barely moves relative to the tank.

The authored motion should retain a steady head, a traveling rear-body wave, independent fins, smooth acceleration/braking, coasts, inspection pauses and gradual upright turns. Individual timing must vary. Benthic and host-associated fish still need real front-to-back movement and changing terrain height, with collision clearance; apparent depth must never come from crossing solid scenery.

## Implementation validation

Species profiles, local habitat behavior, independent stroke/glide and fin phases, school coordination, food capture and nighttime refuges are implemented. Three seeded daytime communities and three seeded day/night communities pass finite upright motion, spacing, independent timing, local habitat and paused-state checks. Eighteen feeding fixtures require actual mouth contact; existing mandarin and anemone-host checks also pass.

The non-browser reef suite and TypeScript build passed. Desktop, oblique, close-up and phone views were reviewed through the Codex browser, including feeding, pause/resume and blue-hour settling. The Hidden Reef production JS/CSS match the tested build, and the live species notes/source links were verified. See `approved-build.json` for scope and the separate jez237 Cloudflare access limitation.

The checks cover:

- The seven species visibly differ in route size, preferred habitat, pauses and feeding responses.
- Chromis align and maintain spacing without identical synchronized loops; sheltered species return to safe home regions.
- Fish retain flexible bodies, active fins, smooth turns and depth exploration without clipping or persistent oscillation at obstacles.
- Food pursuit targets actual particles; only mouth-range capture consumes food. Empty inspections never change food or chemistry accounting.
- Front, oblique and phone views remain readable, and the existing reef behavior/browser checks pass before publication.

Detailed working notes: [schooling, host and benthic species](species-research-school-host.md) and [tang, butterflyfish and gramma](species-research-tangs-gramma.md).


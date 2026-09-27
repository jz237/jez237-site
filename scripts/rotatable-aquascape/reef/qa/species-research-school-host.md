# Reef schooling, host and benthic species: behavior research

Research date: 2026-09-27. Scope: blue-green chromis, female lyretail anthias, ocellaris clownfish and mandarin dragonet. This document recommends behavior; it does not claim those changes are already implemented.

## Evidence and interpretation

### Blue-green chromis — Chromis viridis

- **Research:** Nadler et al. (2018) filmed wild-caught schools, measuring neighbor spacing, alignment and individual escape responses. Group coordination and individual escape behavior are distinct; individuals were not interchangeable. The experiment used a 3.2 cm/s tunnel flow (about one body length/s for these fish). That is an experimental flow setting, not a measured universal cruising speed. [Original paper, Biology Open, DOI 10.1242/bio.031997](https://eprints.gla.ac.uk/168214/1/168214.pdf).
- **Habitat and feeding:** The species feeds around its home branching coral by day and shelters in the coral at night. [Original feeding-kinematics study, 2022](https://pmc.ncbi.nlm.nih.gov/articles/PMC9339911/).
- **Application:** Add local same-species heading alignment, cohesion and short-range separation; keep individual phases and decisions. Alternate a loose feeding cloud above one refuge with modest coordinated excursions. Allow a brief individual food dart followed by rejoining. Avoid rigid formation slots and a whole school changing direction on one frame. Retreat must target a collision-free refuge vicinity rather than teleporting inside coral geometry.

### Female lyretail anthias — Pseudanthias squamipinnis

- **Research:** Genin et al. (2024) explicitly used adult females. These site-attached planktivores forage near shelter, orient into the current, search slowly and strike individual drifting prey. Stronger flow narrows their head-on orientation and reduces turning. The tested 3–28.5 cm/s values are water flow speeds, not target fish speeds. [Original flume study, Frontiers in Marine Science, DOI 10.3389/fmars.2024.1330477](https://www.frontiersin.org/articles/10.3389/fmars.2024.1330477/full).
- **Social context:** Aggregations feed above the reef; males defend harems of females/juveniles. Do not assign male territorial patrol/display behavior to a modeled female. [Museums Victoria, Fishes of Australia](https://fishesofaustralia.net.au/home/species/4402).
- **Application:** Prefer an above-reef station near shelter, gentle current-facing hover/search and short prey-directed darts with braking and return. Use loose social attraction to other anthias rather than rigid synchronized schooling. Let local current alter facing and effort even when world-space speed is low. Preserve actual particle selection and mouth-range consumption.

### Ocellaris clownfish — Amphiprion ocellaris

- **Research:** A captive juvenile study found association with the natural host shortened travel relative to groups without an accepted host. The fish were active mainly by day, with strong individual variation. The paper describes time among anemone tentacles and occasional excursions into the water column to feed. Its juvenile, host-dependent activity results must not be relabeled as an adult routine cruising speed. [Host choice and fitness study, 2019](https://pmc.ncbi.nlm.nih.gov/articles/PMC6850181/).
- **Application:** Keep a strong home/anemone preference, small curved excursions, nearby inspection/feeding pauses and a clear return phase. Reduce broad whole-tank patrols. The already established safe anemone-brushing paths should remain authoritative. Independently moving pectorals and a modest, variable rear-body wave can maintain visible life during hovering; these pose details are animation interpretation, not measured kinematic data from that study.

### Mandarin dragonet — Synchiropus splendidus

- **Research:** Over 400 hours of field observation found close substrate association, local movements and avoidance of open sand between occupied habitat patches. Daytime fish dispersed to feed and were often hidden. Dusk pair-spawning rises are a special reproductive behavior, not their ordinary swimming mode. [Original field study, Environmental Biology of Fishes, 2022, DOI 10.1007/s10641-022-01281-1](https://link.springer.com/article/10.1007/s10641-022-01281-1).
- **Aquarium account:** Bottom dwelling, commonly on the sand bed or perched on coral. [Aquarium of the Pacific species account](https://www.aquariumofpacific.org/onlinelearningcenter/species/mandarin_goby).
- **Application:** Use the slowest routine travel of these four, frequent inspection/perching intervals and short movements between nearby accessible rock/substrate patches. Prefer sheltered paths over long open-water crossings. Support gradual changes in height following real terrain and full front/back depth; avoid a mechanically fixed bottom lane. Emphasize independent fin activity during hover with restrained body/tail effort, then increase the traveling body wave for a short relocation. Fin emphasis is visual interpretation; no adult fin-beat measurement was found. Do not repeatedly play spawning ascents for a lone fish in daytime.

## Initial animation tuning, not measured biology

The following are **illustrative starting points** for a miniature aquarium, expressed in each rendered fish's body lengths per second. They are not species speed measurements and should be adjusted against the scene's scale, collisions and existing movement. Preserve slow acceleration/braking, upright turns and stable heads.

| Species | Routine local translation | Brief directed feeding/relocation | Search/inspection pause |
| --- | --- | --- | --- |
| Chromis | 0.65–1.25 BL/s | 1.5–2.5 BL/s | 0.7–2.5 s |
| Female anthias | 0.45–1.0 BL/s | 1.4–2.4 BL/s | 1–3.5 s |
| Ocellaris | 0.35–0.8 BL/s | 0.9–1.6 BL/s | 1.5–5 s |
| Mandarin | 0.12–0.4 BL/s | 0.45–0.9 BL/s | 2–7 s |

Routine swimming, station holding against water, a prey strike and a predator escape are different states. Do not drive fin effort solely from world-space travel speed: a fish maintaining position in current still propels itself. Do not substitute critical swimming speed, larval performance, water-current measurements or escape maxima for ordinary adult locomotion. Timings, probabilities, turn limits and group weights remain illustrative. Maintain independent random seeds, food/energy/perception/memory logic and existing accounting; observing or pecking scenery must never consume nonexistent food.

# Mandarin dragonet — September 24 correction

The user's latest photograph and explicit scientific name identify **Synchiropus splendidus**. It replaces the diamond sleeper goby, rather than adding another inhabitant or implementing the previously selected green clown goby.

Sources consulted:
- [California Academy of Sciences](https://www.calacademy.org/explore-science/mandarin-dragonet): outward-set eyes, rapid fin pulses producing a hovering motion, low reef feeding on small invertebrates, scaleless skin. This supports a steady head and active paired fins rather than a constantly racing tail.
- [Nausicaá aquarium](https://www.nausicaa.fr/en/my-visit/animals/mandarinfish): pectoral-fin propulsion, reef-associated pecking, orange/brown skin with sinuous blue/green bands, prominent lips, separate dorsal fin morphology. This supports small picks and low exploration rather than diamond-goby sediment sifting.

Implementation: short variable low moves, rear-body traveling flex and smoothly filtered turn bend, independent fluttering pectorals and paired spreading pelvic fins, quiet rests and small downward feeding picks. Existing mouth/gill respiration remains independent of travel. Food disappears only at actual mouth contact; no sand-stream particles. The ground is sampled under the whole body/fin footprint, not just the center, to clear dunes. A low-food progress watchdog yields to a committed escape if prey cannot be reached.

Motion frequencies, speeds, timings and the demo's prey particles are illustrative rather than measured physiology or a simulated copepod ecology. Current movement explores low sand/rubble margins; it does not yet perch on elevated coral surfaces. The generated reference is a modeling aid; the user's photo remains the visual target.

## Final behavior pass — field-footage review, September 24

Reviewed portions of Biopixel's public watermarked field preview, [Pair of mandarinfish feeding amongst rubble 8K](https://biopixel.tv/video/dragonet-pair-of-mandarinfish-feeding-amongst-rubble-8k/), video15136, filmed in Indonesia. The visible A630_C007 sequence shows a mandarin advancing through a small rubble patch, changing its heading towards adjacent crevices while remaining close to the bottom. Other portions show it disappearing behind nearby rubble rather than cruising through open water. Visibility is partly obstructed; this review does not establish a measured finbeat rate. The California Academy and Nausicaa accounts above provide the specific pectoral-hovering and feeding-pick descriptions.

Applied interpretation: shorter local relocations biased towards the fish's current heading, alternating small thrusts and glides; repeated inspection/pick pauses in one patch; lower settling on the sand; modest continuous rear-body flex with stronger escape strokes. Pectoral frequency now integrates over time, preventing abrupt phase jumps when speed changes. Pelvic supports, mouth/gill breathing, terrain footprint, upright turns and contact-based pellet capture remain active. Fixed the ground specialist's route margin to agree with its endpoint margin; the previous open-water margin prevented the last portion of settling.

The rates, dimensions and timing are artistic approximations, not measurements from footage. This ground-level implementation still does not crawl over or perch on elevated coral surfaces. No sand-sifting behavior has been added. This is the final user-requested pass; the improvement automation remains deleted.

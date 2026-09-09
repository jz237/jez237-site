# Jez and Benny: complete painted library expansion

Adds a companion drawing for every populated cell in both fighters' 28 source sheets: 410 new drawings each, 820 combined, packaged in 56 WebP atlases. Excluding the 16-cell legacy-special fallback bank, each fighter has 394 new drawings. The physical library grows from 410 to 820 cells per fighter. These counts include fallback/support art and companions of retired cells; they are not a claim that every stored image is a unique live animation pose.

The presentation selector now covers the complete library rather than just normal attacks and shuffles: idle/crouch, jumps, air recovery, dashes, defense, reactions, knockdown/getup, throws, specials/EX/supers, taunts, victory and finisher poses. Existing repair routing still excludes defective originals. Companion timing preserves short contact endpoints and settled holds; presentation interpolation now covers special attacks as well as normals. Combat clocks, damage and collision rules are unchanged.

New atlases have whole-body padding and measured floor/body-center registration. The move viewer adds ten movement categories and supports eighth-tick review for these two fighters. `?fullLibrary=0` permits a presentation comparison against the previous library.

Validation:

- All 820 cells passed source connected-component and atlas alpha-bound checks; one detached-fragment sheet was regenerated.
- Reviewed original/new sheets, normal/footwork sequence strips, and both finishers with both fighters in attacker/victim roles.
- Sampled 48 viewer sequences per fighter: 18,928 Jez samples and 18,624 Benny samples. Before/after coverage is recorded beside the asset audit.
- Four CPU matches (seeds 237 and 549, both orders) completed at the same simulation ticks as the comparison build: 1401, 1396, 1312 and 1271.
- Four timing/availability unit tests passed. Eight focused browser probes passed; the offline-cache probe passed separately after its expected shell count was updated for the two new boot modules.
- Live local playback confirmed both fighters rendering the new atlases, with no browser exceptions.

The extra drawings increase animation detail; they do not double the browser's refresh rate. Short moves retain their original duration, so a particular display may not show every sub-tick drawing on every playback.

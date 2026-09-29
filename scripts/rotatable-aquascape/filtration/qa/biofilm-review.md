# Magnified live-rock biofilm

2026-09-29T07:07:03.730Z

The preceding color key explained the symbols but did not solve the graphic: detached colonies still looked like objects beside the rock. This redesign keeps real rock in 3D and shows microscopic biology in an explicitly magnified surface cross-section.

- Removed both symbolic 3D microbe groups and the dotted nitrogen path; all three real rock sections retain the exact packed geometry and growth.
- A clearly labeled magnified surface shows cells embedded in a film over rough porous rock.
- Named compounds, oxygen arrows and three numbered steps explain ammonia to nitrite to nitrate; nitrate remains in the water.
- A finite 12-second user-started animation follows nitrogen with a labeled N. Manual steps, local and global pause, replay, reset and offscreen suspension verified.
- Reviewed desktop, 390px and 320px phones, assembled/exploded rock, and an actual time sequence. Rock controls remain together; Magnify surface scrolls and focuses the explanation.

No slow-hardware claim or new FPS baseline. Rock asset bytes unchanged; biology decreases from 65 to 59 calls and from 1,872,210 to 1,846,866 triangles. Other assemblies retain their prior counts. Added compressed JS is about 2.2 kB and CSS about 0.8 kB; the SVG needs no extra download or WebGL context. Animation sleeps offscreen and stops after one cycle.

The three-step narrative is informed by the [MIT Sea Grant saltwater aquaculture guide hosted by NOAA](https://repository.library.noaa.gov/view/noaa/9598/noaa_9598_DS1.pdf). The N marker tracks nitrogen conceptually; this is not a balanced reaction diagram, a timed chemistry solver, or a literal depiction of cell size or color.

QA caught an offscreen-test setup with part of the graphic still visible; the final test first ensures the graphic is fully offscreen in a shorter viewport, then verifies no clock advance and correct resume. Cells were placed on the actual illustrated surface contour after visual review.

Before/after, manual stages and time-sequence frames are in biofilm-evidence. Build hash: 70908129f367260b13af0e545c6df0b302995542243c1109b814c51b574d7b60.

Published on Hidden Reef from 240336bb5d8bc96b3c9265194bfd49463aed8846. Preview and production checks confirmed exact active JS/CSS, preserved rock bytes, store images, pond exhibit, the desktop/mobile diagram and navigation back to the reef. Live evidence is saved beside this review. GitHub main contains source and synchronized build copies. The previously recorded jez237 authentication blocker remains; no upload was attempted there.

# Skimmer and live-rock detail review

2026-09-29T03:53:24.246Z

- Reused the saved GPT Image skimmer and biology references. They guide appearance rather than exact construction specifications. No new generation, purchased assets or paid APIs were used.
- The skimmer now has a fluted pump housing, mounting feet, shaft bearings, four rows of needle-wheel pins, a hollow venturi throat, union seals and diffuser standoffs. The existing selectable components and rotating pivot remain intact.
- The collection cup has an annular waste pool, meniscus, fine foam raft, uneven deposits, small water droplets, a hose barb and clamp. The lid has actual vent holes, a knurled handle and fasteners; the clear silencer exposes its channels and baffles.
- Individual rising bubbles vary in size, speed and lateral drift. A small irregular foam cap moves at the riser. Rendered time sequences visibly differ; pause produces identical images. Flow effects hide when parts are separated or isolated.
- Live rock now has less regular pore geometry, small-scale carbonate breakup, stronger cavity color variation, fine mineral/pit textures and richer coralline colors. Detached implicit-surface chips are removed so each teaching section remains connected. The full geometry is baked and still loaded only when Living rock is selected.
- Surface-sampled lobed crusts, chalk fragments, clustered open sponge pores, curled calcareous tubes and short turf filaments replace repeated round surface beads. New growth avoids planar teaching cuts and stays with its own rock slice.
- The first candidate had broad flat crust chips and an overly sparse bubble column. The final version uses smaller textured crusts and denser varied bubbles. Reviewed front, top, oblique, close-up, isolated, exploded, whole-system and phone views.
- The model remains a teaching illustration: rock cut faces and pore distribution, wet optical scattering and foam are simpler than the generated references. Photographic parity is not claimed. Enlarged microbial markers remain symbolic.
- Freshwater and reef aquarium source, site images, navigation and other educational exhibits were not changed. Functional tests cover all 42 parts, assembly, selection, isolation, sensor cycle, flow, pause, reset, mobile and reduced motion.

## Visual evidence

- Skimmer: [reference](references/skimmer.png), [before](skimmer-rock-evidence/before-skimmer-assembled.png), [after](skimmer-rock-evidence/after-skimmer-assembled.png), [close-up](skimmer-rock-evidence/skimmer-close-up.png), [exploded](skimmer-rock-evidence/skimmer-exploded.png).
- Living rock: [reference](references/biology.png), [before](skimmer-rock-evidence/before-biology-assembled.png), [after](skimmer-rock-evidence/after-biology-assembled.png), [close-up](skimmer-rock-evidence/biology-close-up.png), [exploded](skimmer-rock-evidence/biology-exploded.png).
- Motion: [first](skimmer-rock-evidence/foam-motion-0.png), [later](skimmer-rock-evidence/foam-motion-3.png), [paused](skimmer-rock-evidence/foam-paused-0.png).
- Phone: [skimmer](skimmer-rock-evidence/phone-skimmer.png), [rock](skimmer-rock-evidence/phone-biology.png).

## Performance

Serial local Chrome 1440x1080 DPR1; 1s scene warmup then 4s RAF and browser-task sample. This is not a low-end hardware claim.

| View | FPS before → after | Draw calls | Triangles | Browser task seconds / 4s |
| --- | --- | --- | --- | --- |
| system | 60.2 → 60.1 | 336 → 359 | 979,726 → 1,049,822 | 0.871 → 1.262 |
| roller | 60.1 → 60.1 | 94 → 94 | 289,772 → 289,772 | 0.555 → 0.838 |
| skimmer | 60.1 → 60.1 | 93 → 116 | 412,212 → 482,308 | 0.541 → 0.890 |
| biology | 60.2 → 60.1 | 18 → 33 | 1,015,384 → 936,104 | 0.364 → 0.703 |
| return | 60.0 → 60.2 | 25 → 25 | 72,972 → 72,972 | 0.393 → 0.683 |

Initial ready time: 3845 ms before, 5022 ms after. These are single-run desktop measurements, not low-end guarantees. Additional details increase draw calls and CPU work. The compressed on-demand rock asset decreased from 5,112,638 to 4,230,701 bytes (-881,937 bytes) after detached fragments were removed. Full geometry and independent component selection are retained.

[Full performance measurements](skimmer-rock-evidence/performance.json). Build hash: bffd872a2c195655852c23379e6887038440565cc443c07504d364de61d129f9. Checks validate functionality and regressions, not photographic realism. Publication status is recorded in publication.json.

## Publication

Published Hidden Reef from 11298574bc1078a5b2b2afedee0bd0ac690f8430; verified exact active JS/CSS, compressed rock bytes, site images, preserved pond exhibit and desktop/phone navigation. [Live skimmer](https://hidden-reef.pages.dev/showroom/filtration/?v=11298574b#skimmer), [live rock](https://hidden-reef.pages.dev/showroom/filtration/?v=11298574b#biology). GitHub main contains the source and evidence.

jez237 remains at its previous release because its Cloudflare login still cannot refresh (400, not logged in). No jez237 upload was attempted. The complete synchronized files are committed, ready for its guarded deployment workflow once login is restored. This is not a claim that both sites are synchronized.

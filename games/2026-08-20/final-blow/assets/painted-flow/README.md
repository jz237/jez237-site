# Painted strike frames — 5.4.6

Two 16-cell atlases made with the built-in image-generation tool from the existing `assets/unified/jez-ext3.webp` and `benny-ext3.webp` identity/style references. These are painted sprites, not Blender renders. The generated masters remain in Codex generated_images; the game loads these local, transparent WebP assets. Each JSON file records the source master, extracted rectangles, scale and planted-foot registration.

## Prompt set

Jez: Create exactly 4 columns by 4 rows, 16 equally sized square cells. Match the reference muscular older man, slick white hair, glasses, sleeveless royal blue gi, black belt, black fingerless gloves and brown boots. Detailed painted arcade illustration; identical right-facing camera, proportions and lighting. First eight poses form guard, coil, halfway extension, nearly extended punch, full extension, half retraction, hand at cheek and guard. Last eight form guard, heel lift, knee chamber, half-unfolded front kick, waist-high extension, folded shin, lowering boot and guard. Full bodies entirely inside cells, consistent scale, no effects, props or cropped extremities. A second background-only edit replaced the generated checkerboard with pure magenta for production extraction, preserving the figures.

Benny: Exactly 4 columns by 4 rows. Match the reference grey baseball cap, fitted black T-shirt, khaki cargo pants, belt and side pouch, black gloves and black boots. Same detailed painted style and right-facing camera. Two distinct eight-frame sequences: straight lead punch and front kick, with coil/chamber, partial extension, contact, retraction and settled guard. Every figure fully contained in its cell. Pure solid magenta backdrop for chroma extraction, no effects, weapons or duplicate limbs.

## Acceptance and timing

The generated Jez full punch landed in cell 3, with retraction in cell 4. The selector follows that actual art instead of the requested labels. Cell 6 is a redundant near-guard and is omitted from his punch track. Benny uses cells 0–7; kicks use 8–15. Total move durations and active windows are unchanged. These sheets apply to grounded standing normal punches/kicks only; airborne, crouched and special moves retain their own authored sequences.

Production packing removes the magenta, detects the actual row bands, registers the rear boot, fits all cells with transparent margins and exports lossless WebP. All cells have at least five pixels of transparent border. No per-frame fitting is done at runtime. `tools/painted-flow/pack.mjs` accepts the master directory and output directory, with Sharp available through `SHARP_PACKAGE` if it is installed outside the repo.

Browser verification traces both fighters' punch and kick tracks through the live pose resolver. Separate source-art rejection skips known cropped cells through the existing fallback chain. Full-body attack echoes were removed to eliminate duplicate fists behind the attacker.

# Closed-fist punch audit — 5.6.7

Reviewed standing punch contact/transition frames for all ten fighters, plus crouching and airborne approach frames and punch windup/recovery companions. The inspected standing punch contact sheets already depict closed striking fists. Jez and Benny had open floor-support palms in crouching-punch windup/recovery art; these were inappropriate for the punching sequence.

Replaced cells 8 and 9 in each fighter's `assets/unified/<id>-ext2.webp` and `assets/inbetweens/<id>-unified-ext2-v1.webp`: eight drawings total. Both hands now stay clenched above the floor. Base and companion variants remain distinct. Other cells are pixel-identical; move timing, contact frames, crouch height and floor registration are preserved. Registration measurements and source rectangles are recorded in `fist-repairs.json`.

## Built-in image-generation prompt set

Edit target: a four-column, two-row contact sheet of the eight original cells, Jez above Benny.

Primary edit: Preserve the characters' painted arcade style, identities, clothes, lighting, right-facing camera, squat/kneeling lower-body poses and boot positions. These are crouching punch windup/recovery frames, not hand-supported sweeps. Remove all floor-reaching hands. Both hands in every sprite must be tight closed fists, fingers curled into the palm and thumb across the outside, with straight wrists. Raise the former floor hand to a plausible low boxing guard. Columns 1/3 are windup with fist at ribs and guarding fist at chin; columns 2/4 are retraction with bent elbow and fist returning at chest height. Make columns 3/4 subtle intermediate variants. Fully contain every head, fist and boot inside its cell with clear margins; no effects, props, extra limbs, grid lines or text.

Background-only follow-up: Replace the generated checkerboard with uniform pure magenta #ff00ff, including interior gaps. Preserve every character, fist, arm pose, silhouette, layout and shading. No gradients, checkerboard or effects.

Generated masters: `exec-56ea2b3f-a126-4675-9d48-88e7f228906c.png` and keyed `exec-84515c0d-fc90-48eb-9806-5fa64bc40e79.png`, produced with the built-in image tool. Production packing extracts chroma, fits the previous cell height, registers the support boot within one pixel and retains transparent cell margins. Packed WebP assets reside in this project; the generated master is not a runtime dependency.

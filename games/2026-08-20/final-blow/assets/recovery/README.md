# Painted recovery pilot — 5.7.9

Jez and Benny each receive sixteen newly generated full-body painted poses in a 1280×1280 WebP atlas. Built-in image_gen used their existing painted-flow/v2 sheets as identity references. Originals remain in the generated_images directory; the original sprite sheets are preserved.

Rows: four punch retraction/guard poses; four kick retraction/lowering/guard poses; light/high, heavy/high, light/low, heavy/low block poses; high slip, crouched slip, slip return, neutral guard. The last neutral drawing is retained as reference art. A slip is presentation of an actual opponent whiff, not an invulnerable gameplay dodge.

Runtime owns recovery after activeEndFrame and a short hand-gather during confirmed linked startup. Contact windows, hitboxes, damage, and cancel timing are unchanged. Readiness is pinned per attack so decoding mid-move cannot replace a pose. Moving fighters keep their footwork instead of a stationary slip. New standing/crouched recoil starts at the actual impact tick, with a longer held heavy recoil.

Packing: chroma-key/despill, isolate complete connected figures, use one anatomical scale per fighter, and pad every figure by at least eight pixels. Kick recovery cells 4–6 anchor the supporting boot to its position in the existing kick contact drawing; standing poses use the original neutral foot midpoint. Per-cell bounds and source filenames are in audit-v1.json. Existing art and originals are never destructively overwritten.

Shared roster fixes: standing normals no longer receive an extra procedural lunge/tilt, direction changes settle for three ticks before entering the opposite shuffle, block recoil begins immediately and differs by strength, and body-hit torso motion folds toward the hit instead of using the head-hit backward arch. Pilot cover poses do not receive a second procedural block squash.

Validation: 38 Move Viewer sequences each for Jez/Benny (3,678 timeline samples), crop bounds and decoded assets checked, 233 unique drawn cells inspected for border proximity (12 legacy cells have tight but nonzero margins). Six contrasting CPU rounds completed (Benny/Allan, Deathblow/Donald, Post/Jez; seeds 237 and 549), plus standard roster/CPU/combo/controls/offline tests. Screenshots reviewed for punch recovery and high/low heavy defense. Newly authored images are limited to the two pilots; shared mechanics and presentation fixes apply across the roster.

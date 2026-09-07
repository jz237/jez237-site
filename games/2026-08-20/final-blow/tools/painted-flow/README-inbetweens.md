# Jez and Benny painted transitions

Version 5.4.7. Additional drawings cover the unified stance/movement,
attack preparation/recovery, crouched/air attacks, reaction/get-up, dash/jump/
showcase and specials banks for Jez and Benny. Existing standing punch/kick
cycles from 5.4.6 remain in use. Canonical poses, move windows and hitboxes stay
unchanged; a presentation-only companion drawing precedes each eligible pose
for two simulation ticks, then settles. A held KO never cycles endlessly.

Some source poses already lack heads or raised hands. `REPAIRED_CELLS` in
`engine/inbetweens.mjs` makes their completed drawings persistent replacements,
so the damaged original cannot flash between new frames. Both canvas and
painted billboard renderers use the companion texture with canonical facing
and pose metadata. Frame count alone is not a quality measurement.

Generation: built-in imagegen **reference-image edit** mode, using the matching
original atlas. Exact prompts and source master filenames are in each asset's
JSON sidecar in `assets/inbetweens`. Originals stay in Codex generated_images.
Magenta masters are keyed and packed into 4x4 RGBA WebP atlases with clear cell
margins. Row and column cuts follow gaps between drawings rather than blindly
cutting the generated image into equal rectangles. Packed alpha area is matched to the old pose; runtime scale accounts
for safe-fit reductions on long limbs. New assets are loaded only for matches
containing these fighters, and availability is latched at pose entry.

Checks: selector tests cover settling, scope, late loads and persistent repairs;
browser probes check live sequence traces and rendering. Visual inspection is
required in addition to alpha-border checks: a head cut off inside an otherwise
empty cell margin cannot be detected by testing the outer atlas edges.

Validation: 192 packed cells passed nonempty-art and four-pixel clear-border
checks. Benny's repaired rows were inspected on an opaque backdrop to catch
neighbor fragments and internal head/hand cuts. Local sequence traces observed
all six companion banks for each fighter. Five browser probes passed, including
painted strike chains, demo render motion and the optional billboard renderer;
eight targeted unit/worker checks passed. This adds transition drawings around
existing key poses; it does not replace the game with continuous 3D animation.

Repack with `node tools/painted-flow/pack-inbetweens.mjs <master-directory>`
from this game directory, with Sharp installed or `SHARP_PACKAGE` pointing to
its package directory. The script also rebuilds `engine/inbetween-scale.mjs`.

# Acid hazard reference audit — September 21, 2026

Status: **partial reconstruction; complete original trajectories are not certified.**

Source: [World of Longplays / Ironclaw — Amiga difficulty 0](https://www.youtube.com/watch?v=Nfa2etJ84_8), existing local recording, 109.00–113.64s sampled every 0.16s. Reference frames and analysis stay outside the published game.

## Observations

- Five green puddles are visible in Intermediate. Their outlines change between overlapping lobes and wider ovals, with darker interiors and brighter rims. They are not rigid circular disks.
- Isolated puddles measure roughly 38–42 pixels wide in the recording. The former authored radius range of 1.1–1.4 exaggerated their size differences; these five now share a 1.2-unit base radius.
- The isolated lower-left puddle changes travel direction. Camera translation was estimated from the static scene with phase correlation; the following centers are aligned to the 109.00s frame. Subpixel centroids also shift with shape deformation, so these are observations, not an exact recovered motion law.

| Video time | Aligned center x | Aligned center y |
|---|---:|---:|
| 110.44 | 234.00 | 326.20 |
| 111.40 | 201.46 | 341.61 |
| 112.36 | 179.51 | 350.79 |
| 112.84 | 190.90 | 355.87 |
| 113.64 | 206.86 | 364.61 |

The first segment runs diagonally down-left in the image; the following segment runs down-right. On the isometric board these correspond to perpendicular directions. A single-axis sine cannot reproduce that turn.

## Implemented

- All acid uses a closed, deforming liquid surface shared by Three.js and Rapier. Concave outline notches remain empty in the sensor; no enclosing circular or convex hitbox fills them.
- Surface shape is sampled from the fixed simulation clock and interpolated for rendering. Shape storage is bounded, renderer buffers cannot mutate cached sensor data, and snapshot restoration invalidates only the optimization cache.
- Intermediate's lower-left puddle follows constant-speed straight legs with a right-angle turn. Its whole authored footprint is checked against the floor to avoid floating beyond edges or passing through refuge pyramids.
- Acid sound attenuation follows the actual current sensor position.
- Imported patrols move and rotate with their editor object and survive JSON round trips.

## Still open

The 0.64s deformation cycle, precise silhouette, height, dimensions, 1.45-unit patrol speed, phase, and complete rectangular return path are reconstructions. Only the directional turn above is established by this sampled sequence. Intermediate now uses grid-aligned patrol paths; all unobserved return legs, dimensions, speed profiles and phase alignment remain provisional. Ultimate retains provisional sine motion. Capture/dissolve animation now follows a sampled Ultimate death sequence (below); original sound effects and exact original AI/timing remain open.

Checks cover closed outward triangles, changing rendered vertices/indices matching the native sensor, empty-notch/actual-rim contact, grounded versus airborne contact, interpolation, deterministic restoration, editor transforms, and patrol floor clearance. Whole-course demos additionally check traversability; they do not prove fidelity.


## Follow-up: the other Intermediate puddles (mm-21)

Re-examined all 30 frames in the 109.00-113.64s sequence. Successive-frame
vertical registration uses neutral static stone/wall pixels, excluding green
puddles and the red marble. This avoids the earlier whole-frame correlation's
360px wrap after 112s. Residual sprite-centroid jitter and one- or two-pixel
registration uncertainty remain; these are approximate positions, not recovered
original world coordinates.

| Visible puddle / interval | Aligned screen centers | Evidence |
|---|---|---|
| Upper, 109.00 to 110.92 | (213.9,181.7) to (234.5,171.8) | Travel along the up-right board axis; small centroid variations reflect changing shape. |
| Upper-right, 109.80 to 111.24 | (345.4,243.8) to (317.0,226.7) | A straight up-left leg. |
| Upper-right, 111.24 to 111.88 | (317.0,226.7) to (304.5,236.4) | It turns down-left. |
| Upper-right, 111.88 to 112.36 | (304.5,236.4) to (317.6,241.3) | It then turns down-right. |
| Middle-right, 109.96 to 111.08 | (315.4,283.1) to (290.9,272.5) | Another up-left leg, parallel to the upper-right puddle during this interval. |
| Central isolated outline, 110.28 to 111.24 | (261.5,296.1) to (276.1,290.2) | Up-right travel; subsequent overlaps obscure individual identity. |

Merged green components have roughly twice or three times an isolated puddle's
pixel area. Their centroid must not be treated as the path of one puddle.
In particular, central identities and the complete upper-right return path are
not certified after the merges. The topmost puddle also scrolls out of view.

### Applied behavior and limits

All five Intermediate puddles now travel along the board's two axes. The four
former world-X/world-Z sine motions are gone. The upper-right path includes
successive perpendicular turns; the middle-right path includes its observed
leftward leg. The upper and central paths represent their visible axis travel.
Their unseen reversals/return legs are authored continuations, not claims about
the original AI. Speeds of 0.65, 1.15, 1.15, 0.85 and 1.45 units/s are provisional
relative choices; constant-speed interpolation does not reproduce every observed
pause or animation-dependent speed variation. Existing course dimensions are
also approximate, so pixel traces do not establish exact world placement.

The outermost 40-vertex ring of every puddle is ray-tested at 160 positions over
its complete patrol cycle. All outlines remain over flat track, outside the
refuge slopes. Vertex-based sensors, deformation, sound position and snapshots
continue to use the shared physical clock and actual moving position. This is
an incremental movement correction; complete acid behavior is still unverified.


## Acid capture and recovery - mm-22

Primary evidence: the same Ironclaw Amiga recording, 286.80-290.52s. The onset
was inspected at every 25fps frame from 286.80-288.36, with the complete sequence
sampled every 0.08s through 290.52. This is an actual Ultimate acid contact:

- Around 287.28-287.36 the patterned marble contacts the lower puddle and becomes
  largely solid red. It retains a full-height outline briefly.
- From roughly 287.56-288.20 its visible height and outline diminish into the
  puddle. Red speckles remain briefly; by approximately 288.36 they are gone.
  The marble's location follows the moving puddle during dissolution.
- Separate red pieces appear around 288.60 and converge near the lower-left
  exit. They form a complete patterned marble by about 289.80-289.88.
- The total capture/recovery interval is approximately 2.5 seconds. This is a
  sampled observation of one death, not a recovered timing table for all modes.

Implementation gives acid a separate 300-tick recovery state. A brief solid-color
reaction is followed by a shrinking spherical cap attached to the moving pool,
a short absence, and scattered solid sectors reassembling at the saved physical
respawn destination. The intact marble collider is disabled during capture;
the second player and both clocks continue normally. Timeout suppresses the
recovery display and prevents respawn. Saved capture state includes the pool,
relative contact position, rotation, start tick and destination, so pausing and
snapshot replay preserve the sequence. The cap never leaves a visible intact
sphere underneath the track. Generic shatter particles are suppressed for acid.

The existing designed bubbling cue replaces the generic break cue on acid
contact. It is not a recovered original acid sound. Exact colored-speckle
patterns, segment count, fragment flight, original safe-respawn selection and
cadence across difficulties remain reconstructed. Intermediate uses the same
response; an Intermediate-specific death sequence has not yet been compared.

Shared fragment texture coordinates now address each sector's portion of the
whole marble instead of repeating a whole texture on each piece. Vacuum return
rotations also converge to the respawn orientation, avoiding a final orientation
jump. These are geometric continuity corrections, not claims of recovered
original fragment trajectories.

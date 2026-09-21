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

The 0.64s deformation cycle, precise silhouette, height, dimensions, 1.45-unit patrol speed, phase, and complete rectangular return path are reconstructions. Only the directional turn above is established by this sampled sequence. The other four Intermediate trajectories and Ultimate trajectories retain provisional sine motion until their complete paths are measured. Capture/dissolve animation, original sound effects, and final original AI/timing remain open.

Checks cover closed outward triangles, changing rendered vertices/indices matching the native sensor, empty-notch/actual-rim contact, grounded versus airborne contact, interpolation, deterministic restoration, editor transforms, and patrol floor clearance. Whole-course demos additionally check traversability; they do not prove fidelity.

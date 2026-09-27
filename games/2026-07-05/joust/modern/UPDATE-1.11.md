# Modern Joust 1.11

The arena picker now preserves the full preview images, fits short desktop windows,
stacks on phones, and follows native link focus for keyboard selection. Reduced
motion and hidden tabs stop its ember animation.

The modern shell keeps the shared Retro simulation unchanged. It interpolates
positions between physics ticks, including across the horizontal seam, while
leaving scoring, collisions and flight physics authoritative in the engine.

## Changes

- Modeled basalt mountain ranges, animated skylight shafts, clearer color grading,
  restrained bloom, and a dark rock lava hand with glowing joints.
- Visible P1/P2 markers, contextual flight and lava warnings, and readable upcoming
  wave names.
- Arena clipping prevents duplicate riders appearing in widescreen margins.
  Wrap ghosts now share the same animation pose.
- Mouse/touch pause, resume, restart and quit controls; focus loss pauses play and
  clears held input. Touch controls capture pointers to avoid lost releases.
- Gamepad B flaps without also triggering restart. Hold Back to restart at a cost
  of one mount; Start pauses. Disconnect clears held inputs.
- Portrait options/help/achievement screens scale correctly, and wave selection
  has touch paging and corrected cell hit regions.
- Invalid/partial saves recover defaults while retaining valid progress. Rebinding
  rejects reserved or conflicting keys. Reset also restores options.
- Removed entities dispose their geometry/materials while retaining shared texture
  caches. Low quality releases post-processing buffers. High-DPI resolution is capped.
- Effects, achievement notifications and camera movement follow elapsed time.
  Background tabs stop drawing; pause freezes animation and physics.
- Attract mode advances completed waves. Returning to the title starts a clean
  arena. Restarting counts as a death for no-death and survival bonuses.
- The troll escape achievement checks a real player escape; decorative hands only
  target lava gaps, including correct exclusion of the central island.

## Verification

From the repository root:

```sh
node --test games/2026-07-05/joust/tests/modern-runtime.test.cjs
```

Nine tests cover save recovery, independent defaults, wrap/respawn interpolation,
and identical simulation outcomes at 30, 60 and 144 display frames per second.

For the browser suite, serve the repository locally, open the modern game in a
disposable local browser session, load `../tests/modern-browser.js` as a script,
then run `await runJoustRegression()`. It exercises real WebGL resource cleanup,
pause/restart, two-player input, controller button mappings, wrap poses, safe
platform handling and all three quality levels. It restores local progress and
does not submit leaderboard scores. All 22 checks passed, including 30 arena
restarts without GPU geometry growth after warming static scenery.

Also checked the picker at 1280×720/800 and 390×844, mobile touch flap and pause at
844×390, and portrait options at 390×844. No runtime errors were reported. The
existing vendored Three.js r158 script emits its pre-existing deprecation warning.
Controller input was simulated; physical rumble and real mobile GPU behavior were
not tested.

# Surf and rider immersion — v2.5.0

This release implements all seven accepted immersion suggestions and a 60% ramp preference for race rivals and smart-demo riders.

## Changes

- Offshore steep crests can form moving, overhanging lips and collapse into whitewater. The foam atlas preserves the aftermath; seeded post-crest chop is included in both buoyancy samples and rendered wave normals.
- Riders sample the water ahead and brace before impact. Existing articulated knees, hips and hands absorb landings; airborne counterbalance follows roll and roll rate.
- Sustained hard turns above planing speed progressively loosen stern grip. Releasing the turn or bracing restores grip over time and sheds a lateral splash; explicit sliding still releases the stern. Landing response continues to distinguish level, sideways, bow-first and stern-first entries.
- Engine pitch flares while the intake is airborne, then drops as it loads again. Intake re-engagement drives a stronger aft jet, with propulsion still requiring real water contact.
- In Big Surf, a cached coastal exposure map shelters waves behind land, steepens shallows and adds local chop in exposed areas. Timed course waves retain their authored amplitude. The renderer and pressure solver sample the same bilinear map.
- Droplets catch sunlight and cloud shadows. Denser spray briefly veils racers, while fine landing mist lasts longer and follows the shared gusts.
- Suitable natural shorelines have tapered driftwood, bank roots, stranded seaweed and layered rock rims. Small basins retain wave water and drain gradually. Industrial and icy venues retain their appropriate scenery.
- One deterministic random draw per racer/ramp/lap chooses an available ramp with probability 0.60. Availability requires a viable approach, legal buoy crossings and a wet bypass. Choices persist through the approach. The controller anticipates lateral momentum; late or unsafe approaches yield to normal racing navigation. Sunny Beach adapts its stunt ramp for racing, with a narrower deck and extra run-up beyond the preceding buoy. Constrained tide, pier, passage and ice-jump sequences retain their normal navigation.
- Optional ramp approaches and bypasses check the complete segment against pier supports, as well as terrain, obstacles and buoy legality.

## Controls

WASD / arrow keys and the existing phone controls are unchanged. Watch smart demo is on the title screen. Replay is optional; Space pauses it and Escape returns to the held race.

## Deliberate simplifications

Curling lips are supplementary surface meshes over the shared height field, not a fully volumetric liquid simulation. The exposure map approximates shelter with samples toward the prevailing swell. Basin retention and droplet light scattering are bounded approximations. A 60% preference applies per usable ramp opportunity, not an exact quota per lap; waves, traffic and narrow mandatory passages can alter an approach. Physical phones require separate device testing.

## Verification

All 360 automated tests pass across the final verification runs: the 353-test remainder, six course/championship checks, and the final nine-venue/four-class sweep. Ice/demo/immersion checks were repeated after the last navigation correction (28 passed). The full suite initially exposed route regressions; those were corrected before release.

The browser completed a three-lap Big Surf race in 3:48.383 with zero missed buoys, 42 checkpoint passes and 56 landings at 60 fps on the desktop test machine (Low graphics). Restart returned to lap one; replay pause/return preserved the held race. Wipeout and landing inspection also ran without game console errors. Shader, breaking-lip and shoreline geometry were reviewed visually.

An embedded game viewport was verified at 844 by 390 and 390 by 844; both demo layouts leave the water and riders unobstructed. This checks responsive layout on a desktop GPU, not physical phone performance. A browser tooling MutationObserver error appeared on the iframe review wrapper; the game source contains no MutationObserver and the standalone game checks reported no errors.

Review pages: source/surf-immersion-review.html, source/phone-layout-review.html, and race.html?verify=1. The site deployment guard passes with First Light v0.29.0 preserved. Live deployment is verified separately after publishing.

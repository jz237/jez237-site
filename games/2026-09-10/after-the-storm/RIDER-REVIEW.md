# TIDELINE 2.1 rider review

Independent implementation review, 2026-09-12. Scope: animation timing, articulated rider poses, material resources, detailed-rig integration and model/LOD regression checks. No race forces, navigation, course rules or demo pilots were changed by this review.

## Findings fixed

- **Render-rate-dependent weight transfer.** The animation used render-frame duration even when the 60 Hz simulation supplied an unchanged sample. Extra frames advanced the spring and understated acceleration-driven torso movement. Springs and acceleration now use elapsed simulation time; repeated, paused and inspection samples stay still, and clock resets discard old inertia. Slow frames retain elapsed spring time.
- **Stretched stunt anatomy.** Standing/somersault poses elongated upper arms by about 40% and forearms by about 34%. All stances now use the same fixed-length arm and leg IK. The upper body/pelvis adjusts to reachable positions, preserving handstand boot/grip anchors, backwards hand anchors and the complete somersault period.
- **Grips lagging the handlebars.** Body lean is spring-filtered, but handstand/standing palms must follow the actual bars. The detailed rig now keeps raw/explicit steering separate from filtered body lean, and those poses rotate their grip anchors with the bars.
- **Degenerate bend direction.** A pole exactly along an IK limb axis could collapse a joint onto that axis. The fallback now selects a perpendicular bend plane and bounds folded reach, avoiding stretched or non-finite joints.

## Verification

**24/24 scoped tests passed**, with no failures, skips or cancellations; `git diff --check` passed.

```sh
node --test tests/blender-model.test.mjs tests/rider-model.test.mjs \
  tests/rider-actions.test.mjs tests/craft-lod.test.mjs \
  tests/rider-animation.test.mjs tests/craft-materials.test.mjs \
  tests/blender-rider-runtime.test.mjs
```

Coverage includes repeated simulation samples at different rendering rates; long-frame spring equivalence; pause/inspection/reset behavior; braking and landing recovery; 600 ride/stunt combinations with fixed limb lengths; planted/rotating contacts; somersault return; real exported geometry/LOD bounds; shared immutable geometry/textures with independent rider skin and wetness; finite normal maps; and non-collapsed projected UVs on all principal surface directions. The production rig was loaded against the actual binary assets without a browser.

## Release integration

Release owner completed the follow-up: current speed, impact, trim, pause state and explicit steering are forwarded through the stunt rig's fourth update argument, while retaining `poseTime` for stunt timing. This keeps stunt wetness/material signals consistent with the seated rider. The release owner handles that renderer wiring, browser playtests, full-suite verification and publication separately.

No remaining blocker was found within the reviewed modules. Physical-phone performance and gamepad hardware were not evaluated by this code review.

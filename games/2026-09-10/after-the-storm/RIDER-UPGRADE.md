# TIDELINE 2.1 — rider and watercraft pass

## Reference research

The September 12 user reference is a modern realism target, not a screenshot of the original Nintendo 64 game. This release combines that equipment/material direction with the legible body mechanics of Wave Race 64. All geometry, markings and material patterns remain original.

Primary sources consulted:

- [Nintendo's original English manual](https://www.nintendo.com/eu/media/downloads/games_8/emanuals/nintendo_8/Manual_Nintendo64_WaveRace64_EN.pdf), controller functions and stunt/center-of-gravity sections: proportional handling, forward/rearward weight transfer, different jump trajectories, and standing/handstand/backward poses.
- [Nintendo's official 2022 re-release announcement](https://www.nintendo.com/us/whatsnew/wave-race-64-brings-surf-sand-and-speed-to-nintendo-switch-online-expansion-pack-on-aug-19/): four distinct riders, nine courses, changing conditions, and waves responding to both player and opponents.
- [Nintendo's re-release trailer](https://www.youtube.com/watch?v=eOZ-WuG7RF4), official promotional thumbnail visually inspected: sleeveless athletic racers, full-face helmets, strongly separated team colours, and compact readable silhouettes. Video download was unavailable; no claim of frame-by-frame animation analysis.
- [IGN's contemporary November 1996 review](https://www.ign.com/articles/1996/11/16/wave-race-64): tuning, wave contact, ramps, ice and the connection between visual water and craft response.

The lesson is visible weight transfer and a coherent rider–craft–water relationship, not reproducing low-resolution N64 geometry or copying Nintendo assets.

## What changed

- Original Blender rider: shaped exposed shoulders/upper arms/forearms, padded gloves and cuffs, compression folds, a close-fitting textile flotation carrier with segmented pads, shoulder webbing and colour panels.
- Original full-face composite helmet: sculpted chin guard, curved smoked visor, seals, vents, neck padding and original graphics.
- Watercraft: graphite upper deck, carbon-fibre inserts, moulding seams, recessed access hardware, detailed transom panels and tow eyes; existing saddle, traction, dashboard, pump and physical dimensions retained.
- Shared deterministic PBR surface microstructure for skin, woven fabric, composite panels and rubber. Wet rider materials respond gradually rather than changing abruptly. No external textures or paid runtime services.
- Simulation-driven animation: critically damped body lean, acceleration/braking weight transfer, forward/rearward trim, landing compression and rebound, airborne extension, load bracing and looking into a turn. Grip rotation remains immediate; feet remain planted; limb reach uses two-link IK.
- Closer race/demo cameras and a restrained field of view make rider motion legible. Existing camera collision clearance, stable horizon, orbit/zoom, water simulation, race rules and demo driver are retained.
- Both full and distant model exports rebuilt; asset, pose, performance and independent-review evidence recorded below after validation.

## Rebuilding the models

From this game folder, with Blender 4.5 LTS or compatible installed:

```
blender --background --python source/blender/build_jetski.py
blender --background --python source/blender/build_rider.py
node source/build-lod.mjs /path/to/meshoptimizer/index.module.js
node source/version-assets.mjs
```

Meshoptimizer 0.24.0 is an optional offline tool, not a runtime dependency. Builders emit editable `.blend`, interchange `.glb`, studio renders and material-batched browser geometry. Rebuild the ski before the rider because the rider's editable studio references the ski.

## Verification

- Independent reviewer fixed render-cadence-dependent springs, stretched stunt limbs, delayed grip rotation and degenerate IK. See [RIDER-REVIEW.md](RIDER-REVIEW.md).
- Full regression run: **296/296 passed**, no failures/skips/cancellations (217 seconds). After final review fixes, **37/37 focused tests passed**, including new animation/material/real-asset tests and camera coverage. These counts overlap; they are not added together.
- Dedicated hardware-accelerated Chrome on Radeon 8060S/Mesa: **11/11 scene launch/drive checks across nine venues**, zero game exceptions or missing game requests. Demo pause/resume and takeover passed. This is a short visual/drive pass, not a repeat of the previous release's complete 17-minute browser tour; all full demo scene completions remain covered by the regression suite.
- Split-screen independent steering/throttle, salvage movement/pause, and intentionally unavailable optional terrain/LOD assets passed browser checks.
- Short 1440×900 High-quality samples measured approximately **39–59 FPS** on this workstation. These are scene-dependent measurements, not a universal 60 FPS promise; adaptive graphics remains the default.
- Close model budgets: **82,208 ski / 115,780 rider triangles**; distant models: **28,069 / 40,024**. Full/LOD geometry and microtextures are shared across riders; skin/wetness materials remain independent.
- Touch: **390×844 and 844×390** browser-emulated viewports passed independent pointer ownership, Auto/brake precedence and pause/reset in calm Pelican Park. An initial rough-water attempt hit shore and correctly entered wipeout; the control test was isolated from collision physics. Physical phone/gamepad hardware was not tested. The local receipt is `source/rider-browser-verification.json`; public deployment verification is recorded separately after publication.

### 2.1.1 live framing correction

Live screenshot review exposed a desktop-only overlap between the closer craft and the old bottom demo panel. Wide-screen mouse layouts now use a compact top control bar, leaving the rider, stern and wake unobstructed. Phone/tablet tap-to-show controls are unchanged. No handling or animation logic changed in this layout patch.

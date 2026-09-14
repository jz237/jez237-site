# Water interaction · v2.4.1

This update extends the existing shared wave renderer and racing physics. It retains the larger seeded surf, occasional smooth water, wake jumps, shoreline wetness, scenery, underwater life and existing game modes.

## Changes

- Foam transfers from fresh whitewater into longer-lived bubbles and then clears. Close surfaces resolve streaks, broken edges and small bubble rings, fading that fine detail with distance.
- Additional displacement piles up at the bow and loaded outer chine, and creates a darkened turbulent hollow behind the stern. The CPU surface and water shader use matching contact profiles.
- A 96 × 96 wave-equation patch, covering 72 metres around the lead player, receives stern and landing impulses. Disturbances combine, propagate, reflect from rasterized static rocks, pier supports and dry ground, and decay at the outer edge. Rendering samples the same grid used by hull buoyancy. Existing analytical wakes still cover racers outside the patch.
- Moving gust bands drive water roughness, fine chop, foliage motion, foam drift, spray and a small handling force. Airborne craft receive more wind drift than hulls in the water.
- Race craft have independent wetness on painted panels, composite finishes, helmets and lenses. Small normal-mapped beads catch light, stream aft with speed, and leave patchy wet highlights after a splash. Wetness persists and dries over time.
- The unobtrusive **Replay** button appears after enough racing has been recorded. It selects a recent wave jump or close overtake, otherwise the last few seconds. A fixed camera position is selected near the shore with checks for scenery obscuring the start, middle and end of the clip. It pans toward the recorded racer without changing viewpoints. The live race, scores and clock stop until playback ends or you choose **Back to race**. Space pauses replay; Escape exits. Replays never start automatically.

Racing lines now establish the legal buoy side before crossing, brake ahead of dry banks during demos, and use settled approaches at the tight ice and city stunt sections. The demo estimates available airtime before requesting a flip; its existing long cooldown remains.

## Implementation limits

The local interaction is a bounded, damped height-field simulation in WebGL 2, not a full three-dimensional fluid solver. It uses static obstacle masks and a mean shoreline boundary; moving debris and tidal inundation continue to use the existing analytical and shoreline systems. The nearby patch is shared by the visible water and hulls at every quality setting; adaptive quality reduces rendering detail instead of changing race physics.

Replays retain ten seconds of sampled race and water history in browser memory. Poses and local water are interpolated; small spray particles and foam are reconstructed from the recorded motion. They are not video files, and reset when starting another race or coast. Water beads are a material effect rather than individually simulated liquid droplets.

## Review and verification

- `npm test` covers course completion, racing rules, championships, demo driving, stunts, salvage, water and rendering contracts.
- `tests/water-interaction.test.mjs` checks foam aging, hull contact, gusts, reflected and combined wave impulses, patch recentering, paused water, bead drainage, bounded replay storage and recording immutability.
- `source/water-interaction-review.html` provides close hood inspection, wet/dry comparison, hull contact and a held wave pulse beside a wall.
- `race.html?verify=1` exposes ordinary-input race verification and replay state diagnostics. Its test panel can be hidden during visual review. These controls are absent from normal play.

Phone viewport checks exercise the responsive interface in a desktop browser; they do not represent measurements on physical phone hardware.

Release validation: all 350 automated tests passed. A browser-driven three-lap race completed 42 gates with zero misses on Low at a landscape phone viewport; the local desktop browser reported 60 fps. Recorded playback paused, retained a clear view of the racer and water, and returned with unchanged race time, racer state and local-water version. Close hood beads and a held reflected pulse were inspected in the review scene.

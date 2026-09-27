# Reef motion review

The existing seven species are blue tang, golden butterflyfish (`semilarvatus`), clownfish, anthias, blue-green chromis, royal gramma and mandarin dragonet (`goby`). There are 21 individuals. This note reviews code behavior; biological findings belong in the accompanying sourced research notes.

## Findings in the starting implementation

- Tang and butterflyfish share a 0.47-unit cruise; anthias, chromis and gramma share 0.34. Every non-mandarin food pursuit shares a 1.2–1.9-unit speed. Size-relative speeds and species locomotor modes are absent.
- Gramma destinations are generic despite its shelter-oriented description. Butterflyfish destinations and speeds are identical to tangs. Both benefit from deliberate reef-edge inspections, whereas the gramma needs a remembered home and bounded excursions.
- Anthias/chromis have different spawning regions but almost identical ongoing steering. Alignment and cohesion weights of 0.15/0.08 are small relative to a normalized destination force. Social tests need to check group relationships rather than mere species labels.
- Only clownfish and mandarins use filtered angular velocity and curved trunks. Other species clamp yaw directly and keep the turn curvature at zero.
- Non-mandarin pectorals use `elapsedTime * currentFrequency`. Changing frequency after a long elapsed time jumps the fin phase. The mandarin's integrated `flutterTime` is the appropriate model for every paired fin.
- Generic hovering lasts until the progress watchdog decides the fish is stuck; intentional pauses should be distinguished from blocked travel.
- A bite updates the goal but does not clear the target or commit a bite/recovery state. On the next update another pellet may replace it. All consumption must continue to require actual mouth contact.
- MarineFinFlex's head-pinned wave and circular turn preserve the trunk and insertion continuity. Keep these and the CPU/GPU deformation agreement; avoid replacing them with whole-body rocking.

## Minimal architecture

Keep the existing collision, destination-clearance and committed-recovery machinery. Add one typed species-profile table for dimensionless body-length speed ranges, stroke/glide rhythm, fin contributions, social weights and habitat preferences. Give each fish continuous independent phase variables and local state for hunger, energy, a safe shelter and successful feeding memory. Species planning should choose a goal and motion mode; steering/collision and articulated posing should remain shared. Intentional inspections and shelter rests are not stuck movement. Refuge positions must be clear of solids, and food memory must never invent consumption.

## Meaningful verification

- Several seeded communities, long enough to see mode changes: bounded finite speed, upright continuous turns, no fish/solid overlaps and different individual histories.
- Dimensional comparison: normalize speed by each model's scale; distinguish slower near-reef inspection from open-water cruise and short food pursuit. Keep numeric rates labeled illustrative when not measured.
- Stationary/update-zero state: no phase, decision, hunger or food changes while paused.
- Long elapsed-time acceleration: integrated paired-fin phases advance smoothly; left and right fins remain attached and independently timed.
- Schooling: alignment improves from deliberately misaligned neighbors while separation is maintained; a nearby same-species group changes steering more than an unrelated species.
- Shelter/inspection: gramma returns to its remembered clear shelter after an excursion; butterflyfish pauses by the reef; clownfish keeps host returns; mandarin remains low and alternates actual rests with picks.
- Feeding: actual mouth contact, bounded pursuit, bite pause/clearance, no duplicate consumption, unavailable targets yield to recovery, distant remembered feeding sites do not remove food.

The existing `fish-navigation.mjs` already covers blocked routes, committed recovery while food exists, clownfish host visits and mandarin low feeding/rests. `fin-motion.mjs` covers pinned roots and deformation normals. Keep these checks; add behavior tests rather than restating profile constants. Rendered front/oblique motion and phone views remain necessary because headless geometry tests cannot establish visual believability.

## Implemented review checks

`species-motion.mjs` runs three seeded two-minute communities. It verifies finite, upright motion and spacing; different individual speed histories; real anthias station pauses/local excursions; gramma shelter association and returns; butterflyfish inspection pauses; zero-time stability even when decisions are overdue; and continuous independent paired-fin phases through acceleration after 200 seconds. A controlled counterfactual demonstrates that crosswise chromis neighbors affect heading more than unrelated fish at identical positions and velocities.

The new steep-food fixture exposed an actual capture failure: a blue tang could orbit a reachable pellet for 25 seconds without placing its snout on it. Seeking either a naive offset center or the pellet center while enforcing forward motion did not converge. The feeding-only correction brakes against the actual mouth-position error, permits small pectoral trim/reverse movements, and retains upright pose and swept collision rejection. The illustrative trim limits are 0.18 authored body lengths/second backward and 0.5 vertically; they are animation controls, not measured species data.

All six ordinary swimmers now pass horizontal, upward and downward mouth-contact captures (18 fixtures), bite-pause commitment and no duplicate consumption. The mandarin retains its separate terrain/contact-feeding regression checks. The new suite and existing `fish-navigation.mjs`, plus the reef TypeScript check, passed after this correction.

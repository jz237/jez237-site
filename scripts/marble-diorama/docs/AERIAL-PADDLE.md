# Recovered Aerial paddle and native airborne dynamics

September 22, 2026. **Local native-board implementation; public Aerial still
uses its earlier reconstructed paddle. Full parity remains incomplete.**

## Recovered behavior

Static inspection identifies subtype 10 at source cell **63,70**, height
**16276**, loaded across camera bands **20–34**. Actor script `0x1e4e` displays
graphic 22 and waits indefinitely. Contact redirects to `0x1e66`:

1. Wait 15 original updates.
2. Draw 22,23,24,26, one per update.
3. Wait ten updates, then draw 25.
4. Draw 24,23,22,21,22, one per update, then wait for another contact.

An independent bounded interpreter reads these script words and graphic tables
directly from the private resource. The JavaScript controller matches **1,000
updates**, including repeated contact attempts, completed strokes, unload/reload
and a new contact. Original resource binaries are not shipped in the build.

The contact handler `0x16adc–0x16bf4` requires both horizontal deltas strictly
between -8 and 8 source units, zero vertical velocity and a resting actor. It
centers the original marble, lowers its source height by three units and assigns
16.16 velocities: horizontal x in [-0.0625,0.0624847412], z in
[-2.9374847412,-2.3125], and upward velocity 10. Player state 3 holds for 15
updates; the release plays cue 11. The exact shared random state and paired
occupation response remain unported.

## Rigid-body implementation

An optional `paddleSequence` controls one `spring` / `flipper` part with
`native-paddle` motion. Its camera band, update rate, claimed player, queued
contact and random samples are snapshot state. The controller claims one
contact, ignores competing triggers while busy and resets on camera reload.
The new sequence requires native dynamics at the same update rate.

The existing rounded, recessed cup supplies the visible mesh and solid trimesh
collider. Reconstructed pitch levels interpolate across each original update;
both rendering and collision use the resulting rigid transform. At release,
the original velocity range becomes a physical spring impulse at the cup.
It preserves the actual marble position. A marble that left the cup during the
dwell cannot receive a remote impulse. The stroke emits one spring effect cue.

Using only the moving cup with the old Earth-gravity setting produced an
excessive, sideways throw on recovered terrain. Recovering the source gravity
and applying the source launch law corrects that mismatch. This is an explicit
spring impulse, not a claim that the cup's contact motion alone reproduces the
original fixed-point launch.

## Native airborne dynamics

Source `0x130f0–0x13106` subtracts **0x6000 / 65536 = 0.375** from vertical
velocity each original airborne update and clamps descent to **-5** source
units/update before position integration. `nativeDynamics` opts a course into
the corresponding Rapier gravity and player fall-speed limit:

- gravity = 0.375 × world units per source unit × update rate squared;
- maximum downward speed = 5 × world units per source unit × update rate.

At the current provisional 20 Hz / 0.1375-unit scale these are **20.625** and
**13.75** world units per second squared / per second. Existing public courses
remain at their existing gravity. The implementation preserves horizontal
velocity and angular motion when limiting descent. The 120 Hz rigid-body solver
still owns collisions and integration; it is not the original discrete solver.

## Verification

- Seven paddle regressions cover source frame/wait counts, velocity bounds,
  validation, loading, contact ownership, shared transforms, physical impulses,
  absence of remote launches and replay continuation.
- Three native-dynamics regressions cover scaling, source free flight, Rapier
  acceleration, terminal speed, retained planar/angular motion and snapshots.
- In a private recovered-board local start, loading occurs at band 20/tick 522,
  contact at tick 528, and the first supported landing at tick 949. The marble
  moves from y=6.14948 to the higher lane at y=9.40490, with one release cue and
  **zero falls through that landing**. Continuing without steering can roll off
  the lane; this is not a complete race or a no-input completion claim.
- Browser views confirm the cup before release, raised paddle and airborne
  marble, and first landing. The run is paused at 172.0 remaining with zero
  falls. No captured warnings/errors.
- Full suite: **270/270**, 281766.3894 ms. Build and diff checks pass.

## Remaining differences

The shared original random generator, capture/hold behavior, paired occupation
response, original cue assignment, cup dimensions and sprite-to-pitch mapping
remain incomplete. Actual triggers use supported contact at the visible cup,
not the original invisible rectangle. The source centering/height snap is not
applied. Continuous Rapier integration does not reproduce every original
discrete flight sample. Native wall-clock rate remains provisional; preserving
script counts does not establish original real-time cadence. Peg selection,
other actors, native edge rounding, full timed routes and publication acceptance
remain open.

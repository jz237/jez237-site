# Recovered campaign integration (mm-36, local)

The game entry point now uses `native-campaign.mjs` for the initial board,
course picker, campaign start, continuation and restart. Previously all of these
loaded `campaign.mjs`: the recovered terrain and actor implementations could
only be exercised by importing private audit fixtures into the editor.

This is an **integration milestone, not a complete parity release**. It is not
deployed. The public game still runs the older reconstruction. Do not deploy
this branch as a finished campaign until the missing encounters, routes and
visual regressions below are resolved.

## Included

`src/native-courses/*.json` are serializable course definitions containing the
recovered cell heights, navigation boundaries, camera loading bands and actor
configuration consumed by the existing shared rendering/collision code. They
contain no original executable, disassembly, bitmap or music payload. These
definitions package the previously validated fixtures; they do not constitute
new source verification of each mechanism.

| Board | Integrated mechanisms | Still missing or unverified |
|---|---|---|
| Practice | Changing training steps, original navigation and finish flags; [ten physical red rails](NATIVE-PRACTICE.md) | Numbered landing awards, alternate routes, contact calibration |
| Beginner | Changing terrain, two steelies, three slinkies, finish flags; [upper pipe and joined lower passages](NATIVE-PIPES.md) | Full routes; pipe timing, repeat awards, creature handling and original sound |
| Intermediate | Traveling wave, slinkies, acid patrols, finish flags; [orange pipe and bridge tunnel](NATIVE-PIPES.md) | Full routes, encounter timing and original sound |
| Aerial | Steelie, four hammers, six vacuums, three peg banks, paddle, finish flags | Full route, capture/launch calibration and encounter acceptance |
| Silly | Uphill response, nine miniatures, ten birds, red transfer, finish flags | Transit duration/exit calibration, full routes, complete scoring |
| Ultimate | Changing terrain, steelie, four slinkies, acid patrols, finish flags; [continuous gold transfer](NATIVE-GOLD-TRANSFER.md) | Gold housing fidelity, full routes and calibration |

Factories supply canonical IDs, category, course numbers, color palettes,
music cues, original difficulty clocks and finish rules. All six use native
airborne gravity; Practice previously omitted that setting. Silly retains its
uphill configuration. Goal presentation height follows the recovered flag base;
native terrain navigation, including region 255, still owns completion.

Definitions are cloned before use so editor/demo mutations cannot alter the
campaign templates. Course revision 100 and physics revision mm-36 isolate
records and replays from the older reconstructions. Original music still loads
from the existing bundled music system; this change does not certify listening
or effect parity.

The old constructors remain in `campaign.mjs`, `aerial.mjs`, `silly.mjs` and
`ultimate.mjs` for reference and regression coverage. Their route tests still
measure those older layouts, **not the recovered campaign**.

## Practice route and controls

Practice has separate authored waypoint sequences for the two original starts.
They descend the training area and reach the native finish through region 5.
This validates one route, not all banked reversals or bonus shelves. A
clearance/slope search provided the initial waypoints; actual
Rapier runs then validated the routes. Demo inputs remain bounded normal
controls and do not modify positions, velocities or navigation state.

The integration exposed a controller error: slope compensation always used
9.81 even when the simulation used native gravity (20.625). The controller now
reads the simulation's gravity. With the old compensation, a paired run could
leave one marble stuck against an uphill slope. With the correction, both finish
without falls. No player torque, collision shape or clock was increased to make
the test pass.

Normal-input measurements before the timed regression assertions:

- Solo: 4,425 simulation ticks (36.875 s), zero falls.
- Paired: both finished by 4,611 ticks (38.425 s), zero falls.
- The timed tests cover difficulty 0 and 7, solo and paired, and verify the
  transition into Beginner with reset clocks, score carryover and the first
  finisher's five-unit bonus.
- The actual browser's two-player Watch demo reached the result screen with
  both players finished, scores 1,533/1,534 and zero falls. Browser warning/error
  logs were empty. The six native entries appear in the course picker; Beginner
  loads from it with its unfinished demonstration correctly disabled.

Only Practice currently exposes Watch demo. Other native courses and Watch
campaign have disabled demo buttons with explanatory tooltips until their routes
are validated. Manual single-course and campaign play remain available locally.

## Acceptance still required

Integration validation: full suite **397/397** passed (284,811 ms). The final
focused native campaign suite passed **11/11** after preserving Intermediate's
existing cyan palette. The final bundle build and `git diff --check` passed.
The full suite includes legacy reconstruction tests as well as the new native
tests; its total is not a full-campaign parity claim.

- Complete Practice's numbered landing shelves and refine Ultimate's gold housing before publication.
  The mm-40 Practice rails are integrated with rounded shared collision geometry;
  its existing timed solo/paired routes still pass. See NATIVE-PRACTICE.md for
  original contact evidence and remaining calibration.
  The mm-39 gold fork now provides continuous physical travel through both exits,
  with source choice rules, localized solo/paired and replay checks. Full Ultimate
  routes, original housing fidelity and calibration remain open; see
  NATIVE-GOLD-TRANSFER.md for evidence and limits.
  Beginner's passages are integrated in mm-37; Intermediate's orange pipe and
  real bridge tunnel are integrated in mm-38. Their remaining source calibration
  and limited encounter coverage are detailed in NATIVE-PIPES.md.
- Test every course and alternate route with bounded controls, timed and paired.
- Correct native terrain presentation: the integrated overview still shows
  pointed outer foundations and insufficiently rounded silhouettes; title framing
  also makes Practice small. Do not reuse acceptance of the old dioramas for this
  geometry.
- Validate player capture, recovery, controller response, actor silhouettes,
  original timing, effects and all-cue audio listening.
- Run the full browser campaign, actual phone/gamepad and sustained performance
  acceptance before publishing the final playable campaign.

## Fixture provenance

Export inputs (SHA-256) at integration:

| Course | Input definition hash |
|---|---|
| Practice | `72f8c030978c7e0f8e4f0e8d4ef30cfadc7bc897bc4f07dd12bc8c55bf0026d1` |
| Beginner | `16e2a5a8f799531d41d0788dfd6f2ea990c8d33e3160b4cdb5417ee836736f29` |
| Intermediate | `b480430675ee0808fced7db48103e1abd13dcf0481faebf9c1d37ebbe9c2c6db` |
| Aerial | `5bf1b29f504ea4b4826d33d2af572e41e7454cdfc49f1c488368601dbce74080` |
| Silly | `99bc8ef1ed9b70cd90616294ea95922fee2c6b2f887c4c7b78ccc625cbb29a9b` |
| Ultimate | `43d3ee296ac3ac14b1ff01a05aabdb41ed81ee00d6c561b9122213f64bd516c4` |

See the individual `NATIVE-*.md` documents for mechanism evidence and limits.

# Control response calibration

Status: partial. The mm-28 change corrects an insufficient maximum acceleration;
it does not establish exact Amiga torque, friction, input curves or turbo ratio.

## Reference measurement

Primary source: [Ironclaw's Amiga recording](https://www.youtube.com/watch?v=Nfa2etJ84_8),
Practice opening at approximately 12.5-14.0s. The existing local 498x360, 25fps
copy was sampled at 10fps. Reference images stay outside the published project.
The 7.0s setup screen shows difficulty 0 and `Joy Stick`, just before the loading
transition. This identifies the selected device; it does not record held inputs.

The marble is stationary at the same screen position through the 12.9s sample,
then rolls across the upper field. Its red/yellow sprite was isolated from the
gray board with connected color components; annotated boxes were visually checked.

| Sample | Sprite center (pixels) | Sprite width |
|---|---|---|
| 12.5-12.9s | (234.5, 98.0) | 26 |
| 13.0s | (232.5, 98.0) | 26 |
| 13.4s | (206.5, 113.5) | 26 |
| 13.8s | (181.0, 146.5) | 25 |
| 14.0s | (174.0, 165.5) | 25 |

The fixed background has no camera scroll during this interval. Using the
largest observed width (26px), horizontal displacement alone is 2.33 diameters.
The full screen displacement is 3.49 diameters. The grid appears level along this
part of the opening; on a level plane, projection shortens ground displacement,
so 3.49 is a lower bound, not an exact reconstructed path length. We allow 1.2s
for the comparison, versus the 1.1s sampled interval, to be conservative about
sampling and movement onset. This is not an input recording: applied input,
turbo state, exact ground projection and full acceleration curve remain
unverified. Neither the video nor this test proves that a twofold torque change
exactly matches the original.

## Native control fixture

Run `node measure-control-response.mjs`. It settles the real rigid sphere on
level stone for one second and then applies ordinary full forward input. It
records displacement, speed, integrated rolling angle and contact error every
0.1s. No demo driver, course route, camera or time allowance affects this fixture.
The current output is `control-response-measurements.json`.

| Input / build | Distance at 1.1s (diameters) | Distance at 1.2s |
|---|---:|---:|
| Normal, mm-27 and mm-28 | 0.953 | 1.134 |
| Full turbo, mm-27 | 1.564 | 1.860 |
| Full turbo, mm-28 | 3.139 | 3.734 |

Even the old maximum input fell below the horizontal-only observed displacement.
The new turbo torque is 4.4 instead of 2.2. It clears the conservative 1.2s
screen-displacement check, while still falling short of matching the full
observed interval at 1.1s. Further projection/input calibration is required.
Normal torque remains 1.35, and top-speed envelopes remain 8/12 units per second.
The change is applied through grounded torque and native friction, preserving
airborne angular momentum and physical rolling. At 1.2s, translation and
integrated rolling differ by about 0.25%; contact error remains below 1% radius.

The initial mm-28 release kept the demo at half-strength turbo (2.2 torque).
The subsequent [demo steering update](DEMO-STEERING.md) uses up to 75% input on
firm track, while retaining gentler input on ice and before slow approaches.
It uses the same controls and simulation as the player; there is no separate
movement rule or positional correction. Replay/record version mm-28 separates
the stronger player response from earlier recordings.

The Aerial paddle fixture was checked at both half and full turbo. Both activate
the physical paddle and land on the intended upper platform without a death.
Half input peaks at y=13.893; full input takes a lower arc and lands near
y=13.079. The earlier test required an arbitrary 13.5 peak and incorrectly
rejected the latter successful flight. It now requires unsupported flight after
activation followed by actual supported contact in the upper landing footprint
at the correct elevation, at both input strengths.

## Why demo timeouts are a separate problem

Segment measurements on mm-27 found only 2.83s below 0.6 units/s in solo Silly's
71.52s traversal. Paired Silly took 64.46/66.70s with 1.34/5.47s at low speed.
Ultimate's solo 96.375s included 13.51s at low speed, with a substantial wait
before the disappearing entry. Thus waiting is material in Ultimate, but is not
the main explanation for Silly's time deficit.

Private experiments increasing the demo's broad-route speed factor from 1.6 to
1.8/2.0 reduced Practice by less than a second but made Silly slower, changing
its physical outlet selection. Combining a speed increase with later braking
also missed approaches and caused timeouts. Those experiments were discarded.
The broad-route speed and stopping-distance profiles remain unchanged; the
subsequent steering update changes input strength and grip anticipation only.
Do not infer calibrated human physics or full timed acceptance from a successful
demo, or change original clocks to cover a steering/geometry mismatch.

## Remaining calibration

- Recover the ground projection and map the complete opening trajectory in
  marble diameters, including local slopes and video sampling uncertainty.
- Obtain known-input original playback to separate normal, turbo and mouse
  responses; measure reversal, coasting, slopes, ice and collisions.
- Adjust physical control parameters from those measurements and retest all
  hazards, alternate routes, replay and timed campaigns.
- Improve demo planning separately, including crossing windows and selected
  Silly outlets; full timed solo and paired completion remains an open gate.

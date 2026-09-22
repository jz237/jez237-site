# Native camera state and terrain loading

September 22 implementation checkpoint. This optional state drives object
activation in recovered private courses. It does not yet replace the Three.js
view framing, implement catch-up relocation, or establish full camera parity.

## Source evidence

The original camera at 0xd320 chooses the minimum eligible projected vertical
coordinate on normal courses and the maximum on Silly. It checks an idle
camera every eighth update; a scrolling camera updates each time. Thresholds
128/184, distances 16/48 and speeds 1/2/4 come from executable data at 0x2349.
The speed is retained inside intermediate bands. In particular, the initial
speed is zero: approaching within sixteen pixels does not immediately select
speed one. Scrolling stops after crossing the separate 144/168 thresholds.

Eligibility requires active state 1, animation state 0, 1, 3, 4 or 5, and
excludes movement state 2 when the vertical velocity at player offset 8 is
nonpositive. Offset 8 is a velocity, **not terrain height**. When no eligible
player remains during a scroll, a retained synthetic leader coordinate lets
the existing movement decelerate. The source uses signed words for projected
coordinates and signed bytes for loading bands.

The scroll functions 0xcf98/0xd0a4 check bounds before stepping. A step can
therefore pass an endpoint by up to three pixels; clamping would change the
source behavior. At initialization, normal courses set relative offset zero;
Silly sets limit minus one and adds metadata offset 0x12 to absolute scroll.

The camera limits come from the background resource, not the terrain's row
count. Its PackBits decoder at 0x9118 expands the `.mlb` header. Initialization
0xd19a uses `(backgroundRows - 25) * 8`:

| Course | Background rows | Scroll limit | Initial scroll | Silly addition |
| --- | ---: | ---: | ---: | ---: |
| Practice | 75 | 400 | -16144 | — |
| Beginner | 145 | 960 | -16152 | — |
| Intermediate | 135 | 880 | -16176 | — |
| Aerial | 128 | 824 | -16152 | — |
| Silly | 143 | 944 | -16108 | 944 |
| Ultimate | 108 | 664 | -16168 | — |

Private compressed-resource hashes and reproducible decoding are recorded in
`native-camera-config-private.json` and `decode-camera-config-private.py`.

## Loading boundaries

Routine 0xd6c4 converts old/new absolute scroll to
`floor((scroll - metadataInitialScroll) / 16)` and invokes object loaders
only when that signed-byte band changes. Initialization supplies an artificial
25-pixel transition: normal courses enter band zero from -2; Silly enters
band 59 from 60.

The terrain actor loader 0xf7ea creates an absent actor when the **new** band
equals either end of its interval and the **old** band was outside it. It
removes a loaded actor when the old band equals an endpoint and the new band
passes that endpoint outward. Simply being inside the interval is not a new
creation event. Script removal also prevents a completed Practice ramp from
restarting while the camera remains inside its loading interval.

The private fixtures now use these recovered intervals:

- Practice starting ramp: 0..13.
- Beginner changing surface: 16..37.
- Ultimate streaming room: 24..48.

Unloading retains the last written terrain heights, consistent with the
render-kind-one removal path. Re-entry initializes the first state and restarts
the script. The original shared pool of 25 actors, duplicate-script checks,
random four-actor group spawns and other loader families remain unimplemented.

## Implementation and verification

Optional `CourseDefinition.nativeCamera` identifies its terrain part, source
tile origins, height origin/scale, initial scroll/offset, limit, direction and
update rate. The simulation maintains this state separately from render zoom,
viewport, orbit and quality. It advances before terrain controllers on the
fixed physics clock and is included in snapshots. A terrain sequence can
specify `activationBand` to use camera events rather than route eligibility.
Imports reject loading bands without a valid camera mapping.

The coordinate adapter reverses part translation/rotation and grid scale,
then projects source coordinates. It removes floating-point noise within
1e-9 of an integer before the original integer projection. All twelve
original starts round-trip to their recovered source coordinates and heights.
Six private two-player simulations verify initial activation and snapshot
restoration. Synthetic camera sweeps cross 291 individual bands across all
six extents; these are controller checks, not completed marble races.

Eight regressions cover projection/rotated mapping, both leader directions,
eligibility, idle cadence, retained speed, endpoint overshoot, no-player
continuation, entry/exit rules, one-shot removal/re-entry, snapshots,
30/60/120 fps and malformed imports.

Full regression suite: **241/241 pass**, 282660.0301 ms; build and diff checks
pass. Private local-start integration reaches Beginner's loading band 16 at
simulation tick 426 and Ultimate's band 24 at tick 618. All seven/four terrain
states follow, with zero falls during those checks. These timings use the
provisional 20-update rate and are not original-playback measurements. Browser
inspection of Beginner's camera-triggered surface runs without captured
warnings/errors and remains at zero falls through the observed 35-second span.

## Remaining acceptance work

- The adapter currently maps racing marbles to normal active source states.
  Native airborne/recovery/animation eligibility and two-pixel projection
  adjustments for particular sprite states need integration.
- Native update rate 20 and physical scale 0.1375 remain provisional; difficulty
  and the original frame-counter phase need playback calibration.
- Three.js view framing still uses its existing visual camera. Matching that
  framing to the gameplay camera requires aspect-ratio and landmark comparison.
- Catch-up destinations, occupancy checks, relocation/penalty/recovery and
  paired original playback remain open; no catch-up teleport is enabled.
- Ultimate's streaming cadence is still provisional. Other actors, rounded
  native edges, sound assignments and full timed course runs remain incomplete.

Public authored course definitions and mm-35 behavior are unchanged. Original
resource images and decoded course fixtures are not included in the release.

# Beach break — v2.18.0

September 27, 2026. Waves now break on the beaches: crests of the shared swell
steepen at each beach's break line, throw a lip, plunge and run up the sand as
whitewater, then drain back. It is purely visual: hulls, buoyancy, race rules,
records and the water surface itself are unchanged, and a race stepped with and
without the effect is bit-identical.

## Before

Beaches showed only a thin foam line where the swell met the sand, plus the wash
film. The curling-crest effect needed crests at least 0.28 m high with a slope
above 0.16 near shore, so in Venue conditions a 90-second Sunny Beach lap
produced no breaking waves at all.

## How it works (`beach-break.js`)

- **Shoreline.** 48 m tiles near the camera are scanned on a 2 m grid for the
  waterline, with each point's landward normal and nearshore slope. Walls,
  cliffs (slope above 0.65), rocks, enclosed pans and the city, port and glacier
  venues are skipped. Tiles rescan when the tide moves by more than 0.12 m.
- **Timing from the real swell.** Each visible shore point samples the shared
  surface at its break line (about 0.9 m deep) every 0.1 s. A new point first
  learns its local mean and set envelope from the previous 12 s. A breaker
  spawns when a crest peaks above 45% of that envelope, so breakers arrive with
  the visible swell, including Big Surf sets.
- **Size.** Height follows the crest, the coastal exposure map and whether the
  beach faces the dominant swell. Median breaker heights over a lap: 0.3–0.9 m in
  venue weather, 0.8–1.1 m in Big Surf and 1.6–2.0 m in Storm swell, capped at
  2.2 m. Lagoon and lake beaches stay small.
  Waves under 0.25 m spill without a visible curl.
- **Shape.** A 20–60 m ribbon follows the local waterline. Its cross-section
  runs from the trough up a concave face, under and over a thrown lip, and down
  the back. The crest steepens for 1.1 s, throws its lip (0.5 s plus 0.22 s per
  metre of height), plunges and collapses. The break peels along the beach when
  the swell arrives obliquely, or spreads both ways from a peak.
- **Whitewater.** The plunge explodes into a wide foam band. The bore then runs
  in at √(g·(slope·u + h₀)), where h₀ includes the bore's own height, leaves
  froth that erodes into lace, and swashes up to a bounded runup with a lobed
  foam edge before draining back. Foam needs water under it, so a trough that
  bares the sand stays dry.
- **Spray.** Pooled droplets burst from each plunge, shaded like hull spray.
- **Shading.** The breaker uses the ocean's own sky panorama, cloud shadows, sun
  glints, fog and foam colour. The thick lower face keeps the venue's deep water
  colour, and thin water near the lip transmits turquoise light when backlit.
  Close up, the ocean's capillary ripples stop the face reading as glass.
- **Coexistence.** The racing view turns off the old near-shore curls, since the
  beaches break here now; offshore curls are unchanged.

## Cost

- Up to 12 breakers on High, 8 on Medium and 4 on Low, each 1,386 vertices
  across two draw calls, plus one point draw for spray.
- Breakers are frustum-culled and left out of the refraction and mirror
  reflection passes.
- Empty whitewater pixels are rejected with cheap arithmetic before cloud and
  sky lookups.

CPU per frame, measured in Node over 60 s AI laps (before the final
column-spacing checks, which add one pass over 33 columns per spawn):

| Venue / sea | Mean | Worst frame | Frames over 2 ms |
| --- | --- | --- | --- |
| Sunny Beach, venue | 0.05 ms | 2.1 ms | 3 of 3,600 |
| Sunny Beach, Big Surf | 0.06 ms | 2.1 ms | 2 |
| Sunny Beach, Storm swell | 0.05 ms | 2.1 ms | 1 |
| Southern Island, Big Surf | 0.09 ms | 3.3 ms | 7 |
| Dolphin Park, venue | 0.09 ms | 2.9 ms | 20 |
| Twilight City, venue | 0.006 ms | 0.4 ms | 0 |

Per 0.1 s scan, at most four newly visible points learn their swell and at most
one breaker spawns. A frame that scans a new shoreline tile defers the crest
scan to the next frame.

GPU time could not be measured cleanly: another process kept the development
GPU at 99% utilisation during this work, and alternating runs varied by several
milliseconds. A final CPU rerun was also invalid, with the machine at 100% CPU
and a fixed loop running about ten times slower than usual. The page `source/wave-review.html` includes `benchPair()`, which
times rendering with and without the breaker meshes in one page, for a later
measurement on a quiet machine.

## Validation

- `tests/beach-break.test.mjs`: waterline detection, bore and runup physics,
  spawn rates and heights by sea state, no breakers in walled venues, breakers
  placed on the waterline, quality limits, shader sign safety, and bit-identical
  racing with and without the effect.
- Review views: `source/wave-review.html` adds beach, shore, along, pass,
  break and breaksea cameras, `?site=exposed`, time-lapse `sequence()` capture
  and `?beach=0`.
- The game (`race.html`) runs its demo with no console or shader errors.

## Limits

This is an animated surface effect, not a fluid simulation. The lip is a sheet,
not a water volume, and the shared water surface near the beach keeps its swell
under the effect. The salvage voyage (`index.html`) does not use it yet.
Split-screen breakers follow the first player's camera, like the other shoreline
effects.

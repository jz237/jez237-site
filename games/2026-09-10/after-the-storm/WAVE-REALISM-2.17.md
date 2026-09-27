# Wave realism — v2.17.0

September 26, 2026. Reshapes the shared wave model so surf, chop and storms
read as real water rather than rounded, glassy mounds. Rendering, buoyancy and
every hull still sample one surface.

## Findings

- Big Surf crossed three sine bands up to 83 degrees apart, producing an
  egg-crate field of domes instead of long-crested swell. Its harmonic term
  leaned every crest backwards: the back face was about twice as steep as the
  leading face (maximum slope 0.41 against 0.21).
- Each of the fourteen base bands had a steepness (ka) of about 0.015, so
  trochoidal crest sharpening was about 2%. Storm scaled every band by the same
  factor, so Storm swell stayed a taller rolling hill and whitecaps almost
  never formed.
- A ski moving backwards was pushed further astern: hull drag used
  `ratio**2`, which has no sign, and braking used unsigned speed. A demo
  rival that landed facing backwards reached 26 m/s with the throttle closed
  and the brake held, and was disqualified; one second of braking astern
  reached 39 m/s.

## Changes

- **Big Surf.** Swell sets arrive within 14 degrees of the dominant heading, so
  crests read as long lines. The shape follows Stokes second/third order from
  local steepness (sharp crests, broad troughs) with a steeper leading face.
  Heights, wavelengths, set envelopes and seeds are unchanged, and the slope
  distribution is unchanged (99th percentile 0.53 before and after).
- **Wind sea (Wind chop and Storm swell).** The 5–23 m bands gain height with
  the square of the wind, as a fetch-limited sea does. At Storm swell their
  steepness reaches about 0.08 (previously 0.03); Wind chop reaches about
  0.036. Their crests lean forward, and bands without trochoidal displacement
  add the Stokes second-order term. Venue conditions and Big Surf keep the
  calibrated base bands bit for bit (0 differences in 11,880 CPU samples):
  course routes, timed crossings such as the Fortress ridge, championships and
  ranked records depend on that surface. The scripted routes proved chaotic
  enough that a 6% change, or even rounding differences from an equivalent
  formula, changed which rider clipped a shoal.
- **Whitecaps.** Compression of the trochoidal surface (1 − det J) marks the
  steepest crests. They show as spilling caps and seed the foam history, so
  patches trail downwind. Crest compression passes the threshold on about 6%
  of the surface in Storm swell, 1.5% in Southern Island's late-race storm,
  0.2% at Marine Fortress, 0.1% in Wind chop, and none in light venue weather.
- **Inverse queries.** With the wind sea, hull height queries use three Newton
  iterations on the trochoidal map instead of four fixed-point steps. At storm
  0.95 the worst CPU/GPU height mismatch is 0.003 mm (the fixed-point path
  reached 1.1 mm) at the same cost (2.16 against 2.21 µs per query in Node).
  The GPU foam simulation always uses the Newton inverse.
- **Far-field filtering.** Each band fades where the warped water mesh has
  fewer than about 2.8 vertices per wavelength, removing geometric aliasing
  as the mesh follows the rider. Unresolved wind sea widens distant
  reflections and sun glints instead.
- **Reverse physics.** Hull drag now always opposes motion. Braking keeps its
  established slow reverse, which scripted routes use to hold position, but it
  no longer drives a ski astern beyond about 7 m/s.
- **Verification driver.** The Twilight stunt driver kept its dive flag after
  landing, so any later hop off a crest triggered a dive. The flag now clears
  with the ramp flag.

## Validation

`npm test`: 421 of 424 pass. The three failures are rider-model runtime tests
that fail identically on the unmodified v2.16.0 checkout (the detailed rider
assets do not load in this Node environment). `tests/wave-realism.test.mjs`
adds seven tests; the reverse-physics test fails on the old code.

Browser checks on local Chrome with a desktop GPU: the game and review page
compile every water shader without errors, the Sunny Beach demo races in Big
Surf, and before/after captures cover Big Surf, Wind chop, Storm swell and
venue conditions at Sunny Beach, Southern Island and Marine Fortress.

Render cost from `bench(240)` on the review page: foam update, reflection,
refraction and main passes, waiting on the GPU, at 1024 × 768, Sunny Beach.
Six alternating runs per build on one development machine:

| Sea state | v2.16.0 median | v2.17.0 median |
| --- | --- | --- |
| Big Surf | 5.69 ms | 5.78 ms |
| Storm swell | 5.50 ms | 6.20 ms |

Storm swell costs about 0.7 ms more because more crests break into curls,
spray and foam. These are regression checks, not physical-phone measurements.

`source/wave-review.html` renders any venue and sea state from fixed cameras at
a fixed time for before/after comparison, counts shader compile errors and
refuses to capture if any occur. It is a development page and is not linked
from the game. `tests/wave-realism.test.mjs` covers the new behaviour,
including a check that generated shaders never contain a sign followed by a
negative constant (`--0.24` compiles as a decrement and removes the water).

This remains an analytic surface, not a fluid simulation. Waves do not
overturn into water volumes, and whitecaps are surface foam.

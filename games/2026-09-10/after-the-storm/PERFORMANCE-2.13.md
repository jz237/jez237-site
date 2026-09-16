# Loading and responsiveness — v2.13.0

The full-resolution craft and rider meshes now travel as losslessly compressed,
content-addressed files. Browser DecompressionStream restores the original bytes;
older browsers and failed/corrupt packed downloads use the original assets.
Four craft/rider buffers shrink from 19,157,832 to 3,843,214 bytes (79.9%). Pine
geometry also uses this path. Original editable assets remain available.

The sky and granite textures use lossless WebP at their original dimensions.
Decoded RGBA pixels were compared byte-for-byte against both original PNGs.
Those two downloads save another 1,343,452 bytes. Other textures, mipmaps,
water shaders, physics rates, model resolution and graphics presets are unchanged.

Module preloads expose each page's actual static dependency graph at parse time.
LOD, main geometry, tree textures and granite no longer wait for unrelated loads
in the same module. The racing and salvage pages retain separate dependency graphs.

The active course world is reused on starts/restarts with the same venue, class
and layout. Race/time-trial/versus share geometry, while stunt/free-ride layouts
remain distinct. Course changes dispose the prior world; this is not a growing
multi-course GPU cache. Race state, foam, spray, rings and effects reset normally.
Redundant initial environment captures are removed. Replay captures remain 20 Hz,
but water snapshots are now only allocated for accepted frames instead of 60 Hz.
Split-screen HUD nodes are reused; unchanged speed/rank/power markup is retained.

## Measurements

Local Chromium, same machine and Medium settings, instrumented through `?verify=1`:
- Already-loaded Sunny Beach start: 200.7 ms before; 16.8 ms after.
- Subsequent restart: 5.2 ms after; scenery reset 0.3 ms without a rebuild.
- Local module-ready: 358 ms before; 259 ms after.
- Local scene-ready: 897 ms before; 635 ms after.
- Mobile-size 390 x 780 demo: 60 fps, frame p95 16.8 ms, CPU p95 14.3 ms.

These are local desktop measurements with a phone-sized viewport, not a benchmark
of a physical phone or throttled cellular connection. Download byte reductions
are exact; wall-clock loading depends on cache, connection, CPU and GPU shader
compilation. The first rendered frame still has GPU compilation/upload work.
The optimized first-frame diagnostic measured 1,435 ms locally.

## Verification

45 targeted tests passed, including model byte equivalence, streaming inflation,
legacy fallback, corrupt-download recovery, course/layout cache identity, replay
capture cadence, graphics budgets, scenery placement, demo driving and hull/wave
interaction. Browser checks covered initial load, departure, pause/restart,
venue change, phone-size demo, instant replay return and split-screen HUD.

Regenerate packed geometry with `python source/pack-assets.py` after changing
original model buffers, then run `node source/version-assets.mjs` after source
changes. Hashed compressed filenames prevent stale geometry cache reuse.
The original PNGs and full model buffers are retained for editing/fallback.

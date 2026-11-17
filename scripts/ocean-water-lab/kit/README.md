# Water Kit

Real-time ocean for games. The kit has two wave models that share the same shading, foam and physics interfaces:

- **FFT ocean**: Tessendorf-style inverse FFT over four cascades, from 600 m swell down to 5 cm ripples. Physics reads the rendered surface back from the GPU.
- **Analytic sea**: 64 trochoidal (Gerstner) waves taken from the same ocean spectrum. The CPU evaluates exactly the surface the GPU draws, with no read-back and no render targets for the waves.

Open `demo/index.html` in a browser to see it running. The demo uses the FFT ocean and falls back to the analytic sea on devices without 32-bit float render targets (add `#gerstner` to the URL to force it).

The demo also has seven game-look scenes, about 90 parameters on its Advanced tab, and an Export tab. Export writes the current look as JSON, as the exact kit uniforms, or as the closest Unity HDRP, Unreal Water and Godot settings.

## What is in the box

| File | What it does |
|---|---|
| `glsl/fft/water_fft.glsl` | FFT pass logic: JONSWAP + swell spectrum with directional spreading, time evolution, Stockham butterflies, unpacking. Each pass is a function of one texel |
| `glsl/fft/fft_*.frag` | Fragment-shader wrappers for the four FFT passes and the physics query (WebGL2 / OpenGL) |
| `glsl/fft/water_cascades.glsl` | Sampling the FFT result: displacement, normal, Jacobian, filtered roughness, foam, height, caustics |
| `glsl/water_waves.glsl` | Analytic wave sum: displacement, normals with per-wave anisotropic filtering, Jacobian, caustics |
| `glsl/water_shading.glsl` | Shared surface shading: rough-sea Fresnel, GGX sun glitter, depth absorption, crest glow, foam texture, gale streaks, rain rings |
| `glsl/ocean.vert`, `ocean.frag` | Reference material for either model: refraction, sky and planar reflections, foam, haze |
| `glsl/water_surf.glsl` | Breaking surf on any coastline from a depth function: shoaling (Green's law), breaking at a breaker index, crests leaning and throwing a lip, streaky breaker foam |
| `glsl/water_weather.glsl` | Sea-surface weather: rogue wave groups that focus as they pass, gust fronts (cat's paws) roughening patches of ripples, Langmuir slicks (glassy lanes along the wind with foam lines) |
| `glsl/ripple_sim.frag`, `foam_sim.frag` | Interactive ripples and persistent foam on camera-following textures. Foam has two channels: whitecaps (r) and longer-lived wakes and splashes (g) |
| `hlsl/*.hlsl` | HLSL versions of the six `.glsl` libraries, generated from them, same function names |
| `js/water_fft.js` | WebGL2 host for the FFT ocean: textures, passes, sea-state statistics, whitecap calibration, asynchronous read-back |
| `js/water_waves.js` | Analytic sea: builds the wave table, samples it, computes buoyancy |
| `cpp/WaterPhysics.h` | C++11: analytic sea, buoyancy against any water source, and `WaterPatch` for FFT read-backs |
| `csharp/WaterPhysics.cs` | The same in C# |
| `tests/` | The checks listed under "What was verified" |

## How the FFT ocean works

1. **Spectrum (when the sea state changes).** `water_fft.glsl` builds a directional spectrum: JONSWAP for the wind sea, scaled to the significant wave height for the wind speed and fetch, a narrower JONSWAP for swell, and `cos^2s` spreading. Gaussian noise fixed by the seed turns it into initial amplitudes h0(k), once per cascade.
2. **Every frame.** Each cascade is advanced to the current time and expanded into eight real fields (height, sideways displacement, slopes, the displacement Jacobian). These are packed two per complex number, run through log2(N) butterfly passes per axis, and unpacked into three mip-mapped texture arrays: `disp` (Dx, Dy, Dz, foam), `deriv` and `mom`.
3. **Four cascades.** The tiles are 1024 m, 128 m, 16 m and 3 m. Each tile keeps one band of wavelengths, so together they cover everything from swell to ripples without repeating visibly.
4. **Filtering.** A mesh vertex reads the mip level that matches its spacing. A pixel reads with hardware anisotropic filtering. The `mom` texture stores squared slopes, so the slope variance the filter removed comes back as roughness, LEAN-mapping style. Distant water glitters correctly instead of aliasing or turning to mirror.
5. **Whitecaps.** Foam forms where the breaking-scale cascades compress the surface (Jacobian below a threshold). Coverage follows the Monahan & O'Muircheartaigh wind relation. `calibrateFoam()` measures the threshold on the actual surface.
6. **Physics.** `fft_query.frag` writes height, water velocity and acceleration on a 5×5 grid around each floating body, using three frames of displacement. The host reads it back asynchronously (one or two frames old). `WaterPatch` / `samplePatch` moves the data forward to the physics time, and the buoyancy model runs on it: Archimedes lift, Froude-Krylov force and drag.

Per-frame GPU work: 4 cascades × (1 + 2·log2 N + 1) full-screen passes over N×N texels, plus mip generation. N is 256 on "High" and 128 on "Low".

## Quick start: FFT ocean in WebGL2

```js
var ocean = new WaterFFT.Ocean(gl, { size: 256, shaders: { header, fft, cascades, spectrum, evolve, butterfly, assemble, query } });
ocean.setParams({ windSpeed: 9, windDirection: 0.6, swellHeight: 0.6 });
ocean.calibrateFoam();                                    // when the sea state settles

// every frame
ocean.update(time, dt, originX, originZ);                 // origin = camera xz snapped to your mesh grid
ocean.bind(material, firstTextureUnit);                   // sets the three arrays + cascade uniforms
ocean.runQueries([{ x, z, half, filter, owner }]);        // physics read-back
ocean.poll();                                             // delivers results to opts.onPatches
```

In the material, include `water_cascades.glsl`, then call `waterDisplaceFFT()` in the vertex stage and `waterDetailFFT()` in the fragment stage. `glsl/ocean.vert` and `ocean.frag` with `#define WATER_FFT` show the full wiring. `demo/index.html` is a complete single-file example.

## Quick start: analytic sea (any engine, CPU-exact)

```
startup        sea.generate(params)
physics step   sea.advance(dt)                      // or sea.setTime(t) for lockstep multiplayer
               sea.buoyancy(points, velocities, ...) -> apply each force at its point
frame          sea.packForGpu(originX, originZ)     // upload gpuA, gpuB as two vec4[64] arrays
vertex         world = rest + waterDisplace(rest - origin, 2.0 * spacing, depth)
```

Choose the analytic sea when you cannot run render-to-texture passes, when you need deterministic physics without GPU read-back (for example lockstep multiplayer), or on very low-end hardware.

Conventions for both models: Y up, waves in the XZ plane, metres, seconds, radians. Shader positions are relative to the wave origin, which keeps precision far from the world origin.

## Engine notes

These follow each engine's documented conventions. They were not run inside the engines.

**Unity.**
- **FFT passes.** Port the four passes to a compute shader (one thread per cell) or run them as `Graphics.Blit` into RenderTextures. Use RGBA32F for the FFT ping-pong, and RGBA16F Texture2DArrays with mips and anisotropic filtering for the outputs.
- **Material.** Include `WaterCascades.hlsl` and `WaterShading.hlsl` in a URP/HDRP shader, then set `_WaterCascade` and `_WaterOffset` with the same values `WaterFFT.Ocean.bind()` uses.
- **Physics.** Run `fft_query` into a small RenderTexture and fetch it with `AsyncGPUReadback`. Copy the result into `WaterPatch` and call `WaterPhysics.Buoyancy(patch.Sample, ...)` in `FixedUpdate`.
- **Analytic sea.** Use `WaterWaves.hlsl` with `Shader.SetGlobalVectorArray("_WaterWaveA", ...)`.

**Unreal.** Z is up and units are centimetres: pass `WorldPosition.xy * 0.01` as the position, and use `float3(d.x, d.z, d.y) * 100` as World Position Offset. Run the FFT passes as Render Graph compute passes, or with Niagara grid modules. Read the query back with `FRHIGPUBufferReadback` and apply forces with `AddForceAtLocation` (newtons × 100).

**Godot 4.** Y up and metres already match. Paste the GLSL libraries into `.gdshaderinc` files. Run the FFT passes with `RenderingDevice` compute or with SubViewports. Godot .NET can use `WaterPhysics.cs` directly.

**Custom engines (OpenGL, Vulkan, WebGL2).** Use the GLSL as is. In Vulkan or Metal, the pass functions map directly onto compute kernels.

## Tuning

| Parameter | Effect |
|---|---|
| `windSpeed` | Sea state. 3 m/s is a ripple, 9 a moderate sea, 14 rough, 21 a gale. Sets wavelength, height and whitecaps together |
| `fetchKm` | How far the wind has blown. Smaller values give shorter, steeper waves for the same wind (lakes, bays) |
| `choppiness` | Sideways motion. 1 gives sharp crests; about 1.3 and above, crests start to loop |
| `swellHeight`, `swellLength`, `swellDirection` | Long waves from a distant storm, independent of the local wind |
| `spreadScale` (FFT) / `spread` (analytic) | Higher values line the waves up into long crests |
| `detailScale` | Strength of the ripple cascades |
| `foamAmount` | Multiplier on whitecap coverage |
| `seed` | A different sea with the same statistics. The same seed gives the same sea on every machine |

Water colour lives in `WaterMaterial`: `extinction` (per metre, per colour), `scatterColor`, `sssColor`, plus `specular` (sun-glitter gain, 1 = physical).

`ocean.frag` reads a few artistic gains that are all 1 for the physical result:

| Uniform | Components |
|---|---|
| `uLook` | reflection gain, sun-glitter gain, refraction bend, foam brightness |
| `uSurf` | surf height in deep water (m), period (s), breaker index (0.78 is typical), shore-foam gain |
| `uSurfFoam` | foam trail (fraction of a wavelength behind each breaker), streakiness 0..1, texture scale, lingering foam 0..1 |

**Surf.** Define `WATER_SURF`, include `water_surf.glsl` and provide `WATER_SURF_DEPTH(p)`. Call `waterSurf()` in the vertex stage for height and push, and in the fragment stage for the normal and `waterSurfFoam()`. The same formula in JavaScript (`surfHeight` in the demo) adds the surf to the physics height, so things float on the breakers.

**Tide.** The demo lowers the land by the tide rather than raising the sea (`uTide` in `terrainHeight`), so the sea stays at y = 0 and the reflection plane, the grid and the physics need no changes. In an engine, moving the water plane up does the same job.

**Weather.** Define `WATER_WEATHER` and include `water_weather.glsl`.

- **Rogue waves.** `uRogueA` / `uRogueB` describe one wave group: its centre, direction, crest height, wavenumber, carrier phase and length. The host moves the centre at the group speed and advances the phase by half the wave frequency, so crests run through the group as they do at sea. The demo aims each group at the camera and lets it focus to full height there. `rogueHeight` in the demo is the same formula for physics.
- **Gust fronts** (`uGust`) multiply the slopes of the small ripples only, leaving the large waves alone, so dark rough patches race downwind across an otherwise even sea.
- **Slicks** (`uSlick`) do the opposite: smooth, glassy lanes along the wind, with foam lines collecting in them.
- **Bioluminescence** (`uBio`) is a colour times the foam coverage, added after shading. The demo fades it in after sunset, so wakes, breakers and whitecaps glow.

The demo adds the effects that live outside the water shader: rain streaks, splashes and distant rain curtains, drops on the lens, spindrift blown off the crests in a gale, and lightning with forked bolts.

**Wakes.** Foam splats with a negative amount go into the wake channel, which decays with its own lifetime (`uWakeDecay`). The demo's speedboat lays the prop wash, the hull corners and the two arms of the Kelvin wedge (19.5° either side of its track) into it every frame.

The demo's scene looks, water bodies and every parameter range are in `demo/index.html`; search for `OceanParams`.

## What was verified

- **FFT against a direct sum.** The GPU FFT output was compared with a direct CPU sum of the same spectrum at 40 points per cascade. Heights, displacements, slopes and Jacobian terms agree to within the 16-bit float storage (largest error 0.9 mm on 1.6 m waves). Measured RMS wave height matches the spectrum's to within sampling noise (`tests/fft_check.mjs`).
- **Whitecaps.** After calibration, measured whitecap coverage matches the target within about ±25% across sea states (2.0% against 1.9% in a rough sea, 7.6% against 6.3% in a gale).
- **Physics.** Floating objects stay at their waterline through instant sea-state changes. A crate's centre sits within 1 cm of the read-back surface height, and the asynchronous read-back path runs in the real frame loop.
- **Analytic sea.** GPU and CPU heights agree to under 1 mm in a 2 m sea and under 1 cm in a 6 m gale. The C++ port matches the JavaScript reference to 5e-13 (`tests/crosscheck.*`). `WaterPatch` sampling and buoyancy were unit-tested in C++.
- **HLSL.** All six libraries are generated mechanically from the GLSL and type-checked with clang's HLSL front end. They have not been compiled with FXC/DXC or run on a Direct3D device.
- **Surf, tide, weather, wakes.** Checked by eye in a software renderer, from above the breakers and at water level, and with debug views of breaking and phase. The JavaScript surf and rogue-wave heights use the same formulas as the shaders, but have not been compared numerically against the GPU.
- **C#.** Ported by hand; no C# compiler was available, so it has not been compiled.
- **Performance.** Only measured on a software renderer: about 13 fps at 800×500 on High, on a CPU. Frame rates on real GPUs were not measured.

## What it does not do

- Waves that curl into a closed tube. The surf leans and throws a lip, but the surface never folds over itself
- Wave refraction around headlands. The surf always arrives straight up the depth gradient
- Screen-space or ray-traced reflections. The demo has sky reflections plus a planar mirror pass for nearby objects. Reflections of objects seen through steep waves are approximate
- Shadows cast onto the water surface itself, underwater light shafts
- Rivers and flow maps
- A true dispersive Kelvin wake. The demo boat draws the wedge with foam and the ripple buffer, which is a plain wave equation
- Collisions between floating bodies (the forces are meant for your engine's rigid bodies)
- A volumetric fluid solver: water cannot pour, fill or flood

## Sources for the formulas

- FFT ocean method: Tessendorf, "Simulating Ocean Water", 2001
- JONSWAP spectrum and fetch relations: Hasselmann et al. 1973
- Directional spreading: Mitsuyasu et al. 1975 / Hasselmann et al. 1980
- Whitecap coverage against wind speed: Monahan and O'Muircheartaigh 1980
- Sun-glitter slope statistics: Cox and Munk 1954
- Fresnel reflectance of a rough sea: Bruneton, Neyret and Holzschuch 2010
- Sky: Hillaire, "A Scalable and Production Ready Sky and Atmosphere Rendering Technique", 2020
- Slope-variance (LEAN) filtering: Olano and Baker 2010
- Random numbers: mulberry32 by Tommy Ettinger (public domain)

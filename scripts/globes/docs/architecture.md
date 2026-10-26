# Globes — architecture

A glass sphere of water, simulated on the GPU in real time and rendered with three.js
(WebGPU), in a browser or as an Electron desktop app. The app shows one globe of the
collection at a time, in the deep ocean, with a pair of arrows under it (or the arrow keys) to
move through the collection; in Electron, an icon puts the globe on the desktop. Controls:
click-drag on the globe to tilt it left/right; Ctrl-drag to spin it, or lean it towards or away;
wheel/pinch to zoom; a right-click drops fish food into the koi's and the reef's globes; the
pointer stirs the water around the globe. Hardware GPU only.

## Running

- `npm run dev` — Electron window; Vite runs in-process (HMR). `?stats` in `GLOBES_QUERY`
  logs fps/substeps to the console.
- `npm run web` — plain Vite in a browser (needs a browser with real WebGPU). With hardware
  ray tracing: a browser that offers `chromium-experimental-ray-query` to the page's origin
  (Chromium or Brave built with https://github.com/willwaltz/webgpu-ray-tracing, launched with
  the dev server's origin in its list).
- `npm start` — production build, loaded from `dist/`.
- The website: `npm run build` makes it in `dist/`, static files with relative paths, so it can
  be served from anywhere (live at https://globes-nine.vercel.app). In a browser there is no
  Electron bridge, so "Add to desktop" is hidden. Touch devices with a small screen get a
  lighter globe (48³ grid, one ray per pixel, pixel ratio 1; `?res=`/`?aa=` override it).

Electron flags (electron/main.mjs): `enable-unsafe-webgpu`; WebGPU runs on Dawn's Vulkan
backend. Do **not** enable Chromium's `Vulkan` feature / ANGLE-Vulkan: its Vulkan compositor is
unsupported on Wayland and the window stays black (XWayland fails to create the surface too).
`GLOBES_DEBUG_PORT` exposes CDP for automated testing; `GLOBES_HIDDEN=1` runs a hidden second
instance. In dev, `window.__globes` exposes sim/controller/renderer and `tick(dt)`; `?manual`
stops the animation loop from stepping the sim so tests can step it deterministically.

## three.js integration (r186)

- Our own `GPUDevice` → `new WebGPURenderer({ device })`; the solver's raw WGSL compute is
  submitted on the same queue before `renderer.render()`.
- The water density is an `rgba16float` 3D texture owned by the solver, wrapped with
  `ExternalTexture` (`is3DTexture = true`) and sampled in a `wgslFn` via `texture3D(...)`
  (same node passed for the texture and sampler parameters).
- Helpers go in a `wgsl()` CodeNode include; names are prefixed `globes_`.
- Background: `scene.backgroundNode = fn({ dir: normalize(positionLocal), ... })` (the
  background sphere is centred on the camera, so its local position is the view direction).
- Pitfall: `queue.writeBuffer` lands before the command buffer runs, so per-substep
  uniforms are written + submitted per substep.
- Pitfall: three.js binds no sampler for a texture whose min and mag filters are both
  `NearestFilter` (it treats it as unfilterable), so a `wgslFn` sampler parameter fed from it
  fails to compile ("unresolved value ..._sampler"). Textures passed as texture + sampler
  must be linearly filtered (the 1x1 stand-in for the desktop wallpaper is).
- Losing the device (`src/gpu/device.ts`). On 2026-10-13 Electron's GPU process crashed
  inside the NVIDIA driver ("Failed to allocate semaphore device memory", then "Crashing due
  to FD ownership violation"). It had run about ten minutes after a reload, through many dev
  reloads. The page had no device after that, and only the teal page background showed. Now a
  lost device (any reason but `destroyed`) restarts the page, which makes a new device. Before
  that, a `globes-device-lost` event lets the app note in sessionStorage whether it was
  viewing, so it comes back as it was. It does this at most 3 times a minute. Tested by
  killing the GPU process (`kill -9`): the window was back in the viewer about a second
  later. The page creates no GPU objects while running. The GPU process's `nvidiactl`
  mappings climb about one a second and are released in batches (a sawtooth, roughly 150 to
  640), so this is not a steady leak of ours.

## Simulation: FLIP/APIC on a staggered MAC grid (src/sim)

Frame: translates with the globe centre, never rotates (gravity always −y, the sphere is
static in grid space). Body force = g − c̈ (centre acceleration from the tilt pivot). The glass
is smooth: it has no grip on the water.

Grid 128³ around the inner sphere (2-cell margin; cell 0.016), 8 particles/cell seeded on a
regular lattice (61% fill), ~3.78M particles, kept sorted into blocks of cells (below). Phones
get 48³ (`?res=` overrides either).

Per substep:
1. **P2G** — APIC, trilinear, fixed-point i32 atomics (2^18); per-cell particle count. By
   blocks once the particles are sorted (below).
2. **Grid update** — normalise, keep pre-force copy (FLIP), add body force to *every* face.
3. **Classify** — sample the smoothed density field at cell centres: FLUID if ≥ iso (0.5),
   SPRAY if below iso but holding particles (falls ballistically), else AIR; SOLID if all
   faces are closed.
4. **Cell prep** — variational cut-cell weights (Batty 2007, 8-bit, static) plus a
   **ghost-fluid free surface**: towards air the coefficient is w/θ with θ from the density
   crossing, so the surface sits at its sub-cell position and bumps feel a restoring pressure.
   Symmetric volume-drift correction in cells clear of the surface.
5. **Pressure** — red-black Gauss–Seidel SOR (ω 1.85, 50 sweeps), warm-started and
   rescaled by dt ratio. cellPrep flags each 16x8x4 tile of cells that holds any water; the
   sweeps skip the rest (most of the grid: the air, the glass's corners) at once. On grids of
   48 and under (phones) a whole sweep can go in one dispatch (pressure_fused.wgsl, below), once a
   phone's bench shows that it pays. (Measured by the residual left after the sweeps, ω 1.85 with
   50 left a hard shake's equations a third nearer solved than 1.7 with 60, the worst cell too;
   above ~1.875 the worst cells ring.)
6. **Project** — ghost pressure ψc(1 − 1/θ) on liquid/air faces; SPRAY faces keep their
   ballistic velocity. Faces less than 60% open (`minOpenFace`) are left for extrapolation:
   the solve barely constrains them and their velocity is noise.
7. **Extrapolate** 2 layers (in one pass, in place: it writes only invalid faces and reads only
   valid ones), then **constrain**: remove any into-the-glass component from the filled-in wall
   faces (non-penetration, sliding allowed).
8. **G2P** — PIC/FLIP 0.95 (APIC affine off), RK2 advection, uniform damping (0.18 /s, stands in
   for unresolved boundary-layer/breaking losses), bounce-back at the clamp radius (no shell).
   When a sort follows, it also takes each particle's sort key (`KEYS`, below).
9. **Density field** — splat particles to a 256³ grid (twice the cells a side); particles near the glass also splat a
   mirror image across the clamp radius (horizontal near the waterline so a level surface stays
   level at the glass, radial deep down, blended); a 7-tap blur in one pass (a workgroup walks a
   16x16 column along z: x and y per slice in workgroup memory, z from the last 7 slices kept in
   registers); written to the 3D texture and to `field` (next substep's free surface).

**Sorting** (sort.wgsl). At 128³, millions of particles in no particular order made every warp
of the transfers and the splat touch faces and voxels all over the grid, out of the caches. So
the particles are counting-sorted into blocks of 4³ cells (keys from g2p, which has each
particle's new position anyway; a three-pass scan; sortScatter, from one set of particle buffers
into the other), again whenever the fastest may have gone a cell since the last sort (every
substep in a hard shake: the median particle moves 1.3 cells a substep; seldom at rest). Sorted, **p2gBlock**
gathers each block's particles in workgroup memory over the block's stretch of faces and adds
that into the grid once (the same fixed-point sums), and **splatBlock** does the same for the
density voxels (renderScale 2 only); particles strayed from their block's region, and the
mirror images, add into the grid themselves.

**Real time.** Each frame's whole time is simulated (main.ts: only a frame over `STALL`, 0.1 s,
counts as a stall and loses the rest). The substeps are as many as a CFL estimate asks, but no
shorter than `minSubstepDt` (1/240 s: the frame's time over it, rounded down), no longer than
`maxSubstepDt` (1/150 s) and never more than `maxSubsteps` (8): a slow frame takes longer
substeps rather than more of them (more would make the next frame slower still, a spiral that
once took the app under 1 fps). So the water always moves at its true speed and only the frame
rate drops. (Rounded to the nearest, a frame a little over two substeps' worth took three
shorter ones, and the next, slower, three again: mid-shake two frames in three, 90 fps; rounded
down, 102.) At 120 fps that is two substeps however hard the shake.

Once per frame, **particle shifting** (shift.wgsl, after Lind et al. 2012): each particle moves a
little down the gradient of the smoothed density, from crowded to sparse. The grid cannot see
how particles are arranged inside a cell, so after a splash they stay scrambled and the
smoothed surface keeps their irregularity (static bumps, never mirror-flat again). Near the
free surface (wherever its fall-off shows in the density) only the part along the surface is
kept: water moves from bumps into dips without swelling; near glass and sand only the part
along them (their mirrored density is a touch biased on curved walls, which would pack
particles against them). A small dead band leaves an evenly spread body of water untouched.
Resting roughness after a hard shake: 0.002-0.004 voxel (0.010-0.013 without); slosh decay
unchanged.

Start-up: 2.5 s of heavily damped settling before the first frame, so the surface starts
mirror-still (meanwhile, behind the splash, every globe's pipelines are built: main.ts).

**Seeding** (seed.wgsl). Each globe's water is worked out once at start-up
(`FluidSim.seedPlan`, by its fill and whether the reef's rock is in it): per column of the
particle lattice, the run of its points between the bed and the water line, inside the glass
(the same points as testing each one, 4-15 ms a globe), and its sand and motes at rest. The GPU
writes the particles, one thread a column, each to a place in the list scattered by a fixed
permutation (as a shuffle: before the first sort, the first transfer's neighbouring threads touch
different cells). So a globe coming in costs the CPU ~0.3 ms; built on the CPU every switch
(3.8M particles), it froze the slide for 0.4 s, the reef's rock for 1.8 s.

## Sand bed (src/sim/shaders/sand_*.wgsl)

A height field of sand thickness over the disc x^2 + z^2 < R^2 with columns along gravity
(sim frame, 192^2), measured from the floor it lies on: the glass, or the reef rock where that is
higher (Anemone Reef; see below). Each frame:
1. **Rotate** — the sand grips the glass: carry the bed round by the globe's turn since last
   frame (semi-Lagrangian: find the height whose pre-image lies on the old surface), then
   rescale to restore the exact volume. Sand carried past the widest point of the globe
   cannot be held by the column representation and settles back, like real sand.
2. **Flow** (16 substeps) — Bingham-like granular creep: where the surface is steeper than the
   repose angle (30°) against the effective gravity, the active top layer creeps downhill,
   faster the steeper. 8 neighbours (isotropic). Each exchange is capped at 1/8 of the volume
   that would bring that pair to the repose slope (and of the room under the glass), so the
   explicit update is unconditionally stable. Volume is conserved exactly. Below the repose
   angle a slow creep on any slope eases a tilted bed back to level (a stand-in for the wave
   action that levels sea beds); in the reef the bed has a resting shape of its own (see below)
   and, the globe upright (fully within 10°, not at all past 26°), the creep runs by how much
   deeper than its rest the sand lies instead, so it drifts back into that shape.
3. **Publish** (sand_surface, sand_extend) — the height of the sand surface per column into an
   rgba16float texture; the sand is everything in the glass below it. A rim column (sand next
   to bare glass) only holds the sliver where the bed meets the glass inside it, so it takes
   the bed's surface carried on from further in where that is lower. Bare columns carry the
   surface on linearly (it runs on below the glass), then a light 3x3 smoothing. The surface is
   smooth everywhere, so the rim, where it meets the glass, interpolates into a clean curve.
   Sand-against-glass (seen through the glass) compares with the surface 0.02 inside the wall:
   at the globe's widest point the columns at the wall are cut by the disc's edge.

The water sees the sand as a moving solid: face open fractions and cell access are rebuilt
every frame against glass + sand; particles bounce off the bed along the vertical; the bed's
rigid motion (ω×x) enters the divergence and the collision; mirror images are splatted across
the bed surface too.

Dead ends, kept for reference: radial thickness per direction (octahedral map) degenerates where
the radius runs level (sand pours into a pit that never fills) and staircases the rim; columns
fixed to the globe meet a slumped bed edge-on at large tilts (terraces); an uncapped explicit
flow step is unstable where cells are small (spikes); publishing thickness (surface = glass
bottom + thickness) or taking rim columns' own tops bends the surface up the steep glass at
every rim column (a comb of fins along the rim).

## Caustics (caustics.wgsl, caustic_resolve.wgsl)

Photon tracing each frame: a 1024^2 grid of parallel sun rays through the outer and inner
glass (Fresnel), the simulated water surface (normals from the density field), absorbed in the
water, deposited (bilinear, fixed-point atomics) where they land on the sand into a 256^2 map
over the bed's columns. Resolve: flux / (cell area / cos of bed tilt) = irradiance, tent
filter, light temporal smoothing. Sand shading reads it as the sun's irradiance (ripples
modulate it by their tilt). The water's absorption is the globe's own (`P.water`, below), and
on the sea foam globe its foam on the surface shades the photons (85% of the light at full
cover).

Lessons (each was a visible bug): empty wall cells must not be air (zero-pressure sinks pull
water into the glass); one-sided density correction inflates the water; cell-quantised free
surface freezes ripples; radial mirroring on a curved wall lifts the contact line; sliver
faces inject noise along the glass; mirror seams + drift correction drive currents; the APIC
affine term on top of a 0.95 FLIP ratio slowly pumps energy into surface waves (still water
roughened after ~10 s); decorative waviness in the glass normal reads as a non-flat waterline.

## Rendering (src/render)

One fragment shader on the globe mesh traces a ray for each of a pixel's four MSAA samples (run
per sample, `@interpolate(perspective, sample)`; `?aa=1` for one ray a pixel): the waterline,
glass rim and refracted edges are computed per ray, so MSAA's resolve alone (which only smooths
triangle edges) cannot anti-alias them. One of the four gathers the water's light for the pixel
(it is smooth; gathered by every sample it cost 0.2-0.4 ms). Run as four invocations rather than
four rays in turn, a hard shake's water drew in 2.8 ms, not 4.5. Each ray: analytic outer/inner glass spheres (R 1.0 / 0.99125,
IOR 1.5, Fresnel, thin tint), then marches the density texture in the cavity (0.6-voxel steps,
bisection, gradient normals over 1.75 voxels) with air↔water refraction, total internal
reflection and Beer–Lambert absorption plus in-scatter. A density dip pressed against the glass
under water only counts as the water's edge if the water just inside at the same height is
gone too (no phantom bubbles on the glass, nor on the sand). **Meniscus**: surface tension draws
the water up the glass, a curl ~1.15 capillary lengths high (lc = 0.0225, contact angle 20 deg;
height from the glass's lean at that height) that is far finer than the simulation, so the
renderer reads the density from lower down near the glass (lifting the surface by the classic
wall-meniscus profile) and differentiates that exactly for normals. Its total internal
reflection and curvature give the dark water line. The march always takes its last sample at
the glass, so thin wedges against it are never stepped over. The march also stops at the sand bed
(height-field test, with steps that shrink near the bed so its thin edge against the glass is
not stepped over) and shades it: procedural albedo (patches, grain, mineral specks, shell
fragments) and wave ripples fixed to the sand, wet darkening, caustic irradiance plus fill.
Where sand is pressed against the glass, its side is shown. Procedural studio environment
(indigo cyclorama, back glow, softboxes) plus a sun, shared with the background. ACES.

Each globe's water has its own colour: catalog.ts `waterColour` scales lightConfig's absorption
per channel (times `clarity`), the same in the renderer and the photons. The sea foam globe's
(1.6, 1.7, 4.8) takes the blue out almost as fast as the red, and its glow and deep colours
(`GLOBES_WATER_GLOW`, `GLOBES_WATER_DEEP`) are green: dark green open-sea water.

## Hardware ray tracing (src/rt, rt_regions.wgsl)

Where the browser offers WebGPU ray tracing (`chromium-experimental-ray-query`: Chromium or
Brave built with https://github.com/willwaltz/webgpu-ray-tracing; not stock browsers, nor
Electron), the water march
takes its samples only where it may find anything, and the hardware finds where those places
start and end. It is the same march, so the picture is the same: the software path's WGSL is
unchanged byte for byte, and the two agree but for a few pixels. `?rt=0` turns it off
(src/gpu/device.ts leaves the feature out).

- **Regions** (rt_regions.wgsl, after the density blur: every frame while the renderer traces in
  hardware; while it traces in software (Churn, below), every eighth, only to tell when to go
  back). Bricks of 2×2×2 density
  cells (between voxel centres, so the renderer's reads in a brick blend only its 27 corner
  voxels, and near the glass those up to two capillary lengths below, where the meniscus reads
  from). A brick is in if:
  - the density the renderer can read in it comes within a band of the surface's level (±0.15
    where the edge pass marks rays near the surface: the kelp's and reef's globes; else 0), or
  - the bed, or the band over it, passes through it (the larger of two steps, where the steps
    shrink, and three pixels at the farthest, the edge pass's near-bed mark).

  Bricks wholly outside the glass or under the bed are out. The faces between bricks in and out
  (~40k triangles at rest; room for 65,536, NaN in the slots not used) go into one opaque
  triangle BLAS (fast build) under a one-instance TLAS, rebuilt every frame: 0.03 ms of kernels
  and ~0.25 ms of builds. A list too long for its room (a hard shake needs 90-150k) would leave
  out faces, and the march would skip water it must not; it becomes one box round the grid
  instead, in which the march takes every sample.
- **March** (rtWGSL.ts: `rt_march`). The software march's samples at the same t, taken inside
  the regions. Once a sample past a region's end finds nothing pending (not a sliver against
  the glass or the bed), a query for the nearest face finds where the next region starts (the
  faces are wound to face out of the regions, and `front_face` is true from that side). The
  samples before it are skipped by a whole number of steps: outside the regions every step is
  a full one and finds nothing. A second query finds where that region ends.
  - The first search, and the search for a region's end, look past the cavity's far side
    (`RT_FAR`): a region can run on past the march's stop (a kelp blade, the koi). After a
    region's end, only a start before the stop matters.
  - The 768-sample cap counts the skipped samples, as the software march would.
  - The few pixels that differ come from the skipped steps being summed as k × step, not as
    k additions.
- **Churn.** While the water churns, its regions fill the cavity in pieces, and the hardware
  is the slower even with room for them all (frozen mid-shake: water 3.28 vs 2.83 ms, koi 5.97
  vs 4.90, reef 12.6 vs 10.8). So the sim reads the count back with its stats (a frame or two
  late), and above 60,000 triangles the renderer draws with each pass's software twin and the
  builds are left out, until the count falls under 50,000 (RtScene.observe; the hardware was
  the slower from 52-65k in the reef's globe, 61-84k in the others). GlobeView picks the tracer
  after the sim's step, so it draws in hardware only in a frame whose builds ran. The twins
  compile in the background after the first frame (precompile); until then it stays in
  hardware.
- **Kelp and anemone** keep their grid walks. As boxes the shader tests (AABB primitives), the
  hardware handed over more of them than the walk tests: the kelp traced ~1 ms slower and the
  anemone no faster, and their boxes cost 0.2 ms a frame to build.
- **Measured** (RTX 4090, 1876×1035, the same frozen frame, render passes, hardware vs
  software): water 1.60 vs 2.31 ms, koi 2.39 vs 3.60, kelp 2.75 vs 3.24, reef 3.12 vs 3.37;
  plus ~0.28 ms in the tick for the regions. What remains is in the samples the software march
  takes too: the meniscus ring, the surface seen at a grazing angle, and the arc where the bed
  meets the glass (sliver tests at a fifth of a step).
- **Lessons:**
  - Ray-query call sites cost more than queries. Three inlined call sites ran 1.1 ms slower
    than one doing about twice the queries (registers).
  - Four extra queries ahead of the loop cost only 0.43 ms.
  - A per-sample "in a region?" lookup with entry-only (back-face culled) queries was slower
    than an entry query plus an end query.
  - A triangle mesh of the water's surface traced four times faster, but it missed the
    meniscus band and cost 2 ms a frame to build (331k triangles).
- **Testing:** in dev, `__globes.globe.setHardwareTracing(false)` draws in software only, and
  `(true)` as normal, swapping the passes' materials in place for an A/B of one frozen frame. To
  keep the hardware through a shake, `__globes.sim.rt.canSwitch = false`.

## Light shafts and motes

The photon tracer also lays one photon in eight along its path through the water (exact DDA)
into an 80^3 volume (light_resolve.wgsl: fluence, light temporal smoothing): volumetric
caustics, focused by the wavy surface. The renderer gathers the in-scatter along each pixel's
path through the water (two-lobe Henyey-Greenstein phase), once per pixel. Motes: 3000 fine
particles carried by the grid velocity with a slow smooth meander (no per-frame jitter),
binned into a 48^3 grid (4 per cell) and ray-traced with a pixel-footprint filter, lit from
the light volume.

## Koi (src/fish, koi_bake.wgsl)

- Behaviour (Koi.ts): a 16-point follow-the-leader spine carrying a carangiform wave
  (wavelength 0.95 TL), rigid head, banking roll; cruise / glide / hover / burst / escape with
  turns limited in angular acceleration. Neutrally buoyant: it drifts with the water sampled at
  probe points along it (read back a frame or two late) and swims away from the air.
- Shape (koiWGSL.ts): a distance field in body coordinates along the spine (egg-shaped
  cross-section), membranes for the median fins (cloth lag, ripple) and the paired fins (own
  frames, spring-damper flex), eyes, lips, barbels. The pose is a 64x1 rgba32f texture written
  each frame (layout: `KOI_TEXEL`), including the box the shape is baked into (along the
  chord, the fish's up and right; half a body length across the spine, less along it).
- Bake: every frame the exact shape is evaluated at 128x64x64 voxel centres over that box into
  an rgba16f field: distance, fin or not, nearest spine segment (0.03 ms). The photon tracer
  marches the field alone for the fish's shadow (body stops photons, fins pass 60%).
- Rendering, two passes over the globe mesh:
  - Main pass: has no koi code at all (`GLOBES_KOI` false). It notes pixels where a ray's
    stretch comes within `KOI_BAND` (2.5) voxels of the fish, stepping through the field
    exactly as the koi pass does, and writes depth 1 there, 0 elsewhere.
  - Koi pass: the same shader with the koi, depth test `less` so the GPU skips every
    unmarked pixel before shading; it redraws marked pixels whole. It shades per MSAA sample
    (`@interpolate(perspective, sample)` on its position): one ray per sample, whose positions
    are the main pass's four ray offsets, so a pixel's rays run in parallel, not in turn.
  - Koi trace: field steps (0.8 g - 0.8 voxel) to within the band, then the exact shape; the
    spine-segment search starts at the field's hint (+-2 segments). Shading at a new point
    searches the whole spine (a hint left over from further along the ray garbled the fins).

## Kelp forest (src/kelp, kelp_sim.wgsl, kelp_build.wgsl)

The Kelp Forest globe holds 15% more water than the others (`catalog.ts` `water`, turned into a
fill fraction in `main.ts`). Every globe comes in with its own water (`FluidSim.startOver`
reseeds it level and still over a level bed, out of sight, mid-switch), so none of the last
one's swirl or slosh carries over; the particle buffers are sized for the most water any globe
holds.

- Layout (`forest.ts`, deterministic): groves of plants (clumps, a couple of loners, never rows);
  each plant 1-3 fronds, most long enough to reach the surface. A frond is a stipe of 40 nodes,
  anchored below the sand; blades along it at uneven spacings (now and then a pair), each with
  its own length, width, outline (where widest, stalk width) and colour, hung from a stalk
  carrying 0-3 gas bladders. A blade is cloth: 7 rows x 3 particles (edges and middle).
- Dynamics, every substep, on the GPU: `kelpPredict` (every node: buoyancy along true gravity,
  a quarter of its weight where it breaks the surface; implicit drag towards the water's
  velocity, anisotropic: weak along a stipe and within a blade's face; a surface-film drag;
  blades get extra lift just under the surface, sensed from the water above them, so the canopy
  lies flat on the waves; a gentle flow-driven ripple runs down submerged blades), `kelpStipes`
  (follow-the-leader, root to tip: exactly inextensible; the predicted shape is first rounded
  wherever a joint turns past ~12 degrees, so stipes only ever make smooth arcs; dynamic FTL
  correction 0.9; a rotation-minimising frame up each stipe) and `kelpBlades` (the stalk by FTL,
  then the cloth by position-based dynamics: rails and rungs stiff, shear softer, bending weak;
  its base row carried on from where it lay, so it can never flip). The anchors turn with the
  globe and stay below the sand.
- What the kelp is dragged towards is the water's velocity capped (stipes 0.3 units/s, blades
  0.5): in fast water it streamlines and the water slips past, so a hard slosh bends the forest
  over and its bladders stand it up again instead of sweeping it flat.
- Lessons (each was visible): a push off the sand or glass fed into the FTL correction comes back
  as a kick into the bed (a frond lying on the sand whips at full speed): only the rope's own
  length correction goes in. Without most of the FTL correction (0.3 instead of 0.9), a frond
  whose anchor the tipping globe carries down is yanked bodily after it, tip whipping. A bending
  force applied to the bent node alone propels the frond through the water; stiffened for tight
  joints, it flung the forest about whenever the globe was tipped; made momentum-conserving and
  stiff, it oscillated. Hence bending stays gentle and corners are taken out of the predicted
  shape. Smoothing the result instead feeds the FTL correction and the kelp thrashes on its own.
  The buoyancy must not follow the globe's acceleration (every jerk of the hand flings buoyant
  fronds); the globe's motion reaches the kelp through the water. Lumped bladder buoyancy zig-zags
  a soft rope: the lift is spread along the stipe.
- The sea (its idle motion, see below): sets of gentle swells (a push near the water's own
  slosh period, from a new direction each set) and slow currents (a body force with curl in
  `grid_update.wgsl`: a swirl and two rolls, on unrelated periods). Measured: the surface rises
  and falls ~0.02-0.04 at the glass; the kelp sways at ~0.05 units/s and the canopy drifts.
- Shape for the renderer, every frame (`kelp_build.wgsl`, ~0.03 ms): ~7200 primitives (stipes:
  3 capsules a link along the Catmull-Rom curve through the nodes; stalks; bladder spheroids;
  blade patches, two bilinear patches a row with the particles' normals) into a 48^3 grid by
  counting sort (count, allocate ranges with an atomic, fill). Each reference carries the
  primitive's bounding sphere (index, kind and radius packed exactly into its w), so most are
  passed by without touching the primitive. The kelp's shadow: the area each primitive shows the
  sun, splatted into a 64^3 extinction grid the photon tracer fades its photons through (shafts
  through gaps in the canopy, its shade on the bed).
- Rendering: the kelp globe has its own variant of the globe shader (`GLOBES_KELP`). Each stretch
  of a ray walks the grid and tests capsules, spheroids and patches exactly (Reshetov's
  bilinear patch), the blade's outline (toothed, ruffled) cut out of its patches. Shading:
  golden stipes and glossy bladders, olive blades with chevron ridges and epiphyte flecks, lit
  by the light volume, sunlight coming through from behind golden.
- Edge-only anti-aliasing (the kelp globe): the main pass traces one ray a pixel and marks the
  pixels whose ray passed near an edge (the glass's rim, the water line, grazing views of the
  surface, where the sand meets the glass, within a pixel and a half of a stipe, bladder or blade
  outline); a second pass (`kelpAA`, depth-tested like the koi pass) redraws only those, one ray
  per MSAA sample, one sample gathering the water's light for all four. Four rays everywhere cost
  4.5 ms; this, 3.5 ms (gallery view, 120 fps with the simulation at ~4.5 ms).

## Anemone reef (src/reef, src/fish/Clownfish.ts, reef_*.wgsl, rock_bed.wgsl, clown_bake.wgsl)

A slice of reef: a rock outcrop in coral sand, an iridescent, translucent purple magnificent
anemone (Heteractis magnifica) on its top, two clownfish (Amphiprion ocellaris) living in it, a
brain coral and two small branching corals. 15% more water, and clearer (`catalog.ts` `clarity`
0.35: the absorption times this, in the reef's shader variant and for the photon tracer's light on
its way down, `P.bed.y`): through the usual turquoise the purple read blue and the orange brown.

- The rock (`rock.ts`): a height field over the floor in the globe's frame (fused, flat-topped
  lumps, a gentle unevenness; the same formula in TS and WGSL). The perch is buried: the sand is
  heaped round the anemone and banked against its column (`sandRestHeight`: a bed at -0.47 out by
  the glass, a heap 0.07 higher at the column falling away over ~0.2, never steeper than ~25°;
  60% more sand than the level bed at -0.55 the reef first had). It is seeded in that shape,
  and `rock_bed.wgsl` also finds where each column crosses it (Newton's method, the shape turning
  with the globe) for the creep (above), so after a tilt it drifts back within ~15 s. The other
  lumps (the brain coral's dome, the corals' footholds) stand out of it. It is part of the bed: once a
  frame `rock_bed.wgsl` finds its top in every column of the sim frame (the rock turns with the
  globe: down each column to the first point whose pre-image lies under the rock, then
  bisection). The sand lies on it: every sand kernel's floor is max(glass, rock) (sand_rotate
  carries the old floor round with the old sand), so tipped sand slides round and off the rock
  instead of through it; bare rock publishes its own top. The water, the photon tracer, the
  motes and the renderer all see it through the published bed; the texture's g says how much is
  bare rock (renderer: coralline crusts, turf, pits; the brain coral's dome is a lump of it with
  its own meandering ridges). Particles and motes are seeded above the bed (`FluidSim.bedAt`).
- The anemone (`anemoneShape.ts`, `anemone.ts`): the body is formulas (a pleated column flaring
  into a ruffled margin, a dished oral disc, the mouth), evaluated every frame on the GPU as
  1536 vertices / 1344 bilinear patches with their normals; it breathes (girth) and the flow
  past its crown (probes, read back) carries its top over (a damped spring, at most 0.035).
  ~570 tentacles, scattered by dart throwing (never rows or rings), each its own length, girth,
  lean, gentle curl and tint; 7 nodes each. Each tapers all the way from its root to a narrow,
  rounded tip (`tentacleGirth`: full a quarter of the way up, 40% of that at the tip, a long
  teardrop): a swollen tip on a finger of even width (a separate spheroid) read as glued on.
  None grows into the body or lies along it: one whose rest shape would come within its own
  thickness + 3 mm of the body (`bodyDistance`; ~40 did: flopped ones across the disc, a few
  along the rim) is raised, 0.05 rad at a time, until it stands clear (no extra random numbers:
  the rest of the layout is as it was).
- The body as the tentacles feel it (`bodyDistance` / `reef_bodyDistance`, TS and WGSL): what
  lies inside the column's side and below the disc (under the flare's overhang is water), the
  distance up off the disc, out along the side's normal (first order: radius difference over
  sqrt(1 + slope^2); under the flare, out and down), and round the rim (rounded by 6 mm), with
  the way out. Before, every point inside the margin's radius counted as under the disc: a
  finger hanging over the rim was lifted 2-4 cm onto the disc whenever it swung a hair inwards
  (and pushed straight out from the flare's underside), so the outermost tentacles kicked now and
  then for no reason to be seen (the idle surge pressed a side's against the rim together).
- Tentacle dynamics (`reef_sim.wgsl`), every substep: `reefPredict`: an implicit drag (0.06 s,
  weaker along the tentacle) towards the water it goes with: the simulated flow averaged over the
  last 0.4 s (`rFlow`, per node; thicker nodes longer, thinner quicker: 0.5 + 0.5 r/0.011), and
  of the water's motion past the anemone (minus the globe's carrying it round, `P.omega` x
  position) only 60%, capped at 0.15 units/s. So the fingers have weight: they sway after the
  water, smoothly, and the water slips past them (in the surge the tips move ~0.75x the water's
  speed, swinging ~6-17 degrees; they had moved with it like dye, 1-1.2x, 7-27 degrees); a tip
  of the globe leans them ~2/3 as far. `reefTentacles`: the root rides the disc; follow-the-leader
  towards the predictions (FTL correction 0.5) and out of the clownfish's bodies (an ellipse round
  each fish's spine: they part round the fish), the anemone's own body (its thickness, fading
  to nothing at the base, which grows out of the disc), the bed and the glass: that is the
  motion (velocities); then the shape, as positions only (each link eased towards its rest turn
  from the one before, firmly, 0.05 s; the first towards the way it grows, 0.05 s: a short root
  link turns fast under the flow, so it needs about the whole tentacle's stiffness).
- Lessons: the shape pull fed into the velocities rang and fought the FTL correction, so the
  strongly curled tentacles shivered (adjacent nodes moving opposite ways); taken out of the
  velocities, a soft shape let the slosh comb the crown flat and crumple it into noodles, so it
  became firm per link, with the lean from the root. A 15-degree tip now leans the fingers over
  and they stand up again. Mind the curl in the layout: strong curls with a wobble look like
  worms, not fingers. Weight goes in the water they feel, never in a slow drag on their own
  velocity: the velocity also carries every push (a fish, the body, the follow-the-leader pull),
  and with a 0.4 s drag those pushes kept going and the fingers wandered off on their own.
  Nothing may move without a cause to be seen: hunt such motion with a detector (each node's
  motion against its 0.3 s moving average, in the anemone's frame, only while the globe has
  been left alone; scratchpad `wiggle.mjs`) and look at what each mover touches.
- Rendering (`reefWGSL.ts`, the reef variant `GLOBES_REEF`): a 64^3 grid over the inner cube
  (finer than the kelp's: many small primitives), walked only within the anemone's bounding
  sphere: tentacle pieces (round cones along the Catmull-Rom curve, three a link, each as thick
  at its ends as the tentacle is there, the last one's end rounding off the tip; Quilez's
  intersector, the normal leaning by the cone's slope), the mouth (a spheroid), body patches,
  coral branches (capsules). Shading is translucent tissue:
  wrapped light, light through it from behind, a glow from within strongest at the edges, and a
  thin-film sheen (`reef_film`) in shifting violets, blues and magentas.
- Edge-only anti-aliasing as in the kelp globe, but marking only what can matter: near misses of
  a tentacle in front of what the ray ends on (in a dense crown most tentacles a ray passes by
  are hidden behind the one it hits), hits within the margin of their tentacle's outline, and a
  margin of 0.85 pixels (a pixel's rays all lie within ~0.7 of its middle). The march's
  near-the-bed mark now only counts for rays that pass the bed by (before, every ray that landed
  on it marked its pixel). Viewer: 120 fps (render ~2.8 ms at distance 6.6, ~3.9 at 4.9; sim
  ~3.9 ms); zoomed right in (3.0) ~91 fps (render ~6.8 ms, of which the clownfish ~0.2).
- The clownfish (`Clownfish.ts`, `clownWGSL.ts`): a larger female and a smaller male, the koi's
  machinery (16-point spine, pose texture rows, a baked field each, stacked in one texture,
  `clown_bake.wgsl`) with their own shape (short and deep, blunt head, big eye; smooth rounded
  fins: a low spiny dorsal, a taller soft one, round anal and tail fins, rowing pectorals) and
  paint (three white bars edged black, the middle one bulging forward; black fin margins). The
  reef's first pass notes pixels near either fish; its second (always drawn) traces them.
- The body has weight (`buildPose`): the head (nodes 0-3) is rigid; behind it the body is kept
  between frames. Each node is drawn after the one ahead (follow the leader), but only when the
  fish swims forward. Backing into the crown or carried sideways, it moves as one; trailing then
  had folded the body into a U. Each segment then swings after the one ahead on a damped spring
  (`BODY_FREQ` 14 rad/s, damping 0.5 at the front to 0.9 at the tail, so the tail can't whip;
  joints capped at 0.3 rad). A turn therefore runs down the body as a C becoming an S, about
  0.8 s from head to tail, instead of the whole fish rotating rigidly. It turns about a point
  0.28 of its length back (`swing`: the head swings out round it, easing back over 0.9 s), not
  about its snout. The old bend, proportional to the turn rate, was rigid: the body turned
  about the nose.
- The head: the body is swept only from `CLOWN_NOSE` (0.06 body lengths) back; in front, the
  snout is a cap (half an ellipsoid on the section there, as egg-shaped as the body, so they
  meet without a crease), blended in (smooth union). Swept right to the blunt tip, the outline
  rose all but straight up and the distance, divided by that slope (~700 at the tip), all but
  vanished: a sheet across the snout, perpendicular to the fish, that rays stopped on (a thin
  dark line off the nose seen side-on, the nose and mouth garbled). (The slope in the sweep's
  distance is also capped at 2.5, and beyond either end the distance is to the end's face: it
  had been made smaller by how deep inside the outline the point was.) The mouth runs round the
  front of the snout a little below its tip (`clown_mouthLine`: the snout's level section there,
  to corners ~63 degrees round), between fleshy lips (a tube along it, unioned), as a slit
  (cut), parting with each breath (`misc.x`: 0.8-1.5 Hz, faster after a hard swim).
- The eyes dart (`misc.y` yaw forward, `misc.w` pitch): a jump of a few hundredths of a second
  (0.022 s), then a still look of 0.3-1.9 s; hovering, about (forward, up, back past the flank),
  now and then back to looking out; swimming, mostly ahead. The iris and pupil turn with the
  gaze on the eyeball (`clown_iris`).
- Skin (`clown_shade`): scales over the flank behind the gill cover (`clown_scales`: rows ~0.033
  body lengths, every other one set half a scale on, each lying over the front of the ones
  behind; a slope for the relief, each free edge thin, paler and pearlier, the next in its shade
  just behind it; faded out below ~2-4 pixels a scale), the gill cover's edge under the head bar
  (lifting a little with each breath), and translucent, iridescent tissue: wrapped light, light
  through it from behind and at its thin edges (warm through the orange, cool through the
  white), the mucus's gloss, and a thin-film sheen (`clown_film`, 165-295 nm per scale): a broad
  lobe round the sun's reflection, a glow towards the edges, and the surroundings' reflection
  tinted, strongest in the white bars (iridophores), faint over the orange.
  Behaviour, kept in the anemone's frame (they hold on when the globe tips): peek (nestled in the
  crown, head out, hovering, looking about, now and then sinking back in), shift to another
  spot, venture out on a short loop round the front (the other sometimes follows), dart back,
  and hide (deeper) when the globe is handled or the water rushes past the crown (> 0.22 units/s),
  until 2 s of calm. Never steeper than ~35 degrees.
- Its idle motion is a surge: rolls back and forth every 5.6 s whose turning point is high
  (`currents.w`), so the crown, a third of the way up, is in the lower water's flow (~0.03-0.04
  units/s; the tentacles sway ~15 degrees in unison). With the default rolls it sat on their
  nodal plane and barely moved.

## Fish food (src/fish/FishFood.ts)

A right-click on the koi's or the reef's globe (the app, in the gallery or the viewer) drops a
flake of fish food under the pointer. The line of sight is bent through the glass and the water
(Snell's law at the outer and inner glass surfaces; water is assumed), and the flake is placed
where that bent line passes nearest the globe's centre, within 0.82 R. The flake pops into being
as a quick spring of scale, with a small push and spin. Up to `FOOD_MAX` (7) flakes at once; a
right-click past that does nothing.

- **Physics** (CPU, sim frame). Each flake has a fixed slot, and its slot is its water probe
  (FluidSim probes 56-62). With slots, a flake that is eaten never shifts the others' samples.
  - In the water, a flake takes up the water's velocity (time constant 0.3 s) and sinks at
    0.011 units/s, almost neutrally buoyant. It flutters sideways the way its face leans.
  - It tumbles with a wandering spin, plus a pull that lays it flat.
  - In the air it falls at up to 1.4 units/s. Entering the water it all but stops (its speed
    times 0.3).
  - The glass holds it in.
- **Settling.** A flake settles on the sand (the probe's sand height). In the reef it also
  settles on:
  - the crown's tips (`Crown.height`), but only when it comes down onto them from within 3 cm
    above. Lower down, beside the anemone, it had jumped up onto the crown;
  - the rock (`rockHeight`);
  - a coral branch (capsule test).

  A settled flake keeps its place in the globe frame and lies flat.
- **The fish** (`Feeder`: `mouthAt`, `ahead`, `reach`, `busy`, plus `food` and `gapeWant`, set
  each frame).
  - Before the fish move, `aim` gives each fish the nearest flake it has noticed. Each fish
    notices a flake 0.35-1.45 s after it appears (one time in ten, 1.5-4 s).
  - The koi enters `feed`. It steers for where the flake will be 0.4 s later, slows as it comes
    up, and turns more tightly. Its glass and sand clearances shrink, so it can feed by the
    glass and on the sand. For a flake on the sand it aims 0.05 above it.
  - A clownfish leaves the crown (`feed`). It comes to a settled flake from a little above and
    looks at the flake as it nears. Once fed, it settles straight back to peeking if it is near
    its spot; otherwise it swims back to the same spot.
  - A fish catches a flake within `reach` of its mouth, in front of it. For a settled flake
    below the mouth, the vertical distance counts 0.4 times, so the suction reaches down.
  - The caught flake is drawn to just inside the mouth, faster and faster (tau 0.11 s down to
    0.025 s), turning edge-on to the flow, shrinking a little. Then it is gone.
  - The fish's mouth is wide open by then. Koi: the lips push forward into a short tube and the
    ring widens (`koiGape`, from misc.x, in `koi_lips`). Clownfish: `mouth` = max(breathing,
    gape).
- **Rendering.** The flakes are written into the shown fish's pose texture: row 0, texels 48-62
  (a header with the count, then two texels a flake). The second texel holds the normal,
  scaled by 1 + the flake's turn as a fraction of a whole turn, and a seed in w.
  - `food_trace` intersects each flake's plane and keeps the hit if it lies inside a ragged
    outline (a few sine harmonics of the seed). It runs in every variant but the kelp's
    (`GLOBES_FOOD`), and only flakes nearer than everything else on the stretch count.
  - Passing within two pixels of a flake marks an edge, for the reef's per-sample pass.
  - `food_shade`: flake-food colours (red, orange, yellow, green, brown, tan, each varied),
    mottled and speckled, paler and more translucent towards the edge, lit by the light volume.
  - With 7 flakes the render costs nothing measurable (3.19 vs 3.20 ms on the reef).
- **Measured** (12 random mid-water drops each). Reef: 11 eaten before settling, 1 after;
  median 3.3 s from drop to eaten. Koi: 12 before settling; median 4.6 s (one koi, flakes one
  after another). Flakes dropped onto the koi's sand: eaten in 3.5-6 s.

## Sea foam (src/sim/Foam.ts, foam.wgsl)

The sea foam globe's white water: shaken, the water churns in air and clouds with bubbles, which
rise and froth over the surface, and the foam drifts there in lace, opening and fading over half
a minute or so. A port of the white water of an earlier ocean surf simulation by the same
author ("the surf" below: its simulation and its foam's shading), at its scale times
`Foam.m` = gravity / 9.81 (2.45: same Froude number, so lengths and speeds scale by it and times
are unchanged).

- **Shedding** (g2p.wgsl, its `FOAM` variant, this globe only): per particle per substep, by how
  hard it hits the glass, how hard it is slammed near the surface (its push past 2.5 g) and how
  fast it is flung clear, a few flecks of foam and bubbles, queued (16384 a frame) with the time
  left in the frame, so they start where the water will be at the frame's end. Rates by the water
  a particle stands for against the surf's design (`FOAM_RATE` 0.04, `BUBBLE_RATE` 2): most of the
  foam comes up with the bubbles.
- **Once a frame** (after the motes, before the photons): the water's top per column (128², from
  the density field); the queue into the pools, each bubble searched down into the water under
  where the water churned (spawned in spray it burst at once); the bubbles (carried by the flow
  at RK2, driven by the water's push less gravity, clamped to 4 g, so they rise, gather in eddies
  and are thrown about with the shaking; rise by size; Ornstein-Uhlenbeck stirring; at the top a
  fleck of foam (50%), a boil (3%) or a burst; in a pocket of air a burst; 10 s at most) splatted
  into a 64³ aeration grid (tent-blurred: the scattering they add to the water); the boils
  (upwellings that push the foam out into rings); the foam, moved along the surface's flow
  (smoothed to 8 cm cells), by the boils, the jostle of crowding and its slump (foam piled past a
  layer spreads down its crowding's slope; without it the foam packed into thick smooth rafts),
  held off the glass at the water line, fading (alone, thin, stranded, holes bursting open in it),
  drawn under where the surface converges hard; a counting sort into 1 cm bins; and the foam map
  (512², per texel the foam's field, coverage, thickness and freshness, small gaps merged; mips).
- **Grain**: the particles (8 mm), bins (1 cm) and merge (1.5 cm) are half the surf's against the
  water's motion. At the surf's, the holes in a globe's foam (a few cm) were filled by its
  particles' own discs and the map's merge, and the foam showed as solid blobs.
- **Rendering** (shaders.ts `foamWGSL`, the globe's `'foam'` pass): on the water's top only
  (not under a lip or a splash, nor down a wave's steep face: the map, over x and z, would smear
  it down the face), the foam map filtered over the pixel's footprint (stretched along the ray
  where it meets the water aslant; up close the field rebuilt between texels, Catmull-Rom, and
  cut at its edge). It stands on the water (the surf's relief, `globes_foamRelief`: up to 0.03,
  fresh foam the highest; a ray from the air is marched back over that height, so rafts show
  their tops and the faces of their edges and hide the water just behind them), and the light
  finds its way through it as through a layer of bubbles: it hides as much as the ray's way
  through it is long (seen side-on through the glass, even lace is white), the light it takes in
  spreads through it (a raft's faces turned from the sun still glow), thin lace sends back less
  than a raft, and from below lace glows and a raft shows darker. Closest, its particles
  themselves (foam.wgsl `wwFoamExport` copies the sorted foam and its bins' starts into two
  textures each frame; `globes_foamMicro`, after the surf's): their exact edges, and three
  bubbles each, packed into cells in thick foam and round in thin lace, their films mirroring the
  sky and glinting. In each stretch of water, a march through the aeration grid (at most 40
  steps of 0.05): the bubbles scatter the sun's light (the light volume) and the sky's, dimmed by
  the water above, and veil what lies beyond.
- **Cost**: ~0.3 ms a frame to simulate (bubbles 0.12, foam 0.1, map 0.1) and ~0.6 ms more to
  render in a hard shake. The relief and the bubbles cost nothing measurable at the usual zoom
  and ~1-1.5 ms close up (zoom 1.8, 1712x963, 2026-10-20).
- Lessons: the surf's amounts over a globe's small surface piled the foam into rafts that never
  opened (the crowding spill fired tens of thousands of times a shake). Holes that drifted with
  the flow and pushed their foam out to their rims (a burst film's retraction) traced visible
  tracks through it: the surf's own holes, where the foam bursts and fades, look right. The surf's
  bubbles, scaled down with its sea (0.1-0.2 mm), were too fine to see, and eight a particle at
  six particles a bin made cells ~0.0035 across whatever their size: a real froth's bubbles
  (0.003-0.0045, three a particle) show. Dev knobs:
  `?foamrate=`, `?bubblerate=`, `?boilrate=`, `?foamk=` (Foam.ts); `sim.whitewater.stats()`.

## Splash: bubbles, spray and drops on the glass (src/sim/Splash.ts, splash.wgsl)

Every globe, shaken hard enough: the clear bubbles the churned water takes in, the spray it
throws into the air, and the drops left on the glass above the water, which hold there, run
together, run down and leave trails. It takes its share of the queue g2p.wgsl fills where the
water churns (the sea foam globe's white water takes the rest first; `BUBBLE_RATE` 0.3 and
`SPRAY_RATE` 1.5 against its rates), once a frame after the density field. Its pools work as
foam.wgsl's (two halves, each survivor written on into the other). The drops are kept in the
globe's own frame (they turn with the glass), the rest in the water's.

- **Bubbles** (`spBubbles`, up to 8192): radius 0.003-0.024 (0.003 x 8^(u^1.5): most small),
  taken 0.02-0.12 down under where the water churned; carried by the flow (RK2) and pushed by
  the water's push less gravity (clamped to 2.5 g: they rise, gather in eddies and are thrown
  about by the shaking), the larger rising faster (up to 0.75/s in still water), stirred
  (Ornstein-Uhlenbeck, hardest just after they were taken in). At the surface one rides it for
  ~0.5 s and bursts, the jet its hollow closes into throwing up a drop or two of spray (more for
  a larger bubble); pushed out through the surface it stays on it; left out of the water
  altogether (a wave's lip) it bursts at once. 20 s at most.
- **Spray** (`spSpray`, up to 16384): radius 0.0012-0.0096, torn off on the water's speed
  (spread about it, up off the water, and away from the glass where it struck it), slowed by
  the air (the smaller the more). Back into the water it is the water's again (a large one now
  and then takes a bubble down); onto the glass above the water it stays as a drop (a cap of
  the same water); into the sand, gone. 4 s at most.
- **Drops on the glass** (`spWet`, `spDrops`, `spDropMerge`, up to 65536): where the water draws
  back from the glass (a 256² octahedral wet map of it; only where the water lay close under
  the glass, so its edge rocking there leaves none), the film it leaves breaks up at once into
  drops (4000 a unit² of glass, base radius 0.0008-0.0085, most small; one in fifty
  0.008-0.016, to run), each pinned in an oval of its own, any way round. A drop is a streak
  from its tail to its head (round, its tail is its head), its water a³ spread along it. It
  holds until its weight along the glass (gravity less the globe's acceleration, as a Bond
  number across its width) overcomes its hold, which varies from patch to patch of the glass,
  is less while the film drains under it (1.5 s) and a little less once it moves. Then it
  creeps down, the faster the heavier (0.6/s at most), drawn aside towards where the glass
  holds less (so drops run in the tracks of those before them) and wandering a little, until a
  patch holds it again: most that move at all go only a little way. It dries slowly (the
  smallest first), is the water's again once under it, and, hanging from the glass and heavy
  enough, falls as a ball of spray. Drops that touch run together (each into the largest it
  touches that is larger than itself): at rest the merged drop is drawn out towards where the
  other was, then draws itself back in to the length the glass pinned it at; on steep glass it
  sags a little.
- **Trails**: a running drop is round, and draws a line of its water behind it from where it
  set off, laid down on the glass every 0.012 (sooner where it turns more than ~14°) as a trail
  line: 0.3-0.5 of the drop's width, mostly a thin film (at most a fifth of the drop at a time).
  A line stays exactly where it was laid: it goes only into a drop running into it (one it lies
  ahead of: not the drop that laid it, nor one come to rest on it), no drop goes into it, and
  after ~15 s it beads up into a few droplets. Half the drops leave no trail, a quarter a broken
  one (wet where the glass takes their water: noise along it), a quarter a whole one.
- **Rendering** (shaders.ts): the bubbles and the spray are binned each frame into a 32³ grid
  over the glass's cube (8 spheres a cell), and `globes_splashAlong` walks a ray's cells within
  the boxes round them. A bubble mirrors the water round it, wholly towards its rim (the bright
  ring past the critical angle), and lets the rest through; a drop of spray mirrors the air
  round it and shows the world upside down, as a ball lens; a bubble's dome over the water is a
  film mirroring the air from both its faces; one smaller than a pixel shows as a speck
  (silvery for a bubble; for spray, the air round it and a glint of the sun). The drops: a 512²
  octahedral map of the glass (up to 4 drops a texel) and their records, in one texture
  (`globes_dropAt`). Across its streak a drop's water stands as a cap at its contact angle
  (40-80°), its edge wavering into lobes (the larger the drop, the more); a trail's width
  wavers along it as the glass held its water (fixed on the glass: the same while it is drawn
  and once it is laid). A ray through the glass is bent into and out of a drop's water
  (`globes_dropOut`; towards its edge the surface turns it back wholly: the dark outline and
  bright crescents of drops on a window).
- **Drops on a phone** (the betta bowl's `LITE` shader): one ray a pixel at a ratio of 0.6-1, and
  most drops are narrower than a pixel there (at 1, 70% of them; the median half a pixel). A ray
  through a sliver of one took its whole lens for the pixel, often black where the rim turns the
  light back to the dim room: rolled, the dome filled with hard dark specks. Now a drop narrower
  than 0.6 of the pixel's footprint on the glass (`lit.z` x the path, drawn out along the way the
  glass slants from the eye), and any whose edge crosses the pixel, is drawn by how much of the
  pixel it covers (`globes_dropCover`: its area spread over the pixel's width so that the pixels
  round it take just its area between them), taking its share of the light by its contact angle
  (`globes_dropLoss`: where its surface stands past water's critical angle, 0.75 / sin of the
  angle of the way out, the light is turned back); only a ray well inside a drop goes through its
  lens. Against the same frozen state rendered at 4x the ratio and box-filtered (2026-10-25,
  14,000 drops after four rolls): pixels darker than half the reference 605 -> 76 at ratio 0.6,
  1650 -> 345 at 1, 3763 -> 1039 at 1.5 (what is left: the dark rims of the larger drops, which
  are drawn through their lens), the mean within 2%. It is cheaper too, where the glass is wet
  (fewer lenses, and no wavering edge worked out for a drop narrower than a pixel): the render
  pass 1.4 -> 1.3 ms at ratio 2, 2.6 -> 2.4 at 4 (RTX 5090); dry, the same. The desktop's shader
  is as it was. A trail's water (a trail line, and the line a running drop draws behind it)
  stands too low to turn any light back, and takes only what its surface reflects, whatever the
  drop's own angle; and a trail narrower than the pixel covers it only up to its far edge.
- **Cost**: a hard slosh at the usual zoom (1712x963) leaves ~18,000 drops on the glass: 93 fps
  (median 10.9 ms), against ~100 before the trails (2026-10-19).
- Lessons (tuned live against photos of rain on a window): drops that were perfect circles,
  teardrops, and too many runners all read wrong: most drops hold or only creep a little, in
  many irregular shapes. A trail drawn as part of its drop (moving with it) does not read as
  water left on the glass: it must be laid down and stay. A drop at rest that sagged into the
  line it had just laid took it in, was drawn out to its far end, drew in and took the next,
  pulling its whole trail back into itself: hence lines go only into a drop running into them.
  Trails a tenth of their drop's width were too thin, and whole trails behind every runner too
  many. Dev knobs: `?splash=<bubbles,spray>` (scales; `?splash=0`, none), `?drops=<per unit²
  of glass,smallest,largest,hold,speed,drying>` (Splash.ts); `sim.splash.stats()`.

## Idle water (src/sim/IdleWater.ts)

Left alone (not held, not moving along the stage) for 4 s, every globe's water starts to move
of its own accord, each in its own way (`catalog.ts` `idle`); it comes on over 3 s and stops
within 0.6 s of the globe being picked up:
- wave (Clear Water): a steady rhythmic wave rocks the water from side to side (along a line
  that turns slowly within ~25 degrees of the view's left and right), ~0.03-0.04 at the glass,
  breathing a little over ~20 s.
- swirl (Koi): a current circles the globe (~0.17 rad/s, a turn every ~36 s; the koi rides it,
  swimming against it where it runs fast), and a wave runs round the glass the same way
  (~0.01-0.02 at the glass, swelling and fading over 26 s), as in a gently swirled glass.
- sea (Kelp Forest, Sea Foam): see above.
- surge (Anemone Reef): see above.

Waves come from a uniform push added to the body force (it sways the water as moving the globe
would); currents from the body force with curl in `grid_update.wgsl`. The waves are pumped like
a swing: pushed along the way the water's centre of mass is already moving (the per-frame
centroid readback, stamped with the simulated time it was read at, so its velocity is exact
even when readings skip a frame), hard while the wave is below its height and against it
above, so the wave rides the water's own slosh period (~1.01 s, measured) at a steady height
whatever the fill or grid. A push at a fixed period instead beats against the water's own and,
near resonance, grows huge (the kelp's swell is held off resonance for that reason). For the
swirling wave the swing is split into the part running round the chosen way and the part
running round the other (`(z -+ i z'/w) / 2`, z the centre as a complex number); the first is
pumped, the second calmed. Pumping "against the wave" by pushing backwards round the circle
instead pumps the wave running the other way: it grew to 0.14 at the glass and reversed the
current.

## Performance lessons

- Code compiled into a shader costs even when it never runs: the koi's code in the main pass
  took it from 3.5 to 8.4 ms with the fish hidden (registers, occupancy). Heavy features get
  their own pipeline.
- `var<private>` arrays are poison: a 48-texel pose cache made the photon kernel 3.7x slower
  (1.0 -> 0.27 ms without it), even where it never ran.
- A fragment pass over few pixels with a long loop per pixel is latency-bound: the koi pass
  took ~4.5 ms for ~25k pixels tracing 4 rays in turn; one ray per MSAA sample cut it to ~1.5.
- Cost scales with rays: in the kelp globe one ray a pixel costs 1.6 ms, four 4.5 ms; the kelp
  itself only 0.3 ms of that. Trace more rays only where an edge is near.
- Measure with GPU timestamps: per compute pass (`sim.setProfiling(true)`, `sim.gpuTimes`;
  `'fine'` times each stage of a substep on its own) and per render pass (dev builds:
  `__globes.renderTimes`), A/B interleaved, with the globe at rest (sloshing raises substeps and
  march lengths), and live, in the app's own window. Never trade simulated time for frame rate.
- At 128³ (RTX 4090, Sea Foam, 1712x963, 120 Hz display): at rest 8.4 ms a frame (114 fps), in
  a hard shake 9.0 ms (108 fps): 2 substeps of ~2.45 ms (pressure 0.6, g2p 0.36, p2g 0.25, sort
  scatter 0.25, blur 0.2, splat 0.15, extrapolate 0.14, classify 0.12, project 0.1, shift 0.08),
  per frame photons 0.42, foam 0.28, sand and container 0.22, and the render 2.9 (1.6 at rest, in
  hardware). The GPU is busy all the frame (99-100%); the CPU's share is ~0.1 ms. One ray a pixel
  would draw a hard shake in 1.4 ms (120 fps), but its droplets stair-step and the churn
  speckles. The sort is what made 128³ affordable: unsorted, the transfers and the splat ran
  several times slower.
- A dispatch's workgroups cost to launch even when they return at once: an empty pressure sweep
  took 3.0 us for 4096 workgroups, 2.0 for 2048, 0.9 for 128 (waves of them waiting on their one
  read). But with water in the solve they overlap the wet tiles' work: launching only the 2800
  tiles that meet the glass saved nothing. The wet tiles' sweep is bound by the cache's
  bandwidth: reading a cell's neighbours before its water test (more reads) was slower, and a
  blocked solve (several sweeps a dispatch in workgroup memory) two to four times slower.
- Judge an iterative solve by its residual, not its iteration count: a probe reading the
  equations back found ω 1.85 with 50 sweeps more accurate than 1.7 with 60 (a fifth of the
  solve's time saved). A different ω per cell (gentler beside the air) was worse at every
  setting: it is the bulk that rings, not the surface.
- `clearBuffer` is far cheaper than zeroing from a kernel: grid update zeroing the p2g sums it
  had read went from 0.06 to 0.47 ms, classify zeroing the splat's voxels from 0.11 to 0.21.
- WebGPU usage scopes: a buffer bound both read-only and read_write in one dispatch fails
  validation, even on disjoint ranges. Chrome now fails two read_write bindings of one buffer
  too, where their ranges overlap ("writable storage buffer binding aliasing").
- The marches (render and photons) wait on their reads: reading the next sample with each one
  took a third off a shaking globe's render and a sixth off the photons. Then a second read
  dropped from a step saves little (the photons' sand test above the bed: 5%), and anything a
  few lanes of a warp do on their own (entering a brick to skip it) costs every lane: skipping
  quiet bricks made the render a third slower or worse, and the photons, shaken, a half (both
  exact). Rays traced in
  turn by one invocation cost ~1.8x per ray what rays one an invocation do.
- Exactness tests: det.js hashes every particle and the density field after a scripted shake
  (the light's hash varies run to run: the koi senses the water through a readback a frame or
  two late, and the koi shades the caustics). The particle hash too has shifted between
  sessions of runs with the code unchanged: compare only runs back to back. The same maths
  rearranged (all loads first, a division fused into an add) changes bits through FMA
  contraction, and chaos then changes every hash. A frozen frame measured again and again
  slows (the GPU's clocks drop once only the render runs): only the first measurement after a
  load compares.
- Indirect dispatch (`dispatchWorkgroupsIndirect`) proved slow in Dawn here: dispatch for the
  capacity and let the threads past the live count return at once.
- Phones run Vulkan, where maths D3D12 forgives is undefined: `atan2(0, 0)`, a `smoothstep`
  whose edges run the wrong way round, `min`/`max` with a NaN. The betta bowl's passes give every
  `atan2` its angle at the origin and write every falling smoothstep as 1 - a rising one
  (`bowl-nan.test.mjs` holds them to it, as GlobeView builds them), shade no splash sphere that
  covers none of the pixel (0 x NaN is NaN), and at their end test the colour's bits (a compiler
  may take `x != x` for always false): a NaN or an infinity shows the backdrop instead of black,
  and no colour goes past 60000 (the HDR target's float16 tops out at 65504). `?debug=specks`
  and `?debug=nan` build the bowl's passes painting what each ray met that can make a speck, or
  where its light stopped being a number (the colours in the `?stats` HUD).
- Measuring a phone (`?bench`, `app/bench.ts`): one page, about two minutes, sized for a
  screenshot held upright. The frame at pixel ratios 0.6, 1, 0.8, 1.25, 0.6, 1.5, 2, 1 (coming
  back to some shows a phone slowing as it warms), then at 0.6 and 1 with a part left out (the
  table and its mirror, the fish's pass, the bowl, the sim's step: what each costs, by what it
  saves), then the sim at 0.6 (as the page runs it and, on a phone, as round 2 did: `simq 0`;
  each stage of its substeps in a timed pass of its own, the line of its passes from that row;
  the pressure solve at 8 and 40 sweeps; a shaken bowl at 2 substeps) and the GPU's own cost of a
  dispatch
  (`gpu/dispatchProbe.ts`); and the adapter, its features (timestamps, f16, subgroups, tier-1
  formats), the pipelines built (`gpu/pipelineCount.ts`: the bowl's two large ones, timed, and
  any of them built at once, 'sync', untimed, the first frame that draws with it waiting for it;
  how many were built in the first frame; and any after it, each a hitch, a large one many
  seconds, the first three named) and the load. Other code adds rows with `registerBenchRows`;
  `?bench=<group>` runs one group alone. `?stats` shows the adapter, the pipelines, the splash's
  counts and the last minute's GPU times (a soak), and `?gpu=low` asks for a laptop's integrated
  GPU (Chrome on Windows ignores it).
- Never answer a slow frame with more substeps (see Real time above).
- Nothing heavy on the main thread once frames are running: what can be planned is done
  behind the splash. Each globe's seed (above); every globe's pipelines (each `compileAsync`'s
  synchronous part is ~30-40 ms; run after the first frame, they stuttered the entrance, and a
  switch to a globe not yet built stalled until it was); and the first frame itself (the splash
  lifts once the GPU has finished it: the pipelines first used there, the backdrop's and the
  specks', are built as it runs, which held up the next frames by 33-50 ms with no JavaScript
  running). Measured 2026-10-20 (1712x963): every frame of a switch's swap on time; start-up
  ~0.9 s longer.
- A pipeline takes as long to build as its code with every call inlined, not its text: GPU
  compilers copy a function into each place it is called from. The betta bowl's passes were
  145 KB of text but ~680 K characters inlined (the studio's look copied 48 times, the two
  noises 60 and 72 times with eight hashes each), and their two pipelines took most of the
  phone's 29 s load. Each of those functions is now called from one place, in a loop over what
  the places differed in, the same sums in the same order; the loop starts at `globesZero`, a 0
  the bowl's passes take from a uniform (GlobeView `uBowlDetail.z`), so no compiler can unroll it
  back into the copies (signed, so the loop has no small bound on its trips either). ~380 K
  inlined on the phone's tier, ~400 K on the desktop's; `tools/shader-budget.mjs` measures it
  and `shader-budget.test.mjs` holds each pass to its budget. Cold, in phone emulation on the
  5090 (D3D12), each bowl pipeline built in ~0.7x the time (7.0-8.1 s to 5.0-5.8 s, back to
  back): it is not all in proportion to the inlined size.
- A frozen frame of the phone's tier (?manual, seeded, the same ticks) is not always the same
  frame, even from one build: the world takes one of two courses, run to run (one run in four,
  2026-10-25). In a 400-tick run the water read back at the fish's probes was the same, bit for
  bit, to tick 300; by the end it differed, and so did the fish's swim and ~0.4-0.7% of the frame
  (glints on the fish, the water's underside, a few leaf and bark pixels: most by 1-2/255, ~900
  of a portrait frame's by up to ~100-160). The readback landed at the same tick in every run, so
  it is not late readings, as with the koi (above). The cause is not found yet (a lead: the
  water's centroid, which the fish makes for when it is out of the water, read back differently
  in every run, even in runs that took the same course). The desktop's tier gave the one frame
  in three runs. Shoot each build three times or more and compare a change with HEAD in the same
  course: an exact change matches it within 1/255.

## The app (src/app)

- The stage (`#stage`) fills the window, whatever its shape (the Electron window opens at
  16:9 and takes any shape after); the globe stands in its middle.
- Backdrop: the deep ocean (`globes_ocean` in shaders.ts, `OceanBackdrop.ts`), animated: a
  depth gradient, drifting haze, sun shafts fanning down and swaying, a shimmer overhead, a
  glow behind the globe. The background evaluates it per pixel; the globe sees it through a
  1024x512 equirectangular map rendered from the same function every frame (one texture read
  per lookup, so the hot shader stays lean), plus the sun's disc for its glints. Keep its
  terms bounded: a classic caustic formula that divides by near-zero values blew the upper
  half out to white. Its pieces (`ocean_depthLight`, `ocean_shafts`, `ocean_vignette`) also
  light the specks.
- Specks (`src/ocean/Specks.ts`): 2000 flakes of marine snow (800 on phones) in a box behind
  the globe that tiles the water round the view, simulated on the CPU (~0.8 ms a frame) and
  drawn between the backdrop and the globe (opaque list, `renderOrder` -1, additive: the
  globe covers them, no depth test). Nearly neutrally buoyant (sink ~0.004 units/s); they
  follow the water (0.35 s), wander, and tumble (a quaternion per speck, spin an
  Ornstein-Uhlenbeck process, livelier in a current). Each is drawn as the exact screen
  footprint of its tilted flake: the projection's local Jacobian maps the flake's two
  semi-axes to an ellipse; its covariance, widened by a 0.5 px pixel filter, depth of field
  (focus on the globe) and the motion during a half-frame shutter, gives a Gaussian splat
  whose peak is set so its light stays the flake's (tiny ones dim instead of flickering;
  fast ones streak). Lit by the water's light, the shafts' sunlight (much brighter: they
  stand out in the shafts), and a glint where the face's normal meets the half-vector of the
  sun and the eye (Blinn lobe, exponent 90-350 for the mica-bright half), with a soft halo.
  Specks are world-anchored, so the camera's pan in a switch streams them past (parallax);
  the camera's jump halfway (`controller.panJumps`) moves them too, so it never shows.
- Currents (`src/ocean/Currents.ts`): a 64x36 stable-fluids grid over the stage (advect,
  decay over 1.3 s, Gauss-Seidel pressure projection, still water beyond the edges) that the
  pointer drags along its path (7.5% of its speed, capped), the moving globe pushes, and the
  camera's pan advects (it belongs to the water, not the screen). Specks take its velocity,
  scaled at a reference depth of 12. A press puffs the specks round it outwards and sets them
  spinning (they glint).
- The interface is plain DOM over the canvas (`ui.ts`), sized in stage units (cqh/cqw), and
  spare by request: no text on screen. The mark top left; "Add to desktop" top right (Electron
  only); a pair of arrows under the globe, kept under where it rests (`placeNav`), and the arrow
  keys. Each is an icon, with an aria-label and a tip on hover; the globe's name is announced to
  screen readers only. `AppShell.ts` runs the flow; `catalog.ts` lists the globes (Clear Water,
  Koi, Kelp Forest, Anemone Reef, Sea Foam), and the app opens on the last one shown
  (localStorage; `?globe=<id>` overrides). A globe marked "coming soon" gets a frosted veil that
  tracks its exact outline, an ellipse under perspective: `controller.screenOutline()`.
- The pointer (`cursor.ts`, mouse/trackpad only): a dot at the pointer and a ring that
  follows (stretching along its lag), swelling over controls and over the globe (tilt marks
  either side; with Ctrl held, an orbit round the ring: it turns the globe), tightening while
  pressed, a ripple on each click. The system cursor is
  hidden (`cursor: none !important`, which also beats the controller's inline grab cursor).
- Switching globes slides the globe out one side and back in from the other (a swipe: one
  minimum-jerk move of 10.4 units, further in a wider view, over 1.5 s; the globe changes
  halfway, out of sight, and comes in upright and facing the camera). The globe covers 4.16
  units of the way and the camera pans the rest, so the water feels ~0.45 g: all of it (~1.1 g)
  threw the water about. The backdrop is a function of direction, so a camera
  pan leaves it still (the specks show the motion); its glow is aimed at the globe's resting
  place in the layout.
- At start-up the globe slides in from the right as the splash lifts (1.7 s, sharing the way
  with the camera like a switch). Requests during a move wait for it to end (the latest wins).

## Globes on the desktop (src/desktop, electron/desktop.mjs)

- "Add to desktop" (IPC `globes:add-to-desktop`) opens a transparent, frameless window with
  `?mode=desktop&globe=<id>`, then closes the app window (in that order, so the app never runs
  out of windows); only the new page simulates. Right-click: Open Globes / Remove from desktop.
- The page draws only the globe on a clear canvas (`alpha: true`): the shader is built with
  `GLOBES_DESKTOP`; a ray that misses the glass leaves its sample clear (w carries coverage,
  plus 2 where the koi pass must redraw); the materials are transparent with `NoBlending`.
- What the glass bends is the wallpaper (gsettings picture-uri, its fit), cropped around the
  window and drawn as GNOME shows it. Every ray leaving the globe goes through `globes_bg`:
  heading into the screen it meets a plane 6 radii behind the globe (the water shows it small
  and upside down, like a crystal ball), mapped through the camera to the screen pixel it
  covers, so a ray just missing the glass lands on the very pixel behind it (the desktop
  through the glass joins the real one at the rim). The sample is run backwards through the
  tone mapper (ACES inverted per channel) so it comes out unchanged. Rays heading out into the
  room see the studio's light, dimmer. The water is half as tinted as in the studio.
- GNOME on Wayland tells a window nothing about its position and lets it set none, so the
  desktop globe sits where GNOME puts it (centred: `center-new-windows`) and cannot be moved
  yet; it is a normal window (others cover it). Under XWayland positions work, but WebGPU
  there only gets the hardware GPU with Chromium's Vulkan compositor (SwiftShader otherwise).
  Next: a small GNOME Shell extension to keep it at desktop level, move it (drag by a base)
  and report where it is.
- Tuning/debug: `?deskDepth=`, `?deskClarity=`, `?debugbg` (paints the wallpaper behind the
  page, so a screenshot of the page alone shows whether the view through the glass lines up).

## Interaction (src/interaction)

Tilt θ about z through a pivot 1 R below the centre (the centre swings on an arc → inertial
slosh). Drag = steering wheel around the projected pivot with a minimum lever arm; θ follows a
stiff critically damped spring while held; on release a damped spring rocks it upright
(weighted-base feel). |θ| ≤ 60°, frame acceleration capped at 3 g. Damped wheel/pinch zoom.

With Ctrl held, a drag turns the globe about its own centre instead, as if by its glass:
across, it spins about its own axis (and keeps spinning when let go, slowing at 0.8/s, at most
6 rad/s); up and down, it leans towards or away from the camera, and rocks back upright when
let go, as its weighted bed swings under it.

Units: R_outer = 1, g = 24 units/s² (≈1 s fundamental slosh).

## Phase 2: the bowl's rays, trimmed exactly (WP-H)

The phone runs the bowl at about 1% of its arithmetic peak: it waits on its reads, its registers
and its lanes' divergence. These trims leave every frame as it was, to the pixel (frozen frames,
`?manual`, seeded, 400 ticks, phone and desktop tiers, portrait and landscape, ratios 0.6 and 1;
the page has more than one frozen state run to run, so a build is compared with every state the
one before was seen in).

- No array is indexed by a variable in the bowl's shader but the furnishings' walk's stack. On
  Android, Chrome translates the shader to SPIR-V (Tint), where a const array indexed by a
  variable becomes a private array per invocation, filled from the constant: the nest's 170
  bubbles were 2.7 KB of it. They are rows of the furnishings' texture now (scape/nest.mjs,
  after the vertices; texel 3's w says where), and the big leaves' lengths a switch. The worker
  only leaves room for them: the page has made the nest as it loaded, and writes it in
  (furnishings.ts). Made in the worker too, it held the furnishings up (about 12 ms on a desktop
  CPU, more on a phone). On Windows (HLSL, DXC) the same arrays became constant tables, which is
  why a Radeon iGPU drew them no faster.
- The walks look only as far as the stretch can end: the glass, a flake of food (a tie with it
  is the walk's), and the furnishings no further than the fish. In the air the march comes
  first and the walks look only as far as it got: what lies straight ahead there is mostly
  under the film, past where the ray bends (a CPU model of the phone's camera: ~9% of the BVH's
  reads). Where they meet something short of the march's last sample (the floating leaf, a
  leaf above the water) the march is taken again, stopping there, so its samples are the ones
  it would have taken. Each walk and the march are still inlined once. The Radeon iGPU drew the
  bowl in the same time, within 1%, at ratios 0.6 to 2 (phone tier upright and on its side,
  desktop tier). `?walks=0` has the walks come first again (the same picture), to time the two
  on a phone, where lanes in the air and in the water mixed in a wave may cost more than this
  saves.
- The desk's matrices are left out of the bowl's shader (it stands in its studio).
- The furnishings' walk keeps its stack: walks without one read more and wait on more of their
  reads in turn (see scapeBVH.mjs), and the one tried drew no faster on the iGPU.

## Phase 2: the sim's dispatches, fewer and cheaper (S1)

The plan's model takes a phone's sim to be bound by launching its dispatches more than by their
work: the S25 Ultra took about 6.1 ms for 151 a frame at 2 substeps, ~40 us each, work and all,
where the 5090 takes ~5 us. What a launch alone costs on a phone is for its ?bench=sim to say; the
GPUs here say little for it (the fused sweeps, below). These leave the water exactly as it was: the
determinism harnesses (a scripted tilt, roll and spin, every readback waited on) hash the
particles, the density field and texture, psi, the face and cell grids, the sand, the caustics, the
light volume and the march band to the same bits on the phone and desktop tiers, on the betta page
and the globes page (kelp, reef, koi, foam; what differs between their runs, the koi's light and
the probes, differs between runs of the same build too).

- **Fused pressure sweeps** (pressure_fused.wgsl, built for grids of 48 and under, run only with
  `?fused=1` or when FluidSim.fusedSweeps is switched on, which a bench may do between frames to
  time both in one load). A workgroup reads its 16x8x4 tile with two cells round it into workgroup
  memory, relaxes the red cells of the tile and one round it (those round it are its neighbours'
  too, worked out the same way from the same black cells), then the tile's black cells, and writes
  the tile into the other of two psi buffers: 24 dispatches a substep where the two colours take 48.
  The sums are pressure.wgsl's, in its order (pressure-sweep.test.mjs runs both walks over the
  cells and holds the shader to them). cellPrep holds the second buffer at nought off the water
  too (while the sweeps go as two colours as well), so dry tiles (which stop at once) are right in
  both, and the sweeps can switch from one step to the next (the hashes are the same with them on,
  and with them switched every seventh frame); they go in pairs, so the solve ends in psi (an odd
  one left over goes as two colours). They pay only where a launch costs more than the
  work they add, and no GPU here is such: on the 5090 (launches of 1-2 us) they took 0.72 against
  0.52 ms a frame at 64^3, and 0.22 against 0.16 at 40^3; on this desktop's Radeon iGPU (2 CUs,
  reached with Chrome's `--use-adapter-luid`: on Windows it ignores powerPreference), the betta's
  sim alone at 40^3, switched back and forth in one load, 3.56 against 1.10 (the whole sim 22.1
  against 19.6), most likely for a fused workgroup's long chain (its box loaded, the red cells of a
  ring round the tile relaxed, then the black, a barrier between each), which a small GPU waits
  on. So they wait for a phone's own numbers.
- **The density blur's run** from the map's size (blurRun: at most 64, at least 16, the longest
  that still gives the dispatch 512 workgroups). At 80 a side 64 made 50 workgroups each walking
  70 slices in turn; 16 makes 125 walking 22: 0.094 -> 0.033 ms a frame on the 5090, and at 128 a
  side (the betta's desktop) 0.140 -> 0.059.
- **Two jobs a dispatch** where neither reads what the other writes: grid update and the cells'
  classification (the cells' workgroups after the faces'), the caustic map's resolve and the light
  volume's (the voxels' after the texels'), the water's centre gathered in the shift's threads
  (on its own between shifts). sim-dispatch.test.mjs holds each dispatch to where its shader
  looks for the second job.
- **The march band in the sim's frame** (FluidSim.onWaterBuilt): render/marchBand.ts works it
  out in the sim's encoder once the last substep's water is built (and for new water), for every
  bowl, and the photons coming in through the air step over their samples over its x by whole
  steps, unread (caustics.wgsl): 0.172 -> 0.144 ms at 64^3, 0.296 -> 0.223 at 128^3 on the page.
  (Skipping the open water's samples as well, as the renderer's march does, was slower: the test
  at every step cost more than the reads it saved.) The band's own encoder and submit are gone. Its
  pass is timed with the sim's: on a desktop it is new work, and on the 5090 about even (0.016 ms
  for the band at 64^3, against 0.028 saved in the photons on the page, and 0.010 in the sim alone
  with the band and without), while a small GPU gains (the Radeon iGPU, the sim alone: 0.20 against
  1.55 at 64^3; at 40^3, where phones had the band already, 0.05 against 0.15-0.21).
- **The splash's kernels 256 wide** (spSpawn, the wet map, the drop map and merge, the map
  resolve, the bins' counts): a quarter of the workgroups, most of which had nothing to do; and
  this frame's pools' counts emptied by the bins' counts' first thread, not a dispatch of their
  own. (Its pools follow the atomics' order, which varies run to run; the water does not read
  them.)
- **sandExtend** works out each column's surface (bare glass looks up to four columns away for
  sand) once for its workgroup, in workgroup memory, and smooths from that, instead of nine
  times: sand + container 0.124 -> 0.112 ms (64^3), 0.074 -> 0.062 (40^3).

Phone tier, 2 substeps: 150 -> 146 of the sim's dispatches a frame (with the march band's 3, now
in the sim's encoder: 153 -> 149), and the sim's encoder's WebGPU calls 398 -> 394; with the fused
sweeps, 98 dispatches and 298 calls. Left for the phone's own numbers (?bench=sim, with a row that
switches FluidSim.fusedSweeps): whether the fused sweeps pay there, and only then two sweeps a
dispatch (a 24x16x12 box, 18 KB of workgroup memory, a longer chain still). Not done:
the particle band (the grid kernels' workgroups over the water left alone). At 40^3 those
workgroups are 8 cells tall: over the betta's water at rest a dispatch could leave only the top
row of them, a fifth of the cells, and only in classify, cellPrep, project and the blur (not in grid
update or constrain, whose velNew there changes every substep, dt times the body force; nor in
extrapolate, which reaches two faces further), and none while the water moves. And what they
leave as it was is right only while nothing they read changes over the water: sand carried up the
glass by a tilt does (the cells' faces). About 0.1 ms on the S25 at rest, by the model.

## Phase 2: the sim's work by what there is to do (S2)

The S25 Ultra's ?bench (round 2) took 6-8.7 ms a frame for the sim, at rest: flip substeps 4.36
(two), the splash 1.70, the density field 0.90, the photons 0.89, sand and container 0.70. It is
not bound by launching its dispatches (0.8 us each there). Two kinds of change: the same water,
less work; and, on phones only, lighter settings while the water moves little (`sim/simTier.ts`,
`FluidSim.runtime`), with `?simq=0` running a phone's sim as round 2 did.

The same water, every globe (the det harnesses: the particles, the grids, the field, the sand,
the caustics and every texture the renderer reads hash as before on the phone's tier with
`?simq=0` and on the desktop's; the splash's own pools follow the atomics' order run to run, as
before):
- **The splash's counts** are loaded once a workgroup (`sp_poolCount`): every thread of a pool's
  kernel loading the one count from the same word took its turn at it (spBin, its pools empty,
  0.09 -> 0.007 ms on the Radeon iGPU; spDrops with 380 drops 0.13 -> 0.03).
- **The drop map's kernels by the drops there are.** At rest a few hundred drops lie on the glass;
  a thread a drop walking its texels in turn, spDropMap and spDropMerge waited on a few long loops
  with most of the GPU idle. While fewer than 1024 are on the glass (as last read back), LANES (16)
  threads take each drop's texels between them (`spDropMapTeams`, `spDropMergeTeams`), the drop's
  reach worked out once, by its first lane; a lane passes over any drop smaller than one its team
  has found, and the drop goes into the largest found, of that size the first listed (as one
  thread finds it: drop-map.test.mjs, with the lanes' steps in random orders). With many, a
  thread a drop as before (shared among lanes, 12,000 drops took 2.8 against 1.7 ms). Two more
  small pipelines.
- **The map resolved over the tiles drops reach.** spDropMap marks each 16x16 tile of the map a
  drop reaches; spMapResolve works the tiles marked this frame or the last (the rest hold none,
  as they did) and empties last frame's counts there: the counts are kept for two frames (by
  S.cur), and the 1 MB clear a frame is gone.
- **The wet map** leaves the glass that was dry and lies over all the water (over the march
  band's x, where no read blends a voxel of the water; FluidSim.marchBand, also bound where a page
  has no band: it then leaves nothing out) as it was: most of the dome, at rest.
- **The rock's and the bed solids' tops** (rock_bed.wgsl, 80 steps down each column) are worked out
  again only when the globe has turned (its orientation's floats changed); rockPrev is copied once
  more after, so the sand's rotation reads what it read before.

On the Radeon iGPU (the betta's sim alone, the phone's tier, 2 substeps; `?simq=0` here, so these
alone): the splash at rest with 380 drops 1.01 -> 0.36 ms, with 13,000 drops 3.53 -> 3.30; the
whole sim at rest 14.9 -> 14.2.

**The phone's runtime** (`PHONE_SIMQ1`; none of it a pipeline: `?bench`'s rows switch it between
frames):
- Pressure sweeps by how much the water moves (`FluidSim.agitation`, from the bowl's motion and
  the fastest particle read back): 12 a substep calm (the bowl still and the fastest under 2 for
  3 s), 20 moving, 24 in a hard shake (fastest over 6). Measured on the sim alone, scripted
  (rest, a tilt held and let go, a hard shake, rest; and fish gulps at the film every 2.5 s, as
  the betta's): the resting divergence 1.6e-3 against 1.1e-3 at 24, the slosh's kinetic energy
  falling to half in the same 1.5 s, the ripples' roughness the same (2.5e-4). Any change at all
  (20 against 24) leaves the gulps' ripple fields 15% apart in a few seconds; 12, 21%.
- The photons in two halves of their rows, the even and the odd a frame each, each half laying its
  deposits into its own half of the caustic map and the light volume; the resolves add both (all
  the rays of the last two frames) and, half of the flux being a frame old, take more of the new
  each frame (0.75 for 0.6, 0.42 for 0.35). The caustics' mean the same, their contrast within
  0.1% at rest and 1.5% in motion, their change frame to frame within 4-9% of the full trace's
  (taking 0.6, in motion 15-20% less).
- While the bowl stands still (0.5 s), the bed the water, the light and the picture see (the
  sand's surface, extended, and the container's faces and cells) is built every fourth frame; the
  sand still flows every frame (the sand's thickness the same, to the bit, after a tilt and a
  shake).

On the iGPU, all of it against round 2: at rest 14.9 -> 12.0 ms (the flip substeps 6.5 -> 6.2, the
photons 3.2 -> 2.1, the splash 1.0 -> 0.37, sand and container 2.1 -> 1.3), with 13,000 drops on
the glass 18.5 -> 15.7, a hard shake (3 substeps) 25.8 -> 23.8. In phone emulation on the 5090
(latency-bound, as a phone's sim is much of the time): at rest 0.61 -> 0.38 ms (the splash 0.17
-> 0.05), shaken hard the same (1.12). The sim's dispatches a frame at rest 147 -> 95.

Dead ends, measured on the sim alone:
- One substep a frame while calm (1/60 s, the FLIP blend made as much a frame as two took): the
  resting water four to six times as lively, with flicks of divergence (a particle flung at the
  film), at 12, 24 and 40 sweeps alike.
- The sand every fourth frame for four frames' time: its slides are capped a substep, so they
  slowed (the bed 0.016 apart, RMS, after a shake). Fewer sand substeps once the bowl had stood
  still 3 s: still 0.01 apart.
- Extrapolation from a tile read into workgroup memory with two faces round it (most faces
  outside the water read 42 neighbours from memory): no faster on the iGPU (1.62 against 1.54 ms),
  and slower with the validity in bits (2.35).

Left for the phone's own numbers: `?bench`'s `sim fine` row times each stage of the substeps
(p2g, grid update, cell prep, pressure, project, extrapolate, constrain, g2p, the density field's
splat and blur) where the S25 has only ever shown the flip substep whole; and `simq 0` against
`sim` is what this costs and saves there.

## The betta in a worker (src/fish/Betta.ts, bettaSpecimen.mjs, bettaLink.mjs, bettaWorker.mjs)

Phase 2 of the phone work. The betta's update was most of a phone's main thread (7.7 ms of 9.1 in
phone emulation at 2.75x CPU throttle; 9.2 ms on the user's S25 Ultra), too much for a mid-range
phone's 16.7 ms frame.

- **Split.** `BettaSpecimen` (bettaSpecimen.mjs, no DOM, no GPU) is the fish as the CPU moves it:
  the Atelier specimen on the bowl's route (bettaSwim.mjs), its fins solved, skinned into one list
  of vertices, kept inside the glass, above the bed and out of the furnishings' solid parts, its
  probes, mouth and disturbance of the water. `Betta` keeps what needs the page: the BVH's texture
  and its GPU refit, the atlas, the visible flag. Moved on the page's thread it is the code it was,
  bit for bit (vertices, probes, mouth, swim and disturbance checked against 59903ac44 over 3000
  frames at 37, 60 and 120 fps on the phones' fin settings and 60 on the desktop's).
- **The worker.** On a phone (`LITE`) with four cores or more, a twin of the specimen is built in a
  worker as the page loads (`createBetta({ textures: false })`: the photographs stay with the page)
  and moved there. Each frame `Betta.update` takes the pose the worker made of the last frame's step,
  uploads its vertices for the GPU refit as before, and from then on the page reads that pose's
  probes, mouth and swim (the water's probes, the food, the nest), so the fish drawn and the fish
  the water and the food meet are the same; then it sends this frame's step. The fish is hidden
  until the first pose is back.
- **Bit for bit.** A step is one Float64Array (about 1 KB: dt, FIN_QUALITY, the globe, the host's
  inputs, the water's readings, the obstacles), a pose one ArrayBuffer (81 KB: float64 head, float32
  probes and vertices); both are handed back and forth, so a frame makes neither. Every number
  crosses as the float it was, so the worker's fish moves exactly as the page's would on the same
  inputs: `betta-worker.test.mjs` (480 frames through a real worker thread, the fin settings
  changed midway), and over 3000 frames at 37, 60 and 120 fps and on the desktop's fin settings, the
  real Betta.ts in a worker thread against Betta.ts on the page's thread, one frame later: uploaded
  vertices, the refit's BVH (its CPU mirror), probes, surface column, mouth, heading, mode and
  disturbance all bit-identical.
- **Late replies.** Poses are taken oldest first: a reply that misses its frame costs a frame of
  delay (two behind), not a frame held and the next skipped. Once a second pose has been waiting 120
  frames in a row, one is skipped to be a frame behind again (its disturbance still taken). At most
  two steps go unanswered; past that a frame's time goes with the next step. In phone emulation the
  reply comes back in about 2-3 ms (p90 3-4, max 6-20). A worker that never comes up, or stops
  answering without an error (a stalled fetch of its script, a hang), is given up after 300 frames in
  a row with no pose to take, as if it had failed (below).
- **The bowl turning.** The pose is drawn a frame or more after its step, with the furnishings where
  the bowl has turned them by then, so the obstacles are sent turned on by the bowl's spin for that
  long (`omega` times the lead: a frame, and one more for each pose to be drawn before this one, both
  those waiting and those of the steps still unanswered, as with a worker slower than a frame). In a
  drag, the far end of the wood moved 0.018 sim units a frame (max 0.085; the fish is 0.26 long); the
  lead leaves 0.005 (max 0.067, when the spin changes). Counted so, the lead is right for every pose
  while the worker keeps up with the frames (a simulated worker taking 3-15 ms a step, 1 ms each
  way, frames 16.7 ms apart); one that cannot (18 ms) draws 16% of its poses a frame later than led,
  its own reply being late, which no count can see.
- **The bowl turned about its own axis** (two fingers, a right- or Ctrl-drag) carries the fish round
  with it, as the hand turning the bowl would (BettaSwim.turnWith: where it is and goes, where it
  displays, the ways it faces; the water keeps its own motion). Each step carries it by the turns
  since the last step was sent, and its pose is drawn carried on by those since its own step
  (BettaRemote.take), so it keeps its place among the furnishings however late the reply; the lead
  above is the spin less that turn (a tip or a roll), which the fish is not carried by.
- **Switches.** `?worker=0` moves it on the page's thread; `?worker=1` in a worker anywhere
  (desktops stay on the page's thread by default: their frames are not short of time). `?manual`
  moves it in step with its ticks unless `?worker=1`. A worker that fails, cannot start or goes
  silent hands the fish back to the page's thread (from where it was built).
- **Measured** (phone emulation, 412x915 at dpr 2.625, 2.75x CPU throttle, RTX 5090): the betta's
  lap 7.7 -> 0.1-0.3 ms (update p50 0.2, p90 0.3-0.5 ms: the 81 KB upload, the refit's dispatch, the
  post), the main thread 9.1 -> 1.1-2.5 ms a frame, 37 -> 49-60 fps (the GPU shared with other
  work). The worker's chunk is 377 KB (95 KB gzip). The load's times stayed within run-to-run noise,
  but there the worker (started as the page loads, beside the furnishings' worker) runs at the PC's
  speed, unthrottled: its effect on a phone's load is unmeasured. A desktop with `?worker=1`
  (1280x800, frames unpaced): update p50 2.9 -> 0.7 ms.

## Phase 2: the bowl on a lattice, made whole again (src/render/bowlRender.ts, bowlResolve.mjs)

A phone's frame is mostly the bowl's rays, and each pixel's costs about the same whatever the
picture's sharpness. So on phones (`LITE`; `?up=2`, the default there) the bowl is drawn into targets
of its own and traced each frame on a 2x2 lattice, a quarter of the picture's pixels, a different
pixel of each 2x2 block each frame (the corner, the opposite corner, then the other two), so every
pixel is traced once in four frames; the picture is then made whole at full size, and the fish is
drawn again at full size, as the page has always drawn it. Desktops draw the bowl straight into the
frame as before (`?up=0`, which is also the phone's kill switch); their shaders are the same text,
byte for byte.

- **The frame.** The lattice: the bowl's own pass (its two meshes again, in a scene of their own,
  sharing materials and geometry), through a copy of the camera whose view is offset by the frame's
  phase (`setViewOffset`), into a half-size target; the fish's pass is left out there. The change
  test: one texel a block, the new sample against the one traced four frames before (below). The
  picture: the resolve, on the bowl's sphere, into a full-size target, writing in the depth where the
  fish is near (its depth 1), then the fish's pass over those pixels (`LessDepth`, as over the bowl
  pass's marks before). The frame: the backdrop and the table, and a composite on the sphere's
  outline that puts the picture in, after the table; the table's mirror still traces the bowl itself,
  its pass on a layer only the mirror's camera sees (`StudioBackdrop.alsoMirror`), at the mirror's
  own sharpness.
- **One pipeline each.** three keys a render pipeline on the material and the target's colour
  format, colour space, samples and depth format: the lattice, the picture, the table's mirror and a
  phone's frame buffer are all half floats in the working colour space, single-sampled, with a depth
  buffer, so bowl and bowlKoi are built once each (the pipeline counter: 2 large, none late; three
  small ones more). Two traps found on the way: three's `screenSize` node makes a new uniform each time
  a material is built, and the bowl's is built once for each render context (the frame's, the
  mirror's), so its uniforms came out in another order and it built a second bowl pipeline (a uniform
  of its own, set as each draw is made, instead); and `compileAsync` builds for the renderer's depth
  setting, not the target's, so a pass into a target without depth was built again in the first frame
  (every target has one).
- **The same rays.** Where the passes write ids (`bowl.ids`, below), a ray is worked out from its
  pixel of the picture and the camera's matrices, not from the sphere's surface where it is drawn:
  on the lattice from the picture's pixel `2 texel + phase` and the unshifted camera's projection
  (`GlobeView.setBowlLattice`). Interpolated over the shifted projection instead, the rays differed by
  a rounding (~1e-7) and chaotic places (the water's line, its underside) came out otherwise.
- **What each ray ended on.** The passes write it in the colour's alpha, 1 + a code (bowlResolve.mjs
  HIT: the room through the air or through the water, sand, wood, rock, a plant, the fish, the lid,
  the water's surface, spray or a bubble or a pellet; plus 16 where the ray met the water's surface on
  the way), from a private set where the ray ends and read after the trace (`globes_hitIdOf`). An
  opaque material's alpha is made 1 by three, so those passes blend with `NoBlending` (the same).
- **The resolve**, per pixel (bowlResolveWGSL.ts; worked on the CPU in bowlResolve.mjs, which
  upsample-resolve.test.mjs holds to it): its own last sample (its phase's lattice, its block's texel)
  is kept as it is while it was traced since the view last moved and is neither the fish nor spray;
  where a block round it (of nine) has changed since, it is held within what this frame's nearest four
  samples span; where four or more of them have, it is filled in. Filled in: covered where its nearest
  four mostly are, by EASU (AMD's FSR 1, adapted from three's FSR1Node, MIT; no sharpening) from this
  frame's lattice, its luminance for edges squashed (x / (1 + x)) so a glint does not stand for every
  edge, the fish's samples left out where its pass draws them. Every sample read is scrubbed by its
  bits (a NaN or an infinity as nought: a miss). The fish's pass draws a pixel again where one of
  this frame's nearest four samples is the fish (its box: the bowl's pass marks every ray that passes
  through it), or one of its block's samples still good is (so its pixels' own rays, in the last four
  frames: slivers thinner than the lattice are not lost).
- **The change test** (bowlResolve.mjs `changed`): a block has changed where its new sample's
  luminance differs from the one four frames before by more than 0.6 of the brighter's, or by more
  than 0.04 where what the ray ended on changed too. The plan's 0.04 alone, with a change filled in,
  crawled: the sun's dapple on the bed and the wood drifts ~0.3 pixels in four frames, and its sharp
  lines failed the test everywhere, filled in from a lattice in another place each frame. The plan's
  "an id still beside it" test went too: lines thinner than the lattice (the water's line against the
  glass) never had their id beside them, and were never kept. And drops on the glass and the nest are
  kept like anything else (the plan had them never kept, so wet glass would never be sharp).
- **Moving.** A frame whose view moved the bowl's picture by more than 0.05 pixel (the camera's turn
  and travel, the bowl's, its lid's; any change of projection, of the lid being there, of its lamp)
  keeps nothing traced before it, nor does the first still frame after (traced with the lattice's
  footprint: while the view moves, `lit.z` is the lattice's, so a picture filled in does not sparkle);
  so a roll, a zoom or the entrance glide is drawn at the lattice's sharpness, filled in, and is sharp
  again four frames after it stops. While it moves the lattice holds its place (Schedule): moved on,
  each frame was filled in from another place and every edge buzzed with the four-frame cycle
  (a camera drifting 0.04 px a frame: 17.5k pixels off by more than 8/255 from one grab to the next,
  against 3.3k drawn straight; held, 5.0k). The bowl rocking back upright after a roll stops dead
  under a ten-thousandth of a radian (GlobeController), and under 0.05 pixel a frame counts as still,
  so the long settle after a roll is not drawn at the lattice's sharpness. A new size or pixel ratio,
  a new mode, a gap of 250 ms between frames and the first frame start afresh.
- **Measured** (phone emulation at the S25 Ultra's 384x693 CSS px, the RTX 5090; frozen frames:
  `?manual`, seeded, 200 ticks, the same page drawn in each mode, so the same shaders and the same
  world). At rest the picture is the full trace's, pixel for pixel: 0 of 2.1M pixels differ, upright
  and on its side, at ratios 1 and 1.5; four frames after a roll stops it is again (bar the splash's
  bubbles, never kept). The pipelines: 82 built (79 with `?up=0`), bowl and bowlKoi once each, 3 in
  the first frame as before, none late. GPU time of the frame's passes at pixel ratio 4 (where the
  5090 is not bound by latency): 2.05-2.16 ms drawn straight, 1.43 on the lattice (the lattice 0.67,
  the change test 0.01, the resolve 0.035, the fish's pass at full size ~0.5, the composite 0.04);
  at the phone's own ratios the 5090 is latency-bound and the two are even. On this desktop's Radeon
  iGPU (2 CUs, a small GPU's stand-in; its timestamps read nothing, so the wall time of a frame to the
  GPU's done, the bowl alone, the sim not stepped): at ratio 1, 232 ms drawn straight against 75.9 on
  the lattice (one page, the two switched, twice each); straight at 0.5, 87.5 ms; on the lattice at
  1.5, 127.6. With the fish traced on the lattice instead of again at full size, 92.8: its rays, sparse,
  cost more than dense ones. The main thread (phone emulation, 2.75x throttle): the draw's share 0.7
  -> 1.1-1.2 ms, for three render calls more. Flicker at rest with the
  world live (frames drawn one by one, the mean second difference in time of each pixel's 8-bit
  luma over the bowl): 0.67 drawn straight, 0.73 on the lattice (the plan's rules: 3.4); the mean
  error against the full trace of each frame 0.22-0.23 of 255.
- **Switches.** `?up=0|1|2` (1: in a target of its own at the picture's size, the same picture, or with
  `?upin=0.5-1` traced at that share of it and filled in), `?fishfull=0` (the fish traced on the
  lattice with the rest), `?updebug=id|age|changed|nan`, and for tuning `?uptau=` and `?upwide=` (the
  change test's threshold; how many of nine blocks round a pixel must change for it to be filled in).
  ?bench's `up` group times up 0 against up 2 at ratios 0.8, 1, 1.25 and 1.5, and 2 with the fish on
  the lattice at 1. For the ladder: the picture is the drawing buffer (the pixel ratio the scaler
  picks is the picture's sharpness: a step starts the picture afresh), `BowlRender.setMode` picks how
  it is drawn, `tracedShare()` says how many rays a pixel costs.

## Phase 2: a phone's picture steered by the GPU's time (src/app/quality)

The phone's scaler (app/adaptiveScale.mjs) stepped the pixel ratio by the frames' pace and the main
thread's time. On the S25 Ultra the GPU is the limit, and it slows as it warms (30-40% within a
minute at the same settings), so phones now step along a quality ladder by what the GPU measurably
spends on a frame (desktops keep the scaler; `?quality=0` gives phones the scaler back).

- **The ladder** (quality/ladder.mjs, data): the sharpest level, at the screen's ratio up to 2;
  then the table's mirror redrawn every other frame while nothing moves (a frozen frame is the
  same to the pixel); then the ratio down in steps of 0.9, through 1, to the floor of 0.6; then the
  water march's step at 0.75 and 0.9 voxels (a few pixels of the water's edge seen from below
  move: at 0.75, 2% of a portrait frame's pixels, 0.2% by more than 8/255). Every knob is a canvas
  size, a uniform, a pass skipped or a dispatch put off: no level builds a pipeline (none built
  after the first frame across ratio, mirror and march switches, in phone emulation), and a switch
  costs its frame about 1 ms. On phones the march band (marchBand.ts) is worked out for the longest
  step a level takes, so it holds at each (a band for a longer step leaves out no more reads: the
  frame is the same). Tried and left out: fewer samples of the lamp's haze (bowl.ts, through
  uBowlDetail.x): at 3, a hot spot under the lamp and moire through the haze; at 2, coarser
  streaks. The plants every third frame, then 30 fps, are the main thread's ladder (CPU_RUNGS).
  The interleaved bowl (?up=2) is not a rung: phones draw it so at every level, and the cost model
  takes its steady share of traced pixels into its cost of one. (The march rungs' saving it then
  overstates a little: the resolve and the composite do not march.)
- **What it measures** (quality/pageQuality.ts, GpuClock): three's render passes (trackTimestamp,
  now on in production on phones) and the sim's compute passes (FluidSim.setProfiling), one resolve
  in flight at a time, so a frame's times come in a few frames late, about every other frame; on a
  device without timestamp queries, the queue's pace. And the bowl's area on screen (its outline,
  1.15x for the lid, clipped to the stage), now and at rest in this view.
- **The cost model** (CostModel): the sim as measured, plus a fixed part (the mirror, the backdrop,
  the output) and a cost per traced bowl pixel (area x ratio squared, by the march step's share),
  fitted by least squares to its windows (older ones counting less: a warming GPU drifts), the fixed
  part drawn towards about 0.006 million pixels' worth where the windows cannot tell the two apart.
  A level's cost is the model's prediction scaled to what the current level measures, so a zoom in,
  a turn of the phone or the bowl coming into view keep the traced pixels about the same.
- **The controller** (quality/controller.mjs, pure; quality.test.mjs): 1 s windows, trimmed means.
  Over the 14.5 ms budget (or frames slow with the GPU over 12.5): straight down to the sharpest
  level expected at 13 ms or under (one to three rungs), then a dwell of 2 s. Up one rung after 8 s
  held, if expected at 12 ms or under; taken back at once if it does not hold, the next try twice as
  late (to 64 s). Slow frames that neither the GPU nor the main thread explain: a rung after three
  windows, taken back if it bought nothing. The main thread over 11 ms moves only its own ladder.
  While the bowl moves (its pose, the lid, the camera, or water sloshing: more substeps than a calm
  frame takes), a rung down at once if the GPU goes over, put back 1.5 s after it is still; those
  frames teach nothing. At the lowest level, with frames that cannot come at 60 (over 15.5 ms) for
  three windows, 30 fps (FramePace.frameMs), said so in ?stats; back to 60 once the lowest level at
  60 is expected to hold for 20 s. Calibration: as the bowl comes into view in the entrance, every
  timed frame is a point of the model, then straight to the sharpest level that fits; and in its
  first window at rest, up to the sharpest expected at 12 ms if that is sharper (a try). Thermal
  memory: the level held longest over the last two minutes.
- **Where a view starts** (quality/record.mjs): localStorage `betta.quality.v1` (every access in
  try/catch), for the device (its GPU's name and its screen) and each way up: the level held
  longest (written every 30 s and as the page is hidden; a rung lower in another build), and how
  long the bowl's pipelines took to build (the splash's bar). With nothing kept, the GPU's name
  (PRIORS: its speed against the S25's Adreno 830) and the S25's measured costs pick the level.
- **Switches**: `?quality=0` (the scaler), `?level=n` (held at level n), `?adapt=0` and `?bench`
  (the sharpest knobs at 1 CSS px, as before). `?stats` shows the level, its knobs, the GPU's time
  against the budget, the prediction, the level held longest and how much more a pixel costs than
  when the GPU was coolest, and the last move and why.
- Measured on this desktop only (the 5090; the Radeon iGPU through `--use-adapter-luid`): the 5090
  holds the sharpest level at a phone's size (the old scaler, in headless emulation, stepped down
  to 0.9 for frames the compositor paced at about 20 ms); the iGPU, about a tenth of the S25, sits at
  the lowest level at 30 fps. A model of the S25 (bench 3's costs, 35% slower as it warms) settles
  at the floor's ratio with the march's longer steps: its sim and its bowl are what must get
  cheaper.

### The resolution menu (app/resolution.mjs, ResolutionMenu.ts)

The betta bowl's page has a "Resolution" button in its link bar, beside "← Demonstrations". Auto
(the default) is all of the above: the sharpest picture that keeps 60 frames a second. A fixed size
holds the picture at 1, 1.5 or 2 canvas pixels a CSS pixel, or the screen's own (a phone's 2.6 to
3.5) however slowly frames then come: past the screen's own (a desktop's 1.5 and 2) it is drawn
larger and shrunk to fit, supersampled. Held, a phone's other knobs are at their sharpest (the
ladder's first level) and nothing is stepped; the GPU's times are still taken and let go. Auto again,
the controller (or the scaler) starts over from where it stood. The choice is kept on the device
(`betta.resolution`: 'auto', 'screen' or a ratio offered on that screen; anything else is Auto).
Phones still trace the bowl on the interleaved lattice at a fixed size: still, it comes to the full
size in four frames. ?stats says "resolution held at ...". Tests: `resolution.test.mjs` (3).

## Phase 2: the studio while the bowl builds (L2)

The betta page showed its splash until the bowl's pipelines were built (10.7 s on the S25; about
8 s of it the two compiling side by side). Now, right after the renderer is up, the studio
(backdrop, table and its mirror; the camera where the entrance starts, the bowl out of sight) has
its small pipelines built, is drawn once (and again whenever the stage changes size: nothing in it
moves), and shows through the splash, thinned to a veil, while the rest loads. The splash's bar is
determinate (main.ts LOAD: the load's steps, the bowl's build filling it over the time it took on
this device last time). The studio's first frame is drawn before the sim is set up, so three's
error scopes never close among the sim's; the globe is kept out of its frames until its pipelines
are built. Cold, in phone emulation (384x693 at dpr 2.81, 2.75x CPU; two sets of three runs
interleaved with the build before): the first picture at 0.89-1.09 s (it was the splash lifting,
at 8.8-10.3 s); compiled no later (8.7-10.0 s, against 8.7-10.2); the splash lifts 0.06-0.08 s after
it (0.12-0.15: the backdrop's 3 pipelines were built in the bowl's first frame; now none); no frame
of the entrance over twice the median, no long task in it, none built after the first frame.

The betta's atlas is composed as before (Betta.ts: drawImage of its five photographs as they load).
Decoded off the page's thread by createImageBitmap of their files, its pixels differ by up to 14/255
(the browser decodes them otherwise); by createImageBitmap of the images themselves, the decode stays
on the page's thread. It costs the page's thread about 120 ms at 2.75x CPU as the photographs come
in, about a second into the load: behind the studio, which does not move.

## Learn mode (src/app/learn)

For people who keep bettas, the betta page's **Learn** button (beside Feed and Flare fins; off at
first, remembered on the device: localStorage `betta.learn`) explains what the fish does and what is
in its bowl. Every word is in `content.ts`, for review: a card for each thing a tap can land on, a
caption for each behaviour, the feeding advice; each a kicker, a title and two or three sentences.

- **Captions** (`captions.mjs`, `Learn.frame`). The swim's mode (`Betta.swim.mode`: the page's fish,
  or on phones the worker's last pose) is a behaviour: cruising, hovering, a trip to the film for air
  (rise, gulp and dive are one), displaying at its reflection, a lap, resting on the sand, a startle,
  taking a pellet (a burst and the glide after it are only the route's). One is captioned once the
  fish has kept at it a moment (0 to 3 s), never over another card nor within 20 s of one going,
  and the same not again for 5 minutes (15 for cruising and hovering, which it does all the time).
  Moments too: the nest growing as the fish comes back from the film (`BowlLife.bubbles`), a pellet
  settled uneaten (`FishFood.landed`), the fins flared at the button (at once, over any card).
- **Taps** (`pick.mjs`). A tap (a press let go where it began within 450 ms, no second finger down
  meanwhile: main.ts) is followed into the bowl as the viewer sees it: the lid first, on the
  straight line (`BowlLid.hits`, as a click on it always was); then Snell's law into the glass, out
  of it into the water or the air over it, and down through the film (a film met beyond ~75 degrees
  is a mirror: the water). The first thing met after that is what was tapped: the furnishings, their
  BVH traced on the CPU (`scapeBVH.mjs traceCPU`, in the bowl's frame, on the texels the page keeps
  from `furnishings.ts`: the plants at rest), then `surfaceCPU`'s material, and the mesh by its first
  vertex (`parts`, each mesh's name and vertex count, now handed over with the BVH) for a stem or a
  root; the fish (within 0.06 of a probe); the floating leaf and the nest (boxes round them at the
  film); the sand (the bed's top at rest, at once below it). Past them all, the water; through the
  glass and the air over the water, the bowl. The heater's materials (8, 9, 12) and the filter's (10,
  11) have their cards; a material it does not know gets none. With Learn off a tap is what it was.
- **Feeding** (`feedLog.mjs`). Every pellet `Feeding` lets go is counted (`Feeding.onDrop`, Learn on
  or off). As a meal is asked for (Learn on): how to feed a betta, or, within 4 hours of the last
  meal, that it has just eaten, or, with six pellets or more in the last 12 hours, that it has had a
  day's food. A meal is three pellets now (it was four). With Water mode on, the
  food is counted by its clock (its routine's meals, which never lift the lid, and each Feed's
  pellets at the time the meal was asked for), so a Feed soon after a routine meal is told so.
- **The card** (`.learn-card`, styles.css): one at a time, a polite live region (its words cleared
  once it fades, so the same card again is read out). Low at the right on a wide screen; on a phone,
  across the foot over the page's link (the controls give the specimen's name a line of its own to
  fit 384 px), or up top, in smaller type, with `?stats`' figures up. A caption stays 5 s and 0.12 s
  a word, a card asked for 8 s and 0.2 s a word, longer while the pointer is on it or focus in it;
  Escape or its close button puts it away.
- **Cost.** Off: `learn.on` read once a frame, and a counter a pellet. On: 0.0-0.1 ms a frame (in
  the food lap), a tap's pick well under a millisecond, its module (3 KB, with the BVH's tracer) loaded
  the first time Learn is turned on. No pipelines, no WGSL. The furnishings' texels stay on the page's
  thread for the picker: 8.3 MB on phones, 32 MB on desktops. Phone emulation (384x693 at 2.81, 2.75x
  CPU, vsync), Learn off and on alike: 60 fps, GPU sim 0.5 + draw 1.0 ms, 84 pipelines.
- Tests: `learn-pick.test.mjs` (4: Snell's law; the topics; taps traced back from points on the real
  furnishings, the bowl turned and tipped, land on them; the fish, the leaf, the nest, the film, the
  sand, the water, the bowl, the lid) and `learn.test.mjs` (4: a card for every topic and behaviour,
  short; the captions' timing; the feeding count).

## Water mode (src/water)

The betta page's **Water** button (beside Learn; off at first, remembered on the device:
localStorage `betta.water`, the bowl itself in `betta.water.state`) runs a simulation of the bowl's
water on a fast clock, shows its test readings in a panel, and writes what the water does to the fish
and to the water's look into `water.fx` (`effects.ts`, read by the fish and the bowl's look). Off,
`water.fx` is `CLEAR_WATER` (or `?water=`'s forcing) and nothing runs in a frame.

- **The model** (`chemistry.mjs`, plain JS, steps of at most 10 sim minutes). Nitrogen in mg N in
  4.0 L (the glass card's gallon): TAN, nitrite, nitrate; detritus (feces, remains; 7 %/day back to
  TAN); the fish's gut (a 2 mg pellet is 0.128 mg N: 55 % excreted as TAN over a day, 20 % feces) and
  its fasting 0.04 mg N/day; uneaten pellets rotting (1.3/day: ~2 days; 70 % to TAN). Nitrifiers as
  capacities (mg N/day) in the sponge, sand and glass (70/25/5 %), Monod uptake taken implicitly,
  growing on what they oxidize, x1.07 per °C, slowed in acid water (half at pH 6.45). Plants take
  0.07 mg N/day, ammonia first. KH: 7.14 mg CaCO3 per mg N nitrified, less half for the share of the
  fish's ammonia excreted as NH3 and for the nitrate the plants take; the water lost to the air
  (0.4 %/day) topped up with tap water, its KH coming in; pH from the carbonate balance with 3 ppm CO2 (7.6 at 4 dKH), the
  leaf's tannins a little acid and a tint. The room 70 °F (±1 °F a day), the bowl's time constant 3.5
  h, a 10 W heater with a 0.5 °F thermostat band at 79 °F, followed a minute at a time (its lamp: the
  share of the time it heated, blended over 0.15 s of real time, so at Play it blinks and at Fast it
  glows steadily at its duty). Chlorine at 2 ppm in untreated tap water: gone in about a day, killing
  bacteria (0.7/ppm/day), chloramine freeing some ammonia; a treated change neutralizes what is left.
  A bloom of free bacteria on dissolved organics (a new bowl's leaching, rotting food), eaten fast by
  a mature biofilm. The clock runs to each meal or change and lands on it exactly (so none fires
  twice, whatever the frames' lengths), in steps of at most 10 minutes, at least one.
- **Choices that differ from the textbook values** (to match what keepers see): the nitrifiers' Ks
  is a few thousandths of a mg N/L (aquarium biofilters are mostly ammonia-oxidizing archaea and
  comammox Nitrospira) and the active biofilm's loss rate is 0.56 (AOB) / 0.45 (NOB) a day (decay,
  grazing, sloughing), so a cycled filter carries ~1.35x its load: ammonia reads ~0.01-0.02 ppm, yet a
  sponge rinsed under the tap (97 % of its bacteria killed) brings 0.25-0.3 ppm in 3-4 days. The flip
  side: a week or two without food shrinks the colony, and feeding again brings a short ammonia rise.
- **The fish**: severities 0..1 (0.7 severe) for free NH3 (0.004-0.05 ppm: total ammonia from about
  0.25 ppm at pH 7.6 makes it uncomfortable), nitrite (0.25-2), nitrate (40-160), cold (under 76.5
  °F; 70 °F ~0.55), chlorine, very acid water (under pH 5.6: bettas come from soft, acid water, so
  old-tank syndrome's harm is the swing a big change on a crashed buffer gives, and its stalled
  bacteria) and a pH swing from what it is used to (2-day memory; from half a unit, a whole unit
  severe); felt within ~2 h, mended over 1-2
  days (the cold within hours); each effect a weighted combination, finite and 0..1, and within 0.01
  of its clear value exactly that; appetite falls with them; the nest only when content and warm.
  Its condition (Thriving / Uncomfortable / Stressed / In danger) and the main cause go to the panel;
  it never dies (in danger, the panel says what that would mean in a real bowl and what to do).
- **The page** (`care.mjs`, no DOM; `WaterCare.ts` wires it). Clock: paused, Play (30 sim min a
  second) or Fast (6 sim h), only while on and the page is seen. The routine's meals are counted,
  the lid left on, at `fx.appetite`, their leftovers laid on the front sand (`FishFood.lay`; not in
  `FishFood.landed`, so Learn's "food on the sand" is only for a pellet that sank). The Feed button's
  pellets count as the fish eats them (`FishFood.eatenCount`) or as one settles uneaten and becomes a
  leftover (`FishFood.leave`). The newest four leftovers show, shrinking as they rot (`rot`), the fish
  leaving them alone. Water changes by the routine: none, 25 % weekly, 50 % twice a week, or tested
  daily at 10 am and half changed when ammonia or nitrite reads 0.5 ppm (fish-in cycling in a bowl
  this small: peaks ammonia 0.57, nitrite 0.73, never in danger, cycled on day 33). Starts: a new bowl (the first), a cycled one (a month of
  weekly changes after a steady state), a neglected one (that, then four months without a change,
  only topped up: nitrate ~80, KH 0.4, pH 6.26, ammonia 1.3 held as harmless NH4+ at that pH, the fish
  stressed by the nitrate; a quarter changed a day brings it back in about four days, never in
  danger, while half at once shocks it with a jump of 1.1 in pH). Kept every 5 s and as the page hides (~30 KB at most: 120 days of
  3-hourly samples); what comes back is checked field by field (numbers finite and in range, lists of
  the right shape, known speeds and routines), else a new bowl. Only pellets that settle once Water
  mode is on are its leftovers (`FishFood.landings` numbers each settling).
- **The panel** (`panel.ts`, `chart.ts`, `water.css`; words in `content.ts`): readings with test-kit
  colour chips, pH, °F and °C; the condition; a line on what is happening; opened out, the nitrogen
  cycle chart (ammonia and nitrite on one scale, nitrate below on its own, from the first sample
  kept to now; canvas at the device's ratio, a crosshair under the pointer), care, routine and start
  points. A side panel on a desktop, a column at the left on a phone held sideways, a sheet above the
  page's link on one held upright (it folds to its readings and its news in full, clear of the bowl;
  Learn's card moves up top, and the sheet opened stops short of the lowest it can reach). DOM updated at 4 Hz (only what
  changed), the chart at 2 Hz when shown (its width from a ResizeObserver: no forced layout).
- **Cost**: phone emulation (384x693 at 2.81, 2.75x CPU, vsync), the panel open: 60 fps, 84
  pipelines; Water's frame 0.05-0.07 ms on average (throttled), the chart's redraw ~0.5 ms twice a
  second. No WGSL, no pipelines.
- Tests: `water-chemistry.test.mjs` (12: the new bowl's cycle; fish-in cycling with changes twice a
  week and as the test says; a cycled bowl kept well and neglected; the sponge rinsed; the heater
  off; events landed on exactly with frames of any length; its lamp at Play and Fast; an untreated
  change, and a treated one after; overfeeding; saving, and spoilt saves) and `water-care.test.mjs`
  (6: water.fx on and off; pellets from before Water mode; slow frames at Fast; the clock; routine
  meals counted and the Feed button's, leftovers; what is kept).

## The water's state, seen (water/effects.ts, as the fish and the bowl show it)

Water mode's care simulation sets `water.fx` (water/effects.ts: each 0..1; `CLEAR_WATER` with the
mode off; `?water=lethargy:1,cloud:0.6,...` forces values for testing); main.ts hands it on each
frame: to the betta (`Betta.water`), to the nest (`BowlLife.tending`) and to the look
(`water/look.ts`). In clear water every one of these is the page as it was: the swim's routes, the
fins and the body bit for bit (betta-swim.test.mjs, betta-worker.test.mjs, water-fish.test.mjs), the
other globes' WGSL byte for byte, the bowl's shading the same sums as before (the desktop's picture
pixel for pixel; on a phone's a few hundred pixels at the edges of bubbles differ, as they do for
any edit that leaves the water's dimming to a uniform, even one adding 0: the GPU's compiler rounds
the new code its own way).

- **The fish** (bettaSwim.mjs; lethargy, gasp and clamp go to the worker in each step, bettaLink.mjs
  S.water). Listless (lethargy), it rests as a well fish does, its rests coming round sooner (their
  wait up to 60% shorter), and besides goes down whenever it stops, the readier the more listless
  (`slumpDown`, `slump`: always from half way), lying 6 times as long at 1, leaning a little onto one
  side as it settles; not
  over a place to lie, it makes for one (`seekRest`: where its way down, `restLanding`, ends clear of
  the glass and of the furnishings' solid parts: by the wood or on it). It lets itself sink there,
  all but in place, rather than swim down. It swims slower on shorter legs, hovers more, keeps low,
  takes a harder knock to startle, and from 0.4 neither displays nor laps. Short of air (gasp), it
  goes up up to 6 times as often (`gulpDue`), from 0.4 lingers at the film for up to 8 more gulps,
  its lips shut between them, and breathes quicker (bettaSpecimen.mjs: the gait's breathing phase).
  Measured in the bowl among its furnishings (32 fish, 15 minutes each): resting 1.8% of the time
  clear (2.8 times an hour), 1.9% at lethargy 0.01, 4.2% at 0.1, 8.4% at 0.2, 21% at 0.3, 65% at 0.6,
  78% at 1; 0.7 gulps a minute clear, 7 at gasp 0.7 (at the film 29% of the time), 11.5 at 1.
- **The fins** (betta-atelier fin-dynamics.js, the state's optional `clamp`, eased in the specimen
  over a few seconds): the caudal's rays close to 38% of their spread and droop, the dorsal and anal
  lie back along the body, the membranes held taut and stiffer, the ventrals tuck back by 1 rad and
  in towards each other. Without it (the Atelier) the fins are as they were, bit for bit.
- **Food** (FishFood, `Feeder.appetite`): less keen, the fish notices a pellet up to 4 times later,
  goes for a share of them (all from 0.6, none at 0: they soak and sink, and lie on the sand), and
  under 0.5 spits out a share of those it takes: blown out ahead, soaked through, it sinks.
- **The nest** (BowlLife): under 0.5 the fish adds nothing to it, wants nothing rebuilt (no extra
  trips up) and the nest thins, 0.6 bubbles a second; content again, it builds again.
- **The look** (water/look.ts, eased over a couple of seconds, the heater's lamp at once; one
  uniform, `uBowlWater`, no pipeline). The fish fades (bettaWGSL.ts, the bowl's variants only: less
  saturated, a little darker, its sheen and the scales' play of colour dimmed). The water: a bloom
  of bacteria (bowl.ts `BOWL_WATER.bloom`, 1.5 a unit of path at 1) dims every colour alike and sends
  back a milky haze lit as the water is (the light dimmed on its way down by a third of it: the rest
  it scatters on down) and shows the lamp's beam the brighter; tannins (`tannin`: the blue all but
  wholly, the green much, the red hardly; their strength tint^0.6) stain it tea-brown, deeper with
  depth and path, and glow amber. Both dim the light on the sand too (FluidSim `waterColour`, the
  photons'). Clouded or stained, each stretch of water adds its glow before its bubbles (a bubble in
  a clouded one is seen in its haze); clear, after them, as it always did. The heater's lamp (equipment.mjs `scapeHeaterLamp`) goes dark but stays
  there, an amber lens.
- **Cost.** A few multiplies a frame on the page (well under 0.01 ms); the swim's searches only when
  it stops. Shader: 0.7 K more inlined (bowlKoi-full 419.97 K of its 420 K budget). Phone emulation
  (384x693 at 2.81, vsync), clear and with strong effects alike: 60 fps, GPU sim 0.4-0.5 + draw
  1.0 ms, CPU 1.9-2.3 ms, 84 pipelines.
- Tests: `water-fish.test.mjs` (12).

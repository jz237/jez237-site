# The Clockwork Garden

A 58-second procedural film rendered live in the browser with Three.js/WebGL:
a forgotten Victorian glasshouse whose brass, porcelain, copper and glass
garden wakes from a single ticking escapement — and APX-9, the mechanical
pollination bee that lives there. You can also **become APX-9** and fly it
round the garden, or **follow it** as it goes about its day. No video- or
image-generation models, no image assets: every mesh, texture, light and
sound is generated in code.

## Three ways in

The landing screen (the garden is already alive behind it) offers:

| Mode | What it is |
|---|---|
| **Film** | the original 58-second film, unchanged and deterministic |
| **Fly as APX-9** | third-person flight: hover, turn, climb, bank, boost; land on blooms, gather pollen, carry it home |
| **Follow APX-9** | APX-9 works on its own (visits blooms, gathers, deposits at the skep, winds the garden); the camera is directed like a film: composed shots joined by cuts (fly-bys set ahead on its route, wide views of the house, a crane after take-off, long-lens tracking, close-ups of its landings, cutaways to the wildlife) |

Switch any time: the explore button (winged hexagon) in the film's control
bar, the menu (top left) in the interactive modes, or `C` / the
*Take the controls* / *Autopilot* button between Follow and Fly (control
passes over from wherever the bee is).

### A living garden

The whole garden moves in one breeze that comes in through the near doors:
gusts travel down the house as bands, so you see a gust cross the beds rather
than every leaf jiggling. Leaves, petals and ferns flutter; the heavy brass
stems barely lean; the masses ripple; the ivy swags swing; the lanterns sway
on their chains with a pendulum's own period. As APX-9 passes (yours, the
autopilot's, or the film's), its wing-wash bends nearby leaves, petals and
fronds away and they spring back past rest and settle; the cameras push the
foliage aside too (and part it along their line of sight to the bee), so the
lens is never inside a leaf. The breeze is a function of the film's clock in
the film and of the garden's own clock in the interactive modes.

In the interactive modes the planting is grown at APX-9's scale: smaller,
varied enamel leaves with gilt midribs and veins, cupped and drooping on
their stalks (rosettes, leafy stems, shingled masses over exactly the shapes
the bee bumps into, elephant ears and canna blades, ferns, palms, ivy, ground
cover). Nothing passes through anything: every leaf is placed only where it
crosses no other leaf, stem, bloom, iron, glass, lantern or the soil
(`tools/overlapcheck.mjs` counts it). It grows in the background for a few
seconds after the page loads; until then the film's foliage stands in, and
when it is ready the one dissolves into the other over about 0.6 s.

### A night that glows

At night the garden is at its most magical: midnight teal with amber pools of
light. The path is an avenue: pointed iron arches in every bay of the vault
(gilded bands and capitals, a twin rib laddered with rings, cusps, scrolled
ears, climbing roses), a lantern under each apex and one on a scroll bracket on
either upright, strings of fairy lights sagging from arch to arch, opal globe
lamps lining both curbs, lanterns on brackets on every column of the vault and
banners hung from them. The flagstones are polished dark stone; at night dew
lies on them in sheets and puddles and every lamp along the path is mirrored in
them, stretched into the long streaks of light a wet floor makes (a small
mirrored render of the path's lights, read back through a streak blur and
Fresnel). Fly fast down the path and the globes light up one after another
ahead of you.

Where the path ends, past the fountain, stands the great clockwork tree: a
trunk of bronze cords twisted together and bound in gold wire, buttress roots
arching over the soil, limbs that spread under the whole width of the vault
and fork again and again, brass gears turning slowly in the trunk and the
forks, clouds of pink porcelain blossom at every twig (glowing at night) and
dozens of lanterns hung on chains through its crown.

By night thousands of clockwork fireflies drift in swarms over the beds,
along the promenade and all through the great tree's crown; by day hundreds
of butterflies (monarchs and enamel swallowtails in a dozen tints) live in
companies round the blooms and the blossom, at every height from just over
the flowers to well up under the glass. They fly as butterflies do: each
downstroke heaves the body up and the body rocks with the wings, they jink
and bank into their turns and glide on held-out wings between bursts of
beats. They settle, scatter from APX-9 rushing past, and go to roost as the
evening falls.

The blooms are glazed porcelain lit from the heart: two-ringed lotus cups,
tulips and roses in peach, blush and rose, with gilt rims, veins that glow,
gilt stamens tipped with glowing anthers and a geared, gilded calyx under every
head; the copper asters keep their metal. The blooms nearest the camera are
drawn with finer petals.

Every hanging lantern, path lamp and seed lantern lights the foliage,
blooms, path, iron and APX-9 around it (with the great bloom's core, the
skep's doorway, the glass blossom, the seedpods, the armillary, sprouted glass
blooms, every pollinated bloom and the firefly swarms): a light field of a
couple of hundred lamps computed in every material, so none of them costs a
real light. As dusk falls the lanterns kindle themselves one by one to a soft
evening glow; APX-9 kindles each one it passes to full brightness, with a flare
and sparks, so a night flight leaves a warmer trail. Porcelain blooms and bells
glow from within (brighter when pollinated or when a bee comes near), the great
bloom's core is a lantern, the glass shimmers. Clockwork fireflies drift in
swarms over the beds and the fountain's water, blink in slow waves, brighten and
drift aside as APX-9 goes by and scatter when it boosts through. The moon edges
the night: cool, through the vault's iron (its ribs, purlins and columns shadow
the beds, as the sun's do by day), with faint moon shafts, stars and the moon in
the roof. APX-9's wing lattice glows at its nodes.

### The look: lens, stained glass, water, weather

Interactive modes only; the film's pixels are untouched (`filmidentity`, `determinism`).

- **Eye adaptation** (`render/pipeline.js`, `LensPass`): an 8x8 light meter (log-average luminance
  of each cell, scene-linear, read back without a stall, centre-weighted) eases the exposure
  *down* when a frame is over-bright (a copper bloom lit by the low sun, a lamp filling the
  frame): the pupil closes in about 0.6 s, opens in about 1.9 s. It never brightens, and frames
  already in range (every ordinary flying view measures 0.5 stop or more below the threshold)
  are untouched. Threshold, gain and floor are `autoThreshold`/`autoGain`/`autoMin` in the look.
- **Streaks and halation** (same pass): lights above a threshold are gathered at a quarter of the
  resolution, stretched sideways by three dilated blurs (a cool anamorphic streak) and softened
  both ways (a warm halation), added in the grade. Strongest at night (the lanterns), fading as a
  close-up dims the frame. Off on `low`.
- **Stained glass** (`world/lightfield.js`): the same trace that lets the vault's iron shadow the key
  light reads which pane of the glazing the light came through; about one pane in four is stained
  (ruby, amber, teal, violet), so coloured pools lie among the iron's shadows, and the panes
  themselves are stained where they are seen (the glazing's shader knows the same lattice). The
  pools travel with the sun (below), and in the morning they fall through the east wall.
- **The sun's path** (`world/sunpath.js`): the key light moves with the hour. The sun rises in the
  east (the right wall), climbs to the south at noon and sets in the west (the left wall); golden
  hour keeps the old fixed sun's exact direction (14.5 h), so the garden's look there is unchanged.
  By night the light is the moon, higher the deeper the night; the key swings from sun to moon as the
  sun goes down (while it is dim). The mood slider is not a clock, so the sun's hour follows it
  along the afternoon (noon at the top, golden hour, sunset), *My clock* uses the real time (the
  morning sun is in the east), and the finale runs the day properly: down in the west, the moon, then
  a sunrise in the east. The solar hour is eased, so a jump sweeps the sun across the sky. One shared
  vector (`SUN_DIR`) is moved in place, so the sky's sun and moon, the volumetric beams, the sun beams'
  screen-space rays, the shadow map's frame, the iron and stained-glass cookie (`cgToL`), the shadow
  culling and the reflection maps (baked with the sun where the path puts it at each stop, then turned to
  match) all follow; the film's own is restored when the interactive modes stop. A low sun is redder and
  weaker.
- **Clouds**: by day slow soft shadows drift over the house (the key light seen through a noise
  a long way up).
- **The fountain** (`explore/fountain.js`): the water is a PBR surface whose normal follows a small
  height field: a slow swell, rings from drops (the armillary's drips; a downpour's when it rains),
  and wake rings where APX-9 flies low over the basin; a faint caustic web glows in it and plays as
  moving light on the column and the waterline. It reflects the vault and the lamps' glints.
- **Rain** (`R`, the menu's Rain, `?rain=1`; `explore/rain.js`): builds over a few seconds. The sky
  closes over (`sky.js`, explore variant only), the sun and its beams go behind cloud, the fog turns
  grey, the lamps kindle by day, the butterflies roost, the stone and path go wet (the lamps mirrored
  in them); streaks of rain fall outside the glass (a ring of thousands gathered round the camera, none
  inside the house); drops bead and run down the panes, bending the glass's normal so the lamps and
  lightning glint in each, and each is a lens: it shows the view behind the pane bent by the drop's dome
  (the last frame, kept at half the size by the lens pass while it rains and sampled with an offset that
  grows toward the rim: an inverted, widened view with a darker meniscus; one frame old, because three's
  transmission pass would draw the whole scene twice); ripples ring the fountain;
  rain and thunder sound (with sound on). In a downpour the sky lights now and then, twice in quick
  succession, thunder following: the flash is a cool key light, so the vault's ribs shadow the beds
  for an instant. Flashes are soft (a short rise, a few seconds apart, never a strobe) and are left out
  when reduced motion is asked for (the thunder stays).

### What you can do in the garden

- **Pollinate any bloom**: descend gently onto it. Blooms open wide for an
  approaching bee; when it settles the petals flex open, the pollen boss
  lights and stays gilded, a music-box note sounds, and APX-9's drum brush
  draws in pollen (the hind-leg loads and the cuff gauge fill, as does the
  HUD gauge). The great porcelain bloom ripples gold, the porcelain lily's stem
  dips under the bee, the glass blossom's nectar brightens.
- **Deposit at the skep**: fly into its doorway with pollen. APX-9 lands on
  the board, walks in, the hive flares and chimes, and the next planting
  site **sprouts glass blooms** (first at the seedpods, then further out:
  twelve sites), so the garden grows over the session. Grown blooms can be
  pollinated too. The worker bees dance round the skep after each deposit. The
  HUD counts the beds grown (`3/12 beds`); the garden is **remembered between
  visits** (see *A garden that remembers*), and the twelfth bed starts the
  finale.
- **Wind the garden**: touch the escapement beside the great bloom. The
  movement races, a pulse runs the copper roots, the gear train spins up,
  light climbs the stem, the great bloom answers and a **bloom wave**
  ripples out across the house (petals snap shut and spring open, a golden
  curtain and sparks travel with the front, every lantern kindles).
- **Lanterns, seed lanterns, path lamps and the globes along the path** kindle as you pass (by day they
  light up; at night they flare up from their evening glow to full brightness).
- **Porcelain bellflowers** (new: 18 plants, about 110 bells, tuned to D-major
  pentatonic) swing and ring when brushed.
- **The armillary** above the fountain spins up when you fly through its rings.
- **Creatures react**: butterflies scatter from a rushing bee, sapphire
  dragonflies dart off when you come close, hummingbirds stop to look at you
  as you pass and then fly on, the songbird watches you from its bough and
  flies a loop if you crowd it.
- **Wildlife going about its day**: every creature has its own patch of the
  glasshouse (the patches are spread to cover the whole house) and keeps to
  its routine there: honeybees and carpenter bees forage bloom to bloom,
  jewel beetles and ladybirds climb the flower stems (and at the top open
  their shells and fly to the next), butterflies flutter and settle,
  hummingbirds sip, dragonflies hover and dart. Nothing seeks out or follows
  APX-9; you happen by them, and they only react as you pass. Fireflies brighten
  and drift aside to let you through.
- **A garden that remembers** (`src/explore/save.js`, `localStorage` only, every
  access guarded): the beds you have grown, your deliveries and the finale are
  saved and stand grown from the first frame next visit (`grow(n)` in
  `growth.js`). The menu's *Start over* (shown once there is something to
  forget; asks twice) clears it and reloads. `?garden=fresh` ignores the save;
  capture and the review tools never read or write it.
- **The finale**: when the twelfth bed grows, the whole house answers with a bloom
  wave (the winding's wave, source `finale`), the title card *The garden is
  awake* rises with your tally, and the day turns once: down through dusk to the
  lanterns' night, then a golden morning (about 50 s; choosing an hour yourself
  ends it). It plays once per garden.
- **A sound nudge**: sound is off until asked for, so the first time anyone
  (you or APX-9) pollinates a bloom a small offer appears (*The garden has a
  score. Turn sound on*). Answering it, or letting it lapse, means it is not
  shown again.
- **First flights**: Fly opens with a one-line controls card (W, mouse, Space and
  Shift, H for help; the stick and ▲ ▼ on touch), then the goal hint (settle on a
  bloom, carry the pollen home, wind the garden at the escapement).
- **Time of day**: one control from the film's midnight teal through dusk
  (blue hour) and dawn (rose mist, the lanterns guttering out) to the
  golden-hour finale. `T` cycles midnight → dusk → dawn → golden hour and the
  garden glides there (the lanterns kindle or go out one by one, the
  fireflies come and go); the menu's slider goes anywhere in between. **My clock**
  (menu, or `?tod=live`) makes the hour follow the viewer's own clock (blue hour
  before dawn, rose dawn, bright day, golden hour at six, a rose dusk, then the
  lanterns' night) and keeps following it until an hour is chosen.
- **Photo mode** (`P`): interface hidden, world frozen, free camera (keeping
  the shot's focus: the subject sharp, the rest soft); `Enter` or *Save PNG*
  downloads the frame, with a small caption in the corner (the hour, beds grown,
  the address) unless the strip's *Caption* is switched off.
- **Sound** (`M` or the menu): wing buzz that follows wingbeat and speed, the
  pollen drum, escapement ticks by distance, bells, ratchet and root swell
  when winding, a pad whose chord follows the hour. Off until you turn it on.

## Run it

No build step. Any static file server works (ES modules need http, not file://):

```bash
cd projects/clockwork-garden
python3 -m http.server 8765
# open http://localhost:8765/
```

Requires a WebGL2 browser (Chrome, Edge, Firefox, Safari 16+).

**Before publishing, run `node tools/cachebust.mjs && node tools/bake.mjs && node tools/bundle.mjs`** (and, if the scans
changed, `python3 tools/scans.py --raw <downloads>` first: it writes `assets/scans/` and
`src/materials/scanlist.js`, whose names carry content hashes).
The bake grows the bee-scale planting for each quality tier and writes
`assets/nearfield-{high,low}.bin.gz` (1.7 / 0.9 MB); the page loads it
instead of growing the planting (9 s on a desktop, over a minute on a phone),
but only when its key matches the import map's stamps of every module that
shapes the world or the planting; otherwise (or with `?bake=0`) it grows it
as before. `node tools/bakecheck.mjs` confirms the page uses it and that it
matches a freshly grown planting. jez237.com lets browsers
cache `.js`/`.css` for 4 hours but revalidates `index.html` on every visit, so
without it returning visitors get the new page running stale modules. The tool
stamps every module (via the import map) and the stylesheet with a content
hash in `index.html`; changed files get new URLs, unchanged ones stay cached.

`tools/bundle.mjs` then writes `dist/`, the page to publish: the same page with
one minified, content-hashed script (`garden.<hash>.js`, about 290 KB brotli
against 620 KB over 82 requests) instead of the module tree, plus the stylesheet
and `assets/`; 18 requests a load instead of about 110. The source tree stays what
you edit and test (every tool runs against it); `dist/` keeps the import map's
`src/` stamps only so the baked planting's key still matches, and the source map
(`garden.<hash>.js.map`, sources embedded, 5 MB, fetched only when DevTools is
open) lets DevTools show the original files (`--no-map` leaves it out). esbuild
is found in the project, via `$ESBUILD`, or in wrangler's own install.

## Controls

### Fly (desktop)

| Input | Action |
|---|---|
| Mouse | steer and look (click to capture the pointer; `Esc` releases). Without pointer lock, drag to look |
| `W` `S` · `↑` `↓` | fly forward · back (the bee flies where you look) |
| `A` `D` · `←` `→` | turn; the camera turns with you and, left alone, swings round to the direction of travel |
| `Space` / `E` · `Shift` / `Q` | climb · descend |
| `F` or hold left mouse | boost |
| `C` (or `Tab`) | hand APX-9 to its autopilot (Follow) |
| `T` · `[` `]` | cycle the hour (midnight, dusk, dawn, golden hour) · finer |
| `R` | bring the rain, or clear it |
| `P` · `Enter` | photo mode · save PNG |
| `M` · `H` · `G` | sound · controls help · menu |

**Gamepad** (standard mapping): left stick fly (left/right turns), right stick look, `A` climb,
`B` or `LT` descend, `RB`/`RT` boost, `Y` autopilot, `X` photo, `Start` help,
`Back` menu.

**Touch**: joystick bottom left (up/down flies, left/right turns), ▲ ▼ and » (boost) bottom right, drag
anywhere else to look; the menu (top left) has time of day, sound, photo
mode, help and the mode switch.

### Follow

APX-9 goes about its day on its own; about a third of its flying weaves low
through the beds between the stems (over the shrubs, under the flower heads)
and rises up to the bloom at the end. The camera tracks beside it, cranes up
out of the beds and, by night, looks up past it at the lanterns and the
vault. When APX-9 settles on a bloom the camera cuts to a close-up looking
down into the cup from above the petals, at an angle it has checked against
the petals as posed right then; any petal or leaf that still sways across
the bee (or across a creature in a cutaway) is thinned away where it covers
it. Flying yourself, the view tips down into the bloom when you land unless
you are steering it. Every move is eased (critically damped springs: the
camera's velocity never jumps), framings blend round the bee in angle,
distance and height, and APX-9's own jolts are filtered out. Every 12–24 s
the camera flies along a raised curve to a creature nearby (a bee gathering,
the beetle or ladybird climbing, a butterfly on a bloom, a hummingbird
sipping, a dragonfly hovering, the songbird singing), holds it for 4–6 s
with a caption, and flies back to APX-9 (a soft dip to black only where no
clear path exists; never during a landing or at the skep).

Drag to orbit, wheel or pinch to zoom; the camera drifts back to its own
framing after a few seconds (and leaves a cutaway at once). `C` or *Take the
controls* to fly from where APX-9 is.

### Film

Minimal controls fade in on mouse move / tap and hide during playback.

| Key | Action |
|---|---|
| Space / K | play / pause |
| R | replay from the start |
| ← / → | seek ±2 s |
| M | sound on/off (sound starts only after you turn it on) |
| F | fullscreen |
| H | hide all interface (clean view) |

The clock button toggles **gentle motion** (steadier, averaged camera). If the
OS requests reduced motion, the film waits and offers gentle or full motion.

**Smooth on any machine.** A frame governor (`src/render/governor.js`) watches
every frame against the display's refresh, the main thread's time and (where
the browser has a GPU timer) the GPU's. When frames start missing the refresh
it lowers the render resolution if the GPU is the bottleneck (down to half, or
0.7 pixels per CSS pixel), or in Fly/Follow redraws the key light's shadow map
every other frame and culls small details sooner if the CPU is; it steps back
up once there's headroom. On 120 Hz+ displays that can't be held at full rate
it paces frames to an even 60. `?debug=1` shows a readout (fps, slowest
frames, missed frames, CPU/GPU ms, resolution, detail level); `?adapt=0` turns
the governor off.

## URL parameters

| Parameter | Effect |
|---|---|
| `?t=31.5` | start at a timestamp |
| `?paused=1` | start paused |
| `?clean=1` | recording mode: no interface at all |
| `?quality=low\|med\|high` | force a quality tier (mobile defaults to `low`) |
| `?motion=reduced\|full` | force gentle / full motion |
| `?capture=1` | frame-capture mode (no playback loop; exposes `window.__cg.renderAt(t)`) |
| `?look=bee&yaw=0.6&pitch=0.3&dist=7&t=27` | look-dev orbit around one object (`bee`, `monarch`, `flower`, `escapement`, `songbird`, …) |
| `&stage=landed\|folded\|flight\|walk\|display&key=1` | with `look=bee`: pose the hero bee (APX-9) in a clear spot above the bloom, facing +Z; `key=1` adds a studio-style key light from the camera side |
| `?mode=film\|fly\|follow` | open a mode directly (without it, and without any film-only parameter, a landing screen asks) |
| `?tod=0…1` | time of day in the interactive modes (0 midnight, 0.27 dusk, 0.5 dawn, 0.86 golden hour, 1 its peak; default 0.86) |
| `?tod=live` | the hour follows your own clock (the menu's *My clock* keeps that choice) |
| `?rain=1` | start in the rain (`R` clears it) |
| `?garden=fresh` | ignore the saved garden for this visit |
| `?touch=1\|0` | force the touch interface on or off |
| `?debug=1` | frame-rate readout in the corner (fps, slowest 5% of frames, missed refreshes, CPU/GPU ms, resolution, detail level) |
| `?adapt=0` | hold resolution and detail fixed (no frame governor) |
| `?bake=0` | grow the bee-scale planting in the page instead of loading the pre-built one |
| `?scans=0` | the procedural surfaces and reflections only (no photographed scans; for comparison) |

Film-only parameters (`t`, `paused`, `clean`, `capture`, `look`) open the film
directly. Reduced motion (system setting or `?motion=reduced`) also applies to
the interactive modes: steadier cameras without roll or speed zoom.

`window.__cg.renderAt(t)` renders an exact, deterministic frame; `window.__cg.audioWav()` returns the score as WAV (base64).
`window.__cg.wind` is the breeze (`freeze` holds the rest pose, `noWash` switches APX-9's wash off, for review).
Review hooks for the interactive modes: `__cg.setMode(m)`, `__cg.explore()`
(the controller; `.night` holds the light field, lamps and fireflies, `.lf` the
light-field uniforms), `__cg.exploreView({ pos, target, fov, tod, reachable })`
(render the awake garden from any viewpoint), `__cg.exploreExit()`.

## Recording a video file

Headless Chrome + ffmpeg, frame-exact, with the procedural score muxed in:

```bash
node tools/record.mjs --out exports/clockwork-garden-1080p.mp4 --w 1920 --h 1080 --fps 30
node tools/shoot.mjs --times 1,16,31,53 --out review/stills        # representative stills
```

Interactive-mode tools:

```bash
node tools/drive.mjs --scenario tools/scenarios/interact.json --out review/x   # real keyboard/mouse/touch/gamepad input + frames
node tools/flycheck.mjs                                                        # fly mode: turning, camera vs travel, nothing between camera and bee
node tools/sweep.mjs --grid full --out review/explore/sweep               # camera sweep: positions x heights x yaws, contact sheets
node tools/sweep.mjs --views tools/views/key.json --tod 0.05 --out ...      # fixed key views at an hour
node tools/explorefps.mjs --q high                                          # real-time fps in fly mode at the busiest spots + follow
node tools/filmidentity.mjs --before <port>                                 # the film is pixel-identical after exploring (and vs a rollback copy)
node tools/overlapcheck.mjs                                                 # does anything pass through anything? (film set and bee-scale set)
node tools/living.mjs --shots tools/views/living.json --out review/x --sheet 1   # deterministic stills and frame strips (fly, follow, views, film)
node tools/living.mjs --shots tools/views/night.json --out review/x --sheet 1     # night key views (night_tod.json: the hours; night2.json: ribs, moon)
node tools/drive.mjs --scenario tools/scenarios/night_hud.json --out review/x    # fly at midnight, cycle the hour with T, HUD and hints
node tools/stallcheck.mjs --minutes 25                                      # fast-forwarded autopilot: stalls, give-ups, leaves brushed
node tools/pacing.mjs [--w 2560 --h 1440] [--cpu 4] [--mobile 1]            # frame pacing as seen (vsync on): landing, fly by day/night, follow;
                                                                            #   missed refreshes, judder, work by subsystem, the governor's state
node tools/camjerk.mjs                                                      # camera smoothness flying low: spring-arm pops and chatter, view jerks
node tools/cpuprofile.mjs --mode fly · node tools/allocprofile.mjs          # where the main thread's time / garbage goes, by function
node tools/abshots.mjs --a 8765 --b <rollback port> --out review/x          # A/B stills from the same chase-camera spots
node tools/wildlife.mjs [--mobile 1]                                        # Follow: how often wildlife is on screen, by kind, and how far from APX-9
node tools/cutaways.mjs [--secs 150] [--tod 0]                              # Follow: each cutaway (creature, length, flight or dip), stills, share of time
node tools/followsmooth.mjs [--port <rollback>]                             # Follow camera fluidity: snaps, quick view turns, acceleration jolts
node tools/landings.mjs [--mode fly] [--per 3] [--port <rollback>]          # lands APX-9 on every kind of bloom: how much of it the camera sees, stills
node tools/flutter.mjs [--port <rollback>] [--secs 6]                       # the butterflies in flight: a still camera on a busy patch, a clip, flight numbers
node tools/bootprofile.mjs [--net 4g] [--cpu 4] · node tools/bootcpu.mjs    # where the startup goes (network, boot steps, planting) / its CPU profile
node tools/cachebust.mjs && node tools/bake.mjs && node tools/bakecheck.mjs  # stamp modules (and preload list), bake the planting, check the bake
```

(The tools expect a local static server on port 8765 and use the system
Chrome at `/usr/bin/google-chrome` with GPU WebGL.)

## The film

| Time | Shot |
|---|---|
| 0–8 s | **Heartbeat** — extreme close-up of a Swiss-lever escapement ticking in the dark; the charge builds and a pulse of amber light races along a copper root |
| 8–13 s | **Root crown** — the mainspring barrel releases, the whole gear train spins up together, light climbs the stem |
| 13–22 s | **Bloom** — the bud is a closed porcelain egg glowing from within (pierced rosettes, gilt seams); its five hinged sepals release from a finial clasp and swing down on spring-loaded knuckles, revealing a spiral-furled tulip bud that unwinds and opens ring by ring on visible levers, push rods and sleeves; stamens rise around the amber core |
| 22–28 s | **The pollinator** — APX-9, Jez's mechanical pollination bee, walks out of an arched doorway in its brass skep, warms its smart-glass wings and flies to the bloom, stands on the anther ring and draws luminous pollen into its spinning pollen-drum brush (the hind-leg pollen loads swell and the cuff gauge fills amber); the flower answers in a ripple of gold |
| 28–32 s | **Monarch** lands on a porcelain lily (the stem dips) and slowly opens its enamel wings on gilded hinges |
| 32–36 s | **Beetle** climbs a copper reed and slips beneath a leaf; a **ladybird** opens its shell and flies |
| 36–40 s | **Hummingbird** sips from a glass blossom, then turns to hover beside the camera |
| 40–58 s | **Reveal** — the songbird stretches its wings and lifts off; the camera pulls back over an overgrown glasshouse (leafy beds, foliage masses, potted palms, shrub roses, ivy up the iron columns and in festoons under the eaves) as the garden blooms in a wave, glass lanterns kindle beneath the vault and sunbeams slant through the roof; APX-9 bumblebees, honeybees, butterflies, dragonflies and birds rise through the light; title |

The planting moves in a coherent breeze throughout the film (a pure function
of `t`, so every frame still renders the same from any history), and APX-9's
wing-wash ruffles whatever it flies past.

## Project structure

```
index.html, styles.css         page, title card, controls styling
src/main.js                    boot, renderer, playback loop, public API
src/core/                      seeded RNG, easing/timeline helpers, quality tiers, fastmatrix.js (matrix updates that
                               skip what hasn't moved)
src/materials/                 procedural textures, material library, pulse shader, scans (the photographed
                               surfaces and sky: loader, world-space UVs, triplanar iron) and scanlist (generated)
assets/scans/                  the scans as small WebP maps, and their credits (made by tools/scans.py)
src/geometry/                  gears (meshing math), parts (screws, jewels, rods), surfaces (petals, leaves),
                               leaf (the parametric enamel leaf, GLSL + CPU twin), intersect (exact part crossing)
src/world/                     escapement, root crown, roots, hero flower (+ porcelain bud sheath), props, garden,
                               flora (glazed blooms in rings, stamens, geared calyces, fine petals near the camera),
                               foliage (far-field lushness, ivy, palms, lanterns), greenhouse, sky,
                               promenade (the path's arches, globe lamps, fairy lights, banners),
                               greatTree (the clockwork tree at the path's end),
                               atmosphere (shafts, dust), lighting, environment maps,
                               lightfield (the interactive modes' lamp light: a clustered light list in every
                               lit material, the vault's iron as a light cookie, the hour's environment blend),
                               wind (breeze, wing-wash, the vertex patch), planting (nothing through anything),
                               dome (relaxed leaf mounds)
src/creatures/                 apx9 (the resident pollinator, built from APX-9's blueprint in apx9Shape),
                               bee (honeybee, carpenter), butterfly, beetle/ladybird, dragonfly, bird rigs + choreography
src/direction/                 beats (story timing), camera tools, shot list, director
src/render/pipeline.js         HDR MSAA → bokeh DOF → light shafts → bloom → lens (eye adaptation, streaks, halation, the half-size frame the raindrops refract) → grade
src/render/governor.js         frame governor (resolution / detail for a steady frame rate); singlepass.js (flat glass
                               and wings drawn single-pass)
src/audio/score.js             procedural score (OfflineAudioContext)
src/ui/controls.js             playback interface (with the explore popover)
src/ui/hud.js, landing.js      interactive-mode HUD (gauge, hints, help, menu, photo strip) and the landing screen
src/ui/perfmeter.js            the ?debug=1 frame-rate readout
src/input/input.js             keyboard, mouse / pointer lock, wheel, touch joystick + buttons, pinch, gamepads
src/explore/                   the interactive modes:
  sunpath.js (world/)            the sun's and moon's path, in the house's frame (hour → direction)
  fountain.js · rain.js · weather.js  the living fountain (water, wake, caustic stone) · weather (rain, lightning, the
                                 sky's overcast, the streaks) · its shared uniforms (world/weatherU.js)
  save.js                        the remembered garden (beds grown, deliveries, finale, preferences; localStorage, guarded)
  explore.js                     controller: awake world on a real-time clock, mode switching, cameras, practicals, hints
  timeofday.js                   one control for sky, sun/moon, ambient, environment ramp (blended), fog, exposure;
                                 the hour glides to its target (midnight, dusk, dawn, golden hour)
  wetpath.js                     the wet path: dew on the flagstones, the path's lights mirrored in it
  butterflies.js · flutter.js    hundreds of butterflies by day (one instanced batch per wing pattern); butterfly
                                 flight shared with the rigged ones (bob with each beat, jinks, banking, glides)
  night.js · fireflies.js        the night: light-field sources, ambient kindling, haloes, glowing blooms and glass,
                                 moon shafts; clockwork fireflies
  bounds.js                      flight volume: analytic ground, walls, vault, ~4,000 collider shapes, landables
  actor.js                       APX-9's flight model and sequences (land, gather, take off, dock, deposit)
  pilot.js · lowroutes.js        autopilot for follow mode (low weaving routes through the beds on a layered grid,
                                 canopy-aware routes, variety, winding, trips home)
  cameras.js                     chase camera, cinematic follow camera (framings by context, cuts, wildlife
                                 cutaways, the checked landing close-up), photo camera
  interactions.js                pollination, deposits, winding + bloom wave, kindling, armillary, sparks, pollen bosses
  growth.js · bells.js           sprouting glass blooms · porcelain bellflowers
  ambient.js                     butterflies, dragonflies, hummingbirds, skep bees, songbird, foragers, crawlers,
                                 each on its own patch of the house; creatures/compact.js merges each
                                 explore rig's rigid parts (20–40% fewer draws)
  scenery.js                     near gable and doors, far doors, column tops, glazing bars, end planting, exterior
  upgrade.js · cull.js           close-up foliage finish (enamel leaves, near-lens fade, the window round the
                                 subject), tiling, glass; detail culling
  nearfield.js                   the bee-scale planting (grown in the background, collision-free, tiled, LOD,
                                 dissolved in over the film's foliage when ready)
src/audio/live.js              live synthesis for the interactive modes
tools/                         shoot.mjs (stills), record.mjs (video), determinism.mjs, fpscheck.mjs (real-time fps +
                               per-frame draw calls), motion_check.py, uicheck.mjs, gpucheck.mjs, sheet.py,
                               drive.mjs + scenarios/ (scripted input), sweep.mjs + views/, explorefps.mjs, filmidentity.mjs,
                               flycheck.mjs, overlapcheck.mjs, living.mjs, stallcheck.mjs, cachebust.mjs, pacing.mjs,
                               camjerk.mjs, cpuprofile.mjs, allocprofile.mjs, abshots.mjs, wildlife.mjs, cutaways.mjs,
                               followsmooth.mjs, landings.mjs, flutter.mjs, bootprofile.mjs, bootcpu.mjs, bake.mjs,
                               bakecheck.mjs, bundle.mjs (dist/: the single-script page to publish)
docs/PRODUCTION_LOG.md         checklist, review log, remaining issues
review/                        review frames and contact sheets from each pass (interactive modes: review/explore/)
```

## Licences

- Code: original work for this project. `src/creatures/apx9Shape.js` ports blueprint maths (skeleton, abdomen profile, wing planform and vein network) from Jez's APX-9 exhibit (`demos/apx9-bee`).
- Three.js r185 (`vendor/three`): MIT — see `vendor/three/LICENSE`.
- Cormorant Garamond (`assets/fonts`): SIL Open Font License 1.1 — see `assets/fonts/cormorant-OFL.txt`.
- Geometry and sound are generated procedurally at runtime, and so are all textures but the scans below.
- The photographed scans in `assets/scans/` (path stone, bed soil, moss, the iron's wear, the aged brass's
  scratches, and the glasshouse HDRI the reflections are built from) are CC0 (public domain), from
  [ambientCG](https://ambientcg.com) and [Poly Haven](https://polyhaven.com); each is credited in
  `assets/scans/CREDITS.md`. `tools/scans.py` resizes and repacks them from the downloaded originals.

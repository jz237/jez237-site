# First Light: Keystone Waters

An immersive freshwater angling sim for the browser, set on real Pennsylvania water. **This build (v0.23.0, First Morning)** is Lake Nockamixon's Three Mile Run cove at first light from a fishing kayak: the lake renderer, sky, clock, weather, shoreline and interactive surface from the v0.1.0 water slice, plus a rod in your hands, three rigs, a charge-and-release cast, line physics, lures that behave as their kinds do, a camera that follows the lure under the surface, and the full twelve-species roster, seventy-three fish built from reference photographs living on the cove's cover with their own minds, a bite you have to set, a fight you can lose two ways, and a catch card at the end (see `CONCEPT.md` and `SPEC.md`).

Live: `https://jez237.com/games/2026-09-13/first-light/`

## Play

Press **Paddle out**. Drag the scene to look around. **Hold the mouse button** (still, for a moment) to load the rod and **release** to cast where you are looking; **Space** reels, **F** twitches the rod, **Tab** changes rig (finesse worm, topwater walker, squarebill), **C** follows the lure underwater while you work it and returns you to the seat. When a fish takes, set the hook with **F** or by reeling; during the fight **Space** reels, **A / D** put side pressure on, **W** lifts the rod and **S** bows to a jump. **W / S** paddle, **A / D** turn, **X** drops or lifts the anchor, **P** puts the polarized lenses on, **T** cycles the time rate (real, 1×, 4×, 12×), **1 / 2 / 3** skip to dawn, dusk or night, **Esc** opens the menu; right-click tosses a pebble. Phones get hold buttons for paddle, turn, reel and cast (hold to load, release to throw), tap buttons for twitch, anchor, lenses, rig and menu, and drag-to-look; gamepads use the left stick to paddle and turn, the right stick to look, LT to load and release a cast, RT to reel, RB to twitch, A for anchor, X for lenses, Start for the menu.

The menu has graphics tiers (Adaptive, High, Medium, Low, Saver at 30 fps for phones), the time rate, a weather preset (calm dawn, light breeze, overcast, rain), a Steady camera option that damps the kayak's pitch and roll (also on automatically under `prefers-reduced-motion`), and a field-of-view slider. The hour slider and skip buttons live on the HUD.

## Casting and retrieving (v0.2.0)

- **Tackle chain** (`tackle.js`): rods, reels, lines and lures with real ratings; the weakest link (line test, drag setting, leader, rod class) is shown on the HUD and a lure outside the rod's weight range casts short.
- **Cast** (`angling.js`): power loads over 1.3 s; release throws the lure on a ballistic arc with quadratic drag and wind toward the reticle; splashdown stamps the surface impulses and the ripple field. About 28 m at full power on the finesse rig.
- **Line** (`line.js`): a 24-node Verlet chain from the bending rod tip; air nodes sag, submerged nodes drag and rise or sink with the line type, and the lure node floats, sinks at its rate, or dives to a target depth on the retrieve. Tension is how taut the chain is. The line is drawn as a camera-facing ribbon, so the underwater part refracts through the surface.
- **Lures**: the walker zigzags on top with each twitch, the Texas-rigged worm sinks and hops off the bottom, the squarebill dives while reeling and floats up at rest.
- **Technique recognizer** (`technique.js`): a three-second window over reeling and twitches names what you are doing (straight retrieve, slow roll, stop & go, twitching, lift & drop, walking the dog, dead stick).

## First Morning with Ray (v0.23.0)

The guided first ten minutes, on the menu and offered once to newcomers. Seven steps that watch what you actually do and move on when you have done it: cast toward the laydown, work the lure until the readout names a technique for three seconds, bring it in, put on the lenses, cast again and set a hook, fight (bow to the jump, ease off the run), release. The lake cannot promise a bite, so the lesson arranges one: a bold largemouth is put on the lure a few seconds into the hookset step, and a lost fish sends you back to that step with another. Skip it any time from the button at the top right; finishing or skipping marks it done in the settings. Captions carry Ray's instructions; no new voice lines yet.

## Playable, and a cat on the dock (v0.22.0)

The game leaves the Unfinished shelf of the gallery and is listed as playable. The fleet's customary easter egg is in: a cat sits at the end of the dock at first light, Luca, Cosmo or Taco by the day of the year, tail swinging, head turning to whatever it has decided to watch; the menu says who is on the dock after a few seconds. An announcement draft for the games channel sits in the workspace scratchpad for Jez to post. Known gaps, kept honestly in this README: fish jaws do not open, pectorals are painted, no top texture, no depth of field, one holder rod, no sonar yet, and the realism preset is still to come.

## Installable, and a phone pass (v0.21.0)

The game is a progressive web app: a manifest with its own icon (the sun clearing the tree line over still water), landscape standalone display, and a service worker (`sw.js`). The shell is network-first so a new version lands the moment it deploys, with the cache as the offline fallback; the media (the terrain textures, the fish, Ray's voice, about 24 MB) is cache-first once seen, in its own capped cache, so a second morning on the lake starts fast and works on the dock with no signal. The cache is versioned with the game and a test refuses a release where the two drift. The phone pass checked both orientations at 390×844: the menu scrolls instead of clipping, the toast keeps out of the touch clusters, and the touch clusters no longer overlap each other in landscape. QA: the SW registers on localhost and https only.

## Big Bass (v0.20.0)

**Big Bass tournament** on the menu is the kayak format as the real series fish it: catch, photo, measure, release; best five bass by length, total inches. Twenty real minutes at twelve times speed, so the day runs from six to ten in the morning, on the day's seed, against three rival kayaks (Kim, Dale and Marisol) you can see across the cove. The rivals fish with the planner's own numbers: each re-plans a spot and a rig every few minutes by the same score Ray uses, casts at their own pace, and lands a bass with a chance that follows that score and their skill, with lengths drawn from the species' own size distribution. They are rates, not fully simulated boats, and the docs say so. Their catches come through as one-line reports ("Kim: 17.2 in largemouth off the dock"), the bar shows your limit, total and place, and the results card ranks everyone and posts your total inches (in tenths) to the day's board. Only largemouth and smallmouth count; everything else still goes in the journal.

## Photo mode and the share card (v0.19.0)

**Save photo** on the catch card renders the frame you are looking at, the fish in hand against the lake, and writes the catch onto it: species, class, length and weight, rig, lure and technique, time, date and weather, with the game's footer. On a phone it opens the share sheet; elsewhere it downloads a 1280×720 PNG. **Photo mode** (menu button, or O at any time) hides every overlay and hands you a free camera that orbits the kayak: drag to orbit, wheel to zoom, 1/2/3 to skip to dawn, dusk or night, P for the lenses, Enter or the button to save a captioned photo. The lake keeps living while you frame it. Honest gaps: no depth of field yet, and the camera stays above the surface. QA: `photo(on)`, `photoOrbit(yaw,pitch,dist)`, `savePhoto('catch'|'photo')` (returns the card without downloading).

## First Light sessions (v0.18.0)

**Fish today's session** on the menu: twenty real minutes on the cove at four times speed, a dawn, a dusk or a night of cats. The day's seed (the calendar date in the lake's time zone, plus the variant) fixes the fish, the weather preset and the **target species**, so everyone who fishes today's dawn fishes the same lake for the same fish. Points are length in inches, tripled for the target, a quarter more for a trophy of it. A fish hooked before the horn still counts. The session card sums it up, takes three initials and posts the score to the fleet's shared board (`game-scores.jez237.workers.dev`, one board per variant per day), then shows the day's top ten with your row marked. No licences, no cooldowns, no cost: fish it as many times as you like, the board keeps the best. QA: `session(variant,{key,seed})`, `sessionState()`, `endSession()`, `sessionSubmit(initials)`, `leaveSession()`.

## Ray speaks (v0.17.0)

The guide has a voice. Twenty-six events (a bite, a set that came too early or too late, the hookup, a jump, slack through a head-shake, too much tension, the three ways to lose a fish, a landing by size class, the first of a species for the book, a personal best, a musky follow, a snag and its two endings, a frayed line and the retie, an unlock, falling pressure, a skunked evening, bait showing) each have three or four short lines (`voice-lines.js`), spoken by ElevenLabs' "Bill" and shipped as 64 kbps clips in `assets/voice/`. The rules (`voice.js`, tested): no line repeats back to back, one line at a time with higher-priority events interrupting lower ones, chatter events rate-limited (slack every six seconds at most, bait once every three minutes), and the browser's speech synthesis as the fallback if a clip cannot play. A volume slider on the menu; the same voice speaks in the Watch Demo. Dynamic captions (the plan, the reasons) stay text.

## Line care, snags and the tackle box (v0.16.0)

**Snags.** A lure dragged along the bottom through a laydown, the stumps or under the dock hangs up now and then (cranks worst, bait less, topwater never). The tension bar reads SNAGGED. Clear it the way real ones are cleared: give it slack for a moment, then snap the rod (F). A snap under load mostly just buries the hook. Pull hard instead and the line goes at the weakest link, sooner if it is frayed, and a fresh line is tied on for free. **Line care.** Line that rubs wood or rock frays, during a retrieve on the bottom and much faster while a fish runs through cover. A frayed line breaks below its rating (down to half), the line readout says so, the guide says "check your line", and R reties it in three seconds with the rod down. Ray does both in the demo ("Snagged. Slack, then snap it." / "Line's frayed from that wood. Retying."). **The tackle box grows through catches, never through money.** You start with the finesse spinning rig, the topwater walker and the float rig; the squarebill unlocks after three fish in the journal, the bottom rig after six, and the musky rig after a trophy-class fish of any species. The menu line names the next unlock and a landing that earns one says so. QA: `forceSnag()`, `retie()`, `setAbrasion(v)`, `unlocked()`.

## Float and bottom fishing, and trolling (v0.15.0)

Two bait rigs join the Tab cycle. The **Float rig** hangs a nightcrawler ninety centimetres under a slip float on six-pound mono: the bait cannot sink past the float, the float sits red-over-white on the surface, and on a take it slides under. It is the classic first fish: bluegill, pumpkinseed, crappie, perch and the odd carp or cat take bait far more readily than they take lures, and bass mostly ignore it. The **Bottom rig** puts cut bait on a sinker with a circle hook: the bait rests on the bed, the rod goes up in the holder while it soaks, and night catfish come to it. Bait bites have a longer window (about three seconds) and no penalty for setting early, and with a circle hook you set by reeling, not by snapping. **Trolling** is recognised as its own technique: cast, then paddle with the line out and the recognizer names it, which walleye, hybrids and musky rate well. The demo angler knows the bait rigs ("A nightcrawler under a float beside the dock. Now we wait.") and soaks them for two and a half minutes before moving.

## Seasons and live weather (v0.14.0)

The calendar now reaches the fish. Water temperature follows the day of the year (36 °F in late January, 80 °F at the start of August) and each species has a comfort band: inside it activity is full, outside it falls off, so bass in January are sluggish and walleye come alive in cold water. The barometric trend counts too: falling pressure feeds them ahead of a front, a sharp rise behind one gives lockjaw. The weather presets carry a trend (overcast falling, rain falling fast), and in **real-time mode** with **Live weather** on (menu setting) the game fetches the lake's current wind, cloud, rain and pressure from Open-Meteo every fifteen minutes and shows it in the conditions strip as "live". Pennsylvania's closed seasons are marked as understood from the Fish and Boat Commission's inland-water rules (bass catch-and-immediate-release only from April 15 through the Friday before the first Saturday after June 11, walleye closed from March 15 through the Friday before the first Saturday in May; check them each spring): the water line reads "spring · bass C&R only" and a catch card in those windows says "closed season, released". Ray reads the pressure in his opening line and his planner scores species by season. QA: `__FIRST_LIGHT.conditions()`, `setWeatherLive(openMeteoJson)`.

## The bait (v0.13.0)

Five schools of shiners and young shad live in the cove (`forage.js`, 36 fish each as one instanced mesh, `forage-mesh.js`). They are not catchable; they are what the predators eat and what the surface shows. Each school lives on a piece of cover the bait likes and is pushed toward whichever bank the wind blows onto (re-homed every three minutes as the wind changes), comes up under the surface at dawn and dusk and sinks through the bright hours, and dimples the surface when it is shallow: nervous water you can read with the lenses on. A predator moving through the school, or your lure reeled through it, scatters it with a boil. Predators feed harder where bait is (their activity climbs by up to a third inside a school), and the demo angler reads it too: "Bait's stacked on the weed bed." QA: `__FIRST_LIGHT.forage()`, `forageTo(i,x,z)`.

## The journal (v0.12.0)

Every fish you land writes a line in the journal (`first_light_journal_v1`: species, length, weight, size class, lure, technique, hour, the cover it came from, the weather). The Species Gallery card is the journal's species card: a **bite clock** shows the guide's hearsay (the species' own activity curve) as faint hourly bars and your catches as solid ones on top, so knowledge firms up from what you actually caught; **It took** lists the lures and techniques that worked for you; **Bests** keeps a personal best per size class; the menu carries a one-line summary of the whole book. Ray's catches in the Watch Demo do not go in your journal. QA: `__FIRST_LIGHT.journalAdd({species,lengthIn,weightLb,sizeClass,lure,technique})`.

## Ray knows the roster (v0.11.0)

The demo angler's planner now scores every spot and rig pair by the species that hold on that cover: how many live there, how active they are at this hour on their own diel curves, how well the rig's technique and lure family suit them, how big they run (a musky is worth a slow hour), whether Ray has already caught one this episode (novelty), and how the lure suits the cover itself (cranks deflect off rock, topwater over grass and pads, worms in wood), with a light term (topwater is a low-light bait, a bucktail is a dusk bait) and a penalty for rigs that have drawn refusals. The plan carries a target species and the caption names it: "Low light and calm water. Largemouth should be on the laydown. Walking the walker over the laydown." Once the bass are in the book Ray reaches for the wire and the bucktail and says what he is after; landings are called by species. The knobs live in `demo.js` `TUNE` and were set by a small search so four canned scenarios (dawn topwater, midday crank on rock, dusk bucktail after bass, dusk topwater before any) each win by a clear margin; `tests/demo.test.mjs` pins them.

Two sim rules landed with it because the first species-aware episodes exposed them. **The spot goes quiet**: a landed fish, a lost fish or a botched hookset puts every fish within a few metres into refusal for a minute or so (`fish.js` `disturb`), so a good laydown yields two or three fish and then Ray has a reason to move rather than a fish on every cast; the per-decision strike constant came down with it (0.28 to 0.18). **Bite-offs teach him**: a pickerel or musky sawing through mono is called as "Bit off clean. Something with teeth. That means the wire", it triggers a replan, and the wire rig gets a strong boost, so the episode's story becomes the one a Nockamixon morning actually tells.

## Species Gallery (v0.10.0)

**Species Gallery** on the menu (or G at any time) puts each of the twelve photo-derived bodies on a turntable over the live lake: pick a species, drag to turn it, and slide from Young to Legend to watch the body scale through its four size classes with the length and weight read off the same curves the catch card uses. Each card carries three real field marks (the kind a guide points at in the net: the largemouth's jaw past the eye, the pickerel's chain pattern, the walleye's white tail tip), where it holds, what it takes, when it feeds, its notes (teeth, the follow, the paper mouth) and your journal count and best for the species. **See it in the lake** cuts to the nearest live one and follows it until you press a key. It is also the QA surface for the models (`gallery.js` is pure and tested; `__FIRST_LIGHT.gallery(id,t)`, `galleryState()`, `galleryLake()`, `closeGallery()`).

## The roster (v0.7.0 to v0.9.0)

All twelve launch species now live in the cove, each with its own tables in `species.js` (size classes, length-weight curve, diel curve, temperature band, the cover it holds on, technique and lure-family preferences, spook radius, fight profile) and its own photo-derived body. The population (`fish.js`) spawns each species on the cover it prefers at its own depth band, and the catch card, journal and QA hooks all name the species.

| Species | Fish | Holds | Depth | Takes | Fight |
|---|---|---|---|---|---|
| Largemouth bass (+ the Ridge Fish) | 8 + 1 | laydowns, dock, weed bed, stumps, pads | 0.4–2.2 m | walking the dog, stop & go, topwater | jumps, head-shakes |
| Smallmouth bass | 5 | riprap, stumps, dock, laydowns | 0.6–3 m | stop & go, twitching, crankbaits | runs and repeated jumps, most stamina |
| Walleye | 4 | riprap, stumps | 2.2–6 m | lift & drop, slow roll, soft plastics; nocturnal | dogged, no jumps |
| Bluegill | 12 | dock, pads, weed bed | 0.3–1.6 m | dead stick, lift & drop, small soft baits; rarely crank or topwater | quick circles, tires fast |
| Muskellunge | 2 | weed bed, laydowns, riprap | 1–4 m | bucktails and crankbaits on a steady or slow-rolled retrieve; a long follow before it commits | violent head-shakes, rolls, the most stamina; teeth |
| Chain pickerel | 5 | weed bed, pads, laydowns | 0.4–2 m | twitching and straight retrieves, crankbaits; bold | quick, thrashing; teeth |
| Hybrid striped bass | 4 | riprap, stumps | 1.5–5 m | straight retrieve, stop & go, crankbaits and topwater at dawn | long powerful runs, rarely jumps |
| Channel catfish | 4 | stumps, laydowns, riprap | 2–6 m | dead-sticked or slowly lifted soft baits; nocturnal | long bulldogging, rolls, never jumps |
| Common carp | 4 | pads, weed bed, dock | 0.5–2.5 m | a dead-sticked soft bait, and only when it wants to; wary | the longest runs in the lake, most stamina |
| Black crappie | 8 | laydowns, dock, stumps | 1–3.5 m | lift & drop, slow roll, small soft baits | light; the paper mouth tears if you horse it |
| Yellow perch | 8 | riprap, weed bed, stumps | 1.5–4 m | lift & drop, small soft baits | light, quick |
| Pumpkinseed | 8 | weed bed, pads, dock | 0.3–1.5 m | dead stick, lift & drop; tiny baits | quick circles |

Every body follows Jez's reference-photo rule: a side-on and a top-down photo generated with GPT Image through fal, cut out, then measured by `source/fish-from-photo.py` into a profile, flank texture and fin card, and compared in the studio pose against the photo (`compare-fish.py`). Since v0.9.0 the comparison fills holes in the rendered silhouette before scoring (pale bodies against a pale sky left holes in the difference mask that were measurement noise, not shape error), so every species below is measured the same way:

| Species | Aspect (render / photo) | Silhouette IoU | Colour diff |
|---|---|---|---|
| Largemouth bass | 0.414 / 0.419 | 0.941 | 41 |
| Smallmouth bass | 0.404 / 0.412 | 0.943 | 40 |
| Walleye | 0.359 / 0.378 | 0.878 | 43 |
| Bluegill | 0.593 / 0.618 | 0.893 | 41 |
| Muskellunge | 0.264 / 0.267 | 0.956 | 40 |
| Chain pickerel | 0.277 / 0.279 | 0.942 | 46 |
| Hybrid striped bass | 0.492 / 0.501 | 0.902 | 48 |
| Channel catfish | 0.362 / 0.373 | 0.920 | 32 |
| Common carp | 0.470 / 0.473 | 0.942 | 44 |
| Black crappie | 0.549 / 0.555 | 0.942 | 51 |
| Yellow perch | 0.464 / 0.474 | 0.925 | 39 |
| Pumpkinseed | 0.596 / 0.618 | 0.896 | 42 |

The walleye and the striper remain the weakest outlines (their spiny first dorsals read partly as body); colour differences are measured under scene lighting against a studio photo, so 40 is the floor rather than a gap. Honest gaps: jaws do not open, pectorals are painted rather than modelled, and there is no top texture yet. QA: `spawnFish(x,z,len,bold,species)`, `studio(len,species)`, `fish()` entries carry `species`.

**The toothy ones (v0.8.0).** A fourth rig, Musky casting (8'6" heavy rod, 400-size reel, 80 lb braid with a wire leader, a double-blade bucktail), joins the Tab cycle. Muskellunge and pickerel carry teeth: hooked on any rig without the wire leader they saw through the line at a per-second rate (musky about one chance in ten each second, pickerel one in thirty), and the loss reads "Bitten off". The musky's signature is the follow: it tracks the lure for four to ten seconds from a metre behind, a caption tells you it is there, and it is far more likely to commit while the lure is still moving inside three metres of the kayak, which is the figure-eight in practice. The demo angler does not yet fish the musky rig.

**Paper mouths (v0.9.0).** A crappie hooked and reeled at more than one and a half times its own weight in tension tears free (its hook hold drains) and the loss reads as a thrown hook; played gently on the finesse rig it comes to hand.

## Watch Demo (v0.6.0)

**Watch Ray fish** on the menu (or leave the menu idle for 75 s) starts a self-playing episode with the real simulation and the player's own input path (`demo.js`). The angler brain scores the cove's cover against the light, distance and what it has already tried, picks a rig and a named technique, and says why in a caption ("Low light and calm water. Walking the walker over the weed bed."). It paddles to the spot, anchors, aims and casts, works the lure with a technique executor (reel and twitch patterns with human jitter, which the recognizer reads back as the intended technique), sets the hook a beat after the take, fights with a reaction delay (bows to jumps, leans on runs), releases, and moves on after refusals or a quiet spell. The director cuts to the lure cam when a fish follows, slows time for a jump and holds the hero shot on a landing; a governor runs the clock forward through quiet stretches. Press any key or tap to take the rod with the fish, tackle and spot as they are. The episode report (`__FIRST_LIGHT.demoReport()`) lists casts, encounters, strikes, landed and lost fish, every decision with its reason, and which shot covered each event. First headless episode: a fish inspected on the lure cam, a slow-motion jump, a landing on the hero shot, 5 casts in 270 s.

## The first fish (v0.4.0)

- **Population** (`fish.js`): ten largemouth spawned on the cove's cover (laydowns, dock, weed bed, stumps, pads) with lengths from 28 to 54 cm and their own boldness, plus one legend, the Ridge Fish, under the north laydown. Persistent for the session; aversion to a lure family grows with every escape and catch.
- **Brain** (`fish-brain.js`): HOLD on structure, CRUISE, INSPECT (shadow the lure from below and behind for one to four seconds), STRIKE, BITE, REFUSE (turn away and sulk for a while), FLEE (the kayak inside its spook radius or a splash within two metres), RESTING after release. Strike chance each half second is boldness × diel activity (`species.js`, crepuscular peaks at dawn and dusk) × technique match × lure family × (1 − aversion). A dead-sticked lure rarely draws a strike; walking the dog does.
- **Bite and set**: the fish holds the lure; set the hook with F, or by reeling, inside about 1.2 s. Too early pulls it away; too late and it spits.
- **Fight** (`fight.js`): runs, sulks, head-shakes and jumps; tension from the fish's pull against your drag and reeling; drag slips above its setting and pays line out. Space reels, A/D sweep the rod for side pressure (which blunts a run), W lifts the rod, S bows to a jump. Slack through a head-shake or a jump drains the hook's hold; tension past the weakest link for about a second breaks it. A tired fish within reach of the rod tip is landed.
- **Landing**: the fish comes to hand in front of the camera, wet and breathing, with a catch card (size class, length, weight from the length-weight curve, rig, lure, technique, fight time, conditions). Release puts it back to rest nearby and logs the catch to the journal (`first_light_journal_v1`).
- **The body** (`fish-photo.js`, v0.5.0): built from reference photographs. A side-on and a top-down studio photo of a largemouth were generated with GPT Image through fal and cut from their backgrounds; `source/fish-from-photo.py` reads the photographed silhouette station by station (the back found by scanning to the first run of dark pixels under the pale fin membranes, the belly by a morphological opening that drops the fin bumps, the width from the top view), writes a 64-station profile, the flank texture and a fin card. The loft follows that profile, each body row samples the photographed row, and the dorsal, anal, pelvic and caudal fins are the photo's own pixels on a sagittal card; both bend with the spine wave. Judged against the photo in a studio pose (`compare-fish.py`): bounding-box aspect 0.414 vs 0.419, silhouette IoU 0.86, mean colour difference 40/255 under scene lighting. The procedural body (`fish-body.js`) remains the fallback if the assets fail to load.

## Under the surface (v0.3.0)

- **The surface from below** (`lake-under-fragment.js`): water-to-air Fresnel with total internal reflection outside Snell's window (48.6°), the above-water world refracted through the window from the same refraction target, the underwater world mirrored across the surface where reflection is total (a flipped mirror pass on High, the deep colour on lower tiers), the sun's glow through the window, absorption along the path to the eye. Hysteresis around the waterline keeps a bobbing eye from flickering between the two surface shaders.
- **Water column** (`optics.js`): exponential-squared fog from the optical preset and clarity (about 8 m visibility in green water at clarity 1), swapped per render pass so the above-water world seen through the window keeps its air haze; dimmer, greener ambient light underwater.
- **Effects** (`underwater-fx.js`): suspended particulate drifting in a box around the camera; light shafts as a screen-space overlay from the sun's projected position, fading with depth and gone at night.
- **Lure cam**: C (or the Cam button, or Y on a gamepad) follows the lure from behind and slightly below while it is in the water; reel, twitch and technique readouts keep working; it returns to the seat when the lure comes in.

## What the water slice contains

- **Real sun and clock.** Sunrise and sunset are computed for the lake (40.46°N, 75.24°W) with the NOAA solar algorithm; the game clock starts 25 minutes before today's sunrise and runs at 4× by default so a session covers a dawn window. Real-time mode follows the wall clock.
- **The lake.** After the Storm's water renderer retuned for a reservoir: fetch-limited wind waves (twelve Gerstner bands, 0.4–6 m, amplitude scaled by wind and by local openness so sheltered water stays glassy), a full-resolution refraction target with depth-guided offsets and Beer–Lambert freshwater absorption, a mirrored-camera planar reflection with a mip-blurred sky fallback, capillary detail, rain rings, wind lanes, a world-space foam and shoreline-wetness atlas, and moving caustics on the bed.
- **Polarized lenses.** The Fresnel term is the real dielectric split into s and p polarization for water (n = 1.333); the lenses remove the s-polarized glare, so near Brewster's angle the surface opens up and the bottom shows through.
- **The ripple field.** A GPU ping-pong 2D wave equation on a 48 m atlas that follows the kayak, fed by pebbles, paddle strokes and the wake; its heights and slopes feed the water shader and the foam.
- **The cove.** A hand-built analytic bed for the Three Mile Run arm: the open lake to the south-west, a steep wooded north shore with a riprap point, a gentle south shore with a gravel flat, dock, milfoil bed and lily pads at the creek mouth, a mid-cove hump and the old channel. It is an approximation for play, not surveyed bathymetry.
- **The banks.** Dense pines and oaks along the waterline with a cheaper backdrop forest behind, grass to the water, cattails in the shallows, all wind-swayed and reflected.
- **First-light mist**, a sun-driven sky with clouds and stars, and a sit-on-top kayak that rides the surface, drifts with the wind, stops on the bank and leaves a wake.

## Water and physical approximations

Waves are analytic bands, not a spectrum simulation; the ripple field is a linear wave equation with damping, so big splashes do not break. Reflections are planar. Mist is three low sheets of noise alpha. The bed is analytic and the cove shape is invented from the real lake's character rather than surveyed. There is no underwater camera yet; the surface shader assumes the eye is above the water.

## Source and verification

Everything is ES modules loaded through a cache-busted importmap (`node source/version-assets.mjs` after edits). Three.js r185 is vendored in `vendor/`. Pure modules have node tests: `npm test` runs `tests/*.test.mjs` (solar position, clock and time-zone round trips, wave dispersion and the CPU inverse, ripple-scheme stability, bed encoding and cove shape, shore distance).

Browser verification uses the QA hook `window.__FIRST_LIGHT`: `step(dt)`, `drive(seconds)`, `render()`, `pixelStats()`, `stats()`, `state()`, `setTime(hour)`, `setClockRate(rate)`, `setWeather(name)`, `setWind(ms, fromDeg)`, `polarized(bool)`, `addRipple(x, z, kind)`, `setCamera(name)`, `quality(tier)`, `forceSize(w, h)`, `debug()`. Occluded tabs throttle animation frames, so drive the simulation by hand and read pixel statistics rather than trusting frame rate.

Tooling installed for the next milestones (fish assets): Blender 4.5.13 LTS (`~/.local/bin/blender`), meshoptimizer 0.24 and gltfpack in `workspace/tools/first-light-tools`, and a Python venv with numpy, Pillow and scipy in `workspace/tools/first-light-venv`.

Textures are CC0 from Poly Haven (see `ASSET-LICENSES.md`).

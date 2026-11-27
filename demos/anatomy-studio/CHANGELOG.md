# Anatomy Studio: changes

Newest first. The README says what the studio does now; this says how it got there.

## 2026-11-27: faster loading, less work per frame

- **Models about half the size** (90 MB → 47 MB in all; the opening view 16.0 MB → 9.0 MB): normals stored with meshopt's octahedral filter at the same 10-bit precision, then gzipped (`scripts/anatomy-studio/pack.mjs`), because Cloudflare does not compress glTF. The studio unzips them with the browser's DecompressionStream.
- **Everything requested at once**: `index.html` lists every module, the manifest and the opening view's models (written by `stamp.mjs`), so they no longer wait on each other. On an emulated 30 Mbit/s, 60 ms connection the studio is usable after about 3.9 s instead of 6.5 s.
- **Ambient occlusion reuses the main pass's depth** instead of drawing every piece a second time: draw calls per frame at default quality drop from about 4,960 to 2,730. `?ao=own` restores the old pass for comparison.
- **Shadows drawn once per frame**, and with the floor reflection only every other frame while just the breathing and heartbeat move.
- **Nothing is drawn while the 3D view is scrolled out of sight**, and models are decoded in worker threads.

## 2026-11-24, round 9: the whole circulation, more lessons, measuring, notes, offline

- **Blood flow** runs out to the legs, arms and head and back through the veins, and speeds up with the heart.
- **Three more lessons**: one swallow, the blood's round trip (one part of the circulation lit at a time) and a meal's route. Lessons moved out of `studio.js` into `lessons.js`.
- **Conditions that change a shape**: an enlarged heart, a collapsed lung, a narrowed leg artery.
- **Wrists** flex; with **exercise** the arteries widen, the pulse strengthens and the jaw drops for mouth breathing. The oesophagus shows its wave.
- **Quiz**: "which system?" and a sixty-second naming round; progress per system.
- **Hear the name** and **word origins** for about a hundred roots.
- **Measure** between two points; **pin notes** to pieces, carried in the link.
- **Embed** takes `&assembly=` and `&lesson=`. **Offline**: a service worker keeps a visit's files.
- Tests: the fast-forward hook no longer draws every intermediate frame (that was what made the browser suites slow and stall under software rendering); CI runs the three suites in parallel with a cached browser; screenshots are compared with references (`compare-shots.mjs`) and uploaded.
- Not done: knee and other large joint movement, "what does this attach to?" (the model has no attachment data).

## 2026-11-17, round 8: lessons, conditions, compare, an elbow

- **Calmer opening view.** Blood flow and the monitor start off; the sway and head hold still while the pointer is over the model.
- **Lessons.** *One heartbeat* and *One breath* walk through the cycle a stage at a time, each stage looping slowly with the monitor on. Tours can be read aloud (**Narrate**).
- **Conditions** for teaching: fast, slow and irregular heartbeat, shallow breathing, a leaking aortic valve. Simplified, with a disclaimer.
- **Compare**: a second finish on the far side of a draggable divider.
- **Elbows** bend a few degrees; the arm's skin and muscle follow per vertex.
- **Embed** (`?embed`): the stage, the explode slider and a link out.
- **Save image**, everyday names in search ("thigh bone"), "read more" on cut descriptions, quiz totals remembered between visits, a loading poster.
- X-ray eases down in close-up. Sound has a level meter so tests can confirm it plays.
- Accessibility: the vitals are announced as text; sliders and the scrubber say their value in words.
- Budgets (`scripts/anatomy-studio/budget.json`) for download size, draw calls and motion cost, checked by the tests; browser tests run in CI.

## 2026-11-17, round 7: vitals, valves, blood flow

- Heart valves hinge and open and shut in the right phases; the head turns, the neck bends, the eyes blink; lungs deform per vertex; gut waves follow each tube.
- **Vitals** panel: pace presets and sliders, playback speed, a heartbeat scrubber with named phases, an ECG and breathing monitor, heart sounds, blood-flow particles.
- A click in X-ray picks the organ aimed at, not the fascia over it; each system has its own X-ray strength; a checkbox per system.
- Liver, stomach, spleen, kidneys and related pieces moved from "thorax" to "abdomen".
- Tests split into `verify.mjs` and `verify-life.mjs`.

## 2026-11-17, round 6: the whole body is alive

- Postural sway, eye movements, swallowing, brain pulsation, venous calibre, ureters.
- Body-wall layers (skin, muscle, fascia) breathe per vertex, fixing muscle showing through fascia.

## 2026-11-17, round 5: breathing, heartbeat, pulse

- Ribs swing rigidly, the diaphragm descends, the heart beats atria-then-ventricles, arteries pulse, the gut ripples. Bone never changes size.

## 2026-11-17, round 4: X-ray is the opening finish

## 2026-11-17, round 3: graphics

- Selection outline, glass X-ray, depth pre-pass for see-through skin, organ and bone materials, patterned cut faces, floor reflection, bloom, depth of field, layered explode, arcing camera moves.

## 2026-11-17, round 2

- Borrowed descriptions say so; source links; stable piece numbers; stage chips for phones; naming quiz; capped cross-sections; one-system explode; minified three.js; quality step-down; CI stamp check.

## 2026-11-17, round 1

- Fixed shortcuts after a button click, picking through see-through pieces, the stale piece count, duplicate detail files, label pile-ups, short-window layout.
- Added shareable links, ranked search, focus and hide, the cross-section plane, quiz, guided tours, key facts, parallel loading, render on demand, context restore, content-hash stamps.

## 2026-09 to 2026-10

- Original studio: 2,270 pieces in ten systems, seventeen nested studies, six finishes, the all-parts board (see git history).

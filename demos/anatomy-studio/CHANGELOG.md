# Anatomy Studio: changes

Newest first. The README says what the studio does now; this says how it got there.

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

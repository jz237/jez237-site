# Observation mode and release regression checks

The opt-in **Watch the aquarium** control directs slow exterior-camera views
of the whole tank, angelfish, cardinal school, cherry shrimp and Corydoras.
Selection favors frontmost visible subjects, checks hardscape and plant
occlusion periodically, and falls back to an overview when blocked. Translation
and focus speeds are bounded. Animals, timing and visual detail are unchanged.
Controls fade after inactivity, wake on input, preserve keyboard focus, and
dragging/zooming or Escape immediately releases the camera. Reduced-motion mode
stays on the overview rather than cycling through close-ups. Pause freezes it.

`npm run check:release` now combines all behavior/collision tests, production
build/synchronization, and automated Chrome checks at 1280×800 and 390×844.
Checks cover missing assets, JS errors, texture bindings, coarse screenshot
differences, camera interaction and same-device frame/CPU regressions.
The generated approval receipt hashes active bundles and public visual assets;
the two Cloudflare guards and GitHub Pages gate reject an untested changed build.
`npm run check:live` verifies both production entries and active asset bytes.

Validation on September 18:

- 239 tests passed, including bounded camera motion, every subject category,
  occlusion fallback, pause, reduced motion and stale/missing release receipts.
- Browser checks passed twice against the initial reviewed baseline. All 322
  checked texture bindings loaded, with 2 angelfish, 16 cardinals and 6 cories.
- Desktop frame p95 was 16.8 ms before and during observation. Update p95 was
  2.7 ms before and 2.8 ms during observation; render CPU p95 2.1 → 2.2 ms.
- Phone-size viewport frame p95 also remained 16.8 ms; update p95 2.7 → 2.5 ms.
  These were both RTX 5090 measurements, not measurements of a phone GPU.
- Reviewed desktop/phone screenshots and close-up framing. Actual scene
  visibility selection found each of the four inhabitant categories.
- All 83 shared assets synchronized; Hidden Reef's 38-page link check passed.

Visual comparisons are deliberately coarse to tolerate moving inhabitants.
They catch large regressions and missing bindings, not every possible visual
defect. Screenshots still require review. Baselines must be deliberately renewed
for a different graphics device or an intentional visual change.

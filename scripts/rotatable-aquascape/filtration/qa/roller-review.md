# Fleece roller visual review

2026-09-29T02:39:55.358Z

The five images previously generated using the built-in GPT Image tool were reused with special emphasis on the fleece roller. They are appearance studies, not photographs of actual products or engineering specifications. [Exact prompts and saved output paths](reference-prompts.json). No paid API or purchased assets were used. The images are QA references only and do not add to the live page download.

## Reference comparisons

- [system generated reference](references/system.png) · [before](roller-evidence/before-system-assembled.png) · [after](roller-evidence/after-system-assembled.png) · [exploded](roller-evidence/after-system-exploded.png)
- [roller generated reference](references/roller.png) · [before](roller-evidence/before-roller-assembled.png) · [after](roller-evidence/after-roller-assembled.png) · [exploded](roller-evidence/after-roller-exploded.png)
- [skimmer generated reference](references/skimmer.png) · [before](roller-evidence/before-skimmer-assembled.png) · [after](roller-evidence/after-skimmer-assembled.png) · [exploded](roller-evidence/after-skimmer-exploded.png)
- [biology generated reference](references/biology.png) · [before](roller-evidence/before-biology-assembled.png) · [after](roller-evidence/after-biology-assembled.png) · [exploded](roller-evidence/after-biology-exploded.png)
- [return generated reference](references/return.png) · [before](roller-evidence/before-return-assembled.png) · [after](roller-evidence/after-return-assembled.png) · [exploded](roller-evidence/after-return-exploded.png)

- Compared the fleece roller against the existing generated roller reference and the immediately previous 92d692fc3 published system build. The reference is a material and hardware appearance guide, not an engineering drawing.
- Replaced the simple rolls with irregular wound profiles, fine nonwoven fiber textures, layered end-grain, open core collars, axle hardware and edge fuzz. The clean roll remains pale while the loaded roll and outgoing strip have a distinct tan/brown debris load.
- Rebuilt the frame with shaped side plates, bearing collars, socket screws, base rails, feet, clear wet panels and fine comb slots. The removable cradle has genuine open slats and curved lower support rails.
- Added a die-cast-style gear cover, split gasket, countersunk socket screws, fluted motor can, end caps, a small identification plate, cable gland and strain relief. A mounted level probe, lens and illuminated indicator replace the simple sensor box.
- Rebuilt the hollow inlet union and downward outlet while keeping the connection to the whole-system drain aligned. The chamber has moving water and local bubbles. These effects disappear during separation and freeze on pause.
- The continuous fleece now has actual curved, subdivided, subtly wrinkled geometry and surface-bound debris that moves during an advance. Corrected roll winding so the used spool winds up while the clean spool feeds down; the existing sensor timing is preserved.
- The original eight selectable roller parts and 42 total parts remain. Fine details follow their parent part in explosion and isolation. Static sensor hardware is batched while the LED remains independently animated.
- Reviewed assembled, exploded, front, top, close-up, isolated hardware and phone views, including rendered advancing sequences and identical paused frames. Passing functional checks are not proof of photographic realism.
- Foam, wet reflections and microscopic fiber scattering remain simpler than the generated reference; this pass is a visual improvement, not photographic parity. No purchases or image-generation services were used.

## Performance and limits

Serial local Chrome 1440x1080 DPR1; 1s scene warmup then 4s RAF and browser-task sample. This is not a low-end hardware claim.

| View | FPS before → after | Draw calls before → after | Rendered triangles before → after |
| --- | --- | --- | --- |
| system | 59.9 → 59.6 | 313 → 336 | 1,077,190 → 979,726 |
| roller | 60.1 → 53.1 | 71 → 94 | 387,236 → 289,772 |
| skimmer | 60.2 → 60.1 | 93 → 93 | 412,212 → 412,212 |
| biology | 52.4 → 59.8 | 18 → 18 | 1,015,384 → 1,015,384 |
| return | 60.1 → 60.1 | 25 → 25 | 72,972 → 72,972 |

Initial ready time versus the immediately previous published realism pass was 5320 ms before and 6121 ms after in this run. This candidate startup sample is slower and adds 23 draw calls while removing 97,464 rendered triangles from the roller and whole system. Repeated warmed measurements are recorded below because the first sweep included transient low frame-rate samples on both builds. Values vary with browser and shader cache state; no slow-computer performance claim is made. The 5.11 MB compressed full-detail rock mesh loads only when Living rock is selected. Mesh construction happens at build time; subpixel packed positions retain all triangles.

[Full measurements](roller-evidence/performance.json). [Mobile view](roller-evidence/mobile-skimmer-exploded.png). [Roller rising](roller-evidence/roller-cycle-rising.png), [advancing](roller-evidence/roller-cycle-advancing.png), [stopped](roller-evidence/roller-cycle-clear.png). [Skimmer time 0](roller-evidence/skimmer-motion-0.png), [later](roller-evidence/skimmer-motion-3.png).

Build and browser checks passed. The goal of this pass was a visible improvement toward the generated references. **Photographic parity has not been reached.** Publication and live asset verification are recorded separately in publication.json.

## Final-build motion and repeated timing evidence

The full five-view and regression checks used the final geometry and materials before two small corrections: debris was coupled precisely to fabric texture travel, and the sensor mount/height was adjusted to reach the frame and sit above the normal water line. The final built asset then passed the targeted rendered motion, pause, isolated-part, mobile and reduced-motion checks. [Motion results](roller-evidence/motion-results.json).

[Final assembled](roller-evidence/final-normal.png), [close-up](roller-evidence/final-close-up.png), [exploded](roller-evidence/final-exploded.png), [sensor](roller-evidence/final-detail-sensor.png), [inlet](roller-evidence/final-detail-roller-inlet.png), [phone assembled](roller-evidence/final-phone-assembled.png), [phone exploded](roller-evidence/final-phone-exploded.png). The rendered sequence includes [advance start](roller-evidence/final-advance-0.png) and [advance later](roller-evidence/final-advance-3.png); cloth debris and wound texture visibly move. The two paused captures are byte-identical.

An earlier alternating three-trial warmed comparison measured the whole system at 42.8–58.4 FPS before and 57.7–60.1 after; the roller was 52.0–60.0 before and 46.6–59.4 after. The final five-view sweep measured the roller at 60.1 before and 53.2 after. These results show variable frame pacing and some cost from the richer materials, despite fewer triangles. Startup samples also varied, so no startup-speed improvement is claimed. [Initial samples](roller-evidence/initial-performance.json), [repeated samples](roller-evidence/repeated-performance.json). Low-end hardware was not tested.

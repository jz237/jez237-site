# Complete sump visual review

2026-09-29T02:06:01.810Z

The five images previously generated using the built-in GPT Image tool were reused with special emphasis on the whole-system view. They are appearance studies, not photographs of actual products or engineering specifications. [Exact prompts and saved output paths](reference-prompts.json). No paid API or purchased assets were used. The images are QA references only and do not add to the live page download.

## Reference comparisons

- [system generated reference](references/system.png) · [before](system-evidence/before-system-assembled.png) · [after](system-evidence/after-system-assembled.png) · [exploded](system-evidence/after-system-exploded.png)
- [roller generated reference](references/roller.png) · [before](system-evidence/before-roller-assembled.png) · [after](system-evidence/after-roller-assembled.png) · [exploded](system-evidence/after-roller-exploded.png)
- [skimmer generated reference](references/skimmer.png) · [before](system-evidence/before-skimmer-assembled.png) · [after](system-evidence/after-skimmer-assembled.png) · [exploded](system-evidence/after-skimmer-exploded.png)
- [biology generated reference](references/biology.png) · [before](system-evidence/before-biology-assembled.png) · [after](system-evidence/after-biology-assembled.png) · [exploded](system-evidence/after-biology-exploded.png)
- [return generated reference](references/return.png) · [before](system-evidence/before-return-assembled.png) · [after](system-evidence/after-return-assembled.png) · [exploded](system-evidence/after-return-exploded.png)

- Reviewed the complete sump against the existing generated system reference and immediately previous published 37bae10e5 build. The new lower camera angle exposes chamber contents and uses more of the viewport width.
- Rebuilt the installed plumbing with socketed PVC bends, ridged unions, elastomer seals, a valve body/handle and a return riser seated on the pump discharge. The emergency drain stays dry in normal operation.
- Thicker glass panels, silicone joints, edge tint, a fixed inlet divider, operating-level graduations, cable clips and a cushioned base give the enclosure a constructed rather than diagrammatic appearance. All additions remain with their parent component when separated.
- Raised operating water and matched baffle heights. Added irregular traveling surface ripples, a falling sheet, localized small bubbles at the final baffle, wet menisci, restrained moving light on the bottom and small glass droplets. Rejected the first regular washboard ripple render.
- The surface texture is generated once from a cached scalar height field; animation updates texture offsets/uniforms and 900 small local bubbles, without rebuilding meshes each frame.
- Preserved the detailed roller, skimmer, living-rock and pump exhibits, the 42 selectable parts, all lessons, pointer picking, explosion/isolation, pause, reset and reduced-motion behavior. Freshwater/reef aquarium source and bundles are unchanged.
- Front, top, perspective, exploded and mobile views are inspected, alongside actual water time sequences. Pixel-identical paused captures verify that the new wet effects freeze. Functional checks do not establish realism.
- The overall installation reads more convincingly, but foam scattering, fluid turbulence and object reflections still do not match the generated reference. Dimensions and water motion remain illustrative rather than engineering specifications.

## Performance and limits

Serial local Chrome 1440x1080 DPR1; 1s scene warmup then 4s RAF and browser-task sample. This is not a low-end hardware claim.

| View | FPS before → after | Draw calls before → after | Rendered triangles before → after |
| --- | --- | --- | --- |
| system | 60.1 → 60.1 | 276 → 313 | 1,048,472 → 1,077,190 |
| roller | 60.0 → 60.1 | 71 → 71 | 387,236 → 387,236 |
| skimmer | 60.1 → 60.0 | 93 → 93 | 412,212 → 412,212 |
| biology | 55.1 → 60.0 | 18 → 18 | 1,015,384 → 1,015,384 |
| return | 60.2 → 60.1 | 25 → 25 | 72,972 → 72,972 |

Initial ready time versus the immediately previous published realism pass was 4604 ms before and 4610 ms after in this run. The 6 ms difference is effectively unchanged within measurement noise. The full system adds 37 draw calls and 28,718 rendered triangles; the other four individual views retain their geometry and draw counts. Values vary with browser and shader cache state; no slow-computer performance claim is made. The 5.11 MB compressed full-detail rock mesh loads only when Living rock is selected. Mesh construction happens at build time; subpixel packed positions retain all triangles.

[Full measurements](system-evidence/performance.json). [Mobile view](system-evidence/mobile-skimmer-exploded.png). [Roller rising](system-evidence/roller-cycle-rising.png), [advancing](system-evidence/roller-cycle-advancing.png), [stopped](system-evidence/roller-cycle-clear.png). [Skimmer time 0](system-evidence/skimmer-motion-0.png), [later](system-evidence/skimmer-motion-3.png).

Build and browser checks passed. The goal of this pass was a visible improvement toward the generated references. **Photographic parity has not been reached.** Publication and live asset verification are recorded separately in publication.json.

An earlier single roller sample fell to 38.5 FPS. It was investigated before acceptance: three serial repeat samples for the baseline and candidate all held about 60 FPS, as did the final comparison. [Original sample](system-evidence/initial-performance-sample.json) and [repeat measurements](system-evidence/roller-performance-recheck.json) are preserved. The final baseline rock sample was 55.1 FPS versus 60.0 FPS for the candidate despite unchanged geometry; this is sampling variability, not an optimization claim.

## Whole-system motion and alternate views

[Front](system-evidence/system-front.png), [top](system-evidence/system-top.png), [perspective](system-evidence/system-perspective.png), [exploded](system-evidence/system-exploded.png), [phone](system-evidence/mobile-system.png). [Water sequence start](system-evidence/water-0.png) and [end](system-evidence/water-4.png) visibly differ in the surface ripple, weir bubbles and bottom light. [Paused first](system-evidence/paused-0.png) and [later](system-evidence/paused-1.png) are byte-identical PNGs after damping settled. `system-motion.mjs` verifies this behavior.

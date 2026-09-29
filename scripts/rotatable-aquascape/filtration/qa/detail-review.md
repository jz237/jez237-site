# Filtration fine-detail review

2026-09-29T01:29:10.483Z

The five images previously generated using the built-in GPT Image tool were reused for this deeper detail pass. They are appearance studies, not photographs of actual products or engineering specifications. [Exact prompts and saved output paths](reference-prompts.json). No paid API or purchased assets were used. The images are QA references only and do not add to the live page download.

## Reference comparisons

- [system generated reference](references/system.png) · [before](detail-evidence/before-system-assembled.png) · [after](detail-evidence/after-system-assembled.png) · [exploded](detail-evidence/after-system-exploded.png)
- [roller generated reference](references/roller.png) · [before](detail-evidence/before-roller-assembled.png) · [after](detail-evidence/after-roller-assembled.png) · [exploded](detail-evidence/after-roller-exploded.png)
- [skimmer generated reference](references/skimmer.png) · [before](detail-evidence/before-skimmer-assembled.png) · [after](detail-evidence/after-skimmer-assembled.png) · [exploded](detail-evidence/after-skimmer-exploded.png)
- [biology generated reference](references/biology.png) · [before](detail-evidence/before-biology-assembled.png) · [after](detail-evidence/after-biology-assembled.png) · [exploded](detail-evidence/after-biology-exploded.png)
- [return generated reference](references/return.png) · [before](detail-evidence/before-return-assembled.png) · [after](detail-evidence/after-return-assembled.png) · [exploded](detail-evidence/after-return-exploded.png)

- Compared every exhibit against its existing generated reference and the previous published b98aed788 build. Geometry remains freely rotatable, selectable and separable; reference images are not substituted for models.
- Skimmer: added wet acrylic transmission, a drilled clear lid, irregular condensation, silicone hose and collars, diffuser standoffs, adjustable outlet markings, amber waste with a scum meniscus, 22,000 rising bubbles and 3,200 foam points. The contact chamber still lacks full volumetric foam scattering.
- Roller: replaced cork-like dirty material with layered nonwoven fibers, fine edge fuzz, wound end geometry, irregular stains and captured debris. Added acrylic lower walls, weir combs, structural supports and geared motor details. Cloth remains an illustrative strip rather than a simulated flexible fabric.
- Rock: added smaller true cavities, more irregular relief, surface-attached muted coralline crusts, calcareous tubes and small sponges. Rejected the first brightly dotted growth render and reduced its size/color contrast after visual review. The biological teaching overlays remain intentionally enlarged.
- Pump: replaced the wire-like intake with a molded slotted cage; added split mounting rails, rubber feet, shaft seats, molding seams, strain relief and threaded discharge. All details stay attached to the corresponding separated component.
- Sump and light: added continuous rippled water surfaces, a falling sheet at the last baffle, wet menisci and silicone seams. Replaced flat environment light with broad studio highlight sources and softened the initially over-sharp shadow revision. Reflections and turbulent surface detail remain less complex than the generated reference.
- Reviewed all assembled/exploded desktop views, front/top/oblique and close-up views, phone layouts, actual roller-cycle and skimmer time sequences. All 42 parts remain selectable and pause/reduced-motion/idle checks pass.
- The result is visibly more detailed than the last release, but photographic parity is not claimed. Functional tests do not establish visual realism.

## Performance and limits

Serial local Chrome 1440x1080 DPR1; 1s scene warmup then 4s RAF and browser-task sample. This is not a low-end hardware claim.

| View | FPS before → after | Draw calls before → after | Rendered triangles before → after |
| --- | --- | --- | --- |
| system | 60.1 → 60.2 | 230 → 276 | 422,160 → 1,048,472 |
| roller | 60.2 → 60.2 | 34 → 71 | 45,570 → 387,236 |
| skimmer | 60.1 → 60.1 | 82 → 93 | 135,892 → 412,212 |
| biology | 60.1 → 60.1 | 9 → 18 | 367,294 → 1,015,384 |
| return | 60.1 → 60.0 | 19 → 25 | 61,582 → 72,972 |

Initial ready time versus the immediately previous published realism pass was 2882 ms before and 4023 ms after in this run. Richer geometry/material initialization is slower with increased draw calls. This is an explicit realism tradeoff, not a load-time improvement. Values vary with browser and shader cache state; no slow-computer performance claim is made. The 5.11 MB compressed full-detail rock mesh loads only when Living rock is selected. Mesh construction happens at build time; subpixel packed positions retain all triangles.

[Full measurements](detail-evidence/performance.json). [Mobile view](detail-evidence/mobile-skimmer-exploded.png). [Roller rising](detail-evidence/roller-cycle-rising.png), [advancing](detail-evidence/roller-cycle-advancing.png), [stopped](detail-evidence/roller-cycle-clear.png). [Skimmer time 0](detail-evidence/skimmer-motion-0.png), [later](detail-evidence/skimmer-motion-3.png).

Build and browser checks passed. This pass substantially adds surface detail and mechanical structure toward the generated references. **Photographic parity has not been reached.** Publication and live asset verification are recorded separately in publication.json.

Close-up evidence: [skimmer](detail-evidence/skimmer-close.png), [roller](detail-evidence/roller-close.png), [rock](detail-evidence/biology-close.png), [pump](detail-evidence/return-close.png). Water motion is subtle at the default system scale; its before/later frames are retained, not described as turbulent realism.

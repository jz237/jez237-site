# Filtration realism review

2026-09-29T00:42:36.594Z

Five images were generated using the built-in GPT Image tool, one for each exhibit view. They are appearance studies, not photographs of actual products or engineering specifications. [Exact prompts and saved output paths](reference-prompts.json). No paid API or purchased assets were used. The images are QA references only and do not add to the live page download.

## Reference comparisons

- [system generated reference](references/system.png) · [before](realism-evidence/before-system-assembled.png) · [after](realism-evidence/after-system-assembled.png) · [exploded](realism-evidence/after-system-exploded.png)
- [roller generated reference](references/roller.png) · [before](realism-evidence/before-roller-assembled.png) · [after](realism-evidence/after-roller-assembled.png) · [exploded](realism-evidence/after-roller-exploded.png)
- [skimmer generated reference](references/skimmer.png) · [before](realism-evidence/before-skimmer-assembled.png) · [after](realism-evidence/after-skimmer-assembled.png) · [exploded](realism-evidence/after-skimmer-exploded.png)
- [biology generated reference](references/biology.png) · [before](realism-evidence/before-biology-assembled.png) · [after](realism-evidence/after-biology-assembled.png) · [exploded](realism-evidence/after-biology-exploded.png)
- [return generated reference](references/return.png) · [before](realism-evidence/before-return-assembled.png) · [after](realism-evidence/after-return-assembled.png) · [exploded](realism-evidence/after-return-exploded.png)

- Reviewed all five generated appearance references against both old and new rendered views. The revised meshes remain freely rotatable and explodable; no photograph substitutes for the model.
- Whole sump: clearer panes with thickness and edge seams, physical unions, subtly disturbed water and grounded shadows. Water still lacks the reference's full turbulent reflections and wet surface complexity.
- Fleece roller: shaped support plates, recessed bolts, seams, cable, fiber detail and wound roll ends. Cloth microfibers and accumulated debris remain less rich than the generated close-up.
- Protein skimmer: cylindrical base section, flanges, hose/union hardware, physical acrylic, dense rising bubbles and neck foam. Glass refraction, condensation and foam still fall short of the reference.
- Living rock: replaced smooth slab/bead construction with one porous irregular solid cut into three sections, with mineral flecks and coralline variation. The generated reference has more varied encrusting organisms and smaller cavities.
- Return pump: open rotor cavity, ribbed rounded motor, curved impeller, seals, recessed fasteners and open intake slots. Mechanical surfaces are substantially more legible, though not a photographic match.
- Desktop front, top, oblique, assembled, separated and isolated views inspected. Phone controls remain legible and contained.
- Actual roller sequence reviewed: rising water, brief roll advance and motor stop. Actual skimmer sequence reviewed: dense bubble cloud changes continuously and neck foam rises. Pause freezes motion.
- All 42 components remain selectable. Reduced-motion and paused idle checks pass; no console/runtime errors. Tests establish behavior, not photographic realism.

## Performance and limits

Serial local Chrome 1440x1080 DPR1; 1s scene warmup then 4s RAF and browser-task sample. This is not a low-end hardware claim.

| View | FPS before → after | Draw calls before → after | Rendered triangles before → after |
| --- | --- | --- | --- |
| system | 60.0 → 60.1 | 300 → 230 | 46,914 → 422,160 |
| roller | 59.7 → 60.2 | 94 → 34 | 5,062 → 45,570 |
| skimmer | 60.1 → 60.1 | 118 → 82 | 28,286 → 135,892 |
| biology | 60.2 → 60.2 | 343 → 9 | 143,250 → 367,294 |
| return | 60.1 → 60.1 | 46 → 19 | 9,758 → 61,582 |

Initial ready time was 1318 ms before and 3023 ms after in this run. Richer geometry/material initialization is slower despite fewer draw calls. This is an explicit realism tradeoff, not a load-time improvement. Values vary with browser and shader cache state; no slow-computer performance claim is made. The 3.82 MB compressed full-detail rock mesh loads only when Living rock is selected. Mesh construction happens at build time; subpixel packed positions retain all triangles.

[Full measurements](realism-evidence/performance.json). [Mobile view](realism-evidence/mobile-skimmer-exploded.png). [Roller rising](realism-evidence/roller-cycle-rising.png), [advancing](realism-evidence/roller-cycle-advancing.png), [stopped](realism-evidence/roller-cycle-clear.png). [Skimmer time 0](realism-evidence/skimmer-motion-0.png), [later](realism-evidence/skimmer-motion-3.png).

Build and browser checks passed. The goal of this pass was a visible improvement toward the generated references. **Photographic parity has not been reached.** Publication and live asset verification are recorded separately in publication.json.

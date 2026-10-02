# APX-9 release verification — 2026-10-02

## Model and rendering

- All nine assembly builders and finalization complete without errors.
- 573 selectable parts and assembly groups, including 502 named components with geometry.
- High quality: 2,874,932 triangles and 1,232 meshes.
- Structural audit passes: required systems present, no empty leaves, unique valid identifiers, descriptive metadata, aggregate geometry and draw-mesh budgets respected.
- Completed the previously absent thorax structural cage, abdomen payload frame, head optical chassis and sampling jaws; integrated the detailed flight motor and controller.
- Reviewed assembled, exploded, side, front and rear renders against the supplied concept references. Refined the dense thorax mantle, wing-root proportions, swept wing pose, narrow dorsal service plates, chrome roughness and dark compound optics.
- Checked HUD-aware desktop framing and portrait framing. Backdrop geometry now retains its aspect ratio on phones.

## Interaction

`node scripts/apx9-bee/qa/uitest.cjs` — **60/60 passed**.

Coverage includes pointer picking and hover, inspector, keyboard navigation, explode slider, play/reassembly, orbit/pan/zoom, isolation, X-ray, searchable directory, both detail views, every guided-tour step, labels, mobile dock and browser error collection.

`node scripts/apx9-bee/qa/audit.cjs all` — **PASS**.

Material-count advisories on complex mechanical components are expected; the complete scene remains within its aggregate mesh and triangle budgets.

## Runtime smoke checks

Chrome with ANGLE/Vulkan on a Radeon 8060S, 1400 × 900 at device pixel ratio 1:

- Continuous orbit: measured 60.0 fps over eight seconds after warm-up, high quality with AO enabled.
- Animated explode and reassembly both reached their endpoints.
- No JavaScript errors.
- iPhone 13 browser emulation: medium quality automatically selected, all 573 selectable parts retained, no horizontal layout overflow, explosion completed.

The phone check is viewport/touch emulation, not a physical-device GPU benchmark. Frame rates depend on the user's hardware and display resolution.

## Reproduce

Run from the repository root. See [README.md](README.md) for dependencies and camera/debug options. For screenshot reviews that include the HUD, pass `--q band=1` to `qa/shot.cjs`; its default QA framing intentionally ignores HUD exclusions for modeling inspection.

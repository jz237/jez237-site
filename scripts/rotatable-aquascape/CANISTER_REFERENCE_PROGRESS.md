# Canister reference goal

Reference: C:/Users/jrb04/.codex/attachments/939ae9d9-dd13-41d4-a32c-5a01f585fd5f/image-1.png

The objective remains the full reference-matching filter, the same exhibit on jez237 and Hidden Reef, removal of Showroom & tank planner, and stronger styling for all nine Hidden Reef discovery buttons.

Implemented in this pass:
- Rotatable aquarium imports the existing photographic FilterBreakdown and FilterScene directly. Hidden Reef cutaway and water lesson steps use it. The underlying aquarium render pauses while the exhibit is open, preserving the visitor pause setting.
- Recessed ceramic geometry, connected foam cells, clear hoses/window, revised frontal framing, glass return bell, and a real geometry ceramic magnification view.
- Removed the Hidden Reef planner link in both initialization paths. Nine discovery buttons use a prominent teal grid.
- Built both photographic and rotatable sources. Rotatable build:sites synchronizes jez237 and both Hidden Reef variants. Photographic static-dist must also be copied to demos/living-aquascape when shared filter source changes.

Verification completed locally: 144 aquarium tests; material geometry tests after final pore smoothing; both TypeScript builds; both Hidden Reef link checks; three-copy asset checker; browser inspection at desktop and 412x915; traced flow, component isolation, exploded view, and water-lesson component selection/next navigation.

Not a completed reference-fidelity audit: the reference still has richer steel reflections, realistic wet foam/fiber texture and porous ceramic microstructure. Current screenshots remain visibly procedural. Continue improving those materials and lighting rather than declaring exact photographic quality or marking the full goal complete based only on functional tests. Verify final live artifacts on both production domains after any deployment.

Material-finish pass:
- Replaced uniform room illumination with shaped studio panels for steel highlights.
- Added shared 1024px ceramic grain/bump textures, with self-shadowing in the real-geometry macro view.
- Widened and centered the housing cutaway; thinned basket ribs to reveal the media.
- Whitened the polishing pad and added 7,000 instanced sidewall fibers, complementing the existing top fibers.
- Opened the front of the stator laminations so individual copper windings are visible.
- Desktop visual review confirms clearer media and copper windings; all 144 tests, both builds, 38-asset synchronization and both 38-page link checks pass.
- Still incomplete against the reference: return-water jet detail, more organic ceramic rim pores, and stronger grounded studio-floor composition. Keep the goal active; this pass improves real model fidelity but does not establish photographic equivalence.

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

Outlet and ceramic-rim pass:
- Added a bounded instanced outlet stream: 64 short water threads and 360 falling droplets. It follows flow enable/disable and hides during exploded, isolated, or trace presentations.
- Added recessed pores on both ceramic end rims, preserving the open bore and finite normals.
- Added subtle stone floor grain and restrained illumination beneath the canister.
- Verified desktop and 412x915 phone framing, outlet toggle, no browser errors, 146 passing tests, both production builds, all three copied assets and both link checks.
- Visual comparison still shows a slimmer, more schematic canister than the reference; the head/valve proportions, side-channel routing and dense ceramic packing are the next concrete fidelity work. No claim of photographic equivalence or completed goal.

Proportions and media pass:
- Larger frontal framing and a wider desktop component directory align the composition more closely with the reference.
- A shaped, stepped motor-head cover replaces the flat disk.
- Ceramic media increases from 78 to 126 full-detail rings in five instanced batches. Raised the lower layer to clear its support plate.
- Flow follows separate hose and down-channel curves, removing the diagonal spline shortcut. Less correlated outlet-droplet phases avoid a spiraling spray pattern.
- Mobile canvas reserves space above and below for labels and the toolbar; the exploded base was previously partly covered.
- Close-up/isolation, desktop and mobile assembly views verified; 146 tests, both builds, synchronization, both link checks pass.
- Goal remains active: material realism, ceramic packing contacts and the glass/water interface still fall short of the supplied photographic reference. Next pass should address those visual gaps, not rework already-completed button emphasis or navigation removal.

Settled packing and transparent housing pass:
- Replaced hand-arranged overlapping media with 126 offline settled poses, using exact outer-cylinder support along separating axes. Conservative closed-cylinder envelopes keep hollow ceramic rings apart without a runtime physics cost.
- Deeper ceramic basket and relocated polishing pad contain the settled stack. Saved-pose tests verify neighboring separation, support, floor clearance, wall clearance and polishing-pad clearance.
- Added rounded clear-window edges, less tinted hoses, a transparent inlet down-channel, silver strainer rims and softer steel highlights.
- Reduced excessive shadow normal bias and tightened its depth interval to preserve small-media contact detail.
- Full 147-test suite passes, both builds pass, all three aquarium copies match, both link checks pass; browser close-up shows supported media and no rendering errors.
- Keep full goal active: indirect/contact shading in the ceramic recesses remains visually flatter than the reference. Existing site synchronization, removed planner navigation, and all nine emphasized discovery buttons remain part of the completion audit.

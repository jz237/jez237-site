# The iterating loop behind this demo

Built with Loopy's feedback-cycle design (observe, choose, act, verify, record, repeat or stop).

## Loop prompt

Makes a browser demo match two reference images, one fixed-state render at a time, and stops when an independent reviewer accepts it or progress stalls.

> Goal: an animated exploded view that matches the attached infographic (exploded state) and photo (assembled state). Each pass: render fixed states, score them against the references, fix the single biggest gap, re-render. Accept only when an independent reviewer scores every criterion 3 or higher and the mean 3.8 or higher. Stop after two passes with no improvement. Finish as success, blocked, approval-required, or no-progress. Ask before publishing unless told to post.

## Pass cycle used here

1. **Observe.** `node tools/shoot.mjs --out iterations/itNN --shots poster,assembled,closed` renders real GPU WebGL frames at the reference size through the `window.__flower.renderAt` capture API.
2. **Choose.** Compare against `reference/` (not committed) and pick the one change that closes the largest visible gap.
3. **Act.** One bounded edit in `src/` or `styles.css`, then `node tools/cachebust.mjs`.
4. **Verify.** `python3 tools/score.py iterations/itNN` gives working proxy metrics (structure correlation, hue overlap, saturated-pixel cover, screw anchor error against the 84 reference screw pixels). These are a working signal only.
5. **Gate.** A separate reviewer who never saw the edits scores the renders against the references. Proxy metrics cannot approve a pass; they drop when petals get darker and more saturated, which is the direction the references need.
6. **Record.** Append the pass to the log below.

## Acceptance rubric (reviewer scores 1 to 5)

1. layout and labels vs the infographic
2. exploded parts: arrangement and proportions
3. enamel material: saturation, gold filigree, gems, gloss
4. assembled state vs the photo (the flower itself; poster title, insets and dock are intentional page chrome)
5. mechanical detail: gears, braid, collars, cage, core
6. closed-bud state plausibility

Run 1 and 2 accepted when every criterion was at least 3 and the mean at least 3.8. Run 3 raised the gate to a mean strictly above 4.5 (Jez's request), judged against the full photo.

## Terminal states

- **success:** reviewer accepts.
- **blocked:** a needed input or tool is unavailable.
- **approval-required:** the next step is destructive, external, or spends money.
- **no-progress:** two consecutive passes without a better reviewer mean (run 3 allowed about three, because each pass was a large change).

## Iteration log

- it01 to it04: build the rig (parts, poses, poster camera, labels, insets) until all ten callouts and the exploded layout were present.
- it05: screw anchors cast from the poster camera through the 84 reference pixels; assembled hue overlap 0.441.
- it06: reviewer mean 3.3, REJECT. Gaps: pastel petals, light backdrop in the assembled view versus the dark photo, slim petals, weak core.
- it07: deeper enamel palettes, lower specular, broader petals, and an automatic backdrop crossfade from parchment (exploded) to charcoal studio (assembled). Proxy metrics dipped because darker colours leave the saturation mask; visual comparison improved clearly.
- it08: taller, rounder stamen cage. Reviewer mean 3.0, REJECT (assembled match 2).
- it09 to it10: plumper cupped petals with broad colour blends, warmer core, leaves scaled down when assembled, core and cage lifted into the bloom. Reviewer mean 3.17, REJECT; every criterion at least 3, assembled match 2 to 3. Main complaints: dark navy enamel, grey-white specular blowout, crowded exploded petals.
- it11: enamel regraded to saturated magenta, teal, violet and emerald gradients; clearcoat and roughness retuned to cut the grey reflection; top petals shortened. Reviewer mean 3.17, REJECT (no change from it10).
- it12: sparser petal filigree, fewer gems, higher assembled camera to show more petal face and the cup, gloss reduced, closed-bud white hotspot removed. Reviewer mean 3.17, REJECT (layout 4; exploded parts, enamel, assembled match, mechanical detail and closed bud 3 each).
- it13 to it14 (second run, same loop): enamel gains stained-glass facets, a gold cell network and edge eyelets with matching 3D stones; petals gain scrolls, granulation and eyelet stones; collars level and snug; braid smoothed; core gains tilted great-circle bands and equator jewels; stamen cage gains a middle whorl, bead nodes and base studs.
- it15: facet fills made translucent for deeper jewel tones; inner stamen crown moved off the core so the glowing sphere shows; exploded petals narrowed to 70 percent width (body scale, so the assembled petals are unaffected); cage shortened and core enlarged and raised to sit in the cage mouth.
- it16: assembled petals widened 22 percent; closed rings leaned further in so the bud shuts into a pointed dome rather than an open tube.
- it17: four gems per petal (two on the bud petals). Reviewer mean 3.67, REJECT (layout 4, exploded parts 4, enamel 4, assembled 3, mechanical detail 4, closed bud 3). Gaps: milky assembled underside, petals crowd upper left, crown flat.
- it18: exploded petals scaled to 0.82 with rims thickened 40 percent; enamel env reflection and iridescence cut for deeper tones; assembled crown raised so jewelled stamens clear the cage. Reviewer mean 3.83, ACCEPT (layout 4, exploded parts 4, enamel 4, assembled 4 (reviewer called it borderline 3.5), mechanical detail 4, closed bud 3).

- it19 to it20 (third run): Jez asked for a reviewer mean above 4.5 against the full photo. The run-3 reviewer was briefed to compare directly to the photo and scored the starting state 3.25, much harsher than the 3.83 that run 2 gave it18, so run-2 and run-3 scores are not on the same scale.
- it21 to it30: petal-ring, rim and bloom experiments (several rejected). Reviewer mean 3.08 at it30 (no gain).
- it31: petals gain pointed tips and an S-curve sweep. A fourth, assembled-only ring of nine petals (ring D) fills the gaps in the bloom; it is scaled to nothing in the exploded view so the infographic layout is unchanged. Core shader gains rainbow-tinted facets.
- it32: reviewer mean 3.15 (layout 4.0, exploded parts 3.2, enamel 3.1, assembled 2.8, mechanical detail 2.9, closed bud 2.9).
- it33 to it34: stem curves into an S in the exploded state, braid made thinner and darker with more strands, leaf clamps follow the curve, taller stamens added to the cage, leader lines now land on real parts. Reviewer mean 3.15 (4.3, 3.4, 3.0, 2.7, 2.9, 2.6).
- it35: leaned the closed petals further inward to sharpen the bud. Tips crossed and the gold rims wove into a basket; rejected and reverted (not reviewed).
- it36: closed angles restored to the milder values, and the petal gold rims and gems are hidden while the bud is fully closed so it reads as an opaque enamel teardrop. Reviewer mean 3.22 (layout 4.0, exploded parts 3.3, enamel 3.2, assembled 3.0, mechanical detail 3.3, closed bud 2.5).

- it37 to it41 (fourth run): Jez asked to keep the 4.5 gate and also make the metals more colourful, add many flashing glowing points, and remove the one gear not connected to anything. Added a sparkle system (`src/sparkle.js`: additive star glints on jewels and gilt edges, plus 360 drifting motes), multicolour metals and more saturated enamel, removed the stray gear (`leaves.js`), and replaced the squat closed bud with a dedicated lathe teardrop painted with two overlapping tiers of pointed enamel petals (`src/bud.js`); the real petals now stay hidden and scale up as the bud opens. Fixed the enamel inset going black when closed by posing a slightly open bloom for the inset render.
- it38: reviewer mean 3.17, REJECT.
- it40: reviewer mean 3.33, REJECT (best of run 4, above run 3's 3.22).
- it41: reviewer mean 3.28, REJECT (layout 4.2, exploded parts 3.3, enamel 2.9, assembled 3.0, mechanical detail 2.9, closed bud 3.4).

- it42 to it43 (fifth run, one focused pass): Jez sent a close-up of the crystal core in its gold cage and asked to concentrate on the centre, give it more glow and make it stand out. No score target was restated. New `buildCore` in `src/mech.js`: faceted dichroic crystal shader (`coreMaterial` in `src/materials.js`: few large facets, warm hot centre, Fresnel rainbow rim, per-facet glints), 14-meridian gold lattice with a riveted equator strap and jewelled gear studs, tilted armillary bands, a trumpet crown with a faceted ruby and spire, and a footed base. Glow comes from an additive halo sprite, a point light that follows the core and bloom, and 46 glints on the sphere. Stamens are now pink, aqua and amethyst faceted bulbs on shorter outer filaments plus ten taller outward-leaning ones so they frame the core. The core lifts 1.7 above the cage when in bloom, and the core inset is framed on the sphere. A capture bug was fixed on the way: custom `view` shots were being re-framed every frame, so earlier `bloom`, `budclose` and `budmid` shots were mis-framed.
- it42: informational reviewer mean 3.7, centre 3.3 (core read as a pastel ball with fat beads).
- it43: after larger crisper facets, less clipping, a tighter halo, bolder lattice bars and smaller stamen gems, reviewer mean 3.8 (layout 4.2, exploded parts 4.0, enamel 3.8, assembled 3.6, mechanical detail 3.5, closed bud 3.8), centre 3.7; glow stands out with no haze. Published.

Gaps the run-5 reviewer named for the centre: the crystal still has flat stained-glass cells rather than fine prismatic facets with depth; the stamens are low-poly beads, where the photo has tall straight rods with faceted jewels in a ring above the cage rim; the lattice lacks jewelled rosette and gear nodes at the crossings and a perforated band; front petals hide the lower half of the core in the assembled view.

## Outcome

**Fifth run (centre pass): published it43, reviewer mean 3.8 of 5 (centre 3.7), still below the 4.5 gate, which was not restated for this pass.** The text below describes the fourth run, kept for history; the gaps listed after it still apply, plus the centre gaps named in the it43 entry.

**no-progress (fourth run), target not reached.** The goal was still a reviewer mean above 4.5. Three reviewed passes (it38 3.17, it40 3.33, it41 3.28) peaked at 3.33 and the last did not beat it, so the loop stopped. The published state is it41, which scores 3.28 of 5. That is below the gate. The closed bud improved the most (2.5 in run 3, 3.4 now); enamel (2.9) and mechanical detail (2.9) are now the weakest criteria.

What run 4 added that Jez asked for: multicolour metals and more saturated enamel, a lot of flashing glowing points (jewel and rim glints plus drifting motes), and the unattached gear removed. The reviewer was told these are intentional and did not mark them down.

Remaining gaps the last reviewer named. They are structural, so another run needs new models rather than tuning:

- Petal geometry: flat paddles on stalks instead of doubly curved, cupped petals with recurved tips, varied size and cut-out filigree rims; crossing gold ribbons on the upper assembled petals.
- Enamel: per-petal iridescent gradient with a brushed anisotropic normal map, denser scroll filigree, and a few large bezel-set cabochons per petal instead of dozens of tiny dots. The enamel inset should be a close-up of filigree and gems.
- Mechanical density: a stack of small meshed brass gears with spacers and jewelled hubs on the axle, a multi-ring segmented ring gear, and a wider bloom that shows gears and lattice between petals.
- Stamen cage and core: a dense double-hoop lattice with a crowned top, bulb-tipped ruby filaments, and a warm orange-yellow core instead of pastel facets.
- Leaves, stem and insets: hooked, studded leaf mounts, a thinner S-curved stem, a gear-train close-up for the gear inset, and shaded line-art bloom thumbnails.

Third run, kept for history: no-progress at a best of 3.25, published at it36 with 3.22; its closed bud (2.5) was the weakest criterion.

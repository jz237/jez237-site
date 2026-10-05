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

Accept when every criterion is at least 3 and the mean is at least 3.8.

## Terminal states

- **success:** reviewer accepts.
- **blocked:** a needed input or tool is unavailable.
- **approval-required:** the next step is destructive, external, or spends money.
- **no-progress:** two consecutive passes without a better reviewer mean.

## Iteration log

- it01 to it04: build the rig (parts, poses, poster camera, labels, insets) until all ten callouts and the exploded layout were present.
- it05: screw anchors cast from the poster camera through the 84 reference pixels; assembled hue overlap 0.441.
- it06: reviewer mean 3.3, REJECT. Gaps: pastel petals, light backdrop in the assembled view versus the dark photo, slim petals, weak core.
- it07: deeper enamel palettes, lower specular, broader petals, and an automatic backdrop crossfade from parchment (exploded) to charcoal studio (assembled). Proxy metrics dipped because darker colours leave the saturation mask; visual comparison improved clearly.
- it08: taller, rounder stamen cage. Reviewer mean 3.0, REJECT (assembled match 2).
- it09 to it10: plumper cupped petals with broad colour blends, warmer core, leaves scaled down when assembled, core and cage lifted into the bloom. Reviewer mean 3.17, REJECT; every criterion at least 3, assembled match 2 to 3. Main complaints: dark navy enamel, grey-white specular blowout, crowded exploded petals.
- it11: enamel regraded to saturated magenta, teal, violet and emerald gradients; clearcoat and roughness retuned to cut the grey reflection; top petals shortened. Reviewer mean 3.17, REJECT (no change from it10).
- it12: sparser petal filigree, fewer gems, higher assembled camera to show more petal face and the cup, gloss reduced, closed-bud white hotspot removed. Reviewer mean 3.17, REJECT (layout 4; exploded parts, enamel, assembled match, mechanical detail and closed bud 3 each).

## Outcome

**no-progress.** Three reviewed passes (it10, it11, it12) held at mean 3.17 with every criterion at least 3, so the 3.8 acceptance gate was never met and the stop rule fired after it12. The demo was published as the best state reached, on the instruction to post it, rather than as an accepted match.

Remaining gaps the last reviewer named, for the next run of this loop:

- Exploded petals still overlap into a dense cluster; the infographic fans them out with air between them so the cage and glowing core read.
- Assembled petals are narrower and more tapered than the photo's broad, rolled, gold-edged petals; stamens are longer and sparser than the photo's dense crown of short jewelled ones.
- Stem and collars: the braid is a thick helical rope and the collars tilt like springs, where the reference shows a smoothly curved braid with level, snug collars.
- Enamel is still a streak gradient with uniform thin veins; no mottled iridescence or edge eyelets.
- Closed bud is a tall tube open at the top; the right leaf has no visible mount in the assembled states.

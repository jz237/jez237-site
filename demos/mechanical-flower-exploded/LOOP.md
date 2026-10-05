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
- it13 to it14 (second run, same loop): enamel gains stained-glass facets, a gold cell network and edge eyelets with matching 3D stones; petals gain scrolls, granulation and eyelet stones; collars level and snug; braid smoothed; core gains tilted great-circle bands and equator jewels; stamen cage gains a middle whorl, bead nodes and base studs.
- it15: facet fills made translucent for deeper jewel tones; inner stamen crown moved off the core so the glowing sphere shows; exploded petals narrowed to 70 percent width (body scale, so the assembled petals are unaffected); cage shortened and core enlarged and raised to sit in the cage mouth.
- it16: assembled petals widened 22 percent; closed rings leaned further in so the bud shuts into a pointed dome rather than an open tube.
- it17: four gems per petal (two on the bud petals). Reviewer mean 3.67, REJECT (layout 4, exploded parts 4, enamel 4, assembled 3, mechanical detail 4, closed bud 3). Gaps: milky assembled underside, petals crowd upper left, crown flat.
- it18: exploded petals scaled to 0.82 with rims thickened 40 percent; enamel env reflection and iridescence cut for deeper tones; assembled crown raised so jewelled stamens clear the cage. Reviewer mean 3.83, ACCEPT (layout 4, exploded parts 4, enamel 4, assembled 4 (reviewer called it borderline 3.5), mechanical detail 4, closed bud 3).

## Outcome

**success (second run).** it18 scored a reviewer mean of 3.83 with every criterion at least 3, clearing the 3.8 gate. The first run had stopped at no-progress (mean 3.17 over it10 to it12); this run closed most of the gaps it named: petals fan out with air, the glowing core shows in the cage, collars are level, enamel has mottled facets and eyelets, and the closed bud is a sealed dome. It is a close match, not an exact one.

Remaining gaps the last reviewer named, for another run:

- Petal palette skews purple, blue and pink; about a quarter of the petals should be emerald or teal, and the brushed anisotropic mottling from it13 would deepen them.
- Assembled petals still form a fairly flat funnel with a milky underside, not the photo's broad, rolled, cupped petals; widen the inner petals, add camber and a rolled rim, and cut the underside's translucency.
- The photo shows gears peeking between the petals; ours are hidden under the skirt.
- The closed bud is wrapped in gold wire; build it from six to eight overlapping opaque petals with pointed tips and cut the wire density.
- The core and gear detail insets are cropped from a single object rather than a gear cluster; the right leaf still lacks a visible mount in the assembled states.

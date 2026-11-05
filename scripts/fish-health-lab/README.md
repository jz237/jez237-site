# Fish Health Lab — independent experiment

Owner request: Jez, Discord #gpt-chat-1, `1567924888113520831`, 2026-11-05.
Requested an experimental fish-ailment guide on his personal site, entirely
separate from Hidden Reef. Intended URL:
`https://jez237.com/experiments/fish-health-lab/`.

Visual-library steering: `1567935803869495328`, 2026-11-05. Make it mostly visual,
reuse the two ich images, and prepare image spaces rather than generate a library.

Complete-example steering: `1567945894068748309`, 2026-11-05. Fill the six
freshwater ich image slots; keep the experience on-site without ChatGPT or photo
submission.

UX correction: `1567958813586362369`, 2026-11-05. The disease-first opening was
confusing: ich posters appeared before the user had started. The front door is
now a Start screen, not the library or a named-disease walkthrough.
Old `#ich` links intentionally open this same Start screen.

Realistic-picture steering: `1567971914423603203`, 2026-11-05. Replace the opening
fish with a mixed freshwater/reef-fish health illustration, and fill the main
symptom and white-mark choices with realistic fish images. This explicitly
supersedes the earlier no-images-on-the-opening-screen constraint. Preserve the
one-question flow; do not restore the ich-only poster wall.

Comparison/care correction: `1568000327632822372`, 2026-11-05. Unrelated conditions
were being presented as ich look-alikes because nonspecific behaviors added
ranking weight. Visual matching now uses only the selected appearance, with
explicit scope-filtered comparisons and reasons. Water readings and history
belong after visual results in Care & treatment. Complete the next two
freshwater collections: velvet and cottony growth/water mold.

## Product contract

- Buildless static HTML/CSS/ES modules. No credentials, account, API endpoint,
  dependency installation, paid inference, backend storage or photo upload.
- Start → water type → choose the main visible symptom → behavior → comparisons.
  Then, separately: Care & treatment → optional water readings/tank history →
  conditional care steps. Only one question screen is shown.
  Freshwater + white dots adds a texture question; it does not preselect ich.
- The welcome shows one mixed-fish opening illustration. Twelve symptom pictures
  load when the symptom question is reached; six different close-ups load when
  the freshwater white-mark question is reached. Only the opening image is
  fetched initially. Existing ich reference sheets still wait for relevant
  choices or deliberate library browsing. Other symptoms bypass that branch.
- One clear Start button; Back preserves choices. Changing water or the primary
  symptom clears the dependent texture answer. Start over clears observations.
  Numeric water readings are validated, and blank remains unknown, not zero.
- Results use only the selected visual pattern, not appetite, generic behavior or
  water-test scores. Look-alikes are curated per condition and water type, with a
  specific reason; they are not the next three weighted candidates. Unclear
  appearance does not force a disease. Fast breathing starts with environmental
  checks and relevant respiratory overlaps, not a skin-disease conclusion.
- Care is a separate post-result step. It validates optional readings, keeps blank
  distinct from zero, prioritizes environmental problems and urgent distress,
  and provides conditional treatment context—not an automatic prescription.
  Unknown water type cannot unlock freshwater-specific treatment guidance.
  Urgent distress remains visible before care. Water checks do not erase a
  concurrent skin pattern or contaminate its look-alikes.
- The Reference library is a separate, opt-in view. Returning preserves the check.
  It has 15 entries, 12 appearance filters, water-type/search filters and six
  gallery slots per entry (90 total). Ich, freshwater velvet and water mold each have six filled views (18 total);
  72 other slots remain honest placeholders. Selector pictures do not count as confirmed disease
  cases or completed condition galleries.
- All six ich sheets remain accessible in a one-picture-at-a-time gallery:
  whole-fish guide, different fish, close-up, subtle appearance, marked changes,
  and look-alikes. Appearance is not a disease stage or severity score.
- Two-entry reference comparison remains available in the library. A deliberate
  “Check this visible pattern” selection starts the same question flow, with
  only the visible sign and relevant water type preselected—not a diagnosis.
  Library selections add no ranking weight.
- Freshwater and marine causes remain distinct; unknown water stays explicit.
  Severe gasping, collapse, deaths, pineconing and marine respiratory/dust signs
  retain priority warnings. No universal treatment/dose/heat/salt advice.
- No photo picker/preview/upload, image recognition, external chatbot link, AI
  prompt, browser storage or hidden inference call. Notes can be copied or
  downloaded for the user or a fish-health professional; no data submission.
- Unlisted and `noindex`, not password protected. No homepage/nav/sitemap entry.
  Never integrate/deploy this into Hidden Reef without a separate request.

## Content / assets

15 comparison entries: environmental stress, freshwater ich, marine ich,
freshwater velvet, marine velvet, water mold, columnaris-type disease, fin damage,
ulcerative disease, dropsy-like swelling, eye changes, buoyancy, other gill/skin
parasites, larger growths and normal anatomy/markings.

Sources checked 2026-11-05: Merck Veterinary Manual parasitic diseases, bacterial
diseases, aquarium management/diagnostics (links in data.mjs). Summaries are not
clinically validated. Source institutions do not endorse this tool. Real expert-
identified case photography and professional review are future work.

The opening and both question grids use realistic AI educational illustrations,
not patient photos. Three new generations supply the opening plus two contact
sheets, cropped without resizing into 12 symptom and 6 texture pictures. Prompted
row-major layouts: symptoms 4 columns × 3 rows; textures 3 columns × 2 rows.
Original sheets remain intact outside Git. The `unclear` choices deliberately
show no obvious lesion / an uncertain view, not an invented disease. Breathing
rate and abnormal swimming require observation over time, not a still image.

`choice-images.mjs` supplies the 19 public image references and accessible alt
text. `scripts/fish-health-lab/realistic-images-20261105.json` records source hashes,
exact crop boxes, actual dimensions, derivative hashes and truthful provenance.
Source prompts, receipts, original sheets and preparation/upload records are in
`workspace/tmp/imagegen/fish-health-realistic-20261105/`; managed media is under
`/home/jez237/.openclaw/media/tool-image-generation/fish-health-realistic-20261105/`.
All 19 page assets live on R2 under `experiments/fish-health-lab/choices/` using
content-hashed names. No generated binaries in Git. Request: GPT Image 2.6
Sunburst, explicit medium quality; backend model not independently verified.

Library filter icons and unfilled comparison schematics remain original SVGs.
Ich atlas: previously generated at Jez's request, retained JPEG 1024×1536,
675,031 bytes, SHA256
`b7e2ede990307970f5e2f324533ca3294df8a11e643762da3609b0e7a9b5aaf0`.
Requested `openai/gpt-image-2.6-sunburst` / medium; backend model not independently
verified. Original receipt:
`workspace/tmp/imagegen/ich-presentations-0ef55a8d88/receipt.json`.
R2 object: `jez237-site-media/experiments/fish-health-lab/ich-comparison-b7e2ede9.jpg`.
Public asset: `https://media.jez237.com/experiments/fish-health-lab/ich-comparison-b7e2ede9.jpg`.
Never commit generated image binaries to Git. Keep source original media intact.

Recognition guide: existing verified JPEG 1024×1536, 808,142 bytes, SHA256
`9c778127f7c71d3b4f6e4c94c0f2f4a0edb08becd608b39ef20a03f404446ec1`.
R2 object: `jez237-site-media/experiments/fish-health-lab/ich-guide-9c778127.jpg`.
Public URL: `https://media.jez237.com/experiments/fish-health-lab/ich-guide-9c778127.jpg`.
Requested `openai/gpt-image-2.6-sunburst` / medium; backend not independently verified.
All images are AI educational illustrations, never confirmed clinical photos.

Four additional JPEG references generated for the complete example, all
1024×1536, requested `openai/gpt-image-2.6-sunburst` with explicit medium quality.
Backend image model and returned generation quality were not independently
reported. Technical decode, unique hashes and public asset bytes were checked;
no automatic artistic scoring or rerolls. Objects are under
`jez237-site-media/experiments/fish-health-lab/`:

- `ich-closeup-8b9f20a5.jpg` — 756,784 bytes,
  SHA256 `8b9f20a539f1ba25bd599a3db59d6cd92c41e1c35d802393c841011f47befefe`
- `ich-subtle-68567f0c.jpg` — 693,399 bytes,
  SHA256 `68567f0c2e8b5dc0778d010340345d76bde6d773694286adad8defe73ffcba78`
- `ich-marked-d250101b.jpg` — 740,225 bytes,
  SHA256 `d250101b0f35162ed92d5b93ad74b8f85941cbaf8c47a7088bab486e1670efab`
- `ich-lookalikes-b9f7de50.jpg` — 834,593 bytes,
  SHA256 `b9f7de500430a81ff8819180ccdb56a16550c8ef8afb8e74a922790f6488fe6d`

Exact prompts, provider receipts and delivery receipt are retained outside Git
at `workspace/tmp/imagegen/ich-complete-20261105/`.

## Filling the visual library later

The unified image inventory is `experiments/fish-health-lab/visuals.mjs`,
which also imports `condition-images.mjs` for the two newer collections.
Add an asset to `images[conditionId][slotId]` with public `url`, accurate `alt`,
`caption`, `provenance`, and `source`. Library cards, detail galleries, enlarged
viewers and side-by-side comparisons all read that manifest. There is no upload
or administrative editor in the public prototype.

Use permission-cleared images with honest provenance and condition confirmation
status; do not claim that an AI illustration or unconfirmed photo establishes a
pathogen. Review captions and look-alikes before adding real case examples.
Subtle/marked appearances are not clinical stages, a severity scale, or a promise
that every condition has a distinct visible presentation.

## Verification

Run `node --test scripts/fish-health-lab/logic.test.mjs` and syntax checks.
Run `browser-check.mjs` and `visual-browser-check.mjs` locally and on production.
The obsolete disease-first `ich-browser-check.mjs` is retired; its relevant
branch, image, privacy and mobile coverage is included in the current suites.

Check root and legacy `#ich` openings, one opening-image request only before
starting, complete decode of all 18 distinct choice pictures in their mapped
grids, single-question visibility, required choices, every main symptom and
texture branch, Back/changed answers/reset, marine/unknown scope, distress/water
priority, post-result care, numeric validation, notes copy/download and mobile overflow.
Regression-check white dots + loss of appetite (and all behavior combinations):
never list buoyancy, dropsy or eye disorders as ich look-alikes. Check dust →
velvet, fuzz → water mold, all twelve new crops, matching conditional care,
unknown water type withholding specific treatment and care Back preserving data.
Check opt-in library/resume, filters, six image slots, galleries and comparisons.
Inspect screenshots for user-flow/layout usability, not only selector assertions.
Image artwork remains user-reviewed rather than automatically rerolled.

Record requests and inspect all of them for transmitted observation text.
Existing parent-site analytics and Cloudflare checks are recorded separately
from application submissions; no provider requests or photo controls may exist.
Stage only intended changes and run the staged secret scanner before committing.
Review untracked/ignored deployment inputs separately.

Deploy through the existing guarded full-site publisher, never the sparse task
checkout. Preserve newest origin/main and unrelated work. Verify live static
bytes, noindex headers, all 19 new assets, all six preserved ich references and
representative interactions. Inspect layout and crop mapping without subjective
artwork scoring or automatic rerolls.

## Next experiments

1. Ask Jez to try the neutral Start flow on mobile and note where he hesitates.
2. Build a licensed, expert-labelled real case image library; keep AI illustrations
   visibly distinct from confirmed cases.
3. Keep the process self-contained and picture-first. Photo-analysis and external
   chatbot handoffs are excluded by the owner's current request.
4. Keep treatment selection out of scope until species, salinity, tank inhabitants,
   diagnostics and qualified review are handled properly.

## Velvet and cottony-growth images, 2026-11-05

`condition-images.mjs` supplies twelve JPEG crop references. Each retained source
sheet is 1536×1024 with a 3-column × 2-row layout, sliced without resizing into
512×512 views: overview, variations, closeup, subtle, marked, lookalikes. The
contact sheets depict possible appearances and mimics, not clinical stages.
Velvet comparisons distinguish fine dust, coarse white grains and natural
iridescence. Cottony-growth comparisons distinguish outward filaments, a flat
pale patch and a solid raised nodule. Water mold is an oomycete, not a blanket
label for every pale lesion or true fungus.

Crop geometry, hashes and truthful provenance are recorded in
`scripts/fish-health-lab/two-conditions-images-20261105.json`. Prompts, stock-OAuth
receipts, preparation and upload verification are outside Git in
`workspace/tmp/imagegen/fish-health-two-conditions-20261105/`. Original and crop
media is retained under
`/home/jez237/.openclaw/media/tool-image-generation/fish-health-two-conditions-20261105/`.
All twelve assets are content-hashed R2 objects beneath
`experiments/fish-health-lab/conditions/`. Requested model: GPT Image 2.6 Sunburst;
requested generation quality: medium. Backend model and returned generation
quality were not independently reported. No subjective scoring or rerolls.

Clinical content was checked against the Merck parasitic and bacterial references
on November 5, 2026. The prototype is still not clinically validated. Water-mold
and columnaris management are deliberately distinguished. No doses or universal
heat/salt/antibiotic cure are inferred from the illustrations.

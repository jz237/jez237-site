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

**Published, November 5 after owner approval at 17:07:** Jez explicitly lifted the earlier
publication hold with “oh i mean publish.” The release incorporates the plain `What do you see?` heading, two water choices,
hobbyist wording, independent treatment pop-ups, clear probable-diagnosis results
and handling for multiple/conflicting signs. Release through the guarded publisher.

- Buildless static HTML/CSS/ES modules. No credentials, account, API endpoint,
  dependency installation, paid inference, backend storage or photo upload.
- Start → freshwater or saltwater / reef → main visible symptom → behavior →
  probable diagnosis. Behavior also offers optional extra symptom pictures.
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
- Results name the leading likely problem, explain the signs that fit, and show
  additional possibilities when distinct observations cannot be explained by one
  pattern. Pale patches plus fin damage can share a plausible cause; grains plus
  cottony threads retain two possibilities. Raised scales are a separate concern,
  never an ich look-alike. Appetite/rubbing/clamped fins do not invent unrelated
  diagnoses. Distress stays urgent; positive water readings are a coexisting
  environmental concern, not a replacement for skin signs.
- Look-alikes remain curated by appearance and water type, separate from additional
  actual findings. A closer texture choice supersedes the coarse first choice
  transparently. Every explicit sign is accounted for or marked unresolved.
  Unclear appearance and unsupported marine textures do not force a disease.
  Fast breathing alone does not establish velvet or another pathogen.
- This is transparent rule-based guidance, not a clinically validated probability
  model. No percentages, definitive pathogen claims, laboratory procedures or
  analysis of free-text notes. Multiple matches can share a cause; never imply
  that their treatment links should be combined.
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
- Freshwater and marine causes and pictures remain distinct. The water question
  has exactly two required choices; internal malformed/unknown-input handling is
  retained only as a safeguard, not a visitor option. Changing environment clears
  dependent texture/extra-sign choices, comparisons and stale image containers.
  Severe gasping, collapse, deaths, pineconing and marine respiratory/dust signs
  retain priority warnings. No universal treatment/dose/heat/salt advice.
- No photo picker/preview/upload, image recognition, external chatbot link, AI
  prompt, browser storage or hidden inference call. Notes can be copied or
  downloaded for the user or a fish-health professional; no data submission.
- Unlisted and `noindex`, not password protected. No homepage/nav/sitemap entry.
  Never integrate/deploy this into Hidden Reef without a separate request.

## Content / assets

### Marine symptom pictures

`marine-choice-images.mjs` supplies twelve distinct reef-fish symptom choices.
All twelve JPEGs are uploaded and byte-verified at their content-hashed CDN URLs.
`marine-choice-images-20261105.json` in this directory records exact local paths,
source/crop hashes, dimensions, boxes and publication state. The upload receipt is
`workspace/tmp/fish-health-publish-20261105/marine-upload-verification.json`. Keep the complete
original sheet and all crops. Never commit generated binaries to Git.

The one stock-OAuth generation requested `openai/gpt-image-2.6-sunburst`, explicit
medium quality and automatic size. The returned JPEG is 1448×1086, cut without
resizing into twelve 362×362 cells. Backend image identity and generation quality
were not independently reported. No artistic scoring, rerolls or model swaps.
Requests/receipt: `workspace/tmp/imagegen/fish-health-marine-draft-20261105/`.
Managed media: `/home/jez237/.openclaw/media/tool-image-generation/fish-health-marine-draft-20261105/`.

For the unpublished local preview, run
`python3 /home/jez237/.openclaw/workspace/tmp/fish-health-hobbyist-draft-20261105/preview.py`.
It binds only `127.0.0.1:8768` and rewrites the **served** marine manifest to local
image routes. Repository URLs are unchanged; no public object is created.
Do not use that server as a production deployment. The exact twelve recorded JPEGs were uploaded and byte-verified after Jez lifted
the publication hold; the local preview mapping is not used in production.

The older ich poster that instructs microscopy remains archived but is no longer
shown by the hobbyist guide. Its overview slot now uses the realistic freshwater
white-grain portrait; all six ich views are still available.

### Independent treatment guides

`treatments.mjs` maps each disease to a verified section in Merck's pet-owner
fish guide. Ich: `#v3226751`; velvet: `#v3226757`; cottony water mold:
`#v3226818`; columnaris: `#v3226736`. Eye, gill and other symptom patterns use
appropriate care sections, not a promised single cure; normal markings get no
medicine link. Fresh/marine scope is checked before rendering each link.

Links are available directly on results and detail pages without entering water
readings. A direct click opens a detached popup; blocked pop-ups retain a real
`target=_blank` anchor fallback. On phones a separate tab is expected. No iframe,
external chatbot, new account or patient data in the URL. Merck source sections
were checked via HTTP and their actual HTML IDs, not guessed from heading text.
Saved source HTML and anchor inventories:
`workspace/tmp/fish-health-hobbyist-draft-20261105/`.

15 comparison entries: environmental stress, freshwater ich, marine ich,
freshwater velvet, marine velvet, water mold, columnaris-type disease, fin damage,
ulcerative disease, dropsy-like swelling, eye changes, buoyancy, other gill/skin
parasites, larger growths and normal anatomy/markings.

Sources checked 2026-11-05: Merck Veterinary Manual pet-owner fish diseases and
routine health care (links in data.mjs and treatments.mjs). Summaries are not
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

Run `node --test scripts/fish-health-lab/logic.test.mjs scripts/fish-health-lab/diagnosis.test.mjs scripts/fish-health-lab/treatments.test.mjs` and syntax checks.
Run `browser-check.mjs`, `visual-browser-check.mjs` and
`hobbyist-browser-check.mjs` locally. Publication is authorized; use the guarded full-site publisher.
The obsolete disease-first `ich-browser-check.mjs` is retired; its relevant
branch, image, privacy and mobile coverage is included in the current suites.

Check root and legacy `#ich` openings, one opening-image request only before
starting, complete decode of all 18 distinct choice pictures in their mapped
grids, single-question visibility, required choices, every main symptom and
texture branch, Back/changed answers/reset, marine/fresh scope, distress/water
priority, post-result care, numeric validation, notes copy/download and mobile overflow.
Regression-check white dots + loss of appetite (and all behavior combinations):
never list buoyancy, dropsy or eye disorders as ich look-alikes. Check dust →
velvet, fuzz → water mold, all twelve new crops, matching conditional care,
two required water choices, correct popup destinations and care Back preserving data.
Check opt-in library/resume, filters, six image slots, galleries and comparisons.
Diagnosis regression fixtures cover multiple appearances, conflicting textures,
coherent shared causes, raised scales with spots, unresolved signs and coexisting
environmental stress. Invariants cover all 3,072 single-picture/behavior/water
combinations and 110 two-picture/water cases. This is software logic coverage,
not clinical validation or a claim to handle every real-world illness.
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
4. Keep treatment doses and automatic medication selection out of scope. Link to
   independent care/treatment reading for the likely condition instead.

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

## Unpublished hobbyist draft verification — 2026-11-05

Before publication authorization, the retained draft passed 35
logic/unit tests and 33 browser checks (14 guided-flow, 6 library and 13
hobbyist/mixed-sign checks), 68 checks total. Browser receipts and mobile
screenshots are retained outside Git in
`workspace/tmp/fish-health-hobbyist-draft-qa/`; the consolidated verification
record is `workspace/tmp/fish-health-hobbyist-draft-20261105/verification.json`.
These checks verify application behavior, not clinical diagnostic accuracy.

The treatment popup preserves the guide, removes its opener and referrer, and
falls back to an ordinary separate-tab link when scripting is blocked. Marine
picture choices were verified through the loopback-only preview's local asset
mapping. At draft verification, the twelve marine crops had not been uploaded, and no
commit, push or deployment had been performed. Jez subsequently authorized
publication; the exact crops are now uploaded and byte-verified before release.

## Approved publication verification — 2026-11-05

Jez lifted the hold with “oh i mean publish” in #gpt-chat-1. Product commit
`03d524e904e556c4622bdeb79c084f64c25a5291` was published through the guarded
full-site release: preview `b403b157`, production `7586a8cb`.
Ten public modules/styles match source byte-for-byte. HTML differs only by the
known parent-site analytics injection and retains noindex/no-store headers.
All 49 retained/choice/reference JPEG objects match recorded hashes and decode.
The 35 unit checks and 33 browser checks passed (68 total), including the live
freshwater/marine diagnoses, conflicting signs, care navigation and treatment
popup destinations/referrer handling. Phone layouts were reviewed from the
live-page screenshots. Browser privacy checks distinguish existing parent-site
analytics/Cloudflare traffic from app submissions, while still checking every
request for observation-text leaks and external AI calls. None were detected.
Receipts: `workspace/tmp/fish-health-publish-20261105/`. This verifies application
behavior and publication, not clinical accuracy.

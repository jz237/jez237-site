# Fish Health Lab — independent experiment

Owner request: Jez, Discord #gpt-chat-1, `1567924888113520831`, 2026-11-05.
v2 (named conditions, fish type, What to do now, urgency): approved 2026-11-05 18:12 EST — see Product contract.
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

### v2 direction — owner approval, November 5 2026 18:12 EST

Jez: “real photos will not be swapped in. this is an ai guide for a hobbyist.
stop being so strict.” He approved (“proceed”) items 1–5: named conditions,
saltwater-specific conditions, an optional fish-type question, an on-page
“What to do now” card and an urgency badge. This **supersedes** the earlier
rules that swelling, eyes, fins, breathing, buoyancy and lumps must never be
named and that treatment specifics stay out. Branch
`exp/fish-health-v2-20261105` is local only until Jez asks to publish.

- Tone: a confident hobbyist best guess in plain, friendly language, with
  practical next steps. One short honest line (“a hobby guide, not a vet”) on
  results and in notes. Do not add more disclaimers or plan for real photos.
- Buildless static HTML/CSS/ES modules. No credentials, accounts, backend,
  photo upload, image analysis, chatbot or browser storage.
- Flow: Start → water (fresh / saltwater-reef) → optional fish type → main
  picture → [freshwater white dots: texture pictures] → [closer look for marine
  dots, pale patches, red sores and eyes] → behavior (+ optional extra
  pictures) → [lump surface if any lump] → results. Optional water readings and
  tank history come after results (Care & treatment). One question per screen.
- Fish type (split further 2026-11-05, see “Fish-type split” below): freshwater
  betta, goldfish, guppy, molly/platy, tetra/rasbora, barb/danio, gourami,
  angelfish/discus, African cichlid/oscar, cory, pleco; saltwater clownfish, tang,
  angelfish/butterflyfish, wrasse, goby/blenny, damsel/chromis, dottyback/basslet; plus “Not sure /
  other” (skippable, button reads “Skip →”). Small inline SVG silhouettes, no
  generated images. Back preserves it; changing water clears it. Boosts only
  re-weight conditions that already fit the chosen sign (e.g. clownfish →
  Brooklynella, tang → black spot/HLLE, goldfish → swim bladder, betta →
  velvet/fin rot, livebearer → columnaris, cichlid → hole-in-the-head) and add
  fish-specific tips (e.g. scaleless catfish: no salt).
- Results: heading **“Most likely: X”**, urgency badge (**Act today / Treat
  this week / Watch it**; any gasping, collapse or deaths escalates to Act
  today), “Why we think so”, a **What to do now** card (numbered steps, usual
  treatment type, typical recovery, “Amounts: follow the product label”, Merck
  “Read more” link), a one-line water nudge, then **Could also be** (≤4).
  Multiple distinct signs keep the “more than one problem may fit” handling and
  show “Also likely” cards; shared causes (pale patches + fin loss →
  columnaris) stay single.
- Saltwater plans that use copper, formalin, chloroquine, praziquantel or
  antibiotics show a red **Not reef-safe — treat in a separate tank** flag.
  Freshwater and marine conditions, pictures and links never mix.
- Treatment types only, never doses. Recovery times are typical ranges.
- Named conditions (data.mjs): water (ammonia/nitrite burn or low oxygen), ich,
  marine ich (Cryptocaryon), velvet, marine velvet (Amyloodinium), fungus/water
  mold, columnaris, fin rot, bacterial ulcers, hemorrhagic septicemia, dropsy
  (swelling + pinecone), bloat/constipation, popeye, cloudy eye, swim bladder
  disorder, skin/gill flukes, lymphocystis, cyst or tumor, injury/fin nipping,
  Uronema, Brooklynella, black spot (turbellarians), HLLE, hole-in-the-head,
  plus normal markings as a look-alike. Plans live in treatments.mjs.
- Closer-look answers become refined keys (`patch:slime`, `dots:black`,
  `sores:open`, `eyes:bulging`, `lumps:cauliflower`); a refined weight of 0
  rules a condition out. “Not sure” falls back to the most common cause.
- On touch screens (`hover: none` + `pointer: coarse`), tapping a symptom or
  texture picture, a fish chip or a closer-look answer auto-advances.
- Unlisted and `noindex`. No homepage/nav/sitemap entry. Never integrate into
  Hidden Reef without a separate request.

### Earlier history (superseded where it conflicts with v2)

Published 2026-11-05 (product commit `03d524e9`, see verification below) with a
cautious rules model that reserved disease names for ich, velvet, water mold,
columnaris and lymphocystis and listed “possible causes” for other signs.

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
`#v3226818`; columnaris: `#v3226736`; lymphocystis care: `#v3226746`.
The lymphocystis section was rechecked directly on November 5; it describes
cauliflower-like skin/fin growths in both environments. The guide offers
supportive care, not an antiviral cure. Eye, gill and other symptom patterns use
appropriate care sections, not a promised single cure; normal markings get no
medicine link. Fresh/marine scope is checked before rendering each link.

v2 adds owner-guide anchors verified against the saved page HTML
(`workspace/tmp/fish-health-hobbyist-draft-20261105/owner.html`): ammonia
`#v3226628`, Hexamita `#v3226647`, Brooklynella `#v3226771`, Uronema
`#v3226774`, Gyrodactylus/flukes `#v3226787`, Aeromonas ulcers/septicemia
`#v3226807`, nutrition `#Nutritional-Disorders_v3226683`. Black spot and HLLE
have no owner-guide section and link to the guide page itself. In v2 these are
labelled “Read more” inside the What-to-do card.

Links are available directly on results and detail pages without entering water
readings. A direct click opens a detached popup; blocked pop-ups retain a real
`target=_blank` anchor fallback. On phones a separate tab is expected. No iframe,
external chatbot, new account or patient data in the URL. Merck source sections
were checked via HTTP and their actual HTML IDs, not guessed from heading text.
Saved source HTML and anchor inventories:
`workspace/tmp/fish-health-hobbyist-draft-20261105/`.

16 comparison entries: environmental stress, freshwater ich, marine ich,
freshwater velvet, marine velvet, water mold, columnaris-type disease, fin damage,
ulcerative disease, dropsy-like swelling, eye changes, buoyancy, other gill/skin
parasites, lymphocystis, unidentified larger growths and normal anatomy/markings.

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

Unit tests: `node --test scripts/fish-health-lab/logic.test.mjs scripts/fish-health-lab/diagnosis.test.mjs scripts/fish-health-lab/treatments.test.mjs`.
They assert named best guesses for every sign in both waters, closer-look
mappings, fish-type re-weighting (and that boosts never invent a condition),
urgency levels and distress escalation, reef-unsafe flags on every medicated
saltwater plan, no doses, fresh/marine separation across ~25k
sign × closer × behavior × fish cases, and all 110 two-picture cases.

Browser checks (run against a **local** server—the live site injects GA):
`browser-check.mjs`, `visual-browser-check.mjs`, `hobbyist-browser-check.mjs`,
`growth-browser-check.mjs`, with `FISH_LAB_URL=http://127.0.0.1:8770/experiments/fish-health-lab/`
and `PLAYWRIGHT_MODULE=/home/jez237/.npm-global/lib/node_modules/openclaw/node_modules/playwright-core`.
`phone-screenshots.mjs` saves 390 px screenshots of start, fish type, ich
(betta), Brooklynella (clownfish), fin rot and swim bladder for layout review.
Inspect screenshots, not only selector assertions.

## Next experiments

1. Ask Jez to try the v2 flow on his phone and note where he hesitates.
2. Fill more gallery slots (marine conditions first) with AI illustrations.
3. Keep it self-contained and picture-first; no photo analysis or chatbot.

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

## Betta pilot picture set, 2026-11-05 (published)

Jez (#hidden-reef-2): a visual guide a novice can follow; picking a fish type
should show that fish in every picture, with generic fallbacks where a fish has
no set yet. Jez: one 12-cell sheet per set, not one sheet per picture.

- Four stock-OAuth generations, requested `openai/gpt-image-2.6-sunburst`,
  medium quality, size auto, 4:3. Each returned 1448×1086 and was cut without
  resizing into twelve 362×362 cells (4 columns × 3 rows): betta signs, betta
  extras, treatment steps, fish types — 48 crops.
- Crops are R2-only (never Git binaries); the private-preview copies stay
  **untracked** under `experiments/fish-health-lab/local-images/` (repo `info/exclude`).
  Receipt: `betta-pilot-images-20261105.json` (prompts, sheet hashes, crop boxes,
  crop hashes, planned R2 keys). Prompts/provider receipts and the prepare script:
  `workspace/tmp/imagegen/fish-health-betta-pilot-20261105/`; originals under
  `/home/jez237/.openclaw/media/tool-image-generation/fish-health-betta-pilot-20261105/`.
- `fish-images-data.mjs` (generated) holds each crop's content-hashed R2 key
  (`experiments/fish-health-lab/{betta,steps,fish-types}/<id>-<sha12>.jpg`).
  **Published 2026-11-05:** all 48 uploaded to `jez237-site-media/<key>`
  (`image/jpeg`, `public, max-age=31536000, immutable`) and byte-verified at
  `https://media.jez237.com/<key>`; `IMAGE_SOURCE = 'media'`. Upload receipt:
  `workspace/tmp/fish-health-betta-publish-20261105/upload-verification.json`.
  `IMAGE_SOURCE = 'local'` maps the same names onto the untracked preview copies.
- `fish-images.mjs`: `imagesFor(fishType, signOrCondition, water)` returns the
  fish's own pictures or the existing generic one; `stepImageFor(step)` picks a
  step picture by keyword (first sentence first; "Act now/today/fast" gets a red
  marker); fish-type chips use the 12 healthy-fish pictures.
- Betta: all 12 symptom pictures and all 19 freshwater results have betta
  pictures (hero, could-also thumbnails, detail gallery; generic gallery folds
  under “More pictures (other fish)”).
- Checks: `fish-images.test.mjs` (mapping complete, fallback, keys match the
  receipt, media mode never references `local-images/`; `FHL_VERIFY_MEDIA=1` also
  fetches and hashes every public URL; local copies are hashed when present) and
  `betta-browser-check.mjs` (local preview or live via `FISH_LAB_URL`).
  `betta-pilot-screenshots.mjs` saves 390 px review shots.

## Freshwater picture sets, 2026-11-05 (published)

Jez, 2026-11-05 19:55 EST: "ok proceed with the rest of the freshwater section".
Same pattern as the betta pilot: goldfish, community (tetra/rasbora), livebearer,
cichlid and catfish each get sheet A (the 12 symptom choices) and sheet B (extra
result pictures), one 4×3 sheet each, 120 crops of 362×362, not resized.

- Twelve stock-OAuth generations, requested `openai/gpt-image-2.6-sunburst`, medium,
  size auto, 4:3; each reported `openai/gpt-image-2.6-sunburst` and returned 1448×1086
  (backend not independently verified; stderr shows the codex-responses transport with
  responsesModel gpt-6-astra). Ten group sheets and two repair sheets: in every sheet B
  the "injury" tail came out intact, and on the molly and ram the velvet dust was too
  faint. `fresh-fixes` fixed the dust; `fresh-injury` redrew the injury as a notch
  missing from the tail. Seven cells were swapped in from those two sheets.
- Per-fish swaps (`freshSet()` in `fish-images.mjs`): goldfish swim bladder leads with
  upside down, plus head-down and stuck on the bottom; tetras get a second ich picture
  (a school with dots); livebearers' patch is the columnaris saddleback, and bloat
  also shows a pregnant female; cichlids have the oscar hole-in-the-head; catfish
  dropsy is a bloated belly (no scales to pinecone), fin rot adds worn barbels, and
  "on its side" replaces "sinking". Goldfish, tetras, livebearers and catfish have no
  hole-in-the-head picture by design, so that result falls back to the generic one.
- Data: `fish-images-fresh-data.mjs` (generated; its own `IMAGE_SOURCE = 'local'`) and
  receipt `freshwater-images-20261105.json` (prompts, sheet hashes, crop boxes,
  repairs, weak cells, crop hashes, planned R2 keys
  `experiments/fish-health-lab/<group>/<id>-<sha12>.jpg`, `uploaded: false`). Local
  copies: untracked `experiments/fish-health-lab/local-images/<group>/`. Generation and
  prepare scripts: `workspace/tmp/imagegen/fish-health-fresh-20261105/`; originals:
  `/home/jez237/.openclaw/media/tool-image-generation/fish-health-fresh-20261105/`.
- Published 2026-11-05 (Jez's request, Claw approved): all 120 crops uploaded and
  byte-verified (`workspace/tmp/fish-health-fresh-publish-20261105/upload-verification.json`),
  receipt `uploaded: true`, `IMAGE_SOURCE = 'media'`.
- **Publish procedure (no code change):** upload each receipt asset `path` to
  `jez237-site-media/<r2Key>` (`image/jpeg`, `public, max-age=31536000, immutable`),
  byte-verify `plannedUrl`, set every asset to `uploaded: true`, then set `IMAGE_SOURCE`
  in `fish-images-fresh-data.mjs` to `'media'`. `fish-images.test.mjs` checks that the
  uploaded flags match `IMAGE_SOURCE`, and `FHL_VERIFY_MEDIA=1` then hashes the
  public URLs. The betta, step and fish-type pictures keep their own (media) source.
- Checks: `fish-images.test.mjs` (every group covers all 12 signs and every freshwater
  result or a deliberate generic fallback; every crop is used; receipt keys and hashes;
  per-file sources) and `freshwater-browser-check.mjs` (per fish: a 12/12 symptom grid,
  then one result showing the hero, could-also cards, compare, the gallery and step
  pictures; plus the catfish hole-in-the-head fallback; `FISH_LAB_SHOTS=<jpg>` saves a
  390 px strip).

## "Could also be" v3 — owner approval, November 5 2026 19:27 EST

Jez approved seven changes (“make sure you don't overcomplicate and cause confusion”):
tap a look-alike card = “This looks more like mine” (it becomes Most likely with its
own plan; the old guess moves first into Could also be; tapping it swaps back;
changing answers drops the pick); a small Compare link (two pictures, fish-specific
when available, one check line); every look-alike reason is a short check (`LOOKALIKES`,
fallback `LOOK_FOR` in logic.mjs); a red “Rule this out first — more dangerous” line
only when strictly more urgent; “Same first steps” / “Different treatment — check
before dosing” from the explicit `TREATMENT_FAMILY` map; 'normal' is never a card
(one plain line under the section instead; swollen-belly results get a full-belly /
pregnant-livebearer wording); at most 3 cards, ranking otherwise unchanged.
Tests: diagnosis.test.mjs (cap, normal, danger, treatment families, swap for every
listed look-alike) and browser-check.mjs (compare + swap through the real UI).

## Fish-type split, 2026-11-05 (published)

Jez, 2026-11-05 20:33 EST: “yes i do. and split up the salt water that way as well
although dont do those pics yet”. The “What kind of fish?” step now has 11 freshwater
types (3 per row on a phone, 4 rows with Not sure) and 7 saltwater types.

- Splits: livebearer → guppy + molly/platy; cichlid → angelfish/discus + African
  cichlid/oscar; catfish → cory + pleco; new gourami and barb/danio. Saltwater:
  wrasse/goby/blenny → wrasse + goby/blenny; new dottyback/basslet. Old ids keep
  working (`LEGACY_FISH_IDS` in data.mjs: livebearer → guppy, cichlid → angelfish,
  catfish → cory) for `fishTypeFor`, `fishSetFor` and `imagesFor`. Tips and boosts are
  keyed by the new ids (Malawi bloat for Africans, dwarf gourami disease, cory red
  belly/barbels, pleco diet, molly shimmies, guppy Camallanus note, barb fin-nipping).
- Pictures: every published livebearer/cichlid/catfish cell that shows the right fish
  is re-used through `freshSet(..., { reuse })` in fish-images.mjs (receipt
  `reusedPublished`); the four German blue ram cells fit neither cichlid group and stay
  published but unused. New cells fill the gaps: gourami and barb/danio full A+B sets,
  pleco mostly new, angelfish/discus, African/oscar, guppy, cory and molly gap cells,
  plus Malawi bloat, cory red belly, pleco sunken belly, molly pregnant/shimmies,
  gourami disease and a barb/danio school with ich. Three injury cells were cropped
  from the unused cells of the already-generated `fresh-injury` repair sheet.
  Saltwater has selector tiles only (goby/blenny and dottyback/basslet are new); its
  results use the generic marine pictures.
- 134 new 362×362 crops (126 set cells + 8 fish-type tiles), not resized, in
  `fish-images-split-data.mjs` (`IMAGE_SOURCE = 'local'`, untracked
  `local-images/<group>/`), receipt `split-images-20261105.json` (prompts, sheet
  hashes, choices/repairs, review, `uploaded: false`). Sheets: 11 group/tile sheets
  plus two repair sheets, requested `openai/gpt-image-2.6-sunburst` medium, all
  reported that model (backend not independently verified). Scripts and originals:
  `workspace/tmp/imagegen/fish-health-split-20261105/`,
  `/home/jez237/.openclaw/media/tool-image-generation/fish-health-split-20261105/`.
- Published 2026-11-05 (Jez's request, Claw approved): all 134 new crops uploaded and
  byte-verified (`workspace/tmp/fish-health-split-publish-20261105/upload-verification.json`),
  receipt `uploaded: true`, `IMAGE_SOURCE = 'media'`. Saltwater fish-type pictures are
  still not generated (Jez: "dont do those pics yet").
- Publish procedure (no code change): upload every receipt asset to
  `jez237-site-media/<r2Key>`, byte-verify, mark the assets `uploaded: true`, then set
  `IMAGE_SOURCE = 'media'` in fish-images-split-data.mjs.
- Checks: fish-images.test.mjs (every split group complete, new-or-re-used crops,
  old ids, receipt hashes, every fish type has a tile) and `split-browser-check.mjs`
  (both fish-type grids at 390 px, one result per new freshwater group through hero,
  could-also, compare and gallery, pleco HITH fallback, saltwater generic fallback;
  `FISH_LAB_SHOTS=<dir>` saves fish-type-grid.png and results.jpg).

## Saltwater fish pictures, 2026-11-05 (published)

Jez, 2026-11-05 21:48 EST: “...proceed and do all of the fish section pictures. Hold
off of the reef invertebrates etc pictures for now”. Each of the seven saltwater fish
types now has its own picture set; reef invertebrate pictures were not made.

- Sets: clownfish, tang, angel/butterfly, wrasse, goby/blenny, damsel/chromis,
  dottyback/basslet (`FISH_SETS` in fish-images.mjs, `marineSet()` +
  `MARINE_CONDITIONS`). Each has the 12 symptom choices (sheet A), 12 marine results
  (sheet B: ich close-up, velvet, Brooklynella, Uronema, flukes, black spot, HLLE,
  lymphocystis, popeye, septicemia, injury, normal) and one smooth growth — every
  saltwater result (all 20 marine/shared conditions) shows the chosen kind of fish.
  Marine results lead with their own picture and add the matching symptom picture
  (ich + dots, velvet + dust, Brooklynella + pale patch, lymphocystis + lumps);
  dropsy and bloat share the swollen picture, cloudy eye uses the (cloudy) eye picture.
  Freshwater lookups for these fish, and saltwater with no fish chosen, stay generic.
- Key pictures on the fish they are known for: Brooklynella on an ocellaris clownfish,
  black spot on a yellow tang, HLLE on a hippo tang and an emperor angel,
  lymphocystis on a copperband butterflyfish, velvet/Uronema on damsels/chromis;
  gobies rest on the sand in their normal picture, wrasse/goby injuries are jump
  scrapes.
- 175 362×362 crops (7 × 25), not resized, in `fish-images-marine-data.mjs`
  (`IMAGE_SOURCE = 'media'`; preview copies stay untracked in `local-images/<group>/`),
  receipt `marine-fish-images-20261105.json` (prompts, sheet hashes, choices, review,
  `uploaded: true`). 14 group sheets + 1 mixed repair sheet (seven growths + four
  retakes), requested `openai/gpt-image-2.6-sunburst` medium, all reported that model
  (backend not independently verified). Scripts and originals:
  `workspace/tmp/imagegen/fish-health-marine-20261105/`,
  `/home/jez237/.openclaw/media/tool-image-generation/fish-health-marine-20261105/`.
- Published 2026-11-05 together with the reef section (Jez's request, Claw approved):
  all 175 crops uploaded and byte-verified
  (`workspace/tmp/fish-health-marine-reef-publish-20261105/upload-verification.json`),
  receipt `uploaded: true`, `IMAGE_SOURCE = 'media'`.
- Publish procedure (no code change): upload every receipt asset to
  `jez237-site-media/<r2Key>`, byte-verify, mark the assets `uploaded: true`, then set
  `IMAGE_SOURCE = 'media'` in fish-images-marine-data.mjs.
- Checks: fish-images.test.mjs (every saltwater group complete and every crop used,
  result-first mapping, generic fallback, receipt hashes/keys) and
  `marine-browser-check.mjs` (per group a 12/12 symptom grid and one result through
  hero, could-also, compare and gallery; `FISH_LAB_SHOTS=<dir>` saves results.jpg).
  `split-browser-check.mjs` now expects the saltwater groups' own pictures.

## Reef section (corals, anemones, inverts), 2026-11-05 (published, no pictures yet)

Jez, 2026-11-05 21:48 EST: “Add the pages and structure for the reef section ... Hold off
of the reef invertebrates etc pictures for now.” Branch `exp/fish-health-reef-20261105`;
published 2026-11-05 together with the saltwater fish pictures (Claw approved). Reef
pictures are still not made.

- Front door now asks **What needs help?**: Fish (the existing `data-action="start"`, flow
  unchanged), Coral or anemone, Shrimp/crab/snail. Old `#ich` / `#library` links unchanged.
- Reef flow (3 steps, `reef-kind` → `reef-signs` → `reef-changes` → `reef-results`): kind
  (optional), main sign (tiles filtered by kind), optional “Anything changed recently?” chips,
  then the fish result layout (Most likely, urgency, Why, What to do now, ≤3 Could also be with
  tap-to-swap and Compare, “normal” as a plain line). Invert results always show the copper
  warning. Care plans start with the tests; dips are tagged “Separate dip — never in the
  display”; no plan doses copper or fish medicine. Library: “Reef & inverts” filter.
- Files: `reef-data.mjs` (kinds, signs, chips, 17 coral + 9 invert conditions, look-alikes),
  `reef-logic.mjs`, `reef-care.mjs`, `reef-images.mjs` (picture manifest; coral part still empty — fill it like
  the fish sets; every spot shows “Picture coming soon” until then), `reef-app.mjs`, `reef.css`.
  app.mjs/index.html only gain small hooks.
- Checks: `reef.test.mjs` and `reef-browser-check.mjs` (`FISH_LAB_SHOTS=<dir>` saves 390 px shots).

## Shrimp, crab and snail pictures, 2026-11-06 (published)

Jez, 2026-11-06 01:08 EST: “Do shrimp crab or snail now, try to have the pictures appear as
they would typically look in a typical aquarium as opposed to 1 perfect mark on a healthy
animal.” Corals and anemones stay “Picture coming soon”.

- Style: ordinary phone snapshots through the glass of a home reef tank (animal off-centre,
  partly behind rock, detritus on the sand, film algae, blue-white light), showing the whole
  situation: a shrimp lying on the sand half out of its old skin, upturned snails and dead
  shrimp after copper, snails crowding the waterline in hazy water, an empty molt next to the
  healthy shrimp, hermits pulling each other out of shells.
- 43 crops of 362×362, cut from four 4×3 sheets without resizing: invert signs, invert
  results, kind tiles + kind-specific sign tiles, and one repair/extra sheet (four retakes
  plus snail/crab/starfish/urchin cells). Stock OAuth, requested
  `openai/gpt-image-2.6-sunburst` medium, size auto, 4:3; every sheet reported that model
  (backend not independently verified).
- Mapping: `INVERT_SET` in `reef-images.mjs` — the 4 kind tiles; every sign tile, with
  kind-specific tiles (e.g. `crab:molt-stuck`, `shrimp:legs`, `other:not-moving`); every invert
  result `[hero, ...more]` (the plain list fills the library/detail gallery, up to 3), with
  kind-specific heroes (e.g. `crab:failed-molt`, `snail:starvation`, `other:copper`). Sign tiles,
  result hero, could-also cards, compare and library all show them; a filled gallery slot uses
  the picture's caption. The front-door “What needs help?” tiles keep their line icons.
- Data: `reef-images-inverts-data.mjs` (generated, `IMAGE_SOURCE = 'media'`), receipt
  `invert-images-20261106.json` (prompts, sheet hashes, crop boxes, choices, review/weak cells,
  R2 keys `experiments/fish-health-lab/inverts/<id>-<sha12>.jpg`, `uploaded: true`). Local
  preview copies: untracked `experiments/fish-health-lab/local-images/inverts/`. Scripts:
  `workspace/tmp/imagegen/fish-health-inverts-20261106/`; originals:
  `/home/jez237/.openclaw/media/tool-image-generation/fish-health-inverts-20261106/`.
- Published 2026-11-06 (Jez's request, Claw approved): all 43 crops uploaded and
  byte-verified (`workspace/tmp/fish-health-inverts-publish-20261106/upload-verification.json`),
  receipt `uploaded: true`, `IMAGE_SOURCE = 'media'`.
- Publish procedure (no code change): upload every receipt asset to
  `jez237-site-media/<r2Key>` (`image/jpeg`, `public, max-age=31536000, immutable`), byte-verify
  `plannedUrl`, mark the assets `uploaded: true`, then set `IMAGE_SOURCE = 'media'` in
  reef-images-inverts-data.mjs (reef.test.mjs then expects media URLs once every asset is uploaded).
- Checks: `reef.test.mjs` (every kind/sign/result a visitor can reach has a picture, kind keys are
  reachable, a result and its could-also cards never share a picture, every crop used, receipt
  keys/hashes, corals still placeholders, copper warning on every invert result) and
  `reef-browser-check.mjs` (invert kind and sign grids, failed molt → compare → normal molt,
  isopod/copper/crab/snail results, library cards and galleries).

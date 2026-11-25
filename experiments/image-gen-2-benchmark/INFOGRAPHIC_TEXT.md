# Writing the page text for a factual infographic

Every factual infographic has a text page at `/experiments/image-gen-2-benchmark/infographics/<id>/`: the
picture beside a short, readable entry about its subject. The page text is written when the infographic is
made, from the same claim sheet (`--factual-evidence-file`) that the picture was made from, and handed to
`append-entry.py` in the same call:

    python3 append-entry.py ... --factual-evidence-file evidence.json --factual-text-file text.json

`append-entry.py` checks the text before it saves or uploads anything. If it lists problems, fix the text
file and run the same command again.

The scheduled image pipeline (`image_archive_pipeline.py`) does not call `append-entry.py` by hand. There,
save the text file next to the claim sheet and name it in `spec.json` as `factual.text_file`, beside
`factual.evidence_file`. The pipeline checks it before the picture is generated, passes it on when it
publishes, and commits it with the new entry. Fix any problem it reports and run the same step again.

To add or replace the text of an infographic that is already in the archive:

    python3 build-infographic-articles.py --add-text <id> text.json

That command changes files that then have to be committed and pushed. Do not run it in the scheduled
pipeline's checkout between runs: the next run stops when it finds uncommitted changes there.

Both save the text in `infographic-article-text.json`; do not edit that file or the monthly
`infographic-articles-*.json` packs by hand. Without a text file the infographic still gets a page, but it
shows the research notes only, and the scripts print an `ACTION NEEDED` note until the text is written.

## The rule that matters most

Every fact in the text comes from that infographic's own claim sheet (or its topic, description or source
note). Nothing comes from your own knowledge: no extra numbers, names, dates, places, mechanisms, causes,
comparisons or interesting asides, however sure you are of them. If the claims do not say it, the page does
not say it.

- Keep every hedge. If a claim says "reported", "may", "likely", "in the studied conditions" or "not fully
  resolved", the sentence says so too. Never strengthen a statement or stretch it from one species, place or
  study to all of them.
- When unsure whether a sentence goes beyond the claims, cut it. A short accurate page is right. A longer
  page with one invented fact is wrong.
- Cover all the substantive claims, including the caveats.

## Reading the claims

- Many claims are notes to the illustrator: "do not show ...", "label as ...", "the graphic does not claim
  ...". Turn these into plain statements of what is and is not known, or drop the instruction and keep the
  fact. "Reported maximum 10 cm; other guides give smaller maxima, so label as up to 10 cm, not typical adult
  size" becomes "The largest reported length is 10 cm. Other guides give smaller maximums, so that figure is
  an upper limit, not a typical adult size." Do not turn "do not show X" into the claim "X never happens".
- Say "the infographic shows ..." only for things the claims or the description say it shows.
- A technical word may be put in plain words when that is only its dictionary meaning ("caudal fin" to "tail
  fin", "endemic to" to "found only in"). Do not add an explanation that brings in science the claims do not
  contain.
- Attribute where the claims attribute ("the zoo reports ...").
- Health and phobia entries: describe, do not advise. No "you should". Keep every caveat about variation,
  uncertainty and when care is needed. Never add symptoms, treatments, causes or how common something is.
- Aquarium or pet care guidance: keep it marked as guidance from the kind of source it came from, with its
  caveats.

## The text file

One JSON object (UTF-8):

```json
{
  "dek": "One or two sentences, 12 to 55 words.",
  "glance": [["Label", "Value"], ["Label", "Value"], ["Label", "Value"]],
  "sections": [
    {"heading": "Specific heading", "body": ["Paragraph.", "Paragraph."], "sources": ["am", "fb"]}
  ]
}
```

- `dek`: what the subject is and the main point, in plain words. About the subject, not about the picture
  ("The green chromis is ...", not "This infographic shows ...").
- `glance`: 3 to 6 rows. Label up to 4 words, value up to 18 words. The facts a reader wants first (name,
  where, size, what it does), only where the claims give them.
- `sections`: 2 to 5. `heading`: specific, sentence case, 1 to 8 words ("Where it lives", "How the trap
  closes"), not "Overview", "Introduction", "Key facts" or "Summary". `body`: 1 to 3 paragraphs of 18 to 130
  words each. All sections together: 80 to 520 words; use what the claims support, usually 150 to 350.
  `sources`: the ids, from the claim sheet, of the sources behind the claims that section uses.

## Voice

Plain American English. Short declarative sentences, present tense, concrete, calm and factual.

- No hype (fascinating, amazing, remarkable, incredible, stunning), no rhetorical questions, no first person,
  no "you" except inside care guidance taken from the claims.
- No em dashes: use commas, periods or parentheses. Write ranges as "1 to 20 m".
- No markdown, HTML or web addresses. Do not mention "claims", "the prompt" or "verified".
- American spelling: color, behavior, gray, meters, molt, fiber, recognize.
- Scientific names and units exactly as the claims give them. Do not convert units or add conversions.
- Every number written in digits must appear in the claim sheet, topic, description or source note; the
  check rejects any other. Do not dodge that by spelling out a number the claims do not contain.

## A finished example

Claims for "Green Chromis" (sources fb, doris, oca, worms, oata):

1. Accepted marine species Chromis viridis (Cuvier, 1830), family Pomacentridae; synonyms ... [worms, doris]
2. Pale blue-green iridescent compressed body, visible scales, small terminal protractile mouth, translucent fins and deeply forked tail; lacks the distinct black pectoral-base patch of C. atripectoralis. [doris, oca]
3. Reported maximum total length 10 cm (about 4 inches); other guides give smaller maxima, so label as up to 10 cm, not typical adult size. [fb, oca]
4. Tropical Indo-Pacific including the Red Sea; sheltered reef flats and lagoons; reported depth 1–20 m. [fb, oca, doris]
5. Diurnal plankton feeder, taking phytoplankton and zooplankton including copepods with a protrusible mouth; do not show a coral bite. [doris, fb]
6. Large aggregations above branching Acropora; juveniles remain closely tied to coral heads; fish retreat into the coral for shelter. [fb, oca, doris]
7. Male prepares nest, guards substrate-attached eggs and ventilates them with the caudal fin. [fb, doris, oca]
8. Aquarium guidance for chromis: open swimming space plus rockwork cover; generally peaceful with peaceful species but may squabble; check compatibility rather than promise a harmonious school. [oata]
9. Aquarium diet guidance for chromis: quality flake or pellet supplemented with appropriate frozen foods; avoid overfeeding. [oata]
10. Reef aquarium caveat: coral requirements may alter group water recommendations; ammonia and nitrite should be zero; assess all tank mates and provide a mature filtered system rather than infer universal reef safety from wild schooling. [oata]

Text written from them:

```json
{
 "dek": "The green chromis is a small, pale blue-green reef fish that feeds on plankton above branching coral and retreats into the branches for shelter.",
 "glance": [["Scientific name", "Chromis viridis (Cuvier, 1830)"], ["Family", "Pomacentridae"], ["Largest reported length", "10 cm (about 4 inches)"], ["Range", "Tropical Indo-Pacific, including the Red Sea"], ["Habitat", "Sheltered reef flats and lagoons, 1 to 20 m deep"], ["Diet", "Plankton, taken by day"]],
 "sections": [
  {"heading": "How to recognize it", "body": ["The green chromis has a pale blue-green, iridescent body that is flattened from side to side, with visible scales, translucent fins and a deeply forked tail. Its small mouth sits at the tip of the snout and can extend forward. A similar fish, C. atripectoralis, has a distinct black patch at the base of its pectoral fin. The green chromis does not.", "The largest reported total length is 10 cm, about 4 inches. Other guides give smaller maximums, so that figure is an upper limit, not a typical adult size."], "sources": ["doris", "oca", "fb"]},
  {"heading": "Where it lives", "body": ["This is a fish of the tropical Indo-Pacific, including the Red Sea. It keeps to sheltered reef flats and lagoons, at reported depths of 1 to 20 m. Large groups gather above branching Acropora coral and retreat into the branches for shelter. Juveniles stay closely tied to coral heads."], "sources": ["fb", "oca", "doris"]},
  {"heading": "Feeding and nesting", "body": ["The green chromis feeds by day on plankton. It takes both phytoplankton and zooplankton, including copepods, by pushing its mouth forward.", "The male prepares a nest and guards the eggs, which are attached to the bottom. He fans them with his tail fin to keep water moving over them."], "sources": ["doris", "fb", "oca"]},
  {"heading": "In an aquarium", "body": ["The aquarium notes on the infographic come from a trade care sheet for chromis and damselfish, not from studies of wild fish. It advises open swimming space with rockwork for cover. Chromis are generally peaceful with peaceful species but may squabble, so check compatibility instead of expecting a harmonious school.", "Feed a quality flake or pellet with suitable frozen foods, and avoid overfeeding. Ammonia and nitrite should be zero, in a mature, filtered system. Corals may change the water conditions a tank needs, and schooling in the wild does not make a fish safe for every reef tank."], "sources": ["oata"]}
 ]
}
```

Notice what was left out: "it never bites coral" (the claim only told the illustrator not to draw it), the
synonyms (not useful to a reader), and anything about chromis that the claims do not say.

## Before handing it in

The check catches the shape, the lengths, stray figures and British spellings. It cannot catch an invented
fact. Reread the text against the claim sheet, sentence by sentence, and delete anything the claims do not
support.

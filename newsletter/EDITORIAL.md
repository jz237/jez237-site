# Aquarium News editorial rhythm

This is a design preview, not The Hidden Reef's official newsletter.

## Approved direction

- Research daily; publish no more than one worthwhile article per day.
- Aim for three to five strong articles per week, not a mandatory quota.
- Build the initial expanded preview with six additional complete articles.
- Lead with useful aquarium care; balance freshwater and reef topics across editions.
- Mix practical guides, species features and genuinely relevant research/conservation news.
- On a quiet day, prepare an evergreen guide or publish nothing. Never relabel an older event as new.
- Keep a short queue of researched candidates instead of filling the homepage with unreviewed drafts.

## Publication gate

Each article must have verified sources, an answer-first headline, complete original prose, appropriate media/credits and a meaningful distinction from existing coverage. Check source-derivation budgets across the whole edition, including homepage material. Preserve actual research dates and clearly mark earlier research. Do not claim store inventory, staff advice or endorsement. Store contributions require permission.

Use simple visible categories: Practical guide, Research, Conservation news, Species profile. Keep source dates and qualification notes in endnotes. A photograph must relate to the topic and be labeled illustrative; prefer a clearly labeled original diagram when the steps matter more than scenery.

## Implementation status

Jez turned on the automatic daily story on November 1, 2026 (19:43 EST): one run a day at 10:00 America/New_York, at most one story, or nothing on a quiet day. The exact run procedure, stop conditions and failure handling are in `DAILY_STORY.md`; the gates are scripted in `../scripts/aquarium_daily_story_check.py`. Releases use the full-site guarded deploy contract in AGENTS.md, retain all existing site assets and are verified live. The Hidden Reef Lab copy is not part of the daily job.

Each story carries topic tags (Plants, Fish, Shrimp & snails, Ponds, Coral, Equipment, Water care; one or more), a Copy link control and, rarely, one quiet "See it in 3D" line to a directly relevant Hidden Reef showroom page. There are few 3D exhibits; most stories have none.

## Source files and verification

- `stories.json`: complete original articles and references.
- `checklist.json`: complete no-click homepage checklist and its sources.
- `photo-credits.json`: licensed photography; do not discard attribution.
- `illustrations.json`: generated original-diagram manifest, separate from photography.
- `../scripts/build_aquarium_diagrams.py`: regenerate original SVG illustrations.
- `../scripts/build_aquarium_journal.py`: regenerate the landing page, local readers, static articles and credits.
- Run the editorial, practical-content, practical-browser, reader and journal test suites before publication; run browser suites again against the live domain afterward.

## What the news is for (Jez, November 1, 2026, 19:52)

It's supposed to be interesting news an aquarium hobbyist would like. These rules apply to every story, including the daily 10:00 run.

- **News first.** Most stories are real, recent, well-sourced news hobbyists care about: newly described species, conservation results, research findings, and aquarium-equipment safety recalls (CPSC and similar agencies). Mix in practical guides and species profiles. "Recent" means within roughly the last 60 days, from the primary source (paper, agency, university, aquarium). Never present an old event as new; older research is labelled Earlier research.
- **Varied shapes.** Rotate formats (`format` in `stories.json`) and never repeat the previous story's format:
  - `brief`: quick news brief, 120–200 words, no headings or box.
  - `steps`: numbered step-by-step (an ordered list, or numbered sections).
  - `profile`: species profile with an "At a glance" facts box.
  - `feature`: an occasional deeper feature, 700–900 words.
  - `photo`: single-photo story; the photograph runs large above plain prose.
  - `qa`: short Q&A; section headings are the questions.
  - `guide`, `checklist`, `report`, `explainer`: sectioned guide, list-first, straight prose, background explainer.
  No sidebar box (`aside`) by default; at most about one story in four has one.
- **Species profiles.** A small facts box modelled on the store's "At a glance" rows, in this order: Adult size (inches), Temperature (°F), Minimum tank (US gallons), Difficulty, Diet, Temperament. Every fact cites a reference. Use sourced facts only; if a fact has no source, don't publish the profile. Where sources disagree (for example on minimum tank size), say so in the text.
- **Freshwater balance.** Cover fish, shrimp, snails and ponds as well as plants. Plants should not dominate: keep plant stories under about 40% of freshwater coverage. Tags include Shrimp & snails and Ponds.
- **Units.** US gallons, °F and inches (feet for depth). Convert sourced metric values accurately and keep the source's precision (10 L → 2.6 gallons; 24–30°C → 75–86°F; 6.5 cm → 2.6 in). Metric may follow in parentheses or in the facts-box detail line, but never on its own.
- **Restructuring older stories.** Shape changes keep Jez's original body wording: remove a box, turn paragraphs into numbered steps, merge or split sections, reorder blocks, convert units. Only headings are rewritten (humanizer applies to headings only).

The tests enforce the formats, word ranges per format, the facts box, units, the sidebar limit, neighbouring formats and the freshwater balance.

## Humanizer scope (Jez, November 1, 2026)

Apply the humanizer skill only to headings: titles, deks and section headings. Do not run it on article body text. Body copy is written and edited by hand.

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

Use simple visible categories: Practical guide, Research, Conservation news. Keep source dates and qualification notes in endnotes. A photograph must relate to the topic and be labeled illustrative; prefer a clearly labeled original diagram when the steps matter more than scenery.

## Implementation status

Jez turned on the automatic daily story on November 1, 2026 (19:43 EST): one run a day at 10:00 America/New_York, at most one story, or nothing on a quiet day. The exact run procedure, stop conditions and failure handling are in `DAILY_STORY.md`; the gates are scripted in `../scripts/aquarium_daily_story_check.py`. Releases use the full-site guarded deploy contract in AGENTS.md, retain all existing site assets and are verified live. The Hidden Reef Lab copy is not part of the daily job.

Each story carries topic tags (Plants, Fish, Coral, Equipment, Water care; one or more), a Copy link control and, rarely, one quiet "See it in 3D" line to a directly relevant Hidden Reef showroom page. There are few 3D exhibits; most stories have none.

## Source files and verification

- `stories.json`: complete original articles and references.
- `checklist.json`: complete no-click homepage checklist and its sources.
- `photo-credits.json`: licensed photography; do not discard attribution.
- `illustrations.json`: generated original-diagram manifest, separate from photography.
- `../scripts/build_aquarium_diagrams.py`: regenerate original SVG illustrations.
- `../scripts/build_aquarium_journal.py`: regenerate the landing page, local readers, static articles and credits.
- Run the editorial, practical-content, practical-browser, reader and journal test suites before publication; run browser suites again against the live domain afterward.

## Humanizer scope (Jez, November 1, 2026)

Apply the humanizer skill only to headings: titles, deks and section headings. Do not run it on article body text. Body copy is written and edited by hand.

# Hidden Reef Learn Center Plan

## Direction

Turn the Learn Center into a care and problem-solving hub, not just a set of articles. Customers usually arrive with either "what should I buy?" or "what is wrong with my tank?" The learning section should answer both and then point naturally toward relevant store categories.

## Main Paths

- Start a Tank
  - Freshwater starter guide
  - Saltwater starter guide
  - Pond basics
  - First tank shopping checklist
  - Cycling a tank and the nitrogen cycle
  - Water testing basics
- Fix a Problem
  - Cloudy water
  - Green water
  - Algae blooms
  - Hair algae
  - Cyanobacteria
  - Fish breathing at the surface
  - Ammonia or nitrite spike
  - pH swings
  - Sick fish and parasites
  - Ich
  - Fin rot
  - Coral not opening
  - Snails or shrimp dying
  - Bad smell
  - Tank crash emergency steps
- Choose Equipment
  - Filter selection by tank size and livestock
  - Heater sizing
  - Lighting basics
  - Pumps and flow
  - UV sterilizers
  - Protein skimmers
  - Media reactors
  - Fleece rollers
- Care Guides
  - Weekly freshwater routine
  - Weekly reef routine
  - Filter cleaning
  - Gravel vacuuming
  - Algae scraping
  - Dosing schedule basics
  - Feeding without overfeeding
  - Compatibility and quarantine

## Filtration Category

Filtration should live under one consolidated Learn Center category: Filtration & Equipment. It can still have freshwater, saltwater, and specialty subgroups inside it.

Recommended filtration pages:

- Which filter do I need?
- Sponge filters
- Hang-on-back filters
- Canister filters
- Sumps
- All-in-one filtration chambers
- Protein skimmers
- UV sterilizers
- Media reactors
- Fleece rollers
- Filter media: mechanical, biological, chemical
- Choosing the right filter by tank size/type

## Troubleshooting Format

Troubleshooting pages should use a diagnosis-style layout:

- Symptoms
- What to test first
- Likely causes
- What to do today
- What to avoid
- Helpful products or store departments

## First Build Priority

Start with Troubleshooting plus Filtration & Equipment. These are the highest-value areas because they match real customer questions and lead naturally to useful product/category links without feeling like generic sales copy.

## Current State - 2026-05-23

Initial Learn Center hub is built and deployed.

- Live page: `https://jz237.github.io/jez237-site/prototypes/hidden-reef/learn/?v=df172a86`
- Commit: `df172a86 Add Learn Center accordions and specials glow`
- Structure now includes:
  - Choose a Learning Path
  - Troubleshooting Center
  - First-step triage cards
  - Starter and care checklists
  - Filtration & Equipment as one consolidated category
- Accordion behavior:
  - Choose a Learning Path stays visible.
  - Troubleshooting Center opens by default.
  - Starter/Care and Filtration start collapsed.
  - Links into collapsed sections auto-open the relevant section.

## Current Design Direction

- Keep the Learn Center practical and diagnostic, not blog-like.
- Use collapsible sections as content grows so the page does not become too tall.
- Keep Troubleshooting as the main customer-facing hook.
- Keep Filtration consolidated instead of splitting freshwater, reef, and pond filtration into separate top-level categories.
- Product/category links should feel helpful and local-store practical, not forced sales copy.

## Next Work In `#hidden-reef`

Continue Hidden Reef demo work in the private Discord channel `#hidden-reef` (`1507858595310604358`).

Good next implementation passes:

- Expand individual troubleshooting articles for cloudy water, algae, parasites/ich, ammonia or nitrite spikes, and fish gasping at the surface.
- Add compact diagnosis cards with: symptoms, tests, likely causes, what to do today, what to avoid, and helpful departments.
- Build the Filtration & Equipment section into real guide pages: filter choice, media types, maintenance, UV, skimmers, reactors, and fleece rollers.
- Add internal links from troubleshooting cards to relevant shopping categories.
- Keep mobile tight: short intro text, compact card spacing, collapsed deep content, and no giant stacked walls.

## Cloudy Water Guide Pass - 2026-05-23

- Added `learn/cloudy-water/` as the first full Troubleshooting article.
- Added GPT Image 2 visual asset `assets/learn/cloudy-water-gpt-image-2.png`.
- Refined the visual section so the four diagnosis cards use realistic crops from the main aquarium image instead of abstract CSS placeholders.
- Replaced the generated decision infographic with a readable HTML/CSS shop-floor chart: quick diagnosis table, common causes, helpful tools, and safety note.
- Article structure now includes: hero visual, visual water-clarity display, what to do today, decision-tree diagnosis flow, common causes, helpful departments, and urgent-help callout.
- Learn Center Cloudy Water card now links to the dedicated guide instead of only the short first-step card.

## Ammonia / Nitrite Guide Pass - 2026-05-24

- Added `learn/ammonia-nitrite/` as a full emergency Troubleshooting article.
- Added GPT Image 2 hero asset `assets/learn/ammonia-nitrite-spike-gpt-image-2.jpg`.
- Added infographic asset `assets/learn/ammonia-nitrite-troubleshooter-chart.png`.
- Article structure follows the established guide pattern: hero visual, first response, warning signs, decision flow, common causes, helpful departments, what-to-avoid callout, and collapsible quick-reference chart.
- Learn Center Ammonia or Nitrite Spike card now links to the dedicated guide instead of only the short first-step card.

## Fish Gasping Guide Pass - 2026-05-24

- Added `learn/fish-gasping/` as a full emergency Troubleshooting article.
- Added GPT Image 2 hero asset `assets/learn/fish-gasping-surface-gpt-image-2.jpg`.
- Added infographic asset `assets/learn/fish-gasping-troubleshooter-chart.png`.
- Article structure follows the established guide pattern: hero visual, first response, warning signs, decision flow, common causes, helpful departments, what-to-avoid callout, and collapsible quick-reference chart.
- Learn Center Fish Gasping at Surface card now links to the dedicated guide instead of only the short first-step card.

## Coral Not Opening Guide Pass - 2026-05-24

- Added `learn/coral-not-opening/` as a full reef Troubleshooting article.
- Uses existing reef imagery from `assets/department/saltwater-reef.jpg` for the hero visual.
- Added infographic asset `assets/learn/coral-not-opening-troubleshooter-chart.png`.
- Article structure follows the established guide pattern: hero visual, first response, visual clues, decision flow, common causes, helpful departments, what-to-avoid callout, and collapsible quick-reference chart.
- Learn Center Coral Not Opening card and first-step checklist now link to the dedicated guide instead of only the short first-step anchor.

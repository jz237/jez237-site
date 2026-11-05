# Fish Health Lab — independent experiment

Owner request: Jez, Discord #gpt-chat-1, `1567924888113520831`, 2026-11-05.
Requested an experimental fish-ailment guide on his personal site, entirely
separate from Hidden Reef. Intended URL:
`https://jez237.com/experiments/fish-health-lab/`.

## Product contract

- Buildless static HTML/CSS/ES modules. No credentials, account, API endpoint,
  dependency installation, paid inference, backend storage or photo upload.
- A 3-step visual symptom + water-context guide suggests **reading comparisons**,
  not diagnoses, confidence percentages or medication prescriptions.
- Freshwater and marine causes remain distinct. Unknown water type is explicit.
- Severe gasping, collapse, deaths, pineconing and marine respiratory/dust signs
  get priority warnings. Water testing stays visible even when signs look infectious.
- Blank tests are unknown, never silently zero. Nitrite cautions distinguish
  freshwater and marine water. No universal treatment/dose/heat/salt advice.
- Photo picker only uses a temporary browser blob URL. No browser storage,
  fetch/upload, image recognition or hidden AI call. UI and exported notes say so.
- Case builder provides observations and a cautious AI prompt. Explicit copy,
  text download and external ChatGPT link; the link transmits **no case data**.
  A user must separately paste notes and attach their original photo in the AI.
- Unlisted and `noindex`; not password protected. No homepage/nav/sitemap entry.
  Do not integrate or deploy this into Hidden Reef without a separate request.

## Content / assets

15 comparison entries: environmental stress, freshwater ich, marine ich,
freshwater velvet, marine velvet, water mold, columnaris-type disease, fin damage,
ulcerative disease, dropsy-like swelling, eye changes, buoyancy, other gill/skin
parasites, larger growths and normal anatomy/markings.

Sources checked 2026-11-05: Merck Veterinary Manual parasitic diseases, bacterial
diseases, aquarium management/diagnostics (links in data.mjs). Summaries are not
clinically validated. Source institutions do not endorse this tool. Real expert-
identified case photography and professional review are future work.

Symptom illustrations: original code-native schematic SVGs, not patient photos.
Ich atlas: previously generated at Jez's request, retained JPEG 1024×1536,
675,031 bytes, SHA256
`b7e2ede990307970f5e2f324533ca3294df8a11e643762da3609b0e7a9b5aaf0`.
Requested `openai/gpt-image-2.6-sunburst` / medium; backend model not independently
verified. Original receipt:
`workspace/tmp/imagegen/ich-presentations-0ef55a8d88/receipt.json`.
R2 object: `jez237-site-media/experiments/fish-health-lab/ich-comparison-b7e2ede9.jpg`.
Public asset: `https://media.jez237.com/experiments/fish-health-lab/ich-comparison-b7e2ede9.jpg`.
Never commit generated image binaries to Git. Keep source original media intact.

## Verification

Run `node --test scripts/fish-health-lab/logic.test.mjs` and JS syntax checks.
Use an isolated headless Playwright browser for local and production checks:
desktop/mobile overflow, water selection, visible-sign toggles, forward/back,
urgent notices, numeric validation, environment filtering, library search,
details/atlas dialogs, private photo preview/removal, and case copy/export.
Record network requests during a local photo choice; no image upload allowed.
Staged diff secret scanner required before committing and deploying.

Deploy via the existing guarded jez237.com release, never from a sparse editing
checkout. Preserve newest origin/main and other agents' dirty work. Verify live
asset byte hashes, noindex headers and representative live interactions.

## Next experiments

1. Ask Jez to try actual cases on mobile and note where he hesitates.
2. Build a licensed, expert-labelled real case image library; keep AI illustrations
   visibly distinct from confirmed cases.
3. Only add automatic AI photo observations with explicit user consent, a selected
   server-side provider/account, abuse limits and appropriate clinical evaluation.
   No OpenClaw OAuth token or provider secret may ever ship to the browser.
4. Keep treatment selection out of scope until species, salinity, tank inhabitants,
   diagnostics and qualified review are handled properly.

# Aquarium News: daily story run

Jez turned on the automatic daily story on November 1, 2026 (19:43 EST). One run a day at
**10:00 America/New_York**. A run publishes **at most one** story, or nothing. Publishing
nothing is a normal, successful result.

Scope: `jz237/jez237-site`, route `newsletter/`, live at https://jez237.com/newsletter/.
The Hidden Reef Lab copy (`hidden-reef-lab`, `/news/`) is **not** part of this job; it is
refreshed only when Jez asks. Never touch thehiddenreef.net or the storefront repository.

Read `newsletter/EDITORIAL.md` before writing. Every rule there applies; this file adds the
order of operations and the stop conditions.

## Paths and tools (Evo X2)

```bash
SITE=/home/jez237/newsletter-preview-1566475426358890528/site   # complete publishing checkout
QA=/home/jez237/.openclaw/workspace/.openclaw/tmp/aquarium-daily-$(date +%F)   # evidence, outside the repo
PY="uv run -q --no-project --python 3.12 --with pillow --with playwright python"  # browser suites
export PATH="$HOME/.local/opt/node-v24.22.1-linux-x64/bin:$HOME/.npm-global/bin:$PATH"
CHECK="python3 $SITE/scripts/aquarium_daily_story_check.py"
```

`aquarium_daily_story_check.py` changes nothing; it prints JSON and exits 1 when the run must stop.

## One run, in order

1. **Fetch main.** `cd $SITE && $CHECK preflight`. It requires a clean `main` that is an
   ancestor of `origin/main` and refuses if a story with today's `published` date already
   exists. Then `git merge --ff-only origin/main`. Dirty files or diverged history: stop and
   report; never stash, reset or force-push someone else's work.
2. **Research, news first.** Start with real news from the last ~60 days that a hobbyist
   would enjoy: newly described species (ZooKeys, Zootaxa, PeerJ, PLOS and other journals),
   conservation results, research findings, and aquarium-equipment safety recalls (check
   `https://www.saferproducts.gov/RestWebServices/Recall?format=json&RecallDateStart=<60 days ago>`
   for aquarium, fish tank, pond and heater products). Then practical guides and species
   profiles. Keep freshwater varied: fish, shrimp, snails and ponds as well as plants (see
   `$CHECK preflight` → `balance`). Look for current freshwater and reef developments and practical topics in
   real primary sources: research papers and university/extension pages (UF/IFAS etc.),
   NOAA and other agencies, public aquariums, conservation programmes, and manufacturer or
   grower documentation (attributed as such). Read each page body; a 200 status is not
   verification and soft 404s are rejected. Note each source's own date. Exclude competitor
   stores, store openings, promotions, rumours and anything you cannot verify.
   Besides news, practical guides and species profiles, the approved story types are
   **Myth vs fact** (occasionally), **Odd and amazing** (strange behaviour, deep-sea finds,
   record animals), **History corner** (early home aquariums, how the hobby began, early
   public aquariums) and **Beginner basics** (cycling a new tank, first fish, first-week
   mistakes). The core mix stays news-first. Never write "fix-it" troubleshooting stories
   (cloudy water, algae, ich and similar); "how the gear works" and "seasonal prep" are not
   approved story types. `$CHECK candidate` rejects obvious fix-it titles.
3. **Decide or skip.** Publish only if there is a worthwhile new development or a ready,
   useful evergreen guide. Balance freshwater and reef across the week and lean towards
   practical care. Older research is fine only when labelled as earlier research
   (`"archive": true`); never present an old event as new. If nothing qualifies:
   **publish nothing, post nothing, end the run.**
4. **No duplicates.** `$CHECK candidate <slug> "<title>"` must pass. It compares against every
   existing slug and title; also read the closest existing stories yourself and make sure the
   new piece is a meaningfully different topic, not a reworded one.
5. **Pick a format** different from the newest story's (`$CHECK preflight` prints
   `previous_format`): `brief` (120–200 words, no headings), `steps`, `profile`, `feature`
   (700–900 words, occasionally), `photo`, `qa`, `guide`, `checklist`, `report`, `explainer`.
   No sidebar box (`aside`) by default.
   **Write the story** as one new object in `newsletter/stories.json` (schema in
   `scripts/aquarium_editorial.py`, examples in the existing stories):
   - `slug`, `category` (`freshwater` | `reef`), `label` (`Freshwater` | `Reef & ocean`),
     `kind` (`Practical guide` | `Research` | `Conservation news` | `Species profile`), `tags`,
     `format`, `date` (source /
     background date text), `published` (today, `YYYY-MM-DD`), `title`, `dek`, `image`,
     `caption`, `source`, `url`, `references`, `blocks`, `archive`; optional `diagram`,
     `showroom`, `modified`; `facts` for profiles.
   - **Species profile facts box** (`format: profile`, `kind: Species profile`): `facts` is
     exactly Adult size, Temperature, Minimum tank, Difficulty, Diet, Temperament, each
     `{label, value, detail?, refs}`. Values in inches, °F and US gallons; the metric source
     value goes in `detail`. Every fact cites a reference; no source, no profile.
   - **Units:** US gallons, °F, inches. Convert metric accurately at the source's precision
     and keep metric only in parentheses or the facts detail line.
   - **Answer-first title and dek:** the useful finding is in the headline. No questions,
     teasers or withheld answers.
   - **Complete original article** in the format's word range (brief 120–200, feature
     700–900, most others 250–650), readable on the page. Vary the opening and
     structure (`p`, `heading`, `list`, `aside`); the first block is a `p`. No "read the rest
     at the source" and no forced takeaway box.
   - **Attributed claims:** manufacturer and grower guidance is attributed to them, never
     stated as a universal rule or an independent test. Keep qualifications and uncertainty.
   - **Endnote references:** at least two `{id, label, url, date}` entries, cited from blocks
     through `refs` (a `brief` may rest on one primary source). Sources sit in the quiet
     endnotes, not as the destination.
   - **Per-source derivation limit:** no more than 200 cited words per source URL across the
     whole edition including `checklist.json` (enforced by the tests; also judge uncited
     wording, the title, dek and any diagram text).
   - **No store content invented:** no inventory, prices, staff quotes, store endorsement or
     customer stories. No competitor stores.
   - **Humanizer on headings only:** run the humanizer skill on the title, dek and section
     `heading` blocks. Never on body text.
   - **Tags:** one or more of `Plants`, `Fish`, `Shrimp & snails`, `Ponds`, `Coral`,
     `Equipment`, `Water care`.
   - **Showroom (rare):** add `"showroom": {"path": "/showroom/<room>/", "title": "<page title>",
     "note": "<short phrase>"}` only when the article is directly about that equipment. Allowed
     rooms: drum-filter, fluidized-sand, protein-skimmer, biowheel, uv-sterilizer, betta-bowl
     (check `https://thehiddenreef.net/showroom/<room>/` returns 200 with the right page title
     first). Most stories get none; skip it if one of the last several stories already has one.
   - **Position:** the new story goes first in the array (newest first; it becomes the hero).
   - Never include private `verification_notes` or research receipts.
6. **Image.** Either
   - a **properly licensed photograph** (CC BY, CC BY-SA, CC0 or public domain; no NC/ND, no
     "found online"), resized to at most 1600 px wide WebP quality 80-82 in `newsletter/images/`,
     with a complete `newsletter/photo-credits.json` record: `filename, title, source_url,
     author, license, license_url, alt, changes, width, height`. The photo must show the topic
     (correct species/equipment) and is captioned as illustrative, never as store stock or the
     reported event; or
   - a **clearly labelled original diagram** added to `scripts/build_aquarium_diagrams.py`
     (which regenerates `illustrations.json` with its caption and sources).
   If no properly licensed image exists, **skip the day**. Never use an unlicensed image.
7. **Gate.** `$CHECK validate` (one new story at most, today's date, schema, format differs
   from the previous story, word range, facts box, units, tags, image licence record,
   showroom limits).
8. **Build.** `cd $SITE/scripts && python3 build_aquarium_diagrams.py && python3 build_aquarium_journal.py`
   (regenerates the index, story pages, credits, JSON-LD and the sitemap `lastmod`).
9. **Full test suite**, all must pass:
   ```bash
   cd $SITE/scripts
   python3 test_aquarium_editorial.py && python3 test_aquarium_practical.py
   $PY test_aquarium_reader.py --output $QA/reader-local
   $PY test_aquarium_journal.py --output $QA/journal-local
   $PY test_aquarium_practical_browser.py --output $QA/practical-local
   cd $SITE && node --check newsletter/journal.js && node --check newsletter/editorial.js \
     && node scripts/check_hidden_reef_retired.mjs && node scripts/check_games_catalog_syntax.mjs \
     && git diff --check
   ```
   Look at the desktop and mobile screenshots of the new story before going on.
10. **Commit.** Stage only `newsletter/` and `sitemap.xml` (plus the diagram builder if used),
    run `python3 /home/jez237/.openclaw/workspace/scripts/scan_git_diff_secrets.py --staged`,
    then `git commit -m "Aquarium News: <title> (daily story)"`.
11. **Push fast-forward only:** `git push origin HEAD:main`. If rejected because main moved:
    `git fetch origin main && git rebase origin/main`; if the rebase is clean, repeat steps 8-9
    and push again. Conflicts or a second rejection: `git rebase --abort`, reset nothing that
    is not yours, stop and report. Never force-push.
12. **Deploy only via the guarded helper:**
    `bash /home/jez237/.openclaw/workspace/scripts/deploy_cloudflare_pages_site.sh $SITE > $QA/deploy.log 2>&1`
    No raw `wrangler pages deploy`, no static-only or sparse upload, no guard bypass. If the
    guard prints `Main changed during preview; production unchanged.` (exit 1), do not force a
    retry: wait for and check the newer production build (it descends from your commit), then
    continue with step 13. If a command times out, inspect the running process and log before
    any retry.
13. **Verify live** (cache-busted): `$CHECK live <slug>` must pass (story page, index link,
    `stories.json` and sitemap). Then rerun the three browser suites with
    `--base-url https://jez237.com` and separate `$QA/*-live` output directories.
14. **Post ONE line** to Discord #hidden-reef-2 (the channel Jez turned this on from,
    `1509408692552863755`): `Aquarium News: <title> https://jez237.com/newsletter/stories/<slug>/`.
    Nothing else: no logs, research notes or test output. Skip days post nothing.

## On any failure

- **No partial publish.** Before the push (steps 1-10) a failure means: discard only your own
  uncommitted edits (`git checkout -- newsletter sitemap.xml scripts/build_aquarium_diagrams.py`,
  `gio trash` for new image files), leave the checkout clean on `main`, publish nothing.
- After the push but before a verified live page (steps 11-13): if the guarded deploy cannot
  complete and no descendant production build carries the story, push a `git revert` of your
  commit (fast-forward) so GitHub does not hold an unpublished story, and stop.
- Report the **exact failing step number and command** with the last relevant output lines
  (privately to the parent / Jez, not in #hidden-reef-2). Do not retry more than once.

## Never

- More than one story per day; filler on a quiet day; old events labelled as new.
- Competitor stores, invented store content, rumour, unattributed manufacturer claims.
- Humanizer on body text. Unlicensed or mismatched images.
- Touching the Lab, thehiddenreef.net, the storefront repository, gateway services or auth.

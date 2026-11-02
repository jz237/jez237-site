# Hidden Reef

**Open the complete site: https://hidden-reef.pages.dev/**

Jez selected two active copies on 2026-10-11: the standalone Cloudflare site and one local editable source at `/home/jez237/projects/hidden-reef` on Evo X2.

GitHub and jez237.com host links only. The former prototype URLs preserve deep links. Do not recreate full storefronts or the header-preview variant here. The main website aquarium/reef/pond demos remain independent gallery demos. Hidden Reef updates and daily catalog/specials refreshes run from its local source and publish directly to its separate Cloudflare project.

Old versions remain in Git history; this migration does not rewrite repository history.

## Aquarium News moved to thehiddenreef.net (November 2, 2026)

Jez, Nov 1 22:42 EST: Aquarium News moved from this site's `newsletter/` route to The Hidden
Reef's own site, https://thehiddenreef.net/news/, with its daily story. Its single source is now
the store repository (`/home/jez237/projects/hidden-reef`, `private/aquarium-news/`: stories,
credits, images, `EDITORIAL.md`, `DAILY_STORY.md`; builder `tools/build-aquarium-news.mjs`).
The `newsletter/` pages, data and the `scripts/aquarium_*` / `build_aquarium_*` /
`test_aquarium_*` newsletter builders and tests were removed here; every old URL returns a 301 from
`_redirects` (`/newsletter/` → `/news/`, `/newsletter/stories/<slug>/` → `/news/stories/<slug>/`,
`/newsletter/page/<n>/` → `/news/page/<n>/`, `/newsletter/credits.html` → `/news/credits/`).
Do not recreate the newsletter here; the history stays in Git (last version `ea76e7647`).

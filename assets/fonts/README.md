# Self-hosted Google Fonts

These are unmodified copies of the WOFF2 files that Google Fonts served on
2026-10-23 to a current desktop Chrome, together with Google's own
`@font-face` rules (same subsets, `unicode-range` values, weights and
`font-display: swap`). Only the file URLs were changed to point here.

Serving them from jez237.com removes the two extra connections to
fonts.googleapis.com and fonts.gstatic.com that every first visit used to
need before text could render in these faces.

- `files/<family>/<version>/` keeps Google's own path and file names. A new
  font version gets a new name, so `_headers` caches these files for a year
  as immutable.
- `css/` holds the rules for pages that link a stylesheet. Shared site
  stylesheets (for example `assets/styles.css`) inline the same rules.
- `licenses/` has each family's licence. All of them are SIL Open Font
  License 1.1 fonts from the google/fonts repository.

To add a family, request its css2 URL with a modern Chrome User-Agent,
download every WOFF2 it lists into `files/`, and rewrite the URLs. Keep the
rules otherwise unchanged.

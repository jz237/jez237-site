# /photos/ — how this section works

Every album under `/photos/` renders from a `manifest.json` in its folder.
**To add a photo you edit the manifest, not the HTML.** The pages share one
renderer (`photos/assets/gallery.js` + `gallery.css`) that provides the grid,
month grouping, and the lightbox (arrows, keyboard, mouse wheel, swipe,
1:1 zoom).

## Albums

| Album | URL | Layout | Images live in |
| ----- | --- | ------ | -------------- |
| Cat Corner | `/photos/cats/` | masonry (authored order, newest first) | `photos/cats/images/` (committed to git) |
| Garden Timeline | `/photos/garden/` | timeline (grouped by month) | Cloudflare R2 under `photos/garden/images/YYYY/MM/` |
| Snapshots | `/photos/snapshots/` | timeline (grouped by month) | `photos/snapshots/images/YYYY/MM/` (committed) or R2 |

Snapshots is the catch-all: anything worth keeping that isn't a cat or a
garden/plant photo (those have their own homes — see `llms.txt`).

## Adding a photo

1. Prepare the image: resize to max 1280x1024, JPEG quality ~88, apply EXIF
   transpose. Descriptive kebab-case filename, dated when known:
   `<slug>-YYYY-MM-DD.jpg`.
2. Put the image in place:
   - cats → `photos/cats/images/`
   - garden → upload to R2 with `scripts/upload_garden_image_to_r2.py`
     (do **not** commit garden image binaries)
   - snapshots → `photos/snapshots/images/YYYY/MM/` (committing is fine;
     use R2 via the upload script's `--album snapshots` for big batches)
3. Prepend an entry to the album's `manifest.json` (newest first):

```json
{
  "src": "images/2026/07/fourth-of-july-grill-2026-07-04.jpg",
  "alt": "Short literal description for accessibility",
  "caption": "One line in the site's voice — observational, a little funny.",
  "date": "2026-07-04"
}
```

- `src` — relative to the album folder, or an absolute R2 URL.
- `date` — `YYYY-MM-DD`, optional but strongly preferred; timeline albums
  group by month from it (undated photos land in an "Undated" group).
- `alt` — literal description; `caption` — the fun one.

4. Validate: `node -e 'JSON.parse(require("fs").readFileSync("photos/<album>/manifest.json"))'`

## Adding a new album

Copy `photos/snapshots/index.html`, adjust title/meta/hero, create an empty
`manifest.json` (`{ "album": "...", "photos": [] }`), then add a card to
`photos/index.html` and an entry to `sitemap.xml`. The hub page reads each
album's manifest for live counts and the latest-photos strip — new albums
need one line added to its `albums` array.

# AI News Feed (starter pipeline)

This is a lightweight pipeline that:

1. Pulls AI news from curated RSS/Atom feeds
2. Dedupes by canonical URL
3. Scores + ranks items (source quality + keyword relevance + recency)
4. Outputs JSON for website use
5. Builds a simple static `index.html`

## Files

- `feeds.json` — source list (edit this first)
- `fetch_ai_news.py` — fetch + dedupe + score + output
- `data/items.json` — persistent local store
- `public/ai-news-latest.json` — latest 50 items
- `public/ai-news-daily-YYYY-MM-DD.json` — top daily digest (default 12)
- `public/index.html` — simple static page

## Run

```bash
cd apps/ai-news-feed
./fetch_ai_news.py
```

## Schedule (hourly)

Example cron entry:

```cron
5 * * * * cd /home/jez237/.openclaw/workspace/apps/ai-news-feed && ./fetch_ai_news.py >> data/cron.log 2>&1
```

## Website integration path

Use `public/ai-news-latest.json` or `public/ai-news-daily-YYYY-MM-DD.json` as your website feed source.

If your site is static, you can copy the `public/` output to your web root.
If your site is dynamic, consume these JSON files in your backend and render the feed page there.

## Notes

- Some feeds can go stale/change URLs over time. Keep `feeds.json` under review.
- Ranking is intentionally simple and transparent right now; we can add LLM curation next.
- Default output target is 8–12 daily items (currently 12).

# jez237-website

Starter website project with an AI news feed.

## Structure

- `index.html` — landing page
- `ai-news/` — feed pipeline + generated output
  - `fetch_ai_news.py` — fetch/dedupe/rank script
  - `feeds.json` — curated feed sources
  - `public/` — publishable web assets + JSON feeds

## Update the feed

```bash
cd ai-news
./fetch_ai_news.py
```

## Publish later

You can publish as static files (Netlify, GitHub Pages, Cloudflare Pages, Vercel static), or copy `public/` into an existing site route.

## GitHub setup (local)

```bash
cd jez237-website
git init
git add .
git commit -m "Initial AI news website scaffold"
# then add your remote:
# git remote add origin git@github.com:<you>/jez237-website.git
# git push -u origin main
```

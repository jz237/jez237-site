#!/usr/bin/env python3
"""Build the static, source-attributed Aquarium News design preview (/newsletter/).
No scraping, scheduling, credentials, or publication happens here.
"""
from pathlib import Path
from html import escape as e
import json
import re
from datetime import date
from aquarium_editorial import render, reading_time, validate, plain_date, related_stories, TAGS, tag_keys, tags_markup, share_markup, story_url, SITE

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'newsletter'
stories = json.loads((OUT / 'stories.json').read_text())
photos = json.loads((OUT / 'photo-credits.json').read_text())
illustrations = json.loads((OUT / 'illustrations.json').read_text())
photo_map = {p['filename']: p for p in photos + illustrations}
assert len(stories) >= 6 and len({s['slug'] for s in stories}) == len(stories)
assert {s['category'] for s in stories} == {'freshwater', 'reef'}
for story in stories:
    validate(story)
# The page's "Updated" line comes from the newest story publication date in the data.
UPDATED = max(date.fromisoformat(s['published']) for s in stories)
NAME = 'Aquarium News'
for p in photos + illustrations:
    assert (OUT / 'images' / p['filename']).is_file(), p['filename']
for p in photos:
    assert p['source_url'].startswith('https://') and p['license_url'].startswith('https://')

LOGO = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="24" cy="24" r="21"/><path d="M24 39V15m0 16c-9 0-13-6-13-12m13 5c7 0 11-5 11-10M16 29v-8m15 1v-7M24 20l-6-6m6 0 4-5M11 19l-3-3M35 14l4-3"/><path d="M17 39h14"/></svg>'

def modified(s):
    return s.get('modified', s['published'])

def abs_image(filename):
    return SITE + 'images/' + filename

def social_image(s):
    # Social cards need a raster image; SVG diagrams fall back to the edition photograph.
    return s['image'] if not s['image'].endswith('.svg') else 'reef-hero.webp'

def ld_json(data):
    # Escape "<" so a value can never close the script element.
    return '<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c') + '</script>'

PUBLISHER = {'@type': 'Organization', 'name': 'Jez237', 'url': 'https://jez237.com/', 'logo': {'@type': 'ImageObject', 'url': 'https://jez237.com/assets/brand.svg'}}
AUTHOR = {'@type': 'Person', 'name': 'Jez237', 'url': 'https://jez237.com/'}

def article_ld(s):
    return {'@context': 'https://schema.org', '@type': 'NewsArticle' if s['kind'] in {'Research', 'Conservation news'} else 'Article',
            'headline': s['title'][:110], 'description': s['dek'], 'url': story_url(s), 'mainEntityOfPage': story_url(s),
            'datePublished': s['published'], 'dateModified': modified(s), 'image': [abs_image(s['image'])],
            'author': AUTHOR, 'publisher': PUBLISHER, 'articleSection': s['label'], 'keywords': s['tags'],
            'inLanguage': 'en', 'isPartOf': {'@type': 'CollectionPage', 'name': 'Aquarium News', 'url': SITE}}

def social(title, description, path, image='reef-hero.webp', og_type='website', s=None):
    p = photo_map[image]
    extra = f'<meta property="article:published_time" content="{s["published"]}"><meta property="article:modified_time" content="{modified(s)}">' + ''.join(f'<meta property="article:tag" content="{e(t, quote=True)}">' for t in s['tags']) if s else ''
    return (f'<meta property="og:image" content="{abs_image(image)}"><meta property="og:image:width" content="{p["width"]}"><meta property="og:image:height" content="{p["height"]}"><meta property="og:image:alt" content="{e(p["alt"], quote=True)}"><meta property="og:type" content="{og_type}">{extra}'
            f'<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{e(title, quote=True)} · Aquarium News"><meta name="twitter:description" content="{e(description, quote=True)}"><meta name="twitter:image" content="{abs_image(image)}"><meta name="twitter:image:alt" content="{e(p["alt"], quote=True)}">')

def head(title, description, base='./', path='', story=None, ld=None, full_title=None, extra=''):
    meta = social(title, description, path, social_image(story), 'article', story) if story else social(title, description, path)
    shown = full_title or f'{title} · Aquarium News'
    if story:
        ld = article_ld(story)
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(shown)}</title><meta name="description" content="{e(description, quote=True)}">
<meta name="robots" content="index,follow"><meta name="theme-color" content="#183c35">
<meta property="og:title" content="{e(shown, quote=True)}"><meta property="og:site_name" content="Aquarium News"><meta property="og:url" content="https://jez237.com/newsletter/{path}"><meta property="og:description" content="{e(description, quote=True)}">
{meta}{ld_json(ld) if ld else ''}
<link rel="canonical" href="https://jez237.com/newsletter/{path}">{extra}<link rel="icon" type="image/svg+xml" href="{base}../assets/brand.svg">
<link rel="stylesheet" href="{base}journal.css"><link rel="stylesheet" href="{base}practical.css?v=20261102b"><link rel="stylesheet" href="{base}editorial.css?v=20261101d"><script src="{base}editorial.js?v=20261101b" defer></script><link rel="preload" as="font" type="font/woff2" crossorigin href="{base}../assets/fonts/files/fraunces/v38/6NU78FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0KxC9TeA.woff2">
</head><body><a class="skip" href="#main">Skip to content</a>
<div class="preview-bar">Independent design preview for The Hidden Reef · Not the store’s official newsletter <a href="{base}../">Back to Jez237 ↗</a></div>
<header class="masthead wrap"><a class="brand" href="{base}" aria-label="Aquarium News, current edition">{LOGO}<span><strong>THE HIDDEN REEF</strong><small>Aquarium News · A concept</small></span></a>
<nav class="mastnav" aria-label="Aquarium News navigation"><a class="edition-link" href="{base}#stories">This edition</a><a class="desktop-link" href="{base}?topic=freshwater#stories">Freshwater</a><a class="desktop-link" href="{base}?topic=reef#stories">Reef &amp; ocean</a><a class="about-link" href="{base}#about">About</a></nav></header>'''

def footer(base='./'):
    return f'''<footer class="footer wrap"><div><div class="footer-brand">A little wonder. A lot to discover.</div><p>Aquarium News · A concept for The Hidden Reef, hosted by Jez237.</p></div><div class="footer-links"><a href="{base}credits.html">Photography &amp; credits</a><a href="{base}#about">Editorial note</a><a href="{base}../">Jez237 ↗</a></div></footer></body></html>'''

def img(filename, base='./', eager=False):
    p = photo_map[filename]
    return f'<img src="{base}images/{e(filename)}" alt="{e(p["alt"], quote=True)}" width="{p["width"]}" height="{p["height"]}" loading="{"eager" if eager else "lazy"}" decoding="async"{(" fetchpriority=\"high\"" if eager else "")}>'

def card(s, base='./'):
    href = f'{base}stories/{s["slug"]}/'
    image_class = ' diagram-image' if s['image'].endswith('.svg') else ''
    archive = '<span class="archive-note">Earlier research</span>' if s.get('archive') else ''
    return f'''<article class="story format-{s['format']}" data-format="{s['format']}" data-category="{s['category']}" data-tags="{' '.join(tag_keys(s))}"><a class="story-image{image_class}" href="{href}" tabindex="-1" aria-hidden="true">{img(s['image'], base)}<span class="story-label">{e(s['label'])}</span></a><div class="story-meta">{e(s['kind'])}<span aria-hidden="true">·</span><time class="story-date" datetime="{s['published']}">{plain_date(s['published'])}</time><span aria-hidden="true">·</span>{reading_time(s)} min read</div><h3><a href="{href}">{e(s['title'])}</a></h3><p>{e(s['dek'])}</p>{tags_markup(s)}<a class="read-story" href="{href}" aria-label="Read {e(s['title'], quote=True)}">Read the story <span aria-hidden="true">↗</span></a>{archive}</article>'''

def archive_badge(s):
    return '<div class="archive-note">Earlier research</div>' if s.get("archive") else ""

def credit_text(s):
    p = photo_map[s['image']]
    return 'Original AI-assisted editorial diagram.' if s['image'].endswith('.svg') else f'Photo: {e(p["author"])}.'

def extra_diagram(s, base='./'):
    if not s.get('diagram'):
        return ''
    d = photo_map[s['diagram']]
    return f'<figure class="explainer-diagram">{img(s["diagram"], base)}<figcaption>{e(d["caption"])} <a href="{base}credits.html#{Path(s["diagram"]).stem}">Illustration notes</a>.</figcaption></figure>'

def related_markup(s, href, heading):
    items = related_stories(s, stories)
    if not items:
        return ''
    links = ''.join(f'<li><a href="{href(r)}">{e(r["title"])}</a><span class="related-meta">{e(r["label"])} · <time datetime="{r["published"]}">{plain_date(r["published"])}</time></span></li>' for r in items)
    return f'<nav class="related-stories" aria-label="Related stories"><{heading} class="related-title">Related stories</{heading}><ul>{links}</ul></nav>'

def reader_template(s, base='./'):
    p = photo_map[s['image']]
    credit_id = Path(s['image']).stem
    return f'''<template data-reader-template="{s['slug']}" data-path="{base}stories/{s['slug']}/" data-category="{s['category']}" data-tags="{' '.join(tag_keys(s))}"><article class="reader-article format-{s['format']}" data-format="{s['format']}"><header class="reader-heading"><div class="eyebrow">{e(s['label'])} / {e(s['kind'])}</div><h2 class="reader-title" tabindex="-1">{e(s['title'])}</h2><p class="reader-dek">{e(s['dek'])}</p><div class="editorial-byline">Aquarium News · <time datetime="{s['published']}">{plain_date(s['published'])}</time> · {reading_time(s)} min read</div>{tags_markup(s)}{archive_badge(s)}{share_markup(s)}</header><figure class="reader-figure">{img(s['image'], base, eager=True)}<figcaption>{e(s['caption'])} {credit_text(s)} <a href="{base}credits.html#{credit_id}" target="_blank" rel="noopener">Image credits ↗<span class="sr-only"> (opens a new tab)</span></a></figcaption></figure><div class="reader-body">{extra_diagram(s, base)}{render(s, reader=True)}{related_markup(s, lambda r: f"{base}stories/{r['slug']}/", 'h3')}</div></article></template>'''

# ---------- edition pages: at most PER_PAGE cards each, newest first ----------
# /newsletter/ is page 1; /newsletter/page/2/, /page/3/ ... follow. Regenerated on every
# build, so adding a story (the daily job) re-flows every page automatically.
PER_PAGE = 10
PAGES = [stories[i:i + PER_PAGE] for i in range(0, len(stories), PER_PAGE)]
PAGE_COUNT = len(PAGES)
def page_path(n):
    return '' if n == 1 else f'page/{n}/'
def page_base(n):
    return './' if n == 1 else '../../'
def page_href(target, n):
    return page_base(n) + page_path(target)
def pager(n):
    if PAGE_COUNT < 2:
        return ''
    newer = f'<a class="pager-step" rel="prev" href="{page_href(n - 1, n)}">← Newer</a>' if n > 1 else '<span class="pager-step" aria-disabled="true">← Newer</span>'
    older = f'<a class="pager-step" rel="next" href="{page_href(n + 1, n)}">Older →</a>' if n < PAGE_COUNT else '<span class="pager-step" aria-disabled="true">Older →</span>'
    nums = ''.join(f'<li><a href="{page_href(k, n)}"{" aria-current=\"page\"" if k == n else ""} aria-label="Page {k}">{k}</a></li>' for k in range(1, PAGE_COUNT + 1))
    return f'<nav class="pager" id="static-pager" aria-label="Story pages">{newer}<ol>{nums}</ol>{older}</nav>'
def card_template(s, base):
    return f'<template data-card-template="{s["slug"]}" data-category="{s["category"]}" data-tags="{" ".join(tag_keys(s))}">{card(s, base)}</template>'
def first_number(n):
    return (n - 1) * PER_PAGE + 1
INDEX_DESCRIPTION = 'Aquarium News: a photo-rich freshwater and reef aquarium news preview with practical guides, research and conservation news.'
def collection(n):
    items = PAGES[n - 1]
    return {'@context': 'https://schema.org', '@type': 'CollectionPage', 'name': 'Aquarium News' if n == 1 else f'Aquarium News, page {n}', 'url': SITE + page_path(n),
            'description': INDEX_DESCRIPTION, 'dateModified': max(modified(s) for s in items), 'inLanguage': 'en', 'publisher': PUBLISHER,
            'mainEntity': {'@type': 'ItemList', 'numberOfItems': len(items), 'itemListElement': [
                {'@type': 'ListItem', 'position': first_number(n) + i, 'url': story_url(s), 'name': s['title']} for i, s in enumerate(items)]}}
def rel_links(n):
    links = ''
    if n > 1: links += f'<link rel="prev" href="https://jez237.com/newsletter/{page_path(n - 1)}">'
    if n < PAGE_COUNT: links += f'<link rel="next" href="https://jez237.com/newsletter/{page_path(n + 1)}">'
    return links
def stories_section(n, base):
    items = PAGES[n - 1]
    lo, hi = first_number(n), first_number(n) + len(items) - 1
    count = f'All stories · {len(stories)} stories' + (f' · page {n} of {PAGE_COUNT} ({lo}–{hi})' if PAGE_COUNT > 1 else '')
    heading = 'In this edition' if n == 1 else f'Stories {lo}–{hi}'
    tagoptions = ''.join(f'<option value="{key}">{e(name)}</option>' for name, key in TAGS.items() if any(name in s['tags'] for s in stories))
    tagbuttons = ''.join(f'<button type="button" class="filter" data-tag-filter="{key}" aria-pressed="false" aria-controls="story-grid">{e(name)}</button>' for name, key in TAGS.items() if any(name in s['tags'] for s in stories))
    return (f'''<section id="stories" aria-labelledby="stories-title" data-page="{n}" data-page-count="{PAGE_COUNT}" data-per-page="{PER_PAGE}"><div class="section-head"><div><div class="eyebrow">Useful at the tank. Interesting beyond it.</div><h2 id="stories-title">{heading}</h2><p>Hobby news, species profiles and practical guides for freshwater tanks, ponds and reefs.</p></div><div class="filters" role="group" aria-label="Filter stories by aquarium type"><button type="button" class="filter" data-filter="all" aria-pressed="true" aria-controls="story-grid">All stories</button><button type="button" class="filter" data-filter="freshwater" aria-pressed="false" aria-controls="story-grid">Freshwater</button><button type="button" class="filter" data-filter="reef" aria-pressed="false" aria-controls="story-grid">Reef &amp; ocean</button></div><div class="filters tag-filters" role="group" aria-label="Filter stories by topic"><button type="button" class="filter" data-tag-filter="all" aria-pressed="true" aria-controls="story-grid">All topics</button>{tagbuttons}</div><div class="filter-selects"><label class="filter-select"><span>Water</span><select id="water-select" data-filter-select aria-controls="story-grid"><option value="all">All</option><option value="freshwater">Freshwater</option><option value="reef">Reef &amp; ocean</option></select></label><label class="filter-select"><span>Topic</span><select id="topic-select" data-tag-select aria-controls="story-grid"><option value="all">All topics</option>{tagoptions}</select></label></div></div>'''
            f'''<p id="story-count" class="count" role="status" aria-live="polite" data-static-count="{e(count, quote=True)}">{e(count)}</p><noscript><p>Ten stories per page, newest first. Use Newer and Older to browse; topic filtering requires JavaScript.</p></noscript><div id="story-grid" class="stories">{''.join(card(s, base) for s in items)}</div>{pager(n)}<nav class="pager" id="filter-pager" aria-label="Filtered story pages" hidden></nav></section>''')
reader = '''<dialog id="article-reader" class="article-reader" aria-labelledby="reader-title"><div class="reader-toolbar"><div><span class="eyebrow">Aquarium News</span><span class="reader-toolbar-note">A little time beneath the surface.</span></div><button id="reader-close" class="reader-close" type="button" aria-label="Close article"><span>Close</span><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div><div id="reader-scroll" class="reader-scroll"><div id="reader-content"><h2 id="reader-title">Article reader</h2></div></div><div class="reader-pagination"><button id="reader-previous" type="button" aria-label="Previous story">← <span>Previous</span></button><span id="reader-position" role="status" aria-live="polite"></span><button id="reader-next" type="button" aria-label="Next story"><span>Next story</span> →</button></div></dialog>'''
def page_tail(base):
    # Every page carries the reader and card templates for every story, so filters,
    # Previous/Next and related stories reach stories on any page.
    return reader + ''.join(reader_template(s, base) for s in stories) + ''.join(card_template(s, base) for s in stories) + f'<script src="{base}journal.js?v=news-20261102b" defer></script>'
lead = stories[0]
page = head('Small worlds. Endless wonder.', INDEX_DESCRIPTION, ld=collection(1), extra=rel_links(1))
page = page.replace('</head>', '<link rel="stylesheet" href="reader.css?v=20261102b"></head>')
page += f'''<main id="main" class="wrap"><section class="intro" aria-labelledby="journal-title"><div><div class="eyebrow">Aquarium News · Pilot edition 01</div><p class="updated-line">Updated <time datetime="{UPDATED.isoformat()}">{plain_date(UPDATED.isoformat())}</time></p><h1 id="journal-title">Small worlds.<br><em>Endless wonder.</em></h1></div><div class="intro-note"><p>Fresh perspectives for freshwater lovers<br>and reef keepers. Stories to feed your<br>curiosity, not just your fish.</p></div></section>
<section class="cover practical-cover" aria-labelledby="cover-title">{img(lead['image'], eager=True)}<div class="cover-copy"><span class="eyebrow">Latest / {e(lead['label'])} / {e(lead['kind'])}</span><h2 id="cover-title">{e(lead['title'])}</h2><p>{e(lead['dek'])}</p><a class="button-link" href="stories/{lead['slug']}/">{ {'Practical guide': 'Read the practical guide', 'Species profile': 'Read the profile'}.get(lead['kind'], 'Read the story') } <span aria-hidden="true">↗</span></a></div><a class="cover-credit" href="credits.html#{Path(lead['image']).stem}">Illustrative photography · View credits</a></section>
<div class="edition-strip"><div><b>Pilot edition 01</b> <span>Freshwater + saltwater</span></div><div class="strip-right">News, profiles and guides · at most one new story a day</div></div>
{stories_section(1, './')}
<section class="interlude" aria-labelledby="interlude-title"><div class="interlude-photo">{img('reef-hero.webp')}</div><div class="interlude-copy"><div class="eyebrow">Beyond the glass / Conservation news</div><h2 id="interlude-title">A second nursery spreads the risk for Florida’s coral gene bank.</h2><p>About 1,000 corals were moved in the first transfer. The project keeps a backup of living coral genetics at a separate ocean site.</p><a class="button-link" href="stories/a-new-home-for-coral/">Read the conservation story <span aria-hidden="true">↗</span></a></div></section>
<section class="editor-note" id="about" aria-labelledby="about-title"><div><div class="eyebrow">A note from the editor</div><h2 id="about-title">Made for curious<br>fishkeepers.</h2></div><div class="note-content"><div><h3>Written here, with sources.</h3><p>News briefs, species profiles, practical guides and features written for Aquarium News, with the research behind them collected in quiet endnotes. Older research and evergreen guides are labeled, not passed off as breaking news. Manufacturer claims are attributed.</p></div><div><h3>A preview, not an official publication.</h3><p>Built by Jez237 to explore a newsletter page for The Hidden Reef. Photos are illustrative, not store inventory or event photography. A new story is added on days when there is something worth reading, at most one a day. No email collection, competitor promotions or stock claims are included.</p></div></div></section></main><script src="journal.js" defer></script>'''
page = page.replace('<script src="journal.js" defer></script>', page_tail('./'))
(OUT/'index.html').write_text(page + footer())
PAGE_DIR = OUT / 'page'
for n in range(2, PAGE_COUNT + 1):
    base = page_base(n)
    lo = first_number(n); hi = lo + len(PAGES[n - 1]) - 1
    html = head(f'Aquarium News, page {n}', f'Aquarium News page {n} of {PAGE_COUNT}: stories {lo} to {hi}, newest first. ' + INDEX_DESCRIPTION, base, page_path(n), ld=collection(n), full_title=f'Aquarium News, page {n}', extra=rel_links(n))
    html = html.replace('</head>', f'<link rel="stylesheet" href="{base}reader.css?v=20261102b"></head>')
    html += f'''<main id="main" class="wrap"><section class="intro page-intro" aria-labelledby="journal-title"><div><div class="eyebrow">Aquarium News · Page {n} of {PAGE_COUNT}</div><p class="updated-line">Updated <time datetime="{UPDATED.isoformat()}">{plain_date(UPDATED.isoformat())}</time></p><h1 id="journal-title">Aquarium News, page {n}</h1></div><div class="intro-note"><p>Earlier stories, newest first. <a href="{base}">Back to the latest edition</a>.</p></div></section>{stories_section(n, base)}</main>'''
    html += page_tail(base)
    folder = PAGE_DIR / str(n)
    folder.mkdir(parents=True, exist_ok=True)
    (folder / 'index.html').write_text(html + footer(base))
# Remove pages that no longer exist (fewer stories than before).
if PAGE_DIR.exists():
    import shutil
    for d in PAGE_DIR.iterdir():
        if not (d.name.isdigit() and 2 <= int(d.name) <= PAGE_COUNT):
            shutil.rmtree(d) if d.is_dir() else d.unlink()

for index, s in enumerate(stories):
    base='../../'
    path=f'stories/{s["slug"]}/'
    p=photo_map[s['image']]
    credit_id=Path(s['image']).stem
    article=head(s['title'],s['dek'],base,path,story=s)
    article+=f'''<main id="main" class="wrap"><div class="article-top"><a class="back-link" href="{base}#stories">← Back to this edition</a></div><article class="format-{s['format']}" data-format="{s['format']}"><header class="article-heading"><div class="eyebrow">{e(s['label'])} / {e(s['kind'])}</div><h1>{e(s['title'])}</h1><p class="dek">{e(s['dek'])}</p><div class="editorial-byline">Aquarium News · <time datetime="{s['published']}">{plain_date(s['published'])}</time> · {reading_time(s)} min read</div>{tags_markup(s)}{archive_badge(s)}{share_markup(s)}</header><figure class="article-image">{img(s['image'],base,True)}<figcaption>{e(s['caption'])} {credit_text(s)} <a href="{base}credits.html#{credit_id}">License and image credits</a>.</figcaption></figure><div class="article-body">{extra_diagram(s, base)}{render(s)}{related_markup(s, lambda r: f"../{r['slug']}/", 'h2')}<div class="article-end"><a href="{base}#stories">← All stories</a><a href="../{stories[(index+1)%len(stories)]['slug']}/">Next story →</a></div></div></article></main>'''
    folder=OUT/path
    folder.mkdir(parents=True,exist_ok=True)
    (folder/'index.html').write_text(article+footer(base))

credits=head('Photography & credits','Photography sources, attribution and reuse licenses for this independent Aquarium News preview.',path='credits.html')
credits+='''<main id="main" class="wrap"><div class="credits-intro"><div class="eyebrow">The people behind the pictures</div><h1>Photography &amp; credits</h1><p>These photographs illustrate the aquarium hobby. They do not depict Hidden Reef inventory, prove a species’ origin, or document the news events described in the articles.</p><p>Photographer credits and licenses are listed below. Images have been resized and converted to WebP; display layouts may crop their edges. Article text is original editorial writing, with references on each story.</p></div><div class="credits-list">'''
for p in photos:
    credits+=f'''<article class="credit-item" id="{e(Path(p['filename']).stem)}">{img(p['filename'])}<h2>{e(p['alt'])}</h2><p>Photo by <strong>{e(p['author'])}</strong>.<br><a href="{e(p['source_url'],quote=True)}" target="_blank" rel="noopener noreferrer">Original photograph and source page ↗</a><br>License: <a href="{e(p['license_url'],quote=True)}" target="_blank" rel="noopener noreferrer">{e(p['license'])}</a><br>Changes: {e(p['changes'])}</p></article>'''
credits+='</div><section class="illustration-credits" aria-labelledby="illustration-title"><h2 id="illustration-title">Original explanatory illustrations</h2><p>AI-assisted diagrams created for Aquarium News. These are simplified teaching illustrations, not photographs, product tests or scale drawings. The associated articles contain the supporting sources.</p><div class="credits-list">'
for d in illustrations:
    credits+=f'<article class="diagram-credit" id="{e(Path(d["filename"]).stem)}">{img(d["filename"])}<h3>{e(d["title"])}</h3><p>{e(d["caption"])}</p></article>'
credits+='</div></section></main>'

(OUT/'credits.html').write_text(credits+footer())

# Search visibility: keep the /newsletter/ URLs and list them in the site sitemap.
SITEMAP = ROOT / 'sitemap.xml'
START, END = '  <!-- aquarium-news:start (generated by build_aquarium_journal.py) -->', '  <!-- aquarium-news:end -->'
LASTMOD = max(modified(s) for s in stories)
entries = [('', LASTMOD)] + [(page_path(n), max(modified(s) for s in PAGES[n - 1])) for n in range(2, PAGE_COUNT + 1)] + [('credits.html', LASTMOD)] + [(f'stories/{s["slug"]}/', modified(s)) for s in stories]
block = START + '\n' + ''.join(f'  <url><loc>https://jez237.com/newsletter/{loc}</loc><lastmod>{mod}</lastmod></url>\n' for loc, mod in entries) + END
xml = SITEMAP.read_text()
if START in xml:
    xml = re.sub(re.escape(START) + r'.*?' + re.escape(END), lambda _m: block, xml, flags=re.S)
else:
    xml = xml.replace('</urlset>', block + '\n</urlset>')
SITEMAP.write_text(xml)
print(f'Built Aquarium News index, credits, and {len(stories)} article pages with {len(photos)} attributed images; updated {UPDATED.isoformat()}.')

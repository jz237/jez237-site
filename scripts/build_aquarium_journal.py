#!/usr/bin/env python3
"""Build the static, source-attributed Aquarium Journal design preview.
No scraping, scheduling, credentials, or publication happens here.
"""
from pathlib import Path
from html import escape as e
import json

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'newsletter'
stories = json.loads((OUT / 'stories.json').read_text())
photos = json.loads((OUT / 'photo-credits.json').read_text())
photo_map = {p['filename']: p for p in photos}
assert len(stories) == 6 and len({s['slug'] for s in stories}) == 6
assert {s['category'] for s in stories} == {'freshwater', 'reef'}
for p in photos:
    assert (OUT / 'images' / p['filename']).is_file(), p['filename']
    assert p['source_url'].startswith('https://') and p['license_url'].startswith('https://')

LOGO = '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="24" cy="24" r="21"/><path d="M24 39V15m0 16c-9 0-13-6-13-12m13 5c7 0 11-5 11-10M16 29v-8m15 1v-7M24 20l-6-6m6 0 4-5M11 19l-3-3M35 14l4-3"/><path d="M17 39h14"/></svg>'

def head(title, description, base='./', path=''):
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)} · The Aquarium Journal</title><meta name="description" content="{e(description, quote=True)}">
<meta name="robots" content="noindex,follow"><meta name="theme-color" content="#183c35">
<meta property="og:title" content="{e(title, quote=True)} · The Aquarium Journal"><meta property="og:description" content="A photo-led freshwater and reef newsletter concept for The Hidden Reef. Independent design preview hosted by Jez237.">
<meta property="og:image" content="https://jez237.com/newsletter/images/reef-hero.webp"><meta property="og:type" content="website">
<link rel="canonical" href="https://jez237.com/newsletter/{path}"><link rel="icon" type="image/svg+xml" href="{base}../assets/brand.svg">
<link rel="stylesheet" href="{base}journal.css"><link rel="preload" as="font" type="font/woff2" crossorigin href="{base}../assets/fonts/files/fraunces/v38/6NU78FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0KxC9TeA.woff2">
</head><body><a class="skip" href="#main">Skip to content</a>
<div class="preview-bar">Independent design preview for The Hidden Reef · Not the store’s official newsletter <a href="{base}../">Back to Jez237 ↗</a></div>
<header class="masthead wrap"><a class="brand" href="{base}" aria-label="The Aquarium Journal, current edition">{LOGO}<span><strong>THE HIDDEN REEF</strong><small>Aquarium journal · A concept</small></span></a>
<nav class="mastnav" aria-label="Journal navigation"><a class="edition-link" href="{base}#stories">This edition</a><a class="desktop-link" href="{base}?topic=freshwater#stories">Freshwater</a><a class="desktop-link" href="{base}?topic=reef#stories">Reef &amp; ocean</a><a class="about-link" href="{base}#about">About</a></nav></header>'''

def footer(base='./'):
    return f'''<footer class="footer wrap"><div><div class="footer-brand">A little wonder. A lot to discover.</div><p>The Aquarium Journal · A concept for The Hidden Reef, hosted by Jez237.</p></div><div class="footer-links"><a href="{base}credits.html">Photography &amp; credits</a><a href="{base}#about">Editorial note</a><a href="{base}../">Jez237 ↗</a></div></footer></body></html>'''

def img(filename, base='./', eager=False):
    p = photo_map[filename]
    return f'<img src="{base}images/{e(filename)}" alt="{e(p["alt"], quote=True)}" width="{p["width"]}" height="{p["height"]}" loading="{"eager" if eager else "lazy"}" decoding="async"{(" fetchpriority=\"high\"" if eager else "")}>'

def card(s):
    href = f'stories/{s["slug"]}/'
    return f'''<article class="story" data-category="{s['category']}"><a class="story-image" href="{href}" tabindex="-1" aria-hidden="true">{img(s['image'])}<span class="story-label">{e(s['label'])}</span></a><div class="story-meta">{e(s['kind'])}<span aria-hidden="true">·</span>{e(s['source'])}</div><h3><a href="{href}">{e(s['title'])}</a></h3><p>{e(s['dek'])}</p><a class="read-story" href="{href}" aria-label="Read {e(s['title'], quote=True)}">Read the story <span aria-hidden="true">↗</span></a><div class="source-date">Source: {e(s['date'])}</div></article>'''

def reader_template(s):
    p = photo_map[s['image']]
    credit_id = Path(s['image']).stem
    return f'''<template data-reader-template="{s['slug']}" data-path="stories/{s['slug']}/"><article class="reader-article"><header class="reader-heading"><div class="eyebrow">{e(s['label'])} / {e(s['kind'])}</div><h2 class="reader-title" tabindex="-1">{e(s['title'])}</h2><p class="reader-dek">{e(s['dek'])}</p><div class="reader-date">Source: {e(s['date'])} · Selected for the November 1 pilot edition</div></header><figure class="reader-figure">{img(s['image'], eager=True)}<figcaption>{e(s['caption'])} Photo: {e(p['author'])}. <a href="credits.html#{credit_id}" target="_blank" rel="noopener">Image credits ↗<span class="sr-only"> (opens a new tab)</span></a></figcaption></figure><div class="reader-body">{''.join('<p>'+e(t)+'</p>' for t in s['paragraphs'])}<aside class="reader-takeaway"><h3>What this means for your aquarium</h3><p>{e(s['takeaway'])}</p></aside><div class="reader-sources"><div class="eyebrow">Optional further reading</div><a href="{e(s['url'],quote=True)}" target="_blank" rel="noopener noreferrer">Original source: {e(s['source'])} ↗<span class="sr-only"> (opens a new tab)</span></a><p>You can read this entire summary here. The source link is only for exploring further.</p><small>Independent editorial summary, not an official store publication. Photos are illustrative; no inventory or endorsement is implied.</small></div></div></article></template>'''

page = head('Small worlds. Endless wonder.', 'A photo-rich freshwater and reef aquarium journal preview: conservation stories, plant inspiration and readable research summaries.')
page = page.replace('</head>', '<link rel="stylesheet" href="reader.css?v=20261101a"></head>')
page += f'''<main id="main" class="wrap"><section class="intro" aria-labelledby="journal-title"><div><div class="eyebrow">The Aquarium Journal · Pilot edition 01</div><h1 id="journal-title">Small worlds.<br><em>Endless wonder.</em></h1></div><div class="intro-note"><p>Fresh perspectives for freshwater lovers<br>and reef keepers. Stories to feed your<br>curiosity, not just your fish.</p></div></section>
<section class="cover" aria-labelledby="cover-title">{img('reef-hero.webp', eager=True)}<div class="cover-copy"><span class="eyebrow">Beyond the glass / Reef &amp; ocean</span><h2 id="cover-title">Big possibilities.<br>One small coral<br>at a time.</h2><p>A second ocean-based gene bank gives irreplaceable corals another home. A closer look at the people protecting a future for Florida’s reefs.</p><a class="button-link" href="stories/a-new-home-for-coral/">Explore the story <span aria-hidden="true">↗</span></a></div><a class="cover-credit" href="credits.html#reef-hero">Illustrative photography · View credits</a></section>
<div class="edition-strip"><div><b>Prepared November 1, 2026</b> <span>Freshwater + saltwater</span></div><div class="strip-right">Selected stories, not a live news feed</div></div>
<section id="stories" aria-labelledby="stories-title"><div class="section-head"><div><div class="eyebrow">Good things are happening underwater</div><h2 id="stories-title">In this edition</h2><p>A thoughtful mix of research, conservation and practical reading.</p></div><div class="filters" role="group" aria-label="Filter stories by aquarium type"><button type="button" class="filter" data-filter="all" aria-pressed="true" aria-controls="story-grid">All stories</button><button type="button" class="filter" data-filter="freshwater" aria-pressed="false" aria-controls="story-grid">Freshwater</button><button type="button" class="filter" data-filter="reef" aria-pressed="false" aria-controls="story-grid">Reef &amp; ocean</button></div></div><p id="story-count" class="count" role="status" aria-live="polite">All stories · 6 stories in this pilot edition</p><noscript><p>All stories are shown. Topic filtering requires JavaScript; every article can still be read below.</p></noscript><div id="story-grid" class="stories">{''.join(card(s) for s in stories)}</div></section>
<section class="interlude" aria-labelledby="interlude-title"><div class="interlude-photo">{img('planted-tank.webp')}</div><div class="interlude-copy"><div class="eyebrow">The quieter side of the hobby</div><h2 id="interlude-title">Less scrolling.<br>More looking.</h2><p>A planted aquarium is an invitation to slow down. Start with a little curiosity, a few well-chosen plants, and room to watch things grow.</p><a class="button-link" href="stories/a-greener-kind-of-aquarium/">Into the planted aquarium <span aria-hidden="true">↗</span></a></div></section>
<section class="editor-note" id="about" aria-labelledby="about-title"><div><div class="eyebrow">A note from the editor</div><h2 id="about-title">Made for curious<br>fishkeepers.</h2></div><div class="note-content"><div><h3>Useful stories. Clear sources.</h3><p>This pilot collects real, source-linked reading, with original summaries and the source dates visible. Older research and evergreen guides are labeled, not passed off as breaking news. Manufacturer claims are attributed.</p></div><div><h3>A preview, not an official publication.</h3><p>Built by Jez237 to explore a newsletter page for The Hidden Reef. Photos are illustrative, not store inventory or event photography. No daily automation, email collection, competitor promotions or stock claims are included.</p></div></div></section></main><script src="journal.js" defer></script>'''
reader = '''<dialog id="article-reader" class="article-reader" aria-labelledby="reader-title"><div class="reader-toolbar"><div><span class="eyebrow">The Aquarium Journal</span><span class="reader-toolbar-note">A little time beneath the surface.</span></div><button id="reader-close" class="reader-close" type="button" aria-label="Close article"><span>Close</span><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div><div id="reader-scroll" class="reader-scroll"><div id="reader-content"><h2 id="reader-title">Article reader</h2></div></div><div class="reader-pagination"><button id="reader-previous" type="button" aria-label="Previous story">← <span>Previous</span></button><span id="reader-position" role="status" aria-live="polite"></span><button id="reader-next" type="button" aria-label="Next story"><span>Next story</span> →</button></div></dialog>'''
page = page.replace('<script src="journal.js" defer></script>', reader + ''.join(reader_template(s) for s in stories) + '<script src="journal.js?v=reader-20261101b" defer></script>')
(OUT/'index.html').write_text(page + footer())

for index, s in enumerate(stories):
    base='../../'
    path=f'stories/{s["slug"]}/'
    p=photo_map[s['image']]
    credit_id=Path(s['image']).stem
    article=head(s['title'],s['dek'],base,path)
    article+=f'''<main id="main" class="wrap"><div class="article-top"><a class="back-link" href="{base}#stories">← Back to this edition</a></div><article><header class="article-heading"><div class="eyebrow">{e(s['label'])} / {e(s['kind'])}</div><h1>{e(s['title'])}</h1><p class="dek">{e(s['dek'])}</p><div class="source-date">Source published: {e(s['date'])}<br>Selected for this preview: November 1, 2026</div></header><figure class="article-image">{img(s['image'],base,True)}<figcaption>{e(s['caption'])} Photo: {e(p['author'])}. <a href="{base}credits.html#{credit_id}">License and image credits</a>.</figcaption></figure><div class="article-body">{''.join('<p>'+e(t)+'</p>' for t in s['paragraphs'])}<aside class="takeaway"><h2>What it means for a fishkeeper</h2><p>{e(s['takeaway'])}</p></aside><div class="source-box"><div class="eyebrow">Go a little deeper</div><p>Original source: <a href="{e(s['url'],quote=True)}" target="_blank" rel="noopener noreferrer">{e(s['source'])} ↗</a><br>Source date: {e(s['date'])}.</p><p>Original editorial summary for this independent design preview. Not a claim of store stock, independent product testing or official endorsement.</p></div><div class="article-end"><a href="{base}#stories">← All stories</a><a href="../{stories[(index+1)%len(stories)]['slug']}/">Next story →</a></div></div></article></main>'''
    folder=OUT/path
    folder.mkdir(parents=True,exist_ok=True)
    (folder/'index.html').write_text(article+footer(base))

credits=head('Photography & credits','Photography sources, attribution and reuse licenses for this independent Aquarium Journal preview.',path='credits.html')
credits+='''<main id="main" class="wrap"><div class="credits-intro"><div class="eyebrow">The people behind the pictures</div><h1>Photography &amp; credits</h1><p>These photographs illustrate the aquarium hobby. They do not depict Hidden Reef inventory, prove a species’ origin, or document the news events described in the articles.</p><p>Photographer credits and licenses are listed below. Images have been resized and converted to WebP; display layouts may crop their edges. Article text is original summary, with primary-source links on each story.</p></div><div class="credits-list">'''
for p in photos:
    credits+=f'''<article class="credit-item" id="{e(Path(p['filename']).stem)}">{img(p['filename'])}<h2>{e(p['alt'])}</h2><p>Photo by <strong>{e(p['author'])}</strong>.<br><a href="{e(p['source_url'],quote=True)}" target="_blank" rel="noopener noreferrer">Original photograph and source page ↗</a><br>License: <a href="{e(p['license_url'],quote=True)}" target="_blank" rel="noopener noreferrer">{e(p['license'])}</a><br>Changes: {e(p['changes'])}</p></article>'''
credits+='</div></main>'
(OUT/'credits.html').write_text(credits+footer())
print(f'Built index, credits, and {len(stories)} article pages with {len(photos)} attributed images.')

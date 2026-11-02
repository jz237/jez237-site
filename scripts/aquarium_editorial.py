"""Shared, escaped editorial blocks for both reader and standalone articles."""
from html import escape as e
from datetime import date
from math import ceil
import re
from urllib.parse import urlparse

# Topic tags (allow several per story) and their URL-safe filter keys.
TAGS = {'Plants': 'plants', 'Fish': 'fish', 'Shrimp & snails': 'shrimp-snails', 'Ponds': 'ponds', 'Coral': 'coral',
        'Equipment': 'equipment', 'Water care': 'water-care'}
KINDS = {'Practical guide', 'Research', 'Conservation news', 'Species profile'}
# Story shapes rotate (EDITORIAL.md). Word ranges are for the body text.
FORMATS = {
    'brief': (120, 200),      # quick news brief, no headings
    'steps': (200, 650),      # numbered step-by-step (an ordered list)
    'profile': (250, 650),    # species profile with an "At a glance" facts box
    'feature': (700, 900),    # occasional deeper feature
    'photo': (150, 650),      # single-photo story: large image, plain prose
    'qa': (200, 650),         # short Q&A: question headings
    'guide': (250, 650),      # sectioned practical guide
    'checklist': (250, 650),  # leads with a list to take away
    'report': (250, 650),     # straight prose report
    'explainer': (250, 650),  # background explainer with sections
}
FACT_LABELS = ['Adult size', 'Temperature', 'Minimum tank', 'Difficulty', 'Diet', 'Temperament']
# Fact values carry US units; the metric source value goes in the detail line.
FACT_UNITS = {'Adult size': r'\bin\b', 'Temperature': '°F', 'Minimum tank': r'\bgal'}
# 3D showroom pages a story may point to occasionally (verified on thehiddenreef.net).
SHOWROOMS = {'drum-filter', 'fluidized-sand', 'protein-skimmer', 'biowheel', 'uv-sterilizer', 'betta-bowl'}
SHOWROOM_BASE = 'https://thehiddenreef.net'
SITE = 'https://jez237.com/newsletter/'


def story_url(story):
    return f'{SITE}stories/{story["slug"]}/'


def tag_keys(story):
    return [TAGS[t] for t in story['tags']]


def tags_markup(story, tag='ul'):
    """Plain labels; the homepage filter enhances them only with JavaScript."""
    items = ''.join(f'<li>{e(t)}</li>' for t in story['tags'])
    return f'<ul class="story-tags" aria-label="Topics">{items}</ul>'


def share_markup(story):
    """Copy-link button (shown only when the Clipboard API exists) plus a visible URL fallback."""
    url = story_url(story)
    shown = url.removeprefix('https://')
    return (f'<div class="share-line" data-share-url="{e(url, quote=True)}">'
            f'<button type="button" class="copy-link" data-copy-link="{e(url, quote=True)}">Copy link</button>'
            f'<span class="share-status" role="status" aria-live="polite"></span>'
            f'<span class="share-fallback">Link: <a class="share-url" href="{e(url, quote=True)}">{e(shown)}</a></span></div>')


def showroom_markup(story, base=SHOWROOM_BASE):
    room = story.get('showroom')
    if not room:
        return ''
    href = base.rstrip('/') + room['path']
    note = f', {e(room["note"])}' if room.get('note') else ''
    return f'<p class="showroom-line">See it in 3D: <a href="{e(href, quote=True)}">{e(room["title"])}</a>{note}.</p>'


def word_count(story):
    text = []
    for block in story['blocks']:
        text.extend([block.get('title', ''), block.get('text', '')])
        text.extend(block.get('items', []))
    return len(re.findall(r"\b[\w]+(?:[’'-][\w]+)*\b", ' '.join(text)))


def reading_time(story):
    return max(1, ceil(word_count(story) / 200))


def plain_date(iso):
    """2026-11-01 -> November 1, 2026."""
    d = date.fromisoformat(iso)
    return f'{d:%B} {d.day}, {d.year}'


def background_date(story):
    """Research/background date. Every story now shows its own publication date,
    so the older "no publication date shown" qualifier is dropped from display."""
    return story['date'].replace(' · no publication date shown', '')


def related_stories(story, stories, limit=3):
    """Up to three others: same category first, then the other category, in edition order."""
    others = [s for s in stories if s['slug'] != story['slug']]
    same = [s for s in others if s['category'] == story['category']]
    rest = [s for s in others if s['category'] != story['category']]
    return (same + rest)[:limit]


def validate_facts(story):
    facts = story.get('facts')
    assert story['format'] == 'profile' and isinstance(facts, list), story['slug']
    assert [f['label'] for f in facts] == FACT_LABELS, (story['slug'], [f['label'] for f in facts])
    ids = {r['id'] for r in story['references']}
    for f in facts:
        assert f['value'] and f['refs'] and set(f['refs']) <= ids, (story['slug'], f['label'])  # sourced facts only
        if f['label'] in FACT_UNITS:
            assert re.search(FACT_UNITS[f['label']], f['value']), (story['slug'], f['label'], f['value'])


def facts_markup(story, *, reader=False):
    """Small "At a glance" box for species profiles, after the store's spec rows."""
    if not story.get('facts'):
        return ''
    prefix = ('reader-' if reader else 'article-') + story['slug']
    numbers = {ref['id']: index + 1 for index, ref in enumerate(story['references'])}
    rows = []
    for f in story['facts']:
        cites = []
        for rid in f['refs']:
            target, n = f'{prefix}-ref-{rid}', numbers[rid]
            cites.append(f'<button type="button" class="editorial-citation" data-reference="{target}" aria-label="Source {n}">{n}</button>' if reader
                         else f'<a class="editorial-citation" href="#{target}" aria-label="Source {n}">{n}</a>')
        detail = f'<span>{e(f["detail"])}</span>' if f.get('detail') else ''
        rows.append(f'<div class="glance-row"><dt>{e(f["label"])}</dt><dd><strong>{e(f["value"])}</strong>{detail}<sup class="editorial-citations">{"".join(cites)}</sup></dd></div>')
    return f'<aside class="glance-box" aria-label="At a glance"><p class="glance-title">At a glance</p><dl>{"".join(rows)}</dl></aside>'


def validate(story):
    assert re.fullmatch(r'[a-z0-9-]+', story['slug'])
    assert re.fullmatch(r'\d{4}-\d{2}-\d{2}', story['published']), story['slug']
    date.fromisoformat(story['published'])
    assert story.get('kind') in KINDS, (story['slug'], story.get('kind'))
    assert story.get('format') in FORMATS, (story['slug'], story.get('format'))
    if story['format'] == 'profile' or 'facts' in story:
        validate_facts(story)
    if story['format'] == 'qa':
        assert all(b['text'].endswith('?') for b in story['blocks'] if b['type'] == 'heading'), story['slug']
    if story['format'] == 'brief':
        assert not any(b['type'] in {'heading', 'aside'} for b in story['blocks']), story['slug']
    if story['format'] == 'steps':
        numbered = [b for b in story['blocks'] if b['type'] == 'heading' and re.match(r'\d+\. ', b['text'])]
        assert any(b['type'] == 'list' and b.get('ordered') for b in story['blocks']) or len(numbered) >= 3, story['slug']
    if 'modified' in story:
        assert date.fromisoformat(story['modified']) >= date.fromisoformat(story['published']), story['slug']
    tags = story.get('tags')
    assert isinstance(tags, list) and tags and len(tags) == len(set(tags)), story['slug']
    assert all(t in TAGS for t in tags), (story['slug'], tags)
    if 'showroom' in story:
        room = story['showroom']
        assert set(room) <= {'path', 'title', 'note'} and room['title'], story['slug']
        m = re.fullmatch(r'/showroom/([a-z0-9-]+)/', room['path'])
        assert m and m.group(1) in SHOWROOMS, (story['slug'], room['path'])
    references = story['references']
    ids = [ref['id'] for ref in references]
    assert references and len(ids) == len(set(ids)), story['slug']
    for ref in references:
        assert re.fullmatch(r'[a-zA-Z0-9_-]+', ref['id'])
        url = urlparse(ref['url'])
        assert url.scheme == 'https' and url.netloc and not url.username
        assert ref['label'] and ref['date']
    assert story['blocks'] and story['blocks'][0]['type'] == 'p'
    for block in story['blocks']:
        assert block['type'] in {'p', 'heading', 'list', 'aside'}
        assert set(block.get('refs', [])) <= set(ids)
        if block['type'] == 'list':
            assert block['items'] and all(isinstance(item, str) and item for item in block['items'])
        else:
            assert isinstance(block['text'], str) and block['text']
        if block['type'] == 'aside':
            assert block['title']


def render(story, *, reader=False, showroom_base=SHOWROOM_BASE):
    """References stay on-page; publisher links live in collapsed endnotes."""
    validate(story)
    prefix = ('reader-' if reader else 'article-') + story['slug']
    references = story['references']
    numbers = {ref['id']: index + 1 for index, ref in enumerate(references)}
    heading = 'h3' if reader else 'h2'

    def citations(block):
        links = []
        for refid in block.get('refs', []):
            target = prefix + '-ref-' + refid
            number = numbers[refid]
            if reader:
                links.append(f'<button type="button" class="editorial-citation" data-reference="{target}" aria-label="Source {number}">{number}</button>')
            else:
                links.append(f'<a class="editorial-citation" href="#{target}" aria-label="Source {number}">{number}</a>')
        return '<sup class="editorial-citations">' + ''.join(links) + '</sup>' if links else ''

    parts = []
    for index, block in enumerate(story['blocks']):
        kind = block['type']
        attrs = f'data-block-index="{index}" data-block-type="{kind}"'
        cite = citations(block)
        if kind == 'p':
            parts.append(f'<p {attrs}>{e(block["text"])}{cite}</p>')
        elif kind == 'heading':
            parts.append(f'<{heading} {attrs}>{e(block["text"])}</{heading}>')
        elif kind == 'aside':
            parts.append(f'<aside class="editorial-aside" {attrs}><h4>{e(block["title"])}</h4><p>{e(block["text"])}{cite}</p></aside>')
        else:
            tag = 'ol' if block.get('ordered', False) else 'ul'
            items = [f'<li>{e(item)}{cite if i == len(block["items"]) - 1 else ""}</li>' for i, item in enumerate(block['items'])]
            parts.append(f'<{tag} class="editorial-list" {attrs}>' + ''.join(items) + f'</{tag}>')
    body = facts_markup(story, reader=reader) + '<div class="editorial-content">' + ''.join(parts) + '</div>' + showroom_markup(story, showroom_base)
    disclosure = '' if reader else ' open'
    notes = [f'<details class="editorial-sources" id="{prefix}-sources"{disclosure}><summary>Sources &amp; editorial notes <span>{len(references)} references</span></summary><ol>']
    for ref in references:
        notes.append(f'<li id="{prefix}-ref-{ref["id"]}" tabindex="-1"><a href="{e(ref["url"], quote=True)}" target="_blank" rel="noopener noreferrer">{e(ref["label"])}<span class="sr-only"> (opens a new tab)</span></a><small>{e(ref["date"])}</small></li>')
    notes.append(f'</ol><p class="source-context">Background: {e(background_date(story))} · Published {plain_date(story["published"])}.</p><p>Original editorial writing for an independent design preview. Research and reporting dates are preserved above; earlier work is not presented as a new announcement. Product statements are attributed to their manufacturers. No store inventory or endorsement is implied.</p></details>')
    # Standalone notes start open for no-JS footnote navigation. The small shared
    # enhancement collapses them, opening the specific reference when requested.
    return body + ''.join(notes)

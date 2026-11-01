"""Shared, escaped editorial blocks for both reader and standalone articles."""
from html import escape as e
from math import ceil
import re
from urllib.parse import urlparse


def word_count(story):
    text = []
    for block in story['blocks']:
        text.extend([block.get('title', ''), block.get('text', '')])
        text.extend(block.get('items', []))
    return len(re.findall(r"\b[\w]+(?:[’'-][\w]+)*\b", ' '.join(text)))


def reading_time(story):
    return max(1, ceil(word_count(story) / 200))


def validate(story):
    assert re.fullmatch(r'[a-z0-9-]+', story['slug'])
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


def render(story, *, reader=False):
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
    body = '<div class="editorial-content">' + ''.join(parts) + '</div>'
    disclosure = '' if reader else ' open'
    notes = [f'<details class="editorial-sources" id="{prefix}-sources"{disclosure}><summary>Sources &amp; editorial notes <span>{len(references)} references</span></summary><ol>']
    for ref in references:
        notes.append(f'<li id="{prefix}-ref-{ref["id"]}" tabindex="-1"><a href="{e(ref["url"], quote=True)}" target="_blank" rel="noopener noreferrer">{e(ref["label"])}<span class="sr-only"> (opens a new tab)</span></a><small>{e(ref["date"])}</small></li>')
    notes.append(f'</ol><p class="source-context">Background: {e(story["date"])} · November 1, 2026 pilot edition.</p><p>Original editorial writing for an independent design preview. Research and reporting dates are preserved above; earlier work is not presented as a new announcement. Product statements are attributed to their manufacturers. No store inventory or endorsement is implied.</p></details>')
    # Standalone notes start open for no-JS footnote navigation. The small shared
    # enhancement collapses them, opening the specific reference when requested.
    return body + ''.join(notes)

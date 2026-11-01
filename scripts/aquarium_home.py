"""Escaped homepage checklist, intentionally readable without interaction."""
from html import escape as e

ICONS = {
    'fish': '<path d="M8 32c10-16 28-16 38 0-10 16-28 16-38 0Z"/><path d="m46 32 12-12v24Z"/><circle cx="21" cy="29" r="2"/>',
    'flow': '<path d="M8 22c8-12 16 12 24 0s16 12 24 0M8 34c8-12 16 12 24 0s16 12 24 0M8 46c8-12 16 12 24 0s16 12 24 0"/>',
    'temperature': '<path d="M24 37V15a8 8 0 0 1 16 0v22a14 14 0 1 1-16 0Z"/><path d="M32 20v26M46 20h8M46 30h8"/><circle cx="32" cy="46" r="4"/>',
    'note': '<rect x="14" y="10" width="36" height="46" rx="4"/><path d="M23 23h18M23 33h18M23 43h10"/>'
}


def checklist_markup(data):
    items = []
    for item in data['items']:
        icon = f'<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">{ICONS[item["icon"]]}</svg>'
        items.append(f'<li>{icon}<h3>{e(item["title"])}</h3><p>{e(item["text"])}</p></li>')
    sources = ''.join(f'<li><a href="{e(r["url"], quote=True)}" target="_blank" rel="noopener noreferrer">{e(r["label"])}<span class="sr-only"> (opens a new tab)</span></a><small>{e(r["date"])}</small></li>' for r in data['references'])
    return f'''<section class="daily-check" id="daily-check" aria-labelledby="check-title"><div class="check-heading"><div class="eyebrow">Keep this beside the tank / Freshwater + reef</div><h2 id="check-title">{e(data['title'])}</h2><p>{e(data['dek'])}</p></div><ol class="check-grid">{''.join(items)}</ol><p class="check-note">{e(data['note'])}</p><details class="check-sources"><summary>Checklist sources &amp; notes</summary><ul>{sources}</ul><p>Icons are original AI-assisted editorial illustrations.</p></details></section>'''

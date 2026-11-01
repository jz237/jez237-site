"""Escaped homepage checklist, intentionally readable without interaction."""
from html import escape as e


def checklist_markup(data):
    items = ''.join(f'<li>{e(item["text"])}</li>' for item in data['items'])
    sources = ''.join(f'<li><a href="{e(r["url"], quote=True)}" target="_blank" rel="noopener noreferrer">{e(r["label"])}<span class="sr-only"> (opens a new tab)</span></a><small>{e(r["date"])}</small></li>' for r in data['references'])
    return f'''<section class="daily-check" id="daily-check" aria-labelledby="check-title"><h2 id="check-title">{e(data['title'])}</h2><div class="check-body"><ol class="check-list">{items}</ol><div class="check-foot"><p class="check-note">{e(data['note'])}</p><details class="check-sources"><summary>Sources</summary><p>{e(data['source_note'])}</p><ul>{sources}</ul></details></div></div></section>'''

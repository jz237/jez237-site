#!/usr/bin/env python3
"""Gates for the daily Aquarium News story run (see newsletter/DAILY_STORY.md).

  preflight                 clean main, up to date with origin, no story already published today
  candidate SLUG "TITLE"    reject duplicate or near-duplicate slugs/titles before writing
  validate                  after editing: at most one new story, schema, tags, image licence, showroom limits
  live SLUG                 cache-busted check that the story and the index are live on jez237.com

Exit 0 = pass; 1 = stop (print says why); 2 = usage error. Prints one JSON object.
It changes nothing: no git writes, deploys or messages.
"""
from datetime import datetime
from difflib import SequenceMatcher
from pathlib import Path
from zoneinfo import ZoneInfo
import json, re, subprocess, sys, time, urllib.request

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'newsletter'
sys.path.insert(0, str(ROOT / 'scripts'))
from aquarium_editorial import validate, word_count, TAGS, SHOWROOMS, FORMATS  # noqa: E402

LICENCES = {'CC BY 4.0', 'CC BY-SA 4.0', 'CC BY 3.0', 'CC BY-SA 3.0', 'CC BY 2.0', 'CC BY-SA 2.0', 'CC0 1.0', 'Public domain'}
PHOTO_FIELDS = ['filename', 'title', 'source_url', 'author', 'license', 'license_url', 'alt', 'changes', 'width', 'height']
STOP = set('a an the and or of to for in on with your you is are not from by at as it its into before after'.split())


def today():
    return datetime.now(ZoneInfo('America/New_York')).date().isoformat()


def git(*args):
    return subprocess.run(['git', '-C', str(ROOT), *args], capture_output=True, text=True)


def done(ok, **info):
    print(json.dumps({'ok': ok, **info}, ensure_ascii=False, indent=2))
    sys.exit(0 if ok else 1)


def load(name):
    return json.loads((OUT / name).read_text())


def words(text):
    return {w for w in re.findall(r"[a-z0-9]+", text.lower()) if w not in STOP}


def origin_stories():
    r = git('show', 'origin/main:newsletter/stories.json')
    return json.loads(r.stdout) if r.returncode == 0 else []


def preflight():
    if git('rev-parse', '--abbrev-ref', 'HEAD').stdout.strip() != 'main':
        done(False, step='preflight', reason='checkout is not on main')
    if git('status', '--porcelain', '--untracked-files=no').stdout.strip():
        done(False, step='preflight', reason='tracked files are dirty; preserve them and stop')
    if git('fetch', 'origin', 'main').returncode:
        done(False, step='preflight', reason='git fetch origin main failed')
    if git('merge-base', '--is-ancestor', 'HEAD', 'origin/main').returncode:
        done(False, step='preflight', reason='local main has commits not on origin/main; inspect, never force-push')
    stories = origin_stories()
    published_today = [s['slug'] for s in stories if s['published'] == today()]
    if published_today:
        done(False, step='preflight', reason='a story is already published today (limit one per day)', today=today(), slugs=published_today)
    fresh = [s for s in stories if s['category'] == 'freshwater']
    balance = {tag: sum(tag in s.get('tags', []) for s in fresh) for tag in TAGS}
    done(True, step='preflight', today=today(), stories=len(stories), behind=git('rev-list', '--count', 'HEAD..origin/main').stdout.strip(),
         previous_format=stories[0].get('format') if stories else None, recent_formats=[s.get('format') for s in stories[:5]],
         freshwater_tag_counts=balance,
         existing=[{'slug': s['slug'], 'title': s['title'], 'tags': s.get('tags', [])} for s in stories])


def candidate(slug, title):
    stories = load('stories.json')
    problems = []
    if not re.fullmatch(r'[a-z0-9-]+', slug):
        problems.append('slug must be lowercase letters, digits and hyphens')
    if '?' in title:
        problems.append('answer-first titles do not ask questions')
    # Jez rejected fix-it troubleshooting stories (cloudy water, algae, ich and similar).
    fixit = re.search(r"\b(cloudy|milky|green) water\b|\balgae (outbreak|bloom|problem|control)|\bget rid of\b|\b(treat|cure|beat|fix|troubleshoot\w*)\b|\bich\b|white spot", (title + ' ' + slug.replace('-', ' ')).lower())
    if fixit:
        problems.append(f'fix-it troubleshooting stories are not approved ("{fixit.group(0)}")')
    new = words(title + ' ' + slug.replace('-', ' '))
    for s in stories:
        if s['slug'] == slug:
            problems.append(f'slug already exists: {slug}')
        ratio = SequenceMatcher(None, title.lower(), s['title'].lower()).ratio()
        old = words(s['title'] + ' ' + s['slug'].replace('-', ' '))
        overlap = len(new & old) / max(1, min(len(new), len(old)))
        if ratio >= 0.6 or overlap >= 0.6:
            problems.append(f'too close to "{s["title"]}" ({s["slug"]}): similarity {ratio:.2f}, word overlap {overlap:.2f}')
    done(not problems, step='candidate', slug=slug, title=title, problems=problems)


def validate_edition():
    stories, photos, drawings = load('stories.json'), load('photo-credits.json'), load('illustrations.json')
    before = {s['slug'] for s in origin_stories()}
    new = [s for s in stories if s['slug'] not in before]
    problems = []
    if len(new) > 1:
        problems.append(f'{len(new)} new stories; publish at most one per day')
    if len({s['slug'] for s in stories}) != len(stories):
        problems.append('duplicate slugs')
    photo_map = {p['filename']: p for p in photos}
    drawing_map = {d['filename']: d for d in drawings}
    for s in new:
        try:
            validate(s)
        except AssertionError as exc:
            problems.append(f'{s["slug"]}: schema check failed {exc}')
        if s['published'] != today():
            problems.append(f'{s["slug"]}: published must be today ({today()})')
        if '?' in s['title'] or '?' in s['dek']:
            problems.append(f'{s["slug"]}: question in title/dek; give the answer first')
        n = word_count(s)
        lo, hi = FORMATS.get(s.get('format'), (250, 650))
        if not lo <= n <= hi:
            problems.append(f'{s["slug"]}: {n} words; a {s.get("format")} runs {lo}-{hi}')
        if len(s['references']) < (1 if s.get('format') == 'brief' else 2):
            problems.append(f'{s["slug"]}: too few references')
        if stories and stories[0]['slug'] != s['slug']:
            problems.append(f'{s["slug"]}: the new story goes first (newest first)')
        prev = next((o for o in stories if o['slug'] != s['slug']), None)
        if prev and prev.get('format') == s.get('format'):
            problems.append(f'{s["slug"]}: same format as the previous story ({prev.get("format")}); pick another shape')
        if any(b['type'] == 'aside' for b in s['blocks']) and sum(any(b['type'] == 'aside' for b in o['blocks']) for o in stories[:6]) > 1:
            problems.append(f'{s["slug"]}: sidebar box used recently; leave it out')
        texts = [s['title'], s['dek']] + [x for b in s['blocks'] for x in [b.get('text', '')] + b.get('items', [])]
        for text in texts:
            for sentence in re.split(r'(?<=[.!?])\s+', text):
                if re.search(r'\b\d[\d.,]*[- ]?(?:liters?|litres?|L|°C|cm|mm|milliliters?|ml)\b', sentence) and not re.search(r'gallons?|gal\b|°F|inch|\bin\b|fluid ounces?|feet', sentence):
                    problems.append(f'{s["slug"]}: metric value without US units: {sentence[:80]}')
        if 'verification_notes' in s:
            problems.append(f'{s["slug"]}: private verification_notes must not be published')
        if not set(s.get('tags', [])) <= set(TAGS) or not s.get('tags'):
            problems.append(f'{s["slug"]}: tags must be from {list(TAGS)}')
        if s.get('archive') is None and s['kind'] == 'Research':
            problems.append(f'{s["slug"]}: Research stories must set archive true/false explicitly')
        for key in ['image', 'diagram']:
            name = s.get(key)
            if not name:
                continue
            if not (OUT / 'images' / name).is_file():
                problems.append(f'{s["slug"]}: missing image file {name}')
            if name.endswith('.svg'):
                d = drawing_map.get(name)
                if not d or not d.get('caption') or not d.get('sources'):
                    problems.append(f'{s["slug"]}: diagram {name} needs an illustrations.json record with caption and sources')
            else:
                p = photo_map.get(name)
                missing = [f for f in PHOTO_FIELDS if not (p or {}).get(f)]
                if missing:
                    problems.append(f'{s["slug"]}: photo {name} credit record missing {missing}')
                elif p['license'] not in LICENCES or not p['license_url'].startswith('https://') or not p['source_url'].startswith('https://'):
                    problems.append(f'{s["slug"]}: photo {name} licence {p["license"]!r} is not on the allowed list {sorted(LICENCES)}')
    fresh = [s for s in stories if s['category'] == 'freshwater']
    if fresh and sum(s['tags'][0] == 'Plants' for s in fresh) > 0.4 * len(fresh):
        problems.append('plant stories dominate freshwater coverage; choose fish, shrimp, snails or ponds')
    from collections import Counter
    uses = Counter([s['image'] for s in stories] + [s['diagram'] for s in stories if s.get('diagram')])
    for name, n in uses.items():
        if n > 1:
            problems.append(f'{name} is used on {n} stories; every story needs its own image')
    rooms = [s for s in stories if s.get('showroom')]
    if len(rooms) > max(3, len(stories) // 4):
        problems.append(f'{len(rooms)} showroom links; keep them occasional')
    if new and new[0].get('showroom') and sum(1 for s in stories[:8] if s.get('showroom')) > 2:
        problems.append('three or more of the newest stories carry showroom links; skip it this time')
    for s in rooms:
        if s['showroom']['path'].strip('/').split('/')[-1] not in SHOWROOMS:
            problems.append(f'{s["slug"]}: unknown showroom {s["showroom"]["path"]}')
    done(not problems, step='validate', today=today(), new=[s['slug'] for s in new], stories=len(stories), problems=problems)


def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'aquarium-news-daily-check', 'Cache-Control': 'no-cache'})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status, r.read().decode('utf-8', 'replace')


def live(slug):
    story = next((s for s in load('stories.json') if s['slug'] == slug), None)
    if not story:
        done(False, step='live', reason=f'{slug} is not in the local stories.json')
    cb = f'cb={int(time.time())}'
    base = 'https://jez237.com/newsletter/'
    checks, problems = {}, []
    for label, url, needle in [('story', f'{base}stories/{slug}/?{cb}', story['title']),
                               ('index', f'{base}?{cb}', f'stories/{slug}/'),
                               ('manifest', f'{base}stories.json?{cb}', f'"slug": "{slug}"'),
                               ('sitemap', f'https://jez237.com/sitemap.xml?{cb}', f'newsletter/stories/{slug}/')]:
        try:
            status, body = fetch(url)
        except Exception as exc:  # noqa: BLE001
            status, body = None, str(exc)
        from html import escape
        ok = status == 200 and (needle in body or escape(needle) in body)
        checks[label] = {'url': url, 'status': status, 'contains': ok}
        if not ok:
            problems.append(f'{label}: status {status}, expected text present={needle in body}')
    done(not problems, step='live', slug=slug, url=f'{base}stories/{slug}/', title=story['title'], checks=checks, problems=problems)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a[:1] == ['preflight'] and len(a) == 1:
        preflight()
    elif a[:1] == ['candidate'] and len(a) == 3:
        candidate(a[1], a[2])
    elif a[:1] == ['validate'] and len(a) == 1:
        validate_edition()
    elif a[:1] == ['live'] and len(a) == 2:
        live(a[1])
    print(__doc__)
    sys.exit(2)

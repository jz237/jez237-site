#!/usr/bin/env python3
"""Local regression checks for the Aquarium Journal (requires Playwright)."""
import argparse
from pathlib import Path
import functools
import http.server
import json
import re
import threading
from urllib.parse import urljoin, urlparse, unquote
from html.parser import HTMLParser
from PIL import Image
from playwright.sync_api import sync_playwright
import sys
sys.path.insert(0,str(Path(__file__).resolve().parent))
from aquarium_editorial import plain_date, related_stories, TAGS

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--output', type=Path, required=True)
parser.add_argument('--base-url', default='')
args = parser.parse_args()
args.output.mkdir(parents=True, exist_ok=True)

class Links(HTMLParser):
    def __init__(self):
        super().__init__(); self.paths=[]; self.ids=[]
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        for name in ('href','src'):
            if name in a:self.paths.append(a[name])

stories = json.loads((ROOT/'newsletter/stories.json').read_text())
photos = json.loads((ROOT/'newsletter/photo-credits.json').read_text())
assert len(stories)>=6 and len({s['slug'] for s in stories})==len(stories)
category_counts={c:sum(s['category']==c for s in stories) for c in ['freshwater','reef']}
for photo in photos:
    with Image.open(ROOT/'newsletter/images'/photo['filename']) as image:
        assert image.size==(photo['width'],photo['height'])
        assert image.format=='WEBP'
    assert photo['author'] and photo['license'] and photo['license_url'].startswith('https://')
sitemap=(ROOT/'sitemap.xml').read_text()
robots=(ROOT/'robots.txt').read_text()
assert 'Allow: /' in robots and 'Disallow: /newsletter' not in robots
for file in (ROOT/'newsletter').rglob('*.html'):
    parsed=Links();parsed.feed(file.read_text())
    assert len(parsed.ids)==len(set(parsed.ids)), f'Duplicate IDs in {file}'
    html=file.read_text()
    # Aquarium News is indexable on jez237.com: no noindex, a canonical URL, a sitemap entry,
    # and the visible independent-preview note stays.
    assert 'noindex' not in html, file
    assert 'Aquarium Journal' not in html and 'aquarium journal' not in html.lower(), file
    assert 'Independent design preview for The Hidden Reef' in html, file
    canonical=re.search(r'<link rel="canonical" href="([^"]+)"',html).group(1)
    rel=file.relative_to(ROOT).as_posix().removesuffix('index.html')
    assert canonical=='https://jez237.com/'+rel, (file,canonical)
    assert f'<loc>{canonical}</loc><lastmod>' in sitemap, canonical
    assert '· Aquarium News</title>' in html and 'content="Aquarium News"' in html, file
    for link in parsed.paths:
        url=urlparse(link)
        if url.scheme or url.netloc:continue
        assert not link.startswith('/'), f'Root-absolute link: {link}'
        target=file if not url.path else (file.parent/unquote(url.path)).resolve()
        if target.is_dir():target=target/'index.html'
        assert target.is_file(), f'Missing {link} from {file}'
        if url.fragment and target.suffix=='.html':
            other=Links();other.feed(target.read_text());assert url.fragment in other.ids, (file,link)
for url in re.findall(r'url\([\'"]?([^\)\'\"]+)',(ROOT/'newsletter/journal.css').read_text()):
    assert (ROOT/'newsletter'/url).resolve().is_file(), url
assert 'newsletter/' in (ROOT/'assets/side-menu.js').read_text()
assert 'href="newsletter/"' in (ROOT/'index.html').read_text()

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self,format,*args):pass
server=None
if args.base_url:base=args.base_url.rstrip('/')
else:
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(QuietHandler,directory=str(ROOT)))
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{server.server_port}'
results={'base':base,'stories':len(stories),'photos':len(photos),'checks':[]}
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox'])
        page=browser.new_page(viewport={'width':1440,'height':1000},device_scale_factor=1)
        errors=[];bad=[]
        page.on('pageerror',lambda x: errors.append(str(x)))
        page.on('console',lambda msg: errors.append(msg.text) if msg.type=='error' else None)
        page.on('response',lambda r:bad.append([r.status,r.url]) if r.status>=400 and urlparse(r.url).netloc==urlparse(base).netloc else None)
        response=page.goto(base+'/newsletter/',wait_until='networkidle');assert response is not None and response.status==200
        page.evaluate("document.querySelectorAll('img').forEach(i=>i.loading='eager')")
        # Await actual decoding without eval-based polling (strict live CSP).
        page.evaluate("Promise.all(Array.from(document.images).map(i=>i.decode()))")
        assert page.evaluate("Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0)")
        page.locator('.story').last.scroll_into_view_if_needed()
        page.wait_for_timeout(250)
        page.evaluate('window.scrollTo(0,0)')
        page.wait_for_timeout(150)
        assert page.locator('.story:visible').count()==len(stories)
        assert page.locator('h1').inner_text()=='Small worlds.\nEndless wonder.'
        newest=max(s['published'] for s in stories)
        assert page.locator('.updated-line time').get_attribute('datetime')==newest
        assert page.locator('.updated-line').inner_text()=='Updated '+plain_date(newest)
        assert page.locator('.updated-line').evaluate('(e)=>e.getBoundingClientRect().top')<400
        assert page.locator('.story .story-date').count()==len(stories)
        assert page.locator('.story .story-date').all_inner_texts()==[plain_date(s['published']) for s in stories]
        assert page.locator('.brand small').inner_text().lower()=='aquarium news · a concept'
        assert page.locator('#daily-check .check-list > li').count()==4
        assert page.locator('#daily-check .check-list > li:visible').count()==4
        assert page.locator('.story .source-date').count()==0
        assert page.locator('.cover .button-link').get_attribute('href')=='stories/'+stories[0]['slug']+'/'
        page.screenshot(path=str(args.output/'desktop.png'),full_page=True)
        page.screenshot(path=str(args.output/'desktop-top.png'))
        page.get_by_role('button',name='Freshwater',exact=True).click()
        assert page.locator('.story:visible').count()==category_counts['freshwater']
        assert page.locator('.story:visible').evaluate_all("els=>els.every(e=>e.dataset.category==='freshwater')")
        assert '?topic=freshwater' in page.url
        page.reload(wait_until='networkidle');assert page.locator('.story:visible').count()==category_counts['freshwater']
        page.get_by_role('button',name='Reef & ocean',exact=True).click()
        assert page.locator('.story:visible').count()==category_counts['reef']
        assert page.locator('.story:visible').evaluate_all("els=>els.every(e=>e.dataset.category==='reef')")
        button=page.get_by_role('button',name='All stories',exact=True);button.focus();page.keyboard.press('Enter')
        assert page.locator('.story:visible').count()==len(stories)
        assert '?topic=' not in page.url
        results['checks'].append('desktop filters, URL persistence and keyboard activation')
        # Topic tags combine with the aquarium-type filter.
        for name,key in TAGS.items():
            page.get_by_role('button',name=name,exact=True).click()
            expected=[s['slug'] for s in stories if name in s['tags']]
            assert page.locator('.story:visible').count()==len(expected),(name,expected)
            assert f'tag={key}' in page.url
            for cat in ['freshwater','reef']:
                page.locator(f'[data-filter="{cat}"]').click()
                both=[s for s in stories if name in s['tags'] and s['category']==cat]
                assert page.locator('.story:visible').count()==len(both),(name,cat)
                assert str(len(both)) in page.locator('#story-count').inner_text()
            page.locator('[data-filter="all"]').click()
        page.goto(base+'/newsletter/?topic=freshwater&tag=plants',wait_until='networkidle')
        plants=[s for s in stories if 'Plants' in s['tags'] and s['category']=='freshwater']
        assert page.locator('.story:visible').count()==len(plants)
        assert page.locator('[data-tag-filter="plants"]').get_attribute('aria-pressed')=='true'
        page.locator('[data-tag-filter="all"]').click();page.locator('[data-filter="all"]').click()
        assert page.locator('.story:visible').count()==len(stories) and '?' not in page.url.split('/newsletter/')[1]
        assert page.locator('.story .story-tags li').count()==sum(len(s['tags']) for s in stories)
        results['checks'].append('topic tag filter alone and combined with Freshwater/Reef, with URL persistence')
        for width in [320,390,768,1440]:
            page.set_viewport_size({'width':width,'height':844})
            page.goto(base+'/newsletter/',wait_until='networkidle')
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'Overflow at {width}'
            if width==390:
                page.evaluate("document.querySelectorAll('img').forEach(i=>i.loading='eager')")
                # Await actual decoding without eval-based polling (strict live CSP).
                page.evaluate("Promise.all(Array.from(document.images).map(i=>i.decode()))")
                assert page.evaluate("Array.from(document.images).every(i=>i.complete&&i.naturalWidth>0)")
                page.locator('.story').last.scroll_into_view_if_needed()
                page.wait_for_timeout(250)
                page.evaluate('window.scrollTo(0,0)')
                page.wait_for_timeout(150)
                page.screenshot(path=str(args.output/'mobile.png'),full_page=True)
                page.screenshot(path=str(args.output/'mobile-top.png'))
        results['checks'].append('no horizontal overflow at 320, 390, 768, 1440 pixels')
        page.set_viewport_size({'width':390,'height':844})
        for story in stories:
            r=page.goto(base+'/newsletter/stories/'+story['slug']+'/',wait_until='networkidle');assert r is not None and r.status==200
            assert page.locator('h1').inner_text()==story['title']
            assert page.locator('.editorial-sources li a').evaluate_all('(a)=>a.map(e=>e.getAttribute("href"))')==[ref['url'] for ref in story['references']]
            assert page.locator('.editorial-content [data-block-index]').count()==len(story['blocks'])
            assert not page.locator('.editorial-sources').evaluate('(e)=>e.open')
            article_url=page.url
            page.locator('.editorial-citation').first.click()
            assert page.url==article_url
            assert page.locator('.editorial-sources').evaluate('(e)=>e.open')
            page.locator('.editorial-sources summary').click()
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
            assert page.locator('.article-image img').evaluate('(i)=>i.complete&&i.naturalWidth>0')
            assert plain_date(story['published']) in page.locator('.editorial-byline').inner_text()
            assert page.locator('.article-heading .story-tags li').all_inner_texts()==story['tags']
            assert page.locator('.copy-link').is_visible() and not page.locator('.share-fallback').is_visible()
            if story.get('showroom'):
                line=page.locator('.showroom-line')
                assert line.count()==1 and line.locator('a').get_attribute('href')=='https://thehiddenreef.net'+story['showroom']['path']
                assert line.evaluate('(e)=>getComputedStyle(e).backgroundColor')=='rgba(0, 0, 0, 0)'
                assert line.evaluate('(e)=>e.getBoundingClientRect().height')<70
            else:
                assert page.locator('.showroom-line').count()==0
            expected=[r['slug'] for r in related_stories(story,stories)]
            hrefs=page.locator('.related-stories a').evaluate_all('(a)=>a.map(e=>e.getAttribute("href"))')
            assert hrefs==[f'../{slug}/' for slug in expected],(story['slug'],hrefs)
        results['checks'].append(f'{len(stories)} article routes, primary sources and images on mobile')
        r=page.goto(base+'/newsletter/credits.html',wait_until='networkidle');assert r is not None and r.status==200
        assert page.locator('.credit-item').count()==len(photos)
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        results['checks'].append('all image credit entries rendered')
        page.goto(base+'/newsletter/?topic=not-a-category',wait_until='networkidle')
        assert page.locator('.story:visible').count()==len(stories)
        results['checks'].append('invalid topic safely falls back to all stories')
        nojs=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844})
        np=nojs.new_page();np.goto(base+'/newsletter/',wait_until='networkidle');assert np.locator('.story').count()==len(stories)
        assert np.locator('noscript').is_visible()
        assert np.locator('#daily-check .check-list > li:visible').count()==4
        assert np.locator('.story-tags').first.is_visible()
        sp=nojs.new_page();sp.goto(base+'/newsletter/stories/'+stories[0]['slug']+'/',wait_until='networkidle')
        assert sp.locator('.share-url').is_visible() and not sp.locator('.copy-link').is_visible()
        assert sp.locator('.share-url').get_attribute('href')=='https://jez237.com/newsletter/stories/'+stories[0]['slug']+'/'
        results['checks'].append('readable without JavaScript; tags show as labels and the story link shows as a plain URL')
        # Copy link writes the standalone URL; without the Clipboard API the visible URL is shown instead.
        cc=browser.new_context(viewport={'width':1280,'height':900})
        cc.grant_permissions(['clipboard-read','clipboard-write'],origin=base)
        cp=cc.new_page();cp.goto(base+'/newsletter/stories/'+stories[1]['slug']+'/',wait_until='networkidle')
        cp.locator('.copy-link').click()
        cp.wait_for_function("document.querySelector('.share-status').textContent==='Link copied'")
        assert cp.evaluate('navigator.clipboard.readText()')=='https://jez237.com/newsletter/stories/'+stories[1]['slug']+'/'
        cc.close()
        fc=browser.new_context(viewport={'width':390,'height':844})
        fc.add_init_script("Object.defineProperty(navigator,'clipboard',{value:undefined,configurable:true})")
        fp=fc.new_page();fp.goto(base+'/newsletter/stories/'+stories[1]['slug']+'/',wait_until='networkidle')
        assert not fp.locator('.copy-link').is_visible() and fp.locator('.share-url').is_visible()
        fc.close()
        results['checks'].append('copy link copies the standalone URL; visible URL fallback without the Clipboard API')
        assert not errors, errors
        assert not bad, bad
        results['console_errors']=errors;results['failed_same_origin_responses']=bad
        browser.close()
    def luminance(color):
        values=[int(color[i:i+2],16)/255 for i in (0,2,4)]
        values=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in values]
        return sum(a*b for a,b in zip(values,[.2126,.7152,.0722]))
    results['text_contrast']={}
    for name,fg,bg in [('body','183c35','f6f5ee'),('muted','55675f','f6f5ee'),('panel','55675f','e7ece2'),('preview','f2f1e7','183c35')]:
        a,b=sorted([luminance(fg),luminance(bg)])
        ratio=(b+.05)/(a+.05);assert ratio>=4.5,(name,ratio)
        results['text_contrast'][name]=round(ratio,2)
    results['status']='passed'
    (args.output/'results.json').write_text(json.dumps(results,indent=2))
    print(json.dumps(results,indent=2))
finally:
    if server:server.shutdown()

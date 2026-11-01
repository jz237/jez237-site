#!/usr/bin/env python3
"""Exercise the real on-page reader locally or against its deployed site."""
from pathlib import Path
import argparse, functools, http.server, json, threading
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--output',type=Path,required=True);p.add_argument('--base-url',default='');args=p.parse_args()
args.output.mkdir(parents=True,exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,format,*args):pass
server=None
if args.base_url:base=args.base_url.rstrip('/')
else:
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
    threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
stories=json.loads((ROOT/'newsletter/stories.json').read_text())
results={'base':base,'checks':[]}
try:
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox'])
        page=browser.new_page(viewport={'width':1440,'height':1000})
        errors=[];failed=[]
        page.on('pageerror',lambda x:errors.append(str(x)))
        page.on('console',lambda x:errors.append(x.text) if x.type=='error' else None)
        page.on('response',lambda r:failed.append([r.status,r.url]) if r.status>=400 and urlparse(r.url).netloc==urlparse(base).netloc else None)
        def wait_open():
            page.wait_for_function("document.getElementById('article-reader').open")
            page.wait_for_function("document.querySelector('.reader-figure img').complete&&document.querySelector('.reader-figure img').naturalWidth>0")
        def wait_closed():
            page.wait_for_function("!document.getElementById('article-reader').open&&!history.state?.aquariumJournalReader")
            page.evaluate('()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))')
            assert page.evaluate("getComputedStyle(document.body).position")!='fixed'
        page.goto(base+'/newsletter/',wait_until='networkidle');page.evaluate('document.fonts.ready')
        assert page.locator('dialog[open]').count()==0
        for i,story in enumerate(stories):
            link=page.locator('.story h3 a').nth(i)
            link.evaluate("e=>e.scrollIntoView({block:'center',behavior:'instant'})");page.wait_for_timeout(100)
            y=page.evaluate('scrollY');url=page.url
            link.click();wait_open()
            assert page.url==url
            assert page.locator('#reader-title').inner_text()==story['title']
            blocks=page.locator('#reader-content [data-block-index]')
            assert blocks.count()==len(story['blocks'])
            for n,block in enumerate(story['blocks']):
                actual=blocks.nth(n).text_content()
                for text in block.get('items',[block.get('text','')]):
                    assert text in actual,(story['slug'],n)
            notes=page.locator('#reader-content .editorial-sources')
            assert not notes.evaluate('(e)=>e.open')
            assert notes.locator('li a').evaluate_all('(links)=>links.map(a=>a.getAttribute("href"))')==[r['url'] for r in story['references']]
            assert notes.locator('li a').evaluate_all('(links)=>links.every(a=>a.target==="_blank")')
            page.locator('#reader-content .editorial-citation').first.click()
            assert notes.evaluate('(e)=>e.open') and page.url==url
            assert page.evaluate("document.activeElement.matches('.editorial-sources li')")
            notes.locator('summary').click()
            assert not notes.evaluate('(e)=>e.open')
            # Cloudflare may inject a hidden challenge frame outside the reader.
            assert page.locator('#article-reader iframe').count()==0
            assert page.evaluate("getComputedStyle(document.body).position")=='fixed'
            page.locator('#reader-close').click();wait_closed()
            assert abs(page.evaluate('scrollY')-y)<=2,(i,y,page.evaluate('scrollY'))
            assert link.evaluate('(e)=>document.activeElement===e')
        results['checks'].append('all complete article bodies match their editorial blocks; quiet endnotes and on-page citations work; close restores exact scroll/focus')
        # First hero link and final feature link use the same reader.
        page.locator('.cover .button-link').click();wait_open()
        assert page.locator('#reader-title').inner_text()==stories[0]['title']
        for _ in range(30):
            page.keyboard.press('Tab')
            assert page.evaluate("document.getElementById('article-reader').contains(document.activeElement)")
        page.keyboard.press('Escape');wait_closed()
        page.locator('.interlude .button-link').click();wait_open()
        assert page.locator('#reader-title').inner_text()==next(s['title'] for s in stories if s['slug']=='a-new-home-for-coral')
        page.locator('#reader-close').click();wait_closed()
        results['checks'].append('practical hero and conservation feature links; native modal keyboard containment and Escape')
        # Browser back closes the reader; forward reopens it without a page navigation.
        page.locator('.story h3 a').first.click();wait_open();url=page.url
        page.go_back();wait_closed();assert page.url==url
        page.go_forward();wait_open();assert page.url==url
        page.locator('#reader-close').click();wait_closed()
        results['checks'].append('browser Back closes and Forward restores the reader on the same URL')
        # Pagination follows the active filter, not hidden stories.
        page.get_by_role('button',name='Freshwater',exact=True).click()
        titles=page.locator('.story:visible h3 a').all_text_contents()
        page.locator('.story:visible h3 a').first.click();wait_open()
        assert page.locator('#reader-position').inner_text()==f'1 of {len(titles)}'
        assert page.locator('#reader-previous').is_disabled()
        page.locator('#reader-scroll').evaluate('(e)=>e.scrollTop=e.scrollHeight')
        page.locator('#reader-next').click()
        assert page.locator('#reader-title').inner_text()==titles[1]
        assert page.locator('#reader-scroll').evaluate('(e)=>e.scrollTop')==0
        for index in range(2,len(titles)):
            page.locator('#reader-next').click()
            assert page.locator('#reader-title').inner_text()==titles[index]
        assert page.locator('#reader-next').is_disabled()
        page.locator('#reader-previous').click()
        assert page.locator('#reader-title').inner_text()==titles[-2]
        page.locator('#reader-close').click();wait_closed()
        assert page.locator('.story:visible').count()==len(titles) and 'topic=freshwater' in page.url
        results['checks'].append('previous/next constrained to visible category, pagination boundaries and per-story scroll reset')
        page.get_by_role('button',name='All stories',exact=True).click()
        page.locator('.story h3 a').nth(1).click();wait_open()
        page.screenshot(path=str(args.output/'reader-desktop.png'))
        page.locator('#reader-scroll').evaluate('(e)=>e.scrollTop=e.scrollHeight')
        page.screenshot(path=str(args.output/'reader-desktop-body.png'))
        # Backdrop closes; clicks inside the article do not.
        page.locator('.reader-body .editorial-content>p').first.click()
        assert page.locator('#article-reader').evaluate('(e)=>e.open')
        page.mouse.click(8,8);wait_closed()
        results['checks'].append('backdrop dismissal without accidental inside-click dismissal')
        for width in [320,390,768]:
            page.set_viewport_size({'width':width,'height':844})
            page.goto(base+'/newsletter/',wait_until='networkidle')
            page.locator('.story h3 a').nth(2).click();wait_open()
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
            assert page.locator('#reader-scroll').evaluate('(e)=>e.scrollWidth<=e.clientWidth')
            rect=page.locator('#article-reader').bounding_box();assert rect and rect['x']>=0 and rect['width']<=width and rect['height']<=844
            if width==390:
                page.screenshot(path=str(args.output/'reader-mobile.png'))
                page.locator('#reader-scroll').evaluate('(e)=>e.scrollTop=e.scrollHeight')
                page.screenshot(path=str(args.output/'reader-mobile-body.png'))
            page.locator('#reader-close').click();wait_closed()
        results['checks'].append('reader fits at 320/390/768px with no horizontal overflow, fixed reachable Close and internal scrolling')
        # Rapid repeat interactions must not leave the page locked or an old close event active.
        for _ in range(5):
            page.locator('.story h3 a').first.click();wait_open()
            page.locator('#reader-close').click();wait_closed()
        results['checks'].append('five rapid open/close cycles leave scrolling unlocked')
        nojs=browser.new_context(java_script_enabled=False)
        np=nojs.new_page();np.goto(base+'/newsletter/',wait_until='networkidle')
        np.locator('.story h3 a').first.click();np.wait_for_url('**/stories/'+stories[0]['slug']+'/')
        assert np.locator('h1').inner_text()==stories[0]['title']
        assert np.locator('.editorial-sources').evaluate('(e)=>e.open')
        np.locator('.editorial-citation').first.click()
        assert '#article-'+stories[0]['slug']+'-ref-' in np.url
        assert np.locator('.editorial-sources li').first.is_visible()
        results['checks'].append('without JavaScript, complete local articles and reference anchors still work')
        assert not errors,errors
        assert not failed,failed
        results['console_errors']=errors;results['failed_same_origin_responses']=failed;results['status']='passed'
        browser.close()
    (args.output/'results.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
finally:
    if server:server.shutdown()

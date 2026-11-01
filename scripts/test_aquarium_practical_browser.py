#!/usr/bin/env python3
"""Verify practical content, diagram geometry and new photos in real browsers."""
from pathlib import Path
import argparse,functools,http.server,json,threading
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('--base-url',default='');p.add_argument('--output',type=Path,required=True);args=p.parse_args();args.output.mkdir(parents=True,exist_ok=True)
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,format,*args):pass
server=None
if args.base_url:base=args.base_url.rstrip('/')
else:
    server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
    threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
stories=json.loads((ROOT/'newsletter/stories.json').read_text());check=json.loads((ROOT/'newsletter/checklist.json').read_text())
results={'base':base,'widths':[],'illustrated_articles':[]}
try:
    with sync_playwright() as pw:
        browser=pw.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox'])
        page=browser.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('console',lambda e:errors.append(e.text) if e.type=='error' else None)
        for width in [320,390,768,1440]:
            page.set_viewport_size({'width':width,'height':900})
            page.goto(base+'/newsletter/',wait_until='networkidle')
            for item in check['items']:
                assert item['text'] in page.locator('#daily-check').inner_text()
            assert page.locator('#daily-check svg').count()==0
            # Keep the checklist a compact note rather than a full-width feature block.
            height=page.locator('#daily-check').evaluate('(e)=>e.getBoundingClientRect().height')
            assert height<={320:680,390:600,768:520,1440:340}[width],(width,height)
            results.setdefault('checklist_heights',{})[width]=round(height)
            assert page.locator('#daily-check details').evaluate('(e)=>!e.open')
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
            if width in [390,1440]:
                page.locator('#daily-check').screenshot(path=str(args.output/f'checklist-{width}.png'))
            for s in stories:
                if not s.get('diagram') and not s['image'].endswith('.svg'):continue
                page.locator(f'.story h3 a[href="stories/{s["slug"]}/"]').click()
                page.wait_for_function("document.querySelector('#article-reader').open")
                diagram=page.locator('#reader-content img[src$=".svg"]')
                diagram.scroll_into_view_if_needed()
                diagram.evaluate('(i)=>i.decode()')
                assert diagram.evaluate('(i)=>Math.abs(i.getBoundingClientRect().width/i.getBoundingClientRect().height-i.naturalWidth/i.naturalHeight)<.015')
                assert diagram.evaluate('(i)=>getComputedStyle(i).objectFit')=='contain'
                assert page.locator('#reader-scroll').evaluate('(e)=>e.scrollWidth<=e.clientWidth')
                if width in [390,1440]:
                    page.screenshot(path=str(args.output/f'{s["slug"]}-{width}.png'))
                page.locator('#reader-close').click()
                page.wait_for_function("!document.querySelector('#article-reader').open&&!history.state?.aquariumJournalReader")
            results['widths'].append(width)
        for image in ['lionfish.webp','duncan-coral.webp']:
            response=page.request.get(base+'/newsletter/images/'+image);assert response.status==200
        results['illustrated_articles']=[s['slug'] for s in stories if s.get('diagram') or s['image'].endswith('.svg')]
        results['console_errors']=errors;assert not errors,errors
        browser.close()
    results['status']='passed';(args.output/'results.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
finally:
    if server:server.shutdown()

"""Real-GPU smoke checks. Requires Python Playwright and a graphical Chrome.

python3 source/browser-release-check.py --url http://127.0.0.1:4174/ --tour
Keep the dedicated browser focused: the game intentionally pauses on blur.
The optional tour uses the ordinary 1x demo, with no state or clock overrides.
"""
import argparse
import json
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--url', default='http://127.0.0.1:4174/')
parser.add_argument('--chrome', default='/usr/bin/google-chrome')
parser.add_argument('--output', default='/tmp/after-storm-release')
parser.add_argument('--tour', action='store_true')
args = parser.parse_args()
base = args.url.rstrip('/') + '/'
out = Path(args.output)
out.mkdir(parents=True, exist_ok=True)
report = {'checks': [], 'errors': [], 'failedRequests': []}

def record(name, state):
    report['checks'].append({'name': name, 'state': state})
    (out / 'browser.json').write_text(json.dumps(report, indent=2))
    print(json.dumps({'check': name, 'state': state}), flush=True)

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=args.chrome, headless=False,
        args=['--no-sandbox', '--use-angle=gl', '--disable-software-rasterizer'])
    def new_page():
        page = browser.new_page(viewport={'width': 1280, 'height': 720})
        page.set_default_timeout(90000)
        page.on('pageerror', lambda e: report['errors'].append(str(e)))
        page.on('response', lambda r: report['failedRequests'].append([r.status, r.url])
            if r.status >= 400 and r.url.startswith(base) and not r.url.endswith('favicon.ico') else None)
        return page

    page = new_page()
    page.goto(base + 'race.html?qa', wait_until='domcontentloaded')
    page.wait_for_function('() => !!window.__stormQA')
    page.locator('#sound').uncheck()
    page.locator('#quality').select_option('low')
    page.locator('[data-mode="versus"]').click()
    page.locator('#seaState').select_option('calm')
    page.locator('#start').click()
    page.locator('#sea').focus()
    page.keyboard.down('w')
    page.keyboard.down('ArrowUp')
    page.wait_for_timeout(10000)
    state = page.evaluate('window.__stormQA.snapshot()')
    assert state['mode'] == 'versus' and len(state['racers']) == 2
    assert all(r['speed'] > 5 for r in state['racers'])
    page.keyboard.down('a')
    page.keyboard.down('ArrowRight')
    page.wait_for_timeout(400)
    steering = page.evaluate('window.__stormQA.snapshot()')
    assert steering['racers'][0]['turn'] > .3 and steering['racers'][1]['turn'] < -.3
    for key in ['w', 'ArrowUp', 'a', 'ArrowRight']:
        page.keyboard.up(key)
    page.screenshot(path=str(out / 'split-screen.png'))
    record('two independent players, low quality', steering)
    page.close()

    page = new_page()
    page.goto(base, wait_until='domcontentloaded')
    page.wait_for_function('() => !!window.afterTheStorm && !document.querySelector("#start").disabled')
    page.locator('#quality').select_option('medium')
    page.locator('#sound').uncheck()
    page.locator('#start').click()
    page.locator('#sea').focus()
    before = page.evaluate('window.afterTheStorm.snapshot()')
    page.keyboard.down('w')
    page.wait_for_timeout(7000)
    page.keyboard.up('w')
    state = page.evaluate('window.afterTheStorm.snapshot()')
    assert state['mode'] == 'playing' and state['speed'] > 3
    assert abs(state['z'] - before['z']) > 15
    page.locator('#pause').click()
    t = page.evaluate('window.afterTheStorm.snapshot().time')
    page.wait_for_timeout(500)
    assert t == page.evaluate('window.afterTheStorm.snapshot().time')
    page.locator('#start').click()
    page.screenshot(path=str(out / 'salvage.png'))
    record('salvage movement and pause with shared water', state)
    page.close()

    page = new_page()
    page.route('**/assets/terrain/**', lambda route: route.abort())
    page.route('**/assets/*-lod.*', lambda route: route.abort())
    page.goto(base + 'race.html?qa', wait_until='domcontentloaded')
    page.wait_for_function('() => !!window.__stormQA')
    page.locator('#sound').uncheck()
    page.locator('#quality').select_option('low')
    page.locator('#start').click()
    page.locator('#sea').focus()
    page.keyboard.down('w')
    page.wait_for_timeout(7000)
    page.keyboard.up('w')
    state = page.evaluate('window.__stormQA.snapshot()')
    assert state['phase'] == 'running' and state['racers'][0]['speed'] > 3
    record('optional terrain and LOD download failure retains playability', state)
    page.close()

    if args.tour:
        page = new_page()
        page.goto(base + 'race.html?qa', wait_until='domcontentloaded')
        page.wait_for_function('() => !!window.__stormQA')
        page.locator('#sound').uncheck()
        page.locator('#quality').select_option('auto')
        page.locator('#demoStart').click()
        started = time.monotonic()
        current = None
        samples = []
        transitions = []
        while time.monotonic() - started < 2100:
            page.wait_for_timeout(1000)
            state = page.evaluate('window.__stormQA.snapshot()')
            assert state['demo'] and state['phase'] != 'paused'
            assert not state['racers'][0]['dq']
            assert not (state.get('demoPilot') or {}).get('rescues', 0)
            if state['demoIndex'] != current:
                if current is not None:
                    last = samples[-1]
                    if last['mode'] == 'race':
                        assert last['racers'][0]['lap'] > 1, 'demo timed out without a physical lap'
                    else:
                        assert last['phase'] == 'results' and last['racers'][0]['rings'] >= 14
                    record('natural demo scene ' + str(current), {
                        'course': samples[-1]['course'], 'last': samples[-1],
                        'fpsSamples': [s['fps'] for s in samples[8:]],
                        'wallSeconds': time.monotonic() - started})
                current = state['demoIndex']
                transitions.append(current)
                samples = []
                if current == 11:
                    break
            samples.append(state)
            if len(samples) == 12:
                page.screenshot(path=str(out / ('tour-%02d-%s.png' % (current, state['course']))))
        assert transitions == list(range(12)), transitions
        record('complete uninterrupted 1x eleven-scene demo loop', transitions)
        page.close()
    browser.close()
assert not report['errors'], report['errors']
assert not report['failedRequests'], report['failedRequests']
record('release browser checks passed', True)

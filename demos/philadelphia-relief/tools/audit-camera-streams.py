"""Manual public YouTube audit; no browser runtime polling, API keys, or video downloads.

Run before refreshing the camera catalog. --discover also lists current Philadelphia
search results and the Kensington publisher's live listings. Candidates still need
location/provider verification before adding them to the map.
"""
import concurrent.futures
import json
from pathlib import Path
import re
import sys
from urllib.parse import quote
from urllib.request import Request, urlopen


def page_json(url, variable):
    with urlopen(Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=20) as response:
        html = response.read(8_000_000).decode('utf-8')
    match = re.search(r'var ' + variable + r'\s*=\s*', html)
    if not match:
        raise ValueError('Public metadata unavailable')
    return json.JSONDecoder().raw_decode(html[match.end():])[0]


def check(camera):
    try:
        data = page_json('https://www.youtube.com/watch?v=' + camera['video'], 'ytInitialPlayerResponse')
        status = data.get('playabilityStatus', {})
        live = data.get('microformat', {}).get('playerMicroformatRenderer', {}).get('liveBroadcastDetails', {})
        good = status.get('status') == 'OK' and live.get('isLiveNow') is True
        return {'id': camera['id'], 'video': camera['video'], 'live': good,
                'embeddable': status.get('playableInEmbed', False),
                'title': data.get('videoDetails', {}).get('title'),
                'reason': status.get('reason')}
    except Exception as error:
        return {'id': camera['id'], 'live': False, 'reason': str(error)}


def candidates(value):
    if isinstance(value, dict):
        if 'videoRenderer' in value:
            item = value['videoRenderer']
            yield {'video': item.get('videoId'), 'title': item.get('title')}
        if 'lockupViewModel' in value:
            item = value['lockupViewModel']
            if '"LIVE"' in json.dumps(item.get('contentImage', {})):
                yield {'video': item.get('contentId'),
                       'title': item.get('metadata', {}).get('lockupMetadataViewModel', {}).get('title')}
        for child in value.values():
            yield from candidates(child)
    elif isinstance(value, list):
        for child in value:
            yield from candidates(child)


if __name__ == '__main__':
    catalog = json.loads((Path(__file__).resolve().parent.parent / 'data/discovered-cameras.json').read_text(encoding='utf-8'))
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        results = list(pool.map(check, [p for p in catalog['cameras'] if p.get('video')]))
    for result in results:
        print(json.dumps(result))
    if '--discover' in sys.argv:
        urls = ['https://www.youtube.com/channel/UCQ-V0JYSv1Ulme_daroQk7Q/streams',
                'https://www.youtube.com/results?search_query=' + quote('Philadelphia webcam live') + '&sp=EgJAAQ%253D%253D']
        for url in urls:
            try:
                for candidate in candidates(page_json(url, 'ytInitialData')):
                    print(json.dumps({'candidate': candidate}))
            except Exception as error:
                print(json.dumps({'discoveryError': str(error)}))
    sys.exit(0 if all(p['live'] and p['embeddable'] for p in results) else 1)

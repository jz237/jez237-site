#!/usr/bin/env python3
"""Rehydrate legacy GitHub Pages video URLs from checksum-pinned R2 objects.

GitHub Pages cannot issue HTTP redirects for binary URLs. These deployment-only
copies preserve previously shared links without returning media to Git history.
Never call this when preparing a Cloudflare Pages payload.
"""
import argparse
import concurrent.futures
import hashlib
import json
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen

def restore(row, destination):
    relative = Path(row['path'])
    if relative.is_absolute() or '..' in relative.parts:
        raise ValueError('Unsafe manifest path')
    if urlparse(row['url']).netloc != 'media.jez237.com':
        raise ValueError('Unexpected media origin')
    target = destination / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    temporary = target.with_name(target.name + '.partial')
    checksum = hashlib.sha256()
    size = 0
    try:
        request = Request(row['url'], headers={'User-Agent': 'Jez237-Media-Deployment/1.0 (+https://github.com/jz237)'})
        with urlopen(request, timeout=120) as source, temporary.open('wb') as output:
            while data := source.read(1024 * 1024):
                output.write(data)
                checksum.update(data)
                size += len(data)
        if size != row['size'] or checksum.hexdigest() != row['sha256']:
            raise ValueError('R2 checksum mismatch: ' + row['path'])
        temporary.replace(target)
    finally:
        temporary.unlink(missing_ok=True)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('destination', type=Path)
    parser.add_argument('--manifest', type=Path, default=Path('media-r2-manifest.json'))
    args = parser.parse_args()
    rows = [row for row in json.loads(args.manifest.read_text())['objects']
            if Path(row['path']).suffix in {'.mp4', '.webm', '.mov'}]
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        list(pool.map(lambda row: restore(row, args.destination), rows))
    print(f'Verified {len(rows)} deployment-only legacy videos ({sum(r["size"] for r in rows)} bytes).')

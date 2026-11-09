#!/usr/bin/env python3
"""GitHub-only routing stubs and a conservative, uncompressed Pages budget.

Never run against the repository or a Cloudflare payload. Games/demos remain
untouched in Git and on jez237.com; only the disposable mirror contains stubs.
"""
import argparse
import html
import json
from pathlib import Path, PurePosixPath
import subprocess
from urllib.parse import quote

ORIGIN = 'https://jez237.com'
PREFIX = '/jez237-site/'
SECTIONS = ('games/', 'demos/')
# Leave room below GitHub's 1 GB limit for tar/zip headers and future additions.
MAX_PAYLOAD_BYTES = 900_000_000


def canonical(path):
    if path.endswith('/index.html'):
        path = path[:-10]
    return ORIGIN + '/' + quote(path, safe='/')


def redirect_page(path):
    target = canonical(path)
    escaped = html.escape(target, quote=True)
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Open on Jez237</title><link rel="canonical" href="{escaped}">
<script>location.replace({json.dumps(target)} + location.search + location.hash);</script>
<noscript><meta http-equiv="refresh" content="0;url={escaped}"></noscript>
</head><body><p><a href="{escaped}">Open this page on jez237.com</a></p></body></html>
'''


def fallback_script():
    # Only omitted interactive sections are forwarded; unrelated 404s stay 404s.
    return r'''<script id="pages-mirror-routing">
(() => {
  const prefix = '/jez237-site/';
  if (!location.pathname.startsWith(prefix)) return;
  const path = location.pathname.slice(prefix.length);
  if (/^(games|demos)(\/|$)/.test(path)) {
    location.replace('https://jez237.com/' + path + location.search + location.hash);
  }
})();
</script>'''


def retirement_worker():
    # An old offline-first worker may otherwise keep showing the cached game.
    # Do not clear origin-wide caches or touch unrelated app registrations.
    return r'''// GitHub mirror only: retire this game's old offline shell.
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil((async () => {
  const scope = self.registration.scope;
  await self.registration.unregister();
  for (const client of await self.clients.matchAll({type: 'window', includeUncontrolled: true})) {
    if (!client.url.startsWith(scope)) continue;
    const url = new URL(client.url);
    const prefix = '/jez237-site/';
    if (!url.pathname.startsWith(prefix)) continue;
    const path = url.pathname.slice(prefix.length);
    if (/^(games|demos)\//.test(path)) {
      await client.navigate('https://jez237.com/' + path + url.search + url.hash);
    }
  }
})()));
'''


def prepare_routes(destination, paths):
    destination = Path(destination)
    if not destination.is_dir() or (destination / '.git').exists():
        raise ValueError('Destination must be an existing disposable payload, not a repository')
    if any((destination / name).exists() for name in ('games', 'demos')):
        raise ValueError('Exclude games/demos from staging first; refusing to overwrite content')
    redirects = workers = 0
    for path in paths:
        relative = PurePosixPath(path)
        if relative.is_absolute() or '..' in relative.parts:
            raise ValueError('Unsafe tracked path')
        if not path.startswith(SECTIONS):
            continue
        if relative.suffix.lower() in {'.html', '.htm'}:
            content = redirect_page(path)
            redirects += 1
        elif relative.name in {'sw.js', 'service-worker.js', 'serviceworker.js'}:
            content = retirement_worker()
            workers += 1
        else:
            continue
        target = destination / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content)
    not_found = destination / '404.html'
    content = not_found.read_text()
    if '<head>' not in content or 'pages-mirror-routing' in content:
        raise ValueError('Expected an unmodified 404 page with a head element')
    not_found.write_text(content.replace('<head>', '<head>\n' + fallback_script(), 1))
    return {'redirect_pages': redirects, 'retired_workers': workers}


def check_size(destination, limit=MAX_PAYLOAD_BYTES):
    destination = Path(destination)
    if not destination.is_dir() or (destination / '.git').exists():
        raise ValueError('Destination must be a staged payload')
    total = count = 0
    largest = []
    for path in destination.rglob('*'):
        if path.is_symlink():
            raise ValueError(f'Symlinks are not allowed in the Pages payload: {path}')
        if path.is_file():
            size = path.stat().st_size
            total += size
            count += 1
            largest.append((size, str(path.relative_to(destination))))
    if count == 0:
        raise ValueError('Empty Pages payload')
    # GNU tar can use extended headers for long paths. Budget 2 KiB per file
    # as well as final archive padding, before upload-pages adds its zip wrapper.
    estimated_archive = total + count * 2048 + 10240
    if estimated_archive > limit:
        top = ', '.join(f'{p}: {s:,}' for s, p in sorted(largest, reverse=True)[:10])
        raise ValueError(f'Pages payload exceeds {limit:,}-byte budget: '
                         f'{total:,} file bytes, {estimated_archive:,} with header reserve. '
                         f'Largest files: {top}. Move media off the mirror; do not raise the limit.')
    return {'file_bytes': total, 'files': count, 'bytes_with_header_reserve': estimated_archive,
            'limit_bytes': limit}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['routes', 'check'])
    parser.add_argument('destination', type=Path)
    args = parser.parse_args()
    try:
        if args.action == 'routes':
            paths = subprocess.check_output(['git', 'ls-tree', '-rz', '--name-only', 'HEAD',
                                             '--', 'games', 'demos']).decode().split('\0')
            result = prepare_routes(args.destination, filter(None, paths))
        else:
            result = check_size(args.destination)
        print(json.dumps(result, indent=2))
    except (ValueError, OSError) as error:
        parser.exit(1, f'{error}\n')


if __name__ == '__main__':
    main()

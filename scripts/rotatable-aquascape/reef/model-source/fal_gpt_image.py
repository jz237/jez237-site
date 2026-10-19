"""fal queue helper for GPT Image 2 reference plates (text-to-image or edit).

FAL_KEY comes from the environment, or from ~/.claude.json mcpServers.*.env.
The key is sent only as a request header; it is never printed or written.
Each saved image appends its endpoint, request id and prompt to
references/fal-requests.json for provenance.

  python fal_gpt_image.py --prompt-file p.txt --out references/x.png --width 1536 --height 1024
  python fal_gpt_image.py --edit --ref references/x.png --prompt-file e.txt --out references/x-skin.png
"""
import argparse, base64, json, os, subprocess, sys, time, urllib.request, urllib.error
from datetime import datetime, timezone
from pathlib import Path

LOG = Path(__file__).resolve().parent / 'references' / 'fal-requests.json'

def load_key():
    if os.environ.get('FAL_KEY'):
        return os.environ['FAL_KEY']
    config = Path.home() / '.claude.json'
    if config.exists():
        for server in json.loads(config.read_text(encoding='utf-8')).get('mcpServers', {}).values():
            if isinstance(server, dict) and 'FAL_KEY' in server.get('env', {}):
                return server['env']['FAL_KEY']
    raise SystemExit('FAL_KEY is not set')

def request(url, key, payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, method='POST' if data else 'GET')
    req.add_header('Authorization', f'Key {key}')
    req.add_header('Content-Type', 'application/json')
    try:
        with urllib.request.urlopen(req, timeout=180) as response:
            return response.status, json.loads(response.read().decode() or '{}')
    except urllib.error.HTTPError as error:
        body = error.read().decode(errors='replace')
        try:
            return error.code, json.loads(body)
        except ValueError:
            return error.code, {'raw': body[:2000]}

def download(url, out):
    # Some Windows Python installs lack the CDN's issuer certificate; curl uses
    # the operating system store. The CDN URL carries no credentials.
    subprocess.run(['curl', '-sSfL', '--max-time', '180', '-o', out, url], check=True)

def data_uri(path):
    mime = 'image/png' if path.lower().endswith('.png') else 'image/jpeg'
    return f'data:{mime};base64,' + base64.b64encode(Path(path).read_bytes()).decode()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--edit', action='store_true')
    parser.add_argument('--ref', action='append', default=[])
    parser.add_argument('--mask')
    parser.add_argument('--prompt-file', required=True)
    parser.add_argument('--out', required=True)
    parser.add_argument('--width', type=int)
    parser.add_argument('--height', type=int)
    parser.add_argument('--quality', default='high')
    parser.add_argument('--recover', help='request id of a completed generation to download again')
    args = parser.parse_args()
    key = load_key()
    endpoint = 'openai/gpt-image-2/edit' if args.edit else 'openai/gpt-image-2'
    prompt = Path(args.prompt_file).read_text(encoding='utf-8').strip()
    payload = {'prompt': prompt, 'num_images': 1, 'quality': args.quality, 'output_format': 'png'}
    payload['image_size'] = {'width': args.width, 'height': args.height} if args.width else 'auto' if args.edit else 'landscape_4_3'
    if args.edit:
        payload['image_urls'] = [data_uri(p) for p in args.ref]
        if args.mask:
            payload['mask_url'] = data_uri(args.mask)
    base = f'https://queue.fal.run/{endpoint}'
    if args.recover:
        # Fetch a finished request again instead of paying for a new one.
        body = {'request_id': args.recover}
    else:
        status, body = request(base, key, payload)
        if status >= 400:
            print('submit failed', status, json.dumps(body)[:2000]); sys.exit(1)
    request_id = body['request_id']
    # Queue status/result routes use the model id without its subpath.
    model = '/'.join(endpoint.split('/')[:2])
    status_url = body.get('status_url') or f'https://queue.fal.run/{model}/requests/{request_id}/status'
    response_url = body.get('response_url') or f'https://queue.fal.run/{model}/requests/{request_id}'
    print('queued', request_id, flush=True)
    started = time.time()
    while True:
        time.sleep(4)
        status, body = request(status_url, key)
        if body.get('status') == 'COMPLETED':
            break
        if body.get('status') in ('FAILED', 'ERROR') or status >= 400:
            print('failed', status, json.dumps(body)[:2000]); sys.exit(1)
        if time.time() - started > 900:
            print('timeout'); sys.exit(1)
    status, result = request(response_url, key)
    images = result.get('images') or []
    if not images:
        print('no images', json.dumps(result)[:2000]); sys.exit(1)
    download(images[0]['url'], args.out)
    log = json.loads(LOG.read_text(encoding='utf-8')) if LOG.exists() else []
    log.append({'saved': Path(args.out).name, 'endpoint': endpoint, 'request_id': request_id,
                'created': datetime.now(timezone.utc).isoformat(timespec='seconds'),
                'quality': args.quality,
                'references': [Path(p).name for p in args.ref], 'mask': Path(args.mask).name if args.mask else None,
                'prompt': prompt})
    LOG.write_text(json.dumps(log, indent=1) + '\n', encoding='utf-8', newline='\n')
    print('saved', args.out, images[0].get('width'), images[0].get('height'), f'{time.time() - started:.0f}s')

if __name__ == '__main__':
    main()

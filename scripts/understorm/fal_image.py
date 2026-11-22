"""Generate one image with fal (FLUX 1.1 pro ultra) and save it as PNG. Shared by Understorm 2026 and Starling 2026.

Usage as a tool:   python fal_image.py <out.png> <aspect, e.g. 21:9 or 16:9 or 1:1> "<prompt>" [--seed N]
Usage from Python: from fal_image import generate; generate(prompt, out_path, aspect='21:9', seed=None)
The key is read from the FAL_KEY environment variable (or the Windows user environment) and is never printed or
stored. Prompts describe original scenes only and carry no personal or project details.
"""
import json, os, subprocess, sys, time, urllib.request, urllib.error

MODEL = 'fal-ai/flux-pro/v1.1-ultra'


def key():
    v = os.environ.get('FAL_KEY', '').strip()
    if not v:
        v = subprocess.run(['powershell', '-NoProfile', '-Command', "[Environment]::GetEnvironmentVariable('FAL_KEY','User')"], capture_output=True, text=True).stdout.strip()
    assert len(v) > 20, 'no FAL_KEY in the environment'
    return v


def generate(prompt, out, aspect='21:9', seed=None, tries=4):
    body = {'prompt': prompt, 'aspect_ratio': aspect, 'num_images': 1, 'output_format': 'png', 'safety_tolerance': '2', 'enable_safety_checker': True}
    if seed is not None:
        body['seed'] = seed
    k = key()
    for i in range(tries):
        req = urllib.request.Request('https://fal.run/' + MODEL, data=json.dumps(body).encode(), method='POST', headers={'Authorization': 'Key ' + k, 'Content-Type': 'application/json'})
        try:
            with urllib.request.urlopen(req, timeout=300) as r:
                d = json.loads(r.read())
            img = d['images'][0]
            os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
            with urllib.request.urlopen(img['url'], timeout=180) as r, open(out, 'wb') as f:
                f.write(r.read())
            return img.get('width'), img.get('height'), d.get('seed')
        except urllib.error.HTTPError as e:
            msg = e.read()[:300].decode('utf-8', 'replace')
            if e.code in (429, 500, 502, 503, 504) and i < tries - 1:
                time.sleep(5 + 8 * i); continue
            raise RuntimeError(f'{e.code} {msg}')
        except (urllib.error.URLError, TimeoutError):
            if i < tries - 1:
                time.sleep(5 + 8 * i); continue
            raise


if __name__ == '__main__':
    a = sys.argv[1:]
    seed = int(a[a.index('--seed') + 1]) if '--seed' in a else None
    print(generate(a[2], a[0], a[1], seed))

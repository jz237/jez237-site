"""Refresh the operating feature's asset chain so warm browsers receive releases."""
from pathlib import Path
import hashlib
import re

root = Path(__file__).resolve().parents[2]
app = root / 'demos/apx9-bee'

def version(path):
    return hashlib.sha256((app / path).read_bytes()).hexdigest()[:12]

def update(path, pattern, replacement):
    target = app / path
    text, count = re.subn(pattern, replacement, target.read_text())
    if count != 1:
        raise SystemExit(f'Expected exactly one asset reference in {path}; found {count}')
    target.write_text(text)

update('js/operate.js', r"css/operate\.css(?:\?v=[^']+)?", f"css/operate.css?v={version('css/operate.css')}")
update('js/operate.js', r"\./flower\.js(?:\?v=[^']+)?", f"./flower.js?v={version('js/flower.js')}")
update('js/main.js', r"\./operate\.js(?:\?v=[^']+)?", f"./operate.js?v={version('js/operate.js')}")
update('index.html', r'js/main\.js(?:\?v=[^\"]+)?', f"js/main.js?v={version('js/main.js')}")
print('Versioned operating CSS, flower, operations and entry module.')

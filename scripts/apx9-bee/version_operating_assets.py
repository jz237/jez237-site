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
update('js/operate.js', r"\./systems\.js(?:\?v=[^']+)?", f"./systems.js?v={version('js/systems.js')}")
# Version dependencies before their importing modules, ending at the HTML entry.
for path, ref, source in [
    ('js/assemblies/flight.js', './flight-servo.js', 'js/assemblies/flight-servo.js'),
    ('js/ui.js', './data.js', 'js/data.js'),
    ('js/ui.js', './panels.js', 'js/panels.js'),
    ('js/main.js', './select.js', 'js/select.js'),
    ('js/main.js', './mechanisms.js', 'js/mechanisms.js'),
    ('js/main.js', './operate.js', 'js/operate.js'),
    ('js/main.js', './ui.js', 'js/ui.js'),
    ('js/main.js', './assemblies/flight.js', 'js/assemblies/flight.js'),
    ('index.html', 'js/main.js', 'js/main.js'),
]:
    update(path, re.escape(ref) + r"(?:\?v=[^'\"]+)?", ref + '?v=' + version(source))
print('Versioned Systems, X-ray mechanics, tour and entry asset chains.')

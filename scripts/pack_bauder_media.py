"""Pack the Bauder demo's original media for Pages while preserving its photo URLs."""
import hashlib
import json
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1]).resolve()
destination = root / "demos" / "bauder-signs" / "media"
destination.mkdir(parents=True, exist_ok=True)
manifest = {}
packed_types = {".jpg", ".jpeg", ".webp", ".png", ".gif", ".woff2"}
limit = 8 * 1024 * 1024
buffer = bytearray()
entries = []


def write_pack():
    if not entries:
        return
    name = hashlib.sha256(buffer).hexdigest()[:16] + ".bin"
    (destination / name).write_bytes(buffer)
    for key, start, length in entries:
        manifest[key] = [name, start, length]
    buffer.clear()
    entries.clear()


# The input is the public runtime tree. Video stays a native static asset for seeking.
for path in sorted(source.rglob("*")):
    if path.suffix.lower() not in packed_types or not path.is_file():
        continue
    data = path.read_bytes()
    if len(buffer) + len(data) > limit:
        write_pack()
    entries.append((path.relative_to(source).as_posix(), len(buffer), len(data)))
    buffer.extend(data)
write_pack()
(root / "shared" / "bauder-signs-media.json").write_text(
    json.dumps(manifest, separators=(",", ":"), ensure_ascii=True) + "\n", encoding="utf-8"
)
print(f"Packed {len(manifest)} image and font files.")

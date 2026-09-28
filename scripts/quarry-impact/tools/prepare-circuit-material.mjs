// Explicit development download of free CC0 photographs; never used at runtime.
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const source = 'https://polyhaven.com/a/asphalt_02';
// Checksums from https://api.polyhaven.com/files/asphalt_02, September 28, 2026.
const files = [
  ['circuit_asphalt_diff.jpg', '2k', 'diff', '336af399fd98a39ab986d8b3bf73b4ff'],
  ['circuit_asphalt_nor_gl.jpg', '2k', 'nor_gl', '77ebd1cc0b020ccaa1c6b58f103d1f75'],
  ['circuit_asphalt_rough.jpg', '1k', 'rough', 'ec80a2929797c1b3ffc121c4f665585a'],
];
const manifestPath = root + 'public/assets/manifest.json';
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
// Aerial Asphalt 01's old scale string says 15x15 M, but the current asset page
// and numeric dimensions both specify 30 m. Preserve that ambiguity explicitly.
for (const entry of manifest.filter(record => /^asphalt_(diff|nor_gl|rough)\.jpg$/.test(record.file))) {
  entry.scale_metres = 30;
  entry.scale_record = { source: 'https://api.polyhaven.com/info/aerial_asphalt_01',
    dimensions_mm: [30000, 30000], legacy_scale: '15x15 M',
    decision: 'Current numeric dimensions and asset page agree on 30 m. The circuit uses diffuse only for macro variation.' };
}
for (const [file, resolution, channel, expected] of files) {
  const url = `https://dl.polyhaven.org/file/ph-assets/Textures/jpg/${resolution}/asphalt_02/asphalt_02_${channel}_${resolution}.jpg`;
  const path = root + 'public/assets/' + file;
  let data;
  try { data = await fs.readFile(path); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (!data) {
    const response = await fetch(url, { signal: AbortSignal.timeout(120000) });
    if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`);
    data = Buffer.from(await response.arrayBuffer());
  }
  if (createHash('md5').update(data).digest('hex') !== expected)
    throw new Error(`${file}: official source checksum changed; review before replacing`);
  await fs.writeFile(path, data);
  const record = { file, source, author: 'Rob Tuytel', url, license: 'CC0-1.0',
    bytes: data.length, sha256: createHash('sha256').update(data).digest('hex'), source_md5: expected,
    scale_metres: 3, resolution, notes: 'Original downloaded JPEG; no image transformation.' };
  const index = manifest.findIndex(entry => entry.file === file);
  if (index < 0) manifest.push(record); else manifest[index] = record;
  console.log(`${file}: ${data.length} bytes, verified`);
}
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

// Explicit development download of free CC0 photographs; never used by gameplay.
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const source = 'https://polyhaven.com/a/forrest_ground_03';
const files = [
  ['north_litter_diff.jpg', '2k', 'diff', '605bfa541b0d406bcf88a16a8c82b821'],
  ['north_litter_nor_gl.jpg', '1k', 'nor_gl', '9f44096b43a0f796ae6f52d7fe784698'],
  ['north_litter_rough.jpg', '1k', 'rough', '99b60c4ba1dc799e8eddf6e2f1460c09'],
];
const manifestPath = root + 'public/assets/manifest.json';
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
for (const [file, resolution, channel, expected] of files) {
  const url = `https://dl.polyhaven.org/file/ph-assets/Textures/jpg/${resolution}/forrest_ground_03/forrest_ground_03_${channel}_${resolution}.jpg`;
  const path = root + 'public/assets/' + file;
  let data;
  try { data = await fs.readFile(path); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (!data) {
    const response = await fetch(url, { headers: { 'User-Agent': 'QuarryImpact/1.0 (local CC0 asset authoring)' } });
    if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`);
    data = Buffer.from(await response.arrayBuffer());
  }
  if (createHash('md5').update(data).digest('hex') !== expected)
    throw new Error(`${file}: official source checksum changed; review before replacing`);
  await fs.writeFile(path, data);
  const record = { file, source, author: 'Rob Tuytel', url, license: 'CC0-1.0',
    bytes: data.length, sha256: createHash('sha256').update(data).digest('hex'), source_md5: expected,
    scale_metres: 2, resolution, notes: 'Original downloaded JPEG; no image transformation.' };
  const index = manifest.findIndex(entry => entry.file === file);
  if (index < 0) manifest.push(record); else manifest[index] = record;
  console.log(`${file}: ${data.length} bytes, verified`);
}
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

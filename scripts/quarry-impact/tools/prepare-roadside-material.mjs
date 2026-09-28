// Explicit development download; never invoked by builds or gameplay.
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const source = 'https://polyhaven.com/a/rock_ground';
const files = [
  ['scree_diff.jpg', '2k', 'diff', '755dba4b148e8a9ceb6a0abd50d3f0e3'],
  ['scree_nor_gl.jpg', '2k', 'nor_gl', '585ebc43db21b612c342e1b26d289be3'],
  ['scree_rough.jpg', '1k', 'rough', '67be099b9edb59d2fcb3377c5fccbf88'],
];
const manifestPath = root + 'public/assets/manifest.json';
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
for (const [file, resolution, channel, expected] of files) {
  const url = `https://dl.polyhaven.org/file/ph-assets/Textures/jpg/${resolution}/rock_ground/rock_ground_${channel}_${resolution}.jpg`;
  const path = root + 'public/assets/' + file;
  let data;
  try { data = await fs.readFile(path); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (!data) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`);
    data = Buffer.from(await response.arrayBuffer());
  }
  if (createHash('md5').update(data).digest('hex') !== expected) throw new Error(`${file}: source checksum differs; inspect before replacing`);
  await fs.writeFile(path, data);
  const entry = { file, source, author:'Rob Tuytel', url, license:'CC0-1.0',
    sha256:createHash('sha256').update(data).digest('hex'), source_md5:expected,
    scale_metres:1.5, resolution, notes:'Original downloaded JPEG; no image transformation.' };
  const index = manifest.findIndex(record => record.file === file);
  if (index < 0) manifest.push(entry); else manifest[index] = entry;
  console.log(`${file}: ${data.length} bytes, verified`);
}
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

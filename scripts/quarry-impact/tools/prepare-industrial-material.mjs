// Explicit, optional development download. Never called during builds/gameplay.
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const source = 'https://polyhaven.com/a/corrugated_iron_02';
const files = [
  ['cladding_diff.jpg', '2k', 'diff', '88f0ec0310e41f408dd0092c8c53db58'],
  ['cladding_nor_gl.jpg', '1k', 'nor_gl', 'e3a9b41f29a5dee9f0835bddb440efbd'],
  ['cladding_arm.jpg', '1k', 'arm', '58d9a11932fae9f85d4cbcde4700abb2'],
];
const manifestPath = root + 'public/assets/manifest.json';
const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
for (const [file, resolution, channel, expected] of files) {
  const url = `https://dl.polyhaven.org/file/ph-assets/Textures/jpg/${resolution}/corrugated_iron_02/corrugated_iron_02_${channel}_${resolution}.jpg`;
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
  const entry = {file, source, url, license:'CC0-1.0', sha256:createHash('sha256').update(data).digest('hex'), source_md5:expected,
    scale_metres:2.7, resolution, notes:channel==='arm'?'Packed ambient occlusion, roughness and metallic channels.':'Original downloaded JPEG; no image transformation.'};
  const index = manifest.findIndex(record => record.file === file);
  if (index < 0) manifest.push(entry); else manifest[index] = entry;
  console.log(`${file}: ${data.length} bytes, verified`);
}
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

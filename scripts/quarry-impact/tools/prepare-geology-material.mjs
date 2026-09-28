// Explicit development restoration of original CC0 maps. Never called by gameplay.
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = 'https://polyhaven.com/a/rock_face_03';
const infoURL = 'https://api.polyhaven.com/info/rock_face_03';
const filesURL = 'https://api.polyhaven.com/files/rock_face_03';
// Pinned official file checksums verified September 28, 2026. Source changes
// require review; never silently replace accepted photography with new bytes.
const required = [
  ['geology_rock_diff.jpg', 'Diffuse', '2k', '657add9e8a8dffaeed19bdfc58078b59'],
  ['geology_rock_nor_gl.jpg', 'nor_gl', '2k', '279b33e71ae6275cafa24e6597024c98'],
  ['geology_rock_rough.jpg', 'Rough', '1k', 'bbb2c7dafde3f81808fa7404d4527a56'],
];
const hash = (algorithm, data) => createHash(algorithm).update(data).digest('hex');
async function getJSON(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response.json();
}

export async function prepareGeologyMaterial(projectRoot = root) {
  const [info, files] = await Promise.all([getJSON(infoURL), getJSON(filesURL)]);
  if (!Array.isArray(info.dimensions) || info.dimensions.some(value => Math.abs(value / 1000 - 2.7) > 0.0001))
    throw new Error('Rock Face 03 physical dimensions changed; review before preparing maps');
  const manifestPath = path.join(projectRoot, 'public/assets/manifest.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  const records = await Promise.all(required.map(async ([file, channel, resolution, expected]) => {
    const official = files[channel]?.[resolution]?.jpg;
    if (!official || official.md5 !== expected || !official.url.startsWith('https://dl.polyhaven.org/file/ph-assets/'))
      throw new Error(`${file}: official source record changed; review before replacing`);
    const target = path.join(projectRoot, 'public/assets', file);
    let data;
    try { data = await fs.readFile(target); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (!data) {
      const response = await fetch(official.url, { signal: AbortSignal.timeout(120000) });
      if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`);
      data = Buffer.from(await response.arrayBuffer());
    }
    if (data.length !== official.size || hash('md5', data) !== expected)
      throw new Error(`${file}: byte count or original source checksum mismatch`);
    // Preserve the exact original JPEG bytes. No resizing, color conversion,
    // synthetic detail, channel repacking or image re-encoding is performed.
    await fs.writeFile(target, data);
    return {
      file, source, authors: info.authors, url: official.url, license: 'CC0-1.0',
      license_url: 'https://polyhaven.com/license', bytes: data.length,
      sha256: hash('sha256', data), source_md5: expected, scale_metres: 2.7,
      source_dimensions_mm: info.dimensions, scale_source: infoURL,
      checksums_source: filesURL, source_files_hash: info.files_hash,
      resolution, generator: 'tools/prepare-geology-material.mjs',
      notes: 'Original downloaded JPEG; no image transformation. OpenGL normal and roughness remain linear material data.',
    };
  }));
  for (const record of records) {
    const index = manifest.findIndex(entry => entry.file === record.file);
    if (index < 0) manifest.push(record); else manifest[index] = record;
  }
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  return records;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const records = await prepareGeologyMaterial();
  console.log(JSON.stringify({ files: records.map(({ file, bytes, sha256 }) => ({ file, bytes, sha256 })),
    totalBytes: records.reduce((sum, record) => sum + record.bytes, 0) }, null, 2));
}

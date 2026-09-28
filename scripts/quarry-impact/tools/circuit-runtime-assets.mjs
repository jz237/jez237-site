// Read-only provenance checks shared by performance, lifecycle and live QA.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
export async function circuitRuntimeAssetPlan({ historical = false } = {}) {
  if (historical) return [];
  const manifestPath = 'public/assets/manifest.json';
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  const records = ['diff', 'nor_gl', 'rough'].map(channel => {
    const name = `circuit_asphalt_${channel}.jpg`, record = manifest.find(asset => asset.file === name);
    assert.ok(record, `Missing circuit photograph record: ${name}`);
    assert.equal(record.license, 'CC0-1.0');
    assert.equal(record.scale_metres, 3);
    return { file: 'assets/' + name, bytes: record.bytes, sha256: record.sha256, manifest: manifestPath };
  });
  const maskPath = 'source/circuit-surface-manifest.json';
  const mask = JSON.parse(await fs.readFile(maskPath, 'utf8'));
  assert.equal(mask.output, 'public/assets/circuit-surface.rgba.gz');
  records.push({ file: mask.output.slice(7), bytes: mask.gzipBytes, sha256: mask.gzipSha256, manifest: maskPath });
  for (const record of records) for (const folder of ['public', 'dist']) {
    const bytes = await fs.readFile(path.join(folder, record.file));
    assert.equal(bytes.length, record.bytes, `${folder}/${record.file} byte count`);
    assert.equal(hash(bytes), record.sha256, `${folder}/${record.file} source hash`);
  }
  return records;
}

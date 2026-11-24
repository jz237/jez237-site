/**
 * Screenshot comparison: has a view changed since the reference pictures were taken?
 *
 *   node compare-shots.mjs            compare the pictures verify.mjs just saved with reference/*.jpg; exit 1 if any differs
 *   node compare-shots.mjs --update   replace the references with the pictures verify.mjs just saved
 *
 * verify.mjs saves a picture of each main view (assembled, exploded, every nested study, the all-parts board, the
 * phone layout) into STUDIO_SHOTS, or the system temp folder's anatomy-studio-validation. This script shrinks each
 * to 96 pixels wide in grey and compares it with the reference of the same name: the score is the average
 * difference between the two, as a fraction of full brightness.
 *
 * It catches a view that has visibly changed (a missing system, a moved camera, a broken layout, a finish gone
 * dark). It is deliberately blunt: software renderers on different machines differ in fine detail and in how text
 * is drawn, so the limit (STUDIO_SHOT_LIMIT, default 0.04) is well above noise: a picture scores about 0.01 against its own
 * reference (0.02 for the crowded all-parts board), because the references are stored as small JPEGs. In CI it reports and does
 * not fail the run. A real change in appearance is expected to trip it: look at the pictures, then --update.
 *
 * The pictures are decoded in the same headless browser the tests use, so no image library is needed.
 */
import {chromium} from 'playwright';
import {mkdir, readFile, readdir, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url)), REFERENCE = path.join(HERE, 'reference');
const shots = process.env.STUDIO_SHOTS || path.join(tmpdir(), 'anatomy-studio-validation');
const update = process.argv.includes('--update'), LIMIT = Number(process.env.STUDIO_SHOT_LIMIT) || 0.04, WIDTH = 96;
const dataURL = async (file, type) => `data:image/${type};base64,${(await readFile(file)).toString('base64')}`;

const names = (await readdir(shots).catch(() => [])).filter(n => n.endsWith('.png')).sort();
if (!names.length) { console.error(`No pictures in ${shots}. Run verify.mjs first.`); process.exit(2); }
const browser = await chromium.launch({executablePath: process.env.CHROME_PATH || undefined, headless: true});
const page = await browser.newPage();
try {
  if (update) {
    await mkdir(REFERENCE, {recursive: true});
    for (const name of names) {
      // references are stored small (480 px wide JPEG): enough for the comparison and for a person to recognise the view
      const jpeg = await page.evaluate(async src => { const img = new Image(); img.src = src; await img.decode(); const k = 480 / img.width, c = Object.assign(document.createElement('canvas'), {width: 480, height: Math.round(img.height * k)}); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); return c.toDataURL('image/jpeg', 0.72); }, await dataURL(path.join(shots, name), 'png'));
      await writeFile(path.join(REFERENCE, name.replace(/\.png$/, '.jpg')), Buffer.from(jpeg.split(',')[1], 'base64'));
    }
    console.log(`Updated ${names.length} reference pictures in ${REFERENCE}`);
  } else {
    const rows = [];
    for (const name of names) {
      const ref = path.join(REFERENCE, name.replace(/\.png$/, '.jpg'));
      let reference; try { reference = await dataURL(ref, 'jpeg'); } catch { rows.push({name, score: null}); continue; }
      const score = await page.evaluate(async ([a, b, width]) => {
        const grey = async src => { const img = new Image(); img.src = src; await img.decode(); const h = Math.round(img.height * width / img.width), c = Object.assign(document.createElement('canvas'), {width, height: h}); const g = c.getContext('2d', {willReadFrequently: true}); g.drawImage(img, 0, 0, width, h); const d = g.getImageData(0, 0, width, h).data, out = new Float32Array(width * h); for (let i = 0; i < out.length; i++) out[i] = (d[i * 4] * 0.299 + d[i * 4 + 1] * 0.587 + d[i * 4 + 2] * 0.114) / 255; return out; };
        const x = await grey(a), y = await grey(b), n = Math.min(x.length, y.length); let sum = 0; for (let i = 0; i < n; i++) sum += Math.abs(x[i] - y[i]);
        return sum / n + Math.abs(x.length - y.length) / Math.max(x.length, y.length);   // a different shape counts as a difference
      }, [await dataURL(path.join(shots, name), 'png'), reference, WIDTH]);
      rows.push({name, score});
    }
    const changed = rows.filter(r => r.score !== null && r.score > LIMIT), missing = rows.filter(r => r.score === null);
    for (const r of rows) console.log(`${r.score === null ? '  new   ' : r.score > LIMIT ? 'CHANGED ' : '  same  '}${r.name.padEnd(28)}${r.score === null ? 'no reference yet' : r.score.toFixed(4)}`);
    console.log(`${rows.length - changed.length - missing.length} unchanged, ${changed.length} changed, ${missing.length} without a reference (limit ${LIMIT}).`);
    if (changed.length) { console.log('If the change is intended, look at the pictures and run: node compare-shots.mjs --update'); process.exitCode = 1; }
  }
} finally { await browser.close(); }

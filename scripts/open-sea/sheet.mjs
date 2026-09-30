// Contact sheet of several deterministic shots: node sheet.mjs out.png cols warm WxH "query1|query2|..."
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch {
  try { ({ chromium } = createRequire('/opt/node22/lib/node_modules/')('playwright')); } catch {
    console.error('Playwright is not installed. Run: cd scripts/open-sea && npm install && npx playwright install chromium');
    process.exit(1);
  }
}
const [out, cols = '2', warm = '6', size = '640x360', queries = ''] = process.argv.slice(2);
const [W, H] = size.split('x').map(Number);
const base = process.env.SEA_URL || 'http://localhost:8791/demos/open-sea/index.html';
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const list = queries.split('|').filter(Boolean);
const pngs = [];
for (const q of list) {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const logs = [];
  page.on('console', m => { const t = m.text(); if (/error|Error|failed/i.test(t) && !/GPU stall/.test(t)) logs.push(t); });
  page.on('pageerror', e => logs.push('pageerror ' + e.message));
  await page.goto(`${base}?shot=1&${q}`);
  await page.waitForFunction(() => window.__seaReady, null, { timeout: 60000 }).catch(() => {});
  if (!(await page.evaluate(() => !!window.__sea))) { console.log(q, 'LOAD FAILED', logs.join('\n')); process.exit(2); }
  await page.evaluate(async ([w]) => { const s = window.__sea; await s.warm(w, 0.1); s.shot(0.033); s.shot(0.033); }, [parseFloat(warm)]);
  pngs.push(await page.screenshot({ type: 'png', timeout: 240000 }));
  if (logs.length) console.log(q, logs.slice(0, 3));
  await page.close();
}
await browser.close();
// compose with python (PIL)
import { spawnSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const dir = mkdtempSync(join(tmpdir(), 'sheet-'));
pngs.forEach((b, i) => writeFileSync(join(dir, `${i}.png`), b));
const py = `
from PIL import Image
import sys
n=${pngs.length}; cols=${parseInt(cols)}; W=${W}; H=${H}
rows=(n+cols-1)//cols
im=Image.new('RGB',(cols*W,rows*H))
for i in range(n):
    im.paste(Image.open('${dir}/%d.png'%i),((i%cols)*W,(i//cols)*H))
im.save('${out}')
`;
const r = spawnSync('python3', ['-c', py], { encoding: 'utf8' });
if (r.status !== 0) console.log(r.stderr);
console.log('wrote', out);

#!/usr/bin/env node
// Side-by-side composite for reference-vs-render comparison (view the result with the Read tool).
//   node side.cjs <reference.png> <render.png> <out.png> [height=720]
const sharp = require('/home/jez237/.npm-global/lib/node_modules/sharp');
(async () => {
  const [a, b, out, h0] = process.argv.slice(2);
  if (!a || !b || !out) { console.error('usage: node side.cjs <reference.png> <render.png> <out.png> [height=720]'); process.exit(2); }
  const H = parseInt(h0 || '720', 10);
  const fit = async (f) => {
    const buf = await sharp(f).resize({ height: H }).png().toBuffer();
    const m = await sharp(buf).metadata();
    return { buf, w: m.width };
  };
  const A = await fit(a), B = await fit(b);
  const gap = 8;
  await sharp({ create: { width: A.w + B.w + gap, height: H, channels: 3, background: '#20242a' } })
    .composite([{ input: A.buf, left: 0, top: 0 }, { input: B.buf, left: A.w + gap, top: 0 }])
    .png().toFile(out);
  console.log(out, `${A.w + B.w + gap}x${H}`);
})();

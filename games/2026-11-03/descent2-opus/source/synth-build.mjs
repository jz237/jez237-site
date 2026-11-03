// Builds web/synth/: the bundled MIDI player, SpessaSynth's AudioWorklet processor and
// the GeneralUser GS sound bank (downloaded once into tools/synth/cache/).
// Usage: node tools/synth/build.mjs
import { build } from 'esbuild';
import { copyFile, mkdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', '..', 'web', 'synth');
const cache = join(here, 'cache');
// GeneralUser GS v2 (S. Christian Collins) as compressed SF3, from the SpessaSynth project.
// Its license asks sites to host their own copy rather than link to the author's downloads.
const BANK_URL = 'https://raw.githubusercontent.com/spessasus/SpessaSynth/master/soundfonts/GeneralUserGS.sf3';
const LICENSE_URL = 'https://raw.githubusercontent.com/mrbumpy409/GeneralUser-GS/main/documentation/LICENSE.txt';

async function cached(name, url) {
  const file = join(cache, name);
  try {
    if ((await stat(file)).size > 0) return file;
  } catch {}
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  await mkdir(cache, { recursive: true });
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  return file;
}

await mkdir(out, { recursive: true });
await build({
  entryPoints: [join(here, 'd2synth.src.js')],
  bundle: true,
  format: 'esm',
  minify: true,
  target: 'es2020',
  legalComments: 'eof',
  outfile: join(out, 'd2synth.js'),
});
await copyFile(join(here, 'node_modules', 'spessasynth_lib', 'dist', 'spessasynth_processor.min.js'),
  join(out, 'spessasynth_processor.min.js'));
await copyFile(join(here, 'node_modules', 'spessasynth_lib', 'LICENSE'), join(out, 'LICENSE-SpessaSynth.txt'));
await copyFile(await cached('GeneralUserGS.sf3', BANK_URL), join(out, 'GeneralUserGS.sf3'));
await copyFile(await cached('LICENSE-GeneralUserGS.txt', LICENSE_URL), join(out, 'LICENSE-GeneralUserGS.txt'));
console.log('built', out);

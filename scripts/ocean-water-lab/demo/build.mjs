// Assembles demo/dist/index.html: one self-contained page with the kit shaders inlined.
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const here = dirname(fileURLToPath(import.meta.url));
const read = (p) => readFileSync(join(here, p), 'utf8');
const shaders = {};
for (const dir of ['../kit/glsl', '../kit/glsl/fft', 'shaders']) {
  for (const f of readdirSync(join(here, dir))) {
    if (!/\.(glsl|frag|vert)$/.test(f)) continue;
    const src = read(join(dir, f));
    if (src.includes('//@@ ')) {
      for (const part of src.split('//@@ ').slice(1)) {
        const nl = part.indexOf('\n');
        shaders[part.slice(0, nl).trim()] = part.slice(nl + 1);
      }
    } else shaders[f] = src;
  }
}
// strip comment-only lines and blank lines to keep the page small (line numbers in errors refer to the stripped source)
for (const k in shaders) shaders[k] = shaders[k].split('\n').filter((l) => l.trim() && !l.trim().startsWith('//')).join('\n') + '\n';
let html = read('src/index.template.html');
html = html.replace('/*@KIT_JS@*/', () => read('../kit/js/water_waves.js') + '\n' + read('../kit/js/water_fft.js'));
html = html.replace('/*@SHADERS@*/', () => JSON.stringify(shaders).replace(/</g, '\\u003c'));
const vendor = '/*! mp4-muxer 5.2.2 (c) 2023 Vanilagy, MIT License, https://github.com/Vanilagy/mp4-muxer */\n' + read('src/vendor/mp4-muxer.min.js');
html = html.replace('/*@MAIN_JS@*/', () => vendor + '\n' + read('src/params.js') + '\n' + read('src/main.js'));
mkdirSync(join(here, 'dist'), { recursive: true });
writeFileSync(join(here, 'dist/index.html'), html);
console.log('built dist/index.html', (html.length / 1024).toFixed(1) + ' KiB', Object.keys(shaders).join(' '));

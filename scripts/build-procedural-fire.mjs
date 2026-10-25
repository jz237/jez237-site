import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
const source = new URL('./procedural-fire/', import.meta.url);
const output = new URL('../demos/procedural-fire/', import.meta.url);
mkdirSync(output, { recursive: true });
for (const name of ['index.html', 'src', 'LICENSE']) {
  cpSync(new URL(name, source), new URL(name, output), { recursive: true });
}
writeFileSync(new URL('CREDITS.txt', output), readFileSync(new URL('UPSTREAM.md', source)));
console.log('Built Procedural Fire static modules, audio worklets and license.');

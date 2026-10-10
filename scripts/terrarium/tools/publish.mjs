// Copies the production build into the public site: demos/terrarium/
import {cp, rm, mkdir, readdir, writeFile, readFile} from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const target = path.resolve(root, '..', '..', 'demos', 'terrarium');
if (path.basename(target) !== 'terrarium' || !target.includes(`${path.sep}demos${path.sep}`)) throw new Error(`Refusing to publish to ${target}`);
await rm(target, {recursive: true, force: true});
await mkdir(target, {recursive: true});
await cp(dist, target, {recursive: true});
// The study page is a development tool; keep it out of the public build.
for (const f of await readdir(target)) if (f === 'lizard-study.html') await rm(path.join(target, f));
await cp(path.join(root, 'README.md'), path.join(target, 'README.md')).catch(() => {});
const files = [];
async function walk(dir) {
  for (const e of await readdir(dir, {withFileTypes: true})) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p); else files.push(path.relative(target, p));
  }
}
await walk(target);
await writeFile(path.join(target, 'build-manifest.json'), JSON.stringify({built: new Date().toISOString(), files: files.sort()}, null, 1));
console.log(`Published ${files.length} files to ${path.relative(path.resolve(root, '..', '..'), target)}/`);
void readFile;

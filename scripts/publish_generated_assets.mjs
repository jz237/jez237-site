import {cpSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync} from 'node:fs';
import {isAbsolute, relative, resolve} from 'node:path';

const manifestName = 'generated-bundles.json';
export function validateBundlePaths(paths) {
  if (!Array.isArray(paths) || paths.some(p => typeof p !== 'string' ||
      !/^assets\/(?:[\w.-]+\/)*[\w.-]+\.(?:js|css)$/.test(p) || p.split('/').includes('..'))) {
    throw new Error('Invalid generated bundle manifest; refusing cleanup');
  }
  return [...new Set(paths)].sort();
}
function bundlesIn(source) {
  const assets = resolve(source, 'assets');
  if (!existsSync(assets) || !lstatSync(assets).isDirectory()) throw new Error('Build has no regular assets directory');
  const walk = (dir, prefix) => readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
    if (entry.isSymbolicLink()) throw new Error('Generated asset symlink is not allowed');
    if (entry.isDirectory()) return walk(resolve(dir, entry.name), `${prefix}${entry.name}/`);
    return /\.(js|css)$/.test(entry.name) ? [`${prefix}${entry.name}`] : [];
  });
  const result = validateBundlePaths(walk(assets, 'assets/'));
  if (!result.length) throw new Error('Build has no JS/CSS bundles');
  return result;
}
/** Copy a complete build, then retire only manifest-owned JS/CSS. Unknown files,
 * source art, textures, models and wrapper files are never cleanup candidates.
 * Keep current plus one previous distinct build, including lazy-loaded chunks.
 */
export function publishGeneratedAssets(source, target) {
  source = resolve(source); target = resolve(target);
  const inside = (parent, child) => {const path = relative(parent, child); return path === '' || (!path.startsWith('..') && !isAbsolute(path));};
  if (inside(source, target) || inside(target, source)) {
    throw new Error('Build source and publication target must be separate directories');
  }
  if (!existsSync(resolve(source, 'index.html'))) throw new Error('Build entrypoint is missing');
  const current = bundlesIn(source), manifestPath = resolve(target, manifestName);
  // Bootstrap manifests must be explicitly reviewed. Do not infer ownership of
  // existing target files from their extensions or hash-looking names.
  if (!existsSync(manifestPath) || !lstatSync(manifestPath).isFile()) throw new Error(`Missing reviewed ${manifestName} in ${target}`);
  const old = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (old.version !== 1) throw new Error('Unsupported generated bundle manifest');
  const oldCurrent = validateBundlePaths(old.current), oldPrevious = validateBundlePaths(old.previous);
  const previous = JSON.stringify(current) === JSON.stringify(oldCurrent) ? oldPrevious : oldCurrent;
  const keep = new Set([...current, ...previous]);
  const retired = [...new Set([...oldCurrent, ...oldPrevious])].filter(p => !keep.has(p));
  for (const file of [...oldCurrent, ...oldPrevious]) {
    let parent = target;
    for (const component of file.split('/').slice(0, -1)) {
      parent = resolve(parent, component);
      if (!existsSync(parent) || !lstatSync(parent).isDirectory()) throw new Error(`Nonregular bundle directory: ${file}`);
    }
    const absolute = resolve(target, file);
    if (!existsSync(absolute) || !lstatSync(absolute).isFile()) throw new Error(`Missing or nonregular retained bundle: ${file}`);
  }
  mkdirSync(target, {recursive: true});
  cpSync(source, target, {recursive: true});
  for (const file of retired) unlinkSync(resolve(target, file));
  writeFileSync(manifestPath, JSON.stringify({version: 1, current, previous}, null, 2) + '\n');
  return {current: current.length, previous: previous.length, retired};
}

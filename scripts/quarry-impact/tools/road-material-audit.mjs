// CPU construction/geometry audit. Does not compile GPU programs or open Chrome.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import * as T from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'outputs', 'road-material-cpu');
fs.mkdirSync(output, { recursive: true });
const snapshots = {};
const textureCache = new Map();
const texture = (name, repeat = 1, color = false) => {
  const key = `${name}:${repeat}:${color}`;
  if (!textureCache.has(key)) {
    const value = new T.Texture();
    value.name = key;
    value.repeat.set(repeat, repeat);
    if (color) value.colorSpace = T.SRGBColorSpace;
    textureCache.set(key, value);
  }
  return textureCache.get(key);
};
// Substitute image I/O only; shader builders and Three's materials are real.
const assets = {
  texture,
  pbr(prefix, repeat, options = {}) {
    return new T.MeshStandardMaterial({
      map: texture(prefix + '_diff', repeat, true),
      normalMap: texture(prefix + '_nor_gl', repeat),
      roughnessMap: texture(prefix + '_rough', repeat), roughness: 1, ...options,
    });
  },
};
function sourceModule(relative, dependencies) {
  const source = fs.readFileSync(path.join(root, relative), 'utf8');
  snapshots[relative] = createHash('sha256').update(source).digest('hex');
  const module = { exports: {} };
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  new Function('require', 'module', 'exports', compiled)(name => {
    assert.ok(name in dependencies, `Unexpected CPU audit import: ${name}`);
    return dependencies[name];
  }, module, module.exports);
  return module.exports;
}
const rules = sourceModule('src/rules.ts', {});
const loaderPath = path.join(root, 'src/scenery-road-approach.ts');
const loader = fs.existsSync(loaderPath) ? fs.readFileSync(loaderPath, 'utf8') : '';
const boundsPath = path.join(root, 'src/quarry-road-approach-bounds.json');
const bounds = fs.existsSync(boundsPath) ? JSON.parse(fs.readFileSync(boundsPath, 'utf8')) : {};
const start = Number(bounds.startSegment ?? /ROAD_APPROACH_START\s*=\s*(\d+)/.exec(loader)?.[1] ?? 123);
const end = Number(bounds.endSegmentExclusive ?? /ROAD_APPROACH_END\s*=\s*(\d+)/.exec(loader)?.[1] ?? 182);
const surfaces = sourceModule('src/scenery-surfaces.ts', {
  three: T,
  './assets': assets,
  './rules': rules,
  './scenery-road-approach': { ROAD_APPROACH_START: start, ROAD_APPROACH_END: end },
  './quarry-layout': { cliffGeometry() { throw new Error('Cliff geometry is outside this CPU audit'); } },
  'three/addons/utils/BufferGeometryUtils.js': { mergeGeometries },
});
const road = sourceModule('src/scenery-road-material.ts', {
  './assets': assets, './scenery-surfaces': surfaces,
});
const resolveIncludes = source => source.replace(/#include <([^>]+)>/g, (_, name) => {
  assert.ok(name in T.ShaderChunk, `Missing Three.js shader chunk ${name}`);
  return resolveIncludes(T.ShaderChunk[name]);
});
function assemble(material, name) {
  const shader = {
    uniforms: T.UniformsUtils.clone(T.ShaderLib.standard.uniforms),
    vertexShader: T.ShaderLib.standard.vertexShader,
    fragmentShader: T.ShaderLib.standard.fragmentShader,
  };
  for (const key of ['map', 'normalMap', 'roughnessMap']) shader.uniforms[key].value = material[key];
  material.onBeforeCompile(shader, {});
  const vertex = resolveIncludes(shader.vertexShader), fragment = resolveIncludes(shader.fragmentShader);
  fs.writeFileSync(path.join(output, name + '.vert.glsl'), vertex);
  fs.writeFileSync(path.join(output, name + '.frag.glsl'), fragment);
  return { shader, vertex, fragment };
}
const results = [];
for (const base of ['aggregate', 'ground']) {
  const material = road.quarryRoadSurface(base);
  const { shader, vertex, fragment } = assemble(material, base);
  assert.equal(material.vertexColors, false, 'Masks must not also multiply the albedo');
  assert.match(vertex, /vRoadMetres=uv;/);
  assert.ok(vertex.indexOf('vQuarryPosition=') < vertex.indexOf('vMapUv=vQuarryPosition'), 'World coordinates must exist before base UV assignment');
  assert.ok(fragment.indexOf('float roadCoverage=') < fragment.indexOf('float roadRough='));
  assert.ok(fragment.indexOf('vec3 roadN=') > fragment.indexOf('vec3 nonPerturbedNormal = normal;'), 'Road normals must follow the base normal setup');
  assert.equal((fragment.match(/vec3 roadN=/g) ?? []).length, 1);
  const aliases = Object.fromEntries([...fragment.matchAll(/^#define (road\w+) (\w+)$/gm)].map(match => [match[1], match[2]]));
  const references = new Set([...fragment.matchAll(/(?:roadPhoto|textureGrad)\((road\w+),/g)].map(match => aliases[match[1]] ?? match[1]));
  for (const name of references) assert.ok(shader.uniforms[name]?.value?.isTexture, `${base}: unbound texture ${name}`);
  const textures = Object.values(shader.uniforms).filter(uniform => uniform.value?.isTexture).map(uniform => uniform.value);
  assert.equal(new Set(textures).size, base === 'aggregate' ? 9 : 11);
  results.push({ base, cacheKey: material.customProgramCacheKey(), textureCount: new Set(textures).size, authoredSamplerBindings: [...references] });
}

// Exercise the actual root integration: continuous marks end gradually, omitted
// cells have no triangles, both corrected shoulder surfaces face upward, and
// arena marks retain the original unfaded material.
const group = new T.Group();
surfaces.roadsideDetails(group);
assert.equal(group.children.length, 7);
for (const shoulder of group.children.slice(0, 2)) {
  const normals = shoulder.geometry.getAttribute('normal'), indices = shoulder.geometry.index;
  for (const i of indices.array) assert.ok(normals.getY(i) > 0, 'Shoulder has downward normals');
}
for (const marks of group.children.slice(2, 6)) {
  const geometry = marks.geometry, fade = geometry.getAttribute('wearAlpha');
  for (let j = 0; j < geometry.index.count; j += 6) {
    const cell = Math.floor(Math.min(...geometry.index.array.slice(j, j + 6)) / 2);
    assert.ok(cell < start || cell >= end, 'Legacy mark geometry overlaps the replacement');
  }
  assert.equal(fade.getX(start * 2), 0);
  assert.equal(fade.getX(end * 2), 0);
  assert.equal(fade.getX((start - 4) * 2), 1);
  assert.equal(fade.getX((end + 4) * 2), 1);
  for (let i = 0; i < 4; i++) {
    assert.ok(fade.getX((start - i - 1) * 2) > fade.getX((start - i) * 2));
    assert.ok(fade.getX((end + i + 1) * 2) > fade.getX((end + i) * 2));
  }
  assemble(marks.material, 'legacy-marks');
}
const arena = group.children[6];
assert.notEqual(arena.material, group.children[2].material);
assert.equal(arena.geometry.getAttribute('wearAlpha'), undefined);
const report = {
  status: 'passed', kind: 'CPU shader construction and actual geometry integration',
  limits: 'No GLSL compiler, GPU program linking, image comparison or performance measurement was run.',
  interval: { start, end, source: loader ? 'current loader' : 'agreed contract; loader still pending' },
  shaders: results, legacyMarks: { count: 4, fadeCells: 4, arenaUnchanged: true },
  sourceHashes: snapshots,
};
fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));

import {chromium} from 'playwright';
import assert from 'node:assert/strict';

const url = process.env.STUDIO_URL || 'http://127.0.0.1:8791/demos/anatomy-studio/';
const SLOW = Number(process.env.STUDIO_SLOW) || 1;
const browser = await chromium.launch({headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']});
try {
  const page = await browser.newPage({viewport: {width: 1280, height: 860}});
  page.setDefaultTimeout(30000 * SLOW);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  // Exercise the real section module on small known closed meshes first. This
  // proves culling doesn't hide a real cut after a transform, LOD or plane change.
  await page.route('**/section-fixture', route => route.fulfill({contentType: 'text/html', body:
    `<script type="importmap">{"imports":{"three":"${new URL('vendor/three.module.min.js', url)}"}}</script>`}));
  await page.goto(new URL('section-fixture', url).href);
  const fixture = await page.evaluate(async url => {
    const THREE = await import('three');
    const {createSection} = await import(new URL('section.js', url).href);
    const sectionSource = await (await fetch(new URL('section.js', url))).text();
    const materialsPath = sectionSource.match(/from ['"](.\/materials\.js[^'"]*)['"]/)[1];
    const {lifeUniforms} = await import(new URL(materialsPath, url).href);
    const scene = new THREE.Scene(), material = new THREE.MeshBasicMaterial();
    const parts = [-3, 0, 3].map(x => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
      mesh.position.x = x; scene.add(mesh);
      return {file: 'skeletal', mesh, triangles: 12};
    });
    const section = createSection({scene, materials: () => [material],
      bounds: () => new THREE.Box3(new THREE.Vector3(-4, -4, -4), new THREE.Vector3(4, 4, 4)), onChange() {}});
    const visible = () => scene.getObjectByName('Section caps').children.filter(p => p.visible).length;
    section.setAxis('sagittal'); section.frame(parts);
    for (let i = 0; section.state.tested < 3 && i < 100; i++) await new Promise(resolve => setTimeout(resolve, 5));
    section.frame(parts); const initial = visible();
    section.flip(); section.frame(parts); const flipped = visible();
    section.setPosition(.875); section.frame(parts); const shifted = visible();
    section.setPosition(.5); parts[2].mesh.position.x = 0; section.frame(parts); const moved = visible();
    parts[0].mesh.geometry = new THREE.BoxGeometry(8, 1, 1); section.frame(parts); const lod = visible();
    section.setPosition(0); section.frame(parts); const edge = visible();
    lifeUniforms.gain.value = 1; section.frame(parts); const animated = visible(); lifeUniforms.gain.value = 0;
    section.setAxis('off'); const off = section.state.capped;
    return {initial, flipped, shifted, moved, lod, edge, animated, off};
  }, url);
  assert.deepEqual(fixture, {initial: 1, flipped: 1, shifted: 1, moved: 2, lod: 3, edge: 1, animated: 3, off: 0});
  await page.unroute('**/section-fixture');
  await page.goto(`${url}?quality=verify&stage=full`);
  await page.waitForFunction(() => window.anatomyStudio?.getState().stage === 'detail' && !window.anatomyStudio.getState().loading, null, {timeout: 120000 * SLOW});
  await page.locator('[data-mode="clay"]').click();
  const started = Date.now();
  await page.locator('#section-axis').selectOption('sagittal');
  await page.waitForFunction(() => { const s = window.anatomyStudio.getState(); return s.section.tested === s.pieces && s.section.capped > 0; }, null, {timeout: 120000 * SLOW});
  const state = await page.evaluate(() => window.anatomyStudio.getState());
  assert.ok(state.section.closed > 500);
  assert.ok(state.section.capped < state.section.closed / 2, 'non-intersecting closed meshes do not allocate cap passes');
  if (process.env.STUDIO_SECTION_SHOT) await page.screenshot({path: process.env.STUDIO_SECTION_SHOT});
  await page.locator('#section-axis').selectOption('off');
  assert.equal((await page.evaluate(() => window.anatomyStudio.getState())).section.capped, 0);
  assert.deepEqual(errors, []);
  console.log(`PASS section: ${JSON.stringify(fixture)}; ${state.section.tested} real meshes checked, ${state.section.closed} closed, ${state.section.capped} intersecting caps, ${Date.now() - started}ms`);
} finally { await browser.close(); }

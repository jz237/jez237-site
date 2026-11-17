import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';
import { GLTFLoader } from './vendor/GLTFLoader.js';
import { MeshoptDecoder } from './vendor/meshopt_decoder.module.js';
import { EffectComposer } from './vendor/postprocessing/EffectComposer.js';
import { RenderPass } from './vendor/postprocessing/RenderPass.js';
import { GTAOPass } from './vendor/postprocessing/GTAOPass.js';
import { OutputPass } from './vendor/postprocessing/OutputPass.js';
import { PartsBoard } from './parts-board.js?v=76a88f20d1';
import { finishMaterial, studioEnvironment, fileLabels, fileColors, modes, organPiece, projectedUV, skinTint } from './materials.js?v=82cc3f3258';
import { assemblies, bodyLandmarks, assemblyContext, assemblyOffset } from './assemblies.js?v=98fdd3ac69';
import { bodyOffset, bodySpread, explodeSchedule } from './explode-rules.js?v=742c72af7e';
import { layoutLabels } from './labels.js?v=5a33037751';
import { createSection } from './section.js?v=b5188e87e5';
import { createQuiz } from './quiz.js?v=bcf9b3a438';
import { createTour } from './tour.js?v=7c4b903d8e';
import { keyFacts, relatedPieces, summary } from './facts.js?v=12aa155dc7';
import { readURL, writeURL } from './url-state.js?v=df6e81efce';
import { systemNotes, pieceNotes } from './tour-notes.js?v=bb3933d4cf';
import { UnrealBloomPass } from './vendor/postprocessing/UnrealBloomPass.js';
import { BokehPass } from './vendor/postprocessing/BokehPass.js';
import { createOutline, syncSkinDepth, skinDepthMaterial, cavityTint, createFloorReflection } from './effects.js?v=72befa3056';
import { createLife } from './life.js?v=c398ae1e9f';

const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.search);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = matchMedia('(max-width: 760px)').matches || (matchMedia('(pointer: coarse)').matches && innerWidth < 900);
const verifyQuality = params.get('quality') === 'verify';
const DEFAULT_MODE = 'xray';   // the finish the studio opens in; it is also the one a link leaves unsaid
const state = { ready:false, amount:0, target:0, sequence:false, sequenceTime:0, selected:null, isolated:false, system:'all', mode:DEFAULT_MODE, view:'hero', board:false, assembly:null, assemblySide:'L', labels:false, labelAll:false, ao:false, detail:false, stage:'none', loading:false, rotate:false, hidden:new Set(), quiz:false, only:'all', fx:false, dof:false };
const parts = [], partsById = new Map(), landmarks = [], raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
let manifest, descriptions = null, renderer, controls, camera, scene, model, last = performance.now(), pointerStart = null, viewTween = null, lastApplied = -1, explodeTween = null;
const hi = { geometries:new Map(), loaded:new Set(), loading:new Set(), frame:0 };
let lastLeaders = '', board = null, bodyCamera, bodyControls, boardControls, studioObjects = [], studioFog, boardKey = '', boardDirty = true, keyLight, composer, gtaoPass, renderPass;
// Render on demand: a frame is drawn only while something moves, and for a few frames after anything changes.
const alwaysRender = verifyQuality || params.get('render') === 'always';
let renderFrames = 8, rendered = 0, section = null, quiz = null, tour = null, tourKind = null, tourRestore = null, pieceById = new Map(), pieceOrder = new Map(), applyingURL = false, urlTimer = 0, lastURLAssembly = null, labelNote = '', lostTimer = 0;
const QUIZ_FILES = new Set(['skeletal', 'visceral', 'heart', 'brain', 'muscular']);
/** A piece's name with its side, unless the name already says it ("Left main bronchus"). */
const sided = p => p.side === 'M' || /\b(left|right)\b/i.test(p.name) ? p.name : `${p.name} (${p.side === 'L' ? 'left' : 'right'})`;
const plain = part => part.label.replace(/ · \d+$/, '');
// Automatic quality: if frames stay slow while something is moving, the costliest effects are switched off one at a time.
const quality = { auto:!verifyQuality && params.get('quality') !== 'fixed', level:0, slow:0, last:0 };
let resizeStage = () => {};
let outline = null, mirror = null, bloomPass = null, bokehPass = null, tinting = false;
// The assembled body breathes and its heart beats (life.js). Off for reduced motion, in the verification runs (they compare exact positions) and with ?life=0.
const life = createLife(); life.on = params.has('life') ? params.get('life') !== '0' : !reducedMotion && !verifyQuality;
const tintQueue = [];
// Explode order: outer layers leave first and come back last. A piece starts moving at its lag and every piece arrives at 100%.
const LAG = { regions:0, muscular:.05, lymphoid:.1, vessels:.12, nerves:.14, joints:.2, visceral:.2, heart:.24, brain:.24, skeletal:.3 }, LAG_SPAN = .7;
const invalidate = (frames = 3) => { if (frames > renderFrames) renderFrames = frames; };
// Declared up here because the module awaits loadStudio() below: anything it needs must exist before that line runs.
let attachQueue = Promise.resolve();
const assetURL = entry => `./${entry.path}?v=${entry.v || 2}`;
const baseTarget = new THREE.Vector3(0, .9, 0);
const views = { hero:[1.76, 1.57, 2.44], front:[0, .95, 3.8], side:[3.8, .95, 0], back:[0, .95, -3.8], top:[.01, 4.4, .01] };
const stageOrder = ['core', 'muscles', 'detail'];
const fallbackCopy = {
 skeletal:'A bone, tooth or cartilage of the skeleton. Bones are the central axis of the exploded body: they barely move, so every other system reads outward from them.',
 joints:'A ligament, intervertebral disc, joint capsule or articular disc. Small ligaments of one joint are merged into a single named piece.',
 visceral:'An organ of the digestive, respiratory, urinary, endocrine or reproductive system. Viscera separate forward and downward from the trunk.',
 heart:'A structure of the heart or a great vessel. Open the heart study to separate the chambers, valves and coronary vessels.',
 brain:'A structure of the brain, meninges or sense organs. Open the brain study to separate the cortex, deep nuclei, cerebellum and brainstem.',
 muscular:'A skeletal muscle, or a merged set of fasciae, bursae or tendon sheaths. Superficial muscles travel farther than deep ones when the body separates.',
 vessels:'A named artery or vein. Branches below the fourth level of the vascular tree are merged into their parent trunk.',
 nerves:'A nerve, plexus or part of the spinal cord. Branches below the fourth level of the nerve tree are merged into their parent nerve.',
 lymphoid:'A lymphoid organ or a regional group of lymph nodes.',
 regions:'A named surface region of the body, rendered as translucent skin. Sub-regions are merged into their regional group.'
};

function fail(error){ console.error(error); $('loading').hidden = true; $('error').hidden = false; $('scene-status').textContent = 'STUDIO UNAVAILABLE'; $('error-message').textContent = 'The 3D model could not load. Check your connection and that WebGL 2 / hardware acceleration is enabled, then try again.'; }

try { init(); await loadStudio(); } catch (error) { fail(error); }

function init(){
 const host = $('viewport'); scene = new THREE.Scene(); scene.fog = new THREE.FogExp2('#090e14', .05);
 renderer = new THREE.WebGLRenderer({ antialias:!verifyQuality, alpha:true, stencil:true, powerPreference:'high-performance' });   // stencil: capped cross-sections
 renderer.setPixelRatio(verifyQuality ? 1 : Math.min(devicePixelRatio, 1.7)); renderer.setClearColor('#090e14', 0);
 renderer.shadowMap.enabled = !verifyQuality && !mobile; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
 renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
 host.appendChild(renderer.domElement); renderer.localClippingEnabled = true;   // the cross-section plane clips per material
 camera = new THREE.PerspectiveCamera(36, 1, .03, 120); camera.position.fromArray(views.hero);
 // Ground-truth ambient occlusion (GTAO) so pieces shade each other; off for phones and headless verification.
 const rt = new THREE.WebGLRenderTarget(1, 1, { type:THREE.HalfFloatType, stencilBuffer:true, samples:(verifyQuality || params.get('msaa') === '0') ? 0 : 4 });   // multisampled so occlusion does not cost anti-aliasing
 composer = new EffectComposer(renderer, rt); renderPass = new RenderPass(scene, camera); composer.addPass(renderPass);
 gtaoPass = new GTAOPass(scene, camera, 1, 1, undefined, { radius:.14, distanceExponent:1.1, thickness:1, scale:1.6, samples:14, distanceFallOff:1, screenSpaceRadius:false }, { lumaPhi:8, depthPhi:2.5, normalPhi:3.5, radius:4, radiusExponent:1, rings:2, samples:14 });
 gtaoPass.output = GTAOPass.OUTPUT.Default; gtaoPass.blendIntensity = 1; composer.addPass(gtaoPass);
 // The occlusion pass draws the whole scene with one material, so the cap quads (which rely on a stencil test) are hidden for it.
 const drawOcclusion = gtaoPass.render.bind(gtaoPass); gtaoPass.render = (...args) => { section.showCaps(false); drawOcclusion(...args); section.showCaps(true); };
 bokehPass = new BokehPass(scene, camera, { focus:1, aperture:.03, maxblur:.006 }); bokehPass.enabled = false; composer.addPass(bokehPass);   // depth of field, only while a piece of a study is in focus
 bloomPass = new UnrealBloomPass(new THREE.Vector2(256, 256), .16, .5, 2.6); composer.addPass(bloomPass);   // a light glow on true highlights only: the threshold sits well above brightly lit bone
 composer.addPass(new OutputPass());
 state.ao = !verifyQuality && !mobile; gtaoPass.enabled = state.ao; state.fx = state.ao && params.get('fx') !== '0';
 controls = new OrbitControls(camera, renderer.domElement); controls.target.copy(baseTarget); controls.enableDamping = true; controls.dampingFactor = .065;
 controls.minDistance = .25; controls.maxDistance = 20; controls.maxPolarAngle = Math.PI * .98;   // free to look from underneath: skull base, soles, the underside of the brain
  controls.autoRotateSpeed = .55; controls.enablePan = true;
 // On a phone a vertical swipe on the model scrolls the page (the controls sit below the stage); sideways drags still orbit.
 // OrbitControls sets touch-action:none itself, so this has to come after it.
 if (mobile) renderer.domElement.style.touchAction = 'pan-y';
 controls.addEventListener('start', () => { viewTween = null; document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active')); });
 scene.environment = studioEnvironment(renderer); scene.environmentIntensity = .75;
 scene.add(new THREE.HemisphereLight('#f3e9e2', '#1d2429', .6));
 keyLight = new THREE.DirectionalLight('#fff1e6', 2.0); keyLight.position.set(2.2, 4.5, 3); keyLight.castShadow = renderer.shadowMap.enabled; keyLight.shadow.mapSize.set(mobile ? 2048 : 4096, mobile ? 2048 : 4096); keyLight.shadow.radius = 6; keyLight.shadow.blurSamples = 12; keyLight.shadow.camera.left = -2.6; keyLight.shadow.camera.right = 2.6; keyLight.shadow.camera.top = 3; keyLight.shadow.camera.bottom = -.5; keyLight.shadow.camera.near = .5; keyLight.shadow.camera.far = 14; keyLight.shadow.normalBias = .004; keyLight.shadow.bias = -.00004; scene.add(keyLight);
 const rim = new THREE.DirectionalLight('#9fd3ff', 1.5); rim.position.set(-3, 2.5, -2.5); scene.add(rim);
 const fill = new THREE.DirectionalLight('#ffd9c4', .7); fill.position.set(2.5, 1.2, -3); scene.add(fill);
 const platform = new THREE.Mesh(new THREE.CylinderGeometry(1.32, 1.36, .13, 128), new THREE.MeshPhysicalMaterial({ color:'#0d131b', metalness:.1, roughness:.35, clearcoat:.8, clearcoatRoughness:.3, envMapIntensity:.35 })); platform.position.y = -.065; platform.receiveShadow = true; scene.add(platform);
 const ring = new THREE.Mesh(new THREE.TorusGeometry(1.34, .008, 8, 192), new THREE.MeshBasicMaterial({ color:'#f5b39c' })); ring.rotation.x = Math.PI / 2; ring.position.y = -.002; scene.add(ring);
 const inner = new THREE.Mesh(new THREE.TorusGeometry(1.22, .0025, 6, 160), new THREE.MeshBasicMaterial({ color:'#44525b' })); inner.rotation.x = Math.PI / 2; inner.position.y = .003; scene.add(inner);
 const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshPhysicalMaterial({ color:'#04060a', roughness:.55, metalness:0, clearcoat:.6, clearcoatRoughness:.45, envMapIntensity:.25 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -.14; floor.receiveShadow = true; scene.add(floor);
 const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = shadowCanvas.height = 128; const ctx = shadowCanvas.getContext('2d'), gradient = ctx.createRadialGradient(64, 64, 8, 64, 64, 64); gradient.addColorStop(0, 'rgba(0,0,0,.6)'); gradient.addColorStop(.5, 'rgba(0,0,0,.35)'); gradient.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gradient; ctx.fillRect(0, 0, 128, 128);
 const contact = new THREE.Mesh(new THREE.PlaneGeometry(1.1, .8), new THREE.MeshBasicMaterial({ map:new THREE.CanvasTexture(shadowCanvas), transparent:true, depthWrite:false })); contact.rotation.x = -Math.PI / 2; contact.position.y = .004; scene.add(contact);
 const positions = []; for (let i = 0; i < 96; i++) { const a = i / 96 * Math.PI * 2, r = i % 8 === 0 ? 1.12 : 1.16; positions.push(Math.cos(a) * r, .003, Math.sin(a) * r, Math.cos(a) * 1.2, .003, Math.sin(a) * 1.2); }
 scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)), new THREE.LineBasicMaterial({ color:'#64717a', transparent:true, opacity:.32 })));
 bodyCamera = camera; bodyControls = controls; studioFog = scene.fog; studioObjects = scene.children.filter(o => o.isMesh || o.isLineSegments);
 mirror = createFloorReflection(); mirror.visible = false; scene.add(mirror); outline = createOutline();
 const resize = () => { const w = host.clientWidth, h = host.clientHeight; renderer.setSize(w, h); composer.setSize(w, h); invalidate(4); bodyCamera.aspect = w / h; bodyCamera.updateProjectionMatrix(); if (state.ready) { if (state.board) reflowBoard(true); else setView(state.view, true); } }; resizeStage = resize; new ResizeObserver(resize).observe(host); resize();
 // A lost graphics context usually comes back (driver reset, laptop waking, too many tabs): wait for it before giving up.
 renderer.domElement.addEventListener('webglcontextlost', e => { e.preventDefault(); $('scene-status').textContent = 'GRAPHICS PAUSED · RESTORING'; clearTimeout(lostTimer); lostTimer = setTimeout(() => fail(new Error('WebGL context lost')), 8000); });
 renderer.domElement.addEventListener('webglcontextrestored', () => { clearTimeout(lostTimer); $('error').hidden = true; scene.environment = studioEnvironment(renderer); updateUI(); invalidate(30); });
 renderer.domElement.addEventListener('pointerdown', e => pointerStart = { x:e.clientX, y:e.clientY });
 renderer.domElement.addEventListener('pointerup', e => { if (state.ready && pointerStart && Math.hypot(e.clientX - pointerStart.x, e.clientY - pointerStart.y) < 6) { const hit = pick(e); if (hit && !quiz.answer(hit.userData.part)) selectPart(hit.userData.part); } pointerStart = null; });
 renderer.domElement.addEventListener('dblclick', e => { if (!state.ready || state.board || state.quiz) return; const hit = pick(e); if (hit) { selectPart(hit.userData.part); focusSelected(); } });   // double-click frames a piece without isolating it
 let lastMove = 0;
 renderer.domElement.addEventListener('pointermove', e => { if (e.buttons || !state.ready || state.quiz) { $('tooltip').hidden = true; return; } if (performance.now() - lastMove < 40) return; lastMove = performance.now(); const hit = pick(e); renderer.domElement.style.cursor = hit ? 'pointer' : 'grab'; $('tooltip').hidden = !hit; if (hit) { const r = host.getBoundingClientRect(); $('tooltip').textContent = hit.userData.part.label; $('tooltip').style.left = `${Math.min(e.clientX - r.left + 15, r.width - 230)}px`; $('tooltip').style.top = `${e.clientY - r.top + 18}px`; } });
 renderer.domElement.addEventListener('pointerleave', () => { $('tooltip').hidden = true; pointerStart = null; });
 bindControls();
 for (const type of ['pointerdown', 'pointermove', 'pointerup', 'wheel', 'keydown', 'click', 'input', 'change', 'touchmove']) addEventListener(type, () => invalidate(90), { passive:true, capture:true });   // any input keeps the picture live for a moment
 document.addEventListener('visibilitychange', () => { quality.last = 0; invalidate(4); });
 renderer.setAnimationLoop(tick);
}

async function loadStudio(){
 manifest = await (await fetch('./manifest.json?v=de101016e7')).json();
 $('piece-total').textContent = manifest.stats.pieces.toLocaleString(); life.setup(manifest); pieceById = new Map(manifest.pieces.map(p => [p.id, p])); pieceOrder = new Map(manifest.pieces.map((p, i) => [p.id, i]));
 model = new THREE.Group(); model.name = 'Human body'; scene.add(model);
 const select = $('system'); select.replaceChildren(new Option('Complete body', 'all'), ...manifest.files.map(f => new Option(fileLabels[f.id] || f.id, f.id)));
 const requested = params.get('stage'); const target = requested && stageOrder.includes(requested) ? requested : requested === 'full' ? 'detail' : mobile ? 'core' : params.get('mode') === 'organs' ? 'lean' : 'detail';   // lean: everything the opening view shows; the muscles (a third of the download) wait until they are needed
 await loadStage('core');
 state.ready = true; document.body.dataset.ready = 'true'; $('loading').hidden = true;
 for (const id of ['explode-button', 'animate', 'reset', 'all-parts', 'quiz-start', 'tour-body']) $(id).disabled = false; $('ao-toggle').setAttribute('aria-pressed', state.ao); state.detail = !verifyQuality && !mobile; $('lod-toggle').setAttribute('aria-pressed', state.detail);
 document.querySelectorAll('[data-assembly]').forEach(b => b.disabled = false);
 updateList(); updateUI(); setView('hero', true); $('fx-toggle').setAttribute('aria-pressed', state.fx); $('life-toggle').setAttribute('aria-pressed', life.on);
 if (!reducedMotion && !verifyQuality) { camera.position.sub(controls.target).multiplyScalar(1.24).add(controls.target); setView('hero'); if (viewTween) viewTween.duration = 2400; }   // a slow push-in on arrival
 window.anatomyStudio = {
  getState:() => ({ ready:state.ready, pieces:parts.length, visible:parts.filter(p => p.mesh.visible).length, amount:state.amount, target:state.target, selected:state.selected?.label ?? null, isolated:state.isolated, system:state.system, board:state.board, mode:state.mode, ao:state.ao, detail:state.detail, hiFiles:[...hi.loaded], hiLoading:[...hi.loading], assembly:state.assembly, assemblySide:state.assemblySide, stage:state.stage, loading:state.loading, hidden:state.hidden.size, rendered, life:life.getState(), fx:state.fx, dof:bokehPass.enabled, only:state.only, quality:quality.level, section:section.state, quiz:quiz.getState(), tour:tour.getState(), triangles:parts.reduce((n, p) => n + (p.mesh.visible ? p.triangles : 0), 0), drawCalls:parts.reduce((n, p) => n + (p.mesh.visible ? 1 : 0), 0), files:manifest.files.filter(f => f.loaded).map(f => f.id) }),
  getParts:() => parts.map(p => ({ id:p.id, name:p.name, scale:p.mesh.scale.toArray().map((v, i) => v / p.baseScale.getComponent(i)), side:p.side, file:p.file, region:p.region, visible:p.mesh.visible, lod:p.lod, triangles:Math.round((p.mesh.geometry.index?.count ?? p.mesh.geometry.attributes.position.count) / 3), radius:(p.mesh.geometry.boundingSphere || p.mesh.geometry.computeBoundingSphere() || p.mesh.geometry.boundingSphere).radius * Math.max(p.mesh.scale.x, p.mesh.scale.y, p.mesh.scale.z), extent:p.size.length() / 2, position:p.mesh.position.toArray(), base:p.base.toArray(), inAssembly:!!(state.assembly && isMember(p)) })),
  getAssembly:id => { const a = assemblies[id]; if (!a) return null; const members = assemblyMembers(id); return { side:state.assemblySide, paired:!!a.paired, members:members.map(p => p.id), primary:members.filter(p => a.primary?.(p.piece)).map(p => p.id), framed:members.filter(p => !a.frame || a.frame(p.piece)).map(p => p.id), rectangles:projectedRectangles(members.filter(p => p.mesh.visible)) }; },
  getBoardRectangles:() => board ? board.rectangles() : [],
  loadStage, enterAssembly, leaveAssembly, setMode, setAmount, reset, loadHi, setDetail, lodPass, choosePiece, hideSelected, getManifest:() => manifest,
  // inspection hooks for the verification scripts and for debugging: ?quality=verify or ?debug
  ...(verifyQuality || params.has('debug') ? { _advance:(seconds = 1) => { let t = Math.max(last, performance.now()); for (let i = 0, n = Math.ceil(seconds * 60); i < n; i++) tick(t += 1000 / 60); },   /* step the loop by hand: a background tab gets no animation frames */ _radius:id => { const p = partsById.get(id); return p ? projectedRadiusPx(p) : null; }, _edges:(id, limit = .03) => { const p = partsById.get(id); if (!p) return null; const g = p.mesh.geometry, pos = g.attributes.position, idx = g.index, s = p.mesh.scale.x; let long = 0, max = 0; const n = idx ? idx.count : pos.count; const v = i => [pos.getX(i), pos.getY(i), pos.getZ(i)]; for (let t = 0; t < n; t += 3) { const a = v(idx ? idx.getX(t) : t), b = v(idx ? idx.getX(t + 1) : t + 1), c = v(idx ? idx.getX(t + 2) : t + 2); const L = Math.max(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]), Math.hypot(b[0] - c[0], b[1] - c[1], b[2] - c[2]), Math.hypot(a[0] - c[0], a[1] - c[1], a[2] - c[2])) * s; if (L > max) max = L; if (L > limit) long++; } return { tris:n / 3, long, max:+max.toFixed(4), lod:p.lod }; }, _focus:(id, distance = .6, dir = [1, .35, 1.4]) => { const p = partsById.get(id); if (!p) return false; const c = p.center.clone().add(p.mesh.position).sub(p.base); viewTween = null; controls.target.copy(c); camera.position.copy(c).addScaledVector(new THREE.Vector3().fromArray(dir).normalize(), distance); return true; }, _side:v => { for (const p of parts) p.mesh.material.side = v; }, _normals:on => { for (const p of parts) { if (on) { p.mesh.userData.savedMat = p.mesh.material; p.mesh.material = new THREE.MeshNormalMaterial(); } else if (p.mesh.userData.savedMat) { p.mesh.material = p.mesh.userData.savedMat; delete p.mesh.userData.savedMat; } } }, _flat:on => { for (const p of parts) { if (on) { p.mesh.userData.savedMat = p.mesh.material; p.mesh.material = new THREE.MeshStandardMaterial({ color:'#d9ad8e', roughness:.6, flatShading:false }); } else if (p.mesh.userData.savedMat) { p.mesh.material = p.mesh.userData.savedMat; delete p.mesh.userData.savedMat; } } }, _gtao:gtaoPass, _GTAOPass:GTAOPass, _camera:() => ({ position:camera.position.toArray(), target:controls.target.toArray(), tween:!!viewTween }) } : {})
 };
 await applyURL(readURL(), { initial:true });
 addEventListener('popstate', () => applyURL(readURL()));
 if (target === 'lean') { state.loading = true; $('stage-status').hidden = false; loadFiles(manifest.stages.detail).finally(() => { state.loading = false; $('stage-status').hidden = true; updateStageUI(); }); }
 else if (target !== 'core') loadStage(target);
}

// Every file of a request downloads at once. Pieces are still attached one file at a time, in the order requested,
// so piece numbers and explode directions do not depend on which download happens to finish first.
async function loadFiles(ids){
 const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder); const env = manifest.envelope;
 const wanted = manifest.files.filter(f => ids.includes(f.id) && !f.loaded), fresh = wanted.filter(f => !f.loadingPromise), received = new Map();
 const report = () => { const total = fresh.reduce((n, f) => n + f.bytes, 0), done = fresh.reduce((n, f) => n + Math.min(received.get(f.id) || 0, f.bytes), 0), pct = Math.round(done / total * 100), what = fresh.length > 2 ? `${fresh.length} systems` : fresh.map(f => fileLabels[f.id].toLowerCase()).join(' and '); $('load-progress').textContent = `Loading ${what} · ${pct}%`; $('stage-status').textContent = `LOADING ${what.toUpperCase()} · ${pct}%`; };
 for (const f of fresh) {
  const download = loader.loadAsync(assetURL(f), progress => { received.set(f.id, progress.loaded); report(); }); download.catch(() => {});
  const previous = attachQueue;
  f.loadingPromise = (async () => {
   await previous; const gltf = await download;
   gltf.scene.updateMatrixWorld(true); const meshes = []; gltf.scene.traverse(o => { if (o.isMesh) meshes.push(o); });
   for (const mesh of meshes) {
    const piece = pieceById.get(mesh.userData.id) || pieceById.get(mesh.parent?.userData.id); if (!piece) continue;
    model.attach(mesh); const index = pieceOrder.get(piece.id);   // the manifest's order: piece numbers and explode directions never depend on what happened to load first
    const part = { id:piece.id, piece, mesh, baseScale:mesh.scale.clone(), lag:LAG[piece.file] ?? .15, file:piece.file, group:piece.file, short:fileLabels[piece.file], name:piece.name, side:piece.side, region:piece.region, path:piece.path, parent:piece.parent, merged:piece.merged, triangles:piece.triangles, index, label:`${sided(piece)} · ${String(index + 1).padStart(4, '0')}`, base:mesh.position.clone(), center:new THREE.Vector3().fromArray(piece.center), size:new THREE.Vector3().fromArray(piece.size), assemblies:Object.keys(assemblies).filter(k => assemblies[k].paired ? (assemblies[k].match(piece, 'L') || assemblies[k].match(piece, 'R')) : (manifest.assemblies[k] || []).includes(piece.id)) };
    part.assembly = part.assemblies[0] || null;
    finishMaterial(mesh, piece, state.mode); captureMaterial(part); part.loGeometry = mesh.geometry; part.lod = 'lo';
    mesh.castShadow = !mesh.material.transparent; mesh.receiveShadow = true; mesh.userData.part = part; mesh.frustumCulled = true;
    part.offset = new THREE.Vector3().fromArray(bodyOffset(piece, env)); part.spread = new THREE.Vector3().fromArray(bodySpread(piece, index, part.assemblies.length > 0));
    parts.push(part); partsById.set(part.id, part);
   }
   f.loaded = true; boardDirty = true; lastApplied = -1; $('part-count').textContent = parts.length.toLocaleString();
   if (!state.ready) $('loading').hidden = true;   // show the body as it arrives; the controls unlock when the core stage is in
   invalidate();
  })();
  f.loadingPromise.catch(() => { f.loadingPromise = null; });   // a failed download can be retried
  attachQueue = f.loadingPromise.catch(() => {});
 }
 await Promise.all(wanted.map(f => f.loadingPromise));
 buildBodyLandmarks(); updateList(); updateVisibility();
 for (const p of parts) if (p.file === 'skeletal' && !p.tintQueued) { p.tintQueued = true; tintQueue.push(p); }
 if (tintQueue.length && !tinting) { tinting = true; setTimeout(pumpTints, 30); }
}
/** Bone cavity shading is worked out from each mesh's curvature in short slices, so loading is never held up. */
function pumpTints(){
 const started = performance.now();
 while (tintQueue.length && performance.now() - started < 8) { const p = tintQueue.pop(); if (cavityTint(p.loGeometry, p.mesh.scale.x) && p.mesh.userData.cavity) { p.mesh.material.vertexColors = true; p.mesh.material.needsUpdate = true; } }
 invalidate(); if (tintQueue.length) setTimeout(pumpTints, 4); else tinting = false;
}
async function loadStage(name){
 const idx = stageOrder.indexOf(name); if (idx < 0) return;
 state.loading = true; $('stage-status').hidden = false;
 for (const s of stageOrder.slice(0, idx + 1)) { await loadFiles(manifest.stages[s]); state.stage = s; }
 state.loading = false; $('stage-status').hidden = true; updateStageUI();
}
function updateStageUI(){
 if (manifest.files.every(f => f.loaded)) state.stage = 'detail';
 const missing = manifest.files.filter(f => !f.loaded), next = missing.length ? (missing.some(f => f.id === 'muscular') ? 'muscles' : 'detail') : null; const btn = $('load-more');
 btn.hidden = !next; if (next) btn.textContent = missing.length === 1 ? `⤓ Load ${fileLabels[missing[0].id].toLowerCase()}` : next === 'muscles' ? '⤓ Load the muscles' : '⤓ Load vessels, nerves, lymphatics & skin';
 $('stage-note').textContent = state.stage === 'detail' ? `Every system loaded · ${parts.length.toLocaleString()} pieces` : `${parts.length.toLocaleString()} of ${manifest.stats.pieces.toLocaleString()} pieces loaded`;
}
function captureMaterial(part){ const m = part.mesh.material; section.applyTo(m); syncSkinDepth(part); part.opacity = m.opacity; part.transparent = m.transparent; part.depthWrite = m.depthWrite; part.emissive = m.emissive.clone(); part.emissiveIntensity = m.emissiveIntensity; }
function setMode(mode, { user = false } = {}){ if (!modes.includes(mode)) return; if (user) state.restoreMode = null; state.mode = mode;
 if ((mode === 'skin' || mode === 'organs') && manifest && !manifest.files.find(f => f.id === 'regions')?.loaded) loadFiles(['regions']).then(() => { if (state.mode === 'skin' || state.mode === 'organs') updateVisibility(); }); /* the skin lives in the detail stage */ for (const p of parts) { p.mesh.material.dispose(); finishMaterial(p.mesh, p.piece, mode); captureMaterial(p); p.mesh.castShadow = !p.mesh.material.transparent; } document.querySelectorAll('[data-mode]').forEach(b => { b.classList.toggle('active', b.dataset.mode === mode); b.setAttribute('aria-pressed', b.dataset.mode === mode); }); boardDirty = true; updateVisibility(); syncURL(); }

function buildBodyLandmarks(){
 for (const l of landmarks.filter(l => l.kind === 'body')) l.el.remove(); for (let i = landmarks.length - 1; i >= 0; i--) if (landmarks[i].kind === 'body') landmarks.splice(i, 1);
 const seen = new Set();
 for (const l of bodyLandmarks) { if (seen.has(l.file)) continue; const part = parts.find(p => p.file === l.file && p.name === l.piece && (!l.side || p.side === l.side)); if (!part) continue; seen.add(l.file); const el = document.createElement('span'); el.className = 'landmark'; el.textContent = l.label; $('labels').append(el); landmarks.push({ el, part, kind:'body' }); }
}
function projectedRectangles(list){ model.updateMatrixWorld(true); camera.updateMatrixWorld(true); return list.map(p => { const b = new THREE.Box3().setFromObject(p.mesh), min = [Infinity, Infinity], max = [-Infinity, -Infinity]; for (let i = 0; i < 8; i++) { const v = new THREE.Vector3(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z).project(camera); min[0] = Math.min(min[0], v.x); min[1] = Math.min(min[1], v.y); max[0] = Math.max(max[0], v.x); max[1] = Math.max(max[1], v.y); } return { id:p.id, min, max, center:p.center.clone().add(p.mesh.position).sub(p.base).toArray() }; }); }

function pick(e){ const rect = renderer.domElement.getBoundingClientRect(); pointer.set((e.clientX - rect.left) / rect.width * 2 - 1, -(e.clientY - rect.top) / rect.height * 2 + 1); raycaster.setFromCamera(pointer, camera); if (state.board) return raycaster.intersectObjects(board.visible.flatMap(x => [x.mesh, x.plane]), false)[0]?.object;
 const hits = raycaster.intersectObjects(parts.filter(p => p.mesh.visible).map(p => p.mesh), false).filter(h => !section.clips(h.point));
 // What you see is what you select: ghosted or see-through pieces (X-ray tissue, translucent skin, pleura, dura) do not block the solid piece behind them.
 const solid = h => !h.object.material.transparent || h.object.material.opacity >= .5;
 return (hits.find(solid) || hits.find(h => h.object.userData.part.file !== 'regions') || hits[0])?.object; }
function ensureBoard(){ if (board && !boardDirty) return; if (board) { scene.remove(board.group); } $('scene-status').textContent = 'LAYING OUT THE BOARD'; board = new PartsBoard(parts); scene.add(board.group); boardDirty = false; boardKey = ''; }
function reflowBoard(force = false){ if (!board) return; const key = parts.filter(p => p.mesh.visible).map(p => p.id).join(','); if (force || key !== boardKey) { boardKey = key; board.layout($('viewport').clientWidth, $('viewport').clientHeight, p => p.mesh.visible); boardControls?.target.set(0, 0, 0); if (state.board) window.scrollTo(0, 0); } $('board-count').textContent = `${board.visible.length} / ${parts.length} PIECES`; }
function toggleBoard(on){
 if (mobile) renderer.domElement.style.touchAction = on ? 'none' : 'pan-y';   // the board pans in every direction
 if (!state.ready) return; stopSequence(); viewTween = null; if (on && quiz.active) quiz.stop(); if (on) ensureBoard(); state.board = on; document.body.classList.toggle('board-mode', on); $('all-parts').setAttribute('aria-pressed', on); $('board-header').hidden = !on; model.visible = !on; if (board) board.group.visible = on; studioObjects.forEach(o => o.visible = !on); scene.fog = on ? null : studioFog; controls.enabled = false;
 if (on) { camera = board.camera; if (!boardControls) { boardControls = new OrbitControls(camera, renderer.domElement); boardControls.enableRotate = false; boardControls.screenSpacePanning = true; boardControls.mouseButtons.LEFT = THREE.MOUSE.PAN; boardControls.minZoom = .3; boardControls.maxZoom = 30; boardControls.enableDamping = false; } else boardControls.object = camera; controls = boardControls; controls.enabled = true; controls.autoRotate = false; board.select(state.selected); reflowBoard(true); window.scrollTo(0, 0); }
 else { camera = bodyCamera; controls = bodyControls; controls.enabled = true; setView(state.view, true); }
 updateUI(); syncURL(); invalidate();
}
function setView(name, immediate = false){
 if (state.board) toggleBoard(false);
 state.dof = false;
 state.view = name; const aspectFactor = Math.max(1, Math.sqrt(1.4 / camera.aspect)), factor = (1 + state.target * (state.assembly ? 0 : 1.05)) * aspectFactor;
 const target = state.assembly ? assemblyTarget() : baseTarget.clone().add(new THREE.Vector3(0, state.target * .12, state.target * .25));
 const dir = state.assembly ? new THREE.Vector3().fromArray(assemblies[state.assembly].view).multiply(new THREE.Vector3(assemblies[state.assembly].paired && state.assemblySide === 'R' ? -1 : 1, 1, 1)).normalize() : new THREE.Vector3().fromArray(views[name]).sub(baseTarget).normalize();
 const distance = state.assembly ? assemblyDistance() : new THREE.Vector3().fromArray(views[name]).sub(baseTarget).length() * factor;
 const destination = target.clone().addScaledVector(dir, distance);
 if (immediate || reducedMotion) { camera.position.copy(destination); controls.target.copy(target); viewTween = null; } else viewTween = { start:performance.now(), from:camera.position.clone(), to:destination, fromTarget:controls.target.clone(), toTarget:target };
 if (params.has('tracecam')) console.info('setView', name, immediate, new Error().stack.split('\n').slice(2, 5).join(' | '));
 document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === name && !state.assembly));
}
function setAmount(value, { fit = true, manual = true, animate = false } = {}){
 if (!state.ready) return; if (state.board) toggleBoard(false); if (manual) stopSequence();
 state.target = THREE.MathUtils.clamp(value, 0, 1);
 const duration = reducedMotion ? 1600 : 3200;
 explodeTween = animate ? { start:performance.now(), from:state.amount, to:state.target, duration } : null;
 if (reducedMotion && !animate) state.amount = state.target;
 updateUI(); if (fit) { setView(state.view); if (animate && viewTween) viewTween.duration = duration; }
 if (manual) syncURL();
}
function updateUI(){
 const shown = explodeTween ? state.amount : state.target;
 $('explode').value = Math.round(shown * 100); $('amount').innerHTML = `${String(Math.round(shown * 100)).padStart(3, '0')}<span>%</span>`;
 $('assembly-state').textContent = explodeTween ? (state.target > state.amount ? 'Separating the systems…' : 'Bringing it together…') : state.assembly ? (state.target < .5 ? `${assemblies[state.assembly].title}, assembled.` : `${assemblies[state.assembly].title}, opened.`) : state.target < .01 ? 'Whole, and at rest.' : state.target < .4 ? 'Beneath the skin.' : state.target < .8 ? 'A study in separation.' : 'Every piece, revealed.';
 $('explode-button').innerHTML = state.target > .5 ? '↙ Reassemble' : '<span aria-hidden="true">↗</span> Explode the body';
 const chip = $('pick-chip'), chosen = state.selected; chip.hidden = !chosen || state.quiz || !!tour?.active || state.board;   // the name of the selection, on the stage: on a phone the inspector is a screen below
 if (!chip.hidden) { $('pick-chip-name').textContent = plain(chosen); $('pick-chip-kind').textContent = `${chosen.short} · ${chosen.region}`.toUpperCase(); }
 document.body.classList.toggle('engaged', state.target > .01 || !!state.assembly || !!state.selected || state.labels || state.board || state.system !== 'all' || state.quiz || !!tour?.active || !!section?.active);   // the title steps aside once the visitor starts working
 $('scene-status').textContent = state.board ? 'ALL-PARTS BOARD' : state.assembly ? `${assemblies[state.assembly].title.toUpperCase()} · NESTED STUDY` : state.isolated ? 'ISOLATED PIECE' : state.system !== 'all' ? `${fileLabels[state.system].toUpperCase()} STUDY` : state.target > .01 ? 'EXPLODED STUDY' : 'LIVE 3D / HUMAN ANATOMY';
}
function updateList(){
 const search = $('search').value.toLowerCase(); const options = parts.filter(p => (state.system === 'all' || p.file === state.system) && isMember(p) && `${p.label} ${p.short} ${p.region} ${p.path}`.toLowerCase().includes(search));
 $('part-list').replaceChildren(new Option(options.length ? `Select a piece… (${options.length})` : 'No matching pieces', ''), ...options.map(p => new Option(`${p.short} / ${p.label}`, p.id)));
 $('part-list').value = state.selected?.id ?? '';
 // Typed search: a ranked list over the whole model, including systems that have not been downloaded yet.
 const box = $('results'), term = search.trim(); box.hidden = !term; box.replaceChildren(); if (!term) return;
 const rank = p => { const n = p.name.toLowerCase(); return n === term ? 0 : n.startsWith(term) ? 1 : n.includes(term) ? 2 : 3; };
 const found = manifest.pieces.filter(p => (state.system === 'all' || p.file === state.system) && `${p.name} ${p.region} ${p.path}`.toLowerCase().includes(term)).sort((a, b) => rank(a) - rank(b) || a.name.length - b.name.length).slice(0, 30);
 if (!found.length) { const none = document.createElement('p'); none.textContent = 'No matching pieces.'; box.append(none); }
 for (const p of found) { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'option'); const name = document.createElement('b'); name.textContent = sided(p); const where = document.createElement('span'); where.textContent = `${fileLabels[p.file]} · ${p.region}`; b.append(name, where); b.onclick = () => choosePiece(p.id); box.append(b); }
}
/** Select a piece by id from anywhere (search, links, related pieces): loads its system and makes sure it can be seen. */
async function choosePiece(id, { focus = true } = {}){
 const piece = pieceById.get(id); if (!piece) return null;
 await loadFiles([piece.file]); const part = partsById.get(id); if (!part) return null;
 if (state.assembly && !isMember(part)) leaveAssembly();
 if (state.system !== 'all' && state.system !== part.file) { state.system = 'all'; $('system').value = 'all'; }
 state.hidden.delete(id); selectPart(part);
 if (!part.mesh.visible) { setMode('realistic', { user:true }); loadRest(); }   // the default finish leaves out muscles, ligaments and most skin
 updateList(); if (focus && !state.board) focusSelected(); return part;
}
function hideSelected(){ if (!state.selected) return; state.hidden.add(state.selected.id); state.isolated = false; selectPart(null); }
function visibleBounds(){ const box = new THREE.Box3(), half = new THREE.Vector3(), c = new THREE.Vector3(); for (const p of parts) { if (!p.mesh.visible) continue; c.copy(p.center).add(p.mesh.position).sub(p.base); half.copy(p.size).multiplyScalar(.5); box.expandByPoint(c.clone().sub(half)); box.expandByPoint(c.add(half)); } return box; }
function renderFacts(part, text){
 // 457 pieces borrow the description of the structure they belong to: say so instead of presenting it as their own
 const key = part?.piece.descriptionKey, borrowed = !!part && !!key && key.toLowerCase() !== part.name.toLowerCase() && text !== fallbackCopy[part.file];
 $('part-about').hidden = !borrowed; if (borrowed) $('part-about').textContent = `This piece has no description of its own. The text below is about: ${key}.`;
 const url = part ? sourceOf(part) : null; $('part-source').hidden = !url; if (url) $('part-source').href = url;
 const authored = part && (part.piece.text || part.piece.descriptionKey), facts = authored ? keyFacts(text, part.file) : [], related = authored ? relatedPieces(text, part, parts) : [];
 const list = $('part-facts'); list.hidden = !facts.length; list.replaceChildren(...facts.flatMap(f => { const dt = document.createElement('dt'); dt.textContent = f.label; const dd = document.createElement('dd'); dd.textContent = f.text; return [dt, dd]; }));
 const box = $('part-related'); box.hidden = !related.length; box.replaceChildren(); if (!related.length) return;
 const heading = document.createElement('span'); heading.className = 'eyebrow'; heading.textContent = 'ALSO NAMED IN THIS DESCRIPTION'; box.append(heading, ...related.map(p => { const b = document.createElement('button'); b.type = 'button'; b.textContent = plain(p); b.onclick = () => choosePiece(p.id); return b; }));
}
function updateVisibility(){
 const skinOnlyNow = skinOnly();
 for (const p of parts) { const selected = p === state.selected, mat = p.mesh.material, member = isMember(p);
  p.mesh.visible = member && !state.hidden.has(p.id) && (state.system === 'all' || p.file === state.system) && (!state.isolated || selected) && (!skinOnlyNow || SURFACE(p)) && !(state.mode === 'organs' && state.system === 'all' && !state.isolated && !organPiece(p));   // Organs & vessels leaves out skin, muscles, fasciae and ligaments, unless one system or one piece was asked for
  const o = state.assembly && p.assemblyLayer?.opacity != null && state.amount > .05 ? p.assemblyLayer.opacity : null;
  mat.opacity = o ?? p.opacity; mat.transparent = o != null || p.transparent; mat.depthWrite = o != null ? false : p.depthWrite;
  mat.emissive.copy(selected ? new THREE.Color('#49c8a3') : p.emissive); mat.emissiveIntensity = selected ? (state.isolated ? .05 : .13) : p.emissiveIntensity;   // a light tint only: the outline marks the selection and the surface detail stays readable
 }
 $('isolate').disabled = !state.selected; $('clear').disabled = !state.selected; $('isolate').textContent = state.isolated ? 'Show surrounding pieces' : 'Isolate piece'; $('isolate').setAttribute('aria-pressed', state.isolated);
 outline.attach(state.selected && state.selected.mesh.visible && !state.isolated ? state.selected.mesh : null);
 for (const id of ['focus', 'hide']) $(id).disabled = !state.selected || state.board; $('show-hidden').hidden = !state.hidden.size; $('show-hidden').textContent = `Show ${state.hidden.size} hidden ${state.hidden.size === 1 ? 'piece' : 'pieces'}`;
 updateUI(); if (state.board && board) { board.select(state.selected); reflowBoard(); } invalidate();
}
async function describe(part){
 if (part.piece.text) return tidy(part.piece.text);
 if (!part.piece.descriptionKey) return fallbackCopy[part.file];
 if (!descriptions) { try { descriptions = await (await fetch('./descriptions.json?v=6c2da91ae9')).json(); } catch { descriptions = {}; } }
 return tidy(descriptions[part.piece.descriptionKey]) || fallbackCopy[part.file];
}
function tidy(text){ return text && text.replace(/\s*https?:\/\/\S+\s*$/, '').replace(/\s*==+\s*([^=\n]+?)\s*==+\s*/g, '\n\n$1. ').replace(/\n{3,}/g, '\n\n').trim(); }
/** The Wikipedia article a description came from: many end with its address, which is shown as a link, not as text. */
function sourceOf(part){ const raw = part.piece.text || descriptions?.[part.piece.descriptionKey] || '', m = raw.match(/(https:\/\/[a-z-]+\.wikipedia\.org\/wiki\/\S+)\s*$/); return m ? m[1] : null; }   // wiki markers such as "== Structure ==" become plain sub-headings
function selectPart(part){
 const wasIsolated = state.isolated; state.selected = part ?? null; if (!part) state.isolated = false;
 const masked = !!part && quiz.masking;   // the naming quiz shows a piece without giving its name away
 $('part-category').textContent = masked ? 'QUIZ' : part ? `${part.short.toUpperCase()} / ${part.region.toUpperCase()} / PIECE ${String(part.index + 1).padStart(4, '0')}` : 'NO PIECE SELECTED';
 $('part-title').textContent = masked ? 'Which piece is this?' : part ? plain(part) : 'Curiosity starts with a click.';
 $('part-path').textContent = part && !masked ? part.path.replace(/ \/ /g, ' › ') : '';
 $('part-description').textContent = masked ? 'Choose its name from the options next to the model.' : part ? 'Loading description…' : 'Select directly on the body or choose from the list. Each piece can be viewed on its own.';
 renderFacts(null); if (part && !masked) describe(part).then(text => { if (state.selected !== part) return; $('part-description').textContent = text; renderFacts(part, text); });
 $('part-meta').textContent = part && !masked ? `${part.piece.schematic ? 'Added schematic reconstruction' : part.merged.length > 1 ? `${part.merged.length} merged structures` : 'Single structure'} · ${part.size.toArray().map(v => Math.round(v * 1000)).join(' × ')} mm · ${part.triangles.toLocaleString()} triangles${part.merged.length > 1 ? ` · includes ${part.merged.slice(0, 6).join(', ')}${part.merged.length > 6 ? '…' : ''}` : ''}` : '';
 $('part-list').value = part && !masked ? part.id : ''; updateVisibility();
 if (state.isolated) focusSelected(); else if (wasIsolated && !state.board) setView(state.view);
 syncURL();
}
function focusSelected(pad = 1.2){   // pad > 1.2 leaves more of the surroundings in frame
 if (state.board || !state.selected) return; stopSequence(); model.updateMatrixWorld(true);
 const box = new THREE.Box3().setFromObject(state.selected.mesh), center = box.getCenter(new THREE.Vector3()), size = box.getSize(new THREE.Vector3());
 const radius = Math.max(.03, size.length() / 2), distance = radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) * Math.max(1, 1 / camera.aspect) * pad;
 const direction = camera.position.clone().sub(controls.target).normalize();
 viewTween = { start:performance.now(), from:camera.position.clone(), to:center.clone().addScaledVector(direction, distance), fromTarget:controls.target.clone(), toTarget:center };
 state.dof = !!state.assembly && !state.isolated;
 if (params.has('tracecam')) console.info('focusSelected', new Error().stack.split('\n').slice(2, 5).join(' | '));
}

// ---------------------------------------------------------------- nested assemblies
const SURFACE = p => p.file === 'regions' || (p.file === 'brain' && /^(Cornea|Iris|Sclera|Lens|Anterior chamber of eyeball|Anterior segment of eyeball)$/.test(p.name)) || (p.file === 'skeletal' && /incisor/i.test(p.name)) || (p.file === 'visceral' && p.name === 'Tongue');   // what shows through the parted lips (molars and gums would poke through the cheeks)
function skinOnly(){ return state.mode === 'skin' && !state.assembly && !state.isolated && state.system === 'all' && state.amount < .02; }
function isMember(p){ if (!state.assembly) return true; const a = assemblies[state.assembly]; return p.assemblies.includes(state.assembly) && (!a.paired || p.side === state.assemblySide); }
function assemblyMembers(id, side = state.assemblySide){ const a = assemblies[id]; return parts.filter(p => p.assemblies.includes(id) && (!a.paired || p.side === side)); }
function assemblyBox(){ const b = new THREE.Box3(); const a = assemblies[state.assembly]; for (const p of assemblyMembers(state.assembly)) { if (a.frame && !a.frame(p.piece)) continue; const c = p.center.clone().addScaledVector(p.assemblyOffset, state.target); b.expandByPoint(c.clone().sub(p.size.clone().multiplyScalar(.5))); b.expandByPoint(c.clone().add(p.size.clone().multiplyScalar(.5))); } return b; }
function assemblyTarget(){ return assemblyBox().getCenter(new THREE.Vector3()); }
function assemblyDistance(){ const a = assemblies[state.assembly]; const radius = assemblyBox().getSize(new THREE.Vector3()).length() / 2; return radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) * Math.max(1, 1 / camera.aspect) * (a.padding || 1.1); }
async function enterAssembly(id, side){
 const a = assemblies[id]; if (!a || !state.ready) return; if (state.board) toggleBoard(false); stopSequence();
 state.assemblySide = a.paired ? (side === 'R' ? 'R' : side === 'L' ? 'L' : state.assemblySide) : 'L';
 await loadFiles(a.files);
 state.assembly = id; state.system = 'all'; state.isolated = false; $('system').value = 'all';
 // X-ray ghosts soft tissue, so a nested study renders in the realistic finish and restores X-ray on exit.
 if (state.mode === 'xray' || state.mode === 'skin' || state.mode === 'organs') { state.restoreMode = state.mode; setMode('realistic'); }   // a study needs its muscles and ligaments
 const members = assemblyMembers(id), ctx = assemblyContext(a, members.map(p => p.piece));
 for (const p of parts) { p.assemblyOffset = null; p.assemblyLayer = null; }
 for (const p of members) { const r = assemblyOffset(a, p.piece, ctx, state.assemblySide); p.assemblyOffset = new THREE.Vector3().fromArray(r.offset); p.assemblyLayer = r; }
 for (const l of landmarks.filter(l => l.kind === 'assembly')) l.el.remove(); for (let i = landmarks.length - 1; i >= 0; i--) if (landmarks[i].kind === 'assembly') landmarks.splice(i, 1);
 for (const l of a.landmarks || []) {
  let part = null, anchor = null;
  const wantSide = a.paired ? state.assemblySide : l.side;
  if (l.piece) part = members.find(p => p.name === l.piece && (!wantSide || p.side === wantSide)) || members.find(p => p.name === l.piece);
  if (l.anchor) { anchor = manifest.landmarks.find(x => x.name === l.anchor); if (anchor) { const pos = new THREE.Vector3().fromArray(anchor.position); part = members.reduce((best, p) => (!best || p.center.distanceTo(pos) < best.center.distanceTo(pos)) ? p : best, null); } }
  if (!part) continue; const el = document.createElement('span'); el.className = 'landmark landmark-assembly'; el.textContent = l.label; $('labels').append(el); landmarks.push({ el, part, kind:'assembly', anchor:anchor ? new THREE.Vector3().fromArray(anchor.position) : null });
 }
 document.querySelectorAll('[data-assembly]').forEach(b => { b.classList.toggle('active', b.dataset.assembly === id); b.setAttribute('aria-pressed', b.dataset.assembly === id); });
 buildAllLabels();
 $('assembly-panel').hidden = false; $('assembly-side').hidden = !a.paired; document.querySelectorAll('[data-side]').forEach(b => { b.classList.toggle('active', b.dataset.side === state.assemblySide); b.setAttribute('aria-pressed', b.dataset.side === state.assemblySide); });
 $('assembly-title').textContent = a.paired ? `${a.title} (${state.assemblySide === 'L' ? 'left' : 'right'})` : a.title; $('assembly-eyebrow').textContent = a.eyebrow; $('assembly-copy').textContent = a.description; $('assembly-count').textContent = `${members.length} pieces`;
 selectPart(null); updateList(); lastApplied = -1; controls.minDistance = .12;
 setAmount(1, { animate:state.amount < .999 }); state.view = 'hero';   // a side switch at full explode only moves the camera
 $('tour-study').hidden = !landmarks.some(l => l.kind === 'assembly' && !l.anchor); section.refit(); syncURL();
}
function leaveAssembly(){
 if (!state.assembly) return; if (tourKind === 'study') tour.end(); state.assembly = null; for (const p of parts) { p.assemblyOffset = null; p.assemblyLayer = null; }
 if (state.restoreMode) { const m = state.restoreMode; state.restoreMode = null; if (state.mode === 'realistic') setMode(m); }
 for (const l of landmarks.filter(l => l.kind === 'assembly' || l.kind === 'all')) l.el.remove(); for (let i = landmarks.length - 1; i >= 0; i--) if (landmarks[i].kind === 'assembly' || landmarks[i].kind === 'all') landmarks.splice(i, 1);
 document.querySelectorAll('[data-assembly]').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); }); $('assembly-panel').hidden = true;
 controls.minDistance = .25; selectPart(null); updateList(); lastApplied = -1; state.target = 0; state.amount = reducedMotion ? 0 : state.amount; setAmount(0, { animate:true }); setView('hero');
 section.refit(); syncURL();
}

function buildAllLabels(){
 for (const l of landmarks.filter(l => l.kind === 'all')) l.el.remove(); for (let i = landmarks.length - 1; i >= 0; i--) if (landmarks[i].kind === 'all') landmarks.splice(i, 1);
 if (!state.assembly || !state.labelAll) return;
 for (const p of assemblyMembers(state.assembly)) { const el = document.createElement('span'); el.className = 'landmark landmark-all'; el.textContent = p.label.replace(/ · \d+$/, ''); $('labels').append(el); landmarks.push({ el, part:p, kind:'all' }); }
}

// ---------------------------------------------------------------- zoom-level detail: full-resolution geometry streamed per system
function swapGeometry(p, g){ invalidate(); for (const child of p.mesh.children) if (child.userData.follow) child.geometry = g; if (p.mesh.material.vertexColors && !g.attributes.color && p.mesh.userData.uvWorld) skinTint(g, p.mesh.userData.uvWorld); p.mesh.geometry = g; }
function setDetail(on){ state.detail = !!on; $('lod-toggle').setAttribute('aria-pressed', state.detail); if (!state.detail) for (const p of parts) if (p.lod === 'hi') { swapGeometry(p, p.loGeometry); p.lod = 'lo'; } else lodPass(); }
const _v = new THREE.Vector3();
function projectedRadiusPx(p){ const dist = _v.copy(p.mesh.position).sub(camera.position).length(); const fovScale = renderer.domElement.clientHeight / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)); return (p.size.length() / 2) / Math.max(dist, .001) * fovScale; }
function lodPass(){
 const want = new Map();
 for (const p of parts) { if (!p.mesh.visible || !manifest.files.find(f => f.id === p.file)?.hi) continue; const r = projectedRadiusPx(p); const on = p.lod === 'hi' ? r > 70 : r > 110;
  if (on) { const g = hi.geometries.get(p.id); if (g) { if (p.lod !== 'hi') { swapGeometry(p, g); p.lod = 'hi'; } } else want.set(p.file, Math.max(want.get(p.file) || 0, r)); }
  else if (p.lod === 'hi') { swapGeometry(p, p.loGeometry); p.lod = 'lo'; } }
 if (want.size && hi.loading.size < 2) { const next = [...want.entries()].filter(([f]) => !hi.loaded.has(f) && !hi.loading.has(f)).sort((a, b) => b[1] - a[1])[0]; if (next) loadHi(next[0]); }
}
async function loadHi(fileId){
 const f = manifest.files.find(x => x.id === fileId); if (!f?.hi || hi.loaded.has(fileId) || hi.loading.has(fileId)) return;
 hi.loading.add(fileId); $('stage-status').hidden = false; console.info('detail tier: loading', fileId);
 try {
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync(assetURL(f.hi), progress => { if (progress.total) $('stage-status').textContent = `DETAIL · ${fileLabels[fileId].toUpperCase()} · ${Math.round(progress.loaded / progress.total * 100)}%`; });
  gltf.scene.updateMatrixWorld(true);
  gltf.scene.traverse(o => { if (!o.isMesh) return; const id = o.userData.id || o.parent?.userData.id; const part = partsById.get(id); if (!part) return;
   const g = o.geometry; o.updateWorldMatrix(true, false); const m = o.matrixWorld.clone();
   // bake the node transform relative to the piece's ASSEMBLED transform (base position, same quantisation scale) so the
   // geometry drops into the base tier's local space even if the file arrives mid-explosion
   // quantised (Int16/Int8) attributes cannot hold transformed floats: promote them first or a few vertices overflow into spikes
   for (const name of ['position', 'normal']) { const a = g.attributes[name]; if (a && !(a.array instanceof Float32Array)) { const f = new THREE.Float32BufferAttribute(a.count * 3, 3); for (let i = 0; i < a.count; i++) f.setXYZ(i, a.getX(i), a.getY(i), a.getZ(i)); g.setAttribute(name, f); } }
   const assembled = new THREE.Matrix4().compose(part.base, part.mesh.quaternion, part.mesh.scale).premultiply(model.matrixWorld);
   g.applyMatrix4(assembled.invert().multiply(m)); g.computeBoundingSphere();
   if (part.mesh.geometry.attributes.uv) projectedUV({ geometry:g, userData:part.mesh.userData }, part.mesh.userData.uvCell || .06, part.mesh.userData.uvWorld);
   if (part.mesh.geometry.attributes.color && part.mesh.userData.uvWorld) skinTint(g, part.mesh.userData.uvWorld);
   hi.geometries.set(id, g); o.material.dispose?.(); });
  hi.loaded.add(fileId); console.info('detail tier: ready', fileId, hi.geometries.size, 'pieces');
 } catch (e) { console.warn('detail tier failed', fileId, e); }
 hi.loading.delete(fileId); if (!state.loading) $('stage-status').hidden = true; lodPass();
}
function stopSequence(){ explodeTween = null; state.sequence = false; $('animate').textContent = '▷ Play sequence'; }
function reset(){ tour.end(); if (quiz.active) quiz.stop(); state.only = 'all'; $('explode-only').value = 'all'; if (state.board) toggleBoard(false); stopSequence(); if (state.assembly) leaveAssembly(); state.hidden.clear(); $('section-axis').value = 'off'; section.setAxis('off'); controls.minDistance = .25; state.target = 0; state.system = 'all'; state.isolated = false; state.labels = false; state.view = 'hero'; controls.autoRotate = false; state.rotate = false; $('system').value = 'all'; $('search').value = ''; for (const id of ['rotate', 'label-toggle']) $(id).setAttribute('aria-pressed', 'false'); selectPart(null); updateList(); updateUI(); setView('hero'); }
function bindControls(){
 section = createSection({ scene, materials:() => parts.map(p => p.mesh.material), bounds:visibleBounds, onChange:() => { const s = section.state; $('section-controls').hidden = s.axis === 'off'; $('section-pos').value = Math.round(s.position * 100); $('section-flip').setAttribute('aria-pressed', s.flip); $('section-caps').setAttribute('aria-pressed', s.caps); updateUI(); invalidate(); } });
 $('section-axis').onchange = e => section.setAxis(e.target.value);
 $('section-pos').oninput = e => section.setPosition(Number(e.target.value) / 100);
 $('section-flip').onclick = () => section.flip(); $('section-caps').onclick = () => section.setCaps(!section.state.caps);
 quiz = createQuiz({
  candidates:() => { const region = $('quiz-region').value; return parts.filter(p => p.mesh.visible && p.piece.descriptionKey && p.size.length() > .04 && (region === 'all' || p.region === region) && (state.system !== 'all' || state.assembly || QUIZ_FILES.has(p.file))); },   // described and big enough to click; with the whole body up, stick to bones, organs, muscles, heart and brain
  reveal:part => { state.isolated = false; selectPart(part); updateVisibility(); focusSelected(2); }, clear:() => selectPart(null),
  present:part => { state.selected = part; state.isolated = true; selectPart(part); },   // alone on the stage, so its shape is the only clue
  onToggle:on => { state.quiz = on; $('tooltip').hidden = true; if (on) { tour.end(); if (state.board) toggleBoard(false); state.isolated = false; } updateVisibility(); }
 });
 tour = createTour({
  onStart:() => { if (quiz.active) quiz.stop(); updateUI(); },
  onEnd:() => { if (tourKind === 'body') { state.system = 'all'; $('system').value = 'all'; updateList(); if (tourRestore && tourRestore !== state.mode) setMode(tourRestore); else updateVisibility(); section.refit(); } tourKind = null; tourRestore = null; updateUI(); }
 });
 $('tour-study').onclick = startStudyTour; $('tour-body').onclick = startBodyTour;
 $('focus').onclick = () => focusSelected(); $('hide').onclick = hideSelected; $('show-hidden').onclick = () => { state.hidden.clear(); updateVisibility(); };
 $('explode').addEventListener('input', e => setAmount(Number(e.target.value) / 100));
 $('explode-button').onclick = () => setAmount(state.target > .5 ? 0 : 1, { animate:true });
 $('animate').onclick = () => { if (state.board) toggleBoard(false); if (state.sequence) { stopSequence(); return; } explodeTween = null; state.sequence = true; state.sequenceTime = 0; state.isolated = false; selectPart(null); $('animate').textContent = 'Ⅱ Pause sequence'; };
 $('all-parts').onclick = async () => { if (!state.board) await loadRest(); if (!state.board) { state.system = 'all'; state.isolated = false; $('system').value = 'all'; selectPart(null); updateList(); } toggleBoard(!state.board); };
 $('fit-parts').onclick = () => { board.fit(); controls.target.set(0, 0, 0); window.scrollTo(0, 0); };
 $('return-body').onclick = () => toggleBoard(false);
 $('reset').onclick = reset;
 $('load-more').onclick = () => { const missing = manifest.files.filter(f => !f.loaded); if (missing.length) loadStage(missing.some(f => f.id === 'muscular') && state.stage === 'core' && missing.length > 1 ? 'muscles' : 'detail'); };
 document.querySelectorAll('[data-view]').forEach(b => b.onclick = () => { if (state.assembly) leaveAssembly(); setView(b.dataset.view); });
 document.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => { setMode(b.dataset.mode, { user:true }); if (b.dataset.mode !== 'organs') loadRest(); });
 document.querySelectorAll('[data-assembly]').forEach(b => b.onclick = () => state.assembly === b.dataset.assembly ? leaveAssembly() : enterAssembly(b.dataset.assembly));
 $('leave-assembly').onclick = leaveAssembly;
 $('label-all').onclick = () => { state.labelAll = !state.labelAll; $('label-all').setAttribute('aria-pressed', state.labelAll); buildAllLabels(); };
 document.querySelectorAll('[data-side]').forEach(b => b.onclick = () => { if (state.assembly && assemblies[state.assembly].paired) enterAssembly(state.assembly, b.dataset.side); });
 $('system').onchange = async e => { const id = e.target.value; state.system = id; selectPart(null); if (id !== 'all') await loadFiles([id]); if (state.system !== id) return; updateList(); updateVisibility(); section.refit(); syncURL(); };
 $('explode-only').onchange = async e => { const id = e.target.value; state.only = id; lastApplied = -1; if (id !== 'all') { await loadFiles([id]); if (!parts.some(p => p.file === id && p.mesh.visible)) { setMode('realistic', { user:true }); loadRest(); } } invalidate(); };
 $('pick-chip-details').onclick = () => $('part-title').scrollIntoView({ behavior:reducedMotion ? 'auto' : 'smooth', block:'center' });
 // Keyboard camera: with the 3D view focused, arrows orbit and + / - zoom.
 $('viewport').addEventListener('keydown', e => { if (state.board || e.ctrlKey || e.metaKey || e.altKey) return; const step = e.shiftKey ? .35 : .12;
  const move = { ArrowLeft:[-step, 0, 1], ArrowRight:[step, 0, 1], ArrowUp:[0, -step, 1], ArrowDown:[0, step, 1], '+':[0, 0, .85], '=':[0, 0, .85], '-':[0, 0, 1.18], '_':[0, 0, 1.18] }[e.key]; if (!move) return;
  e.preventDefault(); e.stopPropagation(); const offset = camera.position.clone().sub(controls.target), s = new THREE.Spherical().setFromVector3(offset);
  s.theta += move[0]; s.phi = THREE.MathUtils.clamp(s.phi + move[1], .03, controls.maxPolarAngle); s.radius = THREE.MathUtils.clamp(s.radius * move[2], controls.minDistance, controls.maxDistance);
  viewTween = null; camera.position.copy(controls.target).add(offset.setFromSpherical(s)); document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active')); invalidate(); });
 $('search').oninput = updateList;
 $('part-list').onchange = e => selectPart(e.target.value === '' ? null : partsById.get(e.target.value));
 $('isolate').onclick = () => { state.isolated = !state.isolated; updateVisibility(); if (state.board) return; if (state.isolated) focusSelected(); else setView(state.view); }; $('clear').onclick = () => selectPart(null);
 $('rotate').onclick = () => { if (state.board) toggleBoard(false); controls.autoRotate = !controls.autoRotate; state.rotate = controls.autoRotate; $('rotate').setAttribute('aria-pressed', controls.autoRotate); };
 $('label-toggle').onclick = () => { state.labels = !state.labels; $('label-toggle').setAttribute('aria-pressed', state.labels); updateUI(); };
 $('ao-toggle').onclick = () => { quality.auto = false; $('quality-note').hidden = true; state.ao = !state.ao; $('ao-toggle').setAttribute('aria-pressed', state.ao); };
 $('life-toggle').onclick = () => { life.on = !life.on; $('life-toggle').setAttribute('aria-pressed', life.on); invalidate(4); };
 $('fx-toggle').onclick = () => { quality.auto = false; $('quality-note').hidden = true; state.fx = !state.fx; $('fx-toggle').setAttribute('aria-pressed', state.fx); };
 $('lod-toggle').onclick = () => setDetail(!state.detail);
 $('fullscreen').onclick = async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { $('fullscreen').textContent = 'Fullscreen unavailable'; } };
 document.addEventListener('fullscreenchange', () => { $('fullscreen').textContent = document.fullscreenElement ? '⛶ Exit fullscreen' : '⛶ Fullscreen'; });
 document.addEventListener('keydown', e => { const typing = /SELECT|TEXTAREA/.test(e.target.tagName) || (e.target.tagName === 'INPUT' && e.target.type !== 'range');   // a focused button or slider must not swallow the shortcuts
  if (typing || e.ctrlKey || e.metaKey || e.altKey || !state.ready) return; const k = e.key.toLowerCase(); if (k === 'e') setAmount(state.target > .5 ? 0 : 1, { animate:true }); if (k === 'r') reset(); if (k === 'f') focusSelected(); if (k === 'x') hideSelected();
  if (tour.active && e.target.tagName !== 'INPUT' && e.target.id !== 'viewport') { if (e.key === 'ArrowRight') tour.next(); if (e.key === 'ArrowLeft') tour.prev(); }
  if (e.key === 'Escape') { if (tour.active) tour.end(); else if (state.selected) selectPart(null); else if (state.assembly) leaveAssembly(); } const map = { h:'heart', l:'lungs', s:'spine', b:'brain' }; const order = Object.keys(assemblies); if (/^[0-9]$/.test(k)) map[k] = order[(Number(k) + 9) % 10]; if (map[k]) (state.assembly === map[k] ? leaveAssembly() : enterAssembly(map[k])); });
}
/** Desktop keeps the muscles back until a view needs them; this fetches whatever is still missing. Phones load by button only. */
function loadRest(){ if (mobile || !state.ready || manifest.files.every(f => f.loaded)) return Promise.resolve(); return loadStage('detail'); }
/** One step down the quality ladder: ambient occlusion, then shadows, then resolution. */
function stepDown(){
 quality.level++;
 if (quality.level === 1) { if (!state.fx) return stepDown(); state.fx = false; $('fx-toggle').setAttribute('aria-pressed', 'false'); }
 else if (quality.level === 2) { if (!state.ao) return stepDown(); state.ao = false; $('ao-toggle').setAttribute('aria-pressed', 'false'); }
 else if (quality.level === 3) { if (!keyLight.castShadow) return stepDown(); keyLight.castShadow = false; }
 else { renderer.setPixelRatio(1); resizeStage(); quality.auto = false; }
 $('quality-note').textContent = ['Reflection, glow and depth of field were switched off to keep the studio smooth. Turn Effects back on any time.', 'Shadowing was switched off to keep the studio smooth. Turn it back on any time.', 'Shadows were switched off to keep the studio smooth.', 'Resolution was lowered to keep the studio smooth.'][quality.level - 1]; $('quality-note').hidden = false; invalidate(4);
}

// ---------------------------------------------------------------- shareable links
function syncURL(){
 if (applyingURL || !state.ready) return; clearTimeout(urlTimer);
 urlTimer = setTimeout(() => { if (applyingURL || state.sequence) return; const a = state.assembly && assemblies[state.assembly], mode = state.restoreMode || state.mode, x = Math.round(state.target * 100);
  writeURL({ assembly:state.assembly, side:a?.paired ? state.assemblySide : null, piece:state.quiz ? null : state.selected?.id, mode:mode !== DEFAULT_MODE ? mode : null, system:state.system !== 'all' ? state.system : null, amount:(a ? x < 100 : x > 0) ? state.target : null, board:state.board }, { push:state.assembly !== lastURLAssembly });   // opening or leaving a study is a step Back can undo
  lastURLAssembly = state.assembly; }, 200);
}
async function applyURL(u, { initial = false } = {}){
 applyingURL = true; clearTimeout(urlTimer);
 try {
  const wanted = assemblies[u.assembly] ? u.assembly : null, mode = modes.includes(u.mode) ? u.mode : initial ? null : DEFAULT_MODE;
  if (state.assembly && state.assembly !== wanted) leaveAssembly();
  if (mode && mode !== (state.restoreMode || state.mode)) { setMode(mode, { user:true }); if (mode !== 'organs') loadRest(); }
  if (wanted && (state.assembly !== wanted || (assemblies[wanted].paired && u.side && u.side !== state.assemblySide))) await enterAssembly(wanted, u.side);
  if (u.board !== state.board && !state.assembly) toggleBoard(u.board);
  const system = manifest.files.some(f => f.id === u.system) ? u.system : 'all';
  if (!state.assembly && system !== state.system) { if (system !== 'all') await loadFiles([system]); state.system = system; $('system').value = system; selectPart(null); updateList(); section.refit(); }
  if (u.amount != null) setAmount(u.amount); else if (!initial && !state.board) setAmount(state.assembly ? 1 : 0);
  if (pieceById.has(u.piece)) await choosePiece(u.piece, { focus:initial && !state.board }); else if (!initial && state.selected) selectPart(null);
 } finally { applyingURL = false; lastURLAssembly = state.assembly; }
}

// ---------------------------------------------------------------- guided tours
function startStudyTour(){
 const id = state.assembly; if (!id) return; tour.end(); const a = assemblies[id];
 const stops = [{ title:a.title, text:a.description, run:() => { state.isolated = false; selectPart(null); setAmount(1, { animate:state.amount < .999 }); } }], seen = new Set();
 for (const l of landmarks) { if (l.kind !== 'assembly' || l.anchor || seen.has(l.part.id)) continue; seen.add(l.part.id); const part = l.part;   // anchored landmarks mark a point (apex, hilum), not a piece
  stops.push({ title:plain(part), text:pieceNotes[part.name] || (async () => summary(await describe(part))), run:() => { state.isolated = false; if (state.target < .999) setAmount(1); selectPart(part); focusSelected(2.4); } }); }   // a tour stop keeps the neighbours in view
 stops.push({ title:'Back together', text:`${assemblyMembers(id).length} pieces, reassembled. Drag the slider to take the study apart at your own pace, or label every piece to see all the names.`, run:() => { selectPart(null); setAmount(0, { animate:true }); } });
 tourKind = 'study'; tour.start(a.title.toUpperCase(), stops);
}
function startBodyTour(){
 tour.end(); if (state.assembly) leaveAssembly(); if (state.board) toggleBoard(false); const before = state.mode;
 const show = async id => { if (id !== 'all') await loadFiles([id]); state.system = id; $('system').value = id; state.isolated = false; selectPart(null); updateList(); section.refit(); setAmount(0, { animate:state.amount > .01 }); };
 const stops = [{ title:'The body, assembled', text:`${manifest.stats.pieces.toLocaleString()} named pieces in ten systems, standing ${manifest.height.toFixed(2)} m tall. Each stop shows one system on its own.`, run:async () => { if (state.mode !== 'realistic') setMode('realistic'); loadRest(); await show('all'); } }];
 for (const f of manifest.files) stops.push({ title:fileLabels[f.id], text:`${systemNotes[f.id] || fallbackCopy[f.id]} (${f.pieces.toLocaleString()} pieces in this model.)`, run:() => show(f.id) });
 stops.push({ title:'Every piece, revealed', text:'All the loaded systems again, pulled apart around the skeleton. Click any piece to read about it, or open one of the nested studies.', run:async () => { await show('all'); setAmount(1, { animate:true }); } });
 tourKind = 'body'; tour.start('THE BODY', stops); tourRestore = before;
}

function tick(now){
 const dt = Math.min(Math.max(now - last, 0) / 1000, .05); last = now;
 if (state.sequence) { state.sequenceTime += dt; const t = state.sequenceTime; const v = t < 1 ? 0 : t < 6 ? (t - 1) / 5 : t < 9 ? 1 : t < 14 ? 1 - (t - 9) / 5 : 0; state.target = v; updateUI(); if (t >= 15) stopSequence();
  if (!state.assembly) { const target = baseTarget.clone().add(new THREE.Vector3(0, v * .12, v * .25)); const direction = camera.position.clone().sub(controls.target).normalize(); const distance = new THREE.Vector3().fromArray(views[state.view]).sub(baseTarget).length() * (1 + v * 1.05) * Math.max(1, Math.sqrt(1.4 / camera.aspect)); controls.target.lerp(target, .05); camera.position.lerp(target.addScaledVector(direction, distance), .05); } }
 if (explodeTween) { const t = Math.min(1, (now - explodeTween.start) / explodeTween.duration), ease = t * t * (3 - 2 * t); state.amount = THREE.MathUtils.lerp(explodeTween.from, explodeTween.to, ease); if (t === 1) { state.amount = explodeTween.to; explodeTween = null; } updateUI(); }
 else { state.amount = THREE.MathUtils.damp(state.amount, state.target, reducedMotion ? 1000 : 5, dt); if (Math.abs(state.amount - state.target) < .0001) state.amount = state.target; }
 const alive = life.on && state.ready && !state.board && !state.quiz ? 1 - THREE.MathUtils.smoothstep(state.amount, 0, .06) : 0;   // eases out as the body starts to separate
 if (alive > 0) { life.advance(dt); invalidate(2); }
 const repose = alive > 0 || life.getState().weight > 0;
 if (state.ready && (lastApplied !== state.amount || repose)) { const t = state.amount, spread = THREE.MathUtils.smoothstep(t, explodeSchedule.spreadStart, explodeSchedule.spreadEnd);
  for (const p of parts) { if (state.assembly) { if (p.assemblyOffset) p.mesh.position.copy(p.base).addScaledVector(p.assemblyOffset, t); else p.mesh.position.copy(p.base); } else { const k = state.only === 'all' || p.file === state.only ? 1 : 0, ti = Math.min(1, Math.max(0, (t - p.lag) / LAG_SPAN)), si = ti === t ? spread : THREE.MathUtils.smoothstep(ti, explodeSchedule.spreadStart, explodeSchedule.spreadEnd); p.mesh.position.copy(p.base).addScaledVector(p.offset, ti * k).addScaledVector(p.spread, si * k); } }
  if ((state.assembly && ((lastApplied < .05) !== (t < .05))) || (state.mode === 'skin' && ((lastApplied < .02) !== (t < .02)))) updateVisibility();
  lastApplied = state.amount;
  if (repose) life.apply(parts, alive); }
 if (viewTween) { const t = Math.min(1, (now - viewTween.start) / (viewTween.duration || 900)), s = t * t * (3 - 2 * t);
  if (!viewTween.arc) { const a = viewTween.from.clone().sub(viewTween.fromTarget), b = viewTween.to.clone().sub(viewTween.toTarget), ra = a.length(), rb = b.length(); a.normalize(); b.normalize(); viewTween.arc = { a, ra, rb, turn:new THREE.Quaternion().setFromUnitVectors(a, b), q:new THREE.Quaternion() }; }
  const arc = viewTween.arc; controls.target.lerpVectors(viewTween.fromTarget, viewTween.toTarget, s);
  camera.position.copy(arc.a).applyQuaternion(arc.q.identity().slerp(arc.turn, s)).multiplyScalar(THREE.MathUtils.lerp(arc.ra, arc.rb, s)).add(controls.target);   // direction turns, distance eases
  if (t === 1) viewTween = null; }
 const moved = controls.update(dt);
 if (moved || alwaysRender || state.sequence || explodeTween || viewTween || controls.autoRotate || state.amount !== state.target || state.loading || hi.loading.size) invalidate(3);
 if (renderFrames <= 0) { quality.last = 0; return; }   // nothing changed: leave the last frame on screen
 renderFrames--; rendered++;
 if (state.ready && state.detail && !state.board && (++hi.frame % 10 === 0 || renderFrames === 0)) lodPass();
 if (!state.board) { const under = camera.position.y < -.1; for (const o of studioObjects) o.visible = !under; }   // from underneath, the floor and platform would hide the body
 const placed = []; const W = renderer.domElement.clientWidth, H = renderer.domElement.clientHeight;
 for (const l of landmarks) { const show = !state.board && !state.quiz && l.part.mesh.visible && (l.kind === 'assembly' ? state.amount > .35 && !state.labelAll : l.kind === 'all' ? state.amount > .35 : state.labels && !state.assembly); l.el.hidden = !show; if (!show) continue; const anchor = l.anchor ? l.anchor.clone() : l.part.center.clone(); const p = anchor.add(l.part.mesh.position).sub(l.part.base).project(camera); l.el.hidden = Math.abs(p.x) > .95 || Math.abs(p.y) > .95 || p.z > 1; if (l.el.hidden) continue; l.x = (p.x * .5 + .5) * W; l.y = (-p.y * .5 + .5) * H; l.depth = p.z; l.priority = l.part.size.length(); placed.push(l); }
 // Layout lives in labels.js: floating labels are nudged apart, "label every piece" goes to a column down each side.
 const layout = layoutLabels(placed, W, H);
 if (layout.leaders !== lastLeaders) { $('leaders').innerHTML = layout.leaders; lastLeaders = layout.leaders; }
 const note = layout.total > layout.shown ? `${layout.shown} OF ${layout.total} LABELS SHOWN · ZOOM IN FOR THE REST` : ''; if (note !== labelNote) { labelNote = note; $('label-note').textContent = note; $('label-note').hidden = !note; }
 section.frame(parts, !state.board);
 const planes = section.planes, fx = state.fx && !state.board;
 for (const m of [skinDepthMaterial, gtaoPass.normalMaterial]) if ((m.clippingPlanes || null) !== planes) { m.clippingPlanes = planes; m.needsUpdate = true; }   // helpers and the occlusion pass honour the cut
 outline.update(camera, H, planes);
 mirror.visible = fx && !section.active && camera.position.y > -.1; mirror.userData.fresh = false;   // a section's cap quads need a stencil buffer the mirror does not have
 gtaoPass.enabled = state.ao; bloomPass.enabled = fx; bokehPass.enabled = fx && state.dof && !!state.selected && !section.active;
 if (bokehPass.enabled) { const p = state.selected; bokehPass.camera = camera; bokehPass.uniforms.focus.value = _v.copy(p.center).add(p.mesh.position).sub(p.base).distanceTo(camera.position); }
 if ((state.ao || fx) && !state.board) { renderPass.camera = camera; gtaoPass.camera = camera; composer.render(); } else renderer.render(scene, camera);
 if (quality.auto && state.ready && !state.loading && !hi.loading.size) { const t = performance.now(), gap = t - quality.last; quality.last = t;
  if (gap < 5000 && t !== gap) { quality.slow = gap > 50 ? quality.slow + 1 : Math.max(0, quality.slow - 2); if (quality.slow > 45) { quality.slow = 0; stepDown(); } } }   // only back-to-back frames count (last is zeroed whenever a frame is skipped): about 45 of them under 20 fps
}

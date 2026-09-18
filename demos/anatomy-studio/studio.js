import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';
import { GLTFLoader } from './vendor/GLTFLoader.js';
import { MeshoptDecoder } from './vendor/meshopt_decoder.module.js';
import { PartsBoard } from './parts-board.js';
import { finishMaterial, studioEnvironment, fileLabels, fileColors, modes } from './materials.js';
import { assemblies, bodyLandmarks, assemblyContext, assemblyOffset } from './assemblies.js';
import { bodyOffset, bodySpread, explodeSchedule } from './explode-rules.js';

const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.search);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = matchMedia('(max-width: 760px)').matches || (matchMedia('(pointer: coarse)').matches && innerWidth < 900);
const verifyQuality = params.get('quality') === 'verify';
const state = { ready:false, amount:0, target:0, sequence:false, sequenceTime:0, selected:null, isolated:false, system:'all', mode:'xray', view:'hero', board:false, assembly:null, labels:false, stage:'none', loading:false, rotate:false };
const parts = [], partsById = new Map(), landmarks = [], raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
let manifest, descriptions = null, renderer, controls, camera, scene, model, last = performance.now(), pointerStart = null, viewTween = null, lastApplied = -1, explodeTween = null;
let board = null, bodyCamera, bodyControls, boardControls, studioObjects = [], studioFog, boardKey = '', boardDirty = true, keyLight;
const baseTarget = new THREE.Vector3(0, .9, 0);
const views = { hero:[2.1, 1.7, 2.9], front:[0, .95, 3.8], side:[3.8, .95, 0], back:[0, .95, -3.8], top:[.01, 4.4, .01] };
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
 renderer = new THREE.WebGLRenderer({ antialias:!verifyQuality, alpha:true, powerPreference:'high-performance' });
 renderer.setPixelRatio(verifyQuality ? 1 : Math.min(devicePixelRatio, 1.7)); renderer.setClearColor('#090e14', 0);
 renderer.shadowMap.enabled = !verifyQuality && !mobile; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
 renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
 host.appendChild(renderer.domElement);
 camera = new THREE.PerspectiveCamera(36, 1, .03, 120); camera.position.fromArray(views.hero);
 controls = new OrbitControls(camera, renderer.domElement); controls.target.copy(baseTarget); controls.enableDamping = true; controls.dampingFactor = .065;
 controls.minDistance = .25; controls.maxDistance = 20; controls.maxPolarAngle = Math.PI * .49; controls.autoRotateSpeed = .55; controls.enablePan = true;
 controls.addEventListener('start', () => { viewTween = null; document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active')); });
 scene.environment = studioEnvironment(renderer); scene.environmentIntensity = .75;
 scene.add(new THREE.HemisphereLight('#f3e9e2', '#1d2429', .6));
 keyLight = new THREE.DirectionalLight('#fff1e6', 2.0); keyLight.position.set(2.2, 4.5, 3); keyLight.castShadow = renderer.shadowMap.enabled; keyLight.shadow.mapSize.set(2048, 2048); keyLight.shadow.camera.left = -2.6; keyLight.shadow.camera.right = 2.6; keyLight.shadow.camera.top = 3; keyLight.shadow.camera.bottom = -.5; keyLight.shadow.camera.near = .5; keyLight.shadow.camera.far = 14; keyLight.shadow.normalBias = .004; keyLight.shadow.bias = -.00004; scene.add(keyLight);
 const rim = new THREE.DirectionalLight('#9fd3ff', 1.5); rim.position.set(-3, 2.5, -2.5); scene.add(rim);
 const fill = new THREE.DirectionalLight('#ffd9c4', .7); fill.position.set(2.5, 1.2, -3); scene.add(fill);
 const platform = new THREE.Mesh(new THREE.CylinderGeometry(1.32, 1.36, .13, 128), new THREE.MeshStandardMaterial({ color:'#0b1017', metalness:.2, roughness:.6, envMapIntensity:.12 })); platform.position.y = -.065; platform.receiveShadow = true; scene.add(platform);
 const ring = new THREE.Mesh(new THREE.TorusGeometry(1.34, .008, 8, 192), new THREE.MeshBasicMaterial({ color:'#f5b39c' })); ring.rotation.x = Math.PI / 2; ring.position.y = -.002; scene.add(ring);
 const inner = new THREE.Mesh(new THREE.TorusGeometry(1.22, .0025, 6, 160), new THREE.MeshBasicMaterial({ color:'#44525b' })); inner.rotation.x = Math.PI / 2; inner.position.y = .003; scene.add(inner);
 const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color:'#010204', roughness:.95, metalness:0, envMapIntensity:.04 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -.14; floor.receiveShadow = true; scene.add(floor);
 const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = shadowCanvas.height = 128; const ctx = shadowCanvas.getContext('2d'), gradient = ctx.createRadialGradient(64, 64, 8, 64, 64, 64); gradient.addColorStop(0, 'rgba(0,0,0,.6)'); gradient.addColorStop(.5, 'rgba(0,0,0,.35)'); gradient.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gradient; ctx.fillRect(0, 0, 128, 128);
 const contact = new THREE.Mesh(new THREE.PlaneGeometry(1.1, .8), new THREE.MeshBasicMaterial({ map:new THREE.CanvasTexture(shadowCanvas), transparent:true, depthWrite:false })); contact.rotation.x = -Math.PI / 2; contact.position.y = .004; scene.add(contact);
 const positions = []; for (let i = 0; i < 96; i++) { const a = i / 96 * Math.PI * 2, r = i % 8 === 0 ? 1.12 : 1.16; positions.push(Math.cos(a) * r, .003, Math.sin(a) * r, Math.cos(a) * 1.2, .003, Math.sin(a) * 1.2); }
 scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)), new THREE.LineBasicMaterial({ color:'#64717a', transparent:true, opacity:.32 })));
 bodyCamera = camera; bodyControls = controls; studioFog = scene.fog; studioObjects = scene.children.filter(o => o.isMesh || o.isLineSegments);
 const resize = () => { const w = host.clientWidth, h = host.clientHeight; renderer.setSize(w, h); bodyCamera.aspect = w / h; bodyCamera.updateProjectionMatrix(); if (state.ready) { if (state.board) reflowBoard(true); else setView(state.view, true); } }; new ResizeObserver(resize).observe(host); resize();
 renderer.domElement.addEventListener('webglcontextlost', e => { e.preventDefault(); fail(new Error('WebGL context lost')); });
 renderer.domElement.addEventListener('pointerdown', e => pointerStart = { x:e.clientX, y:e.clientY });
 renderer.domElement.addEventListener('pointerup', e => { if (pointerStart && Math.hypot(e.clientX - pointerStart.x, e.clientY - pointerStart.y) < 6) { const hit = pick(e); if (hit) selectPart(hit.userData.part); } pointerStart = null; });
 let lastMove = 0;
 renderer.domElement.addEventListener('pointermove', e => { if (e.buttons || !state.ready) { $('tooltip').hidden = true; return; } if (performance.now() - lastMove < 40) return; lastMove = performance.now(); const hit = pick(e); renderer.domElement.style.cursor = hit ? 'pointer' : 'grab'; $('tooltip').hidden = !hit; if (hit) { const r = host.getBoundingClientRect(); $('tooltip').textContent = hit.userData.part.label; $('tooltip').style.left = `${Math.min(e.clientX - r.left + 15, r.width - 230)}px`; $('tooltip').style.top = `${e.clientY - r.top + 18}px`; } });
 renderer.domElement.addEventListener('pointerleave', () => { $('tooltip').hidden = true; pointerStart = null; });
 bindControls(); renderer.setAnimationLoop(tick);
}

async function loadStudio(){
 manifest = await (await fetch('./manifest.json?v=2')).json();
 $('piece-total').textContent = manifest.stats.pieces.toLocaleString();
 model = new THREE.Group(); model.name = 'Human body'; scene.add(model);
 const select = $('system'); select.replaceChildren(new Option('Complete body', 'all'), ...manifest.files.map(f => new Option(fileLabels[f.id] || f.id, f.id)));
 const requested = params.get('stage'); const target = requested && stageOrder.includes(requested) ? requested : requested === 'full' ? 'detail' : mobile ? 'core' : 'detail';
 await loadStage('core');
 state.ready = true; document.body.dataset.ready = 'true'; $('loading').hidden = true;
 for (const id of ['explode-button', 'animate', 'reset', 'all-parts']) $(id).disabled = false;
 document.querySelectorAll('[data-assembly]').forEach(b => b.disabled = false);
 updateList(); updateUI(); setView('hero', true);
 window.anatomyStudio = {
  getState:() => ({ ready:state.ready, pieces:parts.length, visible:parts.filter(p => p.mesh.visible).length, amount:state.amount, target:state.target, selected:state.selected?.label ?? null, isolated:state.isolated, system:state.system, board:state.board, mode:state.mode, assembly:state.assembly, stage:state.stage, loading:state.loading, triangles:renderer.info.render.triangles, drawCalls:renderer.info.render.calls, files:manifest.files.filter(f => f.loaded).map(f => f.id) }),
  getParts:() => parts.map(p => ({ id:p.id, name:p.name, side:p.side, file:p.file, region:p.region, position:p.mesh.position.toArray(), base:p.base.toArray(), inAssembly:!!(state.assembly && p.assembly === state.assembly) })),
  getAssembly:id => { const a = assemblies[id]; if (!a) return null; const members = parts.filter(p => p.assemblies.includes(id)); return { members:members.map(p => p.id), primary:members.filter(p => a.primary?.(p.piece)).map(p => p.id), rectangles:projectedRectangles(members.filter(p => p.mesh.visible)) }; },
  getBoardRectangles:() => board ? board.rectangles() : [],
  loadStage, enterAssembly, leaveAssembly, setMode, setAmount, reset, getManifest:() => manifest
 };
 const initialView = params.get('view'), initialAssembly = params.get('assembly');
 if (initialAssembly && assemblies[initialAssembly]) await enterAssembly(initialAssembly);
 else if (initialView === 'parts') toggleBoard(true);
 if (target !== 'core') loadStage(target);
}

async function loadFiles(ids){
 const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder); const env = manifest.envelope;
 for (const f of manifest.files.filter(f => ids.includes(f.id) && !f.loaded && !f.loadingPromise)) {
  f.loadingPromise = (async () => {
   const gltf = await loader.loadAsync(`./${f.path}?v=2`, progress => { if (progress.total) { const pct = Math.round(progress.loaded / progress.total * 100); $('load-progress').textContent = `Loading ${fileLabels[f.id].toLowerCase()} · ${pct}%`; $('stage-status').textContent = `LOADING ${fileLabels[f.id].toUpperCase()} · ${pct}%`; } });
   gltf.scene.updateMatrixWorld(true); const meshes = []; gltf.scene.traverse(o => { if (o.isMesh) meshes.push(o); });
   for (const mesh of meshes) {
    const piece = manifest.pieces.find(p => p.id === mesh.userData.id) || manifest.pieces.find(p => p.id === mesh.parent?.userData.id); if (!piece) continue;
    model.attach(mesh); const index = parts.length;
    const part = { id:piece.id, piece, mesh, file:piece.file, group:piece.file, short:fileLabels[piece.file], name:piece.name, side:piece.side, region:piece.region, path:piece.path, parent:piece.parent, merged:piece.merged, triangles:piece.triangles, index, label:`${piece.name}${piece.side === 'M' ? '' : ` (${piece.side === 'L' ? 'left' : 'right'})`} · ${String(index + 1).padStart(4, '0')}`, base:mesh.position.clone(), center:new THREE.Vector3().fromArray(piece.center), size:new THREE.Vector3().fromArray(piece.size), assemblies:Object.keys(manifest.assemblies).filter(a => manifest.assemblies[a].includes(piece.id)) };
    part.assembly = part.assemblies[0] || null;
    finishMaterial(mesh, piece, state.mode); captureMaterial(part);
    mesh.castShadow = !mesh.material.transparent; mesh.receiveShadow = true; mesh.userData.part = part; mesh.frustumCulled = true;
    part.offset = new THREE.Vector3().fromArray(bodyOffset(piece, env)); part.spread = new THREE.Vector3().fromArray(bodySpread(piece, index, part.assemblies.length > 0));
    parts.push(part); partsById.set(part.id, part);
   }
   f.loaded = true; boardDirty = true; lastApplied = -1; $('part-count').textContent = parts.length.toLocaleString();
  })();
  await f.loadingPromise;
 }
 buildBodyLandmarks(); updateList(); updateVisibility();
}
async function loadStage(name){
 const idx = stageOrder.indexOf(name); if (idx < 0) return;
 state.loading = true; $('stage-status').hidden = false;
 for (const s of stageOrder.slice(0, idx + 1)) { await loadFiles(manifest.stages[s]); state.stage = s; }
 state.loading = false; $('stage-status').hidden = true; updateStageUI();
}
function updateStageUI(){
 const next = stageOrder[stageOrder.indexOf(state.stage) + 1]; const btn = $('load-more');
 btn.hidden = !next; if (next) btn.textContent = next === 'muscles' ? '⤓ Load the muscles' : '⤓ Load vessels, nerves, lymphatics & skin';
 $('stage-note').textContent = state.stage === 'detail' ? `Every system loaded · ${parts.length.toLocaleString()} pieces` : `${parts.length.toLocaleString()} of ${manifest.stats.pieces.toLocaleString()} pieces loaded`;
}
function captureMaterial(part){ const m = part.mesh.material; part.opacity = m.opacity; part.transparent = m.transparent; part.depthWrite = m.depthWrite; part.emissive = m.emissive.clone(); part.emissiveIntensity = m.emissiveIntensity; }
function setMode(mode){ if (!modes.includes(mode)) return; state.mode = mode; for (const p of parts) { p.mesh.material.dispose(); finishMaterial(p.mesh, p.piece, mode); captureMaterial(p); p.mesh.castShadow = !p.mesh.material.transparent; } document.querySelectorAll('[data-mode]').forEach(b => { b.classList.toggle('active', b.dataset.mode === mode); b.setAttribute('aria-pressed', b.dataset.mode === mode); }); boardDirty = true; updateVisibility(); }

function buildBodyLandmarks(){
 for (const l of landmarks.filter(l => l.kind === 'body')) l.el.remove(); for (let i = landmarks.length - 1; i >= 0; i--) if (landmarks[i].kind === 'body') landmarks.splice(i, 1);
 const seen = new Set();
 for (const l of bodyLandmarks) { if (seen.has(l.file)) continue; const part = parts.find(p => p.file === l.file && p.name === l.piece && (!l.side || p.side === l.side)); if (!part) continue; seen.add(l.file); const el = document.createElement('span'); el.className = 'landmark'; el.textContent = l.label; $('labels').append(el); landmarks.push({ el, part, kind:'body' }); }
}
function projectedRectangles(list){ model.updateMatrixWorld(true); camera.updateMatrixWorld(true); return list.map(p => { const b = new THREE.Box3().setFromObject(p.mesh), min = [Infinity, Infinity], max = [-Infinity, -Infinity]; for (let i = 0; i < 8; i++) { const v = new THREE.Vector3(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z).project(camera); min[0] = Math.min(min[0], v.x); min[1] = Math.min(min[1], v.y); max[0] = Math.max(max[0], v.x); max[1] = Math.max(max[1], v.y); } return { id:p.id, min, max, center:p.center.clone().add(p.mesh.position).sub(p.base).toArray() }; }); }

function pick(e){ const rect = renderer.domElement.getBoundingClientRect(); pointer.set((e.clientX - rect.left) / rect.width * 2 - 1, -(e.clientY - rect.top) / rect.height * 2 + 1); raycaster.setFromCamera(pointer, camera); const meshes = state.board ? board.visible.flatMap(x => [x.mesh, x.plane]) : parts.filter(p => p.mesh.visible).map(p => p.mesh); const hits = raycaster.intersectObjects(meshes, false); const hit = hits.find(h => !state.board || true); return hit?.object; }
function ensureBoard(){ if (board && !boardDirty) return; if (board) { scene.remove(board.group); } $('scene-status').textContent = 'LAYING OUT THE BOARD'; board = new PartsBoard(parts); scene.add(board.group); boardDirty = false; boardKey = ''; }
function reflowBoard(force = false){ if (!board) return; const key = parts.filter(p => p.mesh.visible).map(p => p.id).join(','); if (force || key !== boardKey) { boardKey = key; board.layout($('viewport').clientWidth, $('viewport').clientHeight, p => p.mesh.visible); boardControls?.target.set(0, 0, 0); if (state.board) window.scrollTo(0, 0); } $('board-count').textContent = `${board.visible.length} / ${parts.length} PIECES`; }
function toggleBoard(on){
 if (!state.ready) return; stopSequence(); viewTween = null; if (on) ensureBoard(); state.board = on; document.body.classList.toggle('board-mode', on); $('all-parts').setAttribute('aria-pressed', on); $('board-header').hidden = !on; model.visible = !on; if (board) board.group.visible = on; studioObjects.forEach(o => o.visible = !on); scene.fog = on ? null : studioFog; controls.enabled = false;
 if (on) { camera = board.camera; if (!boardControls) { boardControls = new OrbitControls(camera, renderer.domElement); boardControls.enableRotate = false; boardControls.screenSpacePanning = true; boardControls.mouseButtons.LEFT = THREE.MOUSE.PAN; boardControls.minZoom = .3; boardControls.maxZoom = 30; boardControls.enableDamping = false; } else boardControls.object = camera; controls = boardControls; controls.enabled = true; controls.autoRotate = false; board.select(state.selected); reflowBoard(true); window.scrollTo(0, 0); }
 else { camera = bodyCamera; controls = bodyControls; controls.enabled = true; setView(state.view, true); }
 updateUI();
}
function setView(name, immediate = false){
 if (state.board) toggleBoard(false);
 state.view = name; const aspectFactor = Math.max(1, Math.sqrt(1.4 / camera.aspect)), factor = (1 + state.target * (state.assembly ? 0 : 1.05)) * aspectFactor;
 const target = state.assembly ? assemblyTarget() : baseTarget.clone().add(new THREE.Vector3(0, state.target * .12, state.target * .25));
 const dir = state.assembly ? new THREE.Vector3().fromArray(assemblies[state.assembly].view).normalize() : new THREE.Vector3().fromArray(views[name]).sub(baseTarget).normalize();
 const distance = state.assembly ? assemblyDistance() : new THREE.Vector3().fromArray(views[name]).sub(baseTarget).length() * factor;
 const destination = target.clone().addScaledVector(dir, distance);
 if (immediate || reducedMotion) { camera.position.copy(destination); controls.target.copy(target); viewTween = null; } else viewTween = { start:performance.now(), from:camera.position.clone(), to:destination, fromTarget:controls.target.clone(), toTarget:target };
 document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === name && !state.assembly));
}
function setAmount(value, { fit = true, manual = true, animate = false } = {}){
 if (!state.ready) return; if (state.board) toggleBoard(false); if (manual) stopSequence();
 state.target = THREE.MathUtils.clamp(value, 0, 1);
 const duration = reducedMotion ? 1600 : 3200;
 explodeTween = animate ? { start:performance.now(), from:state.amount, to:state.target, duration } : null;
 if (reducedMotion && !animate) state.amount = state.target;
 updateUI(); if (fit) { setView(state.view); if (animate && viewTween) viewTween.duration = duration; }
}
function updateUI(){
 const shown = explodeTween ? state.amount : state.target;
 $('explode').value = Math.round(shown * 100); $('amount').innerHTML = `${String(Math.round(shown * 100)).padStart(3, '0')}<span>%</span>`;
 $('assembly-state').textContent = explodeTween ? (state.target > state.amount ? 'Separating the systems…' : 'Bringing it together…') : state.assembly ? (state.target < .5 ? `${assemblies[state.assembly].title}, assembled.` : `${assemblies[state.assembly].title}, opened.`) : state.target < .01 ? 'Whole, and at rest.' : state.target < .4 ? 'Beneath the skin.' : state.target < .8 ? 'A study in separation.' : 'Every piece, revealed.';
 $('explode-button').innerHTML = state.target > .5 ? '↙ Reassemble' : '<span aria-hidden="true">↗</span> Explode the body';
 $('scene-status').textContent = state.board ? 'ALL-PARTS BOARD' : state.assembly ? `${assemblies[state.assembly].title.toUpperCase()} · NESTED STUDY` : state.isolated ? 'ISOLATED PIECE' : state.system !== 'all' ? `${fileLabels[state.system].toUpperCase()} STUDY` : state.target > .01 ? 'EXPLODED STUDY' : 'LIVE 3D / HUMAN ANATOMY';
}
function updateList(){
 const search = $('search').value.toLowerCase(); const options = parts.filter(p => (state.system === 'all' || p.file === state.system) && (!state.assembly || p.assemblies.includes(state.assembly)) && `${p.label} ${p.short} ${p.region} ${p.path}`.toLowerCase().includes(search));
 $('part-list').replaceChildren(new Option(options.length ? `Select a piece… (${options.length})` : 'No matching pieces', ''), ...options.map(p => new Option(`${p.short} / ${p.label}`, p.id)));
 $('part-list').value = state.selected?.id ?? '';
}
function updateVisibility(){
 for (const p of parts) { const selected = p === state.selected, mat = p.mesh.material, member = !state.assembly || p.assemblies.includes(state.assembly);
  p.mesh.visible = member && (state.system === 'all' || p.file === state.system) && (!state.isolated || selected);
  const o = state.assembly && p.assemblyLayer?.opacity != null && state.amount > .05 ? p.assemblyLayer.opacity : null;
  mat.opacity = o ?? p.opacity; mat.transparent = o != null || p.transparent; mat.depthWrite = o != null ? false : p.depthWrite;
  mat.emissive.copy(selected ? new THREE.Color('#49c8a3') : p.emissive); mat.emissiveIntensity = selected ? .45 : p.emissiveIntensity;
 }
 $('isolate').disabled = !state.selected; $('clear').disabled = !state.selected; $('isolate').textContent = state.isolated ? 'Show surrounding pieces' : 'Isolate piece'; $('isolate').setAttribute('aria-pressed', state.isolated);
 updateUI(); if (state.board && board) { board.select(state.selected); reflowBoard(); }
}
async function describe(part){
 if (!part.piece.descriptionKey) return fallbackCopy[part.file];
 if (!descriptions) { try { descriptions = await (await fetch('./descriptions.json?v=2')).json(); } catch { descriptions = {}; } }
 return descriptions[part.piece.descriptionKey] || fallbackCopy[part.file];
}
function selectPart(part){
 const wasIsolated = state.isolated; state.selected = part ?? null; if (!part) state.isolated = false;
 $('part-category').textContent = part ? `${part.short.toUpperCase()} / ${part.region.toUpperCase()} / PIECE ${String(part.index + 1).padStart(4, '0')}` : 'NO PIECE SELECTED';
 $('part-title').textContent = part ? part.label.replace(/ · \d+$/, '') : 'Curiosity starts with a click.';
 $('part-path').textContent = part ? part.path.replace(/ \/ /g, ' › ') : '';
 $('part-description').textContent = part ? 'Loading description…' : 'Select directly on the body or choose from the list. Each piece can be viewed on its own.';
 if (part) describe(part).then(text => { if (state.selected === part) $('part-description').textContent = text; });
 $('part-meta').textContent = part ? `${part.merged.length > 1 ? `${part.merged.length} merged structures` : 'Single structure'} · ${part.size.toArray().map(v => Math.round(v * 1000)).join(' × ')} mm · ${part.triangles.toLocaleString()} triangles${part.merged.length > 1 ? ` · includes ${part.merged.slice(0, 6).join(', ')}${part.merged.length > 6 ? '…' : ''}` : ''}` : '';
 $('part-list').value = part ? part.id : ''; updateVisibility();
 if (state.isolated) focusSelected(); else if (wasIsolated && !state.board) setView(state.view);
}
function focusSelected(){
 if (state.board || !state.selected) return; stopSequence(); model.updateMatrixWorld(true);
 const box = new THREE.Box3().setFromObject(state.selected.mesh), center = box.getCenter(new THREE.Vector3()), size = box.getSize(new THREE.Vector3());
 const radius = Math.max(.03, size.length() / 2), distance = radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) * Math.max(1, 1 / camera.aspect) * 1.2;
 const direction = camera.position.clone().sub(controls.target).normalize();
 viewTween = { start:performance.now(), from:camera.position.clone(), to:center.clone().addScaledVector(direction, distance), fromTarget:controls.target.clone(), toTarget:center };
}

// ---------------------------------------------------------------- nested assemblies
function assemblyMembers(id){ return parts.filter(p => p.assemblies.includes(id)); }
function assemblyBox(){ const b = new THREE.Box3(); for (const p of assemblyMembers(state.assembly)) { const c = p.center.clone().addScaledVector(p.assemblyOffset, state.target); b.expandByPoint(c.clone().sub(p.size.clone().multiplyScalar(.5))); b.expandByPoint(c.clone().add(p.size.clone().multiplyScalar(.5))); } return b; }
function assemblyTarget(){ return assemblyBox().getCenter(new THREE.Vector3()); }
function assemblyDistance(){ const a = assemblies[state.assembly]; const radius = assemblyBox().getSize(new THREE.Vector3()).length() / 2; return radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) * Math.max(1, 1 / camera.aspect) * (a.padding || 1.1); }
async function enterAssembly(id){
 const a = assemblies[id]; if (!a || !state.ready) return; if (state.board) toggleBoard(false); stopSequence();
 await loadFiles(a.files);
 state.assembly = id; state.system = 'all'; state.isolated = false; $('system').value = 'all';
 const members = assemblyMembers(id), ctx = assemblyContext(a, members.map(p => p.piece));
 for (const p of members) { const r = assemblyOffset(a, p.piece, ctx); p.assemblyOffset = new THREE.Vector3().fromArray(r.offset); p.assemblyLayer = r; }
 for (const l of landmarks.filter(l => l.kind === 'assembly')) l.el.remove(); for (let i = landmarks.length - 1; i >= 0; i--) if (landmarks[i].kind === 'assembly') landmarks.splice(i, 1);
 for (const l of a.landmarks || []) {
  let part = null, anchor = null;
  if (l.piece) part = members.find(p => p.name === l.piece && (!l.side || p.side === l.side)) || members.find(p => p.name === l.piece);
  if (l.anchor) { anchor = manifest.landmarks.find(x => x.name === l.anchor); if (anchor) { const pos = new THREE.Vector3().fromArray(anchor.position); part = members.reduce((best, p) => (!best || p.center.distanceTo(pos) < best.center.distanceTo(pos)) ? p : best, null); } }
  if (!part) continue; const el = document.createElement('span'); el.className = 'landmark landmark-assembly'; el.textContent = l.label; $('labels').append(el); landmarks.push({ el, part, kind:'assembly', anchor:anchor ? new THREE.Vector3().fromArray(anchor.position) : null });
 }
 document.querySelectorAll('[data-assembly]').forEach(b => { b.classList.toggle('active', b.dataset.assembly === id); b.setAttribute('aria-pressed', b.dataset.assembly === id); });
 $('assembly-panel').hidden = false; $('assembly-title').textContent = a.title; $('assembly-eyebrow').textContent = a.eyebrow; $('assembly-copy').textContent = a.description; $('assembly-count').textContent = `${members.length} pieces`;
 selectPart(null); updateList(); lastApplied = -1; controls.minDistance = .12;
 setAmount(1, { animate:true }); state.view = 'hero';
 const url = new URL(location); url.searchParams.set('assembly', id); history.replaceState(null, '', url);
}
function leaveAssembly(){
 if (!state.assembly) return; state.assembly = null; for (const p of parts) { p.assemblyOffset = null; p.assemblyLayer = null; }
 for (const l of landmarks.filter(l => l.kind === 'assembly')) l.el.remove(); for (let i = landmarks.length - 1; i >= 0; i--) if (landmarks[i].kind === 'assembly') landmarks.splice(i, 1);
 document.querySelectorAll('[data-assembly]').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); }); $('assembly-panel').hidden = true;
 controls.minDistance = .25; selectPart(null); updateList(); lastApplied = -1; state.target = 0; state.amount = reducedMotion ? 0 : state.amount; setAmount(0, { animate:true }); setView('hero');
 const url = new URL(location); url.searchParams.delete('assembly'); history.replaceState(null, '', url);
}

function stopSequence(){ explodeTween = null; state.sequence = false; $('animate').textContent = '▷ Play sequence'; }
function reset(){ if (state.board) toggleBoard(false); stopSequence(); if (state.assembly) leaveAssembly(); controls.minDistance = .25; state.target = 0; state.system = 'all'; state.isolated = false; state.labels = false; state.view = 'hero'; controls.autoRotate = false; state.rotate = false; $('system').value = 'all'; $('search').value = ''; for (const id of ['rotate', 'label-toggle']) $(id).setAttribute('aria-pressed', 'false'); selectPart(null); updateList(); updateUI(); setView('hero'); }
function bindControls(){
 $('explode').addEventListener('input', e => setAmount(Number(e.target.value) / 100));
 $('explode-button').onclick = () => setAmount(state.target > .5 ? 0 : 1, { animate:true });
 $('animate').onclick = () => { if (state.board) toggleBoard(false); if (state.sequence) { stopSequence(); return; } explodeTween = null; state.sequence = true; state.sequenceTime = 0; state.isolated = false; selectPart(null); $('animate').textContent = 'Ⅱ Pause sequence'; };
 $('all-parts').onclick = () => { if (!state.board) { state.system = 'all'; state.isolated = false; $('system').value = 'all'; selectPart(null); updateList(); } toggleBoard(!state.board); };
 $('fit-parts').onclick = () => { board.fit(); controls.target.set(0, 0, 0); window.scrollTo(0, 0); };
 $('return-body').onclick = () => toggleBoard(false);
 $('reset').onclick = reset;
 $('load-more').onclick = () => { const next = stageOrder[stageOrder.indexOf(state.stage) + 1]; if (next) loadStage(next); };
 document.querySelectorAll('[data-view]').forEach(b => b.onclick = () => { if (state.assembly) leaveAssembly(); setView(b.dataset.view); });
 document.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => setMode(b.dataset.mode));
 document.querySelectorAll('[data-assembly]').forEach(b => b.onclick = () => state.assembly === b.dataset.assembly ? leaveAssembly() : enterAssembly(b.dataset.assembly));
 $('leave-assembly').onclick = leaveAssembly;
 $('system').onchange = e => { state.system = e.target.value; selectPart(null); updateList(); };
 $('search').oninput = updateList;
 $('part-list').onchange = e => selectPart(e.target.value === '' ? null : partsById.get(e.target.value));
 $('isolate').onclick = () => { state.isolated = !state.isolated; updateVisibility(); if (state.board) return; if (state.isolated) focusSelected(); else setView(state.view); }; $('clear').onclick = () => selectPart(null);
 $('rotate').onclick = () => { if (state.board) toggleBoard(false); controls.autoRotate = !controls.autoRotate; state.rotate = controls.autoRotate; $('rotate').setAttribute('aria-pressed', controls.autoRotate); };
 $('label-toggle').onclick = () => { state.labels = !state.labels; $('label-toggle').setAttribute('aria-pressed', state.labels); };
 $('fullscreen').onclick = async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { $('fullscreen').textContent = 'Fullscreen unavailable'; } };
 document.addEventListener('fullscreenchange', () => { $('fullscreen').textContent = document.fullscreenElement ? '⛶ Exit fullscreen' : '⛶ Fullscreen'; });
 document.addEventListener('keydown', e => { if (/INPUT|SELECT|TEXTAREA|BUTTON/.test(e.target.tagName) || e.ctrlKey || e.metaKey || e.altKey || !state.ready) return; const k = e.key.toLowerCase(); if (k === 'e') setAmount(state.target > .5 ? 0 : 1, { animate:true }); if (k === 'r') reset(); if (e.key === 'Escape') { if (state.selected) selectPart(null); else if (state.assembly) leaveAssembly(); } const map = { h:'heart', l:'lungs', s:'spine', b:'brain' }; if (map[k]) (state.assembly === map[k] ? leaveAssembly() : enterAssembly(map[k])); });
}
function tick(now){
 const dt = Math.min((now - last) / 1000, .05); last = now;
 if (state.sequence) { state.sequenceTime += dt; const t = state.sequenceTime; const v = t < 1 ? 0 : t < 6 ? (t - 1) / 5 : t < 9 ? 1 : t < 14 ? 1 - (t - 9) / 5 : 0; state.target = v; updateUI(); if (t >= 15) stopSequence();
  if (!state.assembly) { const target = baseTarget.clone().add(new THREE.Vector3(0, v * .12, v * .25)); const direction = camera.position.clone().sub(controls.target).normalize(); const distance = new THREE.Vector3().fromArray(views[state.view]).sub(baseTarget).length() * (1 + v * 1.05) * Math.max(1, Math.sqrt(1.4 / camera.aspect)); controls.target.lerp(target, .05); camera.position.lerp(target.addScaledVector(direction, distance), .05); } }
 if (explodeTween) { const t = Math.min(1, (now - explodeTween.start) / explodeTween.duration), ease = t * t * (3 - 2 * t); state.amount = THREE.MathUtils.lerp(explodeTween.from, explodeTween.to, ease); if (t === 1) { state.amount = explodeTween.to; explodeTween = null; } updateUI(); }
 else { state.amount = THREE.MathUtils.damp(state.amount, state.target, reducedMotion ? 1000 : 5, dt); if (Math.abs(state.amount - state.target) < .0001) state.amount = state.target; }
 if (state.ready && lastApplied !== state.amount) { const t = state.amount, spread = THREE.MathUtils.smoothstep(t, explodeSchedule.spreadStart, explodeSchedule.spreadEnd);
  for (const p of parts) { if (state.assembly) { if (p.assemblyOffset) p.mesh.position.copy(p.base).addScaledVector(p.assemblyOffset, t); else p.mesh.position.copy(p.base); } else p.mesh.position.copy(p.base).addScaledVector(p.offset, t).addScaledVector(p.spread, spread); }
  if (state.assembly && ((lastApplied < .05) !== (t < .05))) updateVisibility();
  lastApplied = state.amount; }
 if (viewTween) { const t = Math.min(1, (now - viewTween.start) / (viewTween.duration || 900)), s = t * t * (3 - 2 * t); camera.position.lerpVectors(viewTween.from, viewTween.to, s); controls.target.lerpVectors(viewTween.fromTarget, viewTween.toTarget, s); if (t === 1) viewTween = null; }
 controls.update(dt);
 for (const l of landmarks) { const show = !state.board && l.part.mesh.visible && (l.kind === 'assembly' ? state.amount > .35 : state.labels && !state.assembly); l.el.hidden = !show; if (!show) continue; const anchor = l.anchor ? l.anchor.clone() : l.part.center.clone(); const p = anchor.add(l.part.mesh.position).sub(l.part.base).project(camera); l.el.hidden = Math.abs(p.x) > .95 || Math.abs(p.y) > .95 || p.z > 1; l.el.style.left = `${(p.x * .5 + .5) * renderer.domElement.clientWidth}px`; l.el.style.top = `${(-p.y * .5 + .5) * renderer.domElement.clientHeight}px`; }
 renderer.render(scene, camera);
}

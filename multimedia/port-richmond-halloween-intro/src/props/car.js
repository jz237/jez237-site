// v2 CARS (CAR agent): two instances of the game's fleet "Sedan2000s" (data/derived/kit_staging/vehicles, converted by
// tools/props/blender/car_build.py), both parked nose NE (-Z) in the NW lane.
//   car A (PLACES.carA): the hide car. POV-ready interior (src/props/carA_interior.js), rain-beaded glass
//     (carA_glass.js), SCARE ONE: the curb-side rear window shatters inward at CUES.windowSmash (shatter.js), the
//     car rocks (timings.js carARock), the street-side rear door is shoved open at CUES.carDoorOpen.
//   car B (PLACES.carB): the under car. Modelled underbody (underbody.js), close-range asphalt patch (asphalt.js),
//     puddle with reflections + rain/breath ripples (puddle.js), under-car drips (carB_drips.js), SCARE TWO: the head
//     clangs on the street-side sill at CUES.contact2 and the car rocks (carBRock).
// Contract (api + anchors): docs/car-notes.md. Everything is a pure function of t + src/film/cues.js.
import * as THREE from 'three';
import { CUES, PLACES } from '../film/cues.js';
import { carARock, carBRock, CAR_A_ROCK, CAR_B_ROCK, carARearDoorAngle, carADoorTimes } from './timings.js';
import { makeGlass } from './glass.js';
import { mergeStatic } from './geo.js';
import { kelvinRGB, noise1, smoothstep } from './util.js';
import { buildCarAInterior } from './carA_interior.js';
import { makeRainGlass } from './carA_glass.js';
import { buildShatter } from './shatter.js';
import { buildUnderbody } from './underbody.js';
import { buildAsphaltPatch } from './asphalt.js';
import { buildPuddle } from './puddle.js';
import { buildDrips } from './carB_drips.js';

// rocking pivot in the car frame (roll centre-ish, between the axles)
const PIVOT = new THREE.Vector3(0, 0.45, 0);
const WHEELS = { FL: [1.38, -0.7955], FR: [1.38, 0.7955], RL: [-1.38, -0.7955], RR: [-1.38, 0.7955] };
// car B = the game's fleet mid-size SUV (tools/props/blender/car_build_suv.py): more ground clearance than the sedan,
// so the victim fits under it and the slit between sill and asphalt shows the street (docs/car-notes.md, pass 1)
const WHEELS_SUV = { FL: [1.458, -0.849], FR: [1.458, 0.849], RL: [-1.458, -0.849], RR: [-1.458, 0.849] };

// ------------------------------------------------------------------------------------------------- materials
function baseMaterial(n, ctx) {
  const M = (key, make) => ctx.mat(key, make);
  const alias = { M_Car_Cladding: 'M_Plastic_Black', M_Car_Screen: 'M_Plastic_Black', M_Car_Carpet: 'M_Car_Dash', M_Car_Engine: 'M_Metal_Dark', M_Car_Mirror: 'M_Car_Chrome', M_Car_LampInner: 'M_Car_Chrome' };
  switch (alias[n] || n) {
    case 'M_Plastic_Black': return M('carBlackPlastic', () => new THREE.MeshStandardMaterial({ name: 'CarBlackPlastic', color: 0x111111, roughness: 0.6 }));
    case 'M_Car_Underbody': return M('carUnder', () => new THREE.MeshStandardMaterial({ name: 'CarUnderbody', color: 0x0d0d0c, roughness: 0.9 }));
    case 'M_Car_Light': return M('carLens', () => new THREE.MeshStandardMaterial({ name: 'CarLens', color: 0xb8c0c4, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.65 }));
    // named CarAmberLens (not CarAmber): v2 hazards are OFF (the v1 story code blinks materials named CarAmber)
    case 'M_Car_Amber': return M('carAmberLens', () => new THREE.MeshStandardMaterial({ name: 'CarAmberLens', color: 0x8a4a10, roughness: 0.25, transparent: true, opacity: 0.8 }));
    case 'M_Car_Tail': return M('carTail', () => new THREE.MeshStandardMaterial({ name: 'CarTail', color: 0x5a0606, roughness: 0.2, metalness: 0.1 }));
    case 'M_Car_Chrome': return M('carChrome', () => new THREE.MeshStandardMaterial({ name: 'CarChrome', color: 0x9a9a98, roughness: 0.22, metalness: 1 }));
    case 'M_Car_Headliner': return M('carHeadliner', () => new THREE.MeshStandardMaterial({ name: 'CarHeadliner', color: 0x8d877c, roughness: 0.95 }));
    case 'M_Car_Dash': return M('carDash', () => new THREE.MeshStandardMaterial({ name: 'CarDash', color: 0x2a2826, roughness: 0.7 }));
    case 'M_Car_LampEmit': return M('carLampEmit', () => new THREE.MeshStandardMaterial({ name: 'CarLampEmit', color: 0x777777, roughness: 0.3 }));
    case 'M_Metal_Dark': return M('carMetalDark', () => new THREE.MeshStandardMaterial({ name: 'CarMetalDark', color: 0x2a2a2a, roughness: 0.55, metalness: 0.8 }));
    case 'M_Car_Seat': return M('carSeat', () => new THREE.MeshStandardMaterial({ name: 'CarSeat', color: 0x5d5a55, roughness: 0.95 }));
    case 'M_Car_Plate': return M('carPlate', () => new THREE.MeshStandardMaterial({ name: 'CarPlate', color: 0xd8d8cc, roughness: 0.5 }));
    case 'M_Car_Tire': return M('carTire', () => new THREE.MeshStandardMaterial({ name: 'CarTire', color: 0x161616, roughness: 0.92 }));
    case 'M_Car_Rim': return M('carRim', () => new THREE.MeshStandardMaterial({ name: 'CarRim', color: 0x8c8c8a, roughness: 0.35, metalness: 1 }));
    case 'M_Car_Brake': return M('carBrake', () => new THREE.MeshStandardMaterial({ name: 'CarBrake', color: 0x4a3a30, roughness: 0.6, metalness: 0.7 }));
    case 'M_Car_Caliper': return M('carCaliper', () => new THREE.MeshStandardMaterial({ name: 'CarCaliper', color: 0x2a2a2a, roughness: 0.5, metalness: 0.5 }));
    default: return M('carDefault', () => new THREE.MeshStandardMaterial({ name: 'CarDefault', color: 0x333333, roughness: 0.6 }));
  }
}

// ------------------------------------------------------------------------------------------------- one sedan
// Hierarchy: root (world position + yaw) > fit (static road camber) > { wheels (static), rock (pivot, dynamic) >
// frame (car-frame coordinates: everything that moves with the body) }.
function buildSedan(ctx, gltf, { name, place, paint, glassFor, keepMesh = () => true, rootName = 'AbandonedCar', wheelsXZ = WHEELS, pivot = PIVOT }) {
  const scene = gltf.scene.clone(true);
  const src = scene.getObjectByName(rootName) || scene;
  const root = new THREE.Group(); root.name = name;
  const fit = new THREE.Group(); fit.name = name + '_fit';
  const wheels = new THREE.Group(); wheels.name = name + '_wheels';
  const rock = new THREE.Group(); rock.name = name + '_rock';
  const frame = new THREE.Group(); frame.name = name + '_frame';
  root.add(fit); fit.add(wheels, rock); rock.add(frame);
  rock.position.copy(pivot); frame.position.copy(pivot).negate();
  const nodes = {};
  const drop = [];
  src.traverse((o) => {
    if (o.name && !nodes[o.name]) nodes[o.name] = o;
    if (!o.isMesh) return;
    const mn = ((o.material && o.material.name) || '').replace(/\.\d+$/, '');
    o.userData.gameMat = mn;
    if (!keepMesh(o, mn)) { drop.push(o); return; }
    const isGlass = /^M_Car_Glass/.test(mn);
    o.material = mn === 'M_Car_Paint' ? paint : isGlass ? glassFor(o) : baseMaterial(mn, ctx);
    o.castShadow = !isGlass;
    o.receiveShadow = true;
    if (isGlass) o.renderOrder = 2;
  });
  for (const o of drop) o.parent && o.parent.remove(o);
  for (const c of [...src.children]) (/^CarWheel/.test(c.name) ? wheels : frame).add(c);
  // placement: glTF +X forward; PLACES yaw is the rotation of a +Z-forward model (PI = nose -Z)
  root.position.set(place.x, ctx.groundY(place.x, place.z), place.z);
  root.rotation.set(0, (place.yaw ?? Math.PI) - Math.PI / 2, 0);
  root.updateMatrixWorld(true);
  // fit the body to the road under the four tyre contact points (crown / gutter camber)
  const v = new THREE.Vector3();
  const wy = {};
  for (const [k, [x, z]] of Object.entries(wheelsXZ)) { v.set(x, 0, z).applyMatrix4(root.matrixWorld); wy[k] = ctx.groundY(v.x, v.z); }
  root.position.y = (wy.FL + wy.FR + wy.RL + wy.RR) / 4;
  const roll = Math.atan2(((wy.FL + wy.RL) - (wy.FR + wy.RR)) / 2, 2 * wheelsXZ.FR[1]); // left (-Z) minus right
  const pitch = Math.atan2(((wy.FL + wy.FR) - (wy.RL + wy.RR)) / 2, 2 * wheelsXZ.FL[0]);  // front minus rear
  fit.rotation.set(roll, 0, pitch, 'XZY');
  root.updateMatrixWorld(true);
  return { root, fit, wheels, rock, frame, nodes };
}

// rest-pose helpers: car-frame point -> world (unrocked), and live anchors that follow the rocking body
function makeAnchorKit(frameObj) {
  const live = [];
  const toWorld = (x, y, z) => new THREE.Vector3(x, y, z).applyMatrix4(frameObj.matrixWorld);
  return {
    toWorld,
    // a Vector3 that is re-evaluated from the car-frame point every update (rocks with the body)
    live(x, y, z, obj = frameObj) { const out = new THREE.Vector3(x, y, z).applyMatrix4(obj.matrixWorld); live.push({ out, local: new THREE.Vector3(x, y, z), obj }); return out; },
    liveDir(x, y, z, obj = frameObj) { const out = new THREE.Vector3(x, y, z).transformDirection(obj.matrixWorld); live.push({ out, local: new THREE.Vector3(x, y, z), obj, dir: true }); return out; },
    update() {
      for (const e of live) { if (e.dir) e.out.copy(e.local).transformDirection(e.obj.matrixWorld); else e.out.copy(e.local).applyMatrix4(e.obj.matrixWorld); }
    },
  };
}

// matrix that maps an unrocked world point to its rocked position: M = Pw * Rock(t) * Pw^-1
function makeRockMatrix(rockObj) {
  const Pw = new THREE.Matrix4(), PwInv = new THREE.Matrix4();
  rockObj.parent.updateMatrixWorld(true);
  Pw.copy(rockObj.parent.matrixWorld).multiply(new THREE.Matrix4().makeTranslation(PIVOT.x, PIVOT.y, PIVOT.z));
  PwInv.copy(Pw).invert();
  const R = new THREE.Matrix4(), e = new THREE.Euler();
  return (r, out = new THREE.Matrix4()) => {
    e.set(r.roll, 0, r.pitch, 'XZY');
    R.makeRotationFromEuler(e);
    R.elements[13] += r.heave;
    return out.copy(Pw).multiply(R).multiply(PwInv);
  };
}

// --------------------------------------------------------------------------------------------------- build
export async function buildCar(ctx) {
  const [gltf, gltfB] = await Promise.all([ctx.loadGLTF('car_sedan2000s.glb'), ctx.loadGLTF('car_suv_midsize.glb')]);
  const group = new THREE.Group();
  group.name = 'Cars';
  const q = ctx.quality;
  const envMap = ctx.envMap;
  const anchors = {};
  const sources = [];
  const updaters = [];
  let lightScale = 1;

  // ================================================================================================ CAR A
  const paintA = new THREE.MeshPhysicalMaterial({ name: 'CarPaintA', color: 0x8a8578, roughness: 0.42, metalness: 0.45, clearcoat: 0.55, clearcoatRoughness: 0.32, envMap });
  const rainA = makeRainGlass({ quality: q, envMap, seed: 11 });
  const smashGlassMat = makeRainGlass({ quality: q, envMap, seed: 23, smash: true });
  let smashGlassMesh = null;
  const A = buildSedan(ctx, gltf, {
    name: 'CarA', place: PLACES.carA, paint: paintA,
    glassFor: (o) => {
      // the curb-side rear door glass (the game's DoorRL glass) is the scare-one window
      let p = o; let isRL = false; while (p) { if (p.name === 'CarDoorRL' || p.name === 'abandonedCarRearGlass') isRL = true; p = p.parent; }
      if (isRL) { smashGlassMesh = o; return smashGlassMat.material; }
      return rainA.material;
    },
    // the boxy game seats are replaced by carA_interior.js; the game steering wheel is cut out of the dash below
    keepMesh: (o, mn) => mn !== 'M_Car_Seat',
  });
  group.add(A.root);
  // rain-glass pane coordinates (mesh space; inner/outer + pane classification in the car frame)
  A.root.updateMatrixWorld(true);
  const invA = new THREE.Matrix4().copy(A.frame.matrixWorld).invert();
  A.frame.traverse((o) => {
    if (!o.isMesh) return;
    const toCar = new THREE.Matrix4().multiplyMatrices(invA, o.matrixWorld);
    if (o.material === rainA.material) rainA.prepare(o, toCar);
    else if (o.material === smashGlassMat.material) smashGlassMat.prepare(o, toCar);
  });
  // cut the game's steering wheel out of the dash mesh (replaced by a modelled one)
  A.frame.updateMatrixWorld(true);
  A.frame.traverse((o) => {
    if (!o.isMesh || o.userData.gameMat !== 'M_Car_Dash' || o.parent?.name !== 'CarBody' && o.name !== 'CarBody' && !/Body/.test(o.parent?.name || '')) return;
    o.geometry = cutBox(o.geometry, new THREE.Box3(new THREE.Vector3(0.30, 0.58, -0.62), new THREE.Vector3(0.74, 1.0, -0.12)));
  });
  if (smashGlassMesh) smashGlassMesh.name = 'carA_smashGlass';
  // the street-side rear door (CarDoorRR, node origin = hinge) swings; everything else of the body is static
  const doorRR = A.nodes.CarDoorRR;
  doorRR.userData.noMerge = true;
  const rrAxis = new THREE.Vector3(0, 0.99939, -0.0349).normalize();   // top leans inboard
  const rrBase = doorRR.quaternion.clone();
  const qTmp = new THREE.Quaternion();
  const setRR = (a) => { qTmp.setFromAxisAngle(rrAxis, a); doorRR.quaternion.copy(rrBase).multiply(qTmp); };

  // interior (POV-ready): seats, console, dash silhouette, wheel, mirror + charm, door cards, pillar trims
  let interiorA = null;
  try { interiorA = buildCarAInterior(ctx, { frame: A.frame, nodes: A.nodes, quality: q }); }
  catch (e) { console.error('[car] car A interior failed', e); }
  // the smash (scare one)
  let shatter = null;
  try { shatter = buildShatter(ctx, { frame: A.frame, glassMesh: smashGlassMesh, glassMat: smashGlassMat, quality: q }); }
  catch (e) { console.error('[car] shatter failed', e); }

  // merge the static body per material (keep: the swinging door, glass with special shaders, interior animated bits)
  const keepA = (m) => m === smashGlassMesh || m.userData.keep || m.material === rainA.material || isUnder(m, doorRR) || isUnder(m, interiorA && interiorA.animated);
  mergeStatic(A.frame, keepA);
  mergeStatic(A.wheels);
  A.root.updateMatrixWorld(true);
  const kitA = makeAnchorKit(A.frame);
  const rockMatA = makeRockMatrix(A.rock);
  let rockEventsA = CAR_A_ROCK.events, rockLoadsA = CAR_A_ROCK.loads;
  let rrOverride = null, rrFn = null;
  const rrAngleAt = (t) => (rrOverride !== null ? rrOverride : rrFn ? rrFn(t) : carARearDoorAngle(t));

  // ---- car A anchors (car frame -> world). The eye: crouched in the rear-left seat behind the driver, leaning
  // toward the gap between the front seats; ~1.0 m above the street.
  const qLookFwd = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 1, 0))); // camera -Z = world -Z
  const qA = A.frame.getWorldQuaternion(new THREE.Quaternion());
  const scar1 = PLACES.scarecrowMark1;
  const win = shatter ? shatter.window : null;
  anchors.carA = { position: kitA.live(0, 0, 0), quaternion: qA.clone(), note: 'car A origin (centre, on the road), car frame: forward = world -Z' };
  // pass 1: eye moved back from x -0.58 to -1.0 (car frame) so both front headrests, the seat-back gap, the console,
  // the dash/wheel and the windshield are in a 45-52 deg frame (at -0.58 the driver seat back filled the lens)
  anchors.carA_eye = { position: kitA.live(-1.0, 1.0, -0.12), quaternion: qLookFwd.clone(), note: 'POV eye: rear-left seat, crouched (~1.0 m above the street), leaning toward the gap between the front seats; quaternion looks up the block (-Z). Rocks with the car (live)' };
  anchors.carA_lookAhead = { position: new THREE.Vector3(scar1.x, ctx.groundY(scar1.x, scar1.z) + 1.45, scar1.z), failingLightFoot: new THREE.Vector3(PLACES.failingLight.x, ctx.groundY(PLACES.failingLight.x, PLACES.failingLight.z), PLACES.failingLight.z), note: 'look target up the block through the windshield gap: the scarecrow under the failing light (head height); failingLightFoot = the pole foot' };
  anchors.carA_lookLeft = { position: (() => { const p = kitA.toWorld(-0.35, 1.0, -3.0); p.y = ctx.groundY(p.x, p.z) + 1.1; return p; })(), note: 'look target through the driver-side windows: the NW sidewalk / even-side houses' };
  if (win) {
    anchors.carA_smashWindow = { position: kitA.live(...win.center), normal: kitA.liveDir(...win.normal), corners: win.corners.map((c) => kitA.live(...c)), width: win.width, height: win.height, quaternion: qA.clone(),
      note: 'curb-side rear window opening (the shattered pane): centre on the glass, normal points OUT (to the curb, -X), corners [bottomFront, bottomRear, topRear, topFront]' };
  }
  const ia = interiorA ? interiorA.anchors : null;
  anchors.carA_seatGrab = ia ? { position: kitA.live(...ia.rearSeatTop.mid), a: kitA.live(...ia.rearSeatTop.a), b: kitA.live(...ia.rearSeatTop.b), quaternion: qA.clone(), note: 'top edge of the rear seat back beside us, from the window (a) inboard (b): the WreckVictim hand closes here at smashGrab' } : null;
  anchors.carA_driverSeatGrab = ia ? { position: kitA.live(...ia.driverSeatTop.mid), a: kitA.live(...ia.driverSeatTop.a), b: kitA.live(...ia.driverSeatTop.b), headrest: kitA.live(...ia.driverHeadrest), quaternion: qA.clone(), note: 'top edge of the driver seat back (a outboard, b inboard), headrest centre' } : null;
  anchors.carA_rearDoorHinge = { position: kitA.live(-0.192, 0.30, 0.90), top: kitA.live(-0.192, 1.40, 0.86), axis: kitA.liveDir(...rrAxis.toArray()), latch: kitA.live(-1.08, 0.85, 0.90), quaternion: qA.clone(), note: 'street-side rear door hinge axis (bottom -> top); latch = closed latch edge at handle height; + angle opens outward (api.carA.rearDoorAngleAt)' };
  anchors.carA_exitStreet = { position: (() => { const p = kitA.toWorld(-0.7, 0, 1.75); p.y = ctx.groundY(p.x, p.z); return p; })(), note: 'street point outside the open street-side rear door (where we fall)' };
  if (ia) anchors.carA_mirror = { position: kitA.live(...ia.mirror), note: 'rear-view mirror centre (the charm hangs below it)' };
  anchors.carA_windshield = { position: kitA.live(0.55, 1.15, 0), normal: kitA.liveDir(-0.6, -0.8, 0), note: 'windshield centre, normal points into the cabin' };
  anchors.carA_seatCushion = { position: kitA.live(-0.88, 0.56, -0.38), note: 'our (rear-left) seat cushion surface' };

  // ---- car A interior light (pool point sources, no shadows: the roof would block a shadowed street spill). They sit
  // just outside the glass where the street light enters: a cool streetlight rim from the street side (right), a warm
  // porch-lamp rim from the curb side behind-left, a cool glow over the hood that edges the dash, wheel and mirror.
  // Only while the POV is inside car A (C1, C3, C4) - not in C2's exterior view of the car.
  const inA = (t) => (t > CUES.shotC1 - 0.05 && t < CUES.shotC2) || (t >= CUES.shotC3 - 0.05 && t < CUES.shotU1);
  const cool = new THREE.Color(...kelvinRGB(5200)).lerp(new THREE.Color(0.85, 1.0, 0.92), 0.25);
  const warm = new THREE.Color(...kelvinRGB(2600));
  const lampK = (t) => 0.72 + 0.28 * flickerFollow(ctx, t);
  sources.push(
    // (pass 3: level with the front headrests, just outside the front door glass, so they graze the headrest and seat
    // back sides and the POV from behind sees rim-lit edges instead of black masses)
    { id: 'carA_streetRim', kind: 'point', position: kitA.toWorld(-0.22, 1.24, 1.65), color: cool, intensity: 0.75, distance: 3.2, decay: 2, priority: 260,
      enabledAt: inA, intensityAt: (t) => lightScale * lampK(t) },
    { id: 'carA_porchRim', kind: 'point', position: kitA.toWorld(-0.3, 1.2, -1.35), color: warm, intensity: 0.6, distance: 3.0, decay: 2, priority: 255,
      enabledAt: inA, intensityAt: () => lightScale },
    { id: 'carA_hoodGlow', kind: 'point', position: kitA.toWorld(1.45, 1.25, -0.1), color: cool, intensity: 0.3, distance: 2.8, decay: 2, priority: 250,
      enabledAt: inA, intensityAt: (t) => lightScale * lampK(t) },
  );

  // ================================================================================================ CAR B
  const paintB = new THREE.MeshPhysicalMaterial({ name: 'CarPaintB', color: 0x1d2128, roughness: 0.45, metalness: 0.35, clearcoat: 0.45, clearcoatRoughness: 0.4, envMap });
  const glassB = makeGlass({ name: 'CarGlassB', tint: 0x7c8a8c, opacity: 0.5, grime: 0.5, metres: [0.9, 0.5], envMap });
  const glassBDark = makeGlass({ name: 'CarGlassBDark', tint: 0x2a3234, opacity: 0.78, grime: 0.4, metres: [0.9, 0.5], envMap });
  // the SUV's curb-side tyres would stand in the curb at PLACES.carB.x (curb face ~x -2.85): 12 cm toward the street
  const placeB = { ...PLACES.carB, x: PLACES.carB.x + 0.12 };
  const B = buildSedan(ctx, gltfB, {
    name: 'CarB', place: placeB, paint: paintB, rootName: 'CarSUV', wheelsXZ: WHEELS_SUV, pivot: new THREE.Vector3(0, 0.55, 0),
    glassFor: (o) => (/GlassDark/.test((o.material && o.material.name) || '') ? glassBDark : glassB),
    // the game's underbody (decimated) is replaced by the modelled one; the interior is never seen up close
    keepMesh: (o, mn) => mn !== 'M_Car_Underbody' && o.name !== 'CarUnderbody',
  });
  group.add(B.root);
  // open the game body's flat bottom (downward faces low inside the footprint) so the modelled underbody shows
  B.frame.updateMatrixWorld(true);
  {
    const invB = new THREE.Matrix4().copy(B.frame.matrixWorld).invert();
    B.frame.traverse((o) => {
      if (!o.isMesh) return;
      const toCar = new THREE.Matrix4().multiplyMatrices(invB, o.matrixWorld);
      o.geometry = cutUnderside(o.geometry, toCar);
    });
  }
  let under = null, asphalt = null, puddle = null, drips = null;
  try { under = buildUnderbody(ctx, { frame: B.frame, wheels: B.wheels, quality: q }); }
  catch (e) { console.error('[car] underbody failed', e); }
  mergeStatic(B.frame, (m) => m.userData.keep || isUnder(m, under && under.animated));
  mergeStatic(B.wheels);
  B.root.updateMatrixWorld(true);
  const kitB = makeAnchorKit(B.frame);
  const rockMatB = makeRockMatrix(B.rock);
  let rockEventsB = CAR_B_ROCK.events, rockLoadsB = CAR_B_ROCK.loads;
  const underY = under ? under.heightAt : () => 0.23;
  const underbodyY = (x, z) => { // world (x, z) -> world Y of the lowest underbody surface above it (rest pose)
    const p = new THREE.Vector3(x, 0, z).applyMatrix4(new THREE.Matrix4().copy(B.frame.matrixWorld).invert());
    const h = underY(p.x, p.z);
    return h === null ? null : kitB.toWorld(p.x, h, p.z).y;
  };
  const qB = B.frame.getWorldQuaternion(new THREE.Quaternion());
  const qLookStreet = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 1, 0))); // camera -Z = world +X
  // the puddle (street side, where the face lies) and the clang point. SUV frame: sills z +-0.95 (bottom y 0.235)
  const SB = { sillZ: 0.95, sillY: 0.235, floorY: 0.315 };
  const pudLocal = { x: -0.12, z: 1.0, r: 0.5 };
  const pudW = kitB.toWorld(pudLocal.x, 0, pudLocal.z);
  anchors.carB = { position: kitB.live(0, 0, 0), quaternion: qB.clone(), note: 'car B origin (centre, on the road), car frame: forward = world -Z (car B = the game fleet mid-size SUV)' };
  anchors.carB_eye = { position: (() => { const p = kitB.toWorld(-0.12, 0, 0.28); p.y = ctx.groundY(p.x, p.z) + 0.15; return p; })(), quaternion: qLookStreet.clone(), note: 'lying camera under car B, ~0.15 m above the asphalt, ~0.72 m from the face mark, looking out the street side (+X)' };
  anchors.carB_lookOut = { position: (() => { const p = new THREE.Vector3(5.0, 0, anchors.carB_eye.position.z); p.y = ctx.groundY(p.x, p.z) + 0.75; return p; })(), note: 'look target in the slit: the lit SE stoops straight across' };
  anchors.carB_clang = { position: kitB.live(-0.12, SB.floorY - 0.04, 0.78), normal: kitB.liveDir(0, -0.85, 0.53), note: 'the head hits here (street-side floor pan underside, inboard of the sill); normal points down/out' };
  anchors.carB_sillStreet = { a: kitB.live(1.0, SB.sillY, SB.sillZ), b: kitB.live(-1.0, SB.sillY, SB.sillZ), position: kitB.live(0, SB.sillY, SB.sillZ), note: 'street-side sill lower edge (front a -> rear b): the slit the head comes under' };
  anchors.carB_sillSidewalk = { a: kitB.live(1.0, SB.sillY, -SB.sillZ), b: kitB.live(-1.0, SB.sillY, -SB.sillZ), position: kitB.live(0, SB.sillY, -SB.sillZ), note: 'curb-side sill lower edge (the roll-out edge)' };
  anchors.carB_rollOutPoint = { position: (() => { const p = kitB.toWorld(-0.15, 0, -1.12); p.y = ctx.groundY(p.x, p.z); return p; })(), note: 'curb-side exit: gutter point just outside the curb-side sill' };
  // the close-range asphalt stays on the road: find the curb (ground step) on the curb side of car B
  const curbX = (() => { const z = pudW.z, g0 = ctx.groundY(PLACES.carB.x, z); for (let x = PLACES.carB.x - 0.6; x > PLACES.carB.x - 2.2; x -= 0.02) if (ctx.groundY(x, z) - g0 > 0.05) return x + 0.04; return PLACES.carB.x - 1.25; })();
  const patchX0 = curbX, patchX1 = pudW.x + 1.6;

  try { asphalt = buildAsphaltPatch(ctx, { center: new THREE.Vector3((patchX0 + patchX1) / 2, 0, PLACES.carB.z + 0.1), sizeX: patchX1 - patchX0, sizeZ: 4.2, puddle: { x: pudW.x, z: pudW.z, r: pudLocal.r }, quality: q }); }
  catch (e) { console.error('[car] asphalt patch failed', e); }
  try { puddle = buildPuddle(ctx, { center: pudW, radius: pudLocal.r, quality: q, carFrame: B.frame }); }
  catch (e) { console.error('[car] puddle failed', e); }
  if (puddle) anchors.carB_puddle = { position: puddle.center, radius: puddle.radius, note: 'puddle centre on the water surface + radius (the face lies in it)' };
  try { drips = buildDrips(ctx, { frame: B.frame, underY, puddle, quality: q, faceDefault: kitB.toWorld(-0.12, 0.12, 0.97) }); }
  catch (e) { console.error('[car] drips failed', e); }
  if (drips) anchors.carB_drip = { position: drips.face.from, land: drips.face.to, note: 'the CUES.dripOnFace drip: source on the underbody (position) -> landing point (land); api.carB.setDripTarget(worldPos)' };
  if (asphalt) group.add(asphalt.group);
  if (puddle) group.add(puddle.group);
  if (drips) B.frame.add(drips.group); // drips hang under the body (they rock with it)

  // compatibility for the v1 consumers (src/film/story.js, index.js)
  anchors.abandonedCar = { position: anchors.carA.position, quaternion: qA.clone(), note: 'v1 name: car A origin' };

  // ================================================================================================ update
  const cullA = new THREE.Sphere(), cullB = new THREE.Sphere();
  new THREE.Box3().setFromObject(A.root).getBoundingSphere(cullA);
  new THREE.Box3().setFromObject(B.root).getBoundingSphere(cullB);
  const _cp = new THREE.Vector3();
  function update(t, camera) {
    // car A: rock + rear door + interior + shatter
    const ra = carARock(t, rockEventsA, rockLoadsA);
    A.rock.rotation.set(ra.roll, 0, ra.pitch, 'XZY');
    A.rock.position.set(PIVOT.x, PIVOT.y + ra.heave, PIVOT.z);
    setRR(rrAngleAt(t));
    A.root.updateMatrixWorld(true);
    kitA.update();
    const camPos = camera ? camera.getWorldPosition(_cp) : null;
    const nearA = camPos ? camPos.distanceTo(cullA.center) < 9 : true;
    if (interiorA) { interiorA.group.visible = nearA; if (nearA) interiorA.update(t, camera); }
    if (shatter) shatter.update(t, camera, nearA);
    rainA.update(t, camera); smashGlassMat.update(t, camera);
    // car B: rock + drips + puddle
    const rb = carBRock(t, rockEventsB, rockLoadsB);
    B.rock.rotation.set(rb.roll, 0, rb.pitch, 'XZY');
    B.rock.position.set(PIVOT.x, PIVOT.y + rb.heave, PIVOT.z);
    B.root.updateMatrixWorld(true);
    kitB.update();
    const nearB = camPos ? camPos.distanceTo(cullB.center) < 7 : true;
    if (under) { under.group.visible = nearB; if (nearB && under.update) under.update(t, camera); }
    if (drips) { drips.group.visible = nearB; if (nearB) drips.update(t, camera); }
    if (asphalt) { asphalt.group.visible = camPos ? camPos.distanceTo(cullB.center) < 12 : true; asphalt.update && asphalt.update(t, camera); }
    if (puddle) puddle.update(t, camera, drips ? drips.landings : null);
    for (const u of updaters) u(t, camera);
  }

  const apiA = {
    root: A.root, body: A.frame, rockGroup: A.rock, nodes: A.nodes,
    rockAt: (t) => carARock(t, rockEventsA, rockLoadsA),
    rockMatrixAt: (t, out) => rockMatA(carARock(t, rockEventsA, rockLoadsA), out),
    setRockEvents(list, loads) { rockEventsA = list || CAR_A_ROCK.events; if (loads !== undefined) rockLoadsA = loads || CAR_A_ROCK.loads; },
    get rockEvents() { return rockEventsA; },
    rearDoor: doorRR,
    rearDoorAngleAt: rrAngleAt,
    setRearDoorAngle(rad) { rrOverride = rad === null || rad === undefined ? null : rad; },
    setRearDoorFunction(fn) { rrFn = fn || null; },
    rearDoorTimes: carADoorTimes,
    smash: shatter ? shatter.api : null,
    charmAngleAt: interiorA ? interiorA.charmAngleAt : () => 0,
    interior: interiorA ? interiorA.group : null,
    glass: { rain: rainA, smash: smashGlassMat },
    setLightScale(k) { lightScale = k; },
  };
  const apiB = {
    root: B.root, body: B.frame, rockGroup: B.rock, nodes: B.nodes,
    rockAt: (t) => carBRock(t, rockEventsB, rockLoadsB),
    rockMatrixAt: (t, out) => rockMatB(carBRock(t, rockEventsB, rockLoadsB), out),
    setRockEvents(list, loads) { rockEventsB = list || CAR_B_ROCK.events; if (loads !== undefined) rockLoadsB = loads || CAR_B_ROCK.loads; },
    get rockEvents() { return rockEventsB; },
    clang: {
      get time() { const e = rockEventsB.find((x) => x.kind === 'clang'); return e ? e.t : CUES.contact2; },
      point: anchors.carB_clang.position,
      setTime(t0) { rockEventsB = rockEventsB.map((e) => (e.kind === 'clang' ? { ...e, t: t0 } : e)); },
      setPoint(p) { anchors.carB_clang.position.copy(p); },
    },
    drips: drips ? drips.api : null,
    setDripTarget: drips ? (p) => { drips.setTarget(p); } : () => {},
    underbodyY,
    underbody: under ? under.group : null,
    // street-bounce shading of the underbody: { uBounceStreet (Color), uBounceCurb (Color), uBounceK } uniforms
    underbodyLight: under ? under.bounce : null,
    asphalt: asphalt ? asphalt.api : null,
  };
  return {
    group,
    anchors,
    sources,
    update,
    api: {
      carA: apiA,
      carB: apiB,
      puddle: puddle ? puddle.api : null,
      // v1 compatibility (index.js / story.js): no reflector glass, no door rattle in v2
      root: A.root, body: A.frame, rearGlass: null, glassMaterials: { rain: rainA.material },
      setDoorAngle() {}, doorOpenAngle: 0, rattleTimes: [],
      carDoorRattle: () => ({ door: 0, rock: 0 }),
      setLightScale(k) { lightScale = k; },
    },
  };
}

// cobra-head flicker of the failing lamp (the street spill dims with it when the world exposes flickerAt)
function flickerFollow(ctx, t) {
  const w = ctx.world;
  return w && typeof w.flickerAt === 'function' ? w.flickerAt(t) : 1;
}

function isUnder(m, ancestor) {
  if (!ancestor) return false;
  let p = m;
  while (p) { if (p === ancestor) return true; p = p.parent; }
  return false;
}

// drop downward-facing triangles low under the body inside the sills (car-frame test via toCar)
function cutUnderside(geo, toCar) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  const pos = g.attributes.position;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), d = new THREE.Vector3(), n = new THREE.Vector3(), e1 = new THREE.Vector3(), e2 = new THREE.Vector3();
  const kill = new THREE.Box3(new THREE.Vector3(-2.35, -1, -0.9), new THREE.Vector3(2.35, 0.36, 0.9));
  let hit = false;
  const keep = [];
  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i).applyMatrix4(toCar); b.fromBufferAttribute(pos, i + 1).applyMatrix4(toCar); d.fromBufferAttribute(pos, i + 2).applyMatrix4(toCar);
    n.crossVectors(e1.subVectors(b, a), e2.subVectors(d, a)).normalize();
    const cy = (a.y + b.y + d.y) / 3, cx = (a.x + b.x + d.x) / 3, cz = (a.z + b.z + d.z) / 3;
    if (Math.abs(n.y) > 0.5 && kill.containsPoint(d.set(cx, cy, cz))) { hit = true; continue; }
    keep.push(i);
  }
  if (!hit) return geo;
  const out = new THREE.BufferGeometry();
  for (const [k, at] of Object.entries(g.attributes)) {
    const s = at.itemSize, arr = new Float32Array(keep.length * 3 * s);
    let o = 0;
    for (const i of keep) for (let j = 0; j < 3; j++) for (let c = 0; c < s; c++) arr[o++] = at.getComponent(i + j, c);
    out.setAttribute(k, new THREE.BufferAttribute(arr, s));
  }
  return out;
}

// remove the triangles whose centroid lies inside `box` (geometry space); returns a new non-indexed geometry
function cutBox(geo, box) {
  const g = geo.index ? geo.toNonIndexed() : geo.clone();
  const pos = g.attributes.position;
  const keep = [];
  const c = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3(), d = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i); b.fromBufferAttribute(pos, i + 1); d.fromBufferAttribute(pos, i + 2);
    c.copy(a).add(b).add(d).multiplyScalar(1 / 3);
    if (!box.containsPoint(c)) keep.push(i);
  }
  const out = new THREE.BufferGeometry();
  for (const [k, at] of Object.entries(g.attributes)) {
    const n = at.itemSize, arr = new Float32Array(keep.length * 3 * n);
    let o = 0;
    for (const i of keep) for (let j = 0; j < 3; j++) for (let s = 0; s < n; s++) arr[o++] = at.array[(i + j) * n + s] !== undefined && !at.normalized && at.array instanceof Float32Array ? at.array[(i + j) * n + s] : at.getComponent(i + j, s);
    out.setAttribute(k, new THREE.BufferAttribute(arr, n));
  }
  return out;
}

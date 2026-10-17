// v2 "HIDE": lead-owned scene additions — motivated key lights for the creature beats, the 3607 TV spill through its
// window in the prologue, and the victim's breath fog. Everything is driven from t (renderAt-safe).
import * as THREE from 'three';
import { CUES } from './cues.js';
import { MARKS, T, smooth, scarecrowAt } from './tracks.js';
import { tvState } from '../props/timings.js';

export function makeStory({ scene, world, props, cast, pool, quality, renderer, shots }) {
  const group = new THREE.Group();
  group.name = 'Story';
  scene.add(group);
  const hash1 = (n) => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };
  const spot = (name, color, dist, angle, pen, pos, tgt) => {
    const l = new THREE.SpotLight(color, 0, dist, angle, pen, 2);
    l.name = name; l.castShadow = false;
    pool.dedicated(l);
    l.position.copy(pos); l.target.position.copy(tgt);
    return l;
  };
  const V = (x, y, z) => new THREE.Vector3(x, y, z);

  // ---- the 3607 TV's cold flicker filling its room, read through the window in the prologue
  const tvSpill = new THREE.PointLight(0xc4d2ff, 0, 6.5, 2);
  tvSpill.name = 'tvSpill3607';
  pool.dedicated(tvSpill);
  tvSpill.position.set(6.85, 1.45, 6.6);

  // ---- SCARE ONE: the WreckVictim's face in the smashed window, lit by street light through the car's far side
  const W = MARKS.smashWindow;
  const wreckKey = spot('wreckKey', 0xc9d6ff, 4.5, 0.36, 0.7, V(W.x + 1.35, W.y + 0.75, W.z - 0.55), V(W.x - 0.05, W.y + 0.12, W.z)); // narrow: keep it off the driver's headrest
  const wreckRim = spot('wreckRim', 0xffc28a, 6, 0.45, 0.8, V(W.x - 2.3, W.y + 2.1, W.z + 2.0), V(W.x - 0.1, W.y + 0.15, W.z));

  // ---- C2: a cold edge on the sack mask and shoulders from the street light ahead (the silhouette reads, not a lump)
  const scRim = spot('scarecrowRim', 0xb8c8ff, 9, 0.22, 0.6, V(0, 3.4, -6.0), V(0.3, 1.3, -12.0));

  // ---- SCARE TWO: the face in the puddle under car B — a low cold kick off the wet street + a warm porch rim
  const F = T.facepaint.face;
  // (keep these HIGH: a low light in front of a camera lying on wet asphalt mirrors straight into the lens as a glare blob)
  const faceKey = spot('faceKey', 0xbcd0ff, 7, 0.3, 0.7, V(F.x + 1.1, F.y + 3.3, F.z - 1.0), V(F.x, F.y + 0.05, F.z));
  const faceRim = spot('faceRim', 0xffb070, 8, 0.4, 0.85, V(F.x + 2.6, F.y + 3.0, F.z + 2.2), V(F.x, F.y + 0.08, F.z));
  // the feet / legs beside the car in U2 (street light grazing the asphalt)
  const legKey = spot('legKey', 0xc4d4ff, 8, 0.45, 0.8, V(2.2, 3.0, 17.6), V(-0.3, -0.2, 17.2));
  // our phone wakes in our hand under the car: its cold screen glow is what finally shows us the face, and what it
  // sees us by. Camera-relative, below frame, screen toward the face.
  const phoneGlow = new THREE.PointLight(0xc8dcff, 0, 2.4, 2);
  phoneGlow.name = 'phoneGlow';
  pool.dedicated(phoneGlow);
  const phoneRest = V(MARKS.underEye.x + 0.28, MARKS.underEye.y - 0.11, MARKS.underEye.z + 0.1); // where it fell
  // before the phone wakes: a faint bounce from the porch lights behind us (sidewalk side) so the painted face reads as a
  // pale shape with black sockets during the inspect hold. It sits behind the lens, so the wet street can't mirror it.
  const underFill = new THREE.PointLight(0xd8c7b0, 0, 2.2, 2);
  underFill.name = 'underFill';
  pool.dedicated(underFill);
  underFill.position.set(MARKS.underEye.x - 0.45, MARKS.underEye.y + 0.12, MARKS.underEye.z + 0.15);

  // ---- SCARE THREE: the homeowner beside the door (the room lamp's warm side light + cold spill from the door window)
  const R = MARKS.homeownerReveal;
  const herKey = spot('herKey', 0xffb878, 5, 0.5, 0.8, V(R.x + 2.0, 1.55, R.z - 1.5), V(R.x, 0.95, R.z));
  // the family photo catches a little of the lamp (so her smiling face reads from the floor)
  const photoP = (props && props.anchors && props.anchors.familyPhoto) ? props.anchors.familyPhoto.position.clone() : V(6.95, 1.9, 4.24);
  const photoKey = spot('photoKey', 0xffc890, 4.0, 0.22, 0.6, V(photoP.x + 1.9, photoP.y + 0.55, photoP.z - 1.25), photoP);
  const herRim = spot('herRim', 0x9fb6e8, 4.5, 0.62, 0.85, V(5.78, 2.15, 3.62 + 0.25 * MARKS.homeownerSide), V(R.x + 0.05, 0.98, R.z));
  // head-riding keys (lateUpdate): herKey on the homeowner in scare three, faceRim re-aimed at the screamer at 59-60 s
  const HER_KEY = 10.0, HER_KEY_RANGE = 1.65, SCREAMER_FILL = 2.2;
  const herKeyPos = herKey.position.clone(), herKeyTgt = herKey.target.position.clone(), herRimTgt = herRim.target.position.clone();
  const faceRimPos = faceRim.position.clone(), faceRimTgt = faceRim.target.position.clone();
  const _hp = new THREE.Vector3(), _toCam = new THREE.Vector3(), _left = new THREE.Vector3(), _Y = new THREE.Vector3(0, 1, 0);
  // a key around a head as the camera sees it: `side` m to camera-left, `front` m toward the camera, `up` m above
  const keyAround = (head, camera, side, front, up, out) => {
    _toCam.copy(camera.position).sub(head); _toCam.y = 0; _toCam.normalize();
    _left.crossVectors(_toCam, _Y);
    return out.copy(head).addScaledVector(_left, side).addScaledVector(_toCam, front).addScaledVector(_Y, up);
  };

  // ---- the victim's breath fog in the cold (exterior POV, and faintly inside car A)
  const breathTimes = (shots && shots.breaths) ? shots.breaths : [];
  const puffTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,0.9)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  })();
  const PUFFS = 7;
  const puffs = [];
  for (let i = 0; i < PUFFS * 3; i++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: puffTex, transparent: true, depthWrite: false, opacity: 0, color: 0x9da3ab, fog: false }));
    m.renderOrder = 10; m.visible = false; group.add(m); puffs.push(m);
  }
  const _cq = new THREE.Quaternion(), _cp = new THREE.Vector3(), _off = new THREE.Vector3();

  // the failing lamp must own a real light through ACT 1 even from 31 m away (its pool is where the scarecrow stands)
  const failingSrc = world && world.lights && world.lights.failing ? world.lights.failing.source : null;
  const failingPri = failingSrc ? failingSrc.priority : 1;

  return {
    group,
    update(t, camera) {
      if (failingSrc) failingSrc.priority = (t >= CUES.shotC1 - 0.2 && t < CUES.shotU1) ? 80 : failingPri;
      // breath puffs: up to three overlapping breaths in front of the lens (POV shots outdoors / in the cold car)
      camera.getWorldPosition(_cp); camera.getWorldQuaternion(_cq);
      const space = shots ? shots.spaceAt(t) : 'exterior';
      const shot = shots ? shots.shotAt(t) : null;
      const fogK = !shot || !shot.pov ? 0 : space === 'exterior' ? 1 : space === 'carA' ? 0.45 : 0;
      let slot = 0;
      if (fogK > 0) {
        for (let bi = 0; bi < breathTimes.length && slot < 3; bi++) {
          const age = t - breathTimes[bi].t;
          if (age < 0 || age > 1.7) continue;
          for (let k = 0; k < PUFFS; k++) {
            const m = puffs[slot * PUFFS + k];
            const sd = bi * 13.7 + k * 3.1;
            const a = age;
            _off.set(Math.sin(sd) * 0.03 + Math.sin(sd * 1.7) * 0.04 * a, -0.1 + 0.05 * a + Math.sin(sd * 2.3) * 0.012, -(0.18 + 0.22 * a + 0.03 * k / PUFFS));
            m.position.copy(_off.applyQuaternion(_cq)).add(_cp);
            m.quaternion.copy(_cq);
            const sz = 0.04 + 0.15 * Math.pow(a / 1.7, 0.7) * (0.8 + 0.4 * Math.abs(Math.sin(sd * 5.1)));
            m.scale.set(sz, sz, 1);
            m.material.opacity = 0.05 * fogK * breathTimes[bi].strength * Math.min(1, a / 0.18) * Math.pow(1 - a / 1.7, 2);
            m.visible = true;
          }
          slot++;
        }
      }
      for (let i = slot * PUFFS; i < puffs.length; i++) puffs[i].visible = false;

      // the 3607 TV through the prologue
      const st = tvState(t);
      let k = 0;
      if (st.mode === 'eas') { k = 0.8 * st.level * (0.92 + 0.08 * hash1(Math.floor(t * 12))); tvSpill.color.setRGB(1.0, 0.82, 0.86); }
      else if (st.mode === 'static') { k = st.level * (0.55 + 0.45 * hash1(Math.floor(t * 30) * 7 + 3)); tvSpill.color.setRGB(0.78, 0.86, 1.0); }
      tvSpill.intensity = 5.0 * k * (t < CUES.shotC1 || (t > CUES.shotS1 && t < CUES.doorSlam) ? 1 : 0);

      // C2 rim follows the scarecrow's head
      const c2 = smooth(CUES.shotC2 - 0.05, CUES.shotC2, t) * (1 - smooth(CUES.shotC3 - 0.05, CUES.shotC3, t));
      if (c2 > 0) { const sc = scarecrowAt(t); scRim.target.position.set(sc.x, 1.25, sc.z); scRim.position.set(sc.x - 0.9, 3.0, sc.z + 4.2); }
      scRim.intensity = 9.0 * c2;
      // (tried 2026-10-16: re-aiming this idle spot as a street bounce into car B's underbody. In front of the lens it
      // mirrors in the wet street as a glare dot; from behind or off frame it barely shows on the dark underside)
      // scare one
      const s1 = smooth(CUES.windowSmash - 0.4, CUES.windowSmash, t) * (1 - smooth(33.4, 33.6, t));
      wreckKey.intensity = 16.0 * s1;
      wreckRim.intensity = 10.0 * smooth(CUES.shotC3, CUES.windowSmash, t) * (1 - smooth(33.4, 33.6, t));
      // scare two
      const u = smooth(36.0, 37.0, t) * (1 - smooth(52.4, 52.5, t));
      legKey.intensity = 3.2 * u;
      const fk = smooth(CUES.faceDown, CUES.faceDown + 0.8, t) * (1 - smooth(52.4, 52.5, t));
      faceKey.intensity = 9.0 * fk;
      faceRim.intensity = 7.0 * fk;
      underFill.intensity = 0.7 * fk * (1 - 0.6 * smooth(CUES.phoneBuzz2, CUES.phoneBuzz2 + 0.3, t)) * (1 - smooth(CUES.rollOut, CUES.rollOut + 0.4, t));
      // (after we roll out it stays where it fell, face up under the car, until the street empties of us)
      const ph = smooth(CUES.phoneBuzz2, CUES.phoneBuzz2 + 0.1, t) * (1 - smooth(CUES.doorEnter, CUES.doorEnter + 0.3, t));
      if (ph > 0) {
        const buzzing = (t > CUES.phoneBuzz2 && t < CUES.phoneBuzz2 + 0.42) || (t > CUES.phoneBuzz2 + 0.7 && t < CUES.phoneBuzz2 + 1.12) ? 1 : 0;
        if (t > CUES.rollOut - 0.3) {
          phoneGlow.position.copy(phoneRest);
          phoneGlow.intensity = 0.32 * ph;
        } else {
          // in our hand until the grab, then dropped: it lies on the asphalt lighting us both from below
          const drop = smooth(CUES.contact2 + 0.05, CUES.contact2 + 0.35, t);
          _off.set(0.07 + 0.003 * buzzing * Math.sin(t * 210) + 0.05 * drop, -0.12 - 0.1 * drop, -0.17 - 0.12 * drop).applyQuaternion(_cq);
          phoneGlow.position.copy(_cp).add(_off);
          phoneGlow.intensity = (0.55 - 0.2 * drop) * ph * (0.97 + 0.03 * Math.sin(t * 37));
        }
      } else phoneGlow.intensity = 0;
      // scare three
      // the door window's cold street light from above our shoulder is her key (deep eye sockets); the lamp rims her
      // (tried 2026-10-16: a hotter lamp key only lit the wall behind her; a re-aimed backlight barely showed from the floor)
      const r = smooth(CUES.sofaSlip, CUES.creak3, t) * (t < CUES.cutToBlack ? 1 : 0);
      herKey.intensity = 2.6 * r;
      photoKey.intensity = 2.2 * smooth(CUES.slideDown, CUES.lookPhoto, t) * (1 - smooth(CUES.reveal3, CUES.attack3, t));
      // (the graphics pass's skin detail needs modelling, not flat front light: the door-window light was 3 + 4)
      herRim.intensity = (1.8 + 2.4 * smooth(CUES.creak3, CUES.reveal3, t)) * r;
    },
    // after choreo has posed the cast for t (main.js): keys that ride an actor's head
    lateUpdate(t, camera) {
      // scare three: the lamp-side key becomes a narrow warm cone on her head from camera left, ~1.2 m off her face and
      // a little above it, so the new skin reads with real shape (it was a broad cone that lit the wall behind her)
      const ho = cast && cast.actors.homeowner;
      if (ho && ho.visible && t >= CUES.sofaSlip && t < CUES.cutToBlack) {
        ho.root.updateMatrixWorld(true);
        ho.rig.worldPos('head', _hp);
        keyAround(_hp, camera, 1.0, 0.55, 0.35, herKey.position);
        herKey.target.position.copy(_hp);
        herKey.angle = 0.3; herKey.penumbra = 0.7; herKey.distance = HER_KEY_RANGE; // no shadow: fade out just past her face, before the wall
        herKey.intensity = HER_KEY * smooth(CUES.sofaSlip, CUES.creak3, t);
        // the door-window light narrows onto her head and follows it into the lunge (wide, it lit the wall behind her
        // brighter than her: wall luminance 65 -> 45 at the reveal, face unchanged)
        herRim.target.position.copy(_hp); herRim.angle = 0.28; herRim.penumbra = 0.55;
      } else {
        herKey.position.copy(herKeyPos); herKey.target.position.copy(herKeyTgt);
        herKey.angle = 0.5; herKey.penumbra = 0.8; herKey.distance = 5;
        herRim.target.position.copy(herRimTgt); herRim.angle = 0.62; herRim.penumbra = 0.85;
      }
      herKey.target.updateMatrixWorld();
      herRim.target.updateMatrixWorld();
      // the screamer on the 3605 stoop (59.2-60.4) was a backlit silhouette: a faint warm porch fill on her face from
      // camera left (faceRim: same colour, idle after scare two)
      const sc = cast && cast.actors.screamer;
      const sw = smooth(59.0, 59.4, t) * (1 - smooth(60.2, 60.6, t));
      if (sc && sc.visible && sw > 0) {
        sc.root.updateMatrixWorld(true);
        sc.rig.worldPos('head', _hp);
        keyAround(_hp, camera, 1.1, 0.5, 0.15, faceRim.position);
        faceRim.target.position.copy(_hp);
        faceRim.angle = 0.45; faceRim.distance = 4;
        faceRim.intensity = SCREAMER_FILL * sw;
      } else {
        faceRim.position.copy(faceRimPos); faceRim.target.position.copy(faceRimTgt);
        faceRim.angle = 0.4; faceRim.distance = 8;
      }
      faceRim.target.updateMatrixWorld();
    },
  };
}

// Sets, environment, styles. Everything is procedural.
import * as THREE from 'three';
import { mat, box, cyl, sph, makeRandy, poseRandy, makeBass, makeChoir, makeBoat, simpleFishGeo } from './actors.js';
import { BPM, PHASE } from './data.js';

const sm = THREE.MathUtils.smoothstep;
const C = h => new THREE.Color(h);
export const DOCK_Y = 0.8;
export const PAPER = new THREE.Vector3(0, 300, 0), CATH = new THREE.Vector3(0, 600, 0);

export function groundH(x, z) {
  const d = Math.hypot(x, z - 60);
  const n1 = Math.sin(x * 0.11 + 1.3) * Math.cos(z * 0.09) + 0.5 * Math.sin(x * 0.23 + z * 0.19);
  const n2 = 0.5 + 0.5 * Math.sin(x * 0.05 + 2) * Math.cos(z * 0.045 + 1);
  const shore = sm(d + n1 * 3, 56, 63);
  let h = shore * (1.1 + 14 * sm(d, 66, 120) * n2 + 0.4 * n1) - 0.6;
  const f = sm(16 - Math.hypot(x, z + 6), 0, 8) * sm(-z, -0.5, 2.5);
  h = h * (1 - f) + 0.75 * f;
  h += 5.5 * Math.exp(-((x - 15) ** 2 + (z + 9) ** 2) / 45);          // the old wooden hill
  return h;
}

const NOISE = `float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){return n2(p)*.5+n2(p*2.1)*.3+n2(p*4.3)*.2;}`;

export function makeWorld(scene) {
  const W = { scene };
  const add = (o, parent = scene) => { parent.add(o); return o; };

  // ---- lights
  W.hemi = add(new THREE.HemisphereLight(0xffffff, 0x334455, 1));
  W.sun = add(new THREE.DirectionalLight(0xffffff, 1.5));
  W.fill = add(new THREE.PointLight(0xffffff, 0, 30, 1.5));

  // ---- sky
  W.skyU = { top: { value: C(0) }, hor: { value: C(0) }, sunCol: { value: C(0) }, sunDir: { value: new THREE.Vector3(0, 0.1, 1) }, sunSize: { value: 0.002 }, stars: { value: 0 }, stripes: { value: 0 }, time: { value: 0 }, flash: { value: 0 } };
  W.sky = add(new THREE.Mesh(new THREE.SphereGeometry(450, 32, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false, uniforms: W.skyU,
    vertexShader: `varying vec3 vD; void main(){ vD=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `uniform vec3 top,hor,sunCol,sunDir; uniform float sunSize,stars,stripes,time,flash; varying vec3 vD; ${NOISE}
      void main(){ vec3 d=normalize(vD); vec3 c=mix(hor,top,pow(max(d.y,0.),.45)); c=mix(c,hor*.45,clamp(-d.y*4.,0.,1.));
        vec3 sd=normalize(sunDir); float s=dot(d,sd); c+=sunCol*(pow(max(s,0.),10.)*.55+pow(max(s,0.),90.)*.5);
        float disc=smoothstep(1.-sunSize,1.-sunSize+.0015,s);
        float cut=step(.38,fract(d.y*38.-time*.25)); disc*=mix(1.,mix(1.,cut,step(d.y,sd.y+.01)),stripes);
        c=mix(c,mix(sunCol*2.2,vec3(1.3,.12,.6),stripes*smoothstep(sd.y+.12,sd.y-.14,d.y))*(1.+stripes*1.2*step(.5,stripes)),disc);
        vec2 sp=vec2(atan(d.z,d.x)*40.,d.y*70.); float st=step(.972,h(floor(sp)))*smoothstep(.45,.0,length(fract(sp)-.5));
        c+=stars*st*(.6+.6*sin(time*3.+h(floor(sp))*40.))*step(0.02,d.y)*2.;
        c+=flash*vec3(.8,.85,1.)*(.6+.4*fbm(d.xz*3.+time));
        gl_FragColor=vec4(c,1.); }`,
  })));
  W.sky.renderOrder = -10; W.sky.frustumCulled = false;

  // ---- water
  W.waterU = { time: { value: 0 }, amp: { value: 1 }, deep: { value: C(0) }, skyCol: { value: C(0) }, sunCol: { value: C(0) }, fogCol: { value: C(0) }, sunDir: W.skyU.sunDir, grid: { value: 0 }, gridCol: { value: C(0x25e6ff) }, fogD: { value: 0.01 }, pulse: { value: 0 } };
  const wgeo = new THREE.PlaneGeometry(420, 420, 150, 150); wgeo.rotateX(-Math.PI / 2);
  W.water = add(new THREE.Mesh(wgeo, new THREE.ShaderMaterial({
    uniforms: W.waterU, side: THREE.DoubleSide,
    vertexShader: `uniform float time,amp; varying vec3 vW; void main(){ vec4 w=modelMatrix*vec4(position,1.);
      w.y+=amp*(sin(w.x*.35+time*1.3)*.13+sin(w.z*.5+time*1.7+w.x*.2)*.11+sin((w.x+w.z)*.9+time*2.3)*.045); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`,
    fragmentShader: `uniform vec3 deep,skyCol,sunCol,fogCol,sunDir,gridCol; uniform float grid,fogD,pulse; varying vec3 vW;
      void main(){ vec3 n=normalize(cross(dFdx(vW),dFdy(vW))); if(n.y<0.)n=-n; vec3 v=normalize(cameraPosition-vW);
        float fr=pow(1.-abs(dot(n,v)),3.); vec3 c=mix(deep,skyCol,clamp(fr*.9+.06,0.,1.));
        c+=sunCol*pow(max(dot(reflect(-normalize(sunDir),n),v),0.),60.)*1.5;
        vec2 gq=vW.xz/3.; vec2 g=abs(fract(gq)-.5); vec2 fw=fwidth(gq); float l=1.-min(smoothstep(0.,fw.x*1.5+.02,.5-g.x),smoothstep(0.,fw.y*1.5+.02,.5-g.y));
        c=mix(c,gridCol*(0.8+pulse*1.6),l*grid);
        float dist=length(cameraPosition-vW); c=mix(c,fogCol,1.-exp(-fogD*fogD*dist*dist));
        gl_FragColor=vec4(c,1.); }`,
  })));
  W.water.position.set(0, 0, 60);

  // ---- terrain, trees, dock, hill
  W.land = add(new THREE.Group());
  { const g = new THREE.PlaneGeometry(380, 380, 110, 110); g.rotateX(-Math.PI / 2); g.translate(0, 0, 60);
    const p = g.attributes.position, col = [], c = new THREE.Color();
    for (let i = 0; i < p.count; i++) { const hh = groundH(p.getX(i), p.getZ(i)); p.setY(i, hh);
      if (hh < 0.9) c.set(0xcdb98a); else c.set(0x4e8a3c).lerp(C(0x7a6a55), sm(hh, 7, 14)); c.multiplyScalar(0.85 + 0.3 * Math.random()); col.push(c.r, c.g, c.b); }
    const ng = g.toNonIndexed(); const cc = []; const idx = g.index.array; for (let i = 0; i < idx.length; i++) cc.push(col[idx[i] * 3], col[idx[i] * 3 + 1], col[idx[i] * 3 + 2]);
    ng.setAttribute('color', new THREE.Float32BufferAttribute(cc, 3)); ng.computeVertexNormals();
    W.terrain = add(new THREE.Mesh(ng, mat(0xffffff, { vertexColors: true })), W.land); }
  { const N = 260, tg = new THREE.ConeGeometry(1, 3.2, 6); tg.translate(0, 1.6, 0);
    W.trees = add(new THREE.InstancedMesh(tg, mat(0x2f6b3a), N), W.land); const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), v = new THREE.Vector3(); let i = 0, guard = 0;
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    while (i < N && guard++ < 9000) { const a = rnd() * 6.283, r = 58 + rnd() * 75; const x = Math.sin(a) * r, z = 60 + Math.cos(a) * r; const hh = groundH(x, z);
      if (hh < 1.0 || (Math.abs(x) < 9 && z > -16 && z < 2) || Math.hypot(x - 15, z + 9) < 6) continue;
      const k = 0.8 + rnd() * 1.4; m.compose(v.set(x, hh - 0.2, z), q, s.set(k, k * (0.9 + rnd() * 0.6), k)); W.trees.setMatrixAt(i, m);
      W.trees.setColorAt(i, C(0x2f6b3a).offsetHSL(rnd() * 0.06 - 0.03, 0, rnd() * 0.12 - 0.06)); i++; }
    W.trees.count = i; }
  W.dock = add(new THREE.Group(), W.land);
  { const wood = mat(0x8a6a48), wood2 = mat(0x6e5236);
    for (let i = 0; i < 28; i++) { const pl = box(2.2, 0.08, 0.46, i % 3 ? wood : wood2); pl.position.set(0, DOCK_Y - 0.04, -2 + i * 0.5); pl.rotation.y = (i * 37 % 7 - 3) * 0.006; W.dock.add(pl); }
    for (let z = -1; z <= 12; z += 3.2) for (const x of [-1.05, 1.05]) { const p = cyl(0.1, 0.12, 2.6, wood2, 6); p.position.set(x, -0.1, z); W.dock.add(p); }
    // hill posts + lookout
    for (let i = 0; i < 9; i++) { const a = i / 9 * 6.283, x = 15 + Math.sin(a) * 3.2, z = -9 + Math.cos(a) * 3.2; const p = cyl(0.12, 0.14, 1.6, wood2, 5); p.position.set(x, groundH(x, z) + 0.7, z); W.dock.add(p); }
    const hut = box(2, 1.6, 2, wood); hut.position.set(15, groundH(15, -9) + 2.6, -9); W.dock.add(hut);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.9, 1.2, 4), wood2); roof.position.set(15, groundH(15, -9) + 4, -9); roof.rotation.y = Math.PI / 4; W.dock.add(roof);
    for (const [dx, dz] of [[-0.8, -0.8], [0.8, -0.8], [-0.8, 0.8], [0.8, 0.8]]) { const p = cyl(0.09, 0.09, 2.2, wood2, 5); p.position.set(15 + dx, groundH(15, -9) + 0.9, -9 + dz); W.dock.add(p); }
    // warning sign
    const cv = document.createElement('canvas'); cv.width = 256; cv.height = 160; const x = cv.getContext('2d');
    x.fillStyle = '#f2d21b'; x.fillRect(0, 0, 256, 160); x.strokeStyle = '#111'; x.lineWidth = 10; x.strokeRect(5, 5, 246, 150);
    x.fillStyle = '#111'; x.textAlign = 'center'; x.font = 'bold 44px Impact, sans-serif'; x.fillText('WARNING', 128, 62); x.font = 'bold 50px Impact, sans-serif'; x.fillStyle = '#b00'; x.fillText('LUNKER', 128, 122);
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
    W.sign = add(new THREE.Group(), W.dock); const sp = cyl(0.05, 0.05, 1.5, wood2, 5); sp.position.y = 0.75; W.sign.add(sp);
    const sb = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.62, 0.05), [wood2, wood2, wood2, wood2, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 }), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 })]);
    sb.position.y = 1.55; W.sign.add(sb); W.sign.position.set(1.35, DOCK_Y, 10.6); W.sign.rotation.y = -0.5; }

  // ---- actors
  W.R = makeRandy(); add(W.R.g);
  W.bass = makeBass(); add(W.bass.g);
  W.lift = makeBass(); add(W.lift.g);
  W.trophies = [makeBass(), makeBass()]; W.trophies.forEach(t => { add(t.g); t.g.scale.setScalar(0.24); });
  W.choir = makeChoir(9); add(W.choir.g);
  W.boat = add(makeBoat());
  W.line = add(new THREE.Line(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(36), 3)), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 })));
  W.line.frustumCulled = false;
  W.doubters = add(new THREE.Group());
  for (let i = 0; i < 3; i++) { const d = new THREE.Group(); const gm = mat(0x70737c, { transparent: true });
    const b = cyl(0.26, 0.3, 1.25, gm, 7); b.position.y = 0.72; d.add(b); const hd = sph(0.2, gm, 1); hd.position.y = 1.55; d.add(hd);
    const arms = box(0.75, 0.14, 0.2, gm); arms.position.set(0, 1.02, 0.22); d.add(arms); const cap = box(0.42, 0.08, 0.5, mat(0x44474e, { transparent: true })); cap.position.set(0, 1.74, 0.08); d.add(cap);
    d.position.set(-5.5 + i * 1.3, groundH(-5.5 + i * 1.3, -2.6 - i * 0.4), -2.6 - i * 0.4); d.rotation.y = 0.9; W.doubters.add(d); }

  // ---- office (walls dissolve)
  W.office = add(new THREE.Group()); W.office.position.set(0, 0.75, -6);
  W.disU = { dis: { value: 0 }, base: { value: C(0xd9d2c2) } };
  const wallM = new THREE.ShaderMaterial({ uniforms: W.disU, side: THREE.DoubleSide,
    vertexShader: `varying vec2 vUv; varying vec3 vP; void main(){ vUv=uv; vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `uniform float dis; uniform vec3 base; varying vec2 vUv; varying vec3 vP; ${NOISE}
      void main(){ float n=fbm(vUv*vec2(9.,6.)+vP.xz); float th=dis*1.25-.12; if(n<th) discard;
        vec3 c=base*(.72+.28*vUv.y); c=mix(c,vec3(3.,1.4,.3),smoothstep(th+.07,th,n)*step(.001,dis)); gl_FragColor=vec4(c,1.); }` });
  { const o = W.office; const wall = (w, h, x, y, z, ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallM); m.position.set(x, y, z); m.rotation.y = ry; o.add(m); return m; };
    wall(9, 3.4, 0, 1.7, -2.6, 0); wall(9, 3.4, -4.5, 1.7, 1.9, Math.PI / 2); wall(9, 3.4, 4.5, 1.7, 1.9, -Math.PI / 2);
    const ceil = wall(9, 9, 0, 3.4, 1.9, 0); ceil.rotation.x = Math.PI / 2;
    W.props = add(new THREE.Group(), o);
    const floor = box(9, 0.6, 9, mat(0x6f7785)); floor.position.set(0, -0.15, 1.9); W.props.add(floor);
    const grey = mat(0xc9ccd2), dgrey = mat(0x8d9199);
    const cab = box(1.5, 0.75, 0.7, mat(0x9a8f80)); cab.position.set(-1.25, 0.45, -2.1); W.props.add(cab);
    W.printer = add(new THREE.Group(), W.props); W.printer.position.set(-1.25, 0.82, -2.1);
    const pb = box(1.2, 0.5, 0.62, grey); pb.position.y = 0.25; W.printer.add(pb);
    const pt = box(1.2, 0.14, 0.62, dgrey); pt.position.y = 0.57; W.printer.add(pt);
    const pp = box(0.5, 0.16, 0.2, dgrey); pp.position.set(-0.3, 0.2, 0.36); pp.rotation.x = -0.5; W.printer.add(pp);
    const scr = box(0.34, 0.12, 0.02, mat(0xbfe4ff, { emissive: 0x8fd0ff, emissiveIntensity: 1.6 })); scr.position.set(-0.3, 0.22, 0.47); scr.rotation.x = -0.5; W.printer.add(scr);
    const tray = box(0.7, 0.03, 0.35, dgrey); tray.position.set(0.2, 0.42, 0.4); W.printer.add(tray);
    W.paperSheet = box(0.5, 0.008, 0.36, mat(0xffffff, { emissive: 0x444444 })); W.paperSheet.position.set(0.2, 0.445, 0.2); W.printer.add(W.paperSheet);
    const lamp = box(2.4, 0.06, 0.5, mat(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1.2 })); lamp.position.set(0, 3.36, 0.8); W.props.add(lamp);
    // framed "photo": a tiny Randy diorama
    W.frame = add(new THREE.Group(), W.printer); W.frame.position.set(0.25, 0.64, 0.02); W.frame.rotation.x = -0.12;
    const fr = mat(0x3a2a1a); const back = box(0.62, 0.52, 0.02, mat(0x8fc7ea, { emissive: 0x24506e })); back.position.set(0, 0.28, -0.03); W.frame.add(back);
    for (const [w, h, x, y] of [[0.68, 0.04, 0, 0.02], [0.68, 0.04, 0, 0.54], [0.04, 0.52, -0.32, 0.28], [0.04, 0.52, 0.32, 0.28]]) { const b = box(w, h, 0.06, fr); b.position.set(x, y, 0); W.frame.add(b); }
    const mini = makeRandy(); poseRandy(mini, { aL: [-2.5, 0.5, -0.3], aR: [-2.5, 0.5, -0.3], rod: false, laugh: 1 }); mini.crown.visible = true; mini.g.scale.setScalar(0.2); mini.g.position.set(0, 0.05, 0.0); W.frame.add(mini.g);
    for (const s of [1, -1]) { const f = makeBass(); f.g.scale.setScalar(0.055); f.g.rotation.x = -Math.PI / 2; f.g.position.set(s * 0.14, 0.42, 0.02); W.frame.add(f.g); } }

  // ---- fx: mist, spots, splash, gold ring, fireworks, sky fish, weeds
  const glowM = (col, op) => new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, uniforms: { col: { value: C(col) }, op: { value: op } },
    vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `uniform vec3 col; uniform float op; varying vec2 vUv; void main(){ float a=smoothstep(.5,.0,length(vUv-.5)); gl_FragColor=vec4(col*a*op,1.); }` });
  W.mist = add(new THREE.Group()); const mm = glowM(0xffd9c0, 0.22);
  for (let i = 0; i < 14; i++) { const m = new THREE.Mesh(new THREE.PlaneGeometry(30, 12), mm); m.rotation.x = -Math.PI / 2; m.position.set((i * 37 % 60) - 30, 0.5 + (i % 3) * 0.35, 14 + i * 5); m.userData.x = m.position.x; W.mist.add(m); }
  W.spots = add(new THREE.Group());
  for (let i = 0; i < 4; i++) { const g = new THREE.ConeGeometry(1.7, 16, 16, 1, true); g.translate(0, -8, 0);
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: [0xfff2c0, 0x9fd0ff, 0xffa0d0, 0xfff2c0][i], transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.FrontSide })); m.position.set(-4.5 + i * 3, 15, -1.5); W.spots.add(m); }
  W.splash = add(new THREE.Group()); const spm = mat(0xdff3ff, { emissive: 0x6faacc });
  for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283; const c = new THREE.Mesh(new THREE.ConeGeometry(0.35, 2.4, 4), spm); c.position.set(Math.sin(a) * 2.2, 0, Math.cos(a) * 2.2); c.rotation.set(Math.cos(a) * 0.45, 0, -Math.sin(a) * 0.45); c.userData.k = 0.6 + (i * 7 % 5) * 0.2; W.splash.add(c); }
  W.ring = add(new THREE.Mesh(new THREE.TorusGeometry(1, 0.06, 5, 40), mat(0xffd34a, { emissive: 0xffa800, emissiveIntensity: 2.5, transparent: true }))); W.ring.rotation.x = Math.PI / 2;
  { // fireworks: every burst is a function of song time, so scrubbing works
    const beat = 60 / BPM, P = 70, bursts = 64, pos = [], vel = [], t0 = [], col = []; let seed = 3; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647; const c = new THREE.Color();
    for (let b = 0; b < bursts; b++) { const tb = PHASE + (152 + b) * beat; const ox = (rnd() - 0.5) * 90, oy = 16 + rnd() * 26, oz = 30 + rnd() * 70; c.setHSL(rnd(), 1, 0.6);
      for (let i = 0; i < P; i++) { const u = rnd() * 2 - 1, a = rnd() * 6.283, r = Math.sqrt(1 - u * u), sp = 7 + rnd() * 5; pos.push(ox, oy, oz); vel.push(r * Math.cos(a) * sp, u * sp, r * Math.sin(a) * sp); t0.push(tb); col.push(c.r, c.g, c.b); } }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('vel', new THREE.Float32BufferAttribute(vel, 3)); g.setAttribute('t0', new THREE.Float32BufferAttribute(t0, 1)); g.setAttribute('col', new THREE.Float32BufferAttribute(col, 3));
    W.fwU = { time: { value: 0 }, size: { value: 1 } };
    W.fireworks = add(new THREE.Points(g, new THREE.ShaderMaterial({ uniforms: W.fwU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `attribute vec3 vel,col; attribute float t0; uniform float time,size; varying vec3 vC; varying float vA;
        void main(){ float a=time-t0; float on=step(0.,a)*step(a,2.2); float d=1.-exp(-a*1.6); vec3 p=position+vel*d*.9-vec3(0.,a*a*1.6,0.);
          vA=on*(1.-a/2.2); vC=col; vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv; gl_PointSize=on*size*260./-mv.z; }`,
      fragmentShader: `varying vec3 vC; varying float vA; void main(){ float d=length(gl_PointCoord-.5); if(d>.5) discard; gl_FragColor=vec4(vC*vA*2.5*smoothstep(.5,.0,d),1.); }` })));
    W.fireworks.frustumCulled = false; }
  { const N = 220; W.skyFish = add(new THREE.InstancedMesh(simpleFishGeo(), mat(0xffffff, { side: THREE.DoubleSide, emissive: 0x222222, roughness: 0.4, metalness: 0.3 }), N)); W.skyFish.frustumCulled = false;
    const c = new THREE.Color(); for (let i = 0; i < N; i++) W.skyFish.setColorAt(i, c.setHSL((i * 0.137) % 1, 0.75, 0.6));
    const m = new THREE.Matrix4(), e = new THREE.Euler(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3();
    W.updateSkyFish = t => { for (let i = 0; i < N; i++) { const r = 28 + (i * 53 % 60), sp = (0.12 + (i % 7) * 0.02) * (i % 2 ? 1 : -1), a = i * 2.399 + t * sp, y = 12 + (i * 29 % 34) + Math.sin(t * 0.9 + i) * 1.5;
      p.set(Math.sin(a) * r, y, 55 + Math.cos(a) * r); e.set(Math.sin(t * 2 + i) * 0.15, a + (sp > 0 ? Math.PI / 2 : -Math.PI / 2), 0); const k = 0.9 + (i % 5) * 0.45;
      m.compose(p, q.setFromEuler(e), s.set(k, k, k)); W.skyFish.setMatrixAt(i, m); } W.skyFish.instanceMatrix.needsUpdate = true; }; }
  { const N = 160, wg = new THREE.ConeGeometry(0.16, 1, 4); wg.translate(0, 0.5, 0); W.weeds = add(new THREE.InstancedMesh(wg, mat(0x2a7a4a), N));
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    for (let i = 0; i < N; i++) { const x = ((i * 73) % 50) - 25, z = 16 + ((i * 41) % 70), hh = 2 + (i % 6); m.compose(new THREE.Vector3(x, -9, z), q.setFromEuler(e.set((i % 5 - 2) * 0.06, i, (i % 3 - 1) * 0.08)), new THREE.Vector3(1 + i % 2, hh, 1 + i % 2)); W.weeds.setMatrixAt(i, m); } }
  W.lakeBed = add(box(200, 0.5, 200, mat(0x24402e))); W.lakeBed.position.set(0, -9.2, 60);

  // ---- paper theatre
  W.paper = add(new THREE.Group()); W.paper.position.copy(PAPER);
  { const P = W.paper; const basic = c => new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide }); const shM = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22, depthWrite: false });
    const piece = (pts, color, z, parent = P) => { const s = new THREE.Shape(); pts.forEach((p, i) => i ? s.lineTo(p[0], p[1]) : s.moveTo(p[0], p[1])); s.closePath(); const geo = new THREE.ShapeGeometry(s);
      const g = new THREE.Group(); const m = new THREE.Mesh(geo, basic(color)); const sh = new THREE.Mesh(geo, shM); sh.position.set(0.12, -0.12, -0.06); g.add(sh, m); g.position.z = z; parent.add(g); return g; };
    const circ = (r, n = 24, sx = 1, sy = 1) => Array.from({ length: n }, (_, i) => [Math.cos(i / n * 6.283) * r * sx, Math.sin(i / n * 6.283) * r * sy]);
    const bg = new THREE.Mesh(new THREE.PlaneGeometry(40, 24), basic(0x2b3d5c)); bg.position.z = -3; P.add(bg); W.pBg = bg;
    W.pMoon = piece(circ(1.3), 0xf6e7b4, -2.6); W.pMoon.position.set(5.5, 3.6, -2.6);
    W.pClouds = []; for (let i = 0; i < 4; i++) { const c = piece([...Array(13)].map((_, k) => [-2.2 + k * 0.37, 0.45 * Math.abs(Math.sin(k * 0.8)) + 0.3]).concat([[2.2, -0.5], [-2.2, -0.5]]), i % 2 ? 0x8d97ad : 0x6f7a94, -2.2 + i * 0.05); c.position.set(-7 + i * 4.6, 3.6 + (i % 2) * 0.8, c.position.z); W.pClouds.push(c); }
    W.pBolts = []; for (let i = 0; i < 3; i++) { const b = piece([[0, 0], [0.5, 0], [0.1, -1.1], [0.55, -1.1], [-0.3, -2.8], [0, -1.5], [-0.45, -1.5]], 0xffe45c, -2.0); b.position.set(-5 + i * 4.5, 3.4, -2.0); W.pBolts.push(b); }
    const wave = (col, z, y, ph) => { const pts = []; for (let x = -16; x <= 16.01; x += 0.25) pts.push([x, 0.32 * Math.abs(Math.sin(x * 1.6 + ph))]); pts.push([16, -7], [-16, -7]); const w = piece(pts, col, z); w.position.y = y; return w; };
    W.pWaves = [wave(0x3f6d94, -1.6, -1.2, 0), wave(0x2f5b85, -1.0, -1.8, 1), wave(0x224a72, -0.1, -2.5, 2)];
    W.pFish = piece([[1.6, 0], [1.0, 0.5], [0, 0.55], [-0.9, 0.2], [-1.6, 0.7], [-1.4, 0], [-1.6, -0.7], [-0.9, -0.2], [0, -0.5], [1.0, -0.4]], 0x3d6b2e, -1.3);
    const eye = new THREE.Mesh(new THREE.CircleGeometry(0.13, 12), basic(0xffd21a)); eye.position.set(1.0, 0.15, 0.02); W.pFish.add(eye);
    piece([[-9, 0.3], [-2.2, 0.3], [-2.2, 0], [-9, 0]], 0x6e5236, -0.6).position.y = -1.3;                    // dock
    for (const x of [-8, -5.5, -3]) piece([[x, 0], [x + 0.25, 0], [x + 0.25, -3], [x, -3]], 0x5a4128, -0.62).position.y = -1.3;
    W.pRandy = new THREE.Group(); W.pRandy.position.set(-3.6, -1.0, -0.5); P.add(W.pRandy);
    piece([[-0.4, 0], [-0.1, 0], [-0.08, 1.1], [0.08, 1.1], [0.1, 0], [0.4, 0], [0.42, 1.2], [-0.42, 1.2]], 0x8c7b5c, 0, W.pRandy);   // legs
    piece([[-0.55, 1.1], [0.55, 1.1], [0.6, 2.3], [-0.6, 2.3]], 0x23262e, 0.02, W.pRandy);                      // sweater
    piece([[-0.16, 2.3], [0.16, 2.3], [0, 1.95]], 0x9fc4ec, 0.04, W.pRandy);
    piece(circ(0.42, 20, 1, 1.1), 0xe2a688, 0.06, W.pRandy).position.y = 2.72;
    piece(circ(0.44, 12, 1, 0.55).filter(p => p[1] >= -0.02), 0x6a5646, 0.08, W.pRandy).position.y = 2.98;
    piece([[-0.34, 0], [0, 0.1], [0.34, 0], [0.3, -0.13], [0, -0.03], [-0.3, -0.13]], 0x5a4130, 0.1, W.pRandy).position.set(0.05, 2.58, 0.1);
    W.pArm = new THREE.Group(); W.pArm.position.set(0.3, 2.05, 0.12); W.pRandy.add(W.pArm);
    piece([[0, -0.12], [1.0, -0.12], [1.0, 0.12], [0, 0.12]], 0x23262e, 0, W.pArm); piece([[0.9, -0.03], [4.2, 0.0], [4.2, 0.04], [0.9, 0.05]], 0xc9a227, 0.01, W.pArm);
    W.pLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), new THREE.LineBasicMaterial({ color: 0xffffff })); P.add(W.pLine);
    W.pRain = new THREE.Group(); P.add(W.pRain); for (let i = 0; i < 40; i++) { const r = new THREE.Mesh(new THREE.PlaneGeometry(0.04, 0.6), basic(0xbcd2ea)); r.position.set((i * 37 % 30) - 15, 0, -1.9 + (i % 3) * 0.6); r.rotation.z = 0.25; r.userData.o = i * 0.61; W.pRain.add(r); }
    // proscenium
    piece([[-16, -9], [-10.2, -9], [-9.6, 9], [-16, 9]], 0x7a1826, 0.6); piece([[16, -9], [10.2, -9], [9.6, 9], [16, 9]], 0x7a1826, 0.6);
    const top = []; for (let x = -16; x <= 16.01; x += 0.5) top.push([x, 5.3 - 0.5 * Math.abs(Math.sin(x * 1.05))]); top.push([16, 9], [-16, 9]); piece(top, 0x8f1f30, 0.7); }

  // ---- cathedral window set
  W.cath = add(new THREE.Group()); W.cath.position.copy(CATH);
  { W.raysU = { time: { value: 0 }, beat: { value: 0 } };
    const rays = new THREE.Mesh(new THREE.PlaneGeometry(90, 140), new THREE.ShaderMaterial({ uniforms: W.raysU,
      vertexShader: `varying vec2 vP; void main(){ vP=position.xy; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `uniform float time,beat; varying vec2 vP; void main(){ vec2 p=vP-vec2(0.,-33.); float a=atan(p.y,p.x)+time*.12; float r=length(p);
        float s=floor(a/6.2832*28.); float k=mod(s,4.); vec3 c=k<1.?vec3(.05,.15,.85):k<2.?vec3(.95,.65,.08):k<3.?vec3(.75,.06,.12):vec3(.05,.55,.3);
        c*=.55+.45*step(.5,fract(r*.16-time*.3)); c*=.55+beat*.35; c=mix(vec3(1.5,1.2,.5),c,smoothstep(1.2,3.,r));
        c=mix(c,vec3(.02,.03,.12),smoothstep(26.,44.,vP.y+35.)); gl_FragColor=vec4(c,1.); }` }));
    rays.position.set(0, 35, -7); W.cath.add(rays);
    const fs = new THREE.Shape(); fs.moveTo(-30, -10); fs.lineTo(30, -10); fs.lineTo(30, 30); fs.lineTo(-30, 30); fs.closePath();
    const hole = new THREE.Path(); hole.moveTo(-4.6, -0.6); hole.lineTo(4.6, -0.6); hole.lineTo(4.6, 4.2); hole.quadraticCurveTo(4.2, 7.6, 0, 9.6); hole.quadraticCurveTo(-4.2, 7.6, -4.6, 4.2); hole.closePath(); fs.holes.push(hole);
    W.arch = new THREE.Mesh(new THREE.ShapeGeometry(fs), new THREE.MeshBasicMaterial({ color: 0x030303 })); W.arch.position.z = 3.2; W.cath.add(W.arch);
    W.halo = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.56, 24), new THREE.MeshBasicMaterial({ color: 0xffd34a, side: THREE.DoubleSide })); W.cath.add(W.halo);
    const floor = box(12, 0.4, 5, mat(0x5a3a7a)); floor.position.set(0, -0.2, 0); W.cath.add(floor);
    // constellation
    W.constel = new THREE.Group(); W.constel.position.set(0, 52, -5); W.cath.add(W.constel);
    const pts = [[4, 0], [2.5, 1.5], [0, 1.9], [-2.4, 0.8], [-4.4, 2.2], [-3.9, 0], [-4.4, -2.2], [-2.4, -0.8], [0, -1.7], [2.5, -1.3], [4, 0]].map(p => new THREE.Vector3(p[0] * 1.6, p[1] * 1.6, 0));
    const lm = new THREE.LineBasicMaterial({ color: 0xbfe0ff, transparent: true }); W.constel.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lm));
    const sm2 = new THREE.MeshBasicMaterial({ color: 0xffffff }); pts.forEach((p, i) => { const s = sph(0.5, sm2, 0); s.position.copy(p); W.constel.add(s);
      if (i) { const q = pts[i - 1], b = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, p.distanceTo(q)), new THREE.MeshBasicMaterial({ color: 0x9fc8ff })); b.position.copy(p).lerp(q, 0.5); b.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), q.clone().sub(p).normalize()); W.constel.add(b); } });
    const ey = sph(0.34, new THREE.MeshBasicMaterial({ color: 0xffd21a }), 0); ey.position.set(4.2, 0.7, 0); W.constel.add(ey); W.constelLine = lm; }

  // ---- skins (material overrides for whole styles)
  const neon = new THREE.ShaderMaterial({ side: THREE.DoubleSide,
    vertexShader: `varying vec3 vW;
      void main(){
        vec4 w=modelMatrix*vec4(position,1.);
        #ifdef USE_INSTANCING
        w=modelMatrix*instanceMatrix*vec4(position,1.);
        #endif
        vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`,
    fragmentShader: `varying vec3 vW; void main(){ vec3 n=normalize(cross(dFdx(vW),dFdy(vW))); vec3 v=normalize(cameraPosition-vW); float r=pow(1.-abs(dot(n,v)),1.6);
      vec3 rim=mix(vec3(.1,.9,1.),vec3(1.,.15,.8),clamp(vW.y*.35+.2,0.,1.)); gl_FragColor=vec4(vec3(.03,.0,.07)+rim*r*1.3+rim*.06,1.); }` });
  const wire = new THREE.MeshBasicMaterial({ color: 0xd0d0d0, wireframe: true });
  const skins = { neon, wire }; let cur = null;
  const skinnable = [W.R.g, W.bass.g, W.lift.g, W.trophies[0].g, W.trophies[1].g, W.choir.g, W.boat, W.dock, W.terrain, W.trees, W.weeds, W.lakeBed, W.doubters];
  W.setSkin = name => { if (name === cur) return; cur = name;
    for (const root of skinnable) root.traverse(o => { if (!o.isMesh) return; if (!o.userData.orig) o.userData.orig = o.material; o.material = name ? skins[name] : o.userData.orig; }); };

  // ---- styles
  const ST = {
    dawn:  { top: 0x2b3a6b, hor: 0xff9a5c, sunCol: 0xffc27a, sun: [0, 0.07, 1], size: 0.0035, fog: 0xd89a84, fd: 0.011, deep: 0x16324e, hemi: [0xffd9b8, 0x3a3550, 1.0], dir: [0xffb07a, 2.0], bloom: [0.08, 0.4, 0.9], mode: 6, bg: null },
    stage: { top: 0x04050d, hor: 0x1b2145, sunCol: 0x000000, sun: [0, 0.5, -1], size: 0, fog: 0x070a18, fd: 0.012, deep: 0x02050b, hemi: [0x8090c0, 0x101020, 0.45], dir: [0xfff0d0, 2.6], bloom: [0.7, 0.7, 0.6], mode: 0 },
    comic: { top: 0x1f6fe0, hor: 0xc8ecff, sunCol: 0xfff2a0, sun: [0.4, 0.6, 0.6], size: 0.003, fog: 0xc8ecff, fd: 0.003, deep: 0x0a62b0, hemi: [0xffffff, 0x88aacc, 1.4], dir: [0xffffff, 2.4], bloom: [0.12, 0.3, 0.95], mode: 1 },
    synth: { top: 0x0d0026, hor: 0x8a1fa8, sunCol: 0x8a4a12, sun: [0, 0.16, 1], size: 0.05, stripes: 1, stars: 0.5, fog: 0x1c0533, fd: 0.006, deep: 0x06000f, grid: 1, gridCol: 0xff36d8, hemi: [0xff80ff, 0x200040, 0.5], dir: [0xff9ad8, 1.0], bloom: [0.5, 0.6, 0.7], mode: 2, skin: 'neon', noLand: true },
    sonar: { top: 0x000503, hor: 0x000a06, sunCol: 0x000000, sun: [0, 1, 0], size: 0, fog: 0x000503, fd: 0.02, deep: 0x000201, grid: 1, gridCol: 0x9fffd0, hemi: [0xffffff, 0xffffff, 1], dir: [0xffffff, 0], bloom: [0.4, 0.5, 0.6], mode: 4, skin: 'wire' },
    under: { top: 0x06323a, hor: 0x031a22, sunCol: 0x000000, sun: [0, 1, 0], size: 0, fog: 0x031a22, fd: 0.045, deep: 0x0a4a50, hemi: [0x8fe0e0, 0x10282a, 1.5], dir: [0xbfffee, 1.6], bloom: [0.25, 0.6, 0.7], mode: 6 },
    paper: { top: 0x2b3d5c, hor: 0x2b3d5c, sunCol: 0, sun: [0, 1, 0], size: 0, fog: 0x2b3d5c, fd: 0, deep: 0, hemi: [0xffffff, 0xffffff, 1], dir: [0xffffff, 0], bloom: [0.0, 0.3, 1], mode: 3 },
    glass: { top: 0x020308, hor: 0x020308, sunCol: 0, sun: [0, 1, 0], size: 0, stars: 1, fog: 0x000000, fd: 0, deep: 0, hemi: [0xffffff, 0xb0a0ff, 1.5], dir: [0xfff0c0, 2.2], bloom: [0.3, 0.5, 0.8], mode: 5 },
    night: { top: 0x050922, hor: 0x3a2a66, sunCol: 0x5a6a9a, sun: [-0.5, 0.5, 0.7], size: 0.0012, stars: 1, fog: 0x14173a, fd: 0.005, deep: 0x050a1e, hemi: [0xa0b0ff, 0x202040, 0.85], dir: [0xffe2b0, 1.8], bloom: [0.9, 0.7, 0.55], mode: 0 },
    dusk:  { top: 0x1f2458, hor: 0xff7a4a, sunCol: 0xff9a50, sun: [0, 0.03, 1], size: 0.004, stars: 0.5, fog: 0x8a5068, fd: 0.008, deep: 0x121a3a, hemi: [0xffb0a0, 0x282848, 0.8], dir: [0xff9060, 1.6], bloom: [0.6, 0.7, 0.6], mode: 0 },
  };
  W.style = (name, post, skin) => { const s = ST[name]; W.styleName = name;
    W.skyU.top.value.set(s.top); W.skyU.hor.value.set(s.hor); W.skyU.sunCol.value.set(s.sunCol); W.skyU.sunDir.value.set(...s.sun).normalize(); W.skyU.sunSize.value = s.size; W.skyU.stars.value = s.stars || 0; W.skyU.stripes.value = s.stripes || 0;
    scene.fog.color.set(s.fog); scene.fog.density = s.fd;
    W.waterU.deep.value.set(s.deep); W.waterU.skyCol.value.set(s.hor).lerp(C(s.top), 0.35); W.waterU.sunCol.value.set(s.sunCol); W.waterU.fogCol.value.set(s.fog); W.waterU.fogD.value = s.fd; W.waterU.grid.value = s.grid || 0; W.waterU.gridCol.value.set(s.gridCol || 0xffffff);
    W.hemi.color.set(s.hemi[0]); W.hemi.groundColor.set(s.hemi[1]); W.hemi.intensity = s.hemi[2]; W.sun.color.set(s.dir[0]); W.sun.intensity = s.dir[1]; W.sun.position.copy(W.skyU.sunDir.value).multiplyScalar(50);
    post.bloom.strength = s.bloom[0]; post.bloom.radius = s.bloom[1]; post.bloom.threshold = s.bloom[2]; post.u.mode.value = s.mode;
    W.setSkin(skin !== undefined ? skin : (s.skin || null)); W.land.visible = !s.noLand; };

  // ---- per-frame reset to a known state; shots then turn things on
  const tmp = new THREE.Vector3();
  W.reset = () => {
    W.choir.g.visible = false;
    for (const k of ['office', 'paper', 'cath', 'boat', 'spots', 'splash', 'ring', 'fireworks', 'skyFish', 'doubters', 'mist', 'line', 'weeds', 'lakeBed', 'frame']) W[k].visible = false;
    W.bass.g.visible = W.lift.g.visible = false; W.trophies.forEach(t => t.g.visible = false); W.R.crown.visible = false; W.constel.visible = false;
    W.R.g.visible = true; W.water.visible = true; W.sky.visible = true; W.land.visible = true; W.sign.visible = true;
    W.R.g.position.set(0, DOCK_Y, 10); W.R.g.rotation.set(0, 0, 0); W.R.g.scale.setScalar(1); poseRandy(W.R);
    W.bass.g.scale.setScalar(2.2); W.bass.g.rotation.set(0, 0, 0); W.bass.eyeM.emissiveIntensity = 0.4; W.lift.g.scale.setScalar(0.45); W.lift.g.rotation.set(0, 0, 0);
    W.choir.g.position.set(0, 0, 0); W.choir.g.rotation.set(0, 0, 0); W.choir.g.scale.setScalar(1);
    W.waterU.amp.value = 1; W.waterU.pulse.value = 0; W.skyU.flash.value = 0; W.fill.intensity = 0; W.disU.dis.value = 0; W.props.scale.setScalar(1);
    W.doubters.children.forEach(d => d.scale.setScalar(1));
    W.R.rod.rotation.x = 2.2; W.R.crown.position.y = 0.385; W.arch.visible = true; W.pBg.material.color.set(0x2b3d5c); W.shake = 0; W.titleOp = 0;
  };
  W.setLine = (target, sag = 0.3) => { W.line.visible = true; W.R.g.updateMatrixWorld(true); W.R.tip.getWorldPosition(tmp); const a = W.line.geometry.attributes.position;
    for (let i = 0; i < 12; i++) { const k = i / 11; a.setXYZ(i, tmp.x + (target.x - tmp.x) * k, tmp.y + (target.y - tmp.y) * k - Math.sin(k * Math.PI) * sag, tmp.z + (target.z - tmp.z) * k); } a.needsUpdate = true; };
  W.holdTrophies = t => { W.R.g.updateMatrixWorld(true); [W.R.handL, W.R.handR].forEach((h, i) => { const T = W.trophies[i]; T.g.visible = true; h.getWorldPosition(T.g.position); T.g.position.y += 0.02;
    T.g.rotation.set(-Math.PI / 2, 0, Math.sin(t * 5 + i * 2) * 0.12); T.g.rotation.y = W.R.g.rotation.y; T.tail.rotation.y = Math.sin(t * 9 + i) * 0.5; T.g.position.y -= 0.32; }); };
  W.doSplash = (x, z, age, size = 1) => { if (age < 0 || age > 1.4) return; W.splash.visible = true; W.splash.position.set(x, 0, z); const k = Math.sin(Math.min(age / 1.4, 1) * Math.PI);
    W.splash.children.forEach(c => { c.scale.set(size, k * c.userData.k * size * 1.6 + 0.01, size); }); W.splash.scale.setScalar(1 + age * 0.6); };
  return W;
}

import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {TANK} from './Case';
import {groundHeight, BASK, POOL, WATER_LEVEL} from './Ground';
import {SurfaceKind} from './Surface';
import {mulberry32, dataTexture, tileFbm} from './Textures';

const UP = new THREE.Vector3(0, 1, 0);
const noise = (x: number, y: number, z: number) => Math.sin(x * 37 + z * 19 + y * 63) * Math.sin(x * 71 - z * 43 + y * 97);

function sandstone() {
  const m = new THREE.MeshStandardMaterial({color: 0xd0a779, roughness: 0.93, side: THREE.DoubleSide});
  m.onBeforeCompile = (s) => {
    s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vStone;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvStone = position;');
    s.fragmentShader = s.fragmentShader.replace('#include <common>', `#include <common>
varying vec3 vStone;
float sh(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float sn(vec3 p){vec3 i=floor(p), f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(sh(i),sh(i+vec3(1,0,0)),f.x),mix(sh(i+vec3(0,1,0)),sh(i+vec3(1,1,0)),f.x),f.y),mix(mix(sh(i+vec3(0,0,1)),sh(i+vec3(1,0,1)),f.x),mix(sh(i+vec3(0,1,1)),sh(i+vec3(1,1,1)),f.x),f.y),f.z);}
`).replace('#include <color_fragment>', `#include <color_fragment>
float strata = sin(vStone.y*610. + sn(vStone*70.)*3.4);
float grain = sn(vStone*850.);
float pit = smoothstep(.77,.96,sh(floor(vStone*2200.)));
diffuseColor.rgb *= .82 + .19*sn(vStone*65.) + .09*grain + .06*strata - .20*pit;
diffuseColor.rgb = mix(diffuseColor.rgb,vec3(.30,.16,.07),smoothstep(.86,.99,sn(vStone*130.))*.22);
`).replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
vec3 sx=dFdx(-vViewPosition), sy=dFdy(-vViewPosition);
float bump=sn(vStone*1200.)*.001 + strata*.00016;
vec3 bx=cross(sy,normal), by=cross(normal,sx);
float bd=dot(sx,bx);
normal=normalize(abs(bd)*normal-sign(bd)*(dFdx(bump)*bx+dFdy(bump)*by));`);
  };
  m.customProgramCacheKey = () => 'desert-sandstone-v1';
  return m;
}

/** A weathered slab with a broad, nearly level top and eroded stratified edges. */
function slab(rx: number, rz: number, height: number, seed: number) {
  const rnd = mulberry32(seed), N = 56, R = 6, verts: number[] = [], idx: number[] = [];
  const controls = Array.from({length: 9}, () => 0.82 + rnd() * 0.18);
  const edge = Array.from({length: N}, (_, i) => {const t=i/N*controls.length,k=Math.floor(t),f=t-k;return controls[k]*(1-f)+controls[(k+1)%controls.length]*f;});
  for (let j = 0; j <= R; j++) for (let i = 0; i < N; i++) {
    const a = i * Math.PI * 2 / N, t = j / R;
    const taper = 0.88 + 0.10 * Math.sin(t * Math.PI) + 0.03 * Math.sin(a * 7 + seed) + 0.025 * Math.sin(j*3.1+a*4);
    const r = edge[i] * taper;
    const co=Math.cos(a),si=Math.sin(a);
    verts.push(Math.sign(co)*Math.pow(Math.abs(co),.68)*rx*r, (t - 0.5) * height + (j === R ? 0.0013 * Math.sin(a * 4 + seed) : 0.003 * Math.sin(a * 5 + j * 1.7)), Math.sign(si)*Math.pow(Math.abs(si),.68)*rz*r);
  }
  for (let j = 0; j < R; j++) for (let i = 0; i < N; i++) {
    const a = j * N + i, b = j * N + (i + 1) % N, c = a + N, d = b + N;
    idx.push(a, c, b, b, c, d);
  }
  const tc = verts.length / 3; verts.push(0, height / 2, 0);
  const bc = verts.length / 3; verts.push(0, -height / 2, 0);
  for (let i = 0; i < N; i++) {idx.push(tc, R * N + (i + 1) % N, R * N + i); idx.push(bc, i, (i + 1) % N);}
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}

function backdrop() {
  const cv = document.createElement('canvas'); cv.width = 2048; cv.height = 768;
  const c = cv.getContext('2d')!, rnd = mulberry32(917);
  const sky = c.createLinearGradient(0, 0, 0, 768); sky.addColorStop(0, '#426d93'); sky.addColorStop(0.38, '#99b8c9'); sky.addColorStop(0.65, '#e9c995'); sky.addColorStop(1, '#9a7450');
  c.fillStyle = sky; c.fillRect(0, 0, 2048, 768);
  const sunset = c.createRadialGradient(160, 220, 20, 160, 220, 1100); sunset.addColorStop(0, 'rgba(255,215,146,.74)'); sunset.addColorStop(1, 'rgba(255,208,139,0)'); c.fillStyle = sunset; c.fillRect(0, 0, 2048, 768);
  for (let layer = 0; layer < 6; layer++) {
    const base = 350 + layer * 60, amp = 90 - layer * 7;
    const points: [number, number][] = [];
    for (let x = -20; x <= 2080; x += 12) {
      const ridge = Math.sin(x * 0.005 + layer * 1.8) * 0.36 + Math.sin(x * 0.013 + layer * 2.3) * 0.28 + Math.sin(x * 0.031 + layer) * 0.17 + (rnd() - 0.5) * 0.21;
      points.push([x, base - amp * (ridge + 1)]);
    }
    c.beginPath(); c.moveTo(-20, 768); points.forEach(([x,y]) => c.lineTo(x,y)); c.lineTo(2080,768); c.closePath();
    c.fillStyle = ['#819aa8','#788b94','#817f7b','#8a7c68','#9f805c','#bd9367'][layer]; c.fill();
    for (let i = 0; i < points.length - 1; i+=3) {
      const [x,y] = points[i];
      const next=points[Math.min(i+3,points.length-1)];
      c.beginPath(); c.moveTo(x,y); c.lineTo(next[0],next[1]); c.lineTo(x+30-rnd()*80, Math.min(768,y+35+rnd()*90)); c.closePath(); c.fillStyle = `rgba(42,42,45,${0.06 + layer * 0.018})`; c.fill();
    }
  }
  // Distant scrub and small stone fields belong to the printed landscape.
  for (let i=0;i<1600;i++) {
    const x=rnd()*2048,y=480+rnd()*288,s=(y-450)/90;
    c.fillStyle = rnd()>.6 ? '#6d7250' : '#8d7358'; c.beginPath(); c.ellipse(x,y,s*(.6+rnd()),s*.44,0,0,Math.PI*2); c.fill();
  }
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace=THREE.SRGBColorSpace; tex.anisotropy=8;
  return tex;
}

export class Habitat {
  readonly group = new THREE.Group();
  readonly panes = new THREE.Group();
  readonly hard: {mesh: THREE.Mesh; kind: SurfaceKind}[] = [];
  readonly ground: THREE.Mesh;
  readonly warm: THREE.SpotLight;
  readonly daylight: THREE.SpotLight;
  readonly bulbs: THREE.MeshStandardMaterial[] = [];
  readonly readout: {canvas: HTMLCanvasElement; texture: THREE.CanvasTexture};
  readonly water: THREE.Mesh;
  readonly ready: Promise<void>;
  private ripples: THREE.Mesh[] = [];

  constructor() {
    const g=this.group;
    const black=new THREE.MeshStandardMaterial({color:0x121617,roughness:.3,metalness:.72});
    const steel=new THREE.MeshStandardMaterial({color:0x42494b,roughness:.35,metalness:.9});
    const rock=sandstone();
    const box=(w:number,h:number,d:number,x:number,y:number,z:number,m:THREE.Material=black)=>{
      const mesh=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,2,.003),m);mesh.position.set(x,y,z);mesh.castShadow=mesh.receiveShadow=true;g.add(mesh);return mesh;
    };
    box(TANK.w+.045,.064,TANK.d+.035,0,.011,0);
    box(TANK.w+.045,.026,TANK.d+.035,0,TANK.h,0);
    for(const x of [-TANK.w/2,TANK.w/2]) for(const z of [-TANK.d/2,TANK.d/2]) box(.015,TANK.h,.015,x,TANK.h/2,z);
    for(const z of [-TANK.d/2,TANK.d/2]) {box(TANK.w,.019,.012,0,.045,z);box(TANK.w,.02,.018,0,TANK.h-.027,z);}
    const glass=new THREE.MeshPhysicalMaterial({color:0x809ca8,transparent:true,opacity:.07,roughness:.08,metalness:0,side:THREE.DoubleSide,depthWrite:false});
    for(const x of [-TANK.w/2,TANK.w/2]) {const p=new THREE.Mesh(new THREE.PlaneGeometry(TANK.d,TANK.h-.08),glass);p.rotation.y=Math.PI/2;p.position.set(x,TANK.h/2+.014,0);this.panes.add(p);}
    const front=new THREE.Mesh(new THREE.PlaneGeometry(TANK.w-.023,TANK.h-.08),glass);front.position.set(0,TANK.h/2+.014,TANK.d/2);front.material=glass.clone();(front.material as THREE.MeshPhysicalMaterial).opacity=.015;this.panes.add(front);
    const seam=new THREE.Mesh(new THREE.BoxGeometry(.002,TANK.h-.09,.001),steel);seam.position.set(0,TANK.h/2+.018,TANK.d/2+.001);g.add(seam);
    for(const x of [-.034,.034]) box(.006,.065,.008,x,.31,TANK.d/2+.006,steel);
    // Ventilation mesh; no solid glass between the internal UVB tube and animal.
    const wire=new THREE.LineBasicMaterial({color:0x252b2e,transparent:true,opacity:.65}), wp:number[]=[];
    for(let x=-TANK.w/2;x<TANK.w/2;x+=.012) wp.push(x,TANK.h-.012,-TANK.d/2,x,TANK.h-.012,TANK.d/2);
    for(let z=-TANK.d/2;z<TANK.d/2;z+=.012) wp.push(-TANK.w/2,TANK.h-.012,z,TANK.w/2,TANK.h-.012,z);
    const wg=new THREE.BufferGeometry();wg.setAttribute('position',new THREE.Float32BufferAttribute(wp,3));g.add(new THREE.LineSegments(wg,wire));
    const bg=new THREE.Mesh(new THREE.PlaneGeometry(TANK.w-.021,TANK.h-.06),new THREE.MeshStandardMaterial({map:backdrop(),roughness:1}));bg.position.set(0,TANK.h/2+.007,-TANK.d/2+.004);g.add(bg);

    const sandMap=dataTexture(512,512,(x,y,o)=>{
      const k=.86+tileFbm(x/32,y/32,16,4,32)*.17+noise(x,y,3)*.07;
      o[0]=213*k;o[1]=177*k;o[2]=126*k;
    });sandMap.repeat.set(12,5);
    const bump=dataTexture(512,512,(x,y,o)=>{o[0]=o[1]=o[2]=100+Math.sin(x*127.1+y*311.7)*55;},false);bump.repeat.set(13,5);
    const groundMat=new THREE.MeshStandardMaterial({map:sandMap,bumpMap:bump,bumpScale:.0012,roughness:.97});
    const gg=new THREE.PlaneGeometry(TANK.w-.014,TANK.d-.014,220,82);gg.rotateX(-Math.PI/2);
    const gp=gg.attributes.position as THREE.BufferAttribute;
    for(let i=0;i<gp.count;i++) gp.setY(i,groundHeight(gp.getX(i),gp.getZ(i)));gg.computeVertexNormals();
    this.ground=new THREE.Mesh(gg,groundMat);this.ground.receiveShadow=true;g.add(this.ground);
    box(TANK.w-.018,.035,TANK.d-.018,0,.058,0,groundMat);
    const addRock=(x:number,y:number,z:number,rx:number,rz:number,h:number,seed:number,solid=true)=>{
      const m=new THREE.Mesh(slab(rx,rz,h,seed),rock);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;g.add(m);if(solid)this.hard.push({mesh:m,kind:SurfaceKind.Rock});return m;
    };
    // Broad warm ledge above a shelter; staggered steps form a reachable ramp.
    addRock(-.60,.093,.065,.085,.14,.044,1);addRock(-.60,.134,.065,.073,.142,.043,31);
    addRock(-.21,.094,.035,.089,.135,.042,2);addRock(-.21,.133,.035,.08,.127,.042,32);
    addRock(BASK.x,.183,BASK.z,.245,.155,.042,3);
    addRock(-.20,.140,.135,.13,.105,.036,5);addRock(-.10,.106,.17,.115,.092,.037,6);
    addRock(-.31,.157,-.06,.195,.11,.03,7);
    // A broad sloping stone joins the stepped ledge to the open floor. Its
    // surface is real geometry, so pathfinding and planted feet agree.
    const rampGeo=new THREE.BoxGeometry(.32,.02,.14,40,1,12);
    const rp=rampGeo.attributes.position as THREE.BufferAttribute;
    for(let i=0;i<rp.count;i++){const x=rp.getX(i)-.14,z=rp.getZ(i)+.19,t=1-THREE.MathUtils.smoothstep(x,-.25,.015);rp.setXYZ(i,x,rp.getY(i)>0?.074+.13*t:.070,z);}
    rampGeo.computeVertexNormals();
    const ramp=new THREE.Mesh(rampGeo,rock);ramp.castShadow=ramp.receiveShadow=true;g.add(ramp);this.hard.push({mesh:ramp,kind:SurfaceKind.Rock});
    // Cool hide: a real open chamber, with its shaded floor sampled separately.
    addRock(.33,.098,-.07,.053,.122,.047,11);addRock(.33,.140,-.07,.047,.125,.042,33);
    addRock(.60,.097,-.07,.053,.125,.047,12);addRock(.60,.139,-.07,.048,.126,.042,34);
    addRock(.46,.165,-.071,.185,.153,.044,13);addRock(.46,.115,-.185,.15,.032,.084,14);
    addRock(.10,.09,.245,.063,.039,.024,18);addRock(.73,.097,-.215,.062,.055,.036,19);
    // A few small smooth rocks and scatter pebbles, leaving most floor clear.
    const rnd=mulberry32(51), pebble=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,1),rock,290);
    const mat=new THREE.Matrix4(),q=new THREE.Quaternion();
    for(let i=0;i<290;i++) {const x=(rnd()-.5)*1.56,z=(rnd()-.5)*.55,r=.0012+rnd()*.0038;mat.compose(new THREE.Vector3(x,groundHeight(x,z)+r*.28,z),q.setFromEuler(new THREE.Euler(rnd()*3,rnd()*3,rnd()*3)),new THREE.Vector3(r,r*.52,r*.8));pebble.setMatrixAt(i,mat);}
    pebble.receiveShadow=true;g.add(pebble);
    this.addRosette(-.713,-.14,.11,21);this.addRosette(.700,.10,.10,22);this.addRosette(.23,-.22,.077,23);this.addRosette(-.70,.215,.05,24);

    // Low stone water dish at the cool end, separated from the food and lamp.
    const profile:THREE.Vector2[]=[];
    for(const [r,y] of [[0,.075],[.078,.075],[.086,.082],[.088,.099],[.078,.105],[.071,.096],[.068,.085],[0,.085]]) profile.push(new THREE.Vector2(r,y));
    const bowl=new THREE.Mesh(new THREE.LatheGeometry(profile,64),rock);bowl.position.set(POOL.cx,0,POOL.cz);bowl.scale.z=.72;bowl.castShadow=bowl.receiveShadow=true;g.add(bowl);
    this.water=new THREE.Mesh(new THREE.CircleGeometry(.071,64),new THREE.MeshPhysicalMaterial({color:0x4c726a,transparent:true,opacity:.68,roughness:.12,metalness:.1,clearcoat:1}));this.water.rotation.x=-Math.PI/2;this.water.scale.y=.72;this.water.position.set(POOL.cx,WATER_LEVEL,POOL.cz);g.add(this.water);
    for(let i=0;i<4;i++){const m=new THREE.Mesh(new THREE.RingGeometry(.018,.019,64),new THREE.MeshBasicMaterial({color:0xe2e5c5,transparent:true,opacity:.1,depthWrite:false,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.scale.y=.72;m.position.set(POOL.cx,WATER_LEVEL+.0003,POOL.cz);m.visible=false;g.add(m);this.ripples.push(m);}

    this.warm=this.lamp(-.4,.065,0xffc37d,true);
    this.daylight=this.lamp(.52,-.035,0xcfeaff,false);
    // UVB fluorescent fixture sits inside, above the warm half of the habitat.
    box(.79,.023,.046,-.24,TANK.h-.049,-.155,steel);
    const uvMat=new THREE.MeshStandardMaterial({color:0xe5f3ff,emissive:0xc9e7ff,emissiveIntensity:1.8,roughness:.3});this.bulbs.push(uvMat);
    const tube=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,.74,16),uvMat);tube.rotation.z=Math.PI/2;tube.position.set(-.24,TANK.h-.065,-.152);g.add(tube);
    const cv=document.createElement('canvas');cv.width=256;cv.height=256;const tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;this.readout={canvas:cv,texture:tex};
    box(.088,.107,.023,.715,.521,.282,black);
    const lcd=new THREE.Mesh(new THREE.PlaneGeometry(.074,.088),new THREE.MeshBasicMaterial({map:tex}));lcd.position.set(.715,.521,.297);g.add(lcd);this.drawReadout(41,24,34);
    // A simple neutral room and tabletop catch warm and cool reflections.
    const table=new THREE.Mesh(new THREE.PlaneGeometry(15,15),new THREE.MeshStandardMaterial({color:0x77716a,roughness:.43,metalness:.1}));table.rotation.x=-Math.PI/2;table.position.y=-.025;table.receiveShadow=true;g.add(table);
    const wall=new THREE.Mesh(new THREE.PlaneGeometry(14,8),new THREE.MeshStandardMaterial({color:0x585753,roughness:1}));wall.position.set(0,3,-3);g.add(wall);
    this.ready=this.loadLog();
  }

  private lamp(x:number,z:number,color:number,basking:boolean) {
    const points=[[.009,.10],[.022,.105],[.027,.081],[.055,.068],[.078,.041],[.091,.014],[.092,0]].map(([r,y])=>new THREE.Vector2(r,y));
    const dome=new THREE.Mesh(new THREE.LatheGeometry(points,48),new THREE.MeshStandardMaterial({color:0x11191e,metalness:.88,roughness:.25,side:THREE.DoubleSide}));dome.position.set(x,TANK.h+.013,z);dome.castShadow=true;this.group.add(dome);
    const bm=new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:3,roughness:.5});this.bulbs.push(bm);
    const bulb=new THREE.Mesh(new THREE.CircleGeometry(.078,48),bm);bulb.rotation.x=Math.PI/2;bulb.position.set(x,TANK.h+.014,z);this.group.add(bulb);
    const cable=new THREE.CatmullRomCurve3([new THREE.Vector3(x,TANK.h+.116,z),new THREE.Vector3(x+.014,TANK.h+.13,z-.03),new THREE.Vector3(x+.022,TANK.h+.1,z-.105),new THREE.Vector3(x+.035,TANK.h+.025,-.31)]);
    this.group.add(new THREE.Mesh(new THREE.TubeGeometry(cable,20,.0028,6,false),new THREE.MeshStandardMaterial({color:0x080b0e,roughness:.6})));
    const l=new THREE.SpotLight(color,basking?2.4:1.65,2,basking?.67:1.0,.75,2);l.position.set(x,TANK.h+.002,z);l.target.position.set(x,.09,z);l.castShadow=true;l.shadow.mapSize.setScalar(2048);l.shadow.bias=-.00012;l.shadow.normalBias=.0009;l.shadow.camera.near=.03;l.shadow.camera.far=2;this.group.add(l,l.target);return l;
  }

  private addRosette(x:number,z:number,size:number,seed:number) {
    const rnd=mulberry32(seed),m=new THREE.MeshStandardMaterial({color:0x667749,roughness:.75,side:THREE.DoubleSide});
    for(let i=0;i<17;i++) {const a=i*2.4,len=size*(.65+rnd()*.35),w=len*.15,verts:number[]=[],uv:number[]=[],idx:number[]=[];
      for(let j=0;j<=10;j++){const t=j/10,ww=Math.sin(Math.PI*t)*w;for(const s of [-1,1]){verts.push(Math.cos(a)*len*t+Math.sin(a)*ww*s,Math.sin(t*Math.PI*.64)*len*.66+ww*.3,Math.sin(a)*len*t-Math.cos(a)*ww*s);uv.push(t,s*.5+.5);}}
      for(let j=0;j<10;j++){const k=j*2;idx.push(k,k+1,k+2,k+1,k+3,k+2);}
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
      const leaf=new THREE.Mesh(g,m);leaf.position.set(x,groundHeight(x,z),z);leaf.castShadow=leaf.receiveShadow=true;this.group.add(leaf);
    }
  }

  private async loadLog() {
    const gltf=await new GLTFLoader().loadAsync('./models/dead_tree_trunk_02/dead_tree_trunk_02_2k.gltf');
    const src:THREE.Mesh[]=[];gltf.scene.traverse(o=>{if(o instanceof THREE.Mesh)src.push(o);});
    for(const o of src) {
      const mesh=new THREE.Mesh(o.geometry.clone(),(o.material as THREE.MeshStandardMaterial).clone());mesh.geometry.center();
      mesh.geometry.computeBoundingBox();const b=mesh.geometry.boundingBox!,size=b.getSize(new THREE.Vector3());
      mesh.scale.setScalar(.65/Math.max(size.x,size.y,size.z));mesh.rotation.set(.07,-.22,-.36);mesh.position.set(.07,0,-.12);mesh.updateMatrixWorld(true);
      const bb=new THREE.Box3().setFromObject(mesh);mesh.position.y=groundHeight(.07,-.12)-bb.min.y-.045;
      (mesh.material as THREE.MeshStandardMaterial).color.set(0xc4b4a1);mesh.castShadow=mesh.receiveShadow=true;mesh.name='weathered-driftwood';this.group.add(mesh);this.hard.push({mesh,kind:SurfaceKind.Wood});
      // A thick curved root continues the scanned trunk all the way to the floor.
      const rootCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(.33,.075,.045),new THREE.Vector3(.20,.123,-.015),new THREE.Vector3(.05,.205,-.06),new THREE.Vector3(-.08,.288,-.105)]);
      const rootGeo=new THREE.TubeGeometry(rootCurve,64,.028,16,false);
      const p=rootGeo.attributes.position as THREE.BufferAttribute;
      for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),a=noise(x*4,y*5,z*4)*.002;p.setXYZ(i,x+a,y+a*.6,z+a*.7);}rootGeo.computeVertexNormals();
      const rootMesh=new THREE.Mesh(rootGeo,mesh.material);rootMesh.castShadow=rootMesh.receiveShadow=true;this.group.add(rootMesh);this.hard.push({mesh:rootMesh,kind:SurfaceKind.Wood});
    }
  }

  drawReadout(warm:number,cool:number,rh:number) {
    const c=this.readout.canvas.getContext('2d')!;c.fillStyle='#111b22';c.fillRect(0,0,256,256);c.textAlign='center';c.fillStyle='#b6d6dd';c.font='17px monospace';c.fillText('BASK / COOL',128,34);c.font='38px monospace';c.fillText(`${warm.toFixed(0)}° / ${cool.toFixed(0)}°`,128,94);c.font='18px monospace';c.fillText('HUMIDITY',128,145);c.font='44px monospace';c.fillText(`${rh.toFixed(0)}%`,128,207);this.readout.texture.needsUpdate=true;
  }
  ripple(amount:number) {for(let i=0;i<this.ripples.length;i++){this.ripples[i].visible=amount>0;this.ripples[i].scale.set(1+i*.63,.72*(1+i*.63),1);(this.ripples[i].material as THREE.MeshBasicMaterial).opacity=amount*.19/(i+1);}}
}

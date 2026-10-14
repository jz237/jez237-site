import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {TANK} from './Case';
import {groundHeight, BASK, POOL, WATER_LEVEL} from './Ground';
import {SurfaceKind} from './Surface';
import {mulberry32, dataTexture, tileFbm} from './Textures';
import {archGeometry, caveBackingGeometry} from './DesertDetails';
import {loadDriftwood} from './Driftwood';
import {cactus, dryShrub, rosette, loadPlantReferences} from './DesertPlants';
import {PlantFlex, plantFlexFor, type PlantContact} from './PlantFlex';

const UP = new THREE.Vector3(0, 1, 0);
const noise = (x: number, y: number, z: number) => Math.sin(x * 37 + z * 19 + y * 63) * Math.sin(x * 71 - z * 43 + y * 97);

function sandstone() {
  const m = new THREE.MeshStandardMaterial({color: 0xd0a779, roughness: 0.93, side: THREE.DoubleSide});
  let photo:THREE.Texture;
  m.userData.ready=new Promise<void>((resolve,reject)=>{
    photo=new THREE.TextureLoader().load('./sandstone-v2.png',()=>resolve(),undefined,reject);
    photo.colorSpace=THREE.SRGBColorSpace;photo.wrapS=photo.wrapT=THREE.RepeatWrapping;photo.anisotropy=8;
  });
  m.userData.photo=photo!;
  m.onBeforeCompile = (s) => {
    s.uniforms.uStonePhoto={value:photo};
    s.vertexShader = s.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vStone; varying vec3 vStoneNormal;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvStone = position; vStoneNormal=normal;');
    s.fragmentShader = s.fragmentShader.replace('#include <common>', `#include <common>
varying vec3 vStone;
varying vec3 vStoneNormal;
uniform sampler2D uStonePhoto;
float sh(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float sn(vec3 p){vec3 i=floor(p), f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(sh(i),sh(i+vec3(1,0,0)),f.x),mix(sh(i+vec3(0,1,0)),sh(i+vec3(1,1,0)),f.x),f.y),mix(mix(sh(i+vec3(0,0,1)),sh(i+vec3(1,0,1)),f.x),mix(sh(i+vec3(0,1,1)),sh(i+vec3(1,1,1)),f.x),f.y),f.z);}
`).replace('#include <color_fragment>', `#include <color_fragment>
float strata = sin(vStone.y*610. + sn(vStone*70.)*3.4);
float grain = sn(vStone*1500.);
float pit = smoothstep(.77,.96,sh(floor(vStone*2200.)));
diffuseColor.rgb *= .81 + .20*sn(vStone*48.) + .035*grain + .045*strata - .08*pit;
diffuseColor.rgb = mix(diffuseColor.rgb,vec3(.30,.16,.07),smoothstep(.86,.99,sn(vStone*130.))*.22);
vec3 sw=pow(abs(normalize(vStoneNormal)),vec3(4.));sw/=max(.001,sw.x+sw.y+sw.z);
vec3 stonePhoto=texture2D(uStonePhoto,vStone.yz*4.).rgb*sw.x+texture2D(uStonePhoto,vStone.xz*4.).rgb*sw.y+texture2D(uStonePhoto,vStone.xy*4.).rgb*sw.z;
diffuseColor.rgb=mix(diffuseColor.rgb,stonePhoto,.86);
`).replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
vec3 sx=dFdx(-vViewPosition), sy=dFdy(-vViewPosition);
float bump=sn(vStone*330.)*.0011 + grain*.0001 + strata*.00016;
vec3 bx=cross(sy,normal), by=cross(normal,sx);
float bd=dot(sx,bx);
normal=normalize(abs(bd)*normal-sign(bd)*(dFdx(bump)*bx+dFdy(bump)*by));`);
  };
  m.customProgramCacheKey = () => 'desert-sandstone-v1';
  return m;
}

/** A weathered slab with a broad, nearly level top and eroded stratified edges. */
function slab(rx: number, rz: number, height: number, seed: number) {
  const rnd = mulberry32(seed), N = 56, R = 8, verts: number[] = [], idx: number[] = [];
  const controls = Array.from({length: 12}, () => 0.82 + rnd() * 0.18);
  const edge = Array.from({length: N}, (_, i) => {const t=i/N*controls.length,k=Math.floor(t),f=t-k;return controls[k]*(1-f)+controls[(k+1)%controls.length]*f;});
  for (let j = 0; j <= R; j++) for (let i = 0; i < N; i++) {
    const a = i * Math.PI * 2 / N, t = j / R;
    const taper = 0.88 + 0.10 * Math.sin(t * Math.PI) + 0.03 * Math.sin(a * 7 + seed) + 0.045 * Math.sin(j*3.1+a*9);
    const r = edge[i] * taper;
    const co=Math.cos(a),si=Math.sin(a);
    verts.push(Math.sign(co)*Math.pow(Math.abs(co),.76)*rx*r, (t - 0.5) * height + (j === R ? 0.002 * Math.sin(a * 11 + seed) : 0.003 * Math.sin(a * 5 + j * 1.7)), Math.sign(si)*Math.pow(Math.abs(si),.78)*rz*r);
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

export class Habitat {
  readonly group = new THREE.Group();
  readonly panes = new THREE.Group();
  readonly hard: {mesh: THREE.Mesh; kind: SurfaceKind}[] = [];
  readonly plants: PlantFlex[] = [];
  readonly obstacles = [{x:-.075,z:-.085,r:.066},{x:.018,z:-.035,r:.049},{x:.68,z:-TANK.d/2+.14,r:.050}];
  readonly ground: THREE.Mesh;
  readonly warm: THREE.SpotLight;
  readonly daylight: THREE.SpotLight;
  readonly bulbs: THREE.MeshStandardMaterial[] = [];
  readonly readout: {canvas: HTMLCanvasElement; texture: THREE.CanvasTexture};
  readonly water: THREE.Mesh;
  readonly stonePhoto: THREE.Texture;
  readonly ready: Promise<void>;
  private ripples: THREE.Mesh[] = [];

  constructor() {
    const g=this.group, frontZ=TANK.d/2, backZ=-TANK.d/2;
    const black=new THREE.MeshStandardMaterial({color:0x121617,roughness:.3,metalness:.72});
    const steel=new THREE.MeshStandardMaterial({color:0x42494b,roughness:.35,metalness:.9});
    const rock=sandstone();
    this.stonePhoto=rock.userData.photo;
    const box=(w:number,h:number,d:number,x:number,y:number,z:number,m:THREE.Material=black)=>{
      const mesh=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,2,.003),m);mesh.position.set(x,y,z);mesh.castShadow=mesh.receiveShadow=true;g.add(mesh);return mesh;
    };
    box(TANK.w+.045,.064,TANK.d+.035,0,.011,0);
    // Four rails and a mesh roof, not a solid lid blocking both lamps.
    for(const z of [-TANK.d/2,TANK.d/2])box(TANK.w+.045,.026,.025,0,TANK.h,z);
    for(const x of [-TANK.w/2,TANK.w/2])box(.025,.026,TANK.d,x,TANK.h,0);
    for(const x of [-TANK.w/2,TANK.w/2]) for(const z of [-TANK.d/2,TANK.d/2]) box(.015,TANK.h,.015,x,TANK.h/2,z);
    for(const z of [-TANK.d/2,TANK.d/2]) {box(TANK.w,.019,.012,0,.045,z);box(TANK.w,.02,.018,0,TANK.h-.027,z);}
    const glass=new THREE.MeshPhysicalMaterial({color:0x809ca8,transparent:true,opacity:.07,roughness:.08,metalness:0,side:THREE.DoubleSide,depthWrite:false});
    for(const x of [-TANK.w/2,TANK.w/2]) {const p=new THREE.Mesh(new THREE.PlaneGeometry(TANK.d,TANK.h-.08),glass);p.rotation.y=Math.PI/2;p.position.set(x,TANK.h/2+.014,0);this.panes.add(p);}
    const front=new THREE.Mesh(new THREE.PlaneGeometry(TANK.w-.023,TANK.h-.08),glass);front.position.set(0,TANK.h/2+.014,TANK.d/2);front.material=glass.clone();(front.material as THREE.MeshPhysicalMaterial).opacity=.015;this.panes.add(front);
    // Ventilation mesh; no solid glass between the internal UVB tube and animal.
    const wire=new THREE.LineBasicMaterial({color:0x252b2e,transparent:true,opacity:.65}), wp:number[]=[];
    for(let x=-TANK.w/2;x<TANK.w/2;x+=.012) wp.push(x,TANK.h-.012,-TANK.d/2,x,TANK.h-.012,TANK.d/2);
    for(let z=-TANK.d/2;z<TANK.d/2;z+=.012) wp.push(-TANK.w/2,TANK.h-.012,z,TANK.w/2,TANK.h-.012,z);
    const wg=new THREE.BufferGeometry();wg.setAttribute('position',new THREE.Float32BufferAttribute(wp,3));g.add(new THREE.LineSegments(wg,wire));
    const bg=new THREE.Mesh(new THREE.PlaneGeometry(TANK.w-.021,TANK.h-.06),new THREE.MeshStandardMaterial({color:0x919a91,roughness:1}));bg.position.set(0,TANK.h/2+.007,-TANK.d/2+.004);g.add(bg);
    const sceneryReady=new THREE.TextureLoader().loadAsync('./desert-panorama-v2.png').then(tex=>{
      tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=8;
      bg.material=new THREE.MeshStandardMaterial({map:tex,roughness:1,color:0xe5ded0});
      for(const side of [-1,1]){const map=tex.clone();map.repeat.set(.15,1);map.offset.set(side<0?0:.85,0);const panel=new THREE.Mesh(new THREE.PlaneGeometry(TANK.d-.012,TANK.h-.06),new THREE.MeshStandardMaterial({map,roughness:1,color:0xc7c2b5}));panel.rotation.y=side<0?Math.PI/2:-Math.PI/2;panel.position.set(side*(TANK.w/2-.010),TANK.h/2+.007,-.003);g.add(panel);}
    });

    const sandMap=dataTexture(512,512,(x,y,o)=>{
      const k=.86+tileFbm(x/32,y/32,16,4,32)*.17+noise(x,y,3)*.07;
      o[0]=213*k;o[1]=177*k;o[2]=126*k;
    });sandMap.repeat.set(12,TANK.d/0.12);
    const bump=dataTexture(512,512,(x,y,o)=>{o[0]=o[1]=o[2]=100+Math.sin(x*127.1+y*311.7)*55;},false);bump.repeat.set(13,TANK.d/0.12);
    const groundMat=new THREE.MeshStandardMaterial({map:sandMap,bumpMap:bump,bumpScale:.0012,roughness:.97});
    const gg=new THREE.PlaneGeometry(TANK.w-.014,TANK.d-.014,220,Math.ceil((TANK.d-.014)/.0072));gg.rotateX(-Math.PI/2);
    const gp=gg.attributes.position as THREE.BufferAttribute;
    for(let i=0;i<gp.count;i++) gp.setY(i,groundHeight(gp.getX(i),gp.getZ(i)));gg.computeVertexNormals();
    this.ground=new THREE.Mesh(gg,groundMat);this.ground.receiveShadow=true;g.add(this.ground);
    box(TANK.w-.018,.035,TANK.d-.018,0,.058,0,groundMat);
    const addRock=(x:number,y:number,z:number,rx:number,rz:number,h:number,seed:number,solid=true,slope=0)=>{
      const geo=slab(rx,rz,h,seed);if(slope){const a=geo.attributes.position as THREE.BufferAttribute;for(let i=0;i<a.count;i++)a.setY(i,a.getY(i)+a.getX(i)*slope);geo.computeVertexNormals();}
      const m=new THREE.Mesh(geo,rock);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;g.add(m);if(solid)this.hard.push({mesh:m,kind:SurfaceKind.Rock});return m;
    };
    // A layered warm cave and worn stone steps, matching the photograph.
    const warmArch=new THREE.Mesh(archGeometry(.42,.15,.22,.112,.24,5),rock);warmArch.position.set(-.46,.073,-.072);warmArch.castShadow=warmArch.receiveShadow=true;g.add(warmArch);this.hard.push({mesh:warmArch,kind:SurfaceKind.Rock});
    const interior=new THREE.MeshStandardMaterial({color:0x372718,roughness:1});
    const caveBack = (arch: THREE.Mesh, width: number, height: number) => {
      const mesh = new THREE.Mesh(caveBackingGeometry(width, height), interior); mesh.name = 'inset-curved-cave-back';
      mesh.position.copy(arch.position); mesh.position.z += .006; mesh.castShadow = mesh.receiveShadow = true;
      g.add(mesh); this.hard.push({mesh, kind: SurfaceKind.Rock});
    };
    caveBack(warmArch, .22, .112);
    addRock(-.46,.226,.048,.253,.168,.049,3);
    addRock(-.48,.262,.025,.232,.147,.025,83);
    addRock(-.655,.108,.155,.085,.098,.045,13);
    addRock(-.235,.168,.153,.132,.111,.041,9,true,-.18);
    addRock(-.140,.122,.207,.120,.085,.036,21,true,-.16);
    // The slope is an irregular weathered stone, never a rectangular ramp.
    addRock(-.24,.143,.205,.160,.065,.030,71,true,-.39);
    addRock(-.060,.096,.210,.093,.063,.023,28,true,-.10);
    addRock(-.59,.191,-.096,.120,.087,.030,17);
    const coolArch=new THREE.Mesh(archGeometry(.38,.205,.218,.143,.230,41),rock);coolArch.position.set(.475,.073,-.16);coolArch.castShadow=coolArch.receiveShadow=true;g.add(coolArch);this.hard.push({mesh:coolArch,kind:SurfaceKind.Rock});
    caveBack(coolArch, .218, .143);
    addRock(.450,.269,-.045,.155,.124,.043,29);
    for(const [x,z,w,d] of [[-.46,.033,.215,.20],[.475,-.045,.205,.21]]){
      const floor=new THREE.Mesh(new THREE.PlaneGeometry(w,d),interior);floor.rotation.x=-Math.PI/2;floor.position.set(x,groundHeight(x,z)+.001,z);floor.receiveShadow=true;g.add(floor);
    }
    addRock(.659,.093,.058,.069,.078,.029,72);
    addRock(.008,.089,frontZ-.049,.077,.047,.026,18);
    addRock(-.245,.087,frontZ-.025,.063,.029,.025,67);
    // A few small smooth rocks and scatter pebbles, leaving most floor clear.
    const rnd=mulberry32(51), pebbleCount=Math.round(290*TANK.d/.6), pebble=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,1),rock,pebbleCount);
    const mat=new THREE.Matrix4(),q=new THREE.Quaternion();
    for(let i=0;i<pebbleCount;i++) {const x=(rnd()-.5)*(TANK.w-.04),z=(rnd()-.5)*(TANK.d-.05),r=.0012+rnd()*.0038;mat.compose(new THREE.Vector3(x,groundHeight(x,z)+r*.28,z),q.setFromEuler(new THREE.Euler(rnd()*3,rnd()*3,rnd()*3)),new THREE.Vector3(r,r*.52,r*.8));pebble.setMatrixAt(i,mat);}
    pebble.receiveShadow=true;g.add(pebble);
    this.addRosette(-.712,backZ+.17,.128,21);this.addRosette(.696,frontZ-.14,.144,22);this.addRosette(-.015,backZ+.086,.108,23);this.addRosette(-.700,frontZ-.066,.066,24);this.addRosette(.228,frontZ-.116,.055,26);
    for (const shrub of [dryShrub(-.728,.08,.183,61),dryShrub(-.066,backZ+.13,.174,62),dryShrub(-.244,backZ+.093,.12,63)]) this.addSoftPlant(shrub);
    g.add(cactus(.682,backZ+.142,.278,.030,41),cactus(.741,backZ+.178,.220,.025,42),cactus(.613,backZ+.087,.181,.022,43),cactus(.649,.102,.053,.027,44,true));

    // Low stone water dish at the cool end, separated from the food and lamp.
    const profile:THREE.Vector2[]=[];
    for(const [r,y] of [[0,.075],[.078,.075],[.086,.082],[.088,.099],[.078,.105],[.071,.096],[.068,.085],[0,.085]]) profile.push(new THREE.Vector2(r,y));
    const bowl=new THREE.Mesh(new THREE.LatheGeometry(profile,64),rock);bowl.position.set(POOL.cx,0,POOL.cz);bowl.scale.z=.72;bowl.castShadow=bowl.receiveShadow=true;g.add(bowl);
    this.water=new THREE.Mesh(new THREE.CircleGeometry(.071,64),new THREE.MeshPhysicalMaterial({color:0x4c726a,transparent:true,opacity:.68,roughness:.12,metalness:.1,clearcoat:1}));this.water.rotation.x=-Math.PI/2;this.water.scale.y=.72;this.water.position.set(POOL.cx,WATER_LEVEL,POOL.cz);g.add(this.water);
    for(let i=0;i<4;i++){const m=new THREE.Mesh(new THREE.RingGeometry(.018,.019,64),new THREE.MeshBasicMaterial({color:0xe2e5c5,transparent:true,opacity:.1,depthWrite:false,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.scale.y=.72;m.position.set(POOL.cx,WATER_LEVEL+.0003,POOL.cz);m.visible=false;g.add(m);this.ripples.push(m);}

    this.warm=this.lamp(-.46,.050,0xffc37d,true);
    this.daylight=this.lamp(.52,-.035,0xcfeaff,false);
    // UVB fluorescent fixture sits inside, above the warm half of the habitat.
    box(.72,.013,.032,-.27,TANK.h-.026,backZ+.035,steel);
    const uvMat=new THREE.MeshStandardMaterial({color:0xe5f3ff,emissive:0xc9e7ff,emissiveIntensity:.45,roughness:.3});this.bulbs.push(uvMat);
    const tube=new THREE.Mesh(new THREE.CylinderGeometry(.003,.003,.67,16),uvMat);tube.rotation.z=Math.PI/2;tube.position.set(-.27,TANK.h-.032,backZ+.037);g.add(tube);
    const cv=document.createElement('canvas');cv.width=256;cv.height=256;const tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;this.readout={canvas:cv,texture:tex};
    box(.088,.107,.023,.715,.521,frontZ-.018,black);
    const lcd=new THREE.Mesh(new THREE.PlaneGeometry(.074,.088),new THREE.MeshBasicMaterial({map:tex}));lcd.position.set(.715,.521,frontZ-.003);g.add(lcd);this.drawReadout(41,24,34);
    // A simple neutral room and tabletop catch warm and cool reflections.
    const table=new THREE.Mesh(new THREE.PlaneGeometry(15,15),new THREE.MeshStandardMaterial({color:0x77716a,roughness:.43,metalness:.1}));table.rotation.x=-Math.PI/2;table.position.y=-.025;table.receiveShadow=true;g.add(table);
    const wall=new THREE.Mesh(new THREE.PlaneGeometry(14,8),new THREE.MeshStandardMaterial({color:0x585753,roughness:1}));wall.position.set(0,3,-3);g.add(wall);
    this.ready=Promise.all([this.loadLog(),loadPlantReferences(),sceneryReady,rock.userData.ready]).then(()=>{});
  }

  private lamp(x:number,z:number,color:number,basking:boolean) {
    const points=[[.014,.144],[.028,.145],[.030,.105],[.034,.094],[.065,.082],[.086,.056],[.104,.021],[.107,.007]].map(([r,y])=>new THREE.Vector2(r,y));
    const dome=new THREE.Mesh(new THREE.LatheGeometry(points,48),new THREE.MeshStandardMaterial({color:0x11191e,metalness:.88,roughness:.25,side:THREE.DoubleSide}));dome.position.set(x,TANK.h+.013,z);dome.castShadow=true;this.group.add(dome);
    const bm=new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:2.5,roughness:.5,side:THREE.DoubleSide});this.bulbs.push(bm);
    const bulb=new THREE.Mesh(new THREE.CircleGeometry(.093,64),bm);bulb.rotation.x=Math.PI/2;bulb.position.set(x,TANK.h-.009,z);this.group.add(bulb);
    const hook=new THREE.Mesh(new THREE.TorusGeometry(.014,.0027,8,24),new THREE.MeshStandardMaterial({color:0x11191b,roughness:.3,metalness:.7}));hook.position.set(x,TANK.h+.167,z);this.group.add(hook);
    for(const side of [-1,1]){const p=new THREE.Mesh(new THREE.CylinderGeometry(.0024,.0024,.146,8),new THREE.MeshStandardMaterial({color:0x151a1f,metalness:.7,roughness:.4}));p.position.set(x+side*.075,TANK.h+.057,z-.024);p.rotation.z=side*.48;this.group.add(p);}
    const cable=new THREE.CatmullRomCurve3([new THREE.Vector3(x,TANK.h+.116,z),new THREE.Vector3(x+.014,TANK.h+.13,z-.03),new THREE.Vector3(x+.022,TANK.h+.1,z-.105),new THREE.Vector3(x+.035,TANK.h+.025,-TANK.d/2-.01)]);
    this.group.add(new THREE.Mesh(new THREE.TubeGeometry(cable,20,.0028,6,false),new THREE.MeshStandardMaterial({color:0x080b0e,roughness:.6})));
    const l=new THREE.SpotLight(color,basking?2.4:1.65,2,basking?.67:1.0,.75,2);l.position.set(x,TANK.h-.014,z);l.target.position.set(x,.09,z);l.castShadow=true;l.shadow.mapSize.setScalar(2048);l.shadow.bias=-.00012;l.shadow.normalBias=.0009;l.shadow.camera.near=.03;l.shadow.camera.far=2;this.group.add(l,l.target);return l;
  }

  private addRosette(x:number,z:number,size:number,seed:number) {
    this.addSoftPlant(rosette(x,z,size,seed));
  }

  private addSoftPlant(group: THREE.Group) {this.group.add(group); this.plants.push(plantFlexFor(group)!);}
  bendPlants(dt: number, contacts: readonly PlantContact[]) {for (const plant of this.plants) plant.update(dt, contacts);}

  private async loadLog() {
    for(const mesh of await loadDriftwood()){this.group.add(mesh);this.hard.push({mesh,kind:SurfaceKind.Wood});}
  }

  drawReadout(warm:number,cool:number,rh:number) {
    const c=this.readout.canvas.getContext('2d')!;c.fillStyle='#071117';c.fillRect(0,0,256,256);c.textAlign='center';c.fillStyle='#aed8ee';c.font='62px monospace';c.fillText(`${warm.toFixed(1)}°`,128,92);c.font='65px monospace';c.fillText(`${rh.toFixed(0)}%`,128,191);c.font='15px monospace';c.fillText(`COOL ${cool.toFixed(0)}°`,128,232);this.readout.texture.needsUpdate=true;
  }
  ripple(amount:number) {for(let i=0;i<this.ripples.length;i++){this.ripples[i].visible=amount>0;this.ripples[i].scale.set(1+i*.63,.72*(1+i*.63),1);(this.ripples[i].material as THREE.MeshBasicMaterial).opacity=amount*.19/(i+1);}}
}

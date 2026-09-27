import * as T from './vendor/three.module.js';

// Presentation only: the original simulation owns movement, collisions and rescue rules.
const PI = Math.PI, UP = new T.Vector3(0, 1, 0);
const clamp = T.MathUtils.clamp;
let seed = 71431;
const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
function hash(x,z) { const n = Math.sin(x*127.1+z*311.7)*43758.5453;return n-Math.floor(n); }
function noise(x,z) { const a=Math.floor(x),b=Math.floor(z);let u=x-a,v=z-b;u=u*u*(3-2*u);v=v*v*(3-2*v);return T.MathUtils.lerp(T.MathUtils.lerp(hash(a,b),hash(a+1,b),u),T.MathUtils.lerp(hash(a,b+1),hash(a+1,b+1),u),v); }
function fbm(x,z) { return noise(x,z)*.55+noise(x*2.1,z*2.1)*.27+noise(x*4.3,z*4.3)*.12+noise(x*8.7,z*8.7)*.06; }
const boxG=new T.BoxGeometry(1,1,1), sphereG=new T.SphereGeometry(1,20,12), lowSphereG=new T.IcosahedronGeometry(1,1);
const cylG=new T.CylinderGeometry(1,1,1,12), coneG=new T.ConeGeometry(1,1,9), planeG=new T.PlaneGeometry(1,1);
const matCache=new Map();
function mat(color,roughness=.7,metalness=.15) { const key=`${color}-${roughness}-${metalness}`;if(!matCache.has(key))matCache.set(key,new T.MeshStandardMaterial({color,roughness,metalness}));return matCache.get(key); }
function glow(color,intensity=2) {const key=`glow-${color}-${intensity}`;if(!matCache.has(key))matCache.set(key,new T.MeshStandardMaterial({color,emissive:color,emissiveIntensity:intensity,roughness:.4}));return matCache.get(key);}
function mesh(parent,geo,material,x,y,z,sx=1,sy=1,sz=1) {const m=new T.Mesh(geo,material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
const box=(p,m,x,y,z,w,h,d)=>mesh(p,boxG,m,x,y,z,w,h,d);
const sphere=(p,m,x,y,z,w,h,d)=>mesh(p,sphereG,m,x,y,z,w,h,d);
function rod(p,m,a,b,r=.8) {const aa=new T.Vector3(...a),bb=new T.Vector3(...b),d=bb.clone().sub(aa);const o=mesh(p,cylG,m,...aa.add(bb).multiplyScalar(.5).toArray(),r,d.length(),r);o.quaternion.setFromUnitVectors(UP,d.normalize());return o;}
function shapeMesh(p,points,depth,m,z=0) {const s=new T.Shape();s.moveTo(...points[0]);for(const q of points.slice(1))s.lineTo(...q);s.closePath();const geo=new T.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.65,bevelThickness:.65});geo.translate(0,0,-depth/2);return mesh(p,geo,m,0,0,z);}
function texture(draw,w=256,h=256) {const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;}
const softTexture=texture((c,w,h)=>{const g=c.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.18,'rgba(255,255,255,.75)');g.addColorStop(.5,'rgba(255,255,255,.16)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(0,0,w,h);},64,64);
function label(p,text,color,x,y,z,w=50,h=10) {const tx=texture((c,W,H)=>{c.font='600 44px Arial';c.textAlign='center';c.textBaseline='middle';c.fillStyle=color;c.fillText(text,W/2,H/2);},512,96);const m=new T.MeshBasicMaterial({map:tx,transparent:true,depthWrite:false,side:T.DoubleSide});return mesh(p,planeG,m,x,y,z,w,h,1);}
function halo(parent,color,x,y,z,size,opacity=.6) {const s=new T.Sprite(new T.SpriteMaterial({map:softTexture,color,transparent:true,opacity,blending:T.AdditiveBlending,depthWrite:false}));s.position.set(x,y,z);s.scale.set(size,size,1);parent.add(s);return s;}

function helicopter() {
  const g=new T.Group(), shell=mat('#506d60',.42,.55),upper=mat('#758975',.42,.6),dark=mat('#172b2b',.54,.65),metal=mat('#a6aba0',.3,.85),black=mat('#0d1719',.5,.5),cream=mat('#e5d9b7',.45,.3);
  const glass=new T.MeshPhysicalMaterial({color:'#254e61',metalness:.7,roughness:.13,clearcoat:1,clearcoatRoughness:.06,envMapIntensity:2.5});
  sphere(g,shell,-2,0,0,24,11,10);
  sphere(g,dark,2,-5,0,21,6.5,8.7);
  shapeMesh(g,[[-23,-2],[-51,5],[-53,9],[-19,6]],5,shell);
  shapeMesh(g,[[-51,5],[-55,20],[-49,19],[-45,5]],2,upper);
  box(g,cream,-51,14,0,5,2,2.6);
  box(g,upper,-39,6,0,12,1.1,24);
  sphere(g,upper,-8,10,0,14,4,7);
  for(const z of [-7,7]) {const exhaust=mesh(g,cylG,black,-19,8,z,2.3,9,2.3);exhaust.rotation.z=PI/2;mesh(g,cylG,metal,-23,8,z,2.5,1.2,2.5).rotation.z=PI/2;}
  // Angular cockpit glazing sits over the rounded armored nose.
  shapeMesh(g,[[4,-4],[22,-4],[26,0],[23,6],[14,10],[5,9]],16,glass);
  rod(g,upper,[14,10,-8],[14,10,8],.55);
  rod(g,upper,[23,6,-8],[23,6,8],.55);
  rod(g,upper,[26,0,0],[23,6,0],.55);
  rod(g,upper,[23,6,0],[14,10,0],.55);
  for(const z of [-1,1]) {
    shapeMesh(g,[[-13,-4],[-13,7],[2,7],[5,-4]],.45,upper,z*9.2);
    box(g,glass,-6,3,z*10.1,10,7,.5);
    box(g,cream,-5,-5.5,z*10.1,13,.8,.5);
    rod(g,metal,[7,9,z*6.6],[12,-3,z*9.5],.55);
    rod(g,metal,[20,6,z*5.6],[22,-3,z*5.7],.45);
    box(g,dark,-9,-2,z*10,3,.6,.5);
    box(g,cream,-14,-4,z*9.2,2.7,5,.4);
    box(g,cream,-14,-4,z*9.3,6.5,1.5,.5);
    const marking=label(g,'07','#ecdfbc',-3,-6,z*9.3,7,2.4);if(z<0)marking.rotation.y=PI;
    for(let i=0;i<7;i++)sphere(g,metal,-19+i*5.6,-6,z*8.6,.22,.22,.22);
    rod(g,metal,[-13,-7,z*7],[-15,-13,z*13],.9);
    rod(g,metal,[12,-7,z*7],[13,-13,z*13],.9);
    rod(g,dark,[-23,-13,z*13],[22,-13,z*13],1.15);
    rod(g,dark,[22,-13,z*13],[26,-10,z*13],1.15);
    box(g,upper,-8,-8,z*12,15,1.3,4);
  }
  rod(g,dark,[-17,11,0],[-20,23,0],.25);
  rod(g,metal,[0,11,0],[0,19,0],1.2);
  sphere(g,dark,0,19,0,3,1.8,3);
  const rotor=new T.Group();rotor.position.set(0,19,0);g.add(rotor);
  for(let i=0;i<4;i++){const blade=box(rotor,black,23,0,0,43,.45,2.5);const pivot=new T.Group();rotor.remove(blade);pivot.add(blade);pivot.rotation.y=i*PI/2;rotor.add(pivot);box(pivot,cream,42,.05,0,3,.5,2.7);}
  const disc=mesh(g,new T.CircleGeometry(46,64),new T.MeshBasicMaterial({color:'#b7c6bb',transparent:true,opacity:.035,side:T.DoubleSide,depthWrite:false}),0,19,0);disc.rotation.x=-PI/2;disc.castShadow=false;
  const tail=new T.Group();tail.position.set(-51,10,3.2);g.add(tail);
  for(let i=0;i<3;i++){const b=box(tail,black,0,0,0,.9,14,.45);b.rotation.z=i*PI/3;}
  sphere(g,metal,-51,10,4,1.5,1.5,1.5);
  const red=halo(g,'#ff5533',-50,20,0,7,.7),green=halo(g,'#77ffb8',-10,1,11,4,.75);
  sphere(g,glow('#ffe7aa'),19,-5,4,1.5,1.1,1.2);
  rod(g,dark,[23,-7,0],[33,-7,0],.8);
  const muzzle=halo(g,'#ffd49b',35,-7,0,18,0);
  return {g,rotor,tail,disc,red,green,muzzle};
}

function tank(wreck=false) {
  const g=new T.Group(),armor=mat(wreck?'#282727':'#6d7054',.75,.4),edge=mat(wreck?'#332b23':'#929074',.6,.4),rubber=mat('#20282a',.92,.1);
  for(const z of [-11,11]) {box(g,rubber,0,5,z,49,10,7);for(let x=-18;x<=18;x+=9){const wheel=mesh(g,cylG,edge,x,5,z+Math.sign(z)*3.7,3.7,1,3.7);wheel.rotation.x=PI/2;}for(let x=-23;x<24;x+=4)box(g,mat('#444a43'),x,10.2,z,2,.7,7.5);}
  shapeMesh(g,[[-23,9],[-19,17],[15,17],[23,10]],22,armor);
  box(g,edge,-4,17,0,26,1.1,22);
  const turret=new T.Group();turret.position.set(-3,18,0);g.add(turret);
  sphere(turret,armor,0,2,0,11,5,9);
  rod(turret,edge,[5,2,0],[30,3,0],1.5);
  box(turret,rubber,30,3,0,3,3.8,3.8);
  mesh(turret,cylG,edge,-2,7,0,4,1,4);
  rod(g,rubber,[-12,18,-5],[-12,33,-5],.25);
  for(const z of [-10,10])sphere(g,glow('#ffc681',1),21,13,z,1,.8,.8);
  return {g,turret};
}
function drone() {const g=new T.Group(),shell=mat('#766b57',.4,.6),black=mat('#18262b');sphere(g,shell,0,0,0,11,5,6);sphere(g,glow('#ff6947'),6,-1,4,2,1.2,1.2);const rotors=[];for(const x of [-1,1])for(const z of [-1,1]){rod(g,black,[x*3,0,z*3],[x*14,2,z*12],.8);mesh(g,cylG,shell,x*14,3,z*12,2,4,2);const r=box(g,black,x*14,5,z*12,15,.4,1.3);rotors.push(r);}return{g,rotors};}
function jet() {const g=new T.Group(),body=mat('#768a8b',.4,.6),dark=mat('#22343d');sphere(g,body,0,0,0,28,4,5);sphere(g,dark,11,3,0,8,2.8,3);const wing=shapeMesh(g,[[-15,0],[-7,3],[12,0],[-7,-3]],43,body);wing.rotation.x=PI/2;shapeMesh(g,[[-24,2],[-27,14],[-19,10],[-14,2]],1.5,body);halo(g,'#ff9655',-27,0,0,13,.9);return{g};}
function sam() {const g=new T.Group(),m=mat('#736d57');box(g,m,0,5,0,33,10,24);const turret=new T.Group();g.add(turret);for(let i=0;i<3;i++)rod(turret,mat('#4e594b'),[-7,12,-7+i*7],[9,28,-7+i*7],3);const dish=mesh(g,new T.SphereGeometry(7,12,8,0,PI*2,0,PI*.48),mat('#9e9e80'),-9,22,0);dish.rotation.z=PI/2;return{g,turret,dish};}
function missile(){const g=new T.Group();rod(g,mat('#c8bca0'),[-7,0,0],[7,0,0],1.7);mesh(g,coneG,mat('#8d5842'),9,0,0,1.7,5,1.7).rotation.z=-PI/2;box(g,mat('#414b46'),-4,0,0,5,7,.4);halo(g,'#ffaa54',-10,0,0,15,.9);return{g};}
function person(h) {const g=new T.Group(),shirt=mat(h.shirt||'#b9915b'),skin=mat('#bfa284'),pants=mat('#37464a');box(g,shirt,0,13,0,6,8,4);sphere(g,skin,0,20,0,2.8,3.2,2.8);sphere(g,mat(h.hairc||'#4f3d29'),0,21.5,-.2,2.85,2,2.7);const legs=[],arms=[];for(const s of [-1,1]){const leg=new T.Group();leg.position.set(s*1.8,9,0);g.add(leg);box(leg,pants,0,-4,0,2.4,8,2.6);box(leg,mat('#282c2a'),.5,-8,.4,3.3,1.6,4);legs.push(leg);const a=new T.Group();a.position.set(s*3.5,16,0);g.add(a);box(a,shirt,0,-3,0,2,6,2);sphere(a,skin,0,-6.6,0,1.3,1.3,1.3);arms.push(a);}return{g,legs,arms};}
function pickup(p){const g=new T.Group(),c=p.type==='fuel'?'#a4df9a':'#81d5de';box(g,mat('#304c43'),0,0,0,15,20,10);box(g,glow(c,.6),0,8,0,16,3,11);box(g,mat(c),0,0,5.2,2,10,.5);box(g,mat(c),0,0,5.3,9,2,.5);halo(g,c,0,0,0,35,.25);return{g};}

// Merge decorative meshes by material so the detailed scenery has few draw calls.
function batchStatic(root) {
  root.updateMatrixWorld(true);const groups=new Map(),remove=[];
  root.traverse(o=>{if(!o.isMesh||Array.isArray(o.material)||o.material.transparent)return;const id=o.material.uuid;if(!groups.has(id))groups.set(id,{material:o.material,items:[]});groups.get(id).items.push(o);remove.push(o);});
  for(const {material,items} of groups.values()) {const data={position:[],normal:[],uv:[]};for(const o of items){const geo=(o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone());geo.applyMatrix4(o.matrixWorld);for(const name of Object.keys(data)){const a=geo.getAttribute(name);if(a)for(let i=0;i<a.array.length;i++)data[name].push(a.array[i]);else {const count=geo.attributes.position.count;for(let i=0;i<count*(name==='uv'?2:3);i++)data[name].push(0);}}geo.dispose();}const g=new T.BufferGeometry();for(const [name,values]of Object.entries(data))g.setAttribute(name,new T.Float32BufferAttribute(values,name==='uv'?2:3));g.computeBoundingSphere();const m=new T.Mesh(g,material);m.castShadow=true;m.receiveShadow=true;root.add(m);}
  for(const o of remove)o.removeFromParent();
}
function building(parent,b) {
  const g=new T.Group();g.position.set(b.x+b.w/2,0,-65);parent.add(g);
  const concrete=mat('#68726b',.92,.05),trim=mat('#a39777',.78,.15),dark=mat('#283c3c'),warm=glow('#d4a774',.7),depth=b.type==='tower'?42:64;
  if(b.type==='barracks') {
    box(g,mat('#7c7960'),0,23,0,b.w,46,depth);
    const roof=shapeMesh(g,[[-b.w/2-5,44],[0,63],[b.w/2+5,44]],depth+10,mat('#4e6059'));
    for(let x=-b.w/2+3;x<b.w/2;x+=9){rod(g,trim,[x,45,depth/2+4],[x,45,-depth/2-4],.3);}
    box(g,dark,0,16,depth/2+.3,15,31,1);
    for(const x of [-38,32]){box(g,dark,x,27,depth/2+.4,16,12,1);box(g,warm,x,27,depth/2+1,13,8,.5);for(let k=-6;k<=6;k+=4)box(g,dark,x+k,27,depth/2+1.5,.7,11,.5);}
    label(g,'EXTRACTION','#efd3a1',0,39,depth/2+1,40,5);
    box(g,trim,-b.w/2+6,4,depth/2+8,9,8,12);
  } else if(b.type==='bunker') {
    shapeMesh(g,[[-b.w/2,0],[-b.w*.4,b.h],[b.w*.4,b.h],[b.w/2,0]],depth,mat('#566052'));
    box(g,dark,0,b.h*.67,depth/2+1,b.w*.5,7,2);box(g,warm,0,b.h*.67,depth/2+2,b.w*.4,2,1);
    for(let y=8;y<b.h;y+=10)box(g,mat('#88907a'),0,y,depth/2+.8,b.w*(1-y/b.h*.2),.7,1);
  } else {
    box(g,concrete,0,b.h/2,0,b.w,b.h,depth);
    box(g,trim,0,b.h+2,0,b.w+6,5,depth+6);
    for(let y=16;y<b.h-5;y+=22){box(g,mat('#53625d'),0,y-8,depth/2+.5,b.w,1.5,1);for(let x=-b.w/2+9;x<b.w/2-4;x+=16){box(g,dark,x,y,depth/2+.6,8,12,1);if(hash(x+b.x,y)>.27)box(g,warm,x,y,depth/2+1.2,6,10,.5);}}
    if(b.type==='tower'){rod(g,dark,[0,b.h,0],[0,b.h+29,0],.7);sphere(g,glow('#f98d59'),0,b.h+29,0,1.5,1.5,1.5);box(g,mat('#46666b'),0,b.h-13,0,b.w+3,15,depth+3);}
    else{box(g,dark,-b.w*.24,b.h+6,0,18,10,14);box(g,dark,10,14,depth/2+1,17,28,1);}
  }
  // Supply crates, sandbags and little foundations anchor buildings into the ground.
  box(g,mat('#6d6c59'),0,1,0,b.w+10,2,depth+12);
  for(let i=0;i<4;i++){const x=b.w/2+8+i*5;box(g,mat('#7d7557'),x,3+((i%2)*3),18,7,5,10);}
}

export function createRenderer(canvas) {
  const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.75));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;renderer.autoClear=false;
  const scene=new T.Scene();scene.fog=new T.Fog('#8ea8a5',2400,6800);
  const camera=new T.OrthographicCamera(-500,500,300,-300,1,8500),angle=.17,co=Math.cos(angle),si=Math.sin(angle);
  const ambient=new T.HemisphereLight('#bddde5','#695b38',1.65);scene.add(ambient);
  const sun=new T.DirectionalLight('#ffdb9c',2.6);sun.position.set(-350,700,300);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.near=1;sun.shadow.camera.far=2200;sun.shadow.camera.left=-650;sun.shadow.camera.right=650;sun.shadow.camera.top=700;sun.shadow.camera.bottom=-700;sun.shadow.normalBias=1.2;sun.shadow.bias=-.0002;scene.add(sun,sun.target);
  const fill=new T.DirectionalLight('#bddbe9',1);fill.position.set(200,400,-500);scene.add(fill);
  const envScene=new T.Scene();envScene.background=new T.Color('#859d9f');
  for(const [color,pos,sz]of [['#fff1d0',[0,500,300],900],['#7eabc5',[0,50,-500],700],['#262f2c',[0,-400,0],800]]){const p=new T.Mesh(new T.PlaneGeometry(sz,sz),new T.MeshBasicMaterial({color,side:T.DoubleSide}));p.position.set(...pos);p.lookAt(0,0,0);envScene.add(p);}
  const pmrem=new T.PMREMGenerator(renderer);let environment=pmrem.fromScene(envScene,.025);scene.environment=environment.texture;pmrem.dispose();

  const bgScene=new T.Scene(),bgCamera=new T.OrthographicCamera(-1,1,1,-1,0,1);
  const sky=new T.ShaderMaterial({depthWrite:false,depthTest:false,uniforms:{time:{value:0},aspect:{value:1},wave:{value:0}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:`
    varying vec2 vUv;uniform float time,aspect,wave;
    float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
    float fb(vec2 p){return .57*n(p)+.26*n(p*2.03)+.12*n(p*4.07)+.05*n(p*8.11);}
    void main(){vec2 uv=vUv;vec3 low=vec3(.83,.76,.58),high=vec3(.22,.39,.45);vec3 c=mix(low,high,smoothstep(.15,1.,uv.y));
    vec2 q=(uv-vec2(.77,.58))*vec2(aspect,1.);float d=length(q);c+=vec3(.28,.18,.055)*exp(-d*5.);c+=vec3(.55,.37,.12)*exp(-d*30.);c=mix(c,vec3(1.,.95,.74),smoothstep(.022,.019,d));
    vec2 p=uv*vec2(5.,16.)+vec2(time*.001,0.);float cloud=smoothstep(.47,.72,fb(p))*smoothstep(.32,.62,uv.y);c=mix(c,vec3(.83,.83,.73),cloud*.47);c+= (h(gl_FragCoord.xy)-.5)/255.;gl_FragColor=vec4(c,1.);}
  `});bgScene.add(new T.Mesh(new T.PlaneGeometry(2,2),sky));

  const groundTex=texture((c,w,h)=>{c.fillStyle='#8c8b72';c.fillRect(0,0,w,h);for(let i=0;i<22000;i++){const v=75+random()*95;c.fillStyle=`rgba(${v|0},${(v*.99)|0},${(v*.84)|0},${.1+random()*.35})`;c.fillRect(random()*w,random()*h,1+random()*3,1+random()*2);}},512,512);groundTex.wrapS=groundTex.wrapT=T.RepeatWrapping;groundTex.repeat.set(100,65);groundTex.anisotropy=4;
  const concreteTex=texture((c,w,h)=>{c.fillStyle='#b6b9aa';c.fillRect(0,0,w,h);for(let i=0;i<16000;i++){const v=100+random()*120;c.fillStyle=`rgba(${v|0},${v|0},${v|0},.12)`;c.fillRect(random()*w,random()*h,random()*3+.5,random()*2+.5);}for(let i=0;i<26;i++){c.fillStyle='#2b322908';c.fillRect(random()*w,random()*h,random()*12+2,random()*160+30);}c.fillStyle='#323b2830';c.fillRect(0,h-20,w,20);},256,256);
  for(const col of ['#68726b','#7c7960','#566052']){const m=mat(col,col==='#68726b'?.92:col==='#7c7960'?.7:.7,col==='#68726b'?.05:.15);m.map=concreteTex;m.bumpMap=concreteTex;m.bumpScale=.12;}
  groundTex.repeat.set(100,14);
  const terrain=new T.Mesh(new T.PlaneGeometry(11000,1400),new T.MeshStandardMaterial({map:groundTex,color:'#888b70',roughness:1,metalness:0}));terrain.rotation.x=-PI/2;terrain.position.set(2400,-1,300);terrain.receiveShadow=true;scene.add(terrain);
  const distant=new T.Group();scene.add(distant);
  // True relief, vertex-colored rock strata and multiple receding ridgelines.
  for(let row=0;row<4;row++){
    const geo=new T.PlaneGeometry(11000,1100,150,28);geo.rotateX(-PI/2);const pos=geo.attributes.position,colors=[];
    for(let i=0;i<pos.count;i++){const x=pos.getX(i),z=pos.getZ(i),ridge=Math.pow(Math.max(0,Math.sin((z+550)/1100*PI)),1.3);const height=(110+fbm(x*.0025+row*23,z*.002)*650+noise(x*.008,row*9)*150)*(1+row*.33)*ridge;pos.setY(i,height*.24+(z-850-row*780)*Math.tan(angle)-10);const c=new T.Color(['#344640','#3b5351','#49696b','#5e7e80'][row]);c.multiplyScalar(.65+noise(x*.017,z*.023)*.55);if(height>1220)c.lerp(new T.Color('#b7c6bf'),clamp((height-1220)/400,0,.55));colors.push(c.r,c.g,c.b);}
    geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));geo.computeVertexNormals();const m=new T.Mesh(geo,new T.MeshStandardMaterial({vertexColors:true,roughness:1}));m.position.set(2400,-5,-850-row*780);m.receiveShadow=true;distant.add(m);
  }
  const decor=new T.Group();scene.add(decor);
  const rockMat=mat('#7c816d',1,0),trunkMat=mat('#555e47',1,0),pineMat=mat('#526b55',1,0);
  for(let i=0;i<320;i++){const x=-1200+random()*7400,z=-120-random()*260,s=2+random()*7;const r=mesh(decor,lowSphereG,rockMat,x,s*.4,z,s,s*.65,s*.8);r.rotation.set(random()*2,random()*6,random());if(i%3===0){const h=15+random()*29;rod(decor,trunkMat,[x,0,z],[x,h,z],.65);for(let j=0;j<5;j++){const size=h*(.25-j*.038),t=mesh(decor,coneG,pineMat,x+Math.sin(j)*.5,h*.32+j*h*.13,z,size,h*.4,size);t.rotation.y=j*1.5;}}}
  // Foreground scrub and rocks produce depth as the camera pans.
  for(let i=0;i<290;i++){const x=-400+random()*5800,z=60+random()*600;const s=2+random()*9;const r=mesh(decor,lowSphereG,rockMat,x,s*.25,z,s,s*.45,s*.8);r.rotation.y=random()*6;for(let k=0;k<3;k++){const a=random()*6;rod(decor,mat('#878b60',1,0),[x,0,z],[x+Math.cos(a)*4,4+random()*8,z+Math.sin(a)*4],.3);}}
  // Main service road, shoulder lines and runway furniture.
  box(decor,mat('#64685c',1,0),2400,-.2,-6,5600,.8,48);
  for(let x=-300;x<5300;x+=55)box(decor,mat('#bab095',.95,0),x,.3,10,24,.15,1.3);
  for(let x=600;x<4900;x+=270){rod(decor,mat('#646b60'),[x,0,-100],[x,60,-100],1);rod(decor,mat('#646b60'),[x,60,-100],[x+12,60,-100],.7);box(decor,glow('#f4d6a0',.8),x+12,59,-100,5,1.5,3);}
  // Power lines and perimeter fences give the valley a sense of scale.
  for(let x=600;x<5000;x+=180){rod(decor,mat('#665d48'),[x,0,-155],[x,79,-155],1.5);box(decor,mat('#665d48'),x,73,-155,2,2,20);for(const z of [-164,-146])for(let j=0;j<8;j++)rod(decor,mat('#333e3a'),[x+j*22.5,73-Math.sin(j/8*PI)*9,z],[x+(j+1)*22.5,73-Math.sin((j+1)/8*PI)*9,z],.22);}
  for(let x=730;x<4650;x+=310){for(let k=0;k<4;k++)rod(decor,mat('#8c8770'),[x+k*16,0,-45],[x+k*16,15,-45],.5);for(const y of [5,10,14])rod(decor,mat('#777d66'),[x,y,-45],[x+48,y,-45],.23);}
  batchStatic(decor);
  let level=new T.Group();scene.add(level);let levelRef=null;
  function buildWorld(s){scene.remove(level);disposeOwned(level);level=new T.Group();scene.add(level);seed=71431;
    for(const b of s.buildings)building(level,b);
    const b=s.homeBase,center=b.x+b.w/2;
    const padTex=texture((c,w,h)=>{c.fillStyle='#556a61';c.fillRect(0,0,w,h);c.strokeStyle='#c4c6a3';c.lineWidth=6;c.strokeRect(14,14,w-28,h-28);c.beginPath();c.arc(w/2,h/2,h*.34,0,PI*2);c.stroke();c.font='bold 110px Arial';c.fillStyle='#d4d3b0';c.textAlign='center';c.textBaseline='middle';c.fillText('H',w/2,h/2);c.font='18px Arial';c.fillText('RESCUE / 07',w/2,h-32);},512,256);
    box(level,mat('#596b60'),center,.5,0,b.w+16,3,93);
    const pm=new T.MeshStandardMaterial({map:padTex,roughness:.9});mesh(level,planeG,pm,center,2.1,0,b.w,88,1).rotation.x=-PI/2;
    for(let x=b.x;x<=b.x+b.w;x+=24)for(const z of [-43,43]){box(level,mat('#253630'),x,3,z,5,3,4);sphere(level,glow('#b1ffc7'),x,5,z,1.6,.8,1.6);halo(level,'#a9ffd5',x,6,z,10,.35);}
    building(level,{x:b.x-90,w:90,h:60,type:'block'});label(level,'RESCUE BASE','#e1cf9b',b.x-45,66,-30,90,9);
    rod(level,mat('#aaa894'),[b.x+b.w+10,0,-40],[b.x+b.w+10,70,-40],1);
    box(level,mat('#bec8a1'),b.x+b.w+23,64,-40,25,12,.3);
    for(let i=0;i<4;i++){box(level,mat('#7b795f'),b.x-105+i*13,5,3,11,10,12);}
    batchStatic(level);
  }
  function disposeOwned(root){const disposed=new Set(),shared=new Set(matCache.values());root.traverse(o=>{if(o.geometry&&!([boxG,sphereG,cylG,coneG,planeG,lowSphereG].includes(o.geometry))&&!disposed.has(o.geometry)){o.geometry.dispose();disposed.add(o.geometry);}if(o.material&&!shared.has(o.material)){if(o.material.map&&![groundTex,softTexture,concreteTex].includes(o.material.map))o.material.map.dispose();o.material.dispose();}});}

  const heli=helicopter();scene.add(heli.g);
  const shadow=mesh(scene,planeG,new T.MeshBasicMaterial({map:softTexture,color:'#091813',transparent:true,opacity:.5,depthWrite:false}),0,1,0,110,60,1);shadow.rotation.x=-PI/2;shadow.castShadow=false;
  const spotlight=new T.SpotLight('#ffdfad',16000,300,.35,.8,1);spotlight.position.set(0,50,0);scene.add(spotlight,spotlight.target);
  const beamGeo=new T.ConeGeometry(25,120,24,1,true);beamGeo.translate(0,-60,0);
  const beam=new T.Mesh(beamGeo,new T.MeshBasicMaterial({color:'#ffe2af',transparent:true,opacity:.045,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}));scene.add(beam);
  const entityMap=new Map();
  function syncEntities(list,type,update){const alive=new Set(list);for(const [key,value]of entityMap){if(value.type===type&&!alive.has(key)){scene.remove(value.model.g);disposeOwned(value.model.g);entityMap.delete(key);}}
    for(const e of list){let item=entityMap.get(e);if(!item){let model=type==='enemy'?(e.type==='tank'?tank():e.type==='drone'?drone():e.type==='jet'?jet():e.type==='sam'?sam():missile()):type==='person'?person(e):type==='pickup'?pickup(e):tank(true);item={type,model};entityMap.set(e,item);scene.add(model.g);}update(e,item.model);}}
  const particleCount=1800,pGeo=new T.BufferGeometry(),pPos=new Float32Array(particleCount*3),pColors=new Float32Array(particleCount*3),pSize=new Float32Array(particleCount),pAlpha=new Float32Array(particleCount);
  pGeo.setAttribute('position',new T.BufferAttribute(pPos,3));pGeo.setAttribute('color',new T.BufferAttribute(pColors,3));pGeo.setAttribute('size',new T.BufferAttribute(pSize,1));pGeo.setAttribute('alpha',new T.BufferAttribute(pAlpha,1));
  const pMat=new T.ShaderMaterial({transparent:true,depthWrite:false,vertexColors:true,uniforms:{pixelScale:{value:1}},vertexShader:'attribute float size;attribute float alpha;varying vec3 vColor;varying float vAlpha;uniform float pixelScale;void main(){vColor=color;vAlpha=alpha;vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_PointSize=size*pixelScale;}',fragmentShader:'varying vec3 vColor;varying float vAlpha;void main(){float d=length(gl_PointCoord-.5)*2.;float a=(1.-smoothstep(.15,1.,d))*vAlpha;gl_FragColor=vec4(vColor,a);}',blending:T.NormalBlending});
  const points=new T.Points(pGeo,pMat);points.frustumCulled=false;scene.add(points);
  const trailGeo=new T.BufferGeometry(),trailPos=new Float32Array(300*6),trailCol=new Float32Array(300*6);trailGeo.setAttribute('position',new T.BufferAttribute(trailPos,3));trailGeo.setAttribute('color',new T.BufferAttribute(trailCol,3));const trails=new T.LineSegments(trailGeo,new T.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.9,blending:T.AdditiveBlending}));trails.frustumCulled=false;scene.add(trails);
  const flashes=Array.from({length:6},()=>{const l=new T.PointLight('#ffb15d',0,160,1.5);scene.add(l);return l;});
  const rings=Array.from({length:20},()=>{const r=new T.Mesh(new T.RingGeometry(.94,1,40),new T.MeshBasicMaterial({color:'#ffbb7f',transparent:true,opacity:.2,side:T.DoubleSide,depthWrite:false}));r.visible=false;scene.add(r);return r;});
  const craters=Array.from({length:24},()=>{const m=mesh(scene,planeG,new T.MeshBasicMaterial({map:softTexture,color:'#192520',transparent:true,opacity:.65,depthWrite:false}),0,1.2,0,90,60,1);m.rotation.x=-PI/2;m.visible=false;m.castShadow=false;return m;});
  const bombModels=Array.from({length:16},()=>{const g=new T.Group();sphere(g,mat('#384b43'),0,0,0,2.6,6,2.6);box(g,mat('#e2c084'),0,1,0,5.5,1.5,5.5);box(g,mat('#293b37'),0,5,0,8,4,.7);g.visible=false;scene.add(g);return g;});
  const dust=Array.from({length:65},(_,i)=>({a:i*2.399,age:random(),speed:.4+random(),radius:random()*50}));
  const explosionSeen=new WeakSet(),smoke=[];
  let sizeW=0,sizeH=0,previous=performance.now(),visualTime=0,lastQualityUpdate=0,slowFrames=0,frames=0;
  const result={lost:false,renderer,scene,camera,stats:{},render};
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();result.lost=true;canvas.style.visibility='hidden';});
  canvas.addEventListener('webglcontextrestored',()=>{const pm=new T.PMREMGenerator(renderer);environment.dispose();environment=pm.fromScene(envScene,.025);scene.environment=environment.texture;pm.dispose();result.lost=false;canvas.style.visibility='visible';});
  document.body.classList.add('ready');
  function render(s){
    const now=performance.now(),dt=Math.min((now-previous)/1000,.05);previous=now;if(s.G.state!=='pause')visualTime+=dt;const time=visualTime, title=s.G.state==='title';
    const W=innerWidth,H=innerHeight;
    if(sizeW!==W||sizeH!==H){renderer.setSize(W,H,false);sizeW=W;sizeH=H;sky.uniforms.aspect.value=W/H;}
    if(levelRef!==s.buildings){levelRef=s.buildings;buildWorld(s);smoke.length=0;}
    const ww=title?s.VW/2.05:s.VW,hh=title?s.VH/2.05:s.VH;
    let cx=title?s.homeBase.x+s.homeBase.w/2-ww*.24:s.G.cam+s.VW/2;
    let cy=title?72:(s.groundY-s.VH/2)/co;
    const shake=s.G.shakeT>0&&!title?s.G.shakeMag*.35:0;cx+=Math.sin(time*121)*shake;cy+=Math.cos(time*97)*shake;
    camera.left=-ww/2;camera.right=ww/2;camera.top=hh/2;camera.bottom=-hh/2;camera.position.set(cx,cy+si*2000,co*2000);camera.lookAt(cx,cy,0);camera.updateProjectionMatrix();
    sun.position.set(cx-350,750,300);sun.target.position.set(cx,0,0);
    sky.uniforms.time.value=time;
    const h=s.heli;
    heli.g.visible=title||h.alive;heli.g.position.set(title?s.homeBase.x+s.homeBase.w*.56:h.x,title?87+Math.sin(time*.8)*1.8:(s.groundY-h.y)/co,0);
    const yaw=title?-.34:-Math.acos(clamp(h.yawVis,-1,1));
    heli.g.rotation.set(0,yaw,title?-.025:-h.att,'ZYX');
    heli.rotor.rotation.y=title?time*37:h.rotor*1.6;heli.tail.rotation.z=-time*67;heli.disc.material.opacity=title?.1:.035+h.spool*.055;
    heli.red.material.opacity=Math.pow(Math.max(0,Math.sin(time*5)),12)*.9;heli.green.material.opacity=.5;
    heli.muzzle.material.opacity=s.G.state==='play'&&h.fireCd>6?.9:0;
    if(h.invuln>0&&!title)heli.g.visible=h.alive&&(Math.sin(time*40)>-.65);
    const alt=heli.g.position.y;
    shadow.position.x=heli.g.position.x+alt*.22;shadow.scale.set(100+alt*.35,50+alt*.15,1);shadow.material.opacity=clamp(.6-alt*.001,.12,.6);shadow.visible=heli.g.visible;
    spotlight.position.set(heli.g.position.x+16,alt-7,6);spotlight.target.position.set(heli.g.position.x+30,0,20);spotlight.intensity=alt<230?3500:0;
    beam.visible=heli.g.visible&&alt<180;beam.position.copy(spotlight.position);beam.scale.set(1,Math.max(0,alt-7)/120,1);
    syncEntities(s.enemies,'enemy',(e,m)=>{m.g.visible=!e.dead&&e.x>s.G.cam-250&&e.x<s.G.cam+s.VW+250&&!title;m.g.position.set(e.x,e.type==='tank'||e.type==='sam'?1:(s.groundY-e.y)/co,0);if(e.type==='tank'){m.g.rotation.y=e.vx<0?PI:0;m.turret.rotation.z=-Math.sin(e.turret||0)*.35;}else if(e.type==='drone'){m.g.rotation.z=Math.sin(time*2+e.x)*.06;for(const r of m.rotors)r.rotation.y=time*46;}else if(e.type==='jet')m.g.rotation.y=e.vx<0?PI:0;else if(e.type==='missile')m.g.rotation.z=-(e.ang||0);else if(e.type==='sam')m.dish.rotation.y=time;});
    syncEntities(s.hostages,'person',(e,m)=>{m.g.visible=!['aboard','home','lost'].includes(e.state)&&e.x>s.G.cam-100&&e.x<s.G.cam+s.VW+100;m.g.position.set(e.x,1,9);const run=['run','boarding','delivered'].includes(e.state);for(let i=0;i<2;i++){m.legs[i].rotation.x=run?Math.sin(e.frame*1.6+i*PI)*.6:0;m.arms[i].rotation.z=e.state==='wait'?(i===0?-1:1)*(2.3+Math.sin(e.anim)*.3):Math.sin(e.frame*1.6+i*PI)*.5;} });
    syncEntities(s.pickups,'pickup',(e,m)=>{m.g.visible=!e.taken&&!title;m.g.position.set(e.x,(s.groundY-e.y)/co,3);m.g.rotation.y=time*.8;});
    syncEntities(s.wrecks,'wreck',(e,m)=>{m.g.position.set(e.x,0,0);m.g.rotation.z=.04;m.g.visible=e.t<690;});
    // Pool all explosion smoke, dust and sparks into one draw call.
    let count=0;const color=new T.Color();
    const particle=(x,y,z,size,c,a)=>{if(count>=particleCount)return;color.set(c);let k=count*3;pPos[k]=x;pPos[k+1]=y;pPos[k+2]=z;pColors[k]=color.r;pColors[k+1]=color.g;pColors[k+2]=color.b;pSize[count]=size;pAlpha[count]=a;count++;};
    for(const p of s.particles){if(p.x<s.G.cam-100||p.x>s.G.cam+s.VW+100)continue;const a=clamp(p.life/p.maxLife,0,1),sm=p.fade==='smoke';particle(p.x,(s.groundY-p.y)/co,8+hash(p.r,1)*14,p.r*(sm?6:3),sm?'#737369':p.color,a*(sm?.36:.85));}
    for(const r of s.rings){if(!explosionSeen.has(r)){explosionSeen.add(r);for(let i=0;i<16;i++)smoke.push({x:r.x,y:(s.groundY-r.y)/co,z:random()*24,vx:(random()-.5)*35,vy:8+random()*23,age:0,life:1.5+random()*1.8,r:12+random()*22});}}
    for(let i=smoke.length-1;i>=0;i--){const p=smoke[i];if(s.G.state!=='pause'){p.age+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;}if(p.age>p.life){smoke.splice(i,1);continue;}particle(p.x,p.y,p.z,p.r*(1+p.age),p.age<.18?'#ffd68d':'#454c47',(1-p.age/p.life)*.38);}
    if(heli.g.visible&&alt<150){const force=clamp(1-alt/170,0,1)*(title?1:h.spool);for(const p of dust){const age=(time*p.speed*.4+p.age)%1,r=25+age*85;particle(heli.g.position.x+Math.cos(p.a)*r,2+Math.sin(age*PI)*9,p.a%2?Math.sin(p.a)*r:12,12+age*25,'#c4b99a',(1-age)*.15*force);}}
    for(let i=0;i<28;i++){const x=cx-ww/2+((i*37.21+time*2)%ww),y=20+hash(i,7)*180;particle(x,y,50+hash(i,4)*200,1.2,'#fff1c7',.27);}
    pGeo.setDrawRange(0,count);for(const a of Object.values(pGeo.attributes))a.needsUpdate=true;pMat.uniforms.pixelScale.value=H/hh*renderer.getPixelRatio();
    let lineCount=0;for(const b of s.bullets){if(lineCount>=300)break;const k=lineCount*6;trailPos.set([b.x,(s.groundY-b.y)/co,4,b.x-b.vx*2,(s.groundY-b.y+b.vy*2)/co,4],k);color.set(b.enemy?'#ff8051':'#ffdf87');trailCol.set([color.r,color.g,color.b,color.r,color.g,color.b],k);lineCount++;}
    for(const b of s.bombs){if(lineCount>=300)break;const k=lineCount*6;trailPos.set([b.x,(s.groundY-b.y)/co,2,b.x,(s.groundY-b.y+7)/co,2],k);trailCol.set([1,.6,.2,.6,.4,.2],k);lineCount++;}
    trailGeo.setDrawRange(0,lineCount*2);trailGeo.attributes.position.needsUpdate=true;trailGeo.attributes.color.needsUpdate=true;
    for(let i=0;i<rings.length;i++){const r=s.rings[i],m=rings[i];m.visible=!!r;if(r){m.position.set(r.x,(s.groundY-r.y)/co,8);const f=1-r.life/r.maxLife;m.scale.setScalar(8+f*r.max);m.material.opacity=(1-f)*.5;}}
    for(let i=0;i<craters.length;i++){const c=s.scorch[i],m=craters[i];m.visible=!!c;if(c){m.position.x=c.x;m.material.opacity=clamp(1-c.t/900,0,1)*.65;}}
    for(let i=0;i<bombModels.length;i++){const b=s.bombs[i],m=bombModels[i];m.visible=!!b;if(b){m.position.set(b.x,(s.groundY-b.y)/co,3);m.rotation.z=-Math.atan2(b.vy,b.vx)-PI/2;}}
    for(let i=0;i<flashes.length;i++){const r=s.rings[i];flashes[i].intensity=r?r.life/r.maxLife*42000:0;if(r)flashes[i].position.set(r.x,(s.groundY-r.y)/co+15,30);}
    renderer.clear();renderer.render(bgScene,bgCamera);renderer.clearDepth();renderer.render(scene,camera);
    frames++;if(dt>.032&&s.G.state==='play')slowFrames++;
    if(now-lastQualityUpdate>5000){if(slowFrames>frames*.4&&renderer.getPixelRatio()>1){renderer.setPixelRatio(1);renderer.setSize(W,H,false);sun.shadow.mapSize.set(1024,1024);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null;}}lastQualityUpdate=now;frames=0;slowFrames=0;}
    result.stats={drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,entities:entityMap.size,particles:count,pixelRatio:renderer.getPixelRatio()};
  }
  return result;
}

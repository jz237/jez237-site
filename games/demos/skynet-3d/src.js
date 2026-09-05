import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { createCinematic } from './cinematic.js';
import { techText, createPowerUp } from './refinements.js';
import { createPanelMetals } from './panel-metal.js';
import { createFinalPolish, setupShowcase } from './showcase.js';

const $=id=>document.getElementById(id), TAU=Math.PI*2;
let seed=3719;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
const scene=new T.Scene();scene.background=new T.Color(0x020408);scene.fog=new T.FogExp2(0x03070c,.016);
const renderer=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance',preserveDrawingBuffer:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.toneMapping=T.ReinhardToneMapping;renderer.toneMappingExposure=1.05;
renderer.info.autoReset=false;
$('stage').append(renderer.domElement);
const camera=new T.PerspectiveCamera(38,innerWidth/innerHeight,.1,150);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.07;controls.rotateSpeed=.55;controls.enablePan=false;controls.minDistance=12;controls.maxDistance=85;controls.minPolarAngle=.17;controls.maxPolarAngle=Math.PI*.82;controls.autoRotateSpeed=.65;
let cinema,needsRender=true;controls.addEventListener('change',()=>{needsRender=true});
const reset=()=>{cinema?.cancel();controls.autoRotate=false;$('orbit').setAttribute('aria-pressed','false');const damping=controls.enableDamping;controls.enableDamping=false;controls.update();const d=Math.max(22.6,24.5/Math.max(camera.aspect,.32));controls.target.set(0,.65,0);camera.position.set(.12,.65,d);controls.update();controls.enableDamping=damping};reset();controls.autoRotateSpeed=.24;
const target=new T.WebGLRenderTarget(innerWidth,innerHeight,{type:T.HalfFloatType,samples:4});
const composer=new EffectComposer(renderer,target);composer.addPass(new RenderPass(scene,camera));
const bloomComposer=new EffectComposer(renderer);bloomComposer.renderToScreen=false;bloomComposer.addPass(new RenderPass(scene,camera));
const bloom=new UnrealBloomPass(new T.Vector2(innerWidth,innerHeight),.4,0,.3);bloomComposer.addPass(bloom);
const blend=new ShaderPass(new T.ShaderMaterial({uniforms:{baseTexture:{value:null},bloomTexture:{value:bloomComposer.renderTarget2.texture}},vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'uniform sampler2D baseTexture; uniform sampler2D bloomTexture; varying vec2 vUv; void main(){gl_FragColor=texture2D(baseTexture,vUv)+texture2D(bloomTexture,vUv);}' }),'baseTexture');composer.addPass(blend);composer.addPass(new OutputPass());
// A dark studio with narrow luminous softboxes gives the chrome real reflections.
const env=new T.Scene();env.background=new T.Color(0x010205);
for(const [x,y,z,w,h,power] of [[0,8,7,18,2,7],[-9,3,5,2,12,4],[10,1,3,1,10,5],[0,-7,8,15,.45,2],[1,2,-9,7,3,3],[0,1,11,18,1.4,4]]){const panel=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:new T.Color(power,power*1.05,power*1.15),side:T.DoubleSide}));panel.position.set(x,y,z);panel.lookAt(0,0,0);env.add(panel)}
const pmrem=new T.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(env,.015).texture;env.traverse(o=>{o.geometry?.dispose();o.material?.dispose()});pmrem.dispose();scene.environmentIntensity=.65;
scene.add(new T.HemisphereLight(0xbce4ff,0x030103,.32));
function light(color,power,x,y,z){const l=new T.DirectionalLight(color,power);l.position.set(x,y,z);scene.add(l);return l}
light(0xc9e6ff,5,-6,10,6);light(0xffffff,3.5,4,3,10);light(0xff1328,1.2,0,-5,5);light(0x3a83bb,2,4,7,-7);
const coreLight=new T.PointLight(0xff1933,35,14,2);coreLight.position.set(0,.9,3);scene.add(coreLight);
function brushed(){const c=document.createElement('canvas');c.width=1024;c.height=128;const g=c.getContext('2d');g.fillStyle='#888';g.fillRect(0,0,1024,128);for(let i=0;i<3400;i++){const q=100+rnd()*60;g.strokeStyle=`rgba(${q},${q},${q},.26)`;let y=rnd()*128;g.beginPath();g.moveTo(rnd()*1024,y);g.lineTo(rnd()*1024,y+.2);g.stroke()}const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(.45,.65);return t}
const brush=brushed();
const chrome=new T.MeshPhysicalMaterial({color:0xbac8d6,metalness:1,roughness:.16,clearcoat:.7,clearcoatRoughness:.11,envMap:scene.environment,envMapIntensity:1.1,bumpMap:brush,bumpScale:.012});
const silver=new T.MeshPhysicalMaterial({color:0xe0e8f0,metalness:.9,roughness:.2,clearcoat:.7});
const steel=new T.MeshStandardMaterial({color:0x101721,metalness:1,roughness:.27,envMapIntensity:.3,bumpMap:brush,bumpScale:.014});
const black=new T.MeshStandardMaterial({color:0x020307,metalness:1,roughness:.26,envMap:scene.environment,envMapIntensity:.16,bumpMap:brush,bumpScale:.013});
const panelMetals=createPanelMetals(renderer,scene.environment);
const red=new T.MeshBasicMaterial({color:new T.Color(2.8,.001,.008)});
const dimRed=new T.MeshBasicMaterial({color:new T.Color(.52,.003,.009)}),ice=new T.MeshBasicMaterial({color:new T.Color(.14,.35,.65)}),hot=new T.MeshBasicMaterial({color:new T.Color(12,2.4,2.8)});
for(const mat of [red,dimRed,hot])mat.userData.glow=true;
const darkBloom=new T.MeshBasicMaterial({color:0}),darkLine=new T.LineBasicMaterial({color:0});const originals=new Map();
function renderScene(){renderer.info.reset();const bg=scene.background;scene.background=new T.Color(0);const hidden=[];scene.traverse(o=>{if(!o.visible)return;if((o.isPoints||o.isSprite||(o.isMesh&&o.material?.transparent))&&!o.material?.userData?.glow){hidden.push(o);o.visible=false}else if((o.isMesh||o.isLine)&&!o.material?.userData?.glow){originals.set(o,o.material);o.material=o.isLine?darkLine:darkBloom}});bloomComposer.render();originals.forEach((m,o)=>{o.material=m});originals.clear();hidden.forEach(o=>o.visible=true);scene.background=bg;composer.render()}
const root=new T.Group();root.name='Skynet sculpture';scene.add(root);const turners=[],pulses=[];
// One draw call per light bank; phases are deterministic and pause with the scene.
const beacons=[];let beaconCount=0;
function beaconBank(points,parent,size=1){
 const geometry=new T.BufferGeometry(),positions=[],phases=[],rates=[],colors=[],sizes=[];
 points.forEach((p,i)=>{positions.push(...p);phases.push(rnd()*TAU);rates.push(.65+rnd()*1.05);colors.push(...(i%7===0?[.48,1.7,3.3]:[4.5,.035,.065]));sizes.push(size*(.7+rnd()*.6))});
 geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('phase',new T.Float32BufferAttribute(phases,1));geometry.setAttribute('rate',new T.Float32BufferAttribute(rates,1));geometry.setAttribute('tint',new T.Float32BufferAttribute(colors,3));geometry.setAttribute('size',new T.Float32BufferAttribute(sizes,1));
 const material=new T.ShaderMaterial({uniforms:{time:{value:0},resolution:{value:innerHeight*renderer.getPixelRatio()}},transparent:true,depthWrite:false,blending:T.AdditiveBlending,
 vertexShader:`uniform float time;uniform float resolution;attribute float phase;attribute float rate;attribute float size;attribute vec3 tint;varying vec3 vTint;varying float vPulse;void main(){vPulse=.045+.955*pow(max(0.,sin(time*rate*6.283185+phase)),12.);vTint=tint;vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(size*resolution*.23/-mv.z,2.,48.);}`,
 fragmentShader:`varying vec3 vTint;varying float vPulse;void main(){vec2 p=gl_PointCoord-.5;float r=length(p);float halo=exp(-r*r*34.)*.36;float core=exp(-r*r*620.);float cross=(exp(-abs(p.x)*105.)*exp(-abs(p.y)*12.)+exp(-abs(p.y)*105.)*exp(-abs(p.x)*12.))*.4;float a=(halo+core+cross)*vPulse;if(a<.004)discard;gl_FragColor=vec4(vTint+vec3(core*2.),a);}`});
 material.userData.glow=true;const bank=new T.Points(geometry,material);bank.name='Blinking neural beacons';parent.add(bank);beacons.push(material);beaconCount+=points.length;return bank;
}
function mesh(g,m,parent=root,x=0,y=0,z=0){const o=new T.Mesh(g,m);o.position.set(x,y,z);parent.add(o);return o}
function box(w,h,d,m,parent,x=0,y=0,z=0){return mesh(new T.BoxGeometry(w,h,d),m,parent,x,y,z)}
function poly(points){const s=new T.Shape();points.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();return s}
function extrude(shape,depth,bevel=.025){return new T.ExtrudeGeometry(shape,{depth,bevelEnabled:bevel>0,bevelSize:bevel,bevelThickness:bevel,bevelSegments:3,steps:1,curveSegments:12})}
function stroke(points,material,parent=root,closed=false){const a=points.map(p=>new T.Vector3(...p));if(closed)a.push(a[0].clone());const g=new T.BufferGeometry().setFromPoints(a);const o=new T.Line(g,material);parent.add(o);return o}
const thinRed=new T.LineBasicMaterial({color:0xff2138,transparent:true,opacity:.4}),faintBlue=new T.LineBasicMaterial({color:0x6b98bd,transparent:true,opacity:.07});
function torus(r,t,m,parent,x=0,y=0,z=0,arc=TAU){return mesh(new T.TorusGeometry(r,t,6,Math.max(24,Math.ceil(120*arc/TAU)),arc),m,parent,x,y,z)}
function sector(r,w,a,len,d,m,parent,z=0){const s=new T.Shape();s.absarc(0,0,r+w/2,a,a+len,false);s.absarc(0,0,r-w/2,a+len,a,true);s.closePath();return mesh(extrude(s,d,.018),m,parent,0,0,z)}
function bolts(radius,n,size,parent,z=0){const geo=new T.CylinderGeometry(size,size,size*.65,6);geo.rotateX(Math.PI/2);const inst=new T.InstancedMesh(geo,silver,n);const dummy=new T.Object3D();for(let i=0;i<n;i++){const a=i/n*TAU;dummy.position.set(Math.cos(a)*radius,Math.sin(a)*radius,z);dummy.rotation.z=a;dummy.updateMatrix();inst.setMatrixAt(i,dummy.matrix)}parent.add(inst)}
function ticks(radius,n,w,h,mat,parent,z=0){const inst=new T.InstancedMesh(new T.BoxGeometry(w,h,.035),mat,n);const dummy=new T.Object3D();for(let i=0;i<n;i++){const a=i/n*TAU;dummy.position.set(Math.sin(a)*radius,Math.cos(a)*radius,z);dummy.rotation.z=-a;dummy.updateMatrix();inst.setMatrixAt(i,dummy.matrix)}parent.add(inst);return inst}
// Counter-rotating concentric mechanical chassis.
const chassis=new T.Group();chassis.position.set(0,1.25,-.8);root.add(chassis);
for(let k=0;k<7;k++){
 const g=new T.Group();g.position.z=-k*.18;chassis.add(g);turners.push({g,s:(k%2?-.018:.024)*(1+k*.12)});const r=4.28+k*.285;
 torus(r,.045,k%2?chrome:steel,g);torus(r+.13,.009,k%2?dimRed:steel,g,0,0,.1);
 for(let j=0;j<12;j++){const a=j/12*TAU+k*.22;sector(r,.13+(k%3)*.045,a,.30+(j%3)*.026,.12,j%4===0?chrome:steel,g);if(j%3!==0)sector(r+.06,.022,a+.035,.14,.01,dimRed,g,.16)}
 ticks(r,120,.025,.07,chrome,g,.15);bolts(r,24,.027,g,.21);
 for(let j=0;j<18;j++){const a=j/18*TAU+.05;sector(r-.075,.05,a,.09,.20,black,g,.04);if(j%3===0)sector(r+.075,.026,a,.13,.035,red,g,.15)}
 beaconBank(Array.from({length:32},(_,j)=>{const a=j/32*TAU+k*.19;return[Math.cos(a)*r,Math.sin(a)*r,.27]}),g,.9);
 for(let j=0;j<8;j++){const a=j*TAU/8+.1*k;sector(r,.075,a,.19,.065,silver,g,.22);sector(r-.11,.012,a,.37,.01,chrome,g,.18)}
}
for(let side of [-1,1]){const g=new T.Group();chassis.add(g);for(let j=0;j<5;j++){const a=(side===1?-.18:Math.PI-.12)+j*.13;sector(6.13+j*.045,.18,a,.28,.38,chrome,g,.08);sector(6.08+j*.045,.032,a,.22,.035,red,g,.50)}}
// Neural globe behind the crest.
const neural=new T.Group();neural.position.set(0,1.45,-4.0);root.add(neural);turners.push({g:neural,s:.022,axis:'y'});
const ico=new T.IcosahedronGeometry(4.12,5);neural.add(new T.LineSegments(new T.WireframeGeometry(ico),new T.LineBasicMaterial({color:0x7ea1bd,transparent:true,opacity:.065})));
for(let j=0;j<9;j++){const r=Math.sqrt(4.12**2-((j-4)*.79)**2);const ring=torus(r,.007,ice,neural,0,(j-4)*.79,0);ring.rotation.x=Math.PI/2;ring.material=new T.MeshBasicMaterial({color:0x55778c,transparent:true,opacity:.2})}
const nodeGeo=new T.SphereGeometry(.038,6,6);const stars=[];
for(let i=0;i<190;i++){const a=rnd()*TAU,b=Math.acos(2*rnd()-1);const p=new T.Vector3(4.14*Math.sin(b)*Math.cos(a),4.14*Math.cos(b),4.14*Math.sin(b)*Math.sin(a));stars.push(p)}
beaconBank(stars.map(p=>p.toArray()),neural,1.8);
for(let i=0;i<stars.length;i++)for(let j=i+1;j<stars.length;j++){const dist=stars[i].distanceTo(stars[j]);if(dist<1.5&&dist>.6)stroke([stars[i].toArray(),stars[j].toArray()],i%5?faintBlue:thinRed,neural)}
// Armored plates reproduce the three-part silhouette of the reference.
const crest=new T.Group();crest.position.z=.15;root.add(crest);
const plates=[[[0,5.55],[-1.38,4.04],[0,2.55],[1.38,4.04]],[[-1.48,3.87],[-4.05,.12],[-.58,.12],[-.15,1.37]],[[1.48,3.87],[.15,1.37],[.58,.12],[4.05,.12]]];
plates.forEach(p=>{mesh(extrude(poly(p),.42,.07),panelMetals.withEdges(chrome),crest);const cx=p.reduce((a,b)=>a+b[0],0)/p.length,cy=p.reduce((a,b)=>a+b[1],0)/p.length;
 const inner=p.map(([x,y])=>[cx+(x-cx)*.965,cy+(y-cy)*.965]);mesh(extrude(poly(inner),.08,.024),panelMetals.withEdges(black),crest,0,0,.49);
 stroke(p.map(([x,y])=>[cx+(x-cx)*.985,cy+(y-cy)*.985,.425]),thinRed,crest,true);
});
// Fine etched paths and inset chips, clipped to the crest plates.
function within(x,y,p){let inside=false;for(let i=0,j=p.length-1;i<p.length;j=i++){if(((p[i][1]>y)!==(p[j][1]>y))&&(x<(p[j][0]-p[i][0])*(y-p[i][1])/(p[j][1]-p[i][1])+p[i][0]))inside=!inside}return inside}
const etch=new T.LineBasicMaterial({color:0x8295a9,transparent:true,opacity:.038});const chipGeo=new T.BoxGeometry(.08,.035,.022),etchPoints=[],plateLights=[];
for(const p of plates){for(let i=0;i<1600;i++){const x=(rnd()-.5)*8,y=rnd()*5.5,len=.025+rnd()*.3,dy=(rnd()-.5)*.13;const pts=[[x,y,.603],[x+len*.6,y+dy,.603],[x+len,y+dy,.603]];if(!pts.every(v=>within(v[0],v[1],p)))continue;for(let j=1;j<pts.length;j++)etchPoints.push(new T.Vector3(...pts[j-1]),new T.Vector3(...pts[j]));if(i%15===0)mesh(chipGeo,steel,crest,x,y,.619);if(i%21===0)plateLights.push([x,y,.647])}}
crest.add(new T.LineSegments(new T.BufferGeometry().setFromPoints(etchPoints),etch));beaconBank(plateLights,crest,.58);
// Rear casing, radial supports and connector blocks give the sculpture a built back.
const rear=new T.Group();rear.position.set(0,1.25,-2.2);root.add(rear);
for(let j=0;j<8;j++){const a=j/8*TAU;const support=box(.17,2.9,.23,black,rear,Math.sin(a)*4.55,Math.cos(a)*4.55,0);support.rotation.z=-a;const cap=box(.28,.38,.32,steel,rear,Math.sin(a)*5.8,Math.cos(a)*5.8,-.1);cap.rotation.z=-a}
torus(5.8,.13,black,rear);torus(4.0,.065,chrome,rear);bolts(5.8,48,.04,rear,-.18);
function glowSprite(color,size,parent,x,y,z,opacity=.65){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');const grad=g.createRadialGradient(64,64,0,64,64,64);grad.addColorStop(0,'rgba(255,255,255,1)');grad.addColorStop(.08,'rgba(255,255,255,.7)');grad.addColorStop(.25,'rgba(255,255,255,.18)');grad.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=grad;g.fillRect(0,0,128,128);const m=new T.SpriteMaterial({map:new T.CanvasTexture(c),color,transparent:true,opacity,blending:T.AdditiveBlending,depthWrite:false});m.userData.glow=true;const s=new T.Sprite(m);s.scale.set(size,size,1);s.position.set(x,y,z);parent.add(s);return s}
function coreAssembly(x,y,z,r){const g=new T.Group();g.position.set(x,y,z);root.add(g);mesh(new T.CylinderGeometry(r,r,.46,80).rotateX(Math.PI/2),black,g);
 if(r>1){
  g.name='Recessed iris reactor';
  const annulus=(outer,inner,depth,mat,z)=>{const s=new T.Shape();s.absarc(0,0,outer,0,TAU,false);const h=new T.Path();h.absarc(0,0,inner,0,TAU,true);s.holes.push(h);return mesh(extrude(s,depth,.022),mat,g,0,0,z)};
  annulus(r*1.04,r*.72,.34,black,.24);annulus(r*.99,r*.87,.11,chrome,.59);annulus(r*.79,r*.40,.22,steel,.36);annulus(r*.72,r*.57,.07,chrome,.60);
  for(let j=0;j<20;j++){const a=j*TAU/20;sector(r*.93,.11,a,.19,.09,j%4===0?chrome:steel,g,.74);sector(r*.94,.023,a+.028,.07,.018,red,g,.847);sector(r*.81,.032,a+.04,.11,.028,chrome,g,.64)}
  torus(r*1.045,.015,red,g,0,0,.59);torus(r*.74,.012,red,g,0,0,.72);torus(r*.43,.014,chrome,g,0,0,.49);
  bolts(r*.92,20,.035,g,.85);ticks(r*.79,120,.008,.042,chrome,g,.67);
  const iris=new T.Group();iris.name='Nine mechanical iris blades';iris.position.z=.73;g.add(iris);turners.push({g:iris,s:.027});
  const blade=poly([[.28,-.08],[.57,-.26],[.84,-.12],[.73,.14],[.43,.22],[.25,.14]]);
  const irisMetal=steel.clone();irisMetal.color.set(0x0b131d);irisMetal.envMapIntensity=.13;irisMetal.roughness=.29;
  const irisEtch=new T.LineBasicMaterial({color:0x7e9eb7,transparent:true,opacity:.3});
  for(let j=0;j<9;j++){const leaf=new T.Group();leaf.rotation.z=j*TAU/9;leaf.position.z=(j%3)*.013;iris.add(leaf);mesh(extrude(blade,.045,.009),irisMetal,leaf);stroke([[.28,-.08,.057],[.57,-.26,.057],[.84,-.12,.057]],irisEtch,leaf);for(let k=0;k<3;k++)stroke([[.47+k*.045,-.05,.058],[.64+k*.04,-.1,.058]],irisEtch,leaf)}
  const lensMat=new T.MeshPhysicalMaterial({color:0x9c0310,metalness:.25,roughness:.075,clearcoat:1,transparent:true,opacity:.55,depthWrite:false,emissive:0x340008,emissiveIntensity:.2});
  const lens=mesh(new T.SphereGeometry(.24,40,24),lensMat,g,0,0,.37);lens.scale.z=.5;lens.name='Recessed red lens';
  mesh(new T.SphereGeometry(.095,24,16),hot,g,0,0,.43);torus(.145,.009,red,g,0,0,.46);torus(.225,.012,red,g,0,0,.47);
  const glow=glowSprite(0xff122c,.92,g,0,0,.51,.64);pulses.push({obj:glow,base:.92});const flare=glowSprite(0xff2035,1,g,0,0,.52,.40);flare.scale.set(3.4,.045,1);
  beaconBank(Array.from({length:32},(_,i)=>{const a=i*TAU/32;return[Math.cos(a)*r*.84,Math.sin(a)*r*.84,.80]}),g,.65);
  return g;
 }
 for(let i=0;i<8;i++){const rad=r*(.23+i*.104);torus(rad,i%3===0?.036:.015,i%3===0?chrome:(i%2?red:steel),g,0,0,.31+i*.012)}
 const rotor=new T.Group();rotor.position.z=.41;g.add(rotor);turners.push({g:rotor,s:-.12});ticks(r*.83,48,.027,.095,chrome,rotor);bolts(r*.93,16,.033,rotor,.025);for(let j=0;j<6;j++)sector(r*.68,.035,j/6*TAU,.40,.04,red,rotor,.015);
 for(let j=0;j<16;j++){const a=j*TAU/16;sector(r*.91,.065,a,.17,.07,j%3?steel:chrome,g,.46);sector(r*.51,.025,a+.06,.13,.04,j%4?chrome:red,g,.48)}
 ticks(r*.38,96,.007,r*.035,chrome,g,.49);torus(r*.25,.009,red,g,0,0,.54);
 mesh(new T.SphereGeometry(r*.115,24,16),hot,g,0,0,.47);const glow=glowSprite(0xff0b24,r*1.1,g,0,0,.65,.7);const flare=glowSprite(0xff2438,1,g,0,0,.67,.46);flare.scale.set(r*4.8,r*.075,1);pulses.push({obj:glow,base:r*1.1});
 beaconBank(Array.from({length:32},(_,i)=>{const a=i*TAU/32;return[Math.cos(a)*r*.76,Math.sin(a)*r*.76,.57]}),g,.65);return g;
}
const primaryCore=coreAssembly(0,.83,1.08,1.18),upperCore=coreAssembly(0,3.08,.86,.43);
// Custom angular glyphs with solid extruded bodies and red inlaid seams.
const glyph={
S:[[1,.98],[.2,.98],[0,.78],[0,.54],[.17,.40],[.70,.40],[.75,.34],[.75,.24],[.69,.18],[0,.18],[0,0],[.79,0],[1,.19],[1,.45],[.81,.59],[.29,.59],[.24,.65],[.24,.75],[.30,.81],[1,.81]],
K:[[0,0],[.24,0],[.24,.36],[.38,.50],[.79,0],[1.06,0],[.56,.65],[1.03,1],[.74,1],[.24,.61],[.24,1],[0,1]],
Y:[[0,1],[.27,1],[.55,.62],[.86,1],[1.13,1],[.67,.41],[.67,0],[.43,0],[.43,.41]],
N:[[0,0],[.22,0],[.22,.67],[.79,0],[1,0],[1,1],[.78,1],[.78,.32],[.21,1],[0,1]],
E:[[0,0],[.95,0],[1,.2],[.24,.2],[.24,.41],[.84,.41],[.84,.6],[.24,.6],[.24,.80],[1,.80],[.94,1],[0,1]],
T:[[0,1],[1.1,1],[1.14,.8],[.69,.8],[.69,0],[.44,0],[.44,.8],[.02,.8]]};
const letterMetal=chrome.clone();letterMetal.roughness=.16;letterMetal.envMapIntensity=1.35;
letterMetal.onBeforeCompile=shader=>{
 shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vLocal;').replace('#include <begin_vertex>','#include <begin_vertex>\nvLocal=position;');
 shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vLocal;').replace('#include <color_fragment>',`#include <color_fragment>
 float bands = .34 + .65*smoothstep(.53,.9, fract(vLocal.y/1.85+.02));
 bands += .23*exp(-pow((vLocal.y-.96)*9.,2.));
 diffuseColor.rgb *= bands;
 `);
};
function letterGeometry(s,depth,bevel,flatTop=false){
 const g=extrude(s,depth,bevel);
 if(flatTop){
  // ExtrudeGeometry limits sharp-corner miters independently, tilting diagonal-arm
  // end caps. Give every top vertex the same rounded-bevel height at each depth.
  const p=g.attributes.position;
  for(let i=0;i<p.count;i++)if(p.getY(i)>=1.75-1e-6){const z=p.getZ(i),endDistance=Math.max(0,-z,z-depth);const rise=endDistance>=bevel-1e-6?0:Math.sqrt(Math.max(0,bevel*bevel-endDistance*endDistance));p.setY(i,1.75+rise)}
  p.needsUpdate=true;g.computeVertexNormals();g.computeBoundingBox();g.computeBoundingSphere();
 }
 return g;
}
function letterFace(s,flatTop=false){const g=letterGeometry(s,.095,.087,flatTop),n=g.attributes.normal,p=g.attributes.position;for(let i=0;i<n.count;i++)if(n.getZ(i)>.99){const v=new T.Vector3(.025,(p.getY(i)-.85)*.22,1).normalize();n.setXYZ(i,v.x,v.y,v.z)}return g}
const word=new T.Group();word.name='Extruded SKYNET letters';word.position.set(-6.4,-2.74,1.55);root.add(word);let cursor=0;
for(const letter of 'SKYNET'){const g=new T.Group();g.position.x=cursor;word.add(g);const pts=glyph[letter].map(([x,y])=>[x*1.81+y*.14,y*1.75]);const s=poly(pts),flatTop=letter==='K'||letter==='Y';mesh(letterGeometry(s,.82,.125,flatTop),black,g,0,0,-.74);mesh(letterGeometry(s,.045,.102,flatTop),red,g,0,0,.105);mesh(letterFace(s,flatTop),letterMetal,g,0,.025,.235);cursor+=Math.max(...pts.map(v=>v[0]))+.16}word.scale.x=12.8/(cursor-.16);
const wordBacking=mesh(extrude(poly([[-6.85,-2.98],[-6.53,-1.01],[6.55,-1.01],[6.80,-2.98]]),.27,.065),panelMetals.withEdges(panelMetals.face),root,0,0,.89);wordBacking.name='Brushed-metal SKYNET backing panel';
stroke([[-6.8,-2.94,1.25],[-6.5,-1.04,1.25],[6.5,-1.04,1.25]],thinRed);
for(let i=0;i<44;i++)box(.16,.035,.025,i%7?steel:red,root,-6.2+i*.29,-2.91,1.29);
const subtitle=new T.Group();subtitle.name='Extruded CYBERDYNE SYSTEMS';subtitle.position.set(0,-.61,1.27);root.add(subtitle);
mesh(extrude(poly([[-5.92,-.17],[-5.64,.43],[5.61,.43],[5.94,-.17]]),.20,.045),panelMetals.withEdges(black),subtitle,0,0,-.1);
const textGroup=techText('CYBERDYNE SYSTEMS',silver);subtitle.add(textGroup);
box(11.4,.023,.03,red,subtitle,0,-.16,.23);
// Lower diamond and illuminated platform.
mesh(extrude(poly([[-3.5,-2.62],[0,-4.31],[3.5,-2.62],[0,-1.8]]),.36,.06),panelMetals.withEdges(chrome),root,0,0,-.35);mesh(extrude(poly([[-3.18,-2.63],[0,-4.12],[3.18,-2.63],[0,-2.0]]),.15,.025),panelMetals.withEdges(black),root,0,0,.09);
stroke([[-3.1,-2.65,.31],[0,-4.10,.31],[3.1,-2.65,.31]],thinRed);box(.065,1.42,.1,red,root,0,-3.55,.48);glowSprite(0xff102a,1.3,root,0,-4.14,.52,.7);
const platformMetal=black.clone();platformMetal.color.set(0x040609);platformMetal.envMapIntensity=.025;platformMetal.roughness=.34;
const dais=new T.Group();dais.position.set(0,-4.45,0);root.add(dais);for(let i=0;i<4;i++){const r=6.8-i*.85;mesh(new T.CylinderGeometry(r,r+.08,.16,128),platformMetal,dais,0,i*.12,0)}
const floorRings=new T.Group();floorRings.rotation.x=-Math.PI/2;floorRings.position.y=.51;dais.add(floorRings);
for(let i=0;i<11;i++){const r=1.55+i*.40;torus(r,i%3===0?.025:.010,i%3===0?red:(i%2?chrome:steel),floorRings);if(i%2===0){ticks(r,96,.032,.055,chrome,floorRings,.015);bolts(r,24,.023,floorRings,.015)}}
const floorRotor=new T.Group();floorRings.add(floorRotor);turners.push({g:floorRotor,s:.04});for(let j=0;j<18;j++){sector(5.6,.16,j*TAU/18,.25,.04,black,floorRotor);sector(5.15,.035,j*TAU/18,.10,.02,red,floorRotor,.02)}
for(let j=0;j<48;j++){
 const a=j/48*TAU;sector(6.32,.84,a,.115,.045,j%4===0?steel:black,floorRings,-.27);
 sector(5.9,.045,a+.012,.08,.05,chrome,floorRings,-.20);
 if(j%3===0)sector(6.36,.035,a+.02,.06,.02,red,floorRings,-.18);
 const c=Math.cos(a),s=Math.sin(a);stroke([[c*5.78,s*5.78,.01],[c*5.93,s*5.93,.01],[Math.cos(a+.024)*6.03,Math.sin(a+.024)*6.03,.01],[Math.cos(a+.024)*6.45,Math.sin(a+.024)*6.45,.01]],j%4===0?thinRed:faintBlue,floorRings);
}
beaconBank(Array.from({length:100},(_,i)=>{const a=i/100*TAU,r=i%3===0?6.35:4.8;return[Math.cos(a)*r,Math.sin(a)*r,.06]}),floorRings,1.05);
const floor=mesh(new T.PlaneGeometry(110,110),new T.MeshBasicMaterial({color:0x020408}),scene,0,-4.62,0);floor.rotation.x=-Math.PI/2;
// AI circuit backplanes in the chamber.
function circuitTexture(){const c=document.createElement('canvas');c.width=512;c.height=512;const x=c.getContext('2d');x.clearRect(0,0,512,512);x.lineWidth=1;for(let i=0;i<75;i++){const yy=rnd()*512,xx=rnd()*420;x.strokeStyle=i%4===0?'#e34154':'#3c7598';x.globalAlpha=.2+rnd()*.6;x.beginPath();x.moveTo(xx,yy);x.lineTo(xx+30,yy);x.lineTo(xx+45,yy+15);x.lineTo(xx+80+rnd()*120,yy+15);x.stroke();x.fillStyle=x.strokeStyle;x.fillRect(xx,yy-1,3,3)}x.font='8px monospace';x.globalAlpha=.6;for(let i=0;i<40;i++){x.fillStyle=i%4===0?'#ef344e':'#5a9ab5';x.fillText(Array.from({length:28},()=>Math.floor(rnd()*16).toString(16)).join(' '),10,18+i*12)}const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t}
const panelMat=new T.MeshBasicMaterial({map:circuitTexture(),transparent:true,opacity:.18,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending});
for(const side of [-1,1])for(let i=0;i<4;i++){const g=new T.Group();g.position.set(side*(8.5+i*1.2),1.7+(i%2)*2,-3-i*4);g.rotation.y=-side*.4;scene.add(g);mesh(new T.PlaneGeometry(4.2,4.8),panelMat,g);box(.035,4.9,.05,panelMetals.edge,g,side*2.16,0,0);box(4.3,.018,.025,i%2?ice:dimRed,g,0,-2.45,0);box(4.3,.01,.025,ice,g,0,2.45,0)}
const rays=new T.Group();scene.add(rays);const rayBlue=new T.LineBasicMaterial({color:0x386383,transparent:true,opacity:.035}),rayRed=new T.LineBasicMaterial({color:0x90212e,transparent:true,opacity:.06});for(let i=0;i<65;i++){const side=i%2?1:-1;const x=side*(6+rnd()*20),y=-3+rnd()*16,z=-8-rnd()*26;stroke([[x,y,z],[x*.4,y*.4,z-25]],i%6===0?rayRed:rayBlue,rays)}
beaconBank(Array.from({length:150},()=>[(rnd()-.5)*36,-3+rnd()*17,-3-rnd()*24]),scene,1.05);
// Segmented chamber ribs and floor conduits frame the emblem in real depth.
for(let i=0;i<7;i++){const g=new T.Group();g.position.set(0,1,-6-i*3);scene.add(g);torus(12+i*.45,.075,black,g);for(let j=0;j<12;j++){const a=j*TAU/12;sector(12+i*.45,.045,a,.17,.05,steel,g)}}
for(let i=0;i<50;i++){const a=i*TAU/50,r=7+rnd()*2;stroke([[Math.cos(a)*r,-4.59,Math.sin(a)*r],[Math.cos(a)*r*1.6,-4.59,Math.sin(a)*r*1.6],[Math.cos(a+.025)*r*2.8,-4.59,Math.sin(a+.025)*r*2.8]],i%9===0?rayRed:rayBlue,scene)}
// Deterministic ember movement, independent of refresh rate.
const count=900,positions=new Float32Array(count*3),bases=new Float32Array(count*3);for(let i=0;i<count;i++){bases[i*3]=(rnd()-.5)*45;bases[i*3+1]=rnd()*19-5;bases[i*3+2]=rnd()*36-20}
const pgeo=new T.BufferGeometry();pgeo.setAttribute('position',new T.BufferAttribute(positions,3));const particles=new T.Points(pgeo,new T.PointsMaterial({color:new T.Color(2,.12,.15),size:.035,transparent:true,opacity:.8,blending:T.AdditiveBlending,depthWrite:false}));scene.add(particles);
function fogTexture(){const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');for(let i=0;i<180;i++){const x=rnd()*256,y=rnd()*256,r=8+rnd()*36;const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(130,149,171,.03)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,256,256)}const tex=new T.CanvasTexture(c);return tex}
const fogMap=fogTexture(),wisps=[];for(let i=0;i<18;i++){const mat=new T.SpriteMaterial({map:fogMap,color:i%3===0?0x658394:0x9c4758,transparent:true,opacity:.19,depthWrite:false,blending:T.AdditiveBlending});const s=new T.Sprite(mat);s.position.set((rnd()-.5)*25,-3.6+rnd()*.3,(rnd()-.5)*12);s.scale.set(8,2.2,1);scene.add(s);wisps.push({s,x:s.position.x})}glowSprite(0x86caff,7,scene,0,9,-5,.18);
cinema=createCinematic({scene,root,neural,stars,crest,plates,word,dais,renderer,camera,controls,chrome,steel,black,letterMetal,rnd});
const powerUp=createPowerUp({chassis,dais,crest,neural,word,subtitle,primaryCore,upperCore,coreLight});
const polish=createFinalPolish({scene,root,crest,plates,wordBacking,primaryCore,renderer,steel,black}),showcase=setupShowcase();
const updateCinematic=cinema.update;cinema.update=(...args)=>{updateCinematic(...args);const reveal=cinema.stats();powerUp.update(reveal);polish.update(args[0],reveal,powerUp.stats().powerStages)};
let animated=!matchMedia('(prefers-reduced-motion: reduce)').matches,elapsed=0,frames=0,previous=performance.now();$('motion').setAttribute('aria-pressed',String(animated));
function update(dt){if(animated)elapsed+=dt;for(const m of beacons){m.uniforms.time.value=elapsed;m.uniforms.resolution.value=innerHeight*renderer.getPixelRatio()}for(const {g,s,axis='z'} of turners)g.rotation[axis]=elapsed*s;for(const p of pulses){const s=p.base*(1+Math.sin(elapsed*2.4)*.065);p.obj.scale.set(s,s,1)}coreLight.intensity=18+Math.sin(elapsed*2.4)*3;for(let i=0;i<count;i++){positions[i*3]=bases[i*3]+Math.sin(elapsed*.12+i)*.13;positions[i*3+1]=((bases[i*3+1]+5+elapsed*(.06+(i%5)*.013))%19)-5;positions[i*3+2]=bases[i*3+2]}pgeo.attributes.position.needsUpdate=true;for(const w of wisps)w.s.position.x=w.x+Math.sin(elapsed*.1+w.x)*.4;cinema.update(elapsed,animated?dt:0,animated);const auto=controls.autoRotate;if(!animated)controls.autoRotate=false;controls.update(dt);controls.autoRotate=auto;if(animated||needsRender){renderScene();needsRender=false;frames++}}
function frame(now){const dt=Math.max(0,Math.min((now-previous)/1000,.06));previous=now;update(dt);requestAnimationFrame(frame)}requestAnimationFrame(frame);
$('home').onclick=reset;renderer.domElement.ondblclick=reset;$('orbit').onclick=()=>{controls.autoRotate=!controls.autoRotate;$('orbit').setAttribute('aria-pressed',String(controls.autoRotate))};$('motion').onclick=()=>{animated=!animated;$('motion').setAttribute('aria-pressed',String(animated))};$('glow').oninput=e=>{bloom.strength=Number(e.target.value)};$('compare').onclick=()=>{const on=$('reference').classList.toggle('show');$('compare').setAttribute('aria-pressed',String(on))};$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{$('message').textContent='Fullscreen is unavailable in this viewer. Open the file in Chrome.'}};
$('stage').addEventListener('keydown',e=>{const spherical=new T.Spherical().setFromVector3(camera.position.clone().sub(controls.target));if(e.key==='ArrowLeft')spherical.theta-=.1;else if(e.key==='ArrowRight')spherical.theta+=.1;else if(e.key==='ArrowUp')spherical.phi=Math.max(.2,spherical.phi-.1);else if(e.key==='ArrowDown')spherical.phi=Math.min(Math.PI*.8,spherical.phi+.1);else if(e.key==='Home'){reset();return}else return;e.preventDefault();camera.position.copy(controls.target).add(new T.Vector3().setFromSpherical(spherical));controls.update()});
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);bloomComposer.setSize(innerWidth,innerHeight)});renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();$('message').textContent='The graphics context was interrupted. Reload to restore the scene.'});
$('replay').onclick=()=>{animated=true;$('motion').setAttribute('aria-pressed','true');cinema.replay()};
const toggleMotion=$('motion').onclick;$('motion').onclick=()=>{toggleMotion();if(!animated){const auto=controls.autoRotate,damping=controls.enableDamping;controls.autoRotate=false;controls.enableDamping=false;controls.update(0);controls.enableDamping=damping;controls.autoRotate=auto}needsRender=true};
$('glow').addEventListener('input',()=>{needsRender=true});addEventListener('resize',()=>{needsRender=true});
window.skynet={scene,camera,controls,renderer,composer,reset,setTime(t){elapsed=t;needsRender=true;update(0)},stats(){let meshes=0,extrusions=0;root.traverse(o=>{if(o.isMesh)meshes++;if(o.geometry?.type==='ExtrudeGeometry')extrusions++});return{version:'2026.09.05.6',...cinema.stats(),...powerUp.stats(),...polish.stats(),...showcase.stats(),beaconCount,beaconTime:beacons[0].uniforms.time.value,meshes,extrusions,frames,elapsed,camera:camera.position.toArray(),distance:camera.position.distanceTo(controls.target),glow:bloom.strength,autoOrbit:controls.autoRotate,animated,drawCalls:renderer.info.render.calls}},ready:true};$('loading').remove();

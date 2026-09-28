import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {zoomFromWheel,fovFromWheel} from '../src/PondCamera.js';
import {varieties} from '../src/KoiCatalog.js';
import {matchingTopics,careTopics} from '../src/KoiCare.js';
const engine=readFileSync(new URL('../src/GardenEngine.js',import.meta.url),'utf8');
const three=readFileSync(new URL('../public/vendor/three.min.js',import.meta.url),'utf8');
const between=(a,b)=>engine.slice(engine.indexOf(a),engine.indexOf(b,engine.indexOf(a)));
function context(){const c=vm.createContext({console:{warn(){}}});vm.runInContext(three,c);return c;}

test('wheel zoom is reversible, device-normalized, bounded and responds in both directions',()=>{
  const close=zoomFromWheel(1,-100);assert.ok(close>1);assert.ok(zoomFromWheel(1,100)<1);
  assert.ok(Math.abs(zoomFromWheel(close,100)-1)<1e-12);
  assert.equal(zoomFromWheel(1,3,1),zoomFromWheel(1,48,0));
  assert.equal(zoomFromWheel(1,.1,2,800),zoomFromWheel(1,80,0));
  let z=1;for(let i=0;i<100;i++)z=zoomFromWheel(z,-1000);assert.equal(z,4);
  for(let i=0;i<100;i++)z=zoomFromWheel(z,1000);assert.equal(z,.65);
  assert.equal(zoomFromWheel(1,NaN),1);
  const near=fovFromWheel(52,-100);assert.ok(near<52);
  assert.ok(Math.abs(fovFromWheel(near,100)-52)<1e-10);
});

test('Garden starts at its final pose and remains stationary through actual free camera updates',()=>{
  const c=context();vm.runInContext(`
    const P={cameraMode:'Cinematic'},GUI_CTRL={},CTRL={keys:{}},FOLLOW={},document={querySelectorAll:()=>[]};
    const camera=new THREE.PerspectiveCamera(52,1,.02,260),_pm=new THREE.Matrix4(),_up=new THREE.Vector3(0,1,0),_fwd=new THREE.Vector3(),_right=new THREE.Vector3();
    function toast(){} function onCameraMode(){}
  `+between('const VIEWS =','function updateCamera')+between('function updateFreeCamera','function onCameraMode')+`
    goToView('Garden',true);const before=JSON.stringify([camera.position,camera.quaternion]);
    for(let i=0;i<600;i++)updateFreeCamera(1/60);
    globalThis.result={before,after:JSON.stringify([camera.position,camera.quaternion]),mode:P.cameraMode,tween:TWEEN.t,position:camera.position.toArray()};
  `,c);
  assert.equal(c.result.mode,'Manual');assert.equal(c.result.tween,1);
  const [p0,q0]=JSON.parse(c.result.before),[p1,q1]=JSON.parse(c.result.after);
  assert.deepEqual(p0,p1);assert.ok(q0.every((v,i)=>Math.abs(v-q1[i])<1e-12));
  assert.deepEqual(Array.from(c.result.position),[4.9,9.4,11.7]);
});

test('actual feeding works without a hand, does not move camera, pauses, floats food, and cleans up',()=>{
  const c=context();vm.runInContext(`
    const P={fishCount:0,cameraMode:'Manual',holdCamera:true},CTRL={},PATH={},STROKE={active:false},KOI={fish:[]};
    const camera=new THREE.PerspectiveCamera();camera.position.set(4.9,9.4,11.7);camera.lookAt(-.3,0,-1.5);
    const WATER_Y=0,FEED={hand:null,pelletMesh:{count:0,instanceMatrix:{},setMatrixAt(){}},point:new THREE.Vector3(),pellets:[],excite:0};
    const _hp=new THREE.Vector3(),_hq=new THREE.Quaternion(),_hm=new THREE.Matrix4(),_sk=new THREE.Vector3();
    const button={disabled:false},$=()=>button,rand=()=>.43,rr=(a,b)=>a+(b-a)*rand(),lerp=(a,b,t)=>a+(b-a)*t,sdf=()=>-2;
    function toast(){} function addDrop(){} function spawnSplash(){} function updateSplashes(){} function waterHeightAt(){return 0;}
  `+between('function startFeeding()','/* ------------------------------------------------------------------ 13f.')+between('function endFeeding()','/* ------------------------------------------------------------------ 13d.')+`
    globalThis.sim={FEED,P,camera,button,startFeeding,updateFeeding};
  `,c);
  const {sim:s}=c,before=JSON.stringify([s.camera.position,s.camera.quaternion]);
  s.startFeeding();assert.equal(s.FEED.active,true);assert.equal(s.FEED.hand,null);assert.equal(s.FEED.shot,null);
  for(let i=1;i<=180;i++)s.updateFeeding(1/60,i/60);
  assert.equal(s.FEED.emitted,42);assert.equal(s.FEED.pelletMesh.count,42);assert.ok(s.FEED.pellets.every(p=>p.fl));
  const paused=JSON.stringify(s.FEED);s.updateFeeding(0,99);assert.equal(JSON.stringify(s.FEED),paused);
  s.startFeeding();assert.equal(s.FEED.emitted,42,'repeated activation does not restart an active feed');
  for(let i=181;i<3000;i++)s.updateFeeding(1/60,i/60);
  assert.equal(s.FEED.active,false);assert.equal(s.FEED.pellets.length,0);assert.equal(s.FEED.pelletMesh.count,0);assert.equal(s.button.disabled,false);
  assert.equal(JSON.stringify([s.camera.position,s.camera.quaternion]),before);assert.equal(s.P.holdCamera,true);
});

test('all actual fish have distinct names and care search reaches useful topics',()=>{
  assert.equal(varieties.length,20);assert.equal(new Set(varieties.map(v=>v.nickname)).size,20);
  assert.ok(varieties.every(v=>v.id&&v.name&&v.colors));
  assert.equal(careTopics.length,16);assert.ok(matchingTopics('winter').includes('season'));
  assert.ok(matchingTopics('ammonia','Water').includes('cycle'));
  assert.ok(matchingTopics('quarantine','Health').includes('quarantine'));
  assert.equal(matchingTopics('gobbledygook').length,0);
});

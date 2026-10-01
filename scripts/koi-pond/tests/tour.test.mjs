import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {makePondTour} from '../src/PondTour.js';
const engine=readFileSync(new URL('../src/GardenEngine.js',import.meta.url),'utf8');
const three=readFileSync(new URL('../public/vendor/three.min.js',import.meta.url),'utf8');
const between=(a,b)=>engine.slice(engine.indexOf(a),engine.indexOf(b,engine.indexOf(a)));
function basin(){
  const c=vm.createContext({console:{warn(){}}});vm.runInContext(three,c);
  vm.runInContext(between('function mulberry32','/* ------------------------------------------------------------------ 2.')+
    between('const POND_CTRL','function groundHeight')+`
    globalThis.geometry={THREE,sdf:sdfExact,depth:pondDepth};`,c);
  return {...c.geometry,c};
}
function scene(){
  const g=basin(),fish=Array.from({length:20},(_,i)=>({size:.55+.02*i,heading:i*.31,
    p:new g.THREE.Vector3(Math.cos(i*.31)*1.4,-.3-(i%4)*.12,1+Math.sin(i*.31)*1.8)}));
  const obstacles=[{x:1.45,z:1.75,r:.5},{x:1.7,z:2,r:.3}];
  const shots=makePondTour({...g,getFish:()=>fish,getObstacles:()=>obstacles});
  return {...g,fish,shots,obstacles};
}
test('every tour composition targets the pond and offers varied safe above/below-water angles',()=>{
  const {shots,sdf,depth,obstacles}=scene(),above=[],below=[];
  for(const sh of shots){
    if(sh.skip?.())continue;
    sh.start?.();
    for(let i=0;i<=100;i++){
      const {pos,look}=sh.frame(i/100,1/60);
      assert.ok([...pos.toArray(),...look.toArray()].every(Number.isFinite));
      assert.ok(sdf(look.x,look.z)<-.05,`${sh.cap} centers on water, not land`);
      assert.ok(pos.distanceTo(look)>.3,'camera avoids clipping its subject');
      if(pos.y<.65) for(const o of obstacles) assert.ok(Math.hypot(pos.x-o.x,pos.z-o.z)>=o.r+.21,'low camera clears the turtle rocks');
      if(sh.under){
        assert.ok(sdf(pos.x,pos.z)<=-.49,'underwater camera clears the bank');
        assert.ok(pos.y<=-.179,'underwater shot stays submerged');
        assert.ok(pos.y>=-depth(pos.x,pos.z,-sdf(pos.x,pos.z))+.179,'camera clears the gravel');
      }else assert.ok(pos.y>=.12,'above-water shots stay above the surface');
    }
    (sh.under?below:above).push(sh.frame(.5).pos);
  }
  assert.ok(below.length>=3);assert.ok(above.length>=6);
  assert.ok(above.some(p=>p.y>4)&&above.some(p=>p.y<.7),'overhead and water-level perspectives');
  assert.ok(above.some(p=>p.x<-1)&&above.some(p=>p.x>1),'opposite viewing directions');
});
test('koi close-ups follow moving fish smoothly, alternate individuals and handle no fish',()=>{
  const {shots,fish,sdf,depth}=scene(),tracking=shots.filter(sh=>sh.kind==='koi');
  for(const sh of tracking){
    const selected=new Set();
    for(let pass=0;pass<3;pass++){
      sh.start();selected.add(sh.frame(0).look.toArray().join(','));
    }
    assert.ok(selected.size>1,'successive close-ups select different koi');
    sh.start();let previous=sh.frame(0).pos,first=previous.clone();
    for(let i=1;i<=600;i++){
      for(const [j,f]of fish.entries()){
        const a=j*.31+i/60*.09;f.p.set(Math.cos(a)*1.4,-.38+.08*Math.sin(a),1+Math.sin(a)*1.8);
        f.heading=Math.atan2(Math.sin(a+Math.PI),Math.cos(a+Math.PI));
      }
      const {pos}=sh.frame(i/600,1/60);
      assert.ok(pos.distanceTo(previous)<.1,'no heading-wrap jumps or rapid camera snaps');
      if(sh.under){assert.ok(sdf(pos.x,pos.z)<-.49);assert.ok(pos.y>=-depth(pos.x,pos.z,-sdf(pos.x,pos.z))+.179);}
      previous=pos;
    }
    assert.ok(previous.distanceTo(first)>.1,'camera follows fish movement');
    const saved=fish.splice(0);assert.equal(sh.skip(),true);
    assert.ok(sh.frame(.5).pos.toArray().every(Number.isFinite),'empty pond has a finite fallback');
    fish.push(...saved);
  }
});
test('actual tour playback loops, skips underwater for ice/above-only, and resumes full tour',()=>{
  const {c,THREE,sdf,depth}=basin();
  Object.assign(c,{makePondTour,sdf,pondDepth:depth,THREE});
  vm.runInContext(`
    const P={fishCount:2,pathSpeed:1,stayAbove:false,tourSeasons:false},WATER_Y=0;
    const KOI={fish:[{p:new THREE.Vector3(0,-.4,1),heading:0,size:.7},{p:new THREE.Vector3(1,-.5,2),heading:1,size:.6}]};
    const TURTLE={root:null},FROG={root:null},WORLD={obstacles:[]},SH={uIce:{value:0}},camera=new THREE.PerspectiveCamera(),caption={textContent:'',style:{}};
    const document={getElementById:()=>caption};function ground(){return .2;}function cycleWeather(){}

  `+between('const MOVIE =','function updateCinematic')+`
    globalThis.playback={MOVIE,P,SH,camera,caption,updateMovie};`,c);
  const p=c.playback;
  for(const mode of ['full','above','ice','full']){
    p.P.stayAbove=mode==='above';p.SH.uIce.value=mode==='ice'?1:0;
    p.MOVIE.i=0;p.MOVIE.t=0;p.MOVIE.started=null;
    let hasUnder=false,loops=0;
    for(let i=0;i<1800;i++){
      const before=p.MOVIE.i;p.updateMovie(.2,i*.2);
      hasUnder ||= p.camera.position.y<0;
      assert.ok(p.camera.position.toArray().every(Number.isFinite));
      if(before>0&&p.MOVIE.i===0)loops++;
    }
    assert.ok(loops>=2,'tour continues through multiple loops');
    assert.equal(hasUnder,mode==='full');
  }
});
test('Take a tour restores the pond film and restarts its camera after settings changes',()=>{
  const {c}=basin();vm.runInContext(`
    const button={dataset:{view:'Tour'},setAttribute(){}},elements=new Map();
    function $(id){if(!elements.has(id))elements.set(id,{style:{},setAttribute(){}});return elements.get(id);}
    const document={querySelectorAll:()=>[button],querySelector:()=>({style:{display:'none'}})};
    const P={movie:false},GUI_CTRL={movie:{updateDisplay(){}}},TWEEN={},FOLLOW={},FEED={},MOVIE={i:5,t:9,started:{}};
    const camera=new THREE.PerspectiveCamera(14);let opened=0,held=0;
    function installGuide(){return {close(){opened++;}};}function setHold(){held++;}function startFeeding(){}
    function onCameraMode(){}function goToView(){}function setFreeze(){}function updateMovie(){}
  `+between('function startPondTour(', 'function updateMovie')+between('function installHiddenReef()','\ninit();')+`
    installHiddenReef();button.onclick();globalThis.result={P,MOVIE,TWEEN,camera,opened,held};`,c);
  const r=c.result;assert.equal(r.P.movie,true);assert.equal(r.P.cameraMode,'Cinematic');
  assert.equal(r.MOVIE.i,0);assert.equal(r.MOVIE.t,0);assert.equal(r.MOVIE.started,null);
  assert.equal(r.camera.fov,52);assert.equal(r.TWEEN.t,1);assert.equal(r.opened,1);assert.equal(r.held,1);
});

test('one turtle and one frog portrait follow their animation poses and skip hidden animals',()=>{
  const g=basin();
  let turtle={p:new g.THREE.Vector3(1.45,.15,1.75),heading:.4};
  let frog={p:new g.THREE.Vector3(-1.05,.015,3.85),heading:1};
  const shots=makePondTour({...g,getFish:()=>[],getTurtle:()=>turtle,getFrog:()=>frog});
  for(const kind of ['turtle','frog']){
    const selected=shots.filter(sh=>sh.kind===kind);assert.equal(selected.length,1);
    const sh=selected[0],animal=kind==='turtle'?turtle:frog;
    assert.equal(sh.skip(),false);sh.start();const first=sh.frame(.5);
    assert.ok(first.look.distanceTo(animal.p)<.04,'portrait centers the current animal');
    assert.ok(first.pos.distanceTo(first.look)>.2,'portrait leaves space for the body');
    const phone=makePondTour({...g,getFish:()=>[],getTurtle:()=>turtle,getFrog:()=>frog,getAspect:()=>.42}).find(s=>s.kind===kind);
    phone.start();const phoneFrame=phone.frame(.5);
    assert.ok(phoneFrame.pos.distanceTo(phoneFrame.look)>first.pos.distanceTo(first.look)*1.9,'narrow screens leave more room for the animal');
    animal.p.x+=.25;animal.p.z+=.12;
    let last;
    for(let i=1;i<=180;i++){
      last=sh.frame(.5,1/60);
      assert.ok(last.pos.y>=.14,'portrait stays above the water');
      assert.ok([...last.pos.toArray(),...last.look.toArray()].every(Number.isFinite));
    }
    assert.ok(last.look.distanceTo(animal.p)<.04,'camera follows a moving animal');
    assert.ok(last.pos.distanceTo(first.pos)>.27,'camera follows the subject position, independent of its orbit');
    animal.heading+=.3;const turned=sh.frame(.5,.1);
    assert.ok(turned.pos.distanceTo(last.pos)>.01,'portrait turns gradually with its subject');
    if(kind==='turtle')turtle=null;else frog=null;
    assert.equal(sh.skip(),true,'hidden winter animals get no empty close-up');
  }
});

test('actual default startup opens an unpaused moving tour, with Garden still available',()=>{
  for(const reduced of [false,true]){
    const {c,THREE,sdf,depth}=basin();Object.assign(c,{makePondTour,THREE,sdf,pondDepth:depth});
    vm.runInContext(`
      const P={fishCount:2,pathSpeed:1,cameraMode:'Manual',freezeScene:true},WATER_Y=0;
      const KOI={fish:[{p:new THREE.Vector3(0,-.4,1),heading:0,size:.7},{p:new THREE.Vector3(1,-.5,2),heading:1,size:.6}]};
      const WORLD={obstacles:[]},TURTLE={root:null},FROG={root:null},SH={uIce:{value:0}};
      const camera=new THREE.PerspectiveCamera(14),TWEEN={t:0},PATH={blend:1},GUI_CTRL={},CTRL={},FOLLOW={},FEED={};
      const elements=new Map(),messages=[],buttons=['Garden','Pond','Underwater','Tour'].map(view=>({dataset:{view},attributes:{},setAttribute(k,v){this.attributes[k]=v;}}));
      function $(id){if(!elements.has(id))elements.set(id,{hidden:false,style:{},attributes:{},label:{textContent:''},setAttribute(k,v){this.attributes[k]=v;},querySelector(){return this.label;}});return elements.get(id);}
      const document={body:{dataset:{}},getElementById:$,querySelectorAll:()=>buttons,querySelector:()=>({style:{display:'none'}})};
      const matchMedia=()=>({matches:${reduced}});
      function toast(value){messages.push(value);}function ground(){return .2;}function cycleWeather(){}
      function installGuide(){return {close(){}};}function setHold(){}function startFeeding(){}
      function goToView(name){P.cameraMode='Manual';}
    `+between('function setFreeze(', '// sound:')+
      between('function onCameraMode(', '/* ------------------------------------------------------------------ 13b.')+
      between('const MOVIE =','function updateCinematic')+
      between('function installHiddenReef()','\ninit();')+`
      installHiddenReef();const initial=camera.position.clone();
      for(let i=0;i<120;i++)updateMovie(1/60,i/60);
      globalThis.result={P,TWEEN,initial,camera,buttons,messages,MOVIE,document};
    `,c);
    const r=c.result;
    assert.equal(r.P.freezeScene,false);assert.equal(r.document.body.dataset.pondMotion,'running');
    assert.equal(r.P.movie,true);assert.equal(r.P.cameraMode,'Cinematic');assert.equal(r.TWEEN.t,1);
    assert.equal(r.buttons.find(b=>b.dataset.view==='Tour').attributes['aria-pressed'],'true');
    assert.deepEqual(Array.from(r.initial.toArray()),[2.6,5.4,6]);
    assert.ok(r.camera.position.distanceTo(r.initial)>.2,'camera moves automatically after startup');
    assert.equal(r.messages.length,0,'no startup toast or pause');
    assert.equal(r.MOVIE.shots.filter(s=>s.kind==='turtle').length,1);
    assert.equal(r.MOVIE.shots.filter(s=>s.kind==='frog').length,1);
  }
});

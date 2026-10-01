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
  const {shots,fish,sdf,depth}=scene(),tracking=shots.filter(sh=>sh.start);
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
    const WORLD={obstacles:[]},SH={uIce:{value:0}},camera=new THREE.PerspectiveCamera(),caption={textContent:'',style:{}};
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
    function onCameraMode(){}function goToView(){}function setFreeze(){}
  `+between('function installHiddenReef()','\ninit();')+`
    installHiddenReef();button.onclick();globalThis.result={P,MOVIE,TWEEN,camera,opened,held};`,c);
  const r=c.result;assert.equal(r.P.movie,true);assert.equal(r.P.cameraMode,'Cinematic');
  assert.equal(r.MOVIE.i,0);assert.equal(r.MOVIE.t,0);assert.equal(r.MOVIE.started,null);
  assert.equal(r.camera.fov,52);assert.equal(r.TWEEN.t,1);assert.equal(r.opened,1);assert.equal(r.held,1);
});

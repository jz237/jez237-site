import test from 'node:test';import assert from 'node:assert/strict';
import {foamLifeStep} from '../foam-life.js';
import {contactProfile} from '../hull-contact.js';
import {gustAt,gustHeight} from '../wind-gusts.js';
import {createLocalWater,moveLocalWater,disturbLocalWater,stepLocalWater,sampleLocalWater,setLocalWater,driveLocalWater} from '../local-water.js';
import * as T from '../vendor/three.module.js';import {makeCraftBeads} from '../water-beads.js';import {cloudMaterial} from '../weather-light.js';
import {stepBeads} from '../bead-motion.js';
import {createRecorder,recordMoment,replayClip,replaySample,shorelineCamera} from '../instant-replay.js';
import {createRace,stepRace,aiInput} from '../race-core.js';
test('fresh whitewater transfers into bubbles then clears, independent of frame rate',()=>{
 const run=dt=>{let f=1,b=0;for(let t=0;t<4-dt/2;t+=dt)([f,b]=foamLifeStep(f,b,0,dt));return {f,b};};const a=run(1/60),b=run(.1);assert.ok(a.b>a.f*10);assert.ok(Math.abs(a.b-b.b)<1e-8);let f=1,bu=0;for(let i=0;i<1200;i++)([f,bu]=foamLifeStep(f,bu,0,1/60));assert.ok(f+bu<.007);assert.deepEqual(foamLifeStep(.8,.2,10,0),[.8,.2]);
});
test('contact builds water at the bow and loaded chine, with a hollow aft',()=>{assert.ok(contactProfile(1.25,0,1)>0);assert.ok(contactProfile(-2.15,0,1)<0);assert.ok(contactProfile(0,-.72,1,1)>contactProfile(0,.72,1,1));assert.equal(contactProfile(0,0,0,1),0);});
test('gusts travel coherently and include calm gaps',()=>{let hi=0,lo=1;for(let x=-1000;x<1000;x+=5){const g=gustAt(x,0,0,.5);hi=Math.max(hi,g.strength);lo=Math.min(lo,g.strength);assert.ok(Number.isFinite(gustHeight(x,0,0,.5)));}assert.ok(hi>.65&&lo<.001);const a=gustAt(20,30,0,.5),b=gustAt(20+6/.86,30,1,.5);assert.ok(Math.abs(a.strength-b.strength)<.01);});
test('local pulses propagate, combine linearly and reflect from a solid wall',()=>{
 const make=solid=>{const f=createLocalWater(solid,{size:64,cell:.5});moveLocalWater(f,0,0);return f;},open=make(()=>false),wall=make(x=>x>=3),double=make(()=>false);
 for(const f of [open,wall,double])disturbLocalWater(f,0,0,.7,.65);disturbLocalWater(double,0,0,.7,.65);
 let reflected=0;for(let i=0;i<160;i++){for(const f of [open,wall,double])stepLocalWater(f,1/60);if(i>70)reflected=Math.max(reflected,Math.abs(sampleLocalWater(wall,1,0)-sampleLocalWater(open,1,0)));}
 assert.ok(reflected>.003);assert.equal(sampleLocalWater(wall,4,0),0);assert.ok(open.energy>0);assert.ok(Math.abs(sampleLocalWater(double,-2,0)-sampleLocalWater(open,-2,0)*2)<1e-6);
 for(let i=0;i<1800;i++)stepLocalWater(open,1/60);assert.ok(open.energy<1e-7);
});
test('local water preserves world coordinates when its patch moves, and freezes at dt zero',()=>{
 const f=createLocalWater(()=>false);moveLocalWater(f,0,0);disturbLocalWater(f,1,2,1);stepLocalWater(f,.1);const a=sampleLocalWater(f,1.2,2.3),h=f.h.slice();stepLocalWater(f,0);assert.deepEqual(f.h,h);moveLocalWater(f,3,-1.5);assert.ok(Math.abs(sampleLocalWater(f,1.2,2.3)-a)<1e-7);moveLocalWater(f,1000,1000);assert.equal(sampleLocalWater(f,1,2),0);assert.equal(f.h.reduce((s,x)=>s+Math.abs(x),0),0);
});
test('beads persist after a splash, drain with speed, re-wet, and stop while paused',()=>{
 const r={speed:0,hydro:{wet:0,impact:7,landingId:1}},a={};stepBeads(a,r,0,.1);assert.ok(a.wet>.99);const b={...a};for(let i=0;i<100;i++){stepBeads(a,r,0,.1);stepBeads(b,{...r,speed:30},0,.1);}assert.ok(b.wet<a.wet&&b.flow>a.flow);const copy={...b};stepBeads(b,r,1,0);assert.deepEqual(b,copy);stepBeads(b,{...r,hydro:{...r.hydro,landingId:2}},0,.1);assert.ok(b.wet>.99);
});
test('replay storage stays bounded, samples do not mutate recordings or the live race',()=>{
 const s=createRace({mode:'race'}),rec=createRecorder(),water={wake:[],impacts:[],craft:[],level:0};
 for(let i=0;i<900;i++){stepRace(s,aiInput(s,s.racers[0]),1/60);recordMoment(rec,s,water);}
 assert.ok(rec.frames.length<=201&&rec.frames.length>=100);const clip=replayClip(rec),before=structuredClone(s.racers),time=s.time,local=s.localWater.h.slice(),saved=structuredClone(clip.frames[0].racers);
 for(let t=clip.start;t<clip.end;t+=.016){const f=replaySample(clip,t);f.racers[0].x=10000;}
 assert.deepEqual(s.racers,before);assert.equal(s.time,time);assert.deepEqual(s.localWater.h,local);assert.deepEqual(clip.frames[0].racers,saved);assert.ok(Number.isFinite(shorelineCamera(clip,s.course.ground).y));setLocalWater(null);
});
test('replay detects an actual jump landing and leaves time for its spreading wake',()=>{
 const rec=createRecorder(),s={phase:'running',time:0,racers:[{x:0,z:0,heading:0,speed:20,hydro:{airborne:false,y:0,waterHeight:0},stunt:{}}]};
 for(let i=0;i<140;i++){s.time=i/20;s.racers[0].z=s.time*20;s.racers[0].hydro.airborne=i>=50&&i<70;s.racers[0].hydro.y=i>=50&&i<70?2:0;recordMoment(rec,s,{});}
 const clip=replayClip(rec);assert.equal(clip.label,'Wave jump');assert.ok(clip.start<3.5&&clip.end>4.5);
 const view=shorelineCamera(clip,()=>0,p=>p.x<0);assert.ok(view.x>0);assert.equal(view.blocked,0);
});
test('same-rider split-screen craft emit exactly the same water as distinct rider identities',()=>{
 const run=ids=>{const f=createLocalWater(()=>false),racers=ids.map((id,i)=>({id,x:i*5,z:0,heading:0,speed:12,hydro:{wet:1,impact:7,landingId:i?0:1}}));for(let i=0;i<120;i++)driveLocalWater(f,racers,1/60);return f;};const a=run([0,0]),b=run([0,1]);assert.ok(a.energy>0);assert.deepEqual(a.h,b.h);
});
test('wet finish uniforms belong to each craft and cloud lighting is patched only once',()=>{
 const mat=new T.MeshPhysicalMaterial({color:0xffffff,roughness:.3});mat.name='Pearl ceramic';cloudMaterial(mat);const roots=[new T.Group(),new T.Group()],geo=new T.BoxGeometry();roots.forEach(root=>root.add(new T.Mesh(geo,mat)));const beads=roots.map(makeCraftBeads),r={speed:0,hydro:{impact:7,landingId:1,wet:0}};beads[0].update(r,0,.1);beads[1].update({...r,hydro:{...r.hydro,landingId:0}},0,.1);
 const shaders=roots.map(root=>{const m=root.children[0].material;cloudMaterial(m);const shader={uniforms:{},vertexShader:T.ShaderLib.physical.vertexShader,fragmentShader:T.ShaderLib.physical.fragmentShader};m.onBeforeCompile(shader);return shader;});
 assert.notEqual(roots[0].children[0].material,roots[1].children[0].material);assert.notEqual(shaders[0].uniforms.beadWet,shaders[1].uniforms.beadWet);assert.ok(shaders[0].uniforms.beadWet.value>.9);assert.equal(shaders[1].uniforms.beadWet.value,0);for(const s of shaders)assert.equal(s.vertexShader.match(/varying vec3 cloudWorld;/g).length,1);geo.dispose();mat.dispose();roots.forEach(root=>root.children[0].material.dispose());
});

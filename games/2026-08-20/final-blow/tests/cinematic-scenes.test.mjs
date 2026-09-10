import test from 'node:test';
import assert from 'node:assert/strict';
import {CINEMATIC_FIGHTERS,cinematicScene,sampleCinematicScene,knockoutFrame,createKnockoutScene,sampleKnockoutScene,cinematicPortraitOpacity,paintedFatalityScript,paintedFatalityFrame} from '../engine/cinematic-scenes.mjs';
import {FINISHER_CHOREOGRAPHY,sampleFinisher} from '../engine/finisher-scripts.mjs';
import {cinematicContactParticles,cinematicDiscFlight,cinematicBassPulse,cinematicFeedbackPulse,cinematicSwarm,cinematicGroundWave,cinematicTeeBall,postWireGrip,postWireHeight,releasedPostWire,cinematicFoleyBetween,cinematicFatalityProfile} from '../engine/cinematic-scenes.mjs';
import {getGraphicFatality} from '../engine/fatalities.mjs';

test('painted fatality labels describe authored actions without stale severing claims',()=>{
 const bass=cinematicFatalityProfile('ali',1);
 for(const key of ['title','caption','special','projectileSetup','projectileAction','projectileFinale','device']) {
  assert.doesNotMatch(bass[key],/vinyl|disc|sever/i);
 }
 assert.equal(bass.id,'bass-drop');assert.equal(bass.special,'BOOMBOX');
 assert.equal(bass.limb,'torso');
 for(const id of CINEMATIC_FIGHTERS)for(const variant of [0,1]) {
  const profile=cinematicFatalityProfile(id,variant);
  for(const field of ['title','caption','projectileSetup','projectileAction','projectileFinale','device'])assert.doesNotMatch(profile[field],/sever|amputat|decapitat/i,`${id}:${variant} ${field}`);
 }
 assert.equal(getGraphicFatality('ali',1).id,'west-staines-massive','archived profile is not mutated');
});

test('wire grip releases with open hands and attachment descends continuously through impact',()=>{
 const script=paintedFatalityScript('post',0,FINISHER_CHOREOGRAPHY.post);
 assert.equal(paintedFatalityFrame(script,2.5),10);
 assert.equal(postWireGrip(10),null);assert.ok(postWireGrip(9));
 assert.equal(postWireHeight(1.8),.78);
 assert.ok(Math.abs(postWireHeight(2.5)-.6)<1e-9);
 assert.ok(Math.abs(postWireHeight(2.151)-postWireHeight(2.149))<.001);
 let previous=.78;
 for(let t=1.8;t<2.6;t+=.01){const height=postWireHeight(t);assert.ok(height<=previous+1e-9);previous=height;}
});

test('tee shot releases on club contact before the ball reaches the victim',()=>{
 const script=paintedFatalityScript('donald',0,FINISHER_CHOREOGRAPHY.donald);
 assert.equal(cinematicTeeBall(.4),null);
 assert.equal(cinematicTeeBall(1.89).travel,0);
 assert.equal(paintedFatalityFrame(script,1.9),8);
 assert.equal(cinematicTeeBall(script.impacts[0].t).travel,1);
 assert.equal(cinematicTeeBall(2.34),null);
 assert.equal(script.foleyCues[1].t,1.9);
 assert.equal(script.impacts[0].t,2.12);
 assert.equal(cinematicScene('donald','fatality',0).title,'TEE SHOT');
});

test('Devil stamp shows its repaired descending leg before grounded impact',()=>{
 const script=paintedFatalityScript('devil',1,FINISHER_CHOREOGRAPHY.devil);
 assert.equal(paintedFatalityFrame(script,1.8),7);
 assert.equal(paintedFatalityFrame(script,1.9),8);
 assert.equal(script.foleyCues.find(c=>c.kind==='object-brick').t,1.9);
 assert.equal(script.impacts[0].t,2.08);
 assert.equal(cinematicGroundWave(script.impacts[0].t).travel,1);
 assert.equal(script.groundOrigin,-245);assert.equal(script.groundEmbers,true);
 assert.equal(script.victimBank,'cinema-overhead-ko');
 assert.equal(cinematicScene('devil','fatality',1).title,'HOOF STAMP');
 assert.deepEqual(script.paintedFrames.map(p=>p.frame),Array.from({length:16},(_,i)=>i));
});

test('wheel pass contacts on the lower rising frame before overhead follow-through',()=>{
 const script=paintedFatalityScript('deathblow',0,FINISHER_CHOREOGRAPHY.deathblow);
 assert.equal(script.impacts[0].t,1.72);
 assert.equal(paintedFatalityFrame(script,script.impacts[0].t),6);
 assert.equal(paintedFatalityFrame(script,1.9),7);
 assert.equal(script.keys.find(k=>k.contact).ax,-265);
 assert.ok(script.foleyCues[0].t<script.impacts[0].t);
});

test('authored foley triggers at crossed timestamps without repeating on pause or reverse seek',()=>{
 const script=paintedFatalityScript('deathblow',1,FINISHER_CHOREOGRAPHY.deathblow);
 assert.deepEqual(cinematicFoleyBetween(script,1.899,1.9),[{t:1.9,kind:'object-brick'}]);
 assert.deepEqual(cinematicFoleyBetween(script,1.9,1.9),[]);
 assert.deepEqual(cinematicFoleyBetween(script,2,1.9),[]);
 assert.deepEqual(cinematicFoleyBetween(script,1.9,2),[]);
 assert.equal(cinematicFoleyBetween(script,1.7,2).length,2);
 assert.deepEqual(cinematicFoleyBetween({},0,3),[]);
});

test('ground strike lands before its traveling faultline reaches the victim',()=>{
 const script=paintedFatalityScript('deathblow',1,FINISHER_CHOREOGRAPHY.deathblow);
 assert.equal(paintedFatalityFrame(script,1.9),8);
 assert.equal(cinematicGroundWave(1.899),null);
 assert.equal(cinematicGroundWave(1.9).travel,0);
 assert.equal(cinematicGroundWave(script.impacts[0].t).travel,1);
 assert.equal(cinematicGroundWave(2.65),null);
 assert.equal(script.intactImpact,true);
 assert.equal(cinematicScene('deathblow','fatality',1).title,'GROUND DRIVE');
});

test('swarm release arrives on the authored gesture and settles without persistent particles',()=>{
 const script=paintedFatalityScript('cyraxx',0,FINISHER_CHOREOGRAPHY.cyraxx);
 const impact=script.impacts[0].t;
 assert.equal(cinematicScene('cyraxx','fatality',0).title,'SWARM RISE');
 assert.equal(cinematicPortraitOpacity(1.05-script.portraitAt),0,'portrait clears before insects gather');
 assert.equal(paintedFatalityFrame(script,impact),8);
 assert.equal(script.victimBank,'cinema-overhead-ko');
 assert.deepEqual(cinematicSwarm(1),[]);assert.deepEqual(cinematicSwarm(3.3),[]);
 const atImpact=cinematicSwarm(impact);
 assert.ok(atImpact.every(b=>b.progress===1&&b.settle===0));
 assert.ok(cinematicSwarm(2.6).every(b=>b.settle>0&&b.alpha<1));
 assert.ok(cinematicSwarm(impact,true).length<atImpact.length);
 assert.deepEqual(cinematicSwarm(impact),atImpact);
});

test('feedback wave reaches the victim on impact and expires without wall-clock state',()=>{
 assert.equal(cinematicFeedbackPulse(1.939),null);
 assert.equal(cinematicFeedbackPulse(2.34),null);
 assert.equal(cinematicFeedbackPulse(1.94).travel,0);
 assert.equal(cinematicFeedbackPulse(2.1).travel,1);
 const impact=cinematicFeedbackPulse(2.1);
 cinematicFeedbackPulse(2.3);
 assert.deepEqual(cinematicFeedbackPulse(2.1),impact);
 assert.ok(cinematicFeedbackPulse(2.1,true).alpha<impact.alpha);
});

test('Cyraxx feedback names the intact pressure reaction and contacts on release',()=>{
 const original={...getGraphicFatality('cyraxx',1)};
 const profile=cinematicFatalityProfile('cyraxx',1);
 const script=paintedFatalityScript('cyraxx',1,FINISHER_CHOREOGRAPHY.cyraxx);
 assert.equal(profile.title,'DEAD AIR');assert.equal(profile.limb,'torso');
 assert.equal(profile.projectileFinale,'FEEDBACK RELEASE');
 assert.equal(script.intactImpact,true);assert.equal(script.victimBank,'cinema-body-ko');
 assert.equal(script.impacts.length,1);assert.equal(script.impacts[0].t,2.1);
 assert.equal(paintedFatalityFrame(script,2.099),7);
 assert.equal(paintedFatalityFrame(script,2.1),8);
 assert.equal(paintedFatalityFrame(script,script.duration),15);
 assert.deepEqual(getGraphicFatality('cyraxx',1),original);
});

test('Commissioner overhead contact uses its cane frame before the held fall',()=>{
 const script=paintedFatalityScript('commissioner',1,FINISHER_CHOREOGRAPHY.commissioner);
 const profile=cinematicFatalityProfile('commissioner',1);
 assert.equal(profile.title,'FINAL VERDICT');assert.equal(profile.limb,'head');
 assert.equal(script.intactImpact,true);assert.equal(script.victimBank,'cinema-overhead-ko');
 assert.equal(script.impacts.length,1);
 const impact=script.impacts[0];
 assert.equal(impact.t,2.1);assert.equal(impact.projectilePhase,null);
 assert.equal(paintedFatalityFrame(script,impact.t-.001),7);
 assert.equal(paintedFatalityFrame(script,impact.t),8);
 assert.equal(paintedFatalityFrame(script,2.18),9);
 assert.equal(paintedFatalityFrame(script,script.duration),15);
 assert.ok(script.duration-impact.t>1.65,'reaction settles before scene exit');
 assert.deepEqual(script.paintedFrames.map(k=>k.frame),Array.from({length:16},(_,i)=>i));
 assert.ok(script.keys.every(k=>k.zoom===1&&k.vy===0&&k.vr===0),'painted fall needs no extra body rotation or zoom');
});

test('Ali bass travels from the boombox to the impact and expires on the scene clock',()=>{
 const script=paintedFatalityScript('ali',1,FINISHER_CHOREOGRAPHY.ali);
 const impact=script.impacts[0];
 assert.equal(script.bassPulse,true);assert.equal(script.combo,'BASS DROP');
 assert.equal(impact.audioCue,'vfx-bass');assert.equal(impact.projectilePhase,null);
 assert.equal(cinematicBassPulse(1.719),null);assert.equal(cinematicBassPulse(2.1),null);
 assert.equal(cinematicBassPulse(1.72).x,-180);
 assert.ok(Math.abs(cinematicBassPulse(impact.t).x)<1e-9);
 assert.equal(paintedFatalityFrame(script,impact.t),8);
 let previous=-Infinity;
 for(let t=1.72;t<2.1;t+=1/120){
  const a=cinematicBassPulse(t),b=cinematicBassPulse(t,true);
  assert.ok(a.x>=previous);previous=a.x;
  assert.equal(a.x,b.x);assert.equal(a.y,b.y);
  assert.ok(b.radius<=a.radius&&b.alpha<=a.alpha);
  assert.deepEqual(a,cinematicBassPulse(t),'seeking is deterministic');
 }
});
test('Ali disc exists only between release and catch and crosses at both impacts',()=>{
 const script=paintedFatalityScript('ali',0,FINISHER_CHOREOGRAPHY.ali);
 assert.equal(cinematicDiscFlight(1.249),null);assert.equal(cinematicDiscFlight(2.85),null);
 assert.equal(paintedFatalityFrame(script,1.25),5);assert.equal(paintedFatalityFrame(script,2.85),11);
 for(const impact of script.impacts){assert.equal(cinematicDiscFlight(impact.t).x,0);assert.equal(impact.projectilePhase,null);}
 let previous=cinematicDiscFlight(1.25);
 for(let t=1.25+1/120;t<2.85;t+=1/120){const current=cinematicDiscFlight(t);assert.ok(Math.hypot(current.x-previous.x,current.y-previous.y)<6);previous=current;}
 assert.ok(cinematicDiscFlight(2.05).x>0);
});
test('scene catalog describes ten signature knockouts and twenty fatality beat plans',()=>{
 assert.equal(CINEMATIC_FIGHTERS.length,10);
 for(const id of CINEMATIC_FIGHTERS){
  const first=cinematicScene(id,'fatality',0),second=cinematicScene(id,'fatality',1);
  assert.notEqual(first.title,second.title);assert.notEqual(first.gesture,second.gesture);
  for(const scene of [cinematicScene(id),first,second]){
   for(let i=1;i<scene.beats.length;i++)assert.ok(scene.beats[i].at>scene.beats[i-1].at);
   assert.equal(sampleCinematicScene(scene,scene.impact).shot,'wide');
   assert.equal(sampleCinematicScene(scene,scene.impact-.01).announceVictory,false);
   assert.equal(sampleCinematicScene(scene,scene.duration).victimFrame,15);
   assert.equal(sampleCinematicScene(scene,scene.duration).announceVictory,true);
   for(let t=0;t<scene.duration;t+=1/120)assert.equal(sampleCinematicScene(scene,t).arenaScale,1);
  }
 }
});
test('Post requires a paired body reaction and preserves brace through contact',()=>{
 assert.equal(createKnockoutScene('post',0,350,950),null);
 assert.equal(createKnockoutScene('post',0,350,950,1280,'unknown'),null);
 assert.equal(createKnockoutScene('post',0,350,950,1280,'devil').attackerBank,'cinema-strike-low');
 for(const victim of ['jez','benny','alan','ali','cyraxx','commissioner','deathblow','donald','post','devil'])for(const [a,b] of [[350,950],[950,350]]) {
  const scene=createKnockoutScene('post',0,a,b,1280,victim);
  assert.equal(scene.victimBank,'cinema-body-ko');
  assert.equal(Math.abs(scene.victimTarget-scene.attackerTarget),victim==='devil'?200:['alan','ali','commissioner','deathblow','donald','post','devil'].includes(victim)?150:120);
  assert.equal(scene.hitOffset,['alan','ali','commissioner','deathblow','donald','post','devil'].includes(victim)?70:50);
  assert.equal(sampleKnockoutScene(scene,scene.impact-.001).victimFrame,null);
  assert.equal(sampleKnockoutScene(scene,scene.impact).victimFrame,0);
  assert.equal(sampleKnockoutScene(scene,scene.impact+1.3).victimFrame,15);
 }
});
test('Donald club drive omits the low dip and recovers without extending again',()=>{
 const scene=createKnockoutScene('donald',0,350,950),frames=new Set();
 for(let t=scene.approach;t<scene.impact+.55;t+=1/120)frames.add(sampleKnockoutScene(scene,t).attackerFrame);
 assert.equal(frames.has(2),false);
 assert.deepEqual([...frames],[0,1,3,4,5,6,7,8,10,9,11,12,13,14,15]);
 assert.equal(sampleKnockoutScene(scene,scene.impact).attackerFrame,7);
 assert.equal(sampleKnockoutScene(scene,scene.impact+.55).attackerFrame,15);
});
test('Devil wing sweep opens before contact and folds through all sixteen poses',()=>{
 const scene=createKnockoutScene('devil',0,350,950),frames=new Set();
 for(let t=scene.approach;t<scene.impact+.55;t+=1/120)frames.add(sampleKnockoutScene(scene,t).attackerFrame);
 assert.deepEqual([...frames],Array.from({length:16},(_,i)=>i));
 assert.equal(sampleKnockoutScene(scene,scene.impact).attackerFrame,8);
 assert.equal(sampleKnockoutScene(scene,scene.impact+.55).attackerFrame,15);
 assert.equal(scene.victimTarget-scene.attackerTarget,320);
});
test('Deathblow uppercut uses the complete corrected arc and ends in guard',()=>{
 const scene=createKnockoutScene('deathblow',0,350,950),frames=new Set();
 for(let t=scene.approach;t<scene.impact+.55;t+=1/120)frames.add(sampleKnockoutScene(scene,t).attackerFrame);
 assert.deepEqual([...frames],Array.from({length:16},(_,i)=>i));
 assert.equal(sampleKnockoutScene(scene,scene.impact).attackerFrame,7);
 assert.equal(sampleKnockoutScene(scene,scene.impact+.55).attackerFrame,15);
 assert.equal(scene.victimTarget-scene.attackerTarget,210);
 assert.equal(scene.hitHeight,.85);
});
test('Cyraxx strike omits the premature guard reset and holds contact before recovering',()=>{
 const scene=createKnockoutScene('cyraxx',0,350,950),frames=new Set();
 for(let t=scene.approach;t<scene.impact+.55;t+=1/120)frames.add(sampleKnockoutScene(scene,t).attackerFrame);
 assert.equal(frames.has(4),false);assert.equal(frames.size,12);
 assert.equal(sampleKnockoutScene(scene,scene.impact).attackerFrame,7);
 assert.equal(sampleKnockoutScene(scene,scene.impact+.55).attackerFrame,15);
 assert.equal(scene.victimTarget-scene.attackerTarget,230);
});
test('Commissioner cane excludes the incomplete tip and contacts at upper guard height',()=>{
 const scene=createKnockoutScene('commissioner',0,350,950),frames=new Set();
 for(let t=scene.approach;t<scene.impact+.55;t+=1/120)frames.add(sampleKnockoutScene(scene,t).attackerFrame);
 assert.equal(frames.has(7),false);assert.equal(frames.size,14);
 assert.equal(scene.objectCue,'object-cane');assert.equal(scene.hitHeight,.75);
 assert.equal(sampleKnockoutScene(scene,scene.impact).attackerFrame,8);
 assert.equal(sampleKnockoutScene(scene,scene.impact+.55).attackerFrame,15);
});
test('Ali kick uses all sixteen poses and distinct kick audio at its contact clock',()=>{
 for(const direction of [1,-1]) {
  const scene=createKnockoutScene('ali',0,direction===1?350:950,direction===1?950:350);
  assert.equal(Math.abs(scene.attackerTarget-scene.victimTarget),220);
  assert.equal(scene.swingCue,'roundhouse-swing');assert.equal(scene.impactCue,'roundhouse-impact');
  const frames=new Set();
  for(let t=scene.approach;t<scene.impact+.55;t+=1/120)frames.add(sampleKnockoutScene(scene,t).attackerFrame);
  assert.deepEqual([...frames],Array.from({length:16},(_,i)=>i));
  assert.equal(sampleKnockoutScene(scene,scene.impact).attackerFrame,7);
  assert.equal(sampleKnockoutScene(scene,scene.impact+.55).attackerFrame,15);
 }
});
test('Alan body hook excludes shrinking drawings and returns to the original guard',()=>{
 for(const direction of [1,-1]) {
  const scene=createKnockoutScene('alan',0,direction===1?350:950,direction===1?950:350);
  assert.ok(scene);
  assert.equal(Math.abs(scene.attackerTarget-scene.victimTarget),190);
  assert.equal(scene.hitHeight,.60);assert.equal(scene.hitOffset,0);
  const frames=new Set();
  for(let t=scene.approach;t<scene.impact+.5;t+=1/120)frames.add(sampleKnockoutScene(scene,t).attackerFrame);
  assert.deepEqual([...frames].sort((a,b)=>a-b),Array.from({length:11},(_,i)=>i));
  assert.equal(sampleKnockoutScene(scene,scene.impact+.5).attackerFrame,0);
  assert.equal(sampleKnockoutScene(scene,scene.impact).attackerFrame,8);
 }
});
test('Benny blade sequences use distinct arcs and exclude the hand-switch drawing',()=>{
 const original=FINISHER_CHOREOGRAPHY.benny;
 const base={...original,impacts:[original.impacts[0],{...original.impacts[1],t:original.impacts[0].t+.36},original.impacts.at(-1)]};
 const horizontal=paintedFatalityScript('benny',0,base),rising=paintedFatalityScript('benny',1,base);
 assert.notDeepEqual(horizontal.keys,rising.keys);
 assert.notEqual(horizontal.impacts.at(-1).label,rising.impacts.at(-1).label);
 assert.ok(!horizontal.paintedFrames.some(k=>k.frame===3));
 for(const script of [horizontal,rising]) {
  for(let i=1;i<script.paintedFrames.length;i++)assert.ok(script.paintedFrames[i].t>script.paintedFrames[i-1].t);
  for(let i=1;i<script.keys.length;i++)assert.ok(script.keys[i].t>script.keys[i-1].t);
  for(let t=0;t<script.duration;t+=1/120) {
   const pose=sampleFinisher(script.keys,t);
   assert.ok(pose.vx-pose.ax>=230);assert.equal(pose.zoom,1);
  }
  assert.equal(paintedFatalityFrame(script,script.duration),15);
 }
});
test('Allan pressure scene aligns two impacts with the two extended fists',()=>{
 const scene=paintedFatalityScript('alan',0,FINISHER_CHOREOGRAPHY.alan);
 assert.equal(scene.paintedBank,'cinema-fatal-0');
 assert.equal(scene.impacts.length,2);
 assert.deepEqual(scene.impacts.map(i=>paintedFatalityFrame(scene,i.t)),[5,10]);
 for(let i=1;i<scene.paintedFrames.length;i++)assert.ok(scene.paintedFrames[i].t>scene.paintedFrames[i-1].t);
 for(let t=0;t<=scene.duration;t+=1/120){const p=sampleFinisher(scene.keys,t);assert.equal(p.zoom,1);assert.ok(p.vx-p.ax>=220);}
 assert.equal(paintedFatalityFrame(scene,scene.duration),15);
 const overhead=paintedFatalityScript('alan',1,FINISHER_CHOREOGRAPHY.alan);
 assert.equal(overhead.paintedBank,'cinema-fatal-1');
 assert.equal(overhead.impacts.length,1);
 assert.equal(paintedFatalityFrame(overhead,overhead.impacts[0].t),10);
 assert.deepEqual(overhead.paintedFrames.map(p=>p.frame),[0,2,1,3,4,5,7,6,10,9,8,11,12,13,14,15]);
 assert.notDeepEqual(overhead.keys,scene.keys);
 for(const s of [scene,overhead])for(const impact of s.impacts)assert.equal(impact.projectilePhase,null);
});
test('knockout frames progress once and hold the resting body indefinitely',()=>{
 const seen=new Set();let prior=0;
 for(let t=0;t<5;t+=1/240){const frame=knockoutFrame(t);assert.ok(frame>=prior);seen.add(frame);prior=frame;}
 assert.equal(seen.size,16);assert.equal(knockoutFrame(100),15);
});

test('staged knockout closes distance before contact, falls after contact, celebrates after settling',()=>{
 for(const id of ['jez','benny'])for(const [a,v] of [[30,1250],[1250,30],[580,680]]) {
  const scene=createKnockoutScene(id,0,a,v);
  const before=sampleKnockoutScene(scene,scene.impact-.001);
  assert.equal(before.victimFrame,null);
  assert.equal(before.impact,false);
  assert.equal(before.walking,false);
  assert.equal(Math.abs(before.attackerX-before.victimX),320);
  assert.ok(Math.min(before.attackerX,before.victimX)>=200);
  assert.ok(Math.max(before.attackerX,before.victimX)<=1080);
  const hit=sampleKnockoutScene(scene,scene.impact);
  assert.equal(hit.victimFrame,0);assert.equal(hit.impact,true);assert.equal(hit.landing,false);
  const rest=sampleKnockoutScene(scene,scene.impact+1.31);
  assert.equal(rest.victimFrame,15);assert.equal(rest.victory,false);
  assert.equal(sampleKnockoutScene(scene,scene.impact+1.66).victory,true);
 }
});
test('portrait inserts never hide contact or aftermath, including reduced motion',()=>{
 for(const reduced of [false,true]) {
  assert.equal(cinematicPortraitOpacity(-1,reduced),0);
  assert.equal(cinematicPortraitOpacity(-.5,reduced),1);
  for(let t=-.28;t<3;t+=1/120)assert.equal(cinematicPortraitOpacity(t,reduced),0);
 }
});
test('Jez fatalities have distinct staged trajectories and complete dedicated attacker sequences',()=>{
 const original=FINISHER_CHOREOGRAPHY.jez;
 const base={...original,impacts:[original.impacts[0],{...original.impacts[1],t:original.impacts[0].t+.36},original.impacts.at(-1)]};
 const variants=[0,1].map(v=>paintedFatalityScript('jez',v,base));
 assert.notEqual(variants[0].paintedBank,variants[1].paintedBank);
 assert.notDeepEqual(variants[0].keys,variants[1].keys);
 assert.notDeepEqual(variants[0].impacts,variants[1].impacts);
 for(const script of variants) {
  assert.equal(script.paintedFrames.length,16);
  for(let i=1;i<16;i++)assert.ok(script.paintedFrames[i].t>script.paintedFrames[i-1].t);
  const seen=new Set();
  for(let t=0;t<=script.duration+.1;t+=1/120) {
   seen.add(paintedFatalityFrame(script,t));
   const pose=sampleFinisher(script.keys,t);
   assert.ok(pose.vx-pose.ax>=200);
   assert.equal(pose.zoom,1);
  }
  assert.equal(seen.size,16);
 }
});







test('released wire preserves its endpoints, falls to the floor and stays settled deterministically',()=>{
 for(const direction of [1,-1]){
  const start={x:300*direction,y:210},end={x:600*direction,y:290},floor=500;
  assert.equal(releasedPostWire(2.49,start,end,floor,direction),null);
  const release=releasedPostWire(2.5,start,end,floor,direction);
  assert.deepEqual(release.start,start);assert.deepEqual(release.end,end);
  let previous=release;
  for(let t=2.5;t<4.4;t+=1/120){
   const wire=releasedPostWire(t,start,end,floor,direction);
   assert.ok(wire.start.y>=previous.start.y&&wire.end.y>=previous.end.y);
   assert.ok(wire.start.y<=floor&&wire.end.y<=floor);
   assert.deepEqual(wire,releasedPostWire(t,start,end,floor,direction));
   previous=wire;
  }
  assert.ok(previous.settled);
  assert.deepEqual(previous,releasedPostWire(4.4,start,end,floor,direction));
 }
});

test('painted contact spray stays small, directional and short lived across quality settings',()=>{
 for(const direction of [1,-1]){
  const particles=cinematicContactParticles(100,200,direction,{random:()=>.5});
  assert.equal(particles.length,12);
  assert.ok(particles.every(p=>p.vx*direction>0&&p.life<=.48));
  assert.ok(particles.filter(p=>p.kind==='sweat').every(p=>p.size<2));
  assert.ok(particles.every(p=>['sweat','mist'].includes(p.kind)));
  assert.equal(cinematicContactParticles(0,0,direction,{quality:0}).length,0);
  assert.equal(cinematicContactParticles(0,0,direction,{reducedMotion:true}).length,3);
 }
});


test('body-hook knockout selects the torso-first reaction for every opponent',()=>{
 for(const victim of CINEMATIC_FIGHTERS){
  const scene=createKnockoutScene('alan',0,350,950,1280,victim);
  assert.equal(scene.victimBank,'cinema-body-ko');
  assert.equal(sampleKnockoutScene(scene,scene.impact+.1).victimFrame,1);
  assert.equal(sampleKnockoutScene(scene,scene.impact+1.3).victimFrame,15);
 }
});

test('paint spray and swarm audio start with their visible release poses',()=>{
 const spray=paintedFatalityScript('post',1,FINISHER_CHOREOGRAPHY.post);
 const swarm=paintedFatalityScript('cyraxx',0,FINISHER_CHOREOGRAPHY.cyraxx);
 assert.equal(cinematicFoleyBetween(spray,.79,.8)[0].audioCue,'vfx-paint');
 assert.equal(cinematicFoleyBetween(swarm,1.04,1.05)[0].kind,'object-bedbugs');
 assert.deepEqual(cinematicFoleyBetween(spray,.8,.8),[]);
 assert.deepEqual(cinematicFoleyBetween(swarm,1.05,1.05),[]);
});

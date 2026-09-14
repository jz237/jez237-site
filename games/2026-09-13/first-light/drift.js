// The Lure Cam drift: the quiet attract. A camera slips under the surface and visits the cove's fish
// one at a time, sliding in at walking pace and circling slowly, with a school of shiners or a look up
// through Snell's window between them. Pure and node-tested: the shot planner and the camera motion.
// main.js feeds it the population each frame and keeps the camera in the water.
export const DRIFT={hold:[9,15],orbitRate:.12,approach:[1.4,2.4],speed:1.2,windowChance:.12,schoolChance:.2,revisitSeconds:120};
export function createDrift(random=Math.random){return {random,shot:null,visited:{},shots:0,pos:null,look:null};}
// pick the next subject: big, moving, unvisited fish score high, near ones cost less travel
export function planShot(d,{fish=[],schools=[],t=0}){
 const r=d.random,cands=fish.filter(f=>f.state!=='LANDED'&&f.state!=='HOOKED');
 const roll=r();let kind='fish';const last=d.shot?d.shot.kind:null;
 if(schools.length&&roll<DRIFT.schoolChance&&last!=='school')kind='school';else if(roll<DRIFT.schoolChance+DRIFT.windowChance&&d.shots>0&&last!=='window')kind='window';
 let subject=null;
 if(kind==='fish'&&cands.length){let best=null,bs=-1;const lastId=d.shot?d.shot.id:null;for(const f of cands){const seen=d.visited[f.id];const fresh=seen===undefined?1:Math.max(.05,Math.min(1,(t-seen)/DRIFT.revisitSeconds));const moving=f.state==='CRUISE'||f.state==='INSPECT'?1.5:1;const travel=d.pos?Math.hypot(f.x-d.pos.x,f.z-d.pos.z):0;const score=(f.length||.3)*moving*fresh*(f.id===lastId?.05:1)/(1+travel/15)*(.7+r()*.6);if(score>bs){bs=score;best=f;}}subject=best;}
 else if(kind==='school'&&schools.length)subject=schools[Math.floor(r()*schools.length)];
 if(!subject&&kind!=='window'){if(cands.length){subject=cands[Math.floor(r()*cands.length)];kind='fish';}else kind='window';}
 const hold=DRIFT.hold[0]+r()*(DRIFT.hold[1]-DRIFT.hold[0]),dist=DRIFT.approach[0]+r()*(DRIFT.approach[1]-DRIFT.approach[0]);
 const anchor=subject?{x:subject.x,y:subject.y,z:subject.z}:d.pos?{...d.pos}:{x:0,y:-1,z:0};
 d.shot={kind,id:subject?subject.id:null,species:subject?subject.species||null:null,hold,dist,angle:r()*6.283,start:t,arrivedAt:null,anchor};
 if(subject&&kind==='fish')d.visited[subject.id]=t;d.shots++;return d.shot;
}
// each frame: the orbit point around the live subject, the camera sliding to it at walking pace, the look easing onto the subject
export function stepDrift(d,dt,t,subject){
 const s=d.shot;if(!s)return null;const sp=subject||s.anchor;s.angle+=DRIFT.orbitRate*dt;
 let goal,lookAt;
 if(s.kind==='window'){goal={x:sp.x,y:-.35,z:sp.z};lookAt={x:sp.x+Math.cos(s.angle)*3,y:1.4,z:sp.z+Math.sin(s.angle)*3};}
 else{goal={x:sp.x+Math.cos(s.angle)*s.dist,y:sp.y+.15,z:sp.z+Math.sin(s.angle)*s.dist};lookAt={x:sp.x,y:sp.y,z:sp.z};}
 if(!d.pos){d.pos={...goal};d.look={...lookAt};s.arrivedAt=t;}
 else{const dx=goal.x-d.pos.x,dy=goal.y-d.pos.y,dz=goal.z-d.pos.z,dl=Math.hypot(dx,dy,dz);const step=Math.min(dl,DRIFT.speed*dt+Math.min(dl*dt*.35,DRIFT.speed*dt*.5));/* walking pace, a touch of ease near the goal */if(dl>1e-6){const f=step/dl;d.pos.x+=dx*f;d.pos.y+=dy*f;d.pos.z+=dz*f;}
  if(s.arrivedAt===null&&dl<(s.kind==='school'?2.5:.6))s.arrivedAt=t;const k=Math.min(1,dt*2.2);d.look.x+=(lookAt.x-d.look.x)*k;d.look.y+=(lookAt.y-d.look.y)*k;d.look.z+=(lookAt.z-d.look.z)*k;}
 const done=s.arrivedAt!==null&&t-s.arrivedAt>s.hold||t-s.start>s.hold+20; // a subject that keeps running is let go
 return {pos:d.pos,look:d.look,done,kind:s.kind,travelling:s.arrivedAt===null};
}
const STATE_WORD={HOLD:'holding',CRUISE:'on the move',INSPECT:'looking at something',STRIKE:'committed',BITE:'eating',REFUSE:'turning away',FLEE:'spooked',RESTING:'resting'};
export function driftCaption(shot,subject){if(!shot)return '';if(shot.kind==='window')return 'The surface from below';if(shot.kind==='school')return 'Shiners, keeping together';if(!subject)return '';if(!subject.name)return '';return `${subject.name} · ${subject.lengthIn} in · ${STATE_WORD[subject.state]||String(subject.state||'').toLowerCase()}`;}

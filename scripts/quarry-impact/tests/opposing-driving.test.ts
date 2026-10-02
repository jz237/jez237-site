import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {DrivingBrain,type DriverCar,type DriverMemory,type Clearance} from '../src/driving-brain';
import type {CarKind} from '../src/rules';
const clear=():Clearance=>({front:30,left:30,right:30,rear:30});
const straight=[{x:0,z:-100},{x:0,z:100},{x:0,z:200}];
const reverse=[{x:0,z:100},{x:0,z:-100},{x:0,z:-200}];
function car(id:number,x=0,z=0,yaw=0,speed=16,kind:CarKind='tern'):DriverCar{
 const forward={x:Math.sin(yaw),y:0,z:Math.cos(yaw)};return {id,kind,current:{x,y:1,z},velocity:{x:forward.x*speed,y:0,z:forward.z*speed},forward,right:{x:forward.z,y:0,z:-forward.x},speed,health:100,finished:false,nextCheckpoint:1,surface:'asphalt'};
}
const projected=(x:number,z:number,yaw:number)=>({x:x*Math.cos(yaw)+z*Math.sin(yaw),z:-x*Math.sin(yaw)+z*Math.cos(yaw)});
function pair(yaw=0,gap=24,ids:readonly [number,number]=[1,4]){const p=projected(0,gap,yaw);return [car(ids[0],0,0,yaw),car(ids[1],p.x,p.z,yaw+Math.PI)] as const;}
const rotated=(route:typeof straight,yaw:number)=>route.map(p=>projected(p.x,p.z,yaw));
const legacyMemory=(m:DriverMemory)=>({derby:m.derby,target:m.target,commit:m.commit,stalled:m.stalled,reverse:m.reverse,escape:m.escape,escapeSteer:m.escapeSteer,attempts:m.attempts,steer:m.steer,lane:m.lane,phase:m.phase,scan:m.scan,clear:m.clear});
/** Prescribed control samples, not a physics rollout. Four lane IDs, changing
 * position/speed/road bend/surface and obstacle scans exercise the old branches.
 * The expected hashes were generated using the independently saved predecessor
 * 0a6e68734d7fc1c58756e1db68072e51572168bbcf18d5a62732289ac6a2fc80,
 * published at 9768bcf264d4bb39ae8ada88895c72e79b3b55ab. No git/work dependency. */
export function unaffectedTrace(Brain:typeof DrivingBrain,scenario:string){
 const brain=new Brain(),samples:unknown[]=[];
 for(let tick=0;tick<360;tick++){
  const self=car([0,1,2,10][tick%4],Math.sin(tick/17)*1.6,-20+(tick%120)*.24,0,2+(tick%110)*.2);
  self.surface=tick%70<35?'asphalt':'gravel';
  const other=car(20,self.current.x+Math.sin(tick/13)*1.2,self.current.z+2+(tick%75)*.3,scenario==='crossing'?Math.PI/2:scenario==='wreck'?Math.PI:0,scenario==='wreck'?0:6+(tick%60)/10);
  if(scenario==='wreck')other.health=0;
  const cars=scenario==='clear'?[self]:tick%2?[other,self]:[self,other];
  const probe=()=>({front:tick%80<15?4:30,left:tick%2?13:8,right:tick%3?5:14,rear:tick%3?30:1});
  const input=brain.update(self,cars,scenario==='derby'?'derby':'race',[1/60,1/30,1/120,.08][tick%4],probe,[{x:0,z:-100},{x:0,z:30},{x:24,z:110}]);
  assert.equal(brain.memory.get(self.id)?.pass,undefined,scenario+': no hidden passing commitment');
  assert.equal(brain.memory.get(self.id)?.escapeTurn,undefined,scenario+': no hidden contact-escape direction');
  samples.push({input,memory:structuredClone(legacyMemory(brain.memory.get(self.id)!))});
 }
 return createHash('sha256').update(JSON.stringify(samples)).digest('hex');
}

test('head-on drivers commit early to reciprocal passing corridors regardless of ID parity or world heading',()=>{
 for(const ids of [[1,4],[0,2],[3,9],[2,5]] as const)for(const yaw of [0,Math.PI/2,Math.PI*.37]){
  const brain=new DrivingBrain(),[a,b]=pair(yaw,24,ids),ra=rotated(straight,yaw),rb=rotated(reverse,yaw);let outputA,outputB;
  for(let i=0;i<30;i++){outputA=brain.update(a,[a,b],'race',1/60,clear,ra);outputB=brain.update(b,[b,a],'race',1/60,clear,rb);}
  assert.ok(outputA!.steer>0&&outputB!.steer>0,'both move to their own right before the old short-range collision zone');
  const wa={x:a.right.x*outputA!.steer,z:a.right.z*outputA!.steer},wb={x:b.right.x*outputB!.steer,z:b.right.z*outputB!.steer};assert.ok(wa.x*wb.x+wa.z*wb.z<0,'their world-space passing corridors diverge');
  assert.equal(brain.memory.get(a.id)?.pass?.target,b.id);assert.equal(brain.memory.get(b.id)?.pass?.target,a.id);
 }
});

test('centreline jitter cannot flip a held side, and distinct equally urgent neighbours are independent of array order',()=>{
 const jitter=new DrivingBrain(),self=car(1),opponent=car(4,0,24,Math.PI);let last=0;
 for(let tick=0;tick<100;tick++){
  opponent.current.x=(tick%2?1:-1)*.015;
  const input=jitter.update(self,tick%2?[self,opponent]:[opponent,self],'race',1/60,clear,straight);
  assert.ok(input.steer>0);assert.ok(Math.abs(input.steer-last)<=.0750000001);last=input.steer;
 }
 const brains=[new DrivingBrain(),new DrivingBrain()],one=car(4,-1.2,24,Math.PI),two=car(7,1.2,24,Math.PI);
 for(let tick=0;tick<100;tick++){
  const a=brains[0].update(self,[self,one,two],'race',1/60,clear,straight),b=brains[1].update(self,tick%2?[two,self,one]:[one,two,self],'race',1/60,clear,straight);
  assert.deepEqual(a,b,'enumeration order cannot change the controls');assert.equal(brains[0].memory.get(1)?.pass?.target,4);assert.equal(brains[1].memory.get(1)?.pass?.target,4);
 }
});

test('an unsafe close encounter reduces closing demand but a separated parallel pass remains at normal road speed',()=>{
 const [a,b]=pair(0,9),danger=new DrivingBrain(),baseline=new DrivingBrain();const actual=danger.update(a,[a,b],'race',.1,clear,straight),alone=baseline.update(a,[a],'race',.1,clear,straight);
 assert.ok(actual.brake>alone.brake&&actual.throttle<alone.throttle,'close overlapping swept bodies need a speed reduction');
 const safe=car(4,-4,9,Math.PI),separated=new DrivingBrain();assert.deepEqual(separated.update(a,[a,safe],'race',.1,clear,straight),alone,'already separate lanes do not incur emergency braking');
});

test('passing memory releases after the other car is behind, returning smoothly to the original lane and resetting cleanly',()=>{
 const brain=new DrivingBrain(),[a,b]=pair();for(let i=0;i<60;i++)brain.update(a,[a,b],'race',1/60,clear,straight);assert.ok(brain.memory.get(1)?.pass);
 b.current.z=-12;let prior=brain.memory.get(1)!.steer;
 for(let i=0;i<180;i++){const input=brain.update(a,[a,b],'race',1/60,clear,straight);assert.ok(Math.abs(input.steer-prior)<=.0750000001);prior=input.steer;}
 assert.equal(brain.memory.get(1)?.pass,undefined);const fresh=new DrivingBrain().update(a,[a],'race',1/60,clear,straight);assert.deepEqual(brain.update(a,[a,b],'race',1/60,clear,straight),fresh);
 brain.reset();assert.equal(brain.memory.size,0);
});

test('nonclosing opposite headings do not start a passing commitment; stationary wrecks retain physical avoidance',()=>{
 const a=car(1),away=car(4,0,18,Math.PI);away.velocity={x:0,y:0,z:30};away.speed=-30;const brain=new DrivingBrain();brain.update(a,[a,away],'race',.1,clear,straight);assert.equal(brain.memory.get(1)?.pass,undefined);
 const wreck=car(4,0,5,Math.PI,0);wreck.health=0;const avoid=new DrivingBrain(),input=avoid.update(a,[a,wreck],'race',.2,clear,straight);assert.ok(input.brake>.5);assert.notEqual(input.steer,0);assert.equal(avoid.memory.get(1)?.pass,undefined);assert.equal(avoid.memory.get(1)?.phase,'avoid wreck');
});

test('race recovery never reverses into the existing blocked rear scenery probe and still escapes when room exists',()=>{
 const self=car(1,0,0,0,0),blocked=new DrivingBrain(),open=new DrivingBrain();let reversed=false,forwardAfter=false;
 for(let i=0;i<300;i++){
  const block=blocked.update(self,[self],'race',1/60,()=>({front:1,left:8,right:3,rear:1}),straight);assert.ok(block.throttle>=0);
  const input=open.update(self,[self],'race',1/60,()=>({front:1,left:8,right:3,rear:30}),straight);if(input.throttle<0)reversed=true;if(reversed&&input.throttle>0)forwardAfter=true;
 }
 assert.ok(reversed&&forwardAfter);
});

test('clear road, same-direction traffic, crossing traffic, disabled wrecks and derby retain exact predecessor controls and memory',()=>{
 const expected={clear:'2a94f09ecf1e5190277a4e02483e3cd2e3d3a58ea6bcfc58432f3c4fa3289f33',following:'7a0d2819e21c4d657f6b538f9c0db574fcd1fce8366cc80d1c74580abb4f4761',crossing:'7a0d2819e21c4d657f6b538f9c0db574fcd1fce8366cc80d1c74580abb4f4761',wreck:'18355e43400ad37946cc5cd1bc3740298b01ded36b9eb4693b10a11d3dad2524',derby:'6a3fb04d582cb03caebcfda89214581cec6888b9c2682f22d2893df6acbb2aa2'};
 for(const [scenario,digest]of Object.entries(expected))assert.equal(unaffectedTrace(DrivingBrain,scenario),digest,scenario);
});


test('mirrored off-centre and bent-heading encounters agree on a physical side that increases existing separation',()=>{
 for(const {offset,bend} of [{offset:.6,bend:0},{offset:-.6,bend:0},{offset:.5,bend:.25},{offset:-.5,bend:-.25}]){
  const a=car(1,-offset,0),b=car(4,offset,14,Math.PI+bend),brain=new DrivingBrain();
  const road=(c:DriverCar)=>[-100,100,200].map(d=>({x:c.current.x+c.forward.x*d,z:c.current.z+c.forward.z*d}));
  let ia,ib;for(let i=0;i<20;i++){ia=brain.update(a,[a,b],'race',1/60,clear,road(a));ib=brain.update(b,[b,a],'race',1/60,clear,road(b));}
  const ma=brain.memory.get(a.id)?.pass,mb=brain.memory.get(b.id)?.pass;assert.ok(ma&&mb);assert.equal(ma.side,mb.side,'reciprocal pair frame must agree despite heading curvature');
  const dx=b.current.x-a.current.x,dz=b.current.z-a.current.z,sx=b.right.x*ib!.steer-a.right.x*ia!.steer,sz=b.right.z*ib!.steer-a.right.z*ia!.steer;
  // Measure across the relative-motion corridor, not total distance: on a
  // bend the vehicles are still legitimately closing longitudinally.
  const vx=a.velocity.x-b.velocity.x,vz=a.velocity.z-b.velocity.z,length=Math.hypot(vx,vz),nx=vz/length,nz=-vx/length;
  const separation=dx*nx+dz*nz,change=sx*nx+sz*nz;
  assert.ok(separation*change>0,'passing steering opens the existing lateral corridor: '+JSON.stringify({offset,bend,ia,ib,separation,change}));
 }
});

test('a driver pushed backwards in a committed encounter escapes without treating ordinary reverse travel as a new stall',()=>{
 const [self,other]=pair(0,9),brain=new DrivingBrain();brain.update(self,[self,other],'race',1/60,clear,straight);assert.ok(brain.memory.get(self.id)?.pass);
 self.speed=-2;self.velocity={x:0,y:0,z:-2};other.current.z=5;const uncommitted=new DrivingBrain(),blocked=new DrivingBrain();blocked.update(self,[self,other],'race',1/60,clear,straight);let backedOut=false,drivenClear=false;
 for(let tick=0;tick<240;tick++){
  const input=brain.update(self,[self,other],'race',1/60,clear,straight);if(input.throttle<0)backedOut=true;if(backedOut&&input.throttle>0)drivenClear=true;
  assert.ok(blocked.update(self,[self,other],'race',1/60,()=>({front:30,left:12,right:30,rear:1}),straight).throttle>=0,'blocked rear still prevents reverse throttle during an oncoming encounter');
  uncommitted.update(self,[self],'race',1/60,clear,straight);
 }
 assert.ok(backedOut&&drivenClear);assert.ok(brain.memory.get(self.id)!.attempts>0);assert.equal(uncommitted.memory.get(self.id)!.attempts,0);
});

test('a new opponent gets its own passing side after the original committed opponent is safely behind',()=>{
 const self=car(1),old=car(4,1,14,Math.PI),next=car(7,-1,14,Math.PI),brain=new DrivingBrain();
 let before;for(let tick=0;tick<20;tick++)before=brain.update(self,[self,old],'race',1/60,clear,straight);assert.ok(before!.steer<0);
 old.current.z=-12;const fresh=new DrivingBrain();let actual,expected;
 for(let tick=0;tick<30;tick++){actual=brain.update(self,[self,old,next],'race',1/60,clear,straight);expected=fresh.update(self,[self,next],'race',1/60,clear,straight);}
 assert.equal(brain.memory.get(self.id)?.pass?.target,next.id);assert.ok(actual!.steer>0,'a stale left-pass commitment must not steer into the next opponent on the left');
 assert.deepEqual(actual,expected,'after steering settles, the new encounter agrees with an independent fresh encounter');
});

/** A prescribed body-motion trace separates an external backwards push from
 * the reverse/drive-clear maneuver subsequently commanded by the driver. */
export function intentionalBackoutTrace(Brain:typeof DrivingBrain){
 const brain=new Brain(),[self,other]=pair(0,9),dt=1/60;
 brain.update(self,[self,other],'race',dt,clear,straight);
 let triggered=false;
 for(let tick=0;tick<180;tick++){
  self.speed=-2;self.velocity={x:0,y:0,z:-2};self.current.z-=2*dt;
  other.speed=2;other.velocity={x:0,y:0,z:-2};other.current.z=self.current.z+4;
  if(brain.update(self,[self,other],'race',dt,clear,straight).throttle<0){triggered=true;break;}
 }
 // The opposing car moves out of the collision corridor; its identity is
 // still nearby, so dropping the encounter cannot hide a timer regression.
 other.current.x=3;let reverseFrames=0,escapeFrames=0,maxIntentionalStall=0,forwardAfter=false;
 for(let tick=0;tick<240;tick++){
  const before=brain.memory.get(self.id)!;
  const reversing=before.reverse>0,escaping=before.escape>0;
  self.speed=reversing?-3:escaping?-1.2:4;self.velocity={x:0,y:0,z:self.speed};self.current.z+=self.speed*dt;other.current.z-=2*dt;
  const input=brain.update(self,[self,other],'race',dt,clear,straight),after=brain.memory.get(self.id)!;
  if(reversing||escaping){assert.ok(after.pass,'encounter stays retained throughout the intentional maneuver');maxIntentionalStall=Math.max(maxIntentionalStall,after.stalled);}
  if(reversing)reverseFrames++;if(escaping)escapeFrames++;
  if(reverseFrames&&escapeFrames&&!reversing&&!escaping&&input.throttle>0)forwardAfter=true;
 }
 return {triggered,reverseFrames,escapeFrames,maxIntentionalStall,forwardAfter,attempts:brain.memory.get(self.id)!.attempts};
}

test('intentional back-out and negative coasting during drive-clear cannot accumulate a fresh stall or immediately restart reverse',()=>{
 const trace=intentionalBackoutTrace(DrivingBrain);
 assert.equal(trace.triggered,true,'the genuine external backwards push first triggers recovery');
 assert.ok(trace.reverseFrames>30&&trace.escapeFrames>20,'observe both complete multi-frame maneuver phases');
 assert.equal(trace.maxIntentionalStall,0,'the commanded maneuver does not count as a new blocked-forward episode');
 assert.equal(trace.attempts,1,'a clear back-out completes once instead of walking the car backwards repeatedly');assert.equal(trace.forwardAfter,true);
});

test('a committed stopped pair keeps forward demand for steering, with a bounded crawl while still closing',()=>{
 const brain=new DrivingBrain(),[a,b]=pair(0,9),dt=1/60;
 b.current.x=-1.025;const oppositeRoad=reverse.map(p=>({x:p.x+b.current.x,z:p.z}));
 brain.update(a,[a,b],'race',dt,clear,straight);brain.update(b,[b,a],'race',dt,clear,oppositeRoad);
 b.current.z=4.006;
 a.speed=b.speed=0;a.velocity={x:0,y:0,z:0};b.velocity={x:0,y:0,z:0};
 for(let tick=0;tick<30;tick++){
  const ia=brain.update(a,[a,b],'race',dt,clear,straight),ib=brain.update(b,[b,a],'race',dt,clear,oppositeRoad);
  for(const input of [ia,ib]){assert.ok(input.throttle>0&&input.throttle<=1,'stationary opponents must be able to move their steered tyres');assert.equal(input.brake,0);assert.ok(input.steer>0);}
  assert.equal(brain.memory.get(a.id)?.pass?.target,b.id);assert.equal(brain.memory.get(b.id)?.pass?.target,a.id);
 }
 // Reproduce a near-stopped, still-closing contact rather than treating an
 // opposite heading alone as closure; then bracket the low-speed demand.
 b.speed=.0016;b.velocity={x:0,y:0,z:-b.speed};
 for(const speed of [.004,2,4]){
  a.speed=speed;a.velocity={x:0,y:0,z:speed};
  const input=brain.update(a,[a,b],'race',dt,clear,straight);
  if(speed<3){assert.ok(input.throttle>0);assert.equal(input.brake,0);}else{assert.equal(input.throttle,0);assert.ok(input.brake>0,'close opponents cannot accelerate straight back to racing speed');}
 }
 assert.equal(brain.memory.get(a.id)?.attempts,0,'forward demand begins before timed reverse recovery');
});

test('a retained opponent clear of the current and predicted corridor yields to a new urgent threat, but stays held otherwise',()=>{
 const self=car(1),old=car(4,1,14,Math.PI),next=car(7,-1,8,Math.PI);
 const brain=new DrivingBrain(),noThreat=new DrivingBrain();
 for(let tick=0;tick<20;tick++){brain.update(self,[self,old],'race',1/60,clear,straight);noThreat.update(self,[self,old],'race',1/60,clear,straight);}
 assert.equal(brain.memory.get(self.id)?.pass?.side,-1);
 old.current.x=5;old.current.z=12;
 const fresh=new DrivingBrain();let actual,expected;
 for(let tick=0;tick<30;tick++){
  actual=brain.update(self,[self,old,next],'race',1/60,clear,straight);expected=fresh.update(self,[self,next],'race',1/60,clear,straight);
  noThreat.update(self,[self,old],'race',1/60,clear,straight);
 }
 assert.equal(brain.memory.get(self.id)?.pass?.target,next.id);assert.ok(actual!.steer>0,'the old right-side opponent must not send this car into the new left-side threat');assert.deepEqual(actual,expected);
 assert.deepEqual(noThreat.memory.get(self.id)?.pass,{target:old.id,side:-1},'lateral clearance alone must not discard a held side without another threat');
 for(const {x,vx} of [{x:5,vx:-15},{x:1,vx:15}]){
  const held=new DrivingBrain(),existing=car(4,1,14,Math.PI);
  for(let tick=0;tick<20;tick++)held.update(self,[self,existing],'race',1/60,clear,straight);
  existing.current.x=x;existing.current.z=12;existing.velocity.x=vx;
  held.update(self,[self,existing,next],'race',1/60,clear,straight);
  assert.equal(held.memory.get(self.id)?.pass?.target,existing.id,'a target overlapping either the current or predicted corridor remains the active encounter');
 }
});

test('an already committed opponent opening the gap no longer demands emergency braking',()=>{
 const self=car(1,0,0,0,8),other=car(4,0,8,Math.PI,8),brain=new DrivingBrain();
 brain.update(self,[self,other],'race',1/60,clear,straight);assert.equal(brain.memory.get(self.id)?.pass?.target,other.id);
 other.current.z=4.5;other.speed=-12;other.velocity={x:0,y:0,z:12};
 for(let tick=0;tick<30;tick++){
  const input=brain.update(self,[self,other],'race',1/60,clear,straight);
  assert.equal(input.brake,0,'a small body gap does not imply closing velocity');assert.ok(input.throttle>0);assert.equal(brain.memory.get(self.id)?.pass?.target,other.id);
 }
});

test('several oncoming neighbours cannot multiply steering beyond the strongest encounter, while weaker threats still limit speed',()=>{
 const self=car(1),strong=car(4,-.6,14,Math.PI),second=car(7,-.6,20,Math.PI),third=car(10,-.6,26,Math.PI);
 const road=straight.map(p=>({x:p.x-3,z:p.z})),single=new DrivingBrain(),queue=new DrivingBrain(),nearby=new DrivingBrain();
 // These are separate full-size cars, not duplicate positions. The closer
 // car is near the corridor edge: less steering demand, but less stopping room.
 const close=car(13,-2.1,7,Math.PI);let alone,multiple,limited;
 for(let tick=0;tick<30;tick++){
  alone=single.update(self,[self,strong],'race',1/60,clear,road);
  multiple=queue.update(self,tick%2?[third,self,second,strong]:[self,strong,second,third],'race',1/60,clear,road);
  limited=nearby.update(self,[self,third,close,strong,second],'race',1/60,clear,road);
 }
 assert.ok(alone!.steer>0&&alone!.steer<.9,'the strongest encounter still permits the road steering to contribute');
 assert.deepEqual(multiple,alone,'the queue must not turn a moderate response into a saturated swerve');
 assert.equal(limited!.steer,alone!.steer,'weaker lateral threats cannot amplify the steering response');
 assert.ok(limited!.brake>alone!.brake,'every overlapping neighbour still contributes its necessary speed limit');
 assert.equal(nearby.memory.get(self.id)?.pass?.target,close.id,'the urgent neighbour is assessed rather than discarded');
});

test('contact recovery turns away from the nearest opposing body and locks that choice through back-out and drive-clear',()=>{
 for(const committed of [false,true]){
  const brain=new DrivingBrain(),self=car(1),near=car(4,1.1,3.8,Math.PI),far=car(7,-1.1,4.8,Math.PI),dt=1/60;
  const scenery=()=>({front:30,left:7.6,right:24,rear:30});
  if(committed)brain.update(self,[self,near,far],'race',dt,scenery,straight);
  self.speed=near.speed=far.speed=0;self.velocity=near.velocity=far.velocity={x:0,y:0,z:0};
  let triggered=false;
  for(let tick=0;tick<110;tick++){
   const input=brain.update(self,[self,far,near],'race',dt,scenery,straight);
   if(!committed)assert.equal(brain.memory.get(self.id)?.pass,undefined,'a low-speed contact does not require an earlier passing commitment');
   if(input.throttle<0){assert.ok(input.steer>0,'reverse must swing the nose away from the nearer right-side body despite more distant right scenery clearance');triggered=true;break;}
  }
  assert.equal(triggered,true);assert.equal(brain.memory.get(self.id)?.escapeTurn,1);
  // Movement of the neighbour and changing scan preferences must not flip a
  // maneuver that is already underway. Only the next recovery may choose anew.
  near.current.x=-1.1;far.current.x=1.1;
  let reverseFrames=0,forwardFrames=0,complete=false;
  for(let tick=0;tick<180;tick++){
   const before=brain.memory.get(self.id)!,reversing=before.reverse>0,escaping=before.escape>0;
   self.speed=reversing?-3:escaping?-1.2:4;self.velocity={x:0,y:0,z:self.speed};
   const input=brain.update(self,tick%2?[self,near,far]:[far,self,near],'race',dt,()=>({front:30,left:tick%24<12?24:7.6,right:tick%24<12?7.6:24,rear:30}),straight),after=brain.memory.get(self.id)!;
   if(input.throttle<0){assert.ok(input.steer>0);assert.equal(after.escapeTurn,1);reverseFrames++;}
   if(after.phase==='drive clear'){
    assert.ok(input.throttle>0);forwardFrames++;
    if(forwardFrames>24)assert.ok(input.steer<0,'forward escape settles to the opposite turn after the normal steering blend');
    if(after.escape>0)assert.equal(after.escapeTurn,1);
   }
   if(forwardFrames>24&&after.reverse<=0&&after.escape<=0){assert.equal(after.escapeTurn,undefined,'the direction belongs to this contact cycle only');complete=true;break;}
  }
  assert.ok(reverseFrames>30&&forwardFrames>24&&complete);assert.equal(brain.memory.get(self.id)?.attempts,1);
 }
 for(const {left,right,expected} of [{left:1.8,right:24,expected:-1},{left:24,right:1.8,expected:1}]){
  const brain=new DrivingBrain(),self=car(1,0,0,0,0),other=car(4,1.1,3.8,Math.PI,0);let reversed=false;
  for(let tick=0;tick<110;tick++){
   const input=brain.update(self,[self,other],'race',1/60,()=>({front:30,left,right,rear:30}),straight);
   if(input.throttle<0){assert.equal(Math.sign(input.steer),expected);assert.equal(brain.memory.get(self.id)?.escapeTurn,undefined,'tight scenery preserves the existing clearance choice');reversed=true;break;}
  }
  assert.equal(reversed,true);
 }
 const blocked=new DrivingBrain(),self=car(1,0,0,0,0),other=car(4,1.1,3.8,Math.PI,0);
 for(let tick=0;tick<180;tick++)assert.ok(blocked.update(self,[self,other],'race',1/60,()=>({front:30,left:7.6,right:24,rear:1.8}),straight).throttle>=0,'static rear obstruction still forbids backing up');
});

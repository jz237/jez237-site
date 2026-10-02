import test from 'node:test';
import assert from 'node:assert/strict';
import R from '@dimforge/rapier3d-compat';
import {ImpactAdjudicator,type ImpactContact} from '../src/impact-adjudication';
import {structuralDamage} from '../src/bodywork-response';
import {CAR_KINDS,type CarKind} from '../src/rules';
import {createVehiclePhysics,vehicleSpecification,rotateVehicleVector} from '../src/vehicle-physics';
import {vehicleContact} from '../src/vehicle-contact';
import {freshComponents,applyComponentImpact,validComponents} from '../src/component-damage';
import {Simulation} from '../multiplayer/simulation';
import type {Snapshot} from '../multiplayer/protocol';

await R.init();
const dt=1/60;
const impact=(damage:number,extra:Partial<ImpactContact>={})=>({key:'pair',impulse:3100+damage*1320,closing:10,damageScale:1,...extra});
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);

test('harmless contacts retain feedback without consuming the following crash damage cooldown',()=>{
 const judge=new ImpactAdjudicator(),tap=impact(0,{impulse:2200});
 assert.equal(judge.needsContact('pair',0),true);
 assert.deepEqual(judge.adjudicate([tap],0),[{contact:tap,damage:0,feedback:true}]);
 assert.equal(judge.needsContact('pair',.01),true,'harmless feedback must still allow a damaging manifold lookup');
 assert.deepEqual(judge.adjudicate([tap],.01),[],'repeated scrape sound remains rate limited');
 const crash=impact(8),hit=judge.adjudicate([crash],.03);assert.equal(hit.length,1);near(hit[0].damage,8);assert.equal(hit[0].feedback,false);
 assert.equal(judge.needsContact('pair',.10),false);assert.equal(judge.needsContact('different pair',.10),true);
 assert.deepEqual(judge.adjudicate([impact(20)],.10),[],'a genuine damage event still starts the existing cooldown');
 const scrape=judge.adjudicate([tap],.28);assert.equal(scrape[0].feedback,true);assert.equal(scrape[0].damage,0);
 assert.equal(judge.needsContact('pair',.29),false);assert.equal(judge.needsContact('pair',.311),true);
 const next=judge.adjudicate([crash],.311);near(next[0].damage,8);assert.equal(next[0].feedback,false,'scrape feedback does not delay the next health impact');
});

test('all contacts in a frame choose the strongest damage once, independent of compound event order',()=>{
 const weak={...impact(.03),part:'mount'},strong={...impact(7),part:'rail'},scrape={...impact(0,{impulse:20000,closing:1}),part:'slide'};
 for(const contacts of [[weak,strong,scrape],[scrape,strong,weak],[strong,weak,scrape]]){
  const decisions=new ImpactAdjudicator().adjudicate(contacts,1);assert.equal(decisions.length,1);assert.equal(decisions[0].contact,strong);near(decisions[0].damage,7);assert.equal(decisions[0].feedback,true);
 }
 const independent=new ImpactAdjudicator().adjudicate([strong,{...strong,key:'other pair'}],1);assert.equal(independent.length,2,'existing distinct contact keys remain distinct');
});

test('armor and race scaling gate real health loss without altering returned raw damage or thresholds',()=>{
 const judge=new ImpactAdjudicator(),scale=1/(1+3*.18),small=impact(.12,{damageScale:scale});
 assert.equal(judge.adjudicate([small],0)[0].damage,0,'armor reduces this below the existing .1 health threshold');
 const hit=judge.adjudicate([impact(2,{damageScale:scale})],.01);near(hit[0].damage,2);assert.equal(hit[0].feedback,false);near(hit[0].damage*scale,2/1.54);
 const race=new ImpactAdjudicator();assert.equal(race.adjudicate([impact(.2)],0,.45)[0].damage,0);near(race.adjudicate([impact(2)],.01,.45)[0].damage,.9);
 const gated=new ImpactAdjudicator();assert.deepEqual(gated.adjudicate([impact(1,{impulse:1499}),impact(1,{closing:.649})],0),[]);
 const edge=impact(0,{impulse:1500,closing:.65});assert.deepEqual(gated.adjudicate([edge],0),[{contact:edge,damage:0,feedback:true}]);
});

test('dead participants make feedback without blocking a later living participant and clear resets both clocks',()=>{
 const judge=new ImpactAdjudicator();assert.equal(judge.adjudicate([impact(10,{damageScale:0})],0)[0].damage,0);
 const live=judge.adjudicate([impact(10)],.01);near(live[0].damage,10);assert.equal(live[0].feedback,false);
 judge.clear();const reset=judge.adjudicate([impact(10)],.01);near(reset[0].damage,10);assert.equal(reset[0].feedback,true);
 assert.equal(judge.needsContact('pair',NaN),false);
});

type Vec={x:number;y:number;z:number};
type Contact=ImpactContact&{point:Vec;poses:{p:Vec;q:Vec&{w:number}}[];velocities:Vec[]};
/** Keep physics untouched while recording its real chronological force stream.
 * Replaying only adjudication isolates cooldown behavior from dent feedback. */
function recordedCrash(kind:CarKind,armor:number,axis:'x'|'z'){
 const world=new R.World({x:0,y:0,z:0}),queue=new R.EventQueue(true);world.timestep=dt;
 const specs=[kind,'buggy' as const].map(k=>vehicleSpecification(k,{engine:0,tires:0,armor,tune:{gearing:0,suspension:0,steering:0,brakeBias:0,differential:0}}));
 const cars=[kind,'buggy' as const].map((k,i)=>({kind:k,...createVehiclePhysics(R,world,k,specs[i].mass,armor)}));
 cars[1].body.setTranslation({x:axis==='x'?6.17:0,y:0,z:axis==='z'?6.17:0},true);
 if(axis==='z')cars[1].body.setRotation({x:0,y:1,z:0,w:0},true);
 cars.forEach((car,i)=>car.body.setLinvel({x:axis==='x'?(i?-20:20):0,y:0,z:axis==='z'?(i?-20:20):0},true));
 const frames:{time:number;contacts:Contact[]}[]=[];
 try{
  for(let tick=0;tick<45;tick++){
   const velocities=cars.map(c=>({...c.body.linvel()}));world.step(queue);
   const poses=cars.map(c=>({p:{...c.body.translation()},q:{...c.body.rotation()}})),contacts:Contact[]=[];
   queue.drainContactForceEvents(e=>{
    const {a,b,key}=vehicleContact(world,cars,e.collider1(),e.collider2());if(!a||!b)return;
    let normal={x:0,y:0,z:0},point={...a.body.translation()};
    world.contactPair(world.getCollider(e.collider1()),world.getCollider(e.collider2()),m=>{if(m.numSolverContacts()>0){const p=m.solverContactPoint(0);if(p){normal={...m.normal()};point={...p};}}});
    const va=velocities[cars.indexOf(a)],vb=velocities[cars.indexOf(b)],relative={x:vb.x-va.x,y:vb.y-va.y,z:vb.z-va.z};
    const closing=Math.hypot(normal.x,normal.y,normal.z)>.5?Math.abs(relative.x*normal.x+relative.y*normal.y+relative.z*normal.z):Math.hypot(relative.x,relative.y,relative.z);
    contacts.push({key,impulse:e.totalForceMagnitude()*dt,closing,damageScale:Math.max(...specs.map(s=>s.damageScale)),point,poses,velocities});
   });
   frames.push({time:tick*dt,contacts});
  }
  return{frames,specs};
 }finally{queue.free();for(const car of cars)world.removeVehicleController(car.controller);world.free();}
}

function legacyDamage(frames:ReturnType<typeof recordedCrash>['frames'],scale=1){
 const seen=new Map<string,number>();let damage=0;
 for(const frame of frames)for(const c of frame.contacts){
  if(frame.time-(seen.get(c.key)??-100)<.28||c.closing<.65||c.impulse<1500)continue;
  seen.set(c.key,frame.time);const received=structuralDamage(c.impulse,c.closing)*scale;if(received>=.1)damage+=received;
 }
 return damage;
}

test('real Tern and Hatch weak-then-hard collisions receive damage previously lost to the contact cooldown',()=>{
 for(const kind of ['tern','hatch']as const){
  const {frames}=recordedCrash(kind,0,'z'),judge=new ImpactAdjudicator();
  const events=frames.flatMap(f=>f.contacts.map(c=>({...c,time:f.time,damage:structuralDamage(c.impulse,c.closing)})));
  const weak=events.find(e=>e.impulse>=1500&&e.closing>=.65)!;
  const hard=events.find(e=>e.time>weak.time&&e.time-weak.time<.28&&e.damage>3)!;
  assert.ok(weak.damage<.1,kind+' first contact is not health damage');assert.ok(hard,kind+' later physical contact is damaging');assert.equal(legacyDamage(frames),0);
  const decisions=frames.flatMap(f=>judge.adjudicate(f.contacts,f.time));
  assert.ok(decisions.some(d=>d.damage>3&&!d.feedback),kind+' crash damages despite the earlier tap sound');
  assert.equal(decisions.filter(d=>d.damage>0).length,1,kind+' simultaneous rail contacts do not multiply damage');
 }
});

test('all eleven cars with stock and fitted armor adjudicate real compound contacts once and retain armor/component scaling',()=>{
 for(const kind of CAR_KINDS)for(const armor of [0,3])for(const axis of ['x','z']as const){
  const {frames,specs}=recordedCrash(kind,armor,axis),judge=new ImpactAdjudicator(),components=[freshComponents(),freshComponents()];
  const health=[100,100];let applied=0;
  for(const frame of frames){
   const decisions=judge.adjudicate(frame.contacts,frame.time);assert.ok(decisions.length<=1,`${kind}/${armor}/${axis} compound body pair`);
   for(const decision of decisions){if(decision.damage===0)continue;applied++;
    const {contact,damage}=decision;assert.ok(frame.contacts.includes(contact));
    near(damage,Math.max(...frame.contacts.filter(c=>c.impulse>=1500&&c.closing>=.65).map(c=>structuralDamage(c.impulse,c.closing))));
    for(let i=0;i<2;i++){
     const received=damage*specs[i].damageScale;if(received<.1)continue;
     const {p,q}=contact.poses[i],inverse={x:-q.x,y:-q.y,z:-q.z,w:q.w},point=rotateVehicleVector({x:contact.point.x-p.x,y:contact.point.y-p.y,z:contact.point.z-p.z},inverse),va=contact.velocities[i],vb=contact.velocities[1-i],direction=rotateVehicleVector({x:vb.x-va.x,y:vb.y-va.y,z:vb.z-va.z},inverse);
     health[i]-=received;applyComponentImpact(components[i],i?'buggy':kind,point,direction,received);assert.ok(validComponents(components[i]));
    }
   }
  }
  assert.ok(applied>0,`${kind}/${armor}/${axis} actual crash damages`);assert.ok(health.every(h=>h<99.9&&h>0));near(health[0],health[1]);
 }
});

test('production authority applies the later Tern/Hatch crash and starts fresh cooldowns after restoring a saved event',()=>{
 const humans=new Set([0,1,2,3,4,5,6,7]);
 for(const kind of ['tern','hatch']as const){
  const sim=new Simulation(R,'playground',[kind,'buggy']);sim.phase='playing';sim.world.gravity={x:0,y:0,z:0};sim.cars.slice(2).forEach(c=>c.body.setEnabled(false));
  sim.cars.slice(0,2).forEach((car,i)=>{
   const p={x:0,y:10,z:i?6.17:0},q={x:0,y:i?1:0,z:0,w:i?0:1},v={x:0,y:0,z:i?-20:20};
   car.body.setTranslation(p,true);car.body.setRotation(q,true);car.body.setLinvel(v,true);car.body.setAngvel({x:0,y:0,z:0},true);
   Object.assign(car.state,{p,q,v,av:{x:0,y:0,z:0}});
  });
  const saved:Snapshot={...sim.snapshot(true),members:[],ack:{}},forces:{time:number;impulse:number}[]=[],drain=sim.queue.drainContactForceEvents.bind(sim.queue);
  sim.queue.drainContactForceEvents=callback=>drain(e=>{forces.push({time:sim.elapsed,impulse:e.totalForceMagnitude()*dt});callback(e);});
  try{
   for(let run=0;run<2;run++){
    if(run){sim.restore(saved);forces.length=0;}
    for(let tick=0;tick<15;tick++)sim.step(humans);
    const first=forces.find(e=>e.impulse>=1500)!,hard=forces.find(e=>e.time>first.time&&e.time-first.time<.28&&e.impulse>7000)!;
    assert.ok(first&&first.impulse<3232,`${kind} first physical impulse must be too small for .1 health damage`);assert.ok(hard,`${kind} fixture must include a harder later impact`);
    assert.equal(sim.damage.length,2,`${kind} run ${run}: one damaging contact records one event per car`);
    assert.ok(sim.damage.every(e=>e.damage>3),`${kind} run ${run}: actual authority must apply the later crash`);
    assert.ok(sim.cars.slice(0,2).every(c=>c.state.health<97));near(sim.cars[0].state.health,sim.cars[1].state.health);
    assert.ok(sim.damage.every(e=>e.tick*dt-first.time<.28));
   }
  }finally{sim.dispose();}
 }
});

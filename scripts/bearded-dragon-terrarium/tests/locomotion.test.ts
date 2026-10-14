import test from 'node:test';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import * as THREE from 'three';
import {SimulationClock} from '../lib/SimulationClock';
import {Surface} from '../lib/Surface';
import {groundHeight} from '../lib/Ground';
import {LizardRig} from '../lib/LizardRig';
import {Footholds} from '../lib/Footholds';
import {PoseInterpolation} from '../lib/PoseInterpolation';
import {habitat, model, Audit, SkinAudit} from './locomotion-fixture';

test('resting on the basking rock settles without alternating vertical corrections',()=>{
  const {rig,brain}=habitat(),r=rig as any,b=brain as any;
  b.boredom=1e6;
  let previous=0,maxDelta=0,min=Infinity,max=-Infinity;
  const audit=new Audit();
  for(let i=0;i<300;i++){
    b.update(1/60);
    if(i>=180){
      if(previous)maxDelta=Math.max(maxDelta,Math.abs(r.bodyY-previous));
      previous=r.bodyY;min=Math.min(min,r.bodyY);max=Math.max(max,r.bodyY);
      audit.sample(rig);
    }
  }
  assert.ok(maxDelta<.00005,`resting vertical correction ${maxDelta} m per tick`);
  assert.ok(max-min<.00015,`resting height range ${max-min} m`);
  assert.ok(audit.maxSlide<.0001,'settling still preserves planted contacts');
});

test('an exact foothold avoids scanning inferior patches without changing the landing',()=>{
  let casts=0;
  const finder=new Footholds({heightAt:()=>0,normalAt:(_x,_z,out=new THREE.Vector3())=>out.set(0,1,0),
    supportAt:(_x,_z,_ceiling,out)=>{casts++;out.y=0;out.normal.set(0,1,0);return out;}});
  const wanted=new THREE.Vector3(.02,0,.03);
  const hold=finder.find(wanted,new THREE.Vector3(0,.03,0),.1,0,1);
  assert.ok(hold);assert.ok(hold.point.equals(wanted));
  assert.equal(casts,5,'one landing and its four sole samples are sufficient');
});

test('simulation keeps real time at 10, 15, 30, 60, 144 Hz and uneven cadence; suspended tabs do not catch up',()=>{
  const run=(pattern:number[])=>{const clock=new SimulationClock();let elapsed=0,steps=0,x=0,v=0;
    for(let i=0;elapsed<3-1e-10;i++){const dt=Math.min(pattern[i%pattern.length],3-elapsed);elapsed+=dt;clock.advance(dt,h=>{v+=(.1-v)*(1-Math.exp(-h*5));x+=v*h;steps++;});}
    return {steps,x,v};};
  const expected=run([1/60]);
  for(const p of [[1/10],[1/15],[1/30],[1/144],[.008,.083,.019,.012,.061]])assert.deepEqual(run(p),expected);
  const clock=new SimulationClock();let steps=0;clock.advance(30,()=>steps++);assert.equal(steps,3);
});

test('a ray starting inside wood cannot mistake its underside for a foothold',()=>{
  const wood=new THREE.Mesh(new THREE.BoxGeometry(.08,.04,.08),new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));
  wood.position.set(0,.19,0);
  const surface=new Surface(new THREE.Mesh(),[{mesh:wood,kind:2}],.02);
  const sample=(y:number)=>surface.cast(0,0,y,{y:0,normal:new THREE.Vector3()});
  assert.ok(Math.abs(sample(.19).y-.21)<1e-6,'inside the solid resolves to its top');
  assert.ok(sample(.19).normal.y>.99);
  assert.ok(Math.abs(sample(.14).y-groundHeight(0,0))<1e-6,'a genuinely overhead branch is not the floor');
});

test('unreachable motion requests cannot teleport the body or drag planted feet',()=>{
  const rig=new LizardRig(model(),{heightAt:()=>0,normalAt:(_x,_z,out=new THREE.Vector3())=>out.set(0,1,0)});
  rig.update(1/120);const before=rig.spinePoints()[3].clone(),audit=new Audit();audit.sample(rig);
  rig.inputs.x+=.5;rig.inputs.heading+=Math.PI;rig.update(1/120);audit.sample(rig);
  assert.ok(before.distanceTo(rig.spinePoints()[3])<.004);
  assert.ok(audit.maxSlide<1e-6);
  assert.ok(audit.maxLimbError<.0001);
});

test('head clearance and looking around cannot lift the shoulder away from planted forefeet',()=>{
  const rig=new LizardRig(model(),{heightAt:(x)=>x>.08?.025:0,normalAt:(_x,_z,out=new THREE.Vector3())=>out.set(0,1,0)});
  rig.inputs.clearance=.7;rig.update(1/120);const audit=new Audit();
  for(let i=0;i<480;i++){
    rig.inputs.look=new THREE.Vector3(.2,.03+Math.sin(i/30)*.12,Math.cos(i/60)*.15);rig.update(1/120);audit.sample(rig);
  }
  assert.ok(audit.maxSlide<.0001);assert.ok(audit.maxLimbError<.0001);
});

test('the complete habitat supports a continuous tour with real planted feet', {timeout:600000},t=>{
  let seed=12345;const random=Math.random;Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  try{
    const a=habitat(),r=a.rig,b=a.brain as any,audit=new Audit(),skin=new SkinAudit(a.lizard);
    const presentation=new PoseInterpolation(a.lizard.bones);
    const drink=b.drinkSpot(); assert.ok(drink,'a dry drinking approach is available');
    b.dish={centre:new THREE.Vector3(-.58,groundHeight(-.58,.362),.362)};
    const food=b.grazeSpot();assert.ok(food,'a feeding approach is available');
    const tour:[string,number,number,number][]=[['descent',.25,.25,100],['hide',.46,-.04,70],['water',drink[0],drink[1],70],['food',food[0],food[1],110],['ascent',b.baskSpot[0],b.baskSpot[1],140]];
    const chamber=new THREE.Vector3(.45624559135,.0980293264,.01907923147), projected=chamber.clone();
    a.surface.tailContacts.projectPoint(chamber,projected,0,new THREE.Vector3());
    assert.ok(chamber.distanceTo(projected)<1e-6,'the open cave chamber is not a solid volume');
    const results:any[]=[];let frame=0;
    const report=(current:any)=>{if(process.env.LOCOMOTION_REPORT)writeFileSync(process.env.LOCOMOTION_REPORT,JSON.stringify({results,current,state:{mode:b.mode,pose:(r as any).accepted,blocked:r.blocked,error:(r as any).supportError(),legs:(r as any).legs.map((l:any)=>({front:l.front,side:l.side,swing:l.swing,phase:l.swingT,stall:l.swingStall,planted:l.planted.toArray(),target:l.to.toArray()}))},audit:audit.report(),skin:{penetration:skin.maxPenetration,worst:skin.worst,samples:skin.samples}},null,2));};
    for(const [name,x,z,limit] of tour){
      assert.ok(b.goTo(x,z,'idle'),`${name} has a planned route`);b.hurry=true;b.boredom=1e6;
      const goal=[...b.goal];let arrived=false,seconds=0;
      for(let i=0;i<limit*60;i++){
        b.update(1/60);audit.sample(r,a.surface);
        presentation.capture();
        if(frame%6===0){
          skin.sample(r,a.surface,frame);
          presentation.render(.5,()=>skin.sample(r,a.surface,frame),()=>a.lizard.syncAttachments());
        }
        frame++;
        seconds=(i+1)/60;
        if(i%600===0)report({name,seconds,x:r.inputs.x,z:r.inputs.z});
        if(b.mode==='idle' && Math.hypot(r.inputs.x-goal[0],r.inputs.z-goal[1])<.06){arrived=true;break;}
      }
      const result={name,arrived,seconds,x:r.inputs.x,z:r.inputs.z};results.push(result);t.diagnostic(JSON.stringify(result));
      report(result);
      if(!arrived)break;
    }
    t.diagnostic(JSON.stringify({audit:audit.report(),skin:{penetration:skin.maxPenetration,worst:skin.worst,samples:skin.samples}}));
    assert.equal(results.length,tour.length,'the whole tour completed');
    assert.ok(results.every(r=>r.arrived),'no route leaves the animal permanently stuck');
    assert.ok(audit.maxSlide<.0001,'stance does not slide');
    assert.ok(audit.maxFloat<.0005 && audit.maxPenetration<.0005,'every planted sole belongs to an actual surface');
    assert.ok(audit.maxLimbError<.00015,'contact does not stretch the sculpted limbs');
    assert.ok(audit.maxJump<.004,'no discontinuous body movement at a 60 Hz step');
    assert.ok(skin.maxPenetration<.003,`visible limb penetration ${skin.maxPenetration} m`);
  } finally {Math.random=random;}
});

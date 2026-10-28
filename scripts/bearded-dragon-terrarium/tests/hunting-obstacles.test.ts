import test from 'node:test';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import * as THREE from 'three';
import {Cricket} from '../lib/Insects';
import {habitat,Audit,SkinAudit} from './locomotion-fixture';

function cricket(x:number,y:number,z:number){
  const g=new THREE.SphereGeometry(.001,4,2),m=new THREE.MeshBasicMaterial();
  return new Cricket(new THREE.Vector3(x,y,z),{body:g,wing:g,eye:g,seg:g,femur:g,spines:g,antenna:g,cercus:g,ovipositor:g,mats:{body:m,femur:m,wing:m,eye:m,leg:m,dark:m}});
}
function restingCricket(x:number,y:number,z:number){
  const c=cricket(x,y,z);
  c.airborne=false;c.heading=0;
  // Isolate obstacle negotiation from prey escape. The separate hunting tests
  // exercise the real moving/hopping controller; capture still needs contact.
  c.startle=()=>{};return c;
}

test('a nearby cricket cannot interrupt the straight exit from the hide',()=>{
  const a=habitat(),b=a.brain as any,r=a.rig,I=r.inputs;
  Object.assign(I,{x:.485,z:.08,heading:-Math.PI/2});r.reset();
  const c=restingCricket(r.mouth.x,r.mouth.y,r.mouth.z);
  b.startHunt(c);b.huntPhase='approach';
  const movement=b.hunt(1/60);
  assert.equal(b.caveExit,1);assert.equal(b.huntPhase,'approach');
  assert.ok(movement.speed>0,'clear the hind feet before fixation or a strike');
  assert.ok(Math.abs(movement.turn)<.05,'retain the doorway alignment');
});

test('a blocked final approach withdraws before choosing a new side of the prey',()=>{
  const a=habitat(),b=a.brain as any,I=a.rig.inputs;
  Object.assign(I,{x:.08,z:.35,heading:0});a.rig.reset();
  const c=restingCricket(.24,a.surface.heightAt(.24,.35),.35);b.startHunt(c);
  Object.assign(b,{huntPhase:'approach',path:[[.08,.35]],pathI:1,goal:[.08,.35],huntPrey:[.24,.35],stallT:2,speed:.1});
  const movement=b.hunt(1/60);
  assert.ok(movement.speed<0,'back out even after reaching the route endpoint');
  assert.ok(b.retreatT>0);assert.equal(b.huntPrey,null,'plan a different approach after clearing the blocked stance');
});

test('a cricket escaping across the basking ledge is pursued or left safely',{timeout:120000},t=>{
  const random=Math.random;let seed=37;
  Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  try{
    const a=habitat(),b=a.brain as any,r=a.rig as any,I=r.inputs,audit=new Audit();b.boredom=1e6;
    for(let i=0;i<180;i++)b.update(1/60);
    const p=a.nav.nearestWalkable(r.snout.x+.09,r.snout.z+.065,a.nav.mainRegion)!;
    const c=cricket(p[0],.61,p[1]);let started=false,seconds=0,maxSwing=0,closest=Infinity;const swings=[0,0,0,0];
    for(let i=0;i<47*60&&!c.caught;i++){
      c.update(1/60,a.surface,a.nav);
      if(!started&&!c.airborne){b.startHunt(c);started=true;}
      b.update(1/60);audit.sample(r,a.surface);seconds=(i+1)/60;
      closest=Math.min(closest,r.mouth.distanceTo(c.pos));
      for(const [k,l] of r.legs.entries()){swings[k]=l.swing?swings[k]+1/60:0;maxSwing=Math.max(maxSwing,swings[k]);}
      if(b.huntGoal){const [x,z]=b.huntGoal;assert.ok(!(x<-.20&&z>.105&&z<.27&&a.surface.heightAt(x,z)>.12),'do not turn or strike from the unsupported arch lip');}
      if(started&&b.mode!=='hunt')break;
    }
    t.diagnostic(JSON.stringify({scenario:'escaping ledge prey',caught:c.caught,seconds,closest,maxSwing,status:b.status}));
    assert.ok(started&&closest<.065,'make a real supported approach before the insect escapes');
    assert.ok(c.caught||b.status==='Watching escaped prey','capture by contact or finish a bounded chase without an endless retry');
    if(!c.caught)assert.equal(b.canHunt(c),false,'remember the escaped insect rather than immediately restarting');
    assert.ok(maxSwing<2.5,'a leg cannot remain suspended at the ledge');
    assert.ok(audit.maxSlide<.0001&&audit.maxFloat<.0005&&audit.maxPenetration<.0005,'planted soles keep real contact');
    assert.ok(audit.maxJump<.01&&audit.maxLimbError<.00015,'no body jumps or stretched limbs');
  }finally{Math.random=random;}
});

test('hunts around the hide, log and ledges retain contact and upright forelegs',{timeout:300000},t=>{
  const random=Math.random,results:any[]=[];
  const cases=[
    {name:'hide exit',start:[.485,-.03,-Math.PI/2],prey:[.24,.26],visit:true},
    {name:'turn beside hide',start:[.485,.23,-Math.PI/2],prey:[.28,.25]},
    {name:'cricket at doorway',start:[.28,.25,0],prey:[.53,.12]},
    {name:'log end',start:[.2,.30,Math.PI],prey:[-.1,.18]},
    {name:'rock approach',start:[-.08,.24,Math.PI],prey:[-.4,.12],walkIn:true},
  ];
  const selected=cases.filter(c=>!process.env.OBSTACLE_CASE||c.name===process.env.OBSTACLE_CASE);
  assert.ok(selected.length,'the requested obstacle scenario exists');
  try{for(const scenario of selected){
    let seed=41;Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    const a=habitat(),b=a.brain as any,r=a.rig as any,I=r.inputs,audit=new Audit(),skin=new SkinAudit(a.lizard,true);
    b.boredom=1e6;
    if(scenario.visit){
      assert.ok(b.goTo(.46,-.04,'idle'));b.hurry=true;
      for(let i=0;i<100*60&&b.mode==='travel';i++)b.update(1/60);
      assert.ok(Math.abs(I.x-.485)<.04&&I.z<.02,'begin from a physically reached cave rest');
    }else if(scenario.walkIn){
      // A walkable root cell does not imply that an arbitrary heading has a
      // valid four-foot stance. Reach this uneven edge through actual steps,
      // rather than initializing a foreleg twelve millimetres beyond its length.
      Object.assign(I,{x:.08,z:.35,heading:Math.PI,clearance:.95,chestLift:.15});r.reset();
      assert.ok(b.goTo(scenario.start[0],scenario.start[1],'idle'));b.hurry=true;
      for(let i=0;i<90*60&&b.mode==='travel';i++)b.update(1/60);
      assert.equal(b.mode,'idle','walk to the rock approach');
      assert.ok(Math.hypot(I.x-scenario.start[0],I.z-scenario.start[1])<.04,'reach the intended starting area');
      for(let i=0;i<60;i++)b.update(1/60);
    }else{
      const p=a.nav.nearestWalkable(scenario.start[0],scenario.start[1],a.nav.mainRegion)!;
      Object.assign(I,{x:p[0],z:p[1],heading:scenario.start[2],clearance:.95,chestLift:.15});r.reset();
    }
    if(!scenario.walkIn)for(let i=0;i<60;i++)r.update(1/60);
    const initial=new Audit();initial.sample(r,a.surface);
    assert.ok(initial.maxLimbError<.00015,`${scenario.name}: begin with physically reachable supports`);
    const [x,z]=a.nav.nearestWalkable(scenario.prey[0],scenario.prey[1],a.nav.mainRegion)!;
    const c=restingCricket(x,a.surface.heightAt(x,z),z);b.startHunt(c);
    let seconds=0,still=0,maxStill=0,px=I.x,pz=I.z,maxSwing=0,maxFootStall=0,minPalmUp=1,minElbow=1,maxRotation=0;
    const swings=[0,0,0,0],rotations=new Map<number,THREE.Quaternion>();
    for(let frame=0;frame<60*60&&!c.caught&&b.mode==='hunt';frame++){
      b.update(1/60);audit.sample(r,a.surface);seconds=(frame+1)/60;
      if(frame%12===0)skin.sample(r,a.surface,frame);
      if(Math.hypot(I.x-px,I.z-pz)>.002||b.status==='Watching the cave entrance'){still=0;px=I.x;pz=I.z;}else still+=1/60;
      maxStill=Math.max(maxStill,still);
      if(process.env.OBSTACLE_REPORT&&frame%300===0)writeFileSync(process.env.OBSTACLE_REPORT,JSON.stringify({results,current:{name:scenario.name,seconds,root:[I.x,I.z,I.heading],status:b.status,still,maxStill,maxSwing}},null,2));
      for(const [k,l] of r.legs.entries()){
        swings[k]=l.swing?swings[k]+1/60:0;maxSwing=Math.max(maxSwing,swings[k]);
        maxFootStall=Math.max(maxFootStall,l.swingStall);
        if(!l.front)continue;
        const hand=a.lizard.bones[l.data.bones.hand].matrix;
        minPalmUp=Math.min(minPalmUp,new THREE.Vector3().setFromMatrixColumn(hand,1).normalize().y);
        const S=new THREE.Vector3().setFromMatrixPosition(a.lizard.bones[l.data.bones.upper].matrix);
        const E=new THREE.Vector3().setFromMatrixPosition(a.lizard.bones[l.data.bones.lower].matrix);
        const W=new THREE.Vector3(0,.35,0).applyMatrix4(hand),direction=W.sub(S).normalize();
        const elbow=E.sub(S);elbow.addScaledVector(direction,-elbow.dot(direction)).normalize();
        const reference=new THREE.Vector3(-1,-.15,0).transformDirection(r.spineFrame[2]);
        reference.addScaledVector(direction,-reference.dot(direction));
        if(reference.lengthSq()>.0144)minElbow=Math.min(minElbow,elbow.dot(reference.normalize()));
        for(const id of [l.data.bones.upper,l.data.bones.lower,l.data.bones.hand]){
          const q=new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(a.lizard.bones[id].matrix)),old=rotations.get(id);
          if(old)maxRotation=Math.max(maxRotation,q.angleTo(old));rotations.set(id,q);
        }
      }
    }
    const result={name:scenario.name,caught:c.caught,seconds,maxStill,maxSwing,maxFootStall,minPalmUp,minElbow,maxRotation,audit:audit.report(),skin:{penetration:skin.maxPenetration,worst:skin.worst}};
    results.push(result);t.diagnostic(JSON.stringify({name:scenario.name,caught:c.caught,seconds,maxStill,maxSwing,minPalmUp,minElbow,slide:audit.maxSlide}));
    if(process.env.OBSTACLE_REPORT)writeFileSync(process.env.OBSTACLE_REPORT,JSON.stringify({results},null,2));
    assert.ok(c.caught,`${scenario.name}: physically reaches and captures resting prey`);
    assert.ok(maxStill<4,`${scenario.name}: no prolonged navigation stall`);
    assert.ok(maxSwing<2.5,`${scenario.name}: no indefinitely suspended or pumping foot`);
    assert.ok(audit.maxSlide<.0001&&audit.maxFloat<.0005&&audit.maxPenetration<.0005,'fixed soles stay on their supports');
    assert.ok(audit.maxJump<.01&&audit.maxLimbError<.00015,'continuous body motion and intact limb lengths');
    assert.ok(skin.maxPenetration<.003,'the rendered toes and limbs clear the hardscape');
    assert.ok(minPalmUp>.45&&minElbow>.15,'palms face the support and elbows retain their anatomical bend');
    assert.ok(maxRotation<Math.PI/2,'no sudden half-turn of a foreleg');
  }}finally{Math.random=random;}
});

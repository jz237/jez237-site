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

test('a blocked chase reserves time to reposition instead of switching between nearby insects',()=>{
  const a=habitat(),b=a.brain as any,I=a.rig.inputs;
  Object.assign(I,{x:.08,z:.35,heading:0});a.rig.reset();
  b.bodyTemp=.6;b.needs.satiety=.2;b.needs.fatigue=.1;
  const first=restingCricket(.24,a.surface.heightAt(.24,.35),.35);
  const next=restingCricket(.26,a.surface.heightAt(.26,.35),.35);
  assert.ok(b.canHunt(next),'the second insect is normally visible and reachable');
  b.startHunt(first);b.huntPhase='approach';b.huntNoProgress=4.1;
  b.huntProgressAt.set(I.x,I.z,I.heading);b.hunt(1/60);
  assert.equal(b.mode,'idle');assert.equal(b.canHunt(next),false,'a different insect cannot immediately cancel reassessment');
  assert.equal(b.ignorePrey.get(next),undefined,'the new insect is not falsely remembered as unreachable');
  assert.ok(b.goTo(.35,.32,'idle'));b.insects.nearest=()=>next;
  for(let i=0;i<30;i++)b.update(1/60);
  assert.equal(b.mode,'travel','automatic prey attention leaves the repositioning route in control');
  b.t=b.huntReassessUntil+.1;
  assert.ok(b.canHunt(next),'attention resumes after the bounded reassessment period');
});

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

test('backing into the hide aligns first and releases the rearward destination gaze',()=>{
  const a=habitat(),b=a.brain as any,I=a.rig.inputs;
  Object.assign(I,{x:.485,z:.28,heading:-Math.PI/2+.2,look:new THREE.Vector3(.485,.1,-.035)});a.rig.reset();
  Object.assign(b,{caveApproach:true,caveBacking:true,goal:[.485,-.035]});
  const turn=b.travel(1/60);
  assert.equal(turn.speed,0,'align outside before backing under the arch');
  assert.equal(I.look,null,'keep the head facing the opening');
  I.heading=-Math.PI/2;
  assert.ok(b.travel(1/60).speed<0,'back in once aligned');
});

test('searching beyond a ledge retains the stationary-prey budget and still ends',()=>{
  const a=habitat(),b=a.brain as any,I=a.rig.inputs;
  const c=restingCricket(-.4,.276,.12);b.startHunt(c);
  Object.assign(b,{huntPhase:'approach',huntElapsed:50,huntDistance:0,huntNoProgress:0,preyVisible:false,sightT:1,retreatT:1});
  b.observation.position.copy(c.pos);b.observation.age=10;b.huntProgressAt.set(I.x,I.z,I.heading);
  b.hunt(1/60);
  assert.equal(b.mode,'hunt','a supported climb may continue toward the last seen stationary insect');
  b.huntElapsed=91;b.sightT=1;b.observation.age=10;b.hunt(1/60);
  assert.equal(b.mode,'idle','the remembered stationary location does not support an unbounded search');
});

test('a blocked final approach withdraws before choosing a new side of the prey',()=>{
  const a=habitat(),b=a.brain as any,I=a.rig.inputs;
  Object.assign(I,{x:.08,z:.35,heading:0});a.rig.reset();
  const c=restingCricket(.24,a.surface.heightAt(.24,.35),.35);b.startHunt(c);
  Object.assign(b,{huntPhase:'approach',path:[[.08,.35]],pathI:1,goal:[.08,.35],huntPrey:[.24,.35],stallT:2,speed:.1});
  const movement=b.hunt(1/60);
  assert.ok(movement.speed<0,'back out even after reaching the route endpoint');
  assert.ok(b.retreatT>0);assert.equal(b.huntPrey,null,'plan a different approach after clearing the blocked stance');
  assert.equal(I.look,null,'a flat-ground withdrawal releases prey gaze so the jaw cannot pin recovery');
});

test('finishing a climb after spotting prey still detects a blocked advance',()=>{
  const a=habitat(),b=a.brain as any,r=a.rig as any,I=r.inputs;
  r.update(1/60);
  assert.ok(b.goTo(.25,.25,'idle'));
  const goal=[...b.goal],c=restingCricket(-.25,.25,.1);
  Object.defineProperty(r,'canRedirect',{get:()=>false});
  b.startHunt(c);b.pauseT=0;b.leadT=0;
  assert.equal(b.huntDeparture,true,'the existing climb retains motion ownership');
  const held={x:I.x,z:I.z,heading:I.heading};
  r.update=()=>Object.assign(I,held);
  let recovered=false;
  for(let i=0;i<150;i++){b.update(1/60);recovered ||= b.retreatT>0;}
  assert.ok(recovered,'notice-phase climb departure must receive the same stall recovery as walking');
  assert.deepEqual(b.goal,goal,'a recovery retains the supported departure destination');
});

test('leaving an oblique food-tray approach chooses open sand before turning',()=>{
  const a=habitat(),b=a.brain as any,I=a.rig.inputs;
  b.dish={centre:new THREE.Vector3(-.58,.075,.362)};
  Object.assign(I,{x:-.553,z:.277,heading:4.544});a.rig.reset();
  assert.ok(b.goTo(.475,.335,'drink'));
  assert.ok(b.bowlExit,'a side approach also reserves clearance for the head');
  const movement=b.travel(1/60);
  assert.ok(movement.speed===0&&b.lateralRequest<0&&Math.abs(movement.turn)<.01,'step sideways when stone blocks the backward route');
  assert.ok(a.nav.lineClear(I.x,I.z,b.bowlExit.x,b.bowlExit.z,Infinity),'withdraw toward verified open sand');
  assert.ok(Math.hypot(b.bowlExit.x-I.x,b.bowlExit.z-I.z)>.07);
});

test('resting after a hunt retains contact recovery and defers another chase',()=>{
  const a=habitat(),b=a.brain as any,r=a.rig,I=r.inputs;
  b.boredom=1e6;b.mode='idle';b.modeT=0;b.holdFor=60;
  Object.defineProperty(r,'needsRecovery',{get:()=>true});
  b.update(1/60);
  assert.equal(b.mode,'idle','the intended resting activity remains intact');
  assert.ok((b.retreatT>0||b.pivotRecovery)&&Math.abs(I.speed)+Math.abs(I.lateralSpeed??0)+Math.abs(I.turnRate)>0,'the root still requests a supported recovery');
  const c=restingCricket(-.5,a.surface.heightAt(-.5,0),0);
  assert.equal(b.canHunt(c),false,'a fresh insect cannot cancel physical recovery');
  assert.equal(r.canPickUpPrey,false,'finish recovery before committing to a strike');
});

test('a cricket escaping across the basking ledge is pursued or left safely',{timeout:120000},t=>{
  const random=Math.random;let seed=37;
  Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  try{
    const a=habitat(),b=a.brain as any,r=a.rig as any,I=r.inputs,audit=new Audit();b.boredom=1e6;
    for(let i=0;i<180;i++)b.update(1/60);
    const p=a.nav.nearestWalkable(r.snout.x+.09,r.snout.z+.065,a.nav.mainRegion)!;
    const c=cricket(p[0],.61,p[1]);let started=false,seconds=0,maxSwing=0,closest=Infinity,travel=0;const swings=[0,0,0,0];
    for(let i=0;i<47*60&&!c.caught;i++){
      c.update(1/60,a.surface,a.nav);
      if(!started&&!c.airborne){b.startHunt(c);started=true;}
      const x=I.x,z=I.z;b.update(1/60);travel+=Math.hypot(I.x-x,I.z-z);audit.sample(r,a.surface);seconds=(i+1)/60;
      closest=Math.min(closest,r.mouth.distanceTo(c.pos));
      for(const [k,l] of r.legs.entries()){swings[k]=l.swing?swings[k]+1/60:0;maxSwing=Math.max(maxSwing,swings[k]);}
      if(b.huntGoal){const [x,z]=b.huntGoal;assert.ok(!(x<-.20&&z>.105&&z<.27&&a.surface.heightAt(x,z)>.12),'do not turn or strike from the unsupported arch lip');}
      if(started&&b.mode!=='hunt')break;
    }
    t.diagnostic(JSON.stringify({scenario:'escaping ledge prey',caught:c.caught,seconds,closest,travel,maxSwing,status:b.status}));
    // With mesh occlusion an escaping insect can disappear before pickup
    // range. Require an actual supported pursuit and a bounded, remembered
    // abandonment; approaching an unseen insect within 65 mm is not required.
    assert.ok(started&&(c.caught||travel>.15&&closest<.10),'make a real supported approach before the insect escapes');
    assert.ok(c.caught||b.mode==='idle'&&b.ignorePrey.has(c),'capture by contact or remember the escaped prey after ending the chase');
    if(!c.caught)assert.equal(b.canHunt(c),false,'remember the escaped insect rather than immediately restarting');
    assert.ok(maxSwing<2.5,'a leg cannot remain suspended at the ledge');
    assert.ok(audit.maxSlide<.0001&&audit.maxFloat<.0005&&audit.maxPenetration<.0005,'planted soles keep real contact');
    assert.ok(audit.maxJump<.01&&audit.maxLimbError<.00015,'no body jumps or stretched limbs');
  }finally{Math.random=random;}
});

test('the dragon physically clears an oblique tray stance before crossing the sand',{timeout:120000},t=>{
  const random=Math.random;let seed=41;
  Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  try{
    const a=habitat(),b=a.brain as any,r=a.rig,I=r.inputs,audit=new Audit(),skin=new SkinAudit(a.lizard,true);
    b.boredom=1e6;b.dish={centre:new THREE.Vector3(-.58,.075,.362)};
    Object.assign(I,{x:-.553,z:.277,heading:4.544,clearance:.95,chestLift:.15});r.reset();
    for(let i=0;i<60;i++)r.update(1/60);
    assert.ok(b.goTo(.475,.335,'drink'));b.hurry=true;
    let seconds=0,still=0,maxStill=0,maxSwing=0,px=I.x,pz=I.z,heading=I.heading;
    const swings=[0,0,0,0];
    for(let i=0;i<60*60&&b.mode==='travel';i++){
      b.update(1/60);audit.sample(r,a.surface);if(i%12===0)skin.sample(r,a.surface,i);
      seconds=(i+1)/60;
      if(Math.hypot(I.x-px,I.z-pz)>.001||Math.abs(Math.atan2(Math.sin(I.heading-heading),Math.cos(I.heading-heading)))>.02){still=0;px=I.x;pz=I.z;heading=I.heading;}else still+=1/60;
      maxStill=Math.max(maxStill,still);
      for(const [k,l] of (r as any).legs.entries()){swings[k]=l.swing?swings[k]+1/60:0;maxSwing=Math.max(maxSwing,swings[k]);}
    }
    t.diagnostic(JSON.stringify({scenario:'oblique tray withdrawal',seconds,maxStill,maxSwing,root:[I.x,I.z]}));
    assert.ok(Math.hypot(I.x-.475,I.z-.335)<.04,'clear the tray and actually reach the water across the sand');
    assert.ok(maxStill<5&&maxSwing<2.5,'the complete journey cannot stall or leave a foot suspended');
    assert.ok(audit.maxSlide<.0001&&audit.maxFloat<.0005&&audit.maxPenetration<.0005,'withdraw on planted supports');
    assert.ok(audit.maxJump<.004&&audit.maxLimbError<.00015,'retain continuous motion and anatomical reach');
    assert.ok(skin.maxPenetration<.003,'the actual rendered body clears the tray');
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
      for(let i=0;i<100*60&&b.mode==='travel';i++){
        b.update(1/60);
        if(process.env.OBSTACLE_REPORT&&i%300===0)writeFileSync(process.env.OBSTACLE_REPORT,JSON.stringify({results,current:{name:'enter hide before hunt',seconds:i/60,root:[I.x,I.z,I.heading],status:b.status,pathI:b.pathI,path:b.path,pose:r.poseState(),error:r.supportError(),legs:r.legs.map((l:any)=>({front:l.front,side:l.side,swing:l.swing,phase:l.swingT,returning:l.returning,settling:l.settling,stall:l.swingStall,anchor:l.planted.toArray(),target:l.to.toArray()}))}},null,2));
      }
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
    let seconds=0,still=0,maxStill=0,px=I.x,pz=I.z,heading=I.heading,translationPause=0,maxTranslationPause=0,tx=I.x,tz=I.z,maxSwing=0,maxFootStall=0,minPalmUp=1,minElbow=1,minElbowOut=Infinity,maxElbowUp=-Infinity,maxRotation=0;
    const swings=[0,0,0,0],rotations=new Map<number,THREE.Quaternion>();let savedSnapshot=false;
    // The full rock route includes the supported ascent; ground encounters
    // retain their shorter limit. Neither permits a navigation stall.
    const encounterSeconds=scenario.walkIn?95:60;
    for(let frame=0;frame<encounterSeconds*60&&!c.caught&&b.mode==='hunt';frame++){
      b.update(1/60);audit.sample(r,a.surface);seconds=(frame+1)/60;
      if(frame%12===0)skin.sample(r,a.surface,frame);
      if(Math.hypot(I.x-tx,I.z-tz)>.002){translationPause=0;tx=I.x;tz=I.z;}else translationPause+=1/60;
      maxTranslationPause=Math.max(maxTranslationPause,translationPause);
      // A planted-foot pivot is real progress, as in the navigation/soak
      // audits. Retain translation-only pauses as a separate diagnostic.
      const turn=Math.atan2(Math.sin(I.heading-heading),Math.cos(I.heading-heading));
      if(Math.hypot(I.x-px,I.z-pz)>.002||Math.abs(turn)>.06||b.status==='Watching the cave entrance'){still=0;px=I.x;pz=I.z;heading=I.heading;}else still+=1/60;
      maxStill=Math.max(maxStill,still);
      if(process.env.OBSTACLE_REPORT&&frame%300===0){
        const current={name:scenario.name,seconds,root:[I.x,I.z,I.heading],status:b.status,still,maxStill,maxSwing,path:b.path,pathI:b.pathI,goal:b.huntGoal,look:I.look?.toArray(),maneuver:r.maneuver,retreat:b.retreatT,stall:b.stallT,pushed:b.pushedT,pivot:b.pivotRecovery,climbBacking:b.climbBacking};
        writeFileSync(process.env.OBSTACLE_REPORT,JSON.stringify({results,current},null,2));
        if(process.env.OBSTACLE_TRACE)t.diagnostic(JSON.stringify(current));
      }
      for(const [k,l] of r.legs.entries()){
        swings[k]=l.swing?swings[k]+1/60:0;maxSwing=Math.max(maxSwing,swings[k]);
        if(!savedSnapshot&&swings[k]>1.5&&process.env.OBSTACLE_SNAPSHOT){
          const encode=(v:any):any=>{
            if(!v||typeof v!=='object')return v;
            for(const name of ['Vector3','Vector2','Matrix4','Euler','Quaternion'])if(v['is'+name])return {$type:name,v:v.toArray()};
            if(Array.isArray(v))return v.map(encode);
            return Object.fromEntries(Object.entries(v).map(([key,x])=>[key,encode(x)]));
          };
          const fields=Object.fromEntries(Object.entries(r).filter(([key])=>!['model','ground','collision','footholds','tailDynamics','stepSearch'].includes(key)));
          writeFileSync(process.env.OBSTACLE_SNAPSHOT,JSON.stringify(encode(fields)));savedSnapshot=true;
        }
        maxFootStall=Math.max(maxFootStall,l.swingStall);
        if(!l.front)continue;
        const hand=a.lizard.bones[l.data.bones.hand].matrix;
        minPalmUp=Math.min(minPalmUp,new THREE.Vector3().setFromMatrixColumn(hand,1).normalize().y);
        const S=new THREE.Vector3().setFromMatrixPosition(a.lizard.bones[l.data.bones.upper].matrix);
        const E=new THREE.Vector3().setFromMatrixPosition(a.lizard.bones[l.data.bones.lower].matrix);
        const W=new THREE.Vector3(0,.35,0).applyMatrix4(hand),direction=W.sub(S).normalize();
        const upper=E.clone().sub(S);
        minElbowOut=Math.min(minElbowOut,upper.dot(r.bodyRight)*l.side);
        maxElbowUp=Math.max(maxElbowUp,upper.dot(r.bodyUp));
        const elbow=upper.clone();elbow.addScaledVector(direction,-elbow.dot(direction)).normalize();
        const reference=new THREE.Vector3(-1,-.15,0).transformDirection(r.spineFrame[2]);
        reference.addScaledVector(direction,-reference.dot(direction));
        // Near a wrist pointing along the reference, that projected vector
        // changes sides. Inspect actual elbow position throughout the stride;
        // use its angular comparison only while the projection is reliable.
        if(reference.lengthSq()>.16)minElbow=Math.min(minElbow,elbow.dot(reference.normalize()));
        for(const id of [l.data.bones.upper,l.data.bones.lower,l.data.bones.hand]){
          const q=new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(a.lizard.bones[id].matrix)),old=rotations.get(id);
          if(old)maxRotation=Math.max(maxRotation,q.angleTo(old));rotations.set(id,q);
        }
      }
    }
    const result={name:scenario.name,caught:c.caught,seconds,maxStill,maxTranslationPause,maxSwing,maxFootStall,minPalmUp,minElbow,minElbowOut,maxElbowUp,maxRotation,
      final:{root:[I.x,I.z,I.heading],mouth:r.mouth.toArray(),prey:c.pos.toArray(),mouthDistance:r.mouth.distanceTo(c.pos),status:b.status,
        noProgress:b.huntNoProgress,unseen:b.observation.age,elapsed:b.huntElapsed,observedTravel:b.huntDistance},audit:audit.report(),skin:{penetration:skin.maxPenetration,worst:skin.worst}};
    results.push(result);t.diagnostic(JSON.stringify({name:scenario.name,caught:c.caught,seconds,maxStill,maxSwing,minPalmUp,minElbow,slide:audit.maxSlide}));
    if(process.env.OBSTACLE_REPORT)writeFileSync(process.env.OBSTACLE_REPORT,JSON.stringify({results},null,2));
    assert.ok(c.caught,`${scenario.name}: physically reaches and captures resting prey`);
    assert.ok(maxStill<4,`${scenario.name}: no prolonged navigation stall`);
    assert.ok(maxSwing<2.5,`${scenario.name}: no indefinitely suspended or pumping foot`);
    assert.ok(audit.maxSlide<.0001&&audit.maxFloat<.0005&&audit.maxPenetration<.0005,'fixed soles stay on their supports');
    assert.ok(audit.maxJump<.01&&audit.maxLimbError<.00015,'continuous body motion and intact limb lengths');
    assert.ok(skin.maxPenetration<.003,'the rendered toes and limbs clear the hardscape');
    // A projected pole changes sides when the wrist passes the shoulder axis.
    // Its instantaneous sign is not an inversion test. Inspect the actual
    // palm and bone continuity; keep the pole angle in the report for review.
    assert.ok(minPalmUp>.45,'forepalms retain their support-facing orientation');
    assert.ok(maxRotation<Math.PI/2,'no sudden half-turn of a foreleg');
  }}finally{Math.random=random;}
});

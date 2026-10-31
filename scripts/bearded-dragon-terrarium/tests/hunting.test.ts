import test from 'node:test';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import * as THREE from 'three';
import {Cricket} from '../lib/Insects';
import {habitat,Audit,SkinAudit} from './locomotion-fixture';

// The real cricket controller and articulated legs, with tiny neutral meshes
// instead of its canvas-textured materials (these tests run without WebGL).
function cricket(x:number,z:number,y:number){
  const g=new THREE.SphereGeometry(.001,4,2),m=new THREE.MeshBasicMaterial();
  return new Cricket(new THREE.Vector3(x,y,z),{body:g,wing:g,eye:g,seg:g,femur:g,spines:g,antenna:g,cercus:g,ovipositor:g,mats:{body:m,femur:m,wing:m,eye:m,leg:m,dark:m}});
}

test('hunting clears old pauses while retaining safe departures from the bowls',()=>{
  const a=habitat(),b=a.brain as any,I=a.rig.inputs,c=cricket(.2,.34,.075);
  Object.assign(b,{pauseT:3,leadT:.5,retreatT:2,pushedT:4,stallT:2});
  Object.assign(I,{x:-.41,z:.35,heading:Math.PI});b.startHunt(c);
  assert.equal(b.pauseT,0);assert.equal(b.leadT,0);assert.equal(b.retreatT,0);assert.equal(b.pushedT,0);assert.equal(b.stallT,0);
  assert.equal(b.hurry,true);assert.ok(b.foodExit,'leave the food dish before pivoting');
  Object.assign(I,{x:.48,z:.33,heading:0});b.startHunt(c);
  assert.ok(b.bowlExit,'withdraw clear of the water rim before turning');
});

test('a varied moving-prey cohort is caught or escapes a bounded pursuit without sliding feet',{timeout:360000},t=>{
  const random=Math.random,results:any[]=[];
  try{
    for(const [seedValue,ledge] of [[11,false],[23,false],[41,false],[51,false],[77,false],[101,false],[37,true]] as const){
      let seed:number=seedValue;Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
      const a=habitat(),b=a.brain as any,r=a.rig,I=r.inputs,audit=new Audit(),skin=new SkinAudit(a.lizard,true);
      b.boredom=1e6;
      if(!ledge){Object.assign(I,{x:.08,z:.35,heading:0,clearance:.95,chestLift:.15,headPitch:.05});r.reset();}
      for(let i=0;i<60;i++)r.update(1/60);
      const c=cricket(ledge?-.08:.34,ledge?.24:.34,a.surface.heightAt(ledge?-.08:.34,ledge?.24:.34));
      c.airborne=false;c.heading=0;
      const initialDistance=r.mouth.distanceTo(c.pos),initialPrey=c.pos.clone();
      const initialBodyDistance=Math.hypot(I.x-initialPrey.x,I.z-initialPrey.z);let closestInitialBodyDistance=initialBodyDistance;
      b.startHunt(c);
      let seconds=0,hops=0,previousAir=false,travel=0,px=I.x,pz=I.z,peakSpeed=0,airProgress=0,closest=Infinity,maxSwing=0;
      const swings=[0,0,0,0];
      for(let frame=0;frame<65*60&&!c.caught&&b.mode==='hunt';frame++){
        c.update(1/60,a.surface,a.nav);b.update(1/60);audit.sample(r,a.surface);seconds=(frame+1)/60;
        if(frame%12===0)skin.sample(r,a.surface,frame);
        const distance=Math.hypot(I.x-px,I.z-pz);travel+=distance;peakSpeed=Math.max(peakSpeed,distance*60);if(c.airborne)airProgress+=distance;
        px=I.x;pz=I.z;if(c.airborne&&!previousAir)hops++;previousAir=c.airborne;
        closest=Math.min(closest,r.mouth.distanceTo(c.pos));
        closestInitialBodyDistance=Math.min(closestInitialBodyDistance,Math.hypot(I.x-initialPrey.x,I.z-initialPrey.z));
        for(const [k,l] of (r as any).legs.entries()){swings[k]=l.swing?swings[k]+1/60:0;maxSwing=Math.max(maxSwing,swings[k]);}
        if(process.env.HUNT_REPORT&&frame%120===0)writeFileSync(process.env.HUNT_REPORT,JSON.stringify({results,current:{seedValue,seconds,phase:b.huntPhase,status:b.status,root:[I.x,I.z],prey:c.pos.toArray(),mouth:r.mouth.toArray(),speed:I.speed,cruise:b.cruise,pause:b.pauseT,lead:b.leadT,pathI:b.pathI,paths:b.path.length}},null,2));
      }
      const result={seedValue,ledge,caught:c.caught,seconds,hops,travel,peakSpeed,airProgress,initialDistance,initialBodyDistance,closestInitialBodyDistance,closest,maxSwing,status:b.status,audit:audit.report(),skin:{penetration:skin.maxPenetration,worst:skin.worst}};results.push(result);t.diagnostic(JSON.stringify({seedValue,ledge,caught:c.caught,seconds,hops,travel,peakSpeed,airProgress,initialDistance,closest,slide:audit.maxSlide}));
      if(process.env.HUNT_REPORT)writeFileSync(process.env.HUNT_REPORT,JSON.stringify({results},null,2));
      {
        // A long supported descent can take most of a bounded chase while
        // an observed insect continues hopping away. Require substantial real
        // body progress toward its observed location there; a faster fleeing
        // insect need not keep its gap small during a careful descent. Open
        // ground starts must still halve the gap to the moving insect.
        const approached=ledge?closestInitialBodyDistance<initialBodyDistance*.75:closest<initialDistance*.5;
        assert.ok(c.caught||approached&&travel>initialDistance*.5,'meaningfully approach before abandoning escaped prey');
        assert.ok(c.caught||b.mode==='idle'&&['Watching escaped prey','Missed'].includes(b.status),'finish the chase rather than remain blocked');
        if(!c.caught)assert.equal(b.canHunt(c),false,'remember escaped prey instead of immediately restarting');
      }
      assert.ok(hops>0,'the prey uses its actual hop behavior');
      // The real cricket can hop repeatedly and leave its starting patch.
      // Keep every chase bounded; initial open sand is not a promise that the
      // insect will remain there or be caught before its next escape hop.
      assert.ok(seconds<47,'the pursuit closes the gap or ends promptly');
      assert.ok(maxSwing<2.5,'no indefinitely airborne foot during pursuit');
      assert.ok(audit.maxSlide<.0001,'planted feet stay fixed during pursuit');
      assert.ok(audit.maxFloat<.0005&&audit.maxPenetration<.0005,'planted soles stay on real supports');
      assert.ok(peakSpeed<.36&&audit.maxJump<.01,'running and the brief torso lunge stay continuous');
      assert.ok(audit.maxLimbError<.00015,'pursuit preserves limb lengths');
      assert.ok(skin.maxPenetration<.003,'the visible head, trunk and limbs clear hardscape during pursuit');
    }
    // Observed prey may disappear behind hardscape after leaving open sand.
    // Require reliable success across varied real escape behavior, alongside
    // the five separate stationary cases that must all capture by contact.
    const open=results.filter(r=>!r.ledge);
    assert.ok(open.filter(r=>r.caught).length>=Math.ceil(open.length/2),'capture at least half of varied open-sand pursuits');
  }finally{Math.random=random;}
});

test('pursuit continues through a real escape hop with room to close the gap',()=>{
  const random=Math.random;let seed=51;
  Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  try{
    const a=habitat(),b=a.brain as any,r=a.rig,I=r.inputs,audit=new Audit();
    Object.assign(I,{x:.08,z:.35,heading:0,clearance:.95,chestLift:.15,headPitch:.05});r.reset();
    for(let i=0;i<60;i++)r.update(1/60);
    const c=cricket(.40,.34,a.surface.heightAt(.40,.34));c.airborne=false;c.heading=0;
    Object.assign(c,{hopT:10,walkT:10});b.boredom=1e6;b.startHunt(c);
    for(let i=0;i<180&&(b.huntPhase!=='approach'||r.motion.speed<.10);i++){c.update(1/60,a.surface,a.nav);b.update(1/60);}
    assert.ok(b.huntPhase==='approach'&&r.motion.speed>=.10,'begin the escape during an established pursuit');
    assert.ok(r.mouth.distanceTo(c.pos)>.10,'the hop begins beyond pickup range');
    c.startle(r.snout);let progress=0,airFrames=0,airPeakSpeed=0;
    for(let i=0;i<60;i++){
      c.update(1/60,a.surface,a.nav);const x=I.x,z=I.z;b.update(1/60);audit.sample(r,a.surface);
      if(c.airborne){airFrames++;const advance=Math.hypot(I.x-x,I.z-z);progress+=advance;airPeakSpeed=Math.max(airPeakSpeed,advance*60);}else if(airFrames)break;
    }
    // A hop immediately beside the mouth may correctly trigger a pause. Test
    // continued approach with an explicit gap, instead of a random seed whose
    // hop can move into pickup range as prediction or fixation improves.
    // The hop can overlap a slow support transfer. Require real forward
    // pursuit and walking speed within the hop, without prescribing one exact
    // displacement for every possible phase of the four-foot gait.
    assert.ok(airFrames>5&&progress>.01&&airPeakSpeed>.09,`advances during the escape hop: ${progress} m, peak ${airPeakSpeed} m/s`);
    assert.ok(audit.maxSlide<.0001&&audit.maxLimbError<.00015);
  }finally{Math.random=random;}
});

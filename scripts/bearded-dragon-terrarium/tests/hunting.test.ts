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
  assert.equal(b.hurry,true);assert.ok(b.backOutLeft>0,'leave the food dish before pivoting');
  Object.assign(I,{x:.48,z:.33,heading:0});b.startHunt(c);
  assert.ok(b.bowlExit,'withdraw clear of the water rim before turning');
});

test('accessible moving prey is caught and an escaping ledge cricket is pursued without sliding feet',{timeout:180000},t=>{
  const random=Math.random,results:any[]=[];
  try{
    for(const [seedValue,ledge] of [[11,false],[23,false],[37,true]] as const){
      let seed:number=seedValue;Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
      const a=habitat(),b=a.brain as any,r=a.rig,I=r.inputs,audit=new Audit(),skin=new SkinAudit(a.lizard,true);
      b.boredom=1e6;
      if(!ledge){Object.assign(I,{x:.08,z:.35,heading:0,clearance:.95,chestLift:.15,headPitch:.05});r.reset();}
      for(let i=0;i<60;i++)r.update(1/60);
      const c=cricket(ledge?-.08:.34,ledge?.24:.34,a.surface.heightAt(ledge?-.08:.34,ledge?.24:.34));
      c.airborne=false;c.heading=0;
      const initialDistance=r.mouth.distanceTo(c.pos);
      b.startHunt(c);
      let seconds=0,hops=0,previousAir=false,travel=0,px=I.x,pz=I.z,peakSpeed=0,airProgress=0,closest=Infinity,maxSwing=0;
      const swings=[0,0,0,0];
      for(let frame=0;frame<65*60&&!c.caught&&b.mode==='hunt';frame++){
        c.update(1/60,a.surface,a.nav);b.update(1/60);audit.sample(r,a.surface);seconds=(frame+1)/60;
        if(frame%12===0)skin.sample(r,a.surface,frame);
        const distance=Math.hypot(I.x-px,I.z-pz);travel+=distance;peakSpeed=Math.max(peakSpeed,distance*60);if(c.airborne)airProgress+=distance;
        px=I.x;pz=I.z;if(c.airborne&&!previousAir)hops++;previousAir=c.airborne;
        closest=Math.min(closest,r.mouth.distanceTo(c.pos));
        for(const [k,l] of (r as any).legs.entries()){swings[k]=l.swing?swings[k]+1/60:0;maxSwing=Math.max(maxSwing,swings[k]);}
        if(process.env.HUNT_REPORT&&frame%120===0)writeFileSync(process.env.HUNT_REPORT,JSON.stringify({results,current:{seedValue,seconds,phase:b.huntPhase,status:b.status,root:[I.x,I.z],prey:c.pos.toArray(),mouth:r.mouth.toArray(),speed:I.speed,cruise:b.cruise,pause:b.pauseT,lead:b.leadT,pathI:b.pathI,paths:b.path.length}},null,2));
      }
      const result={seedValue,ledge,caught:c.caught,seconds,hops,travel,peakSpeed,airProgress,initialDistance,closest,maxSwing,status:b.status,audit:audit.report(),skin:{penetration:skin.maxPenetration,worst:skin.worst}};results.push(result);t.diagnostic(JSON.stringify({seedValue,ledge,caught:c.caught,seconds,hops,travel,peakSpeed,airProgress,initialDistance,closest,slide:audit.maxSlide}));
      if(process.env.HUNT_REPORT)writeFileSync(process.env.HUNT_REPORT,JSON.stringify({results},null,2));
      if(!ledge)assert.ok(c.caught,`${seedValue}: accessible cricket is caught (${b.status})`);
      else {
        assert.ok(c.caught||closest<initialDistance*.5&&travel>.45,'meaningfully close the gap before abandoning escaped prey');
        assert.ok(c.caught||b.mode==='idle'&&['Watching escaped prey','Missed'].includes(b.status),'finish the chase rather than remain blocked');
        if(!c.caught)assert.equal(b.canHunt(c),false,'remember escaped prey instead of immediately restarting');
      }
      assert.ok(hops>0,'the prey uses its actual hop behavior');
      assert.ok(seconds<(ledge?47:10),'the pursuit closes the gap or ends promptly');
      assert.ok(maxSwing<2.5,'no indefinitely airborne foot during pursuit');
      if(seedValue===23)assert.ok(airProgress>.02,'continue advancing during an escape hop');
      assert.ok(audit.maxSlide<.0001,'planted feet stay fixed during pursuit');
      assert.ok(audit.maxFloat<.0005&&audit.maxPenetration<.0005,'planted soles stay on real supports');
      assert.ok(peakSpeed<.36&&audit.maxJump<.01,'running and the brief torso lunge stay continuous');
      assert.ok(audit.maxLimbError<.00015,'pursuit preserves limb lengths');
      assert.ok(skin.maxPenetration<.003,'the visible head, trunk and limbs clear hardscape during pursuit');
    }
  }finally{Math.random=random;}
});

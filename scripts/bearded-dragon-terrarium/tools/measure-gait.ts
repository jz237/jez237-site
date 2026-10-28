import {model} from '../tests/locomotion-fixture';
import {LizardRig} from '../lib/LizardRig';
import * as THREE from 'three';
for(const speed of [.06,.12,.24,.30]){
 const r=new LizardRig(model(),{heightAt:()=>0,normalAt:(_x,_z,out=new THREE.Vector3())=>out.set(0,1,0)}) as any;
 Object.assign(r.inputs,{x:-.4,z:0,heading:0,clearance:1.15,chestLift:.15});r.reset();
 const count=[0,0,0,0],air=[0,0,0,0],previous=r.legs.map((l:any)=>l.swing);let moved=0,blocked=0;
 for(let i=0;i<150;i++){
  const x=r.inputs.x;r.inputs.speed=speed;r.inputs.x+=speed/60;r.update(1/60);moved+=r.inputs.x-x;if(r.blocked)blocked++;
  r.legs.forEach((l:any,k:number)=>{if(l.swing&&!previous[k])count[k]++;if(l.swing)air[k]++;previous[k]=l.swing;});
 }
 console.log(JSON.stringify({requestedMetresPerSecond:speed,actualMetresPerSecond:moved/2.5,blockedFrames:blocked,
  legs:r.legs.map((l:any,k:number)=>({kind:l.front?'front':'hind',side:l.side,cyclesPerSecond:count[k]/2.5,supportFraction:1-air[k]/150,reachMetres:l.reach}))}));
}

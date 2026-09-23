import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as T from 'three';
import {bodyEdge,finFreedom,finField,bodyBend} from '../MarineFinFlex.ts';
const profiles=JSON.parse(fs.readFileSync(new URL('../assets/fish/model-info.json',import.meta.url)));
let seed=734,checked=0,worstDot=1,minDeterminant=Infinity;
const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
for(const [species,profile] of Object.entries(profiles)){
 for(let j=0;j<120;j++){
  const x=-.5+j/119,y=(bodyEdge(profile.upper,x)+bodyEdge(profile.lower,x))/2;
  assert.equal(finFreedom(profile,x,y,0),0,species+' body/tail insertion is pinned');
  assert.equal(finFreedom(profile,x,bodyEdge(profile.upper,x)-.001,0),0,species+' dorsal insertion is pinned');
 }
 assert.equal(finFreedom(profile,0,0,0,true),0,'pectoral pivot is pinned');
 for(const pectoral of [false,true])for(let i=0;i<150;i++){
  const p=new T.Vector3(pectoral?(random()-.5)*.4:-.85+random()*1.3,(random()-.5)*.8,(random()-.5)*.08),time=random()*6,effort=random();
  const bend=q=>{const f=finFreedom(profile,q.x,q.y,q.z,pectoral);return (pectoral?0:bodyBend(q.x,time,effort))+Math.sin(time*9-q.x*8)*f*(.015+Math.abs(q.y)*.11);};
  const [f,fx,fy,fz]=finField(profile,p.x,p.y,p.z,pectoral),phase=time*9-p.x*8,amp=.015+Math.abs(p.y)*.11,h=1e-5;
  const bodySlope=pectoral?0:(bodyBend(p.x+h,time,effort)-bodyBend(p.x-h,time,effort))/(2*h);
  const gradient=new T.Vector3(bodySlope-8*Math.cos(phase)*f*amp+Math.sin(phase)*amp*fx,Math.sin(phase)*(f*.11*Math.sign(p.y)+amp*fy),Math.sin(phase)*amp*fz);
  minDeterminant=Math.min(minDeterminant,1+gradient.z);
  const a=new T.Vector3(1,.1,.25),b=new T.Vector3(-.2,1,.5),normal=a.clone().cross(b).normalize();
  normal.z/=1+gradient.z;normal.x-=gradient.x*normal.z;normal.y-=gradient.y*normal.z;normal.normalize();
  const deformed=t=>{const plus=p.clone().addScaledVector(t,h),minus=p.clone().addScaledVector(t,-h);return t.clone().add(new T.Vector3(0,0,(bend(plus)-bend(minus))/(2*h)));};
  const actual=deformed(a).cross(deformed(b)).normalize();worstDot=Math.min(worstDot,normal.dot(actual));checked++;
 }
}
assert.ok(worstDot>.999,'bent normals match independently sampled sloping membrane tangents: '+worstDot);
assert.ok(minDeterminant>.5,'membrane deformation stays upright: '+minDeterminant);
console.log('Marine fin motion passed:',checked,'sloped tissue samples; minimum normal dot',worstDot,'minimum determinant',minDeterminant);

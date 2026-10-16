import {prepareNativeFloorContacts,prepareNativeBoxContacts} from './native-static-contacts.js';

// Adapter boundary for the existing world-unit point solver. Original numeric
// contact selection/response runs in binary32 native units. The surrounding
// integrator and shore/sphere phases retain their own documented precision.
// No second persistent hull or impact owner is created.
const F=Math.fround,keys=['x','y','z'];
export function createNativeStaticContactBridge({geometry,scale=.025}={}){
 if(!geometry?.floor||!geometry.boxes)throw new TypeError('Supply selected original floor and box geometry');
 if(!Number.isFinite(scale)||scale<=0)throw new RangeError('Invalid native contact scale');
 const states=new WeakMap();
 function pass(kind,hull,context){
  if(hull?.points?.length!==12||hull.scale!==scale)throw new TypeError('Expected twelve-point hull at the contact scale');
  if(!context?.contactWindow||typeof context.recordImpact!=='function')throw new TypeError('Native contacts require the adapter contact window and impact callback');
  const prior=context.contactWindow;
  const input={pointsNative:hull.points.map(p=>({
   position:Object.fromEntries(keys.map(k=>[k,F(p.position[k]/scale)])),
   velocity:Object.fromEntries(keys.map(k=>[k,F(p.velocity[k]*.01/scale)]))})),
   floorImpactNative:prior.floorImpactNative,boxImpactNative:prior.boxImpactNative,markedBox:prior.markedBox,
   // This scratch normal is not committed. Ordered contact reports below feed
   // the adapter's existing shared impact-normal owner, including other phases.
   normalNative:{x:0,y:0,z:0}};
  const result=kind==='floor'?prepareNativeFloorContacts(input,geometry.floor):prepareNativeBoxContacts(input,geometry.boxes);
  if(result.contacts.length){
   const touched=new Set(result.contacts.map(c=>c.pointIndex));
   hull.points.forEach((p,i)=>{
    for(const k of keys)p.position[k]=result.state.pointsNative[i].position[k]*scale;
    if(touched.has(i))for(const k of keys)p.velocity[k]=result.state.pointsNative[i].velocity[k]*scale/.01;
   });
   hull.velocity=Object.fromEntries(keys.map(k=>[k,hull.points.reduce((sum,p)=>sum+p.velocity[k]/12,0)]));
   for(const c of result.contacts)context.recordImpact({channel:c.kind,incomingNative:c.incomingNative,normal:c.normalNative,markedBox:c.flag});
  }
  let history=states.get(hull);if(!history||history.tick!==hull.ticks){history={tick:hull.ticks,floor:[],boxes:[]};states.set(hull,history);}
  history[kind==='floor'?'floor':'boxes']=result.contacts;
  return kind==='floor'?{floorImpactNative:result.state.floorImpactNative}:
   {boxImpactNative:result.state.boxImpactNative,markedBox:result.state.markedBox};
 }
 return Object.freeze({floor:(h,c)=>pass('floor',h,c),boxes:(h,c)=>pass('box',h,c),
  diagnostics:h=>{const s=states.get(h);return s?structuredClone(s):null;},
  provenance:Object.freeze({floor:'original grid/list and binary32 7F030 pass',boxes:'original row order and binary32 7F700 pass',
   conversion:'world metres and metres/second to native position and displacement per10ms; surrounding solver remains separate',scale})});
}

import {createNativeGenericSpheres,collideNativeGenericSpheres,snapshotNativeGenericSpheres} from './native-generic-spheres.js';
import {isHostRaceWater} from './race-water.js';
import {createNativeIceFragments,stepNativeIceFragments} from './native-ice-fragments.js';
import {nativeIceOwnerPresentation} from './native-ice-presentation.js';
import {createNativeIceSplashes,queueNativeIceSplash} from './native-ice-splashes.js';
const F=Math.fround,axes=['x','y','z'];

// Shared Glacier ice owner. The physical array is visible to every racer.
// Its presentation removal follows6E0F4, independently of collider removal.
export function createNativeIceWorld({definitions,water,fragmentBurst=null,splashAdvance=null}={}){
 if(!isHostRaceWater(water)||water.frames!==0)throw new TypeError('Ice requires initial host source water');
 if(!Array.isArray(definitions)||definitions.some(q=>q.runtimeKind!==10||!q.sourceGenericSphere))throw new TypeError('Expected selected original ice definitions');
 if(fragmentBurst!==null&&typeof fragmentBurst!=='function')throw new TypeError('Expected shared-seed fragment producer');
 if(splashAdvance!==null&&(typeof splashAdvance!=='function'||!fragmentBurst))throw new TypeError('Splash updates require the shared fragment/random owner');
 const scale=water.scale,ids=definitions.map(q=>q.id);
 if(new Set(ids).size!==ids.length||ids.some(id=>typeof id!=='string'&&!Number.isSafeInteger(id)))throw new TypeError('Ice needs unique ids');
 const state=createNativeGenericSpheres(definitions.map(q=>({kind:10,position:[q.x/scale,q.y/scale,q.z/scale],radius:q.r/scale}))),display=definitions.map(()=>({renderKind:1,age:0}));
 let frames=0,updates=0,fragmentGeneration=0,fragments=fragmentBurst?createNativeIceFragments():null;const generations=Array(16).fill(0),events=[],hulls=new WeakMap();
 let splashes=splashAdvance?createNativeIceSplashes():null,effectsFrames=0,splashGeneration=0;const splashGenerations=Array(8).fill(0);
 const bridge={state,
  contact(hull,context){
   if(hull.scale!==scale||context?.logicalFrame!==frames||typeof context.readGenericObjectState!=='function'||typeof context.recordGenericHitKind!=='function'||typeof context.recordImpact!=='function')throw new Error('Ice requires the current native impact owner');
   const prepared=context.readGenericObjectState(),impact={maximum:prepared.maximum,normal:axes.map(k=>prepared.normal[k]),hitKind:prepared.hitKind};
   const native={positions:hull.points.map(p=>axes.map(k=>F(p.position[k]/scale))),velocities:hull.points.map(p=>axes.map(k=>F(p.velocity[k]*.01/scale)))};
   const center=axes.map(k=>F(hull.center[k]/scale)),up=axes.map(k=>F(hull.frame.up[k])),forward=axes.map(k=>F(hull.frame.forward[k]));
   const probesNative=[27,-9].map(z=>axes.map((_,k)=>F(F(z*forward[k])+F(center[k]+F(up[k]+up[k])))));
   const result=collideNativeGenericSpheres(state,native,{probesNative,stabilityNative:prepared.stabilityNative,impact});
   for(const hit of result.contacts)context.recordImpact({channel:'object',incomingNative:hit.incoming,normal:Object.fromEntries(axes.map((k,i)=>[k,hit.normal[i]]))});
   if(result.contacts.length){
    context.recordGenericHitKind(impact.hitKind);
    hull.points.forEach((p,i)=>axes.forEach((k,j)=>{p.position[k]=native.positions[i][j]*scale;p.velocity[k]=native.velocities[i][j]*scale/.01;}));
   }
   let eventIndex=0;for(const hit of result.contacts)if(hit.broke){
    const event=result.fragmentEvents[eventIndex++],positionNative=[...event.position],velocityNative=[...event.velocity];
    if(fragmentBurst){const cursor=fragments.cursor,result=fragmentBurst(fragments,{positionNative,velocityNative});fragments=result.state;for(let i=0;i<8;i++)generations[(cursor+i)&15]=++fragmentGeneration;if(splashes)splashes=queueNativeIceSplash(splashes,result.splashPositionNative);}
    events.push(Object.freeze({id:ids[hit.index],index:hit.index,logicalFrame:frames,substep:context.substep,positionNative:Object.freeze(positionNative),velocityNative:Object.freeze(velocityNative)}));
   }
   const previous=hulls.get(hull);hulls.set(hull,{contacts:(previous?.contacts??0)+result.contacts.length,unresolved:(previous?.unresolved??0)+result.unresolved.length});
  },
  afterFrame(world,context,{active=true}={}){
   if(world?.water!==water||context?.logicalFrame!==frames+1||water.frames!==context.logicalFrame||context.step!==.05)throw new Error('Ice display must follow the shared water frame');
   if(typeof active!=='boolean')throw new TypeError('Ice activity must be boolean');
   if(active){state.nodes.forEach((n,i)=>{if(n.broken){display[i].renderKind=0;display[i].age=Math.min(255,display[i].age+1);}});if(fragments)fragments=stepNativeIceFragments(fragments);updates++;}
   frames++;
  },
  afterEffects(world,context){
   if(!splashes)return;
   if(world?.water!==water||context?.logicalFrame!==frames||effectsFrames+1!==frames||context.step!==.05)throw new Error('Splash effects must run once after the completed object frame');
   //922E4 calls B2ABC after6E3A8; B2ABC calls AF51C unconditionally,
   // independently of activity624. A browser pause never enters this phase.
   const result=splashAdvance(splashes);splashes=result.state;
   for(const slot of result.emitted)splashGenerations[slot]=++splashGeneration;
   effectsFrames++;
  },
  snapshot(){return snapshotNativeGenericSpheres(state).map((n,i)=>({id:ids[i],sourceIndex:i,runtimeKind:10,position:{x:n.position[0]*scale,y:n.position[1]*scale,z:n.position[2]*scale},broken:n.broken,...display[i]}));},
  breakEvents(){return events.map(e=>({...e,positionNative:[...e.positionNative],velocityNative:[...e.velocityNative]}));},
  fragmentSnapshot(){return fragments?{cursor:fragments.cursor,slots:fragments.slots.map(s=>({...s,position:[...s.position],velocity:[...s.velocity]}))}:null;},
  splashSnapshot(){return splashes?structuredClone(splashes):null;},
  presentationSnapshot(){return nativeIceOwnerPresentation(bridge.snapshot(),fragments,scale,generations,splashes,splashGenerations);},
  diagnostics(hull){return {outerFrames:frames,displayUpdates:updates,objectCount:state.nodes.length,breaks:events.length,hull:hulls.get(hull)??null};}
 };
 return Object.freeze(bridge);
}

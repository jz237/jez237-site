import {createNativeGenericSpheres,collideNativeGenericSpheres,snapshotNativeGenericSpheres} from './native-generic-spheres.js';
import {isHostRaceWater} from './race-water.js';
import {createNativeIceFragments,stepNativeIceFragments} from './native-ice-fragments.js';
const F=Math.fround,axes=['x','y','z'];

// Shared Glacier ice owner. The physical array is visible to every racer.
// Its presentation removal follows6E0F4, independently of collider removal.
export function createNativeIceWorld({definitions,water,fragmentBurst=null}={}){
 if(!isHostRaceWater(water)||water.frames!==0)throw new TypeError('Ice requires initial host source water');
 if(!Array.isArray(definitions)||definitions.some(q=>q.runtimeKind!==10||!q.sourceGenericSphere))throw new TypeError('Expected selected original ice definitions');
 if(fragmentBurst!==null&&typeof fragmentBurst!=='function')throw new TypeError('Expected shared-seed fragment producer');
 const scale=water.scale,ids=definitions.map(q=>q.id);
 if(new Set(ids).size!==ids.length||ids.some(id=>typeof id!=='string'&&!Number.isSafeInteger(id)))throw new TypeError('Ice needs unique ids');
 const state=createNativeGenericSpheres(definitions.map(q=>({kind:10,position:[q.x/scale,q.y/scale,q.z/scale],radius:q.r/scale}))),display=definitions.map(()=>({renderKind:1,age:0}));
 let frames=0,updates=0,fragments=fragmentBurst?createNativeIceFragments():null;const events=[],hulls=new WeakMap();
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
    if(fragmentBurst)fragments=fragmentBurst(fragments,{positionNative,velocityNative}).state;
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
  snapshot(){return snapshotNativeGenericSpheres(state).map((n,i)=>({id:ids[i],sourceIndex:i,runtimeKind:10,position:{x:n.position[0]*scale,y:n.position[1]*scale,z:n.position[2]*scale},broken:n.broken,...display[i]}));},
  breakEvents(){return events.map(e=>({...e,positionNative:[...e.positionNative],velocityNative:[...e.velocityNative]}));},
  fragmentSnapshot(){return fragments?{cursor:fragments.cursor,slots:fragments.slots.map(s=>({...s,position:[...s.position],velocity:[...s.velocity]}))}:null;},
  diagnostics(hull){return {outerFrames:frames,displayUpdates:updates,objectCount:state.nodes.length,breaks:events.length,hull:hulls.get(hull)??null};}
 };
 return Object.freeze(bridge);
}

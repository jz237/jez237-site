import {prepareNativeRaceGenericObjectContacts,prepareNativeRaceObjectMotionUpdate,prepareNativeRaceFixedSphereUpdate,prepareNativeRaceObjectUpdate} from './native-race-state.js';
import {isHostRaceWater} from './race-water.js';
import {createNativeIceFragments,stepNativeIceFragments} from './native-ice-fragments.js';
import {createNativeIceSplashes,queueNativeIceSplash} from './native-ice-splashes.js';
import {nativeIceOwnerPresentation} from './native-ice-presentation.js';
const F=Math.fround,axes=['x','y','z'],bits=new DataView(new ArrayBuffer(4));
function number(word){bits.setUint32(0,word);return bits.getFloat32(0);}

/** Physical bridge over the caller's ONE canonical object owner. Course
 * loading/initialization must already have run. Every craft contact reads the
 * latest owner and commits back immediately; free motion follows shared water
 * and adjudication once. updateTransforms first writes Southern fixed-sphere
 * heights from the shared water datum, then advances fragments. afterEffects
 * runs splashes after the caller's roller/spray stages. Fragment/splash callbacks
 * own the shared random seed. Ring collection, primary motion and live mode
 * admission remain caller stages; snapshots never own mutable object copies.
 */
export function createNativeGenericObjectWorld({water,readRaceState,commitRaceState,onFragment=null,objectIds=null,fragmentBurst=null,splashAdvance=null}={}){
 if(!isHostRaceWater(water)||water.frames!==0)throw new TypeError('Generic objects require initial host source water');
 if(typeof readRaceState!=='function'||typeof commitRaceState!=='function')throw new TypeError('Generic objects require a canonical race owner');
 if(onFragment!==null&&typeof onFragment!=='function')throw new TypeError('Expected a fragment event consumer');
 if(fragmentBurst!==null&&typeof fragmentBurst!=='function')throw new TypeError('Expected shared-seed fragment producer');
 if(splashAdvance!==null&&(typeof splashAdvance!=='function'||!fragmentBurst))throw new TypeError('Splash updates require the shared fragment/random owner');
 const scale=water.scale,hulls=new WeakMap();let frames=0,motionUpdates=0,transformFrames=0,transformUpdates=0,sourceCount=null;
 function read(){const state=readRaceState();if(!Array.isArray(state?.objectWordsC940)||state.objectWordsC940.length!==3136||!Number.isInteger(state.scene?.objectCountFa40)||state.scene.objectCountFa40<0||state.scene.objectCountFa40>64)throw new RangeError('Generic owner needs initialized source object storage');
  if(sourceCount!==null&&state.scene.objectCountFa40!==sourceCount)throw new Error('Generic source layout changed; recreate the world');return state;}
 sourceCount=read().scene.objectCountFa40;
 if(objectIds!==null&&!Array.isArray(objectIds))throw new TypeError('Expected complete source object ids');
 const ids=objectIds===null?Array.from({length:sourceCount},(_,i)=>`native-object-${i}`):objectIds.slice();
 if(ids.length!==sourceCount||new Set(ids).size!==ids.length||ids.some(id=>!(typeof id==='string'&&id.length>0&&id.length<=160||Number.isSafeInteger(id))))throw new TypeError('Generic objects require unique ids for the complete source array');
 let fragments=fragmentBurst?createNativeIceFragments():null,splashes=splashAdvance?createNativeIceSplashes():null;
 let fragmentGeneration=0,splashGeneration=0,effectsFrames=0;const generations=Array(16).fill(0),splashGenerations=Array(8).fill(0),events=[];
 const bridge={water,
  provenance:Object.freeze({owner:'caller canonical objectWordsC940',contactOrder:'descending source rows; front then rear; immediate shared commit',
   motionOrder:'ascending motion58=4 after water/adjudication/primary motion',waterQuery:'source4D30C plane result',numericPrecision:'source float32/double operation order'}),
  contact(hull,context){
   if(hull.scale!==scale||context?.logicalFrame!==frames||typeof context.readGenericObjectState!=='function'||typeof context.recordGenericHitKind!=='function'||typeof context.recordImpact!=='function')throw new Error('Generic contacts require the current native physical impact owner');
   const prepared=context.readGenericObjectState(),impact={maximum:prepared.maximum,normal:axes.map(k=>prepared.normal[k]),hitKind:prepared.hitKind};
   const body={positions:hull.points.map(p=>axes.map(k=>F(p.position[k]/scale))),velocities:hull.points.map(p=>axes.map(k=>F(p.velocity[k]*.01/scale)))};
   const center=axes.map(k=>F(hull.center[k]/scale)),up=axes.map(k=>F(hull.frame.up[k])),forward=axes.map(k=>F(hull.frame.forward[k]));
   const probesNative=[27,-9].map(z=>axes.map((_,k)=>F(F(z*forward[k])+F(center[k]+F(up[k]+up[k])))));
   const result=prepareNativeRaceGenericObjectContacts(read(),{hull:body,probesNative,stabilityNative:prepared.stabilityNative,impact});
   commitRaceState(result.state);
   for(const hit of result.contacts)context.recordImpact({channel:'object',incomingNative:hit.incoming,normal:Object.fromEntries(axes.map((k,i)=>[k,hit.normal[i]]))});
   if(result.contacts.length){
    context.recordGenericHitKind(result.impact.hitKind);
    hull.points.forEach((p,i)=>axes.forEach((k,j)=>{p.position[k]=result.hull.positions[i][j]*scale;p.velocity[k]=result.hull.velocities[i][j]*scale/.01;}));
   }
   const previous=hulls.get(hull);hulls.set(hull,{contacts:(previous?.contacts??0)+result.contacts.length,unresolved:(previous?.unresolved??0)+result.unresolved.length});
   let index=0;for(const hit of result.contacts)if(hit.broke){
    const raw=result.fragmentEvents[index++],positionNative=[...raw.position],velocityNative=[...raw.velocity];
    if(fragmentBurst){
     const cursor=fragments.cursor,burst=fragmentBurst(fragments,{positionNative,velocityNative});fragments=burst.state;
     for(let i=0;i<8;i++)generations[(cursor+i)&15]=++fragmentGeneration;
     if(splashes)splashes=queueNativeIceSplash(splashes,burst.splashPositionNative);
    }
    events.push(Object.freeze({id:ids[hit.index],sourceIndex:hit.index,logicalFrame:frames,substep:context.substep,
     positionNative:Object.freeze(positionNative),velocityNative:Object.freeze(velocityNative)}));
    if(onFragment)onFragment({...raw,sourceIndex:hit.index,logicalFrame:frames,substep:context.substep});
   }
   return result;
  },
  afterFrame(world,context){
   if(world?.water!==water||context?.logicalFrame!==frames+1||water.frames!==context.logicalFrame||transformFrames!==frames||splashes&&effectsFrames!==frames||context.step!==.05)throw new Error('Generic motion must follow exactly one shared water/adjudication frame and completed preceding object phases');
   const result=prepareNativeRaceObjectMotionUpdate(read(),{waterField:water.field});
   commitRaceState(result.state);frames++;if(result.applied)motionUpdates++;return result;
  },
  updateTransforms(world,context,resources){
   if(world?.water!==water||context?.logicalFrame!==frames||water.frames!==frames||transformFrames+1!==frames||context.step!==.05)throw new Error('Generic transforms must follow the completed object-motion frame once');
   const fixed=prepareNativeRaceFixedSphereUpdate(read(),{datum2458:water.field.datumNative});
   const transformed=prepareNativeRaceObjectUpdate(fixed.state,resources),result=Object.freeze({...transformed,
    diagnostic:Object.freeze({...transformed.diagnostic,fixedSphereRows:fixed.diagnostic.updatedRows})});
   commitRaceState(result.state);transformFrames++;if(result.applied){if(fragments)fragments=stepNativeIceFragments(fragments);transformUpdates++;}return result;
  },
  afterEffects(world,context){
   if(!splashes)return;
   if(world?.water!==water||water.frames!==frames||context?.logicalFrame!==frames||transformFrames!==frames||effectsFrames+1!==frames||context.step!==.05)throw new Error('Object splashes must run once after the completed transform frame');
   //922E4/B2ABC reachesAF51C independently of activity624.
   const result=splashAdvance(splashes);splashes=result.state;
   for(const slot of result.emitted)splashGenerations[slot]=++splashGeneration;
   effectsFrames++;return result;
  },
  snapshot(){
   const state=read(),raw=state.objectWordsC940;
   return Array.from({length:state.scene.objectCountFa40},(_,i)=>{
    const b=i*49,kind=raw[b+0x4c/4]|0;
    return {id:ids[i],sourceIndex:i,runtimeKind:kind,positionNative:axes.map((_,j)=>number(raw[b+j])),position:Object.fromEntries(axes.map((k,j)=>[k,number(raw[b+j])*scale])),velocityNative:axes.map((_,j)=>number(raw[b+6+j])),
     anglesDegrees:axes.map((_,j)=>number(raw[b+3+j])),floatMatrixWords:raw.slice(b+0x74/4,b+0x74/4+16),
     renderKind:raw[b+0x54/4]|0,motionKind:raw[b+0x58/4]|0,collisionKind:raw[b+0x5c/4]|0,
     broken:kind===10&&raw[b+0xbc/4]!==0,collected:kind===8&&raw[b+0xbc/4]!==0,age:raw[b+0x6c/4]|0};
   });
  },
  breakEvents(){return events.map(e=>({...e,positionNative:[...e.positionNative],velocityNative:[...e.velocityNative]}));},
  fragmentSnapshot(){return fragments?structuredClone(fragments):null;},
  splashSnapshot(){return splashes?structuredClone(splashes):null;},
  presentationSnapshot(){return nativeIceOwnerPresentation(bridge.snapshot().filter(o=>o.runtimeKind===10),fragments,scale,generations,splashes,splashGenerations);},
  diagnostics(hull){return {outerFrames:frames,motionUpdates,transformFrames,transformUpdates,effectsFrames,breaks:events.length,objectCount:read().scene.objectCountFa40,hull:hulls.get(hull)?{...hulls.get(hull)}:null};}
 };
 return Object.freeze(bridge);
}

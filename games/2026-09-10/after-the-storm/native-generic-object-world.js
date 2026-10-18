import {prepareNativeRaceGenericObjectContacts,prepareNativeRaceObjectMotionUpdate,prepareNativeRaceObjectUpdate} from './native-race-state.js';
import {isHostRaceWater} from './race-water.js';
const F=Math.fround,axes=['x','y','z'],bits=new DataView(new ArrayBuffer(4));
function number(word){bits.setUint32(0,word);return bits.getFloat32(0);}

/** Physical bridge over the caller's ONE canonical object owner. Course
 * loading/initialization must already have run. Every craft contact reads the
 * latest owner and commits back immediately; free motion follows shared water
 * and adjudication once. updateTransforms follows the caller's fixed-sphere
 * tide writes. Ring collection, primary motion, fragment/splash simulation
 * and live mode admission remain caller stages.
 */
export function createNativeGenericObjectWorld({water,readRaceState,commitRaceState,onFragment=null}={}){
 if(!isHostRaceWater(water)||water.frames!==0)throw new TypeError('Generic objects require initial host source water');
 if(typeof readRaceState!=='function'||typeof commitRaceState!=='function')throw new TypeError('Generic objects require a canonical race owner');
 if(onFragment!==null&&typeof onFragment!=='function')throw new TypeError('Expected a fragment event consumer');
 const scale=water.scale,hulls=new WeakMap();let frames=0,motionUpdates=0,transformFrames=0,transformUpdates=0;
 function read(){const state=readRaceState();if(!Array.isArray(state?.objectWordsC940)||state.objectWordsC940.length!==3136||!Number.isInteger(state.scene?.objectCountFa40)||state.scene.objectCountFa40<0||state.scene.objectCountFa40>64)throw new RangeError('Generic owner needs initialized source object storage');return state;}
 read();
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
   if(onFragment){let index=0;for(const hit of result.contacts)if(hit.broke)onFragment({...result.fragmentEvents[index++],sourceIndex:hit.index,logicalFrame:frames,substep:context.substep});}
   return result;
  },
  afterFrame(world,context){
   if(world?.water!==water||context?.logicalFrame!==frames+1||water.frames!==context.logicalFrame||context.step!==.05)throw new Error('Generic motion must follow exactly one shared water/adjudication frame');
   const result=prepareNativeRaceObjectMotionUpdate(read(),{waterField:water.field});
   commitRaceState(result.state);frames++;if(result.applied)motionUpdates++;return result;
  },
  updateTransforms(world,context,resources){
   if(world?.water!==water||context?.logicalFrame!==frames||water.frames!==frames||transformFrames+1!==frames||context.step!==.05)throw new Error('Generic transforms must follow the completed object-motion frame once');
   const result=prepareNativeRaceObjectUpdate(read(),resources);
   commitRaceState(result.state);transformFrames++;if(result.applied)transformUpdates++;return result;
  },
  snapshot(){
   const state=read(),raw=state.objectWordsC940;
   return Array.from({length:state.scene.objectCountFa40},(_,i)=>{
    const b=i*49,kind=raw[b+0x4c/4]|0;
    return {sourceIndex:i,runtimeKind:kind,positionNative:axes.map((_,j)=>number(raw[b+j])),velocityNative:axes.map((_,j)=>number(raw[b+6+j])),
     anglesDegrees:axes.map((_,j)=>number(raw[b+3+j])),floatMatrixWords:raw.slice(b+0x74/4,b+0x74/4+16),
     renderKind:raw[b+0x54/4]|0,motionKind:raw[b+0x58/4]|0,collisionKind:raw[b+0x5c/4]|0,
     broken:kind===10&&raw[b+0xbc/4]!==0,collected:kind===8&&raw[b+0xbc/4]!==0,age:raw[b+0x6c/4]|0};
   });
  },
  diagnostics(hull){return {outerFrames:frames,motionUpdates,transformFrames,transformUpdates,objectCount:read().scene.objectCountFa40,hull:hulls.get(hull)?{...hulls.get(hull)}:null};}
 };
 return Object.freeze(bridge);
}

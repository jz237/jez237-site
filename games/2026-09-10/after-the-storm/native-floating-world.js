import {createSourceFloatingObjects,stepSourceFloatingObjects,collideSourceFloatingObjects} from './source-floating-objects.js';
import {queryNativeWaterField} from './native-water-field.js';
import {isHostRaceWater} from './race-water.js';

// Runtime-kind9 objects sample the source4d30c normalized plane expression.
// Their motion consumer uses that result as Y even though it differs from the
// rendered triangle height. Substituting the display surface changes buoyancy.
// Contacts happen on every hull tick; free object motion follows water once.
// The numeric leaf retains its documented double precision/unit assumptions.
const copy=p=>({x:p.x,y:p.y,z:p.z});
function hostWater(water){if(!isHostRaceWater(water))throw new TypeError('Floating motion requires host source water');}
export function nativeFloatingWaterHeight(water,x,z){
 hostWater(water);return queryNativeWaterField(water.field,x/water.scale,z/water.scale).sourcePlaneQueryNative*water.scale;
}

/** Supply the selected source definitions, not visual obstacles or fixed balls.
 * This adapter owns object evolution and per-hull five-tick impact maxima.
 * Bind contact as native-race-adapter.primarySpheres, the legacy name for its
 * GENERIC object phase after fixedSpheres. Racing-route buoys precede both.
 * Bind afterFrame after the shared world's water update, before presentation.
 * The external motion gate stays explicit; no browser pause state is inferred.
 */
export function createNativeFloatingWorld({definitions,water}={}){
 hostWater(water);if(water.frames!==0)throw new RangeError('New floating definitions require an initial water frame');
 const state=createSourceFloatingObjects(definitions,{scale:water.scale}),hulls=new WeakMap();
 let frames=0;
 const bridge={state,water,
  provenance:Object.freeze({motionWater:'sourcePlaneQueryNative (4d30c), not rendered height',
   motionOrder:'after shared water, one object pass per outer frame',contactOrder:'primary sphere phase, descending candidates, first overlap per probe',
   activityGate:'explicit caller value; source signed16 activity state not inferred',numericPrecision:'reconstructed double precision leaf'}),
  contact(hull,context){
   if(!Number.isInteger(context?.logicalFrame)||context.logicalFrame<0)throw new TypeError('Floating contacts require the adapter frame context');
   let local=hulls.get(hull);
   if(!local||local.logicalFrame!==context.logicalFrame){
    local={logicalFrame:context.logicalFrame,impact:{maximum:0,normal:null,hitKind:0},contacts:0,unresolved:0};hulls.set(hull,local);
   }
   const result=collideSourceFloatingObjects(state,hull,{impactState:local.impact});
   local.contacts+=result.contacts.length;local.unresolved+=result.unresolved.length;
   // Report each contact, not only the final C50 max: another family's strict
   // increase may have changed the shared normal between these calls.
   for(const hit of result.contacts)context.recordImpact?.({channel:'object',incomingNative:hit.normalSpeedNative,normal:hit.normal});
   // C50 does not activate the separate shore/floor/box contact-drive window.
  },
  afterFrame(world,context,{active=true}={}){
   if(world?.water!==water||context?.logicalFrame!==frames+1||water.frames!==context.logicalFrame||context.step!==.05)
    throw new Error('Floating evolution must follow exactly one shared water frame');
   if(typeof active!=='boolean')throw new TypeError('Floating activity must be explicit boolean');
   stepSourceFloatingObjects(state,.05,{active,surface:(x,z)=>nativeFloatingWaterHeight(water,x,z)});frames++;
   return bridge;
  },
  diagnostics(hull){
   const local=hulls.get(hull);
   return {outerFrames:frames,motionUpdates:state.frames,objectCount:state.objects.length,
    hull:local?{logicalFrame:local.logicalFrame,contacts:local.contacts,unresolved:local.unresolved,
     impact:{maximum:local.impact.maximum,normal:local.impact.normal?copy(local.impact.normal):null,hitKind:local.impact.hitKind}}:null};
  },
  snapshot(){return state.objects.map(o=>({id:o.id,sourceIndex:o.sourceIndex,position:copy(o.position),velocity:copy(o.velocity),radius:o.radius}));}
 };
 return Object.freeze(bridge);
}

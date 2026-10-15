import {createSourcePrimaryBuoys,collideSourcePrimaryBuoys,stepSourcePrimaryBuoys,snapshotSourcePrimaryBuoys} from './source-primary-buoys.js';
import {queryNativeWaterField} from './native-water-field.js';
import {isHostRaceWater} from './race-water.js';

// One shared primary array for all craft. Hull contacts can recoil an object
// immediately, so later riders see that same mutation. Free buoy evolution is
// one50ms pass AFTER shared water and route adjudication, never per craft/tick.
// Source loaderY0 and zero velocity are retained; native countdown history is
// not reconstructed by inventing query+30 as an initial equilibrium.
export function createNativePrimaryBuoyWorld({layout,water}={}){
 if(!isHostRaceWater(water)||water.frames!==0)throw new TypeError('Primary buoys require initial host source water');
 if(layout?.scale!==water.scale)throw new RangeError('Primary buoy and water scales must match');
 const state=createSourcePrimaryBuoys(layout),hulls=new WeakMap();
 const indexByRow=new Map(layout.nodes.map((q,i)=>[q.sourceRow,i]));
 let frames=0,motionUpdates=0;
 const bridge={state,layout,water,
  provenance:Object.freeze({contactOrder:'primary array descending; first overlap per latched front/rear probe',
   motionOrder:'one ascending pass after shared water and adjudication',
   motionWater:'sourcePlaneQueryNative (4d30c), already includes datum',
   clocks:'native point velocity per10ms; separate buoy velocity per50ms',
   initialization:'source loader Y0/velocity0; original countdown history unavailable',
   routeActivation:'initial source layout flags; later scripted activation remains external'}),
  contact(hull,context){
   if(!Number.isInteger(context?.logicalFrame)||context.logicalFrame!==frames||typeof context.recordImpact!=='function')
    throw new Error('Primary contacts require the current native adapter impact context');
   let local=hulls.get(hull);
   if(!local||local.logicalFrame!==frames){local={logicalFrame:frames,contacts:0,unresolved:0,last:[]};hulls.set(hull,local);}
   const result=collideSourcePrimaryBuoys(state,hull,context);
   local.contacts+=result.contacts.length;local.unresolved+=result.unresolved.length;
   local.last=result.contacts.map(q=>structuredClone(q));
  },
  afterFrame(world,context,{active=true}={}){
   if(world?.water!==water||context?.logicalFrame!==frames+1||water.frames!==context.logicalFrame||context.step!==.05)
    throw new Error('Primary evolution must follow exactly one shared water/adjudication frame');
   if(typeof active!=='boolean')throw new TypeError('Primary buoy activity must be boolean');
   if(active){stepSourcePrimaryBuoys(state,{queryNative:(x,z)=>queryNativeWaterField(water.field,x,z).sourcePlaneQueryNative});motionUpdates++;}
   frames++;return bridge;
  },
  positionForSourceRow(sourceRow){
   const index=indexByRow.get(sourceRow);if(index===undefined)throw new RangeError('Unknown primary source row');
   return {...snapshotSourcePrimaryBuoys(state)[index].position};
  },
  snapshot(){return snapshotSourcePrimaryBuoys(state);},
  diagnostics(hull){
   const local=hulls.get(hull);return {outerFrames:frames,motionUpdates,nodeCount:layout.nodes.length,
    hull:local?{...local,last:local.last.map(q=>structuredClone(q))}:null};
  }
 };
 return Object.freeze(bridge);
}

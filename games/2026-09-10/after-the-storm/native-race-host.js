import {createNativeHull} from './native-hull.js';
import {createNativeRaceAdapter,nativeRaceSnapshot} from './native-race-adapter.js';
import {createAuthoredNativeRider} from './authored-native-rider.js';
import {createNativeLifecycleRider} from './native-lifecycle-rider.js';
import {nativeRiderPresentation} from './native-rider-presentation.js';
import {createSourceNativeContacts} from './source-native-contacts.js';
import {createNativeRaceWorld,stepNativeRaceWorld} from './native-race-world.js';
import {nativeRacerPresentation} from './native-racer-presentation.js';
import {queryNativeWaterField} from './native-water-field.js';
import {NATIVE_RIDER_TUNE_DEFAULTS} from './native-rider-controls.js';
import {createNativeFloatingWorld} from './native-floating-world.js';
import {createNativePrimaryBuoyWorld} from './native-primary-buoy-world.js';

// Runnable host bridge for the recovered hull and rider recovery. This remains
// an integration preview: other actors/tricks and original AI are incomplete.
// The physical rider uses authored anatomy/remount art and recovered constraints.
// Low-level native tune indices remain independent of the browser's three
// modern settings; recovered profile defaults are 5/5/5, not zero.
export const NATIVE_HOST_DEFAULT_TUNE=NATIVE_RIDER_TUNE_DEFAULTS;
const F=Math.fround;
const finite=Number.isFinite;
function axis(value,name){if(!finite(value)||value< -1||value>1)throw new RangeError(`${name} must be from -1 to1`);return value;}

/** Explicit browser adaptation. Source acceleration is digital A or Z.
 * Brake releases acceleration and coasts; it never creates opposite thrust.
 * B absorbs/crouches, R slides, and signed forward trim is native positive Y.
 * Gesture shortcuts, rescue and named tricks need their separate actor ports.
 */
export function nativeHostInput(input={}){
 if(!input||typeof input!=='object'||Array.isArray(input))throw new TypeError('Expected browser riding controls');
 const steer=axis(input.steer??0,'steer'),trim=axis(input.lean??0,'lean'),throttle=input.throttle??0;
 if(typeof throttle!=='boolean'&&(!finite(throttle)||throttle<0||throttle>1))throw new RangeError('throttle must be from0 to1');
 for(const key of ['brake','dampen','slide'])if(input[key]!==undefined&&typeof input[key]!=='boolean')throw new TypeError(`${key} must be boolean`);
 return {rawXNative:-Math.trunc(70*steer)||0,rawYNative:Math.trunc(70*trim)||0,
  heldButtons:(throttle>0&&!input.brake?0x8000:0)|(input.dampen?0x4000:0)|(input.slide?0x10:0)};
}

function present(host){
 const scale=host.world.water.scale,field=host.world.water.field;
 host.presentations=host.world.adapters.map((a,i)=>{
  const snapshot=nativeRaceSnapshot(a),p=snapshot.position;
  const query=queryNativeWaterField(field,F(F(p.x)*F(1/scale)),F(F(p.z)*F(1/scale)));
  const view=nativeRacerPresentation(snapshot,{wetFlags:a.water.wet,renderHeightNative:query.renderHeightNative,
   scale,previous:host.presentations[i]});
  const r=host.racers[i],{hydro,...pose}=view.racer;
  Object.assign(r,pose);Object.assign(r.hydro,hydro);
  r.nativeRiderPose=nativeRiderPresentation(a.articulatedRider,a.hull);
  r.nativeTelemetry={...view.source,actionState:{...snapshot.source.actionState},
   actorState:snapshot.source.actorState,animationFrame:snapshot.source.animationFrame,
   controlActorState:snapshot.source.controlActorState??snapshot.source.actorState,
   recovery:snapshot.source.recovery?structuredClone(snapshot.source.recovery):null,
   impacts:{...snapshot.source.impacts,normal:{...snapshot.source.impacts.normal}},
   physicalControls:snapshot.source.physicalControls?{...snapshot.source.physicalControls}:null,
   contactWindow:{...snapshot.source.contacts},derived:{...view.derived}};
  if(a.lastControls){r.turn=-a.lastControls.conditionedXNative/70;r.riderLean=a.lastControls.conditionedYNative/70;r.throttle=Number(a.lastControls.throttle);}
  return view;
 });
}

/** Caller supplies selected course geometry and a host-owned source field.
 * Actual physical rider joint2 feeds subsequent trim; no constant joint is
 * substituted. Initial center at the course datum is a declared host policy.
 * Custom source actor/pose providers require explicit recovery:false.
 */
export function createNativeRaceHost({racers,water,course,fixedSphereGrid=null,tunes=[],sourceStates=[],poseProviders=[],onFrame=null,
 floatingDefinitions,floatingActive=true,primaryActive=true,recovery=true}={}){
 if(!Array.isArray(racers)||racers.length<1||racers.some(r=>!r?.hydro||!Number.isInteger(r.id)||r.id<0||r.id>3))throw new TypeError('Expected initialized browser racers');
 if(!water?.field||!finite(water.scale))throw new TypeError('Expected host source water');
 if(onFrame!==null&&typeof onFrame!=='function')throw new TypeError('onFrame must be a function');
 if(typeof floatingActive!=='boolean')throw new TypeError('floatingActive must be boolean');
 if(typeof primaryActive!=='boolean')throw new TypeError('primaryActive must be boolean');
 if(typeof recovery!=='boolean')throw new TypeError('recovery must be boolean');
 if(recovery&&(sourceStates.length||poseProviders.length))throw new TypeError('Custom actor/pose providers require explicit recovery:false');
 const humanIndices=racers.map((r,i)=>r.human?i:-1).filter(i=>i>=0);
 const definitions=floatingDefinitions??course.dynamicObjectsForPlayers?.(humanIndices.length)??[];
 if(!Array.isArray(definitions))throw new TypeError('Expected selected floating definitions');
 const floating=definitions.length?createNativeFloatingWorld({definitions,water}):null;
 const primary=course.sourceBuoyLayout?createNativePrimaryBuoyWorld({layout:course.sourceBuoyLayout,water}):null;
 const courseContacts=createSourceNativeContacts(course,{scale:water.scale,fixedSphereGrid});
 const contacts={...courseContacts,...(primary?{racingBuoys:primary.contact}:{}),...(floating?{primarySpheres:floating.contact}:{})};
 const bundles=[],adapters=racers.map((r,i)=>{
  const initial={position:{x:r.x,y:water.field.datumNative*water.scale,z:r.z},heading:r.heading,
   rider:r.id,scale:water.scale};
  const bundle=recovery?createNativeLifecycleRider({initialHull:createNativeHull(initial)}):
   createAuthoredNativeRider({initialHull:createNativeHull(initial),poseProvider:poseProviders[i]});bundles.push(bundle);
  return createNativeRaceAdapter({...initial,riderIndex:r.id,...NATIVE_HOST_DEFAULT_TUNE,...tunes[i],
   contacts,powerSteps:r.power,sourceState:sourceStates[i]??(recovery?{simulationState:3}:{actorState:22,simulationState:3}),...bundle,
   ...(recovery?{riderRecovery:{courseDatumNative:()=>water.field.datumNative,raceFinished:()=>r.finishTime!==null}}:{})});
 });
 const host={racers,bundles,contacts,primary,primaryActive,floating,floatingActive,presentations:[],onFrame,world:null,
  provenance:Object.freeze({status:'ordinary-source-solver-integration-preview',riderGeometry:'authored-modern-anatomy',
   initialHeight:'course-datum',tuning:'explicit-native-indices; default5/5/5',
   clock:'five10ms hull ticks then one water update',controls:'digital-accelerator; brake-coasts; B-crouch; R-slide',
   actorRecoveryAndTricks:false,riderRecovery:recovery,physicalRiderPresentation:true,
   recoveryGeometry:'authored anatomy/remount; reconstructed procedural fall/stumble; explicit authored rest/circle/history policy',
   nativeRacerCollision:false,sourcePrimaryBuoyContacts:!!primary})};
 host.world=createNativeRaceWorld({adapters,water,humanIndices,afterTick:(_,context)=>{
  if(context.tick%5!==0)present(host);
 },afterFrame:(_,context)=>{
  present(host);
  // Adjudication observes contact-displaced current centers BEFORE the source
  // primary array's one motion pass. All craft share that mutable array.
  const keepRunning=host.onFrame?host.onFrame(host,context):undefined;
  if(primary)primary.afterFrame(host.world,context,{active:host.primaryActive});
  if(floating)floating.afterFrame(host.world,context,{active:host.floatingActive});
  return keepRunning;
 }});
 present(host);return host;
}

/** Display patches never feed a rigid or pressure solver. Only the native
 * world owns positions/velocities; callers must not mutate racer pose to rescue
 * or collide and expect it to change this physical state.
 */
export function stepNativeRaceHost(host,dt,inputs,options={}){
 if(!host?.world||!Array.isArray(inputs)||inputs.length!==host.racers.length)throw new TypeError('Expected a native host and one input per racer');
 const providers=inputs.map((value,i)=>(time,frame)=>{
  const input=typeof value==='function'?value(time,frame):value;
  host.world.adapters[i].powerSteps=host.racers[i].power;
  return nativeHostInput(input);
 });
 stepNativeRaceWorld(host.world,dt,providers,options);return host;
}

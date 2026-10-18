import {createNativeHullFromStart,prepareNativeHullStartFromPose,authoredNativeHullLocalPoints} from './native-hull.js';
import {createNativeRaceAdapter,nativeRaceSnapshot} from './native-race-adapter.js';
import {createAuthoredNativeRider} from './authored-native-rider.js';
import {createNativeLifecycleRider} from './native-lifecycle-rider.js';
import {nativeRiderPresentation} from './native-rider-presentation.js';
import {createSourceNativeContacts} from './source-native-contacts.js';
import {createNativeRaceWorld,stepNativeRaceWorld} from './native-race-world.js';
import {createNativeRaceSpray} from './native-race-spray.js';
import {nativeRacerPresentation} from './native-racer-presentation.js';
import {queryNativeWaterField} from './native-water-field.js';
import {NATIVE_RIDER_TUNE_DEFAULTS} from './native-rider-controls.js';
import {createNativeIceWorld} from './native-ice-world.js';
import {createNativeFloatingWorld} from './native-floating-world.js';
import {createNativePrimaryBuoyWorld} from './native-primary-buoy-world.js';
import {bindRaceWaterCameraStorage,raceWaterAISelectionCircle,advanceRaceWaterRollers} from './race-water.js';
import {nativeAIBodyFields} from './native-ai-body-fields.js';
import {nativeRaceBodyFields} from './native-race-body-fields.js';
import {captureNativeCamera} from './native-camera-presentation.js';
import {applyNativeRiderResultCodes} from './native-rider-lifecycle.js';

// Runnable host bridge for the recovered hull and rider recovery. This remains
// an integration preview: solo source input is connected, while multi-racer
// AI, other actors/tricks and the complete result schedule remain incomplete.
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
 const cameras=host.world.water.frames>0&&host.raceRuntime?.ordinary?host.world.water.cameras:null;
 host.presentations=host.world.adapters.map((a,i)=>{
  const snapshot=nativeRaceSnapshot(a),p=snapshot.position;
  const query=queryNativeWaterField(field,F(F(p.x)*F(1/scale)),F(F(p.z)*F(1/scale)));
  const view=nativeRacerPresentation(snapshot,{wetFlags:a.water.wet,renderHeightNative:query.renderHeightNative,
   scale,previous:host.presentations[i]});
  const r=host.racers[i],{hydro,...pose}=view.racer;
  Object.assign(r,pose);Object.assign(r.hydro,hydro);
  r.handicapBoost=(a.frame?.catchup?.multiplier??1)-1;
  if(host.raceRuntime?.ordinary)r.nativeCamera=r.human&&cameras?captureNativeCamera(cameras[r.player],scale):null;
  r.nativeRiderPose=nativeRiderPresentation(a.articulatedRider,a.hull);
  r.nativeTelemetry={...view.source,catchup:a.frame?.catchup?{...a.frame.catchup}:null,actionState:{...snapshot.source.actionState},
   actorState:snapshot.source.actorState,animationFrame:snapshot.source.animationFrame,
   controlActorState:snapshot.source.controlActorState??snapshot.source.actorState,
   recovery:snapshot.source.recovery?structuredClone(snapshot.source.recovery):null,
   impacts:{...snapshot.source.impacts,normal:{...snapshot.source.impacts.normal}},
   physicalControls:snapshot.source.physicalControls?{...snapshot.source.physicalControls}:null,
   contactWindow:{...snapshot.source.contacts},derived:{...view.derived}};
  // Neutral DISPLAY steering has one zero representation; source words and
  // all physical numeric arrays remain untouched in their actual owners.
  if(a.lastControls){r.turn=(-a.lastControls.conditionedXNative/70)||0;r.riderLean=a.lastControls.conditionedYNative/70;r.throttle=Number(a.lastControls.throttle);}
  return view;
 });
}

/** Caller supplies selected course geometry and a host-owned source field.
 * Actual physical rider joint2 feeds subsequent trim; no constant joint is
 * substituted. Direct callers adapt a browser pose at the course datum; the
 * ordinary race passes physical starts prepared from its canonical source grid.
 * Custom source actor/pose providers require explicit recovery:false.
 */
export function createNativeRaceHost({racers,water,course,fixedSphereGrid=null,tunes=[],sourceStates=[],poseProviders=[],onFrame=null,
 raceRuntime=null,onLaunchFrame=null,onContactFrame=null,onAudioFrame=null,hullStarts=[],staticGeometry=null,
 floatingDefinitions,floatingActive=true,primaryActive=true,recovery=true,craftContacts=true}={}){
 if(!Array.isArray(racers)||racers.length<1||racers.some(r=>!r?.hydro||!Number.isInteger(r.id)||r.id<0||r.id>3))throw new TypeError('Expected initialized browser racers');
 if(!water?.field||!finite(water.scale))throw new TypeError('Expected host source water');
 if(onFrame!==null&&typeof onFrame!=='function')throw new TypeError('onFrame must be a function');
 if(onLaunchFrame!==null&&typeof onLaunchFrame!=='function')throw new TypeError('onLaunchFrame must be a function');
 if(onContactFrame!==null&&typeof onContactFrame!=='function')throw new TypeError('onContactFrame must be a function');
 if(onAudioFrame!==null&&typeof onAudioFrame!=='function')throw new TypeError('onAudioFrame must be a function');
 if(raceRuntime&&(!recovery||sourceStates.length||poseProviders.length||['scene','advanceClock','advanceLaunch'].some(k=>typeof raceRuntime[k]!=='function')))
  throw new TypeError('Canonical launch requires recovered riders and its single scene owner');
 if(raceRuntime?.ordinary&&['objectMotionActive','courseRollerState','waterDatumAfterPhysics'].some(k=>typeof raceRuntime[k]!=='function'))
  throw new TypeError('Canonical ordinary motion requires its activity and roller state owner');
 if(typeof floatingActive!=='boolean')throw new TypeError('floatingActive must be boolean');
 if(typeof primaryActive!=='boolean')throw new TypeError('primaryActive must be boolean');
 if(typeof recovery!=='boolean')throw new TypeError('recovery must be boolean');
 if(typeof craftContacts!=='boolean')throw new TypeError('craftContacts must be boolean');
 if(recovery&&(sourceStates.length||poseProviders.length))throw new TypeError('Custom actor/pose providers require explicit recovery:false');
 const humanIndices=racers.map((r,i)=>r.human?i:-1).filter(i=>i>=0);
 if(!Array.isArray(hullStarts)||hullStarts.length!==0&&hullStarts.length!==racers.length)
  throw new TypeError('Supply one prepared hull start per racer');
 const definitions=floatingDefinitions??course.dynamicObjectsForPlayers?.(humanIndices.length)??[];
 if(!Array.isArray(definitions))throw new TypeError('Expected selected floating definitions');
 const iceDefinitions=(course.rocks??[]).filter(q=>q.sourceGenericSphere&&q.runtimeKind===10);
 let objects=null;
 if(raceRuntime?.canonicalObjects){
  if(floatingDefinitions!==undefined||!floatingActive)throw new RangeError('Custom floating diagnostics require an authored object layout');
  const initial=raceRuntime.snapshot(),raw=initial.objectWordsC940,bits=new DataView(new ArrayBuffer(4));
  const read=i=>{bits.setUint32(0,raw[i]);return bits.getFloat32(0);};
  const used=new Set(),ids=Array.from({length:initial.scene.objectCountFa40},(_,i)=>{
   if((raw[i*49+0x4c/4]|0)!==10)return `native-object-${i}`;
   const match=iceDefinitions.find(q=>!used.has(q)&&['x','y','z'].every((k,j)=>Math.abs(q[k]-read(i*49+j)*water.scale)<1e-6));
   if(!match)throw new RangeError('Source ice presentation must match the complete initialized layout; select authored diagnostics for custom objects');
   used.add(match);return match.id;
  });
  if(used.size!==iceDefinitions.length||definitions.length)throw new RangeError('Authored object overrides require an explicit authored object layout');
  objects=raceRuntime.createObjectWorld({water,objectIds:ids});
 }
 if(!objects&&iceDefinitions.length&&definitions.length)throw new RangeError('Mixed floating and ice motion requires a unified original generic owner');
 // Renderer compatibility is a detached view of the complete source array.
 const ice=objects?(iceDefinitions.length?Object.freeze({snapshot:()=>objects.snapshot().filter(o=>o.runtimeKind===10),
  presentationSnapshot:objects.presentationSnapshot,breakEvents:objects.breakEvents,diagnostics:objects.diagnostics}):null):iceDefinitions.length?createNativeIceWorld({definitions:iceDefinitions,water,
  fragmentBurst:raceRuntime?.ordinary?raceRuntime.spawnIceFragments:null,splashAdvance:raceRuntime?.ordinary?raceRuntime.advanceIceSplashes:null}):null;
 const floating=!objects&&definitions.length?createNativeFloatingWorld({definitions,water}):null;
 const primary=course.sourceBuoyLayout?createNativePrimaryBuoyWorld({layout:course.sourceBuoyLayout,water}):null;
 const courseContacts=createSourceNativeContacts(course,{scale:water.scale,fixedSphereGrid:objects?null:fixedSphereGrid,staticGeometry});
 const contacts={...courseContacts,...(primary?{racingBuoys:primary.contact}:{}),...(objects?{boxes:objects.boxContact,fixedSpheres:objects.fixedContact,primarySpheres:objects.contact,
  provenance:Object.freeze({...courseContacts.provenance,fixedSpheres:'original binary32 grid/query/contact over canonical fixedSphereWordsB138',
   dynamicAndPrimaryObjects:'complete canonical generic owner; separate primary buoy owner',objectOwner:objects.provenance}),
  objectDiagnostics:objects.diagnostics}:floating?{primarySpheres:floating.contact}:ice?{primarySpheres:ice.contact}:{})};
 // A solo source race needs no unresolved multi-racer camera-corner predicate. Its
 // original61708 countdown, not a browser finish flag, selects this producer.
 const sourceAI=!!raceRuntime?.ordinary&&racers.length===1;
 const bundles=[],adapters=racers.map((r,i)=>{
  const initial={position:{x:r.x,y:water.field.datumNative*water.scale,z:r.z},heading:r.heading,
   rider:r.id,scale:water.scale};
  const adapterOptions={...initial,riderIndex:r.id,...NATIVE_HOST_DEFAULT_TUNE,...tunes[i]};
  const computerProfile=hullStarts.length?hullStarts[i].computerProfile:adapterOptions.computerProfile??false;
  adapterOptions.computerProfile=computerProfile;
  const hullStart=hullStarts.length?hullStarts[i].prepared:prepareNativeHullStartFromPose({...initial,rider:adapterOptions.riderIndex,computerProfile});
  const initialHull=createNativeHullFromStart({prepared:hullStart,rider:adapterOptions.riderIndex,scale:water.scale,computerProfile});
  const bundle=recovery?createNativeLifecycleRider({initialHull,initializeStart:!!raceRuntime}):
   createAuthoredNativeRider({initialHull,poseProvider:poseProviders[i]});bundles.push(bundle);
  // Fresh browser body memory is explicitly zero before the original partial
  // startup stores. No cartridge-retained gesture/idle state is inferred.
  const actionStart=raceRuntime?.ordinary?raceRuntime.riderActionStartup({gestureTick15f0:0,flag1600:0,
   sequence15f8:0,sequence15fa:0,lastPressedDirections15fc:0,quietFrames15fe:0,idleFramesC6c:0,idleChoice16c4:0}):null;
  const {idleFramesC6c,idleChoice16c4,...inputHistory}=actionStart??{};
  return createNativeRaceAdapter({...adapterOptions,
   ...(actionStart?{riderActions:{inputHistory,idleFramesC6c,idleChoice16c4,source:()=>raceRuntime.riderActionContext(i)}}:{}),
   ...(actionStart?{riderLanding:{landingTicks:0,localPointsNative:authoredNativeHullLocalPoints()}}:{}),
   ...(sourceAI?{sourceAIInput:()=>{
    const prepared=raceRuntime.sampleAI(i,{bodiesBySlot:host.aiBodies,
     geometry:{selectionCircleNative:raceWaterAISelectionCircle(water),
      nodePositionsNative:primary.state.nodes.map(n=>({sourceRow:n.sourceRow,x:n.positionNative.x,z:n.positionNative.z})),
      proximityObjectCentersNative:objects?objects.snapshot().map(o=>({x:o.positionNative[0],z:o.positionNative[2]})):ice?ice.state.nodes.map(o=>({x:o.position[0],z:o.position[2]})):(floating?.state.objects??[]).map(o=>({x:F(o.position.x/water.scale),z:F(o.position.z/water.scale)}))},waterField:water.field});
    host.lastAIInput=prepared;return {...prepared.controls,action16f4:prepared.action16f4};
   }}:{}),
   hullStart,contacts,powerSteps:r.power,sourceState:raceRuntime?()=>({...raceRuntime.scene(),...(raceRuntime.ordinary?{sourceTick:raceRuntime.inputClock()}:{}),
    catchup:raceRuntime.catchupContext?.(i,host.world.adapters.map(a=>({x:F(a.hull.center.x/a.hull.scale),z:F(a.hull.center.z/a.hull.scale)})))}):sourceStates[i]??(recovery?{simulationState:3}:{actorState:22,simulationState:3}),...bundle,
   ...(recovery?{riderRecovery:{courseDatumNative:()=>water.field.datumNative,raceFinished:()=>r.finishTime!==null,...bundle.initialRiderRecovery}}:{})});
 });
 const objectTransformResources=objects?raceRuntime.objectTransformResources:null;
 const host={racers,bundles,contacts,primary,primaryActive,objects,ice,floating,floatingActive,presentations:[],onFrame,raceRuntime,onLaunchFrame,world:null,
  provenance:Object.freeze({status:'ordinary-source-solver-integration-preview',riderGeometry:'authored-modern-anatomy',
   initialHeight:hullStarts.length?'source-grid-transform':'course-datum',tuning:'explicit-native-indices; default5/5/5',
   hullStartup:'decoded packed16.16 transform; source point/frame/rest/damping recipe with authored local shape',
   clock:'five10ms hull ticks then one water update',controls:'digital-accelerator; brake-coasts; B-crouch; R-slide',
   actorRecoveryAndTricks:false,nativeGestureAndIdleActions:!!raceRuntime?.ordinary,riderRecovery:recovery,physicalRiderPresentation:true,
   recoveryGeometry:'authored anatomy/remount; reconstructed procedural fall/stumble; explicit authored rest/circle/history policy',
   nativeRacerCollision:craftContacts,sourcePrimaryBuoyContacts:!!primary,sourceGenericIceContacts:!!ice,canonicalCourseObjects:!!objects,sourceAIInput:sourceAI})};
 if(raceRuntime?.ordinary){
  // Fresh browser inactive body slots are explicitly zero; active B64/B68
  // both come from the host's selected numeric rider profile. Retained AI
  // words are patched by890B4, never replaced with a neutral driver object.
  const profiles=Array.from({length:4},(_,i)=>adapters[i]?.hull.rider??0);
  host.aiInitialization=raceRuntime.initializeAI({hullProfilesB64:profiles,avatarsB68:profiles,
   objectTypes4c:objects?objects.snapshot().map(o=>o.runtimeKind):ice?ice.state.nodes.map(o=>o.kind):(floating?.state.objects??[]).map(o=>o.runtimeKind)});
  bindRaceWaterCameraStorage(water,raceRuntime.cameraStorage);
  host.spray=createNativeRaceSpray({adapters,field:water.field,courseIndex:course.sourceWaterCourseIndex});
 }
 host.world=createNativeRaceWorld({adapters,water,humanIndices,craftContacts,deferWaterRollers:!!raceRuntime?.ordinary,
 beforeFrame:raceRuntime?.ordinary?(world,context)=>{
  //47B00/BF370 precedes922E4 in46DA0's outer game loop.
  if(onAudioFrame)onAudioFrame(host,context);
  //6A264 at922E4 entry precedes control/input and physical world work.
  host.lastSourceFrameCounter=raceRuntime.advanceSourceFrameCounter();
  const menu=typeof host.menuInputs==='function'?host.menuInputs(context.time,context.logicalFrame):host.menuInputs??[];
  if(!Array.isArray(menu))throw new TypeError('Menu inputs must be a human-controller array');
  host.lastMenuInput=raceRuntime.advanceMenuInput(menu.map(value=>{
   const controls=typeof value==='function'?value(context.time,context.logicalFrame):value;
   const raw=nativeHostInput(controls);
   if(controls.continue!==undefined&&typeof controls.continue!=='boolean')throw new TypeError('continue must be boolean');
   return {...raw,heldButtons:raw.heldButtons|(controls.continue?0x1000:0)};
  }));
  host.lastNavigation=raceRuntime.advanceNavigation({
   bodiesBySlot:world.adapters.map(a=>({avatar:a.hull.rider,position:{x:a.hull.center.x,z:a.hull.center.z}})),
   nodePositions:primary.snapshot().map(n=>({sourceRow:n.sourceRow,x:n.position.x,z:n.position.z}))});
  // Capture every preceding body BEFORE any descending control latch. Later
  // selected producers must not observe another racer's new control frame.
  if(sourceAI&&world.adapters.some(a=>a.riderLifecycle.state.selectionCountdown<0))
   host.aiBodies=world.adapters.map(nativeAIBodyFields);
 }:null,
 beforeActor:raceRuntime?.ordinary?(world,{racerIndex})=>{
  const a=world.adapters[racerIndex],lifecycles=world.adapters.map(q=>q.riderLifecycle),p=a.hull.points[0].position;
  const selected=raceRuntime.resultCodeFor(racerIndex,{bodyResultCodes16c8:lifecycles.map(q=>q.state.selectedActor),
   point90Native:Object.fromEntries(['x','y','z'].map(k=>[k,F(p[k]/a.hull.scale)])),datum2458:water.field.datumNative});
  applyNativeRiderResultCodes(lifecycles,selected.operations);
  a.lastResultCodeOperations=selected.operations;
 }:null,beforeWater:raceRuntime?.ordinary?world=>{
  if(onContactFrame)onContactFrame(host,world);
  //51238 observes the preceding lap judge's shared stage after all actors.
  // The water field owns datum; a render-time option cannot reset its tide.
  world.frame.water.datumNative=raceRuntime.waterDatumAfterPhysics(water.field.datumNative);
 }:null,afterTick:(_,context)=>{
  if(context.tick%5!==0)present(host);
 },afterFrame:(_,context)=>{
  if(raceRuntime?.ordinary)host.lastDisplayClock=raceRuntime.advanceDisplayClock();
  present(host);
  let ordinary=null;
  if(raceRuntime?.ordinary)ordinary=raceRuntime.advanceOrdinary({
   bodiesBySlot:host.world.adapters.map(nativeRaceBodyFields),
   nodePositionsNative:primary.state.nodes.map(n=>({sourceRow:n.sourceRow,x:n.positionNative.x,z:n.positionNative.z})),
   pressedButtonsB58BySlot:host.world.adapters.map(a=>a.lastControls.pressedButtons)});
  else if(raceRuntime)raceRuntime.advanceClock();
  // Adjudication observes contact-displaced current centers BEFORE the source
  // primary array's one motion pass. All craft share that mutable array.
  host.lastOrdinary=ordinary;
  // Source6E3A8 reads activity624 after adjudication, before7DBC0. Free
  // objects still move in simulation0 when activity is -1; a browser pause
  // never reaches this frame callback. Keep explicit preview gates as well.
  const objectMotionActive=!raceRuntime?.ordinary||raceRuntime.objectMotionActive();
  const keepRunning=host.onFrame?host.onFrame(host,context,ordinary):undefined;
  if(primary)primary.afterFrame(host.world,context,{active:host.primaryActive&&objectMotionActive});
  if(objects){objects.afterFrame(host.world,context);objects.updateTransforms(host.world,context,objectTransformResources);}
  else if(ice)ice.afterFrame(host.world,context,{active:objectMotionActive});
  if(floating)floating.afterFrame(host.world,context,{active:host.floatingActive&&objectMotionActive});
  //6E3A8 follows7DBC0 with Southern's generic fixed-sphere Y writes.
  // Tags1/4 follow datum; tag5 mast bases retain authored Y. This is an
  // activity-gated source frame operation, never a render-time correction.
  if(!objects&&course.sourceWaterCourseIndex===7&&objectMotionActive&&fixedSphereGrid)
   for(const sphere of fixedSphereGrid.spheres)if(sphere.runtimeTag!==5)sphere.y=water.field.datumNative*water.scale;
  // The original caller stamps course rollers AFTER object motion. Read72c
  // here from the canonical state, not from the earlier water/input latch.
  if(raceRuntime?.ordinary)advanceRaceWaterRollers(water,{active:objectMotionActive,rollerState72c:raceRuntime.courseRollerState()});
  if(host.spray)host.spray.advance(raceRuntime.sprayInputs(),raceRuntime.cameraStorage.read());
  if(objects)objects.afterEffects(host.world,context);
  else if(ice)ice.afterEffects(host.world,context);
  let launchContinues=true;
  if(raceRuntime){
   host.lastHUD=raceRuntime.ordinary?raceRuntime.advanceHUD():null;
   // Original1DE3CC is after the completed world/camera/water frame and
   // before5DF4. These are completed actor values, not the input-stage pose.
   host.lastCameraInput=raceRuntime.ordinary?raceRuntime.advanceCameraInput(host.world.adapters.map(a=>({
    actorStateC54:a.lastFrame.actorState,animationFrameC58:a.lastFrame.animationFrame}))):null;
   const status=raceRuntime.ordinary?(raceRuntime.resultView().active?raceRuntime.advanceResult():
    raceRuntime.advanceStatus(host.world.adapters.map(a=>a.riderLifecycle.state.selectedActor))):null;
   const launch=status?{...ordinary,effects:[...ordinary.effects,...host.lastHUD.effects,...host.lastCameraInput.effects,...status.effects],view:status.view}:
    raceRuntime.advanceLaunch(host.world.adapters.map(a=>a.lastControls.pressedButtons));
   if(onLaunchFrame&&onLaunchFrame(host,context,launch)===false)launchContinues=false;
  }
  if(raceRuntime?.ordinary)host.lastInputClock=raceRuntime.advanceInputClock();
  return launchContinues?keepRunning:false;
 }});
 present(host);return host;
}

/** Display patches never feed a rigid or pressure solver. Only the native
 * world owns positions/velocities; callers must not mutate racer pose to rescue
 * or collide and expect it to change this physical state.
 */
export function stepNativeRaceHost(host,dt,inputs,options={}){
 if(!host?.world||!Array.isArray(inputs)||inputs.length!==host.racers.length)throw new TypeError('Expected a native host and one input per racer');
 // Menu devices are an independent physical sample. In particular, never
 // repoll a rider provider that61708 has already handed over to source AI.
 // Headless callers without menu devices explicitly supply none.
 host.menuInputs=options.menuInputs??[];
 const providers=inputs.map((value,i)=>(time,frame)=>{
  const input=typeof value==='function'?value(time,frame):value;
  host.world.adapters[i].powerSteps=host.racers[i].power;
  return nativeHostInput(input);
 });
 stepNativeRaceWorld(host.world,dt,providers,options);return host;
}

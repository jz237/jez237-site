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
import {bindRaceWaterCameraStorage,bindRaceWaterAmplitudeThreshold,raceWaterAISelectionCircle,advanceRaceWaterRollers,raceWaterActorMotionInputs} from './race-water.js';
import {nativeAIBodyFields,nativeAIStartupBodyFields} from './native-ai-body-fields.js';
import {nativeRaceBodyFields} from './native-race-body-fields.js';
import {captureNativeCamera} from './native-camera-presentation.js';
import {applyNativeRiderResultCodes} from './native-rider-lifecycle.js';
import {prepareNativePhysicalBodyWrap,captureNativePhysicalBoundaryDrift} from './native-physical-body-wrap.js';
import {nativeCourseActorBodyPoseWords} from './native-course-actor-body.js';
import {captureNativeInitialEffectBody,captureNativeEffectBody} from './native-effect-body-view.js';
import {nativeSineTableWords,NATIVE_ANGLE_TABLE_WORDS} from './native-math-tables.js';

// Runnable host bridge for the recovered hull and rider recovery. This remains
// an integration preview: source input is connected for admitted participants;
// championship admission, other actors/tricks and full results remain incomplete.
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

/** The same human controls feed race and post-race device sampling. */
export function nativeHostMenuInput(controls={}){
 const raw=nativeHostInput(controls);
 if(controls.continue!==undefined&&typeof controls.continue!=='boolean')throw new TypeError('continue must be boolean');
 return {...raw,heldButtons:raw.heldButtons|(controls.continue?0x1000:0)};
}

function present(host){
 const scale=host.world.water.scale,field=host.world.water.field;
 const cameras=host.world.water.frames>0&&host.sourceSchedule?host.world.water.cameras:null;
 host.presentations=host.world.adapters.map((a,i)=>{
  const snapshot=nativeRaceSnapshot(a),p=snapshot.position;
  const query=queryNativeWaterField(field,F(F(p.x)*F(1/scale)),F(F(p.z)*F(1/scale)));
  const view=nativeRacerPresentation(snapshot,{wetFlags:a.water.wet,renderHeightNative:query.renderHeightNative,
   scale,previous:host.presentations[i]});
  const r=host.racers[i],{hydro,...pose}=view.racer;
  Object.assign(r,pose);Object.assign(r.hydro,hydro);
  r.handicapBoost=(a.frame?.catchup?.multiplier??1)-1;
  if(host.sourceSchedule)r.nativeCamera=r.human&&cameras?captureNativeCamera(cameras[r.player],scale):null;
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
 floatingDefinitions,floatingActive=true,primaryActive=true,recovery=true,craftContacts=true,courseActors,courseEffects}={}){
 const sourceSchedule=!!(raceRuntime?.ordinary||raceRuntime?.stunt);
 if(courseActors!==undefined&&(!sourceSchedule||!raceRuntime.ordinary||course.nativeSceneMode!=='practice'||
   typeof courseActors?.onDisplay!=='function'||typeof courseActors?.audioContext!=='function'||typeof courseActors?.onEffects!=='function'))
  throw new TypeError('Live course actors require solo Practice and explicit display/audio consumers');
 // AE7C4 reads the initialized actor pool for Dolphin's extra effect slot.
 if(courseEffects!==undefined&&(courseActors===undefined||typeof courseEffects?.onDisplay!=='function'||
   courseEffects.sourceClock!==undefined&&typeof courseEffects.sourceClock!=='function'))
  throw new TypeError('Live scene effects require initialized course actors and an explicit display consumer');
 if(raceRuntime?.championshipLaunch){
  if(hullStarts.length||tunes.length)throw new RangeError('Prepared championship owns physical starts and profiles');
  hullStarts=raceRuntime.championshipLaunch.hullStarts;tunes=raceRuntime.championshipLaunch.bodyProfiles;
 }
 if(raceRuntime?.stunt&&(!staticGeometry?.floor||!staticGeometry?.shore))throw new RangeError('Physical Stunt host requires verified source shore and floor geometry');
 if(!Array.isArray(racers)||racers.length<1||racers.some(r=>!r?.hydro||!Number.isInteger(r.id)||r.id<0||r.id>3))throw new TypeError('Expected initialized browser racers');
 if(!water?.field||!finite(water.scale))throw new TypeError('Expected host source water');
 if(onFrame!==null&&typeof onFrame!=='function')throw new TypeError('onFrame must be a function');
 if(onLaunchFrame!==null&&typeof onLaunchFrame!=='function')throw new TypeError('onLaunchFrame must be a function');
 if(onContactFrame!==null&&typeof onContactFrame!=='function')throw new TypeError('onContactFrame must be a function');
 if(onAudioFrame!==null&&typeof onAudioFrame!=='function')throw new TypeError('onAudioFrame must be a function');
 if(raceRuntime&&(!recovery||sourceStates.length||poseProviders.length||['scene','advanceClock','advanceLaunch'].some(k=>typeof raceRuntime[k]!=='function')))
  throw new TypeError('Canonical launch requires recovered riders and its single scene owner');
 if(sourceSchedule&&['objectMotionActive','courseRollerState','waterDatumAfterPhysics','waterAmplitudeThreshold','advanceGraphicsBuffer','aiCameraCorners','advanceBodyWrapCamera'].some(k=>typeof raceRuntime[k]!=='function'))
  throw new TypeError('Canonical source motion requires its activity and roller state owner');
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
  fragmentBurst:sourceSchedule?raceRuntime.spawnIceFragments:null,splashAdvance:sourceSchedule?raceRuntime.advanceIceSplashes:null}):null;
 const floating=!objects&&definitions.length?createNativeFloatingWorld({definitions,water}):null;
 const primary=course.sourceBuoyLayout?createNativePrimaryBuoyWorld({layout:course.sourceBuoyLayout,water}):null;
 const courseContacts=createSourceNativeContacts(course,{scale:water.scale,fixedSphereGrid:objects?null:fixedSphereGrid,staticGeometry});
 const contacts={...courseContacts,...(primary?{racingBuoys:primary.contact}:{}),...(objects?{boxes:objects.boxContact,fixedSpheres:objects.fixedContact,primarySpheres:objects.contact,
  provenance:Object.freeze({...courseContacts.provenance,fixedSpheres:'original binary32 grid/query/contact over canonical fixedSphereWordsB138',
   dynamicAndPrimaryObjects:'complete canonical generic owner; separate primary buoy owner',objectOwner:objects.provenance}),
  objectDiagnostics:objects.diagnostics}:floating?{primarySpheres:floating.contact}:ice?{primarySpheres:ice.contact}:{})};
 //665B0 dispatches computer slots directly;61708 uses the human countdown.
 // Every selected producer reads the same preceding body snapshot and the
 // actual retained graphics corner buffer, including two-human result takeover.
 const sourceAI=sourceSchedule;
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
  const actionStart=sourceSchedule?raceRuntime.riderActionStartup({gestureTick15f0:0,flag1600:0,
   sequence15f8:0,sequence15fa:0,lastPressedDirections15fc:0,quietFrames15fe:0,idleFramesC6c:0,idleChoice16c4:0}):null;
  const {idleFramesC6c,idleChoice16c4,...inputHistory}=actionStart??{};
  return createNativeRaceAdapter({...adapterOptions,
   ...(actionStart?{riderActions:{inputHistory,idleFramesC6c,idleChoice16c4,source:()=>raceRuntime.riderActionContext(i)}}:{}),
   ...(actionStart?{riderLanding:{landingTicks:0,localPointsNative:authoredNativeHullLocalPoints()}}:{}),
   ...(sourceAI?{controlOrigin:r.human?'human':'ai',sourceAIInput:()=>{
    const prepared=raceRuntime.sampleAI(i,{bodiesBySlot:host.aiBodies,
     //80630's startup branch does not read driving geometry. In particular,
     // the first source input precedes the first completed water/camera frame.
     geometry:raceRuntime.scene().phase650===3?{selectionCircleNative:raceWaterAISelectionCircle(water),cameraCornersNative:raceRuntime.aiCameraCorners().cameraCornersNative,
      nodePositionsNative:primary.state.nodes.map(n=>({sourceRow:n.sourceRow,x:n.positionNative.x,z:n.positionNative.z})),
      proximityObjectCentersNative:objects?objects.snapshot().map(o=>({x:o.positionNative[0],z:o.positionNative[2]})):ice?ice.state.nodes.map(o=>({x:o.position[0],z:o.position[2]})):(floating?.state.objects??[]).map(o=>({x:F(o.position.x/water.scale),z:F(o.position.z/water.scale)}))}:undefined,waterField:water.field});
    host.lastAIInput=prepared;return {...prepared.controls,action16f4:prepared.action16f4};
   }}:{}),
   hullStart,contacts,riderWaterQuery:(x,z)=>queryNativeWaterField(water.field,x,z).sourcePlaneQueryNative,
   powerSteps:r.power,sourceState:raceRuntime?()=>({...raceRuntime.scene(),...raceRuntime.riderForceContext(i),...(sourceSchedule?{sourceTick:raceRuntime.inputClock()}:{}),
    catchup:raceRuntime.catchupContext?.(i,host.world.adapters.map(a=>({x:F(a.hull.center.x/a.hull.scale),z:F(a.hull.center.z/a.hull.scale)})))}):sourceStates[i]??(recovery?{simulationState:3}:{actorState:22,simulationState:3}),...bundle,
   ...(recovery?{riderRecovery:{courseDatumNative:()=>water.field.datumNative,raceFinished:()=>r.finishTime!==null,...bundle.initialRiderRecovery}}:{})});
 });
 const objectTransformResources=objects?raceRuntime.objectTransformResources:null;
 const host={sourceSchedule,racers,bundles,contacts,primary,primaryActive,objects,ice,floating,floatingActive,presentations:[],onFrame,raceRuntime,onLaunchFrame,world:null,
  courseActorMotionInputs({retainedWordsEe20}={}){
   if(!sourceSchedule||!primary||!host.world||water.frames<1||
     primary.diagnostics().outerFrames!==water.frames||adapters.some(a=>a.logicalFrames!==water.frames))
    throw new Error('Actor inputs require completed shared water, bodies and primary motion');
   const bodyPoseWordsBySlot=Object.freeze(adapters.map(a=>nativeCourseActorBodyPoseWords(a)));
   const courseWordsEe20=raceRuntime.courseActorRouteWords(primary.state,retainedWordsEe20);
   // The water field and static collision geometry remain their actual owners;
   // the actor preparation reads them without running or cloning physics.
   return Object.freeze({...raceWaterActorMotionInputs(water),bodyPoseWordsBySlot,courseWordsEe20,
    waterField:water.field,collisionGeometry:staticGeometry});
  },
  provenance:Object.freeze({status:raceRuntime?.championshipLaunch?'championship-source-solver-integration-preview':raceRuntime?.stunt?'stunt-source-solver-integration-preview':'ordinary-source-solver-integration-preview',riderGeometry:'authored-modern-anatomy',
   initialHeight:hullStarts.length?'source-grid-transform':'course-datum',tuning:'explicit-native-indices; default5/5/5',
   hullStartup:'decoded packed16.16 transform; source point/frame/rest/damping recipe with authored local shape',
   clock:'five10ms hull ticks then one water update',controls:'digital-accelerator; brake-coasts; B-crouch; R-slide',
   actorRecoveryAndTricks:false,nativeGestureAndIdleActions:sourceSchedule,riderRecovery:recovery,physicalRiderPresentation:true,
   recoveryGeometry:'authored anatomy/remount; reconstructed procedural fall/stumble; explicit authored rest/circle/history policy',
   nativeRacerCollision:craftContacts,sourcePrimaryBuoyContacts:!!primary,sourceGenericIceContacts:!!ice,canonicalCourseObjects:!!objects,sourceAIInput:sourceAI})};
 if(sourceSchedule){
  if(courseActors){
   // New browser scene: unused route records and retained graphics X/Z begin
   // at zero. Do not evolve water to fabricate a startup vertex history.
   const retainedWordsEe20=Object.freeze(Array(192*65).fill(0)),segmentWordsE6b0=Array(16).fill(0);
   segmentWordsE6b0[8]=0x316800;
   const sineTableWords4350=nativeSineTableWords();
   host.courseActors=raceRuntime.createCourseActorHost({worldScale:water.scale,
    buffers:{matrixBuffers:Array.from({length:2},()=>Array(192*16).fill(0)),lightBuffers:Array.from({length:2},()=>Array(96).fill(0))}});
   host.actorStartup=host.courseActors.initialize({
    bodyPoseWordsBySlot:adapters.map(a=>nativeCourseActorBodyPoseWords(a,{startup:true})),
    selectedWaterVertexXZ:[[0,0],[0,0]],sineTableWords4350,
    firstCourseNodeWords:raceRuntime.courseActorRouteWords(primary.state,retainedWordsEe20).slice(0,3)
   },{assets:courseActors.assets,segmentWordsE6b0},{freshWebScene:true,waterExtent2498:water.field.parameters.radius*64});
   courseActors.onEffects(host.actorStartup.effects);
   host.advanceCourseActors=()=>{
    const input={...host.courseActorMotionInputs({retainedWordsEe20}),sineTableWords4350,
     angleTableWords6f08:NATIVE_ANGLE_TABLE_WORDS,audioContext:courseActors.audioContext()};
    host.lastCourseActors=host.courseActors.advanceMotion(input);courseActors.onEffects(host.lastCourseActors.effects);
   };
   host.displayCourseActors=()=>{
    const ticket=host.courseActors.prepareDisplay({angleTableWords6f08:NATIVE_ANGLE_TABLE_WORDS});
    courseActors.onDisplay(ticket.presentation,ticket.state.resourceWordsE73c);
    host.lastCourseActorDisplay=host.courseActors.commitDisplay(ticket);
   };
   if(courseEffects){
    // osGetTime counts at46.875MHz. Headless callers use the shared outer
    // clock (468750 counts per10ms tick); the browser supplies its own time.
    // Profiling reads bracket no guest instructions, so start equals end.
    const sourceClock=courseEffects.sourceClock??(()=>BigInt(host.world?.clockTicks??0)*468750n);
    const clockWords=()=>{
     const value=sourceClock();
     if(typeof value!=='bigint'||value<0n||value>=1n<<64n)throw new RangeError('Scene effect clock must be an unsigned64 count');
     return [Number(value>>32n),Number(value&0xffffffffn)];
    };
    const queryNative=(x,z)=>queryNativeWaterField(water.field,x,z).sourcePlaneQueryNative;
    host.sceneEffects=raceRuntime.createCourseEffectsHost({worldScale:water.scale,
     graphicsBuffers:Array.from({length:2},()=>Array(0xb2f0).fill(0))});
    //62E50(a2=0) wrote BF0/BF4 zero during the fresh physical body startup.
    host.effectStartup=host.sceneEffects.initialize({clockLow32:clockWords()[1],queryNative,
     bodyFieldsBySlot:adapters.map(a=>captureNativeInitialEffectBody(a,{boundaryDriftNative:{x:0,z:0}}))},{freshWebScene:true});
    host.advanceSceneEffects=()=>{
     const clock=clockWords();
     host.lastSceneEffects=host.sceneEffects.advanceMotion({clockStartWords:clock,clockEndWords:clock,queryNative,
      sineTableWords4350,angleTableWords6f08:NATIVE_ANGLE_TABLE_WORDS,
      bodyFieldsBySlot:adapters.map(a=>captureNativeEffectBody(a,{boundaryDriftNative:captureNativePhysicalBoundaryDrift(a)}))});
    };
    host.displaySceneEffects=()=>{
     const clock=clockWords(),ticket=host.sceneEffects.prepareDisplay({clockStartWords:clock,clockEndWords:clock});
     courseEffects.onDisplay(ticket.presentation);
     host.lastSceneEffectDisplay=host.sceneEffects.commitDisplay(ticket);
    };
   }
  }
  // Fresh browser inactive body slots are explicitly zero; active B64/B68
  // both come from the host's selected numeric rider profile. Retained AI
  // words are patched by890B4, never replaced with a neutral driver object.
  const profiles=Array.from({length:4},(_,i)=>adapters[i]?.hull.rider??0);
  host.aiInitialization=raceRuntime.initializeAI({hullProfilesB64:profiles,avatarsB68:profiles,
   objectTypes4c:objects?objects.snapshot().map(o=>o.runtimeKind):ice?ice.state.nodes.map(o=>o.kind):(floating?.state.objects??[]).map(o=>o.runtimeKind)});
  bindRaceWaterCameraStorage(water,raceRuntime.cameraStorage);
  bindRaceWaterAmplitudeThreshold(water,raceRuntime.waterAmplitudeThreshold);
  // The complete scene-effects owner already holds the human B2ABC levels;
  // never run the separate human-only spray state machine beside it.
  if(!host.sceneEffects)host.spray=createNativeRaceSpray({adapters,field:water.field,courseIndex:course.sourceWaterCourseIndex});
 }
 host.sprayLevels=()=>(host.sceneEffects??host.spray).levels();
 host.world=createNativeRaceWorld({adapters,water,humanIndices,craftContacts,deferWaterRollers:sourceSchedule,
 beforeFrame:sourceSchedule?(world,context)=>{
  //47B00/BF370 precedes922E4 in46DA0's outer game loop.
  if(onAudioFrame)onAudioFrame(host,context);
  //46D2C is after audio47B00 and before922E4, including simulation0.
  // This callback starts one source outer frame, not each of its five hull
  // ticks. Global browser suspension does not execute a source iteration.
  host.lastGraphicsBuffer=raceRuntime.advanceGraphicsBuffer();
  //6A264 at922E4 entry precedes control/input and physical world work.
  host.lastSourceFrameCounter=raceRuntime.advanceSourceFrameCounter();
  const menu=typeof host.menuInputs==='function'?host.menuInputs(context.time,context.logicalFrame):host.menuInputs??[];
  if(!Array.isArray(menu))throw new TypeError('Menu inputs must be a human-controller array');
  host.lastMenuInput=raceRuntime.advanceMenuInput(menu.map(value=>{
   const controls=typeof value==='function'?value(context.time,context.logicalFrame):value;
   return nativeHostMenuInput(controls);
  }));
  host.lastNavigation=raceRuntime.advanceNavigation({
   bodiesBySlot:world.adapters.map(a=>({avatar:a.hull.rider,position:{x:a.hull.center.x,z:a.hull.center.z}})),
   nodePositions:primary.snapshot().map(n=>({sourceRow:n.sourceRow,x:n.position.x,z:n.position.z}))});
  // Capture every preceding body BEFORE any descending control latch. Later
  // selected producers must not observe another racer's new control frame.
  if(sourceAI&&world.adapters.some(a=>a.controlOrigin==='ai'||a.riderLifecycle.state.selectionCountdown<0))
   host.aiBodies=world.adapters.map(a=>a.logicalFrames===0?
    nativeAIStartupBodyFields(a,raceRuntime.scene().phase650):nativeAIBodyFields(a));
 }:null,
 beforeBody:sourceSchedule?(world,{racerIndex})=>{
  const camera=humanIndices.indexOf(racerIndex),q=prepareNativePhysicalBodyWrap(world.adapters[racerIndex],{
   anchorState:bundles[racerIndex].anchorState,boundsWords24ac:water.boundaryWords24ac,
   previousCameraPositionNative:camera<0?undefined:water.previousPositions[camera]});
  // The camera preparation validates before its commit. The physical commit
  // below contains only already validated assignments, with no pose callbacks.
  raceRuntime.advanceBodyWrapCamera(racerIndex,q.driftNative);q.commit();
  if(camera>=0&&q.moved)water.previousPositions[camera]=q.previousCameraPositionNative;
 }:null,
 beforeActor:sourceSchedule?(world,{racerIndex})=>{
  const a=world.adapters[racerIndex],lifecycles=world.adapters.map(q=>q.riderLifecycle),p=a.hull.points[0].position;
  const selected=raceRuntime.resultCodeFor(racerIndex,{bodyResultCodes16c8:lifecycles.map(q=>q.state.selectedActor),
   point90Native:Object.fromEntries(['x','y','z'].map(k=>[k,F(p[k]/a.hull.scale)])),datum2458:water.field.datumNative});
  applyNativeRiderResultCodes(lifecycles,selected.operations);
  a.lastResultCodeOperations=selected.operations;
 }:null,beforeWater:sourceSchedule?world=>{
  if(onContactFrame)onContactFrame(host,world);
  //51238 observes the preceding lap judge's shared stage after all actors.
  // The water field owns datum; a render-time option cannot reset its tide.
  world.frame.water.datumNative=raceRuntime.waterDatumAfterPhysics(water.field.datumNative);
 }:null,afterTick:(_,context)=>{
  if(context.tick%5!==0)present(host);
 },afterFrame:(_,context)=>{
  if(sourceSchedule)host.lastDisplayClock=raceRuntime.advanceDisplayClock();
  present(host);
  let judging=null;
  if(raceRuntime?.ordinary)judging=raceRuntime.advanceOrdinary({
   bodiesBySlot:host.world.adapters.map(nativeRaceBodyFields),
   nodePositionsNative:primary.state.nodes.map(n=>({sourceRow:n.sourceRow,x:n.positionNative.x,z:n.positionNative.z})),
   pressedButtonsB58BySlot:host.world.adapters.map(a=>a.lastControls.pressedButtons)});
  else if(raceRuntime?.stunt)judging=raceRuntime.advanceStunt({
   bodiesBySlot:host.world.adapters.map(nativeRaceBodyFields),
   nodePositionsNative:primary.state.nodes.map(n=>({sourceRow:n.sourceRow,x:n.positionNative.x,z:n.positionNative.z})),
   pressedButtonsB58BySlot:host.world.adapters.map(a=>a.lastControls.pressedButtons)});
  else if(raceRuntime)raceRuntime.advanceClock();
  host.lastStunt=raceRuntime?.stunt?judging:null;
  //6A748 observes the completed primary body after79528 and before7DBC0.
  host.lastStuntRings=raceRuntime?.stunt?raceRuntime.advanceStuntRings(nativeRaceBodyFields(host.world.adapters[0]).positionNative):null;
  if(host.lastStuntRings)judging={...judging,effects:[...judging.effects,...host.lastStuntRings.effects]};
  // Adjudication observes contact-displaced current centers BEFORE the source
  // primary array's one motion pass. All craft share that mutable array.
  host.lastOrdinary=raceRuntime?.ordinary?judging:null;
  // Source6E3A8 reads activity624 after adjudication, before7DBC0. Free
  // objects still move in simulation0 when activity is -1; a browser pause
  // never reaches this frame callback. Keep explicit preview gates as well.
  const objectMotionActive=!sourceSchedule||raceRuntime.objectMotionActive();
  const keepRunning=host.onFrame?host.onFrame(host,context,judging):undefined;
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
  if(sourceSchedule)advanceRaceWaterRollers(water,{active:objectMotionActive,rollerState72c:raceRuntime.courseRollerState()});
  //922E4 calls B2ABC here, reading the completed bodies and AD418's
  // preceding actor pose. It replaces, never accompanies, the spray owner.
  if(host.sceneEffects)host.advanceSceneEffects();
  else if(host.spray)host.spray.advance(raceRuntime.sprayInputs(),raceRuntime.cameraStorage.read());
  if(objects)objects.afterEffects(host.world,context);
  else if(ice)ice.afterEffects(host.world,context);
  //922E4 calls AD418 after B2ABC and before the overlay/HUD update.
  if(host.courseActors)host.advanceCourseActors();
  let launchContinues=true;
  if(raceRuntime){
   host.lastHUD=sourceSchedule?raceRuntime.advanceHUD():null;
   //9328C runs ADF90 in the source display stage, once per logical frame.
   if(host.courseActors)host.displayCourseActors();
   //9328C then runs B305C over the scene buffer6A264 selected this frame.
   if(host.sceneEffects)host.displaySceneEffects();
   //9328C is a source display-stage update before1DE3CC/status, including
   // result frames. Browser presentation reads cannot advance award transfers.
   host.lastStuntDisplay=raceRuntime.stunt?raceRuntime.advanceStuntDisplay():null;
   // Original1DE3CC is after the completed world/camera/water frame and
   // before5DF4. These are completed actor values, not the input-stage pose.
   host.lastCameraInput=sourceSchedule?raceRuntime.advanceCameraInput(host.world.adapters.map(a=>({
    actorStateC54:a.lastFrame.actorState,animationFrameC58:a.lastFrame.animationFrame}))):null;
   const resultActive=sourceSchedule&&raceRuntime.resultView().active;
   const resultGeometry=resultActive&&raceRuntime.championshipLaunch?{
    bodyPositionsNativeBySlot:host.world.adapters.map(a=>nativeRaceBodyFields(a).positionNative),
    nodePositionsNative:primary.state.nodes.map(n=>({sourceRow:n.sourceRow,x:n.positionNative.x,z:n.positionNative.z}))}:undefined;
   const status=sourceSchedule?(resultActive?raceRuntime.advanceResult(resultGeometry):
    raceRuntime.advanceStatus(host.world.adapters.map(a=>a.riderLifecycle.state.selectedActor))):null;
   const launch=status?{...judging,effects:[...judging.effects,...host.lastHUD.effects,...host.lastCameraInput.effects,...status.effects],view:status.view}:
    raceRuntime.advanceLaunch(host.world.adapters.map(a=>a.lastControls.pressedButtons));
   if(onLaunchFrame&&onLaunchFrame(host,context,launch)===false)launchContinues=false;
  }
  if(sourceSchedule)host.lastInputClock=raceRuntime.advanceInputClock();
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

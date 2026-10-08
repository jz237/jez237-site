import {recoverSaveImport,BACKUP_JOURNAL} from './save-backup';
import {mountSaveBackup} from './save-backup-ui';
import {CAREER_GROUPS,careerChallenge,careerStatus,unlockCareerGroup} from './career';
import {showCareer} from './career-ui';
import './career.css';
import {loadGhostLibrary,saveGhostLibrary,findTrialGhost,settleTrialGhost,TrialGhostRecorder,type TrialGhost} from './trial-ghost';
import {TrialGhostView} from './trial-ghost-view';
import {formatTrialDelta} from './time-trial';
import {createRedbankWorld} from './redbank-world';
import {DAMAGE_RULES,sessionDamageRule,collisionDamageMultiplier,damageRecordKey} from './damage-rules';
import {eventGridSetup} from './grid-setup';
import {gridCarKind,gridRecordKey,GRID_LINEUPS,GRID_PERFORMANCE} from './grid-rules';
import {timedRaceLimit,timedRaceFinished,timedRaceOrder,timedRaceResult,timedRaceRecordScore} from './timed-race';
import {RaceRecovery,freeRecoverySlot} from './race-recovery';
import {stallHint} from './engine-stall';
import {AI_DIFFICULTIES,readAIDifficulty,sessionAIDifficulty,difficultyRecordKey} from './ai-difficulty';
import {withWreckBatch} from './wreck-batch';
import {CollisionScars,captureCollisionMotion,collisionPointVelocity} from './collision-contact';
import {COURSE_NAMES,resolveCourseId,type CourseId} from './course-id';
import {getRaceCourse,courseRoute,courseGridSlot,courseRecoverySlot,type RaceCourse} from './race-course';
import {createIronfieldWorld} from './ironfield-world';
import {createBrackenWorld} from './bracken-world';
import {createCinderbankWorld} from './cinderbank-world';
import {tyreWarning} from './tyre-feedback';
import {engineStatus} from './engine-condition';
import {drivingObstacleClearance} from './driving-probe';
import {vehicleContact,vehicleContactManifold} from './vehicle-contact';
import {CAR_KINDS} from './rules';
import {DEMO_KEY,readDemoOptions,showDemoSetup,nextDemoMode,demoCarKind,demoVehicleSetup} from './demo-session';
import {restoreOnlineProgress,onlineEventLabel} from './online-events';
import type {OnlineSelection} from './online-livery';
import {copyOnlineSetup} from './online-setup';
import {frameGarage} from './garage-camera';
import type {LiveryFace} from './livery';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { QuarryAO, LocalReflections } from './rendering';
import { StaticQuarryShadows, DAYLIGHT_DIRECTION, DAYLIGHT_DISTANCE } from './static-shadows';
import { prepareNorthForestFloor } from './scenery-north-floor';
import { northForestDiagnostics } from './scenery-north-forest';
import { northRidgeDiagnostics } from './scenery-north-ridge';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { loadCars, environment } from './assets';
import { prepareArenaFloor } from './scenery-arena-material';
import {prepareReferenceFloor} from './scenery-reference-floor';
import {CHASE_VIEW,chaseComposition,QUARRY_DAYLIGHT} from './quarry-art-direction';
import {drawInstruments} from './instruments';
import {drawQuarryMap} from './quarry-minimap';
import { prepareCircuitSurface } from './scenery-circuit-material';
import { Quarry } from './world';
import { Vehicle, type Input } from './vehicle';
import { Effects } from './effects';
import { VehicleFire } from './vehicle-fire';
import {PuddleSplashes} from './puddle-splashes';
import {DERBY_ARENA} from './derby-arena';
import {impactAudioSeverity} from './bodywork-response';
import {ImpactAdjudicator,type ImpactContact} from './impact-adjudication';
import {VehicleThermalState} from './vehicle-thermal-state';
import {unitNoise} from './vehicle-fire-profile';
import {DrivingBrain} from './driving-brain';
import {cameraObstruction} from './demo-camera-visibility';
import {DemoDirector, DEMO_CAMERAS, type DemoCamera} from './demo-director';
import { Sound } from './audio';
import { OnlineView } from './online-view';
import { OnlineUI } from './online-ui';
import { scenerySurfaceHeight, quarryExtensionHeight, quarryWestWallHeight, landscapeHeight } from './quarry-layout';
import {
  DEFINITIONS,
  clamp,
  wrap,
  trackPoint,
  terrainHeight,
  type Mode,
  type CarKind,
} from './rules';
import { GARAGE_KEY, readGarage, stockSetup, type Setup } from './garage';
import { showGarage } from './garage-ui';
import { SessionTelemetry } from './session-telemetry';
import { CHALLENGES, challengeValue, formatChallengeValue, challengeVenueName, type Challenge, type Discipline } from './challenges';
import { PROFILE_KEY, readProfile, settleRun, type Award } from './progression';
import { showDriverProfile, awardText, MEDALS } from './profile-ui';
import {EVENT_KEY,readEventOptions,circuitRoute,raceGridSlot,derbyGridSlot,checkRoute,lapProgress,CombatScoreboard,eventDerbyOrder,stepScoreRespawns} from './event-rules';
import {showEventSetup} from './event-ui';
import {loadTimeTrialRecords,saveTimeTrialRecords,isTimeTrialConfig,timeTrialBest,formatTrialTime,finishTimeTrialRecord,type TimeTrialConfig,type TimeTrialResult} from './time-trial';
import {showTimeTrialSetup,showTimeTrialResult} from './time-trial-ui';
import {CLUB_CUP_KEY,CLUB_ROUNDS,clubRounds,clubSeries,createClubCup,readClubCup,beginClubRound,finishClubRound,clubRoundRunId,replayCupAwards,type ClubCupState,type ClubRowInput} from './club-cup';
import {showClubCup} from './club-cup-ui';
import {CLUB_RECORDS_KEY,readClubRecords,recordClubFinish} from './club-records';
import type {RunStats} from './session-telemetry';
import {ReplayRecorder,readReplayFile,replayCourseId,type ReplayDocument} from './replay-data';
import {ReplayScene,captureReplayFrame} from './replay-scene';
import {ReplayStudio} from './replay-studio';
import {showReplayLibrary} from './replay-library-ui';
import {WaypointRace,WAYPOINTS} from './waypoint-race';
import {WaypointMarkers} from './waypoint-markers';
import {directionForCar,RACE_NAMES} from './event-rules';
import {CONTROLS_KEY,readControls,drivingInput,keyLabel,selectedPad} from './driving-controls';
import {ControllerInput} from './controller-input';
import {ControllerNavigation,type NavigationContext} from './controller-navigation';
import {mountDrivingControls} from './driving-controls-ui';
import './style.css';
const ui = document.querySelector<HTMLDivElement>('#ui')!;
const canvas = document.querySelector<HTMLCanvasElement>('#game')!;
const controllerInput=new ControllerInput(),controllerNavigation=new ControllerNavigation();
const controllerHelp=document.createElement('div');controllerHelp.className='controller-help';controllerHelp.hidden=true;document.body.append(controllerHelp);
let recoveryStorage:Storage|undefined;try{recoveryStorage=localStorage;recoveryStorage.getItem(BACKUP_JOURNAL);}catch{recoveryStorage=undefined;}
try{if(recoveryStorage)recoverSaveImport(recoveryStorage);}catch{ui.innerHTML='<div class=overlay><section class=dialog><h2>SAVE RECOVERY PAUSED</h2><p>Your previous save is retained in a recovery record. Free browser storage and retry to finish recovery before playing.</p><button id=save-recovery-retry>RETRY RECOVERY</button></section></div>';ui.querySelector<HTMLButtonElement>('#save-recovery-retry')!.onclick=()=>location.reload();throw new Error('Save recovery must complete before the game can load.');}
const saveKey = 'quarry-impact-v1';
let saved: any = {};
try {
  saved = JSON.parse(localStorage.getItem(saveKey) ?? '{}');
} catch {}
const settings = {
  quality: saved.quality ?? 'ultra',
  performance: saved.performance === true,
  engine: saved.engine ?? 0.72,
  effects: saved.effects ?? 0.8,
  ambience: saved.ambience ?? 0.45,
};
let drivingControls=readControls();
try{drivingControls=readControls(localStorage.getItem(CONTROLS_KEY));}catch{}
let garage=readGarage();
try { garage=readGarage(localStorage.getItem(GARAGE_KEY)); } catch {}
let garageFace:LiveryFace='right';
let careerOpen=false,careerRun=false;
let garageOpen=false,profileOpen=false,eventSetupOpen=false,clubOpen=false;
let clubCup:ClubCupState|null=null,clubWarning='';
try{const stored=localStorage.getItem(CLUB_CUP_KEY);clubCup=readClubCup(stored);if(stored&&!clubCup)clubWarning='The saved cup could not be read. You can start a new cup.';}catch{clubWarning='Cup saving is unavailable in this browser.';}
let clubRecords=readClubRecords();
try{clubRecords=readClubRecords(localStorage.getItem(CLUB_RECORDS_KEY));}catch{}
let activeClubRound:number|null=null,clubRetired=false,clubPlayerStopped=false,clubFirstFinish:number|null=null;
let clubPlayerRow:ClubRowInput|null=null,clubRunStats:RunStats|undefined;
const clubRound=()=>activeClubRound===null?null:clubRounds(clubCup)[activeClubRound];
let eventOptions=readEventOptions();
try{eventOptions=readEventOptions(localStorage.getItem(EVENT_KEY));}catch{}
const combat=new CombatScoreboard();
const eventFrameTimes:number[]=[];
const customEvent=()=>activeClubRound===null&&!activeChallenge&&!activeTimeTrial&&!online?.active;
const aiDifficulty=()=>activeClubRound!==null?readAIDifficulty(clubCup?.difficulty):sessionAIDifficulty(customEvent()&&mode!=='playground',demo,eventOptions.difficulty,demoOptions.difficulty);
let waypointRace:WaypointRace|null=null,waypointMarkers:WaypointMarkers|undefined;
const onlineRules=()=>online?.active?online.network.snapshot?.event?.rules:undefined;
const raceFormat=()=>demo?'laps':onlineRules()?.race??(customEvent()?eventOptions.race:'laps');
const damageRule=()=>sessionDamageRule(customEvent()&&mode!=='playground',demo,eventOptions.damage,demoOptions.damage);
const raceTimeLimit=()=>timedRaceLimit(mode,customEvent(),demo,raceFormat(),eventOptions,demoOptions);
const raceDirection=(id=0)=>directionForCar(raceFormat()==='laps'?(onlineRules()?.direction??clubRound()?.direction??activeTimeTrial?.direction??(customEvent()?eventOptions.direction:'forward')):'forward',id);
const raceRoute=(id=0)=>waypointRace?.get(id).nav?.route??courseRoute(activeVenue.course,raceDirection(id));
const scoreDerby=()=>mode==='derby'&&(online?.active?onlineRules()?.derby==='score':customEvent()&&eventOptions.derby==='score');
const derbyRanking=()=>online?.active?online.network.snapshot!.ranking.map(id=>cars.find(c=>c.id===id)!):eventDerbyOrder(cars,scoreDerby(),combat);
const eventDuration=()=>clubRound()?.duration??activeChallenge?.limit??(demo?demoOptions.duration:online?.active?onlineRules()?.duration??300:eventOptions.duration);
function openEventSetup(){eventSetupOpen=true;keys.clear();showEventSetup(ui,eventOptions,()=>{eventSetupOpen=false;menu();},()=>{try{localStorage.setItem(EVENT_KEY,JSON.stringify(eventOptions));return true;}catch{return false;}},kind);}
const initialTimeTrial=loadTimeTrialRecords();
let timeTrialRecords=initialTimeTrial.records,timeTrialWarning=initialTimeTrial.warning;
let activeTimeTrial:Readonly<TimeTrialConfig>|null=null,timeTrialSelection:TimeTrialConfig|undefined;
let timeTrialOpen=false,timeTrialInvalidReason='',timeTrialResult:TimeTrialResult|null=null;
let trialGhostLibrary=loadGhostLibrary(),trialGhostWarning='';
let trialGhostRecorder:TrialGhostRecorder|null=null,trialGhostView:TrialGhostView|null=null,trialGhostTarget:TrialGhost|null=null;
let trialGhostSplit='';
function beginTrialGhost(){
  trialGhostView?.dispose();trialGhostView=null;trialGhostRecorder=null;trialGhostTarget=null;trialGhostSplit='';
  if(!activeTimeTrial)return;
  trialGhostRecorder=new TrialGhostRecorder(activeTimeTrial);
  trialGhostRecorder.sample(0,cars[0].current,cars[0].currentQ);
  trialGhostTarget=findTrialGhost(trialGhostLibrary,activeTimeTrial,timeTrialBest(timeTrialRecords,activeTimeTrial));
  if(trialGhostLibrary.enabled&&trialGhostTarget)trialGhostView=new TrialGhostView(scene,cars[0].root,trialGhostTarget);
}
function finishTrialGhost(config:TimeTrialConfig,result:TimeTrialResult){
  const recording=trialGhostRecorder?.finish(cars[0].finishTime,cars[0].current,cars[0].currentQ)??null;
  trialGhostLibrary=settleTrialGhost(trialGhostLibrary,config,result,recording);
  if(result.eligible&&result.newBest){
    const saved=saveGhostLibrary(trialGhostLibrary);
    trialGhostWarning=!saved?'Ghosts are available for this session, but browser storage could not save them.':
      recording?'Personal-best ghost saved. Race it on your next attempt.':'Personal best saved without a ghost. Ghost recording supports laps up to ten minutes.';
  }
  trialGhostRecorder=null;
}
function updateTrialGhost(){
  if(!activeTimeTrial){trialGhostView?.dispose();trialGhostView=null;trialGhostRecorder=null;trialGhostTarget=null;return;}
  trialGhostView?.update(Math.max(0,elapsed-(1-Math.min(1,accumulator/(1/60)))/60),!studio&&['countdown','playing','paused'].includes(state),cars[0].root.position);
}

function openTimeTrialSetup(){
  if(preparingEvent||online?.active)return;
  timeTrialOpen=true;keys.clear();
  const config:TimeTrialConfig={kind,course:timeTrialSelection?.course??resolveCourseId(eventOptions.course),direction:timeTrialSelection?.direction??(eventOptions.direction==='reverse'?'reverse':'forward')};
  showTimeTrialSetup(ui,config,timeTrialRecords,{start:config=>{void startTimeTrial(config);},close:()=>{timeTrialOpen=false;menu();}},[timeTrialWarning,trialGhostWarning].filter(Boolean).join(' '),{
    enabled:trialGhostLibrary.enabled,
    change:enabled=>{trialGhostLibrary={...trialGhostLibrary,enabled};if(!saveGhostLibrary(trialGhostLibrary))trialGhostWarning='Ghost preference could not be saved; it applies for this session.';},
    status:selected=>findTrialGhost(trialGhostLibrary,selected,timeTrialBest(timeTrialRecords,selected))?'Personal-best ghost ready.':'Set a new personal best to record a ghost for this selection.',
  });
}
async function startTimeTrial(config:TimeTrialConfig){
  if(preparingEvent||online?.active||!isTimeTrialConfig(config)||!['menu','result'].includes(state))return false;
  bankRun(false);telemetry=null;activeChallenge=undefined;activeClubRound=null;clubOpen=false;timeTrialOpen=false;
  activeTimeTrial=Object.freeze({...config});timeTrialSelection={...config};kind=config.kind;mode='race';
  return start(false);
}
function finishTimeTrial(){
  const config=activeTimeTrial;if(!config)return;
  const player=cars[0],run=telemetry?.stats??null;
  if(run)Object.assign(run,{completed:true,finished:player.finished&&player.health>0,health:player.health,rank:0,won:false,checkpoints:player.passed});
  const outcome=finishTimeTrialRecord(timeTrialRecords,config,{run,finished:player.finished,health:player.health,passed:player.passed,finishTime:player.finished?player.finishTime:elapsed+player.penalty,demo,online:!!online?.active,synthetic:autopilot||!!testInput||!!timeTrialInvalidReason&&timeTrialInvalidReason!=='RECOVERY USED',stock:cars.length===1&&player.kind===config.kind&&activeVenue.course.id===config.course&&raceDirection()===config.direction&&JSON.stringify(player.setup)===JSON.stringify(stockSetup(player.kind))});
  timeTrialRecords=outcome.records;timeTrialResult=outcome.result;
  finishTrialGhost(config,timeTrialResult);
  if(timeTrialResult.eligible)timeTrialWarning=saveTimeTrialRecords(timeTrialRecords)?'':'Personal bests are available for this session, but browser storage could not save them.';
  bankRun(true);keys.clear();testInput=null;
  showTimeTrialResult(ui,config,timeTrialResult,{
    retry:()=>{void start(false);},
    setup:()=>{createCars(true);menu();openTimeTrialSetup();},
    close:()=>{createCars(true);menu();},
  },[timeTrialWarning,trialGhostWarning,profileStorageWarning,awardText(lastAward)].filter(Boolean).join(' '));
  const replayActions=document.createElement('div');replayActions.className='event-actions';ui.querySelector('#time-trial-result .event-panel')!.append(replayActions);studioButtons(replayActions);
  ui.querySelector<HTMLButtonElement>('#replay-mode')!.onclick=()=>openStudio(false,undefined,`${COURSE_NAMES[config.course]} · Time Trial · ${DEFINITIONS[config.kind].name} · ${config.direction}`);
}
let profile=readProfile();
try{profile=readProfile(localStorage.getItem(PROFILE_KEY));}catch{}
let profileStorageWarning='';
let activeChallenge:Challenge|undefined;
let telemetry:SessionTelemetry|null=null,runId='',runSettled=true,lastAward:Award|null=null;
const raceLaps=()=>clubRound()?.laps??(online?.active?onlineRules()?.laps??3:activeTimeTrial?1:activeChallenge?.laps??(demo?demoOptions.laps:eventOptions.laps));
function bankRun(completed:boolean){
  if(!telemetry||runSettled||demo||online?.active||activeClubRound!==null)return;
  syncClubAwards();
  runSettled=true;
  const run=telemetry.stats;run.completed=completed;
  lastAward=settleRun(profile,runId,run,activeChallenge);
  try{localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));profileStorageWarning='';}catch{profileStorageWarning='Progress is available for this session, but browser storage could not save it.';}
}
function openProfile(initialDiscipline:Discipline='racing'){
  profileOpen=true;keys.clear();
  showDriverProfile(ui,profile,{close:()=>{profileOpen=false;menu();},start:challenge=>{profileOpen=false;careerRun=false;activeTimeTrial=null;activeChallenge=challenge;mode=challenge.mode;kind=challenge.car;void start(false);}},profileStorageWarning,initialDiscipline);
}
function openCareer(discipline:Discipline='racing',notice=''){
  if(preparingEvent||online?.active||!['menu','result'].includes(state))return;
  careerOpen=true;keys.clear();
  showCareer(ui,profile,{
    close:()=>{careerOpen=false;menu();},
    unlock:id=>{
      if(!careerOpen||preparingEvent||online?.active)return;
      const next=unlockCareerGroup(profile,id);if(!next)return;
      const group=careerGroupForId(id);
      try{localStorage.setItem(PROFILE_KEY,JSON.stringify(next));profile=next;profileStorageWarning='';openCareer(group, 'Group opened. Choose an event.');}
      catch{openCareer(group,'Could not save this unlock. Your points have not been spent.');}
    },
    start:id=>{void startCareerEvent(id);},
  },[notice,profileStorageWarning].filter(Boolean).join(' '),discipline);
}
function careerGroupForId(id:string):Discipline{return CAREER_GROUPS.find(g=>g.id===id)?.discipline??'racing';}
async function startCareerEvent(id:string){
  if(!careerOpen||preparingEvent||online?.active||!['menu','result'].includes(state))return false;
  const challenge=careerChallenge(profile,id);if(!challenge)return false;
  careerOpen=false;profileOpen=false;careerRun=true;activeTimeTrial=null;activeClubRound=null;activeChallenge=challenge;mode=challenge.mode;kind=challenge.car;
  const ok=await start(false);
  if(!ok&&state==='menu')openCareer(challenge.discipline,'The event could not start. Your saved progress is unchanged.');
  return ok;
}
function saveClubCup(){
  if(!clubCup)return false;
  try{localStorage.setItem(CLUB_CUP_KEY,JSON.stringify(clubCup));clubWarning='';return true;}
  catch{clubWarning='Cup progress is available this session, but browser storage could not save it. Keep this page open to continue.';return false;}
}
function syncClubAwards(){
  if(!clubCup?.results.length)return;
  const saved=saveClubCup(),awards=replayCupAwards(profile,clubCup,saved),fresh=awards.filter(a=>!a.duplicate);
  // Even if the cup write failed, keep already-awarded receipts pinned before an ordinary run saves the profile.
  if(!saved)return;
  if(clubCup.phase==='complete'){
    clubRecords=recordClubFinish(clubRecords,clubCup);
    try{localStorage.setItem(CLUB_RECORDS_KEY,JSON.stringify(clubRecords));}
    catch{clubWarning='This cup is saved, but championship records could not be saved. Keep this completed cup until browser storage is available.';}
  }
  if(fresh.length)lastAward=fresh.at(-1)!;
  try{localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));profileStorageWarning='';}
  catch{profileStorageWarning='Cup results are saved. Driver XP will be recovered when profile saving is available.';}
}
function closeClubCup(){clubOpen=false;createCars(true);menu();}
function openClubCup(notice=''){
  keys.clear();clubOpen=true;syncClubAwards();if(notice)clubWarning=[notice,clubWarning].filter(Boolean).join(' ');
  showClubCup(ui,clubCup,kind,{
    create:(series,difficulty,lineup)=>{clubCup=createClubCup(kind,crypto.randomUUID(),Date.now(),series,difficulty,lineup);saveClubCup();openClubCup();},
    start:()=>{void startClubRound();},close:closeClubCup,
    abandon:()=>{try{localStorage.removeItem(CLUB_CUP_KEY);clubCup=null;clubWarning='';}catch{clubWarning='The saved cup could not be reset. Please try again.';}openClubCup();},
  },[clubWarning,profileStorageWarning].filter(Boolean).join(' '),clubRecords);
  if(state==='result')studioButtons(ui.querySelector('.club-actions'));
}
async function startClubRound(){
  if(!clubCup||clubCup.phase==='complete'||preparingEvent)return false;
  // Leaving/restarting an unfinished round never settles a partial attempt.
  clubCup=beginClubRound(clubCup);saveClubCup();activeClubRound=clubCup.results.length;
  clubRetired=false;clubPlayerStopped=false;clubFirstFinish=null;clubPlayerRow=null;clubRunStats=undefined;
  clubOpen=false;activeTimeTrial=null;timeTrialOpen=false;activeChallenge=undefined;demo=false;kind=clubCup.roster[0].kind;mode=clubRound()!.mode;
  const index=activeClubRound,id=clubRoundRunId(clubCup,index),ok=await start(false);
  if(ok){runId=id;return true;}
  if(state==='menu')openClubCup('The round could not start. Your earlier results are retained; try the round again.');
  return false;
}
function clubRow(car:Vehicle):ClubRowInput{
  if(car.id===0&&clubPlayerRow)return clubPlayerRow;
  return {slot:car.id,status:car.id===0&&clubRetired?'retired':mode==='race'&&car.finished?'finished':car.health<=0?'wrecked':mode==='derby'?'survived':'dnf',finishTime:mode==='race'&&car.finished?car.finishTime:null,health:car.health,progress:car.passed,damage:car.inflicted};
}
function freezeClubPlayer(retired=false){
  if(activeClubRound===null||clubPlayerStopped)return;
  clubRetired=retired;clubPlayerStopped=true;keys.clear();testInput=null;
  const player=cars[0];clubPlayerRow=clubRow(player);
  if(telemetry){Object.assign(telemetry.stats,{seconds:player.finished?player.finishTime:elapsed+player.penalty,health:player.health,finished:player.finished&&!retired,checkpoints:Math.max(0,player.passed)});clubRunStats=structuredClone(telemetry.stats);}
  telemetry=null;runSettled=true;
}
function finishClubEvent(){
  if(activeClubRound===null||!clubCup||clubCup.phase!=='running')return;
  freezeClubPlayer();
  clubCup=finishClubRound(clubCup,cars.map(clubRow),clubRunStats,activeClubRound);
  state='result';keys.clear();testInput=null;sound.pause(true);telemetry=null;runSettled=true;
  // Save the canonical result before mutating/persisting the profile award.
  syncClubAwards();openClubCup();
}
let recorder:ReplayRecorder|null=null,lastReplay:ReplayDocument|null=null,replayEpochs:number[]=[];
let closeReplayLibrary:(()=>void)|null=null;
let studio:ReplayStudio|null=null,studioRestore:(()=>void)|null=null;
function captureReplay(force=false){if(recorder&&!studio&&!online?.active)recorder.capture(elapsed,()=>captureReplayFrame(cars,activeVenue.props,replayEpochs,recorder!.meta.tyreModel,recorder!.meta.engineModel),force);}
function archiveReplay(){
  if(!recorder)return;captureReplay(true);if(recorder.frames.length>1)lastReplay=recorder.document();
  for(const car of cars)car.onVisualEvent=undefined;recorder=null;
}
function beginReplay(){
  lastReplay=null;replayEpochs=cars.map(()=>0);
  recorder=new ReplayRecorder({version:1,tyreModel:1,engineModel:1,...(activeVenue.course.id==='quarry-v1'?{}:{courseId:activeVenue.course.id}),mode,reverse:mode==='race'&&(clubRound()?clubRound()!.direction==='reverse':activeTimeTrial?activeTimeTrial.direction==='reverse':customEvent()&&eventOptions.direction==='reverse'),cars:cars.map(c=>({id:c.id,kind:c.kind,setup:{...structuredClone(c.setup),paint:c.paintColor.getHex()}})),props:activeVenue.props.length,created:new Date().toISOString()});
  cars.forEach((car,i)=>car.onVisualEvent=e=>{if(e.kind==='jump'||e.kind==='repair')replayEpochs[i]++;recorder?.event(i,elapsed,e);});
  cars.forEach(c=>c.render(1));captureReplay(true);
}
function closeStudio(){const restore=studioRestore;studio=null;studioRestore=null;restore?.();}
function openStudio(photo=false,document?:ReplayDocument,savedName?:string):boolean{
  if(studio||online?.active||preparingEvent)return false;
  let doc=photo?null:document??recorder?.document()??lastReplay;
  if(!photo&&(!doc||doc.frames.length<2)){if(document)throw Error('This replay needs at least two frames.');return false;}
  // Imported identity and layout must be accepted before recording or scene changes.
  const targetId=doc?replayCourseId(doc.meta):activeVenue.course.id;
  if(doc&&doc.meta.props!==(targetId==='quarry-v1'?quarry.props.length:0))throw Error('This replay uses an unsupported course layout.');
  const targetVenue=ensureVenue(targetId);
  captureReplay(true);if(!photo&&!document&&recorder)doc=recorder.document();
  const returnState=state,returnMode=mode,returnVenue=activeVenue,oldQuarryMode=quarryMode,oldCars=cars,oldNodes=Array.from(ui.childNodes);
  const savedCamera={p:camera.position.clone(),q:camera.quaternion.clone(),fov:camera.fov,exposure:renderer.toneMappingExposure,target:orbit.target.clone(),enabled:orbit.enabled,pan:orbit.enablePan,max:orbit.maxDistance,min:orbit.minDistance};
  const quarryVisibility:Array<[T.Object3D,boolean]>=[];quarryVenue.root.traverse(o=>quarryVisibility.push([o,o.visible]));
  const quarryEnabled:Array<[R.Collider,boolean]>=[...new Map([...quarry.collisionPhysics.statics.values(),...quarry.arenaPhysics.walls].map(c=>[c.handle,c])).values()].map(c=>[c,c.isEnabled()]);
  const hidden=new Map<T.Object3D,boolean>();let view:ReplayScene|null=null,restored=false;
  const hide=(o:T.Object3D|undefined)=>{if(o&&!hidden.has(o)){hidden.set(o,o.visible);o.visible=false;}};
  const restore=()=>{
    if(restored)return;restored=true;view?.dispose();cars=oldCars;mode=returnMode;
    quarryMode=oldQuarryMode;quarry.setMode(oldQuarryMode,false);quarryEnabled.forEach(([c,enabled])=>c.setEnabled(enabled));
    hidden.forEach((visible,o)=>o.visible=visible);quarryVisibility.forEach(([o,visible])=>o.visible=visible);
    activateVenue(returnVenue);refreshVenueLighting();
    ui.replaceChildren(...oldNodes);if(closeReplayLibrary)ui.querySelector<HTMLInputElement>('#library-search')?.focus();state=returnState;
    camera.position.copy(savedCamera.p);camera.quaternion.copy(savedCamera.q);camera.fov=savedCamera.fov;camera.updateProjectionMatrix();renderer.toneMappingExposure=savedCamera.exposure;
    orbit.target.copy(savedCamera.target);orbit.enabled=savedCamera.enabled;orbit.enablePan=savedCamera.pan;orbit.maxDistance=savedCamera.max;orbit.minDistance=savedCamera.min;
    lastFrame=performance.now();accumulator=0;sound.pause(!['playing','countdown','menu'].includes(returnState));
  };
  try{
    if(doc)view=new ReplayScene(doc,scene,targetVenue.physics,targetVenue.props,targetVenue.course);
    keys.clear();sound.pause(true);state='studio';
    if(doc){
      for(const car of oldCars)hide(car.root);for(const prop of returnVenue.props)hide(prop.mesh);for(const prop of targetVenue.props)hide(prop.mesh);
      for(const o of [fx.points,fx.marks,...fx.debris.map(d=>d.mesh),vehicleFire?.mesh,...(vehicleFire?.lights??[]),puddleSplashes?.spray,puddleSplashes?.rings,fx.evidence.mesh])hide(o);
      activateVenue(targetVenue);cars=view!.cars;mode=doc.meta.mode;setQuarryMode();view!.props.forEach(p=>staticShadows?.bindReceivers(p));
    }
    hide(activeVenue.checkpoint);studioRestore=restore;
    studio=new ReplayStudio(ui,cars,doc,time=>view?.seekChunk(time),closeStudio,savedCamera.exposure,savedName,activeVenue.course.height);return true;
  }catch(error){studio=null;studioRestore=null;restore();throw error;}
}
function studioButtons(container:Element|null){
  if(!container||online?.active)return;
  const photo=document.createElement('button');photo.className='small-button studio-link';photo.id='photo-mode';photo.textContent='PHOTO MODE';photo.onclick=()=>openStudio(true);container.append(photo);
  const replay=document.createElement('button');replay.className='small-button studio-link';replay.id='replay-mode';replay.textContent='WATCH REPLAY';replay.disabled=(recorder?.frames.length??lastReplay?.frames.length??0)<2;replay.onclick=()=>openStudio();container.append(replay);
}
function replayMenu(){
  const footer=ui.querySelector('.footer>div');if(!footer)return;
  const library=document.createElement('button');library.id='replay-library-open';library.textContent='REPLAY LIBRARY';library.onclick=()=>{if(closeReplayLibrary)return;keys.clear();closeReplayLibrary=showReplayLibrary(ui,(doc,name)=>{if(!openStudio(false,doc,name))throw Error('Finish the current game action before opening a replay.');lastReplay=doc;watch.disabled=false;},()=>{closeReplayLibrary=null;library.focus();});};footer.prepend(library);
  const watch=document.createElement('button');watch.id='replay-last';watch.textContent='LAST REPLAY';watch.disabled=!lastReplay;watch.onclick=()=>openStudio();footer.prepend(watch);
  const load=document.createElement('button');load.id='replay-open';load.textContent='OPEN REPLAY';footer.prepend(load);
  load.onclick=()=>{const input=document.createElement('input');input.type='file';input.accept='.qir';input.hidden=true;input.id='replay-file';ui.append(input);input.oncancel=()=>input.remove();input.onchange=async()=>{const file=input.files?.[0];if(!file)return;load.disabled=true;load.textContent='OPENING…';try{const doc=await readReplayFile(file);if(!openStudio(false,doc))throw Error('Finish the current game action before opening a replay.');lastReplay=doc;watch.disabled=false;}catch(error){let note=ui.querySelector('#replay-message');if(!note){note=document.createElement('p');note.id='replay-message';note.className='last-award';ui.querySelector('.intro')?.append(note);}note.textContent=error instanceof Error?error.message:'Replay could not be opened.';}finally{load.disabled=false;load.textContent='OPEN REPLAY';input.remove();}};input.click();};
}
const cameraImpactOffset = new T.Vector3();
const sound = new Sound();
let vehicleFire:VehicleFire | undefined;
let puddleSplashes:PuddleSplashes|undefined;
const raceRecovery=new RaceRecovery();
const drivers=new DrivingBrain(DERBY_ARENA),director=new DemoDirector(DERBY_ARENA,(from,to,car)=>cameraObstruction(physics,from,to,car.body,true),(x,z)=>activeVenue.course.height(x,z));
let demo=false,demoRestart=0,demoHudHidden=false;
let demoOptions=readDemoOptions();try{demoOptions=readDemoOptions(localStorage.getItem(DEMO_KEY));}catch{}
let preparingEvent=false,preparationInterrupted=false;
sound.levels = {
  engine: settings.engine,
  effects: settings.effects,
  ambience: settings.ambience,
};
let mode: Mode = 'derby',
  kind: CarKind = 'coupe',
  state:
    | 'loading'
    | 'menu'
    | 'lobby'
    | 'countdown'
    | 'playing'
    | 'paused'
    | 'result'
    | 'wrecked'
    | 'inspect'
    | 'studio' = 'loading';
let resumeState = 'playing';
let wreckHold = 0;
let cars: Vehicle[] = [];
let elapsed = 0,
  countdown = 3.5,
  accumulator = 0,
  clock = 0,
  lastFrame = performance.now(),
  hudTime = 0;
let hood = false,
  traffic = true,
  autopilot = false,
  resultTitle = '',
  statusMessage = '',
  statusUntil = 0;
let qualityScale = 1;
const frames: number[] = [];
let capturedFrames:number[]|null=null;
let benchmarkStart = 0;
const benchmarkSamples: {
  time: number;
  fps: number;
  geometries: number;
  textures: number;
  heap: number;
}[] = [];
let collisions = 0;
const impactAdjudicator = new ImpactAdjudicator();
const collisionScars = new CollisionScars();
let keys = new Set<string>();
let testInput: Input | null = null;
const renderer = new T.WebGLRenderer({
  canvas,
  antialias: false, // Composer renders offscreen; SMAA supplies final edge antialiasing.
  powerPreference: 'high-performance',
});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = T.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate = false;
renderer.toneMapping = T.ACESFilmicToneMapping;
renderer.toneMappingExposure = QUARRY_DAYLIGHT.exposure;
renderer.outputColorSpace = T.SRGBColorSpace;
renderer.info.autoReset = false;
const scene = new T.Scene();
const camera = new T.PerspectiveCamera(52, innerWidth / innerHeight, 0.1, 850);
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const ao = new QuarryAO(scene, camera);
const reflections = new LocalReflections(renderer, scene);
composer.addPass(ao);
composer.addPass(new OutputPass());
composer.addPass(new SMAAPass());
const orbit = new OrbitControls(camera, canvas);
orbit.enabled = false;
orbit.minDistance = 2.5;
orbit.maxDistance = 22;
orbit.maxPolarAngle = Math.PI * 0.48;
orbit.enableDamping = true;
let physics: R.World, events: R.EventQueue, quarry: Quarry, fx: Effects;
type VenueContext={course:RaceCourse;physics:R.World;root:T.Group;checkpoint:T.Group;props:Quarry['props'];puddles:Quarry['puddles'];dispose?:()=>void};
let quarryVenue:VenueContext,activeVenue:VenueContext;
const raceVenues:Partial<Record<Exclude<CourseId,'quarry-v1'>,VenueContext>>={};
let quarryMode:Mode='derby';
const preferredCourse=():CourseId=>clubRound()?.course??(mode==='race'&&!online?.active&&raceFormat()==='laps'?resolveCourseId(activeTimeTrial?.course??(activeChallenge?activeChallenge.course:demo?demoOptions.course:eventOptions.course)):'quarry-v1');
const raceLabel=(id:CourseId)=>id==='quarry-v1'?'QUARRY CIRCUIT':COURSE_NAMES[id].toUpperCase();
const eventLabel=()=>mode==='race'?raceLabel(activeVenue.course.id):modes[mode].label;
function ensureVenue(id:CourseId):VenueContext{
  if(id==='quarry-v1')return quarryVenue;
  const cached=raceVenues[id];if(cached)return cached;
  const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;
  let artwork:{root:T.Group;dispose():void}|undefined;
  try{
    const course=getRaceCourse(id);course.buildPhysics!(R,world);artwork=id==='redbank-jump-v1'?createRedbankWorld():id==='bracken-rallycross-v1'?createBrackenWorld():id==='cinderbank-oval-v1'?createCinderbankWorld():createIronfieldWorld();
    const checkpoint=quarry.checkpoint.clone(true);checkpoint.name=id+'_checkpoint';checkpoint.visible=false;artwork.root.add(checkpoint);artwork.root.visible=false;scene.add(artwork.root);
    const venue:VenueContext={course,physics:world,root:artwork.root,checkpoint,props:[],puddles:[],dispose:()=>{checkpoint.removeFromParent();artwork!.dispose();world.free();}};
    raceVenues[id]=venue;return venue;
  }catch(error){artwork?.dispose();world.free();throw error;}
}
function refreshVenueLighting(){
  const excluded=new Set<T.Object3D>([activeVenue.checkpoint,...activeVenue.props.map(p=>p.mesh),...(activeVenue===quarryVenue?quarry.modeScenery:[])]);
  staticShadows?.replaceCasters(activeVenue.root,excluded);staticShadows?.bindReceivers(activeVenue.root);reflections.invalidate();quarry.sun.shadow.needsUpdate=true;
}
function activateVenue(venue:VenueContext){
  if(activeVenue===venue)return;
  if(activeVenue)activeVenue.root.visible=false;
  activeVenue=venue;physics=venue.physics;venue.root.visible=true;refreshVenueLighting();
}
let staticShadows: StaticQuarryShadows | undefined;
let environmentTarget: T.WebGLRenderTarget | undefined;
let online:OnlineView, onlineUI:OnlineUI, onlinePhase='';
const isPlayer=(c:Vehicle)=>c===cars[0];
const modes = {
  derby: {
    label: 'DEMOLITION DERBY',
    description: 'Eight cars. One survivor.',
    button: 'ENTER DERBY',
  },
  playground: {
    label: 'DESTRUCTION PLAYGROUND',
    description: 'Explore. Launch. Break. Repeat.',
    button: 'FREE DRIVE',
  },
  race: {
    label: 'QUARRY CIRCUIT',
    description: 'Three laps. Full contact.',
    button: 'START RACE',
  },
};
const persist = () => {
  try {
    localStorage.setItem(saveKey, JSON.stringify({ ...saved, ...settings }));
  } catch {}
};
function loading(message: string) {
  ui.innerHTML = `<div class="menu"><div class="brand"><i></i> BLACKRIDGE MOTOR CLUB</div><div class="intro"><div class="eyebrow">FULL CONTACT / NO APOLOGIES</div><h1>QUARRY<br><span>IMPACT</span></h1></div><div class="loading"><div class="eyebrow">${message}</div><div></div></div></div>`;
}
function setQuarryMode(){if(activeVenue===quarryVenue){quarryMode=mode;quarry.setMode(mode,!!online?.active);}else activeVenue.checkpoint.visible=mode==='race';}
function openGarage() {
  garageOpen=true;garageFace='right';keys.clear();
  showGarage(ui,kind,garage.cars[kind],{
    preview:(setup:Setup)=>{if(cars[0]?.setup.armor!==setup.armor)createCars(true,setup);cars[0]?.setPaint(setup.paint,setup.trim);cars[0]?.livery.set(setup.livery);},
    view:face=>{garageFace=face;},
    save:car=>{garage.cars[kind]=car;try{localStorage.setItem(GARAGE_KEY,JSON.stringify(garage));return true;}catch{return false;}},
    close:()=>{garageOpen=false;createCars(true);menu();},
  });
}
function menu() {
  archiveReplay();bankRun(false);telemetry=null;activeChallenge=undefined;activeTimeTrial=null;timeTrialOpen=false;timeTrialResult=null;timeTrialInvalidReason='';
  careerOpen=false;careerRun=false;garageOpen=false;profileOpen=false;eventSetupOpen=false;clubOpen=false;activeClubRound=null;clubPlayerStopped=false;clubRetired=false;clubPlayerRow=null;clubRunStats=undefined;clubFirstFinish=null;
  demo=false;demoRestart=0;demoHudHidden=false;ui.classList.remove('demo-clean');director.reset();orbit.maxDistance=22;orbit.enablePan=true;
  if (online?.active) online.disconnect();
  state = 'menu';
  wreckHold = 0;
  keys.clear(); testInput = null;
  orbit.enabled = false;
  sound.pause(false);
  setQuarryMode();
  ui.innerHTML = `<div class="menu"><div class="topbar"><div class="brand"><i></i> BLACKRIDGE MOTOR CLUB</div><div class="location">WOODLAND COUNTY &nbsp; / &nbsp; <b>17:42</b> &nbsp; / &nbsp; DRY TRACK</div></div><div class="intro"><div class="eyebrow">FULL CONTACT / NO APOLOGIES</div><h1>QUARRY<br><span>IMPACT</span></h1><p>Precision machines. Unforgiving ground.<br>Take the long way home — if it still runs.</p><div class="car-picker">${(Object.keys(DEFINITIONS) as CarKind[]).map((k) => `<button data-car="${k}" class="${k === kind ? 'active' : ''}">${DEFINITIONS[k].name}</button>`).join('')}</div><div class="spec">${DEFINITIONS[kind].subtitle.toUpperCase()}</div></div><div class="menu-bottom">${(Object.keys(modes) as Mode[]).map((m, i) => `<button class="mode-card ${m === mode ? 'active' : ''}" data-mode="${m}"><span class="number">0${i + 1} / ${m === 'derby' ? 'SURVIVAL' : m === 'race' ? 'COMPETITION' : 'EXPLORATION'}</span><strong>${m==='race'?raceLabel(eventOptions.race==='laps'?resolveCourseId(eventOptions.course):'quarry-v1'):modes[m].label}</strong><small>${m==='race'?`${eventOptions.race==='laps'&&eventOptions.raceDuration?'Timed circuit · '+formatTime(eventOptions.raceDuration)+' · '+eventOptions.direction:RACE_NAMES[eventOptions.race]} · ${eventOptions.race==='laps'&&eventOptions.raceDuration?'finish current lap':eventOptions.laps} ${eventOptions.race==='laps'&&eventOptions.raceDuration?'':eventOptions.race==='laps'?(eventOptions.laps===1?'lap':'laps')+' · '+eventOptions.direction:eventOptions.laps===1?'round':'rounds'} · ${eventOptions.field} cars`:m==='derby'?`${eventOptions.derby==='score'?'Score derby · respawns':'Last car standing'} · ${eventOptions.field} cars`:modes[m].description}</small></button>`).join('')}<button class="primary" id="start">${modes[mode].button}<span>↗</span></button></div><div class="footer"><span>${CAR_KINDS.length} MACHINES &nbsp; · &nbsp; ${Object.keys(COURSE_NAMES).length} VENUES &nbsp; · &nbsp; NO PRISTINE FINISHES</span><div><a href="./licenses/CREDITS.md" target="_blank" rel="noopener">CREDITS</a><button id="settings">SETTINGS</button><button id="fullscreen">FULLSCREEN ↗</button></div></div></div>`;
  ui.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(
    (b) =>
      (b.onclick = () => {
        mode = b.dataset.mode as Mode;
        menu();
      }),
  );
  ui.querySelectorAll<HTMLButtonElement>('[data-car]').forEach(
    (b) =>
      (b.onclick = () => {
        kind = b.dataset.car as CarKind;
        createCars(true);
        menu();
      }),
  );
  document.querySelector<HTMLButtonElement>('#start')!.onclick = () => start(false);
  replayMenu();
  const garageButton=document.createElement('button');garageButton.id='garage';garageButton.className='small-button';garageButton.textContent='GARAGE & TUNING';garageButton.onclick=openGarage;ui.querySelector('.intro')!.append(garageButton);
  const profileButton=document.createElement('button');profileButton.id='driver-profile';profileButton.className='small-button';profileButton.textContent='DRIVER PROFILE & CHALLENGES';profileButton.onclick=()=>openProfile();ui.querySelector('.intro')!.append(profileButton);
  const trialButton=document.createElement('button');trialButton.id='time-trial';trialButton.className='small-button';trialButton.textContent='TIME TRIAL · PERSONAL BESTS';trialButton.onclick=()=>openTimeTrialSetup();ui.querySelector('.intro')!.append(trialButton);
  const cupButton=document.createElement('button');cupButton.id='club-cup';cupButton.className='small-button';cupButton.textContent=clubCup?.phase==='complete'?'CHAMPIONSHIPS · FINAL STANDINGS':clubCup?'CONTINUE '+clubSeries(clubCup).name.toUpperCase():'CHAMPIONSHIPS · FIVE SERIES';cupButton.onclick=()=>openClubCup();ui.querySelector('.intro')!.append(cupButton);
  if(lastAward?.qualified){const note=document.createElement('p');note.className='last-award';note.textContent=awardText(lastAward);ui.querySelector('.intro')!.append(note);}
  const eventButton=document.createElement('button');eventButton.id='event-setup';eventButton.className='small-button';eventButton.textContent=`EVENT RULES · ${eventOptions.field} CARS · ${GRID_LINEUPS[eventOptions.lineup??'mixed'].toUpperCase()} · ${AI_DIFFICULTIES[readAIDifficulty(eventOptions.difficulty)].label.toUpperCase()}`;eventButton.onclick=openEventSetup;ui.querySelector('.intro')!.append(eventButton);
  const watch=document.createElement('button');watch.id='watch-demo';watch.className='small-button';watch.textContent='WATCH DEMO ▷';
  watch.onclick=()=>{if(mode==='playground')mode='derby';void start(true);};
  ui.querySelector('.intro')!.append(watch);
  const careerButton=document.createElement('button');careerButton.id='career-open';careerButton.className='small-button';careerButton.textContent='CAREER · CHOOSE YOUR PATH';careerButton.onclick=()=>openCareer();ui.querySelector('.intro')!.append(careerButton);
  const demoSetup=document.createElement('button');demoSetup.className='small-button';demoSetup.id='demo-options';demoSetup.textContent='DEMO OPTIONS';demoSetup.onclick=()=>{eventSetupOpen=true;showDemoSetup(ui,demoOptions,kind,value=>{try{localStorage.setItem(DEMO_KEY,JSON.stringify(value));return true;}catch{return false;}},()=>{eventSetupOpen=false;},()=>{if(mode==='playground')mode='derby';void start(true);});};ui.querySelector('.intro')!.append(demoSetup);
  document.querySelector<HTMLButtonElement>('#settings')!.onclick = () =>
    pause(true);
  document.querySelector<HTMLButtonElement>('#fullscreen')!.onclick =
    fullScreen;
  const onlineButton=document.createElement('button');onlineButton.id='online';onlineButton.textContent='PLAY ONLINE ↗';
  onlineButton.onclick=()=>onlineUI.show();ui.querySelector('.footer > div')!.prepend(onlineButton);
}
function leaveOnline() {
  online.disconnect();onlinePhase='';keys.clear();testInput=null;
  const url=new URL(location.href);url.searchParams.delete('room');history.replaceState(null,'',url);
  createCars(true);menu();
}
async function connectOnline(endpoint:string,room:string,name:string,loadout?:OnlineSelection) {
  archiveReplay();waypointRace=null;bankRun(false);telemetry=null;activeChallenge=undefined;activeTimeTrial=null;timeTrialOpen=false;timeTrialResult=null;timeTrialInvalidReason='';lastAward=null;
  demo=false;
  if(activeVenue!==quarryVenue)createCars(true);
  await sound.init();online.reset();online.active=true;onlinePhase='';
  try {online.network.connect({endpoint,room,name,kind:loadout?.kind??kind,setup:loadout?.setup??copyOnlineSetup(garage.cars[kind].setup),livery:loadout?.livery??garage.cars[loadout?.kind??kind].setup.livery});}catch(error){online.active=false;throw error;}
}
function receiveOnline() {
  const s=online.network.snapshot;if(!online.active||!s)return;
  online.receive(s);elapsed=s.elapsed;countdown=s.countdown;mode=s.mode;
  waypointRace=s.event?.waypoints?new WaypointRace(s.event.rules.race as 'ordered'|'free'|'random',s.event.rules.laps,s.event.seed):null;
  if(s.event)restoreOnlineProgress(s.event,waypointRace,combat);else combat.reset();
  const changed=onlinePhase!==s.phase;onlinePhase=s.phase;
  if(s.phase==='lobby') {
    state='lobby';orbit.enabled=false;onlineUI.lobby(s,changed);return;
  }
  kind=cars[0].kind;setQuarryMode();
  if(changed) {
    if(s.phase==='result') {
      finish(s.ranking[0]===online.network.id?'EVENT WINNER':mode==='race'?'RACE COMPLETE':'DERBY COMPLETE');
    }else if(state==='paused') resumeState=s.phase;
    else {state=s.phase;orbit.enabled=false;hud();sound.pause(false);}
  }
  if(s.phase==='result') {
    onlineUI.results(s);
  }
}
function createCars(attract = false, previewSetup?:Setup) {
  const targetVenue=ensureVenue(attract?'quarry-v1':preferredCourse());
  archiveReplay();bankRun(false);
  drivers.difficulty=attract?'amateur':aiDifficulty();drivers.reset();combat.reset();waypointRace=!attract&&mode==='race'&&raceFormat()!=='laps'?new WaypointRace(raceFormat() as 'ordered'|'free'|'random',raceLaps(),Math.floor(Math.random()*0xffffffff)):null;
  sound.clearCars();
  vehicleFire?.reset();
  puddleSplashes?.reset();
  for (const c of cars) c.dispose();
  cars = [];
  fx.reset();
  activateVenue(targetVenue);fx.world=physics;fx.groundHeight=activeVenue.course.height;events.clear();setQuarryMode();
  if(activeVenue===quarryVenue)quarry.resetProps();
  impactAdjudicator.clear();collisionScars.clear();
  collisions = 0;
  const count = attract ? 1 : activeTimeTrial ? 1 : activeClubRound!==null ? clubCup!.roster.length : mode === 'playground' ? ((activeChallenge?activeChallenge.traffic:traffic) ? 5 : 1) : activeChallenge?8:demo?demoOptions.field:eventOptions.field;
  const colors = [
    DEFINITIONS[kind].color,
    0x983e2f,
    0x426068,
    0xafa343,
    0xc6c6b3,
    0x485453,
    0x344266,
    0x664234,
  ];
  for (let i = 0; i < count; i++) {
    const type =
      !attract&&activeClubRound!==null?clubCup!.roster[i].kind:demo&&!attract?demoCarKind(i,kind,demoOptions.lineup):i === 0 ? kind : activeChallenge?(['coupe','sedan','hatch']as CarKind[])[i%3]:!attract&&customEvent()&&mode!=='playground'?gridCarKind(i,kind,eventOptions.lineup):CAR_KINDS[i%CAR_KINDS.length];
    const setup=!attract&&activeTimeTrial?stockSetup(type):!attract&&activeClubRound!==null?undefined:demo&&!attract?demoVehicleSetup(type,demoOptions,garage,kind):!attract&&customEvent()&&mode!=='playground'?eventGridSetup(type,kind,garage,eventOptions.performance,i===0,colors[i%colors.length]):i===0 && (attract || !demo) && !activeChallenge ? previewSetup??garage.cars[type].setup : undefined;
    const car = new Vehicle(i, type, setup?.paint ?? colors[i%colors.length], scene, physics, fx, setup,activeVenue.course);
    car.waters=activeVenue.puddles;
    if(mode==='derby'&&!online?.active)car.arenaSurface=DERBY_ARENA;
    cars.push(car);
    if (attract) car.place(0, -13, 0.65);
    else if (mode === 'derby') {
      const spawn=derbyGridSlot(i,count,DERBY_ARENA);
      car.place(spawn.x,spawn.z,spawn.yaw);
    } else if (mode === 'race') {
      const spawn=courseGridSlot(activeVenue.course,i,clubRound()?.direction??activeTimeTrial?.direction??(customEvent()&&raceFormat()==='laps'?eventOptions.direction:'forward'));
      car.place(spawn.x,spawn.z,spawn.yaw);
      car.nextCheckpoint=spawn.next;car.passed=waypointRace?0:spawn.passed;
    } else car.place(i === 0 ? 0 : 65 + i * 6, -20 + i * 6, 0);
  }
  for (let i = 0; i < 90; i++) {
    for (const c of cars) c.preStep(1 / 60);
    physics.step();
    for (const c of cars) c.postStep(1 / 60, 0);
  }
  cars.forEach((c) => {
    c.previous.copy(c.current);
    c.root.position.copy(c.current);
  });
  sound.attach(cars);
}
async function start(watch=demo) {
  if(preparingEvent)return false;
  bankRun(false);telemetry=null;
  if(watch){activeChallenge=undefined;activeTimeTrial=null;}
  timeTrialOpen=false;timeTrialInvalidReason='';timeTrialResult=null;
  demo=watch;demoRestart=0;director.reset();if(watch)director.select(demoOptions.camera);keys.clear();testInput=null;
  wreckHold = 0;
  if(online?.active) {if(online.network.isHost){online.network.start(mode);return true;}return false;}
  let retainedReplay=recorder&&recorder.frames.length>1?recorder.document():lastReplay;
  preparingEvent=true;preparationInterrupted=false;
  try {
    state='loading';
    loading(watch?'PREPARING DEMO':'PREPARING EVENT');
    try {
      await sound.init();
    } catch (e) {
      console.warn('Audio loading failed', e);
      toast('Sound unavailable — check local assets', 8);
    }
    setQuarryMode();
    createCars();
    retainedReplay=lastReplay??retainedReplay;
    for(const car of cars)staticShadows?.bindReceivers(car.root);
    await warmPrograms();
    elapsed = 0;eventFrameTimes.length=0;
    if(activeTimeTrial)beginTrialGhost();
    countdown = mode === 'playground' ? 0 : 3.5;
    accumulator = 0;
    state = countdown ? 'countdown' : 'playing';
    orbit.enabled = false;
    setQuarryMode();
    cameraImpactOffset.set(0,0,0);
    camera.position.copy(cars[0].current).add(new T.Vector3(0, 4, -8));
    hud();
    sound.pause(false);
    telemetry=watch?null:new SessionTelemetry();runId=crypto.randomUUID();runSettled=false;lastAward=null;
    beginReplay();
    if(preparationInterrupted||document.hidden)pause();
    return true;
  } catch (error) {
    console.error('Event preparation failed',error);
    // A half-built event must never archive over the last usable recording.
    for(const car of cars)car.onVisualEvent=undefined;
    recorder=null;lastReplay=retainedReplay;
    telemetry=null;runSettled=true;activeChallenge=undefined;activeTimeTrial=null;timeTrialOpen=false;timeTrialResult=null;timeTrialInvalidReason='';demo=false;demoRestart=0;
    const detail=error instanceof Error?error.message:'Please try again.';
    try {
      createCars(true);menu();
      const note=document.createElement('p');note.className='last-award';note.setAttribute('role','alert');
      note.textContent='Could not start the event. Returned to the Quarry. '+detail;
      ui.querySelector('.intro')?.append(note);
    } catch (recoveryError) {
      console.error('Quarry recovery failed',recoveryError);
      state='loading';sound.pause(true);
      ui.innerHTML='<div class="menu"><div class="intro"><div class="eyebrow">QUARRY IMPACT</div><h1>EVENT UNAVAILABLE</h1><p id="event-start-error" role="alert"></p><button class="primary" id="event-reload">RELOAD GAME ↻</button></div></div>';
      ui.querySelector('#event-start-error')!.textContent='The event and Quarry menu could not be prepared. Reload the game to try again. '+detail;
      ui.querySelector<HTMLButtonElement>('#event-reload')!.onclick=()=>location.reload();
    }
    return false;
  } finally {
    preparingEvent=false;
  }
}
function hud() {
  ui.innerHTML = `<div class="hud"><div class="hud-top"><div><div class="eyebrow">BLACKRIDGE / ${mode === 'race' ? activeVenue.course.id==='quarry-v1'?'CIRCUIT 01':activeVenue.course.name.toUpperCase() : 'QUARRY FLOOR'}</div><div class="hud-title">${eventLabel()}</div></div><div class="event-stats"><div><span id="event-label">${mode === 'derby' ? 'REMAINING' : mode === 'race' ? 'POSITION' : 'FREE DRIVE'}</span><strong id="event-value">${cars.length} / ${cars.length}</strong></div><div><span>${mode === 'race' ? 'LAP / TIME' : mode === 'derby' ? 'TIME LEFT' : 'SESSION'}</span><strong id="time-value">05:00</strong></div><button class="small-button" id="pause">Ⅱ</button></div></div><canvas class="minimap" id="map" width="400" height="400"></canvas><div class="status"><div class="status-row"><span>${DEFINITIONS[kind].name}</span><b id="health">100%</b></div><div class="condition"><b id="health-bar" style="width:100%"></b></div><div class="subsystems"><span id="engine-status">ENGINE OK</span><span id="steer-status">STEERING OK</span><span id="surface">GRAVEL</span></div><div class="tyre-status" id="tyre-status"></div><div class="tyre-status" id="engine-restart"></div></div><div class="speed"><strong id="speed">0</strong> <span>KM/H</span><small id="gear">GEAR 1 &nbsp; / &nbsp; 850 RPM</small><div class="rpm"><b id="rpm-bar"></b></div></div><div class="controls"><kbd>${['throttle','reverse','left','right'].map(a=>keyLabel(drivingControls.keys[a as 'throttle'][0])).join(' ')}</kbd> DRIVE <kbd>${keyLabel(drivingControls.keys.handbrake[0])}</kbd> HANDBRAKE <kbd>C</kbd> CAMERA <kbd>R</kbd> RECOVER ${mode === 'playground' && !online?.active ? '<kbd>I</kbd> INSPECT <kbd>T</kbd> TRAFFIC' : ''}</div><div class="center-message" id="countdown"></div><div id="toast"></div></div>`;
  document.querySelector<HTMLButtonElement>('#pause')!.onclick = () => pause();
  const instruments=document.createElement('canvas');instruments.id='instruments';instruments.width=400;instruments.height=450;instruments.className='instruments';ui.querySelector('.hud')!.append(instruments);
  if(scoreDerby())ui.querySelector('.hud-title')!.textContent='SCORE DERBY';
  if(mode==='race'&&customEvent())ui.querySelector('.hud-title')!.textContent=waypointRace?RACE_NAMES[eventOptions.race].toUpperCase():`${eventLabel()} · ${eventOptions.direction.toUpperCase()}`;
  if(onlineRules())ui.querySelector('.hud-title')!.textContent=onlineEventLabel(mode,onlineRules()!).toUpperCase();
  if(waypointRace)ui.querySelector('.hud')!.insertAdjacentHTML('beforeend','<div class="waypoint-status" id="waypoint-status"></div>');
  if(settings.performance)ui.querySelector('.hud')!.insertAdjacentHTML('beforeend','<div class="performance-readout" id="performance-readout"></div>');
  if(activeChallenge){ui.querySelector('.hud-title')!.textContent=activeChallenge.title.toUpperCase();ui.querySelector('.hud')!.insertAdjacentHTML('beforeend','<div class="challenge-live"><strong id="challenge-score"></strong><span id="challenge-target"></span></div>');}
  if(activeTimeTrial){ui.querySelector('.hud-title')!.textContent=`TIME TRIAL · ${activeTimeTrial.direction.toUpperCase()}`;text('event-label','PERSONAL BEST');ui.querySelector('.event-stats > div:nth-child(2) > span')!.textContent='LAP TIME';text('event-value',formatTrialTime(timeTrialBest(timeTrialRecords,activeTimeTrial)));ui.querySelector('.hud')!.insertAdjacentHTML('beforeend','<div class="challenge-live" role="status"><strong id="time-trial-progress">0 / 24 GATES</strong><span id="time-trial-validity">FACTORY STOCK · ONE LAP · NO RECOVERY</span><span id="time-trial-ghost">PERSONAL-BEST GHOST</span></div>');}
  if(customEvent()&&mode!=='playground')ui.querySelector('.hud-title')!.textContent+=' · '+AI_DIFFICULTIES[drivers.difficulty].label.toUpperCase()+' AI · '+DAMAGE_RULES[damageRule()].label.toUpperCase();
  if(demo)demoHud();
  if(activeClubRound!==null){ui.querySelector('.hud-title')!.textContent=`${clubSeries(clubCup).name.toUpperCase()} · ROUND ${activeClubRound+1} / ${clubRounds(clubCup).length} · ${eventLabel()}`;ui.querySelector('.hud')!.insertAdjacentHTML('beforeend',`<div class="club-live" id="club-live" role="status">Factory stock · ${GRID_LINEUPS[clubCup?.lineup??'mixed']} · Championship points</div>`);}
  if(online?.active)ui.querySelector('.hud')!.insertAdjacentHTML('beforeend','<div class="network-status" id="network-status"></div>');
}
function demoHud(){
  ui.querySelector('.hud-title')!.textContent='LIVE DEMO / '+eventLabel()+' · '+AI_DIFFICULTIES[drivers.difficulty].label.toUpperCase()+' AI · '+DAMAGE_RULES[damageRule()].label.toUpperCase();
  ui.querySelector('.controls')!.innerHTML='<kbd>C</kbd> CAMERA <kbd>[</kbd><kbd>]</kbd> CAR <kbd>SPACE</kbd> PAUSE · FREE ORBIT: DRAG / SCROLL';
  ui.querySelector('.status-row > span')!.id='follow-name';
  ui.querySelector('.hud')!.insertAdjacentHTML('beforeend',`<div class="demo-toolbar"><label>VIEW<select id="demo-camera">${Object.entries(DEMO_CAMERAS).map(([key,label])=>`<option value="${key}">${label}</option>`).join('')}</select></label><label>FOLLOW<select id="demo-car"><option value="auto">Director chooses</option>${cars.map(c=>`<option value="${c.id}">#${c.id+1} ${DEFINITIONS[c.kind].name}</option>`).join('')}</select></label><label>EVENT<select id="demo-event"><option value="derby">Demolition derby</option><option value="race">${raceLabel(resolveCourseId(demoOptions.course))}</option></select></label><button class="small-button" id="demo-next">NEXT EVENT</button><button class="small-button" id="demo-hide">HIDE HUD · H</button><button class="small-button" id="demo-exit">EXIT DEMO</button></div>`);
  const view=document.querySelector<HTMLSelectElement>('#demo-camera')!;view.value=director.view;view.onchange=()=>director.select(view.value as DemoCamera);
  const follow=document.querySelector<HTMLSelectElement>('#demo-car')!;follow.onchange=()=>{if(follow.value==='auto'){director.manual=false;director.select('director');view.value='director';}else director.follow(+follow.value);};
  const event=document.querySelector<HTMLSelectElement>('#demo-event')!;event.value=mode;event.onchange=()=>{mode=event.value as Mode;void start(true);};
  document.querySelector<HTMLButtonElement>('#demo-next')!.onclick=()=>{mode=mode==='race'?'derby':'race';void start(true);};
  document.querySelector<HTMLButtonElement>('#demo-hide')!.onclick=()=>{demoHudHidden=!demoHudHidden;ui.classList.toggle('demo-clean',demoHudHidden);};
  document.querySelector<HTMLButtonElement>('#demo-exit')!.onclick=()=>{createCars(true);menu();};
}
function text(id: string, t: string) {
  const e = document.getElementById(id);
  if (e) e.textContent = t;
}
function toast(t: string, duration = 3) {
  statusMessage = t;
  statusUntil = clock + duration;
}
function updateHud() {
  if (!['playing', 'countdown'].includes(state)&&!(demo&&state==='result')) return;
  const player = demo?(cars.find(c=>c.id===director.followed)??cars[0]):cars[0];
  if(demo){text('follow-name',`#${player.id+1} ${DEFINITIONS[player.kind].name}`);const view=document.querySelector<HTMLSelectElement>('#demo-camera');if(view)view.value=director.view;const follow=document.querySelector<HTMLSelectElement>('#demo-car');if(follow)follow.value=director.manual?String(director.followed):'auto';}
  text('health', Math.ceil(player.health) + '%');
  const hb = document.getElementById('health-bar')!;
  hb.style.width = player.health + '%';
  hb.style.background = player.health < 30 ? '#dd7a55' : '#d9c486';
  text('speed', Math.round(Math.abs(player.speed) * 3.6).toString());
  const instruments=document.querySelector<HTMLCanvasElement>('#instruments');if(instruments)drawInstruments(instruments,player.speed,player.rpm,player.gear,player.health);
  text(
    'gear',
    `GEAR ${player.gear === 0 ? 'R' : player.gear}  /  ${Math.round(player.rpm)} RPM`,
  );
  document.getElementById('rpm-bar')!.style.width =
    clamp((player.rpm / 7000) * 100, 0, 100) + '%';
  text('surface', player.surface.toUpperCase());
  text('engine-status', player.engineStall!>0&&player.health>0?'ENGINE STALLED':engineStatus(player.health,player.engineDamage));
  text('tyre-status', tyreWarning(player.tyreDamage));
  text('engine-restart', stallHint(player.health,player.engineStall,player.input.throttle));
  text(
    'steer-status',
    Math.abs(player.damageLeft - player.damageRight) > 16
      ? 'STEERING PULL'
      : 'STEERING OK',
  );
  if(demo&&mode==='race')for(const car of cars){const option=ui.querySelector<HTMLOptionElement>(`#demo-car option[value="${car.id}"]`);if(option)option.textContent=`#${car.id+1} ${DEFINITIONS[car.kind].name} · ${car.finished?(raceTimeLimit()?timedRaceResult(car):'FINISHED'):car.health<=0?'RETIRED':raceTimeLimit()?'LAP '+car.lap:waypointRace?'STATIONS '+car.passed+'/'+raceLaps()*6:'LAP '+Math.min(raceLaps(),car.lap)+'/'+raceLaps()}`;}
  const remaining = Math.max(0, eventDuration() - elapsed);
  if(settings.performance&&eventFrameTimes.length){const sample=eventFrameTimes.slice(-300).sort((a,b)=>a-b),mean=sample.reduce((a,b)=>a+b,0)/sample.length;text('performance-readout',`${cars.length} CARS · ${Math.round(1000/mean)} FPS · P95 ${Math.round(sample[Math.floor((sample.length-1)*.95)])} ms`);}
  if(scoreDerby()){text('event-label','SCORE / POSITION');const respawn=combat.get(player.id).respawnAt;if(player.health<=0&&respawn>0)toast(elapsed<respawn?`WRECKED · RESPAWN IN ${Math.ceil(respawn-elapsed)}s`:'WAITING FOR A CLEAR SPAWN',.4);}
  if(activeChallenge&&telemetry){text('challenge-score',formatChallengeValue(activeChallenge,challengeValue(activeChallenge,telemetry.stats)));text('challenge-target',`BRONZE ${formatChallengeValue(activeChallenge,activeChallenge.medals[0])} · ${Math.ceil(remaining)}s LEFT · STOCK CAR / NO RECOVERY`);}
  text(
    'time-value',
    mode === 'derby'
      ? formatTime(remaining)
      : mode === 'race'
        ? raceTimeLimit()?`${player.finished?(state==='result'?'CLASSIFIED':'WAITING FOR FIELD'):elapsed<raceTimeLimit()?formatTime(raceTimeLimit()-elapsed)+' LEFT':'FINISH THIS LAP'} · ${player.finished?timedRaceResult(player):'LAP '+player.lap}`:player.finished?`FINISHED · ${formatTime(player.finishTime)}`:`${waypointRace?'ROUND ':''}${Math.min(raceLaps(), player.lap)} / ${raceLaps()} · ${formatTime(elapsed + player.penalty)}`
        : formatTime(elapsed),
  );
  text(
    'event-value',
    mode === 'derby'
      ? scoreDerby()?`${combat.points(player.id)} PTS · #${derbyRanking().indexOf(player)+1}`:cars.filter((c) => c.health > 0).length + ' / '+cars.length
      : mode === 'race'
        ? `${online?.active?(online.network.snapshot?.ranking.indexOf(online.network.id)??0)+1:rankRace().indexOf(player) + 1} / ${cars.length}`
        : traffic
          ? 'TRAFFIC ON'
          : 'SOLO',
  );
  if(activeTimeTrial){text('time-value',formatTrialTime(player.finished?player.finishTime:elapsed+player.penalty));text('event-value',formatTrialTime(timeTrialBest(timeTrialRecords,activeTimeTrial)));text('time-trial-progress',`${Math.min(24,Math.max(0,player.passed))} / 24 GATES`);text('time-trial-validity',timeTrialInvalidReason?`PRACTICE ONLY · ${timeTrialInvalidReason}`:'FACTORY STOCK · ONE LAP · NO RECOVERY');text('time-trial-ghost',!trialGhostLibrary.enabled?'GHOST OFF':trialGhostTarget?trialGhostSplit||'RACING YOUR PERSONAL-BEST GHOST':'NO SAVED GHOST · SET A NEW PERSONAL BEST');}
  document.getElementById('countdown')!.innerHTML =
    state === 'countdown'
      ? `<strong>${Math.ceil(countdown)}</strong><p>${mode === 'derby' ? 'SURVIVE THE IMPACT' : 'FIND YOUR LINE'}</p>`
      : demo&&state==='result'?`<p>${resultTitle}</p><p>${Number.isFinite(demoRestart)?'NEXT EVENT IN '+Math.ceil(demoRestart):'EVENT COMPLETE · CHOOSE NEXT EVENT OR EXIT'}</p>`:'';
  if (!demo&&player.rollTime > 2) toast('OVERTURNED — PRESS R TO RECOVER', 1);
  if(waypointRace){const progress=waypointRace.get(player.id),available=waypointRace.available(player.id);text('waypoint-status',progress.finished?'WAYPOINT RUN FINISHED':`STATIONS ${progress.visited.size} / 5 · ${available.length>1?'CHOOSE '+available.join(' / '):available[0]===0?'RETURN TO FINISH':'NEXT STATION '+available[0]}`);}
  if (!demo&&mode === 'race'&&!waypointRace) {
    const target = raceRoute(player.id)[player.nextCheckpoint];
    const d = new T.Vector3(
      target.x - player.current.x,
      0,
      target.z - player.current.z,
    ).normalize();
    if (player.forward.dot(d) < -0.65 && player.speed > 3)
      toast('WRONG WAY — FOLLOW THE CHECKPOINTS', 1);
  }
  document.getElementById('toast')!.innerHTML =
    clock < statusUntil ? `<div class="toast">${statusMessage}</div>` : '';
  if(activeClubRound!==null){const waiting=cars.filter(c=>!c.finished&&c.health>0&&!(c.id===0&&clubRetired)).length,remaining=mode==='race'?Math.max(0,Math.ceil(Math.min(300-elapsed,clubFirstFinish===null?300:clubFirstFinish+45-elapsed))):Math.max(0,Math.ceil(eventDuration()-elapsed));text('club-live',clubPlayerStopped?`${clubRetired?'RETIRED':cars[0].finished?'FINISHED':'WRECKED'} · ${mode==='race'?waiting+' drivers still racing':'Derby still running'} · ${remaining}s maximum remaining`:'Factory stock · '+GRID_LINEUPS[clubCup?.lineup??'mixed']+' · '+AI_DIFFICULTIES[aiDifficulty()].label+' · Championship points · '+(mode==='race'?'Field closes 45s after the first finish':eventDuration()+'-second survival derby'));}
  drawMap();
}
function drawMap() {
  const canvas=document.querySelector<HTMLCanvasElement>('#map');
  if(canvas)drawQuarryMap(canvas,cars,quarry.arenaLayout,mode,demo?director.followed:online?.active?online.network.id:0,waypointRace?waypointRace.available(demo?director.followed:online?.active?online.network.id:0).map(i=>WAYPOINTS[i]):[],activeVenue.course.id==='quarry-v1'?undefined:{point:activeVenue.course.point,extent:145,halfWidth:activeVenue.course.halfWidth});
}
function formatTime(t: number) {
  return `${Math.floor(t / 60)
    .toString()
    .padStart(2, '0')}:${Math.floor(t % 60)
    .toString()
    .padStart(2, '0')}`;
}
function pause(settingsOnly = false) {
  if (['loading', 'paused'].includes(state)||state==='result'&&!demo) return;
  resumeState = state;
  state = 'paused';
  keys.clear();
  online?.network.clearInput();
  sound.pause(true);
  orbit.enabled = false;
  ui.insertAdjacentHTML('beforeend', `<div class="overlay" id="overlay"><div class="dialog"><div class="eyebrow">BLACKRIDGE MOTOR CLUB</div><h2>${settingsOnly ? 'SETTINGS' : 'TAKE A BREATHER'}</h2><div class="settings-row"><label for="quality">Graphics</label><select id="quality"><option value="ultra">Ultra</option><option value="high">High</option><option value="medium">Medium</option></select></div>${(['engine', 'effects', 'ambience'] as const).map((k) => `<div class="settings-row"><label for="${k}-volume">${k[0].toUpperCase() + k.slice(1)}</label><input id="${k}-volume" type="range" min="0" max="1" step=".05" value="${settings[k]}"></div>`).join('')}<div class="settings-row"><label for="performance">Performance display</label><input type="checkbox" id="performance" ${settings.performance?'checked':''}></div><p>${demo?'C camera · [ / ] choose car<br>Space / Escape pause · M mute · F fullscreen<br>Free orbit: drag to look around, scroll to zoom':"Driving keys and gamepad: expand controls below<br>C camera · R recover · M mute · F fullscreen · Escape pause"+(mode === 'playground' ? '<br>I inspect wreck · T toggle traffic · R repair' : '')}</p><button class="primary" id="resume">${resumeState === 'menu' ? 'BACK' : 'RESUME'}</button>${resumeState !== 'menu' ? '<button class="small-button" id="restart">RESTART EVENT</button><button class="small-button" id="main-menu">RETURN TO QUARRY</button>' : ''}</div></div>`);
  document.querySelector<HTMLInputElement>('#performance')!.onchange=e=>{settings.performance=(e.target as HTMLInputElement).checked;persist();};
  const quality = document.querySelector<HTMLSelectElement>('#quality')!;
  quality.value = settings.quality;
  quality.onchange = () => {
    settings.quality = quality.value;
    applyQuality();
    persist();
  };
  for (const k of ['engine', 'effects', 'ambience'] as const)
    document.querySelector<HTMLInputElement>('#' + k + '-volume')!.oninput = (
      e,
    ) => {
      settings[k] = +(e.target as HTMLInputElement).value;
      sound.levels[k] = settings[k];
      sound.setLevels();
      persist();
    };
  mountDrivingControls(ui.querySelector<HTMLElement>('#overlay .dialog')!,drivingControls,()=>{try{localStorage.setItem(CONTROLS_KEY,JSON.stringify(drivingControls));return true;}catch{return false;}});
  if(resumeState==='menu'&&!online?.active)mountSaveBackup(ui.querySelector<HTMLElement>('#overlay .dialog')!);
  studioButtons(ui.querySelector('#overlay .dialog'));
  document.querySelector<HTMLButtonElement>('#resume')!.onclick = resume;
  const restart = document.querySelector<HTMLButtonElement>('#restart');
  if (restart) {restart.onclick = () => activeClubRound!==null?startClubRound():start();if(online?.active)restart.remove();}
  if(activeTimeTrial){const retire=document.createElement('button');retire.id='time-trial-retire';retire.className='small-button';retire.textContent='END ATTEMPT · SEE RESULT';retire.onclick=()=>{finish('ATTEMPT ENDED');};ui.querySelector('#overlay .dialog')!.append(retire);}
  if(activeClubRound!==null&&!clubPlayerStopped){const retire=document.createElement('button');retire.id='club-retire';retire.className='small-button';retire.textContent='RETIRE FROM ROUND · KEEP WATCHING';retire.onclick=()=>{resume();freezeClubPlayer(true);};ui.querySelector('#overlay .dialog')!.append(retire);}
  if(activeClubRound!==null){const leave=ui.querySelector('#main-menu');if(leave)leave.textContent='SAVE CUP & RETURN TO QUARRY';}
  if(online?.active)ui.querySelector('#overlay h2')!.textContent='CONTROLS PAUSED · ROOM CONTINUES';
  const mm = document.querySelector<HTMLButtonElement>('#main-menu');
  if (mm)
    mm.onclick = () => {
      if(online?.active){leaveOnline();return;}
      createCars(true);
      menu();
    };
}
function resume() {
  if(ui.querySelector('.save-backup[aria-busy="true"]'))return;
  if (state === 'inspect') {
    state = 'playing';
    orbit.enabled = false;
    hud();
    sound.pause(false);
    return;
  }
  if (state !== 'paused') return;
  document.getElementById('overlay')?.remove();
  state = resumeState as typeof state;
  if(['playing','countdown'].includes(state))hud();
  if (resumeState === 'menu') menu();
  sound.pause(false);
  if (resumeState === 'wrecked') orbit.enabled = true;
  lastFrame = performance.now();
}
function applyQuality() {
  qualityScale =
    settings.quality === 'ultra'
      ? 1
      : settings.quality === 'high'
        ? 0.85
        : 0.65;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5) * qualityScale);
  renderer.setSize(innerWidth, innerHeight);
  composer.setPixelRatio(Math.min(devicePixelRatio, 1.5) * qualityScale);
  composer.setSize(innerWidth, innerHeight);
  if (quarry) {
    quarry.sun.shadow.mapSize.setScalar(
      settings.quality === 'ultra' ? 4096 : 2048,
    );
    quarry.sun.shadow.map?.dispose();
    quarry.sun.shadow.map = null;
    quarry.sun.shadow.needsUpdate = true;
  }
  staticShadows?.setQuality(settings.quality);
  vehicleFire?.setQuality(settings.quality);
  puddleSplashes?.setQuality(settings.quality);
  quarry?.referenceArena.setQuality(settings.quality);
  ao.enabled = settings.quality !== 'medium';
  reflections.enabled = settings.quality !== 'medium';
  reflections.interval = settings.quality === 'ultra' ? 3 : 6;
  renderer.shadowMap.enabled = settings.quality !== 'medium';
}
function fullScreen() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen().catch(() => {});
}
function recover() {
  if(activeClubRound!==null&&clubPlayerStopped)return;
  if(activeChallenge){toast('CHALLENGE RULE: NO RECOVERIES',2);return;}
  telemetry?.recover();
  if(activeTimeTrial)timeTrialInvalidReason='RECOVERY USED';
  if(online?.active){online.network.recover();return;}
  const p = cars[0];
  if (!p||raceTimeLimit()&&p.finished) return;
  if (mode === 'playground') {
    p.place(
      p.current.x,
      p.current.z,
      Math.atan2(p.forward.x, p.forward.z),
      true,
    );
    toast('CAR REPAIRED');
  } else if (mode === 'race') {
    const index = (p.nextCheckpoint + 23) % 24;
    const at = raceRoute(p.id)[index],
      to = raceRoute(p.id)[p.nextCheckpoint];
    p.place(at.x, at.z, Math.atan2(to.x - at.x, to.z - at.z));
    p.penalty += 5;
    toast(activeTimeTrial?'RECOVERED · PRACTICE ONLY · RETRY FOR A PERSONAL BEST':'RECOVERED · +5 SECONDS');
  } else {
    if (p.health === 0) return;
    p.health = Math.max(1, p.health - 8);
    const arena=quarry.arenaLayout,dx=p.current.x-arena.x,dz=p.current.z-arena.z,dist=Math.hypot(dx,dz),limit=arena.radius-8;
    p.place(
      arena.x+dx*(dist>limit?limit/dist:1),
      arena.z+dz*(dist>limit?limit/dist:1),
      Math.atan2(-dx,-dz),
    );
    toast('RECOVERED · CONDITION −8%');
  }
}
function input(): Input {
  if (testInput) return testInput;
  const pads=Array.from(navigator.getGamepads?.()??[],pad=>pad?controllerInput.drivingPad(pad):null);
  return drivingInput(drivingControls,keys,pads,cars[0]?.speed??0);
}
function ai(car: Vehicle, dt: number): Input {
  if(car.health<=0||(car.finished&&mode!=='race'))return {throttle:0,steer:0,brake:1,handbrake:false};
  const yaw=Math.atan2(car.forward.x,car.forward.z);
  if(mode==='race'){
    if(waypointRace)car.nextCheckpoint=waypointRace.navigation(car.id,car.current).next;
    const nearest=activeVenue.course.distance(car.current.x,car.current.z);
    car.offTrackTime=nearest>14?car.offTrackTime+dt:0;
    const needsRecovery=car.offTrackTime>7||car.rollTime>4;
    if(waypointRace&&needsRecovery){
      const prev=raceRoute(car.id)[(car.nextCheckpoint+23)%24],next=raceRoute(car.id)[car.nextCheckpoint];
      car.place(prev.x,prev.z,Math.atan2(next.x-prev.x,next.z-prev.z));car.offTrackTime=0;car.penalty+=5;drivers.memory.delete(car.id);raceRecovery.clear(car);
    }
    if(!waypointRace&&(needsRecovery||raceRecovery.ready(car,dt,drivers.memory.get(car.id)?.attempts??0))){
      const def=DEFINITIONS[car.kind],shape=new R.Cuboid(def.halfWidth+.2,.25,def.halfLength+.2);
      const at=freeRecoverySlot(car,cars,raceRoute(car.id),activeVenue.course,slot=>!!physics.intersectionWithShape(
        {x:slot.x,y:activeVenue.course.height(slot.x,slot.z)+.8,z:slot.z},
        {x:0,y:Math.sin(slot.yaw/2),z:0,w:Math.cos(slot.yaw/2)},shape,undefined,undefined,undefined,car.body));
      if(at){
        car.place(at.x,at.z,at.yaw);car.offTrackTime=0;car.checkpointDistance=Infinity;car.penalty+=5;
        drivers.memory.delete(car.id);raceRecovery.clear(car);
      }
    }
  }else if(car.rollTime>5){car.place(car.current.x,car.current.z,yaw);car.health=Math.max(1,car.health-7);car.penalty+=5;drivers.memory.delete(car.id);}
  return drivers.update(car,cars,mode,dt,()=>{
    const ray=(angle:number)=>{
      const dir={x:Math.sin(yaw+angle),y:0,z:Math.cos(yaw+angle)};
      const start={x:car.current.x,y:Math.max(car.current.y,activeVenue.course.height(car.current.x,car.current.z)+.55),z:car.current.z};
      const hit=physics.castRay(new R.Ray(start,dir),24,true,undefined,undefined,undefined,car.body,c=>(activeVenue.course.isDrivingObstacle?.(c)??true)&&!cars.some(v=>v.body.handle===c.parent()?.handle));
      return hit?drivingObstacleClearance(car,angle,hit.timeOfImpact):24;
    };
    return {front:ray(0),left:ray(-.55),right:ray(.55),rear:ray(Math.PI)};
  },raceRoute(car.id));
}
function rankRace() {
  if(raceTimeLimit())return timedRaceOrder(cars,id=>raceRoute(id));
  if(waypointRace)return [...cars].sort((a,b)=>a.finished&&b.finished?a.finishTime-b.finishTime:a.finished?-1:b.finished?1:b.passed-a.passed||waypointRace!.remainingDistance(a.id,a.current)-waypointRace!.remainingDistance(b.id,b.current)||a.id-b.id);
  return [...cars].sort((a, b) =>
    a.finished && b.finished
      ? a.finishTime - b.finishTime
      : a.finished
        ? -1
        : b.finished
          ? 1
          : b.passed - a.passed ||
            a.current.distanceTo(
              new T.Vector3(
                raceRoute(a.id)[a.nextCheckpoint].x,
                0,
                raceRoute(a.id)[a.nextCheckpoint].z,
              ),
            ) -
              b.current.distanceTo(
                new T.Vector3(
                  raceRoute(b.id)[b.nextCheckpoint].x,
                  0,
                  raceRoute(b.id)[b.nextCheckpoint].z,
                ),
              ),
  );
}
function finish(title: string) {
  if(!demo&&['result','wrecked'].includes(state))return;
  cars.forEach(c=>c.render(1));captureReplay(true);
  if(demo){if(state==='result')return;resultTitle=title;state='result';demoRestart=demoOptions.loop==='stop'?Infinity:8;cars.forEach(c=>c.render(1));updateHud();return;}
  if(activeClubRound!==null){finishClubEvent();return;}
  resultTitle = title;
  state = 'result';
  sound.pause(true);
  const ordered = online?.active ? (online.network.snapshot?.ranking??[]).map(id=>cars.find(c=>c.id===id)!).filter(Boolean) : mode === 'derby' ? derbyRanking() : rankRace();
  const rank = ordered.findIndex(isPlayer) + 1;
  if(activeTimeTrial){finishTimeTrial();return;}
  if(telemetry){Object.assign(telemetry.stats,{seconds:elapsed+cars[0].penalty,health:cars[0].health,rank:mode==='playground'?0:rank,won:mode!=='playground'&&rank===1&&(mode==='race'?cars[0].finished:scoreDerby()||cars[0].health>0),finished:cars[0].finished,checkpoints:cars[0].passed});bankRun(true);}
  if(activeChallenge&&telemetry){
    const medal=lastAward?.medal??0;
    const detail=activeChallenge.mode==='race'&&!cars[0].finished?'Race not finished':formatChallengeValue(activeChallenge,challengeValue(activeChallenge,telemetry.stats));
    ui.innerHTML=`<div class="overlay"><section class="dialog challenge-result" aria-label="Challenge result"><div class="eyebrow">${challengeVenueName(activeChallenge)} / ${activeChallenge.title.toUpperCase()} / CHALLENGE</div><h2>${medal?MEDALS[medal]+' MEDAL':'TRY AGAIN'}</h2><p>${detail} · ${Math.ceil(cars[0].health)}% condition</p><p>${activeChallenge.description}</p><p class="award-summary">${awardText(lastAward)}</p>${careerRun?`<p>${careerStatus(profile).available} unlock points available · Best medals count once.</p>`:''}<p>${profileStorageWarning}</p><button id="challenge-retry" class="primary">RETRY CHALLENGE ↗</button><button id="challenge-board" class="small-button">${careerRun?'CAREER BOARD':'CHALLENGE BOARD'}</button><button id="challenge-menu" class="small-button">RETURN TO QUARRY</button></section></div>`;
    studioButtons(ui.querySelector('.challenge-result'));
    ui.querySelector<HTMLButtonElement>('#challenge-retry')!.onclick=()=>{void start(false);};
    ui.querySelector<HTMLButtonElement>('#challenge-board')!.onclick=()=>{const discipline=activeChallenge!.discipline,returnToCareer=careerRun;createCars(true);menu();if(returnToCareer)openCareer(discipline);else openProfile(discipline);};
    ui.querySelector<HTMLButtonElement>('#challenge-menu')!.onclick=()=>{createCars(true);menu();};
    return;
  }
  saved.best ??= {};
  const score =
    mode === 'derby' ? scoreDerby()?combat.points(cars[0].id):cars[0].inflicted : raceTimeLimit()?timedRaceRecordScore(cars[0]):elapsed + cars[0].penalty;
  const category=difficultyRecordKey(raceTimeLimit()?`timed-race:${activeVenue.course.id}:${eventOptions.direction}:${raceTimeLimit()}:${cars.length}`:mode==='race'?`race:${activeVenue.course.id==='quarry-v1'?'':activeVenue.course.id+':'}${raceFormat()==='laps'?(customEvent()?eventOptions.direction:'forward'):raceFormat()}:${raceLaps()}:${cars.length}`:scoreDerby()?`score-derby:${eventDuration()}:${cars.length}`:mode,drivers.difficulty);
  const bestKey=customEvent()&&mode!=='playground'?damageRecordKey(gridRecordKey(category,kind,eventOptions.lineup,eventOptions.performance),damageRule()):category;
  if (
    !online?.active && !(mode==='race'&&raceFormat()==='random') && (mode !== 'race' || cars[0].finished) &&
    (!saved.best[bestKey] ||
      (mode === 'derby'||raceTimeLimit() ? score > saved.best[bestKey] : score < saved.best[bestKey]))
  )
    saved.best[bestKey] = score;
  persist();
  if (!online?.active && cars[0].health <= 0 && !scoreDerby() && !(raceTimeLimit()&&cars[0].finished)) {
    state = 'wrecked'; wreckHold = 5;
    sound.pause(false);
    keys.clear(); testInput = null; accumulator = 0;
    for (const car of cars) { car.input = {throttle:0,steer:0,brake:1,handbrake:false}; car.render(1); }
    const player = cars[0];
    const offset = player.wreckParts.inspectionOffset(player.currentQ);
    camera.position.copy(player.current).add(offset);
    camera.position.y=Math.max(camera.position.y,activeVenue.course.height(camera.position.x,camera.position.z)+1.2);
    camera.fov = 52; camera.updateProjectionMatrix();
    orbit.target.copy(player.current); orbit.enabled = true; orbit.update();
    ui.innerHTML = '<div class="wreck-note"><strong>WRECKED OUT</strong><span>DRAG TO LOOK AROUND &middot; SCROLL TO ZOOM</span><span>RETURNING TO QUARRY IN <b id="wreck-count">5</b></span></div>';
    return;
  }
  ui.innerHTML = `<div class="overlay"><div class="dialog"><div class="eyebrow">${eventLabel()} / RESULTS${customEvent()&&mode!=='playground'?' · '+AI_DIFFICULTIES[drivers.difficulty].label.toUpperCase()+' AI':''}</div><h2>${title}</h2>${customEvent()&&mode!=='playground'?`<p>${GRID_LINEUPS[eventOptions.lineup??'mixed']} · ${GRID_PERFORMANCE[eventOptions.performance??'open']} · ${DAMAGE_RULES[damageRule()].label}</p>`:''}<p>Placed ${rank} of ${cars.length} · ${Math.ceil(cars[0].health)}% condition<br>${mode === 'derby' ? scoreDerby()?combat.points(cars[0].id)+' points · '+combat.get(cars[0].id).knockouts+' knockouts':Math.round(cars[0].inflicted) + ' damage inflicted' : raceTimeLimit()?timedRaceResult(cars[0])+' · '+formatTime(raceTimeLimit())+' timed race':formatTime(elapsed + cars[0].penalty) + ' including recovery penalties'}</p>${ordered.map((c, i) => `<div class="results-row ${isPlayer(c) ? 'player' : ''}"><span>${String(i + 1).padStart(2, '0')} &nbsp; ${isPlayer(c) ? 'YOU' : DEFINITIONS[c.kind].name + ' #' + c.id}</span><span>${mode === 'derby' ? scoreDerby()?combat.points(c.id)+' PTS':Math.ceil(c.health) + '%' : raceTimeLimit()?timedRaceResult(c):c.finished ? formatTime(c.finishTime) : (waypointRace?'STATIONS '+c.passed:'LAP '+Math.min(raceLaps(), c.lap))}</span></div>`).join('')}<p class="award-summary">${awardText(lastAward)}</p><button class="primary" id="again">RUN IT BACK ↗</button><button class="small-button" id="back">RETURN TO QUARRY</button></div></div>`;
  studioButtons(ui.querySelector('.dialog'));
  document.querySelector<HTMLButtonElement>('#again')!.onclick = () => start();
  document.querySelector<HTMLButtonElement>('#back')!.onclick = () => {
    if(online?.active){leaveOnline();return;}
    createCars(true);
    menu();
  };
  if(online?.active && !online.network.isHost){const b=document.querySelector<HTMLButtonElement>('#again')!;b.disabled=true;b.textContent='WAITING FOR HOST REMATCH';}
}
function step(dt: number) {
  if(online?.active)return;
  if (state === 'countdown') {
    countdown -= dt;
    if (countdown <= 0) {
      state = 'playing';
      toast(mode === 'derby' ? 'MAKE AN IMPACT' : 'GREEN LIGHT', 2);
    }
    return;
  }
  if (state !== 'playing') return;
  elapsed += dt;
  if(demo||autopilot||testInput){telemetry=null;if(activeTimeTrial)timeTrialInvalidReason='ASSISTED OR TEST INPUT';}
  for (const c of cars) {
    c.input = raceTimeLimit()&&c.id===0&&c.finished&&!demo ? ai(c,dt) : c.id===0&&activeClubRound!==null&&clubPlayerStopped ? clubRetired||!c.finished?{throttle:0,steer:0,brake:1,handbrake:false}:ai(c,dt) : c.id === 0 && !autopilot && !demo ? input() : ai(c, dt);
    c.preStep(dt);
  }
  const collisionMotion=captureCollisionMotion(physics);
  physics.step(events);
  for (const c of cars) c.postStep(dt, elapsed);
  if(activeTimeTrial)trialGhostRecorder?.sample(elapsed,cars[0].current,cars[0].currentQ);
  const contacts: (ImpactContact & {a?:Vehicle;b?:Vehicle;point:T.Vector3;point1:T.Vector3;point2:T.Vector3;va:T.Vector3;vb:T.Vector3;scarDirection:T.Vector3;speed:number})[]=[];
  events.drainContactForceEvents((e) => {
    const h1=e.collider1(),h2=e.collider2(),{a,b,key}=vehicleContact(physics,cars,h1,h2);
    if(!a&&!b)return;
    const point=new T.Vector3().copy((a??b)!.current),normal=new T.Vector3();
    const manifold=vehicleContactManifold(physics,h1,h2);
    if(manifold){point.copy(manifold.point);normal.copy(manifold.normal);}
    const point1=new T.Vector3().copy(manifold?.point1??point),point2=new T.Vector3().copy(manifold?.point2??point);
    const va=a?.velocity??new T.Vector3(),vb=b?.velocity??new T.Vector3();
    const relative=vb.clone().sub(va),closing=normal.lengthSq()>.5?Math.abs(relative.dot(normal)):relative.length();
    const scarDirection=new T.Vector3().copy(collisionPointVelocity(physics,collisionMotion,h2,point2)).sub(new T.Vector3().copy(collisionPointVelocity(physics,collisionMotion,h1,point1))),speed=scarDirection.length();
    scarDirection.normalize();
    contacts.push({key,point,point1,point2,va,vb,a,b,scarDirection,speed,closing,impulse:e.totalForceMagnitude()*dt,
      damageScale:Math.max(a&&a.health>0?a.specification.damageScale:0,b&&b.health>0?b.specification.damageScale:0)});
  });
  for(const {a,b,point1,point2,scarDirection} of collisionScars.adjudicate(contacts,elapsed)){
    a?.scar(point1,scarDirection,b?.paintColor);
    b?.scar(point2,scarDirection.clone().negate(),a?.paintColor);
  }
  for(const {contact:{a,b,point,point1,point2,va,vb,impulse},damage,feedback} of impactAdjudicator.adjudicate(contacts,elapsed,collisionDamageMultiplier(mode==='race',damageRule()))){
    // A feedback-only contact still clears stale glass/debris flags in hit().
    if(a){
      const before=a.health;
      a.hit(point1,vb.clone().sub(va).normalize(),damage,elapsed,false,b?.paintColor);
      if(b){b.inflicted+=before-a.health;combat.hit(b.id,a.id,before,a.health,elapsed);}
      if(b?.id===0)telemetry?.impact(a.id,before,a.health);
    }
    if(b){
      const before=b.health;
      b.hit(point2,va.clone().sub(vb).normalize(),damage,elapsed,false,a?.paintColor);
      if(a){a.inflicted+=before-b.health;combat.hit(a.id,b.id,before,b.health,elapsed);}
      if(a?.id===0)telemetry?.impact(b.id,before,b.health);
    }
    if(feedback){
      collisions++;
      sound.impact(impactAudioSeverity(impulse),point,!!(a?.impactEffects.glass||b?.impactEffects.glass),!!(a?.impactEffects.debris||b?.impactEffects.debris));
      if(a?.id===0||b?.id===0)toast(damage>12?'HEAVY IMPACT':'CONTACT',.8);
    }
  }
  if(scoreDerby())stepScoreRespawns(combat,cars,elapsed,eventDuration(),DERBY_ARENA,id=>{drivers.memory.delete(id);telemetry?.resetOpponent(id);if(id===0)telemetry?.recover();});
  if(telemetry){const p=cars[0];telemetry.sample(dt,{speed:p.speed,lateral:p.velocity.dot(p.right),grounded:[0,1,2,3].filter(i=>p.controller.wheelIsInContact(i)).length,height:p.current.y-activeVenue.course.height(p.current.x,p.current.z)-.89,health:p.health,checkpoints:p.passed});telemetry.stats.rank=mode==='playground'?0:(mode==='derby'?derbyRanking():rankRace()).indexOf(cars[0])+1;}
  for (const c of cars) {
    if (activeVenue.course.outside(c.current.x,c.current.y,c.current.z)) {
      if(c.id===0&&activeChallenge){finish('OUT OF BOUNDS');return;}
      if (c.id === 0 && !demo) recover();
      else if(activeVenue!==quarryVenue&&mode==='race'){const at=courseRecoverySlot(activeVenue.course,c.nextCheckpoint,raceDirection(c.id));c.place(at.x,at.z,at.yaw);c.penalty+=5;drivers.memory.delete(c.id);}
      else c.place(0, 0, 0);
    }
    if(c.id===0&&activeClubRound!==null&&clubRetired)continue;
    if(mode==='race'&&waypointRace){
      const reached=waypointRace.sample(c.id,c.current),progress=waypointRace.get(c.id);c.passed=progress.passed;c.lap=progress.round+1;
      if(reached&&c.id===0&&!demo)toast(reached.finished?'ALL STATIONS COMPLETE':reached.id===0?'ROUND COMPLETE':`STATION ${reached.id} COLLECTED`,1.2);
      if(progress.finished&&!c.finished){c.finished=true;c.finishTime=elapsed+c.penalty;if(c.id===0&&!demo)finish('WAYPOINT FINISH');}
      if(c.id===0&&!demo)c.nextCheckpoint=waypointRace.navigation(c.id,c.current).next;
    } else if (mode === 'race') {
      const check = checkRoute(
        raceRoute(c.id),c.current.x,
        c.current.z,
        c.nextCheckpoint,
        c.checkpointDistance,
        activeVenue.course.checkpointRadius,
      );
      c.checkpointDistance = check.distance;
      if (check.passed) {
        if(!c.finished)c.passed++;
        if(activeTimeTrial&&c.id===0&&!c.finished){
          trialGhostRecorder?.gate(c.passed,elapsed);
          const previous=trialGhostTarget?.gates[c.passed-1];
          if(previous!==undefined)trialGhostSplit=`GATE ${c.passed} · ${formatTrialDelta(elapsed-previous)} VS PERSONAL BEST`;
        }
        c.nextCheckpoint = (c.nextCheckpoint + 1) % 24;
        c.checkpointDistance = Infinity;
        if(c.finished)continue; // Keep AI rolling beyond the finish without changing its result.
        const progress=lapProgress(c.passed,raceLaps());c.lap=progress.lap;
        if(raceTimeLimit()?c.health>0&&timedRaceFinished(c.passed,elapsed,raceTimeLimit()):progress.finished){
          c.finished=true;c.finishTime=elapsed+c.penalty;
          if(c.id===0&&!demo&&!raceTimeLimit()){if(activeClubRound!==null)freezeClubPlayer();else finish('FINISH LINE');}
        }
      }
    }
  }
  if (!demo && activeClubRound===null && mode === 'race' && cars[0].health <= 0 && !(raceTimeLimit()&&cars[0].finished)) finish('RETIRED · DAMAGE');
  if (mode === 'derby') {
    const alive = cars.filter((c) => c.health > 0&&!(activeClubRound!==null&&clubRetired&&c.id===0));
    if(scoreDerby()){if(elapsed>=eventDuration())finish('TIME’S UP');}
    else if (!demo && activeClubRound===null && cars[0].health <= 0) finish('WRECKED OUT');
    else if (alive.length <= 1 && activeChallenge?.metric!=='condition') finish('LAST CAR STANDING');
    else if (elapsed >= eventDuration()) finish('TIME’S UP');
  }
  if(activeClubRound!==null&&state==='playing'){
    if(cars[0].health<=0&&!clubPlayerStopped)freezeClubPlayer();
    if(mode==='race'){if(clubFirstFinish===null&&cars.some(c=>c.finished))clubFirstFinish=elapsed;
      if(cars.every(c=>c.finished||c.health<=0||c.id===0&&clubRetired)||elapsed>=300||clubFirstFinish!==null&&elapsed>=clubFirstFinish+45)finish('CLUB ROUND COMPLETE');}
  }
  if(activeChallenge&&state==='playing'&&(elapsed+cars[0].penalty>=activeChallenge.limit||cars[0].health<=0))finish('CHALLENGE COMPLETE');
  if(raceTimeLimit()&&state==='playing'&&(cars.every(c=>c.finished||c.health<=0)||elapsed>=raceTimeLimit()+120))finish('TIMED RACE COMPLETE');
  if(demo&&!raceTimeLimit()&&mode==='race'&&(cars.every(c=>c.finished||c.health<=0)||elapsed>=Math.max(600,raceLaps()*150)))finish('RACE COMPLETE');
  fx.update(dt);
}
function updateCamera(dt: number) {
  const p = demo?(cars.find(c=>c.id===director.followed)??cars[0]):cars[0];
  if (!p) return;
  if(!garageOpen){camera.up.set(0,1,0);if(camera.view?.enabled)camera.clearViewOffset();}
  if(studio){studio.updateCamera(camera,orbit,renderer);return;}
  quarry.sun.position.copy(p.root.position).addScaledVector(DAYLIGHT_DIRECTION, DAYLIGHT_DISTANCE);
  quarry.sun.target.position.copy(p.root.position);
  if(demo){cameraImpactOffset.set(0,0,0);if(state!=='paused')director.update(cars,camera,orbit,dt,mode==='race');return;}
  if (state === 'inspect' || state === 'wrecked' || state === 'paused' && resumeState === 'wrecked') {
    cameraImpactOffset.set(0,0,0);
    orbit.update();
    return;
  }
  if (state === 'menu' || state === 'lobby') {
    cameraImpactOffset.set(0,0,0);
    if(garageOpen){frameGarage(camera,p.current,p.currentQ,garageFace,innerWidth,innerHeight);return;}
    const a=1.5+Math.sin(clock*.055)*.12,target=p.current.clone().add(new T.Vector3(0,.1,0));
    camera.position.set(target.x+Math.sin(a)*7.7,target.y+1.8,target.z+Math.cos(a)*7.7);
    camera.lookAt(target.x-2.15,target.y+.12,target.z);
    return;
  }
  const f = new T.Vector3(0, 0, 1).applyQuaternion(p.root.quaternion);
  f.y = 0;
  f.normalize();
  const target = p.root.position.clone();
  const desired = hood
    ? target
        .clone()
        .addScaledVector(f, 1.35)
        .add(new T.Vector3(0, 0.58, 0))
    : chaseComposition(target,f,p.speed).position;
  const cameraGround = activeVenue===quarryVenue?Math.max(scenerySurfaceHeight(desired.x, desired.z), quarryExtensionHeight(desired.x, desired.z) ?? -Infinity, quarryWestWallHeight(desired.x, desired.z) ?? -Infinity):activeVenue.course.height(desired.x,desired.z);
  desired.y = Math.max(desired.y, cameraGround + 0.65);
  camera.position.sub(cameraImpactOffset);
  camera.position.lerp(desired, 1 - Math.exp(-dt * (hood ? 25 : 5)));
  const look = hood ? target.clone().addScaledVector(f,22).add(new T.Vector3(0,.5,0)) : chaseComposition(target,f,p.speed).target;
  camera.lookAt(look);
  const response = p.impactResponse.step(state === 'playing' ? dt : 0);
  cameraImpactOffset.copy(response.offset).multiplyScalar(hood ? .65 : 1);
  camera.position.add(cameraImpactOffset);
  camera.rotateZ(response.roll * (hood ? .6 : 1));
  camera.rotateX(response.pitch);
  camera.fov = T.MathUtils.damp(
    camera.fov,
    hood ? 66 : CHASE_VIEW.fov + Math.min(5, Math.abs(p.speed) * 0.12),
    3,
    dt,
  );
  camera.updateProjectionMatrix();
}
/** Screen ownership is explicit: a pad never activates controls underneath a modal. */
function controllerContext():NavigationContext|null {
  if(preparingEvent)return null;
  const screen=(key:string,selector:string,initial:string,back?:()=>void):NavigationContext|null=>{
    const root=ui.querySelector<HTMLElement>(selector);return root?{key,root,initial,back}:null;
  };
  const click=(selector:string)=>()=>ui.querySelector<HTMLButtonElement>(selector)?.click();
  if(studio)return screen(studio.hidden?'studio-hidden':'studio','.studio',studio.hidden?'#studio-reveal':studio.doc?'#studio-play':'#studio-camera',()=>{if(studio?.hidden)studio.toggleHud();else closeStudio();});
  if(closeReplayLibrary){
    const library=ui.querySelector<HTMLElement>('#replay-library');
    if(library?.getAttribute('aria-busy')==='true')return null;
    const confirmation=library?.querySelector<HTMLElement>('.library-confirm:not([hidden])');
    if(confirmation)return {key:'library-confirm',root:confirmation,initial:'[data-action="cancel"]',back:()=>confirmation.querySelector<HTMLButtonElement>('[data-action="cancel"]')?.click()};
    return screen('library','#replay-library','#library-close',()=>closeReplayLibrary?.());
  }
  if(ui.querySelector('#demo-setup'))return screen('demo-setup','#demo-setup','#demo-course',click('#demo-cancel'));
  if(ui.querySelector('.save-backup[aria-busy="true"]'))return null;
  if(ui.querySelector('#save-confirm:not([hidden])'))return screen('save-confirm','#save-confirm','#save-cancel',click('#save-cancel'));
  if(state==='paused')return screen('pause','#overlay','#resume',resume);
  if(ui.querySelector('#online-dialog'))return screen('online-connect','#online-dialog','#cancel-online',click('#cancel-online'));
  if(clubOpen){
    const confirmation=ui.querySelector<HTMLElement>('#club-restart-confirmation');
    if(confirmation&&!confirmation.hidden)return {key:'club-confirm',root:confirmation,initial:'#club-cancel-restart',back:click('#club-cancel-restart')};
    return screen('club','.club-board',ui.querySelector('#club-start')?'#club-start':'#club-create',closeClubCup);
  }
  if(timeTrialOpen)return screen('time-trial-setup','#time-trial-setup','#time-trial-course',click('#time-trial-close'));
  if(eventSetupOpen)return screen('event-setup','.event-setup','#event-field',click('#event-close'));
  if(careerOpen)return screen('career','.career-board','[data-career-filter="racing"]',click('#career-close'));
  if(profileOpen)return screen('profile','.profile-board','[data-filter="racing"]',click('#profile-close'));
  if(garageOpen)return screen('garage','.garage-screen','#garage-engine',click('#garage-close'));
  if(state==='result'&&activeTimeTrial)return screen('time-trial-result','#time-trial-result','#again',click('#back'));
  if(state==='result'&&!demo)return screen('result','.overlay',activeChallenge?'#challenge-retry':'#again',click(activeChallenge?'#challenge-menu':'#back'));
  if(state==='lobby')return screen('lobby','.online-dialog','#start-online',click('#leave-online'));
  if(state==='menu')return screen('menu','.menu','#start');
  if(demo&&!demoHudHidden&&['playing','countdown','result'].includes(state))return screen('demo','.hud','#demo-camera',()=>pause());
  if(state==='loading'&&!preparingEvent)return screen('reload','.menu','#event-reload');
  return null;
}
function controllerKey(context:NavigationContext|null):string {
  if(context)return context.key;
  if(preparingEvent||state==='loading')return 'loading';
  if(closeReplayLibrary)return 'library-busy';
  if(['playing','countdown'].includes(state))return demo?'demo-hidden':'driving';
  return state;
}
function pollController(now:number){
  const pad=selectedPad(drivingControls,navigator.getGamepads?.()??[]);
  let context=controllerContext(),key=controllerKey(context);
  const sample=controllerInput.update(pad,now,key,drivingControls.triggerDeadzone);
  // Offline events stop on a lost active controller. Reconnection never resumes them automatically.
  if(sample.disconnected&&!online?.active&&(['playing','countdown','wrecked'].includes(state)||demo&&state==='result')){
    pause();toast('CONTROLLER DISCONNECTED · RECONNECT OR USE KEYBOARD',5);
    context=controllerContext();key=controllerKey(context);controllerInput.update(pad,now,key,drivingControls.triggerDeadzone);
  }
  controllerNavigation.sync(context);
  if(!preparingEvent&&key!=='library-busy')for(const command of sample.commands){
    if(controllerKey(controllerContext())!==key)break;
    if(command==='start'){
      if(!demo&&['playing','countdown'].includes(state)&&[drivingControls.throttleButton,drivingControls.brakeButton,drivingControls.handbrakeButton].includes(9))continue;
      if(state==='paused'||state==='inspect')resume();
      else if(studio){if(studio.hidden)studio.toggleHud();else studio.togglePlay();}
      else if(['playing','countdown','wrecked'].includes(state)||demo&&state==='result')pause();
    }else if(command==='camera'||command==='recover'){
      // Preserve custom driving maps: a button assigned to a pedal/handbrake keeps that meaning.
      const button=command==='camera'?2:3,assigned=[drivingControls.throttleButton,drivingControls.brakeButton,drivingControls.handbrakeButton].includes(button);
      if(!assigned&&!studio&&['playing','countdown'].includes(state)){
        if(command==='camera'){if(demo)director.cycleView();else hood=!hood;}
        else if(!demo&&state==='playing')recover();
      }
    }else if(context)controllerNavigation.handle(command);
    else if(demo&&demoHudHidden&&['playing','countdown','result'].includes(state)){
      demoHudHidden=false;ui.classList.remove('demo-clean');
    }else if(command==='back'&&state==='inspect')resume();
    else if(command==='back'&&['playing','countdown'].includes(state)&&![drivingControls.throttleButton,drivingControls.brakeButton,drivingControls.handbrakeButton].includes(1))pause();
  }
  // Activation can synchronously change screens before the physics loop runs.
  // Consume the held press now, including triggers and A, until it is released.
  context=controllerContext();controllerInput.update(pad,now,controllerKey(context),drivingControls.triggerDeadzone);controllerNavigation.sync(context);
  const hideHelp=!pad||preparingEvent||state==='loading'||controllerKey(context)==='library-busy'||demo&&demoHudHidden||!!studio?.hidden;
  if(controllerHelp.hidden!==hideHelp)controllerHelp.hidden=hideHelp;
  const assigned=(button:number)=>[drivingControls.throttleButton,drivingControls.brakeButton,drivingControls.handbrakeButton].includes(button);
  const hint=context?'D-PAD / STICK navigate · ← → adjust · A select · B back'+(state==='paused'?' · START resume':studio?' · START play / pause':demo?' · START pause':''):state==='inspect'?'B / START return to driving':'DRIVING: saved controls'+(!assigned(2)?' · X camera':'')+(!assigned(3)?' · Y recover':'')+(!assigned(9)?' · START pause':!assigned(1)?' · B pause':' · ESC pause');
  const message=hint+(['playing','countdown'].includes(state)&&sound.ctx?.state==='suspended'?' · CLICK / KEY for sound':'');
  if(controllerHelp.textContent!==message)controllerHelp.textContent=message;
}
function frame(now: number) {
  requestAnimationFrame(frame);
  const raw = (now - lastFrame) / 1000;
  if(state==='playing'&&Number.isFinite(raw)&&raw>0){eventFrameTimes.push(raw*1000);if(eventFrameTimes.length>300)eventFrameTimes.shift();}
  const dt = Math.min(0.05, raw);
  lastFrame = now;
  // A controller Resume updates lastFrame; measure this frame before that callback.
  pollController(now);
  clock += dt;
  if (!physics || state === 'loading') return;
  // Include long stalls in the sustained benchmark, including event restarts.
  if(capturedFrames&&capturedFrames.length<50_000&&Number.isFinite(raw)&&raw>0)capturedFrames.push(raw*1000);
  if (raw < 1) {
    frames.push(raw * 1000);
    if (frames.length > 600) frames.shift();
  }
  if(studio){studio.update(dt);if(studio.seeking)return;}
  else if(online?.active) {
    if(state==='playing' && online.network.connected)online.network.setInput(input());else online.network.setInput({throttle:0,steer:0,brake:1,handbrake:false});
    const s=online.network.sample();if(s){online.apply(s,dt);quarry.applyProps(s.props);elapsed=s.elapsed;countdown=s.countdown;}
    accumulator+=dt;let n=0;while(accumulator>=1/60 && n++<4){physics.step();fx.update(1/60);accumulator-=1/60;}
    const net=document.getElementById('network-status');if(net)net.textContent=online.network.connected?`ROOM ${online.network.room} · ${online.network.latency} MS`:online.network.reconnecting?'RECONNECTING · CONTROLS CLEARED':`${online.network.disconnectReason} · ESC TO LEAVE`;
  } else if (['playing', 'countdown'].includes(state)) {
    accumulator += dt;
    let n = 0;
    withWreckBatch(()=>{
    while (accumulator >= 1 / 60 && n++ < 4) {
      step(1 / 60);
      accumulator -= 1 / 60;
    }
    });
    for (const c of cars) c.render(state === 'wrecked' ? 1 : accumulator / (1 / 60));
  }
  if (state === 'wrecked') {
    fx.update(dt);
    wreckHold = Math.max(0, wreckHold - dt);
    text('wreck-count', String(Math.ceil(wreckHold)));
    if (wreckHold === 0) { createCars(true); menu(); }
  }
  if(demo&&state==='result'){demoRestart=Math.max(0,demoRestart-dt);fx.update(dt);if(demoRestart===0){const next=nextDemoMode(mode,demoOptions.loop);if(next){mode=next;state='loading';void start(true);}}}
  updateTrialGhost();
  updateCamera(dt);
  if(!studio)for(const car of cars){car.wreckParts.pose(['playing','countdown'].includes(state)?dt:0,car.speed);car.wreckParts.wheelsPose();car.syncSuspension();}
  const effectsActive=['playing','countdown','wrecked'].includes(state)||(demo&&state==='result');
  if(!studio)vehicleFire?.update(cars,effectsActive?dt:0,camera);
  if(!studio)puddleSplashes?.update(cars,activeVenue.puddles,effectsActive?dt:0,state==='playing');
  if(!studio&&state==='playing')captureReplay();
  if(effectsActive){sound.update(cars,camera,dt,state==='wrecked');if(vehicleFire)sound.thermal(vehicleFire.audio,vehicleFire.bursts);}
  if(activeVenue===quarryVenue)quarry.update(camera);
  waypointMarkers??=new WaypointMarkers(scene);waypointMarkers.update(waypointRace,demo?director.followed:online?.active?online.network.id:0,!studio&&mode==='race'&&['playing','countdown','paused','result'].includes(state));
  if(waypointRace)activeVenue.checkpoint.visible=false;
  if(!studio&&!waypointRace&&mode==='race'&&cars[0]) {
    const followed=demo?cars.find(c=>c.id===director.followed)??cars[0]:cars[0],p=raceRoute(followed.id)[followed.nextCheckpoint],ahead=raceRoute(followed.id)[(followed.nextCheckpoint+1)%24];
    activeVenue.checkpoint.position.set(p.x,activeVenue===quarryVenue?terrainHeight(p.x,p.z):activeVenue.course.height(p.x,p.z),p.z);
    activeVenue.checkpoint.rotation.y=Math.atan2(ahead.x-p.x,ahead.z-p.z);
  }
  renderer.info.reset();
  if (staticShadows) {
    for (const car of cars) staticShadows.bindReceivers(car.root);
    staticShadows.prepare(renderer);
  }
  if (cars[0]) reflections.update(cars[0].root);
  renderer.shadowMap.needsUpdate = true;
  composer.render();
  studio?.capture(canvas);
  hudTime += dt;
  if (hudTime > 0.12) {
    hudTime = 0;
    updateHud();
  }
  if (
    benchmarkStart &&
    now - benchmarkStart > (benchmarkSamples.length + 1) * 10000
  ) {
    benchmarkSamples.push({
      time: (now - benchmarkStart) / 1000,
      fps: 1000 / (frames.reduce((a, b) => a + b, 0) / frames.length),
      geometries: renderer.info.memory.geometries,
      textures: renderer.info.memory.textures,
      heap: (performance as any).memory?.usedJSHeapSize ?? 0,
    });
  }
}
addEventListener('pointerdown',e=>{if(e.isTrusted)sound.unlock();});
addEventListener('keydown', (e) => {
  if(e.isTrusted)sound.unlock();
  if(studio){if(e.code==='Escape'){e.preventDefault();closeStudio();}else if(e.code==='KeyH'&&!(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement)){e.preventDefault();studio.toggleHud();}else if(e.code==='Space'&&!(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement)){e.preventDefault();studio.togglePlay();}else if((e.code==='ArrowLeft'||e.code==='ArrowRight')&&!(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement)){e.preventDefault();studio.seek(studio.time+(e.code==='ArrowLeft'?-1:1)*(e.shiftKey?1:.05));}return;}
  if(e.code==='KeyP'&&['playing','countdown'].includes(state)&&!online?.active){e.preventDefault();pause();openStudio(true);return;}
  if(closeReplayLibrary){if(e.code==='Escape'){e.preventDefault();closeReplayLibrary();}return;}
  if(clubOpen){if(e.code==='Escape'){e.preventDefault();closeClubCup();}return;}
  if(timeTrialOpen){if(e.code==='Escape'){e.preventDefault();ui.querySelector<HTMLButtonElement>('#time-trial-close')?.click();}return;}
  if(eventSetupOpen){if(e.code==='Escape'){eventSetupOpen=false;menu();}return;}
  if(careerOpen){if(e.code==='Escape'){careerOpen=false;menu();}return;}
  if(profileOpen){if(e.code==='Escape'){profileOpen=false;menu();}return;}
  if(garageOpen){if(e.code==='Escape'){garageOpen=false;createCars(true);menu();}return;}
  if(e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement)return;
  if(state==='lobby')return;
  if (
    (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)||Object.values(drivingControls.keys).some(binding=>binding.includes(e.code)))
  )
    e.preventDefault();
  if (e.repeat) return;
  if (e.code === 'Escape') {
    state === 'paused' || state === 'inspect' ? resume() : pause();
    return;
  }
  if (e.code === 'KeyF') fullScreen();
  if (e.code === 'KeyM') sound.mute();
  if(demo&&e.code==='KeyH'){demoHudHidden=!demoHudHidden;ui.classList.toggle('demo-clean',demoHudHidden);return;}
  if (demo&&e.code==='Space'){e.preventDefault();state==='paused'?resume():pause();return;}
  if(demo&&(e.code==='BracketLeft'||e.code==='BracketRight'))director.cycleCar(cars,e.code==='BracketLeft'?-1:1);
  if (e.code === 'KeyC') {if(demo)director.cycleView();else hood = !hood;}
  if (!demo && e.code === 'KeyR' && state === 'playing') recover();
  if (!activeChallenge && !online?.active && e.code === 'KeyT' && mode === 'playground' && state === 'playing') {
    traffic = !traffic;
    start();
  }
  if (!online?.active && e.code === 'KeyI' && mode === 'playground') {
    if (state === 'inspect') resume();
    else if (state === 'playing') {
      state = 'inspect';
      sound.pause(true);
      orbit.enabled = true;
      orbit.target.copy(cars[0].current);
      ui.innerHTML =
        '<div class="inspect-note">DRAG TO ORBIT · SCROLL TO ZOOM · I / ESC TO RETURN</div>';
    }
  }
  if (state === 'playing' || state === 'countdown') keys.add(e.code);
});
addEventListener('keyup', (e) => keys.delete(e.code));
addEventListener('blur', () => {
  keys.clear();online?.network.clearInput();
  if(preparingEvent)preparationInterrupted=true;
  if ((['playing', 'countdown', 'wrecked'].includes(state)||demo&&state==='result')) pause();
});
document.addEventListener('visibilitychange', () => {
  if(document.hidden&&preparingEvent){preparationInterrupted=true;keys.clear();}
  if (document.hidden && (['playing', 'countdown', 'wrecked'].includes(state)||demo&&state==='result')) pause();
});
addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
});
canvas.addEventListener('webglcontextlost', (e) => {
  e.preventDefault();
  if ((['playing', 'countdown', 'wrecked'].includes(state)||demo&&state==='result')) pause();
  toast('Graphics context lost. Reload to restore.', 20);
});
canvas.addEventListener('webglcontextrestored', () => {
  // Render-target contents are lost with the context, unlike source HDR data.
  if (environmentTarget && scene.background instanceof T.Texture) {
    const generator = new T.PMREMGenerator(renderer);
    try {
      // A fresh PMREMGenerator needs to allocate its own filtering planes.
      // Passing an old target here skips that initialization in Three r181.
      const replacement = generator.fromEquirectangular(scene.background);
      scene.environment = replacement.texture;
      environmentTarget.dispose();
      environmentTarget = replacement;
    } finally {
      generator.dispose();
    }
  }
  reflections.invalidate();
  staticShadows?.invalidate();
  if (quarry) quarry.sun.shadow.needsUpdate = true;
});
async function boot() {
  loading('PREPARING THE QUARRY');
  await R.init();
  physics = new R.World({ x: 0, y: -9.81, z: 0 });
  physics.timestep = 1 / 60;
  events = new R.EventQueue(true);
  fx = new Effects(scene, physics);
  vehicleFire = new VehicleFire(scene,(p,n,type,force)=>fx.emit(p,n,type,force));
  vehicleFire.setQuality(settings.quality);
  puddleSplashes=new PuddleSplashes(scene);puddleSplashes.setQuality(settings.quality);
  const beforeQuarry=new Set(scene.children);
  quarry = new Quarry(scene, physics);
  const quarryRoot=new T.Group();quarryRoot.name='quarry_venue';
  const quarryNodes=scene.children.filter(node=>!beforeQuarry.has(node)&&!(node instanceof T.Light)&&node!==quarry.sun.target);
  quarryRoot.add(...quarryNodes);scene.add(quarryRoot);
  quarryVenue={course:getRaceCourse(),physics,root:quarryRoot,checkpoint:quarry.checkpoint,props:quarry.props,puddles:quarry.puddles};activeVenue=quarryVenue;
  online=new OnlineView(scene,physics,fx,sound,()=>cars,next=>{cars=next;});
  onlineUI=new OnlineUI(ui,online.network,{connect:connectOnline,leave:leaveOnline,loadout:(car=kind)=>({kind:car,setup:copyOnlineSetup(garage.cars[car].setup),livery:garage.cars[car].setup.livery})});
  online.network.addEventListener('snapshot',receiveOnline);
  online.network.addEventListener('connected',()=>{const url=new URL(location.href);url.searchParams.set('room',online.network.room);history.replaceState(null,'',url);sound.pause(!['playing','countdown'].includes(state));});
  online.network.addEventListener('error',e=>{const message=(e as CustomEvent<string>).detail;onlineUI.message(message);toast(message,8);});
  online.network.addEventListener('disconnected',e=>{keys.clear();online.network.clearInput();sound.pause(true);onlineUI.message((e as CustomEvent<string>).detail);toast(online.network.reconnecting?'Connection lost · reconnecting':online.network.disconnectReason+' · press Escape to leave',8);});
  const prepared = await Promise.all([
    loadCars(loading),
    environment(renderer, scene),
    prepareArenaFloor(),
    prepareNorthForestFloor(),
    prepareCircuitSurface(),
    quarry.trees(),
    onlineUI.configure(),
    VehicleFire.loadBaked(),
    prepareReferenceFloor(),
  ]);
  environmentTarget = prepared[1];
  vehicleFire.useBaked();
  setQuarryMode();
  staticShadows = new StaticQuarryShadows(quarryVenue.root, new Set<T.Object3D>([
    ...quarry.modeScenery, quarry.checkpoint, ...quarry.props.map(prop => prop.mesh),
  ]));
  createCars(true);
  staticShadows.bindReceivers(scene);
  applyQuality();
  loading('WARMING LIGHTING AND REFLECTIONS');
  void sound.preload().catch(()=>{}); // A failed prefetch is retried on Start.
  // Queue programs together instead of waiting for each shader during the first
  // visible frame. Match the composer's offscreen output to avoid extra variants.
  await warmPrograms(true);
  syncClubAwards();
  menu();
  if(new URL(location.href).searchParams.has('room'))onlineUI.show();
  (window as any).__quarry = {
    get timeTrial(){return structuredClone({active:activeTimeTrial,records:timeTrialRecords,result:timeTrialResult,warning:timeTrialWarning,invalidReason:timeTrialInvalidReason,open:timeTrialOpen});},
    get clubState(){return {cup:clubCup,activeRound:activeClubRound,retired:clubRetired,playerStopped:clubPlayerStopped,firstFinish:clubFirstFinish,recordedStats:clubRunStats,warning:clubWarning};},
    get courseState(){return{id:activeVenue.course.id,quarryVisible:quarryVenue.root.visible,ironfieldVisible:raceVenues['ironfield-figure-eight-v1']?.root.visible??false,cinderbankVisible:raceVenues['cinderbank-oval-v1']?.root.visible??false,bodies:physics.bodies.len(),colliders:physics.colliders.len(),quarryBodies:quarryVenue.physics.bodies.len(),ironfieldBodies:raceVenues['ironfield-figure-eight-v1']?.physics.bodies.len()??0,cinderbankBodies:raceVenues['cinderbank-oval-v1']?.physics.bodies.len()??0};},
    get eventRules(){return{...eventOptions,aiDifficulty:drivers.difficulty,score:scoreDerby(),field:cars.length,combat:Array.from(combat.records)};},
    get progression(){return{profile,run:telemetry?.stats,challenge:activeChallenge?.id,settled:runSettled,lastAward};},
    get garageSetup() { return {kind, saved:garage.cars[kind], active:cars[0]?.specification}; },
    get northForest() { return northForestDiagnostics(camera); },
    get northRidge() { return northRidgeDiagnostics(camera); },
    get cameraPose() { return { position: camera.position.toArray(), quaternion: camera.quaternion.toArray(), target: orbit.target.toArray(), fov: camera.fov, aspect: camera.aspect }; },
    get network(){return {active:online.active,connected:online.network.connected,id:online.network.id,room:online.network.room,snapshot:online.network.snapshot};},
    connectOnline,leaveOnline,
    startOnline:(m:Mode)=>online.network.start(m),
    get state() {
      return state;
    },
    get mode() {
      return mode;
    },
    get cars() {
      return cars.map((c) => ({
        id: c.id,
        kind: c.kind,
        health: c.health,
        speed: c.speed,
        position: c.current.toArray(),
        passed: c.passed,
        lap: c.lap,
        next: c.nextCheckpoint,
        inflicted: c.inflicted,
      }));
    },
    get daylight() {
      return {sunDirection: quarry.sun.position.clone().sub(quarry.sun.target.position).normalize().toArray(), sun: quarry.sun.intensity,
        sunColor: quarry.sun.color.getHex(), sky: scene.environmentIntensity,
        ambient: (scene.children.find(o => o instanceof T.HemisphereLight) as T.HemisphereLight)?.intensity,
        tone: renderer.toneMapping === T.AgXToneMapping ? 'agx' : 'aces',
        backgroundRotation: scene.backgroundRotation.toArray(), environmentRotation: scene.environmentRotation.toArray(),
        fog: (scene.fog as T.FogExp2).density, exposure: renderer.toneMappingExposure,
        nearShadowSize: quarry.sun.shadow.mapSize.toArray(), nearShadowExtent: quarry.sun.shadow.camera.right-quarry.sun.shadow.camera.left,
        staticShadows: staticShadows?.stats};
    },
    get impactState() { const p=cars[0];return p?{offset:{...p.impactResponse.offset},velocity:{...p.impactResponse.velocity},roll:p.impactResponse.roll,pitch:p.impactResponse.pitch,effects:{...p.impactEffects}}:null; },
    get audioState() { return {state:sound.ctx?.state,muted:sound.muted,master:sound.master?.gain.value,voices:sound.activeVoices,buffers:sound.buffers.size,levels:{...sound.levels}}; },
    get fireState() { return vehicleFire?.stats; },
    get splashState(){return puddleSplashes?.stats;},
    get surfaceState(){return{ground:fx.evidence.stats,cars:cars.map(c=>({id:c.id,...c.surfaceFinish.stats,scraping:c.scraping,paintVertices:c.panels.reduce((sum,p)=>sum+Array.from(p.geometry.attributes.transferPaint.array).filter((v,i)=>i%4===3&&v>0).length,0),wheels:Array.from(c.wreckParts.wheelDamage,(damage,i)=>({damage,rest:c.controller.wheelSuspensionRestLength(i),stiffness:c.controller.wheelSuspensionStiffness(i),brake:c.controller.wheelBrake(i),steering:c.controller.wheelSteering(i),contact:c.tireContacts[i].active.value,load:c.tireContacts[i].load.value}))}))};},
    get puddles(){return quarry.puddles;},
    get arenaState(){return{...quarry.arenaLayout,expanded:quarry.arenaPhysics.expanded,enabledWalls:quarry.arenaPhysics.walls.filter(c=>c.isEnabled()).length};},
    get artDirection(){return{composition:CHASE_VIEW,scenery:quarry.referenceArena.stats};},
    seedFireTest:(seed:number)=>{
      vehicleFire?.dispose();let randomState=seed>>>0;
      vehicleFire=new VehicleFire(scene,(p,n,t,f)=>fx.emit(p,n,t,f),()=>{randomState=(Math.imul(randomState,1664525)+1013904223)>>>0;return randomState/4294967296;});
      vehicleFire.setQuality(settings.quality);
    },
    seedFireStress:()=>{
      // Explicit QA fixture for the maximum effects budget; unused by gameplay.
      vehicleFire?.update(cars,0,camera);
      const seeds=Array.from({length:8192},(_,i)=>i/8192).filter(s=>unitNoise(s)<.24&&unitNoise(s+9.37)>=.12&&unitNoise(s+2.13)>.3);
      if(vehicleFire)for(const [id,e]of vehicleFire.emitters){
        e.state=new VehicleThermalState(e.car.health,seeds[id%seeds.length]);e.state.advance(e.car.health,1/60,0,e.car.damageZones,e.profile.engineZone,e.profile.waterCooled);
        Object.assign(e.state,{fuelTime:600}); // Hold the maximum load during QA only.
      }
    },
    simulateSplashes:(seconds:number)=>{for(let i=0;i<Math.min(2,seconds)*60;i++)puddleSplashes?.update(cars,quarry.puddles,1/60,true);},
    simulateFire:(seconds:number)=>{
      for(let i=0;i<Math.min(60,Math.max(0,seconds))*60;i++){
        vehicleFire?.update(cars,1/60,camera);
        if(vehicleFire?.bursts.length){sound.thermal(vehicleFire.audio,vehicleFire.bursts);return true;}
      }
      return false;
    },
    get fireAudio() { return [...sound.loops].map(([id,loops])=>({id,layers:[...loops].filter(([name])=>name.startsWith('fire-')).map(([name,l])=>({name,level:l.gain.gain.value,position:[l.pan.positionX.value,l.pan.positionY.value,l.pan.positionZ.value]}))})); },
    get stats() {
      const times = [...frames].sort((a, b) => a - b);
      return {
        elapsed,
        collisions,
        drawCalls: renderer.info.render.calls,
        reflectionUpdates: reflections.updates,
        staticShadows: staticShadows?.stats,
        triangles: renderer.info.render.triangles,
        geometry: renderer.info.memory.geometries,
        textures: renderer.info.memory.textures,
        meanMs: frames.reduce((a, b) => a + b, 0) / frames.length,
        p95: times[Math.floor(times.length * 0.95)],
        audio: sound.buffers.size,
        activeParticles: fx.particles.filter(p=>p.life>0).length,
        debris: fx.debris.length,
        voices: sound.activeVoices,
        loops: sound.loops.size,
        thermal: vehicleFire?.stats,
        state,
        benchmarkSamples,
      };
    },
    start: async (m: Mode) => {
      mode = m;
      await start(false);
    },
    startDemo:async(m:Mode='derby')=>{mode=m==='race'?'race':'derby';await start(true);},
    get demo(){return {active:demo,view:director.view,shot:director.activeView,followed:director.followed,manual:director.manual,restart:demoRestart};},
    get aiState(){return [...drivers.memory].map(([id,m])=>({id,...m}));},
    demoCamera:(view:DemoCamera)=>director.select(view),
    followCar:(id:number)=>director.follow(id),
    autopilot: (v: boolean) => {
      autopilot = v;
    },
    resume,
    pause,
    recover,
    menu: () => {
      createCars(true);
      menu();
    },
    setQuality: (v: string) => {
      settings.quality = v;
      applyQuality();
    },
    lighting: (v:{fog?:number;sun?:number;sky?:number;exposure?:number;ambient?:number;tone?:string;staticShadows?:boolean})=>{
      if(v.staticShadows!==undefined && staticShadows)staticShadows.enabled=v.staticShadows;
      if(v.fog!==undefined)(scene.fog as T.FogExp2).density=v.fog;
      if(v.sun!==undefined)quarry.sun.intensity=v.sun;
      if(v.sky!==undefined)scene.environmentIntensity=v.sky;
      if(v.exposure!==undefined)renderer.toneMappingExposure=v.exposure;
      if(v.ambient!==undefined)scene.children.forEach(o=>{if(o instanceof T.HemisphereLight)o.intensity=v.ambient!;});
      if(v.tone)renderer.toneMapping=v.tone==='agx'?T.AgXToneMapping:T.ACESFilmicToneMapping;
      reflections.update(cars[0].root,true);
    },
    benchmark: () => {
      benchmarkStart = performance.now();
      benchmarkSamples.length = 0;
      capturedFrames=[];
    },
    endBenchmark:()=>{const report={samples:[...benchmarkSamples],frames:capturedFrames??[]};benchmarkStart=0;capturedFrames=null;return report;},
    setTime: (v: number) => {
      elapsed = v;
    },
    damage: (id: number, amount: number, side = 'front',paint?:number) => {
      const c = cars[id],
        d = new T.Vector3(
          side === 'left' ? -1 : side === 'right' ? 1 : 0,
          side === 'roof' ? .55 : 0.1,
          side === 'rear' ? -2 : side === 'front' ? 2 : 0,
        ).applyQuaternion(c.currentQ);
      c.hit(
        c.current.clone().add(d),
        d.clone().negate().normalize(),
        amount,
        elapsed,
        false,paint===undefined?undefined:new T.Color(paint),
      );
    },
    teleport: (id: number, x: number, z: number, yaw = 0) =>
      cars[id].place(x, z, yaw),
    input: (value: Input) => {
      cars[0].input = value;
    },
    captureCamera: (p: number[], look: number[]) => {
      state = 'inspect';
      orbit.enabled = false;
      camera.position.fromArray(p);
      orbit.target.fromArray(look);
      document.getElementById('overlay')?.remove();
      camera.lookAt(new T.Vector3().fromArray(look));
    },
    simulate: (seconds: number) => {
      for (let i = 0; i < seconds * 60; i++) step(1 / 60);
      updateHud();
    },
    checkpoint: (id: number) => {
      const c = cars[id],
        p = raceRoute()[c.nextCheckpoint];
      c.place(p.x, p.z, 0);
    },
    mute: () => sound.mute(),
    inspect: () =>
      cars.map((c) => ({
        id: c.id,
        panels: c.panels.length,
        burn: c.wreckFinish.soot.value,
        loose: c.wreckParts.assemblies.filter(a=>a.loose>0&&a.members.some(p=>p.mesh.visible)).map(a=>({name:a.name,loose:a.loose})),
        wheelDamage: Array.from(c.wreckParts.wheelDamage),
        detached: c.panels.filter((p) => !p.visible).length,
        glass: c.glass.filter((p) => !p.visible).length,
        position: c.current.toArray(),
        steer: c.steering,
        forward: c.forward.toArray(),
        health: c.health,
      })),
    velocity: (id: number, x: number, y: number, z: number) =>
      cars[id].body.setLinvel({ x, y, z }, true),
    setHealth: (id: number, h: number) => {
      cars[id].health = h;
    },
    keyboardInput: () => input(),
    clearTestInput: () => { testInput = null; },
    setInput: (v: Input) => {
      testInput = v;
    },
    get result() {
      return resultTitle;
    },
  };
}
async function warmPrograms(includeStatic=false) {
  const previousTarget=renderer.getRenderTarget();
  renderer.setRenderTarget(composer.readBuffer);
  try {
    const pending=[renderer.compileAsync(scene,camera)];
    if(includeStatic&&staticShadows)pending.push(renderer.compileAsync(staticShadows.casterScene,staticShadows.camera));
    await Promise.all(pending);
  } finally { renderer.setRenderTarget(previousTarget); }
}
requestAnimationFrame(frame);
boot().catch((e) => {
  console.error(e);
  loading('COULD NOT LOAD — ' + String(e));
});

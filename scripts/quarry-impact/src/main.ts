import {raceFinishRemaining} from './race-finish-window';
import {onlineSpectatorEligible} from './spectator-state';
import {prepareLoadingStages,type LoadingStage} from './loading-stages';
import {clubEngineLabel} from './club-engine-label';
import {classEngineLabel} from './class-engine';
import {programWarmupView} from './program-warmup';
import {ReplayPuddles} from './replay-puddles';
import {ReplaySlicks} from './replay-slicks';
import {PropFires,propKind,DRUM_BLAST} from './prop-fires';
import {avoidFires,contactHeat,CAR_FIRE} from './fire-avoidance';
import {oilWarning,coolantWarning,fuelWarning,OIL,COOLANT} from './oil-starvation';
import {setSceneShadows,createPMREMGenerator} from './rendering';
import {quarryReplayProps} from './quarry-tyres';
import {colliderImpactMaterial,type ImpactMaterial} from './impact-material';
import {demoRaceDirection} from './demo-session';
import {AUDIO_OUTPUTS,readAudioOutput} from './audio-output';
import {ReplayFire} from './replay-fire';
import {ReplayBurstPlayback} from './replay-burst-audio';
import {ReplayImpactPlayback} from './replay-impact-audio';
import {ReplayAudioTransport} from './replay-audio';
import {driverLabel,resultDriverLabel} from './driver-identity';
import {teamPursuitRules,pursuitGridOrder,pursuitTeamWon,pursuitRecordSuffix,pursuitTeamTitle} from './pursuit-teams';
import {clearChasePosition} from './chase-camera-clearance';
import {designGarageCallbacks} from './design-panel';
import {armorWearWarning} from './armor-wear';
import {showVenueBrowser,selectVenue,selectDemoVenue} from './venue-browser';
import {readCameraSettings,playerChaseComposition,mountCameraSettings} from './camera-settings';
import {ScreenCraze,trackCraze,hull,type CrazeState} from './screen-craze';
import {speedFov,smoothAccel,roadBuzz} from './speed-feel';
import {FINAL_TWO,finalTwo,finalTwoBanner,revenge,takedownChain,comboLabel,revengeReady,lastGasp,strippedLabel,STRIPPED,FINAL_FOUR,finalFour,finalFourBanner,rolledBy,DESTRUCTION_POINTS,slamBy,isSlam,DOMINO,dominoBy,FINAL_STUNTS,finalStunts,stuntValue} from './derby-moments';
import {wreckCause} from './wreck-cause';
import {frenzyFactor,pointsLeader,FRENZY} from './derby-driving';
import {syncInterval,syncDue} from './vehicle-draw-batch';
let syncFrame=0;
let feelAccel=0,feelSpeed=0;
import {dashboardComposition,roofDuckDrop,nextDrivingCamera,DRIVING_CAMERA_LABELS,type DrivingCamera} from './driving-camera';
const roofDucks=new WeakMap<object,{roof:number;drop:number}>();
/** Mechanical failures as highlight moments: caption and how they rank against hits (a hit scores its damage). */
/** The crowd roars for the big mechanical failures (not for a spring). */
const f2crowd=(what:keyof typeof FAILURE_MOMENTS)=>FAILURE_MOMENTS[what].score>=22;
const FAILURE_MOMENTS={spring:{label:'SPRING BROKEN',score:18},shaft:{label:'DRIVESHAFT SNAPPED',score:22},diff:{label:'DIFF BROKEN',score:28},tierod:{label:'TIE ROD SNAPPED',score:26},exhaust:{label:'EXHAUST TORN OFF',score:24},brakefire:{label:'BRAKE FIRE',score:32},radiator:{label:'RADIATOR BURST',score:24},rollbar:{label:'ROLL BAR SNAPPED',score:20},propshaft:{label:'PROPSHAFT SNAPPED',score:24},bearing:{label:'BEARING SEIZED',score:20},belt:{label:'FAN BELT SNAPPED',score:18},enginefire:{label:'ENGINE FIRE',score:30},smashfire:{label:'SMASHED INTO FLAMES',score:34},tank:{label:'FUEL TANK DOWN',score:26},tankoff:{label:'FUEL TANK TORN OFF',score:24},cable:{label:'THROTTLE CABLE SNAPPED',score:22},handbrake:{label:'HANDBRAKE CABLE SNAPPED',score:20},battery:{label:'BATTERY THROWN OUT',score:22},rod:{label:'ROD THROUGH THE BLOCK',score:34},rubfire:{label:'TYRE ALIGHT',score:28},tyrefire:{label:'FIRE SPREAD TO THE TYRES',score:24},exhaustcrush:{label:'EXHAUST CRUSHED',score:18},gasket:{label:'HEAD GASKET BLOWN',score:22}} as const;
import {DerbyEventFeed,derbyFeedMarkup} from './derby-event-feed';
import {standingsTable,standingsKey,STANDINGS_KEYS,type StandingRow} from './standings-view';
import {pursuitTerrainClear} from './pursuit-corridor';
import {DERBY_FORMATS,readDerbyFormat,derbyEndReason,derbyRecordPrefix,derbyWreckStatus} from './derby-policy';
import {globalScoresButton} from './global-scoring-ui';
import {createCanalPassWorld} from './canal-pass-world';
import {classRecordKey,classLimitLabel,performanceLabel} from './performance-class';
import {createParkDunesWorld} from './park-dunes-world';
import {createStadiumReservoirWorld} from './stadium-reservoir-world';
import {createPortFarmWorld} from './port-farm-world';
import {createCoastForestWorld} from './coast-forest-world';
import {createRidgeClubWorld} from './ridge-club-world';
import {createAshcombeWorld} from './ashcombe-world';
import {createThornbyWorld} from './thornby-world';
import {createRavensmoorWorld} from './ravensmoor-world';
import {createWillowbankWorld} from './willowbank-world';
import {createSableWorld} from './sable-world';
import {createElmsworthWorld} from './elmsworth-world';
import {createRookvaleWorld} from './rookvale-world';
import {FOUNDRY_ARENA,buildFoundryPhysics,foundryGround} from './foundry-arena';
import {createFoundryWorld} from './foundry-world';
import {StuntChallengeProgress,stuntChallengeSpawn} from './stunt-challenge';
import {createFenwickWorld} from './fenwick-world';
import {createStuntWorld} from './stunt-world';
import {freeDriveSpawn,freeDriveRecovery} from './free-drive';
import {showFreeDriveSetup} from './free-drive-ui';
import {courseRecoveryArea} from './race-course';
import {createMillhavenWorld} from './millhaven-world';
import {createMerefieldWorld} from './merefield-world';
import {BRIARHILL_ARENA,buildBriarhillPhysics,briarhillGround} from './briarhill-arena';
import {createBriarhillWorld} from './briarhill-world';
import {WRENFORD_PIT_ARENA,buildWrenfordPitPhysics,wrenfordPitGround} from './wrenford-pit-arena';
import {KESTREL_RING_ARENA,buildKestrelRingPhysics,kestrelRingGround} from './kestrel-ring-arena';
import {createKestrelRingWorld} from './kestrel-ring-world';
import {GULLHAVEN_ARENA,buildGullhavenPhysics,gullhavenGround} from './gullhaven-yard-arena';
import {createGullhavenWorld} from './gullhaven-yard-world';
import {MOORFIELD_ARENA,buildMoorfieldPhysics,moorfieldGround} from './moorfield-speedbowl-arena';
import {createMoorfieldWorld} from './moorfield-speedbowl-world';
import {createWrenfordPitWorld} from './wrenford-pit-world';
import {createCountyWorld} from './county-world';
import {createPinecrestWorld} from './pinecrest-world';
import {combatMotion,COMBAT_AWARDS} from './combat-feats';
import {transmissionGearLabel,transmissionNotice} from './transmission';
import {drivingButtons} from './driving-controls';
import {AdaptiveGraphics,graphicsChoice} from './adaptive-graphics';
import {LIGHTING_CHOICES,readLighting,resolveLighting,applyLighting,createOvercastSky,type LightingMood} from './lighting-presets';
import {createAshfordWorld} from './ashford-world';
import {recoverSaveImport,BACKUP_JOURNAL} from './save-backup';
import {mountSaveBackup} from './save-backup-ui';
import {CAREER_GROUPS,awardCareerPodiums,careerChallenge,careerStatus,unlockCareerGroup} from './career';
import {showCareer} from './career-ui';
import './career.css';
import {loadGhostLibrary,saveGhostLibrary,findTrialGhost,raceTrialGhost,sharedTrialGhost,addSharedGhost,removeSharedGhost,exportTrialGhost,settleTrialGhost,TrialGhostRecorder,type TrialGhost} from './trial-ghost';
import {TrialGhostView,createTrialGhostView} from './trial-ghost-view';
import {formatTrialDelta} from './time-trial';
import {createRedbankWorld} from './redbank-world';
import {DAMAGE_RULES,sessionDamageRule,collisionDamageMultiplier,impactSpeedFactor,IMPACT_SPEED,DERBY_PACE,SMASH,isSmash,smashLabel,impactSoundScale,hangingOn,massShare,sharedDamage,damageRecordKey} from './damage-rules';
import {eventGridSetup,eventPerformanceGrid} from './grid-setup';
import {gridCarKind,gridRecordKey,GRID_LINEUPS,GRID_PERFORMANCE} from './grid-rules';
import {timedRaceLimit,timedRaceFinished,timedRaceOrder,timedRaceResult,timedRaceRecordScore} from './timed-race';
import {RaceRecovery,freeRecoverySlot} from './race-recovery';
import {driverFigure,DRIVER,windowNet,WINDOW_NET} from './driver-figure';
import {swayDriver} from './driver-sway';
import {duckDriver} from './driver-sway';
import {rollCage,bendCage} from './roll-cage';
import {lookYaw,turnHead} from './driver-look';
import {CROWD_BOO,ROOF_RAIN} from './audio';
import {LITTER,SHRED_TRAIL} from './crash-litter';
import {derbyFlag,waveFlag,FLAG_COLOURS} from './derby-flag';
import {CRUNCH,crunchVolume} from './litter-crunch';
import {SHRED_SECONDS} from './vehicle';
import {shouldBail,bailOut,strollAway,BAIL} from './driver-bail';
import {cabinSmoke} from './cabin-smoke';
import {WiperRig,wiperArms,windscreen,wipeStep} from './windscreen-wipers';
import {steerArms,handReach,newHandState,type HandState} from './driver-arms';
import {BONNET_STEAM,bonnetHeat,steamRate} from './bonnet-steam';
import {vapourRate} from './exhaust-vapour';
import {WIND,eventWind,gusting} from './wind';
import {HEAD_GASKET} from './damage-handling';
const HEAD_GASKET_AFTER=HEAD_GASKET.after;
import {LEAK as TYRE_LEAK_RANGE} from './damage-handling';
import type {GlassState} from './car-materials';
import {CAR_WET} from './car-materials';
import {disposeDriver} from './driver-figure';
import {roofSign} from './roof-sign';
import {withSlogan} from './race-numbers';
import {roofSignFate,foldRoofSign,roofSignBox,disposeRoofSign,type RoofSignFate} from './roof-sign';
import {withRaceNumbers} from './race-numbers';
import {BOOM} from './blow-up';
import {RIDE,ON_TOP,RIDE_SLOWMO,TIP,rammer,ridesUp,tBoner,tipsOver,tipLift,alongCar,crushedFace} from './ride-up';
import {stallHint,MAX_ENGINE_RESTART} from './engine-stall';
import {PursuitSession} from './pursuit';
import {PursuitDriving} from './pursuit-driving';
import {AI_DIFFICULTIES,readAIDifficulty,sessionAIDifficulty,difficultyRecordKey} from './ai-difficulty';
import {withWreckBatch} from './wreck-batch';
import {CollisionScars,captureCollisionMotion,collisionPointVelocity} from './collision-contact';
import {COURSE_NAMES,resolveCourseId,type CourseId} from './course-id';
import {getRaceCourse,courseRoute,courseGridSlot,courseRecoverySlot,type RaceCourse} from './race-course';
import {createIronfieldWorld} from './ironfield-world';
import {createBrackenWorld} from './bracken-world';
import {createCinderbankWorld} from './cinderbank-world';
import {tyreWarning} from './tyre-feedback';
import {fluidWarning,leakRates,burnLevel,type GroundFire} from './fluid-leaks';
import {gasketWarning,gearboxWarning,brakeWarning,steerWarning,clutchWarning,playWarning,rubWarning,electricalWarning,nutWarning,exhaustWarning,diffWarning,tieRodWarning,rollBarWarning,propWarning,bearingWarning,bearingGrowl,skewWarning,windRoar,beltWarning,batteryLights,overheatWarning,coolThrottle,OVERHEAT_FIRE,caliperWarning,mountsWarning,starterWarning,frameWarning,discGlow,diffAxle,dazeWarning,nurseThrottle,STEER_PLAY,rubHeatWarning,EXTINGUISHER,extinguisherHint,aiExtinguishAfter,exhaustCrushWarning,SHRAPNEL,shrapnelDamage,PIN,pinnedBy,pinClock,pinCounts,type PinPush,bumpStartedBy,batteryOutWarning,noBatteryHint} from './damage-handling';
import {engineStatus} from './engine-condition';
import {drivingObstacleClearance} from './driving-probe';
import {vehicleContact,vehicleContactManifold} from './vehicle-contact';
import {CAR_KINDS} from './rules';
import {DEMO_KEY,readDemoOptions,showDemoSetup,nextDemoMode,demoPerformanceGrid,demoCarKind,demoVehicleSetup} from './demo-session';
import {restoreOnlineProgress,onlineEventLabel} from './online-events';
import type {OnlineSelection} from './online-livery';
import {copyOnlineSetup} from './online-setup';
import {frameGarage} from './garage-camera';
import type {LiveryFace} from './livery';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {LOCK,bumperAt,hooks,pullsAway,lockStrain,lockEnd,type LockedBumper,TETHER,tetherLife,tetherAge,jointLive} from './bumper-lock';
import {PILEUP,PileUp} from './pile-up';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { QuarryAO, LocalReflections, createSceneRenderTarget } from './rendering';
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
import {OffroadMarker} from './offroad-marker';
import {drawQuarryMap} from './quarry-minimap';
import { prepareCircuitSurface } from './scenery-circuit-material';
import { Quarry } from './world';
import { Vehicle, WRECK_BURST, type Input } from './vehicle';
import { Effects } from './effects';
import { VehicleFire } from './vehicle-fire';
import {PuddleSplashes} from './puddle-splashes';
import {DERBY_ARENA,type ArenaLayout} from './derby-arena';
import {ARENA_NAMES,resolveArenaId,arenaRecordKey,type ArenaId} from './arena-id';
import {HARROW_ARENA,buildHarrowPhysics,harrowGround} from './harrow-arena';
import {createHarrowWorld} from './harrow-world';
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
import { CHALLENGES, challengeCourse, challengeValue, formatChallengeValue, challengeVenueName, type Challenge, type Discipline } from './challenges';
import { PROFILE_KEY, readProfile, settleRun, type Award } from './progression';
import { showDriverProfile, awardText, MEDALS } from './profile-ui';
import {dailyChallenge,dailyLighting} from './daily-event';
import {EventAwards,awardsHtml,stuntsText} from './event-awards';
import {bankAchievements} from './achievements';
import {attachCarLights,headlightAim,type CarLights} from './car-lights';
import {LAMP_BREAK,RAIN_LIGHTS,RAIN_BEAMS} from './car-lights';
import {createRain} from './rain';
import {applyWetLook} from './wet-look';
import {setWetness} from './driving-surface';
import {ELIMINATION_INTERVAL,eliminationActive,nextElimination} from './elimination-race';
import {TEAMS,teamOf,teamRaceActive,teamScores,teamLine,teamVerdict} from './team-race';
import {BangerAggression,bangerRaceActive} from './banger-race';
import {damageDiagramSvg} from './damage-diagram';
import {wreckReport,mechanicalReport} from './wreck-report';
import {DNF,deadReason,deadTime} from './mechanical-dnf';
import {warningLine,tankWarning,cableWarnings} from './hud-warnings';
import {createArenaProps,ARENA_PROP_SPOTS,arenaPropCount,courseCornerSpots} from './arena-props';
import {isRearEngineKind} from './classic-vehicle-specs';
import {tyreFailure as tyreFailureLevel} from './tyre-condition';
import {dailyKey,dailyStreak,dailyWeek,isDailyChallenge,DAILY_PREFIX} from './daily-record';
import {EVENT_KEY,readEventOptions,circuitRoute,raceGridSlot,derbyGridSlot,checkRoute,lapProgress,CombatScoreboard,eventDerbyOrder,stepScoreRespawns} from './event-rules';
import {showEventSetup} from './event-ui';
import {classTimeTrial,copyTimeTrialConfig,timeTrialSetup,timeTrialBuildLabel,loadTimeTrialRecords,saveTimeTrialRecords,isTimeTrialConfig,timeTrialBest,formatTrialTime,finishTimeTrialRecord,type TimeTrialConfig,type TimeTrialResult} from './time-trial';
import {showTimeTrialSetup,showTimeTrialResult} from './time-trial-ui';
import {CLUB_CUP_KEY,CLUB_ROUNDS,CLUB_SERIES,clubRounds,clubSeries,clubVehicleSetup,createClubCup,readClubCup,beginClubRound,finishClubRound,clubRoundRunId,replayCupAwards,type ClubSeriesId,type ClubCupState,type ClubRowInput} from './club-cup';
import {showClubCup} from './club-cup-ui';
import {CLUB_RECORDS_KEY,readClubRecords,recordClubFinish} from './club-records';
import type {RunStats} from './session-telemetry';
import {ReplayRecorder,readReplayFile,replayCourseId,type ReplayDocument} from './replay-data';
import {ReplayScene,captureReplayFrame} from './replay-scene';
import {ReplayStudio} from './replay-studio';
import {showReplayLibrary} from './replay-library-ui';
import {WaypointRace} from './waypoint-race';
import {WaypointMarkers} from './waypoint-markers';
import {directionForCar,RACE_NAMES} from './event-rules';
import {ControllerRumble} from './controller-rumble';
import {CONTROLS_KEY,readControls,drivingInput,keyLabel,selectedPad} from './driving-controls';
import {ControllerInput} from './controller-input';
import {ControllerNavigation,type NavigationContext} from './controller-navigation';
import {mountDrivingControls} from './driving-controls-ui';
import './style.css';
const ui = document.querySelector<HTMLDivElement>('#ui')!;
const canvas = document.querySelector<HTMLCanvasElement>('#game')!;
const controllerRumble=new ControllerRumble();
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
  quality: graphicsChoice(saved.quality),
  performance: saved.performance === true,
  camera: readCameraSettings(saved.camera),
  standingsKey: standingsKey(saved.standingsKey),
  engine: saved.engine ?? 0.72,
  effects: saved.effects ?? 0.8,
  ambience: saved.ambience ?? 0.45,
  audioOutput: readAudioOutput(saved.audioOutput),
  lighting: readLighting(saved.lighting),
};
const adaptiveGraphics=new AdaptiveGraphics();
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
const combat=new CombatScoreboard(true);
const derbyFeed=new DerbyEventFeed();
const eventFrameTimes:number[]=[];
const customEvent=()=>activeClubRound===null&&!activeChallenge&&!activeTimeTrial&&!online?.active;
const aiDifficulty=()=>activeClubRound!==null?readAIDifficulty(clubCup?.difficulty):sessionAIDifficulty(customEvent()&&mode!=='playground',demo,eventOptions.difficulty,demoOptions.difficulty);
let pursuit:PursuitSession|null=null;
const pursuitSelected=()=>customEvent()&&mode==='race'&&(demo?demoOptions.pursuit:eventOptions.pursuit)===true;
let waypointRace:WaypointRace|null=null,waypointMarkers:WaypointMarkers|undefined;
const onlineRules=()=>online?.active?online.network.snapshot?.event?.rules:undefined;
const raceFormat=()=>pursuitSelected()?'laps':demo?(demoOptions.race??'laps'):onlineRules()?.race??clubRound()?.race??activeChallenge?.race??(customEvent()?eventOptions.race:'laps');
const damageRule=()=>sessionDamageRule(customEvent()&&mode!=='playground',demo,eventOptions.damage,demoOptions.damage);
let nextEliminationAt=0,eliminatedOrder:number[]=[];
let damageDiagramAt=-1,damageDiagramSvgLast='';
let propsVenue:VenueContext|undefined,propsOnline=false;
const bangerRace=()=>!online?.active&&!pursuitSelected()&&activeClubRound===null&&!activeTimeTrial&&(activeChallenge?activeChallenge.banger===true&&mode==='race':bangerRaceActive(mode,customEvent(),demo,raceFormat(),eventOptions,demoOptions));
const bangerAggression=new BangerAggression();
const teamRace=()=>!online?.active&&!pursuitSelected()&&activeClubRound===null&&!activeChallenge&&!activeTimeTrial&&teamRaceActive(mode,customEvent(),demo,raceFormat(),eventOptions,demoOptions);
const eliminationRace=()=>!online?.active&&!pursuitSelected()&&activeClubRound===null&&!activeChallenge&&!activeTimeTrial&&eliminationActive(mode,customEvent(),demo,raceFormat(),eventOptions,demoOptions);
const raceTimeLimit=()=>online?.active?(mode==='race'&&onlineRules()?.race==='laps'?onlineRules()?.raceDuration??0:0):pursuitSelected()?0:timedRaceLimit(mode,customEvent(),demo,raceFormat(),eventOptions,demoOptions);
const sessionDirection=()=>demo?demoRaceDirection(demoOptions):eventOptions.direction;
const raceDirection=(id=0)=>pursuitSelected()?(sessionDirection()==='reverse'?'reverse':'forward'):directionForCar(raceFormat()==='laps'?(onlineRules()?.direction??clubRound()?.direction??activeTimeTrial?.direction??activeChallenge?.direction??(customEvent()?sessionDirection():'forward')):'forward',id);
const raceRoute=(id=0)=>waypointRace?.get(id).nav?.route??courseRoute(activeVenue.course,mode==='playground'?'forward':raceDirection(id));
const derbyFormat=()=>readDerbyFormat(online?.active?onlineRules()?.derby:demo?demoOptions.derby:customEvent()?eventOptions.derby:'survival');
const scoreDerby=()=>mode==='derby'&&DERBY_FORMATS[derbyFormat()].scored;
const respawningDerby=()=>scoreDerby()&&DERBY_FORMATS[derbyFormat()].respawns;
const scoreElimination=()=>mode==='derby'&&derbyFormat()==='score-no-respawn';
const scoreSpectating=()=>!demo&&(onlineSpectatorEligible(!!online?.active,mode,respawningDerby(),cars[0])||scoreElimination()&&cars[0]?.health<=0||!!pursuit&&!pursuit.complete&&(cars[0]?.health<=0||pursuit.result(cars[0].id)?.outcome==='escaped'))&&(state==='playing'||state==='paused');
const derbyRanking=()=>online?.active?online.network.snapshot!.ranking.map(id=>cars.find(c=>c.id===id)!):eventDerbyOrder(cars,scoreDerby(),combat);
const eventDuration=()=>clubRound()?.duration??activeChallenge?.limit??(demo?demoOptions.duration:online?.active?onlineRules()?.duration??300:eventOptions.duration);
function openEventSetup(){eventSetupOpen=true;keys.clear();showEventSetup(ui,eventOptions,()=>{eventSetupOpen=false;menu();},()=>{try{localStorage.setItem(EVENT_KEY,JSON.stringify(eventOptions));return true;}catch{return false;}},kind,garage);}
const initialTimeTrial=loadTimeTrialRecords();
let timeTrialRecords=initialTimeTrial.records,timeTrialWarning=initialTimeTrial.warning;
let activeTimeTrial:Readonly<TimeTrialConfig>|null=null,timeTrialSelection:TimeTrialConfig|undefined;
let timeTrialOpen=false,timeTrialInvalidReason='',timeTrialResult:TimeTrialResult|null=null;
let trialGhostLibrary=loadGhostLibrary(),trialGhostWarning='';
let trialGhostRecorder:TrialGhostRecorder|null=null,trialGhostView:TrialGhostView|null=null,trialGhostTarget:TrialGhost|null=null;
let trialGhostSplit='',trialGhostLabel='PERSONAL BEST';
function beginTrialGhost(){
  trialGhostView?.dispose();trialGhostView=null;trialGhostRecorder=null;trialGhostTarget=null;trialGhostSplit='';
  if(!activeTimeTrial)return;
  trialGhostRecorder=new TrialGhostRecorder(activeTimeTrial);
  trialGhostRecorder.sample(0,cars[0].current,cars[0].currentQ);
  const rival=raceTrialGhost(trialGhostLibrary,activeTimeTrial,timeTrialBest(timeTrialRecords,activeTimeTrial));
  trialGhostTarget=rival?.ghost??null;trialGhostLabel=rival?.label??'PERSONAL BEST';
  if(trialGhostLibrary.enabled&&trialGhostTarget)trialGhostView=createTrialGhostView(scene,cars[0].root,trialGhostTarget);
}
function finishTrialGhost(config:TimeTrialConfig,result:TimeTrialResult){
  const recording=trialGhostRecorder?.finish(cars[0].finishTime,cars[0].current,cars[0].currentQ)??null;
  trialGhostLibrary=settleTrialGhost(trialGhostLibrary,config,result,recording);
  if(result.eligible&&result.newBest){
    const saved=saveGhostLibrary(trialGhostLibrary);
    trialGhostWarning=!saved?'Ghosts are available for this session, but browser storage could not save them.':
      recording?'Personal-best ghost saved. Select My personal best to race it, or export it to share.':'Personal best saved without a ghost. Ghost recording supports laps up to ten minutes.';
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
  let config:TimeTrialConfig={kind,course:timeTrialSelection?.course??resolveCourseId(eventOptions.course),direction:timeTrialSelection?.direction??(eventOptions.direction==='reverse'?'reverse':'forward')};
  if(timeTrialSelection?.performanceClass)config=classTimeTrial(config,garage.cars[kind].setup);
  showTimeTrialSetup(ui,config,timeTrialRecords,{setup:selected=>garage.cars[selected].setup,start:config=>{void startTimeTrial(config);},close:()=>{timeTrialOpen=false;menu();}},[timeTrialWarning,trialGhostWarning].filter(Boolean).join(' '),{
    enabled:trialGhostLibrary.enabled,
    change:enabled=>{trialGhostLibrary={...trialGhostLibrary,enabled};if(!saveGhostLibrary(trialGhostLibrary))trialGhostWarning='Ghost preference could not be saved; it applies for this session.';},
    status:selected=>{const rival=raceTrialGhost(trialGhostLibrary,selected,timeTrialBest(timeTrialRecords,selected));return rival?`${rival.label} · ${formatTrialTime(rival.ghost.time)} · Ghost ready.`:trialGhostLibrary.target==='shared'?'Import a shared lap for this selection, or choose My personal best.':'Set a new personal best to record a ghost for this selection.';},
    exchange:{
      source:()=>trialGhostLibrary.target??'personal',
      choose:source=>{if(source==='shared')trialGhostLibrary={...trialGhostLibrary,target:'shared'};else{trialGhostLibrary={...trialGhostLibrary};delete trialGhostLibrary.target;}if(!saveGhostLibrary(trialGhostLibrary))trialGhostWarning='Ghost preference applies for this session only; browser storage could not save it.';},
      rival:selected=>sharedTrialGhost(trialGhostLibrary,selected),
      available:selected=>!!findTrialGhost(trialGhostLibrary,selected,timeTrialBest(timeTrialRecords,selected)),
      export:async(selected,name)=>{const ghost=findTrialGhost(trialGhostLibrary,selected,timeTrialBest(timeTrialRecords,selected));if(!ghost)throw Error('Set a personal best with a complete ghost before exporting.');return exportTrialGhost(ghost,name);},
      use:rival=>{trialGhostLibrary=addSharedGhost(trialGhostLibrary,rival);const saved=saveGhostLibrary(trialGhostLibrary);return saved?'Shared rival saved. Your personal records are unchanged.':'Shared rival ready for this session only; browser storage could not save it.';},
      remove:selected=>{trialGhostLibrary=removeSharedGhost(trialGhostLibrary,selected);return saveGhostLibrary(trialGhostLibrary)?'Shared rival removed.':'Shared rival removed for this session only; browser storage could not save the change.';},
    },
  });
}
async function startTimeTrial(config:TimeTrialConfig){
  if(preparingEvent||online?.active||!isTimeTrialConfig(config)||!['menu','result'].includes(state))return false;
  bankRun(false);telemetry=null;activeChallenge=undefined;activeClubRound=null;clubOpen=false;timeTrialOpen=false;
  activeTimeTrial=Object.freeze(copyTimeTrialConfig(config));if(activeTimeTrial.setup){Object.freeze(activeTimeTrial.setup.tune);Object.freeze(activeTimeTrial.setup.livery);Object.freeze(activeTimeTrial.setup);}timeTrialSelection=copyTimeTrialConfig(config);kind=config.kind;mode='race';
  return start(false);
}
function finishTimeTrial(){
  const config=activeTimeTrial;if(!config)return;
  const player=cars[0],run=telemetry?.stats??null;
  if(run)Object.assign(run,{completed:true,finished:player.finished&&player.health>0,health:player.health,rank:0,won:false,checkpoints:player.passed});
  const outcome=finishTimeTrialRecord(timeTrialRecords,config,{run,finished:player.finished,health:player.health,passed:player.passed,finishTime:player.finished?player.finishTime:elapsed+player.penalty,demo,online:!!online?.active,synthetic:autopilot||!!testInput||!!timeTrialInvalidReason&&timeTrialInvalidReason!=='RECOVERY USED',setup:player.setup,selectionMatches:cars.length===1&&player.kind===config.kind&&activeVenue.course.id===config.course&&raceDirection()===config.direction,stock:cars.length===1&&player.kind===config.kind&&activeVenue.course.id===config.course&&raceDirection()===config.direction&&JSON.stringify(player.setup)===JSON.stringify(stockSetup(player.kind))});
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
let rain:ReturnType<typeof createRain>|null=null,wetRoot:T.Object3D|undefined,wetOn=false;
const eventAwards=new EventAwards();const propFires=new PropFires();
/** Loose props as fire sources: where they are now and whether they burn. */
const propPoints=(props:readonly {mesh:T.Object3D}[])=>props.map(p=>({x:p.mesh.position.x,y:p.mesh.position.y,z:p.mesh.position.z,kind:propKind((p.mesh as T.Mesh).geometry?.type)}));let slowMoUntil=0,slowMoScale=.3;
/** Brief Burnout-style slow motion when the player wrecks an opponent (local events only). */
const TAKEDOWN_SLOWMO={scale:.3,seconds:.9};const carLights=new Map<Vehicle,CarLights>();let lastBadges:string[]=[];
const badgeLine=()=>lastBadges.length?`<p class="badge-unlock">★ ACHIEVEMENT${lastBadges.length>1?'S':''} UNLOCKED · ${lastBadges.join(' · ')}</p>`:'';
/** Race feedback for the player's own impacts; derbies already have their score feed. */
function callout(kind:'TAKEDOWN'|'BIG HIT',victim:Vehicle){if(mode!=='race'||demo||online?.active||pursuit)return;toast(kind==='TAKEDOWN'?`TAKEDOWN · #${victim.id+1} ${DEFINITIONS[victim.kind].name}`:`BIG HIT · #${victim.id+1} ${DEFINITIONS[victim.kind].name}`,kind==='TAKEDOWN'?2.5:1.2);}
let stuntProgress:StuntChallengeProgress|null=null;
let telemetry:SessionTelemetry|null=null,runId='',runSettled=true,lastAward:Award|null=null;
const raceLaps=()=>clubRound()?.laps??(online?.active?onlineRules()?.laps??3:activeTimeTrial?1:activeChallenge?.laps??(demo?demoOptions.laps:eventOptions.laps));
function bankRun(completed:boolean){
  if(!telemetry||runSettled||demo||online?.active||activeClubRound!==null)return;
  syncClubAwards();
  runSettled=true;
  const run=telemetry.stats;run.completed=completed;
  lastAward=settleRun(profile,runId,run,activeChallenge);
  const fresh=bankAchievements(profile,{run,kind,mode,course:activeVenue.course.id,arena:resolveArenaId(activeVenue.arenaId),takedowns:mode==='race'?eventAwards.takedownsFor(cars[0]?.id??0):0,wrecks:eventAwards.takedownsFor(cars[0]?.id??0),wheels:eventAwards.strippedBy(cars[0]?.id??0).wheels,parts:eventAwards.strippedBy(cars[0]?.id??0).parts,banger:bangerRace(),elimination:eliminationRace(),lighting:eventLighting??undefined,setAlight:eventAwards.firesBy(cars[0]?.id??0).cars,puddlesLit:eventAwards.firesBy(cars[0]?.id??0).puddles},{kinds:CAR_KINDS.length,courses:Object.keys(COURSE_NAMES).length,arenas:Object.keys(ARENA_NAMES).length});
  lastBadges=fresh.map(a=>a.name.toUpperCase());if(fresh.length)toast(`ACHIEVEMENT${fresh.length>1?'S':''} UNLOCKED · ${fresh.map(a=>a.name.toUpperCase()).join(' · ')}`,4);
  try{localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));profileStorageWarning='';}catch{profileStorageWarning='Progress is available for this session, but browser storage could not save it.';}
}
/** Today's event briefing: one fixed car, venue and rule set per local day, with a streak. */
function openDaily(){
  keys.clear();const key=dailyKey(),challenge=dailyChallenge(key),record=profile.daily?.[key],streak=dailyStreak(profile.daily,key);
  const overlay=document.createElement('div');overlay.className='overlay daily-overlay';
  overlay.innerHTML=`<section class="dialog daily-event" role="dialog" aria-modal="true" aria-labelledby="daily-title"><div class="eyebrow">DAILY EVENT · ${key} · ${challengeVenueName(challenge)}</div><h2 id="daily-title">${challenge.title.toUpperCase()}</h2><p><b>${DEFINITIONS[challenge.car].name}</b> · ${challenge.mode==='race'?'Race':'Demolition derby'} · ${LIGHTING_CHOICES[dailyLighting(key)]}</p><p>${challenge.description}</p><div class="medal-targets">${challenge.medals.map((v,i)=>`<span class="medal-${i+1}">${MEDALS[i+1]}<b>${challenge.metric==='time'?'≤ ':''}${formatChallengeValue(challenge,v)}</b></span>`).join('')}</div><p id="daily-record">${record?.medal?`Today: ${MEDALS[record.medal]} · best ${formatChallengeValue(challenge,record.best??0)} · ${record.attempts} ${record.attempts===1?'attempt':'attempts'}`:record?.attempts?`Today: no medal yet · ${record.attempts} ${record.attempts===1?'attempt':'attempts'}`:'Not attempted today.'}</p><div class="daily-week" aria-label="This week's daily medals">${dailyWeek(profile.daily,key).map(d=>`<span class="daily-day medal-${d.medal}${d.today?' daily-today':''}" title="${d.key}"><small>${new Date(d.key+'T12:00:00').toLocaleDateString(undefined,{weekday:'short'}).toUpperCase()}</small><b>${d.medal?'★':'·'}</b></span>`).join('')}<em>${dailyWeek(profile.daily,key).reduce((s,d)=>s+d.medal,0)} / 21 stars this week</em></div><p id="daily-streak">${streak?`Medal streak: ${streak} ${streak===1?'day':'days'}. Medal today to keep it going.`:'Win any medal on consecutive days to build a streak.'}</p><button id="daily-start" class="primary">START TODAY'S EVENT ↗</button><button id="daily-close" class="small-button">BACK</button></section>`;
  ui.append(overlay);
  overlay.querySelector<HTMLButtonElement>('#daily-close')!.onclick=()=>{overlay.remove();};
  overlay.querySelector<HTMLButtonElement>('#daily-start')!.onclick=()=>{overlay.remove();careerRun=false;activeTimeTrial=null;activeChallenge=challenge;mode=challenge.mode;kind=challenge.car;void start(false);};
  overlay.querySelector<HTMLButtonElement>('#daily-start')!.focus();
}
function openProfile(initialDiscipline:Discipline='racing'){
  profileOpen=true;keys.clear();
  showDriverProfile(ui,profile,{close:()=>{profileOpen=false;menu();},start:challenge=>{profileOpen=false;careerRun=false;activeTimeTrial=null;activeChallenge=challenge;mode=challenge.mode;kind=challenge.car;void start(false);}},profileStorageWarning,initialDiscipline);
}
function openCareer(discipline:Discipline='racing',notice=''){
  if(preparingEvent||online?.active||!['menu','result'].includes(state))return;
  if(awardCareerPodiums(profile,clubRecords))try{localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));profileStorageWarning='';}catch{profileStorageWarning='Career rewards are available this session, but could not be saved.';}
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
    championship:series=>{careerOpen=false;openClubCup('',series);},
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
    awardCareerPodiums(profile,clubRecords);
    try{localStorage.setItem(CLUB_RECORDS_KEY,JSON.stringify(clubRecords));}
    catch{clubWarning='This cup is saved, but championship records could not be saved. Keep this completed cup until browser storage is available.';}
  }
  if(fresh.length)lastAward=fresh.at(-1)!;
  try{localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));profileStorageWarning='';}
  catch{profileStorageWarning='Cup results are saved. Driver XP will be recovered when profile saving is available.';}
}
function closeClubCup(){clubOpen=false;createCars(true);menu();}
function openClubCup(notice='',selection?:ClubSeriesId){
  if(selection&&clubCup&&clubCup.phase!=='complete'&&clubSeries(clubCup).id!==selection)notice='Your saved '+clubSeries(clubCup).name+' is in progress. Finish or restart it before choosing another series.';
  keys.clear();clubOpen=true;syncClubAwards();if(notice)clubWarning=[notice,clubWarning].filter(Boolean).join(' ');
  showClubCup(ui,selection&&clubCup?.phase==='complete'?null:clubCup,kind,{
    create:(series,difficulty,lineup,field,classLimit,enginePolicy)=>{clubCup=createClubCup(kind,crypto.randomUUID(),Date.now(),series,difficulty,lineup,field,classLimit,enginePolicy);saveClubCup();openClubCup();},
    start:()=>{void startClubRound();},close:closeClubCup,career:()=>{closeClubCup();openCareer();},
    abandon:()=>{try{localStorage.removeItem(CLUB_CUP_KEY);clubCup=null;clubWarning='';}catch{clubWarning='The saved cup could not be reset. Please try again.';}openClubCup();},
  },[clubWarning,profileStorageWarning].filter(Boolean).join(' '),clubRecords,selection);
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
let replayImpacts:ReplayImpactPlayback|null=null;
let replayBursts:ReplayBurstPlayback|null=null;
let replayPuddles:ReplayPuddles|null=null,replaySlicks:ReplaySlicks|null=null,replayPropMeshes:T.Mesh[]=[];
let replayFire:ReplayFire|null=null;
let studio:ReplayStudio|null=null,studioRestore:(()=>void)|null=null;
function captureReplay(force=false){if(recorder&&!studio&&!online?.active)recorder.capture(elapsed,()=>captureReplayFrame(cars,activeVenue.props,replayEpochs,recorder!.meta.tyreModel,recorder!.meta.engineModel,recorder!.meta.audioModel,id=>sound.contactScraping.level(id),recorder!.meta.thermalModel,vehicleFire?.audio??[]),force);}
function archiveReplay(){
  if(!recorder)return;captureReplay(true);if(recorder.frames.length>1)lastReplay=recorder.document();
  for(const car of cars){car.onVisualEvent=undefined;car.onDrip=undefined;}recorder=null;
}
function beginReplay(){
  lastReplay=null;replayEpochs=cars.map(()=>0);
  recorder=new ReplayRecorder({version:1,tyreModel:1,engineModel:1,audioModel:1,thermalModel:1,...(online?.active?{}:{damageModel:1 as const}),...(activeVenue.arenaId?{arenaId:activeVenue.arenaId}:{}),...(activeVenue.course.id==='quarry-v1'?{}:{courseId:activeVenue.course.id}),mode,...(pursuit?{pursuit:true as const}:{}),...(scoreElimination()?{derbyFormat:'score-no-respawn' as const}:{}),reverse:mode==='race'&&(clubRound()?clubRound()!.direction==='reverse':activeTimeTrial?activeTimeTrial.direction==='reverse':activeChallenge?activeChallenge.direction==='reverse':customEvent()&&eventOptions.direction==='reverse'),cars:cars.map(c=>({id:c.id,kind:c.kind,setup:{...structuredClone(c.setup),paint:c.paintColor.getHex()}})),props:activeVenue.props.length,created:new Date().toISOString()});
  cars.forEach((car,i)=>car.onVisualEvent=e=>{if(e.kind==='jump'||e.kind==='repair')replayEpochs[i]++;recorder?.event(i,elapsed,e);});
  cars.forEach(car=>car.onDrip=(x,y,z,kind,seed)=>recorder?.drip({time:elapsed,position:[x,y,z],kind,seed}));
  cars.forEach(c=>c.render(1));captureReplay(true);
}
function closeStudio(){const restore=studioRestore;studio=null;studioRestore=null;replayImpacts=null;replayBursts=null;restore?.();}
function openStudio(photo=false,document?:ReplayDocument,savedName?:string):boolean{
  if(studio||online?.active||preparingEvent)return false;
  let doc=photo?null:document??recorder?.document()??lastReplay;
  if(!photo&&(!doc||doc.frames.length<2)){if(document)throw Error('This replay needs at least two frames.');return false;}
  // Imported identity and layout must be accepted before recording or scene changes.
  const targetId=doc?replayCourseId(doc.meta):activeVenue.course.id;
  if(doc&&resolveArenaId(doc.meta.arenaId)==='quarry-arena-v1'&&targetId==='quarry-v1')quarryReplayProps(quarry.props,doc.meta.props);
  const targetVenue=doc?ensureVenue(targetId,resolveArenaId(doc.meta.arenaId)):activeVenue;
  // Loose props: replays carry the venue's full set, or none if recorded before the venue had them.
  if(doc&&!(resolveArenaId(doc.meta.arenaId)==='quarry-arena-v1'&&targetId==='quarry-v1')&&doc.meta.props!==0&&doc.meta.props!==targetVenue.props.length)throw Error('This replay uses an unsupported course layout.');
  captureReplay(true);if(!photo&&!document&&recorder)doc=recorder.document();
  const returnState=state,returnMode=mode,returnVenue=activeVenue,oldQuarryMode=quarryMode,oldCars=cars,oldNodes=Array.from(ui.childNodes);
  const savedCamera={p:camera.position.clone(),q:camera.quaternion.clone(),fov:camera.fov,exposure:renderer.toneMappingExposure,target:orbit.target.clone(),enabled:orbit.enabled,pan:orbit.enablePan,max:orbit.maxDistance,min:orbit.minDistance};
  const quarryVisibility:Array<[T.Object3D,boolean]>=[];quarryVenue.root.traverse(o=>quarryVisibility.push([o,o.visible]));
  const quarryEnabled:Array<[R.Collider,boolean]>=[...new Map([...quarry.collisionPhysics.statics.values(),...quarry.arenaPhysics.walls].map(c=>[c.handle,c])).values()].map(c=>[c,c.isEnabled()]);
  const hidden=new Map<T.Object3D,boolean>();let view:ReplayScene|null=null,restored=false;
  const hide=(o:T.Object3D|undefined)=>{if(o&&!hidden.has(o)){hidden.set(o,o.visible);o.visible=false;}};
  const restore=()=>{
    if(restored)return;restored=true;replayThermal=[];replayFire?.dispose();replayFire=null;replayPuddles?.dispose();replayPuddles=null;replaySlicks?.dispose();replaySlicks=null;replayPropMeshes=[];replayAudio.reset();view?.dispose();cars=oldCars;mode=returnMode;
    quarryMode=oldQuarryMode;quarry.setMode(oldQuarryMode,false);quarryEnabled.forEach(([c,enabled])=>c.setEnabled(enabled));
    hidden.forEach((visible,o)=>o.visible=visible);quarryVisibility.forEach(([o,visible])=>o.visible=visible);
    activateVenue(returnVenue);refreshVenueLighting();
    ui.replaceChildren(...oldNodes);if(closeReplayLibrary)ui.querySelector<HTMLInputElement>('#library-search')?.focus();state=returnState;
    camera.position.copy(savedCamera.p);camera.quaternion.copy(savedCamera.q);camera.fov=savedCamera.fov;camera.updateProjectionMatrix();renderer.toneMappingExposure=savedCamera.exposure;
    orbit.target.copy(savedCamera.target);orbit.enabled=savedCamera.enabled;orbit.enablePan=savedCamera.pan;orbit.maxDistance=savedCamera.max;orbit.minDistance=savedCamera.min;
    lastFrame=performance.now();accumulator=0;sound.attach(oldCars);sound.pause(!['playing','countdown','menu'].includes(returnState));
  };
  try{
    if(doc){view=new ReplayScene(doc,scene,targetVenue.physics,quarryReplayProps(targetVenue.props,doc.meta.props),targetVenue.course);replayThermal=view.thermalAudio;replayPuddles=new ReplayPuddles(doc,scene,targetVenue.puddles,view.cars);replaySlicks=doc.drips?.length?new ReplaySlicks(doc.drips,scene):null;replayPropMeshes=view.props;if(replaySlicks)replaySlicks.propKinds=view.props.map(m=>propKind(m.geometry.type));if(doc.meta.thermalModel===1){replayFire=new ReplayFire(doc,scene);replayFire.fire.setQuality(adaptiveGraphics.quality);}}
    keys.clear();replayAudio.reset();if(doc&&!sound.ready)void sound.init().catch(error=>console.warn('Replay audio unavailable',error));state='studio';
    if(doc){
      for(const car of oldCars)hide(car.root);for(const prop of returnVenue.props)hide(prop.mesh);for(const prop of targetVenue.props)hide(prop.mesh);
      for(const o of [fx.points,fx.marks,...fx.debris.map(d=>d.mesh),vehicleFire?.mesh,...(vehicleFire?.lights??[]),puddleSplashes?.spray,puddleSplashes?.rings,fx.evidence.mesh,fx.slicks.mesh])hide(o);
      activateVenue(targetVenue);cars=view!.cars;mode=doc.meta.mode;setQuarryMode();view!.props.forEach(p=>staticShadows?.bindReceivers(p));
    }
    hide(activeVenue.checkpoint);studioRestore=restore;
    replayImpacts=doc?new ReplayImpactPlayback(doc.impacts??[],sound):null;replayBursts=doc?new ReplayBurstPlayback(doc.bursts??[],sound):null;
    studio=new ReplayStudio(ui,cars,doc,time=>view?.seekChunk(time),closeStudio,savedCamera.exposure,savedName,activeVenue.course.height);return true;
  }catch(error){studio=null;studioRestore=null;replayImpacts=null;replayBursts=null;restore();throw error;}
}
/** Results shortcut: open the replay a moment before the biggest hit, slowed down, following the attacker. */
function replayBiggestHit(container:Element|null){
  const hit=eventAwards.biggestHit,frames=recorder?.frames.length??lastReplay?.frames.length??0;
  if(!container||online?.active||!hit||hit.damage<5||frames<2)return;
  const button=document.createElement('button');button.className='small-button studio-link';button.id='replay-biggest-hit';button.textContent='REPLAY BIGGEST HIT ▶';
  button.onclick=()=>{if(!openStudio())return;const index=cars.findIndex(c=>c.id===hit.attacker);
    const pick=(id:string,value:string)=>{const s=ui.querySelector<HTMLSelectElement>('#'+id);if(s&&Array.from(s.options).some(o=>o.value===value)){s.value=value;s.dispatchEvent(new Event('change'));}};
    if(index>=0)pick('studio-car',String(index));pick('studio-camera','chase');pick('studio-speed','0.25');
    studio?.seek(Math.max(0,hit.time-1.5));ui.querySelector<HTMLButtonElement>('#studio-play')?.click();};
  container.append(button);
}
/** WATCH HIGHLIGHTS: the event's best moments back to back, slowed down, following the attacker. */
let highlightTimer=0;
function highlightsButton(container:Element|null){
  const moments=eventAwards.highlights(5),frames=recorder?.frames.length??lastReplay?.frames.length??0;
  if(!container||online?.active||moments.length<2||frames<2)return;
  const button=document.createElement('button');button.className='small-button studio-link';button.id='watch-highlights';button.textContent='WATCH HIGHLIGHTS ▶';
  button.onclick=()=>{if(!openStudio())return;clearTimeout(highlightTimer);
    const pick=(id:string,value:string)=>{const s=ui.querySelector<HTMLSelectElement>('#'+id);if(s&&Array.from(s.options).some(o=>o.value===value)){s.value=value;s.dispatchEvent(new Event('change'));}};
    const label={hit:'BIG HIT',takedown:'TAKEDOWN',wheel:'WHEEL OFF',fire:'SET ALIGHT',failure:'FAILURE'} as const;
    const show=(k:number)=>{if(!studio||k>=moments.length)return;const m=moments[k],index=cars.findIndex(c=>c.id===m.attacker);
      if(index>=0)pick('studio-car',String(index));pick('studio-camera','chase');pick('studio-speed','0.25');
      studio.seek(Math.max(0,m.time-1.2));if(ui.querySelector('#studio-play')?.textContent?.includes('PLAY'))ui.querySelector<HTMLButtonElement>('#studio-play')?.click();
      let caption=ui.querySelector<HTMLElement>('#studio-highlight');if(!caption){caption=document.createElement('div');caption.id='studio-highlight';caption.className='studio-highlight';(ui.querySelector('.studio')??ui).append(caption);}caption.textContent=`HIGHLIGHT ${k+1}/${moments.length} · ${m.label??label[m.kind]}`;highlightTimer=window.setTimeout(()=>{if(k+1<moments.length)show(k+1);else ui.querySelector('#studio-highlight')?.remove();},7000);};
    show(0);};
  container.append(button);
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
let replayThermal:ReplayScene['thermalAudio']=[];
const replayAudio=new ReplayAudioTransport(sound);
let vehicleFire:VehicleFire | undefined;
let puddleSplashes:PuddleSplashes|undefined;
const raceRecovery=new RaceRecovery();
const offroadMarker=new OffroadMarker();
const drivers=new DrivingBrain(DERBY_ARENA),director=new DemoDirector(DERBY_ARENA,(from,to,car)=>cameraObstruction(physics,from,to,car.body,true),(x,z)=>activeVenue.course.height(x,z));
const pursuitDriving=new PursuitDriving(drivers);
let demo=false,demoRestart=0,demoHudHidden=false;
let demoOptions=readDemoOptions();try{demoOptions=readDemoOptions(localStorage.getItem(DEMO_KEY));}catch{}
let preparingOnline=false;
let preparingEvent=false,preparationInterrupted=false;
sound.setOutput(settings.audioOutput);
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
let drivingCamera:DrivingCamera = 'chase',
  traffic = eventOptions.playgroundTraffic??true,
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
const composer = new EffectComposer(renderer, createSceneRenderTarget(innerWidth, innerHeight));
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
type VenueContext={arenaId?:ArenaId;arena?:ArenaLayout;course:RaceCourse;physics:R.World;root:T.Group;checkpoint:T.Group;props:Quarry['props'];puddles:Quarry['puddles'];update?:(time:number)=>void;resetProps?:(enabled?:boolean)=>void;dispose?:()=>void};
let quarryVenue:VenueContext,activeVenue:VenueContext;
const raceVenues:Partial<Record<Exclude<CourseId,'quarry-v1'>,VenueContext>>={};
const arenaVenues:Partial<Record<ArenaId,VenueContext>>={};
let quarryMode:Mode='derby';
const preferredCourse=():CourseId=>activeChallenge?challengeCourse(activeChallenge):mode==='playground'&&customEvent()&&!demo?resolveCourseId(eventOptions.playgroundCourse):clubRound()?.course??(mode==='race'&&!online?.active?resolveCourseId(activeTimeTrial?.course??(demo?demoOptions.course:eventOptions.course)):'quarry-v1');
const raceLabel=(id:CourseId)=>id==='quarry-v1'?'QUARRY CIRCUIT':COURSE_NAMES[id].toUpperCase();
const eventLabel=()=>mode==='playground'&&activeVenue.course.id!=='quarry-v1'?activeVenue.course.name.toUpperCase()+' / FREE DRIVE':mode==='race'?raceLabel(activeVenue.course.id):mode==='derby'&&activeVenue.arenaId?ARENA_NAMES[activeVenue.arenaId].toUpperCase()+' / DERBY':modes[mode].label;
function ensureVenue(id:CourseId,arenaId:ArenaId='quarry-arena-v1'):VenueContext{
  if(arenaId!=='quarry-arena-v1'){
    if(arenaVenues[arenaId])return arenaVenues[arenaId]!;
    const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;
    let artwork:{root:T.Group;update?:(time:number)=>void;dispose():void}|undefined;
    try{
      const bowl=arenaId==='moorfield-speedbowl-v1',yard=arenaId==='gullhaven-yard-v1',ring=arenaId==='kestrel-ring-v1',mud=arenaId==='wrenford-pit-v1',briarhill=arenaId==='briarhill-bowl-v1',foundry=arenaId==='foundry-yard-v1';
      (bowl?buildMoorfieldPhysics:yard?buildGullhavenPhysics:ring?buildKestrelRingPhysics:mud?buildWrenfordPitPhysics:foundry?buildFoundryPhysics:briarhill?buildBriarhillPhysics:buildHarrowPhysics)(R,world);artwork=bowl?createMoorfieldWorld():yard?createGullhavenWorld():ring?createKestrelRingWorld():mud?createWrenfordPitWorld():foundry?createFoundryWorld():briarhill?createBriarhillWorld():createHarrowWorld();
      const course:RaceCourse={...getRaceCourse(),...(bowl?moorfieldGround:yard?gullhavenGround:ring?kestrelRingGround:mud?wrenfordPitGround:foundry?foundryGround:briarhill?briarhillGround:harrowGround),name:ARENA_NAMES[arenaId]};
      const checkpoint=new T.Group();checkpoint.visible=false;artwork.root.add(checkpoint);artwork.root.visible=false;scene.add(artwork.root);
      const spots=ARENA_PROP_SPOTS[arenaId],loose=spots?createArenaProps(R,world,artwork.root,spots):undefined,art=artwork;
      const venue:VenueContext={arenaId,arena:bowl?MOORFIELD_ARENA:yard?GULLHAVEN_ARENA:ring?KESTREL_RING_ARENA:mud?WRENFORD_PIT_ARENA:foundry?FOUNDRY_ARENA:briarhill?BRIARHILL_ARENA:HARROW_ARENA,course,physics:world,root:artwork.root,checkpoint,props:loose?.props??[],puddles:[],update:loose?time=>{art.update?.(time);loose.update();}:artwork.update,resetProps:loose?.reset,dispose:()=>{loose?.dispose();artwork!.dispose();world.free();}};
      arenaVenues[arenaId]=venue;return venue;
    }catch(error){artwork?.dispose();world.free();throw error;}
  }
  if(id==='quarry-v1')return quarryVenue;
  const cached=raceVenues[id];if(cached)return cached;
  const world=new R.World({x:0,y:-9.81,z:0});world.timestep=1/60;
  let artwork:{root:T.Group;update?:(time:number)=>void;dispose():void}|undefined;
  try{
    const course=getRaceCourse(id);course.buildPhysics!(R,world);artwork=id==='millbrook-canal-v1'||id==='granite-pass-v1'?createCanalPassWorld(id):id==='kingswell-park-v1'||id==='copperfield-dunes-v1'?createParkDunesWorld(id):id==='holloway-stadium-v1'||id==='bramblebrook-reservoir-v1'?createStadiumReservoirWorld(id):id==='saltmarsh-port-v1'||id==='dunmere-farm-v1'?createPortFarmWorld(id):id==='seabrook-coast-v1'||id==='hazelwood-forest-v1'?createCoastForestWorld(id):id==='ravensmoor-rally-v1'?createRavensmoorWorld():id==='thornby-hill-v1'?createThornbyWorld():id==='ashcombe-lanes-v1'?createAshcombeWorld():id==='westmere-club-v1'||id==='harrowstone-ridge-v1'?createRidgeClubWorld(id):id==='willowbank-heath-v1'?createWillowbankWorld():id==='sable-canyon-v1'?createSableWorld(()=>{if(activeVenue.course.id==='sable-canyon-v1')refreshVenueLighting();}):id==='elmsworth-speedway-v1'?createElmsworthWorld():id==='rookvale-yard-v1'?createRookvaleWorld():id==='fenwick-oval-v1'||id==='fenwick-eight-v1'?createFenwickWorld(id):id==='alderwick-stunt-v1'?createStuntWorld():id==='millhaven-rally-v1'?createMillhavenWorld():id==='merefield-airfield-v1'?createMerefieldWorld():id==='dockside-loop-v1'||id==='fairground-scramble-v1'||id==='alderwick-cross-v1'||id==='wrenford-mud-v1'?createCountyWorld(id):id==='pinecrest-ridge-v1'?createPinecrestWorld():id==='ashford-autodrome-v1'?createAshfordWorld():id==='redbank-jump-v1'?createRedbankWorld():id==='bracken-rallycross-v1'?createBrackenWorld():id==='cinderbank-oval-v1'?createCinderbankWorld():createIronfieldWorld();
    const checkpoint=quarry.checkpoint.clone(true);checkpoint.name=id+'_checkpoint';checkpoint.visible=false;artwork.root.add(checkpoint);artwork.root.visible=false;scene.add(artwork.root);
    const corners=courseCornerSpots(R,world,course),loose=corners.length?createArenaProps(R,world,artwork.root,corners,(x,z)=>course.height(x,z)):undefined,art=artwork;
    const venue:VenueContext={course,physics:world,root:artwork.root,checkpoint,props:loose?.props??[],puddles:[],update:loose?time=>{art.update?.(time);loose.update();}:artwork.update,resetProps:loose?.reset,dispose:()=>{loose?.dispose();checkpoint.removeFromParent();artwork!.dispose();world.free();}};
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
  activeVenue=venue;physics=venue.physics;drivers.arena=venue.arena??DERBY_ARENA;director.arena=venue.arena??DERBY_ARENA;venue.root.visible=true;refreshVenueLighting();
}
let staticShadows: StaticQuarryShadows | undefined;
/** Chosen per event; 'random' never repeats the previous mood. */
let eventLighting: LightingMood | null = null;
/** The event's breeze (offline): its base and, gusting, now. */
const breezeBase={x:0,z:0},breeze={x:0,z:0};let windy=false;
let clearSky: T.Texture | null = null, overcastSky: T.Texture | null = null;
function applyEventLighting(fresh: boolean, choice = settings.lighting) {
  if (fresh || !eventLighting) eventLighting = resolveLighting(choice, eventLighting);
  if (!clearSky && scene.background instanceof T.Texture) clearSky = scene.background;
  overcastSky ??= createOvercastSky();
  const preset = applyLighting({ sun: quarry.sun, hemisphere: scene.children.find((o): o is T.HemisphereLight => o instanceof T.HemisphereLight), scene, renderer, skies: { clear: clearSky, overcast: overcastSky } }, eventLighting);
  if (staticShadows) staticShadows.intensity = preset.shadow;
  const raining=eventLighting==='rain';rain??=createRain(scene);rain.setActive(raining);setWetness(raining&&!online?.active?1:0);fx.slicks.wet=raining&&!online?.active;sound.rain(raining&&state!=='menu');
}
let environmentTarget: T.WebGLRenderTarget | undefined;
let online:OnlineView, onlineUI:OnlineUI, onlinePhase='';
const isPlayer=(c:Vehicle)=>c===cars[0];
const displayedDriver=(c:Vehicle)=>driverLabel(c,online?.active?online.network.snapshot?.members:undefined);
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
    ...designGarageCallbacks(ui,kind),
    preview:(setup:Setup)=>{if(cars[0]?.setup.armor!==setup.armor)createCars(true,setup);cars[0]?.setPaint(setup.paint,setup.trim);cars[0]?.livery.set(setup.livery);},
    view:face=>{garageFace=face;},badges:profile.badges??[],
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
  ui.innerHTML = `<div class="menu"><div class="topbar"><div class="brand"><i></i> BLACKRIDGE MOTOR CLUB</div><div class="location">WOODLAND COUNTY &nbsp; / &nbsp; <b>17:42</b> &nbsp; / &nbsp; DRY TRACK</div></div><div class="intro"><div class="eyebrow">FULL CONTACT / NO APOLOGIES</div><h1>QUARRY<br><span>IMPACT</span></h1><p>Precision machines. Unforgiving ground.<br>Take the long way home — if it still runs.</p><div class="car-picker">${(Object.keys(DEFINITIONS) as CarKind[]).map((k) => `<button data-car="${k}" class="${k === kind ? 'active' : ''}">${DEFINITIONS[k].name}</button>`).join('')}</div><div class="spec">${DEFINITIONS[kind].subtitle.toUpperCase()}</div></div><div class="menu-bottom">${(Object.keys(modes) as Mode[]).map((m, i) => `<button class="mode-card ${m === mode ? 'active' : ''}" data-mode="${m}"><span class="number">0${i + 1} / ${m === 'derby' ? 'SURVIVAL' : m === 'race' ? 'COMPETITION' : 'EXPLORATION'}</span><strong>${m==='race'?raceLabel(resolveCourseId(eventOptions.course)):modes[m].label}</strong><small>${m==='race'?`${eventOptions.pursuit?(eventOptions.pursuitRole==='chaser'?'CHASE · Stop the runners':'CHASE · Escape the field'):eventOptions.race==='laps'&&eventOptions.raceDuration?'Timed circuit · '+formatTime(eventOptions.raceDuration)+' · '+eventOptions.direction:RACE_NAMES[eventOptions.race]} · ${eventOptions.race==='laps'&&eventOptions.raceDuration?'finish current lap':eventOptions.laps} ${eventOptions.race==='laps'&&eventOptions.raceDuration?'':eventOptions.race==='laps'?(eventOptions.laps===1?'lap':'laps')+' · '+eventOptions.direction:eventOptions.laps===1?'round':'rounds'} · ${eventOptions.field} cars`:m==='derby'?`${ARENA_NAMES[resolveArenaId(eventOptions.arena)]} · ${DERBY_FORMATS[eventOptions.derby].label} · ${eventOptions.field} cars`:`${COURSE_NAMES[resolveCourseId(eventOptions.playgroundCourse)]} · ${traffic?'4 traffic cars':'Drive alone'} · No time limit`}</small></button>`).join('')}<button class="primary" id="start">${modes[mode].button}<span>↗</span></button></div><div class="footer"><span>${CAR_KINDS.length} MACHINES &nbsp; · &nbsp; ${Object.keys(COURSE_NAMES).length} CIRCUITS &nbsp; · &nbsp; ${Object.keys(ARENA_NAMES).length} ARENAS &nbsp; · &nbsp; NO PRISTINE FINISHES</span><div><a href="./licenses/CREDITS.md" target="_blank" rel="noopener">CREDITS</a><button id="settings">SETTINGS</button><button id="fullscreen">FULLSCREEN ↗</button></div></div></div>`;
  globalScoresButton(ui.querySelector('.footer > div'));
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
  const dailyButton=document.createElement('button');dailyButton.id='daily-event';dailyButton.className='small-button';{const streak=dailyStreak(profile.daily);dailyButton.textContent=`TODAY'S EVENT${streak?` · ${streak}-DAY STREAK`:''}`;}dailyButton.onclick=()=>openDaily();ui.querySelector('.intro')!.append(dailyButton);
  const trialButton=document.createElement('button');trialButton.id='time-trial';trialButton.className='small-button';trialButton.textContent='TIME TRIAL · PERSONAL BESTS';trialButton.onclick=()=>openTimeTrialSetup();ui.querySelector('.intro')!.append(trialButton);
  const cupButton=document.createElement('button');cupButton.id='club-cup';cupButton.className='small-button';cupButton.textContent=clubCup?.phase==='complete'?'CHAMPIONSHIPS · FINAL STANDINGS':clubCup?'CONTINUE '+clubSeries(clubCup).name.toUpperCase():`CHAMPIONSHIPS · ${CLUB_SERIES.length} SERIES`;cupButton.onclick=()=>openClubCup();ui.querySelector('.intro')!.append(cupButton);
  if(lastAward?.qualified){const note=document.createElement('p');note.className='last-award';note.textContent=awardText(lastAward);ui.querySelector('.intro')!.append(note);}
  const venueButton=document.createElement('button');venueButton.id='course-browser';venueButton.className='small-button';venueButton.textContent=`CHOOSE COURSE · ${Object.keys(COURSE_NAMES).length} CIRCUITS / ${Object.keys(ARENA_NAMES).length} ARENAS`;venueButton.onclick=()=>{eventSetupOpen=true;keys.clear();showVenueBrowser(ui,mode,eventOptions,(selectedMode,id,watch)=>{if(watch){if(!selectDemoVenue(demoOptions,selectedMode,id))return;let saved=true;try{localStorage.setItem(DEMO_KEY,JSON.stringify(demoOptions));}catch{saved=false;}mode=selectedMode;eventSetupOpen=false;void start(true).then(()=>{if(!saved)toast('Demo venue applies this session; browser storage could not save it.',8);});return;}if(!selectVenue(eventOptions,selectedMode,id))return;mode=selectedMode;let saved=true;try{localStorage.setItem(EVENT_KEY,JSON.stringify(eventOptions));}catch{saved=false;}eventSetupOpen=false;menu();if(!saved){const note=document.createElement('p');note.setAttribute('role','status');note.textContent='Venue selected for this session; browser storage could not save it.';ui.querySelector('.intro')!.append(note);}ui.querySelector<HTMLButtonElement>('#start')?.focus();},()=>{eventSetupOpen=false;menu();ui.querySelector<HTMLButtonElement>('#course-browser')?.focus();},demoOptions);};ui.querySelector('.spec')!.insertAdjacentElement('afterend',venueButton);
  const eventButton=document.createElement('button');eventButton.id='event-setup';eventButton.className='small-button';eventButton.textContent=`EVENT RULES · ${eventOptions.field} CARS · ${GRID_LINEUPS[eventOptions.lineup??'mixed'].toUpperCase()} · ${AI_DIFFICULTIES[readAIDifficulty(eventOptions.difficulty)].label.toUpperCase()}`;eventButton.onclick=openEventSetup;ui.querySelector('.intro')!.append(eventButton);
  const classInfo=document.createElement('p');classInfo.id='entry-class';classInfo.className='garage-help';const entry=eventPerformanceGrid(kind,eventOptions,garage);classInfo.textContent=mode==='playground'?performanceLabel(kind,garage.cars[kind].setup):entry.label+' / '+classLimitLabel(eventOptions.classLimit)+(entry.error?' / BUILD NOT ELIGIBLE':'');ui.querySelector('.intro')!.append(classInfo);
  if(mode==='playground'){const practice=document.createElement('button');practice.id='free-drive-setup';practice.className='small-button';practice.textContent='FREE DRIVE OPTIONS';practice.onclick=()=>{eventSetupOpen=true;keys.clear();showFreeDriveSetup(ui,eventOptions,()=>{traffic=eventOptions.playgroundTraffic??true;try{localStorage.setItem(EVENT_KEY,JSON.stringify(eventOptions));return true;}catch{return false;}},()=>{eventSetupOpen=false;menu();});};ui.querySelector('.intro')!.append(practice);}
  const watch=document.createElement('button');watch.id='watch-demo';watch.className='small-button';watch.textContent='WATCH DEMO ▷';
  watch.onclick=()=>{if(mode==='playground')mode='derby';void start(true);};
  ui.querySelector('.intro')!.append(watch);
  const careerButton=document.createElement('button');careerButton.id='career-open';careerButton.className='small-button';careerButton.textContent='CAREER · CHOOSE YOUR PATH';careerButton.onclick=()=>openCareer();ui.querySelector('.intro')!.append(careerButton);
  const demoSetup=document.createElement('button');demoSetup.className='small-button';demoSetup.id='demo-options';demoSetup.textContent='DEMO OPTIONS';demoSetup.onclick=()=>{eventSetupOpen=true;showDemoSetup(ui,demoOptions,kind,value=>{try{localStorage.setItem(DEMO_KEY,JSON.stringify(value));return true;}catch{return false;}},()=>{eventSetupOpen=false;},demoMode=>{mode=demoMode;void start(true);},garage);};ui.querySelector('.intro')!.append(demoSetup);
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
  pursuit=null;demo=false;director.reset();derbyFeed.reset();
  if(activeVenue!==quarryVenue)createCars(true);
  await sound.init();online.reset();online.active=true;onlinePhase='';
  try {online.network.connect({endpoint,room,name,kind:loadout?.kind??kind,setup:loadout?.setup??copyOnlineSetup(garage.cars[kind].setup),livery:loadout?.livery??garage.cars[loadout?.kind??kind].setup.livery});}catch(error){online.active=false;throw error;}
}
function receiveOnline() {
  const s=online.network.snapshot;if(!online.active||!s||preparingOnline)return;
  const venue=ensureVenue(s.mode==='race'?s.event?.rules.course??'quarry-v1':'quarry-v1',s.mode==='derby'?s.event?.rules.arena??'quarry-arena-v1':'quarry-arena-v1');
  if(activeVenue!==venue){activateVenue(venue);fx.world=physics;fx.groundHeight=activeVenue.course.height;events.clear();vehicleFire?.reset();puddleSplashes?.reset();}
  online.setWorld(physics,activeVenue.course,activeVenue.puddles);online.receive(s);elapsed=s.elapsed;countdown=s.countdown;mode=s.mode;
  sound.contactScraping.receive(s.phase==='playing'?s.cars:[]);
  waypointRace=s.event?.waypoints?new WaypointRace(s.event.rules.race as 'ordered'|'free'|'random',s.event.rules.laps,s.event.seed,activeVenue.course.checkpoints,activeVenue.course.waypointStations):null;
  pursuit=s.event?.chase?PursuitSession.restore(s.event.chase):null;
  if(s.event)restoreOnlineProgress(s.event,waypointRace,combat);else combat.reset();
  const changed=onlinePhase!==s.phase;onlinePhase=s.phase;
  if(changed&&s.phase==='lobby')derbyFeed.reset();
  if(s.phase==='lobby') {
    state='lobby';orbit.enabled=false;onlineUI.lobby(s,changed);return;
  }
  kind=cars[0].kind;setQuarryMode();
  if(online.network.needsStartPreparation){
    preparingOnline=true;state='loading';keys.clear();online.network.idleInput();sound.pause(true);
    loading('PREPARING ONLINE EVENT');
    const socket=online.network.socket;
    void online.network.prepareStart(async()=>{
      for(const car of cars)staticShadows?.bindReceivers(car.root);
      await warmPrograms();
    }).catch(error=>{
      console.error('Online event preparation failed',error);
      if(online.active&&online.network.socket===socket){leaveOnline();toast('Could not prepare online event — please rejoin',8);}
    }).finally(()=>{preparingOnline=false;if(online.active){onlinePhase='';receiveOnline();}});
    return;
  }
  if(changed) {
    if(s.phase==='countdown')director.reset();
    if(s.phase==='result') {
      finish(pursuit?pursuitTeamTitle(pursuit,online.network.id):s.ranking[0]===online.network.id?'EVENT WINNER':mode==='race'?'RACE COMPLETE':'DERBY COMPLETE');
    }else if(state==='paused') resumeState=s.phase;
    else {state=s.phase;orbit.enabled=false;hud();sound.pause(false);}
  }
  if(s.phase==='result') {
    onlineUI.results(s);
  }
}
function createCars(attract = false, previewSetup?:Setup) {
  offroadMarker.reset();
  const targetVenue=ensureVenue(attract?'quarry-v1':preferredCourse(),!attract&&mode==='derby'?resolveArenaId((activeChallenge?.mode==='derby'?activeChallenge.arena:undefined)??clubRound()?.arena??(customEvent()?(demo?demoOptions.arena:eventOptions.arena):undefined)):'quarry-arena-v1');
  archiveReplay();bankRun(false);
  drivers.difficulty=attract?'amateur':aiDifficulty();pursuit=null;pursuitDriving.reset();combat.reset(true);derbyFeed.reset();waypointRace=!attract&&mode==='race'&&raceFormat()!=='laps'?new WaypointRace(raceFormat() as 'ordered'|'free'|'random',raceLaps(),clubRound()?.seed??activeChallenge?.seed??Math.floor(Math.random()*0xffffffff),targetVenue.course.checkpoints,targetVenue.course.waypointStations):null;
  sound.clearCars();
  vehicleFire?.reset();propFires.reset();
  puddleSplashes?.reset();
  for (const c of cars){carLights.get(c)?.dispose();carLights.delete(c);c.dispose();}
  for(const f of bailed)disposeDriver(f);bailed.length=0;
  cars = [];
  fx.reset();
  activateVenue(targetVenue);fx.world=physics;fx.groundHeight=activeVenue.course.height;events.clear();setQuarryMode();
  if(activeVenue===quarryVenue)quarry.resetProps();else activeVenue.resetProps?.(!online?.active);
  impactAdjudicator.clear();collisionScars.clear();
  collisions = 0;
  const count = attract ? 1 : activeTimeTrial ? 1 : activeClubRound!==null ? clubCup!.roster.length : mode === 'playground' ? ((activeChallenge?activeChallenge.traffic:traffic) ? 5 : 1) : activeChallenge?8:demo?demoOptions.field:eventOptions.field;
  if(!attract&&pursuitSelected())pursuit=new PursuitSession(teamPursuitRules(Array.from({length:count},(_,i)=>i),0,demo?'runner':eventOptions.pursuitRole??'runner',demo?1:eventOptions.pursuitRunners??1,Math.max(60,demo?demoOptions.duration:eventOptions.duration)));
  const pursuitGrid=pursuit?pursuitGridOrder(pursuit.snapshot().rules):null;
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
  const ratedGrid=!attract&&activeClubRound===null&&!activeTimeTrial&&(demo?demoOptions.classLimit:customEvent()&&mode!=='playground'&&eventOptions.classLimit)?(demo?demoPerformanceGrid(kind,demoOptions,garage):eventPerformanceGrid(kind,eventOptions,garage)):null;
  for (let i = 0; i < count; i++) {
    const type =
      ratedGrid?ratedGrid.at(i):!attract&&activeClubRound!==null?clubCup!.roster[i].kind:demo&&!attract?demoCarKind(i,kind,demoOptions.lineup):i === 0 ? kind : activeChallenge?(['coupe','sedan','hatch']as CarKind[])[i%3]:!attract&&customEvent()&&mode!=='playground'?gridCarKind(i,kind,eventOptions.lineup):CAR_KINDS[i%CAR_KINDS.length];
    const setup=!attract&&activeTimeTrial?timeTrialSetup(activeTimeTrial):!attract&&activeClubRound!==null?clubVehicleSetup(clubCup!,type):demo&&!attract?demoVehicleSetup(type,demoOptions,garage,kind):!attract&&customEvent()&&mode!=='playground'?eventGridSetup(type,kind,garage,eventOptions.performance,i===0,colors[i%colors.length],eventOptions.classLimit):i===0 && (attract || !demo) && !activeChallenge ? previewSetup??garage.cars[type].setup : undefined;
    const team=!attract&&teamRace()?TEAMS[teamOf(i)]:null,teamSetup=team&&setup?{...setup,paint:team.color,trim:team.trim}:setup;
    const car = new Vehicle(i, type, team?.color ?? setup?.paint ?? colors[i%colors.length], scene, physics, fx, teamSetup,activeVenue.course,online?.active?'legacy':'angular-v1');
    // A driver in the seat of every car, placed from the model's own box (cosmetic).
    {car.root.updateMatrixWorld(true);const box=new T.Box3().setFromObject(car.model),min=car.root.worldToLocal(box.min.clone()),max=car.root.worldToLocal(box.max.clone());
      const figure=driverFigure([0xd23a2a,0xf1bd42,0x2f6fd8,0xe8e8e8,0x2fa35a][i%5]);figure.position.set(Math.min(min.x,max.x)*DRIVER.side*2,Math.max(min.y,max.y)-DRIVER.headroom-DRIVER.head,(min.z+max.z)/2-Math.abs(max.z-min.z)*DRIVER.back);car.root.add(figure);
      // Derby cars carry a net over the driver's window (offline events).
      if(!attract&&!online?.active&&mode==='derby'){const net=windowNet();net.position.set(Math.min(min.x,max.x)*WINDOW_NET.inset,figure.position.y+.02,figure.position.z);car.root.add(net);}
      // and a roll cage: a hoop behind the seat and X bars in the doors, seen through the glass and wherever a door has gone.
      if(!attract&&!online?.active&&mode==='derby')car.root.add(rollCage(figure.position,Math.abs(Math.min(min.x,max.x))));}
    // Derby rivals carry their car number on the doors and roof, unless their livery already has one (offline).
    if(!attract&&!online?.active&&i>0&&mode==='derby'){const numbered=withRaceNumbers(car.setup.livery,i+1);if(numbered)car.livery.set(numbered);
      // and a slogan sprayed across the bonnet.
      {const sloganed=withSlogan(numbered??car.setup.livery,i+1,car.paintColor.getHex());if(sloganed)car.livery.set(sloganed);}
     
      // and a number board standing on the roof, read from any side.
      car.root.updateMatrixWorld(true);const box=new T.Box3().setFromObject(car.model),top=car.root.worldToLocal(new T.Vector3((box.min.x+box.max.x)/2,box.max.y,(box.min.z+box.max.z)/2));
      const sign=roofSign(i+1);sign.position.set(0,top.y-.02,top.z*.5);car.root.add(sign);}
    // and a derby flag on a whip off the back of the roof, on the far side from the driver, its base set on the roof skin.
    {const sign=car.root.getObjectByName('roof_sign'),driver=car.root.getObjectByName('driver');if(sign&&driver){car.root.updateMatrixWorld(true);
      const from=car.root.localToWorld(new T.Vector3(-driver.position.x*.6,sign.position.y+.6,sign.position.z-.45)),down=new T.Vector3(0,-1,0).transformDirection(car.root.matrixWorld);
      const hit=new T.Raycaster(from,down,0,1.6).intersectObjects([...car.panels,...car.glass],false)[0];
      if(hit){const flag=derbyFlag(FLAG_COLOURS[i%FLAG_COLOURS.length]);flag.position.copy(car.root.worldToLocal(hit.point.clone()));car.root.add(flag);}}}
    carLights.set(car,attachCarLights(car.root,DEFINITIONS[type].halfLength));
    car.extendedDamage=!attract&&!online?.active;{const derbyPace=car.extendedDamage&&mode==='derby';car.powerScale=derbyPace?DERBY_PACE.power:undefined;car.tractionScale=derbyPace?DERBY_PACE.traction:undefined;car.charge=derbyPace;}if(car.extendedDamage){car.onBackfire=p=>sound.backfire(p);car.onBlowout=p=>sound.blowout(p);car.onSetAlight=by=>{eventAwards.setAlight(by,car.id,elapsed);if(by>=0&&by!==car.id)alightBy.set(car.id,by);};car.onGlassBreak=p=>sound.shot('glass',p,.55);car.onMountClunk=()=>{if(i===0)recordRumbleImpact(.3);sound.shot('impact-light',car.current,.4,{rate:.8,delay:0,duration:.3,lowpass:1400});};car.onBumpStart=()=>{bumpStarts++;sound.clip('bump-start',car.current,.7,1.8);const by=bumpStartedBy(lastHitBy.get(car.id),car.id,elapsed);if(demo)return;if(car.id===0)toast(by>=0?`BUMP STARTED BY #${by+1}`:'BUMP STARTED · ENGINE CAUGHT',2,1);else if(by===0)toast(`YOU BUMP STARTED #${car.id+1}`,1.6,1);};car.onGearClunk=out=>{if(i===0)recordRumbleImpact(out?.25:.35);sound.shot(out?'impact-light':'suspension',car.current,out?.45:.35,{rate:out?1.3:1.6,delay:0,duration:.25});};car.onBreak=(what,w)=>{if(i===0)recordRumbleImpact(what==='spring'?.4:.55);{const f=FAILURE_MOMENTS[what];eventAwards.failure(car.id,f.label,elapsed,f.score);}if(f2crowd(what))sound.crowd(i===0?.7:.45);const corner=['FRONT LEFT','FRONT RIGHT','REAR LEFT','REAR RIGHT'][w];sound.breakage(what,car.current);if(car.id===0&&!demo)toast(what==='spring'?`SPRING BROKEN · ${corner}`:what==='diff'?`DIFF BROKEN · ${w<2?'FRONT':'REAR'} AXLE`:what==='tierod'?`TIE ROD SNAPPED · ${corner}`:what==='exhaust'?'EXHAUST TORN OFF':what==='brakefire'?`BRAKE FIRE · ${corner}`:what==='radiator'?'RADIATOR BURST':what==='propshaft'?'PROPSHAFT SNAPPED':what==='bearing'?`WHEEL BEARING SEIZED · ${corner}`:what==='belt'?'FAN BELT SNAPPED':what==='cable'?'THROTTLE CABLE SNAPPED · LIMPING':what==='handbrake'?'HANDBRAKE CABLE SNAPPED':what==='battery'?'BATTERY THROWN OUT · NO STARTER':what==='rod'?'ROD THROUGH THE BLOCK':what==='rubfire'?`TYRE ON FIRE · ${corner}`:what==='tyrefire'?`FIRE SPREADING · ${corner} TYRE ALIGHT`:what==='exhaustcrush'?'EXHAUST CRUSHED · LOSING POWER':what==='gasket'?'HEAD GASKET BLOWN · WHITE SMOKE':what==='tank'?'FUEL TANK DOWN':what==='tankoff'?'FUEL TANK GONE · ON FUMES':what==='enginefire'?'ENGINE FIRE · OVERHEATED':what==='smashfire'?'ENGINE BAY ALIGHT':what==='rollbar'?`ANTI-ROLL BAR SNAPPED · ${w<2?'FRONT':'REAR'}`:`DRIVESHAFT SNAPPED · ${corner}`,3,what==='smashfire'?3:what==='battery'||what==='rod'||what==='exhaustcrush'?1:0);};car.onSeize=p=>{eventAwards.failure(car.id,'ENGINE SEIZED',elapsed,32);sound.crowd(i===0?.7:.45);fx.emit(p,10,2,.9);if(!sound.clip('engine-seize',p,.8,1.6))sound.shot('impact-heavy',p,.5,{rate:.6,delay:0,duration:.6,lowpass:900});if(car.id===0&&!demo)toast('ENGINE SEIZED');};car.onDoused=()=>{const p=car.current.clone();p.y+=.4;fx.emit(p,14,5,1.4);if(car.id===0&&!demo)toast('FIRE OUT');};}
    if(car.extendedDamage)car.onTether=(_part,debris,anchor)=>tetherBumper(car,debris,anchor);
    // Broken glass and smashed lamps leave their pieces on the floor (offline).
    if(car.extendedDamage){const glassSound=car.onGlassBreak,lights=carLights.get(car);let n=0;car.onGlassBreak=p=>{glassSound?.(p);fx.scatterLitter(p,'glass',car.id*131+(++n),car.current);};if(lights)lights.onSmash=(p,kind)=>fx.scatterLitter(p,kind,car.id*137+(++n),car.current);}
    // A big hit knocks flakes of the car's paint off, a blowout leaves lumps of tyre (offline).
    if(car.extendedDamage){const burst=car.onBlowout;let n=0;car.onPaintChips=(p,damage)=>{if(damage>=LITTER.paint.min)fx.scatterLitter(p,'paint',car.id*139+(++n),car.current,car.paintColor.getHex(),Math.min(LITTER.paint.most,damage*.8));};car.onBlowout=p=>{burst?.(p);fx.scatterLitter(p,'rubber',car.id*149+(++n),car.current);};}
    if(car.extendedDamage)car.onWheelLost=w=>{sound.crowd(i===0?.8:.55);if(i===0&&!demo)toast(`WHEEL GONE · ${['FRONT LEFT','FRONT RIGHT','REAR LEFT','REAR RIGHT'][w]}`,1.6);};
    car.waters=activeVenue.puddles;
    if(mode==='derby'&&!online?.active&&activeVenue===quarryVenue)car.arenaSurface=DERBY_ARENA;
    cars.push(car);
    if (attract) car.place(0, -13, 0.65);
    else if (mode === 'derby') {
      const spawn=derbyGridSlot(i,count,activeVenue.arena??DERBY_ARENA);
      car.place(spawn.x,spawn.z,spawn.yaw);
    } else if (mode === 'race') {
      const spawn=courseGridSlot(activeVenue.course,pursuitGrid?pursuitGrid.indexOf(i):i,pursuitSelected()?raceDirection(i):waypointRace?.startDirection()??clubRound()?.direction??activeTimeTrial?.direction??activeChallenge?.direction??(customEvent()&&raceFormat()==='laps'?sessionDirection():'forward'));
      car.place(spawn.x,spawn.z,spawn.yaw);
      car.nextCheckpoint=spawn.next;car.passed=waypointRace?0:spawn.passed;
    } else if(activeVenue!==quarryVenue){const spawn=(i===0?stuntChallengeSpawn(activeChallenge?.stunt):undefined)??freeDriveSpawn(activeVenue.course,i);car.place(spawn.x,spawn.z,spawn.yaw);car.nextCheckpoint=spawn.next;}
    else car.place(i === 0 ? 0 : 65 + i * 6, -20 + i * 6, 0);
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
  if(!attract&&!online?.active&&mode==='derby')combat.enableRivals(cars.length);
  sound.attach(cars);
}
async function start(watch=demo) {
  if(preparingEvent)return false;
  if(!online?.active&&(watch||customEvent()&&mode!=='playground')){const entry=watch?demoPerformanceGrid(kind,demoOptions,garage):eventPerformanceGrid(kind,eventOptions,garage);if(entry.error){menu();const note=document.createElement('p');note.id='class-entry-error';note.setAttribute('role','alert');note.textContent=entry.error;ui.querySelector('.intro')?.append(note);return false;}}
  bankRun(false);telemetry=null;
  if(watch){activeChallenge=undefined;activeTimeTrial=null;}
  timeTrialOpen=false;timeTrialInvalidReason='';timeTrialResult=null;
  applyEventLighting(true, watch ? demoOptions.lighting ?? settings.lighting : isDailyChallenge(activeChallenge) ? dailyLighting(activeChallenge!.id.slice(DAILY_PREFIX.length)) : settings.lighting);
  // Each offline event gets its own breeze (stronger in the rain).
  windy=!online?.active;Object.assign(breezeBase,windy?eventWind(Math.random,eventLighting==='rain'):{x:0,z:0});
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
    eventAwards.reset();playerTopSpeed=0;derbyAliveBefore=0;revengeSettled.clear();takedownCombo=0;playerStripped=0;strippedNoted.clear();pinNoted.clear();pinFed.clear();pinCounted.clear();pinScoring.clear();pinEscapes=0;sandwiches=0;wallSlams=0;finalStuntsCalled=false;mirrorsClipped=0;bumpStarts=0;aiBurn.clear();aiFireOuts=0;rideAt.clear();rideUps=0;onTop.clear();mounts=0;shrapnelAt.clear();shrapnelHits=0;blowUps=0;blowUpHold=-1;chainIgnitions=0;tipAt.clear();tipOvers=0;dominoes=0;knockedBy.clear();tankBy.clear();targetToastAt=-Infinity;clearLocks();pileUp.reset();pileUps=biggestPileUp=0;wreckCauses.clear();lastHitBy.clear();rollArmed.clear();wreckedBy.clear();alightBy.clear();lastTakedownAt=-1e9;bangerAggression.reset();lastBadges=[];slowMoUntil=0;nextEliminationAt=ELIMINATION_INTERVAL;eliminatedOrder=[];telemetry=watch?null:new SessionTelemetry();stuntProgress=activeChallenge?.stunt?new StuntChallengeProgress(activeChallenge.stunt):null;runId=crypto.randomUUID();runSettled=false;lastAward=null;
    beginReplay();
    if(preparationInterrupted||document.hidden)pause();
    return true;
  } catch (error) {
    console.error('Event preparation failed',error);
    // A half-built event must never archive over the last usable recording.
    for(const car of cars){car.onVisualEvent=undefined;car.onDrip=undefined;}
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
let standingsExpanded=false,standingsUpdated=-Infinity;
function currentStandings():StandingRow[]{
 const rows=baseStandings();if(!teamRace())return rows;return rows.map(r=>{const slot=cars.findIndex(c=>c.id===r.id);return slot<0?r:{...r,detail:TEAMS[teamOf(slot)].name+' · '+r.detail};});
}
function baseStandings():StandingRow[]{
 const ranking=online?.active?online.network.snapshot?.ranking.map(id=>cars.find(c=>c.id===id)).filter((c):c is Vehicle=>!!c)??cars:mode==='derby'?derbyRanking():rankRace();
 return ranking.map(c=>({id:c.id,name:displayedDriver(c),health:c.health,player:!demo&&isPlayer(c),followed:demo&&c.id===director.followed,detail:pursuit?(pursuit.role(c.id)==='runner'?'RUNNER':'CHASER'):mode==='derby'?(scoreDerby()?combat.points(c.id)+' PTS':c.health>0?'RUNNING':wreckCauses.get(c.id)??'OUT'):raceTimeLimit()?(c.finished?Math.floor(c.passed/24)+' LAPS · '+formatTime(c.finishTime):c.health<=0?'RETIRED':'LAP '+c.lap):c.finished?formatTime(c.finishTime):eliminationRace()&&eliminatedOrder.includes(c.id)?'OUT '+(eliminatedOrder.indexOf(c.id)+1)+(eliminatedOrder.indexOf(c.id)===0?'ST':eliminatedOrder.indexOf(c.id)===1?'ND':eliminatedOrder.indexOf(c.id)===2?'RD':'TH'):c.health<=0?'RETIRED':eliminationRace()&&state==='result'?'SURVIVOR':state==='result'?'DNF':waypointRace?'GATES '+c.passed:'LAP '+Math.min(raceLaps(),c.lap)}));
}
function refreshStandings(force=false){
 const panel=document.getElementById('live-standings');if(!panel||!force&&clock-standingsUpdated<.25)return;standingsUpdated=clock;
 panel.classList.toggle('expanded',standingsExpanded);
 const button=panel.querySelector<HTMLButtonElement>('button')!;button.textContent=(standingsExpanded?'COLLAPSE':'STANDINGS')+' · '+STANDINGS_KEYS[settings.standingsKey];button.setAttribute('aria-expanded',String(standingsExpanded));
 const body=panel.querySelector('.standings-body')!,html=standingsTable(currentStandings(),standingsExpanded);if(body.innerHTML!==html)body.innerHTML=html;
}
function toggleStandings(){standingsExpanded=!standingsExpanded;refreshStandings(true);}
function hud() {
  damageDiagramSvgLast='';damageDiagramAt=-1;
  ui.innerHTML = `<div class="hud"><div class="hud-top"><div><div class="eyebrow">BLACKRIDGE / ${mode === 'race'||mode==='playground'&&activeVenue!==quarryVenue ? activeVenue.course.id==='quarry-v1'?'CIRCUIT 01':activeVenue.course.name.toUpperCase() : activeVenue.arenaId?ARENA_NAMES[activeVenue.arenaId].toUpperCase():'QUARRY FLOOR'}</div><div class="hud-title">${eventLabel()}</div></div><div class="event-stats"><div><span id="event-label">${mode === 'derby' ? 'REMAINING' : mode === 'race' ? 'POSITION' : 'FREE DRIVE'}</span><strong id="event-value">${cars.length} / ${cars.length}</strong></div><div><span>${mode === 'race' ? 'LAP / TIME' : mode === 'derby' ? 'TIME LEFT' : 'SESSION'}</span><strong id="time-value">05:00</strong></div><button class="small-button" id="pause">Ⅱ</button></div></div><canvas class="minimap" id="map" width="400" height="400"></canvas><div class="status"><div class="status-row"><span>${DEFINITIONS[kind].name}</span><b id="health">100%</b></div><div class="condition"><b id="health-bar" style="width:100%"></b></div><div class="subsystems"><span id="engine-status">ENGINE OK</span><span id="steer-status">STEERING OK</span><span id="surface">GRAVEL</span></div><div class="tyre-status" id="tyre-status"></div><div class="tyre-status" id="fluid-status"></div><div class="tyre-status" id="gearbox-status"></div><div class="tyre-status" id="engine-restart"></div><div class="tyre-status" id="armor-status"></div></div><div class="damage-diagram" id="damage-diagram"></div><div class="speed"><strong id="speed">0</strong> <span>KM/H</span><small id="gear">GEAR 1 &nbsp; / &nbsp; 850 RPM</small><div class="rpm"><b id="rpm-bar"></b></div></div><div class="controls"><kbd>${['throttle','reverse','left','right'].map(a=>keyLabel(drivingControls.keys[a as 'throttle'][0])).join(' ')}</kbd> DRIVE <kbd>${keyLabel(drivingControls.keys.handbrake[0])}</kbd> HANDBRAKE <kbd>C</kbd> CAMERA ${pursuit?'NO RECOVERIES':'<kbd>R</kbd> RECOVER'} ${!online?.active&&!demo?'<kbd>G</kbd> EXTINGUISHER ':''}${drivingControls.transmission!=='automatic'&&(!online?.active||online.network.snapshot?.transmissionSupport)?`<kbd>${keyLabel(drivingControls.keys.shiftDown[0])} / ${keyLabel(drivingControls.keys.shiftUp[0])}</kbd> SHIFT${drivingControls.transmission==='clutch'?` <kbd>${keyLabel(drivingControls.keys.clutch[0])}</kbd> CLUTCH`:''}`:''} ${mode === 'playground' && !online?.active ? '<kbd>I</kbd> INSPECT <kbd>T</kbd> TRAFFIC' : ''}</div><div class="center-message" id="countdown"></div><div id="toast"></div></div>`;
  document.querySelector<HTMLButtonElement>('#pause')!.onclick = () => pause();
  if(mode!=='playground'&&!activeTimeTrial){ui.querySelector('.hud')!.insertAdjacentHTML('beforeend','<section id="live-standings" class="live-standings" aria-label="Live standings"><button type="button" aria-expanded="false" aria-controls="standings-body"></button><div id="standings-body" class="standings-body"></div></section>');ui.querySelector<HTMLButtonElement>('#live-standings button')!.onclick=toggleStandings;refreshStandings(true);}
  const instruments=document.createElement('canvas');instruments.id='instruments';instruments.width=400;instruments.height=450;instruments.className='instruments';ui.querySelector('.hud')!.append(instruments);
  if(scoreDerby())ui.querySelector('.hud-title')!.textContent=scoreElimination()?'SCORE DERBY · NO RESPAWNS':'SCORE DERBY';
  if(mode==='race'&&customEvent())ui.querySelector('.hud-title')!.textContent=waypointRace?`${eventLabel()} · ${RACE_NAMES[raceFormat()].toUpperCase()}`:`${eventLabel()} · ${eventOptions.direction.toUpperCase()}`;
  if(pursuit)ui.querySelector('.hud-title')!.textContent=(pursuit.role(cars[0].id)==='chaser'?'CHASE · STOP THE RUNNERS':'CHASE · FINISH ALIVE')+' · NO RECOVERIES';
  if(onlineRules())ui.querySelector('.hud-title')!.textContent=onlineEventLabel(mode,onlineRules()!).toUpperCase();
  if(mode==='race'&&!demo&&!online?.active&&!pursuit)ui.querySelector('.hud')!.insertAdjacentHTML('beforeend','<div class="waypoint-status" id="rival-status"></div>');
  if(teamRace())ui.querySelector('.hud')!.insertAdjacentHTML('beforeend','<div class="waypoint-status" id="team-status"></div>');
  if(mode==='derby'){ui.querySelector('.hud')!.insertAdjacentHTML('beforeend','<div class="waypoint-status" id="rival-status"></div><ol id="derby-event-feed" aria-label="Recent derby events"></ol>');derbyFeed.observe(cars.map(c=>({id:c.id,name:displayedDriver(c),record:combat.get(c.id)})),elapsed);}
  if(pursuit)ui.querySelector('.hud')!.insertAdjacentHTML('beforeend','<div class="waypoint-status" id="pursuit-status"></div>');
  if(waypointRace)ui.querySelector('.hud')!.insertAdjacentHTML('beforeend','<div class="waypoint-status" id="waypoint-status"></div>');
  if(settings.performance)ui.querySelector('.hud')!.insertAdjacentHTML('beforeend','<div class="performance-readout" id="performance-readout"></div>');
  if(activeChallenge){ui.querySelector('.hud-title')!.textContent=activeChallenge.title.toUpperCase();ui.querySelector('.hud')!.insertAdjacentHTML('beforeend','<div class="challenge-live"><strong id="challenge-score"></strong><span id="challenge-target"></span></div>');}
  if(activeTimeTrial){ui.querySelector('.hud-title')!.textContent=`TIME TRIAL · ${activeTimeTrial.direction.toUpperCase()}`;text('event-label','PERSONAL BEST');ui.querySelector('.event-stats > div:nth-child(2) > span')!.textContent='LAP TIME';text('event-value',formatTrialTime(timeTrialBest(timeTrialRecords,activeTimeTrial)));ui.querySelector('.hud')!.insertAdjacentHTML('beforeend','<div class="challenge-live" role="status"><strong id="time-trial-progress">0 / 24 GATES</strong><span id="time-trial-validity">'+timeTrialBuildLabel(activeTimeTrial).toUpperCase()+' · ONE LAP · NO RECOVERY</span><span id="time-trial-ghost">PERSONAL-BEST GHOST</span></div>');}
  if(customEvent()&&mode!=='playground')ui.querySelector('.hud-title')!.textContent+=' · '+AI_DIFFICULTIES[drivers.difficulty].label.toUpperCase()+' AI · '+DAMAGE_RULES[damageRule()].label.toUpperCase();
  if(demo)demoHud();
  if(customEvent()&&mode!=='playground'&&!demo&&eventOptions.classLimit)ui.querySelector('.hud-title')!.textContent+=' · '+classLimitLabel(eventOptions.classLimit).toUpperCase();
  if(!demo&&customEvent()&&mode!=='playground'&&eventOptions.performance==='class')ui.querySelector('.hud-title')!.textContent+=' / '+classEngineLabel(cars[0].setup)+' / '+performanceLabel(cars[0].kind,cars[0].setup);
  if(activeClubRound!==null){ui.querySelector('.hud-title')!.textContent=`${clubSeries(clubCup).name.toUpperCase()} · ROUND ${activeClubRound+1} / ${clubRounds(clubCup).length} · ${eventLabel()}`;ui.querySelector('.hud')!.insertAdjacentHTML('beforeend',`<div class="club-live" id="club-live" role="status">${clubEngineLabel(clubCup?.enginePolicy,cars[0].kind,cars[0].setup)} · ${GRID_LINEUPS[clubCup?.lineup??'mixed']} · ${classLimitLabel(clubCup?.classLimit)} · Championship points</div>`);}
  if(online?.active)ui.querySelector('.hud')!.insertAdjacentHTML('beforeend','<div class="network-status" id="network-status"></div>');
  ui.querySelector('.hud')!.insertAdjacentHTML('beforeend','<div class="demo-toolbar" id="spectator-controls" hidden><span id="spectator-name" role="status"></span><button class="small-button" id="spectator-prev">PREVIOUS CAR · [</button><button class="small-button" id="spectator-next">NEXT CAR · ]</button></div>');
  document.getElementById('spectator-prev')!.onclick=()=>cycleSpectator(-1);
  document.getElementById('spectator-next')!.onclick=()=>cycleSpectator(1);
  updateHud();
}
function demoHud(){
  ui.querySelector('.hud-title')!.textContent='LIVE DEMO / '+(pursuit?'CHASE · ':'')+eventLabel()+(waypointRace?' / '+RACE_NAMES[raceFormat()].toUpperCase():mode==='race'?' / '+demoRaceDirection(demoOptions).toUpperCase():'')+' · '+AI_DIFFICULTIES[drivers.difficulty].label.toUpperCase()+' AI · '+DAMAGE_RULES[damageRule()].label.toUpperCase()+(demoOptions.classLimit?' · '+classLimitLabel(demoOptions.classLimit).toUpperCase():'');
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
/** Camera flashes across the stands of the active venue (after a smash or a player takedown). */
const SMASH_FLASHES=26,TAKEDOWN_FLASHES=18;
function crowdFlashes(count:number){activeVenue.root.traverse(o=>{const flash=o.userData.crowdFlash;if(typeof flash==='function')flash(count);});}
/** The player's top speed this event (m/s), shown in the derby results. */
let playerTopSpeed=0;
/** Cars alive at the last HUD update (for the final-two moment). */
let derbyAliveBefore=0;
/** Rival id -> the damage they had dealt the player when revenge was last taken on them. */
const revengeSettled=new Map<number,number>();
/** The player's takedown chain (offline): takedowns within COMBO.window seconds chain into DOUBLE, TRIPLE … */
let takedownCombo=0,lastTakedownAt=-1e9;
/** In a score derby, the points a destruction callout earned (" +40"); nothing otherwise. */
/** Seconds left in a timed event (Infinity when untimed). */
const eventRemaining=()=>{const d=eventDuration();return Number.isFinite(d)&&d>0?d-elapsed:Infinity;};
/** A stunt's points now: doubled in a scored derby's final seconds (FINAL_STUNTS). */
const stuntPoints=(points:number)=>scoreDerby()?stuntValue(points,eventRemaining()):points;
/** Credit stunt points in a scored derby. */
const scoreStunt=(id:number,points:number)=>combat.destruction(id,stuntPoints(points));
const pointsTag=(points:number)=>scoreDerby()?` +${stuntPoints(points)}`:'';
/** Major parts the player's car has shed (for the STRIPPED callouts). */
let playerStripped=0;
/** Cars the derby feed has already called STRIPPED. */
const strippedNoted=new Set<number>();
/** How each finished car went out (offline), fixed at the moment it was wrecked. */
const wreckCauses=new Map<number,string>();
/** Who last damaged each car and when, and which cars can count as rolled again (back on their wheels since). */
const lastHitBy=new Map<number,{by:number;at:number}>(),rollArmed=new Set<number>();
/** Who finished each wrecked car (offline), for the results. */
const wreckedBy=new Map<number,number>();
/** Who set each car alight (offline), to credit a burn-out. */
const alightBy=new Map<number,number>();
/** Cars hooked together by a hanging bumper (offline): the hooker (whose bumper it is), the car it caught, the rope between
 * the two hook points (body-local), and the lock's age and strain. */
type BumperLock={hooker:Vehicle;caught:Vehicle;bumper:LockedBumper;joint:R.ImpulseJoint;hookerAnchor:T.Vector3;caughtAnchor:T.Vector3;length:number;age:number;strain:number};
let bumperLocks:BumperLock[]=[],lockRolls=0,locksMade=0,locksTorn=0;
const bodyQuaternion=(c:Vehicle)=>{const q=c.body.rotation();return new T.Quaternion(q.x,q.y,q.z,q.w);};
const toBody=(c:Vehicle,p:T.Vector3)=>{const t=c.body.translation();return p.clone().sub(new T.Vector3(t.x,t.y,t.z)).applyQuaternion(bodyQuaternion(c).invert());};
const fromBody=(c:Vehicle,l:T.Vector3)=>{const t=c.body.translation();return l.clone().applyQuaternion(bodyQuaternion(c)).add(new T.Vector3(t.x,t.y,t.z));};
function releaseLock(lock:BumperLock){if(jointLive(physics,lock.joint))physics.removeImpulseJoint(lock.joint,true);}
/** Torn-off bumpers dragged behind their cars on a wire (offline). */
/** anchor: body-local on the car; hang: body-local on the bumper piece, its point nearest the car when it tore off. */
type Tether={car:Vehicle;debris:R.RigidBody;joint:R.ImpulseJoint;anchor:T.Vector3;hang:T.Vector3;wire:T.Line;length:number;age:number;life:number;spark:number};
const wireMaterial=new T.LineBasicMaterial({color:0x1c1a18});
let bumperTethers:Tether[]=[],tethersMade=0;
const releaseJoint=(joint:R.ImpulseJoint)=>{if(jointLive(physics,joint))physics.removeImpulseJoint(joint,true);};
const dropWire=(t:Tether)=>{t.wire.removeFromParent();t.wire.geometry.dispose();};
function clearLocks(){for(const lock of bumperLocks)releaseLock(lock);for(const t of bumperTethers){releaseJoint(t.joint);dropWire(t);}bumperLocks=[];bumperTethers=[];lockRolls=locksMade=locksTorn=tethersMade=0;}
/** Tie a torn-off bumper to its car on a wire (offline). */
function tetherBumper(car:Vehicle,debris:R.RigidBody,anchor:{x:number;y:number;z:number}){
  const piece=fx.debris.find(d=>d.body===debris);if(!(piece?.mesh instanceof T.Mesh))return;
  const from=fromBody(car,new T.Vector3(anchor.x,anchor.y,anchor.z)),q=debris.rotation(),turn=new T.Quaternion(q.x,q.y,q.z,q.w),p=debris.translation(),centre=new T.Vector3(p.x,p.y,p.z);
  // Hang the wire from the piece's own metal nearest the car: a wrap-round bumper's centre is empty air between its ends.
  const local=turn.clone().invert(),near=from.clone().sub(centre).applyQuaternion(local),position=piece.mesh.geometry.attributes.position as T.BufferAttribute,hang=new T.Vector3(),v=new T.Vector3();let best=Infinity;
  for(let i=0;i<position.count;i++){v.fromBufferAttribute(position,i).multiply(piece.mesh.scale);const d=v.distanceToSquared(near);if(d<best){best=d;hang.copy(v);}}
  const end=hang.clone().applyQuaternion(turn).add(centre),length=Math.max(TETHER.length,from.distanceTo(end)+.1);
  const wire=new T.Line(new T.BufferGeometry().setFromPoints([from,end]),wireMaterial);wire.frustumCulled=false;scene.add(wire);
  bumperTethers.push({car,debris,joint:physics.createImpulseJoint(R.JointData.rope(length,anchor,hang),car.body,debris,true),anchor:new T.Vector3(anchor.x,anchor.y,anchor.z),hang,wire,length,age:0,life:tetherLife(car.id*7+tethersMade),spark:0});tethersMade++;
}
/** Joints must never yank: a car recovered, respawned or teleported far from what it is tied to lets go before the next solver
 * step, which would otherwise drag the other end across the arena in one step (offline). Read from the bodies, which are already
 * where the teleport put them (Vehicle.current only catches up in postStep). */
function guardJoints(){
  bumperLocks=bumperLocks.filter(lock=>{
    if(!jointLive(physics,lock.joint))return false;
    const gap=fromBody(lock.hooker,lock.hookerAnchor).distanceTo(fromBody(lock.caught,lock.caughtAnchor));
    if(Number.isFinite(gap)&&gap<=lock.length+LOCK.snap)return true;releaseLock(lock);return false;
  });
  bumperTethers=bumperTethers.filter(t=>{
    if(!jointLive(physics,t.joint)){dropWire(t);return false;}
    const p=t.debris.translation(),gap=fromBody(t.car,t.anchor).distanceTo(new T.Vector3(p.x,p.y,p.z));
    if(Number.isFinite(gap)&&gap<=t.length+TETHER.snap)return true;releaseJoint(t.joint);dropWire(t);return false;
  });
}
/** Draw each wire from where the car is shown to where its bumper is shown (debris meshes follow their bodies each frame). */
function drawTetherWires(){
  for(const t of bumperTethers){const piece=fx.debris.find(d=>d.body===t.debris);if(!piece)continue;
    const from=t.anchor.clone().applyQuaternion(t.car.root.quaternion).add(t.car.root.position),position=t.wire.geometry.attributes.position as T.BufferAttribute;
    const end=t.hang.clone().applyQuaternion(piece.mesh.quaternion).add(piece.mesh.position);position.setXYZ(0,from.x,from.y,from.z);position.setXYZ(1,end.x,end.y,end.z);position.needsUpdate=true;}
}
/** Dragged bumpers spark where they scrape the ground; the wire snaps in time, sooner at speed (offline). */
function stepTethers(dt:number){
  bumperTethers=bumperTethers.filter(t=>{
    if(!jointLive(physics,t.joint)){dropWire(t);return false;}
    const p=t.debris.translation(),at=new T.Vector3(p.x,p.y,p.z);t.age=tetherAge(t.age,t.car.speed,dt);
    if(t.age>=t.life||at.distanceTo(t.car.current)>t.length+TETHER.snap){releaseJoint(t.joint);dropWire(t);fx.emit(at,4,1,.9);sound.shot('impact-light',at,.35,{rate:1.9,delay:0,duration:.2});return false;}
    {const q=t.debris.rotation(),end=t.hang.clone().applyQuaternion(new T.Quaternion(q.x,q.y,q.z,q.w)).add(at),from=fromBody(t.car,t.anchor),position=t.wire.geometry.attributes.position as T.BufferAttribute;
      position.setXYZ(0,from.x,from.y,from.z);position.setXYZ(1,end.x,end.y,end.z);position.needsUpdate=true;}
    const v=t.debris.linvel(),speed=Math.hypot(v.x,v.z),ground=t.car.groundAt(p.x,p.z);t.spark+=dt;
    if(speed>=TETHER.spark&&p.y-ground<TETHER.low&&t.spark>=TETHER.gap){t.spark=0;at.y=ground+.04;fx.emit(at,2,1,.8);fx.slicks.igniteAt(at.x,at.z,.25,true,t.car.id);fx.evidence?.add(at,Math.atan2(v.x,v.z),speed*.06,.5,2);t.car.scraping=Math.max(t.car.scraping,Math.min(1,speed/14)*.5);}
    return true;
  });
}
const lockedTo=(id:number)=>{const lock=bumperLocks.find(l=>l.hooker.id===id||l.caught.id===id);return !lock?-1:lock.hooker.id===id?lock.caught.id:lock.hooker.id;};
/** A hit with a car's hanging bumper may hook the two cars together (offline); a running car can hook a wreck and tow it off. */
function tryLock(a:Vehicle,b:Vehicle,point1:T.Vector3,point2:T.Vector3,closing:number){
  if(lockedTo(a.id)>=0||lockedTo(b.id)>=0)return;
  for(const [hooker,caught,at,other] of [[a,b,point1,point2],[b,a,point2,point1]] as const){
    if(hooker.health<=0)continue;
    const local=toBody(hooker,at),bumper=bumperAt(local.z,DEFINITIONS[hooker.kind].halfLength),part=bumper&&hooker.wreckParts.assemblies.find(x=>x.name===bumper);
    if(!bumper||!part||!part.members.some(m=>m.mesh.visible)||part.loose<LOCK.loose)continue;
    if(!hooks(part.loose,closing,hooker.id*13+caught.id*7+lockRolls++))return;
    const caughtLocal=toBody(caught,other),length=Math.max(.3,at.distanceTo(other)+LOCK.slack);
    const joint=physics.createImpulseJoint(R.JointData.rope(length,local,caughtLocal),hooker.body,caught.body,true);
    bumperLocks.push({hooker,caught,bumper,joint,hookerAnchor:local,caughtAnchor:caughtLocal,length,age:0,strain:0});locksMade++;
    // A clunk as the bumper snags, felt by the player in it.
    sound.shot('impact-heavy',at,.5,{rate:.8,delay:0,duration:.5});if(!demo&&(hooker.id===0||caught.id===0))recordRumbleImpact(.3);
    if(!demo&&(hooker.id===0||caught.id===0)){const rival=hooker.id===0?caught:hooker;toast(`${caught.health<=0?'HOOKED THE WRECK':'LOCKED TOGETHER'} · #${rival.id+1} ${DEFINITIONS[rival.kind].name}`,2,2);sound.crowd(.6);}
    return;
  }
}
/** Hooked cars drag each other about; pulling apart on a taut rope tears the hooked bumper off (offline). */
function stepLocks(dt:number){
  const away=(from:Vehicle,to:Vehicle)=>({x:from.current.x-to.current.x,z:from.current.z-to.current.z});
  bumperLocks=bumperLocks.filter(lock=>{
    const {hooker,caught}=lock,part=hooker.wreckParts.assemblies.find(x=>x.name===lock.bumper);
    if(!jointLive(physics,lock.joint)||!part||!part.members.some(m=>m.mesh.visible)){releaseLock(lock);return false;}
    const at=fromBody(hooker,lock.hookerAnchor),gap=at.distanceTo(fromBody(caught,lock.caughtAnchor));
    const hookerPulls=pullsAway(hooker.forward,away(hooker,caught),hooker.input.throttle),caughtPulls=pullsAway(caught.forward,away(caught,hooker),caught.input.throttle),pulling=(hookerPulls?1:0)+(caughtPulls?1:0);
    lock.age+=dt;lock.strain=lockStrain(lock.strain,gap>=lock.length-.03,pulling,dt);
    const end=lockEnd(lock.strain,lock.age,gap,lock.length);if(!end)return true;
    releaseLock(lock);
    if(end==='torn'){hooker.ripAssembly(lock.bumper);locksTorn++;fx.emit(at,8,1,1);
      // Torn off by the caught car driving away: that driver ripped it, and is credited like a door catch.
      if(caughtPulls&&!hookerPulls&&caught.health>0){eventAwards.stripped(caught.id,hooker.id,0,1,elapsed);if(mode==='derby'){derbyFeed.note(caught.id,displayedDriver(caught),'ripped',elapsed);if(scoreDerby())scoreStunt(caught.id,DESTRUCTION_POINTS.ripped);}
        if(!demo&&caught.id===0)toast(`BUMPER RIPPED · #${hooker.id+1} ${DEFINITIONS[hooker.kind].name}`+pointsTag(DESTRUCTION_POINTS.ripped),2,2);}
      // The bumper tearing away: a sharp crack over a metal groan.
      sound.shot('impact-light',at,.7,{rate:1.35,delay:0,duration:.4});sound.shot('suspension',at,.5,{rate:1.6,delay:.05,duration:.3});if(!demo&&(hooker.id===0||caught.id===0))recordRumbleImpact(.35);
      if(!demo&&(hooker.id===0||caught.id===0)){toast(hooker.id===0?'BUMPER TORN OFF':`BUMPER TORN OFF · #${hooker.id+1} ${DEFINITIONS[hooker.kind].name}`,2,2);sound.crowd(.8);}}
    return false;
  });
}
/** Pile-ups (offline): impacts linked through shared cars; pileUps counts the calls this event (QA). */
const pileUp=new PileUp();let pileUps=0,biggestPileUp=0;
/** When the player was last told they lead a scored derby and everyone is after them, and how often at most (seconds). */
let targetToastAt=-Infinity;const HUNT_TOAST=15;
/** Who dropped each car's fuel tank (offline): a car that then runs dry was finished by them. */
const tankBy=new Map<number,number>();
/** Wing mirrors clipped off by passing cars this event (offline QA counter). */
let mirrorsClipped=0;
let bumpStarts=0;
const shrapnelAt=new Map<number,number>();let shrapnelHits=0;let blowUps=0,blowUpHold=-1,chainIgnitions=0;
const tipAt=new Map<number,number>();let tipOvers=0;
const rideAt=new Map<number,number>();let rideUps=0;const onTop=new Map<number,{t:number;dent:number;credited:boolean}>();let mounts=0;
const aiBurn=new Map<number,number>();let aiFireOuts=0;
/** DOMINOs credited this event (offline QA counter), and who last knocked each car with a real hit, and when. */
let dominoes=0;const knockedBy=new Map<number,{by:number;at:number}>();
/** Whether this event's final-stunts call has been made. */
let finalStuntsCalled=false;
/** WALL SLAMs credited this event (offline QA counter). */
let wallSlams=0;
/** How a pin feels (offline): crunch pitch, rumble when pinned and when pinning, the escape hint shown while the player is pinned,
 * and the throttle a sandwich's far car needs to share the credit. */
const PIN_FEEL={rate:.55,pinned:.4,pinning:.22,hint:'PINNED · ROCK IT · REVERSE / FORWARD',partner:.3} as const;
/** Cars already counted as pinned, and already called PINNED in the derby feed, this time they were held (cleared once free). */
const pinNoted=new Set<number>(),pinFed=new Set<number>();
/** When each car last counted as pinned, and the cars whose present pin counts (offline). */
const pinCounted=new Map<number,number>(),pinScoring=new Set<number>();
/** Pins a car came out of still running, and pins between two cars (offline QA counters). */
let pinEscapes=0,sandwiches=0;
/** Pinned (offline): a car shoved hard against a wall or a second car crushes in at both contacts while it is held there,
 * credited to the car doing the shoving. */
function pinCars(contacts:readonly {a?:Vehicle;b?:Vehicle;point1:T.Vector3;point2:T.Vector3;normal:T.Vector3;impulse:number}[],dt:number){
  const scale=collisionDamageMultiplier(mode==='race'&&!bangerRace(),damageRule());
  for(const c of cars){
    if(c.health<=0||!c.extendedDamage){c.pinTime=c.pinTick=0;pinNoted.delete(c.id);pinFed.delete(c.id);pinScoring.delete(c.id);continue;}
    const pushes:PinPush[]=[],points:T.Vector3[]=[];
    for(const k of contacts){const mine=k.a===c?k.point1:k.b===c?k.point2:null;if(!mine||Math.abs(k.normal.y)>.6)continue;
      const other=k.a===c?k.b:k.a;pushes.push({x:mine.x,z:mine.z,force:k.impulse/dt,by:other?other.id:-1});points.push(mine);}
    let pin=pinnedBy(c.current.x,c.current.z,pushes);
    // Between two cars, the one driving into it is the pinner (the reaction from a parked car can read the stronger push).
    if(pin&&pushes[pin.against].by>=0){const strong=cars.find(v=>v.id===pushes[pin!.push].by),far=cars.find(v=>v.id===pushes[pin!.against].by);if(strong&&far&&Math.abs(far.input.throttle)>Math.abs(strong.input.throttle))pin={push:pin.against,against:pin.push};}
    c.pinTime=pinClock(c.pinTime,!!pin,dt);
    if(c.pinTime===0){if(pinScoring.has(c.id)){pinEscapes++;if(c.id===0&&!demo){toast('BROKE FREE',1.4,2);sound.crowd(.6);}}c.pinTick=0;pinNoted.delete(c.id);pinFed.delete(c.id);pinScoring.delete(c.id);}
    const by=pin&&c.pinTime>=PIN.hold?cars.find(v=>v.id===pushes[pin.push].by):undefined;if(!pin||!by)continue;
    by.strainClutch(dt);
    if(mode==='derby'&&c.pinTime>=PIN.feed&&pinScoring.has(c.id)&&!pinFed.has(c.id)){pinFed.add(c.id);derbyFeed.note(by.id,displayedDriver(by),'pinned',elapsed);}
    // The first crush lands as the pin takes hold; the same car counts as pinned once every PIN.recount seconds at most.
    if(!pinNoted.has(c.id)){pinNoted.add(c.id);c.pinTick=PIN.gap;
      if(pinCounts(pinCounted.get(c.id),elapsed)){pinCounted.set(c.id,elapsed);pinScoring.add(c.id);c.pins++;eventAwards.pinned(by.id,c.id,elapsed);
        if(scoreDerby())scoreStunt(by.id,DESTRUCTION_POINTS.pin);
        // Squeezed between two cars rather than against a wall: a SANDWICH (one feed line, not a PINNED one too); the car on the
        // far side shares the credit if it is driving in too (not a parked car or a wreck).
        const other=pushes[pin.against].by>=0?cars.find(v=>v.id===pushes[pin.against].by):undefined;
        const shares=!!other&&Math.abs(other.input.throttle)>=PIN_FEEL.partner;
        if(other){sandwiches++;pinFed.add(c.id);if(mode==='derby')derbyFeed.note(by.id,displayedDriver(by),'sandwich',elapsed);if(shares){eventAwards.pinned(other.id,c.id,elapsed);if(scoreDerby())scoreStunt(other.id,DESTRUCTION_POINTS.sandwich);}}
        if(!demo&&(by.id===0||shares&&other?.id===0)){const pts=by.id===0?DESTRUCTION_POINTS.pin:DESTRUCTION_POINTS.sandwich;toast(`${other?'SANDWICH':'PINNED'} · #${c.id+1} ${DEFINITIONS[c.kind].name}`+pointsTag(pts),2,2);sound.crowd(.8);}
        else if(!demo&&c.id===0)toast(other?`SANDWICHED · #${by.id+1} & #${other.id+1}`:`PINNED BY #${by.id+1} ${DEFINITIONS[by.kind].name}`,2,2);}}
    c.pinTick+=dt;if(c.pinTick<PIN.gap||!(scale>0))continue;c.pinTick-=PIN.gap;
    const before=c.health,at=points[pin.push],wall=points[pin.against],crush=PIN.rate*PIN.gap*scale;
    c.hit(at,c.current.clone().sub(at).setY(0).normalize(),crush,elapsed,true,by.paintColor);
    c.hit(wall,c.current.clone().sub(wall).setY(0).normalize(),crush*PIN.wall,elapsed,true);
    fx.emit(at,2,1,.85);fx.emit(wall,2,1,.85);
    // Felt and heard: a low crunch of metal giving way each tick, a rumble for the player in it, and how to get out when pinned.
    sound.shot('impact-heavy',at,c.id===0||by.id===0?.55:.3,{rate:PIN_FEEL.rate,delay:0,duration:.45});
    if(!demo&&c.id===0){recordRumbleImpact(PIN_FEEL.pinned);toast(PIN_FEEL.hint,PIN.gap+.25,1);}else if(!demo&&by.id===0)recordRumbleImpact(PIN_FEEL.pinning);
    const lost=before-c.health;if(!(lost>0))continue;
    by.inflicted+=lost;lastHitBy.set(c.id,{by:by.id,at:elapsed});
    const wreck=eventAwards.hit(by.id,c.id,lost,before>0&&c.health<=0,elapsed,0);combat.hit(by.id,c.id,before,c.health,elapsed);
    if(wreck){wreckedBy.set(c.id,by.id);sound.crowd(by.id===0?1:.7);if(by.id===0){callout('TAKEDOWN',c);playerTakedown();}}
  }
}
/** The results line of the player's stunts this event (offline). */
function stuntsLine(){if(demo||online?.active||!cars[0])return '';const t=stuntsText(eventAwards.stunts(cars[0].id));return t?`<p class="stunts-line">${t}</p>`:'';}
/** The results line naming the rivals the player finished, and how (offline). */
function victimsLine(){if(demo||online?.active)return '';const me=cars[0]?.id,list=[...wreckedBy].filter(([,by])=>by===me).map(([id])=>{const c=cars.find(v=>v.id===id),cause=c?causeOf(c):undefined;return c?`#${id+1} ${DEFINITIONS[c.kind].name}${cause&&cause!=='WRECKED'?` (${cause})`:''}`:'';}).filter(Boolean);return list.length?`<p class="victims-line">YOU FINISHED · ${list.join(' · ')}</p>`:'';}
/** A finished car's cause: as fixed the moment it went out, or read now when this very step finished it (offline). */
function causeOf(c:Vehicle){if(!c.extendedDamage||c.health>0)return wreckCauses.get(c.id);let cause=wreckCauses.get(c.id);
  if(!cause){cause=wreckCause({engineOut:c.engineOut,fireHeat:c.fireHeat,wheelsLost:c.wreckParts.wheelLost.reduce((n,v)=>n+v,0),seized:c.seized,fuel:c.fuelLevel,inverted:c.inverted>0});wreckCauses.set(c.id,cause);}return cause;}
/** Major parts gone from a car: bumpers, bonnet, boot, tailgate, hatch or engine lid, doors, barn doors and front wings. */
function majorPartsGone(c:Vehicle){let n=c.wingGone.filter(Boolean).length;for(const a of c.wreckParts.assemblies)if(/^(front-bumper|rear-bumper|hood|boot|tailgate|drop-tailgate|hatch|engine-lid|door-|cargo-)/.test(a.name)&&a.members.length&&a.members.every(m=>!m.mesh.visible))n++;return n;}
function playerTakedown(){
  if(online?.active||demo)return;takedownCombo=takedownChain(takedownCombo,lastTakedownAt,elapsed);lastTakedownAt=elapsed;
  const label=comboLabel(takedownCombo)||(lastGasp(cars[0]?.health??100)?'LAST GASP TAKEDOWN':'');if(label){toast(label,2,3);sound.crowd(1);crowdFlashes(SMASH_FLASHES);}
}
/** " · REVENGE READY ON #N NAME" while the player's nemesis is owed a hit (offline). */
function revengeTag(){
  if(online?.active||demo)return '';const r=eventAwards.rivalOf(0),c=r?cars.find(v=>v.id===r.id):undefined;
  return c&&c.health>0&&revengeReady(r,revengeSettled.get(c.id))?` · REVENGE READY ON #${c.id+1} ${DEFINITIONS[c.kind].name}`.toUpperCase():'';
}
/** Show a HUD message. A higher-priority message (a smash) is not overwritten by ordinary ones until it expires. */
let statusPriority=0;
function toast(t: string, duration = 3, priority = 0) {
  if (clock < statusUntil && priority < statusPriority) return;
  statusMessage = t;
  statusUntil = clock + duration;
  statusPriority = priority;
}
function updateHud() {
  if (!['playing', 'countdown'].includes(state)&&!(demo&&state==='result')) return;
  if(state==='playing'&&!demo&&cars[0])playerTopSpeed=Math.max(playerTopSpeed,Math.abs(cars[0].speed));
  // The final two (offline derbies): a slow-motion beat, a banner naming them, the crowd.
  if(mode==='derby'&&!online?.active&&state==='playing'){const alive=cars.filter(c=>c.health>0);
    if(finalTwo(derbyAliveBefore,alive.length)){toast(finalTwoBanner({id:alive[0].id,name:DEFINITIONS[alive[0].kind].name},{id:alive[1].id,name:DEFINITIONS[alive[1].kind].name}),FINAL_TWO.toast,2);
      sound.crowd(1);crowdFlashes(SMASH_FLASHES);if(clock>=slowMoUntil){slowMoUntil=clock+FINAL_TWO.slowmo;slowMoScale=FINAL_TWO.scale;}}
    // The final four: from here the drivers go at it harder (derby-driving FRENZY).
    else if(finalFour(derbyAliveBefore,alive.length)){toast(finalFourBanner(!demo&&(cars[0]?.health??0)>0),FINAL_FOUR.toast,1);sound.crowd(.8);}
    derbyAliveBefore=alive.length;}
  const spectator=scoreSpectating(),toolbar=document.getElementById('spectator-controls');
  if(toolbar){toolbar.hidden=!spectator;toolbar.style.display=spectator?'':'none';}
  if(spectator){const watched=cars.find(c=>c.id===director.followed),alive=cars.some(c=>c.health>0);text('spectator-name',alive&&watched?'SPECTATING · '+displayedDriver(watched)+' · YOUR CAR '+(cars[0].finished?'FINISHED':'OUT'):'NO SURVIVING CARS · WAITING FOR RESULTS');for(const id of ['spectator-prev','spectator-next']){const button=document.getElementById(id) as HTMLButtonElement|null;if(button)button.disabled=!alive;}}
  const player = demo?(cars.find(c=>c.id===director.followed)??cars[0]):cars[0];
  refreshStandings();
  if(mode==='derby'){
    derbyFeed.observe(cars.map(c=>({id:c.id,name:displayedDriver(c),record:combat.get(c.id)})),elapsed);
    const feed=document.getElementById('derby-event-feed'),markup=derbyFeedMarkup(derbyFeed.visible(elapsed),player.id);if(feed&&feed.innerHTML!==markup)feed.innerHTML=markup;
  }
  if(demo){text('follow-name',`#${player.id+1} ${DEFINITIONS[player.kind].name}${demoOptions.setups==='class'?' / '+classEngineLabel(player.setup)+' / '+performanceLabel(player.kind,player.setup):''}`);const view=document.querySelector<HTMLSelectElement>('#demo-camera');if(view)view.value=director.view;const follow=document.querySelector<HTMLSelectElement>('#demo-car');if(follow)follow.value=director.manual?String(director.followed):'auto';}
  if(pursuit)text('pursuit-status',`${scoreSpectating()?'SPECTATING · ':''}${pursuit.role(player.id)==='runner'?'RUNNER · ESCAPE':'CHASER · STOP THE RUNNERS'} · ${cars.filter(c=>pursuit!.role(c.id)==='chaser'&&c.health>0).length} chasers · ${pursuit.snapshot().results.filter(r=>r.outcome==='running').length} runners remaining · ${formatTime(Math.max(0,pursuit.snapshot().rules.duration-elapsed))} left`);
  text('health', Math.ceil(player.health) + '%');
  const hb = document.getElementById('health-bar')!;
  hb.style.width = player.health + '%';
  hb.style.background = player.health < 30 ? '#dd7a55' : '#d9c486';
  text('speed', Math.round(Math.abs(player.speed) * 3.6).toString());
  const instruments=document.querySelector<HTMLCanvasElement>('#instruments');if(instruments)drawInstruments(instruments,player.speed,player.rpm,player.gear,player.health);
  text(
    'gear',
    `GEAR ${transmissionGearLabel(player.gear)}  /  ${Math.round(player.rpm)} RPM${transmissionNotice(player)}`,
  );
  document.getElementById('rpm-bar')!.style.width =
    clamp((player.rpm / 7000) * 100, 0, 100) + '%';
  text('surface', player.surface.toUpperCase());
  text('engine-status', player.extendedDamage&&(oilWarning(player.oilLevel,player.seized)||fuelWarning(player.fuelLevel)||coolantWarning(player.coolantLevel))?oilWarning(player.oilLevel,player.seized)||fuelWarning(player.fuelLevel)||coolantWarning(player.coolantLevel):player.engineStall!>0&&player.health>0?'ENGINE STALLED':engineStatus(player.health,player.engineDamage));
  if(elapsed-damageDiagramAt>.2||elapsed<damageDiagramAt){damageDiagramAt=elapsed;const svg=damageDiagramSvg({zones:player.damageZones,structure:player.structuralDamage,wheelDamage:player.wreckParts.wheelDamage,wheelLost:player.wreckParts.wheelLost,tyreFailure:[0,1,2,3].map(i=>tyreFailureLevel(player.tyreDamage?.[i])),engine:player.engineDamage??Math.max(0,(40-player.health)/40),misfiring:player.misfireFactor<1,rearEngine:isRearEngineKind(player.kind),leaks:player.extendedDamage?leakRates(player.structuralDamage?.[0]??0,player.engineDamage??0,(isRearEngineKind(player.kind)?player.structuralDamage?.[0]:player.structuralDamage?.[1])??0):undefined,wrecked:player.health<=0,parts:partStates(player),faults:player.extendedDamage?{hotDiscs:Array.from(player.discHeat,discGlow),steerLink:player.steerLink,looseWheels:player.nutLoose,diff:player.diffWear>=1?diffAxle(player.structuralDamage,player.drivenWheels.length===4?'all':player.drivenWheels[0]===0?'front':'rear'):null,exhaustGone:player.exhaustGone,seized:player.seized,rollBar:player.rollBar,propshaft:player.propSnapped?'snapped':player.propBend>=.12?'bent':null,bearings:player.bearingWear,belt:player.beltSnapped?'snapped':player.beltSlip>=.3?'slipping':null,battery:player.battery,steerSkew:player.steerSkew,tank:player.tankGone?'gone':player.tankDown?'down':null,throttleCable:player.throttleCable,handbrakeCable:player.handbrakeCable,batteryOut:player.batteryOut,rodThrown:player.rodThrown,tyresAlight:player.tyreAlight,exhaustCrushed:player.exhaustCrushed}:undefined});const el=document.getElementById('damage-diagram');if(el&&svg!==damageDiagramSvgLast){el.innerHTML=svg;damageDiagramSvgLast=svg;}}
  text('tyre-status', tyreWarning(player.tyreDamage,player.extendedDamage));
  text('fluid-status', player.extendedDamage?fluidWarning(leakRates(player.structuralDamage?.[0]??0,player.engineDamage??0,(isRearEngineKind(player.kind)?player.structuralDamage?.[0]:player.structuralDamage?.[1])??0),player.slickGrip,player.oily,player.flameHeat):'');
  text('gearbox-status', warningLine([player.extendedDamage&&player.deadTime>0&&player.health>0?`CAR DEAD · OUT IN ${Math.max(1,Math.ceil(DNF.after-player.deadTime))}s`:'',gearboxWarning(player.gearLimit),player.extendedDamage?(player.inNeutral?'JUMPED OUT OF GEAR':clutchWarning(player.clutchGrip)):'',player.extendedDamage?playWarning(player.steerPlay):'',player.extendedDamage?extinguisherHint(player.burning,player.extinguishers):'',player.extendedDamage?rubHeatWarning(player.rubHeat,player.tyreAlight):'',player.extendedDamage?rubWarning(player.rubDrag):'',player.extendedDamage?electricalWarning(player.electricalFault):'',player.extendedDamage?nutWarning(player.nutLoose):'',player.extendedDamage?exhaustWarning(player.exhaustBlow):'',player.extendedDamage?exhaustCrushWarning(player.exhaustCrushed,player.exhaustGone):'',player.extendedDamage?diffWarning(player.diffWear):'',player.extendedDamage?tieRodWarning(player.steerLink):'',player.extendedDamage?rollBarWarning(player.rollBar):'',player.extendedDamage?propWarning(player.propBend,player.propSnapped):'',player.extendedDamage?bearingWarning(player.bearingWear):'',player.extendedDamage?skewWarning(player.steerSkew):'',player.extendedDamage?beltWarning(player.beltSlip,player.beltSnapped,player.battery):'',player.extendedDamage?overheatWarning(player.hotTime):'',player.extendedDamage?caliperWarning(player.brakeDrag):'',player.extendedDamage?mountsWarning(player.mountsBroken):'',player.extendedDamage?gasketWarning(player.gasketBlown):'',player.extendedDamage?tankWarning(player.tankDown,player.tankGone):'',...(player.extendedDamage?cableWarnings(player.throttleCable,player.handbrakeCable):[]),player.extendedDamage?frameWarning(player.frameBend):'',player.extendedDamage?dazeWarning(player.dazed):'',player.extendedDamage?batteryOutWarning(player.batteryOut):'',player.extendedDamage&&player.engineStall!>0?starterWarning(player.starterDamage):'',player.extendedDamage?brakeWarning(player.brakeFluid):'',player.extendedDamage?steerWarning(player.steerRate):'',player.throttleJammed?'THROTTLE STUCK':'']));
  text('armor-status',online?.active?'':armorWearWarning(player.setup.armor,player.structuralDamage));
  text('engine-restart', player.seized?'':noBatteryHint(player.batteryOut,player.health,player.engineStall)||stallHint(player.health,player.engineStall,player.input.throttle));
  text(
    'steer-status',
    player.wreckParts.wheelLost.some(v=>v)
      ? 'WHEEL LOST'
      : player.steerLimit < .8
      ? 'STEERING BENT'
      : Math.abs(player.damageLeft - player.damageRight) > 16
      ? 'STEERING PULL'
      : 'STEERING OK',
  );
  if(demo&&mode==='race')for(const car of cars){const option=ui.querySelector<HTMLOptionElement>(`#demo-car option[value="${car.id}"]`);if(option)option.textContent=`#${car.id+1} ${DEFINITIONS[car.kind].name} · ${car.finished?(raceTimeLimit()?timedRaceResult(car):'FINISHED'):car.health<=0?'RETIRED':state==='result'?'DNF':raceTimeLimit()?'LAP '+car.lap:waypointRace?'STATIONS '+car.passed+'/'+raceLaps()*6:'LAP '+Math.min(raceLaps(),car.lap)+'/'+raceLaps()}`;}
  const remaining = Math.max(0, eventDuration() - elapsed);
  if(settings.performance&&eventFrameTimes.length){const sample=eventFrameTimes.slice(-300).sort((a,b)=>a-b),mean=sample.reduce((a,b)=>a+b,0)/sample.length;text('performance-readout',`${cars.length} CARS · ${Math.round(1000/mean)} FPS · P95 ${Math.round(sample[Math.floor((sample.length-1)*.95)])} ms`);}
  if(mode==='race'&&!demo&&!online?.active&&!pursuit){const r=eventAwards.rivalOf(player.id),opponent=r?cars.find(c=>c.id===r.id):undefined;let label='';
    if(r&&opponent){const order=rankRace(),me=order.indexOf(player),them=order.indexOf(opponent),gap=Math.abs(me-them);label=`RIVAL · ${DEFINITIONS[opponent.kind].name} #${opponent.id+1} · ${opponent.health<=0?'WRECKED':gap===0?'LEVEL':them<me?`${gap} ${gap===1?'PLACE':'PLACES'} AHEAD`:`${gap} ${gap===1?'PLACE':'PLACES'} BEHIND`} · DEALT YOU ${Math.round(r.damage)}`;}
    text('rival-status',label+revengeTag());}
  if(teamRace()){const team=demo?undefined:teamOf(cars.indexOf(player));text('team-status',state==='result'?teamVerdict(currentTeamScores(),team):teamLine(currentTeamScores(),team));}
  if(mode==='derby'){
    const rival=combat.rival(player.id),opponent=cars.find(c=>c.id===rival),record=combat.get(player.id);
    const label=opponent&&opponent.health>0?'RIVAL · '+DEFINITIONS[opponent.kind].name+' #'+(opponent.id+1)+' · +25 FOR ATTACKING HITS':combat.rivals?'RIVAL · WAITING FOR CONTACT':'';
    text('rival-status',label+(!scoreDerby()&&combat.rivals?' · '+(record.bonus??0)+' BONUS PTS':'')+revengeTag());
    if(scoreDerby())text('event-label','SCORE / POSITION');
    const award=record.award;if(award&&elapsed-award.time<1.5&&elapsed>=award.time)toast(`${COMBAT_AWARDS[award.kind].label} +${award.points}`, .2);
    if(player.health<=0)toast(derbyWreckStatus(derbyFormat(),record.respawnAt,elapsed),.4);
  }
  if(activeChallenge&&telemetry){text('challenge-score',formatChallengeValue(activeChallenge,challengeValue(activeChallenge,telemetry.stats)));text('challenge-target',`${stuntProgress?stuntProgress.hint+' · ':''}BRONZE ${formatChallengeValue(activeChallenge,activeChallenge.medals[0])} · ${Math.ceil(remaining)}s LEFT · STOCK CAR / NO RECOVERY`);}
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
  if(pursuit){text('event-label',pursuit.role(player.id)==='runner'?'RUNNER':'PURSUER');text('event-value',pursuit.role(player.id)==='runner'?`${Math.min(raceLaps(),player.lap)} / ${raceLaps()} LAPS`:'STOP THE RUNNERS');text('time-value',formatTime(Math.max(0,pursuit.snapshot().rules.duration-elapsed)));}
  if(mode==='race'&&!pursuit&&!raceTimeLimit()&&(demo||online?.active&&online.network.snapshot?.raceFinishWindowSupport)&&state==='playing'){const left=raceFinishRemaining(cars,elapsed);if(left!==null)text('time-value',`${player.finished?'FINISHED':'FINISH THE RACE'} \u00b7 ${Math.ceil(left)}s LEFT`);}
  if(activeTimeTrial){text('time-value',formatTrialTime(player.finished?player.finishTime:elapsed+player.penalty));text('event-value',formatTrialTime(timeTrialBest(timeTrialRecords,activeTimeTrial)));text('time-trial-progress',`${Math.min(24,Math.max(0,player.passed))} / 24 GATES`);text('time-trial-validity',timeTrialInvalidReason?`PRACTICE ONLY · ${timeTrialInvalidReason}`:timeTrialBuildLabel(activeTimeTrial).toUpperCase()+' · ONE LAP · NO RECOVERY');text('time-trial-ghost',!trialGhostLibrary.enabled?'GHOST OFF':trialGhostTarget?trialGhostSplit||`RACING ${trialGhostLabel} GHOST`:'NO SAVED GHOST · SET A NEW PERSONAL BEST');}
  document.getElementById('countdown')!.innerHTML =
    state === 'countdown'
      ? online?.active&&online.network.snapshot?.startReadiness?`<strong>LOADING</strong><p>WAITING FOR ${online.network.snapshot.startReadiness.pending.length} DRIVER${online.network.snapshot.startReadiness.pending.length===1?'':'S'} · ${Math.ceil(online.network.snapshot.startReadiness.remainingMs/1000)}s MAX</p>`:`<strong>${Math.ceil(countdown)}</strong><p>${mode === 'derby' ? 'SURVIVE THE IMPACT' : 'FIND YOUR LINE'}</p>`
      : demo&&state==='result'?`<p>${resultTitle}</p><p>${Number.isFinite(demoRestart)?'NEXT EVENT IN '+Math.ceil(demoRestart):'EVENT COMPLETE · CHOOSE NEXT EVENT OR EXIT'}</p>`:'';
  if (!demo&&!pursuit&&player.rollTime > 2) toast('OVERTURNED — PRESS R TO RECOVER', 1);
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
  if(activeClubRound!==null){const waiting=cars.filter(c=>!c.finished&&c.health>0&&!(c.id===0&&clubRetired)).length,remaining=mode==='race'?Math.max(0,Math.ceil(Math.min(300-elapsed,clubFirstFinish===null?300:clubFirstFinish+45-elapsed))):Math.max(0,Math.ceil(eventDuration()-elapsed));text('club-live',clubPlayerStopped?`${clubRetired?'RETIRED':cars[0].finished?'FINISHED':'WRECKED'} · ${mode==='race'?waiting+' drivers still racing':'Derby still running'} · ${remaining}s maximum remaining`:clubEngineLabel(clubCup?.enginePolicy,cars[0].kind,cars[0].setup)+' · '+GRID_LINEUPS[clubCup?.lineup??'mixed']+' · '+classLimitLabel(clubCup?.classLimit)+' · '+AI_DIFFICULTIES[aiDifficulty()].label+' · Championship points · '+(mode==='race'?'Field closes 45s after the first finish':eventDuration()+'-second survival derby'));}
  drawMap();
  fitInstruments();
}
/** The status block grows upward as warnings pile up: lift the dial clear of the warning lines (measured only when they change). */
let instrumentsKey='';
function fitInstruments(){
  const status=ui.querySelector('.status'),dial=document.getElementById('instruments');if(!status||!dial)return;
  const lines=Array.from(status.querySelectorAll<HTMLElement>('.tyre-status')),key=lines.map(e=>e.textContent).join('|')+'|'+innerWidth+'x'+innerHeight;
  if(key===instrumentsKey)return;instrumentsKey=key;
  const extra=lines.reduce((h,e)=>h+e.offsetHeight,0);dial.style.transform=extra>0?`translateY(${-extra}px)`:'';
}
function drawMap() {
  const canvas=document.querySelector<HTMLCanvasElement>('#map');
  const followed=demo||scoreSpectating()?director.followed:online?.active?online.network.id:0,car=cars.find(c=>c.id===followed);
  const returnPoint=car?offroadMarker.update(activeVenue.course,followed,car.current,mode==='race'&&!waypointRace&&!pursuit&&!car.finished&&car.health>0):undefined;
  if(!car)offroadMarker.reset();
  if(canvas)drawQuarryMap(canvas,cars,activeVenue.arena??quarry.arenaLayout,mode,demo||scoreSpectating()?director.followed:online?.active?online.network.id:0,waypointRace?waypointRace.available(demo||scoreSpectating()?director.followed:online?.active?online.network.id:0).map(i=>waypointRace!.stations[i]):[],activeVenue.course.id==='quarry-v1'?undefined:{point:activeVenue.course.point,extent:activeVenue.course.mapExtent??145,halfWidth:activeVenue.course.halfWidth,lines:activeVenue.course.mapLines},returnPoint);
}
function formatTime(t: number) {
  return `${Math.floor(t / 60)
    .toString()
    .padStart(2, '0')}:${Math.floor(t % 60)
    .toString()
    .padStart(2, '0')}`;
}
function pause(settingsOnly = false) {
  controllerRumble.stop();
  if (['loading', 'paused'].includes(state)||state==='result'&&!demo) return;
  resumeState = state;
  state = 'paused';
  keys.clear();
  online?.network.clearInput();
  sound.pause(true);
  orbit.enabled = false;
  ui.insertAdjacentHTML('beforeend', `<div class="overlay" id="overlay"><div class="dialog"><div class="eyebrow">BLACKRIDGE MOTOR CLUB</div><h2>${settingsOnly ? 'SETTINGS' : 'TAKE A BREATHER'}</h2><div class="settings-row"><label for="quality">Graphics</label><select id="quality"><option value="auto">Auto (recommended)</option><option value="ultra">Ultra</option><option value="high">High</option><option value="medium">Medium</option></select></div><p>Auto adjusts graphics for smoother driving. Car counts, physics and collision damage stay the same.</p>${(['engine', 'effects', 'ambience'] as const).map((k) => `<div class="settings-row"><label for="${k}-volume">${k[0].toUpperCase() + k.slice(1)}</label><input id="${k}-volume" type="range" min="0" max="1" step=".05" value="${settings[k]}"></div>`).join('')}<div class="settings-row"><label for="performance">Performance display</label><input type="checkbox" id="performance" ${settings.performance?'checked':''}></div><p>${demo?'C camera · [ / ] choose car<br>Space / Escape pause · M mute · F fullscreen<br>Free orbit: drag to look around, scroll to zoom':"Driving keys and gamepad: expand controls below<br>C camera · R recover · M mute · F fullscreen · Escape pause"+(mode === 'playground' ? '<br>I inspect wreck · T toggle traffic · R repair' : '')}</p><button class="primary" id="resume">${resumeState === 'menu' ? 'BACK' : 'RESUME'}</button>${resumeState !== 'menu' ? '<button class="small-button" id="restart">RESTART EVENT</button><button class="small-button" id="main-menu">RETURN TO QUARRY</button>' : ''}</div></div>`);
  if(resumeState!=='menu'&&mode!=='playground'&&cars.length>1)ui.querySelector('#overlay h2')!.insertAdjacentHTML('afterend','<details class="pause-standings" open><summary>CURRENT STANDINGS</summary>'+standingsTable(currentStandings(),true)+'</details>');
  ui.querySelector('#overlay .settings-row')!.insertAdjacentHTML('beforebegin',`<div class="settings-row"><label for="standings-key">Expand standings</label><select id="standings-key">${Object.entries(STANDINGS_KEYS).map(([key,label])=>`<option value="${key}">${label}</option>`).join('')}</select></div>`);
  const standingsSelect=ui.querySelector<HTMLSelectElement>('#standings-key')!;standingsSelect.value=settings.standingsKey;standingsSelect.onchange=()=>{settings.standingsKey=standingsKey(standingsSelect.value);persist();refreshStandings(true);};
  document.querySelector<HTMLInputElement>('#performance')!.onchange=e=>{settings.performance=(e.target as HTMLInputElement).checked;persist();};
  ui.querySelector('#engine-volume')!.closest('.settings-row')!.insertAdjacentHTML('beforebegin',`<div class="settings-row"><label for="audio-output">Audio output</label><select id="audio-output">${Object.entries(AUDIO_OUTPUTS).map(([value,label])=>`<option value="${value}">${label}</option>`).join('')}</select></div>`);
  const audioOutput=ui.querySelector<HTMLSelectElement>('#audio-output')!;audioOutput.value=settings.audioOutput;
  audioOutput.onchange=()=>{settings.audioOutput=readAudioOutput(audioOutput.value);sound.setOutput(settings.audioOutput);persist();};
  ui.querySelector('#quality')!.closest('.settings-row')!.insertAdjacentHTML('afterend',`<div class="settings-row"><label for="lighting">Lighting</label><select id="lighting">${Object.entries(LIGHTING_CHOICES).map(([value,label])=>`<option value="${value}">${label}</option>`).join('')}</select></div>`);
  const lighting=ui.querySelector<HTMLSelectElement>('#lighting')!;lighting.value=settings.lighting;
  lighting.onchange=()=>{settings.lighting=readLighting(lighting.value);applyEventLighting(true);persist();};
  const quality = document.querySelector<HTMLSelectElement>('#quality')!;
  quality.value = settings.quality;
  quality.onchange = () => {
    settings.quality = graphicsChoice(quality.value);
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
  mountCameraSettings(ui.querySelector<HTMLElement>('#overlay .dialog')!,settings.camera,persist);
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
  adaptiveGraphics.configure(settings.quality);
  const quality=adaptiveGraphics.quality;
  qualityScale =
    quality === 'ultra'
      ? 1
      : quality === 'high'
        ? 0.85
        : 0.65;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5) * qualityScale);
  renderer.setSize(innerWidth, innerHeight);
  composer.setPixelRatio(Math.min(devicePixelRatio, 1.5) * qualityScale);
  composer.setSize(innerWidth, innerHeight);
  if (quarry) {
    quarry.sun.shadow.mapSize.setScalar(
      quality === 'ultra' ? 4096 : 2048,
    );
    quarry.sun.shadow.map?.dispose();
    quarry.sun.shadow.map = null;
    quarry.sun.shadow.needsUpdate = true;
  }
  staticShadows?.setQuality(quality);
  vehicleFire?.setQuality(quality);
  puddleSplashes?.setQuality(quality);
  quarry?.referenceArena.setQuality(quality);
  ao.enabled = quality !== 'medium';
  reflections.enabled = quality !== 'medium';
  reflections.interval = quality === 'ultra' ? 3 : 6;
  setSceneShadows(renderer,scene,quality !== 'medium');
}
function fullScreen() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen().catch(() => {});
}
function recover() {
  if(pursuit){toast('CHASE: NO RECOVERIES',2);return;}
  if(scoreElimination()&&cars[0]?.health<=0){toast('WRECKED · NO RESPAWNS',2);return;}
  if(activeClubRound!==null&&clubPlayerStopped)return;
  if(activeChallenge){toast('CHALLENGE RULE: NO RECOVERIES',2);return;}
  offroadMarker.reset();
  telemetry?.recover();
  if(activeTimeTrial)timeTrialInvalidReason='RECOVERY USED';
  if(online?.active){online.network.recover();return;}
  const p = cars[0];
  if (!p||raceTimeLimit()&&p.finished) return;
  if (mode === 'playground') {
    if(activeVenue!==quarryVenue){
      const def=DEFINITIONS[p.kind],shape=new R.Cuboid(def.halfWidth+.25,.3,def.halfLength+.25);
      const at=freeDriveRecovery(activeVenue.course,p,cars,slot=>!!physics.intersectionWithShape({x:slot.x,y:activeVenue.course.height(slot.x,slot.z)+.9,z:slot.z},{x:0,y:Math.sin(slot.yaw/2),z:0,w:Math.cos(slot.yaw/2)},shape,undefined,undefined,undefined,p.body));
      if(!at){toast('WAITING FOR CLEAR GROUND');return;}
      p.place(at.x,at.z,at.yaw,true);toast('CAR REPAIRED');return;
    }
    p.place(
      p.current.x,
      p.current.z,
      Math.atan2(p.forward.x, p.forward.z),
      true,
    );
    toast('CAR REPAIRED');
  } else if (mode === 'race') {
    const route=raceRoute(p.id);
    const index = (p.nextCheckpoint + route.length-1) % route.length;
    const at = raceRoute(p.id)[index],
      to = raceRoute(p.id)[p.nextCheckpoint];
    p.place(at.x, at.z, Math.atan2(to.x - at.x, to.z - at.z));
    p.penalty += 5;
    toast(activeTimeTrial?'RECOVERED · PRACTICE ONLY · RETRY FOR A PERSONAL BEST':'RECOVERED · +5 SECONDS');
  } else {
    if (p.health === 0) return;
    combat.feats.remove(p.id);
    p.health = Math.max(1, p.health - 8);
    const arena=activeVenue.arena??quarry.arenaLayout,dx=p.current.x-arena.x,dz=p.current.z-arena.z,dist=Math.hypot(dx,dz),limit=arena.radius-8;
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
  return drivingInput(drivingControls,keys,pads,cars[0]?.speed??0,!online?.active||online.network.snapshot?.transmissionSupport===true,!online?.active||online.network.snapshot?.assistsSupport===true);
}
const aiFires:{clock:number;list:GroundFire[]}={clock:-1,list:[]};let fireAvoidance=true;
/** Offline AI drivers also steer round burning puddles and props, and drive out of flames. */
function ai(car: Vehicle, dt: number): Input {
  const core=aiCore(car,dt);
  if(car.seized&&car.extendedDamage)return{throttle:0,steer:core.steer,brake:.3,handbrake:false};
  // A sick engine (low oil or coolant) is nursed, and broken steering (a snapped tie rod, loose steering) driven with care:
  // the AI holds the throttle back.
  // An overheating engine is eased right off so it cools.
  const input=car.extendedDamage&&!online?.active?{...core,throttle:coolThrottle(nurseThrottle(core.throttle,car.oilLevel<OIL.low||car.coolantLevel<COOLANT.low||car.steerLink.some(v=>v===0)||car.steerPlay>=STEER_PLAY.warn),car.hotTime>=OVERHEAT_FIRE.warn)}:core;
  if(!fireAvoidance||!car.extendedDamage||online?.active||car.health<=0)return input;
  if(aiFires.clock!==fx.slicks.clock){aiFires.clock=fx.slicks.clock;aiFires.list=[...(fx.slicks.burningCount()?fx.slicks.fires():[]),...(propFires.burning.size?propFires.fires(fx.slicks.clock,propPoints(activeVenue.props)):[]),...fx.debrisFires()];}
  const fires=aiFires.list;
  return fires.length?avoidFires(car,input,fires,fx.slicks.clock,car.flameHeat):input;
}
function aiCore(car: Vehicle, dt: number): Input {
  if(car.health<=0||(car.finished&&mode!=='race'))return {throttle:0,steer:0,brake:1,handbrake:false};
  const yaw=Math.atan2(car.forward.x,car.forward.z);
  const practiceTraffic=mode==='playground'&&activeVenue!==quarryVenue;
  if((mode==='race'||practiceTraffic)&&!pursuit){
    if(waypointRace)car.nextCheckpoint=waypointRace.navigation(car.id,car.current,car.forward).next;
    const openWaypoints=!!waypointRace&&!!activeVenue.course.waypointStations;
    const nearest=openWaypoints?0:activeVenue.course.distance(car.current.x,car.current.z);
    car.offTrackTime=nearest>14?car.offTrackTime+dt:0;
    const needsRecovery=car.offTrackTime>7||car.rollTime>4;
    if(needsRecovery||raceRecovery.ready(car,dt,openWaypoints?4:drivers.memory.get(car.id)?.attempts??0)){
      const def=DEFINITIONS[car.kind],shape=new R.Cuboid(def.halfWidth+.2,.25,def.halfLength+.2);
      const at=freeRecoverySlot(car,cars,raceRoute(car.id),courseRecoveryArea(activeVenue.course,!!waypointRace),slot=>!!physics.intersectionWithShape(
        {x:slot.x,y:activeVenue.course.height(slot.x,slot.z)+.8,z:slot.z},
        {x:0,y:Math.sin(slot.yaw/2),z:0,w:Math.cos(slot.yaw/2)},shape,undefined,undefined,undefined,car.body));
      if(at){
        car.place(at.x,at.z,at.yaw);car.offTrackTime=0;car.checkpointDistance=Infinity;car.penalty+=5;
        drivers.memory.delete(car.id);raceRecovery.clear(car);
      }
    }
  }else if(!pursuit&&car.rollTime>5){car.place(car.current.x,car.current.z,yaw);car.health=Math.max(1,car.health-7);car.penalty+=5;drivers.memory.delete(car.id);}
  const probe=()=>{
    const ray=(angle:number)=>{
      const dir={x:Math.sin(yaw+angle),y:0,z:Math.cos(yaw+angle)};
      const start={x:car.current.x,y:Math.max(car.current.y,activeVenue.course.height(car.current.x,car.current.z)+.55),z:car.current.z};
      const hit=physics.castRay(new R.Ray(start,dir),24,true,undefined,undefined,undefined,car.body,c=>(activeVenue.course.isDrivingObstacle?.(c)??true)&&!cars.some(v=>v.body.handle===c.parent()?.handle));
      return hit?drivingObstacleClearance(car,angle,hit.timeOfImpact):24;
    };
    return {front:ray(0),left:ray(-.55),right:ray(.55),rear:ray(Math.PI)};
  };
  if(pursuit)return pursuitDriving.update(pursuit,car,cars,dt,elapsed,raceRoute(car.id),probe,target=>{
    const dx=target.x-car.current.x,dz=target.z-car.current.z,length=Math.hypot(dx,dz);if(length<.1)return true;
    const halfWidth=DEFINITIONS[car.kind].halfWidth;
    if(!pursuitTerrainClear(car.current,target,halfWidth,(x,z)=>activeVenue.course.height(x,z),(x,y,z)=>activeVenue.course.outside(x,y,z)))return false;
    const y=Math.max(car.current.y,activeVenue.course.height(car.current.x,car.current.z)+.55);
    return [-1,0,1].every(side=>!physics.castRay(new R.Ray({x:car.current.x+dz/length*side*(halfWidth+.35),y,z:car.current.z-dx/length*side*(halfWidth+.35)},{x:dx/length,y:0,z:dz/length}),length,true,undefined,undefined,undefined,car.body,c=>(activeVenue.course.isDrivingObstacle?.(c)??true)&&!cars.some(v=>v.body.handle===c.parent()?.handle)));
  });
  if(bangerRace()){const id=bangerAggression.target(car,cars,elapsed),rival=id>=0?cars.find(c=>c.id===id):undefined;if(rival)return drivers.update(car,cars,'race',dt,probe,raceRoute(car.id),{id:rival.id,point:{x:rival.current.x,z:rival.current.z}});}
  return drivers.update(car,cars,practiceTraffic?'race':mode,dt,probe,raceRoute(car.id));
}
/** Diagram states for the bolt-on parts: gone when every panel has left, loose while it hangs. */
function partStates(c:Vehicle){const state=(name:string):'ok'|'loose'|'gone'|undefined=>{const a=c.wreckParts.assemblies.find(x=>x.name===name);if(!a)return undefined;return a.members.every(m=>!m.mesh.visible)?'gone':a.loose>.05?'loose':'ok';};return{frontBumper:state('front-bumper'),rearBumper:state('rear-bumper'),hood:state('hood'),boot:state('boot'),doorLeft:state('door-left'),doorRight:state('door-right'),doorRearLeft:state('door-rear-left'),doorRearRight:state('door-rear-right'),wingLeft:c.wingGone[0]?'gone' as const:undefined,wingRight:c.wingGone[1]?'gone' as const:undefined};}
/** An exploding car shoves everything near it: cars and loose props within SHOCKWAVE.radius are thrown
 * outward and up, harder the closer they are (offline only; replays show it through recorded poses). */
const SHOCKWAVE={radius:9,speed:7,lift:3.5};
/** A burning oil drum blows up: the blast throws cars and props, dents the bodywork facing it, and bangs. */
function drumBlast(origin:T.Vector3,index:number){
  shockwave(origin,-1);
  // The drum itself rockets up, tumbling.
  const drum=activeVenue.props[index]?.body;if(drum?.isEnabled()){const m=drum.mass(),a=index*2.399;drum.applyImpulse({x:Math.cos(a)*m*1.6,y:m*9,z:Math.sin(a)*m*1.6},true);drum.applyTorqueImpulse({x:m*.35,y:m*.1,z:-m*.25},true);}fx.emit(origin,24,1,3);fx.emit(origin,6,2,1.2);sound.drumBlast(origin);sound.crowd(.8);
  recorder?.burst({time:elapsed,position:origin.toArray()});
  blastDamage(origin,-1,DRUM_BLAST.radius,DRUM_BLAST.damage);
}
/** An exploding car blows in bodywork too: offline cars within reach take a hit on the side facing the blast. */
const CAR_BLAST={radius:7,damage:18} as const;
function blastDamage(origin:T.Vector3,source:number,radius:number,damage:number){
  for(const c of cars){
    if(c.id===source||!c.extendedDamage||c.health<=0)continue;const to=c.current.clone().sub(origin),d=to.length();if(d>=radius)continue;
    const dir=to.normalize(),at=c.current.clone().addScaledVector(dir,-.9);at.y=c.current.y+.3;
    c.hit(at,dir,damage*(1-d/radius),elapsed,false);
  }
}
function shockwave(origin:T.Vector3,source:number){
  const push=(body:R.RigidBody,mass:number)=>{const p=body.translation(),dx=p.x-origin.x,dz=p.z-origin.z,d=Math.hypot(dx,dz,p.y-origin.y);if(d>=SHOCKWAVE.radius)return;const k=(1-d/SHOCKWAVE.radius)*mass,len=Math.hypot(dx,dz)||1;body.applyImpulse({x:dx/len*SHOCKWAVE.speed*k,y:SHOCKWAVE.lift*k,z:dz/len*SHOCKWAVE.speed*k},true);body.applyTorqueImpulse({x:(Math.random()-.5)*k*1.5,y:(Math.random()-.5)*k,z:(Math.random()-.5)*k*1.5},true);};
  for(const c of cars)if(c.id!==source&&c.extendedDamage)push(c.body,c.specification.mass);
  for(const prop of activeVenue.props)if(prop.body.isEnabled())push(prop.body,prop.body.mass());
}
/** A car's fuel tank goes up (offline): it is thrown, stripped and destroyed; the explosion is heard, the crowd roars, a player
 * near it sees it in slow motion, and whoever set it alight is credited. */
function carBlowsUp(car:Vehicle,at:T.Vector3){
  if(online?.active||!car.blowUp())return;blowUps++;blowUpHold=elapsed+BOOM.hold;car.igniteRequest=true;
  if(!sound.clip('car-explosion',at,1,3))sound.shot('vehicle-burst',at,1,{rate:.7,delay:0,duration:1.4});
  sound.crowd(1);crowdFlashes(SMASH_FLASHES);
  const player=cars[0],near=!!player&&player.current.distanceTo(at)<BOOM.near;
  if(!demo&&(car.id===0||near)){if(clock>=slowMoUntil){slowMoUntil=clock+BOOM.slowmo;slowMoScale=BOOM.scale;}recordRumbleImpact(1);}
  const by=alightBy.get(car.id),credit=by!==undefined&&by!==car.id?cars.find(c=>c.id===by):undefined;
  if(credit)wreckedBy.set(car.id,credit.id);
  // The fireball sets cars close by alight: whoever lit the first fire is credited down the chain.
  for(const o of cars){if(o===car||!o.extendedDamage||o.current.distanceTo(at)>BOOM.ignite)continue;o.igniteRequest=true;chainIgnitions++;alightBy.set(o.id,credit?.id??car.id);}
  if(!demo)toast(car.id===0?'YOUR CAR BLEW UP':credit?.id===0?`YOU BLEW UP #${car.id+1} ${DEFINITIONS[car.kind].name}`+pointsTag(DESTRUCTION_POINTS.boom):`#${car.id+1} ${DEFINITIONS[car.kind].name} BLEW UP`,2.6,3);
  if(mode==='derby'){derbyFeed.note(credit?.id??car.id,displayedDriver(credit??car),'boom',elapsed);if(credit&&scoreDerby())scoreStunt(credit.id,DESTRUCTION_POINTS.boom);}
}
/** Wheels lost and panels gone, to credit whoever tears them off. */
function stripCount(c:Vehicle){let wheels=0;for(const v of c.wreckParts.wheelLost)wheels+=v;return{wheels,parts:c.panels.reduce((n,m)=>n+(m.visible?0:1),0)};}
function creditStrip(attacker:Vehicle,victim:Vehicle,before:{wheels:number;parts:number}){const after=stripCount(victim),wheels=after.wheels-before.wheels,parts=after.parts-before.parts;if(wheels<=0&&parts<=0)return;eventAwards.stripped(attacker.id,victim.id,wheels,parts,elapsed);if(attacker.id===0&&!demo&&!online?.active&&wheels>0)toast(`WHEEL OFF · #${victim.id+1} ${DEFINITIONS[victim.kind].name}`,1.4);if(wheels>0&&mode==='derby'&&!online?.active)derbyFeed.note(attacker.id,displayedDriver(attacker),'wheel',elapsed);}
function currentTeamScores(){return teamScores(rankRace().map(c=>({slot:cars.indexOf(c),scores:c.finished||c.health>0})));}
function rankRace(){const order=rankRaceBase();return eliminationRace()?[...order.filter(c=>c.finished),...order.filter(c=>!c.finished&&c.health>0),...order.filter(c=>!c.finished&&c.health<=0).sort((a,b)=>eliminatedOrder.indexOf(b.id)-eliminatedOrder.indexOf(a.id))]:order;}
function rankRaceBase() {
  if(pursuit){const won=pursuit.winner==='runners';return [...cars].sort((a,b)=>(Number(pursuit!.role(b.id)==='runner')-Number(pursuit!.role(a.id)==='runner'))*(won?1:-1)||b.health-a.health||a.id-b.id);}
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
  // The arena horn sounds the end of a derby heat (it plays on through the pause).
  if(mode==='derby'&&!online?.active&&sound.endHorn())endHorns++;
  sound.pause(true);
  const ordered = online?.active ? (online.network.snapshot?.ranking??[]).map(id=>cars.find(c=>c.id===id)!).filter(Boolean) : mode === 'derby' ? derbyRanking() : rankRace();
  const rank = ordered.findIndex(isPlayer) + 1;
  if(activeTimeTrial){finishTimeTrial();return;}
  if(telemetry){Object.assign(telemetry.stats,{seconds:elapsed+cars[0].penalty,health:cars[0].health,rank:mode==='playground'?0:rank,won:pursuit?pursuitTeamWon(pursuit,cars[0].id):mode!=='playground'&&rank===1&&(mode==='race'?cars[0].finished:scoreDerby()||cars[0].health>0),finished:cars[0].finished,checkpoints:cars[0].passed});bankRun(true);}
  if(activeChallenge&&telemetry){
    const medal=lastAward?.medal??0;
    const detail=activeChallenge.mode==='race'&&!cars[0].finished?'Race not finished':formatChallengeValue(activeChallenge,challengeValue(activeChallenge,telemetry.stats));
    ui.innerHTML=`<div class="overlay"><section class="dialog challenge-result" aria-label="Challenge result"><div class="eyebrow">${challengeVenueName(activeChallenge)} / ${activeChallenge.title.toUpperCase()} / ${isDailyChallenge(activeChallenge)?'DAILY EVENT':'CHALLENGE'}</div><h2>${medal?MEDALS[medal]+' MEDAL':'TRY AGAIN'}</h2><p>${detail} · ${Math.ceil(cars[0].health)}% condition</p><p>${activeChallenge.description}</p><p class="award-summary">${awardText(lastAward)}</p>${victimsLine()}${stuntsLine()}${badgeLine()}${careerRun?`<p>${careerStatus(profile).available} unlock points available · Best medals count once.</p>`:''}${isDailyChallenge(activeChallenge)?`<p id="daily-result-streak">Medal streak: ${dailyStreak(profile.daily)} · today's best medal: ${MEDALS[profile.daily?.[activeChallenge.id.slice(DAILY_PREFIX.length)]?.medal??0]??'none'}</p>`:''}<p>${profileStorageWarning}</p><button id="challenge-retry" class="primary">RETRY CHALLENGE ↗</button><button id="challenge-board" class="small-button">${careerRun?'CAREER BOARD':isDailyChallenge(activeChallenge)?'TODAY\'S EVENT':'CHALLENGE BOARD'}</button><button id="challenge-menu" class="small-button">RETURN TO QUARRY</button></section></div>`;
    studioButtons(ui.querySelector('.challenge-result'));
    ui.querySelector<HTMLButtonElement>('#challenge-retry')!.onclick=()=>{void start(false);};
    ui.querySelector<HTMLButtonElement>('#challenge-board')!.onclick=()=>{const discipline=activeChallenge!.discipline,returnToCareer=careerRun,daily=isDailyChallenge(activeChallenge);createCars(true);menu();if(daily)openDaily();else if(returnToCareer)openCareer(discipline);else openProfile(discipline);};
    ui.querySelector<HTMLButtonElement>('#challenge-menu')!.onclick=()=>{createCars(true);menu();};
    return;
  }
  saved.best ??= {};
  const score =
    mode === 'derby' ? scoreDerby()?combat.points(cars[0].id):cars[0].inflicted : raceTimeLimit()?timedRaceRecordScore(cars[0]):elapsed + cars[0].penalty;
  const category=arenaRecordKey(difficultyRecordKey(pursuit?`chase:${activeVenue.course.id}:${raceDirection()}:${raceLaps()}:${cars.length}${pursuitRecordSuffix(pursuit,0)}`:raceTimeLimit()?`timed-race:${activeVenue.course.id}:${eventOptions.direction}:${raceTimeLimit()}:${cars.length}`:mode==='race'?`race:${activeVenue.course.id==='quarry-v1'?'':activeVenue.course.id+':'}${raceFormat()==='laps'?(customEvent()?eventOptions.direction:'forward'):raceFormat()}:${raceLaps()}:${cars.length}`:scoreDerby()?`${derbyRecordPrefix(derbyFormat(),!!combat.rivals,combat.feats.graded)}:${eventDuration()}:${cars.length}`:mode,drivers.difficulty),mode==='derby'?activeVenue.arenaId:undefined);
  const bestKey=customEvent()&&mode!=='playground'?damageRecordKey(classRecordKey(gridRecordKey(category,kind,eventOptions.lineup,eventOptions.performance),eventOptions.classLimit),damageRule()):category;
  if (
    !online?.active && !eliminationRace() && !(mode==='race'&&raceFormat()==='random') && (pursuit?pursuitTeamWon(pursuit,cars[0].id):(mode !== 'race' || cars[0].finished)) &&
    (!saved.best[bestKey] ||
      (mode === 'derby'||raceTimeLimit() ? score > saved.best[bestKey] : score < saved.best[bestKey]))
  )
    saved.best[bestKey] = score;
  persist();
  if (!online?.active && !pursuit && cars[0].health <= 0 && !scoreDerby() && !(raceTimeLimit()&&cars[0].finished) && !eliminationRace()) {
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
    const cause=causeOf(player),byId=wreckedBy.get(player.id),by=byId===undefined?undefined:cars.find(c=>c.id===byId);
    ui.innerHTML = '<div class="wreck-note"><strong>WRECKED OUT'+(cause&&cause!=='WRECKED'?' · '+cause:'')+(by?` · BY #${by.id+1} ${DEFINITIONS[by.kind].name}`:'')+'</strong><span>DRAG TO LOOK AROUND &middot; SCROLL TO ZOOM</span><span>RETURNING TO QUARRY IN <b id="wreck-count">5</b></span></div>';
    return;
  }
  ui.innerHTML = `<div class="overlay"><div class="dialog"><div class="eyebrow">${pursuit?'CHASE · ':''}${eventLabel()} / RESULTS${customEvent()&&mode!=='playground'?' · '+AI_DIFFICULTIES[drivers.difficulty].label.toUpperCase()+' AI':''}</div><h2>${title}</h2>${customEvent()&&mode!=='playground'?`<p>${GRID_LINEUPS[eventOptions.lineup??'mixed']} · ${GRID_PERFORMANCE[eventOptions.performance??'open']} · ${classLimitLabel(eventOptions.classLimit)} · ${DAMAGE_RULES[damageRule()].label}</p>`:''}<p>${pursuit?(pursuitTeamWon(pursuit,cars[0].id)?'YOUR TEAM WINS':'YOUR TEAM LOSES'):'Placed '+rank+' of '+cars.length} · ${Math.ceil(cars[0].health)}% condition<br>${pursuit?formatTime(elapsed)+' chase · No recoveries':mode === 'derby' ? scoreDerby()?combat.points(cars[0].id)+' points · '+combat.get(cars[0].id).knockouts+' knockouts · '+(combat.get(cars[0].id).spins??0)+' spin-outs · '+(combat.get(cars[0].id).bonus??0)+' bonus points'+(combat.get(cars[0].id).rivalHits?' · '+combat.get(cars[0].id).rivalHits+' rival hits':''):Math.round(cars[0].inflicted) + ' damage inflicted'+(!online?.active&&playerTopSpeed>=1?' · top speed '+Math.round(playerTopSpeed*3.6)+' km/h':'')+(combat.rivals?' · '+(combat.get(cars[0].id).bonus??0)+' bonus points · '+(combat.get(cars[0].id).rivalHits??0)+' rival hits':'') : raceTimeLimit()?timedRaceResult(cars[0])+' · '+formatTime(raceTimeLimit())+' timed race':cars[0].finished?formatTime(cars[0].finishTime)+' including recovery penalties':cars[0].health<=0?'RETIRED · CAR WRECKED':'DNF · RACE NOT FINISHED'}</p>${ordered.map((c, i) => `<div class="results-row ${isPlayer(c) ? 'player' : ''}"><span>${pursuit?(pursuit.role(c.id)==='runner'?'RUNNER':'PURSUER'):String(i + 1).padStart(2, '0')} &nbsp; ${resultDriverLabel(displayedDriver(c),isPlayer(c))}</span><span>${pursuit?(pursuit.role(c.id)==='runner'?(pursuit.result(c.id)?.outcome==='escaped'?'ESCAPED · '+formatTime(c.finishTime):c.health<=0?'WRECKED':'TIME EXPIRED'):Math.ceil(c.health)+'% CONDITION'):mode === 'derby' ? scoreDerby()?combat.points(c.id)+' PTS':c.health<=0&&causeOf(c)?causeOf(c)+(wreckedBy.has(c.id)?` · BY ${wreckedBy.get(c.id)===cars[0]?.id&&!demo?'YOU':'#'+(wreckedBy.get(c.id)!+1)}`:''):Math.ceil(c.health) + '%' : raceTimeLimit()?timedRaceResult(c):c.finished ? formatTime(c.finishTime) : (c.health<=0?causeOf(c)??'RETIRED':'DNF')+' · '+(waypointRace?'STATIONS '+c.passed:'LAP '+Math.min(raceLaps(), c.lap))}</span></div>`).join('')}<p class="award-summary">${awardText(lastAward)}</p>${victimsLine()}${stuntsLine()}${badgeLine()}<button class="primary" id="again">RUN IT BACK ↗</button><button class="small-button" id="back">RETURN TO QUARRY</button></div></div>`;
  if(teamRace())ui.querySelector('.dialog h2')?.insertAdjacentHTML('afterend',`<p class="team-result">${teamVerdict(currentTeamScores(),demo?undefined:0)}</p>`);
  if(!demo&&!online?.active&&!pursuit&&mode==='race'&&cars[0].finished&&cars.length>=2)globalScoresButton(ui.querySelector('.dialog'),{rank,field:cars.length,condition:Math.max(0,Math.min(100,cars[0].health)),course:activeVenue.course.id});
  if(!online?.active&&!pursuit&&(mode==='race'||mode==='derby')){const name=(id:number)=>{const c=cars.find(v=>v.id===id);return c?`#${id+1} ${DEFINITIONS[c.kind].name}`:`#${id+1}`;};const order=mode==='race'?rankRace().map(c=>c.id):[],list=eventAwards.awards(mode,cars.map(c=>({id:c.id,inflicted:c.inflicted,health:c.health,partsGone:c.extendedDamage?majorPartsGone(c):undefined})),order),nemesis=eventAwards.nemesis(cars[0].id,cars,mode,order);if(nemesis)list.push(nemesis);const html=awardsHtml(list,name,cars[0].id);if(html)ui.querySelector('.dialog button')?.insertAdjacentHTML('beforebegin',html);}
  if(!demo&&!online?.active&&cars[0]?.extendedDamage&&(mode==='race'||mode==='derby')){const p=cars[0];ui.querySelector('.dialog h2')?.insertAdjacentHTML('afterend',`<p class="wreck-report">${wreckReport({rolls:p.rolls,wheelsLost:p.wreckParts.wheelLost.reduce((n,v)=>n+v,0),partsGone:p.panels.reduce((n,m)=>n+(m.visible?0:1),0),engineDamage:p.engineDamage,structure:p.structuralDamage,health:p.health,shedKg:p.shedKg})}</p>`+(()=>{const m=mechanicalReport({engineOut:p.engineOut,tank:p.tankGone?'gone':p.tankDown?'down':undefined,throttleCable:p.throttleCable,handbrakeCable:p.handbrakeCable,batteryOut:p.batteryOut,rodThrown:p.rodThrown,exhaustCrushed:p.exhaustCrushed&&!p.exhaustGone,seized:p.seized,outOfFuel:p.fuelLevel<=.005,diffBroken:p.diffWear>=1,tieRods:p.steerLink.filter(v=>v===0).length,gearsLost:5-p.gearLimit,clutchSlipping:p.clutchGrip<.8,shafts:p.driveBias.filter((v,i)=>v===0&&!p.wreckParts.wheelLost[i]).length,springs:p.springBias.filter(v=>v<1).length,brakesBinding:p.brakeDrag.filter(v=>v>0).length,electrical:p.electricalFault>0,exhaust:p.exhaustBlow>0,wheelsLoose:p.nutLoose.filter((v,i)=>v>=.35&&!p.wreckParts.wheelLost[i]).length,rubbing:p.rubDrag.filter(v=>v>=.25).length,steeringFailed:p.steerRate<1,brakeFluidLow:p.brakeFluid<.7,overheating:p.coolantLevel<.3,oilLow:p.oilLevel<.25&&!p.seized,sumpCracked:p.sumpCrack>0,exhaustGone:p.exhaustGone,frameBent:p.frameBend!==0,radiatorBurst:p.radiatorBursts>0,rollBars:p.rollBar.filter(v=>v===0).length,propshaft:p.propSnapped?'snapped':p.propBend>=.12?'bent':undefined,steerSkew:p.steerSkew,engineFire:p.engineFires>0||p.smashFires>0,belt:p.beltSnapped?(p.battery<=0?'flat':'snapped'):p.beltSlip>=.3?'slipping':undefined,bearing:p.bearingWear.some(v=>v>=1)?'seized':p.bearingWear.some(v=>v>=.2)?'worn':undefined,brakeFire:p.brakeFires>0,rubFire:p.rubFires>0,throttleJammed:p.throttleJammed,doorsTorn:p.doorsTorn});return m?`<p class="wreck-report">${m}</p>`:'';})());}
  studioButtons(ui.querySelector('.dialog'));replayBiggestHit(ui.querySelector('.dialog'));highlightsButton(ui.querySelector('.dialog'));
  document.querySelector<HTMLButtonElement>('#again')!.onclick = () => start();
  document.querySelector<HTMLButtonElement>('#back')!.onclick = () => {
    if(online?.active){leaveOnline();return;}
    createCars(true);
    menu();
  };
  if(online?.active && !online.network.isHost){const b=document.querySelector<HTMLButtonElement>('#again')!;b.disabled=true;b.textContent='WAITING FOR HOST REMATCH';}
}
/** An open door that meets another car, a wall or a prop along its length is torn off (offline). */
function catchOpenDoors(){
  for(const c of cars)for(const {name,from,to} of [...c.openDoorSpans(),...c.mirrorSpans()]){
    const dir=to.clone().sub(from),length=dir.length();if(length<.1)continue;dir.divideScalar(length);
    const hit=physics.castRay(new R.Ray(from,dir),length,true,R.QueryFilterFlags.EXCLUDE_SENSORS,undefined,undefined,c.body,h=>cars.some(v=>v!==c&&v.body.handle===h.parent()?.handle)||(activeVenue.course.isDrivingObstacle?.(h)??true));
    if(!hit)continue;
    // Not the ground under a door on a bank or a bump.
    const at=from.clone().addScaledVector(dir,hit.timeOfImpact);if(at.y-c.groundAt(at.x,at.z)<.25)continue;
    // A wing mirror clipped by a passing car: off it comes, a small crack, and the player hears about it.
    if(name.startsWith('mirror')){if(c.ripAssembly(name)){mirrorsClipped++;if(!sound.clip('mirror-snap',at,.8,.6))sound.impact(4,at,true,true,'metal');const by=cars.find(v=>v!==c&&v.body.handle===hit.collider.parent()?.handle);
      if(by?.id===0&&!demo)toast(`MIRROR CLIPPED · #${c.id+1} ${DEFINITIONS[c.kind].name}`,1.2,1);else if(c.id===0&&!demo&&by)toast('MIRROR CLIPPED',1.2,1);}continue;}
    if(c.ripAssembly(name)){c.doorsTorn++;sound.impact(7,at,false,true,'metal');
      // Torn off by another car: that driver gets the credit.
      const by=cars.find(v=>v!==c&&v.body.handle===hit.collider.parent()?.handle);
      if(by){if(mode==='derby'){derbyFeed.note(by.id,displayedDriver(by),'door',elapsed);if(scoreDerby())scoreStunt(by.id,DESTRUCTION_POINTS.door);}
        if(by.id===0&&!demo)toast(`DOOR OFF · #${c.id+1} ${DEFINITIONS[c.kind].name}`+pointsTag(DESTRUCTION_POINTS.door),1.3,1);}}
  }
}
/** QA: force the late-derby frenzy factor (undefined = by the cars left running). */
let frenzyOverride:number|undefined;
function step(dt: number) {
  if(online?.active)return;
  // The last few cars running go at it harder (offline derbies).
  drivers.frenzy=mode==='derby'&&cars[0]?.extendedDamage?frenzyOverride??Math.max(frenzyFactor(cars.filter(c=>c.health>0).length),scoreDerby()&&finalStunts(eventRemaining())?FRENZY.factor:1):1;
  // Scored derbies (offline): the last seconds score stunts double, called out once.
  if(scoreDerby()&&cars[0]?.extendedDamage&&!finalStuntsCalled&&finalStunts(eventRemaining())){finalStuntsCalled=true;if(!demo){toast(`FINAL ${FINAL_STUNTS.window} · STUNTS SCORE DOUBLE`,2.4,3);sound.crowd(1);crowdFlashes(SMASH_FLASHES);}}
  // Scored derbies (offline): everyone goes for the points leader; the player hears about it on taking the lead.
  {const leader=scoreDerby()&&cars[0]?.extendedDamage?pointsLeader(cars.map(c=>({id:c.id,points:combat.points(c.id),running:c.health>0}))):-1;
    if(leader===0&&drivers.leader!==0&&!demo&&elapsed-targetToastAt>=HUNT_TOAST){targetToastAt=elapsed;toast("YOU'RE THE TARGET",1.8,1);}drivers.leader=leader;}
  if (state === 'countdown') {
    countdown -= dt;
    if (countdown <= 0) {
      state = 'playing';
      toast(mode === 'derby' ? 'MAKE AN IMPACT' : 'GREEN LIGHT', 2);
      // The arena horn sounds the start of a derby heat.
      if(mode==='derby'&&!demo){if(sound.arenaHorn(hornHeats))hornHeats++;}
    }
    return;
  }
  {const dusk=eventLighting==='dusk',wet=eventLighting==='rain';for(const c of cars){const l=carLights.get(c);if((dusk||wet)&&l&&c.extendedDamage){const a=headlightAim(c.structuralDamage?.[0]??0,c.structuralDamage?.[2]??0,c.structuralDamage?.[3]??0);l.aim(a.yaw,a.reach);}}
  // In the rain drivers run their lamps too (offline), the pool on the road fainter against the daylight, the beams
  // showing in the rain.
  for(const c of cars)carLights.get(c)?.set((dusk||wet&&c.extendedDamage)&&c.health>0&&!c.electricalCut&&!c.batteryOut&&(!c.beltSnapped||batteryLights(c.battery,clock,c.id)),c.health>0&&!c.electricalCut&&!c.batteryOut&&(c.input?.brake??0)>.2&&Math.abs(c.speed)>1,dusk?1:RAIN_LIGHTS.pool,wet&&c.extendedDamage?RAIN_BEAMS.strength:0);}
  if (state !== 'playing') return;
  elapsed += dt;
  if(mode==='race'&&!eventAwards.started&&elapsed>.5&&!online?.active)eventAwards.grid(rankRace().map(c=>c.id));
  if(eliminationRace()&&elapsed>=nextEliminationAt){nextEliminationAt+=ELIMINATION_INTERVAL;const out=nextElimination(rankRace().filter(c=>!c.finished&&c.health>0).map(c=>c.id)),car=out===null?undefined:cars.find(c=>c.id===out);
    if(car){eliminatedOrder.push(car.id);const dir=new T.Vector3(0,-1,0);car.hit(car.current.clone().add(car.forward.clone().multiplyScalar(1.4)).setY(car.current.y+.6),dir,(car.health+5)/Math.max(.05,car.specification.damageScale),elapsed,true);toast(car.id===cars[0].id&&!demo?'ELIMINATED · LAST PLACE':`ELIMINATED · #${car.id+1} ${DEFINITIONS[car.kind].name}`,2.5);if(car.id===cars[0].id&&!demo){finish('ELIMINATED');return;}}}
  if(eliminationRace()&&!cars.some(c=>c.finished)){const running=cars.filter(c=>c.health>0);if(running.length<=1){finish(demo?'RACE COMPLETE':running[0]?.id===cars[0].id?'LAST CAR RUNNING':'ELIMINATION COMPLETE');return;}}
  if(demo||autopilot||testInput){telemetry=null;if(activeTimeTrial)timeTrialInvalidReason='ASSISTED OR TEST INPUT';}
  for (const c of cars) {
    c.input = pursuit&&(c.health<=0||pursuit.result(c.id)?.outcome==='escaped')?{throttle:0,steer:0,brake:1,handbrake:false}:raceTimeLimit()&&c.id===0&&c.finished&&!demo ? ai(c,dt) : c.id===0&&activeClubRound!==null&&clubPlayerStopped ? clubRetired||!c.finished?{throttle:0,steer:0,brake:1,handbrake:false}:ai(c,dt) : c.id === 0 && !autopilot && !demo ? input() : ai(c, dt);
    c.preStep(dt);
  }
  const scoreMotion=mode==='derby'?cars.map(c=>combatMotion(c.id,c.current,c.currentQ,c.velocity,c.body.angvel().y,c.health,[0,1,2,3].filter(i=>c.controller.wheelIsInContact(i)).length)):[];
  if(mode==='derby')combat.sample(scoreMotion,elapsed);
  const collisionMotion=captureCollisionMotion(physics);
  if(bumperLocks.length||bumperTethers.length)guardJoints();
  physics.step(events);
  for (const c of cars) c.postStep(dt, elapsed);
  if(!online?.active)catchOpenDoors();
  if(activeTimeTrial)trialGhostRecorder?.sample(elapsed,cars[0].current,cars[0].currentQ);
  const contacts: (ImpactContact & {a?:Vehicle;b?:Vehicle;point:T.Vector3;point1:T.Vector3;point2:T.Vector3;normal:T.Vector3;va:T.Vector3;vb:T.Vector3;scarDirection:T.Vector3;speed:number;material:ImpactMaterial})[]=[];
  events.drainContactForceEvents((e) => {
    const h1=e.collider1(),h2=e.collider2(),{a,b,key}=vehicleContact(physics,cars,h1,h2);
    if(!a&&!b)return;
    const point=new T.Vector3().copy((a??b)!.current),normal=new T.Vector3();
    const manifold=vehicleContactManifold(physics,h1,h2);
    if(manifold){point.copy(manifold.point);normal.copy(manifold.normal);}
    const point1=new T.Vector3().copy(manifold?.point1??point),point2=new T.Vector3().copy(manifold?.point2??point);
    const va=new T.Vector3().copy(collisionPointVelocity(physics,collisionMotion,h1,point1)),vb=new T.Vector3().copy(collisionPointVelocity(physics,collisionMotion,h2,point2));
    const relative=vb.clone().sub(va),closing=normal.lengthSq()>.5?Math.abs(relative.dot(normal)):relative.length();
    const scarDirection=relative.clone(),speed=scarDirection.length();
    scarDirection.normalize();
    // Flying parts hurt what they hit (offline): a piece of debris striking a car fast enough dents and damages it.
    if(!online?.active&&!!a!==!!b){const car=(a??b)!,parent=physics.getCollider(a?h2:h1)?.parent(),piece=parent?fx.debris.find(d=>d.body.handle===parent.handle):undefined;
      if(piece&&car.extendedDamage&&car.health>0){const damage=shrapnelDamage(piece.body.mass(),speed),k=car.id*65536+parent!.handle;
        if(damage>0&&elapsed-(shrapnelAt.get(k)??-1e9)>=SHRAPNEL.gap){shrapnelAt.set(k,elapsed);shrapnelHits++;
          car.hit(point.clone(),(a?scarDirection.clone():scarDirection.clone().negate()),damage,elapsed,false);
          if(car.id===0&&!demo&&damage>=SHRAPNEL.toast)toast('HIT BY FLYING DEBRIS',1.2,1);}}}
    contacts.push({key,point,point1,point2,normal,va,vb,a,b,scarDirection,speed,closing,material:a&&b?'metal':colliderImpactMaterial(physics,a?h2:h1,activeVenue.root.userData.solidRecords),impulse:e.totalForceMagnitude()*dt,
      damageScale:Math.max(a&&a.health>0?a.specification.damageScale:0,b&&b.health>0?b.specification.damageScale:0)});
  });
  sound.contactScraping.sample(contacts,elapsed);
  if(!online?.active){pinCars(contacts,dt);stepLocks(dt);stepTethers(dt);}
  for(const c of cars)if(c.health<=0&&!wreckCauses.has(c.id)&&c.extendedDamage&&causeOf(c)==='BURNT OUT'){const by=cars.find(v=>v.id===alightBy.get(c.id));
    if(by&&mode==='derby'){derbyFeed.note(by.id,displayedDriver(by),'burnt',elapsed);if(scoreDerby())scoreStunt(by.id,DESTRUCTION_POINTS.burnt);}
    if(by?.id===0&&!demo)toast(`BURNT OUT · #${c.id+1} ${DEFINITIONS[c.kind].name}`+pointsTag(DESTRUCTION_POINTS.burnt),2,2);}
  for(const c of cars)if(c.health<=0)causeOf(c);
  // A car sitting on top of another (after a ride-up) crushes it under its weight; the one on top is credited once (offline).
  if(!online?.active)for(const c of cars)c.underWeight=0;
  if(!online?.active)for(const s of cars){if(!s.extendedDamage||s.health<=0||s.inverted>0)continue;
    for(const o of cars){if(o===s||!o.extendedDamage||o.health<=0)continue;const key=s.id*64+o.id;
      const up=s.current.y-o.current.y,apart=Math.hypot(s.current.x-o.current.x,s.current.z-o.current.z);
      if(!(up>ON_TOP.above&&apart<ON_TOP.reach)){onTop.delete(key);continue;}
      const st=onTop.get(key)??{t:0,dent:0,credited:false};st.t+=dt;st.dent+=dt;onTop.set(key,st);
      o.underWeight=Math.max(o.underWeight,st.t);
      const face=crushedFace(alongCar(s.current,o.current,o.forward,DEFINITIONS[o.kind].halfLength));
      if(o.structuralDamage)o.structuralDamage[face]=Math.min(1,o.structuralDamage[face]+ON_TOP.crush*dt);
      if(st.dent>=ON_TOP.dent){st.dent=0;const under=s.current.clone();under.y-=.35;o.hit(under,new T.Vector3(0,-1,0),ON_TOP.dentDamage,elapsed,true);lastHitBy.set(o.id,{by:s.id,at:elapsed});}
      if(st.t>=ON_TOP.credit&&!st.credited){st.credited=true;mounts++;
        if(s.id===0&&!demo){toast(`ON TOP · #${o.id+1} ${DEFINITIONS[o.kind].name}`+pointsTag(DESTRUCTION_POINTS.ontop),2,2);sound.crowd(.8);crowdFlashes(SMASH_FLASHES);}
        else if(o.id===0&&!demo){toast(`#${s.id+1} IS ON TOP OF YOU · ROCK IT OFF`,2,2);sound.crowd(.6);}
        if(mode==='derby'&&scoreDerby())scoreStunt(s.id,DESTRUCTION_POINTS.ontop);}}}
  // Rolled onto its roof by the last car to hit it (offline).
  if(!online?.active)for(const c of cars){if(c.inverted===0){rollArmed.add(c.id);continue;}
    const by=rolledBy(c.inverted,rollArmed.has(c.id),lastHitBy.get(c.id),elapsed);if(by<0)continue;rollArmed.delete(c.id);const attacker=cars.find(x=>x.id===by);if(!attacker)continue;
    eventAwards.rolled(attacker.id,c.id,elapsed);
    if(attacker.id===0&&!demo){toast(`ROLLED IT · #${c.id+1} ${DEFINITIONS[c.kind].name}`+pointsTag(DESTRUCTION_POINTS.rolled),2,2);sound.crowd(.9);crowdFlashes(SMASH_FLASHES);}
    else if(c.id===0&&!demo){toast(`ROLLED BY #${attacker.id+1} ${DEFINITIONS[attacker.kind].name}`,2,2);sound.crowd(.7);}
    if(mode==='derby'){derbyFeed.note(attacker.id,displayedDriver(attacker),'rolled',elapsed);if(scoreDerby())scoreStunt(attacker.id,DESTRUCTION_POINTS.rolled);}}
  // The derby feed calls out every car shed down to STRIPPED.first major parts (offline).
  if(!online?.active&&mode==='derby')for(const c of cars)if(c.health>0&&!strippedNoted.has(c.id)&&majorPartsGone(c)>=STRIPPED.first){strippedNoted.add(c.id);derbyFeed.note(c.id,displayedDriver(c),'stripped',elapsed);}
  // The player's car stripped down to the shell and still running (offline).
  if(!online?.active&&!demo&&cars[0]){const gone=majorPartsGone(cars[0]),label=cars[0].health>0?strippedLabel(playerStripped,gone):'';if(label){toast(label,2,2);sound.crowd(.7);}playerStripped=gone;}
  for(const {a,b,point1,point2,scarDirection,speed,material} of collisionScars.adjudicate(contacts,elapsed)){
    // Metal grinding on metal or concrete throws sparks along the scrape.
    if(speed>4&&(material==='metal'||material==='concrete'))fx.emit(point1,Math.min(4,Math.ceil(speed/6)),1,.85);
    a?.scar(point1,scarDirection,b?.paintColor);
    b?.scar(point2,scarDirection.clone().negate(),a?.paintColor);
  }
  for(const {contact:{a,b,point,point1,point2,va,vb,impulse,material,closing},damage,feedback} of impactAdjudicator.adjudicate(contacts,elapsed,collisionDamageMultiplier(mode==='race'&&!bangerRace(),damageRule()),online?.active?undefined:impactSpeedFactor,IMPACT_SPEED.cap)){
    // A feedback-only contact still clears stale glass/debris flags in hit().
    const smashLoss={a:0,b:0};
    // A fast ram nose-first into the end of another car climbs onto it (offline).
    if(!online?.active&&a&&b&&a.extendedDamage&&b.extendedDamage&&a.health>0&&b.health>0){const side=(c:Vehicle)=>({c:c.current,f:c.forward,v:c.velocity,half:DEFINITIONS[c.kind].halfLength});
      const who=rammer(closing,side(a),side(b),point);const s=who===0?a:who===1?b:null;
      if(s&&elapsed-(rideAt.get(s.id)??-1e9)>=RIDE.gap&&ridesUp(s.id*131+(who===0?b.id:a.id)*17+Math.floor(elapsed))){rideAt.set(s.id,elapsed);rideUps++;
        const nose=s.forward.clone().multiplyScalar(DEFINITIONS[s.kind].halfLength*.7).add(s.current);s.body.applyImpulseAtPoint({x:0,y:s.body.mass()*RIDE.lift,z:0},{x:nose.x,y:nose.y,z:nose.z},true);
        // The player's own ride-up plays out in slow motion with the steel grinding, like a big smash.
        if(!demo&&(a.id===0||b.id===0)){if(clock>=slowMoUntil){slowMoUntil=clock+RIDE_SLOWMO.seconds;slowMoScale=RIDE_SLOWMO.scale;}sound.clip('metal-groan',nose,.8,1.2);recordRumbleImpact(.8);}}
      // A fast T-bone lifts the struck side, so the car rolls away from the hit (offline).
      const tb=tBoner(closing,side(a),side(b),point),hitter=tb===0?a:tb===1?b:null,victim=tb===0?b:tb===1?a:null;
      if(hitter&&victim&&elapsed-(tipAt.get(victim.id)??-1e9)>=TIP.gap&&tipsOver(victim.id*97+hitter.id*13+Math.floor(elapsed))){tipAt.set(victim.id,elapsed);tipOvers++;
        const flank=Math.sign((hitter.current.x-victim.current.x)*victim.right.x+(hitter.current.z-victim.current.z)*victim.right.z)||1;
        const sill=victim.right.clone().multiplyScalar(flank*DEFINITIONS[victim.kind].halfWidth*.9).add(victim.current);sill.y-=.25;
        victim.body.applyImpulseAtPoint({x:0,y:victim.body.mass()*tipLift(closing),z:0},{x:sill.x,y:sill.y,z:sill.z},true);}}
    // Who had hurt the player most before this contact (a mutual crash must not count as revenge for itself).
    const rivalBefore=!online?.active&&a&&b&&(a.id===0||b.id===0)?eventAwards.rivalOf(0):null;
    // Weight matters (offline): the lighter car takes the larger share of a car-to-car crash.
    const [shareA,shareB]=!online?.active&&a&&b?[massShare(a.body.mass(),b.body.mass()),massShare(b.body.mass(),a.body.mass())]:[1,1];
    // Who had last knocked each car (a real hit) before this contact (for DOMINO: knocked into a third car).
    const priorA=a?knockedBy.get(a.id):undefined,priorB=b?knockedBy.get(b.id):undefined;
    const tankInA=!a?.tankDown,tankInB=!b?.tankDown;
    const pitsA=a?.pitSpins??0,pitsB=b?.pitSpins??0,engineInA=!a?.engineOut,engineInB=!b?.engineOut,wingsA=a?.wingsTorn??0,wingsB=b?.wingsTorn??0;
    if(a){
      const before=a.health;
      const strippedA=stripCount(a);a.collisionHit(point1,vb.clone().sub(va).normalize(),sharedDamage(damage,shareA),elapsed,b?.paintColor,closing);if(b)creditStrip(b,a,strippedA);
      if(b){b.inflicted+=before-a.health;const wreck=eventAwards.hit(b.id,a.id,before-a.health,before>0&&a.health<=0,elapsed,closing);if(wreck)wreckedBy.set(a.id,b.id);if(wreck&&!online?.active&&closing>=WRECK_BURST.closing)a.wreckBurst(a.current.clone().sub(b.current));if(wreck)sound.crowd(b.id===0?1:.7);if(wreck&&b.id===0&&!demo&&!online?.active){slowMoUntil=clock+TAKEDOWN_SLOWMO.seconds;slowMoScale=TAKEDOWN_SLOWMO.scale;crowdFlashes(TAKEDOWN_FLASHES);}else if(before-a.health>=12)sound.crowd(b.id===0?.6:.4);if(wreck&&b.id===0){callout('TAKEDOWN',a);playerTakedown();}else if(b.id===0&&before-a.health>=12)callout('BIG HIT',a);combat.hit(b.id,a.id,before,a.health,elapsed);if(mode==='derby')combat.contact(scoreMotion[b.id],scoreMotion[a.id],before-a.health,elapsed);}
      if(b?.id===0)telemetry?.impact(a.id,before,a.health);
      smashLoss.a=before-a.health;
      if(b?.id===0&&before<=0)hitTheWreck(closing);
    }
    if(b){
      const before=b.health;
      const strippedB=stripCount(b);b.collisionHit(point2,va.clone().sub(vb).normalize(),sharedDamage(damage,shareB),elapsed,a?.paintColor,closing);if(a)creditStrip(a,b,strippedB);
      if(a){a.inflicted+=before-b.health;const wreck=eventAwards.hit(a.id,b.id,before-b.health,before>0&&b.health<=0,elapsed,closing);if(wreck)wreckedBy.set(b.id,a.id);if(wreck&&!online?.active&&closing>=WRECK_BURST.closing)b.wreckBurst(b.current.clone().sub(a.current));if(wreck)sound.crowd(a.id===0?1:.7);if(wreck&&a.id===0&&!demo&&!online?.active){slowMoUntil=clock+TAKEDOWN_SLOWMO.seconds;slowMoScale=TAKEDOWN_SLOWMO.scale;crowdFlashes(TAKEDOWN_FLASHES);}else if(before-b.health>=12)sound.crowd(a.id===0?.6:.4);if(wreck&&a.id===0){callout('TAKEDOWN',b);playerTakedown();}else if(a.id===0&&before-b.health>=12)callout('BIG HIT',b);combat.hit(a.id,b.id,before,b.health,elapsed);if(mode==='derby')combat.contact(scoreMotion[a.id],scoreMotion[b.id],before-b.health,elapsed);}
      if(a?.id===0)telemetry?.impact(b.id,before,b.health);
      smashLoss.b=before-b.health;
      if(a?.id===0&&before<=0)hitTheWreck(closing);
    }
    // Engine out: the block dropped out of a car in this crash (offline).
    if(!online?.active)for(const [car,was] of [[a,engineInA],[b,engineInB]] as const)if(car&&was&&car.engineOut)eventAwards.failure(car.id,'ENGINE OUT',elapsed,34);
    if(!online?.active&&!demo)for(const [car,was,other] of [[a,engineInA,b],[b,engineInB,a]] as const)if(car&&was&&car.engineOut&&(car.id===0||other?.id===0)){toast(car.id===0?'ENGINE OUT':`ENGINE OUT · #${car.id+1} ${DEFINITIONS[car.kind].name}`+pointsTag(DESTRUCTION_POINTS.engine),2.6,3);sound.crowd(1);crowdFlashes(SMASH_FLASHES);}
    if(damage>0&&a&&b){lastHitBy.set(a.id,{by:b.id,at:elapsed});lastHitBy.set(b.id,{by:a.id,at:elapsed});}
    // Four or more cars into each other at once: a PILE-UP, credited to whoever went in fastest first (offline).
    if(!online?.active&&a&&b){const call=pileUp.note(a.id,b.id,elapsed,point.x,point.z,Math.abs(a.speed)>=Math.abs(b.speed)?a.id:b.id,closing),starter=call?cars.find(c=>c.id===call.starter):undefined;
      if(call&&starter){pileUps++;biggestPileUp=Math.max(biggestPileUp,call.size);eventAwards.pileUp(starter.id,call.size,elapsed);sound.crowd(1);crowdFlashes(SMASH_FLASHES);
        if(mode==='derby'){derbyFeed.note(starter.id,displayedDriver(starter),'pileup',elapsed,call.size);if(scoreDerby())scoreStunt(starter.id,PILEUP.points*call.size);}
        if(!demo&&call.cars.includes(cars[0]?.id??-1)){toast(`PILE-UP ×${call.size}`+(starter.id===cars[0].id?pointsTag(PILEUP.points*call.size):''),2,3);if(clock>=slowMoUntil){slowMoUntil=clock+SMASH.slowmo;slowMoScale=SMASH.scale;}}}}
    // Fuel tank down: the rival whose hit dropped it is credited, and a car later out of fuel is theirs (offline).
    if(!online?.active&&a&&b)for(const [victim,attacker,was] of [[a,b,tankInA],[b,a,tankInB]] as const){if(!was||!victim.tankDown)continue;tankBy.set(victim.id,attacker.id);eventAwards.tanked(attacker.id,victim.id,elapsed);
      if(mode==='derby'){derbyFeed.note(attacker.id,displayedDriver(attacker),'tank',elapsed);if(scoreDerby())scoreStunt(attacker.id,DESTRUCTION_POINTS.tank);}
      if(!demo&&attacker.id===0)toast(`TANK DOWN · #${victim.id+1} ${DEFINITIONS[victim.kind].name}`+pointsTag(DESTRUCTION_POINTS.tank),2,2);}
    // Domino: knocked by a rival into a third car hard; the rival gets the credit for the chain (offline).
    if(!online?.active&&a&&b)for(const [mover,struck,prior,loss] of [[a,b,priorA,smashLoss.b],[b,a,priorB,smashLoss.a]] as const){
      const by=loss>=DOMINO.big&&closing>=DOMINO.closing?dominoBy(prior,mover.id,struck.id,elapsed):-1,starter=by>=0?cars.find(c=>c.id===by):undefined;if(!starter)continue;dominoes++;eventAwards.dominoed(starter.id,struck.id,elapsed);
      if(mode==='derby'){derbyFeed.note(starter.id,displayedDriver(starter),'domino',elapsed);if(scoreDerby())scoreStunt(starter.id,DESTRUCTION_POINTS.domino);}
      if(!demo&&starter.id===0){toast(`DOMINO · #${mover.id+1} INTO #${struck.id+1}`+pointsTag(DESTRUCTION_POINTS.domino),1.8,2);sound.crowd(.8);}}
    if(!online?.active&&a&&b){if(smashLoss.a>=DOMINO.knock)knockedBy.set(a.id,{by:b.id,at:elapsed});if(smashLoss.b>=DOMINO.knock)knockedBy.set(b.id,{by:a.id,at:elapsed});}
    // A hanging bumper can hook the two cars together (offline).
    if(!online?.active&&a&&b)tryLock(a,b,point1,point2,closing);
    // Wall slam: a car knocked into the scenery just after a rival hit it; the rival is credited with that damage (offline).
    if(!online?.active&&!!a!==!!b){const victim=(a??b)!,lost=a?smashLoss.a:smashLoss.b,by=slamBy(lastHitBy.get(victim.id),victim.id,elapsed),attacker=by>=0?cars.find(c=>c.id===by):undefined;
      if(attacker&&lost>0){const after=victim.health,before=after+lost;attacker.inflicted+=lost;
        const wreck=eventAwards.hit(attacker.id,victim.id,lost,before>0&&after<=0,elapsed,0);combat.hit(attacker.id,victim.id,before,after,elapsed);
        if(wreck){wreckedBy.set(victim.id,attacker.id);sound.crowd(attacker.id===0?1:.7);if(attacker.id===0&&!demo){callout('TAKEDOWN',victim);playerTakedown();}}
        if(isSlam(lost)){wallSlams++;eventAwards.slammed(attacker.id,victim.id,elapsed);if(mode==='derby'){derbyFeed.note(attacker.id,displayedDriver(attacker),'slam',elapsed);if(scoreDerby())scoreStunt(attacker.id,DESTRUCTION_POINTS.slam);}
          if(!demo&&attacker.id===0){toast(`WALL SLAM · #${victim.id+1} ${DEFINITIONS[victim.kind].name}`+pointsTag(DESTRUCTION_POINTS.slam),1.8,2);sound.crowd(.8);}
          else if(!demo&&victim.id===0)toast(`SLAMMED BY #${attacker.id+1} ${DEFINITIONS[attacker.kind].name}`,1.8,2);}}}
    // The derby feed credits whoever dropped an engine, tore a wing off or PITed a rival (offline).
    if(!online?.active&&mode==='derby'&&a&&b)for(const [victim,attacker,pits,wings,engineWas] of [[a,b,pitsA,wingsA,engineInA],[b,a,pitsB,wingsB,engineInB]] as const){
      const score=(points:number)=>{if(scoreDerby())scoreStunt(attacker.id,points);};
      if(engineWas&&victim.engineOut){derbyFeed.note(attacker.id,displayedDriver(attacker),'engine',elapsed);score(DESTRUCTION_POINTS.engine);}else if(victim.wingsTorn>wings){derbyFeed.note(attacker.id,displayedDriver(attacker),'wing',elapsed);score(DESTRUCTION_POINTS.wing*(victim.wingsTorn-wings));if(attacker.id===0&&!demo)toast(`WING OFF · #${victim.id+1} ${DEFINITIONS[victim.kind].name}`+pointsTag(DESTRUCTION_POINTS.wing*(victim.wingsTorn-wings)),1.3,1);}
      if(victim.pitSpins>pits){derbyFeed.note(attacker.id,displayedDriver(attacker),'pit',elapsed);score(DESTRUCTION_POINTS.pit);}
    }
    // PIT: the player's shove sent a rival's rear tyres sliding (offline).
    if(!online?.active&&!demo&&a&&b)for(const [victim,attacker,before] of [[a,b,pitsA],[b,a,pitsB]] as const)if(attacker.id===0&&victim.pitSpins>before)toast(`PIT · #${victim.id+1} ${DEFINITIONS[victim.kind].name}`+pointsTag(DESTRUCTION_POINTS.pit),1.4,1);
    // A smash with the player in it: a short slow-motion beat, a toast with the closing speed, the crowd (offline).
    const smashed=!online?.active&&!demo&&!!a&&!!b&&(a.id===0||b.id===0)&&isSmash(Math.max(smashLoss.a,smashLoss.b));
    if(smashed){
      if(clock>=slowMoUntil){slowMoUntil=clock+SMASH.slowmo;slowMoScale=SMASH.scale;}
      toast(smashLabel(closing)+(hangingOn(cars[0]?.health??100)?' · HANGING ON':''),1.4,2);recordRumbleImpact(1);sound.crowd(.85);crowdFlashes(SMASH_FLASHES);
    }
    // Revenge: the player's solid hit on the rival who has hurt them most (offline, once per grudge).
    if(!online?.active&&!demo&&a&&b)for(const [victim,attacker,loss] of [[a,b,smashLoss.a],[b,a,smashLoss.b]] as const){
      if(attacker.id!==0)continue;const rival=rivalBefore;
      if(revenge(rival,victim.id,loss,revengeSettled.get(victim.id))){revengeSettled.set(victim.id,eventAwards.rivalOf(0)?.damage??rival!.damage);toast(`REVENGE · #${victim.id+1} ${DEFINITIONS[victim.kind].name}`,1.8,2);sound.crowd(.8);}
    }
    if(feedback){
      collisions++;
      const severity=Math.min(28,impactAudioSeverity(impulse)*(online?.active?1:impactSoundScale(closing))),glass=!!(a?.impactEffects.glass||b?.impactEffects.glass),debris=!!(a?.impactEffects.debris||b?.impactEffects.debris);
      sound.impact(severity,point,glass,debris,material);
      recorder?.impact({time:elapsed,severity,position:point.toArray(),glass,debris,material});
      if(a?.id===0||b?.id===0)recordRumbleImpact(.12+impulse/22000);
      if((a?.id===0||b?.id===0)&&!smashed)toast(damage>12?'HEAVY IMPACT':'CONTACT',.8);
    }
  }
  if(respawningDerby())stepScoreRespawns(combat,cars,elapsed,eventDuration(),activeVenue.arena??DERBY_ARENA,id=>{drivers.memory.delete(id);telemetry?.resetOpponent(id);if(id===0)telemetry?.recover();});
  if(telemetry){const p=cars[0];telemetry.sample(dt,{speed:p.speed,lateral:p.velocity.dot(p.right),grounded:[0,1,2,3].filter(i=>p.controller.wheelIsInContact(i)).length,height:p.current.y-activeVenue.course.height(p.current.x,p.current.z)-.89,health:p.health,checkpoints:p.passed});telemetry.stats.rank=mode==='playground'?0:(mode==='derby'?derbyRanking():rankRace()).indexOf(cars[0])+1;}
  if(stuntProgress&&telemetry&&activeChallenge?.stunt){const p=cars[0];if(stuntProgress.sample(dt,{x:p.current.x,y:p.current.y,z:p.current.z,up:1-2*(p.currentQ.x*p.currentQ.x+p.currentQ.z*p.currentQ.z),grounded:[0,1,2,3].filter(i=>p.controller.wheelIsInContact(i)).length,health:p.health})){p.finished=true;p.finishTime=elapsed;finish('STUNT COMPLETE');return;}}
  for (const c of cars) {
    if (activeVenue.course.outside(c.current.x,c.current.y,c.current.z)) {
      if(pursuit){c.health=0;continue;}
      if(c.id===0&&activeChallenge){finish('OUT OF BOUNDS');return;}
      if (c.id === 0 && !demo) recover();
      else if(activeVenue!==quarryVenue&&(mode==='race'||mode==='playground')){const at=courseRecoverySlot(activeVenue.course,c.nextCheckpoint,mode==='playground'?'forward':raceDirection(c.id));c.place(at.x,at.z,at.yaw);c.penalty+=5;drivers.memory.delete(c.id);}
      else c.place(0, 0, 0);
    }
    if(mode==='playground'&&activeVenue!==quarryVenue&&c.id!==0){const check=checkRoute(raceRoute(c.id),c.current.x,c.current.z,c.nextCheckpoint,c.checkpointDistance,activeVenue.course.checkpointRadius);c.checkpointDistance=check.distance;if(check.passed){c.nextCheckpoint=(c.nextCheckpoint+1)%24;c.checkpointDistance=Infinity;}}
    if(c.id===0&&activeClubRound!==null&&clubRetired)continue;
    if(mode==='race'&&waypointRace){
      const reached=waypointRace.sample(c.id,c.current),progress=waypointRace.get(c.id);c.passed=progress.passed;c.lap=progress.round+1;
      if(reached&&c.id===0&&!demo)toast(reached.finished?'ALL STATIONS COMPLETE':reached.id===0?'ROUND COMPLETE':`STATION ${reached.id} COLLECTED`,1.2);
      if(progress.finished&&!c.finished){c.finished=true;c.finishTime=elapsed+c.penalty;if(c.id===0&&!demo){if(activeClubRound!==null)freezeClubPlayer();else finish('WAYPOINT FINISH');}}
      if(c.id===0&&!demo)c.nextCheckpoint=waypointRace.navigation(c.id,c.current,c.forward).next;
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
          if(previous!==undefined)trialGhostSplit=`GATE ${c.passed} · ${formatTrialDelta(elapsed-previous)} VS ${trialGhostLabel}`;
        }
        c.nextCheckpoint = (c.nextCheckpoint + 1) % 24;
        c.checkpointDistance = Infinity;
        if(c.finished)continue; // Keep AI rolling beyond the finish without changing its result.
        const progress=lapProgress(c.passed,raceLaps());c.lap=progress.lap;
        if((!pursuit||pursuit.role(c.id)==='runner')&&(raceTimeLimit()?c.health>0&&timedRaceFinished(c.passed,elapsed,raceTimeLimit()):progress.finished)){
          c.finished=true;c.finishTime=elapsed+c.penalty;
          if(c.id===0&&!demo&&!raceTimeLimit()&&!pursuit){if(activeClubRound!==null)freezeClubPlayer();else finish('FINISH LINE');}
        }
      }
    }
  }
  if(pursuit){pursuit.update(cars,elapsed);if(pursuit.complete){finish(pursuitTeamTitle(pursuit,0));return;}}
  // A car blowing up gets BOOM.hold seconds to fly before the event can end on it.
  if (!pursuit && !demo && activeClubRound===null && mode === 'race' && cars[0].health <= 0 && !(raceTimeLimit()&&cars[0].finished) && !(elapsed<blowUpHold)) finish('RETIRED · DAMAGE');
  // AI drivers use their extinguishers too, after a moment's reaction (offline only).
  for(const c of cars){if(!c.extendedDamage||c.health<=0||c.id===0&&!demo)continue;
    if(!c.burning||c.extinguishers<=0){aiBurn.delete(c.id);continue;}
    const t=(aiBurn.get(c.id)??0)+dt;aiBurn.set(c.id,t);
    if(t>=aiExtinguishAfter(c.id)&&c.extinguish()){aiBurn.delete(c.id);aiFireOuts++;if(!sound.clip('extinguisher',c.current,.5,1.3))sound.shot('impact-light',c.current,.25,{rate:2.4,delay:0,duration:.4,lowpass:7000});}}
  // A car that can no longer drive itself (seized, empty tank, no drive left) is out after a few seconds (offline only).
  if(!demo&&(mode==='derby'||mode==='race'))for(const c of cars){
    if(!c.extendedDamage||!(c.health>0))continue;
    const reason=deadReason({health:c.health,seized:c.seized,batteryFlat:c.beltSnapped&&c.battery<=0,noBattery:c.batteryOut&&c.engineStall!>0,fuelLevel:c.fuelLevel,driveBias:c.driveBias,wheelLost:c.wreckParts.wheelLost,driven:c.drivenWheels});
    c.deadTime=deadTime(c.deadTime,!!reason,dt);
    if(c.deadTime>=DNF.after){const before=c.health;c.health=0;c.deadTime=0;if(c.id===0)toast('OUT · '+reason,2.4);
      // Run dry after a rival dropped its tank: that rival finished it (offline).
      const by=reason==='OUT OF FUEL'?cars.find(v=>v.id===tankBy.get(c.id)):undefined;
      if(by&&by!==c){wreckedBy.set(c.id,by.id);eventAwards.hit(by.id,c.id,0,true,elapsed,0);combat.hit(by.id,c.id,before,0,elapsed);if(mode==='derby'){derbyFeed.note(by.id,displayedDriver(by),'dry',elapsed);if(scoreDerby())scoreStunt(by.id,DESTRUCTION_POINTS.dry);}
        if(!demo&&by.id===0){toast(`RAN DRY · #${c.id+1} ${DEFINITIONS[c.kind].name}`+pointsTag(DESTRUCTION_POINTS.dry),2,2);sound.crowd(.8);playerTakedown();}}}
  }
  if (mode === 'derby' && !(elapsed<blowUpHold)) {
    const alive = cars.filter((c) => c.health > 0&&!(activeClubRound!==null&&clubRetired&&c.id===0));
    if(scoreDerby()){const end=derbyEndReason(derbyFormat(),cars,elapsed,eventDuration());if(end)finish(end==='time'?'TIME’S UP':'SCORE DERBY COMPLETE');}
    else if (!demo && activeClubRound===null && cars[0].health <= 0) finish('WRECKED OUT');
    else if (alive.length <= 1 && activeChallenge?.metric!=='condition'){
      // The player outlasted the field (offline): the stands go up as the results come in.
      if(!online?.active&&!demo&&alive[0]?.id===0){sound.crowd(1);crowdFlashes(SMASH_FLASHES+8);}
      finish('LAST CAR STANDING');}
    else if (elapsed >= eventDuration()) finish('TIME’S UP');
  }
  if(activeClubRound!==null&&state==='playing'){
    if(cars[0].health<=0&&!clubPlayerStopped)freezeClubPlayer();
    if(mode==='race'){if(clubFirstFinish===null&&cars.some(c=>c.finished))clubFirstFinish=elapsed;
      if(cars.every(c=>c.finished||c.health<=0||c.id===0&&clubRetired)||elapsed>=300||clubFirstFinish!==null&&elapsed>=clubFirstFinish+45)finish('CLUB ROUND COMPLETE');}
  }
  if(activeChallenge&&state==='playing'&&(elapsed+cars[0].penalty>=activeChallenge.limit||cars[0].health<=0))finish('CHALLENGE COMPLETE');
  if(raceTimeLimit()&&state==='playing'&&(cars.every(c=>c.finished||c.health<=0)||elapsed>=raceTimeLimit()+120))finish('TIMED RACE COMPLETE');
  if(demo&&!pursuit&&!raceTimeLimit()&&mode==='race'&&(raceFinishRemaining(cars,elapsed)===0||cars.every(c=>c.finished||c.health<=0)||elapsed>=Math.max(600,raceLaps()*150)))finish('RACE COMPLETE');
  fx.update(dt);
}
function cycleSpectator(direction:number){if(scoreSpectating())director.cycleCar(cars,direction);}
// Windscreen crazing from the dashboard camera: cracks tracked on the player's screen every frame, drawn only in that view.
const crazeCanvas=document.createElement('canvas');crazeCanvas.id='screen-craze';crazeCanvas.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none';
document.getElementById('game')?.after(crazeCanvas);
const screenCraze=new ScreenCraze(crazeCanvas),crazeStates=new WeakMap<T.Mesh,CrazeState>(),crazePoint=new T.Vector3();
function updateCraze(){
  const p=cars[0],spots:{x:number;y:number;level:number;seed:number}[]=[],clip:{x:number;y:number}[]=[],show=!!p&&drivingCamera==='dashboard'&&!demo&&!studio&&['playing','countdown','paused','wrecked'].includes(state);
  if(p)for(const g of p.glass){
    if(!/windshield|^glass_front/i.test(g.name))continue;
    const st=(g.material as T.Material).userData.glassState as {impact:{value:T.Vector3}}|undefined;if(!st)continue;
    const imp=st.impact.value,before=crazeStates.get(g)??{centres:[],last:0};
    const now=trackCraze(before,[imp.x,imp.y,imp.z],g.visible?Math.min(1,(g.userData.damage??0)/24):0,p.id*7919+before.centres.length*104729+1);crazeStates.set(g,now);
    if(!show||!g.visible)continue;
    camera.updateMatrixWorld();camera.matrixWorldInverse.copy(camera.matrixWorld).invert();g.updateWorldMatrix(true,false);
    // Clip to the glass itself: the hull of (a sample of) its rest vertices on screen.
    if(now.centres.length){const pos=(g.geometry.getAttribute('restPosition')??g.geometry.getAttribute('position')) as T.BufferAttribute,step=Math.max(1,Math.floor(pos.count/96)),pts:{x:number;y:number}[]=[];
      for(let k=0;k<pos.count;k+=step){crazePoint.fromBufferAttribute(pos,k).applyMatrix4(g.matrixWorld).applyMatrix4(camera.matrixWorldInverse);if(crazePoint.z>-camera.near)continue;crazePoint.applyMatrix4(camera.projectionMatrix);pts.push({x:(crazePoint.x+1)/2*innerWidth,y:(1-crazePoint.y)/2*innerHeight});}
      clip.push(...hull(pts));}
    for(const c of now.centres){crazePoint.set(c.p[0],c.p[1],c.p[2]).applyMatrix4(g.matrixWorld).project(camera);if(Math.abs(crazePoint.z)>1)continue;
      spots.push({x:(crazePoint.x+1)/2*innerWidth,y:(1-crazePoint.y)/2*innerHeight,level:c.level,seed:c.seed});}
  }
  screenCraze.draw(spots,clip);
}
function cycleDrivingCamera(){drivingCamera=nextDrivingCamera(drivingCamera);toast(DRIVING_CAMERA_LABELS[drivingCamera]+' CAMERA');}
const lookLocal=new T.Vector3(),lookTurn=new T.Quaternion();
const crunchAt=new T.Vector3(),crunchClock=new WeakMap<object,number>();let crunchTake=0;
let hornHeats=0,endHorns=0;
const bailClock=new WeakMap<object,number>(),bailed:T.Object3D[]=[];
const BAIL_CHEER=.75;
const shredClock=new WeakMap<object,number>();let shredChunks=0;
const gaspSeen=new WeakMap<object,{rolls:number;blown:boolean}>();let gasps=0,boos=0,honks=0;
/** The player's horn on H: a honk of length seconds at volume. */
const HONK={length:.45,volume:.7} as const;
/** A rival honks at a new target now and then: a chance in each new pick, spaced gap seconds apart per car, length seconds at volume. */
const RIVAL_HONK={chance:.15,gap:15,length:.32,volume:.5} as const;
const honkTarget=new WeakMap<object,number>(),honkAt=new WeakMap<object,number>();let rivalHonks=0;
/** The player rammed a car that was already out: bad form at a derby, and the crowd lets them know (offline, a real hit). */
function hitTheWreck(closing:number){if(online?.active||demo||closing<CROWD_BOO.closing)return;if(sound.crowdBoo()){boos++;toast('THE CROWD BOOS · THAT CAR WAS OUT',1.4);}}
const smokeIn=new WeakMap<object,number>();
const wiperRigs=new WeakMap<object,WiperRig>();
const handStates=new WeakMap<object,HandState>();
/** Each car's windscreen glass, when it has wiper arms to clear it (rain beads it over otherwise). */
const wiperScreens=new WeakMap<object,GlassState|undefined>();
let carWetOverride:number|null=null;
let umbrellasUp=false,umbrellaRoot:T.Object3D|undefined;
const bonnetHeats=new WeakMap<object,number>(),bonnetClocks=new WeakMap<object,number>(),steamAt=new T.Vector3();let bonnetPuffs=0;
const vapourClocks=new WeakMap<object,number>();let vapourPuffs=0;
/** A driver watches the car their driving brain is hunting, if it is still running (see lookYaw). */
function lookDriver(c:Vehicle,figure:T.Object3D,dt:number){
  const t=drivers.memory.get(c.id)?.target,prey=t!==undefined&&t>=0&&t!==c.id?cars.find(x=>x.id===t&&x.health>0):undefined;
  if(prey)lookLocal.copy(prey.current).sub(c.current).applyQuaternion(lookTurn.copy(c.root.quaternion).invert());
  turnHead(figure,lookYaw(prey?lookLocal:null,c.body.angvel().y,c.speed),dt);
}
const signAxis=new T.Vector3(),signUp=new T.Vector3();
/** A derby roof sign takes the car's knocks (only offline derby cars carry one): see roofSignFate. */
function knockRoofSign(c:Vehicle,sign:T.Object3D,dt:number){
  const was:RoofSignFate=sign.userData.fate??'up';signAxis.set(1,0,0).applyQuaternion(c.root.quaternion);signUp.set(0,1,0).applyQuaternion(c.root.quaternion);
  const fate=roofSignFate(was,signUp.y,c.rolls,c.damageZones.roof,c.blownUp);sign.userData.fate=fate;
  if(fate==='torn'){sign.userData.car=c.id;const v=c.body.linvel(),box=roofSignBox(),spin=(c.id*.618)%1-.5;
    fx.detachProp(sign,new T.Vector3(v.x+spin*4,v.y+(c.blownUp?9:3),v.z-spin*3),box.size,box.centre,()=>disposeRoofSign(sign));return;}
  // It folds away from the side that went down, pressed over by the ground.
  if(fate==='flat'){if(was==='up')sign.userData.side=signAxis.y<0?1:-1;foldRoofSign(sign,sign.userData.side,dt);}
}
function updateCamera(dt: number) {
  // The driver of the car the camera sits in (hood or dashboard view) is hidden, so the view stays clear.
  {const spectating=demo||scoreSpectating(),viewed=spectating?cars.find(c=>c.id===director.followed):cars[0],inside=spectating?director.activeView==='hood':drivingCamera!=='chase';
    for(const c of cars){const d=c.root.children.find(o=>o.name==='driver');if(d)d.visible=!(inside&&c===viewed);}}
  // Drivers sway in their seats with the car's own motion (cosmetic; frozen while paused so resuming does not jolt them).
  // Drivers slump under a crushed roof (measured on the first frame, then only when the roof crush changes) so a helmet never
  // shows through it.
  for(const c of cars){const d=c.root.children.find(o=>o.name==='driver'),roof=c.structuralDamage?.[4]??0;if(d&&(d.userData.roofSeen===undefined||Math.abs(d.userData.roofSeen-roof)>.004)){d.userData.roofSeen=roof;duckDriver(d,c.root,[...c.panels,...c.glass],roof);}}
  // A roll cage bends down with the roof by the driver's slump.
  for(const c of cars){const cage=c.root.children.find(o=>o.name==='roll_cage'),d=cage&&c.root.children.find(o=>o.name==='driver');if(cage&&d?.userData.seatBase){const drop=d.userData.seatBase.y-d.userData.seat.y;if(drop!==(cage.userData.drop??0)){cage.userData.drop=drop;bendCage(cage,d.userData.seatBase,drop);}}}
  if(state!=='paused')for(const c of cars){const d=c.root.children.find(o=>o.name==='driver');if(d)swayDriver(d,c.root,dt);}
  // and look where the fight is: at the car they hunt, into the turn, back over a shoulder when reversing.
  if(state!=='paused')for(const c of cars){const d=c.root.children.find(o=>o.name==='driver');if(d)lookDriver(c,d,dt);}
  // Their hands ride round the wheel as they steer (offline).
  // and the right hand goes to the handbrake and the gear lever (offline).
  if(state!=='paused')for(const c of cars){if(!c.extendedDamage)continue;const d=c.root.children.find(o=>o.name==='driver');if(!d)continue;let h=handStates.get(c);if(!h){h=newHandState(c.gear);handStates.set(c,h);}
    steerArms(d,c.steering,handReach(h,!!c.input?.handbrake,c.gear,dt));}
  // Derby flags whip about with their cars and snap once a car is out or upside down.
  if(state!=='paused')for(const c of cars){const f=c.root.children.find(o=>o.name==='derby_flag');if(f)waveFlag(f,c.root,dt,c.health<=0||c.inverted>.3,windy&&!online?.active?breeze:undefined);}
  // Drivers get out of wrecked cars that are burning or blown up once they have stopped, and walk clear to watch (offline).
  if(state==='playing'||state==='wrecked'){for(const c of cars){if(!c.extendedDamage)continue;const d=c.root.children.find(o=>o.name==='driver');if(!d)continue;
    const t=(c.onFire||c.blownUp)&&c.health<=0&&Math.abs(c.speed)<BAIL.speed?(bailClock.get(c)??0)+dt:0;bailClock.set(c,t);
    if(shouldBail(c.onFire,c.blownUp,c.health<=0,c.speed,t)){bailOut(d,c.root,scene,(x,z)=>fx.floorAt(x,z,c.current.y));bailed.push(d);}}
    // A driver clear of the fire waves to show they are all right, and the stands cheer.
    for(const f of bailed)if(strollAway(f,dt))sound.crowd(BAIL_CHEER);}
  // A burning car's cabin fills with smoke, murking its glass, and stays sooty after (offline).
  if(state==='playing'||state==='wrecked')for(const c of cars){if(!c.extendedDamage)continue;const was=smokeIn.get(c)??0,now=cabinSmoke(was,c.onFire,dt);if(now===was)continue;smokeIn.set(c,now);
    for(const g of c.glass){const st=(g.material as T.Material).userData.glassState as GlassState|undefined;if(st)st.smoke.value=now;}}
  // Wipers sweep in the rain and park when it is dry; dead electrics stop them, and a big front hit bends them up off the glass (offline).
  if(state==='countdown'||state==='playing'||state==='wrecked'){const wet=eventLighting==='rain';for(const c of cars){if(!c.extendedDamage)continue;let rig=wiperRigs.get(c);if(!rig){rig=new WiperRig(wiperArms(c.model),c.id);wiperRigs.set(c,rig);}
    rig.update(dt,wet,c.health>0&&!c.electricalCut&&!c.batteryOut,c.structuralDamage?.[0]??0,c.structuralDamage?.[1]??0);
    // and keep the windscreen clear of rain while they work; stopped, it beads over again.
    if(!wiperScreens.has(c))wiperScreens.set(c,rig.arms.length?((windscreen(c.glass,c.root)?.material as T.Material|undefined)?.userData.glassState as GlassState|undefined):undefined);
    const screen=wiperScreens.get(c);if(screen)screen.wiped.value=wipeStep(screen.wiped.value,rig.moving,dt);}}
  // Rivals taunt with the horn: now and then, a driver picking a new car to hunt gives it a honk (offline, each car spaced out).
  if(state==='playing'&&!online?.active)for(const c of cars){if(c.id===0&&!demo||c.health<=0)continue;const t=drivers.memory.get(c.id)?.target??-1,was=honkTarget.get(c);honkTarget.set(c,t);
    if(was!==undefined&&t>=0&&t!==was&&clock-(honkAt.get(c)??-99)>=RIVAL_HONK.gap&&Math.random()<RIVAL_HONK.chance&&sound.clip('horn-stuck',c.current,RIVAL_HONK.volume,RIVAL_HONK.length)){honkAt.set(c,clock);rivalHonks++;}}
  // The crowd gasps when a car rolls over or blows up (offline).
  if(state==='playing')for(const c of cars){if(!c.extendedDamage)continue;const seen=gaspSeen.get(c)??{rolls:c.rolls,blown:c.blownUp};if((c.rolls>seen.rolls||c.blownUp&&!seen.blown)&&sound.crowdGasp())gasps++;seen.rolls=c.rolls;seen.blown=c.blownUp;gaspSeen.set(c,seen);}
  // A shredding tyre sheds lumps of rubber at its wheel as the car goes (offline).
  if(state==='playing')for(const c of cars){if(!c.extendedDamage||Math.abs(c.speed)<SHRED_TRAIL.speed||clock-(shredClock.get(c)??-9)<SHRED_TRAIL.gap)continue;const w=c.wheels[c.tyreShred.findIndex(t=>t>0)];if(!w?.visible)continue;w.getWorldPosition(crunchAt);fx.scatterLitter(crunchAt,'rubber',c.id*151+(++shredChunks),undefined,undefined,SHRED_TRAIL.chips);shredClock.set(c,clock);}
  // Tyres crunch over the glass and lens chips on the floor (offline), the two recorded takes in turn.
  if(state==='playing'&&fx.litter.mesh.count)for(const c of cars){if(!c.extendedDamage||clock-(crunchClock.get(c)??-9)<CRUNCH.gap)continue;for(const w of c.wheels){if(!w.visible)continue;w.getWorldPosition(crunchAt);const v=crunchVolume(fx.litter.under(crunchAt.x,crunchAt.z,CRUNCH.radius),c.speed);if(v>0){sound.clip(crunchTake++%2?'glass-crunch-2':'glass-crunch',crunchAt,v,CRUNCH.duration);crunchClock.set(c,clock);break;}}}
  // Roof signs fold flat when a car goes over and tear off on a second roll, a crushed roof or a blow-up.
  if(state!=='paused')for(const c of cars){const sign=c.root.children.find(o=>o.name==='roof_sign');if(sign)knockRoofSign(c,sign,dt);}
  if(scoreSpectating()){const current=cars.find(c=>c.id===director.followed);if(!current||current.health<=0)director.cycleCar(cars,1);else if(!director.manual)director.follow(current.id);}
  const p = demo||scoreSpectating()?(cars.find(c=>c.id===director.followed)??cars[0]):cars[0];
  if (!p) return;
  if(camera.near!==.1){camera.near=.1;camera.updateProjectionMatrix();}
  if(!garageOpen){camera.up.set(0,1,0);if(camera.view?.enabled)camera.clearViewOffset();}
  if(studio){studio.updateCamera(camera,orbit,renderer);return;}
  quarry.sun.position.copy(p.root.position).addScaledVector(DAYLIGHT_DIRECTION, DAYLIGHT_DISTANCE);
  quarry.sun.target.position.copy(p.root.position);
  if(demo||scoreSpectating()){cameraImpactOffset.set(0,0,0);if(scoreSpectating()&&director.view!=='drone')director.select('drone');if(state!=='paused')director.update(cars,camera,orbit,dt,mode==='race');return;}
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
  if(drivingCamera==='dashboard'){
    // Re-measure the duck under a crushed roof only when the roof crush changes.
    const roof=p.structuralDamage?.[4]??0;let duck=roofDucks.get(p);
    if(!duck||Math.abs(duck.roof-roof)>.004){duck={roof,drop:roof>0?roofDuckDrop(p.kind,p.model,[...p.panels,...p.glass]):0};roofDucks.set(p,duck);}
    const view=dashboardComposition(p.kind,p.model,duck.drop);
    cameraImpactOffset.set(0,0,0);
    camera.position.copy(view.position);camera.up.copy(view.up);camera.lookAt(view.target);
    // The rigid cabin must not translate through its own body after a hit.
    const response=p.impactResponse.step(state==='playing'?dt:0);
    camera.rotateZ(response.roll*.25*settings.camera.shake);camera.rotateX(response.pitch*.25*settings.camera.shake);
    camera.near=view.near;camera.fov=view.fov;camera.updateProjectionMatrix();return;
  }
  const hood=drivingCamera==='hood';
  const f = new T.Vector3(0, 0, 1).applyQuaternion(p.root.quaternion);
  f.y = 0;
  f.normalize();
  const target = p.root.position.clone();
  const desired = hood
    ? target
        .clone()
        .addScaledVector(f, 1.35)
        .add(new T.Vector3(0, 0.58, 0))
    : playerChaseComposition(target,f,p.speed,settings.camera).position;
  const cameraGround = activeVenue===quarryVenue?Math.max(scenerySurfaceHeight(desired.x, desired.z), quarryExtensionHeight(desired.x, desired.z) ?? -Infinity, quarryWestWallHeight(desired.x, desired.z) ?? -Infinity):activeVenue.course.height(desired.x,desired.z);
  desired.y = Math.max(desired.y, cameraGround + 0.65);
  const chaseAnchor=target.clone().add(new T.Vector3(0,.8,0));
  const chaseObstruction=(from:T.Vector3,to:T.Vector3)=>cameraObstruction(physics,from,to,p.body,true);
  camera.position.sub(cameraImpactOffset);
  camera.position.lerp(desired, 1 - Math.exp(-dt * (hood ? 25 : 5)));
  if(!hood)camera.position.copy(clearChasePosition(chaseAnchor,camera.position,chaseObstruction));
  const look = hood ? target.clone().addScaledVector(f,22).add(new T.Vector3(0,.5,0)) : playerChaseComposition(target,f,p.speed,settings.camera).target;
  camera.lookAt(look);
  const response = p.impactResponse.step(state === 'playing' ? dt : 0);
  cameraImpactOffset.copy(response.offset).multiplyScalar((hood ? .65 : 1)*settings.camera.shake);
  const beforeShake=camera.position.clone();
  camera.position.add(cameraImpactOffset);
  if(!hood){camera.position.copy(clearChasePosition(chaseAnchor,camera.position,chaseObstruction));cameraImpactOffset.copy(camera.position).sub(beforeShake);camera.lookAt(look);}
  camera.rotateZ(response.roll * (hood ? .6 : 1)*settings.camera.shake);
  camera.rotateX(response.pitch*settings.camera.shake);
  // Damage you can feel: bent wheels and a dragging hub shimmy the view at speed (offline, scaled by the shake setting).
  if(p.extendedDamage&&state==='playing'){const bent=Math.max(0,Math.max(...p.wreckParts.wheelDamage)-.15),hub=p.wreckParts.wheelLost.some(v=>v)?1:0,amp=((bent*.004+hub*.006)*Math.min(1,Math.abs(p.speed)/20)+p.propVibration*.008)*settings.camera.shake;if(amp>0){const w=clock*38;camera.rotateZ(Math.sin(w)*amp);camera.rotateX(Math.sin(w*1.37+1)*amp*.6);}}
  // Speed you can see: a wider view with speed, a kick under hard acceleration, a faint road buzz at speed.
  feelAccel=smoothAccel(feelAccel,p.speed,feelSpeed,state==='playing'?dt:0);feelSpeed=p.speed;
  if(!hood&&state==='playing'){const buzz=roadBuzz(p.speed)*settings.camera.shake;if(buzz>0){const w=clock*61;camera.rotateZ(Math.sin(w)*buzz*.6);camera.rotateX(Math.sin(w*1.73+.4)*buzz);}}
  camera.fov = T.MathUtils.damp(
    camera.fov,
    hood ? 66 : speedFov(settings.camera.fov,p.speed,feelAccel),
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
  if(ui.querySelector('#venue-browser'))return screen('venue-browser','#venue-browser','#venue-mode',click('#venue-close'));
  if(eventSetupOpen)return screen('event-setup','.event-setup','#event-field',click('#event-close'));
  if(careerOpen)return screen('career','.career-board','[data-career-filter="racing"]',click('#career-close'));
  if(profileOpen)return screen('profile','.profile-board','[data-filter="racing"]',click('#profile-close'));
  if(ui.querySelector('.design-dialog')){const dialog=ui.querySelector<HTMLElement>('.design-dialog')!,confirm=dialog.querySelector<HTMLElement>('[data-confirm]');return {key:confirm?'design-confirm':'design-browser',root:confirm??dialog,initial:'button',back:()=>{if(confirm)confirm.querySelector<HTMLButtonElement>('button')?.click();else dialog.dispatchEvent(new Event('cancel',{cancelable:true}));}};}
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
      if(!demo&&['playing','countdown'].includes(state)&&drivingButtons(drivingControls,!online?.active||online.network.snapshot?.transmissionSupport===true).includes(9))continue;
      if(state==='paused'||state==='inspect')resume();
      else if(studio){if(studio.hidden)studio.toggleHud();else studio.togglePlay();}
      else if(['playing','countdown','wrecked'].includes(state)||demo&&state==='result')pause();
    }else if(command==='camera'||command==='recover'){
      // Preserve custom driving maps: a button assigned to a pedal/handbrake keeps that meaning.
      const button=command==='camera'?2:3,assigned=drivingButtons(drivingControls,!online?.active||online.network.snapshot?.transmissionSupport===true).includes(button);
      if(!assigned&&!studio&&['playing','countdown'].includes(state)){
        if(command==='camera'){if(demo)director.cycleView();else cycleDrivingCamera();}
        else if(!demo&&state==='playing')recover();
      }
    }else if(context)controllerNavigation.handle(command);
    else if(demo&&demoHudHidden&&['playing','countdown','result'].includes(state)){
      demoHudHidden=false;ui.classList.remove('demo-clean');
    }else if(command==='back'&&state==='inspect')resume();
    else if(command==='back'&&['playing','countdown'].includes(state)&&!drivingButtons(drivingControls,!online?.active||online.network.snapshot?.transmissionSupport===true).includes(1))pause();
  }
  // Activation can synchronously change screens before the physics loop runs.
  // Consume the held press now, including triggers and A, until it is released.
  context=controllerContext();controllerInput.update(pad,now,controllerKey(context),drivingControls.triggerDeadzone);controllerNavigation.sync(context);
  const hideHelp=!pad||preparingEvent||state==='loading'||controllerKey(context)==='library-busy'||demo&&demoHudHidden||!!studio?.hidden;
  if(controllerHelp.hidden!==hideHelp)controllerHelp.hidden=hideHelp;
  const assigned=(button:number)=>drivingButtons(drivingControls,!online?.active||online.network.snapshot?.transmissionSupport===true).includes(button);
  const hint=context?'D-PAD / STICK navigate · ← → adjust · A select · B back'+(state==='paused'?' · START resume':studio?' · START play / pause':demo?' · START pause':''):state==='inspect'?'B / START return to driving':'DRIVING: saved controls'+(!assigned(2)?' · X camera':'')+(!assigned(3)?' · Y recover':'')+(!assigned(9)?' · START pause':!assigned(1)?' · B pause':' · ESC pause');
  const message=hint+(['playing','countdown'].includes(state)&&sound.ctx?.state==='suspended'?' · CLICK / KEY for sound':'');
  if(controllerHelp.textContent!==message)controllerHelp.textContent=message;
}
function recordRumbleImpact(strength:number){
  if(state==='playing'&&!demo&&!studio&&!document.hidden)controllerRumble.impact(strength);
}
function updateRumble(now:number){
  const p=cars[0],active=state==='playing'&&!demo&&!studio&&!preparingEvent&&!document.hidden&&(!online?.active||online.network.connected)&&!!p&&!p.finished&&!clubPlayerStopped;
  controllerRumble.update(selectedPad(drivingControls,navigator.getGamepads?.()??[]),now,drivingControls.rumble,active?{
    speed:p.health>0?p.speed:0,slip:p.slip,surface:p.surface,scraping:p.scraping,
    ...(p.extendedDamage?{wobble:Math.max(...p.wreckParts.wheelDamage,...p.nutLoose,Math.min(1,p.propVibration),...Array.from(p.bearingWear,v=>bearingGrowl(v,p.speed)*.5)),misfire:p.misfireFactor<1,rub:Math.max(...p.rubDrag)}:{}),
    grounded:online?.active?!!p.remoteGrounded:[0,1,2,3].some(i=>p.controller.wheelIsInContact(i)),
  }:null);
}
function frame(now: number) {
  requestAnimationFrame(frame);
  const raw = (now - lastFrame) / 1000;
  if(state==='playing'&&Number.isFinite(raw)&&raw>0){eventFrameTimes.push(raw*1000);if(eventFrameTimes.length>300)eventFrameTimes.shift();}
  const dt = Math.min(0.05, raw);
  lastFrame = now;
  // A controller Resume updates lastFrame; measure this frame before that callback.
  pollController(now);
  updateRumble(now);
  clock += dt;
  if (!physics || state === 'loading'||preparingOnline) return;
  rain?.update(camera,state==='paused'?0:dt);
  {const wet=eventLighting==='rain';if(wet!==wetOn||activeVenue.root!==wetRoot){applyWetLook(wetRoot,false);wetRoot=activeVenue.root;wetOn=wet;applyWetLook(wetRoot,wet);}}
  // The rain sounds for as long as the event's weather says so (applyEventLighting runs while still in the menu, when it
  // could only switch the rain off).
  sound.rain(eventLighting==='rain'&&state!=='menu');
  // Engines heat up as they work and cool once stopped; in the rain a hot bonnet boils it off in wisps of steam (offline).
  if(state==='countdown'||state==='playing'||state==='wrecked'){const wet=eventLighting==='rain';for(const c of cars){if(!c.extendedDamage)continue;
    const heat=bonnetHeat(bonnetHeats.get(c)??BONNET_STEAM.start,c.health>0&&!(c.engineStall!>0)&&!c.engineOut,c.input?.throttle??0,c.rpm??0,dt);bonnetHeats.set(c,heat);if(!wet)continue;
    const t=(bonnetClocks.get(c)??0)+steamRate(heat)*dt;bonnetClocks.set(c,t%1);if(t<1)continue;bonnetPuffs++;
    steamAt.set((Math.random()-.5)*.5,.6,(isRearEngineKind(c.kind)?-1:1)*DEFINITIONS[c.kind].halfLength*.45).applyQuaternion(c.root.quaternion).add(c.root.position);fx.emit(steamAt,1,5,.35);}}
  // In cool damp air (rain or dusk) running engines puff white vapour from the tailpipe, the more the colder they are (offline).
  if((state==='countdown'||state==='playing'||state==='wrecked')&&(eventLighting==='rain'||eventLighting==='dusk'))for(const c of cars){if(!c.extendedDamage||c.health<=0||c.engineStall!>0||c.engineOut||c.exhaustGone)continue;
    const t=(vapourClocks.get(c)??0)+vapourRate(bonnetHeats.get(c)??BONNET_STEAM.start,c.input?.throttle??0)*dt;vapourClocks.set(c,t%1);if(t<1)continue;vapourPuffs++;
    // From the tailpipe, where a crushed one hangs (vehicle.ts exhaust_pipe).
    steamAt.set(isRearEngineKind(c.kind)?.35:-.35,-.25,-DEFINITIONS[c.kind].halfLength-.1).applyQuaternion(c.root.quaternion).add(c.root.position);fx.emit(steamAt,1,5,.25);}
  // The event's breeze, gusting: smoke, steam and vapour drift on it, fire smoke leans with it, the rain slants (offline).
  // Rain damps car fires (offline): they catch less, burn out sooner and hiss steam.
  if(vehicleFire)vehicleFire.wet=eventLighting==='rain'&&!online?.active;
  if(windy&&!online?.active){gusting(breezeBase,clock,breeze);fx.wind.set(breeze.x,breeze.z);vehicleFire?.setWind(breeze,WIND.fire);rain?.setWind(breeze);}
  else if(fx.wind.x||fx.wind.y){fx.wind.set(0,0);vehicleFire?.setWind(null);rain?.setWind(null);}
  // Up go the umbrellas in the stands when it rains (offline).
  {const up=eventLighting==='rain'&&!online?.active;if(up!==umbrellasUp||activeVenue.root!==umbrellaRoot){umbrellaRoot?.traverse(o=>o.userData.umbrellas?.(false));umbrellaRoot=activeVenue.root;umbrellasUp=up;umbrellaRoot?.traverse(o=>o.userData.umbrellas?.(up));}}
  // The cars are soaked in the rain too: darker paint and mud, a film of water on top (offline).
  CAR_WET.value=carWetOverride??(eventLighting==='rain'&&state!=='menu'&&!garageOpen&&!online?.active?1:0);
  // Loose arena props are local physics: switch them off whenever this client is in an online event.
  {const off=!!online?.active;if(activeVenue.resetProps&&propsVenue!==activeVenue||propsOnline!==off){propsVenue=activeVenue;propsOnline=off;if(off)activeVenue.resetProps?.(false);else if(activeVenue.props.some(p=>!p.body.isEnabled()))activeVenue.resetProps?.(true);}}
  if(state!=='paused')activeVenue.update?.(clock);
  if(adaptiveGraphics.sample(raw*1000,!document.hidden&&!preparingEvent&&!studio&&state==='playing'))applyQuality();
  // Include long stalls in the sustained benchmark, including event restarts.
  if(capturedFrames&&capturedFrames.length<50_000&&Number.isFinite(raw)&&raw>0)capturedFrames.push(raw*1000);
  if (raw < 1) {
    frames.push(raw * 1000);
    if (frames.length > 600) frames.shift();
  }
  if(studio){const from=studio.time,playing=studio.playing;studio.update(dt);replayAudio.sync(playing,studio.seeking,cars);replayImpacts?.step(from,studio.time,playing,studio.seeking,sound.ready);replayBursts?.step(from,studio.time,playing,studio.seeking,sound.ready);if(studio.seeking)return;}
  else if(online?.active) {
    if(state==='playing' && online.network.connected&&!scoreSpectating())online.network.setInput(input());else online.network.idleInput();
    const s=online.network.sample();if(s){online.apply(s,dt);if(activeVenue===quarryVenue)quarry.applyProps(s.props);elapsed=s.elapsed;countdown=s.countdown;}
    accumulator+=dt;let n=0;while(accumulator>=1/60 && n++<4){physics.step();fx.update(1/60);accumulator-=1/60;}
    const net=document.getElementById('network-status');if(net)net.textContent=online.network.connected?`ROOM ${online.network.room} · ${online.network.latency} MS`:online.network.reconnecting?'RECONNECTING · CONTROLS CLEARED':`${online.network.disconnectReason} · ESC TO LEAVE`;
  } else if (['playing', 'countdown'].includes(state)) {
    accumulator += dt*(state==='playing'&&clock<slowMoUntil?slowMoScale:1);
    let n = 0;
    withWreckBatch(()=>{
    while (accumulator >= 1 / 60 && n++ < 4) {
      step(1 / 60);
      accumulator -= 1 / 60;
    }
    });
    for (const c of cars) c.render(state === 'wrecked' ? 1 : accumulator / (1 / 60));
    if(bumperTethers.length)drawTetherWires();
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
  updateCraze();
  if(studio&&!studio.seeking){replaySlicks?.update(studio.time);replayFire?.fire.setGround(replaySlicks?[...replaySlicks.slicks.fires(),...replaySlicks.props.fires(studio.time,propPoints(replayPropMeshes.map(mesh=>({mesh}))))]:[],studio.time);replayFire?.update(studio.time,camera);replayPuddles?.update(studio.time);}
  if(!studio)for(const car of cars){car.wreckParts.pose(['playing','countdown'].includes(state)?dt:0,car.speed);car.wreckParts.wheelsPose();car.syncSuspension();}
  const effectsActive=['playing','countdown','wrecked'].includes(state)||(demo&&state==='result');
  if(studio){sound.damageLoops([],camera.position);sound.stuckHorns([],camera.position);sound.bearingGrowls([],camera.position);sound.beltSqueals([],camera.position);sound.cabinWind(0,camera.position,0);sound.cabinRain(0,camera.position);}
  if(studio)sound.runningLoops([],camera.position);
  if(!studio&&vehicleFire){
    const props=propPoints(activeVenue.props);if(effectsActive&&!online?.active)for(const b of propFires.update(fx.slicks.clock,props,fx.slicks))drumBlast(new T.Vector3(b.p.x,b.p.y,b.p.z),b.index);
    const debrisFires=fx.debrisFires();for(const d of debrisFires)fx.slicks.igniteAt(d.x,d.z,.35,false);
    const groundFires=[...fx.slicks.fires(),...propFires.fires(fx.slicks.clock,props),...debrisFires];
    vehicleFire.setGround(groundFires,fx.slicks.clock);vehicleFire.update(cars,effectsActive?dt:0,camera);
    // A burning car lights any oil or fuel it is standing in (offline cars only leak).
    for(const e of vehicleFire.emitters.values())if(e.car.extendedDamage&&e.state.heat>.45)fx.slicks.igniteAt(e.origin.x,e.origin.z,1,false,e.car.id);
    // Burning cars set the cars pressed against them alight.
    for(const c of cars){c.contactHeat=0;c.contactBy=-1;}
    for(const e of vehicleFire.emitters.values()){
      if(!e.car.extendedDamage||e.state.heat<CAR_FIRE.min)continue;const a={current:e.car.current,forward:e.car.forward,right:e.car.right,halfWidth:DEFINITIONS[e.car.kind].halfWidth,halfLength:DEFINITIONS[e.car.kind].halfLength};
      for(const o of cars){if(o===e.car||!o.extendedDamage||o.health<=0)continue;const h=contactHeat(a,{current:o.current,forward:o.forward,right:o.right,halfWidth:DEFINITIONS[o.kind].halfWidth,halfLength:DEFINITIONS[o.kind].halfLength},e.state.heat);if(h>o.contactHeat){o.contactHeat=h;o.contactBy=e.car.id;}}
    }
    let nearest:{p:T.Vector3;level:number}|null=null;
    for(const f of groundFires){const level=burnLevel(f,fx.slicks.clock)*Math.min(1.4,.6+f.radius),p=new T.Vector3(f.x,f.y,f.z);if(level>0&&(!nearest||p.distanceToSquared(camera.position)<nearest.p.distanceToSquared(camera.position)))nearest={p,level};}
    sound.groundFire(effectsActive?nearest:null);
    sound.damageLoops(effectsActive&&!online?.active?cars:[],camera.position);sound.stuckHorns(effectsActive&&!online?.active?cars:[],camera.position);sound.bearingGrowls(effectsActive&&!online?.active?cars:[],camera.position);sound.beltSqueals(effectsActive&&!online?.active?cars:[],camera.position);{const p=cars[0];sound.cabinWind(p&&effectsActive&&!online?.active&&!demo&&p.extendedDamage?windRoar(p.openness,p.speed):0,p?.current??camera.position,p?.speed??0);
    // Rain drums on the roof heard from an in-car camera (an open cabin loses most of it).
    sound.cabinRain(p&&effectsActive&&!online?.active&&!demo&&eventLighting==='rain'&&drivingCamera!=='chase'?1-ROOF_RAIN.open*Math.min(1,p.openness):0,p?.current??camera.position);}
    sound.runningLoops(effectsActive&&!online?.active?cars:[],camera.position);
  }
  // In the rain (offline) every wheel on the wet road throws a fine spray too.
  if(!studio)puddleSplashes?.update(cars,activeVenue.puddles,effectsActive?dt:0,state==='playing',true,eventLighting==='rain'&&!online?.active?1:0);
  if(!studio&&state==='playing'){for(const burst of vehicleFire?.bursts??[]){recorder?.burst({time:elapsed,position:burst.position.toArray()});if(!online?.active){shockwave(burst.position,burst.id);blastDamage(burst.position,burst.id,CAR_BLAST.radius,CAR_BLAST.damage);const car=cars.find(c=>c.id===burst.id);if(car)carBlowsUp(car,burst.position);}}captureReplay();}
  if(studio?.playing&&!studio.seeking){sound.update(cars,camera,dt,false,{id:cars[studio.follow]?.id??0,view:studio.view==='hood'?'hood':studio.view==='chase'?'chase':'orbit'},(from,to)=>cameraObstruction(physics,from,to,undefined,true));sound.thermal(replayThermal,[]);}
  {const p=cars[0];sound.daze(state==='playing'&&!demo&&!studio&&p?.extendedDamage?Math.min(1,p.dazed/1.2):0);}
  if(effectsActive){sound.update(cars,camera,dt,state==='wrecked',{id:demo||scoreSpectating()?director.followed:cars[0]?.id??0,view:demo||scoreSpectating()?director.activeView:drivingCamera==='dashboard'?'hood':drivingCamera},(from,to)=>cameraObstruction(physics,from,to,undefined,true));if(vehicleFire)sound.thermal(vehicleFire.audio,vehicleFire.bursts);}
  if(activeVenue===quarryVenue)quarry.update(camera);
  waypointMarkers??=new WaypointMarkers(scene);waypointMarkers.update(waypointRace,demo||scoreSpectating()?director.followed:online?.active?online.network.id:0,!studio&&mode==='race'&&['playing','countdown','paused','result'].includes(state),activeVenue.course.height);
  if(waypointRace)activeVenue.checkpoint.visible=false;
  if(!studio&&!waypointRace&&mode==='race'&&cars[0]) {
    const followed=demo||scoreSpectating()?cars.find(c=>c.id===director.followed)??cars[0]:cars[0],p=raceRoute(followed.id)[followed.nextCheckpoint],ahead=raceRoute(followed.id)[(followed.nextCheckpoint+1)%24];
    activeVenue.checkpoint.position.set(p.x,activeVenue===quarryVenue?terrainHeight(p.x,p.z):activeVenue.course.height(p.x,p.z),p.z);
    activeVenue.checkpoint.rotation.y=Math.atan2(ahead.x-p.x,ahead.z-p.z);
  }
  // Distant cars resync their batched parts every 2nd or 4th frame while driving (SYNC_LOD); everything else every frame.
  syncFrame++;{const live=!studio&&['playing','countdown'].includes(state);for(const car of cars)if(!live||syncDue(syncFrame,car.id,syncInterval(car.current.distanceTo(camera.position))))car.syncDrawBatch();}
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
  if(garageOpen){if(e.code==='Escape')ui.querySelector<HTMLButtonElement>('#garage-close')?.click();return;}
  if(e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement)return;
  if(state==='lobby')return;
  if(e.code===settings.standingsKey&&['playing','countdown'].includes(state)&&document.getElementById('live-standings')){e.preventDefault();if(!e.repeat)toggleStandings();return;}
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
  if((demo||scoreSpectating())&&(e.code==='BracketLeft'||e.code==='BracketRight'))director.cycleCar(cars,e.code==='BracketLeft'?-1:1);
  // H sounds the player's horn: a short honk of the recorded horn (a press, not a held repeat).
  if(e.code==='KeyH'&&!demo&&state==='playing'&&!e.repeat&&cars[0]){if(sound.clip('horn-stuck',cars[0].current,HONK.volume,HONK.length))honks++;}
  if (e.code === 'KeyC') {if(demo)director.cycleView();else cycleDrivingCamera();}
  if (!demo && e.code === 'KeyR' && state === 'playing') recover();
  if(!demo&&e.code===EXTINGUISHER.key&&state==='playing'&&!Object.values(drivingControls.keys).some(binding=>binding.includes(e.code))){const p=cars[0];
    if(p.extinguish()){if(!sound.clip('extinguisher',p.current,.75,1.3))sound.shot('impact-light',p.current,.35,{rate:2.4,delay:0,duration:.45,lowpass:7000});toast(`FIRE OUT · ${p.extinguishers} EXTINGUISHER${p.extinguishers===1?'':'S'} LEFT`,1.8,2);}
    else if(p.extendedDamage&&p.burning&&p.extinguishers<=0)toast('EXTINGUISHER EMPTY',1.2,1);}
  if (!activeChallenge && !online?.active && e.code === 'KeyT' && mode === 'playground' && state === 'playing') {
    traffic = !traffic;eventOptions.playgroundTraffic=traffic;
    try{localStorage.setItem(EVENT_KEY,JSON.stringify(eventOptions));}catch{toast('TRAFFIC CHOICE APPLIES THIS SESSION');}
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
addEventListener('pagehide',()=>controllerRumble.stop());
addEventListener('blur', () => {
  controllerRumble.stop();
  keys.clear();online?.network.clearInput();
  if(preparingEvent)preparationInterrupted=true;
  if ((['playing', 'countdown', 'wrecked'].includes(state)||demo&&state==='result')) pause();
});
document.addEventListener('visibilitychange', () => {
  if(document.hidden)controllerRumble.stop();
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
  const environmentSky = clearSky ?? scene.background;
  if (environmentTarget && environmentSky instanceof T.Texture) {
    const generator = createPMREMGenerator(renderer);
    try {
      // A fresh PMREMGenerator needs to allocate its own filtering planes.
      // Passing an old target here skips that initialization in Three r181.
      const replacement = generator.fromEquirectangular(environmentSky);
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
  propFires.onIgnite=(i,p)=>{if(!studio&&!online?.active)recorder?.drip({time:elapsed,position:[p.x,p.y,p.z],kind:4,seed:i/1000});sound.groundIgnite(new T.Vector3(p.x,p.y,p.z),2);};
  fx.slicks.onIgnite=(x,y,z,kind,owner)=>{if(!studio&&!online?.active){recorder?.drip({time:elapsed,position:[x,y,z],kind:3,seed:fx.slicks.wet?.5:0});eventAwards.ignited(owner);}sound.groundIgnite(new T.Vector3(x,y,z),kind);};
  vehicleFire = new VehicleFire(scene,(p,n,type,force)=>fx.emit(p,n,type,force));
  vehicleFire.setQuality(adaptiveGraphics.quality);
  puddleSplashes=new PuddleSplashes(scene);puddleSplashes.setQuality(adaptiveGraphics.quality);
  const beforeQuarry=new Set(scene.children);
  quarry = new Quarry(scene, physics);
  const quarryRoot=new T.Group();quarryRoot.name='quarry_venue';
  const quarryNodes=scene.children.filter(node=>!beforeQuarry.has(node)&&!(node instanceof T.Light)&&node!==quarry.sun.target);
  quarryRoot.add(...quarryNodes);scene.add(quarryRoot);
  quarryVenue={course:getRaceCourse(),physics,root:quarryRoot,checkpoint:quarry.checkpoint,props:quarry.props,puddles:quarry.puddles};activeVenue=quarryVenue;
  online=new OnlineView(scene,physics,fx,sound,()=>cars,next=>{cars=next;});
  online.onLocalImpact=damage=>recordRumbleImpact(.12+damage/30);
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
  applyEventLighting(true);
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
    get courseState(){return{arena:resolveArenaId(activeVenue.arenaId),id:activeVenue.course.id,quarryVisible:quarryVenue.root.visible,ironfieldVisible:raceVenues['ironfield-figure-eight-v1']?.root.visible??false,cinderbankVisible:raceVenues['cinderbank-oval-v1']?.root.visible??false,bodies:physics.bodies.len(),colliders:physics.colliders.len(),quarryBodies:quarryVenue.physics.bodies.len(),ironfieldBodies:raceVenues['ironfield-figure-eight-v1']?.physics.bodies.len()??0,cinderbankBodies:raceVenues['cinderbank-oval-v1']?.physics.bodies.len()??0};},
    get eventRules(){return{...eventOptions,aiDifficulty:drivers.difficulty,score:scoreDerby(),field:cars.length,rivals:combat.rivals?.snapshot(),combat:Array.from(combat.records)};},
    get progression(){return{profile,run:telemetry?.stats,challenge:activeChallenge?.id,settled:runSettled,lastAward};},
    get garageSetup() { return {kind, saved:garage.cars[kind], active:cars[0]?.specification}; },
    get northForest() { return northForestDiagnostics(camera); },
    get northRidge() { return northRidgeDiagnostics(camera); },
    get cameraPose() { return { position: camera.position.toArray(), quaternion: camera.quaternion.toArray(), target: orbit.target.toArray(), fov: camera.fov, aspect: camera.aspect }; },
    get network(){return {active:online.active,connected:online.network.connected,id:online.network.id,room:online.network.room,snapshot:online.network.snapshot};},
    connectOnline,leaveOnline,
    startOnline:(m:Mode)=>online.network.start(m),
    get pursuit(){return pursuit?.snapshot()??null;},
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
    get audioState() { return {state:sound.ctx?.state,muted:sound.muted,master:sound.master?.gain.value,voices:sound.activeVoices,buffers:sound.buffers.size,levels:{...sound.levels},damage:{...sound.damageSounds}}; },
    get fireState() { return vehicleFire?.stats; },
    get splashState(){return puddleSplashes?.stats;},
    get slicks(){return fx.slicks.stats;},
    /** QA: light any oil or fuel within reach of a car. */
    igniteAt: (id: number, reach = 3) => { const c = cars.find(x => x.id === id); return c ? fx.slicks.igniteAt(c.current.x, c.current.z, reach, false) : 0; },
    get replaySlicks(){return replaySlicks?{...replaySlicks.slicks.stats,props:replaySlicks.props.burning.size}:null;},
    get propFires(){return propFires.burning.size;},
    /** QA: loosen a part's hinges (0..1) without tearing it off. */
    /** withDamage also gives the part the accumulated damage that looseness implies, so a later hit does not recompute it away. */
    loosen: (id: number, name: string, v: number, withDamage = false) => { const a = cars.find(x => x.id === id)?.wreckParts.assemblies.find(x => x.name === name); if (a) { a.loose = Math.max(0, Math.min(1, v)); if (withDamage) a.damage = Math.max(a.damage, 10 + a.loose * 38); } return !!a; },
    /** QA: set a car's oil level (0..1). */
    partBox: (id: number, name: string) => { const c = cars.find(x => x.id === id), a = c?.wreckParts.assemblies.find(x => x.name === name); if (!c || !a) return null; c.root.updateMatrixWorld(true); const b = new T.Box3(); for (const m of a.members) if (m.mesh.visible) b.expandByObject(m.mesh); return { loose: a.loose, min: b.min.toArray(), max: b.max.toArray(), members: a.members.map(m => m.mesh.name + (m.mesh.visible ? '' : '(hidden)')) }; },
    discGlowInfo: (id: number) => cars.find(x => x.id === id)?.discGlowInfo(),
    setDiscHeat: (id: number, wheel: number, v: number) => { const c = cars.find(x => x.id === id); if (c && Number.isInteger(wheel) && wheel >= 0 && wheel < 4 && Number.isFinite(v)) c.discHeat[wheel] = Math.max(0, Math.min(1, v)); },
    setOil: (id: number, v: number) => { const c = cars.find(x => x.id === id); if (c && Number.isFinite(v)) c.oilLevel = Math.max(0, Math.min(1, v)); },
    /** QA: tear a named part (front-bumper, hood, …) off a car as a hard hit would. */
    /** QA: pop camera flashes across the active venue's stands. */
    crowdFlash: (count: number) => { let lit = 0; activeVenue.root.traverse(o => { const flash = o.userData.crowdFlash; if (typeof flash === 'function') lit += flash(count); }); return lit; },
    /** QA: set an offline car's engine power multiplier (undefined restores the stock engine). */
    setPower: (id: number, scale?: number, traction?: number) => { const c = cars.find(x => x.id === id); if (!c?.extendedDamage) return false; c.powerScale = scale; c.tractionScale = traction; return true; },
    /** QA: snap an offline car's fan belt with this much battery left. */
    snapBelt: (id: number, battery = 1) => { const c = cars.find(x => x.id === id); if (!c?.extendedDamage) return false; c.beltSnapped = true; c.battery = battery; return true; },
    /** QA: crack a car's windscreen to this damage (0–1 of the shatter sheet), centred on the screen. */
    crackScreen: (id: number, level: number) => { const c = cars.find(x => x.id === id); if (!c) return 0; let n = 0; for (const g of c.glass) { if (!/windshield|^glass_front/i.test(g.name)) continue; const st = (g.material as T.Material).userData.glassState as {damage:{value:number};impact:{value:T.Vector3}} | undefined; if (!st) continue; g.geometry.computeBoundingBox(); st.damage.value = level; st.impact.value.copy(g.geometry.boundingBox!.getCenter(new T.Vector3())); g.userData.damage = level * 24; n++; } return n; },
    /** QA: knock an offline car's front-left wheel to this damage (bends its steering lock). */
    bendSteering: (id: number, damage: number) => { const c = cars.find(x => x.id === id); if (!c?.extendedDamage) return false; c.wreckParts.wheelDamage[0] = damage; return true; },
    /** QA: set a wheel bearing's wear on an offline car (BEARING.start cracked … 1 seized). */
    crackBearing: (id: number, wheel: number, wear: number) => { const c = cars.find(x => x.id === id); if (!c?.extendedDamage) return false; c.bearingWear[wheel] = wear; return true; },
    /** QA: bend an offline car's propshaft (0–1). */
    bendProp: (id: number, bend: number) => { const c = cars.find(x => x.id === id); if (!c?.extendedDamage) return false; c.propBend = bend; return true; },
    /** QA: snap an offline car's anti-roll bar (0 front, 1 rear). */
    snapRollBar: (id: number, axle: number) => { const c = cars.find(x => x.id === id); if (!c?.extendedDamage) return false; c.rollBar[axle] = 0; return true; },
    ripPart: (id: number, name: string, quiet = false) => { const c = cars.find(x => x.id === id); if (!c) return false; c.ripAssembly(name, quiet); return true; },
    /** QA: force the late-derby frenzy factor, or pass nothing to restore the automatic one. */
    frenzy: (factor?: number) => { frenzyOverride = factor; return drivers.frenzy; },
    /** QA: roll a car over where it stands, by `angle` about its length (π upside down, π/2 onto its side). */
    upend: (id: number, angle = Math.PI) => { const c = cars.find(x => x.id === id); if (!c) return false; const q = new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 0, 1), angle).premultiply(c.currentQ); const p = c.body.translation(); c.body.setTranslation({ x: p.x, y: p.y + 1.2, z: p.z }, true); c.body.setRotation(q, true); return true; },
    /** QA: break a door's latch and swing it open by `swing` radians. */
    springDoor: (id: number, name: string, swing = .8) => { const a = cars.find(x => x.id === id)?.wreckParts.assemblies.find(x => x.name === name); if (!a) return false; a.damage = Math.max(a.damage, 12); a.loose = Math.max(a.loose, .55); a.swing = swing; a.swingRate = 0; return true; },
    /** QA: add destruction bonus points to a car in an offline scored derby. */
    bonus: (id: number, points: number) => { if (online?.active || !scoreDerby()) return false; combat.destruction(id, points); return true; },
    /** QA: drop an offline car's fuel tank onto its filler neck. */
    dropTank: (id: number) => { const c = cars.find(x => x.id === id); if (!c?.extendedDamage) return false; c.dropTank(); return true; },
    setStructure: (id: number, face: number, v: number) => { const c = cars.find(x => x.id === id); if (!c?.structuralDamage || !Number.isInteger(face) || face < 0 || face > 4 || !Number.isFinite(v)) return false; c.structuralDamage[face] = Math.max(0, Math.min(1, v)); return true; },
    blowUp: (id: number) => { const c = cars.find(x => x.id === id); if (!c?.extendedDamage) return false; carBlowsUp(c, c.current.clone()); return c.blownUp; },
    /** QA: show or hide every car's derby dressing (driver, roof sign, window net, roll cage, flag); returns the meshes it covers. */
    dressing: (on: boolean) => { let n = 0; for (const c of cars) for (const o of c.root.children) if (['driver', 'roof_sign', 'window_net', 'roll_cage', 'derby_flag'].includes(o.name)) { o.visible = on; o.traverse(m => { if ((m as T.Mesh).isMesh) n++; }); } return n; },
    /** QA: chips of glass and lamp lens on the floor, and the breaks that left them by kind. */
    litter: () => ({ chips: fx.litter.mesh.count, ...fx.litter.breaks, last: fx.litter.last.toArray(), crunches: crunchTake }),
    horns: () => hornHeats,
    endHorns: () => endHorns,
    whining: () => sound.whining,
    flapping: () => sound.flapping,
    hissing: () => sound.hissing,
    leaking: () => sound.leaking,
    squealing: () => sound.squealing,
    creaking: () => sound.creaking,
    swishing: () => sound.swishing,
    rainSound: () => sound.rainOn,
    drumming: () => sound.drumming,
    shake: (id = 0) => {const c = cars[id]; if (!c) return null; const w = c.wheels[0]; return {...c.engineShake.out, kicks: c.engineShake.kicks, wheel: w ? [w.position.x, w.position.z, w.parent === c.model] : null};},
    gasps: () => gasps,
    boos: () => boos,
    honks: () => honks,
    rivalHonks: () => rivalHonks,
    /** QA: puncture a tyre as rolling over sharp debris does (it starts going down). */
    puncture: (id: number, wheel: number) => { const c = cars.find(x => x.id === id); if (!c?.tyreDamage || !(wheel >= 0 && wheel < 4)) return false; c.tyreDamage[wheel] = Math.max(c.tyreDamage[wheel], TYRE_LEAK_RANGE.onset + .05); return true; },
    driverArms: (id = 0) => { const c = cars[id], d = c?.root.children.find(o => o.name === 'driver'); return d ? { steering: +c.steering.toFixed(3), tilts: d.children.filter(o => o instanceof T.Mesh && o.geometry instanceof T.CylinderGeometry).sort((a, b) => a.position.x - b.position.x).map(o => +o.rotation.x.toFixed(3)), reach: +(handStates.get(c)?.reach ?? 0).toFixed(3), gear: c.gear } : null; },
    umbrellas: () => { let n = 0; activeVenue.root?.traverse(o => { if (o.name === 'crowd_umbrella' && o.visible) n += (o as T.InstancedMesh).count; }); return n; },
    carWet: (v?: number | null) => { if (v !== undefined) carWetOverride = v; return CAR_WET.value; },
    vapour: () => vapourPuffs,
    rainSteam: () => vehicleFire?.rainSteam ?? 0,
    wind: () => windy && !online?.active ? { x: +breeze.x.toFixed(3), z: +breeze.z.toFixed(3), base: { ...breezeBase } } : null,
    headGasket: (id = 0) => { const c = cars[id]; return c ? { clock: +c.gasketClock.toFixed(2), blown: c.gasketBlown, smoke: c.gasketSmoke, coolant: +c.coolantLevel.toFixed(3), misfire: +c.misfireFactor.toFixed(3) } : null; },
    blowGasket: (id = 0) => { const c = cars[id]; if (!c?.extendedDamage) return false; c.gasketClock = HEAD_GASKET_AFTER; return true; },
    bonnetSteam: (id?: number) => { if (id === undefined) return bonnetPuffs; const c = cars[id]; return c ? +(bonnetHeats.get(c) ?? 0).toFixed(3) : null; },
    screenWiped: (id = 0) => { const c = cars[id], st = c && wiperScreens.get(c); return st ? +st.wiped.value.toFixed(3) : null; },
    wipers: (id = 0) => { const c = cars[id], r = c && wiperRigs.get(c); return r ? { arms: r.arms.length, phase: +r.phase.toFixed(3), sweeping: r.sweeping, bent: r.bentArms, angles: r.arms.map(a => +a.angle.toFixed(3)), names: r.arms.map(a => a.mesh.name) } : null; },
    cabinSmoke: (id: number) => { const c = cars.find(x => x.id === id); return c ? smokeIn.get(c) ?? 0 : null; },
    /** QA: set a tyre shredding, as a blowout does. */
    shredTyre: (id: number, wheel: number) => { const c = cars.find(x => x.id === id); if (!c || !(wheel >= 0 && wheel < 4)) return false; c.tyreShred[wheel] = SHRED_SECONDS; return true; },
    bailed: () => bailed.map(f => ({ at: f.position.toArray().map(v => +v.toFixed(2)), walked: +(f.userData.bail?.time ?? 0).toFixed(2), legs: !!f.getObjectByName('driver_legs') })),
    /** QA: scatter litter of a kind at a world point (thrown out from from, when given; paint takes colour). */
    scatterLitter: (at: number[], kind: 'glass' | 'head' | 'tail' | 'paint' | 'rubber', seed = 1, from?: number[], colour?: number) => fx.scatterLitter(new T.Vector3().fromArray(at), kind, seed, from ? new T.Vector3().fromArray(from) : undefined, colour),
    /** QA: smash one lamp as a hard knock would (it goes dark, its lens dulls and its pieces fall). */
    smashLamp: (id: number, kind: 'head' | 'tail', index = 0) => { const c = cars.find(x => x.id === id), m = c && carLights.get(c)?.lamp(kind, index); if (!m) return false; m.userData.damage = LAMP_BREAK + 1; return true; },
    lamps: (id: number) => { const c = cars.find(x => x.id === id), l = c && carLights.get(c); return l ? { head: l.head, tail: l.tail, working: l.working, lit: l.lit } : null; },
    flag: (id: number) => { const f = cars.find(x => x.id === id)?.root.children.find(o => o.name === 'derby_flag'), w = f?.userData.wave; return f ? { bendX: w?.bendX ?? 0, bendZ: w?.bendZ ?? 0, snapped: !!w?.snapped, trail: f.getObjectByName('flag_cloth')!.rotation.y, base: f.position.toArray() } : null; },
    roofSign: (id: number) => { const c = cars.find(x => x.id === id); if (!c) return null; const sign = c.root.children.find(o => o.name === 'roof_sign'); return sign ? { fate: sign.userData.fate ?? 'up', fold: sign.rotation.z } : fx.debris.some(d => d.mesh.name === 'torn_roof_sign' && d.mesh.children[0]?.userData.car === id) ? { fate: 'torn', fold: 0 } : null; },
    driverSway: (id: number) => { const d = cars.find(x => x.id === id)?.root.children.find(o => o.name === 'driver'), s = d?.userData.sway; return s ? { roll: s.roll, pitch: s.pitch, drop: d!.userData.seatBase ? d!.userData.seatBase.y - d!.userData.seat.y : 0, look: d!.userData.look ?? 0, target: drivers.memory.get(id)?.target ?? -1 } : null; },
    placeDebris: (index: number, x: number, y: number, z: number, vx: number, vy: number, vz: number) => { const d = fx.debris[index < 0 ? fx.debris.length + index : index]; if (!d) return false; d.body.setTranslation({ x, y, z }, true); d.body.setLinvel({ x: vx, y: vy, z: vz }, true); return true; },
    setExhaustCrushed: (id: number, crushed: boolean) => { const c = cars.find(x => x.id === id); if (!c?.extendedDamage) return false; c.exhaustCrushed = !!crushed; return true; },
    setAlight: (id: number) => { const c = cars.find(x => x.id === id); if (!c?.extendedDamage || c.health <= 0) return false; c.igniteRequest = true; return true; },
    extinguish: (id: number) => { const c = cars.find(x => x.id === id); return !!c?.extinguish(); },
    throwRod: (id: number) => { const c = cars.find(x => x.id === id); if (!c?.extendedDamage) return false; c.throwRod(); return true; },
    throwBattery: (id: number) => { const c = cars.find(x => x.id === id); if (!c?.extendedDamage) return false; c.throwBattery(); return true; },
    /** QA: set an offline car alight as if it had stood in flames. */
    setCarAlight: (id: number) => { const c = cars.find(x => x.id === id); if (c?.extendedDamage) c.igniteRequest = true; return !!c?.extendedDamage; },
    /** QA: switch AI fire avoidance off to compare. */
    setFireAvoidance: (on: boolean) => { fireAvoidance = !!on; },
    get propFireState(){return{clock:fx.slicks.clock,burning:[...propFires.burning].map(([i,f])=>({i,...f})),debris:fx.debrisFires().length};},
    /** QA: set loose prop i alight (offline); returns its position. */
    burnProp: (i: number) => { const p = propPoints(activeVenue.props)[i]; if (!p?.kind) return null; propFires.ignite(i, p.kind, fx.slicks.clock, p); return [p.x, p.y, p.z, p.kind]; },
    get surfaceState(){return{ground:fx.evidence.stats,cars:cars.map(c=>({id:c.id,...c.surfaceFinish.stats,scraping:c.scraping,paintVertices:c.panels.reduce((sum,p)=>sum+Array.from(p.geometry.attributes.transferPaint.array).filter((v,i)=>i%4===3&&v>0).length,0),wheels:Array.from(c.wreckParts.wheelDamage,(damage,i)=>({damage,rest:c.controller.wheelSuspensionRestLength(i),stiffness:c.controller.wheelSuspensionStiffness(i),brake:c.controller.wheelBrake(i),steering:c.controller.wheelSteering(i),contact:c.tireContacts[i].active.value,load:c.tireContacts[i].load.value}))}))};},
    get puddles(){return quarry.puddles;},
    get arenaState(){return{...quarry.arenaLayout,expanded:quarry.arenaPhysics.expanded,enabledWalls:quarry.arenaPhysics.walls.filter(c=>c.isEnabled()).length};},
    get artDirection(){return{composition:CHASE_VIEW,scenery:quarry.referenceArena.stats};},
    seedFireTest:(seed:number)=>{
      vehicleFire?.dispose();let randomState=seed>>>0;
      vehicleFire=new VehicleFire(scene,(p,n,t,f)=>fx.emit(p,n,t,f),()=>{randomState=(Math.imul(randomState,1664525)+1013904223)>>>0;return randomState/4294967296;});
      vehicleFire.setQuality(adaptiveGraphics.quality);
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
        debris: fx.debris.length, wallSlams, mirrorsClipped, bumpStarts, aiFireOuts, rideUps, mounts, shrapnelHits, blowUps, chainIgnitions, tipOvers, slowMo: +Math.max(0, slowMoUntil - clock).toFixed(2), dominoes, pinEscapes, sandwiches, huntLeader: drivers.leader, bumperLocks: {made: locksMade, torn: locksTorn, active: bumperLocks.length}, tethers: {made: tethersMade, active: bumperTethers.length}, pileUps, biggestPileUp, debrisAt: fx.debris.map(d=>{const p=d.body.translation();return [+p.x.toFixed(2),+p.y.toFixed(2),+p.z.toFixed(2),+d.body.mass().toFixed(1),+d.age.toFixed(2)];}),
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
    get graphics(){return{choice:settings.quality,active:adaptiveGraphics.quality};},
    setQuality: (v: string) => {
      settings.quality = graphicsChoice(v);
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
        wheelLost: Array.from(c.wreckParts.wheelLost),
        rips: c.rips,
        backfires: c.backfires,
        drips: c.drips.slice(), fov: c.id === 0 ? +camera.fov.toFixed(2) : undefined, status: c.id === 0 && clock < statusUntil ? statusMessage : '', gear: c.gear, rpm: c.rpm, slip: c.slip, wheelSlips: Array.from(c.wheelSlips), drivetrain: !!c.drivetrain, powerScale: c.powerScale, rollBar: c.rollBar.slice(), steerSkew: c.steerSkew, openness: c.openness, hotTime: c.hotTime, engineFires: c.engineFires, smashFires: c.smashFires, beltSlip: c.beltSlip, beltSnapped: c.beltSnapped, squeal: c.squeal, battery: c.battery, bearingWear: Array.from(c.bearingWear), hubDrag: Array.from(c.hubDrag), propBend: c.propBend, propWear: c.propWear, propSnapped: c.propSnapped, propVibration: c.propVibration, roll: Math.asin(Math.max(-1,Math.min(1,c.right.y))), shedKg: c.shedKg, bodyMass: c.body.mass(), bodyCom: c.body.localCom(), slickGrip: c.slickGrip.slice(), rearSlide: c.rearSlide, pitSpins: c.pitSpins, engineOut: c.engineOut, inverted: c.inverted, roofSlideTime: c.roofSlideTime, sideSlideTime: c.sideSlideTime, rollShed: c.rollShed, rollPops: c.rollPops, rolls: c.rolls, pinTime: c.pinTime, pins: c.pins, lockedTo: lockedTo(c.id), aiPhase: drivers.memory.get(c.id)?.phase, aiTarget: drivers.memory.get(c.id)?.target, wreckCause: wreckCauses.get(c.id), wingsTorn: c.wingsTorn, spareWheels: c.spareWheels, tankDown: c.tankDown, tankGone: c.tankGone, throttleCable: c.throttleCable, handbrakeCable: c.handbrakeCable, openDoors: c.openDoorSpans().map(d=>({name:d.name,from:d.from.toArray().map(v=>+v.toFixed(2)),to:d.to.toArray().map(v=>+v.toFixed(2))})), mirrorSpans: c.mirrorSpans().map(d=>({name:d.name,from:d.from.toArray().map(v=>+v.toFixed(2)),to:d.to.toArray().map(v=>+v.toFixed(2))})), oily: c.oily.slice(), blownOut: c.blownOut.slice(), gearLimit: c.gearLimit, steamPuffs: c.steamPuffs, oilLevel: c.oilLevel, coolantLevel: c.coolantLevel, fuelLevel: c.fuelLevel, clutchGrip: c.clutchGrip, clutchStrain: c.clutchStrain, clutchSmoke: c.clutchSmoke, steerPlay: c.steerPlay, doorOpenTime: c.doorOpenTime, doorsTorn: c.doorsTorn, doorSlams: c.doorSlams, rubDrag: Array.from(c.rubDrag), rubSmoke: c.rubSmoke, electricalFault: c.electricalFault, electricalCuts: c.electricalCuts, nutLoose: Array.from(c.nutLoose), wheelsShed: c.wheelsShed, exhaustBlow: c.exhaustBlow, exhaustPops: c.exhaustPops, diffWear: c.diffWear, debeads: c.debeads, steerLink: Array.from(c.steerLink), gearPops: c.gearPops, brakeDrag: Array.from(c.brakeDrag), discHeat: Array.from(c.discHeat), mountsBroken: c.mountsBroken, mountJolts: c.mountJolts, cargoSpilled: c.cargoSpilled, sumpCrack: c.sumpCrack, brakeFires: c.brakeFires, exhaustGone: c.exhaustGone, starterDamage: c.starterDamage, starterFails: c.starterFails, stallTime: c.stallTime, bumpStarts: c.bumpStarts, batteryOut: c.batteryOut, rodStress: c.rodStress, rodThrown: c.rodThrown, rubHeat: Array.from(c.rubHeat).map(v=>+v.toFixed(2)), rubFires: c.rubFires, burnTime: +c.burnTime.toFixed(2), fireSpreads: c.fireSpreads, wheelsRipped: c.wheelsRipped, blownUp: c.blownUp, bodyY: +c.body.translation().y.toFixed(3), bodyVy: +c.body.linvel().y.toFixed(3), wreckBursts: c.wreckBursts, exhaustCrushed: c.exhaustCrushed, underWeight: c.underWeight, tyreAlight: Array.from(c.tyreAlight), extinguishers: c.extinguishers, extinguished: c.extinguished, burning: c.burning, fireHeat: c.fireHeat, oilLevelNow: c.oilLevel, engineStall: c.engineStall, frameBend: c.frameBend, deadTime: c.deadTime, dazed: c.dazed, glassPops: c.glassPops, platesLost: c.platesLost, debrisPunctures: c.debrisPunctures, beadStress: Array.from(c.beadStress), doors: c.wreckParts.assemblies.filter(a=>/door|cargo|tailgate|mirror|boot|bumper/.test(a.name)).map(a=>({name:a.name,loose:a.loose,swing:a.swing??0,damage:a.damage,gone:a.members.every(m=>!m.mesh.visible)})), seized: c.seized, brakeFluid: c.brakeFluid, brokenSprings: c.springBias.filter(v=>v<1).length, brokenShafts: c.driveBias.filter(v=>v<1).length, flameHeat: c.flameHeat, oilSmoke: c.oilSmoke,
        engineDamage: c.engineDamage,
        tyreDamage: c.tyreDamage?.slice(), structure: c.structuralDamage?.slice(),
        partDamage: Object.fromEntries([...new Set(c.panels.map(m=>m.userData.detachAssembly as string|null).filter((v):v is string=>!!v))].map(n=>[n,Math.round(Math.max(0,...c.panels.filter(m=>m.userData.detachAssembly===n&&m.visible).map(m=>m.userData.damage??0)))])),
        detached: c.panels.filter((p) => !p.visible).length,
        glass: c.glass.filter((p) => !p.visible).length,
        position: c.current.toArray(),
        steer: c.steering,
        forward: c.forward.toArray(),
        health: c.health,
      })),
    /** QA: the shockwave of an explosion at a car's position. */
    shockwave:(id:number)=>{const c=cars[id];if(!c)return false;shockwave(c.current.clone(),id);return true;},
    /** QA: a hit at a car-local point travelling along a car-local direction. */
    hitCar:(id:number,local:number[],dir:number[],damage:number)=>{const c=cars[id];if(!c)return false;c.root.updateMatrixWorld(true);const p=new T.Vector3().fromArray(local).applyMatrix4(c.root.matrixWorld),d=new T.Vector3().fromArray(dir).applyQuaternion(c.root.quaternion).normalize();c.hit(p,d,damage,elapsed);return true;},
    velocity: (id: number, x: number, y: number, z: number) =>
      cars[id].body.setLinvel({ x, y, z }, true),
    setHealth: (id: number, h: number) => {
      cars[id].health = h;
    },
    setEngineDamage: (id: number, v: number) => { if (cars[id]?.engineDamage !== undefined && Number.isFinite(v)) cars[id].engineDamage = Math.max(0, Math.min(1, v)); },
    stall: (id: number, seconds: number) => { const c = cars[id]; if (c && c.health > 0 && Number.isFinite(seconds)) { c.engineStall = Math.max(0, Math.min(MAX_ENGINE_RESTART, seconds)); c.rpm = 0; } },
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
    const inactive=new Set<T.Object3D>([quarryVenue,...Object.values(raceVenues),...Object.values(arenaVenues)].filter(v=>v&&v!==activeVenue).map(v=>v!.root));
    const stages:LoadingStage[]=[{name:'Track and vehicles',start:()=>renderer.compileAsync(programWarmupView(scene,inactive),camera,scene)}];
    if(includeStatic&&staticShadows)stages.push({name:'Static shadows',start:()=>renderer.compileAsync(staticShadows!.casterScene,staticShadows!.camera)});
    const waiting=new Set<string>();
    await prepareLoadingStages(stages,event=>{
      console.info('[Quarry loading]',event.stage,event.phase,event.elapsedMs+'ms');
      if(event.phase==='submit')waiting.add(event.stage);if(event.phase==='ready'||event.phase==='failed')waiting.delete(event.stage);
      const label=ui.querySelector('.loading .eyebrow');if(label)label.textContent=event.phase==='submit'?'PREPARING '+event.stage.toUpperCase():waiting.size?'WAITING FOR GRAPHICS: '+[...waiting].join(' / ').toUpperCase():'GRAPHICS READY';
    });
  } finally { renderer.setRenderTarget(previousTarget); }
}
requestAnimationFrame(frame);
boot().catch((e) => {
  console.error(e);
  loading('COULD NOT LOAD — ' + String(e));
});

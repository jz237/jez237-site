import {WaypointRace} from '../src/waypoint-race';
import {HARROW_ARENA,buildHarrowPhysics,harrowGround} from '../src/harrow-arena';
import {createHarrowWorld} from '../src/harrow-world';
import * as Arenas from '../src/arena-id';
import * as GridSetup from '../src/grid-setup';
import * as Grid from '../src/grid-rules';
import * as Timed from '../src/timed-race';
import {AI_DIFFICULTIES,readAIDifficulty,sessionAIDifficulty,difficultyRecordKey} from '../src/ai-difficulty';
import {CollisionScars,captureCollisionMotion,collisionPointVelocity} from '../src/collision-contact';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';
import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {COURSE_NAMES,resolveCourseId,type CourseId} from '../src/course-id';
import {getRaceCourse,courseGridSlot,courseRoute} from '../src/race-course';
import {directionForCar,derbyGridSlot} from '../src/event-rules';
import {CAR_KINDS,DEFINITIONS} from '../src/rules';
import {DERBY_ARENA} from '../src/derby-arena';
import {readGarage,stockSetup} from '../src/garage';
import {demoCarKind,demoVehicleSetup} from '../src/demo-session';
import {ReplayRecorder,replayCourseId,replayCarStride} from '../src/replay-data';

// Actual production handlers, with graphics/audio/Vehicle construction injected.
// Real venue builders and Rapier worlds remain in use. These assertions prove
// lifecycle/plumbing, not lap attainment or real Vehicle handling (browser QA
// and the independent course physics tests cover those).
const source=ts.createSourceFile('main.ts',readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),ts.ScriptTarget.ES2022,true,ts.ScriptKind.TS);
const functions=['ensureVenue','activateVenue','refreshVenueLighting','setQuarryMode','createCars','captureReplay','archiveReplay','beginReplay','openStudio','closeStudio'];
const constants=['preferredCourse','customEvent','aiDifficulty','raceFormat','raceTimeLimit','raceDirection','raceRoute','raceLaps'];
const declarations=functions.map(name=>{
 const node=source.statements.find(s=>ts.isFunctionDeclaration(s)&&s.name?.text===name);assert.ok(node,`Production ${name} exists`);return node.getText(source);
}).concat(constants.map(name=>{
 for(const statement of source.statements)if(ts.isVariableStatement(statement))for(const d of statement.declarationList.declarations)if(ts.isIdentifier(d.name)&&d.name.text===name)return `const ${d.getText(source)};`;
 throw Error(`Missing production ${name}`);
})).join('\n');
const executable=ts.transpileModule(declarations+`\nglobalThis.bindings={${constants.join(',')}};`,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
await R.init();
function harness(){
 const worlds:TrackedWorld[]=[],artworks:any[]=[],log:string[]=[];
 class TrackedWorld extends R.World{
  freed=0;steps=0;
  constructor(gravity:{x:number;y:number;z:number}){super(gravity);worlds.push(this);}
  step(...args:Parameters<R.World['step']>){this.steps++;return super.step(...args);}
  free(){this.freed++;return super.free();}
 }
 const scene=new T.Scene(),quarryRoot=new T.Group(),checkpoint=new T.Group();scene.add(quarryRoot);quarryRoot.add(checkpoint);
 const quarryPhysics=new TrackedWorld({x:0,y:-9.81,z:0}),quarryVenue={course:getRaceCourse('quarry-v1'),physics:quarryPhysics,root:quarryRoot,checkpoint,props:[],puddles:[]};
 const faults:{build?:CourseId;art?:CourseId;clone?:boolean;studio?:boolean}={};
 const art=(id:CourseId)=>{
  if(faults.art===id)throw Error(id+' artwork failed');
  const root=new T.Group(),record={id,root,disposed:0,dispose(){this.disposed++;root.removeFromParent();}};artworks.push(record);return record;
 };
 const clone=checkpoint.clone.bind(checkpoint);checkpoint.clone=(...args)=>{if(faults.clone)throw Error('checkpoint clone failed');return clone(...args);};
 class FixtureCar{
  setup:any;body:R.RigidBody;root=new T.Group();current=new T.Vector3();previous=new T.Vector3();currentQ=new T.Quaternion();paintColor:T.Color;disposed=0;nextCheckpoint=0;passed=0;waters:unknown;onVisualEvent:unknown;
  constructor(readonly id:number,readonly kind:string,paint:number,_scene:T.Scene,readonly world:R.World,_fx:unknown,setup:any,readonly ground:unknown){
   this.setup=setup??stockSetup(kind as any);this.paintColor=new T.Color(paint);this.body=world.createRigidBody(R.RigidBodyDesc.fixed());
  }
  place(x:number,z:number,yaw:number){this.current.set(x,.89,z);this.currentQ.setFromAxisAngle(new T.Vector3(0,1,0),yaw);this.body.setTranslation(this.current,true);}
  preStep(){}postStep(){}render(){}
  dispose(){this.disposed++;this.world.removeRigidBody(this.body);}
 }
 const frame=(cars:any[],props:any[],_epochs:number[],tyreModel?:1,engineModel?:1)=>{const stride=replayCarStride({tyreModel,engineModel});const data=new Float32Array(cars.length*stride+props.length*7);for(let i=0;i<cars.length;i++){const o=i*stride;data[o+6]=1;data[o+14]=100;for(let w=0;w<4;w++){data[o+21+w*8]=1;data[o+57+w*6]=1;}}return data;};
 const context:any={...Arenas,HARROW_ARENA,buildHarrowPhysics,harrowGround,createHarrowWorld,arenaVenues:{},director:{},...GridSetup,...Grid,...Timed,...Timed,T,AI_DIFFICULTIES,readAIDifficulty,sessionAIDifficulty,difficultyRecordKey,activeTimeTrial:null,structuredClone,R:{...R,World:TrackedWorld},scene,quarryVenue,activeVenue:quarryVenue,physics:quarryPhysics,raceVenues:{},COURSE_NAMES,resolveCourseId,
  getRaceCourse(id:CourseId='quarry-v1'){const course=getRaceCourse(id);if(faults.build===id)return{...course,buildPhysics(api:typeof R,world:R.World){world.createRigidBody(api.RigidBodyDesc.fixed());throw Error(id+' physics failed');}};return course;},
  createAshfordWorld:()=>art('ashford-autodrome-v1'),createIronfieldWorld:()=>art('ironfield-figure-eight-v1'),createCinderbankWorld:()=>art('cinderbank-oval-v1'),createBrackenWorld:()=>art('bracken-rallycross-v1'),createRedbankWorld:()=>art('redbank-jump-v1'),
  staticShadows:{replaceCasters(root:unknown){log.push('casters '+(root===context.activeVenue.root));},bindReceivers(){log.push('receivers');}},reflections:{invalidate(){log.push('reflections');}},
  quarry:{checkpoint,modeScenery:[],props:[],sun:{shadow:{needsUpdate:false}},collisionPhysics:{statics:new Map()},arenaPhysics:{walls:[]},setMode(){log.push('quarry mode');},resetProps(){log.push('reset props');}},quarryMode:'derby',
  kind:'coupe',mode:'race',demo:false,online:{active:false},onlineRules:()=>context.online.network?.snapshot?.event?.rules,
  activeClubRound:null,clubCup:null,round:null,clubRound:()=>context.round,activeChallenge:undefined,traffic:false,
  eventOptions:{course:'cinderbank-oval-v1',race:'laps',laps:1,field:8,direction:'forward'},demoOptions:{course:'cinderbank-oval-v1',field:11,lineup:'mixed',setups:'stock',laps:1},
  waypointRace:null,WaypointRace,courseRoute,courseGridSlot,directionForCar,derbyGridSlot,DERBY_ARENA,DEFINITIONS,CAR_KINDS,demoCarKind,demoVehicleSetup,
  stockSetup,Vehicle:FixtureCar,cars:[],garage:readGarage(),bankRun(){log.push('bank');},drivers:{reset(){log.push('drivers reset');}},combat:{reset(){}},
  sound:{clearCars(){},attach(){},pause(value:boolean){log.push('sound '+value);}},vehicleFire:undefined,puddleSplashes:undefined,
  fx:{world:quarryPhysics,groundHeight:quarryVenue.course.height,reset(){log.push('effects reset');},debris:[],evidence:{}},events:{clear(){log.push('events clear');}},collisionScars:new CollisionScars(),captureCollisionMotion,collisionPointVelocity,impactAdjudicator:{clear(){log.push('impacts clear');}},collisions:19,
  ReplayRecorder,replayCourseId,captureReplayFrame:frame,recorder:null,lastReplay:null,replayEpochs:[],elapsed:0,studio:null,studioRestore:null,preparingEvent:false,state:'result',
  ui:{childNodes:[{tag:'original'}],replaceChildren(...nodes:unknown[]){this.childNodes=nodes as any;},querySelector(){return null;}},closeReplayLibrary:null,
  camera:new T.PerspectiveCamera(),renderer:{toneMappingExposure:1.2},orbit:{target:new T.Vector3(2,3,4),enabled:false,enablePan:false,maxDistance:22,minDistance:2.5},keys:new Set(['KeyW']),lastFrame:0,accumulator:.01,performance:{now:()=>123},
  ReplayScene:class{cars:any[]=[];props:any[]=[];constructor(readonly doc:unknown,_scene:unknown,readonly world:R.World,_props:unknown,readonly course:any){log.push('replay world '+course.id);if(faults.studio)throw Error('Replay construction failed');}seek(){}dispose(){log.push('dispose replay');}},
  ReplayStudio:class{constructor(ui:any){ui.replaceChildren({tag:'studio'});}},
 };
 runInNewContext(executable,context);
 return{c:context,worlds,artworks,log,faults,close(){for(const world of worlds)if(!world.freed)world.free();}};
}

test('production venue cache owns three distinct worlds, activates one scene, and preserves retained Quarry across switches',()=>{
 const h=harness();try{
  const c=h.c,quarry=c.ensureVenue('quarry-v1'),iron=c.ensureVenue('ironfield-figure-eight-v1'),cinder=c.ensureVenue('cinderbank-oval-v1');
  assert.equal(c.ensureVenue('cinderbank-oval-v1'),cinder);assert.equal(c.ensureVenue('ironfield-figure-eight-v1'),iron);assert.equal(h.worlds.length,3);
  assert.deepEqual(h.artworks.map(a=>a.id),['ironfield-figure-eight-v1','cinderbank-oval-v1']);assert.notEqual(iron.physics,cinder.physics);assert.notEqual(quarry.physics,cinder.physics);
  assert.ok(iron.physics.colliders.len()>1&&cinder.physics.colliders.len()>1);assert.equal(cinder.checkpoint.name,'cinderbank-oval-v1_checkpoint');assert.equal(iron.root.visible,false);assert.equal(cinder.root.visible,false);
  const counts=[quarry,iron,cinder].map(v=>[v.physics.bodies.len(),v.physics.colliders.len()]);
  for(const venue of [cinder,iron,quarry,cinder]){c.activateVenue(venue);assert.equal(c.physics,venue.physics);assert.equal(c.activeVenue,venue);assert.deepEqual([quarry,iron,cinder].map(v=>v.root.visible),[quarry,iron,cinder].map(v=>v===venue));}
  const calls=h.log.length;c.activateVenue(cinder);assert.equal(h.log.length,calls,'Cached same-venue activation does not rebuild lighting');
  assert.deepEqual([quarry,iron,cinder].map(v=>[v.physics.bodies.len(),v.physics.colliders.len()]),counts);assert.equal(c.quarry.sun.shadow.needsUpdate,true);
  cinder.dispose();assert.equal(cinder.physics.freed,1);assert.equal(h.artworks[1].disposed,1);assert.equal(cinder.root.parent,null);assert.equal(cinder.checkpoint.parent,null);assert.equal(iron.physics.freed,0);assert.equal(quarry.physics.freed,0);
 }finally{h.close();}
});

test('failed Cinderbank physics, art or checkpoint construction frees its partial world without caching or touching live cars',()=>{
 for(const fault of ['build','art','clone'] as const){const h=harness();try{
  const c=h.c;c.createCars(true);const old=c.cars[0],oldWorld=c.physics,steps=oldWorld.steps;h.log.length=0;
  if(fault==='clone')h.faults.clone=true;else h.faults[fault]='cinderbank-oval-v1';
  assert.throws(()=>c.createCars(),/failed/);assert.equal(c.activeVenue,c.quarryVenue);assert.equal(c.physics,oldWorld);assert.equal(c.fx.world,oldWorld);assert.equal(c.cars[0],old);assert.equal(old.disposed,0);assert.equal(oldWorld.steps,steps);assert.equal(c.raceVenues['cinderbank-oval-v1'],undefined);assert.deepEqual(h.log,[],'Venue preflight precedes bank/archive/reset');assert.equal(h.worlds.at(-1)!.freed,1);
  if(fault==='clone')assert.equal(h.artworks[0].disposed,1);
  delete h.faults.build;delete h.faults.art;h.faults.clone=false;c.createCars();assert.equal(c.activeVenue.course.id,'cinderbank-oval-v1');assert.equal(old.disposed,1);assert.equal(c.cars.length,8);
 }finally{h.close();}}
});

test('actual createCars binds course/world/effects and exact ordered grids through forward, reverse, opposing and Quarry attraction',()=>{
 const h=harness();try{
  const c=h.c;
  for(const direction of ['forward','reverse','opposing']){
   c.eventOptions.direction=direction;c.createCars();const venue=c.activeVenue;assert.equal(venue.course.id,'cinderbank-oval-v1');assert.equal(c.fx.world,venue.physics);assert.equal(c.fx.groundHeight,venue.course.height);assert.equal(c.collisions,0);
   c.cars.forEach((car:any,i:number)=>{const grid=courseGridSlot(venue.course,i,direction as any);assert.equal(car.world,venue.physics);assert.equal(car.ground,venue.course);assert.equal(car.waters,venue.puddles);assert.deepEqual(car.current.toArray(),[grid.x,.89,grid.z]);assert.equal(car.nextCheckpoint,grid.next);assert.equal(car.passed,grid.passed);assert.equal(c.bindings.raceRoute(i),courseRoute(venue.course,directionForCar(direction as any,i)));});
  }
  const prior=c.cars.slice(),cinder=c.activeVenue,cinderSteps=cinder.physics.steps,counts=cinder.physics.bodies.len();c.createCars(true);
  assert.equal(c.activeVenue,c.quarryVenue);assert.equal(c.physics,c.quarryVenue.physics);assert.equal(c.fx.world,c.quarryVenue.physics);assert.equal(c.cars.length,1);assert.equal(c.cars[0].ground,getRaceCourse('quarry-v1'));assert.deepEqual(c.cars[0].current.toArray(),[0,.89,-13]);assert.ok(prior.every((car:any)=>car.disposed===1));assert.equal(cinder.physics.steps,cinderSteps);assert.equal(cinder.physics.bodies.len(),counts-8,'Only car bodies removed from retained venue');
 }finally{h.close();}
});

test('production preference routing preserves old defaults and allows waypoint venues while preserving nonrace and online defaults',()=>{
 const h=harness();try{
  const c=h.c,f=c.bindings.preferredCourse;assert.equal(f(),'cinderbank-oval-v1');
  c.eventOptions.course=undefined;assert.equal(f(),'quarry-v1');c.eventOptions.course='ironfield-figure-eight-v1';assert.equal(f(),'ironfield-figure-eight-v1');
  c.demo=true;assert.equal(f(),'cinderbank-oval-v1');c.mode='derby';assert.equal(f(),'quarry-v1');c.mode='playground';assert.equal(f(),'quarry-v1');
  c.demo=false;c.mode='race';c.eventOptions.course='cinderbank-oval-v1';for(const race of ['ordered','free','random']){c.eventOptions.race=race;assert.equal(f(),'cinderbank-oval-v1');}c.eventOptions.race='laps';
  c.online.active=true;assert.equal(f(),'quarry-v1');c.online.active=false;c.activeChallenge={id:'original'};assert.equal(f(),'quarry-v1');c.activeChallenge.course='ironfield-figure-eight-v1';assert.equal(f(),'ironfield-figure-eight-v1');
  c.round={course:'quarry-v1'};assert.equal(f(),'quarry-v1');c.round={course:'ironfield-figure-eight-v1'};assert.equal(f(),'ironfield-figure-eight-v1');
 }finally{h.close();}
});

test('actual recording and studio handlers activate recorded Cinderbank then restore exact Quarry context; failures restore too',()=>{
 const h=harness();try{
  const c=h.c;c.eventOptions.direction='reverse';c.createCars();c.beginReplay();c.elapsed=1;c.captureReplay(true);const doc=c.recorder.document();assert.equal(doc.meta.courseId,'cinderbank-oval-v1');assert.equal(doc.meta.reverse,true);assert.equal(doc.meta.props,0);assert.equal(doc.frames.length,2);
  c.createCars(true);c.state='menu';const before={world:c.physics,venue:c.activeVenue,cars:c.cars,nodes:c.ui.childNodes.slice(),camera:c.camera.matrixWorld.clone(),target:c.orbit.target.clone(),counts:h.worlds.map(w=>w.bodies.len())};
  assert.equal(c.openStudio(false,doc),true);assert.equal(c.state,'studio');assert.equal(c.activeVenue.course.id,'cinderbank-oval-v1');assert.equal(c.physics,c.raceVenues['cinderbank-oval-v1'].physics);assert.ok(h.log.includes('replay world cinderbank-oval-v1'));c.camera.position.set(100,100,100);c.closeStudio();
  assert.equal(c.state,'menu');assert.equal(c.physics,before.world);assert.equal(c.activeVenue,before.venue);assert.equal(c.cars,before.cars);assert.deepEqual(c.ui.childNodes,before.nodes);assert.deepEqual(c.camera.position.toArray(),[0,0,0]);assert.deepEqual(c.orbit.target.toArray(),before.target.toArray());assert.deepEqual(h.worlds.map(w=>w.bodies.len()),before.counts);assert.equal(c.studio,null);
  h.faults.studio=true;assert.throws(()=>c.openStudio(false,doc),/Replay construction failed/);assert.equal(c.state,'menu');assert.equal(c.physics,before.world);assert.equal(c.cars,before.cars);assert.deepEqual(c.ui.childNodes,before.nodes);assert.equal(c.studioRestore,null);
  assert.throws(()=>c.openStudio(false,{...doc,meta:{...doc.meta,props:1}}),/unsupported course layout/);assert.equal(c.physics,before.world);assert.equal(c.cars,before.cars);
 }finally{h.close();}
});

test('production car creation selects independent custom/demo difficulty and resets fixed-rule and attract drivers',()=>{
 const h=harness();try{const c=h.c;c.eventOptions.difficulty='novice';c.demoOptions.difficulty='expert';
  c.createCars();assert.equal(c.drivers.difficulty,'novice');
  c.demo=true;c.createCars();assert.equal(c.drivers.difficulty,'expert');
  c.demo=false;c.activeChallenge={course:'cinderbank-oval-v1',laps:1};c.createCars();assert.equal(c.drivers.difficulty,'amateur');
  c.activeChallenge=undefined;c.mode='playground';c.createCars();assert.equal(c.drivers.difficulty,'amateur');
  c.mode='race';c.createCars();assert.equal(c.drivers.difficulty,'novice');c.createCars(true);assert.equal(c.drivers.difficulty,'amateur');
 }finally{h.close();}
});


test('Bracken event, demo, time trial and replay use an isolated hilly world then restore the previous venue',()=>{
 const h=harness();try{const c=h.c,old=c.ensureVenue('cinderbank-oval-v1'),venue=c.ensureVenue('bracken-rallycross-v1');
  assert.notEqual(venue.physics,old.physics);assert.equal(c.ensureVenue('bracken-rallycross-v1'),venue);assert.equal(venue.checkpoint.name,'bracken-rallycross-v1_checkpoint');
  c.eventOptions.course='bracken-rallycross-v1';for(const direction of ['forward','reverse','opposing']){c.eventOptions.direction=direction;c.createCars();assert.equal(c.activeVenue,venue);assert.equal(c.fx.groundHeight,venue.course.height);for(const car of c.cars)assert.equal(car.ground,venue.course);}
  c.demoOptions.course='bracken-rallycross-v1';c.demo=true;c.createCars();assert.equal(c.activeVenue,venue);assert.equal(c.cars.length,11);
  c.demo=false;c.activeTimeTrial={kind:'tern',course:'bracken-rallycross-v1',direction:'reverse'};c.createCars();assert.equal(c.activeVenue,venue);assert.equal(c.cars.length,1);c.beginReplay();c.elapsed=1;c.captureReplay(true);const doc=c.recorder.document();assert.equal(doc.meta.courseId,'bracken-rallycross-v1');assert.equal(doc.meta.reverse,true);
  c.activeTimeTrial=null;c.createCars(true);c.state='menu';const previous=c.activeVenue;assert.equal(c.openStudio(false,doc),true);assert.equal(c.activeVenue,venue);c.closeStudio();assert.equal(c.activeVenue,previous);assert.equal(venue.root.visible,false);assert.equal(c.physics,previous.physics);assert.equal(old.physics.freed,0);
 }finally{h.close();}
});

test('production grids enforce lineup and build rules for races, derbies and demos while excluding trials, challenges and playground',async()=>{
 await R.init();const h=harness();
 try{
  h.c.garage.cars.tern.setup={...stockSetup('tern'),paint:0x123456,engine:3,tires:2,armor:1,tune:{gearing:.7,suspension:.2,steering:-.4,brakeBias:.1,differential:.5}};h.c.kind='tern';
  const saved=JSON.stringify(h.c.garage);
  for(const mode of ['race','derby'])for(const lineup of ['selected','drivetrain','weight'])for(const performance of ['stock','matched']){
   Object.assign(h.c.eventOptions,{field:24,lineup,performance});h.c.mode=mode;h.c.createCars();
   assert.equal(h.c.cars.length,24);assert.ok(h.c.cars.every((c:any)=>Grid.gridPool('tern',lineup as any).includes(c.kind)));assert.ok(h.c.cars.every((c:any)=>c.setup.engine===(performance==='stock'?0:3)));assert.equal(h.c.cars[0].setup.paint,0x123456);
  }
  h.c.demo=true;Object.assign(h.c.demoOptions,{field:24,lineup:'weight',setups:'matched'});h.c.createCars();assert.ok(h.c.cars.every((c:any)=>Grid.vehicleWeightClass(c.kind)==='Light'&&c.setup.engine===3));
  h.c.demo=false;h.c.mode='playground';h.c.traffic=true;h.c.createCars();assert.equal(h.c.cars.length,5);assert.equal(h.c.cars[0].setup.engine,3);assert.ok(h.c.cars.slice(1).every((c:any)=>c.setup.engine===0));
  h.c.mode='race';h.c.activeChallenge={id:'fixture',course:'quarry-v1',mode:'race'};h.c.createCars();assert.equal(h.c.cars.length,8);assert.ok(h.c.cars.every((c:any)=>c.setup.engine===0));
  h.c.activeChallenge=undefined;h.c.activeTimeTrial={kind:'tern',course:'quarry-v1',direction:'forward'};h.c.createCars();assert.equal(h.c.cars.length,1);assert.equal(h.c.cars[0].setup.engine,0);assert.equal(JSON.stringify(h.c.garage),saved);
 }finally{h.close();}
});


test('Redbank owns a distinct live world and actual production grid; replay restores its course',()=>{
 const h=harness();try{
  const c=h.c;c.eventOptions.course='redbank-jump-v1';c.eventOptions.field=24;c.createCars();
  assert.equal(c.activeVenue.course.id,'redbank-jump-v1');assert.equal(c.cars.length,24);assert.equal(h.artworks.at(-1)?.id,'redbank-jump-v1');
  for(const car of c.cars){const slot=courseGridSlot(getRaceCourse('redbank-jump-v1'),car.id,'forward');assert.equal(car.current.x,slot.x);assert.equal(car.current.z,slot.z);}
  c.beginReplay();assert.equal(c.recorder.meta.courseId,'redbank-jump-v1');
 }finally{h.close();}
});

test('Ashford owns a distinct live world and actual production grid; replay restores its course',()=>{
 const h=harness();try{
  const c=h.c;c.eventOptions.course='ashford-autodrome-v1';c.eventOptions.field=24;c.createCars();
  assert.equal(c.activeVenue.course.id,'ashford-autodrome-v1');assert.equal(c.cars.length,24);assert.equal(h.artworks.at(-1)?.id,'ashford-autodrome-v1');
  for(const car of c.cars){const slot=courseGridSlot(getRaceCourse('ashford-autodrome-v1'),car.id,'forward');assert.equal(car.current.x,slot.x);assert.equal(car.current.z,slot.z);}
  c.beginReplay();assert.equal(c.recorder.meta.courseId,'ashford-autodrome-v1');
 }finally{h.close();}
});

test('Harrow custom/demo worlds preserve circuit choices, ground, grid, camera bounds and recorded arena identity',()=>{
 const h=harness();try{
  const c=h.c;c.mode='derby';c.eventOptions.arena='harrow-bowl-v1';c.eventOptions.field=24;c.createCars();
  const arena=c.activeVenue;assert.equal(arena.arenaId,'harrow-bowl-v1');assert.notEqual(arena.physics,c.quarryVenue.physics);assert.equal(c.cars.length,24);assert.equal(c.eventOptions.course,'cinderbank-oval-v1');
  assert.equal(c.drivers.arena,HARROW_ARENA);assert.equal(c.director.arena,HARROW_ARENA);
  for(const car of c.cars){const slot=derbyGridSlot(car.id,24,HARROW_ARENA);assert.equal(car.current.x,slot.x);assert.equal(car.current.z,slot.z);assert.equal(car.ground.surface(0,0),'asphalt');assert.equal(car.arenaSurface,undefined);}
  c.beginReplay();c.elapsed=1;c.captureReplay(true);const doc=c.recorder.document();assert.equal(doc.meta.arenaId,'harrow-bowl-v1');assert.equal(doc.meta.props,0);assert.equal(doc.meta.courseId,undefined);
  c.createCars(true);c.state='menu';const prior=c.cars;assert.equal(c.activeVenue,c.quarryVenue);assert.equal(c.director.arena,DERBY_ARENA);
  assert.equal(c.openStudio(false,doc),true);assert.equal(c.activeVenue,arena);assert.equal(c.director.arena,HARROW_ARENA);c.closeStudio();assert.equal(c.activeVenue,c.quarryVenue);assert.equal(c.cars,prior);assert.equal(c.director.arena,DERBY_ARENA);
  c.demo=true;c.createCars();assert.equal(c.activeVenue,c.quarryVenue,'demo has independent arena preference');c.demoOptions.arena='harrow-bowl-v1';c.createCars();assert.equal(c.activeVenue,arena);
  c.mode='race';c.createCars();assert.equal(c.activeVenue.course.id,'cinderbank-oval-v1');assert.equal(c.activeVenue.arenaId,undefined);assert.equal(c.demoOptions.arena,'harrow-bowl-v1');
  c.mode='derby';c.demo=false;c.activeChallenge={id:'fixture',course:'quarry-v1',mode:'derby'};c.createCars();assert.equal(c.activeVenue,c.quarryVenue,'fixed challenges keep their existing arena');
 }finally{h.close();}
});

test('all production waypoint grids and recordings use their selected venue in solo and demo modes',()=>{
 for(const id of Object.keys(COURSE_NAMES) as CourseId[])for(const format of ['ordered','free','random'] as const)for(const demo of [false,true]){
  const h=harness();try{const c=h.c;c.demo=demo;c.eventOptions.course=id;c.eventOptions.race=format;c.demoOptions.course=id;c.demoOptions.race=format;c.createCars();
   assert.equal(c.activeVenue.course.id,id);assert.ok(c.waypointRace instanceof WaypointRace);assert.equal(c.waypointRace.order,format);assert.deepEqual(c.waypointRace.stations.map((p:any)=>({x:p.x,z:p.z})),[0,3,7,11,15,19].map(i=>getRaceCourse(id).checkpoints[i]));
   const direction=c.waypointRace.startDirection();for(const car of c.cars){const spawn=courseGridSlot(getRaceCourse(id),car.id,direction);assert.ok(Math.abs(car.current.x-spawn.x)<1e-7);assert.ok(Math.abs(car.current.z-spawn.z)<1e-7);assert.equal(car.passed,0);}
   c.beginReplay();assert.equal(c.recorder.meta.courseId,id==='quarry-v1'?undefined:id);
  }finally{h.close();}
 }
});

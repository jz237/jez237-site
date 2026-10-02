import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import ts from 'typescript';
import {normalizeCinderbankSource,readCinderbankPrevious,restoreCinderbankPlayabilityBytes,verifyCinderbankPlayabilityRevision} from './cinderbank-playability-invariants';
import {restoreHandbrakePlayabilityBytes,readHandbrakePrevious} from './handbrake-playability-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
const hash=(bytes:Uint8Array|string)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(readFileSync(new URL('./fixtures/cinderbank-playability/revision.json',import.meta.url)).toString());
function declarations(text:string,names:readonly string[]):Record<string,string>{
 const parsed=ts.createSourceFile('main.ts',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
 return Object.fromEntries(names.map(name=>{
  const found:string[]=[];
  for(const statement of parsed.statements){
   if(ts.isFunctionDeclaration(statement)&&statement.name?.text===name)found.push(statement.getText(parsed));
   if(ts.isVariableStatement(statement))for(const declaration of statement.declarationList.declarations)
    if(ts.isIdentifier(declaration.name)&&declaration.name.text===name)found.push(statement.getText(parsed));
  }
  assert.equal(found.length,1,name);return[name,found[0]];
 }));
}
test('Cinderbank adds one immutable leaf preserving all 767 earlier fixtures and protected source/assets',()=>{
 verifyCinderbankPlayabilityRevision();
 assert.deepEqual(Object.keys(revision().files).sort(),[
  "src/course-id.ts",
  "src/race-course.ts",
  "src/main.ts",
  "src/replay-data.ts",
  "src/replay-library.ts",
  "src/event-rules.ts",
  "src/cinderbank-course.ts",
  "src/cinderbank-world.ts",
  "tests/cinderbank.test.ts",
  "tests/cinderbank-main.test.ts",
  "tests/cinderbank-settings-replay.test.ts",
  "tests/ironfield.test.ts",
  "tests/challenge-playability.test.ts",
  "tests/handbrake-playability-history.test.ts",
  "tests/challenge-playability-history.test.ts",
  "tests/handbrake-playability-invariants.ts",
  "tests/controller-playability-history.test.ts",
  "tests/club-cup-main.test.ts",
  "tests/cinderbank-playability-invariants.ts",
  "tests/cinderbank-playability-history.test.ts",
  "tools/record-cinderbank-playability-revision.py"
].sort());
});

test('all existing production bytes outside the reviewed course integration remain published',()=>{
 const changes:Record<string,readonly (readonly [string,string])[]>={
  "src/course-id.ts": [
    [
      "",
      " 'cinderbank-oval-v1':'Cinderbank Speedway',\n"
    ]
  ],
  "src/race-course.ts": [
    [
      "",
      "import {CINDERBANK} from './cinderbank-course';\n"
    ],
    [
      "",
      " /** Wide circuits include their usable shoulders; legacy courses keep 12m. */\n readonly checkpointRadius?:number;\n"
    ],
    [
      "export const getRaceCourse=(id:CourseId='quarry-v1'):RaceCourse=>id==='ironfield-figure-eight-v1'?IRONFIELD:QUARRY_COURSE;\nconst ironfieldReverse=[IRONFIELD.checkpoints[0],...IRONFIELD.checkpoints.slice(1).reverse()];\n",
      "const COURSES:Record<CourseId,RaceCourse>={'quarry-v1':QUARRY_COURSE,'ironfield-figure-eight-v1':IRONFIELD,'cinderbank-oval-v1':CINDERBANK};\nexport const getRaceCourse=(id:CourseId='quarry-v1'):RaceCourse=>COURSES[id];\nconst reverseRoutes=new WeakMap<RaceCourse,readonly RoutePoint[]>();\n"
    ],
    [
      " return direction==='reverse'?ironfieldReverse:IRONFIELD.checkpoints;\n",
      " if(direction!=='reverse')return course.checkpoints;\n let route=reverseRoutes.get(course);\n if(!route){route=[course.checkpoints[0],...course.checkpoints.slice(1).reverse()];reverseRoutes.set(course,route);}\n return route;\n"
    ],
    [
      "/** Keep every old Quarry grid value exact. Ironfield is arc-length sampled. */\n",
      "/** Keep every old Quarry grid value exact. Other circuits are arc-length sampled. */\n"
    ]
  ],
  "src/main.ts": [
    [
      "",
      "import {createCinderbankWorld} from './cinderbank-world';\r\n"
    ],
    [
      "let quarryVenue:VenueContext,activeVenue:VenueContext,ironfieldVenue:VenueContext|undefined;\r\n",
      "let quarryVenue:VenueContext,activeVenue:VenueContext;\r\nconst raceVenues:Partial<Record<Exclude<CourseId,'quarry-v1'>,VenueContext>>={};\r\n"
    ],
    [
      "  if(ironfieldVenue)return ironfieldVenue;\r\n",
      "  const cached=raceVenues[id];if(cached)return cached;\r\n"
    ],
    [
      "  let artwork:ReturnType<typeof createIronfieldWorld>|undefined;\r\n",
      "  let artwork:{root:T.Group;dispose():void}|undefined;\r\n"
    ],
    [
      "    const course=getRaceCourse(id);course.buildPhysics!(R,world);artwork=createIronfieldWorld();\r\n    const checkpoint=quarry.checkpoint.clone(true);checkpoint.name='ironfield_checkpoint';checkpoint.visible=false;artwork.root.add(checkpoint);artwork.root.visible=false;scene.add(artwork.root);\r\n    ironfieldVenue={course,physics:world,root:artwork.root,checkpoint,props:[],puddles:[],dispose:()=>{checkpoint.removeFromParent();artwork!.dispose();world.free();}};\r\n    return ironfieldVenue;\r\n",
      "    const course=getRaceCourse(id);course.buildPhysics!(R,world);artwork=id==='cinderbank-oval-v1'?createCinderbankWorld():createIronfieldWorld();\r\n    const checkpoint=quarry.checkpoint.clone(true);checkpoint.name=id+'_checkpoint';checkpoint.visible=false;artwork.root.add(checkpoint);artwork.root.visible=false;scene.add(artwork.root);\r\n    const venue:VenueContext={course,physics:world,root:artwork.root,checkpoint,props:[],puddles:[],dispose:()=>{checkpoint.removeFromParent();artwork!.dispose();world.free();}};\r\n    raceVenues[id]=venue;return venue;\r\n"
    ],
    [
      "  ui.innerHTML = `<div class=\"menu\"><div class=\"topbar\"><div class=\"brand\"><i></i> BLACKRIDGE MOTOR CLUB</div><div class=\"location\">WOODLAND COUNTY &nbsp; / &nbsp; <b>17:42</b> &nbsp; / &nbsp; DRY TRACK</div></div><div class=\"intro\"><div class=\"eyebrow\">FULL CONTACT / NO APOLOGIES</div><h1>QUARRY<br><span>IMPACT</span></h1><p>Precision machines. Unforgiving ground.<br>Take the long way home \u2014 if it still runs.</p><div class=\"car-picker\">${(Object.keys(DEFINITIONS) as CarKind[]).map((k) => `<button data-car=\"${k}\" class=\"${k === kind ? 'active' : ''}\">${DEFINITIONS[k].name}</button>`).join('')}</div><div class=\"spec\">${DEFINITIONS[kind].subtitle.toUpperCase()}</div></div><div class=\"menu-bottom\">${(Object.keys(modes) as Mode[]).map((m, i) => `<button class=\"mode-card ${m === mode ? 'active' : ''}\" data-mode=\"${m}\"><span class=\"number\">0${i + 1} / ${m === 'derby' ? 'SURVIVAL' : m === 'race' ? 'COMPETITION' : 'EXPLORATION'}</span><strong>${m==='race'?raceLabel(eventOptions.race==='laps'?resolveCourseId(eventOptions.course):'quarry-v1'):modes[m].label}</strong><small>${m==='race'?`${RACE_NAMES[eventOptions.race]} \u00b7 ${eventOptions.laps} ${eventOptions.race==='laps'?(eventOptions.laps===1?'lap':'laps')+' \u00b7 '+eventOptions.direction:eventOptions.laps===1?'round':'rounds'} \u00b7 ${eventOptions.field} cars`:m==='derby'?`${eventOptions.derby==='score'?'Score derby \u00b7 respawns':'Last car standing'} \u00b7 ${eventOptions.field} cars`:modes[m].description}</small></button>`).join('')}<button class=\"primary\" id=\"start\">${modes[mode].button}<span>\u2197</span></button></div><div class=\"footer\"><span>${CAR_KINDS.length} MACHINES &nbsp; \u00b7 &nbsp; TWO VENUES &nbsp; \u00b7 &nbsp; NO PRISTINE FINISHES</span><div><a href=\"./licenses/CREDITS.md\" target=\"_blank\" rel=\"noopener\">CREDITS</a><button id=\"settings\">SETTINGS</button><button id=\"fullscreen\">FULLSCREEN \u2197</button></div></div></div>`;\r\n",
      "  ui.innerHTML = `<div class=\"menu\"><div class=\"topbar\"><div class=\"brand\"><i></i> BLACKRIDGE MOTOR CLUB</div><div class=\"location\">WOODLAND COUNTY &nbsp; / &nbsp; <b>17:42</b> &nbsp; / &nbsp; DRY TRACK</div></div><div class=\"intro\"><div class=\"eyebrow\">FULL CONTACT / NO APOLOGIES</div><h1>QUARRY<br><span>IMPACT</span></h1><p>Precision machines. Unforgiving ground.<br>Take the long way home \u2014 if it still runs.</p><div class=\"car-picker\">${(Object.keys(DEFINITIONS) as CarKind[]).map((k) => `<button data-car=\"${k}\" class=\"${k === kind ? 'active' : ''}\">${DEFINITIONS[k].name}</button>`).join('')}</div><div class=\"spec\">${DEFINITIONS[kind].subtitle.toUpperCase()}</div></div><div class=\"menu-bottom\">${(Object.keys(modes) as Mode[]).map((m, i) => `<button class=\"mode-card ${m === mode ? 'active' : ''}\" data-mode=\"${m}\"><span class=\"number\">0${i + 1} / ${m === 'derby' ? 'SURVIVAL' : m === 'race' ? 'COMPETITION' : 'EXPLORATION'}</span><strong>${m==='race'?raceLabel(eventOptions.race==='laps'?resolveCourseId(eventOptions.course):'quarry-v1'):modes[m].label}</strong><small>${m==='race'?`${RACE_NAMES[eventOptions.race]} \u00b7 ${eventOptions.laps} ${eventOptions.race==='laps'?(eventOptions.laps===1?'lap':'laps')+' \u00b7 '+eventOptions.direction:eventOptions.laps===1?'round':'rounds'} \u00b7 ${eventOptions.field} cars`:m==='derby'?`${eventOptions.derby==='score'?'Score derby \u00b7 respawns':'Last car standing'} \u00b7 ${eventOptions.field} cars`:modes[m].description}</small></button>`).join('')}<button class=\"primary\" id=\"start\">${modes[mode].button}<span>\u2197</span></button></div><div class=\"footer\"><span>${CAR_KINDS.length} MACHINES &nbsp; \u00b7 &nbsp; ${Object.keys(COURSE_NAMES).length} VENUES &nbsp; \u00b7 &nbsp; NO PRISTINE FINISHES</span><div><a href=\"./licenses/CREDITS.md\" target=\"_blank\" rel=\"noopener\">CREDITS</a><button id=\"settings\">SETTINGS</button><button id=\"fullscreen\">FULLSCREEN \u2197</button></div></div></div>`;\r\n"
    ],
    [
      "  ui.innerHTML = `<div class=\"hud\"><div class=\"hud-top\"><div><div class=\"eyebrow\">BLACKRIDGE / ${mode === 'race' ? activeVenue.course.id==='quarry-v1'?'CIRCUIT 01':'IRONFIELD RACEWAY' : 'QUARRY FLOOR'}</div><div class=\"hud-title\">${eventLabel()}</div></div><div class=\"event-stats\"><div><span id=\"event-label\">${mode === 'derby' ? 'REMAINING' : mode === 'race' ? 'POSITION' : 'FREE DRIVE'}</span><strong id=\"event-value\">${cars.length} / ${cars.length}</strong></div><div><span>${mode === 'race' ? 'LAP / TIME' : mode === 'derby' ? 'TIME LEFT' : 'SESSION'}</span><strong id=\"time-value\">05:00</strong></div><button class=\"small-button\" id=\"pause\">\u2161</button></div></div><canvas class=\"minimap\" id=\"map\" width=\"400\" height=\"400\"></canvas><div class=\"status\"><div class=\"status-row\"><span>${DEFINITIONS[kind].name}</span><b id=\"health\">100%</b></div><div class=\"condition\"><b id=\"health-bar\" style=\"width:100%\"></b></div><div class=\"subsystems\"><span id=\"engine-status\">ENGINE OK</span><span id=\"steer-status\">STEERING OK</span><span id=\"surface\">GRAVEL</span></div><div class=\"tyre-status\" id=\"tyre-status\"></div></div><div class=\"speed\"><strong id=\"speed\">0</strong> <span>KM/H</span><small id=\"gear\">GEAR 1 &nbsp; / &nbsp; 850 RPM</small><div class=\"rpm\"><b id=\"rpm-bar\"></b></div></div><div class=\"controls\"><kbd>${['throttle','reverse','left','right'].map(a=>keyLabel(drivingControls.keys[a as 'throttle'][0])).join(' ')}</kbd> DRIVE <kbd>${keyLabel(drivingControls.keys.handbrake[0])}</kbd> HANDBRAKE <kbd>C</kbd> CAMERA <kbd>R</kbd> RECOVER ${mode === 'playground' && !online?.active ? '<kbd>I</kbd> INSPECT <kbd>T</kbd> TRAFFIC' : ''}</div><div class=\"center-message\" id=\"countdown\"></div><div id=\"toast\"></div></div>`;\r\n",
      "  ui.innerHTML = `<div class=\"hud\"><div class=\"hud-top\"><div><div class=\"eyebrow\">BLACKRIDGE / ${mode === 'race' ? activeVenue.course.id==='quarry-v1'?'CIRCUIT 01':activeVenue.course.name.toUpperCase() : 'QUARRY FLOOR'}</div><div class=\"hud-title\">${eventLabel()}</div></div><div class=\"event-stats\"><div><span id=\"event-label\">${mode === 'derby' ? 'REMAINING' : mode === 'race' ? 'POSITION' : 'FREE DRIVE'}</span><strong id=\"event-value\">${cars.length} / ${cars.length}</strong></div><div><span>${mode === 'race' ? 'LAP / TIME' : mode === 'derby' ? 'TIME LEFT' : 'SESSION'}</span><strong id=\"time-value\">05:00</strong></div><button class=\"small-button\" id=\"pause\">\u2161</button></div></div><canvas class=\"minimap\" id=\"map\" width=\"400\" height=\"400\"></canvas><div class=\"status\"><div class=\"status-row\"><span>${DEFINITIONS[kind].name}</span><b id=\"health\">100%</b></div><div class=\"condition\"><b id=\"health-bar\" style=\"width:100%\"></b></div><div class=\"subsystems\"><span id=\"engine-status\">ENGINE OK</span><span id=\"steer-status\">STEERING OK</span><span id=\"surface\">GRAVEL</span></div><div class=\"tyre-status\" id=\"tyre-status\"></div></div><div class=\"speed\"><strong id=\"speed\">0</strong> <span>KM/H</span><small id=\"gear\">GEAR 1 &nbsp; / &nbsp; 850 RPM</small><div class=\"rpm\"><b id=\"rpm-bar\"></b></div></div><div class=\"controls\"><kbd>${['throttle','reverse','left','right'].map(a=>keyLabel(drivingControls.keys[a as 'throttle'][0])).join(' ')}</kbd> DRIVE <kbd>${keyLabel(drivingControls.keys.handbrake[0])}</kbd> HANDBRAKE <kbd>C</kbd> CAMERA <kbd>R</kbd> RECOVER ${mode === 'playground' && !online?.active ? '<kbd>I</kbd> INSPECT <kbd>T</kbd> TRAFFIC' : ''}</div><div class=\"center-message\" id=\"countdown\"></div><div id=\"toast\"></div></div>`;\r\n"
    ],
    [
      "",
      "        activeVenue.course.checkpointRadius,\r\n"
    ],
    [
      "    get courseState(){return{id:activeVenue.course.id,quarryVisible:quarryVenue.root.visible,ironfieldVisible:ironfieldVenue?.root.visible??false,bodies:physics.bodies.len(),colliders:physics.colliders.len(),quarryBodies:quarryVenue.physics.bodies.len(),ironfieldBodies:ironfieldVenue?.physics.bodies.len()??0};},\r\n",
      "    get courseState(){return{id:activeVenue.course.id,quarryVisible:quarryVenue.root.visible,ironfieldVisible:raceVenues['ironfield-figure-eight-v1']?.root.visible??false,cinderbankVisible:raceVenues['cinderbank-oval-v1']?.root.visible??false,bodies:physics.bodies.len(),colliders:physics.colliders.len(),quarryBodies:quarryVenue.physics.bodies.len(),ironfieldBodies:raceVenues['ironfield-figure-eight-v1']?.physics.bodies.len()??0,cinderbankBodies:raceVenues['cinderbank-oval-v1']?.physics.bodies.len()??0};},\r\n"
    ]
  ],
  "src/replay-data.ts": [
    [
      "  if(id==='ironfield-figure-eight-v1'&&meta.mode!=='race')throw Error('Ironfield replays support circuit races only.');\n",
      "  if(id!=='quarry-v1'&&meta.mode!=='race')throw Error('This course supports circuit races only.');\n"
    ]
  ],
  "src/replay-library.ts": [
    [
      "export const defaultReplayName=(doc:ReplayDocument)=>`${doc.meta.courseId==='ironfield-figure-eight-v1'?COURSE_NAMES[doc.meta.courseId]+' \u00b7 ':''}${doc.meta.mode==='race'?'Race':doc.meta.mode==='derby'?'Derby':'Playground'} \u00b7 ${doc.meta.created.slice(0,19).replace('T',' ')}`;\n",
      "export const defaultReplayName=(doc:ReplayDocument)=>`${doc.meta.courseId&&doc.meta.courseId!=='quarry-v1'?COURSE_NAMES[doc.meta.courseId]+' \u00b7 ':''}${doc.meta.mode==='race'?'Race':doc.meta.mode==='derby'?'Derby':'Playground'} \u00b7 ${doc.meta.created.slice(0,19).replace('T',' ')}`;\n"
    ]
  ],
  "src/event-rules.ts": [
    [
      "export function checkRoute(route:readonly RoutePoint[],x:number,z:number,next:number,lastDistance:number){\n",
      "export function checkRoute(route:readonly RoutePoint[],x:number,z:number,next:number,lastDistance:number,radius=12){\n"
    ],
    [
      "  return {passed:distance<12&&distance<lastDistance,distance};\n",
      "  return {passed:distance<radius&&distance<lastDistance,distance};\n"
    ]
  ]
};
 const known:Record<string,string>={
  "src/course-id.ts": "df65f9a245de30a0ace6681dfaf98fe3e9bd601a10caf0d87608fc434171dc5a",
  "src/race-course.ts": "bfe474fba949b4ae4058517ccb7a9ebf9993e5ed20d8ea588fb5407bfc21085f",
  "src/main.ts": "b66c9e7153ab451feafb2aa1a17cf0b4b7c3e9f89fe8233f702699b2f58be81e",
  "src/replay-data.ts": "e6c388ed4d266f3552914565097fff384deeb23971c00b54431a1e2fa6d2bb7d",
  "src/replay-library.ts": "b4eaf74c06496272b69f807f919fa12edc9c781ef77821a19c4ebf129f53dd18",
  "src/event-rules.ts": "edf4c2fe60d77cd63edd2865a59b54f03513eed9df548cd55af221fa27646282"
};
 for(const [file,edits]of Object.entries(changes)){
  const current=source(file);let text=current.toString();
  for(const [before,after]of edits){assert.equal(text.split(after).length-1,1,file);text=text.replace(after,before);}
  assert.equal(hash(text),known[file],file+' known published hash');
  assert.equal(text,readCinderbankPrevious(file).toString(),file+' whole predecessor bytes');
  assert.equal(hash(text),revision().normalizedSourceSha256[file],file+' manifest witness');
  assert.deepEqual(normalizeCinderbankSource(file,current),Buffer.from(text),file+' historical adapter');
  assert.throws(()=>normalizeCinderbankSource(file,Buffer.concat([current,Buffer.from('// unauthorized change')])));
 }
 assert.equal(source('src/main.ts').toString().replaceAll('\r\n','').includes('\n'),false,'Main retains CRLF');
});

test('actual camera, AI, recovery and controls stay exact; step adds only the optional course radius',()=>{
 const names=["updateCamera", "ai", "step", "recover", "start", "createCars", "beginReplay", "bankRun", "frame", "controllerContext", "controllerKey", "pollController", "input", "pause", "resume", "openStudio", "closeStudio", "captureReplay"],manifest=revision();
 assert.deepEqual(Object.keys(manifest.protectedMainFunctions).sort(),[...names].sort());
 const current=source('src/main.ts').toString(),radiusArgument='        activeVenue.course.checkpointRadius,\r\n';
 assert.equal(current.split(radiusArgument).length-1,1,'Only the reviewed optional course radius enters step');
 const actual=declarations(current.replace(radiusArgument,''),names),expected=declarations(readCinderbankPrevious('src/main.ts').toString(),names);
 for(const name of names){assert.equal(actual[name],expected[name],name);assert.equal(hash(actual[name]),manifest.protectedMainFunctions[name],name);}
});

test('existing catalogue, registry and historical assertions change only through reviewed successor adapters',()=>{
 const changes:Record<string,readonly (readonly [string,string])[]>={
  "tests/ironfield.test.ts": [
    [
      "assert.deepEqual(Object.keys(COURSE_NAMES),['quarry-v1','ironfield-figure-eight-v1']);",
      "assert.deepEqual(Object.keys(COURSE_NAMES),['quarry-v1','ironfield-figure-eight-v1','cinderbank-oval-v1']);"
    ]
  ],
  "tests/challenge-playability.test.ts": [
    [
      "assert.deepEqual([...new Set(added.filter(c=>c.mode==='race').map(challengeCourse))].sort(),Object.keys(COURSE_NAMES).sort());",
      "assert.deepEqual([...new Set(added.filter(c=>c.mode==='race').map(challengeCourse))].sort(),['quarry-v1','ironfield-figure-eight-v1'].sort());"
    ]
  ],
  "tests/handbrake-playability-history.test.ts": [
    [
      "import test from 'node:test';\n",
      "import test from 'node:test';\nimport {normalizeCinderbankMain} from './cinderbank-playability-invariants';\n"
    ],
    [
      " const main=source('src/main.ts');\n",
      " const main=normalizeCinderbankMain(source('src/main.ts'));\n"
    ]
  ],
  "tests/challenge-playability-history.test.ts": [
    [
      "import test from 'node:test';\n",
      "import test from 'node:test';\nimport {normalizeCinderbankMain} from './cinderbank-playability-invariants';\n"
    ],
    [
      " const current=source('src/main.ts').toString(),before=readChallengePlayabilityPrevious('src/main.ts').toString(),manifest=revision();",
      " const current=normalizeCinderbankMain(source('src/main.ts')).toString(),before=readChallengePlayabilityPrevious('src/main.ts').toString(),manifest=revision();"
    ],
    [
      " let current=source('src/main.ts').toString();",
      " let current=normalizeCinderbankMain(source('src/main.ts')).toString();"
    ]
  ],
  "tests/handbrake-playability-invariants.ts": [
    [
      "import assert from 'node:assert/strict';\n",
      "import assert from 'node:assert/strict';\nimport {restoreCinderbankPlayabilityBytes,verifyCinderbankPlayabilityRevision} from './cinderbank-playability-invariants';\n"
    ],
    [
      "export function restoreHandbrakePlayabilityBytes(file:string,bytes:Buffer):Buffer{\n",
      "export function restoreHandbrakePlayabilityBytes(file:string,bytes:Buffer):Buffer{\n bytes=restoreCinderbankPlayabilityBytes(file,bytes);\n"
    ],
    [
      "export function verifyHandbrakePlayabilityRevision():void{\n",
      "export function verifyHandbrakePlayabilityRevision():void{\n verifyCinderbankPlayabilityRevision();\n"
    ],
    [
      "const bytes=readFileSync(new URL('../'+file,import.meta.url));assert.equal(hash(bytes),entry.after,file);",
      "const bytes=restoreCinderbankPlayabilityBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);"
    ],
    [
      "hash(readFileSync(new URL('../'+file,import.meta.url))),expected,file+' stays unchanged during handbrake playability'",
      "hash(restoreCinderbankPlayabilityBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' stays unchanged during handbrake playability'"
    ]
  ],
  "tests/controller-playability-history.test.ts": [
    [
      "import test from 'node:test';\n",
      "import test from 'node:test';\nimport {normalizeCinderbankMain} from './cinderbank-playability-invariants';\n"
    ],
    [
      " const main=readFileSync(new URL('../src/main.ts',import.meta.url)).toString();",
      " const main=normalizeCinderbankMain(readFileSync(new URL('../src/main.ts',import.meta.url))).toString();"
    ]
  ],
  "tests/club-cup-main.test.ts": [
    [
      "import {resolveCourseId} from '../src/course-id';",
      "import {COURSE_NAMES,resolveCourseId} from '../src/course-id';"
    ],
    [
      " const context:any={T,...Cup,RACE_NAMES,structuredClone,",
      " const context:any={T,...Cup,COURSE_NAMES,RACE_NAMES,structuredClone,"
    ]
  ]
};
 const known:Record<string,string>={
  "tests/ironfield.test.ts": "8e149fcb5a8eae10539ec7c80f6cdbd9c4b7065781576eb5d42165a098f1f0a6",
  "tests/challenge-playability.test.ts": "e000870cde32a5a44623368de2d3efbac226055cb30184bf5bb83c64b9c102a5",
  "tests/handbrake-playability-history.test.ts": "72f93efd36de2f6584e16f5be8263de4cd393d29d6b68962d9b8768f44b6d2c5",
  "tests/challenge-playability-history.test.ts": "738a1aad7e79a4ef23cc06983c709c385aab3f2358395e60012830cd154bf101",
  "tests/handbrake-playability-invariants.ts": "825a6bced2060ca435f19a2798f1d71d00dddb943ca46fd6cc196c0dc8fda7ea",
  "tests/controller-playability-history.test.ts": "c06a25648271049019a49f563a338dedc0d62fab869d0d10dc34e47d3944437d",
  "tests/club-cup-main.test.ts": "cd0c6ce02ff38e83959a550094c372910bfcdfad0592c81175149ee20a775e71"
};
 for(const [file,edits]of Object.entries(changes)){
  let text=source(file).toString();
  for(const [before,after]of edits){assert.equal(text.split(after).length-1,1,file);text=text.replace(after,before);}
  assert.equal(hash(text),known[file],file+' known original test hash');
  assert.equal(text,readCinderbankPrevious(file).toString(),file+' all other assertions and bytes remain exact');
  assert.equal(hash(text),revision().normalizedHistoricalTestsSha256[file]);
 }
});

test('successor restoration recognizes whole recorded files and never substitutes unknown or corrupted bytes',()=>{
 for(const file of Object.keys(revision().files))assert.deepEqual(restoreCinderbankPlayabilityBytes(file,source(file)),readCinderbankPrevious(file),file);
 const bridge='tests/handbrake-playability-invariants.ts';
 assert.deepEqual(restoreHandbrakePlayabilityBytes(bridge,source(bridge)),readHandbrakePrevious(bridge),'Both layers restore in order');
 const main=source('src/main.ts');assert.deepEqual(restoreHandbrakePlayabilityBytes('src/main.ts',main),readCinderbankPrevious('src/main.ts'),'The previous layer protects current course integration through exact restore');
 for(const file of ['src/main.ts',bridge]){
  const corrupt=Buffer.from(source(file));corrupt[0]^=1;
  for(const bytes of [corrupt,Buffer.from('unrecognized revision')]){
   assert.deepEqual(restoreCinderbankPlayabilityBytes(file,bytes),bytes);
   assert.deepEqual(restoreHandbrakePlayabilityBytes(file,bytes),bytes);
  }
 }
 const unknown=Buffer.from('unrecognized revision');assert.deepEqual(restoreCinderbankPlayabilityBytes('src/not-in-leaf.ts',unknown),unknown);
});

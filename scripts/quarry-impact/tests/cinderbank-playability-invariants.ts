import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/cinderbank-playability/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
// These exact reviewed edits are independent of the capture manifest. Historical
// assertions still inspect every preceding byte and keep their original hashes.
const reviewedSourceChanges:Record<string,readonly (readonly [string,string])[]>={
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
const knownBefore:Record<string,string>={
  "src/course-id.ts": "df65f9a245de30a0ace6681dfaf98fe3e9bd601a10caf0d87608fc434171dc5a",
  "src/race-course.ts": "bfe474fba949b4ae4058517ccb7a9ebf9993e5ed20d8ea588fb5407bfc21085f",
  "src/main.ts": "b66c9e7153ab451feafb2aa1a17cf0b4b7c3e9f89fe8233f702699b2f58be81e",
  "src/replay-data.ts": "e6c388ed4d266f3552914565097fff384deeb23971c00b54431a1e2fa6d2bb7d",
  "src/replay-library.ts": "b4eaf74c06496272b69f807f919fa12edc9c781ef77821a19c4ebf129f53dd18",
  "src/event-rules.ts": "edf4c2fe60d77cd63edd2865a59b54f03513eed9df548cd55af221fa27646282"
};
export function normalizeCinderbankSource(file:string,bytes:Buffer):Buffer{
 const changes=reviewedSourceChanges[file];assert.ok(changes,'No reviewed Cinderbank source normalization for '+file);
 let text=bytes.toString();
 for(const [before,after]of changes){assert.equal(text.split(after).length-1,1,file+' reviewed change');text=text.replace(after,before);}
 const result=Buffer.from(text);assert.equal(hash(result),knownBefore[file],file+' retains every unrelated published byte');return result;
}
export const normalizeCinderbankMain=(bytes:Buffer):Buffer=>normalizeCinderbankSource('src/main.ts',bytes);
export function readCinderbankPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Cinderbank baseline for '+file);
 const before=gunzipSync(read(entry.snapshot));assert.equal(hash(before),entry.before,file);return before;
}
export function restoreCinderbankPlayabilityBytes(file:string,bytes:Buffer):Buffer{
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCinderbankPrevious(file);
}
export function verifyCinderbankPlayabilityRevision():void{
 const manifest=revision();assert.equal(manifest.baseline,'7232dbab3323bfe517c8ccaf1a44ae4f9b7d7a7e');
 assert.equal(Object.keys(manifest.files).length,21,'Reviewed source/test/history scope');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=readFileSync(new URL('../'+file,import.meta.url));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCinderbankPlayabilityBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(readFileSync(new URL('../'+file,import.meta.url))),expected,file+' stays unchanged during Cinderbank playability');
 const fixtures=Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/'));
 assert.equal(manifest.previousFixtureCount,767);assert.equal(fixtures.length,767,'All earlier fixture files remain protected');
 for(const [file,expected]of Object.entries(knownBefore))assert.equal(hash(readCinderbankPrevious(file)),expected,file);
}

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as T from 'three';
import {defaultControls,drivingInput,type Pad} from '../src/driving-controls';
import {SPLIT,SplitCamera,adoptView,p2HudMarkup,placeLabel,readSplit,splitControls,splitDone,splitDuel,splitFov,splitHeights,splitSeats,splitZoom} from '../src/split-screen';
const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),css=readFileSync(new URL('../src/style.css',import.meta.url),'utf8'),audio=readFileSync(new URL('../src/audio.ts',import.meta.url),'utf8');
const kinds=['coupe','sedan','hatch'];
test('the saved choice: off and the second car unless a valid one was saved',()=>{
  assert.deepEqual(readSplit(null,kinds),{on:false,p2:'sedan'});
  assert.deepEqual(readSplit('{"on":true,"p2":"hatch"}',kinds),{on:true,p2:'hatch'});
  assert.deepEqual(readSplit('{"on":"yes","p2":"tank"}',kinds),{on:false,p2:'sedan'});
  assert.deepEqual(readSplit('not json',kinds),{on:false,p2:'sedan'});
});
test('pads are dealt: one goes to player 2, two give one each with player 1 keeping the menu pad',()=>{
  assert.deepEqual(splitSeats([]),{p1:SPLIT.noPad,p2:SPLIT.noPad});
  assert.deepEqual(splitSeats([2]),{p1:SPLIT.noPad,p2:2});
  assert.deepEqual(splitSeats([0,1],0),{p1:0,p2:1});
  assert.deepEqual(splitSeats([0,1],1),{p1:1,p2:0});
  assert.deepEqual(splitSeats([3,1,1,NaN,-1]),{p1:1,p2:3});
});
const pad=(index:number,gas:number,steer=0):Pad=>({index,id:'pad'+index,connected:true,axes:[steer,0,0,0],buttons:Array.from({length:17},(_,i)=>({value:i===7?gas:0,pressed:i===7&&gas>.5,touched:false}))});
test('the keyboard splits in two: letters for player 1, arrows for player 2, and nobody shares a key',()=>{
  const {p1,p2}=splitControls(defaultControls(),splitSeats([]));
  const all=(c:typeof p1)=>Object.values(c.keys).flat();
  assert.ok(all(p1).every(k=>!k.startsWith('Arrow')),'player 1 gives up the arrows');
  assert.ok(all(p1).every(k=>!all(p2).includes(k)),'no key drives both cars');
  assert.deepEqual(p2.keys.handbrake,[...SPLIT.handbrake]);assert.equal(p2.transmission,'automatic');
  // The default keyboard steering stays as it is (left action on D and the right arrow).
  assert.deepEqual(p1.keys.left,['KeyD']);assert.deepEqual(p2.keys.left,['ArrowRight']);
  const w=drivingInput(p1,new Set(['KeyW']),[],0),up=drivingInput(p2,new Set(['ArrowUp']),[],0);
  assert.equal(w.throttle,1);assert.equal(drivingInput(p2,new Set(['KeyW']),[],0).throttle,0);assert.equal(up.throttle,1);assert.equal(drivingInput(p1,new Set(['ArrowUp']),[],0).throttle,0);
  // An action player 1 bound only to an arrow falls back to its letter.
  const saved=defaultControls();saved.keys.throttle=['ArrowUp'];assert.deepEqual(splitControls(saved,splitSeats([])).p1.keys.throttle,['KeyW']);
});
test('each player drives only with their own pad',()=>{
  const two=splitControls(defaultControls(),splitSeats([0,1],0)),pads=[pad(0,1,-.8),pad(1,0,.9)];
  assert.equal(drivingInput(two.p1,new Set(),pads,0).throttle,1);assert.equal(drivingInput(two.p2,new Set(),pads,0).throttle,0);
  assert.ok(drivingInput(two.p2,new Set(),pads,0).steer>.5&&drivingInput(two.p1,new Set(),pads,0).steer<-.5);
  const one=splitControls(defaultControls(),splitSeats([0],0));
  assert.equal(drivingInput(one.p1,new Set(),[pad(0,1)],0).throttle,0,'player 1 drives on the keyboard');assert.equal(drivingInput(one.p2,new Set(),[pad(0,1)],0).throttle,1);
});
test('the event ends when both players are done; free drive never ends',()=>{
  const run={finished:false,health:60},done={finished:true,health:40},out={finished:false,health:0};
  assert.equal(splitDone('race',[done,run]),false);assert.equal(splitDone('race',[done,out]),true);assert.equal(splitDone('race',[done,done]),true);
  assert.equal(splitDone('derby',[out,run]),false);assert.equal(splitDone('derby',[out,out]),true);assert.equal(splitDone('derby',[done,out]),false,'a derby car is only done when wrecked');
  assert.equal(splitDone('playground',[out,out]),false);assert.equal(splitDone('race',[out]),false);assert.equal(splitDone('race',[{finished:false,health:NaN},out]),true);
});
test('the duel: places and who came out ahead',()=>{
  assert.deepEqual(splitDuel([4,1,0,2]),{p1:3,p2:2,winner:2});assert.deepEqual(splitDuel([0,1]),{p1:1,p2:2,winner:1});assert.deepEqual(splitDuel([5,6]),{p1:0,p2:0,winner:0});
  assert.deepEqual([1,2,3,4,11,12,13,21,22,23,111].map(placeLabel),['1ST','2ND','3RD','4TH','11TH','12TH','13TH','21ST','22ND','23RD','111TH']);
});
test('a wide half keeps an ordinary horizontal view; halves split the height',()=>{
  assert.equal(splitZoom(16/9),1);assert.ok(splitZoom(32/9)>1.5);assert.equal(splitZoom(NaN),1);
  const aspect=32/9,h=2*Math.atan(Math.tan(T.MathUtils.degToRad(splitFov(52,aspect))/2)*aspect);assert.ok(T.MathUtils.radToDeg(h)<100&&splitFov(52,aspect)<40,`${T.MathUtils.radToDeg(h)}`);
  assert.equal(splitFov(52,16/9),52,'an ordinary shape keeps its lens');
  assert.deepEqual(splitHeights(720),{top:360,bottom:360});assert.deepEqual(splitHeights(721),{top:361,bottom:360});
});
test('player 2 is chased by their own camera, behind and above the car, and a view is copied whole',()=>{
  const root=new T.Object3D();root.position.set(10,0,-4);root.rotation.y=Math.PI/2;root.updateMatrixWorld();
  const subject={root,speed:12,impactResponse:{step:()=>({offset:{x:0,y:0,z:0},roll:0,pitch:0})}};
  const chase=new SplitCamera();chase.camera.aspect=32/9;
  for(let i=0;i<30;i++)chase.follow(subject,1/60,{distance:9,height:3,fov:52,shake:1},()=>0,()=>null,true,i/60);
  const c=chase.camera.position;assert.ok(c.y>1&&c.x<root.position.x-3,`${c.toArray()}`);
  const ahead=new T.Vector3(0,0,-1).applyQuaternion(chase.camera.quaternion);assert.ok(ahead.x>.5,'looking along the car');
  const into=new T.PerspectiveCamera();adoptView(into,chase.camera);assert.ok(into.position.equals(c)&&into.fov===chase.camera.fov&&into.aspect===chase.camera.aspect);
  assert.ok(p2HudMarkup('<b>').includes('&lt;b&gt;')&&p2HudMarkup('X').includes('id="p2-speed"'));
});
test('main runs the second seat: inputs, cameras, halves, end and results, never banked or posted',()=>{
  assert.ok(main.includes("splitRun=split.on&&splitPossible()&&!watch&&customEvent()&&!pursuitSelected()&&(mode==='derby'||mode==='race'||mode==='playground');"));
  assert.ok(main.includes("if(splitPossible())hub.append(splitButton);"),'not offered on a touch-first device');
  assert.ok(main.includes("splitRun&&c.id<2&&!autopilot&&!demo ? (c.finished?ai(c,dt):c.id===0?input():input2())"));
  assert.ok(main.includes('if(demo||autopilot||testInput||splitRun){telemetry=null;'),'split runs are not banked');
  assert.ok(main.includes("if(!splitRun&&!demo&&!online?.active&&!pursuit&&mode==='race'&&cars[0].finished&&cars.length>=2)globalScoresButton("),'nor posted to the global scores');
  assert.ok(main.includes('    !splitRun && !online?.active && !eliminationRace()'),'nor kept as records');
  const frame=main.indexOf('  applySplitLayout();if(splitLaid)splitTop();\n  updateHeatHaze();');assert.ok(frame>0);
  assert.ok(main.indexOf('  composer.render();\n  if(splitLaid)renderPlayerTwo();',frame)>frame);
  assert.ok(main.includes('i === 0 ? kind : !attract&&splitRun&&i===1&&!ratedGrid ? split.p2 as CarKind :'));
  assert.ok(main.includes("&&splitDone(mode,[cars[0],cars[1]]))finish("));
  // Player 2 hears their own car: its sounds are placed where it sits in their view, before player 1's listener, as loud as player 1's.
  assert.ok(main.includes('...(splitLaid&&cars[1]?{second:{id:cars[1].id,place:splitPlace}}:{})'));
  assert.ok(audio.includes("const second=perspective?.second?.id===car.id,at=second?perspective!.second!.place(car.current,this.secondAt):car.current;")&&audio.includes('level = car === focused || second ? 0.38 : 0.22;')&&audio.includes('l.pan.positionX.value = at.x;'));
  assert.ok(css.includes('body.split-screen .hud{bottom:50%')&&css.includes('.p2-hud{position:fixed;left:0;right:0;top:50%'));
});

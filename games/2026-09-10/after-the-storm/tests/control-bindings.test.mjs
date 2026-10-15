import test from 'node:test';
import assert from 'node:assert/strict';
import {initialControls,validateControls,rebindKeyboard,keyboardActions,gameplayKey,mappedGamepad,supportedKey,reservedKeyChord} from '../control-bindings.js';
import {playerInput,createInputSampler} from '../player-input.js';
import {createKeyCapture,mountControllerOptions} from '../controller-options.js';

const gamepad=()=>({index:0,id:'Test standard controller',connected:true,axes:[0,0,0,0],buttons:Array.from({length:32},()=>({pressed:false,value:0}))});
const press=(pad,index,value=1)=>{pad.buttons[index]={pressed:value>.1,value};};
const keyEvent=(target,type,code,extra={})=>{const event=new Event(type,{cancelable:true});Object.assign(event,{code,...extra});target.dispatchEvent(event);return event;};

test('default controls preserve both riders and normalize independent bounded profiles',()=>{
 const a=initialControls(),b=validateControls(a);assert.deepEqual(a,b);assert.notEqual(a,b);assert.equal(b.players.length,2);assert.ok(b.players.every(p=>p.gamepad.deadzone===.05));
 const [first,second]=b.players;assert.equal(first.keyboard.throttle,'KeyW');assert.equal(first.keyboard.pause,'Escape');assert.equal(first.keyboard.flip,'Digit1');assert.equal(first.keyboard.dive,'KeyF');assert.equal(second.keyboard.throttle,'ArrowUp');assert.equal(second.keyboard.flip,'Numpad1');assert.equal(second.keyboard.dive,'Quote');assert.equal(second.keyboard.pause,'Enter');
 a.players[0].gamepad.buttons.throttle=2;a.players[0].keyboard.throttle='KeyI';assert.equal(b.players[0].gamepad.buttons.throttle,7);assert.equal(initialControls().players[0].keyboard.throttle,'KeyW');assert.equal(b.players[1].gamepad.buttons.throttle,7);
 assert.deepEqual(validateControls(undefined),initialControls());
});

test('keyboard rebinding rejects cross-player conflicts without mutating live settings',()=>{
 const original=initialControls(),before=structuredClone(original),changed=rebindKeyboard(original,0,'throttle','KeyI');assert.equal(changed.players[0].keyboard.throttle,'KeyI');assert.deepEqual(original,before);
 assert.throws(()=>rebindKeyboard(original,0,'throttle','ArrowUp'),/Player 2 throttle/);assert.throws(()=>rebindKeyboard(original,0,'steerLeft','KeyW'),/Player 1 throttle/);assert.throws(()=>rebindKeyboard(original,1,'dive','Escape'),/reserved/);
 assert.throws(()=>rebindKeyboard(original,3,'throttle','KeyI'),/Unknown/);assert.throws(()=>rebindKeyboard(original,0,'constructor','KeyI'),/Unknown/);assert.throws(()=>rebindKeyboard(original,0,'pause',null),/keep a keyboard key/);
 assert.equal(rebindKeyboard(original,0,'handstand',null).players[0].keyboard.handstand,null);
});

test('validation rejects invalid schemas, browser-reserved keys and out-of-range pad settings',()=>{
 const mutations=[s=>s.version=2,s=>s.players.push({}),s=>s.players[0].keyboard.throttle='F4',s=>s.players[0].keyboard.camera='MetaLeft',s=>s.players[0].keyboard.camera='Tab',s=>s.players[0].keyboard.camera='KeyAA',s=>s.players[0].keyboard.constructor='KeyI',
  s=>s.players[0].gamepad.buttons.throttle=32,s=>s.players[0].gamepad.buttons.brake=-1,s=>s.players[0].gamepad.buttons.camera=1.5,s=>s.players[0].gamepad.axes.steer.index=8,s=>s.players[0].gamepad.axes.lean.invert='yes',s=>s.players[1].gamepad.deadzone=.351,s=>s.players[1].gamepad.deadzone=-.01,s=>s.players[1].gamepad.deadzone=NaN];
 for(const mutate of mutations){const s=initialControls();mutate(s);assert.throws(()=>validateControls(s));}
 for(const code of ['F1','F11','AltLeft','MetaRight','Tab','BrowserBack','MediaPlayPause','Unidentified',''])assert.equal(supportedKey(code,'throttle'),false,code);
 assert.equal(supportedKey('Escape','pause'),true);assert.equal(supportedKey('Escape','dive'),false);assert.equal(supportedKey('Numpad7','somersault'),true);assert.equal(supportedKey('ControlRight','brake'),true);
 assert.equal(reservedKeyChord({code:'KeyW',ctrlKey:true}),true);assert.equal(reservedKeyChord({code:'KeyI',metaKey:true}),true);assert.equal(reservedKeyChord({code:'KeyF',altKey:true}),true);assert.equal(reservedKeyChord({code:'ControlRight',ctrlKey:true}),false);
 const s=initialControls();s.players[0].gamepad.buttons.rescue=31;s.players[0].gamepad.axes.lean={index:null,invert:true};s.players[0].gamepad.deadzone=.35;assert.deepEqual(validateControls(s),s);
});

test('rebinding keyboard driving and safety actions takes effect while old keys and other players stay independent',()=>{
 let controls=rebindKeyboard(initialControls(),0,'throttle','KeyI');controls=rebindKeyboard(controls,0,'camera','KeyK');controls=rebindKeyboard(controls,0,'rescue','KeyG');controls=rebindKeyboard(controls,0,'pause','KeyP');
 const prefs=controls.players[0];assert.equal(playerInput({KeyW:true},null,0,true,{},prefs).throttle,0);
 const input=playerInput({KeyI:true,KeyK:true,KeyG:true,KeyP:true},null,0,true,{},prefs);assert.equal(input.throttle,1);assert.ok(input.camera&&input.rescue&&input.pause);assert.equal(playerInput({Escape:true},null,0,true,{},prefs).pause,true,'Escape remains an emergency pause');
 assert.equal(playerInput({KeyI:true},null,1,true,{},controls.players[1]).throttle,0);
 assert.equal(gameplayKey('KeyI',controls,true),true);assert.equal(gameplayKey('KeyW',controls,true),false);assert.equal(gameplayKey('Numpad1',controls,false),false);assert.equal(gameplayKey('Numpad1',controls,true),true);
});

test('single-player arrow aliases never leak to player one in versus or override a reassigned action',()=>{
 const controls=initialControls();assert.equal(playerInput({ArrowUp:true},null,0,false,{},controls.players[0]).throttle,1);assert.equal(playerInput({ArrowUp:true},null,0,true,{},controls.players[0]).throttle,0);assert.equal(playerInput({ArrowUp:true},null,1,true,{},controls.players[1]).throttle,1);
 const freeArrow=rebindKeyboard(controls,1,'throttle','KeyT'),assigned=rebindKeyboard(freeArrow,0,'rescue','ArrowUp');
 const solo=keyboardActions({ArrowUp:true},assigned.players[0],0,false);assert.equal(solo.rescue,true);assert.equal(solo.throttle,false);
});

test('current control getter updates reused samples and touch remains a fixed logical control',()=>{
 let controls=rebindKeyboard(initialControls(),0,'throttle','KeyI');const sample=createInputSampler(()=>controls);
 const first=sample({KeyI:true},{},[],false);assert.equal(first.throttle,1);controls=rebindKeyboard(controls,0,'throttle','KeyH');
 assert.equal(sample({KeyI:true},{},[],false),first);assert.equal(first.throttle,0);assert.equal(sample({KeyH:true},{},[],false).throttle,1);
 const pair=sample({ArrowUp:true},{KeyW:true,KeyF:true},[],true);assert.equal(pair[0],first);assert.equal(pair[0].throttle,1);assert.equal(pair[0].dive,true);assert.equal(pair[1].throttle,1);assert.equal(pair[1].dive,false);
 assert.equal(sample({}, {},[],true),pair);assert.ok(pair.every(i=>i.throttle===0&&!i.dive&&!i.camera&&!i.pause));
});

test('button remapping keeps shared default slots independent for camera, flips, absorb and somersault',()=>{
 const controls=initialControls(),prefs=controls.players[0],pad=gamepad();prefs.gamepad.buttons.camera=10;prefs.gamepad.buttons.dampen=11;
 press(pad,10);let input=playerInput({},pad,0,true,{},prefs);assert.equal(input.camera,true);assert.equal(input.trick,'');
 pad.buttons[10]={pressed:false,value:0};press(pad,3);input=playerInput({},pad,0,true,{},prefs);assert.equal(input.camera,false);assert.equal(input.trick,'');
 press(pad,4);input=playerInput({},pad,0,true,{},prefs);assert.equal(input.camera,false);assert.equal(input.trick,'flip');
 pad.buttons[3]={pressed:false,value:0};press(pad,0);input=playerInput({},pad,0,true,{},prefs);assert.equal(input.trick,'somersault');assert.equal(input.dampen,false);
 pad.buttons[4]={pressed:false,value:0};input=playerInput({},pad,0,true,{},prefs);assert.equal(input.trick,'');assert.equal(input.dampen,false);press(pad,11);assert.equal(playerInput({},pad,0,true,{},prefs).dampen,true);
});

test('mapped pads retain analogue triggers, custom axes/inversion and avoid being mapped twice',()=>{
 const prefs=initialControls().players[0],pad=gamepad();prefs.gamepad.buttons.throttle=2;prefs.gamepad.buttons.pause=8;prefs.gamepad.buttons.rescue=16;prefs.gamepad.buttons.dive=14;prefs.gamepad.axes.steer={index:2,invert:true};prefs.gamepad.axes.lean={index:3,invert:true};pad.axes=[1,1,.6,-.7];press(pad,2,.4);press(pad,8);press(pad,16);press(pad,4);press(pad,14);
 const mapped=mappedGamepad(pad,prefs);assert.equal(mapped.raw,pad);assert.equal(mappedGamepad(mapped,prefs),mapped);assert.deepEqual(mapped.axes,[-.6,.7]);assert.equal(mapped.actions.pause.pressed,true);assert.equal(mapped.actions.camera.pressed,false);
 const input=playerInput({},mapped,0,true,{},prefs);assert.equal(input.throttle,.4);assert.ok(input.steer>.5&&input.steer<.6);assert.equal(input.lean,-.7);assert.ok(input.pause&&input.rescue&&input.dive);assert.equal(input.brake,false);
 const pair=createInputSampler(()=>({players:[initialControls().players[0],prefs]}))({}, {},[null,mapped],true);assert.equal(pair[0].throttle,0);assert.equal(pair[0].pause,false);assert.equal(pair[1].throttle,.4);assert.equal(pair[1].rescue,true);
});

test('deadzone defaults to five percent and supports zero through thirty-five percent on both axes',()=>{
 const prefs=initialControls().players[0],pad=gamepad();pad.axes=[.05,-.05];assert.equal(playerInput({},pad).steer,0);assert.equal(playerInput({},pad).lean,0);pad.axes=[.06,-.06];assert.ok(playerInput({},pad).steer<0);assert.equal(playerInput({},pad).lean,.06);
 prefs.gamepad.deadzone=.35;pad.axes=[.3,-.3];assert.equal(playerInput({},pad,0,false,{},prefs).steer,0);assert.equal(playerInput({},pad,0,false,{},prefs).lean,0);pad.axes=[1,-1];assert.equal(playerInput({},pad,0,false,{},prefs).steer,-1);assert.equal(playerInput({},pad,0,false,{},prefs).lean,1);
 prefs.gamepad.deadzone=0;pad.axes=[.01,-.01];assert.ok(playerInput({},pad,0,false,{},prefs).steer<0);assert.equal(playerInput({},pad,0,false,{},prefs).lean,.01);
});

test('missing, disconnected and malformed hardware yields bounded neutral controls',()=>{
 assert.equal(mappedGamepad(null),null);assert.equal(mappedGamepad({connected:false}),null);const pad=gamepad();pad.axes=[NaN,Infinity];pad.buttons[7]={value:Infinity,pressed:false};let input=playerInput({},pad);assert.equal(input.steer,0);assert.equal(input.lean,0);assert.equal(input.throttle,0);
 pad.axes=[8,-9];input=playerInput({},pad);assert.equal(input.steer,-1);assert.equal(input.lean,1);assert.equal(playerInput({},{}).throttle,0);
});

test('key capture consumes press and release, cancels Escape and leaves no gameplay input behind',()=>{
 const target=new EventTarget(),bound=[],states=[],statuses=[];let leaked=0;const capture=createKeyCapture({target,onBind:(...args)=>bound.push(args),onStatus:m=>statuses.push(m),onCaptureChange:v=>states.push(v)});
 target.addEventListener('keydown',()=>leaked++);target.addEventListener('keyup',()=>leaked++);
 capture.begin(0,'throttle');assert.equal(keyEvent(target,'keydown','KeyI').defaultPrevented,true);assert.deepEqual(bound,[[0,'throttle','KeyI']]);assert.equal(capture.capturing,false);assert.equal(keyEvent(target,'keyup','KeyI').defaultPrevented,true);assert.equal(leaked,0);
 capture.begin(1,'dive');assert.equal(keyEvent(target,'keydown','Escape').defaultPrevented,true);assert.equal(capture.capturing,false);keyEvent(target,'keyup','Escape');assert.equal(bound.length,1);assert.match(statuses.at(-1),/cancelled/);assert.deepEqual(states,[true,false,true,false]);
 keyEvent(target,'keydown','KeyW');keyEvent(target,'keyup','KeyW');assert.equal(leaked,2);capture.dispose();
});

test('capture rejects shortcuts/conflicts, prevents repeats and contains chords after binding a modifier',()=>{
 const target=new EventTarget();let controls=initialControls(),leaked=0;const messages=[];const capture=createKeyCapture({target,onBind:(p,a,c)=>controls=rebindKeyboard(controls,p,a,c),onStatus:m=>messages.push(m)});target.addEventListener('keydown',()=>leaked++);target.addEventListener('keyup',()=>leaked++);
 capture.begin(1,'throttle');keyEvent(target,'keydown','KeyW',{ctrlKey:true});keyEvent(target,'keyup','KeyW');assert.equal(capture.capturing,true);assert.match(messages.at(-1),/Browser shortcuts/);
 keyEvent(target,'keydown','KeyW');keyEvent(target,'keyup','KeyW');assert.equal(capture.capturing,true);assert.match(messages.at(-1),/already assigned/);
 keyEvent(target,'keydown','KeyT',{repeat:true});keyEvent(target,'keyup','KeyT');assert.equal(controls.players[1].keyboard.throttle,'ArrowUp');
 keyEvent(target,'keydown','KeyT');keyEvent(target,'keyup','KeyT');assert.equal(controls.players[1].keyboard.throttle,'KeyT');assert.equal(leaked,0);
 capture.begin(0,'dive');keyEvent(target,'keydown','ControlLeft',{ctrlKey:true});assert.equal(capture.capturing,false);assert.equal(keyEvent(target,'keydown','KeyW',{ctrlKey:true}).defaultPrevented,true);keyEvent(target,'keyup','KeyW',{ctrlKey:true});keyEvent(target,'keyup','ControlLeft');assert.equal(leaked,0);
 capture.begin(0,'camera');target.dispatchEvent(new Event('blur'));assert.equal(capture.capturing,false);capture.dispose();keyEvent(target,'keydown','KeyW');assert.equal(leaked,1);
});

class FakeElement extends EventTarget{
 constructor(tag){super();this.tagName=tag.toUpperCase();this.children=[];this.style={};this.dataset={};this.attributes={};this.textContent='';this._value='';}
 append(...nodes){for(const node of nodes){node.parent=this;this.children.push(node);}}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this);this.parent=null;}
 setAttribute(key,value){this.attributes[key]=String(value);}
 set value(value){this._value=String(value);}get value(){return this._value;}
}
const descendants=node=>[node,...node.children.flatMap(descendants)];
test('controller options edit either player without hardware, reset defaults and release capture on close/dispose',()=>{
 const oldDocument=globalThis.document,oldWindow=globalThis.window;globalThis.document={createElement:tag=>new FakeElement(tag)};globalThis.window=new EventTarget();
 try{
  let controls=initialControls();const dialog=new FakeElement('dialog'),states=[];const ui=mountControllerOptions(dialog,{getControls:()=>controls,setControls:value=>{controls=value;return true;},onCaptureChange:v=>states.push(v)});
  const find=predicate=>descendants(dialog).find(predicate),player=find(n=>n.attributes['aria-label']==='Player controls');player.value='1';player.onchange();const throttle=find(n=>n.dataset.controlAction==='throttle');assert.equal(throttle.textContent,'Arrow Up');
  const deadzone=find(n=>n.attributes['aria-label']==='Joystick deadzone percent');deadzone.value='17';deadzone.onchange();assert.equal(controls.players[1].gamepad.deadzone,.17);assert.equal(controls.players[0].gamepad.deadzone,.05);
  const trigger=find(n=>n.attributes['aria-label']==='Player 2 gamepad throttle');trigger.value='2';trigger.onchange();assert.equal(controls.players[1].gamepad.buttons.throttle,2);
  const axis=find(n=>n.attributes['aria-label']==='Player 2 steer axis'),invert=find(n=>n.attributes['aria-label']==='Invert Player 2 steer axis');axis.value='3';axis.onchange();invert.checked=true;invert.onchange();assert.deepEqual(controls.players[1].gamepad.axes.steer,{index:3,invert:true});
  throttle.onclick();assert.equal(ui.capturing,true);keyEvent(globalThis.window,'keydown','KeyT');keyEvent(globalThis.window,'keyup','KeyT');assert.equal(controls.players[1].keyboard.throttle,'KeyT');assert.equal(throttle.textContent,'T');
  find(n=>n.textContent==="Restore this player's defaults").onclick();assert.deepEqual(controls.players[1],initialControls().players[1]);
  throttle.onclick();dialog.dispatchEvent(new Event('close'));assert.equal(ui.capturing,false);assert.equal(states.at(-1),false);ui.refresh();ui.dispose();assert.equal(dialog.children.length,0);
 }finally{globalThis.document=oldDocument;globalThis.window=oldWindow;}
});

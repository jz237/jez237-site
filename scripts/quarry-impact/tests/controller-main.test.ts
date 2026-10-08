import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';
import {ControllerInput} from '../src/controller-input';
import {withWreckBatch} from '../src/wreck-batch';
import {defaultControls,drivingInput,drivingButtons,selectedPad,type Pad} from '../src/driving-controls';
import type {NavigationContext} from '../src/controller-navigation';

/** Run the actual main declarations. DOM rendering and scene actions are explicit
 * boundaries; all pad edges, state keys, routing and input masking are production. */
const main=ts.createSourceFile('main.ts',readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),ts.ScriptTarget.ES2022,true);
function extract(context:Record<string,unknown>){
 const names=['controllerContext','controllerKey','pollController','input'];
 const declarations=names.map(name=>{const node=main.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text===name);assert.ok(node,'missing production function '+name);return node.getText(main);});
 const code=ts.transpileModule(declarations.join('\n')+'\nglobalThis.boundaries={'+names.join(',')+'};',{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
 runInNewContext(code,context);return context.boundaries as {controllerContext:()=>NavigationContext|null;controllerKey:(context:NavigationContext|null)=>string;pollController:(now:number)=>void;input:()=>ReturnType<typeof drivingInput>};
}
class Node {
 hidden=false;attributes=new Map<string,string>();children=new Map<string,Node>();clicks=0;onclick=()=>{};
 classList={remove:(_name:string)=>{},add:(_name:string)=>{}};
 getAttribute(name:string){return this.attributes.get(name)??null;}
 add(selector:string,node=new Node()){this.children.set(selector,node);return node;}
 querySelector(selector:string):Node|null{
  const own=this.children.get(selector);if(own)return selector.includes(':not([hidden])')&&own.hidden?null:own;
  for(const child of this.children.values()){const found=child.querySelector(selector);if(found)return found;}return null;
 }
 click(){this.clicks++;this.onclick();}
}
const pad=(buttons:Record<number,number>={},index=0):Pad=>({index,id:'Standard controller',connected:true,axes:[0,0],buttons:Array.from({length:18},(_,i)=>({value:buttons[i]??0,pressed:(buttons[i]??0)>.5,touched:false}))});
function harness(state='menu'){
 const ui=new Node(),calls:Record<string,number>={},navigation:{context:NavigationContext|null;handled:string[]}={context:null,handled:[]};
 let pads:readonly(Pad|null)[]=[pad()],time=0;
 const count=(name:string)=>calls[name]=(calls[name]??0)+1;
 const c:any={state,activeTimeTrial:null,timeTrialOpen:false,resumeState:'playing',preparingEvent:false,studio:null,closeReplayLibrary:null,clubOpen:false,eventSetupOpen:false,careerOpen:false,careerRun:false,openCareer(){},profileOpen:false,garageOpen:false,activeChallenge:null,online:null,demo:false,demoHudHidden:false,hood:false,
  sound:{ctx:{state:'running'}},ui,keys:new Set(),testInput:null,cars:[{speed:0}],drivingControls:defaultControls(),selectedPad,drivingInput,drivingButtons,controllerInput:new ControllerInput(),controllerHelp:{hidden:true,textContent:''},navigator:{getGamepads:()=>pads},
  controllerNavigation:{sync(context:NavigationContext|null){navigation.context=context;},handle(command:string){navigation.handled.push(command);const context=navigation.context;if(command==='back')context?.back?.();else if(command==='accept'&&context?.initial)(context.root as unknown as Node).querySelector(context.initial)?.click();}},
  pause(){count('pause');c.resumeState=c.state;c.state='paused';const overlay=ui.add('#overlay');overlay.add('#resume').onclick=()=>c.resume();},
  resume(){count('resume');c.state=c.resumeState;ui.children.delete('#overlay');},recover(){count('recover');},toast(){count('toast');},director:{cycleView(){count('camera');}},
  closeStudio(){count('closeStudio');c.studio=null;c.state='menu';ui.children.delete('.studio');},closeClubCup(){count('closeCup');c.clubOpen=false;c.state='menu';ui.children.delete('.club-board');},
 };
 const functions=extract(c);
 const root=(selector:string)=>ui.add(selector);
 const button=(root:Node,selector:string,name:string,action=()=>{})=>{const node=root.add(selector);node.onclick=()=>{count(name);action();};return node;};
 const event=()=>{c.state='countdown';c.clubOpen=false;ui.children.clear();};
 const menu=root('.menu');button(menu,'#start','startEvent',event);
 const poll=(buttons:Record<number,number>={},step=16,index=0)=>{pads=[pad(buttons,index)];time+=step;functions.pollController(time);};
 const release=()=>poll();
 const disconnect=()=>{pads=[];time+=16;functions.pollController(time);};
 const currentInput=()=>functions.input();
 return{c,calls,ui,root,button,event,poll,release,disconnect,currentInput,functions,navigation,get time(){return time;}};
}
const neutral=(input:ReturnType<typeof drivingInput>)=>{assert.equal(input.throttle,0);assert.equal(input.brake,0);assert.equal(input.handbrake,false);};

test('A starts one event and the same-frame held accept and pedals cannot leak into driving',()=>{
 const h=harness();h.release();h.poll({0:1,7:1});
 assert.equal(h.calls.startEvent,1);assert.equal(h.c.state,'countdown');neutral(h.currentInput());
 for(let i=0;i<15;i++){h.poll({0:1,7:1});neutral(h.currentInput());}assert.equal(h.calls.startEvent,1);
 h.c.state='result';const result=h.root('.overlay');h.button(result,'#again','startEvent',h.event);
 h.poll({0:1,7:1});assert.equal(h.calls.startEvent,1,'the held start cannot activate the newly appeared result');
 h.release();h.poll({0:1});assert.equal(h.calls.startEvent,2);neutral(h.currentInput());
});

test('Start pause/resume and A resume mask held buttons immediately, while countdown-to-playing keeps ordinary pedals',()=>{
 for(const resumeButton of [0,9]){
  const h=harness('playing');h.release();h.poll({7:1});assert.equal(h.currentInput().throttle,1);
  h.poll({9:1,7:1});assert.equal(h.c.state,'paused');assert.equal(h.calls.pause,1);
  h.poll({9:1,7:1});assert.equal(h.c.state,'paused','holding Start cannot resume immediately');
  h.poll({7:1});h.poll({[resumeButton]:1,7:1});assert.equal(h.c.state,'playing');assert.equal(h.calls.resume,1);neutral(h.currentInput());
  h.release();h.poll({7:.8});assert.ok(h.currentInput().throttle>.7);
 }
 const h=harness('countdown');h.release();h.poll({6:.6});const before=h.currentInput();assert.ok(before.throttle<0);
 const key=h.functions.controllerKey(h.functions.controllerContext());h.c.state='playing';h.poll({6:.6});
 assert.equal(h.functions.controllerKey(h.functions.controllerContext()),key);assert.deepEqual(h.currentInput(),before);
});

test('studio owns controls over an underlying busy library and Back closes only one layer per press',()=>{
 const h=harness('studio'),library=h.root('#replay-library');library.attributes.set('aria-busy','true');
 h.c.closeReplayLibrary=()=>{h.calls.closeLibrary=(h.calls.closeLibrary??0)+1;h.c.closeReplayLibrary=null;};
 const studio=h.root('.studio');h.button(studio,'#studio-play','playReplay');
 h.c.studio={doc:{},hidden:false,togglePlay(){h.calls.playReplay=(h.calls.playReplay??0)+1;},toggleHud(){h.c.studio.hidden=!h.c.studio.hidden;}};
 h.release();assert.equal(h.navigation.context?.root,studio);assert.equal(h.navigation.context?.initial,'#studio-play');
 h.poll({9:1});assert.equal(h.calls.playReplay,1);h.poll({9:1});assert.equal(h.calls.playReplay,1);
 h.release();h.poll({1:1});assert.equal(h.calls.closeStudio,1);assert.equal(h.calls.closeLibrary,undefined);
 library.attributes.delete('aria-busy');h.poll({1:1});assert.equal(h.calls.closeLibrary,undefined);
 h.release();h.poll({1:1});assert.equal(h.calls.closeLibrary,1);
});

test('Cup and library confirmations default to keeping data and Back does not close the underlying screen',()=>{
 for(const kind of ['club','library']){
  const h=harness('result');let confirm:Node,cancel:Node;
  if(kind==='club'){
   h.c.clubOpen=true;const board=h.root('.club-board');h.button(board,'#club-start','cupStart',h.event);
   confirm=board.add('#club-restart-confirmation');cancel=h.button(confirm,'#club-cancel-restart','cancel',()=>confirm.hidden=true);h.button(confirm,'#club-confirm-restart','destroy');
  }else{
   const library=h.root('#replay-library');h.c.closeReplayLibrary=()=>h.calls.closeLibrary=(h.calls.closeLibrary??0)+1;
   confirm=library.add('.library-confirm:not([hidden])');cancel=h.button(confirm,'[data-action="cancel"]','cancel',()=>confirm.hidden=true);h.button(confirm,'[data-action="confirm"]','destroy');
  }
  h.release();assert.equal(h.navigation.context?.root,confirm);
  h.poll({0:1});assert.equal(cancel.clicks,1);assert.equal(confirm.hidden,true);assert.equal(h.calls.destroy,undefined);
  h.release();confirm.hidden=false;h.release();h.poll({1:1});assert.equal(cancel.clicks,2);assert.equal(h.calls.closeCup,undefined);assert.equal(h.calls.closeLibrary,undefined);
 }
});

test('results, Cup, event setup and demo cancellation use their actual context callbacks',()=>{
 for(const challenge of [false,true]){
  const h=harness('result');h.c.activeChallenge=challenge?{}:null;const result=h.root('.overlay');h.button(result,challenge?'#challenge-menu':'#back','resultBack',()=>h.c.state='menu');
  h.release();h.poll({1:1});assert.equal(h.calls.resultBack,1);assert.equal(h.calls.pause,undefined);
 }
 const cup=harness('result');cup.c.clubOpen=true;const board=cup.root('.club-board');cup.button(board,'#club-start','cupStart',cup.event);
 cup.release();cup.poll({0:1});assert.equal(cup.calls.cupStart,1);assert.equal(cup.c.state,'countdown');neutral(cup.currentInput());
 const close=harness();close.c.clubOpen=true;close.root('.club-board');close.release();close.poll({1:1});assert.equal(close.calls.closeCup,1);
 const setup=harness();setup.c.eventSetupOpen=true;const event=setup.root('.event-setup');setup.button(event,'#event-close','saveEvent',()=>setup.c.eventSetupOpen=false);setup.release();setup.poll({1:1});assert.equal(setup.calls.saveEvent,1);
 const demo=harness();const dialog=demo.root('#demo-setup');demo.button(dialog,'#demo-cancel','cancelDemo',()=>demo.ui.children.delete('#demo-setup'));demo.release();demo.poll({1:1});assert.equal(demo.calls.cancelDemo,1);assert.equal(demo.calls.startEvent,undefined);
});

test('preparing events and asynchronous library work consume held commands without activating newly ready controls',()=>{
 const h=harness();h.release();h.c.preparingEvent=true;h.poll({0:1,1:1,9:1});assert.equal(h.navigation.context,null);assert.equal(h.calls.startEvent,undefined);assert.equal(h.calls.pause,undefined);
 h.c.preparingEvent=false;h.poll({0:1,1:1,9:1});assert.equal(h.calls.startEvent,undefined);h.release();h.poll({0:1});assert.equal(h.calls.startEvent,1);
 const busy=harness(),library=busy.root('#replay-library');library.attributes.set('aria-busy','true');busy.c.closeReplayLibrary=()=>busy.calls.closeLibrary=(busy.calls.closeLibrary??0)+1;
 busy.button(library,'#library-close','libraryButton');busy.release();busy.poll({0:1,1:1});assert.equal(busy.navigation.context,null);
 library.attributes.delete('aria-busy');busy.poll({0:1,1:1});assert.equal(busy.calls.libraryButton,undefined);assert.equal(busy.calls.closeLibrary,undefined);
 busy.release();busy.poll({1:1});assert.equal(busy.calls.closeLibrary,1);
});

test('losing an offline active pad pauses once and reconnecting cannot automatically resume or apply held pedals',()=>{
 for(const state of ['playing','countdown','wrecked']){
  const h=harness(state);h.release();h.disconnect();assert.equal(h.calls.pause,1);assert.equal(h.calls.toast,1);assert.equal(h.c.state,'paused');
  h.disconnect();assert.equal(h.calls.pause,1);h.poll({9:1,7:1});assert.equal(h.c.state,'paused');neutral(h.currentInput());
  h.poll({9:1,7:1});assert.equal(h.calls.resume,undefined);h.release();h.poll({9:1,7:1});assert.equal(h.calls.resume,1);neutral(h.currentInput());
 }
 const online=harness('playing');online.c.online={active:true,network:{snapshot:null}};online.release();online.disconnect();assert.equal(online.calls.pause,undefined);assert.equal(online.c.state,'playing');neutral(online.currentInput());
});

test('custom X/Y driving assignments take precedence over camera and recovery shortcuts',()=>{
 const h=harness('playing');h.c.drivingControls.throttleButton=2;h.c.drivingControls.brakeButton=3;h.release();h.poll({2:1});assert.equal(h.c.hood,false);assert.equal(h.currentInput().throttle,1);
 h.release();h.poll({3:1});assert.equal(h.calls.recover,undefined);assert.ok(h.currentInput().throttle<0);
 h.release();Object.assign(h.c.drivingControls,defaultControls());h.poll({2:1});assert.equal(h.c.hood,true);h.release();h.poll({3:1});assert.equal(h.calls.recover,1);
 h.c.state='countdown';h.release();h.poll({3:1});assert.equal(h.calls.recover,1,'recovery remains restricted to active driving');
});

test('hidden demo/studio controls can be restored without routing into driving or closing the view',()=>{
 const h=harness('playing');h.c.demo=true;h.c.demoHudHidden=true;h.root('.hud');h.release();h.poll({1:1});assert.equal(h.c.demoHudHidden,false);assert.equal(h.calls.pause,undefined);
 h.release();h.poll({2:1});assert.equal(h.calls.camera,1);h.release();h.poll({3:1});assert.equal(h.calls.recover,undefined);
 const studio=harness('studio');studio.root('.studio');studio.c.studio={doc:{},hidden:true,toggleHud(){studio.c.studio.hidden=!studio.c.studio.hidden;}};
 studio.release();studio.poll({1:1});assert.equal(studio.c.studio.hidden,false);assert.equal(studio.calls.closeStudio,undefined);
 studio.poll({1:1});assert.equal(studio.calls.closeStudio,undefined);studio.release();studio.poll({1:1});assert.equal(studio.calls.closeStudio,1);
});

test('Start and B assigned to any driving action retain that action, with the other unassigned button available to pause',()=>{
 for(const state of ['playing','countdown'])for(const button of [9,1])for(const action of ['throttleButton','brakeButton','handbrakeButton'] as const){
  const h=harness(state);h.c.drivingControls[action]=button;h.c.cars[0].speed=10;h.release();h.poll({[button]:1});
  assert.equal(h.c.state,state);assert.equal(h.calls.pause,undefined,`${button} mapped to ${action} cannot pause`);
  const input=h.currentInput();if(action==='throttleButton')assert.equal(input.throttle,1);else if(action==='brakeButton')assert.equal(input.brake,1);else assert.equal(input.handbrake,true);
  h.release();h.poll({[button===9?1:9]:1});assert.equal(h.c.state,'paused');assert.equal(h.calls.pause,1);
  h.release();h.poll({9:1});assert.equal(h.c.state,state,'Start remains a resume action in the paused UI even if it is a driving pedal');neutral(h.currentInput());
 }
});

test('configured trigger release deadzones flow through actual main polling and the driving-input boundary',()=>{
 for(const {button,deadzone,noise}of [{button:7,deadzone:.05,noise:.01},{button:11,deadzone:.2,noise:.1},{button:7,deadzone:0,noise:.01}]){
  const h=harness();h.c.drivingControls.throttleButton=button;h.c.drivingControls.triggerDeadzone=deadzone;
  h.release();h.poll({0:1,[button]:1});assert.equal(h.c.state,'countdown');neutral(h.currentInput());
  h.c.state='playing';h.poll({[button]:noise});neutral(h.currentInput());h.poll({[button]:1});
  if(deadzone===0){neutral(h.currentInput());h.release();h.poll({[button]:1});}
  assert.equal(h.currentInput().throttle,1,'a genuine release re-enables the mapped pedal using the saved threshold');
 }
});

/** Keep the frame's original statement order through its camera timing handoff.
 * Renderer/effects work after that boundary is irrelevant to controller timing. */
function frameBoundary(h:ReturnType<typeof harness>){
 const frame=main.statements.find((n):n is ts.FunctionDeclaration=>ts.isFunctionDeclaration(n)&&n.name?.text==='frame')!;
 const resume=main.statements.find((n):n is ts.FunctionDeclaration=>ts.isFunctionDeclaration(n)&&n.name?.text==='resume')!;
 assert.ok(frame?.body&&resume?.body);
 const end=frame.body.statements.findIndex(n=>ts.isExpressionStatement(n)&&ts.isCallExpression(n.expression)&&ts.isIdentifier(n.expression.expression)&&n.expression.expression.text==='updateCamera');
 assert.ok(end>=0,'the actual frame must hand its timestep to the camera');
 const prefix=frame.body.statements.slice(0,end+1).map(n=>n.getText(main)).join('\n');
 const code=ts.transpileModule(resume.getText(main)+'\nfunction frame('+frame.parameters.map(p=>p.getText(main)).join(',')+'){'+prefix+'}\nglobalThis.frameBoundary=frame;',{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
 let currentPad=pad(),wallTime=80;
 const order:string[]=[],cameraDt:number[]=[],renderAlpha:number[]=[],physicsInputs:Array<ReturnType<typeof drivingInput>>=[];
 Object.assign(h.c,{adaptiveGraphics:{sample:()=>false},preparingEvent:false,updateRumble(){order.push('rumble');},updateTrialGhost(){},withWreckBatch,lastFrame:80,clock:4,elapsed:0,accumulator:0,frames:[],eventFrameTimes:[],capturedFrames:null,physics:{},orbit:{enabled:false},
  navigator:{getGamepads:()=>[currentPad]},performance:{now:()=>wallTime},requestAnimationFrame(){order.push('raf');},
  document:{getElementById:(id:string)=>id==='overlay'?{remove(){h.ui.children.delete('#overlay');order.push('remove-overlay');}}:null},
  hud(){order.push('hud');},step(dt:number){order.push('physics');physicsInputs.push(h.functions.input());h.c.elapsed+=dt;},updateCamera(dt:number){order.push('camera');cameraDt.push(dt);},
 });
 h.c.sound.pause=()=>order.push('sound');h.c.cars[0].render=(alpha:number)=>renderAlpha.push(alpha);
 const update=h.c.controllerInput.update.bind(h.c.controllerInput);
 h.c.controllerInput.update=(...args:Parameters<ControllerInput['update']>)=>{order.push('poll');return update(...args);};
 runInNewContext(code,h.c);
 const run=(timestamp:number,buttons:Record<number,number>,laterWallTime=timestamp)=>{currentPad=pad(buttons);wallTime=laterWallTime;h.c.frameBoundary(timestamp);};
 return{run,order,cameraDt,renderAlpha,physicsInputs};
}

test('actual frame measures elapsed time before controller resume advances the wall clock, and polls before physics',()=>{
 for(const button of [0,9]){
  const h=harness('paused'),timing=frameBoundary(h),overlay=h.root('#overlay');h.button(overlay,'#resume','resumeButton',()=>h.c.resume());
  h.functions.pollController(80);timing.order.length=0;
  // The RAF timestamp is100ms, but resume's performance.now() is already107ms.
  timing.run(100,{[button]:1,7:1},107);
  assert.equal(h.c.state,'playing');assert.equal(h.c.lastFrame,107,'the production resume callback really advances lastFrame');
  assert.equal(timing.cameraDt[0],.02);assert.ok(Math.abs(h.c.clock-4.02)<1e-12);
  assert.equal(timing.physicsInputs.length,1);neutral(timing.physicsInputs[0]);
  assert.ok(timing.order.indexOf('poll')<timing.order.indexOf('physics'));
  assert.ok(timing.order.indexOf('remove-overlay')<timing.order.indexOf('physics'));
  assert.ok(timing.renderAlpha.every(alpha=>alpha>=0&&alpha<=1));
  timing.run(127,{});assert.deepEqual(timing.cameraDt,[.02,.02]);assert.ok(Math.abs(h.c.clock-4.04)<1e-12);assert.equal(timing.physicsInputs.length,2);
 }
 const driving=harness('playing'),timing=frameBoundary(driving);driving.functions.pollController(80);timing.order.length=0;
 timing.run(100,{7:1});assert.equal(timing.physicsInputs[0].throttle,1);assert.equal(driving.c.elapsed,1/60);
 timing.run(120,{9:1,7:1});assert.equal(driving.c.state,'paused');assert.equal(timing.physicsInputs.length,1,'Start is handled before another physics step can run');
 assert.deepEqual(timing.cameraDt,[.02,.02]);assert.ok(Math.abs(driving.c.clock-4.04)<1e-12);
});

test('career board has its own controller navigation and Back returns through the actual close callback',()=>{
 const h=harness();h.c.careerOpen=true;const root=h.root('.career-board');h.button(root,'#career-close','closeCareer',()=>h.c.careerOpen=false);h.release();assert.equal(h.navigation.context?.key,'career');h.poll({1:1});assert.equal(h.calls.closeCareer,1);assert.equal(h.c.careerOpen,false);assert.equal(h.calls.startEvent,undefined);
});

test('save restore confirmation owns controller Back and defaults to Cancel; busy restoration masks menu controls',()=>{
 const h=harness('paused'),overlay=h.root('#overlay');h.button(overlay,'#resume','resume');
 const confirmation=overlay.add('#save-confirm:not([hidden])');overlay.children.set('#save-confirm',confirmation);h.button(confirmation,'#save-cancel','cancel',()=>confirmation.hidden=true);
 h.release();assert.equal(h.navigation.context?.key,'save-confirm');assert.equal(h.navigation.context?.initial,'#save-cancel');h.poll({1:1});assert.equal(h.calls.cancel,1);assert.equal(h.calls.resume,undefined);
 overlay.add('.save-backup[aria-busy="true"]');h.release();assert.equal(h.functions.controllerContext(),null);
});


test('manual clutch and shift buttons retain driving actions, with legacy online fallback',()=>{
 const h=harness('playing');h.c.drivingControls.transmission='clutch';h.release();h.poll({1:1});
 assert.equal(h.c.state,'playing');assert.equal(h.currentInput().transmission?.clutch,1);
 h.release();h.c.drivingControls.shiftUpButton=2;h.poll({2:1});assert.equal(h.c.hood,false);assert.equal(h.currentInput().transmission?.up,true);
 h.release();h.c.drivingControls.shiftDownButton=3;h.poll({3:1});assert.equal(h.calls.recover,undefined);assert.equal(h.currentInput().transmission?.down,true);
 h.release();h.poll({9:1});assert.equal(h.c.state,'paused');
 const legacy=harness('playing');legacy.c.drivingControls.transmission='clutch';legacy.c.online={active:true,network:{snapshot:{}}};legacy.release();legacy.poll({1:1});assert.equal(legacy.c.state,'paused');assert.equal(legacy.currentInput().transmission,undefined);
});

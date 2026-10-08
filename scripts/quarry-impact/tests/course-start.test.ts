import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';
import * as T from 'three';
import {ReplayRecorder,decodeReplay,encodeReplay,replayCarStride} from '../src/replay-data';
import {stockSetup} from '../src/garage';

// Execute the actual start/recording functions, not a copied state machine.
// Asset construction, GPU compilation and DOM are injectable external boundaries.
const text=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),source=ts.createSourceFile('main.ts',text,ts.ScriptTarget.ES2022,true,ts.ScriptKind.TS);
const names=['start','captureReplay','archiveReplay','beginReplay'],declarations=names.map(name=>{
 const declaration=source.statements.find(s=>ts.isFunctionDeclaration(s)&&s.name?.text===name);assert.ok(declaration,'Missing production function '+name);return declaration.getText(source);
}).join('\n');
const executable=ts.transpileModule(declarations,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
type Faults={venue?:boolean;warm?:boolean;recovery?:boolean;recording?:boolean;audio?:boolean};
function harness(faults:Faults={}){
 const logs:{type:string;values:unknown[]}[]=[],calls:string[]=[],notes:any[]=[],nodes=new Map<string,any>();let reloads=0;
 const node=()=>({textContent:'',className:'',attributes:{} as Record<string,string>,onclick:undefined as undefined|(()=>void),setAttribute(k:string,v:string){this.attributes[k]=v;},append(child:unknown){notes.push(child);}});
 const ui={innerHTML:'original menu',querySelector(selector:string){if(!nodes.has(selector))nodes.set(selector,node());return nodes.get(selector);}};
 const quarry={course:{id:'quarry-v1'},props:[{},{}]},ironfield={course:{id:'ironfield-figure-eight-v1'},props:[]};
 const car=()=>({id:0,kind:'tern',setup:stockSetup('tern'),paintColor:new T.Color(0xabcdef),root:new T.Group(),current:new T.Vector3(0,.89,0),onVisualEvent:undefined as unknown,
  render(){if(faults.recording)throw Error('recording pose failed');},dispose(){calls.push('dispose car');}});
 const meta={version:1 as const,tyreModel:1 as const,mode:'race' as const,reverse:false,cars:[{id:0,kind:'tern' as const,setup:stockSetup('tern')}],props:2,created:'2026-10-02T17:00:00Z'};
 const frame=(carCount:number,props:number,tyreModel?:1,engineModel?:1)=>{const stride=replayCarStride({tyreModel,engineModel});const values=new Float32Array(carCount*stride+props*7);for(let i=0;i<carCount;i++){const o=i*stride;values[o+6]=1;values[o+14]=100;for(let j=0;j<4;j++){values[o+15+j*8+6]=1;if(tyreModel)values[o+56+j*6+1]=1;}}for(let i=0;i<props;i++)values[carCount*stride+i*7+6]=1;return values;};
 const recorder=new ReplayRecorder(meta);recorder.capture(0,()=>frame(1,2,1),true);recorder.capture(1,()=>frame(1,2,1),true);
 const previous=recorder.document(),context:any={T,activeTimeTrial:null,Error,Date,structuredClone,ReplayRecorder,console:{error:(...values:unknown[])=>logs.push({type:'error',values}),warn:(...values:unknown[])=>logs.push({type:'warn',values})},
  preparingEvent:false,preparationInterrupted:false,state:'paused',mode:'race',demo:false,demoRestart:0,demoOptions:{camera:'director'},keys:new Set(['KeyW']),testInput:{throttle:1},wreckHold:2,
  telemetry:{old:true},activeChallenge:{id:'prior'},runSettled:false,lastAward:{old:true},runId:'previous',eventFrameTimes:[16],elapsed:2,countdown:0,accumulator:.01,
  recorder,lastReplay:null,replayEpochs:[0],studio:null,online:{active:false},cars:[car()],activeVenue:quarry,
  director:{reset(){calls.push('director reset');},select(view:string){calls.push('director '+view);}},cameraImpactOffset:new T.Vector3(),camera:new T.PerspectiveCamera(),orbit:{enabled:true},ui,
  bankRun(){calls.push('bank run');},loading(){calls.push('loading');ui.innerHTML='loading';},toast(){calls.push('audio notice');},setQuarryMode(){calls.push('venue mode');},
  sound:{async init(){calls.push('audio');if(faults.audio)throw Error('audio unavailable');},pause(value:boolean){calls.push('sound '+value);}},
  staticShadows:{bindReceivers(){calls.push('bind shadows');}},async warmPrograms(){calls.push('warm programs');await Promise.resolve();if(faults.warm)throw Error('GPU compilation failed');},
  clubRound:()=>null,customEvent:()=>true,eventOptions:{direction:'forward'},crypto:{randomUUID:()=> 'new-run'},SessionTelemetry:class {},
  document:{hidden:false,createElement:node},location:{reload(){reloads++;}},hud(){calls.push('hud');ui.innerHTML='hud';},pause(){calls.push('pause');context.state='paused';},
  captureReplayFrame(cars:unknown[],props:unknown[],_epochs:number[],tyreModel?:1,engineModel?:1){calls.push(`capture ${cars.length}/${props.length}`);return frame(cars.length,props.length,tyreModel,engineModel);},
  createCars(attract=false){
   calls.push(attract?'recover Quarry':'create event');if(attract&&faults.recovery)throw Error('Quarry recovery unavailable');if(!attract&&faults.venue)throw Error('Ironfield construction failed');
   context.archiveReplay();for(const old of context.cars)old.dispose();context.cars=[car()];context.activeVenue=attract?quarry:ironfield;
  },
  menu(){calls.push('menu');context.archiveReplay();context.state='menu';context.demo=false;ui.innerHTML='menu';},
 };
 runInNewContext(executable,context);
 return{context,previous,faults,notes,nodes,calls,logs,get reloads(){return reloads;},start:(demo=false)=>context.start(demo) as Promise<boolean>};
}
function usablePrevious(h:ReturnType<typeof harness>,frames:number){
 const doc=h.context.lastReplay;assert.ok(doc);assert.equal(doc.meta.courseId,undefined);assert.equal(doc.meta.props,2);assert.equal(doc.frames.length,frames);
 assert.deepEqual(decodeReplay(encodeReplay(doc)).frames,doc.frames,'Retained recording still passes the production codec');
 assert.deepEqual(doc.frames.slice(0,2),h.previous.frames);assert.equal(h.context.recorder,null);assert.ok(h.context.cars.every((c:any)=>c.onVisualEvent===undefined));
}

test('lazy venue failure returns to a usable menu, preserves the previous replay and permits a successful retry',async()=>{
 const h=harness({venue:true});assert.equal(await h.start(true),false);assert.equal(h.context.preparingEvent,false);assert.equal(h.context.state,'menu');assert.equal(h.context.activeVenue.course.id,'quarry-v1');assert.equal(h.context.demo,false);assert.equal(h.context.telemetry,null);assert.equal(h.context.runSettled,true);usablePrevious(h,2);
 assert.equal(h.notes.length,1);assert.equal(h.notes[0].attributes.role,'alert');assert.match(h.notes[0].textContent,/Returned to the Quarry.*Ironfield construction failed/);assert.equal(h.calls.includes('warm programs'),false);assert.equal(h.logs.filter(l=>l.type==='error').length,1);
 h.faults.venue=false;assert.equal(await h.start(),true);assert.equal(h.context.preparingEvent,false);assert.equal(h.context.state,'countdown');assert.equal(h.context.activeVenue.course.id,'ironfield-figure-eight-v1');assert.equal(h.context.recorder.meta.courseId,'ironfield-figure-eight-v1');assert.equal(h.context.recorder.meta.props,0);assert.equal(h.context.recorder.frames.length,1);assert.equal(h.context.recorder.stride,replayCarStride({tyreModel:1,engineModel:1}));
});

test('asynchronous shader failure retains the fully archived old run and cannot record replacement Quarry cars into it',async()=>{
 const h=harness({warm:true});assert.equal(await h.start(),false);assert.equal(h.context.preparingEvent,false);assert.equal(h.context.state,'menu');usablePrevious(h,3);
 assert.equal(h.calls.filter(c=>c==='create event').length,1);assert.equal(h.calls.filter(c=>c==='recover Quarry').length,1);assert.equal(h.calls.filter(c=>c==='capture 1/2').length,1);assert.equal(h.calls.includes('capture 1/0'),false);assert.match(h.notes[0].textContent,/GPU compilation failed/);
});

test('failed menu recovery exposes a working reload button and leaves the frame loop in its safe loading state',async()=>{
 const h=harness({warm:true,recovery:true});assert.equal(await h.start(),false);assert.equal(h.context.preparingEvent,false);assert.equal(h.context.state,'loading');usablePrevious(h,3);
 assert.match(h.context.ui.innerHTML,/RELOAD GAME/);assert.match(h.nodes.get('#event-start-error').textContent,/Quarry menu could not be prepared/);assert.equal(h.calls.at(-1),'sound true');assert.equal(h.logs.filter(l=>l.type==='error').length,2);
 h.nodes.get('#event-reload').onclick();assert.equal(h.reloads,1);
});

test('failure after beginReplay clears the new recorder and restores the previous valid replay',async()=>{
 const h=harness({recording:true});assert.equal(await h.start(),false);assert.equal(h.context.state,'menu');assert.equal(h.context.preparingEvent,false);usablePrevious(h,3);assert.match(h.notes[0].textContent,/recording pose failed/);
});

test('preparation stays exclusive across awaits and successful hidden-page start retains the existing pause behavior',async()=>{
 const h=harness({audio:true});h.context.document.hidden=true;
 const first=h.start();assert.equal(h.context.preparingEvent,true);assert.equal(await h.start(),false);assert.equal(await first,true);assert.equal(h.context.preparingEvent,false);assert.equal(h.context.state,'paused');assert.equal(h.calls.filter(c=>c==='create event').length,1);assert.equal(h.calls.includes('audio notice'),true);assert.equal(h.logs.filter(l=>l.type==='error').length,0);
});

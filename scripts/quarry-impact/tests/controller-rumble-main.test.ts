import test from 'node:test';import assert from 'node:assert/strict';import{readFileSync}from'node:fs';import{runInNewContext}from'node:vm';import ts from'typescript';
import{ControllerRumble,type RumblePad}from'../src/controller-rumble';import{defaultControls,selectedPad}from'../src/driving-controls';
const source=ts.createSourceFile('main.ts',readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),ts.ScriptTarget.ES2022,true);
function game(){const effects:any[]=[],resets:any[]=[];const pad:RumblePad={id:'Player pad',index:0,connected:true,axes:[],buttons:[],vibrationActuator:{playEffect(_type,e){effects.push(e);return Promise.resolve('complete');},reset(){resets.push(1);return Promise.resolve('complete');}}};
 const ctx:any={state:'playing',demo:false,studio:null,preparingEvent:false,document:{hidden:false},online:null,clubPlayerStopped:false,cars:[{health:100,finished:false,speed:20,slip:0,surface:'gravel',scraping:0,controller:{wheelIsInContact:()=>true}}],navigator:{getGamepads:()=>[pad]},controllerRumble:new ControllerRumble(),drivingControls:defaultControls(),selectedPad};
 const declarations=['recordRumbleImpact','updateRumble'].map(name=>source.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text===name)!.getText(source));
 runInNewContext(ts.transpileModule(declarations.join('\n')+'\nglobalThis.api={recordRumbleImpact,updateRumble};',{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText,ctx);
 return{ctx,pad,effects,resets};}
test('production routing enables driving feedback and silences every non-driving lifecycle',()=>{
 for(const patch of [{state:'menu'},{state:'paused'},{state:'result'},{state:'loading'},{state:'countdown'},{demo:true},{studio:{}},{preparingEvent:true},{document:{hidden:true}},{clubPlayerStopped:true},{online:{active:true,network:{connected:false}}}]){
  const f=game();f.ctx.api.updateRumble(0);assert.equal(f.effects.length,1);Object.assign(f.ctx,patch);f.ctx.api.updateRumble(70);f.ctx.api.recordRumbleImpact(1);assert.equal(f.resets.length,1,JSON.stringify(patch));assert.equal(f.effects.length,1);
 }
});
test('production player contacts reach the actuator; finished players and remote airborne cars stay quiet',()=>{
 const f=game();f.ctx.api.updateRumble(0);f.ctx.api.recordRumbleImpact(.9);f.ctx.api.updateRumble(60);assert.ok(f.effects.at(-1).strongMagnitude>.5);
 f.ctx.cars[0].finished=true;f.ctx.api.updateRumble(120);assert.equal(f.resets.length,1);
 f.ctx.cars[0].finished=false;f.ctx.online={active:true,network:{connected:true}};f.ctx.cars[0].remoteGrounded=false;f.ctx.api.updateRumble(200);assert.equal(f.effects.length,2);
 f.ctx.cars[0].remoteGrounded=true;f.ctx.api.updateRumble(270);assert.equal(f.effects.length,3);
});

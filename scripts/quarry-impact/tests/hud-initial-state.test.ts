import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const source=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
function fn(name:string){const start=source.indexOf(`function ${name}(`);const end=source.indexOf('\nfunction ',start+1);return source.slice(start,end);}
const code=ts.transpile([fn('hud'),fn('updateHud'),fn('text'),fn('formatTime')].join('\n'),{target:ts.ScriptTarget.ES2022});
for(const demo of [false,true])for(const state of ['countdown','playing'])test(`${demo?'demo':'player'} ${state} HUD is populated synchronously before an immediate pause`,()=>{
 const elements=new Map<string,any>();
 const ingest=(html:string)=>{for(const m of html.matchAll(/id="([^"]+)"/g))elements.set(m[1],{textContent:'',innerHTML:'',style:{}});};
 const generic={textContent:'',append(){},insertAdjacentHTML(_where:string,html:string){ingest(html);}};
 const ui={set innerHTML(html:string){elements.clear();ingest(html);},querySelector(selector:string){if(selector.startsWith('#'))return elements.get(selector.slice(1))??generic;return generic;}};
 const car={id:0,kind:'test',health:67,speed:10,rpm:3200,gear:2,surface:'asphalt',engineDamage:0,engineStall:0,tyreDamage:[],setup:{armor:0},structuralDamage:[],input:{throttle:0},damageLeft:0,damageRight:0,lap:2,penalty:3,finished:false,rollTime:0,nextCheckpoint:0,current:{x:0,z:0},forward:{dot:()=>1}};
 const context:any={ui,document:{getElementById:(id:string)=>elements.get(id),querySelector:(selector:string)=>selector==='#instruments'?null:elements.get(selector.slice(1))??null,createElement:()=>({})},state,mode:'race',demo,cars:[car],kind:'test',activeVenue:{course:{id:'test',name:'Test Circuit'}},quarryVenue:{},DEFINITIONS:{test:{name:'Test Car'}},eventLabel:()=> 'RACE',drivingControls:{keys:Object.fromEntries(['throttle','reverse','left','right','handbrake'].map(k=>[k,['KeyA']])),transmission:'automatic'},keyLabel:(s:string)=>s,pursuit:null,online:null,activeTimeTrial:null,scoreDerby:()=>false,customEvent:()=>false,waypointRace:null,settings:{performance:false},activeChallenge:null,activeClubRound:null,onlineRules:()=>null,refreshStandings(){},toggleStandings(){},pause(){},demoHud(){elements.set('follow-name',{textContent:''});},director:{followed:0,manual:false,view:'chase'},raceLaps:()=>3,raceTimeLimit:()=>0,eventDuration:()=>300,elapsed:42,eventFrameTimes:[],clamp:(n:number,a:number,b:number)=>Math.max(a,Math.min(n,b)),transmissionGearLabel:()=> '2',transmissionNotice:()=>'',engineStatus:()=> 'ENGINE OK',tyreWarning:()=>'',armorWearWarning:()=>'',stallHint:()=>'',rankRace:()=>[car],countdown:2.5,clock:42,statusUntil:0,statusMessage:'',drawMap(){},raceRoute:()=>[{x:1,z:1}],T:{Vector3:class{normalize(){return this;}}}};
 vm.createContext(context);vm.runInContext(code+'\nhud();',context);
 // No animation frame or simulation step has run. A focus pause now must retain actual values.
 context.state='paused';vm.runInContext('updateHud();',context);
 assert.equal(elements.get('event-value').textContent,'1 / 1');
 assert.equal(elements.get('time-value').textContent,'2 / 3 · 00:45');
 assert.equal(elements.get('health').textContent,'67%');
 assert.equal(elements.get('health-bar').style.width,'67%');
 assert.equal(elements.get('surface').textContent,'ASPHALT');
 assert.equal(elements.get('speed').textContent,'36');
 assert.equal(context.elapsed,42);assert.equal(context.countdown,2.5);
 assert.equal(elements.get('countdown').innerHTML.includes('<strong>3</strong>'),state==='countdown');
 if(demo)assert.equal(elements.get('follow-name').textContent,'#1 Test Car');
});

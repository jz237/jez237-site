import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import vm from 'node:vm';
import {lessonNames} from '../lib/LearningContent.ts';

const source=stripTypeScriptTypes(readFileSync(new URL('../lib/Showroom.ts',import.meta.url),'utf8').replace(/^import .*;$/gm,'' )).replace('export function','function')+'\nthis.install=installShowroom;';
function fixture(search='?showroom=hidden-reef'){
 const listeners={},nodes=new Map(),sent=[],calls=[];
 const node=key=>{if(!nodes.has(key))nodes.set(key,{textContent:'',innerHTML:'',expanded:'false',getAttribute(){return this.expanded;},click(){this.expanded='true';calls.push(key);}});return nodes.get(key);};
 const parent={postMessage:message=>sent.push(message)},document={body:{classList:{add(){}}},querySelector:node,addEventListener:(name,fn)=>listeners[name]=fn};
 const aquarium={paused:false,suspended:false,identifyMode:false,onLessonRequest:m=>calls.push(m),onIdentify:info=>calls.push(info),identifyFish:i=>calls.push(['fish',i])};
 const context={document,parent,window:{},location:{origin:'https://reef.test',search},URLSearchParams,lessonNames,addEventListener:(name,fn)=>listeners[name]=fn};
 vm.runInNewContext(source,context);context.install(aquarium);
 const message=(data,origin='https://reef.test',sender=parent)=>listeners.message?.({origin,source:sender,data:{channel:'hidden-reef-showroom',...data}});
 return {aquarium,message,listeners,calls,sent};
}
test('storefront commands accept only the embedding origin and parent window',()=>{
 const f=fixture();f.message({type:'lesson',value:'water'},'https://other.test');f.message({type:'lesson',value:'water'},undefined,{});f.message({type:'lesson',value:'invalid'});assert.deepEqual(f.calls,[]);
 f.message({type:'lesson',value:'water'});assert.deepEqual(f.calls,['water']);
});
test('offscreen suspension preserves the visitor pause state and rejects malformed visibility',()=>{
 const f=fixture();f.aquarium.paused=true;f.message({type:'visibility',value:false});assert.equal(f.aquarium.suspended,true);assert.equal(f.aquarium.paused,true);
 f.message({type:'visibility',value:'yes'});assert.equal(f.aquarium.suspended,true);
 f.message({type:'visibility',value:true});assert.equal(f.aquarium.suspended,false);assert.equal(f.aquarium.paused,true);
});
test('cutaway opens its detailed filter step and identification reports context',()=>{
 const f=fixture();f.message({type:'cutaway'});assert.deepEqual(f.calls,['water','[data-step="1"]']);
 f.listeners['aquascape-context']({detail:{kind:'fish',name:'Cardinal tetra'}});assert.equal(f.sent.at(-1).type,'context');assert.equal(f.sent.at(-1).name,'Cardinal tetra');
});
test('standalone aquarium does not install store controls',()=>{
 const f=fixture('');assert.equal(f.listeners.message,undefined);assert.equal(f.aquarium.identifyMode,false);assert.deepEqual(f.sent,[]);
});

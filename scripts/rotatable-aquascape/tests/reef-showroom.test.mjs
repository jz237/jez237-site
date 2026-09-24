import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import vm from 'node:vm';
const source=stripTypeScriptTypes(readFileSync(new URL('../reef/ReefShowroom.ts',import.meta.url),'utf8')).replace('export function','function')+';this.install=installReefShowroom;';
test('reef bridge validates origin, parent, channel and visibility type',()=>{
 const listeners={},sent=[],calls=[],parent={postMessage:m=>sent.push(m)};
 const context={URLSearchParams,location:{search:'?showroom=hidden-reef',origin:'https://reef.test'},parent,window:{},document:{body:{classList:{add(){}}},querySelector:()=>({setAttribute(){}})},addEventListener:(k,fn)=>listeners[k]=fn};
 vm.runInNewContext(source,context);
 const bridge=context.install({visibility:v=>calls.push(v),explore:v=>calls.push(v)});
 const message=(data,origin='https://reef.test',source=parent)=>listeners.message({origin,source,data:{channel:'hidden-reef-showroom',...data}});
 message({type:'visibility',value:false},'https://untrusted.test');message({type:'visibility',value:false},undefined,{});message({type:'visibility',value:'false'});message({channel:'wrong',type:'visibility',value:false});assert.deepEqual(calls,[]);
 message({type:'visibility',value:false});message({type:'visibility',value:true});message({type:'explore',value:'goby'});assert.deepEqual(calls,[false,true,'goby']);
 bridge.ready();bridge.context('Mandarin dragonet');assert.equal(sent[0].type,'ready');assert.equal(sent[1].kind,'reef');assert.equal(sent[1].name,'Mandarin dragonet');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

// Exercise the actual storefront launch/visibility bridge, excluding catalog UI.
const source=readFileSync(new URL('../../../prototypes/hidden-reef/assets/showroom.js',import.meta.url),'utf8').split('  const planner=')[0]+'})();';
function fixture(search=''){
 const listeners={},nodes=new Map(),frames=[],messages=[];
 const node=key=>{
  if(!nodes.has(key))nodes.set(key,{hidden:false,textContent:'',classList:{contains:()=>false},addEventListener:(type,fn)=>listeners[key+':'+type]=fn,append(f){frames.push(f);},focus(){},scrollIntoView(){}});
  return nodes.get(key);
 };
 const document={hidden:false,body:node('body'),querySelector:node,querySelectorAll:()=>[],addEventListener:(type,fn)=>listeners[type]=fn,createElement:()=>({contentWindow:{postMessage:m=>messages.push(m)},setAttribute(){},remove(){this.removed=true;}})};
 const context={document,location:{origin:'https://reef.test',search},URLSearchParams,setTimeout:()=>1,clearTimeout(){},addEventListener:(type,fn)=>listeners[type]=fn,IntersectionObserver:class{constructor(fn){listeners.intersection=fn;}observe(){}},MutationObserver:class{observe(){}}};
 vm.runInNewContext(source,context);
 const ready=()=>listeners.message({origin:'https://reef.test',source:frames.at(-1).contentWindow,data:{channel:'hidden-reef-aquarium',type:'ready'}});
 return {nodes,frames,messages,listeners,ready};
}
test('store arrival launches without a second click; close stays closed until explicit reopen',()=>{
 const f=fixture();assert.equal(f.frames.length,1);assert.equal(f.frames[0].src,'./aquarium/?showroom=hidden-reef');assert.equal(f.nodes.get('#tank-cover').hidden,true);
 f.ready();assert.equal(f.messages.at(-1).type,'visibility');assert.equal(f.messages.at(-1).value,true);
 f.listeners['#close-tank:click']();assert.equal(f.frames[0].removed,true);assert.equal(f.nodes.get('#tank-cover').hidden,false);assert.equal(f.frames.length,1);
 f.listeners['#launch:click']();assert.equal(f.frames.length,2);f.ready();assert.equal(f.messages.at(-1).value,true);
});
test('automatic entry preserves requested lessons and offscreen suspension',()=>{
 const f=fixture('?lesson=water');f.ready();assert.equal(f.messages.at(-1).type,'lesson');assert.equal(f.messages.at(-1).value,'water');
 f.listeners.intersection([{isIntersecting:false}]);assert.equal(f.messages.at(-1).value,false);
 f.listeners.intersection([{isIntersecting:true}]);assert.equal(f.messages.at(-1).value,true);
});

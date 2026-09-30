import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

// Exercise the actual storefront launch/visibility bridge, excluding catalog UI.
const source=readFileSync(new URL('../../../prototypes/hidden-reef/assets/showroom.js',import.meta.url),'utf8').split('  const planner=')[0]+'})();';
function fixture(search=''){
 const listeners={},nodes=new Map(),frames=[],messages=[];
 const node=key=>{
  if(!nodes.has(key))nodes.set(key,{hidden:false,textContent:'',dataset:{},querySelector:child=>node(key+' '+child),rect:{width:900,height:600,top:0,bottom:600,left:0,right:900},getBoundingClientRect(){return this.rect;},classList:{contains:()=>false},addEventListener:(type,fn)=>listeners[key+':'+type]=fn,append(f){frames.push(f);},focus(){},scrollIntoView(){}});
  return nodes.get(key);
 };
 const document={hidden:false,body:node('body'),querySelector:node,querySelectorAll:()=>[],addEventListener:(type,fn)=>listeners[type]=fn,createElement:()=>({contentWindow:{postMessage:m=>messages.push(m)},setAttribute(){},remove(){this.removed=true;}})};
 const context={document,location:{origin:'https://reef.test',search},URLSearchParams,setTimeout:()=>1,clearTimeout(){},addEventListener:(type,fn)=>listeners[type]=fn,IntersectionObserver:class{constructor(fn){listeners.intersection=fn;}observe(){}},MutationObserver:class{observe(){}}};
 context.window=context;context.innerWidth=1280;context.innerHeight=900;
 vm.runInNewContext(source,context);
 const ready=()=>listeners.message({origin:'https://reef.test',source:frames.at(-1).contentWindow,data:{channel:'hidden-reef-aquarium',type:'ready'}});
 return {nodes,frames,messages,listeners,ready};
}
test('ordinary store arrival stays lightweight until explicit entry; close stays closed',()=>{
 const f=fixture();assert.equal(f.frames.length,0);f.listeners['#launch:click']();assert.equal(f.frames.length,1);assert.equal(f.frames[0].src,'./aquarium/?showroom=hidden-reef');assert.equal(f.nodes.get('#tank-cover').hidden,true);
 f.ready();assert.equal(f.messages.at(-1).type,'visibility');assert.equal(f.messages.at(-1).value,true);
 f.listeners['#close-tank:click']();assert.equal(f.frames[0].removed,true);assert.equal(f.nodes.get('#tank-cover').hidden,false);assert.equal(f.frames.length,1);
 f.listeners['#launch:click']();assert.equal(f.frames.length,2);f.ready();assert.equal(f.messages.at(-1).value,true);
});
test('automatic entry preserves requested lessons and offscreen suspension',()=>{
 const f=fixture('?lesson=water');f.ready();assert.equal(f.messages.at(-1).type,'lesson');assert.equal(f.messages.at(-1).value,'water');
 f.nodes.get('#tank-mount').rect.top=1000;f.listeners.intersection([{isIntersecting:false}]);assert.equal(f.messages.at(-1).value,false);
 f.nodes.get('#tank-mount').rect.top=0;f.listeners.intersection([{isIntersecting:true}]);assert.equal(f.messages.at(-1).value,true);
});

test('reef deep link loads only the reef when entered',()=>{const f=fixture('?habitat=reef');assert.equal(f.frames.length,0);f.listeners['#launch:click']();assert.equal(f.frames[0].src,'./reef/?showroom=hidden-reef');f.ready();assert.equal(f.messages.at(-1).value,true);});

test('returning to a visible showroom rechecks its bounds instead of holding stale offscreen state',()=>{
 const f=fixture('?lesson=water');f.ready();const mount=f.nodes.get('#tank-mount');
 mount.rect.top=1000;f.listeners.intersection([{isIntersecting:false}]);assert.equal(f.messages.at(-1).value,false);
 mount.rect.top=0;f.listeners.pageshow();assert.equal(f.messages.at(-1).value,true);
});

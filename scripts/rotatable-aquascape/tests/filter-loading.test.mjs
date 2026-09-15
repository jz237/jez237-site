import test from 'node:test';
import assert from 'node:assert/strict';
import {installFilterExperience} from '../lib/FilterExperience.ts';
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function setup(){
 const listeners=new Map(),main={children:[],append(el){this.children.push(el);el.parent=this;}},doc={activeElement:null,createElement(){return {children:[],attrs:{},setAttribute(k,v){this.attrs[k]=v},removeAttribute(k){delete this.attrs[k]},append(...children){this.children.push(...children)},replaceChildren(...children){this.children=children},remove(){this.parent.children=this.parent.children.filter(c=>c!==this)},focus(){doc.activeElement=this}}},querySelector(){return main},addEventListener(k,fn){listeners.set(k,fn)},removeEventListener(k){listeners.delete(k)},dispatchEvent(){}};
 globalThis.document=doc;const focus=doc.createElement();focus.focus();const aquarium={paused:false,filterOpen:false};return {doc,main,listeners,focus,aquarium};
}
test('filter code waits for an explicit open, ignores duplicate clicks, and cancellation never mounts late',async()=>{
 const {main,aquarium,focus,doc}=setup();let resolve,calls=0,mounts=0;
 installFilterExperience(aquarium,()=>{calls++;return new Promise(r=>resolve=r)});assert.equal(calls,0);
 aquarium.onFilterRequest(2);aquarium.onFilterRequest(4);assert.equal(calls,1);assert.equal(main.children.length,1);assert.equal(aquarium.paused,true);
 main.children[0].children[1].onclick();assert.equal(aquarium.paused,false);assert.equal(aquarium.filterOpen,false);assert.equal(doc.activeElement,focus);
 resolve({mountFilter(){mounts++;return ()=>{}}});await tick();assert.equal(mounts,0);assert.equal(main.children.length,0);
});
test('successful filter loading restores prior pause and disposes exactly once on close',async()=>{
 const {main,aquarium}=setup();aquarium.paused=true;let closed,disposed=0,part;
 installFilterExperience(aquarium,async()=>({mountFilter(host,p,close){part=p;closed=close;return ()=>disposed++;}}));
 aquarium.onFilterRequest(1);await tick();assert.equal(part,1);assert.equal(aquarium.filterOpen,true);closed();closed();assert.equal(disposed,1);assert.equal(aquarium.paused,true);assert.equal(main.children.length,0);
});
test('download failure stays closable and Escape resumes the aquarium',async()=>{
 const {main,aquarium,listeners}=setup();installFilterExperience(aquarium,async()=>{throw Error('offline')});aquarium.onFilterRequest();await tick();
 assert.match(main.children[0].children[0].textContent,/could not load/);listeners.get('keydown')({key:'Escape',preventDefault(){}});assert.equal(aquarium.paused,false);assert.equal(aquarium.filterOpen,false);assert.equal(main.children.length,0);
});

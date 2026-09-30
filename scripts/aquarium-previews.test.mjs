import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('../prototypes/hidden-reef/assets/aquarium-worlds.js',import.meta.url),'utf8');
const settle=()=>new Promise(resolve=>setImmediate(resolve));
function fixture({failure,delayed=false,observer=true,failBoth=false}={}){
 const listeners={},timers=new Map();let timer=0,intersect;
 const emitter=()=>({listeners:{},addEventListener(type,fn){(this.listeners[type]??=[]).push(fn);},emit(type,event={}){for(const fn of this.listeners[type]??[])fn(event);}});
 const toggle=Object.assign(emitter(),{hidden:true,attributes:{},setAttribute(k,v){this.attributes[k]=v;},contains(t){return t===this;}});
 const videos=[0,1].map(i=>Object.assign(emitter(),{
  dataset:{src:'preview'+i+'.mp4'},paused:true,calls:0,rect:{width:400,height:250,top:100,bottom:350,left:0,right:400},classes:new Set(),
  hasAttribute(){return !!this.src;},removeAttribute(){this.src='';},load(){},getBoundingClientRect(){return this.rect;},
  pause(){if(!this.paused){this.paused=true;this.emit('pause');}},
  play(){this.calls++;if((i===0||failBoth)&&this.calls===1){if(failure)return Promise.reject(Object.assign(new Error(failure),{name:failure}));if(delayed)return new Promise((resolve,reject)=>{this.reject=reject;});}this.paused=false;this.emit('playing');return Promise.resolve();}
 }));
 for(const v of videos)v.classList={add:n=>v.classes.add(n),remove:n=>v.classes.delete(n)};
 const section={querySelector:()=>toggle,querySelectorAll:()=>videos};
 const document=Object.assign(emitter(),{hidden:false,querySelector:()=>section});
 const context={document,Promise,innerWidth:1280,innerHeight:800,navigator:{connection:{saveData:true}},matchMedia:()=>({matches:true}),setTimeout:fn=>{timers.set(++timer,fn);return timer;},clearTimeout:id=>timers.delete(id),requestAnimationFrame:fn=>fn(),addEventListener:(type,fn)=>listeners[type]=fn};
 context.window=context;
 if(observer)context.IntersectionObserver=class{constructor(fn){intersect=fn;}observe(){}};
 vm.runInNewContext(source,context);
 return {videos,toggle,document,listeners,update:()=>intersect?.(),timers,runTimers(){const pending=[...timers.values()];timers.clear();pending.forEach(fn=>fn());}};
}
test('both visible clips autoplay even with data saving/reduced motion; no observer is required',async()=>{
 for(const observer of [true,false]){const f=fixture({observer});await settle();assert.deepEqual(f.videos.map(v=>v.paused),[false,false]);assert.equal(f.toggle.textContent,'Pause previews');assert.ok(f.videos.every(v=>v.muted&&v.defaultMuted&&v.playsInline));}
});
test('a slow pending start is not duplicated; leaving and returning cannot permanently disable it',async()=>{
 const f=fixture({delayed:true}),v=f.videos[0];f.update();f.update();assert.equal(v.calls,1);
 v.rect.top=900;f.update();v.reject(Object.assign(new Error('interrupted'),{name:'AbortError'}));await settle();
 v.rect.top=100;f.update();await settle();assert.equal(v.paused,false);assert.equal(f.videos[1].paused,false);
});
test('transient AbortError retries only the interrupted clip',async()=>{
 const f=fixture({failure:'AbortError'});await settle();assert.equal(f.videos[1].paused,false);assert.equal(f.toggle.textContent,'Pause previews');
 f.runTimers();await settle();assert.equal(f.videos[0].paused,false);assert.equal(f.videos[1].calls,1);
});
test('browser autoplay denial leaves the other video running and retries on genuine interaction',async()=>{
 const f=fixture({failure:'NotAllowedError'});await settle();assert.equal(f.toggle.textContent,'Pause previews');assert.equal(f.videos[1].paused,false);
 f.document.emit('pointerdown',{target:{}});await settle();assert.equal(f.videos[0].paused,false);assert.equal(f.toggle.textContent,'Pause previews');
 f.toggle.emit('click');await settle();f.document.emit('pointerdown',{target:{}});assert.ok(f.videos.every(v=>v.paused),'manual pause remains paused');
});
test('blocked Play button resumes without being toggled off by its preceding pointer event',async()=>{
 const f=fixture({failure:'NotAllowedError',failBoth:true});await settle();assert.equal(f.toggle.textContent,'Play previews');f.document.emit('pointerdown',{target:f.toggle});f.toggle.emit('click');await settle();assert.ok(f.videos.every(v=>!v.paused));
});
test('tab visibility suspends and resumes, while manual pause survives visibility changes',async()=>{
 const f=fixture();await settle();f.document.hidden=true;f.document.emit('visibilitychange');assert.ok(f.videos.every(v=>v.paused));
 f.document.hidden=false;f.document.emit('visibilitychange');await settle();assert.ok(f.videos.every(v=>!v.paused));
 f.toggle.emit('click');f.document.emit('visibilitychange');assert.ok(f.videos.every(v=>v.paused));
 f.listeners.pageshow({persisted:true});await settle();assert.ok(f.videos.every(v=>!v.paused));
});
test('a media error keeps the photograph, the other clip and the retry button usable',async()=>{
 const f=fixture();await settle();f.videos[0].emit('error');assert.equal(f.videos[0].classes.has('is-playing'),false);assert.equal(f.videos[1].paused,false);assert.equal(f.toggle.hidden,false);
 f.listeners.online();await settle();assert.ok(f.videos.every(v=>!v.paused));
});

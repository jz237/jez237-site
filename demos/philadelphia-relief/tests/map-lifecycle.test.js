import test from 'node:test';
import assert from 'node:assert/strict';
import { createMapLifecycle } from '../src/map-lifecycle.js';

function fixture(){
  const win=new EventTarget(),doc=new EventTarget(),canvas=new EventTarget();doc.hidden=false;
  let running=false,disposed=0,lost=0,restored=0;
  createMapLifecycle({window:win,document:doc,canvas,pause(){running=false;},resume(){running=true;},
    dispose(){disposed++;},contextLost(){lost++;},contextRestored(){restored++;}});
  const page=(type,persisted)=>{const event=new Event(type);event.persisted=persisted;win.dispatchEvent(event);};
  return {page,get running(){return running;},get disposed(){return disposed;},
    get lost(){return lost;},get restored(){return restored;},
    hidden(value){doc.hidden=value;doc.dispatchEvent(new Event('visibilitychange'));},
    context(type){const event=new Event(type,{cancelable:true});canvas.dispatchEvent(event);return event;}};
}
test('browser back/forward caching preserves the scene and supports repeated returns',()=>{
  const f=fixture();assert.equal(f.running,true);
  for(let i=0;i<3;i++){
    f.page('pagehide',true);assert.equal(f.running,false);assert.equal(f.disposed,0);
    f.hidden(false);assert.equal(f.running,false,'visibility cannot resume a cached page early');
    f.page('pageshow',true);assert.equal(f.running,true);
  }
  f.page('pagehide',false);assert.equal(f.disposed,1);
});
test('a hidden or GPU-lost scene cannot restart until both conditions clear',()=>{
  const f=fixture();f.hidden(true);assert.equal(f.running,false);
  const lost=f.context('webglcontextlost');assert.equal(lost.defaultPrevented,true);
  f.hidden(false);assert.equal(f.running,false);assert.equal(f.lost,1);
  f.hidden(true);f.context('webglcontextrestored');assert.equal(f.restored,1);
  assert.equal(f.running,false);f.hidden(false);assert.equal(f.running,true);
  f.page('pagehide',false);
});
test('context recovery during a cached page waits until the page is restored',()=>{
  const f=fixture();f.page('pagehide',true);f.context('webglcontextlost');
  f.context('webglcontextrestored');assert.equal(f.running,false);
  f.page('pageshow',true);assert.equal(f.running,true);assert.equal(f.disposed,0);
  f.page('pagehide',false);
});
test('a real unload disposes exactly once and removes every resume path',()=>{
  const f=fixture();f.page('pagehide',false);assert.equal(f.disposed,1);assert.equal(f.running,false);
  f.hidden(false);f.page('pageshow',true);f.context('webglcontextrestored');f.page('pagehide',false);
  assert.equal(f.running,false);assert.equal(f.disposed,1);assert.equal(f.restored,0);
});

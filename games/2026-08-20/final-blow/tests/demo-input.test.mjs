import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const source=readFileSync(new URL('../game.js',import.meta.url),'utf8').replace(/\r\n/g,'\n');
function harness() {
  const handlers={}, calls=[];
  const demoSession={active:true};
  const demoSpeed={paused:false,togglePause(){this.paused=!this.paused;calls.push('pause');}};
  class Element {
    constructor({frame=true,control=false}={}) {this.frame=frame;this.control=control;}
    closest(selector) {return (selector==='#gameFrame'?this.frame:this.control)?this:null;}
  }
  const context={Element,demoSession,demoSpeed,
    window:{addEventListener(type,fn){handlers[type]=fn;}},
    document:{addEventListener(type,fn){handlers[type]=fn;}},
    armAttractAudio(){calls.push('audio');},
    attractSoundChipPress:e=>Boolean(e.sound),isDemoShareTarget:e=>Boolean(e.share),
    noteDemoPresence(){calls.push('presence');},syncDemoSpeedTag(){calls.push('sync');},
    noteUserActivity(){calls.push('activity');},
    handleDemoSpeedKey:e=>Boolean(e.transport),
    exitDemo(){demoSession.active=false;calls.push('exit');},
  };
  for(const [start,end] of [
    ['window.addEventListener("keydown", (event) => {','\nwindow.addEventListener("keyup"'],
    ['document.addEventListener("pointerdown", (event) => {','\nwindow.addEventListener("gamepadconnected"'],
  ]) {
    const from=source.indexOf(start),to=source.indexOf(end,from);
    assert.ok(from>=0&&to>from);
    runInNewContext(source.slice(from,to),context);
  }
  function send(type,overrides={}) {
    const event={pointerType:'mouse',button:0,target:new Element(),preventDefault(){calls.push('prevent');},...overrides};
    handlers[type](event);
  }
  return {send,calls,demoSession,demoSpeed,Element};
}

test('live demo listener pauses on left click and resumes on the next without exiting',()=>{
  const h=harness();h.send('pointerdown');assert.equal(h.demoSpeed.paused,true);
  h.send('pointerdown');assert.equal(h.demoSpeed.paused,false);
  assert.equal(h.demoSession.active,true);
  assert.deepEqual(h.calls,['audio','prevent','pause','presence','sync','audio','prevent','pause','presence','sync']);
});
test('demo controls, sound, share, right clicks and outside clicks do not toggle the fight',()=>{
  const h=harness();
  for(const overrides of [{sound:true},{share:true},{button:2},{target:new h.Element({control:true})},{target:new h.Element({frame:false})}])h.send('pointerdown',overrides);
  assert.equal(h.demoSpeed.paused,false);assert.equal(h.demoSession.active,true);
  assert.ok(!h.calls.includes('pause')&&!h.calls.includes('activity')&&!h.calls.includes('exit'));
});
test('demo Esc exits; ordinary and transport keys keep watching',()=>{
  const h=harness();h.send('keydown',{code:'KeyJ'});h.send('keydown',{code:'Space',transport:true});
  assert.equal(h.demoSession.active,true);h.send('keydown',{code:'Escape'});
  assert.equal(h.demoSession.active,false);assert.equal(h.calls.filter(x=>x==='exit').length,1);
  assert.equal(h.calls.filter(x=>x==='audio').length,3);
});
test('outside the demo a click preserves normal activity and never toggles demo pause',()=>{
  const h=harness();h.demoSession.active=false;h.send('pointerdown');
  assert.deepEqual(h.calls,['audio','activity']);assert.equal(h.demoSpeed.paused,false);
});
test('touch release still arms attract audio',()=>{
  const h=harness();h.send('pointerup',{pointerType:'touch'});assert.deepEqual(h.calls,['audio']);
});

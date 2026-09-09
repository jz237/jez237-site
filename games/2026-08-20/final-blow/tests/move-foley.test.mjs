import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { FOLEY_FIGHTERS, FOLEY_SHARED, moveFoleyLayers, MoveFoleyPlayer } from '../engine/move-foley.mjs';

test('every fighter and physical cue resolves to shipping audio, with distinct guard and kick impacts', () => {
  const cues=['light','heavy','light-kick-swing','roundhouse-swing','hit-light','hit-heavy','light-kick-impact','roundhouse-impact','block','throw','special','super','fatal','ko'];
  const used=new Set();
  for(const fighter of FOLEY_FIGHTERS)for(const cue of cues)for(let serial=0;serial<3;serial++){
    const layers=moveFoleyLayers(cue,fighter,{profileId:`${fighter}-${cue}`},serial);
    assert.ok(layers.length);
    for(const layer of layers){used.add(layer.id);assert.ok(existsSync(new URL(`../assets/audio/moves-v1/${layer.id}.mp3`,import.meta.url)));assert.ok(layer.rate>.7&&layer.rate<1.4);assert.ok(layer.gain>0&&layer.gain<1);}
  }
  assert.equal(new Set(FOLEY_FIGHTERS.map(id=>moveFoleyLayers('special',id)[0].id)).size,10);
  const families=['hit-light','hit-heavy','light-kick-impact','block'].map(cue=>moveFoleyLayers(cue,'jez')[0].id);
  assert.equal(new Set(families).size,4);
  for(const cue of ['hit-light','hit-heavy','block'])assert.notEqual(moveFoleyLayers(cue,'jez',null,0)[0].id,moveFoleyLayers(cue,'jez',null,1)[0].id);
  for(const id of [...FOLEY_SHARED,...FOLEY_FIGHTERS])assert.ok(existsSync(new URL(`../assets/audio/moves-v1/${id}.mp3`,import.meta.url)));
});

test('missing/locked audio never queues a late hit; overlapping voices are bounded and mute stops them', () => {
  const player=new MoveFoleyPlayer();let starts=0,stops=0;
  const node=()=>({connect(next){return next;},disconnect(){},gain:{value:1,cancelScheduledValues(){},setTargetAtTime(){}},pan:{value:0},playbackRate:{value:1},start(){starts++;},stop(){stops++;}});
  const ctx={state:'running',currentTime:0,createBufferSource:node,createGain:node,createStereoPanner:node};
  assert.equal(player.play(ctx,{},'hit-light','jez'),false);assert.equal(starts,0);
  player.buffers.set('jab-a',{});player.buffers.set('jab-b',{});
  assert.equal(player.play({...ctx,state:'suspended'},{},'hit-light','jez'),false);
  assert.equal(player.play(ctx,{},'hit-light','jez',{level:0}),false);
  for(let i=0;i<20;i++)assert.equal(player.play(ctx,{},'hit-light','jez',{x:0}),true);
  assert.equal(player.snapshot().active,8);assert.equal(stops,12);assert.equal(player.snapshot().last.pan,-.55);
  player.stop();assert.equal(player.snapshot().active,0);assert.equal(stops,20);
});

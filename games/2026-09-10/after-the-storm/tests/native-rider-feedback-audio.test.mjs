import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeRiderFeedbackAudio} from '../native-rider-feedback-audio.js';
import {prepareNativeAnnouncer,freshNativeAnnouncer} from '../native-announcer.js';
import {prepareNativeCueAudio} from '../native-cue-audio.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/native-rider-feedback-audio-reference.json',import.meta.url)));

test('740 original feedback executions preserve result gating, unsigned RNG and ordered calls',()=>{
 for(const c of reference.cases)assert.deepEqual(prepareNativeRiderFeedbackAudio(c.consumer,c.context),c.expected);
});

test('stunt commentary respects its mode and priority while the independent cue remains enabled',()=>{
 for(const raceMode of [0,1,2,3])for(const hold of [0,4,5,60]){
  const g={raceMode,courseIndex:1,audioMode:7,delay7cd8:0,resultFlag7dd0:0,random4562c:0xffffffff};
  const state={...freshNativeAnnouncer(),hold,priority:90},calls=prepareNativeRiderFeedbackAudio('c3548',g);
  const voice=prepareNativeAnnouncer(state,calls[0],g),cue=prepareNativeCueAudio(calls[1].arguments[0],8);
  assert.equal(voice.commands.length,raceMode===3&&hold===0?1:0);
  assert.equal(voice.state.delay,raceMode===3&&hold===4?4:0);
  assert.deepEqual(cue,[{consumer:'c53d4',arguments:[0x06000b00,9]}]);
  assert.deepEqual(state,{...freshNativeAnnouncer(),hold,priority:90});
 }
});

test('feedback requires explicit retained state and never alters its supplied audio random word',()=>{
 const g={resultFlag7dd0:0,random4562c:0x80000000},before={...g};
 prepareNativeRiderFeedbackAudio('c35b4',g);assert.deepEqual(g,before);
 assert.throws(()=>prepareNativeRiderFeedbackAudio('c354c',g),/Unknown/);
 for(const edit of [{random4562c:-1},{random4562c:0x100000000},{random4562c:1.5},{resultFlag7dd0:undefined},{resultFlag7dd0:0x80000000}])
  assert.throws(()=>prepareNativeRiderFeedbackAudio('c3548',{...g,...edit}),/Invalid/);
});

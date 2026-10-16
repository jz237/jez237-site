import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {OriginalMusic,originalMusicTrack,musicPosition,raceMusicFinalLap} from '../original-music.js';
const base=new URL('../assets/audio/waverace64/',import.meta.url),manifest=JSON.parse(readFileSync(new URL('manifest.json',base)));
class Param{setTargetAtTime(value){this.value=value;}}
class Node{constructor(){this.gain=new Param();this.stopped=false;this.connections=[];}connect(...args){this.connections.push(args);return args[0];}disconnect(){this.disconnected=true;}start(time,offset){this.startArgs=[time,offset];}stop(){this.stopped=true;}}
function fixture(loader){const ctx={currentTime:0,createGain:()=>new Node(),createBufferSource:()=>new Node(),createChannelSplitter:()=>new Node(),createChannelMerger:()=>new Node(),decodeAudioData:async()=>({duration:240})};const urls=[];const player=new OriginalMusic(ctx,new Node(),{loader:loader??(async url=>{urls.push(url.pathname);return url.pathname.endsWith('.json')?new TextEncoder().encode(JSON.stringify(manifest)):new ArrayBuffer(8);})});return {player,ctx,urls};}
test('original music assets are present, pinned and have valid loop boundaries for all courses and results',()=>{
 assert.equal(Object.keys(manifest.tracks).length,23);
 for(const [key,row] of Object.entries(manifest.tracks)){assert.match(row.file,/^track-[0-9a-f]{2}(?:-final)?\.mp3$/);const bytes=readFileSync(new URL(row.file,base));assert.ok(bytes.length>10000);assert.equal(createHash('sha256').update(bytes).digest('hex'),row.sha256);if(row.loopStart!==null){assert.ok(row.loopStart>=0&&row.loopStart<row.loopEnd);assert.ok(Math.abs(row.loopEnd-row.duration)<.001);assert.ok(musicPosition(row.loopEnd+1,row)<row.loopEnd);}}
 for(const [i,course] of ['practice','greyhaven','amber','citadel','reed','port','neon','tempest','glacier'].entries())assert.equal(originalMusicTrack({course}),(i+6).toString(16).padStart(2,'0'));
 assert.equal(originalMusicTrack({phase:'menu'}),'03');assert.equal(originalMusicTrack({phase:'results',place:2}),'10');assert.equal(originalMusicTrack({phase:'results',disqualified:true}),'13');
});
test('music downloads only when enabled, pauses at the audible position and resumes inside the source loop',async()=>{
 const {player,ctx,urls}=fixture(),context={course:'greyhaven'};player.update(context,false);assert.equal(urls.length,0);
 player.update(context,true);await player.loading;player.update(context,true);const first=player.voice;assert.deepEqual(first.source.startArgs,[0,0]);assert.equal(first.source.loopStart,manifest.tracks['07'].loopStart);
 ctx.currentTime=90;player.update(context,false);assert.equal(first.source.stopped,true);const position=musicPosition(90,manifest.tracks['07']);assert.equal(player.position,position);
 ctx.currentTime=120;player.update(context,true);assert.deepEqual(player.voice.source.startArgs,[120,position]);assert.equal(urls.length,2);player.dispose();assert.equal(player.cache.size,0);
});
test('mono downmixes both channels and headphones narrow the original stereo field',async()=>{
 const {player}=fixture();player.update({},true);await player.loading;player.update({},true,'mono');assert.deepEqual(player.voice.matrix.map(n=>n.gain.value),[.5,.5,.5,.5]);player.update({},true,'headphones');assert.deepEqual(player.voice.matrix.map(n=>n.gain.value),[.725,.275,.275,.725]);player.update({},true,'stereo');assert.deepEqual(player.voice.matrix.map(n=>n.gain.value),[1,0,0,1]);player.dispose();
});
test('late track loads cannot replace the current course and cache stays bounded',async()=>{
 let finishOld;const {player}=fixture(async url=>url.pathname.endsWith('.json')?new TextEncoder().encode(JSON.stringify(manifest)):url.pathname.endsWith('track-07.mp3')?new Promise(resolve=>{finishOld=resolve;}):new ArrayBuffer(8));
 player.update({course:'greyhaven'},true);await new Promise(resolve=>setImmediate(resolve));const old=player.loading;
 player.update({course:'amber'},true);await player.loading;player.update({course:'amber'},true);const current=player.voice;finishOld(new ArrayBuffer(8));await old;assert.equal(player.key,'08');assert.equal(player.voice,current);assert.equal(player.cache.has('07'),false);
 for(const course of ['practice','reed','neon']){player.update({course},true);await player.loading;player.update({course},true);assert.ok(player.cache.size<=2);}player.dispose();
});
test('failed music loads back off and do not create a source',async()=>{
 let calls=0;const {player,ctx}=fixture(async()=>{calls++;throw Error('offline');});player.update({},true);await player.loading;for(let i=0;i<50;i++)player.update({},true);assert.equal(calls,1);assert.equal(player.voice,undefined);assert.match(player.error,/offline/);ctx.currentTime=31;player.update({},true);await player.loading;assert.equal(calls,2);player.dispose();
});

test('a fresh race session restarts the cached course theme and completed one-shot results stay finished',async()=>{const {player,ctx}=fixture();player.update({session:1},true);await player.loading;player.update({session:1},true);ctx.currentTime=12;player.update({session:1},false);assert.equal(player.position,12);player.update({session:2},true);assert.equal(player.position,0);assert.deepEqual(player.voice.source.startArgs,[12,0]);const context={session:2,phase:'results',disqualified:true};player.update(context,true);await player.loading;player.update(context,true);assert.equal(player.voice.source.loop,false);player.voice.source.onended();player.update(context,true);assert.equal(player.voice,null);assert.equal(player.finished,true);player.dispose();});

test('final-lap selection follows either human in racing modes, excluding AI, Time Trial, stunts and Free Ride',()=>{
 const state={mode:'race',laps:3,racers:[{human:true,lap:2},{human:false,lap:3}]};
 assert.equal(raceMusicFinalLap(state),false);state.racers[0].lap=3;assert.equal(raceMusicFinalLap(state),true);
 for(const mode of ['time','stunt','practice'])assert.equal(raceMusicFinalLap({...state,mode}),false);
 assert.equal(raceMusicFinalLap({...state,freeRide:true}),false);
 assert.equal(raceMusicFinalLap({...state,laps:NaN}),false);
 const versus={mode:'versus',laps:5,racers:[{human:true,lap:2},{human:true,lap:5}]};assert.equal(raceMusicFinalLap(versus),true);
 versus.racers[1].dq='retired';assert.equal(raceMusicFinalLap(versus),false);
 for(const [i,course]of ['greyhaven','amber','citadel','reed','port','neon','tempest','glacier'].entries()){
  const key=originalMusicTrack({course,finalLap:true});assert.equal(key,(i+7).toString(16).padStart(2,'0')+'-final');
  assert.ok(manifest.tracks[key].loopStart>2); // introductory fanfare cannot repeat with the music loop
 }
 assert.equal(originalMusicTrack({course:'practice',finalLap:true}),'06');
 assert.equal(originalMusicTrack({phase:'menu',finalLap:true}),'03');
 assert.equal(originalMusicTrack({phase:'results',finalLap:true,place:1}),'0f');
});

test('enabled racing preloads one final-lap variant and switches once without downloading at the lap crossing',async()=>{
 const {player,ctx,urls}=fixture(),context={session:1,course:'greyhaven',mode:'versus',phase:'running'};
 player.update(context,false);assert.equal(urls.length,0);
 player.update(context,true);await player.loading;player.update(context,true);await player.loading;
 assert.deepEqual([...player.cache.keys()],['07','07-final']);assert.equal(urls.length,3);const normal=player.voice;
 ctx.currentTime=15;const final={...context,finalLap:true};player.update(final,true);
 assert.equal(normal.source.stopped,true);assert.equal(player.key,'07-final');assert.deepEqual(player.voice.source.startArgs,[15,0]);assert.equal(urls.length,3);
 const voice=player.voice;ctx.currentTime=17;player.update({...final,finalLap:false},true);assert.equal(player.voice,voice); // later DQ/snapshot cannot restart ordinary theme
 player.update({...final,phase:'paused'},false);assert.equal(player.position,2);
 ctx.currentTime=25;player.update(final,true);assert.deepEqual(player.voice.source.startArgs,[25,2]);
 player.update({...context,session:2},true);assert.equal(player.key,'07');assert.deepEqual(player.voice.source.startArgs,[25,0]);player.dispose();
});

test('a lap crossing reuses its in-flight prefetch, while restart and results discard stale loads',async()=>{
 let resolveFinal;const {player,urls}=fixture(async url=>{urls.push(url.pathname);return url.pathname.endsWith('.json')?new TextEncoder().encode(JSON.stringify(manifest)):url.pathname.endsWith('07-final.mp3')?new Promise(resolve=>{resolveFinal=resolve;}):new ArrayBuffer(8);});
 const context={session:1,course:'greyhaven',mode:'championship',phase:'running'};
 player.update(context,true);await player.loading;player.update(context,true);const pending=player.loading;
 player.update({...context,finalLap:true},true);assert.equal(player.loading,pending);resolveFinal(new ArrayBuffer(8));await pending;
 player.update({...context,finalLap:true},true);assert.equal(player.key,'07-final');assert.ok(player.voice);assert.equal(urls.filter(u=>u.endsWith('07-final.mp3')).length,1);
 player.update({...context,session:2,course:'amber'},true);await player.loading;player.update({...context,session:2,course:'amber'},true);await player.loading;
 assert.ok(player.cache.size<=2);player.dispose();
});

test('results cancel a pending final-lap prefetch and Time Trial never requests it',async()=>{
 let resolveFinal;const {player}=fixture(async url=>url.pathname.endsWith('.json')?new TextEncoder().encode(JSON.stringify(manifest)):url.pathname.endsWith('07-final.mp3')?new Promise(resolve=>{resolveFinal=resolve;}):new ArrayBuffer(8));
 const context={session:1,course:'greyhaven',mode:'race',phase:'running'};
 player.update(context,true);await player.loading;player.update(context,true);const pending=player.loading;
 const result={...context,phase:'results',place:1};player.update(result,true);await player.loading;player.update(result,true);const voice=player.voice;
 resolveFinal(new ArrayBuffer(8));await pending;assert.equal(player.voice,voice);assert.equal(player.key,'0f');assert.equal(player.cache.has('07-final'),false);player.dispose();
 const other=fixture();other.player.update({...context,mode:'time'},true);await other.player.loading;other.player.update({...context,mode:'time'},true);assert.equal(other.player.loading,null);assert.equal(other.urls.length,2);other.player.dispose();
});

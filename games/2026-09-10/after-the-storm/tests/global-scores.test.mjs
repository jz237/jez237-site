import test from 'node:test';
import assert from 'node:assert/strict';
import {globalBoard,globalBoardKey,encodeGlobalScore,decodeGlobalScore,parseGlobalScores,captureGlobalRun,completeGlobalRun,createGlobalScoresClient,createGlobalSubmission,formatGlobalScore,SCORES_BASE} from '../global-scores.js';

const board=(change={})=>globalBoard({mode:'time',course:'greyhaven',difficulty:0,laps:3,seaState:'course',...change});
const state=()=>({mode:'time',physics:'modern',course:{id:'greyhaven',layoutRevision:2},difficulty:0,laps:3,seaState:'surf',phase:'countdown',racers:[{finishTime:null,dq:'',stunt:{score:12500}}]});

test('world boards isolate course, rules, course revision and tuning',()=>{
 const base=board(),key=globalBoardKey(base);
 for(const change of [{mode:'race'},{mode:'championship'},{mode:'stunt'},{course:'port'},{difficulty:3},{laps:9},{seaState:'surf'},{tuning:'custom'},{layoutRevision:1}])assert.notEqual(globalBoardKey(board(change)),key);
 assert.equal(globalBoardKey(board({mode:'stunt',laps:9})),globalBoardKey(board({mode:'stunt',laps:3})));
 assert.ok(Object.isFrozen(base));
 for(const change of [{course:'../other-game'},{mode:'practice'},{course:'practice'},{difficulty:4},{laps:2},{seaState:'made-up'},{tuning:'fast'},{layoutRevision:1000}])assert.throws(()=>board(change));
});

test('time encoding ranks faster runs first without dropping milliseconds',()=>{
 const b=board();
 for(const seconds of [.001,59.999,60,123.456,86399.999])assert.equal(decodeGlobalScore(b,encodeGlobalScore(b,seconds)),seconds);
 assert.ok(encodeGlobalScore(b,59.999)>encodeGlobalScore(b,60));
 assert.equal(formatGlobalScore(b,59.999),'0:59.999');
 assert.equal(formatGlobalScore(b,123.456),'2:03.456');
 for(const bad of [NaN,Infinity,-1,0,86400,'42',.0001])assert.throws(()=>encodeGlobalScore(b,bad));
 for(const bad of [0,86400000,1.2,'123'])assert.equal(decodeGlobalScore(b,bad),null);
});

test('stunt points keep their actual score and reject invalid values',()=>{
 const b=board({mode:'stunt',course:'practice'});
 for(const n of [0,12500,100000000])assert.equal(decodeGlobalScore(b,encodeGlobalScore(b,n)),n);
 for(const n of [-1,1.5,Infinity,100000001])assert.throws(()=>encodeGlobalScore(b,n));
});

test('remote boards sanitize initials, skip malformed rows, sort and bound results',()=>{
 const b=board(),rows=Array.from({length:15},(_,i)=>({name:'abc',score:encodeGlobalScore(b,50+i)})).reverse();
 rows.push(null,{initials:'BAD',score:'100'},{initials:'BAD',score:0},{initials:'<X>',score:encodeGlobalScore(b,40)});
 const parsed=parseGlobalScores(b,{scores:rows});
 assert.equal(parsed.length,10);assert.equal(parsed[0].initials,'X');assert.equal(parsed[0].value,40);assert.equal(parsed[1].value,50);
 assert.deepEqual(parseGlobalScores(b,[]),[]);
 assert.throws(()=>parseGlobalScores(b,{error:'offline'}));
});

test('run captures its actual rules and tuning before options change',()=>{
 const s=state(),tune={engine:'0',handling:'0',grip:'.25'},context=captureGlobalRun(s,{tune});
 tune.grip=0;s.laps=9;s.seaState='calm';s.phase='results';s.racers[0].finishTime=123.456;
 const run=completeGlobalRun(context,s);
 assert.equal(run.board.laps,3);assert.equal(run.board.seaState,'surf');assert.equal(run.board.layoutRevision,2);assert.equal(run.board.tuning,'custom');
 assert.equal(run.value,123.456);assert.ok(Object.isFrozen(run));
 assert.equal(captureGlobalRun(state()).board.tuning,'standard');
});

test('demos, assisted runs, native previews, free rides and versus cannot post',()=>{
 for(const change of [{demoRun:true},{nativePreview:true},{physics:'native'},{freeRide:true},{mode:'versus'},{mode:'practice'}])assert.equal(captureGlobalRun({...state(),...change}),null);
 assert.equal(captureGlobalRun(state(),{assisted:true}),null);
});

test('only a completed, valid run becomes a global result',()=>{
 const s=state(),context=captureGlobalRun(s);
 assert.equal(completeGlobalRun(context,s),null);
 s.phase='results';assert.equal(completeGlobalRun(context,s),null);
 s.racers[0].finishTime=120;s.racers[0].dq='Missed five buoys';assert.equal(completeGlobalRun(context,s),null);
 s.racers[0].dq='';s.demoRun=true;assert.equal(completeGlobalRun(context,s),null);
 s.demoRun=false;assert.equal(completeGlobalRun(context,s).value,120);
 assert.equal(completeGlobalRun(null,s),null);
 const stunt={...state(),mode:'stunt'};const sc=captureGlobalRun(stunt);stunt.phase='results';stunt.racers[0].finishTime=80;
 assert.equal(completeGlobalRun(sc,stunt).value,12500);
});

test('client uses the existing shared service and checks HTTP failures',async()=>{
 const b=board(),calls=[];
 const client=createGlobalScoresClient({fetchFn:async(url,options)=>{calls.push({url,options});return new Response(JSON.stringify([{initials:'JET',score:encodeGlobalScore(b,123.456)}]));}});
 assert.equal((await client.load(b))[0].value,123.456);
 await client.post({board:b,value:123.456},'j!et');
 assert.equal(calls[0].url,SCORES_BASE+globalBoardKey(b));assert.equal(calls[0].options.credentials,'omit');
 assert.deepEqual(JSON.parse(calls[1].options.body),{initials:'JET',score:encodeGlobalScore(b,123.456)});
 const failing=createGlobalScoresClient({fetchFn:async()=>new Response('error',{status:503})});
 await assert.rejects(failing.load(b));await assert.rejects(failing.post({board:b,value:120},'JET'));
 const malformed=createGlobalScoresClient({fetchFn:async()=>new Response('{')});await assert.rejects(malformed.load(b));
});

test('a stalled score service times out and leaves a run retryable',async()=>{
 const client=createGlobalScoresClient({timeoutMs:10,fetchFn:(_url,{signal})=>new Promise((_resolve,reject)=>signal.addEventListener('abort',()=>reject(new Error('aborted')),{once:true}))});
 await assert.rejects(client.load(board()),/aborted/);
});

test('a stalled response body is covered by the deadline',async()=>{
 const client=createGlobalScoresClient({timeoutMs:10,fetchFn:async(_url,{signal})=>({ok:true,json:()=>new Promise((_resolve,reject)=>signal.addEventListener('abort',()=>reject(new Error('body timeout')),{once:true}))})});
 await assert.rejects(client.load(board()),/body timeout/);
});

test('double clicks and repeated submissions create only one successful post',async()=>{
 let calls=0,resolve;const run={board:board(),value:120};
 const submission=createGlobalSubmission(run,{post:()=>{calls++;return new Promise(r=>{resolve=r;});}});
 const first=submission.submit('JET'),second=submission.submit('JET');assert.equal(first,second);
 await Promise.resolve();assert.equal(calls,1);resolve();await first;
 assert.equal(submission.posted,true);await submission.submit('NEW');assert.equal(calls,1);
});

test('failed posting can be retried with the same completed result',async()=>{
 const run={board:board(),value:120};let calls=0;
 const submission=createGlobalSubmission(run,{post:async(received)=>{assert.equal(received,run);if(++calls===1)throw new Error('offline');}});
 await assert.rejects(submission.submit('JET'));assert.equal(submission.posted,false);
 await submission.submit('JET');assert.equal(submission.posted,true);assert.equal(calls,2);
});

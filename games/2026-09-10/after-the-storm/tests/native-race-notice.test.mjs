import test from 'node:test';
import assert from 'node:assert/strict';
import {nativeRaceNotice,nativeRaceDisplayWinner} from '../native-race-notice.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {captureWindowFrame,readWindowFrame,interpolateWindowFrame} from '../player-window-presentation.js';
import {encodeOnlinePacket,decodeOnlinePacket} from '../online-race-codec.js';
import {captureRaceWater} from '../race-water.js';

test('text notices use the actual20Hz source countdown and source wrong-direction flag',()=>{
 assert.equal(nativeRaceNotice({}), '');
 assert.equal(nativeRaceNotice({nativeBoundaryFrames:-1,nativeWrongWay:true}),'WRONG WAY · TURN BACK');
 assert.equal(nativeRaceNotice({nativeBoundaryFrames:139,nativeWrongWay:true}),'RETURN TO COURSE · 7');
 assert.equal(nativeRaceNotice({nativeBoundaryFrames:119}),'RETURN TO COURSE · 6');
 assert.equal(nativeRaceNotice({nativeBoundaryFrames:0}),'RETURN TO COURSE · 0');
});

test('online result labels preserve source finish priority, simultaneous ties and DQ outcomes',()=>{
 const a={player:0,finishTime:10,dq:''},b={player:1,finishTime:10,dq:''};
 assert.equal(nativeRaceDisplayWinner([a,b]),null);
 assert.equal(nativeRaceDisplayWinner([a,{...b,finishTime:11}]),a);
 assert.equal(nativeRaceDisplayWinner([{...a,finishTime:null,dq:'Retired'},b]),b);
 const retired={...a,finishTime:null,dq:'Retired'},unfinished={...b,finishTime:null};
 assert.equal(nativeRaceDisplayWinner([retired,unfinished]),unfinished);
 assert.equal(nativeRaceDisplayWinner([retired,{...unfinished,dq:'Retired'}]),null);
});

test('canonical warning views survive exact online transport and remain discrete under interpolation',async()=>{
 const options={mode:'versus',physics:'native',course:getCourse('greyhaven')},prepared=createRace(options).nativeLaunch.snapshot();
 const base=(0x2938-0x1f94)/4;
 prepared.raceWords1f94[base+222+185]=1;prepared.raceWords1f94[base+222+186]=121;prepared.raceWords1f94[base+222+202]=40;
 const s=createRace({...options,nativeInitialRaceState:prepared});
 assert.equal(s.racers[1].nativeBoundaryFrames,121);assert.equal(s.racers[1].nativeWrongWay,true);
 const raw=captureWindowFrame(s,{wake:[],impacts:[],craft:[],level:0,native:captureRaceWater(s.raceWater)});
 const wire=await decodeOnlinePacket(await encodeOnlinePacket(raw));assert.deepEqual(wire,raw);
 const f=readWindowFrame(wire);assert.equal(nativeRaceNotice(f.racers[1]),'RETURN TO COURSE · 7');
 const later=structuredClone(f);later.time=.05;later.racers[1].nativeBoundaryFrames=119;
 assert.equal(interpolateWindowFrame(f,later,.025).racers[1].nativeBoundaryFrames,121);
 assert.equal(interpolateWindowFrame(f,later,.05).racers[1].nativeBoundaryFrames,119);
 for(const invalid of [-2,65536,.5,NaN]){
  const bad=structuredClone(f);bad.racers[1].nativeBoundaryFrames=invalid;assert.equal(readWindowFrame(bad),null);
 }
 const bad=structuredClone(f);bad.racers[1].nativeWrongWay=1;assert.equal(readWindowFrame(bad),null);
});

import test from 'node:test';import assert from 'node:assert/strict';
import {onlineSpectatorEligible} from '../src/spectator-state';
test('survival elimination and race completion enable spectating, respawns retain player control',()=>{
 const living={health:80,finished:false},wreck={health:0,finished:false},finished={health:50,finished:true};
 assert.equal(onlineSpectatorEligible(true,'derby',false,wreck),true);
 assert.equal(onlineSpectatorEligible(true,'derby',true,wreck),false);
 assert.equal(onlineSpectatorEligible(true,'race',false,wreck),true);
 assert.equal(onlineSpectatorEligible(true,'race',false,finished),true);
 for(const player of [living,wreck,finished]){assert.equal(onlineSpectatorEligible(false,'race',false,player),false);assert.equal(onlineSpectatorEligible(true,'playground',false,player),false);}
 assert.equal(onlineSpectatorEligible(true,'race',false,living),false);assert.equal(onlineSpectatorEligible(true,'race',false,undefined),false);
 assert.equal(onlineSpectatorEligible(true,'derby',false,finished),false);
});

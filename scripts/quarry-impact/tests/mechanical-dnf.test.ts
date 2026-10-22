import test from 'node:test';
import assert from 'node:assert/strict';
import {DNF,deadReason,deadTime} from '../src/mechanical-dnf';
test('a car that cannot drive itself is dead: seized, out of fuel or no drive to any driven wheel; a limping car is not',()=>{
 const base={health:60,seized:false,fuelLevel:.4,driveBias:[1,1,1,1],wheelLost:[0,0,0,0],driven:[2,3]};
 assert.equal(deadReason(base),'');
 assert.equal(deadReason({...base,seized:true}),'ENGINE SEIZED');assert.equal(deadReason({...base,fuelLevel:0}),'OUT OF FUEL');
 assert.equal(deadReason({...base,driveBias:[1,1,0,0]}),'NO DRIVE');assert.equal(deadReason({...base,driveBias:[1,1,0,1]}),'','one driven wheel still pulls');
 assert.equal(deadReason({...base,driveBias:[1,1,0,1],wheelLost:[0,0,0,1]}),'NO DRIVE','its last driven wheel is gone');
 assert.equal(deadReason({...base,driven:[0,1,2,3],driveBias:[0,0,1,1]}),'','four-wheel drive limps on');
 assert.equal(deadReason({...base,health:0,seized:true}),'','already wrecked');
});
test('dead time counts while dead and resets once the car drives again',()=>{
 let t=0;for(let i=0;i<60*DNF.after;i++)t=deadTime(t,true,1/60);assert.ok(t>=DNF.after-1e-6);
 assert.equal(deadTime(t,false,1/60),0);assert.equal(deadTime(NaN,true,0),0);assert.equal(deadTime(2,true,0),0);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {VehicleThermalState} from '../src/vehicle-thermal-state';
const run=(prime:boolean,seed:number)=>{
 const s=new VehicleThermalState(70,seed);s.ignite();if(prime)s.primeFuelBlast();let at=-1;
 for(let t=0;t<25;t+=1/30){if(s.advance(70,1/30)&&at<0)at=t;if(prime&&t>1)s.primeFuelBlast();}
 return{at,exploded:s.exploded};
};
test('a burning car with a split fuel tank blows up 6–12 s into the burn, once; without the leak it just burns',()=>{
 for(const seed of [.1,.37,.62,.91]){
  const p=run(true,seed);assert.ok(p.exploded&&p.at>=6-1e-6&&p.at<=12.05,`seed ${seed}: blew at ${p.at.toFixed(2)} s`);
  const q=run(false,seed);assert.ok(!q.exploded&&q.at<0,'no leak, no blast at 70% health');
 }
 const s=new VehicleThermalState(70,.5);s.primeFuelBlast();for(let t=0;t<20;t+=1/30)s.advance(70,1/30);assert.ok(!s.exploded,'a leaking car that is not burning does not blow');
});

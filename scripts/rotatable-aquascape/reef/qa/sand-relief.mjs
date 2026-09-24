import assert from 'node:assert/strict';
import {sandHeight} from '../ReefOptics.ts';
let min=Infinity,max=-Infinity,maxSlope=0;
for(let ix=0;ix<=300;ix++)for(let iz=0;iz<=150;iz++){
 const x=-5.03+10.06*ix/300,z=-2.305+4.61*iz/150,h=sandHeight(x,z);
 min=Math.min(min,h);max=Math.max(max,h);
 assert.ok(h>.15&&h<.86,'bounded low dunes; fish and food use terrain-aware clearance');
 if(ix===0||ix===300||iz===0)assert.ok(Math.abs(h-.18)<1e-8,'rear and side perimeter stays sealed');
 if(iz===150)assert.ok(h>=.18&&h<.36,'low varying front berm closed by matching skirt');
 maxSlope=Math.max(maxSlope,Math.hypot((sandHeight(x+.001,z)-sandHeight(x-.001,z))/.002,(sandHeight(x,z+.001)-sandHeight(x,z-.001))/.002));
}
assert.ok(max-min>.48,'visible static banks');
assert.ok(maxSlope<1.05,'no abrupt bed steps or cliffs');
assert.ok(sandHeight(-3,0)>sandHeight(-.4,0)+.04,'channel remains below island banks');
console.log('Sand relief bounds and sealed perimeter:',{min,max,maxSlope});

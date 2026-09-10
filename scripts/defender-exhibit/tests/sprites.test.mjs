import {test} from 'node:test';import assert from 'node:assert/strict';
import {defenderSprites as sprites} from '../src/DefenderSprites.ts';
test('original packed sprite data decodes to native dimensions and nonempty pixels',()=>{
 const dimensions={PLD10:[16,6],PLD20:[16,6],PLAM0:[10,4],SBD10:[6,3],LND10:[10,8],SCZD10:[10,8],PRBD10:[8,8],ASTD10:[4,8],TIED10:[8,8],SWMD10:[6,4],UFOD10:[12,4]};
 for(const [name,[w,h]] of Object.entries(dimensions)){assert.equal(sprites[name].length,h,name);assert(sprites[name].every(row=>row.length===w),name+' width');assert(/[1-9a-f]/.test(sprites[name].join('')),name+' visible');}
 assert.equal(sprites.PLD10[0],'0066000000000000','first packed column is transposed into screen rows');
});

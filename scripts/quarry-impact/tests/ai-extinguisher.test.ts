import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {AI_EXTINGUISH,aiExtinguishAfter} from '../src/damage-handling';
test('AI drivers react to a fire within a fixed per-car window',()=>{
 const t=[0,1,2,3,7,11,23].map(aiExtinguishAfter);
 assert.ok(t.every(v=>v>=AI_EXTINGUISH.after&&v<AI_EXTINGUISH.after+AI_EXTINGUISH.spread));
 assert.equal(aiExtinguishAfter(5),aiExtinguishAfter(5),'fixed per car');
 assert.ok(new Set(t.map(v=>v.toFixed(3))).size>3,'not all the same');
});
test('AI cars use their own charges, never the human player\'s, offline only',()=>{
 const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
 assert.ok(main.includes('for(const c of cars){if(!c.extendedDamage||c.health<=0||c.id===0&&!demo)continue;'),'not the player (except in the demo)');
 assert.ok(main.includes('if(t>=aiExtinguishAfter(c.id)&&c.extinguish()){aiBurn.delete(c.id);aiFireOuts++;'));
 assert.ok(main.includes('mirrorsClipped=0;bumpStarts=0;aiBurn.clear();aiFireOuts=0;'),'reset each event');
});

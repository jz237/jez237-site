import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BLOOM,bloomWanted} from '../src/lamp-bloom';
test('lamps bloom at dusk and in the rain offline, not in daylight, online or on the medium tier',()=>{
  for(const q of ['high','ultra'])for(const l of ['dusk','rain'])assert.equal(bloomWanted(q,false,l),true,`${q} ${l}`);
  assert.equal(bloomWanted('high',false,'midday'),false,'sunlit pale paint would glow');assert.equal(bloomWanted('high',false,null),false);
  assert.equal(bloomWanted('medium',false,'dusk'),false,'its cost');assert.equal(bloomWanted('ultra',true,'dusk'),false,'online unchanged');
  assert.ok(BLOOM.threshold>2&&BLOOM.strength>0&&BLOOM.strength<1,'only light well above lit paint, softly');
});
test('main blooms the frame last, after the haze and the lens, before the output',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
  assert.ok(main.includes('composer.addPass(lensRainPass);\ncomposer.addPass(lampBloom);\ncomposer.addPass(new OutputPass());'));
  assert.ok(main.includes('new UnrealBloomPass(new T.Vector2(innerWidth, innerHeight), BLOOM.strength, BLOOM.radius, BLOOM.threshold)'));
  assert.ok(main.includes('  lampBloom.enabled = !bloomOff && bloomWanted(adaptiveGraphics.quality, !!online?.active, eventLighting);\n  composer.render();'));
});

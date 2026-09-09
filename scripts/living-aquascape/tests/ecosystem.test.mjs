import test from 'node:test';
import assert from 'node:assert/strict';
import {advance,defaults,initial,preset,scenarios,waterChange} from '../lib/aquarium/Ecosystem.ts';
test('scenario resets are reproducible and do not share mutable state',()=>{
 const a=preset(scenarios[4]),b=preset(scenarios[4]);advance(a.state,a.environment,24);assert.notDeepEqual(a.state,b.state);assert.deepEqual(b,preset(scenarios[4]));
});
test('carbon removal changes gases before long-term plant mass',()=>{
 const a=preset(scenarios[2]),before={...a.state};advance(a.state,a.environment,4);assert.ok(a.state.co2<before.co2*.75);assert.ok(Math.abs(a.state.biomass-before.biomass)<.05);
});
test('overfeeding raises ammonia relative to a balanced aquarium',()=>{
 const a=preset(scenarios[4]),b=preset(scenarios[0]);advance(a.state,a.environment,12);advance(b.state,b.environment,12);assert.ok(a.state.ammonia>b.state.ammonia);assert.ok(a.state.oxygen<b.state.oxygen);
});
test('water change exports dissolved waste without instant algae removal',()=>{
 const s=initial();s.nitrate=10;s.algae=.7;waterChange(s);assert.equal(s.nitrate,7);assert.equal(s.algae,.7);
});
test('all scenarios remain finite and physically bounded over 60 days',()=>{
 for(const name of scenarios){const {state,environment}=preset(name);advance(state,environment,1440);for(const [k,v]of Object.entries(state))assert.ok(Number.isFinite(v),name+': '+k);assert.ok(state.oxygen>0&&state.oxygen<=14);assert.ok(state.algae>=0&&state.algae<=1);assert.ok(state.nitrate>=0);}
});
test('one-minute integration is stable across time acceleration',()=>{
 const a=initial(),b=initial(),e=defaults();advance(a,e,24);for(let i=0;i<1440;i++)advance(b,e,1/60);for(const key of Object.keys(a))assert.ok(Math.abs(a[key]-b[key])<1e-7,key);
});

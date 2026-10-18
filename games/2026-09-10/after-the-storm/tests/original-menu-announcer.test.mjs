import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {originalMenuAnnouncerPlan} from '../original-menu-announcer.js';
import {freshNativeAnnouncer,prepareNativeAnnouncer} from '../native-announcer.js';
const reference=JSON.parse(readFileSync(new URL('./fixtures/menu-announcer-reference.json',import.meta.url)));
test('menu commands preserve signed low-byte IO1, ordered127 trigger and the independent priority slot',()=>{
 const state={...freshNativeAnnouncer(),hold:60,priority:127,delay:10},context={raceMode:0,courseIndex:1,audioMode:7,delay7cd8:0};
 for(const c of reference.calls){const result=prepareNativeAnnouncer(state,{consumer:'c377c',arguments:[c.input]},context);assert.deepEqual(result.commands,c.commands);assert.deepEqual(result.state,state);}
});
test('all30 menu plans match the original sequence and legato pan transitions',()=>{
 for(const c of reference.plans)assert.deepEqual(originalMenuAnnouncerPlan(c.selector),c.expected,String(c.selector));
 for(const c of reference.legato){assert.deepEqual(originalMenuAnnouncerPlan(c.selector).layers[0].pans,c.pans);assert.equal(c.events.filter(e=>e.kind==='allocate').length,1);}
 for(const i of [-1,30,127,1.5,NaN])assert.equal(originalMenuAnnouncerPlan(i),null);
});

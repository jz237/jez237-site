import { test } from 'node:test';
import assert from 'node:assert/strict';
import { treatmentGuideFor, openTreatmentPopup } from '../../experiments/fish-health-lab/treatments.mjs';
import { CONDITIONS } from '../../experiments/fish-health-lab/data.mjs';

test('treatment links use verified owner-guide sections for the three illustrated freshwater conditions', () => {
  for (const [id, hash] of [['ich-fresh','#v3226751'],['velvet-fresh','#v3226757'],['water-mold','#v3226818'],['columnaris','#v3226736']]) {
    const guide = treatmentGuideFor(id, 'fresh'), url = new URL(guide.url);
    assert.equal(url.hostname, 'www.merckvetmanual.com');
    assert.match(url.pathname, /all-other-pets\/fish/);
    assert.equal(url.hash, hash);
  }
});
test('freshwater treatments are unavailable in a marine or unselected flow, and vice versa', () => {
  for (const id of ['ich-fresh','velvet-fresh','water-mold','columnaris']) {
    assert.equal(treatmentGuideFor(id, 'marine'), null);
    assert.equal(treatmentGuideFor(id, ''), null);
  }
  assert.equal(treatmentGuideFor('ich-marine', 'fresh'), null);
  assert.match(treatmentGuideFor('ich-marine', 'marine').title, /marine ich/);
  assert.match(treatmentGuideFor('velvet-marine', 'marine').title, /marine velvet/);
});
test('symptoms get care reading, not a promised cure; normal markings get no medicine link', () => {
  for (const id of ['water','fin-damage','ulcer','dropsy','eye-change','buoyancy','gill-parasites','growth']) assert.equal(treatmentGuideFor(id, 'fresh').type, 'care');
  assert.equal(treatmentGuideFor('normal', 'fresh'), null);
  assert.equal(treatmentGuideFor('unknown-id', 'fresh'), null);
  for (const c of CONDITIONS) assert.doesNotMatch(JSON.stringify(c), /microscop|wet mount|biopsy|bacterial culture/i);
});
test('a direct click opens one detached popup to the static destination and preserves the source page', () => {
  let prevented = 0, opened = 0, destination = '';
  const popup = {opener:{},document:{createElement:()=>({click(){destination=this.href;assert.equal(this.rel,'noopener noreferrer');assert.equal(this.target,'_self');}}),head:{append(){}},body:{append(){}}}};
  const event = {button:0,preventDefault(){prevented++;}};
  const link = {dataset:{treatment:'ich-fresh',water:'fresh'}};
  assert.equal(openTreatmentPopup(event, link, (url,target,features)=>{opened++; assert.equal(url,'about:blank'); assert.equal(target,'_blank'); assert.match(features,/popup/); return popup;}), true);
  assert.equal(opened,1); assert.equal(prevented,1); assert.equal(popup.opener,null);
  assert.equal(destination,treatmentGuideFor('ich-fresh','fresh').url);
});
test('blocked popup and modified clicks retain the normal target-blank anchor fallback', () => {
  const link = {dataset:{treatment:'ich-fresh',water:'fresh'}};
  const event = {button:0,preventDefault(){throw Error('Native fallback must remain enabled');}};
  assert.equal(openTreatmentPopup(event,link,()=>null),false);
  assert.equal(openTreatmentPopup({...event,ctrlKey:true},link,()=>{throw Error('Must not open');}),false);
  assert.equal(openTreatmentPopup({...event,button:1},link,()=>{throw Error('Must not open');}),false);
});

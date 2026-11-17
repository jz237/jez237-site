import test from 'node:test';
import assert from 'node:assert/strict';
import {assessDiagnosis, buildCase} from '../../experiments/fish-health-lab/logic.mjs';
import {carePlanFor} from '../../experiments/fish-health-lab/treatments.mjs';
const inputFor = (fishType, primarySign, temperature, tempUnit='F') => ({water:'fresh',fishType,primarySign,signs:[primarySign],temperature,tempUnit});
const text = c => [...c.plan.steps,c.plan.treatment,c.tip||''].join(' ');

test('hot readings suppress heat steps in findings, look-alikes, swaps and saved notes', () => {
  for (const fish of ['', 'betta','goldfish','cory','pleco']) for (const sign of ['dots','dust']) {
    for (const [temperature,unit] of [['100','F'],['38','C']]) {
      const input=inputFor(fish,sign,temperature,unit), initial=assessDiagnosis(input);
      for (const chosen of [[], ...initial.alternatives.map(c=>[c.id])]) {
        const value={...input,chosen}, result=assessDiagnosis(value);
        for (const c of [...result.findings,...result.alternatives]) {
          if (!['ich-fresh','velvet-fresh'].includes(c.id)) continue;
          assert.doesNotMatch(text(c), /(?:^|[.!] )Raise the temperature|and raise the temperature|Gradual heat/i, `${fish} ${sign} ${unit} ${chosen} ${c.id}`);
          assert.doesNotMatch(c.plan.treatment, /\) \(/);
          if (['cory','pleco'].includes(fish) && c.id==='velvet-fresh') assert.match(text(c), /no copper|never copper/i);
        }
        assert.doesNotMatch(buildCase(value), /(?:^|[.!] )Raise the temperature|and raise the temperature|Gradual heat/i);
      }
    }
  }
});

test('existing heat targets are ceilings, not an instruction to heat further', () => {
  for (const [fish,sign,temp,unit] of [['betta','dots','80','F'],['betta','dots','27','C'],['goldfish','dots','75','F'],['goldfish','dust','24','C'],['betta','dust','86','F']]) {
    const result=assessDiagnosis(inputFor(fish,sign,temp,unit));
    assert.doesNotMatch(text(result.primary), /(?:^|[.!] )Raise the temperature|and raise the temperature|Gradual heat/i, `${fish} ${sign} ${temp}${unit}`);
    assert.match(text(result.primary), /Don’t raise the temperature further/);
  }
});

test('cooler readings, missing readings, columnaris and base plans retain their behavior', () => {
  for(const temperature of ['','72']) {
    const d=assessDiagnosis(inputFor('betta','dots',temperature));
    assert.match(text(d.primary), /Raise the temperature slowly/);
  }
  const d=assessDiagnosis({...inputFor('betta','dots','100'),visualSigns:['dots','patch']});
  assert.ok(d.findings.some(c=>c.id==='columnaris'));
  for(const c of [...d.findings,...d.alternatives]) if(['ich-fresh','velvet-fresh'].includes(c.id)) {
    assert.doesNotMatch(text(c), /raise the temperature/i);
    assert.match(c.plan.treatment, /no heat while columnaris is active/);
  }
  assert.match(carePlanFor('ich-fresh','fresh','betta').steps.join(' '), /Raise the temperature slowly/);
});

import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {rockPlacements,screePlacements} from '../../releases/jez237-quarry-impact/scripts/quarry-impact/src/quarry-layout';
const root='../releases/jez237-quarry-impact/scripts/quarry-impact/';const before=JSON.parse(fs.readFileSync('tests/fixtures/quarry-east-bay-baseline.json','utf8'));
assert.equal(createHash('sha256').update(fs.readFileSync(root+'src/quarry-layout.ts')).digest('hex'),before.workerInputs['src/quarry-layout.ts']);
const file='tests/fixtures/quarry-east-bay-scatter-placements.json';assert.equal(fs.existsSync(file),false);
const rocks=JSON.parse(fs.readFileSync(root+'src/quarry-rock-hulls.json','utf8')).map((_:any,variant:number)=>({variant,placements:rockPlacements(variant)}));
fs.writeFileSync(file,JSON.stringify({sourceSHA256:before.workerInputs['src/quarry-layout.ts'],rocks,scree:screePlacements()}));console.log(file);

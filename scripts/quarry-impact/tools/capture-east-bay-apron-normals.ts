import fs from 'node:fs';import assert from 'node:assert/strict';import * as T from 'three';
import {cliffGeometry} from '../src/quarry-layout';
import {restoreEastBayCliffs,eastBayBefore,eastBayBytesHash} from '../tests/quarry-east-bay-invariants';
const file='source/models/quarry-east-bay-apron-normals.json';assert.equal(fs.existsSync(file),false);
const g=restoreEastBayCliffs(cliffGeometry()),mesh=new T.BufferGeometry();mesh.setAttribute('position',new T.BufferAttribute(g.positions,3));mesh.setIndex(new T.BufferAttribute(g.indices,1));mesh.computeVertexNormals();const n=mesh.attributes.normal;
const bands=Array.from({length:30},(_,band)=>Array.from({length:31},(_,column)=>[0,1].map(end=>{const i=band*722+(25+column)*2+end;return [n.getX(i),n.getY(i),n.getZ(i)];})));
fs.writeFileSync(file,JSON.stringify({version:1,sourceLayoutSHA256:eastBayBefore.workerInputs['src/quarry-layout.ts'],baselineSHA256:eastBayBytesHash(fs.readFileSync('tests/fixtures/quarry-east-bay-baseline.json')),source:'Actual released cliff indices reconstructed and byte-verified, then original computeVertexNormals applied to unchanged position buffer; bands[band][column25to55][radialEnd0or1].',bands}));console.log(JSON.stringify({file,sha256:eastBayBytesHash(fs.readFileSync(file))}));mesh.dispose();

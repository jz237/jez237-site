import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {aquariumBuildHash,checkAquariumRelease} from '../../check_aquarium_release.mjs';
test('release receipt rejects missing checks, changed bundles and changed model textures',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'aquarium-gate-'));
 try{
  const base=path.join(root,'demos/rotatable-aquascape'),qa=path.join(root,'scripts/rotatable-aquascape/qa'),assets=path.join(root,'scripts/rotatable-aquascape/public');
  fs.mkdirSync(base,{recursive:true});fs.mkdirSync(qa,{recursive:true});fs.mkdirSync(assets,{recursive:true});fs.mkdirSync(path.join(base,'assets'));
  fs.writeFileSync(path.join(base,'build-manifest.json'),'["assets/index.js"]');fs.writeFileSync(path.join(base,'assets/index.js'),'tested code\n');fs.writeFileSync(path.join(assets,'fish.png'),'texture');fs.writeFileSync(path.join(base,'fish.png'),'texture');
  assert.throws(()=>checkAquariumRelease(root),/missing/);
  const receipt=()=>fs.writeFileSync(path.join(qa,'approved-build.json'),JSON.stringify({buildHash:aquariumBuildHash(root),checks:{behavior:true,browser:true,visual:true,performance:true,sync:true}}));
  receipt();assert.ok(checkAquariumRelease(root));fs.writeFileSync(path.join(base,'assets/index.js'),'changed');assert.throws(()=>checkAquariumRelease(root),/not passed/);
  receipt();fs.writeFileSync(path.join(base,'fish.png'),'missing stripes');assert.throws(()=>checkAquariumRelease(root),/not passed/);
 }finally{assert.ok(path.resolve(root).startsWith(path.resolve(os.tmpdir())+path.sep+'aquarium-gate-'));fs.rmSync(root,{recursive:true,force:true});}
});

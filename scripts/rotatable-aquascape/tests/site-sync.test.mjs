import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,dirname,sep} from 'node:path';
import {checkAquariumSync,aquariumCopies} from '../../check_aquarium_sync.mjs';

function fixture(run){
 const parent=resolve(tmpdir()),root=mkdtempSync(resolve(parent,'aquarium-sync-'));
 const put=(file,contents)=>{const path=resolve(root,file);mkdirSync(dirname(path),{recursive:true});writeFileSync(path,contents);};
 try{
  put('scripts/rotatable-aquascape/public/models/fish.bin',Buffer.from([1,2,3]));
  for(const [i,copy] of aquariumCopies.entries()){
   put(copy+'/index.html',`<title>Wrapper ${i}</title><script src="./assets/index-abc.js"></script><link href="./assets/index-abc.css">`);
   put(copy+'/assets/index-abc.js','same simulation');put(copy+'/assets/index-abc.css','same controls');
   put(copy+'/models/fish.bin',Buffer.from([1,2,3]));
  }
  run(root,put);
 }finally{
  if(!root.startsWith(parent+sep+'aquarium-sync-'))throw Error('Unsafe test cleanup path');
  rmSync(root,{recursive:true});
 }
}
test('site parity permits distinct wrappers and old rollback bundles while verifying current assets',()=>fixture((root,put)=>{
 put(aquariumCopies[1]+'/assets/index-old.js','old rollback bundle');
 assert.equal(checkAquariumSync(root),3);
}));
test('a stale site entry prevents publication',()=>fixture((root,put)=>{
 put(aquariumCopies[1]+'/index.html','<script src="./assets/index-old.js"></script><link href="./assets/index-abc.css">');
 assert.throws(()=>checkAquariumSync(root),/bundle mismatch/);
}));
test('same-named but changed model bytes prevent publication',()=>fixture((root,put)=>{
 put(aquariumCopies[2]+'/models/fish.bin',Buffer.from([1,2,4]));
 assert.throws(()=>checkAquariumSync(root),/asset mismatch/);
}));

import {restoreLargeFieldBytes} from './large-field-performance-invariants';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
import {readCollisionScarsPrevious,restoreCollisionScarsBytes,verifyCollisionScarsRevision} from './collision-scars-invariants';
const source=(file:string)=>restoreLargeFieldBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('light collision marks preserve all 807 historic fixtures and every out-of-scope source and asset',()=>{verifyCollisionScarsRevision();});
test('the collision release leaves calm cameras, AI, controls, scoring, courses and replay orchestration exact',()=>{
 const before=ts.createSourceFile('before.ts',readCollisionScarsPrevious('src/main.ts').toString(),ts.ScriptTarget.Latest,true);
 const after=ts.createSourceFile('after.ts',source('src/main.ts').toString(),ts.ScriptTarget.Latest,true);
 const functions=(file:ts.SourceFile)=>new Map(file.statements.filter(ts.isFunctionDeclaration).map(node=>[node.name!.text,node.getText(file)]));
 const previous=functions(before),current=functions(after);
 assert.deepEqual([...previous.keys()],[...current.keys()]);
 for(const [name,body]of previous)if(!['step','createCars'].includes(name))assert.equal(current.get(name),body,name);
});
test('collision bridge restores complete predecessors and rejects partial or corrupted matches',()=>{
 const manifest=JSON.parse(source('tests/fixtures/collision-scars/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCollisionScarsBytes(file,bytes),readCollisionScarsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCollisionScarsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCollisionScarsBytes('src/unknown.ts',unknown),unknown);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import ts from 'typescript';
import {readControllerPlayabilityPrevious,restoreControllerPlayabilityBytes,verifyControllerPlayabilityRevision} from './controller-playability-invariants';
import {restoreOpposingAIBytes,readOpposingAIPrevious} from './opposing-ai-invariants';
const hash=(bytes:Uint8Array|string)=>createHash('sha256').update(bytes).digest('hex');

test('controller playability adds one immutable leaf preserving all 730 fixtures, physics, assets and backend',verifyControllerPlayabilityRevision);

test('actual camera, AI, physics step, recovery and event construction declarations stay byte-exact',()=>{
 const main=readFileSync(new URL('../src/main.ts',import.meta.url)).toString();
 const before=readControllerPlayabilityPrevious('src/main.ts').toString();
 const manifest=JSON.parse(readFileSync(new URL('./fixtures/controller-playability/revision.json',import.meta.url)).toString());
 const names=['updateCamera','ai','step','recover','start','createCars'];
 assert.deepEqual(Object.keys(manifest.protectedMainFunctions).sort(),[...names].sort());
 const declarations=(text:string)=>{
  const source=ts.createSourceFile('main.ts',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
  return Object.fromEntries(names.map(name=>{
   const matches=source.statements.filter(node=>ts.isFunctionDeclaration(node)&&node.name?.text===name);
   assert.equal(matches.length,1,name);return [name,matches[0].getText(source)];
  }));
 };
 const current=declarations(main),original=declarations(before);
 for(const name of names){assert.equal(current[name],original[name],name);assert.equal(hash(current[name]),manifest.protectedMainFunctions[name],name);}
 assert.equal(main.replaceAll('\r\n','').includes('\n'),false,'Main keeps CRLF line endings');
});

test('the predecessor restoration bridge recognizes exact revisions without replacing unrelated bytes',()=>{
 const main=readFileSync(new URL('../src/main.ts',import.meta.url));
 assert.deepEqual(restoreControllerPlayabilityBytes('src/main.ts',main),readControllerPlayabilityPrevious('src/main.ts'));
 assert.deepEqual(restoreOpposingAIBytes('src/main.ts',main),readControllerPlayabilityPrevious('src/main.ts'));
 const driver=readFileSync(new URL('../src/driving-brain.ts',import.meta.url));
 assert.deepEqual(restoreOpposingAIBytes('src/driving-brain.ts',driver),readOpposingAIPrevious('src/driving-brain.ts'));
 const unrelated=Buffer.from('not a captured revision');
 assert.deepEqual(restoreControllerPlayabilityBytes('src/main.ts',unrelated),unrelated);
 assert.deepEqual(restoreOpposingAIBytes('src/main.ts',unrelated),unrelated);
});

test('controller audio activation leaves every mixing, clip, engine and impact member byte-exact',()=>{
 const source=readFileSync(new URL('../src/audio.ts',import.meta.url)).toString();
 const before=readControllerPlayabilityPrevious('src/audio.ts').toString();
 const manifest=JSON.parse(readFileSync(new URL('./fixtures/controller-playability/revision.json',import.meta.url)).toString());
 const members=(text:string)=>{
  const parsed=ts.createSourceFile('audio.ts',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
  const sound=parsed.statements.find(node=>ts.isClassDeclaration(node)&&node.name?.text==='Sound');
  assert.ok(sound&&ts.isClassDeclaration(sound));
  return Object.fromEntries(sound.members.filter(member=>!['init','unlock','pause','paused'].includes(member.name!.getText(parsed))).map(member=>[member.name!.getText(parsed),member.getText(parsed)]));
 };
 const current=members(source),original=members(before);assert.deepEqual(current,original);
 assert.deepEqual(Object.fromEntries(Object.entries(current).map(([name,text])=>[name,hash(text)])),manifest.protectedAudioMembers);
});

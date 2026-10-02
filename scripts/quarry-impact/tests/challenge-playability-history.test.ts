import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import ts from 'typescript';
import {readChallengePlayabilityPrevious,restoreChallengePlayabilityBytes,verifyChallengePlayabilityRevision} from './challenge-playability-invariants';
import {readControllerPlayabilityPrevious,restoreControllerPlayabilityBytes} from './controller-playability-invariants';
const hash=(bytes:Uint8Array|string)=>createHash('sha256').update(bytes).digest('hex');
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
const revision=()=>JSON.parse(readFileSync(new URL('./fixtures/challenge-playability/revision.json',import.meta.url)).toString());
function declarations(text:string,filename:string,names:readonly string[]):Record<string,string>{
 const parsed=ts.createSourceFile(filename,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
 return Object.fromEntries(names.map(name=>{
  const found:string[]=[];
  for(const statement of parsed.statements){
   if(ts.isFunctionDeclaration(statement)&&statement.name?.text===name)found.push(statement.getText(parsed));
   if(ts.isVariableStatement(statement))for(const declaration of statement.declarationList.declarations)
    if(ts.isIdentifier(declaration.name)&&declaration.name.text===name)found.push(statement.getText(parsed));
  }
  assert.equal(found.length,1,filename+':'+name);return[name,found[0]];
 }));
}
test('challenge content adds one immutable leaf preserving all 744 previous fixtures and protected source/assets',verifyChallengePlayabilityRevision);

test('actual camera, physics, AI, event, award, replay, timing and controller declarations stay exact',()=>{
 const names=['updateCamera','ai','step','recover','start','createCars','beginReplay','bankRun','hud','frame','controllerContext','controllerKey','pollController','input','pause','resume','openStudio','closeStudio','captureReplay'];
 const current=source('src/main.ts').toString(),before=readChallengePlayabilityPrevious('src/main.ts').toString(),manifest=revision();
 assert.deepEqual(Object.keys(manifest.protectedMainFunctions).sort(),[...names].sort());
 const actual=declarations(current,'main.ts',names),expected=declarations(before,'main.ts',names);
 for(const name of names){assert.equal(actual[name],expected[name],name);assert.equal(hash(actual[name]),manifest.protectedMainFunctions[name],name);}
 assert.equal(current.replaceAll('\r\n','').includes('\n'),false,'Main retains CRLF');
});

test('current scoring helpers remain published source, independent of new catalogue/venue content',()=>{
 const names=['challengeValue','challengeMedal','lowerIsBetter','formatChallengeValue'],manifest=revision();
 assert.deepEqual(Object.keys(manifest.protectedChallengeFunctions).sort(),[...names].sort());
 const actual=declarations(source('src/challenges.ts').toString(),'challenges.ts',names);
 const expected=declarations(readChallengePlayabilityPrevious('src/challenges.ts').toString(),'challenges.ts',names);
 for(const name of names){assert.equal(actual[name],expected[name],name);assert.equal(hash(actual[name]),manifest.protectedChallengeFunctions[name],name);}
 assert.equal(manifest.originalCatalogueSha256,'027c250b727dac72ea1fe7e99d6af35ab2b166f9b76bffecc824b7c3fe0e3d86');
});

test('the new restore bridge recognizes exact source and never substitutes unrelated or damaged bytes',()=>{
 for(const file of Object.keys(revision().files))assert.deepEqual(restoreChallengePlayabilityBytes(file,source(file)),readChallengePlayabilityPrevious(file),file);
 const main=source('src/main.ts');
 assert.deepEqual(restoreControllerPlayabilityBytes('src/main.ts',main),readControllerPlayabilityPrevious('src/main.ts'),'Restore the challenge then controller changes');
 assert.deepEqual(restoreControllerPlayabilityBytes('src/challenges.ts',source('src/challenges.ts')),readChallengePlayabilityPrevious('src/challenges.ts'),'Controller had no catalogue change');
 const unknown=Buffer.from('unrecorded revision'),damaged=Buffer.from(main);damaged[0]^=1;
 for(const bytes of [unknown,damaged]){
  assert.deepEqual(restoreChallengePlayabilityBytes('src/main.ts',bytes),bytes);
  assert.deepEqual(restoreControllerPlayabilityBytes('src/main.ts',bytes),bytes);
 }
 assert.deepEqual(restoreChallengePlayabilityBytes('src/not-in-this-leaf.ts',unknown),unknown);
});

test('all main source outside seven reviewed routing, label and category-return replacements remains exact',()=>{
 let current=source('src/main.ts').toString();
 const replacements=[
 [
  "import { CHALLENGES, challengeValue, formatChallengeValue, challengeVenueName, type Challenge, type Discipline } from './challenges';",
  "import { CHALLENGES, challengeValue, formatChallengeValue, type Challenge } from './challenges';"
 ],
 [
  "function openProfile(initialDiscipline:Discipline='racing'){",
  "function openProfile(){"
 ],
 [
  "},profileStorageWarning,initialDiscipline);",
  "},profileStorageWarning);"
 ],
 [
  "const preferredCourse=():CourseId=>clubRound()?.course??(mode==='race'&&!online?.active&&raceFormat()==='laps'?resolveCourseId(activeChallenge?activeChallenge.course:demo?demoOptions.course:eventOptions.course):'quarry-v1');",
  "const preferredCourse=():CourseId=>clubRound()?.course??(mode==='race'&&!activeChallenge&&!online?.active&&raceFormat()==='laps'?resolveCourseId(demo?demoOptions.course:eventOptions.course):'quarry-v1');"
 ],
 [
  "profileButton.onclick=()=>openProfile();",
  "profileButton.onclick=openProfile;"
 ],
 [
  "${challengeVenueName(activeChallenge)} / ${activeChallenge.title.toUpperCase()} / CHALLENGE",
  "${activeChallenge.title.toUpperCase()} / CHALLENGE"
 ],
 [
  "ui.querySelector<HTMLButtonElement>('#challenge-board')!.onclick=()=>{const discipline=activeChallenge!.discipline;createCars(true);menu();openProfile(discipline);};",
  "ui.querySelector<HTMLButtonElement>('#challenge-board')!.onclick=()=>{createCars(true);menu();openProfile();};"
 ]
];
 for(const [after,before]of replacements){assert.equal(current.split(after).length-1,1,after);current=current.replace(after,before);}
 assert.equal(current,readChallengePlayabilityPrevious('src/main.ts').toString(),'Unrelated main code, comments and top-level statements remain exact');
 assert.equal(hash(current),revision().normalizedMainSha256);
 const names=['openProfile','menu'],actual=declarations(current,'main.ts',names),expected=declarations(readChallengePlayabilityPrevious('src/main.ts').toString(),'main.ts',names),manifest=revision();
 assert.deepEqual(Object.keys(manifest.protectedProfileNavigation).sort(),[...names].sort());
 for(const name of names){assert.equal(actual[name],expected[name],name);assert.equal(hash(actual[name]),manifest.protectedProfileNavigation[name],name);}
});

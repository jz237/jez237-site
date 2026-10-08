import test from 'node:test';import assert from 'node:assert/strict';
import {DAMAGE_RULES,readDamageRule,sessionDamageRule,collisionDamageMultiplier,damageRecordKey} from '../src/damage-rules';
import {readEventOptions} from '../src/event-rules';import {readDemoOptions} from '../src/demo-session';
import {readFileSync} from 'node:fs';import {runInNewContext} from 'node:vm';import ts from 'typescript';
test('damage preferences round-trip independently, reject inherited keys and keep legacy settings standard',()=>{
 for(const damage of Object.keys(DAMAGE_RULES)){
  const text=JSON.stringify({version:1,damage});assert.equal(readEventOptions(text).damage,damage);assert.equal(readDemoOptions(text).damage,damage);
 }
 for(const damage of [null,'constructor','__proto__',{},true,1]){const text=JSON.stringify({version:1,damage});assert.equal(readEventOptions(text).damage,undefined);assert.equal(readDemoOptions(text).damage,undefined);assert.equal(readDamageRule(damage),'normal');}
 assert.equal(readEventOptions().damage,undefined);assert.equal(readDemoOptions().damage,undefined);
});
test('actual main selector uses demo setting, excludes fixed events and keeps legacy collision balance',()=>{
 const source=ts.createSourceFile('main.ts',readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),ts.ScriptTarget.ES2022,true);
 const names=['customEvent','damageRule'],decls:string[]=[];
 for(const s of source.statements)if(ts.isVariableStatement(s))for(const d of s.declarationList.declarations)if(ts.isIdentifier(d.name)&&names.includes(d.name.text))decls.push(`const ${d.getText(source)};`);
 const code=ts.transpileModule(decls.join('\n')+';globalThis.read=damageRule;',{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText;
 const context:any={sessionDamageRule,activeClubRound:null,activeChallenge:null,activeTimeTrial:null,online:null,mode:'race',demo:false,eventOptions:{damage:'severe'},demoOptions:{damage:'reduced'}};runInNewContext(code,context);
 assert.equal(context.read(),'severe');context.mode='derby';assert.equal(context.read(),'severe');
 for(const prop of ['activeClubRound','activeChallenge','activeTimeTrial','online','mode']){
  const previous=context[prop];context[prop]=prop==='online'?{active:true}:prop==='mode'?'playground':prop==='activeClubRound'?0:{};assert.equal(context.read(),'normal',prop);context[prop]=previous;
 }
 context.demo=true;assert.equal(context.read(),'reduced');assert.equal(collisionDamageMultiplier(true,'normal'),.45);assert.equal(collisionDamageMultiplier(false,'normal'),1);
});
test('results at different damage settings cannot overwrite each other or legacy records',()=>{
 for(const category of ['race:quarry-v1:forward:3:8','score-derby:60:8','timed-race:60:8','derby']){
  assert.equal(damageRecordKey(category,'normal'),category);assert.equal(new Set(Object.keys(DAMAGE_RULES).map(rule=>damageRecordKey(category,rule as keyof typeof DAMAGE_RULES))).size,3);
 }
});

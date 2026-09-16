import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

// Read the stable source names, not identifiers that change on each minify.
const source=readFileSync(new URL('../../../prototypes/hidden-reef/assets/animated-header/header.ts',import.meta.url),'utf8');
const apply=source.match(/function sync\(\)\s*\{[^}]+\}/)[0]+';sync();';
test('showroom header stays still after visibility updates; other page headers retain animation',()=>{
 for(const search of ['', '?still=1'])for(const visible of [false,true])for(const reduced of [false,true]){
  const context={engine:{paused:false},reduced:{matches:reduced},visible,location:{search},URLSearchParams,stage:{classList:{toggle(){}}}};
  vm.runInNewContext(apply,context);
  assert.equal(context.engine.paused,!!search||!visible||reduced);
  context.visible=true;vm.runInNewContext('sync()',context);assert.equal(context.engine.paused,!!search||reduced);
 }
});

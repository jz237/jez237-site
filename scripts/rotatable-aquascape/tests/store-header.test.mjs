import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../../../prototypes/hidden-reef/assets/animated-header/header.js',import.meta.url),'utf8');
const apply=source.match(/function A\(\)\{[^}]+\}/)[0]+';A();';
test('showroom header stays still after visibility updates; other page headers retain animation',()=>{
 for(const search of ['', '?still=1'])for(const visible of [false,true])for(const reduced of [false,true]){
  const context={H:{paused:false},U:{matches:reduced},z:visible,location:{search},URLSearchParams,k:{classList:{toggle(){}}}};
  vm.runInNewContext(apply,context);
  assert.equal(context.H.paused,!!search||!visible||reduced);
  context.z=true;vm.runInNewContext('A()',context);assert.equal(context.H.paused,!!search||reduced);
 }
});

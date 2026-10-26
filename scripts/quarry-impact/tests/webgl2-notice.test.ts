import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {hasWebGL2,webgl2NoticeHtml} from '../src/webgl2-notice';
test('WebGL 2 is found on a fresh canvas, whose context is let go again; none, or a refusal, is no WebGL 2',()=>{
  let asked='',lost=false;
  assert.equal(hasWebGL2(()=>({getContext:(id:string)=>{asked=id;return {getExtension:(n:string)=>n==='WEBGL_lose_context'?{loseContext:()=>{lost=true;}}:null};}})),true);
  assert.equal(asked,'webgl2');assert.ok(lost,'the probe context is released');
  assert.equal(hasWebGL2(()=>({getContext:()=>null})),false,'no context');
  assert.equal(hasWebGL2(()=>({getContext:()=>{throw new Error('blocked');}})),false,'refused');
  assert.equal(hasWebGL2(()=>{throw new Error('no canvas');}),false);
});
test('the notice says what is missing and what to try, with a way to try again',()=>{
  const html=webgl2NoticeHtml();
  for(const text of ['This game needs WebGL 2','Hardware acceleration is off','Use graphics acceleration when available','Firefox','Safari (15 or later)','remote desktop or virtual machine','TRY AGAIN','role="alert"','data-webgl2-retry'])assert.ok(html.includes(text),text);
});
test('main checks before it makes the renderer, and stops there with the notice up',()=>{
  const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),guard="if(!hasWebGL2()){showWebGL2Notice(ui);throw new Error('Quarry Impact needs WebGL 2');}";
  assert.ok(main.includes(guard));assert.ok(main.indexOf(guard)<main.indexOf('const renderer = new T.WebGLRenderer({'),'before the renderer');
});

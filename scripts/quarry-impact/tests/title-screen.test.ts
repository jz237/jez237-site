import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),css=readFileSync(new URL('../src/style.css',import.meta.url),'utf8');
const menu=main.slice(main.indexOf('function menu() {'),main.indexOf('function leaveOnline()'));
test('the title screen steps through the cars and keeps the full roster behind ALL CARS',()=>{
  assert.ok(menu.includes('<button id="car-prev" class="car-step" aria-label="Previous car">‹</button>')&&menu.includes('<button id="car-next" class="car-step" aria-label="Next car">›</button>'));
  assert.ok(menu.includes('<div class="car-picker" id="car-list" hidden>'),'the roster starts closed');assert.ok(menu.includes('data-car="${k}"'),'controller navigation keeps its data-car identity');
  assert.ok(menu.includes("kind=roster[(roster.indexOf(kind)+by+roster.length)%roster.length]"),'wraps round both ends');
});
test('every menu route sits in the hub grid, and the class line under the car',()=>{
  assert.equal((menu.match(/ui\.querySelector\('\.intro'\)!\.append\(/g)??[]).length,0);
  for(const v of ['garageButton','profileButton','dailyButton','trialButton','cupButton','venueButton','eventButton','watch','careerButton','demoSetup'])assert.ok(menu.includes(`hub.append(${v})`),v);
  assert.ok(menu.includes("ui.querySelector('.car-name')!.append(classInfo);"));
});
test('the mode cards and START stay on screen: the upper column scrolls on its own instead of pushing them off',()=>{
  assert.ok(css.includes('.menu .intro{flex:1 1 auto;min-height:0;overflow-y:auto;'));assert.ok(css.includes('.menu-bottom{flex:none;'));
  assert.ok(css.includes('.menu .intro h1{font-size:clamp(46px,min(8.7vw,12.5vh),155px)}'),'the title shrinks with the window height');
  assert.ok(css.includes('@media (max-height:500px){'),'a phone held sideways gets the compact layout');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {damageDiagramSvg,type DiagramState} from '../src/damage-diagram';
const base:DiagramState={zones:{front:0,rear:0,left:0,right:0,roof:0},structure:[0,0,0,0,0],wheelDamage:[0,0,0,0],wheelLost:[0,0,0,0],tyreFailure:[0,0,0,0],engine:0,misfiring:false,rearEngine:false,wrecked:false};
test('wings, the boot lid and the doors appear on the diagram only once they hang loose or have gone',()=>{
 const intact=damageDiagramSvg({...base,parts:{boot:'ok',doorLeft:'ok',doorRight:'ok'}});
 assert.ok(!/dd-boot|dd-door|dd-wing/.test(intact),'intact parts are not drawn');
 const svg=damageDiagramSvg({...base,parts:{wingLeft:'gone',boot:'loose',doorRight:'gone',doorRearLeft:'loose'}});
 assert.match(svg,/class="dd-wing dd-wing-left dd-gone"[^>]*stroke-dasharray/);
 assert.match(svg,/class="dd-boot dd-loose"/);assert.match(svg,/class="dd-door dd-door-right dd-gone"/);assert.match(svg,/class="dd-door dd-door-rear-left dd-loose"/);
 assert.ok(!svg.includes('dd-wing-right')&&!svg.includes('dd-door-left"'),'parts not given are not drawn');
 assert.equal(damageDiagramSvg(base),damageDiagramSvg({...base,parts:{}}),'no parts, no change');
});
test('the boot sits on the rear deck and each door on its own side',()=>{
 const svg=damageDiagramSvg({...base,parts:{boot:'gone',doorLeft:'gone',doorRight:'gone'}});
 const at=(cls:string)=>{const m=new RegExp(`<rect x="([0-9.]+)" y="([0-9.]+)"[^>]*class="${cls}`).exec(svg);return m?[+m[1],+m[2]]:null;};
 assert.ok(at('dd-boot')![1]>80);assert.ok(at('dd-door dd-door-left')![0]<20);assert.ok(at('dd-door dd-door-right')![0]>38);
});

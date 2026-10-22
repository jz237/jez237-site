import test from 'node:test';
import assert from 'node:assert/strict';
import {damageDiagramSvg,DIAGRAM_COLORS,type DiagramState} from '../src/damage-diagram';
const base:DiagramState={zones:{front:0,rear:0,left:0,right:0,roof:0},structure:[0,0,0,0,0],wheelDamage:[0,0,0,0],wheelLost:[0,0,0,0],tyreFailure:[0,0,0,0],engine:0,misfiring:false,rearEngine:false,wrecked:false};
const svg=(faults:DiagramState['faults'],extra:Partial<DiagramState>={})=>damageDiagramSvg({...base,...extra,faults});
test('nothing new is drawn on a sound car or for callers that do not pass the new faults',()=>{
 const s=svg({rollBar:[1,1],propshaft:null,bearings:[0,0,0,0],belt:null,battery:1,steerSkew:0});
 for(const c of ['dd-rollbar','dd-prop','dd-bearing','dd-belt','dd-battery','dd-short-lock'])assert.ok(!s.includes(c),c);
 assert.ok(!svg({}).includes('dd-rollbar'));
});
test('a snapped roll bar breaks across its own axle',()=>{
 const front=svg({rollBar:[0,1]}),rear=svg({rollBar:[1,0]});
 assert.ok(/class="dd-rollbar" d="M12 25 /.test(front));assert.ok(/class="dd-rollbar" d="M12 83 /.test(rear));
});
test('the propshaft is kinked when bent and broken when snapped',()=>{
 assert.ok(svg({propshaft:'bent'}).includes('dd-prop-bent'));assert.ok(svg({propshaft:'snapped'}).includes(`dd-prop-snapped" d="M30 26 L30 51 M31.5 59 L30 82" stroke="${DIAGRAM_COLORS[3]}`));
});
test('a growling bearing rings its wheel in amber, a seized one in red; lost wheels get no ring',()=>{
 const s=svg({bearings:[.5,0,1,0]});
 assert.equal((s.match(/class="dd-bearing/g)??[]).length,2);assert.ok(s.includes(`class="dd-bearing" x="3.4" y="15.4"`));assert.ok(/dd-bearing-seized[^>]*stroke="#d8412f"/.test(s));
 assert.ok(!svg({bearings:[1,0,0,0]},{wheelLost:[1,0,0,0]}).includes('dd-bearing'));
});
test('the belt shows slipping or snapped, and a snapped belt shows the battery running down',()=>{
 assert.ok(svg({belt:'slipping'}).includes('dd-belt-slipping'));assert.ok(!svg({belt:'slipping'}).includes('dd-battery'));
 assert.ok(svg({belt:'snapped',battery:.8}).includes(`class="dd-battery" x="38" y="12" width="5" height="3.4" rx=".5" fill="${DIAGRAM_COLORS[1]}`));
 assert.ok(svg({belt:'snapped',battery:0}).includes(`fill="${DIAGRAM_COLORS[3]}" stroke="#101410" stroke-width=".4"`));
 assert.ok(/class="dd-belt dd-belt-snapped" cx="30" cy="96.5"/.test(svg({belt:'snapped'},{rearEngine:true})),'a rear engine has its belt at the back');
});
test('a short lock marks the side that will not turn fully',()=>{
 assert.ok(svg({steerSkew:-.4}).includes('class="dd-short-lock" x1="12.5"'));assert.ok(svg({steerSkew:.4}).includes('class="dd-short-lock" x1="47.5"'));
 assert.ok(!svg({steerSkew:.1}).includes('dd-short-lock'));
});

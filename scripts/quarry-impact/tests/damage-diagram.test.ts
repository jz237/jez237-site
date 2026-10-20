import test from 'node:test';
import assert from 'node:assert/strict';
import {damageDiagramSvg,severityColor,DIAGRAM_COLORS,type DiagramState} from '../src/damage-diagram';
const base:DiagramState={zones:{front:0,rear:0,left:0,right:0,roof:0},structure:[0,0,0,0,0],wheelDamage:[0,0,0,0],wheelLost:[0,0,0,0],tyreFailure:[0,0,0,0],engine:0,misfiring:false,rearEngine:false,wrecked:false};
const fill=(svg:string,cls:string)=>new RegExp(`class="${cls}[^"]*"[^>]*fill="([^"]+)"`).exec(svg)?.[1];
test('the damage diagram colours each zone, wheel and the engine by severity',()=>{
 assert.equal(severityColor(0),DIAGRAM_COLORS[0]);assert.equal(severityColor(.3),DIAGRAM_COLORS[1]);assert.equal(severityColor(.6),DIAGRAM_COLORS[2]);assert.equal(severityColor(1),DIAGRAM_COLORS[3]);
 const intact=damageDiagramSvg(base);for(const c of ['dd-front','dd-rear','dd-left','dd-right','dd-roof','dd-engine'])assert.equal(fill(intact,c),DIAGRAM_COLORS[0],c);
 const hit=damageDiagramSvg({...base,zones:{...base.zones,front:40},structure:[0,0,0,.6,0],engine:.8,misfiring:true});
 assert.equal(fill(hit,'dd-front'),DIAGRAM_COLORS[3]);assert.equal(fill(hit,'dd-right'),DIAGRAM_COLORS[3]);assert.equal(fill(hit,'dd-rear'),DIAGRAM_COLORS[0]);
 assert.equal(fill(hit,'dd-engine'),DIAGRAM_COLORS[3]);assert.ok(hit.includes('dd-misfire'));
});
test('torn-off wheels show as dashed outlines and flats as dark tyres; rear engines sit at the back',()=>{
 const svg=damageDiagramSvg({...base,wheelLost:[1,0,0,0],tyreFailure:[0,1,0,0],wheelDamage:[0,0,.6,0],rearEngine:true});
 assert.equal((svg.match(/dd-lost/g)??[]).length,1);assert.equal((svg.match(/dd-flat/g)??[]).length,1);assert.ok(svg.includes('stroke-dasharray'));
 assert.ok(/class="dd-engine"[^>]*cy="90"/.test(svg));
 const wrecked=damageDiagramSvg({...base,wrecked:true});assert.equal(fill(wrecked,'dd-roof'),DIAGRAM_COLORS[3]);
});
test('bumpers and the bonnet show as intact, loose or gone',()=>{
 const svg=damageDiagramSvg({...base,parts:{frontBumper:'loose',rearBumper:'gone',hood:'gone'}});
 assert.ok(/class="dd-bumper-front dd-loose"/.test(svg));assert.ok(/class="dd-bumper-rear dd-gone"[^>]*stroke-dasharray/.test(svg));assert.ok(/class="dd-hood dd-gone"/.test(svg));
 const intact=damageDiagramSvg({...base,parts:{frontBumper:'ok',hood:'ok'}});assert.ok(/class="dd-bumper-front"/.test(intact));assert.ok(!intact.includes('dd-hood'),'an intact bonnet is just the front zone');assert.ok(!intact.includes('dd-bumper-rear'),'unknown parts are not drawn');
 assert.ok(!damageDiagramSvg(base).includes('dd-bumper'),'old callers without parts draw none');
});

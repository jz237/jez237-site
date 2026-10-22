import test from 'node:test';
import assert from 'node:assert/strict';
import {damageDiagramSvg} from '../src/damage-diagram';
const base={zones:{front:0,rear:0,left:0,right:0,roof:0},wheelDamage:[0,0,0,0],wheelLost:[0,0,0,0],tyreFailure:[0,0,0,0],engine:0,misfiring:false,rearEngine:false,wrecked:false};
test('the damage diagram draws the mechanical faults over the car, and nothing when there are none',()=>{
 const clean=damageDiagramSvg({...base,faults:{hotDiscs:[0,0,0,0],steerLink:[1,1,1,1],looseWheels:[0,0,0,0],diff:null,exhaustGone:false,seized:false}});
 assert.ok(!/dd-hot|dd-tierod|dd-loose-wheel|dd-diff|dd-exhaust-gone|dd-seized/.test(clean),'a sound car shows none');
 const svg=damageDiagramSvg({...base,faults:{hotDiscs:[0,0,0,.8],steerLink:[1,0,1,1],looseWheels:[.5,0,0,0],diff:'rear',exhaustGone:true,seized:true}});
 assert.equal((svg.match(/dd-hot/g)??[]).length,1);assert.equal((svg.match(/dd-tierod/g)??[]).length,1);assert.equal((svg.match(/dd-loose-wheel/g)??[]).length,1);
 assert.ok(svg.includes('dd-diff')&&svg.includes('dd-exhaust-gone')&&svg.includes('dd-seized')&&!/NaN|undefined/.test(svg));
 const lost=damageDiagramSvg({...base,wheelLost:[0,0,0,1],faults:{hotDiscs:[0,0,0,1],looseWheels:[0,0,0,1]}});
 assert.ok(!lost.includes('dd-hot')&&!lost.includes('dd-loose-wheel'),'a wheel that is gone shows no wheel faults');
 assert.ok(!damageDiagramSvg(base).includes('dd-hot'),'no fault layer without faults');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {constructionRole} from '../src/vehicle-construction';
test('the hand-built classics engines count as engines, so they can drop out; frames and fittings do not',()=>{
 for(const n of ['Structure Tordal inline four','Structure Alder longitudinal inline four','Structure Morrow longitudinal V8','Structure Hollins V8 block','Structure Hollins V8 cover','Structure Kite transverse engine','Structure Fernleigh transverse four','Structure Pipit rear twin','Structure Saber twin-cam inline four','Structure Tordal air cleaner','Structure engine block Regent'])
  assert.equal(constructionRole(n),'engine',n);
 for(const [n,role] of [['Structure Ravine engine cradle ','skin'],['Structure Tordal battery','skin'],['Structure Tordal longitudinal rail','rail'],['Structure Tordal floor','skin']] as const)assert.equal(constructionRole(n),role,n);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {hoodFlip} from '../src/wreck-attachments';
test('a nearly torn-off bonnet flips back over the screen at speed; a hanging one only lifts; slowing lets it fall back',()=>{
 assert.equal(hoodFlip(30,.5),0,'merely loose: wind lift only');
 assert.equal(hoodFlip(15,1),0,'too slow');
 assert.equal(hoodFlip(30,1),1,'fully folded');
 assert.ok(hoodFlip(24,.9)>0&&hoodFlip(24,.9)<1);
 assert.equal(hoodFlip(-30,1),1,'reversing fast too');
});

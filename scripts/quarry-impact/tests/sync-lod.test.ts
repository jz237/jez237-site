import test from 'node:test';
import assert from 'node:assert/strict';
import {SYNC_LOD,syncInterval,syncDue} from '../src/vehicle-draw-batch';
test('near cars sync every frame, mid-range every 2nd, far every 4th',()=>{
 assert.equal(syncInterval(10),1);assert.equal(syncInterval(SYNC_LOD.mid),1);assert.equal(syncInterval(SYNC_LOD.mid+1),2);assert.equal(syncInterval(SYNC_LOD.far+1),4);assert.equal(syncInterval(NaN),1,'unknown distance: always');
});
test('skipped frames are staggered across cars and every car still syncs within its interval',()=>{
 for(const interval of [1,2,4])for(let id=0;id<6;id++){let n=0;for(let f=0;f<interval*10;f++)if(syncDue(f,id,interval))n++;assert.equal(n,10);}
 assert.notEqual(syncDue(0,0,4),syncDue(0,1,4));
});

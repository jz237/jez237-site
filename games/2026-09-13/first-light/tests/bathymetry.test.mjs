import test from 'node:test';import assert from 'node:assert/strict';
import {encodeHeight,decodeHeight,buildTerrainData,sampleGrid} from '../bathymetry.js';
import {coveHeight,worldFromFrame,halfWidth,shorePoint,AXIS_LENGTH,COVE_FEATURES} from '../lake-shape.js';
test('height encoding round-trips within a centimetre across the range',()=>{for(let h=-15;h<40;h+=.37){const [r,g]=encodeHeight(h);assert.ok(Math.abs(decodeHeight(r,g)-h)<.01,'h '+h);}});
test('the cove is deep at the open lake, shallow at the creek and dry on shore',()=>{
 const open=worldFromFrame(20,0),creek=worldFromFrame(AXIS_LENGTH-20,0),north=worldFromFrame(120,-(halfWidth(120,-1)+25)),south=worldFromFrame(150,halfWidth(150,1)+25);
 assert.ok(coveHeight(open.x,open.z)<-8);assert.ok(coveHeight(creek.x,creek.z)>-2.5&&coveHeight(creek.x,creek.z)<0);
 assert.ok(coveHeight(north.x,north.z)>3,'north shore climbs');assert.ok(coveHeight(south.x,south.z)>0&&coveHeight(south.x,south.z)<8,'south shore is gentle');
 const flat=worldFromFrame(150,halfWidth(150,1)*.6);assert.ok(coveHeight(flat.x,flat.z)<-2&&coveHeight(flat.x,flat.z)>-4.5,'weed flat 2-4.5 m');
 const dock=shorePoint(COVE_FEATURES.dock.u,1,-2);assert.ok(coveHeight(dock.x,dock.z)>0);
});
test('terrain data encodes the analytic bed and openness grows toward open water',()=>{
 const t=buildTerrainData(128);const k=(x,z)=>{const i=Math.round((x/t.span+.5)*(t.res-1)),j=Math.round((z/t.span+.5)*(t.res-1));return j*t.res+i;};
 const open=worldFromFrame(30,0),creek=worldFromFrame(AXIS_LENGTH-30,0);
 assert.ok(Math.abs(decodeHeight(t.data[k(open.x,open.z)*4],t.data[k(open.x,open.z)*4+1])-t.heights[k(open.x,open.z)])<.05);
 assert.ok(t.openness[k(open.x,open.z)]>t.openness[k(creek.x,creek.z)]);
 assert.ok(t.openness[k(open.x,open.z)]>60,'open water is far from shore: '+t.openness[k(open.x,open.z)]);
 const grid=Object.assign(t.openness,{res:t.res,span:t.span});assert.ok(Math.abs(sampleGrid(grid,open.x,open.z)-t.openness[k(open.x,open.z)])<6);
});
test('shore distance is measured on land too and grows away from the bank',()=>{
 const t=buildTerrainData(128);const k=(x,z)=>{const i=Math.round((x/t.span+.5)*(t.res-1)),j=Math.round((z/t.span+.5)*(t.res-1));return j*t.res+i;};
 const near=worldFromFrame(150,halfWidth(150,1)+6),far=worldFromFrame(150,halfWidth(150,1)+90);
 assert.ok(t.heights[k(near.x,near.z)]>0&&t.heights[k(far.x,far.z)]>0);
 assert.ok(t.shoreDist[k(near.x,near.z)]<15,'near bank '+t.shoreDist[k(near.x,near.z)]);
 assert.ok(t.shoreDist[k(far.x,far.z)]>60,'far bank '+t.shoreDist[k(far.x,far.z)]);
 assert.equal(t.data[k(far.x,far.z)*4+2],0,'land has no openness');
});

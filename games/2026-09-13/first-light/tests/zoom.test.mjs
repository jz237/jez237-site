import test from 'node:test';import assert from 'node:assert/strict';
import {clampZoom,pinchZoom,wheelZoom,fovFor,ZOOM_MIN,ZOOM_MAX} from '../angler-camera.js';
import {adaptiveQuality,QUALITY_LEVELS} from '../adaptive-quality.js';
test('zoom: a pinch scales by the finger spread, the wheel steps it, and both stay inside the stops',()=>{
 assert.equal(clampZoom(.4),ZOOM_MIN);assert.equal(clampZoom(9),ZOOM_MAX);
 assert.ok(Math.abs(pinchZoom(1,100,200)-2)<1e-9,'fingers twice as far apart doubles the zoom');
 assert.ok(Math.abs(pinchZoom(2,200,100)-1)<1e-9,'and back again');
 assert.equal(pinchZoom(2,0,150),2,'a spread of nothing changes nothing');
 assert.equal(pinchZoom(1,150,0),1);
 assert.equal(pinchZoom(3,100,400),ZOOM_MAX,'clamped at the far stop');
 assert.ok(wheelZoom(1,-100)>1&&wheelZoom(2,100)<2,'the wheel zooms in scrolling up, out scrolling down');
 assert.equal(wheelZoom(1,500),ZOOM_MIN,'never below the base view');
 assert.ok(Math.abs(fovFor(72,1)-72)<1e-9&&Math.abs(fovFor(72,2)-36)<1e-9,'the field of view is the base over the zoom');
 assert.ok(fovFor(72,ZOOM_MAX)>20,'the narrowest view is still wider than a rifle scope');
});
test('the ultra tier sits above high and only a desktop may climb to it',()=>{
 assert.deepEqual(QUALITY_LEVELS,['saver','low','medium','high','ultra']);
 const fast=()=>({elapsed:99,cooldown:0,fast:99,slow:0});
 assert.equal(adaptiveQuality(fast(),'high',60,8,'ultra'),'ultra','a fast desktop climbs');
 assert.equal(adaptiveQuality(fast(),'high',60,8,'high'),'high','a touch device stops at high');
 assert.equal(adaptiveQuality(fast(),'medium',60,8,'high'),'high','and still climbs to it');
 const slow={elapsed:99,cooldown:0,slow:2,fast:0};
 assert.equal(adaptiveQuality(slow,'ultra',20,8,'ultra'),'high','ultra drops back when it stutters');
});
